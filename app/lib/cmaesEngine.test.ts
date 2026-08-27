import { describe, expect, test } from "bun:test";
import { BENCHMARKS, CMAESOptimizer } from "./cmaesEngine";
import { CMAESOptimizerND } from "./cmaesEngineND";
import { wasmRunToNdStates, type CmaesVizGeneration, type CmaesVizRun } from "./frankensimCmaes";
import {
  evaluateBridgePhysics,
  evaluateWingPhysics,
  type BridgeParams,
  type WingParams
} from "./frankensimPhysics";
import { evaluateArchFitness } from "./nasObjective";

const benchmarkCases = [
  { id: "rosenbrock", start: [-1.6, -1.0] as [number, number], sigma: 0.4, lambda: 16 },
  { id: "rastrigin", start: [3.2, -2.8] as [number, number], sigma: 0.8, lambda: 24 },
  { id: "cigar", start: [2.5, 2.5] as [number, number], sigma: 0.5, lambda: 16 },
  { id: "ackley", start: [-3.2, 3.2] as [number, number], sigma: 0.6, lambda: 20 }
] as const;

describe("shared CMA-ES engines", () => {
  for (const preset of benchmarkCases) {
    test(`converges on the curated ${preset.id} preset`, () => {
      const benchmark = BENCHMARKS.find((candidate) => candidate.id === preset.id)!;
      const optimizer = new CMAESOptimizer(benchmark.eval, {
        initialMean: preset.start,
        initialSigma: preset.sigma,
        lambda: preset.lambda,
        activeCMA: true,
        bounds: benchmark.domain
      });

      let state = optimizer.step();
      for (let generation = 1; generation < 60; generation++) state = optimizer.step();

      expect(state.bestFitness).toBeLessThan(1e-6);
      expect(state.samples.every((sample) => sample.x.every((value) => value >= benchmark.domain[0] && value <= benchmark.domain[1]))).toBe(true);
      expect(state.eigenvalues.every((value) => Number.isFinite(value) && value > 0)).toBe(true);
    });
  }

  test("is invariant to a strictly increasing objective transform", () => {
    const objective = (x: number, y: number) => x * x + 20 * y * y;
    const options = { initialMean: [1.4, -1.1], initialSigma: 0.7, lambda: 14, seed: 919 };
    const raw = new CMAESOptimizer(objective, options);
    const transformed = new CMAESOptimizer((x, y) => 7 + Math.log1p(objective(x, y)), options);

    for (let generation = 0; generation < 25; generation++) {
      const rawState = raw.step();
      const transformedState = transformed.step();
      expect(transformedState.mean).toEqual(rawState.mean);
      expect(transformedState.covariance).toEqual(rawState.covariance);
      expect(transformedState.sigma).toBe(rawState.sigma);
      expect(transformedState.bestX).toEqual(rawState.bestX);
    }
  });

  test("converges in eight dimensions while keeping covariance positive definite", () => {
    const optimizer = new CMAESOptimizerND(
      (x) => x.reduce((sum, value) => sum + value * value, 0),
      {
        dim: 8,
        initialMean: new Array(8).fill(0.75),
        initialSigma: 0.3,
        lambda: 20,
        seed: 4242,
        bounds: [-2, 2]
      }
    );

    let state = optimizer.step();
    for (let generation = 1; generation < 100; generation++) state = optimizer.step();

    expect(state.bestFitness).toBeLessThan(1e-6);
    expect(state.eigenvalues.every((value) => Number.isFinite(value) && value > 0)).toBe(true);
    expect(state.covariance.every((row, i) => row.every((value, j) => Math.abs(value - state.covariance[j][i]) < 1e-12))).toBe(true);
  });
});

describe("advertised optimization dimensions", () => {
  test("every wing coordinate changes its analytic objective", () => {
    const baseline: WingParams = {
      aspectRatio: 10.6,
      sweepAngle: 25,
      thicknessRatio: 0.12,
      maxCamber: 0.036,
      camberPosition: 0.4,
      taperRatio: 0.56,
      airfoilFamily: "Supercritical SC(2)",
      internalRibCount: 22
    };
    const baselineCost = evaluateWingPhysics(baseline, 0.78).costScore;
    const variants: WingParams[] = [
      { ...baseline, aspectRatio: 14 },
      { ...baseline, sweepAngle: 38 },
      { ...baseline, thicknessRatio: 0.18 },
      { ...baseline, maxCamber: 0.06 },
      { ...baseline, camberPosition: 0.56 },
      { ...baseline, taperRatio: 0.82 },
      { ...baseline, airfoilFamily: "Laminar Flow Low-Re" },
      { ...baseline, internalRibCount: 34 }
    ];

    for (const variant of variants) {
      expect(evaluateWingPhysics(variant, 0.78).costScore).not.toBe(baselineCost);
    }
  });

  test("bridge damping changes flutter compliance and objective", () => {
    const baseline: BridgeParams = {
      spanLength: 180,
      cableSag: 18,
      deckStiffness: 0.45,
      trussTopology: "Warren",
      materialGrade: "A36 Mild Steel",
      suspenderCount: 24,
      towerAspect: 0.35,
      vibrationDamping: 0.01
    };
    const lowDamping = evaluateBridgePhysics(baseline, 0);
    const highDamping = evaluateBridgePhysics({ ...baseline, vibrationDamping: 0.15 }, 0);

    expect(highDamping.flutterCriticalSpeedKmh).toBeGreaterThan(lowDamping.flutterCriticalSpeedKmh);
    expect(highDamping.costScore).toBeLessThan(lowDamping.costScore);
    expect(lowDamping.isCompliant).toBe(false);
    expect(highDamping.isCompliant).toBe(true);
  });

  test("transformer head count participates in the scalar objective", () => {
    const fewHeads = evaluateArchFitness([0.5, 0.5, 0, 0.5, 0.2]);
    const manyHeads = evaluateArchFitness([0.5, 0.5, 1, 0.5, 0.2]);
    expect(manyHeads).toBeGreaterThan(fewHeads);
  });
});

function generation(g: number, sf: number[], sx: number[]): CmaesVizGeneration {
  return {
    g,
    mean: [0, 0, 0],
    sigma: 1,
    eigvals: [1, 1, 1],
    eigvecs: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    cond: 1,
    best_f: Math.min(...sf),
    evals: g * sf.length,
    proj_mean: [0, 0, 0],
    proj_eigvals: [1, 1, 1],
    proj_eigvecs: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    sx,
    sz: new Array(sx.length).fill(0),
    sf,
    se: [1, 1, 0, 0],
    p_sigma: [0, 0, 0],
    p_c: [0, 0, 0]
  };
}

test("WASM snapshots rank ask-order samples and retain only historical information", () => {
  const run: CmaesVizRun = {
    kernel: "test",
    dim: 3,
    landscape: 0,
    stop_reason: "budget",
    best_f: 1,
    best_x: [99, 99, 99],
    total_evals: 8,
    generations: [
      generation(1, [9, 1, 5, 3], [9, 0, 0, 1, 0, 0, 5, 0, 0, 3, 0, 0]),
      generation(2, [4, 6, 7, 8], [4, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 0])
    ],
    pca_basis: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    pca_center: [0, 0, 0],
    pca_pool_eigvals: [1, 1, 1]
  };

  const states = wasmRunToNdStates(run);
  expect(states[0].samples.map((sample) => sample.rank)).toEqual([3, 0, 2, 1]);
  expect(states[0].samples.map((sample) => sample.isElite)).toEqual([false, true, false, true]);
  expect(states[0].bestX).toEqual([1, 0, 0]);
  expect(states[1].bestX).toEqual([1, 0, 0]);
  expect(states[0].bestX).not.toEqual(run.best_x);
});
