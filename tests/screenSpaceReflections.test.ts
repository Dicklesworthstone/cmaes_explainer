import { describe, expect, test } from "bun:test";
import {
  computeReflectionVector,
  computeScreenEdgeFade,
  evaluateSchlickFresnel,
  traceScreenSpaceRay,
} from "../app/lib/screenSpaceReflections";

describe("Screen-Space Reflections (SSR) Engine", () => {
  test("computeReflectionVector evaluates exact Law of Reflection", () => {
    // Ray coming from top-left [-1, -1, 0] reflecting off horizontal floor [0, 1, 0]
    const viewDir: [number, number, number] = [-1, -1, 0];
    const normal: [number, number, number] = [0, 1, 0];

    const r = computeReflectionVector(viewDir, normal);
    expect(r[0]).toBeCloseTo(-1.0, 4);
    expect(r[1]).toBeCloseTo(1.0, 4); // Y component is reflected
    expect(r[2]).toBeCloseTo(0.0, 4);
  });

  test("evaluateSchlickFresnel scales from F0 at normal incidence to 1.0 at grazing angle", () => {
    // Normal incidence: cosTheta = 1.0 -> F0 = 0.04
    const fNormal = evaluateSchlickFresnel(1.0, 0.04);
    expect(fNormal).toBeCloseTo(0.04, 4);

    // Grazing angle: cosTheta = 0.0 -> F = 1.0
    const fGrazing = evaluateSchlickFresnel(0.0, 0.04);
    expect(fGrazing).toBeCloseTo(1.0, 4);

    // Intermediate 45 degrees: cosTheta = 0.7071
    const f45 = evaluateSchlickFresnel(Math.SQRT1_2, 0.04);
    expect(f45).toBeGreaterThan(0.04);
    expect(f45).toBeLessThan(1.0);
  });

  test("computeScreenEdgeFade smoothly attenuates towards viewport borders", () => {
    // Center of screen [0.5, 0.5] -> 1.0
    expect(computeScreenEdgeFade([0.5, 0.5])).toBe(1.0);

    // Near border [0.95, 0.5] -> faded
    const edge = computeScreenEdgeFade([0.95, 0.5], 0.8);
    expect(edge).toBeGreaterThan(0.0);
    expect(edge).toBeLessThan(1.0);

    // Out of screen [1.1, 0.5] -> 0.0
    expect(computeScreenEdgeFade([1.1, 0.5])).toBe(0.0);
  });

  test("traceScreenSpaceRay detects depth buffer intersection with binary search refinement", () => {
    // Synthetic depth buffer: flat background at depth 5.0, obstacle at [0.6..0.8, 0.5] with depth 2.5
    const depthSampler = (uv: [number, number]): number => {
      if (uv[0] >= 0.6 && uv[0] <= 0.8 && uv[1] >= 0.4 && uv[1] <= 0.6) {
        return 2.5;
      }
      return 5.0;
    };

    // Ray marching from start UV [0.5, 0.5] with depth 2.0 towards +U direction
    const res = traceScreenSpaceRay(
      [0.5, 0.5], // start UV
      2.0, // start depth
      [1.0, 0.0], // rayDirUv along +U
      5.0, // depth slope: at u=0.6, depth = 2.0 + 0.1 * 5.0 = 2.5 (intersects obstacle)
      depthSampler,
      [0, 1, 0], // normal
      [0, 1, 0], // viewDir
      0.1, // roughness
      { stepSize: 0.02, depthThickness: 0.5 },
    );

    expect(res.hit).toBe(true);
    expect(res.hitUv[0]).toBeGreaterThanOrEqual(0.59);
    expect(res.hitUv[0]).toBeLessThanOrEqual(0.65);
    expect(res.reflectionWeight).toBeGreaterThan(0.0);
  });

  test("traceScreenSpaceRay handles rays that march off-screen without hitting", () => {
    const depthSampler = (_uv: [number, number]): number => 10.0; // Empty far plane

    const res = traceScreenSpaceRay(
      [0.9, 0.5],
      2.0,
      [1.0, 0.0], // Marches immediately off right edge
      0.5,
      depthSampler,
      [0, 1, 0],
      [0, 1, 0],
    );

    expect(res.hit).toBe(false);
    expect(res.reflectionWeight).toBe(0.0);
  });
});
