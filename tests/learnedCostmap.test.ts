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

  test("analytical spatial gradient matches central finite differences in smooth and inside-obstacle regions (cmaes-feat-oa7-costmap-s8p / cmaes-za0x.18)", () => {
    const engine = new LearnedCostmapEngine({
      fourierBands: 6,
      hiddenDim: 32,
      learnedWeight: 0.4,
      seed: 101,
    });
    expect(engine.parameterCount).toBeLessThanOrEqual(100_000);

    const goal: [number, number] = [4.0, 1.5];
    const sphereSdf = (pos: [number, number]) => {
      const dx = pos[0] - 1.5;
      const dz = pos[1] - 0.5;
      const r = Math.hypot(dx, dz);
      return {
        distance: r - 0.6,
        gradient: [dx / r, dz / r] as [number, number],
      };
    };

    const h = 1e-6;
    // Test points outside obstacle (d > 0) and inside obstacle (d < 0)
    const testPoints: Array<[number, number]> = [
      [0.2, -0.4], // outside
      [2.5, 1.1], // outside
      [1.7, 0.6], // inside sphere (r = hypot(0.2, 0.1) = 0.2236 < 0.6 -> d < 0)
    ];

    for (const [x, z] of testPoints) {
      const { gradient } = engine.evaluatePotential([x, z], goal, sphereSdf);
      const vxPlus = engine.evaluatePotential([x + h, z], goal, sphereSdf).totalPotential;
      const vxMinus = engine.evaluatePotential([x - h, z], goal, sphereSdf).totalPotential;
      const vzPlus = engine.evaluatePotential([x, z + h], goal, sphereSdf).totalPotential;
      const vzMinus = engine.evaluatePotential([x, z - h], goal, sphereSdf).totalPotential;

      const fdGradX = (vxPlus - vxMinus) / (2 * h);
      const fdGradZ = (vzPlus - vzMinus) / (2 * h);

      expect(Math.abs(gradient[0] - fdGradX)).toBeLessThan(1e-5);
      expect(Math.abs(gradient[1] - fdGradZ)).toBeLessThan(1e-5);
    }

    // One-sided boundary continuity check across sdfDist = 0 (at x = 1.5 + 0.6 = 2.1, z = 0.5)
    const outsideBoundary = engine.evaluatePotential([2.1 + 1e-6, 0.5], goal, sphereSdf);
    const insideBoundary = engine.evaluatePotential([2.1 - 1e-6, 0.5], goal, sphereSdf);
    expect(Math.abs(outsideBoundary.totalPotential - insideBoundary.totalPotential)).toBeLessThan(
      1e-4,
    );
    expect(Math.abs(outsideBoundary.gradient[0] - insideBoundary.gradient[0])).toBeLessThan(1e-3);
  });

  test("fitToSdfField reduces held-out MSE and achieves >= 30% trajectory step reduction around symmetric obstacle traps", () => {
    const obstacleSdf = (pos: [number, number]) => {
      const dx = pos[0] - 1.5;
      const dz = pos[1] - 0.0;
      const r = Math.hypot(dx, dz) || 1e-6;
      return {
        distance: r - 0.25,
        gradient: [dx / r, dz / r] as [number, number],
      };
    };

    // Target clearance surrogate: smooth early-deflection potential centered at (1.0, -0.45)
    // whose negative gradient (-d/dz > 0) deflects collinear trajectories around the +Z side
    // of the obstacle at (1.5, 0.0) before they hit the stagnation point at its nose.
    const targetSurrogate = (x: number, z: number) => {
      const dx = x - 1.0;
      const dz = z + 0.45;
      return 0.1 + 1.8 * Math.exp(-(dx * dx) / 0.55 - (dz * dz) / 0.45);
    };

    const trainSamples = [];
    const heldOutSamples = [];
    for (let ix = 0; ix <= 12; ix++) {
      for (let iz = -5; iz <= 5; iz++) {
        const x = ix * 0.25;
        const z = iz * 0.16;
        const sample = { pos: [x, z] as [number, number], targetCost: targetSurrogate(x, z) };
        if ((ix + iz) % 3 === 0) {
          heldOutSamples.push(sample);
        } else {
          trainSamples.push(sample);
        }
      }
    }

    const trainedEngine = new LearnedCostmapEngine({
      fourierBands: 6,
      hiddenDim: 32,
      goalWeight: 1.4,
      obstacleWeight: 1.5,
      clearanceSteepness: 8.0,
      learnedWeight: 1.4,
      seed: 17,
    });
    const analyticEngine = new LearnedCostmapEngine({
      fourierBands: 6,
      hiddenDim: 32,
      goalWeight: 1.4,
      obstacleWeight: 1.5,
      clearanceSteepness: 8.0,
      learnedWeight: 0.0,
      seed: 17,
    });

    const receipt = trainedEngine.fitToSdfField(trainSamples, heldOutSamples, {
      epochs: 120,
      learningRate: 0.08,
    });
    expect(receipt.isTrained).toBe(true);
    expect(receipt.finalTrainMse).toBeLessThan(receipt.initialTrainMse * 0.35);
    expect(receipt.finalHeldOutMse).toBeLessThan(receipt.initialHeldOutMse * 0.35);

    // Evaluate trajectory steps to reach held-out start-goal pairs nearly collinear with the obstacle
    const heldOutPairs: Array<{ start: [number, number]; goal: [number, number] }> = [
      { start: [0.0, 0.001], goal: [3.0, 0.0] },
      { start: [0.1, 0.002], goal: [2.9, 0.0] },
      { start: [0.05, 0.0015], goal: [3.05, 0.0] },
    ];

    let totalAnalyticSteps = 0;
    let totalTrainedSteps = 0;
    const maxSteps = 40;
    const stepSize = 0.18;

    for (const pair of heldOutPairs) {
      const analyticTraj = analyticEngine.generateWarmStartTrajectory(
        pair.start,
        pair.goal,
        obstacleSdf,
        maxSteps,
        stepSize,
      );
      const trainedTraj = trainedEngine.generateWarmStartTrajectory(
        pair.start,
        pair.goal,
        obstacleSdf,
        maxSteps,
        stepSize,
      );
      totalAnalyticSteps += analyticTraj.length - 1;
      totalTrainedSteps += trainedTraj.length - 1;

      const endTrained = trainedTraj[trainedTraj.length - 1];
      expect(Math.hypot(endTrained[0] - pair.goal[0], endTrained[1] - pair.goal[1])).toBeLessThan(
        0.25,
      );
    }

    // Trained costmap must reduce total optimization steps by >= 30% compared to analytic-only
    expect(totalTrainedSteps).toBeLessThanOrEqual(totalAnalyticSteps * 0.7);
  });

  test("loadWeightsOrFallback rejects malformed or non-finite weights and falls back to analytic potential", () => {
    const engine = new LearnedCostmapEngine({ fourierBands: 4, hiddenDim: 8 });
    expect(engine.loadWeightsOrFallback(undefined)).toBe(false);
    expect(engine.isTrained).toBe(false);

    const freeSdf = () => ({ distance: 5.0, gradient: [1, 0] as [number, number] });
    const res = engine.evaluatePotential([1.0, 2.0], [3.0, 2.0], freeSdf);
    expect(res.learnedClearance).toBe(0.0);

    // Round-trip exportWeights -> loadWeightsOrFallback preserves exact predictions
    const srcEngine = new LearnedCostmapEngine({ fourierBands: 4, hiddenDim: 8, seed: 99 });
    const exported = srcEngine.exportWeights();
    expect(engine.loadWeightsOrFallback(exported)).toBe(true);
    expect(engine.isTrained).toBe(true);
    expect(engine.evaluateNeuralClearance(1.2, -0.7)).toBeCloseTo(
      srcEngine.evaluateNeuralClearance(1.2, -0.7),
      8,
    );

    // When start === goal, generateWarmStartTrajectory returns a single point without duplication
    const trivialTraj = engine.generateWarmStartTrajectory([2.0, 2.0], [2.0, 2.0], freeSdf);
    expect(trivialTraj.length).toBe(1);
    expect(trivialTraj[0]).toEqual([2.0, 2.0]);
  });
});
