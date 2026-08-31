// Regression test for the physics debug overlays' perf claim:
// when `enabled={false}`, the overlay must short-circuit and
// return null. Hooks may still run (React requires unconditional
// hook order across renders) but no JSX is produced and no edge
// geometry is uploaded to the GPU.
//
// This is a structural test: the component source must contain
// `if (!enabled) return null;` and the resulting render must be
// the empty string under react-dom/server. Both conditions together
// verify the perf claim is preserved through refactors.

import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { renderToString } from "react-dom/server";
import React from "react";
import { G1PhysicsDebugOverlay } from "../app/components/G1PhysicsDebugOverlay";
import { ArmPhysicsDebugOverlay } from "../app/components/ArmPhysicsDebugOverlay";

function readSrc(name: string): string {
  return readFileSync(
    join(import.meta.dir, "..", "app", "components", name),
    "utf-8",
  );
}

describe("physics debug overlays return null when disabled (perf claim)", () => {
  test("G1PhysicsDebugOverlay source has the early-return null guard", () => {
    const src = readSrc("G1PhysicsDebugOverlay.tsx");
    expect(src).toMatch(/if\s*\(\s*!enabled\s*\)\s*return\s+null\s*;/);
  });

  test("ArmPhysicsDebugOverlay source has the early-return null guard", () => {
    const src = readSrc("ArmPhysicsDebugOverlay.tsx");
    expect(src).toMatch(/if\s*\(\s*!enabled\s*\)\s*return\s+null\s*;/);
  });

  test("G1PhysicsDebugOverlay renders the empty string when enabled={false}", () => {
    const Component = G1PhysicsDebugOverlay as unknown as React.ComponentType<{
      enabled: boolean;
    }>;
    const tree = renderToString(
      React.createElement(Component, { enabled: false }),
    );
    expect(tree).toBe("");
  });

  test("ArmPhysicsDebugOverlay renders the empty string when enabled={false}", () => {
    const Component = ArmPhysicsDebugOverlay as unknown as React.ComponentType<{
      enabled: boolean;
    }>;
    const tree = renderToString(
      React.createElement(Component, { enabled: false }),
    );
    expect(tree).toBe("");
  });
});
