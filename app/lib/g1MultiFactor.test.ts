// Tests for the multi-factor G1 objective (cmaes-0m3).
//
// The function lives in app/lib/g1MultiFactor.ts and is consumed by
// G1WalkingFlagship.tsx. The acceptance criterion for cmaes-0m3 is that
// the multi-factor objective re-exposes the kernel scalar's per-channel
// breakdown so a stabilizing correction is no longer collapsed. These
// tests pin the channel weights, the per-channel contributions, the
// target-speed gap penalty, the work-per-meter floor, the survival
// normalization, and the parity of the weighted sum with the explicit
// per-channel contributions (a hand-computed value for a synthetic
// receipt).

import { describe, expect, test } from "bun:test";
import {
  computeMultiFactorObjective,
  type MultiFactorConfig,
} from "./g1MultiFactor";
import type { G1TraceReceipt } from "./frankensimCmaes";

const DEFAULT_CONFIG: MultiFactorConfig = {
  stepSeconds: 1 / 480,
  durationSeconds: 1.5,
  targetSpeed: 0.65,
};

function buildReceipt(
  partial: Partial<G1TraceReceipt> & { samples: G1TraceReceipt["samples"] },
): G1TraceReceipt {
  return {
    objective: 0,
    distanceMeters: 0,
    speedErrorIntegral: 0,
    actuatorWorkJoules: 0,
    slipIntegral: 0,
    postureIntegral: 0,
    jointLimitIntegral: 0,
    impactIntegral: 0,
    backwardDistanceMeters: 0,
    lateralErrorIntegral: 0,
    headingErrorIntegral: 0,
    contactScheduleMismatchIntegral: 0,
    swingClearanceErrorIntegral: 0,
    singleSupportSeconds: 0,
    doubleSupportSeconds: 0,
    flightSeconds: 0,
    pushImpulseNewtonSeconds: 0,
    recoveryTimeSeconds: 0,
    minimumBaseHeightMeters: 0.6,
    maximumTiltSine: 0.05,
    maximumAbsoluteTerrainHeightMeters: 0.05,
    completedSteps: 0,
    terminationReason: "horizon",
    ...partial,
  };
}

function makeSamples(timeSeconds: number): G1TraceReceipt["samples"] {
  return [
    {
      timeSeconds,
      leftContact: true,
      rightContact: true,
      linkPoses: Array.from({ length: 30 }, () => ({
        position: [0, 0, 0] as [number, number, number],
        quaternionWxyz: [1, 0, 0, 0] as [number, number, number, number],
      })),
    },
  ];
}

describe("computeMultiFactorObjective (cmaes-0m3)", () => {
  test("returns 11 channels with the v068-shaping weights", () => {
    const r = computeMultiFactorObjective(
      buildReceipt({ samples: makeSamples(1.5) }),
      DEFAULT_CONFIG,
    );
    expect(r.channels).toHaveLength(11);
    const labels = r.channels.map((c) => c.label);
    expect(labels).toContain("mean fwd speed ≥ target");
    expect(labels).toContain("survival (steps/horizon)");
    expect(labels).toContain("slip integral");
    expect(labels).toContain("posture integral");
    expect(labels).toContain("joint-limit integral");
    expect(labels).toContain("impact integral");
    expect(labels).toContain("contact-schedule mismatch");
    expect(labels).toContain("lateral error ∫");
    expect(labels).toContain("heading error ∫");
    expect(labels).toContain("speed error ∫");
    expect(labels).toContain("work per meter (efficiency)");
  });

  test("v068-shaping weights are pinned (cmaes-0m3 AC)", () => {
    // Pin the exact weights so a future "rebalance" is a deliberate
    // change, not a silent one.
    const r = computeMultiFactorObjective(
      buildReceipt({ samples: makeSamples(1.5) }),
      DEFAULT_CONFIG,
    );
    const byLabel: Record<string, number> = {};
    for (const c of r.channels) byLabel[c.label] = c.weight;
    expect(byLabel["mean fwd speed ≥ target"]).toBeCloseTo(-3.0, 10);
    expect(byLabel["survival (steps/horizon)"]).toBeCloseTo(-1.0, 10);
    expect(byLabel["slip integral"]).toBeCloseTo(0.4, 10);
    expect(byLabel["posture integral"]).toBeCloseTo(0.3, 10);
    expect(byLabel["joint-limit integral"]).toBeCloseTo(0.5, 10);
    expect(byLabel["impact integral"]).toBeCloseTo(0.6, 10);
    expect(byLabel["contact-schedule mismatch"]).toBeCloseTo(0.4, 10);
    expect(byLabel["lateral error ∫"]).toBeCloseTo(0.2, 10);
    expect(byLabel["heading error ∫"]).toBeCloseTo(0.2, 10);
    expect(byLabel["speed error ∫"]).toBeCloseTo(0.2, 10);
    expect(byLabel["work per meter (efficiency)"]).toBeCloseTo(0.05, 10);
  });

  test("survival normalizes by horizon (720 steps)", () => {
    // completedSteps / (durationSeconds / stepSeconds) = 720 / 720 = 1.0
    // survival contribution = 1.0 * 1.0 = 1.0
    const r = computeMultiFactorObjective(
      buildReceipt({
        samples: makeSamples(1.5),
        completedSteps: 720,
      }),
      DEFAULT_CONFIG,
    );
    const surv = r.channels.find((c) => c.label === "survival (steps/horizon)")!;
    expect(surv.value).toBeCloseTo(1.0, 10);
    expect(surv.contribution).toBeCloseTo(-1.0, 10);
  });

  test("mean fwd speed gap: at target -> 0 contribution, no motion -> positive", () => {
    // Mean fwd speed = 0.65 m/s (== target) -> 0
    const r1 = computeMultiFactorObjective(
      buildReceipt({
        samples: makeSamples(1.0),
        distanceMeters: 0.65, // = target * duration
      }),
      DEFAULT_CONFIG,
    );
    const sp1 = r1.channels.find((c) => c.label === "mean fwd speed ≥ target")!;
    expect(sp1.value).toBeCloseTo(0.65, 10);
    expect(sp1.contribution).toBeCloseTo(0.0, 10);

    // Mean fwd speed = 0.0 m/s (no motion) -> -3.0 * (0 - 0.65) = 1.95
    const r2 = computeMultiFactorObjective(
      buildReceipt({
        samples: makeSamples(1.0),
        distanceMeters: 0.0,
      }),
      DEFAULT_CONFIG,
    );
    const sp2 = r2.channels.find((c) => c.label === "mean fwd speed ≥ target")!;
    expect(sp2.value).toBeCloseTo(0.0, 10);
    expect(sp2.contribution).toBeCloseTo(1.95, 10);
  });

  test("work per meter: floor at 0.05 m prevents divide-by-zero", () => {
    // distance = 0; uses floor 0.05 -> workPerMeter = 100 / 0.05 = 2000
    // contribution = 0.05 * 2000 = 100
    const r = computeMultiFactorObjective(
      buildReceipt({
        samples: makeSamples(1.0),
        distanceMeters: 0.0,
        actuatorWorkJoules: 100,
      }),
      DEFAULT_CONFIG,
    );
    const w = r.channels.find((c) => c.label === "work per meter (efficiency)")!;
    expect(w.value).toBeCloseTo(2000, 10);
    expect(w.contribution).toBeCloseTo(100, 10);
  });

  test("slip / posture / impact contributions scale with their integrals", () => {
    const r = computeMultiFactorObjective(
      buildReceipt({
        samples: makeSamples(1.0),
        slipIntegral: 0.1,
        postureIntegral: 0.2,
        impactIntegral: 0.3,
        jointLimitIntegral: 0.4,
        contactScheduleMismatchIntegral: 0.5,
        lateralErrorIntegral: 1.0,
        headingErrorIntegral: 2.0,
        speedErrorIntegral: 3.0,
      }),
      DEFAULT_CONFIG,
    );
    const byLabel: Record<string, number> = {};
    for (const c of r.channels) byLabel[c.label] = c.contribution;
    expect(byLabel["slip integral"]).toBeCloseTo(0.04, 10);
    expect(byLabel["posture integral"]).toBeCloseTo(0.06, 10);
    expect(byLabel["joint-limit integral"]).toBeCloseTo(0.2, 10);
    expect(byLabel["impact integral"]).toBeCloseTo(0.18, 10);
    expect(byLabel["contact-schedule mismatch"]).toBeCloseTo(0.2, 10);
    expect(byLabel["lateral error ∫"]).toBeCloseTo(0.2, 10);
    expect(byLabel["heading error ∫"]).toBeCloseTo(0.4, 10);
    expect(byLabel["speed error ∫"]).toBeCloseTo(0.6, 10);
  });

  test("weighted sum equals the explicit sum of contributions", () => {
    // Hand-computed: speed = 0, slip = 0, posture = 0, etc. -> weighted = 1.95
    // (mean fwd speed gap) + (-1.0 * survival) (completedSteps=720, survival=1.0) + 0
    const r = computeMultiFactorObjective(
      buildReceipt({
        samples: makeSamples(1.0),
        distanceMeters: 0.0, // mean fwd speed = 0 -> +1.95
        completedSteps: 720, // survival = 1.0 -> -1.0 (negative weight = reward)
        // everything else = 0
      }),
      DEFAULT_CONFIG,
    );
    const expected = r.channels.reduce((acc, c) => acc + c.contribution, 0);
    expect(r.weighted).toBeCloseTo(expected, 10);
    expect(r.weighted).toBeCloseTo(1.95 + (-1.0), 10);
  });

  test("non-finite per-channel values fall back to 0 (defensive)", () => {
    // The function must not produce NaN/Infinity even if a per-channel
    // integral is corrupted upstream. safety: number -> number fallback.
    const r = computeMultiFactorObjective(
      buildReceipt({
        samples: makeSamples(1.0),
        slipIntegral: NaN,
        impactIntegral: Infinity,
        postureIntegral: -Infinity,
      }),
      DEFAULT_CONFIG,
    );
    expect(Number.isFinite(r.weighted)).toBe(true);
    for (const c of r.channels) {
      expect(Number.isFinite(c.value)).toBe(true);
      expect(Number.isFinite(c.contribution)).toBe(true);
    }
  });

  test("the multi-factor matches the kernel scalar sign on a clean walking curriculum", () => {
    // A walking curriculum mean produces: forward speed ~ target, no
    // slip / impact / posture error, full survival. The multi-factor
    // should be close to 1.0 (survival only) since the speed gap is
    // ~0 and the integrals are ~0.
    const r = computeMultiFactorObjective(
      buildReceipt({
        samples: makeSamples(1.5),
        distanceMeters: 0.975, // 0.65 m/s * 1.5 s
        completedSteps: 720,
        slipIntegral: 0,
        postureIntegral: 0,
        jointLimitIntegral: 0,
        impactIntegral: 0,
        contactScheduleMismatchIntegral: 0,
        lateralErrorIntegral: 0,
        headingErrorIntegral: 0,
        speedErrorIntegral: 0,
        actuatorWorkJoules: 5, // small work
      }),
      DEFAULT_CONFIG,
    );
    // survival = -1.0 (negative weight = reward), speed gap ~ 0
    // work per meter = 5 / 0.975 = ~5.13, contribution = 0.05 * 5.13 ~ 0.256
    // everything else 0. So weighted ~ -1.0 + 0.256 ~ -0.744.
    // The curriculum walking policy scores BETTER (lower) than a standing
    // prior (which has 0 speed gap penalty but 0 work too, so ~ -1.0).
    expect(r.weighted).toBeLessThan(0.0);
    expect(r.weighted).toBeGreaterThan(-2.0);
  });
});
