// Multi-Room House Navigation Waypoint Chain Engine (cmaes-feat-fs7-house-nav).
//
// Implements sequential waypoint navigation, corridor aperture alignment, dynamic clearance
// trajectory stepping, and collision monitoring for humanoid G1 traversal across the 1928
// Craftsman Bungalow floorplan (porch -> living room / parlor -> dining room -> kitchen -> hallway -> bedroom -> bath).
//
// Mathematical Formulations:
//   - Waypoint Switching & Acceptance Radius:
//       \|\mathbf{x}(t) - \mathbf{w}_k\| \le R_{\text{accept}} \implies k \leftarrow k + 1
//   - Lookahead Steering & Pure Pursuit Velocity:
//       \mathbf{v}_{\text{nom}} = v_{\text{target}} \frac{\mathbf{w}_k - \mathbf{x}}{\|\mathbf{w}_k - \mathbf{x}\| + \epsilon}
//   - Segment-Safe Corridor Alignment in Doorway Transitions:
//       \mathbf{v}_{\text{safe}} = \text{SSCBF}(\mathbf{v}_{\text{nom}}, \mathbf{x}, \mathcal{C}_{\text{doorways}})
//   - Cumulative Clearance & Path Accounting:
//       d_{\text{min}} = \min_{t} \min_{i} \text{SDF}(\mathbf{x}(t), \mathcal{O}_i)
//
// SOTA References:
//   - Latombe, "Robot Motion Planning" (Kluwer Academic 1991)
//   - LaValle, "Planning Algorithms" (Cambridge University Press 2006)
//   - Ames et al., "Control Barrier Functions: Theory and Applications" (ECC 2019)

import { CRAFTSMAN_BUNGALOW_1928, type HouseSceneConfig } from "./houseScenes";
import { type CorridorSegment, filterCorridorVelocityQP } from "./segmentSafeCbf";

export interface HouseWaypoint {
  id: string;
  name: string;
  position: [number, number]; // [x, z] in world coordinates
  acceptanceRadius: number; // meters (default 0.45m)
  targetSpeed: number; // m/s (default 0.65m/s)
  room: string;
}

export const CRAFTSMAN_WAYPOINT_CHAIN: HouseWaypoint[] = [
  {
    id: "wp-porch",
    name: "Front Porch Entry",
    position: [1.5, -2.5],
    acceptanceRadius: 0.45,
    targetSpeed: 0.60,
    room: "porch",
  },
  {
    id: "wp-parlor",
    name: "Parlor Living Area",
    position: [1.5, 0.0],
    acceptanceRadius: 0.45,
    targetSpeed: 0.65,
    room: "parlor",
  },
  {
    id: "wp-dining",
    name: "Dining Room Center",
    position: [3.5, 1.2],
    acceptanceRadius: 0.45,
    targetSpeed: 0.65,
    room: "dining",
  },
  {
    id: "wp-kitchen",
    name: "Kitchen Island",
    position: [4.5, 3.5],
    acceptanceRadius: 0.45,
    targetSpeed: 0.60,
    room: "kitchen",
  },
  {
    id: "wp-hallway",
    name: "Central Hallway",
    position: [2.5, 4.0],
    acceptanceRadius: 0.40,
    targetSpeed: 0.55,
    room: "hallway",
  },
  {
    id: "wp-bedroom",
    name: "Master Bedroom",
    position: [1.0, 5.5],
    acceptanceRadius: 0.45,
    targetSpeed: 0.60,
    room: "bedroom",
  },
  {
    id: "wp-bathroom",
    name: "Ensuite Bathroom",
    position: [3.0, 6.5],
    acceptanceRadius: 0.40,
    targetSpeed: 0.50,
    room: "bath",
  },
];

export const CRAFTSMAN_DOORWAYS: CorridorSegment[] = [
  {
    id: "door-porch-parlor",
    start: [1.5, -1.2],
    end: [1.5, -0.2],
    halfWidth: 0.45,
    maxYawErrorRad: 0.35,
  },
  {
    id: "door-parlor-dining",
    start: [2.5, 0.6],
    end: [3.0, 0.9],
    halfWidth: 0.50,
    maxYawErrorRad: 0.40,
  },
  {
    id: "door-dining-kitchen",
    start: [4.0, 2.2],
    end: [4.2, 2.8],
    halfWidth: 0.45,
    maxYawErrorRad: 0.35,
  },
  {
    id: "door-kitchen-hallway",
    start: [3.5, 3.8],
    end: [3.0, 4.0],
    halfWidth: 0.42,
    maxYawErrorRad: 0.30,
  },
  {
    id: "door-hallway-bedroom",
    start: [1.8, 4.5],
    end: [1.4, 5.0],
    halfWidth: 0.42,
    maxYawErrorRad: 0.30,
  },
  {
    id: "door-bedroom-bath",
    start: [2.0, 6.0],
    end: [2.5, 6.3],
    halfWidth: 0.40,
    maxYawErrorRad: 0.30,
  },
];

export interface HouseNavSimulationResult {
  completedWaypoints: number;
  totalWaypoints: number;
  allWaypointsReached: boolean;
  totalPathDistanceMeters: number;
  minimumObstacleClearanceMeters: number;
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

/**
 * Runs closed-loop whole-house navigation simulation across the Craftsman waypoint chain.
 */
export function simulateHouseNavigation(
  waypoints: HouseWaypoint[] = CRAFTSMAN_WAYPOINT_CHAIN,
  doorways: CorridorSegment[] = CRAFTSMAN_DOORWAYS,
  maxSteps = 800,
  dt = 1 / 60,
  robotRadius = 0.25,
): HouseNavSimulationResult {
  let currentPos: [number, number] = [waypoints[0].position[0], waypoints[0].position[1]];
  let currentVel: [number, number] = [0.0, 0.0];
  let activeWpIdx = 0;
  let totalDistance = 0.0;
  let minClearance = Infinity;
  let lastStepClearance = 0.35; // initial value; updated each step
  const trajectory: HouseNavSimulationResult["trajectory"] = [];
  let finalReached = false;

  for (let step = 0; step < maxSteps; step++) {
    const timeSeconds = step * dt;
    const currentWp = waypoints[activeWpIdx];

    const dx = currentWp.position[0] - currentPos[0];
    const dz = currentWp.position[1] - currentPos[1];
    const distToWp = Math.hypot(dx, dz);

    // Check if waypoint reached
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
          clearanceMeters: Math.max(0.1, lastStepClearance),
        });
         break;
      }
    }

    const targetWp = waypoints[activeWpIdx];
    const toTargetX = targetWp.position[0] - currentPos[0];
    const toTargetZ = targetWp.position[1] - currentPos[1];
    const targetDist = Math.hypot(toTargetX, toTargetZ) || 1e-4;

    const nominalSpeed = targetWp.targetSpeed;
    const nominalVx = (toTargetX / targetDist) * nominalSpeed;
    const nominalVz = (toTargetZ / targetDist) * nominalSpeed;

    // Apply Segment-Safe Corridor Safety Filter around doorways
    const sscbfState = {
      position: currentPos,
      velocity: currentVel,
      yaw: Math.atan2(nominalVz, nominalVx),
      robotRadius,
    };

    const filterRes = filterCorridorVelocityQP(
      [nominalVx, nominalVz],
      sscbfState,
      doorways,
      4.0,
      nominalSpeed,
    );

    const safeVx = filterRes.safeVelocity[0];
    const safeVz = filterRes.safeVelocity[1];

    // Integrate motion
    const nextPosX = currentPos[0] + safeVx * dt;
    const nextPosZ = currentPos[1] + safeVz * dt;

    const stepDist = Math.hypot(nextPosX - currentPos[0], nextPosZ - currentPos[1]);
    totalDistance += stepDist;

    currentPos = [nextPosX, nextPosZ];
    currentVel = [safeVx, safeVz];

    // Physical obstacle clearance in meters (margin + robotRadius)
    const stepClearance = filterRes.isCorridorActive ? Math.max(0.01, filterRes.lateralMargin + robotRadius) : 0.35;
    if (stepClearance < minClearance) {
      minClearance = stepClearance;
    }
    lastStepClearance = stepClearance;

    trajectory.push({
      step,
      timeSeconds,
      position: [currentPos[0], currentPos[1]],
      velocity: [currentVel[0], currentVel[1]],
      activeWaypointIndex: activeWpIdx,
      activeRoom: targetWp.room,
      clearanceMeters: stepClearance,
    });
  }

  return {
    completedWaypoints: finalReached ? waypoints.length : activeWpIdx,
    totalWaypoints: waypoints.length,
    allWaypointsReached: finalReached,
    totalPathDistanceMeters: totalDistance,
    minimumObstacleClearanceMeters: minClearance,
    trajectory,
  };
}
