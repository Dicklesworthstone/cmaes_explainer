import { describe, expect, test } from "bun:test";
import fs from "fs";
import path from "path";
import { evaluateFrontierKernelAndStressDiagnostics } from "../app/components/FrankenRobotsResearchAnnex";
import { HONESTY_CHIP_REGISTRY } from "../app/lib/honestyLedger";

describe("Project Honesty Ledger & Traceability Registry", () => {
  test("source index retains the existing implementation categories", () => {
    expect(HONESTY_CHIP_REGISTRY.length).toBeGreaterThanOrEqual(25);

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
    const issues = fs
      .readFileSync(path.join(process.cwd(), ".beads/issues.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line) as { id: string });
    const ids = new Set(issues.map((issue) => issue.id));
    for (const chip of HONESTY_CHIP_REGISTRY) expect(ids.has(chip.beadId)).toBe(true);
  });

  test("README.md references the active flagship WASM bundle version without stale version drift", () => {
    const rootDir = process.cwd();
    const readme = fs.readFileSync(path.join(rootDir, "README.md"), "utf8");
    const frankensimLoader = fs.readFileSync(
      path.join(rootDir, "app/lib/frankensimCmaes.ts"),
      "utf8",
    );

    const wasmMatch = frankensimLoader.match(/\/wasm\/fs-cmaes\/(v\d+)\/fs_cmaes_viz_wasm\.js/);
    expect(wasmMatch).not.toBeNull();
    const activeVersion = wasmMatch![1];

    expect(readme).toContain(activeVersion);
    expect(readme).not.toContain("v0622");
  });

  test("evaluateFrontierKernelAndStressDiagnostics verifies fail-closed adapter, Schema-8 ABI, shuffled stress trial, and visitor clip", () => {
    const diag = evaluateFrontierKernelAndStressDiagnostics(101);

    expect(diag.v067MultiBodyRefusalCode).toBe("ERR_V067_MULTI_BODY_UNSUPPORTED");
    expect(diag.v068ReadyCapabilitiesCount).toBe(6);
    expect(diag.v068WorkloadValid).toBe(true);
    expect(diag.schema8WordCount).toBe(8 + 2 * 13 + 1 * 4 + 1 * 8);
    expect(diag.schema8ByteLength).toBe(diag.schema8WordCount * 8);
    expect(diag.schema8ZeroCopyBodyCount).toBe(2);
    expect(diag.schema8ZeroCopyJointCount).toBe(1);
    expect(diag.schema8ZeroCopyContactCount).toBe(1);
    expect(diag.stressTrial.trialSeed).toBe(101);
    expect(diag.stressTrial.totalSteps).toBeGreaterThan(0);
    expect(Number.isFinite(diag.stressTrial.minimumClearanceMeters)).toBe(true);
    expect(diag.wilson95CiPercent[0]).toBeGreaterThanOrEqual(0);
    expect(diag.wilson95CiPercent[1]).toBeLessThanOrEqual(100);
    expect(diag.visitorClipFrameCount).toBe(60);
    expect(diag.visitorClipPlaybackRatio).toBeGreaterThan(0);
  });
});
