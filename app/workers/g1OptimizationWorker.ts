/// <reference lib="webworker" />

import {
  DEFAULT_G1_WALKING_CONFIG,
  createFrankenSimCmaFamilySession,
  createFrankenSimG1WalkingEvaluator,
  type CmaFamily,
  type G1Admission,
  type G1TraceReceipt,
} from "../lib/frankensimCmaes";
import { RoboticsEvaluationPool } from "../lib/roboticsEvaluationPool";

type WorkerRequest =
  | { type: "preview" }
  | {
      type: "optimize";
      family: Exclude<CmaFamily, "full">;
      generations: number;
      seedIndex: number;
    }
  | { type: "compare"; generations: number };

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

async function preview(): Promise<void> {
  post({ type: "status", phase: "loading", detail: "Loading the owner-composed G1 evaluator…" });
  const evaluator = requireOk(
    await createFrankenSimG1WalkingEvaluator(DEFAULT_G1_WALKING_CONFIG),
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

async function optimize(
  family: Exclude<CmaFamily, "full">,
  requestedGenerations: number,
  requestedSeedIndex: number
): Promise<void> {
  const generations = Math.max(8, Math.min(40, Math.trunc(requestedGenerations)));
  const seedIndex = Math.max(0, Math.min(2, Math.trunc(requestedSeedIndex)));
  const population = 16;
  post({
    type: "status",
    phase: "optimizing",
    detail: `${family}, seed ${seedIndex + 1}, is evaluating ${population} full 1.5 s articulated-body rollouts per generation…`,
  });

  // Training and replay deliberately share one admitted evaluator. Optimizing
  // a short proxy and replaying a longer experiment rewards a different
  // behavior than the one the user sees.
  const evaluator = requireOk(
    await createFrankenSimG1WalkingEvaluator(DEFAULT_G1_WALKING_CONFIG),
    "G1 admission"
  );
  const evaluationPool = new RoboticsEvaluationPool({
    model: "g1",
    config: DEFAULT_G1_WALKING_CONFIG,
    dimension: 5_040,
  });
  try {
    let bestPolicy = evaluator.walkingCurriculumMean();
    let bestObjective = requireOk(
      evaluator.evaluate(bestPolicy),
      "G1 curriculum evaluation"
    ).objective;
    let completedGeneration = 0;
    let parallelAnnounced = false;
    const session = requireOk(
      await createFrankenSimCmaFamilySession({
        family,
        mean: bestPolicy,
        sigma: 0.0005,
        population,
        memory: family === "lm-cma" || family === "lm-ma" ? 12 : undefined,
        maxEvaluations: population * generations,
        seed: 0x4731_5050n + BigInt(seedIndex),
      }),
      "CMA admission"
    );
    try {
      for (let generationIndex = 0; generationIndex < generations; generationIndex++) {
        const ask = requireOk(session.ask(), "CMA ask");
        const evaluation = await evaluationPool.evaluate(
          ask.candidates,
          () => requireOk(
            evaluator.evaluatePopulation(ask.candidates),
            "sequential G1 population evaluation"
          )
        );
        parallelAnnounced = reportParallelEvaluation(evaluation, parallelAnnounced);
        const snapshot = requireOk(
          session.tell(ask.generation, evaluation.objectives),
          "CMA tell"
        );
        completedGeneration = snapshot.generation;
        if (snapshot.best && snapshot.best.objective < bestObjective) {
          bestObjective = snapshot.best.objective;
          bestPolicy = snapshot.best.point.slice();
        }
        post({
          type: "progress",
          family,
          generation: snapshot.generation,
          maxGenerations: snapshot.maxGenerations,
          bestObjective,
          sigma: snapshot.sigma,
        });
      }
    } finally {
      session.free();
    }
    post({
      type: "status",
      phase: "replaying",
      detail: "Rendering the best policy on the identical full-horizon experiment…",
    });
    const trace = requireOk(evaluator.trace(bestPolicy), "optimized trace");
    post({
      type: "trace",
      trace,
      admission: evaluator.admission,
      generation: completedGeneration,
      family,
    });
  } finally {
    evaluationPool.free();
    evaluator.free();
  }
}

async function compareFamilies(requestedGenerations: number): Promise<void> {
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
    await createFrankenSimG1WalkingEvaluator(DEFAULT_G1_WALKING_CONFIG),
    "G1 comparison admission"
  );
  const evaluationPool = new RoboticsEvaluationPool({
    model: "g1",
    config: DEFAULT_G1_WALKING_CONFIG,
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
      const started = performance.now();
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
          elapsedMilliseconds: performance.now() - started,
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
    ? preview()
    : request.type === "compare"
      ? compareFamilies(request.generations)
      : optimize(request.family, request.generations, request.seedIndex);
  void task.catch((error: unknown) => {
    post({ type: "error", message: error instanceof Error ? error.message : String(error) });
  });
};

export {};
