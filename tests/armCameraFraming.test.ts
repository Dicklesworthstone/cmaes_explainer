import { describe, expect, test } from "bun:test";
import { armCameraObstacles, armGraspCameraBoom } from "../app/lib/armCameraFraming";
import {
  armCounterSlabObstacle, armStageObstacles, armWorkbenchObstacles,
  createHouseNavigationScene, distanceToOBB,
} from "../app/lib/houseMultiObstacleKernel";
import {
  buildHouseholdManipulationConfig, decodeHouseholdManipulationTrace,
  DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
} from "../app/lib/frankensimCmaes";

describe("Arm close-up camera matches the rendered stage", () => {
  test("retains every rendered support and keep-out, without invisible whole-house walls", () => {
    for (const task of ["kitchen-mug", "living-room-remote", "backyard-trowel"] as const) {
      const obstacles = armCameraObstacles(0.27, task);
      expect(obstacles).toEqual([armCounterSlabObstacle(0.27), ...armStageObstacles(0.27, task)]);
      expect(obstacles.some(o => o.name.includes("wall"))).toBe(false);
    }
  });

  test("real owner traces retain a clear close-up boom instead of collapsing onto the object", async () => {
    const owner = await import("../public/wasm/fs-cmaes/v0623/fs_cmaes_viz_wasm.js");
    await owner.default({module_or_path: await Bun.file(
      new URL("../public/wasm/fs-cmaes/v0623/fs_cmaes_viz_wasm_bg.wasm", import.meta.url),
    ).arrayBuffer()});
    let oldCollapsed = 0;
    for (const [task, support] of [["kitchen-mug", 0.2369], ["living-room-remote", 0.2769], ["backyard-trowel", 0.2649]] as const) {
      const evaluator = new owner.HouseholdManipulationVizEvaluator(
        buildHouseholdManipulationConfig({...DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG, task}),
      );
      try {
        const decoded = decodeHouseholdManipulationTrace(evaluator.trace(evaluator.curriculum_policy_mean()));
        if (!("ok" in decoded)) throw new Error(decoded.refusal.name);
        const before = JSON.stringify(decoded.ok);
        const obstacles = armCameraObstacles(support, task);
        const oldObstacles = [armCounterSlabObstacle(support), ...armWorkbenchObstacles(support, task), ...createHouseNavigationScene().obstacles];
        for (const sample of decoded.ok.samples) {
          const p = sample.objectPose.position;
          const object: [number, number, number] = [p[0], p[2], -p[1]];
          const boom = armGraspCameraBoom(object, obstacles);
          const old = armGraspCameraBoom(object, oldObstacles);
          if (old.fraction < 0.4) oldCollapsed++;
          expect(boom.fraction).toBeGreaterThan(0.65);
          for (const body of obstacles) {
            expect(distanceToOBB(boom.position, body)).toBeGreaterThan(0.06);
          }
        }
        expect(JSON.stringify(decoded.ok)).toBe(before);
      } finally { evaluator.free(); }
    }
    expect(oldCollapsed).toBeGreaterThan(0);
  });
});
