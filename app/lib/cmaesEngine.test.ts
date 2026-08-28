import { describe, expect, test } from "bun:test";
import { BENCHMARKS, CMAESOptimizer } from "./cmaesEngine";
import { CMAESOptimizerND } from "./cmaesEngineND";
import {
  CMAES_VISUALIZATION_F_TARGET,
  decodeCmaesPacket,
  evaluateCmaesVisualizationLandscape,
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

test("rejects every kernel that has not passed complete-trajectory parity", () => {
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.2.0")).toBe(false);
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.2.1")).toBe(false);
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.3.0")).toBe(false);
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.4.0")).toBe(false);
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.4.1")).toBe(true);
  expect(isCompatibleCmaesKernelVersion("fs-cmaes-viz-wasm 0.5.0")).toBe(false);
  expect(isCompatibleCmaesKernelVersion(null)).toBe(false);
});

type TrajectoryCase = {
  name: string;
  landscape: number;
  dim: number;
  initialMean: number[];
  sigma: number;
  lambda: number;
  active: boolean;
  seed: number;
  generations: number;
  noise: number;
  bounded: boolean;
};

const trajectoryCases: TrajectoryCase[] = [
  { name: "passive sphere 2D", landscape: 0, dim: 2, initialMean: [1.5, -1], sigma: 0.3, lambda: 6, active: false, seed: 41, generations: 100, noise: 0, bounded: false },
  { name: "active sphere 3D", landscape: 0, dim: 3, initialMean: [1.5, -1, 2], sigma: 0.4, lambda: 10, active: true, seed: 77, generations: 100, noise: 0, bounded: false },
  { name: "Rosenbrock default", landscape: 1, dim: 5, initialMean: [1.5, -1, 2, 0.5, -0.5], sigma: 0.3, lambda: 16, active: true, seed: 1337, generations: 120, noise: 0, bounded: false },
  { name: "bounded Rosenbrock", landscape: 1, dim: 4, initialMean: [1.8, -1.8, 1.6, -1.6], sigma: 0.65, lambda: 20, active: true, seed: 2027, generations: 100, noise: 0, bounded: true },
  { name: "Discus 6D", landscape: 2, dim: 6, initialMean: [1.5, -1, 2, 0.5, -0.5, 1], sigma: 0.4, lambda: 24, active: true, seed: 4242, generations: 120, noise: 0, bounded: false },
  { name: "noisy Rastrigin", landscape: 3, dim: 4, initialMean: [3, -2.5, 2, -3], sigma: 0.8, lambda: 32, active: true, seed: 919, generations: 100, noise: 0.05, bounded: false },
  { name: "bounded passive noisy Rastrigin", landscape: 3, dim: 6, initialMean: [1.8, -1.7, 1.6, -1.5, 1.4, -1.3], sigma: 0.7, lambda: 48, active: false, seed: 98765, generations: 80, noise: 0.1, bounded: true },
  { name: "ill-conditioned ellipsoid 2D", landscape: 4, dim: 2, initialMean: [1.5, -1], sigma: 0.3, lambda: 12, active: true, seed: 808, generations: 100, noise: 0, bounded: false },
  { name: "ill-conditioned ellipsoid 6D maximum population", landscape: 4, dim: 6, initialMean: [1.5, -1, 2, 0.5, -0.5, 1], sigma: 0.4, lambda: 48, active: true, seed: 65537, generations: 120, noise: 0, bounded: false }
];

function maximumDifference(left: ArrayLike<number>, right: ArrayLike<number>, scaled: boolean): number {
  if (left.length !== right.length) return Infinity;
  let maximum = 0;
  for (let index = 0; index < left.length; index++) {
    const absolute = Math.abs(left[index] - right[index]);
    const difference = scaled
      ? absolute / (1 + Math.max(Math.abs(left[index]), Math.abs(right[index])))
      : absolute;
    maximum = Math.max(maximum, difference);
  }
  return maximum;
}

function requireDifferenceWithin(
  label: string,
  left: ArrayLike<number>,
  right: ArrayLike<number>,
  tolerance: number,
  scaled = true
): void {
  const difference = maximumDifference(left, right, scaled);
  if (!(difference <= tolerance)) {
    throw new Error(`${label}: maximum ${scaled ? "scale-normalized" : "absolute"} difference ${difference} exceeds ${tolerance}`);
  }
}

test("packed WASM matches complete TypeScript trajectories across the visualization matrix", async () => {
  const generatedPackage = process.env.FS_CMAES_TEST_PACKAGE;
  const wasm = await import(
    generatedPackage
      ? `${generatedPackage}/fs_cmaes_viz_wasm.js`
      : "../../public/wasm/fs-cmaes/v041/fs_cmaes_viz_wasm.js"
  );
  const wasmBytes = await Bun.file(
    generatedPackage
      ? `${generatedPackage}/fs_cmaes_viz_wasm_bg.wasm`
      : new URL("../../public/wasm/fs-cmaes/v041/fs_cmaes_viz_wasm_bg.wasm", import.meta.url)
  ).arrayBuffer();
  await wasm.default({ module_or_path: wasmBytes });

  expect(wasm.cmaes_viz_kernel_version()).toBe("fs-cmaes-viz-wasm 0.4.1");

  let comparedGenerations = 0;
  const stopReasons = new Set<string>();
  let representativePacket: Float64Array | null = null;

  for (const scenario of trajectoryCases) {
    const optimizer = new CMAESOptimizerND(
      (x) => evaluateCmaesVisualizationLandscape(scenario.landscape, x),
      {
        dim: scenario.dim,
        initialMean: scenario.initialMean,
        initialSigma: scenario.sigma,
        lambda: scenario.lambda,
        activeCMA: scenario.active,
        seed: scenario.seed,
        noiseLevel: scenario.noise,
        bounds: scenario.bounded ? [-2, 2] : [-1e9, 1e9],
        repairStrategy: scenario.bounded ? "reflect" : "none"
      }
    );
    const tsStates = [];
    for (let generationIndex = 0; generationIndex < scenario.generations; generationIndex++) {
      const state = optimizer.step();
      tsStates.push(state);
      if (state.bestFitness <= CMAES_VISUALIZATION_F_TARGET) break;
    }

    const initial = Array.from({ length: 6 }, (_, index) => scenario.initialMean[index] ?? 0);
    const packet = wasm.cmaes_viz_run(
      scenario.dim,
      initial[0], initial[1], initial[2], initial[3], initial[4], initial[5],
      scenario.sigma,
      scenario.lambda,
      scenario.active,
      BigInt(scenario.seed >>> 0),
      scenario.generations,
      scenario.landscape,
      scenario.noise,
      scenario.bounded,
      -2,
      2,
      CMAES_VISUALIZATION_F_TARGET
    );
    expect(packet).toBeInstanceOf(Float64Array);
    representativePacket ??= packet;
    const decoded = decodeCmaesPacket(packet);
    if (!("ok" in decoded)) throw new Error(`${scenario.name}: WASM refusal ${decoded.refusal.code}`);
    const run = decoded.ok;
    const wasmStates = wasmRunToNdStates(run);
    const finalTsState = tsStates.at(-1);
    if (!finalTsState) throw new Error(`${scenario.name}: TypeScript produced no generation`);
    const expectedStopReason = finalTsState.bestFitness <= CMAES_VISUALIZATION_F_TARGET
      ? "target-reached"
      : "generations-exhausted";

    expect(run.generations.length).toBe(tsStates.length);
    expect(run.total_evals).toBe(tsStates.length * scenario.lambda);
    expect(run.stop_reason).toBe(expectedStopReason);
    stopReasons.add(run.stop_reason);
    comparedGenerations += run.generations.length;

    for (let generationIndex = 0; generationIndex < tsStates.length; generationIndex++) {
      const label = `${scenario.name}, generation ${generationIndex + 1}`;
      const wasmGeneration = run.generations[generationIndex];
      const wasmState = wasmStates[generationIndex];
      const tsState = tsStates[generationIndex];
      requireDifferenceWithin(`${label} ranked z`, wasmGeneration.sz, tsState.samples.flatMap((sample) => sample.z), 2e-12, false);
      requireDifferenceWithin(`${label} samples`, wasmGeneration.sx, tsState.samples.flatMap((sample) => sample.x), 2e-8);
      requireDifferenceWithin(`${label} ranked fitness`, wasmGeneration.sf, tsState.samples.map((sample) => sample.fitness), 2e-8);
      requireDifferenceWithin(`${label} mean`, wasmGeneration.mean, tsState.mean, 2e-8);
      requireDifferenceWithin(`${label} eigenvalues`, wasmGeneration.eigvals, [...tsState.eigenvalues].reverse(), 2e-8);
      requireDifferenceWithin(`${label} covariance`, wasmState.covariance.flat(), tsState.covariance.flat(), 2e-8);
      requireDifferenceWithin(`${label} p_sigma`, wasmGeneration.p_sigma, tsState.pSigma, 2e-8);
      requireDifferenceWithin(`${label} p_c`, wasmGeneration.p_c, tsState.pC, 2e-8);
      requireDifferenceWithin(`${label} sigma`, [wasmGeneration.sigma], [tsState.sigma], 2e-8);
      requireDifferenceWithin(`${label} best fitness`, [wasmGeneration.best_f], [tsState.bestFitness], 2e-8);
    }
    requireDifferenceWithin(`${scenario.name} final best x`, run.best_x, finalTsState.bestX, 2e-8);
  }

  expect(comparedGenerations).toBeGreaterThanOrEqual(500);
  expect(stopReasons).toEqual(new Set(["generations-exhausted", "target-reached"]));

  if (!representativePacket) throw new Error("trajectory matrix produced no packet");

  const refusalPacket = wasm.cmaes_viz_run(
    1, 0, 0, 0, 0, 0, 0, 0.3, 16, true, 1337n, 1, 1, 0, false, -2, 2, NaN
  );
  const refusal = decodeCmaesPacket(refusalPacket);
  expect("refusal" in refusal && refusal.refusal.code).toBe("dim-out-of-range");
  expect("refusal" in refusal && refusal.refusal.ranked_repairs).toEqual(["set dim within 2..=6"]);

  const wrongMagic = representativePacket.slice();
  wrongMagic[0] = 0;
  expect(() => decodeCmaesPacket(wrongMagic)).toThrow("magic");
  const wrongStride = representativePacket.slice();
  wrongStride[11] += 1;
  expect(() => decodeCmaesPacket(wrongStride)).toThrow("generation_stride");
  expect(() => decodeCmaesPacket(representativePacket.slice(0, representativePacket.length - 1))).toThrow("total_words");
});
