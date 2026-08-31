import { describe, expect, test } from "bun:test";
import {
  KUKA_KMR_IIWA_LIDAR_DEFAULT,
  lidarToCostmap2D,
  scanLidar,
  type LidarConfig,
} from "../app/lib/kmrLidar";
import type { OrientedBoundingBox } from "../app/lib/houseMultiObstacleKernel";

const cfg: LidarConfig = KUKA_KMR_IIWA_LIDAR_DEFAULT;

describe("KUKA KMR iiwa 2D LiDAR (cmaes-kmr-lidar)", () => {
  test("default config matches a 2D LiDAR class spec", () => {
    expect(cfg.numRays).toBe(64);
    expect(cfg.maxRangeMeters).toBe(8.0);
    expect(cfg.minRangeMeters).toBe(0.1);
    expect(cfg.fovDegrees).toBe(270);
    expect(cfg.noiseStdDevMeters).toBe(0.02);
  });

  test("empty scene: all rays return max range", () => {
    const scan = scanLidar(0, 0, [], cfg);
    expect(scan.rays).toHaveLength(64);
    for (const r of scan.rays) {
      expect(r.hit).toBe(false);
      expect(r.rangeMeters).toBeGreaterThanOrEqual(cfg.maxRangeMeters - 1e-9);
      expect(r.rangeMeters).toBeLessThanOrEqual(cfg.maxRangeMeters + 1e-9);
    }
  });

  test("a single wall in front produces a hit at the wall distance", () => {
    const wall: OrientedBoundingBox = {
      id: "front-wall",
      name: "front-wall",
      center: [3, 0, 0],
      halfExtents: [0.1, 4, 1],
      rotationYawRad: 0,
    };
    const scan = scanLidar(0, 0, [wall], cfg);
    expect(scan.rays).toHaveLength(64);
    // With 64 rays and 270° FOV, the t = i / (n-1) parameterization gives
    // a 4.29° step and no sample at the exact midpoint (index 32 sits at
    // ±2.14°, not 0°). A 6° tolerance covers the closest forward sample.
    const frontRays = scan.rays.filter(
      (r) => r.hit && Math.abs(r.angleRadians) < 6 * Math.PI / 180,
    );
    expect(frontRays.length).toBeGreaterThan(0);
    // The wall is at x=3 with half-extent 0.1, so the front face is at
    // x=2.9. The hit range should be close to 2.9.
    expect(frontRays[0].rangeMeters).toBeCloseTo(2.9, 0);
  });

  test("uses the household X/Z footprint instead of collapsing obstacles onto Y-up", () => {
    const cabinet: OrientedBoundingBox = {
      id: "cabinet",
      name: "cabinet",
      center: [3, 2.5, 0],
      halfExtents: [0.1, 2.5, 0.8],
      rotationYawRad: 0,
    };
    const scan = scanLidar(0, 0, [cabinet], cfg);
    const forward = scan.rays.filter(
      (ray) => ray.hit && Math.abs(ray.angleRadians) < 6 * Math.PI / 180,
    );
    expect(forward.length).toBeGreaterThan(0);
    expect(forward[0].rangeMeters).toBeCloseTo(2.9, 0);
  });

  test("base yaw rotates the sensor rays in the house plane", () => {
    const northWall: OrientedBoundingBox = {
      id: "north-wall",
      name: "north-wall",
      center: [0, 1, 3],
      halfExtents: [1, 1, 0.1],
      rotationYawRad: 0,
    };
    const scan = scanLidar(0, 0, [northWall], cfg, Math.PI / 2);
    const forward = scan.rays.filter(
      (ray) => ray.hit && Math.abs(ray.angleRadians) < 6 * Math.PI / 180,
    );
    expect(forward.length).toBeGreaterThan(0);
    expect(forward[0].rangeMeters).toBeCloseTo(2.9, 0);
  });

  test("scan angles span the configured FOV", () => {
    const scan = scanLidar(0, 0, [], cfg);
    const angles = scan.rays.map((r) => r.angleRadians);
    const minA = Math.min(...angles);
    const maxA = Math.max(...angles);
    const fovRadians = (cfg.fovDegrees * Math.PI) / 180.0;
    expect(maxA - minA).toBeCloseTo(fovRadians, 5);
  });

  test("lidarToCostmap2D produces a centered grid with the right dimensions", () => {
    const scan = scanLidar(0, 0, [], cfg);
    const cm = lidarToCostmap2D(scan, cfg, 8, 8, 0.1);
    expect(cm.widthMeters).toBe(8);
    expect(cm.heightMeters).toBe(8);
    expect(cm.cellSizeMeters).toBe(0.1);
    expect(cm.widthCells).toBe(80);
    expect(cm.heightCells).toBe(80);
    expect(cm.occupancy).toHaveLength(80);
    for (const row of cm.occupancy) {
      expect(row).toHaveLength(80);
    }
  });

  test("lidarToCostmap2D cells past a detected wall are marked occupied", () => {
    const wall: OrientedBoundingBox = {
      id: "front-wall",
      name: "front-wall",
      center: [3, 0, 0],
      halfExtents: [0.5, 4, 1],
      rotationYawRad: 0,
    };
    const scan = scanLidar(0, 0, [wall], cfg);
    const cm = lidarToCostmap2D(scan, cfg, 8, 8, 0.1);
    // The wall is at x=3 (front face at x=2.9). A cell BEYOND the wall
    // (e.g. x=3.3, column 73) should be marked occupied because the
    // ray stopped before reaching it.
    // Cell center x=(i-40)*0.1, so x=3.3 is at i=73.
    const cellBeyond = cm.occupancy[40][73];
    expect(cellBeyond).toBe(0.5);
    // A cell well in front of the wall (e.g. x=1.0, column 50) should
    // be marked free because the ray passed through it.
    const cellInFront = cm.occupancy[40][50];
    expect(cellInFront).toBe(0);
  });

  test("lidarToCostmap2D is deterministic: same input gives same output", () => {
    const wall: OrientedBoundingBox = {
      id: "front-wall",
      name: "front-wall",
      center: [3, 0, 0],
      halfExtents: [0.5, 4, 1],
      rotationYawRad: 0,
    };
    const scan1 = scanLidar(0, 0, [wall], cfg);
    const scan2 = scanLidar(0, 0, [wall], cfg);
    expect(scan1.rays.length).toBe(scan2.rays.length);
    for (let i = 0; i < scan1.rays.length; i += 1) {
      expect(scan1.rays[i].rangeMeters).toBe(scan2.rays[i].rangeMeters);
    }
  });
});
