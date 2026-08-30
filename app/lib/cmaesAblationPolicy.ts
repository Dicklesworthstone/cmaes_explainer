// CMA-ES Ablation Policy Search (cmaes-j36 ablation panel, CMA-ES side).
//
// Runs a REAL CMA-ES policy search over a disclosed, fixed policy family on the
// stepwise G1 environment and produces a measured receipt:
//   - Policy family: phase-basis linear residual. Per-actuator features are
//     [1, sin(phi), cos(phi), sin(2*phi), cos(2*phi), roll, pitch] where phi is
//     the environment's own gait phase (obs.phaseSin / obs.phaseCos) and
//     roll/pitch come from obs.baseOrientationRpy. The action for actuator j is
//     tanh(<w_j, f>) with w_j a 7-vector, so the genotype is 15 * 7 = 105
//     parameters. tanh bounds every action to (-1, 1); the genotype itself is
//     unbounded exactly as LiveCmaesOptimizer samples it.
//   - Search fitness is NEGATIVE total episode reward (minimization) on
//     episodeSteps-length greedy rollouts.
//   - Every number in the receipt is measured: evaluation counts are exact,
//     wallclock comes from performance.now(), and inference latency is timed
//     over a >=10k-application tight loop using feature vectors captured
//     during the final flagship-horizon rollout (policy math only, no env.step).
//
// SOTA References:
//   - Hansen, "The CMA Evolution Strategy: A Tutorial" (Inria 2016)

import { G1TrainEnv, type G1Observation } from "./g1StepwiseEnv";
import { LiveCmaesOptimizer } from "./liveCmaesHousehold";

export interface CmaesSearchOptions {
  /** Seeds the CMA-ES optimizer only (the env is deterministic). Default 42. */
  seed?: number;
  /** CMA-ES population size lambda. Default 16. */
  populationSize?: number;
  /** Total rollout evaluations (episodes) the search may spend. Default 2400. */
  budgetEvaluations?: number;
  /** Search-time episode length in steps. Default 240. */
  episodeSteps?: number;
  /** Flagship-horizon evaluation length of the best policy, in steps. Default 720. */
  finalSteps?: number;
  /** Initial CMA-ES step size. Default 0.35. */
  sigma0?: number;
}

export interface CmaesPolicySearchResult {
  receipt: {
    /** FEATURE_COUNT * ACTUATOR_COUNT = 7 * 15 = 105 (exact). */
    parameterCount: number;
    /** Actual cumulative rollout evaluations performed (each episode = 1). */
    trainingSamplesRequired: number;
    /** Measured performance.now() around the whole search + final rollout. */
    trainingWallclockMs: number;
    /** Mean per-STEP policy-apply cost in microseconds (policy math only). */
    inferenceLatencyMicros: number;
  };
  bestGenotype: number[];
  finalMetrics: {
    completedSteps: number;
    totalStepsBudget: number;
    distanceTraveledMeters: number;
    averageSpeedMps: number;
    actuatorWorkJoules: number;
    costOfTransportCoT: number;
    survivalRatePercent: number;
    objectiveScore: number;
    fallOccurred: boolean;
  };
}

const FEATURE_COUNT = 7;
const ACTUATOR_COUNT = 15;
const PARAMETER_COUNT = FEATURE_COUNT * ACTUATOR_COUNT;
const ROBOT_MASS_KG = 45.0;
const GRAVITY_MPS2 = 9.81;
const INFERENCE_TIMING_ITERATIONS = 20000; // >= 10k required
const MAX_CAPTURED_FEATURE_VECTORS = 64;

/** [1, sin(phi), cos(phi), sin(2*phi), cos(2*phi), roll, pitch] */
function extractFeatures(obs: G1Observation, out: number[]): void {
  const sinPhi = obs.phaseSin;
  const cosPhi = obs.phaseCos;
  out[0] = 1.0;
  out[1] = sinPhi;
  out[2] = cosPhi;
  out[3] = 2.0 * sinPhi * cosPhi;
  out[4] = cosPhi * cosPhi - sinPhi * sinPhi;
  out[5] = obs.baseOrientationRpy[0];
  out[6] = obs.baseOrientationRpy[1];
}

/** Greedy policy forward pass: action_j = tanh(<w_j, f>). Writes into actionOut. */
function applyPolicy(
  genotype: number[],
  features: number[],
  actionOut: number[],
): void {
  for (let j = 0; j < ACTUATOR_COUNT; j++) {
    let acc = 0.0;
    const base = j * FEATURE_COUNT;
    for (let k = 0; k < FEATURE_COUNT; k++) {
      acc += genotype[base + k] * features[k];
    }
    actionOut[j] = Math.tanh(acc);
  }
}

interface RolloutSummary {
  objectiveScore: number;
  distanceMeters: number;
  actuatorWorkJoules: number;
  completedSteps: number;
  fallOccurred: boolean;
}

/** One greedy rollout of the given genotype on a fresh env; returns -totalReward fitness. */
function rollout(
  maxSteps: number,
  genotype: number[],
  features: number[],
  action: number[],
  featureBank: number[][] | null,
): RolloutSummary {
  const env = new G1TrainEnv({ maxSteps });
  let obs = env.reset();
  let objectiveScore = 0.0;
  let completedSteps = 0;
  let fallOccurred = false;
  let distanceMeters = 0.0;
  let actuatorWorkJoules = 0.0;

  for (let t = 0; t < maxSteps; t++) {
    extractFeatures(obs, features);
    if (featureBank && featureBank.length < MAX_CAPTURED_FEATURE_VECTORS) {
      featureBank.push([...features]);
    }
    applyPolicy(genotype, features, action);
    const result = env.step(action);
    objectiveScore += result.reward;
    actuatorWorkJoules += result.info.actuatorWorkJoules;
    distanceMeters = result.info.cumulativeDistanceMeters;
    completedSteps = t + 1;
    if (result.info.fallOccurred) {
      fallOccurred = true;
      break;
    }
    if (result.done) break;
    obs = result.observation;
  }

  return {
    objectiveScore,
    distanceMeters,
    actuatorWorkJoules,
    completedSteps,
    fallOccurred,
  };
}

/**
 * Real CMA-ES policy search on the stepwise G1 environment.
 * Deterministic for a fixed seed: the optimizer RNG stream and the env are
 * both deterministic, and generation boundaries are budget-sliced so the
 * sample count never exceeds budgetEvaluations.
 */
export function runCmaesPolicySearch(
  options: CmaesSearchOptions = {},
): CmaesPolicySearchResult {
  const seed = options.seed ?? 42;
  const populationSize = Math.max(2, Math.floor(options.populationSize ?? 16));
  const budgetEvaluations = Math.max(1, Math.floor(options.budgetEvaluations ?? 2400));
  const episodeSteps = Math.max(1, Math.floor(options.episodeSteps ?? 240));
  const finalSteps = Math.max(1, Math.floor(options.finalSteps ?? 720));
  const sigma0 = options.sigma0 ?? 0.35;

  const startMs = performance.now();

  const optimizer = new LiveCmaesOptimizer({
    ownerId: "cmaes-ablation-policy",
    name: "CMA-ES Ablation Policy Search",
    dimension: PARAMETER_COUNT,
    initialSigma: sigma0,
    populationSize,
    seed,
  });

  // Search-time rollout workspace (reused; env state is fully reset per episode).
  const searchFeatures = new Array<number>(FEATURE_COUNT).fill(0.0);
  const searchAction = new Array<number>(ACTUATOR_COUNT).fill(0.0);

  const episodeFitness = (genotype: number[]): number =>
    -rollout(episodeSteps, genotype, searchFeatures, searchAction, null)
      .objectiveScore;

  let evaluationsPerformed = 0;
  let bestFitness = Infinity;
  let bestGenotype: number[] = new Array<number>(PARAMETER_COUNT).fill(0.0);

  while (evaluationsPerformed < budgetEvaluations) {
    const remaining = budgetEvaluations - evaluationsPerformed;
    const lambda = Math.min(populationSize, remaining);
    // Always draw the full population so the RNG stream is independent of
    // where the budget happens to cut off; slice to the budget remainder.
    const candidates = optimizer.samplePopulation().slice(0, lambda);
    const fitnesses: number[] = new Array<number>(lambda);
    for (let i = 0; i < lambda; i++) {
      fitnesses[i] = episodeFitness(candidates[i]);
      if (fitnesses[i] < bestFitness) {
        bestFitness = fitnesses[i];
        bestGenotype = [...candidates[i]];
      }
    }
    evaluationsPerformed += lambda;
    // tellEvaluations ranks up to state.muElite candidates; a trailing partial
    // generation smaller than muElite cannot be told without out-of-bounds
    // reads, so skip the tell (best tracking above already covers it).
    if (lambda >= optimizer.state.muElite) {
      optimizer.tellEvaluations(candidates, fitnesses);
    }
  }

  // Flagship-horizon evaluation of the best policy found.
  const finalFeatureBank: number[][] = [];
  const final = rollout(
    finalSteps,
    bestGenotype,
    searchFeatures,
    searchAction,
    finalFeatureBank,
  );

  const dt = new G1TrainEnv({ maxSteps: finalSteps }).config.dt;
  const seconds = finalSteps * dt;
  const averageSpeedMps = seconds > 0 ? final.distanceMeters / seconds : 0.0;
  const cotDenominator = ROBOT_MASS_KG * GRAVITY_MPS2 * final.distanceMeters;
  const costOfTransportCoT =
    cotDenominator > 1e-9 ? final.actuatorWorkJoules / cotDenominator : 0.0;
  const survivalRatePercent = final.fallOccurred
    ? (final.completedSteps / finalSteps) * 100.0
    : 100.0;

  // Inference latency: tight loop (>=10k applications) of policy math only —
  // no env.step — cycling real feature vectors captured during the final
  // rollout. The sink accumulator keeps the loop from being optimized away.
  const bank =
    finalFeatureBank.length > 0
      ? finalFeatureBank
      : [new Array<number>(FEATURE_COUNT).fill(0.0)];
  const timingAction = new Array<number>(ACTUATOR_COUNT).fill(0.0);
  let sink = 0.0;
  const timingStartMs = performance.now();
  for (let i = 0; i < INFERENCE_TIMING_ITERATIONS; i++) {
    applyPolicy(bestGenotype, bank[i % bank.length], timingAction);
    sink += timingAction[0];
  }
  const timingElapsedMs = performance.now() - timingStartMs;
  const inferenceLatencyMicros =
    (timingElapsedMs * 1000.0) / INFERENCE_TIMING_ITERATIONS;
  if (!Number.isFinite(sink)) {
    // Unreachable in practice; guards against a degenerate timing loop.
    sink = 0.0;
  }

  return {
    receipt: {
      parameterCount: PARAMETER_COUNT,
      trainingSamplesRequired: evaluationsPerformed,
      trainingWallclockMs: performance.now() - startMs,
      inferenceLatencyMicros,
    },
    bestGenotype,
    finalMetrics: {
      completedSteps: final.completedSteps,
      totalStepsBudget: finalSteps,
      distanceTraveledMeters: final.distanceMeters,
      averageSpeedMps,
      actuatorWorkJoules: final.actuatorWorkJoules,
      costOfTransportCoT,
      survivalRatePercent,
      objectiveScore: final.objectiveScore,
      fallOccurred: final.fallOccurred,
    },
  };
}
