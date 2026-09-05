/**
 * What the arm actually achieved, underneath the objective.
 *
 * The walking ledger's counterpart. The manipulation objective is likewise a
 * weighted sum with no units, and the same question applies to it: is the arm
 * getting better at the task, or better at the score?
 *
 * A pick-and-place has a different natural yardstick than a gait. Nobody cares
 * how far a mug travelled per joule; they care whether it ARRIVED, how close,
 * and what the arm spent getting it there. So the headline here is placement
 * error in millimetres — the distance between where the object ended up and
 * where it was asked to go — with the energy and the grasp timing beside it.
 */

/** One measurement of an arm policy, taken from a replayed owner receipt. */
export interface ArmLedgerPoint {
  /** CMA generation the replayed policy came from; 0 is the curriculum seed. */
  generation: number;
  /** Distance from the object's final centre to its goal [m]. */
  placementErrorMeters: number;
  /** Whether the owner's collision-safe placement verdict passed. */
  placed: boolean;
  /** Actuator work integral over the rollout [J]. */
  energyJoules: number;
  /** Peak object-centre rise from its supported start [m]. */
  liftMeters: number;
  /** Time the object was first held under the bilateral grasp constraint [s]. */
  firstGraspSeconds: number;
  /** Total time under that constraint [s]. */
  graspSeconds: number;
  /** Whether a grasp was ever established at all. */
  everGrasped: boolean;
}

/** The receipt fields the arm ledger reads. Structural, so a fuller receipt fits. */
export interface ArmLedgerSource {
  finalObjectErrorMeters: number;
  placed: boolean;
  actuatorWorkJoules: number;
  maximumLiftMeters: number;
  firstGraspTimeSeconds: number;
  graspDurationSeconds: number;
  everGrasped: boolean;
}

function finite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Reduce an owner receipt to the ledger entry for one generation. */
export function armLedgerPoint(receipt: ArmLedgerSource, generation: number): ArmLedgerPoint {
  return {
    generation,
    placementErrorMeters: Math.max(0, finite(receipt.finalObjectErrorMeters)),
    placed: receipt.placed === true,
    energyJoules: Math.max(0, finite(receipt.actuatorWorkJoules)),
    liftMeters: Math.max(0, finite(receipt.maximumLiftMeters)),
    firstGraspSeconds: Math.max(0, finite(receipt.firstGraspTimeSeconds)),
    graspSeconds: Math.max(0, finite(receipt.graspDurationSeconds)),
    everGrasped: receipt.everGrasped === true,
  };
}

/**
 * How much the placement improved against the seed, as a plain multiple.
 *
 * Error SHRINKS as the arm improves, so the multiple is seed/latest: "3x
 * closer". Withheld rather than printed whenever it would be meaningless — a
 * seed that already landed exactly on the goal has no error to be a multiple
 * of, and dividing by it would report an infinite improvement.
 */
export function armAccuracyImprovement(
  seed: ArmLedgerPoint | null,
  latest: ArmLedgerPoint | null,
): number | null {
  if (!seed || !latest) return null;
  if (!(seed.placementErrorMeters > 0) || !(latest.placementErrorMeters > 0)) return null;
  return seed.placementErrorMeters / latest.placementErrorMeters;
}

/**
 * Energy saved against the seed, as a plain multiple (seed/latest).
 *
 * Only meaningful between two rollouts that both did the task: spending less
 * energy by failing earlier is not an improvement, and reporting it as one is
 * exactly the kind of number this ledger exists to prevent.
 */
export function armEnergyImprovement(
  seed: ArmLedgerPoint | null,
  latest: ArmLedgerPoint | null,
): number | null {
  if (!seed || !latest) return null;
  if (!seed.placed || !latest.placed) return null;
  if (!(seed.energyJoules > 0) || !(latest.energyJoules > 0)) return null;
  return seed.energyJoules / latest.energyJoules;
}

/**
 * Append a measurement, replacing any existing entry for the same generation.
 *
 * Same reasoning as the walking ledger: a repeated generation would draw a
 * vertical step in the trend that no policy actually took.
 */
export function appendArmLedgerPoint(
  history: readonly ArmLedgerPoint[],
  point: ArmLedgerPoint,
  cap = 240,
): ArmLedgerPoint[] {
  const kept = history.filter((entry) => entry.generation !== point.generation);
  const next = [...kept, point].sort((a, b) => a.generation - b.generation);
  if (next.length <= cap) return next;
  // The seed is the baseline every delta is measured against; never drop it.
  return [next[0], ...next.slice(next.length - (cap - 1))];
}
