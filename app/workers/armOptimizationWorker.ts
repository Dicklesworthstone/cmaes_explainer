/// <reference lib="webworker" />

import {
  DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
  createFrankenSimCmaFamilySession,
  createFrankenSimHouseholdManipulationEvaluator,
  type CmaFamily,
  type HouseholdManipulationConfig,
  type HouseholdManipulationAdmission,
  type HouseholdManipulationTask,
  type HouseholdManipulationTraceReceipt,
} from "../lib/frankensimCmaes";

type WorkerRequest =
  | { type: "preview"; task: HouseholdManipulationTask }
  | {
      type: "optimize";
      task: HouseholdManipulationTask;
      family: CmaFamily;
      generations: number;
      seedIndex: number;
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
  requestedSeedIndex: number
): Promise<void> {
  const generations = Math.max(2, Math.min(20, Math.trunc(requestedGenerations)));
  const seedIndex = Math.max(0, Math.min(2, Math.trunc(requestedSeedIndex)));
  post({
    type: "status",
    phase: "optimizing",
    detail: `${family} is evaluating ${POPULATION} complete 4 s articulated pick-and-place rollouts per generation…`,
  });

  const evaluator = requireOk(
    await createFrankenSimHouseholdManipulationEvaluator(taskConfig(task)),
    "household-arm admission"
  );
  let bestPolicy = evaluator.curriculumPolicyMean();
  let bestObjective = requireOk(
    evaluator.evaluate(bestPolicy),
    "household-arm curriculum evaluation"
  ).objective;
  let completedGeneration = 0;
  try {
    const session = requireOk(
      await createFrankenSimCmaFamilySession({
        family,
        mean: bestPolicy,
        sigma: 0.001,
        population: POPULATION,
        memory: memoryFor(family),
        maxEvaluations: POPULATION * generations,
        seed: 0x4152_4d31n + BigInt(seedIndex),
      }),
      "CMA admission"
    );
    try {
      for (let generationIndex = 0; generationIndex < generations; generationIndex++) {
        const ask = requireOk(session.ask(), "CMA ask");
        const objectives = requireOk(
          evaluator.evaluatePopulation(ask.candidates),
          "household-arm population evaluation"
        );
        const snapshot = requireOk(session.tell(ask.generation, objectives), "CMA tell");
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
      detail: "Replaying the best policy through the identical owner physics and success test…",
    });
    const trace = requireOk(evaluator.trace(bestPolicy), "optimized household-arm trace");
    post({
      type: "trace",
      trace,
      admission: evaluator.admission,
      generation: completedGeneration,
      family,
    });
  } finally {
    evaluator.free();
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

  const evaluator = requireOk(
    await createFrankenSimHouseholdManipulationEvaluator(taskConfig(task)),
    "household-arm admission"
  );
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
      const started = performance.now();
      let finalObjective = initialObjective;
      let evaluations = 0;
      try {
        for (let generationIndex = 0; generationIndex < generations; generationIndex++) {
          const ask = requireOk(session.ask(), `${family} ask`);
          const objectives = requireOk(
            evaluator.evaluatePopulation(ask.candidates),
            `${family} physical population`
          );
          const snapshot = requireOk(
            session.tell(ask.generation, objectives),
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
          elapsedMilliseconds: performance.now() - started,
        });
      } finally {
        session.free();
      }
    }
  } finally {
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
      : optimize(request.task, request.family, request.generations, request.seedIndex);
  void task.catch((error: unknown) => {
    post({ type: "error", message: error instanceof Error ? error.message : String(error) });
  });
};

export {};
