import { decodeG1Admission, decodeG1Evaluation } from "../app/lib/frankensimCmaes.ts";

const wasm = await import("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

console.log("kernel version:", wasm.cmaes_viz_kernel_version());
console.log("model id:", wasm.g1_walking_model_id?.() || "no accessor");

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);
const receipt = evaluator.receipt();
console.log("receipt:", Array.from(receipt));

const adm = decodeG1Admission(receipt);
if ("ok" in adm) {
  console.log("linkCount:", adm.ok.linkCount, "policyDim:", adm.ok.policyDimension);
  console.log("traceSampleWords:", adm.ok.traceSampleWords);
}

const curriculum = evaluator.walking_curriculum_mean();
const rawEval = evaluator.evaluate(curriculum);
console.log("curriculum eval packet:", Array.from(rawEval));
