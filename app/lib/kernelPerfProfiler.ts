// Kernel Micro-Performance Profiler & Telemetry Engine (cmaes-feat-ph14-perf).
//
// Implements high-resolution microsecond telemetry timers, phase breakdown recording
// (broadphase, narrowphase, LCP solver, integrator), rolling quantile estimation (p50, p95, p99),
// and physics budget overrun detection across Frankensim dynamic physics simulation steps.
//
// Mathematical Formulations:
//   - Total Step Timing Identity:
//       t_{\text{total}} = t_{\text{broadphase}} + t_{\text{narrowphase}} + t_{\text{lcp}} + t_{\text{integrator}} + t_{\text{overhead}}
//   - Rolling Quantile Estimation (Nearest-Rank / P-Square Method):
//       p_k = X_{\lceil \frac{k}{100} N \rceil} \quad \text{for sorted sample buffer } X
//   - Timing Jitter Standard Deviation:
//       \sigma = \sqrt{\frac{1}{N} \sum_{i=1}^N (t_i - \bar{t})^2}
//   - Physics Step Budget Gating (e.g. 480Hz -> 208.3µs budget):
//       \text{OverrunRatio} = \frac{t_{\text{total}}}{T_{\text{budget}}}, \quad \text{IsOverrun} = t_{\text{total}} > T_{\text{budget}}
//
// SOTA References:
//   - Jain & Chlamtac, "The P2 Algorithm for Dynamic Quantile and Histogram Estimation without Storing Observations" (CACM 1985)
//   - Bullet3 / PhysX 5 Telemetry & PVD Profiling Protocols (2024)

export interface StepPhaseTimingsMicros {
  broadphase: number;
  narrowphase: number;
  lcpSolver: number;
  integrator: number;
  total: number;
}

export interface StepTelemetryRecord {
  stepIndex: number;
  timestampSeconds: number;
  timings: StepPhaseTimingsMicros;
  activeBodies: number;
  contactCount: number;
  isBudgetOverrun: boolean;
}

export interface ProfilerSummaryStats {
  totalStepsRecorded: number;
  meanTotalMicros: number;
  stdDevMicros: number;
  p50Micros: number;
  p95Micros: number;
  p99Micros: number;
  maxTotalMicros: number;
  meanBroadphaseMicros: number;
  meanNarrowphaseMicros: number;
  meanLcpSolverMicros: number;
  meanIntegratorMicros: number;
  budgetOverrunCount: number;
  budgetOverrunPercent: number;
}

export class KernelPerfProfiler {
  private bufferSize: number;
  private budgetMicros: number;
  private records: StepTelemetryRecord[] = [];

  constructor(bufferSize = 1000, targetFreqHz = 480) {
    this.bufferSize = bufferSize;
    // Budget in microseconds: (1 / freq) * 1e6
    this.budgetMicros = (1.0 / targetFreqHz) * 1e6;
  }

  /**
   * Records execution timing breakdown for a completed simulation step.
   */
  public recordStep(
    stepIndex: number,
    timings: Omit<StepPhaseTimingsMicros, "total"> & { total?: number },
    activeBodies = 0,
    contactCount = 0,
    timestampSeconds = 0,
  ): StepTelemetryRecord {
    const calculatedTotal =
      timings.total ??
      timings.broadphase +
        timings.narrowphase +
        timings.lcpSolver +
        timings.integrator;

    const record: StepTelemetryRecord = {
      stepIndex,
      timestampSeconds,
      timings: {
        broadphase: timings.broadphase,
        narrowphase: timings.narrowphase,
        lcpSolver: timings.lcpSolver,
        integrator: timings.integrator,
        total: calculatedTotal,
      },
      activeBodies,
      contactCount,
      isBudgetOverrun: calculatedTotal > this.budgetMicros,
    };

    this.records.push(record);
    if (this.records.length > this.bufferSize) {
      this.records.shift();
    }

    return record;
  }

  /**
   * Profiles an inline physics step function execution with phase timers.
   */
  public profileStepExecution(
    stepIndex: number,
    runBroadphase: () => void,
    runNarrowphase: () => void,
    runLcp: () => void,
    runIntegrator: () => void,
    activeBodies = 0,
    contactCount = 0,
  ): StepTelemetryRecord {
    const t0 = performance.now();
    runBroadphase();
    const t1 = performance.now();
    runNarrowphase();
    const t2 = performance.now();
    runLcp();
    const t3 = performance.now();
    runIntegrator();
    const t4 = performance.now();

    const broadphaseMicros = (t1 - t0) * 1000.0;
    const narrowphaseMicros = (t2 - t1) * 1000.0;
    const lcpMicros = (t3 - t2) * 1000.0;
    const integratorMicros = (t4 - t3) * 1000.0;
    const totalMicros = (t4 - t0) * 1000.0;

    return this.recordStep(
      stepIndex,
      {
        broadphase: broadphaseMicros,
        narrowphase: narrowphaseMicros,
        lcpSolver: lcpMicros,
        integrator: integratorMicros,
        total: totalMicros,
      },
      activeBodies,
      contactCount,
    );
  }

  /**
   * Computes comprehensive statistics and rolling quantiles across recorded steps.
   */
  public getSummaryStats(): ProfilerSummaryStats {
    if (this.records.length === 0) {
      return {
        totalStepsRecorded: 0,
        meanTotalMicros: 0,
        stdDevMicros: 0,
        p50Micros: 0,
        p95Micros: 0,
        p99Micros: 0,
        maxTotalMicros: 0,
        meanBroadphaseMicros: 0,
        meanNarrowphaseMicros: 0,
        meanLcpSolverMicros: 0,
        meanIntegratorMicros: 0,
        budgetOverrunCount: 0,
        budgetOverrunPercent: 0,
      };
    }

    const n = this.records.length;
    let sumTotal = 0;
    let sumBroad = 0;
    let sumNarrow = 0;
    let sumLcp = 0;
    let sumInteg = 0;
    let overruns = 0;

    const totals: number[] = [];

    for (const r of this.records) {
      const t = r.timings;
      totals.push(t.total);
      sumTotal += t.total;
      sumBroad += t.broadphase;
      sumNarrow += t.narrowphase;
      sumLcp += t.lcpSolver;
      sumInteg += t.integrator;
      if (r.isBudgetOverrun) overruns++;
    }

    const meanTotal = sumTotal / n;
    let sumSqDiff = 0;
    for (const t of totals) {
      sumSqDiff += (t - meanTotal) ** 2;
    }
    const stdDev = Math.sqrt(sumSqDiff / n);

    // Compute sorted quantiles
    totals.sort((a, b) => a - b);
    const p50 = totals[Math.floor(n * 0.5)];
    const p95 = totals[Math.min(n - 1, Math.floor(n * 0.95))];
    const p99 = totals[Math.min(n - 1, Math.floor(n * 0.99))];
    const maxTotal = totals[n - 1];

    return {
      totalStepsRecorded: n,
      meanTotalMicros: meanTotal,
      stdDevMicros: stdDev,
      p50Micros: p50,
      p95Micros: p95,
      p99Micros: p99,
      maxTotalMicros: maxTotal,
      meanBroadphaseMicros: sumBroad / n,
      meanNarrowphaseMicros: sumNarrow / n,
      meanLcpSolverMicros: sumLcp / n,
      meanIntegratorMicros: sumInteg / n,
      budgetOverrunCount: overruns,
      budgetOverrunPercent: (overruns / n) * 100.0,
    };
  }

  public getRecentRecords(count = 50): StepTelemetryRecord[] {
    return this.records.slice(-count);
  }

  public clear(): void {
    this.records = [];
  }
}
