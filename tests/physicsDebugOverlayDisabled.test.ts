// Regression test for the physics debug overlays' perf claim:
// when `enabled={false}`, the overlay must short-circuit and
// return null. Hooks may still run (React requires unconditional
// hook order across renders) but no JSX is produced and no edge
// geometry is uploaded to the GPU.
//
// We assert two contracts:
//   1. Structural: the component source contains the
//      `if (!enabled) return null;` early-return (white-box).
//   2. Behavioral: renderToString with enabled={false} returns the
//      empty string, even when sample/obstacles are non-null
//      (so the test would catch a regression where the early-return
//      was placed after JSX, or where a return-null is replaced by
//      a no-op group).
//
// We also assert the inverse: renderToString with enabled={true} and
// a non-null sample/obstacles list does NOT return the empty string,
// proving the perf claim is conditional on enabled alone.

import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { renderToString } from "react-dom/server";
import React from "react";
import { G1PhysicsDebugOverlay } from "../app/components/G1PhysicsDebugOverlay";
import { ArmPhysicsDebugOverlay } from "../app/components/ArmPhysicsDebugOverlay";
import {
  createSceneFromHouseFurniture,
  type OrientedBoundingBox,
} from "../app/lib/houseMultiObstacleKernel";
import type {
  G1TraceSample,
  HouseholdManipulationTraceSample,
} from "../app/lib/frankensimCmaes";

function readSrc(name: string): string {
  return readFileSync(
    join(import.meta.dir, "..", "app", "components", name),
    "utf-8",
  );
}

const Component = G1PhysicsDebugOverlay as unknown as React.ComponentType<{
  enabled: boolean;
  sample: G1TraceSample | null;
  obstacles: OrientedBoundingBox[];
  pelvisPosition: [number, number, number];
  safeRadius: number;
}>;

const ArmComponent = ArmPhysicsDebugOverlay as unknown as React.ComponentType<{
  enabled: boolean;
  sample: HouseholdManipulationTraceSample | null;
  obstacles: OrientedBoundingBox[];
  targetPosition: [number, number, number] | null;
  safeRadius: number;
}>;

const scene = createSceneFromHouseFurniture();
const G1Props = {
  sample: null as G1TraceSample | null,
  obstacles: scene.obstacles,
  pelvisPosition: [0, 0.75, 0] as [number, number, number],
  safeRadius: 0.32,
};
const ArmProps = {
  sample: null as HouseholdManipulationTraceSample | null,
  admission: {
    policyDimension: 128 as const,
    jointCount: 7,
    policyKnots: 16,
    linkCount: 8,
    poseWords: 7,
    traceSampleWords: 67,
    minimumGripperWidthMeters: 0.02,
    openGripperWidthMeters: 0.085,
    placementToleranceMeters: 0.01,
    liftTargetMeters: 0.15,
    config: {
      task: "kitchen-mug" as const,
      stepSeconds: 1 / 90,
      durationSeconds: 6,
      traceStride: 3,
    },
    scene: {
      objectMassKilograms: 0.3,
      objectDimensionsMeters: [0.08, 0.08, 0.12] as [number, number, number],
      graspHalfWidthMeters: 0.045,
      initialObjectPositionMeters: [0.55, 0.0, 0.78] as [number, number, number],
      goalObjectPositionMeters: [0.2, 0.0, 0.78] as [number, number, number],
      supportHeightMeters: 0.78,
      obstacleCenterMeters: [0.4, 0.0, 0.78] as [number, number, number],
      obstacleHalfExtentsMeters: [0.15, 0.15, 0.15] as [number, number, number],
    },
  },
  obstacles: scene.obstacles,
  targetPosition: [0.3, 0.82, 0.2] as [number, number, number] | null,
  safeRadius: 0.04,
};

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
    const tree = renderToString(
      React.createElement(Component, { enabled: false, ...G1Props }),
    );
    expect(tree).toBe("");
  });

  test("ArmPhysicsDebugOverlay renders the empty string when enabled={false}", () => {
    const tree = renderToString(
      React.createElement(ArmComponent, { enabled: false, ...ArmProps }),
    );
    expect(tree).toBe("");
  });

  test("G1PhysicsDebugOverlay renders non-empty when enabled={true} (positive control)", () => {
    const tree = renderToString(
      React.createElement(Component, { enabled: true, ...G1Props }),
    );
    expect(tree.length).toBeGreaterThan(0);
  });

  test("ArmPhysicsDebugOverlay renders non-empty when enabled={true} (positive control)", () => {
    const tree = renderToString(
      React.createElement(ArmComponent, { enabled: true, ...ArmProps }),
    );
    expect(tree.length).toBeGreaterThan(0);
  });
});
