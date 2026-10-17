import { describe, expect, test } from "bun:test";
import {
  CmaesHyperparameterOptimizer,
  defaultGenotypeFromSpecs,
  G1_TRAINING_HYPERPARAMETERS,
} from "../app/lib/cmaesHyperparameterLoop";
import {
  G1_ACTUATOR_TO_PHYSICAL_JOINT_INDEX,
  G1_LEARNED_ACTUATOR_15_NAMES,
  G1_OBSERVATION_42_SCHEMA,
  G1_PHYSICAL_29_JOINT_NAMES,
  G1TrainEnv,
  stepBatch,
} from "../app/lib/g1StepwiseEnv";

describe("G1 Stepwise Environment & Outer CMA-ES Hyperparameter Optimization", () => {
  test("G1TrainEnv reset produces complete 42-D observation vector and matches explicit 15/29 joint and 42-D observation schemas", () => {
    const env = new G1TrainEnv({ maxSteps: 100 });
    const obs = env.reset(42);

    expect(obs.jointPositions.length).toBe(15);
    expect(obs.jointVelocities.length).toBe(15);
    expect(obs.rawVector.length).toBe(42);
    expect(obs.targetSpeed).toBe(0.65);
    expect(Number.isFinite(obs.phaseSin)).toBe(true);
    expect(Number.isFinite(obs.phaseCos)).toBe(true);

    // Verify 15 learned actuators vs 29 physical G1 joints mapping
    expect(G1_PHYSICAL_29_JOINT_NAMES.length).toBe(29);
    expect(G1_LEARNED_ACTUATOR_15_NAMES.length).toBe(15);
    expect(G1_ACTUATOR_TO_PHYSICAL_JOINT_INDEX.length).toBe(15);
    G1_ACTUATOR_TO_PHYSICAL_JOINT_INDEX.forEach((physIdx, actIdx) => {
      expect(G1_PHYSICAL_29_JOINT_NAMES[physIdx]).toBe(G1_LEARNED_ACTUATOR_15_NAMES[actIdx]);
    });

    // Verify 42-D observation schema slices partition [0..42) without gaps or overlaps
    const slices = Object.values(G1_OBSERVATION_42_SCHEMA.slices);
    let cursor = 0;
    for (const s of slices) {
      expect(Number(s.offset)).toBe(cursor);
      cursor += s.length;
    }
    expect(cursor).toBe(G1_OBSERVATION_42_SCHEMA.totalDimension);
  });

  test("seeded reset with perturbInitialState is bit-identical per seed and causally distinct across seeds, while stepBatch matches sequential step", () => {
    const envA1 = new G1TrainEnv({ maxSteps: 20 });
    const envA2 = new G1TrainEnv({ maxSteps: 20 });
    const envB = new G1TrainEnv({ maxSteps: 20 });

    const obsA1 = envA1.reset(101, { perturbInitialState: true, perturbScale: 0.03 });
    const obsA2 = envA2.reset(101, { perturbInitialState: true, perturbScale: 0.03 });
    const obsB = envB.reset(202, { perturbInitialState: true, perturbScale: 0.03 });

    expect(obsA1.rawVector).toEqual(obsA2.rawVector);
    expect(obsA1.rawVector).not.toEqual(obsB.rawVector);

    // Verify stepBatch matches sequential step bit-for-bit
    const actionA = new Array(15).fill(0.2);
    const actionB = new Array(15).fill(-0.15);
    const batchResults = stepBatch([envA1, envB], [actionA, actionB]);
    const seqResultA = envA2.step(actionA);
    expect(batchResults[0].observation.rawVector).toEqual(seqResultA.observation.rawVector);
    expect(batchResults[0].reward).toBe(seqResultA.reward);
    expect(() => stepBatch([envA1], [actionA, actionB])).toThrow(/length mismatch/);
  });

  test("G1TrainEnv step computes dense rewards and tracks action-caused forward progress", () => {
    const env = new G1TrainEnv({ maxSteps: 50 });
    let obs = env.reset(42);

    const action = new Array(15).fill(0.0);
    action[0] = 0.45 * obs.phaseSin;
    action[3] = -0.35 * obs.phaseSin;
    action[6] = -0.45 * obs.phaseSin;
    action[9] = 0.35 * obs.phaseSin;
    const stepRes = env.step(action);

    expect(stepRes.observation.rawVector.length).toBe(42);
    expect(Number.isFinite(stepRes.reward)).toBe(true);
    expect(stepRes.info.step).toBe(1);
    expect(stepRes.info.gaitDrive).toBeGreaterThanOrEqual(0.0);
    expect(stepRes.done).toBe(false);

    // Step until timeout
    for (let s = 1; s < 50; s++) {
      obs = env.getObservation();
      action[0] = 0.45 * obs.phaseSin;
      action[3] = -0.35 * obs.phaseSin;
      action[6] = -0.45 * obs.phaseSin;
      action[9] = 0.35 * obs.phaseSin;
      const r = env.step(action);
      if (r.done) {
        expect(r.info.terminationReason).toBe("timeout");
        expect(r.info.cumulativeDistanceMeters).toBeGreaterThan(0.0);
        expect(r.info.actuatorWorkJoules).toBeGreaterThan(0.0);
        break;
      }
    }
  });

  test("planted no-action control cannot earn locomotion distance", () => {
    const env = new G1TrainEnv({ maxSteps: 720 });
    env.reset(42);
    let last = env.step(new Array(15).fill(0.0));
    while (!last.done) {
      last = env.step(new Array(15).fill(0.0));
    }

    expect(last.info.cumulativeDistanceMeters).toBe(0.0);
    expect(last.info.forwardSpeedMps).toBe(0.0);
    expect(last.info.gaitDrive).toBe(0.0);
    expect(last.info.actuatorWorkJoules).toBe(0.0);
  });

  test("rejects invalid environment contracts before they can create NaN rollouts", () => {
    expect(() => new G1TrainEnv({ maxSteps: 0 })).toThrow(/maxSteps/);
    expect(() => new G1TrainEnv({ maxSteps: 1.5 })).toThrow(/maxSteps/);
    expect(() => new G1TrainEnv({ dt: 0 })).toThrow(/dt/);
    expect(() => new G1TrainEnv({ dt: Number.NaN })).toThrow(/dt/);
    expect(() => new G1TrainEnv({ targetSpeedMps: -0.1 })).toThrow(/targetSpeedMps/);
    expect(() => new G1TrainEnv({ fallHeightThreshold: -0.1 })).toThrow(/fallHeightThreshold/);
    expect(() => new G1TrainEnv({ fallTiltThresholdRad: 0 })).toThrow(/fallTiltThresholdRad/);
  });

  test("requires reset after a terminal step", () => {
    const env = new G1TrainEnv({ maxSteps: 1 });
    env.reset();
    expect(env.step(new Array(15).fill(0)).done).toBe(true);
    expect(() => env.step(new Array(15).fill(0))).toThrow(/call reset/);
    expect(env.reset().rawVector).toHaveLength(42);
    expect(env.step(new Array(15).fill(0)).done).toBe(true);
  });

  test("phase-opposed leg actions causally diverge from the no-action control", () => {
    const active = new G1TrainEnv({ maxSteps: 180 });
    const idle = new G1TrainEnv({ maxSteps: 180 });
    let activeObs = active.reset(7);
    idle.reset(7);
    let activeResult = active.step(new Array(15).fill(0));
    let idleResult = idle.step(new Array(15).fill(0));

    for (let step = 1; step < 180; step++) {
      const action = new Array(15).fill(0.0);
      action[0] = 0.55 * activeObs.phaseSin;
      action[3] = -0.4 * activeObs.phaseSin;
      action[6] = -0.55 * activeObs.phaseSin;
      action[9] = 0.4 * activeObs.phaseSin;
      activeResult = active.step(action);
      idleResult = idle.step(new Array(15).fill(0));
      activeObs = activeResult.observation;
    }

    expect(activeResult.info.cumulativeDistanceMeters).toBeGreaterThan(0.05);
    expect(idleResult.info.cumulativeDistanceMeters).toBe(0.0);
    expect(activeResult.info.cumulativeDistanceMeters).toBeGreaterThan(
      idleResult.info.cumulativeDistanceMeters,
    );
  });

  test("CmaesHyperparameterOptimizer decodes and optimizes 8-D HPO space across generations", () => {
    const hpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 123);

    // Initial decoded default
    const decoded = hpo.decodeGenotype(new Array(8).fill(0.0));
    expect(decoded.muonLearningRate).toBeGreaterThan(0.0);
    expect(decoded.muonMomentum).toBeGreaterThanOrEqual(0.8);
    expect(decoded.muonMomentum).toBeLessThanOrEqual(0.99);
    expect(decoded.gaeLambda).toBeGreaterThan(0.9);

    // Step 5 outer HPO generations
    let firstFit = Infinity;
    let lastFit = Infinity;

    for (let gen = 0; gen < 5; gen++) {
      const res = hpo.stepGeneration();
      expect(res.generation).toBe(gen + 1);
      expect(res.evaluationsCount).toBe((gen + 1) * 8);
      expect(res.lastBestReceipt).toBeDefined();
      expect(res.lastBestReceipt?.fitness).toBeCloseTo(res.bestFitness, 12);

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

  test("mirrored HPO reports a real candidate score and counts every actual rollout", () => {
    const hpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 12, {
      mirroredSampling: true,
      replicationsPerCandidate: 2,
      baseRolloutSeed: 71,
    });
    // Instrument the real evaluator without replacing its environment or score.
    const instrumented = hpo as unknown as {
      evaluatePoint(genotype: number[]): { fitness: number; rollouts: number };
    };
    const evaluate = instrumented.evaluatePoint.bind(hpo);
    const evaluated: { genotype: number[]; fitness: number; rollouts: number }[] = [];
    instrumented.evaluatePoint = (genotype) => {
      const result = evaluate(genotype);
      evaluated.push({ genotype: [...genotype], ...result });
      return result;
    };
    const result = hpo.stepGeneration();
    const best = evaluated.reduce((a, b) => (a.fitness <= b.fitness ? a : b));
    expect(evaluated.length).toBe(16);
    expect(result.evaluationsCount).toBe(evaluated.reduce((sum, entry) => sum + entry.rollouts, 0));
    expect(result.evaluationsCount).toBe(32);
    expect(result.bestFitness).toBe(best.fitness);
    expect(result.bestHyperparameters).toEqual(hpo.decodeGenotype(best.genotype));
    expect(new Set(evaluated.map((entry) => entry.fitness)).size).toBeGreaterThan(1);
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

  test("all 8 decoded hyperparameters causally intervene on inner training and held-out evaluation (cmaes-za0x.27 / cmaes-za0x.28)", () => {
    const hpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 42);
    const baseGenotype = defaultGenotypeFromSpecs(G1_TRAINING_HYPERPARAMETERS);
    const baselineReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype);

    expect(baselineReceipt.innerUpdates).toBe(3);
    expect(baselineReceipt.innerPolicyWeightDeltaNorm).toBeGreaterThan(0);
    expect(baselineReceipt.innerValueWeightDeltaNorm).toBeGreaterThan(0);
    expect(baselineReceipt.heldOutDistanceMeters).toBeGreaterThan(0);

    // Perturb each of the 8 genotype coordinates individually while holding the other 7 fixed
    for (let dim = 0; dim < 8; dim++) {
      const lowGenotype = [...baseGenotype];
      const highGenotype = [...baseGenotype];
      lowGenotype[dim] = -0.9;
      highGenotype[dim] = 0.9;

      const lowReceipt = hpo.evaluateCandidateWithReceipt(lowGenotype);
      const highReceipt = hpo.evaluateCandidateWithReceipt(highGenotype);

      // Every single hyperparameter must causally alter the inner policy update and held-out return
      expect(lowReceipt.innerPolicyWeightDeltaNorm).not.toBe(
        highReceipt.innerPolicyWeightDeltaNorm,
      );
      expect(lowReceipt.heldOutCanonicalReturn).not.toBe(highReceipt.heldOutCanonicalReturn);
      expect(lowReceipt.fitness).not.toBe(highReceipt.fitness);
    }
  });

  test("zero learning rate freezes policy and value updates; zero valueLossCoef freezes only value baseline", () => {
    const hpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 42);
    const baseGenotype = defaultGenotypeFromSpecs(G1_TRAINING_HYPERPARAMETERS);

    const zeroLrReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype, {
      muonLearningRate: 0.0,
    });
    expect(zeroLrReceipt.innerPolicyWeightDeltaNorm).toBe(0.0);
    expect(zeroLrReceipt.innerValueWeightDeltaNorm).toBe(0.0);

    const zeroValueCoefReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype, {
      valueLossCoef: 0.0,
    });
    expect(zeroValueCoefReceipt.innerValueWeightDeltaNorm).toBe(0.0);
    expect(zeroValueCoefReceipt.innerPolicyWeightDeltaNorm).toBeGreaterThan(0.0);
  });

  test("anti-reward-hacking: inflating candidate reward weights by 1000x cannot inflate held-out canonical fitness", () => {
    const hpo = new CmaesHyperparameterOptimizer(G1_TRAINING_HYPERPARAMETERS, 42);
    const baseGenotype = defaultGenotypeFromSpecs(G1_TRAINING_HYPERPARAMETERS);
    const normalReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype);

    const inflatedReceipt = hpo.evaluateCandidateWithReceipt(baseGenotype, {
      weightProgress: normalReceipt.hyperparameters.weightProgress * 1000,
      weightUpright: normalReceipt.hyperparameters.weightUpright * 1000,
      weightEnergy: normalReceipt.hyperparameters.weightEnergy * 1000,
    });

    // Inner shaped return scales by ~1000x, but held-out canonical return stays bounded by physical environment limits
    expect(inflatedReceipt.innerShapedReturn).toBeGreaterThan(normalReceipt.innerShapedReturn * 500);
    expect(Math.abs(inflatedReceipt.heldOutCanonicalReturn)).toBeLessThan(100.0);
  });
});
