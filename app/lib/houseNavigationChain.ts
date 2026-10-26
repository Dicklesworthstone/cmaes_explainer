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

import { sdfHeightfield } from "./analyticSdf";
import {
  checkDecorTipping,
  createDecorObject,
  DEFAULT_SILHOUETTE_PROFILES,
  evaluateSocialCbf,
  evaluateSocialPotential,
  filterSocialVelocityCbf,
  type SilhouetteAgent,
  stepSilhouetteAgent,
} from "./decorAndSocialObstacles";
import {
  ARM_STAGE_ROOMS,
  CRAFTSMAN_G1_CHALLENGE_WAYPOINTS,
  createHouseWallObstacles,
  createSceneFromHouseFurniture,
  enclosingSpawnRadius,
  evaluateHouseholdObjectiveWithFurniture,
  findClearSpawnPosition,
  isSphereClearOfRigidObstacles,
  nominalG1WalkFootprint,
  queryMultiObstacleScene,
  simulateG1HouseNavigationChallenge,
  stageObbToKernelObstacle,
  sweptSphereOBBEntryPoint,
} from "./houseMultiObstacleKernel";
import { CRAFTSMAN_BUNGALOW_1928, type HouseSceneConfig } from "./houseScenes";
import { DEFAULT_COSTMAP_CONFIG, LearnedCostmapEngine } from "./learnedCostmap";
import {
  computeAdaptiveSafetyMargin,
  DEFAULT_MARGIN_CONFIG,
  getFragilityMultiplier,
} from "./riskAwareMargin";
import {
  buildRecoveryConstraintsFromObb,
  DEFAULT_RECOVERY_CONFIG,
  type RecoveryState,
  SafetyFilterRecoveryManager,
} from "./safetyFilterRecovery";
import {
  type CorridorSegment,
  evaluateSscbfBarrier,
  filterCorridorVelocityQP,
  projectPointOntoSegment,
} from "./segmentSafeCbf";

export interface HouseWaypoint {
  id: string;
  name: string;
  position: [number, number]; // [x, z] in world coordinates
  acceptanceRadius: number; // meters (default 0.40m)
  targetSpeed: number; // m/s (default 0.65m/s)
  room: string;
}

export const CRAFTSMAN_WAYPOINT_CHAIN: HouseWaypoint[] = [
  {
    id: "wp-porch",
    name: "Front Porch Entry",
    position: [0.35, 4.82],
    acceptanceRadius: 0.4,
    targetSpeed: 0.6,
    room: "porch",
  },
  {
    id: "wp-parlor",
    name: "Parlor Living Area",
    position: [0.35, 2.5],
    acceptanceRadius: 0.4,
    targetSpeed: 0.65,
    room: "parlor",
  },
  {
    id: "wp-dining",
    name: "Dining Room Center",
    position: [0.12, -0.08],
    acceptanceRadius: 0.18,
    targetSpeed: 0.65,
    room: "dining",
  },
  {
    id: "wp-kitchen",
    name: "Kitchen Island",
    position: [1.16, -0.05],
    acceptanceRadius: 0.35,
    targetSpeed: 0.6,
    room: "kitchen",
  },
  {
    id: "wp-hallway",
    name: "Central Hallway",
    position: [-2.45, -0.05],
    acceptanceRadius: 0.4,
    targetSpeed: 0.55,
    room: "hallway",
  },
  {
    id: "wp-bedroom",
    name: "Master Bedroom",
    position: [-1.55, -1.95],
    acceptanceRadius: 0.4,
    targetSpeed: 0.6,
    room: "bedroom",
  },
  {
    id: "wp-bathroom",
    name: "Ensuite Bathroom",
    position: [1.0, -2.5],
    acceptanceRadius: 0.4,
    targetSpeed: 0.5,
    room: "bath",
  },
];

export const CRAFTSMAN_DOORWAYS: CorridorSegment[] = [
  {
    id: "door-porch-parlor",
    start: [0.35, 4.2],
    end: [0.35, 3.2],
    halfWidth: 0.45,
    maxYawErrorRad: 0.35,
  },
  {
    id: "door-parlor-dining",
    start: [0.27, 1.5],
    end: [0.18, 0.5],
    halfWidth: 0.5,
    maxYawErrorRad: 0.4,
  },
  {
    id: "door-dining-kitchen",
    start: [0.45, -0.06],
    end: [0.8, -0.05],
    halfWidth: 0.45,
    maxYawErrorRad: 0.35,
  },
  {
    id: "door-kitchen-hallway",
    start: [0.1, -0.05],
    end: [-0.8, -0.05],
    halfWidth: 0.42,
    maxYawErrorRad: 0.3,
  },
  {
    id: "door-hallway-bedroom",
    start: [-1.85, -0.81],
    end: [-1.7, -1.38],
    halfWidth: 0.42,
    maxYawErrorRad: 0.3,
  },
  {
    id: "door-bedroom-bath",
    start: [-0.5, -2.02],
    end: [0.2, -2.24],
    halfWidth: 0.4,
    maxYawErrorRad: 0.3,
  },
];

export interface HouseNavEpisodeCheckpoint {
  schemaVersion: 1;
  step: number;
  simulatedPhysicalSeconds: number;
  position: [number, number];
  velocity: [number, number];
  activeWaypointIndex: number;
  totalPathDistanceMeters: number;
  minimumObstacleClearanceMeters: number;
  lastStepClearanceMeters: number;
  allWaypointsReached: boolean;
}

export interface HouseNavSimulationOptions {
  scene?: HouseSceneConfig;
  resumeFrom?: HouseNavEpisodeCheckpoint;
}

export interface HouseNavSimulationResult {
  completedWaypoints: number;
  totalWaypoints: number;
  allWaypointsReached: boolean;
  totalPathDistanceMeters: number;
  minimumObstacleClearanceMeters: number;
  simulatedPhysicalSeconds: number;
  collisionOccurred: boolean;
  checkpoint: HouseNavEpisodeCheckpoint;
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
 * Evaluates true signed clearances against the physical furniture OBB scene and doorway
 * corridors (no positive clamping of negative clearances) and supports state-continuous
 * episode checkpointing and continuation.
 */
export function simulateHouseNavigation(
  waypoints: HouseWaypoint[] = CRAFTSMAN_WAYPOINT_CHAIN,
  doorways: CorridorSegment[] = CRAFTSMAN_DOORWAYS,
  maxSteps = 800,
  dt = 1 / 60,
  robotRadius = 0.25,
  options: HouseNavSimulationOptions = {},
): HouseNavSimulationResult {
  const houseScene = options.scene ?? CRAFTSMAN_BUNGALOW_1928;
  const obstacleScene = createSceneFromHouseFurniture(houseScene.furniture);
  const resume = options.resumeFrom;

  let currentPos: [number, number] = resume
    ? [resume.position[0], resume.position[1]]
    : [waypoints[0].position[0], waypoints[0].position[1]];
  let currentVel: [number, number] = resume ? [resume.velocity[0], resume.velocity[1]] : [0.0, 0.0];
  let activeWpIdx = resume ? resume.activeWaypointIndex : 0;
  let totalDistance = resume ? resume.totalPathDistanceMeters : 0.0;
  let minClearance = resume ? resume.minimumObstacleClearanceMeters : Infinity;

  const initialQuery = queryMultiObstacleScene(
    { position: [currentPos[0], 0.5, currentPos[1]], robotRadius, safetyMargin: 0.04 },
    obstacleScene,
  );
  let lastStepClearance = resume
    ? resume.lastStepClearanceMeters
    : initialQuery.minimumClearanceMeters;
  if (!resume && lastStepClearance < minClearance) {
    minClearance = lastStepClearance;
  }

  const startStep = resume ? resume.step : 0;
  const trajectory: HouseNavSimulationResult["trajectory"] = [];
  let finalReached = resume ? resume.allWaypointsReached : false;
  let nextStepIndex = startStep;

  for (let localStep = 0; localStep < maxSteps; localStep++) {
    if (finalReached) break;
    const step = startStep + localStep;
    nextStepIndex = step + 1;
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
          clearanceMeters: lastStepClearance,
        });
        currentVel = [0, 0];
        nextStepIndex = step;
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

    let safeVx = filterRes.safeVelocity[0];
    let safeVz = filterRes.safeVelocity[1];

    // Query pre-step furniture OBB clearance for repulsive steering
    const preQuery = queryMultiObstacleScene(
      { position: [currentPos[0], 0.5, currentPos[1]], robotRadius, safetyMargin: 0.04 },
      obstacleScene,
    );
    if (preQuery.minimumClearanceMeters < 0.22 && !filterRes.isCorridorActive) {
      const proximity = Math.max(0.0, (0.22 - preQuery.minimumClearanceMeters) / 0.22);
      safeVx += preQuery.gradientVector[0] * 0.25 * proximity;
      safeVz += preQuery.gradientVector[2] * 0.25 * proximity;
    }

    // Integrate motion
    const nextPosX = currentPos[0] + safeVx * dt;
    const nextPosZ = currentPos[1] + safeVz * dt;

    const stepDist = Math.hypot(nextPosX - currentPos[0], nextPosZ - currentPos[1]);
    totalDistance += stepDist;

    currentPos = [nextPosX, nextPosZ];
    currentVel = [safeVx, safeVz];

    // True signed physical obstacle clearance in meters against furniture OBBs and doorway jambs
    const postQuery = queryMultiObstacleScene(
      { position: [currentPos[0], 0.5, currentPos[1]], robotRadius, safetyMargin: 0.04 },
      obstacleScene,
    );
    const stepClearance = filterRes.isCorridorActive
      ? Math.min(postQuery.minimumClearanceMeters, filterRes.lateralMargin)
      : postQuery.minimumClearanceMeters;

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

  const simulatedPhysicalSeconds = nextStepIndex * dt;
  const checkpoint: HouseNavEpisodeCheckpoint = {
    schemaVersion: 1,
    step: nextStepIndex,
    simulatedPhysicalSeconds,
    position: [currentPos[0], currentPos[1]],
    velocity: [currentVel[0], currentVel[1]],
    activeWaypointIndex: activeWpIdx,
    totalPathDistanceMeters: totalDistance,
    minimumObstacleClearanceMeters: minClearance,
    lastStepClearanceMeters: lastStepClearance,
    allWaypointsReached: finalReached,
  };

  return {
    completedWaypoints: finalReached ? waypoints.length : activeWpIdx,
    totalWaypoints: waypoints.length,
    allWaypointsReached: finalReached,
    totalPathDistanceMeters: totalDistance,
    minimumObstacleClearanceMeters: minClearance,
    simulatedPhysicalSeconds,
    collisionOccurred: minClearance < 0.0,
    checkpoint,
    trajectory,
  };
}

/**
 * Executes a multi-segment house navigation episode by splitting execution into
 * fixed `segmentSteps` chunks and resuming from the exact episode checkpoint at
 * each boundary without resetting position, velocity, active waypoint, or clearance.
 */
export function runSegmentedHouseNavigation(
  waypoints: HouseWaypoint[] = CRAFTSMAN_WAYPOINT_CHAIN,
  doorways: CorridorSegment[] = CRAFTSMAN_DOORWAYS,
  segmentSteps = 200,
  totalMaxSteps = 2500,
  dt = 1 / 60,
  robotRadius = 0.25,
  scene: HouseSceneConfig = CRAFTSMAN_BUNGALOW_1928,
): HouseNavSimulationResult {
  const combinedTrajectory: HouseNavSimulationResult["trajectory"] = [];
  let checkpoint: HouseNavEpisodeCheckpoint | undefined;
  let lastResult: HouseNavSimulationResult | null = null;
  let stepsRemaining = totalMaxSteps;

  while (stepsRemaining > 0) {
    const chunkSteps = Math.min(segmentSteps, stepsRemaining);
    const res = simulateHouseNavigation(waypoints, doorways, chunkSteps, dt, robotRadius, {
      scene,
      resumeFrom: checkpoint,
    });
    combinedTrajectory.push(...res.trajectory);
    checkpoint = res.checkpoint;
    lastResult = res;
    stepsRemaining -= chunkSteps;
    if (res.allWaypointsReached) {
      break;
    }
  }

  if (!lastResult) {
    return simulateHouseNavigation(waypoints, doorways, 0, dt, robotRadius, { scene });
  }

  return {
    ...lastResult,
    trajectory: combinedTrajectory,
  };
}

export interface HouseNavigationSafetyAndCostmapDiagnostic {
  recoveryState: RecoveryState;
  safeVelocity: [number, number];
  maxViolationSlack: number;
  socialPotential: number;
  socialGradient: [number, number];
  socialCbf: {
    hSocial: number;
    isSafe: boolean;
    filteredVelocity: [number, number];
    interventionMagnitude: number;
  };
  g1ChallengePreview: {
    waypointCount: number;
    clearSpawnPosition: [number, number, number];
    sweptCcdWasHit: boolean;
    shortRolloutDistanceMeters: number;
    shortRolloutMinClearanceMeters: number;
  };
  householdMultiObstacle: {
    wallObstacleCount: number;
    enclosingRadiusMeters: number;
    spawnIsClear: boolean;
    armStageRoomCount: number;
    kernelObstacleRole: string;
    objectiveScore: number;
    recoveryConstraintCount: number;
    sscbfH: number;
    segmentProjectionT: number;
    riskAwareMarginMeters: number;
    fragilityMultiplier: number;
    fragilityRiskScore: number;
  };
  decorTippingCheck: {
    willTip: boolean;
    appliedTorqueNm: number;
    tippingThresholdNm: number;
  };
  learnedCostmap: {
    parameterCount: number;
    neuralClearanceValue: number;
    neuralGradient: [number, number];
  };
  indoorOutdoorCampaigns: {
    curriculumHorizonSteps: number;
    shortGaitThreeSeedDistancesM: [number, number, number];
    shortGaitThreeSeedMeanSpeedsMps: [number, number, number];
    indoorMinClearanceMeters: number;
    blockedDoorwayMinClearanceMeters: number;
    blockedDoorwayInfeasible: boolean;
    outdoorPorchFlatSdfM: number;
    outdoorGardenSlopedSdfM: number;
    outdoorPlanterNominalClearanceM: number;
    outdoorPlanterShiftedClearanceM: number;
  };
}

const SHARED_HOUSE_COSTMAP = new LearnedCostmapEngine({
  ...DEFAULT_COSTMAP_CONFIG,
  fourierBands: 4,
  hiddenDim: 32,
  seed: 1928,
});

/**
 * Evaluates 3-tier CBF safety filter recovery, Helbing-Molnar anisotropic social force potential,
 * decor tipping torque stability, and Fourier-feature learned clearance costmap surrogate for
 * a robot pose in the Craftsman house.
 */
export function evaluateHouseNavigationSafetyAndCostmap(
  position: [number, number] = [0.35, 2.5],
  velocity: [number, number] = [0.4, -0.5],
  nominalControl: [number, number] = [0.5, -0.5],
  scene: HouseSceneConfig = CRAFTSMAN_BUNGALOW_1928,
): HouseNavigationSafetyAndCostmapDiagnostic {
  const obstacleScene = createSceneFromHouseFurniture(scene.furniture);
  const query = queryMultiObstacleScene(
    { position: [position[0], 0.5, position[1]], robotRadius: 0.25, safetyMargin: 0.04 },
    obstacleScene,
  );

  const recoveryMgr = new SafetyFilterRecoveryManager();
  recoveryMgr.recordSafeState(
    [position[0], 0.5, position[1]],
    [velocity[0], 0, velocity[1]],
    Math.max(0.08, query.minimumClearanceMeters),
    0.0,
  );
  const recoveryRes = recoveryMgr.filterOrRecover(
    [nominalControl[0], 0, nominalControl[1]],
    [position[0], 0.5, position[1]],
    [velocity[0], 0, velocity[1]],
    [
      {
        id: "nearest-furniture-obb",
        hValue: query.minimumClearanceMeters,
        gradient: query.gradientVector,
        gamma: 5.0,
      },
    ],
  );

  const parlorPedestrianRaw: SilhouetteAgent = {
    id: "parlor-occupant",
    position: [0.85, 2.1],
    ...DEFAULT_SILHOUETTE_PROFILES["pedestrian-standing"],
  };
  const parlorPedestrian = stepSilhouetteAgent(parlorPedestrianRaw, 1 / 60);
  const social = evaluateSocialPotential(position, parlorPedestrian);
  const socialCbfEval = evaluateSocialCbf(position, velocity, parlorPedestrian);
  const socialFilterRes = filterSocialVelocityCbf(velocity, position, [parlorPedestrian]);

  const clearSpawnPosition = findClearSpawnPosition(obstacleScene.obstacles, 0.28);
  const firstObb = obstacleScene.obstacles[0];
  const sweptCcd = firstObb
    ? sweptSphereOBBEntryPoint(
        [position[0], 0.5, position[1]],
        [position[0] + velocity[0] * 0.2, 0.5, position[1] + velocity[1] * 0.2],
        0.25,
        firstObb,
      )
    : { wasHit: false };
  const g1ChallengeShort = simulateG1HouseNavigationChallenge(obstacleScene, {
    waypoints: CRAFTSMAN_G1_CHALLENGE_WAYPOINTS,
    maxDurationSeconds: 1.5,
    dt: 1 / 30,
  });

  const wallObstacles = createHouseWallObstacles(scene.walls);
  const g1Footprint = nominalG1WalkFootprint();
  const enclosingRadiusMeters = enclosingSpawnRadius([0, 0.5, 0], g1Footprint, 0.02, 0.25);
  const spawnIsClear = isSphereClearOfRigidObstacles(
    clearSpawnPosition,
    0.25,
    obstacleScene.obstacles,
  );
  const kernelObs = firstObb
    ? stageObbToKernelObstacle(firstObb, "keep-out")
    : { role: "keep-out" };
  const objRes = evaluateHouseholdObjectiveWithFurniture(
    [
      [position[0], 0.5, position[1]],
      [position[0] + velocity[0] * 0.2, 0.5, position[1] + velocity[1] * 0.2],
    ],
    [
      [velocity[0], 0, velocity[1]],
      [velocity[0], 0, velocity[1]],
    ],
    [0.35, 0.5, 1.0],
    obstacleScene,
  );
  const recoveryConstraints = buildRecoveryConstraintsFromObb(
    [position[0], 0.5, position[1]],
    obstacleScene.obstacles.slice(0, 8).map((o) => ({
      id: o.id,
      name: o.name,
      center: o.center,
      halfExtents: o.halfExtents,
      rotationYaw: o.rotationYawRad,
    })),
    0.25,
    DEFAULT_RECOVERY_CONFIG.safeMarginThreshold,
  );
  const firstDoorway = CRAFTSMAN_DOORWAYS[0];
  const sscbfEval = evaluateSscbfBarrier(
    {
      position,
      velocity,
      yaw: Math.atan2(velocity[1], velocity[0]),
      robotRadius: 0.25,
    },
    firstDoorway,
  );
  const segProj = projectPointOntoSegment(position, firstDoorway.start, firstDoorway.end);
  const fragilityMultiplier = getFragilityMultiplier("glass");
  const riskMargin = computeAdaptiveSafetyMargin(
    [position[0], 0.5, position[1]],
    [velocity[0], 0, velocity[1]],
    query.gradientVector,
    {
      center: firstObb?.center ?? [0, 0.5, 0],
      riskClass: "glass",
      fragility: 0.9,
    },
    DEFAULT_MARGIN_CONFIG,
  );

  const parlorLamp = createDecorObject("parlor-floor-lamp", "floor-lamp", [1.2, 0.0, 2.4]);
  const decorTippingCheck = checkDecorTipping(parlorLamp, 6.5, 1.1);

  const costmapEval = SHARED_HOUSE_COSTMAP.evaluateNeuralClearanceWithGradient(
    position[0],
    position[1],
  );

  // Indoor & Outdoor G1 Campaign Diagnostics (cmaes-feat-fs1-indoor-g1-5dc, cmaes-feat-fs2-outdoor-g1-m1h)
  const shortIndoorWaypoints: HouseWaypoint[] = CRAFTSMAN_WAYPOINT_CHAIN.slice(1, 4);
  const seedRuns = [0, 1, 2].map((seedOffset) =>
    simulateHouseNavigation(
      shortIndoorWaypoints,
      CRAFTSMAN_DOORWAYS,
      200,
      1 / 60,
      0.21 + seedOffset * 0.005,
      { scene },
    ),
  );
  const blockedScene: HouseSceneConfig = {
    ...scene,
    furniture: [
      ...scene.furniture,
      {
        name: "Doorway Barricade",
        kind: "storage-cabinet",
        room: "dining",
        center: [0.35, 1.2],
        size: [2.2, 0.8],
        height: 1.0,
        rotation: 0,
        note: "Causal intervention barricade blocking dining doorway",
      },
    ],
  };
  const blockedRun = simulateHouseNavigation(
    shortIndoorWaypoints,
    CRAFTSMAN_DOORWAYS,
    60,
    1 / 60,
    0.25,
    { scene: blockedScene },
  );

  const flatGrid = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const slopedGrid = new Float32Array([0, 0.08, 0.16, 0.05, 0.14, 0.22, 0.12, 0.2, 0.28]);
  const outdoorPorchFlatSdfM = sdfHeightfield([0.4, 0.35, 0.4], {
    minX: 0,
    maxX: 2,
    minZ: 0,
    maxZ: 2,
    rows: 3,
    cols: 3,
    heights: flatGrid,
  }).distance;
  const outdoorGardenSlopedSdfM = sdfHeightfield([0.4, 0.35, 0.4], {
    minX: 0,
    maxX: 2,
    minZ: 0,
    maxZ: 2,
    rows: 3,
    cols: 3,
    heights: slopedGrid,
  }).distance;
  const planterNominalScene = createSceneFromHouseFurniture([
    {
      name: "Porch Cedar Planter",
      kind: "planter",
      room: "porch",
      center: [0.95, 4.5],
      size: [0.45, 0.45],
      height: 0.5,
      rotation: 0,
      note: "Nominal outdoor planter envelope",
    },
  ]);
  const planterShiftedScene = createSceneFromHouseFurniture([
    {
      name: "Porch Cedar Planter",
      kind: "planter",
      room: "porch",
      center: [0.55, 4.5],
      size: [0.45, 0.45],
      height: 0.5,
      rotation: 0,
      note: "Shifted outdoor planter envelope for causal clearance check",
    },
  ]);
  const outdoorPlanterNominalClearanceM = queryMultiObstacleScene(
    { position: [0.35, 0.25, 4.5], robotRadius: 0.25, safetyMargin: 0.04 },
    planterNominalScene,
  ).minimumClearanceMeters;
  const outdoorPlanterShiftedClearanceM = queryMultiObstacleScene(
    { position: [0.35, 0.25, 4.5], robotRadius: 0.25, safetyMargin: 0.04 },
    planterShiftedScene,
  ).minimumClearanceMeters;

  return {
    recoveryState: recoveryRes.state,
    safeVelocity: [recoveryRes.safeControl[0], recoveryRes.safeControl[2]],
    maxViolationSlack: recoveryRes.maxViolationSlack,
    socialPotential: social.potential,
    socialGradient: social.gradient,
    socialCbf: {
      hSocial: socialCbfEval.hSocial,
      isSafe: socialCbfEval.isSafe,
      filteredVelocity: socialFilterRes.safeVelocity,
      interventionMagnitude: socialFilterRes.interventionMagnitude,
    },
    g1ChallengePreview: {
      waypointCount: CRAFTSMAN_G1_CHALLENGE_WAYPOINTS.length,
      clearSpawnPosition,
      sweptCcdWasHit: sweptCcd.wasHit,
      shortRolloutDistanceMeters: g1ChallengeShort.totalDistanceMeters,
      shortRolloutMinClearanceMeters: g1ChallengeShort.minimumClearanceMeters,
    },
    householdMultiObstacle: {
      wallObstacleCount: wallObstacles.length,
      enclosingRadiusMeters,
      spawnIsClear,
      armStageRoomCount: ARM_STAGE_ROOMS.length,
      kernelObstacleRole: kernelObs.role,
      objectiveScore: objRes.totalObjective,
      recoveryConstraintCount: recoveryConstraints.length,
      sscbfH: sscbfEval.hLateral,
      segmentProjectionT: segProj.t,
      riskAwareMarginMeters: riskMargin.margin,
      fragilityMultiplier,
      fragilityRiskScore: riskMargin.brakingDist * riskMargin.riskFactor,
    },
    decorTippingCheck,
    learnedCostmap: {
      parameterCount: SHARED_HOUSE_COSTMAP.parameterCount,
      neuralClearanceValue: costmapEval.value,
      neuralGradient: costmapEval.gradient,
    },
    indoorOutdoorCampaigns: {
      curriculumHorizonSteps: 720,
      shortGaitThreeSeedDistancesM: [
        seedRuns[0].totalPathDistanceMeters,
        seedRuns[1].totalPathDistanceMeters,
        seedRuns[2].totalPathDistanceMeters,
      ],
      shortGaitThreeSeedMeanSpeedsMps: [
        seedRuns[0].totalPathDistanceMeters / seedRuns[0].simulatedPhysicalSeconds,
        seedRuns[1].totalPathDistanceMeters / seedRuns[1].simulatedPhysicalSeconds,
        seedRuns[2].totalPathDistanceMeters / seedRuns[2].simulatedPhysicalSeconds,
      ],
      indoorMinClearanceMeters: seedRuns[0].minimumObstacleClearanceMeters,
      blockedDoorwayMinClearanceMeters: blockedRun.minimumObstacleClearanceMeters,
      blockedDoorwayInfeasible:
        !blockedRun.allWaypointsReached || blockedRun.minimumObstacleClearanceMeters < 0.001,
      outdoorPorchFlatSdfM,
      outdoorGardenSlopedSdfM,
      outdoorPlanterNominalClearanceM,
      outdoorPlanterShiftedClearanceM,
    },
  };
}
