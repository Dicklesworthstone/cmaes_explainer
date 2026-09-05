import * as THREE from "three";
import { describe, expect, test } from "bun:test";
import {
  BENCHMARKS,
  CMAESOptimizer,
  DEFAULT_RANDOM_SEARCH_SEED,
  createMulberry32,
  runRandomSearch,
} from "./cmaesEngine";
import { CMAESOptimizerND } from "./cmaesEngineND";
import ownerArtifactManifest from "../../public/wasm/fs-cmaes/v0622/manifest.json";
import {
  CMAES_VISUALIZATION_F_TARGET,
  DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
  DEFAULT_G1_WALKING_CONFIG,
  buildG1Config,
  buildCmaFamilyConfig,
  decodeCmaFamilyAsk,
  decodeCmaFamilySnapshot,
  decodeCmaesPacket,
  decodeG1Admission,
  decodeG1Evaluation,
  decodeG1Population,
  decodeG1Trace,
  decodeHouseholdManipulationAdmission,
  decodeHouseholdManipulationEvaluation,
  decodeHouseholdManipulationTrace,
  evaluateCmaesVisualizationLandscape,
  isCompatibleCmaesKernelVersion,
  wasmRunToNdStates,
  verifyOwnerArtifacts,
  verifyOwnerRuntimeIdentity,
  type CmaesVizGeneration,
  type CmaesVizRun,
  type OwnerArtifactManifest,
} from "./frankensimCmaes";
import { RoboticsEvaluationPool } from "./roboticsEvaluationPool";
import { resolveRenderedGripperContactGeometry } from "./armContactPhysics";
import {
  evaluateBridgePhysics,
  evaluateWingPhysics,
  type BridgeParams,
  type WingParams,
} from "./frankensimPhysics";
import { evaluateArchFitness } from "./nasObjective";
import {
  buildWingGeometryForRender,
  buildWingRibsForRender,
} from "../components/WingViz";
import { buildBookshelf } from "./houseFurniture";

const benchmarkCases = [
  {
    id: "rosenbrock",
    start: [-1.6, -1.0] as [number, number],
    sigma: 0.4,
    lambda: 16,
  },
  {
    id: "rastrigin",
    start: [3.2, -2.8] as [number, number],
    sigma: 0.8,
    lambda: 24,
  },
  {
    id: "cigar",
    start: [2.5, 2.5] as [number, number],
    sigma: 0.5,
    lambda: 16,
  },
  {
    id: "ackley",
    start: [-3.2, 3.2] as [number, number],
    sigma: 0.6,
    lambda: 20,
  },
] as const;

describe("shared CMA-ES engines", () => {
  test("uses Hansen's canonical default population size", () => {
    expect(new CMAESOptimizer((x, y) => x * x + y * y).lambda).toBe(6);
    expect(
      new CMAESOptimizerND(
        (x) => x.reduce((sum, value) => sum + value * value, 0),
        { dim: 2 },
      ).lambda,
    ).toBe(6);
  });

  for (const preset of benchmarkCases) {
    test(`converges on the curated ${preset.id} preset`, () => {
      const benchmark = BENCHMARKS.find(
        (candidate) => candidate.id === preset.id,
      )!;
      const optimizer = new CMAESOptimizer(benchmark.eval, {
        initialMean: preset.start,
        initialSigma: preset.sigma,
        lambda: preset.lambda,
        activeCMA: true,
        bounds: benchmark.domain,
      });

      let state = optimizer.step();
      for (let generation = 1; generation < 60; generation++)
        state = optimizer.step();

      expect(state.bestFitness).toBeLessThan(1e-6);
      expect(
        state.samples.every((sample) =>
          sample.x.every(
            (value) =>
              value >= benchmark.domain[0] && value <= benchmark.domain[1],
          ),
        ),
      ).toBe(true);
      expect(
        state.eigenvalues.every((value) => Number.isFinite(value) && value > 0),
      ).toBe(true);
    });
  }

  test("is invariant to a strictly increasing objective transform", () => {
    const objective = (x: number, y: number) => x * x + 20 * y * y;
    const options = {
      initialMean: [1.4, -1.1],
      initialSigma: 0.7,
      lambda: 14,
      seed: 919,
    };
    const raw = new CMAESOptimizer(objective, options);
    const transformed = new CMAESOptimizer(
      (x, y) => 7 + Math.log1p(objective(x, y)),
      options,
    );

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
        bounds: [-2, 2],
      },
    );

    let state = optimizer.step();
    for (let generation = 1; generation < 100; generation++)
      state = optimizer.step();

    expect(state.bestFitness).toBeLessThan(1e-6);
    expect(
      state.eigenvalues.every((value) => Number.isFinite(value) && value > 0),
    ).toBe(true);
    expect(
      state.covariance.every((row, i) =>
        row.every(
          (value, j) => Math.abs(value - state.covariance[j][i]) < 1e-12,
        ),
      ),
    ).toBe(true);
  });

  test("ranks reflected phenotypes but adapts their latent genotypes", () => {
    const optimizer = new CMAESOptimizerND((x) => x[0] + x[1], {
      dim: 2,
      initialMean: [0.1, 0.1],
      initialSigma: 1,
      lambda: 10,
      seed: 7,
      bounds: [0, 1],
      repairStrategy: "reflect",
    });

    const state = optimizer.step();
    const expectedGenotypeMean = [0, 1].map((dimension) =>
      state.samples
        .slice(0, optimizer.mu)
        .reduce(
          (sum, sample, rank) =>
            sum + optimizer.weights[rank] * sample.rawX[dimension],
          0,
        ),
    );

    expect(
      state.samples.some((sample) =>
        sample.rawX.some((value, dimension) => value !== sample.x[dimension]),
      ),
    ).toBe(true);
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
    const objective2D = (x: number, y: number) =>
      (x - target) ** 2 + (y - target) ** 2;
    const optimizer2D = new CMAESOptimizer(objective2D, {
      initialMean: [0.5, 0.5],
      initialSigma: 0.8,
      lambda: 10,
      seed: 7,
      bounds: [0, 1],
      repairStrategy: "clip",
    });
    const optimizerND = new CMAESOptimizerND((x) => objective2D(x[0], x[1]), {
      dim: 2,
      initialMean: [0.5, 0.5],
      initialSigma: 0.8,
      lambda: 10,
      seed: 7,
      bounds: [0, 1],
      repairStrategy: "clip",
    });

    let state2D = optimizer2D.step();
    let stateND = optimizerND.step();
    for (let generation = 1; generation < 120; generation++) {
      state2D = optimizer2D.step();
      stateND = optimizerND.step();
    }

    expect(state2D.bestFitness).toBeLessThan(1e-12);
    expect(stateND.bestFitness).toBeLessThan(1e-12);
    expect(optimizer2D.mean.every((value) => value >= 0 && value <= 1)).toBe(
      true,
    );
    expect(optimizerND.mean.every((value) => value >= 0 && value <= 1)).toBe(
      true,
    );
  });

  test("the public covariance snapshot cannot desynchronize the cached eigensystem", () => {
    const objective = (x: number[]) =>
      x.reduce((sum, value) => sum + value * value, 0);
    const options = {
      dim: 4,
      initialMean: [0.8, 0.6, 0.4, 0.2],
      initialSigma: 0.3,
      seed: 99,
    };
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

describe("deterministic baselines and seeded streams", () => {
  // cmaes-mky: the explanatory visualizations must be replayable so a
  // given user action sequence always shows the same scatter, regardless of
  // session or wall-clock context. The tests below lock in the exact
  // trajectory of the seeded random sources and the LCG that the
  // CmaesInternalsLab "randomize start" button reuses.
  test("runRandomSearch replays byte-for-byte under the default seed", () => {
    const sphere = (x: number, y: number) => x * x + y * y;
    const domain: [number, number] = [-3, 3] as const;
    const reference = runRandomSearch(sphere, domain, 96);
    const replay = runRandomSearch(sphere, domain, 96);
    expect(replay).toEqual(reference);
    // The default seed must be the public, replayable one exported from
    // cmaesEngine so the WasmDemo panel and any other consumer share a
    // single source of truth.
    const explicit = runRandomSearch(sphere, domain, 96, DEFAULT_RANDOM_SEARCH_SEED);
    expect(explicit).toEqual(reference);
  });

  test("runRandomSearch is seed-sensitive: different seeds diverge", () => {
    const sphere = (x: number, y: number) => x * x + y * y;
    const domain: [number, number] = [-3, 3] as const;
    const a = runRandomSearch(sphere, domain, 32, 0xa11ce);
    const b = runRandomSearch(sphere, domain, 32, 0xb0b);
    // At least one point in the trajectory must differ; if this regresses
    // the seed plumbing was lost and the explainer is no longer honest.
    expect(a).not.toEqual(b);
  });

  test("runRandomSearch still bounds-checks the seed parameter", () => {
    const sphere = (x: number, y: number) => x * x + y * y;
    expect(() => runRandomSearch(sphere, [-1, 1], 8, Number.NaN)).toThrow(
      /seed/,
    );
  });

  test("createMulberry32 streams are bit-identical across two constructions", () => {
    const samples = 512;
    const a = createMulberry32(0x5eed_cafe);
    const b = createMulberry32(0x5eed_cafe);
    for (let i = 0; i < samples; i++) {
      expect(a()).toBe(b());
    }
  });

  test("CmaesInternalsLab's LCG + mulberry32 start point is reproducible", () => {
    // Mirrors the exact transformation in CmaesInternalsLab.randomizeStart:
    // numerical-recipes LCG advances the seed, then a mulberry32 stream
    // produces a six-coordinate start point in [-1.5, 1.5].
    const rollOnce = (seed: number) => {
      const nextSeed = (seed * 1664525 + 1013904223) >>> 0;
      const rng = createMulberry32(nextSeed);
      return {
        nextSeed,
        point: Array.from({ length: 6 }, () =>
          Math.round((rng() * 3 - 1.5) * 100) / 100,
        ),
      };
    };
    const first = rollOnce(1337);
    const second = rollOnce(1337);
    expect(second.point).toEqual(first.point);
    expect(second.nextSeed).toBe(first.nextSeed);
    // Chained rolls compose deterministically.
    const chained = rollOnce(first.nextSeed);
    const chainedReplay = rollOnce(first.nextSeed);
    expect(chained.point).toEqual(chainedReplay.point);
  });
});

describe("deterministic house furniture", () => {
  // cmaes-mky follow-up: buildBookshelf used to use Math.random() to skip
  // ~15% of book slots, breaking the screenshot / replay contract for the
  // arm stage backdrop. The dimensions (w, d, h) are now mixed into a
  // per-call mulberry32 seed, so the same dimensions always render the same
  // layout. These tests pin the determinism contract.
  test("buildBookshelf replays bit-identical meshes for the same dimensions", () => {
    const a = buildBookshelf(1.2, 0.3, 1.8);
    const b = buildBookshelf(1.2, 0.3, 1.8);
    // Children count and child positions are fully reproducible.
    expect(b.group.children.length).toBe(a.group.children.length);
    const positionsA = a.group.children.map((child) => child.position.x);
    const positionsB = b.group.children.map((child) => child.position.x);
    expect(positionsB).toEqual(positionsA);
    a.dispose();
    b.dispose();
  });

  test("buildBookshelf produces different layouts for different dimensions", () => {
    const narrow = buildBookshelf(0.8, 0.3, 1.8);
    const wide = buildBookshelf(1.6, 0.3, 1.8);
    // The wider shelf fits more books (and so has more children); the layouts
    // must not collapse to the same mesh even though the gap pattern is the
    // same in both cases.
    expect(wide.group.children.length).not.toBe(narrow.group.children.length);
    narrow.dispose();
    wide.dispose();
  });

  test("buildBookshelf seed is dimension-sensitive (changing height reshuffles)", () => {
    // A change in any one dimension should perturb the per-call seed; the
    // h-only perturbation must reshuffle at least one book gap, so the
    // per-row gap pattern and the resulting book counts cannot stay equal.
    // (w stays the same so the per-row book slot count is identical; the
    // gap RNG draws depend on the seed, so the realised book count drifts
    // whenever the seed changes.)
    const a = buildBookshelf(1.2, 0.3, 1.6);
    const b = buildBookshelf(1.2, 0.3, 2.0);
    const countBooks = (group: { children: THREE.Object3D[] }): number => {
      // The bookshelf fixture may run under either of two three.js
      // module instances in the test runner (the top-level 0.181.2
      // and a nested 0.170.0 hoisted via stats-gl), so instanceof
      // THREE.Mesh is unreliable here. Duck-typing on the class's
      // own `isMesh`/`type` flags and on BoxGeometry's `parameters`
      // is the only path that holds across both module copies.
      let n = 0;
      for (const child of group.children) {
        const mesh = child as { isMesh?: unknown; geometry?: unknown };
        if (mesh.isMesh !== true) continue;
        const geom = mesh.geometry as
          | { type?: unknown; parameters?: { depth?: number } }
          | undefined;
        if (!geom || geom.type !== "BoxGeometry") continue;
        const depth = geom.parameters?.depth;
        if (typeof depth === "number" && depth < 0.25) n++;
      }
      return n;
    };
    const aBookCount = countBooks(a.group);
    const bBookCount = countBooks(b.group);
    expect(aBookCount).not.toBe(bBookCount);
    a.dispose();
    b.dispose();
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
      internalRibCount: 22,
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
      { ...baseline, internalRibCount: 34 },
    ];

    for (const variant of variants) {
      expect(evaluateWingPhysics(variant, 0.78).costScore).not.toBe(
        baselineCost,
      );
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
      internalRibCount: 22,
    };
    const variants: WingParams[] = [
      { ...baseline, aspectRatio: 14 },
      { ...baseline, sweepAngle: 38 },
      { ...baseline, thicknessRatio: 0.18 },
      { ...baseline, maxCamber: 0.06 },
      { ...baseline, camberPosition: 0.56 },
      { ...baseline, taperRatio: 0.82 },
      { ...baseline, airfoilFamily: "Laminar Flow Low-Re" },
    ];

    const baselineGeometry = buildWingGeometryForRender(baseline);
    const baselinePositions = Array.from(
      baselineGeometry.attributes.position.array,
    );
    baselineGeometry.dispose();

    for (const variant of variants) {
      const geometry = buildWingGeometryForRender(variant);
      expect(Array.from(geometry.attributes.position.array)).not.toEqual(
        baselinePositions,
      );
      geometry.dispose();
    }

    const baselineRibs = buildWingRibsForRender(baseline);
    expect(
      buildWingRibsForRender({ ...baseline, internalRibCount: 34 }),
    ).toHaveLength(34);
    expect(
      buildWingRibsForRender({ ...baseline, aspectRatio: 14 }),
    ).not.toEqual(baselineRibs);
    expect(buildWingRibsForRender({ ...baseline, sweepAngle: 38 })).not.toEqual(
      baselineRibs,
    );
    expect(
      buildWingRibsForRender({ ...baseline, taperRatio: 0.82 }),
    ).not.toEqual(baselineRibs);
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
      vibrationDamping: 0.01,
    };
    const lowDamping = evaluateBridgePhysics(baseline, 0);
    const highDamping = evaluateBridgePhysics(
      { ...baseline, vibrationDamping: 0.15 },
      0,
    );

    expect(highDamping.flutterCriticalSpeedKmh).toBeGreaterThan(
      lowDamping.flutterCriticalSpeedKmh,
    );
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

function generation(
  g: number,
  sf: number[],
  sx: number[],
  bestF = Math.min(...sf),
): CmaesVizGeneration {
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
    p_c: [0, 0, 0],
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
      generation(2, [4, 6, 7, 8], [4, 0, 0, 6, 0, 0, 7, 0, 0, 8, 0, 0], 0.5),
    ],
    pca_basis: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    pca_center: [0, 0, 0],
    pca_pool_eigvals: [1, 1, 1],
  };

  const states = wasmRunToNdStates(run);
  expect(states[0].samples.map((sample) => sample.rank)).toEqual([3, 0, 2, 1]);
  expect(states[0].samples.map((sample) => sample.isElite)).toEqual([
    false,
    true,
    false,
    true,
  ]);
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
    pca_pool_eigvals: [1, 2, 4],
  };

  const [state] = wasmRunToNdStates(run);
  expect(state.eigenvalues).toEqual([4, 2, 1]);
  expect(state.covariance).toEqual([
    [1, 0, 0],
    [0, 2, 0],
    [0, 0, 4],
  ]);
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
  {
    name: "passive sphere 2D",
    landscape: 0,
    dim: 2,
    initialMean: [1.5, -1],
    sigma: 0.3,
    lambda: 6,
    active: false,
    seed: 41,
    generations: 100,
    noise: 0,
    bounded: false,
  },
  {
    name: "active sphere 3D",
    landscape: 0,
    dim: 3,
    initialMean: [1.5, -1, 2],
    sigma: 0.4,
    lambda: 10,
    active: true,
    seed: 77,
    generations: 100,
    noise: 0,
    bounded: false,
  },
  {
    name: "Rosenbrock default",
    landscape: 1,
    dim: 5,
    initialMean: [1.5, -1, 2, 0.5, -0.5],
    sigma: 0.3,
    lambda: 16,
    active: true,
    seed: 1337,
    generations: 120,
    noise: 0,
    bounded: false,
  },
  {
    name: "bounded Rosenbrock",
    landscape: 1,
    dim: 4,
    initialMean: [1.8, -1.8, 1.6, -1.6],
    sigma: 0.65,
    lambda: 20,
    active: true,
    seed: 2027,
    generations: 100,
    noise: 0,
    bounded: true,
  },
  {
    name: "Discus 6D",
    landscape: 2,
    dim: 6,
    initialMean: [1.5, -1, 2, 0.5, -0.5, 1],
    sigma: 0.4,
    lambda: 24,
    active: true,
    seed: 4242,
    generations: 120,
    noise: 0,
    bounded: false,
  },
  {
    name: "noisy Rastrigin",
    landscape: 3,
    dim: 4,
    initialMean: [3, -2.5, 2, -3],
    sigma: 0.8,
    lambda: 32,
    active: true,
    seed: 919,
    generations: 100,
    noise: 0.05,
    bounded: false,
  },
  {
    name: "bounded passive noisy Rastrigin",
    landscape: 3,
    dim: 6,
    initialMean: [1.8, -1.7, 1.6, -1.5, 1.4, -1.3],
    sigma: 0.7,
    lambda: 48,
    active: false,
    seed: 98765,
    generations: 80,
    noise: 0.1,
    bounded: true,
  },
  {
    name: "ill-conditioned ellipsoid 2D",
    landscape: 4,
    dim: 2,
    initialMean: [1.5, -1],
    sigma: 0.3,
    lambda: 12,
    active: true,
    seed: 808,
    generations: 100,
    noise: 0,
    bounded: false,
  },
  {
    name: "ill-conditioned ellipsoid 6D maximum population",
    landscape: 4,
    dim: 6,
    initialMean: [1.5, -1, 2, 0.5, -0.5, 1],
    sigma: 0.4,
    lambda: 48,
    active: true,
    seed: 65537,
    generations: 120,
    noise: 0,
    bounded: false,
  },
];

function maximumDifference(
  left: ArrayLike<number>,
  right: ArrayLike<number>,
  scaled: boolean,
): number {
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
  scaled = true,
): void {
  const difference = maximumDifference(left, right, scaled);
  if (!(difference <= tolerance)) {
    throw new Error(
      `${label}: maximum ${scaled ? "scale-normalized" : "absolute"} difference ${difference} exceeds ${tolerance}`,
    );
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
      : new URL(
          "../../public/wasm/fs-cmaes/v041/fs_cmaes_viz_wasm_bg.wasm",
          import.meta.url,
        ),
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
        repairStrategy: scenario.bounded ? "reflect" : "none",
      },
    );
    const tsStates = [];
    for (
      let generationIndex = 0;
      generationIndex < scenario.generations;
      generationIndex++
    ) {
      const state = optimizer.step();
      tsStates.push(state);
      if (state.bestFitness <= CMAES_VISUALIZATION_F_TARGET) break;
    }

    const initial = Array.from(
      { length: 6 },
      (_, index) => scenario.initialMean[index] ?? 0,
    );
    const packet = wasm.cmaes_viz_run(
      scenario.dim,
      initial[0],
      initial[1],
      initial[2],
      initial[3],
      initial[4],
      initial[5],
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
      CMAES_VISUALIZATION_F_TARGET,
    );
    expect(packet).toBeInstanceOf(Float64Array);
    representativePacket ??= packet;
    const decoded = decodeCmaesPacket(packet);
    if (!("ok" in decoded))
      throw new Error(`${scenario.name}: WASM refusal ${decoded.refusal.code}`);
    const run = decoded.ok;
    const wasmStates = wasmRunToNdStates(run);
    const finalTsState = tsStates.at(-1);
    if (!finalTsState)
      throw new Error(`${scenario.name}: TypeScript produced no generation`);
    const expectedStopReason =
      finalTsState.bestFitness <= CMAES_VISUALIZATION_F_TARGET
        ? "target-reached"
        : "generations-exhausted";

    expect(run.generations.length).toBe(tsStates.length);
    expect(run.total_evals).toBe(tsStates.length * scenario.lambda);
    expect(run.stop_reason).toBe(expectedStopReason);
    stopReasons.add(run.stop_reason);
    comparedGenerations += run.generations.length;

    for (
      let generationIndex = 0;
      generationIndex < tsStates.length;
      generationIndex++
    ) {
      const label = `${scenario.name}, generation ${generationIndex + 1}`;
      const wasmGeneration = run.generations[generationIndex];
      const wasmState = wasmStates[generationIndex];
      const tsState = tsStates[generationIndex];
      requireDifferenceWithin(
        `${label} ranked z`,
        wasmGeneration.sz,
        tsState.samples.flatMap((sample) => sample.z),
        2e-12,
        false,
      );
      requireDifferenceWithin(
        `${label} samples`,
        wasmGeneration.sx,
        tsState.samples.flatMap((sample) => sample.x),
        2e-8,
      );
      requireDifferenceWithin(
        `${label} ranked fitness`,
        wasmGeneration.sf,
        tsState.samples.map((sample) => sample.fitness),
        2e-8,
      );
      requireDifferenceWithin(
        `${label} mean`,
        wasmGeneration.mean,
        tsState.mean,
        2e-8,
      );
      requireDifferenceWithin(
        `${label} eigenvalues`,
        wasmGeneration.eigvals,
        [...tsState.eigenvalues].reverse(),
        2e-8,
      );
      requireDifferenceWithin(
        `${label} covariance`,
        wasmState.covariance.flat(),
        tsState.covariance.flat(),
        2e-8,
      );
      requireDifferenceWithin(
        `${label} p_sigma`,
        wasmGeneration.p_sigma,
        tsState.pSigma,
        2e-8,
      );
      requireDifferenceWithin(
        `${label} p_c`,
        wasmGeneration.p_c,
        tsState.pC,
        2e-8,
      );
      requireDifferenceWithin(
        `${label} sigma`,
        [wasmGeneration.sigma],
        [tsState.sigma],
        2e-8,
      );
      requireDifferenceWithin(
        `${label} best fitness`,
        [wasmGeneration.best_f],
        [tsState.bestFitness],
        2e-8,
      );
    }
    requireDifferenceWithin(
      `${scenario.name} final best x`,
      run.best_x,
      finalTsState.bestX,
      2e-8,
    );
  }

  expect(comparedGenerations).toBeGreaterThanOrEqual(500);
  expect(stopReasons).toEqual(
    new Set(["generations-exhausted", "target-reached"]),
  );

  if (!representativePacket)
    throw new Error("trajectory matrix produced no packet");

  const refusalPacket = wasm.cmaes_viz_run(
    1,
    0,
    0,
    0,
    0,
    0,
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
    NaN,
  );
  const refusal = decodeCmaesPacket(refusalPacket);
  expect("refusal" in refusal && refusal.refusal.code).toBe("dim-out-of-range");
  expect("refusal" in refusal && refusal.refusal.ranked_repairs).toEqual([
    "set dim within 2..=6",
  ]);

  const wrongMagic = representativePacket.slice();
  wrongMagic[0] = 0;
  expect(() => decodeCmaesPacket(wrongMagic)).toThrow("magic");
  const wrongStride = representativePacket.slice();
  wrongStride[11] += 1;
  expect(() => decodeCmaesPacket(wrongStride)).toThrow("generation_stride");
  expect(() =>
    decodeCmaesPacket(
      representativePacket.slice(0, representativePacket.length - 1),
    ),
  ).toThrow("total_words");
});

const OWNER_CMA_MAGIC = 0x434d4132;

function ownerSnapshotPacket(family: number): Float64Array {
  const dimension = 3;
  const shapePayload =
    family === 0
      ? [1, 0.5, 2, 1, 1.25, 1.5]
      : family === 1
        ? [1, 1, 1.25, 1.5]
        : [0, 5];
  const packet = new Float64Array(31 + 2 * dimension + shapePayload.length);
  packet.set([
    OWNER_CMA_MAGIC,
    2,
    0,
    1,
    packet.length,
    family,
    dimension,
    0,
    0,
    0.4,
    7,
    3,
    2,
    14,
    1,
    1,
    21,
    0,
    family === 0 ? 2 : family === 1 ? 0 : 1,
    family === 0 ? 3 : family === 1 ? 0 : family === 2 ? 4 : 1,
    64,
    42,
    31,
    family === 0 ? 18 : 0,
    family >= 2 ? 5 : 0,
    0,
    NaN,
    NaN,
    NaN,
    family === 0 ? 0 : family === 1 ? 1 : 2,
    shapePayload.length,
  ]);
  packet.set([0, 0, 0], 31);
  packet.set([NaN, NaN, NaN], 34);
  packet.set(shapePayload, 37);
  return packet;
}

describe("schema-2 owner CMA packet adapter", () => {
  test("decodes representation-honest receipts for every family", () => {
    const expected = ["full", "separable", "lm-cma", "lm-ma"] as const;
    for (let family = 0; family < expected.length; family++) {
      const decoded = decodeCmaFamilySnapshot(ownerSnapshotPacket(family), 1);
      if (!("ok" in decoded))
        throw new Error(`unexpected family ${family} refusal`);
      expect(decoded.ok.family).toBe(expected[family]);
      expect(decoded.ok.dimension).toBe(3);
      expect(decoded.ok.admittedEvaluations).toBe(14);
      expect(decoded.ok.normalStreamBlocks).toBe(21n);
      expect(decoded.ok.best).toBeNull();
      expect(decoded.ok.shape.kind).toBe(
        family === 0 ? "full" : family === 1 ? "diagonal" : "limited-memory",
      );
    }
  });

  test("builds a lossless 64-bit-seeded configuration and decodes row-major asks", () => {
    const config = buildCmaFamilyConfig({
      family: "lm-ma",
      mean: [0.1, -0.2, 0.3],
      sigma: 0.25,
      maxEvaluations: 14,
      population: 7,
      memory: 5,
      seed: 0x1234_5678_9abc_def0n,
    });
    expect(Array.from(config.slice(0, 12))).toEqual([
      OWNER_CMA_MAGIC,
      2,
      0,
      15,
      3,
      3,
      7,
      5,
      14,
      0x9abc_def0,
      0x1234_5678,
      0.25,
    ]);

    const ask = new Float64Array([
      OWNER_CMA_MAGIC,
      2,
      0,
      2,
      21,
      1,
      0,
      3,
      4,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
    ]);
    const decoded = decodeCmaFamilyAsk(ask);
    if (!("ok" in decoded)) throw new Error("unexpected ask refusal");
    expect(decoded.ok.generation).toBe(1);
    expect(Array.from(decoded.ok.candidates)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });

  test("fails closed on malformed shape claims and preserves typed refusals", () => {
    const malformed = ownerSnapshotPacket(0);
    malformed[30] -= 1;
    expect(() => decodeCmaFamilySnapshot(malformed, 1)).toThrow(
      "snapshot shape",
    );

    const wrongComplexity = ownerSnapshotPacket(3);
    wrongComplexity[18] = 0;
    expect(() => decodeCmaFamilySnapshot(wrongComplexity, 1)).toThrow(
      "family complexity",
    );

    const nonPositiveVariance = ownerSnapshotPacket(1);
    nonPositiveVariance[38] = 0;
    expect(() => decodeCmaFamilySnapshot(nonPositiveVariance, 1)).toThrow(
      "diagonal variances",
    );

    const refusal = new Float64Array([OWNER_CMA_MAGIC, 2, 1, 2, 7, 17, 3]);
    expect(decodeCmaFamilyAsk(refusal)).toEqual({
      refusal: { code: 17, name: "budget-exhausted", detail: 3 },
    });
  });
});

describe("G1 walking packet adapter", () => {
  const admission = new Float64Array([
    0x47315737,
    9,
    0,
    1,
    136,
    5_040,
    30,
    7,
    213,
    1 / 480,
    1.5,
    0.65,
    1.55,
    12,
    2,
    1,
    0.024,
    2.4,
    0.55,
    0.7,
    72,
    29,
    15,
    14,
    336,
    8,
    15,
    30,
    60,
    1 / 3.1,
    3 / 3.1,
    ...Array.from({ length: 15 }, (_, row) => row * 336),
    ...Array.from({ length: 15 }, (_, row) => [
      row * 336 + 1,
      row * 336 + 2,
    ]).flat(),
    ...Array.from({ length: 15 }, (_, row) =>
      [248, 256, 272, 280].map((offset) => row * 336 + offset),
    ).flat(),
  ]);
  const objectiveWords = [
    12, 0.4, 0.2, 3, 0.01, 0.3, 0.02, 0.1, 0.01, 0.2, 0.3, 0.4, 0.005, 0.6,
    0.88, 0.02, 8.4, 0.31, 0.54, 0.18, 0.024, 720, 0,
    // schema 8: maximum body penetration measured by the obstacle guard
    0,
  ];

  test("admits only the exact owner policy and pose layout", () => {
    const decoded = decodeG1Admission(admission);
    if (!("ok" in decoded)) throw new Error("unexpected G1 admission refusal");
    expect(decoded.ok.policyDimension).toBe(5_040);
    expect(decoded.ok.linkCount).toBe(30);
    expect(decoded.ok.traceSampleWords).toBe(213);
    expect(decoded.ok.config.task).toBe("walking");
    expect(decoded.ok.config.challenge).toBe("terrain-and-push");
    expect(decoded.ok.pushPeakForceNewtons).toBe(72);
    expect(decoded.ok.physicalActuatorCount).toBe(29);
    expect(decoded.ok.learnedPolicyRowCount).toBe(15);
    expect(decoded.ok.reflexActuatorCount).toBe(14);
    expect(decoded.ok.curriculumIndices.bias).toHaveLength(15);
    expect(decoded.ok.curriculumIndices.phase).toHaveLength(30);
    expect(decoded.ok.curriculumIndices.feedback).toHaveLength(60);
    expect(decoded.ok.armSwingGateStartSeconds).toBe(1 / 3.1);
    expect(decoded.ok.armSwingGateEndSeconds).toBe(3 / 3.1);

    for (let field = 21; field < 136; field++) {
      const malformed = admission.slice();
      malformed[field] += 1;
      expect(() => decodeG1Admission(malformed)).toThrow("malformed G1 packet");
    }
    const staleSchema = admission.slice();
    staleSchema[1] = 8;
    expect(() => decodeG1Admission(staleSchema)).toThrow("schema");

    const wrongLayout = admission.slice();
    wrongLayout[5] = 5_039;
    expect(() => decodeG1Admission(wrongLayout)).toThrow("layout mismatch");

    const reversedPush = admission.slice();
    reversedPush[19] = 0.5;
    expect(() => decodeG1Admission(reversedPush)).toThrow(
      "admitted controls",
    );
    const shortHorizon = admission.slice();
    shortHorizon[10] = 0.1;
    const shortAdmission = decodeG1Admission(shortHorizon);
    expect("ok" in shortAdmission).toBe(true);

    const wrongControls = admission.slice();
    wrongControls[11] = -0.1;
    expect(() => decodeG1Admission(wrongControls)).toThrow("admitted controls");
  });

  test("decodes decomposed objectives, population rows, and owner poses", () => {
    const evaluation = new Float64Array([
      0x47315737,
      9,
      0,
      2,
      29,
      ...objectiveWords,
    ]);
    const decodedEvaluation = decodeG1Evaluation(evaluation);
    if (!("ok" in decodedEvaluation))
      throw new Error("unexpected evaluation refusal");
    expect(decodedEvaluation.ok.distanceMeters).toBe(0.4);
    expect(decodedEvaluation.ok.pushImpulseNewtonSeconds).toBe(8.4);
    expect(decodedEvaluation.ok.terminationReason).toBe("horizon");

    const negativeIntegral = evaluation.slice();
    negativeIntegral[11] = -1;
    expect(() => decodeG1Evaluation(negativeIntegral)).toThrow(
      "negative integral",
    );

    const negativeBodyPenetration = evaluation.slice();
    negativeBodyPenetration[28] = -0.001;
    expect(() => decodeG1Evaluation(negativeBodyPenetration)).toThrow(
      "negative integral",
    );

    const population = decodeG1Population(
      new Float64Array([0x47315737, 9, 0, 4, 9, 3, 4, 3, 2]),
    );
    if (!("ok" in population)) throw new Error("unexpected population refusal");
    expect(Array.from(population.ok)).toEqual([4, 3, 2]);

    const sample = new Array<number>(213).fill(0);
    sample[0] = 0.025;
    sample[1] = 1;
    sample[2] = 0;
    for (let link = 0; link < 30; link++) {
      const poseStart = 3 + link * 7;
      sample[poseStart] = link * 0.01;
      sample[poseStart + 2] = 0.75;
      sample[poseStart + 3] = 1;
    }
    const trace = decodeG1Trace(
      new Float64Array([
        0x47315737,
        9,
        0,
        3,
        243,
        ...objectiveWords,
        1,
        ...sample,
      ]),
    );
    if (!("ok" in trace)) throw new Error("unexpected trace refusal");
    expect(trace.ok.samples).toHaveLength(1);
    expect(trace.ok.samples[0].leftContact).toBe(true);
    expect(trace.ok.samples[0].linkPoses[15].position).toEqual([0.15, 0, 0.75]);

    const nonUnitQuaternion = new Float64Array([
      0x47315737,
      9,
      0,
      3,
      243,
      ...objectiveWords,
      1,
      ...sample,
    ]);
    // Schema 8 added one receipt word, so the first sample's first
    // quaternion component moved one slot later.
    nonUnitQuaternion[36] = 0.5;
    expect(() => decodeG1Trace(nonUnitQuaternion)).toThrow("link quaternion");
  });

  test("decodes exact termination reasons and rejects unknown reason IDs", () => {
    const baseTilt = new Float64Array([
      0x47315737,
      9,
      0,
      2,
      29,
      ...objectiveWords.slice(0, -2),
      2,
      0,
    ]);
    const decoded = decodeG1Evaluation(baseTilt);
    if (!("ok" in decoded)) throw new Error("unexpected evaluation refusal");
    expect(decoded.ok.terminationReason).toBe("base tilt");

    const unknownReason = baseTilt.slice();
    // 7 is now the valid "body obstacle" reason; 8 is still unknown.
    unknownReason[27] = 8;
    expect(() => decodeG1Evaluation(unknownReason)).toThrow(
      "termination reason",
    );
  });

  test("rejects a pose packet whose declared sample count is inconsistent", () => {
    expect(() =>
      decodeG1Trace(
        new Float64Array([0x47315737, 9, 0, 3, 30, ...objectiveWords, 1]),
      ),
    ).toThrow("trace shape");
  });
});

async function withEvaluationWorkerDouble(
  mutate: (objectives: Float64Array) => void,
  run: (terminated: () => number) => Promise<void>,
): Promise<void> {
  const workerDescriptor = Object.getOwnPropertyDescriptor(globalThis, "Worker");
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  let terminatedWorkers = 0;
  class EvaluationWorkerDouble extends EventTarget {
    postMessage(message: { requestId: number; policies: Float64Array }): void {
      const rows = message.policies.length / 128;
      const objectives = new Float64Array(rows);
      for (let row = 0; row < rows; row++) {
        objectives[row] = message.policies[row * 128];
      }
      mutate(objectives);
      queueMicrotask(() => {
        this.dispatchEvent(new MessageEvent("message", {
          data: { type: "result", requestId: message.requestId, objectives },
        }));
      });
    }

    terminate(): void {
      terminatedWorkers++;
    }
  }
  Object.defineProperty(globalThis, "Worker", {
    configurable: true,
    value: EvaluationWorkerDouble,
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { hardwareConcurrency: 4 },
  });
  try {
    await run(() => terminatedWorkers);
  } finally {
    if (workerDescriptor)
      Object.defineProperty(globalThis, "Worker", workerDescriptor);
    else Reflect.deleteProperty(globalThis, "Worker");
    if (navigatorDescriptor)
      Object.defineProperty(globalThis, "navigator", navigatorDescriptor);
    else Reflect.deleteProperty(globalThis, "navigator");
  }
}

test("the robotics pool admits exact parallel results and reuses the verified lanes", async () => {
  await withEvaluationWorkerDouble(
    () => {},
    async (terminated) => {
      const pool = new RoboticsEvaluationPool({
        model: "arm",
        config: DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
        dimension: 128,
      }, 2);
      const policies = new Float64Array(4 * 128);
      policies[0] = 11;
      policies[128] = 12;
      policies[256] = 13;
      policies[384] = 14;
      let sequentialCalls = 0;
      const sequential = () => {
        sequentialCalls++;
        return Float64Array.of(11, 12, 13, 14);
      };
      const first = await pool.evaluate(policies, sequential);
      expect(Array.from(first.objectives)).toEqual([11, 12, 13, 14]);
      expect(first.lanes).toBe(2);
      expect(first.firstBatchVerified).toBe(true);
      expect(first.fallbackReason).toBeNull();
      expect(sequentialCalls).toBe(1);

      const second = await pool.evaluate(policies, sequential);
      expect(Array.from(second.objectives)).toEqual([11, 12, 13, 14]);
      expect(second.lanes).toBe(2);
      expect(second.firstBatchVerified).toBe(true);
      expect(second.fallbackReason).toBeNull();
      expect(sequentialCalls).toBe(1);
      pool.free();
      expect(terminated()).toBe(2);
    },
  );
});

test("the robotics pool permanently falls back after an exact-parity mismatch", async () => {
  await withEvaluationWorkerDouble(
    (objectives) => {
      objectives[0] += 1;
    },
    async (terminated) => {
      const pool = new RoboticsEvaluationPool({
        model: "arm",
        config: DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
        dimension: 128,
      }, 2);
      const policies = new Float64Array(2 * 128);
      policies[0] = 21;
      policies[128] = 22;
      const sequentialObjectives = Float64Array.of(21, 22);
      const first = await pool.evaluate(policies, () => sequentialObjectives);
      expect(first.objectives).toBe(sequentialObjectives);
      expect(first.lanes).toBe(1);
      expect(first.firstBatchVerified).toBe(false);
      expect(first.fallbackReason).toBe("parallel/sequential objective mismatch");
      expect(terminated()).toBe(2);

      const secondObjectives = Float64Array.of(31, 32);
      const second = await pool.evaluate(policies, () => secondObjectives);
      expect(second.objectives).toBe(secondObjectives);
      expect(second.lanes).toBe(1);
      expect(second.firstBatchVerified).toBe(false);
      expect(second.fallbackReason).toBe("parallel/sequential objective mismatch");
      expect(terminated()).toBe(2);
      pool.free();
    },
  );
});

test("the robotics pool degrades to the sequential owner when workers are unavailable", async () => {
  const workerDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "Worker",
  );
  Object.defineProperty(globalThis, "Worker", {
    configurable: true,
    value: class UnavailableWorker {
      constructor() {
        throw new Error("worker construction blocked by test");
      }
    },
  });
  try {
    const pool = new RoboticsEvaluationPool({
      model: "arm",
      config: DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
      dimension: 128,
    });
    const sequentialObjectives = Float64Array.of(17);
    const receipt = await pool.evaluate(
      new Float64Array(128),
      () => sequentialObjectives,
    );
    expect(receipt.objectives).toBe(sequentialObjectives);
    expect(receipt.lanes).toBe(1);
    expect(receipt.firstBatchVerified).toBe(false);
    expect(receipt.fallbackReason).toContain("worker construction failed");
    pool.free();
  } finally {
    if (workerDescriptor)
      Object.defineProperty(globalThis, "Worker", workerDescriptor);
    else Reflect.deleteProperty(globalThis, "Worker");
  }
});

test("the shipped owner package executes every CMA family plus both robot flagships", async () => {
  const wasm =
    await import("../../public/wasm/fs-cmaes/v0622/fs_cmaes_viz_wasm.js");
  const wasmBytes = await Bun.file(
    new URL(
      "../../public/wasm/fs-cmaes/v0622/fs_cmaes_viz_wasm_bg.wasm",
      import.meta.url,
    ),
  ).arrayBuffer();
  const javascriptBytes = await Bun.file(
    new URL(
      "../../public/wasm/fs-cmaes/v0622/fs_cmaes_viz_wasm.js",
      import.meta.url,
    ),
  ).arrayBuffer();
  await verifyOwnerArtifacts(ownerArtifactManifest, javascriptBytes, wasmBytes);
  await wasm.default({ module_or_path: wasmBytes });

  expect(wasm.cmaes_viz_kernel_version()).toBe("fs-cmaes-viz-wasm 0.6.22");
  verifyOwnerRuntimeIdentity(
    ownerArtifactManifest,
    wasm.cmaes_viz_kernel_version(),
    wasm.cmaes_viz_source_revision(),
  );
  expect(wasm.cmaes_viz_source_revision()).toMatch(/^[0-9a-f]{40}$/);

  const foreignSource = {
    ...ownerArtifactManifest,
    sourceRevision: "0".repeat(40),
  };
  expect(() =>
    verifyOwnerRuntimeIdentity(
      foreignSource,
      wasm.cmaes_viz_kernel_version(),
      wasm.cmaes_viz_source_revision(),
    ),
  ).toThrow("runtime identity");
  const foreignSchema = {
    ...ownerArtifactManifest,
    schemas: { ...ownerArtifactManifest.schemas, g1: 8 },
  };
  await expect(
    verifyOwnerArtifacts(foreignSchema, javascriptBytes, wasmBytes),
  ).rejects.toThrow("identity or schema");
  const corruptLayouts: ((manifest: OwnerArtifactManifest) => void)[] = [
    (manifest) => {
      manifest.g1.physicalActuatorCount = 30;
    },
    (manifest) => {
      manifest.g1.learnedJointIndices[0] = 15;
    },
    (manifest) => {
      manifest.g1.reflexJointIndices[0] = 0;
    },
    (manifest) => {
      manifest.g1.armSwingGateSeconds[0] = 0.5;
    },
    (manifest) => {
      manifest.g1.curriculumIndices.feedback[0] += 1;
    },
  ];
  for (const corrupt of corruptLayouts) {
    const manifest = structuredClone(ownerArtifactManifest);
    corrupt(manifest);
    await expect(
      verifyOwnerArtifacts(manifest, javascriptBytes, wasmBytes),
    ).rejects.toThrow("owner manifest");
  }
  const damagedJavascript = javascriptBytes.slice(0);
  new Uint8Array(damagedJavascript)[0] ^= 1;
  await expect(
    verifyOwnerArtifacts(ownerArtifactManifest, damagedJavascript, wasmBytes),
  ).rejects.toThrow("JavaScript SHA-256 mismatch");
  const damagedWasm = wasmBytes.slice(0);
  new Uint8Array(damagedWasm)[0] ^= 1;
  await expect(
    verifyOwnerArtifacts(ownerArtifactManifest, javascriptBytes, damagedWasm),
  ).rejects.toThrow("WASM SHA-256 mismatch");

  const shortOwner = new wasm.G1WalkingVizEvaluator(
    buildG1Config({ ...DEFAULT_G1_WALKING_CONFIG, durationSeconds: 0.1 }),
  );
  try {
    const shortAdmission = decodeG1Admission(shortOwner.receipt());
    if (!("ok" in shortAdmission)) throw new Error("short owner admission refused");
    expect(shortAdmission.ok.config.durationSeconds).toBe(0.1);
    // The disclosed push/gate times may lie after a valid short horizon.
    expect(shortAdmission.ok.pushStartSeconds).toBeGreaterThan(0.1);
    const shortReceipt = decodeG1Evaluation(
      shortOwner.evaluate(new Float64Array(5_040)),
    );
    if (!("ok" in shortReceipt)) throw new Error("short owner evaluation refused");
    expect(shortReceipt.ok.completedSteps).toBe(48);
    expect(shortReceipt.ok.pushImpulseNewtonSeconds).toBe(0);
  } finally {
    shortOwner.free();
  }

  const families = ["full", "separable", "lm-cma", "lm-ma"] as const;
  for (const family of families) {
    const session = new wasm.CmaesVizSession(
      buildCmaFamilyConfig({
        family,
        mean: new Array(8).fill(0),
        sigma: 0.3,
        maxEvaluations: 12,
        population: 6,
        memory: family === "lm-cma" || family === "lm-ma" ? 4 : undefined,
        seed: 0x0123_4567_89ab_cdefn,
      }),
    );
    const admission = decodeCmaFamilySnapshot(session.receipt(), 1);
    if (!("ok" in admission))
      throw new Error(`${family}: admission refusal ${admission.refusal.name}`);

    const ask = decodeCmaFamilyAsk(session.ask());
    if (!("ok" in ask))
      throw new Error(`${family}: ask refusal ${ask.refusal.name}`);
    const objectives = new Float64Array(ask.ok.population);
    for (let row = 0; row < ask.ok.population; row++) {
      let objective = 0;
      for (let column = 0; column < ask.ok.dimension; column++) {
        objective += ask.ok.candidates[row * ask.ok.dimension + column] ** 2;
      }
      objectives[row] = objective;
    }
    const tell = Float64Array.from([
      OWNER_CMA_MAGIC,
      2,
      3,
      6 + objectives.length,
      ask.ok.generation,
      objectives.length,
      ...objectives,
    ]);
    const snapshot = decodeCmaFamilySnapshot(session.tell(tell), 4);
    if (!("ok" in snapshot))
      throw new Error(`${family}: tell refusal ${snapshot.refusal.name}`);
    expect(snapshot.ok.generation).toBe(1);
    expect(snapshot.ok.evaluations).toBe(6);
    expect(snapshot.ok.shape.kind).toBe(
      family === "full"
        ? "full"
        : family === "separable"
          ? "diagonal"
          : "limited-memory",
    );
    session.free();
  }

  const refusedDenseSession = new wasm.CmaesVizSession(
    buildCmaFamilyConfig({
      family: "full",
      mean: new Array(5_040).fill(0),
      sigma: 0.1,
      maxEvaluations: 8,
      population: 8,
      seed: 7n,
    }),
  );
  const refusedDenseAdmission = decodeCmaFamilySnapshot(refusedDenseSession.receipt(), 1);
  expect(refusedDenseAdmission).toEqual({
    refusal: {
      code: 5,
      name: "full-dimension-limit",
      detail: null,
    },
  });
  refusedDenseSession.free();

  for (const family of families.slice(1)) {
    const session = new wasm.CmaesVizSession(
      buildCmaFamilyConfig({
        family,
        mean: new Array(5_040).fill(0),
        sigma: 0.1,
        maxEvaluations: 8,
        population: 8,
        memory: family === "lm-cma" || family === "lm-ma" ? 12 : undefined,
        seed: 7n,
      }),
    );
    const admission = decodeCmaFamilySnapshot(session.receipt(), 1);
    if (!("ok" in admission))
      throw new Error(`${family}: 5,040-D refusal ${admission.refusal.name}`);
    expect(admission.ok.dimension).toBe(5_040);
    session.free();
  }

  const evaluator = new wasm.G1WalkingVizEvaluator(
    new Float64Array([
      0x47315737,
      9,
      0,
      12,
      1 / 480,
      1.5,
      0.65,
      1.55,
      12,
      2,
      1,
      0,
    ]),
  );
  const admission = decodeG1Admission(evaluator.receipt());
  if (!("ok" in admission))
    throw new Error(`G1 admission refusal ${admission.refusal.name}`);
  expect(admission.ok.policyDimension).toBe(5_040);

  const stabilizingPolicy = evaluator.stabilizing_policy_mean();
  const curriculumPolicy = evaluator.walking_curriculum_mean();
  expect(stabilizingPolicy.filter((value: number) => value !== 0)).toHaveLength(
    15,
  );
  expect(curriculumPolicy.filter((value: number) => value !== 0)).toHaveLength(
    105,
  );
  const evaluation = decodeG1Evaluation(evaluator.evaluate(stabilizingPolicy));
  const curriculum = decodeG1Evaluation(evaluator.evaluate(curriculumPolicy));
  const aggressiveEvaluation = decodeG1Evaluation(
    evaluator.evaluate(
      new Float64Array(admission.ok.policyDimension).fill(0.03),
    ),
  );
  const trace = decodeG1Trace(evaluator.trace(curriculumPolicy));
  if (!("ok" in evaluation))
    throw new Error(`G1 evaluation refusal ${evaluation.refusal.name}`);
  if (!("ok" in curriculum))
    throw new Error(`G1 curriculum refusal ${curriculum.refusal.name}`);
  if (!("ok" in aggressiveEvaluation)) {
    throw new Error(
      `aggressive G1 evaluation refusal ${aggressiveEvaluation.refusal.name}`,
    );
  }
  if (!("ok" in trace))
    throw new Error(`G1 trace refusal ${trace.refusal.name}`);
  // The standing prior is deliberately task-scoped and need not complete a
  // walking challenge. The v0.6.13 curriculum is pinned to the native v073
  // owner receipt so browser packaging cannot silently regress into the old
  // jump-like, low-displacement, or cross-target-divergent gait.
  expect(evaluation.ok.completedSteps).toBeGreaterThan(120);
  expect(aggressiveEvaluation.ok.completedSteps).toBeLessThan(
    evaluation.ok.completedSteps,
  );
  expect(aggressiveEvaluation.ok.objective).toBeGreaterThan(
    evaluation.ok.objective,
  );
  expect(curriculum.ok.completedSteps).toBe(720);
  expect(curriculum.ok.terminationReason).toBe("horizon");
  // The walking shaping score was rebalanced to pay for forward progress,
  // moving the seed's objective from 1.3168446135481418 to here. (0.6.20 raised
  // the progress reward to 200 and reached -107.878...; it was reverted because
  // the sweep behind it ran without the house obstacles the site declares, and
  // measured in the browser that value walked LESS far.) Every physical
  // quantity below is unchanged throughout: the rollout is identical, only what
  // we ask of it moved.
  expect(curriculum.ok.objective).toBeCloseTo(-67.5144205651753, 10);
  expect(curriculum.ok.distanceMeters).toBeCloseTo(0.32916830547315423, 12);
  expect(curriculum.ok.actuatorWorkJoules).toBeCloseTo(11796.419770004608, 7);
  expect(curriculum.ok.flightSeconds).toBeCloseTo(0.08333333333333338, 12);
  expect(curriculum.ok.flightSeconds).toBeLessThan(0.1);
  expect(curriculum.ok.lateralErrorIntegral).toBeCloseTo(
    0.38117352800697313,
    12,
  );
  expect(curriculum.ok.headingErrorIntegral).toBeCloseTo(
    0.9341669126226677,
    12,
  );
  expect(curriculum.ok.pushImpulseNewtonSeconds).toBeCloseTo(
    2.291467558724226,
    5,
  );
  expect(curriculum.ok.recoveryTimeSeconds).toBe(0.8);
  expect(curriculum.ok.singleSupportSeconds).toBeGreaterThan(0);
  expect(trace.ok.samples.length).toBeGreaterThanOrEqual(5);
  const { samples: _samples, ...traceReceipt } = trace.ok;
  expect(traceReceipt).toEqual(curriculum.ok);

  const flatEvaluator = new wasm.G1WalkingVizEvaluator(
    new Float64Array([
      0x47315737,
      9,
      0,
      12,
      1 / 480,
      1.5,
      0.65,
      1.55,
      12,
      2,
      0,
      0,
    ]),
  );
  const flatPolicy = flatEvaluator.walking_curriculum_mean();
  const flat = decodeG1Evaluation(flatEvaluator.evaluate(flatPolicy));
  if (!("ok" in flat))
    throw new Error(`flat G1 curriculum refusal ${flat.refusal.name}`);
  expect(flat.ok.completedSteps).toBe(720);
  expect(flat.ok.terminationReason).toBe("horizon");
  // Also moved by the walking rebalance (was 7.915509184194548). The
  // flat-challenge physics is likewise untouched.
  expect(flat.ok.objective).toBeCloseTo(-59.41344499020653, 10);
  expect(flat.ok.distanceMeters).toBeCloseTo(0.30837211553531235, 12);
  expect(flat.ok.actuatorWorkJoules).toBeCloseTo(11930.205416265955, 7);
  expect(flat.ok.flightSeconds).toBeCloseTo(0.08333333333333338, 12);
  expect(flat.ok.flightSeconds).toBeLessThan(0.1);
  expect(flat.ok.lateralErrorIntegral).toBeCloseTo(0.2912452028687668, 12);
  expect(flat.ok.headingErrorIntegral).toBeCloseTo(0.9185544290374063, 12);
  flatEvaluator.free();

  const population = 16;
  const generations = 16;
  const convergenceSession = new wasm.CmaesVizSession(
    buildCmaFamilyConfig({
      // LM-MA, not separable: separable CMA keeps no direction information and
      // measurably never improves on this objective at any search radius, so
      // asserting that 16 of its generations beat the seed asserts something
      // untrue. LM-MA is also what the page actually runs.
      family: "lm-ma",
      mean: curriculumPolicy,
      sigma: 0.0005,
      maxEvaluations: population * generations,
      population,
      seed: 0x4731_5050n,
    }),
  );
  let bestPoint = curriculumPolicy;
  try {
    for (let generation = 0; generation < generations; generation++) {
      const ask = decodeCmaFamilyAsk(convergenceSession.ask());
      if (!("ok" in ask))
        throw new Error(`G1 convergence ask refusal ${ask.refusal.name}`);
      const objectives = decodeG1Population(
        evaluator.evaluate_population(ask.ok.candidates),
      );
      if (!("ok" in objectives)) {
        throw new Error(
          `G1 convergence population refusal ${objectives.refusal.name}`,
        );
      }
      const tell = Float64Array.from([
        OWNER_CMA_MAGIC,
        2,
        3,
        6 + population,
        ask.ok.generation,
        population,
        ...objectives.ok,
      ]);
      const snapshot = decodeCmaFamilySnapshot(convergenceSession.tell(tell), 4);
      if (!("ok" in snapshot)) {
        throw new Error(`G1 convergence tell refusal ${snapshot.refusal.name}`);
      }
      if (snapshot.ok.best) bestPoint = snapshot.ok.best.point.slice();
    }
  } finally {
    convergenceSession.free();
  }
  const optimized = decodeG1Evaluation(evaluator.evaluate(bestPoint));
  if (!("ok" in optimized))
    throw new Error(`optimized G1 refusal ${optimized.refusal.name}`);
  // Deliberately NOT asserting that this beats the seed. Sixteen generations at
  // sigma 5e-4 is far too short a run to expect any candidate to: the search
  // that does improve the gait needs tens of generations, which is measured in
  // the kernel's own guard (g1_search_makes_it_walk.rs, 80 generations, which
  // asserts the robot walks measurably FURTHER rather than that a number fell).
  // What this test is for is that the shipped package executes the whole
  // ask/tell/evaluate path and returns a usable receipt.
  expect(Number.isFinite(optimized.ok.objective)).toBe(true);
  expect(optimized.ok.completedSteps).toBeGreaterThan(0);
  expect(optimized.ok.completedSteps).toBe(720);
  expect(optimized.ok.terminationReason).toBe("horizon");
  evaluator.free();

  for (const task of [0, 1, 2]) {
    const arm = new wasm.HouseholdManipulationVizEvaluator(
      // Schema-4 config: twelve fixed words, zero overrides, no declared
      // bodies — the packet the browser sends for a preset task. Schema 4
      // added a role word per declared body; with none declared the fixed
      // header is unchanged.
      new Float64Array([0x41524d31, 4, 0, 12, 1 / 90, 6, 3, task, 0, 0, 0, 0]),
    );
    const armAdmission = decodeHouseholdManipulationAdmission(arm.receipt());
    if (!("ok" in armAdmission)) {
      throw new Error(
        `arm task ${task} admission refusal ${armAdmission.refusal.name}`,
      );
    }
    expect(armAdmission.ok.policyDimension).toBe(128);
    expect(armAdmission.ok.linkCount).toBe(8);
    const armMean = arm.curriculum_policy_mean();
    expect(armMean).toHaveLength(128);
    const armEvaluation = decodeHouseholdManipulationEvaluation(
      arm.evaluate(armMean),
    );
    const armTrace = decodeHouseholdManipulationTrace(arm.trace(armMean));
    if (!("ok" in armEvaluation)) {
      throw new Error(
        `arm task ${task} evaluation refusal ${armEvaluation.refusal.name}`,
      );
    }
    if (!("ok" in armTrace)) {
      throw new Error(
        `arm task ${task} trace refusal ${armTrace.refusal.name}`,
      );
    }
    expect(armEvaluation.ok.everGrasped).toBe(true);
    expect(armEvaluation.ok.releasedAfterTransport).toBe(true);
    if (task === 2) {
      expect(armEvaluation.ok.ownerReportedPlaced).toBe(false);
      expect(armEvaluation.ok.collisionRiskIntegral).toBeGreaterThan(0);
      expect(armEvaluation.ok.possibleCollisionTimeSeconds).toBeGreaterThan(0);
      expect(armEvaluation.ok.placed).toBe(false);
    } else {
      expect(armEvaluation.ok.ownerReportedPlaced).toBe(true);
      expect(armEvaluation.ok.collisionRiskIntegral).toBe(0);
      expect(armEvaluation.ok.possibleCollisionTimeSeconds).toBe(0);
      expect(armEvaluation.ok.placed).toBe(true);
    }
    expect(armEvaluation.ok.maximumLiftMeters).toBeGreaterThanOrEqual(
      armAdmission.ok.liftTargetMeters,
    );
    expect(armEvaluation.ok.finalObjectErrorMeters).toBeLessThanOrEqual(
      armAdmission.ok.placementToleranceMeters,
    );
    expect(armTrace.ok.samples.length).toBeGreaterThanOrEqual(100);
    expect(armTrace.ok.samples.some((sample) => sample.grasped)).toBe(true);
    for (const sample of armTrace.ok.samples) {
      const renderedContact = resolveRenderedGripperContactGeometry({
        commandedGripperWidthM: sample.gripperWidthMeters,
        graspHalfWidthM: armAdmission.ok.scene.graspHalfWidthMeters,
        objectHalfHeightM: armAdmission.ok.scene.objectDimensionsMeters[2] * 0.5,
      });
      expect(renderedContact.minimumObjectClearanceM).toBeGreaterThanOrEqual(0.002 - 1e-12);
    }
    arm.free();
  }
}, 60_000);
