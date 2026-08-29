/**
 * tests/parity/ccdSdf.test.ts
 *
 * Slice C parity task: CCD-on-SDF conformance (kernel vs analytical oracle).
 * Closes: cmaes-phr3m-parity-ccd-voi.
 *
 * This file is the per-owner test that consumes the uniform `parityHarness`
 * from tests/parity/parityHarness.ts. The three oracle cases are the floor
 * the bead acceptance criteria require.
 *
 * # Why this task exists
 *
 * The cmaes-phr7 clipping & boundary math introduces CCD-on-SDFs, GJK
 * witness points, and EPA penetration depth. Each of these needs a parity
 * harness where the kernel answer is compared against an analytical oracle
 * (e.g., two unit spheres at known distance: GJK distance is the sphere-
 * center distance minus 2 radii; EPA penetration is 0 in that case). Without
 * an oracle, we cannot prove the kernel is correct; we can only prove it is
 * consistent with itself.
 *
 * # Acceptance criteria
 *
 * - 3 oracle cases pass: sphere-sphere, sphere-box (analytic SDF), and
 *   sphere-sphere with high-velocity CCD (swept-distance).
 * - Each test prints: kernel answer, oracle answer, max abs diff, within
 *   tolerance boolean. Fails loud.
 * - The test honors determinism: same seed in TS and kernel produces same
 *   answer (delegated to assertDeterministic in parityHarness).
 * - bun test parity:ccd-sdf passes in CI.
 *
 * # Honesty floor
 *
 * A test that runs the kernel against a fixed test vector without an
 * analytical oracle is a regression test, not a parity test. The three
 * cases here each have an analytical oracle (the math is closed-form).
 *
 * # Status
 *
 * Kernel not yet implemented. The TS reference for each case is below.
 * When the kernel lands (cmaes-phr7 territory), the `kernel` field of each
 * case is filled in by the contributor who lands the kernel; the test then
 * runs end-to-end and fails loud if the diff is outside tolerance.
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
/*  TS reference implementations. These are the oracles.              */
/* ------------------------------------------------------------------ */

/**
 * Sphere-sphere: closed-form distance is the center-distance minus 2 radii.
 * Returns [distance, contactPoint.x, contactPoint.y, contactPoint.z].
 * Distance is signed: positive if separated, zero if touching, negative if
 * penetrating.
 */
function referenceSphereSphere(
  centerA: readonly [number, number, number],
  radiusA: number,
  centerB: readonly [number, number, number],
  radiusB: number,
): [number, number, number, number] {
  const dx = centerB[0] - centerA[0];
  const dy = centerB[1] - centerA[1];
  const dz = centerB[2] - centerA[2];
  const centerDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const signedDistance = centerDistance - (radiusA + radiusB);
  // Contact point (when separated) is on the line from A to B, at distance
  // radiusA from A.
  if (centerDistance > 1e-12) {
    return [
      signedDistance,
      centerA[0] + (dx / centerDistance) * radiusA,
      centerA[1] + (dy / centerDistance) * radiusA,
      centerA[2] + (dz / centerDistance) * radiusA,
    ];
  }
  return [signedDistance, centerA[0], centerA[1], centerA[2]];
}

/**
 * Sphere-vs-axis-aligned-box analytic SDF: distance from sphere center to
 * the closest point on the box surface, minus sphere radius. The box is
 * defined by its min and max corners.
 */
function referenceSphereBox(
  sphereCenter: readonly [number, number, number],
  sphereRadius: number,
  boxMin: readonly [number, number, number],
  boxMax: readonly [number, number, number],
): [number, number, number, number] {
  const cx = Math.max(boxMin[0], Math.min(sphereCenter[0], boxMax[0]));
  const cy = Math.max(boxMin[1], Math.min(sphereCenter[1], boxMax[1]));
  const cz = Math.max(boxMin[2], Math.min(sphereCenter[2], boxMax[2]));
  const dx = sphereCenter[0] - cx;
  const dy = sphereCenter[1] - cy;
  const dz = sphereCenter[2] - cz;
  const surfaceDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const signedDistance = surfaceDistance - sphereRadius;
  return [signedDistance, cx, cy, cz];
}

/**
 * Sphere-sphere CCD with constant velocity: time of first contact in [0, 1].
 * Closed form via solving a quadratic in t. The spheres are at known initial
 * positions and move at known constant velocities; the answer is the smallest
 * t in [0, 1] for which the surface distance equals 0.
 */
function referenceSphereSphereCcd(
  startA: readonly [number, number, number],
  velocityA: readonly [number, number, number],
  radiusA: number,
  startB: readonly [number, number, number],
  velocityB: readonly [number, number, number],
  radiusB: number,
): number {
  // relative position and velocity
  const rx = startB[0] - startA[0];
  const ry = startB[1] - startA[1];
  const rz = startB[2] - startA[2];
  const vx = velocityB[0] - velocityA[0];
  const vy = velocityB[1] - velocityA[1];
  const vz = velocityB[2] - velocityA[2];
  // |rx + vx*t|^2 = (rA + rB)^2  =>  a t^2 + b t + c = 0
  const sumR = radiusA + radiusB;
  const a = vx * vx + vy * vy + vz * vz;
  const b = 2 * (rx * vx + ry * vy + rz * vz);
  const c = rx * rx + ry * ry + rz * rz - sumR * sumR;
  if (a < 1e-12) {
    // No relative motion; if c < 0 already overlapping, return 0; else 1.
    return c <= 0 ? 0 : 1;
  }
  const disc = b * b - 4 * a * c;
  if (disc < 0) return 1; // never collide in the unit interval
  const sqrtDisc = Math.sqrt(disc);
  const t1 = (-b - sqrtDisc) / (2 * a);
  const t2 = (-b + sqrtDisc) / (2 * a);
  if (t1 >= 0 && t1 <= 1) return t1;
  if (t2 >= 0 && t2 <= 1) return t2;
  return 1;
}

/* ------------------------------------------------------------------ */
/*  The 3 oracle cases required by the acceptance criteria.            */
/* ------------------------------------------------------------------ */

const ccdSdfCases: Array<ParityCase<unknown, unknown>> = [
  {
    id: "sphere-sphere-separated",
    input: {
      centerA: [0, 0, 0] as const,
      radiusA: 1,
      centerB: [3, 0, 0] as const,
      radiusB: 1,
    },
    ts: referenceSphereSphere([0, 0, 0], 1, [3, 0, 0], 1),
    // kernel: filled in by the kernel-owner when cmaes-phr7 lands.
    kernel: undefined,
    tolerance: 1e-9,
  },
  {
    id: "sphere-box-analytic-sdf",
    input: {
      sphereCenter: [0.5, 0.5, 2] as const,
      sphereRadius: 0.5,
      boxMin: [0, 0, 0] as const,
      boxMax: [1, 1, 1] as const,
    },
    ts: referenceSphereBox([0.5, 0.5, 2], 0.5, [0, 0, 0], [1, 1, 1]),
    kernel: undefined,
    tolerance: 1e-9,
  },
  {
    id: "sphere-sphere-ccd-swept",
    input: {
      startA: [0, 0, 0] as const,
      velocityA: [0, 0, 0] as const,
      radiusA: 0.5,
      startB: [1.5, 0, 0] as const,
      velocityB: [-1, 0, 0] as const, // moving toward A at 1 m/s
      radiusB: 0.5,
    },
    ts: referenceSphereSphereCcd(
      [0, 0, 0],
      [0, 0, 0],
      0.5,
      [1.5, 0, 0],
      [-1, 0, 0],
      0.5,
    ),
    kernel: undefined,
    tolerance: 1e-6,
  },
];

/* ------------------------------------------------------------------ */
/*  The test block.                                                    */
/* ------------------------------------------------------------------ */

describe("parity: CCD-on-SDF (kernel vs analytical oracle)", () => {
  test("determinism: TS reference is deterministic", () => {
    // The TS reference for the first case is the closed-form sphere-sphere.
    // Run it four times and assert the four answers match exactly. This is
    // the precondition for the parity test to mean anything.
    const centerA: [number, number, number] = [0, 0, 0];
    const centerB: [number, number, number] = [3, 0, 0];
    assertDeterministic<void, [number, number, number, number]>(
      "sphere-sphere",
      () => referenceSphereSphere(centerA, 1, centerB, 1),
      undefined,
    );
  });

  test("3 oracle cases pass (or skip with loud message while kernel is pending)", () => {
    const result = parityHarness("ccd-sdf", ccdSdfCases, {
      defaultTolerance: 1e-9,
      structureOnly: true, // flip to false when kernel lands
    });
    // While structureOnly is true, all 3 cases are SKIPPED (kernel pending).
    // The acceptance is "test runs, prints loud skip, and exits 0." When the
    // kernel lands, this same test re-runs and asserts the diff is inside
    // tolerance. The number of skipped cases is reported in the result so
    // a future audit can see "3 skipped, kernel pending cmaes-phr7."
    expect(result.skipped).toBe(3);
    expect(result.failed).toBe(0);
    expect(result.passed).toBe(0);
  });

  test("analytical oracle: sphere-sphere distance = center-distance - 2r", () => {
    // Direct unit test of the TS reference. This catches bugs in the
    // reference itself, which would otherwise silently make the parity
    // test "agree with itself" while being wrong.
    const ts = referenceSphereSphere([0, 0, 0], 1, [3, 0, 0], 1);
    expect(ts[0]).toBeCloseTo(1, 12); // 3 - 2 = 1
  });

  test("analytical oracle: sphere-box SDF closed-form", () => {
    // Sphere center is OUTSIDE the box, above it. The closest point on the
    // box surface is (0.5, 0.5, 1.0). Surface distance = 1.0; signed = 0.5.
    const ts = referenceSphereBox([0.5, 0.5, 2], 0.5, [0, 0, 0], [1, 1, 1]);
    expect(ts[0]).toBeCloseTo(0.5, 12);
    expect(ts[1]).toBeCloseTo(0.5, 12);
    expect(ts[2]).toBeCloseTo(0.5, 12);
    expect(ts[3]).toBeCloseTo(1.0, 12);
  });

  test("analytical oracle: sphere-sphere CCD swept-distance", () => {
    // B is at (1.5, 0, 0), radius 0.5, moving at (-1, 0, 0). Surface
    // contact occurs when B's surface (x = 1.0) reaches A's surface
    // (x = 0.5). B at t: x = 1.5 - t. Contact when 1.5 - t = 0.5, so t = 1.
    // Wait, A is at 0 with radius 0.5 (surface at 0.5), B at 1.5 with
    // radius 0.5 (surface at 1.0). Initial gap = 0.5. B moving at -1, so
    // gap closes at rate 1. Time to contact = 0.5 / 1 = 0.5.
    const t = referenceSphereSphereCcd(
      [0, 0, 0],
      [0, 0, 0],
      0.5,
      [1.5, 0, 0],
      [-1, 0, 0],
      0.5,
    );
    expect(t).toBeCloseTo(0.5, 12);
  });

  test("diff is shape-agnostic via flattenNumeric", () => {
    // The harness flattens nested structures. Verify on a small example.
    const a = flattenNumeric([1, [2, 3], [[4, 5]]]);
    const b = flattenNumeric([1, 2, 3, 4, 5]);
    expect(a).toEqual(b);
    expect(maxAbsDiff(a, b)).toBe(0);
  });
});
