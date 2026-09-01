/**
 * Edge-case regression tests for sweptSphereOBBEntryPoint. The basic
 * "end-to-end pipeline" test in penetrationPipeline.test.ts (if
 * reintroduced) would assert that the EE exits the OBB for any kernel
 * sample, but that's a multi-OBB convergence problem. These tests pin
 * down the *primitive's* contract: given a swept segment crossing one
 * OBB, the returned entry point is on the entry face at radius
 * clearance. If anyone reverts or changes the primitive, these fail.
 */

import { describe, expect, test } from "bun:test";
import {
  distanceToOBB,
  sweptSphereOBBEntryPoint,
  type OrientedBoundingBox,
} from "../app/lib/houseMultiObstacleKernel";

describe("sweptSphereOBBEntryPoint edge cases (SOTA contract)", () => {
  test("end-to-end through a thin OBB: entry on the +X face at radius clearance", () => {
    // OBB with very thin X extent (0.05 m), large Y/Z (0.5 m).
    const obb: OrientedBoundingBox = {
      id: "thin-wall",
      name: "thin wall",
      center: [0, 0, 0],
      halfExtents: [0.05, 0.5, 0.5],
      rotationYawRad: 0,
      exemptFromPenalty: false,
    };
    // prev: just outside +X. curr: just outside -X. The link tunneled
    // through in one frame.
    const prev: [number, number, number] = [obb.center[0] + obb.halfExtents[0] + 0.01, 0, 0];
    const curr: [number, number, number] = [obb.center[0] - obb.halfExtents[0] - 0.01, 0, 0];
    const radius = 0.025;

    const r = sweptSphereOBBEntryPoint(prev, curr, radius, obb);
    expect(r.wasHit).toBe(true);
    expect(r.entryPoint).toBeDefined();
    if (!r.entryPoint) return;
    // The entry point must be on the +X face (entry side, not -X).
    // The +X face is at x = obb.center[0] + obb.halfExtents[0] = 0.05.
    expect(r.entryPoint[0]).toBeGreaterThan(obb.center[0]);
    expect(r.entryPoint[0]).toBeCloseTo(
      obb.center[0] + obb.halfExtents[0] + radius,
      6,
    );
    // And the link must be at the requested clearance from the OBB.
    expect(distanceToOBB(r.entryPoint, obb)).toBeCloseTo(radius, 6);
  });

  test("no hit when the segment is entirely outside the OBB with margin", () => {
    const obb: OrientedBoundingBox = {
      id: "chair",
      name: "chair",
      center: [0, 0, 0],
      halfExtents: [0.3, 0.3, 0.3],
      rotationYawRad: 0,
      exemptFromPenalty: false,
    };
    const r = sweptSphereOBBEntryPoint(
      [2, 0, 0],
      [3, 0, 0],
      0.025,
      obb,
    );
    expect(r.wasHit).toBe(false);
    expect(r.entryPoint).toBeUndefined();
  });

  test("yaw-rotated OBB: entry point respects the rotation", () => {
    // 45-degree yaw rotates the OBB's axes. The conservative-advancement
    // bisection uses the rotated local frame, so the entry point must
    // come out on the correct rotated face.
    const obb: OrientedBoundingBox = {
      id: "tilted",
      name: "tilted panel",
      center: [0, 0, 0],
      halfExtents: [0.05, 0.5, 0.5],
      rotationYawRad: Math.PI / 4,
      exemptFromPenalty: false,
    };
    const r = sweptSphereOBBEntryPoint(
      [obb.center[0] + 0.1, 0, 0],
      [obb.center[0] - 0.1, 0, 0],
      0.025,
      obb,
    );
    expect(r.wasHit).toBe(true);
    if (!r.entryPoint) return;
    // Entry point must be on the rotated entry face (positive X side of
    // the rotated OBB), and at the requested clearance.
    expect(distanceToOBB(r.entryPoint, obb)).toBeCloseTo(0.025, 6);
  });
});

describe("sweptSphereOBBEntryPoint — regression for the 'pinned forever' fix", () => {
  test("a sphere already at clearance can move tangentially (no false-positive hit)", () => {
    // Regression for cmaes-u76s followup: a sphere sitting exactly on
    // the expanded OBB boundary used to register entryT=0 forever,
    // pinning the link at its first contact. The kernel fix
    // (kernelSummary: 'pinned-forever' guard) requires the next motion
    // to be STRICTLY INWARD into every touched face. Tangential motion
    // should not be a hit.
    const obb: OrientedBoundingBox = {
      id: "chair",
      name: "chair",
      center: [0, 0, 0],
      halfExtents: [0.5, 0.5, 0.5],
      rotationYawRad: 0,
      exemptFromPenalty: false,
    };
    const radius = 0.05;
    // prev is exactly at +X face + radius (tangent in local frame)
    const prev: [number, number, number] = [0.55, 0, 0];
    // curr moves along the +X face (tangentially, not inward)
    const curr: [number, number, number] = [0.55, 0, 0.2];
    const r = sweptSphereOBBEntryPoint(prev, curr, radius, obb);
    expect(r.wasHit).toBe(false);
  });

  test("a sphere at boundary moving AWAY from the OBB is not a hit", () => {
    const obb: OrientedBoundingBox = {
      id: "table",
      name: "table",
      center: [0, 0, 0],
      halfExtents: [0.5, 0.5, 0.5],
      rotationYawRad: 0,
      exemptFromPenalty: false,
    };
    const radius = 0.05;
    const prev: [number, number, number] = [0.55, 0, 0];
    // curr moves in +X (away from the OBB)
    const curr: [number, number, number] = [0.75, 0, 0];
    const r = sweptSphereOBBEntryPoint(prev, curr, radius, obb);
    expect(r.wasHit).toBe(false);
  });

  test("motion strictly into the boundary from the previous-frame position IS a hit", () => {
    // The OTHER half of the pinned-forever fix: when the previous
    // frame ended at the boundary and the next motion IS strictly
    // inward, we still register the hit (entryT=0 is the correct
    // answer because the link is already penetrating from frame N-1).
    const obb: OrientedBoundingBox = {
      id: "wall",
      name: "wall",
      center: [0, 0, 0],
      halfExtents: [0.5, 0.5, 0.5],
      rotationYawRad: 0,
      exemptFromPenalty: false,
    };
    const radius = 0.05;
    const prev: [number, number, number] = [0.55, 0, 0];
    // curr moves INWARD (-X)
    const curr: [number, number, number] = [0.4, 0, 0];
    const r = sweptSphereOBBEntryPoint(prev, curr, radius, obb);
    expect(r.wasHit).toBe(true);
    expect(r.entryT).toBe(0);
  });

  test("yawed OBB: tangential motion along the rotated face is not a hit", () => {
    // 90-degree yaw rotates the local +X face to world +Z. Tangential
    // motion along world +Z (the rotated face) must not be a hit.
    const obb: OrientedBoundingBox = {
      id: "yawed-panel",
      name: "yawed panel",
      center: [0, 0, 0],
      halfExtents: [0.5, 0.5, 0.05],
      rotationYawRad: Math.PI / 2,
      exemptFromPenalty: false,
    };
    const radius = 0.05;
    // The +Z face of the rotated OBB is at z = 0.55.
    const prev: [number, number, number] = [0, 0, 0.55];
    // Tangential motion in +X (along the face)
    const curr: [number, number, number] = [0.2, 0, 0.55];
    const r = sweptSphereOBBEntryPoint(prev, curr, radius, obb);
    expect(r.wasHit).toBe(false);
  });
});
