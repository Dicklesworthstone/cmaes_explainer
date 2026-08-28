/**
 * Numerically robust 2-D CMA-ES implementation for the interactive explainer.
 *
 * The update follows Hansen's active CMA-ES defaults: logarithmic positive and
 * negative covariance weights, Mahalanobis-length normalization for negative
 * updates, cumulative step-size adaptation, and the h_sigma correction in the
 * covariance decay term. The public API intentionally remains small and 2-D,
 * because every consumer in this site renders a two-dimensional landscape.
 */

export type Vector = number[];
export type Matrix = number[][];

const TWO_POW_32 = 0x100000000;
const MIN_EIGENVALUE = 1e-14;

export function createZeroVector(dim: number): Vector {
  return new Array(dim).fill(0);
}

export function createZeroMatrix(dim: number): Matrix {
  return Array.from({ length: dim }, () => new Array(dim).fill(0));
}

export function createIdentityMatrix(dim: number): Matrix {
  const matrix = createZeroMatrix(dim);
  for (let i = 0; i < dim; i++) matrix[i][i] = 1;
  return matrix;
}

export function cloneVector(vector: Vector): Vector {
  return [...vector];
}

export function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row]);
}

function assertSameLength(a: Vector, b: Vector, operation: string): void {
  if (a.length !== b.length) {
    throw new RangeError(`${operation} requires vectors of equal length; received ${a.length} and ${b.length}.`);
  }
}

export function vecAdd(a: Vector, b: Vector): Vector {
  assertSameLength(a, b, "vecAdd");
  return a.map((value, i) => value + b[i]);
}

export function vecSub(a: Vector, b: Vector): Vector {
  assertSameLength(a, b, "vecSub");
  return a.map((value, i) => value - b[i]);
}

export function vecScale(a: Vector, scalar: number): Vector {
  return a.map((value) => value * scalar);
}

export function vecDot(a: Vector, b: Vector): number {
  assertSameLength(a, b, "vecDot");
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

export function vecNorm(a: Vector): number {
  return Math.sqrt(Math.max(0, vecDot(a, a)));
}

export function matVecMult(matrix: Matrix, vector: Vector): Vector {
  if (matrix.length === 0 || matrix.some((row) => row.length !== vector.length)) {
    throw new RangeError("matVecMult requires a non-empty matrix whose row width matches the vector length.");
  }
  return matrix.map((row) => vecDot(row, vector));
}

export function outerProduct(a: Vector, b: Vector): Matrix {
  return a.map((ai) => b.map((bj) => ai * bj));
}

export interface Eigen2x2Result {
  eigenvalues: [number, number];
  eigenvectors: [[number, number], [number, number]];
  sqrtMatrix: [[number, number], [number, number]];
  invSqrtMatrix: [[number, number], [number, number]];
  angle: number;
}

/**
 * Stable eigendecomposition of [[a,b],[b,d]]. Eigenvalues are returned from
 * largest to smallest and floored only for the square-root operations.
 */
export function eigen2x2(a: number, b: number, d: number): Eigen2x2Result {
  if (![a, b, d].every(Number.isFinite)) {
    throw new RangeError("eigen2x2 requires finite matrix entries.");
  }

  const trace = a + d;
  const gap = Math.hypot(a - d, 2 * b);
  let lambda1 = 0.5 * (trace + gap);
  let lambda2 = 0.5 * (trace - gap);
  const scale = Math.max(Number.MIN_VALUE, Math.abs(lambda1), Math.abs(lambda2));
  const floor = Math.max(1e-300, MIN_EIGENVALUE * scale);
  lambda1 = Math.max(floor, lambda1);
  lambda2 = Math.max(floor, lambda2);

  const angle = 0.5 * Math.atan2(2 * b, a - d);
  const v1x = Math.cos(angle);
  const v1y = Math.sin(angle);
  const v2x = -v1y;
  const v2y = v1x;
  const sqrt1 = Math.sqrt(lambda1);
  const sqrt2 = Math.sqrt(lambda2);
  const invSqrt1 = 1 / sqrt1;
  const invSqrt2 = 1 / sqrt2;

  const compose = (diagonal1: number, diagonal2: number): [[number, number], [number, number]] => {
    const m00 = v1x * v1x * diagonal1 + v2x * v2x * diagonal2;
    const m01 = v1x * v1y * diagonal1 + v2x * v2y * diagonal2;
    const m11 = v1y * v1y * diagonal1 + v2y * v2y * diagonal2;
    return [[m00, m01], [m01, m11]];
  };

  return {
    eigenvalues: [lambda1, lambda2],
    eigenvectors: [[v1x, v2x], [v1y, v2y]],
    sqrtMatrix: compose(sqrt1, sqrt2),
    invSqrtMatrix: compose(invSqrt1, invSqrt2),
    angle
  };
}

function reconstructSymmetric2x2(eigen: Eigen2x2Result): Matrix {
  const [[v1x, v2x], [v1y, v2y]] = eigen.eigenvectors;
  const [lambda1, lambda2] = eigen.eigenvalues;
  const c00 = v1x * v1x * lambda1 + v2x * v2x * lambda2;
  const c01 = v1x * v1y * lambda1 + v2x * v2y * lambda2;
  const c11 = v1y * v1y * lambda1 + v2y * v2y * lambda2;
  return [[c00, c01], [c01, c11]];
}

function nextOpenUnit(rng: () => number): number {
  for (let attempts = 0; attempts < 1024; attempts++) {
    const value = rng();
    if (Number.isFinite(value) && value > 0 && value < 1) return value;
  }
  throw new RangeError("Gaussian sampling requires an RNG that produces values strictly between 0 and 1.");
}

function nextHalfOpenUnit(rng: () => number): number {
  for (let attempts = 0; attempts < 1024; attempts++) {
    const value = rng();
    if (Number.isFinite(value) && value >= 0 && value < 1) return value;
  }
  throw new RangeError("Gaussian sampling requires an RNG that produces values in [0, 1).");
}

/** Deterministic Mulberry32 generator for repeatable explanatory graphics. */
export function createMulberry32(seed: number): () => number {
  let state = Math.trunc(seed) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / TWO_POW_32;
  };
}

export function sampleGaussian(rng: () => number): number {
  const u = nextOpenUnit(rng);
  const v = nextHalfOpenUnit(rng);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function sampleGaussian2D(rng: () => number): [number, number] {
  const u = nextOpenUnit(rng);
  const v = nextHalfOpenUnit(rng);
  const magnitude = Math.sqrt(-2 * Math.log(u));
  const angle = 2 * Math.PI * v;
  return [magnitude * Math.cos(angle), magnitude * Math.sin(angle)];
}

export function sampleGaussianVector(dim: number, rng: () => number): Vector {
  if (!Number.isInteger(dim) || dim < 1) throw new RangeError("sampleGaussianVector requires a positive integer dimension.");
  const vector = new Array<number>(dim);
  for (let i = 0; i < dim; i += 2) {
    const [z0, z1] = sampleGaussian2D(rng);
    vector[i] = z0;
    if (i + 1 < dim) vector[i + 1] = z1;
  }
  return vector;
}

export interface BenchmarkFunction {
  id: string;
  name: string;
  category: "unimodal" | "multimodal" | "ill-conditioned" | "discontinuous";
  description: string;
  formula: string;
  domain: [number, number];
  optimum: Vector;
  /** All equal-valued global minima, for benchmarks that have several. */
  optima?: Vector[];
  optimumValue: number;
  eval: (x: number, y: number) => number;
}

export const BENCHMARKS: BenchmarkFunction[] = [
  {
    id: "rosenbrock",
    name: "Rosenbrock (Banana Valley)",
    category: "ill-conditioned",
    description: "A narrow, curved valley in which fixed-step first-order methods often zigzag across the walls while CMA-ES can rotate and elongate its search distribution along the valley.",
    formula: "f(x, y) = 100(\\textcolor{#60a5fa}{y} - \\textcolor{#60a5fa}{x}^2)^2 + (1 - \\textcolor{#60a5fa}{x})^2",
    domain: [-2.5, 2.5],
    optimum: [1, 1],
    optimumValue: 0,
    eval: (x, y) => 100 * (y - x * x) ** 2 + (1 - x) ** 2
  },
  {
    id: "rastrigin",
    name: "Rastrigin (Multimodal Egg Carton)",
    category: "multimodal",
    description: "A regular array of local minima surrounding the global basin. It exposes the local-search nature of one CMA-ES run and motivates independent restarts with larger populations.",
    formula: "f(x, y) = 20 + \\textcolor{#60a5fa}{x}^2 + \\textcolor{#60a5fa}{y}^2 - 10[\\cos(2\\pi \\textcolor{#60a5fa}{x}) + \\cos(2\\pi \\textcolor{#60a5fa}{y})]",
    domain: [-3, 3],
    optimum: [0, 0],
    optimumValue: 0,
    eval: (x, y) => 20 + x * x + y * y - 10 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y))
  },
  {
    id: "ackley",
    name: "Ackley (Rippled Funnel)",
    category: "multimodal",
    description: "A broad outer plateau, periodic ripples, and a narrow central basin make both global scale selection and local refinement important.",
    formula: "f(x, y) = -20\\exp(-0.2\\sqrt{0.5(\\textcolor{#60a5fa}{x}^2+\\textcolor{#60a5fa}{y}^2)}) - \\exp(0.5[\\cos(2\\pi \\textcolor{#60a5fa}{x})+\\cos(2\\pi \\textcolor{#60a5fa}{y})]) + 20 + e",
    domain: [-3, 3],
    optimum: [0, 0],
    optimumValue: 0,
    eval: (x, y) => {
      const radius = Math.sqrt(0.5 * (x * x + y * y));
      const ripple = 0.5 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y));
      return -20 * Math.exp(-0.2 * radius) - Math.exp(ripple) + 20 + Math.E;
    }
  },
  {
    id: "cigar",
    name: "Ill-Conditioned Cigar (1000:1 Curvature)",
    category: "ill-conditioned",
    description: "The Hessian is 1000 times steeper in y than in x, so the level-set axis ratio is √1000 ≈ 31.6. CMA-ES must learn this anisotropy instead of using one scale in both directions.",
    formula: "f(x, y) = \\textcolor{#60a5fa}{x}^2 + 1000 \\textcolor{#60a5fa}{y}^2",
    domain: [-2.5, 2.5],
    optimum: [0, 0],
    optimumValue: 0,
    eval: (x, y) => x * x + 1000 * y * y
  },
  {
    id: "himmelblau",
    name: "Himmelblau (Four Equal Basins)",
    category: "multimodal",
    description: "Four separated global minima have equal objective value, so the basin reached by one local run depends on its initial distribution and samples.",
    formula: "f(x, y) = (\\textcolor{#60a5fa}{x}^2 + \\textcolor{#60a5fa}{y} - 11)^2 + (\\textcolor{#60a5fa}{x} + \\textcolor{#60a5fa}{y}^2 - 7)^2",
    domain: [-4, 4],
    optimum: [3, 2],
    optima: [
      [3, 2],
      [-2.805118, 3.131312],
      [-3.77931, -3.283186],
      [3.584428, -1.848126]
    ],
    optimumValue: 0,
    eval: (x, y) => (x * x + y - 11) ** 2 + (x + y * y - 7) ** 2
  },
  {
    id: "step_ridge",
    name: "Sharp Discontinuous Ridge",
    category: "discontinuous",
    description: "A piecewise-flat radial staircase plus a nonsmooth diagonal ridge makes local finite-difference information brittle while rank comparisons remain usable. Its zero-valued global set is the segment x = y inside the unit disk; the origin marker is one representative optimum.",
    formula: "f(x, y) = \\lfloor \\textcolor{#60a5fa}{x}^2 + \\textcolor{#60a5fa}{y}^2 \\rfloor + 0.5|\\textcolor{#60a5fa}{x} - \\textcolor{#60a5fa}{y}|",
    domain: [-2.5, 2.5],
    optimum: [0, 0],
    optimumValue: 0,
    eval: (x, y) => Math.floor(x * x + y * y) + 0.5 * Math.abs(x - y)
  }
];

export interface CMAESOptions {
  dim?: number;
  initialMean?: Vector;
  initialSigma?: number;
  lambda?: number;
  activeCMA?: boolean;
  seed?: number;
  noiseLevel?: number;
  bounds?: [number, number];
  repairStrategy?: "clip" | "reflect" | "none";
}

export interface CandidateSample {
  id: number;
  rawX: Vector;
  x: Vector;
  z: Vector;
  fitness: number;
  trueFitness: number;
  rank: number;
  isElite: boolean;
}

export interface CMAESGenerationState {
  generation: number;
  mean: Vector;
  sigma: number;
  covariance: Matrix;
  pSigma: Vector;
  pC: Vector;
  samples: CandidateSample[];
  bestFitness: number;
  bestX: Vector;
  eigenvalues: [number, number];
  conditionNumber: number;
  ellipseAngle: number;
  evalCount: number;
}

function requireFiniteVector(name: string, vector: Vector, expectedLength: number): void {
  if (vector.length !== expectedLength || !vector.every(Number.isFinite)) {
    throw new RangeError(`${name} must contain exactly ${expectedLength} finite values.`);
  }
}

function safeObjectiveValue(value: number): number {
  if (Number.isNaN(value) || value === -Infinity) {
    throw new RangeError("The objective returned NaN or -Infinity; candidates must have an orderable minimization score.");
  }
  return value;
}

export class CMAESOptimizer {
  readonly dim = 2;
  mean: Vector;
  sigma: number;
  C: Matrix;
  pSigma: Vector;
  pC: Vector;

  readonly lambda: number;
  readonly mu: number;
  readonly weights: number[];
  readonly covarianceWeights: number[];
  readonly mueff: number;
  readonly mueffMinus: number;

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

  generation = 0;
  evalCount = 0;
  bestFitness = Infinity;
  bestX: Vector;
  history: CMAESGenerationState[] = [];

  private readonly rng: () => number;
  private readonly covarianceWeightSum: number;

  constructor(private readonly objective: (x: number, y: number) => number, options: CMAESOptions = {}) {
    const requestedDim = options.dim ?? 2;
    if (requestedDim !== 2) {
      throw new RangeError(`CMAESOptimizer is the explainer's 2-D engine; received dim=${requestedDim}. Use CMAESOptimizerND for N-D problems.`);
    }

    this.mean = options.initialMean ? [...options.initialMean] : [1.5, 1.5];
    requireFiniteVector("initialMean", this.mean, 2);

    this.sigma = options.initialSigma ?? 0.5;
    if (!Number.isFinite(this.sigma) || this.sigma <= 0) throw new RangeError("initialSigma must be a finite positive number.");

    this.lambda = options.lambda ?? 4 + Math.floor(3 * Math.log(this.dim));
    if (!Number.isInteger(this.lambda) || this.lambda < 2) throw new RangeError("lambda must be an integer of at least 2.");

    this.activeCMA = options.activeCMA ?? true;
    this.noiseLevel = options.noiseLevel ?? 0;
    if (!Number.isFinite(this.noiseLevel) || this.noiseLevel < 0) throw new RangeError("noiseLevel must be a finite non-negative number.");

    this.bounds = options.bounds ? [...options.bounds] as [number, number] : undefined;
    if (this.bounds && (!this.bounds.every(Number.isFinite) || this.bounds[0] >= this.bounds[1])) {
      throw new RangeError("bounds must be two finite numbers with min < max.");
    }
    this.repairStrategy = options.repairStrategy ?? "reflect";

    const seed = options.seed ?? 1337;
    if (!Number.isFinite(seed)) throw new RangeError("seed must be finite.");
    let state = Math.trunc(seed) >>> 0;
    this.rng = () => {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / TWO_POW_32;
    };

    this.C = createIdentityMatrix(2);
    this.pSigma = createZeroVector(2);
    this.pC = createZeroVector(2);
    this.bestX = [...this.mean];

    const rawWeights = Array.from({ length: this.lambda }, (_, i) => Math.log((this.lambda + 1) / 2) - Math.log(i + 1));
    this.mu = rawWeights.filter((weight) => weight > 0).length;
    const positiveSum = rawWeights.slice(0, this.mu).reduce((sum, weight) => sum + weight, 0);
    this.weights = rawWeights.slice(0, this.mu).map((weight) => weight / positiveSum);
    this.mueff = 1 / this.weights.reduce((sum, weight) => sum + weight * weight, 0);

    this.cc = (4 + this.mueff / this.dim) / (this.dim + 4 + 2 * this.mueff / this.dim);
    this.cs = (this.mueff + 2) / (this.dim + this.mueff + 5);
    this.c1 = 2 / ((this.dim + 1.3) ** 2 + this.mueff);
    this.cmu = Math.min(1 - this.c1, 2 * (this.mueff - 2 + 1 / this.mueff) / ((this.dim + 2) ** 2 + this.mueff));
    this.damps = 1 + 2 * Math.max(0, Math.sqrt((this.mueff - 1) / (this.dim + 1)) - 1) + this.cs;
    this.chiN = Math.sqrt(this.dim) * (1 - 1 / (4 * this.dim) + 1 / (21 * this.dim * this.dim));

    const negativeRaw = rawWeights.slice(this.mu);
    const negativeAbsSum = negativeRaw.reduce((sum, weight) => sum + Math.abs(weight), 0);
    const negativeSquareSum = negativeRaw.reduce((sum, weight) => sum + weight * weight, 0);
    this.mueffMinus = negativeSquareSum > 0 ? negativeAbsSum ** 2 / negativeSquareSum : 0;

    let negativeScale = 0;
    if (this.activeCMA && negativeAbsSum > 0 && this.cmu > 0) {
      const alphaMu = 1 + this.c1 / this.cmu;
      const alphaMueff = 1 + 2 * this.mueffMinus / (this.mueff + 2);
      const alphaPositiveDefinite = (1 - this.c1 - this.cmu) / (this.dim * this.cmu);
      negativeScale = Math.max(0, Math.min(alphaMu, alphaMueff, alphaPositiveDefinite));
    }

    this.covarianceWeights = rawWeights.map((weight, i) => {
      if (i < this.mu) return weight / positiveSum;
      return negativeAbsSum > 0 ? weight * negativeScale / negativeAbsSum : 0;
    });
    this.covarianceWeightSum = this.covarianceWeights.reduce((sum, weight) => sum + weight, 0);
  }

  private repair(value: number): number {
    if (!this.bounds || this.repairStrategy === "none") return value;
    const [min, max] = this.bounds;
    if (this.repairStrategy === "clip") return Math.min(max, Math.max(min, value));
    if (value >= min && value <= max) return value;
    const span = max - min;
    const period = 2 * span;
    const phase = ((value - min) % period + period) % period;
    return phase <= span ? min + phase : max - (phase - span);
  }

  /**
   * The reflected transform retains a meaningful latent preimage, so its raw
   * sample is the genotype used by adaptation. Literal clipping is
   * many-to-one: arbitrarily distant raw values collapse to the same boundary
   * phenotype. Recombining those raw values can strand the mean outside the
   * box and make an interior optimum unreachable, so clip adapts the point
   * that was actually ranked.
   */
  private adaptationPoint(candidate: CandidateSample): Vector {
    return this.repairStrategy === "clip" ? candidate.x : candidate.rawX;
  }

  step(): CMAESGenerationState {
    const eigen = eigen2x2(this.C[0][0], this.C[0][1], this.C[1][1]);
    const [[sqrt00, sqrt01], [sqrt10, sqrt11]] = eigen.sqrtMatrix;
    const [[inv00, inv01], [inv10, inv11]] = eigen.invSqrtMatrix;
    const oldMean0 = this.mean[0];
    const oldMean1 = this.mean[1];
    const oldSigma = this.sigma;

    const candidates: CandidateSample[] = [];
    for (let i = 0; i < this.lambda; i++) {
      const z = sampleGaussian2D(this.rng);
      const z0 = z[0];
      const z1 = z[1];
      const rawX0 = oldMean0 + oldSigma * (sqrt00 * z0 + sqrt01 * z1);
      const rawX1 = oldMean1 + oldSigma * (sqrt10 * z0 + sqrt11 * z1);
      const x0 = this.repair(rawX0);
      const x1 = this.repair(rawX1);
      const trueFitness = safeObjectiveValue(this.objective(x0, x1));
      const noise = this.noiseLevel > 0 ? this.noiseLevel * sampleGaussian(this.rng) : 0;
      candidates.push({
        id: i,
        rawX: [rawX0, rawX1],
        x: [x0, x1],
        z,
        fitness: trueFitness + noise,
        trueFitness,
        rank: 0,
        isElite: false
      });
      this.evalCount++;
    }

    candidates.sort((a, b) => a.fitness - b.fitness);
    candidates.forEach((candidate, rank) => {
      candidate.rank = rank;
      candidate.isElite = rank < this.mu;
      if (candidate.trueFitness < this.bestFitness) {
        this.bestFitness = candidate.trueFitness;
        this.bestX = [...candidate.x];
      }
    });

    let newMean0 = 0;
    let newMean1 = 0;
    for (let i = 0; i < this.mu; i++) {
      const adaptationX = this.adaptationPoint(candidates[i]);
      newMean0 += this.weights[i] * adaptationX[0];
      newMean1 += this.weights[i] * adaptationX[1];
    }
    this.mean = [newMean0, newMean1];

    const meanShift0 = (newMean0 - oldMean0) / oldSigma;
    const meanShift1 = (newMean1 - oldMean1) / oldSigma;
    const whitenedShift0 = inv00 * meanShift0 + inv01 * meanShift1;
    const whitenedShift1 = inv10 * meanShift0 + inv11 * meanShift1;

    const pSigmaScale = Math.sqrt(this.cs * (2 - this.cs) * this.mueff);
    this.pSigma = [
      (1 - this.cs) * this.pSigma[0] + pSigmaScale * whitenedShift0,
      (1 - this.cs) * this.pSigma[1] + pSigmaScale * whitenedShift1
    ];
    const pSigmaNorm = vecNorm(this.pSigma);
    const pathNormalizer = Math.sqrt(1 - (1 - this.cs) ** (2 * (this.generation + 1)));
    const hSigma = pSigmaNorm / Math.max(Number.EPSILON, pathNormalizer) / this.chiN < 1.4 + 2 / (this.dim + 1) ? 1 : 0;

    const pCScale = Math.sqrt(this.cc * (2 - this.cc) * this.mueff);
    this.pC = [
      (1 - this.cc) * this.pC[0] + hSigma * pCScale * meanShift0,
      (1 - this.cc) * this.pC[1] + hSigma * pCScale * meanShift1
    ];

    let rankMu00 = 0;
    let rankMu01 = 0;
    let rankMu11 = 0;
    for (let i = 0; i < this.lambda; i++) {
      const adaptationX = this.adaptationPoint(candidates[i]);
      const y0 = (adaptationX[0] - oldMean0) / oldSigma;
      const y1 = (adaptationX[1] - oldMean1) / oldSigma;
      let weight = this.covarianceWeights[i];
      if (weight < 0) {
        const white0 = inv00 * y0 + inv01 * y1;
        const white1 = inv10 * y0 + inv11 * y1;
        const mahalanobisSquared = white0 * white0 + white1 * white1;
        weight = mahalanobisSquared > 0 ? weight * this.dim / mahalanobisSquared : 0;
      }
      rankMu00 += weight * y0 * y0;
      rankMu01 += weight * y0 * y1;
      rankMu11 += weight * y1 * y1;
    }

    const deltaHSigma = (1 - hSigma) * this.cc * (2 - this.cc);
    const oldCoefficient = 1 + this.c1 * deltaHSigma - this.c1 - this.cmu * this.covarianceWeightSum;
    const provisionalC00 = oldCoefficient * this.C[0][0] + this.c1 * this.pC[0] ** 2 + this.cmu * rankMu00;
    const provisionalC01 = oldCoefficient * this.C[0][1] + this.c1 * this.pC[0] * this.pC[1] + this.cmu * rankMu01;
    const provisionalC11 = oldCoefficient * this.C[1][1] + this.c1 * this.pC[1] ** 2 + this.cmu * rankMu11;
    this.C = reconstructSymmetric2x2(eigen2x2(provisionalC00, provisionalC01, provisionalC11));

    this.sigma = oldSigma * Math.exp(this.cs / this.damps * (pSigmaNorm / this.chiN - 1));
    this.sigma = Math.min(10, Math.max(1e-10, this.sigma));
    this.generation++;

    const updatedEigen = eigen2x2(this.C[0][0], this.C[0][1], this.C[1][1]);
    const state: CMAESGenerationState = {
      generation: this.generation,
      mean: this.mean.map((value) => this.repair(value)),
      sigma: this.sigma,
      covariance: cloneMatrix(this.C),
      pSigma: [...this.pSigma],
      pC: [...this.pC],
      samples: candidates,
      bestFitness: this.bestFitness,
      bestX: [...this.bestX],
      eigenvalues: updatedEigen.eigenvalues,
      conditionNumber: updatedEigen.eigenvalues[0] / updatedEigen.eigenvalues[1],
      ellipseAngle: updatedEigen.angle,
      evalCount: this.evalCount
    };
    this.history.push(state);
    return state;
  }
}

export interface BaselineStepState {
  step: number;
  currentX: Vector;
  bestX: Vector;
  bestFitness: number;
  evalCount: number;
  samples?: Vector[];
}

function validateBaselineInputs(start: Vector, maxSteps: number): void {
  requireFiniteVector("start", start, 2);
  if (!Number.isInteger(maxSteps) || maxSteps < 0) throw new RangeError("maxSteps must be a non-negative integer.");
}

export function runGradientDescent(
  fn: (x: number, y: number) => number,
  start: Vector,
  maxSteps = 60,
  lr = 0.01,
  eps = 1e-4,
  maxStepNorm = 0.25
): BaselineStepState[] {
  validateBaselineInputs(start, maxSteps);
  if (!Number.isFinite(lr) || lr <= 0 || !Number.isFinite(eps) || eps <= 0) throw new RangeError("lr and eps must be finite positive numbers.");
  if (!Number.isFinite(maxStepNorm) || maxStepNorm <= 0) throw new RangeError("maxStepNorm must be a finite positive number.");

  const x = [...start];
  let currentFitness = safeObjectiveValue(fn(x[0], x[1]));
  let bestFitness = currentFitness;
  let bestX = [...x];
  let evalCount = 1;
  const history: BaselineStepState[] = [{ step: 0, currentX: [...x], bestX: [...bestX], bestFitness, evalCount }];

  for (let step = 1; step <= maxSteps; step++) {
    const fx = safeObjectiveValue(fn(x[0] + eps, x[1]));
    const fy = safeObjectiveValue(fn(x[0], x[1] + eps));
    evalCount += 2;
    const gradientX = (fx - currentFitness) / eps;
    const gradientY = (fy - currentFitness) / eps;
    // Clip the step length: on steep benchmarks (Rosenbrock walls reach
    // gradients of order 10^3) a raw fixed-lr step diverges immediately,
    // which would demonstrate a bad learning rate rather than the zigzagging
    // behavior this baseline exists to show.
    let stepX = lr * gradientX;
    let stepY = lr * gradientY;
    const stepLen = Math.hypot(stepX, stepY);
    if (stepLen > maxStepNorm) {
      const shrink = maxStepNorm / stepLen;
      stepX *= shrink;
      stepY *= shrink;
    }
    x[0] -= stepX;
    x[1] -= stepY;
    currentFitness = safeObjectiveValue(fn(x[0], x[1]));
    evalCount++;
    if (currentFitness < bestFitness) {
      bestFitness = currentFitness;
      bestX = [...x];
    }
    history.push({ step, currentX: [...x], bestX: [...bestX], bestFitness, evalCount });
  }
  return history;
}

export function runRandomSearch(
  fn: (x: number, y: number) => number,
  domain: [number, number],
  totalEvals = 400
): BaselineStepState[] {
  if (!domain.every(Number.isFinite) || domain[0] >= domain[1]) throw new RangeError("domain must contain finite min and max values with min < max.");
  if (!Number.isInteger(totalEvals) || totalEvals < 1) throw new RangeError("totalEvals must be a positive integer.");

  let bestFitness = Infinity;
  let bestX: Vector = [0, 0];
  const history: BaselineStepState[] = [];
  const span = domain[1] - domain[0];
  for (let evaluation = 1; evaluation <= totalEvals; evaluation++) {
    const x: Vector = [domain[0] + Math.random() * span, domain[0] + Math.random() * span];
    const fitness = safeObjectiveValue(fn(x[0], x[1]));
    if (fitness < bestFitness) {
      bestFitness = fitness;
      bestX = [...x];
    }
    if (evaluation % 8 === 0 || evaluation === totalEvals) {
      history.push({
        step: Math.ceil(evaluation / 8),
        currentX: [...x],
        bestX: [...bestX],
        bestFitness,
        evalCount: evaluation
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
  validateBaselineInputs(start, maxSteps);
  if (!Number.isFinite(lr) || lr <= 0 || !Number.isFinite(eps) || eps <= 0 || !Number.isFinite(fdEps) || fdEps <= 0) {
    throw new RangeError("lr, eps, and fdEps must be finite positive numbers.");
  }
  if (!(beta1 >= 0 && beta1 < 1) || !(beta2 >= 0 && beta2 < 1)) throw new RangeError("beta1 and beta2 must lie in [0, 1).");

  const x = [...start];
  const firstMoment = [0, 0];
  const secondMoment = [0, 0];
  let currentFitness = safeObjectiveValue(fn(x[0], x[1]));
  let bestFitness = currentFitness;
  let bestX = [...x];
  let evalCount = 1;
  const history: BaselineStepState[] = [{ step: 0, currentX: [...x], bestX: [...bestX], bestFitness, evalCount }];

  for (let step = 1; step <= maxSteps; step++) {
    const fx = safeObjectiveValue(fn(x[0] + fdEps, x[1]));
    const fy = safeObjectiveValue(fn(x[0], x[1] + fdEps));
    evalCount += 2;
    const gradient = [(fx - currentFitness) / fdEps, (fy - currentFitness) / fdEps];

    for (let i = 0; i < 2; i++) {
      firstMoment[i] = beta1 * firstMoment[i] + (1 - beta1) * gradient[i];
      secondMoment[i] = beta2 * secondMoment[i] + (1 - beta2) * gradient[i] ** 2;
      const correctedFirst = firstMoment[i] / (1 - beta1 ** step);
      const correctedSecond = secondMoment[i] / (1 - beta2 ** step);
      x[i] -= lr * correctedFirst / (Math.sqrt(correctedSecond) + eps);
    }

    currentFitness = safeObjectiveValue(fn(x[0], x[1]));
    evalCount++;
    if (currentFitness < bestFitness) {
      bestFitness = currentFitness;
      bestX = [...x];
    }
    history.push({ step, currentX: [...x], bestX: [...bestX], bestFitness, evalCount });
  }
  return history;
}
