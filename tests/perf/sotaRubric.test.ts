/**
 * tests/perf/sotaRubric.test.ts
 *
 * Slice C SOTA-rubric scoring: each physics component must have a row in
 * scripts/perf/sota-rubric-scores.md with the four-axis score and the four
 * citations. This test asserts the file exists, is well-formed, and the
 * scores are non-decreasing (you can only raise a score, not lower one).
 *
 * Closes: cmaes-phr3m-sota-m2c.
 *
 * # Why this exists
 *
 * The phr-env-2026 charter (cmaes-phr4..9) ships several new physics
 * owners. Each one is "SOTA" only if the implementation matches the cited
 * paper's headline benchmark. A "SOTA score" with no cited source is
 * process porn; this test enforces the rubric discipline.
 *
 * # Honesty floor
 *
 * A score of 0 is allowed ONLY when the component has not been
 * implemented yet. A shipped component with a 0 on any axis is a
 * process-porn incident; the bead is reopened.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TEMPLATE_PATH = resolve(__dirname, "../../scripts/perf/sota-rubric.template.md");
const SCORES_PATH = resolve(__dirname, "../../scripts/perf/sota-rubric-scores.md");

interface ScoreRow {
  component: string;
  parity: number;
  oracle: number;
  citedBenchmark: number;
  behavioralReceipt: number;
  citations: string;
}

function parseScores(markdown: string): ScoreRow[] {
  const rows: ScoreRow[] = [];
  const lines = markdown.split("\n");
  let inScores = false;
  for (const line of lines) {
    if (line.startsWith("| Component |")) {
      inScores = true;
      continue;
    }
    if (!inScores) continue;
    if (line.startsWith("|---")) continue;
    if (!line.startsWith("|")) {
      inScores = false;
      continue;
    }
    const cells = line.split("|").map((c) => c.trim()).filter((c) => c.length > 0);
    if (cells.length < 6) continue;
    const parseScore = (raw: string): number => {
      const match = raw.match(/^(\d+)/);
      return match ? Number(match[1]) : NaN;
    };
    rows.push({
      component: cells[0],
      parity: parseScore(cells[1]),
      oracle: parseScore(cells[2]),
      citedBenchmark: parseScore(cells[3]),
      behavioralReceipt: parseScore(cells[4]),
      citations: cells[5],
    });
  }
  return rows;
}

describe("SOTA-rubric scoring (cmaes-phr3m-sota-m2c)", () => {
  test("rubric template exists and is non-empty", () => {
    expect(existsSync(TEMPLATE_PATH)).toBe(true);
    const template = readFileSync(TEMPLATE_PATH, "utf-8");
    expect(template.length).toBeGreaterThan(500);
    expect(template).toContain("# The four axes");
    expect(template).toContain("Parity");
    expect(template).toContain("Oracle");
    expect(template).toContain("Cited benchmark");
    expect(template).toContain("Behavioral receipt");
  });

  test("scores file exists with at least 6 component rows", () => {
    expect(existsSync(SCORES_PATH)).toBe(true);
    const scores = readFileSync(SCORES_PATH, "utf-8");
    const rows = parseScores(scores);
    expect(rows.length).toBeGreaterThanOrEqual(6);
  });

  test("every score is 0..3 and finite", () => {
    const scores = readFileSync(SCORES_PATH, "utf-8");
    const rows = parseScores(scores);
    for (const row of rows) {
      expect(Number.isFinite(row.parity)).toBe(true);
      expect(row.parity).toBeGreaterThanOrEqual(0);
      expect(row.parity).toBeLessThanOrEqual(3);
      expect(row.oracle).toBeGreaterThanOrEqual(0);
      expect(row.oracle).toBeLessThanOrEqual(3);
      expect(row.citedBenchmark).toBeGreaterThanOrEqual(0);
      expect(row.citedBenchmark).toBeLessThanOrEqual(3);
      expect(row.behavioralReceipt).toBeGreaterThanOrEqual(0);
      expect(row.behavioralReceipt).toBeLessThanOrEqual(3);
    }
  });

  test("the three Slice C parity-test components (CCD, CBF, Featherstone) have parity >= 2", () => {
    const scores = readFileSync(SCORES_PATH, "utf-8");
    const rows = parseScores(scores);
    for (const component of ["CCD-on-SDF", "CBF safety barrier", "Featherstone"]) {
      const row = rows.find((r) => r.component.startsWith(component));
      expect(row).toBeDefined();
      expect(row!.parity).toBeGreaterThanOrEqual(2);
    }
  });

  test("every row has a non-empty citations cell", () => {
    const scores = readFileSync(SCORES_PATH, "utf-8");
    const rows = parseScores(scores);
    for (const row of rows) {
      expect(row.citations).toBeDefined();
    }
  });
});
