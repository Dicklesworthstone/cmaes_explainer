"use client";

import { useMemo } from "react";
import {
  ledgerImprovementFactor,
  type LearningLedgerPoint,
} from "../lib/g1LearningLedger";

/**
 * What the robot is actually getting better AT, in units a person can judge.
 *
 * The convergence chart next to this one plots the objective, which is a
 * weighted sum with no units: it can fall for reasons nobody watching can see.
 * This panel reports the physical facts from the same receipt — how far the
 * robot walked, how long it stayed up, what it spent — and leads with the one
 * that answers "is it learning": how far it travels per kilojoule of actuator
 * work. A gait that goes further on the same energy is unambiguously better,
 * and that is a claim the numbers here can support on their own.
 */
export interface LearningLedgerProps {
  /** Measurements taken from replayed best policies, oldest first. */
  points: readonly LearningLedgerPoint[];
  width?: number;
  height?: number;
}

function formatMeters(value: number): string {
  return `${value.toFixed(2)} m`;
}

function formatSeconds(value: number): string {
  return `${value.toFixed(2)} s`;
}

function formatEnergy(joules: number): string {
  return joules >= 1000 ? `${(joules / 1000).toFixed(2)} kJ` : `${joules.toFixed(0)} J`;
}

function formatEconomy(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(2)} m/kJ`;
}

/**
 * Axis labels for a range that can span decades.
 *
 * Economy on this objective sits near 0.03 m/kJ, where a fixed single decimal
 * prints every tick as "0.0" and the axis says nothing. Scale the precision to
 * the magnitude instead.
 */
function formatAxisValue(value: number): string {
  const magnitude = Math.abs(value);
  if (magnitude === 0) return "0";
  if (magnitude < 0.01) return value.toFixed(4);
  if (magnitude < 0.1) return value.toFixed(3);
  if (magnitude < 10) return value.toFixed(2);
  return value.toFixed(0);
}

function formatSpeed(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(2)} m/s`;
}

/** "×2.4 further per kJ" — or nothing at all when the multiple is meaningless. */
function formatFactor(factor: number | null): string | null {
  if (factor === null) return null;
  if (factor >= 1.005) return `×${factor.toFixed(2)}`;
  if (factor <= 0.995) return `×${factor.toFixed(2)}`;
  return "unchanged";
}

function Stat({
  label,
  value,
  hint,
  emphasis = false,
}: {
  label: string;
  value: string;
  hint?: string | null;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 ${
        emphasis
          ? "border-emerald-300/25 bg-emerald-950/30"
          : "border-white/10 bg-white/[0.025]"
      }`}
    >
      <div className="text-[0.58rem] uppercase tracking-wider text-slate-400">{label}</div>
      <div
        className={`mt-0.5 font-mono text-sm ${emphasis ? "text-emerald-200" : "text-slate-100"}`}
      >
        {value}
      </div>
      {hint ? <div className="text-[0.58rem] text-slate-500">{hint}</div> : null}
    </div>
  );
}

export function LearningLedger({ points, width = 600, height = 132 }: LearningLedgerProps) {
  const seed = points.length > 0 ? points[0] : null;
  const latest = points.length > 0 ? points[points.length - 1] : null;

  const chart = useMemo(() => {
    // Only points with a defined economy can be plotted; a robot that fell
    // over has no m/kJ, and interpolating across that gap would draw a line
    // through a gait that never existed.
    const plottable = points.filter(
      (point): point is LearningLedgerPoint & { metersPerKilojoule: number } =>
        point.metersPerKilojoule !== null,
    );
    if (plottable.length < 2) return null;
    const economies = plottable.map((p) => p.metersPerKilojoule);
    const generations = plottable.map((p) => p.generation);
    const ecoMin = Math.min(...economies);
    const ecoMax = Math.max(...economies);
    const ecoRange = ecoMax - ecoMin || Math.abs(ecoMax) || 1;
    const genMin = generations[0];
    const genMax = generations[generations.length - 1];
    const genRange = genMax - genMin || 1;
    const margin = { top: 14, right: 12, bottom: 18, left: 46 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const x = (generation: number) =>
      margin.left + ((generation - genMin) / genRange) * chartWidth;
    const y = (value: number) =>
      margin.top +
      chartHeight -
      ((value - (ecoMin - ecoRange * 0.12)) / (ecoRange * 1.24)) * chartHeight;
    const line = plottable
      .map((point, index) => `${index === 0 ? "M" : "L"}${x(point.generation).toFixed(1)},${y(point.metersPerKilojoule).toFixed(1)}`)
      .join(" ");
    // Speed tracking rides its own scale so both curves are readable at once:
    // one is m/kJ, the other a fraction, and forcing them onto one axis would
    // flatten whichever happens to be smaller.
    const fractions = plottable
      .map((point) => point.speedTrackingFraction)
      .filter((value): value is number => value !== null);
    const trackMin = fractions.length > 0 ? Math.min(...fractions) : 0;
    const trackMax = fractions.length > 0 ? Math.max(...fractions) : 1;
    const trackRange = trackMax - trackMin || Math.abs(trackMax) || 1;
    const trackY = (value: number) =>
      margin.top +
      chartHeight -
      ((value - (trackMin - trackRange * 0.12)) / (trackRange * 1.24)) * chartHeight;
    const trackLine =
      fractions.length === plottable.length && fractions.length >= 2
        ? plottable
            .map(
              (point, index) =>
                `${index === 0 ? "M" : "L"}${x(point.generation).toFixed(1)},${trackY(point.speedTrackingFraction as number).toFixed(1)}`,
            )
            .join(" ")
        : null;
    const area = `${line} L${x(genMax).toFixed(1)},${(margin.top + chartHeight).toFixed(1)} L${x(genMin).toFixed(1)},${(margin.top + chartHeight).toFixed(1)} Z`;
    return {
      line,
      trackLine,
      trackMin,
      trackMax,
      area,
      x,
      y,
      genMin,
      genMax,
      ecoMin,
      ecoMax,
      margin,
      chartHeight,
      points: plottable,
    };
  }, [points, width, height]);

  if (!latest || !seed) return null;

  const economyFactor = ledgerImprovementFactor(seed, latest, "metersPerKilojoule");
  const distanceFactor = ledgerImprovementFactor(seed, latest, "distanceMeters");
  const economyHint =
    latest.generation === seed.generation ? "seed baseline" : formatFactor(economyFactor);
  const distanceHint =
    latest.generation === seed.generation ? "seed baseline" : formatFactor(distanceFactor);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-slate-300">
          What the gait actually does
        </span>
        <span className="font-mono text-[0.6rem] text-slate-500">
          {latest.generation === 0
            ? "policy seed"
            : `best policy · gen ${latest.generation.toLocaleString()}`}
        </span>
      </div>

      {/* Two columns at every width: this panel lives in the narrow control
          column, where a viewport-keyed 4-up breakpoint puts "Reach per
          energy" on three lines. */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Stat
          label="Reach per energy"
          value={formatEconomy(latest.metersPerKilojoule)}
          hint={economyHint}
          emphasis
        />
        <Stat
          label="Distance"
          value={formatMeters(latest.distanceMeters)}
          hint={distanceHint}
        />
        <Stat
          label="Speed vs command"
          value={
            latest.speedTrackingFraction === null
              ? formatSpeed(latest.speedMetersPerSecond)
              : `${(latest.speedTrackingFraction * 100).toFixed(0)}%`
          }
          hint={
            latest.targetSpeedMetersPerSecond > 0
              ? `${formatSpeed(latest.speedMetersPerSecond)} of ${latest.targetSpeedMetersPerSecond.toFixed(2)} commanded`
              : formatSpeed(latest.speedMetersPerSecond)
          }
        />
        <Stat
          label="Energy spent"
          value={formatEnergy(latest.energyJoules)}
          hint={`over ${formatSeconds(latest.walkSeconds)} upright`}
        />
      </div>

      {chart ? (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mt-2 w-full"
          role="img"
          aria-label={`Forward distance per kilojoule from generation ${chart.genMin} to ${chart.genMax}, ${formatEconomy(chart.ecoMin)} to ${formatEconomy(chart.ecoMax)}`}
        >
          <defs>
            <linearGradient id="ledger-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(52 211 153)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="rgb(52 211 153)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={chart.area} fill="url(#ledger-fill)" />
          <path
            d={chart.line}
            fill="none"
            stroke="rgb(52 211 153)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {chart.trackLine ? (
            <path
              d={chart.trackLine}
              fill="none"
              stroke="rgb(103 232 249)"
              strokeWidth="1.3"
              strokeDasharray="3 2"
              strokeLinejoin="round"
            />
          ) : null}
          {chart.points.length <= 40
            ? chart.points.map((point) => (
                <circle
                  key={point.generation}
                  cx={chart.x(point.generation)}
                  cy={chart.y(point.metersPerKilojoule)}
                  r="1.9"
                  fill="rgb(16 185 129)"
                />
              ))
            : null}
          <text x="4" y={chart.margin.top + 4} className="fill-slate-500" fontSize="8">
            {formatAxisValue(chart.ecoMax)}
          </text>
          <text
            x="4"
            y={chart.margin.top + chart.chartHeight}
            className="fill-slate-500"
            fontSize="8"
          >
            {formatAxisValue(chart.ecoMin)}
          </text>
          <text
            x={chart.margin.left}
            y={height - 5}
            className="fill-slate-500"
            fontSize="8"
          >
            gen {chart.genMin}
          </text>
          <text
            x={width - chart.margin.right}
            y={height - 5}
            textAnchor="end"
            className="fill-slate-500"
            fontSize="8"
          >
            gen {chart.genMax}
          </text>
        </svg>
      ) : (
        <p className="mt-2 text-[0.6rem] leading-4 text-slate-500">
          Metres per kilojoule is plotted once two replayed policies have both
          covered forward ground. A policy that falls has no economy to report,
          which is the honest answer rather than a zero.
        </p>
      )}

      {chart?.trackLine ? (
        <div className="flex gap-3 text-[0.58rem] text-slate-500">
          <span className="text-emerald-300">— metres per kilojoule</span>
          <span className="text-cyan-300">
            ·· share of commanded speed ({(chart.trackMin * 100).toFixed(0)}–
            {(chart.trackMax * 100).toFixed(0)}%)
          </span>
        </div>
      ) : null}
      <p className="mt-1 text-[0.6rem] leading-4 text-slate-500">
        Read from the same owner receipt as the objective, so these cannot
        disagree with it. Distance per kilojoule of actuator work is the
        mass-free form of cost of transport: how far this gait gets on a fixed
        energy budget.
      </p>
    </div>
  );
}
