/**
 * Surviving a refresh.
 *
 * Training runs until you stop it, which invites leaving it going for hours —
 * and until now a reload, a crash, or a closed tab threw all of it away. The
 * policy file and share link cover deliberate saves; this covers the accident.
 *
 * What is saved is the RESULT, not the search: the best policy, the physical
 * ledger, and how long it took. The CMA session itself (mean, sigma, evolution
 * paths) lives in WASM and is not serialisable, so resuming restarts the search
 * from the saved policy as its new mean. That is a warm restart, not a resumed
 * one, and the UI says so rather than implying the covariance came back too.
 */

import type { LearningLedgerPoint } from "./g1LearningLedger";
import { MAX_POLICY_FILE_BYTES, validatePolicyMetadata, type SharedPolicyMeta } from "./g1PolicyShare";

/**
 * Which robot a saved run belongs to.
 *
 * Both flagships train continuously and both deserve to survive a reload, but
 * their runs are unrelated: they have different policies, different ledgers and
 * different owners. One key would mean the page you visited last silently
 * destroyed the other's overnight run.
 */
export type TrainingSubject = "g1" | "arm";

/**
 * The walking ledger's own point guard, and the default.
 *
 * A stored point that is missing a field renders as NaN on the convergence
 * chart, so each robot validates the shape it wrote. This module defaults to
 * the walking shape because its default subject is the walking page; the arm
 * passes its own.
 */
function isWalkingLedgerPoint(point: unknown): point is LearningLedgerPoint {
  if (!point || typeof point !== "object") return false;
  const value = point as Record<string, unknown>;
  return (
    [
      value.generation,
      value.distanceMeters,
      value.energyJoules,
      value.walkSeconds,
      value.targetSpeedMetersPerSecond,
    ].every((entry) => typeof entry === "number" && Number.isFinite(entry)) &&
    [value.speedMetersPerSecond, value.metersPerKilojoule, value.speedTrackingFraction].every(
      (entry) => entry === null || (typeof entry === "number" && Number.isFinite(entry)),
    )
  );
}

/**
 * One slot per EXPERIMENT, not per robot.
 *
 * A single slot per robot quietly destroyed work: train walking for two hours,
 * switch to balance to look at it, train that for a minute, and the walking run
 * is gone — overwritten by a different experiment that happens to share a
 * robot. Runs for different tasks are different work and each keeps its own
 * slot.
 *
 * The task and challenge are part of the key rather than only checked on the
 * way out, because checking alone still lets the last writer win.
 */
function storageKey(subject: TrainingSubject, task: string, challenge: string): string {
  const slug = (value: string) => value.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  return `cmaes.${subject}.${slug(task)}.${slug(challenge)}.training-session.v2`;
}

/** The v1 single-slot key this superseded, cleared on first write per robot. */
function legacyStorageKey(subject: TrainingSubject): string {
  return `cmaes.${subject}.training-session.v1`;
}

export interface SavedTrainingSession {
  version: 1;
  /** Owner build the policy was trained against; a mismatch is not resumable. */
  kernelVersion: string;
  task: SharedPolicyMeta["task"];
  challenge: SharedPolicyMeta["challenge"];
  family: SharedPolicyMeta["family"];
  sigma: number;
  generation: number;
  /** Wall-clock seconds of search behind this policy. */
  trainingSeconds: number;
  /** Epoch milliseconds of the last save. */
  savedAt: number;
  policy: Array<number | "-0">;
  ledger: unknown[];
}

export interface TrainingSessionSnapshot<TPoint = LearningLedgerPoint> {
  kernelVersion: string;
  task: SharedPolicyMeta["task"];
  challenge: SharedPolicyMeta["challenge"];
  family: SharedPolicyMeta["family"];
  sigma: number;
  generation: number;
  trainingSeconds: number;
  policy: Float64Array;
  /**
   * The robot's own ledger points. Opaque to this module: a gait is measured by
   * distance and a pick-and-place by placement error, and the store has no
   * business knowing which. Each caller narrows what it reads back.
   */
  ledger: readonly TPoint[];
}

/**
 * Serialise a session.
 *
 * Split from the storage call so the shape can be tested without a DOM, and so
 * a caller can hand the same object to a file if it ever wants to.
 */
export function encodeTrainingSession<TPoint>(
  snapshot: TrainingSessionSnapshot<TPoint>,
): SavedTrainingSession {
  return {
    version: 1,
    kernelVersion: snapshot.kernelVersion,
    task: snapshot.task,
    challenge: snapshot.challenge,
    family: snapshot.family,
    sigma: snapshot.sigma,
    generation: snapshot.generation,
    trainingSeconds: snapshot.trainingSeconds,
    savedAt: Date.now(),
    policy: Array.from(snapshot.policy, (value) => Object.is(value, -0) ? "-0" : value),
    ledger: snapshot.ledger.map((point) => ({ ...(point as object) })),
  };
}

/**
 * Read a session back, returning null for anything unusable.
 *
 * Never throws: a corrupt or stale entry must degrade to "no saved run", not
 * break the page for everyone who visited during a bad deploy.
 */
export function decodeTrainingSession<TPoint = LearningLedgerPoint>(
  raw: string | null,
  expectedPolicyLength: number,
  isPoint: (point: unknown) => point is TPoint = isWalkingLedgerPoint as unknown as (
    point: unknown,
  ) => point is TPoint,
): TrainingSessionSnapshot<TPoint> | null {
  if (!raw || raw.length > MAX_POLICY_FILE_BYTES) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
    validatePolicyMetadata(parsed);
  } catch {
    return null;
  }
  const saved = parsed as Partial<SavedTrainingSession>;
  if (saved.version !== 1) return null;
  if (!Array.isArray(saved.policy) || saved.policy.length !== expectedPolicyLength) return null;
  if (!saved.policy.every((value) => value === "-0" || (typeof value === "number" && Number.isFinite(value)))) {
    return null;
  }
  if (typeof saved.generation !== "number" || !Number.isInteger(saved.generation)) return null;
  // A run with no generations behind it is the seed, which is not worth
  // restoring over the seed the page already loads.
  if (saved.generation <= 0) return null;
  return {
    kernelVersion: parsed.kernelVersion,
    task: parsed.task,
    challenge: parsed.challenge,
    family: parsed.family,
    sigma: parsed.sigma,
    generation: saved.generation,
    trainingSeconds:
      typeof saved.trainingSeconds === "number" && Number.isFinite(saved.trainingSeconds) && saved.trainingSeconds >= 0
        ? saved.trainingSeconds
        : 0,
    policy: Float64Array.from(saved.policy, (value) => value === "-0" ? -0 : value),
    ledger: (Array.isArray(saved.ledger) ? saved.ledger.filter(isPoint) : []) as TPoint[],
  };
}

/** Whether a saved run can be continued by the owner this page is running. */
export function isResumable(
  snapshot: TrainingSessionSnapshot<unknown>,
  kernelVersion: string,
  task: string,
  challenge: string,
): boolean {
  return (
    snapshot.kernelVersion === kernelVersion &&
    snapshot.task === task &&
    snapshot.challenge === challenge
  );
}

/** "3 hours ago" — how long the tab was away, in words. */
export function describeAge(savedAtMs: number, nowMs = Date.now()): string {
  const seconds = Math.max(0, (nowMs - savedAtMs) / 1000);
  if (seconds < 90) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${Math.round(hours / 24)} days ago`;
}

/**
 * Persist a session, quietly doing nothing if the browser refuses.
 *
 * Private windows, disabled site data, and a full quota all throw here, and
 * none of them are worth interrupting a training run over.
 */
export function saveTrainingSession<TPoint>(
  snapshot: TrainingSessionSnapshot<TPoint>,
  subject: TrainingSubject = "g1",
): boolean {
  try {
    window.localStorage.setItem(
      storageKey(subject, snapshot.task, snapshot.challenge),
      JSON.stringify(encodeTrainingSession(snapshot)),
    );
    // The superseded single-slot entry would otherwise sit in storage forever
    // holding a stale copy of one experiment.
    window.localStorage.removeItem(legacyStorageKey(subject));
    return true;
  } catch {
    return false;
  }
}

/** Load the saved session, or null when there is none this owner can use. */
export function loadTrainingSession<TPoint = LearningLedgerPoint>(
  expectedPolicyLength: number,
  subject: TrainingSubject = "g1",
  isPoint?: (point: unknown) => point is TPoint,
  task = "walking",
  challenge = "terrain-and-push",
): (TrainingSessionSnapshot<TPoint> & { savedAt: number }) | null {
  try {
    const raw = window.localStorage.getItem(storageKey(subject, task, challenge));
    const snapshot = isPoint
      ? decodeTrainingSession<TPoint>(raw, expectedPolicyLength, isPoint)
      : decodeTrainingSession<TPoint>(raw, expectedPolicyLength);
    if (!snapshot || !raw) return null;
    const timestamp = (JSON.parse(raw) as SavedTrainingSession).savedAt;
    const savedAt = Number.isFinite(timestamp) && timestamp >= 0 ? timestamp : Date.now();
    return { ...snapshot, savedAt };
  } catch {
    return null;
  }
}

/** Forget the saved run. Used when the operator explicitly starts over. */
export function clearTrainingSession(
  subject: TrainingSubject = "g1",
  task = "walking",
  challenge = "terrain-and-push",
): void {
  try {
    window.localStorage.removeItem(storageKey(subject, task, challenge));
  } catch {
    // Nothing to do: the run is already unreachable.
  }
}
