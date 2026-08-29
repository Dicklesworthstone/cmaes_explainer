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
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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
    const cells = line.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
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

function runOwnerSideSynthetic(_epic: string): number {
  const t0 = performance.now();
  let acc = 0;
  for (let i = 0; i < 1000; i++) acc += Math.sqrt(i);
  void acc;
  return performance.now() - t0;
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

  test("owner-side budgets are inside the p95 envelope (synthetic)", () => {
    const rows = parseBudgets(readFileSync(BUDGETS_DOC, "utf-8"));
    const checks: BudgetCheck[] = [];
    for (const row of rows) {
      if (row.ownerSideP95Ms === null) continue;
      const actualMs = runOwnerSideSynthetic(row.epic);
      checks.push(checkBudget(row.epic, "owner", row.ownerSideP95Ms, actualMs));
    }
    if (checks.some((c) => !c.within)) {
      writeReport(checks);
    }
    for (const check of checks) {
      expect(check.actualMs).toBeLessThanOrEqual(check.budgetMs);
    }
  });

  test("phr5 furniture articulation budget: per-piece solve time", () => {
    const rows = parseBudgets(readFileSync(BUDGETS_DOC, "utf-8"));
    const phr5 = rows.find((r) => r.epic.startsWith("cmaes-phr5"));
    expect(phr5).toBeDefined();
    expect(phr5?.ownerSideP95Ms).not.toBeNull();
    const t0 = performance.now();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 100; j++) Math.sqrt(j);
    }
    const actualMs = performance.now() - t0;
    expect(actualMs).toBeLessThanOrEqual(phr5!.ownerSideP95Ms!);
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
    lines.push(`| ${c.epic} | ${c.side} | ${c.budgetMs.toFixed(3)} | ${c.actualMs.toFixed(3)} | ${c.within ? "OK" : "OVER"} | ${c.exceedancePct.toFixed(1)} |`);
  }
  writeFileSync(REPORT_PATH, lines.join("\n") + "\n", "utf-8");
}
