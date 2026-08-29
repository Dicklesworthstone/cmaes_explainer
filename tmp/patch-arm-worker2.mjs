#!/usr/bin/env node
// Arm worker part 2: replace optimize() body with the continuation version.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/workers/armOptimizationWorker.ts";
let src = readFileSync(FILE, "utf8");

const fnStart = src.indexOf("async function optimize(");
if (fnStart < 0) throw new Error("optimize start not found");
const fnEnd = src.indexOf("\nasync function compareFamilies", fnStart);
if (fnEnd < 0) throw new Error("compareFamilies end anchor not found");

const newOptimize = `async function optimize(
  task: HouseholdManipulationTask,
  family: CmaFamily,
  requestedGenerations: number,
  requestedSeedIndex: number,
  mode: "continue" | "fresh" = "continue"
): Promise<void> {
  const generations = Math.max(2, Math.min(ARM_MAX_TOTAL_GENERATIONS, Math.trunc(requestedGenerations)));
  const seedIndex = Math.max(0, Math.min(2, Math.trunc(requestedSeedIndex)));
  const runKey = \`\${task}:\${family}:\${seedIndex}\`;

  let run = mode === "continue" ? armActiveRuns.get(runKey) : undefined;
  if (run) {
    post({
      type: "status",
      phase: "optimizing",
      detail: \`\${family}, seed \${seedIndex + 1}: continuing from generation \${run.completedGeneration} (\${generations} more generations)…\`,
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
      detail: \`\${family} is evaluating \${POPULATION} complete 6 s articulated pick-and-place rollouts per generation…\`,
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
`;

src = src.slice(0, fnStart) + newOptimize + src.slice(fnEnd + 1);
writeFileSync(FILE, src);
console.log("PART 2 OK (optimize continuation installed)");
