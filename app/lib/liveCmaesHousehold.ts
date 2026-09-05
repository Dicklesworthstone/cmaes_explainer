// Household/HPO interface to the shared active-CMA implementation.
// Sampling, whitening, evolution paths and covariance updates have one owner.
import { CMAESOptimizerND } from "./cmaesEngineND";

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
  /** Initialize the search at a finite prior mean; omitted means the origin. */
  initialMean?: number[];
}

export class LiveCmaesOptimizer {
  private readonly engine: CMAESOptimizerND;

  constructor(config: CmaesOwnerConfig) {
    this.engine = new CMAESOptimizerND(null, {
      dim: config.dimension,
      lambda: config.populationSize,
      initialMean: config.initialMean ?? new Array(config.dimension).fill(0),
      initialSigma: config.initialSigma ?? 0.3,
      seed: config.seed ?? 42,
      repairStrategy: "none",
      activeCMA: true,
    });
  }

  public get state(): CmaesState {
    return {
      dimension: this.engine.dim,
      lambdaPopulation: this.engine.lambda,
      muElite: this.engine.mu,
      generation: this.engine.generation,
      mean: [...this.engine.mean],
      sigma: this.engine.sigma,
      covariance: this.engine.C,
      evolutionPathC: [...this.engine.pC],
      evolutionPathSigma: [...this.engine.pSigma],
      bestFitness: this.engine.bestFitness,
      bestParams: [...this.engine.bestX],
      fitnessHistory: this.engine.history.map((state) => state.bestFitness),
    };
  }

  public samplePopulation(mirrored = false): number[][] {
    return this.engine.ask(mirrored);
  }

  public tellEvaluations(
    candidates: number[][],
    fitnessValues: number[],
  ): { bestGenFitness: number; bestEverFitness: number } {
    const result = this.engine.tell(candidates, fitnessValues);
    return {
      bestGenFitness: result.samples[0].trueFitness,
      bestEverFitness: result.bestFitness,
    };
  }
}
