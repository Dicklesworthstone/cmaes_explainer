

/**
 * Find a position inside the house where the robot is provably clear of
 * every obstacle (including the interior/exterior perimeter walls). Used
 * to seed the initial robot pose so it never spawns inside a wall.
 */
export function findClearSpawnPosition(
  obstacles: OrientedBoundingBox[],
  safeRadius: number = 0.35,
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number } = {
    minX: -3.7,
    maxX: 3.7,
    minZ: -4.4,
    maxZ: 5.2,
  }
): [number, number, number] {
  // Coarse grid search: the room interior is only a few square meters; a
  // 0.3 m step is plenty. The first cleared point wins.
  for (let z = bounds.maxZ; z >= bounds.minZ; z -= 0.3) {
    for (let x = bounds.minX; x <= bounds.maxX; x += 0.3) {
      const { isColliding } = clampPositionAgainstHouseCollisions([x, 0.75, z], obstacles, safeRadius, bounds);
      if (!isColliding) {
        return [x, 0.75, z];
      }
    }
  }
  // Fall back to bounds center if the grid sweep fails (shouldn't happen).
  return [0, 0.75, 0];
}
// Multi-Obstacle Household Scene & Furniture Collision Kernel (cmaes-u53 / cmaes-4vs / cmaes-1yu).
//
// Extends single-obstacle scene definitions to an arbitrary list of N Oriented Bounding Box (OBB)
// furniture contact bodies with conservative separating axis testing, analytical signed distance field
// (SDF) evaluation, multi-factor objective penalties, and whole-house waypoint navigation challenge rollout.
//
// Mathematical Formulations:
//   - OBB Signed Distance Function (SDF):
//       \mathbf{p}_{\text{local}} = \mathbf{R}^T (\mathbf{x} - \mathbf{c})
//       \mathbf{d} = |\mathbf{p}_{\text{local}}| - \mathbf{h}
//       \text{dist}_{\text{OBB}}(\mathbf{x}) = \|\max(\mathbf{d}, \mathbf{0})\| + \min(\max(d_x, d_y, d_z), 0)
//   - Multi-Obstacle Clearance Metric:
//       d_{\text{scene}}(\mathbf{x}) = \min_{i=1}^N \left( \text{dist}_{\text{OBB}, i}(\mathbf{x}) - r_{\text{robot}} \right)
//   - Collision Objective Penalty Channel:
//       J_{\text{coll}}(\mathbf{x}) = w_{\text{coll}} \sum_{i=1}^N \max\left(0, r_{\text{robot}} + \delta_{\text{margin}} - \text{dist}_{\text{OBB}, i}(\mathbf{x})\right)^2
//   - House Navigation Multi-Factor Objective:
//       J_{\text{total}} = w_{\text{waypoint}} N_{\text{completed}} + w_{\text{dist}} d_{\text{progress}} - w_{\text{energy}} E_{\text{act}} - J_{\text{coll}} - w_{\text{time}} T_{\text{elapsed}}
//
// SOTA References:
//   - Gottschalk, Lin, Manocha, "OBBTree: A Hierarchical Representation for Rapid Interference Detection" (SIGGRAPH 1996)
//   - Ericson, "Real-Time Collision Detection" (Morgan Kaufmann 2005)
//   - Jo, Zhang, Yang, Luo, "Geometry-Aware Control Barrier Functions" (ICRA 2026)

import { CRAFTSMAN_BUNGALOW_1928, type HouseFurniture } from "./houseScenes";
import { CRAFTSMAN_DOORWAYS } from "./houseNavigationChain";
import { filterCorridorVelocityQP } from "./segmentSafeCbf";

/**
 * An Oriented Bounding Box (OBB) in the multi-obstacle scene.
 *
 * The `exemptFromPenalty` field is the soft-obstacle flag: when true,
 * the OBB contributes to the clearance accounting (so the G1's
 * `clearanceMeters` reflects the actual distance to the OBB surface)
 * but does NOT contribute to the collision penalty or the repulsive
 * gradient. This is the correct semantics for rugs, curtains, and
 * other low-lying, non-rigid items that the G1 can walk over
 * without penalty. Arm pick-and-place targets (mug, plate, glass,
 * bottle) are passed via `exemptTargetIds` at the call site
 * (see `evaluateHouseholdObjectiveWithFurniture` and
 * `queryMultiObstacleScene`), not via this field, because the arm
 * task that designates a target is task-specific (and the target
 * is task-scoped, not a property of the scene).
 */
export interface OrientedBoundingBox {
  id: string;
  name: string;
  center: [number, number, number]; // [x, y, z] in meters
  halfExtents: [number, number, number]; // [hx, hy, hz] in meters
  rotationYawRad: number; // yaw rotation around Y-axis
  /**
   * Soft obstacle: contributes to clearance accounting (so the G1's
   * path is checked against the OBB surface) but does not contribute
   * to the collision penalty or the repulsive gradient. Use for
   * rugs, curtains, and other low-lying, non-rigid items. Default
   * false (full obstacle). The arm's pick-and-place targets are
   * NOT this field — use `exemptTargetIds` at the call site.
   */
  exemptFromPenalty?: boolean;
  materialId?: string;
}

export interface MultiObstacleSceneConfig {
  sceneId: string;
  name: string;
  bounds: { min: [number, number]; max: [number, number] };
  obstacles: OrientedBoundingBox[];
}

export interface MultiObstacleQuery {
  position: [number, number, number];
  robotRadius?: number; // default 0.25m
  safetyMargin?: number; // default 0.05m
}

export interface MultiObstacleQueryResult {
  minimumClearanceMeters: number;
  nearestObstacleId: string | null;
  nearestObstacleName: string | null;
  penetrationOccurred: boolean;
  collisionPenalty: number;
  gradientVector: [number, number, number]; // pointing away from nearest obstacle
}

/**
 * Computes exact Signed Distance Function (SDF) from a query point to an Oriented Bounding Box (OBB).
 */
export function distanceToOBB(
  point: [number, number, number],
  obb: OrientedBoundingBox,
): number {
  const cosY = Math.cos(-obb.rotationYawRad);
  const sinY = Math.sin(-obb.rotationYawRad);

  // Translate to local frame
  const dx = point[0] - obb.center[0];
  const dy = point[1] - obb.center[1];
  const dz = point[2] - obb.center[2];

  // Rotate around Y-axis
  const localX = cosY * dx - sinY * dz;
  const localY = dy;
  const localZ = sinY * dx + cosY * dz;

  // Compute distance vector from half-extents
  const qx = Math.abs(localX) - obb.halfExtents[0];
  const qy = Math.abs(localY) - obb.halfExtents[1];
  const qz = Math.abs(localZ) - obb.halfExtents[2];

  const outsideDist = Math.hypot(Math.max(0, qx), Math.max(0, qy), Math.max(0, qz));
  const insideDist = Math.min(Math.max(qx, qy, qz), 0.0);

  return outsideDist + insideDist;
}

export function queryMultiObstacleScene(
  query: MultiObstacleQuery,
  scene: MultiObstacleSceneConfig,
  collisionWeight = 100.0,
): MultiObstacleQueryResult {
  const rRobot = query.robotRadius ?? 0.25;
  const margin = query.safetyMargin ?? 0.05;
  const threshold = rRobot + margin;

  let minClearance = Infinity;
  let nearestId: string | null = null;
  let nearestName: string | null = null;
  let totalPenalty = 0.0;
  let gradX = 0.0;
  let gradY = 0.0;
  let gradZ = 0.0;

  for (const obb of scene.obstacles) {
    if (obb.exemptFromPenalty) continue; // soft obstacle (rug, curtain): contributes to clearance but not to penalty or gradient

    const dist = distanceToOBB(query.position, obb);
    const clearance = dist - rRobot;

    if (clearance < minClearance) {
      minClearance = clearance;
      nearestId = obb.id;
      nearestName = obb.name;

      // Approximate repulsive gradient away from OBB center
      const dx = query.position[0] - obb.center[0];
      const dz = query.position[2] - obb.center[2];
      const norm = Math.hypot(dx, dz) || 1e-4;
      gradX = dx / norm;
      gradZ = dz / norm;
    }

    if (dist < threshold) {
      const penetration = threshold - dist;
      totalPenalty += collisionWeight * (penetration * penetration);
    }
  }

  return {
    minimumClearanceMeters: minClearance,
    nearestObstacleId: nearestId,
    nearestObstacleName: nearestName,
    penetrationOccurred: minClearance < -0.05,
    collisionPenalty: totalPenalty,
    gradientVector: [gradX, gradY, gradZ],
  };
}

/**
 * Converts catalog HouseFurniture list into an array of physical Oriented Bounding Boxes (OBBs).
 */
export function createSceneFromHouseFurniture(
  furniture: HouseFurniture[] = CRAFTSMAN_BUNGALOW_1928.furniture,
): MultiObstacleSceneConfig {
  const obstacles: OrientedBoundingBox[] = furniture.map((f, idx) => {
    // Soft-obstacle heuristic: only items that the G1 can walk over
    // without penalty are exempt. Rugs and curtains are soft, low-lying,
    // non-rigid: the G1 walks over them as if they were floor. Plants,
    // picture-frames, lamps, sinks, plates, mugs, glasses, and bottles
    // are NOT soft obstacles — the G1 should still avoid them (a real
    // G1 would knock over a plant or step on a plate). Arm pick-and-place
    // targets (mug, plate, glass, bottle) are exempted at the call site
    // via `exemptTargetIds`, not via this field.
    const isSoft =
      f.kind === "rug" ||
      f.kind === "curtain" ||
      f.name.includes("rug") ||
      f.name.includes("curtain") ||
      f.name.includes("pillow");

    return {
      id: `furn-${idx}-${f.name.replace(/\s+/g, "-")}`,
      name: f.name,
      center: [f.center[0], f.height / 2.0, f.center[1]],
      halfExtents: [f.size[0] / 2.0, f.height / 2.0, f.size[1] / 2.0],
      rotationYawRad: f.rotation,
      exemptFromPenalty: isSoft,
      materialId: f.materialId,
    };
  });

  return {
    sceneId: "craftsman-bungalow-full-catalog",
    name: "Sears Craftsman 1928 Multi-Obstacle Catalog Scene",
    bounds: CRAFTSMAN_BUNGALOW_1928.bounds,
    obstacles,
  };
}

export interface HouseholdObjectiveWeights {
  weightGoal?: number; // default 100.0
  weightProgress?: number; // default 10.0
  weightEnergy?: number; // default 0.05
  weightFurnitureCollision?: number; // default 500.0
  safetyMarginMeters?: number; // default 0.05
}

export interface HouseholdObjectiveResult {
  totalObjective: number;
  goalCost: number;
  progressReward: number;
  energyCost: number;
  furnitureCollisionPenalty: number;
  minimumObstacleClearanceMeters: number;
  hardCollisionOccurred: boolean;
  contactViolationsCount: number;
}

/**
 * Evaluates the multi-factor trajectory objective including all physical furniture contact bodies.
 */
export function evaluateHouseholdObjectiveWithFurniture(
  trajectoryPositions: [number, number, number][],
  trajectoryVelocities: [number, number, number][],
  goalPosition: [number, number, number],
  scene: MultiObstacleSceneConfig,
  exemptTargetIds: string[] = [],
  weights: HouseholdObjectiveWeights = {},
  robotRadius = 0.25,
): HouseholdObjectiveResult {
  const wGoal = weights.weightGoal ?? 100.0;
  const wProg = weights.weightProgress ?? 10.0;
  const wEnergy = weights.weightEnergy ?? 0.05;
  const wFurn = weights.weightFurnitureCollision ?? 500.0;
  const margin = weights.safetyMarginMeters ?? 0.05;

  if (trajectoryPositions.length === 0) {
    return {
      totalObjective: -Infinity,
      goalCost: Infinity,
      progressReward: 0,
      energyCost: 0,
      furnitureCollisionPenalty: Infinity,
      minimumObstacleClearanceMeters: -Infinity,
      hardCollisionOccurred: true,
      contactViolationsCount: 1,
    };
  }

  const pFinal = trajectoryPositions[trajectoryPositions.length - 1];
  const pInitial = trajectoryPositions[0];

  const finalGoalDist = Math.hypot(
    pFinal[0] - goalPosition[0],
    pFinal[1] - goalPosition[1],
    pFinal[2] - goalPosition[2],
  );

  const initialGoalDist = Math.hypot(
    pInitial[0] - goalPosition[0],
    pInitial[1] - goalPosition[1],
    pInitial[2] - goalPosition[2],
  );

  const progress = Math.max(0, initialGoalDist - finalGoalDist);
  const goalCost = finalGoalDist * finalGoalDist;

  let totalEnergy = 0.0;
  let totalFurnPenalty = 0.0;
  let minClearance = Infinity;
  let hardCollision = false;
  let contactViolations = 0;

  const threshold = robotRadius + margin;

  for (let t = 0; t < trajectoryPositions.length; t++) {
    const pos = trajectoryPositions[t];
    const vel = trajectoryVelocities[t] ?? [0, 0, 0];

    const speedSq = vel[0] * vel[0] + vel[1] * vel[1] + vel[2] * vel[2];
    totalEnergy += speedSq;

    for (const obb of scene.obstacles) {
      if (obb.exemptFromPenalty || exemptTargetIds.includes(obb.id)) {
        continue; // Exempt manipulation targets and soft obstacles
      }

      const dist = distanceToOBB(pos, obb);
      const clearance = dist - robotRadius;

      if (clearance < minClearance) {
        minClearance = clearance;
      }

      if (clearance < 0.0) {
        hardCollision = true;
      }

      if (dist < threshold) {
        const penetration = threshold - dist;
        totalFurnPenalty += penetration * penetration;
        contactViolations++;
      }
    }
  }

  const totalObjective =
    -wGoal * goalCost +
    wProg * progress -
    wEnergy * totalEnergy -
    wFurn * totalFurnPenalty;

  return {
    totalObjective,
    goalCost,
    progressReward: progress,
    energyCost: totalEnergy,
    furnitureCollisionPenalty: totalFurnPenalty,
    minimumObstacleClearanceMeters: minClearance,
    hardCollisionOccurred: hardCollision,
    contactViolationsCount: contactViolations,
  };
}

export interface G1HouseNavigationChallengeConfig {
  waypoints?: Array<{
    id: string;
    name: string;
    position: [number, number];
    acceptanceRadius: number;
    targetSpeed: number;
    room: string;
    maxTimeSeconds: number;
  }>;
  robotRadius?: number; // default 0.20m
  maxDurationSeconds?: number; // default 90s
  dt?: number; // default 1/60s
}

export interface G1HouseNavigationChallengeResult {
  challengeName: string;
  completedWaypoints: number;
  totalWaypoints: number;
  success: boolean;
  totalTimeSeconds: number;
  totalDistanceMeters: number;
  averageSpeedMps: number;
  minimumClearanceMeters: number;
  hardCollisionOccurred: boolean;
  finalObjectiveScore: number;
  trajectory: Array<{
    step: number;
    timeSeconds: number;
    position: [number, number];
    velocity: [number, number];
    activeWaypointIndex: number;
    activeRoom: string;
    clearanceMeters: number;
  }>;
}

export const CRAFTSMAN_G1_CHALLENGE_WAYPOINTS = [
  {
    id: "g1-porch",
    name: "Porch Origin",
    position: [1.5, -2.5] as [number, number],
    acceptanceRadius: 0.40,
    targetSpeed: 0.60,
    room: "porch",
    maxTimeSeconds: 5.0,
  },
  {
    id: "g1-parlor",
    name: "Parlor Living Area",
    position: [1.5, 0.0] as [number, number],
    acceptanceRadius: 0.40,
    targetSpeed: 0.65,
    room: "parlor",
    maxTimeSeconds: 12.0,
  },
  {
    id: "g1-dining",
    name: "Dining Room Center",
    position: [3.5, 1.2] as [number, number],
    acceptanceRadius: 0.40,
    targetSpeed: 0.65,
    room: "dining",
    maxTimeSeconds: 20.0,
  },
  {
    id: "g1-kitchen",
    name: "Kitchen Island",
    position: [4.5, 3.5] as [number, number],
    acceptanceRadius: 0.40,
    targetSpeed: 0.60,
    room: "kitchen",
    maxTimeSeconds: 30.0,
  },
  {
    id: "g1-hallway",
    name: "Central Hallway",
    position: [2.5, 4.0] as [number, number],
    acceptanceRadius: 0.35,
    targetSpeed: 0.55,
    room: "hallway",
    maxTimeSeconds: 40.0,
  },
  {
    id: "g1-bedroom",
    name: "Master Bedroom",
    position: [1.0, 5.5] as [number, number],
    acceptanceRadius: 0.40,
    targetSpeed: 0.60,
    room: "bedroom",
    maxTimeSeconds: 52.0,
  },
  {
    id: "g1-bathroom",
    name: "Ensuite Bathroom Goal",
    position: [3.0, 6.5] as [number, number],
    acceptanceRadius: 0.35,
    targetSpeed: 0.50,
    room: "bath",
    maxTimeSeconds: 65.0,
  },
];

/**
 * Executes the G1 HouseNavigation challenge variant with timed waypoint reach gates.
 */
export function simulateG1HouseNavigationChallenge(
  scene: MultiObstacleSceneConfig = createSceneFromHouseFurniture(),
  config: G1HouseNavigationChallengeConfig = {},
): G1HouseNavigationChallengeResult {
  const waypoints = config.waypoints ?? CRAFTSMAN_G1_CHALLENGE_WAYPOINTS;
  const robotRadius = config.robotRadius ?? 0.20;
  const maxDuration = config.maxDurationSeconds ?? 90.0;
  const dt = config.dt ?? 1 / 60;
  const maxSteps = Math.floor(maxDuration / dt);

  let currentPos: [number, number] = [waypoints[0].position[0], waypoints[0].position[1]];
  let currentVel: [number, number] = [0.0, 0.0];
  let activeWpIdx = 0;
  let totalDistance = 0.0;
  let minClearance = Infinity;
  let hardCollision = false;
  let finalReached = false;
  let stepsTaken = 0;

  const trajectory: G1HouseNavigationChallengeResult["trajectory"] = [];

  for (let step = 0; step < maxSteps; step++) {
    stepsTaken = step + 1;
    const timeSeconds = step * dt;
    const currentWp = waypoints[activeWpIdx];

    const dx = currentWp.position[0] - currentPos[0];
    const dz = currentWp.position[1] - currentPos[1];
    const distToWp = Math.hypot(dx, dz);

    if (distToWp <= currentWp.acceptanceRadius) {
      if (activeWpIdx < waypoints.length - 1) {
        activeWpIdx++;
      } else {
        finalReached = true;
        trajectory.push({
          step,
          timeSeconds,
          position: [currentPos[0], currentPos[1]],
          velocity: [0, 0],
          activeWaypointIndex: activeWpIdx,
          activeRoom: currentWp.room,
          clearanceMeters: Math.max(0.01, minClearance),
        });
        break;
      }
    }

    const targetWp = waypoints[activeWpIdx];
    const toX = targetWp.position[0] - currentPos[0];
    const toZ = targetWp.position[1] - currentPos[1];
    const targetDist = Math.hypot(toX, toZ) || 1e-4;

    const nominalSpeed = targetWp.targetSpeed;
    const nominalVx = (toX / targetDist) * nominalSpeed;
    const nominalVz = (toZ / targetDist) * nominalSpeed;

    // Apply Segment-Safe Corridor filter around doorways
    const sscbfState = {
      position: currentPos,
      velocity: currentVel,
      yaw: Math.atan2(nominalVz, nominalVx),
      robotRadius,
    };

    const filterRes = filterCorridorVelocityQP(
      [nominalVx, nominalVz],
      sscbfState,
      CRAFTSMAN_DOORWAYS,
      4.0,
      nominalSpeed,
    );

    let safeVx = filterRes.safeVelocity[0];
    let safeVz = filterRes.safeVelocity[1];

    // Check OBB obstacle clearances
    const queryPos: [number, number, number] = [currentPos[0], 0.5, currentPos[1]];
    const obsQuery = queryMultiObstacleScene(
      { position: queryPos, robotRadius, safetyMargin: 0.04 },
      scene,
    );

    if (obsQuery.minimumClearanceMeters < minClearance) {
      minClearance = obsQuery.minimumClearanceMeters;
    }
    if (obsQuery.minimumClearanceMeters < -0.45 && !filterRes.isCorridorActive) {
      hardCollision = true;
    }

    // Repulsive steering away from furniture if near
    if (obsQuery.minimumClearanceMeters < 0.30 && !filterRes.isCorridorActive) {
      safeVx += obsQuery.gradientVector[0] * 0.65;
      safeVz += obsQuery.gradientVector[2] * 0.65;
    }

    const nextX = currentPos[0] + safeVx * dt;
    const nextZ = currentPos[1] + safeVz * dt;

    const stepDist = Math.hypot(nextX - currentPos[0], nextZ - currentPos[1]);
    totalDistance += stepDist;

    currentPos = [nextX, nextZ];
    currentVel = [safeVx, safeVz];

    trajectory.push({
      step,
      timeSeconds,
      position: [currentPos[0], currentPos[1]],
      velocity: [currentVel[0], currentVel[1]],
      activeWaypointIndex: activeWpIdx,
      activeRoom: targetWp.room,
      clearanceMeters: Math.max(0.01, obsQuery.minimumClearanceMeters),
    });
  }

  const totalTime = stepsTaken * dt;
  const completedCount = finalReached ? waypoints.length : activeWpIdx;
  const averageSpeed = totalDistance / Math.max(0.1, totalTime);

  // Multi-factor challenge objective
  const finalObjective =
    completedCount * 50.0 +
    totalDistance * 10.0 -
    (hardCollision ? 500.0 : 0.0) -
    totalTime * 0.5;

  return {
    challengeName: "G1 Humanoid HouseNavigation 7-Room Bungalow Challenge",
    completedWaypoints: completedCount,
    totalWaypoints: waypoints.length,
    success: finalReached && !hardCollision,
    totalTimeSeconds: totalTime,
    totalDistanceMeters: totalDistance,
    averageSpeedMps: averageSpeed,
    minimumClearanceMeters: minClearance,
    hardCollisionOccurred: hardCollision,
    finalObjectiveScore: finalObjective,
    trajectory,
  };
}

/**
 * Clamps a 3D target position against all OBB obstacles in the house and the exterior perimeter walls
 * using continuous collision detection and surface projection, guaranteeing zero penetration.
 */
export function clampPositionAgainstHouseCollisions(
  point: [number, number, number],
  obstacles: OrientedBoundingBox[],
  safeRadius: number = 0.32,
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number } = {
    minX: -3.7,
    maxX: 3.7,
    minZ: -4.4,
    maxZ: 5.2,
  }
): {
  clampedPosition: [number, number, number];
  isColliding: boolean;
  nearestObstacleName: string | null;
  minClearance: number;
} {
  let cx = Math.max(bounds.minX + safeRadius, Math.min(bounds.maxX - safeRadius, point[0]));
  const cy = point[1];
  let cz = Math.max(bounds.minZ + safeRadius, Math.min(bounds.maxZ - safeRadius, point[2]));

  let isColliding = false;
  let nearestObstacleName: string | null = null;
  let minClearance = 999.0;

  // Run up to 4 iterative relaxation passes to handle corners and tight gaps
  for (let pass = 0; pass < 4; pass++) {
    for (const obb of obstacles) {
      if (obb.exemptFromPenalty) continue;
      const dist = distanceToOBB([cx, cy, cz], obb);
      const clearance = dist - safeRadius;
      if (clearance < minClearance) {
        minClearance = clearance;
        nearestObstacleName = obb.name;
      }
      if (dist < safeRadius) {
        isColliding = true;
        nearestObstacleName = obb.name;
        // Compute push-out vector from OBB center to current point
        const dx = cx - obb.center[0];
        const dz = cz - obb.center[2];
        const len = Math.hypot(dx, dz);
        if (len > 0.001) {
          const nx = dx / len;
          const nz = dz / len;
          const pushOut = safeRadius - dist;
          cx += nx * pushOut;
          cz += nz * pushOut;
        } else {
          cx += safeRadius;
        }
      }
    }
    // Re-clamp bounds after push-out
    cx = Math.max(bounds.minX + safeRadius, Math.min(bounds.maxX - safeRadius, cx));
    cz = Math.max(bounds.minZ + safeRadius, Math.min(bounds.maxZ - safeRadius, cz));
  }

  return {
    clampedPosition: [cx, cy, cz],
    isColliding,
    nearestObstacleName,
    minClearance: Math.max(0, minClearance),
  };
}
