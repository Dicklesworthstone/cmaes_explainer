import { describe, expect, test } from "bun:test";
import {
  armWorkbenchObstacles,
  findClearSpawnPosition,
  findClearTrajectorySpawnOffset,
  HOUSE_STRUCTURAL_SURFACES,
  g1KernelObstacleRoster,
  householdKernelObstacleRoster,
  resolveCameraBoom,
  stageObbToKernelObstacle,
  type HouseholdKernelObstacle,
  createHouseNavigationScene,
  createHouseWallObstacles,
  createSceneFromHouseFurniture,
  conservativeSegmentClearanceToOBB,
  distanceToOBB,
  evaluateHouseholdObjectiveWithFurniture,
  type OrientedBoundingBox,
  queryMultiObstacleScene,
  simulateG1HouseNavigationChallenge,
} from "../app/lib/houseMultiObstacleKernel";
import {
  CRAFTSMAN_FLOOR_SUPPORT,
  CRAFTSMAN_FLOOR_Y,
  CRAFTSMAN_FOUNDATION_DEPTH_BELOW_FLOOR,
  CRAFTSMAN_FOUNDATION_SLAB,
} from "../app/lib/houseScenes";
import {
  DEFAULT_G1_WALKING_CONFIG,
  DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
  buildG1Config,
  buildHouseholdManipulationConfig,
} from "../app/lib/frankensimCmaes";

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

  test("conservatively detects a link segment crossing an OBB with clear endpoints", () => {
    const obb: OrientedBoundingBox = {
      id: "thin-wall",
      name: "Thin wall",
      center: [0, 0, 0],
      halfExtents: [0.05, 0.5, 0.5],
      rotationYawRad: Math.PI / 6,
    };
    expect(distanceToOBB([-1, 0, 0], obb)).toBeGreaterThan(0);
    expect(distanceToOBB([1, 0, 0], obb)).toBeGreaterThan(0);
    expect(conservativeSegmentClearanceToOBB([-1, 0, 0], [1, 0, 0], obb)).toBeLessThan(0);
  });

  test("segment clearance preserves a certified grazing margin", () => {
    const obb: OrientedBoundingBox = {
      id: "box",
      name: "Box",
      center: [0, 0, 0],
      halfExtents: [0.5, 0.5, 0.5],
      rotationYawRad: 0,
    };
    const clearance = conservativeSegmentClearanceToOBB([-1, 0.7, 0], [1, 0.7, 0], obb, 0.01);
    expect(clearance).toBeGreaterThan(0.19);
    expect(clearance).toBeLessThanOrEqual(0.2);
  });

  test("segment clearance rejects malformed inputs", () => {
    const obb: OrientedBoundingBox = {
      id: "box",
      name: "Box",
      center: [0, 0, 0],
      halfExtents: [0.5, 0.5, 0.5],
      rotationYawRad: 0,
    };
    expect(() => conservativeSegmentClearanceToOBB([0, 0, 0], [1, 0, 0], obb, 0)).toThrow("positive spacing");
    expect(() => conservativeSegmentClearanceToOBB([Number.NaN, 0, 0], [1, 0, 0], obb)).toThrow("must be finite");
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

describe("findClearTrajectorySpawnOffset / resolveCameraBoom (spawn-inside-sofa and camera-in-wall regressions)", () => {
  const scene = createHouseNavigationScene();

  test("findClearSpawnPosition returns the verified grid sample, never a Y-lifted push-out", () => {
    const spawn = findClearSpawnPosition(scene.obstacles, 0.85);
    expect(spawn[1]).toBe(0.75);
    for (const obb of scene.obstacles) {
      if (obb.exemptFromPenalty) continue;
      expect(distanceToOBB(spawn, obb), obb.name).toBeGreaterThanOrEqual(0.85);
    }
  });

  test("trajectory seat keeps a two-metre walking footprint clear of walls and furniture", () => {
    // A synthetic 30-point footprint: a pelvis-height line two metres long
    // in +X plus a low foot line, exactly the shape of a walking trace.
    const footprint: [number, number, number][] = [];
    for (let i = 0; i <= 20; i++) {
      footprint.push([i * 0.1, 0.77, 0]);
      footprint.push([i * 0.1, 0.05, 0.1]);
      footprint.push([i * 0.1, 0.05, -0.1]);
    }
    const seat = findClearTrajectorySpawnOffset(scene.obstacles, {
      footprint,
      clearance: 0.18,
      anchor: [-1.4, 2.6],
      step: 0.25,
    });
    expect(seat.offset[1]).toBe(0);
    expect(seat.minClearance).toBeGreaterThanOrEqual(0.18);
    for (const point of footprint) {
      const world: [number, number, number] = [point[0] + seat.offset[0], point[1], point[2] + seat.offset[2]];
      for (const obb of scene.obstacles) {
        if (obb.exemptFromPenalty) continue;
        expect(distanceToOBB(world, obb), obb.name).toBeGreaterThanOrEqual(0.18);
      }
    }
    // Nearest-to-anchor ordering: nothing closer to the anchor is feasible.
    const d = Math.hypot(seat.pelvis[0] + 1.4, seat.pelvis[1] - 2.6);
    expect(d).toBeLessThan(1.5);
  });

  test("trajectory seat refuses when no offset can fit the footprint", () => {
    const hugeFootprint: [number, number, number][] = [];
    for (let x = -6; x <= 6; x += 0.5) hugeFootprint.push([x, 0.77, 0]);
    expect(() =>
      findClearTrajectorySpawnOffset(scene.obstacles, {
        footprint: hugeFootprint,
        clearance: 0.18,
        anchor: [0, 0],
      }),
    ).toThrow();
  });

  test("camera boom stops short of a wall between the subject and the desired position", () => {
    // Subject in hall; desired camera beyond the bedroom divider wall at z = -1.3.
    const lookAt: [number, number, number] = [-2.0, 0.85, 0.0];
    const desired: [number, number, number] = [-2.0, 1.6, -2.5];
    const boom = resolveCameraBoom(lookAt, desired, scene.obstacles, 0.12);
    expect(boom.fraction).toBeLessThan(1);
    expect(boom.blockedBy).toMatch(/wall/);
    expect(boom.position[2]).toBeGreaterThan(-1.3);
    for (const obb of scene.obstacles) {
      if (obb.exemptFromPenalty) continue;
      expect(distanceToOBB(boom.position, obb), obb.name).toBeGreaterThanOrEqual(0.05);
    }
  });

  test("camera boom is untouched when the line of sight is clear", () => {
    const lookAt: [number, number, number] = [-1.5, 0.85, 2.6];
    const desired: [number, number, number] = [-1.5, 1.8, 2.9];
    const boom = resolveCameraBoom(lookAt, desired, scene.obstacles, 0.12);
    expect(boom.fraction).toBe(1);
    expect(boom.blockedBy).toBeNull();
    expect(boom.position).toEqual(desired);
  });
});

describe("household kernel obstacle roster and schema-3 config packet", () => {
  test("stage OBB to owner box: a point inside the stage box is inside the owner box", () => {
    const obb: OrientedBoundingBox = {
      id: "t",
      name: "yawed table",
      center: [0.6, 0.4, -0.3],
      halfExtents: [0.5, 0.4, 0.2],
      rotationYawRad: 0.7,
    };
    const owner = stageObbToKernelObstacle(obb);
    expect(owner.centerMeters).toEqual([0.6, 0.3, 0.4]);
    expect(owner.halfExtentsMeters).toEqual([0.5, 0.2, 0.4]);
    expect(owner.yawRad).toBeCloseTo(-0.7, 12);
    // Sample stage points on the box's local axes and check them against the
    // owner box using an owner-frame SDF (rotation about +Z by yaw).
    const insideOwner = (p: [number, number, number]) => {
      const c = Math.cos(-owner.yawRad);
      const s = Math.sin(-owner.yawRad);
      const dx = p[0] - owner.centerMeters[0];
      const dy = p[1] - owner.centerMeters[1];
      const lx = c * dx - s * dy;
      const ly = s * dx + c * dy;
      const lz = p[2] - owner.centerMeters[2];
      return (
        Math.abs(lx) <= owner.halfExtentsMeters[0] + 1e-9 &&
        Math.abs(ly) <= owner.halfExtentsMeters[1] + 1e-9 &&
        Math.abs(lz) <= owner.halfExtentsMeters[2] + 1e-9
      );
    };
    for (const [u, v] of [
      [0.45, 0],
      [-0.45, 0],
      [0, 0.18],
      [0, -0.18],
      [0.3, 0.1],
    ] as const) {
      // Stage local axes: x rotated by yaw about +Y; z likewise.
      const cy = Math.cos(obb.rotationYawRad);
      const sy = Math.sin(obb.rotationYawRad);
      const stage: [number, number, number] = [
        obb.center[0] + cy * u - sy * v,
        obb.center[1],
        obb.center[2] + sy * u + cy * v,
      ];
      expect(distanceToOBB(stage, obb)).toBeLessThanOrEqual(1e-9);
      const ownerPoint: [number, number, number] = [stage[0], -stage[2], stage[1]];
      expect(insideOwner(ownerPoint), JSON.stringify(stage)).toBe(true);
    }
  });

  test("the roster carries the task's own workbench structures, anchored to the owner support height", () => {
    // The stage draws a backsplash only for the mug, a side cabinet only for
    // the remote, and fence posts only for the trowel. An earlier version
    // declared the backsplash and cabinet for every task at a hardcoded
    // 0.78 m support height; no task has that height (they are 0.237, 0.277
    // and 0.265 m), so the boxes sat half a metre above the geometry the
    // viewer sees.
    // The counter leads every roster as the one SUPPORT body: the surface the
    // arm works on rather than around. Everything after it is keep-out.
    const mug = householdKernelObstacleRoster(0.2369, "kitchen-mug", 10);
    expect(mug.length).toBe(10);
    expect(mug[0].name).toBe("counter slab");
    expect(mug[0].role).toBe("support");
    expect(mug.slice(1).every((o) => o.role === "keep-out")).toBe(true);
    expect(mug[1].name).toBe("backsplash");
    expect(mug.some((o) => o.name === "side cabinet")).toBe(false);

    const remote = householdKernelObstacleRoster(0.2769, "living-room-remote", 10);
    expect(remote[0].name).toBe("counter slab");
    expect(remote[1].name).toBe("side cabinet");
    expect(remote.some((o) => o.name === "backsplash")).toBe(false);

    const trowel = householdKernelObstacleRoster(0.2649, "backyard-trowel", 10);
    expect(trowel[0].name).toBe("counter slab");
    expect(trowel.filter((o) => o.name === "fence post")).toHaveLength(4);

    // Workbench boxes track the support height exactly as ArmEnvironment
    // draws them: the backsplash centre sits 0.5 m above the surface.
    for (const support of [0.2369, 0.5, 0.9]) {
      const [backsplash] = armWorkbenchObstacles(support, "kitchen-mug");
      expect(backsplash.center[1]).toBeCloseTo(support + 0.5, 12);
    }
  });

  test("roster furniture is ordered by distance from the arm base at the stage origin", () => {
    const roster = householdKernelObstacleRoster(0.2369, "kitchen-mug", 12);
    const furniture = roster.slice(2); // after the counter surface and workbench box
    const d = (o: HouseholdKernelObstacle) =>
      Math.hypot(o.centerMeters[0], o.centerMeters[1], o.centerMeters[2]);
    for (let i = 1; i < furniture.length; i++) {
      // Centre distance is a looser proxy than the OBB distance the roster
      // sorts on, so allow modest inversions.
      expect(d(furniture[i])).toBeGreaterThanOrEqual(d(furniture[i - 1]) - 1.0);
    }
  });

  test("schema-4 config packet is self-describing: 12 fixed words plus 8 per obstacle", () => {
    const roster = householdKernelObstacleRoster(0.2369, "kitchen-mug", 5);
    const packet = buildHouseholdManipulationConfig({
      ...DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
      objectMassKilograms: 0.5,
      staticFrictionMu: 0.9,
      kineticFrictionMu: 0.7,
      obstacles: roster,
    });
    expect(packet.length).toBe(12 + 8 * roster.length);
    expect(packet[1]).toBe(4);
    expect(packet[3]).toBe(packet.length);
    expect(packet[8]).toBe(0.5);
    expect(packet[9]).toBe(0.9);
    expect(packet[10]).toBe(0.7);
    expect(packet[11]).toBe(roster.length);
    expect(Array.from(packet.slice(12, 20))).toEqual([
      ...roster[0].centerMeters,
      ...roster[0].halfExtentsMeters,
      roster[0].yawRad,
      // Schema 4's role word: 0 keep-out, 1 support.
      roster[0].role === "support" ? 1 : 0,
    ]);
  });

  test("schema-4 config packet refuses the envelope the owner refuses", () => {
    const base = DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG;
    expect(() => buildHouseholdManipulationConfig({ ...base, objectMassKilograms: -1 })).toThrow();
    expect(() => buildHouseholdManipulationConfig({ ...base, staticFrictionMu: 0.5, kineticFrictionMu: 0.6 })).toThrow();
    expect(() =>
      buildHouseholdManipulationConfig({
        ...base,
        obstacles: Array.from({ length: 33 }, (_, i) => ({
          name: `o${i}`,
          centerMeters: [0, 0, 0],
          halfExtentsMeters: [0.1, 0.1, 0.1],
          yawRad: 0,
          role: "keep-out" as const,
        })),
      }),
    ).toThrow();
    expect(() =>
      buildHouseholdManipulationConfig({
        ...base,
        obstacles: [{ name: "bad", centerMeters: [0, 0, 0], halfExtentsMeters: [0, 0.1, 0.1], yawRad: 0, role: "keep-out" as const }],
      }),
    ).toThrow();
    // Zero overrides and no roster: the 12-word packet with preset semantics.
    const plain = buildHouseholdManipulationConfig(base);
    expect(plain.length).toBe(12);
    expect(Array.from(plain.slice(8, 12))).toEqual([0, 0, 0, 0]);
  });
});

describe("declared structural surfaces (the robot-inside-the-floor regression)", () => {
  test("the declared floor's top face is the walking plane the rooms are drawn on", () => {
    const declared = HOUSE_STRUCTURAL_SURFACES.find((b) => b.id === "house-floor")!;
    expect(declared.center).toEqual([...CRAFTSMAN_FLOOR_SUPPORT.center]);
    expect(declared.halfExtents).toEqual([...CRAFTSMAN_FLOOR_SUPPORT.halfExtents]);
    expect(declared.center[1] + declared.halfExtents[1]).toBeCloseTo(CRAFTSMAN_FLOOR_Y, 12);
  });

  test("the rendered foundation sits strictly below the floor planes, never coplanar", () => {
    // Coplanar surfaces z-fight: with the foundation's top face at exactly the
    // walking plane the wood floor flickered in and out as the depth test
    // picked a winner per pixel per frame. It must be below, and close enough
    // that no gap is visible from outside the house.
    const renderedTop =
      CRAFTSMAN_FOUNDATION_SLAB.center[1] + CRAFTSMAN_FOUNDATION_SLAB.halfExtents[1];
    const supportTop = CRAFTSMAN_FLOOR_SUPPORT.center[1] + CRAFTSMAN_FLOOR_SUPPORT.halfExtents[1];
    expect(renderedTop).toBeLessThan(supportTop);
    expect(supportTop - renderedTop).toBeCloseTo(CRAFTSMAN_FOUNDATION_DEPTH_BELOW_FLOOR, 12);
    expect(supportTop - renderedTop).toBeGreaterThan(0.002);
    expect(supportTop - renderedTop).toBeLessThan(0.05);
    // Same footprint, so the masonry still reads as the house's base.
    expect(CRAFTSMAN_FOUNDATION_SLAB.halfExtents).toEqual([
      ...CRAFTSMAN_FLOOR_SUPPORT.halfExtents,
    ]);
  });

  test("the G1 roster declares the house floor as a support surface, not a keep-out", () => {
    const roster = g1KernelObstacleRoster([0, 0, 0]);
    const floor = roster.find((body) => body.name === "house floor");
    expect(floor, "the drawn floor must be declared to the owner").toBeDefined();
    expect(floor!.role).toBe("support");
    // Its top face is the walking plane: owner z is up, so centre + half.
    expect(floor!.centerMeters[2] + floor!.halfExtentsMeters[2]).toBeCloseTo(0, 12);
    expect(roster.filter((body) => body.role === "support")).toHaveLength(1);
    expect(roster.every((body) => body.halfExtentsMeters.every((h) => h > 0))).toBe(true);
  });

  test("the roster is expressed relative to the seat, so the house moves with the robot", () => {
    const atOrigin = g1KernelObstacleRoster([0, 0, 0]);
    const seated = g1KernelObstacleRoster([-1.75, 0, 0.25]);
    const floorA = atOrigin.find((b) => b.name === "house floor")!;
    const floorB = seated.find((b) => b.name === "house floor")!;
    // Owner x is stage x; owner y is -stage z.
    expect(floorB.centerMeters[0]).toBeCloseTo(floorA.centerMeters[0] + 1.75, 12);
    expect(floorB.centerMeters[1]).toBeCloseTo(floorA.centerMeters[1] + 0.25, 12);
    // Height is untouched by a horizontal seat.
    expect(floorB.centerMeters[2]).toBeCloseTo(floorA.centerMeters[2], 12);
  });

  test("the schema-8 packet carries eight words per body including the role", () => {
    const roster = g1KernelObstacleRoster([0, 0, 0], 6);
    const packet = buildG1Config({
      ...DEFAULT_G1_WALKING_CONFIG,
      task: "walking",
      challenge: "flat",
      obstacles: roster,
    });
    expect(packet.length).toBe(12 + 8 * roster.length);
    expect(packet[3]).toBe(packet.length);
    expect(packet[11]).toBe(roster.length);
    // First body is the floor: role word is 1 (support).
    expect(packet[19]).toBe(1);
    // Second body is furniture: role word is 0 (keep-out).
    expect(packet[27]).toBe(0);
  });
});
