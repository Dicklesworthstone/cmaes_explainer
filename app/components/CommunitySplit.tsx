"use client";

import { Sparkles, Share2 } from "lucide-react";

export function CommunitySplit() {
  return (
    <div className="glass-card p-6">
      <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
        <Share2 className="h-4 w-4" />
        <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
          Two optimization worlds
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 text-sm">
        <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-transparent p-5 transition-all hover:border-sky-500/30 hover:shadow-[0_0_20px_rgba(14,165,233,0.1)]">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sky-200">
            GECCO / Black-Box Camp
          </div>
          <ul className="space-y-2.5 text-slate-300 leading-relaxed marker:text-sky-500 list-disc pl-4">
            <li>Evolution strategies, EDAs, CMA-ES, Kriging surrogates.</li>
            <li>Benchmarks: Simulators, robotics, combinatorial beasts.</li>
            <li>Assumes <strong>&quot;no gradients, limited budget&quot;</strong> as the norm.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 transition-all hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-200">
            NeurIPS / Deep-Learning Camp
          </div>
          <ul className="space-y-2.5 text-slate-300 leading-relaxed marker:text-emerald-500 list-disc pl-4">
            <li>Backprop, SGD/Adam, differentiable everything.</li>
            <li>Knows Bayesian Opt & Hyperband; often misses the ES/EDA playbook.</li>
            <li>Huge compute, but still hits non-differentiable pockets.</li>
          </ul>
        </div>
      </div>

      <div className="mt-5 p-4 rounded-xl bg-slate-950/50 border border-white/5">
        <p className="text-xs text-slate-400 leading-relaxed">
          These worlds keep re-inventing each other (NES vs CMA-ES; JEPA vibes with “optimize a distribution”). LeCun’s JEPA intuition about learning a latent distribution rhymes with the CMA-ES view of nudging a Gaussian in latent space—two ships passing until they notice each other.
        </p>
      </div>

      <div className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-2 text-xs font-medium text-sky-200">
        <Sparkles className="h-3.5 w-3.5 text-sky-400" />
        <span>Tweet-size takeaway: “CMA-ES is just natural gradients on a Gaussian search distribution.”</span>
      </div>
    </div>
  );
}
