import { decodeG1Admission, decodeG1Evaluation, decodeG1Trace } from "../app/lib/frankensimCmaes.ts";

const wasm = await import("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });
console.log("kernel version:", wasm.cmaes_viz_kernel_version());

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);
const receipt = evaluator.receipt();
console.log("receipt:", Array.from(receipt));

const stabilizing = evaluator.stabilizing_policy_mean();
const sEval = decodeG1Evaluation(evaluator.evaluate(stabilizing));
if ("ok" in sEval) {
  console.log("stab: steps=" + sEval.ok.completedSteps, "term=" + sEval.ok.terminationReason, "dist=" + sEval.ok.distanceMeters.toFixed(3), "minBase=" + sEval.ok.minimumBaseHeightMeters.toFixed(3));
}
const curriculum = evaluator.walking_curriculum_mean();
const cEval = decodeG1Evaluation(evaluator.evaluate(curriculum));
if ("ok" in cEval) {
  console.log("curr: steps=" + cEval.ok.completedSteps, "term=" + cEval.ok.terminationReason, "dist=" + cEval.ok.distanceMeters.toFixed(3), "minBase=" + cEval.ok.minimumBaseHeightMeters.toFixed(3));
}
const aggressive = new Float64Array(5040).fill(0.03);
const aEval = decodeG1Evaluation(evaluator.evaluate(aggressive));
if ("ok" in aEval) {
  console.log("aggr: steps=" + aEval.ok.completedSteps, "term=" + aEval.ok.terminationReason);
}
