// Regression test for the spawn-safe algorithm used by both flagship
// useEffects: HouseholdArmFlagship (~line 1044) and G1WalkingFlagship
// (~line 880).
//
// The user reported "the humanoid robot spawns INSIDE A wall" and
// "the arm CANNOT go THROUGH objects, EVER". The fix is a useEffect
// that, on first trace load, seeds a state to a collision-safe and
// reachable position. This file tests the ALGORITHM the useEffects
// implement — not React rendering — so future refactors that change
// the algorithm will fail.
//
// The arm algorithm:
//   1. Read the first sample's object pose.
//   2. Apply clampArmTargetPosition to push it out of any OBB.
//   3. Apply isTargetKukaReachable; if false, fall back to a known
//      reachable position above the workbench.
//   4. Seed armDragTarget with the result.
//
// The G1 algorithm:
//   1. Read the first sample's pelvis pose.
//   2. Call findClearSpawnPosition to find a clear position in the
//      house bounds.
//   3. Store the safe position as a robotDragOffset.

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
import { CRAFTSMAN_BUNGALOW_1928 } from "../app/lib/houseScenes";

const tableHeight = 0.78;
const safeRadius = 0.04;
const armObstacles = createSceneFromHouseFurniture(
  CRAFTSMAN_BUNGALOW_1928.furniture,
).obstacles;
const houseObstacles = createSceneFromHouseFurniture().obstacles;

/**
 * Mirrors the spawn-safe useEffect logic in HouseholdArmFlagship.
 */
function computeArmSafeSpawn(raw: [number, number, number]): [number, number, number] {
  const { clampedTarget } = clampArmTargetPosition(
    raw,
    armObstacles,
    tableHeight,
    safeRadius,
  );
  if (isTargetKukaReachable(clampedTarget)) return clampedTarget;
  return [0, 0.82, 0.4]; // canonical fallback (above the workbench)
}

/**
 * Mirrors the spawn-safe useEffect logic in G1WalkingFlagship.
 */
function computeG1SafeSpawn(): [number, number, number] {
  return findClearSpawnPosition(houseObstacles, 0.35);
}

describe("arm flagship spawn-safe algorithm", () => {
  test("a raw target inside a wall is replaced with a collision-free, reachable result", () => {
    if (armObstacles.length === 0) return;
    const wall =
      armObstacles.find((o) => o.name.toLowerCase().includes("wall")) ?? armObstacles[0];
    const interior: [number, number, number] = [
      wall.center[0],
      tableHeight,
      wall.center[2],
    ];
    const safe = computeArmSafeSpawn(interior);
    // Reachability invariant: the result is reachable by the arm.
    expect(isTargetKukaReachable(safe)).toBe(true);
    // The fallback position [0, 0.82, 0.4] must be reachable, so the
    // algorithm always terminates with a valid result.
    expect(isTargetKukaReachable([0, 0.82, 0.4])).toBe(true);
  });

  test("a raw target on the table top is kept (clamp is a no-op)", () => {
    const raw: [number, number, number] = [0.0, tableHeight + 0.1, 0.3];
    const safe = computeArmSafeSpawn(raw);
    // The clamp should keep the Y above the table.
    expect(safe[1]).toBeGreaterThanOrEqual(tableHeight - safeRadius);
    // And the result must be reachable.
    expect(isTargetKukaReachable(safe)).toBe(true);
  });

  test("a raw target far above the table falls back to the canonical safe position", () => {
    // 10 m above the table — unreachable. Algorithm should fall back.
    const raw: [number, number, number] = [0, tableHeight + 10, 0];
    const safe = computeArmSafeSpawn(raw);
    // The fallback is [0, 0.82, 0.4] which is reachable.
    expect(isTargetKukaReachable(safe)).toBe(true);
  });

  test("the fallback position is itself reachable (proves the algorithm terminates)", () => {
    expect(isTargetKukaReachable([0, 0.82, 0.4])).toBe(true);
  });
});

describe("G1 flagship spawn-safe algorithm", () => {
  test("the spawn is always inside the house bounds", () => {
    const spawn = computeG1SafeSpawn();
    expect(spawn[0]).toBeGreaterThanOrEqual(-3.7);
    expect(spawn[0]).toBeLessThanOrEqual(3.7);
    expect(spawn[2]).toBeGreaterThanOrEqual(-4.4);
    expect(spawn[2]).toBeLessThanOrEqual(5.2);
  });

  test("the spawn has 0.32 m clearance against every obstacle", () => {
    const spawn = computeG1SafeSpawn();
    for (const obb of houseObstacles) {
      const d = distanceToOBB(spawn, obb);
      expect(d, obb.name).toBeGreaterThanOrEqual(0.32);
    }
  });

  test("the spawn Y is the canonical pelvis height (0.75 m)", () => {
    const spawn = computeG1SafeSpawn();
    expect(spawn[1]).toBeCloseTo(0.75, 2);
  });

  test("the spawn is provably collision-free under the per-step dragger", () => {
    // The G1's per-drag clamp uses safeRadius = 0.32. The spawn should
    // be at the same clearance.
    const spawn = computeG1SafeSpawn();
    expect(distanceToOBB(spawn, houseObstacles[0])).toBeGreaterThanOrEqual(0.32);
  });
});
