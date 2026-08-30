"use client";

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Procedural High-Resolution Texture Generators (Three.js Skill Doctrine)
// ---------------------------------------------------------------------------

function createOakHardwoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base warm quartersawn oak tone
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(0, 0, 1024, 1024);

  const plankCount = 16;
  const plankWidth = 1024 / plankCount;

  for (let i = 0; i < plankCount; i++) {
    const x = i * plankWidth;
    // Vary plank stain subtly
    const toneShift = (Math.sin(i * 997) * 0.5 + 0.5) * 24 - 12;
    const r = Math.min(255, Math.max(0, 139 + toneShift));
    const g = Math.min(255, Math.max(0, 90 + toneShift * 0.8));
    const b = Math.min(255, Math.max(0, 43 + toneShift * 0.5));

    ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
    ctx.fillRect(x, 0, plankWidth, 1024);

    // Fine wood grain lines
    ctx.strokeStyle = "rgba(60, 30, 10, 0.18)";
    ctx.lineWidth = 1;
    for (let gIdx = 0; gIdx < 35; gIdx++) {
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
    ctx.fillStyle = "rgba(230, 190, 140, 0.22)";
    for (let f = 0; f < 25; f++) {
      const fy = (Math.sin(i * 31 + f * 17) * 0.5 + 0.5) * 1000;
      const fx = x + (Math.cos(f * 43) * 0.5 + 0.5) * (plankWidth - 12);
      ctx.fillRect(fx, fy, 8 + (f % 5) * 3, 2 + (f % 3));
    }

    // Staggered plank end butt joints
    ctx.strokeStyle = "rgba(30, 15, 5, 0.75)";
    ctx.lineWidth = 2.5;
    const buttY1 = ((i * 347) % 700) + 150;
    const buttY2 = ((i * 613) % 700) + 150;
    ctx.beginPath();
    ctx.moveTo(x, buttY1);
    ctx.lineTo(x + plankWidth, buttY1);
    ctx.moveTo(x, buttY2);
    ctx.lineTo(x + plankWidth, buttY2);
    ctx.stroke();

    // Plank side seam groove
    ctx.strokeStyle = "rgba(25, 12, 5, 0.85)";
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
  texture.repeat.set(3, 3);
  return texture;
}

function createClinkerBrickTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Mortar color
  ctx.fillStyle = "#c2b8a3";
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
      const isClinker = seed > 0.45;

      // Varied earthy Craftsman brick shades
      let rCol = 140 + seed * 35;
      let gCol = 55 + seed * 20;
      let bCol = 35 + seed * 15;
      if (isClinker) {
        rCol = 65 + seed * 20;
        gCol = 35 + seed * 10;
        bCol = 25 + seed * 10;
      }

      ctx.fillStyle = `rgb(${rCol | 0}, ${gCol | 0}, ${bCol | 0})`;
      ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);

      // Texture flecks inside brick
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      for (let s = 0; s < 6; s++) {
        ctx.fillRect(x + 5 + (s * 9) % (colW - 10), y + 4 + (s * 5) % (rowH - 8), 3, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createCraftsmanRugTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Field color (terracotta russet)
  ctx.fillStyle = "#8a3a2a";
  ctx.fillRect(0, 0, 512, 512);

  // Wide Arts & Crafts border (sage green & indigo)
  ctx.strokeStyle = "#405338";
  ctx.lineWidth = 36;
  ctx.strokeRect(28, 28, 456, 456);

  ctx.strokeStyle = "#273b4d";
  ctx.lineWidth = 14;
  ctx.strokeRect(58, 58, 396, 396);

  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 4;
  ctx.strokeRect(68, 68, 376, 376);

  // Geometric medallion motifs
  ctx.fillStyle = "#d4af37";
  const centers = [
    [150, 150], [362, 150], [150, 362], [362, 362], [256, 256]
  ];
  for (const [cx, cy] of centers) {
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#405338";
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8a3a2a";
    ctx.fillRect(cx - 6, cy - 6, 12, 12);
    ctx.fillStyle = "#d4af37";
  }

  // Fringes on short ends
  ctx.fillStyle = "#e2d7c3";
  ctx.fillRect(0, 0, 12, 512);
  ctx.fillRect(500, 0, 12, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createAmberMicaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Glowing amber base
  ctx.fillStyle = "#e89228";
  ctx.fillRect(0, 0, 256, 256);

  // Mineral mica flakes
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
// Realistic Sears Craftsman Bungalow Living Room Environment
// ---------------------------------------------------------------------------

export interface CraftsmanLivingRoomProps {
  showFurniture?: boolean;
  cutawayMode?: boolean;
  timeOfDay?: "afternoon-sun" | "golden-hour" | "evening-glow";
}

export function CraftsmanLivingRoom({
  showFurniture = true,
  cutawayMode = true,
  timeOfDay = "afternoon-sun",
}: CraftsmanLivingRoomProps) {
  // 1. Generate & manage procedural PBR textures
  const textures = useMemo(() => {
    if (typeof document === "undefined") return null;
    return {
      hardwood: createOakHardwoodTexture(),
      brick: createClinkerBrickTexture(),
      rug: createCraftsmanRugTexture(),
      mica: createAmberMicaTexture(),
    };
  }, []);

  useEffect(() => {
    return () => {
      if (textures) {
        textures.hardwood.dispose();
        textures.brick.dispose();
        textures.rug.dispose();
        textures.mica.dispose();
      }
    };
  }, [textures]);

  // 2. High-quality PBR Materials
  const materials = useMemo(() => {
    const oakWood = new THREE.MeshStandardMaterial({
      color: "#5c3818",
      roughness: 0.38,
      metalness: 0.08,
      map: textures?.hardwood ?? null,
    });

    const fumedDarkOak = new THREE.MeshStandardMaterial({
      color: "#38200d",
      roughness: 0.45,
      metalness: 0.05,
    });

    const floorOak = new THREE.MeshStandardMaterial({
      color: "#78451c",
      roughness: 0.28,
      metalness: 0.08,
      map: textures?.hardwood ?? null,
    });

    const plasterWall = new THREE.MeshStandardMaterial({
      color: "#ede4d1", // Warm Craftsman oat plaster
      roughness: 0.88,
      metalness: 0.02,
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

    const woolRug = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.95,
      metalness: 0.0,
      map: textures?.rug ?? null,
    });

    const leatherCushion = new THREE.MeshStandardMaterial({
      color: "#422817",
      roughness: 0.42,
      metalness: 0.12,
    });

    const oliveFabric = new THREE.MeshStandardMaterial({
      color: "#525e46",
      roughness: 0.85,
      metalness: 0.0,
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

    const leadedGlass = new THREE.MeshPhysicalMaterial({
      color: "#d4e9f7",
      transparent: true,
      opacity: 0.35,
      roughness: 0.12,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.52,
    });

    return {
      oakWood,
      fumedDarkOak,
      floorOak,
      plasterWall,
      clinkerBrick,
      hearthStone,
      woolRug,
      leatherCushion,
      oliveFabric,
      amberMica,
      antiqueBrass,
      leadedGlass,
    };
  }, [textures, timeOfDay]);

  // Clean up materials on unmount
  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  // Dimensions of Craftsman Living Room:
  // Room spans X: [-2.4, 3.6] (6.0m), Z: [-2.6, 2.6] (5.2m), Y: [0, 2.85] (2.85m ceiling)
  // Robot walks from X: 0 to X: 2.0 down the main hall axis.

  return (
    <group>
      {/* ----------------------------------------------------------------- */}
      {/* 1. Craftsman Quartersawn Oak Hardwood Floor                        */}
      {/* ----------------------------------------------------------------- */}
      <mesh position={[0.6, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 5.8]} />
        <primitive object={materials.floorOak} attach="material" />
      </mesh>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Authentic Arts & Crafts Geometric Area Rug                     */}
      {/* ----------------------------------------------------------------- */}
      {showFurniture && (
        <mesh position={[0.6, 0.003, 0.95]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.8, 2.0]} />
          <primitive object={materials.woolRug} attach="material" />
        </mesh>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 3. North Architectural Wall (Back Fireplace Wall at Z = -2.6)      */}
      {/* ----------------------------------------------------------------- */}
      <group position={[0.6, 0, -2.6]}>
        {/* Upper Plaster Wall */}
        <mesh position={[0, 2.1, 0]} receiveShadow castShadow>
          <planeGeometry args={[6.8, 1.5]} />
          <primitive object={materials.plasterWall} attach="material" />
        </mesh>

        {/* Lower Fumed Oak Board-and-Batten Wainscoting (1.35m high) */}
        <mesh position={[0, 0.675, 0.01]} receiveShadow>
          <planeGeometry args={[6.8, 1.35]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>

        {/* Wainscoting Battens (Vertical Wood Ribs every 45cm) */}
        {[-3.0, -2.55, -2.1, 1.9, 2.35, 2.8].map((bx, idx) => (
          <mesh key={idx} position={[bx, 0.675, 0.02]} castShadow receiveShadow>
            <boxGeometry args={[0.07, 1.35, 0.02]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
        ))}

        {/* Top Plate Rail / Chair Molding */}
        <mesh position={[0, 1.36, 0.03]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 0.06, 0.06]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>

        {/* Baseboard & Shoe Molding */}
        <mesh position={[0, 0.09, 0.025]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 0.18, 0.04]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>

        {/* --------------------------------------------------------------- */}
        {/* Sears Craftsman Clinker Brick & Riverstone Fireplace           */}
        {/* --------------------------------------------------------------- */}
        <group position={[0, 0, 0.02]}>
          {/* Main Fireplace Brick Chimney Breast */}
          <mesh position={[0, 1.3, 0.2]} castShadow receiveShadow>
            <boxGeometry args={[2.1, 2.6, 0.4]} />
            <primitive object={materials.clinkerBrick} attach="material" />
          </mesh>

          {/* Raised Hearth */}
          <mesh position={[0, 0.12, 0.46]} castShadow receiveShadow>
            <boxGeometry args={[2.3, 0.24, 0.52]} />
            <primitive object={materials.hearthStone} attach="material" />
          </mesh>

          {/* Recessed Firebox */}
          <mesh position={[0, 0.65, 0.38]}>
            <boxGeometry args={[0.92, 0.72, 0.32]} />
            <meshStandardMaterial color="#1a1816" roughness={0.95} />
          </mesh>

          {/* Glowing Fireplace Embers */}
          <mesh position={[0, 0.3, 0.38]}>
            <boxGeometry args={[0.5, 0.1, 0.2]} />
            <meshStandardMaterial
              color="#ff4500"
              emissive="#ff3300"
              emissiveIntensity={timeOfDay === "evening-glow" ? 4.0 : 2.0}
            />
          </mesh>
          <pointLight
            position={[0, 0.45, 0.45]}
            color="#ff7a33"
            intensity={timeOfDay === "evening-glow" ? 8 : 4}
            distance={3.5}
            decay={2}
          />

          {/* Heavy Solid Quartersawn Oak Mantel Shelf */}
          <mesh position={[0, 1.48, 0.44]} castShadow receiveShadow>
            <boxGeometry args={[2.36, 0.12, 0.32]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>

          {/* Supporting Oak Corbels */}
          {[-0.85, 0.85].map((cx, idx) => (
            <mesh key={idx} position={[cx, 1.34, 0.36]} castShadow>
              <boxGeometry args={[0.12, 0.18, 0.16]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
          ))}

          {/* Framed Arts & Crafts Landscape Painting over Mantel */}
          <mesh position={[0, 2.05, 0.41]} castShadow>
            <boxGeometry args={[1.1, 0.72, 0.03]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
          <mesh position={[0, 2.05, 0.43]}>
            <planeGeometry args={[0.96, 0.58]} />
            <meshStandardMaterial color="#8b7355" roughness={0.75} />
          </mesh>

          {/* Hammered Bronze Wall Sconces flanking fireplace */}
          {[-1.35, 1.35].map((sx, idx) => (
            <group key={idx} position={[sx, 1.75, 0.06]}>
              <mesh castShadow>
                <boxGeometry args={[0.09, 0.22, 0.03]} />
                <primitive object={materials.antiqueBrass} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0.1]} castShadow>
                <cylinderGeometry args={[0.07, 0.05, 0.16, 12]} />
                <primitive object={materials.amberMica} attach="material" />
              </mesh>
              <pointLight
                position={[0, 0, 0.12]}
                color="#f59e0b"
                intensity={timeOfDay === "evening-glow" ? 6.5 : 2.5}
                distance={2.8}
                decay={2}
              />
            </group>
          ))}
        </group>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 4. West Wall with Leaded Glass Mullion Windows (at X = -2.4)       */}
      {/* ----------------------------------------------------------------- */}
      <group position={[-2.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Upper Plaster Wall */}
        <mesh position={[0, 2.1, 0]} receiveShadow>
          <planeGeometry args={[5.8, 1.5]} />
          <primitive object={materials.plasterWall} attach="material" />
        </mesh>

        {/* Lower Wainscoting */}
        <mesh position={[0, 0.675, 0.01]} receiveShadow>
          <planeGeometry args={[5.8, 1.35]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>

        {/* Craftsman 4-over-1 Triple Window Unit */}
        <group position={[0, 1.6, 0.02]}>
          {/* Window Casing Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.8, 1.45, 0.08]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>

          {/* Deep Window Stool / Sill */}
          <mesh position={[0, -0.74, 0.06]} castShadow receiveShadow>
            <boxGeometry args={[2.92, 0.06, 0.16]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>

          {/* Glass Panes */}
          {[-0.85, 0, 0.85].map((wx, idx) => (
            <group key={idx} position={[wx, 0, 0.02]}>
              <mesh>
                <planeGeometry args={[0.76, 1.25]} />
                <primitive object={materials.leadedGlass} attach="material" />
              </mesh>
              {/* Leaded Muntin Bars */}
              <mesh position={[0, 0.28, 0.005]}>
                <boxGeometry args={[0.74, 0.02, 0.01]} />
                <primitive object={materials.fumedDarkOak} attach="material" />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 5. East Cased Colonnade & Built-In Bookcases (at X = 3.6)          */}
      {/* ----------------------------------------------------------------- */}
      <group position={[3.6, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Wall Sections Flanking the Archway */}
        <mesh position={[-1.9, 1.4, 0]} receiveShadow>
          <planeGeometry args={[1.8, 2.8]} />
          <primitive object={materials.plasterWall} attach="material" />
        </mesh>
        <mesh position={[1.9, 1.4, 0]} receiveShadow>
          <planeGeometry args={[1.8, 2.8]} />
          <primitive object={materials.plasterWall} attach="material" />
        </mesh>

        {/* Craftsman Colonnade Pedestals & Built-in Bookcases */}
        {[-1.5, 1.5].map((bx, idx) => (
          <group key={idx} position={[bx, 0, 0.2]}>
            {/* Bookcase Cabinet */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.2, 1.2, 0.36]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {/* Colorful Book Spines */}
            {[-0.38, 0.02, 0.38].map((by, bIdx) => (
              <mesh key={bIdx} position={[0, 0.35 + by * 0.65, 0.12]}>
                <boxGeometry args={[1.05, 0.22, 0.16]} />
                <meshStandardMaterial
                  color={bIdx === 0 ? "#78281f" : bIdx === 1 ? "#1e3a5f" : "#3b5323"}
                  roughness={0.7}
                />
              </mesh>
            ))}
            {/* Tapered Craftsman Square Column */}
            <mesh position={[0, 1.85, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.22, 1.3, 0.22]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Cased Archway Beam Overhead */}
        <mesh position={[0, 2.62, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.24, 0.32]} />
          <primitive object={materials.fumedDarkOak} attach="material" />
        </mesh>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 6. Craftsman Exposed Box Beams (Coffered Ceiling)                 */}
      {/* ----------------------------------------------------------------- */}
      <group position={[0.6, 2.82, 0]}>
        {/* Ceiling Ivory Plaster Panels */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.8, 5.8]} />
          <meshStandardMaterial color="#f7f3eb" roughness={0.92} />
        </mesh>

        {/* Longitudinal Oak Beams */}
        {[-1.8, 0, 1.8].map((bz, idx) => (
          <mesh key={idx} position={[0, -0.09, bz]} castShadow receiveShadow>
            <boxGeometry args={[6.8, 0.18, 0.16]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
        ))}

        {/* Transverse Oak Cross Beams */}
        {[-2.0, -0.6, 0.8, 2.2].map((bx, idx) => (
          <mesh key={idx} position={[bx, -0.09, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.16, 0.18, 5.8]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
        ))}

        {/* Center Craftsman Chandelier / Pendant Fixture */}
        <group position={[0.2, -0.55, 0.95]}>
          {/* Suspension Chains & Oak Canopy */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.28, 0.04, 0.28]} />
            <primitive object={materials.fumedDarkOak} attach="material" />
          </mesh>
          {/* Hammered Bronze Square Lantern Frame with Amber Mica Panels */}
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
            intensity={timeOfDay === "evening-glow" ? 14 : 6}
            distance={4.8}
            decay={2}
          />
        </group>
      </group>

      {/* ----------------------------------------------------------------- */}
      {/* 7. Period Craftsman Mission Furniture Set                         */}
      {/* ----------------------------------------------------------------- */}
      {showFurniture && (
        <group>
          {/* Mission Settle / 3-Seater Sofa */}
          <group position={[-0.7, 0, 1.85]} rotation={[0, -Math.PI / 10, 0]}>
            {/* Oak Slatted Back */}
            <mesh position={[0, 0.48, 0.42]} castShadow receiveShadow>
              <boxGeometry args={[1.72, 0.55, 0.06]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {/* Oak Slatted Sides / Armrests */}
            {[-0.88, 0.88].map((sx, idx) => (
              <mesh key={idx} position={[sx, 0.36, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.07, 0.48, 0.88]} />
                <primitive object={materials.fumedDarkOak} attach="material" />
              </mesh>
            ))}
            {/* Base Seat Platform */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.74, 0.12, 0.82]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {/* Thick Olive/Brown Fabric Cushions */}
            <mesh position={[0, 0.32, -0.02]} castShadow receiveShadow>
              <boxGeometry args={[1.62, 0.16, 0.74]} />
              <primitive object={materials.oliveFabric} attach="material" />
            </mesh>
            {/* Back Pillows */}
            <mesh position={[0, 0.54, 0.32]} rotation={[-0.15, 0, 0]} castShadow>
              <boxGeometry args={[1.6, 0.32, 0.16]} />
              <primitive object={materials.oliveFabric} attach="material" />
            </mesh>
          </group>

          {/* Gustav Stickley Morris Reclining Armchair */}
          <group position={[1.85, 0, 1.6]} rotation={[0, -Math.PI / 4, 0]}>
            {/* Heavy Slatted Arms */}
            {[-0.46, 0.46].map((ax, idx) => (
              <mesh key={idx} position={[ax, 0.34, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.09, 0.44, 0.88]} />
                <primitive object={materials.fumedDarkOak} attach="material" />
              </mesh>
            ))}
            {/* Reclined Slat Back */}
            <mesh position={[0, 0.58, 0.36]} rotation={[-0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.82, 0.62, 0.06]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {/* Saddle Leather Seat Cushion */}
            <mesh position={[0, 0.28, -0.02]} castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.18, 0.78]} />
              <primitive object={materials.leatherCushion} attach="material" />
            </mesh>
            {/* Saddle Leather Back Cushion */}
            <mesh position={[0, 0.56, 0.3]} rotation={[-0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.76, 0.48, 0.14]} />
              <primitive object={materials.leatherCushion} attach="material" />
            </mesh>
          </group>

          {/* Craftsman Oak Coffee Table with Through-Tenons */}
          <group position={[0.55, 0, 0.85]}>
            {/* Table Top */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.3, 0.05, 0.68]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {/* Lower Magazine Shelf */}
            <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.15, 0.03, 0.54]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            {/* Four Square Legs */}
            {[-0.58, 0.58].map((lx) =>
              [-0.28, 0.28].map((lz, idx) => (
                <mesh key={`${lx}-${lz}-${idx}`} position={[lx, 0.21, lz]} castShadow receiveShadow>
                  <boxGeometry args={[0.07, 0.42, 0.07]} />
                  <primitive object={materials.fumedDarkOak} attach="material" />
                </mesh>
              ))
            )}
            {/* Ceramic Arts & Crafts Bowl on Table */}
            <mesh position={[0, 0.47, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.07, 0.06, 16]} />
              <meshStandardMaterial color="#2d5a42" roughness={0.3} metalness={0.1} />
            </mesh>
          </group>

          {/* Side Table with Dirk Van Erp Amber Mica Table Lamp */}
          <group position={[1.4, 0, 2.45]}>
            {/* Oak Side Table */}
            <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.54, 0.04, 0.54]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            <mesh position={[0, 0.29, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.56, 8]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.48, 0.04, 0.48]} />
              <primitive object={materials.fumedDarkOak} attach="material" />
            </mesh>

            {/* Hammered Copper Lamp Base */}
            <mesh position={[0, 0.68, 0]} castShadow>
              <sphereGeometry args={[0.11, 16, 12]} />
              <primitive object={materials.antiqueBrass} attach="material" />
            </mesh>

            {/* 4-Panel Amber Mica Conical Shade */}
            <mesh position={[0, 0.86, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.28, 0.22, 4]} />
              <primitive object={materials.amberMica} attach="material" />
            </mesh>
            <pointLight
              position={[0, 0.84, 0]}
              color="#f59e0b"
              intensity={timeOfDay === "evening-glow" ? 7 : 3}
              distance={2.4}
              decay={2}
            />
          </group>
        </group>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8. Natural Golden Hour / Daylight Lighting Rig                    */}
      {/* ----------------------------------------------------------------- */}
      <hemisphereLight
        args={[
          timeOfDay === "evening-glow" ? "#fed7aa" : "#e0f2fe",
          "#78350f",
          timeOfDay === "evening-glow" ? 0.8 : 1.4,
        ]}
      />

      {/* Strong Afternoon Sunlight streaming from West Casement Windows */}
      <directionalLight
        castShadow
        position={[-4.5, 4.2, 1.2]}
        target-position={[0.5, 0.3, 0]}
        intensity={timeOfDay === "evening-glow" ? 1.8 : 3.8}
        color={timeOfDay === "evening-glow" ? "#fdba74" : "#fff8eb"}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00015}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-2.5}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
      />

      {/* Interior Bounce Fill Light */}
      <directionalLight
        position={[2.8, 2.5, 3.2]}
        intensity={0.65}
        color="#fed7aa"
      />
    </group>
  );
}
