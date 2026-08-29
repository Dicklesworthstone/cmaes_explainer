import * as THREE from "three";
import { createMulberry32 } from "./cmaesEngine";
import { type FurnitureKind, FURNITURE_KIND_DEFAULTS } from "./furnitureTaxonomy";

// Procedural furniture meshes: Craftsman-era silhouettes built from
// BufferGeometry primitives. No GLTF/GLB (law 7) — all geometry is
// constructed parametrically from the real dimensional tables.
// Material palette: warm Craftsman tones.

export const CRAFTSMAN_PALETTE = {
  oakWood: 0x8b6914,
  walnutWood: 0x5c4033,
  mahoganyWood: 0x4a2912,
  brassHardware: 0xb8985a,
  creamWalls: 0xf5f0e8,
  tileFloor: 0xc8c0b0,
  carpetFloor: 0x8b7d6b,
  hardwoodFloor: 0x8b6914,
  fabricSofa: 0x6b7b5e,
  fabricLeather: 0x543d2b,
  fabricBedding: 0xd4cfc4,
  fabricCurtain: 0xb0a898,
  fabricRug: 0x824d3b,
  castIron: 0x2a2d32,
  porcelainWhite: 0xf0ede6,
  steelBrushed: 0xb0b8bc,
  glassWindow: 0xc5dde8,
  glassClear: 0xddeef8,
  ceramicTerracotta: 0xb35a38,
  plantGreen: 0x2e6f40,
  chromeShiny: 0xdddddd,
} as const;

export type CraftsmanColorKey = keyof typeof CRAFTSMAN_PALETTE;

/** Oriented Bounding Box (bv::OBB) structure for frankensim physics and broadphase. */
export interface OBB {
  center: [number, number, number];
  halfExtents: [number, number, number];
  rotationMatrix?: [number, number, number, number, number, number, number, number, number];
}

/** Individual geometric part produced by procedural generator. */
export interface ProceduralShapePart {
  name: string;
  geometry: THREE.BufferGeometry;
  localOffset: [number, number, number];
  localRotation?: [number, number, number];
  materialHint?: CraftsmanColorKey | "generic";
  roughness?: number;
  metalness?: number;
  opacity?: number;
  transparent?: boolean;
}

/** Pure geometry result with bounding volume and disposal handle. */
export interface ProceduralShapeResult {
  parts: ProceduralShapePart[];
  obb: OBB;
  dispose: () => void;
}

/** Render mesh result with THREE.Group and disposal handle. */
export type FurnitureMeshResult = {
  group: THREE.Group;
  dispose: () => void;
  obb?: OBB;
};

// ---------------------------------------------------------------------------
// Procedural Shape Utilities (Primitives, B-spline, Lathe, Sweep, Extrude)
// ---------------------------------------------------------------------------

export function roundedBox(w: number, h: number, d: number, radius: number): THREE.BufferGeometry {
  const r = Math.min(radius, w / 2 - 0.001, d / 2 - 0.001, h / 2 - 0.001);
  if (r <= 0) {
    const geo = new THREE.BoxGeometry(w, h, d);
    geo.translate(0, h / 2, 0);
    return geo;
  }
  const shape = new THREE.Shape();
  const hw = w / 2 - r;
  const hd = d / 2 - r;
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.quadraticCurveTo(w / 2, -hd, w / 2, -hd + r);
  shape.lineTo(w / 2, hd - r);
  shape.quadraticCurveTo(w / 2, hd, hw, hd);
  shape.lineTo(-hw, hd);
  shape.quadraticCurveTo(-w / 2, hd, -w / 2, hd - r);
  shape.lineTo(-w / 2, -hd + r);
  shape.quadraticCurveTo(-w / 2, -hd, -hw, -hd);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

export function taperedCylinder(rTop: number, rBot: number, h: number, seg = 12): THREE.CylinderGeometry {
  const geo = new THREE.CylinderGeometry(rTop, rBot, h, seg);
  geo.translate(0, h / 2, 0);
  return geo;
}

export function latheProfile(points: Array<[number, number]>, segments = 16): THREE.BufferGeometry {
  const v2Points = points.map(([r, y]) => new THREE.Vector2(Math.max(0.001, r), y));
  return new THREE.LatheGeometry(v2Points, segments);
}

/** Cubic B-spline interpolation point evaluator. */
export function evaluateCubicBSpline(points: Array<[number, number]>, t: number): [number, number] {
  const n = points.length;
  if (n < 4) {
    const idx = Math.min(Math.floor(t * (n - 1)), n - 2);
    const localT = t * (n - 1) - idx;
    const p0 = points[idx];
    const p1 = points[idx + 1];
    return [p0[0] + (p1[0] - p0[0]) * localT, p0[1] + (p1[1] - p0[1]) * localT];
  }
  const span = 1 / (n - 3);
  const i = Math.min(Math.floor(t / span), n - 4);
  const u = (t - i * span) / span;

  const u2 = u * u;
  const u3 = u2 * u;

  const b0 = (1 - 3 * u + 3 * u2 - u3) / 6;
  const b1 = (4 - 6 * u2 + 3 * u3) / 6;
  const b2 = (1 + 3 * u + 3 * u2 - 3 * u3) / 6;
  const b3 = u3 / 6;

  const p0 = points[i];
  const p1 = points[i + 1];
  const p2 = points[i + 2];
  const p3 = points[i + 3];

  return [
    b0 * p0[0] + b1 * p1[0] + b2 * p2[0] + b3 * p3[0],
    b0 * p0[1] + b1 * p1[1] + b2 * p2[1] + b3 * p3[1],
  ];
}

/** B-spline closed 2D profile extrusion for organic Craftsman wood moldings and arms. */
export function bsplineExtrude(
  controlPoints: Array<[number, number]>,
  depth: number,
  samples = 32,
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const firstPt = evaluateCubicBSpline(controlPoints, 0);
  shape.moveTo(firstPt[0], firstPt[1]);
  for (let s = 1; s <= samples; s++) {
    const pt = evaluateCubicBSpline(controlPoints, s / samples);
    shape.lineTo(pt[0], pt[1]);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  return geo;
}

/** Capsule geometry helper (cylinder with two hemispherical ends). */
export function capsuleGeometry(radius: number, length: number, radialSeg = 12, capSeg = 6): THREE.BufferGeometry {
  return new THREE.CapsuleGeometry(radius, Math.max(0.001, length), capSeg, radialSeg);
}

// ---------------------------------------------------------------------------
// Pure Procedural Geometry Generators for All Categories
// ---------------------------------------------------------------------------

export function generateSofaGeometry(w: number, d: number, h: number): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  // Base
  parts.push({
    name: "base",
    geometry: roundedBox(w, h * 0.35, d, 0.03),
    localOffset: [0, 0, 0],
    materialHint: "fabricSofa",
  });
  // Backrest
  parts.push({
    name: "backrest",
    geometry: roundedBox(w, h * 0.55, d * 0.2, 0.03),
    localOffset: [0, h * 0.35, -d * 0.4],
    materialHint: "fabricSofa",
  });
  // Left and Right Arms
  for (const side of [-1, 1]) {
    parts.push({
      name: `arm_${side > 0 ? "r" : "l"}`,
      geometry: roundedBox(w * 0.12, h * 0.55, d, 0.03),
      localOffset: [side * (w / 2 - w * 0.06), h * 0.15, 0],
      materialHint: "fabricSofa",
    });
  }
  // 4 Tapered Legs
  for (const [lx, lz] of [
    [-w / 2 + 0.06, -d / 2 + 0.06],
    [w / 2 - 0.06, -d / 2 + 0.06],
    [-w / 2 + 0.06, d / 2 - 0.06],
    [w / 2 - 0.06, d / 2 - 0.06],
  ]) {
    parts.push({
      name: "leg",
      geometry: taperedCylinder(0.022, 0.03, h * 0.2, 8),
      localOffset: [lx, 0, lz],
      materialHint: "oakWood",
    });
  }
  // Cushions
  for (const cx of [-w * 0.22, w * 0.22]) {
    parts.push({
      name: "cushion",
      geometry: roundedBox(w * 0.44, h * 0.12, d * 0.7, 0.04),
      localOffset: [cx, h * 0.35, d * 0.05],
      materialHint: "fabricSofa",
    });
  }

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, d / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateDiningTableGeometry(w: number, d: number, h: number): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  const topThickness = 0.045;
  // Tabletop
  parts.push({
    name: "top",
    geometry: roundedBox(w, topThickness, d, 0.02),
    localOffset: [0, h - topThickness, 0],
    materialHint: "oakWood",
  });
  // 4 turned legs
  const legProfile: Array<[number, number]> = [];
  const legH = h - topThickness;
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const r = 0.035 - t * 0.015 + Math.sin(t * Math.PI) * 0.008;
    legProfile.push([Math.max(r, 0.012), t * legH]);
  }
  const legGeo = latheProfile(legProfile, 10);
  for (const [lx, lz] of [
    [-w / 2 + 0.08, -d / 2 + 0.08],
    [w / 2 - 0.08, -d / 2 + 0.08],
    [-w / 2 + 0.08, d / 2 - 0.08],
    [w / 2 - 0.08, d / 2 - 0.08],
  ]) {
    parts.push({
      name: "leg",
      geometry: legGeo.clone(),
      localOffset: [lx, 0, lz],
      materialHint: "oakWood",
    });
  }
  legGeo.dispose();

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, d / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateBookshelfGeometry(w: number, d: number, h: number): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  const rng = createMulberry32(
    (Math.floor(w * 1000) * 0x9e37 ^ Math.floor(d * 1000) * 0x53d7 ^ Math.floor(h * 1000) * 0x1a7b) >>> 0,
  );
  const shelfCount = 5;
  for (let i = 0; i < shelfCount; i++) {
    const sy = (h / (shelfCount - 1)) * i;
    const shelfGeo = new THREE.BoxGeometry(w - 0.05, 0.018, d);
    shelfGeo.translate(0, 0.009, 0);
    parts.push({
      name: `shelf_${i}`,
      geometry: shelfGeo,
      localOffset: [0, sy, 0],
      materialHint: "walnutWood",
    });
    // Books on each shelf
    if (i < shelfCount - 1) {
      const bookColors: CraftsmanColorKey[] = ["fabricRug", "fabricSofa", "oakWood", "walnutWood"];
      const bookCount = Math.floor(w / 0.045);
      for (let b = 0; b < bookCount; b++) {
        if (rng() > 0.85) continue;
        const bw = 0.028 + (b % 3) * 0.008;
        const bh = 0.16 + (b % 4) * 0.02;
        const bookGeo = new THREE.BoxGeometry(bw, bh, d * 0.72);
        bookGeo.translate(0, bh / 2, 0);
        parts.push({
          name: `book_${i}_${b}`,
          geometry: bookGeo,
          localOffset: [-w / 2 + 0.04 + b * 0.045, sy + 0.018, 0],
          materialHint: bookColors[b % bookColors.length],
        });
      }
    }
  }

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, d / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateBedGeometry(w: number, d: number, h: number): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  // Frame
  const frameGeo = new THREE.BoxGeometry(w + 0.06, 0.12, d + 0.06);
  frameGeo.translate(0, 0.06, 0);
  parts.push({
    name: "frame",
    geometry: frameGeo,
    localOffset: [0, h * 0.35, 0],
    materialHint: "castIron",
  });
  // Headboard
  const hbGeo = new THREE.BoxGeometry(w + 0.06, h * 0.55, 0.04);
  hbGeo.translate(0, (h * 0.55) / 2, 0);
  parts.push({
    name: "headboard",
    geometry: hbGeo,
    localOffset: [0, h * 0.35, -d / 2 - 0.02],
    materialHint: "castIron",
  });
  // Mattress
  const matGeo = new THREE.BoxGeometry(w, 0.16, d);
  matGeo.translate(0, 0.08, 0);
  parts.push({
    name: "mattress",
    geometry: matGeo,
    localOffset: [0, h * 0.35 + 0.12, 0],
    materialHint: "fabricBedding",
  });
  // Pillows
  for (const px of [-w * 0.2, w * 0.2]) {
    const pilGeo = new THREE.BoxGeometry(w * 0.35, 0.09, d * 0.25);
    pilGeo.translate(0, 0.045, 0);
    parts.push({
      name: "pillow",
      geometry: pilGeo,
      localOffset: [px, h * 0.35 + 0.28, -d * 0.3],
      materialHint: "porcelainWhite",
    });
  }

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [(w + 0.06) / 2, h / 2, (d + 0.06) / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateStoveGeometry(w: number, d: number, h: number): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  // Body
  const bodyGeo = new THREE.BoxGeometry(w, h, d);
  bodyGeo.translate(0, h / 2, 0);
  parts.push({
    name: "body",
    geometry: bodyGeo,
    localOffset: [0, 0, 0],
    materialHint: "castIron",
  });
  // Cooktop
  const cookGeo = new THREE.BoxGeometry(w + 0.02, 0.02, d + 0.02);
  cookGeo.translate(0, 0.01, 0);
  parts.push({
    name: "cooktop",
    geometry: cookGeo,
    localOffset: [0, h, 0],
    materialHint: "steelBrushed",
  });
  // Burners
  for (const [bx, bz] of [
    [-w * 0.22, -d * 0.2],
    [w * 0.22, -d * 0.2],
    [-w * 0.22, d * 0.2],
    [w * 0.22, d * 0.2],
  ]) {
    const burnerGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.008, 20);
    burnerGeo.translate(0, 0.004, 0);
    parts.push({
      name: "burner",
      geometry: burnerGeo,
      localOffset: [bx, h + 0.02, bz],
      materialHint: "castIron",
    });
  }
  // Oven Door
  const doorGeo = new THREE.BoxGeometry(w * 0.85, h * 0.42, 0.015);
  doorGeo.translate(0, (h * 0.42) / 2, 0);
  parts.push({
    name: "door",
    geometry: doorGeo,
    localOffset: [0, h * 0.15, d / 2 + 0.008],
    materialHint: "porcelainWhite",
  });
  // Handle
  const handleGeo = new THREE.CylinderGeometry(0.012, 0.012, w * 0.8, 8);
  handleGeo.rotateZ(Math.PI / 2);
  parts.push({
    name: "handle",
    geometry: handleGeo,
    localOffset: [0, h * 0.58, d / 2 + 0.03],
    materialHint: "steelBrushed",
  });

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, d / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateChairGeometry(w: number, d: number, h: number, isRocking = false): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  const seatH = h * 0.45;
  // Seat
  const seatGeo = roundedBox(w, 0.03, d, 0.02);
  parts.push({
    name: "seat",
    geometry: seatGeo,
    localOffset: [0, seatH, 0],
    materialHint: "oakWood",
  });
  // Backrest Slats
  const slatCount = 4;
  for (let i = 0; i < slatCount; i++) {
    const sx = -w / 2 + 0.06 + (i / (slatCount - 1)) * (w - 0.12);
    const slatGeo = new THREE.BoxGeometry(0.02, h * 0.5, 0.015);
    slatGeo.translate(0, (h * 0.5) / 2, 0);
    parts.push({
      name: `slat_${i}`,
      geometry: slatGeo,
      localOffset: [sx, seatH + 0.03, -d / 2 + 0.03],
      materialHint: "oakWood",
    });
  }
  // Backrest Top Rail
  const railGeo = roundedBox(w, 0.04, 0.03, 0.01);
  parts.push({
    name: "back_rail",
    geometry: railGeo,
    localOffset: [0, h - 0.04, -d / 2 + 0.03],
    materialHint: "oakWood",
  });
  // 4 Legs
  for (const [lx, lz] of [
    [-w / 2 + 0.04, -d / 2 + 0.04],
    [w / 2 - 0.04, -d / 2 + 0.04],
    [-w / 2 + 0.04, d / 2 - 0.04],
    [w / 2 - 0.04, d / 2 - 0.04],
  ]) {
    const legGeo = taperedCylinder(0.015, 0.02, seatH, 8);
    parts.push({
      name: "leg",
      geometry: legGeo,
      localOffset: [lx, 0, lz],
      materialHint: "oakWood",
    });
  }

  if (isRocking) {
    // Rocking rails
    for (const side of [-1, 1]) {
      const rockerGeo = roundedBox(0.03, 0.03, d * 1.3, 0.01);
      parts.push({
        name: `rocker_${side > 0 ? "r" : "l"}`,
        geometry: rockerGeo,
        localOffset: [side * (w / 2 - 0.04), -0.015, 0],
        materialHint: "oakWood",
      });
    }
  }

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, (isRocking ? d * 1.3 : d) / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateBarStoolGeometry(w: number, d: number, h: number): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  const radius = Math.min(w, d) / 2;
  // Circular seat
  const seatGeo = new THREE.CylinderGeometry(radius, radius, 0.04, 16);
  seatGeo.translate(0, 0.02, 0);
  parts.push({
    name: "seat",
    geometry: seatGeo,
    localOffset: [0, h - 0.04, 0],
    materialHint: "fabricLeather",
  });
  // 4 Legs
  const legRadius = radius * 0.7;
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 + Math.PI / 4;
    const lx = Math.cos(angle) * legRadius;
    const lz = Math.sin(angle) * legRadius;
    const legGeo = taperedCylinder(0.012, 0.018, h - 0.04, 8);
    parts.push({
      name: `leg_${i}`,
      geometry: legGeo,
      localOffset: [lx, 0, lz],
      materialHint: "oakWood",
    });
  }
  // Foot ring
  const ringGeo = new THREE.TorusGeometry(radius * 0.65, 0.008, 8, 16);
  ringGeo.rotateX(Math.PI / 2);
  parts.push({
    name: "foot_ring",
    geometry: ringGeo,
    localOffset: [0, h * 0.3, 0],
    materialHint: "brassHardware",
  });

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [radius, h / 2, radius],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateStorageCabinetGeometry(
  w: number,
  d: number,
  h: number,
  kind: "dresser" | "cabinet" | "wardrobe" | "pantry" | "nightstand",
): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  // Main housing
  const bodyGeo = roundedBox(w, h * 0.9, d, 0.02);
  parts.push({
    name: "housing",
    geometry: bodyGeo,
    localOffset: [0, h * 0.1, 0],
    materialHint: "walnutWood",
  });
  // Plinth or legs
  for (const [lx, lz] of [
    [-w / 2 + 0.05, -d / 2 + 0.05],
    [w / 2 - 0.05, -d / 2 + 0.05],
    [-w / 2 + 0.05, d / 2 - 0.05],
    [w / 2 - 0.05, d / 2 - 0.05],
  ]) {
    const legGeo = new THREE.BoxGeometry(0.04, h * 0.1, 0.04);
    legGeo.translate(0, (h * 0.1) / 2, 0);
    parts.push({
      name: "leg",
      geometry: legGeo,
      localOffset: [lx, 0, lz],
      materialHint: "walnutWood",
    });
  }
  // Door/Drawer facades and handles
  const rowCount = kind === "dresser" ? 4 : kind === "nightstand" ? 2 : 1;
  const colCount = kind === "wardrobe" || kind === "cabinet" || kind === "pantry" ? 2 : 1;

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      const panelH = (h * 0.82) / rowCount - 0.015;
      const panelW = (w - 0.06) / colCount - 0.015;
      const py = h * 0.12 + r * ((h * 0.82) / rowCount) + panelH / 2;
      const px = -w / 2 + 0.03 + (c + 0.5) * ((w - 0.06) / colCount);

      const panelGeo = new THREE.BoxGeometry(panelW, panelH, 0.01);
      parts.push({
        name: `panel_${r}_${c}`,
        geometry: panelGeo,
        localOffset: [px, py, d / 2 + 0.005],
        materialHint: "oakWood",
      });

      const handleGeo = new THREE.SphereGeometry(0.012, 8, 8);
      parts.push({
        name: `handle_${r}_${c}`,
        geometry: handleGeo,
        localOffset: [px + (colCount > 1 ? (c === 0 ? panelW * 0.35 : -panelW * 0.35) : 0), py, d / 2 + 0.02],
        materialHint: "brassHardware",
      });
    }
  }

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, d / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateApplianceGeometry(
  w: number,
  d: number,
  h: number,
  kind: "fridge" | "dishwasher" | "microwave" | "washer" | "dryer" | "range-hood",
): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  const bodyGeo = roundedBox(w, h, d, 0.02);
  const colorHint: CraftsmanColorKey = kind === "fridge" || kind === "microwave" ? "steelBrushed" : "porcelainWhite";
  parts.push({
    name: "housing",
    geometry: bodyGeo,
    localOffset: [0, 0, 0],
    materialHint: colorHint,
  });

  if (kind === "fridge") {
    // Upper fridge door + lower freezer door
    const upperH = h * 0.6;
    const lowerH = h * 0.35;
    const upperGeo = roundedBox(w * 0.96, upperH, 0.02, 0.01);
    parts.push({
      name: "door_upper",
      geometry: upperGeo,
      localOffset: [0, h - upperH, d / 2 + 0.01],
      materialHint: "steelBrushed",
    });
    const lowerGeo = roundedBox(w * 0.96, lowerH, 0.02, 0.01);
    parts.push({
      name: "door_lower",
      geometry: lowerGeo,
      localOffset: [0, 0.02, d / 2 + 0.01],
      materialHint: "steelBrushed",
    });
    // Vertical handles
    const handleGeo = new THREE.CylinderGeometry(0.01, 0.01, upperH * 0.6, 8);
    parts.push({
      name: "handle_upper",
      geometry: handleGeo,
      localOffset: [w * 0.4, h - upperH * 0.5, d / 2 + 0.035],
      materialHint: "castIron",
    });
  } else if (kind === "washer" || kind === "dryer") {
    // Porthole circular glass window
    const portholeGeo = new THREE.CylinderGeometry(w * 0.28, w * 0.28, 0.02, 20);
    portholeGeo.rotateX(Math.PI / 2);
    parts.push({
      name: "porthole",
      geometry: portholeGeo,
      localOffset: [0, h * 0.5, d / 2 + 0.01],
      materialHint: "glassWindow",
      transparent: true,
      opacity: 0.8,
    });
    const ringGeo = new THREE.TorusGeometry(w * 0.28, 0.015, 8, 20);
    parts.push({
      name: "porthole_ring",
      geometry: ringGeo,
      localOffset: [0, h * 0.5, d / 2 + 0.015],
      materialHint: "steelBrushed",
    });
  } else if (kind === "microwave") {
    // Glass window and control keypad
    const winGeo = new THREE.BoxGeometry(w * 0.6, h * 0.65, 0.01);
    winGeo.translate(0, (h * 0.65) / 2, 0);
    parts.push({
      name: "window",
      geometry: winGeo,
      localOffset: [-w * 0.15, h * 0.18, d / 2 + 0.005],
      materialHint: "glassWindow",
    });
    const padGeo = new THREE.BoxGeometry(w * 0.2, h * 0.65, 0.01);
    padGeo.translate(0, (h * 0.65) / 2, 0);
    parts.push({
      name: "keypad",
      geometry: padGeo,
      localOffset: [w * 0.32, h * 0.18, d / 2 + 0.005],
      materialHint: "castIron",
    });
  }

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, d / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateFixtureGeometry(
  w: number,
  d: number,
  h: number,
  kind: "sink" | "toilet" | "bathtub" | "shower" | "vanity",
): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  if (kind === "sink" || kind === "vanity") {
    const basinGeo = roundedBox(w, h * 0.85, d, 0.03);
    parts.push({
      name: "cabinet_base",
      geometry: basinGeo,
      localOffset: [0, 0, 0],
      materialHint: kind === "vanity" ? "walnutWood" : "porcelainWhite",
    });
    // Faucet
    const faucetGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8);
    faucetGeo.translate(0, 0.06, 0);
    parts.push({
      name: "faucet",
      geometry: faucetGeo,
      localOffset: [0, h * 0.85, -d * 0.3],
      materialHint: "brassHardware",
    });
  } else if (kind === "toilet") {
    const bowlGeo = new THREE.CylinderGeometry(w * 0.45, w * 0.3, h * 0.5, 16);
    bowlGeo.translate(0, (h * 0.5) / 2, 0);
    parts.push({
      name: "bowl",
      geometry: bowlGeo,
      localOffset: [0, 0, d * 0.1],
      materialHint: "porcelainWhite",
    });
    const tankGeo = roundedBox(w * 0.85, h * 0.5, d * 0.35, 0.02);
    parts.push({
      name: "tank",
      geometry: tankGeo,
      localOffset: [0, h * 0.45, -d * 0.28],
      materialHint: "porcelainWhite",
    });
  } else if (kind === "bathtub") {
    const tubGeo = roundedBox(w, h, d, 0.05);
    parts.push({
      name: "tub",
      geometry: tubGeo,
      localOffset: [0, 0, 0],
      materialHint: "porcelainWhite",
    });
    const faucetGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8);
    faucetGeo.translate(0, 0.075, 0);
    parts.push({
      name: "faucet",
      geometry: faucetGeo,
      localOffset: [0, h, -d / 2 + 0.05],
      materialHint: "brassHardware",
    });
  } else {
    // Shower stall
    const baseGeo = new THREE.BoxGeometry(w, 0.06, d);
    baseGeo.translate(0, 0.03, 0);
    parts.push({
      name: "base",
      geometry: baseGeo,
      localOffset: [0, 0, 0],
      materialHint: "tileFloor",
    });
    const glassGeo = new THREE.BoxGeometry(w, h, 0.01);
    glassGeo.translate(0, h / 2, 0);
    parts.push({
      name: "glass_panel",
      geometry: glassGeo,
      localOffset: [0, 0.06, d / 2],
      materialHint: "glassWindow",
      transparent: true,
      opacity: 0.5,
    });
  }

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, d / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateSmallObjectGeometry(
  w: number,
  d: number,
  h: number,
  kind: "plate" | "glass" | "mug" | "bottle" | "pan" | "book" | "lamp" | "plant" | "rug" | "curtain" | "picture-frame",
): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  if (kind === "plate") {
    const plateGeo = new THREE.CylinderGeometry(w / 2, w * 0.38, h, 20);
    plateGeo.translate(0, h / 2, 0);
    parts.push({
      name: "plate",
      geometry: plateGeo,
      localOffset: [0, 0, 0],
      materialHint: "porcelainWhite",
    });
  } else if (kind === "glass") {
    const glassGeo = new THREE.CylinderGeometry(w * 0.45, w * 0.35, h, 16);
    glassGeo.translate(0, h / 2, 0);
    parts.push({
      name: "glass",
      geometry: glassGeo,
      localOffset: [0, 0, 0],
      materialHint: "glassClear",
      transparent: true,
      opacity: 0.6,
    });
  } else if (kind === "mug") {
    const mugGeo = new THREE.CylinderGeometry(w * 0.38, w * 0.35, h, 16);
    mugGeo.translate(0, h / 2, 0);
    parts.push({
      name: "mug_body",
      geometry: mugGeo,
      localOffset: [0, 0, 0],
      materialHint: "ceramicTerracotta",
    });
    const handleGeo = new THREE.TorusGeometry(h * 0.3, 0.008, 8, 12, Math.PI);
    handleGeo.rotateZ(Math.PI / 2);
    parts.push({
      name: "handle",
      geometry: handleGeo,
      localOffset: [w * 0.38, h * 0.5, 0],
      materialHint: "ceramicTerracotta",
    });
  } else if (kind === "bottle") {
    const baseGeo = new THREE.CylinderGeometry(w * 0.4, w * 0.4, h * 0.7, 16);
    baseGeo.translate(0, (h * 0.7) / 2, 0);
    parts.push({
      name: "body",
      geometry: baseGeo,
      localOffset: [0, 0, 0],
      materialHint: "glassClear",
      transparent: true,
      opacity: 0.7,
    });
    const neckGeo = new THREE.CylinderGeometry(w * 0.15, w * 0.35, h * 0.3, 16);
    neckGeo.translate(0, (h * 0.3) / 2, 0);
    parts.push({
      name: "neck",
      geometry: neckGeo,
      localOffset: [0, h * 0.7, 0],
      materialHint: "glassClear",
      transparent: true,
      opacity: 0.7,
    });
  } else if (kind === "pan") {
    const panGeo = new THREE.CylinderGeometry(w * 0.48, w * 0.42, h * 0.6, 20);
    panGeo.translate(0, (h * 0.6) / 2, 0);
    parts.push({
      name: "pan_body",
      geometry: panGeo,
      localOffset: [0, 0, 0],
      materialHint: "castIron",
    });
    const handleGeo = new THREE.CylinderGeometry(0.012, 0.012, w * 0.7, 8);
    handleGeo.rotateZ(Math.PI / 2);
    parts.push({
      name: "handle",
      geometry: handleGeo,
      localOffset: [w * 0.7, h * 0.4, 0],
      materialHint: "oakWood",
    });
  } else if (kind === "plant") {
    const potGeo = new THREE.CylinderGeometry(w * 0.35, w * 0.25, h * 0.4, 16);
    potGeo.translate(0, (h * 0.4) / 2, 0);
    parts.push({
      name: "pot",
      geometry: potGeo,
      localOffset: [0, h * 0.2, 0],
      materialHint: "ceramicTerracotta",
    });
    const foliageGeo = new THREE.DodecahedronGeometry(w * 0.42, 1);
    foliageGeo.translate(0, w * 0.42, 0);
    parts.push({
      name: "foliage",
      geometry: foliageGeo,
      localOffset: [0, h * 0.38, 0],
      materialHint: "plantGreen",
    });
  } else if (kind === "rug") {
    const rugGeo = roundedBox(w, Math.max(0.005, h), d, 0.04);
    parts.push({
      name: "rug",
      geometry: rugGeo,
      localOffset: [0, 0, 0],
      materialHint: "fabricRug",
    });
  } else if (kind === "lamp") {
    // Turned base + pole + shade
    const baseGeo = new THREE.CylinderGeometry(w * 0.4, w * 0.45, 0.03, 16);
    baseGeo.translate(0, 0.015, 0);
    parts.push({
      name: "base",
      geometry: baseGeo,
      localOffset: [0, 0, 0],
      materialHint: "brassHardware",
    });
    const poleGeo = new THREE.CylinderGeometry(0.015, 0.015, h * 0.7, 8);
    poleGeo.translate(0, (h * 0.7) / 2, 0);
    parts.push({
      name: "pole",
      geometry: poleGeo,
      localOffset: [0, 0.03, 0],
      materialHint: "brassHardware",
    });
    const shadeGeo = new THREE.CylinderGeometry(w * 0.3, w * 0.48, h * 0.3, 16, 1, true);
    shadeGeo.translate(0, (h * 0.3) / 2, 0);
    parts.push({
      name: "shade",
      geometry: shadeGeo,
      localOffset: [0, h * 0.68, 0],
      materialHint: "fabricBedding",
    });
  } else {
    // Generic fallback for picture-frame, curtain, book
    const boxGeo = new THREE.BoxGeometry(w, h, d);
    boxGeo.translate(0, h / 2, 0);
    parts.push({
      name: "box",
      geometry: boxGeo,
      localOffset: [0, 0, 0],
      materialHint: kind === "curtain" ? "fabricCurtain" : "oakWood",
    });
  }

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, d / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

export function generateOutdoorOrSilhouetteGeometry(
  w: number,
  d: number,
  h: number,
  kind: "grill" | "patio-chair" | "planter" | "hose-reel" | "pet-cat" | "person-silhouette",
): ProceduralShapeResult {
  const parts: ProceduralShapePart[] = [];
  if (kind === "pet-cat") {
    // Body capsule
    const bodyCap = capsuleGeometry(w * 0.18, d * 0.4, 8, 4);
    bodyCap.rotateX(Math.PI / 2);
    parts.push({
      name: "cat_body",
      geometry: bodyCap,
      localOffset: [0, h * 0.4, 0],
      materialHint: "walnutWood",
    });
    // Head
    const headSphere = new THREE.SphereGeometry(w * 0.16, 8, 8);
    parts.push({
      name: "cat_head",
      geometry: headSphere,
      localOffset: [0, h * 0.65, d * 0.25],
      materialHint: "walnutWood",
    });
  } else if (kind === "person-silhouette") {
    // Stylized mannequin silhouette
    const headSphere = new THREE.SphereGeometry(w * 0.2, 10, 10);
    parts.push({
      name: "head",
      geometry: headSphere,
      localOffset: [0, h * 0.88, 0],
      materialHint: "fabricSofa",
    });
    const torsoGeo = taperedCylinder(w * 0.35, w * 0.25, h * 0.45, 10);
    parts.push({
      name: "torso",
      geometry: torsoGeo,
      localOffset: [0, h * 0.4, 0],
      materialHint: "fabricSofa",
    });
    const legsGeo = taperedCylinder(w * 0.2, w * 0.15, h * 0.4, 8);
    parts.push({
      name: "legs",
      geometry: legsGeo,
      localOffset: [0, 0, 0],
      materialHint: "castIron",
    });
  } else if (kind === "grill") {
    const kettleGeo = new THREE.SphereGeometry(w * 0.45, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    kettleGeo.rotateX(Math.PI);
    parts.push({
      name: "kettle",
      geometry: kettleGeo,
      localOffset: [0, h * 0.65, 0],
      materialHint: "castIron",
    });
    const tripodGeo = taperedCylinder(0.015, 0.015, h * 0.65, 6);
    parts.push({
      name: "stand",
      geometry: tripodGeo,
      localOffset: [0, 0, 0],
      materialHint: "castIron",
    });
  } else {
    // Generic box
    const geo = new THREE.BoxGeometry(w, h, d);
    geo.translate(0, h / 2, 0);
    parts.push({
      name: "body",
      geometry: geo,
      localOffset: [0, 0, 0],
      materialHint: "oakWood",
    });
  }

  const obb: OBB = {
    center: [0, h / 2, 0],
    halfExtents: [w / 2, h / 2, d / 2],
  };

  return {
    parts,
    obb,
    dispose: () => parts.forEach((p) => p.geometry.dispose()),
  };
}

// ---------------------------------------------------------------------------
// Unified Procedural Geometry Dispatcher
// ---------------------------------------------------------------------------

/**
 * Generate parametric geometry and OBB for any FurnitureKind in the Craftsman taxonomy.
 */
export function generateFurnitureGeometry(
  kind: FurnitureKind | string,
  w?: number,
  d?: number,
  h?: number,
): ProceduralShapeResult {
  // Resolve defaults if any dimension is missing
  const defaults = (FURNITURE_KIND_DEFAULTS as Record<string, { defaultSize: [number, number, number] }>)[kind];
  const width = w ?? defaults?.defaultSize[0] ?? 1.0;
  const depth = d ?? defaults?.defaultSize[1] ?? 0.8;
  const height = h ?? defaults?.defaultSize[2] ?? 0.8;

  switch (kind) {
    case "sofa":
    case "armchair":
      return generateSofaGeometry(width, depth, height);
    case "dining-table":
    case "coffee-table":
    case "side-table":
    case "desk":
    case "console-table":
      return generateDiningTableGeometry(width, depth, height);
    case "bookshelf":
      return generateBookshelfGeometry(width, depth, height);
    case "twin-bed":
    case "queen-bed":
    case "bunk-bed":
    case "crib":
    case "bed-master":
      return generateBedGeometry(width, depth, height);
    case "stove":
    case "oven":
      return generateStoveGeometry(width, depth, height);
    case "dining-chair":
    case "patio-chair":
      return generateChairGeometry(width, depth, height, false);
    case "rocking-chair":
      return generateChairGeometry(width, depth, height, true);
    case "bar-stool":
      return generateBarStoolGeometry(width, depth, height);
    case "dresser":
    case "cabinet":
    case "wardrobe":
    case "pantry":
    case "nightstand":
      return generateStorageCabinetGeometry(width, depth, height, kind as any);
    case "fridge":
    case "dishwasher":
    case "microwave":
    case "washer":
    case "dryer":
    case "range-hood":
      return generateApplianceGeometry(width, depth, height, kind as any);
    case "sink":
    case "toilet":
    case "bathtub":
    case "shower":
    case "vanity":
      return generateFixtureGeometry(width, depth, height, kind as any);
    case "plate":
    case "glass":
    case "mug":
    case "bottle":
    case "pan":
    case "book":
    case "lamp":
    case "plant":
    case "rug":
    case "curtain":
    case "picture-frame":
      return generateSmallObjectGeometry(width, depth, height, kind as any);
    case "grill":
    case "planter":
    case "hose-reel":
    case "pet-cat":
    case "person-silhouette":
      return generateOutdoorOrSilhouetteGeometry(width, depth, height, kind as any);
    default: {
      const parts: ProceduralShapePart[] = [];
      const geo = new THREE.BoxGeometry(width, height, depth);
      geo.translate(0, height / 2, 0);
      parts.push({
        name: "box",
        geometry: geo,
        localOffset: [0, 0, 0],
        materialHint: "walnutWood",
      });
      const obb: OBB = {
        center: [0, height / 2, 0],
        halfExtents: [width / 2, height / 2, depth / 2],
      };
      return {
        parts,
        obb,
        dispose: () => parts.forEach((p) => p.geometry.dispose()),
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Visual Mesh Builders (Material Pairing + Assembly)
// ---------------------------------------------------------------------------

function createMaterial(part: ProceduralShapePart): THREE.Material {
  const colorKey = part.materialHint && part.materialHint in CRAFTSMAN_PALETTE
    ? (part.materialHint as CraftsmanColorKey)
    : "walnutWood";
  const color = CRAFTSMAN_PALETTE[colorKey];

  return new THREE.MeshStandardMaterial({
    color,
    roughness: part.roughness ?? 0.5,
    metalness: part.metalness ?? 0.08,
    transparent: part.transparent ?? false,
    opacity: part.opacity ?? 1.0,
  });
}

function assembleMeshResult(proceduralResult: ProceduralShapeResult): FurnitureMeshResult {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];

  for (const part of proceduralResult.parts) {
    const mat = createMaterial(part);
    materials.push(mat);
    const mesh = new THREE.Mesh(part.geometry, mat);
    mesh.position.set(part.localOffset[0], part.localOffset[1], part.localOffset[2]);
    if (part.localRotation) {
      mesh.rotation.set(part.localRotation[0], part.localRotation[1], part.localRotation[2]);
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  return {
    group,
    obb: proceduralResult.obb,
    dispose: () => {
      proceduralResult.dispose();
      materials.forEach((m) => m.dispose());
    },
  };
}

export function buildSofa(w: number, d: number, h: number): FurnitureMeshResult {
  return assembleMeshResult(generateSofaGeometry(w, d, h));
}

export function buildDiningTable(w: number, d: number, h: number): FurnitureMeshResult {
  return assembleMeshResult(generateDiningTableGeometry(w, d, h));
}

export function buildBookshelf(w: number, d: number, h: number): FurnitureMeshResult {
  return assembleMeshResult(generateBookshelfGeometry(w, d, h));
}

export function buildBed(w: number, d: number, h: number): FurnitureMeshResult {
  return assembleMeshResult(generateBedGeometry(w, d, h));
}

export function buildStove(w: number, d: number, h: number): FurnitureMeshResult {
  return assembleMeshResult(generateStoveGeometry(w, d, h));
}

/**
 * Factory: build any furniture piece by name or taxonomy kind.
 */
export function buildFurniture(name: string, w: number, d: number, h: number): FurnitureMeshResult {
  const procResult = generateFurnitureGeometry(name, w, d, h);
  return assembleMeshResult(procResult);
}

// ---------------------------------------------------------------------------
// Room Floor Rendering
// ---------------------------------------------------------------------------

export function roomFloorMaterial(roomName: string): THREE.MeshStandardMaterial {
  const palette = CRAFTSMAN_PALETTE;
  if (roomName.includes("kitchen") || roomName.includes("bath"))
    return new THREE.MeshStandardMaterial({ color: palette.tileFloor, roughness: 0.35, metalness: 0.05 });
  if (roomName.includes("bedroom"))
    return new THREE.MeshStandardMaterial({ color: palette.carpetFloor, roughness: 0.92, metalness: 0.0 });
  return new THREE.MeshStandardMaterial({ color: palette.hardwoodFloor, roughness: 0.4, metalness: 0.05 });
}

