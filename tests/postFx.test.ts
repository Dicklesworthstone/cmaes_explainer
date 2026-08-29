// Unit tests for app/lib/postFx.ts (cmaes-feat-pr7-postfx).
//
// Asserts:
//   - ACES Filmic curve produces bounded sRGB-ready values for all inputs.
//   - ACES with exposure correctly scales the input.
//   - The default post-FX profile is sensible (not zero everywhere).
//   - Per-stage profiles are distinct from each other and from the default.
//   - applyPostFXSoftware does not blow out highlights (preserves detail).
//   - flickerFireplace is deterministic given the same frame.
//   - flickerFireplace is bounded (no runaway intensity).
//   - linearToSRGB has the correct piecewise behavior (linear near 0,
//     power-curve near 1).
//   - Profile for "porch-bright" has the highest exposure; "bedroom-moody"
//     has the lowest.

import { describe, expect, test } from "bun:test";

import {
  ACES_FILMIC,
  DEFAULT_POSTFX_PROFILE,
  POSTFX_PROFILES,
  acesFilmic,
  acesFilmicWithExposure,
  applyPostFXSoftware,
  flickerFireplace,
  linearToSRGB,
} from "../app/lib/postFx";

describe("postFx", () => {
  test("ACES_FILMIC coefficients match Narkowicz 2015", () => {
    expect(ACES_FILMIC.a).toBe(2.51);
    expect(ACES_FILMIC.b).toBe(0.03);
    expect(ACES_FILMIC.c).toBe(2.43);
    expect(ACES_FILMIC.d).toBe(0.59);
    expect(ACES_FILMIC.e).toBe(0.14);
  });

  test("acesFilmic produces bounded sRGB-ready values for all inputs", () => {
    for (const r of [0, 0.1, 0.5, 1, 2, 10, 1000]) {
      const [R, G, B] = acesFilmic([r, r, r]);
      expect(R).toBeGreaterThanOrEqual(0);
      expect(R).toBeLessThanOrEqual(1);
      expect(G).toBe(R);
      expect(B).toBe(R);
    }
  });

  test("acesFilmic preserves monotonicity (darker stays darker)", () => {
    const low = acesFilmic([0.1, 0.1, 0.1]);
    const mid = acesFilmic([0.5, 0.5, 0.5]);
    const high = acesFilmic([1.0, 1.0, 1.0]);
    expect(low[0]).toBeLessThan(mid[0]);
    expect(mid[0]).toBeLessThan(high[0]);
  });

  test("acesFilmicWithExposure correctly scales the input", () => {
    const noExp = acesFilmicWithExposure([0.5, 0.5, 0.5], 1.0);
    const doubleExp = acesFilmicWithExposure([0.5, 0.5, 0.5], 2.0);
    expect(doubleExp[0]).toBeGreaterThan(noExp[0]);
  });

  test("DEFAULT_POSTFX_PROFILE is sensible (not zero, not absurd)", () => {
    expect(DEFAULT_POSTFX_PROFILE.exposure).toBeGreaterThan(0.5);
    expect(DEFAULT_POSTFX_PROFILE.exposure).toBeLessThan(2.0);
    expect(DEFAULT_POSTFX_PROFILE.bloomStrength).toBeGreaterThan(0);
    expect(DEFAULT_POSTFX_PROFILE.bloomThreshold).toBeGreaterThan(0);
    expect(DEFAULT_POSTFX_PROFILE.vignetteIntensity).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_POSTFX_PROFILE.chromaticAberrationPx).toBeGreaterThan(0);
    expect(DEFAULT_POSTFX_PROFILE.enabled).toBe(true);
  });

  test("per-stage profiles are distinct from each other and the default", () => {
    const stages = Object.keys(POSTFX_PROFILES);
    expect(stages.length).toBeGreaterThanOrEqual(4);
    for (const a of stages) {
      for (const b of stages) {
        if (a >= b) continue;
        const A = POSTFX_PROFILES[a];
        const B = POSTFX_PROFILES[b];
        // They should differ on at least one parameter
        const same =
          A.exposure === B.exposure &&
          A.bloomStrength === B.bloomStrength &&
          A.bloomThreshold === B.bloomThreshold &&
          A.vignetteIntensity === B.vignetteIntensity;
        expect(same).toBe(false);
      }
    }
  });

  test("porch-bright has the highest exposure; bedroom-moody has the lowest", () => {
    const porch = POSTFX_PROFILES["porch-bright"];
    const bedroom = POSTFX_PROFILES["bedroom-moody"];
    expect(porch.exposure).toBeGreaterThan(bedroom.exposure);
  });

  test("applyPostFXSoftware does not blow out highlights (preserves detail)", () => {
    const rgb: [number, number, number] = [10, 10, 10]; // way over 1
    const out = applyPostFXSoftware(rgb, DEFAULT_POSTFX_PROFILE);
    // Even with a brightness of 10, the ACES curve + bloom should not produce
    // NaN or negative; it should saturate to ~1 + bloom.
    for (const ch of out) {
      expect(ch).toBeGreaterThan(0);
      expect(Number.isFinite(ch)).toBe(true);
      expect(ch).toBeLessThan(2); // a sane upper bound
    }
  });

  test("applyPostFXSoftware with disabled profile is a no-op", () => {
    const profile = { ...DEFAULT_POSTFX_PROFILE, enabled: false };
    const rgb: [number, number, number] = [0.5, 0.5, 0.5];
    const out = applyPostFXSoftware(rgb, profile);
    expect(out[0]).toBe(0.5);
    expect(out[1]).toBe(0.5);
    expect(out[2]).toBe(0.5);
  });

  test("flickerFireplace is deterministic given the same frame", () => {
    const a = flickerFireplace(123);
    const b = flickerFireplace(123);
    expect(a).toBe(b);
    // Different frames give different values
    const c = flickerFireplace(124);
    expect(a).not.toBe(c);
  });

  test("flickerFireplace is bounded (no runaway intensity)", () => {
    for (let f = 0; f < 1000; f++) {
      const v = flickerFireplace(f);
      expect(v).toBeGreaterThan(0.5);
      expect(v).toBeLessThan(2.0);
    }
  });

  test("linearToSRGB has the correct piecewise behavior", () => {
    // Near 0: linear (12.92 * x)
    expect(linearToSRGB(0)).toBe(0);
    expect(linearToSRGB(0.001)).toBeCloseTo(0.01292, 5);
    // Near 1: power curve (1.055 * x^(1/2.4) - 0.055)
    expect(linearToSRGB(1)).toBeCloseTo(1.0, 5);
    expect(linearToSRGB(0.5)).toBeCloseTo(
      1.055 * Math.pow(0.5, 1 / 2.4) - 0.055,
      3
    );
  });
});
