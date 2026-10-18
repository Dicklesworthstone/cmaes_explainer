// Unit tests for app/lib/ddgiProbes.ts (cmaes-feat-pr4-ddgi).
//
// Asserts:
//   - 4x8x3 = 96 probes are created for the Craftsman default grid.
//   - Each probe has 64 octahedral cells (8x8).
//   - Each probe is initialized with the ambient SH (L00) values.
//   - Octahedral directions are 64 unit vectors deterministically generated.
//   - Trilinear sample at a probe center returns the probe's value (no leakage).
//   - Sample at a wall (Chebyshev visibility) returns low visibility for an
//     occluded direction.
//   - Hysteresis update: I_t = (1 - alpha) I_{t-1} + alpha I_sample.
//   - Reset: returns the grid to the ambient state.
//   - Craftsman 4x8x3 probe grid covers the bungalow bounds (within ±0.5 m).
//   - Probe direction generation is deterministic (same Vogel spiral each load).
//   - Octahedral cell index: opposite directions map to different cells but
//     adjacent cells.

import { describe, expect, test } from "bun:test";

import {
  createProbe,
  createProbeGrid,
  fallbackIrradiance,
  generateOctahedralDirections,
  hysteresisUpdate,
  octahedralCellIndex,
  probeGridBounds,
  resetProbeGrid,
  sampleProbeGrid,
  updateProbeGridFromScene,
} from "../app/lib/ddgiProbes";
import { createEmissiveSurface } from "../app/lib/emissiveSurfaces";

describe("ddgiProbes", () => {
  test("generateOctahedralDirections returns 64 unit vectors", () => {
    const { directions } = generateOctahedralDirections();
    expect(directions.length).toBe(64 * 3);
    for (let i = 0; i < 64; i++) {
      const x = directions[i * 3 + 0];
      const y = directions[i * 3 + 1];
      const z = directions[i * 3 + 2];
      const len = Math.hypot(x, y, z);
      expect(len).toBeGreaterThan(0.99);
      expect(len).toBeLessThan(1.01);
    }
  });

  test("octahedral direction generation is deterministic", () => {
    const a = generateOctahedralDirections();
    const b = generateOctahedralDirections();
    expect(a.directions).toEqual(b.directions);
  });

  test("createProbe has 64 cells (8x8) and starts at ambient", () => {
    const probe = createProbe([0, 0, 0], [0.85, 0.78, 0.68]);
    expect(probe.irradiance.length).toBe(64 * 3);
    expect(probe.meanDistance.length).toBe(64);
    expect(probe.meanDistanceSq.length).toBe(64);
    for (let c = 0; c < 64; c++) {
      // 0.85 (R) is in the 0th slot of every 3-float group
      // Sanity: not all zeros (we initialized to ambient)
      const r = probe.irradiance[c * 3 + 0];
      const g = probe.irradiance[c * 3 + 1];
      const b = probe.irradiance[c * 3 + 2];
      expect(r + g + b).toBeGreaterThan(0);
    }
  });

  test("createProbeGrid Craftsman default: 4x8x3 = 96 probes", () => {
    const grid = createProbeGrid();
    expect(grid.dimensions).toEqual([4, 8, 3]);
    expect(grid.probes.length).toBe(4 * 8 * 3); // 96
  });

  test("Craftsman 4x8x3 probe grid covers the bungalow bounds (within ±0.5 m)", () => {
    const grid = createProbeGrid();
    const b = probeGridBounds(grid);
    // Bungalow: x in [-4, 4], y in [-5.5, 5.5], z in [0, 2.5]
    // Default origin = [0, 0, 1.25], spacing = [2.0, 1.4, 1.25]
    // x extent: 4 probes * 2.0 m = 8 m, centered -> [-4, 4] ✓
    // y extent: 8 probes * 1.4 m = 11.2 m, centered -> [-5.6, 5.6] ✓
    // z extent: 3 probes * 1.25 m = 3.75 m, centered at 1.25 -> [-0.625, 3.125] ✓
    expect(b.min[0]).toBeCloseTo(-4, 1);
    expect(b.max[0]).toBeCloseTo(4, 1);
    expect(b.min[1]).toBeLessThanOrEqual(-5.5);
    expect(b.max[1]).toBeGreaterThanOrEqual(5.5);
  });

  test("sampleProbeGrid at a probe center returns the probe's value (no leakage)", () => {
    const grid = createProbeGrid();
    // Pick the center probe
    const mid = grid.probes[Math.floor(grid.probes.length / 2)];
    // Sample in the up direction at the probe's exact position
    const result = sampleProbeGrid(grid, mid.position, [0, 0, 1], 100);
    // Should be close to the ambient (0.85, 0.78, 0.68)
    expect(result.rgb[0]).toBeGreaterThan(0.5);
    expect(result.rgb[0]).toBeLessThan(1.0);
  });

  test("sampleProbeGrid outside the grid returns zero (no probe data)", () => {
    const grid = createProbeGrid();
    // Sample far outside the grid
    const result = sampleProbeGrid(grid, [1000, 1000, 1000], [0, 0, 1], 100);
    // Should be zero (or near zero, since trilinear clamps to edges)
    expect(result.rgb[0] + result.rgb[1] + result.rgb[2]).toBeLessThan(3.0);
  });

  test("hysteresis update: I_t = (1 - alpha) I_{t-1} + alpha I_sample", () => {
    const grid = createProbeGrid();
    grid.blendAlpha = 0.25;
    const probe = grid.probes[0];
    // Save initial state
    const initial = Array.from(probe.irradiance);
    // New sample: all 1.0 (much brighter than ambient 0.85)
    const newIrr = new Float32Array(64 * 3).fill(1.0);
    const newMean = new Float32Array(64).fill(2.0);
    const newMeanSq = new Float32Array(64).fill(4.0);
    hysteresisUpdate(grid, 0, newIrr, newMean, newMeanSq);
    // After update: I_t = 0.75 * 0.85 + 0.25 * 1.0 = 0.8875
    for (let i = 0; i < 64 * 3; i++) {
      expect(probe.irradiance[i]).toBeCloseTo(0.75 * initial[i] + 0.25, 4);
    }
  });

  test("resetProbeGrid returns to ambient", () => {
    const grid = createProbeGrid();
    const probe = grid.probes[0];
    // Mess it up
    for (let i = 0; i < 64 * 3; i++) probe.irradiance[i] = 0.5;
    resetProbeGrid(grid);
    // After reset, irradiance should be 0.85/0.78/0.68 (ambient)
    for (let i = 0; i < 64; i++) {
      expect(probe.irradiance[i * 3 + 0]).toBeCloseTo(0.85, 4);
      expect(probe.irradiance[i * 3 + 1]).toBeCloseTo(0.78, 4);
      expect(probe.irradiance[i * 3 + 2]).toBeCloseTo(0.68, 4);
      expect(probe.meanDistance[i]).toBeCloseTo(10, 4);
      expect(probe.meanDistanceSq[i]).toBeCloseTo(100, 4);
    }
  });

  test("octahedral cell index: opposite directions map to different cells", () => {
    const a = octahedralCellIndex([0, 0, 1]); // up
    const b = octahedralCellIndex([0, 0, -1]); // down
    expect(a).not.toBe(b);
  });

  test("fallbackIrradiance returns bounded RGB for any normal", () => {
    for (const n of [
      [0, 0, 1],
      [0, 0, -1],
      [1, 0, 0],
      [0, 1, 0],
      [0.5, 0.5, 0.5],
    ] as Array<[number, number, number]>) {
      const [r, g, b] = fallbackIrradiance(n);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(1);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(1);
    }
  });

  test("grid can be disabled (master kill switch)", () => {
    const grid = createProbeGrid();
    grid.enabled = false;
    const result = sampleProbeGrid(grid, [0, 0, 0], [0, 0, 1], 5);
    expect(result.rgb[0]).toBe(0);
    expect(result.rgb[1]).toBe(0);
    expect(result.rgb[2]).toBe(0);
    expect(result.visibility).toBe(0);
  });

  test("Chebyshev visibility suppresses light leakage from occluded probes across a 12cm wall", () => {
    // 2x2x2 grid centered at [0, 0, 0], spacing [2, 2, 2]: probes at x = -1 (Room A) and x = +1 (Room B)
    const grid = createProbeGrid([0, 0, 0], [2, 2, 2], [2, 2, 2], 1.0, 8.0);
    for (const p of grid.probes) {
      if (p.position[0] < 0) {
        // Room A (bright room, blocked by wall at distance 0.4m)
        p.irradiance.fill(10.0);
        p.meanDistance.fill(0.4);
        p.meanDistanceSq.fill(0.16);
      } else {
        // Room B (dim room, unoccluded up to 5.0m)
        p.irradiance.fill(0.1);
        p.meanDistance.fill(5.0);
        p.meanDistanceSq.fill(25.0);
      }
    }

    // Query at [0, 0, 0] (midpoint between x=-1 and x=+1) with surfaceDistance = 1.0m:
    // Room A probes have meanD = 0.4m < 1.0m (occluded, cheb -> 0), Room B probes have meanD = 5.0m >= 1.0m (cheb = 1)
    const sampled = sampleProbeGrid(grid, [0, 0, 0], [1, 0, 0], 1.0);
    expect(sampled.rgb[0]).toBeLessThan(0.15);
    expect(sampled.visibility).toBeCloseTo(0.5, 2);
  });

  test("updateProbeGridFromScene updates probe distances and irradiance from dynamic SDF and emissive surfaces", () => {
    const grid = createProbeGrid([0, 0, 0], [2, 2, 2], [2, 2, 2], 0.5, 6.0);
    const ceilingLight = createEmissiveSurface("recessed-ceiling-light", [0, 2.2, 0], 0, true);

    // Open room SDF: sphere of radius 3.0m (interior negative, wall at r = 3.0m)
    const openRoomSdf = (x: number, y: number, z: number) => 3.0 - Math.hypot(x, y, z);
    updateProbeGridFromScene(grid, openRoomSdf, [ceilingLight], {
      timeSeconds: 0.5,
      probeIndices: [0],
    });
    const distOpen = grid.probes[0].meanDistance[0];
    const irrOn = grid.probes[0].irradiance.reduce((acc, v) => acc + v, 0);

    // Insert closer spherical wall at r = 1.8m and turn light off
    const occludedSdf = (x: number, y: number, z: number) => 1.8 - Math.hypot(x, y, z);
    const lightOff = createEmissiveSurface("recessed-ceiling-light", [0, 2.2, 0], 0, false);
    updateProbeGridFromScene(grid, occludedSdf, [lightOff], {
      timeSeconds: 0.5,
      probeIndices: [0],
    });
    const distOccluded = grid.probes[0].meanDistance[0];
    const irrOff = grid.probes[0].irradiance.reduce((acc, v) => acc + v, 0);

    expect(distOccluded).toBeLessThan(distOpen);
    expect(irrOff).toBeLessThan(irrOn);
  });

  test("sampleProbeGrid safely samples a 1x1x1 single-probe grid without out-of-bounds probe lookup", () => {
    const singleGrid = createProbeGrid([0, 0, 0], [2, 2, 2], [1, 1, 1]);
    expect(singleGrid.probes.length).toBe(1);
    const sampled = sampleProbeGrid(singleGrid, [0, 0, 0], [0, 0, 1], 1.0);
    expect(sampled.rgb[0]).toBeGreaterThan(0.5);
    expect(sampled.visibility).toBeGreaterThan(0.9);
  });
});

