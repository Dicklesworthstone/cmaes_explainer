"use client";

// KMR scene: a separate Three.js canvas for the KUKA KMR mobile
// base with waypoint navigation and LiDAR scan visualization.
//
// This is a minimal-viable Phase 6 component. The KMR is rendered
// as a companion to the existing arm flagship (not under it) so
// the integration is additive: the arm and the KMR each have
// their own coordinate system and their own canvas.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildKmrBaseMesh,
  defaultKmrMaterialSet,
  KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE,
  KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS,
} from "../lib/kmrGeometry";
import { scanLidar, KUKA_KMR_IIWA_LIDAR_DEFAULT } from "../lib/kmrLidar";
import { planWaypointPath, type WaypointPath } from "../lib/kmrWaypointNav";
import { CRAFTSMAN_BUNGALOW_1928 } from "../lib/houseScenes";
import {
  createHouseNavigationScene,
  type OrientedBoundingBox,
} from "../lib/houseMultiObstacleKernel";
import {
  KmrNavigationOwner,
  type KmrNavigationReceipt,
} from "../lib/kmrNavigationOwner";
import {
  createKmrHouseholdPhysicsCoupling,
  stepKmrHouseholdPhysics,
  type KmrHouseholdPhysicsCoupling,
  type KmrHouseholdPhysicsReceipt,
} from "../lib/kmrHouseholdPhysics";

interface KmrPose {
  x: number;
  y: number;
  theta: number;
}

export interface KmrSceneProps {
  initialPose?: KmrPose;
}

function obstaclesFromCatalog(): OrientedBoundingBox[] {
  return createHouseNavigationScene().obstacles;
}

function KmrThreeScene({
  pose,
  path,
  dynamicReceipt,
  onSetWaypoint,
}: {
  pose: KmrPose;
  path: WaypointPath | null;
  dynamicReceipt: KmrHouseholdPhysicsReceipt | null;
  onSetWaypoint: (world: { x: number; y: number }) => void;
}) {
  const materials = useMemo(() => defaultKmrMaterialSet(), []);
  const baseGroup = useMemo(
    () => buildKmrBaseMesh(KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS, materials),
    [materials],
  );
  const obstacles = useMemo(() => obstaclesFromCatalog(), []);
  const scan = useMemo(
    () =>
      scanLidar(
        pose.x,
        pose.y,
        obstacles,
        KUKA_KMR_IIWA_LIDAR_DEFAULT,
        pose.theta,
      ),
    [pose.x, pose.y, pose.theta, obstacles],
  );
  const pathLine = useMemo(() => {
    if (!path || path.points.length < 2) return null;
    const geometry = new THREE.BufferGeometry().setFromPoints(
      path.points.map((point) => new THREE.Vector3(point[0], 0.025, point[1])),
    );
    return new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: "#22d3ee" }),
    );
  }, [path]);

  useEffect(
    () => () => {
      if (!pathLine) return;
      pathLine.geometry.dispose();
      if (Array.isArray(pathLine.material)) {
        pathLine.material.forEach((material) => material.dispose());
      } else {
        pathLine.material.dispose();
      }
    },
    [pathLine],
  );

  const handleClick = (e: any) => {
    if (!e.point) return;
    onSetWaypoint({ x: e.point.x, y: e.point.z });
  };

  return (
    <group>
      <primitive
        object={baseGroup}
        position={[pose.x, 0, pose.y]}
        rotation={[0, -pose.theta, 0]}
      />
      {scan.rays.map((r, i) => {
        if (!r.hit) return null;
        const cosA = Math.cos(r.angleRadians + pose.theta);
        const sinA = Math.sin(r.angleRadians + pose.theta);
        const x = pose.x + r.rangeMeters * cosA;
        const y = pose.y + r.rangeMeters * sinA;
        const z =
          KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS.mountingPlateHeightMeters +
          0.06;
        const color =
          r.rangeMeters < 1.0
            ? "#ef4444"
            : r.rangeMeters < 3.0
              ? "#f59e0b"
              : "#22c55e";
        return (
          <mesh key={i} position={[x, z, y]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
      {obstacles.map((obstacle) => {
        if (obstacle.exemptFromPenalty) return null;
        const isWall = obstacle.materialId === "house-wall";
        return (
          <mesh
            key={obstacle.id}
            position={obstacle.center}
            rotation={[0, obstacle.rotationYawRad, 0]}
          >
            <boxGeometry
              args={[
                obstacle.halfExtents[0] * 2,
                obstacle.halfExtents[1] * 2,
                obstacle.halfExtents[2] * 2,
              ]}
            />
            <meshStandardMaterial
              color={isWall ? "#334155" : "#78350f"}
              transparent
              opacity={isWall ? 0.38 : 0.24}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      {pathLine ? <primitive object={pathLine} /> : null}
      {dynamicReceipt ? (
        <mesh
          position={[
            dynamicReceipt.chairPositionMeters[0],
            dynamicReceipt.chairPositionMeters[2],
            dynamicReceipt.chairPositionMeters[1],
          ]}
          castShadow
        >
          <sphereGeometry args={[0.22, 16, 12]} />
          <meshStandardMaterial color="#a16207" roughness={0.82} />
        </mesh>
      ) : null}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        onClick={handleClick}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <gridHelper
        args={[20, 20, "#1e293b", "#334155"]}
        position={[0, 0.005, 0]}
      />
    </group>
  );
}

const ROOM_DESTINATIONS = [
  { name: "🛋️ Living Room", x: -1.4, y: 2.6 },
  { name: "🍽️ Dining Room", x: 1.6, y: 2.4 },
  { name: "🍳 Kitchen", x: 1.9, y: -0.6 },
  { name: "🛏️ Bedroom", x: -1.8, y: -1.9 },
  { name: "🌿 Porch", x: 0.0, y: 4.8 },
];

export function KmrScene({ initialPose }: KmrSceneProps) {
  const navigationStart = CRAFTSMAN_BUNGALOW_1928.goals[0].center;
  const [pose, setPose] = useState<KmrPose>(
    initialPose ?? {
      x: navigationStart[0],
      y: navigationStart[1],
      theta: 0,
    },
  );
  const [path, setPath] = useState<WaypointPath | null>(null);
  const [receipt, setReceipt] = useState<KmrNavigationReceipt | null>(null);
  const [dynamicReceipt, setDynamicReceipt] =
    useState<KmrHouseholdPhysicsReceipt | null>(null);
  const [planningError, setPlanningError] = useState<string | null>(null);
  const obstacles = useMemo(() => obstaclesFromCatalog(), []);
  const animRef = useRef<number | null>(null);
  const ownerRef = useRef<KmrNavigationOwner | null>(null);
  const householdCouplingRef = useRef<KmrHouseholdPhysicsCoupling | null>(null);
  const lastFrameMsRef = useRef<number | null>(null);
  const accumulatedSecondsRef = useRef(0);

  useEffect(() => {
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleManualDrive = useCallback(
    (dx: number, dy: number, dTheta: number = 0) => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
      setPath(null);
      setPlanningError(null);
      const cosT = Math.cos(pose.theta);
      const sinT = Math.sin(pose.theta);
      const worldDx = dx * cosT - dy * sinT;
      const worldDy = dx * sinT + dy * cosT;
      const nextX = Math.max(
        CRAFTSMAN_BUNGALOW_1928.bounds.min[0] + 0.35,
        Math.min(CRAFTSMAN_BUNGALOW_1928.bounds.max[0] - 0.35, pose.x + worldDx)
      );
      const nextY = Math.max(
        CRAFTSMAN_BUNGALOW_1928.bounds.min[1] + 0.35,
        Math.min(CRAFTSMAN_BUNGALOW_1928.bounds.max[1] - 0.35, pose.y + worldDy)
      );
      const nextTheta = (pose.theta + dTheta + Math.PI * 2) % (Math.PI * 2);

      const radius = 0.32;
      let collision = false;
      for (const obb of obstacles) {
        if (obb.exemptFromPenalty) continue;
        const relX = nextX - obb.center[0];
        const relZ = nextY - obb.center[2];
        const cosYaw = Math.cos(-obb.rotationYawRad);
        const sinYaw = Math.sin(-obb.rotationYawRad);
        const localX = relX * cosYaw - relZ * sinYaw;
        const localZ = relX * sinYaw + relZ * cosYaw;
        const hx = obb.halfExtents[0] + radius;
        const hz = obb.halfExtents[2] + radius;
        if (Math.abs(localX) < hx && Math.abs(localZ) < hz) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        setPose({ x: nextX, y: nextY, theta: nextTheta });
      } else {
        setPlanningError("Manual drive stopped: obstacle clearance envelope reached.");
      }
    },
    [pose, obstacles]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) {
        handleManualDrive(0.12, 0);
      } else if (["ArrowDown", "KeyS"].includes(e.code)) {
        handleManualDrive(-0.12, 0);
      } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
        handleManualDrive(0, -0.12);
      } else if (["ArrowRight", "KeyD"].includes(e.code)) {
        handleManualDrive(0, 0.12);
      } else if (e.code === "KeyQ") {
        handleManualDrive(0, 0, 0.15);
      } else if (e.code === "KeyE") {
        handleManualDrive(0, 0, -0.15);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleManualDrive]);

  const setWaypoint = (target: { x: number; y: number }) => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    setPlanningError(null);
    let owner: KmrNavigationOwner;
    try {
      const newPath = planWaypointPath(
        pose,
        target,
        obstacles,
        undefined,
        CRAFTSMAN_BUNGALOW_1928.bounds,
      );
      owner = new KmrNavigationOwner(pose, newPath.path, obstacles);
      const firstDrivePoint = newPath.path.points[1] ?? [target.x, target.y];
      const driveDx = firstDrivePoint[0] - pose.x;
      const driveDy = firstDrivePoint[1] - pose.y;
      const driveLength = Math.hypot(driveDx, driveDy) || 1;
      const chairDistance = Math.min(0.75, driveLength * 0.6);
      householdCouplingRef.current = createKmrHouseholdPhysicsCoupling(
        pose,
        [
          pose.x + (driveDx / driveLength) * chairDistance,
          pose.y + (driveDy / driveLength) * chairDistance,
        ],
      );
      ownerRef.current = owner;
      setPath(newPath.path);
      setReceipt(owner.receipt());
      setDynamicReceipt(null);
    } catch (error) {
      ownerRef.current = null;
      setPath(null);
      setReceipt(null);
      setDynamicReceipt(null);
      householdCouplingRef.current = null;
      setPlanningError(error instanceof Error ? error.message : String(error));
      return;
    }

    lastFrameMsRef.current = null;
    accumulatedSecondsRef.current = 0;
    const animate = (now: number) => {
      const activeOwner = ownerRef.current;
      if (!activeOwner) return;
      const previousFrame = lastFrameMsRef.current ?? now;
      lastFrameMsRef.current = now;
      accumulatedSecondsRef.current += Math.min(0.1, (now - previousFrame) / 1000);
      let nextReceipt = activeOwner.receipt();
      let nextDynamicReceipt: KmrHouseholdPhysicsReceipt | null = null;
      let substeps = 0;
      while (accumulatedSecondsRef.current >= 1 / 60 && substeps < 6) {
        nextReceipt = activeOwner.step();
        if (householdCouplingRef.current) {
          nextDynamicReceipt = stepKmrHouseholdPhysics(
            householdCouplingRef.current,
            nextReceipt,
          );
        }
        accumulatedSecondsRef.current -= 1 / 60;
        substeps += 1;
      }
      if (substeps > 0) {
        setPose(nextReceipt.pose);
        setReceipt(nextReceipt);
        if (nextDynamicReceipt) setDynamicReceipt(nextDynamicReceipt);
      }
      if (nextReceipt.collisionRefusals > 0) {
        setPlanningError(
          "Kinematic owner refused a swept step; movement stopped before contact.",
        );
        ownerRef.current = null;
        animRef.current = null;
      } else if (!nextReceipt.completed) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        animRef.current = null;
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="rounded-2xl border border-orange-400/20 bg-slate-950/80 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-orange-300">
            KMR base: collision-aware household navigation
          </h3>
          <p className="text-xs text-slate-400">
            Click a floor point, select a room preset, or use the D-Pad / WASD / Arrow keys to drive the 4-mecanum mobile base in real-time with 2D LiDAR raycasting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 font-mono text-xs text-orange-200">
            X: {pose.x.toFixed(2)}m · Y: {pose.y.toFixed(2)}m · θ: {((pose.theta * 180) / Math.PI).toFixed(0)}°
          </span>
        </div>
      </div>

      {/* Room Destination Presets */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 mr-1">
          Route To:
        </span>
        {ROOM_DESTINATIONS.map((dest) => (
          <button
            key={dest.name}
            type="button"
            onClick={() => setWaypoint({ x: dest.x, y: dest.y })}
            className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-200 transition-colors"
          >
            {dest.name}
          </button>
        ))}
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-800">
        <Canvas
          camera={{ position: [0, 12, 8], fov: 50, near: 0.1, far: 40 }}
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <color attach="background" args={["#0c1322"]} />
          <ambientLight intensity={0.6} color="#fff1dc" />
          <directionalLight
            castShadow
            position={[5, 8, 5]}
            intensity={1.3}
            color="#fff5e6"
          />
          <KmrThreeScene
            pose={pose}
            path={path}
            dynamicReceipt={dynamicReceipt}
            onSetWaypoint={setWaypoint}
          />
        </Canvas>

        {/* Interactive Manual Mecanum Drive D-Pad */}
        <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex flex-col items-center gap-1">
          <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-white/15 bg-slate-950/85 p-2 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => handleManualDrive(0, 0, 0.15)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 active:scale-95"
                title="Rotate CCW (Q)"
              >
                ↺
              </button>
              <button
                type="button"
                onClick={() => handleManualDrive(0.15, 0)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-orange-200 hover:bg-orange-500/20 active:scale-95"
                title="Forward (W / ↑)"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleManualDrive(0, 0, -0.15)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 active:scale-95"
                title="Rotate CW (E)"
              >
                ↻
              </button>
              <button
                type="button"
                onClick={() => handleManualDrive(0, -0.15)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-orange-200 hover:bg-orange-500/20 active:scale-95"
                title="Strafe Left (A / ←)"
              >
                ◄
              </button>
              <button
                type="button"
                onClick={() => handleManualDrive(-0.15, 0)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-orange-200 hover:bg-orange-500/20 active:scale-95"
                title="Reverse (S / ↓)"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => handleManualDrive(0, 0.15)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-orange-200 hover:bg-orange-500/20 active:scale-95"
                title="Strafe Right (D / →)"
              >
                ►
              </button>
            </div>
          </div>
        </div>

        {!path ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="rounded-full border border-orange-300/40 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-orange-200 shadow-lg backdrop-blur-sm">
              Tap floor or use D-Pad / WASD to drive
            </div>
          </div>
        ) : null}
      </div>
      {planningError ? (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs text-red-300">
          {planningError}
        </p>
      ) : null}
      <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
        <span>
          Official whole-vehicle envelope: {Math.round(KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.lengthMeters * 1000)}×
          {Math.round(KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.widthMeters * 1000)}×
          {Math.round(KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.heightMeters * 1000)} mm,
          {" "}{KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.massKg} kg. Inner chassis and wheelbase are disclosed procedural assumptions.
        </span>
        <span className="sm:text-right">
          {path ? (
            <>
              Value path: {path.points.length} waypoints, {path.totalDistanceMeters.toFixed(2)} m,
              {" "}planned clearance {path.minimumClearanceMeters.toFixed(3)} m
            </>
          ) : (
            "No path yet"
          )}
        </span>
      </div>
      {receipt ? (
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-cyan-500/20 bg-cyan-950/10 p-3 font-mono text-[11px] text-cyan-100 sm:grid-cols-4">
          <span>owner: TS kinematic mecanum</span>
          <span>distance: {receipt.distanceTraveledMeters.toFixed(2)} m</span>
          <span>clearance: {receipt.minimumClearanceMeters.toFixed(3)} m</span>
          <span>refusals: {receipt.collisionRefusals}</span>
          <span>time: {receipt.elapsedSeconds.toFixed(2)} s</span>
          <span>gate: {receipt.waypointIndex + 1}/{receipt.totalWaypoints}</span>
          <span>
            wheels: {receipt.wheelSpeeds.speeds.map((speed) => speed.toFixed(1)).join(" / ")} rad/s
          </span>
          <span>{receipt.completed ? "goal reached" : "integrating"}</span>
        </div>
      ) : null}
      {dynamicReceipt ? (
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-amber-500/20 bg-amber-950/10 p-3 font-mono text-[11px] text-amber-100 sm:grid-cols-4">
          <span>matter owner: household contact/LCP TS</span>
          <span>base-chair contacts: {dynamicReceipt.cumulativeBaseChairContacts}</span>
          <span>
            chair speed: {Math.hypot(...dynamicReceipt.chairVelocityMps).toFixed(3)} m/s
          </span>
          <span>LCP residual: {dynamicReceipt.lcpMaxResidual.toExponential(2)}</span>
        </div>
      ) : null}
    </div>
  );
}
