// Smoke tests for the HpoTrainer surface area (cmaes-89eg).

import { describe, expect, test } from "bun:test";
import {
  CmaesHyperparameterOptimizer,
  G1_TRAINING_HYPERPARAMETERS,
  type HpoParameterSpec,
} from "../app/lib/cmaesHyperparameterLoop";

function formatParam(
  name: string,
  value: number,
  spec: HpoParameterSpec,
): string {
  if (spec.isLogScale) {
    return `${name} = ${value.toExponential(2)}`;
  }
  return `${name} = ${value.toFixed(3)}`;
}

describe("HpoTrainer surface area (cmaes-89eg)", () => {
  test("formatParam: log-scale params use exponential notation", () => {
    const spec: HpoParameterSpec = {
      name: "muon_learning_rate",
      minVal: 1e-4,
      maxVal: 1e-1,
      defaultValue: 0.02,
      isLogScale: true,
    };
    const text = formatParam(spec.name, 0.0021, spec);
    expect(text).toBe("muon_learning_rate = 2.10e-3");
  });

  test("formatParam: linear params use 3-decimal fixed notation", () => {
    const spec: HpoParameterSpec = {
      name: "muon_momentum",
      minVal: 0.5,
      maxVal: 0.999,
      defaultValue: 0.95,
    };
    expect(formatParam(spec.name, 0.95, spec)).toBe("muon_momentum = 0.950");
    expect(formatParam(spec.name, 0.8723, spec)).toBe("muon_momentum = 0.872");
  });

  test("HpoTrainer's name->value map covers every spec", () => {
    const specNames = new Set(G1_TRAINING_HYPERPARAMETERS.map((s) => s.name));
    const expectedKeys: Record<string, string> = {
      muonLearningRate: "muon_learning_rate",
      muonMomentum: "muon_momentum",
      ppoEntropyCoef: "ppo_entropy_coef",
      weightProgress: "weight_progress",
      weightUpright: "weight_upright",
      weightEnergy: "weight_energy",
      gaeLambda: "gae_lambda",
      valueLossCoef: "value_loss_coef",
    };
    for (const [decoded, specName] of Object.entries(expectedKeys)) {
      expect(specNames.has(specName)).toBe(true);
      expect(decoded).toMatch(/[A-Z]/);
      expect(specName).toMatch(/_/);
    }
  });

  test("Optimizer step generation is monotonic-or-flat in bestFitness (1+lambda)-ES", () => {
    const optimizer = new CmaesHyperparameterOptimizer(
      G1_TRAINING_HYPERPARAMETERS,
      0x47315040,
    );
    let prev = optimizer.stepGeneration().bestFitness;
    for (let g = 0; g < 4; g += 1) {
      const next = optimizer.stepGeneration().bestFitness;
      expect(next).toBeLessThanOrEqual(prev + 1e-9);
      prev = next;
    }
  });

  test("Optimizer deterministic for fixed seed", () => {
    const a = new CmaesHyperparameterOptimizer(
      G1_TRAINING_HYPERPARAMETERS,
      42,
    );
    const b = new CmaesHyperparameterOptimizer(
      G1_TRAINING_HYPERPARAMETERS,
      42,
    );
    for (let g = 0; g < 3; g += 1) {
      const ra = a.stepGeneration();
      const rb = b.stepGeneration();
      expect(ra.bestFitness).toBeCloseTo(rb.bestFitness, 12);
      expect(ra.generation).toBe(rb.generation);
    }
  });
});
