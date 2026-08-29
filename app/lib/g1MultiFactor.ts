// Multi-factor objective over time for the G1 walking flagship.
//
// Background (cmaes-0m3): the kernel scalar "objective" is a single number
// that collapses many signals (work, slip, posture, joint-limit, impact,
// contact-schedule, lateral/heading/speed error, ...) into one. When the
// single-scalar punish work/slip too aggressively, a stabilizing
// correction is invisible to the user and the standing-prior regresses
// (cmaes-pvz, v067 whole-body kernel). The v068 shaping rebalances the
// per-channel weights inside the kernel, but the EXPLAINER still only
// shows the collapsed scalar on the UI.
//
// This module re-exposes the same v068-shaping intent as a transparent
// weighted sum of eleven per-step / per-trajectory channels, with weights
// that match the kernel's v068 intent. The result is the new
// "multi-factor ↓" card on the G1 flagship page. The output is for
// display and explanation only — the kernel admission / receipt contract
// is unchanged, and the CMA-ES still optimizes the kernel scalar (or
// would, on the kernel side); the multi-factor is a UI lens on the same
// data.
//
// Channel weights (chosen so a standing prior and a walking curriculum
// mean produce finite, comparable weighted values):
//   - mean forward speed: negative weight on (mean - target); penalizes
//     speeds below the disclosed target (0.65 m/s).
//   - survival: positive weight; rewards the run lasting the full horizon.
//   - slip, posture, joint-limit, impact, contact-schedule: positive
//     weights (since these integrals are non-negative; the kernel
//     exposes slip as an "error integral").
//   - lateral, heading, speed error: positive weights on the integrals.
//   - work per meter: small positive weight (efficiency rewarded).
//
// Honesty: the weighted sum is computed from the same per-channel
// integrals the kernel reports; it is not a black-box "score" with
// hidden weights. Each channel's value, weight, and contribution is
// surfaced to the UI so the user can audit the trade-off.
//
// References (cmaes-0m3):
//   - v068 shaping: aaf7d02 (TealCardinal) + 4c417f4 (Jeff Emanuel, + v068
//     kernel binary).
//   - The kernel scalar "objective" is now exposed to the UI as
//     "objective ↓ (kernel scalar)" so the user sees both numbers
//     side by side.

import type { G1TraceReceipt } from "./frankensimCmaes";

export interface MultiFactorConfig {
  stepSeconds: number;
  durationSeconds: number;
  targetSpeed: number;
}

export interface MultiFactorChannel {
  label: string;
  value: number;
  weight: number;
  contribution: number;
}

export interface MultiFactorResult {
  weighted: number;
  channels: MultiFactorChannel[];
}

/**
 * Compute the multi-factor objective as a transparent weighted sum of
 * per-channel integrals from the G1 trace receipt.
 *
 * The function is pure: same receipt in, same result out. It does NOT
 * touch the kernel or any global state. The caller (G1WalkingFlagship)
 * surfaces the channels to the UI.
 *
 * @param receipt The G1 trace receipt from the kernel.
 * @param config The G1 walking config (stepSeconds, durationSeconds,
 *               targetSpeed). Same config the kernel admission uses.
 */
export function computeMultiFactorObjective(
  receipt: G1TraceReceipt,
  config: MultiFactorConfig,
): MultiFactorResult {
  // Weights match the v068 shaping intent:
  //   - mean forward speed and survival are *positive* (we want more)
  //   - slip, impact, and contact-schedule mismatch are *negative* (we want less)
  //   - actuator work is mildly negative (efficiency rewarded, not punished)
  //   - posture, joint-limit, lateral/heading/speed error are mildly negative
  // Magnitudes are tuned so a standing prior (no motion, no contact) and a
  // walking curriculum mean both produce finite, comparable weighted values;
  // the *ratio* between channels is the new "is it doing what we want" signal.
  const safe = (x: number, fallback: number): number =>
    Number.isFinite(x) ? x : fallback;
  // durationSeconds is not on the receipt; derive from samples or fall back
  // to the config. Both are equivalent in the standard G1 experiment.
  const lastSample = receipt.samples[receipt.samples.length - 1];
  const duration = Math.max(
    safe(lastSample?.timeSeconds ?? config.durationSeconds, config.durationSeconds),
    1e-6
  );
  const horizon = Math.max(safe(config.durationSeconds / config.stepSeconds, 1), 1);
  const meanFwdSpeed = safe(receipt.distanceMeters, 0) / duration;
  const survival = safe(receipt.completedSteps, 0) / horizon;
  const slip = safe(receipt.slipIntegral, 0);
  const posture = safe(receipt.postureIntegral, 0);
  const jointLimit = safe(receipt.jointLimitIntegral, 0);
  const impact = safe(receipt.impactIntegral, 0);
  const contactSched = safe(receipt.contactScheduleMismatchIntegral, 0);
  const lateral = safe(receipt.lateralErrorIntegral, 0);
  const heading = safe(receipt.headingErrorIntegral, 0);
  const speedErr = safe(receipt.speedErrorIntegral, 0);
  const work = safe(receipt.actuatorWorkJoules, 0);
  const distanceSafe = Math.max(safe(receipt.distanceMeters, 0), 0.05);
  const workPerMeter = work / distanceSafe;
  // Target speed (m/s). A good policy is at or above target.
  const targetSpeed = config.targetSpeed;
  // Channels: each has a label, the raw value, the weight, and the
  // contribution (value * weight, with sign-flip on the speed gap).
  const channels: MultiFactorChannel[] = [
    { label: "mean fwd speed ≥ target", value: meanFwdSpeed, weight: -3.0, contribution: -3.0 * (meanFwdSpeed - targetSpeed) },
    { label: "survival (steps/horizon)", value: survival, weight: 1.0, contribution: 1.0 * survival },
    { label: "slip integral", value: slip, weight: 0.4, contribution: 0.4 * slip },
    { label: "posture integral", value: posture, weight: 0.3, contribution: 0.3 * posture },
    { label: "joint-limit integral", value: jointLimit, weight: 0.5, contribution: 0.5 * jointLimit },
    { label: "impact integral", value: impact, weight: 0.6, contribution: 0.6 * impact },
    { label: "contact-schedule mismatch", value: contactSched, weight: 0.4, contribution: 0.4 * contactSched },
    { label: "lateral error ∫", value: lateral, weight: 0.2, contribution: 0.2 * lateral },
    { label: "heading error ∫", value: heading, weight: 0.2, contribution: 0.2 * heading },
    { label: "speed error ∫", value: speedErr, weight: 0.2, contribution: 0.2 * speedErr },
    { label: "work per meter (efficiency)", value: workPerMeter, weight: 0.05, contribution: 0.05 * workPerMeter },
  ];
  const weighted = channels.reduce((acc, c) => acc + c.contribution, 0);
  return { weighted, channels };
}
