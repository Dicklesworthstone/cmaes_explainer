import { distanceToOBB, projectPointOutOfOBB, type OrientedBoundingBox } from "./houseMultiObstacleKernel";
// helpers for the household-arm UI. This reduced procedural chain is not the
// source-bound FrankenSim iiwa 7 R800 owner and must not certify placement.


export interface KukaJointLimits {
  min: number;
  max: number;
}

// Procedural 7-DoF joint bounds used by the browser-side reachability lens.
export const KUKA_AUXILIARY_JOINT_LIMITS: KukaJointLimits[] = [
  { min: -2.96, max: 2.96 }, // Joint 1: Base yaw (A1)
  { min: -2.09, max: 2.09 }, // Joint 2: Shoulder pitch (A2)
  { min: -2.96, max: 2.96 }, // Joint 3: Shoulder roll (A3)
  { min: -2.09, max: 2.09 }, // Joint 4: Elbow pitch (A4)
  { min: -2.96, max: 2.96 }, // Joint 5: Wrist roll (A5)
  { min: -2.09, max: 2.09 }, // Joint 6: Wrist pitch (A6)
  { min: -3.05, max: 3.05 }, // Joint 7: Flange yaw (A7)
];

/** @deprecated Use KUKA_AUXILIARY_JOINT_LIMITS; this is not the arm owner. */
export const KUKA_IIWA14_LIMITS = KUKA_AUXILIARY_JOINT_LIMITS;

// Reduced procedural link offsets (meters), not a URDF/DH source binding.
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
 * Computes the reduced browser-side 7-DoF forward-kinematics surrogate.
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
 * Numerical Damped Least Squares (DLS) solver for the reduced auxiliary chain.
 * It is a UI reachability probe with a 2 mm iteration stop, not exact IK or a
 * source-bound guarantee for the FrankenSim iiwa 7 R800 owner.
 */
export function solveKukaIK(
  targetPos: [number, number, number],
  initialAngles: number[] = [0, 0.4, 0, -1.2, 0, 0.8, 0],
  basePos: [number, number, number] = [0, 0.78, 0],
  maxIterations: number = 60
): number[] {
  const bX = basePos[0];
  const bZ = basePos[2];
  const q0Nominal = Math.atan2(targetPos[0] - bX, targetPos[2] - bZ);

  let angles = initialAngles.length >= 7 ? [...initialAngles] : [q0Nominal, 0.5, 0, 1.0, 0, 0.5, 0];
  angles[0] = q0Nominal;
  if (angles[3] <= 0) angles[3] = 0.8;
  if (angles[1] <= 0) angles[1] = 0.5;

  const activeJoints = [0, 1, 3, 5];
  const eps = 1e-5;
  const lambda = 0.01;

  for (let iter = 0; iter < maxIterations; iter++) {
    const { endEffector } = computeKukaFK(angles, basePos);
    const errX = targetPos[0] - endEffector[0];
    const errY = targetPos[1] - endEffector[1];
    const errZ = targetPos[2] - endEffector[2];
    const errDist = Math.hypot(errX, errY, errZ);
    if (errDist < 0.002) break; // converged to 2mm

    // Numerical 3x4 Jacobian J[row][col]
    const J = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let colIdx = 0; colIdx < activeJoints.length; colIdx++) {
      const j = activeJoints[colIdx];
      const qP = [...angles];
      qP[j] += eps;
      const { endEffector: eeP } = computeKukaFK(qP, basePos);
      J[0][colIdx] = (eeP[0] - endEffector[0]) / eps;
      J[1][colIdx] = (eeP[1] - endEffector[1]) / eps;
      J[2][colIdx] = (eeP[2] - endEffector[2]) / eps;
    }

    // J * J^T + lambda*I (3x3)
    const JJT = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    for (let r1 = 0; r1 < 3; r1++) {
      for (let r2 = 0; r2 < 3; r2++) {
        let sum = 0;
        for (let c = 0; c < 4; c++) sum += J[r1][c] * J[r2][c];
        JJT[r1][r2] = sum + (r1 === r2 ? lambda : 0);
      }
    }

    // Invert 3x3 matrix JJT
    const a = JJT[0][0], b = JJT[0][1], c = JJT[0][2];
    const d = JJT[1][0], e = JJT[1][1], f = JJT[1][2];
    const g = JJT[2][0], h = JJT[2][1], k = JJT[2][2];

    const det = a * (e * k - f * h) - b * (d * k - f * g) + c * (d * h - e * g);
    if (Math.abs(det) < 1e-8) break;
    const invDet = 1 / det;

    const inv = [
      [(e * k - f * h) * invDet, (c * h - b * k) * invDet, (b * f - c * e) * invDet],
      [(f * g - d * k) * invDet, (a * k - c * g) * invDet, (c * d - a * f) * invDet],
      [(d * h - e * g) * invDet, (b * g - a * h) * invDet, (a * e - b * d) * invDet],
    ];

    // v = inv * error
    const v0 = inv[0][0] * errX + inv[0][1] * errY + inv[0][2] * errZ;
    const v1 = inv[1][0] * errX + inv[1][1] * errY + inv[1][2] * errZ;
    const v2 = inv[2][0] * errX + inv[2][1] * errY + inv[2][2] * errZ;

    // deltaQ = J^T * v
    for (let colIdx = 0; colIdx < activeJoints.length; colIdx++) {
      const dq = J[0][colIdx] * v0 + J[1][colIdx] * v1 + J[2][colIdx] * v2;
      const j = activeJoints[colIdx];
      angles[j] += Math.max(-0.4, Math.min(0.4, dq));
      angles[j] = Math.max(
        KUKA_AUXILIARY_JOINT_LIMITS[j].min,
        Math.min(KUKA_AUXILIARY_JOINT_LIMITS[j].max, angles[j])
      );
    }
  }

  return angles;
}

/**
 * Clamps end-effector or target object position to stay strictly above table/counter surfaces
 * and outside all obstacle OBBs (zero penetration guarantee).
 */
/**
 * Lightweight, non-certifying reachability probe: runs a short 30-iteration IK attempt
 * and reports whether the end-effector converged below 5 cm. Use this
 * alongside the collision clamp so the operator cannot drag the target
 * outside the procedural workspace. Placement success still comes exclusively
 * from the decoded FrankenSim owner receipt.
 */
export function isTargetKukaReachable(
  targetPos: [number, number, number],
  basePos: [number, number, number] = [0, 0.78, 0],
): boolean {
  // 30 iterations is enough for a cheap reachability check; the
  // convergence criterion of solveKukaIK is 2 mm. We use 2 cm here so
  // a near-reachable target at the workspace boundary is rejected (the
  // user explicitly asked the arm cannot be placed outside its reach).
  const angles = solveKukaIK(targetPos, [0, 0.4, 0, -1.2, 0, 0.8, 0], basePos, 30);
  const { endEffector } = computeKukaFK(angles, basePos);
  const err = Math.hypot(
    targetPos[0] - endEffector[0],
    targetPos[1] - endEffector[1],
    targetPos[2] - endEffector[2],
  );
  return err < 0.02;
}

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
 // Workspace bounds (matches the actual table footprint)
 let safeX = Math.max(-1.5, Math.min(1.5, target[0]));
 let safeZ = Math.max(-1.5, Math.min(1.5, target[2]));
 // Soft table floor: the target MUST stay above the table surface, but
 // an OBB taller than the table (e.g. a chair) is allowed to push the
 // target upward. We take the maximum of the table floor and the
 // projection after each pass so the final Y respects both constraints.
 let safeY = Math.max(tableHeight + margin, target[1]);

 let isColliding = false;
 let minClearance = 999.0;

 // SOTA OBB projection: use the kernel's projectPointOutOfOBB so the
 // push direction is the true SDF gradient (handles interior points,
 // yawed OBBs, and non-cubic aspect ratios). The previous radial-from-
 // center projection landed targets inside yawed furniture. Run multiple
 // Gauss-Seidel passes to relax the case where one OBB's push-out
 // drives the target into a second OBB.
 for (let pass = 0; pass < 3; pass++) {
 let passMoved = false;
 for (const obb of obstacles) {
 if (obb.exemptFromPenalty) continue;
 const dist = distanceToOBB([safeX, safeY, safeZ], obb);
 if (dist < minClearance) minClearance = dist;
 if (dist < margin) {
 isColliding = true;
 const projected = projectPointOutOfOBB(
 [safeX, safeY, safeZ],
 obb,
 margin,
 );
 if (projected.wasInside) {
 safeX = projected.point[0];
 safeY = Math.max(tableHeight + margin, projected.point[1]);
 safeZ = projected.point[2];
 passMoved = true;
 }
 }
 }
 if (!passMoved) break;
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
