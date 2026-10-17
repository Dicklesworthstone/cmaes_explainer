import { describe, expect, test } from "bun:test";
import {
  generateShuffledScene,
  runMultiTrialStressSuite,
  runShuffledStressTrial,
} from "../app/lib/shuffledFurnitureStressTest";

describe("Shuffled Furniture Stress Test & Domain Randomization Engine", () => {
  test("generateShuffledScene produces deterministic layouts for identical seeds", () => {
    const sceneA = generateShuffledScene({ seed: 777 });
    const sceneB = generateShuffledScene({ seed: 777 });

    expect(sceneA.furniture.length).toBe(sceneB.furniture.length);
    for (let i = 0; i < sceneA.furniture.length; i++) {
      expect(sceneA.furniture[i].center).toEqual(sceneB.furniture[i].center);
      expect(sceneA.furniture[i].rotation).toEqual(sceneB.furniture[i].rotation);
    }
    expect(sceneA.rollingPiece.state.position).toEqual(sceneB.rollingPiece.state.position);
  });

  test("different seeds produce distinctly jittered layouts", () => {
    const scene1 = generateShuffledScene({ seed: 101 });
    const scene2 = generateShuffledScene({ seed: 202 });

    let diffCount = 0;
    for (let i = 0; i < scene1.furniture.length; i++) {
      if (
        scene1.furniture[i].center[0] !== scene2.furniture[i].center[0] ||
        scene1.furniture[i].center[1] !== scene2.furniture[i].center[1]
      ) {
        diffCount++;
      }
    }
    expect(diffCount).toBeGreaterThan(10); // Multiple pieces jittered differently
  });

  test("runShuffledStressTrial successfully reaches goal without collision", () => {
    const scene = generateShuffledScene({ seed: 42 });
    const result = runShuffledStressTrial(scene);

    expect(result.success).toBe(true);
    expect(result.collisionOccurred).toBe(false);
    expect(result.minimumClearanceMeters).toBeGreaterThan(0.0);
    expect(result.distanceTraveledMeters).toBeGreaterThan(2.0);
  });

  test("runMultiTrialStressSuite achieves 100% pass rate across 5 randomized seeds", () => {
    const summary = runMultiTrialStressSuite([101, 202, 303, 404, 505]);

    expect(summary.totalTrials).toBe(5);
    expect(summary.validAttemptCount).toBe(5);
    expect(summary.infeasibleLayoutCount).toBe(0);
    expect(summary.passedTrials).toBe(5);
    expect(summary.failedTrials).toBe(0);
    expect(summary.passRatePercent).toBe(100.0);
    expect(summary.passRateConfidenceInterval95[0]).toBeGreaterThan(50.0);
    expect(summary.passRateConfidenceInterval95[1]).toBeCloseTo(100.0, 5);
    expect(summary.worstClearanceMeters).toBeGreaterThan(0.0);
    expect(summary.meanClearanceMeters).toBeGreaterThan(0.1);

    for (const trial of summary.trials) {
      expect(trial.success).toBe(true);
      expect(trial.layoutFeasible).toBe(true);
      expect(trial.collisionOccurred).toBe(false);
    }
  });

  test("runShuffledStressTrial preserves raw negative clearances without clamping when starting inside an anchor obstacle", () => {
    const scene = generateShuffledScene({ seed: 42 });
    // [-3.3, 2.6] is the anchor fireplace center
    const res = runShuffledStressTrial(scene, [-3.3, 2.6], [-1.5, 2.5], 50);

    expect(res.layoutFeasible).toBe(false);
    expect(res.collisionOccurred).toBe(true);
    expect(res.success).toBe(false);
    expect(res.minimumClearanceMeters).toBeLessThan(0.0);
    expect(res.minimumFurnitureClearanceMeters).toBeLessThan(0.0);
    expect(res.nearestObstacleName).toContain("fireplace");
  });
});
