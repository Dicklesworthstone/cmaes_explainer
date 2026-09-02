import { describe, expect, test } from "bun:test";
import {
  G1_OWNER_PUSH_ANGLE_DEGREES,
  resolveG1PushVisualization,
  type G1PushVisualizationInput,
} from "./g1PushVisualization";

const OWNER_PULSE: G1PushVisualizationInput = {
  manualPreviewActive: false,
  manualAngleDegrees: 270,
  manualImpulseNewtonSeconds: 45,
  ownerChallengeActive: true,
  sampleTimeSeconds: 0.625,
  ownerPushStartSeconds: 0.55,
  ownerPushEndSeconds: 0.7,
  ownerImpulseNewtonSeconds: 2.29,
};

describe("resolveG1PushVisualization", () => {
  test("keeps real owner playback independent of manual preview selections", () => {
    const resolved = resolveG1PushVisualization(OWNER_PULSE);

    expect(resolved.source).toBe("owner");
    expect(resolved.fraction).toBeCloseTo(1, 12);
    expect(resolved.angleDegrees).toBe(G1_OWNER_PUSH_ANGLE_DEGREES);
    expect(resolved.impulseNewtonSeconds).toBe(2.29);
  });

  test("marks a manual vector as a distinct display preview", () => {
    const resolved = resolveG1PushVisualization({
      ...OWNER_PULSE,
      manualPreviewActive: true,
      manualAngleDegrees: -90,
      manualImpulseNewtonSeconds: 25,
    });

    expect(resolved).toEqual({
      source: "manual-preview",
      fraction: 0.95,
      angleDegrees: 270,
      impulseNewtonSeconds: 25,
    });
  });

  test("does not invent an owner arrow on flat ground or pulse boundaries", () => {
    expect(
      resolveG1PushVisualization({
        ...OWNER_PULSE,
        ownerChallengeActive: false,
      }).source,
    ).toBe("none");
    expect(
      resolveG1PushVisualization({ ...OWNER_PULSE, sampleTimeSeconds: 0.55 })
        .source,
    ).toBe("none");
    expect(
      resolveG1PushVisualization({ ...OWNER_PULSE, sampleTimeSeconds: 0.7 })
        .source,
    ).toBe("none");
  });

  test("fails closed for non-finite manual and owner display values", () => {
    const manual = resolveG1PushVisualization({
      ...OWNER_PULSE,
      manualPreviewActive: true,
      manualAngleDegrees: Number.NaN,
      manualImpulseNewtonSeconds: Number.POSITIVE_INFINITY,
    });
    expect(manual.angleDegrees).toBe(G1_OWNER_PUSH_ANGLE_DEGREES);
    expect(manual.impulseNewtonSeconds).toBe(15);

    const owner = resolveG1PushVisualization({
      ...OWNER_PULSE,
      ownerImpulseNewtonSeconds: Number.NaN,
    });
    expect(owner.source).toBe("owner");
    expect(owner.impulseNewtonSeconds).toBe(0);
  });
});
