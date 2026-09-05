import { describe, expect, test } from "bun:test";
import { HONESTY_CHIP_REGISTRY } from "../app/lib/honestyLedger";
import fs from "fs";
import path from "path";

describe("Project Honesty Ledger & Traceability Registry", () => {
  test("source index retains the existing implementation categories", () => {
    expect(HONESTY_CHIP_REGISTRY.length).toBeGreaterThanOrEqual(15);

    const categories = new Set(HONESTY_CHIP_REGISTRY.map((c) => c.category));
    expect(categories.has("physics")).toBe(true);
    expect(categories.has("obstacle-avoidance")).toBe(true);
    expect(categories.has("graphics")).toBe(true);
    expect(categories.has("clipping")).toBe(true);
    expect(categories.has("navigation")).toBe(true);
    expect(categories.has("telemetry")).toBe(true);
  });

  test("every honesty chip has complete mathematical and academic metadata", () => {
    for (const chip of HONESTY_CHIP_REGISTRY) {
      expect(chip.id.length).toBeGreaterThan(0);
      expect(chip.beadId.startsWith("cmaes-")).toBe(true);
      expect(chip.title.length).toBeGreaterThan(0);
      expect(chip.citation.length).toBeGreaterThan(0);
      expect(chip.mathFormula.length).toBeGreaterThan(0);
      expect(chip.claim.length).toBeGreaterThan(0);
      expect(["implemented", "conceptual", "display-only"]).toContain(chip.status);
    }
  });

  test("every sourceFile and testFile in the registry exists on disk", () => {
    const rootDir = process.cwd();

    for (const chip of HONESTY_CHIP_REGISTRY) {
      const sourcePath = path.join(rootDir, chip.sourceFile);
      const testPath = path.join(rootDir, chip.testFile);

      expect(fs.existsSync(sourcePath)).toBe(true);
      expect(fs.existsSync(testPath)).toBe(true);
    }
  });

  test("every task reference resolves in the committed tracker", () => {
    const issues = fs.readFileSync(path.join(process.cwd(), ".beads/issues.jsonl"), "utf8")
      .trim().split("\n").map((line) => JSON.parse(line) as { id: string });
    const ids = new Set(issues.map((issue) => issue.id));
    for (const chip of HONESTY_CHIP_REGISTRY) expect(ids.has(chip.beadId)).toBe(true);
  });
});
