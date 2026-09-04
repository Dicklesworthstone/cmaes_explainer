import { describe, expect, test } from "bun:test";
import {
  appendLedgerPoint,
  learningLedgerPoint,
  ledgerImprovementFactor,
  type LearningLedgerPoint,
} from "../app/lib/g1LearningLedger";

const STEP_SECONDS = 1 / 480;

function receipt(distanceMeters: number, actuatorWorkJoules: number, completedSteps: number) {
  return { distanceMeters, actuatorWorkJoules, completedSteps };
}

describe("G1 learning ledger", () => {
  test("recovers distance, energy, time, speed and economy from a receipt", () => {
    // 720 steps at 1/480 s is a completed 1.5 s rollout.
    const point = learningLedgerPoint(receipt(0.6, 300, 720), 128, STEP_SECONDS);
    expect(point.generation).toBe(128);
    expect(point.distanceMeters).toBeCloseTo(0.6, 10);
    expect(point.energyJoules).toBeCloseTo(300, 10);
    expect(point.walkSeconds).toBeCloseTo(1.5, 10);
    expect(point.speedMetersPerSecond).toBeCloseTo(0.4, 10);
    // 0.6 m for 0.3 kJ is 2 m/kJ.
    expect(point.metersPerKilojoule).toBeCloseTo(2, 10);
  });

  test("a robot that fell over is not infinitely efficient", () => {
    // No distance: economy is undefined, not a division by zero or a zero that
    // reads as a measured result.
    expect(learningLedgerPoint(receipt(0, 120, 40), 4, STEP_SECONDS).metersPerKilojoule).toBeNull();
    // No energy spent and nowhere reached: still undefined.
    expect(learningLedgerPoint(receipt(0, 0, 0), 4, STEP_SECONDS).metersPerKilojoule).toBeNull();
  });

  test("walking backwards buys nothing, and says so rather than reporting a negative economy", () => {
    const point = learningLedgerPoint(receipt(-0.4, 200, 720), 8, STEP_SECONDS);
    expect(point.distanceMeters).toBeCloseTo(-0.4, 10);
    // Speed stays signed, because "it went backwards at 0.27 m/s" is true.
    expect(point.speedMetersPerSecond).toBeCloseTo(-0.4 / 1.5, 10);
    // Economy does not, because negative metres per kilojoule is not a thing.
    expect(point.metersPerKilojoule).toBeNull();
  });

  test("a terminated rollout reports the time it actually completed", () => {
    // Terminated at step 82 of a 720-step horizon.
    const point = learningLedgerPoint(receipt(0.1, 50, 82), 12, STEP_SECONDS);
    expect(point.walkSeconds).toBeCloseTo(82 / 480, 10);
    expect(point.speedMetersPerSecond).toBeCloseTo(0.1 / (82 / 480), 10);
  });

  test("non-finite receipt fields degrade to zero instead of poisoning the chart", () => {
    const point = learningLedgerPoint(receipt(Number.NaN, Number.NaN, 720), 1, STEP_SECONDS);
    expect(point.distanceMeters).toBe(0);
    expect(point.energyJoules).toBe(0);
    expect(point.metersPerKilojoule).toBeNull();
  });

  test("reports achieved speed as a share of the speed the owner was commanded", () => {
    // 0.31 m in 1.5 s is 0.207 m/s against a 0.65 m/s command: about a third.
    const point = learningLedgerPoint(receipt(0.31, 11930, 720), 0, STEP_SECONDS, 0.65);
    expect(point.targetSpeedMetersPerSecond).toBeCloseTo(0.65, 10);
    expect(point.speedTrackingFraction).toBeCloseTo(0.31 / 1.5 / 0.65, 10);
  });

  test("walking backwards is zero percent of the command, not a negative share", () => {
    const point = learningLedgerPoint(receipt(-0.4, 200, 720), 8, STEP_SECONDS, 0.65);
    expect(point.speedTrackingFraction).toBe(0);
  });

  test("with no commanded speed there is no share to report", () => {
    const point = learningLedgerPoint(receipt(0.3, 200, 720), 8, STEP_SECONDS, 0);
    expect(point.speedTrackingFraction).toBeNull();
    expect(point.targetSpeedMetersPerSecond).toBe(0);
  });

  test("improvement is a plain multiple, and refuses meaningless comparisons", () => {
    const seed = learningLedgerPoint(receipt(0.3, 300, 720), 0, STEP_SECONDS);
    const better = learningLedgerPoint(receipt(0.9, 300, 720), 96, STEP_SECONDS);
    // Three times the distance for the same energy.
    expect(ledgerImprovementFactor(seed, better, "metersPerKilojoule")).toBeCloseTo(3, 10);
    expect(ledgerImprovementFactor(seed, better, "distanceMeters")).toBeCloseTo(3, 10);
    // A seed that never moved gives no baseline to be a multiple of.
    const stationary = learningLedgerPoint(receipt(0, 300, 720), 0, STEP_SECONDS);
    expect(ledgerImprovementFactor(stationary, better, "metersPerKilojoule")).toBeNull();
    expect(ledgerImprovementFactor(null, better, "distanceMeters")).toBeNull();
  });

  test("re-measuring a generation replaces it rather than drawing a second point", () => {
    const first = learningLedgerPoint(receipt(0.4, 200, 720), 32, STEP_SECONDS);
    const revised = learningLedgerPoint(receipt(0.5, 200, 720), 32, STEP_SECONDS);
    const history = appendLedgerPoint(appendLedgerPoint([], first), revised);
    expect(history).toHaveLength(1);
    expect(history[0].distanceMeters).toBeCloseTo(0.5, 10);
  });

  test("points stay ordered by generation and bounded, keeping the seed baseline", () => {
    let history: LearningLedgerPoint[] = [];
    history = appendLedgerPoint(history, learningLedgerPoint(receipt(0.2, 300, 720), 0, STEP_SECONDS));
    for (let generation = 400; generation > 0; generation -= 4) {
      history = appendLedgerPoint(
        history,
        learningLedgerPoint(receipt(0.5, 300, 720), generation, STEP_SECONDS),
        20,
      );
    }
    expect(history.length).toBeLessThanOrEqual(20);
    expect(history[0].generation).toBe(0);
    for (let index = 1; index < history.length; index++) {
      expect(history[index].generation).toBeGreaterThan(history[index - 1].generation);
    }
  });
});
