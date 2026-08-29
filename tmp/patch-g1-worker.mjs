#!/usr/bin/env node
// G1 worker: long-run cap + optimizer-state continuation + progress throttle.
// Content-anchored with loud failures; idempotent where possible.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/workers/g1OptimizationWorker.ts";
let src = readFileSync(FILE, "utf8");

function must(src, anchor, label) {
  const i = src.indexOf(anchor);
  if (i < 0) throw new Error(`anchor not found: ${label}`);
  return i;
}

// 1. Request type: optional mode on optimize.
if (!src.includes('mode?: "continue" | "fresh"')) {
  const before = 'seedIndex: number;\n    }';
  const i = must(src, before, "optimize request type");
  src = src.slice(0, i) + 'seedIndex: number;\n      mode?: "continue" | "fresh";\n    }' + src.slice(i + before.length);
  console.log("request type: mode added");
}

// 2. Dispatch passthrough.
const dispatchOld = ": optimize(request.family, request.generations, request.seedIndex);";
const dispatchNew = ": optimize(request.family, request.generations, request.seedIndex, request.mode);";
if (src.includes(dispatchOld)) {
  src = src.replace(dispatchOld, dispatchNew);
  console.log("dispatch: mode passed");
}

// 3. Replace the whole optimize() function with the continuation version.
const fnStart = must(src, "async function optimize(", "optimize start");
// The function ends right before the next top-level construct: find
// "async function compareFamilies" or end-of-file brace pattern.
let fnEnd = src.indexOf("\nasync function compareFamilies", fnStart);
if (fnEnd < 0) throw new Error("compareFamilies anchor not found (optimize end)");

const newOptimize = `type G1Evaluator = Awaited<ReturnType<typeof createFrankenSimG1WalkingEvaluator>>;
type G1CmaSession = Awaited<ReturnType<typeof createFrankenSimCmaFamilySession>>;

// Continuable optimization runs, keyed "family:seed". Keeping the CMA
// session (mean/sigma/covariance path) alive across requests lets the
// Optimize control extend a run for hundreds of generations instead of
// restarting from the curriculum mean every click. Runs are freed when
// replaced by a fresh request; the map is bounded to keep worker memory sane.
type G1ActiveRun = {
  session: G1CmaSession;
  evaluator: G1Evaluator;
  pool: RoboticsEvaluationPool;
  bestPolicy: number[];
  bestObjective: number;
  completedGeneration: number;
  maxTotalGenerations: number;
};
const G1_MAX_TOTAL_GENERATIONS = 2_000;
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
  mode: "continue" | "fresh" = "continue"
): Promise<void> {
  const generations = Math.max(8, Math.min(G1_MAX_TOTAL_GENERATIONS, Math.trunc(requestedGenerations)));
  const seedIndex = Math.max(0, Math.min(2, Math.trunc(requestedSeedIndex)));
  const population = G1_POPULATION;
  const runKey = \`\${family}:\${seedIndex}\`;

  let run = mode === "continue" ? g1ActiveRuns.get(runKey) : undefined;
  if (run) {
    post({
      type: "status",
      phase: "optimizing",
      detail: \`\${family}, seed \${seedIndex + 1}: continuing from generation \${run.completedGeneration} (\${generations} more generations)…\`,
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
      detail: \`\${family}, seed \${seedIndex + 1}: evaluating \${population} full 1.5 s articulated-body rollouts per generation…\`,
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
    let bestPolicy = Array.from(evaluator.walkingCurriculumMean());
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
    run = { session, evaluator, evaluationPool, bestPolicy, bestObjective, completedGeneration: 0, maxTotalGenerations: G1_MAX_TOTAL_GENERATIONS };
    g1ActiveRuns.set(runKey, run);
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
      detail: \`Rendering the generation-\${completedGeneration} best policy on the identical full-horizon experiment…\`,
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
`;

src = src.slice(0, fnStart) + newOptimize + src.slice(fnEnd + 1);
writeFileSync(FILE, src);
console.log("G1 worker: continuation + long-run cap installed");
