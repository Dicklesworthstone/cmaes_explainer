// KMR waypoint navigation via multi-resolution clearance value iteration.
//
// Wraps the existing dpValueIteration costmap path (cmaes-epic-oa-bz5.3)
// into a single end-to-end planner: build a 2D SDF from the scene
// obstacles, run value iteration, extract the optimal path, and
// verify every waypoint is collision-free using the existing
// distanceToOBB helper.

import type { OrientedBoundingBox } from "./houseMultiObstacleKernel";
import {
  type AABB2D,
  ACTIONS_8,
  type ClearanceCostParams,
  type OBB2D,
  type SDF2D,
  type ValueGrid,
  type ValuePolicy,
  type Vec2,
  makeOBBUnionSDF,
  runClearanceValueIteration,
} from "./dpValueIteration";

export interface WaypointPath {
  points: Vec2[];
  totalDistanceMeters: number;
  minimumClearanceMeters: number;
  planner: "clearance-value-iteration";
}

export interface WaypointPlan {
  path: WaypointPath;
  valueGrid: ValueGrid;
  policy: ValuePolicy;
  costmapResolutionMeters: number;
}

const DEFAULT_COSTMAP_PARAMS: ClearanceCostParams = {
  stepPenalty: 1.0,
  safetyMargin: 0.18,
  clearanceWeight: 10.0,
  actionWeight: 0.1,
};

const DEFAULT_BOUNDS: AABB2D = {
  min: [-4, -4],
  max: [4, 4],
};

const GOAL_RADIUS = 0.18;
// Procedural chassis half-width (0.30 m) plus a 0.02 m planning margin.
// This is a heading-aligned footprint proxy, not the circumscribed radius of
// KUKA's larger official whole-vehicle envelope; the UI discloses that limit.
export const KMR_PLANAR_CLEARANCE_RADIUS_METERS = 0.32;

function planarObstacles(
  obstacles: readonly OrientedBoundingBox[],
): OBB2D[] {
  return obstacles
    .filter((obstacle) => !obstacle.exemptFromPenalty)
    .map((obstacle) => ({
      center: [obstacle.center[0], obstacle.center[2]],
      halfExtents: [obstacle.halfExtents[0], obstacle.halfExtents[2]],
      yaw: obstacle.rotationYawRad,
    }));
}

/** Shared planar X/Z obstacle field consumed by planner, LiDAR, and owner. */
export function createKmrPlanarSdf(
  obstacles: readonly OrientedBoundingBox[],
): SDF2D {
  return makeOBBUnionSDF(planarObstacles(obstacles));
}

function pointToGridIndex(grid: ValueGrid, point: Vec2): [number, number] {
  const ix = Math.max(
    0,
    Math.min(
      grid.width - 1,
      Math.floor((point[0] - grid.origin[0]) / grid.resolution),
    ),
  );
  const iy = Math.max(
    0,
    Math.min(
      grid.height - 1,
      Math.floor((point[1] - grid.origin[1]) / grid.resolution),
    ),
  );
  return [ix, iy];
}

function gridCellCenter(grid: ValueGrid, ix: number, iy: number): Vec2 {
  return [
    grid.origin[0] + (ix + 0.5) * grid.resolution,
    grid.origin[1] + (iy + 0.5) * grid.resolution,
  ];
}

function segmentHasClearance(
  from: Vec2,
  to: Vec2,
  sdf: SDF2D,
  clearanceRadiusMeters: number,
  sampleSpacingMeters: number,
): boolean {
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const samples = Math.max(1, Math.ceil(length / sampleSpacingMeters));
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = from[0] + (to[0] - from[0]) * t;
    const y = from[1] + (to[1] - from[1]) * t;
    if (sdf(x, y) < clearanceRadiusMeters) return false;
  }
  return true;
}

function simplifyByLineOfSight(
  points: readonly Vec2[],
  sdf: SDF2D,
  clearanceRadiusMeters: number,
  sampleSpacingMeters: number,
): Vec2[] {
  if (points.length <= 2) return [...points];
  const simplified: Vec2[] = [points[0]];
  let anchor = 0;
  while (anchor < points.length - 1) {
    let next = anchor + 1;
    for (let candidate = points.length - 1; candidate > anchor + 1; candidate--) {
      if (
        segmentHasClearance(
          points[anchor],
          points[candidate],
          sdf,
          clearanceRadiusMeters,
          sampleSpacingMeters,
        )
      ) {
        next = candidate;
        break;
      }
    }
    simplified.push(points[next]);
    anchor = next;
  }
  return simplified;
}

function extractValueGuidedPath(
  grid: ValueGrid,
  policy: ValuePolicy,
  start: Vec2,
  target: Vec2,
  sdf: SDF2D,
  clearanceRadiusMeters: number,
): Vec2[] {
  const [startIx, startIy] = pointToGridIndex(grid, start);
  const startIndex = startIy * grid.width + startIx;
  const cellCount = grid.width * grid.height;
  const gScore = new Float64Array(cellCount).fill(Number.POSITIVE_INFINITY);
  const cameFrom = new Int32Array(cellCount).fill(-1);
  const closed = new Uint8Array(cellCount);
  const open: Array<{ index: number; score: number }> = [];
  gScore[startIndex] = 0;
  open.push({ index: startIndex, score: 0 });

  const heuristic = (index: number): number => {
    const value = grid.values[index];
    if (Number.isFinite(value)) return value;
    const ix = index % grid.width;
    const iy = Math.floor(index / grid.width);
    const center = gridCellCenter(grid, ix, iy);
    return Math.hypot(center[0] - target[0], center[1] - target[1]) /
      grid.resolution;
  };

  let goalIndex = -1;
  while (open.length > 0) {
    let bestOpen = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i].score < open[bestOpen].score) bestOpen = i;
    }
    const currentEntry = open.splice(bestOpen, 1)[0];
    const currentIndex = currentEntry.index;
    if (closed[currentIndex]) continue;
    closed[currentIndex] = 1;
    const ix = currentIndex % grid.width;
    const iy = Math.floor(currentIndex / grid.width);
    const current = gridCellCenter(grid, ix, iy);

    if (Math.hypot(current[0] - target[0], current[1] - target[1]) <= GOAL_RADIUS) {
      goalIndex = currentIndex;
      break;
    }

    for (const [dx, dy] of ACTIONS_8) {
      const nx = ix + dx;
      const ny = iy + dy;
      if (nx < 0 || nx >= grid.width || ny < 0 || ny >= grid.height) continue;
      const neighborIndex = ny * grid.width + nx;
      if (closed[neighborIndex] || policy.collision[neighborIndex] === 1) continue;
      const neighbor = gridCellCenter(grid, nx, ny);
      const clearance = sdf(neighbor[0], neighbor[1]) - clearanceRadiusMeters;
      if (clearance < 0) continue;
      if (
        !segmentHasClearance(
          current,
          neighbor,
          sdf,
          clearanceRadiusMeters,
          grid.resolution / 5,
        )
      ) continue;

      const stepLength = Math.hypot(dx, dy);
      const clearancePenalty = Math.max(0, 0.25 - clearance) * 4;
      const tentative = gScore[currentIndex] + stepLength + clearancePenalty;
      if (tentative >= gScore[neighborIndex]) continue;
      cameFrom[neighborIndex] = currentIndex;
      gScore[neighborIndex] = tentative;
      open.push({
        index: neighborIndex,
        score: tentative + heuristic(neighborIndex),
      });
    }
  }

  if (goalIndex < 0) {
    throw new Error("KMR value-guided search found no collision-free route");
  }

  const reversed: Vec2[] = [];
  let cursor = goalIndex;
  while (cursor >= 0 && cursor !== startIndex) {
    const ix = cursor % grid.width;
    const iy = Math.floor(cursor / grid.width);
    reversed.push(gridCellCenter(grid, ix, iy));
    cursor = cameFrom[cursor];
  }
  if (cursor !== startIndex) {
    throw new Error("KMR value-guided path reconstruction lost its start cell");
  }
  reversed.reverse();
  const points: Vec2[] = [start, ...reversed];
  if (
    segmentHasClearance(
      points[points.length - 1],
      target,
      sdf,
      clearanceRadiusMeters,
      grid.resolution / 5,
    )
  ) {
    points.push(target);
  } else {
    throw new Error("KMR goal cell cannot connect to the exact requested pose");
  }
  return points;
}

export function planWaypointPath(
  kmrPose: { x: number; y: number; theta: number },
  targetPose: { x: number; y: number },
  obstacles: readonly OrientedBoundingBox[],
  costmapParams: ClearanceCostParams = DEFAULT_COSTMAP_PARAMS,
  bounds: AABB2D = DEFAULT_BOUNDS,
  clearanceRadiusMeters = KMR_PLANAR_CLEARANCE_RADIUS_METERS,
): WaypointPlan {
  if (
    targetPose.x < bounds.min[0] ||
    targetPose.x > bounds.max[0] ||
    targetPose.y < bounds.min[1] ||
    targetPose.y > bounds.max[1]
  ) {
    throw new Error("KMR goal lies outside the declared planning bounds");
  }
  const obbs = planarObstacles(obstacles);
  const sdf = makeOBBUnionSDF(obbs);
  if (sdf(kmrPose.x, kmrPose.y) < clearanceRadiusMeters) {
    throw new Error("KMR start pose does not clear the scene obstacles");
  }
  if (sdf(targetPose.x, targetPose.y) < clearanceRadiusMeters) {
    throw new Error("KMR goal does not clear the scene obstacles");
  }

  const result = runClearanceValueIteration(
    bounds,
    [kmrPose.x, kmrPose.y],
    [{ center: [targetPose.x, targetPose.y], radius: GOAL_RADIUS }],
    {
      cost: {
        ...costmapParams,
        safetyMargin: Math.max(
          costmapParams.safetyMargin,
          clearanceRadiusMeters,
        ),
      },
      obstacles: obbs,
      actions: ACTIONS_8,
      coarseResolution: 0.1,
      fineResolution: 0.02,
    },
  );

  const rawPath = extractValueGuidedPath(
    result.coarseValue,
    result.coarsePolicy,
    [kmrPose.x, kmrPose.y],
    [targetPose.x, targetPose.y],
    sdf,
    clearanceRadiusMeters,
  );
  const path = simplifyByLineOfSight(
    rawPath,
    sdf,
    clearanceRadiusMeters,
    result.coarseValue.resolution / 5,
  );
  let totalDistanceMeters = 0.0;
  let minimumClearanceMeters = Number.POSITIVE_INFINITY;
  for (const point of path) {
    minimumClearanceMeters = Math.min(
      minimumClearanceMeters,
      sdf(point[0], point[1]) - clearanceRadiusMeters,
    );
  }
  for (let i = 1; i < path.length; i += 1) {
    const ddx = path[i][0] - path[i - 1][0];
    const ddy = path[i][1] - path[i - 1][1];
    totalDistanceMeters += Math.hypot(ddx, ddy);
  }
  return {
    path: {
      points: path,
      totalDistanceMeters,
      minimumClearanceMeters,
      planner: "clearance-value-iteration",
    },
    valueGrid: result.coarseValue,
    policy: result.coarsePolicy,
    costmapResolutionMeters: result.coarseValue.resolution,
  };
}

export function pathIsCollisionFree(
  path: WaypointPath,
  obstacles: readonly OrientedBoundingBox[],
  clearanceRadiusMeters = 0.18,
): boolean {
  const sdf = createKmrPlanarSdf(obstacles);
  for (const [x, y] of path.points) {
    if (sdf(x, y) < clearanceRadiusMeters) return false;
  }
  for (let i = 1; i < path.points.length; i++) {
    if (
      !segmentHasClearance(
        path.points[i - 1],
        path.points[i],
        sdf,
        clearanceRadiusMeters,
        0.02,
      )
    ) return false;
  }
  return true;
}
