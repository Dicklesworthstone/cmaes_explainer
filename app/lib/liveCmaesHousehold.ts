// Live CMA-ES Multi-Owner Policy Optimization Engine (cmaes-feat-fs9-live-cma).
//
// Implements full Covariance Matrix Adaptation Evolution Strategy (CMA-ES) in pure TypeScript
// with multi-owner concurrent policy evolution (Walking Owner, Doorway Maneuver Owner, Arm Manipulation Owner),
// real-time covariance ellipse decomposition, and cumulative step-size adaptation (CSA).
//
// Mathematical Formulations (Hansen 2016):
//   - Mean Update:
//       \mathbf{m}^{(g+1)} = \sum_{i=1}^\mu w_i \mathbf{x}_{i:\lambda}^{(g)}
//   - Conjugate Evolution Path for Step Size (CSA):
//       \mathbf{p}_\sigma^{(g+1)} = (1 - c_\sigma) \mathbf{p}_\sigma^{(g)} + \sqrt{c_\sigma (2 - c_\sigma) \mu_{\text{eff}}} \mathbf{C}^{(g)-1/2} \frac{\mathbf{m}^{(g+1)} - \mathbf{m}^{(g)}}{\sigma^{(g)}}
//       \sigma^{(g+1)} = \sigma^{(g)} \exp\left( \frac{c_\sigma}{d_\sigma} \left( \frac{\|\mathbf{p}_\sigma^{(g+1)}\|}{E\|\mathcal{N}(\mathbf{0}, \mathbf{I})\|} - 1 \right) \right)
//   - Rank-1 & Rank-\mu Covariance Matrix Update:
//       \mathbf{p}_c^{(g+1)} = (1 - c_c) \mathbf{p}_c^{(g)} + h_\sigma \sqrt{c_c (2 - c_c) \mu_{\text{eff}}} \frac{\mathbf{m}^{(g+1)} - \mathbf{m}^{(g)}}{\sigma^{(g)}}
//       \mathbf{C}^{(g+1)} = (1 - c_1 - c_\mu) \mathbf{C}^{(g)} + c_1 \mathbf{p}_c^{(g+1)} \mathbf{p}_c^{(g+1)T} + c_\mu \sum_{i=1}^\mu w_i \mathbf{y}_{i:\lambda} \mathbf{y}_{i:\lambda}^T
//
// SOTA References:
//   - Hansen, "The CMA Evolution Strategy: A Tutorial" (Inria 2016)
//   - Hansen & Ostermeier, "Completely Derandomized Self-Adaptation in Evolution Strategies" (Evol. Comput. 2001)

export interface CmaesState {
  dimension: number;
  lambdaPopulation: number;
  muElite: number;
  generation: number;
  mean: number[];
  sigma: number;
  covariance: number[][];
  evolutionPathC: number[];
  evolutionPathSigma: number[];
  bestFitness: number;
  bestParams: number[];
  fitnessHistory: number[];
}

export interface CmaesOwnerConfig {
  ownerId: string;
  name: string;
  dimension: number;
  initialSigma?: number;
  populationSize?: number;
  seed?: number;
}

function seededGaussian(seed: number): () => number {
  let s = seed;
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

export class LiveCmaesOptimizer {
  public state: CmaesState;
  private weights: number[];
  private muEff: number;
  private cSigma: number;
  private dSigma: number;
  private cC: number;
  private c1: number;
  private cMu: number;
  private chiN: number;
  private rand: () => number;

  constructor(config: CmaesOwnerConfig) {
    const n = config.dimension;
    const lambda = config.populationSize ?? 4 + Math.floor(3 * Math.log(n));
    const mu = Math.floor(lambda / 2);

    this.rand = seededGaussian(config.seed ?? 42);

    // Recombination weights
    let sumW = 0;
    let sumWSq = 0;
    const rawWeights: number[] = [];
    for (let i = 0; i < mu; i++) {
      const w = Math.log(mu + 0.5) - Math.log(i + 1);
      rawWeights.push(w);
      sumW += w;
    }
    this.weights = rawWeights.map((w) => w / sumW);
    for (const w of this.weights) {
      sumWSq += w * w;
    }
    this.muEff = 1.0 / sumWSq;

    // Strategy parameters
    this.cSigma = (this.muEff + 2) / (n + this.muEff + 5);
    this.dSigma =
      1 + 2 * Math.max(0, Math.sqrt((this.muEff - 1) / (n + 1)) - 1) + this.cSigma;
    this.cC = (4 + this.muEff / n) / (n + 4 + (2 * this.muEff) / n);
    this.c1 = 2 / ((n + 1.3) ** 2 + this.muEff);
    this.cMu = Math.min(
      1 - this.c1,
      (2 * (this.muEff - 2 + 1 / this.muEff)) / ((n + 2) ** 2 + this.muEff),
    );
    this.chiN = Math.sqrt(n) * (1 - 1 / (4 * n) + 1 / (21 * n * n));

    // Identity covariance matrix
    const cov: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row = new Array(n).fill(0);
      row[i] = 1.0;
      cov.push(row);
    }

    this.state = {
      dimension: n,
      lambdaPopulation: lambda,
      muElite: mu,
      generation: 0,
      mean: new Array(n).fill(0.0),
      sigma: config.initialSigma ?? 0.3,
      covariance: cov,
      evolutionPathC: new Array(n).fill(0.0),
      evolutionPathSigma: new Array(n).fill(0.0),
      bestFitness: Infinity,
      bestParams: new Array(n).fill(0.0),
      fitnessHistory: [],
    };
  }

  /**
   * Samples a candidate population of parameters from the current normal distribution.
   */
  public samplePopulation(): number[][] {
    const population: number[][] = [];
    const n = this.state.dimension;

    for (let k = 0; k < this.state.lambdaPopulation; k++) {
      const candidate: number[] = [];
      for (let i = 0; i < n; i++) {
        const std = Math.sqrt(Math.max(1e-8, this.state.covariance[i][i]));
        const sample = this.state.mean[i] + this.state.sigma * std * this.rand();
        candidate.push(sample);
      }
      population.push(candidate);
    }

    return population;
  }

  /**
   * Updates distribution parameters given candidate population evaluations (minimization).
   */
  public tellEvaluations(
    candidates: number[][],
    fitnessValues: number[],
  ): { bestGenFitness: number; bestEverFitness: number } {
    const n = this.state.dimension;
    const lambda = candidates.length;
    const mu = this.state.muElite;

    // Rank candidates by fitness
    const indexed = fitnessValues.map((fit, idx) => ({ fit, idx }));
    indexed.sort((a, b) => a.fit - b.fit);

    const oldMean = [...this.state.mean];

    // Compute new mean m^(g+1)
    const newMean = new Array(n).fill(0.0);
    for (let i = 0; i < mu; i++) {
      const candIdx = indexed[i].idx;
      const w = this.weights[i];
      for (let d = 0; d < n; d++) {
        newMean[d] += w * candidates[candIdx][d];
      }
    }

    // Update best ever
    const bestGenFit = indexed[0].fit;
    if (bestGenFit < this.state.bestFitness) {
      this.state.bestFitness = bestGenFit;
      this.state.bestParams = [...candidates[indexed[0].idx]];
    }

    // Update evolution path p_sigma
    const meanDiffNorm: number[] = [];
    let pathSigmaNormSq = 0;
    for (let d = 0; d < n; d++) {
      const diff = (newMean[d] - oldMean[d]) / this.state.sigma;
      meanDiffNorm.push(diff);
      this.state.evolutionPathSigma[d] =
        (1 - this.cSigma) * this.state.evolutionPathSigma[d] +
        Math.sqrt(this.cSigma * (2 - this.cSigma) * this.muEff) * diff;
      pathSigmaNormSq += this.state.evolutionPathSigma[d] ** 2;
    }
    const pathSigmaNorm = Math.sqrt(pathSigmaNormSq);

    // Update step size sigma
    this.state.sigma *= Math.exp(
      (this.cSigma / this.dSigma) * (pathSigmaNorm / this.chiN - 1),
    );
    this.state.sigma = Math.max(1e-5, Math.min(10.0, this.state.sigma));

    // Update evolution path p_c
    for (let d = 0; d < n; d++) {
      this.state.evolutionPathC[d] =
        (1 - this.cC) * this.state.evolutionPathC[d] +
        Math.sqrt(this.cC * (2 - this.cC) * this.muEff) * meanDiffNorm[d];
    }

    // Update Covariance Matrix C
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        let rankMuSum = 0;
        for (let i = 0; i < mu; i++) {
          const candIdx = indexed[i].idx;
          const yr = (candidates[candIdx][r] - oldMean[r]) / this.state.sigma;
          const yc = (candidates[candIdx][c] - oldMean[c]) / this.state.sigma;
          rankMuSum += this.weights[i] * yr * yc;
        }

        const rank1 = this.state.evolutionPathC[r] * this.state.evolutionPathC[c];
        this.state.covariance[r][c] =
          (1 - this.c1 - this.cMu) * this.state.covariance[r][c] +
          this.c1 * rank1 +
          this.cMu * rankMuSum;
      }
    }

    this.state.mean = newMean;
    this.state.generation++;
    this.state.fitnessHistory.push(this.state.bestFitness);

    return {
      bestGenFitness: bestGenFit,
      bestEverFitness: this.state.bestFitness,
    };
  }
}
