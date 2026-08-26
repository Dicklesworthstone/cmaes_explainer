"use client";

import { Share2, Sparkles, Brain, Cpu, ArrowRightLeft, CheckCircle2 } from "lucide-react";

export function CommunitySplit() {
  return (
    <div className="glass-card p-6 md:p-8 space-y-6 border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Two Optimization Worlds: GECCO vs NeurIPS
            </h3>
            <p className="text-xs text-slate-400">
              Why the black-box and deep-learning communities keep reinventing each other
            </p>
          </div>
        </div>

        <span className="text-[0.68rem] font-mono text-sky-300 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 hidden sm:inline-block">
          Convergence of Ideas
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 text-sm">
        {/* GECCO / Black-Box Camp */}
        <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/30 to-slate-950/40 p-6 space-y-4 hover:border-sky-500/40 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide text-sky-300">
              <Cpu className="h-4 w-4" />
              <span>GECCO / Evolutionary Camp</span>
            </div>
            <span className="text-[0.65rem] font-mono text-slate-500">Zero-Order</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The world of Evolution Strategies, Estimation of Distribution Algorithms (EDAs), and Kriging / Gaussian Process surrogates.
          </p>

          <ul className="space-y-2 text-xs text-slate-300 list-disc pl-4 marker:text-sky-400">
            <li><strong>Core Premise:</strong> Evaluations are precious, expensive, and opaque.</li>
            <li><strong>Strength:</strong> Complete invariance to non-linear scalings and discontinuous bounds.</li>
            <li><strong>Benchmark Arena:</strong> Robotics controllers, CFD, structural FEA, aerodynamic design.</li>
          </ul>
        </div>

        {/* NeurIPS / Deep-Learning Camp */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-slate-950/40 p-6 space-y-4 hover:border-emerald-500/40 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide text-emerald-300">
              <Brain className="h-4 w-4" />
              <span>NeurIPS / Deep Learning Camp</span>
            </div>
            <span className="text-[0.65rem] font-mono text-slate-500">First-Order</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The world of reverse-mode automatic differentiation, backpropagation, Adam/SGD, and end-to-end differentiable neural architectures.
          </p>

          <ul className="space-y-2 text-xs text-slate-300 list-disc pl-4 marker:text-emerald-400">
            <li><strong>Core Premise:</strong> Differentiate billions of parameters with massive GPU throughput.</li>
            <li><strong>Blind Spot:</strong> Struggles whenever simulators contain discrete jumps or non-smooth loops.</li>
            <li><strong>Re-invention:</strong> Natural Evolution Strategies (NES) and JEPA distribution matching mirror CMA-ES.</li>
          </ul>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>The Unified Insight</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Both paradigms reach peak mathematical elegance when they abandon raw point-based updates in favor of <strong>optimizing probability distributions with Natural Gradients</strong> under the Fisher Information metric. Bridging these communities unlocks immense leverage for modern AI systems.
        </p>
      </div>
    </div>
  );
}
