// Visitor Mode 30-Second Showcase Clip Orchestrator (cmaes-feat-fs12-visitor).
//
// Implements an automated, reproducible, 1800-frame (30.00s @ 60 FPS) cinematic walkthrough
// orchestrator for landing page previews, video capture, and Open Graph reference recordings.
//
// Timeline Keypoints:
//   - 0.0s - 5.0s: Front porch arrival & volumetric sunbeam reveal.
//   - 5.0s - 12.0s: Parlor living room transit past glowing fireplace and rolling stool.
//   - 12.0s - 19.0s: Dining room navigation over hardwood floor with Hi-Z SSR reflections.
//   - 19.0s - 26.0s: Kitchen island approach & G1 arm pick-and-place reaching.
//   - 26.0s - 30.0s: Master bedroom & bath climax with full Honesty Chip Stack telemetry.

import {
  type HouseNavSimulationResult,
  runSegmentedHouseNavigation,
} from "./houseNavigationChain";
import { evaluateCatmullRom3D } from "./multiRoomTour";

export interface VisitorClipKeyframe {
  timeSeconds: number;
  cameraEye: [number, number, number];
  cameraTarget: [number, number, number];
  robotPosition: [number, number];
  robotHeading: number;
  activeRoom: string;
  lightingState: {
    sunbeamIntensity: number;
    fireplaceFlicker: number;
    ssrStrength: number;
  };
  highlightedChipId: string;
}

export const VISITOR_CLIP_KEYFRAMES: VisitorClipKeyframe[] = [
  {
    timeSeconds: 0.0,
    cameraEye: [0.35, 2.2, 5.2],
    cameraTarget: [0.35, 0.9, 4.2],
    robotPosition: [0.35, 4.82],
    robotHeading: -Math.PI / 2,
    activeRoom: "Front Porch",
    lightingState: { sunbeamIntensity: 1.0, fireplaceFlicker: 0.0, ssrStrength: 0.2 },
    highlightedChipId: "chip-volumetric-sunbeams",
  },
  {
    timeSeconds: 6.0,
    cameraEye: [-1.1, 1.85, 3.1],
    cameraTarget: [0.35, 0.85, 2.2],
    robotPosition: [0.35, 2.5],
    robotHeading: -Math.PI / 2,
    activeRoom: "Craftsman Parlor",
    lightingState: { sunbeamIntensity: 0.6, fireplaceFlicker: 1.0, ssrStrength: 0.5 },
    highlightedChipId: "chip-emissive-blackbody",
  },
  {
    timeSeconds: 13.0,
    cameraEye: [-1.4, 2.0, 0.6],
    cameraTarget: [0.12, 0.9, -0.08],
    robotPosition: [0.12, -0.08],
    robotHeading: 0.0,
    activeRoom: "Dining Room",
    lightingState: { sunbeamIntensity: 0.4, fireplaceFlicker: 0.4, ssrStrength: 0.85 },
    highlightedChipId: "chip-ssr-reflections",
  },
  {
    timeSeconds: 20.0,
    cameraEye: [2.4, 1.8, 0.8],
    cameraTarget: [1.16, 0.9, -0.05],
    robotPosition: [1.16, -0.05],
    robotHeading: Math.PI,
    activeRoom: "Kitchen Island",
    lightingState: { sunbeamIntensity: 0.8, fireplaceFlicker: 0.0, ssrStrength: 0.6 },
    highlightedChipId: "chip-segment-safe-cbf",
  },
  {
    timeSeconds: 26.0,
    cameraEye: [-3.1, 1.8, -1.2],
    cameraTarget: [-1.55, 0.85, -1.95],
    robotPosition: [-1.55, -1.95],
    robotHeading: -0.3,
    activeRoom: "Master Bedroom",
    lightingState: { sunbeamIntensity: 0.5, fireplaceFlicker: 0.0, ssrStrength: 0.4 },
    highlightedChipId: "chip-xpbd-soft",
  },
  {
    timeSeconds: 30.0,
    cameraEye: [0.2, 1.75, -1.8],
    cameraTarget: [1.0, 0.9, -2.5],
    robotPosition: [1.0, -2.5],
    robotHeading: 0.0,
    activeRoom: "Ensuite Bath Climax",
    lightingState: { sunbeamIntensity: 0.3, fireplaceFlicker: 0.0, ssrStrength: 0.95 },
    highlightedChipId: "chip-continuous-collision",
  },
];

export interface VisitorClipOptions {
  /** Pre-computed or custom physical navigation rollout; if omitted, simulated from CRAFTSMAN_BUNGALOW_1928. */
  navigationRollout?: HouseNavSimulationResult;
  /** When true, holds camera at static room keyframe vantages and disables rapid fireplace flicker. */
  reducedMotion?: boolean;
  /** Explicit autoplay flag (defaults to false so visitor presentation respects non-autoplay policy). */
  autoplay?: boolean;
}

export interface VisitorFramePacket {
  frameIndex: number;
  timeSeconds: number;
  /** Physical simulation time in seconds represented at this presentation frame. */
  simulatedPhysicalSeconds: number;
  /** Ratio of physical simulation duration to the 30s presentation duration. */
  playbackSpeedRatio: number;
  cameraEye: [number, number, number];
  cameraTarget: [number, number, number];
  robotPosition: [number, number];
  robotHeading: number;
  /** Signed obstacle clearance (m) of the physical robot at this step. */
  robotClearanceMeters: number;
  /** True if the underlying physical episode completed all rooms without collision. */
  episodeSuccess: boolean;
  /** True if any collision occurred in the underlying physical episode. */
  collisionOccurred: boolean;
  /** Whether reduced-motion mode is active for this frame. */
  reducedMotion: boolean;
  /** Whether autoplay was enabled for this clip. */
  autoplay: boolean;
  activeRoom: string;
  lightingState: {
    sunbeamIntensity: number;
    fireplaceFlicker: number;
    ssrStrength: number;
  };
  highlightedChipId: string;
}

let cachedDefaultVisitorRollout: HouseNavSimulationResult | null = null;
function getDefaultVisitorRollout(): HouseNavSimulationResult {
  if (!cachedDefaultVisitorRollout) {
    cachedDefaultVisitorRollout = runSegmentedHouseNavigation(
      undefined,
      undefined,
      250,
      2500,
      1 / 60,
    );
  }
  return cachedDefaultVisitorRollout;
}

/**
 * Generates exact 1800-frame (30-second @ 60 FPS) visitor showcase playback trajectory
 * backed by a certified physical `HouseNavSimulationResult` episode (`cmaes-feat-fs12-visitor-b5e`).
 */
export function generateVisitorModeClip(
  keyframes: VisitorClipKeyframe[] = VISITOR_CLIP_KEYFRAMES,
  totalFrames = 1800,
  fps = 60,
  options: VisitorClipOptions = {},
): VisitorFramePacket[] {
  const frames: VisitorFramePacket[] = [];
  const durationSec = totalFrames / fps;
  const reducedMotion = options.reducedMotion ?? false;
  const autoplay = options.autoplay ?? false;

  const navRollout = options.navigationRollout ?? getDefaultVisitorRollout();
  const navTraj = navRollout.trajectory;
  const physicalDurationSec = navRollout.simulatedPhysicalSeconds;
  const playbackSpeedRatio = durationSec > 1e-6 ? physicalDurationSec / durationSec : 1.0;

  for (let f = 0; f < totalFrames; f++) {
    const progress = totalFrames > 1 ? f / (totalFrames - 1) : 0.0;
    const tSec = progress * durationSec;
    const simSec = progress * physicalDurationSec;

    // Find bounding keyframes
    let kIdx = 0;
    while (kIdx < keyframes.length - 2 && keyframes[kIdx + 1].timeSeconds <= tSec) {
      kIdx++;
    }

    const k1 = keyframes[kIdx];
    const k2 = keyframes[Math.min(keyframes.length - 1, kIdx + 1)];
    const segDuration = Math.max(1e-4, k2.timeSeconds - k1.timeSeconds);
    const u = Math.max(0.0, Math.min(1.0, (tSec - k1.timeSeconds) / segDuration));

    // Smoothstep interpolation (or static keyframe snap under reducedMotion)
    const smoothU = reducedMotion ? 0.0 : u * u * (3.0 - 2.0 * u);

    const i0 = Math.max(0, kIdx - 1);
    const i1 = kIdx;
    const i2 = Math.min(keyframes.length - 1, kIdx + 1);
    const i3 = Math.min(keyframes.length - 1, kIdx + 2);

    const eye: [number, number, number] = reducedMotion
      ? [...k1.cameraEye]
      : evaluateCatmullRom3D(
          keyframes[i0].cameraEye,
          keyframes[i1].cameraEye,
          keyframes[i2].cameraEye,
          keyframes[i3].cameraEye,
          smoothU,
        );

    const splineTarget: [number, number, number] = reducedMotion
      ? [...k1.cameraTarget]
      : evaluateCatmullRom3D(
          keyframes[i0].cameraTarget,
          keyframes[i1].cameraTarget,
          keyframes[i2].cameraTarget,
          keyframes[i3].cameraTarget,
          smoothU,
        );

    // Sample physical robot state from the certified navigation rollout
    let robX = k1.robotPosition[0] + (k2.robotPosition[0] - k1.robotPosition[0]) * smoothU;
    let robZ = k1.robotPosition[1] + (k2.robotPosition[1] - k1.robotPosition[1]) * smoothU;
    let robYaw = k1.robotHeading + (k2.robotHeading - k1.robotHeading) * smoothU;
    let robClearance = navRollout.minimumObstacleClearanceMeters;

    if (navTraj.length > 0) {
      const fIdx = progress * (navTraj.length - 1);
      const idx0 = Math.min(navTraj.length - 1, Math.floor(fIdx));
      const idx1 = Math.min(navTraj.length - 1, idx0 + 1);
      const alpha = fIdx - idx0;
      const s0 = navTraj[idx0];
      const s1 = navTraj[idx1];
      robX = s0.position[0] + (s1.position[0] - s0.position[0]) * alpha;
      robZ = s0.position[1] + (s1.position[1] - s0.position[1]) * alpha;
      const yaw0 =
        Math.hypot(s0.velocity[0], s0.velocity[1]) > 1e-4
          ? Math.atan2(s0.velocity[1], s0.velocity[0])
          : robYaw;
      const yaw1 =
        Math.hypot(s1.velocity[0], s1.velocity[1]) > 1e-4
          ? Math.atan2(s1.velocity[1], s1.velocity[0])
          : yaw0;
      robYaw = yaw0 + (yaw1 - yaw0) * alpha;
      robClearance = s0.clearanceMeters + (s1.clearanceMeters - s0.clearanceMeters) * alpha;
    }

    const sun =
      k1.lightingState.sunbeamIntensity +
      (k2.lightingState.sunbeamIntensity - k1.lightingState.sunbeamIntensity) * smoothU;
    const fire = reducedMotion
      ? 0.5 * (k1.lightingState.fireplaceFlicker + k2.lightingState.fireplaceFlicker)
      : k1.lightingState.fireplaceFlicker +
        (k2.lightingState.fireplaceFlicker - k1.lightingState.fireplaceFlicker) * smoothU;
    const ssr =
      k1.lightingState.ssrStrength +
      (k2.lightingState.ssrStrength - k1.lightingState.ssrStrength) * smoothU;

    frames.push({
      frameIndex: f,
      timeSeconds: tSec,
      simulatedPhysicalSeconds: simSec,
      playbackSpeedRatio,
      cameraEye: eye,
      cameraTarget: splineTarget,
      robotPosition: [robX, robZ],
      robotHeading: robYaw,
      robotClearanceMeters: robClearance,
      episodeSuccess: navRollout.allWaypointsReached,
      collisionOccurred: navRollout.collisionOccurred,
      reducedMotion,
      autoplay,
      activeRoom: u < 0.5 ? k1.activeRoom : k2.activeRoom,
      lightingState: {
        sunbeamIntensity: sun,
        fireplaceFlicker: fire,
        ssrStrength: ssr,
      },
      highlightedChipId: u < 0.5 ? k1.highlightedChipId : k2.highlightedChipId,
    });
  }

  return frames;
}

