"use client";

import { Sparkles, Share2 } from "lucide-react";

export function CommunitySplit() {
  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm">
      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wide text-sky-200">
        <Share2 className="h-4 w-4" />
        Two optimization worlds that barely talk
      </div>
      <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3">
          <div className="text-[0.78rem] font-semibold text-sky-200">GECCO / black-box camp</div>
          <ul className="mt-2 space-y-1 text-[0.82rem] text-slate-300">
            <li>Evolution strategies, EDAs, CMA-ES, cross-entropy, kriging surrogates.</li>
            <li>Benchmarks: simulators, robotics, combinatorial beasts.</li>
            <li>Assumes “no gradients, limited budget” as the norm.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3">
          <div className="text-[0.78rem] font-semibold text-emerald-200">NeurIPS / deep-learning camp</div>
          <ul className="mt-2 space-y-1 text-[0.82rem] text-slate-300">
            <li>Backprop, SGD/Adam, differentiable everything.</li>
            <li>Knows Bayesian opt & Hyperband; often misses ES/EDA playbook.</li>
            <li>Huge compute, but still hits non-differentiable pockets.</li>
          </ul>
        </div>
      </div>
      <div className="mt-3 text-[0.82rem] text-slate-300">
        These worlds keep re-inventing each other (see NES vs CMA-ES; JEPA vibes with “optimize a
        distribution”). Bridging them is low-hanging fruit: if it’s a black box, reach for CMA-ES
        before rolling custom sweeps.
      </div>
      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[0.75rem] text-emerald-100">
        <Sparkles className="h-3.5 w-3.5" />
        Tweet-size takeaway: “CMA-ES is just natural gradients on a Gaussian search distribution.”
      </div>
    </div>
  );
}
