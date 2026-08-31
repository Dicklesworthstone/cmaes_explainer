/**
 * SOTA arm-collision interior-point regression suite.
 *
 * This test suite locks down the user-reported bug:
 *   "the robot arm simulation has the end effector literally passing
 *    right through the coffee cup like it's not even there".
 *
 * The previous implementation of projectPointOutOfOBB used the
 * Ericson §5.5.6 exterior-only ClosestPtPointOBB which returns the
 * query itself for interior points, then computed the push direction
 * as (point - surface) = (0, 0, 0), so the link was either untouched
 * or pushed further INTO the OBB. This suite pins the corrected
 * behavior:
 *   1. A link whose origin is INSIDE an OBB must be projected to the
 *      OBB surface (plus the requested clearance) along the SDF
 *      gradient pointing OUT of the OBB.
 *   2. The corrected link position must satisfy the clearance
 *      constraint: distanceToOBB(newPos, obb) >= clearanceMeters.
 *   3. The "kitchen-mug" OBB test case from the flagship must clear.
 *
 * SOTA References:
 *   - Ericson, "Real-Time Collision Detection" (Morgan Kaufmann 2005),
 *     §5.5.6 ClosestPtPointOBB, §5.5.7 ClosestPtPointSphere, §6.5
 *     Projection.
 *   - Redon, Lin, Benichou, "Continuous Collision Detection for Rigid
 *     and Articulated Bodies" (SIGGRAPH 2003 Courses).
 */

import { describe, expect, test } from "bun:test";
import {
  distanceToOBB,
  projectPointOutOfOBB,
  type OrientedBoundingBox,
} from "../app/lib/houseMultiObstacleKernel";

function obb(
  center: [number, number, number],
  halfExtents: [number, number, number],
  rotationYawRad: number,
  name = "test",
  id = "test",
): OrientedBoundingBox {
  return { id, name, center, halfExtents, rotationYawRad };
}

describe("projectPointOutOfOBB — interior-point regression (cmaes-u76s, cmaes-pvz)", () => {
  test("end-effector link inside a kitchen mug must be pushed OUT through the +Z face", () => {
    // Reproduces the user-reported bug: the wrist link origin is 1 cm
    // past the mug's center on the +Z axis, so the wrist is inside the
    // mug. The previous implementation projected the wrist to the
    // -Z side, which is still inside the mug. The corrected behavior
    // pushes the wrist OUT through the nearest face.
    const mug = obb(
      [0.4, 0.8275, 0.2],
      [0.0425, 0.045, 0.0425],
      0,
      "kitchen-mug",
      "mug-1"
    );
    const wristPos: [number, number, number] = [0.4, 0.8275, 0.21];
    const sdf = distanceToOBB(wristPos, mug);
    expect(sdf).toBeLessThan(0); // wrist IS inside the mug
    const clearance = 0.05;
    const res = projectPointOutOfOBB(wristPos, mug, clearance);
    expect(res.wasInside).toBe(true);
    // After projection, the wrist must clear the mug by >= clearance.
    const newDist = distanceToOBB(res.point, mug);
    expect(newDist).toBeGreaterThanOrEqual(clearance - 1e-6);
    // The new z must be > the original z (i.e. pushed out through the
    // nearest face, not into the back face). This is the specific
    // direction check that locks down the user-reported bug.
    expect(res.point[2]).toBeGreaterThan(wristPos[2]);
  });

  test("end-effector link inside a kitchen mug (X axis) must be pushed out through the +X face", () => {
    const mug = obb(
      [0.4, 0.8275, 0.2],
      [0.0425, 0.045, 0.0425],
      0,
      "kitchen-mug"
    );
    // Wrist origin 1 cm past the mug center on the +X axis.
    const wristPos: [number, number, number] = [0.41, 0.8275, 0.2];
    expect(distanceToOBB(wristPos, mug)).toBeLessThan(0);
    const res = projectPointOutOfOBB(wristPos, mug, 0.05);
    expect(res.point[0]).toBeGreaterThan(wristPos[0]);
    expect(distanceToOBB(res.point, mug)).toBeGreaterThanOrEqual(0.05 - 1e-6);
  });

  test("end-effector link inside a yawed OBB (chair rotated 30 deg) must be pushed out correctly", () => {
    // A chair seat rotated 30 deg about Y. The wrist origin is 2 cm
    // inside the seat on the local +X axis (which maps to world
    // (cos(-30), 0, sin(-30)) direction).
    const chairSeat = obb(
      [1.0, 0.45, 0.5],
      [0.2, 0.05, 0.2],
      Math.PI / 6,
      "chair-seat",
      "chair-1"
    );
    // Place the wrist at the seat center, then offset 5 cm in world +X.
    const wristPos: [number, number, number] = [1.05, 0.45, 0.5];
    expect(distanceToOBB(wristPos, chairSeat)).toBeLessThan(0);
    const res = projectPointOutOfOBB(wristPos, chairSeat, 0.05);
    expect(distanceToOBB(res.point, chairSeat)).toBeGreaterThanOrEqual(0.05 - 1e-6);
  });

  test("end-effector link fully embedded inside an OBB must be pushed to the nearest face", () => {
    // The wrist is at the OBB center, well inside the volume.
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], 0, "kitchen-oven");
    const wristPos: [number, number, number] = [0, 0, 0];
    expect(distanceToOBB(wristPos, box)).toBeLessThan(0);
    const res = projectPointOutOfOBB(wristPos, box, 0.05);
    // The new point must be on or outside the OBB boundary by the clearance.
    expect(distanceToOBB(res.point, box)).toBeGreaterThanOrEqual(0.05 - 1e-6);
    // The push distance from the center should be approximately the
    // distance from center to nearest face (0.5) plus the clearance (0.05).
    const pushDist = Math.hypot(res.point[0], res.point[1], res.point[2]);
    expect(pushDist).toBeGreaterThanOrEqual(0.5);
    expect(pushDist).toBeLessThanOrEqual(0.6);
  });

  test("the original (correct) exterior-case behavior is preserved", () => {
    // A link whose origin is already 10 cm outside the OBB must not
    // move (clearance is 5 cm, so 10 cm is plenty of margin).
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], 0, "kitchen-oven");
    const wristPos: [number, number, number] = [1.0, 0, 0];
    expect(distanceToOBB(wristPos, box)).toBeGreaterThan(0.05);
    const res = projectPointOutOfOBB(wristPos, box, 0.05);
    expect(res.wasInside).toBe(false);
    expect(res.point[0]).toBeCloseTo(1.0, 6);
  });
});
