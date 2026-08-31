/**
 * Experimental static contact-display approximation.
 *
 * This is not the household-arm physics owner, a continuous-collision solver,
 * or a Signorini complementarity solve. It derives a conservative visual state
 * from one already-simulated sample. The flagship must render the version-gated
 * FrankenSim trace directly; this helper is retained only for isolated display
 * experiments and must never certify placement or replace owner telemetry.
 */

import { distanceToOBB, type OrientedBoundingBox } from "./houseMultiObstacleKernel";

export interface ObjectContactHull {
  radiusM: number;
  heightM: number;
  wallThicknessM: number;
  tableRestYM: number;
  massKg: number;
  frictionCoeff: number;
}

export const OBJECT_CONTACT_HULLS: Record<string, ObjectContactHull> = {
  "kitchen-mug": {
    radiusM: 0.0425, // 85 mm outer diameter
    heightM: 0.095, // 95 mm height
    wallThicknessM: 0.006,
    tableRestYM: 0.78 + 0.095 / 2, // 0.8275 m center
    massKg: 0.35,
    frictionCoeff: 0.65,
  },
  "glass-pitcher": {
    radiusM: 0.065, // 130 mm diameter
    heightM: 0.18,
    wallThicknessM: 0.008,
    tableRestYM: 0.78 + 0.18 / 2, // 0.87 m center
    massKg: 1.1,
    frictionCoeff: 0.45,
  },
  "orchard-apple": {
    radiusM: 0.038, // 76 mm diameter
    heightM: 0.075,
    wallThicknessM: 0.038, // solid sphere
    tableRestYM: 0.78 + 0.075 / 2,
    massKg: 0.18,
    frictionCoeff: 0.7,
  },
  "cereal-bowl": {
    radiusM: 0.075, // 150 mm diameter
    heightM: 0.06,
    wallThicknessM: 0.008,
    tableRestYM: 0.78 + 0.06 / 2,
    massKg: 0.55,
    frictionCoeff: 0.6,
  },
  "living-room-remote": {
    radiusM: 0.026, // equivalent half-diagonal
    heightM: 0.16,
    wallThicknessM: 0.015,
    tableRestYM: 0.78 + 0.015,
    massKg: 0.14,
    frictionCoeff: 0.55,
  },
  "backyard-trowel": {
    radiusM: 0.032,
    heightM: 0.28,
    wallThicknessM: 0.02,
    tableRestYM: 0.78 + 0.025,
    massKg: 0.42,
    frictionCoeff: 0.6,
  },
};

export interface RenderedGripperContactGeometry {
  fingerCenterHalfWidthM: number;
  palmCenterOffsetM: number;
  wristHousingCenterOffsetM: number;
  minimumObjectClearanceM: number;
}

export function resolveRenderedGripperContactGeometry({
  commandedGripperWidthM,
  graspHalfWidthM,
  objectHalfHeightM,
  fingerPadThicknessM = 0.014,
  palmHeightM = 0.035,
  wristHousingHeightM = 0.085,
  clearanceMarginM = 0.002,
}: {
  commandedGripperWidthM: number;
  graspHalfWidthM: number;
  objectHalfHeightM: number;
  fingerPadThicknessM?: number;
  palmHeightM?: number;
  wristHousingHeightM?: number;
  clearanceMarginM?: number;
}): RenderedGripperContactGeometry {
  const values = [
    commandedGripperWidthM,
    graspHalfWidthM,
    objectHalfHeightM,
    fingerPadThicknessM,
    palmHeightM,
    wristHousingHeightM,
    clearanceMarginM,
  ];
  if (!values.every(Number.isFinite) || values.some((value) => value < 0)) {
    throw new Error("rendered gripper contact dimensions must be finite and non-negative");
  }
  const fingerCenterHalfWidthM = Math.max(
    commandedGripperWidthM * 0.5,
    graspHalfWidthM + fingerPadThicknessM * 0.5 + clearanceMarginM,
  );
  const palmCenterOffsetM = objectHalfHeightM + palmHeightM * 0.5 + clearanceMarginM;
  const wristHousingCenterOffsetM = palmCenterOffsetM + palmHeightM * 0.5 + wristHousingHeightM * 0.5;
  const fingerClearanceM = fingerCenterHalfWidthM - fingerPadThicknessM * 0.5 - graspHalfWidthM;
  const palmClearanceM = palmCenterOffsetM - palmHeightM * 0.5 - objectHalfHeightM;
  const wristClearanceM = wristHousingCenterOffsetM - wristHousingHeightM * 0.5 - objectHalfHeightM;
  return {
    fingerCenterHalfWidthM,
    palmCenterOffsetM,
    wristHousingCenterOffsetM,
    minimumObjectClearanceM: Math.min(fingerClearanceM, palmClearanceM, wristClearanceM),
  };
}

export interface ResolvedArmObjectContact {
  // Clamped display aperture in meters
  effectiveGripperWidthM: number;
  // Approximate normal pinch force for display experiments
  normalForceN: number;
  // Whether the display state follows the gripper
  isGrasped: boolean;
  // Heuristic friction-support score in [0, 1], not a Ferrari-Canny solve
  gwsRadius: number;
  // Table-clamped display position of the object [X, Y, Z]
  resolvedObjectPos: [number, number, number];
  // Table/rim-clamped display position of the end-effector [X, Y, Z]
  resolvedEndEffectorPos: [number, number, number];
  // Static spherical-envelope clearance to the nearest rigid obstacle [m]
  minObstacleClearanceM: number;
  // True if a static spherical envelope contacts or penetrates an obstacle
  isCollidingWithEnvironment: boolean;
}

/**
 * Derives one static display sample. It performs no time-of-impact sweep and
 * returns no safety certificate.
 */
export function resolveArmObjectContact({
  rawEndEffectorPos,
  rawObjectPos,
  commandedGripperWidthM,
  taskOrObjectId,
  isGraspedIntent,
  tableY = 0.78,
  obstacles = [],
}: {
  rawEndEffectorPos: [number, number, number];
  rawObjectPos: [number, number, number];
  commandedGripperWidthM: number;
  taskOrObjectId: string;
  isGraspedIntent: boolean;
  tableY?: number;
  obstacles?: OrientedBoundingBox[];
}): ResolvedArmObjectContact {
  const hull = OBJECT_CONTACT_HULLS[taskOrObjectId];
  if (!hull) throw new Error(`unknown arm contact hull: ${taskOrObjectId}`);
  if (
    !rawEndEffectorPos.every(Number.isFinite) ||
    !rawObjectPos.every(Number.isFinite) ||
    !Number.isFinite(commandedGripperWidthM) ||
    commandedGripperWidthM < 0 ||
    !Number.isFinite(tableY)
  ) {
    throw new Error("arm contact display inputs must be finite and physically bounded");
  }
  const fingerPadThicknessM = 0.014; // physical thickness of the rubber finger pad

  // 1. STATIC APERTURE CLAMP FOR GRIPPER-FINGER DISPLAY
  // The outer diameter plus pad thickness keeps the displayed fingers from
  // overlapping the object's spherical contact envelope.
  const minPhysicalApertureM = 2 * hull.radiusM + fingerPadThicknessM;
  const effectiveGripperWidthM = Math.max(commandedGripperWidthM, minPhysicalApertureM);

  // 2. VIRTUAL-SPRING DISPLAY FORCE (not a Hertz contact solve)
  // Displacement past contact surface generates proportional normal force
  const penetrationDepthM = Math.max(0, minPhysicalApertureM - commandedGripperWidthM);
  const contactStiffnessNPerM = 650.0; // elastomer finger pad stiffness
  const normalForceN = isGraspedIntent
    ? Math.max(8.5, penetrationDepthM * contactStiffnessNPerM)
    : penetrationDepthM > 0
    ? penetrationDepthM * contactStiffnessNPerM
    : 0;

  // 3. HEURISTIC FRICTION-SUPPORT SCORE
  const mu = hull.frictionCoeff;
  const maxFrictionN = mu * normalForceN;
  const objectWeightN = hull.massKg * 9.81;
  const gwsRadius =
    normalForceN > 0.5 && maxFrictionN >= objectWeightN * 0.5
      ? Math.min(1.0, (maxFrictionN / (objectWeightN + 1e-4)) * 0.45)
      : 0.0;

  const isGrasped = isGraspedIntent && normalForceN >= 2.0;

  // 4. END-EFFECTOR PALM AXIAL DISPLAY CLAMP
  // The palm box must not plunge into the top rim of the mug when directly overhead.
  const horizontalDistM = Math.hypot(
    rawEndEffectorPos[0] - rawObjectPos[0],
    rawEndEffectorPos[2] - rawObjectPos[2]
  );
  const isDirectlyAboveObject = horizontalDistM <= hull.radiusM + 0.04;
  const objectTopRimYM = rawObjectPos[1] + hull.heightM * 0.5;
  const minFlangeYM = isDirectlyAboveObject ? objectTopRimYM + 0.015 : tableY + 0.06;

  const resolvedEndEffectorPos: [number, number, number] = [
    rawEndEffectorPos[0],
    Math.max(rawEndEffectorPos[1], tableY + 0.06, minFlangeYM),
    rawEndEffectorPos[2],
  ];

  // 5. OBJECT DISPLAY POSITION WITH KINEMATIC FOLLOWING
  let resolvedObjectPos: [number, number, number];
  if (isGrasped) {
    // Follow the gripper end-effector coordinate center for display.
    resolvedObjectPos = [
      resolvedEndEffectorPos[0],
      Math.max(resolvedEndEffectorPos[1] - 0.04, tableY + hull.heightM * 0.5),
      resolvedEndEffectorPos[2],
    ];
  } else {
    // Clamp the display center above the tabletop.
    resolvedObjectPos = [
      rawObjectPos[0],
      Math.max(rawObjectPos[1], tableY + hull.heightM * 0.5),
      rawObjectPos[2],
    ];
  }

  // 6. STATIC SPHERICAL-ENVELOPE QUERY AGAINST FURNITURE AND WALLS
  let minObstacleClearanceM = Infinity;
  let isCollidingWithEnvironment = false;

  for (const obb of obstacles) {
    if (obb.exemptFromPenalty) continue;
    const armClearance = distanceToOBB(resolvedEndEffectorPos, obb) - 0.02;
    const objectClearance = distanceToOBB(resolvedObjectPos, obb) - hull.radiusM;
    const clearance = Math.min(armClearance, objectClearance);
    if (clearance < minObstacleClearanceM) {
      minObstacleClearanceM = clearance;
    }
    if (clearance <= 0) {
      isCollidingWithEnvironment = true;
    }
  }

  if (!Number.isFinite(minObstacleClearanceM)) {
    minObstacleClearanceM = 1.0;
  }

  return {
    effectiveGripperWidthM,
    normalForceN,
    isGrasped,
    gwsRadius,
    resolvedObjectPos,
    resolvedEndEffectorPos,
    minObstacleClearanceM,
    isCollidingWithEnvironment,
  };
}
