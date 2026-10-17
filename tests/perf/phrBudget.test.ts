/**
 * tests/perf/phrBudget.test.ts
 *
 * Slice C per-epic performance budget test.
 * Closes: cmaes-phr3m-budget-k6f (parent) and cmaes-phr3m-budget-furn-18d
 * (child: per-furniture-piece articulation solve time).
 *
 * # Why this exists
 *
 * The phr-env-2026 charter has 6 implementation epics (cmaes-phr4..9). Each
 * one needs a signed performance budget before close: the owner (kernel)
 * side AND the explorer (browser) side. A "performance budget" here means
 * an upper bound on the per-frame cost the new feature can introduce,
 * expressed in p50/p95/p99 ms, with a clear test that fails if the budget
 * is exceeded.
 *
 * This is the "is it fast enough to ship?" check, distinct from "is it
 * correct?" (cmaes-phr3m-parity-ow9) and "is it regression-bounded?"
 * (cmaes-phr3m-bench-8cv).
 *
 * # What this test does
 *
 * 1. Reads scripts/perf/phr-env-2026-budgets.md.
 * 2. For each epic, runs the standard test vector.
 * 3. Asserts the runtime is inside the budget.
 * 4. On failure, writes tests/perf/phrBudget-report.md with the
 *    exceedance.
 *
 * # What this test does NOT do
 *
 * - It does NOT gate CI red. The CI is parity-driven (cmaes-phr3m-parity-ow9).
 *   Performance is contributor-side; the contributor must either fix the
 *   code or open an override bead.
 * - It does NOT compare against another implementation. The budget is
 *   against the upper bound the user named in the charter, not against a
 *   competitor.
 *
 * # Status
 *
 * Most owner-side budgets are kernelPending. The test runs in
 * "structure-only" mode: each budget is checked against a synthetic
 * objective (a small in-process load) that always passes the budget. When
 * the kernel lands, the contributor swaps in the real owner.
 *
 * # Honesty floor
 *
 * A "budget" with no upper bound is a wish. A budget that the contributor
 * can silently raise without review is a process artifact that gates
 * nothing. The override-bead pattern is the only escape hatch; without it,
 * the budget has no enforcement.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { sdfBox, sdfSphere } from "../../app/lib/analyticSdf";
import { collideSphereSphere } from "../../app/lib/contactManifold";
import {
  computeMechanicalEnergy,
  forwardDynamicsABA,
  inverseDynamicsRNEA,
  type MultibodyTree,
} from "../../app/lib/featherstoneDynamics";
import { createFridgeArticulation } from "../../app/lib/furnitureArticulation";
import { KernelPerfProfiler } from "../../app/lib/kernelPerfProfiler";
import { SafetyFilterRecoveryManager } from "../../app/lib/safetyFilterRecovery";

interface BudgetRow {
  epic: string;
  ownerSideP95Ms: number | null;
  explorerSideP95Ms: number | null;
  reference: string;
}

const BUDGETS_DOC = resolve(__dirname, "../../scripts/perf/phr-env-2026-budgets.md");
const REPORT_PATH = resolve(__dirname, "phrBudget-report.md");

function parseBudgets(markdown: string): BudgetRow[] {
  const rows: BudgetRow[] = [];
  const lines = markdown.split("\n");
  let inBudgets = false;
  for (const line of lines) {
    if (line.startsWith("| Epic |")) {
      inBudgets = true;
      continue;
    }
    if (!inBudgets) continue;
    if (line.startsWith("|---")) continue;
    if (!line.startsWith("|")) {
      inBudgets = false;
      continue;
    }
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    if (cells.length < 4) continue;
    const parseSide = (raw: string): number | null => {
      const trimmed = raw.trim();
      if (trimmed === "" || trimmed.startsWith("n/a") || trimmed.startsWith("0 ms")) {
        return null;
      }
      const value = parseFloat(trimmed.split(" ")[0]);
      return Number.isFinite(value) ? value : null;
    };
    rows.push({
      epic: cells[0].trim(),
      ownerSideP95Ms: parseSide(cells[1]),
      explorerSideP95Ms: parseSide(cells[2]),
      reference: cells[3].trim(),
    });
  }
  return rows;
}

interface BudgetCheck {
  epic: string;
  side: "owner" | "explorer";
  budgetMs: number;
  actualMs: number;
  within: boolean;
  exceedancePct: number;
}

function checkBudget(
  epic: string,
  side: "owner" | "explorer",
  budgetMs: number,
  actualMs: number,
): BudgetCheck {
  return {
    epic,
    side,
    budgetMs,
    actualMs,
    within: actualMs <= budgetMs,
    exceedancePct: ((actualMs - budgetMs) / budgetMs) * 100,
  };
}

const armModel: MultibodyTree = {
  name: "2link_arm",
  gravity: [0, 0, -9.81],
  links: [
    {
      id: "link1",
      name: "upper_arm",
      parentIndex: -1,
      jointType: "revolute",
      jointAxis: [0, 1, 0],
      parentTransform: { rotation: [0, 0, 0], translation: [0, 0, 0] },
      mass: 2.0,
      centerOfMass: [0, 0, -0.2],
      inertiaPrincipal: [0.02, 0.02, 0.005],
    },
    {
      id: "link2",
      name: "forearm",
      parentIndex: 0,
      jointType: "revolute",
      jointAxis: [0, 1, 0],
      parentTransform: { rotation: [0, 0, 0], translation: [0, 0, -0.4] },
      mass: 1.5,
      centerOfMass: [0, 0, -0.2],
      inertiaPrincipal: [0.015, 0.015, 0.004],
    },
  ],
};
const fridgeGraph = createFridgeArticulation();
const safetyFilter = new SafetyFilterRecoveryManager();

function executeRealEpicWorkload(epic: string): void {
  if (epic.startsWith("cmaes-phr5")) {
    fridgeGraph.stepDynamics(1 / 60, { upper_door_hinge: 1.5, lower_door_hinge: 0.8 });
    fridgeGraph.computeForwardKinematics();
    return;
  }
  if (epic.startsWith("cmaes-phr6")) {
    const q = [0.35, -0.55];
    const qd = [0.2, -0.15];
    const tau = [1.2, -0.6];
    const abaRes = forwardDynamicsABA(armModel, q, qd, tau);
    inverseDynamicsRNEA(armModel, q, qd, abaRes.qDDot);
    return;
  }
  if (epic.startsWith("cmaes-phr7")) {
    sdfSphere([0.25, 0.4, -0.1], [0, 0.3, 0], 0.2);
    sdfBox([0.35, 0.2, 0.15], [0, 0, 0], [0.3, 0.25, 0.2]);
    collideSphereSphere([0, 0, 0], 0.2, [0.32, 0.02, 0], 0.2);
    return;
  }
  if (epic.startsWith("cmaes-phr8")) {
    safetyFilter.filterOrRecover(
      [-0.8, 0.0, 0.0],
      [0.45, 0.1, 0.6],
      [-0.2, 0.0, 0.0],
      [
        {
          id: "counter-edge",
          hValue: 0.14,
          gradient: [1, 0, 0],
        },
      ],
    );
    return;
  }
  // cmaes-phr3m-meas: per-case parity oracle comparison cost (module vs closed-form oracle)
  const sdfRes = sdfSphere([0.25, 0.4, -0.1], [0, 0.3, 0], 0.2);
  const analyticalDist = Math.hypot(0.25, 0.1, -0.1) - 0.2;
  if (Math.abs(sdfRes.distance - analyticalDist) > 1e-12) {
    throw new Error("Parity mismatch in cmaes-phr3m-meas");
  }
}

function measureEpicP95Ms(epic: string, budgetMs: number): number {
  const targetFreqHz = 1000.0 / Math.max(0.01, budgetMs);
  const profiler = new KernelPerfProfiler(64, targetFreqHz);

  // Warmup pass to prime JIT before recording p95 samples
  for (let w = 0; w < 25; w++) {
    executeRealEpicWorkload(epic);
  }

  for (let s = 0; s < 25; s++) {
    profiler.profileStepExecution(
      s,
      () => {},
      () => {},
      () => executeRealEpicWorkload(epic),
      () => {},
      2,
      1,
    );
  }

  const stats = profiler.getSummaryStats();
  return stats.p95Micros / 1000.0;
}

describe("phr-env-2026 performance budgets", () => {
  test("budgets doc parses with one row per epic", () => {
    expect(existsSync(BUDGETS_DOC)).toBe(true);
    const doc = readFileSync(BUDGETS_DOC, "utf-8");
    const rows = parseBudgets(doc);
    expect(rows.length).toBe(7);
    for (const row of rows) {
      expect(row.epic).toMatch(/^cmaes-phr/);
    }
  });

  test("every epic has at least one non-null side budget", () => {
    const rows = parseBudgets(readFileSync(BUDGETS_DOC, "utf-8"));
    for (const row of rows) {
      const hasOwner = row.ownerSideP95Ms !== null;
      const hasExplorer = row.explorerSideP95Ms !== null;
      expect(hasOwner || hasExplorer).toBe(true);
    }
  });

  test("owner-side budgets are inside the empirical p95 envelope on real module workloads", () => {
    const rows = parseBudgets(readFileSync(BUDGETS_DOC, "utf-8"));
    const checks: BudgetCheck[] = [];
    for (const row of rows) {
      if (row.ownerSideP95Ms === null) continue;
      const actualP95Ms = measureEpicP95Ms(row.epic, row.ownerSideP95Ms);
      checks.push(checkBudget(row.epic, "owner", row.ownerSideP95Ms, actualP95Ms));
    }
    if (checks.some((c) => !c.within)) {
      writeReport(checks);
    }
    for (const check of checks) {
      expect(check.actualMs).toBeGreaterThan(0);
      expect(check.actualMs).toBeLessThanOrEqual(check.budgetMs);
    }
  });

  test("phr5 furniture articulation budget: empirical p95 solve time across 5 articulated appliances", () => {
    const rows = parseBudgets(readFileSync(BUDGETS_DOC, "utf-8"));
    const phr5 = rows.find((r) => r.epic.startsWith("cmaes-phr5"));
    expect(phr5).toBeDefined();
    expect(phr5?.ownerSideP95Ms).not.toBeNull();

    const appliances = Array.from({ length: 5 }, () => createFridgeArticulation());
    const profiler = new KernelPerfProfiler(32, 1000.0 / phr5!.ownerSideP95Ms!);

    // Warmup
    for (let w = 0; w < 3; w++) {
      for (const app of appliances) {
        app.stepDynamics(1 / 60, { upper_door_hinge: 1.0 });
        app.computeForwardKinematics();
      }
    }

    for (let s = 0; s < 20; s++) {
      profiler.profileStepExecution(
        s,
        () => {},
        () => {},
        () => {
          for (const app of appliances) {
            app.stepDynamics(1 / 60, { upper_door_hinge: 1.0 });
            app.computeForwardKinematics();
          }
        },
        () => {},
        5,
        10,
      );
    }

    const actualP95Ms = profiler.getSummaryStats().p95Micros / 1000.0;
    expect(actualP95Ms).toBeGreaterThan(0);
    expect(actualP95Ms).toBeLessThanOrEqual(phr5!.ownerSideP95Ms!);
  });

  test("negative control: planted budget overrun is flagged by KernelPerfProfiler and checkBudget", () => {
    const strictBudgetMs = 0.05; // 50 microseconds
    const profiler = new KernelPerfProfiler(10, 1000.0 / strictBudgetMs);

    // Record 10 steps where 8 are fast (10 µs) and 2 exceed the 50 µs budget (250 µs)
    for (let s = 0; s < 8; s++) {
      profiler.recordStep(s, {
        broadphase: 2,
        narrowphase: 3,
        lcpSolver: 3,
        integrator: 2,
        total: 10,
      });
    }
    for (let s = 8; s < 10; s++) {
      profiler.recordStep(s, {
        broadphase: 40,
        narrowphase: 60,
        lcpSolver: 120,
        integrator: 30,
        total: 250,
      });
    }

    const stats = profiler.getSummaryStats();
    expect(stats.budgetOverrunCount).toBe(2);
    expect(stats.p50Micros).toBe(10);
    expect(stats.p95Micros).toBe(250);

    const check = checkBudget("cmaes-phr6", "owner", strictBudgetMs, stats.p95Micros / 1000.0);
    expect(check.within).toBe(false);
    expect(check.exceedancePct).toBeCloseTo(400.0, 4);
  });
});

function writeReport(checks: BudgetCheck[]): void {
  const lines: string[] = [
    "# phr-env-2026 Budget Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "| Epic | Side | Budget (ms) | Actual (ms) | Within | Exceedance (%) |",
    "|---|---|---|---|---|---|",
  ];
  for (const c of checks) {
    lines.push(
      `| ${c.epic} | ${c.side} | ${c.budgetMs.toFixed(3)} | ${c.actualMs.toFixed(3)} | ${c.within ? "OK" : "OVER"} | ${c.exceedancePct.toFixed(1)} |`,
    );
  }
  writeFileSync(REPORT_PATH, lines.join("\n") + "\n", "utf-8");
}
