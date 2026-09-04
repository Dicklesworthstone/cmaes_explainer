"use client";

import React, { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, FlyControls, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { Bot, BrainCircuit, Cpu, Gauge, Play, RotateCcw, Sparkles, Square, Eye, Camera, Compass, Zap, Sliders, Shield, Activity, Flame, Radio, Sun, Moon, Sunset, Volume2, VolumeX, Wrench, Download } from "lucide-react";
import { useInView } from "../hooks/useScrollSpy";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { robotAudio } from "../lib/robotAudioSynthesizer";
import { LearningLedger } from "./LearningLedger";
import { PolicyExchange } from "./PolicyExchange";
import {
  decodePolicyFragment,
  policyFragmentFromHash,
  type SharedPolicy,
} from "../lib/g1PolicyShare";
import {
  appendLedgerPoint,
  learningLedgerPoint,
  type LearningLedgerPoint,
} from "../lib/g1LearningLedger";
import {
  G1_BODY_LINK_RADIUS_METERS,
  G1_INTERACTIVE_PINS,
  clampSphereAgainstHouse,
  clampSphereAgainstLinks,
  limbPinRestPosition,
  solveFullBodyG1IK,
  type InteractiveLimbPinId,
} from "../lib/humanoidRagdollIk";
import {
  DEFAULT_G1_WALKING_CONFIG,
  FRANKENSIM_OWNER_KERNEL_VERSION,
  type CmaFamily,
  type G1Admission,
  type G1Challenge,
  type G1Task,
  type G1TraceReceipt,
  type G1TraceSample,
} from "../lib/frankensimCmaes";
import {
  G1_DEFAULT_SEARCH_SIGMA,
  G1_HOUSE_SEAT,
  G1_KERNEL_OBSTACLES,
  type G1OptimizationRequest,
} from "../lib/g1OptimizationProtocol";
import { computeMultiFactorObjective, type MultiFactorChannel } from "../lib/g1MultiFactor";
import { resolveG1PushVisualization } from "../lib/g1PushVisualization";
import { CraftsmanLivingRoom } from "./CraftsmanLivingRoom";
import { SearsCraftsmanEstate } from "./SearsCraftsmanEstate";
import { CraftsmanArchitecturalInspector } from "./CraftsmanArchitecturalInspector";
import { G1BiomechanicsOverlay } from "./G1BiomechanicsOverlay";
import { G1PhysicsDebugOverlay } from "./G1PhysicsDebugOverlay";
import { FreeFlyHintBanner } from "./FreeFlyHintBanner";
import { G1StoryTour, STORY_CHAPTERS, type StoryChapter } from "./G1StoryTour";
import { G1TimelineScrubber } from "./G1TimelineScrubber";
import {
  G1ObjectiveEqualizer,
  RECEIPT_ANALYSIS_PRESETS,
  type ReceiptAnalysisPreset,
} from "./G1ObjectiveEqualizer";
import { ConvergenceChart, type ConvergencePoint } from "./ConvergenceChart";
import { WalkQualityComparison } from "./WalkQualityComparison";
import {
  installFrankenRobotsNativeCommandHandler,
  reportFrankenRobotsEngineState,
} from "../lib/frankenrobotsBridge";
import {
  clampPositionAgainstHouseCollisions,
  closestPointOnOBB,
  createHouseNavigationScene,
  distanceToOBB,
  findClearTrajectorySpawnOffset,
  projectPointOutOfOBB,
  resolveCameraBoom,
  sweptSphereOBBEntryPoint,
  type OrientedBoundingBox,
} from "../lib/houseMultiObstacleKernel";
import { CRAFTSMAN_BUNGALOW_1928 } from "../lib/houseScenes";
type ScalableFamily = Exclude<CmaFamily, "full">;
type G1TraceOrigin = CmaFamily | "stabilizer" | "curriculum";

type ComparisonRow = {
  family: CmaFamily;
  initialBest: number;
  finalBest: number;
  evaluations: number;
  persistentScalars: number;
  workspaceScalars: number;
  elapsedMilliseconds: number;
};

type WorkerResponse =
  | { type: "status"; phase: string; detail: string }
  | {
      type: "trace";
      trace: G1TraceReceipt;
      admission: G1Admission;
      generation: number;
      family: G1TraceOrigin;
      continuing?: boolean;
      stopped?: boolean;
      /** Coefficients behind this trace, when the worker replayed a policy. */
      policy?: Float64Array;
      /** Curriculum mean of this owner build, for encoding share links. */
      baseline?: Float64Array;
    }
  | {
      type: "progress";
      family: CmaFamily;
      generation: number;
      maxGenerations: number;
      bestObjective: number;
      sigma: number;
      continuous?: boolean;
    }
  | { type: "comparison"; rows: ComparisonRow[]; complete: boolean }
  | { type: "error"; message: string };

const LINK_NAMES = [
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
] as const;
const LINK_PARENTS = [
  -1, 0, 1, 2, 3, 4, 5, 0, 7, 8, 9, 10, 11, 0, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 15, 23, 24, 25, 26, 27, 28,
] as const;
const G1_MESH_DIR = "/robots/g1/";
const G1_MESH_FILES: Record<string, string> = {
  pelvis: "pelvis.STL",
  "left hip pitch": "left_hip_pitch_link.STL",
  "left hip roll": "left_hip_roll_link.STL",
  "left hip yaw": "left_hip_yaw_link.STL",
  "left knee": "left_knee_link.STL",
  "left ankle pitch": "left_ankle_pitch_link.STL",
  "left ankle roll": "left_ankle_roll_link.STL",
  "right hip pitch": "right_hip_pitch_link.STL",
  "right hip roll": "right_hip_roll_link.STL",
  "right hip yaw": "right_hip_yaw_link.STL",
  "right knee": "right_knee_link.STL",
  "right ankle pitch": "right_ankle_pitch_link.STL",
  "right ankle roll": "right_ankle_roll_link.STL",
  "waist yaw": "waist_yaw_link.STL",
  "waist roll": "waist_roll_link.STL",
  torso: "torso_link.STL",
  head: "head_link.STL",
  "left shoulder pitch": "left_shoulder_pitch_link.STL",
  "left shoulder roll": "left_shoulder_roll_link.STL",
  "left shoulder yaw": "left_shoulder_yaw_link.STL",
  "left elbow": "left_elbow_link.STL",
  "left wrist roll": "left_wrist_roll_link.STL",
  "left wrist pitch": "left_wrist_pitch_link.STL",
  "left wrist yaw": "left_wrist_yaw_link.STL",
  "left hand": "left_rubber_hand.STL",
  "right shoulder pitch": "right_shoulder_pitch_link.STL",
  "right shoulder roll": "right_shoulder_roll_link.STL",
  "right shoulder yaw": "right_shoulder_yaw_link.STL",
  "right elbow": "right_elbow_link.STL",
  "right wrist roll": "right_wrist_roll_link.STL",
  "right wrist pitch": "right_wrist_pitch_link.STL",
  "right wrist yaw": "right_wrist_yaw_link.STL",
  "right hand": "right_rubber_hand.STL",
};
const G1_HORIZON_STEPS = Math.round(
  DEFAULT_G1_WALKING_CONFIG.durationSeconds / DEFAULT_G1_WALKING_CONFIG.stepSeconds
);

// Source-bound dimensional scaffold for the parametric visual model.
// Product envelope: https://www.unitree.com/g1/ (1.32 × 0.45 × 0.20 m,
// 0.60 m combined thigh/calf, ~0.45 m arm span).
// Joint offsets: Unitree g1_29dof_mode_11.urdf at 7d6075f7f58588b189b940130e3edab3c839b2df.
const G1_SOURCE_DIMENSIONS = {
  standingHeight: 1.32,
  shoulderWidth: 0.20043,
  bodyDepth: 0.2,
  hipWidth: 0.128904,
  kneeToAnkle: 0.30001,
  shoulderToElbow: 0.183718,
  elbowToWrist: 0.100518,
  wristStack: 0.1255,
} as const;
const G1_HEAD_CENTER_OWNER: [number, number, number] = [0.005, 0, 0.435];
const G1_LEFT_HAND_CENTER_OWNER: [number, number, number] = [0.083, 0.003, 0];
const G1_RIGHT_HAND_CENTER_OWNER: [number, number, number] = [0.083, -0.003, 0];
const SHELL_COLOR = "#dfe5e8";
const SHELL_DARK = "#252d35";
const JOINT_COLOR = "#111820";
// Head is a fixed child of torso_link: URDF head_joint origin (0.004, 0, -0.054).
const G1_HEAD_JOINT_ORIGIN: [number, number, number] = [0.004, 0, -0.054];
const G1_POPULATION = 16;
const G1_LIVE_REPLAY_INTERVAL = 32;
// SOTA per-link clearance: must be >= the largest link sphere radius
// (0.105 m at the pelvis, 0.075 m at mid-links) plus a small margin so
// the visible link surface does not penetrate OBBs. The previous
// constant 0.05 m was less than the link radius, so the link mesh still
// visibly tunneled through furniture (verified cmaes-u76s followup).
/** Height of the rendered terrain above the wood floor planes at y = 0 [m]. */
const TERRAIN_ABOVE_FLOOR_M = 0.006;
/** Wireframe overlay offset above the terrain solid [m]. */
const TERRAIN_WIREFRAME_OFFSET_M = 0.003;

const G1_LINK_RADIUS_METERS = 0.105;
const G1_LINK_CLEARANCE_MARGIN_METERS = 0.015;
const G1_LINK_CLEARANCE_METERS = G1_LINK_RADIUS_METERS + G1_LINK_CLEARANCE_MARGIN_METERS;

const FAMILY_COPY: Record<CmaFamily, { title: string; representation: string; order: string }> = {
 full: {
    title: "Full CMA-ES",
    representation: "Every covariance interaction",
    order: "O(n²) storage · O(n³) update",
  },
  separable: {
    title: "Separable CMA-ES",
    representation: "One variance per coordinate",
    order: "O(n) storage · O(n) update",
  },
  "lm-cma": {
    title: "LM-CMA",
    representation: "A bounded history of directions",
    order: "O(mn) storage · O(mn) update",
  },
  "lm-ma": {
    title: "LM-MA",
    representation: "A bounded moving transform",
    order: "O(mn) storage · O(mn) update",
  },
};

const TRACE_TITLES: Record<G1TraceOrigin, string> = {
  stabilizer: "standing prior",
  curriculum: "walking curriculum mean",
  full: "Full CMA-ES",
  separable: "Separable CMA-ES",
  "lm-cma": "LM-CMA",
  "lm-ma": "LM-MA",
};

const G1_TASK_COPY: Record<G1Task, { label: string; action: string; detail: string }> = {
  balance: {
    label: "Balance",
    action: "balancing",
    detail: "Hold an upright stance against the selected physical challenge.",
  },
  stepping: {
    label: "Step",
    action: "stepping",
    detail: "Transfer weight and sustain the owner-defined stepping objective.",
  },
  walking: {
    label: "Walk",
    action: "walking",
    detail: "Advance with the full owner-defined walking objective.",
  },
};

function ownerToThree(position: readonly number[]): [number, number, number] {
  return [position[0], position[2], -position[1]];
}

function ownerQuaternionToThree(quaternionWxyz: readonly number[]): THREE.Quaternion {
  // The proper basis rotation (x, y, z) -> (x, z, -y) conjugates the owner
  // rotation into Three's Y-up frame; its vector quaternion part transforms
  // by the same basis map while the scalar part is unchanged.
  return new THREE.Quaternion(
    quaternionWxyz[1],
    quaternionWxyz[3],
    -quaternionWxyz[2],
    quaternionWxyz[0]
  );
}

function ownerLocalPointToThree(
  position: readonly number[],
  quaternionWxyz: readonly number[],
  localPoint: readonly number[]
): [number, number, number] {
  const world = new THREE.Vector3(...ownerToThree(position));
  world.add(
    new THREE.Vector3(...ownerToThree(localPoint)).applyQuaternion(
      ownerQuaternionToThree(quaternionWxyz)
    )
  );
  return [world.x, world.y, world.z];
}

type G1VisualMaterials = {
  shell: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  joint: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  visor: THREE.MeshPhysicalMaterial;
};

function LocalCapsule({
  startOwner,
  endOwner,
  radius,
  material,
}: {
  startOwner: readonly number[];
  endOwner: readonly number[];
  radius: number;
  material: THREE.Material;
}) {
  const transform = useMemo(() => {
    const a = new THREE.Vector3(...ownerToThree(startOwner));
    const b = new THREE.Vector3(...ownerToThree(endOwner));
    const midpoint = a.clone().add(b).multiplyScalar(0.5);
    const direction = b.clone().sub(a);
    const length = Math.max(direction.length(), 0.025);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.lengthSq() > 1e-12 ? direction.normalize() : new THREE.Vector3(0, 1, 0)
    );
    return { midpoint, quaternion, cylinderLength: Math.max(length - 2 * radius, 0.001) };
  }, [startOwner, endOwner, radius]);

  return (
    <mesh
      position={transform.midpoint}
      quaternion={transform.quaternion}
      material={material}
      castShadow
      receiveShadow
    >
      <capsuleGeometry args={[radius, transform.cylinderLength, 8, 12]} />
    </mesh>
  );
}

function JointMotor({
  materials,
  radius = 0.052,
  accent = false,
}: {
  materials: G1VisualMaterials;
  radius?: number;
  accent?: boolean;
}) {
  return (
    <group>
      <mesh material={materials.joint} castShadow>
        <sphereGeometry args={[radius, 16, 12]} />
      </mesh>
      <mesh material={accent ? materials.accent : materials.dark} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.76, radius * 0.12, 8, 24]} />
      </mesh>
    </group>
  );
}

function FootContact({ position, active, side }: { position: readonly number[]; active: boolean; side: "left" | "right" }) {
  return (
    <group position={[position[0], Math.max(0.018, position[1]), position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.065, 0.09, 28]} />
        <meshBasicMaterial
          color={active ? (side === "left" ? "#22d3ee" : "#a78bfa") : "#334155"}
          transparent
          opacity={active ? 0.95 : 0.28}
          side={THREE.DoubleSide}
        />
      </mesh>
      {active ? <pointLight color={side === "left" ? "#22d3ee" : "#a78bfa"} intensity={1.2} distance={0.65} /> : null}
    </group>
  );
}

function TerrainSurface({ admission }: { admission: G1Admission | null }) {
  const amplitude = admission?.config.challenge === "terrain-and-push"
    ? admission.terrainAmplitudeMeters
    : 0;
  const wavenumber = admission?.terrainWavenumberRadiansPerMeter ?? 1;
  const geometry = useMemo(() => {
    if (amplitude <= 0) return null;
    const terrain = new THREE.PlaneGeometry(5, 3, 96, 48);
    terrain.rotateX(-Math.PI / 2);
    terrain.translate(0.75, 0, 0);
    const positions = terrain.attributes.position;
    for (let vertex = 0; vertex < positions.count; vertex++) {
      const x = positions.getX(vertex);
      const ownerY = -positions.getZ(vertex);
      const sine = Math.sin(wavenumber * x);
      positions.setY(
        vertex,
        amplitude * sine * sine * (1 + 0.2 * Math.sin(3 * ownerY))
      );
    }
    positions.needsUpdate = true;
    terrain.computeVertexNormals();
    return terrain;
  }, [amplitude, wavenumber]);
  useEffect(() => () => geometry?.dispose(), [geometry]);

  if (!geometry || amplitude <= 0) return null;

  return (
    // Lifted clear of the wood floor planes at y = 0. The displacement field
    // is non-negative and touches zero, so at 1 mm the terrain was effectively
    // coplanar with the floor across whole troughs and the two flickered.
    <group position={[0, TERRAIN_ABOVE_FLOOR_M, 0]}>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#6e421f" roughness={0.65} metalness={0.08} />
      </mesh>
      {/* Wireframe overlay, offset far enough above the solid that the two
          copies of the same geometry cannot z-fight. */}
      <mesh geometry={geometry} position={[0, TERRAIN_WIREFRAME_OFFSET_M, 0]}>
        <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function PushArrow({
  pelvis,
  fraction,
  pushAngleDeg = 90,
  pushImpulseNs = 15,
}: {
  pelvis: readonly number[];
  fraction: number;
  pushAngleDeg?: number;
  pushImpulseNs?: number;
}) {
  if (fraction <= 0) return null;
  const rad = (pushAngleDeg * Math.PI) / 180;
  const dir = new THREE.Vector3(Math.cos(rad), 0, Math.sin(rad)).normalize();
  const pelvisPos = new THREE.Vector3(...ownerToThree(pelvis));
  const arrowLength = (0.25 + 0.45 * fraction) * Math.max(0.6, pushImpulseNs / 15);

  return (
    <arrowHelper
      args={[
        dir,
        pelvisPos.clone().add(new THREE.Vector3(0, 0.16, 0)).sub(dir.clone().multiplyScalar(arrowLength)),
        arrowLength,
        "#fb7185",
        0.12 * Math.max(0.8, Math.min(1.6, pushImpulseNs / 15)),
        0.07 * Math.max(0.8, Math.min(1.6, pushImpulseNs / 15)),
      ]}
    />
  );
}

// Real-mesh rig: one group per trace link, posed by the kernel's link frame
// (position + quaternion). The STL vertices were baked into the Three basis at
// load time, so no per-frame conversion is needed here. Foot contact rings
// stay as the honest data overlay (kernel contact booleans).
// Display-only arm chains riding the torso group (kernel dynamics stop at the
// torso). The chain table stores URDF joint origins root-first with parent
// pointers; ArmGroup nests each link inside its parent's frame, so transforms
// compose exactly like the URDF stack.


function RobotPoseMeshes({
  sample,
  meshes,
  pushFraction,
  pushAngleDeg = 90,
  pushImpulseNs = 15,
}: {
  sample: G1TraceSample;
  meshes: { geometries: Record<string, THREE.BufferGeometry>; material: THREE.MeshStandardMaterial };
  pushFraction: number;
  pushAngleDeg?: number;
  pushImpulseNs?: number;
}) {
  const leftFootPoint = ownerLocalPointToThree(
    sample.linkPoses[6].position,
    sample.linkPoses[6].quaternionWxyz,
    [0.035, 0, -0.032]
  );
  const rightFootPoint = ownerLocalPointToThree(
    sample.linkPoses[12].position,
    sample.linkPoses[12].quaternionWxyz,
    [0.035, 0, -0.032]
  );
  return (
    <group>
      {LINK_NAMES.map((name, link) => {
        const pose = sample.linkPoses[link];
        return (
          <group
            key={name}
            position={ownerToThree(pose.position)}
            quaternion={ownerQuaternionToThree(pose.quaternionWxyz)}
          >
            <mesh geometry={meshes.geometries[name]} material={meshes.material} castShadow receiveShadow />
            {name === "torso" ? (
              <group position={ownerToThree(G1_HEAD_JOINT_ORIGIN)}>
                <mesh geometry={meshes.geometries.head} material={meshes.material} castShadow />
              </group>
            ) : name === "left wrist yaw" ? (
              <group position={ownerToThree([0.0415, 0.003, 0])}>
                <mesh geometry={meshes.geometries["left hand"]} material={meshes.material} castShadow />
              </group>
            ) : name === "right wrist yaw" ? (
              <group position={ownerToThree([0.0415, -0.003, 0])}>
                <mesh geometry={meshes.geometries["right hand"]} material={meshes.material} castShadow />
              </group>
            ) : null}
            
          </group>
        );
      })}
      <FootContact position={leftFootPoint} active={sample.leftContact} side="left" />
      <FootContact position={rightFootPoint} active={sample.rightContact} side="right" />
      <PushArrow
        pelvis={sample.linkPoses[0].position}
        fraction={pushFraction}
        pushAngleDeg={pushAngleDeg}
        pushImpulseNs={pushImpulseNs}
      />
    </group>
  );
}

function Segment({
  start,
  end,
  radius,
  color,
}: {
  start: readonly number[];
  end: readonly number[];
  radius: number;
  color: string;
}) {
  const transform = useMemo(() => {
    const a = new THREE.Vector3(...ownerToThree(start));
    const b = new THREE.Vector3(...ownerToThree(end));
    const midpoint = a.clone().add(b).multiplyScalar(0.5);
    const direction = b.clone().sub(a);
    const length = Math.max(direction.length(), 0.025);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.lengthSq() > 1e-12 ? direction.normalize() : new THREE.Vector3(0, 1, 0)
    );
    return { midpoint, quaternion, cylinderLength: Math.max(length - 2 * radius, 0.001) };
  }, [start, end, radius]);

  return (
    <mesh position={transform.midpoint} quaternion={transform.quaternion} castShadow receiveShadow>
      <capsuleGeometry args={[radius, transform.cylinderLength, 8, 14]} />
      <meshStandardMaterial color={color} roughness={0.34} metalness={0.68} />
    </mesh>
  );
}


function RobotPose({
  sample,
  pushFraction,
  pushAngleDeg,
  pushImpulseNs,
}: {
  sample: G1TraceSample;
  pushFraction: number;
  pushAngleDeg: number;
  pushImpulseNs: number;
}) {
  const pelvis = sample.linkPoses[0].position;
  const torso = sample.linkPoses[15].position;
  const torsoThree = ownerToThree(torso);
  const pelvisQuaternion = ownerQuaternionToThree(sample.linkPoses[0].quaternionWxyz);
  const torsoQuaternion = ownerQuaternionToThree(sample.linkPoses[15].quaternionWxyz);
  const leftFootQuaternion = ownerQuaternionToThree(sample.linkPoses[6].quaternionWxyz);
  const rightFootQuaternion = ownerQuaternionToThree(sample.linkPoses[12].quaternionWxyz);
  const leftFootPoint = ownerLocalPointToThree(
    sample.linkPoses[6].position,
    sample.linkPoses[6].quaternionWxyz,
    [0.035, 0, -0.032]
  );
  const rightFootPoint = ownerLocalPointToThree(
    sample.linkPoses[12].position,
    sample.linkPoses[12].quaternionWxyz,
    [0.035, 0, -0.032]
  );
  const leftFootCenter = ownerLocalPointToThree(
    sample.linkPoses[6].position,
    sample.linkPoses[6].quaternionWxyz,
    [0.035, 0, -0.0095]
  );
  const rightFootCenter = ownerLocalPointToThree(
    sample.linkPoses[12].position,
    sample.linkPoses[12].quaternionWxyz,
    [0.035, 0, -0.0095]
  );

  return (
    <group>
      {LINK_PARENTS.map((parent, link) => {
        if (parent < 0) return null;
        const isLeft = link >= 1 && link <= 6;
        const isRight = link >= 7 && link <= 12;
        let radius = 0.042;
        if (link === 15) radius = 0.065;
        else if (link >= 13) radius = 0.055;

        let color = "#cbd5e1";
        if (isLeft) color = "#22d3ee";
        else if (isRight) color = "#8b5cf6";

        return (
          <Segment
            key={LINK_NAMES[link]}
            start={sample.linkPoses[parent].position}
            end={sample.linkPoses[link].position}
            radius={radius}
            color={color}
          />
        );
      })}

      <mesh position={ownerToThree(pelvis)} quaternion={pelvisQuaternion} castShadow>
        <boxGeometry args={[0.17, 0.13, 0.25]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.75} roughness={0.26} />
      </mesh>

      <mesh position={leftFootCenter} quaternion={leftFootQuaternion} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.045, 0.09]} />
        <meshStandardMaterial color="#22d3ee" metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={rightFootCenter} quaternion={rightFootQuaternion} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.045, 0.09]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.72} roughness={0.3} />
      </mesh>

      {/* The source-bound dynamics catalog intentionally stops at the torso.
          This translucent shell supplies humanoid visual context only. */}
      <group position={torsoThree} quaternion={torsoQuaternion}>
        <mesh position={[0, 0.075, 0]} castShadow>
          <boxGeometry args={[0.16, 0.24, 0.29]} />
          <meshPhysicalMaterial
            color="#94a3b8"
            transparent
            opacity={0.34}
            roughness={0.25}
            metalness={0.55}
            transmission={0.12}
          />
        </mesh>
        <mesh position={[0, 0.34, 0]} castShadow>
          <sphereGeometry args={[0.105, 24, 16]} />
          <meshPhysicalMaterial color="#cbd5e1" transparent opacity={0.28} roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.12, 0.055, 0.46]} />
          <meshStandardMaterial color="#64748b" transparent opacity={0.24} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[0, -0.025, side * 0.245]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.035, 0.18, 6, 10]} />
              <meshStandardMaterial color="#94a3b8" transparent opacity={0.25} metalness={0.5} />
            </mesh>
            <mesh position={[0, -0.215, 0]} castShadow>
              <capsuleGeometry args={[0.03, 0.17, 6, 10]} />
              <meshStandardMaterial color="#64748b" transparent opacity={0.23} metalness={0.45} />
            </mesh>
            <mesh position={[0, -0.34, 0]}>
              <sphereGeometry args={[0.042, 14, 10]} />
              <meshStandardMaterial color="#94a3b8" transparent opacity={0.24} />
            </mesh>
          </group>
        ))}
      </group>

      <FootContact position={leftFootPoint} active={sample.leftContact} side="left" />
      <FootContact position={rightFootPoint} active={sample.rightContact} side="right" />
      <PushArrow
        pelvis={pelvis}
        fraction={pushFraction}
        pushAngleDeg={pushAngleDeg}
        pushImpulseNs={pushImpulseNs}
      />
    </group>
  );
}

// Owner link indices used by the interaction layer (pelvis + 29 joints).
const G1_LINK_PELVIS = 0;
const G1_LINK_LEFT_FOOT = 6;
const G1_LINK_RIGHT_FOOT = 12;
const G1_LINK_TORSO = 15;
const G1_LINK_LEFT_WRIST = 22;
const G1_LINK_RIGHT_WRIST = 29;
// The head mesh hangs off the torso link; its crown sits about 0.45 m above
// the torso link origin (0.34 m sphere centre + 0.105 m radius in the
// fallback rig, matching the STL silhouette).
const G1_HEAD_CROWN_ABOVE_TORSO_METERS = 0.45;

/**
 * PENETRATION PROJECTION (visualization layer). The G1 kernel's IK is
 * obstacle-blind, so a foot or knee can land inside a chair, table, or
 * wall OBB during the rendered trajectory. For every link we push the
 * link centre out of any OBB it entered, then run a swept-sphere CCD pass
 * from the previous frame so a link never teleports to a deep-interior
 * closest point (Redon, Lin, Benichou 2002; Ericson 2005 §5.5.7). The
 * kernel trace stays untouched; the projection is applied per frame to a
 * derived sample that RobotPoseMeshes / RobotPose consume.
 *
 * Everything is evaluated in WORLD space: the spawn/drag offset is added
 * before testing and removed again afterwards, because the mesh is drawn
 * inside a group translated by that offset. Projecting in the raw kernel
 * frame (the previous behaviour) tested the robot against furniture
 * several metres away from where it was actually standing.
 */
function projectSampleAgainstHouse(
  sample: G1TraceSample,
  previousSample: G1TraceSample | null,
  offset: readonly [number, number, number] | null,
  obstacles: readonly OrientedBoundingBox[] = houseSceneData.obstacles,
): G1TraceSample {
  const ox = offset ? offset[0] : 0;
  const oy = offset ? offset[1] : 0;
  const oz = offset ? offset[2] : 0;
  const prevPositions = previousSample
    ? previousSample.linkPoses.map((pose) => ownerToThree(pose.position))
    : null;
  const linkPoses = sample.linkPoses.map((pose, link) => {
    const p = ownerToThree(pose.position);
    let qx = p[0] + ox;
    let qy = p[1] + oy;
    let qz = p[2] + oz;
    for (const obb of obstacles) {
      if (obb.exemptFromPenalty) continue;
      const projected = projectPointOutOfOBB([qx, qy, qz], obb, G1_LINK_CLEARANCE_METERS);
      if (projected.wasInside) {
        qx = projected.point[0];
        qy = projected.point[1];
        qz = projected.point[2];
      }
    }
    if (prevPositions && prevPositions[link]) {
      const prev = prevPositions[link];
      for (const obb of obstacles) {
        if (obb.exemptFromPenalty) continue;
        const ccd = sweptSphereOBBEntryPoint(
          [prev[0] + ox, prev[1] + oy, prev[2] + oz],
          [qx, qy, qz],
          G1_LINK_CLEARANCE_METERS,
          obb,
        );
        if (ccd.wasHit && ccd.entryPoint) {
          qx = ccd.entryPoint[0];
          qy = ccd.entryPoint[1];
          qz = ccd.entryPoint[2];
        }
      }
    }
    // Back to the un-offset owner frame: three (x, y, z) -> owner (x, -z, y).
    const wx = qx - ox;
    const wy = qy - oy;
    const wz = qz - oz;
    return {
      ...pose,
      position: [wx, -wz, wy] as [number, number, number],
      quaternionWxyz: [...pose.quaternionWxyz] as [number, number, number, number],
    };
  });
  return { ...sample, linkPoses };
}

type RobotAnchors = {
  pelvis: [number, number, number];
  headCrown: [number, number, number];
  leftHand: [number, number, number];
  rightHand: [number, number, number];
  leftFoot: [number, number, number];
  rightFoot: [number, number, number];
  /** Every link centre in world space, for pin-versus-body clamping. */
  links: [number, number, number][];
};

/** World-space anchor points on the rendered (projected, offset) robot. */
function computeRobotAnchors(
  sample: G1TraceSample,
  offset: readonly [number, number, number] | null,
): RobotAnchors {
  const ox = offset ? offset[0] : 0;
  const oy = offset ? offset[1] : 0;
  const oz = offset ? offset[2] : 0;
  const shift = (p: [number, number, number]): [number, number, number] => [p[0] + ox, p[1] + oy, p[2] + oz];
  const linkWorld = (index: number) => shift(ownerToThree(sample.linkPoses[index].position));
  const localWorld = (index: number, local: [number, number, number]) =>
    shift(ownerLocalPointToThree(sample.linkPoses[index].position, sample.linkPoses[index].quaternionWxyz, local));
  const torso = linkWorld(G1_LINK_TORSO);
  return {
    pelvis: linkWorld(G1_LINK_PELVIS),
    headCrown: [torso[0], torso[1] + G1_HEAD_CROWN_ABOVE_TORSO_METERS, torso[2]],
    leftHand: localWorld(G1_LINK_LEFT_WRIST, G1_LEFT_HAND_CENTER_OWNER),
    rightHand: localWorld(G1_LINK_RIGHT_WRIST, G1_RIGHT_HAND_CENTER_OWNER),
    leftFoot: localWorld(G1_LINK_LEFT_FOOT, [0.04, 0, -0.03]),
    rightFoot: localWorld(G1_LINK_RIGHT_FOOT, [0.04, 0, -0.03]),
    links: sample.linkPoses.map((_, index) => linkWorld(index)),
  };
}

/**
 * Horizontal unit heading of the robot at a sample: the pelvis link's own
 * forward axis (owner +X, the kernel's walking axis) rotated by the pelvis
 * world quaternion and flattened onto the floor. Facing is far steadier
 * than pelvis displacement, which is noise while the robot stands or
 * wobbles and flips at every playback loop boundary. Falls back to +X when
 * the pelvis points straight up or down.
 */
function robotHeading(trace: G1TraceReceipt, sampleIndex: number): [number, number] {
  const n = trace.samples.length;
  if (n === 0) return [1, 0];
  const pose = trace.samples[Math.max(0, Math.min(n - 1, sampleIndex))].linkPoses[G1_LINK_PELVIS];
  const forward = new THREE.Vector3(1, 0, 0).applyQuaternion(ownerQuaternionToThree(pose.quaternionWxyz));
  const len = Math.hypot(forward.x, forward.z);
  if (len < 0.05) return [1, 0];
  return [forward.x / len, forward.z / len];
}

function RobotPlayback({
  trace,
  admission,
  reduceMotion,
  meshState,
  xrayMode,
  isPlaying,
  playbackSpeed,
  sampleIndex,
  onSampleIndexChange,
  shoveActive,
  pushAngleDeg = 90,
  pushImpulseNs = 15,
  positionOffset,
}: {
  trace: G1TraceReceipt;
  admission: G1Admission | null;
  reduceMotion: boolean;
  meshState: G1MeshState;
  xrayMode: boolean;
  isPlaying: boolean;
  playbackSpeed: number;
  sampleIndex: number;
  onSampleIndexChange: (idx: number) => void;
  shoveActive: boolean;
  pushAngleDeg?: number;
  pushImpulseNs?: number;
  positionOffset?: [number, number, number] | null;
}) {
  const playbackSeconds = useRef(0);
  useFrame((_, deltaSeconds) => {
    if (reduceMotion || !isPlaying || trace.samples.length < 2) return;
    const duration = trace.samples.at(-1)?.timeSeconds ?? 0;
    if (duration <= 0) return;
    // Advance playback by deltaSeconds scaled by playbackSpeed
    playbackSeconds.current = (playbackSeconds.current + Math.min(deltaSeconds, 0.1) * 0.55 * playbackSpeed) % duration;
    const playbackTime = playbackSeconds.current;
    let nextIndex = 0;
    while (
      nextIndex + 1 < trace.samples.length &&
      trace.samples[nextIndex + 1].timeSeconds <= playbackTime
    ) {
      nextIndex += 1;
    }
    if (nextIndex !== sampleIndex) onSampleIndexChange(nextIndex);
  });

  const sample = trace.samples[Math.min(sampleIndex, trace.samples.length - 1)];
  const renderSample = useMemo(
    () =>
      projectSampleAgainstHouse(
        sample,
        sampleIndex > 0 ? trace.samples[sampleIndex - 1] : null,
        positionOffset ?? null,
      ),
    [sample, sampleIndex, trace, positionOffset],
  );
  // Procedural synthesized footstep acoustics on contact state changes
  const prevContactsRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  useEffect(() => {
    if (!sample) return;
    if (sample.leftContact && !prevContactsRef.current.left) {
      robotAudio.playFootstep(1.0, true);
    }
    if (sample.rightContact && !prevContactsRef.current.right) {
      robotAudio.playFootstep(1.0, false);
    }
    prevContactsRef.current = { left: sample.leftContact, right: sample.rightContact };
  }, [sample]);

  const pushVisualization = resolveG1PushVisualization({
    manualPreviewActive: shoveActive,
    manualAngleDegrees: pushAngleDeg,
    manualImpulseNewtonSeconds: pushImpulseNs,
    ownerChallengeActive: admission?.config.challenge === "terrain-and-push",
    sampleTimeSeconds: sample?.timeSeconds ?? null,
    ownerPushStartSeconds: admission?.pushStartSeconds ?? null,
    ownerPushEndSeconds: admission?.pushEndSeconds ?? null,
    ownerImpulseNewtonSeconds: trace.pushImpulseNewtonSeconds,
  });
  const pelvisThree = renderSample ? ownerToThree(renderSample.linkPoses[0].position) : [0, 0.75, 0] as [number, number, number];
  const leftFootThree = renderSample ? ownerLocalPointToThree(
    renderSample.linkPoses[6].position,
    renderSample.linkPoses[6].quaternionWxyz,
    [0.04, 0, -0.03]
  ) : [0, 0, 0] as [number, number, number];
  const rightFootThree = renderSample ? ownerLocalPointToThree(
    renderSample.linkPoses[12].position,
    renderSample.linkPoses[12].quaternionWxyz,
    [0.04, 0, -0.03]
  ) : [0, 0, 0] as [number, number, number];

  return renderSample ? (
    <group position={positionOffset ? [positionOffset[0], positionOffset[1], positionOffset[2]] : [0, 0, 0]}>
      {meshState.phase === "ready" ? (
        <RobotPoseMeshes
          sample={renderSample}
          meshes={meshState}
          pushFraction={pushVisualization.fraction}
          pushAngleDeg={pushVisualization.angleDegrees}
          pushImpulseNs={pushVisualization.impulseNewtonSeconds}
        />
      ) : (
        <RobotPose
          sample={renderSample}
          pushFraction={pushVisualization.fraction}
          pushAngleDeg={pushVisualization.angleDegrees}
          pushImpulseNs={pushVisualization.impulseNewtonSeconds}
        />
      )}
      <G1BiomechanicsOverlay
        sample={renderSample}
        enabled={xrayMode}
        pelvisPosition={pelvisThree}
        leftFootPosition={leftFootThree}
        rightFootPosition={rightFootThree}
      />
    </group>
  ) : null;
}


// Page-lifetime cache of raw parsed mesh data. Reused across mount/unmount
// (the stage unmounts offscreen but the parsed geometry stays). Built once
// per page load by the worker, then converted to THREE.BufferGeometry only
// when the stage actually mounts.
type G1ParsedMesh = { positions: Float32Array; normals: Float32Array };
let g1MeshCache: Record<string, G1ParsedMesh> | null = null;
let g1MeshCachePromise: Promise<Record<string, G1ParsedMesh>> | null = null;
const G1_MESH_WORKER_TIMEOUT_MS = 30_000;

function ensureG1Meshes(): Promise<Record<string, G1ParsedMesh>> {
  if (g1MeshCache) return Promise.resolve(g1MeshCache);
  if (!g1MeshCachePromise) {
    g1MeshCachePromise = (async () => {
      // This worker is a real JavaScript asset under `public/`. Passing a
      // TypeScript module through `new URL(..., import.meta.url)` makes
      // Turbopack emit the raw `.ts` source as media, which WebKit cannot
      // execute in the native app's loopback origin.
      const worker = new Worker("/workers/g1MeshParseWorker.js", {
        type: "module",
        name: "g1-mesh-parser",
      });
      const result = await new Promise<Record<string, G1ParsedMesh>>(
        (resolve, reject) => {
          let settled = false;
          const finish = (
            outcome:
              | { type: "ok"; geometries: Record<string, G1ParsedMesh> }
              | { type: "error"; error: string },
          ) => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeout);
            worker.terminate();
            if (outcome.type === "ok") resolve(outcome.geometries);
            else reject(new Error(outcome.error));
          };
          const timeout = window.setTimeout(() => {
            finish({
              type: "error",
              error: "Timed out while loading the Unitree G1 mesh rig.",
            });
          }, G1_MESH_WORKER_TIMEOUT_MS);
          worker.onmessage = (e: MessageEvent<unknown>) => {
            const m = e.data as
              | { type: "ok"; geometries: Record<string, G1ParsedMesh> }
              | { type: "error"; error: string };
            finish(m);
          };
          worker.onerror = (event) => {
            event.preventDefault();
            finish({
              type: "error",
              error: event.message || "The Unitree G1 mesh worker failed to start.",
            });
          };
          worker.onmessageerror = () => {
            finish({
              type: "error",
              error: "The Unitree G1 mesh worker returned unreadable data.",
            });
          };
          worker.postMessage({
            type: "parse",
            files: G1_MESH_FILES,
            baseUrl: G1_MESH_DIR,
            rotateXRad: -Math.PI / 2,
          });
        },
      );
      g1MeshCache = result;
      return result;
    })().catch((error: unknown) => {
      // A failed attempt must not poison the page-lifetime cache. A later
      // mount can retry after a transient WebKit or memory-pressure failure.
      g1MeshCachePromise = null;
      throw error;
    });
  }
  return g1MeshCachePromise;
}

function buildG1Geometries(parsed: Record<string, G1ParsedMesh>): {
  geometries: Record<string, THREE.BufferGeometry>;
  material: THREE.MeshStandardMaterial;
} {
  const geometries: Record<string, THREE.BufferGeometry> = {};
  for (const [key, data] of Object.entries(parsed)) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(data.normals, 3));
    geometries[key] = geometry;
  }
  const material = new THREE.MeshStandardMaterial({
    color: "#3a424d",
    metalness: 0.35,
    roughness: 0.46,
  });
  return { geometries, material };
}

type G1MeshState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "ready"; geometries: Record<string, THREE.BufferGeometry>; material: THREE.MeshStandardMaterial }
  | { phase: "failed"; error: string };

function useG1Meshes(active: boolean): [G1MeshState, () => void] {
  const [state, setState] = useState<G1MeshState>({ phase: "idle" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    if (!active) return;
    setState({ phase: "loading" });
    setAttempt((current) => current + 1);
  }, [active]);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    (async () => {
      try {
        const parsed = await ensureG1Meshes();
        if (cancelled) return;
        const built = buildG1Geometries(parsed);
        if (cancelled) {
          // Disposing mid-build is wasteful but safe; the cache retains
          // the parsed data so a re-mount is instant.
          for (const g of Object.values(built.geometries)) g.dispose();
          return;
        }
        setState({ phase: "ready", ...built });
      } catch (error: unknown) {
        if (!cancelled) {
          setState({
            phase: "failed",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active, attempt]);
  if (state.phase === "ready" || state.phase === "failed") return [state, retry];
  return [{ phase: active ? "loading" : "idle" }, retry];
}

const cameraScratchVec = new THREE.Vector3();

const ROOM_VIEWPOINTS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  porch: { pos: [0, 1.6, 5.8], target: [0, 0.75, 2.75] },
  living: { pos: [1.85, 1.45, 2.5], target: [-0.5, 0.75, 0.0] },
  dining: { pos: [3.8, 1.6, 2.8], target: [2.1, 0.85, 0.0] },
  kitchen: { pos: [3.8, 1.6, -1.8], target: [2.1, 0.9, -3.2] },
  bedroom: { pos: [-2.0, 1.6, -1.6], target: [-2.3, 0.85, -3.2] },
  bathroom: { pos: [0, 1.5, -2.4], target: [-0.2, 0.7, -3.8] },
  cutaway: { pos: [6.5, 9.2, 8.5], target: [0, 0.5, 0] },
  all: { pos: [6.5, 9.2, 8.5], target: [0, 0.5, 0] },
};

type CameraView = "orbit" | "follow" | "pov" | "blueprint" | "fly";
type ActiveRoom = "all" | "living" | "dining" | "kitchen" | "porch" | "bedroom" | "bathroom" | "cutaway";

// Camera may roam the bungalow interior plus the porch, and rise above the
// 2.5 m walls for overviews, but never leave the lot or sink into the floor.
const HOUSE_CAMERA_BOUNDS = { minX: -3.85, maxX: 3.85, minZ: -5.35, maxZ: 6.4 };
const HOUSE_CAMERA_MIN_Y = 0.25;
const HOUSE_CAMERA_MAX_Y = 9.5;
// Wider than the near plane needs: keeps the lens off wall-hung decor whose
// colliders are authored at floor level (picture frames, sconces).
const CAMERA_PROBE_RADIUS = 0.3;
// Candidate boom azimuths relative to "directly behind the robot", tried in
// preference order. Positive is to the robot's left.
const FOLLOW_AZIMUTHS_DEG = [35, -35, 0, 70, -70, 110, -110, 180];
const FOLLOW_BOOM_LENGTH = 2.6;
const FOLLOW_BOOM_HEIGHT = 1.0;
const ORBIT_FRAME_BOOM_LENGTH = 2.9;
const ORBIT_FRAME_BOOM_HEIGHT = 1.25;

const ROOM_NAME_TO_ACTIVE_ROOM: Record<string, ActiveRoom> = {
  "entry porch": "porch",
  "living room": "living",
  "dining room": "dining",
  kitchen: "kitchen",
  bedroom: "bedroom",
  "second bedroom": "bedroom",
  bath: "bathroom",
};

/** Which selectable room contains a world-space point (x, z), if any. */
function activeRoomForPoint(x: number, z: number): ActiveRoom | null {
  for (const room of CRAFTSMAN_BUNGALOW_1928.rooms) {
    const [cx, cz] = room.center;
    const [sx, sz] = room.size;
    if (Math.abs(x - cx) <= sx / 2 && Math.abs(z - cz) <= sz / 2) {
      return ROOM_NAME_TO_ACTIVE_ROOM[room.name] ?? null;
    }
  }
  return null;
}

function clampCameraToHouse(v: THREE.Vector3) {
  v.x = Math.min(HOUSE_CAMERA_BOUNDS.maxX, Math.max(HOUSE_CAMERA_BOUNDS.minX, v.x));
  v.z = Math.min(HOUSE_CAMERA_BOUNDS.maxZ, Math.max(HOUSE_CAMERA_BOUNDS.minZ, v.z));
  v.y = Math.min(HOUSE_CAMERA_MAX_Y, Math.max(HOUSE_CAMERA_MIN_Y, v.y));
}

/**
 * Choose the boom azimuth (relative to the robot's heading) whose swept
 * sphere from the look-at point reaches the farthest before a wall or
 * furniture blocks it. `preferred` gets a hysteresis bonus so the camera
 * does not flip sides every time two candidates trade places.
 */
function chooseBoom(
  lookAt: [number, number, number],
  heading: [number, number],
  boomLength: number,
  boomHeight: number,
  obstacles: readonly OrientedBoundingBox[],
  preferred: number | null,
): { azimuthDeg: number; position: [number, number, number]; fraction: number } {
  const baseAngle = Math.atan2(heading[1], heading[0]) + Math.PI; // behind the robot
  let best: { azimuthDeg: number; position: [number, number, number]; fraction: number } | null = null;
  let bestScore = -Infinity;
  for (const azimuthDeg of FOLLOW_AZIMUTHS_DEG) {
    // Positive azimuth swings toward the robot's left: rotate the "behind"
    // vector by -azimuth about +Y (Y-up right-handed frame).
    const angle = baseAngle - (azimuthDeg * Math.PI) / 180;
    const desired: [number, number, number] = [
      lookAt[0] + Math.cos(angle) * boomLength,
      lookAt[1] + boomHeight,
      lookAt[2] + Math.sin(angle) * boomLength,
    ];
    const clamped = new THREE.Vector3(...desired);
    clampCameraToHouse(clamped);
    const resolved = resolveCameraBoom(lookAt, [clamped.x, clamped.y, clamped.z], obstacles, CAMERA_PROBE_RADIUS);
    // Small enough that a preferred boom only wins a near-tie; 0.25 let a
    // badly blocked previous choice beat a clear new one.
    const score = resolved.fraction + (preferred === azimuthDeg ? 0.08 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = { azimuthDeg, position: resolved.position, fraction: resolved.fraction };
    }
  }
  return best!;
}

function CameraRig({
  cameraView,
  activeRoom,
  pelvisThree,
  heading,
  obstacles,
  hasRobot,
}: {
  cameraView: CameraView;
  activeRoom: ActiveRoom;
  pelvisThree: [number, number, number];
  heading: [number, number];
  obstacles: readonly OrientedBoundingBox[];
  hasRobot: boolean;
}) {
  const controlsRef = useRef<any>(null);
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);
  // Smoothed look-at shared by every mode so a mode switch glides instead
  // of cutting.
  const lookAtRef = useRef(new THREE.Vector3(pelvisThree[0], pelvisThree[1] + 0.15, pelvisThree[2]));
  const smoothedHeading = useRef(new THREE.Vector2(heading[0], heading[1]));
  const followAzimuth = useRef<number | null>(null);
  const lastFramedPelvis = useRef<THREE.Vector3 | null>(null);
  const lastRoomRef = useRef<ActiveRoom | null>(null);
  const pelvisRef = useRef(pelvisThree);
  const headingRef = useRef(heading);
  // Declared before every effect that reads these refs so React runs the
  // sync first within the same commit.
  useEffect(() => {
    pelvisRef.current = pelvisThree;
    headingRef.current = heading;
  }, [pelvisThree, heading]);

  const frameRobot = useCallback(() => {
    const pelvis = pelvisRef.current;
    const lookAt: [number, number, number] = [pelvis[0], pelvis[1] + 0.1, pelvis[2]];
    const boom = chooseBoom(
      lookAt,
      headingRef.current,
      ORBIT_FRAME_BOOM_LENGTH,
      ORBIT_FRAME_BOOM_HEIGHT,
      obstacles,
      null,
    );
    targetCamPos.current = new THREE.Vector3(...boom.position);
    targetLookAt.current = new THREE.Vector3(...lookAt);
    lastFramedPelvis.current = new THREE.Vector3(...pelvis);
  }, [obstacles]);

  const frameRoomViewpoint = useCallback(
    (room: ActiveRoom) => {
      const vp = ROOM_VIEWPOINTS[room] || ROOM_VIEWPOINTS.living;
      const resolved = resolveCameraBoom(vp.target, vp.pos, obstacles, CAMERA_PROBE_RADIUS);
      targetCamPos.current = new THREE.Vector3(...resolved.position);
      targetLookAt.current = new THREE.Vector3(...vp.target);
    },
    [obstacles],
  );

  // Room chips: fly to the room's viewpoint, unless that room is where the
  // robot is standing, in which case frame the robot itself. Overviews
  // (all / cutaway) always use their authored viewpoint.
  useEffect(() => {
    if (cameraView !== "orbit") return;
    if (lastRoomRef.current === activeRoom) return;
    lastRoomRef.current = activeRoom;
    const robotRoom = hasRobot ? activeRoomForPoint(pelvisRef.current[0], pelvisRef.current[2]) : null;
    if (hasRobot && (activeRoom === robotRoom || (robotRoom === null && activeRoom === "living"))) {
      frameRobot();
    } else {
      frameRoomViewpoint(activeRoom);
    }
  }, [activeRoom, cameraView, hasRobot, frameRobot, frameRoomViewpoint]);

  // The robot arrived (first trace + spawn seat) or jumped (drag/reset):
  // re-frame it so the operator never stares at an empty room.
  useEffect(() => {
    if (cameraView !== "orbit" || !hasRobot) return;
    const last = lastFramedPelvis.current;
    const moved = last
      ? Math.hypot(last.x - pelvisThree[0], last.z - pelvisThree[2])
      : Number.POSITIVE_INFINITY;
    if (moved > 0.9) frameRobot();
  }, [cameraView, hasRobot, pelvisThree, frameRobot]);

  // Entering orbit: seed OrbitControls' target from the shared look-at so a
  // switch from follow/POV does not snap the view to the origin, then
  // re-frame the robot from a clear boom (a top-down map camera or a
  // free-fly position is rarely a useful orbit start).
  useEffect(() => {
    if (cameraView !== "orbit") return;
    if (controlsRef.current) {
      controlsRef.current.target.copy(lookAtRef.current);
      controlsRef.current.update();
    }
    if (hasRobot) frameRobot();
  }, [cameraView, hasRobot, frameRobot]);

  useFrame(({ camera, scene }, rawDelta) => {
    const dt = Math.min(Math.max(rawDelta, 0), 0.1);
    const pelvis = pelvisRef.current;
    if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
      (window as unknown as { __g1Three?: unknown }).__g1Three = { scene, camera, THREE };
    }
    // Frame-rate independent damping: k = 1 - exp(-rate * dt).
    const ease = (rate: number) => 1 - Math.exp(-rate * dt);
    smoothedHeading.current.lerp(new THREE.Vector2(headingRef.current[0], headingRef.current[1]), ease(3));
    if (smoothedHeading.current.lengthSq() < 1e-6) smoothedHeading.current.set(1, 0);
    smoothedHeading.current.normalize();
    const h: [number, number] = [smoothedHeading.current.x, smoothedHeading.current.y];

    if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
      // Dev-only readout for the browser smoke harness (tmp/ui-smoke).
      (window as unknown as { __g1Camera?: unknown }).__g1Camera = {
        mode: cameraView,
        position: camera.position.toArray(),
        target: controlsRef.current
          ? controlsRef.current.target.toArray()
          : lookAtRef.current.toArray(),
        pelvis: [...pelvis],
        heading: h,
        pending: Boolean(targetCamPos.current),
      };
    }

    if (cameraView === "orbit" && controlsRef.current) {
      const controls = controlsRef.current;
      if (targetCamPos.current && targetLookAt.current) {
        controls.object.position.lerp(targetCamPos.current, ease(4.5));
        controls.target.lerp(targetLookAt.current, ease(4.5));
        if (
          controls.object.position.distanceTo(targetCamPos.current) < 0.02 &&
          controls.target.distanceTo(targetLookAt.current) < 0.02
        ) {
          targetCamPos.current = null;
          targetLookAt.current = null;
        }
      } else if (hasRobot) {
        // Soft follow while the robot walks: keep the operator's chosen
        // orbit offset, but carry target and camera along together once
        // the subject drifts out of the framed spot.
        cameraScratchVec.set(pelvis[0], pelvis[1] + 0.1, pelvis[2]);
        const drift = cameraScratchVec.distanceTo(controls.target);
        if (drift > 0.45) {
          const delta = cameraScratchVec.clone().sub(controls.target).multiplyScalar(ease(2.5));
          controls.target.add(delta);
          controls.object.position.add(delta);
        }
        // Keep walls out of the line of sight even while the operator orbits.
        const resolved = resolveCameraBoom(
          [controls.target.x, controls.target.y, controls.target.z],
          [controls.object.position.x, controls.object.position.y, controls.object.position.z],
          obstacles,
          CAMERA_PROBE_RADIUS,
        );
        if (resolved.fraction < 0.999) {
          controls.object.position.lerp(new THREE.Vector3(...resolved.position), ease(8));
        }
      }
      clampCameraToHouse(controls.object.position);
      controls.update();
      lookAtRef.current.copy(controls.target);
      return;
    }

    if (cameraView === "follow") {
      const lookAt: [number, number, number] = [pelvis[0], pelvis[1] + 0.15, pelvis[2]];
      const boom = chooseBoom(lookAt, h, FOLLOW_BOOM_LENGTH, FOLLOW_BOOM_HEIGHT, obstacles, followAzimuth.current);
      followAzimuth.current = boom.azimuthDeg;
      cameraScratchVec.set(...boom.position);
      camera.position.lerp(cameraScratchVec, ease(3.5));
      lookAtRef.current.lerp(new THREE.Vector3(...lookAt), ease(6));
    } else if (cameraView === "pov") {
      // Eye level at the head, a touch forward so the visor never clips.
      cameraScratchVec.set(pelvis[0] + h[0] * 0.08, pelvis[1] + 0.62, pelvis[2] + h[1] * 0.08);
      camera.position.lerp(cameraScratchVec, ease(10));
      lookAtRef.current.lerp(
        new THREE.Vector3(pelvis[0] + h[0] * 2.5, pelvis[1] + 0.45, pelvis[2] + h[1] * 2.5),
        ease(5),
      );
    } else if (cameraView === "blueprint") {
      cameraScratchVec.set(pelvis[0] + 0.3, 5.5, pelvis[2] + 0.01);
      camera.position.lerp(cameraScratchVec, ease(4));
      lookAtRef.current.lerp(new THREE.Vector3(pelvis[0] + 0.3, 0, pelvis[2]), ease(4));
    } else if (cameraView === "fly") {
      // FlyControls already moved the camera this frame: keep it inside
      // the lot and out of the walls and furniture so the operator cannot
      // fly through a sofa or lose the house entirely.
      const { clamped } = clampSphereAgainstHouse(
        [camera.position.x, camera.position.y, camera.position.z],
        CAMERA_PROBE_RADIUS,
        obstacles as OrientedBoundingBox[],
        HOUSE_CAMERA_MIN_Y - CAMERA_PROBE_RADIUS,
        HOUSE_CAMERA_BOUNDS,
      );
      camera.position.set(clamped[0], Math.min(HOUSE_CAMERA_MAX_Y, clamped[1]), clamped[2]);
      return;
    }
    clampCameraToHouse(camera.position);
    camera.lookAt(lookAtRef.current);
  });

  return cameraView === "orbit" ? (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={0.5}
      maxDistance={30}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI / 2 - 0.02}
      touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
    />
  ) : cameraView === "fly" ? (
    // Free-fly 6-DOF: W/A/S/D + Q/E or RMB drag. The useFrame pass above
    // clamps the result to the house footprint and out of every OBB.
    <FlyControls
      movementSpeed={1.4}
      rollSpeed={0.6}
      dragToLook
      autoForward={false}
    />
  ) : null;
}

const houseSceneData = createHouseNavigationScene(CRAFTSMAN_BUNGALOW_1928);

function LimbPinHandle({
  pin,
  anchors,
  heading,
  offset,
  onDrag,
}: {
  pin: (typeof G1_INTERACTIVE_PINS)[number];
  anchors: RobotAnchors;
  heading: [number, number];
  offset: [number, number, number] | null;
  onDrag: (pinId: InteractiveLimbPinId, offset: [number, number, number] | null) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const startPointerRef = useRef<[number, number]>([0, 0]);
  const startOffsetRef = useRef<[number, number, number]>([0, 0, 0]);

  const anchor =
    pin.id === "head"
      ? anchors.headCrown
      : pin.id === "pelvis"
        ? anchors.pelvis
        : pin.id === "leftHand"
          ? anchors.leftHand
          : pin.id === "rightHand"
            ? anchors.rightHand
            : pin.id === "leftFoot"
              ? anchors.leftFoot
              : anchors.rightFoot;
  // Rest pose: on the live link, pushed outward along the standoff so the
  // pin floats beside the shell. A second clamp against every body link
  // guarantees the sphere is outside the robot even when a limb swings
  // through the standoff direction mid-stride.
  const restPos = clampSphereAgainstLinks(
    limbPinRestPosition(anchor, heading, pin.standoff),
    pin.radius,
    anchors.links,
    G1_BODY_LINK_RADIUS_METERS,
  ).clamped;

  const currentPos: [number, number, number] = offset
    ? clampSphereAgainstLinks(
        [restPos[0] + offset[0], restPos[1] + offset[1], restPos[2] + offset[2]],
        pin.radius,
        anchors.links,
        G1_BODY_LINK_RADIUS_METERS,
      ).clamped
    : restPos;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    startPointerRef.current = [e.point.x, e.point.z];
    startOffsetRef.current = offset || [0, 0, 0];
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    const dx = e.point.x - startPointerRef.current[0];
    const dz = e.point.z - startPointerRef.current[1];
    const proposed: [number, number, number] = [
      restPos[0] + startOffsetRef.current[0] + dx,
      restPos[1],
      restPos[2] + startOffsetRef.current[2] + dz,
    ];

    const house = clampSphereAgainstHouse(proposed, pin.radius, houseSceneData.obstacles, 0.02);
    const body = clampSphereAgainstLinks(house.clamped, pin.radius, anchors.links, G1_BODY_LINK_RADIUS_METERS);

    if (house.contact || body.overlapped) {
      robotAudio.playCollisionBump(0.03);
    }

    onDrag(pin.id, [
      body.clamped[0] - restPos[0],
      body.clamped[1] - restPos[1],
      body.clamped[2] - restPos[2],
    ]);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <group position={currentPos}>
      {isDragging && (
        <mesh
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          visible={false}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
      {/* Hit target covering the ring and its interior; see the root handle. */}
      <mesh onPointerDown={handlePointerDown}>
        <sphereGeometry args={[pin.radius * 1.4, 10, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[pin.radius * 0.75, 0.008, 8, 20]} />
        <meshStandardMaterial
          color={isDragging ? "#f59e0b" : pin.color}
          emissive={isDragging ? "#d97706" : pin.color}
          emissiveIntensity={isDragging ? 2.5 : 1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

/**
 * IK ghost for the six-pin mode: the browser-side full-body solver
 * (solveFullBodyG1IK: two-bone limbs, joint clamps, house-aware sphere
 * clamps) posed at the dragged pin targets and drawn as a translucent stick
 * figure beside the owner-posed mesh. It shows what a kinematic solution
 * for the dragged extremities looks like and where it would touch the
 * house, without pretending the kernel re-ran.
 */
function G1IkGhost({
  anchors,
  limbOffsets,
}: {
  anchors: RobotAnchors;
  limbOffsets: Partial<Record<InteractiveLimbPinId, [number, number, number]>>;
}) {
  const result = useMemo(() => {
    const shifted = (
      anchor: [number, number, number],
      offset: [number, number, number] | undefined,
    ): [number, number, number] | undefined =>
      offset ? [anchor[0] + offset[0], anchor[1] + offset[1], anchor[2] + offset[2]] : undefined;
    const headCenter: [number, number, number] = [
      anchors.headCrown[0],
      anchors.headCrown[1] - 0.105,
      anchors.headCrown[2],
    ];
    return solveFullBodyG1IK(
      {
        pelvis: shifted(anchors.pelvis, limbOffsets.pelvis),
        head: shifted(headCenter, limbOffsets.head),
        leftHand: shifted(anchors.leftHand, limbOffsets.leftHand),
        rightHand: shifted(anchors.rightHand, limbOffsets.rightHand),
        leftFoot: shifted(anchors.leftFoot, limbOffsets.leftFoot),
        rightFoot: shifted(anchors.rightFoot, limbOffsets.rightFoot),
      },
      anchors.pelvis,
      houseSceneData.obstacles,
    );
  }, [anchors, limbOffsets]);
  const bones: Array<[[number, number, number], [number, number, number]]> = [
    [result.pelvisPosition, result.torsoPosition],
    [result.torsoPosition, result.headPosition],
    [result.torsoPosition, result.leftElbowPosition],
    [result.leftElbowPosition, result.leftHandPosition],
    [result.torsoPosition, result.rightElbowPosition],
    [result.rightElbowPosition, result.rightHandPosition],
    [result.pelvisPosition, result.leftKneePosition],
    [result.leftKneePosition, result.leftFootPosition],
    [result.pelvisPosition, result.rightKneePosition],
    [result.rightKneePosition, result.rightFootPosition],
  ];
  const color = result.isColliding ? "#f43f5e" : "#38bdf8";
  return (
    <group>
      {bones.map(([from, to], index) => {
        const a = new THREE.Vector3(...from);
        const b = new THREE.Vector3(...to);
        const length = Math.max(0.01, a.distanceTo(b));
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          b.clone().sub(a).normalize(),
        );
        return (
          <mesh key={index} position={mid} quaternion={quaternion}>
            <cylinderGeometry args={[0.018, 0.018, length, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.45} depthWrite={false} />
          </mesh>
        );
      })}
      <mesh position={result.headPosition}>
        <sphereGeometry args={[0.09, 14, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {result.contacts.map((contact, index) => (
        <mesh key={`contact-${index}`} position={contact.point}>
          <sphereGeometry args={[0.025, 10, 8]} />
          <meshBasicMaterial color="#f43f5e" transparent opacity={0.9} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function RagdollDragger({
  pelvisThree,
  anchors,
  heading,
  dragOffset,
  dragMode = "pelvis",
  limbOffsets = {},
  onDragChange,
  onDragCommit,
  onLimbDragChange,
  onCollisionChange,
}: {
  pelvisThree: [number, number, number];
  /** Live world-space anchors of the rendered robot; null before a trace exists. */
  anchors: RobotAnchors | null;
  heading: [number, number];
  dragOffset: [number, number, number] | null;
  dragMode?: "pelvis" | "limbs";
  limbOffsets?: Partial<Record<InteractiveLimbPinId, [number, number, number]>>;
  onDragChange: (offset: [number, number, number] | null) => void;
  /** Fired once when the operator releases the robot, not on every move. */
  onDragCommit?: () => void;
  onLimbDragChange?: (pinId: InteractiveLimbPinId, offset: [number, number, number] | null) => void;
  onCollisionChange: (col: { isColliding: boolean; obstacleName: string | null; clearance: number }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [lastColliding, setLastColliding] = useState(false);
  const startPointerRef = useRef<[number, number]>([0, 0]);
  const startOffsetRef = useRef<[number, number, number]>([0, 0, 0]);
  const currentPos: [number, number, number] = dragOffset
    ? [pelvisThree[0] + dragOffset[0], pelvisThree[1] + dragOffset[1], pelvisThree[2] + dragOffset[2]]
    : pelvisThree;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    startPointerRef.current = [e.point.x, e.point.z];
    startOffsetRef.current = dragOffset || [0, 0, 0];
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    const dx = e.point.x - startPointerRef.current[0];
    const dz = e.point.z - startPointerRef.current[1];
    const proposed: [number, number, number] = [
      pelvisThree[0] + startOffsetRef.current[0] + dx,
      pelvisThree[1],
      pelvisThree[2] + startOffsetRef.current[2] + dz,
    ];

    // CONTINUOUS COLLISION DETECTION (CCD) & OBB/WALL SURFACE CLAMPING
    const { clampedPosition, isColliding, nearestObstacleName, minClearance } =
      clampPositionAgainstHouseCollisions(proposed, houseSceneData.obstacles, 0.32);

    const newOffset: [number, number, number] = [
      clampedPosition[0] - pelvisThree[0],
      0,
      clampedPosition[2] - pelvisThree[2],
    ];
    onDragChange(newOffset);
    onCollisionChange({ isColliding, obstacleName: nearestObstacleName, clearance: minClearance });
    setLastColliding(isColliding);
  };
  const handlePointerUp = () => {
    if (isDragging) onDragCommit?.();
    setIsDragging(false);
    setLastColliding(false);
  };

  return (
    <group>
      {/* Invisible horizontal raycast plane for smooth dragging */}
      {isDragging && (
        <mesh
          position={[0, pelvisThree[1], 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          visible={false}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Holographic Ragdoll Grab Pin / Handle floating above the head.
          The handle centre sits one sphere radius plus a visible gap above
          the head crown, so it never intersects the robot; the stalk drops
          from the handle to the crown. */}
      <group
        position={
          anchors
            ? [anchors.headCrown[0], anchors.headCrown[1] + 0.2, anchors.headCrown[2]]
            : [currentPos[0], currentPos[1] + 1.05, currentPos[2]]
        }
      >
        {/* Hit target. The visible affordance is a ring, so the obvious place
            to aim — its centre — is a hole and a click there grabs nothing.
            This invisible sphere covers the ring and its interior. */}
        <mesh onPointerDown={handlePointerDown}>
          <sphereGeometry args={[0.1, 12, 10]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.075, 0.012, 12, 28]} />
          <meshStandardMaterial
            color={lastColliding ? "#f43f5e" : isDragging ? "#f59e0b" : "#38bdf8"}
            emissive={lastColliding ? "#be123c" : isDragging ? "#d97706" : "#0284c7"}
            emissiveIntensity={lastColliding ? 3.0 : isDragging ? 2.5 : 1.2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Dynamic Collision Boundary Safety Ring on Floor */}
      <mesh
        position={[currentPos[0], 0.02, currentPos[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.32, 0.38, 36]} />
        <meshBasicMaterial
          color={isDragging ? "#fb7185" : "#34d399"}
          transparent
          opacity={isDragging ? 0.85 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Multi-Limb Ragdoll IK Interactive Pins */}
      {dragMode === "limbs" && onLimbDragChange && anchors && (
        <group>
          {G1_INTERACTIVE_PINS.map((pin) => (
            <LimbPinHandle
              key={pin.id}
              pin={pin}
              anchors={anchors}
              heading={heading}
              offset={limbOffsets[pin.id] || null}
              onDrag={onLimbDragChange}
            />
          ))}
          {Object.values(limbOffsets).some(Boolean) ? (
            <G1IkGhost anchors={anchors} limbOffsets={limbOffsets} />
          ) : null}
        </group>
      )}
    </group>
  );
}

type NearestObstacleReadout = {
  distance: number;
  obstacleName: string;
  linkIndex: number;
  linkPoint: [number, number, number];
  surfacePoint: [number, number, number];
};

/**
 * The closest rigid house surface to any rendered link: the live value of
 * the clearance term the multi-factor objective and the HOCBF safety
 * barrier both consume. Returned in world space so it can be drawn.
 */
function nearestRigidObstacle(
  links: readonly [number, number, number][],
  obstacles: readonly OrientedBoundingBox[],
): NearestObstacleReadout | null {
  let best: NearestObstacleReadout | null = null;
  for (let index = 0; index < links.length; index++) {
    const link = links[index];
    for (const obb of obstacles) {
      if (obb.exemptFromPenalty) continue;
      const d = distanceToOBB(link, obb);
      if (!best || d < best.distance) {
        best = {
          distance: d,
          obstacleName: obb.name,
          linkIndex: index,
          linkPoint: link,
          surfacePoint: closestPointOnOBB(link, obb),
        };
      }
    }
  }
  return best;
}

// The per-frame projection pushes every link to exactly the clearance floor,
// so a reading AT the floor is the guard working, not a violation. Only a
// genuine breach of the floor is red.
const G1_CLEARANCE_BREACH_METERS = G1_LINK_CLEARANCE_METERS - 0.005;

function clearanceColor(distance: number): string {
  if (distance < G1_CLEARANCE_BREACH_METERS) return "#f43f5e";
  if (distance < 0.3) return "#f59e0b";
  return "#34d399";
}

/**
 * Clearance beam: a thin bar from the nearest link to the nearest rigid
 * surface, plus a floor disc under that link. Colour encodes the margin
 * (green: comfortable, amber: inside 30 cm, red: below the link radius).
 * This is the same distance the collision penalty channel integrates, so
 * the viewer can watch the number the optimizer is trading against.
 */
function G1ClearanceBeam({ readout }: { readout: NearestObstacleReadout | null }) {
  if (!readout) return null;
  const a = new THREE.Vector3(...readout.linkPoint);
  const b = new THREE.Vector3(...readout.surfacePoint);
  const length = Math.max(0.005, a.distanceTo(b));
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    b.clone().sub(a).normalize(),
  );
  const color = clearanceColor(readout.distance);
  return (
    <group>
      <mesh position={mid} quaternion={quaternion}>
        <cylinderGeometry args={[0.006, 0.006, length, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} depthWrite={false} />
      </mesh>
      <mesh position={b}>
        <sphereGeometry args={[0.02, 10, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} depthWrite={false} />
      </mesh>
      {/* No floor disc. Sized to the clearance distance it drew a ring more
          than a metre across, and lying flat it z-fought the terrain overlay.
          The bar and its surface marker carry the same information, and the
          toolbar chip carries the number. */}
    </group>
  );
}

function RobotStage({
  trace,
  admission,
  reduceMotion,
  meshState,
  xrayMode,
  physicsDebug,
  cameraView,
  timeOfDay,
  activeRoom,
  showRoof,
  activeRouteId,
  isPlaying,
  playbackSpeed,
  sampleIndex,
  onSampleIndexChange,
  shoveActive,
  pushAngleDeg = 90,
  pushImpulseNs = 15,
  robotDragOffset,
  dragMode = "pelvis",
  limbOffsets = {},
  onRobotDragChange,
  onRobotDragCommit,
  onLimbDragChange,
  onDragCollisionChange,
}: {
  trace: G1TraceReceipt | null;
  admission: G1Admission | null;
  reduceMotion: boolean;
  meshState: G1MeshState;
  xrayMode: boolean;
  physicsDebug: boolean;
  cameraView: "orbit" | "follow" | "pov" | "blueprint" | "fly";
  timeOfDay: "afternoon-sun" | "golden-hour" | "evening-glow";
  activeRoom: "all" | "living" | "dining" | "kitchen" | "porch" | "bedroom" | "bathroom" | "cutaway";
  showRoof?: boolean;
  activeRouteId?: string;
  isPlaying: boolean;
  playbackSpeed: number;
  sampleIndex: number;
  onSampleIndexChange: (idx: number) => void;
  shoveActive: boolean;
  pushAngleDeg?: number;
  pushImpulseNs?: number;
  robotDragOffset?: [number, number, number] | null;
  dragMode?: "pelvis" | "limbs";
  limbOffsets?: Partial<Record<InteractiveLimbPinId, [number, number, number]>>;
  onRobotDragChange?: (offset: [number, number, number] | null) => void;
  onRobotDragCommit?: () => void;
  onLimbDragChange?: (pinId: InteractiveLimbPinId, offset: [number, number, number] | null) => void;
  onDragCollisionChange?: (col: { isColliding: boolean; obstacleName: string | null; clearance: number }) => void;
}) {
  const sample = trace ? trace.samples[Math.min(sampleIndex, trace.samples.length - 1)] : null;
  const pelvisThree = sample ? ownerToThree(sample.linkPoses[0].position) : ([0.0, 0.75, 0.0] as [number, number, number]);
  // The same world-space projection RobotPlayback draws, so handles, pins,
  // the debug ring, and the camera all track the mesh the viewer sees.
  const anchors = useMemo(
    () =>
      sample
        ? computeRobotAnchors(
            projectSampleAgainstHouse(
              sample,
              trace && sampleIndex > 0 ? trace.samples[sampleIndex - 1] : null,
              robotDragOffset ?? null,
            ),
            robotDragOffset ?? null,
          )
        : null,
    [sample, trace, sampleIndex, robotDragOffset],
  );
  const heading = useMemo<[number, number]>(
    () => (trace ? robotHeading(trace, sampleIndex) : [1, 0]),
    [trace, sampleIndex],
  );
  // Memoized: this scans 30 links against every rigid house body, and the
  // stage re-renders for unrelated prop changes (camera mode, room, toggles).
  const clearanceReadout = useMemo(
    () => (anchors ? nearestRigidObstacle(anchors.links, houseSceneData.obstacles) : null),
    [anchors],
  );
  const displayedPelvisThree: [number, number, number] = anchors
    ? anchors.pelvis
    : robotDragOffset
      ? [
          pelvisThree[0] + robotDragOffset[0],
          pelvisThree[1] + robotDragOffset[1],
          pelvisThree[2] + robotDragOffset[2],
        ]
      : pelvisThree;

  const bgColor = timeOfDay === "golden-hour" ? "#1e1308" : timeOfDay === "evening-glow" ? "#070b14" : "#0f172a";

  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = timeOfDay === "evening-glow" ? 1.4 : 1.25;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 7.5, 18.0]} />
      <PerspectiveCamera makeDefault position={[1.85, 1.15, 2.35]} fov={36} near={0.05} far={40} />

      {/* 1928 Sears Craftsman Estate (Complete 7-Room Whole-House Architectural Environment) */}
      <SearsCraftsmanEstate
        showFurniture={!xrayMode}
        showRoof={showRoof}
        activeRoom={activeRoom}
        activeRouteId={activeRouteId}
        timeOfDay={timeOfDay}
      />

      {admission?.config.challenge === "terrain-and-push" && (
        <TerrainSurface admission={admission} />
      )}

      {/* Walking Path Subfloor Guideline */}
      <mesh position={[0.975, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.95, 0.008]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>

      {trace ? (
        <RobotPlayback
          key={`${trace.objective}:${trace.distanceMeters}:${trace.samples.length}`}
          trace={trace}
          admission={admission}
          reduceMotion={reduceMotion}
          meshState={meshState}
          xrayMode={xrayMode}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          sampleIndex={sampleIndex}
          onSampleIndexChange={onSampleIndexChange}
          shoveActive={shoveActive}
          pushAngleDeg={pushAngleDeg}
          pushImpulseNs={pushImpulseNs}
          positionOffset={robotDragOffset}
        />
      ) : null}

      <RagdollDragger
        pelvisThree={pelvisThree}
        anchors={anchors}
        heading={heading}
        dragOffset={robotDragOffset ?? null}
        dragMode={dragMode}
        limbOffsets={limbOffsets}
        onDragChange={onRobotDragChange ?? (() => {})}
        onDragCommit={onRobotDragCommit}
        onLimbDragChange={onLimbDragChange}
        onCollisionChange={onDragCollisionChange ?? (() => {})}
      />

      <CameraRig
        cameraView={cameraView}
        activeRoom={activeRoom}
        pelvisThree={displayedPelvisThree}
        heading={heading}
        obstacles={houseSceneData.obstacles}
        hasRobot={Boolean(trace && robotDragOffset)}
      />

      <G1ClearanceBeam readout={clearanceReadout} />

      <G1PhysicsDebugOverlay
        enabled={physicsDebug}
        sample={sample}
        obstacles={houseSceneData.obstacles}
        pelvisPosition={displayedPelvisThree}
        safeRadius={0.32}
      />
    </Canvas>
  );
}

function number(value: number, digits = 3): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}

function stageSceneHint(
  xrayMode: boolean,
  cameraView: "orbit" | "follow" | "pov" | "blueprint" | "fly",
): string {
  if (xrayMode) return "X-Ray: Green polygon is dynamic support boundary.";
  switch (cameraView) {
    case "orbit":
      return "1928 Sears Craftsman Living Room · Drag to orbit · pinch to zoom.";
    case "follow":
      return "1928 Sears Craftsman Living Room · Follow camera tracks the pelvis.";
    case "pov":
      return "1928 Sears Craftsman Living Room · Robot point of view.";
    case "blueprint":
      return "1928 Sears Craftsman Living Room · Top-down map view.";
    case "fly":
      return "1928 Sears Craftsman Living Room · Free-fly 6-DOF: WASD + Q/E + drag to look.";
  }
  return "1928 Sears Craftsman Living Room";
}



export function G1WalkingFlagship({ embedded = false }: { embedded?: boolean } = {}) {
  const reduceMotion = useReducedMotion() ?? false;
  // page (shadow-mapped robot rig). Free it when far offscreen; 600px margin
  // keeps it warm while approaching (see WingViz rationale).
  const stageRef = useRef<HTMLDivElement | null>(null);
  const shouldMountStage = useInView(stageRef, { rootMargin: "600px 0px 600px 0px" });
  // Real G1 meshes load only while the stage is near the viewport; the
  // capsule rig stays as the honest fallback when assets can't load. Meshes
  // are cached after first approach while the heavier WebGL stage still
  // unmounts offscreen, then disposed when this component itself unmounts.
  const shouldLoadMeshes = useInView(stageRef, {
    rootMargin: "600px 0px 600px 0px",
    once: true,
  });
  const [meshState, retryMeshes] = useG1Meshes(shouldLoadMeshes);
  const workerActivated = shouldLoadMeshes;
  const workerRef = useRef<Worker | null>(null);
  // Synchronous in-flight gate. React state (busy) updates
  // asynchronously; two rapid clicks within the same render tick both
  // see busy === null and would both postMessage, racing the worker's
  // CMA session. The ref updates synchronously when post() runs.
  const inFlightRef = useRef<boolean>(false);
  const [trace, setTrace] = useState<G1TraceReceipt | null>(null);
  const [admission, setAdmission] = useState<G1Admission | null>(null);
  const [stabilizerTrace, setStabilizerTrace] = useState<G1TraceReceipt | null>(null);
  const [curriculumTrace, setCurriculumTrace] = useState<G1TraceReceipt | null>(null);
  const [workerAvailable, setWorkerAvailable] = useState(true);
  // Measured, not assumed. Given equal wall time from the same curriculum mean,
  // LM-MA reached a better objective than LM-CMA at both radii worth using
  // (-9.83 vs -9.34 at sigma 5e-4; -9.64 vs -7.11 at 1e-3), and separable CMA
  // never improved on the seed at any radius tested. Runs are deterministically
  // seeded, so these are reproducible numbers rather than one lucky draw.
  const [family, setFamily] = useState<ScalableFamily>("lm-ma");
  const [task, setTask] = useState<G1Task>("walking");
  // Learn the basic walking policy first. Terrain + push remains one tap away,
  // but making it the cold-start objective needlessly delays visible walking.
  const [challenge, setChallenge] = useState<G1Challenge>("flat");
  const [searchSigma, setSearchSigma] = useState(G1_DEFAULT_SEARCH_SIGMA);
  const [seedIndex, setSeedIndex] = useState(0);
  const [busy, setBusy] = useState<"preview" | "optimize" | "compare" | null>("preview");
  const [stopRequested, setStopRequested] = useState(false);
  const [status, setStatus] = useState("Loading the owner-composed G1 experiment…");
  const [error, setError] = useState<string | null>(null);
  // Mobile: show the 4 most consequential receipt cards by default; user can
  // expand to all 22 (or hide them) so the page doesn't drown the viewport
  // in 11 rows of telemetry. Desktop: show all (md:block).
  const [showAllReceipts, setShowAllReceipts] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [bestObjective, setBestObjective] = useState<number | null>(null);
  // The full progress history lives in a ref so the head/body/tail downsample
  // can see every generation from gen 0 to the current one. The state holds
  // only the downsampled window (200 points max) so React re-renders are
  // bounded and the convergence chart only sees what it can display.
  // Physical measurements of each replayed best policy, so the viewer can see
  // what improved rather than only that the objective fell. Points arrive at
  // the replay cadence, not every generation, because each one costs a real
  // rollout.
  const [ledger, setLedger] = useState<LearningLedgerPoint[]>([]);
  // The coefficients behind whatever is on stage, and the curriculum mean a
  // share link measures its delta against. Both arrive from the worker with
  // the traces it replays.
  const [stagePolicy, setStagePolicy] = useState<Float64Array | null>(null);
  const [policyBaseline, setPolicyBaseline] = useState<Float64Array | null>(null);
  // A policy arriving in the URL cannot be decoded until the owner has handed
  // over its baseline, so the fragment waits here until it can be read.
  const pendingShareRef = useRef<string | null>(null);
  // Wall-clock time actually spent searching, accumulated across start/stop so
  // a run left going overnight can say what it cost. Kept in a ref and mirrored
  // into state on progress messages, which already arrive at a sane cadence.
  const trainingStartedAtRef = useRef<number | null>(null);
  const trainingSecondsRef = useRef(0);
  const [trainingSeconds, setTrainingSeconds] = useState(0);
  const progressHistoryRef = useRef<ConvergencePoint[]>([]);
  const [progressHistory, setProgressHistory] = useState<ConvergencePoint[]>([]);
  const [activeTrace, setActiveTrace] = useState<G1TraceOrigin>("curriculum");
  const [comparison, setComparison] = useState<ComparisonRow[] | null>(null);
  // The Craftsman estate is now first-class on both surfaces. X-ray remains
  // one tap away, but embedded/native users should not silently miss the
  // rooms, lighting, and architectural inspector added to the flagship.
  const [xrayMode, setXrayMode] = useState(false);
  const [physicsDebug, setPhysicsDebug] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<"afternoon-sun" | "golden-hour" | "evening-glow">("afternoon-sun");
  const [activeRoom, setActiveRoom] = useState<"all" | "living" | "dining" | "kitchen" | "porch" | "bedroom" | "bathroom" | "cutaway">("living");
  const [showRoof, setShowRoof] = useState(false);
  const [activeRouteId, setActiveRouteId] = useState<string>("grand-tour");
  const [cameraView, setCameraView] = useState<"orbit" | "follow" | "pov" | "blueprint" | "fly">(
    embedded ? "follow" : "orbit",
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState("owner-receipt");
  const [shoveActive, setShoveActive] = useState(false);
  const [pushAngleDeg, setPushAngleDeg] = useState(90);
  const [pushImpulseNs, setPushImpulseNs] = useState(15);
  const [showPushOptions, setShowPushOptions] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [robotDragOffset, setRobotDragOffset] = useState<[number, number, number] | null>(null);

  const handleExportTelemetry = useCallback(() => {
    if (!trace) return;
    const telemetryData = {
      exportTimestamp: new Date().toISOString(),
      task,
      challenge,
      family,
      generation,
      bestObjective,
      distanceMeters: trace.distanceMeters,
      completedSteps: trace.completedSteps,
      actuatorWorkJoules: trace.actuatorWorkJoules,
      pushImpulseNs: trace.pushImpulseNewtonSeconds,
      recoveryTimeSeconds: trace.recoveryTimeSeconds,
      maximumTiltDegrees: (Math.asin(Math.min(1, trace.maximumTiltSine)) * 180) / Math.PI,
      samples: trace.samples.map((s) => ({
        timeSeconds: s.timeSeconds,
        pelvisPosition: s.linkPoses[0].position,
        leftContact: s.leftContact,
        rightContact: s.rightContact,
      })),
    };
    const blob = new Blob([JSON.stringify(telemetryData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `g1-telemetry-${task}-${challenge}-${family}-gen${generation}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported trajectory telemetry JSON receipt.");
  }, [trace, task, challenge, family, generation, bestObjective]);

  const handleApplyShove = useCallback(() => {
    setShoveActive(true);
    setTimeout(() => setShoveActive(false), 800);
    setStatus(
      `Previewing a display-only ${pushImpulseNs} N·s vector at ${pushAngleDeg}°. The owner rollout, controller, HOCBF result, and receipt are unchanged.`,
    );
  }, [pushAngleDeg, pushImpulseNs]);
  // Spawn-safe seat. This is now decided BEFORE any rollout, from a
  // conservative policy-independent walking envelope, because the walking
  // owner needs its keep-out boxes declared relative to wherever the robot
  // starts and cannot be told that after the fact. Deriving the seat from a
  // returned trace, as this did, would be circular now that the trace itself
  // depends on the roster. g1SeatForHouse picks the candidate nearest the
  // living room whose whole swept envelope clears every rigid obstacle.
  // Async-defer the setState so the effect body does not fire a
  // synchronous setState inside another effect (react-hooks).
  useEffect(() => {
    if (robotDragOffset !== null) return;
    if (!trace) return;
    const pelvisPose = trace.samples[0]?.linkPoses[0];
    if (!pelvisPose) return;
    let cancelled = false;
    const pelvis = ownerToThree(pelvisPose.position);
    const seated: [number, number, number] = [
      G1_HOUSE_SEAT.offset[0] - pelvis[0],
      0,
      G1_HOUSE_SEAT.offset[2] - pelvis[2],
    ];
    Promise.resolve().then(() => {
      if (cancelled) return;
      setRobotDragOffset((current) => current ?? seated);
    });
    return () => {
      cancelled = true;
    };
  }, [trace, robotDragOffset]);
  // Live nearest-surface clearance of the rendered robot (same number the
  // on-canvas beam draws), for the toolbar readout.
  const liveClearance = useMemo(() => {
    if (!trace || !robotDragOffset) return null;
    const sample = trace.samples[Math.min(sampleIndex, trace.samples.length - 1)];
    if (!sample) return null;
    const anchors = computeRobotAnchors(
      projectSampleAgainstHouse(
        sample,
        sampleIndex > 0 ? trace.samples[sampleIndex - 1] : null,
        robotDragOffset,
      ),
      robotDragOffset,
    );
    return nearestRigidObstacle(anchors.links, houseSceneData.obstacles);
  }, [trace, sampleIndex, robotDragOffset]);
  const [dragCollisionState, setDragCollisionState] = useState<{
    isColliding: boolean;
    obstacleName: string | null;
    clearance: number;
  }>({ isColliding: false, obstacleName: null, clearance: 1.0 });
  const [userHasDragged, setUserHasDragged] = useState(false);
  // Read inside the drag-release callback, which must not re-subscribe the
  // pointer handlers every time the seat, task or challenge changes.
  const robotDragOffsetRef = useRef<[number, number, number] | null>(null);
  const taskRef = useRef<G1Task>(task);
  const challengeRef = useRef<G1Challenge>(challenge);
  useEffect(() => {
    robotDragOffsetRef.current = robotDragOffset;
    taskRef.current = task;
    challengeRef.current = challenge;
  }, [robotDragOffset, task, challenge]);
  const [dragMode, setDragMode] = useState<"pelvis" | "limbs">("pelvis");
  const [limbOffsets, setLimbOffsets] = useState<Partial<Record<InteractiveLimbPinId, [number, number, number]>>>({});

  const handleRobotDragChange = useCallback((offset: [number, number, number] | null) => {
    setRobotDragOffset(offset);
    if (offset !== null) setUserHasDragged(true);
  }, []);


  const handleLimbDrag = useCallback((pinId: InteractiveLimbPinId, offset: [number, number, number] | null) => {
    setLimbOffsets((prev) => ({
      ...prev,
      [pinId]: offset ? offset : undefined,
    }));
  }, []);

  const post = useCallback((message: G1OptimizationRequest, mode: "preview" | "optimize" | "compare") => {
    if (!workerRef.current) return;
    // Synchronous gate — must precede setBusy (which is async). Two rapid
    // clicks in the same render tick both see busy === null without this.
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setError(null);
    setBusy(mode);
    workerRef.current.postMessage(message);
  }, []);

  const startContinuousOptimization = useCallback(() => {
    setStopRequested(false);
    post(
      {
        type: "optimize",
        task,
        family,
        generations: G1_LIVE_REPLAY_INTERVAL,
        seedIndex,
        mode: "continue",
        challenge,
        sigma: searchSigma,
        continuous: true,
      },
      "optimize",
    );
  }, [post, task, family, seedIndex, challenge, searchSigma]);

  const stopContinuousOptimization = useCallback(() => {
    if (!workerRef.current || busy !== "optimize" || stopRequested) return;
    setStopRequested(true);
    setStatus("Stopping after the current physical generation…");
    workerRef.current.postMessage({
      type: "stop",
      task,
      family,
      seedIndex,
      challenge,
    } satisfies G1OptimizationRequest);
  }, [busy, stopRequested, task, family, seedIndex, challenge]);

  const requestPreview = useCallback((nextTask: G1Task, nextChallenge: G1Challenge) => {
    setTask(nextTask);
    setChallenge(nextChallenge);
    setTrace(null);
    setAdmission(null);
    setStabilizerTrace(null);
    setCurriculumTrace(null);
    setGeneration(0);
    setBestObjective(null);
    setComparison(null);
    setActiveTrace("curriculum");
    progressHistoryRef.current = [];
    setLedger([]);
    setProgressHistory([]);
    setStatus(`Loading the owner-composed ${G1_TASK_COPY[nextTask].action} experiment…`);
    post({ type: "preview", task: nextTask, challenge: nextChallenge }, "preview");
  }, [post]);

  // Releasing the robot re-certifies it where it now stands.
  //
  // The owner always starts its rollout at its own origin, so a receipt is
  // only about the seat whose keep-out roster produced it. Without this the
  // page kept displaying the original seat's verdict after a drag: put the
  // robot in the sofa and it still read "0 penetration". Now the boxes are
  // re-expressed around the new seat and the owner answers again — including
  // refusing, which is the honest answer for a robot stood inside furniture.
  const handleRobotDragCommit = useCallback(() => {
    const offset = robotDragOffsetRef.current;
    if (!offset) return;
    post(
      {
        type: "preview",
        task: taskRef.current,
        challenge: challengeRef.current,
        seat: [offset[0], 0, offset[2]],
      },
      "preview",
    );
  }, [post]);

  /** Replay a policy the operator brought in, from a file or a share link. */
  const handlePolicyImport = useCallback(
    (imported: SharedPolicy) => {
      setStagePolicy(imported.policy);
      post(
        {
          type: "replay",
          task: taskRef.current,
          challenge: challengeRef.current,
          policy: imported.policy,
          generation: imported.generation,
        },
        "preview",
      );
    },
    [post],
  );

  // A policy can arrive in the URL before the owner has loaded. Stash the
  // fragment on mount and decode it once the baseline it is measured against
  // is available, which is when the curriculum trace lands.
  useEffect(() => {
    pendingShareRef.current = policyFragmentFromHash(window.location.hash);
  }, []);

  useEffect(() => {
    const fragment = pendingShareRef.current;
    if (!fragment || !policyBaseline) return;
    pendingShareRef.current = null;
    let active = true;
    void decodePolicyFragment(fragment, policyBaseline)
      .then((imported) => {
        if (!active) return;
        setStatus(
          `Loaded a shared generation-${imported.generation} policy from this link. Replaying it…`,
        );
        handlePolicyImport(imported);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setError(error instanceof Error ? error.message : "This share link could not be read.");
      });
    return () => {
      active = false;
    };
  }, [policyBaseline, handlePolicyImport]);

  useEffect(() => {
    if (!embedded) return;
    return installFrankenRobotsNativeCommandHandler("humanoid", (command) => {
      if (!workerAvailable || !workerRef.current) {
        return { accepted: false, detail: "The humanoid owner worker is not ready." };
      }
      if (command.command === "select-task") {
        if (busy !== null || inFlightRef.current) {
          return { accepted: false, detail: "Finish or stop the current owner request first." };
        }
        if (!command.task) {
          return { accepted: false, detail: "The locomotion task was not provided." };
        }
        if (command.task === task) {
          return {
            accepted: true,
            detail: `${G1_TASK_COPY[task].label} is already the active physical objective.`,
          };
        }
        requestPreview(command.task, challenge);
        return {
          accepted: true,
          detail: `Accepted ${G1_TASK_COPY[command.task].label}; loading its owner-composed policy seed.`,
        };
      }
      if (command.command === "stop") {
        if (busy !== "optimize") {
          return { accepted: false, detail: "No humanoid learning run is active." };
        }
        stopContinuousOptimization();
        return {
          accepted: true,
          detail: "Accepted Stop; finishing the current physical generation safely.",
        };
      }
      if (inFlightRef.current) {
        return { accepted: false, detail: "An owner request is already running." };
      }
      startContinuousOptimization();
      return {
        accepted: true,
        detail: `Accepted continuous ${family} learning for the ${task} owner; it will run until Stop.`,
      };
    });
  }, [
    embedded,
    workerAvailable,
    busy,
    startContinuousOptimization,
    stopContinuousOptimization,
    requestPreview,
    challenge,
    task,
    family,
  ]);

  const handleSelectChapter = useCallback((ch: StoryChapter) => {
    setCurrentChapter(ch.id);
    if (ch.challenge !== challenge) {
      requestPreview(task, ch.challenge);
      setSampleIndex(0);
      setIsPlaying(true);
      return;
    }
    if (ch.targetTrace === "stabilizer" && stabilizerTrace) {
      setTrace(stabilizerTrace);
      setActiveTrace("stabilizer");
    } else if (ch.targetTrace === "curriculum" && curriculumTrace) {
      setTrace(curriculumTrace);
      setActiveTrace("curriculum");
    } else if (ch.targetTrace === "separable" || ch.targetTrace === "lm-cma") {
      setFamily(ch.targetTrace);
      requestPreview(task, ch.challenge);
    }
    setSampleIndex(0);
    setIsPlaying(true);
  }, [task, challenge, stabilizerTrace, curriculumTrace, requestPreview, setCurrentChapter, setSampleIndex]);

  const handleSelectPreset = useCallback((p: ReceiptAnalysisPreset) => {
    setSelectedPreset(p.id);
    setStatus(
      `Viewing ${p.name} receipt lens (${p.lensStyle}). Owner task and optimization objective are unchanged.`,
    );
  }, []);

  useEffect(() => {
    if (!workerActivated) return;
    let active = true;
    let optimizerWorker: Worker;
    try {
      optimizerWorker = new Worker(new URL("../workers/g1OptimizationWorker.ts", import.meta.url), {
        type: "module",
        name: "frankensim-g1-optimizer",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      queueMicrotask(() => {
        if (!active) return;
        setWorkerAvailable(false);
        setBusy(null);
        setStatus("The optimization worker could not start in this browser.");
        setError(message);
      });
      return () => {
        active = false;
      };
    }
    workerRef.current = optimizerWorker;
    optimizerWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      // FOURTH INSTANCE: the effect re-runs in strict mode and on
      // dependency changes. The previous worker is terminated in the
      // cleanup, but messages already queued in the postMessage buffer
      // can still arrive on the main thread. The `active` flag is
      // cleared by the cleanup; this guard prevents stale messages
      // from triggering setState on the (now-stale or unmounted)
      // component, which would throw in strict mode and produce
      // confusing "state update on an unmounted component" warnings.
      if (!active) return;
      const message = event.data;
      if (message.type === "status") {
        setStatus(message.detail);
      } else if (message.type === "progress") {
        if (trainingStartedAtRef.current === null) {
          trainingStartedAtRef.current = Date.now();
        }
        setTrainingSeconds(
          trainingSecondsRef.current + (Date.now() - trainingStartedAtRef.current) / 1000,
        );
        setGeneration(message.generation);
        setBestObjective(message.bestObjective);
        setProgressHistory((_prev) => {
          // The full history lives in the ref; we downsample it here and
          // hand React a 200-point window. The ref grows monotonically; the
          // state is bounded.
          const HISTORY_CAP = 200;
          const HEAD = 10;
          const TAIL = 10;
          const point: ConvergencePoint = {
            generation: message.generation,
            bestObjective: message.bestObjective,
            sigma: message.sigma,
          };
          progressHistoryRef.current.push(point);
          // Training runs until the operator stops it, so this ref is not
          // bounded by a budget: at a couple of generations a second an
          // overnight run would accumulate hundreds of thousands of points.
          // Halve it by uniform decimation when it gets large. Each point
          // carries its own generation, so thinning changes the resolution of
          // the convergence plot and nothing else.
          const HISTORY_REF_CAP = 20_000;
          if (progressHistoryRef.current.length > HISTORY_REF_CAP) {
            progressHistoryRef.current = progressHistoryRef.current.filter(
              (_point, index) => index % 2 === 0,
            );
          }
          const full = progressHistoryRef.current;
          if (full.length <= HISTORY_CAP) return [...full];
          // Head (oldest HEAD points), body (log-spaced middle), tail
          // (newest TAIL points). The body uses log spacing so a 30k-gen
          // run shows roughly equal resolution per decade: gens 0-10, 10-100,
          // 100-1k, 1k-10k, 10k-30k.
          const n = full.length;
          const kept: ConvergencePoint[] = [];
          for (let k = 0; k < HEAD; k++) kept.push(full[k]);
          const bodyCount = HISTORY_CAP - HEAD - TAIL;
          const bodyStart = HEAD;
          const bodyEnd = n - TAIL;
          if (bodyCount > 0 && bodyEnd > bodyStart) {
            const lo = Math.log(bodyStart + 1);
            const hi = Math.log(bodyEnd);
            for (let k = 0; k < bodyCount; k++) {
              const t = bodyCount > 1 ? k / (bodyCount - 1) : 0;
              const idx = Math.round(Math.exp(lo + t * (hi - lo))) - 1;
              kept.push(full[Math.max(0, Math.min(n - 1, idx))]);
            }
          }
          for (let k = 0; k < TAIL; k++) kept.push(full[n - TAIL + k]);
          return kept;
        });
        setStatus(message.continuous
          ? `${FAMILY_COPY[message.family].title}: generation ${message.generation} · learning until you press Stop · σ ${message.sigma.toExponential(2)}`
          : `${FAMILY_COPY[message.family].title}: generation ${message.generation}/${message.maxGenerations}, σ ${message.sigma.toExponential(2)}`
        );
      } else if (message.type === "trace") {
        setAdmission(message.admission);
        setTask(message.admission.config.task);
        if (message.family === "stabilizer") {
          setStabilizerTrace(message.trace);
          setStatus(`Standing prior received; loading the ${G1_TASK_COPY[message.admission.config.task].action} policy seed…`);
          // The stabilizer trace is a one-shot at init; release the gate.
          inFlightRef.current = false;
          return;
        }
        setTrace(message.trace);
        if (message.family === "curriculum") setCurriculumTrace(message.trace);
        setActiveTrace(message.family);
        setGeneration(message.generation);
        setBestObjective(message.trace.objective);
        // The curriculum replay is generation 0, the ledger's baseline; every
        // optimized replay after it is measured against that. The standing
        // prior is not recorded, because the branch above returns before this
        // point — it is a different policy, not an earlier version of this one.
        if (message.policy) setStagePolicy(message.policy);
        if (message.baseline) setPolicyBaseline(message.baseline);
        setLedger((previous) =>
          appendLedgerPoint(
            previous,
            learningLedgerPoint(
              message.trace,
              message.generation,
              message.admission.config.stepSeconds,
              message.admission.config.targetSpeed,
            ),
          ),
        );
        if (message.continuing) {
          setStatus(`Learning continuously · generation ${message.generation} best policy now on stage.`);
          return;
        }
        // Bank the elapsed search time: the run has ended, so the clock stops
        // until the next generation arrives.
        if (trainingStartedAtRef.current !== null) {
          trainingSecondsRef.current += (Date.now() - trainingStartedAtRef.current) / 1000;
          trainingStartedAtRef.current = null;
          setTrainingSeconds(trainingSecondsRef.current);
        }
        setBusy(null);
        inFlightRef.current = false;
        setStopRequested(false);
        setStatus(
          message.stopped
            ? `Stopped at generation ${message.generation}; replaying the best policy found.`
            : message.family === "curriculum"
            ? `${G1_TASK_COPY[message.admission.config.task].label} policy seed replayed from Frankensim WASM.`
            : `Best ${FAMILY_COPY[message.family].title} policy replayed through the full experiment.`
        );
      } else if (message.type === "comparison") {
        setComparison(message.rows);
        if (message.complete) {
          setBusy(null);
          inFlightRef.current = false;
          setStatus("Equal-budget 5,040-D physical owner-family race complete.");
        } else {
          setStatus(
            `Equal-budget 5,040-D race: ${message.rows.length}/3 scalable families complete…`,
          );
        }
      } else {
        setError(message.message);
        setBusy(null);
        setStopRequested(false);
        inFlightRef.current = false;
        setStatus("The owner kernel refused or could not complete this request.");
      }
    };
    optimizerWorker.onerror = (event) => {
      if (!active) return;
      setError(event.message || "The optimization worker failed before returning a typed result.");
      setBusy(null);
      inFlightRef.current = false;
      setWorkerAvailable(false);
      optimizerWorker.terminate();
      workerRef.current = null;
    };
    optimizerWorker.postMessage({ type: "preview", task: "walking", challenge: "flat" } satisfies G1OptimizationRequest);
    return () => {
      active = false;
      optimizerWorker.terminate();
      workerRef.current = null;
    };
  }, [workerActivated]);

  useEffect(() => {
    if (!embedded) return;
    let bridgeState: "loading" | "ready" | "running" | "failed";
    if (!workerAvailable) bridgeState = "failed";
    else if (busy === "preview") bridgeState = "loading";
    else if (busy) bridgeState = "running";
    else if (trace) bridgeState = "ready";
    else bridgeState = "loading";
    reportFrankenRobotsEngineState(
      "humanoid",
      bridgeState,
      status,
      {
        generation,
        bestObjective,
        completedSteps: trace?.completedSteps ?? null,
        bodyPenetrationMeters: trace?.maximumBodyPenetrationMeters ?? null,
        activeTask: task,
      },
    );
  }, [embedded, workerAvailable, busy, trace, status, generation, bestObjective, task]);

  const curriculumObjectiveDelta = trace && curriculumTrace
    ? curriculumTrace.objective - trace.objective
    : null;
  // Multi-factor objective over time (cmaes-0m3): expose the v068 kernel's
  // per-channel integrals (actuatorWorkJoules, slipIntegral, postureIntegral,
  // impactIntegral, jointLimitIntegral, contactScheduleMismatchIntegral,
  // lateralErrorIntegral, headingErrorIntegral, speedErrorIntegral,
  // backwardDistanceMeters) and a transparent weighted-sum channel card so
  // a small stabilizing correction is visible, not collapsed into one
  // scalar. The post-hoc channel weights are owned by
  // app/lib/g1MultiFactor.ts and never alter the fixed owner objective.
  const selectedAnalysisPreset =
    RECEIPT_ANALYSIS_PRESETS.find((preset) => preset.id === selectedPreset) ??
    RECEIPT_ANALYSIS_PRESETS[0];
  const multiFactor = trace
    ? computeMultiFactorObjective(
        trace,
        admission?.config ?? DEFAULT_G1_WALKING_CONFIG,
        selectedAnalysisPreset.weights,
      )
    : null;
  const receiptCards = trace
    ? [
        ["objective ↓ (kernel scalar)", number(trace.objective, 2)],
        [
          "multi-factor ↓",
          multiFactor ? number(multiFactor.weighted, 2) : "—",
        ],
        [
          "vs curriculum",
          activeTrace === "curriculum" || !curriculumTrace
            ? "reference"
            : curriculumObjectiveDelta !== null && Math.abs(curriculumObjectiveDelta) < 0.005
              ? "flat"
              : `${number(Math.abs(curriculumObjectiveDelta ?? 0), 2)} ${
                  (curriculumObjectiveDelta ?? 0) > 0 ? "lower" : "higher"
                }`,
        ],
        ["distance", `${number(trace.distanceMeters, 2)} m`],
        [
          "mean fwd speed",
          multiFactor
            ? number(multiFactor.channels[0].value, 2) + " m/s"
            : `${number(trace.distanceMeters / Math.max(trace.samples[trace.samples.length - 1]?.timeSeconds ?? DEFAULT_G1_WALKING_CONFIG.durationSeconds, 1e-6), 2)} m/s`,
        ],
        ["single support", `${number(trace.singleSupportSeconds, 2)} s`],
        ["push impulse", `${number(trace.pushImpulseNewtonSeconds, 2)} N·s`],
        ["recovery (censored)", `${number(trace.recoveryTimeSeconds, 3)} s`],
        ["terrain peak", `${number(1_000 * trace.maximumAbsoluteTerrainHeightMeters, 1)} mm`],
        [
          "maximum tilt",
          `${number(Math.asin(Math.min(1, trace.maximumTiltSine)) * 180 / Math.PI, 1)}°`,
        ],
        ["minimum base", `${number(trace.minimumBaseHeightMeters, 3)} m`],
        ["steps integrated", `${trace.completedSteps.toLocaleString()} / ${G1_HORIZON_STEPS}`],
        ["actuator work", `${number(trace.actuatorWorkJoules, 1)} J`],
        ["slip ∫", `${number(trace.slipIntegral, 3)}`],
        ["posture ∫", `${number(trace.postureIntegral, 3)}`],
        ["joint-limit ∫", `${number(trace.jointLimitIntegral, 3)}`],
        ["impact ∫", `${number(trace.impactIntegral, 3)}`],
        ["contact-sched ∫", `${number(trace.contactScheduleMismatchIntegral, 3)}`],
        ["backward dist", `${number(trace.backwardDistanceMeters, 2)} m`],
        ["lateral err ∫", `${number(trace.lateralErrorIntegral, 3)}`],
        ["heading err ∫", `${number(trace.headingErrorIntegral, 3)}`],
        ["speed err ∫", `${number(trace.speedErrorIntegral, 3)}`],
        ["termination", trace.terminationReason],
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Keep the robot first in embedded mode; its complete story tour is
          restored immediately after the primary stage/control grid below. */}
      {!embedded ? (
        <G1StoryTour currentChapter={currentChapter} onSelectChapter={handleSelectChapter} />
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
        <div className="space-y-4">
          <div
            className={`glass-card relative overflow-hidden border-cyan-400/15 bg-slate-950/80 ${
              embedded ? "min-h-[100svh]" : "min-h-[620px]"
            }`}
          >
            {/* Top HUD: stacks vertically on phones (both clusters shared the
                top band and collided); splits into left/right corners ≥sm. */}
            <div
              className={`pointer-events-none absolute z-10 flex flex-col gap-2 ${
                embedded ? "inset-x-3 top-3" : "inset-x-5 top-5"
              } sm:flex-row sm:items-start sm:justify-between`}
            >
            {/* Top Badges & Interactive Mode Bar */}
            <div className="flex flex-wrap gap-2 pointer-events-auto">
              <span className="max-sm:hidden rounded-full border border-cyan-300/25 bg-slate-950/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur-md">
                owner poses · 480 Hz terrain physics
              </span>
              <span className="rounded-full border border-violet-300/25 bg-slate-950/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-violet-200 backdrop-blur-md">
                {TRACE_TITLES[activeTrace]}
              </span>

              {/* Render Mode Toggle: Photo-Real vs X-Ray */}
              <button
                type="button"
                onClick={() => setXrayMode(!xrayMode)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                  xrayMode
                    ? "border-cyan-400 bg-cyan-500/25 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : "border-white/20 bg-slate-950/80 text-slate-300 hover:text-white"
                }`}
                title="Toggle between Photo-Realistic House and Cybernetic Biomechanics X-Ray View"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="sm:hidden">{xrayMode ? "⚡ X-Ray" : "🏡 House"}</span>
                <span className="max-sm:hidden">{xrayMode ? "⚡ Cybernetic X-Ray Active" : "🏡 Photo-Real House"}</span>
              </button>

              {/* Physics Debug Overlay Toggle — inspect link poses, drag proxy, and obstacle OBBs */}
              <button
                type="button"
                onClick={() => setPhysicsDebug(!physicsDebug)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                  physicsDebug
                    ? "border-amber-400 bg-amber-500/25 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                    : "border-white/20 bg-slate-950/80 text-slate-300 hover:text-white"
                }`}
                title="Inspect link pose envelopes, the pelvis drag proxy, and house obstacle OBBs"
              >
                <Wrench className="h-3.5 w-3.5" />
                <span className="sm:hidden">{physicsDebug ? "🔧 Physics" : "🔧 Off"}</span>
                <span className="max-sm:hidden">{physicsDebug ? "🔧 Physics Debug" : "🔧 Physics"}</span>
              </button>
              <button
                type="button"
                onClick={() => setSoundEnabled(robotAudio.toggleMute())}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                  soundEnabled
                    ? "border-emerald-400 bg-emerald-500/25 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : "border-white/20 bg-slate-950/80 text-slate-400 hover:text-slate-200"
                }`}
                title="Toggle Synthesized Footstep & Actuator Acoustics"
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                <span>{soundEnabled ? "Sound ON" : "Muted"}</span>
              </button>

              {/* Push Wand & Direction Controller */}
              <div className="relative flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleApplyShove}
                  className="flex items-center gap-1.5 rounded-l-full border border-rose-400/40 bg-rose-500/20 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-rose-200 backdrop-blur-md hover:bg-rose-500/30 transition-colors shadow-[0_0_10px_rgba(244,63,94,0.25)]"
                  title={`Preview a display-only ${pushImpulseNs} N·s vector at ${pushAngleDeg}°. This does not change the owner rollout.`}
                  aria-label={`Preview display-only push vector: ${pushImpulseNs} newton-seconds at ${pushAngleDeg} degrees`}
                >
                  <Zap className="h-3.5 w-3.5 text-rose-300" />
                  <span>🥊 Preview {pushImpulseNs} N·s ({pushAngleDeg}°)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPushOptions(!showPushOptions)}
                  className={`rounded-r-full border-y border-r border-rose-400/40 px-2 py-1 text-[0.68rem] font-bold text-rose-200 backdrop-blur-md transition-colors ${
                    showPushOptions ? "bg-rose-500/40 text-white" : "bg-rose-500/20 hover:bg-rose-500/30"
                  }`}
                  title="Configure the display-only push-vector preview"
                  aria-label="Configure display-only push-vector preview"
                >
                  <Sliders className="h-3 w-3" />
                </button>

                {showPushOptions && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-64 rounded-xl border border-rose-500/30 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                      <span className="text-[0.7rem] font-bold uppercase tracking-wider text-rose-300">🥊 Display-only vector</span>
                      <span className="text-[0.65rem] text-slate-400">{pushAngleDeg}° · {pushImpulseNs} N·s</span>
                    </div>

                    <p className="mb-2.5 rounded-lg border border-amber-300/20 bg-amber-300/[0.07] px-2 py-1.5 text-[0.62rem] leading-4 text-amber-100">
                      Visualization preview only. The owner experiment keeps its admitted lateral pulse
                      {admission ? ` (${number(admission.pushPeakForceNewtons, 1)} N peak)` : ""}; no controller,
                      HOCBF result, trajectory, or receipt is recomputed.
                    </p>

                    {/* Quick Direction Selector */}
                    <div className="mb-2.5">
                      <label htmlFor="g1-push-preview-angle" className="text-[0.62rem] text-slate-400 mb-1 block">Preview direction:</label>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { label: "⬅️ Left", angle: 90 },
                          { label: "➡️ Right", angle: 270 },
                          { label: "⬆️ Back", angle: 0 },
                          { label: "⬇️ Front", angle: 180 },
                        ].map((d) => (
                          <button
                            key={d.angle}
                            type="button"
                            onClick={() => setPushAngleDeg(d.angle)}
                            className={`rounded-lg py-1 text-[0.65rem] font-semibold transition-all ${
                              pushAngleDeg === d.angle
                                ? "bg-rose-500/30 text-rose-200 border border-rose-400/50 shadow-sm"
                                : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                      <input
                        id="g1-push-preview-angle"
                        type="range"
                        min={0}
                        max={360}
                        step={5}
                        value={pushAngleDeg}
                        onChange={(e) => setPushAngleDeg(Number(e.target.value))}
                        className="mt-1.5 w-full accent-rose-400 h-1.5 rounded-lg bg-slate-800 cursor-pointer"
                      />
                    </div>

                    {/* Impulse Magnitude Selector */}
                    <div className="mb-3">
                      <div className="text-[0.62rem] text-slate-400 mb-1">Preview magnitude:</div>
                      <div className="grid grid-cols-4 gap-1">
                        {[10, 15, 25, 45].map((ns) => (
                          <button
                            key={ns}
                            type="button"
                            onClick={() => setPushImpulseNs(ns)}
                            className={`rounded-lg py-1 text-[0.65rem] font-semibold transition-all ${
                              pushImpulseNs === ns
                                ? "bg-rose-500/30 text-rose-200 border border-rose-400/50 shadow-sm"
                                : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
                            }`}
                          >
                            {ns} N·s
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleApplyShove();
                        setShowPushOptions(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Preview vector only
                    </button>
                  </div>
                )}
              </div>

              {/* Export Telemetry Receipt Button */}
              {trace && (
                <button
                  type="button"
                  onClick={handleExportTelemetry}
                  className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-cyan-200 backdrop-blur-md hover:bg-cyan-900/60 transition-colors"
                  title="Export full kinematic & dynamic trajectory receipt as JSON"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="sm:hidden">Export</span>
                  <span className="max-sm:hidden">Export Telemetry</span>
                </button>
              )}

              {/* Drag Mode Selector: Pelvis vs 6-Pin Multi-Limb IK */}
              <button
                type="button"
                onClick={() => setDragMode(dragMode === "pelvis" ? "limbs" : "pelvis")}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                  dragMode === "limbs"
                    ? "border-amber-400 bg-amber-500/25 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                    : "border-white/20 bg-slate-950/80 text-slate-300 hover:text-white"
                }`}
                title="Toggle between Whole-Body Pelvis Drag and 6-Pin Multi-Limb Ragdoll IK"
              >
                <Bot className="h-3.5 w-3.5" />
                <span>{dragMode === "limbs" ? "🖐️ 6-Pin IK Mode" : "📍 Root Drag"}</span>
              </button>

              {/* Drag Status & Contact Safety Readout */}
              {(userHasDragged && robotDragOffset) || Object.keys(limbOffsets).length > 0 ? (
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <span
                    className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                      dragCollisionState.isColliding
                        ? "border border-rose-400/80 bg-rose-950/85 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                        : "border border-emerald-400/80 bg-emerald-950/85 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    }`}
                  >
                    {dragCollisionState.isColliding
                      ? `⚠️ Clamped: ${dragCollisionState.obstacleName || "Obstacle"}`
                      : `🖐️ Dragged (${dragCollisionState.clearance.toFixed(2)}m free)`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setRobotDragOffset(null);
                      setLimbOffsets({});
                      setUserHasDragged(false);
                    }}
                    className="flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-950/80 px-2.5 py-1 text-[0.68rem] font-bold uppercase text-cyan-200 hover:bg-cyan-900/60 transition-colors"
                    title="Reset robot and limbs to nominal position"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                </div>
              ) : null}

              {/* Owner obstacle verdict: the kernel now scores the walking
                  policy against the house itself, so this reports the
                  kernel's own measurement, not a browser re-derivation. */}
              {trace ? (
                <span
                  className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md border ${
                    trace.terminationReason === "body obstacle"
                      ? "border-rose-400/80 bg-rose-950/85 text-rose-200"
                      : "border-emerald-400/50 bg-slate-950/85 text-emerald-200"
                  }`}
                  title={`Every step, the walking owner tested a collider sphere on each of its 30 links — hands and feet included — against ${G1_KERNEL_OBSTACLES.length} house boxes sent in the config packet. Deepest measured penetration: ${trace.maximumBodyPenetrationMeters.toFixed(4)} m. A rollout that drives any link into the geometry is terminated and charged, not projected away.`}
                >
                  {trace.terminationReason === "body obstacle"
                    ? `🧱 Owner stopped on contact · ${(trace.maximumBodyPenetrationMeters * 100).toFixed(1)} cm into geometry`
                    : `🧱 All 30 links vs ${G1_KERNEL_OBSTACLES.length} house boxes · 0 penetration`}
                </span>
              ) : null}

              {/* Live clearance readout: nearest rigid surface to any link. */}
              {liveClearance ? (
                <span
                  className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md border ${
                    liveClearance.distance < G1_CLEARANCE_BREACH_METERS
                      ? "border-rose-400/70 bg-rose-950/85 text-rose-200"
                      : liveClearance.distance < 0.3
                        ? "border-amber-400/70 bg-amber-950/85 text-amber-200"
                        : "border-emerald-400/50 bg-slate-950/85 text-emerald-200"
                  }`}
                  title="Distance from the nearest rendered link to the nearest rigid house surface: the clearance term the collision penalty and HOCBF barrier consume"
                >
                  📏 {liveClearance.distance.toFixed(2)} m · {liveClearance.obstacleName}
                </span>
              ) : null}
            </div>

            {/* Top Toolbar: Camera & Sears Craftsman Lighting Atmosphere */}
            <div className="flex flex-wrap items-center gap-2 pointer-events-auto self-start">
              {/* Lighting Atmosphere Selector */}
              <div className="flex items-center gap-1 rounded-xl border border-amber-500/20 bg-slate-950/85 p-1 backdrop-blur-md">
                {(
                  [
                    { id: "afternoon-sun", label: "Day", icon: Sun },
                    { id: "golden-hour", label: "Sunset", icon: Sunset },
                    { id: "evening-glow", label: "Evening", icon: Moon },
                  ] as const
                ).map((tod) => {
                  const Icon = tod.icon;
                  const isSelected = timeOfDay === tod.id;
                  return (
                    <button
                      key={tod.id}
                      type="button"
                      onClick={() => setTimeOfDay(tod.id)}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem] font-bold transition-all ${
                        isSelected
                          ? "bg-amber-500/30 text-amber-200 border border-amber-400/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      title={`Craftsman atmosphere: ${tod.label}`}
                    >
                      <Icon className="h-3 w-3" />
                      {tod.label}
                    </button>
                  );
                })}
              </div>

              {/* Camera Perspective Selector */}
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/85 p-1 backdrop-blur-md">
                {(
                  [
                    { id: "orbit", label: "Orbit", icon: Camera },
                    { id: "follow", label: "Follow", icon: Activity },
                    { id: "pov", label: "POV", icon: Eye },
                    { id: "blueprint", label: "Map", icon: Radio },
    { id: "fly", label: "Free-fly", icon: Compass },
                  ] as const
                ).map((cam) => {
                  const Icon = cam.icon;
                  const isSelected = cameraView === cam.id;
                  return (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setCameraView(cam.id)}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem] font-bold transition-all ${
                        isSelected
                          ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      title={`Switch camera to ${cam.label} view`}
                    >
                      <Icon className="h-3 w-3" />
                      {cam.label}
                    </button>
                  );
                })}
              </div>
            </div>
            </div>

            {meshState.phase === "loading" ? (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" role="status" aria-live="polite">
                <span className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2 text-xs text-slate-300 backdrop-blur-md">
                  Loading the real Unitree G1 mesh rig…
                </span>
              </div>
            ) : null}
            {meshState.phase === "ready" ? (
              <div className="pointer-events-none absolute left-5 top-16 z-10" role="status" aria-live="polite">
                <span className="rounded-xl border border-emerald-300/20 bg-emerald-950/70 px-3 py-2 text-[0.7rem] text-emerald-100 backdrop-blur-md">
                  Real Unitree G1 rig ready · {Object.keys(meshState.geometries).length} mesh parts decoded
                </span>
              </div>
            ) : null}
            {meshState.phase === "failed" ? (
              <div className="absolute bottom-20 left-5 right-5 z-20 flex justify-center" role="alert">
                <div className="max-w-xl rounded-xl border border-amber-300/20 bg-amber-950/80 px-3 py-2 text-[0.7rem] text-amber-100 shadow-lg backdrop-blur-md">
                  <p>Real mesh assets could not load. The owner-driven kinematic skeleton remains active.</p>
                  <p className="mt-1 break-words font-mono text-[0.62rem] text-amber-200/80">{meshState.error}</p>
                  <button
                    type="button"
                    onClick={retryMeshes}
                    className="mt-2 min-h-9 rounded-lg border border-amber-200/30 bg-amber-100/10 px-3 font-semibold text-amber-50 hover:bg-amber-100/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                  >
                    Retry real mesh loading
                  </button>
                </div>
              </div>
            ) : null}
            <div
              className={`absolute z-10 flex items-center pointer-events-none ${
                embedded
                  ? "bottom-3 left-3 right-3 justify-center"
                  : "bottom-5 left-5 right-5 flex-wrap justify-between gap-2 max-sm:bottom-3 max-sm:left-3 max-sm:right-3"
              }`}
            >
              <span
                className={`max-w-full truncate rounded-xl border border-white/10 bg-slate-950/80 text-slate-300 backdrop-blur-md ${
                  embedded ? "px-2.5 py-1.5 text-[0.62rem]" : "px-3 py-2 text-xs"
                }`}
              >
                {embedded
                  ? `Contact rings · ${stageSceneHint(xrayMode, cameraView)}`
                  : `Cyan / violet rings are contact booleans. ${stageSceneHint(xrayMode, cameraView)}`}
              </span>
              {!embedded ? (
                <span className="max-sm:hidden rounded-xl border border-amber-300/20 bg-amber-950/65 px-3 py-2 text-[0.7rem] text-amber-100 backdrop-blur-md">
                  Rose arrow: owner lateral pulse during playback; manual vector preview is display-only · arm joints are kernel-posed with real mass (head/hands: display-only)
                </span>
              ) : null}
            </div>
            <div ref={stageRef} className={embedded ? "h-[100svh] w-full" : "h-[620px] w-full"}>
              {shouldMountStage && (
                <RobotStage
                  trace={trace}
                  admission={admission}
                  reduceMotion={reduceMotion}
                  meshState={meshState}
                  xrayMode={xrayMode}
                  physicsDebug={physicsDebug}
                  cameraView={cameraView}
                  timeOfDay={timeOfDay}
                  activeRoom={activeRoom}
                  showRoof={showRoof}
                  activeRouteId={activeRouteId}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  sampleIndex={sampleIndex}
                  onSampleIndexChange={setSampleIndex}
                  shoveActive={shoveActive}
                  pushAngleDeg={pushAngleDeg}
                  pushImpulseNs={pushImpulseNs}
                  robotDragOffset={robotDragOffset}
                  dragMode={dragMode}
                  limbOffsets={limbOffsets}
                  onRobotDragChange={handleRobotDragChange}
                  onRobotDragCommit={handleRobotDragCommit}
                  onLimbDragChange={handleLimbDrag}
                  onDragCollisionChange={setDragCollisionState}
                />
              )}
              <FreeFlyHintBanner visible={cameraView === "fly"} />
            </div>
          </div>


          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <label htmlFor="g1-sigma">Exploration σ (search radius)</label>
            <span className="font-mono text-purple-200">{searchSigma.toFixed(4)}</span>
          </div>
          <input
            id="g1-sigma"
            type="range"
            min={2}
            max={100}
            value={Math.round(searchSigma * 10000)}
            disabled={busy !== null || !workerAvailable}
            onChange={(event) => setSearchSigma(Number(event.target.value) / 10000)}
            aria-valuetext={`sigma = ${searchSigma.toFixed(4)} radians`}
          />
          <div className="mt-1 flex justify-between text-[0.6rem] font-mono text-slate-600">
            <span>0.0002 (refine)</span>
            <span>0.001 (calibrated)</span>
            <span>0.01 (aggressive)</span>
          </div>
          <p className="mt-1 text-[0.6rem] leading-4 text-slate-500" data-testid="g1-sigma-hint">
            {searchSigma <= 0.0004
              ? "Tight radius: each candidate is a small perturbation of the current mean — best for refining a known good policy."
              : searchSigma <= 0.0015
                ? "Calibrated launch radius (default): the owner improved on every declared seed in the 16-generation flat-walking sweep, and over equal wall time this band learned faster than any wider one."
                : searchSigma <= 0.006
                  ? "Broad exploration: useful after a plateau, but slower and less reliable from the walking curriculum."
                  : "Wide exploration: large perturbations dominate the population — the search may find a better optimum but takes more generations to converge."}
          </p>
          {/* 2. Interactive Timeline & Milestone Scrubber */}
          <G1TimelineScrubber
            trace={trace}
            currentSampleIndex={sampleIndex}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSeekIndex={setSampleIndex}
            onSetSpeed={setPlaybackSpeed}
            onReset={() => {
              setSampleIndex(0);
              setIsPlaying(false);
            }}
          />

          {/* 3. 1928 Sears Craftsman Whole-House Architectural Inspector */}
          {!xrayMode && (
            <CraftsmanArchitecturalInspector
              activeRoom={activeRoom}
              onSelectRoom={(r) => setActiveRoom(r as any)}
              timeOfDay={timeOfDay}
              onSelectTimeOfDay={setTimeOfDay}
              showRoof={showRoof}
              onToggleRoof={() => setShowRoof(!showRoof)}
              activeRouteId={activeRouteId}
              onSelectRoute={(routeId) => {
                setActiveRouteId(routeId);
                if (routeId === "living-inglenook") setActiveRoom("living");
                else if (routeId === "dining-circulation") setActiveRoom("dining");
                else if (routeId === "kitchen-prep") setActiveRoom("kitchen");
                else if (routeId === "grand-tour") setActiveRoom("cutaway");
              }}
            />
          )}
        </div>

        <div className="glass-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3">
              <Bot className="h-6 w-6 text-cyan-200" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Frankensim G1 flagship</p>
              <h3 className="mt-1 text-xl font-bold text-white">Optimize a 5,040-D {G1_TASK_COPY[task].action} policy</h3>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-400">
            Fifteen actuators each read 42 physical signals through eight gait-phase basis terms:
            <span className="mt-2 block font-mono text-cyan-200">15 × 42 × 8 = 5,040 learned weights</span>
          </p>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            A disclosed full-CMA curriculum learned 105 meaningful owner coordinates: standing bias,
            periodic foot unloading, then pelvis feedback. Live search expands that curriculum to all
            5,040 weights. Every candidate is scored on the same 1.5-second, 720-step task and challenge you watch.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[0.65rem] leading-4 text-slate-400">
            <div className="rounded-xl border border-white/10 bg-white/[0.025] px-2 py-3">
              <span className="block font-mono text-cyan-200">15-D</span>
              stand
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.025] px-2 py-3">
              <span className="block font-mono text-violet-200">+90-D</span>
              transfer weight
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.025] px-2 py-3">
              <span className="block font-mono text-emerald-200">5,040-D</span>
              refine live
            </div>
          </div>

          <div className="mt-6">
            <span id="g1-task-label" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Physical objective
            </span>
            <div role="radiogroup" aria-labelledby="g1-task-label" className="mt-2 grid grid-cols-3 gap-2">
              {(["balance", "stepping", "walking"] as const).map((candidateTask) => (
                <button
                  key={candidateTask}
                  type="button"
                  role="radio"
                  aria-checked={task === candidateTask}
                  disabled={busy !== null || !workerAvailable}
                  onClick={() => {
                    if (task !== candidateTask) requestPreview(candidateTask, challenge);
                  }}
                  className={`min-h-11 rounded-xl px-3 text-xs font-semibold transition-colors ${task === candidateTask ? "bg-cyan-500/30 text-cyan-100" : "bg-white/5 text-slate-400 hover:text-slate-200"}`}
                >
                  {G1_TASK_COPY[candidateTask].label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {G1_TASK_COPY[task].detail}
              {admission ? ` Owner admission: ${admission.config.task}.` : " Awaiting owner admission."}
            </p>
          </div>

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="g1-family">
            Scalable covariance representation
          </label>
          <select
            id="g1-family"
            value={family}
            disabled={busy !== null || !workerAvailable}
            onChange={(event) => setFamily(event.target.value as ScalableFamily)}
            className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-cyan-400/60"
          >
            <option value="separable">Separable CMA-ES — diagonal</option>
            <option value="lm-cma">LM-CMA — bounded directions</option>
            <option value="lm-ma">LM-MA — bounded transform</option>
          </select>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Full CMA is implemented on the 128-D arm below, but its O(n²) covariance would contain 25,401,600 entries here; the browser boundary honestly refuses it above 256-D.
          </p>

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="g1-seed">
            Declared Philox seed
          </label>
          <select
            id="g1-seed"
            value={seedIndex}
            disabled={busy !== null || !workerAvailable}
            onChange={(event) => setSeedIndex(Number(event.target.value))}
            className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-cyan-400/60"
          >
            <option value={0}>Seed 1 · 0x47315050</option>
            <option value={1}>Seed 2 · 0x47315051</option>
            <option value={2}>Seed 3 · 0x47315052</option>
          </select>

          <div className="mt-4 rounded-xl border border-rose-300/15 bg-rose-400/[0.055] p-3 text-[0.68rem] leading-5 text-slate-400">
            The wave field and half-sine lateral shove are deterministic owner inputs. Survival is
            lexicographically primary: one extra integrated physics step beats every possible shaping-score
            difference. “Recovery” is horizon-censored when the robot never returns to the disclosed upright band.
          </div>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <span id="g1-challenge-label">Challenge</span>
            <div role="radiogroup" aria-labelledby="g1-challenge-label" className="flex gap-2">
              <button
                type="button"
                role="radio"
                aria-checked={challenge === "flat"}
                disabled={busy !== null || !workerAvailable}
                onClick={() => {
                  if (challenge !== "flat") {
                    requestPreview(task, "flat");
                  }
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${challenge === "flat" ? "bg-cyan-500/30 text-cyan-100" : "bg-white/5 text-slate-400 hover:text-slate-200"}`}
              >
                Flat ground
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={challenge === "terrain-and-push"}
                disabled={busy !== null || !workerAvailable}
                onClick={() => {
                  if (challenge !== "terrain-and-push") {
                    requestPreview(task, "terrain-and-push");
                  }
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${challenge === "terrain-and-push" ? "bg-cyan-500/30 text-cyan-100" : "bg-white/5 text-slate-400 hover:text-slate-200"}`}
              >
                Terrain + push
              </button>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-cyan-100">Continuous learning</span>
              <span className="font-mono text-cyan-200">
                {G1_POPULATION} physical rollouts / generation
              </span>
            </div>
            <p className="mt-1 text-[0.68rem] leading-5 text-slate-400">
              LM-CMA keeps its mean, search radius, and direction history hot until you press Stop.
              The best policy is replayed on stage every {G1_LIVE_REPLAY_INTERVAL} generations.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <button
              type="button"
              disabled={!workerAvailable || (busy !== null && busy !== "optimize") || stopRequested}
              onClick={busy === "optimize" ? stopContinuousOptimization : startContinuousOptimization}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 text-sm font-bold text-white shadow-lg shadow-cyan-950/40 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {busy === "optimize" ? <Square className="h-4 w-4 fill-current" /> : <Sparkles className="h-4 w-4" />}
              {busy === "optimize"
                ? (stopRequested ? "Stopping…" : `Stop · gen ${generation}`)
                : (generation > 0 ? `Keep learning · gen ${generation}` : "Start learning")}
            </button>
            <button
              type="button"
              disabled={busy !== null || !workerAvailable}
              onClick={() => {
                if (!curriculumTrace) {
                  post({ type: "preview", task, challenge }, "preview");
                  return;
                }
                setTrace(curriculumTrace);
                setActiveTrace("curriculum");
                setGeneration(0);
                setBestObjective(curriculumTrace.objective);
                setStatus(`${G1_TASK_COPY[task].label} policy seed replayed from Frankensim WASM.`);
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RotateCcw className="h-4 w-4" />
              Policy seed
            </button>
            <button
              type="button"
              disabled={busy !== null || !workerAvailable || !stabilizerTrace}
              onClick={() => {
                if (!stabilizerTrace) return;
                setTrace(stabilizerTrace);
                setActiveTrace("stabilizer");
                setGeneration(0);
                setBestObjective(stabilizerTrace.objective);
                setStatus(`Standing-only prior replayed; compare its contacts with the ${G1_TASK_COPY[task].action} policy seed.`);
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RotateCcw className="h-4 w-4" />
              Standing prior
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4" aria-live="polite">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              {busy ? (
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              ) : error ? (
                <span className="h-2 w-2 rounded-full bg-rose-400" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              )}
              {status}
            </div>
            {generation > 0 ? (
              <div className="mt-3 flex justify-between font-mono text-[0.7rem] text-slate-400">
                <span>generation {generation}</span>
                <span>best objective {bestObjective === null ? "—" : number(bestObjective, 4)}</span>
              </div>
            ) : null}
            {ledger.length > 0 ? (
              <div className="mt-3">
                <LearningLedger points={ledger} trainingSeconds={trainingSeconds} />
              </div>
            ) : null}
            <div className="mt-3">
              <PolicyExchange
                policy={stagePolicy}
                baseline={policyBaseline}
                meta={{
                  kernelVersion: FRANKENSIM_OWNER_KERNEL_VERSION,
                  task,
                  challenge,
                  family,
                  generation,
                  sigma: searchSigma,
                }}
                measured={ledger.length > 0 ? ledger[ledger.length - 1] : null}
                onImport={handlePolicyImport}
              />
            </div>
            {progressHistory.length >= 2 ? (
              <div className="mt-3">
                <ConvergenceChart
                  data={progressHistory}
                  label="CMA-ES convergence (best objective + σ)"
                />
              </div>
            ) : null}
            {trace && curriculumTrace ? (
              <div className="mt-3">
                <WalkQualityComparison
                  curriculum={curriculumTrace}
                  candidate={trace}
                  candidateLabel={
                    activeTrace === "curriculum"
                      ? `${G1_TASK_COPY[task].label} seed (self)`
                      : `${TRACE_TITLES[activeTrace]} · gen ${generation || "—"}`
                  }
                  curriculumLabel={`${G1_TASK_COPY[task].label} policy seed`}
                  title={`${G1_TASK_COPY[task].label} policy comparison`}
                />
              </div>
            ) : null}
            {error ? <p className="mt-3 text-xs leading-5 text-rose-300">{error}</p> : null}
          </div>
        </div>
      </div>

      {embedded ? (
        <G1StoryTour currentChapter={currentChapter} onSelectChapter={handleSelectChapter} />
      ) : null}
      {trace ? (
        <div className="space-y-3">
          <div className="hidden md:grid md:grid-cols-5 md:gap-3 xl:grid-cols-10">
            {receiptCards.map(([label, value]) => (
              <div
                key={label}
                title={`${label}: ${value}`}
                className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/55 p-4"
              >
                <p className="truncate text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                <p className="mt-2 truncate font-mono text-sm text-slate-100" title={String(value)}>{value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {(showAllReceipts ? receiptCards : receiptCards.slice(0, 4)).map(([label, value]) => (
              <div
                key={label}
                title={`${label}: ${value}`}
                className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/55 p-4"
              >
                <p className="truncate text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                <p className="mt-2 truncate font-mono text-sm text-slate-100" title={String(value)}>{value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:hidden">
            <button
              type="button"
              onClick={() => {
                const obj = Object.fromEntries(
                  receiptCards.map(([k, v]) => [k, typeof v === "number" ? v : String(v)]),
                );
                const json = JSON.stringify(obj, null, 2);
                if (navigator.clipboard) {
                  void navigator.clipboard.writeText(json);
                }
                setStatus("Receipt copied to clipboard as JSON.");
              }}
              className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-500/10 px-4 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/15"
            >
              Copy as JSON
            </button>
            <button
              type="button"
              onClick={() => setShowAllReceipts((v) => !v)}
              aria-expanded={showAllReceipts}
              className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              {showAllReceipts
                ? `Hide ${receiptCards.length - 4} of ${receiptCards.length} telemetry rows`
                : `Show all ${receiptCards.length} telemetry rows`}
            </button>
          </div>
          {/* Desktop: copy button always visible (no expand toggle needed) */}
          <div className="hidden md:flex md:justify-end">
            <button
              type="button"
              onClick={() => {
                const obj = Object.fromEntries(
                  receiptCards.map(([k, v]) => [k, typeof v === "number" ? v : String(v)]),
                );
                const json = JSON.stringify(obj, null, 2);
                if (navigator.clipboard) {
                  void navigator.clipboard.writeText(json);
                }
                setStatus("Receipt copied to clipboard as JSON.");
              }}
              className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-500/10 px-4 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/15"
            >
              Copy {receiptCards.length}-row receipt as JSON
            </button>
          </div>
        </div>
      ) : null}

      {trace && multiFactor ? (
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-950/30 p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              Multi-factor objective over time
            </p>
            <p className="font-mono text-sm text-cyan-100">
              weighted = {number(multiFactor.weighted, 3)}
            </p>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-300">
            The kernel scalar <span className="font-mono text-slate-100">objective ↓</span> collapses
            many signals into one number and so can punish small stabilizing corrections. The
            weighted sum above re-exposes an owner-inspired receipt decomposition as a transparent
            sum of eleven per-step / per-trajectory channels. A selected lens can rebias the
            post-hoc comparison between speed, stability, and efficiency. It does not change the
            kernel scalar that CMA-ES minimized, mutate the trace, or claim the rendered gait
            changed.
          </p>
          <div className="mt-3 grid min-w-0 grid-cols-2 gap-x-4 gap-y-1 text-[0.68rem] text-slate-400 sm:grid-cols-3">
            {multiFactor.channels.map((c: MultiFactorChannel) => (
              <div key={c.label} className="flex min-w-0 justify-between font-mono">
                <span className="truncate pr-2 text-slate-300">{c.label}</span>
                <span className="shrink-0 text-slate-500">
                  {c.value >= 0 ? "+" : ""}
                  {number(c.contribution, 3)} (w {c.weight >= 0 ? "+" : ""}
                  {Math.abs(c.weight) < 0.01 && c.weight !== 0
                    ? c.weight.toExponential(1)
                    : number(c.weight, 2)}
                  )
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 3. Causal post-hoc receipt equalizer; the owner objective remains fixed. */}
      <G1ObjectiveEqualizer
        multiFactor={multiFactor}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Scalable variants, one physical budget</p>
              <h3 className="mt-1 text-xl font-bold text-white">A live 5,040-D {task}, {challenge} race</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Same curriculum mean, Philox seed, population of 16, physical evaluator, and evaluation budget. Full CMA is absent only because the owner correctly refuses dense covariance above 256 dimensions; all four families race on the 128-D arm.
              </p>
            </div>
            <button
              type="button"
              disabled={busy !== null || !workerAvailable}
              onClick={() => post({ type: "compare", task, generations: 4, challenge }, "compare")}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet-300/25 bg-violet-400/10 px-4 text-sm font-semibold text-violet-100 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Play className="h-4 w-4" />
              Run scalable-family race
            </button>
          </div>

          {comparison ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-xs">
                <thead className="border-b border-white/10 text-slate-500">
                  <tr>
                    <th className="pb-3 font-semibold">owner family</th>
                    <th className="pb-3 font-semibold">curriculum → final</th>
                    <th className="pb-3 font-semibold">evals</th>
                    <th className="pb-3 font-semibold">persistent / workspace scalars</th>
                    <th className="pb-3 font-semibold">this run</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.family} className="border-b border-white/5 text-slate-300">
                      <td className="py-3 font-semibold text-white">{FAMILY_COPY[row.family].title}</td>
                      <td className="py-3 font-mono">{row.initialBest.toExponential(2)} → {row.finalBest.toExponential(2)}</td>
                      <td className="py-3 font-mono">{row.evaluations}</td>
                      <td className="py-3 font-mono">{row.persistentScalars.toLocaleString()} / {row.workspaceScalars.toLocaleString()}</td>
                      <td className="py-3 font-mono">{number(row.elapsedMilliseconds, 1)} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(Object.keys(FAMILY_COPY) as CmaFamily[]).map((name) => (
                <div key={name} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <div className="flex items-center gap-2">
                    {name === "full" ? <BrainCircuit className="h-4 w-4 text-sky-300" /> : <Cpu className="h-4 w-4 text-violet-300" />}
                    <p className="text-sm font-semibold text-slate-100">{FAMILY_COPY[name].title}</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{FAMILY_COPY[name].representation}</p>
                  <p className="mt-1 font-mono text-[0.68rem] text-slate-500">{FAMILY_COPY[name].order}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="glass-card p-6">
          <div className="flex items-center gap-2 text-emerald-300">
            <Gauge className="h-5 w-5" />
            <h3 className="font-bold text-white">What is physically real here?</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
            <li><strong className="text-slate-200">Owner-composed:</strong> free-floating multibody dynamics, SE(3) poses, fixed 1/480 s integration, normal contact, friction, policy map, and objective.</li>
            <li><strong className="text-slate-200">Rendered verbatim:</strong> every opaque limb segment connects world-frame link positions emitted by Frankensim; contact rings use its booleans.</li>
            <li><strong className="text-slate-200">Real support polygon:</strong> four declared compliant patches under each source foot accumulate both forces and moments. Static Hertz preload supports the model from step one instead of beginning with a fictitious drop.</li>
            <li><strong className="text-slate-200">Survival first:</strong> each skipped 480 Hz step—and a terminal guard—costs 1,000 while all secondary shaping is bounded to ±400. One more survived step therefore beats every possible shaping difference.</li>
            <li><strong className="text-slate-200">Exact endings:</strong> the receipt distinguishes horizon completion, height, tilt, contact, and joint-limit guards; “fell” is not inferred in the browser.</li>
            <li><strong className="text-slate-200">Deliberately reduced:</strong> 15 actuated lower-body/waist DoFs. Arms, hands, and the translucent upper shell are not simulated.</li>
            <li><strong className="text-slate-200">No hardware claim:</strong> this is a deterministic explainer experiment, not a validated Unitree controller or sim-to-real result.</li>
          </ul>
        </aside>
      </div>

      <details className="glass-card overflow-hidden p-0 group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <h3 className="font-bold text-white">What the kernel actually does (and doesn&apos;t)</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400 group-open:hidden">tap to expand</span>
          <span className="text-xs font-semibold text-slate-400 hidden group-open:inline">tap to collapse</span>
        </summary>
        <div className="grid gap-3 border-t border-white/5 p-4 sm:grid-cols-3 sm:p-5">
          <div className="rounded-xl border border-emerald-300/15 bg-emerald-950/20 p-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-300">Modeled</p>
            <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-5 text-slate-300">
              <li>· 15 actuated DoFs (legs + waist)</li>
              <li>· Free-floating base, SE(3) poses</li>
              <li>· Semi-implicit Euler, fixed dt = 1/480 s</li>
              <li>· Penalty-based normal contact + Coulomb friction (μ ≈ 0.6)</li>
              <li>· Static Hertz preload at simulation start</li>
              <li>· Five terminal-guard detectors (horizon, height, tilt, contact, joint-limit)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-300/15 bg-amber-950/20 p-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-300">Simplified</p>
            <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-5 text-slate-300">
              <li>· Four compliant foot patches, not full soles</li>
              <li>· No torso arms, hands, or upper shell</li>
              <li>· No motor torque curves or thermal limits</li>
              <li>· No joint belt-elasticity or backlash</li>
              <li>· Terrain is a 1-D heightfield, not a mesh</li>
              <li>· Policy is a periodic basis, not a neural net</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-300/15 bg-rose-950/20 p-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-rose-300">Not modeled</p>
            <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-5 text-slate-300">
              <li>· No rolling or sliding friction asymmetry</li>
              <li>· No slip detection or recovery reflex</li>
              <li>· No inertial measurement, encoder, or actuator lag</li>
              <li>· No environment wind, vibration, or camera noise</li>
              <li>· No sim-to-real transfer or hardware validation</li>
              <li>· No learned controller beyond the periodic basis</li>
            </ul>
          </div>
        </div>
        <p className="border-t border-white/5 bg-black/20 px-4 py-3 text-[0.72rem] leading-5 text-slate-400 sm:px-5">
          A walker that survives the kernel can still fall on real hardware. The page deliberately
          stops at a deterministic explainer experiment; treating it as a Unitree validation would
          be a category error.
        </p>
      </details>
    </div>
  );
}
