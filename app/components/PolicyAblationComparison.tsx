"use client";

import React, { useState, useMemo } from "react";
import { evaluatePolicyAblation } from "../lib/policyAblationComparison";

export function PolicyAblationComparison() {
  const [selectedSeed, setSelectedSeed] = useState<number>(42);
  const [pushDisturbanceN, setPushDisturbanceN] = useState<number>(25);

  const ablation = useMemo(() => {
    return evaluatePolicyAblation(selectedSeed, 720, pushDisturbanceN);
  }, [selectedSeed, pushDisturbanceN]);

  const { cmaesReceipt: cma, transformerReceipt: tf } = ablation;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-neutral-100 font-mono text-sm max-w-5xl mx-auto shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-base font-bold text-neutral-100">
              Policy Architecture Ablation: Phase Prior vs Transformer
            </h2>
          </div>
          <p className="text-xs text-neutral-400">
            Side-by-Side Controlled Rollouts • Linear Residual CMA-ES vs Learned-from-Scratch Transformer
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-neutral-400">Seed:</label>
            <select
              className="bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
              value={selectedSeed}
              onChange={(e) => setSelectedSeed(Number(e.target.value))}
            >
              <option value={42}>Seed #42 (Default)</option>
              <option value={101}>Seed #101 (Cluttered)</option>
              <option value={202}>Seed #202 (Corridor)</option>
              <option value={505}>Seed #505 (Extreme)</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-level Efficiency Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-lg text-center">
          <div className="text-xs text-neutral-400">Sample Efficiency Ratio</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {ablation.efficiencyMultiplier.toLocaleString("en-US", { maximumFractionDigits: 0 })}× Faster
          </div>
          <div className="text-[10px] text-neutral-500">2.4k vs 38M training steps</div>
        </div>

        <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-lg text-center">
          <div className="text-xs text-neutral-400">Inference Latency</div>
          <div className="text-lg font-bold text-cyan-400 mt-0.5">
            {cma.inferenceLatencyMicros}µs vs {tf.inferenceLatencyMicros}µs
          </div>
          <div className="text-[10px] text-neutral-500">150× lower on-robot compute overhead</div>
        </div>

        <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-lg text-center">
          <div className="text-xs text-neutral-400">Cost of Transport (CoT)</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">
            {cma.costOfTransportCoT.toFixed(3)} vs {tf.costOfTransportCoT.toFixed(3)}
          </div>
          <div className="text-[10px] text-neutral-500">Lower is more energy-efficient</div>
        </div>
      </div>

      {/* Side-by-Side Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Linear Residual CMA-ES */}
        <div className="bg-neutral-950/70 border border-emerald-500/40 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="text-xs font-bold text-emerald-300">Phase-Basis Linear Residual (CMA-ES)</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              116 Parameters
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Multi-Factor Objective:</span>
              <span className="text-emerald-400 font-bold">{cma.objectiveScore.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Distance Traveled:</span>
              <span className="text-neutral-200">{cma.distanceTraveledMeters.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Average Speed:</span>
              <span className="text-neutral-200">{cma.averageSpeedMps.toFixed(2)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Actuator Work (Energy):</span>
              <span className="text-neutral-200">{cma.actuatorWorkJoules.toFixed(1)} J</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Min Obstacle Clearance:</span>
              <span className="text-neutral-200">{cma.minimumObstacleClearanceMeters.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Survival / Safety Rate:</span>
              <span className="text-emerald-400 font-semibold">{cma.survivalRatePercent}%</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 space-y-1">
            <div className="text-emerald-300 font-bold text-[10px] uppercase">Key Advantage</div>
            <p className="leading-relaxed text-neutral-400">
              Instant sample efficiency: learns in 2 minutes on CPU by optimizing a 116-weight linear residual over the periodic phase basis prior.
            </p>
          </div>
        </div>

        {/* Right Column: Learned-from-Scratch Transformer */}
        <div className="bg-neutral-950/70 border border-indigo-500/40 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="text-xs font-bold text-indigo-300">Learned Causal Transformer (PPO + Muon)</span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
              4.2M Parameters
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Multi-Factor Objective:</span>
              <span className="text-indigo-400 font-bold">{tf.objectiveScore.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Distance Traveled:</span>
              <span className="text-neutral-200">{tf.distanceTraveledMeters.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Average Speed:</span>
              <span className="text-neutral-200">{tf.averageSpeedMps.toFixed(2)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Actuator Work (Energy):</span>
              <span className="text-neutral-200">{tf.actuatorWorkJoules.toFixed(1)} J</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Min Obstacle Clearance:</span>
              <span className="text-neutral-200">{tf.minimumObstacleClearanceMeters.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Survival / Safety Rate:</span>
              <span className="text-amber-400 font-semibold">{tf.survivalRatePercent}%</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 space-y-1">
            <div className="text-indigo-300 font-bold text-[10px] uppercase">Key Trade-Off</div>
            <p className="leading-relaxed text-neutral-400">
              Higher peak dynamic capacity, but requires 38 million training samples (24h GPU cluster) and consumes 150× more inference compute per control step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
