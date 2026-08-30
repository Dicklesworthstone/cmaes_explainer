import { describe, expect, test } from "bun:test";
import { evaluatePolicyAblation } from "../app/lib/policyAblationComparison";

describe("Policy Architecture Side-by-Side Ablation Engine", () => {
  test("evaluatePolicyAblation generates complete comparative receipts", () => {
    const res = evaluatePolicyAblation(42, 720, 25);

    expect(res.cmaesReceipt).toBeDefined();
    expect(res.transformerReceipt).toBeDefined();
    expect(res.sceneSeed).toBe(42);

    // Parameter counts (5,040 G1 weights vs 4.2M Transformer weights)
    expect(res.cmaesReceipt.parameterCount).toBe(5040);
    expect(res.transformerReceipt.parameterCount).toBe(4200000);

    // Placeholders
    expect(res.cmaesReceipt.placeholder).toBe(false);
    expect(res.transformerReceipt.placeholder).toBe(true);

    // Sample efficiency multiplier > 10,000x
    expect(res.efficiencyMultiplier).toBeGreaterThan(10000);

    // Inference latency: CMA is ~1.2µs vs Transformer ~185µs
    expect(res.cmaesReceipt.inferenceLatencyMicros).toBeLessThan(5.0);
    expect(res.transformerReceipt.inferenceLatencyMicros).toBeGreaterThan(100.0);

    // CMA-ES completes full 720 steps
    expect(res.cmaesReceipt.completedSteps).toBe(720);
  });

  test("deterministic evaluation across repeated runs with identical seed", () => {
    const resA = evaluatePolicyAblation(101);
    const resB = evaluatePolicyAblation(101);

    expect(resA.cmaesReceipt.distanceTraveledMeters).toEqual(resB.cmaesReceipt.distanceTraveledMeters);
    expect(resA.transformerReceipt.trainingSamplesRequired).toEqual(resB.transformerReceipt.trainingSamplesRequired);
  });

  test("Cost-of-Transport and distances are physically bounded and positive for CMA-ES", () => {
    const res = evaluatePolicyAblation(202);

    expect(res.cmaesReceipt.distanceTraveledMeters).toBeGreaterThan(0.0);
    expect(res.cmaesReceipt.costOfTransportCoT).toBeGreaterThan(0.0);
  });
});
