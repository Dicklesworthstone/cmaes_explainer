import { describe, expect, test } from "bun:test";
import {
  buildKmrBaseMesh,
  defaultKmrMaterialSet,
  KUKA_KMR_IIWA_PUBLIC_SPEC,
} from "../app/lib/kmrGeometry";

describe("KMR base 3D component (underlying geometry)", () => {
  // The KmrBase3D component is a thin React wrapper that calls
  // buildKmrBaseMesh + scanLidar at render time. bun:test cannot
  // mount a React component without React Testing Library (not a
  // project dependency). We instead test the underlying geometry
  // helpers that KmrBase3D wraps. The visual component itself is
  // covered by the E2E Playwright tests in the repo.
  test("buildKmrBaseMesh returns a Group with the expected name", () => {
    const mesh = buildKmrBaseMesh();
    expect(mesh.name).toBe("kmr_base_iiwa");
    expect(mesh.children.length).toBeGreaterThanOrEqual(7);
  });

  test("buildKmrBaseMesh respects a custom config", () => {
    const custom = {
      ...KUKA_KMR_IIWA_PUBLIC_SPEC,
      baseLengthMeters: 1.2,
    };
    const mesh = buildKmrBaseMesh(custom);
    expect(mesh).toBeDefined();
    expect(mesh.children.length).toBeGreaterThanOrEqual(7);
  });

  test("defaultKmrMaterialSet returns a fresh KMRMaterialSet each call", () => {
    const a = defaultKmrMaterialSet();
    const b = defaultKmrMaterialSet();
    expect(a).not.toBe(b); // different instances (Three.js materials are mutable)
    expect(a.chassisBody).toBeDefined();
    expect(b.chassisBody).toBeDefined();
    expect(a.chassisBody).not.toBe(b.chassisBody); // different objects
  });
});
