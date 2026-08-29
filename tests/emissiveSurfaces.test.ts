// Unit tests for app/lib/emissiveSurfaces.ts (cmaes-feat-pr8-emissive).
//
// Asserts:
//   - blackbodyToRGB returns valid RGB in [0, 1] for typical Kelvin values.
//   - Blackbody at 1500K is redder than at 6500K (fireplace is warmer than daylight).
//   - createEmissiveSurface returns a well-formed surface.
//   - createCraftsmanEmissives returns 9 default surfaces.
//   - liveEmissiveIntensity returns 0 for an off surface.
//   - liveEmissiveIntensity is bounded above and below the base intensity.
//   - liveEmissiveIntensity is deterministic given the same frame.
//   - The fireplace flicker color shifts over time (heat cycle).
//   - Different phases produce different intensities at the same frame
//     (no flicker lockstep).

import type { MeshStandardMaterial } from "three";

import { describe, expect, test } from "bun:test";

import {
  ALL_EMISSIVE_KINDS,
  EMISSIVE_PALETTE,
  applyEmissiveToMaterial,
  blackbodyToRGB,
  createCraftsmanEmissives,
  createEmissiveSurface,
  liveEmissiveColor,
  liveEmissiveIntensity,
} from "../app/lib/emissiveSurfaces";

describe("emissiveSurfaces", () => {
  test("blackbodyToRGB returns valid RGB in [0, 1]", () => {
    for (const k of [1000, 1500, 2000, 2700, 3000, 4000, 5500, 6500, 10000]) {
      const [r, g, b] = blackbodyToRGB(k);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(1);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(1);
    }
  });

  test("1500K is redder than 6500K (fireplace warmer than daylight)", () => {
    const fire = blackbodyToRGB(1500);
    const day = blackbodyToRGB(6500);
    // Red/blue ratio should be higher for the fireplace.
    expect(fire[0] / Math.max(fire[2], 1e-6)).toBeGreaterThan(day[0] / Math.max(day[2], 1e-6));
  });

  test("EMISSIVE_PALETTE has 7 entries (one per kind, plus half-intensity)", () => {
    // We declared 7 (incandescent2700K, warmWhite3000K, oven2000K, fireplace1500K,
    // candle1800K, daylight6500K, incandescentHalf). Use Object.keys to assert.
    const keys = Object.keys(EMISSIVE_PALETTE);
    expect(keys.length).toBe(7);
  });

  test("createEmissiveSurface returns a well-formed surface", () => {
    const s = createEmissiveSurface("recessed-ceiling-light", [0, 0, 1.5], 0);
    expect(s.kind).toBe("recessed-ceiling-light");
    expect(s.position).toEqual([0, 0, 1.5]);
    expect(s.phase).toBe(0);
    expect(s.on).toBe(true);
    expect(s.color[0]).toBeGreaterThan(0);
    expect(s.baseIntensity).toBeGreaterThan(0);
  });

  test("createCraftsmanEmissives returns 9 default surfaces", () => {
    const surfaces = createCraftsmanEmissives();
    expect(surfaces.length).toBe(9);
  });

  test("ALL_EMISSIVE_KINDS has 8 entries", () => {
    expect(ALL_EMISSIVE_KINDS.length).toBe(8);
  });

  test("liveEmissiveIntensity returns 0 for an off surface", () => {
    const s = createEmissiveSurface("recessed-ceiling-light", [0, 0, 1.5], 0, false);
    expect(liveEmissiveIntensity(s, 0)).toBe(0);
    expect(liveEmissiveIntensity(s, 100)).toBe(0);
  });

  test("liveEmissiveIntensity is bounded above the base intensity for fireplace (peaks at base * 1.1125)", () => {
    const s = createEmissiveSurface("fireplace-flame", [0, 0, 1.5]);
    let maxSeen = 0;
    for (let f = 0; f < 1000; f++) {
      maxSeen = Math.max(maxSeen, liveEmissiveIntensity(s, f));
    }
    // flickerFireplace returns base * (0.85 + 0.15 * (n1 + 0.5*n2 + 0.25*n3)),
    // bounded by base * (0.85 + 0.15 * 1.75) = base * 1.1125.
    expect(maxSeen).toBeLessThanOrEqual(s.baseIntensity * 1.1125 + 1e-6);
  });

  test("liveEmissiveIntensity is bounded below the base intensity for fireplace", () => {
    const s = createEmissiveSurface("fireplace-flame", [0, 0, 1.5]);
    let minSeen = Infinity;
    for (let f = 0; f < 1000; f++) {
      minSeen = Math.min(minSeen, liveEmissiveIntensity(s, f));
    }
    expect(minSeen).toBeGreaterThan(s.baseIntensity * 0.8);
  });

  test("liveEmissiveIntensity is deterministic given the same frame", () => {
    const s = createEmissiveSurface("candle", [0, 0, 1.5]);
    for (let f = 0; f < 100; f++) {
      expect(liveEmissiveIntensity(s, f)).toBe(liveEmissiveIntensity(s, f));
    }
  });

  test("different phases produce different intensities at the same frame (no lockstep)", () => {
    const surfaces = createCraftsmanEmissives();
    // Pick two surfaces of the same kind (bedside-lamp) with different phases
    const lamp0 = surfaces[5]; // bedside-lamp with phase 0
    const lamp1 = surfaces[6]; // bedside-lamp with phase 1
    let diffSeen = 0;
    for (let f = 0; f < 50; f++) {
      if (liveEmissiveIntensity(lamp0, f) !== liveEmissiveIntensity(lamp1, f)) {
        diffSeen++;
      }
    }
    expect(diffSeen).toBeGreaterThan(0);
  });

  test("fireplace liveEmissiveColor shifts with the heat cycle (not constant)", () => {
    const s = createEmissiveSurface("fireplace-flame", [0, 0, 1.5]);
    let maxDelta = 0;
    for (let f = 0; f < 1000; f++) {
      const a = liveEmissiveColor(s, f);
      const b = liveEmissiveColor(s, f + 1);
      const delta = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      maxDelta = Math.max(maxDelta, delta);
    }
    expect(maxDelta).toBeGreaterThan(0);
  });

  test("applyEmissiveToMaterial sets the material's emissive color + intensity", () => {
    // Mock a MeshStandardMaterial
    let r = 0;
    let g = 0;
    let b = 0;
    let intensity = 0;
    const mat = {
      get emissive() {
        return { setRGB: (_r: number, _g: number, _b: number) => { r = _r; g = _g; b = _b; } };
      },
      set emissiveIntensity(v: number) { intensity = v; },
    };
    const s = createEmissiveSurface("recessed-ceiling-light", [0, 0, 1.5]);
    applyEmissiveToMaterial(s, 100, mat as unknown as MeshStandardMaterial);
    // For a no-flicker surface, color should be the base color and
    // intensity should be baseIntensity.
    expect(r).toBeCloseTo(s.color[0], 3);
    expect(intensity).toBeCloseTo(s.baseIntensity, 3);
  });

  test("every EmissiveKind produces a non-zero color", () => {
    for (const kind of ALL_EMISSIVE_KINDS) {
      const s = createEmissiveSurface(kind, [0, 0, 1.5]);
      const sum = s.color[0] + s.color[1] + s.color[2];
      expect(sum).toBeGreaterThan(0);
    }
  });
});
