"use client";

import React from "react";
import { Sliders, Zap, Shield, Activity, Gauge } from "lucide-react";
import type {
  MultiFactorResult,
  MultiFactorChannel,
  MultiFactorWeights,
} from "../lib/g1MultiFactor";

export interface ReceiptAnalysisPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  lensStyle: string;
  accent: string;
  icon: typeof Zap;
  weights: Pick<
    MultiFactorWeights,
    | "meanForwardSpeed"
    | "postureIntegral"
    | "workPerMeter"
    | "slipIntegral"
    | "impactIntegral"
  >;
}

export const RECEIPT_ANALYSIS_PRESETS: ReceiptAnalysisPreset[] = [
  {
    id: "owner-receipt",
    name: "Documented Baseline",
    badge: "Default Lens",
    description:
      "Shows the documented receipt decomposition without changing the owner kernel scalar.",
    lensStyle: "Balanced receipt audit",
    accent: "text-slate-200 border-slate-300/30 bg-slate-400/10",
    icon: Gauge,
    weights: {
      meanForwardSpeed: -3.0,
      postureIntegral: 0.3,
      workPerMeter: 0.00005,
      slipIntegral: 0.4,
      impactIntegral: 0.6,
    },
  },
  {
    id: "cautious-monk",
    name: "The Cautious Monk",
    badge: "Maximum Balance",
    description:
      "Prioritizes posture stability and minimal energy expenditure in the receipt comparison.",
    lensStyle: "Stability and efficiency emphasis",
    accent: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
    icon: Shield,
    weights: {
      meanForwardSpeed: -1.0,
      postureIntegral: 4.0,
      workPerMeter: 0.0001,
      slipIntegral: 2.0,
      impactIntegral: 1.5,
    },
  },
  {
    id: "olympic-sprinter",
    name: "The Olympic Sprinter",
    badge: "Dynamic Forward",
    description:
      "Emphasizes forward displacement velocity without claiming the recorded policy changed.",
    lensStyle: "Forward-speed emphasis",
    accent: "text-cyan-300 border-cyan-400/30 bg-cyan-500/10",
    icon: Zap,
    weights: {
      meanForwardSpeed: -4.5,
      postureIntegral: 1.0,
      workPerMeter: 0.00001,
      slipIntegral: 1.0,
      impactIntegral: 0.8,
    },
  },
  {
    id: "glass-floor",
    name: "The Glass-Floor Walker",
    badge: "Zero Impact",
    description:
      "Emphasizes reported foot-impact spikes and ground slip in the post-hoc comparison.",
    lensStyle: "Slip and impact emphasis",
    accent: "text-violet-300 border-violet-400/30 bg-violet-500/10",
    icon: Activity,
    weights: {
      meanForwardSpeed: -1.5,
      postureIntegral: 2.0,
      workPerMeter: 0.00002,
      slipIntegral: 5.0,
      impactIntegral: 5.0,
    },
  },
];

interface G1ObjectiveEqualizerProps {
  multiFactor: MultiFactorResult | null;
  selectedPreset: string;
  onSelectPreset: (preset: ReceiptAnalysisPreset) => void;
}

export function G1ObjectiveEqualizer({
  multiFactor,
  selectedPreset,
  onSelectPreset,
}: G1ObjectiveEqualizerProps) {
  const formatWeight = (weight: number): string =>
    Math.abs(weight) < 0.01 && weight !== 0 ? weight.toExponential(1) : weight.toFixed(1);

  return (
    <div
      id="g1-receipt-objective-equalizer"
      aria-label="G1 receipt objective equalizer"
      className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-md"
    >
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            Receipt Objective Equalizer
          </span>
        </div>
        <span className="text-[0.68rem] text-slate-400">
          Reweight the same 11 reported channels; owner optimization is unchanged
        </span>
      </div>

      {/* 2. Receipt-analysis presets */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {RECEIPT_ANALYSIS_PRESETS.map((p) => {
          const isSelected = selectedPreset === p.id;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPreset(p)}
              data-receipt-lens-id={p.id}
              aria-pressed={isSelected}
              aria-label={`Analyze this receipt with ${p.name} (${p.badge})`}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all min-h-[44px] ${
                isSelected
                  ? "border-cyan-400/60 bg-cyan-950/40 ring-1 ring-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.12)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${p.accent}`}
                  >
                    {p.badge}
                  </span>
                  <Icon className="h-4 w-4 text-slate-300" />
                </div>
                <h4 className="mt-2 text-sm font-bold text-white">{p.name}</h4>
                <p className="mt-1 text-[0.72rem] leading-relaxed text-slate-300">
                  {p.description}
                </p>
              </div>

              <div className="mt-3 border-t border-white/5 pt-2">
                <span className="text-[0.65rem] text-slate-300 font-mono">
                  Lens: {p.lensStyle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[0.7rem] leading-5 text-slate-400">
        These presets recompute the visible receipt analysis only. They do not alter the owner&apos;s
        fixed task objective, rerun CMA-ES, or claim that the rendered gait changed.
      </p>

      {/* 3. Live 11-Channel Equalizer Bar Display */}
      {multiFactor && (
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span
              aria-label={`Selected-lens contributions, weighted sum ${multiFactor.weighted.toFixed(2)}`}
              className="text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Selected-Lens Contributions (Weighted Sum: {multiFactor.weighted.toFixed(2)})
            </span>
            <span className="text-[0.68rem] font-mono text-cyan-300">
              Target Speed Gap: {multiFactor.channels[0]?.value.toFixed(2)} m/s
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {multiFactor.channels.map((ch: MultiFactorChannel) => {
              const absContrib = Math.abs(ch.contribution);
              const barPct = Math.min(100, Math.max(5, absContrib * 18));
              const isPositivePenalty = ch.contribution > 0;

              return (
                <div
                  key={ch.label}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[0.68rem]">
                    <span className="font-semibold text-slate-300 truncate" title={ch.label}>
                      {ch.label}
                    </span>
                    <span className="font-mono text-slate-400">
                      {ch.value.toFixed(2)}
                    </span>
                  </div>

                  {/* Visual Glowing EQ Meter Bar */}
                  <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${barPct}%` }}
                      className={`h-full rounded-full transition-all duration-300 ${
                        isPositivePenalty
                          ? "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                          : "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      }`}
                    />
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[0.62rem] text-slate-500 font-mono">
                    <span>w={formatWeight(ch.weight)}</span>
                    <span className={isPositivePenalty ? "text-rose-300" : "text-emerald-300"}>
                      {ch.contribution > 0 ? `+${ch.contribution.toFixed(2)}` : ch.contribution.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
