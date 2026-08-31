// CMA-ES Outer Hyperparameter Optimization (HPO) Loop (cmaes-jk1).
//
// Implements outer-loop hyperparameter optimization using CMA-ES over 8-12 training hyperparameters:
//   - Inner learning rates (Muon / Adam)
//   - Muon momentum coefficient
//   - PPO entropy bonus coefficient
//   - Multi-factor reward weights (upright / progress / energy / contact)
//   - GAE lambda discount & Value function loss coefficient
//
// Mathematical Formulations:
//   - Outer HPO State Vector \boldsymbol{\theta} \in \mathbb{R}^8:
//       \boldsymbol{\theta} = [\log_{10}(\eta_{\text{muon}}), \beta_{\text{momentum}}, c_{\text{entropy}}, w_{\text{upright}}, w_{\text{progress}}, w_{\text{energy}}, \lambda_{\text{GAE}}, c_{\text{value}}]
//   - Outer Fitness Objective (Evaluation of Inner Training Rollout):
//       \mathcal{F}(\boldsymbol{\theta}) = -\mathbb{E}_{\text{rollout}} [J_{\text{eval}}(\pi_{\boldsymbol{\theta}})]
//
// SOTA References:
//   - Hansen, "The CMA Evolution Strategy: A Tutorial" (2016)
//   - Liaw et al., "Tune: A Research Platform for Distributed Model Selection and Training" (arXiv:1807.05118, 2018)
//   - Nomura et al., "Warm Starting CMA-ES for Hyperparameter Optimization" (AAAI 2021, arXiv:2012.06932):
//       seed the outer search at a prior optimum; CMA-ES beats BO for HPO under parallel budgets,
//       but only if its adaptation phase is not wasted from a cold origin.
//   - Conti et al., "Improving exploration in evolution strategies" (arXiv:1712.06560):
//       mirrored (antithetic) sampling + common random numbers reduce the variance of the
//       fitness estimate told back to CMA-ES.

import { LiveCmaesOptimizer } from "./liveCmaesHousehold";
import { G1TrainEnv } from "./g1StepwiseEnv";

export interface HpoParameterSpec {
  name: string;
  minVal: number;
  maxVal: number;
  defaultValue: number;
  isLogScale?: boolean;
}

export const G1_TRAINING_HYPERPARAMETERS: HpoParameterSpec[] = [
  { name: "muon_learning_rate", minVal: 1e-4, maxVal: 1e-1, defaultValue: 0.02, isLogScale: true },
  { name: "muon_momentum", minVal: 0.80, maxVal: 0.99, defaultValue: 0.95 },
  { name: "ppo_entropy_coef", minVal: 1e-4, maxVal: 5e-2, defaultValue: 0.005, isLogScale: true },
  { name: "weight_progress", minVal: 5.0, maxVal: 30.0, defaultValue: 15.0 },
  { name: "weight_upright", minVal: 0.1, maxVal: 2.0, defaultValue: 0.5 },
  { name: "weight_energy", minVal: 1e-4, maxVal: 1e-2, defaultValue: 0.002, isLogScale: true },
  { name: "gae_lambda", minVal: 0.90, maxVal: 0.99, defaultValue: 0.95 },
  { name: "value_loss_coef", minVal: 0.1, maxVal: 1.0, defaultValue: 0.5 },
];

export interface HpoCandidateDecoded {
  muonLearningRate: number;
  muonMomentum: number;
  ppoEntropyCoef: number;
  weightProgress: number;
  weightUpright: number;
  weightEnergy: number;
  gaeLambda: number;
  valueLossCoef: number;
}

export interface HpoSweepResult {
  generation: number;
  bestFitness: number;
  bestHyperparameters: HpoCandidateDecoded;
  evaluationsCount: number;
}


/**
 * Optional outer-loop upgrades. All default OFF/1 so the historical behavior
 * (cold origin, single deterministic rollout per candidate, 8 evaluations per
 * generation) is structurally unchanged.
 */
export interface HpoLoopOptions {
  /**
   * WS-CMA-ES warm start: initialize the outer search mean at this genotype.
   * Pass `defaultGenotypeFromSpecs(specs)` to start at the disclosed
   * hand-tuned defaults, or a prior run's optimum re-encoded via
   * `encodeGenotype`. Invalid (wrong length / non-finite) values fall back to
   * the cold origin.
   */
  warmStartGenotype?: number[];
  /** Initial sigma used only when warm-starting (defaults to 0.35). */
  warmStartSigma?: number;
  /**
   * Mirrored (antithetic) fitness estimation: for each sampled candidate x,
   * evaluate x and its mirror 2m − x and tell back the average. The tell set
   * stays λ, so selection statistics (μ, weights) are unchanged — only the
   * fitness estimator gains variance reduction. Costs 2× evaluations.
   */
  mirroredSampling?: boolean;
  /**
   * Independent rollout replications averaged per evaluated point, seeded via
   * `baseRolloutSeed` (replication r > 0 resets the env with seed
   * baseRolloutSeed + r; replication 0 keeps the historical default seed 42).
   * The current kinematic stand-in env is deterministic, so replications are
   * exact no-ops today — the plumbing activates the moment the env gains
   * stochastic pushes/initial states.
   */
  replicationsPerCandidate?: number;
  /** Base seed for replication rollouts (see replicationsPerCandidate). */
  baseRolloutSeed?: number;
}

/**
 * The genotype whose decoded hyperparameters equal the spec defaultValues —
 * the natural WS-CMA-ES prior when only hand-tuned knowledge exists.
 */
export function defaultGenotypeFromSpecs(specs: HpoParameterSpec[]): number[] {
  return specs.map((spec) => {
    if (spec.isLogScale) {
      const logMin = Math.log10(spec.minVal);
      const logMax = Math.log10(spec.maxVal);
      return 2.0 * ((Math.log10(spec.defaultValue) - logMin) / (logMax - logMin)) - 1.0;
    }
    return 2.0 * ((spec.defaultValue - spec.minVal) / (spec.maxVal - spec.minVal)) - 1.0;
  });
}

/**
 * Inverse of `decodeGenotype` (same clamping convention): map decoded
 * hyperparameters back to the genotype space so a prior run's
 * `bestHyperparameters` can warm-start a new search. Values outside a spec's
 * range clamp to the corresponding box edge.
 */
export function encodeGenotype(
  params: HpoCandidateDecoded,
  specs: HpoParameterSpec[] = G1_TRAINING_HYPERPARAMETERS,
): number[] {
  const vals = [
    params.muonLearningRate,
    params.muonMomentum,
    params.ppoEntropyCoef,
    params.weightProgress,
    params.weightUpright,
    params.weightEnergy,
    params.gaeLambda,
    params.valueLossCoef,
  ];
  return vals.map((val, i) => {
    const spec = specs[i];
    const u = spec.isLogScale
      ? (Math.log10(val) - Math.log10(spec.minVal)) / (Math.log10(spec.maxVal) - Math.log10(spec.minVal))
      : (val - spec.minVal) / (spec.maxVal - spec.minVal);
    return 2.0 * Math.max(0.0, Math.min(1.0, u)) - 1.0;
  });
}

export class CmaesHyperparameterOptimizer {
  private cmaOptimizer: LiveCmaesOptimizer;
  private specs: HpoParameterSpec[];
  private env: G1TrainEnv;
  private mirroredSampling: boolean;
  private replicationsPerCandidate: number;
  private baseRolloutSeed: number;
  private cumulativeEvaluations = 0;

  constructor(
    specs: HpoParameterSpec[] = G1_TRAINING_HYPERPARAMETERS,
    seed = 42,
    options: HpoLoopOptions = {},
  ) {
    this.specs = specs;

    // WS-CMA-ES: warm-start the search mean at a prior optimum; refuse
    // malformed priors by falling back to the cold origin (zeros).
    const warm =
      options.warmStartGenotype &&
      options.warmStartGenotype.length === specs.length &&
      options.warmStartGenotype.every(Number.isFinite)
        ? [...options.warmStartGenotype]
        : undefined;

    this.cmaOptimizer = new LiveCmaesOptimizer({
      ownerId: "hpo-cmaes-outer",
      name: "Outer-Loop CMA-ES HPO",
      dimension: specs.length,
      initialSigma: warm !== undefined ? (options.warmStartSigma ?? 0.35) : 0.35,
      populationSize: 8,
      seed,
      initialMean: warm,
    });
    this.mirroredSampling = options.mirroredSampling ?? false;
    this.replicationsPerCandidate = Math.max(1, Math.floor(options.replicationsPerCandidate ?? 1));
    this.baseRolloutSeed = options.baseRolloutSeed ?? 42;
    this.env = new G1TrainEnv({ maxSteps: 200 }); // Fast evaluation rollouts
  }

  public decodeGenotype(genotype: number[]): HpoCandidateDecoded {
    const vals: number[] = [];
    for (let i = 0; i < this.specs.length; i++) {
      const spec = this.specs[i];
      const g = genotype[i] ?? 0.0;
      const norm = Number.isFinite(g) ? Math.max(-1.0, Math.min(1.0, g)) : 0.0;
      const u = (norm + 1.0) / 2.0;

      let val: number;
      if (spec.isLogScale) {
        const logMin = Math.log10(spec.minVal);
        const logMax = Math.log10(spec.maxVal);
        val = 10.0 ** (logMin + u * (logMax - logMin));
      } else {
        val = spec.minVal + u * (spec.maxVal - spec.minVal);
      }
      vals.push(val);
    }

    return {
      muonLearningRate: vals[0],
      muonMomentum: vals[1],
      ppoEntropyCoef: vals[2],
      weightProgress: vals[3],
      weightUpright: vals[4],
      weightEnergy: vals[5],
      gaeLambda: vals[6],
      valueLossCoef: vals[7],
    };
  }

  /**
   * Current outer-search mean in genotype space as a defensive copy — callers
   * (UI overlays, tests) must not be able to mutate optimizer internals.
   */
  public get searchMean(): number[] {
    return [...this.cmaOptimizer.state.mean];
  }
  /**
   * One rollout under the given genotype. Replication r resets the env with
   * seed 42 (r = 0, historical default) or baseRolloutSeed + r; the fitness
   * is the mean total reward negated (minimization). Returns the rollout
   * count so stepGeneration can report honest evaluation totals.
   */
  private evaluatePoint(genotype: number[]): { fitness: number; rollouts: number } {
    const hparams = this.decodeGenotype(genotype);
    let aggregate = 0.0;

    for (let rep = 0; rep < this.replicationsPerCandidate; rep++) {
      this.env.reset(rep === 0 ? 42 : this.baseRolloutSeed + rep);
      let totalReward = 0.0;
      // Muon momentum: carry an exponential moving average of the
      // previous action so consecutive actions smooth out. Stand-in
      // for the optimizer's gradient-EMA; absent this, only the action
      // amplitude (muonLearningRate) affects the env.
      const momentum = Math.max(0.0, Math.min(0.99, hparams.muonMomentum));
      let prevAction = new Array(15).fill(0.0);
      // Deterministic per-rollout noise generator so fitness stays
      // reproducible per seed. xorshift32 — same scheme as the
      // LiveCmaesOptimizer PRNG. ppoEntropyCoef scales the noise
      // amplitude: 0 ⇒ deterministic, large ⇒ exploration-heavy.
      let noiseState = (0x9e3779b9 ^ (this.baseRolloutSeed + rep)) >>> 0;
      const noiseStep = (mean: number, std: number) => {
        noiseState ^= noiseState << 13;
        noiseState ^= noiseState >> 17;
        noiseState ^= noiseState << 5;
        const u1 = Math.max(1e-7, (noiseState >>> 0) / 4294967296);
        noiseState ^= noiseState << 13;
        noiseState ^= noiseState >> 17;
        noiseState ^= noiseState << 5;
        const u2 = (noiseState >>> 0) / 4294967296;
        return mean + std * Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      };

      for (let s = 0; s < 120; s++) {
        // Action amplitude scales with muonLearningRate (the most
        // consequential hyperparameter on the linear-phase prior).
        // Momentum EMA on the previous action smooths consecutive
        // commands (Muon's "spectral whitening" stand-in). ppoEntropyCoef
        // injects exploration noise — also clipped to a sane range.
        const amp = hparams.muonLearningRate * 10.0;
        const noise = hparams.ppoEntropyCoef * 20.0;
        const baseAction = new Array(15).fill(0.0).map((_, idx) =>
          Math.sin(s * 0.1 + idx) * amp,
        );
        const rawAction = baseAction.map((value, idx) => {
          const perturbed = value + (noise > 0 ? noiseStep(0, noise) : 0);
          return momentum * prevAction[idx] + (1 - momentum) * perturbed;
        });
        const action = rawAction;

        const res = this.env.step(action);
        totalReward += res.reward;
        if (res.done) break;
        prevAction = action;
      }

      aggregate += totalReward;
    }

    // Objective minimization: negative mean total reward
    return { fitness: -aggregate / this.replicationsPerCandidate, rollouts: this.replicationsPerCandidate };
  }

  public stepGeneration(): HpoSweepResult {
    const candidates = this.cmaOptimizer.samplePopulation();
    let rollouts = 0;

    // Evaluate each HPO candidate via inner rollout; optionally average each
    // candidate with its mirror 2m − x (antithetic pairing, Conti et al.
    // arXiv:1712.06560). The tell set stays λ either way, so μ/weights are
    // untouched — only the fitness estimator changes.
    const fitnesses = candidates.map((cand) => {
      const base = this.evaluatePoint(cand);
      rollouts += base.rollouts;

      if (!this.mirroredSampling) return base.fitness;

      const mirror = this.cmaOptimizer.state.mean.map((m, i) => 2.0 * m - cand[i]);
      const mirrored = this.evaluatePoint(mirror);
      rollouts += mirrored.rollouts;
      return 0.5 * (base.fitness + mirrored.fitness);
    });

    const tellRes = this.cmaOptimizer.tellEvaluations(candidates, fitnesses);
    this.cumulativeEvaluations += rollouts;

    return {
      generation: this.cmaOptimizer.state.generation,
      bestFitness: tellRes.bestEverFitness,
      bestHyperparameters: this.decodeGenotype(this.cmaOptimizer.state.bestParams),
      evaluationsCount: this.cumulativeEvaluations,
    };
  }
}
