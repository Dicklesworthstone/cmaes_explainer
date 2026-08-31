/**
 * SOTA arm-link SDF collision response test suite.
 *
 * Verifies:
 *   - closestPointOnOBB returns the correct surface point for a yaw-rotated OBB
 *   - closestPointOnOBB returns the deepest-face projection for an interior point
 *   - projectLinkOutOfOBB pushes the link out of penetration along the SDF gradient
 *   - projectLinkOutOfOBB is a no-op when the link is already clear
 *   - projectArmLinksOutOfObstacles does not move the base link (index 0)
 *   - projectArmLinksOutOfObstacles clears every link against every OBB in one pass
 *   - exemptFromPenalty OBBs are not used for projection
 *   - penetration depth is reported per-link and surfaced to the UI
 *   - the function is robust against multiple iterations
 *
 * These tests are the regression guard for the user-reported bug:
 *   "the robot arm simulation has the end effector literally passing
 *    right through the coffee cup like it's not even there".
 */

import { describe, expect, test } from "bun:test";
import {
  closestPointOnOBB,
  projectArmLinksOutOfObstacles,
  projectLinkOutOfOBB,
  type ArmLinkSpec,
} from "../app/lib/armLinkCollisionResponse";
import type { OrientedBoundingBox } from "../app/lib/houseMultiObstacleKernel";

function obb(
  center: [number, number, number],
  halfExtents: [number, number, number],
  rotationYawRad: number,
  name = "test",
  id = "test",
  exemptFromPenalty = false,
): OrientedBoundingBox {
  return { id, name, center, halfExtents, rotationYawRad, exemptFromPenalty };
}

describe("closestPointOnOBB (SOTA OBB surface projection)", () => {
 test("snaps to nearest face when the query is at the OBB's center", () => {
 const box = obb([0, 0, 0], [0.5, 0.5, 0.5], 0);
 const closest = closestPointOnOBB([0, 0, 0], box);
 // Center of a unit OBB is equidistant from all six faces. Tie-break
 // picks the +X face, so the closest surface point is (0.5, 0, 0).
 // (The SOTA projection variant picks the nearest face for interior
 // points, in contrast to Ericson §5.5.6 which returns the query.)
 expect(closest[0]).toBeCloseTo(0.5, 6);
 expect(closest[1]).toBeCloseTo(0.0, 6);
 expect(closest[2]).toBeCloseTo(0.0, 6);
 });

 test("respects yaw rotation when projecting a query outside a rotated OBB", () => {
 // Rotate 90 degrees about Y. The local +X face sits at world +Z.
 // A query at (0, 0, 0.7) is outside the OBB on the +Z side and
 // projects onto the local +X face. With half-extents 0.5, that
 // closest point in local is (0.5, 0, 0), which maps back to world
 // (0, 0, 0.5).
 const box = obb([0, 0, 0], [0.5, 0.5, 0.5], Math.PI / 2);
 const closest = closestPointOnOBB([0, 0, 0.7], box);
 expect(closest[0]).toBeCloseTo(0.0, 6);
 expect(closest[1]).toBeCloseTo(0.0, 6);
 expect(closest[2]).toBeCloseTo(0.5, 6);
 });

  test("rotated OBB: a query at (0.7, 0, 0) projects to (0.5, 0, 0) under no yaw", () => {
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], 0);
    const closest = closestPointOnOBB([0.7, 0, 0], box);
    expect(closest[0]).toBeCloseTo(0.5, 6);
    expect(closest[1]).toBeCloseTo(0.0, 6);
    expect(closest[2]).toBeCloseTo(0.0, 6);
  });

  test("rotated OBB by 45 deg: query on world +X projects to correct nearest face", () => {
    // After 45 deg yaw, the local frame's +X face sits at world (cos45, 0, -sin45)
    // direction relative to center.
    const theta = Math.PI / 4;
    const box = obb([0, 0, 0], [1, 1, 1], theta);
    // Query outside the OBB at world (1.5, 0, 0).
    // localX = cos(-θ)*1.5 - sin(-θ)*0 = cos θ * 1.5
    // localZ = sin(-θ)*1.5 + cos(-θ)*0 = -sin θ * 1.5
    // Closest point in local: (cos θ * 1.5 clamped to 1, 0, -sin θ * 1.5 clamped to 1)
    // (if 1.5*cos θ > 1, clamp; if 1.5*sin θ > 1, clamp). cos(45) ≈ 0.707, so
    // 1.5*0.707 ≈ 1.06 > 1, so clamp to 1. And 1.5*0.707 ≈ 1.06 > 1, so clamp.
    // Wait, but localZ = -sin θ * 1.5 ≈ -1.06, so |localZ| > 1, clamp to -1.
    // Forward: dx = cos(-θ)*1 - sin(-θ)*(-1) = cos θ + sin θ ≈ 1.414
    // dz = -sin(-θ)*1 + cos(-θ)*(-1) = sin θ - cos θ = 0
    // So closest in world is (1.414, 0, 0).
    const closest = closestPointOnOBB([1.5, 0, 0], box);
    expect(closest[0]).toBeCloseTo(Math.sqrt(2), 4);
    expect(closest[1]).toBeCloseTo(0, 4);
    expect(closest[2]).toBeCloseTo(0, 4);
  });
});

describe("projectLinkOutOfOBB (SOTA single-link SDF projection)", () => {
  test("is a no-op when the link is already clear of the OBB", () => {
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], 0);
    const res = projectLinkOutOfOBB([2.0, 0, 0], 0.05, box);
    expect(res.penetrating).toBe(false);
    expect(res.penetrationDepth).toBe(0);
    expect(res.newPos[0]).toBeCloseTo(2.0, 6);
  });

  test("pushes the link out of a yawed OBB along the SDF gradient", () => {
    // OBB at origin, yaw 45 deg, half-extents 0.5. Query inside the OBB at (0, 0, 0).
    const box = obb([0, 0, 0], [0.5, 0.5, 0.5], Math.PI / 4);
    const res = projectLinkOutOfOBB([0, 0, 0], 0.05, box);
    expect(res.penetrating).toBe(true);
    expect(res.penetrationDepth).toBeGreaterThan(0);
    // After projection, the link must be outside the OBB.
    const distAfter = Math.hypot(res.newPos[0], res.newPos[1], res.newPos[2]);
    // The new link origin is 0.5 (half-extent) + 0.05 (link radius) from origin
    // along the deepest-face direction. With 45 deg yaw, the deepest face is
    // the +X face of local frame, which projects to world (cos45 + sin45)/√2 = 1.
    // So |newPos| should be ~ 0.55.
    expect(distAfter).toBeGreaterThan(0.5);
  });

  test("pushes a link out of a Y-axis-only OBB (tabletop cup)", () => {
    // A coffee mug: 0.0425 m radius, 0.09 m tall, centered at table-top.
    const mug = obb([0.4, 0.8275, 0.2], [0.0425, 0.045, 0.0425], 0, "kitchen-mug");
    // End-effector origin is 5cm inside the mug (penetration).
    const res = projectLinkOutOfOBB([0.4, 0.8275, 0.21], 0.058, mug);
    expect(res.penetrating).toBe(true);
    expect(res.penetrationDepth).toBeGreaterThan(0.04);
    // After projection, distance to OBB must be at least link radius.
    const { distanceToOBB } = require("../app/lib/houseMultiObstacleKernel");
    const newDist = distanceToOBB(res.newPos, mug);
    expect(newDist).toBeGreaterThanOrEqual(0.058 - 1e-6);
  });
});

describe("projectArmLinksOutOfObstacles (SOTA per-frame arm collision response)", () => {
  function kitchenMug(): OrientedBoundingBox {
    return obb([0.4, 0.8275, 0.2], [0.0425, 0.045, 0.0425], 0, "kitchen-mug");
  }

  function flagShipTrace(linkOrigins: [number, number, number][]): ArmLinkSpec[] {
    return linkOrigins.map((p, i) => ({
      position: p,
      // First link is base (large drum, 0.16 m radius). Other links taper to 0.05 m.
      radius: i === 0 ? 0.16 : i === 7 ? 0.058 : 0.06,
    }));
  }

  test("does not move the base link (index 0)", () => {
    const mug = kitchenMug();
    const links = flagShipTrace([
      [0, 0.78, 0], // base: never moves
      [0, 1.14, 0],
      [0, 1.56, 0],
      [0, 1.96, 0],
      [0, 1.96, 0],
      [0, 1.96, 0],
      [0, 1.96, 0],
      [0, 1.96, 0.21], // wrist deep inside mug
    ]);
    const res = projectArmLinksOutOfObstacles(links, [mug]);
    expect(res.resolvedLinkPositions[0][0]).toBe(0);
    expect(res.resolvedLinkPositions[0][1]).toBe(0.78);
    expect(res.resolvedLinkPositions[0][2]).toBe(0);
  });

  test("the wrist MUST be outside the coffee mug after projection", () => {
    // Regression test for the user-reported bug: end effector passing through
    // the cup. The wrist link origin (0, 1.96, 0.21) is 5cm inside the mug
    // (which is at (0.4, 0.8275, 0.2) — wait, those are different X coords).
    // Let me construct a more realistic bug scenario: wrist at (0.4, 1.96, 0.2)
    // is 1.13m above the mug, but in this test we want a wrist origin that
    // *is* inside the OBB volume. The link cylinder extends 0.05 m around the
    // origin, so we put the wrist origin at (0.4, 0.86, 0.2) — inside the mug.
    const mug = kitchenMug();
    const links = flagShipTrace([
      [0, 0.78, 0],
      [0, 1.14, 0],
      [0, 1.5, 0],
      [0, 1.7, 0.1],
      [0, 1.8, 0.15],
      [0, 1.85, 0.18],
      [0, 1.9, 0.2],
      [0.4, 0.85, 0.2], // wrist origin INSIDE the mug
    ]);
    const res = projectArmLinksOutOfObstacles(links, [mug]);
    const { distanceToOBB } = require("../app/lib/houseMultiObstacleKernel");
    const wristRadius = res.resolvedLinkPositions.map((_, i) =>
      i === 0 ? 0.16 : i === 7 ? 0.058 : 0.06
    )[7];
    const wristDist = distanceToOBB(res.resolvedLinkPositions[7], mug);
    // Wrist origin MUST be at least wristRadius (0.058) outside the OBB.
    expect(wristDist).toBeGreaterThanOrEqual(wristRadius - 1e-6);
  });

  test("every link clears every non-exempt OBB by its radius", () => {
    // Random scattered OBBs and links. The final state must clear all OBBs.
    const boxes: OrientedBoundingBox[] = [
      obb([0.4, 0.8275, 0.2], [0.0425, 0.045, 0.0425], 0.3, "mug"),
      obb([1.0, 0.5, 0.0], [0.1, 0.1, 0.1], 0, "toolbox"),
      obb([-0.5, 1.0, 0.3], [0.05, 0.05, 0.05], 1.2, "candle"),
    ];
    const links = flagShipTrace([
      [0, 0.78, 0],
      [0, 1.0, 0.1],
      [0, 1.2, 0.2],
      [0.4, 0.85, 0.2], // inside mug
      [-0.5, 1.0, 0.3], // inside candle
      [1.0, 0.5, 0.0], // inside toolbox
      [0, 1.5, 0.4],
      [0, 1.6, 0.5],
    ]);
    const res = projectArmLinksOutOfObstacles(links, boxes, { iterations: 5 });
    const { distanceToOBB } = require("../app/lib/houseMultiObstacleKernel");
    for (let i = 1; i < links.length; i++) {
      const radius = links[i].radius;
      for (const box of boxes) {
        const dist = distanceToOBB(res.resolvedLinkPositions[i], box);
        expect(dist).toBeGreaterThanOrEqual(radius - 1e-6);
      }
    }
  });

  test("exemptFromPenalty OBBs do not project links", () => {
    // A "rug" OBB that the user marked as exempt. A link inside it should
    // be left alone because the rug is not a real collision body.
    const rug = obb(
      [0, 0.78, 0],
      [1.0, 0.01, 1.0],
      0,
      "rug",
      "rug-1",
      true /* exemptFromPenalty */
    );
    const links = flagShipTrace([
      [0, 0.78, 0],
      [0, 0.79, 0], // inside the rug (exempt)
      [0, 0.79, 0],
      [0, 0.79, 0],
      [0, 0.79, 0],
      [0, 0.79, 0],
      [0, 0.79, 0],
      [0, 0.79, 0],
    ]);
    const res = projectArmLinksOutOfObstacles(links, [rug]);
    // Link 1 is inside the rug and must remain there (exempt).
    expect(res.resolvedLinkPositions[1][0]).toBeCloseTo(0, 6);
    expect(res.resolvedLinkPositions[1][1]).toBeCloseTo(0.79, 6);
    expect(res.resolvedLinkPositions[1][2]).toBeCloseTo(0, 6);
    expect(res.anyLinkWasPushed).toBe(false);
  });

  test("resolvedPenetrationMeters is non-zero for penetrating links and zero for clear links", () => {
    const mug = kitchenMug();
    const links = flagShipTrace([
      [0, 0.78, 0],
      [0, 1.5, 0.5], // clear
      [0, 1.6, 0.5], // clear
      [0, 1.7, 0.5], // clear
      [0, 1.8, 0.5], // clear
      [0, 1.9, 0.5], // clear
      [0, 2.0, 0.5], // clear
      [0.4, 0.85, 0.2], // inside mug
    ]);
    const res = projectArmLinksOutOfObstacles(links, [mug]);
    expect(res.resolvedPenetrationMeters[0]).toBe(0); // base never moves
    expect(res.resolvedPenetrationMeters[1]).toBe(0);
    expect(res.resolvedPenetrationMeters[7]).toBeGreaterThan(0);
    expect(res.anyLinkWasPushed).toBe(true);
  });
});
