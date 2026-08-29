const wasm = await import("../public/wasm/fs-cmaes/v066/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v066/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });
console.log("v066 kernel version:", wasm.cmaes_viz_kernel_version());

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315736, 6, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);
const receipt = evaluator.receipt();
console.log("receipt:", Array.from(receipt));
const stabilizing = evaluator.stabilizing_policy_mean();
console.log("stabilizing nonzero count:", stabilizing.filter(v => v !== 0).length);
const ev = evaluator.evaluate(stabilizing);
console.log("stab eval:", Array.from(ev));
