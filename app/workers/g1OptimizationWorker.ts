/// <reference lib="webworker" />

import {
  DEFAULT_G1_WALKING_CONFIG,
  createFrankenSimCmaFamilySession,
  createFrankenSimG1WalkingEvaluator,
  type FrankenSimCmaFamilySession,
  type FrankenSimG1WalkingEvaluator,
  type CmaFamily,
  type G1Admission,
  type G1Challenge,
  type G1TraceReceipt,
} from "../lib/frankensimCmaes";
import { RoboticsEvaluationPool } from "../lib/roboticsEvaluationPool";

type WorkerRequest =
  | { type: "preview"; challenge: G1Challenge }
  | {
      type: "optimize";
      family: Exclude<CmaFamily, "full">;
      generations: number;
      seedIndex: number;
      mode?: "continue" | "fresh";
      challenge: G1Challenge;
    }
  | { type: "compare"; challenge: G1Challenge; generations: number };

type G1TraceOrigin = CmaFamily | "stabilizer" | "curriculum";

type WorkerResponse =
  | { type: "status"; phase: string; detail: string }
  | {
      type: "trace";
      trace: G1TraceReceipt;
      admission: G1Admission;
      generation: number;
      family: G1TraceOrigin;
    }
  | {
      type: "progress";
      family: CmaFamily;
      generation: number;
      maxGenerations: number;
      bestObjective: number;
      sigma: number;
    }
  | {
      type: "comparison";
      rows: Array<{
        family: CmaFamily;
        initialBest: number;
        finalBest: number;
        evaluations: number;
        persistentScalars: number;
        workspaceScalars: number;
        elapsedMilliseconds: number;
      }>;
    }
  | { type: "error"; message: string };

const worker = self as DedicatedWorkerGlobalScope;

function post(message: WorkerResponse): void {
  worker.postMessage(message);
}

function requireOk<T>(result: { ok: T } | { refusal: { name: string; detail: number | null } }, label: string): T {
  if ("ok" in result) return result.ok;
  const suffix = result.refusal.detail === null ? "" : ` (detail ${result.refusal.detail})`;
  throw new Error(`${label}: ${result.refusal.name}${suffix}`);
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

function g1Config(challenge: G1Challenge): typeof DEFAULT_G1_WALKING_CONFIG {
  return { ...DEFAULT_G1_WALKING_CONFIG, challenge };
}

async function preview(challenge: G1Challenge): Promise<void> {
  post({ type: "status", phase: "loading", detail: "Loading the owner-composed G1 evaluator…" });
  const evaluator = requireOk(
    await createFrankenSimG1WalkingEvaluator(g1Config(challenge)),
    "G1 admission"
  );
  try {
    const stabilizerTrace = requireOk(
      evaluator.trace(evaluator.stabilizingPolicyMean()),
      "stabilizing trace"
    );
    post({
      type: "trace",
      trace: stabilizerTrace,
      admission: evaluator.admission,
      generation: 0,
      family: "stabilizer",
    });
    const curriculumTrace = requireOk(
      evaluator.trace(evaluator.walkingCurriculumMean()),
      "walking curriculum trace"
    );
    post({
      type: "trace",
      trace: curriculumTrace,
      admission: evaluator.admission,
      generation: 0,
      family: "curriculum",
    });
  } finally {
    evaluator.free();
  }
}

type G1Evaluator = FrankenSimG1WalkingEvaluator;
type G1CmaSession = FrankenSimCmaFamilySession;

// Continuable optimization runs, keyed "family:seed". Keeping the CMA
// session (mean/sigma/covariance path) alive across requests lets the
// Optimize control extend a run for hundreds of generations instead of
// restarting from the curriculum mean every click. Runs are freed when
// replaced by a fresh request; the map is bounded to keep worker memory sane.
type G1ActiveRun = {
  session: G1CmaSession;
  evaluator: G1Evaluator;
  pool: RoboticsEvaluationPool;
  bestPolicy: Float64Array;
  bestObjective: number;
  completedGeneration: number;
  maxTotalGenerations: number;
};
const G1_MAX_TOTAL_GENERATIONS = 30_000;
const G1_POPULATION = 16;
const g1ActiveRuns = new Map<string, G1ActiveRun>();

function g1FreeRun(run: G1ActiveRun): void {
  try {
    run.session.free();
  } catch {
    // already freed by a prior lifecycle path
  }
  try {
    run.pool.free();
  } catch {
    // ditto
  }
}

async function optimize(
  family: Exclude<CmaFamily, "full">,
  requestedGenerations: number,
  requestedSeedIndex: number,
  mode: "continue" | "fresh" = "continue",
  challenge: G1Challenge = "terrain-and-push"
): Promise<void> {
  const generations = Math.max(8, Math.min(G1_MAX_TOTAL_GENERATIONS, Math.trunc(requestedGenerations)));
  const seedIndex = Math.max(0, Math.min(2, Math.trunc(requestedSeedIndex)));
  const population = G1_POPULATION;
  const runKey = `${challenge}:${family}:${seedIndex}`;

  let run = mode === "continue" ? g1ActiveRuns.get(runKey) : undefined;
  if (run) {
    post({
      type: "status",
      phase: "optimizing",
      detail: `${family}, seed ${seedIndex + 1}: continuing from generation ${run.completedGeneration} (${generations} more generations)…`,
    });
  } else {
    // Replace any stale run for this key when a fresh start is requested.
    const stale = g1ActiveRuns.get(runKey);
    if (stale) {
      g1FreeRun(stale);
      g1ActiveRuns.delete(runKey);
    }
    post({
      type: "status",
      phase: "optimizing",
      detail: `${family}, seed ${seedIndex + 1}: evaluating ${population} full 1.5 s articulated-body rollouts per generation…`,
    });

    // Training and replay deliberately share one admitted evaluator. Optimizing
    // a short proxy and replaying a longer experiment rewards a different
    // behavior than the one the user sees.
    const evaluator = requireOk(
      await createFrankenSimG1WalkingEvaluator(g1Config(challenge)),
      "G1 admission"
    );
    const evaluationPool = new RoboticsEvaluationPool({
      model: "g1",
      config: g1Config(challenge),
      dimension: 5_040,
    });
    let bestPolicy = evaluator.walkingCurriculumMean();
    let bestObjective = requireOk(
      evaluator.evaluate(evaluator.walkingCurriculumMean()),
      "G1 curriculum evaluation"
    ).objective;
    // Budget spans the whole continuation lifetime, not one request.
    const session = requireOk(
      await createFrankenSimCmaFamilySession({
        family,
        mean: evaluator.walkingCurriculumMean(),
        sigma: 0.0005,
        population,
        memory: family === "lm-cma" || family === "lm-ma" ? 12 : undefined,
        maxEvaluations: population * G1_MAX_TOTAL_GENERATIONS,
        seed: 0x4731_5050n + BigInt(seedIndex),
      }),
      "CMA admission"
    );
    const activeRun: G1ActiveRun = { session, evaluator, pool: evaluationPool, bestPolicy, bestObjective, completedGeneration: 0, maxTotalGenerations: G1_MAX_TOTAL_GENERATIONS };
    run = activeRun;
    g1ActiveRuns.set(runKey, activeRun);
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
          "sequential G1 population evaluation"
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
      // At hundreds of generations, posting every generation floods the
      // main thread with setState work; every other generation plus the
      // final one keeps the HUD live without the flood.
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
      detail: `Rendering the generation-${completedGeneration} best policy on the identical full-horizon experiment…`,
    });
    const trace = requireOk(run.evaluator.trace(run.bestPolicy), "optimized trace");
    post({
      type: "trace",
      trace,
      admission: run.evaluator.admission,
      generation: completedGeneration,
      family,
    });
  } catch (error) {
    // A refused/failing session is dead state: drop it so the next Optimize
    // starts clean instead of continuing a poisoned run.
    g1FreeRun(run);
    g1ActiveRuns.delete(runKey);
    throw error;
  }
}
async function compareFamilies(requestedGenerations: number, challenge: G1Challenge = "terrain-and-push"): Promise<void> {
  const generations = Math.max(2, Math.min(8, Math.trunc(requestedGenerations)));
  const population = 16;
  const families: Exclude<CmaFamily, "full">[] = ["separable", "lm-cma", "lm-ma"];
  const rows: Extract<WorkerResponse, { type: "comparison" }>["rows"] = [];
  post({
    type: "status",
    phase: "comparing",
    detail: "Running all three scalable owners on the identical 5,040-D terrain-and-push objective…",
  });

  const evaluator = requireOk(
    await createFrankenSimG1WalkingEvaluator(g1Config(challenge)),
    "G1 comparison admission"
  );
  const evaluationPool = new RoboticsEvaluationPool({
    model: "g1",
    config: g1Config(challenge),
    dimension: 5_040,
  });
  let parallelAnnounced = false;
  try {
    const mean = evaluator.walkingCurriculumMean();
    const initialBest = requireOk(
      evaluator.evaluate(mean),
      "G1 comparison curriculum evaluation"
    ).objective;
    for (const family of families) {
      const session = requireOk(
        await createFrankenSimCmaFamilySession({
          family,
          mean,
          sigma: 0.0005,
          population,
          memory: family === "lm-cma" || family === "lm-ma" ? 12 : undefined,
          maxEvaluations: population * generations,
          seed: 0xc0ffee_5040n,
        }),
        `${family} admission`
      );
      // Wall-clock elapsed is a labeled UI/runtime measurement, not a
      // simulation input. Date.now's 1 ms resolution is well below the
      // per-family budgets (hundreds of ms to seconds).
      const started = Date.now();
      let finalBest = initialBest;
      let evaluations = 0;
      try {
        for (let generationIndex = 0; generationIndex < generations; generationIndex++) {
          const ask = requireOk(session.ask(), `${family} ask`);
          const evaluation = await evaluationPool.evaluate(
            ask.candidates,
            () => requireOk(
              evaluator.evaluatePopulation(ask.candidates),
              `${family} sequential G1 population`
            )
          );
          parallelAnnounced = reportParallelEvaluation(evaluation, parallelAnnounced);
          const snapshot = requireOk(
            session.tell(ask.generation, evaluation.objectives),
            `${family} tell`
          );
          finalBest = Math.min(finalBest, snapshot.best?.objective ?? finalBest);
          evaluations = snapshot.evaluations;
        }
        rows.push({
          family,
          initialBest,
          finalBest,
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
    ? preview(request.challenge ?? "terrain-and-push")
    : request.type === "compare"
      ? compareFamilies(request.generations)
      : optimize(request.family, request.generations, request.seedIndex, request.mode, request.challenge);
  void task.catch((error: unknown) => {
    post({ type: "error", message: error instanceof Error ? error.message : String(error) });
  });
};

export {};
