/// <reference lib="webworker" />

import {
  DEFAULT_G1_WALKING_CONFIG,
  createFrankenSimCmaFamilySession,
  createFrankenSimG1WalkingEvaluator,
  type CmaFamily,
  type G1TraceReceipt,
} from "../lib/frankensimCmaes";

type WorkerRequest =
  | { type: "preview" }
  | { type: "optimize"; family: Exclude<CmaFamily, "full">; generations: number }
  | { type: "compare"; generations: number };

type WorkerResponse =
  | { type: "status"; phase: string; detail: string }
  | { type: "trace"; trace: G1TraceReceipt; generation: number; family: CmaFamily | "baseline" }
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

async function preview(): Promise<void> {
  post({ type: "status", phase: "loading", detail: "Loading the owner-composed G1 evaluator…" });
  const evaluator = requireOk(
    await createFrankenSimG1WalkingEvaluator(DEFAULT_G1_WALKING_CONFIG),
    "G1 admission"
  );
  try {
    const policy = new Float64Array(evaluator.admission.policyDimension);
    const trace = requireOk(evaluator.trace(policy), "baseline trace");
    post({ type: "trace", trace, generation: 0, family: "baseline" });
  } finally {
    evaluator.free();
  }
}

async function optimize(
  family: Exclude<CmaFamily, "full">,
  requestedGenerations: number
): Promise<void> {
  const generations = Math.max(8, Math.min(40, Math.trunc(requestedGenerations)));
  const population = 16;
  const policyDimension = 5_040;
  post({
    type: "status",
    phase: "optimizing",
    detail: `${family} is evaluating ${population} full 1.5 s articulated-body rollouts per generation…`,
  });

  // Training and replay deliberately share one admitted evaluator. Optimizing
  // a short proxy and replaying a longer experiment rewards a different
  // behavior than the one the user sees.
  const evaluator = requireOk(
    await createFrankenSimG1WalkingEvaluator(DEFAULT_G1_WALKING_CONFIG),
    "G1 admission"
  );
  let bestPolicy = new Float64Array(policyDimension);
  let bestObjective = requireOk(evaluator.evaluate(bestPolicy), "G1 baseline evaluation").objective;
  let completedGeneration = 0;
  try {
    const session = requireOk(
      await createFrankenSimCmaFamilySession({
        family,
        mean: new Float64Array(policyDimension),
        sigma: 0.01,
        population,
        memory: family === "lm-cma" || family === "lm-ma" ? 12 : undefined,
        maxEvaluations: population * generations,
        seed: 0x4731_5040n,
      }),
      "CMA admission"
    );
    try {
      for (let generationIndex = 0; generationIndex < generations; generationIndex++) {
        const ask = requireOk(session.ask(), "CMA ask");
        const objectives = requireOk(
          evaluator.evaluatePopulation(ask.candidates),
          "G1 population evaluation"
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
      detail: "Rendering the best policy on the identical full-horizon experiment…",
    });
    const trace = requireOk(evaluator.trace(bestPolicy), "optimized trace");
    post({ type: "trace", trace, generation: completedGeneration, family });
  } finally {
    evaluator.free();
  }
}

function ellipsoidObjective(candidates: Float64Array, dimension: number): Float64Array {
  const population = candidates.length / dimension;
  const objectives = new Float64Array(population);
  for (let candidate = 0; candidate < population; candidate++) {
    let objective = 0;
    const offset = candidate * dimension;
    for (let coordinate = 0; coordinate < dimension; coordinate++) {
      const value = candidates[offset + coordinate];
      const weight = 10 ** ((4 * coordinate) / Math.max(1, dimension - 1));
      objective += weight * value * value;
    }
    objectives[candidate] = objective;
  }
  return objectives;
}

async function compareFamilies(requestedGenerations: number): Promise<void> {
  const generations = Math.max(2, Math.min(20, Math.trunc(requestedGenerations)));
  const dimension = 96;
  const population = 16;
  const families: CmaFamily[] = ["full", "separable", "lm-cma", "lm-ma"];
  const rows: Extract<WorkerResponse, { type: "comparison" }>["rows"] = [];
  post({
    type: "status",
    phase: "comparing",
    detail: "Running all four owner implementations at the same 96-D evaluation budget…",
  });

  for (const family of families) {
    const session = requireOk(
      await createFrankenSimCmaFamilySession({
        family,
        mean: new Float64Array(dimension).fill(1.5),
        sigma: 0.35,
        population,
        memory: family === "lm-cma" || family === "lm-ma" ? 12 : undefined,
        maxEvaluations: population * generations,
        seed: 0xc0ffee_5040n,
      }),
      `${family} admission`
    );
    const started = performance.now();
    let initialBest = Infinity;
    let finalBest = Infinity;
    let evaluations = 0;
    try {
      for (let generationIndex = 0; generationIndex < generations; generationIndex++) {
        const ask = requireOk(session.ask(), `${family} ask`);
        const objectives = ellipsoidObjective(ask.candidates, ask.dimension);
        const generationBest = objectives.reduce((best, value) => Math.min(best, value), Infinity);
        if (generationIndex === 0) initialBest = generationBest;
        const snapshot = requireOk(session.tell(ask.generation, objectives), `${family} tell`);
        finalBest = snapshot.best?.objective ?? generationBest;
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
  post({ type: "comparison", rows });
}

worker.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  const task = request.type === "preview"
    ? preview()
    : request.type === "compare"
      ? compareFamilies(request.generations)
      : optimize(request.family, request.generations);
  void task.catch((error: unknown) => {
    post({ type: "error", message: error instanceof Error ? error.message : String(error) });
  });
};

export {};
