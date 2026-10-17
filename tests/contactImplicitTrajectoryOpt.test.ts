import { describe, expect, test } from "bun:test";
import {
  type CitoProblem,
  fischerBurmeister,
  fischerBurmeisterGrad,
  solveContactImplicitCollocation,
} from "../app/lib/contactImplicitTrajectoryOpt";

describe("Contact-Implicit Trajectory Optimization (C-ITO) Engine", () => {
  test("fischerBurmeister evaluates smoothed complementarity", () => {
    // Exact complementarity: a = 5, b = 0 with eps -> 0
    const fb1 = fischerBurmeister(5.0, 0.0, 1e-6);
    expect(Math.abs(fb1)).toBeLessThan(1e-4);

    // a = 0, b = 10
    const fb2 = fischerBurmeister(0.0, 10.0, 1e-6);
    expect(Math.abs(fb2)).toBeLessThan(1e-4);

    // Violation: a = 2, b = 3
    const fb3 = fischerBurmeister(2.0, 3.0, 1e-6);
    expect(fb3).toBeGreaterThan(1.0); // 2 + 3 - sqrt(4 + 9) = 5 - 3.605 = 1.395
  });

  test("fischerBurmeisterGrad analytical derivatives match finite differences", () => {
    const a = 2.5;
    const b = 1.8;
    const eps = 0.05;
    const h = 1e-6;

    const analytical = fischerBurmeisterGrad(a, b, eps);

    const numDa = (fischerBurmeister(a + h, b, eps) - fischerBurmeister(a - h, b, eps)) / (2 * h);
    const numDb = (fischerBurmeister(a, b + h, eps) - fischerBurmeister(a, b - h, eps)) / (2 * h);

    expect(analytical.da).toBeCloseTo(numDa, 4);
    expect(analytical.db).toBeCloseTo(numDb, 4);
  });

  test("solveContactImplicitCollocation discovers collision-free contact-implicit trajectory", () => {
    const problem: CitoProblem = {
      horizonSteps: 10,
      dt: 0.1,
      initialQ: [0, 0, 0], // Start at origin
      targetQ: [2.0, 0, 0], // Walk 2 meters along X
      mass: 35.0, // 35kg humanoid
      obstacles: [{ center: [1.0, 0.0, 0.0], size: [0.3, 0.3, 0.2] }],
      frictionCoeff: 0.7,
      epsilonInit: 0.1,
      epsilonMin: 1e-4,
    };

    const res = solveContactImplicitCollocation(problem);
    expect(res.converged).toBe(true);
    expect(res.trajectory.length).toBe(10);
    expect(res.maxComplementarityGap).toBeLessThanOrEqual(1e-3);
    expect(res.maxFrictionViolation).toBeLessThanOrEqual(1e-4);
    expect(res.maxFischerBurmeisterResidual).toBeLessThanOrEqual(1e-4);
    expect(res.totalCost).toBeGreaterThan(0);

    // Verify the trajectory genuinely steps over the obstacle at x ≈ 1.0 (height 0.2m)
    const maxFootZ = Math.max(...res.trajectory.map((step) => step.q[2]));
    expect(maxFootZ).toBeGreaterThan(0.2);

    // During swing phase over obstacle (q[2] > 0.1), normal forces must decay to near zero
    const swingSteps = res.trajectory.filter((step) => step.q[2] > 0.1);
    expect(swingSteps.length).toBeGreaterThan(0);
    for (const swing of swingSteps) {
      expect(swing.clearances[0]).toBeGreaterThan(0.1);
      expect(swing.normalForces[0]).toBeLessThan(1e-3);
      expect(swing.normalForces[1]).toBeLessThan(1e-3);
    }

    // At stance endpoints (q[2] == 0), normal forces support the humanoid weight
    expect(res.trajectory[0].clearances[0]).toBe(0);
    expect(res.trajectory[0].normalForces[0] + res.trajectory[0].normalForces[1]).toBeGreaterThan(
      100,
    );
  });

  test("negative control: obstacle presence causally alters step-over height, controls u, and totalCost", () => {
    const unobstructed: CitoProblem = {
      horizonSteps: 11,
      dt: 0.1,
      initialQ: [0, 0, 0],
      targetQ: [2.0, 0, 0],
      mass: 35.0,
      obstacles: [],
      frictionCoeff: 0.7,
    };
    const obstructed: CitoProblem = {
      ...unobstructed,
      obstacles: [{ center: [1.0, 0.0, 0.0], size: [0.4, 0.4, 0.25] }],
    };

    const resFlat = solveContactImplicitCollocation(unobstructed);
    const resObs = solveContactImplicitCollocation(obstructed);

    expect(resFlat.converged).toBe(true);
    expect(resObs.converged).toBe(true);

    const maxZFlat = Math.max(...resFlat.trajectory.map((s) => s.q[2]));
    const maxZObs = Math.max(...resObs.trajectory.map((s) => s.q[2]));
    expect(maxZFlat).toBe(0);
    expect(maxZObs).toBeGreaterThan(0.25);

    const controlEffortFlat = resFlat.trajectory.reduce(
      (acc, s) => acc + Math.hypot(...s.u),
      0,
    );
    const controlEffortObs = resObs.trajectory.reduce(
      (acc, s) => acc + Math.hypot(...s.u),
      0,
    );
    expect(controlEffortObs).toBeGreaterThan(controlEffortFlat + 10.0);
    expect(resObs.totalCost).not.toBeCloseTo(resFlat.totalCost, 3);
  });
});
