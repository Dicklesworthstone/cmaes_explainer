// TS-side analytical-oracle parity for the CCD parity cases.
// Kernel-side CCD-on-SDF owners are not yet implemented (cmaes-qfmt); the
// existing tests/parity/ccdSdf.test.ts rejects missing kernel results.
// This file is the TS-side companion: it asserts the
// TypeScript engine matches closed-form analytical oracles for the same
// input vectors, so the TS half of the parity claim is machine-checked now
// and the kernel work (frankensim fs-contact increment + fs-cmaes-viz-wasm
// ABI exposure) ships against a verified TS reference.

import { describe, expect, test } from "bun:test";
import { queryContinuousCollisionSDF } from "../../app/lib/continuousCollisionDetection";
import {
  computeMechanicalEnergy,
  forwardDynamicsABA,
  inverseDynamicsRNEA,
  type MultibodyTree,
} from "../../app/lib/featherstoneDynamics";
import { SafetyFilterRecoveryManager } from "../../app/lib/safetyFilterRecovery";
import { assertDeterministic, flattenNumeric, maxAbsDiff, parityHarness } from "./parityHarness";

describe("parity comparison integrity", () => {
  function compare(ts: unknown, kernel: unknown, oracle?: unknown) {
    return parityHarness("regression", [
      {
        id: "structured-output",
        input: null,
        ts,
        kernel,
        ...(oracle === undefined ? {} : { oracle }),
      },
    ]);
  }

  test("compares nested objects and typed arrays with exact metadata and keys", () => {
    const result = compare(
      { qDDot: new Float64Array([1, 2]), pose: { x: 3, valid: true }, contact: null },
      { contact: null, pose: { valid: true, x: 3 }, qDDot: new Float64Array([1, 2]) },
      { qDDot: new Float64Array([1, 2]), pose: { x: 3, valid: true }, contact: null },
    );
    expect(result.passed).toBe(1);
    expect(result.skipped).toBe(0);
    expect(result.cases[0].comparedScalars).toBe(3);
    expect(flattenNumeric({ a: new Float64Array([1, 2]), b: { c: 3 } })).toEqual([1, 2, 3]);
  });

  test("rejects previously invisible dynamics, nonfinite and empty outputs", () => {
    expect(() => compare({ qDDot: [1] }, { qDDot: [99] })).toThrow('$["qDDot"][0]');
    for (const value of [NaN, Infinity, -Infinity]) {
      expect(() => compare([value], [value])).toThrow("nonfinite");
    }
    for (const value of [[], {}, { status: "ok" }]) {
      expect(() => compare(value, value)).toThrow("zero numeric values");
    }
    expect(() => maxAbsDiff(undefined, [1])).toThrow();
    expect(() => maxAbsDiff([], [])).toThrow();
    expect(() => flattenNumeric([NaN])).toThrow();
  });

  test("rejects different shapes even when flattened numbers agree", () => {
    for (const [a, b] of [
      [
        [1, [2]],
        [1, 2],
      ],
      [{ a: 1 }, { b: 1 }],
      [new Float64Array([1]), new Float32Array([1])],
      [[1], new Float64Array([1])],
      [
        { n: 1, ok: true },
        { n: 1, ok: false },
      ],
      [{ n: 1 }, { n: 1, missing: undefined }],
    ])
      expect(() => compare(a, b)).toThrow();
  });

  test("checks both answers against the supplied analytical oracle", () => {
    expect(() => compare({ value: 7 }, { value: 7 }, { value: 8 })).toThrow("numeric mismatch");
    expect(compare({ value: 8 }, { value: 8 }, { value: 8 }).passed).toBe(1);
    expect(() =>
      parityHarness("oracle", [
        { id: "missing", input: null, ts: 1, kernel: 1, oracle: undefined },
      ]),
    ).toThrow("missing value");
  });

  test("validates tolerances, rejects no-case passes, and bounds relative error", () => {
    for (const tolerance of [-1, NaN, Infinity]) {
      expect(() =>
        parityHarness("invalid", [{ id: "one", input: 0, ts: 1, kernel: 1, tolerance }]),
      ).toThrow("tolerance");
    }
    expect(() => parityHarness("empty", [])).toThrow("no cases");
    expect(
      parityHarness("relative", [
        { id: "large", input: 0, ts: 1e10, kernel: 1e10 + 1, relativeTolerance: 1e-9 },
      ]).passed,
    ).toBe(1);
    expect(() =>
      parityHarness("overflow", [
        {
          id: "opposite",
          input: 0,
          ts: Number.MAX_VALUE,
          kernel: -Number.MAX_VALUE,
          relativeTolerance: 1,
        },
      ]),
    ).toThrow("numeric mismatch");
  });

  test("rejects cyclic and unsupported outputs instead of comparing nothing", () => {
    const cyclic: { n: number; self?: unknown } = { n: 1 };
    cyclic.self = cyclic;
    expect(() => compare(cyclic, cyclic)).toThrow("cyclic");
    expect(() => compare(new Map([["n", 1]]), new Map([["n", 1]]))).toThrow("unsupported");
    expect(() =>
      compare(
        {
          get n() {
            return 1;
          },
        },
        { n: 1 },
      ),
    ).toThrow("accessor");
  });

  test("determinism isolates mutable inputs and snapshots reused result buffers", () => {
    const input = { value: 0 };
    assertDeterministic("input", (x) => ({ value: ++x.value }), input);
    expect(input.value).toBe(0);
    const output = { value: 0 };
    expect(() =>
      assertDeterministic(
        "shared",
        () => {
          output.value++;
          return output;
        },
        null,
      ),
    ).toThrow("numeric mismatch");
    expect(() => assertDeterministic("empty", () => [], null)).toThrow("zero numeric");
    expect(() => assertDeterministic("one-trial", () => 1, null, 1)).toThrow("two trials");
  });
});

function analyticSphereSphereToi(
  start: [number, number, number],
  end: [number, number, number],
  rStart: number,
  stationaryCenter: [number, number, number],
  rStationary: number,
): number {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const sweptLen = Math.hypot(dx, dy, dz);
  if (sweptLen < 1e-9) return -1;
  const initDist = Math.hypot(
    start[0] - stationaryCenter[0],
    start[1] - stationaryCenter[1],
    start[2] - stationaryCenter[2],
  );
  const touchDist = rStart + rStationary;
  const remaining = initDist - touchDist;
  if (remaining <= 0) return 0;
  return remaining / sweptLen;
}
describe("TS CCD-on-SDF: sphere-sphere analytical oracle", () => {
  test("sweeping sphere toward stationary sphere reports TOI within 1e-3 of the closed-form oracle", () => {
    const stationaryCenter: [number, number, number] = [0.5, 0, 0];
    const rStationary = 0.25;
    const rStart = 0.1;
    const start: [number, number, number] = [0, 0, 0];
    const end: [number, number, number] = [1, 0, 0];
    const sdf = (pos: [number, number, number]) => {
      const d = Math.hypot(pos[0] - 0.5, pos[1], pos[2]) - rStationary;
      const g: [number, number, number] = [1, 0, 0];
      return { distance: d, gradient: g };
    };
    const expectedToi = analyticSphereSphereToi(start, end, rStart, stationaryCenter, rStationary);
    const result = queryContinuousCollisionSDF(
      { startPosition: start, endPosition: end, radius: rStart, tolerance: 1e-5 },
      sdf,
    );
    expect(expectedToi).toBeGreaterThan(0);
    expect(result.hasImpact).toBe(true);
    expect(result.timeOfImpact).toBeGreaterThan(0);
    expect(Math.abs((result.timeOfImpact ?? 0) - expectedToi)).toBeLessThan(1e-3);
  });

  test("non-collision sweep: sphere passes well clear of the stationary sphere", () => {
    const sdf = (pos: [number, number, number]) => {
      const d = Math.hypot(pos[0] - 10, pos[1] - 10, pos[2] - 10) - 0.25;
      const g: [number, number, number] = [1, 0, 0];
      return { distance: d, gradient: g };
    };
    const result = queryContinuousCollisionSDF(
      { startPosition: [0, 0, 0], endPosition: [1, 0, 0], radius: 0.1, tolerance: 1e-5 },
      sdf,
    );
    expect(result.hasImpact).toBe(false);
  });

  test("already-overlapping start position reports immediate impact (TOI ~= 0)", () => {
    const sdf = (pos: [number, number, number]) => {
      const d = Math.hypot(pos[0], pos[1], pos[2]) - 0.5;
      const g: [number, number, number] = [1, 0, 0];
      return { distance: d, gradient: g };
    };
    const result = queryContinuousCollisionSDF(
      { startPosition: [0, 0, 0], endPosition: [1, 0, 0], radius: 0.5, tolerance: 1e-5 },
      sdf,
    );
    expect(result.hasImpact).toBe(true);
    expect(result.timeOfImpact).toBeLessThan(0.05);
  });
});

describe("TS Featherstone ABA/RNEA: closed-form analytical oracle", () => {
  test("matches closed-form Euler-Lagrange equations for revolute (standard & diagonal axis) and prismatic joints", () => {
    const m = 2.4;
    const L = 0.65;
    const Irot = 0.12;
    const b = 0.15;
    const g = 9.81;

    // 1. Planar revolute pendulum around +Y
    const revTree: MultibodyTree = {
      name: "oracle-revolute-y",
      gravity: [0, 0, -g],
      links: [
        {
          id: "rev_y",
          name: "Revolute Y",
          parentIndex: -1,
          jointType: "revolute",
          jointAxis: [0, 1, 0],
          parentTransform: { rotation: [0, 0, 0], translation: [0, 0, 0] },
          mass: m,
          centerOfMass: [0, 0, -L],
          inertiaPrincipal: [Irot, Irot, Irot],
          damping: b,
        },
      ],
    };

    // 2. Diagonal-axis revolute pendulum around u = [1/sqrt(2), 1/sqrt(2), 0]
    const invSqrt2 = 1 / Math.SQRT2;
    const diagTree: MultibodyTree = {
      name: "oracle-revolute-diagonal",
      gravity: [0, 0, -g],
      links: [
        {
          id: "rev_diag",
          name: "Revolute Diagonal",
          parentIndex: -1,
          jointType: "revolute",
          jointAxis: [invSqrt2, invSqrt2, 0],
          parentTransform: { rotation: [0, 0, 0], translation: [0, 0, 0] },
          mass: m,
          centerOfMass: [0, 0, -L],
          inertiaPrincipal: [Irot, Irot, Irot],
          damping: b,
        },
      ],
    };

    // 3. Vertical prismatic mass along +Z
    const prisTree: MultibodyTree = {
      name: "oracle-prismatic-z",
      gravity: [0, 0, -g],
      links: [
        {
          id: "pris_z",
          name: "Prismatic Z",
          parentIndex: -1,
          jointType: "prismatic",
          jointAxis: [0, 0, 1],
          parentTransform: { rotation: [0, 0, 0], translation: [0, 0, 0.2] },
          mass: m,
          centerOfMass: [0, 0, 0.1],
          inertiaPrincipal: [Irot, Irot, Irot],
          damping: b,
        },
      ],
    };

    const q = 0.55;
    const qDot = -0.8;
    const tau = 1.75;
    const IO = Irot + m * L * L;
    const qDDotRevOracle = (tau - b * qDot - m * g * L * Math.sin(q)) / IO;
    const energyRevOracle = {
      kineticEnergy: 0.5 * IO * qDot * qDot,
      potentialEnergy: m * g * (-L * Math.cos(q)),
      totalEnergy: 0.5 * IO * qDot * qDot + m * g * (-L * Math.cos(q)),
    };

    const qDDotPrisOracle = (tau - b * qDot - m * g) / m;
    const energyPrisOracle = {
      kineticEnergy: 0.5 * m * qDot * qDot,
      potentialEnergy: m * g * (0.2 + q + 0.1),
      totalEnergy: 0.5 * m * qDot * qDot + m * g * (0.2 + q + 0.1),
    };

    const abaRev = forwardDynamicsABA(revTree, [q], [qDot], [tau]);
    const rneaRev = inverseDynamicsRNEA(revTree, [q], [qDot], [qDDotRevOracle]);
    const energyRev = computeMechanicalEnergy(revTree, [q], [qDot]);

    const abaDiag = forwardDynamicsABA(diagTree, [q], [qDot], [tau]);
    const rneaDiag = inverseDynamicsRNEA(diagTree, [q], [qDot], [qDDotRevOracle]);
    const energyDiag = computeMechanicalEnergy(diagTree, [q], [qDot]);

    const abaPris = forwardDynamicsABA(prisTree, [q], [qDot], [tau]);
    const rneaPris = inverseDynamicsRNEA(prisTree, [q], [qDot], [qDDotPrisOracle]);
    const energyPris = computeMechanicalEnergy(prisTree, [q], [qDot]);

    const report = parityHarness("featherstone-analytical-oracle", [
      {
        id: "revolute-y-aba-rnea-energy",
        input: { q, qDot, tau },
        ts: { qDDot: abaRev.qDDot[0], tau: rneaRev[0], energy: energyRev },
        kernel: { qDDot: qDDotRevOracle, tau, energy: energyRevOracle },
        oracle: { qDDot: qDDotRevOracle, tau, energy: energyRevOracle },
        tolerance: 1e-9,
      },
      {
        id: "revolute-diagonal-aba-rnea-energy",
        input: { q, qDot, tau },
        ts: { qDDot: abaDiag.qDDot[0], tau: rneaDiag[0], energy: energyDiag },
        kernel: { qDDot: qDDotRevOracle, tau, energy: energyRevOracle },
        oracle: { qDDot: qDDotRevOracle, tau, energy: energyRevOracle },
        tolerance: 1e-9,
      },
      {
        id: "prismatic-z-aba-rnea-energy",
        input: { q, qDot, tau },
        ts: { qDDot: abaPris.qDDot[0], tau: rneaPris[0], energy: energyPris },
        kernel: { qDDot: qDDotPrisOracle, tau, energy: energyPrisOracle },
        oracle: { qDDot: qDDotPrisOracle, tau, energy: energyPrisOracle },
        tolerance: 1e-9,
      },
    ]);

    expect(report.passed).toBe(3);
    assertDeterministic(
      "featherstone-aba",
      (inp) => forwardDynamicsABA(diagTree, inp.q, inp.qDot, inp.tau),
      { q: [q], qDot: [qDot], tau: [tau] },
    );
  });
});

describe("TS CBF SafetyFilterRecoveryManager: closed-form KKT & reflex oracle", () => {
  test("matches closed-form half-space KKT projection and Tier-2 emergency reflex repulsion", () => {
    const manager = new SafetyFilterRecoveryManager({
      maxSlack: 0.25,
      brakeGain: 2.5,
      repelGain: 1.2,
      stallLimitFrames: 3,
    });

    // 1. Tier 1: Single active barrier grad(h) . u + gamma * h >= 0
    // With grad = [3/5, 0, 4/5], h = 0.02, gamma = 5.0, u_nom = [-0.4, 0.1, 0.0]:
    // inner = -0.24, lhs = -0.24 + 0.10 = -0.14 < 0 -> violation = 0.14 <= maxSlack (0.25)
    const grad: [number, number, number] = [0.6, 0.0, 0.8];
    const hVal = 0.02;
    const gamma = 5.0;
    const uNom: [number, number, number] = [-0.4, 0.1, 0.0];
    const pos: [number, number, number] = [1.0, 0.0, 1.0];
    const vel: [number, number, number] = [0.2, -0.1, 0.05];

    const tier1Ts = manager.filterOrRecover(uNom, pos, vel, [
      { id: "wall-1", hValue: hVal, gradient: grad, gamma },
    ]);
    const violationOracle = -(grad[0] * uNom[0] + grad[1] * uNom[1] + grad[2] * uNom[2] + gamma * hVal);
    const tier1Oracle = {
      safeControl: [
        uNom[0] + violationOracle * grad[0],
        uNom[1] + violationOracle * grad[1],
        uNom[2] + violationOracle * grad[2],
      ] as [number, number, number],
      state: "relaxed-slack" as const,
      maxViolationSlack: violationOracle,
      activeConstraintCount: 1,
    };

    // 2. Tier 2: Severe violation > maxSlack triggers emergency braking + unit-gradient repulsion
    const uSevere: [number, number, number] = [-1.0, 0.0, -1.0];
    const tier2Ts = manager.filterOrRecover(uSevere, pos, vel, [
      { id: "wall-1", hValue: hVal, gradient: grad, gamma },
    ]);
    const severeViolationOracle = -(
      grad[0] * uSevere[0] +
      grad[1] * uSevere[1] +
      grad[2] * uSevere[2] +
      gamma * hVal
    );
    const tier2Oracle = {
      safeControl: [
        -2.5 * vel[0] + 1.2 * grad[0],
        -2.5 * vel[1] + 1.2 * grad[1],
        -2.5 * vel[2] + 1.2 * grad[2],
      ] as [number, number, number],
      state: "reflex-braking" as const,
      maxViolationSlack: severeViolationOracle,
      activeConstraintCount: 1,
    };

    const report = parityHarness("cbf-safety-filter-oracle", [
      {
        id: "tier1-kkt-halfspace-projection",
        input: { uNom, hVal },
        ts: tier1Ts,
        kernel: tier1Oracle,
        oracle: tier1Oracle,
        tolerance: 1e-9,
      },
      {
        id: "tier2-reflex-braking-repulsion",
        input: { uSevere, hVal },
        ts: tier2Ts,
        kernel: tier2Oracle,
        oracle: tier2Oracle,
        tolerance: 1e-9,
      },
    ]);

    expect(report.passed).toBe(2);
  });
});
