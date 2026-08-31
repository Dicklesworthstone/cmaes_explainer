/**
 * SOTA swept-volume CCD test suite (Redon, Lin, Benichou 2002; Ericson
 * 2005 §5.5.7 ClosestPtPointOBB extended to swept-sphere-vs-OBB).
 *
 * The renderer-layer link-OBB penetration projection in
 * householdPhysicsWorld / G1WalkingFlagship / HouseholdArmFlagship
 * snaps the link to the surface after the per-frame kernel sample is
 * received. That is sufficient when the link stays outside the OBB
 * between frames. The conservative-advancement CCD here closes the
 * residual tunnel case: when the previous frame's projected position
 * is outside an OBB and the current frame's kernel position is inside,
 * the snap-to-surface would teleport the link to the deep-interior
 * closest point. The CCD snaps it to the swept entry point instead,
 * which is visually continuous.
 */

import { describe, expect, test } from "bun:test";
import {
  CRAFTSMAN_BUNGALOW_1928,
} from "../app/lib/houseScenes";
import {
  createHouseNavigationScene,
  distanceToOBB,
  sweptSphereOBBEntryPoint,
  type OrientedBoundingBox,
} from "../app/lib/houseMultiObstacleKernel";

function obb(
  center: [number, number, number],
  halfExtents: [number, number, number],
  rotationYawRad: number,
  name = "test",
  id = "test",
): OrientedBoundingBox {
  return { id, name, center, halfExtents, rotationYawRad, exemptFromPenalty: false };
}

describe("sweptSphereOBBEntryPoint (SOTA swept-volume CCD)", () => {
  test("no hit when the segment is entirely outside the OBB", () => {
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], 0);
    const result = sweptSphereOBBEntryPoint(
      [2, 0, 0],
      [3, 0, 0],
      0.05,
      box,
    );
    expect(result.wasHit).toBe(false);
  });

  test("detects outside-to-outside enter-exit tunneling", () => {
    const box = obb([0, 0, 0], [0.05, 0.5, 0.5], Math.PI / 7);
    const result = sweptSphereOBBEntryPoint([-1, 0, 0], [1, 0, 0], 0.02, box);
    expect(result.wasHit).toBe(true);
    expect(result.entryT).toBeGreaterThan(0);
    expect(result.entryT).toBeLessThan(0.5);
    expect(distanceToOBB(result.entryPoint!, box)).toBeGreaterThanOrEqual(0.02 - 1e-6);
  });

  test("an invalid inside start is reported immediately", () => {
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], 0);
    const result = sweptSphereOBBEntryPoint([0.1, 0, 0], [0.2, 0, 0], 0.05, box);
    expect(result.wasHit).toBe(true);
    expect(result.entryT).toBe(0);
    expect(distanceToOBB(result.entryPoint!, box)).toBeGreaterThanOrEqual(0.05 - 1e-6);
  });

  test("hit when the segment crosses the OBB surface; entry point is on the surface", () => {
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], 0);
    // Segment starts outside (x=1.0) and ends inside (x=0.0). The swept
    // sphere of radius 0.05 should detect the crossing and return an
    // entry point just outside the +X face.
    const result = sweptSphereOBBEntryPoint(
      [1.0, 0, 0],
      [0.0, 0, 0],
      0.05,
      box,
    );
    expect(result.wasHit).toBe(true);
    expect(result.entryPoint).toBeDefined();
    const ep = result.entryPoint as [number, number, number];
    // The entry point sits just outside the +X face (x = +0.5 + 0.05).
    expect(ep[0]).toBeCloseTo(0.55, 2);
    expect(ep[1]).toBeCloseTo(0, 3);
    expect(ep[2]).toBeCloseTo(0, 3);
    // The post-projection distance to the OBB surface is at least the
    // requested clearance.
    expect(distanceToOBB(ep, box)).toBeGreaterThanOrEqual(0.05 - 1e-6);
  });

  test("a fast link that tunnels through is snapped to the entry face, not the deep interior", () => {
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], 0);
    // Link moves from x=0.6 (just outside) to x=-0.4 (deep interior)
    // in one frame. Without CCD the snap would put the link at the
    // deepest-face projection, but the CCD finds the entry on +X.
    const result = sweptSphereOBBEntryPoint(
      [0.6, 0, 0],
      [-0.4, 0, 0],
      0.05,
      box,
    );
    expect(result.wasHit).toBe(true);
    const ep = result.entryPoint as [number, number, number];
    // The entry must be on the +X face side, not the deep -X interior.
    expect(ep[0]).toBeGreaterThan(0.4);
    expect(ep[0]).toBeLessThan(0.7);
  });

  test("a yaw-rotated OBB is handled correctly", () => {
    // 45-degree yaw rotates the box. The swept-sphere entry should
    // still land on the rotated face, not the axis-aligned one.
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], Math.PI / 4);
    const result = sweptSphereOBBEntryPoint(
      [1.0, 0, 0],
      [0.0, 0, 0],
      0.05,
      box,
    );
    expect(result.wasHit).toBe(true);
    expect(result.entryPoint).toBeDefined();
    // The entry point should have positive x (entry side of the
    // rotated box) and y is rotated away from the +x axis.
    const ep = result.entryPoint as [number, number, number];
    expect(ep[0]).toBeGreaterThan(0.2);
  });

  test("full Craftsman bungalow catalog: a sample that tunnels through a chair is caught", () => {
    // Use the real OBB catalog. The Craftsman bungalow has at least
    // one chair / table OBB; pick a sample whose prev-curr segment
    // crosses that OBB and confirm CCD reports a hit.
    const scene = createHouseNavigationScene(CRAFTSMAN_BUNGALOW_1928);
    const target = scene.obstacles.find((o) => !o.exemptFromPenalty);
    expect(target).toBeDefined();
    if (!target) return;
    const c = target.center;
    const h = target.halfExtents[0];
    // Start well outside on +X, end deep inside on -X.
    const result = sweptSphereOBBEntryPoint(
      [c[0] + h + 0.5, c[1], c[2]],
      [c[0] - h - 0.1, c[1], c[2]],
      0.05,
      target,
    );
    expect(result.wasHit).toBe(true);
    expect(result.entryPoint).toBeDefined();
    const ep = result.entryPoint as [number, number, number];
    // The entry point sits on the +X face of the OBB.
    expect(ep[0]).toBeGreaterThan(c[0] - 1e-6);
    expect(ep[0]).toBeLessThan(c[0] + h + 0.06);
  });
});
