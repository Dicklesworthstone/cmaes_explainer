/**
 * High-Dimensional N-D CMA-ES Engine with 3D PCA Phase-Space Projection
 *
 * Implements:
 * 1. Full N-Dimensional Covariance Matrix Adaptation Evolution Strategy (Hansen 2016).
 * 2. Exact Jacobi Symmetric Eigendecomposition (O(N^3) stable rotation).
 * 3. 3D Principal Component Analysis (PCA) projection of the N-dimensional Gaussian
 *    distribution N(m, sigma^2 C) down to 3D phase space.
 * 4. Real-time 3D Covariance Ellipsoid parameter extraction (radii, orientation, elite cloud).
 */

export type VectorND = number[];
export type MatrixND = number[][];

export function createZeroVector(dim: number): VectorND {
  return new Array(dim).fill(0);
}

export function createZeroMatrix(dim: number): MatrixND {
  return Array.from({ length: dim }, () => new Array(dim).fill(0));
}

export function createIdentityMatrix(dim: number): MatrixND {
  const m = createZeroMatrix(dim);
  for (let i = 0; i < dim; i++) m[i][i] = 1;
  return m;
}

export function cloneVector(v: VectorND): VectorND {
  return [...v];
}

export function cloneMatrix(m: MatrixND): MatrixND {
  return m.map((r) => [...r]);
}

export function vecDot(a: VectorND, b: VectorND): number {
  let sum = 0;
  const n = a.length;
  for (let i = 0; i < n; i++) sum += a[i] * b[i];
  return sum;
}

export function vecNorm(a: VectorND): number {
  return Math.sqrt(Math.max(0, vecDot(a, a)));
}

export function matVecMult(m: MatrixND, v: VectorND): VectorND {
  const dim = m.length;
  const vLen = v.length;
  const res = new Array(dim);
  for (let i = 0; i < dim; i++) {
    let sum = 0;
    const row = m[i];
    for (let j = 0; j < vLen; j++) {
      sum += row[j] * v[j];
    }
    res[i] = sum;
  }
  return res;
}

export function matMult(a: MatrixND, b: MatrixND): MatrixND {
  const n = a.length;
  const res: MatrixND = new Array(n);
  for (let i = 0; i < n; i++) {
    const row = new Array(n);
    const aRow = a[i];
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += aRow[k] * b[k][j];
      }
      row[j] = sum;
    }
    res[i] = row;
  }
  return res;
}

/**
 * Classical Jacobi Eigenvalue Algorithm for symmetric matrices C = C^T
 * Computes all eigenvalues and orthogonal eigenvector matrix V such that C = V * diag(eigenvalues) * V^T.
 * Uses flat Float64Array memory layout for cache locality and cyclic threshold sweeps.
 */
export function jacobiEigenSymmetric(matrix: MatrixND, maxIter = 50, tol = 1e-12): {
  eigenvalues: number[];
  eigenvectors: MatrixND; // Columns are eigenvectors
} {
  const n = matrix.length;
  const A = new Float64Array(n * n);
  const V = new Float64Array(n * n);

  for (let i = 0; i < n; i++) {
    const row = matrix[i];
    const offset = i * n;
    for (let j = 0; j < n; j++) {
      A[offset + j] = row[j];
    }
    V[offset + i] = 1.0;
  }

  for (let iter = 0; iter < maxIter; iter++) {
    let maxOffDiag = 0;

    for (let p = 0; p < n - 1; p++) {
      const pOff = p * n;
      for (let q = p + 1; q < n; q++) {
        const qOff = q * n;
        const apq = A[pOff + q];
        const absApq = Math.abs(apq);
        if (absApq > maxOffDiag) maxOffDiag = absApq;

        if (absApq < tol) continue;

        const app = A[pOff + p];
        const aqq = A[qOff + q];
        const phi = (aqq - app) / (2 * apq);
        const t = phi >= 0
          ? 1 / (phi + Math.sqrt(1 + phi * phi))
          : -1 / (-phi + Math.sqrt(1 + phi * phi));

        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;
        const tau = s / (1 + c);

        A[pOff + p] = app - t * apq;
        A[qOff + q] = aqq + t * apq;
        A[pOff + q] = 0;
        A[qOff + p] = 0;

        for (let k = 0; k < n; k++) {
          if (k !== p && k !== q) {
            const kOff = k * n;
            const akp = A[kOff + p];
            const akq = A[kOff + q];
            const newAkp = akp - s * (akq + tau * akp);
            const newAkq = akq + s * (akp - tau * akq);
            A[kOff + p] = newAkp;
            A[pOff + k] = newAkp;
            A[kOff + q] = newAkq;
            A[qOff + k] = newAkq;
          }
        }

        for (let k = 0; k < n; k++) {
          const kOff = k * n;
          const vkp = V[kOff + p];
          const vkq = V[kOff + q];
          V[kOff + p] = vkp - s * (vkq + tau * vkp);
          V[kOff + q] = vkq + s * (vkp - tau * vkq);
        }
      }
    }

    if (maxOffDiag < tol) break;
  }

  const indices = new Int32Array(n);
  for (let i = 0; i < n; i++) indices[i] = i;
  indices.sort((i, j) => Math.max(1e-12, A[j * n + j]) - Math.max(1e-12, A[i * n + i]));

  const sortedEigenvalues: number[] = new Array(n);
  const sortedEigenvectors: MatrixND = Array.from({ length: n }, () => new Array(n));

  for (let j = 0; j < n; j++) {
    const origCol = indices[j];
    sortedEigenvalues[j] = Math.max(1e-12, A[origCol * n + origCol]);
    for (let i = 0; i < n; i++) {
      sortedEigenvectors[i][j] = V[i * n + origCol];
    }
  }

  return {
    eigenvalues: sortedEigenvalues,
    eigenvectors: sortedEigenvectors
  };
}

/**
 * Computes C^{1/2} and C^{-1/2} from eigendecomposition exploiting matrix symmetry
 */
export function computeCovariancePowers(eigenvalues: number[], eigenvectors: MatrixND): {
  sqrtC: MatrixND;
  invSqrtC: MatrixND;
} {
  const n = eigenvalues.length;
  const sqrtC: MatrixND = Array.from({ length: n }, () => new Array(n).fill(0));
  const invSqrtC: MatrixND = Array.from({ length: n }, () => new Array(n).fill(0));

  const sVals = new Float64Array(n);
  const isVals = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    const s = Math.sqrt(eigenvalues[k]);
    sVals[k] = s;
    isVals[k] = 1 / s;
  }

  for (let i = 0; i < n; i++) {
    const rowEigI = eigenvectors[i];
    const rowSqrt = sqrtC[i];
    const rowInvSqrt = invSqrtC[i];

    for (let j = i; j < n; j++) {
      const rowEigJ = eigenvectors[j];
      let sumSqrt = 0;
      let sumInv = 0;

      for (let k = 0; k < n; k++) {
        const prod = rowEigI[k] * rowEigJ[k];
        sumSqrt += prod * sVals[k];
        sumInv += prod * isVals[k];
      }

      rowSqrt[j] = sumSqrt;
      rowInvSqrt[j] = sumInv;
      if (i !== j) {
        sqrtC[j][i] = sumSqrt;
        invSqrtC[j][i] = sumInv;
      }
    }
  }

  return { sqrtC, invSqrtC };
}

export function sampleGaussian(rng: () => number = Math.random): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function sampleGaussianVectorND(dim: number, rng: () => number = Math.random): VectorND {
  return Array.from({ length: dim }, () => sampleGaussian(rng));
}

// ============================================================================
// N-D Candidate & Generation State
// ============================================================================

export interface CandidateSampleND {
  id: number;
  rawX: VectorND; // Unbounded sample in [0, 1]^N
  x: VectorND; // Repaired sample in [0, 1]^N
  z: VectorND; // N(0, I) white noise sample
  projected3D: [number, number, number]; // 3D PCA projection
  fitness: number;
  trueFitness: number;
  rank: number;
  isElite: boolean;
}

export interface PhaseSpace3DProjection {
  projectedMean: [number, number, number];
  ellipsoidRadii: [number, number, number]; // sigma * sqrt(lambda_1, lambda_2, lambda_3)
  principalAxes3D: [
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ];
  eigenvalues: number[];
  conditionNumber: number;
  varianceExplainedPercent: [number, number, number];
  evolutionPath3D: [number, number, number];
  evolutionPathSigma3D: [number, number, number];
}

export interface CMAESGenerationStateND {
  generation: number;
  mean: VectorND;
  sigma: number;
  covariance: MatrixND;
  pSigma: VectorND;
  pC: VectorND;
  samples: CandidateSampleND[];
  bestFitness: number;
  bestX: VectorND;
  eigenvalues: number[];
  conditionNumber: number;
  evalCount: number;
  phaseSpace3D: PhaseSpace3DProjection;
  variancePerDim: number[];
}

export interface CMAESOptionsND {
  dim: number;
  initialMean?: VectorND;
  initialSigma?: number;
  lambda?: number;
  activeCMA?: boolean;
  seed?: number;
  bounds?: [number, number]; // Defaults to [0, 1]
  repairStrategy?: "clip" | "reflect";
  noiseLevel?: number;
}

export class CMAESOptimizerND {
  readonly dim: number;
  mean: VectorND;
  sigma: number;
  C: MatrixND;
  pSigma: VectorND;
  pC: VectorND;

  readonly lambda: number;
  readonly mu: number;
  readonly weights: number[];
  readonly mueff: number;

  readonly cc: number;
  readonly cs: number;
  readonly c1: number;
  readonly cmu: number;
  readonly damps: number;
  readonly chiN: number;

  readonly activeCMA: boolean;
  readonly bounds: [number, number];
  readonly repairStrategy: "clip" | "reflect";
  readonly noiseLevel: number;

  generation: number = 0;
  evalCount: number = 0;
  bestFitness: number = Infinity;
  bestX: VectorND;
  history: CMAESGenerationStateND[] = [];

  private rng: () => number;

  constructor(
    private objective: (x: VectorND) => number,
    options: CMAESOptionsND
  ) {
    this.dim = options.dim;
    this.mean = options.initialMean ? [...options.initialMean] : new Array(this.dim).fill(0.5);
    this.sigma = options.initialSigma ?? 0.25;
    this.C = createIdentityMatrix(this.dim);
    this.pSigma = createZeroVector(this.dim);
    this.pC = createZeroVector(this.dim);
    this.activeCMA = options.activeCMA ?? true;
    this.bounds = options.bounds ?? [0, 1];
    this.repairStrategy = options.repairStrategy ?? "reflect";
    this.noiseLevel = options.noiseLevel ?? 0;

    const seed = options.seed ?? 4242;
    let s = seed >>> 0;
    this.rng = () => {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 0xffffffff;
    };

    // Population size: lambda = 4 + floor(3 * ln(N))
    this.lambda = options.lambda ?? Math.max(8, 4 + Math.floor(3 * Math.log(this.dim)));
    this.mu = Math.max(1, Math.floor(this.lambda / 2));

    // Recombination weights
    const rawWeights: number[] = [];
    for (let i = 0; i < this.mu; i++) {
      rawWeights.push(Math.log(this.mu + 0.5) - Math.log(i + 1));
    }
    const sumW = rawWeights.reduce((a, b) => a + b, 0);
    this.weights = rawWeights.map((w) => w / sumW);

    const sumSqW = this.weights.reduce((a, b) => a + b * b, 0);
    this.mueff = 1 / sumSqW;

    // Strategy parameters
    this.cc = (4 + this.mueff / this.dim) / (this.dim + 4 + (2 * this.mueff) / this.dim);
    this.cs = (this.mueff + 2) / (this.dim + this.mueff + 5);
    this.c1 = 2 / (Math.pow(this.dim + 1.3, 2) + this.mueff);
    this.cmu = Math.min(
      1 - this.c1,
      (2 * (this.mueff - 2 + 1 / this.mueff)) / (Math.pow(this.dim + 2, 2) + this.mueff)
    );
    this.damps = 1 + 2 * Math.max(0, Math.sqrt((this.mueff - 1) / (this.dim + 1)) - 1) + this.cs;
    this.chiN = Math.sqrt(this.dim) * (1 - 1 / (4 * this.dim) + 1 / (21 * this.dim * this.dim));

    this.bestX = [...this.mean];
  }

  private repair(x: number): number {
    const [min, max] = this.bounds;
    if (this.repairStrategy === "clip") {
      return Math.min(max, Math.max(min, x));
    }
    if (x >= min && x <= max) return x;
    const span = max - min;
    const over = x - min;
    const mod = ((over % span) + span) % span;
    const wraps = Math.floor(over / span);
    return wraps % 2 === 0 ? min + mod : max - mod;
  }

  /**
   * Projects an N-dimensional vector down to 3D space using top 3 PCA eigenvectors
   */
  projectTo3D(v: VectorND, basis: MatrixND): [number, number, number] {
    const p0 = vecDot(v, basis.map((r) => r[0]));
    const p1 = vecDot(v, basis.map((r) => r[1]));
    const p2 = this.dim >= 3 ? vecDot(v, basis.map((r) => r[2])) : 0;
    return [p0, p1, p2];
  }

  /**
   * Executes one full N-D CMA-ES generation step and computes 3D PCA projection
   */
  step(): CMAESGenerationStateND {
    const { eigenvalues, eigenvectors } = jacobiEigenSymmetric(this.C);
    const { sqrtC, invSqrtC } = computeCovariancePowers(eigenvalues, eigenvectors);

    // 1. Sample lambda offspring in N dimensions
    const candidates: CandidateSampleND[] = [];
    for (let i = 0; i < this.lambda; i++) {
      const z = sampleGaussianVectorND(this.dim, this.rng);
      const scaledZ = matVecMult(sqrtC, z);
      const rawX = this.mean.map((m, idx) => m + this.sigma * scaledZ[idx]);
      const x = rawX.map((val) => this.repair(val));

      const trueFitness = this.objective(x);
      const noise = this.noiseLevel > 0 ? sampleGaussian(this.rng) * this.noiseLevel : 0;
      const fitness = trueFitness + noise;
      this.evalCount++;

      const proj3D = this.projectTo3D(x.map((val, idx) => val - this.mean[idx]), eigenvectors);

      candidates.push({
        id: i,
        rawX,
        x,
        z,
        projected3D: proj3D,
        fitness,
        trueFitness,
        rank: 0,
        isElite: false
      });
    }

    // 2. Sort by fitness
    candidates.sort((a, b) => a.fitness - b.fitness);
    candidates.forEach((c, idx) => {
      c.rank = idx;
      c.isElite = idx < this.mu;
    });

    if (candidates[0].trueFitness < this.bestFitness) {
      this.bestFitness = candidates[0].trueFitness;
      this.bestX = [...candidates[0].x];
    }

    // 3. Selection & Recombination: update mean
    const oldMean = [...this.mean];
    const newMean = createZeroVector(this.dim);
    for (let i = 0; i < this.mu; i++) {
      const elite = candidates[i];
      for (let d = 0; d < this.dim; d++) {
        newMean[d] += this.weights[i] * elite.x[d];
      }
    }
    this.mean = newMean;

    // Mean displacement vectors
    const meanShift = this.mean.map((m, d) => (m - oldMean[d]) / this.sigma);
    const zMean = matVecMult(invSqrtC, meanShift);

    // 4. Cumulative Step-size Adaptation (CSA) path pSigma
    const pSigmaCoeff = Math.sqrt(this.cs * (2 - this.cs) * this.mueff);
    this.pSigma = this.pSigma.map((ps, d) => (1 - this.cs) * ps + pSigmaCoeff * zMean[d]);
    const normPSigma = vecNorm(this.pSigma);

    // Heaviside stall indicator
    const hsig =
      normPSigma /
        Math.sqrt(1 - Math.pow(1 - this.cs, 2 * (this.generation + 1))) /
        this.chiN <
      1.4 + 2 / (this.dim + 1)
        ? 1
        : 0;

    // Covariance path pC
    const pCCoeff = Math.sqrt(this.cc * (2 - this.cc) * this.mueff);
    this.pC = this.pC.map((pc, d) => (1 - this.cc) * pc + hsig * pCCoeff * meanShift[d]);

    // 5. Covariance matrix adaptation (Rank-1 + Rank-mu + Active update)
    const newC = createZeroMatrix(this.dim);
    const c1Coeff = this.c1;
    const cmuCoeff = this.cmu;
    const oldCoeff = 1 - c1Coeff - cmuCoeff + (1 - hsig) * this.c1 * this.cc * (2 - this.cc);

    for (let r = 0; r < this.dim; r++) {
      for (let c = 0; c < this.dim; c++) {
        let rankMuSum = 0;
        for (let i = 0; i < this.mu; i++) {
          const elite = candidates[i];
          const y_r = (elite.x[r] - oldMean[r]) / this.sigma;
          const y_c = (elite.x[c] - oldMean[c]) / this.sigma;
          rankMuSum += this.weights[i] * y_r * y_c;
        }

        let activeSum = 0;
        if (this.activeCMA) {
          const cActive = this.cmu * 0.4;
          for (let i = this.lambda - this.mu; i < this.lambda; i++) {
            const worst = candidates[i];
            const y_r = (worst.x[r] - oldMean[r]) / this.sigma;
            const y_c = (worst.x[c] - oldMean[c]) / this.sigma;
            const negW = this.weights[this.lambda - 1 - i];
            activeSum -= cActive * negW * y_r * y_c;
          }
        }

        newC[r][c] =
          oldCoeff * this.C[r][c] +
          c1Coeff * this.pC[r] * this.pC[c] +
          cmuCoeff * rankMuSum +
          activeSum;
      }
      newC[r][r] += 1e-10; // Stabilization
    }
    this.C = newC;

    // 6. Update step-size sigma
    this.sigma = this.sigma * Math.exp((this.cs / this.damps) * (normPSigma / this.chiN - 1));
    this.sigma = Math.min(5.0, Math.max(1e-8, this.sigma));

    this.generation++;

    // Compute updated eigensystem for PCA projection
    const updatedEigen = jacobiEigenSymmetric(this.C);
    const condNum = updatedEigen.eigenvalues[0] / Math.max(1e-12, updatedEigen.eigenvalues[this.dim - 1]);

    const totalVar = updatedEigen.eigenvalues.reduce((a, b) => a + b, 0);
    const varPct: [number, number, number] = [
      (updatedEigen.eigenvalues[0] / totalVar) * 100,
      ((updatedEigen.eigenvalues[1] || 0) / totalVar) * 100,
      ((updatedEigen.eigenvalues[2] || 0) / totalVar) * 100
    ];

    const r0 = this.sigma * Math.sqrt(updatedEigen.eigenvalues[0]);
    const r1 = this.sigma * Math.sqrt(updatedEigen.eigenvalues[1] || 1e-4);
    const r2 = this.sigma * Math.sqrt(updatedEigen.eigenvalues[2] || 1e-4);

    const pMean = this.projectTo3D(this.mean, updatedEigen.eigenvectors);
    const pPath = this.projectTo3D(this.pC, updatedEigen.eigenvectors);
    const pSigmaPath = this.projectTo3D(this.pSigma, updatedEigen.eigenvectors);

    const phaseSpace3D: PhaseSpace3DProjection = {
      projectedMean: pMean,
      ellipsoidRadii: [r0, r1, r2],
      principalAxes3D: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      eigenvalues: updatedEigen.eigenvalues,
      conditionNumber: condNum,
      varianceExplainedPercent: varPct,
      evolutionPath3D: pPath,
      evolutionPathSigma3D: pSigmaPath
    };

    const variancePerDim = this.C.map((row, i) => row[i]);

    const state: CMAESGenerationStateND = {
      generation: this.generation,
      mean: [...this.mean],
      sigma: this.sigma,
      covariance: cloneMatrix(this.C),
      pSigma: [...this.pSigma],
      pC: [...this.pC],
      samples: candidates,
      bestFitness: this.bestFitness,
      bestX: [...this.bestX],
      eigenvalues: updatedEigen.eigenvalues,
      conditionNumber: condNum,
      evalCount: this.evalCount,
      phaseSpace3D,
      variancePerDim
    };

    this.history.push(state);
    return state;
  }
}
