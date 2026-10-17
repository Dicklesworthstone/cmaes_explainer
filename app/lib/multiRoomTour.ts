// Multi-Room Cinematic 3D Fly-Through Tour Engine (cmaes-feat-fs8-tour).
//
// Implements centripetal Catmull-Rom camera trajectory interpolation, dynamic target look-at
// tracking, room-adaptive exposure and lighting orchestration, and a 720-step rollout replay
// generator showcasing real-time PBR, DDGI, SSR, soft shadows, and robot navigation.
//
// Mathematical Formulations:
//   - Centripetal Catmull-Rom Spline Interpolation (\alpha = 0.5):
//       t_{i+1} = t_i + \|\mathbf{P}_{i+1} - \mathbf{P}_i\|^{\alpha}
//       \mathbf{A}_1 = \frac{t_1 - t}{t_1 - t_0} \mathbf{P}_0 + \frac{t - t_0}{t_1 - t_0} \mathbf{P}_1, \quad \dots
//   - Look-At Target Damping & Quaternion Slerp:
//       \mathbf{T}(u) = (1 - \beta) \mathbf{T}_{\text{cam\_path}}(u) + \beta \mathbf{X}_{\text{robot}}(u)
//   - Post-FX Profile Interpolation across Room Transition Boundaries:
//       \text{Exposure}(u) = \text{Lerp}(\text{Exp}_A, \text{Exp}_B, \text{smoothstep}(u_{\text{start}}, u_{\text{end}}, u))
//
// SOTA References:
//   - Yuksel, Schaefer, & Keyser, "On the Parameterization of Catmull-Rom Curves" (CGF 2011)
//   - Shoemake, "Animating Rotation with Quaternion Curves" (SIGGRAPH 1985)
//   - Unreal Engine Sequencer & Cinematic Camera Architecture (2023)

import {
  CRAFTSMAN_DOORWAYS,
  CRAFTSMAN_WAYPOINT_CHAIN,
  type HouseNavSimulationResult,
  simulateHouseNavigation,
} from "./houseNavigationChain";

export interface CameraKeyframe {
  room: string;
  position: [number, number, number]; // [x, y, z] camera eye
  target: [number, number, number]; // [x, y, z] look-at point
  fovDegrees: number;
  exposure: number;
  bloomThreshold: number;
}

export const CRAFTSMAN_TOUR_KEYFRAMES: CameraKeyframe[] = [
  {
    room: "porch",
    position: [0.35, 2.2, 5.3],
    target: [0.35, 0.9, 3.8],
    fovDegrees: 55,
    exposure: 1.25,
    bloomThreshold: 1.4,
  },
  {
    room: "parlor",
    position: [-0.8, 1.8, 3.2],
    target: [0.35, 0.85, 2.2],
    fovDegrees: 50,
    exposure: 1.0,
    bloomThreshold: 1.2,
  },
  {
    room: "dining",
    position: [-0.9, 2.0, 0.8],
    target: [0.12, 0.9, -0.08],
    fovDegrees: 52,
    exposure: 1.05,
    bloomThreshold: 1.2,
  },
  {
    room: "kitchen",
    position: [2.2, 1.7, 0.8],
    target: [1.16, 0.9, -0.05],
    fovDegrees: 54,
    exposure: 1.15,
    bloomThreshold: 1.3,
  },
  {
    room: "hallway",
    position: [-1.2, 1.6, 0.2],
    target: [-2.45, 1.0, -0.05],
    fovDegrees: 48,
    exposure: 0.95,
    bloomThreshold: 1.1,
  },
  {
    room: "bedroom",
    position: [-2.6, 1.8, -1.2],
    target: [-1.55, 0.85, -1.95],
    fovDegrees: 50,
    exposure: 0.9,
    bloomThreshold: 1.1,
  },
  {
    room: "bath",
    position: [0.2, 1.7, -1.8],
    target: [1.0, 0.95, -2.5],
    fovDegrees: 52,
    exposure: 1.1,
    bloomThreshold: 1.3,
  },
];

export interface TourFrameSnapshot {
  frameIndex: number;
  timeSeconds: number;
  simulatedPhysicalSeconds: number;
  playbackSpeedRatio: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cameraFov: number;
  currentRoom: string;
  exposure: number;
  bloomThreshold: number;
  robotPosition: [number, number, number];
  robotVelocity: [number, number];
  robotClearanceMeters: number;
}

export interface MultiRoomTourOptions {
  navigationEpisode?: HouseNavSimulationResult;
  robotTrackingBlend?: number; // beta in [0, 1], default 0.25
}

let cachedDefaultNavigationEpisode: HouseNavSimulationResult | null = null;

function getDefaultTourNavigationEpisode(): HouseNavSimulationResult {
  if (!cachedDefaultNavigationEpisode) {
    cachedDefaultNavigationEpisode = simulateHouseNavigation(
      CRAFTSMAN_WAYPOINT_CHAIN,
      CRAFTSMAN_DOORWAYS,
      2500,
      1 / 60,
    );
  }
  return cachedDefaultNavigationEpisode;
}

/**
 * Centripetal Catmull-Rom spline interpolation (Barry-Goldman pyramid, alpha = 0.5)
 * between 4 points P0, P1, P2, P3 for local parameter t in [0, 1].
 */
export function evaluateCatmullRom3D(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  t: number, // Parameter in [0, 1]
  alpha = 0.5,
): [number, number, number] {
  const dist12 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
  if (dist12 < 1e-8) {
    return [p1[0], p1[1], p1[2]];
  }
  const dt12 = Math.max(1e-4, dist12 ** alpha);
  const dist01 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]);
  const dist23 = Math.hypot(p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]);
  const dt01 = dist01 > 1e-6 ? dist01 ** alpha : dt12;
  const dt23 = dist23 > 1e-6 ? dist23 ** alpha : dt12;

  const t0 = 0.0;
  const t1 = t0 + dt01;
  const t2 = t1 + dt12;
  const t3 = t2 + dt23;
  const tau = t1 + t * (t2 - t1);

  const wA1_0 = (t1 - tau) / (t1 - t0);
  const wA1_1 = (tau - t0) / (t1 - t0);
  const wA2_1 = (t2 - tau) / (t2 - t1);
  const wA2_2 = (tau - t1) / (t2 - t1);
  const wA3_2 = (t3 - tau) / (t3 - t2);
  const wA3_3 = (tau - t2) / (t3 - t2);

  const wB1_1 = (t2 - tau) / (t2 - t0);
  const wB1_2 = (tau - t0) / (t2 - t0);
  const wB2_2 = (t3 - tau) / (t3 - t1);
  const wB2_3 = (tau - t1) / (t3 - t1);

  const out: [number, number, number] = [0, 0, 0];
  for (let axis = 0; axis < 3; axis++) {
    const a1 = wA1_0 * p0[axis] + wA1_1 * p1[axis];
    const a2 = wA2_1 * p1[axis] + wA2_2 * p2[axis];
    const a3 = wA3_2 * p2[axis] + wA3_3 * p3[axis];
    const b1 = wB1_1 * a1 + wB1_2 * a2;
    const b2 = wB2_2 * a2 + wB2_3 * a3;
    out[axis] = wA2_1 * b1 + wA2_2 * b2;
  }

  return out;
}

/**
 * Generates an exact multi-room fly-through tour trajectory coupled to a continuous
 * physical navigation episode, disclosing presentation duration vs physical simulation duration.
 */
export function generateMultiRoomTourRollout(
  keyframes: CameraKeyframe[] = CRAFTSMAN_TOUR_KEYFRAMES,
  totalFrames = 720,
  fps = 60,
  options: MultiRoomTourOptions = {},
): TourFrameSnapshot[] {
  const snapshots: TourFrameSnapshot[] = [];
  const numSegments = keyframes.length - 1;
  const episode = options.navigationEpisode ?? getDefaultTourNavigationEpisode();
  const beta = Math.max(0.0, Math.min(1.0, options.robotTrackingBlend ?? 0.25));
  const traj = episode.trajectory;
  const maxTrajIdx = Math.max(0, traj.length - 1);
  const presentationDurationSec = Math.max(1e-6, (totalFrames - 1) / fps);
  const physicalDurationSec =
    traj.length > 0 ? traj[maxTrajIdx].timeSeconds : episode.simulatedPhysicalSeconds;
  const playbackSpeedRatio = physicalDurationSec / presentationDurationSec;

  for (let frame = 0; frame < totalFrames; frame++) {
    const progress = totalFrames > 1 ? frame / (totalFrames - 1) : 0.0; // 0.0 to 1.0
    const globalT = progress * numSegments;
    const segmentIdx = Math.min(numSegments - 1, Math.floor(globalT));
    const localT = globalT - segmentIdx;

    // Cubic smoothstep for easing
    const easedT = localT * localT * (3.0 - 2.0 * localT);

    // 4-point window for Catmull-Rom
    const i0 = Math.max(0, segmentIdx - 1);
    const i1 = segmentIdx;
    const i2 = Math.min(keyframes.length - 1, segmentIdx + 1);
    const i3 = Math.min(keyframes.length - 1, segmentIdx + 2);

    const k0 = keyframes[i0];
    const k1 = keyframes[i1];
    const k2 = keyframes[i2];
    const k3 = keyframes[i3];

    const camPos = evaluateCatmullRom3D(k0.position, k1.position, k2.position, k3.position, easedT);
    const camPathTarget = evaluateCatmullRom3D(
      k0.target,
      k1.target,
      k2.target,
      k3.target,
      easedT,
    );

    // Sample continuous physical navigation trajectory at progress
    let robotPos: [number, number, number] = [0, 0.85, 0];
    let robotVel: [number, number] = [0, 0];
    let robotClearance = episode.minimumObstacleClearanceMeters;
    let simulatedPhysicalSeconds = progress * physicalDurationSec;

    if (traj.length > 0) {
      const trajFloatIdx = progress * maxTrajIdx;
      const idx0 = Math.min(maxTrajIdx, Math.floor(trajFloatIdx));
      const idx1 = Math.min(maxTrajIdx, idx0 + 1);
      const frac = trajFloatIdx - idx0;
      const s0 = traj[idx0];
      const s1 = traj[idx1];

      const rx = s0.position[0] + (s1.position[0] - s0.position[0]) * frac;
      const rz = s0.position[1] + (s1.position[1] - s0.position[1]) * frac;
      robotPos = [rx, 0.85, rz];
      robotVel = [
        s0.velocity[0] + (s1.velocity[0] - s0.velocity[0]) * frac,
        s0.velocity[1] + (s1.velocity[1] - s0.velocity[1]) * frac,
      ];
      robotClearance = s0.clearanceMeters + (s1.clearanceMeters - s0.clearanceMeters) * frac;
      simulatedPhysicalSeconds = s0.timeSeconds + (s1.timeSeconds - s0.timeSeconds) * frac;
    }

    // Look-At Target Damping & Blending: T(u) = (1 - beta) * T_cam_path(u) + beta * X_robot(u)
    const camTarget: [number, number, number] = [
      (1.0 - beta) * camPathTarget[0] + beta * robotPos[0],
      (1.0 - beta) * camPathTarget[1] + beta * robotPos[1],
      (1.0 - beta) * camPathTarget[2] + beta * robotPos[2],
    ];

    // Linear interpolation for scalars
    const fov = k1.fovDegrees + (k2.fovDegrees - k1.fovDegrees) * easedT;
    const exposure = k1.exposure + (k2.exposure - k1.exposure) * easedT;
    const bloomThreshold = k1.bloomThreshold + (k2.bloomThreshold - k1.bloomThreshold) * easedT;

    const currentRoom = easedT < 0.5 ? k1.room : k2.room;

    snapshots.push({
      frameIndex: frame,
      timeSeconds: frame / fps,
      simulatedPhysicalSeconds,
      playbackSpeedRatio,
      cameraPosition: camPos,
      cameraTarget: camTarget,
      cameraFov: fov,
      currentRoom,
      exposure,
      bloomThreshold,
      robotPosition: robotPos,
      robotVelocity: robotVel,
      robotClearanceMeters: robotClearance,
    });
  }

  return snapshots;
}
