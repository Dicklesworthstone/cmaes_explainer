import { describe, expect, test } from "bun:test";
import { G1TrainEnv } from "../app/lib/g1StepwiseEnv";
import {
  CmaesHyperparameterOptimizer,
  G1_TRAINING_HYPERPARAMETERS,
} from "../app/lib/cmaesHyperparameterLoop";

describe("G1 Stepwise Environment & Outer CMA-ES Hyperparameter Optimization", () => {
  test("G1TrainEnv reset produces complete 42-D observation vector", () => {
    const env = new G1TrainEnv({ maxSteps: 100 });
    const obs = env.reset(42);

    expect(obs.jointPositions.length).toBe(15);
    expect(obs.jointVelocities.length).toBe(15);
    expect(obs.rawVector.length).toBe(42);
    expect(obs.targetSpeed).toBe(0.65);
    expect(Number.isFinite(obs.phaseSin)).toBe(true);
    expect(Number.isFinite(obs.phaseCos)).toBe(true);
  });

  test("G1TrainEnv step computes dense rewards and tracks forward progress", () => {
    const env = new G1TrainEnv({ maxSteps: 50 });
    env.reset(42);

    const action = new Array(15).fill(0.1);
    const stepRes = env.step(action);

    expect(stepRes.observation.rawVector.length).toBe(42);
    expect(Number.isFinite(stepRes.reward)).toBe(true);
    expect(stepRes.info.step).toBe(1);
    expect(stepRes.info.cumulativeDistanceMeters).toBeGreaterThan(0.0);
    expect(stepRes.done).toBe(false);

    // Step until timeout
    for (let s = 1; s < 50; s++) {
      const r = env.step(action);
      if (r.done) {
        expect(r.info.terminationReason).toBe("timeout");
        break;
      }
    }
  });

  test("CmaesHyperparameterOptimizer decodes and optimizes 8-D HPO space across generations", () => {
    const hpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 123);

    // Initial decoded default
    const decoded = hpo.decodeGenotype(new Array(8).fill(0.0));
    expect(decoded.muonLearningRate).toBeGreaterThan(0.0);
    expect(decoded.muonMomentum).toBeGreaterThanOrEqual(0.80);
    expect(decoded.muonMomentum).toBeLessThanOrEqual(0.99);
    expect(decoded.gaeLambda).toBeGreaterThan(0.90);

    // Step 5 outer HPO generations
    let firstFit = Infinity;
    let lastFit = Infinity;

    for (let gen = 0; gen < 5; gen++) {
      const res = hpo.stepGeneration();
      expect(res.generation).toBe(gen + 1);
      expect(res.evaluationsCount).toBe((gen + 1) * 8);

      if (gen === 0) firstFit = res.bestFitness;
      lastFit = res.bestFitness;
    }

    expect(lastFit).toBeLessThanOrEqual(firstFit);
  });
});
