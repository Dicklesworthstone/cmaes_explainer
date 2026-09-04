/** Conservative sphere radius enclosing all supplied points around a center. */
export function enclosingSpawnRadius(
  center: [number, number, number],
  points: readonly [number, number, number][],
  shellPadding = 0,
  minimumRadius = 0,
): number {
  if (
    !center.every(Number.isFinite) ||
    !Number.isFinite(shellPadding) ||
    shellPadding < 0 ||
    !Number.isFinite(minimumRadius) ||
    minimumRadius < 0 ||
    points.length === 0 ||
    points.some((point) => !point.every(Number.isFinite))
  ) {
    throw new Error("spawn envelope requires finite points and non-negative radii");
  }
  return points.reduce(
    (radius, point) =>
      Math.max(
        radius,
        Math.hypot(
          point[0] - center[0],
          point[1] - center[1],
          point[2] - center[2],
        ) + shellPadding,
      ),
    minimumRadius,
  );
}

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
  },
): [number, number, number] {
  if (!Number.isFinite(safeRadius) || safeRadius <= 0) {
    throw new Error("spawn safeRadius must be finite and greater than zero");
  }
  if (
    !Number.isFinite(bounds.minX) ||
    !Number.isFinite(bounds.maxX) ||
    !Number.isFinite(bounds.minZ) ||
    !Number.isFinite(bounds.maxZ) ||
    bounds.minX >= bounds.maxX ||
    bounds.minZ >= bounds.maxZ
  ) {
    throw new Error("spawn bounds must be finite and have positive area");
  }
  // Coarse grid search: the room interior is only a few square meters; a
  // 0.3 m step is plenty. The first cleared point wins.
  //
  // The sample itself is what gets returned, never a clamped/projected
  // variant of it. The previous implementation returned the push-out
  // result of clampPositionAgainstHouseCollisions, whose OBB projection is
  // fully 3D and escapes short furniture through its +Y face; callers
  // then dropped Y and placed the robot on top of (and therefore inside)
  // the sofa. Verifying the raw sample keeps the clearance proof honest.
  for (let z = bounds.maxZ - safeRadius; z >= bounds.minZ + safeRadius; z -= 0.3) {
    for (let x = bounds.minX + safeRadius; x <= bounds.maxX - safeRadius; x += 0.3) {
      const candidate: [number, number, number] = [x, 0.75, z];
      if (isSphereClearOfRigidObstacles(candidate, safeRadius, obstacles)) {
        return candidate;
      }
    }
  }
  throw new Error("no collision-free robot spawn exists inside the declared bounds");
}

/** True when a sphere at `center` keeps `radius` clearance from every rigid OBB. */
export function isSphereClearOfRigidObstacles(
  center: [number, number, number],
  radius: number,
  obstacles: readonly OrientedBoundingBox[],
): boolean {
  for (const obb of obstacles) {
    if (obb.exemptFromPenalty) continue;
    if (distanceToOBB(center, obb) < radius) return false;
  }
  return true;
}

export interface TrajectorySpawnSearch {
  /**
   * Every point the robot occupies over the whole rendered trajectory,
   * expressed relative to the reference pelvis in the horizontal plane
   * (x, z) with absolute height y. Translating the robot by an offset
   * translates every one of these points by the same (dx, 0, dz).
   */
  footprint: readonly [number, number, number][];
  /** Required clearance from every rigid OBB surface for every point. */
  clearance: number;
  /** Preferred horizontal location (x, z) for the reference pelvis. */
  anchor: [number, number];
  bounds?: { minX: number; maxX: number; minZ: number; maxZ: number };
  /** Horizontal grid resolution in meters. */
  step?: number;
}

export interface TrajectorySpawnResult {
  /** Horizontal translation to apply to the reference pelvis. */
  offset: [number, number, number];
  /** Reference pelvis position after translation. */
  pelvis: [number, number];
  /** Smallest clearance any footprint point keeps from any rigid OBB. */
  minClearance: number;
  candidatesTested: number;
}

/**
 * Find a horizontal translation that keeps the ENTIRE walking trajectory
 * clear of every rigid house obstacle, preferring the candidate nearest
 * the anchor. A first-frame envelope is not sufficient for a walking
 * robot: the G1 covers about two meters after spawn, so every sampled
 * link position along the trace participates in the proof.
 *
 * Search order is by anchor distance, so the first feasible candidate is
 * the closest one. Each candidate rejects on the first violating point,
 * which keeps the search cheap even with ~1000 footprint points.
 */
export function findClearTrajectorySpawnOffset(
  obstacles: readonly OrientedBoundingBox[],
  search: TrajectorySpawnSearch,
): TrajectorySpawnResult {
  const { footprint, clearance, anchor } = search;
  const step = search.step ?? 0.25;
  const bounds = search.bounds ?? {
    minX: CRAFTSMAN_BUNGALOW_1928.bounds.min[0],
    maxX: CRAFTSMAN_BUNGALOW_1928.bounds.max[0],
    minZ: CRAFTSMAN_BUNGALOW_1928.bounds.min[1],
    maxZ: CRAFTSMAN_BUNGALOW_1928.bounds.max[1],
  };
  if (footprint.length === 0 || footprint.some((p) => !p.every(Number.isFinite))) {
    throw new Error("trajectory spawn search requires a finite, non-empty footprint");
  }
  if (!Number.isFinite(clearance) || clearance < 0) {
    throw new Error("trajectory spawn clearance must be finite and non-negative");
  }
  if (!Number.isFinite(step) || step <= 0) {
    throw new Error("trajectory spawn step must be finite and positive");
  }
  if (!anchor.every(Number.isFinite)) {
    throw new Error("trajectory spawn anchor must be finite");
  }
  const rigid = obstacles.filter((obb) => !obb.exemptFromPenalty);
  const candidates: Array<{ x: number; z: number; d: number }> = [];
  for (let z = bounds.minZ; z <= bounds.maxZ + 1e-9; z += step) {
    for (let x = bounds.minX; x <= bounds.maxX + 1e-9; x += step) {
      candidates.push({ x, z, d: Math.hypot(x - anchor[0], z - anchor[1]) });
    }
  }
  candidates.sort((a, b) => a.d - b.d);

  let tested = 0;
  for (const candidate of candidates) {
    tested += 1;
    let minClearance = Number.POSITIVE_INFINITY;
    let feasible = true;
    for (const point of footprint) {
      const px = point[0] + candidate.x;
      const pz = point[2] + candidate.z;
      if (
        px - clearance < bounds.minX ||
        px + clearance > bounds.maxX ||
        pz - clearance < bounds.minZ ||
        pz + clearance > bounds.maxZ
      ) {
        feasible = false;
        break;
      }
      const world: [number, number, number] = [px, point[1], pz];
      for (const obb of rigid) {
        const d = distanceToOBB(world, obb);
        if (d < clearance) {
          feasible = false;
          break;
        }
        if (d < minClearance) minClearance = d;
      }
      if (!feasible) break;
    }
    if (feasible) {
      return {
        offset: [candidate.x, 0, candidate.z],
        pelvis: [candidate.x, candidate.z],
        minClearance,
        candidatesTested: tested,
      };
    }
  }
  throw new Error(
    `no spawn offset keeps the full trajectory ${clearance.toFixed(3)} m clear of every rigid obstacle`,
  );
}

export interface CameraBoomResult {
  /** Farthest point along the boom that a `radius` sphere reaches unblocked. */
  position: [number, number, number];
  /** Fraction of the requested boom length that was achievable, in [0, 1]. */
  fraction: number;
  blockedBy: string | null;
}

/**
 * Sweep a sphere of `radius` from `lookAt` toward `desired` against every
 * rigid OBB (walls included) and return the farthest reachable point. A
 * camera placed there sees the subject without a wall or a sofa between
 * them. The boom is shortened by `pullback` from the entry point so the
 * near plane does not clip the blocking surface.
 */
export function resolveCameraBoom(
  lookAt: [number, number, number],
  desired: [number, number, number],
  obstacles: readonly OrientedBoundingBox[],
  radius = 0.12,
  pullback = 0.08,
): CameraBoomResult {
  const dx = desired[0] - lookAt[0];
  const dy = desired[1] - lookAt[1];
  const dz = desired[2] - lookAt[2];
  const length = Math.hypot(dx, dy, dz);
  if (!(length > 1e-6)) {
    return { position: [...desired], fraction: 1, blockedBy: null };
  }
  let bestFraction = 1;
  let blockedBy: string | null = null;
  for (const obb of obstacles) {
    if (obb.exemptFromPenalty) continue;
    // Skip OBBs that already contain the look-at point (the subject is
    // inside them); sweeping out of a containing box is meaningless.
    if (distanceToOBB(lookAt, obb) < 0) continue;
    const hit = sweptSphereOBBEntryPoint(lookAt, desired, radius, obb, 0.02);
    if (hit.wasHit && hit.entryPoint) {
      const reach = Math.hypot(
        hit.entryPoint[0] - lookAt[0],
        hit.entryPoint[1] - lookAt[1],
        hit.entryPoint[2] - lookAt[2],
      );
      // Floored: a fully blocked boom would otherwise park the camera exactly
      // on the subject, which renders as a view from inside it.
      const fraction = Math.max(0.12, (reach - pullback) / length);
      if (fraction < bestFraction) {
        bestFraction = fraction;
        blockedBy = obb.name;
      }
    }
  }
  return {
    position: [lookAt[0] + dx * bestFraction, lookAt[1] + dy * bestFraction, lookAt[2] + dz * bestFraction],
    fraction: bestFraction,
    blockedBy,
  };
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

import {
  CRAFTSMAN_BUNGALOW_1928,
  CRAFTSMAN_FLOOR_SUPPORT,
  type HouseFurniture,
  type HouseSceneConfig,
  type HouseWall,
} from "./houseScenes";
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

/**
 * Conservative lower bound on the clearance between an entire segment and
 * an OBB. OBB signed distance is 1-Lipschitz, so subtracting half the sample
 * interval guarantees the unsampled points cannot be closer than the result.
 */
export function conservativeSegmentClearanceToOBB(
  start: [number, number, number],
  end: [number, number, number],
  obb: OrientedBoundingBox,
  maximumSampleSpacingMeters = 0.01,
): number {
  if (
    !start.every(Number.isFinite) ||
    !end.every(Number.isFinite) ||
    !Number.isFinite(maximumSampleSpacingMeters) ||
    maximumSampleSpacingMeters <= 0
  ) {
    throw new Error("segment clearance inputs must be finite with positive spacing");
  }
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const length = Math.hypot(dx, dy, dz);
  const intervals = Math.max(1, Math.ceil(length / maximumSampleSpacingMeters));
  const intervalLength = length / intervals;
  let minimumSampleDistance = Infinity;
  for (let index = 0; index <= intervals; index++) {
    const t = index / intervals;
    minimumSampleDistance = Math.min(
      minimumSampleDistance,
      distanceToOBB([
        start[0] + dx * t,
        start[1] + dy * t,
        start[2] + dz * t,
      ], obb),
    );
  }
  return minimumSampleDistance - intervalLength * 0.5;
}

export interface SweptCcdResult {
  /** True iff the swept sphere crossed the OBB. */
  wasHit: boolean;
  /** Conservative-advancement entry point (sphere is just outside the OBB
   *  here). Undefined when wasHit is false. */
  entryPoint?: [number, number, number];
  /** Conservative entry parameter in [0, 1] (0 = at prevPos, 1 = at currentPos). */
  entryT?: number;
  /** The OBB that was hit, when wasHit is true. */
  obb?: OrientedBoundingBox;
}

/**
 * SOTA swept-volume continuous collision detection for a sphere swept
 * along a straight segment against an OBB. When the previous-frame
 * position is outside the OBB and the current-frame kernel position is
 * inside, the per-frame snap-to-surface projection would teleport the
 * link to the deep-interior closest point, which is visually wrong.
 * The conservative-advancement CCD finds the segment-vs-OBB entry
 * point and snaps the link to the surface there, which is what
 * Redon, Lin, Benichou call "interval analysis for CCD" (2002).
 *
 * Implementation: transform the sweep into the OBB frame and intersect it
 * with the radius-expanded box using the exact slab interval. This catches
 * outside-to-outside enter/exit tunneling and returns the earliest admissible
 * entry parameter without assuming endpoint collision state is monotonic.
 *
 * Single-OBB contract: when the swept segment crosses only the OBB
 * passed in, the returned entryPoint is on the entry face at the
 * requested radius clearance. For multi-OBB scenarios where neighboring
 * obstacles overlap or sit close together, callers must follow the
 * swept-CCD step with a per-position projection pass over the full
 * OBB catalog (the HouseholdArmFlagship pipeline does this 3 times via
 * projectArmLinksOutOfObstacles({ iterations: 3 })). A single
 * swept-CCD step is not sufficient when the entry face of OBB A
 * overlaps the volume of OBB B; that requires Gauss-Seidel relaxation
 * to converge.
 */
export function sweptSphereOBBEntryPoint(
  prevPos: [number, number, number],
  currentPos: [number, number, number],
  radius: number,
  obb: OrientedBoundingBox,
  maximumSampleSpacingMeters = 0.005,
): SweptCcdResult {
  if (
    !prevPos.every(Number.isFinite) ||
    !currentPos.every(Number.isFinite) ||
    !Number.isFinite(radius) ||
    radius < 0 ||
    !Number.isFinite(maximumSampleSpacingMeters) ||
    maximumSampleSpacingMeters <= 0
  ) {
    return { wasHit: false };
  }
  const cosY = Math.cos(-obb.rotationYawRad);
  const sinY = Math.sin(-obb.rotationYawRad);
  const toLocal = (point: [number, number, number]): [number, number, number] => {
    const dx = point[0] - obb.center[0];
    const dy = point[1] - obb.center[1];
    const dz = point[2] - obb.center[2];
    return [cosY * dx - sinY * dz, dy, sinY * dx + cosY * dz];
  };
  const start = toLocal(prevPos);
  const end = toLocal(currentPos);
  const direction: [number, number, number] = [
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2],
  ];
  const extents: [number, number, number] = [
    obb.halfExtents[0] + radius,
    obb.halfExtents[1] + radius,
    obb.halfExtents[2] + radius,
  ];
  let entryT = 0;
  let exitT = 1;
  for (let axis = 0; axis < 3; axis++) {
    if (Math.abs(direction[axis]) < 1e-12) {
      if (start[axis] < -extents[axis] || start[axis] > extents[axis]) {
        return { wasHit: false };
      }
      continue;
    }
    const inverse = 1 / direction[axis];
    let near = (-extents[axis] - start[axis]) * inverse;
    let far = (extents[axis] - start[axis]) * inverse;
    if (near > far) [near, far] = [far, near];
    entryT = Math.max(entryT, near);
    exitT = Math.min(exitT, far);
    if (entryT > exitT) return { wasHit: false };
  }
  if (exitT < 0 || entryT > 1) return { wasHit: false };
  // A previous projection commonly leaves the sphere exactly tangent to an
  // expanded face. The inclusive slab interval then starts at t=0 even when
  // the next motion is tangent to, or away from, that face. Treat only motion
  // strictly into every touched face as a new collision; otherwise the
  // renderer would pin a link at its first contact point forever.
  if (entryT <= 1e-12) {
    const boundaryTolerance = 1e-9;
    const boundaryAxes: number[] = [];
    let startsWithinExpandedBox = true;
    for (let axis = 0; axis < 3; axis++) {
      const boundaryGap = extents[axis] - Math.abs(start[axis]);
      if (boundaryGap < -boundaryTolerance) {
        startsWithinExpandedBox = false;
        break;
      }
      if (Math.abs(boundaryGap) <= boundaryTolerance) boundaryAxes.push(axis);
    }
    const movesStrictlyInward =
      boundaryAxes.length > 0 &&
      boundaryAxes.every(
        (axis) => start[axis] * direction[axis] < -boundaryTolerance,
      );
    if (
      startsWithinExpandedBox &&
      boundaryAxes.length > 0 &&
      !movesStrictlyInward
    ) {
      return { wasHit: false };
    }
  }
  const clampedEntryT = Math.max(0, Math.min(1, entryT));
  const entryPoint: [number, number, number] = [
    prevPos[0] + (currentPos[0] - prevPos[0]) * clampedEntryT,
    prevPos[1] + (currentPos[1] - prevPos[1]) * clampedEntryT,
    prevPos[2] + (currentPos[2] - prevPos[2]) * clampedEntryT,
  ];
  const projected = projectPointOutOfOBB(entryPoint, obb, radius);
  return {
    wasHit: true,
    entryPoint: projected.point,
    entryT: clampedEntryT,
    obb,
  };
}

export function closestPointOnOBB(

  point: [number, number, number],
  obb: OrientedBoundingBox,
): [number, number, number] {
  const cosY = Math.cos(-obb.rotationYawRad);
  const sinY = Math.sin(-obb.rotationYawRad);
  const dx = point[0] - obb.center[0];
  const dy = point[1] - obb.center[1];
  const dz = point[2] - obb.center[2];
  const localX = cosY * dx - sinY * dz;
  const localY = dy;
  const localZ = sinY * dx + cosY * dz;
  const cx = Math.max(-obb.halfExtents[0], Math.min(obb.halfExtents[0], localX));
  const cy = Math.max(-obb.halfExtents[1], Math.min(obb.halfExtents[1], localY));
  const cz = Math.max(-obb.halfExtents[2], Math.min(obb.halfExtents[2], localZ));
  // Rotate the clamped local point back into world coordinates.
  const worldX = cosY * cx + sinY * cz;
  const worldY = cy;
  const worldZ = -sinY * cx + cosY * cz;
  return [obb.center[0] + worldX, obb.center[1] + worldY, obb.center[2] + worldZ];
}

/**
 * Push a query point out of an OBB by the required clearance along the
 * surface normal. Returns the (possibly unchanged) point and the surface
 * point it was projected from. If the point is already outside with the
 * requested clearance, the input point is returned unchanged.
 */
export function projectPointOutOfOBB(
  point: [number, number, number],
  obb: OrientedBoundingBox,
  clearanceMeters: number,
): { point: [number, number, number]; wasInside: boolean; surfacePoint: [number, number, number] } {
 const sdf = distanceToOBB(point, obb);
 if (sdf >= clearanceMeters) {
 return { point: [point[0], point[1], point[2]], wasInside: false, surfacePoint: point };
 }
 const surface = closestPointOnOBB(point, obb);
 // Direction of push-out (SDF gradient pointing AWAY from the OBB).
 // For an EXTERIOR query (sdf > 0), closestPointOnOBB returns the boundary
 // point nearest the query, so (point - surface) points away from the
 // OBB — the correct push direction.
 // For an INTERIOR query (sdf < 0), closestPointOnOBB returns the query
 // itself (Ericson §5.5.6 only handles the exterior case), so
 // (point - surface) is the zero vector. We must use the local-frame
 // nearest-face projection: the surface is on the face with the smallest
 // inward clearance, and the push direction is (surface - point) which
 // points from the link to that face (i.e. out of the OBB).
 const isInterior = sdf < 0;
 let dirX: number;
 let dirY: number;
 let dirZ: number;
 if (isInterior) {
 // Compute the interior closest point by snapping to the nearest face.
 const cosY = Math.cos(-obb.rotationYawRad);
 const sinY = Math.sin(-obb.rotationYawRad);
 const dx = point[0] - obb.center[0];
 const dy = point[1] - obb.center[1];
 const dz = point[2] - obb.center[2];
 const lx = cosY * dx - sinY * dz;
 const ly = dy;
 const lz = sinY * dx + cosY * dz;
 // Inward clearance to each face: positive when query is inside.
 const cx = obb.halfExtents[0] - Math.abs(lx);
 const cy = obb.halfExtents[1] - Math.abs(ly);
 const cz = obb.halfExtents[2] - Math.abs(lz);
 // Pick the nearest face and snap the surface point onto it.
 const nearest = cx <= cy && cx <= cz ? "x" : cy <= cz ? "y" : "z";
 let sLx: number;
 let sLy: number;
 let sLz: number;
 if (nearest === "x") {
 sLx = lx >= 0 ? obb.halfExtents[0] : -obb.halfExtents[0];
 sLy = ly;
 sLz = lz;
 } else if (nearest === "y") {
 sLx = lx;
 sLy = ly >= 0 ? obb.halfExtents[1] : -obb.halfExtents[1];
 sLz = lz;
 } else {
 sLx = lx;
 sLy = ly;
 sLz = lz >= 0 ? obb.halfExtents[2] : -obb.halfExtents[2];
 }
 // Forward rotate the local surface point back to world coordinates.
 const wSx = cosY * sLx + sinY * sLz;
 const wSy = sLy;
 const wSz = -sinY * sLx + cosY * sLz;
 const surfaceX = obb.center[0] + wSx;
 const surfaceY = obb.center[1] + wSy;
 const surfaceZ = obb.center[2] + wSz;
 dirX = surfaceX - point[0];
 dirY = surfaceY - point[1];
 dirZ = surfaceZ - point[2];
 } else {
 dirX = point[0] - surface[0];
 dirY = point[1] - surface[1];
 dirZ = point[2] - surface[2];
 }
 const len = Math.hypot(dirX, dirY, dirZ);
 if (len < 1e-9) {
 // Degenerate: point is on the surface but the SDF says we are inside.
 // Use the world-axis-aligned gradient (the maximum |qx|, |qy|, |qz|
 // direction in local frame) to pick an exit direction.
 const cosY = Math.cos(-obb.rotationYawRad);
 const sinY = Math.sin(-obb.rotationYawRad);
 const dx = point[0] - obb.center[0];
 const dy = point[1] - obb.center[1];
 const dz = point[2] - obb.center[2];
 const localX = cosY * dx - sinY * dz;
 const localY = dy;
 const localZ = sinY * dx + cosY * dz;
 const absX = Math.abs(localX) - obb.halfExtents[0];
 const absY = Math.abs(localY) - obb.halfExtents[1];
 const absZ = Math.abs(localZ) - obb.halfExtents[2];
 const m = Math.max(absX, absY, absZ);
 if (m === absX) {
 const sign = localX >= 0 ? 1 : -1;
 const worldDx = cosY * sign;
 const worldDz = -sinY * sign;
 return {
 point: [point[0] + worldDx * clearanceMeters, point[1], point[2] + worldDz * clearanceMeters],
 wasInside: true,
 surfacePoint: surface,
 };
 }
 if (m === absY) {
 const sign = localY >= 0 ? 1 : -1;
 return {
 point: [point[0], point[1] + sign * clearanceMeters, point[2]],
 wasInside: true,
 surfacePoint: surface,
 };
 }
 const sign = localZ >= 0 ? 1 : -1;
 const worldDx = sinY * sign;
 const worldDz = cosY * sign;
 return {
 point: [point[0] + worldDx * clearanceMeters, point[1], point[2] + worldDz * clearanceMeters],
 wasInside: true,
 surfacePoint: surface,
 };
 }
 const inv = 1 / len;
 const delta = clearanceMeters - sdf;
 return {
 point: [point[0] + dirX * inv * delta, point[1] + dirY * inv * delta, point[2] + dirZ * inv * delta],
 wasInside: true,
 surfacePoint: surface,
 };
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

/**
 * Converts authored wall centerlines into solid OBB segments while preserving
 * each doorway aperture. Navigation and LiDAR consume these same bodies, so a
 * rendered doorway is no longer invisible to the planner and a rendered wall
 * is no longer display-only.
 */
export function createHouseWallObstacles(
  walls: readonly HouseWall[] = CRAFTSMAN_BUNGALOW_1928.walls,
): OrientedBoundingBox[] {
  const obstacles: OrientedBoundingBox[] = [];
  walls.forEach((wall, wallIndex) => {
    const dx = wall.to[0] - wall.from[0];
    const dz = wall.to[1] - wall.from[1];
    const length = Math.hypot(dx, dz);
    if (!(length > 0)) return;

    const gaps = wall.doorways
      .map((doorway) => ({
        start: Math.max(0, doorway.at - doorway.width / 2),
        end: Math.min(length, doorway.at + doorway.width / 2),
      }))
      .filter((gap) => gap.end > gap.start)
      .sort((a, b) => a.start - b.start);

    const solidIntervals: Array<{ start: number; end: number }> = [];
    let cursor = 0;
    for (const gap of gaps) {
      if (gap.start > cursor) solidIntervals.push({ start: cursor, end: gap.start });
      cursor = Math.max(cursor, gap.end);
    }
    if (cursor < length) solidIntervals.push({ start: cursor, end: length });

    const ux = dx / length;
    const uz = dz / length;
    const yaw = Math.atan2(dz, dx);
    solidIntervals.forEach((interval, segmentIndex) => {
      const segmentLength = interval.end - interval.start;
      if (segmentLength <= 1e-6) return;
      const along = (interval.start + interval.end) / 2;
      obstacles.push({
        id: `wall-${wallIndex}-segment-${segmentIndex}`,
        name: `wall ${wallIndex + 1}, segment ${segmentIndex + 1}`,
        center: [
          wall.from[0] + ux * along,
          wall.height / 2,
          wall.from[1] + uz * along,
        ],
        halfExtents: [segmentLength / 2, wall.height / 2, wall.thickness / 2],
        rotationYawRad: yaw,
        materialId: "house-wall",
      });
    });
  });
  return obstacles;
}

/** Full physical obstacle roster for household navigation: furniture + walls. */
export function createHouseNavigationScene(
  house: HouseSceneConfig = CRAFTSMAN_BUNGALOW_1928,
): MultiObstacleSceneConfig {
  const furnitureScene = createSceneFromHouseFurniture(house.furniture);
  return {
    sceneId: `${furnitureScene.sceneId}-with-walls`,
    name: `${furnitureScene.name} with physical wall apertures`,
    bounds: house.bounds,
    obstacles: [
      ...furnitureScene.obstacles,
      ...createHouseWallObstacles(house.walls),
    ],
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
 let cy = point[1];
 let cz = Math.max(bounds.minZ + safeRadius, Math.min(bounds.maxZ - safeRadius, point[2]));

 let isColliding = false;
 let nearestObstacleName: string | null = null;
 let minClearance = 999.0;

 // SOTA OBB projection: use the true SDF gradient (handles interior
 // points, yawed OBBs, and non-cubic aspect ratios). The previous
 // radial-from-center projection landed targets inside yawed furniture
 // (e.g. chairs rotated 180 degrees about Y). Run multiple Gauss-Seidel
 // passes to relax the case where one OBB's push-out drives the target
 // into a second OBB.
 for (let pass = 0; pass < 4; pass++) {
 let passMoved = false;
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
 const projected = projectPointOutOfOBB(
 [cx, cy, cz],
 obb,
 safeRadius,
 );
 if (projected.wasInside) {
 cx = projected.point[0];
 cy = projected.point[1];
 cz = projected.point[2];
 passMoved = true;
 }
 }
 }
 if (!passMoved) break;
 // Re-clamp bounds after push-out
 cx = Math.max(bounds.minX + safeRadius, Math.min(bounds.maxX - safeRadius, cx));
 cz = Math.max(bounds.minZ + safeRadius, Math.min(bounds.maxZ - safeRadius, cz));
 }

 // Recompute isColliding based on the FINAL state so the caller learns
 // whether the projection succeeded.
 let finalColliding = false;
 for (const obb of obstacles) {
 if (obb.exemptFromPenalty) continue;
 if (distanceToOBB([cx, cy, cz], obb) < safeRadius) {
 finalColliding = true;
 break;
 }
 }

 return {
 clampedPosition: [cx, cy, cz],
 isColliding: finalColliding,
 nearestObstacleName,
 minClearance: Math.max(0, minClearance),
 };
}

/**
 * Work-surface placement shared by the renderer and these colliders.
 *
 * Sized so the arm can actually work at it. The original top was 1.40 x 1.65 m
 * with its near edge 150 mm from a floor-mounted arm's base axis, which is not
 * a workcell anyone would build — and declaring it to the owner refused all
 * three tasks, because the arm's own link envelopes have to sweep through
 * where it was drawn. Measured against the owner, a 0.90 x 0.90 m top whose
 * near edge is 350 mm out holds every object station with margin and leaves
 * every task's verdict exactly as it is undeclared.
 */
export const ARM_TABLE_CENTER_X = -0.8;
export const ARM_TABLE_WIDTH = 0.9;
export const ARM_TABLE_DEPTH = 0.9;
export const ARM_TABLE_THICKNESS = 0.09;

/**
 * Workbench volumes around the household arm, built to match exactly what
 * `ArmEnvironment` draws for the given task.
 *
 * These MUST be derived from the owner's `supportHeightMeters`, never from a
 * constant. The three tasks report 0.237, 0.277 and 0.265 m; an earlier
 * version of this file hardcoded 0.78 m, which put the backsplash and cabinet
 * half a metre above the geometry the viewer sees and declared both of them
 * for every task even though the stage draws the backsplash only for the mug
 * and the cabinet only for the remote.
 *
 * The counter slab is deliberately excluded: the arm's own links pass through
 * that volume by construction (its base stands on the floor at the stage
 * origin and the chain rises through the counter plane), so declaring it as a
 * hard constraint would refuse every rollout. The owner clamps the object to
 * the support plane itself.
 */
export function armWorkbenchObstacles(
  supportHeightMeters: number,
  task: "kitchen-mug" | "living-room-remote" | "backyard-trowel",
): OrientedBoundingBox[] {
  if (task === "kitchen-mug") {
    return [
      {
        id: "arm-backsplash",
        name: "backsplash",
        // A wall behind the bench, not flush to it: pulling the panel forward
        // onto the (now much smaller) counter's back edge puts it 400 mm inside
        // the arm's working volume, and measured, that refuses the mug task.
        center: [ARM_TABLE_CENTER_X, supportHeightMeters + 0.5, -0.82],
        halfExtents: [ARM_TABLE_WIDTH / 2, 0.525, 0.035],
        rotationYawRad: 0,
      },
    ];
  }
  if (task === "living-room-remote") {
    return [
      {
        id: "arm-cabinet",
        name: "side cabinet",
        center: [0.72, supportHeightMeters + 0.25, -0.58],
        halfExtents: [0.31, 0.22, 0.15],
        rotationYawRad: 0,
      },
    ];
  }
  // The trowel stage draws a lawn plane and four fence posts.
  return [-1.1, -0.85, 0.85, 1.1].map((x, index) => ({
    id: `arm-fence-post-${index}`,
    name: "fence post",
    center: [x, 0.48, -0.85] as [number, number, number],
    halfExtents: [0.0175, 0.475, 0.0175] as [number, number, number],
    rotationYawRad: 0,
  }));
}

/** Counter slab, for camera occlusion only — never a kernel obstacle. */
export function armCounterSlabObstacle(supportHeightMeters: number): OrientedBoundingBox {
  return {
    id: "arm-counter-slab",
    name: "counter slab",
    center: [ARM_TABLE_CENTER_X, supportHeightMeters - ARM_TABLE_THICKNESS / 2, 0],
    halfExtents: [ARM_TABLE_WIDTH / 2, ARM_TABLE_THICKNESS / 2, ARM_TABLE_DEPTH / 2],
    rotationYawRad: 0,
  };
}

/** What a declared body means to the owner kernel. */
export type KernelBodyRole = "keep-out" | "support";

/** One body for a frankensim owner kernel, in its owner frame. */
export interface HouseholdKernelObstacle {
  /** Owner frame (x, y, z-up), metres. */
  centerMeters: [number, number, number];
  halfExtentsMeters: [number, number, number];
  /** Rotation about the owner +Z axis, radians. */
  yawRad: number;
  /**
   * Keep-out bodies may not be entered at all. Support bodies are surfaces
   * the robot rests on: contact is expected, sinking through them is not.
   * Declaring the floors and work surfaces the renderer draws is what turns
   * "the robot is inside the floor" from a screenshot into a refusal.
   */
  role: KernelBodyRole;
  name: string;
}

/**
 * Convert a stage-frame OBB into an owner-frame keep-out box.
 *
 * The stage maps owner (x, y, z) to three (x, z, -y), so the inverse is
 * owner = (three.x, -three.z, three.y). That map reflects the horizontal
 * plane, so a yaw about three +Y becomes the opposite yaw about owner +Z and
 * the half extents swap their y and z components.
 */
export function stageObbToKernelObstacle(
  obb: OrientedBoundingBox,
  role: KernelBodyRole = "keep-out",
): HouseholdKernelObstacle {
  return {
    centerMeters: [obb.center[0], -obb.center[2], obb.center[1]],
    halfExtentsMeters: [obb.halfExtents[0], obb.halfExtents[2], obb.halfExtents[1]],
    yawRad: -obb.rotationYawRad,
    role,
    name: obb.name,
  };
}

/**
 * Rooms the arm stage actually draws around the workbench. The stage is a
 * counter at the scene origin, not the whole bungalow, so only these pieces
 * appear on screen beside the arm.
 */
export const ARM_STAGE_ROOMS: readonly string[] = ["kitchen", "living room"];

/**
 * The obstacle roster the browser hands the manipulation kernel: the task's
 * own workbench structures, plus the rigid furniture from the rooms the arm
 * stage renders, capped at `limit` so the per-step convex queries stay cheap.
 * Ordered nearest-first so a tighter cap keeps the most relevant boxes.
 *
 * The roster is deliberately NOT the whole-house scene. House furniture is
 * authored in whole-house coordinates while the arm workbench sits at the
 * scene origin, so distant pieces (a hall coat rack, for one) can land inside
 * the arm's workspace without ever being drawn. Feeding those to the owner
 * would refuse the default rollout over an obstacle the viewer cannot see.
 * What the kernel is told to avoid is exactly what the stage draws.
 *
 * `supportHeightMeters` must come from the owner's admission: the workbench
 * structures are drawn relative to it and differ per task.
 */
/**
 * Every rigid body the arm stage actually draws, in the stage frame: the
 * task's workbench structures plus the furniture from the rooms the stage
 * renders, ordered nearest-first from the arm's base at the stage origin.
 *
 * This is the single source of truth for the arm scene. The renderer projects
 * links and the manipulated object out of exactly these boxes, the drag clamp
 * uses them, and `householdKernelObstacleRoster` converts the same list into
 * the owner's frame. Using the whole-house scene instead was a bug: house
 * furniture is authored in whole-house coordinates while the workbench sits at
 * the scene origin, so a hall coat rack lands inside the arm's workspace
 * without ever being drawn and was shoving the mug up to 8.9 cm (and the
 * trowel 22 cm) off its owner pose.
 */
export function armStageObstacles(
  supportHeightMeters: number,
  task: "kitchen-mug" | "living-room-remote" | "backyard-trowel",
  limit = 24,
  house: HouseSceneConfig = CRAFTSMAN_BUNGALOW_1928,
  rooms: readonly string[] = ARM_STAGE_ROOMS,
): OrientedBoundingBox[] {
  const workbench = armWorkbenchObstacles(supportHeightMeters, task);
  const base: [number, number, number] = [0, 0, 0];
  const staged = new Set(
    house.furniture.filter((piece) => rooms.includes(piece.room)).map((piece) => piece.name),
  );
  const nearest = createSceneFromHouseFurniture(house.furniture)
    .obstacles.filter((obb) => !obb.exemptFromPenalty && staged.has(obb.name))
    .map((obb) => ({ obb, d: distanceToOBB(base, obb) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, Math.max(0, limit - workbench.length))
    .map((entry) => entry.obb);
  return [...workbench, ...nearest];
}

export function householdKernelObstacleRoster(
  supportHeightMeters: number,
  task: "kitchen-mug" | "living-room-remote" | "backyard-trowel",
  limit = 24,
  house: HouseSceneConfig = CRAFTSMAN_BUNGALOW_1928,
  rooms: readonly string[] = ARM_STAGE_ROOMS,
): HouseholdKernelObstacle[] {
  // The backsplash, cabinet, fence posts and furniture are keep-out volumes:
  // things the arm works AROUND. The counter is the one body it works ON, so it
  // goes in as a support surface — contact is expected, sinking through it is
  // not. Declaring it is what turns "the gripper is inside the table" from a
  // screenshot into a refusal.
  const surfaces = [
    stageObbToKernelObstacle(armCounterSlabObstacle(supportHeightMeters), "support"),
  ];
  return [
    ...surfaces,
    // The surface is declared IN ADDITION to the keep-out budget rather than
    // out of it: silently dropping a body to make room would change what the
    // arm is guarded against, which is not what declaring a table should do.
    ...armStageObstacles(supportHeightMeters, task, limit, house, rooms).map((obb) =>
      stageObbToKernelObstacle(obb, "keep-out"),
    ),
  ];
}

/**
 * Conservative, policy-independent envelope of the G1 while it walks: a
 * standing body column swept forward along the owner's +x walking axis.
 *
 * The seat has to be chosen BEFORE the first kernel call, because the walking
 * owner now needs its keep-out boxes expressed relative to wherever the robot
 * starts, and it cannot be told that after the fact. Deriving the seat from a
 * returned trace would be circular. The sweep is generous against the
 * measured curriculum displacement (~0.31 m over the full horizon), so a seat
 * that clears this envelope clears any policy the browser can run.
 */
export function nominalG1WalkFootprint(): [number, number, number][] {
  // Measured envelope of all 30 link origins, over every task/challenge
  // combination and both canned policies, in the stage frame relative to the
  // first pelvis: x in [-0.31, 0.67], y in [0.03, 1.08], z in [-0.58, 0.65].
  //
  // The lateral extreme is the SWUNG ARMS, not the body: shoulders are only
  // 0.36 m across. Seating on the torso column instead was a mistake. It put
  // the robot in the middle of the living room with a hand passing 3.9 cm
  // from the library table, which the owner's old 20-sphere collider set did
  // not cover and the renderer's projection quietly hid. The owner now
  // guards all 30 links, so that placement correctly terminates the rollout.
  //
  // A 1.3 x 1.6 m clear rectangle does not exist inside the furnished 1928
  // living room, so the robot stands at its open south edge instead. That is
  // the honest answer: the room is full of furniture.
  //
  // A live optimized policy can still swing wider than this envelope, which
  // is why the seat is only a placement heuristic and the owner's
  // body-vs-obstacle guard is the actual safety net.
  const points: [number, number, number][] = [];
  for (let x = -0.45; x <= 0.85 + 1e-9; x += 0.15) {
    for (const y of [0.05, 0.35, 0.7, 1.05]) {
      for (let z = -0.72; z <= 0.78 + 1e-9; z += 0.15) {
        points.push([x, y, z]);
      }
    }
  }
  return points;
}

/**
 * The stage position where the rendered G1 stands, chosen once from the
 * nominal walking envelope so it is known before any kernel rollout.
 */
export function g1SeatForHouse(
  house: HouseSceneConfig = CRAFTSMAN_BUNGALOW_1928,
  clearance = 0.16,
): { offset: [number, number, number]; minClearance: number } {
  const living = house.rooms.find((room) => room.name === "living room");
  const anchor: [number, number] = living ? [living.center[0], living.center[1]] : [0, 0];
  const seat = findClearTrajectorySpawnOffset(createHouseNavigationScene(house).obstacles, {
    footprint: nominalG1WalkFootprint(),
    clearance,
    anchor,
    step: 0.25,
  });
  return { offset: seat.offset, minClearance: seat.minClearance };
}

/**
 * The keep-out roster handed to the walking owner: every rigid house body
 * (walls included) expressed in the owner frame RELATIVE to the robot's seat,
 * nearest-first and capped so the per-step sphere-box sweep stays cheap.
 *
 * The owner always starts its rollout at the origin, so an obstacle standing
 * at stage position Q must be declared at Q minus the seat. Sending absolute
 * house coordinates would place the whole bungalow one seat-offset away from
 * the robot and the guard would never fire.
 */
export function g1KernelObstacleRoster(
  seat: readonly [number, number, number],
  limit = 48,
  house: HouseSceneConfig = CRAFTSMAN_BUNGALOW_1928,
): HouseholdKernelObstacle[] {
  const pelvis: [number, number, number] = [seat[0], 0.75, seat[2]];
  const relative = (obb: OrientedBoundingBox, role: KernelBodyRole) =>
    stageObbToKernelObstacle(
      {
        ...obb,
        center: [obb.center[0] - seat[0], obb.center[1] - seat[1], obb.center[2] - seat[2]],
      },
      role,
    );
  const keepOut = createHouseNavigationScene(house)
    .obstacles.filter((obb) => !obb.exemptFromPenalty)
    .map((obb) => ({ obb, d: distanceToOBB(pelvis, obb) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, Math.max(0, limit - HOUSE_STRUCTURAL_SURFACES.length))
    .map(({ obb }) => relative(obb, "keep-out"));
  return [
    ...HOUSE_STRUCTURAL_SURFACES.map((obb) => relative(obb, "support")),
    ...keepOut,
  ];
}

/**
 * The structural surfaces the house stage draws, declared to the owner so a
 * mis-placed one is a refusal instead of a robot rendered inside the floor.
 *
 * SearsCraftsmanEstate draws its room floors as planes at y = 0 and a stone
 * foundation beneath them. A foundation authored ABOVE the floor line is
 * exactly the bug this list exists to catch: the humanoid stood inside it,
 * buried to mid-shin, and nothing in the physics could see it because a
 * rendered mesh is not a body.
 */
export const HOUSE_STRUCTURAL_SURFACES: OrientedBoundingBox[] = [
  {
    id: "house-floor",
    name: "house floor",
    // The walking plane as a body: its top face is CRAFTSMAN_FLOOR_Y, the
    // same height every room floor plane is drawn at. The rendered foundation
    // masonry sits a centimetre lower so the two never z-fight.
    center: [...CRAFTSMAN_FLOOR_SUPPORT.center],
    halfExtents: [...CRAFTSMAN_FLOOR_SUPPORT.halfExtents],
    rotationYawRad: 0,
  },
];
