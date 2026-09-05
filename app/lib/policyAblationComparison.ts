// Policy Architecture Side-by-Side Ablation Engine — MEASURED (cmaes-ablation-real).
//
// Replaces the synthesized/placeholder receipts: BOTH sides are executed and
// measured, but they do not have equivalent training provenance.
//   1. CMA-ES side  — real live search over a 105-param phase-basis linear
//      policy on G1TrainEnv (app/lib/cmaesAblationPolicy.ts).
//   2. Transformer side — a committed historical checkpoint from
//      fs-g1-train/examples/train_ablation.rs. Its policy head is all zero and
//      its legacy training stand-in self-propelled under zero action. We still
//      run the real artifact through app/lib/gaitTransformer.ts, but classify
//      the result as a failed transfer onto the action-causal v2 environment.
//
// Provenance shipped alongside (public/robots/g1/transformer/):
//   g1-ablation-train-receipt.json — samples consumed, wallclock, host note.
//
// Honest limitations (disclosed, not hidden):
//   - The env is the disclosed kinematic stand-in, not the v068 kernel; it
//     has no push disturbance, joint-limit or slip telemetry, so those
//     receipt fields are reported as 0 ("not modeled here").
//   - Training wallclock is host-specific (receipt carries the host note);
//     sample counts are exact.
//   - TS inference accumulates in f64 vs the f32 training path (≤1e-3 abs;
//     golden-vector parity test covers the forward pass, and the receipt's
//     Rust-side greedy metrics are cross-checked in tests).

import { G1_TRAIN_ENV_CONTRACT, G1TrainEnv } from "./g1StepwiseEnv";
import {
  GaitTransformerPolicy,
  LoadedTransformerWeights,
  loadGaitTransformerWeights,
  TRANSFORMER_WEIGHTS_URL,
} from "./gaitTransformer";
import { runCmaesPolicySearch } from "./cmaesAblationPolicy";

export interface PolicyAblationReceipt {
  policyName: string;
  policyArchitecture: "phase_basis_cmaes" | "legacy_zero_head_transformer";
  parameterCount: number;
  trainingSamplesRequired: number;
  trainingWallclockMinutes: number;
  inferenceLatencyMicros: number;
  // Execution telemetry metrics
  objectiveScore: number;
  completedSteps: number;
  totalStepsBudget: number;
  distanceTraveledMeters: number;
  averageSpeedMps: number;
  actuatorWorkJoules: number;
  costOfTransportCoT: number;
  jointLimitViolations: number; // not modeled in the stand-in env → 0
  footSlipIntegral: number; // not modeled in the stand-in env → 0
  minimumObstacleClearanceMeters: number; // not modeled in the stand-in env → 0
  survivalRatePercent: number;
  evaluationEnvironmentContract: string;
  trainingEnvironmentContract: string;
  trainedOnEvaluationContract: boolean;
}

export interface AblationPairResult {
  sceneSeed: number;
  cmaesReceipt: PolicyAblationReceipt;
  transformerReceipt: PolicyAblationReceipt;
  efficiencyMultiplier: number;
  speedDeltaMps: number;
  /**
   * The furthest ANY policy can travel on this contract, in metres.
   *
   * The environment sets forward speed to targetSpeed x gaitDrive with
   * gaitDrive capped at 1, so sustaining the commanded speed for the whole
   * horizon is the hard maximum. Without it the two distances on screen are
   * uninterpretable: a reader cannot tell whether 7 m is excellent or feeble,
   * and "which is bigger" looks like the only question. It is not — both
   * policies sit near a ceiling neither can pass.
   */
  theoreticalMaxDistanceMeters: number;
}

// G1 mass matches the kernel's body-weight calculation (total link mass × g).
const ROBOT_MASS_KG = 45.0;
const DT_SECONDS = 1 / 60;
const FINAL_STEPS = 720;
/** The environment's commanded forward speed; G1TrainEnv defaults to this. */
const TARGET_SPEED_MPS = 0.65;

// ─── Training receipt (validated at the boundary, typed after) ───

export interface TransformerTrainReceipt {
  parameterCount: number;
  samplesConsumed: number;
  trainingWallclockMinutes: number;
  hostNote: string;
  trainingEnvironment: string;
  environmentContract: string;
  rustGreedy720: { distanceMeters: number; totalReward: number; completedSteps: number };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPositiveSafeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) > 0;
}

/** Validates the fields we consume; unknown extra fields are ignored. */
export function parseTrainReceipt(raw: unknown): TransformerTrainReceipt {
  if (typeof raw !== "object" || raw === null) throw new Error("train receipt: not an object");
  const record = raw as Record<string, unknown>;
  const arch = record.architecture;
  const training = record.training;
  const evaluation = record.evaluation;
  if (typeof arch !== "object" || arch === null || typeof training !== "object" || training === null) {
    throw new Error("train receipt: missing architecture/training");
  }
  const archRecord = arch as Record<string, unknown>;
  const trainingRecord = training as Record<string, unknown>;
  const parameterCount = archRecord.parameterCount;
  const samplesConsumed = trainingRecord.samplesConsumed;
  const wallclockSeconds = trainingRecord.wallclockSeconds;
  const trainingEnvironment =
    typeof trainingRecord.environment === "string"
      ? trainingRecord.environment
      : "unknown";
  const environmentContract =
    typeof record.environmentContract === "string"
      ? record.environmentContract
      : "legacy-self-propelled-standin-v1";
  // Early-stopped runs accumulate wallclock across suspended intervals —
  // unknowable, so the field is optional and reported as 0 minutes
  // ("host-dependent" per the receipt's hostNote) when absent.
  if (!isPositiveSafeInteger(parameterCount) || !isPositiveSafeInteger(samplesConsumed)) {
    throw new Error("train receipt: bad parameterCount/samplesConsumed");
  }
  if (wallclockSeconds !== undefined && (!isFiniteNumber(wallclockSeconds) || wallclockSeconds < 0)) {
    throw new Error("train receipt: bad wallclockSeconds");
  }
  const trainingWallclockMinutes = isFiniteNumber(wallclockSeconds) ? wallclockSeconds / 60 : 0;
  let rustGreedy720 = { distanceMeters: 0, totalReward: 0, completedSteps: 0 };
  if (typeof evaluation === "object" && evaluation !== null) {
    const greedy = (evaluation as Record<string, unknown>).greedy720;
    if (greedy !== undefined && (typeof greedy !== "object" || greedy === null)) {
      throw new Error("train receipt: bad evaluation.greedy720");
    }
    if (typeof greedy === "object" && greedy !== null) {
      const g = greedy as Record<string, unknown>;
      if (
        !isFiniteNumber(g.distanceMeters) ||
        g.distanceMeters < 0 ||
        !isFiniteNumber(g.totalReward) ||
        !Number.isSafeInteger(g.completedSteps) ||
        Number(g.completedSteps) < 0
      ) {
        throw new Error("train receipt: bad evaluation.greedy720 metrics");
      }
      rustGreedy720 = {
        distanceMeters: g.distanceMeters,
        totalReward: g.totalReward,
        completedSteps: Number(g.completedSteps),
      };
    }
  }
  return {
    parameterCount,
    samplesConsumed,
    trainingWallclockMinutes,
    hostNote: typeof record.hostNote === "string" ? record.hostNote : "",
    trainingEnvironment,
    environmentContract,
    rustGreedy720,
  };
}

// ─── Input loading (injectable for tests; fetch-based in the browser) ───

export interface AblationInputs {
  weights: LoadedTransformerWeights;
  trainReceipt: TransformerTrainReceipt;
}

const TRAIN_RECEIPT_URL = "/robots/g1/transformer/g1-ablation-train-receipt.json";

async function fetchTransformerWeights(): Promise<ArrayBuffer> {
  const res = await fetch(TRANSFORMER_WEIGHTS_URL);
  if (!res.ok) throw new Error(`weights fetch failed: ${res.status}`);
  return res.arrayBuffer();
}

async function fetchTransformerReceipt(): Promise<unknown> {
  const res = await fetch(TRAIN_RECEIPT_URL);
  if (!res.ok) throw new Error(`train receipt fetch failed: ${res.status}`);
  return res.json();
}

let cachedInputsPromise: Promise<AblationInputs> | null = null;

export async function loadAblationInputs(
  loadWeights: () => Promise<ArrayBuffer> = fetchTransformerWeights,
  loadReceipt: () => Promise<unknown> = fetchTransformerReceipt,
): Promise<AblationInputs> {
  const load = async (): Promise<AblationInputs> => {
    const [weightsBuf, receiptRaw] = await Promise.all([loadWeights(), loadReceipt()]);
    return {
      weights: loadGaitTransformerWeights(weightsBuf),
      trainReceipt: parseTrainReceipt(receiptRaw),
    };
  };

  // Only cache the actual browser artifact fetch. Injected loaders are test
  // and caller boundaries and must never receive a result produced by an
  // earlier, unrelated loader invocation.
  const usesDefaultLoaders =
    loadWeights === fetchTransformerWeights && loadReceipt === fetchTransformerReceipt;
  if (!usesDefaultLoaders) return load();
  if (!cachedInputsPromise) {
    cachedInputsPromise = load().catch((error: unknown) => {
      cachedInputsPromise = null;
      throw error;
    });
  }
  return cachedInputsPromise;
}

// ─── Measured evaluation ───

function rolloutTransformerPolicy(
  policy: GaitTransformerPolicy,
  steps: number,
): {
  totalReward: number;
  completed: number;
  distance: number;
  work: number;
  fell: boolean;
  latencyMicros: number;
} {
  const env = new G1TrainEnv({ maxSteps: steps });
  const obs = env.reset(42);
  policy.reset();
  let totalReward = 0;
  let work = 0;
  let latencyMs = 0;
  let completed = 0;
  let distance = 0;
  let fell = false;
  let current = obs;
  for (let t = 0; t < steps; t++) {
    const t0 = performance.now();
    const { action } = policy.step(current.rawVector, t);
    const t1 = performance.now();
    latencyMs += t1 - t0;
    const res = env.step(Array.from(action));
    totalReward += res.reward;
    work += res.info.actuatorWorkJoules;
    distance = res.info.cumulativeDistanceMeters;
    fell = res.info.fallOccurred;
    completed += 1;
    current = res.observation;
    if (res.done) break;
  }
  return {
    totalReward,
    completed,
    distance,
    work,
    fell,
    latencyMicros: completed > 0 ? (latencyMs * 1000) / completed : 0,
  };
}

/**
 * Runs BOTH ablation sides against the same disclosed env and horizon.
 * Deterministic per seed (CMA-ES optimizer seeding); the transformer side is
 * seed-independent (deterministic env + greedy policy).
 */
export function runMeasuredAblation(inputs: AblationInputs, seed = 42): AblationPairResult {
  // ── Transformer side (real historical artifact, failed v2 transfer) ──
  const policy = new GaitTransformerPolicy(inputs.weights);
  // targetSpeed x gaitDrive, gaitDrive <= 1, sustained for the full horizon.
  const theoreticalMaxDistanceMeters = TARGET_SPEED_MPS * FINAL_STEPS * DT_SECONDS;
  const tfRun = rolloutTransformerPolicy(policy, FINAL_STEPS);
  const tfDistance = tfRun.distance;
  const tfSpeed = tfDistance / (tfRun.completed * DT_SECONDS);
  const tfCoT = tfDistance > 1e-9 ? tfRun.work / (ROBOT_MASS_KG * 9.81 * tfDistance) : 0;

  const transformerReceipt: PolicyAblationReceipt = {
    policyName: "Legacy zero-head transformer artifact (PPO + Muon receipt)",
    policyArchitecture: "legacy_zero_head_transformer",
    parameterCount: inputs.trainReceipt.parameterCount,
    trainingSamplesRequired: inputs.trainReceipt.samplesConsumed,
    trainingWallclockMinutes: inputs.trainReceipt.trainingWallclockMinutes,
    inferenceLatencyMicros: tfRun.latencyMicros,
    objectiveScore: tfRun.totalReward,
    completedSteps: tfRun.completed,
    totalStepsBudget: FINAL_STEPS,
    distanceTraveledMeters: tfDistance,
    averageSpeedMps: tfSpeed,
    actuatorWorkJoules: tfRun.work,
    costOfTransportCoT: tfCoT,
    jointLimitViolations: 0, // not modeled in the stand-in env
    footSlipIntegral: 0, // not modeled in the stand-in env
    minimumObstacleClearanceMeters: 0, // not modeled in the stand-in env
    survivalRatePercent: (tfRun.completed / FINAL_STEPS) * 100,
    evaluationEnvironmentContract: G1_TRAIN_ENV_CONTRACT,
    trainingEnvironmentContract: inputs.trainReceipt.environmentContract,
    trainedOnEvaluationContract:
      inputs.trainReceipt.environmentContract === G1_TRAIN_ENV_CONTRACT,
  };

  // ── CMA-ES side (real search, real rollouts) ──
  const search = runCmaesPolicySearch({ seed, episodeSteps: 240, finalSteps: FINAL_STEPS });
  const cmaesReceipt: PolicyAblationReceipt = {
    policyName: "Linear Residual CMA-ES (Phase Prior, searched live)",
    policyArchitecture: "phase_basis_cmaes",
    parameterCount: search.receipt.parameterCount,
    trainingSamplesRequired: search.receipt.trainingSamplesRequired,
    trainingWallclockMinutes: search.receipt.trainingWallclockMs / 60000,
    inferenceLatencyMicros: search.receipt.inferenceLatencyMicros,
    objectiveScore: search.finalMetrics.objectiveScore,
    completedSteps: search.finalMetrics.completedSteps,
    totalStepsBudget: search.finalMetrics.totalStepsBudget,
    distanceTraveledMeters: search.finalMetrics.distanceTraveledMeters,
    averageSpeedMps: search.finalMetrics.averageSpeedMps,
    actuatorWorkJoules: search.finalMetrics.actuatorWorkJoules,
    costOfTransportCoT: search.finalMetrics.costOfTransportCoT,
    jointLimitViolations: 0,
    footSlipIntegral: 0,
    minimumObstacleClearanceMeters: 0,
    survivalRatePercent: search.finalMetrics.survivalRatePercent,
    evaluationEnvironmentContract: G1_TRAIN_ENV_CONTRACT,
    trainingEnvironmentContract: G1_TRAIN_ENV_CONTRACT,
    trainedOnEvaluationContract: true,
  };

  return {
    sceneSeed: seed,
    cmaesReceipt,
    transformerReceipt,
    efficiencyMultiplier:
      transformerReceipt.trainingSamplesRequired / cmaesReceipt.trainingSamplesRequired,
    speedDeltaMps: transformerReceipt.averageSpeedMps - cmaesReceipt.averageSpeedMps,
    theoreticalMaxDistanceMeters,
  };
}
