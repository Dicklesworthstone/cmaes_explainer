import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = new URL("../ios/prepare-engine.sh", import.meta.url);
const scriptFilePath = fileURLToPath(scriptPath);
const script = readFileSync(scriptPath, "utf8");
const globalsCss = readFileSync(
  fileURLToPath(new URL("../app/globals.css", import.meta.url)),
  "utf8",
);
const benchmarkGallery = readFileSync(
  fileURLToPath(new URL("../public/wasm-demo/examples/viz-benchmarks.html", import.meta.url)),
  "utf8",
);

test("source fencing ignores retained backups but still sees real untracked source", () => {
  const directory = mkdtempSync(join(tmpdir(), "frankenrobots-source-ignore-"));
  const root = fileURLToPath(new URL("../", import.meta.url));
  cpSync(join(root, ".gitignore"), join(directory, ".gitignore"));
  const initialized = spawnSync("git", ["init", "--quiet", directory], { encoding: "utf8" });
  expect(initialized.status).toBe(0);
  const backups = [
    "ios/Engine.previous-87a4a25-20260916/source-commit.txt",
    "ios/Engine.previous-new-checkpoint/frankenrobots/humanoid/index.html",
    ".beads/recovery_20260916T142845Z/issues.jsonl",
  ];
  const source = [
    "app/components/NewRobotControl.tsx",
    "ios/Sources/NewRobotControl.swift",
    "ios/EngineWeb/app/new-lab/page.tsx",
    "public/robots/g1/new-part.STL",
    ".beads/issues.jsonl",
    "tests/newOwner.test.ts",
  ];
  const ignored = spawnSync("git", ["check-ignore", "--no-index", "--stdin"], {
    cwd: directory,
    input: [...backups, ...source].join("\n") + "\n",
    encoding: "utf8",
  });
  expect({ status: ignored.status, stderr: ignored.stderr }).toEqual({ status: 0, stderr: "" });
  expect(ignored.stdout.trim().split("\n")).toEqual(backups);
});

function manifestFixture(): { directory: string; digest: string } {
  const directory = mkdtempSync(join(tmpdir(), "frankenrobots-manifest-test-"));
  const payload = "reviewed engine bytes\n";
  writeFileSync(join(directory, "payload.txt"), payload);
  const payloadDigest = createHash("sha256").update(payload).digest("hex");
  const manifest = `${payloadDigest}  ./payload.txt\n`;
  writeFileSync(join(directory, "engine-content-sha256.txt"), manifest);
  return {
    directory,
    digest: createHash("sha256").update(manifest).digest("hex"),
  };
}

async function runManifestVerification(directory: string, digest: string) {
  const process = Bun.spawn({
    cmd: [
      "zsh",
      "-c",
      'source "$1"; verify_content_manifest "$2" "test engine" "$3"',
      "verify-manifest",
      scriptFilePath,
      directory,
      digest,
    ],
    stdin: "ignore",
    stdout: "inherit",
    stderr: "inherit",
  });
  return process.exited;
}

async function runFilesystemVerification(stage: string, destination: string) {
  const child = Bun.spawn({
    cmd: [
      "zsh",
      "-c",
      'source "$1"; verify_same_filesystem "$2" "$3" "atomic activation filesystem check failed"',
      "verify-filesystem",
      scriptFilePath,
      stage,
      destination,
    ],
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const [exitCode, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);
  return { exitCode, stdout, stderr };
}

async function resolveOwnerRuntimeDirectory(ownerVersion: string) {
  const outputDirectory = mkdtempSync(join(tmpdir(), "frankenrobots-runtime-dir-test-"));
  const stdoutPath = join(outputDirectory, "stdout.txt");
  const stderrPath = join(outputDirectory, "stderr.txt");
  const process = Bun.spawn({
    cmd: [
      "zsh",
      "-c",
      'source "$1"; resolve_owner_runtime_dir "$2" >"$3" 2>"$4"',
      "resolve-owner-runtime",
      scriptFilePath,
      ownerVersion,
      stdoutPath,
      stderrPath,
    ],
    stdin: "ignore",
    stdout: "inherit",
    stderr: "inherit",
  });
  const exitCode = await process.exited;
  return {
    exitCode,
    stdout: readFileSync(stdoutPath, "utf8"),
    stderr: readFileSync(stderrPath, "utf8"),
  };
}

describe("FrankenRobots engine exporter safety boundary", () => {
  test("keeps shared and bundled typography independent of remote font hosts", () => {
    for (const source of [globalsCss, benchmarkGallery]) {
      expect(source).not.toContain("fonts.googleapis.com");
      expect(source).not.toContain("fonts.gstatic.com");
    }

    expect(globalsCss).toContain("typography uses platform fonts");
    expect(benchmarkGallery).toContain("-apple-system");
    expect(benchmarkGallery).toContain("SF Pro Text");
  });

  test("defaults to a staging-only mode", () => {
    expect(script).toContain("without changing ios/Engine (default)");
    expect(script).toContain('MODE="stage"');
  });

  test("uses the portable filesystem check before both staging and activation", () => {
    expect(script).toContain('verify_same_filesystem "$STAGE_PARENT" "$SCRIPT_DIR"');
    expect(script).toContain('verify_same_filesystem "$STAGED_ENGINE" "$SCRIPT_DIR"');
    expect(script).not.toContain("stat -f %d");
  });

  test("accepts real same-filesystem directories and follows path aliases", async () => {
    const root = mkdtempSync(join(tmpdir(), "frankenrobots-filesystem-test-"));
    const stage = join(root, "staged engine");
    const destination = join(root, "native shell");
    const alias = join(root, "stage alias");
    mkdirSync(stage);
    mkdirSync(destination);
    symlinkSync(stage, alias);
    for (const path of [stage, alias]) {
      expect(await runFilesystemVerification(path, destination)).toEqual({
        exitCode: 0,
        stdout: "",
        stderr: "",
      });
    }
  });

  test("refuses a real cross-filesystem stage", async () => {
    const root = mkdtempSync(join(tmpdir(), "frankenrobots-filesystem-test-"));
    // /dev is a separate mounted filesystem on the supported macOS/Linux hosts.
    expect(statSync(root, { bigint: true }).dev).not.toBe(
      statSync("/dev", { bigint: true }).dev,
    );
    const result = await runFilesystemVerification("/dev", root);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("engine paths are on different filesystems");
    expect(result.stderr).toContain(
      "Engine export refused: atomic activation filesystem check failed",
    );
  });

  test("refuses missing paths including when both lookups fail", async () => {
    const root = mkdtempSync(join(tmpdir(), "frankenrobots-filesystem-test-"));
    const missing = join(root, "missing");
    for (const [stage, destination] of [
      [missing, root],
      [root, missing],
      [missing, missing],
    ]) {
      const result = await runFilesystemVerification(stage, destination);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("ENOENT");
      expect(result.stderr).toContain(
        "Engine export refused: atomic activation filesystem check failed",
      );
    }
  });

  test("contains no destructive cleanup or overwrite primitive", () => {
    expect(script).not.toMatch(/\brm\s+-/);
    expect(script).not.toContain("rsync");
    expect(script).not.toContain("git clean");
    expect(script).not.toContain("git reset");
  });

  test("requires clean source receipts and validates the shipped capability payload", () => {
    expect(script).toContain("SOURCE_DIRTY=$(git status --porcelain --untracked-files=normal)");
    expect(script).toContain('FRANKENSIM_COMMIT=$(verify_owner_artifact "$PROJECT_ROOT/public")');
    expect(script).not.toContain("FRANKENSIM_ROOT");
    expect(script).toContain("verifyOwnerArtifacts");
    expect(script).toContain("verifyOwnerRuntimeIdentity");
    expect(script).toContain("verify_source_fences");
    expect(script).toContain("HEAD moved during export");
    expect(script).toContain("frankenrobots/humanoid/index.html");
    expect(script).toContain("frankenrobots/arm/index.html");
    expect(script).toContain("fs_cmaes_viz_wasm_bg.wasm");
    expect(script).toContain("workers/g1MeshParseWorker.js");
    expect(script).toContain("engine-content-sha256.txt");
  });

  test("maps the full owner-kernel contract to its versioned runtime directory", async () => {
    const result = await resolveOwnerRuntimeDirectory("fs-cmaes-viz-wasm 0.6.13");
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("v0613\n");
    expect(result.stderr).toBe("");
  });

  test("native export accepts the real owner and refuses changed manifest, glue and WASM bytes", async () => {
    const root = mkdtempSync(join(tmpdir(), "frankenrobots-owner-test-"));
    const relativeOwner = "wasm/fs-cmaes/v0623";
    const shippedOwner = fileURLToPath(new URL(`../public/${relativeOwner}`, import.meta.url));
    const invoke = async (engine: string) => {
      const child = Bun.spawn({
        cmd: [
          "zsh",
          "-c",
          'source "$1"; OWNER_RUNTIME_DIR=v0623; verify_owner_artifact "$2"',
          "verify-owner",
          scriptFilePath,
          engine,
        ],
        stdin: "ignore",
        stdout: "pipe",
        stderr: "pipe",
      });
      const [exitCode, stdout, stderr] = await Promise.all([
        child.exited,
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
      ]);
      return { exitCode, stdout, stderr };
    };
    for (const changed of [
      null,
      "manifest.json",
      "fs_cmaes_viz_wasm.js",
      "fs_cmaes_viz_wasm_bg.wasm",
    ]) {
      const engine = join(root, changed ?? "valid");
      const owner = join(engine, relativeOwner);
      mkdirSync(owner, { recursive: true });
      cpSync(shippedOwner, owner, { recursive: true });
      if (changed) {
        const path = join(owner, changed);
        const bytes = readFileSync(path);
        bytes[0] ^= 1;
        writeFileSync(path, bytes);
      }
      const result = await invoke(engine);
      writeFileSync(
        join(root, `${changed ?? "valid"}-result.json`),
        JSON.stringify(result, null, 2),
      );
      if (changed) {
        expect(result.exitCode).not.toBe(0);
        expect(result.stderr).toContain(
          changed === "manifest.json" ? "manifest differs" : "SHA-256 mismatch",
        );
      } else {
        expect(result.exitCode).toBe(0);
        expect(result.stdout.trim()).toMatch(/^[0-9a-f]{40}$/);
        expect(result.stderr).toBe("");
      }
    }
  });

  test("refuses an owner-kernel contract without an exact semver suffix", async () => {
    const result = await resolveOwnerRuntimeDirectory("fs-cmaes-viz-wasm latest");
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("owner kernel version has no valid semantic-version suffix");
  });

  test("preserves an existing engine at a printed rollback path during explicit activation", () => {
    expect(script).toContain('if [[ "$MODE" == "stage" ]]');
    expect(script).toContain("--activate-stage PATH");
    expect(script).toContain("--expect-manifest-sha256");
    expect(script).toContain('local rollback_engine="$STAGE_PARENT/previous-Engine"');
    expect(script).toContain('mv "$current_engine" "$rollback_engine"');
    expect(script).toContain("Previous engine preserved for rollback");
    expect(script).toContain("--allow-unverified-existing");
  });

  test("accepts an unchanged stage only with its reviewed manifest digest", async () => {
    const fixture = manifestFixture();
    const exitCode = await runManifestVerification(fixture.directory, fixture.digest);
    expect(exitCode).toBe(0);
  });

  test("rejects payload tampering after review", async () => {
    const fixture = manifestFixture();
    writeFileSync(join(fixture.directory, "payload.txt"), "changed after review\n");
    const exitCode = await runManifestVerification(fixture.directory, fixture.digest);
    expect(exitCode).toBe(1);
  });

  test("rejects a manifest replacement after review", async () => {
    const fixture = manifestFixture();
    writeFileSync(join(fixture.directory, "unlisted.txt"), "new unreviewed bytes\n");
    const updatedManifest =
      readFileSync(join(fixture.directory, "engine-content-sha256.txt"), "utf8") +
      `${createHash("sha256").update("new unreviewed bytes\n").digest("hex")}  ./unlisted.txt\n`;
    writeFileSync(join(fixture.directory, "engine-content-sha256.txt"), updatedManifest);
    const exitCode = await runManifestVerification(fixture.directory, fixture.digest);
    expect(exitCode).toBe(1);
  });
});
