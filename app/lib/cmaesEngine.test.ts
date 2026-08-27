import { describe, expect, test } from "bun:test";
import { BENCHMARKS, CMAESOptimizer } from "./cmaesEngine";
import { CMAESOptimizerND } from "./cmaesEngineND";
import {
  decodeCmaesPacket,
  isCompatibleCmaesKernelVersion,
  wasmRunToNdStates,
  type CmaesVizGeneration,
  type CmaesVizRun
} from "./frankensimCmaes";
import {
  evaluateBridgePhysics,
  evaluateWingPhysics,
  type BridgeParams,
  type WingParams
} from "./frankensimPhysics";
import { evaluateArchFitness } from "./nasObjective";
import {
  buildWingGeometryForRender,
  buildWingRibsForRender
} from "../components/WingViz";

const benchmarkCases = [
  { id: "rosenbrock", start: [-1.6, -1.0] as [number, number], sigma: 0.4, lambda: 16 },
  { id: "rastrigin", start: [3.2, -2.8] as [number, number], sigma: 0.8, lambda: 24 },
  { id: "cigar", start: [2.5, 2.5] as [number, number], sigma: 0.5, lambda: 16 },
  { id: "ackley", start: [-3.2, 3.2] as [number, number], sigma: 0.6, lambda: 20 }
] as const;

describe("shared CMA-ES engines", () => {
  test("uses Hansen's canonical default population size", () => {
    expect(new CMAESOptimizer((x, y) => x * x + y * y).lambda).toBe(6);
    expect(new CMAESOptimizerND((x) => x.reduce((sum, value) => sum + value * value, 0), { dim: 2 }).lambda).toBe(6);
  });

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

  test("ranks reflected phenotypes but adapts their latent genotypes", () => {
    const optimizer = new CMAESOptimizerND((x) => x[0] + x[1], {
      dim: 2,
      initialMean: [0.1, 0.1],
      initialSigma: 1,
      lambda: 10,
      seed: 7,
      bounds: [0, 1],
      repairStrategy: "reflect"
    });

    const state = optimizer.step();
    const expectedGenotypeMean = [0, 1].map((dimension) =>
      state.samples.slice(0, optimizer.mu).reduce(
        (sum, sample, rank) => sum + optimizer.weights[rank] * sample.rawX[dimension],
        0
      )
    );

    expect(state.samples.some((sample) => sample.rawX.some((value, dimension) => value !== sample.x[dimension]))).toBe(true);
    expect(optimizer.mean[0]).toBeCloseTo(expectedGenotypeMean[0], 14);
    expect(optimizer.mean[1]).toBeCloseTo(expectedGenotypeMean[1], 14);
    const reflect = (value: number): number => {
      const phase = ((value % 2) + 2) % 2;
      return phase <= 1 ? phase : 2 - phase;
    };
    expect(state.mean[0]).toBeCloseTo(reflect(expectedGenotypeMean[0]), 14);
    expect(state.mean[1]).toBeCloseTo(reflect(expectedGenotypeMean[1]), 14);
  });

  test("literal clipping keeps adaptation inside the box and reaches an interior optimum", () => {
    const target = 0.2;
    const objective2D = (x: number, y: number) => (x - target) ** 2 + (y - target) ** 2;
    const optimizer2D = new CMAESOptimizer(objective2D, {
      initialMean: [0.5, 0.5],
      initialSigma: 0.8,
      lambda: 10,
      seed: 7,
      bounds: [0, 1],
      repairStrategy: "clip"
    });
    const optimizerND = new CMAESOptimizerND((x) => objective2D(x[0], x[1]), {
      dim: 2,
      initialMean: [0.5, 0.5],
      initialSigma: 0.8,
      lambda: 10,
      seed: 7,
      bounds: [0, 1],
      repairStrategy: "clip"
    });

    let state2D = optimizer2D.step();
    let stateND = optimizerND.step();
    for (let generation = 1; generation < 120; generation++) {
      state2D = optimizer2D.step();
      stateND = optimizerND.step();
    }

    expect(state2D.bestFitness).toBeLessThan(1e-12);
    expect(stateND.bestFitness).toBeLessThan(1e-12);
    expect(optimizer2D.mean.every((value) => value >= 0 && value <= 1)).toBe(true);
    expect(optimizerND.mean.every((value) => value >= 0 && value <= 1)).toBe(true);
  });

  test("the public covariance snapshot cannot desynchronize the cached eigensystem", () => {
    const objective = (x: number[]) => x.reduce((sum, value) => sum + value * value, 0);
    const options = { dim: 4, initialMean: [0.8, 0.6, 0.4, 0.2], initialSigma: 0.3, seed: 99 };
    const control = new CMAESOptimizerND(objective, options);
    const probed = new CMAESOptimizerND(objective, options);

    control.step();
    probed.step();
    const covarianceSnapshot = probed.C;
    covarianceSnapshot[0][0] = 1e12;
    covarianceSnapshot[0][1] = -1e12;

    const controlState = control.step();
    const probedState = probed.step();
    expect(probedState.mean).toEqual(controlState.mean);
    expect(probedState.covariance).toEqual(controlState.covariance);
    expect(probedState.sigma).toBe(controlState.sigma);
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

  test("every advertised wing geometry coordinate changes the actual Three.js render data", () => {
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
    const variants: WingParams[] = [
      { ...baseline, aspectRatio: 14 },
      { ...baseline, sweepAngle: 38 },
      { ...baseline, thicknessRatio: 0.18 },
      { ...baseline, maxCamber: 0.06 },
      { ...baseline, camberPosition: 0.56 },
      { ...baseline, taperRatio: 0.82 },
      { ...baseline, airfoilFamily: "Laminar Flow Low-Re" }
    ];

    const baselineGeometry = buildWingGeometryForRender(baseline);
    const baselinePositions = Array.from(baselineGeometry.attributes.position.array);
    baselineGeometry.dispose();

    for (const variant of variants) {
      const geometry = buildWingGeometryForRender(variant);
      expect(Array.from(geometry.attributes.position.array)).not.toEqual(baselinePositions);
      geometry.dispose();
    }

    const baselineRibs = buildWingRibsForRender(baseline);
    expect(buildWingRibsForRender({ ...baseline, internalRibCount: 34 })).toHaveLength(34);
    expect(buildWingRibsForRender({ ...baseline, aspectRatio: 14 })).not.toEqual(baselineRibs);
    expect(buildWingRibsForRender({ ...baseline, sweepAngle: 38 })).not.toEqual(baselineRibs);
    expect(buildWingRibsForRender({ ...baseline, taperRatio: 0.82 })).not.toEqual(baselineRibs);
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

function generation(g: number, sf: number[], sx: number[], bestF = Math.min(...sf)): CmaesVizGeneration {
  return {
    g,
    mean: [0, 0, 0],
    sigma: 1,
    eigvals: [1, 1, 1],
    eigvecs: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    cond: 1,
    best_f: bestF,
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

test("WASM snapshots rank ask-order samples without leaking final coordinates into earlier frames", () => {
  const run: CmaesVizRun = {
    kernel: "test",
    dim: 3,
    landscape: 0,
    stop_reason: "budget",
    best_f: 0.5,
    best_x: [99, 99, 99],
    total_evals: 8,
    generations: [
      generation(1, [9, 1, 5, 3], [9, 0, 0, 1, 0, 0, 5, 0, 0, 3, 0, 0]),
      generation(2, [4, 6, 7, 8], [4, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 0], 0.5)
    ],
    pca_basis: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    pca_center: [0, 0, 0],
    pca_pool_eigvals: [1, 1, 1]
  };

  const states = wasmRunToNdStates(run);
  expect(states[0].samples.map((sample) => sample.rank)).toEqual([3, 0, 2, 1]);
  expect(states[0].samples.map((sample) => sample.isElite)).toEqual([false, true, false, true]);
  expect(states[0].bestX).toEqual([1, 0, 0]);
  expect(states[1].bestX).toEqual(Array.from(run.best_x));
  expect(states[1].bestFitness).toBe(0.5);
  expect(states[0].bestX).not.toEqual(run.best_x);
});

test("WASM snapshot spectra use the same largest-first contract as the TypeScript engine", () => {
  const snapshot = generation(1, [1, 2], [1, 0, 0, 2, 0, 0]);
  snapshot.eigvals = [1, 2, 4];
  snapshot.proj_eigvals = [0, 2, 4];
  const run: CmaesVizRun = {
    kernel: "test",
    dim: 3,
    landscape: 0,
    stop_reason: "budget",
    best_f: 1,
    best_x: [1, 0, 0],
    total_evals: 2,
    generations: [snapshot],
    pca_basis: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    pca_center: [0, 0, 0],
    pca_pool_eigvals: [1, 2, 4]
  };

  const [state] = wasmRunToNdStates(run);
  expect(state.eigenvalues).toEqual([4, 2, 1]);
  expect(state.covariance).toEqual([[1, 0, 0], [0, 2, 0], [0, 0, 4]]);
  expect(state.conditionNumber).toBe(4);
  expect(state.phaseSpace3D.eigenvalues).toEqual([4, 2, 0]);
  expect(state.phaseSpace3D.conditionNumber).toBe(Infinity);

  snapshot.proj_eigvals = [1e-20, 2, 4];
  const [illConditionedState] = wasmRunToNdStates(run);
  expect(illConditionedState.phaseSpace3D.conditionNumber).toBe(4e20);
});

test("rejects reference-breaking kernels and accepts the audited release", () => {
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.2.0")).toBe(false);
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.2.1")).toBe(false);
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.3.0")).toBe(false);
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.4.0")).toBe(true);
  expect(isCompatibleCmaesKernelVersion(null)).toBe(false);
});

test("audited packed WASM state matches the TypeScript reference", async () => {
  const generatedPackage = process.env.FS_CMAES_TEST_PACKAGE;
  const wasm = await import(
    generatedPackage
      ? `${generatedPackage}/fs_cmaes_viz_wasm.js`
      : "../../public/wasm/fs-cmaes/fs_cmaes_viz_wasm.js"
  );
  const wasmBytes = await Bun.file(
    generatedPackage
      ? `${generatedPackage}/fs_cmaes_viz_wasm_bg.wasm`
      : new URL("../../public/wasm/fs-cmaes/fs_cmaes_viz_wasm_bg.wasm", import.meta.url)
  ).arrayBuffer();
  await wasm.default({ module_or_path: wasmBytes });

  expect(wasm.cmaes_viz_kernel_version()).toBe("fs-cmaes-viz-wasm 0.4.0");

  const initialMean = [1.5, -1, 2, 0.5, -0.5];
  const rosenbrock = (x: number[]): number => {
    let sum = 0;
    for (let i = 0; i < x.length - 1; i++) {
      sum += 100 * (x[i + 1] - x[i] * x[i]) ** 2 + (1 - x[i]) ** 2;
    }
    return sum;
  };
  const tsState = new CMAESOptimizerND(rosenbrock, {
    dim: 5,
    initialMean,
    initialSigma: 0.3,
    lambda: 16,
    activeCMA: true,
    seed: 1337,
    bounds: [-1e9, 1e9],
    repairStrategy: "none"
  }).step();
  const packet = wasm.cmaes_viz_run(
    5,
    initialMean[0],
    initialMean[1],
    initialMean[2],
    initialMean[3],
    initialMean[4],
    0,
    0.3,
    16,
    true,
    1337n,
    1,
    1,
    0,
    false,
    -2,
    2,
    NaN
  );
  expect(packet).toBeInstanceOf(Float64Array);
  const decoded = decodeCmaesPacket(packet);
  expect("refusal" in decoded).toBe(false);
  if (!("ok" in decoded)) throw new Error(`WASM refusal: ${decoded.refusal.code}`);
  const wasmState = decoded.ok.generations[0];
  expect(wasmState).toBeDefined();
  if (!wasmState) throw new Error("WASM returned no first-generation snapshot");

  const maxAbsDifference = (left: ArrayLike<number>, right: ArrayLike<number>): number => {
    let maximum = 0;
    for (let index = 0; index < left.length; index++) maximum = Math.max(maximum, Math.abs(left[index] - right[index]));
    return maximum;
  };
  const tsEigenvaluesAscending = [...tsState.eigenvalues].reverse();

  expect(maxAbsDifference(wasmState.sz, tsState.samples.flatMap((sample) => sample.z))).toBeLessThan(2e-15);
  expect(maxAbsDifference(wasmState.sx, tsState.samples.flatMap((sample) => sample.x))).toBeLessThan(2e-15);
  expect(maxAbsDifference(wasmState.mean, tsState.mean)).toBeLessThan(2e-15);
  expect(maxAbsDifference(wasmState.eigvals, tsEigenvaluesAscending)).toBeLessThan(2e-15);
  expect(Math.abs(wasmState.sigma - tsState.sigma)).toBeLessThan(2e-15);
  expect(Math.abs(wasmState.best_f - tsState.bestFitness)).toBeLessThan(2e-12);
  expect(wasmState.cond).toBeCloseTo(tsState.conditionNumber, 12);

  const refusalPacket = wasm.cmaes_viz_run(
    1, 0, 0, 0, 0, 0, 0, 0.3, 16, true, 1337n, 1, 1, 0, false, -2, 2, NaN
  );
  const refusal = decodeCmaesPacket(refusalPacket);
  expect("refusal" in refusal && refusal.refusal.code).toBe("dim-out-of-range");
  expect("refusal" in refusal && refusal.refusal.ranked_repairs).toEqual(["set dim within 2..=6"]);

  const wrongMagic = packet.slice();
  wrongMagic[0] = 0;
  expect(() => decodeCmaesPacket(wrongMagic)).toThrow("magic");
  const wrongStride = packet.slice();
  wrongStride[11] += 1;
  expect(() => decodeCmaesPacket(wrongStride)).toThrow("generation_stride");
  expect(() => decodeCmaesPacket(packet.slice(0, packet.length - 1))).toThrow("total_words");
});
