"use client";

import { Cpu, Palette, Workflow } from "lucide-react";
import { CAGalleryTrace } from "./CAGalleryTrace";

export function DLHybrids() {
  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-sky-200">
        <Workflow className="h-4 w-4" />
        Where CMA-ES pairs with deep learning / creative systems
      </div>
      <div className="grid gap-3 md:grid-cols-2 text-[0.9rem] text-slate-200">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 space-y-1">
          <div className="text-[0.82rem] font-semibold text-sky-200">Hyperparams & architectures</div>
          <ul className="space-y-1 text-slate-300 text-[0.86rem]">
            <li>Encode LR/weight decay/dropout + discrete layers/heads into [0,1]^n; CMA-ES learns which directions matter.</li>
            <li>Use vectorized objectives to batch evals; restart when stuck (IPOP/BIPOP).</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 space-y-1">
          <div className="text-[0.82rem] font-semibold text-emerald-200">Continuous creative systems</div>
          <ul className="space-y-1 text-slate-300 text-[0.86rem]">
            <li>Continuous cellular automata scored on “visual interest” or entropy.</li>
            <li>Latent-space prompts / tool knobs for LLM systems when gradients are meaningless.</li>
            <li>Define a single scalar fitness (entropy, coherent structures, aesthetic score) and let CMA-ES roam the CA parameter box.</li>
          </ul>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 text-[0.86rem] text-slate-300">
        <div className="mb-1 text-[0.8rem] font-semibold text-amber-200">Other hybrids</div>
        <ul className="space-y-1">
          <li>RL controllers when policy gradients are too noisy.</li>
          <li>Data augmentation schedules / curricula as mixed discrete-continuous knobs.</li>
          <li>LLM prompt/program search where the objective is spiky and non-differentiable.</li>
        </ul>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[0.75rem] text-emerald-100">
        <Cpu className="h-3.5 w-3.5" /> CMA-ES = “geometry-aware random search” when backprop ghosts you.
      </div>
      <div className="pt-2">
        <CAGalleryTrace />
      </div>
    </div>
  );
}
