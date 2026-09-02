"use client";

// Walk Quality Comparison Card (cmaes-wqc-1).
//
// Side-by-side BEFORE → AFTER view of the G1 walk-quality metrics.
// Curriculum (the disclosed pre-trained phase-basis mean) is the
// reference; the user's currently-displayed trace is the candidate.
// Every metric that's interesting to a walking policy — distance,
// mean forward speed, completion %, stability, multi-factor
// objective, actuator work, slip, posture, joint limits — is
// shown with the per-channel delta. The "Δ" verdict is
// improvement: percentage change from curriculum to candidate, with
// green for "good direction" and red for the opposite.

import { useMemo } from "react";
import {
  computeMultiFactorObjective,
  type MultiFactorChannel,
  type MultiFactorResult,
} from "../lib/g1MultiFactor";
import {
  DEFAULT_G1_WALKING_CONFIG,
  type G1TraceReceipt,
} from "../lib/frankensimCmaes";

export interface WalkQualityComparisonProps {
  /** Pre-trained curriculum mean — the "before" reference. */
  curriculum: G1TraceReceipt | null;
  /** Currently displayed trace (could be curriculum, stabilizer, or optimized). */
  candidate: G1TraceReceipt | null;
  /** Caption shown in the candidate header. */
  candidateLabel?: string;
  /** Caption for the curriculum row. */
  curriculumLabel?: string;
  /** Task-aware title shown above the comparison. */
  title?: string;
  /** Compact mode: drop the multi-factor breakdown (used on narrow screens). */
  compact?: boolean;
}

interface DerivedMetrics {
  durationSeconds: number;
  distanceMeters: number;
  meanForwardSpeedMps: number;
  completionPercent: number;
  /** Stability score 0..100: composite of base-height, tilt, and survival. */
  stabilityScore: number;
  /** Sub-scores of stability, kept for the detail annotation. */
  uprightPercent: number;
  noReversePercent: number;
  survivalPercent: number;
  /** mean forward speed 0..1 of the target. */
  speedVsTarget: number;
  multiFactor: MultiFactorResult | null;
}

function derive(receipt: G1TraceReceipt | null): DerivedMetrics | null {
  if (!receipt) return null;
  const cfg = DEFAULT_G1_WALKING_CONFIG;
  const duration = receipt.samples[receipt.samples.length - 1]?.timeSeconds ?? cfg.durationSeconds;
  const distance = receipt.distanceMeters;
  const meanSpeed = duration > 0 ? distance / duration : 0;
  const completion = (receipt.completedSteps / 720) * 100;
  // Stability: 60% survival + 25% upright + 15% no-reverse. Each sub-score
  // is normalized 0..1 then weighted. `no-reverse` is 1 if backwardDistance
  // is 0, decaying linearly to 0 at 0.5m of backtracking.
  const survival = Math.max(0, Math.min(1, receipt.completedSteps / 720));
  const tiltRadians = Math.asin(Math.min(1, receipt.maximumTiltSine));
  // 0° tilt = 1, 90° tilt = 0, smooth falloff.
  const upright = Math.max(0, 1 - tiltRadians / (Math.PI / 2));
  const noReverse = Math.max(0, 1 - receipt.backwardDistanceMeters / 0.5);
  const stabilityScore = 100 * (0.6 * survival + 0.25 * upright + 0.15 * noReverse);
  return {
    durationSeconds: duration,
    distanceMeters: distance,
    meanForwardSpeedMps: meanSpeed,
    completionPercent: Math.min(100, completion),
    stabilityScore,
    uprightPercent: upright * 100,
    noReversePercent: noReverse * 100,
    survivalPercent: survival * 100,
    speedVsTarget: Math.max(0, Math.min(1.5, meanSpeed / cfg.targetSpeed)),
    multiFactor: computeMultiFactorObjective(receipt, cfg),
  };
}

interface MetricRow {
  label: string;
  /** Higher is better. */
  higherBetter: boolean;
  /** Format the value. */
  format: (m: DerivedMetrics | null) => string;
  /** Optional secondary annotation shown as a smaller line. */
  detail?: (m: DerivedMetrics | null) => string | null;
  /** Scalar for delta computation (must return the same number both
   *  columns to make the comparison meaningful). */
  scalar: (m: DerivedMetrics | null) => number | null;
}

const PRIMARY_ROWS: MetricRow[] = [
  {
    label: "Multi-factor objective ↓",
    higherBetter: false,
    format: (m) => (m?.multiFactor ? m.multiFactor.weighted.toExponential(2) : "—"),
    detail: (m) => (m?.multiFactor ? `${m.multiFactor.channels.length} channels weighted` : null),
    scalar: (m) => m?.multiFactor?.weighted ?? null,
  },
  {
    label: "Forward displacement",
    higherBetter: true,
    format: (m) => (m ? `${m.distanceMeters.toFixed(2)} m` : "—"),
    detail: (m) => (m ? `${m.durationSeconds.toFixed(1)} s experiment` : null),
    scalar: (m) => m?.distanceMeters ?? null,
  },
  {
    label: "Mean forward speed",
    higherBetter: true,
    format: (m) => (m ? `${m.meanForwardSpeedMps.toFixed(2)} m/s` : "—"),
    detail: (m) =>
      m
        ? `${(m.speedVsTarget * 100).toFixed(0)}% of ${DEFAULT_G1_WALKING_CONFIG.targetSpeed.toFixed(2)} m/s target`
        : null,
    scalar: (m) => m?.meanForwardSpeedMps ?? null,
  },
  {
    label: "Horizon completion",
    higherBetter: true,
    format: (m) => (m ? `${m.completionPercent.toFixed(0)}%` : "—"),
    detail: (_m) => "of 720 integrated physics steps",
    scalar: (m) => m?.completionPercent ?? null,
  },
  {
    label: "Stability score",
    higherBetter: true,
    format: (m) => (m ? `${m.stabilityScore.toFixed(0)} / 100` : "—"),
    detail: (m) =>
      m
        ? `survival ${m.survivalPercent.toFixed(0)}% · upright ${m.uprightPercent.toFixed(0)}% · no-reverse ${m.noReversePercent.toFixed(0)}%`
        : null,
    scalar: (m) => m?.stabilityScore ?? null,
  },
];

const CHANNEL_DETAIL_LIMIT = 6;

function formatChannelValue(value: number): string {
  if (Math.abs(value) >= 100) return value.toFixed(0);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(3);
}

/** Returns the percent improvement from baseline to candidate. Positive means
 *  moved in the "good" direction (higher for higher-better, lower for
 *  lower-better). */
function improvementPct(
  baseline: number | null,
  candidate: number | null,
  higherBetter: boolean,
): number | null {
  if (baseline === null || candidate === null) return null;
  if (baseline === 0) {
    if (candidate === 0) return 0;
    return null;
  }
  if (!higherBetter) {
    return ((baseline - candidate) / baseline) * 100;
  }
  return ((candidate - baseline) / baseline) * 100;
}

function arrowGlyph(pct: number | null): string {
  if (pct === null) return "—";
  if (pct > 5) return "▲";
  if (pct < -5) return "▼";
  return "≈";
}

function pctColor(pct: number | null, higherBetter: boolean): string {
  if (pct === null) return "text-slate-500";
  const good = higherBetter ? pct > 0 : pct < 0;
  if (Math.abs(pct) < 1) return "text-slate-400";
  return good ? "text-emerald-300" : "text-rose-300";
}

function MetricRowView({
  row,
  curriculumMetrics,
  candidateMetrics,
  compact,
}: {
  row: MetricRow;
  curriculumMetrics: DerivedMetrics | null;
  candidateMetrics: DerivedMetrics | null;
  compact: boolean;
}) {
  const pct = improvementPct(row.scalar(curriculumMetrics), row.scalar(candidateMetrics), row.higherBetter);
  return (
    <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.5fr)] items-baseline gap-2 border-b border-white/5 py-2 text-xs last:border-b-0">
      <div className="flex flex-col">
        <span className="font-semibold text-slate-200">{row.label}</span>
        {!compact && row.detail ? (
          <span className="text-[0.62rem] text-slate-500">{row.detail(candidateMetrics)}</span>
        ) : null}
      </div>
      <span className="font-mono text-slate-300">{row.format(curriculumMetrics)}</span>
      <span className="font-mono text-cyan-100">{row.format(candidateMetrics)}</span>
      <span className={`text-right font-mono ${pctColor(pct, row.higherBetter)}`}>
        {arrowGlyph(pct)} {pct === null ? "—" : `${Math.abs(pct).toFixed(1)}%`}
      </span>
    </div>
  );
}

export function WalkQualityComparison({
  curriculum,
  candidate,
  candidateLabel = "Current trace",
  curriculumLabel = "Curriculum mean",
  title = "Policy quality comparison",
  compact = false,
}: WalkQualityComparisonProps) {
  const curriculumMetrics = useMemo(() => derive(curriculum), [curriculum]);
  const candidateMetrics = useMemo(() => derive(candidate), [candidate]);

  // Overall verdict: best score across the primary metrics.
  const verdicts = useMemo(() => {
    if (!curriculumMetrics || !candidateMetrics) return null;
    let improvements = 0;
    let regressions = 0;
    let flat = 0;
    for (const row of PRIMARY_ROWS) {
      const pct = improvementPct(
        row.scalar(curriculumMetrics),
        row.scalar(candidateMetrics),
        row.higherBetter,
      );
      if (pct === null) continue;
      if (Math.abs(pct) < 1) flat++;
      else if (pct > 0) improvements++;
      else regressions++;
    }
    return { improvements, regressions, flat };
  }, [curriculumMetrics, candidateMetrics]);

  if (!curriculum || !candidate) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-xs text-slate-500">
        Policy comparison needs a reference trace and a current trace.
        Both will appear once the standing-prior preview and the first optimization both run.
      </div>
    );
  }

  // Per-channel comparison (multi-factor breakdown) — only when not compact.
  const channelRows = (() => {
    if (compact) return [] as Array<{ channel: MultiFactorChannel; baseline: number | null }>;
    const a = curriculumMetrics?.multiFactor?.channels ?? [];
    const b = candidateMetrics?.multiFactor?.channels ?? [];
    return a.map((channel, i) => ({
      channel,
      baseline: b[i]?.value ?? null,
    }));
  })();

  return (
    <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/70 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">
          {title}
        </h4>
        {verdicts ? (
          <p className="text-[0.65rem] text-slate-400">
            <span className="text-emerald-300">{verdicts.improvements} better</span>
            {" · "}
            <span className="text-slate-300">{verdicts.flat} flat</span>
            {" · "}
            <span className="text-rose-300">{verdicts.regressions} worse</span>
            {" across the 5 primary metrics"}
          </p>
        ) : null}
      </div>
      <div className="mt-2 grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.5fr)] items-baseline gap-2 pb-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-slate-500">
        <span>Metric</span>
        <span className="font-mono">{curriculumLabel}</span>
        <span className="font-mono text-cyan-300">{candidateLabel}</span>
        <span className="text-right">Δ</span>
      </div>
      {PRIMARY_ROWS.map((row) => (
        <MetricRowView
          key={row.label}
          row={row}
          curriculumMetrics={curriculumMetrics}
          candidateMetrics={candidateMetrics}
          compact={compact}
        />
      ))}
      {!compact && channelRows.length > 0 ? (
        <details className="mt-3" open>
          <summary className="cursor-pointer text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400 hover:text-slate-200">
            Multi-factor channel breakdown ({channelRows.length})
          </summary>
          <div className="mt-2 space-y-1">
            {channelRows.slice(0, CHANNEL_DETAIL_LIMIT).map(({ channel, baseline }) => {
              const cand = channel.value;
              const delta = baseline !== null ? cand - baseline : null;
              return (
                <div
                  key={channel.label}
                  className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.4fr)] items-baseline gap-2 py-0.5 text-[0.65rem]"
                >
                  <span className="text-slate-300">{channel.label}</span>
                  <span className="font-mono text-slate-400">{formatChannelValue(cand)}</span>
                  <span className="font-mono text-cyan-100">
                    {baseline === null ? "—" : formatChannelValue(baseline)}
                  </span>
                  <span className="text-right font-mono">
                    {delta === null ? "—" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </details>
      ) : null}
    </div>
  );
}
