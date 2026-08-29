import { decodeG1Admission, decodeG1Evaluation, decodeG1Trace } from "../app/lib/frankensimCmaes.ts";

const wasm = await import("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v068/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([0x47315737, 7, 0, 11, 1/480, 1.5, 0.65, 1.55, 12, 2, 1])
);
const curriculum = evaluator.walking_curriculum_mean();
const cEval = decodeG1Evaluation(evaluator.evaluate(curriculum));
if ("ok" in cEval) {
  const e = cEval.ok;
  console.log("curriculum steps:", e.completedSteps, "term:", e.terminationReason);
  console.log("  distance:", e.distanceMeters.toFixed(3), "m");
  console.log("  mean speed over completed:", (e.distanceMeters / (e.completedSteps / 480)).toFixed(3), "m/s");
  console.log("  single support:", e.singleSupportSeconds.toFixed(3), "s");
  console.log("  double support:", e.doubleSupportSeconds.toFixed(3), "s");
  console.log("  flight:", e.flightSeconds.toFixed(3), "s");
  console.log("  push impulse:", e.pushImpulseNewtonSeconds.toFixed(3));
  console.log("  minimum base height:", e.minimumBaseHeightMeters.toFixed(3));
  console.log("  max tilt sine:", e.maximumTiltSine.toFixed(3));
  console.log("  speed error integral:", e.speedErrorIntegral.toFixed(3));
  console.log("  actuator work:", e.actuatorWorkJoules.toFixed(1), "J");
  console.log("  objective:", e.objective.toFixed(1));
  console.log("  backward distance:", e.backwardDistanceMeters.toFixed(3));
  console.log("  single_support per step:", (e.singleSupportSeconds * 480).toFixed(1));
}
