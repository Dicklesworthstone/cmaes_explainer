/// <reference lib="webworker" />

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
      type: "optimize";
      task: HouseholdManipulationTask;
      family: CmaFamily;
      generations: number;
      seedIndex: number;
      mode?: "continue" | "fresh";
    }
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
    }
  | {
      type: "progress";
      family: CmaFamily;
      generation: number;
      maxGenerations: number;
      bestObjective: number;
      sigma: number;
    }
  | { type: "comparison"; rows: ComparisonRow[] }
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
const ARM_MAX_TOTAL_GENERATIONS = 5_000;
const armActiveRuns = new Map<string, ArmActiveRun>();

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

function taskConfig(task: HouseholdManipulationTask): HouseholdManipulationConfig {
  return { ...DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG, task };
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

async function preview(task: HouseholdManipulationTask): Promise<void> {
  post({
    type: "status",
    phase: "loading",
    detail: "Loading the pinned iiwa model and owner-composed manipulation evaluator…",
  });
  const evaluator = requireOk(
    await createFrankenSimHouseholdManipulationEvaluator(taskConfig(task)),
    "household-arm admission"
  );
  try {
    const trace = requireOk(
      evaluator.trace(evaluator.curriculumPolicyMean()),
      "household-arm curriculum trace"
    );
    post({
      type: "trace",
      trace,
      admission: evaluator.admission,
      generation: 0,
      family: "curriculum",
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
  mode: "continue" | "fresh" = "continue"
): Promise<void> {
  const generations = Math.max(2, Math.min(ARM_MAX_TOTAL_GENERATIONS, Math.trunc(requestedGenerations)));
  const seedIndex = Math.max(0, Math.min(2, Math.trunc(requestedSeedIndex)));
  const runKey = `${task}:${family}:${seedIndex}`;

  let run = mode === "continue" ? armActiveRuns.get(runKey) : undefined;
  if (run) {
    post({
      type: "status",
      phase: "optimizing",
      detail: `${family}, seed ${seedIndex + 1}: continuing from generation ${run.completedGeneration} (${generations} more generations)…`,
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

    const config = taskConfig(task);
    const evaluator = requireOk(
      await createFrankenSimHouseholdManipulationEvaluator(config),
      "household-arm admission"
    );
    const evaluationPool = new RoboticsEvaluationPool({ model: "arm", config, dimension: 128 });
    let bestPolicy = evaluator.curriculumPolicyMean();
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
    for (let generationIndex = 0; generationIndex < generations; generationIndex++) {
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
      if (snapshot.best && snapshot.best.objective < run.bestObjective) {
        run.bestObjective = snapshot.best.objective;
        run.bestPolicy = snapshot.best.point.slice();
      }
      // Throttle: every other generation plus the final one keeps the HUD
      // live without flooding the main thread over long runs.
      if (snapshot.generation % 2 === 0 || generationIndex === generations - 1) {
        post({
          type: "progress",
          family,
          generation: snapshot.generation,
          maxGenerations: Math.max(snapshot.maxGenerations, run.maxTotalGenerations),
          bestObjective: run.bestObjective,
          sigma: snapshot.sigma,
        });
      }
    }
    run.completedGeneration = completedGeneration;
    post({
      type: "status",
      phase: "replaying",
      detail: "Replaying the best policy through the identical owner physics and success test…",
    });
    const trace = requireOk(run.evaluator.trace(run.bestPolicy), "optimized household-arm trace");
    post({
      type: "trace",
      trace,
      admission: run.evaluator.admission,
      generation: completedGeneration,
      family,
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

  const config = taskConfig(task);
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
      } finally {
        session.free();
      }
    }
  } finally {
    evaluationPool.free();
    evaluator.free();
  }
  post({ type: "comparison", rows });
}

worker.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  const task = request.type === "preview"
    ? preview(request.task)
    : request.type === "compare"
      ? compareFamilies(request.task, request.generations)
      : optimize(request.task, request.family, request.generations, request.seedIndex, request.mode);
  void task.catch((error: unknown) => {
    post({ type: "error", message: error instanceof Error ? error.message : String(error) });
  });
};

export {};
