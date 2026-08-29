import { describe, expect, test } from "bun:test";
import {
  applyExponentialHeightFog,
  computeAnalyticalFogOpticalDepth,
  DEFAULT_FOG_CONFIG,
  henyeyGreensteinPhase,
  raymarchVolumetricSunbeams,
} from "../app/lib/volumetricLighting";

describe("Volumetric Lighting & Exponential Height Fog Engine", () => {
  test("henyeyGreensteinPhase exhibits anisotropic forward-scattering when g > 0", () => {
    const g = 0.7;

    // cosTheta = 1.0 (directly facing light, 0 deg)
    const forward = henyeyGreensteinPhase(1.0, g);

    // cosTheta = 0.0 (orthogonal, 90 deg)
    const side = henyeyGreensteinPhase(0.0, g);

    // cosTheta = -1.0 (backward, 180 deg)
    const backward = henyeyGreensteinPhase(-1.0, g);

    expect(forward).toBeGreaterThan(side);
    expect(side).toBeGreaterThan(backward);

    // Isotropic case (g = 0) -> 1 / (4 * PI) ~ 0.079577
    const isotropic = henyeyGreensteinPhase(0.5, 0.0);
    expect(isotropic).toBeCloseTo(1.0 / (4.0 * Math.PI), 5);
  });

  test("computeAnalyticalFogOpticalDepth calculates exact density integral", () => {
    const p0: [number, number, number] = [0, 0, 0];
    const p1: [number, number, number] = [0, 0, 10]; // 10m horizontal at ground

    const tauGround = computeAnalyticalFogOpticalDepth(p0, p1, 0.02, 0.5, 0.0);
    // At ground y=0, density = 0.02, length = 10 -> tau = 0.2
    expect(tauGround).toBeCloseTo(0.2, 4);

    // 10m horizontal at height y=4m -> density = 0.02 * exp(-0.5 * 4) = 0.02 * exp(-2) ~ 0.0027067
    const pHigh0: [number, number, number] = [0, 4, 0];
    const pHigh1: [number, number, number] = [0, 4, 10];
    const tauHigh = computeAnalyticalFogOpticalDepth(pHigh0, pHigh1, 0.02, 0.5, 0.0);
    expect(tauHigh).toBeLessThan(tauGround);
    expect(tauHigh).toBeCloseTo(0.02 * Math.exp(-2.0) * 10, 4);

    // Slanted ray from y=0 to y=4
    const pSlant: [number, number, number] = [0, 4, 0];
    const tauSlant = computeAnalyticalFogOpticalDepth(p0, pSlant, 0.02, 0.5, 0.0);
    expect(tauSlant).toBeGreaterThan(0);
    expect(tauSlant).toBeLessThan(tauGround);
  });

  test("applyExponentialHeightFog blends towards fog color over distance", () => {
    const surfaceColor: [number, number, number] = [1.0, 0.0, 0.0]; // Bright red
    const cam: [number, number, number] = [0, 1.5, 0];

    // Near point (1m away) -> almost pure surface color
    const nearPoint: [number, number, number] = [0, 1.5, 1.0];
    const nearFog = applyExponentialHeightFog(surfaceColor, cam, nearPoint);
    expect(nearFog[0]).toBeGreaterThan(0.9);

    // Far point (1000m away, tau ~ 9.4 -> T < 1e-4) -> converges to fog color
    const farPoint: [number, number, number] = [0, 1.5, 1000.0];
    const farFog = applyExponentialHeightFog(surfaceColor, cam, farPoint);
    expect(farFog[0]).toBeCloseTo(DEFAULT_FOG_CONFIG.fogColor[0], 2);
    expect(farFog[1]).toBeCloseTo(DEFAULT_FOG_CONFIG.fogColor[1], 2);
    expect(farFog[2]).toBeCloseTo(DEFAULT_FOG_CONFIG.fogColor[2], 2);
  });

  test("raymarchVolumetricSunbeams accumulates in-scattered sun radiance through unblocked paths", () => {
    const cam: [number, number, number] = [0, 1.5, 0];
    const rayDir: [number, number, number] = [0, 0, 1]; // Looking down +Z
    const sunDir: [number, number, number] = [0, 0.5, 0.866]; // Sun in forward upper hemisphere

    // Unoccluded path (open window)
    const clearEvaluator = () => 1.0;
    const rays = raymarchVolumetricSunbeams(cam, rayDir, 10.0, sunDir, clearEvaluator, 32);

    expect(rays[0]).toBeGreaterThan(0.0);
    expect(rays[1]).toBeGreaterThan(0.0);
    expect(rays[2]).toBeGreaterThan(0.0);

    // Fully occluded path (wall)
    const blockedEvaluator = () => 0.0;
    const blockedRays = raymarchVolumetricSunbeams(cam, rayDir, 10.0, sunDir, blockedEvaluator, 32);

    expect(blockedRays[0]).toBe(0.0);
    expect(blockedRays[1]).toBe(0.0);
    expect(blockedRays[2]).toBe(0.0);
  });
});
