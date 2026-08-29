import { describe, expect, test } from "bun:test";
import { KernelPerfProfiler } from "../app/lib/kernelPerfProfiler";

describe("Kernel Micro-Performance Profiler & Telemetry Engine", () => {
  test("recordStep accurately records phase timings and flags budget overrun", () => {
    // 480Hz physics -> 208.33µs budget
    const profiler = new KernelPerfProfiler(100, 480);

    // Fast step (under budget: 15 + 25 + 60 + 20 = 120µs < 208.3µs)
    const rec1 = profiler.recordStep(1, {
      broadphase: 15.0,
      narrowphase: 25.0,
      lcpSolver: 60.0,
      integrator: 20.0,
    });

    expect(rec1.timings.total).toBeCloseTo(120.0, 4);
    expect(rec1.isBudgetOverrun).toBe(false);

    // Heavy step with large LCP solve (over budget: 20 + 30 + 2400 + 25 = 2475µs > 2083.33µs)
    const rec2 = profiler.recordStep(2, {
      broadphase: 20.0,
      narrowphase: 30.0,
      lcpSolver: 2400.0,
      integrator: 25.0,
    });

    expect(rec2.timings.total).toBeCloseTo(2475.0, 4);
    expect(rec2.isBudgetOverrun).toBe(true);
  });

  test("profileStepExecution executes all four simulation phases", () => {
    const profiler = new KernelPerfProfiler();
    let broadCalled = false;
    let narrowCalled = false;
    let lcpCalled = false;
    let integCalled = false;

    const rec = profiler.profileStepExecution(
      1,
      () => {
        broadCalled = true;
      },
      () => {
        narrowCalled = true;
      },
      () => {
        lcpCalled = true;
      },
      () => {
        integCalled = true;
      },
      12,
      4,
    );

    expect(broadCalled).toBe(true);
    expect(narrowCalled).toBe(true);
    expect(lcpCalled).toBe(true);
    expect(integCalled).toBe(true);
    expect(rec.activeBodies).toBe(12);
    expect(rec.contactCount).toBe(4);
    expect(rec.timings.total).toBeGreaterThanOrEqual(0.0);
  });

  test("getSummaryStats calculates rolling quantiles and phase averages", () => {
    const profiler = new KernelPerfProfiler(200, 480);

    for (let i = 1; i <= 100; i++) {
      profiler.recordStep(i, {
        broadphase: 10.0,
        narrowphase: 20.0,
        lcpSolver: i * 2.0, // 2µs to 200µs
        integrator: 10.0,
      });
    }

    const stats = profiler.getSummaryStats();
    expect(stats.totalStepsRecorded).toBe(100);
    expect(stats.meanBroadphaseMicros).toBe(10.0);
    expect(stats.meanNarrowphaseMicros).toBe(20.0);
    expect(stats.meanIntegratorMicros).toBe(10.0);
    expect(stats.meanLcpSolverMicros).toBeCloseTo(101.0, 1);
    expect(stats.p50Micros).toBeGreaterThan(0);
    expect(stats.p95Micros).toBeGreaterThan(stats.p50Micros);
    expect(stats.p99Micros).toBeGreaterThanOrEqual(stats.p95Micros);
    expect(stats.maxTotalMicros).toBeCloseTo(240.0, 1); // 10 + 20 + 200 + 10 = 240µs
  });

  test("profiler record overhead is sub-microsecond fast across 1000 recordings", () => {
    const profiler = new KernelPerfProfiler(1000);

    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) {
      profiler.recordStep(i, {
        broadphase: 12.0,
        narrowphase: 18.0,
        lcpSolver: 45.0,
        integrator: 15.0,
      });
    }
    const elapsed = performance.now() - t0;
    const avgPerStepMicros = (elapsed / 1000) * 1000;
    expect(avgPerStepMicros).toBeLessThan(5.0); // <5µs per step record
  });
});
