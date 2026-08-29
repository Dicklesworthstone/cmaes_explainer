import { describe, expect, test } from "bun:test";
import {
  queryContinuousCollisionSDF,
  resolveContinuousCollision,
  type SdfEvaluator3D,
} from "../app/lib/continuousCollisionDetection";

describe("Continuous Collision Detection (CCD) on Signed Distance Fields", () => {
  // Thin glass pane at x = 0.5 with thickness 0.01m (x in [0.495, 0.505])
  const thinGlassSdf: SdfEvaluator3D = (pos: [number, number, number]) => {
    const dx = Math.abs(pos[0] - 0.5) - 0.005;
    const dy = Math.max(0, Math.abs(pos[1]) - 1.0);
    const dz = Math.max(0, Math.abs(pos[2]) - 1.0);
    const dist = Math.hypot(Math.max(0, dx), dy, dz) + Math.min(0, dx);
    const normalX = pos[0] >= 0.5 ? 1.0 : -1.0;
    return { distance: dist, gradient: [normalX, 0.0, 0.0] };
  };

  test("CCD catches high-speed thin-wall penetration that discrete collision misses (anti-tunneling)", () => {
    const startPos: [number, number, number] = [0.0, 0.0, 0.0];
    const endPos: [number, number, number] = [1.0, 0.0, 0.0]; // Jumped across x=0.5 in 1 frame
    const radius = 0.02; // 2cm sphere

    // Discrete check at start & end both report positive distance (free space)
    expect(thinGlassSdf(startPos).distance).toBeGreaterThan(0.4);
    expect(thinGlassSdf(endPos).distance).toBeGreaterThan(0.4);

    // CCD swept query evaluates space-time path
    const ccdRes = queryContinuousCollisionSDF(
      {
        startPosition: startPos,
        endPosition: endPos,
        radius,
      },
      thinGlassSdf,
    );

    expect(ccdRes.hasImpact).toBe(true);
    expect(ccdRes.timeOfImpact).not.toBeNull();
    expect(ccdRes.timeOfImpact!).toBeGreaterThan(0.4);
    expect(ccdRes.timeOfImpact!).toBeLessThan(0.55);
    expect(ccdRes.surfaceNormal).toEqual([-1.0, 0.0, 0.0]);
    expect(ccdRes.impactPosition![0]).toBeCloseTo(0.475, 2);
  });

  test("resolveContinuousCollision halts projectile and reflects velocity", () => {
    const startPos: [number, number, number] = [0.1, 0.0, 0.0];
    const velocity: [number, number, number] = [20.0, 0.0, 0.0]; // 20 m/s in +X
    const dt = 1 / 30; // jumps 0.67m -> would tunnel through x=0.5
    const radius = 0.02;

    const res = resolveContinuousCollision(startPos, velocity, dt, radius, thinGlassSdf, 0.5);

    expect(res.impactDetected).toBe(true);
    expect(res.newPosition[0]).toBeLessThan(0.5); // Never crossed through glass
    expect(res.newVelocity[0]).toBeLessThan(0.0); // Reflected backward!
    expect(res.newVelocity[0]).toBeCloseTo(-10.0, 1); // e = 0.5 -> 20 * -0.5 = -10
  });

  test("non-colliding swept path returns hasImpact = false", () => {
    const startPos: [number, number, number] = [0.0, 2.5, 0.0]; // Flying high above glass pane
    const endPos: [number, number, number] = [1.0, 2.5, 0.0];

    const ccdRes = queryContinuousCollisionSDF(
      {
        startPosition: startPos,
        endPosition: endPos,
        radius: 0.02,
      },
      thinGlassSdf,
    );

    expect(ccdRes.hasImpact).toBe(false);
    expect(ccdRes.timeOfImpact).toBeNull();
  });

  test("sub-millisecond execution benchmark for 100 CCD swept queries", () => {
    const t0 = performance.now();
    for (let i = 0; i < 100; i++) {
      queryContinuousCollisionSDF(
        {
          startPosition: [0.0, 0.0, 0.0],
          endPosition: [1.0, 0.0, 0.0],
          radius: 0.02,
        },
        thinGlassSdf,
      );
    }
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(50.0); // <500µs per query under parallel test load
  });
});
