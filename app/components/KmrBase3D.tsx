"use client";

// KMR base 3D component (Three.js).
//
// Renders the KUKA KMR iiwa base from the parameterized kmrGeometry
// module, plus a 2D LiDAR scan ring (procedural arc, color-coded by
// range) and an optional planned-path polyline.
//
// Coordinates: +x is forward, +y is left, +z is up (matches the
// KMR base frame used by the IK layer).

import { useMemo } from "react";
import {
  defaultKmrMaterialSet,
  buildKmrBaseMesh,
  KUKA_KMR_IIWA_PUBLIC_SPEC,
  type KmrGeometryConfig,
} from "../lib/kmrGeometry";
import { scanLidar, KUKA_KMR_IIWA_LIDAR_DEFAULT } from "../lib/kmrLidar";
import type { OrientedBoundingBox } from "../lib/houseMultiObstacleKernel";
import type { WaypointPath } from "../lib/kmrWaypointNav";

export interface KmrBase3DProps {
  // The KMR's pose in world space (x, y, yaw). z is fixed by the
  // mounting plate height (the KMR's top deck).
  xMeters: number;
  yMeters: number;
  yawRadians: number;
  // Scene obstacles (the same list used by the planner).
  obstacles: OrientedBoundingBox[];
  // Optional planned waypoint path (the planner result).
  plannedPath?: WaypointPath;
  // Configuration override (defaults to the public KMR iiwa spec).
  config?: KmrGeometryConfig;
}

const SCAN_RING_INNER_M = 0.55;
const SCAN_RING_OUTER_M = 0.6;

export function KmrBase3D(props: KmrBase3DProps) {
  const cfg = props.config ?? KUKA_KMR_IIWA_PUBLIC_SPEC;
  const materials = useMemo(() => defaultKmrMaterialSet(), []);
  const baseMesh = useMemo(
    () => buildKmrBaseMesh(cfg, materials),
    [cfg, materials],
  );

  // LiDAR scan as a procedural ring of colored dots at the KMR's
  // mounting plate height, sampled in the KMR's local frame.
  const scanDots = useMemo(() => {
    const scan = scanLidar(0, 0, props.obstacles);
    return scan.rays.map((r, i) => {
      const cosA = Math.cos(r.angleRadians);
      const sinA = Math.sin(r.angleRadians);
      const ringM = (SCAN_RING_INNER_M + SCAN_RING_OUTER_M) / 2.0;
      const x = ringM * cosA;
      const y = ringM * sinA;
      // Color: red for very close (1 m or less), yellow for mid-range
      // (1 to 3 m), green for far (more than 3 m). Standard LiDAR
      // visualization convention.
      const range = r.rangeMeters;
      const color =
        range < 1.0
          ? "#ef4444"
          : range < 3.0
            ? "#f59e0b"
            : "#22c55e";
      return { key: i, x, y, z: cfg.mountingPlateHeightMeters + 0.06, color };
    });
  }, [cfg, props.obstacles]);

  // Apply the world transform to the base mesh.
  const cosY = Math.cos(props.yawRadians);
  const sinY = Math.sin(props.yawRadians);
  const localToWorld = (x: number, y: number, z: number) => {
    // Rotate around +z (the KMR's yaw axis).
    return {
      x: cosY * x - sinY * y + props.xMeters,
      y: sinY * x + cosY * y + props.yMeters,
      z,
    };
  };

  return (
    <group name="kmr_base_3d">
      {baseMesh.children.map((child, i) => {
        // The base mesh is built around (0, 0, 0) with the KMR centered
        // at the origin. We translate the whole base by (xMeters, yMeters)
        // but do NOT rotate it here because each child is already placed
        // in the local frame; the KMR mesh has its yaw axis aligned with
        // the world +x by default. The yaw rotation is applied to the
        // scan dots and the planned path below.
        return (
          <primitive
            key={i}
            object={child}
            position={[props.xMeters, props.yMeters, 0]}
          />
        );
      })}
      {scanDots.map((dot) => {
        const p = localToWorld(dot.x, dot.y, dot.z);
        return (
          <mesh key={dot.key} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial color={dot.color} />
          </mesh>
        );
      })}
      {props.plannedPath && props.plannedPath.points.length > 1 ? (
        <line>
          <bufferGeometry
            attach="geometry"
            onUpdate={(g) => {
              const pos = g.getAttribute("position") as
                | { setXYZ: (i: number, x: number, y: number, z: number) => void; count: number }
                | undefined;
              if (!pos) return;
              const pts = props.plannedPath!.points;
              for (let i = 0; i < pts.length; i += 1) {
                const p = localToWorld(pts[i][0], pts[i][1], 0.02);
                pos.setXYZ(i, p.x, p.y, p.z);
              }
              pos.count = pts.length;
              
            }}
          />
          <lineBasicMaterial color="#22d3ee" />
        </line>
      ) : null}
    </group>
  );
}
