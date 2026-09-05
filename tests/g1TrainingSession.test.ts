import { describe, expect, test } from "bun:test";
import {
  decodeTrainingSession,
  describeAge,
  encodeTrainingSession,
  isResumable,
  type TrainingSessionSnapshot,
} from "../app/lib/g1TrainingSession";
import type { LearningLedgerPoint } from "../app/lib/g1LearningLedger";

function snapshotOf(overrides: Partial<TrainingSessionSnapshot> = {}): TrainingSessionSnapshot {
  return {
    kernelVersion: "fs-cmaes-viz-wasm 0.6.19",
    task: "walking",
    challenge: "terrain-and-push",
    family: "lm-ma",
    sigma: 0.0005,
    generation: 512,
    trainingSeconds: 7_240,
    policy: Float64Array.from({ length: 32 }, (_, index) => Math.sin(index) * 0.1),
    ledger: [
      {
        generation: 0,
        distanceMeters: 0.31,
        energyJoules: 11_930,
        walkSeconds: 1.5,
        speedMetersPerSecond: 0.21,
        metersPerKilojoule: 0.026,
        targetSpeedMetersPerSecond: 0.65,
        speedTrackingFraction: 0.32,
      },
    ],
    ...overrides,
  };
}

describe("G1 training session persistence", () => {
  test("round-trips a run through storage", () => {
    const snapshot = snapshotOf();
    const restored = decodeTrainingSession(
      JSON.stringify(encodeTrainingSession(snapshot)),
      snapshot.policy.length,
    );
    expect(restored).not.toBeNull();
    expect(restored?.generation).toBe(512);
    expect(restored?.trainingSeconds).toBe(7_240);
    expect(restored?.ledger).toHaveLength(1);
    for (let index = 0; index < snapshot.policy.length; index++) {
      // The saved policy is the whole point; it must come back bit-exact.
      expect(restored?.policy[index]).toBe(snapshot.policy[index]);
    }
  });

  test("refuses anything it cannot safely restore, rather than throwing", () => {
    const good = JSON.stringify(encodeTrainingSession(snapshotOf()));
    expect(decodeTrainingSession(null, 32)).toBeNull();
    expect(decodeTrainingSession("not json", 32)).toBeNull();
    for (const root of ["null", "0", "true", '"session"', "[]"]) {
      expect(decodeTrainingSession(root, 32)).toBeNull();
    }
    expect(decodeTrainingSession(JSON.stringify({ version: 99 }), 32)).toBeNull();
    // A policy sized for a different owner is not this page's policy.
    expect(decodeTrainingSession(good, 5_040)).toBeNull();
    // A non-finite coefficient would poison every rollout it touched.
    const poisoned = JSON.parse(good);
    poisoned.policy[3] = null;
    expect(decodeTrainingSession(JSON.stringify(poisoned), 32)).toBeNull();
  });

  test("rejects invalid search metadata and preserves signed zero", () => {
    const good = encodeTrainingSession(snapshotOf());
    for (const broken of [
      { sigma: null }, { sigma: -1 }, { generation: 1.5 },
      // Structurally impossible provenance is still refused here.
      { task: "" }, { challenge: "   " },
    ]) expect(decodeTrainingSession(JSON.stringify({ ...good, ...broken }), 32)).toBeNull();

    // A well-formed run for a task this owner does not run is NOT refused by
    // the decoder — the format carries manipulation policies too, so it cannot
    // whitelist walking's vocabulary. It is refused where that actually
    // matters, by isResumable, which is asserted in its own test above.
    const foreign = decodeTrainingSession(
      JSON.stringify({ ...good, task: "kitchen-mug" }),
      32,
    );
    expect(foreign).not.toBeNull();
    expect(
      isResumable(foreign!, foreign!.kernelVersion, "walking", foreign!.challenge),
    ).toBe(false);
    const signed = snapshotOf({ policy: Float64Array.of(-0, 1e-20, Number.MIN_VALUE) });
    const restored = decodeTrainingSession(JSON.stringify(encodeTrainingSession(signed)), 3);
    expect(restored).not.toBeNull();
    expect(new Uint8Array(restored!.policy.buffer)).toEqual(new Uint8Array(signed.policy.buffer));
    const malformedLedger = { ...good, ledger: [{ generation: 1 }, null, ...good.ledger] };
    // The stored form is deliberately unknown[] — this store carries both
    // robots' points — so the walking shape is asserted by casting here rather
    // than by the store pretending to know it.
    expect(decodeTrainingSession(JSON.stringify(malformedLedger), 32)?.ledger).toEqual(
      good.ledger as LearningLedgerPoint[],
    );
  });

  test("does not restore a run that never left the seed", () => {
    // Generation 0 is the curriculum policy the page loads anyway; restoring it
    // would announce a recovered run that recovered nothing.
    const seedOnly = JSON.stringify(encodeTrainingSession(snapshotOf({ generation: 0 })));
    expect(decodeTrainingSession(seedOnly, 32)).toBeNull();
  });

  test("survives a missing ledger and a missing clock without losing the policy", () => {
    const partial = JSON.parse(JSON.stringify(encodeTrainingSession(snapshotOf())));
    delete partial.ledger;
    delete partial.trainingSeconds;
    const restored = decodeTrainingSession(JSON.stringify(partial), 32);
    expect(restored?.generation).toBe(512);
    expect(restored?.ledger).toEqual([]);
    expect(restored?.trainingSeconds).toBe(0);
  });

  test("a run trained on another owner or another task is not resumable", () => {
    const snapshot = snapshotOf();
    expect(isResumable(snapshot, "fs-cmaes-viz-wasm 0.6.19", "walking", "terrain-and-push")).toBe(
      true,
    );
    expect(isResumable(snapshot, "fs-cmaes-viz-wasm 0.6.20", "walking", "terrain-and-push")).toBe(
      false,
    );
    expect(isResumable(snapshot, "fs-cmaes-viz-wasm 0.6.19", "balance", "terrain-and-push")).toBe(
      false,
    );
    expect(isResumable(snapshot, "fs-cmaes-viz-wasm 0.6.19", "walking", "flat")).toBe(false);
  });

  test("describes how long the tab was away in words", () => {
    const now = 1_000_000_000_000;
    expect(describeAge(now - 30_000, now)).toBe("just now");
    expect(describeAge(now - 20 * 60_000, now)).toBe("20 minutes ago");
    expect(describeAge(now - 60 * 60_000, now)).toBe("1 hour ago");
    expect(describeAge(now - 5 * 3_600_000, now)).toBe("5 hours ago");
    expect(describeAge(now - 5 * 86_400_000, now)).toBe("5 days ago");
  });
});
