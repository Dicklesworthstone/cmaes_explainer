/**
 * Tests for cmaes-ndl8 (HJ reachability BRT static safety check).
 *
 * Semantics under test (see module doc): the graph metric is the
 * inscribed-diamond L1 bound — axis-aligned travel at vMax, no diagonal
 * shortcut, heading changes cost dTheta/omegaMax, target set is a disc
 * (distance credit = radius). Unreachable = +inf. All runs bit-identical.
 */

import { describe, expect, test } from "bun:test";
import { makeOBBUnionSDF, type OBB2D } from "./dpValueIteration";
import {
  isSafeStart,
  sampleTimeAt,
  solveBackwardReachableTube,
  type BRTParams,
} from "./hjiReachability";

const EMPTY_ROOM: BRTParams = {
  bounds: { min: [0, 0], max: [10, 10] },
  nx: 81,
  ny: 81,
  nTheta: 36,
  vMax: 1,
  omegaMax: 10,
  bodyRadius: 0.25,
};

describe("BRT empty-room Eikonal sanity", () => {
  const sdf = makeOBBUnionSDF([]);
  const field = solveBackwardReachableTube(sdf, { center: [5, 5], radius: 0.5 }, EMPTY_ROOM);

  test("target cells are zero for every heading", () => {
    expect(sampleTimeAt(field, 5, 5, 0)).toBe(0);
    expect(sampleTimeAt(field, 5, 5, Math.PI)).toBe(0);
    expect(sampleTimeAt(field, 5, 5, 1.234)).toBe(0);
  });

  test("time equals travel distance to the target disc within grid slack", () => {
    // Axis-aligned samples: the L1 metric reproduces Euclidean distance
    // here, and the disc radius counts as reached.
    for (const dist of [2, 4]) {
      const t = sampleTimeAt(field, 5 + dist, 5, 0);
      const expected = dist - 0.5;
      expect(Number.isFinite(t)).toBe(true);
      expect(t).toBeGreaterThanOrEqual(expected - 0.35); // grid slack; never faster than physics
      expect(t).toBeLessThanOrEqual(expected + 0.5);
    }
    const tNear = sampleTimeAt(field, 6, 5, 0);
    const tFar = sampleTimeAt(field, 8, 5, 0);
    expect(tFar).toBeGreaterThan(tNear);
  }, 30000);

  test("heading wrap-around samples the same bin", () => {
    const a = sampleTimeAt(field, 7, 5, 0.13);
    const b = sampleTimeAt(field, 7, 5, 0.13 + Math.PI * 2);
    expect(a).toBe(b);
  });
});

describe("BRT wall with doorway", () => {
  // Vertical wall at x=5 split into two segments leaving a 0.5m doorway at
  // y in (4.2, 4.7). Target on the far (east) side. The start below is
  // deliberately OFF the doorway axis, so the only finite path must route
  // north through the doorway before heading east.
  const walls: OBB2D[] = [
    { center: [5, 2.2], halfExtents: [0.15, 2.0], yaw: 0 },
    { center: [5, 6.25], halfExtents: [0.15, 1.3], yaw: 0 },
  ];
  const sdf = makeOBBUnionSDF(walls);
  const params: BRTParams = { ...EMPTY_ROOM, bodyRadius: 0.3 };
  const field = solveBackwardReachableTube(sdf, { center: [8, 4.45], radius: 0.3 }, params);

  test("doorway path is finite and monotone", () => {
    const t1 = sampleTimeAt(field, 4.4, 4.0, 0);
    const t2 = sampleTimeAt(field, 4.4, 1.0, 0);
    expect(Number.isFinite(t1)).toBe(true);
    expect(Number.isFinite(t2)).toBe(true);
    expect(t2).toBeGreaterThan(t1);
  }, 30000);

  test("cell inside the wall body is unreachable at every heading", () => {
    for (let k = 0; k < field.nTheta; k += 7) {
      expect(sampleTimeAt(field, 5, 6.25, k * field.dTheta)).toBe(Number.POSITIVE_INFINITY);
    }
  });

  test("routed start pays the doorway detour over the open room", () => {
    const viaDoorway = sampleTimeAt(field, 4.4, 1.0, 0);
    const openField = solveBackwardReachableTube(
      makeOBBUnionSDF([]),
      { center: [8, 4.45], radius: 0.3 },
      params,
    );
    const open = sampleTimeAt(openField, 4.4, 1.0, 0);
    // The metric is L1 + turn costs, so the detour ratio is modest; the
    // assertion is that the wall forces strictly more time than open space.
    expect(viaDoorway).toBeGreaterThan(open * 1.05);
  }, 60000);

  test("isSafeStart gates unreachable starts", () => {
    expect(isSafeStart(field, 4.4, 4.0, 0)).toBe(true);
    expect(isSafeStart(field, 5, 6.25, 0)).toBe(false);
    expect(isSafeStart(field, 99, 99, 0)).toBe(false); // out of domain
  });
});

describe("BRT heading dependence", () => {
  // Wall ahead along +x; goal directly along +y from the start, so the
  // +y-facing heading walks straight out while the +x-facing heading must
  // pay a 90-degree turn first.
  const sdf = makeOBBUnionSDF([{ center: [6, 4], halfExtents: [0.15, 4], yaw: 0 }]);
  const params: BRTParams = { ...EMPTY_ROOM, bodyRadius: 0.3 };
  const field = solveBackwardReachableTube(sdf, { center: [4, 8], radius: 0.3 }, params);

  test("heading along the free corridor reaches faster than heading into the wall", () => {
    const alongY = sampleTimeAt(field, 4, 4, Math.PI / 2); // facing +y (goal side)
    const intoWall = sampleTimeAt(field, 4, 4, 0); // facing +x (the wall)
    expect(Number.isFinite(alongY)).toBe(true);
    expect(Number.isFinite(intoWall)).toBe(true);
    expect(intoWall).toBeGreaterThan(alongY);
    // The excess must be at least one quarter-turn cost (9 bins here).
    expect(intoWall - alongY).toBeGreaterThanOrEqual((Math.PI / 2 / 10) * 0.9);
  }, 30000);
});

describe("BRT determinism and validation", () => {
  test("identical inputs produce bit-identical fields", () => {
    const sdf = makeOBBUnionSDF([{ center: [4, 5], halfExtents: [0.5, 0.5], yaw: 0.3 }]);
    const a = solveBackwardReachableTube(sdf, { center: [8, 8], radius: 0.4 }, EMPTY_ROOM);
    const b = solveBackwardReachableTube(sdf, { center: [8, 8], radius: 0.4 }, EMPTY_ROOM);
    expect(a.settledNodes).toBe(b.settledNodes);
    expect(a.time.length).toBe(b.time.length);
    let identical = true;
    for (let i = 0; i < a.time.length; i++) {
      if (a.time[i] !== b.time[i]) {
        identical = false;
        break;
      }
    }
    expect(identical).toBe(true);
  }, 60000);

  test("rejects degenerate grids and non-positive speeds", () => {
    const sdf = makeOBBUnionSDF([]);
    expect(() =>
      solveBackwardReachableTube(sdf, { center: [5, 5], radius: 0.5 }, { ...EMPTY_ROOM, nx: 1 }),
    ).toThrow();
    expect(() =>
      solveBackwardReachableTube(sdf, { center: [5, 5], radius: 0.5 }, { ...EMPTY_ROOM, nTheta: 0 }),
    ).toThrow();
    expect(() =>
      solveBackwardReachableTube(sdf, { center: [5, 5], radius: 0.5 }, { ...EMPTY_ROOM, vMax: 0 }),
    ).toThrow();
    expect(() =>
      solveBackwardReachableTube(sdf, { center: [5, 5], radius: 0.5 }, { ...EMPTY_ROOM, omegaMax: -1 }),
    ).toThrow();
  });
});

describe("BRT house-scale performance", () => {
  test("200x200x72 grid solves inside the session budget", () => {
    const sdf = makeOBBUnionSDF([
      { center: [5, 2.2], halfExtents: [0.15, 2.0], yaw: 0 },
      { center: [5, 6.25], halfExtents: [0.15, 1.3], yaw: 0 },
      { center: [3, 3], halfExtents: [0.6, 0.6], yaw: 0.5 },
      { center: [7, 7], halfExtents: [0.8, 0.5], yaw: -0.25 },
    ]);
    const params: BRTParams = {
      bounds: { min: [0, 0], max: [10, 10] },
      nx: 200,
      ny: 200,
      nTheta: 72,
      vMax: 1.2,
      omegaMax: 4,
      bodyRadius: 0.3,
    };
    const field = solveBackwardReachableTube(sdf, { center: [1, 1], radius: 0.3 }, params);
    // Logged for the perf receipt; generous bound avoids CI flake.
    console.log(`[hjiReachability] 200x200x72 solve: ${field.solveMs.toFixed(0)}ms, settled=${field.settledNodes}`);
    expect(field.solveMs).toBeLessThan(20000);
    expect(Number.isFinite(sampleTimeAt(field, 9, 9, 0))).toBe(true);
  }, 60000);
});
