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
});
