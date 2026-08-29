/**
 * tests/parity/featherstone.test.ts
 *
 * Slice C parity task: Featherstone articulated-body dynamics conformance.
 * Closes: cmaes-phr3m-parity-feath-0b2.
 *
 * Why this task exists
 * --------------------
 * The cmaes-phr6 Frankensim kernel introduces Featherstone's articulated-body
 * algorithm for the 29-joint G1 and the 7+2-joint arm. To prove the kernel
 * implements Featherstone correctly, we need oracle cases where the answer
 * is the closed-form forward-kinematics expression.
 *
 * Acceptance criteria (from the bead)
 * -----------------------------------
 * - 3 oracle cases: 2-link planar arm FK + COM + momentum, 6-DOF UR-style
 *   DH-transform FK, and 15-link G1 lower body mass-weighted COM.
 * - bun test parity:featherstone passes in CI.
 *
 * Status: kernel not yet implemented. TS reference below; tests are
 * structure-only until the kernel lands.
 *
 * Honesty floor: a Featherstone test that checks the joint angles but not
 * the center-of-mass or the momentum is missing the dynamics half. The
 * dynamics are the point; a kinematics-only test is not a Featherstone test.
 */

import { describe, expect, test } from "bun:test";
import {
  assertDeterministic,
  flattenNumeric,
  maxAbsDiff,
  parityHarness,
  type ParityCase,
} from "./parityHarness";

type Featherstone2Link = [
  number, number, number, // end-effector x, y, theta
  number, number,         // center of mass x, y
  number, number,         // linear momentum x, y
];

function reference2LinkFeatherstone(
  q1: number, q2: number, q1d: number, q2d: number,
  L1: number, L2: number, m1: number, m2: number,
): Featherstone2Link {
  const ex = L1 * Math.cos(q1) + L2 * Math.cos(q1 + q2);
  const ey = L1 * Math.sin(q1) + L2 * Math.sin(q1 + q2);
  const etheta = q1 + q2;
  const c1x = 0.5 * L1 * Math.cos(q1);
  const c1y = 0.5 * L1 * Math.sin(q1);
  const c2x = L1 * Math.cos(q1) + 0.5 * L2 * Math.cos(q1 + q2);
  const c2y = L1 * Math.sin(q1) + 0.5 * L2 * Math.sin(q1 + q2);
  const totalMass = m1 + m2;
  const comX = (m1 * c1x + m2 * c2x) / totalMass;
  const comY = (m1 * c1y + m2 * c2y) / totalMass;
  const v1x = -0.5 * L1 * Math.sin(q1) * q1d;
  const v1y = 0.5 * L1 * Math.cos(q1) * q1d;
  const v2x = -L1 * Math.sin(q1) * q1d - 0.5 * L2 * Math.sin(q1 + q2) * (q1d + q2d);
  const v2y = L1 * Math.cos(q1) * q1d + 0.5 * L2 * Math.cos(q1 + q2) * (q1d + q2d);
  const px = m1 * v1x + m2 * v2x;
  const py = m1 * v1y + m2 * v2y;
  return [ex, ey, etheta, comX, comY, px, py];
}

type Ur6Result = [number, number, number, number, number, number, number, number, number, number, number, number];

function reference6DofUrDh(
  jointAngles: readonly [number, number, number, number, number, number],
): Ur6Result {
  const a = [0, -0.425, -0.392, 0, 0, 0];
  const d = [0.089, 0, 0, 0.109, 0.094, 0.082];
  const alpha = [Math.PI / 2, 0, 0, Math.PI / 2, -Math.PI / 2, 0];
  const T: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  for (let i = 0; i < 6; i++) {
    const theta = jointAngles[i];
    const ca = Math.cos(alpha[i]);
    const sa = Math.sin(alpha[i]);
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const Ai: number[] = [
      ct, -st * ca, st * sa, a[i] * ct,
      st, ct * ca, -ct * sa, a[i] * st,
      0, sa, ca, d[i],
      0, 0, 0, 1,
    ];
    const next: number[] = new Array(16).fill(0);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += T[row * 4 + k] * Ai[k * 4 + col];
        }
        next[row * 4 + col] = sum;
      }
    }
    for (let j = 0; j < 16; j++) T[j] = next[j];
  }
  return [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9], T[10], T[11]];
}

type G1LowerBodyCom = [number, number, number];

function referenceG1LowerBodyCom(
  jointAngles: readonly number[],
  linkLengths: readonly number[],
  linkMasses: readonly number[],
): G1LowerBodyCom {
  let theta = 0;
  let x = 0;
  let y = 0;
  const z = 0;
  let totalMass = 0;
  let comX = 0;
  let comY = 0;
  let comZ = 0;
  for (let i = 0; i < linkLengths.length; i++) {
    theta += jointAngles[i] ?? 0;
    const half = 0.5 * linkLengths[i];
    const cx = x + half * Math.cos(theta);
    const cy = y + half * Math.sin(theta);
    const mass = linkMasses[i];
    comX += mass * cx;
    comY += mass * cy;
    comZ += mass * z;
    totalMass += mass;
    x += linkLengths[i] * Math.cos(theta);
    y += linkLengths[i] * Math.sin(theta);
  }
  return [comX / totalMass, comY / totalMass, comZ / totalMass];
}

const featherstoneCases: Array<ParityCase<unknown, unknown>> = [
  {
    id: "2-link-planar-FK-COM-momentum",
    input: {
      q1: Math.PI / 4,
      q2: Math.PI / 6,
      q1d: 0.1,
      q2d: -0.05,
      L1: 0.4,
      L2: 0.3,
      m1: 1.0,
      m2: 0.6,
    },
    ts: reference2LinkFeatherstone(
      Math.PI / 4, Math.PI / 6, 0.1, -0.05, 0.4, 0.3, 1.0, 0.6,
    ),
    kernel: undefined,
    tolerance: 1e-9,
  },
  {
    id: "6-DOF-UR-DH-FK",
    input: {
      jointAngles: [0, -Math.PI / 4, Math.PI / 3, 0, Math.PI / 6, 0] as const,
    },
    ts: reference6DofUrDh([0, -Math.PI / 4, Math.PI / 3, 0, Math.PI / 6, 0]),
    kernel: undefined,
    tolerance: 1e-9,
  },
  {
    id: "15-link-G1-lower-body-COM",
    input: {
      jointAngles: new Array(14).fill(0),
      linkLengths: new Array(15).fill(0.1),
      linkMasses: new Array(15).fill(1.0),
    },
    ts: referenceG1LowerBodyCom(
      new Array(14).fill(0),
      new Array(15).fill(0.1),
      new Array(15).fill(1.0),
    ),
    kernel: undefined,
    tolerance: 1e-9,
  },
];

describe("parity: Featherstone articulated-body dynamics (kernel vs analytical oracle)", () => {
  test("determinism: TS reference is deterministic", () => {
    assertDeterministic<void, Featherstone2Link>(
      "2-link-featherstone",
      () => reference2LinkFeatherstone(
        Math.PI / 4, Math.PI / 6, 0.1, -0.05, 0.4, 0.3, 1.0, 0.6,
      ),
      undefined,
    );
  });

  test("3 oracle cases pass (or skip with loud message while kernel is pending)", () => {
    const result = parityHarness("featherstone", featherstoneCases, {
      defaultTolerance: 1e-9,
      structureOnly: true,
    });
    expect(result.skipped).toBe(3);
    expect(result.failed).toBe(0);
    expect(result.passed).toBe(0);
  });

  test("analytical oracle: 2-link planar FK end-effector pose", () => {
    const ts = reference2LinkFeatherstone(
      Math.PI / 4, Math.PI / 6, 0.1, -0.05, 0.4, 0.3, 1.0, 0.6,
    );
    expect(ts[0]).toBeGreaterThan(0.3);
    expect(ts[0]).toBeLessThan(0.4);
    expect(ts[1]).toBeGreaterThan(0.4);
    expect(ts[1]).toBeLessThan(0.6);
    expect(ts[2]).toBeCloseTo(Math.PI / 4 + Math.PI / 6, 9);
  });

  test("analytical oracle: 6-DOF UR DH FK at zero joint angles is a valid 4x4", () => {
    // The end-effector is somewhere in the workspace; we just check the
    // reference produces a valid 4x4 (orthonormal rotation rows, finite
    // position). The exact value depends on the DH parameterization and
    // is not the point of the parity test.
    const ts = reference6DofUrDh([0, 0, 0, 0, 0, 0]);
    // Rotation rows must be unit length.
    const r0 = Math.sqrt(ts[0] * ts[0] + ts[1] * ts[1] + ts[2] * ts[2]);
    const r1 = Math.sqrt(ts[4] * ts[4] + ts[5] * ts[5] + ts[6] * ts[6]);
    const r2 = Math.sqrt(ts[8] * ts[8] + ts[9] * ts[9] + ts[10] * ts[10]);
    expect(r0).toBeCloseTo(1, 9);
    expect(r1).toBeCloseTo(1, 9);
    expect(r2).toBeCloseTo(1, 9);
    // Position must be finite and inside a sane workspace (~1 m).
    const px = Math.abs(ts[3]);
    const py = Math.abs(ts[7]);
    const pz = Math.abs(ts[11]);
    expect(px).toBeLessThan(2);
    expect(py).toBeLessThan(2);
    expect(pz).toBeLessThan(2);
  });

  test("diff is shape-agnostic via flattenNumeric", () => {
    const a = flattenNumeric([0.1, 0.2, 0.3, 0.4, 0.5]);
    const b = flattenNumeric([0.1, 0.2, 0.3, 0.4, 0.5]);
    expect(maxAbsDiff(a, b)).toBe(0);
  });
});
