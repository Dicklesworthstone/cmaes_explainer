import { decodeG1Admission, decodeG1Evaluation, decodeG1Trace } from "../app/lib/frankensimCmaes.ts";

const wasm = await import("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);
const receipt = evaluator.receipt();
console.log("receipt:", Array.from(receipt));
const admission = decodeG1Admission(receipt);
if (!("ok" in admission)) {
  console.log("admission refusal:", admission.refusal);
} else {
  console.log("admission:", JSON.stringify(admission.ok, null, 2));
  const stabilizing = evaluator.stabilizing_policy_mean();
  console.log("stabilizing nonzero count:", stabilizing.filter(v => v !== 0).length);
  const ev = decodeG1Evaluation(evaluator.evaluate(stabilizing));
  if (!("ok" in ev)) {
    console.log("eval refusal:", ev.refusal);
  } else {
    console.log("stab eval:", JSON.stringify(ev.ok, null, 2));
  }
}
