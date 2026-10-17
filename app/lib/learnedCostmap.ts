// Learned Clearance Costmap & Neural Potential Field Guidance Engine (cmaes-feat-oa7-costmap).
//
// Implements a lightweight Fourier-feature neural network (MLP <=30k params) combined with
// an analytical harmonic clearance potential field to warm-start CMA-ES and DDP trajectory
// optimization routines and guide humanoid/manipulator agents through open corridors without
// falling into local minima traps.
//
// Mathematical Formulations:
//   - Random Fourier Positional Encoding (Tancik et al. NeurIPS 2020):
//       \gamma(\mathbf{x}) = [\cos(2\pi \mathbf{B} \mathbf{x}), \sin(2\pi \mathbf{B} \mathbf{x})]^T, \quad \mathbf{B} \sim \mathcal{N}(0, \sigma^2)
//   - 2-Layer MLP Clearance Surrogacy:
//       \hat{c}(\mathbf{x}) = \text{Softplus}\left( \mathbf{W}_2 \text{GELU}(\mathbf{W}_1 \gamma(\mathbf{x}) + \mathbf{b}_1) + b_2 \right)
//   - Composite Navigation Potential Field:
//       V(\mathbf{x}, \mathbf{x}_{\text{goal}}) = w_{\text{goal}} \|\mathbf{x} - \mathbf{x}_{\text{goal}}\| + w_{\text{clear}} \cdot \exp\left( -\alpha \cdot d_{\text{SDF}}(\mathbf{x}) \right) + w_{\text{learned}} \hat{c}(\mathbf{x})
//   - Analytical Spatial Gradient:
//       \nabla V(\mathbf{x}) = w_{\text{goal}} \frac{\mathbf{x} - \mathbf{x}_{\text{goal}}}{\|\mathbf{x} - \mathbf{x}_{\text{goal}}\| + \epsilon} - \alpha w_{\text{clear}} \exp(-\alpha d_{\text{SDF}}) \nabla d_{\text{SDF}}(\mathbf{x})
//
// SOTA References:
//   - Tancik et al., "Fourier Features Let Networks Learn High Frequency Functions" (NeurIPS 2020)
//   - Ratliff, Zucker, Bagnell, & Srinivasa, "CHOMP: Covariant Hamiltonian Optimization for Motion Planning" (IJRR 2013)
//   - Choudhury et al., "Adaptive Distance Fields for Fast and Safe Motion Planning" (IEEE RA-L 2021)

export interface CostmapConfig {
  fourierBands?: number; // Number of Fourier frequency bands (default 4)
  hiddenDim?: number; // Hidden layer dimension (default 32)
  goalWeight?: number; // Goal attraction weight (default 1.0)
  obstacleWeight?: number; // Obstacle repulsion weight (default 5.0)
  clearanceSteepness?: number; // Exponential clearance decay \alpha (default 4.0)
  learnedWeight?: number; // Weight on neural clearance surrogate (default 0.2)
  seed?: number; // Weight initialization seed
}

export interface CostmapTrainingSample {
  pos: [number, number];
  targetCost: number;
}

export interface CostmapTrainingReceipt {
  parameterCount: number;
  epochs: number;
  initialTrainMse: number;
  finalTrainMse: number;
  initialHeldOutMse: number;
  finalHeldOutMse: number;
  maxHeldOutAbsError: number;
  isTrained: boolean;
}

export const DEFAULT_COSTMAP_CONFIG: Required<CostmapConfig> = {
  fourierBands: 4,
  hiddenDim: 32,
  goalWeight: 1.0,
  obstacleWeight: 5.0,
  clearanceSteepness: 4.0,
  learnedWeight: 0.2,
  seed: 42,
};

/**
 * Deterministic pseudo-random Gaussian generator for weight matrices.
 */
function seededNormal(seed: number): () => number {
  let s = (seed === 0 ? 0x12345678 : seed) >>> 0;
  return () => {
    // Marsaglia polar method using xorshift32
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

function smoothSoftplus(x: number): number {
  const ax = Math.abs(x);
  return Math.max(x, 0.0) + Math.log1p(Math.exp(-ax));
}

function sigmoid(x: number): number {
  if (x >= 0) {
    const z = Math.exp(-x);
    return 1.0 / (1.0 + z);
  }
  const z = Math.exp(x);
  return z / (1.0 + z);
}

const GELU_K0 = 0.79788456;
const GELU_K1 = 0.044715;

function geluWithDerivative(x: number): { value: number; derivative: number } {
  const x2 = x * x;
  const u = GELU_K0 * (x + GELU_K1 * x * x2);
  const t = Math.tanh(u);
  const value = 0.5 * x * (1.0 + t);
  const sech2 = 1.0 - t * t;
  const du = GELU_K0 * (1.0 + 3.0 * GELU_K1 * x2);
  const derivative = 0.5 * (1.0 + t) + 0.5 * x * sech2 * du;
  return { value, derivative };
}

export class LearnedCostmapEngine {
  public readonly parameterCount: number;
  public isTrained = false;
  private config: Required<CostmapConfig>;
  private B: number[][]; // [fourierBands, 2]
  private W1: number[][]; // [hiddenDim, 2 * fourierBands]
  private b1: number[]; // [hiddenDim]
  private W2: number[]; // [hiddenDim]
  private b2: number;
  private analyticFallbackOnly = false;

  constructor(config: CostmapConfig = {}) {
    this.config = { ...DEFAULT_COSTMAP_CONFIG, ...config };
    if (!Number.isSafeInteger(this.config.fourierBands) || this.config.fourierBands < 1) {
      throw new RangeError("fourierBands must be a positive integer");
    }
    if (!Number.isSafeInteger(this.config.hiddenDim) || this.config.hiddenDim < 1) {
      throw new RangeError("hiddenDim must be a positive integer");
    }
    if (!Number.isFinite(this.config.clearanceSteepness) || this.config.clearanceSteepness <= 0) {
      throw new RangeError("clearanceSteepness must be finite and positive");
    }

    const rand = seededNormal(this.config.seed);

    // Initialize Fourier projection matrix B across multi-scale spatial frequencies
    this.B = [];
    for (let i = 0; i < this.config.fourierBands; i++) {
      const freqScale = 0.35 + 0.25 * (i / Math.max(1, this.config.fourierBands - 1));
      this.B.push([rand() * freqScale, rand() * freqScale]);
    }

    // Initialize MLP weights: W1, b1, W2, b2 (small residual scale on W2 so an untrained
    // network does not overpower the harmonic goal potential before training)
    const inDim = 2 * this.config.fourierBands;
    this.W1 = [];
    this.b1 = [];
    for (let h = 0; h < this.config.hiddenDim; h++) {
      const row: number[] = [];
      for (let j = 0; j < inDim; j++) {
        row.push(rand() * Math.sqrt(2.0 / inDim));
      }
      this.W1.push(row);
      this.b1.push(rand() * 0.05);
    }

    this.W2 = [];
    for (let h = 0; h < this.config.hiddenDim; h++) {
      this.W2.push(rand() * 0.05 * Math.sqrt(2.0 / this.config.hiddenDim));
    }
    this.b2 = 0.1;

    this.parameterCount =
      this.config.fourierBands * 2 +
      this.config.hiddenDim * inDim +
      this.config.hiddenDim +
      this.config.hiddenDim +
      1;
    if (this.parameterCount > 100_000) {
      throw new RangeError(`Costmap parameter count ${this.parameterCount} exceeds 100k limit`);
    }
  }

  /**
   * Computes Fourier positional features for 2D position [x, z].
   */
  public encodePosition(x: number, z: number): number[] {
    const features: number[] = [];
    for (let i = 0; i < this.config.fourierBands; i++) {
      const proj = 2.0 * Math.PI * (this.B[i][0] * x + this.B[i][1] * z);
      features.push(Math.cos(proj));
      features.push(Math.sin(proj));
    }
    return features;
  }

  /**
   * Evaluates the clearance neural surrogate MLP and its exact analytical spatial gradient
   * \nabla \hat{c}(x, z) via chain rule through Softplus, GELU, and Fourier features.
   */
  public evaluateNeuralClearanceWithGradient(
    x: number,
    z: number,
  ): { value: number; gradient: [number, number] } {
    if (this.analyticFallbackOnly) {
      return { value: 0.0, gradient: [0.0, 0.0] };
    }
    const bands = this.config.fourierBands;
    const inDim = 2 * bands;
    const feat = new Array<number>(inDim);
    const dFeatDx = new Array<number>(inDim);
    const dFeatDz = new Array<number>(inDim);

    for (let i = 0; i < bands; i++) {
      const bx = this.B[i][0];
      const bz = this.B[i][1];
      const proj = 2.0 * Math.PI * (bx * x + bz * z);
      const c = Math.cos(proj);
      const s = Math.sin(proj);
      feat[2 * i] = c;
      feat[2 * i + 1] = s;
      dFeatDx[2 * i] = -2.0 * Math.PI * bx * s;
      dFeatDz[2 * i] = -2.0 * Math.PI * bz * s;
      dFeatDx[2 * i + 1] = 2.0 * Math.PI * bx * c;
      dFeatDz[2 * i + 1] = 2.0 * Math.PI * bz * c;
    }

    let output = this.b2;
    const dOutDFeat = new Array<number>(inDim).fill(0.0);

    for (let h = 0; h < this.config.hiddenDim; h++) {
      let act = this.b1[h];
      const row = this.W1[h];
      for (let j = 0; j < inDim; j++) {
        act += row[j] * feat[j];
      }
      const { value: gelu, derivative: dGelu } = geluWithDerivative(act);
      output += this.W2[h] * gelu;
      const w2dGelu = this.W2[h] * dGelu;
      for (let j = 0; j < inDim; j++) {
        dOutDFeat[j] += w2dGelu * row[j];
      }
    }

    const value = smoothSoftplus(output);
    const dSoftplus = sigmoid(output);

    let gradX = 0.0;
    let gradZ = 0.0;
    for (let j = 0; j < inDim; j++) {
      gradX += dSoftplus * dOutDFeat[j] * dFeatDx[j];
      gradZ += dSoftplus * dOutDFeat[j] * dFeatDz[j];
    }

    return {
      value,
      gradient: [gradX, gradZ],
    };
  }

  /**
   * Evaluates the clearance neural surrogate MLP.
   */
  public evaluateNeuralClearance(x: number, z: number): number {
    return this.evaluateNeuralClearanceWithGradient(x, z).value;
  }

  /**
   * Exports a copy of the Fourier frequency matrix B and MLP weights (W1, b1, W2, b2).
   */
  public exportWeights(): {
    B: number[][];
    W1: number[][];
    b1: number[];
    W2: number[];
    b2: number;
  } {
    return {
      B: this.B.map((row) => [...row]),
      W1: this.W1.map((row) => [...row]),
      b1: [...this.b1],
      W2: [...this.W2],
      b2: this.b2,
    };
  }

  /**
   * Loads external MLP weights or falls back to the conservative analytic method if
   * weights are missing, non-finite, or mismatched in dimension.
   */
  public loadWeightsOrFallback(weights?: {
    B?: number[][];
    W1: number[][];
    b1: number[];
    W2: number[];
    b2: number;
  }): boolean {
    const bands = this.config.fourierBands;
    const inDim = 2 * bands;
    const hidden = this.config.hiddenDim;
    const bInvalid =
      weights?.B !== undefined &&
      (!Array.isArray(weights.B) ||
        weights.B.length !== bands ||
        weights.B.some(
          (row) => !Array.isArray(row) || row.length !== 2 || !row.every(Number.isFinite),
        ));
    if (
      !weights ||
      bInvalid ||
      !Array.isArray(weights.W1) ||
      weights.W1.length !== hidden ||
      weights.W1.some(
        (row) => !Array.isArray(row) || row.length !== inDim || !row.every(Number.isFinite),
      ) ||
      !Array.isArray(weights.b1) ||
      weights.b1.length !== hidden ||
      !weights.b1.every(Number.isFinite) ||
      !Array.isArray(weights.W2) ||
      weights.W2.length !== hidden ||
      !weights.W2.every(Number.isFinite) ||
      !Number.isFinite(weights.b2)
    ) {
      this.analyticFallbackOnly = true;
      this.isTrained = false;
      return false;
    }

    if (weights.B !== undefined) {
      this.B = weights.B.map((row) => [...row]);
    }
    this.W1 = weights.W1.map((row) => [...row]);
    this.b1 = [...weights.b1];
    this.W2 = [...weights.W2];
    this.b2 = weights.b2;
    this.analyticFallbackOnly = false;
    this.isTrained = true;
    return true;
  }

  /**
   * Fits the Fourier-feature MLP to supervised clearance/navigation cost samples
   * and evaluates held-out approximation error on a disjoint sample set.
   */
  public fitToSdfField(
    trainSamples: CostmapTrainingSample[],
    heldOutSamples: CostmapTrainingSample[],
    options: { epochs?: number; learningRate?: number } = {},
  ): CostmapTrainingReceipt {
    if (trainSamples.length === 0 || heldOutSamples.length === 0) {
      throw new Error("fitToSdfField requires non-empty trainSamples and heldOutSamples");
    }
    this.analyticFallbackOnly = false;
    const epochs = options.epochs ?? 80;
    const lr = options.learningRate ?? 0.08;
    const momentum = 0.85;
    const bands = this.config.fourierBands;
    const inDim = 2 * bands;
    const hidden = this.config.hiddenDim;

    const evalMse = (samples: CostmapTrainingSample[]) => {
      let sq = 0.0;
      let maxAbs = 0.0;
      for (const s of samples) {
        const pred = this.evaluateNeuralClearance(s.pos[0], s.pos[1]);
        const err = Math.abs(pred - s.targetCost);
        sq += err * err;
        if (err > maxAbs) maxAbs = err;
      }
      return { mse: sq / samples.length, maxAbs };
    };

    const initialTrain = evalMse(trainSamples);
    const initialHeldOut = evalMse(heldOutSamples);

    const vW1 = Array.from({ length: hidden }, () => new Float64Array(inDim));
    const vb1 = new Float64Array(hidden);
    const vW2 = new Float64Array(hidden);
    const vB = Array.from({ length: bands }, () => new Float64Array(2));
    let vb2 = 0.0;

    for (let ep = 0; ep < epochs; ep++) {
      const dW1 = Array.from({ length: hidden }, () => new Float64Array(inDim));
      const db1 = new Float64Array(hidden);
      const dW2 = new Float64Array(hidden);
      const dB = Array.from({ length: bands }, () => new Float64Array(2));
      let db2 = 0.0;

      for (const sample of trainSamples) {
        const [x, z] = sample.pos;
        const feat = this.encodePosition(x, z);
        const geluVals = new Float64Array(hidden);
        const dGeluVals = new Float64Array(hidden);
        let output = this.b2;

        for (let h = 0; h < hidden; h++) {
          let act = this.b1[h];
          const row = this.W1[h];
          for (let j = 0; j < inDim; j++) act += row[j] * feat[j];
          const { value, derivative } = geluWithDerivative(act);
          geluVals[h] = value;
          dGeluVals[h] = derivative;
          output += this.W2[h] * value;
        }

        const pred = smoothSoftplus(output);
        const dLossDOut = (pred - sample.targetCost) * sigmoid(output);
        db2 += dLossDOut;

        const dFeat = new Float64Array(inDim);
        for (let h = 0; h < hidden; h++) {
          dW2[h] += dLossDOut * geluVals[h];
          const dAct = dLossDOut * this.W2[h] * dGeluVals[h];
          db1[h] += dAct;
          for (let j = 0; j < inDim; j++) {
            dW1[h][j] += dAct * feat[j];
            dFeat[j] += dAct * this.W1[h][j];
          }
        }

        for (let i = 0; i < bands; i++) {
          const c = feat[2 * i];
          const s = feat[2 * i + 1];
          const dProj = 2.0 * Math.PI * (-dFeat[2 * i] * s + dFeat[2 * i + 1] * c);
          dB[i][0] += dProj * x;
          dB[i][1] += dProj * z;
        }
      }

      const invN = 1.0 / trainSamples.length;
      vb2 = momentum * vb2 + lr * db2 * invN;
      this.b2 -= vb2;
      for (let h = 0; h < hidden; h++) {
        vW2[h] = momentum * vW2[h] + lr * dW2[h] * invN;
        this.W2[h] -= vW2[h];
        vb1[h] = momentum * vb1[h] + lr * db1[h] * invN;
        this.b1[h] -= vb1[h];
        for (let j = 0; j < inDim; j++) {
          vW1[h][j] = momentum * vW1[h][j] + lr * dW1[h][j] * invN;
          this.W1[h][j] -= vW1[h][j];
        }
      }
      for (let i = 0; i < bands; i++) {
        vB[i][0] = momentum * vB[i][0] + 0.15 * lr * dB[i][0] * invN;
        vB[i][1] = momentum * vB[i][1] + 0.15 * lr * dB[i][1] * invN;
        this.B[i][0] -= vB[i][0];
        this.B[i][1] -= vB[i][1];
      }
    }

    this.isTrained = true;
    const finalTrain = evalMse(trainSamples);
    const finalHeldOut = evalMse(heldOutSamples);

    return {
      parameterCount: this.parameterCount,
      epochs,
      initialTrainMse: initialTrain.mse,
      finalTrainMse: finalTrain.mse,
      initialHeldOutMse: initialHeldOut.mse,
      finalHeldOutMse: finalHeldOut.mse,
      maxHeldOutAbsError: finalHeldOut.maxAbs,
      isTrained: this.isTrained,
    };
  }

  /**
   * Evaluates the composite potential field value V(x, goal, sdf) and its exact analytical
   * gradient \nabla V(x, goal, sdf). Uses a C^1-continuous linear continuation inside obstacles
   * (sdfDist < 0) so the obstacle penalty and its gradient agree everywhere.
   */
  public evaluatePotential(
    position: [number, number],
    goal: [number, number],
    sdfEvaluator: (pos: [number, number]) => { distance: number; gradient: [number, number] },
  ): {
    totalPotential: number;
    goalDistance: number;
    obstaclePenalty: number;
    learnedClearance: number;
    gradient: [number, number];
  } {
    const dx = position[0] - goal[0];
    const dz = position[1] - goal[1];
    const goalDist = Math.hypot(dx, dz);

    const { distance: sdfDist, gradient: sdfGrad } = sdfEvaluator(position);

    // C^1-continuous obstacle barrier:
    //   sdfDist >= 0: w_obs * exp(-alpha * sdfDist), derivative = -alpha * obsPenalty * sdfGrad
    //   sdfDist <  0: w_obs * (1 - alpha * sdfDist), derivative = -alpha * w_obs * sdfGrad
    const alpha = this.config.clearanceSteepness;
    const wObs = this.config.obstacleWeight;
    const obsPenalty =
      sdfDist >= 0.0 ? wObs * Math.exp(-alpha * sdfDist) : wObs * (1.0 - alpha * sdfDist);
    const dObsDdist = sdfDist >= 0.0 ? -alpha * obsPenalty : -alpha * wObs;

    const wLearned = this.analyticFallbackOnly ? 0.0 : this.config.learnedWeight;
    const neural = this.evaluateNeuralClearanceWithGradient(position[0], position[1]);
    const learned = wLearned * neural.value;
    const totalPotential = this.config.goalWeight * goalDist + obsPenalty + learned;

    const unitGoalX = goalDist > 1e-8 ? dx / goalDist : 0;
    const unitGoalZ = goalDist > 1e-8 ? dz / goalDist : 0;

    const gradX =
      this.config.goalWeight * unitGoalX + dObsDdist * sdfGrad[0] + wLearned * neural.gradient[0];
    const gradZ =
      this.config.goalWeight * unitGoalZ + dObsDdist * sdfGrad[1] + wLearned * neural.gradient[1];

    return {
      totalPotential,
      goalDistance: goalDist,
      obstaclePenalty: obsPenalty,
      learnedClearance: learned,
      gradient: [gradX, gradZ],
    };
  }

  /**
   * Generates a warm-start waypoint trajectory from start to goal guided by the learned potential field.
   */
  public generateWarmStartTrajectory(
    start: [number, number],
    goal: [number, number],
    sdfEvaluator: (pos: [number, number]) => { distance: number; gradient: [number, number] },
    numSteps = 20,
    stepSize = 0.25,
  ): Array<[number, number]> {
    const trajectory: Array<[number, number]> = [[start[0], start[1]]];
    let current: [number, number] = [start[0], start[1]];

    for (let step = 0; step < numSteps; step++) {
      const distToGoal = Math.hypot(current[0] - goal[0], current[1] - goal[1]);
      if (distToGoal <= stepSize) {
        if (distToGoal > 1e-9) {
          trajectory.push([goal[0], goal[1]]);
        }
        break;
      }

      const { gradient } = this.evaluatePotential(current, goal, sdfEvaluator);
      const gradNorm = Math.hypot(gradient[0], gradient[1]) || 1e-5;

      // Gradient descent step: x_{k+1} = x_k - stepSize * (\nabla V / ||\nabla V||)
      const nextX = current[0] - stepSize * (gradient[0] / gradNorm);
      const nextZ = current[1] - stepSize * (gradient[1] / gradNorm);

      current = [nextX, nextZ];
      trajectory.push([nextX, nextZ]);
    }

    return trajectory;
  }
}
