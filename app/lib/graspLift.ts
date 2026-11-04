/**
 * Antipodal pinch lift.
 *
 * Two finger pads squeeze with equal normal force. Coulomb friction on the
 * pads is what holds the object against gravity and inertial load. The lift
 * itself is a minimum-jerk rest-to-rest move whose peak acceleration is the
 * smaller of a household comfort cap and the acceleration those pads can
 * actually support.
 */

export const HOUSEHOLD_GRAVITY_MPS2 = 9.81;
export const ANTIPODAL_PAD_COUNT = 2;
export const HOUSEHOLD_TABLE_LIFT_HEIGHT_M = 0.18;
export const HOUSEHOLD_COMFORT_LIFT_ACCEL_MPS2 = 1.2;
export const HOUSEHOLD_COMFORT_CARRY_ACCEL_MPS2 = 1.5;

/** Tau of the positive peak of the minimum-jerk acceleration, (3 - sqrt(3)) / 6. */
const MINIMUM_JERK_PEAK_TAU = (3 - Math.sqrt(3)) / 6;

export interface MinimumJerkSample {
  /** Path fraction in [0, 1]. */
  s: number;
  /** d(s)/d(tau), dimensionless. */
  sDot: number;
  /** d²(s)/d(tau)², dimensionless. */
  sDdot: number;
}

export function minimumJerkDerivatives(tau: number): MinimumJerkSample {
  const t = Math.min(1, Math.max(0, tau));
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;
  const t5 = t4 * t;
  return {
    s: 10 * t3 - 15 * t4 + 6 * t5,
    sDot: 30 * t2 - 60 * t3 + 30 * t4,
    sDdot: 60 * t - 180 * t2 + 120 * t3,
  };
}

/** Positive peak of d²(s)/d(tau)². Physical accel is this times height / duration². */
export function minimumJerkPeakAccelerationScale(): number {
  return minimumJerkDerivatives(MINIMUM_JERK_PEAK_TAU).sDdot;
}

export function antipodalFrictionCapacityN(
  normalForceN: number,
  frictionCoeff: number,
  padCount = ANTIPODAL_PAD_COUNT,
): number {
  if (
    !Number.isFinite(normalForceN) ||
    !Number.isFinite(frictionCoeff) ||
    !Number.isFinite(padCount)
  ) {
    return 0;
  }
  return Math.max(0, padCount) * Math.max(0, frictionCoeff) * Math.max(0, normalForceN);
}

/**
 * Largest horizontal acceleration the pads can add on top of weight.
 * The contact force magnitude is m * sqrt(a_h² + g²) and must stay inside
 * the friction capacity.
 */
export function horizontalAccelCapacityMps2(
  massKg: number,
  capacityN: number,
  gravityMps2 = HOUSEHOLD_GRAVITY_MPS2,
): number {
  if (!Number.isFinite(massKg) || massKg <= 1e-6) return Number.POSITIVE_INFINITY;
  if (!Number.isFinite(capacityN) || capacityN <= 0 || !Number.isFinite(gravityMps2)) return 0;
  const specific = capacityN / massKg;
  if (specific <= gravityMps2) return 0;
  return Math.sqrt(specific * specific - gravityMps2 * gravityMps2);
}

export interface AntipodalLiftPlan {
  supported: boolean;
  durationS: number;
  peakAccelMps2: number;
  capacityN: number;
  peakLoadN: number;
}

export function planAntipodalLift({
  heightM,
  massKg,
  normalForceN,
  frictionCoeff,
  gravityMps2 = HOUSEHOLD_GRAVITY_MPS2,
  comfortPeakAccelMps2 = HOUSEHOLD_COMFORT_LIFT_ACCEL_MPS2,
  frictionMargin = 0.85,
}: {
  heightM: number;
  massKg: number;
  normalForceN: number;
  frictionCoeff: number;
  gravityMps2?: number;
  comfortPeakAccelMps2?: number;
  frictionMargin?: number;
}): AntipodalLiftPlan {
  const capacityN = antipodalFrictionCapacityN(normalForceN, frictionCoeff);
  const unsupported: AntipodalLiftPlan = {
    supported: false,
    durationS: 0,
    peakAccelMps2: 0,
    capacityN,
    peakLoadN: 0,
  };
  if (
    !Number.isFinite(heightM) ||
    heightM < 0 ||
    !Number.isFinite(massKg) ||
    massKg < 0 ||
    !Number.isFinite(gravityMps2) ||
    gravityMps2 <= 0 ||
    !Number.isFinite(comfortPeakAccelMps2) ||
    comfortPeakAccelMps2 <= 0 ||
    !Number.isFinite(frictionMargin) ||
    frictionMargin <= 0 ||
    frictionMargin > 1
  ) {
    return unsupported;
  }
  const weightN = massKg * gravityMps2;
  if (capacityN + 1e-9 < weightN) return { ...unsupported, peakLoadN: weightN };

  const peakScale = minimumJerkPeakAccelerationScale();
  let peakAccelMps2 = comfortPeakAccelMps2;
  if (massKg > 1e-6) {
    const available = frictionMargin * (capacityN / massKg - gravityMps2);
    if (available < 0.05) return { ...unsupported, peakLoadN: weightN };
    peakAccelMps2 = Math.min(comfortPeakAccelMps2, available);
  }
  const durationS =
    heightM <= 1e-6 ? 0 : Math.sqrt((peakScale * heightM) / peakAccelMps2);
  const peakLoadN = massKg * (gravityMps2 + peakAccelMps2);
  if (massKg > 1e-6 && peakLoadN > capacityN + 1e-6) {
    return { ...unsupported, peakLoadN };
  }
  return { supported: true, durationS, peakAccelMps2, capacityN, peakLoadN };
}

export interface LiftKinematics {
  heightM: number;
  velocityMps: number;
  accelMps2: number;
  done: boolean;
}

/** Rest-to-rest minimum-jerk sample. `elapsedS` is measured from the start of the move. */
export function sampleMinimumJerkLift(
  elapsedS: number,
  durationS: number,
  heightM: number,
): LiftKinematics {
  if (!Number.isFinite(heightM) || heightM < 0) {
    return { heightM: 0, velocityMps: 0, accelMps2: 0, done: true };
  }
  if (!Number.isFinite(durationS) || durationS <= 1e-6 || !Number.isFinite(elapsedS) || elapsedS >= durationS) {
    return { heightM, velocityMps: 0, accelMps2: 0, done: true };
  }
  const tau = Math.max(0, elapsedS) / durationS;
  const jerk = minimumJerkDerivatives(tau);
  return {
    heightM: heightM * jerk.s,
    velocityMps: (heightM / durationS) * jerk.sDot,
    accelMps2: (heightM / (durationS * durationS)) * jerk.sDdot,
    done: false,
  };
}
