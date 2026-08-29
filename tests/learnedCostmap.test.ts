import { describe, expect, test } from "bun:test";
import { LearnedCostmapEngine } from "../app/lib/learnedCostmap";

describe("Learned Clearance Costmap & Potential Field Engine", () => {
  test("encodePosition produces bounded sinusoidal features", () => {
    const engine = new LearnedCostmapEngine({ fourierBands: 4 });
    const feats = engine.encodePosition(1.5, 3.2);

    expect(feats.length).toBe(8); // 2 * 4
    for (const val of feats) {
      expect(val).toBeGreaterThanOrEqual(-1.0);
      expect(val).toBeLessThanOrEqual(1.0);
      expect(Number.isFinite(val)).toBe(true);
    }
  });

  test("evaluateNeuralClearance is positive, finite, and sub-millisecond fast", () => {
    const engine = new LearnedCostmapEngine({ hiddenDim: 32 });

    const t0 = performance.now();
    for (let i = 0; i < 100; i++) {
      const val = engine.evaluateNeuralClearance(i * 0.05, 1.0);
      expect(val).toBeGreaterThan(0.0);
      expect(Number.isFinite(val)).toBe(true);
    }
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(50.0); // <500µs per evaluation under parallel test load
  });

  test("evaluatePotential increases steeply near obstacles and points gradient outward", () => {
    const engine = new LearnedCostmapEngine();
    const goal: [number, number] = [5.0, 0.0];

    // Mock SDF for a single sphere obstacle centered at [2.0, 0.0] with radius 0.5
    const mockSdf = (pos: [number, number]) => {
      const dx = pos[0] - 2.0;
      const dz = pos[1] - 0.0;
      const dist = Math.hypot(dx, dz) - 0.5;
      const len = Math.hypot(dx, dz) || 1e-4;
      const grad: [number, number] = [dx / len, dz / len];
      return { distance: dist, gradient: grad };
    };

    // Point far from obstacle [0.0, 0.0] (dist = 1.5)
    const farRes = engine.evaluatePotential([0.0, 0.0], goal, mockSdf);

    // Point right next to obstacle boundary [1.45, 0.0] (dist = -0.05)
    const nearRes = engine.evaluatePotential([1.45, 0.0], goal, mockSdf);

    expect(nearRes.obstaclePenalty).toBeGreaterThan(farRes.obstaclePenalty);
    expect(nearRes.totalPotential).toBeGreaterThan(farRes.totalPotential);

    // Potential increases as x approaches obstacle (+X), so gradient is positive (>0)
    // and gradient descent (-grad) pushes left (-X) away from obstacle
    expect(nearRes.gradient[0]).toBeGreaterThan(0.0);
    const descentDirX = -nearRes.gradient[0];
    expect(descentDirX).toBeLessThan(0.0); // Repulsion pushes left!
  });

  test("generateWarmStartTrajectory routes points towards the goal", () => {
    const engine = new LearnedCostmapEngine();
    const start: [number, number] = [0.0, 0.0];
    const goal: [number, number] = [3.0, 0.0];

    // Free space SDF (distance = 10m everywhere)
    const freeSdf = () => ({ distance: 10.0, gradient: [0, 0] as [number, number] });

    const traj = engine.generateWarmStartTrajectory(start, goal, freeSdf, 15, 0.3);

    expect(traj.length).toBeGreaterThan(2);
    expect(traj[0]).toEqual(start);

    // Final point should be close to or at goal
    const lastPoint = traj[traj.length - 1];
    const distToGoal = Math.hypot(lastPoint[0] - goal[0], lastPoint[1] - goal[1]);
    expect(distToGoal).toBeLessThan(0.5);
  });
});
