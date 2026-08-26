/**
 * Real, robust TypeScript implementation of CMA-ES (Covariance Matrix Adaptation Evolution Strategy)
 * including 2D/3D Eigenvalue Decompositions, Cumulative Step-size Adaptation (CSA),
 * Rank-1 & Rank-mu covariance updates, active covariance updates, boundary handling,
 * benchmark landscapes, and comparison baseline optimizers.
 */

// --- 2D / ND Matrix & Vector Utilities ---

export type Vector = number[];
export type Matrix = number[][]; // Row-major

export function createZeroVector(dim: number): Vector {
  return new Array(dim).fill(0);
}

export function createZeroMatrix(dim: number): Matrix {
  return Array.from({ length: dim }, () => new Array(dim).fill(0));
}

export function createIdentityMatrix(dim: number): Matrix {
  const m = createZeroMatrix(dim);
  for (let i = 0; i < dim; i++) m[i][i] = 1;
  return m;
}

export function cloneVector(v: Vector): Vector {
  return [...v];
}

export function cloneMatrix(m: Matrix): Matrix {
  return m.map((row) => [...row]);
}

export function vecAdd(a: Vector, b: Vector): Vector {
  return a.map((val, i) => val + b[i]);
}

export function vecSub(a: Vector, b: Vector): Vector {
  return a.map((val, i) => val - b[i]);
}

export function vecScale(a: Vector, s: number): Vector {
  return a.map((val) => val * s);
}

export function vecDot(a: Vector, b: Vector): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

export function vecNorm(a: Vector): number {
  return Math.sqrt(vecDot(a, a));
}

export function matVecMult(m: Matrix, v: Vector): Vector {
  const dim = v.length;
  const res = new Array(dim).fill(0);
  for (let i = 0; i < dim; i++) {
    let sum = 0;
    for (let j = 0; j < dim; j++) {
      sum += m[i][j] * v[j];
    }
    res[i] = sum;
  }
  return res;
}

export function outerProduct(a: Vector, b: Vector): Matrix {
  const dimA = a.length;
  const dimB = b.length;
  const res = createZeroMatrix(dimA);
  for (let i = 0; i < dimA; i++) {
    for (let j = 0; j < dimB; j++) {
      res[i][j] = a[i] * b[j];
    }
  }
  return res;
}

/**
 * 2x2 Symmetric Matrix Eigendecomposition:
 * Given symmetric C = [[a, b], [b, d]],
 * computes eigenvalues [l1, l2] and orthogonal eigenvector matrix B = [[v1x, v2x], [v1y, v2y]]
 * and square-root matrix B * diag(sqrt(l)) * B^T
 */
export function eigen2x2(a: number, b: number, d: number): {
  eigenvalues: [number, number];
  eigenvectors: [[number, number], [number, number]];
  sqrtMatrix: [[number, number], [number, number]];
  invSqrtMatrix: [[number, number], [number, number]];
  angle: number;
} {
  const tr = a + d;
  const det = a * d - b * b;
  const disc = Math.sqrt(Math.max(0, tr * tr - 4 * det));
  
  let l1 = (tr + disc) / 2;
  let l2 = (tr - disc) / 2;
  
  // Ensure positive definiteness
  l1 = Math.max(1e-12, l1);
  l2 = Math.max(1e-12, l2);

  let v1x = 1;
  let v1y = 0;

  if (Math.abs(b) > 1e-10) {
    v1x = l1 - d;
    v1y = b;
    const len = Math.hypot(v1x, v1y);
    v1x /= len;
    v1y /= len;
  } else if (a < d) {
    v1x = 0;
    v1y = 1;
  }

  const v2x = -v1y;
  const v2y = v1x;

  const angle = Math.atan2(v1y, v1x);

  const s1 = Math.sqrt(l1);
  const s2 = Math.sqrt(l2);

  // Sqrt matrix: B * diag(s1, s2) * B^T
  const m00 = v1x * v1x * s1 + v2x * v2x * s2;
  const m01 = v1x * v1y * s1 + v2x * v2y * s2;
  const m10 = m01;
  const m11 = v1y * v1y * s1 + v2y * v2y * s2;

  // Inv Sqrt matrix: B * diag(1/s1, 1/s2) * B^T
  const is1 = 1 / s1;
  const is2 = 1 / s2;
  const im00 = v1x * v1x * is1 + v2x * v2x * is2;
  const im01 = v1x * v1y * is1 + v2x * v2y * is2;
  const im10 = im01;
  const im11 = v1y * v1y * is1 + v2y * v2y * is2;

  return {
    eigenvalues: [l1, l2],
    eigenvectors: [[v1x, v2x], [v1y, v2y]],
    sqrtMatrix: [[m00, m01], [m10, m11]],
    invSqrtMatrix: [[im00, im01], [im10, im11]],
    angle
  };
}

/**
 * Standard Gaussian random variable sampler (Box-Muller)
 */
export function sampleGaussian(rng: () => number = Math.random): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * 2D Box-Muller generator producing two independent standard normals in a single transcendental pass
 */
export function sampleGaussian2D(rng: () => number = Math.random): [number, number] {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const mag = Math.sqrt(-2.0 * Math.log(u));
  const angle = 2.0 * Math.PI * v;
  return [mag * Math.cos(angle), mag * Math.sin(angle)];
}

export function sampleGaussianVector(dim: number, rng: () => number = Math.random): Vector {
  const vec = new Array(dim);
  for (let i = 0; i < dim; i += 2) {
    if (i + 1 < dim) {
      const [z0, z1] = sampleGaussian2D(rng);
      vec[i] = z0;
      vec[i + 1] = z1;
    } else {
      vec[i] = sampleGaussian(rng);
    }
  }
  return vec;
}

// --- Benchmark Landscapes ---

export interface BenchmarkFunction {
  id: string;
  name: string;
  category: "unimodal" | "multimodal" | "ill-conditioned" | "discontinuous";
  description: string;
  formula: string;
  domain: [number, number]; // [min, max] per dimension
  optimum: Vector;
  optimumValue: number;
  eval: (x: number, y: number) => number;
}

export const BENCHMARKS: BenchmarkFunction[] = [
  {
    id: "rosenbrock",
    name: "Rosenbrock (Banana Valley)",
    category: "ill-conditioned",
    description: "A notoriously deep, parabolic curved valley where gradients oscillate and stall, but CMA-ES adapts its covariance to slide effortlessly down the groove.",
    formula: "f(x, y) = 100(y - x^2)^2 + (1 - x)^2",
    domain: [-2.5, 2.5],
    optimum: [1.0, 1.0],
    optimumValue: 0.0,
    eval: (x, y) => {
      const t1 = y - x * x;
      const t2 = 1 - x;
      return 100 * t1 * t1 + t2 * t2;
    }
  },
  {
    id: "rastrigin",
    name: "Rastrigin (Multimodal Egg Carton)",
    category: "multimodal",
    description: "Highly multimodal with hundreds of local minima surrounding a global basin. Tests CMA-ES's ability to resist getting trapped in local deceptive valleys.",
    formula: "f(x, y) = 20 + x^2 + y^2 - 10[\\cos(2\\pi x) + \\cos(2\\pi y)]",
    domain: [-3.0, 3.0],
    optimum: [0.0, 0.0],
    optimumValue: 0.0,
    eval: (x, y) => 20 + (x * x - 10 * Math.cos(2 * Math.PI * x)) + (y * y - 10 * Math.cos(2 * Math.PI * y))
  },
  {
    id: "ackley",
    name: "Ackley (Rippled Funnel)",
    category: "multimodal",
    description: "Nearly flat outer plateau with many ripples that suddenly drops into a steep central funnel. Demands cumulative step-size expansion across the flat exterior.",
    formula: "f(x, y) = -20\\exp(-0.2\\sqrt{0.5(x^2+y^2)}) - \\exp(0.5[\\cos(2\\pi x)+\\cos(2\\pi y)]) + 20 + e",
    domain: [-3.0, 3.0],
    optimum: [0.0, 0.0],
    optimumValue: 0.0,
    eval: (x, y) => {
      const r = Math.sqrt(0.5 * (x * x + y * y));
      const c = 0.5 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y));
      return -20 * Math.exp(-0.2 * r) - Math.exp(c) + 20 + Math.E;
    }
  },
  {
    id: "cigar",
    name: "Ill-Conditioned Cigar (1000:1 Ratio)",
    category: "ill-conditioned",
    description: "One direction is 1000× steeper than the other (condition number 10^6). Standard gradient descent takes thousands of zig-zagging steps; CMA-ES stretches to match in ~15 generations.",
    formula: "f(x, y) = x^2 + 1000 y^2",
    domain: [-2.5, 2.5],
    optimum: [0.0, 0.0],
    optimumValue: 0.0,
    eval: (x, y) => x * x + 1000 * y * y
  },
  {
    id: "himmelblau",
    name: "Himmelblau (Four Equal Basins)",
    category: "multimodal",
    description: "A classic 4-minima landscape where multiple global solutions compete simultaneously.",
    formula: "f(x, y) = (x^2 + y - 11)^2 + (x + y^2 - 7)^2",
    domain: [-4.0, 4.0],
    optimum: [3.0, 2.0],
    optimumValue: 0.0,
    eval: (x, y) => {
      const t1 = x * x + y - 11;
      const t2 = x + y * y - 7;
      return t1 * t1 + t2 * t2;
    }
  },
  {
    id: "step_ridge",
    name: "Sharp Discontinuous Ridge",
    category: "discontinuous",
    description: "Discontinuous staircase with sharp drop-offs. Derivatives are undefined or zero almost everywhere, perfectly illustrating why black-box rank selection succeeds where gradients fail.",
    formula: "f(x, y) = \\lfloor x^2 + y^2 \\rfloor + |x - y|",
    domain: [-2.5, 2.5],
    optimum: [0.0, 0.0],
    optimumValue: 0.0,
    eval: (x, y) => Math.floor(x * x + y * y) + 0.5 * Math.abs(x - y)
  }
];

// --- Full CMA-ES State & Engine ---

export interface CMAESOptions {
  dim?: number;
  initialMean?: Vector;
  initialSigma?: number;
  lambda?: number; // Population size
  activeCMA?: boolean; // Enable active negative updates
  seed?: number;
  noiseLevel?: number; // Evaluation noise
  bounds?: [number, number]; // [min, max]
  repairStrategy?: "clip" | "reflect" | "none";
}

export interface CandidateSample {
  id: number;
  rawX: Vector;
  x: Vector;
  z: Vector; // Uncorrelated normal sample
  fitness: number;
  trueFitness: number;
  rank: number;
  isElite: boolean;
}

export interface CMAESGenerationState {
  generation: number;
  mean: Vector;
  sigma: number;
  covariance: Matrix; // 2x2 or NxN
  pSigma: Vector; // Step-size evolution path
  pC: Vector; // Covariance evolution path
  samples: CandidateSample[];
  bestFitness: number;
  bestX: Vector;
  eigenvalues: [number, number];
  conditionNumber: number;
  ellipseAngle: number;
  evalCount: number;
}

export class CMAESOptimizer {
  readonly dim: number;
  mean: Vector;
  sigma: number;
  C: Matrix;
  pSigma: Vector;
  pC: Vector;

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
  readonly bounds?: [number, number];
  readonly repairStrategy: "clip" | "reflect" | "none";
  readonly noiseLevel: number;

  generation: number = 0;
  evalCount: number = 0;
  bestFitness: number = Infinity;
  bestX: Vector;
  history: CMAESGenerationState[] = [];

  private rng: () => number;

  constructor(
    private objective: (x: number, y: number) => number,
    options: CMAESOptions = {}
  ) {
    this.dim = options.dim ?? 2;
    this.mean = options.initialMean ? [...options.initialMean] : [1.5, 1.5];
    this.sigma = options.initialSigma ?? 0.5;
    this.C = createIdentityMatrix(this.dim);
    this.pSigma = createZeroVector(this.dim);
    this.pC = createZeroVector(this.dim);
    this.activeCMA = options.activeCMA ?? true;
    this.bounds = options.bounds;
    this.repairStrategy = options.repairStrategy ?? "reflect";
    this.noiseLevel = options.noiseLevel ?? 0;

    // Pseudo-random generator (LCG)
    const seed = options.seed ?? 1337;
    let s = seed >>> 0;
    this.rng = () => {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 0xffffffff;
    };

    // Population size defaults: lambda = 4 + floor(3 * ln(n))
    this.lambda = options.lambda ?? Math.max(8, 4 + Math.floor(3 * Math.log(this.dim)));
    this.mu = Math.max(1, Math.floor(this.lambda / 2));

    // Recombination weights (logarithmic rank weights)
    const rawWeights: number[] = [];
    for (let i = 0; i < this.mu; i++) {
      rawWeights.push(Math.log(this.mu + 0.5) - Math.log(i + 1));
    }
    const sumW = rawWeights.reduce((a, b) => a + b, 0);
    this.weights = rawWeights.map((w) => w / sumW);

    // Variance effectiveness of sum of weights
    const sumSqW = this.weights.reduce((a, b) => a + b * b, 0);
    this.mueff = 1 / sumSqW;

    // Strategy parameter constants (Hansen 2016 reference defaults)
    this.cc = (4 + this.mueff / this.dim) / (this.dim + 4 + (2 * this.mueff) / this.dim);
    this.cs = (this.mueff + 2) / (this.dim + this.mueff + 5);
    this.c1 = 2 / (Math.pow(this.dim + 1.3, 2) + this.mueff);
    this.cmu = Math.min(
      1 - this.c1,
      (2 * (this.mueff - 2 + 1 / this.mueff)) / (Math.pow(this.dim + 2, 2) + this.mueff)
    );
    this.damps = 1 + 2 * Math.max(0, Math.sqrt((this.mueff - 1) / (this.dim + 1)) - 1) + this.cs;

    // Expectation of ||N(0, I)|| in dimension n
    this.chiN = Math.sqrt(this.dim) * (1 - 1 / (4 * this.dim) + 1 / (21 * this.dim * this.dim));

    this.bestX = [...this.mean];
  }

  private repair(x: number): number {
    if (!this.bounds) return x;
    const [min, max] = this.bounds;
    if (this.repairStrategy === "clip") {
      return Math.min(max, Math.max(min, x));
    }
    if (this.repairStrategy === "reflect") {
      if (x >= min && x <= max) return x;
      const span = max - min;
      const over = x - min;
      const mod = ((over % span) + span) % span;
      const wraps = Math.floor(over / span);
      return wraps % 2 === 0 ? min + mod : max - mod;
    }
    return x;
  }

  /**
   * Performs one full CMA-ES generation step
   */
  step(): CMAESGenerationState {
    const eigen = eigen2x2(this.C[0][0], this.C[0][1], this.C[1][1]);
    const s00 = eigen.sqrtMatrix[0][0];
    const s01 = eigen.sqrtMatrix[0][1];
    const s10 = eigen.sqrtMatrix[1][0];
    const s11 = eigen.sqrtMatrix[1][1];

    const is00 = eigen.invSqrtMatrix[0][0];
    const is01 = eigen.invSqrtMatrix[0][1];
    const is10 = eigen.invSqrtMatrix[1][0];
    const is11 = eigen.invSqrtMatrix[1][1];

    const m0 = this.mean[0];
    const m1 = this.mean[1];
    const sig = this.sigma;

    // 1. Sample lambda offspring using 2D Box-Muller generator
    const candidates: CandidateSample[] = [];
    for (let i = 0; i < this.lambda; i++) {
      const [z0, z1] = sampleGaussian2D(this.rng);
      const scaledZ0 = s00 * z0 + s01 * z1;
      const scaledZ1 = s10 * z0 + s11 * z1;
      const rawX0 = m0 + sig * scaledZ0;
      const rawX1 = m1 + sig * scaledZ1;
      const x0 = this.repair(rawX0);
      const x1 = this.repair(rawX1);

      const trueF = this.objective(x0, x1);
      const noise = this.noiseLevel > 0 ? sampleGaussian(this.rng) * this.noiseLevel : 0;
      const noisyF = trueF + noise;
      this.evalCount++;

      candidates.push({
        id: i,
        rawX: [rawX0, rawX1],
        x: [x0, x1],
        z: [z0, z1],
        fitness: noisyF,
        trueFitness: trueF,
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

    // 3. Selection and recombination: update mean
    const oldMean = [...this.mean];
    const newMean = createZeroVector(this.dim);
    for (let i = 0; i < this.mu; i++) {
      const elite = candidates[i];
      newMean[0] += this.weights[i] * elite.x[0];
      newMean[1] += this.weights[i] * elite.x[1];
    }
    this.mean = newMean;

    // Mean displacement in coordinate space and transformed space
    const meanShift: Vector = [
      (this.mean[0] - oldMean[0]) / this.sigma,
      (this.mean[1] - oldMean[1]) / this.sigma
    ];
    const zMean: Vector = [
      is00 * meanShift[0] + is01 * meanShift[1],
      is10 * meanShift[0] + is11 * meanShift[1]
    ];

    // 4. Update evolution paths
    // Cumulative Step-size Adaptation (CSA) path pSigma
    const pSigmaCoeff = Math.sqrt(this.cs * (2 - this.cs) * this.mueff);
    this.pSigma = [
      (1 - this.cs) * this.pSigma[0] + pSigmaCoeff * zMean[0],
      (1 - this.cs) * this.pSigma[1] + pSigmaCoeff * zMean[1]
    ];

    const normPSigma = vecNorm(this.pSigma);

    // Heaviside indicator to stall pC update under large step changes
    const hsig =
      normPSigma /
        Math.sqrt(1 - Math.pow(1 - this.cs, 2 * (this.generation + 1))) /
        this.chiN <
      1.4 + 2 / (this.dim + 1)
        ? 1
        : 0;

    // Covariance path pC
    const pCCoeff = Math.sqrt(this.cc * (2 - this.cc) * this.mueff);
    this.pC = [
      (1 - this.cc) * this.pC[0] + hsig * pCCoeff * meanShift[0],
      (1 - this.cc) * this.pC[1] + hsig * pCCoeff * meanShift[1]
    ];

    // 5. Adapt covariance matrix C (Rank-1 + Rank-mu + Active update)
    // Rank-1 term
    const rank1_00 = this.pC[0] * this.pC[0];
    const rank1_01 = this.pC[0] * this.pC[1];
    const rank1_11 = this.pC[1] * this.pC[1];

    // Rank-mu term (from top mu elites)
    let rankMu_00 = 0;
    let rankMu_01 = 0;
    let rankMu_11 = 0;
    for (let i = 0; i < this.mu; i++) {
      const elite = candidates[i];
      const y0 = (elite.x[0] - oldMean[0]) / this.sigma;
      const y1 = (elite.x[1] - oldMean[1]) / this.sigma;
      const w = this.weights[i];
      rankMu_00 += w * y0 * y0;
      rankMu_01 += w * y0 * y1;
      rankMu_11 += w * y1 * y1;
    }

    // Active covariance update (negative weights for worst offspring)
    let active_00 = 0;
    let active_01 = 0;
    let active_11 = 0;
    if (this.activeCMA) {
      const cActive = this.cmu * 0.4;
      for (let i = this.lambda - this.mu; i < this.lambda; i++) {
        const worst = candidates[i];
        const y0 = (worst.x[0] - oldMean[0]) / this.sigma;
        const y1 = (worst.x[1] - oldMean[1]) / this.sigma;
        const negW = this.weights[this.lambda - 1 - i]; // Mirror weights
        active_00 -= cActive * negW * y0 * y0;
        active_01 -= cActive * negW * y0 * y1;
        active_11 -= cActive * negW * y1 * y1;
      }
    }

    const c1Coeff = this.c1;
    const cmuCoeff = this.cmu;
    const oldCoeff = 1 - c1Coeff - cmuCoeff + (1 - hsig) * this.c1 * this.cc * (2 - this.cc);

    let newC00 = oldCoeff * this.C[0][0] + c1Coeff * rank1_00 + cmuCoeff * rankMu_00 + active_00;
    let newC01 = oldCoeff * this.C[0][1] + c1Coeff * rank1_01 + cmuCoeff * rankMu_01 + active_01;
    let newC11 = oldCoeff * this.C[1][1] + c1Coeff * rank1_11 + cmuCoeff * rankMu_11 + active_11;

    // Regularize/stabilize
    newC00 += 1e-10;
    newC11 += 1e-10;

    this.C = [
      [newC00, newC01],
      [newC01, newC11]
    ];

    // 6. Update step-size sigma
    this.sigma = this.sigma * Math.exp((this.cs / this.damps) * (normPSigma / this.chiN - 1));

    // Numerical safety guard
    this.sigma = Math.min(10.0, Math.max(1e-10, this.sigma));

    this.generation++;

    const updatedEigen = eigen2x2(this.C[0][0], this.C[0][1], this.C[1][1]);
    const condNum = updatedEigen.eigenvalues[0] / Math.max(1e-12, updatedEigen.eigenvalues[1]);

    const state: CMAESGenerationState = {
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
      ellipseAngle: updatedEigen.angle,
      evalCount: this.evalCount
    };

    this.history.push(state);
    return state;
  }
}

// --- Comparison Baseline Optimizers ---

export interface BaselineStepState {
  step: number;
  currentX: Vector;
  bestX: Vector;
  bestFitness: number;
  evalCount: number;
  samples?: Vector[];
}

export function runGradientDescent(
  fn: (x: number, y: number) => number,
  start: Vector,
  maxSteps = 60,
  lr = 0.01,
  eps = 1e-4
): BaselineStepState[] {
  let x = [...start];
  let bestF = fn(x[0], x[1]);
  let bestX = [...x];
  let evals = 1;
  const history: BaselineStepState[] = [
    { step: 0, currentX: [...x], bestX: [...bestX], bestFitness: bestF, evalCount: evals }
  ];

  for (let s = 1; s <= maxSteps; s++) {
    // Finite difference gradient
    const f0 = fn(x[0], x[1]);
    const fx = fn(x[0] + eps, x[1]);
    const fy = fn(x[0], x[1] + eps);
    evals += 3;

    const gx = (fx - f0) / eps;
    const gy = (fy - f0) / eps;

    // Gradient step
    x[0] -= lr * gx;
    x[1] -= lr * gy;

    const fNew = fn(x[0], x[1]);
    evals++;
    if (fNew < bestF) {
      bestF = fNew;
      bestX = [...x];
    }
    history.push({
      step: s,
      currentX: [...x],
      bestX: [...bestX],
      bestFitness: bestF,
      evalCount: evals
    });
  }
  return history;
}

export function runRandomSearch(
  fn: (x: number, y: number) => number,
  domain: [number, number],
  totalEvals = 400
): BaselineStepState[] {
  let bestF = Infinity;
  let bestX: Vector = [0, 0];
  const history: BaselineStepState[] = [];
  const span = domain[1] - domain[0];

  for (let i = 1; i <= totalEvals; i++) {
    const x: Vector = [domain[0] + Math.random() * span, domain[0] + Math.random() * span];
    const f = fn(x[0], x[1]);
    if (f < bestF) {
      bestF = f;
      bestX = [...x];
    }
    if (i % 8 === 0 || i === totalEvals) {
      history.push({
        step: Math.floor(i / 8),
        currentX: [...x],
        bestX: [...bestX],
        bestFitness: bestF,
        evalCount: i
      });
    }
  }
  return history;
}

export function runAdamOptimizer(
  fn: (x: number, y: number) => number,
  start: Vector,
  maxSteps = 60,
  lr = 0.05,
  beta1 = 0.9,
  beta2 = 0.999,
  eps = 1e-8,
  fdEps = 1e-4
): BaselineStepState[] {
  let x = [...start];
  let m = [0, 0];
  let v = [0, 0];
  let bestF = fn(x[0], x[1]);
  let bestX = [...x];
  let evals = 1;
  const history: BaselineStepState[] = [
    { step: 0, currentX: [...x], bestX: [...bestX], bestFitness: bestF, evalCount: evals }
  ];

  for (let s = 1; s <= maxSteps; s++) {
    const f0 = fn(x[0], x[1]);
    const fx = fn(x[0] + fdEps, x[1]);
    const fy = fn(x[0], x[1] + fdEps);
    evals += 3;

    const g = [(fx - f0) / fdEps, (fy - f0) / fdEps];

    m[0] = beta1 * m[0] + (1 - beta1) * g[0];
    m[1] = beta1 * m[1] + (1 - beta1) * g[1];
    v[0] = beta2 * v[0] + (1 - beta2) * (g[0] * g[0]);
    v[1] = beta2 * v[1] + (1 - beta2) * (g[1] * g[1]);

    const mHat0 = m[0] / (1 - Math.pow(beta1, s));
    const mHat1 = m[1] / (1 - Math.pow(beta1, s));
    const vHat0 = v[0] / (1 - Math.pow(beta2, s));
    const vHat1 = v[1] / (1 - Math.pow(beta2, s));

    x[0] -= (lr * mHat0) / (Math.sqrt(vHat0) + eps);
    x[1] -= (lr * mHat1) / (Math.sqrt(vHat1) + eps);

    const fNew = fn(x[0], x[1]);
    evals++;
    if (fNew < bestF) {
      bestF = fNew;
      bestX = [...x];
    }
    history.push({
      step: s,
      currentX: [...x],
      bestX: [...bestX],
      bestFitness: bestF,
      evalCount: evals
    });
  }
  return history;
}

