import { describe, expect, test } from "bun:test";
import { armCameraObstacles, armGraspCameraBoom, armGraspCameraFov } from "../app/lib/armCameraFraming";
import { PerspectiveCamera, Vector3 } from "three";
import { robotCameraFramingCorners, robotCameraVerticalFov } from "../app/lib/robotCameraFraming";
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
    let oldLensClipped = 0;
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
          const w = sample.linkPoses[7].position;
          const wrist: [number, number, number] = [w[0], w[2], -w[1]];
          const corners = robotCameraFramingCorners([object, wrist].map(([x, y, z]) => ({ x, y, z })));
          for (const width of [390, 650, 820, 1180]) {
            const minimum = robotCameraVerticalFov(38, width, 420);
            const camera = new PerspectiveCamera(minimum, width / 420, 0.03, 30);
            camera.position.set(...boom.position);
            camera.lookAt(new Vector3(...boom.lookAt));
            camera.updateMatrixWorld();
            if (corners.some(point => {
              const projected = new Vector3(point.x, point.y, point.z).project(camera);
              return Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1;
            })) oldLensClipped++;
            camera.fov = armGraspCameraFov(camera, object, wrist, minimum);
            camera.updateProjectionMatrix();
            expect(camera.fov).toBeGreaterThanOrEqual(minimum);
            expect(camera.fov).toBeLessThanOrEqual(100);
            for (const point of corners) {
              const projected = new Vector3(point.x, point.y, point.z).project(camera);
              expect(Math.abs(projected.x)).toBeLessThanOrEqual(0.851);
              expect(Math.abs(projected.y)).toBeLessThanOrEqual(0.851);
              expect(projected.z).toBeGreaterThan(-1);
              expect(projected.z).toBeLessThan(1);
            }
          }
        }
        expect(JSON.stringify(decoded.ok)).toBe(before);
      } finally { evaluator.free(); }
    }
    expect(oldCollapsed).toBeGreaterThan(0);
    expect(oldLensClipped).toBeGreaterThan(0);
  });
});
