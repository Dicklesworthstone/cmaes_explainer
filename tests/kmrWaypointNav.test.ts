import { describe, expect, test } from "bun:test";
import {
  createKmrPlanarSdf,
  pathIsCollisionFree,
  planWaypointPath,
} from "../app/lib/kmrWaypointNav";
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

    const sdf = createKmrPlanarSdf([wall3D]);
    let denseMinimum = Number.POSITIVE_INFINITY;
    for (let segment = 1; segment < plan.path.points.length; segment += 1) {
      const from = plan.path.points[segment - 1];
      const to = plan.path.points[segment];
      const samples = Math.max(1, Math.ceil(Math.hypot(to[0] - from[0], to[1] - from[1]) / 0.005));
      for (let index = 0; index <= samples; index += 1) {
        const t = index / samples;
        const x = from[0] + (to[0] - from[0]) * t;
        const y = from[1] + (to[1] - from[1]) * t;
        denseMinimum = Math.min(denseMinimum, sdf(x, y) - 0.32);
      }
    }
    expect(plan.path.minimumClearanceMeters).toBeCloseTo(denseMinimum, 2);
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

  test("rejects an out-of-bounds start instead of clamping it to a different grid cell", () => {
    expect(() =>
      planWaypointPath(
        { x: -5, y: 0, theta: 0 },
        { x: 1, y: 0 },
        [],
      ),
    ).toThrow(/start lies outside/);
  });

  test("rejects empty or non-finite externally supplied paths", () => {
    expect(
      pathIsCollisionFree(
        {
          points: [],
          totalDistanceMeters: 0,
          minimumClearanceMeters: 0,
          planner: "clearance-value-iteration",
        },
        [],
      ),
    ).toBe(false);
    expect(
      pathIsCollisionFree(
        {
          points: [[Number.NaN, 0]],
          totalDistanceMeters: 0,
          minimumClearanceMeters: 0,
          planner: "clearance-value-iteration",
        },
        [],
      ),
    ).toBe(false);
  });
});
