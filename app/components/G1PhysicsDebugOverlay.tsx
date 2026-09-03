"use client";

// G1PhysicsDebugOverlay — visual inspection surface for the drag guard.
// It renders:
//
//   1. The 30 body-link pose envelopes as cyan wireframe outlines. These are
//      orientation aids sized like the rendered links; they are not the
//      collision guard's owning geometry.
//   2. The 74+ house OBB obstacles as red wireframe boxes with their
//      actual yaw rotation.
//   3. A safety ring on the ground at the robot's current pelvis
//      position with the 0.32 m safe radius. This is the same
//      sphere clampPositionAgainstHouseCollisions uses as the proxy
//      for the full body — when the safety ring intersects a red
//      obstacle box, the dragger will be flagged isColliding.
//
// The collision guard currently owns the yellow pelvis proxy and the red house
// obstacles. The overlay is OFF by default and allocates no edge geometry until
// the user enables it.

import React from "react";
import * as THREE from "three";
import type { G1TraceSample } from "../lib/frankensimCmaes";
import type { OrientedBoundingBox } from "../lib/houseMultiObstacleKernel";

// 30-link body pose-envelope radii, sized to the RobotPose rendering. These
// are visual aids only; the drag guard uses the separate pelvis safety proxy.
const LINK_RADIUS: Record<string, number> = {
  pelvis: 0.075,
  torso: 0.065,
  "left hip pitch": 0.042,
  "left hip roll": 0.042,
  "left hip yaw": 0.042,
  "left knee": 0.042,
  "left ankle pitch": 0.042,
  "left ankle roll": 0.042,
  "right hip pitch": 0.042,
  "right hip roll": 0.042,
  "right hip yaw": 0.042,
  "right knee": 0.042,
  "right ankle pitch": 0.042,
  "right ankle roll": 0.042,
  "waist yaw": 0.055,
  "waist roll": 0.055,
  "left shoulder pitch": 0.055,
  "left shoulder roll": 0.042,
  "left shoulder yaw": 0.042,
  "left elbow": 0.042,
  "left wrist roll": 0.042,
  "left wrist pitch": 0.042,
  "left wrist yaw": 0.042,
  "right shoulder pitch": 0.055,
  "right shoulder roll": 0.042,
  "right shoulder yaw": 0.042,
  "right elbow": 0.042,
  "right wrist roll": 0.042,
  "right wrist pitch": 0.042,
  "right wrist yaw": 0.042,
};

function ownerToThree(position: readonly number[]): [number, number, number] {
  // owner frame is x-forward, y-left, z-up; three is x-right, y-up, z-back
  return [position[0], position[2], -position[1]];
}

export interface G1PhysicsDebugOverlayProps {
  enabled: boolean;
  sample: G1TraceSample | null;
  obstacles: OrientedBoundingBox[];
  pelvisPosition: [number, number, number];
  safeRadius?: number;
}

export function G1PhysicsDebugOverlay({
  enabled,
  sample,
  obstacles,
  pelvisPosition,
  safeRadius = 0.32,
}: G1PhysicsDebugOverlayProps) {
  // Hooks remain unconditional so toggling the overlay cannot change hook
  // order. Disabled renders allocate no Three.js edge geometry.
  const obstacleEdges = React.useMemo(() => {
    if (!enabled) return [];
    return obstacles.map((obb) => {
      const geometry = new THREE.BoxGeometry(
        obb.halfExtents[0] * 2,
        obb.halfExtents[1] * 2,
        obb.halfExtents[2] * 2,
      );
      const edges = new THREE.EdgesGeometry(geometry);
      geometry.dispose();
      return { edges, obb };
    });
  }, [enabled, obstacles]);
  React.useEffect(
    () => () => {
      for (const { edges } of obstacleEdges) edges.dispose();
    },
    [obstacleEdges],
  );

  if (!enabled) return null;

  const samplePelvis = sample
    ? ownerToThree(sample.linkPoses[0]?.position ?? [0, 0, 0])
    : pelvisPosition;
  const bodyOffset: [number, number, number] = [
    pelvisPosition[0] - samplePelvis[0],
    pelvisPosition[1] - samplePelvis[1],
    pelvisPosition[2] - samplePelvis[2],
  ];

  return (
    <group>
      {/* 2. House OBB obstacles — red wireframe boxes with yaw */}
      {obstacleEdges.map(({ edges, obb }, idx) => (
        <lineSegments
          key={`obb-${idx}-${obb.name}`}
          geometry={edges}
          position={[
            obb.center[0],
            obb.center[1],
            obb.center[2],
          ]}
          rotation={[0, obb.rotationYawRad, 0]}
        >
          <lineBasicMaterial
            color="#f43f5e"
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </lineSegments>
      ))}

      {/* 4. Ground projection of the safety sphere */}
      <mesh
        position={[pelvisPosition[0], 0.02, pelvisPosition[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[safeRadius, safeRadius + 0.04, 32]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Link-name table — same order as G1WalkingFlagship LINK_NAMES. We
// keep a local copy so the overlay is decoupled from the flagship's
// internal layout.
const G1_LINK_NAMES: readonly string[] = [
  "pelvis",
  "left hip pitch",
  "left hip roll",
  "left hip yaw",
  "left knee",
  "left ankle pitch",
  "left ankle roll",
  "right hip pitch",
  "right hip roll",
  "right hip yaw",
  "right knee",
  "right ankle pitch",
  "right ankle roll",
  "waist yaw",
  "waist roll",
  "torso",
  "left shoulder pitch",
  "left shoulder roll",
  "left shoulder yaw",
  "left elbow",
  "left wrist roll",
  "left wrist pitch",
  "left wrist yaw",
  "right shoulder pitch",
  "right shoulder roll",
  "right shoulder yaw",
  "right elbow",
  "right wrist roll",
  "right wrist pitch",
  "right wrist yaw",
];
