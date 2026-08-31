"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { armTaskFurniture, CRAFTSMAN_BUNGALOW_1928 } from "../lib/houseScenes";
import { buildFurniture } from "../lib/houseFurniture";
import { createSceneFromHouseFurniture, distanceToOBB, type MultiObstacleSceneConfig } from "../lib/houseMultiObstacleKernel";
import { computeAdaptiveSafetyMargin } from "../lib/riskAwareMargin";
import {
  BookOpen,
  Bot,
  Boxes,
  CheckCircle2,
  Cpu,
  Gauge,
  Home,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TreePine,
  Eye,
  Camera,
  Activity,
  Sliders,
  Shield,
  Zap,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useInView } from "../hooks/useScrollSpy";
import { ArmGraspMicroscopeOverlay, ArmGraspMicroscopeHUD } from "./ArmGraspMicroscope";
import { reportFrankenRobotsEngineState } from "../lib/frankenrobotsBridge";
import { robotAudio } from "../lib/robotAudioSynthesizer";
import { MANIPULABLE_OBJECT_PRESETS, computeFerrariCannyGWS } from "../lib/armInverseKinematics";
import {
  type CmaFamily,
  type HouseholdManipulationAdmission,
  type HouseholdManipulationTask,
  type HouseholdManipulationTraceReceipt,
  type HouseholdManipulationTraceSample,
  type HouseholdRobotPose,
} from "../lib/frankensimCmaes";

type ArmTraceOrigin = CmaFamily | "curriculum";

type ComparisonRow = {
  family: CmaFamily;
  initialObjective: number;
  finalObjective: number;
  evaluations: number;
  persistentScalars: number;
  workspaceScalars: number;
  elapsedMilliseconds: number;
};

type WorkerResponse =
  | { type: "status"; phase: string; detail: string }
  | {
      type: "trace";
      trace: HouseholdManipulationTraceReceipt;
      admission: HouseholdManipulationAdmission;
      generation: number;
      family: ArmTraceOrigin;
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

const FAMILY_COPY: Record<
  CmaFamily,
  { title: string; representation: string; complexity: string; color: string }
> = {
  full: {
    title: "Full CMA-ES",
    representation: "Learns every pairwise covariance interaction",
    complexity: "O(n²) state · O(n³) decomposition",
    color: "text-sky-300",
  },
  separable: {
    title: "Separable CMA-ES",
    representation: "Learns one independent scale per coordinate",
    complexity: "O(n) state · O(n) update",
    color: "text-cyan-300",
  },
  "lm-cma": {
    title: "LM-CMA",
    representation: "Remembers a bounded history of search directions",
    complexity: "O(mn) state · O(m²n) worst-case update",
    color: "text-violet-300",
  },
  "lm-ma": {
    title: "LM-MA",
    representation: "Maintains a bounded moving linear transform",
    complexity: "O(mn) state · O(mn) update",
    color: "text-fuchsia-300",
  },
};

const TASK_COPY: Record<
  HouseholdManipulationTask,
  { title: string; short: string; setting: string; accent: string; icon: typeof Home }
> = {
  "kitchen-mug": {
    title: "Kitchen mug",
    short: "Lift stoneware between counter stations",
    setting: "kitchen",
    accent: "text-amber-300",
    icon: Home,
  },
  "living-room-remote": {
    title: "Living-room remote",
    short: "Place a remote into its organizer",
    setting: "living room",
    accent: "text-cyan-300",
    icon: Boxes,
  },
  "backyard-trowel": {
    title: "Backyard trowel",
    short: "Move a hand tool into its caddy",
    setting: "backyard",
    accent: "text-emerald-300",
    icon: TreePine,
  },
};

const EMBEDDED_TASK_TITLES: Record<HouseholdManipulationTask, string> = {
  "kitchen-mug": "Mug",
  "living-room-remote": "Remote",
  "backyard-trowel": "Trowel",
};

const LINK_SOURCE_ROWS = [
  ["iiwa_link_0", "base", "5.0000"],
  ["iiwa_link_1", "0.1500", "3.4525"],
  ["iiwa_link_2", "0.1900", "3.4821"],
  ["iiwa_link_3", "0.2100", "4.0562"],
  ["iiwa_link_4", "0.1900", "3.4822"],
  ["iiwa_link_5", "0.2100", "2.1633"],
  ["iiwa_link_6", "0.1995", "2.3466"],
  ["iiwa_link_7", "0.1012", "3.1290"],
] as const;

const ARM_POPULATION = 12;

function number(value: number, digits = 3): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}

function applyOwnerPose(object: THREE.Object3D, pose: HouseholdRobotPose): void {
  object.position.set(pose.position[0], pose.position[2], -pose.position[1]);
  object.quaternion.set(
    pose.quaternionWxyz[1],
    pose.quaternionWxyz[3],
    -pose.quaternionWxyz[2],
    pose.quaternionWxyz[0]
  );
}

function ownerPositionToThree(position: readonly number[]): [number, number, number] {
  return [position[0], position[2], -position[1]];
}

function HouseholdObject({
  task,
  dimensions,
  ghost = false,
}: {
  task: HouseholdManipulationTask;
  dimensions: readonly [number, number, number];
  ghost?: boolean;
}) {
  const opacity = ghost ? 0.22 : 1;
  let material = "#fb923c";
  if (ghost) {
    material = "#34d399";
  } else if (task === "kitchen-mug") {
    material = "#f8fafc";
  } else if (task === "living-room-remote") {
    material = "#111827";
  }
  if (task === "kitchen-mug") {
    const radius = Math.max(dimensions[0], dimensions[1]) * 0.5;
    return (
      <group>
        <mesh castShadow={!ghost} receiveShadow>
          <cylinderGeometry args={[radius * 0.9, radius, dimensions[2], 28, 1, false]} />
          <meshPhysicalMaterial
            color={material}
            roughness={0.2}
            clearcoat={0.7}
            transparent={ghost}
            opacity={opacity}
            wireframe={ghost}
          />
        </mesh>
        <mesh position={[radius * 1.05, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 0.55, radius * 0.16, 10, 24]} />
          <meshStandardMaterial color={material} transparent={ghost} opacity={opacity} />
        </mesh>
      </group>
    );
  }
  if (task === "living-room-remote") {
    return (
      <group>
        <mesh castShadow={!ghost} receiveShadow>
          <boxGeometry args={[dimensions[0], dimensions[2], dimensions[1]]} />
          <meshPhysicalMaterial
            color={material}
            roughness={0.42}
            metalness={0.12}
            transparent={ghost}
            opacity={opacity}
            wireframe={ghost}
          />
        </mesh>
        {!ghost
          ? [-0.045, -0.015, 0.015, 0.045].map((z, index) => (
              <mesh key={z} position={[index % 2 === 0 ? -0.014 : 0.014, dimensions[2] * 0.52, z]}>
                <cylinderGeometry args={[0.006, 0.006, 0.004, 12]} />
                <meshStandardMaterial color={index === 0 ? "#ef4444" : "#94a3b8"} />
              </mesh>
            ))
          : null}
      </group>
    );
  }
  return (
    <group>
      <mesh position={[0, 0, dimensions[1] * 0.20]} rotation={[Math.PI / 2, 0, 0]} castShadow={!ghost}>
        <cylinderGeometry args={[dimensions[0] * 0.18, dimensions[0] * 0.22, dimensions[1] * 0.58, 18]} />
        <meshStandardMaterial color={ghost ? material : "#78350f"} transparent={ghost} opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, -dimensions[1] * 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow={!ghost}>
        <coneGeometry args={[dimensions[0] * 0.5, dimensions[1] * 0.42, 4]} />
        <meshStandardMaterial
          color={ghost ? material : "#cbd5e1"}
          metalness={0.8}
          roughness={0.3}
          transparent={ghost}
          opacity={opacity}
          wireframe={ghost}
        />
      </mesh>
    </group>
  );
}

function ArmEnvironment({ admission }: { admission: HouseholdManipulationAdmission }) {
  const { task } = admission.config;
  const { scene } = admission;
  const supportY = scene.supportHeightMeters;
  const goal = ownerPositionToThree(scene.goalObjectPositionMeters);
  const obstacle = ownerPositionToThree(scene.obstacleCenterMeters);
  const obstacleSize: [number, number, number] = [
    2 * scene.obstacleHalfExtentsMeters[0],
    2 * scene.obstacleHalfExtentsMeters[2],
    2 * scene.obstacleHalfExtentsMeters[1],
  ];

  return (
    <group>
      <mesh position={[0, supportY - 0.045, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.3, 0.09, 1.65]} />
        <meshStandardMaterial
          color={task === "backyard-trowel" ? "#60452f" : task === "kitchen-mug" ? "#263241" : "#3f3344"}
          roughness={0.72}
          metalness={0.08}
        />
      </mesh>

      {task === "kitchen-mug" ? (
        <>
          <mesh position={[0, supportY + 0.5, -0.82]} receiveShadow>
            <boxGeometry args={[2.3, 1.05, 0.07]} />
            <meshStandardMaterial color="#1d2a40" roughness={0.82} />
          </mesh>
        </>
      ) : task === "living-room-remote" ? (
        <>
          <mesh position={[0.72, supportY + 0.25, -0.58]} receiveShadow>
            <boxGeometry args={[0.62, 0.44, 0.3]} />
            <meshStandardMaterial color="#312e3f" roughness={0.92} />
          </mesh>
          <mesh position={goal} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.11, 0.008, 8, 32]} />
            <meshBasicMaterial color="#34d399" transparent opacity={0.65} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, 0.015, 0]} receiveShadow>
            <boxGeometry args={[4.5, 0.03, 4.0]} />
            <meshStandardMaterial color="#102a1d" roughness={1} />
          </mesh>
          {[-1.1, -0.85, 0.85, 1.1].map((x) => (
            <mesh key={x} position={[x, 0.48, -0.85]}>
              <boxGeometry args={[0.035, 0.95, 0.035]} />
              <meshStandardMaterial color="#6b4f32" roughness={0.9} />
            </mesh>
          ))}
        </>
      )}

      <group position={goal}>
        <HouseholdObject task={task} dimensions={scene.objectDimensionsMeters} ghost />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5 * scene.objectDimensionsMeters[2], 0]}>
          <ringGeometry args={[0.075, 0.095, 32]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <mesh position={obstacle}>
        <boxGeometry args={obstacleSize} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.075} depthWrite={false} />
      </mesh>
      <mesh position={obstacle}>
        <boxGeometry args={obstacleSize} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.42} wireframe />
      </mesh>
    </group>
  );
}

function ArmRig({
  trace,
  admission,
  reduceMotion,
  microscopeMode,
}: {
  trace: HouseholdManipulationTraceReceipt;
  admission: HouseholdManipulationAdmission;
  reduceMotion: boolean;
  microscopeMode: boolean;
}) {
  const linkRefs = useRef<Array<THREE.Group | null>>([]);
  const segmentRefs = useRef<Array<THREE.Mesh | null>>([]);
  const objectRef = useRef<THREE.Group | null>(null);
  const leftFingerRef = useRef<THREE.Mesh | null>(null);
  const rightFingerRef = useRef<THREE.Mesh | null>(null);
  const contactRingRef = useRef<THREE.Mesh | null>(null);
  const contactMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const playbackSeconds = useRef(0);
  const sampleIndex = useRef(0);
  const [currentSample, setCurrentSample] = useState<HouseholdManipulationTraceSample | null>(
    () => trace.samples[0] ?? null
  );
  // Boundary volumes the kernel's objective already avoids: the counter slab,
  // the task's backdrop wall, and the declared obstacle box. The checker below
  // flags visible penetrations of exactly these volumes — presentation-layer
  // truth against the declared scene, not a second physics claim.
  const boundaryBoxes = useMemo(() => {
    const scene = admission.scene;
    const supportY = scene.supportHeightMeters;
    const boxes: Array<{ name: string; box: THREE.Box3 }> = [
      {
        name: "counter",
        box: new THREE.Box3(
          new THREE.Vector3(-1.15, supportY - 0.09, -0.825),
          new THREE.Vector3(1.15, supportY + 0.001, 0.825)
        ),
      },
      {
        name: "obstacle",
        box: new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(...ownerPositionToThree(scene.obstacleCenterMeters)),
          new THREE.Vector3(
            2 * scene.obstacleHalfExtentsMeters[0],
            2 * scene.obstacleHalfExtentsMeters[2],
            2 * scene.obstacleHalfExtentsMeters[1]
          )
        ),
      },
    ];
    if (admission.config.task === "kitchen-mug") {
      boxes.push({
        name: "backdrop",
        box: new THREE.Box3(
          new THREE.Vector3(-1.15, supportY - 0.02, -0.86),
          new THREE.Vector3(1.15, supportY + 1.03, -0.78)
        ),
      });
    }
    return boxes;
  }, [admission]);

  // SOTA multi-obstacle kernel: every furniture piece as an oriented
  // bounding box with proper rotation-aware signed-distance queries.
  // Supplements the Box3 counter/wall check for per-link boundary detection.
  const multiObstacleScene = useMemo(
    () => createSceneFromHouseFurniture(),
    [] // static catalog
  );
  const adaptiveMargin = 0.05; // base margin; scales by velocity in production
  const boundaryStateRef = useRef({ key: "", lastTick: 0 });
  const frameTick = useRef(0);
  const scratch = useMemo(
    () => ({
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      direction: new THREE.Vector3(),
      midpoint: new THREE.Vector3(),
      yAxis: new THREE.Vector3(0, 1, 0),
      quaternion: new THREE.Quaternion(),
      probe: new THREE.Vector3(),
    }),
    []
  );

  useFrame((_, deltaSeconds) => {
    const samples = trace.samples;
    if (samples.length === 0) return;
    const duration = samples.at(-1)?.timeSeconds ?? 0;
    if (reduceMotion) {
      sampleIndex.current = samples.length - 1;
    } else if (duration > 0) {
      playbackSeconds.current =
        (playbackSeconds.current + Math.min(deltaSeconds, 0.1) * 0.72) % duration;
      if (samples[sampleIndex.current]?.timeSeconds > playbackSeconds.current) {
        sampleIndex.current = 0;
      }
      while (
        sampleIndex.current + 1 < samples.length &&
        samples[sampleIndex.current + 1].timeSeconds <= playbackSeconds.current
      ) {
        sampleIndex.current += 1;
      }
    }
    const sample: HouseholdManipulationTraceSample = samples[sampleIndex.current];
    for (let link = 0; link < sample.linkPoses.length; link++) {
      const group = linkRefs.current[link];
      if (group) applyOwnerPose(group, sample.linkPoses[link]);
      if (link === 0) continue;
      const segment = segmentRefs.current[link - 1];
      if (!segment) continue;
      const parent = sample.linkPoses[link - 1].position;
      const child = sample.linkPoses[link].position;
      scratch.start.set(parent[0], parent[2], -parent[1]);
      scratch.end.set(child[0], child[2], -child[1]);
      scratch.direction.subVectors(scratch.end, scratch.start);
      const length = Math.max(0.025, scratch.direction.length());
      scratch.midpoint.addVectors(scratch.start, scratch.end).multiplyScalar(0.5);
      scratch.quaternion.setFromUnitVectors(
        scratch.yAxis,
        scratch.direction.multiplyScalar(1 / length)
      );
      segment.position.copy(scratch.midpoint);
      segment.quaternion.copy(scratch.quaternion);
      segment.scale.set(1, length, 1);
    }
    if (objectRef.current) applyOwnerPose(objectRef.current, sample.objectPose);
    const halfWidth = 0.5 * sample.gripperWidthMeters;
    if (leftFingerRef.current) leftFingerRef.current.position.x = -halfWidth;
    if (rightFingerRef.current) rightFingerRef.current.position.x = halfWidth;
    if (contactRingRef.current) {
      const forceScale = 1 + Math.min(1.2, sample.gripNormalForceNewtons / 14);
      contactRingRef.current.scale.setScalar(forceScale);
      contactRingRef.current.visible = sample.gripNormalForceNewtons > 0.01;
    }
    if (contactMaterialRef.current) {
      contactMaterialRef.current.opacity = sample.grasped ? 0.95 : 0.45;
      contactMaterialRef.current.color.setHex(sample.grasped ? 0x34d399 : 0xfbbf24);
    }

    let violatingLink = -1;
    let violatingVolume = "";

    // SOTA multi-obstacle OBB query: proper rotated-box signed distance
    // to every furniture piece in the Craftsman catalog. Supplements the
    // Box3 boundary check with rotation-aware OBB distance for all 74
    // furniture pieces.
    let mobViolatingLink = -1;
    let mobVolume = "";
    for (let link = 0; link < sample.linkPoses.length && mobViolatingLink < 0; link++) {
      const p = sample.linkPoses[link].position;
      scratch.probe.set(p[0], p[2], -p[1]);
      for (const obb of multiObstacleScene.obstacles) {
        const dist = distanceToOBB(
          [scratch.probe.x, scratch.probe.y, scratch.probe.z],
          obb
        );
        if (dist <= 0.05) {
          mobViolatingLink = link;
          mobVolume = obb.name;
          break;
        }
      }
    }
    if (mobViolatingLink >= 0) {
      violatingLink = mobViolatingLink;
      violatingVolume = mobVolume;
    }

    // Boundary-clipping detection: presentation-layer check of every arm link
    // origin against the declared counter/wall/obstacle volumes. A hit tints
    // that link's meshes red until the set of violations changes.
    frameTick.current += 1;
    for (let link = 0; link < sample.linkPoses.length && violatingLink < 0; link++) {
      const p = sample.linkPoses[link].position;
      scratch.probe.set(p[0], p[2], -p[1]);
      for (const { name, box } of boundaryBoxes) {
        if (box.distanceToPoint(scratch.probe) <= 0.05) {
          violatingLink = link;
          violatingVolume = name;
          break;
        }
      }
    }
    const violationKey = violatingLink < 0 ? "" : `${violatingLink}:${violatingVolume}`;
    if (violationKey !== boundaryStateRef.current.key && frameTick.current % 6 === 0) {
      boundaryStateRef.current.key = violationKey;
      for (let link = 0; link < sample.linkPoses.length; link++) {
        const group = linkRefs.current[link];
        if (!group) continue;
        const hot = link === violatingLink;
        group.traverse((child) => {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
          if (mat && "emissive" in mat) mat.emissive.setHex(hot ? 0xdc2626 : 0x000000);
        });
      }
    }
  });

  return (
    <group>
      {/* iiwa14-faithful segments: tapering silver housings with KUKA-orange
          accent bands. Radii follow the real link cross-sections (0.07 at the
          base drum down to 0.05 at the wrist); lengths scale per traced pair
          in useFrame. */}
      {Array.from({ length: 7 }, (_, index) => (
        <mesh
          key={`segment-${index}`}
          ref={(mesh) => {
            segmentRefs.current[index] = mesh;
          }}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.07 - index * 0.004, 0.072 - index * 0.004, 1, 28]} />
          <meshPhysicalMaterial
            color="#c9ced4"
            roughness={0.28}
            metalness={0.82}
            clearcoat={0.5}
            clearcoatRoughness={0.25}
          />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, index) => (
        <group
          key={`link-${index}`}
          ref={(group) => {
            linkRefs.current[index] = group;
          }}
        >
          {index === 0 ? (
            <>
              <mesh position={[0, -0.055, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.14, 0.16, 0.11, 32]} />
                <meshStandardMaterial color="#1e293b" roughness={0.32} metalness={0.78} />
              </mesh>
              <mesh position={[0, 0.018, 0]} castShadow>
                <cylinderGeometry args={[0.105, 0.125, 0.05, 32]} />
                <meshPhysicalMaterial color="#f97316" roughness={0.25} metalness={0.58} clearcoat={0.45} />
              </mesh>
            </>
          ) : (
            <>
              {/* iiwa14 joint drum: black cylindrical housing with the
                  silver end-ring, replacing the generic sphere. */}
              <mesh castShadow>
                <cylinderGeometry args={[index === 7 ? 0.058 : 0.068, index === 7 ? 0.058 : 0.068, 0.085, 28]} />
                <meshStandardMaterial color="#1c2430" roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[index === 7 ? 0.052 : 0.061, 0.008, 12, 36]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.18} />
              </mesh>
            </>
          )}
          {index === 7 ? (
            <group position={[0, 0.045, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.125, 0.035, 0.075]} />
                <meshStandardMaterial color="#111827" metalness={0.78} roughness={0.28} />
              </mesh>
              <mesh
                ref={leftFingerRef}
                position={[-0.052, -0.04, 0]}
                castShadow
              >
                <boxGeometry args={[0.014, 0.11, 0.028]} />
                <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
              </mesh>
              <mesh
                ref={rightFingerRef}
                position={[0.052, -0.04, 0]}
                castShadow
              >
                <boxGeometry args={[0.014, 0.11, 0.028]} />
                <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
              </mesh>
              <mesh ref={contactRingRef} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.085, 0.006, 8, 36]} />
                <meshBasicMaterial
                  ref={contactMaterialRef}
                  color="#fbbf24"
                  transparent
                  opacity={0.45}
                  depthWrite={false}
                />
              </mesh>
            </group>
          ) : null}
        </group>
      ))}

      <group ref={objectRef}>
        <HouseholdObject
          task={admission.config.task}
          dimensions={admission.scene.objectDimensionsMeters}
        />
      </group>

      <ArmGraspMicroscopeOverlay sample={currentSample} enabled={microscopeMode} />
    </group>
  );
}

const armCameraScratchVec = new THREE.Vector3();

function ArmCameraRig({
  cameraMode,
  objectPos,
}: {
  cameraMode: "studio" | "microscope" | "overhead";
  objectPos: [number, number, number];
}) {
  useFrame(({ camera }) => {
    if (cameraMode === "microscope") {
      armCameraScratchVec.set(objectPos[0] + 0.32, objectPos[1] + 0.22, objectPos[2] + 0.32);
      camera.position.lerp(armCameraScratchVec, 0.08);
      camera.lookAt(objectPos[0], objectPos[1], objectPos[2]);
    } else if (cameraMode === "overhead") {
      armCameraScratchVec.set(0, 3.2, 0);
      camera.position.lerp(armCameraScratchVec, 0.08);
      camera.lookAt(0, 0.4, 0);
    }
  });

  return cameraMode === "studio" ? (
    <OrbitControls
      makeDefault
      target={[-0.05, 0.48, 0]}
      enableDamping
      dampingFactor={0.08}
      minDistance={0.2}
      maxDistance={15}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI / 2 - 0.02}
      touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
    />
  ) : null;
}

import { clampArmTargetPosition } from "../lib/armInverseKinematics";

const armHouseScene = createSceneFromHouseFurniture(CRAFTSMAN_BUNGALOW_1928.furniture);

function ArmTargetDragger({
  targetPos,
  onTargetChange,
  onCollisionChange,
}: {
  targetPos: [number, number, number];
  onTargetChange: (pos: [number, number, number] | null) => void;
  onCollisionChange: (col: { isColliding: boolean; clearance: number }) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const startPointerRef = useRef<[number, number]>([0, 0]);
  const startPosRef = useRef<[number, number, number]>(targetPos);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    startPointerRef.current = [e.point.x, e.point.z];
    startPosRef.current = targetPos;
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    const dx = e.point.x - startPointerRef.current[0];
    const dz = e.point.z - startPointerRef.current[1];
    const proposed: [number, number, number] = [
      startPosRef.current[0] + dx,
      startPosRef.current[1],
      startPosRef.current[2] + dz,
    ];

    // CONTINUOUS COLLISION DETECTION (CCD) & SURFACE CLAMPING (Y >= 0.78)
    const { clampedTarget, isColliding, minClearance } =
      clampArmTargetPosition(proposed, armHouseScene.obstacles, 0.78, 0.04);

    if (isColliding) {
      robotAudio.playCollisionBump(0.03);
    }

    onTargetChange(clampedTarget);
    onCollisionChange({ isColliding, clearance: minClearance });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <group>
      {isDragging && (
        <mesh
          position={[0, targetPos[1], 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          visible={false}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Holographic Interactive Target Grab Pin above Object */}
      <group position={[targetPos[0], targetPos[1] + 0.22, targetPos[2]]}>
        <mesh onPointerDown={handlePointerDown} castShadow>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color={isDragging ? "#fb923c" : "#f59e0b"}
            emissive={isDragging ? "#ea580c" : "#d97706"}
            emissiveIntensity={isDragging ? 2.5 : 1.2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, -0.09, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.18, 6]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Floor/Counter Contact Ring */}
      <mesh
        position={[targetPos[0], 0.782, targetPos[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.06, 0.09, 24]} />
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

function ArmStage({
  trace,
  admission,
  reduceMotion,
  microscopeMode,
  cameraMode,
  sampleIndex,
  onSampleChange,
  dragTarget,
  onDragTargetChange,
  onCollisionChange,
}: {
  trace: HouseholdManipulationTraceReceipt | null;
  admission: HouseholdManipulationAdmission | null;
  reduceMotion: boolean;
  microscopeMode: boolean;
  cameraMode: "studio" | "microscope" | "overhead";
  sampleIndex: number;
  onSampleChange?: (sample: HouseholdManipulationTraceSample) => void;
  dragTarget?: [number, number, number] | null;
  onDragTargetChange?: (pos: [number, number, number] | null) => void;
  onCollisionChange?: (col: { isColliding: boolean; clearance: number }) => void;
}) {
  const currentSample = trace ? trace.samples[Math.min(sampleIndex, trace.samples.length - 1)] : null;
  const rawObjectPos: [number, number, number] = currentSample
    ? [currentSample.objectPose.position[0], currentSample.objectPose.position[2], -currentSample.objectPose.position[1]]
    : [0.4, 0.82, 0.2];

  const objectPos: [number, number, number] = dragTarget ?? rawObjectPos;

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
      <color attach="background" args={["#16120e"]} />
      <fog attach="fog" args={["#16120e", 5.0, 14.0]} />
      <PerspectiveCamera makeDefault position={[1.55, 1.25, 1.8]} fov={38} near={0.03} far={30} />
      <ambientLight intensity={0.65} color="#fff1dc" />
      <hemisphereLight args={["#fed7aa", "#78350f", 1.3]} />
      <directionalLight
        castShadow
        position={[2.2, 4.2, 2.4]}
        intensity={3.6}
        color="#fff5e6"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight position={[-2.3, 2.8, 1.1]} intensity={12} angle={0.42} penumbra={0.85} color="#f59e0b" />
      <spotLight position={[1.4, 1.8, -2.2]} intensity={7} angle={0.38} penumbra={0.9} color="#fdba74" />
      
      {/* 1928 Sears Craftsman Bungalow Oak Hardwood Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#6b3a16" roughness={0.35} metalness={0.08} />
      </mesh>
      
      {(() => {
        const placement = admission ? armTaskFurniture(admission.config.task) : null;
        if (!placement) return null;
        const obstacleName = placement.obstacle.name;
        const goalName = placement.goal.name;
        const pieces = CRAFTSMAN_BUNGALOW_1928.furniture.filter(
          (f) =>
            f.room === "kitchen" ||
            f.room === "living room" ||
            f.name === obstacleName ||
            f.name === goalName
        );
        return pieces.map((f) => {
          const p3 = ownerPositionToThree(f.center);
          const isObstacle = f.name === obstacleName;
          const { group: furnGroup } = buildFurniture(f.name, f.size[0], f.size[1], f.height);
          return (
            <group key={f.name} position={[p3[0], 0, p3[2]]} rotation={[0, f.rotation, 0]}>
              <primitive object={furnGroup} />
              {isObstacle ? (
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
                  <torusGeometry args={[0.09, 0.007, 8, 36]} />
                  <meshBasicMaterial color="#fb7185" transparent opacity={0.55} />
                </mesh>
              ) : null}
            </group>
          );
        });
      })()}

      {admission ? <ArmEnvironment admission={admission} /> : null}
      {trace && admission ? (
        <ArmRig
          key={`${admission.config.task}:${trace.objective}:${trace.samples.length}`}
          trace={trace}
          admission={admission}
          reduceMotion={reduceMotion}
          microscopeMode={microscopeMode}
        />
      ) : null}

      <ArmTargetDragger
        targetPos={objectPos}
        onTargetChange={onDragTargetChange ?? (() => {})}
        onCollisionChange={onCollisionChange ?? (() => {})}
      />

      <ArmCameraRig cameraMode={cameraMode} objectPos={objectPos} />
    </Canvas>
  );
}

export function HouseholdArmFlagship({ embedded = false }: { embedded?: boolean } = {}) {
  const reduceMotion = useReducedMotion() ?? false;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const shouldMountStage = useInView(stageRef, { rootMargin: "600px 0px 600px 0px" });
  const workerActivated = useInView(stageRef, {
    rootMargin: "600px 0px 600px 0px",
    once: true,
  });
  const workerRef = useRef<Worker | null>(null);
  // Synchronous in-flight gate — see G1WalkingFlagship for the rationale.
  // React state (busy) updates asynchronously; without this, two rapid
  // clicks in the same render tick both postMessage, racing the worker's
  // CMA session.
  const inFlightRef = useRef<boolean>(false);
  const [trace, setTrace] = useState<HouseholdManipulationTraceReceipt | null>(null);
  const [curriculumTrace, setCurriculumTrace] = useState<HouseholdManipulationTraceReceipt | null>(null);
  const [admission, setAdmission] = useState<HouseholdManipulationAdmission | null>(null);
  const [task, setTask] = useState<HouseholdManipulationTask>("kitchen-mug");
  const [family, setFamily] = useState<CmaFamily>("lm-cma");
  const [generations, setGenerations] = useState(8);
  const [seedIndex, setSeedIndex] = useState(0);
  const [generation, setGeneration] = useState(0);
  const [bestObjective, setBestObjective] = useState<number | null>(null);
  const [activeTrace, setActiveTrace] = useState<ArmTraceOrigin>("curriculum");
  const [comparison, setComparison] = useState<ComparisonRow[] | null>(null);
  const [busy, setBusy] = useState<"preview" | "optimize" | "compare" | null>("preview");
  const [workerAvailable, setWorkerAvailable] = useState(true);
  const [status, setStatus] = useState("Loading the pinned KUKA model and physical curriculum…");
  const [error, setError] = useState<string | null>(null);
  // Mobile: show the 4 most consequential receipt cards by default; user can
  // expand to all 12 so the page doesn't drown the viewport in telemetry.
  const [showAllReceipts, setShowAllReceipts] = useState(false);
  const [microscopeMode, setMicroscopeMode] = useState(false);
  const [cameraMode, setCameraMode] = useState<"studio" | "microscope" | "overhead">("studio");
  const [sampleIndex, setSampleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [armDragTarget, setArmDragTarget] = useState<[number, number, number] | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [armCollisionState, setArmCollisionState] = useState<{
    isColliding: boolean;
    clearance: number;
  }>({ isColliding: false, clearance: 1.0 });

  useEffect(() => {
    if (!workerActivated) return;
    let active = true;
    let optimizerWorker: Worker;
    try {
      optimizerWorker = new Worker(new URL("../workers/armOptimizationWorker.ts", import.meta.url), {
        type: "module",
        name: "frankensim-household-arm-optimizer",
      });
    } catch (workerError) {
      const message = workerError instanceof Error ? workerError.message : String(workerError);
      queueMicrotask(() => {
        if (!active) return;
        setWorkerAvailable(false);
        setBusy(null);
        setStatus("The household-arm worker could not start in this browser.");
        setError(message);
      });
      return () => {
        active = false;
      };
    }
    workerRef.current = optimizerWorker;
    optimizerWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      // See G1WalkingFlagship for the active-flag rationale: the
      // cleanup function runs on unmount and strict-mode re-runs;
      // without this guard, stale messages trigger setState on a
      // component that no longer owns the worker.
      if (!active) return;
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
        setTrace(message.trace);
        setAdmission(message.admission);
        if (message.family === "curriculum") setCurriculumTrace(message.trace);
        setActiveTrace(message.family);
        setGeneration(message.generation);
        setBestObjective(message.trace.objective);
        setBusy(null);
        inFlightRef.current = false;
        setStatus(
          message.family === "curriculum"
            ? `${TASK_COPY[message.admission.config.task].title} curriculum replayed from Frankensim WASM.`
            : `Best ${FAMILY_COPY[message.family].title} policy replayed through the identical physical experiment.`
        );
      } else if (message.type === "comparison") {
        setComparison(message.rows);
        setBusy(null);
        inFlightRef.current = false;
        setStatus("Equal-budget four-family physical race complete.");
      } else {
        setError(message.message);
        setBusy(null);
        inFlightRef.current = false;
        setStatus("The owner kernel refused or could not complete this request.");
      }
    };
    optimizerWorker.onerror = (event) => {
      if (!active) return;
      setError(event.message || "The household-arm worker failed before returning a typed result.");
      setBusy(null);
      inFlightRef.current = false;
      setWorkerAvailable(false);
      optimizerWorker.terminate();
      workerRef.current = null;
    };
    optimizerWorker.postMessage({ type: "preview", task: "kitchen-mug" });
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
      "arm",
      bridgeState,
      status,
      {
        generation,
        bestObjective,
        placed: trace?.placed ? "yes" : "no",
      },
    );
  }, [embedded, workerAvailable, error, busy, trace, status, generation, bestObjective]);

  const post = useCallback(
    (message: object, mode: "preview" | "optimize" | "compare") => {
      if (!workerRef.current || busy) return;
      setError(null);
      setBusy(mode);
      workerRef.current.postMessage(message);
    },
    [busy]
  );

  const selectTask = useCallback(
    (nextTask: HouseholdManipulationTask) => {
      if (busy || !workerRef.current || nextTask === task) return;
      setTask(nextTask);
      setTrace(null);
      setAdmission(null);
      setCurriculumTrace(null);
      setComparison(null);
      setGeneration(0);
      setError(null);
      setBusy("preview");
      setStatus(`Loading the ${TASK_COPY[nextTask].setting} benchmark…`);
      workerRef.current.postMessage({ type: "preview", task: nextTask });
    },
    [busy, task]
  );

  const objectiveDelta = trace && curriculumTrace
    ? curriculumTrace.objective - trace.objective
    : null;
  const taskInfo = TASK_COPY[task];

  return (
    <div className={embedded ? "space-y-2" : "space-y-8"}>
      <div
        className={`glass-card overflow-hidden border-orange-400/15 bg-slate-950/80 ${
          embedded ? "p-1" : "p-2 sm:p-3"
        }`}
      >
        <div
          className={`grid gap-2 ${embedded ? "grid-cols-3" : "sm:grid-cols-3"}`}
          role="tablist"
          aria-label="Household manipulation task"
        >
          {(Object.keys(TASK_COPY) as HouseholdManipulationTask[]).map((taskName) => {
            const info = TASK_COPY[taskName];
            const Icon = info.icon;
            const selected = taskName === task;
            return (
              <button
                key={taskName}
                type="button"
                role="tab"
                aria-selected={selected}
                disabled={busy !== null || !workerAvailable}
                onClick={() => selectTask(taskName)}
                className={`border text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  embedded ? "min-h-10 rounded-xl px-2 py-1.5" : "min-h-16 rounded-2xl px-4 py-3"
                } ${
                  selected
                    ? "border-orange-300/35 bg-orange-400/12"
                    : "border-white/8 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${info.accent}`} />
                  <span
                    className={`min-w-0 font-bold text-white line-clamp-2 ${
                      embedded ? "text-xs" : "text-sm"
                    }`}
                  >
                    {embedded ? EMBEDDED_TASK_TITLES[taskName] : info.title}
                  </span>
                </span>
                <span className={embedded ? "sr-only" : "mt-1 block text-xs text-slate-500"}>{info.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={
          embedded ? "block" : "grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(350px,0.55fr)]"
        }
      >
        <div className={embedded ? "space-y-0" : "space-y-4"}>
          <div
            className={`glass-card relative overflow-hidden border-orange-400/15 bg-slate-950/80 ${
              embedded ? "min-h-[calc(100svh-64px)]" : "min-h-[570px]"
            }`}
          >
            {/* Top HUD: stacks vertically on phones; corners ≥sm */}
            <div
              className={`pointer-events-none absolute z-10 flex flex-col gap-2 ${
                embedded ? "inset-x-3 top-3" : "inset-x-5 top-5"
              } sm:flex-row sm:items-start sm:justify-between`}
            >
              {/* Top Toolbar Badges */}
              <div
                className={`pointer-events-auto flex flex-wrap items-center ${
                  embedded ? "gap-1" : "gap-2"
                }`}
              >
                <span
                  className={`max-sm:hidden rounded-full border border-orange-300/25 bg-slate-950/82 font-bold uppercase text-orange-200 backdrop-blur-md ${
                    embedded ? "px-2 py-1 text-[0.58rem] tracking-[0.12em]" : "px-3 py-1 text-[0.68rem] tracking-[0.18em]"
                  }`}
                >
                  8 owner poses · 90 Hz physics
                </span>
                <span
                  className={`rounded-full border border-emerald-300/25 bg-slate-950/82 font-bold uppercase text-emerald-200 backdrop-blur-md ${
                    embedded ? "px-2 py-1 text-[0.58rem] tracking-[0.12em]" : "px-3 py-1 text-[0.68rem] tracking-[0.18em]"
                  }`}
                >
                  {trace?.placed ? "grasp · transport · release verified" : "awaiting owner receipt"}
                </span>

                {/* Microscope Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setMicroscopeMode(!microscopeMode)}
                  className={`flex items-center rounded-full border font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                    embedded ? "gap-1 px-2 py-1 text-[0.58rem]" : "gap-1.5 px-3 py-1 text-[0.68rem]"
                  } ${
                    microscopeMode
                      ? "border-cyan-400 bg-cyan-500/25 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "border-white/20 bg-slate-950/80 text-slate-300 hover:text-white"
                  }`}
                  title="Toggle 3D Coulomb friction cone overlay at contact points"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="sm:hidden">{microscopeMode ? "Cones on" : "Friction cones"}</span>
                  <span className="max-sm:hidden">
                    {embedded
                      ? microscopeMode
                        ? "Friction cones on"
                        : "Friction cones"
                      : microscopeMode
                        ? "🔬 Friction Cones (μ=0.65) Active"
                        : "🔬 Friction Cones Overlay"}
                  </span>
                </button>

                {/* Sound Synthesizer Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(robotAudio.toggleMute())}
                  className={`flex items-center rounded-full border font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                    embedded ? "gap-1 px-2 py-1 text-[0.58rem]" : "gap-1.5 px-3 py-1 text-[0.68rem]"
                  } ${
                    soundEnabled
                      ? "border-emerald-400 bg-emerald-500/25 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      : "border-white/20 bg-slate-950/80 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Toggle Synthesized Contact Acoustics"
                >
                  {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                  <span>{soundEnabled ? "Sound ON" : "Muted"}</span>
                </button>

                {/* Drag Status & Contact Safety Readout */}
                {armDragTarget ? (
                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    <span
                      className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                        armCollisionState.isColliding
                          ? "border border-rose-400/80 bg-rose-950/85 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                          : "border border-emerald-400/80 bg-emerald-950/85 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      }`}
                    >
                      {armCollisionState.isColliding
                        ? `⚠️ Surface Clamped (${armCollisionState.clearance.toFixed(2)}m)`
                        : `🖐️ Target Moved (${armCollisionState.clearance.toFixed(2)}m free)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setArmDragTarget(null)}
                      className="flex items-center gap-1 rounded-full border border-orange-400/40 bg-orange-950/80 px-2.5 py-1 text-[0.68rem] font-bold uppercase text-orange-200 hover:bg-orange-900/60 transition-colors"
                      title="Reset target object to nominal trajectory position"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Camera View Selector */}
              <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/85 p-1 backdrop-blur-md self-start">
                {(
                  [
                    { id: "studio", label: "Studio", icon: Camera },
                    { id: "microscope", label: "Grasp Focus", icon: Eye },
                    { id: "overhead", label: "Top-Down", icon: Activity },
                  ] as const
                ).map((cam) => {
                  const Icon = cam.icon;
                  const isSelected = cameraMode === cam.id;
                  return (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setCameraMode(cam.id)}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem] font-bold transition-all ${
                        isSelected
                          ? "bg-orange-500/30 text-orange-200 border border-orange-400/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {cam.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={`pointer-events-none absolute z-10 flex flex-wrap items-end justify-between gap-2 ${
                embedded ? "bottom-3 left-3 right-3" : "bottom-5 left-5 right-5 max-sm:bottom-3 max-sm:left-3 max-sm:right-3"
              }`}
            >
              <span
                className={`max-w-xl truncate rounded-xl border border-white/10 bg-slate-950/82 text-slate-300 backdrop-blur-md ${
                  embedded
                    ? "px-2.5 py-1.5 text-[0.62rem]"
                    : "px-3 py-2 text-xs leading-5 max-sm:hidden"
                }`}
              >
                {embedded
                  ? "Owner poses · physical grasp · drag to orbit · pinch to zoom"
                  : "Orange links connect source-ordered iiwa joint frames. The amber/green flange ring is owner pad force and grasp state; the cyan cones display Coulomb friction boundaries."}
              </span>
              {!embedded ? (
                <span className="rounded-xl border border-white/10 bg-slate-950/82 px-3 py-2 text-[0.7rem] text-slate-400 backdrop-blur-md">
                  Drag to orbit · pinch to zoom
                </span>
              ) : null}
            </div>
            <div
              ref={stageRef}
              className={embedded ? "h-[calc(100svh-64px)] w-full" : "h-[570px] w-full"}
            >
              {shouldMountStage ? (
                <ArmStage
                  trace={trace}
                  admission={admission}
                  reduceMotion={reduceMotion}
                  microscopeMode={microscopeMode}
                  cameraMode={cameraMode}
                  sampleIndex={sampleIndex}
                  dragTarget={armDragTarget}
                  onDragTargetChange={setArmDragTarget}
                  onCollisionChange={setArmCollisionState}
                />
              ) : null}
            </div>
          </div>

          {/* Tactile Grasp Microscope HUD */}
          {!embedded ? (
            <ArmGraspMicroscopeHUD
              sample={trace ? trace.samples[Math.min(sampleIndex, trace.samples.length - 1)] : null}
              enabled={microscopeMode}
            />
          ) : null}
        </div>

        <div className="glass-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-orange-300/20 bg-orange-400/10 p-3">
              <Bot className="h-6 w-6 text-orange-200" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Frankensim household flagship</p>
              <h3 className="mt-1 text-xl font-bold text-white">Optimize a complete pick-and-place</h3>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-400">
            Seven joint target curves plus one gripper-width curve, each sampled at sixteen knots:
            <span className="mt-2 block font-mono text-orange-200">(7 joints + 1 gripper) × 16 = 128 variables</span>
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            CMA-ES receives only a scalar receipt after a full rollout. Compliant contact, stick/slip friction, free object dynamics, release, hard limits, and owner-routed obstacle/self/object separation make the objective piecewise and black-box—there is no browser gradient hiding behind the animation.
          </p>

          <label htmlFor="arm-family" className="mt-6 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Covariance representation
          </label>
          <select
            id="arm-family"
            value={family}
            disabled={busy !== null || !workerAvailable}
            onChange={(event) => setFamily(event.target.value as CmaFamily)}
            className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-orange-400/60"
          >
            <option value="full">Full CMA-ES — dense covariance</option>
            <option value="separable">Separable CMA-ES — diagonal</option>
            <option value="lm-cma">LM-CMA — bounded directions</option>
            <option value="lm-ma">LM-MA — bounded transform</option>
          </select>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            At 128 dimensions, all four representations fit the honest browser envelope. Full CMA is pedagogically useful here; it is rightly refused for the 5,040-D walking problem.
          </p>

          <label htmlFor="arm-seed" className="mt-5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Declared Philox seed
          </label>
          <select
            id="arm-seed"
            value={seedIndex}
            disabled={busy !== null || !workerAvailable}
            onChange={(event) => setSeedIndex(Number(event.target.value))}
            className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-orange-400/60"
          >
            <option value={0}>Seed 1 · 0x41524d31</option>
            <option value={1}>Seed 2 · 0x41524d32</option>
            <option value={2}>Seed 3 · 0x41524d33</option>
          </select>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <label htmlFor="arm-generations">Search budget (generations)</label>
            <span className="font-mono text-orange-200">
              {generations} × {ARM_POPULATION} = {generations * ARM_POPULATION} rollouts
            </span>
          </div>
          <input
            id="arm-generations"
            type="range"
            min={2}
            max={5000}
            step={2}
            value={generations}
            disabled={busy !== null || !workerAvailable}
            onChange={(event) => setGenerations(Number(event.target.value))}
            aria-valuetext={`${generations} generations, ${generations * ARM_POPULATION} complete physical rollouts`}
            style={{ touchAction: "pan-y pinch-zoom" }}
            suppressHydrationWarning
          />
          <div className="mt-1 flex justify-between text-[0.6rem] font-mono text-slate-400">
            <span>2</span>
            <span>1.25k</span>
            <span>2.5k</span>
            <span>3.75k</span>
            <span>5k</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={busy !== null || !workerAvailable}
              onClick={() =>
                post(
                  { type: "optimize", task, family, generations, seedIndex, mode: "continue" },
                  "optimize"
                )
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 px-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Sparkles className="h-4 w-4" />
              {generation > 0 ? `Continue · gen ${generation}` : "Optimize"}
            </button>
            <button
              type="button"
              disabled={busy !== null || !workerAvailable || !curriculumTrace}
              onClick={() => {
                if (!curriculumTrace) return;
                setTrace(curriculumTrace);
                setActiveTrace("curriculum");
                setGeneration(0);
                setBestObjective(curriculumTrace.objective);
                setStatus(`${taskInfo.title} curriculum replayed from Frankensim WASM.`);
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RotateCcw className="h-4 w-4" />
              Curriculum
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4" aria-live="polite">
            <div className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-200">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${busy ? "animate-pulse bg-orange-300" : error ? "bg-rose-400" : "bg-emerald-400"}`} />
              {status}
            </div>
            {generation > 0 ? (
              <div className="mt-3 flex justify-between gap-3 font-mono text-[0.7rem] text-slate-400">
                <span>generation {generation}</span>
                <span>best {bestObjective === null ? "—" : number(bestObjective, 4)}</span>
              </div>
            ) : null}
            {error ? <p className="mt-3 text-xs leading-5 text-rose-300">{error}</p> : null}
          </div>
        </div>
      </div>

      {trace && admission ? (() => {
        const cards: [string, string | number][] = [
          ["objective ↓", number(trace.objective, 2)],
          ["vs curriculum", activeTrace === "curriculum" ? "reference" : objectiveDelta !== null && objectiveDelta > 0 ? `${number(objectiveDelta, 2)} lower` : "flat"],
          ["final error", `${number(trace.finalObjectErrorMeters * 100, 1)} / ${number(admission.placementToleranceMeters * 100, 1)} cm`],
          ["maximum lift", `${number(trace.maximumLiftMeters * 100, 1)} / ${number(admission.liftTargetMeters * 100, 1)} cm`],
          ["first grasp", `${number(trace.firstGraspTimeSeconds, 2)} s`],
          ["grip force", `${number(trace.peakGripForceNewtons, 1)} N`],
          ["work", `${number(trace.actuatorWorkJoules, 1)} J`],
          ["collision risk ∫", `${number(trace.collisionRiskIntegral, 4)} m·s`],
          ["certified clearance", `${number(trace.minimumCertifiedClearanceMeters * 100, 2)} cm`],
          ["possible collision", `${number(trace.possibleCollisionTimeSeconds, 3)} s`],
          ["convex iterations", trace.collisionQueryIterations.toLocaleString()],
          ["owner verdict", trace.placed ? "placed ✓" : "not placed"],
        ];
        return (
          <div className="space-y-3">
            <div className="hidden md:grid md:grid-cols-4 md:gap-3 xl:grid-cols-12">
              {cards.map(([label, value]) => (
                <div
                  key={label}
                  title={`${label}: ${value}`}
                  className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/55 p-4"
                >
                  <p className="truncate text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                  <p
                    title={String(value)}
                    className={`mt-2 truncate font-mono text-sm ${label === "owner verdict" && trace.placed ? "text-emerald-300" : "text-slate-100"}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {(showAllReceipts ? cards : cards.slice(0, 4)).map(([label, value]) => (
                <div
                  key={label}
                  title={`${label}: ${value}`}
                  className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/55 p-4"
                >
                  <p className="truncate text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                  <p
                    title={String(value)}
                    className={`mt-2 truncate font-mono text-sm ${label === "owner verdict" && trace.placed ? "text-emerald-300" : "text-slate-100"}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAllReceipts((v) => !v)}
              aria-expanded={showAllReceipts}
              className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-slate-200 hover:bg-white/10 md:hidden"
            >
              {showAllReceipts
                ? `Hide ${cards.length - 4} of ${cards.length} telemetry rows`
                : `Show all ${cards.length} telemetry rows`}
            </button>
          </div>
        );
      })() : null}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">All variants · one physical objective</p>
              <h3 className="mt-1 text-xl font-bold text-white">Which covariance model helps at 128-D?</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Run every owner implementation from the identical curriculum, seed, population, and rollout budget. This is a local measurement on one nonsmooth task—not a universal ranking.
              </p>
            </div>
            <button
              type="button"
              disabled={busy !== null || !workerAvailable}
              onClick={() => post({ type: "compare", task, generations: 4 }, "compare")}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet-300/25 bg-violet-400/10 px-4 text-sm font-semibold text-violet-100 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Play className="h-4 w-4" />
              Run physical race
            </button>
          </div>

          {comparison ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="border-b border-white/10 text-slate-500">
                  <tr>
                    <th className="pb-3 font-semibold">owner family</th>
                    <th className="pb-3 font-semibold">curriculum → final best</th>
                    <th className="pb-3 font-semibold">evals</th>
                    <th className="pb-3 font-semibold">persistent / workspace scalars</th>
                    <th className="pb-3 font-semibold">this browser</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.family} className="border-b border-white/5 text-slate-300">
                      <td className={`py-3 font-semibold ${FAMILY_COPY[row.family].color}`}>{FAMILY_COPY[row.family].title}</td>
                      <td className="py-3 font-mono">{number(row.initialObjective, 2)} → {number(row.finalObjective, 2)}</td>
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
                    <Cpu className={`h-4 w-4 ${FAMILY_COPY[name].color}`} />
                    <p className="text-sm font-semibold text-slate-100">{FAMILY_COPY[name].title}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{FAMILY_COPY[name].representation}</p>
                  <p className="mt-1 font-mono text-[0.68rem] text-slate-500">{FAMILY_COPY[name].complexity}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="glass-card p-6">
          <div className="flex items-center gap-2 text-emerald-300">
            <Gauge className="h-5 w-5" />
            <h3 className="font-bold text-white">What is physically real?</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
            <li><strong className="text-slate-200">Source arm:</strong> pinned iiwa topology, masses, inertias, joint frames, axes, hard limits, and 300 N·m reference defaults.</li>
            <li><strong className="text-slate-200">Owner math:</strong> SE(3) kinematics, inverse-dynamics computed torque, Featherstone forward dynamics, compliant pad force, Coulomb friction, and certified convex separation.</li>
            <li><strong className="text-slate-200">Rendered verbatim:</strong> the browser receives object plus eight world poses. It never solves forward kinematics.</li>
            <li><strong className="text-slate-200">Grasp test:</strong> both finite pads must remain engaged while the requested translation and rotation wrench stays inside owner friction capacity.</li>
            <li><strong className="text-slate-200">Reduced contact:</strong> collision uses conservative oriented-box link/object envelopes, not triangle meshes; there is no general impulse solver, grasp planner, deformable object, or cable model.</li>
            <li><strong className="text-slate-200">No hardware claim:</strong> this is a deterministic explainer benchmark, not a KUKA-certified model or sim-to-real controller.</li>
          </ul>
        </aside>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-300" />
            <h3 className="font-bold text-white">A parametric model with a paper trail</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The procedural shell is intentionally mesh-free. Segment endpoints come from owner poses; the table records the pinned source joint-offset magnitude and mass used by dynamics. Orange housings are display geometry; the collision owner independently builds conservative oriented boxes from those source frames.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[440px] text-left text-xs">
              <thead className="bg-white/[0.035] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">source link</th>
                  <th className="px-4 py-3 font-semibold">joint offset magnitude (m)</th>
                  <th className="px-4 py-3 font-semibold">mass (kg)</th>
                </tr>
              </thead>
              <tbody>
                {LINK_SOURCE_ROWS.map(([link, offset, mass]) => (
                  <tr key={link} className="border-t border-white/[0.06] text-slate-300">
                    <td className="px-4 py-2.5 font-mono text-orange-200">{link}</td>
                    <td className="px-4 py-2.5 font-mono">{offset}</td>
                    <td className="px-4 py-2.5 font-mono">{mass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Pinned community-reference source: {" "}
            <a
              href="https://github.com/IFL-CAMP/iiwa_stack/blob/44f9d13c1b444d5dc9fd3e43ba60b7d3b2ea2bbb/iiwa_description/urdf/iiwa7.xacro"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-300 underline decoration-cyan-300/35 underline-offset-4 hover:text-cyan-200"
            >
              iiwa7.xacro at revision 44f9d13
            </a>
            . It is not a KUKA certification artifact.
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <h3 className="font-bold text-white">Why this is a useful black-box flagship</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["1 · Reach and close", "The seven joint splines must align both finite pads with the object while the finger spline is actually closing."],
              ["2 · Earn the grasp", "Frankensim integrates compliant normal force, friction, object translation, and object rotation. Nothing is latched or teleported."],
              ["3 · Lift, route, release", "The object must clear 9 cm, reach the goal tolerance, finish released on support, and avoid owner-reported obstacle, self, and proximal-object collision risk."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm font-semibold text-white">{title}</p>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            The source-feasible curriculum makes the demo inspectable from first paint, while live CMA-ES still searches every coordinate. If a sampled policy drops the object or misses the station, the receipt says so; the renderer cannot substitute a canned success animation.
          </p>
        </div>
      </div>
    </div>
  );
}
