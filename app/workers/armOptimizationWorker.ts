/// <reference lib="webworker" />

import {
  householdKernelObstacleRoster,
  type HouseholdKernelObstacle,
} from "../lib/houseMultiObstacleKernel";
import {
  DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
  createFrankenSimCmaFamilySession,
  createFrankenSimHouseholdManipulationEvaluator,
  type CmaFamily,
  type FrankenSimCmaFamilySession,
  type FrankenSimHouseholdManipulationEvaluator,
  type HouseholdManipulationConfig,
  type HouseholdManipulationAdmission,
  type HouseholdManipulationTask,
  type HouseholdManipulationTraceReceipt,
} from "../lib/frankensimCmaes";
import { RoboticsEvaluationPool } from "../lib/roboticsEvaluationPool";

type WorkerRequest =
  | { type: "preview"; task: HouseholdManipulationTask }
  | {
      /** Render a policy the operator imported from a file or a share link. */
      type: "replay";
      task: HouseholdManipulationTask;
      policy: Float64Array;
      generation: number;
    }
  | {
      type: "optimize";
      task: HouseholdManipulationTask;
      family: CmaFamily;
      generations: number;
      seedIndex: number;
      mode?: "continue" | "fresh";
      continuous?: boolean;
      /**
       * Start a NEW session from these coefficients instead of the curriculum
       * mean — how a run recovered from storage continues after a reload. The
       * CMA state itself is not serialisable, so this is a warm restart from
       * the policy, not a resumed search. Ignored when continuing a session the
       * worker already holds.
       */
      resumeFrom?: Float64Array;
    }
  | { type: "stop"; task: HouseholdManipulationTask; family: CmaFamily; seedIndex: number }
  | { type: "compare"; task: HouseholdManipulationTask; generations: number };

type ArmTraceOrigin = CmaFamily | "curriculum";

type ComparisonRow = {
  family: CmaFamily;
  initialObjective: number;
  finalObjective: number;
  evaluations: number;
  persistentScalars: number;
  workspaceScalars: number;
  elapsedMilliseconds: number;
};

type WorkerResponse =
  | { type: "status"; phase: string; detail: string }
  | {
      type: "trace";
      trace: HouseholdManipulationTraceReceipt;
      admission: HouseholdManipulationAdmission;
      generation: number;
      family: ArmTraceOrigin;
      continuing?: boolean;
      stopped?: boolean;
      /**
       * Coefficients behind this trace, so the page can export or share the
       * policy it is showing. Sent with replayed policies only.
       */
      policy?: Float64Array;
    }
  | {
      type: "progress";
      family: CmaFamily;
      generation: number;
      maxGenerations: number;
      bestObjective: number;
      sigma: number;
      continuous?: boolean;
    }
  | { type: "comparison"; rows: ComparisonRow[]; complete: boolean }
  | { type: "error"; message: string };


type ArmEvaluator = FrankenSimHouseholdManipulationEvaluator;
type ArmCmaSession = FrankenSimCmaFamilySession;

// Continuable runs keyed "task:family:seed" — same lifetime contract as the
// G1 worker: the CMA session (mean/sigma/path) survives across requests so
// the Optimize control extends a run instead of restarting it.
type ArmActiveRun = {
  session: ArmCmaSession;
  evaluator: ArmEvaluator;
  pool: RoboticsEvaluationPool;
  bestPolicy: Float64Array;
  bestObjective: number;
  completedGeneration: number;
  maxTotalGenerations: number;
};
// Same operator-bounded contract as G1. The owner intentionally admits the
// evaluation budget as an exact u32. At population 12, 250 million generations
// stays safely inside that packet boundary and still spans about 7.9 years at
// an unrealistically fast one generation/second.
const ARM_MAX_TOTAL_GENERATIONS = 250_000_000;
const ARM_LIVE_REPLAY_INTERVAL = 16;
const armActiveRuns = new Map<string, ArmActiveRun>();
const armOptimizationRequests = new Set<string>();
const armStopRequests = new Set<string>();

function armFreeRun(run: ArmActiveRun): void {
  try {
    run.session.free();
  } catch {
    // prior lifecycle path already freed
  }
  try {
    run.pool.free();
  } catch {
    // ditto
  }
}

const worker = self as DedicatedWorkerGlobalScope;

// Single-flight gate. The arm worker has the same non-reentrant CMA
// session hazard as the G1 worker; see g1OptimizationWorker for the
// full rationale. Serializes every request through one Promise.
let armGate: Promise<void> = Promise.resolve();
const POPULATION = 12;

function post(message: WorkerResponse): void {
  worker.postMessage(message);
}

function requireOk<T>(
  result: { ok: T } | { refusal: { name: string; detail: number | null } },
  label: string
): T {
  if ("ok" in result) return result.ok;
  const suffix = result.refusal.detail === null ? "" : ` (detail ${result.refusal.detail})`;
  throw new Error(`${label}: ${result.refusal.name}${suffix}`);
}

// Every owner call (preview, optimize, compare) carries the house obstacle
// roster, so the kernel's link-vs-box constraint sees the same workbench
// structures and furniture the stage draws.
//
// The roster depends on the owner's own support height, which is only
// readable from an admission, so it is resolved once per task by admitting a
// bare evaluator first and cached. The extra admission is a packet decode,
// not a rollout.
const kernelObstaclesByTask = new Map<HouseholdManipulationTask, readonly HouseholdKernelObstacle[]>();

async function kernelObstaclesFor(
  task: HouseholdManipulationTask,
): Promise<readonly HouseholdKernelObstacle[]> {
  const cached = kernelObstaclesByTask.get(task);
  if (cached) return cached;
  const probe = requireOk(
    await createFrankenSimHouseholdManipulationEvaluator({
      ...DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
      task,
    }),
    "household-arm support-height probe",
  );
  try {
    const roster = householdKernelObstacleRoster(
      probe.admission.scene.supportHeightMeters,
      task,
    );
    kernelObstaclesByTask.set(task, roster);
    return roster;
  } finally {
    probe.free();
  }
}

async function taskConfig(
  task: HouseholdManipulationTask,
): Promise<HouseholdManipulationConfig> {
  return {
    ...DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
    task,
    obstacles: await kernelObstaclesFor(task),
  };
}

function memoryFor(family: CmaFamily): number | undefined {
  return family === "lm-cma" || family === "lm-ma" ? 12 : undefined;
}

function reportParallelEvaluation(
  receipt: { lanes: number; firstBatchVerified: boolean; fallbackReason: string | null },
  announced: boolean
): boolean {
  if (announced) return true;
  if (receipt.fallbackReason) {
    post({
      type: "status",
      phase: "parallel-fallback",
      detail: `Parallel evaluation fell back to the sequential owner path: ${receipt.fallbackReason}.`,
    });
  } else if (receipt.firstBatchVerified) {
    post({
      type: "status",
      phase: "parallel-verified",
      detail: `${receipt.lanes} persistent WASM lanes matched the sequential physical objectives exactly.`,
    });
  }
  return true;
}

/**
 * Render a policy the operator brought with them, on the same admitted owner
 * the search uses — so an imported gait is measured by exactly the owner that
 * would have trained it.
 */
async function replayArmPolicy(
  task: HouseholdManipulationTask,
  policy: Float64Array,
  generation: number,
): Promise<void> {
  post({ type: "status", phase: "loading", detail: "Loading the owner to replay this policy…" });
  const evaluator = requireOk(
    await createFrankenSimHouseholdManipulationEvaluator(await taskConfig(task)),
    "household-arm admission"
  );
  try {
    const trace = requireOk(evaluator.trace(policy), "imported policy trace");
    post({
      type: "trace",
      trace,
      admission: evaluator.admission,
      generation,
      family: "lm-ma",
      policy: policy.slice(),
    });
  } finally {
    evaluator.free();
  }
}

async function preview(task: HouseholdManipulationTask): Promise<void> {
  post({
    type: "status",
    phase: "loading",
    detail: "Loading the pinned iiwa model and owner-composed manipulation evaluator…",
  });
  const evaluator = requireOk(
    await createFrankenSimHouseholdManipulationEvaluator(await taskConfig(task)),
    "household-arm admission"
  );
  try {
    const curriculumMean = evaluator.curriculumPolicyMean();
    const trace = requireOk(
      evaluator.trace(curriculumMean),
      "household-arm curriculum trace"
    );
    post({
      type: "trace",
      trace,
      admission: evaluator.admission,
      generation: 0,
      family: "curriculum",
      policy: curriculumMean.slice(),
    });
  } finally {
    evaluator.free();
  }
}

async function optimize(
  task: HouseholdManipulationTask,
  family: CmaFamily,
  requestedGenerations: number,
  requestedSeedIndex: number,
  mode: "continue" | "fresh" = "continue",
  continuous = false,
  resumeFrom?: Float64Array,
): Promise<void> {
  const generations = Math.max(2, Math.min(ARM_MAX_TOTAL_GENERATIONS, Math.trunc(requestedGenerations)));
  const seedIndex = Math.max(0, Math.min(2, Math.trunc(requestedSeedIndex)));
  const runKey = `${task}:${family}:${seedIndex}`;

  let run = mode === "continue" ? armActiveRuns.get(runKey) : undefined;
  if (run) {
    post({
      type: "status",
      phase: "optimizing",
      detail: continuous
        ? `${family}, seed ${seedIndex + 1}: learning continuously from generation ${run.completedGeneration} — press Stop whenever you are ready.`
        : `${family}, seed ${seedIndex + 1}: continuing from generation ${run.completedGeneration} (${generations} more generations)…`,
    });
  } else {
    const stale = armActiveRuns.get(runKey);
    if (stale) {
      armFreeRun(stale);
      armActiveRuns.delete(runKey);
    }
    post({
      type: "status",
      phase: "optimizing",
      detail: `${family} is evaluating ${POPULATION} complete 6 s articulated pick-and-place rollouts per generation…`,
    });

    const config = await taskConfig(task);
    const evaluator = requireOk(
      await createFrankenSimHouseholdManipulationEvaluator(config),
      "household-arm admission"
    );
    const evaluationPool = new RoboticsEvaluationPool({ model: "arm", config, dimension: 128 });
    // A run recovered from storage starts from the policy it reached; a fresh
    // one starts from the curriculum mean.
    let bestPolicy =
      resumeFrom && resumeFrom.length === evaluator.curriculumPolicyMean().length
        ? Float64Array.from(resumeFrom)
        : evaluator.curriculumPolicyMean();
    let bestObjective = requireOk(
      evaluator.evaluate(bestPolicy),
      "household-arm curriculum evaluation"
    ).objective;
    // Budget spans the continuation lifetime; requests bound the loop.
    const session = requireOk(
      await createFrankenSimCmaFamilySession({
        family,
        mean: bestPolicy,
        sigma: 0.001,
        population: POPULATION,
        memory: memoryFor(family),
        maxEvaluations: POPULATION * ARM_MAX_TOTAL_GENERATIONS,
        seed: 0x4152_4d31n + BigInt(seedIndex),
      }),
      "CMA admission"
    );
    const activeRun: ArmActiveRun = { session, evaluator, pool: evaluationPool, bestPolicy, bestObjective, completedGeneration: 0, maxTotalGenerations: ARM_MAX_TOTAL_GENERATIONS };
    armActiveRuns.set(runKey, activeRun);
    run = activeRun;
  }

  try {
    let completedGeneration = run.completedGeneration;
    let parallelAnnounced = false;
    const targetGeneration = continuous
      ? ARM_MAX_TOTAL_GENERATIONS
      : Math.min(ARM_MAX_TOTAL_GENERATIONS, completedGeneration + generations);
    let stopped = false;
    while (completedGeneration < targetGeneration) {
      if (armStopRequests.has(runKey)) {
        stopped = true;
        break;
      }
      const ask = requireOk(run.session.ask(), "CMA ask");
      const evaluation = await run.pool.evaluate(
        ask.candidates,
        () => requireOk(
          run.evaluator.evaluatePopulation(ask.candidates),
          "sequential household-arm population evaluation"
        )
      );
      parallelAnnounced = reportParallelEvaluation(evaluation, parallelAnnounced);
      const snapshot = requireOk(
        run.session.tell(ask.generation, evaluation.objectives),
        "CMA tell"
      );
      completedGeneration = snapshot.generation;
      run.completedGeneration = completedGeneration;
      if (snapshot.best && snapshot.best.objective < run.bestObjective) {
        run.bestObjective = snapshot.best.objective;
        run.bestPolicy = snapshot.best.point.slice();
      }
      // Throttle: every other generation plus the final one keeps the HUD
      // live without flooding the main thread over long runs.
      if (snapshot.generation % 2 === 0 || completedGeneration === targetGeneration) {
        post({
          type: "progress",
          family,
          generation: snapshot.generation,
          maxGenerations: Math.max(snapshot.maxGenerations, run.maxTotalGenerations),
          bestObjective: run.bestObjective,
          sigma: snapshot.sigma,
          continuous,
        });
      }
      if (continuous && snapshot.generation % ARM_LIVE_REPLAY_INTERVAL === 0) {
        const checkpoint = requireOk(
          run.evaluator.trace(run.bestPolicy),
          "continuous optimized household-arm trace",
        );
        post({
          type: "trace",
          trace: checkpoint,
          admission: run.evaluator.admission,
          generation: completedGeneration,
          family,
          continuing: true,
          policy: run.bestPolicy.slice(),
        });
      }
    }
    run.completedGeneration = completedGeneration;
    post({
      type: "status",
      phase: "replaying",
      detail: stopped
        ? `Stopped at generation ${completedGeneration}; replaying the best policy found so far…`
        : "Replaying the best policy through the identical owner physics and success test…",
    });
    const trace = requireOk(run.evaluator.trace(run.bestPolicy), "optimized household-arm trace");
    post({
      type: "trace",
      trace,
      admission: run.evaluator.admission,
      generation: completedGeneration,
      family,
      policy: run.bestPolicy.slice(),
      stopped,
    });
  } catch (error) {
    // Dead session: drop the run so the next Optimize starts clean.
    armFreeRun(run);
    armActiveRuns.delete(runKey);
    throw error;
  }
}
async function compareFamilies(
  task: HouseholdManipulationTask,
  requestedGenerations: number
): Promise<void> {
  const generations = Math.max(2, Math.min(8, Math.trunc(requestedGenerations)));
  const families: CmaFamily[] = ["full", "separable", "lm-cma", "lm-ma"];
  const rows: ComparisonRow[] = [];
  post({
    type: "status",
    phase: "comparing",
    detail: "Running all four CMA representations on the same 128-D physical objective and seed…",
  });

  const config = await taskConfig(task);
  const evaluator = requireOk(
    await createFrankenSimHouseholdManipulationEvaluator(config),
    "household-arm admission"
  );
  const evaluationPool = new RoboticsEvaluationPool({ model: "arm", config, dimension: 128 });
  let parallelAnnounced = false;
  try {
    const mean = evaluator.curriculumPolicyMean();
    const initialObjective = requireOk(
      evaluator.evaluate(mean),
      "household-arm curriculum evaluation"
    ).objective;
    for (const family of families) {
      post({
        type: "status",
        phase: "comparing",
        detail: `${family}: evaluating ${POPULATION * generations} equal-budget physical rollouts…`,
      });
      const session = requireOk(
        await createFrankenSimCmaFamilySession({
          family,
          mean,
          sigma: 0.001,
          population: POPULATION,
          memory: memoryFor(family),
          maxEvaluations: POPULATION * generations,
          seed: 0x4152_c0den,
        }),
        `${family} admission`
      );
      // Wall-clock elapsed is a labeled UI/runtime measurement, not a
      // simulation input. Date.now's 1 ms resolution is well below the
      // per-family budgets (hundreds of ms to seconds).
      const started = Date.now();
      let finalObjective = initialObjective;
      let evaluations = 0;
      try {
        for (let generationIndex = 0; generationIndex < generations; generationIndex++) {
          const ask = requireOk(session.ask(), `${family} ask`);
          const evaluation = await evaluationPool.evaluate(
            ask.candidates,
            () => requireOk(
              evaluator.evaluatePopulation(ask.candidates),
              `${family} sequential physical population`
            )
          );
          parallelAnnounced = reportParallelEvaluation(evaluation, parallelAnnounced);
          const snapshot = requireOk(
            session.tell(ask.generation, evaluation.objectives),
            `${family} tell`
          );
          finalObjective = Math.min(finalObjective, snapshot.best?.objective ?? finalObjective);
          evaluations = snapshot.evaluations;
        }
        rows.push({
          family,
          initialObjective,
          finalObjective,
          evaluations,
          persistentScalars: session.admission.persistentScalars,
          workspaceScalars: session.admission.updateWorkspaceScalars,
          elapsedMilliseconds: Date.now() - started,
        });
        post({ type: "comparison", rows: rows.slice(), complete: false });
      } finally {
        session.free();
      }
    }
  } finally {
    evaluationPool.free();
    evaluator.free();
  }
  post({ type: "comparison", rows, complete: true });
}

worker.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  if (request.type === "stop") {
    const runKey = `${request.task}:${request.family}:${request.seedIndex}`;
    if (armOptimizationRequests.has(runKey)) {
      armStopRequests.add(runKey);
      post({
        type: "status",
        phase: "stopping",
        detail: "Stop requested; finishing the current physical generation safely…",
      });
    } else {
      post({ type: "status", phase: "ready", detail: "No arm learning run is active." });
    }
    return;
  }
  const optimizationRunKey = request.type === "optimize"
    ? `${request.task}:${request.family}:${request.seedIndex}`
    : null;
  if (optimizationRunKey) armOptimizationRequests.add(optimizationRunKey);
  // See g1OptimizationWorker for the work-factory rationale: invoking
  // the work inside .then() is what actually serializes, because the
  // IIFE cannot start until the previous task resolves.
  const work = () =>
    request.type === "replay"
      ? replayArmPolicy(request.task, request.policy, request.generation)
      : request.type === "preview"
      ? preview(request.task)
      : request.type === "compare"
        ? compareFamilies(request.task, request.generations)
        : optimize(
            request.task,
            request.family,
            request.generations,
            request.seedIndex,
            request.mode,
            request.continuous,
            request.resumeFrom,
          );
  const scheduled = armGate.then(() => work(), () => work()).catch((error: unknown) => {
    post({ type: "error", message: error instanceof Error ? error.message : String(error) });
  });
  armGate = scheduled;
  void scheduled.finally(() => {
    if (!optimizationRunKey) return;
    armOptimizationRequests.delete(optimizationRunKey);
    armStopRequests.delete(optimizationRunKey);
  });
};

export {};
