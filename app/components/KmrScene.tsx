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
  KUKA_KMR_IIWA_PUBLIC_SPEC,
} from "../lib/kmrGeometry";
import { scanLidar, KUKA_KMR_IIWA_LIDAR_DEFAULT } from "../lib/kmrLidar";
import { planWaypointPath, type WaypointPath } from "../lib/kmrWaypointNav";
import { CRAFTSMAN_BUNGALOW_1928 } from "../lib/houseScenes";
import type { OrientedBoundingBox } from "../lib/houseMultiObstacleKernel";

interface KmrPose {
  x: number;
  y: number;
  theta: number;
}

export interface KmrSceneProps {
  initialPose?: KmrPose;
}

function obstaclesFromCatalog(): OrientedBoundingBox[] {
  // Build a simple OBB list from the catalog furniture. Each
  // piece becomes a 2D footprint at its center.
  return CRAFTSMAN_BUNGALOW_1928.furniture.map((f) => ({
    id: f.name,
    name: f.name,
    center: [f.center[0], 0, f.center[1]],
    halfExtents: [f.size[0] / 2, 0.5, f.size[1] / 2],
    rotationYawRad: f.rotation,
  }));
}

function KmrThreeScene({
  pose,
  setPose,
  path,
  onSetWaypoint,
}: {
  pose: KmrPose;
  setPose: (p: KmrPose) => void;
  path: WaypointPath | null;
  onSetWaypoint: (world: { x: number; y: number }) => void;
}) {
  const materials = useMemo(() => defaultKmrMaterialSet(), []);
  const baseGroup = useMemo(
    () => buildKmrBaseMesh(KUKA_KMR_IIWA_PUBLIC_SPEC, materials),
    [materials],
  );
  const obstacles = useMemo(() => obstaclesFromCatalog(), []);
  const scan = useMemo(
    () => scanLidar(pose.x, pose.y, obstacles, KUKA_KMR_IIWA_LIDAR_DEFAULT),
    [pose.x, pose.y, obstacles],
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
        const cosA = Math.cos(r.angleRadians - pose.theta);
        const sinA = Math.sin(r.angleRadians - pose.theta);
        const x = pose.x + r.rangeMeters * cosA;
        const y = pose.y + r.rangeMeters * sinA;
        const z = KUKA_KMR_IIWA_PUBLIC_SPEC.mountingPlateHeightMeters + 0.06;
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
      {path && path.points.length > 1 ? (
        <line>
          <bufferGeometry
            attach="geometry"
            onUpdate={(g) => {
              const pos = g.getAttribute("position") as
                | { setXYZ: (i: number, x: number, y: number, z: number) => void; count: number }
                | undefined;
              if (!pos) return;
              for (let i = 0; i < path.points.length; i += 1) {
                pos.setXYZ(i, path.points[i][0], 0.02, path.points[i][1]);
              }
              pos.count = path.points.length;
            }}
          />
          <lineBasicMaterial color="#22d3ee" />
        </line>
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
  const [pose, setPose] = useState<KmrPose>(
    initialPose ?? { x: -3, y: -2, theta: 0 },
  );
  const [path, setPath] = useState<WaypointPath | null>(null);
  const obstacles = useMemo(() => obstaclesFromCatalog(), []);
  const animRef = useRef<number | null>(null);
  const pathRef = useRef<WaypointPath | null>(null);

  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  const setWaypoint = (target: { x: number; y: number }) => {
    const newPath = planWaypointPath(pose, target, obstacles);
    setPath(newPath.path);
    // Animate along the path.
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    const start = performance.now();
    const totalMs = Math.max(500, newPath.path.totalDistanceMeters * 1000);
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / totalMs);
      const idx = Math.min(
        newPath.path.points.length - 1,
        Math.floor(t * newPath.path.points.length),
      );
      const next = newPath.path.points[idx];
      if (next) {
        const prevIdx = Math.max(0, idx - 1);
        const prev = newPath.path.points[prevIdx];
        const dx = next[0] - prev[0];
        const dy = next[1] - prev[1];
        const theta = Math.atan2(dy, dx);
        setPose({ x: next[0], y: next[1], theta });
      }
      if (t < 1) {
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
            KMR + LBR iiwa: waypoint navigation
          </h3>
          <p className="text-xs text-slate-400">
            Click in the scene to set a goal. The KMR plans a path with
            multi-resolution clearance value iteration and drives the
            4 mecanum wheels along it.
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
            setPose={setPose}
            path={path}
            onSetWaypoint={setWaypoint}
          />
        </Canvas>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          KUKA KMR iiwa public spec, parameterized. 4 mecanum wheels,
          800×600×380 mm base.
        </span>
        <span>
          {path ? (
            <>
              Path: {path.points.length} waypoints,{" "}
              {path.totalDistanceMeters.toFixed(2)} m
            </>
          ) : (
            "No path yet"
          )}
        </span>
      </div>
    </div>
  );
}
