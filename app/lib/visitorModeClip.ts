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
    cameraEye: [0.0, 2.5, -4.5],
    cameraTarget: [1.5, 0.9, -2.5],
    robotPosition: [1.5, -2.5],
    robotHeading: 0.0,
    activeRoom: "Front Porch",
    lightingState: { sunbeamIntensity: 1.0, fireplaceFlicker: 0.0, ssrStrength: 0.2 },
    highlightedChipId: "chip-volumetric-sunbeams",
  },
  {
    timeSeconds: 6.0,
    cameraEye: [0.5, 1.8, -0.8],
    cameraTarget: [2.0, 0.8, 1.0],
    robotPosition: [1.5, 0.0],
    robotHeading: 0.2,
    activeRoom: "Craftsman Parlor",
    lightingState: { sunbeamIntensity: 0.6, fireplaceFlicker: 1.0, ssrStrength: 0.5 },
    highlightedChipId: "chip-emissive-blackbody",
  },
  {
    timeSeconds: 13.0,
    cameraEye: [2.0, 2.2, 0.5],
    cameraTarget: [3.5, 0.9, 1.8],
    robotPosition: [3.5, 1.2],
    robotHeading: 0.5,
    activeRoom: "Dining Room",
    lightingState: { sunbeamIntensity: 0.4, fireplaceFlicker: 0.4, ssrStrength: 0.85 },
    highlightedChipId: "chip-ssr-reflections",
  },
  {
    timeSeconds: 20.0,
    cameraEye: [3.2, 1.7, 2.5],
    cameraTarget: [4.5, 0.9, 3.8],
    robotPosition: [4.5, 3.5],
    robotHeading: 0.0,
    activeRoom: "Kitchen Island",
    lightingState: { sunbeamIntensity: 0.8, fireplaceFlicker: 0.0, ssrStrength: 0.6 },
    highlightedChipId: "chip-segment-safe-cbf",
  },
  {
    timeSeconds: 26.0,
    cameraEye: [2.2, 1.8, 4.8],
    cameraTarget: [1.0, 0.8, 5.8],
    robotPosition: [1.0, 5.5],
    robotHeading: -0.3,
    activeRoom: "Master Bedroom",
    lightingState: { sunbeamIntensity: 0.5, fireplaceFlicker: 0.0, ssrStrength: 0.4 },
    highlightedChipId: "chip-xpbd-soft",
  },
  {
    timeSeconds: 30.0,
    cameraEye: [1.8, 1.7, 5.8],
    cameraTarget: [3.0, 1.0, 6.6],
    robotPosition: [3.0, 6.5],
    robotHeading: 0.0,
    activeRoom: "Ensuite Bath Climax",
    lightingState: { sunbeamIntensity: 0.3, fireplaceFlicker: 0.0, ssrStrength: 0.95 },
    highlightedChipId: "chip-continuous-collision",
  },
];

export interface VisitorFramePacket {
  frameIndex: number;
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

/**
 * Generates exact 1800-frame (30-second @ 60 FPS) visitor showcase playback trajectory.
 */
export function generateVisitorModeClip(
  keyframes: VisitorClipKeyframe[] = VISITOR_CLIP_KEYFRAMES,
  totalFrames = 1800,
  fps = 60,
): VisitorFramePacket[] {
  const frames: VisitorFramePacket[] = [];
  const durationSec = totalFrames / fps;

  for (let f = 0; f < totalFrames; f++) {
    const tSec = (f / (totalFrames - 1)) * durationSec;

    // Find bounding keyframes
    let kIdx = 0;
    while (kIdx < keyframes.length - 2 && keyframes[kIdx + 1].timeSeconds <= tSec) {
      kIdx++;
    }

    const k1 = keyframes[kIdx];
    const k2 = keyframes[Math.min(keyframes.length - 1, kIdx + 1)];
    const segDuration = Math.max(1e-4, k2.timeSeconds - k1.timeSeconds);
    const u = Math.max(0.0, Math.min(1.0, (tSec - k1.timeSeconds) / segDuration));

    // Smoothstep interpolation
    const smoothU = u * u * (3.0 - 2.0 * u);

    const i0 = Math.max(0, kIdx - 1);
    const i1 = kIdx;
    const i2 = Math.min(keyframes.length - 1, kIdx + 1);
    const i3 = Math.min(keyframes.length - 1, kIdx + 2);

    const eye = evaluateCatmullRom3D(
      keyframes[i0].cameraEye,
      keyframes[i1].cameraEye,
      keyframes[i2].cameraEye,
      keyframes[i3].cameraEye,
      smoothU,
    );

    const target = evaluateCatmullRom3D(
      keyframes[i0].cameraTarget,
      keyframes[i1].cameraTarget,
      keyframes[i2].cameraTarget,
      keyframes[i3].cameraTarget,
      smoothU,
    );

    const robX = k1.robotPosition[0] + (k2.robotPosition[0] - k1.robotPosition[0]) * smoothU;
    const robZ = k1.robotPosition[1] + (k2.robotPosition[1] - k1.robotPosition[1]) * smoothU;
    const robYaw = k1.robotHeading + (k2.robotHeading - k1.robotHeading) * smoothU;

    const sun =
      k1.lightingState.sunbeamIntensity +
      (k2.lightingState.sunbeamIntensity - k1.lightingState.sunbeamIntensity) * smoothU;
    const fire =
      k1.lightingState.fireplaceFlicker +
      (k2.lightingState.fireplaceFlicker - k1.lightingState.fireplaceFlicker) * smoothU;
    const ssr =
      k1.lightingState.ssrStrength +
      (k2.lightingState.ssrStrength - k1.lightingState.ssrStrength) * smoothU;

    frames.push({
      frameIndex: f,
      timeSeconds: tSec,
      cameraEye: eye,
      cameraTarget: target,
      robotPosition: [robX, robZ],
      robotHeading: robYaw,
      activeRoom: smoothU < 0.5 ? k1.activeRoom : k2.activeRoom,
      lightingState: {
        sunbeamIntensity: sun,
        fireplaceFlicker: fire,
        ssrStrength: ssr,
      },
      highlightedChipId: smoothU < 0.5 ? k1.highlightedChipId : k2.highlightedChipId,
    });
  }

  return frames;
}
