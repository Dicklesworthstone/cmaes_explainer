import { describe, expect, test } from "bun:test";
import {
  acesFilmicToneMapping,
  computeChromaticAberrationUvs,
  evaluateVignette,
  extractBloomLuminance,
  processPixelPostFx,
  tonemapColor,
} from "../app/lib/postProcessingPipeline";

describe("Post-Processing & Cinematic Color Grading Engine", () => {
  test("acesFilmicToneMapping is strictly monotonic and bounded in [0, 1]", () => {
    expect(acesFilmicToneMapping(0.0)).toBe(0.0);

    let prev = 0.0;
    for (let x = 0.05; x <= 20.0; x += 0.2) {
      const mapped = acesFilmicToneMapping(x);
      expect(mapped).toBeGreaterThanOrEqual(prev);
      expect(mapped).toBeLessThanOrEqual(1.0);
      prev = mapped;
    }

    // High HDR values roll off smoothly towards 1.0
    expect(acesFilmicToneMapping(10.0)).toBeGreaterThan(0.95);
    expect(acesFilmicToneMapping(100.0)).toBeCloseTo(1.0, 2);
  });

  test("tonemapColor scales with exposure and clamps", () => {
    const hdr: [number, number, number] = [2.0, 1.5, 0.5];
    const ldrNormal = tonemapColor(hdr, 1.0);
    const ldrBright = tonemapColor(hdr, 2.0);

    expect(ldrBright[0]).toBeGreaterThan(ldrNormal[0]);
    expect(ldrBright[1]).toBeGreaterThan(ldrNormal[1]);
    expect(ldrBright[0]).toBeLessThanOrEqual(1.0);
  });

  test("extractBloomLuminance isolates bright highlights above threshold", () => {
    // Dim indoor surface: [0.5, 0.4, 0.3] -> lum ~ 0.41 (< 1.2 threshold) -> 0 bloom
    const dim = extractBloomLuminance([0.5, 0.4, 0.3], 1.2);
    expect(dim[0]).toBe(0.0);
    expect(dim[1]).toBe(0.0);
    expect(dim[2]).toBe(0.0);

    // Bright light source: [5.0, 4.0, 3.0] -> lum ~ 4.14 -> extracts bloom
    const bright = extractBloomLuminance([5.0, 4.0, 3.0], 1.2);
    expect(bright[0]).toBeGreaterThan(0.0);
    expect(bright[1]).toBeGreaterThan(0.0);
  });

  test("evaluateVignette shades screen edges while preserving center", () => {
    // Screen center [0.5, 0.5] -> 1.0 (no darkening)
    expect(evaluateVignette([0.5, 0.5])).toBe(1.0);

    // Screen corner [0.0, 0.0] -> darkened by vignette strength
    const corner = evaluateVignette([0.0, 0.0], 0.6, 1.4, 0.3);
    expect(corner).toBeCloseTo(0.7, 2); // 1.0 - 0.3
  });

  test("computeChromaticAberrationUvs creates radial RGB spectral dispersion", () => {
    // Screen center has no offset
    const centerUvs = computeChromaticAberrationUvs([0.5, 0.5], 0.005);
    expect(centerUvs.uvR).toEqual([0.5, 0.5]);
    expect(centerUvs.uvB).toEqual([0.5, 0.5]);

    // Top-right corner [0.9, 0.9] disperses R outwards and B inwards
    const cornerUvs = computeChromaticAberrationUvs([0.9, 0.9], 0.005);
    expect(cornerUvs.uvR[0]).toBeGreaterThan(0.9);
    expect(cornerUvs.uvB[0]).toBeLessThan(0.9);
  });

  test("processPixelPostFx composites tonemapping and vignette", () => {
    const hdr: [number, number, number] = [1.5, 1.2, 0.8];
    const center = processPixelPostFx(hdr, [0.5, 0.5]);
    const corner = processPixelPostFx(hdr, [0.0, 0.0]);

    // Corner pixel should be darker due to vignette
    expect(corner[0]).toBeLessThan(center[0]);
    expect(corner[1]).toBeLessThan(center[1]);
  });
});
