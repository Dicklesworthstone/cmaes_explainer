import { describe, expect, test } from "bun:test";
import {
  computeAdaptiveSafetyMargin,
  DEFAULT_MARGIN_CONFIG,
  getFragilityMultiplier,
  type ObstacleRiskProfile,
} from "../app/lib/riskAwareMargin";

describe("Risk-Aware Adaptive Safety Margin Engine", () => {
  const normal: [number, number, number] = [1, 0, 0]; // Surface facing +X
  const obstacle: ObstacleRiskProfile = {
    center: [0, 0, 0],
    riskClass: "rigid-obstacle",
  };

  test("zero velocity returns base margin", () => {
    const res = computeAdaptiveSafetyMargin([1, 0, 0], [0, 0, 0], normal, obstacle);
    expect(res.margin).toBeCloseTo(DEFAULT_MARGIN_CONFIG.baseMargin, 4);
    expect(res.brakingDist).toBeCloseTo(0.0);
  });

  test("higher approach velocity increases braking safety margin", () => {
    // Moving towards obstacle along -X at 0.5 m/s vs 1.5 m/s
    const slow = computeAdaptiveSafetyMargin([1, 0, 0], [-0.5, 0, 0], normal, obstacle);
    const fast = computeAdaptiveSafetyMargin([1, 0, 0], [-1.5, 0, 0], normal, obstacle);

    expect(fast.brakingDist).toBeGreaterThan(slow.brakingDist);
    expect(fast.margin).toBeGreaterThan(slow.margin);
    expect(fast.margin).toBeGreaterThan(0.2); // Fast speed requires >20cm stopping buffer
  });

  test("head-on approach demands higher margin than glancing parallel motion", () => {
    // Head on: velocity [-1, 0, 0] directly into surface
    const headOn = computeAdaptiveSafetyMargin([1, 0, 0], [-1.0, 0, 0], normal, obstacle);

    // Glancing: velocity [0, 1.0, 0] parallel to surface
    const glancing = computeAdaptiveSafetyMargin([1, 0, 0], [0, 1.0, 0], normal, obstacle);

    expect(headOn.angleFactor).toBeCloseTo(1.0, 2);
    expect(glancing.angleFactor).toBeCloseTo(DEFAULT_MARGIN_CONFIG.minAngleFactor, 2);
    expect(headOn.margin).toBeGreaterThan(glancing.margin);
  });

  test("fragile shatterable obstacles have substantially higher risk multipliers", () => {
    const glassObs: ObstacleRiskProfile = { center: [0, 0, 0], riskClass: "shatterable" };
    const cushionObs: ObstacleRiskProfile = { center: [0, 0, 0], riskClass: "soft-compliant" };

    const glassMult = getFragilityMultiplier(glassObs.riskClass);
    const cushionMult = getFragilityMultiplier(cushionObs.riskClass);

    expect(glassMult).toBeGreaterThan(2.0);
    expect(cushionMult).toBeLessThan(1.0);

    const glassMargin = computeAdaptiveSafetyMargin([1, 0, 0], [-1.0, 0, 0], normal, glassObs);
    const cushionMargin = computeAdaptiveSafetyMargin([1, 0, 0], [-1.0, 0, 0], normal, cushionObs);

    expect(glassMargin.margin).toBeGreaterThan(cushionMargin.margin * 2.0);
  });
});
