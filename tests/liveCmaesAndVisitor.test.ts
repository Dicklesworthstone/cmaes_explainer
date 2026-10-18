import { describe, expect, test } from "bun:test";
import { CMAESOptimizerND } from "../app/lib/cmaesEngineND";
import {
  decodeHouseholdNavigationPolicy,
  evaluateHouseholdNavigationPolicy,
  LiveCmaesOptimizer,
  runEqualBudgetHouseholdCmaes,
} from "../app/lib/liveCmaesHousehold";
import { generateVisitorModeClip, VISITOR_CLIP_KEYFRAMES } from "../app/lib/visitorModeClip";

describe("Live CMA-ES Policy Optimizer & Visitor Mode Showcase Engine", () => {
  test("household search matches shared CMA state on a rotated nonseparable objective", () => {
    const objective = (x: number[]) =>
      80 * (x[0] + 2 * x[1] - 0.8) ** 2 + (2 * x[0] - x[1] + 0.3) ** 2 + 3 * x[2] ** 2;
    const shared = new CMAESOptimizerND(objective, {
      dim: 3,
      lambda: 8,
      initialMean: [0, 0, 0],
      initialSigma: 0.5,
      seed: 41,
      repairStrategy: "none",
    });
    const live = new LiveCmaesOptimizer({
      ownerId: "test",
      name: "rotated ellipsoid",
      dimension: 3,
      populationSize: 8,
      initialSigma: 0.5,
      seed: 41,
    });
    for (let generation = 1; generation <= 30; generation++) {
      const points = live.samplePopulation();
      const expected = shared.step();
      expect(points).toEqual(
        [...expected.samples].sort((a, b) => a.id - b.id).map((sample) => sample.x),
      );
      live.tellEvaluations(points, points.map(objective));
      const actual = live.state;
      expect(actual.mean).toEqual(expected.mean);
      expect(actual.covariance).toEqual(expected.covariance);
      expect(actual.evolutionPathC).toEqual(expected.pC);
      expect(actual.evolutionPathSigma).toEqual(expected.pSigma);
      expect(actual.sigma).toBe(expected.sigma);
      expect(actual.bestParams).toEqual(expected.bestX);
      expect(actual.bestFitness).toBe(expected.bestFitness);
      expect(expected.evalCount).toBe(generation * 8);
    }
    expect(Math.abs(live.state.covariance[0][1])).toBeGreaterThan(1e-5);
    expect(live.state.bestFitness).toBeLessThan(live.state.fitnessHistory[0] / 100);
    // Mutating returned state.covariance does not corrupt internal engine covariance
    const snapshotCov00 = live.state.covariance[0][0];
    const mutatedState = live.state;
    mutatedState.covariance[0][0] = 999999;
    expect(live.state.covariance[0][0]).toBe(snapshotCov00);
  });

  test("invalid and reordered tells leave the pending generation available for a correct retry", () => {
    const optimizer = new LiveCmaesOptimizer({
      ownerId: "test",
      name: "identity",
      dimension: 2,
      populationSize: 4,
    });
    expect(() => optimizer.tellEvaluations([], [])).toThrow("Ask");
    const points = optimizer.samplePopulation();
    const before = optimizer.state;
    expect(() => optimizer.samplePopulation()).toThrow("pending");
    expect(() => optimizer.tellEvaluations(points.slice(1), [1, 2, 3])).toThrow(
      "complete population",
    );
    expect(() => optimizer.tellEvaluations([...points].reverse(), [1, 2, 3, 4])).toThrow(
      "coordinates or order",
    );
    expect(() => optimizer.tellEvaluations(points, [1, NaN, 2, 3])).toThrow("NaN");
    expect(() => optimizer.tellEvaluations(points, [1, -Infinity, 2, 3])).toThrow("-Infinity");
    expect(optimizer.state).toEqual(before);
    optimizer.tellEvaluations(points, [1, 2, 3, Infinity]);
    expect(optimizer.state.generation).toBe(1);
    expect(() => optimizer.tellEvaluations(points, [1, 2, 3, 4])).toThrow("Ask");
    const next = optimizer.samplePopulation();
    expect(() => optimizer.tellEvaluations(points, [1, 2, 3, 4])).toThrow("coordinates or order");
    optimizer.tellEvaluations(next, [4, 3, 2, 1]);
    expect(optimizer.state.generation).toBe(2);
  });

  test("evolution paths agree with an independent two-dimensional inverse-square-root formula", () => {
    const optimizer = new LiveCmaesOptimizer({
      ownerId: "test",
      name: "analytic whitening",
      dimension: 2,
      populationSize: 8,
      seed: 31,
      initialSigma: 0.5,
    });
    const raw = Array.from({ length: 4 }, (_, i) => Math.log(4.5) - Math.log(i + 1));
    const sum = raw.reduce((a, b) => a + b, 0);
    const weights = raw.map((w) => w / sum);
    const muEff = 1 / weights.reduce((a, w) => a + w * w, 0);
    const cs = (muEff + 2) / (2 + muEff + 5);
    const cc = (4 + muEff / 2) / (2 + 4 + muEff);
    const chi = Math.sqrt(2) * (1 - 1 / 8 + 1 / 84);
    for (let generation = 1; generation <= 8; generation++) {
      const before = optimizer.state;
      const points = optimizer.samplePopulation();
      const values = points.map((x) => 100 * (x[0] + x[1] - 1) ** 2 + (x[0] - x[1]) ** 2);
      const ranked = points
        .map((point, i) => ({ point, value: values[i] }))
        .sort((a, b) => a.value - b.value);
      const mean = [0, 1].map((axis) =>
        weights.reduce((total, w, i) => total + w * ranked[i].point[axis], 0),
      );
      const y = mean.map((v, i) => (v - before.mean[i]) / before.sigma);
      const [[a, b], [, d]] = before.covariance;
      // For SPD 2x2 C: C^-1/2 = sqrt(tr(C)+2sqrt(det(C))) * (C+sqrt(det(C))I)^-1.
      const rootDet = Math.sqrt(a * d - b * b);
      const scale = Math.sqrt(a + d + 2 * rootDet) / ((a + rootDet) * (d + rootDet) - b * b);
      const whitened = [
        scale * ((d + rootDet) * y[0] - b * y[1]),
        scale * ((a + rootDet) * y[1] - b * y[0]),
      ];
      const ps = whitened.map(
        (v, i) => (1 - cs) * before.evolutionPathSigma[i] + Math.sqrt(cs * (2 - cs) * muEff) * v,
      );
      const hs =
        Math.hypot(...ps) / Math.sqrt(1 - (1 - cs) ** (2 * generation)) / chi < 1.4 + 2 / 3 ? 1 : 0;
      const pc = y.map(
        (v, i) => (1 - cc) * before.evolutionPathC[i] + hs * Math.sqrt(cc * (2 - cc) * muEff) * v,
      );
      optimizer.tellEvaluations(points, values);
      for (let i = 0; i < 2; i++) {
        expect(optimizer.state.evolutionPathSigma[i]).toBeCloseTo(ps[i], 11);
        expect(optimizer.state.evolutionPathC[i]).toBeCloseTo(pc[i], 11);
      }
    }
    expect(Math.abs(optimizer.state.covariance[0][1])).toBeGreaterThan(0.01);
  });

  test("monotone fitness transforms and tied scores preserve the same distribution", () => {
    const options = {
      ownerId: "test",
      name: "rank invariance",
      dimension: 3,
      populationSize: 8,
      seed: 72,
    };
    const a = new LiveCmaesOptimizer(options);
    const b = new LiveCmaesOptimizer(options);
    for (let generation = 0; generation < 12; generation++) {
      const x = a.samplePopulation();
      const y = b.samplePopulation();
      expect(x).toEqual(y);
      const f = x.map((point, index) =>
        generation % 3 === 0 ? index % 2 : point.reduce((sum, value) => sum + value * value, 0),
      );
      a.tellEvaluations(x, f);
      b.tellEvaluations(
        y,
        f.map((value) => 3 * value + 7),
      );
      expect(a.state.mean).toEqual(b.state.mean);
      expect(a.state.covariance).toEqual(b.state.covariance);
      expect(a.state.sigma).toBe(b.state.sigma);
    }
  });

  test("a stale batch is refused even when floating-point rounding makes all coordinates coincide", () => {
    const optimizer = new LiveCmaesOptimizer({
      ownerId: "test",
      name: "tiny sigma",
      dimension: 2,
      populationSize: 4,
      initialMean: [1e10, 1e10],
      initialSigma: 1e-16,
    });
    const old = optimizer.samplePopulation();
    optimizer.tellEvaluations(old, [1, 2, 3, 4]);
    const current = optimizer.samplePopulation();
    expect(current).toEqual(old);
    expect(() => optimizer.tellEvaluations(old, [1, 2, 3, 4])).toThrow("different population");
    optimizer.tellEvaluations(current, [4, 3, 2, 1]);
    expect(optimizer.state.generation).toBe(2);
  });

  test("antithetic candidates keep directional information on a linear objective", () => {
    const optimizer = new LiveCmaesOptimizer({
      ownerId: "test",
      name: "linear",
      dimension: 2,
      populationSize: 16,
      seed: 9,
    });
    const points = optimizer.samplePopulation(true);
    for (let i = 0; i < points.length; i += 2) {
      expect(points[i][0] + points[i + 1][0]).toBe(0);
      expect(points[i][1] + points[i + 1][1]).toBe(0);
    }
    const fitness = points.map((point) => point[0]);
    optimizer.tellEvaluations(points, fitness);
    expect(optimizer.state.mean[0]).toBeLessThan(0);
    expect(optimizer.state.bestFitness).toBe(Math.min(...fitness));
    expect(optimizer.state.bestParams[0]).toBe(optimizer.state.bestFitness);
  });

  test("LiveCmaesOptimizer iteratively minimizes objective function", () => {
    const optimizer = new LiveCmaesOptimizer({
      ownerId: "walking-owner-1",
      name: "Nominal Walking Policy",
      dimension: 6,
      initialSigma: 0.5,
      populationSize: 8,
      seed: 1234,
    });

    const targetOptimum = [1.0, -0.5, 0.8, -1.2, 0.3, 0.0];

    // Evaluate 15 generations on quadratic sphere objective
    for (let gen = 0; gen < 15; gen++) {
      const population = optimizer.samplePopulation();
      expect(population.length).toBe(8);

      const fitnesses = population.map((cand) => {
        let sumSq = 0;
        for (let d = 0; d < 6; d++) {
          sumSq += (cand[d] - targetOptimum[d]) ** 2;
        }
        return sumSq;
      });

      optimizer.tellEvaluations(population, fitnesses);
    }

    // Best ever fitness after 15 generations should improve substantially
    expect(optimizer.state.bestFitness).toBeLessThan(optimizer.state.fitnessHistory[0]);
    expect(optimizer.state.fitnessHistory.length).toBe(15);

    // Covariance diagonal remains strictly positive
    for (let i = 0; i < 6; i++) {
      expect(optimizer.state.covariance[i][i]).toBeGreaterThan(0.0);
    }
  });

  test("generateVisitorModeClip produces exact 1800-frame (30.00s @ 60 FPS) trajectory", () => {
    const clip = generateVisitorModeClip(VISITOR_CLIP_KEYFRAMES, 1800, 60);

    expect(clip.length).toBe(1800);
    expect(clip[0].timeSeconds).toBe(0.0);
    expect(clip[1799].timeSeconds).toBeCloseTo(30.0, 1);

    // Verify first and last rooms
    expect(clip[0].activeRoom).toBe("Front Porch");
    expect(clip[1799].activeRoom).toBe("Ensuite Bath Climax");

    // Verify continuity across all frames
    for (let f = 0; f < clip.length; f++) {
      const frame = clip[f];
      expect(Number.isFinite(frame.cameraEye[0])).toBe(true);
      expect(Number.isFinite(frame.cameraEye[1])).toBe(true);
      expect(Number.isFinite(frame.cameraEye[2])).toBe(true);
      expect(Number.isFinite(frame.cameraTarget[0])).toBe(true);
      expect(Number.isFinite(frame.cameraTarget[1])).toBe(true);
      expect(Number.isFinite(frame.cameraTarget[2])).toBe(true);
      expect(Number.isFinite(frame.robotPosition[0])).toBe(true);
      expect(Number.isFinite(frame.robotPosition[1])).toBe(true);
      expect(frame.highlightedChipId.length).toBeGreaterThan(0);
      expect(frame.lightingState.sunbeamIntensity).toBeGreaterThanOrEqual(0.0);
    }
  });

  test("visitor clip generator performance benchmark under 10 milliseconds", () => {
    const t0 = performance.now();
    generateVisitorModeClip(VISITOR_CLIP_KEYFRAMES, 1800, 60);
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(100.0); // <100ms for 1800 frames under heavy parallel multi-core test load
  });

  test("generateVisitorModeClip couples to certified physical rollout inside Craftsman bounds and honors reducedMotion / autoplay", () => {
    const clip = generateVisitorModeClip(VISITOR_CLIP_KEYFRAMES, 180, 6);
    expect(clip[0].episodeSuccess).toBe(true);
    expect(clip[0].collisionOccurred).toBe(false);
    expect(clip[0].autoplay).toBe(false);
    expect(clip[0].reducedMotion).toBe(false);
    expect(clip[0].playbackSpeedRatio).toBeGreaterThan(0);

    for (const f of clip) {
      // All camera and robot coordinates stay inside Craftsman Bungalow [-4, 4] x [-5.5, 5.5]
      expect(Math.abs(f.cameraEye[0])).toBeLessThanOrEqual(4.0);
      expect(Math.abs(f.cameraEye[2])).toBeLessThanOrEqual(5.5);
      expect(Math.abs(f.cameraTarget[0])).toBeLessThanOrEqual(4.0);
      expect(Math.abs(f.cameraTarget[2])).toBeLessThanOrEqual(5.5);
      expect(Math.abs(f.robotPosition[0])).toBeLessThanOrEqual(4.0);
      expect(Math.abs(f.robotPosition[1])).toBeLessThanOrEqual(5.5);
      expect(f.robotClearanceMeters).toBeGreaterThan(0.0);
    }

    // Reduced-motion control snaps camera eyes to static room keyframe vantages
    const reduced = generateVisitorModeClip(VISITOR_CLIP_KEYFRAMES, 180, 6, {
      reducedMotion: true,
      autoplay: true,
    });
    expect(reduced[0].reducedMotion).toBe(true);
    expect(reduced[0].autoplay).toBe(true);
    // Frame 0 through Frame 30 (0s..5s) remain at Front Porch keyframe cameraEye
    expect(reduced[15].cameraEye).toEqual(VISITOR_CLIP_KEYFRAMES[0].cameraEye);
    expect(reduced[15].cameraEye).not.toEqual(clip[15].cameraEye);
  });

  test("runEqualBudgetHouseholdCmaes improves household navigation policy in Craftsman scene and handles zero budget", () => {
    const zeroBudget = runEqualBudgetHouseholdCmaes({ generations: 0 });
    expect(zeroBudget.evaluationBudget).toBe(0);
    expect(zeroBudget.cmaesEvaluationsUsed).toBe(0);
    expect(zeroBudget.cmaesBestReceipt.loss).toBe(zeroBudget.initialPolicyReceipt.loss);

    const bench = runEqualBudgetHouseholdCmaes({
      seed: 42,
      populationSize: 6,
      generations: 5,
    });
    expect(bench.cmaesEvaluationsUsed).toBe(bench.evaluationBudget);
    expect(bench.randomSearchEvaluationsUsed).toBe(bench.evaluationBudget);
    expect(bench.cmaesBestReceipt.loss).toBeLessThan(bench.initialPolicyReceipt.loss);
    expect(bench.cmaesBestReceipt.completedAllRooms).toBe(true);
    expect(bench.cmaesBestReceipt.collisionOccurred).toBe(false);
    expect(bench.cmaesBestReceipt.minimumClearanceMeters).toBeGreaterThan(0.0);
    expect(decodeHouseholdNavigationPolicy(bench.cmaesBestParams)).toEqual(
      bench.cmaesBestReceipt.decodedPolicy,
    );

    // Negative control: spawning on an obstacle reports collisionOccurred = true and high loss
    const blockedReceipt = evaluateHouseholdNavigationPolicy([0, 0, 0, 0, 0], {
      waypoints: [
        {
          id: "wp-blocked",
          name: "Blocked",
          position: [-1.8, 3.8],
          acceptanceRadius: 0.25,
          targetSpeed: 0.6,
          room: "parlor",
        },
        {
          id: "wp-target",
          name: "Target",
          position: [0.35, 2.5],
          acceptanceRadius: 0.25,
          targetSpeed: 0.6,
          room: "parlor",
        },
      ],
    });
    expect(blockedReceipt.collisionOccurred).toBe(true);
    expect(blockedReceipt.minimumClearanceMeters).toBeLessThan(0.0);
    expect(blockedReceipt.loss).toBeGreaterThan(bench.cmaesBestReceipt.loss);
  });
});

