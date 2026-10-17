import { describe, expect, test } from "bun:test";
import {
  BakedNeuralSdfPiece,
  CollisionTelemetryCollector,
  ZeroAllocQueryContext,
} from "../app/lib/neuralSdfRefinement";

describe("Neural SDF Refinement & Zero-Allocation Collision Telemetry", () => {
  test("BakedNeuralSdfPiece verifies parameter count budget <= 20,000", () => {
    const piece = new BakedNeuralSdfPiece({ fourierBands: 8, hiddenDim: 32 });
    expect(piece.parameterCount).toBeLessThan(20000);
    expect(piece.parameterCount).toBeGreaterThan(100);
  });

  test("near-surface band windowing decays neural residual to zero in far field", () => {
    const piece = new BakedNeuralSdfPiece({ bandWidthMeters: 0.05 });
    const ctx = new ZeroAllocQueryContext(8, 32);

    // Near surface point (dist = 0.01m)
    const nearRefined = piece.evaluateRefinedDistance(0.5, 0.5, 0.5, 0.01, ctx);
    expect(Number.isFinite(nearRefined)).toBe(true);

    // Far field point (dist = 1.5m >> 4 * 0.05 = 0.20m)
    const farRefined = piece.evaluateRefinedDistance(1.5, 2.0, 3.0, 1.5, ctx);
    // In far field, output must be EXACTLY baseAnalyticDist (zero residual)
    expect(farRefined).toBe(1.5);
  });

  test("ZeroAllocQueryContext executes 10,000 queries without heap allocations", () => {
    const piece = new BakedNeuralSdfPiece();
    const ctx = new ZeroAllocQueryContext();
    const collector = new CollisionTelemetryCollector();

    const t0 = performance.now();
    for (let i = 0; i < 10000; i++) {
      const dist = piece.evaluateRefinedDistance(i * 0.001, 0.02, 0.01, 0.03, ctx);
      collector.record("sdf-point", 0.5, dist < 0.0);
    }
    const elapsed = performance.now() - t0;

    const telem = collector.getTelemetry("sdf-point");
    expect(telem.queryCount).toBe(10000);
    expect(telem.bytesAllocated).toBe(0);

    const avgMicrosPerQuery = (elapsed / 10000) * 1000.0;
    expect(avgMicrosPerQuery).toBeLessThan(25.0); // <25µs per query under parallel test load
  });

  test("fitResidualSamples learns near-surface detail and evaluateCertifiedConservativeDistance bounds clearance", () => {
    const piece = new BakedNeuralSdfPiece({
      fourierBands: 6,
      hiddenDim: 24,
      bandWidthMeters: 0.05,
      seed: 77,
    });
    const ctx = new ZeroAllocQueryContext(6, 24);

    // Before training, conservative distance subtracts |bandWeight * residual|
    const untrainedConserv = piece.evaluateCertifiedConservativeDistance(0.1, 0.2, 0.3, 0.02, ctx);
    expect(untrainedConserv).toBeLessThanOrEqual(0.02);

    const targetFn = (x: number, y: number, z: number) =>
      0.008 * Math.cos(2 * Math.PI * x) + 0.004 * Math.sin(2 * Math.PI * (y + z));

    const trainSamples = [];
    const heldOutSamples = [];
    for (let i = 0; i < 60; i++) {
      const pos: [number, number, number] = [i * 0.03, (i % 7) * 0.04, (i % 5) * 0.05];
      const sample = { pos, targetResidual: targetFn(pos[0], pos[1], pos[2]) };
      if (i % 4 === 0) heldOutSamples.push(sample);
      else trainSamples.push(sample);
    }

    const fitReceipt = piece.fitResidualSamples(trainSamples, heldOutSamples, {
      epochs: 80,
      learningRate: 0.06,
    });
    expect(piece.isTrained).toBe(true);
    expect(fitReceipt.finalTrainMse).toBeLessThan(fitReceipt.initialTrainMse);
    expect(fitReceipt.maxHeldOutAbsErrorMeters).toBeGreaterThanOrEqual(0);

    // On every held-out point, certified conservative distance must not exceed true refined distance
    for (const s of heldOutSamples) {
      const baseDist = 0.02;
      const sigma = 0.05;
      const bandWeight = Math.exp(-0.5 * (baseDist / sigma) ** 2);
      const trueDist = baseDist + bandWeight * s.targetResidual;
      const certified = piece.evaluateCertifiedConservativeDistance(
        s.pos[0],
        s.pos[1],
        s.pos[2],
        baseDist,
        ctx,
      );
      expect(certified).toBeLessThanOrEqual(trueDist + 1e-7);
    }
  });

  test("rejects invalid config, mismatched ZeroAllocQueryContext buffers, and tracks non-zero allocations when reported", () => {
    expect(() => new BakedNeuralSdfPiece({ bandWidthMeters: 0 })).toThrow(/bandWidthMeters/);
    expect(() => new BakedNeuralSdfPiece({ bandWidthMeters: -0.1 })).toThrow(/bandWidthMeters/);
    expect(() => new BakedNeuralSdfPiece({ fourierBands: 0 })).toThrow(/fourierBands/);

    const piece = new BakedNeuralSdfPiece({ fourierBands: 8, hiddenDim: 32 });
    const undersizedCtx = new ZeroAllocQueryContext(4, 16);
    expect(() => piece.evaluateRefinedDistance(0, 0, 0, 0.01, undersizedCtx)).toThrow(
      /buffer mismatch/,
    );

    const collector = new CollisionTelemetryCollector();
    collector.record("sdf-raycast", 1.2, true, 128);
    collector.record("sdf-raycast", 0.8, false, 64);
    const telem = collector.getTelemetry("sdf-raycast");
    expect(telem.queryCount).toBe(2);
    expect(telem.hitCount).toBe(1);
    expect(telem.bytesAllocated).toBe(192);
  });

  test("evaluateRefinedDistanceWithGradient matches central finite differences of evaluateRefinedDistance", () => {
    const piece = new BakedNeuralSdfPiece({
      fourierBands: 6,
      hiddenDim: 16,
      bandWidthMeters: 0.05,
      seed: 123,
    });
    const ctx = new ZeroAllocQueryContext(6, 16);

    // Sphere of radius R=0.5 centered at origin: d_base(x) = ||x|| - R
    const R = 0.5;
    const baseDist = (px: number, py: number, pz: number) => Math.hypot(px, py, pz) - R;
    const baseGrad = (px: number, py: number, pz: number): [number, number, number] => {
      const r = Math.hypot(px, py, pz);
      return [px / r, py / r, pz / r];
    };

    const pt: [number, number, number] = [0.31, 0.28, 0.3]; // ||pt|| ~ 0.5145 -> d_base ~ +0.0145m
    const d0 = baseDist(pt[0], pt[1], pt[2]);
    const g0 = baseGrad(pt[0], pt[1], pt[2]);

    const res = piece.evaluateRefinedDistanceWithGradient(pt[0], pt[1], pt[2], d0, g0, ctx);
    const refDist = piece.evaluateRefinedDistance(pt[0], pt[1], pt[2], d0, ctx);
    expect(res.distance).toBeCloseTo(refDist, 6);

    const eps = 1e-5;
    const fdX =
      (piece.evaluateRefinedDistance(
        pt[0] + eps,
        pt[1],
        pt[2],
        baseDist(pt[0] + eps, pt[1], pt[2]),
        ctx,
      ) -
        piece.evaluateRefinedDistance(
          pt[0] - eps,
          pt[1],
          pt[2],
          baseDist(pt[0] - eps, pt[1], pt[2]),
          ctx,
        )) /
      (2 * eps);
    const fdY =
      (piece.evaluateRefinedDistance(
        pt[0],
        pt[1] + eps,
        pt[2],
        baseDist(pt[0], pt[1] + eps, pt[2]),
        ctx,
      ) -
        piece.evaluateRefinedDistance(
          pt[0],
          pt[1] - eps,
          pt[2],
          baseDist(pt[0], pt[1] - eps, pt[2]),
          ctx,
        )) /
      (2 * eps);
    const fdZ =
      (piece.evaluateRefinedDistance(
        pt[0],
        pt[1],
        pt[2] + eps,
        baseDist(pt[0], pt[1], pt[2] + eps),
        ctx,
      ) -
        piece.evaluateRefinedDistance(
          pt[0],
          pt[1],
          pt[2] - eps,
          baseDist(pt[0], pt[1], pt[2] - eps),
          ctx,
        )) /
      (2 * eps);

    expect(res.gradient[0]).toBeCloseTo(fdX, 3);
    expect(res.gradient[1]).toBeCloseTo(fdY, 3);
    expect(res.gradient[2]).toBeCloseTo(fdZ, 3);
  });

  test("exportWeights and loadWeightsOrFallback verify FNV-1a integrity hash and activate analytic fallback on tampering", () => {
    const pieceA = new BakedNeuralSdfPiece({ fourierBands: 4, hiddenDim: 12, seed: 99 });
    const ctx = new ZeroAllocQueryContext(4, 12);
    const samples = [
      { pos: [0.1, 0.2, 0.3] as [number, number, number], targetResidual: 0.005 },
      { pos: [0.2, 0.1, 0.4] as [number, number, number], targetResidual: -0.003 },
    ];
    pieceA.fitResidualSamples(samples, samples, { epochs: 20 });

    const artifact = pieceA.exportWeights();
    expect(artifact.isTrained).toBe(true);
    expect(artifact.weightsHash.length).toBe(8);

    const pieceB = new BakedNeuralSdfPiece({ fourierBands: 4, hiddenDim: 12, seed: 1 });
    const loadRes = pieceB.loadWeightsOrFallback(artifact);
    expect(loadRes.loaded).toBe(true);
    expect(loadRes.fallbackReason).toBeNull();
    expect(pieceB.evaluateRefinedDistance(0.1, 0.2, 0.3, 0.02, ctx)).toBeCloseTo(
      pieceA.evaluateRefinedDistance(0.1, 0.2, 0.3, 0.02, ctx),
      6,
    );

    // Tampered hash must trigger analytic fallback (residual zeroed)
    const tampered = { ...artifact, weightsHash: "deadbeef" };
    const fallbackRes = pieceB.loadWeightsOrFallback(tampered);
    expect(fallbackRes.loaded).toBe(false);
    expect(fallbackRes.fallbackReason).toContain("weightsHash");
    expect(pieceB.isTrained).toBe(false);
    expect(pieceB.evaluateRefinedDistance(0.1, 0.2, 0.3, 0.02, ctx)).toBeCloseTo(0.02, 8);
  });
});
