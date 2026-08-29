import { decodeG1Admission, decodeG1Evaluation, decodeG1Trace } from "../app/lib/frankensimCmaes.ts";

const wasm = await import("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);

const stabilizing = evaluator.stabilizing_policy_mean();
const rawEval = evaluator.evaluate(stabilizing);
console.log("raw eval packet:", Array.from(rawEval));
console.log("packet length:", rawEval.length);

const curriculum = evaluator.walking_curriculum_mean();
const rawCurriculum = evaluator.evaluate(curriculum);
console.log("raw curriculum packet:", Array.from(rawCurriculum));
console.log("curriculum packet length:", rawCurriculum.length);

const rawTrace = evaluator.trace(curriculum);
console.log("raw trace packet length:", rawTrace.length);
console.log("raw trace packet (last 20):", Array.from(rawTrace.slice(-20)));
