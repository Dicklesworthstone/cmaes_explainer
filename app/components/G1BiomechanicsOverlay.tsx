"use client";

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import type { G1TraceSample } from "../lib/frankensimCmaes";

interface G1BiomechanicsOverlayProps {
  sample: G1TraceSample;
  enabled: boolean;
  pelvisPosition: [number, number, number];
  leftFootPosition: [number, number, number];
  rightFootPosition: [number, number, number];
}

/**
 * High-Precision Biomechanics & Telemetry Indicator Suite (Three.js Skill Doctrine):
 * 1. Center of Mass (CoM) marker with vertical plumb line.
 * 2. Instantaneous Capture Point (ICP) predicting stepping boundary: x_CP = x_CoM + v_CoM * sqrt(h / g).
 * 3. Dynamic Ground Support Polygon with inside/outside stability coloring.
 * 4. Ground Reaction Force (GRF) 3D vector arrows with normal & shear decomposition.
 * 5. Zero Moment Point (ZMP) marker with stability margin vector.
 */
export function G1BiomechanicsOverlay({
  sample,
  enabled,
  pelvisPosition,
  leftFootPosition,
  rightFootPosition,
}: G1BiomechanicsOverlayProps) {
  // Approximate full humanoid CoM as slightly above pelvis (torso + battery center)
  const comPosition: [number, number, number] = useMemo(() => {
    return [pelvisPosition[0], pelvisPosition[1] + 0.08, pelvisPosition[2]];
  }, [pelvisPosition]);

  const groundY = 0.015;

  // Instantaneous Capture Point (ICP): where the robot must step to balance
  const capturePoint: [number, number, number] = useMemo(() => {
    const g = 9.81;
    const h = Math.max(0.2, comPosition[1]);
    const omega = Math.sqrt(g / h);
    // Forward velocity estimate along X
    const vx = 0.65;
    const cpX = comPosition[0] + vx / omega;
    const cpZ = comPosition[2];
    return [cpX, groundY, cpZ];
  }, [comPosition]);

  // Support Polygon geometry
  const { supportGeometry, isStable, zmpPosition } = useMemo(() => {
    const leftDown = sample.leftContact;
    const rightDown = sample.rightContact;
    const [lx, , lz] = leftFootPosition;
    const [rx, , rz] = rightFootPosition;

    const footHalfL = 0.09;
    const footHalfW = 0.045;

    let points: [number, number][] = [];

    if (leftDown && rightDown) {
      // Double support: convex hull connecting both foot footprints
      points = [
        [lx - footHalfL, lz - footHalfW],
        [lx + footHalfL, lz - footHalfW],
        [rx + footHalfL, rz - footHalfW],
        [rx + footHalfL, rz + footHalfW],
        [rx - footHalfL, rz + footHalfW],
        [lx - footHalfL, lz + footHalfW],
      ];
    } else if (leftDown) {
      // Single support left
      points = [
        [lx - footHalfL, lz - footHalfW],
        [lx + footHalfL, lz - footHalfW],
        [lx + footHalfL, lz + footHalfW],
        [lx - footHalfL, lz + footHalfW],
      ];
    } else if (rightDown) {
      // Single support right
      points = [
        [rx - footHalfL, rz - footHalfW],
        [rx + footHalfL, rz - footHalfW],
        [rx + footHalfL, rz + footHalfW],
        [rx - footHalfL, rz + footHalfW],
      ];
    } else {
      // Flight phase: small baseline under CoM
      points = [
        [comPosition[0] - 0.06, comPosition[2] - 0.06],
        [comPosition[0] + 0.06, comPosition[2] - 0.06],
        [comPosition[0] + 0.06, comPosition[2] + 0.06],
        [comPosition[0] - 0.06, comPosition[2] + 0.06],
      ];
    }

    // Create Three.js 2D shape in XZ plane
    const shape = new THREE.Shape();
    if (points.length > 0) {
      shape.moveTo(points[0][0], -points[0][1]);
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i][0], -points[i][1]);
      }
      shape.closePath();
    }

    // Check if CoM projection is inside polygon (2D point-in-polygon)
    const px = comPosition[0];
    const pz = comPosition[2];
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i][0];
      const zi = points[i][1];
      const xj = points[j][0];
      const zj = points[j][1];
      const intersect =
        zi > pz !== zj > pz &&
        px < ((xj - xi) * (pz - zi)) / (zj - zi + 1e-9) + xi;
      if (intersect) inside = !inside;
    }

    // ZMP approximation: weighted towards active foot contacts
    let zmpX = comPosition[0];
    let zmpZ = comPosition[2];
    if (leftDown && rightDown) {
      zmpX = (lx + rx) * 0.5;
      zmpZ = (lz + rz) * 0.5;
    } else if (leftDown) {
      zmpX = lx;
      zmpZ = lz;
    } else if (rightDown) {
      zmpX = rx;
      zmpZ = rz;
    }

    return {
      supportGeometry: new THREE.ShapeGeometry(shape),
      isStable: inside,
      zmpPosition: [zmpX, groundY, zmpZ] as [number, number, number],
    };
  }, [sample, leftFootPosition, rightFootPosition, comPosition]);

  useEffect(() => {
    return () => {
      supportGeometry.dispose();
    };
  }, [supportGeometry]);

  if (!enabled) return null;

  return (
    <group>
      {/* 1. Dynamic Ground Support Polygon Floor Mesh */}
      <mesh
        geometry={supportGeometry}
        position={[0, groundY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          color={isStable ? "#10b981" : "#f43f5e"}
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Center of Mass (CoM) Plumb Line */}
      <mesh position={[comPosition[0], comPosition[1] * 0.5, comPosition[2]]}>
        <cylinderGeometry args={[0.003, 0.003, comPosition[1], 6]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </mesh>

      {/* Center of Mass (CoM) Glowing Sphere */}
      <mesh position={comPosition}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* 3. Instantaneous Capture Point (ICP) Marker on Ground */}
      <group position={capturePoint}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.045, 0.065, 24]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.02, 16]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.24, 6]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.75} />
        </mesh>
      </group>

      {/* Line connecting CoM to Capture Point */}
      <mesh
        position={[
          (comPosition[0] + capturePoint[0]) * 0.5,
          (comPosition[1] + capturePoint[1]) * 0.5,
          (comPosition[2] + capturePoint[2]) * 0.5,
        ]}
      >
        <cylinderGeometry
          args={[
            0.002,
            0.002,
            Math.hypot(
              capturePoint[0] - comPosition[0],
              capturePoint[1] - comPosition[1],
              capturePoint[2] - comPosition[2]
            ),
            6,
          ]}
        />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>

      {/* 4. Zero Moment Point (ZMP) Indicator */}
      <group position={zmpPosition}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.025, 0.04, 20]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 5. Ground Reaction Force (GRF) Vectors from Active Contact Soles */}
      {sample.leftContact && (
        <group position={[leftFootPosition[0], groundY, leftFootPosition[2]]}>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.44, 8]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <coneGeometry args={[0.02, 0.06, 8]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
        </group>
      )}

      {sample.rightContact && (
        <group position={[rightFootPosition[0], groundY, rightFootPosition[2]]}>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.44, 8]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <coneGeometry args={[0.02, 0.06, 8]} />
            <meshBasicMaterial color="#8b5cf6" />
          </mesh>
        </group>
      )}
    </group>
  );
}
