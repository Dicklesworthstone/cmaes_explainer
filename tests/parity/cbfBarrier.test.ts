/**
 * tests/parity/cbfBarrier.test.ts
 *
 * Slice C parity task: CBF safety-barrier gradient conformance.
 * Kernel conformance remains open: cmaes-phr3m-parity-cbf-gn2.
 *
 * Why this task exists
 * --------------------
 * The cmaes-phr1 obstacle-avoidance objective introduces a CBF safety barrier
 * function. The CBF gradient is C^1-smooth and the per-step update is a sub-ms
 * QP solve. To prove the kernel computes the correct barrier, we need an oracle
 * case where the barrier value AND its gradient are analytically known.
 *
 * Acceptance criteria (from the bead)
 * -----------------------------------
 * - 3 oracle cases pass: point-vs-circle, 7-DOF arm vs sphere, dynamic obstacle.
 * - The test prints: kernel answer, oracle answer, max abs diff, within-tolerance.
 * - bun test parity:cbf passes in CI.
 *
 * Status: kernel not yet implemented. The TS reference for each case is below;
 * the missing-answer tests prove refusal only, not CBF kernel conformance.
 *
 * Honesty floor: a CBF test that checks the barrier value but not the gradient
 * is half a test. The barrier's job is to be DIFFERENTIABLE so the controller
 * can use the gradient; a test that ignores the gradient is missing the point.
 */

import { describe, expect, test } from "bun:test";
import {
  assertDeterministic,
  flattenNumeric,
  maxAbsDiff,
  parityHarness,
  type ParityCase,
} from "./parityHarness";

/* ------------------------------------------------------------------ */
/*  TS reference: CBF barrier + gradient, three cases.               */
/* ------------------------------------------------------------------ */

/** Result: [barrierValue, gradX, gradY] (3 numbers for the 2-D case). */
type Barrier2D = [number, number, number];

function referencePointCircleCbf(
  point: readonly [number, number],
  circleCenter: readonly [number, number],
  circleRadius: number,
  safetyMargin: number,
): Barrier2D {
  const dx = point[0] - circleCenter[0];
  const dy = point[1] - circleCenter[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  const dSafe = circleRadius + safetyMargin;
  const slack = distance - dSafe;
  if (slack >= 0) return [0, 0, 0];
  const value = 0.5 * slack * slack;
  const gradX = (slack * dx) / distance;
  const gradY = (slack * dy) / distance;
  return [value, gradX, gradY];
}

/**
 * 4-DOF planar arm (simplified 7-DOF for the oracle): end-effector position
 * is the cumulative FK; barrier is the squared distance to a sphere.
 * Returns barrier + 4 gradients w.r.t. joint angles (FD for clarity).
 */
type Arm4Barrier = [number, number, number, number, number];

function reference4DofArmSphereCbf(
  jointAngles: readonly [number, number, number, number],
  linkLengths: readonly [number, number, number, number],
  sphereCenter: readonly [number, number],
  sphereRadius: number,
  safetyMargin: number,
): Arm4Barrier {
  const px = armEndEffectorX(jointAngles, linkLengths);
  const py = armEndEffectorY(jointAngles, linkLengths);
  const dx = px - sphereCenter[0];
  const dy = py - sphereCenter[1];
  const d2 = dx * dx + dy * dy;
  const dSafe = sphereRadius + safetyMargin;
  const safe2 = dSafe * dSafe;
  const slack = d2 - safe2;
  if (slack >= 0) return [0, 0, 0, 0, 0];
  const value = 0.5 * slack * slack;
  const grads: number[] = [0, 0, 0, 0];
  const h = 1e-6;
  for (let i = 0; i < 4; i++) {
    const qPlus = [...jointAngles] as [number, number, number, number];
    const qMinus = [...jointAngles] as [number, number, number, number];
    qPlus[i] = jointAngles[i] + h;
    qMinus[i] = jointAngles[i] - h;
    const fx = (armEndEffectorX(qPlus, linkLengths) - armEndEffectorX(qMinus, linkLengths)) / (2 * h);
    const fy = (armEndEffectorY(qPlus, linkLengths) - armEndEffectorY(qMinus, linkLengths)) / (2 * h);
    grads[i] = slack * 2 * (dx * fx + dy * fy);
  }
  return [value, grads[0], grads[1], grads[2], grads[3]];
}

function armEndEffectorX(
  jointAngles: readonly [number, number, number, number],
  linkLengths: readonly [number, number, number, number],
): number {
  let theta = 0;
  let px = 0;
  for (let j = 0; j < 4; j++) {
    theta += jointAngles[j];
    px += linkLengths[j] * Math.cos(theta);
  }
  return px;
}

function armEndEffectorY(
  jointAngles: readonly [number, number, number, number],
  linkLengths: readonly [number, number, number, number],
): number {
  let theta = 0;
  let py = 0;
  for (let j = 0; j < 4; j++) {
    theta += jointAngles[j];
    py += linkLengths[j] * Math.sin(theta);
  }
  return py;
}

function referenceDynamicObstacleCbf(
  point: readonly [number, number],
  initialCenter: readonly [number, number],
  velocity: readonly [number, number],
  circleRadius: number,
  safetyMargin: number,
): Barrier2D[] {
  const out: Barrier2D[] = [];
  for (const t of [0, 0.5, 1]) {
    const centerAtT: [number, number] = [
      initialCenter[0] + velocity[0] * t,
      initialCenter[1] + velocity[1] * t,
    ];
    out.push(referencePointCircleCbf(point, centerAtT, circleRadius, safetyMargin));
  }
  return out;
}

const cbfCases: Array<ParityCase<unknown, unknown>> = [
  {
    id: "point-vs-circle-CBF",
    input: {
      point: [1.5, 0] as const,
      circleCenter: [0, 0] as const,
      circleRadius: 0.5,
      safetyMargin: 0.2,
    },
    ts: referencePointCircleCbf([1.5, 0], [0, 0], 0.5, 0.2),
    kernel: undefined,
    tolerance: 1e-9,
  },
  {
    id: "4-DOF-arm-vs-sphere-CBF",
    input: {
      jointAngles: [0, 0, 0, 0] as const,
      linkLengths: [0.3, 0.3, 0.2, 0.1] as const,
      sphereCenter: [0.5, 0] as const,
      sphereRadius: 0.1,
      safetyMargin: 0.05,
    },
    ts: reference4DofArmSphereCbf(
      [0, 0, 0, 0],
      [0.3, 0.3, 0.2, 0.1],
      [0.5, 0],
      0.1,
      0.05,
    ),
    kernel: undefined,
    tolerance: 1e-6,
  },
  {
    id: "dynamic-obstacle-CBF-3-timesteps",
    input: {
      point: [1.0, 0.5] as const,
      initialCenter: [0, 0] as const,
      velocity: [-0.5, 0.2] as const,
      circleRadius: 0.3,
      safetyMargin: 0.1,
    },
    ts: referenceDynamicObstacleCbf([1.0, 0.5], [0, 0], [-0.5, 0.2], 0.3, 0.1),
    kernel: undefined,
    tolerance: 1e-9,
  },
];

describe("parity: CBF safety-barrier gradient (kernel vs analytical oracle)", () => {
  test("determinism: TS reference is deterministic", () => {
    const point: [number, number] = [1.5, 0];
    const center: [number, number] = [0, 0];
    assertDeterministic<void, Barrier2D>(
      "point-vs-circle-CBF",
      () => referencePointCircleCbf(point, center, 0.5, 0.2),
      undefined,
    );
  });

  test("missing CBF kernel answers cannot certify conformance", () => {
    for (const testCase of cbfCases) {
      expect(() => parityHarness("cbf-barrier", [testCase])).toThrow("missing required kernel answer");
    }
  });

  test("analytical oracle: point-vs-circle CBF value AND gradient", () => {
    const ts = referencePointCircleCbf([1.5, 0], [0, 0], 0.5, 0.2);
    expect(ts[0]).toBe(0);
    expect(ts[1]).toBe(0);
    expect(ts[2]).toBe(0);

    // Point at (0.5, 0): distance = 0.5, slack = -0.2.
    // barrier = 0.5 * (-0.2)^2 = 0.02. gradient = -0.2 * (0.5, 0) / 0.5 = (-0.2, 0).
    const ts2 = referencePointCircleCbf([0.5, 0], [0, 0], 0.5, 0.2);
    expect(ts2[0]).toBeCloseTo(0.02, 9);
    expect(ts2[1]).toBeCloseTo(-0.2, 9);
    expect(ts2[2]).toBeCloseTo(0, 9);
  });

  test("analytical oracle: 4-DOF arm vs sphere (joints at zero)", () => {
    // All joints at 0: end-effector at (0.9, 0). Sphere at (0.5, 0), r=0.1, m=0.05.
    // d_safe = 0.15. d2 = 0.16. slack = 0.1375 > 0. Barrier = 0.
    const ts = reference4DofArmSphereCbf(
      [0, 0, 0, 0],
      [0.3, 0.3, 0.2, 0.1],
      [0.5, 0],
      0.1,
      0.05,
    );
    expect(ts[0]).toBe(0);
    for (let i = 1; i < 5; i++) expect(ts[i]).toBe(0);
  });

  test("diff is shape-agnostic via flattenNumeric", () => {
    const a = flattenNumeric([0.5, 0.2, -0.1]);
    const b = flattenNumeric([0.5, 0.2, -0.1]);
    expect(maxAbsDiff(a, b)).toBe(0);
  });
});
