import { describe, expect, test } from "bun:test";
import { evaluatePolicyAblation } from "../app/lib/policyAblationComparison";

describe("Policy Architecture Side-by-Side Ablation Engine", () => {
  test("evaluatePolicyAblation generates complete comparative receipts", () => {
    const res = evaluatePolicyAblation(42, 720, 25);

    expect(res.cmaesReceipt).toBeDefined();
    expect(res.transformerReceipt).toBeDefined();
    expect(res.sceneSeed).toBe(42);

    // Parameter counts
    expect(res.cmaesReceipt.parameterCount).toBe(116);
    expect(res.transformerReceipt.parameterCount).toBe(4200000);

    // Sample efficiency multiplier > 10,000x
    expect(res.efficiencyMultiplier).toBeGreaterThan(10000);

    // Inference latency: CMA is ~1.2µs vs Transformer ~185µs
    expect(res.cmaesReceipt.inferenceLatencyMicros).toBeLessThan(5.0);
    expect(res.transformerReceipt.inferenceLatencyMicros).toBeGreaterThan(100.0);

    // Both complete full 720 steps
    expect(res.cmaesReceipt.completedSteps).toBe(720);
    expect(res.transformerReceipt.completedSteps).toBe(720);
  });

  test("deterministic evaluation across repeated runs with identical seed", () => {
    const resA = evaluatePolicyAblation(101);
    const resB = evaluatePolicyAblation(101);

    expect(resA.cmaesReceipt.objectiveScore).toEqual(resB.cmaesReceipt.objectiveScore);
    expect(resA.transformerReceipt.objectiveScore).toEqual(resB.transformerReceipt.objectiveScore);
  });

  test("Cost-of-Transport and distances are physically bounded and positive", () => {
    const res = evaluatePolicyAblation(202);

    expect(res.cmaesReceipt.distanceTraveledMeters).toBeGreaterThan(3.0);
    expect(res.transformerReceipt.distanceTraveledMeters).toBeGreaterThan(3.0);
    expect(res.cmaesReceipt.costOfTransportCoT).toBeGreaterThan(0.0);
    expect(res.transformerReceipt.costOfTransportCoT).toBeGreaterThan(0.0);
  });
});
