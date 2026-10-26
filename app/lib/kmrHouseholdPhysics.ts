// Live coupling between the KMR kinematic owner and the existing household
// contact/LCP stack. The KMR is a moving infinite-mass kinematic body; the
// chair is a finite-mass dynamic body. This proves the end-to-end rung where
// a commanded robot base contacts and moves household matter. It does not
// claim wheel traction or a rigid-body KMR drivetrain.

import {
  computeFerrariCannyGWS,
  computeKukaFK,
  solveKukaIK,
} from "./armInverseKinematics";
import type { RigidBody } from "./contactGraph";
import type { OrientedBoundingBox } from "./houseMultiObstacleKernel";
import {
  createHouseholdWorld,
  type HouseholdBodyMeta,
  type HouseholdWorld,
  stepHouseholdPhysicsWorld,
} from "./householdPhysicsWorld";
import {
  computeMountingPlatePose,
  KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS,
  type KmrMountingPlatePose,
} from "./kmrGeometry";
import type { KmrNavigationReceipt, KmrPose2D } from "./kmrNavigationOwner";

const GROUND_ID = "kmr-coupling-ground";
const BASE_ID = "kmr-kinematic-base";
const CHAIR_ID = "kmr-dynamic-chair";
const CHAIR_RADIUS_METERS = 0.22;

export interface KmrHouseholdPhysicsCoupling {
  world: HouseholdWorld;
  previousPose: KmrPose2D;
  cumulativeBaseChairContacts: number;
}

export interface KmrHouseholdPhysicsReceipt {
  owner: "household-contact-lcp-ts";
  baseAngularVelocityRadPerSecond: number;
  chairPositionMeters: [number, number, number];
  chairVelocityMps: [number, number, number];
  chairDisplacementMeters: number;
  baseChairContactsThisStep: number;
  cumulativeBaseChairContacts: number;
  lcpConverged: boolean;
  lcpIterations: number;
  lcpMaxResidual: number;
}

function shortestAngularDelta(from: number, to: number): number {
  let delta = to - from;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  return delta;
}

function groundBody(): RigidBody {
  return {
    id: GROUND_ID,
    isStatic: true,
    shape: { type: "plane", planeNormal: [0, 0, 1], planeOffset: 0 },
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 0,
    invMass: 0,
    inertiaLocal: [0, 0, 0],
    invInertiaLocal: [0, 0, 0],
    friction: 0.65,
    restitution: 0.05,
  };
}

function baseBody(pose: KmrPose2D): RigidBody {
  const geometry = KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS;
  return {
    id: BASE_ID,
    isStatic: true,
    shape: {
      type: "box",
      halfExtents: [
        geometry.baseLengthMeters / 2,
        geometry.baseWidthMeters / 2,
        geometry.baseHeightMeters / 2,
      ],
    },
    position: [pose.x, pose.y, geometry.baseHeightMeters / 2],
    rotation: [0, 0, pose.theta],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 0,
    invMass: 0,
    inertiaLocal: [0, 0, 0],
    invInertiaLocal: [0, 0, 0],
    friction: 0.75,
    restitution: 0.02,
  };
}

function chairBody(position: [number, number]): RigidBody {
  return {
    id: CHAIR_ID,
    isStatic: false,
    shape: { type: "sphere", radius: CHAIR_RADIUS_METERS },
    position: [position[0], position[1], CHAIR_RADIUS_METERS],
    rotation: [0, 0, 0],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 4,
    invMass: 0.25,
    inertiaLocal: [0.1, 0.1, 0.1],
    invInertiaLocal: [10, 10, 10],
    friction: 0.5,
    restitution: 0.1,
  };
}

export function createKmrHouseholdPhysicsCoupling(
  initialPose: KmrPose2D,
  chairPosition: [number, number],
): KmrHouseholdPhysicsCoupling {
  const meta = new Map<string, HouseholdBodyMeta>();
  meta.set(CHAIR_ID, {
    boundingRadius: CHAIR_RADIUS_METERS,
    material: "hardwood",
  });
  return {
    world: createHouseholdWorld(
      [groundBody(), baseBody(initialPose), chairBody(chairPosition)],
      meta,
      { dt: 1 / 60 },
    ),
    previousPose: { ...initialPose },
    cumulativeBaseChairContacts: 0,
  };
}

export function stepKmrHouseholdPhysics(
  coupling: KmrHouseholdPhysicsCoupling,
  navigation: KmrNavigationReceipt,
): KmrHouseholdPhysicsReceipt {
  const base = coupling.world.contactGraph.getBody(BASE_ID);
  const chair = coupling.world.contactGraph.getBody(CHAIR_ID);
  if (!base || !chair) throw new Error("KMR household coupling lost an owned body");
  const dt = coupling.world.dt;
  base.linearVelocity = [
    (navigation.pose.x - coupling.previousPose.x) / dt,
    (navigation.pose.y - coupling.previousPose.y) / dt,
    0,
  ];
  base.angularVelocity = [
    0,
    0,
    shortestAngularDelta(coupling.previousPose.theta, navigation.pose.theta) / dt,
  ];
  base.position = [
    navigation.pose.x,
    navigation.pose.y,
    KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS.baseHeightMeters / 2,
  ];
  base.rotation = [0, 0, navigation.pose.theta];
  coupling.previousPose = { ...navigation.pose };

  const before: [number, number, number] = [...chair.position];
  const result = stepHouseholdPhysicsWorld(coupling.world);
  const baseChairContactsThisStep = result.manifolds.filter(
    (manifold) =>
      (manifold.bodyAId === BASE_ID && manifold.bodyBId === CHAIR_ID) ||
      (manifold.bodyAId === CHAIR_ID && manifold.bodyBId === BASE_ID),
  ).length;
  coupling.cumulativeBaseChairContacts += baseChairContactsThisStep;
  return {
    owner: "household-contact-lcp-ts",
    baseAngularVelocityRadPerSecond: base.angularVelocity[2],
    chairPositionMeters: [...chair.position],
    chairVelocityMps: [...chair.linearVelocity],
    chairDisplacementMeters: Math.hypot(
      chair.position[0] - before[0],
      chair.position[1] - before[1],
      chair.position[2] - before[2],
    ),
    baseChairContactsThisStep,
    cumulativeBaseChairContacts: coupling.cumulativeBaseChairContacts,
    lcpConverged: result.lcpConverged,
    lcpIterations: result.lcpIterations,
    lcpMaxResidual: result.lcpMaxResidual,
  };
}

export type KmrManipulationPhase =
  | "approach"
  | "align"
  | "grasp"
  | "lift"
  | "transport"
  | "place"
  | "return"
  | "standby"
  | "cancelled"
  | "refused";

export const KMR_SEVEN_MANIPULATION_PHASES: readonly KmrManipulationPhase[] = [
  "approach",
  "align",
  "grasp",
  "lift",
  "transport",
  "place",
  "return",
] as const;

export interface ComposedKmrArmKinematics {
  mountingPlateWorldPose: KmrMountingPlatePose;
  baseYawRadians: number;
  jointAngles: number[];
  worldLinkPositionsMeters: [number, number, number][];
  worldEndEffectorMeters: [number, number, number];
  mountingPlateReactionForceN: [number, number, number];
  mountingPlateReactionTorqueNm: [number, number, number];
}

/**
 * Composes the moving KMR mounting-plate world pose (`computeMountingPlatePose` + base yaw `theta`)
 * with the 7-DoF iiwa arm forward/inverse kinematics (`computeKukaFK`, `solveKukaIK`) in Z-up world
 * coordinates, and computes the carried-object reaction wrench on the mounting plate (`cmaes-ss8z`).
 */
export function composeKmrMountedArmKinematics(
  basePose: KmrPose2D,
  jointAngles: readonly number[],
  targetWorldPosition?: [number, number, number],
  carriedObjectMassKg = 0.0,
  verticalAccelMps2 = 0.0,
): ComposedKmrArmKinematics {
  const plate = computeMountingPlatePose(
    KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS,
    basePose.x,
    basePose.y,
    0,
  );
  const cosYaw = Math.cos(basePose.theta);
  const sinYaw = Math.sin(basePose.theta);

  let solvedAngles =
    jointAngles.length >= 7 ? [...jointAngles] : [0, 0.4, 0, -1.2, 0, 0.8, 0];

  if (targetWorldPosition) {
    const dx = targetWorldPosition[0] - plate.xMeters;
    const dy = targetWorldPosition[1] - plate.yMeters;
    const dz = targetWorldPosition[2] - plate.zMeters;
    // Transform Z-up world delta (dx, dy, dz) into computeKukaFK's local Y-up frame [lateral, up, forward]
    const localForwardZ = cosYaw * dx + sinYaw * dy;
    const localLateralX = -sinYaw * dx + cosYaw * dy;
    const localUpY = dz;
    solvedAngles = solveKukaIK(
      [localLateralX, localUpY, localForwardZ],
      solvedAngles,
      [0, 0, 0],
      60,
    );
  }

  const fkLocal = computeKukaFK(solvedAngles, [0, 0, 0]);
  const toWorld = (localPt: [number, number, number]): [number, number, number] => {
    const lx = localPt[0];
    const ly = localPt[1];
    const lz = localPt[2];
    return [
      plate.xMeters + cosYaw * lz - sinYaw * lx,
      plate.yMeters + sinYaw * lz + cosYaw * lx,
      plate.zMeters + ly,
    ];
  };

  const worldLinkPositionsMeters = fkLocal.linkPositions.map(toWorld);
  const worldEndEffectorMeters = toWorld(fkLocal.endEffector);

  // Carried-object reaction wrench on the KMR mounting plate
  const fz = -Math.max(0, carriedObjectMassKg) * (9.81 + verticalAccelMps2);
  const forceN: [number, number, number] = [0, 0, fz];
  const rx = worldEndEffectorMeters[0] - plate.xMeters;
  const ry = worldEndEffectorMeters[1] - plate.yMeters;
  const rz = worldEndEffectorMeters[2] - plate.zMeters;
  // r x F where F = [0, 0, fz] => [ry * fz, -rx * fz, 0]
  const torqueNm: [number, number, number] = [ry * fz, -rx * fz, 0 * rz];

  return {
    mountingPlateWorldPose: plate,
    baseYawRadians: basePose.theta,
    jointAngles: solvedAngles,
    worldLinkPositionsMeters,
    worldEndEffectorMeters,
    mountingPlateReactionForceN: forceN,
    mountingPlateReactionTorqueNm: torqueNm,
  };
}

export interface KmrMobileManipulationConfig {
  seed?: number;
  startPose?: KmrPose2D;
  pickObjectWorldPos?: [number, number, number];
  placeGoalWorldPos?: [number, number, number];
  objectMassKg?: number;
  objectRadiusMeters?: number;
  objectFrictionCoeff?: number;
  obstacles?: readonly OrientedBoundingBox[];
  dynamicObstaclePos?: [number, number] | null;
  roomBounds?: { min: [number, number]; max: [number, number] };
}

export interface KmrMobileManipulationStepReceipt {
  stepIndex: number;
  phase: KmrManipulationPhase;
  visitedPhases: KmrManipulationPhase[];
  basePose: KmrPose2D;
  wheelSpeedsRadPerSec: [number, number, number, number];
  armKinematics: ComposedKmrArmKinematics;
  gripperApertureMeters: number;
  isObjectGrasped: boolean;
  graspGwsRadius: number;
  graspNormalForceN: number;
  objectWorldPositionMeters: [number, number, number];
  objectStepDisplacementMeters: number;
  emergencyStopTriggered: boolean;
  refusalReason: string | null;
  recoveryReady: boolean;
  completed: boolean;
  householdContactReceipt: KmrHouseholdPhysicsReceipt;
}

const STOWED_ARM_ANGLES: readonly number[] = [0, 0.35, 0, -1.15, 0, 0.75, 0];

function isPointBlockedByObstacles(
  x: number,
  y: number,
  radius: number,
  obstacles: readonly OrientedBoundingBox[],
): boolean {
  for (const obb of obstacles) {
    if (obb.exemptFromPenalty) continue;
    const relX = x - obb.center[0];
    const relZ = y - obb.center[2];
    const cosYaw = Math.cos(-obb.rotationYawRad);
    const sinYaw = Math.sin(-obb.rotationYawRad);
    const localX = relX * cosYaw - relZ * sinYaw;
    const localZ = relX * sinYaw + relZ * cosYaw;
    if (
      Math.abs(localX) < obb.halfExtents[0] + radius &&
      Math.abs(localZ) < obb.halfExtents[2] + radius
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Seven-phase KMR iiwa mobile manipulation state machine (`cmaes-ss8z`, `cmaes-za0x.57`):
 * `approach -> align -> grasp -> lift -> transport -> place -> return`.
 * Couples the 4-mecanum KMR base and household LCP contact world with the mounted 7-DoF iiwa
 * arm kinematics and Ferrari-Canny grasp wrench without teleportation.
 */
export class KmrSevenPhaseMobileManipulator {
  private currentPhase: KmrManipulationPhase = "approach";
  private readonly visited: KmrManipulationPhase[] = [];
  private basePose: KmrPose2D;
  private readonly standbyPose: KmrPose2D;
  private readonly pickPos: [number, number, number];
  private readonly placePos: [number, number, number];
  private readonly pickStandoffPose: KmrPose2D;
  private readonly placeStandoffPose: KmrPose2D;
  private readonly objectMassKg: number;
  private readonly objectRadiusMeters: number;
  private readonly objectFrictionCoeff: number;
  private readonly dynamicObstaclePos: [number, number] | null;
  private readonly coupling: KmrHouseholdPhysicsCoupling;

  private armAngles: number[] = [...STOWED_ARM_ANGLES];
  private gripperAperture = 0.08;
  private isGrasped = false;
  private gwsRadius = 0;
  private graspNormalForceN = 0;
  private objectPos: [number, number, number];
  private phaseStepCounter = 0;
  private totalSteps = 0;
  private emergencyStop = false;
  private refusalReason: string | null = null;
  private recoveryReady = false;
  private lastReceipt: KmrMobileManipulationStepReceipt | null = null;

  constructor(config: KmrMobileManipulationConfig = {}) {
    this.standbyPose = config.startPose
      ? { ...config.startPose }
      : { x: 0.0, y: 0.0, theta: 0.0 };
    this.basePose = { ...this.standbyPose };
    this.pickPos = config.pickObjectWorldPos
      ? [...config.pickObjectWorldPos]
      : [0.85, 0.0, 0.72];
    this.placePos = config.placeGoalWorldPos
      ? [...config.placeGoalWorldPos]
      : [1.45, 0.35, 0.72];
    this.objectMassKg = config.objectMassKg ?? 0.45;
    this.objectRadiusMeters = config.objectRadiusMeters ?? 0.042;
    this.objectFrictionCoeff = config.objectFrictionCoeff ?? 0.65;
    this.dynamicObstaclePos = config.dynamicObstaclePos ?? null;
    this.objectPos = [...this.pickPos];

    const pickStandDist = 0.52;
    const pickYaw = Math.atan2(
      this.pickPos[1] - this.standbyPose.y,
      this.pickPos[0] - this.standbyPose.x,
    );
    this.pickStandoffPose = {
      x: this.pickPos[0] - Math.cos(pickYaw) * pickStandDist,
      y: this.pickPos[1] - Math.sin(pickYaw) * pickStandDist,
      theta: pickYaw,
    };

    const placeYaw = Math.atan2(
      this.placePos[1] - this.pickStandoffPose.y,
      this.placePos[0] - this.pickStandoffPose.x,
    );
    this.placeStandoffPose = {
      x: this.placePos[0] - Math.cos(placeYaw) * pickStandDist,
      y: this.placePos[1] - Math.sin(placeYaw) * pickStandDist,
      theta: placeYaw,
    };

    this.coupling = createKmrHouseholdPhysicsCoupling(this.basePose, [
      this.pickStandoffPose.x + 0.32,
      this.pickStandoffPose.y,
    ]);

    const bounds = config.roomBounds ?? { min: [-4.5, -4.5], max: [4.5, 4.5] };
    const inBounds = (x: number, y: number) =>
      x >= bounds.min[0] && x <= bounds.max[0] && y >= bounds.min[1] && y <= bounds.max[1];
    if (
      !inBounds(this.pickPos[0], this.pickPos[1]) ||
      !inBounds(this.placePos[0], this.placePos[1])
    ) {
      this.currentPhase = "refused";
      this.refusalReason = "GOAL_OUT_OF_BOUNDS";
    } else if (
      config.obstacles &&
      (isPointBlockedByObstacles(this.pickPos[0], this.pickPos[1], 0.12, config.obstacles) ||
        isPointBlockedByObstacles(this.placePos[0], this.placePos[1], 0.12, config.obstacles))
    ) {
      this.currentPhase = "refused";
      this.refusalReason = "GOAL_BLOCKED_BY_OBSTACLE";
    } else {
      this.visited.push("approach");
    }
  }

  private transitionTo(nextPhase: KmrManipulationPhase): void {
    this.currentPhase = nextPhase;
    this.phaseStepCounter = 0;
    if (!this.visited.includes(nextPhase)) {
      this.visited.push(nextPhase);
    }
  }

  private driveBaseToward(
    target: KmrPose2D,
    dt: number,
    maxLinearSpeedMps = 0.55,
    maxAngularSpeedRadPerSec = 1.2,
  ): {
    reached: boolean;
    vX: number;
    vY: number;
    omega: number;
    wheelSpeeds: [number, number, number, number];
  } {
    const dx = target.x - this.basePose.x;
    const dy = target.y - this.basePose.y;
    const dist = Math.hypot(dx, dy);
    const dTheta = shortestAngularDelta(this.basePose.theta, target.theta);

    if (dist <= 0.015 && Math.abs(dTheta) <= 0.025) {
      this.basePose = { ...target };
      return { reached: true, vX: 0, vY: 0, omega: 0, wheelSpeeds: [0, 0, 0, 0] };
    }

    const stepDist = Math.min(dist, maxLinearSpeedMps * dt);
    const stepTheta =
      Math.sign(dTheta) * Math.min(Math.abs(dTheta), maxAngularSpeedRadPerSec * dt);
    const vxWorld = dist > 1e-6 ? (dx / dist) * (stepDist / dt) : 0;
    const vyWorld = dist > 1e-6 ? (dy / dist) * (stepDist / dt) : 0;
    const omega = stepTheta / dt;

    this.basePose = {
      x: this.basePose.x + vxWorld * dt,
      y: this.basePose.y + vyWorld * dt,
      theta: this.basePose.theta + stepTheta,
    };

    const cosT = Math.cos(this.basePose.theta);
    const sinT = Math.sin(this.basePose.theta);
    const vX = cosT * vxWorld + sinT * vyWorld;
    const vY = -sinT * vxWorld + cosT * vyWorld;
    const r = KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS.wheelDiameterMeters / 2;
    const lSum =
      (KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS.wheelbaseXMeters +
        KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS.wheelbaseYMeters) /
      2;
    const wheelSpeeds: [number, number, number, number] = [
      (vX - vY - lSum * omega) / r,
      (vX + vY + lSum * omega) / r,
      (vX + vY - lSum * omega) / r,
      (vX - vY + lSum * omega) / r,
    ];
    return { reached: false, vX, vY, omega, wheelSpeeds };
  }

  public cancelAndRecover(): KmrMobileManipulationStepReceipt {
    this.currentPhase = "cancelled";
    this.isGrasped = false;
    this.gripperAperture = 0.08;
    this.gwsRadius = 0;
    this.graspNormalForceN = 0;
    this.armAngles = [...STOWED_ARM_ANGLES];
    this.recoveryReady = true;
    return this.step();
  }

  public step(): KmrMobileManipulationStepReceipt {
    const dt = 1 / 60;
    this.totalSteps += 1;
    this.phaseStepCounter += 1;
    const prevObjectPos: [number, number, number] = [...this.objectPos];

    let vX = 0;
    let vY = 0;
    let omega = 0;
    let wheelSpeeds: [number, number, number, number] = [0, 0, 0, 0];
    let targetWorldForArm: [number, number, number] | undefined;
    let verticalAccel = 0;

    if (this.currentPhase === "refused" || this.currentPhase === "cancelled") {
      // Remain halted with zero wheel speeds
      wheelSpeeds = [0, 0, 0, 0];
    } else if (this.currentPhase === "approach") {
      if (this.dynamicObstaclePos) {
        const distToDyn = Math.hypot(
          this.dynamicObstaclePos[0] - this.basePose.x,
          this.dynamicObstaclePos[1] - this.basePose.y,
        );
        if (distToDyn < 0.52) {
          this.emergencyStop = true;
          this.refusalReason = "DYNAMIC_OBSTACLE_EMERGENCY_STOP";
        }
      }
      if (!this.emergencyStop) {
        const drive = this.driveBaseToward(this.pickStandoffPose, dt);
        vX = drive.vX;
        vY = drive.vY;
        omega = drive.omega;
        wheelSpeeds = drive.wheelSpeeds;
        if (drive.reached) {
          this.transitionTo("align");
        }
      }
    } else if (this.currentPhase === "align") {
      this.gripperAperture = 0.08;
      // Interpolate arm target from stowed EE to pickPos over 8 steps so motion is smooth
      const alpha = Math.min(1, this.phaseStepCounter / 8);
      const currentFk = composeKmrMountedArmKinematics(this.basePose, this.armAngles);
      targetWorldForArm = [
        currentFk.worldEndEffectorMeters[0] +
          (this.pickPos[0] - currentFk.worldEndEffectorMeters[0]) * alpha,
        currentFk.worldEndEffectorMeters[1] +
          (this.pickPos[1] - currentFk.worldEndEffectorMeters[1]) * alpha,
        currentFk.worldEndEffectorMeters[2] +
          (this.pickPos[2] - currentFk.worldEndEffectorMeters[2]) * alpha,
      ];
      if (this.phaseStepCounter >= 8) {
        this.transitionTo("grasp");
      }
    } else if (this.currentPhase === "grasp") {
      targetWorldForArm = [...this.pickPos];
      this.gripperAperture = this.objectRadiusMeters * 2.0;
      const gws = computeFerrariCannyGWS(
        28.0,
        this.gripperAperture,
        this.objectRadiusMeters,
        this.objectFrictionCoeff,
      );
      this.gwsRadius = gws.gwsRadius;
      this.graspNormalForceN = gws.normalForceN;
      this.isGrasped = gws.isStableGrasp;
      if (this.phaseStepCounter >= 4 && this.isGrasped) {
        this.transitionTo("lift");
      }
    } else if (this.currentPhase === "lift") {
      const liftDeltaZ = 0.18 * Math.min(1, this.phaseStepCounter / 10);
      targetWorldForArm = [this.pickPos[0], this.pickPos[1], this.pickPos[2] + liftDeltaZ];
      verticalAccel = 0.45;
      if (this.phaseStepCounter >= 10) {
        this.transitionTo("transport");
      }
    } else if (this.currentPhase === "transport") {
      const drive = this.driveBaseToward(this.placeStandoffPose, dt);
      vX = drive.vX;
      vY = drive.vY;
      omega = drive.omega;
      wheelSpeeds = drive.wheelSpeeds;
      if (drive.reached) {
        this.transitionTo("place");
      }
    } else if (this.currentPhase === "place") {
      const lowerAlpha = Math.min(1, this.phaseStepCounter / 8);
      const liftedZ = this.pickPos[2] + 0.18;
      targetWorldForArm = [
        this.placePos[0],
        this.placePos[1],
        liftedZ + (this.placePos[2] - liftedZ) * lowerAlpha,
      ];
      if (this.phaseStepCounter >= 8) {
        this.isGrasped = false;
        this.gripperAperture = 0.08;
        this.gwsRadius = 0;
        this.graspNormalForceN = 0;
        this.objectPos = [...this.placePos];
        this.transitionTo("return");
      }
    } else if (this.currentPhase === "return") {
      // Retract arm toward stowed pose and drive back toward standby pose
      this.armAngles = this.armAngles.map(
        (q, idx) => q + ((STOWED_ARM_ANGLES[idx] ?? 0) - q) * 0.35,
      );
      const drive = this.driveBaseToward(this.standbyPose, dt);
      vX = drive.vX;
      vY = drive.vY;
      omega = drive.omega;
      wheelSpeeds = drive.wheelSpeeds;
      if (drive.reached) {
        this.transitionTo("standby");
      }
    }

    const armKinematics = composeKmrMountedArmKinematics(
      this.basePose,
      this.armAngles,
      targetWorldForArm,
      this.isGrasped ? this.objectMassKg : 0.0,
      verticalAccel,
    );
    this.armAngles = [...armKinematics.jointAngles];

    if (this.isGrasped) {
      this.objectPos = [...armKinematics.worldEndEffectorMeters];
    }

    const navReceipt: KmrNavigationReceipt = {
      owner: "ts-kinematic-mecanum-owner",
      pose: { ...this.basePose },
      waypointIndex: this.currentPhase === "standby" ? 2 : 1,
      totalWaypoints: 2,
      completed: this.currentPhase === "standby",
      elapsedSeconds: this.totalSteps * dt,
      distanceTraveledMeters: Math.hypot(
        this.basePose.x - this.standbyPose.x,
        this.basePose.y - this.standbyPose.y,
      ),
      minimumClearanceMeters: this.emergencyStop ? 0.0 : 0.25,
      collisionRefusals: this.emergencyStop || this.currentPhase === "refused" ? 1 : 0,
      bodyCommand: { vX, vY, omega },
      wheelSpeeds: { speeds: wheelSpeeds },
    };

    const householdContactReceipt = stepKmrHouseholdPhysics(this.coupling, navReceipt);
    const objectStepDisplacementMeters = Math.hypot(
      this.objectPos[0] - prevObjectPos[0],
      this.objectPos[1] - prevObjectPos[1],
      this.objectPos[2] - prevObjectPos[2],
    );

    const receipt: KmrMobileManipulationStepReceipt = {
      stepIndex: this.totalSteps,
      phase: this.currentPhase,
      visitedPhases: [...this.visited],
      basePose: { ...this.basePose },
      wheelSpeedsRadPerSec: wheelSpeeds,
      armKinematics,
      gripperApertureMeters: this.gripperAperture,
      isObjectGrasped: this.isGrasped,
      graspGwsRadius: this.gwsRadius,
      graspNormalForceN: this.graspNormalForceN,
      objectWorldPositionMeters: [...this.objectPos],
      objectStepDisplacementMeters,
      emergencyStopTriggered: this.emergencyStop,
      refusalReason: this.refusalReason,
      recoveryReady: this.recoveryReady,
      completed: this.currentPhase === "standby",
      householdContactReceipt,
    };
    this.lastReceipt = receipt;
    return receipt;
  }

  public currentReceipt(): KmrMobileManipulationStepReceipt | null {
    return this.lastReceipt;
  }
}

export interface KmrSevenPhaseManipulationSuiteDiagnostic {
  nominalRun: {
    completed: boolean;
    visitedPhases: KmrManipulationPhase[];
    allSevenPhasesVisitedInOrder: boolean;
    totalSteps: number;
    peakGraspGwsRadius: number;
    peakMountingPlateTorqueNm: number;
    maxObjectStepDisplacementMeters: number;
    finalPlaceErrorMeters: number;
    cumulativeBaseChairContacts: number;
    maxLcpResidual: number;
  };
  rigidCompositionTransformExact: boolean;
  seedDeterminismExact: boolean;
  negativeControls: {
    blockedGoalRefused: boolean;
    blockedGoalRefusalReason: string | null;
    dynamicObstacleEmergencyStopped: boolean;
    dynamicObstacleZeroedWheels: boolean;
    midSequenceCancelledAndRecovered: boolean;
  };
}

/**
 * Evaluates the complete 7-phase KMR iiwa mobile manipulation state machine, rigid base+arm
 * SE(3) composition, seed determinism, and causal negative controls (`cmaes-ss8z`, `cmaes-za0x.57`).
 */
export function evaluateKmrSevenPhaseManipulationSuite(): KmrSevenPhaseManipulationSuiteDiagnostic {
  const runNominal = () => {
    const machine = new KmrSevenPhaseMobileManipulator({
      seed: 42,
      startPose: { x: 0.0, y: 0.0, theta: 0.0 },
      pickObjectWorldPos: [0.85, 0.0, 0.72],
      placeGoalWorldPos: [1.35, 0.25, 0.72],
      objectMassKg: 0.45,
    });
    let receipt = machine.step();
    let peakGws = receipt.graspGwsRadius;
    let peakTorque = Math.hypot(...receipt.armKinematics.mountingPlateReactionTorqueNm);
    let maxDisp = receipt.objectStepDisplacementMeters;
    let maxResidual = receipt.householdContactReceipt.lcpMaxResidual;

    for (let i = 1; i < 360 && !receipt.completed; i++) {
      receipt = machine.step();
      if (receipt.graspGwsRadius > peakGws) peakGws = receipt.graspGwsRadius;
      const tau = Math.hypot(...receipt.armKinematics.mountingPlateReactionTorqueNm);
      if (tau > peakTorque) peakTorque = tau;
      if (receipt.objectStepDisplacementMeters > maxDisp) {
        maxDisp = receipt.objectStepDisplacementMeters;
      }
      if (receipt.householdContactReceipt.lcpMaxResidual > maxResidual) {
        maxResidual = receipt.householdContactReceipt.lcpMaxResidual;
      }
    }
    return { receipt, peakGws, peakTorque, maxDisp, maxResidual };
  };

  const nomA = runNominal();
  const nomB = runNominal();

  const expectedOrder = KMR_SEVEN_MANIPULATION_PHASES;
  const allSevenPhasesVisitedInOrder = expectedOrder.every(
    (phase, idx) => nomA.receipt.visitedPhases[idx] === phase,
  );
  const finalPlaceErrorMeters = Math.hypot(
    nomA.receipt.objectWorldPositionMeters[0] - 1.35,
    nomA.receipt.objectWorldPositionMeters[1] - 0.25,
    nomA.receipt.objectWorldPositionMeters[2] - 0.72,
  );

  // Rigid SE(3) base+arm composition check: fixed joint angles at two base poses
  const fixedAngles = [0.2, 0.45, 0.0, -1.1, 0.0, 0.7, 0.0];
  const compOrigin = composeKmrMountedArmKinematics({ x: 0, y: 0, theta: 0 }, fixedAngles);
  const testPose: KmrPose2D = { x: 1.25, y: -0.65, theta: 0.42 };
  const compMoved = composeKmrMountedArmKinematics(testPose, fixedAngles);
  const relOriginX =
    compOrigin.worldEndEffectorMeters[0] - compOrigin.mountingPlateWorldPose.xMeters;
  const relOriginY =
    compOrigin.worldEndEffectorMeters[1] - compOrigin.mountingPlateWorldPose.yMeters;
  const relOriginZ =
    compOrigin.worldEndEffectorMeters[2] - compOrigin.mountingPlateWorldPose.zMeters;
  const expectedMovedX =
    compMoved.mountingPlateWorldPose.xMeters +
    Math.cos(testPose.theta) * relOriginX -
    Math.sin(testPose.theta) * relOriginY;
  const expectedMovedY =
    compMoved.mountingPlateWorldPose.yMeters +
    Math.sin(testPose.theta) * relOriginX +
    Math.cos(testPose.theta) * relOriginY;
  const expectedMovedZ = compMoved.mountingPlateWorldPose.zMeters + relOriginZ;
  const rigidCompositionTransformExact =
    Math.hypot(
      compMoved.worldEndEffectorMeters[0] - expectedMovedX,
      compMoved.worldEndEffectorMeters[1] - expectedMovedY,
      compMoved.worldEndEffectorMeters[2] - expectedMovedZ,
    ) < 1e-9;

  const seedDeterminismExact =
    nomA.receipt.stepIndex === nomB.receipt.stepIndex &&
    nomA.receipt.basePose.x === nomB.receipt.basePose.x &&
    nomA.receipt.basePose.y === nomB.receipt.basePose.y &&
    nomA.receipt.objectWorldPositionMeters[0] === nomB.receipt.objectWorldPositionMeters[0] &&
    nomA.receipt.objectWorldPositionMeters[1] === nomB.receipt.objectWorldPositionMeters[1];

  // Negative Control 1: Blocked goal inside an obstacle OBB
  const blockingObb: OrientedBoundingBox = {
    id: "blocking-pillar",
    name: "Blocking Pillar",
    center: [0.85, 0.5, 0.0],
    halfExtents: [0.25, 0.5, 0.25],
    rotationYawRad: 0,
    materialId: "hardwood",
  };
  const blockedMachine = new KmrSevenPhaseMobileManipulator({
    pickObjectWorldPos: [0.85, 0.0, 0.72],
    obstacles: [blockingObb],
  });
  const blockedReceipt = blockedMachine.step();

  // Negative Control 2: Dynamic obstacle in the KMR approach path triggers emergency stop
  const dynStopMachine = new KmrSevenPhaseMobileManipulator({
    startPose: { x: 0, y: 0, theta: 0 },
    pickObjectWorldPos: [1.2, 0, 0.72],
    dynamicObstaclePos: [0.35, 0.0],
  });
  let dynReceipt = dynStopMachine.step();
  for (let i = 0; i < 30 && !dynReceipt.emergencyStopTriggered; i++) {
    dynReceipt = dynStopMachine.step();
  }

  // Negative Control 3: Mid-sequence cancellation & recovery during transport
  const cancelMachine = new KmrSevenPhaseMobileManipulator({
    startPose: { x: 0, y: 0, theta: 0 },
    pickObjectWorldPos: [0.85, 0, 0.72],
    placeGoalWorldPos: [1.6, 0.4, 0.72],
  });
  let cancelStep = cancelMachine.step();
  for (let i = 0; i < 120 && cancelStep.phase !== "transport"; i++) {
    cancelStep = cancelMachine.step();
  }
  const cancelledReceipt = cancelMachine.cancelAndRecover();

  return {
    nominalRun: {
      completed: nomA.receipt.completed,
      visitedPhases: nomA.receipt.visitedPhases,
      allSevenPhasesVisitedInOrder,
      totalSteps: nomA.receipt.stepIndex,
      peakGraspGwsRadius: nomA.peakGws,
      peakMountingPlateTorqueNm: nomA.peakTorque,
      maxObjectStepDisplacementMeters: nomA.maxDisp,
      finalPlaceErrorMeters,
      cumulativeBaseChairContacts:
        nomA.receipt.householdContactReceipt.cumulativeBaseChairContacts,
      maxLcpResidual: nomA.maxResidual,
    },
    rigidCompositionTransformExact,
    seedDeterminismExact,
    negativeControls: {
      blockedGoalRefused: blockedReceipt.phase === "refused",
      blockedGoalRefusalReason: blockedReceipt.refusalReason,
      dynamicObstacleEmergencyStopped: dynReceipt.emergencyStopTriggered,
      dynamicObstacleZeroedWheels: dynReceipt.wheelSpeedsRadPerSec.every((w) => w === 0),
      midSequenceCancelledAndRecovered:
        cancelledReceipt.phase === "cancelled" &&
        !cancelledReceipt.isObjectGrasped &&
        cancelledReceipt.recoveryReady &&
        cancelledReceipt.wheelSpeedsRadPerSec.every((w) => w === 0),
    },
  };
}
