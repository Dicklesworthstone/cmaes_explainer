// Multi-Limb Inverse Kinematics (IK) & Continuous Collision Ragdoll Engine for Unitree G1.
// Provides analytical 2-bone limb IK, joint limit clamping, root pose translation,
// and full-body multi-sphere continuous collision projection against house obstacles.

import * as THREE from "three";
import {
  distanceToOBB,
  type OrientedBoundingBox,
} from "./houseMultiObstacleKernel";

export interface G1LimbIKTarget {
  leftFoot?: [number, number, number];
  rightFoot?: [number, number, number];
  leftHand?: [number, number, number];
  rightHand?: [number, number, number];
  pelvis?: [number, number, number];
  head?: [number, number, number];
}

export interface G1CollisionContact {
  point: [number, number, number];
  normal: [number, number, number];
  penetration: number;
  obstacleName: string;
}

export interface G1FullBodyIKResult {
  pelvisPosition: [number, number, number];
  leftFootPosition: [number, number, number];
  rightFootPosition: [number, number, number];
  leftKneePosition: [number, number, number];
  rightKneePosition: [number, number, number];
  leftHandPosition: [number, number, number];
  rightHandPosition: [number, number, number];
  leftElbowPosition: [number, number, number];
  rightElbowPosition: [number, number, number];
  headPosition: [number, number, number];
  torsoPosition: [number, number, number];
  contacts: G1CollisionContact[];
  isColliding: boolean;
  minClearance: number;
}

// Unitree G1 Standard Physical Kinematic Lengths (meters)
export const G1_KINEMATICS = {
  thighLength: 0.32,
  shinLength: 0.30,
  footHeight: 0.05,
  hipWidth: 0.18,
  torsoHeight: 0.35,
  shoulderWidth: 0.36,
  upperArmLength: 0.22,
  forearmLength: 0.20,
  neckHeight: 0.18,
  headRadius: 0.11,
  bodyRadius: 0.16,
  limbRadius: 0.065,
  footRadius: 0.08,
};

/**
 * Analytical Two-Bone Inverse Kinematics solver.
 * Calculates the elbow/knee hinge position given root, target, bone lengths, and pole vector.
 */
export function solveTwoBoneIK(
  root: [number, number, number],
  target: [number, number, number],
  upperLength: number,
  lowerLength: number,
  poleVector: [number, number, number] // preferred bend direction (e.g. forward for knees, backward for elbows)
): { midPosition: [number, number, number]; reachedTarget: [number, number, number] } {
  const rX = root[0];
  const rY = root[1];
  const rZ = root[2];

  let tX = target[0];
  let tY = target[1];
  let tZ = target[2];

  let dX = tX - rX;
  let dY = tY - rY;
  let dZ = tZ - rZ;
  let dist = Math.hypot(dX, dY, dZ);

  const maxReach = upperLength + lowerLength - 0.001;
  const minReach = Math.abs(upperLength - lowerLength) + 0.001;

  if (dist > maxReach) {
    const scale = maxReach / Math.max(0.0001, dist);
    dX *= scale;
    dY *= scale;
    dZ *= scale;
    tX = rX + dX;
    tY = rY + dY;
    tZ = rZ + dZ;
    dist = maxReach;
  } else if (dist < minReach) {
    const scale = minReach / Math.max(0.0001, dist);
    dX *= scale;
    dY *= scale;
    dZ *= scale;
    tX = rX + dX;
    tY = rY + dY;
    tZ = rZ + dZ;
    dist = minReach;
  }

  // Law of Cosines to find angle at root joint
  const cosAngle =
    (upperLength * upperLength + dist * dist - lowerLength * lowerLength) /
    (2 * upperLength * dist);
  const clampedCos = Math.max(-1, Math.min(1, cosAngle));
  const angle = Math.acos(clampedCos);

  // Unit vector towards target
  const dirX = dX / dist;
  const dirY = dY / dist;
  const dirZ = dZ / dist;

  // Compute perpendicular vector along pole direction
  const pX = poleVector[0];
  const pY = poleVector[1];
  const pZ = poleVector[2];

  // Gram-Schmidt projection of poleVector perpendicular to dir
  const dot = pX * dirX + pY * dirY + pZ * dirZ;
  let perpX = pX - dot * dirX;
  let perpY = pY - dot * dirY;
  let perpZ = pZ - dot * dirZ;
  const perpLen = Math.hypot(perpX, perpY, perpZ);

  if (perpLen > 0.0001) {
    perpX /= perpLen;
    perpY /= perpLen;
    perpZ /= perpLen;
  } else {
    perpX = 0;
    perpY = 1;
    perpZ = 0;
  }

  // Mid joint position (elbow/knee)
  const alongDist = upperLength * Math.cos(angle);
  const perpDist = upperLength * Math.sin(angle);

  const midX = rX + dirX * alongDist + perpX * perpDist;
  const midY = rY + dirY * alongDist + perpY * perpDist;
  const midZ = rZ + dirZ * alongDist + perpZ * perpDist;

  return {
    midPosition: [midX, midY, midZ],
    reachedTarget: [tX, tY, tZ],
  };
}

/**
 * Clamps a sphere body against all house OBB obstacles and floor, preventing any penetration.
 */
export function clampSphereAgainstHouse(
  pos: [number, number, number],
  radius: number,
  obstacles: OrientedBoundingBox[],
  floorY: number = 0.0,
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number } = {
    minX: -3.7,
    maxX: 3.7,
    minZ: -4.4,
    maxZ: 5.2,
  }
): {
  clamped: [number, number, number];
  contact: G1CollisionContact | null;
} {
  let cx = Math.max(bounds.minX + radius, Math.min(bounds.maxX - radius, pos[0]));
  let cy = Math.max(floorY + radius, pos[1]);
  let cz = Math.max(bounds.minZ + radius, Math.min(bounds.maxZ - radius, pos[2]));

  let contact: G1CollisionContact | null = null;

  // Floor contact check
  if (pos[1] - radius < floorY) {
    contact = {
      point: [cx, floorY, cz],
      normal: [0, 1, 0],
      penetration: floorY - (pos[1] - radius),
      obstacleName: "Hardwood Floor",
    };
  }

  // OBB obstacle contacts
  for (const obb of obstacles) {
    if (obb.exemptFromPenalty) continue;
    const dist = distanceToOBB([cx, cy, cz], obb);
    if (dist < radius) {
      const dx = cx - obb.center[0];
      const dz = cz - obb.center[2];
      const len = Math.hypot(dx, dz);
      let nx = 1;
      let nz = 0;
      if (len > 0.001) {
        nx = dx / len;
        nz = dz / len;
      }
      const pushOut = radius - dist;
      cx += nx * pushOut;
      cz += nz * pushOut;

      contact = {
        point: [cx - nx * radius, cy, cz - nz * radius],
        normal: [nx, 0, nz],
        penetration: pushOut,
        obstacleName: obb.name,
      };
    }
  }

  cx = Math.max(bounds.minX + radius, Math.min(bounds.maxX - radius, cx));
  cz = Math.max(bounds.minZ + radius, Math.min(bounds.maxZ - radius, cz));

  return { clamped: [cx, cy, cz], contact };
}

/**
 * Solves whole-body G1 Inverse Kinematics and continuous collision constraints.
 */
export function solveFullBodyG1IK(
  targets: G1LimbIKTarget,
  nominalPelvis: [number, number, number],
  obstacles: OrientedBoundingBox[]
): G1FullBodyIKResult {
  const contacts: G1CollisionContact[] = [];
  let minClearance = 999.0;

  // 1. Pelvis position clamping
  const rawPelvis = targets.pelvis ?? nominalPelvis;
  const { clamped: pelvisClamped, contact: pelvisContact } = clampSphereAgainstHouse(
    rawPelvis,
    G1_KINEMATICS.bodyRadius,
    obstacles,
    0.35
  );
  if (pelvisContact) contacts.push(pelvisContact);

  const pX = pelvisClamped[0];
  const pY = pelvisClamped[1];
  const pZ = pelvisClamped[2];

  // 2. Torso and Head
  const torsoPos: [number, number, number] = [pX, pY + G1_KINEMATICS.torsoHeight * 0.5, pZ];
  const rawHead: [number, number, number] = targets.head ?? [
    pX,
    pY + G1_KINEMATICS.torsoHeight + G1_KINEMATICS.neckHeight,
    pZ,
  ];
  const { clamped: headClamped, contact: headContact } = clampSphereAgainstHouse(
    rawHead,
    G1_KINEMATICS.headRadius,
    obstacles,
    0.8
  );
  if (headContact) contacts.push(headContact);

  // 3. Hip joints
  const leftHip: [number, number, number] = [pX, pY, pZ - G1_KINEMATICS.hipWidth * 0.5];
  const rightHip: [number, number, number] = [pX, pY, pZ + G1_KINEMATICS.hipWidth * 0.5];

  // 4. Feet IK and collision
  const nominalLeftFoot: [number, number, number] = [pX, G1_KINEMATICS.footHeight, pZ - 0.12];
  const nominalRightFoot: [number, number, number] = [pX, G1_KINEMATICS.footHeight, pZ + 0.12];

  const rawLeftFoot = targets.leftFoot ?? nominalLeftFoot;
  const rawRightFoot = targets.rightFoot ?? nominalRightFoot;

  const { clamped: leftFootClamped, contact: lFootContact } = clampSphereAgainstHouse(
    rawLeftFoot,
    G1_KINEMATICS.footRadius,
    obstacles,
    0.0
  );
  const { clamped: rightFootClamped, contact: rFootContact } = clampSphereAgainstHouse(
    rawRightFoot,
    G1_KINEMATICS.footRadius,
    obstacles,
    0.0
  );
  if (lFootContact) contacts.push(lFootContact);
  if (rFootContact) contacts.push(rFootContact);

  // 5. Knee IK (Forward bending pole vector)
  const leftLegIK = solveTwoBoneIK(
    leftHip,
    leftFootClamped,
    G1_KINEMATICS.thighLength,
    G1_KINEMATICS.shinLength,
    [1, 0, 0] // bend forward
  );
  const rightLegIK = solveTwoBoneIK(
    rightHip,
    rightFootClamped,
    G1_KINEMATICS.thighLength,
    G1_KINEMATICS.shinLength,
    [1, 0, 0] // bend forward
  );

  // 6. Shoulders and Hands IK
  const shoulderY = pY + G1_KINEMATICS.torsoHeight;
  const leftShoulder: [number, number, number] = [pX, shoulderY, pZ - G1_KINEMATICS.shoulderWidth * 0.5];
  const rightShoulder: [number, number, number] = [pX, shoulderY, pZ + G1_KINEMATICS.shoulderWidth * 0.5];

  const nominalLeftHand: [number, number, number] = [pX + 0.15, pY + 0.15, pZ - 0.22];
  const nominalRightHand: [number, number, number] = [pX + 0.15, pY + 0.15, pZ + 0.22];

  const rawLeftHand = targets.leftHand ?? nominalLeftHand;
  const rawRightHand = targets.rightHand ?? nominalRightHand;

  const { clamped: leftHandClamped, contact: lHandContact } = clampSphereAgainstHouse(
    rawLeftHand,
    G1_KINEMATICS.limbRadius,
    obstacles,
    0.05
  );
  const { clamped: rightHandClamped, contact: rHandContact } = clampSphereAgainstHouse(
    rawRightHand,
    G1_KINEMATICS.limbRadius,
    obstacles,
    0.05
  );
  if (lHandContact) contacts.push(lHandContact);
  if (rHandContact) contacts.push(rHandContact);

  // 7. Elbow IK (Backward / outward pole vector)
  const leftArmIK = solveTwoBoneIK(
    leftShoulder,
    leftHandClamped,
    G1_KINEMATICS.upperArmLength,
    G1_KINEMATICS.forearmLength,
    [-0.5, 0, -1] // outward/backward
  );
  const rightArmIK = solveTwoBoneIK(
    rightShoulder,
    rightHandClamped,
    G1_KINEMATICS.upperArmLength,
    G1_KINEMATICS.forearmLength,
    [-0.5, 0, 1] // outward/backward
  );

  // Compute minimum clearance across all key body joints
  const keyPoints = [
    pelvisClamped,
    headClamped,
    leftFootClamped,
    rightFootClamped,
    leftLegIK.midPosition,
    rightLegIK.midPosition,
    leftHandClamped,
    rightHandClamped,
  ];

  for (const pt of keyPoints) {
    for (const obb of obstacles) {
      if (obb.exemptFromPenalty) continue;
      const d = distanceToOBB(pt, obb);
      if (d < minClearance) minClearance = d;
    }
  }

  return {
    pelvisPosition: pelvisClamped,
    leftFootPosition: leftLegIK.reachedTarget,
    rightFootPosition: rightLegIK.reachedTarget,
    leftKneePosition: leftLegIK.midPosition,
    rightKneePosition: rightLegIK.midPosition,
    leftHandPosition: leftArmIK.reachedTarget,
    rightHandPosition: rightArmIK.reachedTarget,
    leftElbowPosition: leftArmIK.midPosition,
    rightElbowPosition: rightArmIK.midPosition,
    headPosition: headClamped,
    torsoPosition: torsoPos,
    contacts,
    isColliding: contacts.length > 0,
    minClearance: Math.max(0, minClearance),
  };
}
