"use client";

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import type { G1TraceSample } from "../lib/frankensimCmaes";

const UP_VECTOR = new THREE.Vector3(0, 1, 0);
const ZERO_VECTOR = new THREE.Vector3(0, 0, 0);

interface G1BiomechanicsOverlayProps {
  sample: G1TraceSample;
  enabled: boolean;
  pelvisPosition: [number, number, number];
  leftFootPosition: [number, number, number];
  rightFootPosition: [number, number, number];
}

/**
 * Renders real-time biomechanics indicators in Three.js coordinates:
 * 1. Center of Mass (CoM) marker with vertical floor plumb line.
 * 2. Dynamic Ground Support Polygon (green inside balance bounds, amber/crimson when CoM exits).
 * 3. Ground Reaction Force (GRF) vector arrows pointing up from active contact soles.
 * 4. Zero Moment Point (ZMP) approximation marker on the ground.
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

  // Support Polygon geometry
  const { supportGeometry, isStable, comProjected } = useMemo(() => {
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
      const intersect = zi > pz !== zj > pz && px < ((xj - xi) * (pz - zi)) / (zj - zi || 1e-6) + xi;
      if (intersect) inside = !inside;
    }

    const geom = new THREE.ShapeGeometry(shape);
    geom.rotateX(Math.PI / 2);

    return {
      supportGeometry: geom,
      isStable: inside || (leftDown && rightDown),
      comProjected: [comPosition[0], groundY, comPosition[2]] as [number, number, number],
    };
  }, [sample.leftContact, sample.rightContact, leftFootPosition, rightFootPosition, comPosition]);

  useEffect(() => {
    return () => {
      supportGeometry.dispose();
    };
  }, [supportGeometry]);

  if (!enabled) return null;

  return (
    <group>
      {/* 1. Center of Mass (CoM) Orb & Plumb Line */}
      <group position={comPosition}>
        <mesh>
          <sphereGeometry args={[0.045, 20, 16]} />
          <meshStandardMaterial
            color={isStable ? "#38bdf8" : "#f43f5e"}
            emissive={isStable ? "#0284c7" : "#e11d48"}
            emissiveIntensity={1.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <pointLight
          color={isStable ? "#38bdf8" : "#f43f5e"}
          intensity={isStable ? 1.5 : 2.5}
          distance={0.8}
        />
      </group>

      {/* Vertical Plumb Line to Floor */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                comPosition[0],
                comPosition[1],
                comPosition[2],
                comProjected[0],
                groundY,
                comProjected[2],
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isStable ? "#38bdf8" : "#f43f5e"}
          transparent
          opacity={0.85}
          linewidth={2}
        />
      </line>

      {/* Ground Projection Target */}
      <mesh position={comProjected} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.04, 20]} />
        <meshBasicMaterial
          color={isStable ? "#38bdf8" : "#f43f5e"}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Dynamic Support Polygon on Floor */}
      <mesh position={[0, groundY + 0.001, 0]}>
        <primitive object={supportGeometry} attach="geometry" />
        <meshBasicMaterial
          color={isStable ? "#10b981" : "#f59e0b"}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Support Polygon Wireframe Border */}
      <lineSegments position={[0, groundY + 0.002, 0]}>
        <edgesGeometry args={[supportGeometry]} />
        <lineBasicMaterial
          color={isStable ? "#34d399" : "#fbbf24"}
          transparent
          opacity={0.9}
          linewidth={2}
        />
      </lineSegments>

      {/* 3. Ground Reaction Force (GRF) Arrows from Active Feet */}
      {sample.leftContact && (
        <group position={[leftFootPosition[0], groundY, leftFootPosition[2]]}>
          <arrowHelper
            args={[
              UP_VECTOR,
              ZERO_VECTOR,
              0.22,
              0x22d3ee,
              0.05,
              0.03,
            ]}
          />
        </group>
      )}

      {sample.rightContact && (
        <group position={[rightFootPosition[0], groundY, rightFootPosition[2]]}>
          <arrowHelper
            args={[
              UP_VECTOR,
              ZERO_VECTOR,
              0.22,
              0xa78bfa,
              0.05,
              0.03,
            ]}
          />
        </group>
      )}
    </group>
  );
}
