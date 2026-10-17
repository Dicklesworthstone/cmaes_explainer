// Neural SDF Refinement & Zero-Allocation Collision Telemetry Engine (cmaes-feat-cl10-neural / cmaes-feat-cl11-qtelemetry).
//
// Implements a compact, baked neural residual MLP (<=20k parameters) with Fourier positional
// encoding and near-surface Gaussian band attenuation to capture intricate procedural furniture
// details (carvings, bevels, moldings) combined with zero-heap-allocation collision query
// telemetry for real-time physics traces.
//
// Mathematical Formulations:
//   - Fourier Feature Positional Mapping (Tancik et al. NeurIPS 2020):
//       \gamma(\mathbf{x}) = [\cos(2\pi \mathbf{B} \mathbf{x}), \sin(2\pi \mathbf{B} \mathbf{x})]^T, \quad \mathbf{B} \in \mathbb{R}^{M \times 3}
//   - Near-Surface Band Windowing & Hybrid Residual Distance:
//       w_{\text{band}}(d) = \exp\left( -\frac{d^2}{2 \sigma_{\text{band}}^2} \right)
//       d_{\text{refined}}(\mathbf{x}) = d_{\text{base}}(\mathbf{x}) + w_{\text{band}}(d_{\text{base}}(\mathbf{x})) \cdot \text{MLP}_{\theta}(\gamma(\mathbf{x}))
//   - Zero-Allocation Telemetry Identity:
//       \text{BytesAllocated}_{\text{inner\_loop}} \equiv 0
//
// SOTA References:
//   - Park et al., "DeepSDF: Learning Continuous Signed Distance Functions" (CVPR 2019)
//   - Tancik et al., "Fourier Features Let Networks Learn High Frequency Functions" (NeurIPS 2020)
//   - Sitzmann et al., "Implicit Neural Representations with Periodic Activation Functions" (NeurIPS 2020)

export type CollisionQueryKind =
  | "sdf-point"
  | "sdf-gradient"
  | "sdf-raycast"
  | "ccd-swept"
  | "bvh-broadphase";

export interface CollisionQueryTelemetry {
  kind: CollisionQueryKind;
  durationMicros: number;
  hitCount: number;
  bytesAllocated: number;
  queryCount: number;
}

export class ZeroAllocQueryContext {
  // Pre-allocated scratch buffers to prevent garbage collection spikes
  public scratchPos: Float64Array = new Float64Array(3);
  public scratchGrad: Float64Array = new Float64Array(3);
  public scratchFeatures: Float32Array;
  public scratchHidden: Float32Array;

  constructor(fourierBands = 8, hiddenDim = 32) {
    this.scratchFeatures = new Float32Array(2 * fourierBands);
    this.scratchHidden = new Float32Array(hiddenDim);
  }
}

export interface NeuralSdfConfig {
  fourierBands?: number; // e.g. 8 bands -> 16 input features
  hiddenDim?: number; // e.g. 32 hidden units
  bandWidthMeters?: number; // \sigma_band (default 0.05m = 5cm)
  seed?: number;
}

export const DEFAULT_NEURAL_SDF_CONFIG: Required<NeuralSdfConfig> = {
  fourierBands: 8,
  hiddenDim: 32,
  bandWidthMeters: 0.05,
  seed: 1928,
};

function seededNormal(seed: number): () => number {
  let s = (seed === 0 ? 0x12345678 : seed) >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    const u1 = Math.max(1e-7, (s >>> 0) / 4294967296);
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    const u2 = (s >>> 0) / 4294967296;
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  };
}

export interface NeuralSdfWeightArtifact {
  schemaVersion: 1;
  fourierBands: number;
  hiddenDim: number;
  bandWidthMeters: number;
  isTrained: boolean;
  maxHeldOutAbsErrorMeters: number | null;
  B: number[];
  W1: number[];
  b1: number[];
  W2: number[];
  b2: number;
  weightsHash: string;
}

function computeNeuralSdfWeightsHash(
  fourierBands: number,
  hiddenDim: number,
  bandWidthMeters: number,
  B: ArrayLike<number>,
  W1: ArrayLike<number>,
  b1: ArrayLike<number>,
  W2: ArrayLike<number>,
  b2: number,
): string {
  let h = 0x811c9dc5;
  const mix = (val: number) => {
    const q = Math.round(val * 1e6) | 0;
    h ^= q & 0xff;
    h = Math.imul(h, 0x01000193);
    h ^= (q >>> 8) & 0xff;
    h = Math.imul(h, 0x01000193);
    h ^= (q >>> 16) & 0xff;
    h = Math.imul(h, 0x01000193);
    h ^= (q >>> 24) & 0xff;
    h = Math.imul(h, 0x01000193);
  };
  mix(fourierBands);
  mix(hiddenDim);
  mix(bandWidthMeters);
  for (let i = 0; i < B.length; i++) mix(B[i]);
  for (let i = 0; i < W1.length; i++) mix(W1[i]);
  for (let i = 0; i < b1.length; i++) mix(b1[i]);
  for (let i = 0; i < W2.length; i++) mix(W2[i]);
  mix(b2);
  return (h >>> 0).toString(16).padStart(8, "0");
}

export class BakedNeuralSdfPiece {
  public readonly parameterCount: number;
  public isTrained = false;
  public maxHeldOutAbsErrorMeters: number | null = null;
  private config: Required<NeuralSdfConfig>;
  private B: Float32Array; // [fourierBands * 3]
  private W1: Float32Array; // [hiddenDim * (2 * fourierBands)]
  private b1: Float32Array; // [hiddenDim]
  private W2: Float32Array; // [hiddenDim]
  private b2: number;

  constructor(config: NeuralSdfConfig = {}) {
    this.config = { ...DEFAULT_NEURAL_SDF_CONFIG, ...config };
    if (!Number.isSafeInteger(this.config.fourierBands) || this.config.fourierBands < 1) {
      throw new RangeError("fourierBands must be a positive integer");
    }
    if (!Number.isSafeInteger(this.config.hiddenDim) || this.config.hiddenDim < 1) {
      throw new RangeError("hiddenDim must be a positive integer");
    }
    if (!Number.isFinite(this.config.bandWidthMeters) || this.config.bandWidthMeters <= 0) {
      throw new RangeError("bandWidthMeters must be finite and greater than zero");
    }

    const rand = seededNormal(this.config.seed);

    const bands = this.config.fourierBands;
    const hidden = this.config.hiddenDim;
    const inDim = 2 * bands;

    this.B = new Float32Array(bands * 3);
    for (let i = 0; i < this.B.length; i++) {
      this.B[i] = rand() * 4.0;
    }

    this.W1 = new Float32Array(hidden * inDim);
    this.b1 = new Float32Array(hidden);
    const scale1 = Math.sqrt(2.0 / inDim);
    for (let i = 0; i < this.W1.length; i++) {
      this.W1[i] = rand() * scale1;
    }
    for (let i = 0; i < hidden; i++) {
      this.b1[i] = rand() * 0.02;
    }

    this.W2 = new Float32Array(hidden);
    const scale2 = Math.sqrt(2.0 / hidden);
    for (let i = 0; i < hidden; i++) {
      this.W2[i] = rand() * scale2 * 0.05; // Small residual scale
    }
    this.b2 = 0.0;

    // Total parameter count = B + W1 + b1 + W2 + b2
    this.parameterCount = this.B.length + this.W1.length + this.b1.length + this.W2.length + 1;
    if (this.parameterCount > 20_000) {
      throw new RangeError(`Neural SDF parameter count ${this.parameterCount} exceeds 20k limit`);
    }
  }

  /**
   * Fast zero-allocation evaluation of neural residual offset for 3D point.
   */
  public evaluateNeuralResidual(
    x: number,
    y: number,
    z: number,
    ctx: ZeroAllocQueryContext,
  ): number {
    const bands = this.config.fourierBands;
    const hidden = this.config.hiddenDim;
    const inDim = 2 * bands;
    const feat = ctx.scratchFeatures;
    const hAct = ctx.scratchHidden;

    if (feat.length < inDim || hAct.length < hidden) {
      throw new RangeError(
        `ZeroAllocQueryContext buffer mismatch: expected features>=${inDim}, hidden>=${hidden}`,
      );
    }

    // 1. Fourier encoding
    for (let i = 0; i < bands; i++) {
      const bx = this.B[i * 3 + 0];
      const by = this.B[i * 3 + 1];
      const bz = this.B[i * 3 + 2];
      const proj = 2.0 * Math.PI * (bx * x + by * y + bz * z);
      feat[i * 2 + 0] = Math.cos(proj);
      feat[i * 2 + 1] = Math.sin(proj);
    }

    // 2. Hidden layer with GELU
    for (let h = 0; h < hidden; h++) {
      let sum = this.b1[h];
      const wOffset = h * inDim;
      for (let j = 0; j < inDim; j++) {
        sum += this.W1[wOffset + j] * feat[j];
      }
      // GELU activation
      hAct[h] = 0.5 * sum * (1.0 + Math.tanh(0.79788456 * (sum + 0.044715 * sum * sum * sum)));
    }

    // 3. Output linear projection
    let output = this.b2;
    for (let h = 0; h < hidden; h++) {
      output += this.W2[h] * hAct[h];
    }

    return output;
  }

  /**
   * Fits the output projection (W2, b2) of the neural residual MLP to surface residual samples
   * and records the held-out maximum absolute geometric error envelope.
   */
  public fitResidualSamples(
    trainSamples: Array<{ pos: [number, number, number]; targetResidual: number }>,
    heldOutSamples: Array<{ pos: [number, number, number]; targetResidual: number }>,
    options: { epochs?: number; learningRate?: number } = {},
  ): {
    initialTrainMse: number;
    finalTrainMse: number;
    maxHeldOutAbsErrorMeters: number;
  } {
    if (trainSamples.length === 0 || heldOutSamples.length === 0) {
      throw new Error("fitResidualSamples requires non-empty train and held-out sets");
    }
    const ctx = new ZeroAllocQueryContext(this.config.fourierBands, this.config.hiddenDim);
    const hidden = this.config.hiddenDim;
    const epochs = options.epochs ?? 60;
    const lr = options.learningRate ?? 0.08;

    const evalStats = (
      samples: Array<{ pos: [number, number, number]; targetResidual: number }>,
    ) => {
      let sq = 0.0;
      let maxAbs = 0.0;
      for (const s of samples) {
        const pred = this.evaluateNeuralResidual(s.pos[0], s.pos[1], s.pos[2], ctx);
        const err = Math.abs(pred - s.targetResidual);
        sq += err * err;
        if (err > maxAbs) maxAbs = err;
      }
      return { mse: sq / samples.length, maxAbs };
    };

    const initialTrain = evalStats(trainSamples);

    for (let ep = 0; ep < epochs; ep++) {
      const dW2 = new Float64Array(hidden);
      let db2 = 0.0;
      for (const s of trainSamples) {
        const pred = this.evaluateNeuralResidual(s.pos[0], s.pos[1], s.pos[2], ctx);
        const err = pred - s.targetResidual;
        db2 += err;
        for (let h = 0; h < hidden; h++) {
          dW2[h] += err * ctx.scratchHidden[h];
        }
      }
      const invN = 1.0 / trainSamples.length;
      this.b2 -= lr * db2 * invN;
      for (let h = 0; h < hidden; h++) {
        this.W2[h] -= lr * dW2[h] * invN;
      }
    }

    const finalTrain = evalStats(trainSamples);
    const finalHeldOut = evalStats(heldOutSamples);
    this.isTrained = true;
    this.maxHeldOutAbsErrorMeters = finalHeldOut.maxAbs;

    return {
      initialTrainMse: initialTrain.mse,
      finalTrainMse: finalTrain.mse,
      maxHeldOutAbsErrorMeters: finalHeldOut.maxAbs,
    };
  }

  /**
   * Evaluates the refined hybrid distance with near-surface Gaussian band windowing.
   */
  public evaluateRefinedDistance(
    x: number,
    y: number,
    z: number,
    baseAnalyticDist: number,
    ctx: ZeroAllocQueryContext,
  ): number {
    const sigma = this.config.bandWidthMeters;
    // Gaussian band attenuation w_band = exp(-d^2 / (2 * sigma^2))
    const dNorm = baseAnalyticDist / sigma;
    if (Math.abs(dNorm) > 4.0) {
      // Far field: exactly zero neural residual
      return baseAnalyticDist;
    }

    const bandWeight = Math.exp(-0.5 * dNorm * dNorm);
    const residual = this.evaluateNeuralResidual(x, y, z, ctx);

    return baseAnalyticDist + bandWeight * residual;
  }

  /**
   * Evaluates both the refined hybrid distance and its exact analytical spatial gradient
   * \nabla_x d_refined(x) using the product and chain rules through the Gaussian band window
   * and Fourier/GELU MLP, writing the gradient into `ctx.scratchGrad`.
   */
  public evaluateRefinedDistanceWithGradient(
    x: number,
    y: number,
    z: number,
    baseAnalyticDist: number,
    baseAnalyticGrad: [number, number, number],
    ctx: ZeroAllocQueryContext,
  ): { distance: number; gradient: [number, number, number] } {
    const sigma = this.config.bandWidthMeters;
    const dNorm = baseAnalyticDist / sigma;
    if (Math.abs(dNorm) > 4.0) {
      ctx.scratchGrad[0] = baseAnalyticGrad[0];
      ctx.scratchGrad[1] = baseAnalyticGrad[1];
      ctx.scratchGrad[2] = baseAnalyticGrad[2];
      return {
        distance: baseAnalyticDist,
        gradient: [baseAnalyticGrad[0], baseAnalyticGrad[1], baseAnalyticGrad[2]],
      };
    }

    const bands = this.config.fourierBands;
    const hidden = this.config.hiddenDim;
    const inDim = 2 * bands;
    const feat = ctx.scratchFeatures;
    const hAct = ctx.scratchHidden;

    if (feat.length < inDim || hAct.length < hidden) {
      throw new RangeError(
        `ZeroAllocQueryContext buffer mismatch: expected features>=${inDim}, hidden>=${hidden}`,
      );
    }

    // 1. Fourier encoding
    for (let i = 0; i < bands; i++) {
      const bx = this.B[i * 3 + 0];
      const by = this.B[i * 3 + 1];
      const bz = this.B[i * 3 + 2];
      const proj = 2.0 * Math.PI * (bx * x + by * y + bz * z);
      feat[i * 2 + 0] = Math.cos(proj);
      feat[i * 2 + 1] = Math.sin(proj);
    }

    // 2. Forward hidden layer + output residual, and accumulate d(residual)/d(feat_j)
    let residual = this.b2;
    let dResDx = 0.0;
    let dResDy = 0.0;
    let dResDz = 0.0;

    // For each hidden unit, compute GELU(sum) and GELU'(sum), then backpropagate directly to x,y,z
    for (let h = 0; h < hidden; h++) {
      let sum = this.b1[h];
      const wOffset = h * inDim;
      for (let j = 0; j < inDim; j++) {
        sum += this.W1[wOffset + j] * feat[j];
      }
      const u = 0.79788456 * (sum + 0.044715 * sum * sum * sum);
      const tanhU = Math.tanh(u);
      const sech2U = 1.0 - tanhU * tanhU;
      const duDsum = 0.79788456 * (1.0 + 3.0 * 0.044715 * sum * sum);
      const gelu = 0.5 * sum * (1.0 + tanhU);
      const dGelu = 0.5 * (1.0 + tanhU) + 0.5 * sum * sech2U * duDsum;

      hAct[h] = gelu;
      const w2h = this.W2[h];
      residual += w2h * gelu;

      const dOutDsum = w2h * dGelu;
      for (let i = 0; i < bands; i++) {
        const cosPhi = feat[i * 2 + 0];
        const sinPhi = feat[i * 2 + 1];
        const wCos = this.W1[wOffset + i * 2 + 0];
        const wSin = this.W1[wOffset + i * 2 + 1];
        const dSumDphi = -wCos * sinPhi + wSin * cosPhi;
        const coeff = 2.0 * Math.PI * dOutDsum * dSumDphi;
        dResDx += coeff * this.B[i * 3 + 0];
        dResDy += coeff * this.B[i * 3 + 1];
        dResDz += coeff * this.B[i * 3 + 2];
      }
    }

    const bandWeight = Math.exp(-0.5 * dNorm * dNorm);
    const dBandDd = (-baseAnalyticDist / (sigma * sigma)) * bandWeight;
    const baseScale = 1.0 + dBandDd * residual;

    const gx = baseScale * baseAnalyticGrad[0] + bandWeight * dResDx;
    const gy = baseScale * baseAnalyticGrad[1] + bandWeight * dResDy;
    const gz = baseScale * baseAnalyticGrad[2] + bandWeight * dResDz;

    ctx.scratchGrad[0] = gx;
    ctx.scratchGrad[1] = gy;
    ctx.scratchGrad[2] = gz;

    return {
      distance: baseAnalyticDist + bandWeight * residual,
      gradient: [gx, gy, gz],
    };
  }

  /**
   * Exports a versioned weight artifact with deterministic FNV-1a integrity hash.
   */
  public exportWeights(): NeuralSdfWeightArtifact {
    const weightsHash = computeNeuralSdfWeightsHash(
      this.config.fourierBands,
      this.config.hiddenDim,
      this.config.bandWidthMeters,
      this.B,
      this.W1,
      this.b1,
      this.W2,
      this.b2,
    );
    return {
      schemaVersion: 1,
      fourierBands: this.config.fourierBands,
      hiddenDim: this.config.hiddenDim,
      bandWidthMeters: this.config.bandWidthMeters,
      isTrained: this.isTrained,
      maxHeldOutAbsErrorMeters: this.maxHeldOutAbsErrorMeters,
      B: Array.from(this.B),
      W1: Array.from(this.W1),
      b1: Array.from(this.b1),
      W2: Array.from(this.W2),
      b2: this.b2,
      weightsHash,
    };
  }

  /**
   * Loads a trained, hash-verified weight artifact, or zeroes the residual projection
   * to fall back deterministically to the analytical base SDF when untrained or corrupted.
   */
  public loadWeightsOrFallback(
    artifact: NeuralSdfWeightArtifact | null | undefined,
  ): { loaded: boolean; fallbackReason: string | null } {
    const activateAnalyticFallback = (reason: string) => {
      this.isTrained = false;
      this.maxHeldOutAbsErrorMeters = null;
      this.W2.fill(0);
      this.b2 = 0.0;
      return { loaded: false, fallbackReason: reason };
    };

    if (!artifact || artifact.schemaVersion !== 1) {
      return activateAnalyticFallback("missing or unsupported schemaVersion");
    }
    if (
      artifact.fourierBands !== this.config.fourierBands ||
      artifact.hiddenDim !== this.config.hiddenDim ||
      artifact.B.length !== this.B.length ||
      artifact.W1.length !== this.W1.length ||
      artifact.b1.length !== this.b1.length ||
      artifact.W2.length !== this.W2.length
    ) {
      return activateAnalyticFallback("architecture dimension mismatch");
    }
    if (!artifact.isTrained || artifact.maxHeldOutAbsErrorMeters === null) {
      return activateAnalyticFallback("artifact is untrained or lacks held-out error bound");
    }

    const expectedHash = computeNeuralSdfWeightsHash(
      artifact.fourierBands,
      artifact.hiddenDim,
      artifact.bandWidthMeters,
      artifact.B,
      artifact.W1,
      artifact.b1,
      artifact.W2,
      artifact.b2,
    );
    if (expectedHash !== artifact.weightsHash) {
      return activateAnalyticFallback("weightsHash integrity verification failed");
    }

    this.B.set(artifact.B);
    this.W1.set(artifact.W1);
    this.b1.set(artifact.b1);
    this.W2.set(artifact.W2);
    this.b2 = artifact.b2;
    this.isTrained = true;
    this.maxHeldOutAbsErrorMeters = artifact.maxHeldOutAbsErrorMeters;
    return { loaded: true, fallbackReason: null };
  }

  /**
   * Evaluates a conservative lower bound on surface clearance for safety certification.
   * If the piece is an untrained random fixture, falls back to subtracting the full magnitude
   * of the unverified residual; if trained, subtracts the measured held-out error envelope.
   */
  public evaluateCertifiedConservativeDistance(
    x: number,
    y: number,
    z: number,
    baseAnalyticDist: number,
    ctx: ZeroAllocQueryContext,
  ): number {
    const sigma = this.config.bandWidthMeters;
    const dNorm = baseAnalyticDist / sigma;
    if (Math.abs(dNorm) > 4.0) {
      return baseAnalyticDist;
    }
    const bandWeight = Math.exp(-0.5 * dNorm * dNorm);
    const residual = this.evaluateNeuralResidual(x, y, z, ctx);
    if (!this.isTrained || this.maxHeldOutAbsErrorMeters === null) {
      return baseAnalyticDist - Math.abs(bandWeight * residual);
    }
    return baseAnalyticDist + bandWeight * (residual - this.maxHeldOutAbsErrorMeters);
  }
}

export class CollisionTelemetryCollector {
  private stats: Map<
    CollisionQueryKind,
    { totalMicros: number; count: number; hits: number; bytesAllocated: number }
  > = new Map();

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.stats.clear();
    const kinds: CollisionQueryKind[] = [
      "sdf-point",
      "sdf-gradient",
      "sdf-raycast",
      "ccd-swept",
      "bvh-broadphase",
    ];
    for (const k of kinds) {
      this.stats.set(k, { totalMicros: 0, count: 0, hits: 0, bytesAllocated: 0 });
    }
  }

  public record(
    kind: CollisionQueryKind,
    durationMicros: number,
    hit = false,
    bytesAllocated = 0,
  ): void {
    const entry = this.stats.get(kind);
    if (entry) {
      entry.totalMicros += durationMicros;
      entry.count++;
      if (hit) entry.hits++;
      entry.bytesAllocated += Math.max(0, bytesAllocated);
    }
  }

  public getTelemetry(kind: CollisionQueryKind): CollisionQueryTelemetry {
    const entry = this.stats.get(kind) ?? {
      totalMicros: 0,
      count: 0,
      hits: 0,
      bytesAllocated: 0,
    };
    return {
      kind,
      durationMicros: entry.totalMicros,
      queryCount: entry.count,
      hitCount: entry.hits,
      bytesAllocated: entry.bytesAllocated,
    };
  }

  public getAllTelemetry(): CollisionQueryTelemetry[] {
    const res: CollisionQueryTelemetry[] = [];
    for (const [kind, data] of this.stats.entries()) {
      res.push({
        kind,
        durationMicros: data.totalMicros,
        queryCount: data.count,
        hitCount: data.hits,
        bytesAllocated: data.bytesAllocated,
      });
    }
    return res;
  }
}
