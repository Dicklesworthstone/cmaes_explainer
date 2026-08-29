// Lumen-Style Emissive Surfaces & Procedural Flame Flicker Engine (cmaes-feat-pr8-emissive).
//
// Implements physical blackbody color temperature modeling, multi-octave deterministic
// fireplace flicker synthesis, and direct/indirect emissive surface radiance distribution
// for ceiling recessed spots, hearth fires, kitchen ovens, and appliance status LEDs.
//
// Mathematical Formulations:
//   - Blackbody Color Temperature (Planckian Radiation approximation):
//       T \in [1000\text{K}, 12000\text{K}] \to (R, G, B)_{\text{linear}}
//   - Multi-Octave Turbulent Fireplace Flicker:
//       I_{\text{fire}}(f, \text{phase}) = I_0 \cdot \left( 0.85 + 0.15 \cdot (n_1 + 0.5 n_2 + 0.25 n_3) \right)
//   - Inverse-Square Lambertian Falloff:
//       E(\mathbf{x}) = \frac{I_{\text{emissive}} \cdot \max(0, \mathbf{n}_{\text{src}} \cdot -\mathbf{L}) \cdot \max(0, \mathbf{n}_{\text{recv}} \cdot \mathbf{L})}{\|\mathbf{x} - \mathbf{p}_{\text{src}}\|^2 + r_{\text{emitter}}^2}
//
// SOTA References:
//   - Tanner Helland, "How to Convert Temperature (K) to RGB" (2012)
//   - Epic Games / Unreal Engine Lumen Dynamic Emissive Architecture (2022)
//   - Ramamoorthi & Hanrahan, "An Efficient Representation for Irradiance Environment Maps" (2001)

import type { MeshStandardMaterial } from "three";

export type EmissiveKind =
  | "recessed-ceiling-light"
  | "fireplace-flame"
  | "oven-interior"
  | "range-pilot-light"
  | "refrigerator-interior"
  | "microwave-display"
  | "bedside-lamp"
  | "candle"
  | "ceiling-recessed"
  | "fireplace-hearth"
  | "oven-glow"
  | "appliance-led"
  | "window-daylight";

export const ALL_EMISSIVE_KINDS: EmissiveKind[] = [
  "recessed-ceiling-light",
  "fireplace-flame",
  "oven-interior",
  "range-pilot-light",
  "refrigerator-interior",
  "microwave-display",
  "bedside-lamp",
  "candle",
];

export interface EmissiveSurface {
  id?: string;
  kind: EmissiveKind;
  position: [number, number, number]; // [x, y, z]
  normal?: [number, number, number]; // Outward emission normal
  area?: number; // Surface area in m^2
  baseIntensity: number; // Peak radiance in W/(sr*m^2) or cd/m^2
  color: [number, number, number]; // Linear RGB [0..1]
  phase: number;
  on: boolean;
  colorTemperatureK?: number; // Kelvin (e.g. 2700 for warm white, 1900 for fire)
  colorRgb?: [number, number, number]; // Explicit linear RGB override
  flickerSeed?: number; // PRNG seed for fire/flicker
}

export interface EmissiveRadianceResult {
  colorRgb: [number, number, number];
  intensity: number;
  totalRadiance: [number, number, number]; // RGB * intensity
  bloomContribution: boolean; // True if exceeds bloom threshold (>= 1.2)
}

/**
 * Approximate conversion from Color Temperature in Kelvin to linear RGB [0..1, 0..1, 0..1].
 */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const temp = Math.max(1000, Math.min(40000, kelvin)) / 100.0;
  let red: number;
  let green: number;
  let blue: number;

  // Red
  if (temp <= 66) {
    red = 255;
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    red = Math.max(0, Math.min(255, red));
  }

  // Green
  if (temp <= 66) {
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    green = Math.max(0, Math.min(255, green));
  } else {
    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    green = Math.max(0, Math.min(255, green));
  }

  // Blue
  if (temp >= 66) {
    blue = 255;
  } else if (temp <= 19) {
    blue = 0;
  } else {
    blue = temp - 10;
    blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    blue = Math.max(0, Math.min(255, blue));
  }

  // Convert sRGB to linear RGB
  const toLinear = (c: number): number => {
    const s = c / 255.0;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  return [toLinear(red), toLinear(green), toLinear(blue)];
}

export const blackbodyToRGB = kelvinToRgb;

export const EMISSIVE_PALETTE: Record<string, [number, number, number]> = {
  incandescent2700K: kelvinToRgb(2700),
  warmWhite3000K: kelvinToRgb(3000),
  oven2000K: kelvinToRgb(2000),
  fireplace1500K: kelvinToRgb(1500),
  candle1800K: kelvinToRgb(1800),
  daylight6500K: kelvinToRgb(6500),
  incandescentHalf: kelvinToRgb(2700).map((v) => v * 0.5) as [number, number, number],
};

function defaultParamsForKind(kind: EmissiveKind): {
  color: [number, number, number];
  baseIntensity: number;
  flickers: boolean;
} {
  switch (kind) {
    case "recessed-ceiling-light":
    case "ceiling-recessed":
      return { color: EMISSIVE_PALETTE.warmWhite3000K, baseIntensity: 3.5, flickers: false };
    case "fireplace-flame":
    case "fireplace-hearth":
      return { color: EMISSIVE_PALETTE.fireplace1500K, baseIntensity: 4.0, flickers: true };
    case "oven-interior":
    case "oven-glow":
      return { color: EMISSIVE_PALETTE.oven2000K, baseIntensity: 1.8, flickers: false };
    case "range-pilot-light":
      return { color: [0.1, 0.4, 1.0], baseIntensity: 1.2, flickers: false };
    case "refrigerator-interior":
      return { color: EMISSIVE_PALETTE.daylight6500K, baseIntensity: 2.0, flickers: false };
    case "microwave-display":
    case "appliance-led":
      return { color: [0.1, 0.85, 1.0], baseIntensity: 0.8, flickers: false };
    case "bedside-lamp":
      return { color: EMISSIVE_PALETTE.incandescent2700K, baseIntensity: 2.2, flickers: false };
    case "candle":
      return { color: EMISSIVE_PALETTE.candle1800K, baseIntensity: 1.0, flickers: true };
    case "window-daylight":
      return { color: EMISSIVE_PALETTE.daylight6500K, baseIntensity: 5.0, flickers: false };
  }
}

export function createEmissiveSurface(
  kind: EmissiveKind,
  position: [number, number, number],
  phase = 0,
  on = true,
): EmissiveSurface {
  const def = defaultParamsForKind(kind);
  return {
    kind,
    position,
    phase,
    on,
    color: def.color,
    baseIntensity: def.baseIntensity,
    normal: [0, -1, 0],
    area: 0.1,
  };
}

export function createCraftsmanEmissives(): EmissiveSurface[] {
  return [
    createEmissiveSurface("recessed-ceiling-light", [1.5, 2.8, 1.5], 0),
    createEmissiveSurface("recessed-ceiling-light", [4.5, 2.8, 1.5], 0),
    createEmissiveSurface("recessed-ceiling-light", [1.5, 2.8, 4.5], 0),
    createEmissiveSurface("recessed-ceiling-light", [4.5, 2.8, 4.5], 0),
    createEmissiveSurface("fireplace-flame", [0.2, 0.4, 2.5], 0),
    createEmissiveSurface("bedside-lamp", [6.0, 1.0, 2.0], 0),
    createEmissiveSurface("bedside-lamp", [6.0, 1.0, 4.0], 1),
    createEmissiveSurface("oven-interior", [2.5, 0.6, 6.0], 0),
    createEmissiveSurface("candle", [3.0, 0.9, 3.0], 2),
  ];
}

/**
 * Deterministic multi-octave fireplace flame turbulence and flicker generator.
 */
export function computeFireplaceFlicker(timeSeconds: number, seed = 42): number {
  const s1 = seed * 1.6180339887;
  const s2 = seed * 2.7182818284;
  const s3 = seed * 3.1415926535;

  const o1 = 0.35 * Math.sin(2.0 * Math.PI * 4.2 * timeSeconds + s1);
  const o2 = 0.18 * Math.sin(2.0 * Math.PI * 9.5 * timeSeconds + s2);
  const o3 = 0.09 * Math.sin(2.0 * Math.PI * 16.3 * timeSeconds + s3);

  const raw = 1.0 + o1 + o2 + o3;
  return Math.max(0.35, Math.min(1.75, raw));
}

function flickerFireplace(frame: number, phase: number, base: number): number {
  const t = frame * 0.05 + phase * 1.337;
  const n1 = 0.5 + 0.5 * Math.sin(t * 3.7);
  const n2 = 0.5 + 0.5 * Math.sin(t * 7.1 + 1.2);
  const n3 = 0.5 + 0.5 * Math.sin(t * 13.9 + 2.4);
  const modulation = 0.85 + 0.15 * (n1 + 0.5 * n2 + 0.25 * n3);
  return base * modulation;
}

export function liveEmissiveIntensity(surface: EmissiveSurface, frame: number): number {
  if (!surface.on) return 0;
  if (surface.kind === "fireplace-flame" || surface.kind === "fireplace-hearth" || surface.kind === "candle") {
    return flickerFireplace(frame, surface.phase, surface.baseIntensity);
  }
  if (surface.kind === "bedside-lamp") {
    const t = frame * 0.1 + surface.phase * 2.0;
    return surface.baseIntensity * (0.98 + 0.02 * Math.sin(t));
  }
  return surface.baseIntensity;
}

export function liveEmissiveColor(surface: EmissiveSurface, frame: number): [number, number, number] {
  if (!surface.on) return [0, 0, 0];
  if (surface.kind === "fireplace-flame" || surface.kind === "fireplace-hearth") {
    const shift = 0.05 * Math.sin(frame * 0.03 + surface.phase);
    return [
      Math.min(1.0, surface.color[0] + shift),
      Math.max(0.0, surface.color[1] - shift * 0.5),
      surface.color[2],
    ];
  }
  return surface.color;
}

export function applyEmissiveToMaterial(
  surface: EmissiveSurface,
  frame: number,
  material: MeshStandardMaterial,
): void {
  const intensity = liveEmissiveIntensity(surface, frame);
  const col = liveEmissiveColor(surface, frame);
  if (material.emissive && typeof material.emissive.setRGB === "function") {
    material.emissive.setRGB(col[0], col[1], col[2]);
  }
  material.emissiveIntensity = intensity;
}

/**
 * Computes instantaneous emitted radiance for a given emissive surface.
 */
export function evaluateEmissiveSurface(
  surface: EmissiveSurface,
  timeSeconds = 0.0,
): EmissiveRadianceResult {
  let baseRgb: [number, number, number] = surface.color ?? [1, 1, 1];

  if (surface.colorRgb) {
    baseRgb = surface.colorRgb;
  } else if (surface.colorTemperatureK) {
    baseRgb = kelvinToRgb(surface.colorTemperatureK);
  }

  let intensity = surface.baseIntensity;
  if (surface.kind === "fireplace-hearth" || surface.kind === "fireplace-flame") {
    const flicker = computeFireplaceFlicker(timeSeconds, surface.flickerSeed ?? 42);
    intensity *= flicker;
  }

  const totalRadiance: [number, number, number] = [
    baseRgb[0] * intensity,
    baseRgb[1] * intensity,
    baseRgb[2] * intensity,
  ];

  const maxChannel = Math.max(...totalRadiance);

  return {
    colorRgb: baseRgb,
    intensity,
    totalRadiance,
    bloomContribution: maxChannel >= 1.2,
  };
}

/**
 * Evaluates direct diffuse illuminance arriving at a receiver point [x, y, z] with normal N
 * from an array of scene emissive surfaces.
 */
export function evaluateEmissiveIlluminance(
  receiverPos: [number, number, number],
  receiverNormal: [number, number, number],
  surfaces: EmissiveSurface[],
  timeSeconds = 0.0,
): [number, number, number] {
  let totalE: [number, number, number] = [0, 0, 0];

  for (let i = 0; i < surfaces.length; i++) {
    const surf = surfaces[i];
    const rad = evaluateEmissiveSurface(surf, timeSeconds);

    const dx = surf.position[0] - receiverPos[0];
    const dy = surf.position[1] - receiverPos[1];
    const dz = surf.position[2] - receiverPos[2];
    const distSq = dx * dx + dy * dy + dz * dz;
    const dist = Math.sqrt(distSq) || 1e-4;

    const lx = dx / dist;
    const ly = dy / dist;
    const lz = dz / dist;

    const cosRecv = Math.max(
      0.0,
      receiverNormal[0] * lx + receiverNormal[1] * ly + receiverNormal[2] * lz,
    );

    const nEmit = surf.normal ?? [0, -1, 0];
    const cosEmit = Math.max(0.0, -(nEmit[0] * lx + nEmit[1] * ly + nEmit[2] * lz));

    if (cosRecv <= 0.0 || cosEmit <= 0.0) {
      continue;
    }

    const area = surf.area ?? 0.1;
    const geomFactor = (cosRecv * cosEmit * area) / (distSq + 0.04);

    totalE[0] += rad.totalRadiance[0] * geomFactor;
    totalE[1] += rad.totalRadiance[1] * geomFactor;
    totalE[2] += rad.totalRadiance[2] * geomFactor;
  }

  return totalE;
}
