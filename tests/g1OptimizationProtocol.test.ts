import { describe, expect, test } from "bun:test";
import {
  g1OptimizationConfig,
  g1OptimizationRunKey,
} from "../app/lib/g1OptimizationProtocol";

describe("G1 optimization task protocol", () => {
  test("builds an owner config for every task without mutating the other inputs", () => {
    for (const task of ["balance", "stepping", "walking"] as const) {
      const config = g1OptimizationConfig(task, "flat");
      expect(config.task).toBe(task);
      expect(config.challenge).toBe("flat");
      expect(config.durationSeconds).toBe(1.5);
      expect(config.traceStride).toBe(12);
    }
  });

  test("isolates continuation sessions across task, challenge, family, and seed", () => {
    const baseline = g1OptimizationRunKey("walking", "terrain-and-push", "lm-cma", 0);
    const negativeControls = [
      g1OptimizationRunKey("balance", "terrain-and-push", "lm-cma", 0),
      g1OptimizationRunKey("stepping", "terrain-and-push", "lm-cma", 0),
      g1OptimizationRunKey("walking", "flat", "lm-cma", 0),
      g1OptimizationRunKey("walking", "terrain-and-push", "separable", 0),
      g1OptimizationRunKey("walking", "terrain-and-push", "lm-cma", 1),
    ];

    expect(new Set([baseline, ...negativeControls]).size).toBe(6);
    expect(baseline).toBe("walking:terrain-and-push:lm-cma:0");
  });
});
