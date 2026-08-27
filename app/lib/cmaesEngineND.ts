/**
 * Numerically robust N-dimensional CMA-ES engine with a centered 3-D PCA view.
 *
 * The optimizer uses Hansen's active-CMA defaults: logarithmic positive and
 * negative covariance weights, Mahalanobis-length normalization for negative
 * updates, cumulative step-size adaptation, and the h_sigma covariance
 * correction. Each returned phase-space snapshot is expressed in one coherent
 * frame: the updated mean is the origin, and the samples, paths, and covariance
 * ellipsoid all use the updated covariance's top principal directions.
 */

export type VectorND = number[];
export type MatrixND = number[][];

const TWO_POW_32 = 0x100000000;
const RELATIVE_EIGENVALUE_FLOOR = 1e-14;
const JACOBI_TAU_SMALL_EXACT = 2 ** -27;
const JACOBI_TAU_LARGE_EXACT = 2 ** 27;

export function createZeroVector(dim: number): VectorND {
  if (!Number.isInteger(dim) || dim < 0) throw new RangeError("Vector dimension must be a non-negative integer.");
  return new Array(dim).fill(0);
}

export function createZeroMatrix(dim: number): MatrixND {
  if (!Number.isInteger(dim) || dim < 0) throw new RangeError("Matrix dimension must be a non-negative integer.");
  return Array.from({ length: dim }, () => new Array(dim).fill(0));
}

export function createIdentityMatrix(dim: number): MatrixND {
  const matrix = createZeroMatrix(dim);
  for (let i = 0; i < dim; i++) matrix[i][i] = 1;
  return matrix;
}

export function cloneVector(vector: VectorND): VectorND {
  return [...vector];
}

export function cloneMatrix(matrix: MatrixND): MatrixND {
  return matrix.map((row) => [...row]);
}

function assertSameLength(a: VectorND, b: VectorND, operation: string): void {
  if (a.length !== b.length) {
    throw new RangeError(`${operation} requires vectors of equal length; received ${a.length} and ${b.length}.`);
  }
}

export function vecDot(a: VectorND, b: VectorND): number {
  assertSameLength(a, b, "vecDot");
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

export function vecNorm(vector: VectorND): number {
  return Math.sqrt(Math.max(0, vecDot(vector, vector)));
}

export function matVecMult(matrix: MatrixND, vector: VectorND): VectorND {
  if (matrix.some((row) => row.length !== vector.length)) {
    throw new RangeError("matVecMult requires every matrix row to match the vector length.");
  }
  return matrix.map((row) => vecDot(row, vector));
}

export function matMult(a: MatrixND, b: MatrixND): MatrixND {
  if (a.length === 0 || b.length === 0) return [];
  const inner = b.length;
  const columns = b[0].length;
  if (a.some((row) => row.length !== inner) || b.some((row) => row.length !== columns)) {
    throw new RangeError("matMult received incompatible or ragged matrices.");
  }
  return a.map((row) =>
    Array.from({ length: columns }, (_, column) => {
      let sum = 0;
      for (let k = 0; k < inner; k++) sum += row[k] * b[k][column];
      return sum;
    })
  );
}

export interface SymmetricEigendecompositionND {
  eigenvalues: number[];
  eigenvectors: MatrixND;
}

function validateSquareFiniteMatrix(matrix: MatrixND): number {
  const n = matrix.length;
  if (n < 1 || matrix.some((row) => row.length !== n || row.some((value) => !Number.isFinite(value)))) {
    throw new RangeError("A finite, non-empty square matrix is required.");
  }
  return n;
}

/**
 * Cyclic Jacobi eigendecomposition for a real symmetric matrix. Columns of the
 * returned eigenvector matrix correspond to eigenvalues sorted largest-first.
 * The input is symmetrized against roundoff, and tiny non-positive eigenvalues
 * are floored relative to the matrix scale for covariance square roots.
 */
export function jacobiEigenSymmetric(
  matrix: MatrixND,
  maxSweeps = 50,
  tolerance = 1e-12
): SymmetricEigendecompositionND {
  const n = validateSquareFiniteMatrix(matrix);
  if (!Number.isInteger(maxSweeps) || maxSweeps < 1) throw new RangeError("maxSweeps must be a positive integer.");
  if (!Number.isFinite(tolerance) || tolerance <= 0) throw new RangeError("tolerance must be a finite positive number.");

  const a = new Float64Array(n * n);
  const v = new Float64Array(n * n);
  let scale = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const value = 0.5 * (matrix[i][j] + matrix[j][i]);
      a[i * n + j] = value;
      scale = Math.max(scale, Math.abs(value));
    }
    v[i * n + i] = 1;
  }

  const absoluteTolerance = tolerance * Math.max(Number.MIN_VALUE, scale);
  let residual = Infinity;
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    residual = 0;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const pp = p * n + p;
        const qq = q * n + q;
        const pq = p * n + q;
        const apq = a[pq];
        residual = Math.max(residual, Math.abs(apq));
        if (Math.abs(apq) <= absoluteTolerance) continue;

        const app = a[pp];
        const aqq = a[qq];
        const tau = (aqq - app) / (2 * apq);
        const tauMagnitude = Math.abs(tau);
        const tauNorm = tauMagnitude <= JACOBI_TAU_SMALL_EXACT
          ? 1
          : tauMagnitude >= JACOBI_TAU_LARGE_EXACT
            ? tauMagnitude
            : Math.hypot(1, tauMagnitude);
        const t = (tau < 0 ? -1 : 1) / (tauMagnitude + tauNorm);
        const cosine = 1 / Math.sqrt(1 + t * t);
        const sine = t * cosine;

        for (let k = 0; k < n; k++) {
          if (k === p || k === q) continue;
          const kp = k < p ? k * n + p : p * n + k;
          const kq = k < q ? k * n + q : q * n + k;
          const akp = a[kp];
          const akq = a[kq];
          const rotatedP = cosine * akp - sine * akq;
          const rotatedQ = sine * akp + cosine * akq;
          a[kp] = rotatedP;
          a[kq] = rotatedQ;
        }

        a[pp] = cosine * cosine * app - 2 * sine * cosine * apq + sine * sine * aqq;
        a[qq] = sine * sine * app + 2 * sine * cosine * apq + cosine * cosine * aqq;
        a[pq] = 0;

        for (let k = 0; k < n; k++) {
          const kp = k * n + p;
          const kq = k * n + q;
          const vkp = v[kp];
          const vkq = v[kq];
          v[kp] = cosine * vkp - sine * vkq;
          v[kq] = sine * vkp + cosine * vkq;
        }
      }
    }
    if (residual <= absoluteTolerance) break;
  }

  if (residual > Math.max(absoluteTolerance * 100, scale * 1e-8)) {
    throw new RangeError(`Jacobi eigendecomposition did not converge; residual off-diagonal magnitude is ${residual}.`);
  }

  const ordering = Array.from({ length: n }, (_, index) => index).sort(
    (left, right) => a[right * n + right] - a[left * n + left]
  );
  const rawEigenvalues = ordering.map((index) => a[index * n + index]);
  const eigenScale = Math.max(Number.MIN_VALUE, ...rawEigenvalues.map(Math.abs));
  const floor = Math.max(1e-300, RELATIVE_EIGENVALUE_FLOOR * eigenScale);
  const eigenvalues = rawEigenvalues.map((value) => Math.max(floor, value));
  const eigenvectors = Array.from({ length: n }, () => new Array<number>(n));
  for (let column = 0; column < n; column++) {
    const sourceColumn = ordering[column];
    for (let row = 0; row < n; row++) eigenvectors[row][column] = v[row * n + sourceColumn];
  }
  return { eigenvalues, eigenvectors };
}

export function computeCovariancePowers(
  eigenvalues: number[],
  eigenvectors: MatrixND
): { sqrtC: MatrixND; invSqrtC: MatrixND } {
  const n = eigenvalues.length;
  if (
    n < 1 ||
    eigenvectors.length !== n ||
    eigenvectors.some((row) => row.length !== n || row.some((value) => !Number.isFinite(value))) ||
    eigenvalues.some((value) => !Number.isFinite(value) || value <= 0)
  ) {
    throw new RangeError("computeCovariancePowers requires positive finite eigenvalues and a matching finite eigenvector matrix.");
  }

  const sqrtValues = eigenvalues.map(Math.sqrt);
  const inverseSqrtValues = sqrtValues.map((value) => 1 / value);
  const compose = (diagonal: number[]): MatrixND => {
    const result = createZeroMatrix(n);
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) sum += eigenvectors[i][k] * diagonal[k] * eigenvectors[j][k];
        result[i][j] = sum;
        result[j][i] = sum;
      }
    }
    return result;
  };
  return { sqrtC: compose(sqrtValues), invSqrtC: compose(inverseSqrtValues) };
}

function reconstructSymmetric(eigenvalues: number[], eigenvectors: MatrixND): MatrixND {
  const n = eigenvalues.length;
  const result = createZeroMatrix(n);
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) sum += eigenvectors[i][k] * eigenvalues[k] * eigenvectors[j][k];
      result[i][j] = sum;
      result[j][i] = sum;
    }
  }
  return result;
}

/** Apply B D to a standard-normal vector already expressed in eigen coordinates. */
function transformFromEigenCoordinates(
  eigenvalues: number[],
  eigenvectors: MatrixND,
  vector: VectorND
): VectorND {
  const n = eigenvalues.length;
  const result = createZeroVector(n);
  for (let column = 0; column < n; column++) {
    const scaled = Math.sqrt(eigenvalues[column]) * vector[column];
    for (let row = 0; row < n; row++) result[row] += eigenvectors[row][column] * scaled;
  }
  return result;
}

/** Apply C^-1/2 = B D^-1 B^T without materializing the dense matrix. */
function whitenWithEigensystem(
  eigenvalues: number[],
  eigenvectors: MatrixND,
  vector: VectorND
): VectorND {
  const n = eigenvalues.length;
  const eigenCoordinates = createZeroVector(n);
  for (let column = 0; column < n; column++) {
    let coordinate = 0;
    for (let row = 0; row < n; row++) coordinate += eigenvectors[row][column] * vector[row];
    eigenCoordinates[column] = coordinate / Math.sqrt(eigenvalues[column]);
  }

  const result = createZeroVector(n);
  for (let column = 0; column < n; column++) {
    for (let row = 0; row < n; row++) result[row] += eigenvectors[row][column] * eigenCoordinates[column];
  }
  return result;
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

export function sampleGaussian(rng: () => number = Math.random): number {
  const u = nextOpenUnit(rng);
  const v = nextHalfOpenUnit(rng);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function sampleGaussianVectorND(dim: number, rng: () => number = Math.random): VectorND {
  if (!Number.isInteger(dim) || dim < 1) throw new RangeError("sampleGaussianVectorND requires a positive integer dimension.");
  const result = new Array<number>(dim);
  for (let i = 0; i < dim; i += 2) {
    const u = nextOpenUnit(rng);
    const v = nextHalfOpenUnit(rng);
    const magnitude = Math.sqrt(-2 * Math.log(u));
    const angle = 2 * Math.PI * v;
    result[i] = magnitude * Math.cos(angle);
    if (i + 1 < dim) result[i + 1] = magnitude * Math.sin(angle);
  }
  return result;
}

export interface CandidateSampleND {
  id: number;
  rawX: VectorND;
  x: VectorND;
  z: VectorND;
  projected3D: [number, number, number];
  fitness: number;
  trueFitness: number;
  rank: number;
  isElite: boolean;
}

export interface PhaseSpace3DProjection {
  projectedMean: [number, number, number];
  ellipsoidRadii: [number, number, number];
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
  bounds?: [number, number];
  repairStrategy?: "clip" | "reflect" | "none";
  noiseLevel?: number;
}

function requireFiniteVector(name: string, vector: VectorND, expectedLength: number): void {
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

export class CMAESOptimizerND {
  readonly dim: number;
  mean: VectorND;
  sigma: number;
  pSigma: VectorND;
  pC: VectorND;

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
  readonly bounds: [number, number];
  readonly repairStrategy: "clip" | "reflect" | "none";
  readonly noiseLevel: number;

  generation = 0;
  evalCount = 0;
  bestFitness = Infinity;
  bestX: VectorND;
  history: CMAESGenerationStateND[] = [];

  private readonly rng: () => number;
  private readonly covarianceWeightSum: number;
  private covariance: MatrixND;
  private currentEigen: SymmetricEigendecompositionND;
  private previousProjectionBasis: MatrixND | null = null;

  constructor(private readonly objective: (x: VectorND) => number, options: CMAESOptionsND) {
    this.dim = options.dim;
    if (!Number.isInteger(this.dim) || this.dim < 1) throw new RangeError("dim must be a positive integer.");

    this.mean = options.initialMean ? [...options.initialMean] : new Array(this.dim).fill(0.5);
    requireFiniteVector("initialMean", this.mean, this.dim);

    this.sigma = options.initialSigma ?? 0.25;
    if (!Number.isFinite(this.sigma) || this.sigma <= 0) throw new RangeError("initialSigma must be a finite positive number.");

    this.lambda = options.lambda ?? 4 + Math.floor(3 * Math.log(this.dim));
    if (!Number.isInteger(this.lambda) || this.lambda < 2) throw new RangeError("lambda must be an integer of at least 2.");

    this.activeCMA = options.activeCMA ?? true;
    this.noiseLevel = options.noiseLevel ?? 0;
    if (!Number.isFinite(this.noiseLevel) || this.noiseLevel < 0) throw new RangeError("noiseLevel must be a finite non-negative number.");

    this.bounds = options.bounds ? [...options.bounds] as [number, number] : [0, 1];
    if (!this.bounds.every(Number.isFinite) || this.bounds[0] >= this.bounds[1]) {
      throw new RangeError("bounds must contain finite values with min < max.");
    }
    this.repairStrategy = options.repairStrategy ?? "reflect";

    const seed = options.seed ?? 4242;
    if (!Number.isFinite(seed)) throw new RangeError("seed must be finite.");
    let state = Math.trunc(seed) >>> 0;
    this.rng = () => {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / TWO_POW_32;
    };

    this.covariance = createIdentityMatrix(this.dim);
    this.currentEigen = {
      eigenvalues: new Array(this.dim).fill(1),
      eigenvectors: createIdentityMatrix(this.dim)
    };
    this.pSigma = createZeroVector(this.dim);
    this.pC = createZeroVector(this.dim);
    this.bestX = [...this.mean];

    const rawWeights = Array.from(
      { length: this.lambda },
      (_, index) => Math.log((this.lambda + 1) / 2) - Math.log(index + 1)
    );
    this.mu = rawWeights.filter((weight) => weight > 0).length;
    const positiveSum = rawWeights.slice(0, this.mu).reduce((sum, weight) => sum + weight, 0);
    this.weights = rawWeights.slice(0, this.mu).map((weight) => weight / positiveSum);
    this.mueff = 1 / this.weights.reduce((sum, weight) => sum + weight * weight, 0);

    this.cc = (4 + this.mueff / this.dim) / (this.dim + 4 + 2 * this.mueff / this.dim);
    this.cs = (this.mueff + 2) / (this.dim + this.mueff + 5);
    this.c1 = 2 / ((this.dim + 1.3) ** 2 + this.mueff);
    this.cmu = Math.max(
      0,
      Math.min(1 - this.c1, 2 * (this.mueff - 2 + 1 / this.mueff) / ((this.dim + 2) ** 2 + this.mueff))
    );
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

    this.covarianceWeights = rawWeights.map((weight, index) => {
      if (index < this.mu) return weight / positiveSum;
      return negativeAbsSum > 0 ? weight * negativeScale / negativeAbsSum : 0;
    });
    this.covarianceWeightSum = this.covarianceWeights.reduce((sum, weight) => sum + weight, 0);
  }

  private repair(value: number): number {
    if (this.repairStrategy === "none") return value;
    const [min, max] = this.bounds;
    if (this.repairStrategy === "clip") return Math.min(max, Math.max(min, value));
    if (value >= min && value <= max) return value;
    const span = max - min;
    const period = 2 * span;
    const phase = ((value - min) % period + period) % period;
    return phase <= span ? min + phase : max - (phase - span);
  }

  /** Return a snapshot instead of exposing state that must match currentEigen. */
  get C(): MatrixND {
    return cloneMatrix(this.covariance);
  }

  /** See the 2-D engine for why direct clipping adapts phenotypes. */
  private adaptationPoint(candidate: CandidateSampleND): VectorND {
    return this.repairStrategy === "clip" ? candidate.x : candidate.rawX;
  }

  projectTo3D(vector: VectorND, basis: MatrixND): [number, number, number] {
    requireFiniteVector("projected vector", vector, this.dim);
    if (basis.length !== this.dim || basis.some((row) => row.length !== this.dim)) {
      throw new RangeError("The PCA basis must be a square matrix matching the optimizer dimension.");
    }
    const coordinate = (column: number): number => {
      if (column >= this.dim) return 0;
      let sum = 0;
      for (let row = 0; row < this.dim; row++) sum += vector[row] * basis[row][column];
      return sum;
    };
    return [coordinate(0), coordinate(1), coordinate(2)];
  }

  private alignProjectionBasis(eigenvectors: MatrixND): MatrixND {
    const aligned = cloneMatrix(eigenvectors);
    if (this.previousProjectionBasis) {
      for (let column = 0; column < Math.min(3, this.dim); column++) {
        let agreement = 0;
        for (let row = 0; row < this.dim; row++) {
          agreement += aligned[row][column] * this.previousProjectionBasis[row][column];
        }
        if (agreement < 0) {
          for (let row = 0; row < this.dim; row++) aligned[row][column] *= -1;
        }
      }
    }
    this.previousProjectionBasis = cloneMatrix(aligned);
    return aligned;
  }

  step(): CMAESGenerationStateND {
    const currentEigen = this.currentEigen;
    const oldMean = [...this.mean];
    const oldSigma = this.sigma;

    const candidates: CandidateSampleND[] = [];
    for (let id = 0; id < this.lambda; id++) {
      const z = sampleGaussianVectorND(this.dim, this.rng);
      const transformed = transformFromEigenCoordinates(currentEigen.eigenvalues, currentEigen.eigenvectors, z);
      const rawX = oldMean.map((mean, index) => mean + oldSigma * transformed[index]);
      const x = rawX.map((value) => this.repair(value));
      const trueFitness = safeObjectiveValue(this.objective(x));
      const noise = this.noiseLevel > 0 ? this.noiseLevel * sampleGaussian(this.rng) : 0;
      candidates.push({
        id,
        rawX,
        x,
        z,
        projected3D: [0, 0, 0],
        fitness: trueFitness + noise,
        trueFitness,
        rank: 0,
        isElite: false
      });
      this.evalCount++;
    }

    candidates.sort((a, b) => a.fitness - b.fitness || a.id - b.id);
    candidates.forEach((candidate, rank) => {
      candidate.rank = rank;
      candidate.isElite = rank < this.mu;
      if (candidate.trueFitness < this.bestFitness) {
        this.bestFitness = candidate.trueFitness;
        this.bestX = [...candidate.x];
      }
    });

    this.mean = createZeroVector(this.dim);
    for (let rank = 0; rank < this.mu - 1; rank++) {
      const adaptationX = this.adaptationPoint(candidates[rank]);
      for (let dimension = 0; dimension < this.dim; dimension++) {
        this.mean[dimension] += this.weights[rank] * adaptationX[dimension];
      }
    }

    const meanShift = new Array<number>(this.dim);
    const finalRank = this.mu - 1;
    const finalAdaptationX = this.adaptationPoint(candidates[finalRank]);
    const finalWeight = this.weights[finalRank];
    for (let dimension = 0; dimension < this.dim; dimension++) {
      this.mean[dimension] += finalWeight * finalAdaptationX[dimension];
      meanShift[dimension] = (this.mean[dimension] - oldMean[dimension]) / oldSigma;
    }
    const whitenedMeanShift = whitenWithEigensystem(currentEigen.eigenvalues, currentEigen.eigenvectors, meanShift);
    const pSigmaScale = Math.sqrt(this.cs * (2 - this.cs) * this.mueff);
    this.pSigma = this.pSigma.map(
      (value, dimension) => (1 - this.cs) * value + pSigmaScale * whitenedMeanShift[dimension]
    );
    const pSigmaNorm = vecNorm(this.pSigma);
    const pathNormalizer = Math.sqrt(1 - (1 - this.cs) ** (2 * (this.generation + 1)));
    const hSigma = pSigmaNorm / Math.max(Number.EPSILON, pathNormalizer) / this.chiN < 1.4 + 2 / (this.dim + 1) ? 1 : 0;

    const pCScale = Math.sqrt(this.cc * (2 - this.cc) * this.mueff);
    this.pC = this.pC.map(
      (value, dimension) => (1 - this.cc) * value + hSigma * pCScale * meanShift[dimension]
    );

    const normalizedSteps = candidates.map((candidate) =>
      this.adaptationPoint(candidate).map((value, dimension) => (value - oldMean[dimension]) / oldSigma)
    );
    const adjustedCovarianceWeights = [...this.covarianceWeights];
    for (let rank = this.mu; rank < this.lambda; rank++) {
      if (adjustedCovarianceWeights[rank] >= 0) continue;
      const whitenedStep = whitenWithEigensystem(
        currentEigen.eigenvalues,
        currentEigen.eigenvectors,
        normalizedSteps[rank]
      );
      const mahalanobisSquared = vecDot(whitenedStep, whitenedStep);
      adjustedCovarianceWeights[rank] = mahalanobisSquared > 0
        ? adjustedCovarianceWeights[rank] * this.dim / mahalanobisSquared
        : 0;
    }

    const deltaHSigma = (1 - hSigma) * this.cc * (2 - this.cc);
    const oldCoefficient = 1 + this.c1 * deltaHSigma - this.c1 - this.cmu * this.covarianceWeightSum;
    const provisional = createZeroMatrix(this.dim);
    for (let rank = 0; rank < this.lambda; rank++) {
      const normalizedStep = normalizedSteps[rank];
      const covarianceWeight = adjustedCovarianceWeights[rank];
      for (let row = 0; row < this.dim; row++) {
        const weightedRow = covarianceWeight * normalizedStep[row];
        const provisionalRow = provisional[row];
        for (let column = row; column < this.dim; column++) {
          provisionalRow[column] += weightedRow * normalizedStep[column];
        }
      }
    }
    for (let row = 0; row < this.dim; row++) {
      for (let column = row; column < this.dim; column++) {
        const rankMu = provisional[row][column];
        const value =
          oldCoefficient * this.covariance[row][column] +
          this.c1 * this.pC[row] * this.pC[column] +
          this.cmu * rankMu;
        provisional[row][column] = value;
        provisional[column][row] = value;
      }
    }
    const repairedEigen = jacobiEigenSymmetric(provisional, Math.max(50, 5 * this.dim));
    this.covariance = reconstructSymmetric(repairedEigen.eigenvalues, repairedEigen.eigenvectors);
    this.currentEigen = repairedEigen;

    this.sigma = oldSigma * Math.exp(this.cs / this.damps * (pSigmaNorm / this.chiN - 1));
    if (!Number.isFinite(this.sigma)) this.sigma = this.sigma > 0 ? 1e16 : 1e-16;
    this.sigma = Math.min(1e16, Math.max(1e-16, this.sigma));
    this.generation++;

    const updatedEigen = this.currentEigen;
    const projectionBasis = this.alignProjectionBasis(updatedEigen.eigenvectors);
    const phenotypeMean = this.mean.map((value) => this.repair(value));
    candidates.forEach((candidate) => {
      const centered = candidate.x.map((value, dimension) => value - phenotypeMean[dimension]);
      candidate.projected3D = this.projectTo3D(centered, projectionBasis);
    });

    const totalVariance = updatedEigen.eigenvalues.reduce((sum, value) => sum + value, 0);
    const variancePercent = (index: number): number =>
      index < this.dim && totalVariance > 0 ? 100 * updatedEigen.eigenvalues[index] / totalVariance : 0;
    const radius = (index: number): number =>
      index < this.dim ? this.sigma * Math.sqrt(updatedEigen.eigenvalues[index]) : 0;
    const conditionNumber = updatedEigen.eigenvalues[0] / updatedEigen.eigenvalues[this.dim - 1];

    const phaseSpace3D: PhaseSpace3DProjection = {
      projectedMean: [0, 0, 0],
      ellipsoidRadii: [radius(0), radius(1), radius(2)],
      principalAxes3D: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
      eigenvalues: [...updatedEigen.eigenvalues],
      conditionNumber,
      varianceExplainedPercent: [variancePercent(0), variancePercent(1), variancePercent(2)],
      evolutionPath3D: this.projectTo3D(this.pC, projectionBasis),
      evolutionPathSigma3D: this.projectTo3D(this.pSigma, projectionBasis)
    };

    const variancePerDim = this.covariance.map((row, dimension) => this.sigma ** 2 * row[dimension]);
    const state: CMAESGenerationStateND = {
      generation: this.generation,
      mean: phenotypeMean,
      sigma: this.sigma,
      covariance: cloneMatrix(this.covariance),
      pSigma: [...this.pSigma],
      pC: [...this.pC],
      samples: candidates,
      bestFitness: this.bestFitness,
      bestX: [...this.bestX],
      eigenvalues: [...updatedEigen.eigenvalues],
      conditionNumber,
      evalCount: this.evalCount,
      phaseSpace3D,
      variancePerDim
    };
    this.history.push(state);
    return state;
  }
}
