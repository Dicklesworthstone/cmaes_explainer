/**
 * The physical facts underneath the objective.
 *
 * The CMA objective is a weighted sum with no units: it tells you that
 * something improved, not what improved. These are the quantities a person can
 * actually judge a walking robot by — how far it got, how long that took, and
 * what it spent doing it — recovered from the same owner receipt the objective
 * comes from, so the ledger and the objective can never disagree.
 *
 * Deliberately mass-free. Cost of transport (E / m g d) is the standard
 * locomotion figure, but the owner does not disclose the model's total mass,
 * and inventing a plausible 35 kg to divide by would make every number here a
 * fiction dressed as a measurement. Metres per kilojoule needs no mass and
 * answers the same question: how far does this gait get for a fixed energy
 * budget.
 */

/** One measurement of a policy, taken from a replayed owner receipt. */
export interface LearningLedgerPoint {
  /** CMA generation the replayed policy came from; 0 is the curriculum seed. */
  generation: number;
  /** Forward displacement over the rollout [m]. */
  distanceMeters: number;
  /** Actuator work integral over the rollout [J]. */
  energyJoules: number;
  /** Simulated time the owner actually completed before terminating [s]. */
  walkSeconds: number;
  /** Mean forward speed over the completed rollout [m/s], or null if it never moved. */
  speedMetersPerSecond: number | null;
  /**
   * Forward distance bought per kilojoule of actuator work [m/kJ].
   *
   * Null when the rollout spent no energy or went nowhere, which is not an
   * infinitely efficient gait — it is a robot that fell over.
   */
  metersPerKilojoule: number | null;
  /** Speed the owner was commanded to walk at [m/s]. */
  targetSpeedMetersPerSecond: number;
  /**
   * Achieved speed as a fraction of the commanded speed, floored at 0.
   *
   * The single most legible measure of whether a walking policy is learning:
   * the owner is asked for a speed, and this is how much of it the robot is
   * delivering. Null when no speed was commanded to compare against.
   */
  speedTrackingFraction: number | null;
}

/** The receipt fields the ledger reads. Structural, so a fuller receipt fits. */
export interface LearningLedgerSource {
  distanceMeters: number;
  actuatorWorkJoules: number;
  completedSteps: number;
}

const MINIMUM_MEANINGFUL_ENERGY_J = 1e-6;
const MINIMUM_MEANINGFUL_SECONDS = 1e-9;

/**
 * Reduce an owner receipt to the physical ledger entry for one generation.
 *
 * `stepSeconds` is the owner's fixed integration step, so completed steps
 * become real seconds rather than a step count nobody can picture.
 */
export function learningLedgerPoint(
  receipt: LearningLedgerSource,
  generation: number,
  stepSeconds: number,
  targetSpeedMetersPerSecond = 0,
): LearningLedgerPoint {
  const distanceMeters = Number.isFinite(receipt.distanceMeters) ? receipt.distanceMeters : 0;
  const energyJoules = Number.isFinite(receipt.actuatorWorkJoules)
    ? Math.max(0, receipt.actuatorWorkJoules)
    : 0;
  const walkSeconds =
    Number.isFinite(stepSeconds) && stepSeconds > 0
      ? Math.max(0, receipt.completedSteps) * stepSeconds
      : 0;

  // A robot that went backwards has not bought anything with its energy, so
  // economy is reported only for forward progress.
  const forwardMeters = distanceMeters > 0 ? distanceMeters : 0;

  const speedMetersPerSecond =
    walkSeconds > MINIMUM_MEANINGFUL_SECONDS ? distanceMeters / walkSeconds : null;
  const target =
    Number.isFinite(targetSpeedMetersPerSecond) && targetSpeedMetersPerSecond > 0
      ? targetSpeedMetersPerSecond
      : 0;

  return {
    generation,
    distanceMeters,
    energyJoules,
    walkSeconds,
    speedMetersPerSecond,
    metersPerKilojoule:
      energyJoules > MINIMUM_MEANINGFUL_ENERGY_J && forwardMeters > 0
        ? forwardMeters / (energyJoules / 1000)
        : null,
    targetSpeedMetersPerSecond: target,
    speedTrackingFraction:
      target > 0 && speedMetersPerSecond !== null
        ? Math.max(0, speedMetersPerSecond) / target
        : null,
  };
}

/**
 * How much better the latest policy is than the seed, as a plain multiple.
 *
 * Null whenever the comparison would be meaningless rather than zero, because
 * "0.0x" reads like a measured collapse when it usually means the seed had
 * nothing to compare against.
 */
export function ledgerImprovementFactor(
  seed: LearningLedgerPoint | null,
  latest: LearningLedgerPoint | null,
  metric:
    | "metersPerKilojoule"
    | "distanceMeters"
    | "speedMetersPerSecond"
    | "speedTrackingFraction",
): number | null {
  if (!seed || !latest) return null;
  const before = seed[metric];
  const after = latest[metric];
  if (before === null || after === null) return null;
  if (!Number.isFinite(before) || !Number.isFinite(after)) return null;
  if (before <= 0 || after <= 0) return null;
  return after / before;
}

/**
 * Append a measurement, replacing any existing entry for the same generation.
 *
 * Replays can repeat a generation (a stop lands on one already rendered), and
 * a duplicated point would draw a vertical step in the trend that no policy
 * actually took.
 */
export function appendLedgerPoint(
  history: readonly LearningLedgerPoint[],
  point: LearningLedgerPoint,
  cap = 240,
): LearningLedgerPoint[] {
  const kept = history.filter((entry) => entry.generation !== point.generation);
  const next = [...kept, point].sort((a, b) => a.generation - b.generation);
  if (next.length <= cap) return next;
  // Keep the seed and the newest tail; thin the middle. The seed is the
  // baseline every delta is measured against, so it must never be dropped.
  const head = next.slice(0, 1);
  const tail = next.slice(next.length - (cap - 1));
  return [...head, ...tail];
}
