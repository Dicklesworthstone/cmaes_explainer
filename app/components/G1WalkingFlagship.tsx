"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useInView } from "../hooks/useScrollSpy";
import { Bot, BrainCircuit, Cpu, Gauge, Play, RotateCcw, Sparkles } from "lucide-react";
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
import { G1HouseBackdrop } from "./G1HouseBackdrop";
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
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#0a1627" roughness={0.82} metalness={0.16} />
      </mesh>
      <mesh geometry={geometry} position={[0, 0.0015, 0]}>
        <meshBasicMaterial color="#155e75" wireframe transparent opacity={0.28} />
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
}: {
  trace: G1TraceReceipt;
  admission: G1Admission | null;
  reduceMotion: boolean;
  meshState: G1MeshState;
}) {
  const [sampleIndex, setSampleIndex] = useState(0);
  const playbackSeconds = useRef(0);

  useFrame((_, deltaSeconds) => {
    if (reduceMotion || trace.samples.length < 2) return;
    const duration = trace.samples.at(-1)?.timeSeconds ?? 0;
    if (duration <= 0) return;
    // Owner traces often end quickly while a baseline is falling. Slow the
    // playback enough to inspect it, and advance from real elapsed time so a
    // 120 Hz display does not play twice as fast as a 60 Hz display.
    playbackSeconds.current = (playbackSeconds.current + Math.min(deltaSeconds, 0.1) * 0.55) % duration;
    const playbackTime = playbackSeconds.current;
    let nextIndex = 0;
    while (
      nextIndex + 1 < trace.samples.length &&
      trace.samples[nextIndex + 1].timeSeconds <= playbackTime
    ) {
      nextIndex += 1;
    }
    if (nextIndex !== sampleIndex) setSampleIndex(nextIndex);
  });

  const sample = trace.samples[Math.min(sampleIndex, trace.samples.length - 1)];
  const pushFraction = sample
    && admission?.config.challenge === "terrain-and-push"
    && sample.timeSeconds > admission.pushStartSeconds
    && sample.timeSeconds < admission.pushEndSeconds
    ? Math.sin(
        Math.PI
          * (sample.timeSeconds - admission.pushStartSeconds)
          / (admission.pushEndSeconds - admission.pushStartSeconds)
      )
    : 0;
  return sample ? (
    meshState.phase === "ready" ? (
      <RobotPoseMeshes sample={sample} meshes={meshState} pushFraction={pushFraction} />
    ) : (
      <RobotPose sample={sample} pushFraction={pushFraction} />
    )
  ) : null;
}

type G1MeshState =
  | { phase: "idle" | "loading" }
  | { phase: "ready"; geometries: Record<string, THREE.BufferGeometry>; material: THREE.MeshStandardMaterial }
  | { phase: "failed" };

function useG1Meshes(active: boolean): G1MeshState {
  const [state, setState] = useState<G1MeshState>({ phase: active ? "loading" : "idle" });
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let published = false;
    let material: THREE.MeshStandardMaterial | null = null;
    const geometries: Record<string, THREE.BufferGeometry> = {};
    const loader = new STLLoader();
    const disposeAssets = (): void => {
      Object.values(geometries).forEach((geometry) => geometry.dispose());
      material?.dispose();
    };
    (async () => {
      try {
        await Promise.all(
          Object.entries(G1_MESH_FILES).map(async ([key, file]) => {
            const res = await fetch(G1_MESH_DIR + file);
            if (!res.ok) throw new Error(`HTTP ${res.status} loading ${file}`);
            const geometry = loader.parse(await res.arrayBuffer());
            geometry.rotateX(-Math.PI / 2);
            geometry.computeVertexNormals();
            geometries[key] = geometry;
          })
        );
        if (cancelled) {
          disposeAssets();
          return;
        }
        material = new THREE.MeshStandardMaterial({
          color: "#3a424d",
          metalness: 0.35,
          roughness: 0.46,
        });
        published = true;
        setState({
          phase: "ready",
          geometries,
          material,
        });
      } catch {
        disposeAssets();
        if (!cancelled) setState({ phase: "failed" });
      }
    })();
    return () => {
      cancelled = true;
      if (published) disposeAssets();
    };
  }, [active]);
  return active && state.phase === "idle" ? { phase: "loading" } : state;
}

function RobotStage({
  trace,
  admission,
  reduceMotion,
  meshState,
}: {
  trace: G1TraceReceipt | null;
  admission: G1Admission | null;
  reduceMotion: boolean;
  meshState: G1MeshState;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.3;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <color attach="background" args={["#050b18"]} />
      <fog attach="fog" args={["#050b18", 3.5, 9.5]} />
      <PerspectiveCamera makeDefault position={[1.7, 0.95, 2.05]} fov={38} near={0.05} far={40} />
      {/* Five-light rig (studio harness): key w/ tight 2048 shadow frustum,
          cool fill, warm ground bounce, and a cool rim spot from behind —
          the rim is what separates the dark G1 shell from the dark set. */}
      <hemisphereLight args={["#7dd3fc", "#fde68a", 1.5]} />
      <directionalLight
        castShadow
        position={[2.4, 4.5, 2.2]}
        intensity={3.4}
        color="#fff3df"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0002}
        shadow-camera-left={-1.6}
        shadow-camera-right={1.6}
        shadow-camera-top={2.2}
        shadow-camera-bottom={-0.4}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
      />
      <directionalLight position={[-2.6, 1.6, -1.4]} intensity={1.05} color="#bfdbfe" />
      <directionalLight position={[0, -1.2, 1.6]} intensity={0.55} color="#fef3c7" />
      <spotLight position={[0.6, 2.3, -2.9]} intensity={26} angle={0.5} penumbra={0.85} color="#bae6fd" />

      <TerrainSurface admission={admission} />
      <G1HouseBackdrop showFurniture={true} showWalls={true} showGoals={true} />
      <mesh position={[0.975, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.95, 0.012]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.68} />
      </mesh>
      {trace ? (
        <RobotPlayback
          key={`${trace.objective}:${trace.distanceMeters}:${trace.samples.length}`}
          trace={trace}
          admission={admission}
          reduceMotion={reduceMotion}
          meshState={meshState}
        />
      ) : null}
      <OrbitControls
        makeDefault
        target={[0.2, 0.68, 0]}
        enableDamping
        dampingFactor={0.075}
        minDistance={1.2}
        maxDistance={7}
        minPolarAngle={0.55}
        maxPolarAngle={1.48}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      />
    </Canvas>
  );
}

function number(value: number, digits = 3): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}



export function G1WalkingFlagship() {
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
  const [trace, setTrace] = useState<G1TraceReceipt | null>(null);
  const [admission, setAdmission] = useState<G1Admission | null>(null);
  const [stabilizerTrace, setStabilizerTrace] = useState<G1TraceReceipt | null>(null);
  const [curriculumTrace, setCurriculumTrace] = useState<G1TraceReceipt | null>(null);
  const [workerAvailable, setWorkerAvailable] = useState(true);
  const [family, setFamily] = useState<ScalableFamily>("lm-cma");
  const [challenge, setChallenge] = useState<G1Challenge>("terrain-and-push");
  const [generations, setGenerations] = useState(16);
  const [seedIndex, setSeedIndex] = useState(0);
  const [busy, setBusy] = useState<"preview" | "optimize" | "compare" | null>("preview");
  const [status, setStatus] = useState("Loading the owner-composed G1 experiment…");
  const [error, setError] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  const [bestObjective, setBestObjective] = useState<number | null>(null);
  const [activeTrace, setActiveTrace] = useState<G1TraceOrigin>("curriculum");
  const [comparison, setComparison] = useState<ComparisonRow[] | null>(null);

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
      const message = event.data;
      if (message.type === "status") {
        setStatus(message.detail);
      } else if (message.type === "progress") {
        setGeneration(message.generation);
        setBestObjective(message.bestObjective);
        setStatus(
          `${FAMILY_COPY[message.family].title}: generation ${message.generation}/${message.maxGenerations}, σ ${message.sigma.toExponential(2)}`
        );
      } else if (message.type === "trace") {
        setAdmission(message.admission);
        if (message.family === "stabilizer") {
          setStabilizerTrace(message.trace);
          setStatus("Standing prior received; loading the walking curriculum mean…");
          return;
        }
        setTrace(message.trace);
        if (message.family === "curriculum") setCurriculumTrace(message.trace);
        setActiveTrace(message.family);
        setGeneration(message.generation);
        setBestObjective(message.trace.objective);
        setBusy(null);
        setStatus(
          message.family === "curriculum"
            ? "Walking curriculum mean replayed from Frankensim WASM."
            : `Best ${FAMILY_COPY[message.family].title} policy replayed through the full experiment.`
        );
      } else if (message.type === "comparison") {
        setComparison(message.rows);
        setBusy(null);
        setStatus("Equal-budget 5,040-D physical owner-family race complete.");
      } else {
        setError(message.message);
        setBusy(null);
        setStatus("The owner kernel refused or could not complete this request.");
      }
    };
    optimizerWorker.onerror = (event) => {
      setError(event.message || "The optimization worker failed before returning a typed result.");
      setBusy(null);
      setWorkerAvailable(false);
      optimizerWorker.terminate();
      workerRef.current = null;
    };
    optimizerWorker.postMessage({ type: "preview" });
    return () => {
      active = false;
      optimizerWorker.terminate();
      workerRef.current = null;
    };
  }, [workerActivated]);

  const post = useCallback((message: object, mode: "preview" | "optimize" | "compare") => {
    if (!workerRef.current || busy) return;
    setError(null);
    setBusy(mode);
    workerRef.current.postMessage(message);
  }, [busy]);
  const curriculumObjectiveDelta = trace && curriculumTrace
    ? curriculumTrace.objective - trace.objective
    : null;
   // Multi-factor objective over time (cmaes-0m3):
  // impactIntegral, jointLimitIntegral, contactScheduleMismatchIntegral, ...).
  // The UI now surfaces them as separate cards AND computes a weighted-sum
  // multi-factor objective so a small stabilizing correction is rewarded, not
  // collapsed into a single scalar. Weights match the v068 shaping intent
  // (mean forward speed positive, slip+impact negative, work/distance mildly
  // negative so a stabilizing correction is not punished).
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
        ["mean fwd speed", `${number(trace.distanceMeters / Math.max(trace.samples[trace.samples.length - 1]?.timeSeconds ?? DEFAULT_G1_WALKING_CONFIG.durationSeconds, 1e-6), 2)} m/s`],
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
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
        <div className="glass-card min-h-[620px] overflow-hidden border-cyan-400/15 bg-slate-950/80">
          <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2 pointer-events-none">
            <span className="rounded-full border border-cyan-300/25 bg-slate-950/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur-md">
              owner poses · 480 Hz terrain physics
            </span>
            <span className="rounded-full border border-violet-300/25 bg-slate-950/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-violet-200 backdrop-blur-md">
              {TRACE_TITLES[activeTrace]}
            </span>
            <span
              className="rounded-full border border-amber-300/25 bg-slate-950/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-amber-200 backdrop-blur-md"
              title="Transformer policy (GPU-trained, ONNX). Bead cmaes-9v7: the training crate (cmaes-j36 / cmaes-wsr / cmaes-6m3 / cmaes-6zi) is still in_progress; the .onnx is not yet exported. When the file lands at /robots/g1/transformer/model.onnx, the worker will capability-probe and the chip will turn cyan."
            >
              transformer (not yet exported)
            </span>
            <span
              className="rounded-full border border-amber-300/25 bg-slate-950/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-amber-200 backdrop-blur-md"
              title="Sears Craftsman floorplan rendered as a display-only backdrop. The kernel rollout runs the disclosed terrain-and-push physics; walls/furniture do not participate in collision or the objective until cmaes-u53 (multi-obstacle kernel) lands."
            >
              backdrop · house floorplan (display-only)
            </span>
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
          <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <span className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 backdrop-blur-md">
              Cyan / violet rings are owner contact booleans. Drag to orbit; pinch to zoom.
            </span>
            <span className="rounded-xl border border-amber-300/20 bg-amber-950/65 px-3 py-2 text-[0.7rem] text-amber-100 backdrop-blur-md">
              Rose arrow: disclosed lateral push · arm joints are kernel-posed with real mass (head/hands: display-only)
            </span>
          </div>
          <div ref={stageRef} className="h-[620px] w-full">
            {shouldMountStage && (
              <RobotStage trace={trace} admission={admission} reduceMotion={reduceMotion} meshState={meshState} />
            )}
          </div>
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
            periodic foot unloading, then pelvis feedback. The
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
            suppressHydrationWarning
          />
          <div className="mt-1 flex justify-between text-[0.6rem] font-mono text-slate-600">
            <span>8</span>
            <span>7.5k</span>
            <span>15k</span>
            <span>22.5k</span>
            <span>30k</span>
          </div>
          <p className="mt-2 text-[0.68rem] leading-5 text-slate-500">
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
                  { type: "optimize", family, generations, seedIndex, mode: "continue", challenge },
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
            {error ? <p className="mt-3 text-xs leading-5 text-rose-300">{error}</p> : null}
          </div>
        </div>
      </div>

      {trace ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 xl:grid-cols-10">
          {receiptCards.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
              <p className="mt-2 font-mono text-sm text-slate-100">{value}</p>
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
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[0.68rem] text-slate-400 sm:grid-cols-3">
            {multiFactor.channels.map((c: MultiFactorChannel) => (
              <div key={c.label} className="flex justify-between font-mono">
                <span className="truncate pr-2 text-slate-300">{c.label}</span>
                <span className="text-slate-500">
                  {c.value >= 0 ? "+" : ""}
                  {number(c.contribution, 3)} (w {c.weight >= 0 ? "+" : ""}
                  {number(c.weight, 2)})
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
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
