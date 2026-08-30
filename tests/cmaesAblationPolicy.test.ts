import { describe, expect, test } from "bun:test";
import {
  runCmaesPolicySearch,
  type CmaesPolicySearchResult,
} from "../app/lib/cmaesAblationPolicy";

function assertReceiptShape(result: CmaesPolicySearchResult): void {
  expect(result.receipt.parameterCount).toBe(105);
  expect(result.bestGenotype.length).toBe(105);
  for (const w of result.bestGenotype) {
    expect(Number.isFinite(w)).toBe(true);
  }
  expect(result.receipt.trainingSamplesRequired).toBeGreaterThan(0);
  expect(Number.isFinite(result.receipt.trainingWallclockMs)).toBe(true);
  expect(result.receipt.trainingWallclockMs).toBeGreaterThanOrEqual(0);
  expect(result.receipt.inferenceLatencyMicros).toBeGreaterThan(0);

  const m = result.finalMetrics;
  expect(m.completedSteps).toBeGreaterThan(0);
  expect(m.completedSteps).toBeLessThanOrEqual(m.totalStepsBudget);
  expect(m.distanceTraveledMeters).toBeGreaterThanOrEqual(0);
  expect(m.averageSpeedMps).toBeGreaterThanOrEqual(0);
  expect(m.actuatorWorkJoules).toBeGreaterThanOrEqual(0);
  expect(m.costOfTransportCoT).toBeGreaterThanOrEqual(0);
  expect(m.survivalRatePercent).toBeGreaterThanOrEqual(0);
  expect(m.survivalRatePercent).toBeLessThanOrEqual(100);
  expect(Number.isFinite(m.objectiveScore)).toBe(true);
  expect(typeof m.fallOccurred).toBe("boolean");
}

describe("CMA-ES Ablation Policy Search", () => {
  test(
    "default run stays within budget and is deterministic for a fixed seed",
    () => {
      const first = runCmaesPolicySearch();
      assertReceiptShape(first);
      expect(first.receipt.trainingSamplesRequired).toBeLessThanOrEqual(2400);
      // Population-sliced budget: exactly the full budget spent in
      // populationSize chunks.
      expect(first.receipt.trainingSamplesRequired).toBe(2400);

      const second = runCmaesPolicySearch();
      expect(second.bestGenotype).toEqual(first.bestGenotype);
      expect(second.finalMetrics.objectiveScore).toBe(
        first.finalMetrics.objectiveScore,
      );
      expect(second.finalMetrics.distanceTraveledMeters).toBe(
        first.finalMetrics.distanceTraveledMeters,
      );
    },
    60000,
  );

  test("parameter count matches the disclosed family (7 features x 15 actuators)", () => {
    const result = runCmaesPolicySearch({
      budgetEvaluations: 32,
      episodeSteps: 60,
      finalSteps: 60,
    });
    expect(result.receipt.parameterCount).toBe(105);
    expect(result.bestGenotype.length).toBe(105);
  });

  test("final metrics are physically sane", () => {
    const result = runCmaesPolicySearch({
      budgetEvaluations: 64,
      episodeSteps: 120,
      finalSteps: 360,
    });
    assertReceiptShape(result);
    // Speed consistent with distance over the full budget horizon at 60 Hz.
    const expectedSpeed =
      result.finalMetrics.distanceTraveledMeters /
      (result.finalMetrics.totalStepsBudget * (1 / 60));
    expect(result.finalMetrics.averageSpeedMps).toBeCloseTo(expectedSpeed, 12);
  });

  test("a tiny budget still returns a valid receipt", () => {
    const result = runCmaesPolicySearch({
      budgetEvaluations: 16,
      episodeSteps: 60,
      finalSteps: 60,
    });
    assertReceiptShape(result);
    expect(result.receipt.trainingSamplesRequired).toBe(16);
  });

  test("budget not divisible by population size is respected exactly", () => {
    const result = runCmaesPolicySearch({
      budgetEvaluations: 20,
      populationSize: 16,
      episodeSteps: 60,
      finalSteps: 60,
    });
    expect(result.receipt.trainingSamplesRequired).toBe(20);
  });

  test("seed changes the search trajectory", () => {
    const a = runCmaesPolicySearch({
      seed: 7,
      budgetEvaluations: 32,
      episodeSteps: 60,
      finalSteps: 60,
    });
    const b = runCmaesPolicySearch({
      seed: 8,
      budgetEvaluations: 32,
      episodeSteps: 60,
      finalSteps: 60,
    });
    expect(a.bestGenotype).not.toEqual(b.bestGenotype);
  });
});
