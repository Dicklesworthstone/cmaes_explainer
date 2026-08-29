import { buildCmaFamilyConfig, decodeCmaFamilyAsk, decodeCmaFamilySnapshot, decodeG1Admission, decodeG1Evaluation, decodeG1Population, decodeG1Trace } from "../app/lib/frankensimCmaes.ts";

const OWNER_CMA_MAGIC = 0x434d4132;

const wasm = await import("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);

const curriculum = evaluator.walking_curriculum_mean();
const cEval = decodeG1Evaluation(evaluator.evaluate(curriculum));
if ("ok" in cEval) {
  console.log("curriculum: steps=" + cEval.ok.completedSteps, "term=" + cEval.ok.terminationReason, "dist=" + cEval.ok.distanceMeters.toFixed(3), "obj=" + cEval.ok.objective.toFixed(1));
}

const population = 16;
const generations = 16;
const session = new wasm.CmaesVizSession(
  buildCmaFamilyConfig({
    family: "separable",
    mean: curriculum,
    sigma: 0.0005,
    maxEvaluations: population * generations,
    population,
    seed: 0x47315050n,
  })
);
let bestPoint = curriculum;
let bestObjective = cEval.ok.objective;
try {
  for (let gen = 0; gen < generations; gen++) {
    const ask = decodeCmaFamilyAsk(session.ask());
    if (!("ok" in ask)) throw new Error("ask refused");
    const objs = decodeG1Population(evaluator.evaluate_population(ask.ok.candidates));
    if (!("ok" in objs)) throw new Error("eval refused");
    const tell = Float64Array.from([
      OWNER_CMA_MAGIC, 2, 3, 6 + population, ask.ok.generation, population, ...objs.ok,
    ]);
    const snap = decodeCmaFamilySnapshot(session.tell(tell), 4);
    if (!("ok" in snap)) throw new Error("tell refused");
    if (snap.ok.best) {
      const testEval = decodeG1Evaluation(evaluator.evaluate(snap.ok.best.point));
      if ("ok" in testEval) {
        console.log("gen " + gen + ": best steps=" + testEval.ok.completedSteps + " obj=" + testEval.ok.objective.toFixed(1) + " dist=" + testEval.ok.distanceMeters.toFixed(3) + " term=" + testEval.ok.terminationReason);
        if (testEval.ok.objective < bestObjective) {
          bestObjective = testEval.ok.objective;
          bestPoint = snap.ok.best.point.slice();
        }
      }
    }
  }
} finally {
  session.free();
}

const finalEval = decodeG1Evaluation(evaluator.evaluate(bestPoint));
if ("ok" in finalEval) {
  console.log("\nfinal: steps=" + finalEval.ok.completedSteps, "term=" + finalEval.ok.terminationReason, "dist=" + finalEval.ok.distanceMeters.toFixed(3), "obj=" + finalEval.ok.objective.toFixed(1));
  console.log("  mean speed over " + finalEval.ok.completedSteps + " steps:", (finalEval.ok.distanceMeters / (finalEval.ok.completedSteps / 480)).toFixed(3), "m/s");
  console.log("  single support:", finalEval.ok.singleSupportSeconds.toFixed(3), "s");
  console.log("  max tilt:", finalEval.ok.maximumTiltSine.toFixed(3));
}
