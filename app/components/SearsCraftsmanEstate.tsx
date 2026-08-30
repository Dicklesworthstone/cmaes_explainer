"use client";

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// High-Resolution Procedural Texture Generators (Three.js Skill Doctrine)
// ---------------------------------------------------------------------------

function createOakHardwoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base warm quartersawn oak tone
  ctx.fillStyle = "#825024";
  ctx.fillRect(0, 0, 1024, 1024);

  const plankCount = 16;
  const plankWidth = 1024 / plankCount;

  for (let i = 0; i < plankCount; i++) {
    const x = i * plankWidth;
    const toneShift = (Math.sin(i * 997) * 0.5 + 0.5) * 28 - 14;
    const r = Math.min(255, Math.max(0, 134 + toneShift));
    const g = Math.min(255, Math.max(0, 84 + toneShift * 0.75));
    const b = Math.min(255, Math.max(0, 38 + toneShift * 0.45));

    ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
    ctx.fillRect(x, 0, plankWidth, 1024);

    // Wood grain lines
    ctx.strokeStyle = "rgba(45, 20, 5, 0.16)";
    ctx.lineWidth = 1;
    for (let gIdx = 0; gIdx < 30; gIdx++) {
      const gx = x + (Math.sin(gIdx * 13.7) * 0.5 + 0.5) * plankWidth;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.bezierCurveTo(
        gx + (Math.sin(gIdx) * 6),
        340,
        gx - (Math.cos(gIdx) * 6),
        680,
        gx + (Math.sin(gIdx * 2) * 4),
        1024
      );
      ctx.stroke();
    }

    // Quartersawn medullary ray flecks
    ctx.fillStyle = "rgba(235, 195, 140, 0.25)";
    for (let f = 0; f < 25; f++) {
      const fy = (Math.sin(i * 31 + f * 17) * 0.5 + 0.5) * 1000;
      const fx = x + (Math.cos(f * 43) * 0.5 + 0.5) * (plankWidth - 12);
      ctx.fillRect(fx, fy, 8 + (f % 5) * 3, 2 + (f % 3));
    }

    // Staggered plank butt joints
    ctx.strokeStyle = "rgba(25, 10, 5, 0.8)";
    ctx.lineWidth = 2.5;
    const buttY1 = ((i * 347) % 700) + 150;
    const buttY2 = ((i * 613) % 700) + 150;
    ctx.beginPath();
    ctx.moveTo(x, buttY1);
    ctx.lineTo(x + plankWidth, buttY1);
    ctx.moveTo(x, buttY2);
    ctx.lineTo(x + plankWidth, buttY2);
    ctx.stroke();

    // Plank seam groove
    ctx.strokeStyle = "rgba(20, 10, 4, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function createHexMosaicTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark charcoal grout
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, 512, 512);

  const hexRadius = 16;
  const hexWidth = Math.sqrt(3) * hexRadius;
  const hexHeight = 2 * hexRadius * 0.75;

  for (let row = -1; row < 512 / hexHeight + 2; row++) {
    for (let col = -1; col < 512 / hexWidth + 2; col++) {
      const cx = col * hexWidth + (row % 2) * (hexWidth / 2);
      const cy = row * hexHeight;

      // Subtle pattern: occasional black accent tile
      const isBlack = (col * 3 + row * 7) % 13 === 0;
      ctx.fillStyle = isBlack ? "#181818" : "#f4f3ef";

      ctx.beginPath();
      for (let side = 0; side < 6; side++) {
        const angle = (side * Math.PI) / 3 + Math.PI / 6;
        const x = cx + (hexRadius - 1.5) * Math.cos(angle);
        const y = cy + (hexRadius - 1.5) * Math.sin(angle);
        if (side === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

function createClinkerBrickTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Mortar base
  ctx.fillStyle = "#baa894";
  ctx.fillRect(0, 0, 512, 512);

  const rows = 16;
  const cols = 8;
  const rowH = 512 / rows;
  const colW = 512 / cols;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const offset = (r % 2) * (colW / 2);
    for (let c = -1; c <= cols; c++) {
      const x = c * colW + offset;
      const seed = Math.sin(r * 37 + c * 19);
      const isClinker = seed > 0.4;

      let rCol = 145 + seed * 30;
      let gCol = 52 + seed * 18;
      let bCol = 32 + seed * 12;
      if (isClinker) {
        rCol = 60 + seed * 20;
        gCol = 32 + seed * 10;
        bCol = 22 + seed * 8;
      }

      ctx.fillStyle = `rgb(${rCol | 0}, ${gCol | 0}, ${bCol | 0})`;
      ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createAmberMicaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#e89228";
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 180; i++) {
    const x = (Math.sin(i * 19.3) * 0.5 + 0.5) * 256;
    const y = (Math.cos(i * 27.7) * 0.5 + 0.5) * 256;
    const size = 6 + (i % 12);
    const alpha = 0.15 + (i % 5) * 0.08;
    ctx.fillStyle = i % 2 === 0 ? `rgba(255, 235, 170, ${alpha})` : `rgba(160, 75, 15, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size * 0.4);
    ctx.lineTo(x + size * 0.8, y + size);
    ctx.lineTo(x - size * 0.3, y + size * 0.7);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ---------------------------------------------------------------------------
// Sears Craftsman Estate (Complete 7-Room Whole-House Architectural Rig)
// ---------------------------------------------------------------------------

export interface SearsCraftsmanEstateProps {
  showFurniture?: boolean;
  activeRoom?: "all" | "living" | "dining" | "kitchen" | "porch" | "bedroom" | "bathroom" | "cutaway";
  timeOfDay?: "afternoon-sun" | "golden-hour" | "evening-glow";
}

export function SearsCraftsmanEstate({
  showFurniture = true,
  activeRoom = "living",
  timeOfDay = "afternoon-sun",
}: SearsCraftsmanEstateProps) {
  // 1. Texture caching & disposal
  const textures = useMemo(() => {
    if (typeof document === "undefined") return null;
    return {
      hardwood: createOakHardwoodTexture(),
      hexMosaic: createHexMosaicTileTexture(),
      brick: createClinkerBrickTexture(),
      mica: createAmberMicaTexture(),
    };
  }, []);

  useEffect(() => {
    return () => {
      if (textures) {
        textures.hardwood.dispose();
        textures.hexMosaic.dispose();
        textures.brick.dispose();
        textures.mica.dispose();
      }
    };
  }, [textures]);

  // 2. High quality PBR architectural materials
  const materials = useMemo(() => {
    const oakWood = new THREE.MeshStandardMaterial({
      color: "#543314",
      roughness: 0.42,
      metalness: 0.06,
      map: textures?.hardwood ?? null,
    });

    const fumedDarkOak = new THREE.MeshStandardMaterial({
      color: "#301a0a",
      roughness: 0.46,
      metalness: 0.05,
    });

    const livingFloor = new THREE.MeshStandardMaterial({
      color: "#734017",
      roughness: 0.28,
      metalness: 0.08,
      map: textures?.hardwood ?? null,
    });

    const kitchenTile = new THREE.MeshStandardMaterial({
      color: "#c25a38", // Terracotta quarry tile
      roughness: 0.65,
      metalness: 0.05,
    });

    const bathroomTile = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.22,
      metalness: 0.08,
      map: textures?.hexMosaic ?? null,
    });

    const porchDecking = new THREE.MeshStandardMaterial({
      color: "#58422e",
      roughness: 0.58,
      metalness: 0.02,
      map: textures?.hardwood ?? null,
    });

    const plasterWall = new THREE.MeshStandardMaterial({
      color: "#ece3d0", // Warm Craftsman oat plaster
      roughness: 0.88,
      metalness: 0.02,
    });

    const subwayTile = new THREE.MeshStandardMaterial({
      color: "#f8f8f6",
      roughness: 0.18,
      metalness: 0.1,
    });

    const clinkerBrick = new THREE.MeshStandardMaterial({
      color: "#6b2c1c",
      roughness: 0.82,
      metalness: 0.05,
      map: textures?.brick ?? null,
    });

    const hearthStone = new THREE.MeshStandardMaterial({
      color: "#282624",
      roughness: 0.72,
      metalness: 0.12,
    });

    const amberMica = new THREE.MeshStandardMaterial({
      color: "#f59e0b",
      emissive: "#d97706",
      emissiveIntensity: timeOfDay === "evening-glow" ? 2.5 : 1.2,
      roughness: 0.35,
      metalness: 0.1,
      map: textures?.mica ?? null,
    });

    const antiqueBrass = new THREE.MeshStandardMaterial({
      color: "#b59453",
      roughness: 0.32,
      metalness: 0.82,
    });

    const castIron = new THREE.MeshStandardMaterial({
      color: "#22252a",
      roughness: 0.55,
      metalness: 0.75,
    });

    const whiteEnamel = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.14,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });

    const leatherUpholstery = new THREE.MeshStandardMaterial({
      color: "#3d2414",
      roughness: 0.45,
      metalness: 0.12,
    });

    const oliveWool = new THREE.MeshStandardMaterial({
      color: "#4d5840",
      roughness: 0.88,
      metalness: 0.0,
    });

    const leadedGlass = new THREE.MeshPhysicalMaterial({
      color: "#d4e9f7",
      transparent: true,
      opacity: 0.35,
      roughness: 0.12,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.52,
    });

    const riverStone = new THREE.MeshStandardMaterial({
      color: "#6e685f",
      roughness: 0.9,
      metalness: 0.05,
    });

    return {
      oakWood,
      fumedDarkOak,
      livingFloor,
      kitchenTile,
      bathroomTile,
      porchDecking,
      plasterWall,
      subwayTile,
      clinkerBrick,
      hearthStone,
      amberMica,
      antiqueBrass,
      castIron,
      whiteEnamel,
      leatherUpholstery,
      oliveWool,
      leadedGlass,
      riverStone,
    };
  }, [textures, timeOfDay]);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  // House Floorplan Layout (Ashmore 1928 Craftsman Bungalow):
  // Total envelope: X: [-4.0, +4.0] (8.0m wide), Z: [-4.5, +5.5] (10.0m deep), Height: 2.85m
  // Porch:     X: [-3.8, +3.8], Z: [3.8, 5.5]
  // Living:    X: [-3.8, 0.4],  Z: [0.0, 3.8] (where robot walks from X=0 to 2.0)
  // Dining:    X: [0.4, 3.8],   Z: [0.6, 3.8]
  // Kitchen:   X: [0.4, 3.8],   Z: [-2.6, 0.6]
  // Hallway:   X: [-0.8, 0.4],  Z: [-1.8, 0.0]
  // Bedroom:   X: [-3.8, -0.8], Z: [-3.8, 0.0]
  // Bathroom:  X: [-0.8, 0.8],  Z: [-3.8, -1.8]

  return (
    <group>
      {/* ----------------------------------------------------------------- */}
      {/* 1. Complete Multi-Room Flooring System                             */}
      {/* ----------------------------------------------------------------- */}
      {/* Front Porch Tongue-and-Groove Fir Decking */}
      <mesh position={[0, 0, 4.65]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.6, 1.7]} />
        <primitive object={materials.porchDecking} attach="material" />
      </mesh>

      {/* Living Room & Central Hall Quartersawn Oak Flooring */}
      <mesh position={[-1.7, 0, 1.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 3.8]} />
        <primitive object={materials.livingFloor} attach="material" />
      </mesh>

      {/* Dining Room Quartersawn Oak Flooring */}
      <mesh position={[2.1, 0, 2.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.4, 3.2]} />
        <primitive object={materials.livingFloor} attach="material" />
      </mesh>

      {/* Kitchen Terracotta Quarry Tile Floor */}
      <mesh position={[2.1, 0, -1.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.4, 3.2]} />
        <primitive object={materials.kitchenTile} attach="material" />
      </mesh>

      {/* Master Bedroom Oak Floor */}
      <mesh position={[-2.3, 0, -1.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.0, 3.8]} />
        <primitive object={materials.livingFloor} attach="material" />
      </mesh>

      {/* Bathroom Hexagonal Porcelain Mosaic Tile Floor */}
      <mesh position={[0, 0, -2.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.6, 2.0]} />
        <primitive object={materials.bathroomTile} attach="material" />
      </mesh>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Front Veranda / Porch Architectural Detail                     */}
      {/* ----------------------------------------------------------------- */}
      <group position={[0, 0, 5.4]}>
        {/* Riverstone Foundation Piers & Double Tapered Square Columns */}
        {[-3.6, 0, 3.6].map((px, idx) => (
          <group key={idx} position={[px, 0, 0]}>
            {/* Riverstone Pier Base */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.65, 0.9, 0.65]} />
              <primitive object={materials.riverStone} attach="material" />
            </mesh>
            {/* Battered Square Wood Column */}
            <mesh position={[0, 1.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.26, 1.7, 0.26]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Porch Header Beam */}
        <mesh position={[0, 2.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.8, 0.24, 0.3]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>

        {/* Slatted Front Porch Swing with Brass Suspension Chains */}
        {showFurniture && (
          <group position={[-2.2, 0.45, -0.6]}>
            {/* Swing Seat & Back */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.45, 0.08, 0.58]} />
              <primitive object={materials.oakWood} attach="material" />
            </mesh>
            <mesh position={[0, 0.48, 0.26]} castShadow receiveShadow>
              <boxGeometry args={[1.45, 0.48, 0.05]} />
              <primitive object={materials.oakWood} attach="material" />
            </mesh>
            {/* Brass Suspension Chains */}
            {[-0.68, 0.68].map((cx, cIdx) => (
              <mesh key={cIdx} position={[cx, 1.25, 0]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 1.8, 6]} />
                <primitive object={materials.antiqueBrass} attach="material" />
              </mesh>
            ))}
          </group>
        )}

        {/* Craftsman Entry Door with Vertical Leaded Lights */}
        <group position={[0, 0, -1.6]}>
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.05, 2.25, 0.08]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
          {/* Vertical Glass Lights */}
          {[-0.22, 0, 0.22].map((gx, gIdx) => (
            <mesh key={gIdx} position={[gx, 1.68, 0.02]}>
              <planeGeometry args={[0.14, 0.68]} />
              <primitive object={materials.leadedGlass} attach="material" />
            </mesh>
          ))}
          {/* Antique Bronze Thumb-Latch Hardware */}
          <mesh position={[0.42, 1.05, 0.05]} castShadow>
            <boxGeometry args={[0.04, 0.18, 0.04]} />
            <primitive object={materials.antiqueBrass} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 3. Living Room (Parlor) Inglenook Fireplace & Wainscoting         */}
      {/* ----------------------------------------------------------------- */}
      <group position={[-1.7, 0, 0]}>
        {/* Back Wall (Z = 0) with Wainscoting and Plaster */}
        <mesh position={[0, 2.1, 0]} receiveShadow castShadow>
          <planeGeometry args={[4.2, 1.5]} />
          <primitive object={materials.plasterWall} attach="material" />
        </mesh>
        <mesh position={[0, 0.675, 0.01]} receiveShadow>
          <planeGeometry args={[4.2, 1.35]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>

        {/* Sears Clinker Brick Fireplace Breast */}
        <group position={[-1.2, 0, 0.02]}>
          <mesh position={[0, 1.3, 0.22]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 2.6, 0.44]} />
            <primitive object={materials.clinkerBrick} attach="material" />
          </mesh>
          <mesh position={[0, 0.12, 0.48]} castShadow receiveShadow>
            <boxGeometry args={[2.1, 0.24, 0.54]} />
            <primitive object={materials.hearthStone} attach="material" />
          </mesh>
          {/* Firebox */}
          <mesh position={[0, 0.65, 0.38]}>
            <boxGeometry args={[0.88, 0.72, 0.34]} />
            <meshStandardMaterial color="#1a1816" roughness={0.95} />
          </mesh>
          {/* Glowing Embers */}
          <mesh position={[0, 0.3, 0.38]}>
            <boxGeometry args={[0.48, 0.1, 0.2]} />
            <meshStandardMaterial
              color="#ff4500"
              emissive="#ff3300"
              emissiveIntensity={timeOfDay === "evening-glow" ? 4.5 : 2.0}
            />
          </mesh>
          <pointLight
            position={[0, 0.45, 0.45]}
            color="#ff7a33"
            intensity={timeOfDay === "evening-glow" ? 9 : 4}
            distance={3.8}
            decay={2}
          />
          {/* Solid Oak Mantel */}
          <mesh position={[0, 1.48, 0.46]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.12, 0.34]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
          {/* Mantel Corbels */}
          {[-0.75, 0.75].map((cx, idx) => (
            <mesh key={idx} position={[cx, 1.34, 0.38]} castShadow>
              <boxGeometry args={[0.12, 0.18, 0.16]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
          ))}
          {/* Framed Landscape Painting */}
          <mesh position={[0, 2.05, 0.43]} castShadow>
            <boxGeometry args={[1.05, 0.7, 0.03]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
          <mesh position={[0, 2.05, 0.45]}>
            <planeGeometry args={[0.92, 0.56]} />
            <meshStandardMaterial color="#826c4a" roughness={0.75} />
          </mesh>
        </group>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 4. Formal Dining Room & Built-in China Buffet                     */}
      {/* ----------------------------------------------------------------- */}
      <group position={[2.1, 0, 0]}>
        {/* Built-in China Buffet / Sideboard */}
        {showFurniture && (
          <group position={[0, 0, 0.2]}>
            {/* Lower Credenza Cabinet with Dovetail Drawers */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.2, 0.98, 0.48]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {/* Upper Leaded Glass Display Cabinets */}
            {[-0.75, 0.75].map((bx, idx) => (
              <group key={idx} position={[bx, 1.45, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.62, 0.88, 0.36]} />
                  <primitive object={materials.fumedDarkOak} attach="material" />
                </mesh>
                <mesh position={[0, 0, 0.19]}>
                  <planeGeometry args={[0.54, 0.78]} />
                  <primitive object={materials.leadedGlass} attach="material" />
                </mesh>
              </group>
            ))}
            {/* Center Beveled Splashback Mirror */}
            <mesh position={[0, 1.35, 0.02]}>
              <planeGeometry args={[0.78, 0.65]} />
              <meshStandardMaterial color="#c0c8d0" roughness={0.08} metalness={0.9} />
            </mesh>

            {/* Craftsman Trestle Dining Table & Chairs */}
            <group position={[0, 0, 1.8]}>
              {/* Trestle Table Top */}
              <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.72, 0.06, 0.94]} />
                <primitive object={materials.oakWood} attach="material" />
              </mesh>
              {/* End Trestles */}
              {[-0.65, 0.65].map((tx, idx) => (
                <mesh key={idx} position={[tx, 0.36, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.08, 0.72, 0.72]} />
                  <primitive object={materials.fumedDarkOak} attach="material" />
                </mesh>
              ))}
              {/* Keyed Center Stretcher Beam */}
              <mesh position={[0, 0.22, 0]} castShadow>
                <boxGeometry args={[1.48, 0.08, 0.06]} />
                <primitive object={materials.fumedDarkOak} attach="material" />
              </mesh>
            </group>
          </group>
        )}
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 5. Kitchen: Hoosier Cabinet, Cast-Iron Range & Farmhouse Sink     */}
      {/* ----------------------------------------------------------------- */}
      {showFurniture && (
        <group position={[2.1, 0, -2.6]}>
          {/* Hoosier Baking Cabinet Workstation */}
          <group position={[-1.0, 0, 0.3]}>
            {/* Lower Base Cabinet */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.88, 0.65]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
            {/* Pull-out White Porcelain Work Table */}
            <mesh position={[0, 0.89, 0.08]} castShadow receiveShadow>
              <boxGeometry args={[1.24, 0.04, 0.78]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
            {/* Upper Hutch with Roll-top Tambour Door */}
            <mesh position={[0, 1.45, -0.12]} castShadow receiveShadow>
              <boxGeometry args={[1.18, 0.92, 0.38]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
          </group>

          {/* Glenwood 1928 4-Burner Cast Iron Cooking Range */}
          <group position={[0.7, 0, 0.3]}>
            <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.92, 0.95, 0.68]} />
              <primitive object={materials.castIron} attach="material" />
            </mesh>
            {/* Elevated Baking Oven on Left */}
            <mesh position={[-0.24, 1.22, -0.05]} castShadow>
              <boxGeometry args={[0.42, 0.52, 0.52]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
            {/* Cooktop Burners */}
            {[[-0.2, 0.15], [0.2, 0.15], [-0.2, -0.15], [0.2, -0.15]].map(([bx, bz], idx) => (
              <mesh key={idx} position={[bx, 0.97, bz]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.08, 0.012, 8, 24]} />
                <primitive object={materials.castIron} attach="material" />
              </mesh>
            ))}
          </group>

          {/* Apron-Front Farmhouse Porcelain Sink */}
          <group position={[1.4, 0, 1.5]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.32, 0.88, 0.56]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
            {/* Brass Gooseneck Faucet */}
            <mesh position={[0, 0.98, -0.18]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.22, 12]} />
              <primitive object={materials.antiqueBrass} attach="material" />
            </mesh>
          </group>
        </group>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 6. Master Bedroom & Bathroom Suites                               */}
      {/* ----------------------------------------------------------------- */}
      {showFurniture && (
        <group position={[-2.3, 0, -2.2]}>
          {/* Roycroft-style Craftsman Slatted Queen Bedstead */}
          <group position={[0, 0, 0]}>
            {/* High Headboard */}
            <mesh position={[0, 0.65, -0.98]} castShadow receiveShadow>
              <boxGeometry args={[1.62, 1.25, 0.08]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {/* Footboard */}
            <mesh position={[0, 0.4, 0.98]} castShadow receiveShadow>
              <boxGeometry args={[1.62, 0.78, 0.08]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {/* Mattress with Patchwork Quilt */}
            <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.28, 1.9]} />
              <primitive object={materials.oliveWool} attach="material" />
            </mesh>
            {/* Pillows */}
            {[-0.42, 0.42].map((px, idx) => (
              <mesh key={idx} position={[px, 0.58, -0.72]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.48, 0.14, 0.32]} />
                <meshStandardMaterial color="#f0ede6" roughness={0.8} />
              </mesh>
            ))}
          </group>

          {/* Clawfoot Bathtub in Bathroom */}
          <group position={[2.3, 0, -0.6]}>
            <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.58, 0.58, 0.72]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
            {/* Ball & Claw Brass Feet */}
            {[[-0.65, -0.28], [0.65, -0.28], [-0.65, 0.28], [0.65, 0.28]].map(([fx, fz], idx) => (
              <mesh key={idx} position={[fx, 0.06, fz]} castShadow>
                <sphereGeometry args={[0.06, 12, 8]} />
                <primitive object={materials.antiqueBrass} attach="material" />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 7. Exposed Coffered Ceiling Box Beams Overhead                    */}
      {/* ----------------------------------------------------------------- */}
      <group position={[0, 2.82, 1.8]}>
        {/* Ceiling Plaster Panels */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.0, 7.6]} />
          <meshStandardMaterial color="#f8f4ec" roughness={0.92} />
        </mesh>

        {/* Longitudinal Heavy Timber Beams */}
        {[-2.8, -0.9, 0.9, 2.8].map((bx, idx) => (
          <mesh key={idx} position={[bx, -0.09, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.18, 0.18, 7.6]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
        ))}

        {/* Transverse Cross Beams */}
        {[-2.5, -0.8, 0.8, 2.5].map((bz, idx) => (
          <mesh key={idx} position={[0, -0.09, bz]} castShadow receiveShadow>
            <boxGeometry args={[8.0, 0.18, 0.18]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
        ))}

        {/* Central Craftsman Lantern Chandelier in Living Room */}
        <group position={[-1.7, -0.55, 0.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.32, 0.48]} />
            <primitive object={materials.amberMica} attach="material" />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.52, 0.34, 0.52]} />
            <meshStandardMaterial color="#2d261e" wireframe roughness={0.3} metalness={0.8} />
          </mesh>
          <pointLight
            color="#f59e0b"
            intensity={timeOfDay === "evening-glow" ? 15 : 6}
            distance={5.2}
            decay={2}
          />
        </group>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 8. Physically Realistic PBR Daylight & Sunlight Lighting Rig      */}
      {/* ----------------------------------------------------------------- */}
      <hemisphereLight
        args={[
          timeOfDay === "evening-glow" ? "#fed7aa" : "#e0f2fe",
          "#6e350a",
          timeOfDay === "evening-glow" ? 0.85 : 1.45,
        ]}
      />

      {/* Strong Afternoon Sunlight Streaming through West Windows */}
      <directionalLight
        castShadow
        position={[-5.5, 5.0, 2.5]}
        target-position={[-0.5, 0.5, 1.5]}
        intensity={timeOfDay === "evening-glow" ? 1.6 : 4.2}
        color={timeOfDay === "evening-glow" ? "#fdba74" : "#fff8eb"}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00015}
        shadow-camera-left={-5.0}
        shadow-camera-right={5.0}
        shadow-camera-top={5.0}
        shadow-camera-bottom={-4.0}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
      />

      {/* Warm Wood Surface Bounce Fill Light */}
      <directionalLight
        position={[3.5, 3.2, 4.0]}
        intensity={0.7}
        color="#fed7aa"
      />
    </group>
  );
}
