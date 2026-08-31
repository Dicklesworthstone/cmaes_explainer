import { describe, expect, test } from "bun:test";
import {
  findClearSpawnPosition,
  createHouseNavigationScene,
  createHouseWallObstacles,
  createSceneFromHouseFurniture,
  distanceToOBB,
  evaluateHouseholdObjectiveWithFurniture,
  type OrientedBoundingBox,
  queryMultiObstacleScene,
  simulateG1HouseNavigationChallenge,
} from "../app/lib/houseMultiObstacleKernel";

describe("Multi-Obstacle Household Scene & Furniture Collision Kernel", () => {
  test("distanceToOBB computes exact Euclidean signed distance for unrotated and rotated OBBs", () => {
    const obb: OrientedBoundingBox = {
      id: "table-1",
      name: "Dining Table",
      center: [0, 0, 0],
      halfExtents: [1.0, 0.5, 0.5],
      rotationYawRad: 0.0,
    };

    // Outside along X-axis
    const distOutsideX = distanceToOBB([2.0, 0.0, 0.0], obb);
    expect(distOutsideX).toBeCloseTo(1.0, 5); // 2.0 - 1.0 = 1.0m

    // Inside OBB center
    const distInside = distanceToOBB([0.0, 0.0, 0.0], obb);
    expect(distInside).toBeLessThan(0.0); // Inside is negative
    expect(distInside).toBeCloseTo(-0.5, 5);

    // Rotated 90 degrees around Y
    const rotatedObb: OrientedBoundingBox = {
      id: "table-rotated",
      name: "Rotated Table",
      center: [0, 0, 0],
      halfExtents: [1.0, 0.5, 0.5],
      rotationYawRad: Math.PI / 2.0,
    };

    // Point along Z should now match the long half-extent (1.0)
    const distRotatedZ = distanceToOBB([0.0, 0.0, 2.0], rotatedObb);
    expect(distRotatedZ).toBeCloseTo(1.0, 5);
  });

  test("createSceneFromHouseFurniture converts 70+ pieces into complete OBB scene roster", () => {
    const scene = createSceneFromHouseFurniture();

    expect(scene.sceneId).toBe("craftsman-bungalow-full-catalog");
    expect(scene.obstacles.length).toBeGreaterThanOrEqual(60);

    for (const obb of scene.obstacles) {
      expect(obb.id.length).toBeGreaterThan(0);
      expect(obb.name.length).toBeGreaterThan(0);
      expect(obb.halfExtents[0]).toBeGreaterThan(0.0);
      expect(obb.halfExtents[1]).toBeGreaterThan(0.0);
      expect(obb.halfExtents[2]).toBeGreaterThan(0.0);
      expect(Number.isFinite(obb.center[0])).toBe(true);
      expect(Number.isFinite(obb.center[1])).toBe(true);
      expect(Number.isFinite(obb.center[2])).toBe(true);
    }
  });

  test("house navigation scene turns walls into physical segments while preserving doorways", () => {
    const walls = createHouseWallObstacles();
    const scene = createHouseNavigationScene();
    expect(walls.length).toBeGreaterThan(8);
    expect(scene.obstacles.length).toBeGreaterThan(
      createSceneFromHouseFurniture().obstacles.length,
    );

    const doorwayClearance = Math.min(
      ...walls.map((wall) => distanceToOBB([0, 1, 5.5], wall)),
    );
    const solidWallDistance = Math.min(
      ...walls.map((wall) => distanceToOBB([3, 1, 5.5], wall)),
    );
    expect(doorwayClearance).toBeGreaterThan(1.0);
    expect(solidWallDistance).toBeLessThanOrEqual(0.0);
  });

  test("diagonal authored walls retain their centerline orientation", () => {
    const [diagonal] = createHouseWallObstacles([
      {
        from: [0, 0],
        to: [2, 2],
        height: 2.4,
        thickness: 0.1,
        doorways: [],
      },
    ]);

    expect(diagonal.rotationYawRad).toBeCloseTo(Math.PI / 4, 12);
    expect(distanceToOBB([0.5, 1, 0.5], diagonal)).toBeLessThanOrEqual(0);
    expect(distanceToOBB([0.5, 1, -0.5], diagonal)).toBeGreaterThan(0.5);
  });

  test("queryMultiObstacleScene computes clearance and quadratic collision penalty", () => {
    const scene = createSceneFromHouseFurniture();

    // Query in open area of central hall [0.2, 0.5, 0.2]
    const openRes = queryMultiObstacleScene(
      { position: [0.2, 0.5, 0.2], robotRadius: 0.15, safetyMargin: 0.05 },
      scene,
    );

    expect(openRes.minimumClearanceMeters).toBeGreaterThan(0.0);
    expect(openRes.penetrationOccurred).toBe(false);
    expect(openRes.nearestObstacleId).not.toBeNull();

    // Query directly inside the fireplace center
    const fireplace = scene.obstacles.find((o) => o.name.includes("fireplace"));
    expect(fireplace).toBeDefined();

    if (fireplace) {
      const collRes = queryMultiObstacleScene(
        { position: fireplace.center, robotRadius: 0.25, safetyMargin: 0.05 },
        scene,
      );

      expect(collRes.minimumClearanceMeters).toBeLessThan(0.0);
      expect(collRes.penetrationOccurred).toBe(true);
      expect(collRes.collisionPenalty).toBeGreaterThan(10.0); // Substantial quadratic penalty
    }
  });

  test("evaluateHouseholdObjectiveWithFurniture penalizes trajectories that clip furniture vs safe paths", () => {
    const scene = createSceneFromHouseFurniture();
    const goal: [number, number, number] = [-2.2, 0.5, 2.8];

    // Safe path staying in open area of living room
    const safePositions: [number, number, number][] = [
      [-2.2, 0.5, 2.2],
      [-2.2, 0.5, 2.4],
      [-2.2, 0.5, 2.6],
      [-2.2, 0.5, 2.8],
    ];
    const safeVelocities: [number, number, number][] = [
      [0, 0, 0.6],
      [0, 0, 0.6],
      [0, 0, 0.6],
      [0, 0, 0.0],
    ];

    const safeResult = evaluateHouseholdObjectiveWithFurniture(
      safePositions,
      safeVelocities,
      goal,
      scene,
      [],
      {},
      0.15,
    );

    expect(safeResult.hardCollisionOccurred).toBe(false);
    expect(safeResult.furnitureCollisionPenalty).toBe(0.0);

    // Unsafe path that marches straight through the fireplace at [-3.3, 0.5, 2.6]
    const unsafePositions: [number, number, number][] = [
      [-3.3, 0.5, 1.0],
      [-3.3, 0.5, 1.8],
      [-3.3, 0.5, 2.6], // Fireplace center!
      [-3.3, 0.5, 3.4],
    ];
    const unsafeVelocities: [number, number, number][] = [
      [0, 0, 0.6],
      [0, 0, 0.6],
      [0, 0, 0.6],
      [0, 0, 0.0],
    ];

    const unsafeResult = evaluateHouseholdObjectiveWithFurniture(
      unsafePositions,
      unsafeVelocities,
      goal,
      scene,
      [],
      {},
      0.15,
    );

    expect(unsafeResult.hardCollisionOccurred).toBe(true);
    expect(unsafeResult.furnitureCollisionPenalty).toBeGreaterThan(0.0);
    expect(safeResult.totalObjective).toBeGreaterThan(unsafeResult.totalObjective);
  });

  test("simulateG1HouseNavigationChallenge traverses the 7-waypoint chain successfully", () => {
    const scene = createSceneFromHouseFurniture();
    const result = simulateG1HouseNavigationChallenge(scene);

    expect(result.challengeName).toContain("G1 Humanoid HouseNavigation");
    expect(result.completedWaypoints).toBe(7);
    expect(result.totalWaypoints).toBe(7);
    expect(result.hardCollisionOccurred).toBe(false);
    expect(result.success).toBe(true);
    expect(result.totalDistanceMeters).toBeGreaterThan(8.0);
    expect(result.totalTimeSeconds).toBeLessThan(90.0);
    expect(result.finalObjectiveScore).toBeGreaterThan(300.0);
    expect(result.trajectory.length).toBeGreaterThan(100);
  });
});

describe("findClearSpawnPosition — the robot never spawns inside a wall (cmaes-s0ey regression)", () => {
  test("returns a position inside the house bounds (x, z in the configured box)", () => {
    const scene = createSceneFromHouseFurniture();
    const [x, , z] = findClearSpawnPosition(scene.obstacles);
    expect(x).toBeGreaterThanOrEqual(scene.bounds.min[0] + 0.35);
    expect(x).toBeLessThanOrEqual(scene.bounds.max[0] - 0.35);
    expect(z).toBeGreaterThanOrEqual(scene.bounds.min[1] + 0.35);
    expect(z).toBeLessThanOrEqual(scene.bounds.max[1] - 0.35);
  });

  test("the returned position has positive clearance against every OBB obstacle", () => {
    // If a returned spawn is inside a wall, the robot cannot move. We
    // require a 0.32 m clearance to match the ragdoll-dragger safe radius.
    const scene = createSceneFromHouseFurniture();
    const spawn = findClearSpawnPosition(scene.obstacles);
    for (const obb of scene.obstacles) {
      const dist = distanceToOBB(spawn, obb);
      expect(
        dist,
        `spawn at (${spawn.map((n) => n.toFixed(3)).join(", ")}) is inside OBB ${obb.name} (distance=${dist.toFixed(4)})`,
      ).toBeGreaterThanOrEqual(0.32);
    }
  });

  test("finds a spawn that also clears the authored wall roster", () => {
    const scene = createHouseNavigationScene();
    const spawn = findClearSpawnPosition(scene.obstacles, 0.35);
    for (const obstacle of scene.obstacles) {
      if (obstacle.exemptFromPenalty) continue;
      expect(distanceToOBB(spawn, obstacle), obstacle.name).toBeGreaterThanOrEqual(0.35);
    }
  });

  test("refuses a fully blocked spawn region instead of returning an unsafe fallback", () => {
    const blocker: OrientedBoundingBox = {
      id: "blocker",
      name: "blocker",
      center: [0.1, 0.75, 0.1],
      halfExtents: [1, 1, 1],
      rotationYawRad: 0,
    };
    expect(() =>
      findClearSpawnPosition([blocker], 0.05, {
        minX: 0,
        maxX: 0.2,
        minZ: 0,
        maxZ: 0.2,
      }),
    ).toThrow(/no collision-free robot spawn/);
  });
});
