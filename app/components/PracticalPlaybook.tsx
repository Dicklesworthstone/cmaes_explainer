"use client";

import { ShieldCheck, Waves } from "lucide-react";
import { EncodeDecodePlayground } from "./EncodeDecodePlayground";
import { NoiseExplorer } from "./NoiseExplorer";
import { ConstraintRepairDemo } from "./ConstraintRepairDemo";
import { ActiveCovarianceDemo } from "./ActiveCovarianceDemo";
import { RestartStrategyViewer } from "./RestartStrategyViewer";

export function PracticalPlaybook() {
  return (
    <div className="space-y-8">
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
