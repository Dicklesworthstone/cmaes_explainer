// Diagnostic probe for cmaes-pvz regression: dump full receipts using the real decoder.
import {
  decodeG1Admission,
  decodeG1Evaluation,
} from "/Users/jemanuel/projects/cmaes_explainer/app/lib/frankensimCmaes.ts";

const repo = "/Users/jemanuel/projects/cmaes_explainer";
const wasm = await import(`${repo}/public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm.js`);
const wasmBytes = await Bun.file(`${repo}/public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm_bg.wasm`).arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

console.log("kernel:", wasm.cmaes_viz_kernel_version());

const evaluator = new wasm.G1WalkingVizEvaluator(
  new Float64Array([
    0x47315737, 7, 0, 11, 1 / 480, 1.5, 0.65, 1.55, 12, 2, 1,
  ]),
);

const admission = decodeG1Admission(evaluator.receipt());
console.log("admission ok?", "ok" in admission);
if ("ok" in admission) {
  console.log("  policyDimension:", admission.ok.policyDimension);
}

const stabilizingPolicy = evaluator.stabilizing_policy_mean();
const curriculumPolicy = evaluator.walking_curriculum_mean();
const aggressivePolicy = new Float64Array(5040).fill(0.03);

function dump(label, packet) {
  const r = decodeG1Evaluation(packet);
  if (!("ok" in r)) {
    console.log(`\n=== ${label} === refusal:`, r.refusal);
    return;
  }
  const ok = r.ok;
  console.log(`\n=== ${label} ===`);
  console.log(`  objective:        ${ok.objective.toFixed(3)}`);
  console.log(`  distance_m:       ${ok.distanceMeters.toFixed(3)}`);
  console.log(`  speed_error_int:  ${ok.speedErrorIntegral.toFixed(3)}`);
  console.log(`  actuator_work_J:  ${ok.actuatorWorkJoules.toFixed(3)}`);
  console.log(`  slip_int:         ${ok.slipIntegral.toFixed(3)}`);
  console.log(`  posture_int:      ${ok.postureIntegral.toFixed(3)}`);
  console.log(`  joint_limit_int:  ${ok.jointLimitIntegral.toFixed(3)}`);
  console.log(`  impact_int:       ${ok.impactIntegral.toFixed(3)}`);
  console.log(`  backward_m:       ${ok.backwardDistanceMeters.toFixed(3)}`);
  console.log(`  lateral_int:      ${ok.lateralErrorIntegral.toFixed(3)}`);
  console.log(`  heading_int:      ${ok.headingErrorIntegral.toFixed(3)}`);
  console.log(`  contact_mismatch: ${ok.contactScheduleMismatchIntegral.toFixed(3)}`);
  console.log(`  clearance_int:    ${ok.swingClearanceErrorIntegral.toFixed(3)}`);
  console.log(`  single_supp_s:    ${ok.singleSupportSeconds.toFixed(3)}`);
  console.log(`  double_supp_s:    ${ok.doubleSupportSeconds.toFixed(3)}`);
  console.log(`  flight_s:         ${ok.flightSeconds.toFixed(3)}`);
  console.log(`  push_impulse_Ns:  ${ok.pushImpulseNewtonSeconds.toFixed(3)}`);
  console.log(`  recovery_s:       ${ok.recoveryTimeSeconds.toFixed(3)}`);
  console.log(`  min_base_height:  ${ok.minimumBaseHeightMeters.toFixed(3)}`);
  console.log(`  max_tilt_sine:    ${ok.maximumTiltSine.toFixed(3)}`);
  console.log(`  max_terrain_m:    ${ok.maximumAbsoluteTerrainHeightMeters.toFixed(3)}`);
  console.log(`  completed_steps:  ${ok.completedSteps}`);
  console.log(`  termination:      ${ok.terminationReason}`);
}

dump("STANDING PRIOR", evaluator.evaluate(stabilizingPolicy));
dump("CURRICULUM", evaluator.evaluate(curriculumPolicy));
dump("AGGRESSIVE (all 0.03)", evaluator.evaluate(aggressivePolicy));
