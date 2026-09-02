export const G1_OWNER_PUSH_ANGLE_DEGREES = 90;

export type G1PushVisualizationSource = "none" | "owner" | "manual-preview";

export interface G1PushVisualizationInput {
  manualPreviewActive: boolean;
  manualAngleDegrees: number;
  manualImpulseNewtonSeconds: number;
  ownerChallengeActive: boolean;
  sampleTimeSeconds: number | null;
  ownerPushStartSeconds: number | null;
  ownerPushEndSeconds: number | null;
  ownerImpulseNewtonSeconds: number;
}

export interface G1PushVisualization {
  source: G1PushVisualizationSource;
  fraction: number;
  angleDegrees: number;
  impulseNewtonSeconds: number;
}

function normalizedAngleDegrees(value: number): number {
  if (!Number.isFinite(value)) return G1_OWNER_PUSH_ANGLE_DEGREES;
  return ((value % 360) + 360) % 360;
}

function nonNegativeFinite(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

/**
 * Resolve the arrow shown over a G1 trace without letting display controls
 * rewrite the admitted owner experiment. A manual vector is an explicit
 * visualization preview. The real playback pulse always uses the owner's
 * fixed +Y direction and the impulse measured by the trace receipt.
 */
export function resolveG1PushVisualization(
  input: G1PushVisualizationInput,
): G1PushVisualization {
  if (input.manualPreviewActive) {
    return {
      source: "manual-preview",
      fraction: 0.95,
      angleDegrees: normalizedAngleDegrees(input.manualAngleDegrees),
      impulseNewtonSeconds: nonNegativeFinite(
        input.manualImpulseNewtonSeconds,
        15,
      ),
    };
  }

  const start = input.ownerPushStartSeconds;
  const end = input.ownerPushEndSeconds;
  const time = input.sampleTimeSeconds;
  if (
    input.ownerChallengeActive &&
    time !== null &&
    start !== null &&
    end !== null &&
    Number.isFinite(time) &&
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    end > start &&
    time > start &&
    time < end
  ) {
    const phase = (time - start) / (end - start);
    return {
      source: "owner",
      fraction: Math.sin(Math.PI * phase),
      angleDegrees: G1_OWNER_PUSH_ANGLE_DEGREES,
      impulseNewtonSeconds: nonNegativeFinite(
        input.ownerImpulseNewtonSeconds,
        0,
      ),
    };
  }

  return {
    source: "none",
    fraction: 0,
    angleDegrees: G1_OWNER_PUSH_ANGLE_DEGREES,
    impulseNewtonSeconds: nonNegativeFinite(input.ownerImpulseNewtonSeconds, 0),
  };
}
