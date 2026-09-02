import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const scriptPath = new URL("../ios/prepare-engine.sh", import.meta.url);
const script = readFileSync(scriptPath, "utf8");

describe("FrankenRobots engine exporter safety boundary", () => {
  test("defaults to a staging-only mode", () => {
    expect(script).toContain("without changing ios/Engine (default)");
    expect(script).toContain('MODE="stage"');
  });

  test("contains no destructive cleanup or overwrite primitive", () => {
    expect(script).not.toMatch(/\brm\s+-/);
    expect(script).not.toContain("rsync");
    expect(script).not.toContain("git clean");
    expect(script).not.toContain("git reset");
  });

  test("requires clean source receipts and validates the shipped capability payload", () => {
    expect(script).toContain("SOURCE_DIRTY=$(git status --porcelain --untracked-files=normal)");
    expect(script).toContain("FRANKENSIM_DIRTY=$(git -C \"$FRANKENSIM_ROOT\" status --porcelain --untracked-files=normal)");
    expect(script).toContain("verify_source_fences");
    expect(script).toContain("HEAD moved during export");
    expect(script).toContain("frankenrobots/humanoid/index.html");
    expect(script).toContain("frankenrobots/arm/index.html");
    expect(script).toContain("fs_cmaes_viz_wasm_bg.wasm");
    expect(script).toContain("workers/g1MeshParseWorker.js");
    expect(script).toContain("engine-content-sha256.txt");
  });

  test("preserves an existing engine at a printed rollback path during explicit activation", () => {
    expect(script).toContain('if [[ "$MODE" == "stage" ]]');
    expect(script).toContain('ROLLBACK_ENGINE="$STAGE_PARENT/previous-Engine"');
    expect(script).toContain('mv "$CURRENT_ENGINE" "$ROLLBACK_ENGINE"');
    expect(script).toContain("Previous engine preserved for rollback");
    expect(script).toContain("--allow-unverified-existing");
  });
});
