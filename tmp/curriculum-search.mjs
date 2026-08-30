import { buildCmaFamilyConfig, decodeCmaFamilyAsk, decodeCmaFamilySnapshot, decodeG1Evaluation, decodeG1Population, decodeG1Trace } from "../app/lib/frankensimCmaes.ts";

const OWNER_CMA_MAGIC = 0x434d4132;

const wasm = await import("../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);

const policyDim = 5040;
const curriculum = evaluator.walking_curriculum_mean();
console.log("curriculum nonzero:", curriculum.filter(v => v !== 0).length);

const zeroEval = decodeG1Evaluation(evaluator.evaluate(new Float64Array(policyDim)));
console.log("zero:", zeroEval.ok.completedSteps, "steps", zeroEval.ok.terminationReason);

const biasOnly = new Float64Array(policyDim);
for (let a = 0; a < 15; a++) {
  biasOnly[a * 336] = curriculum[a * 336] * 0.6;
}
const biasEval = decodeG1Evaluation(evaluator.evaluate(biasOnly));
console.log("bias-60%:", biasEval.ok.completedSteps, "steps", biasEval.ok.terminationReason);

for (const scale of [0.5, 0.7, 0.85, 1.0, 1.2, 1.5, 2.0]) {
  const scaled = new Float64Array(policyDim);
  for (let i = 0; i < policyDim; i++) scaled[i] = curriculum[i] * scale;
  const ev = decodeG1Evaluation(evaluator.evaluate(scaled));
  if ("ok" in ev) {
    const e = ev.ok;
    console.log(`scale=${scale}: steps=${e.completedSteps} term=${e.terminationReason} dist=${e.distanceMeters.toFixed(3)} obj=${e.objective.toFixed(1)}`);
  }
}
