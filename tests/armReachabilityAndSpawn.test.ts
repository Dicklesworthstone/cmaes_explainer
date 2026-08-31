// Regression tests for the arm collision + reachability guard chain:
//   1. clampArmTargetPosition  — continuous OBB push-out so a drag
//      cannot put the target inside a piece of furniture, the table,
//      or a wall.
//   2. isTargetKukaReachable   — DLS-IK feasibility check so a drag
//      cannot put the target outside the arm's reachable workspace.
//   3. spawn-safe (findClearSpawnPosition) — the arm target cannot
//      spawn inside the table on the first trace load.
import { describe, expect, test } from "bun:test";
import {
  clampArmTargetPosition,
  isTargetKukaReachable,
} from "../app/lib/armInverseKinematics";
import {
  createSceneFromHouseFurniture,
  distanceToOBB,
  findClearSpawnPosition,
} from "../app/lib/houseMultiObstacleKernel";

const tableHeight = 0.78;
const safeRadius = 0.04;
const obstacles = createSceneFromHouseFurniture().obstacles;

describe("arm target clamp — the arm cannot be placed inside a surface", () => {
  test("a target above the table stays above the table and is non-colliding", () => {
    const { clampedTarget, isColliding } = clampArmTargetPosition(
      [0, tableHeight + 0.1, 0.3],
      obstacles,
      tableHeight,
      safeRadius,
    );
    expect(clampedTarget[1]).toBeGreaterThanOrEqual(tableHeight - safeRadius);
    expect(isColliding).toBe(false);
  });

  test("a target inside a piece of furniture is pushed to clearance", () => {
    if (obstacles.length === 0) return;
    const target = obstacles[0];
    const interior: [number, number, number] = [
      target.center[0],
      tableHeight,
      target.center[2],
    ];
    const { clampedTarget, isColliding } = clampArmTargetPosition(
      interior,
      obstacles,
      tableHeight,
      safeRadius,
    );
    expect(isColliding).toBe(false);
    const moved = Math.hypot(
      clampedTarget[0] - interior[0],
      clampedTarget[1] - interior[1],
      clampedTarget[2] - interior[2],
    );
    expect(moved).toBeGreaterThan(0);
  });
});

describe("isTargetKukaReachable — the arm cannot be placed outside its workspace", () => {
  test("a target a short distance above the workbench is reachable", () => {
    // The arm's base is at [0, 0.78, 0] and reach is ~0.75 m, so a
    // target a few decimetres above the table is comfortably reachable.
    const reachable = isTargetKukaReachable([0.3, tableHeight + 0.2, 0.2]);
    expect(reachable).toBe(true);
  });

  test("a target 10 m above the table is unreachable", () => {
    const reachable = isTargetKukaReachable([0, tableHeight + 10, 0]);
    expect(reachable).toBe(false);
  });

  test("a target 10 m below the floor is unreachable", () => {
    const reachable = isTargetKukaReachable([0, -10, 0]);
    expect(reachable).toBe(false);
  });

  test("a target at the table top is reachable (the arm's home pose)", () => {
    const reachable = isTargetKukaReachable([0, tableHeight, 0]);
    expect(reachable).toBe(true);
  });
});

describe("end-to-end — the arm target chain provably cannot tunnel", () => {
  test("after clamp, the result is geometrically outside the obstacle that triggered the clamp", () => {
    if (obstacles.length === 0) return;
    // Pick any OBB and place the target at its center. The clamp must
    // push the result out so the target is not still inside the OBB.
    const target = obstacles[0];
    const interior: [number, number, number] = [
      target.center[0],
      tableHeight,
      target.center[2],
    ];
    const { clampedTarget, isColliding } = clampArmTargetPosition(
      interior,
      obstacles,
      tableHeight,
      safeRadius,
    );
    // Geometric guarantee: the clamp does not leave the target inside
    // the obstacle. Reachability is a separate concern handled by the
    // dragger fallback (which holds the previous good target when the
    // clamp produces an unreachable result); see
    // HouseholdArmFlagship's ArmTargetDragger.
    expect(isColliding).toBe(false);
    const moved = Math.hypot(
      clampedTarget[0] - target.center[0],
      clampedTarget[1] - target.center[1],
      clampedTarget[2] - target.center[2],
    );
    expect(moved).toBeGreaterThan(0);
  });
});

describe("arm spawn-safe — the arm cannot spawn inside a surface", () => {
  test("findClearSpawnPosition returns a clear position for the arm scene", () => {
    if (obstacles.length === 0) return;
    const spawn = findClearSpawnPosition(obstacles, 0.1);
    expect(spawn[1]).toBeCloseTo(0.75, 2);
    for (const obb of obstacles) {
      if (obb.exemptFromPenalty) continue;
      expect(distanceToOBB(spawn, obb), obb.name).toBeGreaterThanOrEqual(0.1);
    }
  });
});

describe("clampArmTargetPosition — yawed OBB regression (cmaes-pvz followup)", () => {
  test("a target inside a yawed chair must be projected out, not left inside", () => {
    // The user reported "the arm CANNOT go through objects". The previous
    // radial-from-center projection in clampArmTargetPosition left targets
    // inside yawed furniture. This test pins the corrected behavior: the
    // kernel's projectPointOutOfOBB (SDF gradient) is used and the Y
    // coordinate is updated when the OBB pushes the target up.
    const yawedChair = {
      id: "yawed-chair",
      name: "yawed-chair",
      center: [1, 0.475, 1.6] as [number, number, number],
      halfExtents: [0.225, 0.475, 0.25] as [number, number, number],
      rotationYawRad: Math.PI, // 180-degree yaw
    };
    // Target 1 cm past the chair center on the +X axis (inside the chair).
    const target: [number, number, number] = [1.01, 0.85, 1.6];
    const distBefore = distanceToOBB(target, yawedChair);
    expect(distBefore).toBeLessThan(0); // confirm target is inside
    const { clampedTarget, isColliding, minClearance } = clampArmTargetPosition(
      target,
      [yawedChair],
      tableHeight,
      safeRadius,
    );
    expect(isColliding).toBe(false);
    // After projection, the target must clear the chair by the margin.
    expect(distanceToOBB(clampedTarget, yawedChair)).toBeGreaterThanOrEqual(
      safeRadius - 1e-6,
    );
    // The Y coordinate must have been updated (the chair is tall enough
    // to push the target above the original Y).
    expect(clampedTarget[1]).toBeGreaterThan(target[1]);
    expect(clampedTarget[1]).toBeGreaterThanOrEqual(tableHeight + safeRadius);
    expect(minClearance).toBeGreaterThanOrEqual(0);
  });
});
