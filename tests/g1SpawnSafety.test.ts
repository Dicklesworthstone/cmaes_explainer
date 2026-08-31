// Regression test for the user's specific complaint: the G1 humanoid
// robot's DEFAULT spawn position must not be inside a wall, and must
// have positive body clearance against every OBB obstacle in the
// multi-obstacle house scene.

import { describe, expect, test } from "bun:test";
import {
  clampPositionAgainstHouseCollisions,
  createSceneFromHouseFurniture,
  distanceToOBB,
} from "../app/lib/houseMultiObstacleKernel";

const DEFAULT_G1_PELVIS: [number, number, number] = [0, 0.75, 0];
const ROBOT_BODY_RADIUS = 0.32;

const scene = createSceneFromHouseFurniture();
const allObstacles = scene.obstacles;

describe("G1 default spawn position (cmaes-s0ey regression guard)", () => {
  test("default pelvis is inside the house bounds", () => {
    const [x, , z] = DEFAULT_G1_PELVIS;
    expect(x).toBeGreaterThanOrEqual(scene.bounds.min[0]);
    expect(x).toBeLessThanOrEqual(scene.bounds.max[0]);
    expect(z).toBeGreaterThanOrEqual(scene.bounds.min[1]);
    expect(z).toBeLessThanOrEqual(scene.bounds.max[1]);
  });

  test("default pelvis has positive clearance against every OBB obstacle", () => {
    for (const obb of allObstacles) {
      const dist = distanceToOBB(DEFAULT_G1_PELVIS, obb);
      expect(
        dist,
        `pelvis at default spawn penetrates OBB ${obb.name} (dist=${dist.toFixed(4)})`,
      ).toBeGreaterThanOrEqual(ROBOT_BODY_RADIUS);
    }
  });

  test("clamp is a no-op on the default spawn", () => {
    const { isColliding, nearestObstacleName, minClearance } =
      clampPositionAgainstHouseCollisions(
        DEFAULT_G1_PELVIS,
        allObstacles,
        ROBOT_BODY_RADIUS,
      );
    expect(
      isColliding,
      `default spawn is colliding with ${nearestObstacleName ?? "<unknown>"} (minClearance=${minClearance.toFixed(4)} m)`,
    ).toBe(false);
  });

  test("clamp correctly handles a known-bad point", () => {
    if (allObstacles.length === 0) return;
    const target = allObstacles[0];
    const result = clampPositionAgainstHouseCollisions(
      [target.center[0], DEFAULT_G1_PELVIS[1], target.center[2]],
      allObstacles,
      ROBOT_BODY_RADIUS,
    );
    expect(result.isColliding).toBe(false);
    expect(result.nearestObstacleName).toBe(target.name);
    const afterDistance = distanceToOBB(result.clampedPosition, target);
    expect(afterDistance).toBeGreaterThanOrEqual(ROBOT_BODY_RADIUS);
  });
});

describe("clampPositionAgainstHouseCollisions — yawed OBB regression", () => {
  test("a G1 pelvis inside a yawed chair must be projected out, not left inside", () => {
    // The user reported the G1 spawning inside a chair when the chair is
    // yawed. The previous radial-from-center projection in
    // clampPositionAgainstHouseCollisions left the pelvis inside. This
    // test pins the corrected behavior: the kernel's projectPointOutOfOBB
    // (SDF gradient) is used and the Y coordinate is updated when the OBB
    // pushes the pelvis up.
    const yawedChair = {
      id: "yawed-chair",
      name: "yawed-chair",
      center: [1.0, 0.475, 1.6] as [number, number, number],
      halfExtents: [0.225, 0.475, 0.25] as [number, number, number],
      rotationYawRad: Math.PI, // 180-degree yaw
    };
    // Pelvis 1 cm past the chair center on the +X axis.
    const pelvis: [number, number, number] = [1.01, 0.85, 1.6];
    const r = clampPositionAgainstHouseCollisions(
      pelvis,
      [yawedChair],
      0.32,
    );
    expect(distanceToOBB(r.clampedPosition, yawedChair)).toBeGreaterThanOrEqual(
      0.32 - 1e-6,
    );
    // The Y coordinate must have been updated (the chair is tall enough
    // to push the pelvis above the original Y).
    expect(r.clampedPosition[1]).toBeGreaterThan(pelvis[1]);
  });
});
