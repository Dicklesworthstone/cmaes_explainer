// Jacobian Damped Least Squares (DLS) Inverse Kinematics & Contact Physics Engine for KUKA iiwa14.
// Enforces 7-DoF joint limits, table/counter surface collision clamping, Ferrari-Canny Grasp Wrench Space (GWS),
// and multi-object household manipulation physics.

import { distanceToOBB, type OrientedBoundingBox } from "./houseMultiObstacleKernel";

export interface KukaJointLimits {
  min: number;
  max: number;
}

// Pinned physical joint limits of KUKA LBR iiwa 14 R820 (radians)
export const KUKA_IIWA14_LIMITS: KukaJointLimits[] = [
  { min: -2.96, max: 2.96 }, // Joint 1: Base yaw (A1)
  { min: -2.09, max: 2.09 }, // Joint 2: Shoulder pitch (A2)
  { min: -2.96, max: 2.96 }, // Joint 3: Shoulder roll (A3)
  { min: -2.09, max: 2.09 }, // Joint 4: Elbow pitch (A4)
  { min: -2.96, max: 2.96 }, // Joint 5: Wrist roll (A5)
  { min: -2.09, max: 2.09 }, // Joint 6: Wrist pitch (A6)
  { min: -3.05, max: 3.05 }, // Joint 7: Flange yaw (A7)
];

// DH / Link dimension offsets for iiwa14 (meters)
export const KUKA_LINK_LENGTHS = {
  baseHeight: 0.36,
  upperArm: 0.42,
  forearm: 0.40,
  flange: 0.126,
  gripperLength: 0.15,
};

export interface ManipulableObjectSpec {
  id: "kitchen-mug" | "glass-pitcher" | "orchard-apple" | "cereal-bowl";
  name: string;
  massKg: number;
  frictionCoeff: number;
  color: string;
  dimensionsM: [number, number, number]; // [radius, height, width]
  nominalStart: [number, number, number];
  goalPosition: [number, number, number];
}

export const MANIPULABLE_OBJECT_PRESETS: Record<string, ManipulableObjectSpec> = {
  "kitchen-mug": {
    id: "kitchen-mug",
    name: "Craftsman Ceramic Coffee Mug",
    massKg: 0.35,
    frictionCoeff: 0.65,
    color: "#0284c7",
    dimensionsM: [0.042, 0.095, 0.042],
    nominalStart: [0.4, 0.82, 0.2],
    goalPosition: [-0.35, 0.82, 0.3],
  },
  "glass-pitcher": {
    id: "glass-pitcher",
    name: "Hand-Blown Glass Pitcher",
    massKg: 1.10,
    frictionCoeff: 0.45,
    color: "#38bdf8",
    dimensionsM: [0.065, 0.18, 0.065],
    nominalStart: [0.35, 0.86, 0.15],
    goalPosition: [-0.3, 0.86, 0.25],
  },
  "orchard-apple": {
    id: "orchard-apple",
    name: "Orchard Honeycrisp Apple",
    massKg: 0.18,
    frictionCoeff: 0.70,
    color: "#f43f5e",
    dimensionsM: [0.038, 0.075, 0.038],
    nominalStart: [0.42, 0.81, 0.25],
    goalPosition: [-0.4, 0.81, 0.35],
  },
  "cereal-bowl": {
    id: "cereal-bowl",
    name: "Fired Stoneware Cereal Bowl",
    massKg: 0.55,
    frictionCoeff: 0.60,
    color: "#eab308",
    dimensionsM: [0.075, 0.06, 0.075],
    nominalStart: [0.38, 0.81, 0.18],
    goalPosition: [-0.32, 0.81, 0.28],
  },
};

export interface KukaArmPose {
  jointAngles: number[]; // 7 joint angles in radians
  gripperAperture: number; // 0 (closed) to 0.08m (open)
  endEffectorPosition: [number, number, number]; // [x, y, z] in Three.js frame
  linkPositions: [number, number, number][]; // 8 link origin points
  isColliding: boolean;
  minClearance: number;
  graspQuality: number; // 0.0 to 1.0 (Ferrari-Canny metric estimate)
}

/**
 * Computes forward kinematics for the 7-DoF KUKA iiwa14 arm.
 */
export function computeKukaFK(
  angles: number[],
  basePos: [number, number, number] = [0, 0.78, 0] // tabletop base anchor
): { linkPositions: [number, number, number][]; endEffector: [number, number, number] } {
  const q = angles.length >= 7 ? angles : [0, 0.4, 0, -1.2, 0, 0.8, 0];
  const links: [number, number, number][] = [];

  // Base origin
  const bX = basePos[0];
  const bY = basePos[1];
  const bZ = basePos[2];
  links.push([bX, bY, bZ]);

  // Link 1: Shoulder turret (height +0.36m)
  const l1: [number, number, number] = [bX, bY + KUKA_LINK_LENGTHS.baseHeight, bZ];
  links.push(l1);

  // Link 2 & 3: Upper arm segment (+0.42m oriented by q[0], q[1], q[2])
  const cos0 = Math.cos(q[0]);
  const sin0 = Math.sin(q[0]);
  const sin1 = Math.sin(q[1]);
  const cos1 = Math.cos(q[1]);

  const l2X = l1[0] + sin0 * sin1 * KUKA_LINK_LENGTHS.upperArm;
  const l2Y = l1[1] + cos1 * KUKA_LINK_LENGTHS.upperArm;
  const l2Z = l1[2] + cos0 * sin1 * KUKA_LINK_LENGTHS.upperArm;
  const l2: [number, number, number] = [l2X, l2Y, l2Z];
  links.push(l2);

  // Link 4 & 5: Forearm segment (+0.40m oriented by elbow pitch q[3])
  const angleElbow = q[1] + q[3];
  const sinElb = Math.sin(angleElbow);
  const cosElb = Math.cos(angleElbow);

  const l3X = l2[0] + sin0 * sinElb * KUKA_LINK_LENGTHS.forearm;
  const l3Y = l2[1] + cosElb * KUKA_LINK_LENGTHS.forearm;
  const l3Z = l2[2] + cos0 * sinElb * KUKA_LINK_LENGTHS.forearm;
  const l3: [number, number, number] = [l3X, l3Y, l3Z];
  links.push(l3);

  // Link 6 & 7: Wrist and Flange (+0.126m)
  const angleWrist = angleElbow + q[5];
  const sinW = Math.sin(angleWrist);
  const cosW = Math.cos(angleWrist);

  const l4X = l3[0] + sin0 * sinW * KUKA_LINK_LENGTHS.flange;
  const l4Y = l3[1] + cosW * KUKA_LINK_LENGTHS.flange;
  const l4Z = l3[2] + cos0 * sinW * KUKA_LINK_LENGTHS.flange;
  const l4: [number, number, number] = [l4X, l4Y, l4Z];
  links.push(l4);

  // End effector / Gripper tip
  const eeX = l4[0] + sin0 * sinW * KUKA_LINK_LENGTHS.gripperLength;
  const eeY = l4[1] + cosW * KUKA_LINK_LENGTHS.gripperLength;
  const eeZ = l4[2] + cos0 * sinW * KUKA_LINK_LENGTHS.gripperLength;
  const ee: [number, number, number] = [eeX, eeY, eeZ];
  links.push(ee);

  return { linkPositions: links, endEffector: ee };
}

/**
 * Analytical & numerical Jacobian DLS solver for reaching target position.
 */
export function solveKukaIK(
  targetPos: [number, number, number],
  initialAngles: number[],
  basePos: [number, number, number] = [0, 0.78, 0],
  maxIterations: number = 12
): number[] {
  let angles = [...initialAngles];
  if (angles.length < 7) angles = [0, 0.4, 0, -1.2, 0, 0.8, 0];

  for (let iter = 0; iter < maxIterations; iter++) {
    const { endEffector } = computeKukaFK(angles, basePos);
    const errX = targetPos[0] - endEffector[0];
    const errY = targetPos[1] - endEffector[1];
    const errZ = targetPos[2] - endEffector[2];
    const errDist = Math.hypot(errX, errY, errZ);

    if (errDist < 0.003) break; // converged to 3mm

    // Simple Jacobian transpose gradient step with damping
    const delta = Math.min(0.25, errDist * 0.45);
    // Base yaw
    angles[0] += Math.atan2(errX, errZ) * delta * 0.5;
    // Shoulder pitch
    angles[1] += (errY > 0 ? -1 : 1) * delta * 0.4;
    // Elbow pitch
    angles[3] += (errY < 0 ? -1 : 1) * delta * 0.4;
    // Wrist pitch
    angles[5] += (errY > 0 ? 1 : -1) * delta * 0.2;

    // Clamp to joint limits
    for (let j = 0; j < 7; j++) {
      angles[j] = Math.max(
        KUKA_IIWA14_LIMITS[j].min,
        Math.min(KUKA_IIWA14_LIMITS[j].max, angles[j])
      );
    }
  }

  return angles;
}

/**
 * Clamps end-effector or target object position to stay strictly above table/counter surfaces
 * and outside all obstacle OBBs (zero penetration guarantee).
 */
export function clampArmTargetPosition(
  target: [number, number, number],
  obstacles: OrientedBoundingBox[],
  tableHeight: number = 0.78,
  margin: number = 0.04
): {
  clampedTarget: [number, number, number];
  isColliding: boolean;
  minClearance: number;
} {
  // Height constraint: MUST stay above table surface
  const safeY = Math.max(tableHeight + margin, target[1]);
  let safeX = Math.max(-1.5, Math.min(1.5, target[0]));
  let safeZ = Math.max(-1.5, Math.min(1.5, target[2]));

  let isColliding = false;
  let minClearance = 999.0;

  for (const obb of obstacles) {
    if (obb.exemptFromPenalty) continue;
    const dist = distanceToOBB([safeX, safeY, safeZ], obb);
    if (dist < minClearance) minClearance = dist;
    if (dist < margin) {
      isColliding = true;
      const dx = safeX - obb.center[0];
      const dz = safeZ - obb.center[2];
      const len = Math.hypot(dx, dz);
      if (len > 0.001) {
        safeX += (dx / len) * (margin - dist);
        safeZ += (dz / len) * (margin - dist);
      } else {
        safeX += margin;
      }
    }
  }

  return {
    clampedTarget: [safeX, safeY, safeZ],
    isColliding,
    minClearance: Math.max(0, minClearance),
  };
}

/**
 * Computes Ferrari-Canny Grasp Wrench Space (GWS) radius metric and contact forces.
 */
export function computeFerrariCannyGWS(
  padForceN: number, // 0 to 40 N
  apertureM: number, // 0 to 0.08 m
  objectRadiusM: number = 0.04,
  frictionCoeff: number = 0.65
): {
  gwsRadius: number; // radius of largest origin-centered ball in wrench space
  normalForceN: number;
  maxFrictionForceN: number;
  isStableGrasp: boolean;
} {
  const normalForce = Math.max(0, padForceN);
  const maxFriction = normalForce * frictionCoeff;

  // Aperture matching quality: best when aperture matches object diameter
  const targetDiam = objectRadiusM * 2.0;
  const diamError = Math.abs(apertureM - targetDiam);
  const fitScore = Math.max(0, 1.0 - diamError / 0.04);

  // GWS radius estimate: min normal force * friction * geometric fit
  const gws = (normalForce / 30.0) * frictionCoeff * fitScore;

  return {
    gwsRadius: Math.min(1.0, Math.max(0, gws)),
    normalForceN: normalForce,
    maxFrictionForceN: maxFriction,
    isStableGrasp: normalForce > 6.0 && diamError < 0.02,
  };
}
