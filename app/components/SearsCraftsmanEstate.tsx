"use client";

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import {
  CRAFTSMAN_WALKING_ROUTES,
  type CraftsmanWalkingRoute,
} from "../lib/craftsmanCatalogData";

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
        gx + Math.sin(gIdx) * 6,
        340,
        gx - Math.cos(gIdx) * 6,
        680,
        gx + Math.sin(gIdx * 2) * 4,
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

function createArtsAndCraftsRugTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep olive wool background
  ctx.fillStyle = "#3e4834";
  ctx.fillRect(0, 0, 512, 512);

  // Outer border - warm terracotta
  ctx.strokeStyle = "#8b4528";
  ctx.lineWidth = 24;
  ctx.strokeRect(12, 12, 488, 488);

  // Inner border - golden ochre lotus vine
  ctx.strokeStyle = "#c29547";
  ctx.lineWidth = 6;
  ctx.strokeRect(32, 32, 448, 448);

  // Corner Prairie motifs
  const corners = [
    [48, 48],
    [464, 48],
    [48, 464],
    [464, 464],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = "#c29547";
    ctx.fillRect(cx - 12, cy - 12, 24, 24);
    ctx.fillStyle = "#8b4528";
    ctx.fillRect(cx - 6, cy - 6, 12, 12);
  });

  // Central medallion
  ctx.strokeStyle = "#c29547";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#2d3526";
  ctx.fill();

  // Subtle woven yarn stippling
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 512, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
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
    ctx.fillStyle =
      i % 2 === 0
        ? `rgba(255, 235, 170, ${alpha})`
        : `rgba(160, 75, 15, ${alpha})`;
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
  showRoof?: boolean;
  showObstacleHulls?: boolean;
  activeRoom?:
    | "all"
    | "living"
    | "dining"
    | "kitchen"
    | "porch"
    | "bedroom"
    | "bathroom"
    | "cutaway";
  activeRouteId?: string;
  timeOfDay?: "afternoon-sun" | "golden-hour" | "evening-glow";
}

export function SearsCraftsmanEstate({
  showFurniture = true,
  showRoof = false,
  showObstacleHulls = false,
  activeRoom = "living",
  activeRouteId,
  timeOfDay = "afternoon-sun",
}: SearsCraftsmanEstateProps) {
  const activeRoute: CraftsmanWalkingRoute | undefined = activeRouteId
    ? CRAFTSMAN_WALKING_ROUTES.find((r) => r.id === activeRouteId)
    : undefined;

  // 1. Texture caching & disposal
  const textures = useMemo(() => {
    if (typeof document === "undefined") return null;
    return {
      hardwood: createOakHardwoodTexture(),
      rug: createArtsAndCraftsRugTexture(),
      hexMosaic: createHexMosaicTileTexture(),
      brick: createClinkerBrickTexture(),
      mica: createAmberMicaTexture(),
    };
  }, []);

  useEffect(() => {
    return () => {
      if (textures) {
        textures.hardwood.dispose();
        textures.rug.dispose();
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

    const craftsmanRugMat = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.85,
      metalness: 0.0,
      map: textures?.rug ?? null,
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

    const roofShingle = new THREE.MeshStandardMaterial({
      color: "#2a422e", // Classic Sears moss green asphalt shingles
      roughness: 0.86,
      metalness: 0.05,
    });

    const lawnGrass = new THREE.MeshStandardMaterial({
      color: "#2a5426",
      roughness: 0.92,
      metalness: 0.0,
    });

    const flagStone = new THREE.MeshStandardMaterial({
      color: "#606b74",
      roughness: 0.78,
      metalness: 0.05,
    });

    const potteryRookwood = new THREE.MeshStandardMaterial({
      color: "#3e6b48", // Matte green cucumber glaze
      roughness: 0.32,
      metalness: 0.08,
    });

    const potteryVanBriggle = new THREE.MeshStandardMaterial({
      color: "#68334b", // Matte mulberry glaze
      roughness: 0.35,
      metalness: 0.08,
    });

    return {
      oakWood,
      fumedDarkOak,
      livingFloor,
      craftsmanRugMat,
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
      roofShingle,
      lawnGrass,
      flagStone,
      potteryRookwood,
      potteryVanBriggle,
    };
  }, [textures, timeOfDay]);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  return (
    <group>
      {/* ----------------------------------------------------------------- */}
      {/* 0. Exterior Landscaping & Foundation Skirting                     */}
      {/* ----------------------------------------------------------------- */}
      {/* Green Lawn Perimeter */}
      <mesh position={[0, -0.01, 0.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <primitive object={materials.lawnGrass} attach="material" />
      </mesh>

      {/* Flagstone Cobblestone Garden Walkway */}
      <mesh position={[0, 0.002, 5.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.4, 4.8]} />
        <primitive object={materials.flagStone} attach="material" />
      </mesh>

      {/* Foundation Riverstone Skirting Base.

          It sits BELOW the floor line, spanning y in [-0.3, 0]. It used to be
          centred at y = +0.15, i.e. a solid 8.4 x 10.4 m block filling y in
          [0, 0.3] across the whole footprint and covering every room floor
          plane. The walking owner puts the robot's feet at y = 0.03, so the
          robot stood inside that block, buried to mid-shin, and the surface
          the viewer read as "the floor" was actually the top of the
          foundation. Skirting belongs under the floor it supports. */}
      <mesh position={[0, -0.15, -0.8]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 0.3, 10.4]} />
        <primitive object={materials.riverStone} attach="material" />
      </mesh>

      {/* ----------------------------------------------------------------- */}
      {/* 1. Complete Multi-Room Flooring System (Robot Walking Corridor Z=0) */}
      {/* ----------------------------------------------------------------- */}
      {/* Front Porch Tongue-and-Groove Fir Decking */}
      <mesh position={[0, 0, 2.75]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.6, 1.7]} />
        <primitive object={materials.porchDecking} attach="material" />
      </mesh>

      {/* Living Room & Central Hall Quartersawn Oak Flooring */}
      <mesh position={[-1.7, 0, 0.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.2, 3.8]} />
        <primitive object={materials.livingFloor} attach="material" />
      </mesh>

      {/* Living Room Woven Arts & Crafts Area Rug */}
      <mesh position={[-1.6, 0.003, 0.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 2.4]} />
        <primitive object={materials.craftsmanRugMat} attach="material" />
      </mesh>

      {/* Dining Room Quartersawn Oak Flooring & Runner Rug */}
      <mesh position={[2.1, 0, 0.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.4, 3.8]} />
        <primitive object={materials.livingFloor} attach="material" />
      </mesh>
      <mesh position={[2.1, 0.003, 0.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.6, 2.2]} />
        <primitive object={materials.craftsmanRugMat} attach="material" />
      </mesh>

      {/* Kitchen Terracotta Quarry Tile Floor */}
      <mesh position={[2.1, 0, -3.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.4, 2.6]} />
        <primitive object={materials.kitchenTile} attach="material" />
      </mesh>

      {/* Master Bedroom Oak Floor */}
      <mesh position={[-2.3, 0, -3.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.0, 2.6]} />
        <primitive object={materials.livingFloor} attach="material" />
      </mesh>

      {/* Bathroom Hexagonal Porcelain Mosaic Tile Floor */}
      <mesh position={[-0.2, 0, -3.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.2, 1.4]} />
        <primitive object={materials.bathroomTile} attach="material" />
      </mesh>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Front Veranda / Porch Architectural Detail                     */}
      {/* ----------------------------------------------------------------- */}
      <group position={[0, 0, 3.5]}>
        {/* Riverstone Foundation Piers & Double Tapered Square Columns */}
        {[-3.6, 0, 3.6].map((px, idx) => (
          <group key={idx} position={[px, 0, 0]}>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.65, 0.9, 0.65]} />
              <primitive object={materials.riverStone} attach="material" />
            </mesh>
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
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.45, 0.08, 0.58]} />
              <primitive object={materials.oakWood} attach="material" />
            </mesh>
            <mesh position={[0, 0.48, 0.26]} castShadow receiveShadow>
              <boxGeometry args={[1.45, 0.48, 0.05]} />
              <primitive object={materials.oakWood} attach="material" />
            </mesh>
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
          {[-0.22, 0, 0.22].map((gx, gIdx) => (
            <mesh key={gIdx} position={[gx, 1.68, 0.02]}>
              <planeGeometry args={[0.14, 0.68]} />
              <primitive object={materials.leadedGlass} attach="material" />
            </mesh>
          ))}
          <mesh position={[0.42, 1.05, 0.05]} castShadow>
            <boxGeometry args={[0.04, 0.18, 0.04]} />
            <primitive object={materials.antiqueBrass} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 3. Living Room (Parlor) Walls, Fireplace & Furnishings           */}
      {/* ----------------------------------------------------------------- */}
      <group position={[-1.7, 0, 0]}>
        {/* Back Wall (Z = -1.9) with Wainscoting and Plaster */}
        <mesh position={[0, 2.1, -1.9]} receiveShadow castShadow>
          <planeGeometry args={[4.2, 1.5]} />
          <primitive object={materials.plasterWall} attach="material" />
        </mesh>
        <mesh position={[0, 0.675, -1.89]} receiveShadow>
          <planeGeometry args={[4.2, 1.35]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>

        {/* Board and Batten Vertical Battens along Back Wall */}
        {[-1.8, -1.2, -0.6, 0.6, 1.2, 1.8].map((bx, bIdx) => (
          <mesh key={bIdx} position={[bx, 0.68, -1.87]} castShadow>
            <boxGeometry args={[0.08, 1.32, 0.03]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
        ))}

        {/* Plate Rail with Period Craftsman Art Pottery */}
        <mesh position={[0, 1.38, -1.84]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.05, 0.12]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>
        {[-1.8, 1.6].map((vx, vIdx) => (
          <mesh key={vIdx} position={[vx, 1.5, -1.84]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 0.18, 16]} />
            <primitive
              object={
                vIdx % 2 === 0
                  ? materials.potteryRookwood
                  : materials.potteryVanBriggle
              }
              attach="material"
            />
          </mesh>
        ))}

        {/* West Wall with Sears Clinker Brick Fireplace (at X = -2.1 in group, X = -3.8 in world) */}
        <group position={[-2.0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
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
          {/* Cast Iron Andirons */}
          {[-0.24, 0.24].map((ax, aIdx) => (
            <mesh key={aIdx} position={[ax, 0.4, 0.42]} castShadow>
              <boxGeometry args={[0.04, 0.24, 0.22]} />
              <primitive object={materials.castIron} attach="material" />
            </mesh>
          ))}
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
          {[-0.75, 0.75].map((cx, idx) => (
            <mesh key={idx} position={[cx, 1.34, 0.38]} castShadow>
              <boxGeometry args={[0.12, 0.18, 0.16]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
          ))}
          {/* Framed Painting over Mantel */}
          <mesh position={[0, 2.05, 0.43]} castShadow>
            <boxGeometry args={[1.05, 0.7, 0.03]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
        </group>

        {/* Gustav Stickley Morris Reclining Armchair (Safely placed near fireplace, away from corridor) */}
        {showFurniture && (
          <group position={[-1.2, 0, 0.9]}>
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.85, 0.42, 0.85]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.78, 0.18, 0.78]} />
              <primitive object={materials.leatherUpholstery} attach="material" />
            </mesh>
            <mesh position={[0, 0.72, -0.38]} rotation={[-0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.75, 0.65, 0.14]} />
              <primitive object={materials.leatherUpholstery} attach="material" />
            </mesh>
          </group>
        )}
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 4. Colonnade Room Divider & Formal Dining Room                     */}
      {/* ----------------------------------------------------------------- */}
      {/* Cased Colonnade with Built-in Bookcases (Dividing Living & Dining) */}
      <group position={[0.4, 0, 0]}>
        {[-1.4, 1.4].map((colZ, idx) => (
          <group key={idx} position={[0, 0, colZ]}>
            <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.42, 1.1, 0.85]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {[-0.18, 0.18].map((bx, bIdx) => (
              <mesh key={bIdx} position={[0.02, 0.45, bx]} castShadow>
                <boxGeometry args={[0.3, 0.28, 0.32]} />
                <meshStandardMaterial
                  color={
                    bIdx === 0
                      ? "#7f1d1d"
                      : idx === 0
                      ? "#1e3a8a"
                      : "#14532d"
                  }
                  roughness={0.7}
                />
              </mesh>
            ))}
            <mesh position={[0, 1.95, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.22, 1.7, 0.22]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
          </group>
        ))}
        {/* Colonnade Header Archway Beam */}
        <mesh position={[0, 2.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.32, 0.18, 3.8]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>
      </group>

      {/* Formal Dining Room Built-ins & Furniture */}
      <group position={[2.1, 0, 0]}>
        {showFurniture && (
          <group position={[0, 0, 0]}>
            {/* Built-in China Buffet & Sideboard on East Wall */}
            <group position={[1.4, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.2, 0.98, 0.48]} />
                <primitive object={materials.fumedDarkOak} attach="material" />
              </mesh>
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
              <mesh position={[0, 1.35, 0.02]}>
                <planeGeometry args={[0.78, 0.65]} />
                <meshStandardMaterial
                  color="#c0c8d0"
                  roughness={0.08}
                  metalness={0.9}
                />
              </mesh>
            </group>

            {/* Craftsman Trestle Dining Table & Chairs (Centered in Dining Room) */}
            <group position={[0, 0, 0]}>
              <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.72, 0.06, 0.94]} />
                <primitive object={materials.oakWood} attach="material" />
              </mesh>
              {[-0.65, 0.65].map((tx, idx) => (
                <mesh
                  key={idx}
                  position={[tx, 0.36, 0]}
                  castShadow
                  receiveShadow
                >
                  <boxGeometry args={[0.08, 0.72, 0.72]} />
                  <primitive object={materials.fumedDarkOak} attach="material" />
                </mesh>
              ))}
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
        <group position={[2.1, 0, -3.2]}>
          {/* Hoosier Baking Cabinet Workstation */}
          <group position={[-0.9, 0, 0.4]}>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.88, 0.65]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
            <mesh position={[0, 0.89, 0.08]} castShadow receiveShadow>
              <boxGeometry args={[1.24, 0.04, 0.78]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
            <mesh position={[0, 1.45, -0.12]} castShadow receiveShadow>
              <boxGeometry args={[1.18, 0.92, 0.38]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
          </group>

          {/* Glenwood 1928 4-Burner Cast Iron Cooking Range */}
          <group position={[0.7, 0, 0.4]}>
            <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.92, 0.95, 0.68]} />
              <primitive object={materials.castIron} attach="material" />
            </mesh>
            <mesh position={[-0.24, 1.22, -0.05]} castShadow>
              <boxGeometry args={[0.42, 0.52, 0.52]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
            {[
              [-0.2, 0.15],
              [0.2, 0.15],
              [-0.2, -0.15],
              [0.2, -0.15],
            ].map(([bx, bz], idx) => (
              <mesh
                key={idx}
                position={[bx, 0.97, bz]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <torusGeometry args={[0.08, 0.012, 8, 24]} />
                <primitive object={materials.castIron} attach="material" />
              </mesh>
            ))}
          </group>

          {/* Apron-Front Farmhouse Porcelain Sink */}
          <group position={[1.4, 0, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.32, 0.88, 0.56]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
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
        <group position={[-2.3, 0, -3.2]}>
          {/* Roycroft-style Craftsman Slatted Queen Bedstead */}
          <group position={[0, 0, 0]}>
            <mesh position={[0, 0.65, -0.98]} castShadow receiveShadow>
              <boxGeometry args={[1.62, 1.25, 0.08]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            <mesh position={[0, 0.4, 0.98]} castShadow receiveShadow>
              <boxGeometry args={[1.62, 0.78, 0.08]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.28, 1.9]} />
              <primitive object={materials.oliveWool} attach="material" />
            </mesh>
            {[-0.42, 0.42].map((px, idx) => (
              <mesh
                key={idx}
                position={[px, 0.58, -0.72]}
                rotation={[0.2, 0, 0]}
                castShadow
              >
                <boxGeometry args={[0.48, 0.14, 0.32]} />
                <meshStandardMaterial color="#f0ede6" roughness={0.8} />
              </mesh>
            ))}
          </group>

          {/* Clawfoot Bathtub in Bathroom */}
          <group position={[2.1, 0, -0.6]}>
            <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.4, 0.58, 0.68]} />
              <primitive object={materials.whiteEnamel} attach="material" />
            </mesh>
            {[
              [-0.55, -0.25],
              [0.55, -0.25],
              [-0.55, 0.25],
              [0.55, 0.25],
            ].map(([fx, fz], idx) => (
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
      <group position={[0, 2.82, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.0, 7.6]} />
          <meshStandardMaterial color="#f8f4ec" roughness={0.92} />
        </mesh>

        {[-2.8, -0.9, 0.9, 2.8].map((bx, idx) => (
          <mesh key={idx} position={[bx, -0.09, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.18, 0.18, 7.6]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
        ))}

        {[-2.5, -0.8, 0.8, 2.5].map((bz, idx) => (
          <mesh key={idx} position={[0, -0.09, bz]} castShadow receiveShadow>
            <boxGeometry args={[8.0, 0.18, 0.18]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
        ))}

        {/* Central Craftsman Lantern Chandelier in Living Room */}
        <group position={[-1.7, -0.55, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.48, 0.32, 0.48]} />
            <primitive object={materials.amberMica} attach="material" />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.52, 0.34, 0.52]} />
            <meshStandardMaterial
              color="#2d261e"
              wireframe
              roughness={0.3}
              metalness={0.8}
            />
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
      {/* 8. Low-Pitched Craftsman Gabled Roof & Rafter Tails               */}
      {/* ----------------------------------------------------------------- */}
      {(showRoof || activeRoom === "cutaway") && (
        <group position={[0, 3.2, -0.8]}>
          <mesh
            position={[-2.3, 0.55, 0]}
            rotation={[0, 0, 0.28]}
            castShadow
            receiveShadow
          >
            <planeGeometry args={[5.2, 10.8]} />
            <primitive object={materials.roofShingle} attach="material" />
          </mesh>
          <mesh
            position={[2.3, 0.55, 0]}
            rotation={[0, 0, -0.28]}
            castShadow
            receiveShadow
          >
            <planeGeometry args={[5.2, 10.8]} />
            <primitive object={materials.roofShingle} attach="material" />
          </mesh>

          {/* Exposed Decorative Rafter Tails along the Eaves */}
          {Array.from({ length: 16 }).map((_, rIdx) => {
            const rz = -5.0 + rIdx * 0.68;
            return (
              <React.Fragment key={rIdx}>
                <mesh position={[-4.4, 0.05, rz]} castShadow>
                  <boxGeometry args={[0.35, 0.08, 0.06]} />
                  <primitive object={materials.fumedDarkOak} attach="material" />
                </mesh>
                <mesh position={[4.4, 0.05, rz]} castShadow>
                  <boxGeometry args={[0.35, 0.08, 0.06]} />
                  <primitive object={materials.fumedDarkOak} attach="material" />
                </mesh>
              </React.Fragment>
            );
          })}

          {/* Exterior Brick Chimney Stack */}
          <mesh position={[-3.6, 1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 2.2, 0.85]} />
            <primitive object={materials.clinkerBrick} attach="material" />
          </mesh>
        </group>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 9. Physically Realistic PBR Daylight & Sunlight Lighting Rig      */}
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
        target-position={[-0.5, 0.5, 0.0]}
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
        position={[3.5, 3.2, 2.0]}
        intensity={0.7}
        color="#fed7aa"
      />

      {/* ----------------------------------------------------------------- */}
      {/* 10. Whole-House Obstacle Traversal Waypoints & Gate Rings         */}
      {/* ----------------------------------------------------------------- */}
      {activeRoute && (
        <group position={[0, 0.02, 0]}>
          {activeRoute.waypoints.map((wp, idx) => (
            <group key={idx} position={[wp.pos[0], 0, wp.pos[1]]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.22, 0.28, 32]} />
                <meshBasicMaterial
                  color="#38bdf8"
                  transparent
                  opacity={0.75}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.16, 24]} />
                <meshBasicMaterial
                  color="#0284c7"
                  transparent
                  opacity={0.35}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 1.2, 8]} />
                <meshBasicMaterial
                  color="#38bdf8"
                  transparent
                  opacity={0.65}
                />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}
