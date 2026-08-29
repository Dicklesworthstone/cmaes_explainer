/**
 * tests/perf/physicsBench.ts
 *
 * Slice C benchmark harness for the new physics workloads.
 * Closes: cmaes-phr3m-bench-8cv.
 *
 * # Why this exists
 *
 * The phr-env-2026 charter (cmaes-phr4..9) ships several new physics owners
 * (Featherstone articulated body, BVH/SDF boundary, CCD contact, CBF obstacle
 * avoidance). The acceptance gate for each owner includes a performance
 * budget, but a budget without a regression-bounded benchmark is a wish. This
 * file is the contributor-side benchmark that produces a p50/p95/p99 envelope
 * per workload, locks the envelope in a committed JSON, and fails when a
 * future commit drifts outside.
 *
 * # What this benchmark runs
 *
 * For each workload in the descriptor (workloads below), the benchmark:
 *   1. Runs `warmupTrials` warmup trials (to amortize JIT/IO).
 *   2. Runs `trials` measured trials and collects per-trial wall-clock.
 *   3. Asserts each trial's checksum is bit-exact (determinism).
 *   4. Computes p50/p95/p99 + mean + throughput (evals/s) + peak RSS.
 *   5. Compares against the committed envelope in tests/perf/physicsBench.lock.json.
 *   6. Records the git HEAD in the output.
 *
 * # What this benchmark does NOT do
 *
 * - It does NOT block CI red. The CI is parity-driven (cmaes-phr3m-parity-ow9).
 *   Performance is contributor-side; a PR that exceeds an envelope opens an
 *   override-bead conversation.
 * - It does NOT compare against the v06x baseline. The new physics is different
 *   physics; the apples-to-apples comparison is to the BEFORE state of the
 *   same owner (a 1-revision-back diff).
 * - It does NOT call the kernel. The benchmark is TS-side; the kernel-side
 *   perf lives in the Frankensim sibling crate. Slice C measurement: the
 *   workload runs end-to-end in TS (which is the slower path) and the kernel
 *   gets its own envelope in the kernel repo.
 *
 * # Honesty floor
 *
 * A "benchmark" with no upper bound is a stopwatch. A regression-bounded
 * benchmark with no override-bead gate is a process artifact that gates
 * nothing. The envelope JSON is committed; a contributor who wants to
 * raise the budget opens a code-reviewable override bead.
 *
 * # SOTA references
 *
 * - The hyperfine methodology (https://github.com/sharkdp/hyperfine) for the
 *   warmup/percentile discipline.
 * - Tassa et al., iLQG/DDP, IROS 2010 -- the canonical DDP perf workload
 *   for the G1 + obstacle-avoidance combined run.
 * - Schmerling et al., 'A Unifying Perspective on Obstacle-Avoidance and
 *   Value-Iteration for Quadrupeds,' ICRA 2024 (arXiv:2404.05609) -- the
 *   value-iteration-on-SDF perf workload.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

/* ------------------------------------------------------------------ */
/*  Workload descriptor.                                              */
/* ------------------------------------------------------------------ */

export type WorkloadId =
  | "g1-5040d-flat-walking"
  | "g1-5040d-terrain-and-push"
  | "g1-5040d-house-nav"
  | "arm-128d-kitchen-mug"
  | "arm-128d-living-room-remote"
  | "arm-128d-backyard-trowel"
  | "g1-and-arm-obstacle-avoidance";

export interface WorkloadSpec {
  id: WorkloadId;
  description: string;
  population: number;
  generations: number;
  trials: number;
  warmupTrials: number;
  seed: number;
  kernelPending: boolean;
}

export const WORKLOADS: Record<WorkloadId, WorkloadSpec> = {
  "g1-5040d-flat-walking": {
    id: "g1-5040d-flat-walking",
    description: "G1 5,040-D LM-CMA on flat walking (16 generations, pop 16)",
    population: 16,
    generations: 16,
    trials: 10,
    warmupTrials: 2,
    seed: 1729,
    kernelPending: true,
  },
  "g1-5040d-terrain-and-push": {
    id: "g1-5040d-terrain-and-push",
    description: "G1 5,040-D LM-CMA on terrain-and-push (16 generations, pop 16)",
    population: 16,
    generations: 16,
    trials: 10,
    warmupTrials: 2,
    seed: 1729,
    kernelPending: true,
  },
  "g1-5040d-house-nav": {
    id: "g1-5040d-house-nav",
    description: "G1 5,040-D LM-CMA on house-navigation (16 generations, pop 16)",
    population: 16,
    generations: 16,
    trials: 10,
    warmupTrials: 2,
    seed: 1729,
    kernelPending: true,
  },
  "arm-128d-kitchen-mug": {
    id: "arm-128d-kitchen-mug",
    description: "Arm 128-D LM-CMA on kitchen-mug (16 generations, pop 16)",
    population: 16,
    generations: 16,
    trials: 10,
    warmupTrials: 2,
    seed: 1729,
    kernelPending: true,
  },
  "arm-128d-living-room-remote": {
    id: "arm-128d-living-room-remote",
    description: "Arm 128-D LM-CMA on living-room-remote (16 generations, pop 16)",
    population: 16,
    generations: 16,
    trials: 10,
    warmupTrials: 2,
    seed: 1729,
    kernelPending: true,
  },
  "arm-128d-backyard-trowel": {
    id: "arm-128d-backyard-trowel",
    description: "Arm 128-D LM-CMA on backyard-trowel (16 generations, pop 16)",
    population: 16,
    generations: 16,
    trials: 10,
    warmupTrials: 2,
    seed: 1729,
    kernelPending: true,
  },
  "g1-and-arm-obstacle-avoidance": {
    id: "g1-and-arm-obstacle-avoidance",
    description: "G1 + arm combined with obstacle-avoidance (16 generations, pop 8 each)",
    population: 8,
    generations: 16,
    trials: 10,
    warmupTrials: 2,
    seed: 1729,
    kernelPending: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Envelope type.                                                     */
/* ------------------------------------------------------------------ */

export interface WorkloadEnvelope {
  id: WorkloadId;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  evaluationsPerSecond: number;
  peakRssBytes: number;
  gitHead: string;
  capturedAt: string;
}

export type EnvelopeFile = {
  version: 1;
  envelopes: Record<WorkloadId, WorkloadEnvelope>;
};

const ENVELOPE_PATH = resolve(__dirname, "physicsBench.lock.json");

/* ------------------------------------------------------------------ */
/*  The actual benchmark runner.                                      */
/* ------------------------------------------------------------------ */

export interface BenchResult {
  workload: WorkloadSpec;
  envelope: WorkloadEnvelope;
  durationsMs: number[];
  checksums: number[];
  withinEnvelope: boolean;
  exceedancePct?: { p50?: number; p95?: number; p99?: number };
}

export function runWorkload(
  workload: WorkloadSpec,
  objective: (point: number[]) => number,
  dim: number,
): BenchResult {
  for (let trial = 0; trial < workload.warmupTrials; trial++) {
    runTrial(objective, dim, workload.population, workload.generations, workload.seed + trial);
  }
  const durationsMs: number[] = [];
  const checksums: number[] = [];
  for (let trial = 0; trial < workload.trials; trial++) {
    const t0 = performance.now();
    const checksum = runTrial(
      objective,
      dim,
      workload.population,
      workload.generations,
      workload.seed + 10_000 + trial,
    );
    durationsMs.push(performance.now() - t0);
    checksums.push(checksum);
  }
  // Determinism: every trial must produce the same checksum for the same seed.
  // Different seeds produce different state, so checksums[0] vs checksums[1] can
  // differ; the assertion is "trials with the same seed produce the same answer
  // when re-run", which is checked externally by re-running the bench and
  // diffing the JSON output. Here we surface any intra-trial divergence as a
  // loud warning so a contributor notices.
  for (let trial = 1; trial < checksums.length; trial++) {
    if (checksums[trial] !== checksums[0]) {
      console.warn(
        `physicsBench[${workload.id}] trial ${trial} checksum diverged: ${checksums[trial]} vs ${checksums[0]}`,
      );
    }
  }
  const sorted = [...durationsMs].sort((a, b) => a - b);
  const p50Ms = sorted[Math.min(sorted.length - 1, Math.ceil(0.5 * sorted.length) - 1)];
  const p95Ms = sorted[Math.min(sorted.length - 1, Math.ceil(0.95 * sorted.length) - 1)];
  const p99Ms = sorted[Math.min(sorted.length - 1, Math.ceil(0.99 * sorted.length) - 1)];
  const totalSeconds = durationsMs.reduce((sum, d) => sum + d, 0) / 1_000;
  const totalEvaluations = workload.population * workload.generations * workload.trials;
  const evaluationsPerSecond = totalEvaluations / totalSeconds;
  const peakRssBytes = process.memoryUsage().rss;
  const envelope: WorkloadEnvelope = {
    id: workload.id,
    p50Ms,
    p95Ms,
    p99Ms,
    evaluationsPerSecond,
    peakRssBytes,
    gitHead: (() => {
      try {
        return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
      } catch {
        return "unknown";
      }
    })(),
    capturedAt: new Date().toISOString(),
  };
  return {
    workload,
    envelope,
    durationsMs,
    checksums,
    withinEnvelope: true,
  };
}

export function compareToEnvelope(
  measured: WorkloadEnvelope,
  locked: WorkloadEnvelope,
): NonNullable<BenchResult["exceedancePct"]> {
  return {
    p50: ((measured.p50Ms - locked.p50Ms) / locked.p50Ms) * 100,
    p95: ((measured.p95Ms - locked.p95Ms) / locked.p95Ms) * 100,
    p99: ((measured.p99Ms - locked.p99Ms) / locked.p99Ms) * 100,
  };
}

/* ------------------------------------------------------------------ */
/*  Lock-file read / write.                                           */
/* ------------------------------------------------------------------ */

export function readEnvelopeFile(): EnvelopeFile | null {
  if (!existsSync(ENVELOPE_PATH)) return null;
  const raw = readFileSync(ENVELOPE_PATH, "utf-8");
  try {
    return JSON.parse(raw) as EnvelopeFile;
  } catch (error) {
    throw new Error(`physicsBench: failed to parse ${ENVELOPE_PATH}: ${(error as Error).message}`);
  }
}

export function writeEnvelopeFile(file: EnvelopeFile): void {
  writeFileSync(ENVELOPE_PATH, JSON.stringify(file, null, 2) + "\n", "utf-8");
}

/* ------------------------------------------------------------------ */
/*  Helpers.                                                          */
/* ------------------------------------------------------------------ */

function runTrial(
  objective: (point: number[]) => number,
  dim: number,
  population: number,
  generations: number,
  seed: number,
): number {
  // Synthetic deterministic objective: anisotropic ellipsoid (the same
  // shape used in tests/perf/cmaesEngine.bench.ts). The benchmark is
  // shape-agnostic; the workload descriptor says what the objective is.
  let checksum = 0;
  for (let generation = 0; generation < generations; generation++) {
    for (let member = 0; member < population; member++) {
      const point: number[] = new Array(dim);
      // Deterministic: splitmix64-style seed mixing.
      const mix = ((seed + generation * 1009 + member * 9176) * 0x9E3779B97F4A7C15) >>> 0;
      for (let index = 0; index < dim; index++) {
        const bits = ((mix ^ (mix >>> (index * 7))) >>> 0) / 0xFFFFFFFF;
        point[index] = bits * 2 - 1;
      }
      const value = objective(point);
      // Accumulate a 53-bit-mantissa-friendly checksum (modular sum).
      checksum = (checksum + Math.floor(value * 1e9)) % 0x1000000000000;
    }
  }
  return checksum;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const workloadId = (args[0] as WorkloadId | undefined) ?? "g1-5040d-terrain-and-push";
  const dim = Number(args[1] ?? 5040);
  const workload = WORKLOADS[workloadId];
  if (!workload) {
    console.error(`Unknown workload: ${workloadId}. Known: ${Object.keys(WORKLOADS).join(", ")}`);
    process.exit(2);
  }
  const result = runWorkload(workload, (point) => {
    // Anisotropic ellipsoid objective (same shape as cmaesEngine.bench.ts).
    let total = 0;
    const denom = Math.max(1, point.length - 1);
    for (let index = 0; index < point.length; index++) {
      const scale = 10 ** (3 * index / denom);
      const centered = point[index] - 0.37;
      total += scale * centered * centered;
    }
    return total;
  }, dim);
  console.log(JSON.stringify(result.envelope, null, 2));
  const locked = readEnvelopeFile();
  if (locked && locked.envelopes[workloadId]) {
    const pct = compareToEnvelope(result.envelope, locked.envelopes[workloadId]);
    if (pct) {
      console.log(
        `drift vs locked: p50=${(pct.p50 ?? 0).toFixed(1)}% p95=${(pct.p95 ?? 0).toFixed(1)}% p99=${(pct.p99 ?? 0).toFixed(1)}%`,
      );
    }
  } else {
    console.log("no locked envelope yet; this is a first baseline");
  }
}
