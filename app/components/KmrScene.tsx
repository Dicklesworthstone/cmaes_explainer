"use client";

// KMR scene: a separate Three.js canvas for the KUKA KMR mobile
// base with waypoint navigation and LiDAR scan visualization.
//
// This is a minimal-viable Phase 6 component. The KMR is rendered
// as a companion to the existing arm flagship (not under it) so
// the integration is additive: the arm and the KMR each have
// their own coordinate system and their own canvas.

import { useEffect, useMemo, useRef, useState } from "react";
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
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-orange-300">
            KMR base: collision-aware household navigation
          </h3>
          <p className="text-xs text-slate-400">
            Click a clear floor point. Global clearance value iteration feeds
            a fixed-step TS kinematic owner, which issues four mecanum-wheel
            commands and refuses swept contact with furniture or walls.
            The clearance proxy uses the procedural 600 mm chassis width plus
            a 20 mm margin; it is not a rigid-body certification of the larger
            official vehicle envelope.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          {pose.x.toFixed(2)} m, {pose.y.toFixed(2)} m
        </div>
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
        {!path ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="rounded-full border border-orange-300/40 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-orange-200 shadow-lg backdrop-blur-sm">
              Tap to set a waypoint
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
