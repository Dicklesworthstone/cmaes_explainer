// Smoke tests for the HpoTrainer surface area (cmaes-89eg).

import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { HpoBestParameters } from "../app/components/HpoTrainer";
import {
  CmaesHyperparameterOptimizer,
  G1_TRAINING_HYPERPARAMETERS,
} from "../app/lib/cmaesHyperparameterLoop";

describe("HpoTrainer surface area (cmaes-89eg)", () => {
  test("the production parameter table shows every incumbent value under its spec name", () => {
    const markup = renderToStaticMarkup(
      <HpoBestParameters
        best={{
          muonLearningRate: 0.0021,
          muonMomentum: 0.8723,
          ppoEntropyCoef: 0.0043,
          weightProgress: 12.3456,
          weightUpright: 0.6789,
          weightEnergy: 0.0037,
          gaeLambda: 0.9543,
          valueLossCoef: 0.4321,
        }}
      />,
    );
    const rows = [...markup.matchAll(/<li\b[^>]*>(.*?)<\/li>/g)].map((m) =>
      m[1].replace(/<[^>]*>/g, ""),
    );
    expect(rows).toEqual([
      "muon_learning_rate2.10e-3",
      "muon_momentum0.872",
      "ppo_entropy_coef4.30e-3",
      "weight_progress12.346",
      "weight_upright0.679",
      "weight_energy3.70e-3",
      "gae_lambda0.954",
      "value_loss_coef0.432",
    ]);
  });

  test("the production table distinguishes an unrun search from numeric zero", () => {
    const empty = renderToStaticMarkup(<HpoBestParameters />);
    expect(empty.match(/>-<\/span>/g)).toHaveLength(8);
    const zero = renderToStaticMarkup(
      <HpoBestParameters
        best={{
          muonLearningRate: 0,
          muonMomentum: 0,
          ppoEntropyCoef: 0,
          weightProgress: 0,
          weightUpright: 0,
          weightEnergy: 0,
          gaeLambda: 0,
          valueLossCoef: 0,
        }}
      />,
    );
    expect(zero).not.toContain(">-</span>");
    expect(zero).toContain("0.00e+0");
    expect(zero).toContain("0.000");
  });

  test("Optimizer reports a monotonic-or-flat best observed fitness", () => {
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
    const a = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 42);
    const b = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 42);
    for (let g = 0; g < 3; g += 1) {
      const ra = a.stepGeneration();
      const rb = b.stepGeneration();
      expect(ra.bestFitness).toBeCloseTo(rb.bestFitness, 12);
      expect(ra.generation).toBe(rb.generation);
    }
  });
});
