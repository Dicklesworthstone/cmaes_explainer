"use client";

// ArmPhysicsDebugOverlay — visualization of the arm collision-guard chain.
//
// The user complained "the arm CANNOT go through objects, EVER" and
// "the arm CANNOT go outside its workspace." This overlay shows the
// actual geometry the guard operates on, so the user can SEE:
//
//   1. The 8 KUKA link wireframe spheres (cyan) — one per iiwa_link_0
//      through iiwa_link_7, sized by their nominal link radius.
//   2. The reachable workspace as a translucent green point cloud,
//      computed once at module load by sampling the DLS-IK joint limits
//      and forward-kinematics. The user can verify a drag is being
//      rejected because the target is outside this cloud.
//   3. The 74+ house OBB obstacles (red wireframe) with their actual
//      yaw rotation. The clampArmTargetPosition primitive operates on
//      these boxes; when the user drags into a red box, the dragger
//      clamps the target out.
//   4. A yellow safety sphere around the current drag target with the
//      0.04 m margin the clamp uses. When the safety sphere touches a
//      red box, the dragger flags isColliding.
//
// The overlay is OFF by default. Toggle with the "🔧 Physics" button
// in the arm flagship top-right cluster. When OFF, it allocates or uploads no
// debug geometry and returns null.

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  computeKukaFK,
  KUKA_AUXILIARY_JOINT_LIMITS,
  KUKA_LINK_LENGTHS,
} from "../lib/armInverseKinematics";
import type { OrientedBoundingBox } from "../lib/houseMultiObstacleKernel";
import type {
  HouseholdManipulationAdmission,
  HouseholdManipulationTraceSample,
} from "../lib/frankensimCmaes";
import { resolveRenderedGripperContactGeometry } from "../lib/armContactPhysics";

// Module-level cache of the reachable workspace point cloud. Computing
// it on every render would be wasteful; the joint limits are constants
// so the result is invariant.
function deterministicUnitSample(index: number, stream: number): number {
  let value = (index + 1 + stream * 0x9e3779b9) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d);
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b);
  value ^= value >>> 16;
  return value / 0x1_0000_0000;
}

const REACHABLE_WORKSPACE_POINTS: Float32Array = (() => {
  const n = 800; // 800 sampled joint configurations
  const positions = new Float32Array(n * 3);
  let i = 0;
  for (let k = 0; k < n; k++) {
    // Sample 4 active joints (matching the DLS solver's activeJoints
    // set: [0, 1, 3, 5]); the other 3 are pass-through joints that
    // don't move the end-effector in the reduced surrogate.
    const q0 = THREE.MathUtils.lerp(
      KUKA_AUXILIARY_JOINT_LIMITS[0].min,
      KUKA_AUXILIARY_JOINT_LIMITS[0].max,
      deterministicUnitSample(k, 0),
    );
    const q1 = THREE.MathUtils.lerp(
      KUKA_AUXILIARY_JOINT_LIMITS[1].min,
      KUKA_AUXILIARY_JOINT_LIMITS[1].max,
      deterministicUnitSample(k, 1),
    );
    const q3 = THREE.MathUtils.lerp(
      KUKA_AUXILIARY_JOINT_LIMITS[3].min,
      KUKA_AUXILIARY_JOINT_LIMITS[3].max,
      deterministicUnitSample(k, 2),
    );
    const q5 = THREE.MathUtils.lerp(
      KUKA_AUXILIARY_JOINT_LIMITS[5].min,
      KUKA_AUXILIARY_JOINT_LIMITS[5].max,
      deterministicUnitSample(k, 3),
    );
    const { endEffector } = computeKukaFK([q0, q1, 0, q3, 0, q5, 0]);
    positions[i++] = endEffector[0];
    positions[i++] = endEffector[1];
    positions[i++] = endEffector[2];
  }
  return positions;
})();

// 8-link radius table. Must match the visual link dimensions used
// when rendering the KUKA arm in HouseholdArmFlagship.
const LINK_RADIUS: readonly number[] = [
  0.10, // iiwa_link_0 (base)
  0.10, // iiwa_link_1 (shoulder turret)
  0.07, // iiwa_link_2 (upper arm)
  0.07, // iiwa_link_3 (elbow)
  0.06, // iiwa_link_4 (forearm)
  0.06, // iiwa_link_5 (wrist roll)
  0.05, // iiwa_link_6 (wrist pitch)
  0.04, // iiwa_link_7 (flange)
];

function ownerToThree(position: readonly number[]): [number, number, number] {
  // owner frame is x-forward, y-left, z-up; three is x-right, y-up, z-back
  return [position[0], position[2], -position[1]];
}

export interface ArmPhysicsDebugOverlayProps {
  enabled: boolean;
  sample: HouseholdManipulationTraceSample | null;
  admission: HouseholdManipulationAdmission;
  obstacles: OrientedBoundingBox[];
  targetPosition: [number, number, number] | null;
  safeRadius?: number;
}

export function ArmPhysicsDebugOverlay({
  enabled,
  sample,
  admission,
  obstacles,
  targetPosition,
  safeRadius = 0.04,
}: ArmPhysicsDebugOverlayProps) {
  // Pre-build the OBB wireframe geometry once per overlay mount.
  // Hooks remain unconditional so toggling the overlay cannot change
  // hook order; disabled mode avoids all debug-geometry allocation.
  const obstacleEdges = useMemo(() => {
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

  // Buffer geometry for the reachable workspace point cloud.
  const workspaceGeometry = useMemo(() => {
    if (!enabled) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(REACHABLE_WORKSPACE_POINTS, 3),
    );
    return geometry;
  }, [enabled]);

  useEffect(() => {
    return () => {
      for (const { edges } of obstacleEdges) edges.dispose();
    };
  }, [obstacleEdges]);

  useEffect(() => {
    return () => workspaceGeometry?.dispose();
  }, [workspaceGeometry]);

  if (!enabled) return null;
  if (!workspaceGeometry) return null;

  const objectDimensions = admission.scene.objectDimensionsMeters;
  const objectThreeDimensions: [number, number, number] = [
    objectDimensions[0],
    objectDimensions[2],
    objectDimensions[1],
  ];
  const objectPosition = sample ? ownerToThree(sample.objectPose.position) : null;
  const objectQuaternion = sample
    ? [
        sample.objectPose.quaternionWxyz[1],
        sample.objectPose.quaternionWxyz[3],
        -sample.objectPose.quaternionWxyz[2],
        sample.objectPose.quaternionWxyz[0],
      ] as [number, number, number, number]
    : null;
  const gripperGeometry = sample
    ? resolveRenderedGripperContactGeometry({
        commandedGripperWidthM: sample.gripperWidthMeters,
        graspHalfWidthM: admission.scene.graspHalfWidthMeters,
        objectHalfHeightM: objectDimensions[2] * 0.5,
      })
    : null;
  const gripperPose = sample?.linkPoses[7];
  const gripperPosition = gripperPose ? ownerToThree(gripperPose.position) : null;
  const gripperQuaternion = gripperPose
    ? [
        gripperPose.quaternionWxyz[1],
        gripperPose.quaternionWxyz[3],
        -gripperPose.quaternionWxyz[2],
        gripperPose.quaternionWxyz[0],
      ] as [number, number, number, number]
    : null;

  return (
    <group>
      {/* 1. 8 KUKA link wireframe spheres — cyan */}
      {sample
        ? sample.linkPoses.map((pose, idx) => {
            const r = LINK_RADIUS[idx] ?? 0.05;
            const pos = ownerToThree(pose.position);
            return (
              <mesh key={`col-${idx}`} position={pos}>
                <sphereGeometry args={[r, 8, 6]} />
                <meshBasicMaterial
                  color="#22d3ee"
                  wireframe
                  transparent
                  opacity={0.45}
                />
              </mesh>
            );
          })
        : null}

      {/* 2. Reachable workspace — translucent green point cloud */}
      <points geometry={workspaceGeometry}>
        <pointsMaterial
          color="#10b981"
          size={0.012}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>

      {/* 3. House OBB obstacles — red wireframe boxes with yaw */}
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

      {/* 4. Arm base safety sphere — yellow wireframe (max reach) */}
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry
          args={[
            KUKA_LINK_LENGTHS.upperArm +
              KUKA_LINK_LENGTHS.forearm +
              KUKA_LINK_LENGTHS.flange +
              KUKA_LINK_LENGTHS.gripperLength,
            16,
            12,
          ]}
        />
        <meshBasicMaterial
          color="#facc15"
          wireframe
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      {/* 5. Target safety sphere — yellow wireframe (clamp margin) */}
      {targetPosition ? (
        <mesh position={targetPosition}>
          <sphereGeometry args={[safeRadius, 12, 8]} />
          <meshBasicMaterial
            color="#facc15"
            wireframe
            transparent
            opacity={0.75}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {objectPosition && objectQuaternion ? (
        <mesh position={objectPosition} quaternion={objectQuaternion}>
          <boxGeometry args={objectThreeDimensions} />
          <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.9} depthWrite={false} />
        </mesh>
      ) : null}

      {gripperGeometry && gripperPosition && gripperQuaternion ? (
        <group position={gripperPosition} quaternion={gripperQuaternion}>
          <mesh position={[-gripperGeometry.fingerCenterHalfWidthM, 0, 0]}>
            <boxGeometry args={[0.014, 0.11, 0.028]} />
            <meshBasicMaterial color="#fde047" wireframe transparent opacity={0.9} depthWrite={false} />
          </mesh>
          <mesh position={[gripperGeometry.fingerCenterHalfWidthM, 0, 0]}>
            <boxGeometry args={[0.014, 0.11, 0.028]} />
            <meshBasicMaterial color="#fde047" wireframe transparent opacity={0.9} depthWrite={false} />
          </mesh>
          <mesh position={[0, gripperGeometry.palmCenterOffsetM, 0]}>
            <boxGeometry args={[0.125, 0.035, 0.075]} />
            <meshBasicMaterial color="#fb923c" wireframe transparent opacity={0.9} depthWrite={false} />
          </mesh>
          <mesh position={[0, gripperGeometry.wristHousingCenterOffsetM, 0]}>
            <boxGeometry args={[0.116, 0.085, 0.116]} />
            <meshBasicMaterial color="#f43f5e" wireframe transparent opacity={0.75} depthWrite={false} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
