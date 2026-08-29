import { decodeG1Admission, decodeG1Evaluation, decodeG1Trace } from "../app/lib/frankensimCmaes.ts";

const wasm = await import("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);

const curriculum = evaluator.walking_curriculum_mean();
const cTrace = decoder(evaluator.trace(curriculum));
function decoder(p) {
  return decodeG1Trace(p);
}
if ("ok" in cTrace) {
  console.log("trace samples:", cTrace.ok.samples.length);
  console.log("trace completedSteps:", cTrace.ok.completedSteps);
  console.log("trace distance:", cTrace.ok.distanceMeters.toFixed(3));
  console.log("trace objective:", cTrace.ok.objective.toFixed(1));
}
