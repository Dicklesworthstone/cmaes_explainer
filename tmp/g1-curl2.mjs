import { decodeG1Admission, decodeG1Evaluation, decodeG1Trace } from "../app/lib/frankensimCmaes.ts";

const wasm = await import("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);

const curriculum = evaluator.walking_curriculum_mean();
const cev = decodeG1Evaluation(evaluator.evaluate(curriculum));
if ("ok" in cev) {
  console.log("curriculum completedSteps:", cev.ok.completedSteps, "termination:", cev.ok.terminationReason, "distance:", cev.ok.distanceMeters);
  console.log("curriculum pushImpulse:", cev.ok.pushImpulseNewtonSeconds, "singleSupport:", cev.ok.singleSupportSeconds);
}
const aggressive = new Float64Array(5040).fill(0.03);
const aev = decodeG1Evaluation(evaluator.evaluate(aggressive));
if ("ok" in aev) {
  console.log("aggressive completedSteps:", aev.ok.completedSteps, "termination:", aev.ok.terminationReason);
}
