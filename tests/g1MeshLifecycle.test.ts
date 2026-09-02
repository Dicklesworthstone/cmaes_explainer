import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const flagship = readFileSync(
  new URL("../app/components/G1WalkingFlagship.tsx", import.meta.url),
  "utf8",
);

describe("G1 real-mesh lifecycle contract", () => {
  test("a failed page-lifetime parse can start a fresh real worker attempt", () => {
    expect(flagship).toContain("g1MeshCachePromise = null");
    expect(flagship).toContain("setAttempt((current) => current + 1)");
    expect(flagship).toContain("onClick={retryMeshes}");
    expect(flagship).toContain("Retry real mesh loading");
  });

  test("success and failure remain explicit instead of mocking a loaded state", () => {
    expect(flagship).toContain("Object.keys(meshState.geometries).length");
    expect(flagship).toContain("mesh parts decoded");
    expect(flagship).toContain("{meshState.error}");
    expect(flagship).toContain("kinematic skeleton remains active");
    expect(flagship).not.toContain('setState({ phase: "ready", geometries: {}');
  });
});
