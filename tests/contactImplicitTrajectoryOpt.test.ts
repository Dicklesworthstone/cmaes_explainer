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
  });
});
