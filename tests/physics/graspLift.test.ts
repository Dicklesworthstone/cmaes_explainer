import { describe, expect, test } from "bun:test";
import {
  antipodalFrictionCapacityN,
  horizontalAccelCapacityMps2,
  HOUSEHOLD_COMFORT_LIFT_ACCEL_MPS2,
  HOUSEHOLD_GRAVITY_MPS2,
  minimumJerkDerivatives,
  minimumJerkPeakAccelerationScale,
  planAntipodalLift,
  sampleMinimumJerkLift,
} from "../../app/lib/graspLift";

describe("antipodal minimum-jerk lift", () => {
  test("the minimum-jerk move starts and ends at rest", () => {
    const start = minimumJerkDerivatives(0);
    const end = minimumJerkDerivatives(1);
    expect(start.s).toBeCloseTo(0, 12);
    expect(end.s).toBeCloseTo(1, 12);
    expect(start.sDot).toBeCloseTo(0, 12);
    expect(end.sDot).toBeCloseTo(0, 12);
    expect(start.sDdot).toBeCloseTo(0, 12);
    expect(end.sDdot).toBeCloseTo(0, 12);
  });

  test("the analytic peak is the largest acceleration on the curve", () => {
    const peakTau = (3 - Math.sqrt(3)) / 6;
    const troughTau = (3 + Math.sqrt(3)) / 6;
    const at = (tau: number) => minimumJerkDerivatives(tau).sDdot;
    const peak = minimumJerkPeakAccelerationScale();
    expect(peak).toBeGreaterThan(5);
    expect(peak).toBeCloseTo(at(peakTau), 12);
    expect(at(peakTau)).toBeGreaterThan(at(peakTau - 1e-4));
    expect(at(peakTau)).toBeGreaterThan(at(peakTau + 1e-4));
    expect(at(troughTau)).toBeCloseTo(-peak, 9);
    let sampled = 0;
    for (let i = 0; i <= 4000; i++) {
      sampled = Math.max(sampled, Math.abs(at(i / 4000)));
    }
    expect(sampled).toBeLessThanOrEqual(peak + 1e-12);
    expect(peak - sampled).toBeLessThan(1e-4);
  });

  test("two pads, not one, set the friction capacity", () => {
    expect(antipodalFrictionCapacityN(28, 0.65)).toBeCloseTo(2 * 28 * 0.65, 12);
    expect(antipodalFrictionCapacityN(-4, 0.65)).toBe(0);
  });

  test("a light mug uses the comfort acceleration and stays inside the pads", () => {
    const plan = planAntipodalLift({
      heightM: 0.18,
      massKg: 0.45,
      normalForceN: 28,
      frictionCoeff: 0.65,
    });
    expect(plan.supported).toBe(true);
    expect(plan.peakAccelMps2).toBeCloseTo(HOUSEHOLD_COMFORT_LIFT_ACCEL_MPS2, 12);
    expect(plan.peakLoadN).toBeLessThan(plan.capacityN);
    expect(plan.durationS).toBeGreaterThan(0.5);
    expect(plan.durationS).toBeLessThan(2);
    const mid = sampleMinimumJerkLift(plan.durationS * 0.5, plan.durationS, 0.18);
    expect(mid.heightM).toBeCloseTo(0.09, 6);
    expect(mid.accelMps2).toBeCloseTo(0, 6);
    const early = sampleMinimumJerkLift(plan.durationS * 0.2, plan.durationS, 0.18);
    expect(early.accelMps2).toBeGreaterThan(0);
    expect(early.accelMps2).toBeLessThanOrEqual(plan.peakAccelMps2 + 1e-9);
    const done = sampleMinimumJerkLift(plan.durationS, plan.durationS, 0.18);
    expect(done.done).toBe(true);
    expect(done.heightM).toBeCloseTo(0.18, 12);
    expect(done.velocityMps).toBe(0);
  });

  test("a heavy slippery object is not lifted", () => {
    const plan = planAntipodalLift({
      heightM: 0.18,
      massKg: 12,
      normalForceN: 28,
      frictionCoeff: 0.05,
    });
    expect(plan.supported).toBe(false);
    expect(plan.capacityN).toBeLessThan(12 * HOUSEHOLD_GRAVITY_MPS2);
  });

  test("a marginal grasp lengthens the lift instead of exceeding friction", () => {
    const massKg = 1.6;
    const normalForceN = 20;
    const frictionCoeff = 0.5;
    const plan = planAntipodalLift({
      heightM: 0.18,
      massKg,
      normalForceN,
      frictionCoeff,
      comfortPeakAccelMps2: 8,
    });
    expect(plan.supported).toBe(true);
    expect(plan.peakAccelMps2).toBeLessThan(8);
    expect(plan.peakLoadN).toBeLessThanOrEqual(plan.capacityN + 1e-6);
    expect(plan.durationS).toBeGreaterThan(
      planAntipodalLift({
        heightM: 0.18,
        massKg: 0.2,
        normalForceN,
        frictionCoeff,
        comfortPeakAccelMps2: 8,
      }).durationS,
    );
  });

  test("horizontal capacity is what remains after weight", () => {
    const capacityN = antipodalFrictionCapacityN(28, 0.65);
    const light = horizontalAccelCapacityMps2(0.45, capacityN);
    const heavy = horizontalAccelCapacityMps2(12, antipodalFrictionCapacityN(28, 0.05));
    expect(light).toBeGreaterThan(10);
    expect(heavy).toBe(0);
    const atLimit = 0.45 * Math.sqrt(light * light + HOUSEHOLD_GRAVITY_MPS2 ** 2);
    expect(atLimit).toBeCloseTo(capacityN, 6);
  });
});
