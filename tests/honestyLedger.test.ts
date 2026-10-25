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
    expect(diag.ddpTrajectory.finalCost).toBeLessThan(diag.ddpTrajectory.initialCost);
    expect(diag.ddpTrajectory.iterationsTaken).toBeGreaterThan(0);
    expect(Number.isFinite(diag.citoTrajectory.maxComplementarityGap)).toBe(true);
    expect(Number.isFinite(diag.citoTrajectory.maxFischerBurmeisterResidual)).toBe(true);
    expect(diag.perfProfiler.totalStepsRecorded).toBe(12);
    expect(diag.perfProfiler.p50Micros).toBeGreaterThan(0);
    expect(diag.perfProfiler.p95Micros).toBeGreaterThanOrEqual(diag.perfProfiler.p50Micros);
  });

  test("every app/lib/*.ts module is imported by at least one live file in app/", () => {
    const rootDir = process.cwd();
    const libDir = path.join(rootDir, "app/lib");
    const libFiles = fs
      .readdirSync(libDir)
      .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
      .map((f) => path.basename(f, ".ts"));

    // Collect all source contents across app/
    const collectTsFiles = (dir: string): string[] => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      const out: string[] = [];
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          out.push(...collectTsFiles(full));
        } else if (e.name.endsWith(".ts") || e.name.endsWith(".tsx")) {
          out.push(full);
        }
      }
      return out;
    };

    const allAppFiles = collectTsFiles(path.join(rootDir, "app"));
    const fileContents = new Map<string, string>();
    for (const f of allAppFiles) {
      fileContents.set(f, fs.readFileSync(f, "utf8"));
    }

    const unwiredLibs: string[] = [];
    for (const base of libFiles) {
      const selfPath = path.join(libDir, `${base}.ts`);
      let importedInApp = false;
      for (const [fPath, content] of fileContents.entries()) {
        if (fPath === selfPath) continue;
        if (content.includes(`/${base}"`) || content.includes(`/${base}'`)) {
          importedInApp = true;
          break;
        }
      }
      if (!importedInApp) {
        unwiredLibs.push(`${base}.ts`);
      }
    }

    expect(unwiredLibs).toEqual([]);
  });
});
