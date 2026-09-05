import { describe, expect, test } from "bun:test";
import {
  appendArmLedgerPoint,
  armRefusalReason,
  armAccuracyImprovement,
  armEnergyImprovement,
  armLedgerPoint,
  type ArmLedgerPoint,
} from "../app/lib/armLearningLedger";

function receipt(overrides: Partial<Parameters<typeof armLedgerPoint>[0]> = {}) {
  return {
    finalObjectErrorMeters: 0.0059,
    placed: true,
    actuatorWorkJoules: 340,
    maximumLiftMeters: 0.138,
    firstGraspTimeSeconds: 1.2,
    graspDurationSeconds: 3.4,
    everGrasped: true,
    ...overrides,
  };
}

describe("arm learning ledger", () => {
  test("recovers the physical facts of a pick-and-place from a receipt", () => {
    const point = armLedgerPoint(receipt(), 96);
    expect(point.generation).toBe(96);
    expect(point.placementErrorMeters).toBeCloseTo(0.0059, 10);
    expect(point.placed).toBe(true);
    expect(point.energyJoules).toBeCloseTo(340, 10);
    expect(point.liftMeters).toBeCloseTo(0.138, 10);
    expect(point.firstGraspSeconds).toBeCloseTo(1.2, 10);
    expect(point.everGrasped).toBe(true);
  });

  test("non-finite and negative receipt fields degrade to zero", () => {
    const point = armLedgerPoint(
      receipt({ finalObjectErrorMeters: Number.NaN, actuatorWorkJoules: -5 }),
      1,
    );
    expect(point.placementErrorMeters).toBe(0);
    expect(point.energyJoules).toBe(0);
  });

  test("accuracy improvement is how many times closer the object landed", () => {
    const seed = armLedgerPoint(receipt({ finalObjectErrorMeters: 0.06 }), 0);
    const better = armLedgerPoint(receipt({ finalObjectErrorMeters: 0.02 }), 128);
    expect(armAccuracyImprovement(seed, better)).toBeCloseTo(3, 10);
  });

  test("a seed that already landed exactly is not an infinite improvement", () => {
    const perfect = armLedgerPoint(receipt({ finalObjectErrorMeters: 0 }), 0);
    const later = armLedgerPoint(receipt({ finalObjectErrorMeters: 0.01 }), 64);
    expect(armAccuracyImprovement(perfect, later)).toBeNull();
    expect(armAccuracyImprovement(later, perfect)).toBeNull();
    expect(armAccuracyImprovement(null, later)).toBeNull();
  });

  test("energy is only compared between rollouts that both did the task", () => {
    const seed = armLedgerPoint(receipt({ actuatorWorkJoules: 400 }), 0);
    const cheaper = armLedgerPoint(receipt({ actuatorWorkJoules: 200 }), 64);
    expect(armEnergyImprovement(seed, cheaper)).toBeCloseTo(2, 10);
    // Spending less energy by failing is not an improvement, and must not be
    // reported as one.
    const failedCheaply = armLedgerPoint(
      receipt({ actuatorWorkJoules: 50, placed: false }),
      64,
    );
    expect(armEnergyImprovement(seed, failedCheaply)).toBeNull();
    const failedSeed = armLedgerPoint(receipt({ placed: false }), 0);
    expect(armEnergyImprovement(failedSeed, cheaper)).toBeNull();
  });

  test("says why the owner refused, so a permanently hard task is not a mystery", () => {
    // The trowel is deliberately refusable, and stays refused through hundreds
    // of generations while its accuracy improves. Without a reason on screen
    // that reads as a broken page.
    const blocked = armLedgerPoint(
      receipt({
        placed: false,
        ownerReportedPlaced: true,
        possibleCollisionTimeSeconds: 0.42,
        minimumCertifiedClearanceMeters: 0.012,
      }),
      512,
    );
    expect(armRefusalReason(blocked)).toBe("collision envelope · 12 mm closest certified clearance");

    const noGrasp = armLedgerPoint(receipt({ placed: false, everGrasped: false }), 8);
    expect(armRefusalReason(noGrasp)).toBe("never grasped the object");

    const ownerRefused = armLedgerPoint(
      receipt({ placed: false, ownerReportedPlaced: false }),
      8,
    );
    expect(armRefusalReason(ownerRefused)).toBe("owner did not report a placement");

    // The browser's fail-closed re-check disagreeing with the owner is its own
    // distinct case, and must not be reported as one of the others.
    const browserRefused = armLedgerPoint(
      receipt({ placed: false, ownerReportedPlaced: true }),
      8,
    );
    expect(armRefusalReason(browserRefused)).toBe("browser collision re-check refused it");

    // A placement the owner accepted has no refusal to explain.
    expect(armRefusalReason(armLedgerPoint(receipt(), 8))).toBeNull();
  });

  test("re-measuring a generation replaces it rather than drawing a second point", () => {
    const first = armLedgerPoint(receipt({ finalObjectErrorMeters: 0.02 }), 32);
    const revised = armLedgerPoint(receipt({ finalObjectErrorMeters: 0.01 }), 32);
    const history = appendArmLedgerPoint(appendArmLedgerPoint([], first), revised);
    expect(history).toHaveLength(1);
    expect(history[0].placementErrorMeters).toBeCloseTo(0.01, 10);
  });

  test("points stay ordered and bounded, keeping the seed baseline", () => {
    let history: ArmLedgerPoint[] = [armLedgerPoint(receipt(), 0)];
    for (let generation = 200; generation > 0; generation -= 4) {
      history = appendArmLedgerPoint(history, armLedgerPoint(receipt(), generation), 12);
    }
    expect(history.length).toBeLessThanOrEqual(12);
    expect(history[0].generation).toBe(0);
    for (let index = 1; index < history.length; index++) {
      expect(history[index].generation).toBeGreaterThan(history[index - 1].generation);
    }
  });
});
