"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  FlyControls,
} from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { armTaskFurniture, CRAFTSMAN_BUNGALOW_1928 } from "../lib/houseScenes";
import { buildFurniture } from "../lib/houseFurniture";
import { ArmLearningLedger } from "./ArmLearningLedger";
import { PolicyExchange } from "./PolicyExchange";
import {
  appendArmLedgerPoint,
  armLedgerPoint,
  type ArmLedgerPoint,
} from "../lib/armLearningLedger";
import {
  decodePolicyFragment,
  policyFragmentFromHash,
  type SharedPolicy,
} from "../lib/g1PolicyShare";
import {
  describeAge,
  isResumable,
  loadTrainingSession,
  saveTrainingSession,
} from "../lib/g1TrainingSession";
import {
  ARM_TABLE_CENTER_X,
  ARM_TABLE_DEPTH,
  ARM_TABLE_THICKNESS,
  ARM_TABLE_WIDTH,
  armCounterSlabObstacle,
  armStageObstacles,
  armStageFurniture,
  armWorkbenchObstacles,
  createHouseNavigationScene,
  conservativeSegmentClearanceToOBB,
  distanceToOBB,
  resolveCameraBoom,
  type MultiObstacleSceneConfig,
  type OrientedBoundingBox,
} from "../lib/houseMultiObstacleKernel";
import { ArmPhysicsDebugOverlay } from "./ArmPhysicsDebugOverlay";
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
  Square,
  TreePine,
  Eye,
  Camera,
  Compass,
  Activity,
  Sliders,
  Shield,
  Pause,
  SkipBack,
  Volume2,
  VolumeX,
  Wrench,
  Download,
} from "lucide-react";
import { FreeFlyHintBanner } from "./FreeFlyHintBanner";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useInView } from "../hooks/useScrollSpy";
import {
  ArmGraspMicroscopeOverlay,
  ArmGraspMicroscopeHUD,
  ArmJointKinematicsStrip,
} from "./ArmGraspMicroscope";
import {
  installFrankenRobotsNativeCommandHandler,
  reportFrankenRobotsEngineState,
  reportFrankenRobotsTraceState,
  type FrankenRobotsPlaybackSpeed,
} from "../lib/frankenrobotsBridge";
import { robotAudio } from "../lib/robotAudioSynthesizer";
import {
  MANIPULABLE_OBJECT_PRESETS,
  computeFerrariCannyGWS,
  solveKukaIK,
  iiwaJointAnglesFromOwnerPoses,
  computeKukaFK,
  clampArmTargetPosition,
  isTargetKukaReachable,
} from "../lib/armInverseKinematics";
import {
  ARM_LINK_RADII,
  detectArmSelfCollisions,
  resolveRenderedGripperContactGeometry,
  type ArmSelfContact,
} from "../lib/armContactPhysics";
import {
  FRANKENSIM_OWNER_KERNEL_VERSION,
  HOUSEHOLD_PLACEMENT_CLEARANCE_METERS,
  type CmaFamily,
  type HouseholdManipulationAdmission,
  type HouseholdManipulationTask,
  type HouseholdManipulationTraceReceipt,
  type HouseholdManipulationTraceSample,
  type HouseholdRobotPose,
} from "../lib/frankensimCmaes";
type ArmTraceOrigin = CmaFamily | "curriculum";

/** Matches the search radius armOptimizationWorker starts a session with. */
const ARM_DEFAULT_SEARCH_SIGMA = 0.001;

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
      continuing?: boolean;
      stopped?: boolean;
      /** Coefficients behind this trace, mirroring the worker's response. */
      policy?: Float64Array;
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

export type ArmPlaybackStep = {
  sampleIndex: number;
  elapsedSeconds: number;
  wrapped: boolean;
};

export function clampArmPlaybackIndex(
  sampleCount: number,
  requestedIndex: number,
): number {
  if (sampleCount <= 0 || !Number.isFinite(requestedIndex)) return 0;
  return Math.min(sampleCount - 1, Math.max(0, Math.round(requestedIndex)));
}

export function advanceArmPlayback(
  sampleTimes: readonly number[],
  currentIndex: number,
  elapsedSeconds: number,
  deltaSeconds: number,
  playbackSpeed: number,
  isPlaying: boolean,
): ArmPlaybackStep {
  if (sampleTimes.length === 0) {
    return { sampleIndex: 0, elapsedSeconds: 0, wrapped: false };
  }

  const safeIndex = clampArmPlaybackIndex(sampleTimes.length, currentIndex);
  const duration = sampleTimes.at(-1) ?? 0;
  const safeElapsed = Number.isFinite(elapsedSeconds)
    ? Math.min(Math.max(elapsedSeconds, 0), Math.max(duration, 0))
    : Math.max(sampleTimes[safeIndex] ?? 0, 0);
  if (!isPlaying || !Number.isFinite(duration) || duration <= 0) {
    return {
      sampleIndex: safeIndex,
      elapsedSeconds: safeElapsed,
      wrapped: false,
    };
  }

  const boundedDelta = Number.isFinite(deltaSeconds)
    ? Math.min(Math.max(deltaSeconds, 0), 0.1)
    : 0;
  const safeSpeed = Number.isFinite(playbackSpeed)
    ? Math.max(playbackSpeed, 0)
    : 0;
  let nextElapsed = safeElapsed + boundedDelta * safeSpeed;
  const wrapped = nextElapsed > duration;
  if (wrapped) nextElapsed %= duration;

  let nextIndex = wrapped ? 0 : safeIndex;
  if ((sampleTimes[nextIndex] ?? 0) > nextElapsed) nextIndex = 0;
  while (
    nextIndex + 1 < sampleTimes.length &&
    (sampleTimes[nextIndex + 1] ?? Number.POSITIVE_INFINITY) <= nextElapsed
  ) {
    nextIndex += 1;
  }
  return { sampleIndex: nextIndex, elapsedSeconds: nextElapsed, wrapped };
}

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
  {
    title: string;
    short: string;
    setting: string;
    accent: string;
    icon: typeof Home;
  }
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
    short: "Attempt caddy placement; collision gate decides",
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
const ARM_LIVE_REPLAY_INTERVAL = 16;
// Clearance used to tint a rendered segment, never to move an owner pose.
const ARM_LINK_CLEARANCE_MARGIN_METERS = 0.015;
function number(value: number, digits = 3): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}

function applyOwnerPose(
  object: THREE.Object3D,
  pose: HouseholdRobotPose,
): void {
  object.position.set(pose.position[0], pose.position[2], -pose.position[1]);
  object.quaternion.set(
    pose.quaternionWxyz[1],
    pose.quaternionWxyz[3],
    -pose.quaternionWxyz[2],
    pose.quaternionWxyz[0],
  );
}

function ownerPositionToThree(
  position: readonly number[],
): [number, number, number] {
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
          <cylinderGeometry
            args={[radius * 0.9, radius, dimensions[2], 28, 1, false]}
          />
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
          <meshStandardMaterial
            color={material}
            transparent={ghost}
            opacity={opacity}
          />
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
              <mesh
                key={z}
                position={[
                  index % 2 === 0 ? -0.014 : 0.014,
                  dimensions[2] * 0.52,
                  z,
                ]}
              >
                <cylinderGeometry args={[0.006, 0.006, 0.004, 12]} />
                <meshStandardMaterial
                  color={index === 0 ? "#ef4444" : "#94a3b8"}
                />
              </mesh>
            ))
          : null}
      </group>
    );
  }
  return (
    <group>
      <mesh
        position={[0, 0, dimensions[1] * 0.2]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow={!ghost}
      >
        <cylinderGeometry
          args={[
            dimensions[0] * 0.18,
            dimensions[0] * 0.22,
            dimensions[1] * 0.58,
            18,
          ]}
        />
        <meshStandardMaterial
          color={ghost ? material : "#78350f"}
          transparent={ghost}
          opacity={opacity}
        />
      </mesh>
      <mesh
        position={[0, 0, -dimensions[1] * 0.25]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow={!ghost}
      >
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

function ArmEnvironment({
  admission,
}: {
  admission: HouseholdManipulationAdmission;
}) {
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
      {/* Work surface. It is offset in -x so it does NOT cover the robot's
          own base: the owner puts link 0 at the stage origin on the floor and
          its work stations 0.24 m up at x ~ -0.53, i.e. a floor-standing arm
          reaching over a low table. Drawn centred on the origin (as it was),
          the slab swallowed the base drum and the first two links, so the arm
          appeared to grow out of the tabletop. */}
      <mesh position={[ARM_TABLE_CENTER_X, supportY - ARM_TABLE_THICKNESS / 2, 0]} receiveShadow castShadow>
        {/* Drawn from the same constants the owner is told about, so the
            surface on screen and the surface in the physics cannot drift. */}
        <boxGeometry args={[ARM_TABLE_WIDTH, ARM_TABLE_THICKNESS, ARM_TABLE_DEPTH]} />
        <meshStandardMaterial
          color={
            task === "backyard-trowel"
              ? "#60452f"
              : task === "kitchen-mug"
                ? "#263241"
                : "#3f3344"
          }
          roughness={0.72}
          metalness={0.08}
        />
      </mesh>

      {task === "kitchen-mug" ? (
        <>
          <mesh position={[ARM_TABLE_CENTER_X, supportY + 0.5, -ARM_TABLE_DEPTH / 2 + 0.035]} receiveShadow>
            <boxGeometry args={[ARM_TABLE_WIDTH, 1.05, 0.07]} />
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
        <HouseholdObject
          task={task}
          dimensions={scene.objectDimensionsMeters}
          ghost
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5 * scene.objectDimensionsMeters[2], 0]}
        >
          <ringGeometry args={[0.075, 0.095, 32]} />
          <meshBasicMaterial
            color="#34d399"
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      <mesh position={obstacle}>
        <boxGeometry args={obstacleSize} />
        <meshBasicMaterial
          color="#fb7185"
          transparent
          opacity={0.075}
          depthWrite={false}
        />
      </mesh>
      <mesh position={obstacle}>
        <boxGeometry args={obstacleSize} />
        <meshBasicMaterial
          color="#fb7185"
          transparent
          opacity={0.42}
          wireframe
        />
      </mesh>
    </group>
  );
}

type ArmPlaybackSeek = { revision: number; sampleIndex: number };

function ArmRig({
  trace,
  admission,
  reduceMotion,
  microscopeMode,
  physicsDebug,
  targetPosition,
  playbackSeek,
  isPlaying,
  playbackSpeed,
  onSampleIndexChange,
  onSelfCollisionChange,
}: {
  trace: HouseholdManipulationTraceReceipt;
  admission: HouseholdManipulationAdmission;
  reduceMotion: boolean;
  microscopeMode: boolean;
  physicsDebug?: boolean;
  targetPosition?: [number, number, number] | null;
  playbackSeek: ArmPlaybackSeek;
  isPlaying: boolean;
  playbackSpeed: number;
  onSampleIndexChange: (sampleIndex: number, revision: number) => void;
  onSelfCollisionChange?: (contacts: ArmSelfContact[]) => void;
}) {
  const linkRefs = useRef<Array<THREE.Group | null>>([]);
  const segmentRefs = useRef<Array<THREE.Mesh | null>>([]);
  const objectRef = useRef<THREE.Group | null>(null);
  const wristHousingRef = useRef<THREE.Group | null>(null);
  const palmRef = useRef<THREE.Mesh | null>(null);
  const leftFingerRef = useRef<THREE.Mesh | null>(null);
  const rightFingerRef = useRef<THREE.Mesh | null>(null);
  const contactRingRef = useRef<THREE.Mesh | null>(null);
  const contactMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const playbackSeconds = useRef(0);
  const sampleIndex = useRef(0);
  const publishedSampleIndex = useRef(-1);
  const [currentSample, setCurrentSample] =
    useState<HouseholdManipulationTraceSample | null>(
      () => trace.samples[0] ?? null,
    );
  // Publish the actual owner link origins used by both the rig and its diagnostics.
  const [renderedForOverlay, setRenderedForOverlay] = useState<
    Array<[number, number, number]>
  >([]);
  const selfContactKeyRef = useRef("");
  const selfHotLinksRef = useRef<Set<number>>(new Set());
  const publishedRenderIndex = useRef(-1);
  const sampleTimes = useMemo(
    () => trace.samples.map((sample) => sample.timeSeconds),
    [trace],
  );
  useLayoutEffect(() => {
    const nextIndex = clampArmPlaybackIndex(
      trace.samples.length,
      playbackSeek.sampleIndex,
    );
    sampleIndex.current = nextIndex;
    playbackSeconds.current = nextIndex === 0 ? 0 : trace.samples[nextIndex]?.timeSeconds ?? 0;
    publishedSampleIndex.current = -1;
  }, [playbackSeek, trace]);
  // Boundary volumes the kernel's objective already avoids: the counter slab,
  // the task's backdrop wall, and the declared obstacle box. The checker below
  // flags visible penetrations of exactly these volumes — presentation-layer
  // truth against the declared scene, not a second physics claim.
  const boundaryBoxes = useMemo(() => {
    const scene = admission.scene;
    const supportY = scene.supportHeightMeters;
    const counter = armCounterSlabObstacle(supportY);
    const boxes: Array<{ name: string; box: THREE.Box3 }> = [
      {
        name: "counter",
        box: new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(...counter.center),
          new THREE.Vector3(...counter.halfExtents).multiplyScalar(2),
        ),
      },
      {
        name: "obstacle",
        box: new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(
            ...ownerPositionToThree(scene.obstacleCenterMeters),
          ),
          new THREE.Vector3(
            2 * scene.obstacleHalfExtentsMeters[0],
            2 * scene.obstacleHalfExtentsMeters[2],
            2 * scene.obstacleHalfExtentsMeters[1],
          ),
        ),
      },
    ];
    return boxes;
  }, [admission]);

  // SOTA multi-obstacle kernel: every furniture piece as an oriented
  // bounding box with proper rotation-aware signed-distance queries.
  // Supplements the Box3 counter/wall check for per-link boundary detection.
  // Exactly the bodies this stage draws for this task, in the stage frame:
  // the task's workbench structures plus the furniture from the rooms the
  // stage renders. The whole-house scene was wrong here — it contains hall
  // furniture that is never drawn beside the workbench yet lands inside the
  // arm's workspace, and it was shoving links and the manipulated object off
  // their owner poses. The owner kernel is handed this same list.
  const multiObstacleScene = useMemo(
    () => ({
      obstacles: armStageObstacles(
        admission.scene.supportHeightMeters,
        admission.config.task,
      ),
    }),
    [admission],
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
    [],
  );

  useFrame((_, deltaSeconds) => {
    const samples = trace.samples;
    if (samples.length === 0) return;
    const next = advanceArmPlayback(
      sampleTimes,
      sampleIndex.current,
      playbackSeconds.current,
      deltaSeconds,
      playbackSpeed,
      isPlaying && !reduceMotion,
    );
    sampleIndex.current = next.sampleIndex;
    playbackSeconds.current = next.elapsedSeconds;
    const sample: HouseholdManipulationTraceSample =
      samples[sampleIndex.current];
    if (publishedSampleIndex.current !== sampleIndex.current) {
      publishedSampleIndex.current = sampleIndex.current;
      setCurrentSample(sample);
      onSampleIndexChange(sampleIndex.current, playbackSeek.revision);
    }
    // Render the measured chain verbatim. Contact diagnostics can tint it,
    // but may not bend the links or relocate the object behind the receipt.
    const renderedPositions = sample.linkPoses.map((pose) =>
      ownerPositionToThree(pose.position),
    );
    for (let link = 0; link < sample.linkPoses.length; link++) {
      const pose = sample.linkPoses[link];
      const group = linkRefs.current[link];
      if (group) {
        applyOwnerPose(group, pose);
      }
      if (link === 0) continue;
      const segment = segmentRefs.current[link - 1];
      if (!segment) continue;
      const parent = renderedPositions[link - 1];
      const child = renderedPositions[link];
      scratch.start.set(parent[0], parent[1], parent[2]);
      scratch.end.set(child[0], child[1], child[2]);
      const segmentRadius = 0.072 - (link - 1) * 0.004;
      const requiredClearance =
        segmentRadius + ARM_LINK_CLEARANCE_MARGIN_METERS;
      const segmentLength = scratch.start.distanceTo(scratch.end);
      // A housing whose swept segment cannot be certified clear of an OBB
      // is flagged, not hidden: the previous behaviour deleted the cylinder
      // and left the arm rendered with gaps, which reads as a broken mesh
      // rather than a contact. The flag is a conservative visual diagnostic,
      // separate from the owner's physical collision receipt.
      const segmentCertified = multiObstacleScene.obstacles.every((obb) => {
        if (obb.exemptFromPenalty) return true;
        const endpointLowerBound =
          Math.min(distanceToOBB(parent, obb), distanceToOBB(child, obb)) -
          segmentLength * 0.5;
        return (
          endpointLowerBound >= requiredClearance ||
          conservativeSegmentClearanceToOBB(parent, child, obb) >=
            requiredClearance
        );
      });
      segment.visible = true;
      const segmentMaterial = segment.material as THREE.MeshPhysicalMaterial;
      if (segmentMaterial.emissive) {
        segmentMaterial.emissive.setHex(segmentCertified ? 0x000000 : 0xb91c1c);
        segmentMaterial.emissiveIntensity = segmentCertified ? 0 : 0.9;
      }
      scratch.direction.subVectors(scratch.end, scratch.start);
      const length = Math.max(0.025, scratch.direction.length());
      scratch.midpoint
        .addVectors(scratch.start, scratch.end)
        .multiplyScalar(0.5);
      scratch.quaternion.setFromUnitVectors(
        scratch.yAxis,
        scratch.direction.multiplyScalar(1 / length),
      );
      segment.position.copy(scratch.midpoint);
      segment.quaternion.copy(scratch.quaternion);
      segment.scale.set(1, length, 1);
    }
    if (publishedRenderIndex.current !== sampleIndex.current) {
      publishedRenderIndex.current = sampleIndex.current;
      setRenderedForOverlay(renderedPositions);
    }
    // Self-collision diagnostic on the owner chain: non-adjacent link
    // spheres that overlap are reported to the HUD and folded into the single
    // link-tint pass below. The kernel receipt has no per-pair self-contact
    // term, so this is the only place a folded elbow driven through the base
    // becomes visible.
    //
    // The tint itself is deliberately NOT written here. There is exactly one
    // writer of link emissive colour (the boundary pass at the end of this
    // frame); a second writer on a different cadence left links stuck red,
    // because whichever ran last won and neither reset the other's links.
    const selfContacts = detectArmSelfCollisions(renderedPositions, ARM_LINK_RADII);
    const selfKey = selfContacts.map((c) => `${c.linkA}-${c.linkB}`).join(",");
    if (selfKey !== selfContactKeyRef.current) {
      selfContactKeyRef.current = selfKey;
      const hot = new Set<number>();
      for (const contact of selfContacts) {
        hot.add(contact.linkA);
        hot.add(contact.linkB);
      }
      selfHotLinksRef.current = hot;
      onSelfCollisionChange?.(selfContacts);
    }
    if (objectRef.current) {
      applyOwnerPose(objectRef.current, sample.objectPose);
    }
    const gripperGeometry = resolveRenderedGripperContactGeometry({
      commandedGripperWidthM: sample.gripperWidthMeters,
      graspHalfWidthM: admission.scene.graspHalfWidthMeters,
      objectHalfHeightM: admission.scene.objectDimensionsMeters[2] * 0.5,
    });
    if (wristHousingRef.current)
      wristHousingRef.current.position.y =
        gripperGeometry.wristHousingCenterOffsetM;
    if (palmRef.current)
      palmRef.current.position.y = gripperGeometry.palmCenterOffsetM;
    if (leftFingerRef.current)
      leftFingerRef.current.position.x =
        -gripperGeometry.fingerCenterHalfWidthM;
    if (rightFingerRef.current)
      rightFingerRef.current.position.x =
        gripperGeometry.fingerCenterHalfWidthM;
    if (contactRingRef.current) {
      const forceScale = 1 + Math.min(1.2, sample.gripNormalForceNewtons / 14);
      contactRingRef.current.scale.setScalar(forceScale);
      contactRingRef.current.visible = sample.gripNormalForceNewtons > 0.01;
    }
    if (contactMaterialRef.current) {
      contactMaterialRef.current.opacity = sample.grasped ? 0.95 : 0.45;
      contactMaterialRef.current.color.setHex(
        sample.grasped ? 0x34d399 : 0xfbbf24,
      );
    }

    let violatingLink = -1;
    let violatingVolume = "";

    // SOTA multi-obstacle OBB query: proper rotated-box signed distance
    // to every furniture piece in the Craftsman catalog. Supplements the
    // Box3 boundary check with rotation-aware OBB distance for all 74
    // furniture pieces.
    let mobViolatingLink = -1;
    let mobVolume = "";
    for (
      let link = 0;
      link < sample.linkPoses.length && mobViolatingLink < 0;
      link++
    ) {
      const p = sample.linkPoses[link].position;
      scratch.probe.set(p[0], p[2], -p[1]);
      for (const obb of multiObstacleScene.obstacles) {
        const dist = distanceToOBB(
          [scratch.probe.x, scratch.probe.y, scratch.probe.z],
          obb,
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
    for (
      let link = 0;
      link < sample.linkPoses.length && violatingLink < 0;
      link++
    ) {
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
    // The single writer of link emissive colour. A link is hot when it either
    // penetrates a declared boundary volume or takes part in a self-contact
    // pair; every other link is explicitly reset, so nothing stays red.
    const violationKey = `${violatingLink < 0 ? "" : `${violatingLink}:${violatingVolume}`}|${selfContactKeyRef.current}`;
    if (
      violationKey !== boundaryStateRef.current.key &&
      frameTick.current % 6 === 0
    ) {
      boundaryStateRef.current.key = violationKey;
      for (let link = 0; link < sample.linkPoses.length; link++) {
        const group = linkRefs.current[link];
        if (!group) continue;
        const hot = link === violatingLink || selfHotLinksRef.current.has(link);
        group.traverse((child) => {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
          if (mat && "emissive" in mat)
            mat.emissive.setHex(hot ? 0xdc2626 : 0x000000);
        });
      }
    }
  });

  return (
    <group>
      {/* iiwa 7 reference segments: tapering silver housings with KUKA-orange
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
          <cylinderGeometry
            args={[0.07 - index * 0.004, 0.072 - index * 0.004, 1, 28]}
          />
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
                <meshStandardMaterial
                  color="#1e293b"
                  roughness={0.32}
                  metalness={0.78}
                />
              </mesh>
              <mesh position={[0, 0.018, 0]} castShadow>
                <cylinderGeometry args={[0.105, 0.125, 0.05, 32]} />
                <meshPhysicalMaterial
                  color="#f97316"
                  roughness={0.25}
                  metalness={0.58}
                  clearcoat={0.45}
                />
              </mesh>
            </>
          ) : (
            <group ref={index === 7 ? wristHousingRef : undefined}>
              {/* iiwa 7 joint drum: black cylindrical housing with the
                  silver end-ring, replacing the generic sphere. */}
              <mesh castShadow>
                <cylinderGeometry
                  args={[
                    index === 7 ? 0.058 : 0.068,
                    index === 7 ? 0.058 : 0.068,
                    0.085,
                    28,
                  ]}
                />
                <meshStandardMaterial
                  color="#1c2430"
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry
                  args={[index === 7 ? 0.052 : 0.061, 0.008, 12, 36]}
                />
                <meshStandardMaterial
                  color="#cbd5e1"
                  metalness={0.9}
                  roughness={0.18}
                />
              </mesh>
            </group>
          )}
          {index === 7 ? (
            <group>
              <mesh ref={palmRef} position={[0, 0.08, 0]} castShadow>
                <boxGeometry args={[0.125, 0.035, 0.075]} />
                <meshStandardMaterial
                  color="#111827"
                  metalness={0.78}
                  roughness={0.28}
                />
              </mesh>
              <mesh ref={leftFingerRef} position={[-0.055, 0, 0]} castShadow>
                <boxGeometry args={[0.014, 0.11, 0.028]} />
                <meshStandardMaterial
                  color="#64748b"
                  metalness={0.55}
                  roughness={0.4}
                />
              </mesh>
              <mesh ref={rightFingerRef} position={[0.055, 0, 0]} castShadow>
                <boxGeometry args={[0.014, 0.11, 0.028]} />
                <meshStandardMaterial
                  color="#64748b"
                  metalness={0.55}
                  roughness={0.4}
                />
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

      <ArmGraspMicroscopeOverlay
        sample={currentSample}
        enabled={microscopeMode}
      />

      <ArmPhysicsDebugOverlay
        enabled={physicsDebug ?? false}
        sample={currentSample}
        admission={admission}
        obstacles={multiObstacleScene.obstacles}
        targetPosition={targetPosition ?? null}
        safeRadius={0.04}
        renderedLinkPositions={renderedForOverlay}
      />
    </group>
  );
}

export type ArmCameraMode =
  "studio" | "microscope" | "overhead" | "side" | "front" | "fly";

const armCameraScratchVec = new THREE.Vector3();

// Volumes the camera must stay out of: the counter slab (camera-only), the
// workbench backsplash and cabinet shared with the kernel obstacle roster,
// and the house walls and furniture so the studio backdrop cannot swallow
// the lens either.
/**
 * Volumes the camera must stay out of, for the task actually on screen: the
 * counter slab, that task's workbench structures, and the house bodies the
 * stage draws behind them. Built per task because the workbench geometry is
 * anchored to the owner's support height, which differs per task.
 */
function armCameraObstacles(
  supportHeightMeters: number,
  task: HouseholdManipulationTask,
): OrientedBoundingBox[] {
  return [
    armCounterSlabObstacle(supportHeightMeters),
    ...armWorkbenchObstacles(supportHeightMeters, task),
    ...createHouseNavigationScene(CRAFTSMAN_BUNGALOW_1928).obstacles,
  ];
}
const ARM_FLY_BOUNDS = { minX: -2.6, maxX: 2.6, minY: 0.2, maxY: 3.6, minZ: -0.75, maxZ: 3.2 };

function ArmCameraRig({
  cameraMode,
  objectPos,
  obstacles,
}: {
  cameraMode: ArmCameraMode;
  objectPos: [number, number, number];
  /** Volumes the lens must not enter, for the task on screen. */
  obstacles: OrientedBoundingBox[];
}) {
  const lookAtRef = useRef(new THREE.Vector3(0, 0.45, 0));
  const controlsRef = useRef<any>(null);
  const studioTarget = useRef<THREE.Vector3 | null>(null);
  // Re-entering the studio orbit from a top-down or free-fly camera would
  // otherwise leave the orbit parked wherever that camera ended; glide
  // back to the authored studio corner instead.
  useEffect(() => {
    if (cameraMode === "studio") {
      studioTarget.current = new THREE.Vector3(1.55, 1.25, 1.8);
    } else {
      studioTarget.current = null;
    }
  }, [cameraMode]);
  useFrame(({ camera }, rawDelta) => {
    const dt = Math.min(Math.max(rawDelta, 0), 0.1);
    const ease = (rate: number) => 1 - Math.exp(-rate * dt);
    if (cameraMode === "studio") {
      const controls = controlsRef.current;
      if (studioTarget.current && controls) {
        controls.object.position.lerp(studioTarget.current, ease(4));
        controls.update();
        if (controls.object.position.distanceTo(studioTarget.current) < 0.02) {
          studioTarget.current = null;
        }
      }
      if (controls) lookAtRef.current.copy(controls.target);
      return;
    }
    if (cameraMode === "microscope") {
      // Boom from the object toward the studio corner, shortened by the
      // swept-sphere sweep so the lens never enters the backsplash, the
      // cabinet, or a house wall when the object sits at the counter's back.
      const lookAt: [number, number, number] = [objectPos[0], objectPos[1], objectPos[2]];
      const candidates: [number, number, number][] = [
        [objectPos[0] + 0.32, objectPos[1] + 0.22, objectPos[2] + 0.32],
        [objectPos[0] - 0.32, objectPos[1] + 0.22, objectPos[2] + 0.32],
        [objectPos[0] + 0.4, objectPos[1] + 0.26, objectPos[2] - 0.1],
        [objectPos[0] - 0.4, objectPos[1] + 0.26, objectPos[2] - 0.1],
      ];
      let best = resolveCameraBoom(lookAt, candidates[0], obstacles, 0.06);
      for (let i = 1; i < candidates.length && best.fraction < 0.999; i++) {
        const alt = resolveCameraBoom(lookAt, candidates[i], obstacles, 0.06);
        if (alt.fraction > best.fraction) best = alt;
      }
      armCameraScratchVec.set(...best.position);
      camera.position.lerp(armCameraScratchVec, ease(4));
      lookAtRef.current.lerp(new THREE.Vector3(...lookAt), ease(6));
      camera.lookAt(lookAtRef.current);
    } else if (cameraMode === "overhead") {
      armCameraScratchVec.set(objectPos[0] * 0.5, 3.2, objectPos[2] * 0.5 + 0.01);
      camera.position.lerp(armCameraScratchVec, ease(4));
      lookAtRef.current.lerp(new THREE.Vector3(objectPos[0] * 0.5, 0.4, objectPos[2] * 0.5), ease(4));
      camera.lookAt(lookAtRef.current);
    } else if (cameraMode === "side") {
      armCameraScratchVec.set(0, 0.85, 1.75);
      camera.position.lerp(armCameraScratchVec, ease(4));
      lookAtRef.current.lerp(new THREE.Vector3(0, 0.45, 0), ease(4));
      camera.lookAt(lookAtRef.current);
    } else if (cameraMode === "front") {
      armCameraScratchVec.set(1.75, 0.85, 0);
      camera.position.lerp(armCameraScratchVec, ease(4));
      lookAtRef.current.lerp(new THREE.Vector3(0, 0.45, 0), ease(4));
      camera.lookAt(lookAtRef.current);
    } else if (cameraMode === "fly") {
      // FlyControls already moved the camera: keep it inside the workbench
      // envelope and above the floor so the operator cannot fly under the
      // hardwood or lose the arm behind the fog.
      camera.position.x = Math.min(ARM_FLY_BOUNDS.maxX, Math.max(ARM_FLY_BOUNDS.minX, camera.position.x));
      camera.position.y = Math.min(ARM_FLY_BOUNDS.maxY, Math.max(ARM_FLY_BOUNDS.minY, camera.position.y));
      camera.position.z = Math.min(ARM_FLY_BOUNDS.maxZ, Math.max(ARM_FLY_BOUNDS.minZ, camera.position.z));
    }
  });

  return cameraMode === "studio" ? (
    <OrbitControls
      ref={controlsRef}
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
  ) : cameraMode === "fly" ? (
    // Free-fly 6-DOF: WASD + Q/E + RMB drag. Bounded to the workbench
    // envelope so the operator can't lose the arm off-camera.
    <FlyControls
      movementSpeed={1.2}
      rollSpeed={0.5}
      dragToLook
      autoForward={false}
    />
  ) : null;
}


function ArmTargetDragger({
  targetPos,
  pinLift = 0.06,
  supportHeight = 0.24,
  basePos = [0, 0, 0],
  obstacles,
  onTargetChange,
  onCollisionChange,
  onUnreachableChange = () => {},
}: {
  targetPos: [number, number, number];
  /** Half-height of the marked object, so the pin clears its top. */
  pinLift?: number;
  /** Owner support plane (counter top) in metres; the drag plane and ring sit on it. */
  supportHeight?: number;
  /** The arm's own base link, for the reachability probe. */
  basePos?: [number, number, number];
  /** The stage bodies the target must stay clear of. */
  obstacles: OrientedBoundingBox[];
  onTargetChange: (pos: [number, number, number] | null) => void;
  onCollisionChange: (col: { isColliding: boolean; clearance: number }) => void;
  onUnreachableChange?: (unreachable: boolean) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const startPointerRef = useRef<[number, number]>([0, 0]);
  const startPosRef = useRef<[number, number, number]>(targetPos);
  const [unreachable, setUnreachable] = useState(false);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setUnreachable(false);
    onUnreachableChange?.(false);
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

    // CONTINUOUS COLLISION DETECTION (CCD) & SURFACE CLAMPING (Y >= support)
    const { clampedTarget, isColliding, minClearance } = clampArmTargetPosition(
      proposed,
      obstacles,
      supportHeight,
      0.04,
    );
    // Reachability: even if the collision clamp moves the target to a
    // free interior point, the arm may not be able to reach it. Verify
    // with a short DLS attempt; if it fails, the proposed position is
    // unreachable in the arm's workspace and the dragger must not
    // propagate it (the previous good armDragTarget stays).
    if (!isTargetKukaReachable(clampedTarget, basePos)) {
      if (!unreachable) {
        setUnreachable(true);
        onUnreachableChange?.(true);
      }
      return;
    }
    if (unreachable) {
      setUnreachable(false);
      onUnreachableChange?.(false);
    }

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

      {/* Holographic Interactive Target Grab Pin above Object: lifted by the
          object's half-height plus the stalk so neither pin nor stalk
          enters the object it marks. */}
      <group position={[targetPos[0], targetPos[1] + pinLift + 0.16, targetPos[2]]}>
        {/* Hit target: the visible pin is a 4.5 cm bead, which is a small
            thing to hit on a touch screen. */}
        <mesh onPointerDown={handlePointerDown}>
          <sphereGeometry args={[0.08, 10, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh castShadow>
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
        position={[targetPos[0], supportHeight + 0.002, targetPos[2]]}
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

/**
 * Ghost reach preview for a dragged target: the browser-side 7-DoF
 * surrogate chain (computeKukaFK / solveKukaIK, the same probe the dragger
 * uses for reachability) drawn as a translucent stick chain from the base
 * to the dragged pin. It answers "could the iiwa get there?" live while
 * the owner trace keeps playing on the solid rig, and is labelled as the
 * auxiliary chain, not the owner kinematics.
 */
function ArmReachPreview({
  target,
  basePos = [0, 0, 0],
}: {
  target: [number, number, number];
  /**
   * The arm's own base link in stage coordinates. The owner reports link 0 at
   * the stage origin for all three tasks; this is NOT the support height (the
   * arm stands on the floor and reaches up over the counter).
   */
  basePos?: [number, number, number];
}) {
  const preview = useMemo(() => {
    const base: [number, number, number] = basePos;
    const angles = solveKukaIK(target, [0, 0.4, 0, -1.2, 0, 0.8, 0], base, 60);
    const { linkPositions, endEffector } = computeKukaFK(angles, base);
    const residual = Math.hypot(
      target[0] - endEffector[0],
      target[1] - endEffector[1],
      target[2] - endEffector[2],
    );
    return { linkPositions, endEffector, reachable: residual < 0.02, residual };
  }, [target, basePos]);
  const color = preview.reachable ? "#22d3ee" : "#f43f5e";
  const segments = preview.linkPositions.slice(1).map((end, index) => {
    const start = preview.linkPositions[index];
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const length = Math.max(0.01, s.distanceTo(e));
    const mid = s.clone().add(e).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      e.clone().sub(s).normalize(),
    );
    return { key: index, mid, quaternion, length };
  });
  return (
    <group>
      {segments.map((segment) => (
        <mesh key={segment.key} position={segment.mid} quaternion={segment.quaternion}>
          <cylinderGeometry args={[0.014, 0.014, segment.length, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}
      {preview.linkPositions.map((p, index) => (
        <mesh key={`joint-${index}`} position={p}>
          <sphereGeometry args={[0.022, 12, 10]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} depthWrite={false} />
        </mesh>
      ))}
      {/* Residual: from where the surrogate can reach to where the pin is. */}
      {preview.residual > 0.004 ? (
        <mesh
          position={[
            (preview.endEffector[0] + target[0]) / 2,
            (preview.endEffector[1] + target[1]) / 2,
            (preview.endEffector[2] + target[2]) / 2,
          ]}
          quaternion={new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(
              target[0] - preview.endEffector[0],
              target[1] - preview.endEffector[1],
              target[2] - preview.endEffector[2],
            ).normalize(),
          )}
        >
          <cylinderGeometry args={[0.005, 0.005, preview.residual, 6]} />
          <meshBasicMaterial color="#f43f5e" transparent opacity={0.9} depthWrite={false} />
        </mesh>
      ) : null}
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
  isPlaying,
  playbackSpeed,
  playbackSeek,
  onSampleIndexChange,
  dragTarget,
  onDragTargetChange,
  onCollisionChange,
  onUnreachableChange,
  onSelfCollisionChange,
  physicsDebug,
  allowVerticalPageScroll,
}: {
  trace: HouseholdManipulationTraceReceipt | null;
  admission: HouseholdManipulationAdmission | null;
  reduceMotion: boolean;
  microscopeMode: boolean;
  cameraMode: ArmCameraMode;
  sampleIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  playbackSeek: ArmPlaybackSeek;
  onSampleIndexChange: (sampleIndex: number, revision: number) => void;
  onSelfCollisionChange?: (contacts: ArmSelfContact[]) => void;
  dragTarget?: [number, number, number] | null;
  onDragTargetChange?: (pos: [number, number, number] | null) => void;
  onCollisionChange?: (col: {
    isColliding: boolean;
    clearance: number;
  }) => void;
  onUnreachableChange?: (unreachable: boolean) => void;
  physicsDebug: boolean;
  allowVerticalPageScroll: boolean;
}) {
  const currentSample = trace
    ? trace.samples[Math.min(sampleIndex, trace.samples.length - 1)]
    : null;
  const rawObjectPos: [number, number, number] = currentSample
    ? [
        currentSample.objectPose.position[0],
        currentSample.objectPose.position[2],
        -currentSample.objectPose.position[1],
      ]
    : [0.4, 0.82, 0.2];

  const objectPos: [number, number, number] = dragTarget ?? rawObjectPos;
  // The arm's own base link, straight from the owner trace, so the reach
  // ghost and the reachability probe share the real robot's origin.
  const armBasePos = useMemo<[number, number, number]>(
    () =>
      currentSample
        ? ownerPositionToThree(currentSample.linkPoses[0].position)
        : [0, 0, 0],
    [currentSample],
  );
  const stageObstacles = useMemo(
    () =>
      admission
        ? armStageObstacles(
            admission.scene.supportHeightMeters,
            admission.config.task,
          )
        : [],
    [admission],
  );
  const cameraObstacles = useMemo(
    () =>
      admission
        ? armCameraObstacles(
            admission.scene.supportHeightMeters,
            admission.config.task,
          )
        : [],
    [admission],
  );

  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows
      // Studio OrbitControls normally owns every one-finger touch. In the
      // native full-lab route that made a full-viewport stage an impassable
      // scroll trap. Keep horizontal orbit gestures, but reserve vertical
      // pans for reaching the timeline, optimizer, policies, and receipts.
      style={allowVerticalPageScroll ? { touchAction: "pan-y" } : undefined}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.3;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <color attach="background" args={["#16120e"]} />
      <fog attach="fog" args={["#16120e", 5.0, 14.0]} />
      <PerspectiveCamera
        makeDefault
        position={[1.55, 1.25, 1.8]}
        fov={38}
        near={0.03}
        far={30}
      />
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
      <spotLight
        position={[-2.3, 2.8, 1.1]}
        intensity={12}
        angle={0.42}
        penumbra={0.85}
        color="#f59e0b"
      />
      <spotLight
        position={[1.4, 1.8, -2.2]}
        intensity={7}
        angle={0.38}
        penumbra={0.9}
        color="#fdba74"
      />

      {/* 1928 Sears Craftsman Bungalow Oak Hardwood Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial
          color="#6b3a16"
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>

      {(() => {
        const placement = admission
          ? armTaskFurniture(admission.config.task)
          : null;
        const obstacleName = placement?.obstacle.name;
        const pieces = armStageFurniture(admission?.config.task ?? "kitchen-mug");
        return pieces.map((f) => {
          const isObstacle = f.name === obstacleName;
          const { group: furnGroup } = buildFurniture(
            f.name,
            f.size[0],
            f.size[1],
            f.height,
          );
          return (
            <group
              key={f.name}
              position={[f.center[0], 0, f.center[1]]}
              rotation={[0, -f.rotation, 0]}
            >
              <primitive object={furnGroup} />
              {isObstacle ? (
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
                  <torusGeometry args={[0.09, 0.007, 8, 36]} />
                  <meshBasicMaterial
                    color="#fb7185"
                    transparent
                    opacity={0.55}
                  />
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
          physicsDebug={physicsDebug}
          targetPosition={objectPos}
          playbackSeek={playbackSeek}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          onSampleIndexChange={onSampleIndexChange}
          onSelfCollisionChange={onSelfCollisionChange}
        />
      ) : null}

      <ArmTargetDragger
        targetPos={objectPos}
        pinLift={admission ? admission.scene.objectDimensionsMeters[2] * 0.5 : 0.06}
        supportHeight={admission ? admission.scene.supportHeightMeters : 0.24}
        basePos={armBasePos}
        obstacles={stageObstacles}
        onTargetChange={onDragTargetChange ?? (() => {})}
        onCollisionChange={onCollisionChange ?? (() => {})}
        onUnreachableChange={onUnreachableChange}
      />

      {dragTarget ? (
        <ArmReachPreview target={dragTarget} basePos={armBasePos} />
      ) : null}

      <ArmCameraRig
        cameraMode={cameraMode}
        objectPos={objectPos}
        obstacles={cameraObstacles}
      />
    </Canvas>
  );
}

export function HouseholdArmFlagship({
  embedded = false,
}: { embedded?: boolean } = {}) {
  const requestedReducedMotion = useReducedMotion() ?? false;
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setReduceMotion(requestedReducedMotion);
    });
    return () => {
      active = false;
    };
  }, [requestedReducedMotion]);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const diagnosticsRef = useRef<HTMLDivElement | null>(null);
  const shouldMountStage = useInView(stageRef, {
    rootMargin: "600px 0px 600px 0px",
  });
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
  const [trace, setTrace] = useState<HouseholdManipulationTraceReceipt | null>(
    null,
  );
  const [curriculumTrace, setCurriculumTrace] =
    useState<HouseholdManipulationTraceReceipt | null>(null);
  const [admission, setAdmission] =
    useState<HouseholdManipulationAdmission | null>(null);
  const [task, setTask] = useState<HouseholdManipulationTask>("kitchen-mug");
  const [family, setFamily] = useState<CmaFamily>("lm-cma");
  const [seedIndex, setSeedIndex] = useState(0);
  const [generation, setGeneration] = useState(0);
  // Physical measurements of each replayed policy, and the coefficients behind
  // whatever is on stage, so the arm can show what it learned and keep it.
  const [ledger, setLedger] = useState<ArmLedgerPoint[]>([]);
  const [stagePolicy, setStagePolicy] = useState<Float64Array | null>(null);
  const trainingStartedAtRef = useRef<number | null>(null);
  const trainingSecondsRef = useRef(0);
  const [trainingSeconds, setTrainingSeconds] = useState(0);
  // The search radius the worker is actually using, recorded from its progress
  // messages so an exported policy carries the run it came from. Seeded with
  // the worker's own default rather than 0, because a policy exported before
  // the first generation still came from a run that would use this radius.
  const [searchSigma, setSearchSigma] = useState(ARM_DEFAULT_SEARCH_SIGMA);
  // Policy recovered from storage, used as the mean when training restarts
  // after a reload; and the notice telling the operator that happened.
  const resumedPolicyRef = useRef<Float64Array | null>(null);
  // Read inside the worker message handler, which must not re-subscribe every
  // time a control moves.
  const familyRef = useRef(family);
  const sigmaRef = useRef(searchSigma);
  const taskRef = useRef(task);
  const recoveryAttemptedRef = useRef(false);
  // A policy arriving in the URL cannot be read until the owner has told us how
  // long a policy is. It waits here, and outranks whatever is in storage.
  const pendingShareRef = useRef<string | null>(null);
  // Late-bound: both handlers are declared below this effect, and it must not
  // re-run every time they are recreated.
  const selectTaskRef = useRef<((task: HouseholdManipulationTask) => void) | null>(null);
  const handlePolicyImportRef = useRef<((imported: SharedPolicy) => void) | null>(null);
  const [restoredNotice, setRestoredNotice] = useState<string | null>(null);
  useEffect(() => {
    familyRef.current = family;
    sigmaRef.current = searchSigma;
    taskRef.current = task;
  }, [family, searchSigma, task]);
  const [bestObjective, setBestObjective] = useState<number | null>(null);
  const [activeTrace, setActiveTrace] = useState<ArmTraceOrigin>("curriculum");
  const [comparison, setComparison] = useState<ComparisonRow[] | null>(null);
  const [busy, setBusy] = useState<"preview" | "optimize" | "compare" | null>(
    "preview",
  );
  const [stopRequested, setStopRequested] = useState(false);
  const [workerAvailable, setWorkerAvailable] = useState(true);
  const [status, setStatus] = useState(
    "Loading the pinned KUKA model and physical curriculum…",
  );
  const [error, setError] = useState<string | null>(null);
  // Mobile: show the 4 most consequential receipt cards by default; user can
  // expand to all 12 so the page doesn't drown the viewport in telemetry.
  const [showAllReceipts, setShowAllReceipts] = useState(false);
  const [microscopeMode, setMicroscopeMode] = useState(false);
  const [cameraMode, setCameraMode] = useState<ArmCameraMode>("studio");
  const [sampleIndex, setSampleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<FrankenRobotsPlaybackSpeed>(1);
  const nativeTraceReportAtRef = useRef(0);
  const nativeTraceSettingsRef = useRef("");
  const [playbackSeek, setPlaybackSeek] = useState<ArmPlaybackSeek>({ revision: 0, sampleIndex: 0 });
  const playbackRevisionRef = useRef(0);
  const seekPlayback = useCallback((index: number) => {
    const revision = ++playbackRevisionRef.current;
    setPlaybackSeek({ revision, sampleIndex: index });
    setSampleIndex(index);
  }, []);
  const handleSampleIndexChange = useCallback((index: number, revision: number) => {
    // The Canvas is a separate React root. A frame queued before Restart or
    // a scrub must not overwrite the newer command with its old position.
    // Published positions update the HUD; only explicit seeks drive the rig.
    if (revision === playbackRevisionRef.current) setSampleIndex(index);
  }, []);
  const [armDragTarget, setArmDragTarget] = useState<
    [number, number, number] | null
  >(null);
  // armDragTarget stays null until the operator actually drags the pin.
  // While null the pin rides on the live owner object pose (which is
  // already on or above the counter), so nothing is seeded on mount and
  // the "Target Moved" chip cannot appear before a real drag. The earlier
  // mount-time seed froze the pin at the first-frame object position while
  // the mug moved on without it.
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [armCollisionState, setArmCollisionState] = useState<{
    isColliding: boolean;
    clearance: number;
  }>({ isColliding: false, clearance: 1.0 });
  const [armUnreachable, setArmUnreachable] = useState(false);
  const [armSelfContacts, setArmSelfContacts] = useState<ArmSelfContact[]>([]);
  const [physicsDebug, setPhysicsDebug] = useState(false);

  const handleExportTelemetry = useCallback(() => {
    if (!trace) return;
    const telemetryData = {
      exportTimestamp: new Date().toISOString(),
      ownerAdmission: admission,
      task,
      family,
      generation,
      bestObjective,
      placed: trace.placed,
      everGrasped: trace.everGrasped,
      finalObjectErrorMeters: trace.finalObjectErrorMeters,
      minimumReachErrorMeters: trace.minimumReachErrorMeters,
      maximumLiftMeters: trace.maximumLiftMeters,
      actuatorWorkJoules: trace.actuatorWorkJoules,
      peakGripForceNewtons: trace.peakGripForceNewtons,
      graspDurationSeconds: trace.graspDurationSeconds,
      minimumCertifiedClearanceMeters: trace.minimumCertifiedClearanceMeters,
      samples: trace.samples.map((s) => ({
        timeSeconds: s.timeSeconds,
        gripperWidthMeters: s.gripperWidthMeters,
        gripNormalForceNewtons: s.gripNormalForceNewtons,
        grasped: s.grasped,
        objectPosition: s.objectPose.position,
        objectQuaternion: s.objectPose.quaternionWxyz,
        linkPoses: s.linkPoses.map((lp) => ({
          position: lp.position,
          quaternion: lp.quaternionWxyz,
        })),
      })),
    };
    const blob = new Blob([JSON.stringify(telemetryData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kuka-arm-telemetry-${task}-${family}-gen${generation}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported manipulation trajectory telemetry JSON receipt.");
  }, [trace, admission, task, family, generation, bestObjective]);

  useEffect(() => {
    if (!workerActivated) return;
    let active = true;
    let optimizerWorker: Worker;
    try {
      optimizerWorker = new Worker(
        new URL("../workers/armOptimizationWorker.ts", import.meta.url),
        {
          type: "module",
          name: "frankensim-household-arm-optimizer",
        },
      );
    } catch (workerError) {
      const message =
        workerError instanceof Error
          ? workerError.message
          : String(workerError);
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
        setSearchSigma(message.sigma);
        if (trainingStartedAtRef.current === null) trainingStartedAtRef.current = Date.now();
        setTrainingSeconds(
          trainingSecondsRef.current + (Date.now() - trainingStartedAtRef.current) / 1000,
        );
        setStatus(message.continuous
          ? `${FAMILY_COPY[message.family].title}: generation ${message.generation} · learning until you press Stop · σ ${message.sigma.toExponential(2)}`
          : `${FAMILY_COPY[message.family].title}: generation ${message.generation}/${message.maxGenerations}, σ ${message.sigma.toExponential(2)}`,
        );
      } else if (message.type === "trace") {
        setTrace(message.trace);
        setAdmission(message.admission);
        seekPlayback(0);
        setIsPlaying(true);
        if (message.family === "curriculum") setCurriculumTrace(message.trace);
        setActiveTrace(message.family);
        setGeneration(message.generation);
        setBestObjective(message.trace.objective);
        if (message.policy) setStagePolicy(message.policy);
        setLedger((previous) => {
          const next = appendArmLedgerPoint(
            previous,
            armLedgerPoint(message.trace, message.generation),
          );
          // Persist the run so a reload does not throw away the search. Only
          // real search is worth recovering; generation 0 is the curriculum
          // policy the page loads anyway.
          if (message.policy && message.generation > 0) {
            saveTrainingSession(
              {
                kernelVersion: FRANKENSIM_OWNER_KERNEL_VERSION,
                task: message.admission.config.task,
                challenge: "household",
                family: familyRef.current,
                sigma: sigmaRef.current,
                generation: message.generation,
                trainingSeconds:
                  trainingSecondsRef.current +
                  (trainingStartedAtRef.current === null
                    ? 0
                    : (Date.now() - trainingStartedAtRef.current) / 1000),
                policy: message.policy,
                ledger: next,
              },
              "arm",
            );
          }
          return next;
        });
        if (message.continuing) {
          setStatus(`Learning continuously · generation ${message.generation} best policy now on stage.`);
          return;
        }
        // Bank the elapsed search time: the run has ended until the next
        // generation arrives.
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
            ? `${TASK_COPY[message.admission.config.task].title} curriculum replayed from Frankensim WASM.`
            : `Best ${FAMILY_COPY[message.family].title} policy replayed through the identical physical experiment.`,
        );
      } else if (message.type === "comparison") {
        setComparison(message.rows);
        if (message.complete) {
          setBusy(null);
          inFlightRef.current = false;
          setStatus("Equal-budget four-family physical race complete.");
        }
      } else {
        setError(message.message);
        setBusy(null);
        setStopRequested(false);
        inFlightRef.current = false;
        setStatus(
          "The owner kernel refused or could not complete this request.",
        );
      }
    };
    optimizerWorker.onerror = (event) => {
      if (!active) return;
      setError(
        event.message ||
          "The household-arm worker failed before returning a typed result.",
      );
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
  }, [workerActivated, seekPlayback]);

  useEffect(() => {
    if (!embedded) return;
    let bridgeState: "loading" | "ready" | "running" | "failed";
    if (!workerAvailable) bridgeState = "failed";
    else if (busy === "preview") bridgeState = "loading";
    else if (busy) bridgeState = "running";
    else if (trace || error) bridgeState = "ready";
    else bridgeState = "loading";
    reportFrankenRobotsEngineState("arm", bridgeState, status, {
      generation,
      bestObjective,
      placed: trace?.placed ?? null,
      certifiedClearanceMeters: trace?.minimumCertifiedClearanceMeters ?? null,
      collisionRiskIntegral: trace?.collisionRiskIntegral ?? null,
      possibleCollisionTimeSeconds: trace?.possibleCollisionTimeSeconds ?? null,
      activeArmTask: task,
      activeFamily: family,
    });
  }, [
    embedded,
    workerAvailable,
    error,
    busy,
    trace,
    status,
    generation,
    bestObjective,
    task,
    family,
  ]);

  const post = useCallback(
    (message: object, mode: "preview" | "optimize" | "compare") => {
      if (!workerRef.current) return;
      // Synchronous gate — must precede setBusy (which is async). The
      // earlier busy-only check let two rapid clicks in the same render
      // tick both postMessage. Mirrors the G1WalkingFlagship fix.
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setError(null);
      setBusy(mode);
      workerRef.current.postMessage(message);
    },
    [],
  );

  const startContinuousOptimization = useCallback(() => {
    setStopRequested(false);
    post(
      {
        type: "optimize",
        task,
        family,
        generations: ARM_LIVE_REPLAY_INTERVAL,
        // Only used for a session the worker does not already hold: after a
        // reload there is none, so training picks up from the recovered policy
        // instead of restarting at the curriculum seed.
        resumeFrom: resumedPolicyRef.current ?? undefined,
        seedIndex,
        mode: "continue",
        continuous: true,
      },
      "optimize",
    );
  }, [post, task, family, seedIndex]);

  useEffect(() => {
    pendingShareRef.current = policyFragmentFromHash(window.location.hash);
  }, []);

  // A shared policy in the URL. Decoded once the owner is loaded, and replayed
  // on the task it was trained for — a trowel policy opens the trowel, not
  // whichever task the page happened to start on.
  useEffect(() => {
    const fragment = pendingShareRef.current;
    if (!fragment || !stagePolicy) return;
    // The import handler refuses while the owner is busy. Leave the fragment
    // pending and let the next stage policy re-run this, rather than reporting
    // a broken link because the page happened to still be loading.
    if (inFlightRef.current) return;
    let active = true;
    void decodePolicyFragment(fragment, stagePolicy.length)
      .then((imported) => {
        if (!active) return;
        const importedTask = (Object.keys(TASK_COPY) as HouseholdManipulationTask[])
          .find((task) => task === imported.task);
        if (!importedTask || imported.challenge !== "household") {
          throw new Error("This shared policy is not for a supported household task.");
        }
        if (importedTask !== taskRef.current) {
          // Switch first; this effect runs again once that task's owner is up.
          selectTaskRef.current?.(importedTask);
          return;
        }
        pendingShareRef.current = null;
        setStatus(
          `Loaded a shared generation-${imported.generation} policy from this link. Replaying it…`,
        );
        handlePolicyImportRef.current?.(imported);
      })
      .catch((error: unknown) => {
        if (!active) return;
        pendingShareRef.current = null;
        setError(error instanceof Error ? error.message : "This share link could not be read.");
      });
    return () => {
      active = false;
    };
  }, [stagePolicy]);

  // Recover a run the tab was in the middle of, once the owner has told us how
  // long a policy is. Guarded by a ref so a re-render cannot restore twice.
  useEffect(() => {
    if (recoveryAttemptedRef.current || !stagePolicy) return;
    // An explicit link outranks whatever storage happens to hold.
    if (pendingShareRef.current) return;
    recoveryAttemptedRef.current = true;
    const saved = loadTrainingSession<ArmLedgerPoint>(
      stagePolicy.length,
      "arm",
      (point): point is ArmLedgerPoint =>
        !!point &&
        typeof point === "object" &&
        typeof (point as ArmLedgerPoint).generation === "number" &&
        Number.isFinite((point as ArmLedgerPoint).generation) &&
        Number.isFinite((point as ArmLedgerPoint).placementErrorMeters) &&
        Number.isFinite((point as ArmLedgerPoint).energyJoules),
      taskRef.current,
      "household",
    );
    if (!saved) return;
    if (!isResumable(saved, FRANKENSIM_OWNER_KERNEL_VERSION, taskRef.current, "household")) {
      return;
    }
    resumedPolicyRef.current = saved.policy;
    trainingSecondsRef.current = saved.trainingSeconds;
    // Deferred: setting state synchronously inside an effect cascades renders.
    queueMicrotask(() => {
      setTrainingSeconds(saved.trainingSeconds);
      setLedger(saved.ledger.slice());
      setRestoredNotice(
        `Recovered your run from ${describeAge(saved.savedAt)} — generation ${saved.generation.toLocaleString()}.`,
      );
    });
    post(
      { type: "replay", task: taskRef.current, policy: saved.policy, generation: saved.generation },
      "preview",
    );
  }, [stagePolicy, post]);

  /** Replay a policy the operator brought in, from a file or a share link. */
  const handlePolicyImport = useCallback(
    (imported: SharedPolicy) => {
      // Refuse loudly while the owner is busy. `post` drops a request silently
      // when one is in flight, so without this the panel would start describing
      // the imported policy while the stage kept replaying the old one — a
      // receipt attached to coefficients that never ran. The walking page
      // already refuses this way.
      if (!workerRef.current || inFlightRef.current) {
        throw new Error("Finish or stop the current run before loading a policy.");
      }
      setStagePolicy(imported.policy);
      post({ type: "replay", task, policy: imported.policy, generation: imported.generation }, "preview");
    },
    [post, task],
  );

  const stopContinuousOptimization = useCallback(() => {
    if (!workerRef.current || busy !== "optimize" || stopRequested) return;
    setStopRequested(true);
    setStatus("Stopping after the current physical generation…");
    workerRef.current.postMessage({ type: "stop", task, family, seedIndex });
  }, [busy, stopRequested, task, family, seedIndex]);

  useEffect(() => {
    if (!embedded) return;
    return installFrankenRobotsNativeCommandHandler("arm", (command) => {
      if (command.command === "set-overlay") {
        if (command.overlay === "friction-cones" && command.enabled !== undefined) {
          setMicroscopeMode(command.enabled);
          return {
            accepted: true,
            detail: `Arm friction cones are ${command.enabled ? "on" : "off"}.`,
          };
        }
        if (command.overlay === "physics-debug" && command.enabled !== undefined) {
          setPhysicsDebug(command.enabled);
          return {
            accepted: true,
            detail: `Arm collision envelopes are ${command.enabled ? "on" : "off"}.`,
          };
        }
        return { accepted: false, detail: "The Arm overlay was not provided." };
      }
      if (command.command === "set-camera") {
        const selectedCamera = command.camera;
        if (
          selectedCamera !== "studio" &&
          selectedCamera !== "microscope" &&
          selectedCamera !== "overhead" &&
          selectedCamera !== "side" &&
          selectedCamera !== "front" &&
          selectedCamera !== "fly"
        ) {
          return { accepted: false, detail: "The Arm camera was not provided." };
        }
        setCameraMode(selectedCamera);
        return { accepted: true, detail: `Accepted ${selectedCamera} camera.` };
      }
      if (command.command === "replay") {
        if (busy !== null || inFlightRef.current) {
          return { accepted: false, detail: "Finish or stop the current owner request first." };
        }
        if (!curriculumTrace) {
          return { accepted: false, detail: "The Arm curriculum trace is not ready." };
        }
        setTrace(curriculumTrace);
        seekPlayback(0);
        setIsPlaying(true);
        setActiveTrace("curriculum");
        setGeneration(0);
        setBestObjective(curriculumTrace.objective);
        setStatus(`${TASK_COPY[task].title} curriculum replayed from Frankensim WASM.`);
        return { accepted: true, detail: "Accepted Arm curriculum replay from frame one." };
      }
      if (command.command === "play" || command.command === "pause") {
        if (!trace) {
          return { accepted: false, detail: "The Arm trace is not ready." };
        }
        const playing = command.command === "play";
        setIsPlaying(playing);
        return { accepted: true, detail: playing ? "Arm replay is playing." : "Arm replay is paused." };
      }
      if (command.command === "seek") {
        if (!trace || command.sampleIndex === undefined || command.sampleIndex >= trace.samples.length) {
          return { accepted: false, detail: "That Arm replay frame is unavailable." };
        }
        seekPlayback(command.sampleIndex);
        setIsPlaying(false);
        return {
          accepted: true,
          detail: `Arm replay moved to frame ${command.sampleIndex + 1} of ${trace.samples.length}.`,
        };
      }
      if (command.command === "set-speed") {
        if (!trace || command.speed === undefined) {
          return { accepted: false, detail: "The Arm replay speed is unavailable." };
        }
        setPlaybackSpeed(command.speed);
        return { accepted: true, detail: `Arm replay speed is ${command.speed}×.` };
      }
      if (!workerAvailable || !workerRef.current) {
        return { accepted: false, detail: "The arm owner worker is not ready." };
      }
      if (command.command === "select-task") {
        if (busy !== null || inFlightRef.current) {
          return { accepted: false, detail: "Finish or stop the current owner request first." };
        }
        const selectedTask = command.task;
        if (
          selectedTask !== "kitchen-mug" &&
          selectedTask !== "living-room-remote" &&
          selectedTask !== "backyard-trowel"
        ) {
          return { accepted: false, detail: "The household task was not provided." };
        }
        if (selectedTask === task) {
          return { accepted: true, detail: `${TASK_COPY[task].title} is already active.` };
        }
        const selectOwnerTask = selectTaskRef.current;
        if (!selectOwnerTask) {
          return { accepted: false, detail: "The arm task owner is not ready." };
        }
        selectOwnerTask(selectedTask);
        return {
          accepted: true,
          detail: `Accepted ${TASK_COPY[selectedTask].title}; loading its physical benchmark.`,
        };
      }
      if (command.command === "select-family") {
        if (busy !== null || inFlightRef.current) {
          return { accepted: false, detail: "Finish or stop the current owner request first." };
        }
        const selectedFamily = command.family;
        if (
          selectedFamily !== "full" &&
          selectedFamily !== "separable" &&
          selectedFamily !== "lm-cma" &&
          selectedFamily !== "lm-ma"
        ) {
          return { accepted: false, detail: "The optimizer family was not provided." };
        }
        if (selectedFamily === family) {
          return { accepted: true, detail: `${FAMILY_COPY[family].title} is already selected.` };
        }
        familyRef.current = selectedFamily;
        setFamily(selectedFamily);
        return {
          accepted: true,
          detail: `Accepted ${FAMILY_COPY[selectedFamily].title} for the next owner learning run.`,
        };
      }
      if (command.command === "stop") {
        if (busy !== "optimize") {
          return { accepted: false, detail: "No arm learning run is active." };
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
    task,
    family,
    trace,
    curriculumTrace,
    seekPlayback,
    microscopeMode,
    physicsDebug,
  ]);

  useEffect(() => {
    if (!embedded) return;
    const now = performance.now();
    const settings = `${trace?.samples.length ?? 0}:${isPlaying}:${playbackSpeed}:${cameraMode}:${microscopeMode}:${physicsDebug}`;
    const settingsChanged = settings !== nativeTraceSettingsRef.current;
    if (!settingsChanged && trace && isPlaying && now - nativeTraceReportAtRef.current < 100) return;
    nativeTraceReportAtRef.current = now;
    nativeTraceSettingsRef.current = settings;
    reportFrankenRobotsTraceState("arm", {
      sampleIndex: trace ? clampArmPlaybackIndex(trace.samples.length, sampleIndex) : 0,
      sampleCount: trace?.samples.length ?? 0,
      playing: Boolean(trace) && isPlaying,
      speed: playbackSpeed,
      camera: cameraMode,
      overlays: [
        ...(microscopeMode ? (["friction-cones"] as const) : []),
        ...(physicsDebug ? (["physics-debug"] as const) : []),
      ],
    });
  }, [embedded, trace, sampleIndex, isPlaying, playbackSpeed, cameraMode, microscopeMode, physicsDebug]);

  const selectTask = useCallback(
    (nextTask: HouseholdManipulationTask) => {
      if (!workerRef.current) return;
      if (inFlightRef.current) return;
      if (nextTask === task) return;
      inFlightRef.current = true;
      setTask(nextTask);
      setTrace(null);
      setAdmission(null);
      seekPlayback(0);
      setIsPlaying(false);
      setCurriculumTrace(null);
      setComparison(null);
      setArmDragTarget(null);
      setArmUnreachable(false);
      setArmCollisionState({ isColliding: false, clearance: 1.0 });
      // The ledger is per-task: mug points and trowel points are measurements of
      // different problems, and keeping both would compare each task's progress
      // against the other task's seed. The training clock resets with them,
      // because it counted search spent on the task being left behind.
      setLedger([]);
      setStagePolicy(null);
      resumedPolicyRef.current = null;
      recoveryAttemptedRef.current = false;
      setRestoredNotice(null);
      trainingSecondsRef.current = 0;
      trainingStartedAtRef.current = null;
      setTrainingSeconds(0);
      setGeneration(0);
      setError(null);
      setBusy("preview");
      setStatus(`Loading the ${TASK_COPY[nextTask].setting} benchmark…`);
      workerRef.current.postMessage({ type: "preview", task: nextTask });
    },
    [task, seekPlayback],
  );

  const objectiveDelta =
    trace && curriculumTrace
      ? curriculumTrace.objective - trace.objective
      : null;
  const collisionRefused =
    trace !== null &&
    !trace.placed &&
    (trace.collisionRiskIntegral > 0 ||
      trace.minimumCertifiedClearanceMeters <
        HOUSEHOLD_PLACEMENT_CLEARANCE_METERS ||
      trace.possibleCollisionTimeSeconds > 0);
  const taskInfo = TASK_COPY[task];
  const traceLastIndex = Math.max(0, (trace?.samples.length ?? 1) - 1);
  const currentSampleForHUD = trace
    ? trace.samples[clampArmPlaybackIndex(trace.samples.length, sampleIndex)]
    : null;
  const currentPlaybackTime = currentSampleForHUD?.timeSeconds ?? 0;
  const traceDuration = trace?.samples.at(-1)?.timeSeconds ?? 0;
  const playbackRunning = isPlaying && !reduceMotion;
  const activeJointAngles = useMemo(() => {
    if (!currentSampleForHUD) return null;
    try {
      return iiwaJointAnglesFromOwnerPoses(currentSampleForHUD.linkPoses);
    } catch {
      // A changed topology must show an unavailable readout, never guessed IK.
      return null;
    }
  }, [currentSampleForHUD]);
  const probeJointAngles = useMemo(() => {
    if (!armDragTarget) return null;
    return solveKukaIK(armDragTarget, [0, 0.4, 0, -1.2, 0, 0.8, 0], [0, 0.78, 0], 40);
  }, [armDragTarget]);

  useEffect(() => {
    selectTaskRef.current = selectTask;
    handlePolicyImportRef.current = handlePolicyImport;
  }, [selectTask, handlePolicyImport]);

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
          {(Object.keys(TASK_COPY) as HouseholdManipulationTask[]).map(
            (taskName) => {
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
                    embedded
                      ? "min-h-10 rounded-xl px-2 py-1.5"
                      : "min-h-16 rounded-2xl px-4 py-3"
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
                  <span
                    className={
                      embedded ? "sr-only" : "mt-1 block text-xs text-slate-500"
                    }
                  >
                    {info.short}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      <div
        className={
          embedded
            ? "block"
            : "grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(350px,0.55fr)]"
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
                    embedded
                      ? "px-2 py-1 text-[0.58rem] tracking-[0.12em]"
                      : "px-3 py-1 text-[0.68rem] tracking-[0.18em]"
                  }`}
                >
                  8 owner poses · 90 Hz physics
                </span>
                <span
                  className={`rounded-full border border-emerald-300/25 bg-slate-950/82 font-bold uppercase text-emerald-200 backdrop-blur-md ${
                    embedded
                      ? "px-2 py-1 text-[0.58rem] tracking-[0.12em]"
                      : "px-3 py-1 text-[0.68rem] tracking-[0.18em]"
                  }`}
                >
                  {trace?.placed
                    ? "collision-safe placement verified"
                    : trace
                      ? collisionRefused
                        ? "placement refused · collision envelope"
                        : "owner reports not placed"
                      : "awaiting owner receipt"}
                </span>

                {/* Microscope Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setMicroscopeMode(!microscopeMode)}
                  className={`flex items-center rounded-full border font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                    embedded
                      ? "gap-1 px-2 py-1 text-[0.58rem]"
                      : "gap-1.5 px-3 py-1 text-[0.68rem]"
                  } ${
                    microscopeMode
                      ? "border-cyan-400 bg-cyan-500/25 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "border-white/20 bg-slate-950/80 text-slate-300 hover:text-white"
                  }`}
                  title="Toggle 3D Coulomb friction cone overlay at contact points"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="sm:hidden">
                    {microscopeMode ? "Cones on" : "Friction cones"}
                  </span>
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
                    embedded
                      ? "gap-1 px-2 py-1 text-[0.58rem]"
                      : "gap-1.5 px-3 py-1 text-[0.68rem]"
                  } ${
                    soundEnabled
                      ? "border-emerald-400 bg-emerald-500/25 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      : "border-white/20 bg-slate-950/80 text-slate-400 hover:text-slate-200"
                  }`}
                  title="Toggle Synthesized Contact Acoustics"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                  <span>{soundEnabled ? "Sound ON" : "Muted"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPhysicsDebug((enabled) => !enabled)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                    physicsDebug
                      ? "border-amber-400 bg-amber-500/25 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                      : "border-white/20 bg-slate-950/80 text-slate-300 hover:text-white"
                  }`}
                  title="Show arm and object collision envelopes"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  <span>{physicsDebug ? "Physics ON" : "Physics"}</span>
                </button>

                {embedded ? (
                  <button
                    type="button"
                    aria-label="Show diagnostics and all arm controls"
                    onClick={() =>
                      diagnosticsRef.current?.scrollIntoView({
                        behavior: reduceMotion ? "auto" : "smooth",
                        block: "start",
                      })
                    }
                    className="flex items-center gap-1 rounded-full border border-cyan-300/35 bg-cyan-950/85 px-2 py-1 text-[0.58rem] font-bold uppercase tracking-wider text-cyan-100 backdrop-blur-md transition-colors hover:bg-cyan-900/70"
                    title="Jump past the interactive 3D stage to diagnostics, optimization, policy, and receipt controls"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>All controls ↓</span>
                  </button>
                ) : null}

                {/* Export Telemetry Receipt Button */}
                {trace && (
                  <button
                    type="button"
                    onClick={handleExportTelemetry}
                    className="flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-950/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-orange-200 backdrop-blur-md hover:bg-orange-900/60 transition-colors"
                    title="Export full 128-D kinematic & dynamic trajectory receipt as JSON"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="sm:hidden">Export</span>
                    <span className="max-sm:hidden">Export Telemetry</span>
                  </button>
                )}

                {/* Self-collision diagnostic on the measured owner chain */}
                {armSelfContacts.length > 0 ? (
                  <span
                    className="rounded-full border border-rose-400/80 bg-rose-950/85 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-rose-200 backdrop-blur-md"
                    title="Non-adjacent link spheres overlapping on the rendered chain (browser diagnostic; the owner receipt has no per-pair self-contact term)"
                  >
                    ⚠️ Self-contact{" "}
                    {armSelfContacts
                      .slice(0, 2)
                      .map((c) => `L${c.linkA}–L${c.linkB} ${(c.penetration * 100).toFixed(1)} cm`)
                      .join(" · ")}
                    {armSelfContacts.length > 2 ? ` +${armSelfContacts.length - 2}` : ""}
                  </span>
                ) : null}

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
                        : armUnreachable
                          ? `⛔ Unreachable — Workspace Limit`
                          : `🖐️ Target Moved (${armCollisionState.clearance.toFixed(2)}m free)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setArmDragTarget(null);
                        setArmUnreachable(false);
                      }}
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
              <div
                className={`pointer-events-auto flex items-center rounded-xl border border-white/10 bg-slate-950/85 p-1 backdrop-blur-md ${
                  embedded
                    ? "w-full justify-between gap-0.5"
                    : "self-start gap-1"
                }`}
              >
                {(
                  [
                    {
                      id: "studio",
                      label: "Studio",
                      compactLabel: "Studio",
                      icon: Camera,
                    },
                    {
                      id: "microscope",
                      label: "Grasp Focus",
                      compactLabel: "Focus",
                      icon: Eye,
                    },
                    {
                      id: "overhead",
                      label: "Top",
                      compactLabel: "Top",
                      icon: Activity,
                    },
                    {
                      id: "side",
                      label: "Side",
                      compactLabel: "Side",
                      icon: Sliders,
                    },
                    {
                      id: "front",
                      label: "Front",
                      compactLabel: "Front",
                      icon: Eye,
                    },
                    {
                      id: "fly",
                      label: "Free-Fly",
                      compactLabel: "Fly",
                      icon: Compass,
                    },
                  ] as const
                ).map((cam) => {
                  const Icon = cam.icon;
                  const isSelected = cameraMode === cam.id;
                  return (
                    <button
                      key={cam.id}
                      type="button"
                      aria-label={`${cam.label} camera`}
                      onClick={() => setCameraMode(cam.id)}
                      className={`flex min-w-0 items-center whitespace-nowrap rounded-lg py-1 font-bold transition-all ${
                        embedded
                          ? "gap-0.5 px-1.5 text-[0.58rem]"
                          : "gap-1 px-2 text-[0.65rem]"
                      } ${
                        isSelected
                          ? "bg-orange-500/30 text-orange-200 border border-orange-400/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-3 w-3 shrink-0" />
                      {embedded ? cam.compactLabel : cam.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={`pointer-events-none absolute z-10 flex flex-wrap items-end justify-between gap-2 ${
                embedded
                  ? "bottom-3 left-3 right-3"
                  : "bottom-5 left-5 right-5 max-sm:bottom-3 max-sm:left-3 max-sm:right-3"
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
              <div
                className={`pointer-events-auto flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-slate-950/88 text-slate-200 shadow-lg backdrop-blur-md ${
                  embedded ? "w-full px-2 py-1.5" : "px-2.5 py-2"
                }`}
                aria-label="Arm trace playback"
              >
                <button
                  type="button"
                  aria-label="Restart arm trace"
                  disabled={!trace}
                  onClick={() => {
                    setIsPlaying(false);
                    seekPlayback(0);
                  }}
                  className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-35"
                >
                  <SkipBack className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={
                    playbackRunning ? "Pause arm trace" : "Play arm trace"
                  }
                  disabled={!trace || reduceMotion}
                  onClick={() => setIsPlaying((playing) => !playing)}
                  className="rounded-lg p-1.5 text-orange-200 transition hover:bg-orange-400/15 hover:text-orange-100 disabled:opacity-35"
                  title={
                    reduceMotion
                      ? "Reduce Motion is on; seek the trace manually."
                      : undefined
                  }
                >
                  {playbackRunning ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </button>
                <div className="relative min-w-0 flex-1 sm:w-32 sm:flex-none">
                  {/* Grasp phase band: the owner receipt's first-grasp time and
                      grasp duration, drawn under the scrubber so the viewer
                      can see when the pads were engaged along the 6 s trace. */}
                  {trace && traceDuration > 0 && trace.graspDurationSeconds > 0 ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-700/40"
                      aria-hidden="true"
                    >
                      <div
                        className="absolute h-full rounded-full bg-emerald-400/60"
                        style={{
                          left: `${Math.max(0, Math.min(100, (trace.firstGraspTimeSeconds / traceDuration) * 100))}%`,
                          width: `${Math.max(1, Math.min(100, (trace.graspDurationSeconds / traceDuration) * 100))}%`,
                        }}
                        title={`Pads engaged ${number(trace.firstGraspTimeSeconds, 2)} s → ${number(trace.firstGraspTimeSeconds + trace.graspDurationSeconds, 2)} s (owner receipt)`}
                      />
                    </div>
                  ) : null}
                  <input
                    aria-label="Arm trace position"
                    type="range"
                    min={0}
                    max={traceLastIndex}
                    step={1}
                    value={clampArmPlaybackIndex(
                      trace?.samples.length ?? 0,
                      sampleIndex,
                    )}
                    disabled={!trace}
                    onChange={(event) => {
                      setIsPlaying(false);
                      seekPlayback(
                        clampArmPlaybackIndex(
                          trace?.samples.length ?? 0,
                          Number(event.target.value),
                        ),
                      );
                    }}
                    className="relative w-full min-w-0 accent-orange-400 disabled:opacity-35"
                    title={
                      trace && trace.graspDurationSeconds > 0
                        ? `Green band: pads engaged ${number(trace.firstGraspTimeSeconds, 2)}–${number(trace.firstGraspTimeSeconds + trace.graspDurationSeconds, 2)} s`
                        : undefined
                    }
                  />
                </div>
                <span className="shrink-0 font-mono text-[0.62rem] tabular-nums text-slate-300">
                  {currentPlaybackTime.toFixed(2)} / {traceDuration.toFixed(2)}{" "}
                  s
                </span>
                <label className="sr-only" htmlFor="arm-playback-speed">
                  Arm trace playback speed
                </label>
                <select
                  id="arm-playback-speed"
                  aria-label="Arm trace playback speed"
                  value={playbackSpeed}
                  onChange={(event) =>
                    setPlaybackSpeed(Number(event.target.value) as FrankenRobotsPlaybackSpeed)
                  }
                  className="shrink-0 rounded-lg border border-white/10 bg-slate-900 px-1.5 py-1 text-[0.65rem] font-bold text-slate-200"
                >
                  <option value={0.25}>0.25×</option>
                  <option value={0.5}>0.5×</option>
                  <option value={1}>1×</option>
                  <option value={2}>2×</option>
                </select>
                {reduceMotion ? (
                  <span className="sr-only">
                    Reduce Motion is on; use the position slider.
                  </span>
                ) : null}
              </div>
              {!embedded ? (
                <span className="rounded-xl border border-white/10 bg-slate-950/82 px-3 py-2 text-[0.7rem] text-slate-400 backdrop-blur-md">
                  {cameraMode === "fly"
                    ? "Free-fly 6-DOF: WASD + Q/E + drag to look."
                    : cameraMode === "microscope"
                      ? "Grasp focus: target held still at the workbench."
                      : cameraMode === "overhead"
                        ? "Top-down map view."
                        : cameraMode === "side"
                          ? "Side elevation profile."
                          : cameraMode === "front"
                            ? "Front elevation workbench perspective."
                            : "Drag to orbit · pinch to zoom"}
                </span>
              ) : null}
            </div>
            <div
              ref={stageRef}
              className={
                embedded ? "h-[calc(100svh-64px)] w-full" : "h-[570px] w-full"
              }
            >
              {shouldMountStage ? (
                <ArmStage
                  trace={trace}
                  admission={admission}
                  reduceMotion={reduceMotion}
                  microscopeMode={microscopeMode}
                  cameraMode={cameraMode}
                  sampleIndex={sampleIndex}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  playbackSeek={playbackSeek}
                  onSampleIndexChange={handleSampleIndexChange}
                  dragTarget={armDragTarget}
                  onDragTargetChange={setArmDragTarget}
                  onCollisionChange={setArmCollisionState}
                  onUnreachableChange={setArmUnreachable}
                  onSelfCollisionChange={setArmSelfContacts}
                  physicsDebug={physicsDebug}
                  allowVerticalPageScroll={embedded}
                />
              ) : null}
              <FreeFlyHintBanner visible={cameraMode === "fly"} />
            </div>
          </div>

          {/* These diagnostics are part of the arm lab, including the native
              embedded route. Compact hosting may change spacing, but must not
              remove the grasp or joint-limit controls. */}
          <div
            ref={diagnosticsRef}
            className={`mt-3 flex scroll-mt-2 flex-col gap-3 ${embedded ? "px-1 pb-1" : ""}`}
          >
            <ArmGraspMicroscopeHUD
              sample={currentSampleForHUD}
              enabled={microscopeMode}
            />
            <ArmJointKinematicsStrip
              jointAngles={activeJointAngles}
              probeJointAngles={probeJointAngles}
            />
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-orange-300/20 bg-orange-400/10 p-3">
              <Bot className="h-6 w-6 text-orange-200" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
                Frankensim household flagship
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">
                Optimize a complete pick-and-place
              </h3>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-400">
            Seven joint target curves plus one gripper-width curve, each sampled
            at sixteen knots:
            <span className="mt-2 block font-mono text-orange-200">
              (7 joints + 1 gripper) × 16 = 128 variables
            </span>
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            CMA-ES receives only a scalar receipt after a full rollout.
            Compliant contact, stick/slip friction, free object dynamics,
            release, hard limits, and owner-routed obstacle/self/object
            separation make the objective piecewise and black-box—there is no
            browser gradient hiding behind the animation.
          </p>

          <label
            htmlFor="arm-family"
            className="mt-6 block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
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
            At 128 dimensions, all four representations fit the honest browser
            envelope. Full CMA is pedagogically useful here; it is rightly
            refused for the 5,040-D walking problem.
          </p>

          <label
            htmlFor="arm-seed"
            className="mt-5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
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

          <div className="mt-5 rounded-xl border border-orange-400/20 bg-orange-400/[0.06] px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-orange-100">Continuous learning</span>
              <span className="font-mono text-orange-200">
                {ARM_POPULATION} physical rollouts / generation
              </span>
            </div>
            <p className="mt-1 text-[0.68rem] leading-5 text-slate-400">
              The owner keeps the CMA state hot until you press Stop. The best manipulation policy
              is replayed every {ARM_LIVE_REPLAY_INTERVAL} generations.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!workerAvailable || (busy !== null && busy !== "optimize") || stopRequested}
              onClick={busy === "optimize" ? stopContinuousOptimization : startContinuousOptimization}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 px-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {busy === "optimize" ? <Square className="h-4 w-4 fill-current" /> : <Sparkles className="h-4 w-4" />}
              {busy === "optimize"
                ? (stopRequested ? "Stopping…" : `Stop · gen ${generation}`)
                : (generation > 0 ? `Keep learning · gen ${generation}` : "Start learning")}
            </button>
            <button
              type="button"
              disabled={busy !== null || !workerAvailable || !curriculumTrace}
              onClick={() => {
                if (!curriculumTrace) return;
                setTrace(curriculumTrace);
                seekPlayback(0);
                setIsPlaying(true);
                setActiveTrace("curriculum");
                setGeneration(0);
                setBestObjective(curriculumTrace.objective);
                setStatus(
                  `${taskInfo.title} curriculum replayed from Frankensim WASM.`,
                );
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RotateCcw className="h-4 w-4" />
              Curriculum
            </button>
          </div>

          <div
            className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4"
            aria-live="polite"
          >
            <div className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-200">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${busy ? "animate-pulse bg-orange-300" : error ? "bg-rose-400" : "bg-emerald-400"}`}
              />
              {status}
            </div>
            {generation > 0 ? (
              <div className="mt-3 flex justify-between gap-3 font-mono text-[0.7rem] text-slate-400">
                <span>generation {generation}</span>
                <span>
                  best {bestObjective === null ? "—" : number(bestObjective, 4)}
                </span>
              </div>
            ) : null}
            {error ? (
              <p className="mt-3 text-xs leading-5 text-rose-300">{error}</p>
            ) : null}
            {restoredNotice ? (
              <p className="mt-2 rounded-xl border border-cyan-300/20 bg-cyan-950/30 px-3 py-2 text-[0.66rem] leading-4 text-cyan-100">
                {restoredNotice} Learning continues from that policy — its
                covariance was not saved, so this is a warm restart rather than
                a resumed search.
              </p>
            ) : null}
            {ledger.length > 0 ? (
              <div className="mt-3">
                <ArmLearningLedger points={ledger} trainingSeconds={trainingSeconds} />
              </div>
            ) : null}
            <div className="mt-3">
              <PolicyExchange
                policy={stagePolicy}
                subject="iiwa"
                title="Keep this policy"
                disabled={busy !== null}
                meta={{
                  kernelVersion: FRANKENSIM_OWNER_KERNEL_VERSION,
                  task,
                  challenge: "household",
                  family,
                  generation,
                  sigma: searchSigma,
                }}
                measured={
                  ledger.length > 0
                    ? {
                        placementErrorMeters: ledger[ledger.length - 1].placementErrorMeters,
                        placed: ledger[ledger.length - 1].placed,
                        energyJoules: ledger[ledger.length - 1].energyJoules,
                        liftMeters: ledger[ledger.length - 1].liftMeters,
                      }
                    : null
                }
                onImport={handlePolicyImport}
              />
            </div>
          </div>
        </div>
      </div>

      {trace && admission
        ? (() => {
            const cards: [string, string | number][] = [
              ["objective ↓", number(trace.objective, 2)],
              [
                "vs curriculum",
                activeTrace === "curriculum"
                  ? "reference"
                  : objectiveDelta !== null && objectiveDelta > 0
                    ? `${number(objectiveDelta, 2)} lower`
                    : "flat",
              ],
              [
                "final error",
                `${number(trace.finalObjectErrorMeters * 100, 1)} / ${number(admission.placementToleranceMeters * 100, 1)} cm`,
              ],
              [
                "maximum lift",
                `${number(trace.maximumLiftMeters * 100, 1)} / ${number(admission.liftTargetMeters * 100, 1)} cm`,
              ],
              ["first grasp", `${number(trace.firstGraspTimeSeconds, 2)} s`],
              ["grip force", `${number(trace.peakGripForceNewtons, 1)} N`],
              ["work", `${number(trace.actuatorWorkJoules, 1)} J`],
              [
                "collision risk ∫",
                `${number(trace.collisionRiskIntegral, 4)} m·s`,
              ],
              [
                "certified clearance",
                `${number(trace.minimumCertifiedClearanceMeters * 100, 2)} cm`,
              ],
              [
                "possible collision",
                `${number(trace.possibleCollisionTimeSeconds, 3)} s`,
              ],
              [
                "convex iterations",
                trace.collisionQueryIterations.toLocaleString(),
              ],
              [
                "placement verdict",
                trace.placed
                  ? "placed ✓"
                  : collisionRefused
                    ? "collision-refused"
                    : "not placed",
              ],
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
                      <p className="truncate text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400">
                        {label}
                      </p>
                      <p
                        title={String(value)}
                        className={`mt-2 truncate font-mono text-sm ${label === "placement verdict" && trace.placed ? "text-emerald-300" : "text-slate-100"}`}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 md:hidden">
                  {(showAllReceipts ? cards : cards.slice(0, 4)).map(
                    ([label, value]) => (
                      <div
                        key={label}
                        title={`${label}: ${value}`}
                        className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/55 p-4"
                      >
                        <p className="truncate text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400">
                          {label}
                        </p>
                        <p
                          title={String(value)}
                          className={`mt-2 truncate font-mono text-sm ${label === "placement verdict" && trace.placed ? "text-emerald-300" : "text-slate-100"}`}
                        >
                          {value}
                        </p>
                      </div>
                    ),
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row md:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      const obj = Object.fromEntries(
                        cards.map(([k, v]) => [
                          k,
                          typeof v === "number" ? v : String(v),
                        ]),
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
                      ? `Hide ${cards.length - 4} of ${cards.length} telemetry rows`
                      : `Show all ${cards.length} telemetry rows`}
                  </button>
                </div>
                <div className="hidden md:flex md:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const obj = Object.fromEntries(
                        cards.map(([k, v]) => [
                          k,
                          typeof v === "number" ? v : String(v),
                        ]),
                      );
                      const json = JSON.stringify(obj, null, 2);
                      if (navigator.clipboard) {
                        void navigator.clipboard.writeText(json);
                      }
                      setStatus("Receipt copied to clipboard as JSON.");
                    }}
                    className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-500/10 px-4 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/15"
                  >
                    Copy {cards.length}-row receipt as JSON
                  </button>
                </div>
              </div>
            );
          })()
        : null}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                All variants · one physical objective
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">
                Which covariance model helps at 128-D?
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Run every owner implementation from the identical curriculum,
                seed, population, and rollout budget. This is a local
                measurement on one nonsmooth task—not a universal ranking.
              </p>
            </div>
            <button
              type="button"
              disabled={busy !== null || !workerAvailable}
              onClick={() =>
                post({ type: "compare", task, generations: 4 }, "compare")
              }
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
                    <th className="pb-3 font-semibold">
                      curriculum → final best
                    </th>
                    <th className="pb-3 font-semibold">evals</th>
                    <th className="pb-3 font-semibold">
                      persistent / workspace scalars
                    </th>
                    <th className="pb-3 font-semibold">this browser</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr
                      key={row.family}
                      className="border-b border-white/5 text-slate-300"
                    >
                      <td
                        className={`py-3 font-semibold ${FAMILY_COPY[row.family].color}`}
                      >
                        {FAMILY_COPY[row.family].title}
                      </td>
                      <td className="py-3 font-mono">
                        {number(row.initialObjective, 2)} →{" "}
                        {number(row.finalObjective, 2)}
                      </td>
                      <td className="py-3 font-mono">{row.evaluations}</td>
                      <td className="py-3 font-mono">
                        {row.persistentScalars.toLocaleString()} /{" "}
                        {row.workspaceScalars.toLocaleString()}
                      </td>
                      <td className="py-3 font-mono">
                        {number(row.elapsedMilliseconds, 1)} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(Object.keys(FAMILY_COPY) as CmaFamily[]).map((name) => (
                <div
                  key={name}
                  className="rounded-2xl border border-white/10 bg-black/15 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className={`h-4 w-4 ${FAMILY_COPY[name].color}`} />
                    <p className="text-sm font-semibold text-slate-100">
                      {FAMILY_COPY[name].title}
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {FAMILY_COPY[name].representation}
                  </p>
                  <p className="mt-1 font-mono text-[0.68rem] text-slate-500">
                    {FAMILY_COPY[name].complexity}
                  </p>
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
            <li>
              <strong className="text-slate-200">Source arm:</strong> pinned
              iiwa topology, masses, inertias, joint frames, axes, hard limits,
              and 300 N·m reference defaults.
            </li>
            <li>
              <strong className="text-slate-200">Owner math:</strong> SE(3)
              kinematics, inverse-dynamics computed torque, Featherstone forward
              dynamics, compliant pad force, Coulomb friction, and certified
              convex separation.
            </li>
            <li>
              <strong className="text-slate-200">Measured poses and joints:</strong>{" "}
              the browser draws the object and eight link poses exactly as
              measured by the kernel. All seven joint dials use those rotations
              and the source joint frames. The cyan reach ghost and its separate
              probe values use an auxiliary 4-joint browser chain.
            </li>
            <li>
              <strong className="text-slate-200">Grasp test:</strong> both
              finite pads must remain engaged while the requested translation
              and rotation wrench stays inside owner friction capacity.
            </li>
            <li>
              <strong className="text-slate-200">Reduced contact:</strong>{" "}
              collision uses conservative oriented-box link/object envelopes,
              not triangle meshes; there is no general impulse solver, grasp
              planner, deformable object, or cable model.
            </li>
            <li>
              <strong className="text-slate-200">No hardware claim:</strong>{" "}
              this is a deterministic explainer benchmark, not a KUKA-certified
              model or sim-to-real controller.
            </li>
          </ul>
        </aside>
      </div>

      <details className="glass-card overflow-hidden p-0 group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <h3 className="font-bold text-white">
              What the kernel actually does (and doesn&apos;t)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400 group-open:hidden">
            tap to expand
          </span>
          <span className="text-xs font-semibold text-slate-400 hidden group-open:inline">
            tap to collapse
          </span>
        </summary>
        <div className="grid gap-3 border-t border-white/5 p-4 sm:grid-cols-3 sm:p-5">
          <div className="rounded-xl border border-emerald-300/15 bg-emerald-950/20 p-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-300">
              Modeled
            </p>
            <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-5 text-slate-300">
              <li>· 7 revolute DoFs (iiwa topology) with hard joint limits</li>
              <li>· SE(3) FK, inverse-dynamics computed torque</li>
              <li>· Featherstone articulated-body forward dynamics</li>
              <li>· Compliant normal pad force + Coulomb friction</li>
              <li>· Certified convex separation for collision pairs</li>
              <li>· GJK + EPA query count surfaced in the receipt</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-300/15 bg-amber-950/20 p-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-300">
              Simplified
            </p>
            <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-5 text-slate-300">
              <li>
                · Collision uses oriented-box envelopes, not triangle meshes
              </li>
              <li>· No impulse solver, deformable object, or cable model</li>
              <li>· Grasp pads are finite, rigid, parallel-jaw style</li>
              <li>· Object dynamics are rigid-body only</li>
              <li>· No joint belt-elasticity, backlash, or stiction</li>
              <li>· No multi-arm coordination, bimanual, or human input</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-300/15 bg-rose-950/20 p-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-rose-300">
              Not modeled
            </p>
            <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-5 text-slate-300">
              <li>· No slip detection, regrasp, or recovery reflex</li>
              <li>· No inertial measurement, encoder, or actuator lag</li>
              <li>· No environment lighting, occlusion, or camera noise</li>
              <li>· No learned policy beyond the periodic basis</li>
              <li>· No sim-to-real transfer or hardware validation</li>
              <li>
                · No reachability planner, grasp planner, or motion planner
              </li>
            </ul>
          </div>
        </div>
        <p className="border-t border-white/5 bg-black/20 px-4 py-3 text-[0.72rem] leading-5 text-slate-400 sm:px-5">
          A placement the kernel approves can still fail on a real KUKA. The
          page deliberately stops at a deterministic explainer benchmark;
          treating it as a controller validation would be a category error.
        </p>
      </details>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-300" />
            <h3 className="font-bold text-white">
              A parametric model with a paper trail
            </h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The procedural shell is intentionally mesh-free. Segment endpoints
            come from owner poses; the table records the pinned source
            joint-offset magnitude and mass used by dynamics. Orange housings
            are display geometry; the collision owner independently builds
            conservative oriented boxes from those source frames.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[440px] text-left text-xs">
              <thead className="bg-white/[0.035] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">source link</th>
                  <th className="px-4 py-3 font-semibold">
                    joint offset magnitude (m)
                  </th>
                  <th className="px-4 py-3 font-semibold">mass (kg)</th>
                </tr>
              </thead>
              <tbody>
                {LINK_SOURCE_ROWS.map(([link, offset, mass]) => (
                  <tr
                    key={link}
                    className="border-t border-white/[0.06] text-slate-300"
                  >
                    <td className="px-4 py-2.5 font-mono text-orange-200">
                      {link}
                    </td>
                    <td className="px-4 py-2.5 font-mono">{offset}</td>
                    <td className="px-4 py-2.5 font-mono">{mass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Pinned community-reference source:{" "}
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
            <h3 className="font-bold text-white">
              Why this is a useful black-box flagship
            </h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              [
                "1 · Reach and close",
                "The seven joint splines must align both finite pads with the object while the finger spline is actually closing.",
              ],
              [
                "2 · Earn the grasp",
                "Frankensim integrates compliant normal force, friction, object translation, and object rotation. Nothing is latched or teleported.",
              ],
              [
                "3 · Lift, route, release",
                "The object must clear 9 cm, reach the goal tolerance, finish released on support, and avoid owner-reported obstacle, self, and proximal-object collision risk.",
              ],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-black/15 p-4"
              >
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm font-semibold text-white">{title}</p>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            The source-feasible curriculum makes the demo inspectable from first
            paint, while live CMA-ES still searches every coordinate. If a
            sampled policy drops the object or misses the station, the receipt
            says so; the renderer cannot substitute a canned success animation.
          </p>
        </div>
      </div>
    </div>
  );
}
