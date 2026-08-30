import { decodeG1Admission, decodeG1Evaluation, decodeG1Trace } from "../app/lib/frankensimCmaes.ts";

const wasm = await import("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("/Users/jemanuel/projects/frankensim/crates/fs-cmaes-viz-wasm/pkg/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });
console.log("kernel version:", wasm.cmaes_viz_kernel_version());
const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);
const receipt = evaluator.receipt();
console.log("admission OK, linkCount:", receipt[6], "policyDim:", receipt[5]);
const stab = evaluator.stabilizing_policy_mean();
const sEval = decodeG1Evaluation(evaluator.evaluate(stab));
if ("ok" in sEval) {
  console.log("stab: steps=" + sEval.ok.completedSteps + " term=" + sEval.ok.terminationReason + " dist=" + sEval.ok.distanceMeters.toFixed(3));
}
const curriculum = evaluator.walking_curriculum_mean();
const cEval = decodeG1Evaluation(evaluator.evaluate(curriculum));
if ("ok" in cEval) {
  console.log("curr: steps=" + cEval.ok.completedSteps + " term=" + cEval.ok.terminationReason + " dist=" + cEval.ok.distanceMeters.toFixed(3));
}
