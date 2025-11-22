"use client";

import { ShieldCheck, Waves } from "lucide-react";
import { EncodeDecodePlayground } from "./EncodeDecodePlayground";

export function PracticalPlaybook() {
  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-sky-200">
        <ShieldCheck className="h-4 w-4" />
        Practical playbook: constraints, noise, budgets
      </div>
      <div className="grid gap-3 md:grid-cols-2 text-[0.86rem] text-slate-200">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 space-y-1">
          <div className="text-[0.8rem] font-semibold text-sky-200">Constraints & bounds</div>
          <ul className="space-y-1 text-slate-300">
            <li>Work in an unconstrained space; logit/tanh to map back; or clip/reflect at bounds.</li>
            <li>Categories: carve [0,1] into intervals, quantize late; keeps search smoother.</li>
            <li>Hard constraints: add rank-based penalties; repair samples instead of rejecting.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 space-y-1">
          <div className="text-[0.8rem] font-semibold text-emerald-200">Noise & budgets</div>
          <ul className="space-y-1 text-slate-300">
            <li>For noisy f: enlarge λ, reevaluate elites, average top-k, or use active updates to shrink bad directions.</li>
            <li>Budgeting: λ ≈ 4 + floor(3 log n); expect ~50–200 generations; restart if stalled.</li>
            <li>Keep seeds and ask/tell logs so you can replay and debug; determinism saves days.</li>
          </ul>
        </div>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[0.75rem] text-emerald-100">
        <Waves className="h-3.5 w-3.5" /> If each eval costs hours, invest in full covariance; drop to diagonal/LM when n is huge and f is cheap.
      </div>
      <div className="pt-2">
        <EncodeDecodePlayground />
      </div>
    </div>
  );
}
