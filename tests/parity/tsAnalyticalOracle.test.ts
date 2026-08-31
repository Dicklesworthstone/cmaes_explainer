// TS-side analytical-oracle parity for the CCD parity cases.
// Kernel-side CCD-on-SDF owners are not yet implemented (cmaes-qfmt); the
// existing tests/parity/ccdSdf.test.ts skips with "kernel not yet
// implemented." This file is the TS-side companion: it asserts the
// TypeScript engine matches closed-form analytical oracles for the same
// input vectors, so the TS half of the parity claim is machine-checked now
// and the kernel work (frankensim fs-contact increment + fs-cmaes-viz-wasm
// ABI exposure) ships against a verified TS reference.

import { describe, expect, test } from "bun:test";
import { queryContinuousCollisionSDF } from "../../app/lib/continuousCollisionDetection";

function analyticSphereSphereToi(
  start: [number, number, number],
  end: [number, number, number],
  rStart: number,
  stationaryCenter: [number, number, number],
  rStationary: number,
): number {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const sweptLen = Math.hypot(dx, dy, dz);
  if (sweptLen < 1e-9) return -1;
  const initDist = Math.hypot(
    start[0] - stationaryCenter[0],
    start[1] - stationaryCenter[1],
    start[2] - stationaryCenter[2],
  );
  const touchDist = rStart + rStationary;
  const remaining = initDist - touchDist;
  if (remaining <= 0) return 0;
  return remaining / sweptLen;
}
    const sdf = (pos: [number, number, number]) => {
      const d = Math.hypot(pos[0] - 0.5, pos[1], pos[2]) - rStationary;
      const g: [number, number, number] = [1, 0, 0];
      return { distance: d, gradient: g };
    };
describe("TS CCD-on-SDF: sphere-sphere analytical oracle", () => {
  test("sweeping sphere toward stationary sphere reports TOI within 1e-3 of the closed-form oracle", () => {
    const stationaryCenter: [number, number, number] = [0.5, 0, 0];
    const rStationary = 0.25;
    const rStart = 0.1;
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 0, 0];
    const sdf = (pos: [number, number, number]) => ({
      distance: Math.hypot(pos[0] - 0.5, pos[1], pos[2]) - rStationary,
      gradient: [1, 0, 0],
    });
    const expectedToi = analyticSphereSphereToi(start, end, rStart, stationaryCenter, rStationary);
    const result = queryContinuousCollisionSDF(
      { startPosition: start, endPosition: end, radius: rStart, tolerance: 1e-5 },
      sdf,
    );
    expect(expectedToi).toBeGreaterThan(0);
    expect(result.hasImpact).toBe(true);
    expect(result.timeOfImpact).toBeGreaterThan(0);
    expect(Math.abs(result.timeOfImpact - expectedToi)).toBeLessThan(1e-3);
  });

  test("non-collision sweep: sphere passes well clear of the stationary sphere", () => {
    const sdf = (pos: [number, number, number]) => ({
      distance: Math.hypot(pos[0] - 10, pos[1] - 10, pos[2] - 10) - 0.25,
      gradient: [1, 0, 0],
    });
    const result = queryContinuousCollisionSDF(
      { startPosition: [0, 0, 0], endPosition: [1, 0, 0], radius: 0.1, tolerance: 1e-5 },
      sdf,
    );
    expect(result.hasImpact).toBe(false);
  });

  test("already-overlapping start position reports immediate impact (TOI ~= 0)", () => {
    const sdf = (pos: [number, number, number]) => ({
      distance: Math.hypot(pos[0], pos[1], pos[2]) - 0.5,
      gradient: [1, 0, 0],
    });
    const result = queryContinuousCollisionSDF(
      { startPosition: [0, 0, 0], endPosition: [1, 0, 0], radius: 0.5, tolerance: 1e-5 },
      sdf,
    );
    expect(result.hasImpact).toBe(true);
    expect(result.timeOfImpact).toBeLessThan(0.05);
  });
});
