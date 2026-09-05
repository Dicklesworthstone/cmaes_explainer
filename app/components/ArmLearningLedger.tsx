"use client";

import { useMemo } from "react";
import {
  armAccuracyImprovement,
  armEnergyImprovement,
  armRefusalReason,
  type ArmLedgerPoint,
} from "../lib/armLearningLedger";

/**
 * What the arm is actually getting better at.
 *
 * The walking flagship reports distance per kilojoule because that is how you
 * judge a gait. A pick-and-place is judged differently: it either put the
 * object where it was asked or it did not, and the interesting number is how
 * close. So this leads with placement error in millimetres and says plainly
 * whether the owner accepted the placement, with energy and grasp timing
 * beside it.
 */
export interface ArmLearningLedgerProps {
  points: readonly ArmLedgerPoint[];
  /** Wall-clock seconds actually spent searching, across all start/stop cycles. */
  trainingSeconds?: number;
  width?: number;
  height?: number;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function formatMillimetres(meters: number): string {
  return `${(meters * 1000).toFixed(1)} mm`;
}

function formatEnergy(joules: number): string {
  return joules >= 1000 ? `${(joules / 1000).toFixed(2)} kJ` : `${joules.toFixed(0)} J`;
}

function formatFactor(factor: number | null): string | null {
  if (factor === null) return null;
  if (factor >= 1.005) return `×${factor.toFixed(2)} better`;
  if (factor <= 0.995) return `×${(1 / factor).toFixed(2)} worse`;
  return "unchanged";
}

function Stat({
  label,
  value,
  hint,
  tone = "plain",
}: {
  label: string;
  value: string;
  hint?: string | null;
  tone?: "plain" | "good" | "bad";
}) {
  const border =
    tone === "good"
      ? "border-emerald-300/25 bg-emerald-950/30"
      : tone === "bad"
        ? "border-amber-300/25 bg-amber-950/25"
        : "border-white/10 bg-white/[0.025]";
  const text =
    tone === "good" ? "text-emerald-200" : tone === "bad" ? "text-amber-200" : "text-slate-100";
  return (
    <div className={`rounded-xl border px-3 py-2 ${border}`}>
      <div className="text-[0.58rem] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`mt-0.5 font-mono text-sm ${text}`}>{value}</div>
      {hint ? <div className="text-[0.58rem] text-slate-500">{hint}</div> : null}
    </div>
  );
}

export function ArmLearningLedger({
  points,
  trainingSeconds = 0,
  width = 600,
  height = 120,
}: ArmLearningLedgerProps) {
  const seed = points.length > 0 ? points[0] : null;
  const latest = points.length > 0 ? points[points.length - 1] : null;

  const chart = useMemo(() => {
    if (points.length < 2) return null;
    const errors = points.map((point) => point.placementErrorMeters);
    const generations = points.map((point) => point.generation);
    const errMin = Math.min(...errors);
    const errMax = Math.max(...errors);
    const errRange = errMax - errMin || Math.abs(errMax) || 1;
    const genMin = generations[0];
    const genMax = generations[generations.length - 1];
    const genRange = genMax - genMin || 1;
    const margin = { top: 12, right: 12, bottom: 16, left: 48 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const x = (generation: number) =>
      margin.left + ((generation - genMin) / genRange) * chartWidth;
    // Error falls as the arm improves, so a DOWNWARD line is progress; the axis
    // is not inverted, because a chart that reads backwards teaches the wrong
    // thing about what the search is doing.
    const y = (value: number) =>
      margin.top +
      chartHeight -
      ((value - (errMin - errRange * 0.15)) / (errRange * 1.3)) * chartHeight;
    const line = points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"}${x(point.generation).toFixed(1)},${y(point.placementErrorMeters).toFixed(1)}`,
      )
      .join(" ");
    return { line, x, y, genMin, genMax, errMin, errMax, margin, chartHeight, points };
  }, [points, width, height]);

  if (!latest || !seed) return null;

  const accuracy = armAccuracyImprovement(seed, latest);
  const energy = armEnergyImprovement(seed, latest);
  const isSeed = latest.generation === seed.generation;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-slate-300">
          What the arm actually does
        </span>
        <span className="font-mono text-[0.6rem] text-slate-500">
          {isSeed
            ? "policy seed"
            : `gen ${latest.generation.toLocaleString()}${trainingSeconds >= 1 ? ` · ${formatDuration(trainingSeconds)} trained` : ""}`}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <Stat
          label="Placement error"
          value={formatMillimetres(latest.placementErrorMeters)}
          hint={isSeed ? "seed baseline" : formatFactor(accuracy)}
          tone="good"
        />
        <Stat
          label="Owner verdict"
          value={latest.placed ? "placed" : "refused"}
          hint={latest.placed ? "collision-safe" : armRefusalReason(latest)}
          tone={latest.placed ? "plain" : "bad"}
        />
        <Stat
          label="Energy spent"
          value={formatEnergy(latest.energyJoules)}
          hint={isSeed ? "seed baseline" : formatFactor(energy)}
        />
        <Stat
          label="Grasp"
          value={latest.everGrasped ? `${latest.firstGraspSeconds.toFixed(2)} s` : "—"}
          hint={
            latest.everGrasped
              ? `held ${latest.graspSeconds.toFixed(2)} s · lifted ${(latest.liftMeters * 100).toFixed(0)} cm`
              : "no grasp established"
          }
        />
      </div>

      {chart ? (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mt-2 w-full"
          role="img"
          aria-label={`Placement error from generation ${chart.genMin} to ${chart.genMax}, ${formatMillimetres(chart.errMax)} to ${formatMillimetres(chart.errMin)}`}
        >
          <path
            d={chart.line}
            fill="none"
            stroke="rgb(52 211 153)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {chart.points.map((point) => (
            <circle
              key={point.generation}
              cx={chart.x(point.generation)}
              cy={chart.y(point.placementErrorMeters)}
              r="2"
              // A refused placement is marked, so a falling error line cannot
              // quietly describe rollouts the owner did not accept.
              fill={point.placed ? "rgb(16 185 129)" : "rgb(251 146 60)"}
            />
          ))}
          <text x="4" y={chart.margin.top + 4} className="fill-slate-500" fontSize="8">
            {(chart.errMax * 1000).toFixed(0)} mm
          </text>
          <text
            x="4"
            y={chart.margin.top + chart.chartHeight}
            className="fill-slate-500"
            fontSize="8"
          >
            {(chart.errMin * 1000).toFixed(0)} mm
          </text>
          <text x={chart.margin.left} y={height - 4} className="fill-slate-500" fontSize="8">
            gen {chart.genMin}
          </text>
          <text
            x={width - chart.margin.right}
            y={height - 4}
            textAnchor="end"
            className="fill-slate-500"
            fontSize="8"
          >
            gen {chart.genMax}
          </text>
        </svg>
      ) : null}

      {!isSeed ? (
        <p className="mt-2 text-[0.66rem] leading-4 text-slate-300">
          {trainingSeconds >= 1 ? `In ${formatDuration(trainingSeconds)} and ` : "In "}
          {latest.generation.toLocaleString()} generations, the arm went from{" "}
          <span className="font-mono text-slate-100">
            {formatMillimetres(seed.placementErrorMeters)}
          </span>{" "}
          to{" "}
          <span className="font-mono text-emerald-200">
            {formatMillimetres(latest.placementErrorMeters)}
          </span>{" "}
          from the goal
          {seed.placed !== latest.placed
            ? latest.placed
              ? ", and the owner now accepts the placement it previously refused"
              : ", but the owner no longer accepts the placement"
            : latest.placed
              ? ", with both the initial and current placement accepted"
              : ", and the owner still refuses the placement"}
          .
        </p>
      ) : null}
      <p className="mt-1 text-[0.6rem] leading-4 text-slate-500">
        Placement error is the distance from the object&apos;s final centre to
        the goal, read from the same owner receipt as the objective. Amber points
        are rollouts the owner refused — a falling error line means nothing if
        the placement was not accepted. A task can improve its accuracy for
        thousands of generations and stay refused: a solid body is something the
        search is blocked BY, not a penalty it can trade against.
      </p>
    </div>
  );
}
