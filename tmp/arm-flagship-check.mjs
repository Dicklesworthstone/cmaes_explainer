import { decodeHouseholdManipulationAdmission, decodeHouseholdManipulationEvaluation, decodeHouseholdManipulationTrace } from "../app/lib/frankensimCmaes.ts";

const wasm = await import("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm.js");
const wasmBytes = await Bun.file("../public/wasm/fs-cmaes/v067/fs_cmaes_viz_wasm_bg.wasm").arrayBuffer();
await wasm.default({ module_or_path: wasmBytes });

for (const task of [0, 1, 2]) {
  const arm = new wasm.HouseholdManipulationVizEvaluator(
    new Float64Array([0x41524d31, 2, 0, 8, 1 / 90, 6, 3, task])
  );
  const adm = decodeHouseholdManipulationAdmission(arm.receipt());
  if (!("ok" in adm)) {
    console.log("task " + task + " adm refused:", adm.refusal);
    arm.free();
    continue;
  }
  const mean = arm.curriculum_policy_mean();
  console.log("task " + task + ": policyDim=" + adm.ok.policyDimension + " linkCount=" + adm.ok.linkCount);
  const ev = decodeHouseholdManipulationEvaluation(arm.evaluate(mean));
  if ("ok" in ev) {
    console.log("  everGrasped=" + ev.ok.everGrasped + " releasedAfterTransport=" + ev.ok.releasedAfterTransport + " placed=" + ev.ok.placed);
    console.log("  maxLift=" + ev.ok.maximumLiftMeters.toFixed(3) + " finalErr=" + ev.ok.finalObjectErrorMeters.toFixed(3));
  }
  const tr = decodeHouseholdManipulationTrace(arm.trace(mean));
  if ("ok" in tr) {
    console.log("  trace samples=" + tr.ok.samples.length);
  }
  arm.free();
}
