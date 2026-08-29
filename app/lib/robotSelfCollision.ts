// Robot Self-Collision & Self-Intersection Engine (cmaes-feat-cl9-selfx).
//
// Computes exact minimum distances and self-intersections across all 29 links of the
// G1 Humanoid robot and all 7 links of the Frankensim Manipulator Arm using
// segment-segment capsule distance algorithms with adjacent-joint kinematic masking.
//
// Math & Algorithms:
//   - Segment-to-Segment Minimum Distance (Lumelsky 1985 / Ericson RTCD Ch. 5.1):
//       S_1(s) = \mathbf{P}_0 + s \mathbf{u} \quad (s \in [0, 1])
//       S_2(t) = \mathbf{Q}_0 + t \mathbf{v} \quad (t \in [0, 1])
//       \|\mathbf{w}(s, t)\|^2 = \|\mathbf{w}_0 + s \mathbf{u} - t \mathbf{v}\|^2
//   - Minimum clearance between link i and link j:
//       d_{ij} = \|S_i(s^*) - S_j(t^*)\| - (r_i + r_j)
//   - Adjacent link mask: M_{ij} = 0 if links i and j are adjacent in kinematic tree.
//
// SOTA References:
//   - Lumelsky, "On Fast Computation of Distance between Line Segments" (Inf. Proc. Letters 1985)
//   - Christer Ericson, "Real-Time Collision Detection" (Morgan Kaufmann 2005), Ch. 5.1.9
//   - Unitree G1 Kinematic Spec & URDF (2024-2026)

export interface LinkCapsule {
  name: string;
  start: [number, number, number];
  end: [number, number, number];
  radius: number;
}

export interface LinkCollisionPair {
  linkA: string;
  linkB: string;
  distance: number; // Signed: < 0 if penetrating
  closestPointA: [number, number, number];
  closestPointB: [number, number, number];
}

export interface SelfCollisionResult {
  hasCollision: boolean;
  minClearance: number;
  collidingPairs: LinkCollisionPair[];
}

// ---------------------------------------------------------------------------
// Segment-Segment Minimum Distance (Ericson RTCD Ch. 5.1.9)
// ---------------------------------------------------------------------------

export function segmentSegmentClosestPoints(
  p1: [number, number, number],
  q1: [number, number, number],
  p2: [number, number, number],
  q2: [number, number, number],
): {
  s: number;
  t: number;
  closest1: [number, number, number];
  closest2: [number, number, number];
  distance: number;
} {
  const d1 = [q1[0] - p1[0], q1[1] - p1[1], q1[2] - p1[2]]; // Direction vector of segment S1
  const d2 = [q2[0] - p2[0], q2[1] - p2[1], q2[2] - p2[2]]; // Direction vector of segment S2
  const r = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];

  const a = d1[0] * d1[0] + d1[1] * d1[1] + d1[2] * d1[2]; // Squared length of segment S1
  const e = d2[0] * d2[0] + d2[1] * d2[1] + d2[2] * d2[2]; // Squared length of segment S2
  const f = d2[0] * r[0] + d2[1] * r[1] + d2[2] * r[2];

  let s = 0.0;
  let t = 0.0;

  // Check if either or both segments degenerate into points
  if (a <= 1e-9 && e <= 1e-9) {
    s = 0.0;
    t = 0.0;
  } else if (a <= 1e-9) {
    s = 0.0;
    t = Math.max(0.0, Math.min(1.0, f / e));
  } else {
    const c = d1[0] * r[0] + d1[1] * r[1] + d1[2] * r[2];
    if (e <= 1e-9) {
      t = 0.0;
      s = Math.max(0.0, Math.min(1.0, -c / a));
    } else {
      // General non-degenerate case
      const b = d1[0] * d2[0] + d1[1] * d2[1] + d1[2] * d2[2];
      const denom = a * e - b * b;

      if (denom !== 0.0) {
        s = Math.max(0.0, Math.min(1.0, (b * f - c * e) / denom));
      } else {
        s = 0.0;
      }

      t = (b * s + f) / e;
      if (t < 0.0) {
        t = 0.0;
        s = Math.max(0.0, Math.min(1.0, -c / a));
      } else if (t > 1.0) {
        t = 1.0;
        s = Math.max(0.0, Math.min(1.0, (b - c) / a));
      }
    }
  }

  const closest1: [number, number, number] = [
    p1[0] + d1[0] * s,
    p1[1] + d1[1] * s,
    p1[2] + d1[2] * s,
  ];
  const closest2: [number, number, number] = [
    p2[0] + d2[0] * t,
    p2[1] + d2[1] * t,
    p2[2] + d2[2] * t,
  ];

  const dx = closest1[0] - closest2[0];
  const dy = closest1[1] - closest2[1];
  const dz = closest1[2] - closest2[2];
  const distance = Math.hypot(dx, dy, dz);

  return { s, t, closest1, closest2, distance };
}

// ---------------------------------------------------------------------------
// G1 Humanoid 29-Link Kinematic Chain & Mask Matrix
// ---------------------------------------------------------------------------

export const G1_LINK_NAMES = [
  "pelvis",
  "torso",
  "head",
  "left_hip_pitch", "left_hip_roll", "left_hip_yaw", "left_knee", "left_ankle_pitch", "left_ankle_roll",
  "right_hip_pitch", "right_hip_roll", "right_hip_yaw", "right_knee", "right_ankle_pitch", "right_ankle_roll",
  "left_shoulder_pitch", "left_shoulder_roll", "left_shoulder_yaw", "left_elbow", "left_wrist_roll", "left_wrist_pitch", "left_wrist_yaw",
  "right_shoulder_pitch", "right_shoulder_roll", "right_shoulder_yaw", "right_elbow", "right_wrist_roll", "right_wrist_pitch", "right_wrist_yaw",
];

// Set of adjacent kinematic link pairs to ignore (parent-child or directly constrained)
const G1_ADJACENT_PAIRS = new Set<string>([
  "pelvis:torso", "torso:head",
  // Left leg
  "pelvis:left_hip_pitch", "left_hip_pitch:left_hip_roll", "left_hip_roll:left_hip_yaw", "left_hip_yaw:left_knee",
  "left_knee:left_ankle_pitch", "left_ankle_pitch:left_ankle_roll",
  // Right leg
  "pelvis:right_hip_pitch", "right_hip_pitch:right_hip_roll", "right_hip_roll:right_hip_yaw", "right_hip_yaw:right_knee",
  "right_knee:right_ankle_pitch", "right_ankle_pitch:right_ankle_roll",
  // Left arm
  "torso:left_shoulder_pitch", "left_shoulder_pitch:left_shoulder_roll", "left_shoulder_roll:left_shoulder_yaw",
  "left_shoulder_yaw:left_elbow", "left_elbow:left_wrist_roll", "left_wrist_roll:left_wrist_pitch", "left_wrist_pitch:left_wrist_yaw",
  // Right arm
  "torso:right_shoulder_pitch", "right_shoulder_pitch:right_shoulder_roll", "right_shoulder_roll:right_shoulder_yaw",
  "right_shoulder_yaw:right_elbow", "right_elbow:right_wrist_roll", "right_wrist_roll:right_wrist_pitch", "right_wrist_pitch:right_wrist_yaw",
]);

export function checkRobotSelfCollision(
  links: LinkCapsule[],
  ignoredPairs: Set<string>,
  safetyMargin = 0.005, // 5mm safety buffer
): SelfCollisionResult {
  const collidingPairs: LinkCollisionPair[] = [];
  let minClearance = Infinity;

  const n = links.length;
  for (let i = 0; i < n; i++) {
    const linkA = links[i];
    for (let j = i + 1; j < n; j++) {
      const linkB = links[j];

      // Check adjacent exclusion mask
      const pairKey1 = `${linkA.name}:${linkB.name}`;
      const pairKey2 = `${linkB.name}:${linkA.name}`;
      if (ignoredPairs.has(pairKey1) || ignoredPairs.has(pairKey2)) {
        continue;
      }

      const res = segmentSegmentClosestPoints(linkA.start, linkA.end, linkB.start, linkB.end);
      const clearance = res.distance - (linkA.radius + linkB.radius);

      if (clearance < minClearance) {
        minClearance = clearance;
      }

      if (clearance <= safetyMargin) {
        collidingPairs.push({
          linkA: linkA.name,
          linkB: linkB.name,
          distance: clearance,
          closestPointA: res.closest1,
          closestPointB: res.closest2,
        });
      }
    }
  }

  return {
    hasCollision: collidingPairs.length > 0,
    minClearance,
    collidingPairs,
  };
}

export function checkG1SelfCollision(links: LinkCapsule[], safetyMargin = 0.005): SelfCollisionResult {
  return checkRobotSelfCollision(links, G1_ADJACENT_PAIRS, safetyMargin);
}

// ---------------------------------------------------------------------------
// Frankensim 7-DOF Arm Kinematic Chain
// ---------------------------------------------------------------------------

export const ARM_LINK_NAMES = [
  "link0_base",
  "link1_shoulder",
  "link2_upper_arm",
  "link3_elbow",
  "link4_forearm",
  "link5_wrist",
  "link6_gripper",
];

const ARM_ADJACENT_PAIRS = new Set<string>([
  "link0_base:link1_shoulder",
  "link1_shoulder:link2_upper_arm",
  "link2_upper_arm:link3_elbow",
  "link3_elbow:link4_forearm",
  "link4_forearm:link5_wrist",
  "link5_wrist:link6_gripper",
]);

export function checkArmSelfCollision(links: LinkCapsule[], safetyMargin = 0.005): SelfCollisionResult {
  return checkRobotSelfCollision(links, ARM_ADJACENT_PAIRS, safetyMargin);
}
