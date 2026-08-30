"use client";

import React from "react";
import { Sliders, Zap, Shield, Activity } from "lucide-react";
import type { MultiFactorResult, MultiFactorChannel } from "../lib/g1MultiFactor";

export interface RobotPersonalityPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  gaitStyle: string;
  accent: string;
  icon: typeof Zap;
  weights: {
    speedWeight: number;
    uprightWeight: number;
    energyWeight: number;
    slipWeight: number;
    impactWeight: number;
  };
}

export const PERSONALITY_PRESETS: RobotPersonalityPreset[] = [
  {
    id: "cautious-monk",
    name: "The Cautious Monk",
    badge: "Maximum Balance",
    description: "Prioritizes posture stability and minimal energy expenditure. Takes deliberate, grounded strides.",
    gaitStyle: "Slow, upright, low-torque",
    accent: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
    icon: Shield,
    weights: {
      speedWeight: 1.0,
      uprightWeight: 4.0,
      energyWeight: 3.0,
      slipWeight: 2.0,
      impactWeight: 1.5,
    },
  },
  {
    id: "olympic-sprinter",
    name: "The Olympic Sprinter",
    badge: "Dynamic Forward",
    description: "Maximizes forward displacement velocity with aggressive pelvic forward lean.",
    gaitStyle: "High cadence, dynamic thrust",
    accent: "text-cyan-300 border-cyan-400/30 bg-cyan-500/10",
    icon: Zap,
    weights: {
      speedWeight: 4.5,
      uprightWeight: 1.0,
      energyWeight: 0.5,
      slipWeight: 1.0,
      impactWeight: 0.8,
    },
  },
  {
    id: "glass-floor",
    name: "The Glass-Floor Walker",
    badge: "Zero Impact",
    description: "Penalizes foot impact spikes and ground slip to traverse delicate, slick surfaces safely.",
    gaitStyle: "Soft landing, zero slip",
    accent: "text-violet-300 border-violet-400/30 bg-violet-500/10",
    icon: Activity,
    weights: {
      speedWeight: 1.5,
      uprightWeight: 2.0,
      energyWeight: 1.0,
      slipWeight: 5.0,
      impactWeight: 5.0,
    },
  },
];

interface G1ObjectiveEqualizerProps {
  multiFactor: MultiFactorResult | null;
  selectedPreset: string;
  onSelectPreset: (preset: RobotPersonalityPreset) => void;
}

export function G1ObjectiveEqualizer({
  multiFactor,
  selectedPreset,
  onSelectPreset,
}: G1ObjectiveEqualizerProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-md">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            Multi-Factor Objective Equalizer & Personality Sculptor
          </span>
        </div>
        <span className="text-[0.68rem] text-slate-400">
          How the 11 reward channels sculpt robot behavior
        </span>
      </div>

      {/* 2. Personality Archetypes */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {PERSONALITY_PRESETS.map((p) => {
          const isSelected = selectedPreset === p.id;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPreset(p)}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                isSelected
                  ? "border-cyan-400/60 bg-cyan-950/40 ring-1 ring-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.12)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${p.accent}`}>
                    {p.badge}
                  </span>
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <h4 className="mt-2 text-sm font-bold text-white">{p.name}</h4>
                <p className="mt-1 text-[0.72rem] leading-relaxed text-slate-400">
                  {p.description}
                </p>
              </div>

              <div className="mt-3 border-t border-white/5 pt-2">
                <span className="text-[0.65rem] text-slate-400 font-mono">
                  Gait: {p.gaitStyle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Live 11-Channel Equalizer Bar Display */}
      {multiFactor && (
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Live Channel Contributions (Weighted Sum: {multiFactor.weighted.toFixed(2)})
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
                    <span>w={ch.weight.toFixed(1)}</span>
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
