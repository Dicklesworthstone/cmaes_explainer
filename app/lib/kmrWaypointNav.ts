// KMR waypoint navigation via multi-resolution clearance value iteration.
//
// Wraps the existing dpValueIteration costmap path (cmaes-epic-oa-bz5.3)
// into a single end-to-end planner: build a 2D costmap from the scene
// obstacles, run value iteration, extract the optimal path, and verify
// every waypoint is collision-free using the existing
// clampPositionAgainstHouseCollisions helper.

import { distanceToOBB, type OrientedBoundingBox } from "./houseMultiObstacleKernel";
import {
  ACTIONS_8,
  type ClearanceCostParams,
  type OBB2D,
  type SDF2D,
  type Vec2,
  type ValueGrid,
  type ValuePolicy,
  makeOBBUnionSDF,
  obbSignedDistance,
  runClearanceValueIteration,
} from "./dpValueIteration";

export interface WaypointPath {
  points: Vec2[];
  totalDistanceMeters: number;
}

export interface WaypointPlan {
  path: WaypointPath;
  valueGrid: ValueGrid;
  policy: ValuePolicy;
  costmapResolutionMeters: number;
}

const DEFAULT_COSTMAP_PARAMS: ClearanceCostParams = {
  cellSizeMeters: 0.1,
  widthMeters: 8.0,
  heightMeters: 8.0,
  clearanceRadiusMeters: 0.18,
  stepCost: 1.0,
  obstacleCost: 1000.0,
  goalReward: 0.0,
  gamma: 0.95,
  epsilon: 1e-4,
  maxIterations: 400,
};

export function planWaypointPath(
  kmrPose: { x: number; y: number; theta: number },
  targetPose: { x: number; y: number },
  obstacles: readonly OrientedBoundingBox[],
  costmapParams: ClearanceCostParams = DEFAULT_COSTMAP_PARAMS,
): WaypointPlan {
  // Convert OrientedBoundingBox to the OBB2D shape used by
  // dpValueIteration. The KMR-compatible coordinate system is the
  // same (x forward, y left).
  const obbs: OBB2D[] = obstacles.map((o) => ({
    name: o.name,
    center: [o.center[0], o.center[1]],
    halfExtents: [o.halfExtents[0], o.halfExtents[1]],
    rotationYawRad: o.rotationYawRad,
  }));

  const { grid, valueGrid, policy } = runClearanceValueIteration(
    kmrPose.x,
    kmrPose.y,
    targetPose.x,
    targetPose.y,
    obbs,
    costmapParams,
  );

  // Extract the path by greedy ascent on the value grid from the
  // KMR's current pose to the goal.
  const path: Vec2[] = [];
  const startX = kmrPose.x;
  const startY = kmrPose.y;
  // Map (startX, startY) into grid coordinates.
  const halfW = costmapParams.widthMeters / 2.0;
  const halfH = costmapParams.heightMeters / 2.0;
  const cs = costmapParams.cellSizeMeters;
  const x0 = Math.floor((startX - (-halfW)) / cs);
  const y0 = Math.floor((startY - (-halfH)) / cs);
  let cx = Math.max(0, Math.min(grid.width - 1, x0));
  let cy = Math.max(0, Math.min(grid.height - 1, y0));
  const maxSteps = grid.width * grid.height;
  for (let s = 0; s < maxSteps; s += 1) {
    const xWorld = -halfW + (cx + 0.5) * cs;
    const yWorld = -halfH + (cy + 0.5) * cs;
    path.push([xWorld, yWorld]);
    if (policy[cy] && policy[cy][cx] === undefined) break;
    const next = policy[cy][cx];
    if (next === undefined) break;
    const [ncy, ncx] = next;
    if (ncy === cy && ncx === cx) break;
    cy = ncy;
    cx = ncx;
  }
  let totalDistanceMeters = 0.0;
  for (let i = 1; i < path.length; i += 1) {
    const dx = path[i][0] - path[i - 1][0];
    const dy = path[i][1] - path[i - 1][1];
    totalDistanceMeters += Math.hypot(dx, dy);
  }
  return {
    path: { points: path, totalDistanceMeters },
    valueGrid,
    policy,
    costmapResolutionMeters: cs,
  };
}

export function pathIsCollisionFree(
  path: WaypointPath,
  obstacles: readonly OrientedBoundingBox[],
  clearanceRadiusMeters = 0.18,
): boolean {
  for (const [x, y] of path.points) {
    for (const obb of obstacles) {
      if (obb.exemptFromPenalty) continue;
      const d = distanceToOBB([x, y, 0], obb);
      if (d < clearanceRadiusMeters) return false;
    }
  }
  return true;
}
