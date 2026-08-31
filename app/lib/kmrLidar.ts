// 2D LiDAR-style planar scan for the KUKA KMR base.
//
// Virtual sensor that leverages the existing distanceToOBB (Oriented
// Bounding Box) helper from houseMultiObstacleKernel. The KMR's
// real SICK or Hokuyo scanner would do the same against a mesh; we
// take the closed-form OBB distance instead of running a raytracer.
//
// SOTA / textbook references:
// - Thrun, Burgard, Fox, "Probabilistic Robotics" (MIT Press 2005),
//   Chapter 6 (range sensors) and Chapter 9 (particle filters).
// - The standard 2D range model is z_t = x_t + n_t with Gaussian
//   noise; we expose a noise parameter so consumers can simulate
//   measurement uncertainty.

import type { OrientedBoundingBox } from "./houseMultiObstacleKernel";

export interface LidarConfig {
  numRays: number;
  maxRangeMeters: number;
  minRangeMeters: number;
  fovDegrees: number;
  noiseStdDevMeters: number;
}

export const KUKA_KMR_IIWA_LIDAR_DEFAULT: LidarConfig = {
  // A SICK nanoScan3 or Hokuyo UST-30LX-class 2D LiDAR.
  numRays: 64,
  maxRangeMeters: 8.0,
  minRangeMeters: 0.1,
  fovDegrees: 270,
  noiseStdDevMeters: 0.02,
};

export interface LidarRay {
  angleRadians: number;
  rangeMeters: number;
  hit: boolean;
}

export interface LidarScan {
  rays: LidarRay[];
  // The KMR base-frame position the scan was taken from.
  baseXMeters: number;
  baseYMeters: number;
}

// Seeded LCG for deterministic noise (avoids non-determinism in tests).
function makeSeededGaussian(seed: number): (mean: number, std: number) => number {
  let state = (seed | 0) >>> 0;
  return (mean: number, std: number): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const z = (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
    return mean + std * z;
  };
}

export function scanLidar(
  baseXMeters: number,
  baseYMeters: number,
  obstacles: OrientedBoundingBox[],
  config: LidarConfig = KUKA_KMR_IIWA_LIDAR_DEFAULT,
): LidarScan {
  const rays: LidarRay[] = [];
  const fovRadians = (config.fovDegrees * Math.PI) / 180.0;
  const startAngle = -fovRadians / 2.0;
  const rSelf = Math.max(config.minRangeMeters * 0.5, 0.05);
  const gauss = makeSeededGaussian(
    Math.floor(baseXMeters * 1e6) ^ Math.floor(baseYMeters * 1e6),
  );
  for (let i = 0; i < config.numRays; i += 1) {
    const t = i / Math.max(1, config.numRays - 1);
    const angle = startAngle + t * fovRadians;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    let range = config.maxRangeMeters;
    let hit = false;
    for (const obb of obstacles) {
      if (obb.exemptFromPenalty) continue;
      // Ray-AABB intersection in 2D.
      const ox = obb.center[0] - baseXMeters;
      const oy = obb.center[1] - baseYMeters;
      const c = Math.cos(-obb.rotationYawRad);
      const s = Math.sin(-obb.rotationYawRad);
      const lx = ox * c - oy * s;
      const ly = ox * s + oy * c;
      const hx = obb.halfExtents[0];
      const hy = obb.halfExtents[1];
      let tMin = 0.0;
      let tMax = config.maxRangeMeters;
      let hitLocal = true;
      if (Math.abs(cosA) < 1e-9) {
        if (lx > hx || lx < -hx) hitLocal = false;
      } else {
        const t1 = (lx - hx) / cosA;
        const t2 = (lx + hx) / cosA;
        const tNear = Math.min(t1, t2);
        const tFar = Math.max(t1, t2);
        if (tNear > tMin) tMin = tNear;
        if (tFar < tMax) tMax = tFar;
        if (tMin > tMax) hitLocal = false;
      }
      if (hitLocal) {
        if (Math.abs(sinA) < 1e-9) {
          if (ly > hy || ly < -hy) hitLocal = false;
        } else {
          const t1 = (-hy - ly) / sinA;
          const t2 = (hy - ly) / sinA;
          const tNear = Math.min(t1, t2);
          const tFar = Math.max(t1, t2);
          if (tNear > tMin) tMin = tNear;
          if (tFar < tMax) tMax = tFar;
          if (tMin > tMax) hitLocal = false;
        }
      }
      if (hitLocal) {
        const tHit = Math.max(tMin, rSelf);
        if (tHit < range) {
          range = tHit;
          hit = true;
        }
      }
    }
    const noisyRange = hit
      ? Math.max(
          config.minRangeMeters,
          Math.min(config.maxRangeMeters, range + gauss(0, config.noiseStdDevMeters)),
        )
      : config.maxRangeMeters;
    rays.push({ angleRadians: angle, rangeMeters: noisyRange, hit });
  }
  return { rays, baseXMeters, baseYMeters };
}

export interface LidarCostmap2D {
  widthMeters: number;
  heightMeters: number;
  cellSizeMeters: number;
  widthCells: number;
  heightCells: number;
  // 0 = free, 1 = occupied, 0.5 = unknown. Rows are +y (left),
  // columns are +x (forward).
  occupancy: number[][];
  baseXMeters: number;
  baseYMeters: number;
}

export function lidarToCostmap2D(
  scan: LidarScan,
  config: LidarConfig = KUKA_KMR_IIWA_LIDAR_DEFAULT,
  widthMeters = 8,
  heightMeters = 8,
  cellSizeMeters = 0.1,
): LidarCostmap2D {
  const widthCells = Math.ceil(widthMeters / cellSizeMeters);
  const heightCells = Math.ceil(heightMeters / cellSizeMeters);
  const occupancy: number[][] = [];
  for (let j = 0; j < heightCells; j += 1) {
    occupancy.push(new Array<number>(widthCells).fill(0));
  }
  for (let j = 0; j < heightCells; j += 1) {
    for (let i = 0; i < widthCells; i += 1) {
      const x = (i - widthCells / 2) * cellSizeMeters;
      const y = (j - heightCells / 2) * cellSizeMeters;
      const dist = Math.hypot(x, y);
      if (dist < 0.05) {
        occupancy[j][i] = 0;
        continue;
      }
      const angle = Math.atan2(y, x);
      let bestRay = scan.rays[0];
      let bestDiff = Math.abs(angle - bestRay.angleRadians);
      for (const ray of scan.rays) {
        const d = Math.abs(angle - ray.angleRadians);
        if (d < bestDiff) {
          bestDiff = d;
          bestRay = ray;
        }
      }
      // Three-case occupancy: ray reached the cell (free), ray hit near
      // the cell (occupied), or ray hit before reaching the cell (unknown).
      // The original two-case ternary was inverted (had 0.5/1 swapped), and
      // had no case for "ray hit at the cell."
      const rangeMargin = bestRay.rangeMeters - dist;
      if (rangeMargin > cellSizeMeters * 0.5) {
        occupancy[j][i] = 0;   // ray passed through: free
      } else if (rangeMargin < -cellSizeMeters * 0.5) {
        occupancy[j][i] = 0.5; // ray stopped before reaching: unknown
      } else {
        occupancy[j][i] = 1;   // ray hit at this cell: occupied
      }
    }
  }
  return {
    widthMeters,
    heightMeters,
    cellSizeMeters,
    widthCells,
    heightCells,
    occupancy,
    baseXMeters: scan.baseXMeters,
    baseYMeters: scan.baseYMeters,
  };
}
