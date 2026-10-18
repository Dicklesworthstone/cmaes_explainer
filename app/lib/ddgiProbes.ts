// Dynamic Diffuse Global Illumination (DDGI) probe grid (cmaes-feat-pr4-ddgi).
//
// SOTA-grounded real-time indirect lighting for the Craftsman bungalow.
// Based on NVIDIA RTXGI v1 / v2 (Majercik et al. 2019, 2021):
//   - 3D grid of irradiance + visibility probes throughout the floorplan.
//   - Each probe encodes irradiance as an 8x8 octahedrally-mapped radial texel
//     array; Chebyshev distance / depth moments as a 16x16 array to prevent
//     light leaking through walls.
//   - Hysteresis blending: I_t = (1 - alpha) I_{t-1} + alpha I_sample.
//
// SOTA references:
//   - Majercik et al., "Dynamic Diffuse Global Illumination with Ray-Traced
//     Irradiance Probes" (NVIDIA, JCGT 2019; updated 2021).
//   - Majercik et al., "RTXGI: Scalable Ray Traced Global Illumination in
//     Real Time" (NVIDIA 2021).
//   - Ramamoorthi & Hanrahan, "An Efficient Representation for Irradiance
//     Environment Maps" (SIGGRAPH 2001) — for the SH basis we layer on top.
//   - Karis, "Real Shading in Unreal Engine 4" (SIGGRAPH 2013) — split-sum
//     approximation for IBL.
//
// SOTA-grounded acceptance criteria (from the bead description):
//   - Realistic indirect color bleeding (wood floor -> warm tones on white walls).
//   - No light leaking through 12cm Craftsman interior walls.
//
// This module implements the CPU-side scaffolding (probe grid topology,
// Chebyshev moment update, hysteresis, leakage prevention) so the same code
// can run on the main thread for offline / static bake and on a Web Worker
// for runtime updates. The actual WebGL probe-volume shader pass is the
// next epic (Epic 1 pr4 sister work in the G1 / arm stages).
//
// Determinism law (cmaes-mky): no `Math.random` / `performance.now` on the
// simulation path. All probe directions are derived from a deterministic
// golden-angle spiral (Vogel's method).

import * as THREE from "three";
import { type EmissiveSurface, evaluateEmissiveIlluminance } from "./emissiveSurfaces";
import {
  CRAFTSMAN_BUNGALOW_SH,
  evaluateSphericalHarmonics,
  type SphericalHarmonicsL2,
} from "./houseLighting";

/** Per-probe octahedral direction. 8x8 = 64 octahedral cells, each with a
 *  fixed direction on the sphere. Generated once at module load from a
 *  Vogel spiral; never modified at runtime. */
export interface DDGIOctahedralDirections {
  /** 64 unit vectors in the sphere, indexed by (iy * 8 + ix). */
  directions: Float32Array; // 64 * 3 floats
}

/** Per-probe state. */
export interface DDGIProbe {
  /** World-space position of the probe center. */
  position: [number, number, number];
  /** Octahedral 8x8 irradiance, RGB (3 floats per cell, 192 floats total). */
  irradiance: Float32Array;
  /** Octahedral 8x8 mean distance, 1 float per cell (64 floats total). */
  meanDistance: Float32Array;
  /** Octahedral 8x8 distance^2, 1 float per cell (64 floats total). */
  meanDistanceSq: Float32Array;
  /** Last-update timestamp (frame counter, not wall clock). */
  lastUpdate: number;
}

/** Probe grid layout: rectangular prism of probes centered on the floorplan. */
export interface DDGIProbeGrid {
  /** Number of probes along (x, y, z). Craftsman bungalow: 4 x 8 x 3. */
  dimensions: [number, number, number];
  /** Probe spacing in meters along (x, y, z). */
  spacing: [number, number, number];
  /** Origin (center of the floorplan) in world coordinates. */
  origin: [number, number, number];
  /** Flat list of probes, dimensions[0] * dimensions[1] * dimensions[2] entries. */
  probes: DDGIProbe[];
  /** Hysteresis blend factor (0 = static, 1 = snap-to-sample). */
  blendAlpha: number;
  /** Maximum distance a probe ray can travel (used to cull far occluders). */
  maxRayDistance: number;
  /** Whether the grid is enabled (master kill switch). */
  enabled: boolean;
}

const OCTAHEDRAL_RES = 8;
const OCTAHEDRAL_CELLS = OCTAHEDRAL_RES * OCTAHEDRAL_RES; // 64

/** Generate 64 deterministic directions on the unit sphere via a Vogel
 *  golden-angle spiral. The directions are sorted by (iy, ix) for stable
 *  probe-to-probe interpolation. */
export function generateOctahedralDirections(): DDGIOctahedralDirections {
  const dirs = new Float32Array(OCTAHEDRAL_CELLS * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // 2.39996...
  for (let i = 0; i < OCTAHEDRAL_CELLS; i++) {
    const y = 1 - (i / (OCTAHEDRAL_CELLS - 1)) * 2; // [-1, 1]
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    dirs[i * 3 + 0] = x;
    dirs[i * 3 + 1] = y;
    dirs[i * 3 + 2] = z;
  }
  return { directions: dirs };
}

/** Single-probe state initialized to a flat ambient irradiance (the
 *  Craftsman SH's L00 coefficient). */
export function createProbe(
  position: [number, number, number],
  ambient: [number, number, number] = [0.85, 0.78, 0.68],
): DDGIProbe {
  return {
    position,
    irradiance: new Float32Array(OCTAHEDRAL_CELLS * 3).fill(0).map((_, i) => {
      const ch = i % 3;
      return ambient[ch];
    }),
    meanDistance: new Float32Array(OCTAHEDRAL_CELLS).fill(10),
    meanDistanceSq: new Float32Array(OCTAHEDRAL_CELLS).fill(100),
    lastUpdate: 0,
  };
}

/** Build a 4x8x3 probe grid for the Craftsman bungalow (or a custom layout). */
export function createProbeGrid(
  origin: [number, number, number] = [0, 0, 1.25],
  spacing: [number, number, number] = [2.0, 1.4, 1.25],
  dimensions: [number, number, number] = [4, 8, 3],
  blendAlpha = 0.05,
  maxRayDistance = 8.0,
): DDGIProbeGrid {
  const [nx, ny, nz] = dimensions;
  const total = nx * ny * nz;
  const probes: DDGIProbe[] = new Array(total);
  for (let iz = 0; iz < nz; iz++) {
    for (let iy = 0; iy < ny; iy++) {
      for (let ix = 0; ix < nx; ix++) {
        const pos: [number, number, number] = [
          origin[0] + (ix - (nx - 1) / 2) * spacing[0],
          origin[1] + (iy - (ny - 1) / 2) * spacing[1],
          origin[2] + (iz - (nz - 1) / 2) * spacing[2],
        ];
        const idx = (iz * ny + iy) * nx + ix;
        probes[idx] = createProbe(pos);
      }
    }
  }
  return {
    dimensions,
    spacing,
    origin,
    probes,
    blendAlpha,
    maxRayDistance,
    enabled: true,
  };
}

/** Sample a probe's irradiance at a given world-space direction using
 *  trilinear interpolation across the 8 nearest probes. Returns the
 *  interpolated RGB and the Chebyshev-weighted visibility (0 = fully
 *  occluded, 1 = no occluder). */
export function sampleProbeGrid(
  grid: DDGIProbeGrid,
  worldPos: [number, number, number],
  worldDir: [number, number, number],
  surfaceDistance: number,
): { rgb: [number, number, number]; visibility: number } {
  if (!grid.enabled) {
    return { rgb: [0, 0, 0], visibility: 0 };
  }
  const [nx, ny, nz] = grid.dimensions;
  const [ox, oy, oz] = grid.origin;
  const [sx, sy, sz] = grid.spacing;
  // Trilinear fractional coords in the probe grid
  const fx = (worldPos[0] - ox) / sx + (nx - 1) / 2;
  const fy = (worldPos[1] - oy) / sy + (ny - 1) / 2;
  const fz = (worldPos[2] - oz) / sz + (nz - 1) / 2;
  // Clamp to grid bounds
  const cx = Math.max(0, Math.min(Math.max(0, nx - 1.001), fx));
  const cy = Math.max(0, Math.min(Math.max(0, ny - 1.001), fy));
  const cz = Math.max(0, Math.min(Math.max(0, nz - 1.001), fz));
  const ix0 = Math.floor(cx);
  const iy0 = Math.floor(cy);
  const iz0 = Math.floor(cz);
  const tx = cx - ix0;
  const ty = cy - iy0;
  const tz = cz - iz0;
  // Find the octahedral cell index for this direction
  const cellIdx = octahedralCellIndex(worldDir);
  // 8-corner sample + trilinear + Chebyshev visibility blend (Majercik et al. 2019)
  let r = 0;
  let g = 0;
  let b = 0;
  let vis = 0;
  let wIrr = 0;
  let wVis = 0;
  for (let dz = 0; dz <= 1; dz++) {
    for (let dy = 0; dy <= 1; dy++) {
      for (let dx = 0; dx <= 1; dx++) {
        const wx = dx === 0 ? 1 - tx : tx;
        const wy = dy === 0 ? 1 - ty : ty;
        const wz = dz === 0 ? 1 - tz : tz;
        const weight = wx * wy * wz;
        const ix = Math.min(nx - 1, ix0 + dx);
        const iy = Math.min(ny - 1, iy0 + dy);
        const iz = Math.min(nz - 1, iz0 + dz);
        const idx = (iz * ny + iy) * nx + ix;
        const probe = grid.probes[idx];
        const cellBase = cellIdx * 3;
        const meanD = probe.meanDistance[cellIdx];
        const meanD2 = probe.meanDistanceSq[cellIdx];
        // One-tailed Cantelli / Chebyshev visibility (Majercik et al. 2019 Eq. 3):
        // Unoccluded (1.0) when surfaceDistance <= meanD; otherwise sigma^2 / (sigma^2 + (t - meanD)^2 + eps).
        const eps = 1e-4;
        const variance = Math.max(0, meanD2 - meanD * meanD);
        let cheb = 1.0;
        if (surfaceDistance > meanD) {
          const diff = surfaceDistance - meanD;
          cheb = Math.max(0, Math.min(1, variance / (variance + diff * diff + eps)));
        }
        // Weight probe irradiance by trilinear * crushed Chebyshev visibility to prevent light leaking through walls
        const visWeight = Math.max(1e-4, cheb * cheb * cheb);
        const probeIrrWeight = weight * visWeight;
        r += probe.irradiance[cellBase + 0] * probeIrrWeight;
        g += probe.irradiance[cellBase + 1] * probeIrrWeight;
        b += probe.irradiance[cellBase + 2] * probeIrrWeight;
        vis += cheb * weight;
        wIrr += probeIrrWeight;
        wVis += weight;
      }
    }
  }
  if (wIrr > 0) {
    r /= wIrr;
    g /= wIrr;
    b /= wIrr;
  }
  if (wVis > 0) {
    vis /= wVis;
  }
  return { rgb: [r, g, b], visibility: vis };
}

/** Map a unit direction to an octahedral cell index (0..63) using the
 *  standard octahedral encoding (Cigolle et al. 2014). 8x8 grid in u/v
 *  coordinates. */
export function octahedralCellIndex(dir: [number, number, number]): number {
  const [x, y, z] = dir;
  const len = Math.hypot(x, y, z);
  if (len < 1e-9) return 0;
  const nx = x / len;
  const ny = y / len;
  const nz = z / len;
  const l1 = Math.abs(nx) + Math.abs(ny) + Math.abs(nz);
  let px = nx / l1;
  let py = ny / l1;
  if (nz < 0) {
    const ox = (1 - Math.abs(py)) * (px >= 0 ? 1 : -1);
    const oy = (1 - Math.abs(px)) * (py >= 0 ? 1 : -1);
    px = ox;
    py = oy;
  }
  const u = px * 0.5 + 0.5;
  const v = py * 0.5 + 0.5;
  const ix = Math.max(0, Math.min(OCTAHEDRAL_RES - 1, Math.floor(u * OCTAHEDRAL_RES)));
  const iy = Math.max(0, Math.min(OCTAHEDRAL_RES - 1, Math.floor(v * OCTAHEDRAL_RES)));
  return iy * OCTAHEDRAL_RES + ix;
}

/** Inverse of `octahedralCellIndex`: maps an octahedral cell index (0..63)
 *  to the unit direction at the center of that cell (Cigolle et al. 2014). */
export function octahedralCellDirection(cellIdx: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(OCTAHEDRAL_CELLS - 1, Math.floor(cellIdx)));
  const ix = clamped % OCTAHEDRAL_RES;
  const iy = Math.floor(clamped / OCTAHEDRAL_RES);
  const u = (ix + 0.5) / OCTAHEDRAL_RES;
  const v = (iy + 0.5) / OCTAHEDRAL_RES;
  let px = u * 2 - 1;
  let py = v * 2 - 1;
  const pz = 1 - Math.abs(px) - Math.abs(py);
  if (pz < 0) {
    const ox = (1 - Math.abs(py)) * (px >= 0 ? 1 : -1);
    const oy = (1 - Math.abs(px)) * (py >= 0 ? 1 : -1);
    px = ox;
    py = oy;
  }
  const len = Math.hypot(px, py, pz) || 1;
  return [px / len, py / len, pz / len];
}

/** Hysteresis update: blend the previous irradiance with the new sample.
 *  I_t = (1 - alpha) * I_{t-1} + alpha * I_sample. This is what the bead
 *  description calls out (Majercik 2019 Eq. 5). */
export function hysteresisUpdate(
  grid: DDGIProbeGrid,
  probeIdx: number,
  newIrradiance: Float32Array,
  newMeanDistance: Float32Array,
  newMeanDistanceSq: Float32Array,
): void {
  const probe = grid.probes[probeIdx];
  const alpha = grid.blendAlpha;
  for (let i = 0; i < OCTAHEDRAL_CELLS * 3; i++) {
    probe.irradiance[i] = (1 - alpha) * probe.irradiance[i] + alpha * newIrradiance[i];
  }
  for (let i = 0; i < OCTAHEDRAL_CELLS; i++) {
    probe.meanDistance[i] = (1 - alpha) * probe.meanDistance[i] + alpha * newMeanDistance[i];
    probe.meanDistanceSq[i] = (1 - alpha) * probe.meanDistanceSq[i] + alpha * newMeanDistanceSq[i];
  }
  probe.lastUpdate += 1;
}

export interface DDGIProbeSceneUpdateOptions {
  /** Simulation time in seconds for dynamic emissive flicker. */
  timeSeconds?: number;
  /** Diffuse albedo [r, g, b] of hit scene surfaces (default warm wood/plaster [0.65, 0.58, 0.50]). */
  surfaceAlbedo?: [number, number, number];
  /** Ambient Spherical Harmonics fallback for rays that miss or for secondary bounce. */
  ambientSh?: SphericalHarmonicsL2;
  /** Maximum sphere-tracing steps per probe ray (default 24). */
  maxMarchSteps?: number;
  /** Optional subset of probe indices to update (defaults to all probes in grid). */
  probeIndices?: number[];
}

/**
 * Ray-casts the 64 octahedral cell directions from each probe against a scene SDF
 * (`sceneSdf(x, y, z)`) and accumulates bounced direct illuminance from `emissiveSurfaces`
 * plus Chebyshev visibility moments (`meanDistance`, `meanDistanceSq`) via `hysteresisUpdate`.
 */
export function updateProbeGridFromScene(
  grid: DDGIProbeGrid,
  sceneSdf: (x: number, y: number, z: number) => number,
  emissiveSurfaces: EmissiveSurface[],
  options: DDGIProbeSceneUpdateOptions = {},
): void {
  if (!grid.enabled) return;

  const timeSeconds = options.timeSeconds ?? 0.0;
  const albedo = options.surfaceAlbedo ?? [0.65, 0.58, 0.5];
  const ambientSh = options.ambientSh ?? CRAFTSMAN_BUNGALOW_SH;
  const maxSteps = options.maxMarchSteps ?? 24;

  const sampleIrr = new Float32Array(OCTAHEDRAL_CELLS * 3);
  const sampleDist = new Float32Array(OCTAHEDRAL_CELLS);
  const sampleDistSq = new Float32Array(OCTAHEDRAL_CELLS);

  const indices = options.probeIndices;
  const probeCount = indices ? indices.length : grid.probes.length;

  for (let p = 0; p < probeCount; p++) {
    const probeIdx = indices ? indices[p] : p;
    const probe = grid.probes[probeIdx];
    if (!probe) continue;

    const [px, py, pz] = probe.position;

    for (let cellIdx = 0; cellIdx < OCTAHEDRAL_CELLS; cellIdx++) {
      const [dx, dy, dz] = octahedralCellDirection(cellIdx);

      // Sphere-trace ray p + t * d
      let t = 0.05;
      let hit = false;
      for (let s = 0; s < maxSteps; s++) {
        const dist = sceneSdf(px + dx * t, py + dy * t, pz + dz * t);
        if (dist <= 1e-3) {
          hit = true;
          break;
        }
        t += Math.max(0.02, dist);
        if (t >= grid.maxRayDistance) {
          t = grid.maxRayDistance;
          break;
        }
      }

      let r = 0;
      let g = 0;
      let b = 0;
      if (hit) {
        const hx = px + dx * t;
        const hy = py + dy * t;
        const hz = pz + dz * t;
        const eps = 1e-3;
        const gx = sceneSdf(hx + eps, hy, hz) - sceneSdf(hx - eps, hy, hz);
        const gy = sceneSdf(hx, hy + eps, hz) - sceneSdf(hx, hy - eps, hz);
        const gz = sceneSdf(hx, hy, hz + eps) - sceneSdf(hx, hy, hz - eps);
        const gLen = Math.hypot(gx, gy, gz) || 1.0;
        const hitNormal: [number, number, number] = [gx / gLen, gy / gLen, gz / gLen];

        const directE = evaluateEmissiveIlluminance(
          [hx, hy, hz],
          hitNormal,
          emissiveSurfaces,
          timeSeconds,
        );
        const ambBounce = fallbackIrradiance(hitNormal, ambientSh);
        r = (albedo[0] / Math.PI) * directE[0] + albedo[0] * 0.25 * ambBounce[0];
        g = (albedo[1] / Math.PI) * directE[1] + albedo[1] * 0.25 * ambBounce[1];
        b = (albedo[2] / Math.PI) * directE[2] + albedo[2] * 0.25 * ambBounce[2];
      } else {
        const sky = fallbackIrradiance([dx, dy, dz], ambientSh);
        r = sky[0];
        g = sky[1];
        b = sky[2];
      }

      sampleIrr[cellIdx * 3 + 0] = r;
      sampleIrr[cellIdx * 3 + 1] = g;
      sampleIrr[cellIdx * 3 + 2] = b;
      sampleDist[cellIdx] = t;
      sampleDistSq[cellIdx] = t * t;
    }

    hysteresisUpdate(grid, probeIdx, sampleIrr, sampleDist, sampleDistSq);
  }
}

/** Reset the grid to the ambient state (used when toggling, when the
 *  user changes the lighting setup, or when the camera teleports). */
export function resetProbeGrid(grid: DDGIProbeGrid): void {
  for (const probe of grid.probes) {
    for (let i = 0; i < OCTAHEDRAL_CELLS; i++) {
      probe.irradiance[i * 3 + 0] = 0.85;
      probe.irradiance[i * 3 + 1] = 0.78;
      probe.irradiance[i * 3 + 2] = 0.68;
      probe.meanDistance[i] = 10;
      probe.meanDistanceSq[i] = 100;
    }
    probe.lastUpdate = 0;
  }
}

/** Compute the bounding box of the probe grid in world space (for
 *  visualization / debug overlays). */
export function probeGridBounds(grid: DDGIProbeGrid): {
  min: [number, number, number];
  max: [number, number, number];
} {
  const [nx, ny, nz] = grid.dimensions;
  const [sx, sy, sz] = grid.spacing;
  const [ox, oy, oz] = grid.origin;
  return {
    min: [ox - (nx * sx) / 2, oy - (ny * sy) / 2, oz - (nz * sz) / 2],
    max: [ox + (nx * sx) / 2, oy + (ny * sy) / 2, oz + (nz * sz) / 2],
  };
}

// Minimal interface that probeGridToTexture3D needs from Three's Data3DTexture.
// Defined here as a structural type so the rest of the function can use plain
// fields without a class-typed import.
interface Data3DTextureLike {
  readonly image: { data: Uint8Array; width: number; height: number; depth: number };
  readonly needsUpdate: boolean;
}

// Cached feature-detect: populated at module load by reading the Three.js
// namespace once. `null` means this Three.js version does not export
// Data3DTexture (older builds / React-Native-Web / headless test envs).
const Data3DTextureCtor:
  | (new (
      data: Uint8Array,
      width: number,
      height: number,
      depth: number,
    ) => Data3DTextureLike)
  | null =
  (THREE as unknown as Record<string, unknown>).Data3DTexture instanceof Function
    ? (
        THREE as unknown as Record<
          string,
          new (
            data: Uint8Array,
            width: number,
            height: number,
            depth: number,
          ) => Data3DTextureLike
        >
      ).Data3DTexture
    : null;

/** Three.js DataTexture wrapper for the probe grid irradiance (3D RGBA
 *  texture, dimensions = (nx, ny, nz), each cell = 64*3 floats packed).
 *  Useful for the WebGL probe-volume shader pass (next epic).
 *  Returns `null` when this Three.js build does not expose Data3DTexture
 *  (e.g., older versions or a Node test environment). */
export function probeGridToTexture3D(grid: DDGIProbeGrid): Data3DTextureLike | null {
  if (Data3DTextureCtor === null) {
    return null;
  }
  const [nx, ny, nz] = grid.dimensions;
  const data = new Uint8Array(nx * ny * nz * 4);
  for (let i = 0; i < grid.probes.length; i++) {
    const probe = grid.probes[i];
    // Pack the average irradiance into a single RGBA texel (averaged over the
    // 64 octahedral cells — this is the ambient probe; the full 64 cells
    // would need a 4D texture or 64 separate slices).
    let r = 0;
    let g = 0;
    let b = 0;
    for (let c = 0; c < OCTAHEDRAL_CELLS; c++) {
      r += probe.irradiance[c * 3 + 0];
      g += probe.irradiance[c * 3 + 1];
      b += probe.irradiance[c * 3 + 2];
    }
    r /= OCTAHEDRAL_CELLS;
    g /= OCTAHEDRAL_CELLS;
    b /= OCTAHEDRAL_CELLS;
    const off = i * 4;
    data[off + 0] = Math.min(255, Math.max(0, r * 255));
    data[off + 1] = Math.min(255, Math.max(0, g * 255));
    data[off + 2] = Math.min(255, Math.max(0, b * 255));
    data[off + 3] = 255;
  }
  return new Data3DTextureCtor(data, nx, ny, nz);
}

/** Use the Craftsman SH as the fallback when no probe data is available
 *  (e.g., a probe is outside the grid, or a fragment is in a corner the
 *  probes don't cover). */
export function fallbackIrradiance(
  normal: [number, number, number],
  sh: SphericalHarmonicsL2 = CRAFTSMAN_BUNGALOW_SH,
): [number, number, number] {
  return evaluateSphericalHarmonicsFromSh(normal, sh);
}

/** Internal: evaluate the 9-coefficient SH for a normal using the
 *  Ramamoorthi-Hanrahan (2001) basis from houseLighting.ts, clamped to [0, 1]. */
function evaluateSphericalHarmonicsFromSh(
  normal: [number, number, number],
  sh: SphericalHarmonicsL2,
): [number, number, number] {
  const [r, g, b] = evaluateSphericalHarmonics(normal, sh);
  return [Math.max(0, Math.min(1, r)), Math.max(0, Math.min(1, g)), Math.max(0, Math.min(1, b))];
}

