import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
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
  fileURLToPath(
    new URL(
      "../public/wasm-demo/examples/viz-benchmarks.html",
      import.meta.url,
    ),
  ),
  "utf8",
);

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

async function resolveOwnerRuntimeDirectory(ownerVersion: string) {
  const outputDirectory = mkdtempSync(
    join(tmpdir(), "frankenrobots-runtime-dir-test-"),
  );
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

  test("contains no destructive cleanup or overwrite primitive", () => {
    expect(script).not.toMatch(/\brm\s+-/);
    expect(script).not.toContain("rsync");
    expect(script).not.toContain("git clean");
    expect(script).not.toContain("git reset");
  });

  test("requires clean source receipts and validates the shipped capability payload", () => {
    expect(script).toContain(
      "SOURCE_DIRTY=$(git status --porcelain --untracked-files=normal)",
    );
    expect(script).toContain(
      'FRANKENSIM_COMMIT=$(verify_owner_artifact "$PROJECT_ROOT/public")',
    );
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
    const result = await resolveOwnerRuntimeDirectory(
      "fs-cmaes-viz-wasm 0.6.13",
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("v0613\n");
    expect(result.stderr).toBe("");
  });

  test("native export accepts the real owner and refuses changed manifest, glue and WASM bytes", async () => {
    const root = mkdtempSync(join(tmpdir(), "frankenrobots-owner-test-"));
    const relativeOwner = "wasm/fs-cmaes/v0622";
    const shippedOwner = fileURLToPath(
      new URL(`../public/${relativeOwner}`, import.meta.url),
    );
    const invoke = async (engine: string) => {
      const child = Bun.spawn({
        cmd: [
          "zsh",
          "-c",
          'source "$1"; OWNER_RUNTIME_DIR=v0622; verify_owner_artifact "$2"',
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
    const result = await resolveOwnerRuntimeDirectory(
      "fs-cmaes-viz-wasm latest",
    );
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain(
      "owner kernel version has no valid semantic-version suffix",
    );
  });

  test("preserves an existing engine at a printed rollback path during explicit activation", () => {
    expect(script).toContain('if [[ "$MODE" == "stage" ]]');
    expect(script).toContain("--activate-stage PATH");
    expect(script).toContain("--expect-manifest-sha256");
    expect(script).toContain(
      'local rollback_engine="$STAGE_PARENT/previous-Engine"',
    );
    expect(script).toContain('mv "$current_engine" "$rollback_engine"');
    expect(script).toContain("Previous engine preserved for rollback");
    expect(script).toContain("--allow-unverified-existing");
  });

  test("accepts an unchanged stage only with its reviewed manifest digest", async () => {
    const fixture = manifestFixture();
    const exitCode = await runManifestVerification(
      fixture.directory,
      fixture.digest,
    );
    expect(exitCode).toBe(0);
  });

  test("rejects payload tampering after review", async () => {
    const fixture = manifestFixture();
    writeFileSync(
      join(fixture.directory, "payload.txt"),
      "changed after review\n",
    );
    const exitCode = await runManifestVerification(
      fixture.directory,
      fixture.digest,
    );
    expect(exitCode).toBe(1);
  });

  test("rejects a manifest replacement after review", async () => {
    const fixture = manifestFixture();
    writeFileSync(
      join(fixture.directory, "unlisted.txt"),
      "new unreviewed bytes\n",
    );
    const updatedManifest =
      readFileSync(
        join(fixture.directory, "engine-content-sha256.txt"),
        "utf8",
      ) +
      `${createHash("sha256").update("new unreviewed bytes\n").digest("hex")}  ./unlisted.txt\n`;
    writeFileSync(
      join(fixture.directory, "engine-content-sha256.txt"),
      updatedManifest,
    );
    const exitCode = await runManifestVerification(
      fixture.directory,
      fixture.digest,
    );
    expect(exitCode).toBe(1);
  });
});
