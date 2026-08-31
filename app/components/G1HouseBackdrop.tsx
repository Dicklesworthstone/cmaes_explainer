"use client";

/**
 * @experimental
 *
 * Standalone Three.js scene that builds the 1928 Craftsman bungalow
 * furniture + walls + room goals as a backdrop for the humanoid stage.
 * Same source data as the production backdrop used inside
 * `G1WalkingFlagship.tsx` (which composes the backdrop inline via
 * `CraftsmanLivingRoom` and other helpers), so this file is a
 * near-duplicate that nothing currently imports (verified Aug 2026).
 *
 * Per the project's no-deletion-without-permission policy, this file
 * is preserved as-is. If a future agent needs a reusable, decoupled
 * backdrop (e.g. for a static landing page hero), this is the right
 * starting point - remove this JSDoc and wire it in. Otherwise, leave
 * it alone; do not edit its visuals.
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { CRAFTSMAN_BUNGALOW_1928, type HouseFurniture, type HouseWall } from "../lib/houseScenes";
import { buildFurniture, CRAFTSMAN_PALETTE } from "../lib/houseFurniture";

export interface G1HouseBackdropProps {
  showFurniture?: boolean;
  showWalls?: boolean;
  showGoals?: boolean;
  activeRoom?: string;
  furnitureFilter?: (f: HouseFurniture) => boolean;
}

/**
 * Transforms an owner-frame 2D coordinate [x, y] to Three.js 3D coordinates [x, y, z]:
 * In owner frame: x is lateral (Three.js x), y is forward (Three.js -z), z is up (Three.js y).
 */
function ownerToThree(x: number, y: number, z = 0): [number, number, number] {
  return [x, z, -y];
}

export function G1HouseBackdrop({
  showFurniture = true,
  showWalls = true,
  showGoals = true,
  activeRoom,
  furnitureFilter,
}: G1HouseBackdropProps) {
  // 1. Build procedural furniture groups
  const furnitureMeshes = useMemo(() => {
    if (!showFurniture) return [];

    const items = CRAFTSMAN_BUNGALOW_1928.furniture.filter((f) => {
      if (activeRoom && f.room !== activeRoom) return false;
      if (furnitureFilter && !furnitureFilter(f)) return false;
      return true;
    });

    return items.map((f) => {
      const { group, dispose } = buildFurniture(f.name, f.size[0], f.size[1], f.height);
      const [tx, ty, tz] = ownerToThree(f.center[0], f.center[1], 0);

      // Enable shadow casting & receiving across all mesh parts
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      return {
        name: f.name,
        room: f.room,
        position: [tx, ty, tz] as [number, number, number],
        rotation: [0, f.rotation, 0] as [number, number, number],
        group,
        dispose,
      };
    });
  }, [showFurniture, activeRoom, furnitureFilter]);

  // Clean up procedural geometries and materials on unmount / change
  useEffect(() => {
    return () => {
      furnitureMeshes.forEach((item) => item.dispose());
    };
  }, [furnitureMeshes]);

  // 2. Build wall geometries with doorways
  const wallGeometries = useMemo(() => {
    if (!showWalls) return [];

    const walls: { geometry: THREE.BufferGeometry; position: [number, number, number]; rotation: number }[] = [];

    CRAFTSMAN_BUNGALOW_1928.walls.forEach((w: HouseWall) => {
      const dx = w.to[0] - w.from[0];
      const dy = w.to[1] - w.from[1];
      const length = Math.hypot(dx, dy);
      const angle = Math.atan2(-dy, dx); // Three.js Y-rotation

      const midX = (w.from[0] + w.to[0]) / 2;
      const midY = (w.from[1] + w.to[1]) / 2;
      const [tx, ty, tz] = ownerToThree(midX, midY, w.height / 2);

      if (w.doorways && w.doorways.length > 0) {
        // Wall with doorway: create composite shape
        const shape = new THREE.Shape();
        shape.moveTo(-length / 2, -w.height / 2);
        shape.lineTo(length / 2, -w.height / 2);
        shape.lineTo(length / 2, w.height / 2);
        shape.lineTo(-length / 2, w.height / 2);
        shape.lineTo(-length / 2, -w.height / 2);

        // Cut out doorway holes
        for (const door of w.doorways) {
          const doorCenterX = -length / 2 + door.at;
          const doorWidth = door.width;
          const doorHeight = Math.min(2.1, w.height * 0.85);

          const hole = new THREE.Path();
          hole.moveTo(doorCenterX - doorWidth / 2, -w.height / 2);
          hole.lineTo(doorCenterX + doorWidth / 2, -w.height / 2);
          hole.lineTo(doorCenterX + doorWidth / 2, -w.height / 2 + doorHeight);
          hole.lineTo(doorCenterX - doorWidth / 2, -w.height / 2 + doorHeight);
          hole.lineTo(doorCenterX - doorWidth / 2, -w.height / 2);
          shape.holes.push(hole);
        }

        const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
          depth: w.thickness,
          bevelEnabled: false,
        });
        extrudeGeo.center();
        walls.push({
          geometry: extrudeGeo,
          position: [tx, ty, tz],
          rotation: angle,
        });
      } else {
        // Solid wall box
        const boxGeo = new THREE.BoxGeometry(length, w.height, w.thickness);
        walls.push({
          geometry: boxGeo,
          position: [tx, ty, tz],
          rotation: angle,
        });
      }
    });

    return walls;
  }, [showWalls]);

  // Clean up wall geometries
  useEffect(() => {
    return () => {
      wallGeometries.forEach((w) => w.geometry.dispose());
    };
  }, [wallGeometries]);

  return (
    <group name="g1-sears-craftsman-house">
      {/* 1. Craftsman Parquet Hardwood Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
        <planeGeometry args={[10.0, 14.0]} />
        <meshStandardMaterial
          color={CRAFTSMAN_PALETTE.hardwoodFloor}
          roughness={0.52}
          metalness={0.08}
        />
      </mesh>

      {/* Parquet floor seam grid */}
      <gridHelper
        args={[14, 28, "#5c4033", "#4a2912"]}
        position={[0, 0.001, 0]}
      />

      {/* 2. Sears Craftsman Walls */}
      {showWalls &&
        wallGeometries.map((w, idx) => (
          <mesh
            key={`wall-${idx}`}
            geometry={w.geometry}
            position={w.position}
            rotation={[0, w.rotation, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={CRAFTSMAN_PALETTE.creamWalls}
              roughness={0.88}
              metalness={0.02}
            />
          </mesh>
        ))}

      {/* 3. Parameterized Physical Furniture */}
      {showFurniture &&
        furnitureMeshes.map((f) => (
          <group
            key={f.name}
            position={f.position}
            rotation={f.rotation}
          >
            <primitive object={f.group} />
          </group>
        ))}

      {/* 4. Room Waypoint / Goal Rings */}
      {showGoals &&
        CRAFTSMAN_BUNGALOW_1928.goals.map((g) => {
          const [gx, gy, gz] = ownerToThree(g.center[0], g.center[1], 0.02);
          return (
            <group key={g.name} position={[gx, gy, gz]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[g.radius * 0.85, g.radius, 32]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.65} side={THREE.DoubleSide} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[g.radius * 0.2, 16]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.85} />
              </mesh>
            </group>
          );
        })}

      {/* 5. Period Lighting Accents */}
      <pointLight position={[-1.4, 2.2, -2.6]} intensity={1.8} color="#fed7aa" distance={5.5} decay={2} />
      <pointLight position={[1.6, 2.4, -2.4]} intensity={2.2} color="#fef08a" distance={6.0} decay={2} />
      <pointLight position={[1.9, 2.3, 0.6]} intensity={2.0} color="#fef9c3" distance={5.0} decay={2} />
      <pointLight position={[-1.8, 2.0, 1.9]} intensity={1.4} color="#fdba74" distance={5.0} decay={2} />
    </group>
  );
}
