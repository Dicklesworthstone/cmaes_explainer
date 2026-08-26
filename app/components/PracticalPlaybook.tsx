"use client";

import { useState, useMemo } from "react";
import {
  Compass,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Calculator,
  Sliders,
  Timer,
  ArrowRight,
  Waves
} from "lucide-react";
import { EncodeDecodePlayground } from "./EncodeDecodePlayground";
import { NoiseExplorer } from "./NoiseExplorer";
import { ConstraintRepairDemo } from "./ConstraintRepairDemo";
import { ActiveCovarianceDemo } from "./ActiveCovarianceDemo";
import { RestartStrategyViewer } from "./RestartStrategyViewer";
import { LatexRenderer } from "./LatexRenderer";

/**
 * Interactive CMA-ES Hyperparameter & Problem Sizing Calculator
 * Computes standard Hansen default parameters and budget estimations based on dimension n, noise, and evaluation cost.
 */
function HyperparameterCalculator() {
  const [dim, setDim] = useState(10);
  const [evalTimeMs, setEvalTimeMs] = useState(500); // 500ms
  const [noiseLevel, setNoiseLevel] = useState<"none" | "mild" | "heavy">("none");
  const [isMultimodal, setIsMultimodal] = useState(false);

  const stats = useMemo(() => {
    const n = dim;
    // Standard Hansen defaults
    const baseLambda = 4 + Math.floor(3 * Math.log(n));
    const noiseMultiplier = noiseLevel === "heavy" ? 3 : noiseLevel === "mild" ? 1.5 : 1.0;
    const lambda = Math.round(baseLambda * noiseMultiplier);
    const mu = Math.floor(lambda / 2);

    // Weights: w_i = ln(mu + 0.5) - ln(i)
    let sumW = 0;
    let sumW2 = 0;
    for (let i = 1; i <= mu; i++) {
      const w = Math.log(mu + 0.5) - Math.log(i);
      sumW += w;
      sumW2 += w * w;
    }
    const muEff = (sumW * sumW) / sumW2;

    // CSA parameters
    const cSigma = (muEff + 2) / (n + muEff + 5);
    const dSigma = 1 + 2 * Math.max(0, Math.sqrt((muEff - 1) / (n + 1)) - 1) + cSigma;
    const chiN = Math.sqrt(n) * (1 - 1 / (4 * n) + 1 / (21 * n * n));

    // Covariance learning rates
    const c1 = 2 / ((n + 1.3) ** 2 + muEff);
    const cMu = Math.min(
      1 - c1,
      (2 * (muEff - 2 + 1 / muEff)) / ((n + 2) ** 2 + muEff)
    );

    // Estimated evaluation budget
    const unimodalGenerations = Math.round(100 + 50 * Math.sqrt(n));
    const totalGenerations = isMultimodal ? unimodalGenerations * 4 : unimodalGenerations;
    const totalEvals = totalGenerations * lambda;
    const totalTimeSec = (totalEvals * evalTimeMs) / 1000;

    const formatTime = (sec: number) => {
      if (sec < 60) return `${sec.toFixed(1)}s`;
      if (sec < 3600) return `${(sec / 60).toFixed(1)} min`;
      if (sec < 86400) return `${(sec / 3600).toFixed(1)} hrs`;
      return `${(sec / 86400).toFixed(1)} days`;
    };

    return {
      lambda,
      baseLambda,
      mu,
      muEff,
      cSigma,
      dSigma,
      chiN,
      c1,
      cMu,
      totalGenerations,
      totalEvals,
      formattedTime: formatTime(totalTimeSec)
    };
  }, [dim, evalTimeMs, noiseLevel, isMultimodal]);

  return (
    <div className="glass-card p-6 md:p-8 space-y-6 border border-sky-500/20 bg-slate-950/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Interactive CMA-ES Hyperparameter & Budget Sizer
            </h3>
            <p className="text-xs text-slate-400">
              Calculate exact Hansen default parameters, population sizes, and wall-clock budgets for your problem dimension
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMultimodal(!isMultimodal)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-[background-color,color,border-color] ${
              isMultimodal
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-900 text-slate-400 border-white/5 hover:text-white"
            }`}
          >
            {isMultimodal ? "Multimodal (IPOP Schedule)" : "Unimodal Search"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Knobs & Inputs */}
        <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-white/5">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center justify-between">
            <span>Problem Parameters</span>
            <span className="text-[0.7rem] text-slate-500 font-mono">Inputs</span>
          </div>

          {/* Dimension Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Dimension (<code className="font-mono text-sky-300">n</code>)</span>
              <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {dim} parameters
              </span>
            </div>
            <input
              type="range"
              aria-label="Problem Dimension n"
              min={2}
              max={100}
              step={1}
              value={dim}
              onChange={(e) => setDim(parseInt(e.target.value, 10))}
              className="w-full accent-sky-400"
            />
          </div>

          {/* Single Evaluation Cost */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Single Evaluation Cost</span>
              <span className="text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {evalTimeMs < 1000 ? `${evalTimeMs} ms` : `${(evalTimeMs / 1000).toFixed(1)} s`}
              </span>
            </div>
            <input
              type="range"
              aria-label="Single Evaluation Wall-Clock Cost"
              min={5}
              max={5000}
              step={25}
              value={evalTimeMs}
              onChange={(e) => setEvalTimeMs(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[0.65rem] text-slate-500 font-mono">
              <span>Fast Surrogate (5ms)</span>
              <span>1s</span>
              <span>Heavy CFD / FEA (5s)</span>
            </div>
          </div>

          {/* Noise Level */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-xs font-medium text-slate-300 block mb-1">Evaluation Noise Level</span>
            <div className="grid grid-cols-3 gap-2">
              {(["none", "mild", "heavy"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setNoiseLevel(lvl)}
                  className={`py-2 text-xs font-semibold rounded-xl capitalize border transition-[background-color,color,border-color,box-shadow] ${
                    noiseLevel === lvl
                      ? "bg-purple-500/20 text-purple-200 border-purple-500/50 shadow-glow-sm"
                      : "bg-slate-900 text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculated Constants & Readouts */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center justify-between">
            <span>Derived Optimal Hyperparameters</span>
            <span className="text-[0.7rem] text-slate-500 font-mono">Formulaic Defaults</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-sky-500/20 space-y-1">
              <div className="text-[0.65rem] text-slate-400 uppercase font-mono flex items-center gap-1">
                <span>Population Size</span> (<LatexRenderer math="\lambda" block={false} />)
              </div>
              <div className="text-lg font-bold text-sky-200 font-mono">{stats.lambda} offspring</div>
              <div className="text-[0.65rem] text-slate-400 font-mono">
                <LatexRenderer math="\lambda = 4 + \lfloor 3 \ln(n) \rfloor" block={false} />
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/20 space-y-1">
              <div className="text-[0.65rem] text-slate-400 uppercase font-mono flex items-center gap-1">
                <span>Parent Elites</span> (<LatexRenderer math="\mu" block={false} />)
              </div>
              <div className="text-lg font-bold text-emerald-200 font-mono">{stats.mu} elites</div>
              <div className="text-[0.65rem] text-slate-400 font-mono">
                <LatexRenderer math={`\\mu_{\\text{eff}} \\approx ${stats.muEff.toFixed(2)}`} block={false} />
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-purple-500/20 space-y-1">
              <div className="text-[0.65rem] text-slate-400 uppercase font-mono flex items-center gap-1">
                <span>Rank-1 Rate</span> (<LatexRenderer math="c_1" block={false} />)
              </div>
              <div className="text-base font-bold text-purple-200 font-mono">{stats.c1.toFixed(4)}</div>
              <div className="text-[0.65rem] text-slate-400 font-mono">
                <LatexRenderer math={`c_\\mu \\approx ${stats.cMu.toFixed(4)}`} block={false} />
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-amber-500/20 space-y-1">
              <div className="text-[0.65rem] text-slate-400 uppercase font-mono">Est. Wall-Clock Time</div>
              <div className="text-lg font-bold text-amber-200 font-mono">{stats.formattedTime}</div>
              <div className="text-[0.62rem] text-slate-500 font-mono">~{stats.totalEvals.toLocaleString()} evals</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="font-bold text-sky-200 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
              <span>Zero-Hyperparameter Principle</span>
            </div>
            <p>
              Unlike stochastic gradient descent (which requires meticulously tuning learning rates, momentum, decay schedules, and weight decay for every model), CMA-ES computes all internal learning rates purely as deterministic functions of dimension <LatexRenderer math="n" block={false} />.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PracticalPlaybook() {
  return (
    <div className="space-y-8">
      {/* Sizer & Calculator */}
      <HyperparameterCalculator />

      <div className="glass-card p-6">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-sky-300 mb-6">
          <ShieldCheck className="h-4 w-4" />
          <span>Practical Playbook: Constraints, Noise, Budgets</span>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 text-sm">
          <div className="rounded-2xl border border-sky-500/10 bg-sky-500/5 p-5">
            <div className="mb-3 text-xs font-bold text-sky-200 uppercase tracking-wide">Constraints & Bounds</div>
            <ul className="space-y-2.5 text-slate-300 text-[0.85rem] list-disc pl-4 marker:text-sky-500">
              <li>Work in an unconstrained space; logit/tanh to map back; or clip/reflect at bounds.</li>
              <li>Categories: carve [0,1] into intervals, quantize late; keeps search smoother.</li>
              <li>Hard constraints: add rank-based penalties; repair samples instead of rejecting.</li>
            </ul>
          </div>
          
          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5">
            <div className="mb-3 text-xs font-bold text-emerald-200 uppercase tracking-wide">Noise & Budgets</div>
             <ul className="space-y-2.5 text-slate-300 text-[0.85rem] list-disc pl-4 marker:text-emerald-500">
              <li>For noisy f: enlarge λ, reevaluate elites, average top-k, or use active updates.</li>
              <li>Budgeting: λ ≈ 4 + floor(3 log n); expect ~50–200 generations; restart if stalled.</li>
              <li>Keep seeds and ask/tell logs so you can replay and debug; determinism saves days.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-xs font-medium text-sky-200">
          <Waves className="h-3.5 w-3.5" />
          <span>Rule of thumb: If each eval costs hours, invest in full covariance.</span>
        </div>
      </div>

      <div className="space-y-12">
        <EncodeDecodePlayground />
        <NoiseExplorer />
        <ConstraintRepairDemo />
        <ActiveCovarianceDemo />
        <RestartStrategyViewer />
      </div>
    </div>
  );
}
