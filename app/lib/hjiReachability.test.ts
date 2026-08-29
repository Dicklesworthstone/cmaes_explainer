/**
 * Tests for cmaes-ndl8 (HJ reachability BRT static safety check).
 *
 * Acceptance (from the bead): empty-room time ~ Euclidean/vMax (bounded by
 * the documented conservative L1 factor); wall shadow unreachable with a
 * finite doorway path; heading matters (along-corridor beats into-wall);
 * bit-exact determinism; house-scale grid perf; input validation.
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
  omegaMax: 50,
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

  test("time grows with distance and stays within the conservative band", () => {
    // Sampled points at 2m and 4m from the target center. The solver's
    // Hamiltonian bounds |gradV.d| <= |cos||Vx| + |sin||Vy| (Cauchy-Schwarz),
    // so V >= Euclid/vMax and is bounded by the union-of-diamonds speed set
    // (worst case sqrt(2) * Euclid/vMax plus grid slack).
    for (const dist of [2, 4]) {
      const t = sampleTimeAt(field, 5 + dist, 5, 0);
      expect(Number.isFinite(t)).toBe(true);
      expect(t).toBeGreaterThanOrEqual(dist - 0.35); // grid slack, not slower than physics
      expect(t).toBeLessThanOrEqual(1.7 * dist + 0.5);
    }
    const tNear = sampleTimeAt(field, 6, 5, 0);
    const tFar = sampleTimeAt(field, 8, 5, 0);
    expect(tFar).toBeGreaterThan(tNear);
  });

  test("heading wrap-around samples the same bin", () => {
    const a = sampleTimeAt(field, 7, 5, 0.13);
    const b = sampleTimeAt(field, 7, 5, 0.13 + Math.PI * 2);
    expect(a).toBe(b);
  });
});

describe("BRT wall with doorway", () => {
  // Vertical wall at x=5 split into two segments leaving a 0.5m doorway at
  // y in (4.2, 4.7). Target on the far (east) side, straight line of sight
  // from the west side is blocked everywhere except through the doorway.
  const walls: OBB2D[] = [
    { center: [5, 2.2], halfExtents: [0.15, 2.0], yaw: 0 },
    { center: [5, 6.25], halfExtents: [0.15, 1.3], yaw: 0 },
  ];
  const sdf = makeOBBUnionSDF(walls);
  const params: BRTParams = { ...EMPTY_ROOM, bodyRadius: 0.3 };
  const field = solveBackwardReachableTube(sdf, { center: [8, 4.45], radius: 0.3 }, params);

  test("doorway path is finite and monotone", () => {
    const t1 = sampleTimeAt(field, 4.4, 4.45, 0);
    const t2 = sampleTimeAt(field, 3.2, 4.45, 0);
    expect(Number.isFinite(t1)).toBe(true);
    expect(Number.isFinite(t2)).toBe(true);
    expect(t2).toBeGreaterThan(t1);
  });

  test("cell inside the wall body is unreachable at every heading", () => {
    for (let k = 0; k < field.nTheta; k += 7) {
      expect(sampleTimeAt(field, 5, 6.25, k * field.dTheta)).toBe(Number.POSITIVE_INFINITY);
    }
  });

  test("start directly behind the wall must route around (slower than open space)", () => {
    const viaDoorway = sampleTimeAt(field, 4.4, 4.45, 0);
    // Same Manhattan distance in the empty room for comparison.
    const openField = solveBackwardReachableTube(
      makeOBBUnionSDF([]),
      { center: [8, 4.45], radius: 0.3 },
      params,
    );
    const open = sampleTimeAt(openField, 4.4, 4.45, 0);
    expect(viaDoorway).toBeGreaterThan(open * 1.3);
  });

  test("isSafeStart gates unreachable starts", () => {
    expect(isSafeStart(field, 4.4, 4.45, 0)).toBe(true);
    expect(isSafeStart(field, 5, 6.25, 0)).toBe(false);
    expect(isSafeStart(field, 99, 99, 0)).toBe(false); // out of domain
  });
});

describe("BRT heading dependence", () => {
  // Corridor open along y; wall blocks +x ahead of the start pose.
  const sdf = makeOBBUnionSDF([{ center: [6, 4], halfExtents: [0.15, 4], yaw: 0 }]);
  const params: BRTParams = { ...EMPTY_ROOM, bodyRadius: 0.3 };
  const field = solveBackwardReachableTube(sdf, { center: [3, 8], radius: 0.3 }, params);

  test("heading along the free corridor reaches faster than heading into the wall", () => {
    const alongY = sampleTimeAt(field, 4, 4, Math.PI / 2); // facing +y (toward goal side)
    const intoWall = sampleTimeAt(field, 4, 4, 0); // facing +x (the wall)
    expect(Number.isFinite(alongY)).toBe(true);
    expect(Number.isFinite(intoWall)).toBe(true);
    expect(alongY).toBeLessThan(intoWall);
  });
});

describe("BRT determinism and validation", () => {
  test("identical inputs produce bit-identical fields", () => {
    const sdf = makeOBBUnionSDF([{ center: [4, 5], halfExtents: [0.5, 0.5], yaw: 0.3 }]);
    const a = solveBackwardReachableTube(sdf, { center: [8, 8], radius: 0.4 }, EMPTY_ROOM);
    const b = solveBackwardReachableTube(sdf, { center: [8, 8], radius: 0.4 }, EMPTY_ROOM);
    expect(a.sweeps).toBe(b.sweeps);
    expect(a.time.length).toBe(b.time.length);
    let identical = true;
    for (let i = 0; i < a.time.length; i++) {
      if (a.time[i] !== b.time[i]) {
        identical = false;
        break;
      }
    }
    expect(identical).toBe(true);
  });

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
      epsilon: 1e-3,
      maxSweeps: 40,
    };
    const field = solveBackwardReachableTube(sdf, { center: [1, 1], radius: 0.3 }, params);
    // Logged for the perf receipt; generous bound avoids CI flake.
    console.log(`[hjiReachability] 200x200x72 solve: ${field.solveMs.toFixed(0)}ms, sweeps=${field.sweeps}, finalDelta=${field.finalDelta.toExponential(2)}`);
    expect(field.solveMs).toBeLessThan(20000);
    // Sanity: the goal corner is finite, deep behind the walls from (1,1).
    expect(Number.isFinite(sampleTimeAt(field, 9, 9, 0))).toBe(true);
  });
});
