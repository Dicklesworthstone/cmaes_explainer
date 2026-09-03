// Multi-Limb Inverse Kinematics (IK) & Continuous Collision Ragdoll Engine for Unitree G1.
// Provides analytical 2-bone limb IK, joint limit clamping, multi-pin interactive manipulation,
// full-body multi-sphere continuous collision projection against house obstacles, and impulse dynamics.

import {
 distanceToOBB,
 projectPointOutOfOBB,
 type OrientedBoundingBox,
} from "./houseMultiObstacleKernel";

export type InteractiveLimbPinId =
  | "head"
  | "pelvis"
  | "leftHand"
  | "rightHand"
  | "leftFoot"
  | "rightFoot";

export interface InteractiveLimbPin {
  id: InteractiveLimbPinId;
  label: string;
  /**
   * Where the pin sits relative to the live link it controls, in the
   * robot's heading frame: [forward, up, lateral-left] meters. Every
   * standoff is at least one link radius plus one pin radius long so the
   * pin sphere floats just outside the body shell instead of inside it.
   */
  standoff: [number, number, number];
  color: string;
  radius: number;
}

/** Radius of the largest rendered body link; pins must stay outside it. */
export const G1_BODY_LINK_RADIUS_METERS = 0.105;

export const G1_INTERACTIVE_PINS: InteractiveLimbPin[] = [
  // In front of the face: the root grab handle already floats above the crown.
  { id: "head", label: "Head", standoff: [0.22, -0.12, 0], color: "#38bdf8", radius: 0.05 },
  { id: "pelvis", label: "Pelvis / Root", standoff: [-0.3, 0, 0], color: "#f59e0b", radius: 0.06 },
  { id: "leftHand", label: "Left Hand", standoff: [0.05, 0, 0.17], color: "#22d3ee", radius: 0.045 },
  { id: "rightHand", label: "Right Hand", standoff: [0.05, 0, -0.17], color: "#a855f7", radius: 0.045 },
  { id: "leftFoot", label: "Left Foot", standoff: [0.2, 0.02, 0.05], color: "#10b981", radius: 0.05 },
  { id: "rightFoot", label: "Right Foot", standoff: [0.2, 0.02, -0.05], color: "#ec4899", radius: 0.05 },
];

/**
 * Compose a pin's world position from its live link anchor and the
 * robot's horizontal heading (unit vector in the x/z plane).
 */
export function limbPinRestPosition(
  anchor: readonly [number, number, number],
  heading: readonly [number, number],
  standoff: readonly [number, number, number],
): [number, number, number] {
  const [fx, fz] = heading;
  // Lateral-left of heading in a Y-up right-handed frame is (fz, -fx).
  const lx = fz;
  const lz = -fx;
  return [
    anchor[0] + fx * standoff[0] + lx * standoff[2],
    anchor[1] + standoff[1],
    anchor[2] + fz * standoff[0] + lz * standoff[2],
  ];
}

/**
 * Push a sphere out of every body-link sphere it overlaps. Used for the
 * interactive pins so that a dragged pin never enters the humanoid's own
 * shell. Gauss-Seidel relaxation handles the case where pushing out of one
 * link lands the sphere inside a neighbour.
 */
export function clampSphereAgainstLinks(
  pos: [number, number, number],
  radius: number,
  links: readonly (readonly [number, number, number])[],
  linkRadius: number = G1_BODY_LINK_RADIUS_METERS,
  margin = 0.01,
): { clamped: [number, number, number]; overlapped: boolean } {
  let [cx, cy, cz] = pos;
  const separation = radius + linkRadius + margin;
  let overlapped = false;
  for (let pass = 0; pass < 4; pass++) {
    let moved = false;
    for (const link of links) {
      let dx = cx - link[0];
      let dy = cy - link[1];
      let dz = cz - link[2];
      let d = Math.hypot(dx, dy, dz);
      if (d >= separation) continue;
      overlapped = true;
      moved = true;
      if (d < 1e-6) {
        // Degenerate: sphere centred on the link. Push straight up.
        dx = 0;
        dy = 1;
        dz = 0;
        d = 1;
      }
      const scale = separation / d;
      cx = link[0] + dx * scale;
      cy = link[1] + dy * scale;
      cz = link[2] + dz * scale;
    }
    if (!moved) break;
  }
  return { clamped: [cx, cy, cz], overlapped };
}

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
 if (cy - radius < floorY) {
 contact = {
 point: [cx, floorY, cz],
 normal: [0, 1, 0],
 penetration: floorY - (cy - radius),
 obstacleName: "Hardwood Floor",
 };
 }

 // SOTA OBB projection: use the kernel's projectPointOutOfOBB so the
 // push direction is the true SDF gradient (handles interior points,
 // yawed OBBs, and non-cubic aspect ratios). The previous radial-from-
 // center projection left the sphere inside yawed furniture. Run
 // multiple Gauss-Seidel passes to relax the case where one OBB's push-
 // out drives the sphere into a second OBB.
 for (let pass = 0; pass < 3; pass++) {
 let passMoved = false;
 for (const obb of obstacles) {
 if (obb.exemptFromPenalty) continue;
 const dist = distanceToOBB([cx, cy, cz], obb);
 if (dist < radius) {
 const projected = projectPointOutOfOBB(
 [cx, cy, cz],
 obb,
 radius,
 );
 if (projected.wasInside) {
 const pushOut = radius - dist;
 // Normal of the OBB surface at the contact point: from the contact
 // point toward the sphere center. For an EXTERIOR query the kernel
 // pushes AWAY from the OBB, so (sphere - projected) points outward.
 // For an INTERIOR query the kernel pushes TOWARD the nearest face, so
 // (sphere - projected) also points outward (toward the face).
 const nx = (cx - projected.point[0]) / Math.max(1e-9, pushOut);
 const ny = (cy - projected.point[1]) / Math.max(1e-9, pushOut);
 const nz = (cz - projected.point[2]) / Math.max(1e-9, pushOut);
 cx = projected.point[0];
 cy = projected.point[1];
 cz = projected.point[2];
 contact = {
 point: [cx - nx * radius, cy - ny * radius, cz - nz * radius],
 normal: [nx, ny, nz],
 penetration: pushOut,
 obstacleName: obb.name,
 };
 passMoved = true;
 }
 }
 }
 if (!passMoved) break;
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

/**
 * Applies a 3D perturbation impulse to humanoid center of mass and computes stepping reflex response.
 */
export function computeImpulseResponse(
  impulseNs: number, // 5 to 50 N*s
  impulseAngleRad: number, // 0 to 2*PI in horizontal plane
  robotMassKg: number = 35.0
): { deltaV: [number, number, number]; recoveryStepOffset: [number, number, number] } {
  const speedDelta = impulseNs / robotMassKg;
  const dvX = Math.cos(impulseAngleRad) * speedDelta;
  const dvZ = Math.sin(impulseAngleRad) * speedDelta;

  // Linear inverted pendulum capture point stepping offset: delta_step = delta_v * sqrt(h / g)
  const h = 0.75;
  const g = 9.81;
  const tc = Math.sqrt(h / g);

  const stepX = dvX * tc;
  const stepZ = dvZ * tc;

  return {
    deltaV: [dvX, 0, dvZ],
    recoveryStepOffset: [stepX, 0, stepZ],
  };
}
