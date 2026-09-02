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
// This module re-exposes the historical v068 shaping intent as a
// transparent weighted sum of eleven reported channels. Its default
// weights preserve that documented receipt decomposition; optional
// analysis presets may reweight a declared subset after the rollout.
// The result is the "multi-factor ↓" card on the G1 flagship page. It is
// display and explanation only: the current owner task may use later
// shaping, its admission / receipt contract is unchanged, and CMA-ES
// still optimizes the kernel scalar.
//
// Channel weights and sign convention (chosen so a standing prior and a
// walking curriculum mean produce finite, comparable weighted values;
// CMA-ES MINIMIZES the weighted sum):
//   - mean forward speed: weight = -3.0, contribution = -3.0 * (mean -
//     targetSpeed). Sign: positive contribution when speed < target
//     (penalty for slow), zero at target, negative when speed > target
//     (reward for fast). The negative weight inverts the sign of
//     (mean - target) so the user's mental model of "below target = bad"
//     maps to a positive contribution number.
//   - survival: weight = -1.0, contribution = -1.0 * (steps / horizon).
//     The negative weight is REQUIRED: a positive weight would make
//     "die early" preferred (lower survival = lower total = better),
//     which inverts the intent. The negative weight makes "live longer"
//     preferred (more survival = more negative contribution = better).
//   - slip, posture, joint-limit, impact, contact-schedule, lateral,
//     heading, speed error: positive weight on the non-negative error
//     integral. Positive contribution = penalty.
//   - work per meter: small positive weight 0.00005; positive contribution
//     = penalty for wasted work.
// Sign convention (uniform across all channels): larger (more positive)
// contribution = worse. The display "multi-factor ↓" means minimize.
// A negative contribution is GOOD (speed above target; longer survival).
// A positive contribution is BAD (slip, impact, etc.).
// (Bug fix history: cmaes-0m3 initially shipped with survival weight
// +1.0, which inverted the survival channel. Fixed in 3e8e0bf.)
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

export interface MultiFactorWeights {
  meanForwardSpeed: number;
  survival: number;
  slipIntegral: number;
  postureIntegral: number;
  jointLimitIntegral: number;
  impactIntegral: number;
  contactScheduleMismatch: number;
  lateralErrorIntegral: number;
  headingErrorIntegral: number;
  speedErrorIntegral: number;
  workPerMeter: number;
}

export const DEFAULT_MULTI_FACTOR_WEIGHTS: Readonly<MultiFactorWeights> = Object.freeze({
  meanForwardSpeed: -3.0,
  survival: -1.0,
  slipIntegral: 0.4,
  postureIntegral: 0.3,
  jointLimitIntegral: 0.5,
  impactIntegral: 0.6,
  contactScheduleMismatch: 0.4,
  lateralErrorIntegral: 0.2,
  headingErrorIntegral: 0.2,
  speedErrorIntegral: 0.2,
  workPerMeter: 0.00005,
});

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
 * @param weightOverrides Optional post-hoc analysis weights. These reweight
 *               receipt channels only; they do not change the owner kernel's
 *               optimization objective.
 */
export function computeMultiFactorObjective(
  receipt: G1TraceReceipt,
  config: MultiFactorConfig,
  weightOverrides: Partial<MultiFactorWeights> = {},
): MultiFactorResult {
  // Weights and sign convention (see header docstring):
  //   - mean forward speed: weight -3.0; contribution inverts the sign of
  //     (mean - target) so a positive contribution = below target = penalty.
  //   - survival: weight -1.0; contribution = -steps/horizon in [-1, 0].
  //   - slip / posture / joint-limit / impact / contact-schedule / lateral /
  //     heading / speed error / work-per-meter: positive weight on a
  //     non-negative integral; positive contribution = penalty.
  // CMA-ES minimizes the weighted sum; larger = worse rollout.
   // Magnitudes are tuned so a standing prior (no motion, no contact) and a
   // walking curriculum mean both produce finite, comparable weighted values;
   // the *ratio* between channels is the new "is it doing what we want" signal.
  const safe = (x: number, fallback: number): number =>
    Number.isFinite(x) ? x : fallback;
  const resolvedWeight = (key: keyof MultiFactorWeights): number =>
    safe(
      weightOverrides[key] ?? DEFAULT_MULTI_FACTOR_WEIGHTS[key],
      DEFAULT_MULTI_FACTOR_WEIGHTS[key],
    );
  const weights: MultiFactorWeights = {
    meanForwardSpeed: resolvedWeight("meanForwardSpeed"),
    survival: resolvedWeight("survival"),
    slipIntegral: resolvedWeight("slipIntegral"),
    postureIntegral: resolvedWeight("postureIntegral"),
    jointLimitIntegral: resolvedWeight("jointLimitIntegral"),
    impactIntegral: resolvedWeight("impactIntegral"),
    contactScheduleMismatch: resolvedWeight("contactScheduleMismatch"),
    lateralErrorIntegral: resolvedWeight("lateralErrorIntegral"),
    headingErrorIntegral: resolvedWeight("headingErrorIntegral"),
    speedErrorIntegral: resolvedWeight("speedErrorIntegral"),
    workPerMeter: resolvedWeight("workPerMeter"),
  };
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
    {
      label: "mean fwd speed ≥ target",
      value: meanFwdSpeed,
      weight: weights.meanForwardSpeed,
      contribution: weights.meanForwardSpeed * (meanFwdSpeed - targetSpeed),
    },
    {
      label: "survival (steps/horizon)",
      value: survival,
      weight: weights.survival,
      contribution: weights.survival * survival,
    },
    {
      label: "slip integral",
      value: slip,
      weight: weights.slipIntegral,
      contribution: weights.slipIntegral * slip,
    },
    {
      label: "posture integral",
      value: posture,
      weight: weights.postureIntegral,
      contribution: weights.postureIntegral * posture,
    },
    {
      label: "joint-limit integral",
      value: jointLimit,
      weight: weights.jointLimitIntegral,
      contribution: weights.jointLimitIntegral * jointLimit,
    },
    {
      label: "impact integral",
      value: impact,
      weight: weights.impactIntegral,
      contribution: weights.impactIntegral * impact,
    },
    {
      label: "contact-schedule mismatch",
      value: contactSched,
      weight: weights.contactScheduleMismatch,
      contribution: weights.contactScheduleMismatch * contactSched,
    },
    {
      label: "lateral error ∫",
      value: lateral,
      weight: weights.lateralErrorIntegral,
      contribution: weights.lateralErrorIntegral * lateral,
    },
    {
      label: "heading error ∫",
      value: heading,
      weight: weights.headingErrorIntegral,
      contribution: weights.headingErrorIntegral * heading,
    },
    {
      label: "speed error ∫",
      value: speedErr,
      weight: weights.speedErrorIntegral,
      contribution: weights.speedErrorIntegral * speedErr,
    },
    {
      label: "work per meter (efficiency)",
      value: workPerMeter,
      weight: weights.workPerMeter,
      contribution: weights.workPerMeter * workPerMeter,
    },
  ];
  const weighted = channels.reduce((acc, c) => acc + c.contribution, 0);
  return { weighted, channels };
}
