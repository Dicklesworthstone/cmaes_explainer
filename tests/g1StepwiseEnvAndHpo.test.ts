import { describe, expect, test } from "bun:test";
import { G1TrainEnv } from "../app/lib/g1StepwiseEnv";
import {
  CmaesHyperparameterOptimizer,
  defaultGenotypeFromSpecs,
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

describe("Outer HPO loop upgrades (cmaes-89eg: WS-CMA-ES warm start, mirrored estimation)", () => {
  test("defaultGenotypeFromSpecs decodes to the spec defaultValues", () => {
    const genotype = defaultGenotypeFromSpecs(G1_TRAINING_HYPERPARAMETERS);
    expect(genotype.length).toBe(8);

    const hpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 7);
    const decoded = hpo.decodeGenotype(genotype);
    const vals = [
      decoded.muonLearningRate,
      decoded.muonMomentum,
      decoded.ppoEntropyCoef,
      decoded.weightProgress,
      decoded.weightUpright,
      decoded.weightEnergy,
      decoded.gaeLambda,
      decoded.valueLossCoef,
    ];
    G1_TRAINING_HYPERPARAMETERS.forEach((spec, i) => {
      expect(Math.abs(vals[i] - spec.defaultValue) / spec.defaultValue).toBeLessThan(1e-9);
    });
  });

  test("WS warm start centers the search at the prior; malformed priors fall back to cold origin", () => {
    const prior = defaultGenotypeFromSpecs(G1_TRAINING_HYPERPARAMETERS);

    const warm = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 7, {
      warmStartGenotype: prior,
      warmStartSigma: 0.2,
    });
    const warmDecoded = warm.decodeGenotype(warm.searchMean);
    expect(Math.abs(warmDecoded.muonLearningRate - 0.02) / 0.02).toBeLessThan(1e-9);
    expect(warmDecoded.muonMomentum).toBeCloseTo(0.95, 9);

    // Wrong-length prior must be refused to the historical cold origin
    const cold = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 7, {
      warmStartGenotype: [0.5, 0.5],
    });
    const coldDecoded = cold.decodeGenotype(cold.searchMean);
    expect(coldDecoded.muonLearningRate).toBeCloseTo(Math.sqrt(1e-4 * 1e-1), 12);
  });

  test("mirrored sampling doubles rollout cost and stays deterministic per seed", () => {

    const plain = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 123);
    const r1 = plain.stepGeneration();
    expect(r1.evaluationsCount).toBe(8);

    const mirrored = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 123, {
      mirroredSampling: true,
    });
    const r2 = mirrored.stepGeneration();
    expect(r2.evaluationsCount).toBe(16);

    // Same seed ⇒ identical trajectory of best-ever fitness
    const mirroredAgain = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 123, {
      mirroredSampling: true,
    });
    expect(mirroredAgain.stepGeneration().bestFitness).toBe(r2.bestFitness);
  });

  test("replications multiply rollout cost and keep best-ever monotone", () => {
    const hpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 9, {
      replicationsPerCandidate: 3,
    });

    let last = Infinity;
    for (let gen = 1; gen <= 3; gen++) {
      const res = hpo.stepGeneration();
      expect(res.evaluationsCount).toBe(gen * 24); // 8 candidates × 3 rollouts
      expect(res.bestFitness).toBeLessThanOrEqual(last);
      last = res.bestFitness;
    }
  });
});
