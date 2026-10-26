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
import {
  DifferentiableSceneSDF,
  DifferentiableSdfNode,
  evalGradientAndHessian,
  raymarchDifferentiableSdf,
  smaxPoly,
  sminLse,
  sminPoly,
} from "../lib/differentiableSdf";
import type { G1TraceSample } from "../lib/frankensimCmaes";
import { type OrientedBoundingBox, stageBoxRenderTransform } from "../lib/houseMultiObstacleKernel";
import {
  buildG1CapsulesFromIK,
  computeImpulseResponse,
  G1_KINEMATICS,
  solveTwoBoneIK,
} from "../lib/humanoidRagdollIk";
import { checkG1SelfCollision, type LinkCapsule } from "../lib/robotSelfCollision";

export interface G1DifferentiableSdfAndImpulseDiagnostic {
  impulseDeltaV: [number, number, number];
  capturePointRecoveryStepOffset: [number, number, number];
  recoveryKneePosition: [number, number, number];
  capsuleCount: number;
  diffSceneDistance: number;
  diffSceneGradient: [number, number, number];
  hessianTrace: number;
  raymarchHit: boolean;
  raymarchDistance: number;
  smoothOpsCheck: {
    sminPolyVal: number;
    sminLseVal: number;
    smaxPolyVal: number;
  };
}

/**
 * Evaluates capture-point push-recovery stepping reflex (`computeImpulseResponse` + `solveTwoBoneIK`),
 * `buildG1CapsulesFromIK`, and differentiable scene SDF gradients, Hessians, and sphere-traced raymarching
 * for a G1 pelvis pose (`cmaes-za0x.16`, `cmaes-feat-cl10-neural-gbn`).
 */
export function evaluateG1DifferentiableSdfAndImpulseDiagnostics(
  pelvisPosition: [number, number, number] = [0, 0.75, 0],
  obstacles: readonly OrientedBoundingBox[] = [],
  impulseNs = 15.0,
  impulseAngleRad = 0.0,
): G1DifferentiableSdfAndImpulseDiagnostic {
  const impulse = computeImpulseResponse(impulseNs, impulseAngleRad);
  const stepTarget: [number, number, number] = [
    pelvisPosition[0] + impulse.recoveryStepOffset[0],
    0.04,
    pelvisPosition[2] - G1_KINEMATICS.hipWidth * 0.5 + impulse.recoveryStepOffset[2],
  ];
  const leftLegIk = solveTwoBoneIK(
    pelvisPosition,
    stepTarget,
    G1_KINEMATICS.thighLength,
    G1_KINEMATICS.shinLength,
    [1, 0, 0],
  );
  const capsules = buildG1CapsulesFromIK({
    pelvisPosition,
    torsoPosition: [pelvisPosition[0], pelvisPosition[1] + 0.2, pelvisPosition[2]],
    headPosition: [pelvisPosition[0], pelvisPosition[1] + 0.5, pelvisPosition[2]],
    leftKneePosition: leftLegIk.midPosition,
    rightKneePosition: [pelvisPosition[0], pelvisPosition[1] - 0.35, pelvisPosition[2] + 0.11],
    leftFootPosition: leftLegIk.reachedTarget,
    rightFootPosition: [pelvisPosition[0], 0.04, pelvisPosition[2] + 0.11],
    leftElbowPosition: [pelvisPosition[0], pelvisPosition[1] + 0.1, pelvisPosition[2] - 0.2],
    rightElbowPosition: [pelvisPosition[0], pelvisPosition[1] + 0.1, pelvisPosition[2] + 0.2],
    leftHandPosition: [pelvisPosition[0] + 0.15, pelvisPosition[1], pelvisPosition[2] - 0.22],
    rightHandPosition: [pelvisPosition[0] + 0.15, pelvisPosition[1], pelvisPosition[2] + 0.22],
  });

  const diffScene = new DifferentiableSceneSDF();
  diffScene.addPlane([0, 1, 0], 0);
  for (let i = 0; i < Math.min(4, obstacles.length); i++) {
    const obb = obstacles[i];
    diffScene.addBox(obb.center, obb.halfExtents);
  }
  const sceneEval = diffScene.evaluate(pelvisPosition);
  const node = new DifferentiableSdfNode((p) => diffScene.evaluate(p).distance, "g1_scene_sdf");
  const gradHess = evalGradientAndHessian(node.evalDistance, pelvisPosition);
  const hessianTrace =
    gradHess.hessian[0][0] + gradHess.hessian[1][1] + gradHess.hessian[2][2];
  const rayRes = raymarchDifferentiableSdf(node, pelvisPosition, [0, -1, 0], 5.0);

  const smoothOpsCheck = {
    sminPolyVal: sminPoly(0.25, 0.3, 0.1).val,
    sminLseVal: sminLse(0.25, 0.3, 0.1).val,
    smaxPolyVal: smaxPoly(0.25, 0.3, 0.1).val,
  };

  return {
    impulseDeltaV: impulse.deltaV,
    capturePointRecoveryStepOffset: impulse.recoveryStepOffset,
    recoveryKneePosition: leftLegIk.midPosition,
    capsuleCount: capsules.length,
    diffSceneDistance: sceneEval.distance,
    diffSceneGradient: sceneEval.gradient,
    hessianTrace,
    raymarchHit: rayRes.hit,
    raymarchDistance: rayRes.distance,
    smoothOpsCheck,
  };
}

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
  /**
   * Height for the ground projection [m]. The floor sits at y = -0.005 but
   * the terrain challenge raises the walking surface by an owner-reported
   * amplitude, and a fixed 2 cm ring was being swallowed by the crests: the
   * caller passes a height that clears whatever surface is actually there.
   */
  groundProjectionY?: number;
}

export function G1PhysicsDebugOverlay({
  enabled,
  sample,
  obstacles,
  pelvisPosition,
  safeRadius = 0.32,
  groundProjectionY = 0.03,
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

  const worldLinkPoses = sample
    ? sample.linkPoses.map((pose, idx) => {
        const p = ownerToThree(pose.position);
        const linkName = G1_LINK_NAMES[idx] ?? `link_${idx}`;
        const canonicalName = linkName.replace(/\s+/g, "_");
        return {
          idx,
          linkName,
          canonicalName,
          radius: LINK_RADIUS[linkName] ?? 0.042,
          pos: [p[0] + bodyOffset[0], p[1] + bodyOffset[1], p[2] + bodyOffset[2]] as [
            number,
            number,
            number,
          ],
        };
      })
    : [];

  const collidingLinkNames = new Set<string>();
  if (worldLinkPoses.length > 1) {
    const capsules: LinkCapsule[] = [];
    for (let i = 0; i < worldLinkPoses.length - 1; i++) {
      const curr = worldLinkPoses[i];
      const next = worldLinkPoses[i + 1];
      capsules.push({
        name: curr.canonicalName,
        start: curr.pos,
        end: next.pos,
        radius: curr.radius * 0.5,
      });
    }
    const selfCol = checkG1SelfCollision(capsules, 0.002);
    for (const pair of selfCol.collidingPairs) {
      collidingLinkNames.add(pair.linkA);
      collidingLinkNames.add(pair.linkB);
    }
  }

  return (
    <group>
      {/* 1. 30 G1 body-link pose envelopes (cyan when clear, amber on self-collision) */}
      {worldLinkPoses.map((link) => {
        const isSelfColliding = collidingLinkNames.has(link.canonicalName);
        return (
          <mesh key={`g1-link-${link.idx}`} position={link.pos}>
            <sphereGeometry args={[link.radius, 8, 6]} />
            <meshBasicMaterial
              color={isSelfColliding ? "#f97316" : "#22d3ee"}
              wireframe
              transparent
              opacity={isSelfColliding ? 0.8 : 0.35}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* 2. House OBB obstacles — red wireframe boxes with yaw */}
      {obstacleEdges.map(({ edges, obb }, idx) => (
        <lineSegments
          key={`obb-${idx}-${obb.name}`}
          geometry={edges}
          position={[obb.center[0], obb.center[1], obb.center[2]]}
          rotation={stageBoxRenderTransform(obb).rotation}
        >
          <lineBasicMaterial color="#f43f5e" transparent opacity={0.55} depthWrite={false} />
        </lineSegments>
      ))}

      {/* 4. Ground projection of the safety sphere */}
      <mesh
        position={[pelvisPosition[0], groundProjectionY, pelvisPosition[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[safeRadius, safeRadius + 0.04, 32]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
          // Height alone stops the ring being buried; the polygon offset stops
          // the remaining near-coplanar case from flickering when the camera
          // grazes the floor and depth precision collapses.
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      {/* 5. Capture-point recovery step preview ring (12 N·s forward impulse) */}
      {(() => {
        const impulse = computeImpulseResponse(12.0, 0.0);
        return (
          <mesh
            position={[
              pelvisPosition[0] + impulse.recoveryStepOffset[0],
              groundProjectionY,
              pelvisPosition[2] + impulse.recoveryStepOffset[2],
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.04, 0.06, 16]} />
            <meshBasicMaterial
              color="#34d399"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        );
      })()}
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
