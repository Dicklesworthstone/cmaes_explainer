import { describe, expect, test } from "bun:test";
import { KmrNavigationOwner } from "../app/lib/kmrNavigationOwner";
import { planWaypointPath, type WaypointPath } from "../app/lib/kmrWaypointNav";
import {
  createHouseNavigationScene,
  type OrientedBoundingBox,
} from "../app/lib/houseMultiObstacleKernel";

const wall: OrientedBoundingBox = {
  id: "wall",
  name: "wall",
  center: [1, 1, 0],
  halfExtents: [0.1, 1, 1],
  rotationYawRad: 0,
};

describe("KMR deterministic mecanum navigation owner", () => {
  test("executes the obstacle-detouring value path without collision refusal", () => {
    const initial = { x: 0, y: 0, theta: 0 };
    const plan = planWaypointPath(initial, { x: 2, y: 0 }, [wall]);
    const owner = new KmrNavigationOwner(initial, plan.path, [wall]);

    let receipt = owner.receipt();
    for (let step = 0; step < 3000 && !receipt.completed; step++) {
      receipt = owner.step();
    }

    expect(receipt.completed).toBe(true);
    expect(receipt.owner).toBe("ts-kinematic-mecanum-owner");
    expect(receipt.distanceTraveledMeters).toBeGreaterThan(2.0);
    expect(receipt.minimumClearanceMeters).toBeGreaterThanOrEqual(0.0);
    expect(receipt.collisionRefusals).toBe(0);
    expect(Math.hypot(receipt.pose.x - 2.0, receipt.pose.y)).toBeLessThanOrEqual(
      0.08,
    );
  });

  test("wheel speeds are a real inverse/forward kinematic command, not display motion", () => {
    const initial = { x: 0, y: 0, theta: 0 };
    const plan = planWaypointPath(initial, { x: 1, y: 1 }, []);
    const owner = new KmrNavigationOwner(initial, plan.path, []);
    const receipt = owner.step();
    expect(receipt.wheelSpeeds.speeds.some((speed) => Math.abs(speed) > 0)).toBe(true);
    expect(Math.hypot(receipt.bodyCommand.vX, receipt.bodyCommand.vY)).toBeGreaterThan(0);
    expect(receipt.distanceTraveledMeters).toBeGreaterThan(0);
  });

  test("refuses an unsafe externally supplied path before execution", () => {
    const unsafe: WaypointPath = {
      points: [[0, 0], [2, 0]],
      totalDistanceMeters: 2,
      minimumClearanceMeters: -1,
      planner: "clearance-value-iteration",
    };
    expect(() =>
      new KmrNavigationOwner({ x: 0, y: 0, theta: 0 }, unsafe, [wall]),
    ).toThrow(/refuses a path/);
  });

  test("refuses a path whose declared start does not match the owner's pose", () => {
    const detached: WaypointPath = {
      points: [[1, 1], [2, 1]],
      totalDistanceMeters: 1,
      minimumClearanceMeters: 1,
      planner: "clearance-value-iteration",
    };
    expect(() =>
      new KmrNavigationOwner({ x: 0, y: 0, theta: 0 }, detached, []),
    ).toThrow(/does not match/);
  });

  test("rejects non-finite poses and non-positive integration settings", () => {
    const path: WaypointPath = {
      points: [[0, 0], [1, 0]],
      totalDistanceMeters: 1,
      minimumClearanceMeters: 1,
      planner: "clearance-value-iteration",
    };
    expect(() =>
      new KmrNavigationOwner({ x: Number.NaN, y: 0, theta: 0 }, path, []),
    ).toThrow(/finite initial pose/);
    expect(() =>
      new KmrNavigationOwner({ x: 0, y: 0, theta: 0 }, path, [], {
        dtSeconds: 0,
      }),
    ).toThrow(/finite positive/);
  });

  test("runs a real route through the authored Craftsman furniture and wall roster", () => {
    const scene = createHouseNavigationScene();
    const initial = { x: -1.4, y: 2.6, theta: 0 };
    const target = { x: -2, y: 0 };
    const plan = planWaypointPath(
      initial,
      target,
      scene.obstacles,
      undefined,
      scene.bounds,
    );
    const owner = new KmrNavigationOwner(initial, plan.path, scene.obstacles);
    let receipt = owner.receipt();
    for (let step = 0; step < 10000 && !receipt.completed; step++) {
      receipt = owner.step();
    }

    expect(scene.obstacles.length).toBeGreaterThan(70);
    expect(plan.path.points.length).toBeGreaterThan(2);
    expect(receipt.completed).toBe(true);
    expect(receipt.collisionRefusals).toBe(0);
    expect(receipt.minimumClearanceMeters).toBeGreaterThan(0);
    expect(receipt.distanceTraveledMeters).toBeGreaterThan(2.5);
  });
});
