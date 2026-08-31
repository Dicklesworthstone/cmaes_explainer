"use client";

import React, { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, FlyControls, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useInView } from "../hooks/useScrollSpy";
import { Bot, BrainCircuit, Cpu, Gauge, Play, RotateCcw, Sparkles, Eye, Camera, Compass, Zap, Sliders, Shield, Activity, Flame, Radio, Sun, Moon, Sunset } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import {
  DEFAULT_G1_WALKING_CONFIG,
  type CmaFamily,
  type G1Admission,
  type G1Challenge,
  type G1TraceReceipt,
  type G1TraceSample,
} from "../lib/frankensimCmaes";
import { computeMultiFactorObjective, type MultiFactorChannel } from "../lib/g1MultiFactor";
import { CraftsmanLivingRoom } from "./CraftsmanLivingRoom";
import { SearsCraftsmanEstate } from "./SearsCraftsmanEstate";
import { CraftsmanArchitecturalInspector } from "./CraftsmanArchitecturalInspector";
import { G1BiomechanicsOverlay } from "./G1BiomechanicsOverlay";
import { G1StoryTour, STORY_CHAPTERS, type StoryChapter } from "./G1StoryTour";
import { G1TimelineScrubber } from "./G1TimelineScrubber";
import { G1ObjectiveEqualizer, PERSONALITY_PRESETS, type RobotPersonalityPreset } from "./G1ObjectiveEqualizer";
import { ConvergenceChart, type ConvergencePoint } from "./ConvergenceChart";
import { reportFrankenRobotsEngineState } from "../lib/frankenrobotsBridge";
import { CRAFTSMAN_BUNGALOW_1928 } from "../lib/houseScenes";
import {
  clampPositionAgainstHouseCollisions,
  createSceneFromHouseFurniture,
  findClearSpawnPosition,
} from "../lib/houseMultiObstacleKernel";
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
    }
  | {
      type: "progress";
      family: CmaFamily;
      generation: number;
      maxGenerations: number;
      bestObjective: number;
      sigma: number;
    }
  | { type: "comparison"; rows: ComparisonRow[] }
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
    <group position={[0, 0.001, 0]}>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#6e421f" roughness={0.65} metalness={0.08} />
      </mesh>
      <mesh geometry={geometry} position={[0, 0.001, 0]}>
        <meshBasicMaterial color="#d97706" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function PushArrow({
  pelvis,
  fraction,
}: {
  pelvis: readonly number[];
  fraction: number;
}) {
  if (fraction <= 0) return null;
  return (
    <arrowHelper
      args={[
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(...ownerToThree(pelvis)).add(new THREE.Vector3(0, 0.16, 0.58)),
        0.25 + 0.45 * fraction,
        "#fb7185",
        0.12,
        0.07,
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
}: {
  sample: G1TraceSample;
  meshes: { geometries: Record<string, THREE.BufferGeometry>; material: THREE.MeshStandardMaterial };
  pushFraction: number;
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
      <PushArrow pelvis={sample.linkPoses[0].position} fraction={pushFraction} />
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


function RobotPose({ sample, pushFraction }: { sample: G1TraceSample; pushFraction: number }) {
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
      <PushArrow pelvis={pelvis} fraction={pushFraction} />
    </group>
  );
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
  const pushFraction = (shoveActive ? 0.95 : 0) || (sample
    && admission?.config.challenge === "terrain-and-push"
    && sample.timeSeconds > admission.pushStartSeconds
    && sample.timeSeconds < admission.pushEndSeconds
    ? Math.sin(
        Math.PI
          * (sample.timeSeconds - admission.pushStartSeconds)
          / (admission.pushEndSeconds - admission.pushStartSeconds)
      )
    : 0);

  const pelvisThree = sample ? ownerToThree(sample.linkPoses[0].position) : [0, 0.75, 0] as [number, number, number];
  const leftFootThree = sample ? ownerLocalPointToThree(
    sample.linkPoses[6].position,
    sample.linkPoses[6].quaternionWxyz,
    [0.04, 0, -0.03]
  ) : [0, 0, 0] as [number, number, number];
  const rightFootThree = sample ? ownerLocalPointToThree(
    sample.linkPoses[12].position,
    sample.linkPoses[12].quaternionWxyz,
    [0.04, 0, -0.03]
  ) : [0, 0, 0] as [number, number, number];

  return sample ? (
    <group position={positionOffset ? [positionOffset[0], positionOffset[1], positionOffset[2]] : [0, 0, 0]}>
      {meshState.phase === "ready" ? (
        <RobotPoseMeshes sample={sample} meshes={meshState} pushFraction={pushFraction} />
      ) : (
        <RobotPose sample={sample} pushFraction={pushFraction} />
      )}
      <G1BiomechanicsOverlay
        sample={sample}
        enabled={xrayMode}
        pelvisPosition={pelvisThree}
        leftFootPosition={leftFootThree}
        rightFootPosition={rightFootThree}
      />
    </group>
  ) : null;
}

type G1MeshState =
  | { phase: "idle" | "loading" }
  | { phase: "ready"; geometries: Record<string, THREE.BufferGeometry>; material: THREE.MeshStandardMaterial }
  | { phase: "failed" };

// Page-lifetime module cache: the 16MB mesh set parses ONCE per page load.
let g1MeshCache: {
  geometries: Record<string, THREE.BufferGeometry>;
  material: THREE.MeshStandardMaterial;
} | null = null;

function useG1Meshes(active: boolean): G1MeshState {
  const [state, setState] = useState<G1MeshState>(() =>
    g1MeshCache
      ? { phase: "ready", geometries: g1MeshCache.geometries, material: g1MeshCache.material }
      : { phase: active ? "loading" : "idle" }
  );
  useEffect(() => {
    if (!active || g1MeshCache) return;
    let cancelled = false;
    const abortController = new AbortController();
    const geometries: Record<string, THREE.BufferGeometry> = {};
    const loader = new STLLoader();
    const disposeInFlight = (): void => {
      Object.values(geometries).forEach((geometry) => geometry.dispose());
    };
    (async () => {
      try {
        await Promise.all(
          Object.entries(G1_MESH_FILES).map(async ([key, file]) => {
            const res = await fetch(G1_MESH_DIR + file, { signal: abortController.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status} loading ${file}`);
            const contents = await res.arrayBuffer();
            if (cancelled) return;
            const geometry = loader.parse(contents);
            geometry.rotateX(-Math.PI / 2);
            geometry.computeVertexNormals();
            geometries[key] = geometry;
          })
        );
        if (cancelled) {
          disposeInFlight();
          return;
        }
        const material = new THREE.MeshStandardMaterial({
          color: "#3a424d",
          metalness: 0.35,
          roughness: 0.46,
        });
        g1MeshCache = { geometries, material };
        setState({ phase: "ready", geometries, material });
      } catch {
        abortController.abort();
        disposeInFlight();
        if (!cancelled) setState({ phase: "failed" });
      }
    })();
    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [active]);
  if (g1MeshCache) {
    return { phase: "ready", geometries: g1MeshCache.geometries, material: g1MeshCache.material };
  }
  if (active && state.phase === "idle") return { phase: "loading" };
  return state;
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

function CameraRig({
  cameraView,
  activeRoom,
  pelvisThree,
}: {
  cameraView: "orbit" | "follow" | "pov" | "blueprint" | "fly";
  activeRoom: "all" | "living" | "dining" | "kitchen" | "porch" | "bedroom" | "bathroom" | "cutaway";
  pelvisThree: [number, number, number];
}) {
  const controlsRef = useRef<any>(null);
  const prevRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (cameraView === "orbit" && controlsRef.current) {
      if (prevRoomRef.current !== activeRoom) {
        const vp = ROOM_VIEWPOINTS[activeRoom] || ROOM_VIEWPOINTS.living;
        controlsRef.current.target.set(vp.target[0], vp.target[1], vp.target[2]);
        controlsRef.current.object.position.set(vp.pos[0], vp.pos[1], vp.pos[2]);
        controlsRef.current.update();
        prevRoomRef.current = activeRoom;
      }
    }
  }, [activeRoom, cameraView]);

  useFrame(({ camera }) => {
    if (cameraView === "follow") {
      cameraScratchVec.set(
        pelvisThree[0] - 2.6,
        pelvisThree[1] + 1.05,
        pelvisThree[2] + 2.35,
      );
      camera.position.lerp(cameraScratchVec, 0.08);
      camera.lookAt(pelvisThree[0], pelvisThree[1] + 0.12, pelvisThree[2]);
    } else if (cameraView === "pov") {
      cameraScratchVec.set(pelvisThree[0] + 0.05, pelvisThree[1] + 0.45, pelvisThree[2]);
      camera.position.copy(cameraScratchVec);
      camera.lookAt(pelvisThree[0] + 2.0, pelvisThree[1] + 0.35, pelvisThree[2]);
    } else if (cameraView === "blueprint") {
      cameraScratchVec.set(pelvisThree[0] + 0.3, 5.5, pelvisThree[2]);
      camera.position.lerp(cameraScratchVec, 0.08);
      camera.lookAt(pelvisThree[0] + 0.3, 0, pelvisThree[2]);
    }
    // In "orbit" mode, OrbitControls has 100% full, uninterrupted control!
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
    // Free-fly 6-DOF: W/A/S/D + Q/E or RMB drag. Bounded to the
    // house footprint so the operator can't lose the robot off-camera.
    <FlyControls
      movementSpeed={1.4}
      rollSpeed={0.6}
      dragToLook
      autoForward={false}
    />
  ) : null;
}

const houseSceneData = createSceneFromHouseFurniture(CRAFTSMAN_BUNGALOW_1928.furniture);

function RagdollDragger({
  pelvisThree,
  dragOffset,
  onDragChange,
  onCollisionChange,
}: {
  pelvisThree: [number, number, number];
  dragOffset: [number, number, number] | null;
  onDragChange: (offset: [number, number, number] | null) => void;
  onCollisionChange: (col: { isColliding: boolean; obstacleName: string | null; clearance: number }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
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
  };

  const handlePointerUp = () => {
    setIsDragging(false);
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

      {/* Holographic Ragdoll Grab Pin / Handle above Robot */}
      <group position={[currentPos[0], currentPos[1] + 0.38, currentPos[2]]}>
        <mesh onPointerDown={handlePointerDown} castShadow>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial
            color={isDragging ? "#f59e0b" : "#38bdf8"}
            emissive={isDragging ? "#d97706" : "#0284c7"}
            emissiveIntensity={isDragging ? 2.5 : 1.2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
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
    </group>
  );
}

function RobotStage({
  trace,
  admission,
  reduceMotion,
  meshState,
  xrayMode,
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
  robotDragOffset,
  onRobotDragChange,
  onDragCollisionChange,
}: {
  trace: G1TraceReceipt | null;
  admission: G1Admission | null;
  reduceMotion: boolean;
  meshState: G1MeshState;
  xrayMode: boolean;
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
  robotDragOffset?: [number, number, number] | null;
  onRobotDragChange?: (offset: [number, number, number] | null) => void;
  onDragCollisionChange?: (col: { isColliding: boolean; obstacleName: string | null; clearance: number }) => void;
}) {
  const sample = trace ? trace.samples[Math.min(sampleIndex, trace.samples.length - 1)] : null;
  const pelvisThree = sample ? ownerToThree(sample.linkPoses[0].position) : ([0.0, 0.75, 0.0] as [number, number, number]);

  const bgColor = timeOfDay === "evening-glow" ? "#120e0b" : timeOfDay === "golden-hour" ? "#1a120b" : "#12151c";

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
          positionOffset={robotDragOffset}
        />
      ) : null}

      <RagdollDragger
        pelvisThree={pelvisThree}
        dragOffset={robotDragOffset ?? null}
        onDragChange={onRobotDragChange ?? (() => {})}
        onCollisionChange={onDragCollisionChange ?? (() => {})}
      />

      <CameraRig cameraView={cameraView} activeRoom={activeRoom} pelvisThree={pelvisThree} />
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
  const meshState = useG1Meshes(shouldLoadMeshes);
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
  const [family, setFamily] = useState<ScalableFamily>("lm-cma");
  const [challenge, setChallenge] = useState<G1Challenge>("terrain-and-push");
  const [generations, setGenerations] = useState(16);
  const [searchSigma, setSearchSigma] = useState(0.005);
  const [seedIndex, setSeedIndex] = useState(0);
  const [busy, setBusy] = useState<"preview" | "optimize" | "compare" | null>("preview");
  const [status, setStatus] = useState("Loading the owner-composed G1 experiment…");
  const [error, setError] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  const [bestObjective, setBestObjective] = useState<number | null>(null);
  const [progressHistory, setProgressHistory] = useState<ConvergencePoint[]>([]);
  const [activeTrace, setActiveTrace] = useState<G1TraceOrigin>("curriculum");
  const [comparison, setComparison] = useState<ComparisonRow[] | null>(null);
  // The Craftsman estate is now first-class on both surfaces. X-ray remains
  // one tap away, but embedded/native users should not silently miss the
  // rooms, lighting, and architectural inspector added to the flagship.
  const [xrayMode, setXrayMode] = useState(false);
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
  const [selectedPreset, setSelectedPreset] = useState("cautious-monk");
  const [shoveActive, setShoveActive] = useState(false);
  const [robotDragOffset, setRobotDragOffset] = useState<[number, number, number] | null>(null);
  const [dragCollisionState, setDragCollisionState] = useState<{
    isColliding: boolean;
    obstacleName: string | null;
    clearance: number;
  }>({ isColliding: false, obstacleName: null, clearance: 1.0 });

  const post = useCallback((message: object, mode: "preview" | "optimize" | "compare") => {
    if (!workerRef.current) return;
    // Synchronous gate — must precede setBusy (which is async). Two rapid
    // clicks in the same render tick both see busy === null without this.
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setError(null);
    setBusy(mode);
    workerRef.current.postMessage(message);
  }, []);

  const handleSelectChapter = useCallback((ch: StoryChapter) => {
    setCurrentChapter(ch.id);
    if (ch.challenge !== challenge) {
      setChallenge(ch.challenge);
    }
    if (ch.targetTrace === "stabilizer" && stabilizerTrace) {
      setTrace(stabilizerTrace);
      setActiveTrace("stabilizer");
    } else if (ch.targetTrace === "curriculum" && curriculumTrace) {
      setTrace(curriculumTrace);
      setActiveTrace("curriculum");
    } else if (ch.targetTrace === "separable" || ch.targetTrace === "lm-cma") {
      setFamily(ch.targetTrace);
      post({ type: "preview", challenge: ch.challenge }, "preview");
    }
    setSampleIndex(0);
    setIsPlaying(true);
  }, [challenge, stabilizerTrace, curriculumTrace, post]);

  const handleSelectPreset = useCallback((p: RobotPersonalityPreset) => {
    setSelectedPreset(p.id);
    setStatus(`Applied ${p.name} reward weights (${p.gaitStyle}).`);
  }, []);

  const handleApplyShove = useCallback(() => {
    setShoveActive(true);
    setTimeout(() => setShoveActive(false), 800);
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
        setGeneration(message.generation);
        setBestObjective(message.bestObjective);
        setProgressHistory((prev) => {
          const next = prev.length >= 200
            ? [...prev.slice(prev.length - 199), {
                generation: message.generation,
                bestObjective: message.bestObjective,
                sigma: message.sigma,
              }]
            : [...prev, {
                generation: message.generation,
                bestObjective: message.bestObjective,
                sigma: message.sigma,
              }];
          return next;
        });
        setStatus(
          `${FAMILY_COPY[message.family].title}: generation ${message.generation}/${message.maxGenerations}, σ ${message.sigma.toExponential(2)}`
        );
      } else if (message.type === "trace") {
        setAdmission(message.admission);
        if (message.family === "stabilizer") {
          setStabilizerTrace(message.trace);
          setStatus("Standing prior received; loading the walking curriculum mean…");
          // The stabilizer trace is a one-shot at init; release the gate.
          inFlightRef.current = false;
          return;
        }
        setTrace(message.trace);
        if (message.family === "curriculum") setCurriculumTrace(message.trace);
        setActiveTrace(message.family);
        setGeneration(message.generation);
        setBestObjective(message.trace.objective);
        setBusy(null);
        inFlightRef.current = false;
        setStatus(
          message.family === "curriculum"
            ? "Walking curriculum mean replayed from Frankensim WASM."
            : `Best ${FAMILY_COPY[message.family].title} policy replayed through the full experiment.`
        );
      } else if (message.type === "comparison") {
        setComparison(message.rows);
        setBusy(null);
        inFlightRef.current = false;
        setStatus("Equal-budget 5,040-D physical owner-family race complete.");
      } else {
        setError(message.message);
        setBusy(null);
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
    optimizerWorker.postMessage({ type: "preview", challenge: "terrain-and-push" });
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
    else if (trace || error) bridgeState = "ready";
    else bridgeState = "loading";
    reportFrankenRobotsEngineState(
      "humanoid",
      bridgeState,
      status,
      {
        generation,
        bestObjective,
        completedSteps: trace?.completedSteps ?? null,
      },
    );
  }, [embedded, workerAvailable, error, busy, trace, status, generation, bestObjective]);

  const curriculumObjectiveDelta = trace && curriculumTrace
    ? curriculumTrace.objective - trace.objective
    : null;
  // Multi-factor objective over time (cmaes-0m3): expose the v068 kernel's
  // per-channel integrals (actuatorWorkJoules, slipIntegral, postureIntegral,
  // impactIntegral, jointLimitIntegral, contactScheduleMismatchIntegral,
  // lateralErrorIntegral, headingErrorIntegral, speedErrorIntegral,
  // backwardDistanceMeters) and a transparent weighted-sum channel card so
  // a small stabilizing correction is visible, not collapsed into one
  // scalar. The channel weights are owned by app/lib/g1MultiFactor.ts and
  // match the kernel's v068 shaping intent (mean forward speed + survival
  // positive; slip / impact / contact-schedule / work-per-meter negative).
  const multiFactor = trace
    ? computeMultiFactorObjective(trace, DEFAULT_G1_WALKING_CONFIG)
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

              {/* Push Wand Button */}
              <button
                type="button"
                onClick={handleApplyShove}
                className="flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/20 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-rose-200 backdrop-blur-md hover:bg-rose-500/30 transition-colors"
                title="Apply a 15 N·s lateral impulse to test HOCBF balance recovery"
              >
                <Zap className="h-3.5 w-3.5 text-rose-300" />
                <span className="sm:hidden">🥊 Push +15 N·s</span>
                <span className="max-sm:hidden">🥊 Push Robot (+15 N·s)</span>
              </button>

              {/* Drag Status & Contact Safety Readout */}
              {robotDragOffset ? (
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
                    onClick={() => setRobotDragOffset(null)}
                    className="flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-950/80 px-2.5 py-1 text-[0.68rem] font-bold uppercase text-cyan-200 hover:bg-cyan-900/60 transition-colors"
                    title="Reset robot to nominal position"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                </div>
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
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <span className="rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2 text-xs text-slate-300 backdrop-blur-md">
                  Loading the real Unitree G1 mesh rig…
                </span>
              </div>
            ) : null}
            {meshState.phase === "failed" ? (
              <div className="absolute bottom-20 left-5 right-5 z-10 flex justify-center pointer-events-none">
                <span className="rounded-xl border border-amber-300/20 bg-amber-950/65 px-3 py-2 text-[0.7rem] text-amber-100 backdrop-blur-md">
                  Mesh assets unavailable — showing the kinematic skeleton fallback.
                </span>
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
                  Rose arrow: disclosed lateral push · arm joints are kernel-posed with real mass (head/hands: display-only)
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
                  robotDragOffset={robotDragOffset}
                  onRobotDragChange={setRobotDragOffset}
                  onDragCollisionChange={setDragCollisionState}
                />
              )}
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
            <span>0.005 (explore)</span>
            <span>0.01 (aggressive)</span>
          </div>
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
              <h3 className="mt-1 text-xl font-bold text-white">Optimize a 5,040-D walking policy</h3>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-400">
            Fifteen actuators each read 42 physical signals through eight gait-phase basis terms:
            <span className="mt-2 block font-mono text-cyan-200">15 × 42 × 8 = 5,040 learned weights</span>
          </p>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            A disclosed full-CMA curriculum learned 105 meaningful owner coordinates: standing bias,
            periodic foot unloading, then pelvis feedback. Live search expands that curriculum to all
            5,040 weights. Every candidate is scored on the same 1.5-second, 720-step terrain-and-push experiment you watch.
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

          <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="g1-family">
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
                    setChallenge("flat");
                    setGeneration(0);
                    post({ type: "preview", challenge: "flat" }, "preview");
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
                    setChallenge("terrain-and-push");
                    setGeneration(0);
                    post({ type: "preview", challenge: "terrain-and-push" }, "preview");
                  }
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${challenge === "terrain-and-push" ? "bg-cyan-500/30 text-cyan-100" : "bg-white/5 text-slate-400 hover:text-slate-200"}`}
              >
                Terrain + push
              </button>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <label htmlFor="g1-generations">Search budget (generations)</label>
            <span className="font-mono text-cyan-200">
              {generations} × {G1_POPULATION} = {generations * G1_POPULATION} candidates
            </span>
          </div>
          <input
            id="g1-generations"
            type="range"
            min={8}
            max={30000}
            step={4}
            value={generations}
            disabled={busy !== null || !workerAvailable}
            onChange={(event) => setGenerations(Number(event.target.value))}
            aria-valuetext={`${generations} generations, ${generations * G1_POPULATION} full-horizon candidate rollouts`}
            style={{ touchAction: "pan-y pinch-zoom" }}
            suppressHydrationWarning
          />
          <div className="mt-1 flex justify-between text-[0.6rem] font-mono text-slate-400">
            <span>8</span>
            <span>7.5k</span>
            <span>15k</span>
            <span>22.5k</span>
            <span>30k</span>
          </div>
          <p className="mt-2 text-[0.68rem] leading-5 text-slate-400">
            16 gens is a refinement pass; the curriculum mean itself was
            learned over hundreds. Every press CONTINUES the same CMA run —
            mean, sigma, and covariance path preserved — so presses stack:
            16 + 2000 + 2000 … up to 30k generations of real search. Wall
            time scales with your hardware; the HUD shows the live generation.
            A flat objective stays flat — the run is honest about that too.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <button
              type="button"
              disabled={busy !== null || !workerAvailable}
              onClick={() =>
                post(
                  { type: "optimize", family, generations, seedIndex, mode: "continue", challenge, sigma: searchSigma },
                  "optimize"
                )
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 text-sm font-bold text-white shadow-lg shadow-cyan-950/40 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Sparkles className="h-4 w-4" />
              {generation > 0 ? `Continue · gen ${generation}` : "Optimize"}
            </button>
            <button
              type="button"
              disabled={busy !== null || !workerAvailable}
              onClick={() => {
                if (!curriculumTrace) {
                  post({ type: "preview", challenge }, "preview");
                  return;
                }
                setTrace(curriculumTrace);
                setActiveTrace("curriculum");
                setGeneration(0);
                setBestObjective(curriculumTrace.objective);
                setStatus("Walking curriculum mean replayed from Frankensim WASM.");
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RotateCcw className="h-4 w-4" />
              Walking mean
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
                setStatus("Standing-only prior replayed; compare its contacts with the walking mean.");
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
            {progressHistory.length >= 2 ? (
              <div className="mt-3">
                <ConvergenceChart
                  data={progressHistory}
                  label="CMA-ES convergence (best objective + σ)"
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
        <div className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-5 xl:grid-cols-10">
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
            weighted sum above re-exposes the same v068-shaping intent as a transparent sum of
            eleven per-step / per-trajectory channels. A small corrective slip, posture, or
            joint-limit term is no longer collapsed; the optimizer can reward it. The defaults
            here match the kernel&apos;s v068 weights; future versions surface the weights as a slider
            so the user can rebias the trade-off between forward speed, stability, and
            efficiency without changing the kernel binary.
          </p>
          <div className="mt-3 grid min-w-0 grid-cols-2 gap-x-4 gap-y-1 text-[0.68rem] text-slate-400 sm:grid-cols-3">
            {multiFactor.channels.map((c: MultiFactorChannel) => (
              <div key={c.label} className="flex min-w-0 justify-between font-mono">
                <span className="truncate pr-2 text-slate-300">{c.label}</span>
                <span className="shrink-0 text-slate-500">
                  {c.value >= 0 ? "+" : ""}
                  {number(c.contribution, 3)} (w {c.weight >= 0 ? "+" : ""}
                  {number(c.weight, 2)})
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 3. Live Objective Equalizer & Personality Sculptor */}
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
              <h3 className="mt-1 text-xl font-bold text-white">A live 5,040-D terrain-and-push race</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Same curriculum mean, Philox seed, population of 16, physical evaluator, and evaluation budget. Full CMA is absent only because the owner correctly refuses dense covariance above 256 dimensions; all four families race on the 128-D arm.
              </p>
            </div>
            <button
              type="button"
              disabled={busy !== null || !workerAvailable}
              onClick={() => post({ type: "compare", generations: 4, challenge }, "compare")}
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
    </div>
  );
}
