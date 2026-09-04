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

const STORAGE_KEY = "cmaes.g1.training-session.v1";

export interface SavedTrainingSession {
  version: 1;
  /** Owner build the policy was trained against; a mismatch is not resumable. */
  kernelVersion: string;
  task: string;
  challenge: string;
  family: string;
  sigma: number;
  generation: number;
  /** Wall-clock seconds of search behind this policy. */
  trainingSeconds: number;
  /** Epoch milliseconds of the last save. */
  savedAt: number;
  policy: number[];
  ledger: LearningLedgerPoint[];
}

export interface TrainingSessionSnapshot {
  kernelVersion: string;
  task: string;
  challenge: string;
  family: string;
  sigma: number;
  generation: number;
  trainingSeconds: number;
  policy: Float64Array;
  ledger: readonly LearningLedgerPoint[];
}

/**
 * Serialise a session.
 *
 * Split from the storage call so the shape can be tested without a DOM, and so
 * a caller can hand the same object to a file if it ever wants to.
 */
export function encodeTrainingSession(snapshot: TrainingSessionSnapshot): SavedTrainingSession {
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
    policy: Array.from(snapshot.policy),
    ledger: snapshot.ledger.map((point) => ({ ...point })),
  };
}

/**
 * Read a session back, returning null for anything unusable.
 *
 * Never throws: a corrupt or stale entry must degrade to "no saved run", not
 * break the page for everyone who visited during a bad deploy.
 */
export function decodeTrainingSession(
  raw: string | null,
  expectedPolicyLength: number,
): TrainingSessionSnapshot | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const saved = parsed as Partial<SavedTrainingSession>;
  if (saved.version !== 1) return null;
  if (!Array.isArray(saved.policy) || saved.policy.length !== expectedPolicyLength) return null;
  if (!saved.policy.every((value) => typeof value === "number" && Number.isFinite(value))) {
    return null;
  }
  if (typeof saved.generation !== "number" || !Number.isFinite(saved.generation)) return null;
  // A run with no generations behind it is the seed, which is not worth
  // restoring over the seed the page already loads.
  if (saved.generation <= 0) return null;
  return {
    kernelVersion: saved.kernelVersion ?? "unknown",
    task: saved.task ?? "walking",
    challenge: saved.challenge ?? "terrain-and-push",
    family: saved.family ?? "lm-ma",
    sigma: typeof saved.sigma === "number" ? saved.sigma : 0.0005,
    generation: saved.generation,
    trainingSeconds:
      typeof saved.trainingSeconds === "number" && Number.isFinite(saved.trainingSeconds)
        ? saved.trainingSeconds
        : 0,
    policy: Float64Array.from(saved.policy),
    ledger: Array.isArray(saved.ledger)
      ? (saved.ledger.filter(
          (point): point is LearningLedgerPoint =>
            !!point && typeof (point as LearningLedgerPoint).generation === "number",
        ) as LearningLedgerPoint[])
      : [],
  };
}

/** Whether a saved run can be continued by the owner this page is running. */
export function isResumable(
  snapshot: TrainingSessionSnapshot,
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
export function saveTrainingSession(snapshot: TrainingSessionSnapshot): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(encodeTrainingSession(snapshot)));
    return true;
  } catch {
    return false;
  }
}

/** Load the saved session, or null when there is none this owner can use. */
export function loadTrainingSession(
  expectedPolicyLength: number,
): (TrainingSessionSnapshot & { savedAt: number }) | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const snapshot = decodeTrainingSession(raw, expectedPolicyLength);
    if (!snapshot || !raw) return null;
    const savedAt = (JSON.parse(raw) as SavedTrainingSession).savedAt ?? Date.now();
    return { ...snapshot, savedAt };
  } catch {
    return null;
  }
}

/** Forget the saved run. Used when the operator explicitly starts over. */
export function clearTrainingSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do: the run is already unreachable.
  }
}
