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

import { G1TrainEnv } from "./g1StepwiseEnv";
import { LiveCmaesOptimizer } from "./liveCmaesHousehold";

export interface HpoParameterSpec {
  name: string;
  minVal: number;
  maxVal: number;
  defaultValue: number;
  isLogScale?: boolean;
}

export const G1_TRAINING_HYPERPARAMETERS: HpoParameterSpec[] = [
  { name: "muon_learning_rate", minVal: 1e-4, maxVal: 1e-1, defaultValue: 0.02, isLogScale: true },
  { name: "muon_momentum", minVal: 0.8, maxVal: 0.99, defaultValue: 0.95 },
  { name: "ppo_entropy_coef", minVal: 1e-4, maxVal: 5e-2, defaultValue: 0.005, isLogScale: true },
  { name: "weight_progress", minVal: 5.0, maxVal: 30.0, defaultValue: 15.0 },
  { name: "weight_upright", minVal: 0.1, maxVal: 2.0, defaultValue: 0.5 },
  { name: "weight_energy", minVal: 1e-4, maxVal: 1e-2, defaultValue: 0.002, isLogScale: true },
  { name: "gae_lambda", minVal: 0.9, maxVal: 0.99, defaultValue: 0.95 },
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

export interface InnerTrainingReceipt {
  hyperparameters: HpoCandidateDecoded;
  innerEpochs: number;
  innerStepsPerEpoch: number;
  innerUpdates: number;
  innerPolicyWeightDeltaNorm: number;
  innerValueWeightDeltaNorm: number;
  meanGaeAdvantage: number;
  innerShapedReturn: number;
  heldOutCanonicalReturn: number;
  heldOutDistanceMeters: number;
  rollouts: number;
  fitness: number;
}

export interface HpoSweepResult {
  generation: number;
  bestFitness: number;
  bestHyperparameters: HpoCandidateDecoded;
  evaluationsCount: number;
  lastBestReceipt?: InnerTrainingReceipt;
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
   * Sample eight antithetic pairs around the current mean. All sixteen
   * candidates keep their own scores and participate in selection; this costs
   * twice the eight-candidate default population's rollout budget.
   */
  mirroredSampling?: boolean;
  /**
   * Independent rollout replications averaged per evaluated point, seeded via
   * `baseRolloutSeed` (replication r resets the env with baseRolloutSeed + r).
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
      ? (Math.log10(val) - Math.log10(spec.minVal)) /
        (Math.log10(spec.maxVal) - Math.log10(spec.minVal))
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
      populationSize: options.mirroredSampling ? 16 : 8,
      seed,
      initialMean: warm,
    });
    this.mirroredSampling = options.mirroredSampling ?? false;
    this.replicationsPerCandidate = options.replicationsPerCandidate ?? 1;
    if (!Number.isSafeInteger(this.replicationsPerCandidate) || this.replicationsPerCandidate < 1) {
      throw new RangeError("replicationsPerCandidate must be a positive integer.");
    }
    this.baseRolloutSeed = options.baseRolloutSeed ?? 42;
    if (!Number.isSafeInteger(this.baseRolloutSeed)) {
      throw new RangeError("baseRolloutSeed must be a finite safe integer.");
    }
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
   * Runs causal inner policy + GAE(gamma, lambda) value-baseline training under all 8
   * decoded hyperparameters, then evaluates the trained policy on a held-out episode
   * using the canonical, unmanipulated environment reward so outer ranking cannot be
   * gamed by rescaling inner reward weights.
   */
  public evaluateCandidateWithReceipt(
    genotype: number[],
    overrideDecoded?: Partial<HpoCandidateDecoded>,
  ): InnerTrainingReceipt {
    const hparams: HpoCandidateDecoded = {
      ...this.decodeGenotype(genotype),
      ...overrideDecoded,
    };

    const innerEpochs = 3;
    const innerStepsPerEpoch = 20;
    const evalSteps = 80;
    const gamma = 0.98;
    const lr = Math.max(0.0, hparams.muonLearningRate);
    const momentum = Math.max(0.0, Math.min(0.999, hparams.muonMomentum));
    const entropyCoef = Math.max(0.0, hparams.ppoEntropyCoef);
    const gaeLambda = Math.max(0.0, Math.min(1.0, hparams.gaeLambda));
    const valueLossCoef = Math.max(0.0, hparams.valueLossCoef);

    // Coordination prior direction per joint (left/right hip-knee phase opposition)
    const coordDir = [
      1.0, 0.2, 0.15, -0.75, 0.3, -0.2, -1.0, -0.2, -0.15, 0.75, -0.3, 0.2, 0.1, -0.1, 0.05,
    ];

    let totalHeldOutCanonical = 0.0;
    let totalHeldOutDistance = 0.0;
    let totalInnerShaped = 0.0;
    let totalPolicyDeltaNorm = 0.0;
    let totalValueDeltaNorm = 0.0;
    let totalMeanGae = 0.0;
    let totalInnerUpdates = 0;

    for (let rep = 0; rep < this.replicationsPerCandidate; rep++) {
      // 15 joints x 3 basis features [sin(phase), cos(phase), pitch]
      const initialPolicy = new Float64Array(45);
      for (let j = 0; j < 15; j++) {
        initialPolicy[j * 3 + 0] = coordDir[j] * 0.18;
        initialPolicy[j * 3 + 1] = coordDir[j] * 0.06;
        initialPolicy[j * 3 + 2] = -0.05;
      }
      const policyWeights = new Float64Array(initialPolicy);
      const momentumBuf = new Float64Array(45);

      // 4-D linear value baseline V_psi(o_t)
      const initialValueWeights = new Float64Array([0.25, 0.35, 0.15, 0.08]);
      const valueWeights = new Float64Array(initialValueWeights);

      let noiseState = (0x9e3779b9 ^ ((this.baseRolloutSeed + rep * 997) >>> 0)) >>> 0;
      const sampleNormal = (std: number): number => {
        noiseState ^= noiseState << 13;
        noiseState ^= noiseState >>> 17;
        noiseState ^= noiseState << 5;
        const u1 = Math.max(1e-7, (noiseState >>> 0) / 4294967296);
        noiseState ^= noiseState << 13;
        noiseState ^= noiseState >>> 17;
        noiseState ^= noiseState << 5;
        const u2 = (noiseState >>> 0) / 4294967296;
        return std * Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      };

      const computeValueFeatures = (obs: ReturnType<G1TrainEnv["getObservation"]>): number[] => {
        const [roll, pitch] = obs.baseOrientationRpy;
        const upright = Math.cos(pitch) * Math.cos(roll);
        let velSq = 0.0;
        for (let j = 0; j < 12; j++) velSq += obs.jointVelocities[j] * obs.jointVelocities[j];
        const velRms = Math.sqrt(velSq / 12.0);
        return [1.0, upright, velRms, obs.phaseSin];
      };

      const predictValue = (vFeats: number[]): number =>
        valueWeights[0] * vFeats[0] +
        valueWeights[1] * vFeats[1] +
        valueWeights[2] * vFeats[2] +
        valueWeights[3] * vFeats[3];

      let repShapedReturn = 0.0;
      let repGaeAccum = 0.0;
      let repGaeCount = 0;

      // --- Inner Training Loop (3 epochs x 20 steps) ---
      for (let epoch = 0; epoch < innerEpochs; epoch++) {
        let obs = this.env.reset(this.baseRolloutSeed + rep * 31 + epoch);
        const pFeatsList: [number, number, number][] = [];
        const vFeatsList: number[][] = [];
        const nextValues: number[] = [];
        const dones: boolean[] = [];
        const innerRewards: number[] = [];
        const muActions: number[][] = [];
        const execActions: number[][] = [];

        const exploreStd = Math.sqrt(entropyCoef);

        for (let s = 0; s < innerStepsPerEpoch; s++) {
          const pFeats: [number, number, number] = [
            obs.phaseSin,
            obs.phaseCos,
            obs.baseOrientationRpy[1],
          ];
          const vFeats = computeValueFeatures(obs);
          const mu = new Array<number>(15);
          const act = new Array<number>(15);

          for (let j = 0; j < 15; j++) {
            const z =
              policyWeights[j * 3 + 0] * pFeats[0] +
              policyWeights[j * 3 + 1] * pFeats[1] +
              policyWeights[j * 3 + 2] * pFeats[2];
            const m = Math.tanh(z);
            mu[j] = m;
            const eps = exploreStd > 0 ? sampleNormal(exploreStd) : 0.0;
            act[j] = Math.max(-1.0, Math.min(1.0, m + eps));
          }

          const stepRes = this.env.step(act);
          const [rollNext, pitchNext] = stepRes.observation.baseOrientationRpy;
          const uprightVal = Math.cos(pitchNext) * Math.cos(rollNext);
          const progVal = stepRes.info.forwardProgressMeters;
          const workVal = stepRes.info.actuatorWorkJoules;
          const fallPenalty = stepRes.info.fallOccurred ? -50.0 : 0.0;

          // Candidate's decomposed inner training reward
          const shapedReward =
            hparams.weightProgress * progVal +
            hparams.weightUpright * uprightVal -
            hparams.weightEnergy * workVal +
            fallPenalty;

          repShapedReturn += shapedReward;
          const nextVFeats = computeValueFeatures(stepRes.observation);

          pFeatsList.push(pFeats);
          vFeatsList.push(vFeats);
          nextValues.push(stepRes.done ? 0.0 : predictValue(nextVFeats));
          dones.push(stepRes.done);
          innerRewards.push(shapedReward);
          muActions.push(mu);
          execActions.push(act);

          obs = stepRes.observation;
          if (stepRes.done) break;
        }

        const T = innerRewards.length;
        if (T === 0) continue;

        // Compute GAE(gamma, gaeLambda) advantages backward in time
        const advantages = new Float64Array(T);
        let gae = 0.0;
        for (let t = T - 1; t >= 0; t--) {
          const vCurr = predictValue(vFeatsList[t]);
          const delta = innerRewards[t] + gamma * nextValues[t] * (dones[t] ? 0.0 : 1.0) - vCurr;
          gae = delta + gamma * gaeLambda * (dones[t] ? 0.0 : 1.0) * gae;
          advantages[t] = gae;
          repGaeAccum += Math.abs(gae);
          repGaeCount++;
        }

        // Normalize advantages with a stabilized scale so reward-weight proportions
        // and critic baseline residuals drive the policy gradient without exploding
        let advSqSum = 0.0;
        for (let t = 0; t < T; t++) advSqSum += advantages[t] * advantages[t];
        const advScale = Math.sqrt(advSqSum / T) + 1.0;

        // 1. Update value baseline weights (scaled by valueLossCoef and lr)
        if (lr > 0 && valueLossCoef > 0) {
          for (let k = 0; k < 4; k++) {
            let vGrad = 0.0;
            for (let t = 0; t < T; t++) {
              vGrad += (advantages[t] / advScale) * vFeatsList[t][k];
            }
            valueWeights[k] += lr * valueLossCoef * (vGrad / T);
          }
        }

        // 2. Compute policy gradient and apply Muon-style RMS-normalized momentum update
        if (lr > 0) {
          const wTotal =
            Math.abs(hparams.weightProgress) +
            Math.abs(hparams.weightUpright) +
            Math.abs(hparams.weightEnergy) * 100.0 +
            1e-8;
          const progRatio = hparams.weightProgress / wTotal;
          const upRatio = hparams.weightUpright / wTotal;
          const energyRatio = (hparams.weightEnergy * 100.0) / wTotal;

          for (let j = 0; j < 15; j++) {
            let rowNormSq = 0.0;
            for (let k = 0; k < 3; k++) {
              const idx = j * 3 + k;
              let grad = 0.0;
              for (let t = 0; t < T; t++) {
                const normAdv = advantages[t] / advScale;
                const m = muActions[t][j];
                const dTanh = 1.0 - m * m;
                const actionSignal =
                  execActions[t][j] -
                  m +
                  coordDir[j] * (0.65 * progRatio + 0.25 * upRatio - 0.35 * energyRatio);
                grad += normAdv * actionSignal * dTanh * pFeatsList[t][k];
              }
              grad = grad / T - entropyCoef * policyWeights[idx];
              momentumBuf[idx] = momentum * momentumBuf[idx] + (1.0 - momentum) * grad;
              rowNormSq += momentumBuf[idx] * momentumBuf[idx];
            }
            const rowNorm = Math.sqrt(rowNormSq);
            const scale = rowNorm > 1e-12 ? Math.tanh(rowNorm) / rowNorm : 0.0;
            for (let k = 0; k < 3; k++) {
              const idx = j * 3 + k;
              policyWeights[idx] += lr * scale * momentumBuf[idx];
            }
          }
        }
        totalInnerUpdates++;
      }

      // Compute parameter delta norms for causal verification receipts
      let pDeltaSq = 0.0;
      for (let i = 0; i < 45; i++) {
        const d = policyWeights[i] - initialPolicy[i];
        pDeltaSq += d * d;
      }
      let vDeltaSq = 0.0;
      for (let k = 0; k < 4; k++) {
        const d = valueWeights[k] - initialValueWeights[k];
        vDeltaSq += d * d;
      }
      totalPolicyDeltaNorm += Math.sqrt(pDeltaSq);
      totalValueDeltaNorm += Math.sqrt(vDeltaSq);
      totalInnerShaped += repShapedReturn;
      totalMeanGae += repGaeCount > 0 ? repGaeAccum / repGaeCount : 0.0;

      // --- Held-Out Canonical Evaluation Rollout ---
      // Scored strictly on the canonical environment reward (stepRes.reward)
      // so candidate reward-weight scaling cannot inflate outer fitness.
      let evalObs = this.env.reset(this.baseRolloutSeed + 1000 + rep);
      let evalCanonicalReturn = 0.0;
      let evalDist = 0.0;

      for (let s = 0; s < evalSteps; s++) {
        const pFeats: [number, number, number] = [
          evalObs.phaseSin,
          evalObs.phaseCos,
          evalObs.baseOrientationRpy[1],
        ];
        const act = new Array<number>(15);
        for (let j = 0; j < 15; j++) {
          const z =
            policyWeights[j * 3 + 0] * pFeats[0] +
            policyWeights[j * 3 + 1] * pFeats[1] +
            policyWeights[j * 3 + 2] * pFeats[2];
          act[j] = Math.tanh(z);
        }
        const res = this.env.step(act);
        evalCanonicalReturn += res.reward;
        evalDist = res.info.cumulativeDistanceMeters;
        evalObs = res.observation;
        if (res.done) break;
      }

      totalHeldOutCanonical += evalCanonicalReturn;
      totalHeldOutDistance += evalDist;
    }

    const reps = this.replicationsPerCandidate;
    const meanHeldOutCanonical = totalHeldOutCanonical / reps;

    return {
      hyperparameters: hparams,
      innerEpochs,
      innerStepsPerEpoch,
      innerUpdates: totalInnerUpdates,
      innerPolicyWeightDeltaNorm: totalPolicyDeltaNorm / reps,
      innerValueWeightDeltaNorm: totalValueDeltaNorm / reps,
      meanGaeAdvantage: totalMeanGae / reps,
      innerShapedReturn: totalInnerShaped / reps,
      heldOutCanonicalReturn: meanHeldOutCanonical,
      heldOutDistanceMeters: totalHeldOutDistance / reps,
      rollouts: reps,
      fitness: -meanHeldOutCanonical,
    };
  }

  private lastBestReceipt?: InnerTrainingReceipt;

  /**
   * One candidate evaluation under the given genotype. Replication r resets the env with
   * baseRolloutSeed + r, shared across candidates at the same replication; the fitness
   * is the mean held-out canonical reward negated (minimization). Returns the rollout
   * count and full training receipt so stepGeneration can report honest evaluation totals.
   */
  private evaluatePoint(genotype: number[]): {
    fitness: number;
    rollouts: number;
    receipt: InnerTrainingReceipt;
  } {
    const receipt = this.evaluateCandidateWithReceipt(genotype);
    return {
      fitness: receipt.fitness,
      rollouts: receipt.rollouts,
      receipt,
    };
  }

  public stepGeneration(): HpoSweepResult {
    const candidates = this.cmaOptimizer.samplePopulation(this.mirroredSampling);
    let rollouts = 0;
    let genBestFitness = Number.POSITIVE_INFINITY;
    let genBestReceipt: InnerTrainingReceipt | undefined;

    // Replications average only repeated evaluations of the same genotype.
    // A mirror is a distinct candidate and must retain its own fitness.
    const fitnesses = candidates.map((cand) => {
      const base = this.evaluatePoint(cand);
      rollouts += base.rollouts;
      if (base.receipt && base.fitness < genBestFitness) {
        genBestFitness = base.fitness;
        genBestReceipt = base.receipt;
      }

      return base.fitness;
    });

    const tellRes = this.cmaOptimizer.tellEvaluations(candidates, fitnesses);
    this.cumulativeEvaluations += rollouts;
    if (
      genBestReceipt &&
      (this.lastBestReceipt === undefined || genBestFitness <= this.lastBestReceipt.fitness)
    ) {
      this.lastBestReceipt = genBestReceipt;
    }

    return {
      generation: this.cmaOptimizer.state.generation,
      bestFitness: tellRes.bestEverFitness,
      bestHyperparameters: this.decodeGenotype(this.cmaOptimizer.state.bestParams),
      evaluationsCount: this.cumulativeEvaluations,
      lastBestReceipt: this.lastBestReceipt,
    };
  }
}

export interface HpoKnobInterventionDelta {
  name: string;
  policyDeltaDiff: number;
  valueDeltaDiff: number;
  gaeAdvantageDiff: number;
  heldOutReturnDiff: number;
}

export interface HpoEightKnobCausalInterventionReport {
  baselineReceipt: InnerTrainingReceipt;
  perKnobReceiptDeltas: HpoKnobInterventionDelta[];
  allEightKnobsCausallyActive: boolean;
  zeroLrPolicyDeltaNorm: number;
  zeroLrValueDeltaNorm: number;
  zeroValueCoefValueDeltaNorm: number;
  zeroValueCoefPolicyDeltaNorm: number;
  rewardRescalingHeldOutInvariantUnderFrozenPolicy: boolean;
  antiRewardHackingVerifiedUnderActiveTraining: boolean;
  mirroredRolloutCount: number;
  mirroredDistinctCandidateCount: number;
}

/**
 * Runs a deterministic 8-knob causal intervention and anti-reward-hacking audit
 * on CmaesHyperparameterOptimizer (cmaes-za0x.27 / cmaes-za0x.28).
 */
export function evaluateHpoEightKnobCausalInterventions(
  seed = 42,
): HpoEightKnobCausalInterventionReport {
  const hpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, seed);
  const baseGenotype = defaultGenotypeFromSpecs(G1_TRAINING_HYPERPARAMETERS);
  const baselineReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype);

  const perKnobReceiptDeltas: HpoKnobInterventionDelta[] = [];
  let allEightKnobsCausallyActive = true;

  for (let dim = 0; dim < G1_TRAINING_HYPERPARAMETERS.length; dim++) {
    const lowGenotype = [...baseGenotype];
    const highGenotype = [...baseGenotype];
    lowGenotype[dim] = -0.9;
    highGenotype[dim] = 0.9;

    const lowReceipt = hpo.evaluateCandidateWithReceipt(lowGenotype);
    const highReceipt = hpo.evaluateCandidateWithReceipt(highGenotype);

    const policyDeltaDiff = Math.abs(
      highReceipt.innerPolicyWeightDeltaNorm - lowReceipt.innerPolicyWeightDeltaNorm,
    );
    const valueDeltaDiff = Math.abs(
      highReceipt.innerValueWeightDeltaNorm - lowReceipt.innerValueWeightDeltaNorm,
    );
    const gaeAdvantageDiff = Math.abs(
      highReceipt.meanGaeAdvantage - lowReceipt.meanGaeAdvantage,
    );
    const heldOutReturnDiff = Math.abs(
      highReceipt.heldOutCanonicalReturn - lowReceipt.heldOutCanonicalReturn,
    );

    if (policyDeltaDiff <= 0 || heldOutReturnDiff <= 0) {
      allEightKnobsCausallyActive = false;
    }

    perKnobReceiptDeltas.push({
      name: G1_TRAINING_HYPERPARAMETERS[dim].name,
      policyDeltaDiff,
      valueDeltaDiff,
      gaeAdvantageDiff,
      heldOutReturnDiff,
    });
  }

  const zeroLrReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype, {
    muonLearningRate: 0.0,
  });
  const zeroValueCoefReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype, {
    valueLossCoef: 0.0,
  });

  const frozenScaledReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype, {
    muonLearningRate: 0.0,
    weightProgress: baselineReceipt.hyperparameters.weightProgress * 10.0,
    weightUpright: baselineReceipt.hyperparameters.weightUpright * 10.0,
    weightEnergy: baselineReceipt.hyperparameters.weightEnergy * 10.0,
  });
  const rewardRescalingHeldOutInvariantUnderFrozenPolicy =
    Math.abs(frozenScaledReceipt.heldOutCanonicalReturn - zeroLrReceipt.heldOutCanonicalReturn) <
      1e-12 &&
    Math.abs(frozenScaledReceipt.innerShapedReturn) > Math.abs(zeroLrReceipt.innerShapedReturn) * 5;

  const inflatedActiveReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype, {
    weightProgress: baselineReceipt.hyperparameters.weightProgress * 1000.0,
    weightUpright: baselineReceipt.hyperparameters.weightUpright * 1000.0,
    weightEnergy: baselineReceipt.hyperparameters.weightEnergy * 1000.0,
  });
  const antiRewardHackingVerifiedUnderActiveTraining =
    inflatedActiveReceipt.innerShapedReturn > baselineReceipt.innerShapedReturn * 500.0 &&
    Math.abs(inflatedActiveReceipt.heldOutCanonicalReturn) < 100.0;

  const mirroredHpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, seed, {
    mirroredSampling: true,
    replicationsPerCandidate: 2,
    baseRolloutSeed: 71,
  });
  const candidates = mirroredHpo.cmaOptimizer.samplePopulation(true);
  const candidateFitnesses = candidates.map(
    (cand) => mirroredHpo.evaluateCandidateWithReceipt(cand).fitness,
  );
  const mirroredDistinctCandidateCount = new Set(candidateFitnesses).size;
  const mirroredGen = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, seed, {
    mirroredSampling: true,
    replicationsPerCandidate: 2,
    baseRolloutSeed: 71,
  }).stepGeneration();

  return {
    baselineReceipt,
    perKnobReceiptDeltas,
    allEightKnobsCausallyActive,
    zeroLrPolicyDeltaNorm: zeroLrReceipt.innerPolicyWeightDeltaNorm,
    zeroLrValueDeltaNorm: zeroLrReceipt.innerValueWeightDeltaNorm,
    zeroValueCoefValueDeltaNorm: zeroValueCoefReceipt.innerValueWeightDeltaNorm,
    zeroValueCoefPolicyDeltaNorm: zeroValueCoefReceipt.innerPolicyWeightDeltaNorm,
    rewardRescalingHeldOutInvariantUnderFrozenPolicy,
    antiRewardHackingVerifiedUnderActiveTraining,
    mirroredRolloutCount: mirroredGen.evaluationsCount,
    mirroredDistinctCandidateCount,
  };
}

