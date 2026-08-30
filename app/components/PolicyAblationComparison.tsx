"use client";

import React, { useEffect, useState } from "react";
import {
  loadAblationInputs,
  runMeasuredAblation,
  type AblationPairResult,
} from "../lib/policyAblationComparison";

/**
 * Side-by-side ablation between two policy architectures for the G1
 * walking explainer. MEASURED contract (cmaes-ablation-real):
 *   1. CMA-ES side — a real live search (105-param phase-basis linear
 *      policy, 2,400 rollouts on G1TrainEnv) re-run per seed selection.
 *   2. Transformer side — REAL trained weights (fs-g1-train, PPO + Muon,
 *      native Rust) inferred in-browser and rolled out on the same env at
 *      the same 720-step horizon. Golden-vector parity + receipt
 *      cross-checks live in tests/policyAblationComparison.test.ts.
 * Known limits, disclosed in-card: the stand-in env models no push,
 * joint-limit, or slip telemetry, so those rows read "—".
 */
export function PolicyAblationComparison() {
  const [seed, setSeed] = useState<number>(42);
  const [state, setState] = useState<{
    loadedForSeed: number | null;
    result: AblationPairResult | null;
    error: string | null;
  }>({ loadedForSeed: null, result: null, error: null });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const inputs = await loadAblationInputs();
        const measured = runMeasuredAblation(inputs, seed);
        if (!cancelled) setState({ loadedForSeed: seed, result: measured, error: null });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        if (!cancelled) setState((prev) => ({ ...prev, error: message }));
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [seed]);

  const { result, error } = state;
  const pending = state.loadedForSeed !== seed;
  const cma = result?.cmaesReceipt;
  const tf = result?.transformerReceipt;

  if (error) {
    return (
      <div className="bg-neutral-900 border border-red-900 rounded-xl p-5 text-neutral-100 font-mono text-sm max-w-5xl mx-auto">
        <p className="text-red-400 text-xs">
          Ablation failed to load its measured artifacts ({error}). The weight
          file and training receipt must exist under
          public/robots/g1/transformer/ — nothing is faked in their absence.
        </p>
      </div>
    );
  }

  if (pending || !result || !cma || !tf) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-neutral-100 font-mono text-sm max-w-5xl mx-auto">
        <p className="text-neutral-400 text-xs animate-pulse">
          Measuring both policies (live CMA-ES search + 720-step transformer
          rollout in this browser)…
        </p>
      </div>
    );
  }

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
            Both sides measured live: CMA-ES searched in this browser;
            transformer weights trained natively (fs-g1-train, PPO+Muon) and
            inferred here — same env, same 720-step horizon.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-neutral-400">Search seed:</label>
            <select
              className="bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
            >
              <option value={42}>Seed #42 (Default)</option>
              <option value={101}>Seed #101</option>
              <option value={202}>Seed #202</option>
              <option value={505}>Seed #505</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-level Efficiency Callout — both numbers measured */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-lg text-center">
          <div className="text-xs text-neutral-400">Sample Budget Ratio (measured)</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {result.efficiencyMultiplier >= 1
              ? `${result.efficiencyMultiplier.toLocaleString("en-US", { maximumFractionDigits: 1 })}× fewer`
              : `${(1 / result.efficiencyMultiplier).toLocaleString("en-US", { maximumFractionDigits: 1 })}× more`}
          </div>
          <div className="text-[10px] text-neutral-500">
            CMA-ES {cma.trainingSamplesRequired.toLocaleString()} vs transformer{" "}
            {tf.trainingSamplesRequired.toLocaleString()} env steps — whichever
            direction it falls
          </div>
        </div>

        <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-lg text-center">
          <div className="text-xs text-neutral-400">Inference Latency</div>
          <div className="text-lg font-bold text-cyan-400 mt-0.5">
            {cma.inferenceLatencyMicros.toFixed(2)}µs vs{" "}
            {tf.inferenceLatencyMicros.toFixed(1)}µs
          </div>
          <div className="text-[10px] text-neutral-500">
            Linear 105-param matvec vs {tf.parameterCount.toLocaleString()}-param causal decoder
          </div>
        </div>

        <div className="bg-neutral-950/80 border border-neutral-800 p-3 rounded-lg text-center">
          <div className="text-xs text-neutral-400">Cost of Transport</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">
            {cma.costOfTransportCoT > 0 ? cma.costOfTransportCoT.toFixed(3) : "—"} vs{" "}
            {tf.costOfTransportCoT > 0 ? tf.costOfTransportCoT.toFixed(3) : "—"}
          </div>
          <div className="text-[10px] text-neutral-500">
            Work per meter — lower is more efficient
          </div>
        </div>
      </div>

      {/* Side-by-Side Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PolicyCard
          accent="emerald"
          title="Phase-Basis Linear Residual (CMA-ES)"
          badge={`${cma.parameterCount.toLocaleString()} Parameters • Searched Live`}
          receipt={cma}
        />
        <PolicyCard
          accent="indigo"
          title="Learned Causal Transformer (PPO + Muon)"
          badge={`${tf.parameterCount.toLocaleString()} Parameters • Trained + Exported`}
          receipt={tf}
        />
      </div>

      <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
        <div className="text-neutral-300 font-bold text-[10px] uppercase">Provenance</div>
        <p className="leading-relaxed">
          Transformer: trained by{" "}
          <code className="text-neutral-200">fs-g1-train/examples/train_ablation.rs</code> —
          PPO (clipped) + GAE, Muon/Adam, full 240-step episodes on the exact
          Rust port of G1TrainEnv; {tf.trainingSamplesRequired.toLocaleString()} env
          steps consumed. Weights + receipt:
          public/robots/g1/transformer/. Both cards roll out on the disclosed
          kinematic stand-in (no push/joint-limit/slip telemetry — those rows
          read “—”). Training wallclock is host-specific; sample counts are exact.
        </p>
        <p className="leading-relaxed">
          Disclosed: for this stand-in env the best checkpoint is a
          (near-)zero-action policy — the env&rsquo;s known optimum — reached via
          zero-initialized policy heads and confirmed rather than beaten by
          further PPO updates. The measured budgets, survival, and speeds are
          real either way; the training receipt carries the full story.
        </p>
      </div>
    </div>
  );
}

type CardAccent = "emerald" | "indigo";

function PolicyCard({
  accent,
  title,
  badge,
  receipt: r,
}: {
  accent: CardAccent;
  title: string;
  badge: string;
  receipt: AblationPairResult["cmaesReceipt"];
}) {
  const border = accent === "emerald" ? "border-emerald-500/40" : "border-indigo-500/40";
  const text = accent === "emerald" ? "text-emerald-300" : "text-indigo-300";
  const chip =
    accent === "emerald"
      ? "bg-emerald-950 text-emerald-300 border-emerald-500/30"
      : "bg-indigo-950 text-indigo-300 border-indigo-500/30";
  const strong = accent === "emerald" ? "text-emerald-400 font-bold" : "text-indigo-300 font-bold";

  return (
    <div className={`bg-neutral-950/70 border ${border} rounded-xl p-4 space-y-3 shadow-lg`}>
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <span className={`text-xs font-bold ${text}`}>{title}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded border ${chip}`}>{badge}</span>
      </div>

      <div className="space-y-2 text-xs">
        <MetricRow label="Completed Steps">
          <span className={strong}>
            {r.completedSteps} / {r.totalStepsBudget}
          </span>
        </MetricRow>
        <MetricRow label="Distance Traveled">
          <span className="text-neutral-200">{r.distanceTraveledMeters.toFixed(2)} m</span>
        </MetricRow>
        <MetricRow label="Average Speed">
          <span className="text-neutral-200">{r.averageSpeedMps.toFixed(2)} m/s</span>
        </MetricRow>
        <MetricRow label="Actuator Work (Energy)">
          <span className="text-neutral-200">{r.actuatorWorkJoules.toFixed(1)} J</span>
        </MetricRow>
        <MetricRow label="Cost of Transport">
          <span className="text-neutral-200">
            {r.costOfTransportCoT > 0 ? r.costOfTransportCoT.toFixed(3) : "—"}
          </span>
        </MetricRow>
        <MetricRow label="Survival / Safety Rate">
          <span
            className={
              r.survivalRatePercent >= 100
                ? "text-emerald-400 font-semibold"
                : "text-amber-400 font-semibold"
            }
          >
            {r.survivalRatePercent.toFixed(0)}%
          </span>
        </MetricRow>
        <MetricRow label="Objective (total reward)">
          <span className="text-neutral-200">{r.objectiveScore.toFixed(1)}</span>
        </MetricRow>
        <MetricRow label="Training Samples">
          <span className="text-neutral-200">{r.trainingSamplesRequired.toLocaleString()}</span>
        </MetricRow>
        <MetricRow label="Joint Limits / Slip / Clearance">
          <span className="text-neutral-500">— (not modeled here)</span>
        </MetricRow>
      </div>
    </div>
  );
}

function MetricRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-400">{label}:</span>
      {children}
    </div>
  );
}
