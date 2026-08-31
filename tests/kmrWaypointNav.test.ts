import { describe, expect, test } from "bun:test";
import { pathIsCollisionFree, planWaypointPath } from "../app/lib/kmrWaypointNav";
import type { OrientedBoundingBox } from "../app/lib/houseMultiObstacleKernel";

const CLEARANCE_RADIUS = 0.18;

const wall3D: OrientedBoundingBox = {
  id: "front-wall",
  name: "front-wall",
  center: [1, 0, 0],
  halfExtents: [0.1, 4, 2],
  rotationYawRad: 0,
};

describe("KMR waypoint navigation (cmaes-kmr-waypoint)", () => {
  test("empty scene: the path is a straight line from start to target", () => {
    const start = { x: -1, y: 0, theta: 0 };
    const target = { x: 2, y: 0 };
    const plan = planWaypointPath(start, target, []);
    expect(plan.path.points.length).toBeGreaterThanOrEqual(2);
    expect(plan.path.points[0]).toEqual([-1, 0]);
    expect(plan.path.totalDistanceMeters).toBeCloseTo(3.0, 1);
  });

  test("empty scene: the path is collision-free", () => {
    const plan = planWaypointPath(
      { x: 0, y: 0, theta: 0 },
      { x: 2, y: 2 },
      [],
    );
    expect(pathIsCollisionFree(plan.path, [], CLEARANCE_RADIUS)).toBe(true);
  });

  test("a single wall in the path: value-policy extraction routes around it", () => {
    const plan = planWaypointPath(
      { x: 0, y: 0, theta: 0 },
      { x: 2, y: 0 },
      [wall3D],
    );
    expect(pathIsCollisionFree(plan.path, [wall3D], CLEARANCE_RADIUS)).toBe(true);
    expect(plan.path.points.some(([, y]) => Math.abs(y) > 2.0)).toBe(true);
    expect(plan.path.totalDistanceMeters).toBeGreaterThan(2.0);
    expect(plan.path.minimumClearanceMeters).toBeGreaterThanOrEqual(0.0);
    expect(plan.path.planner).toBe("clearance-value-iteration");
  });

  test("pathIsCollisionFree: a path that misses the wall is free", () => {
    const offWall: OrientedBoundingBox = {
      id: "off-wall",
      name: "off-wall",
      center: [0, 1, 3],
      halfExtents: [4, 1, 0.1],
      rotationYawRad: 0,
    };
    const plan = planWaypointPath(
      { x: 0, y: 0, theta: 0 },
      { x: 1, y: 0 },
      [],
    );
    expect(pathIsCollisionFree(plan.path, [offWall], CLEARANCE_RADIUS)).toBe(
      true,
    );
  });

  test("rejects goals that overlap an obstacle instead of animating through it", () => {
    expect(() =>
      planWaypointPath(
        { x: 0, y: 0, theta: 0 },
        { x: 1, y: 0 },
        [wall3D],
      ),
    ).toThrow(/goal does not clear/);
  });
});
