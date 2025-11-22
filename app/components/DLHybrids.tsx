"use client";

import { Cpu, Palette, Workflow } from "lucide-react";
import { CAGalleryTrace } from "./CAGalleryTrace";

export function DLHybrids() {
  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-sky-300">
        <Workflow className="h-4 w-4" />
        <span>Where CMA-ES pairs with Deep Learning / Creative Systems</span>
      </div>
      
      <div className="grid gap-5 md:grid-cols-2 text-sm text-slate-200">
        <div className="rounded-2xl border border-sky-500/10 bg-gradient-to-br from-sky-500/5 to-transparent p-5 transition-all hover:border-sky-500/20">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-sky-200 opacity-90">
             Hyperparams & Architectures
          </div>
          <ul className="space-y-2.5 text-slate-300 text-[0.85rem] leading-relaxed">
            <li className="flex gap-2.5 items-start">
              <span className="w-1 h-1 rounded-full bg-sky-400 mt-2 shrink-0" />
              <span>Encode LR, weight decay, dropout, and discrete layers into <code className="text-[0.75em] bg-white/10 px-1 py-0.5 rounded border border-white/10">[0,1]ⁿ</code>; CMA-ES learns which directions matter.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="w-1 h-1 rounded-full bg-sky-400 mt-2 shrink-0" />
              <span>Use vectorized objectives to batch evals; restart when stuck (IPOP/BIPOP).</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-transparent p-5 transition-all hover:border-emerald-500/20">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-200 opacity-90">
            Continuous Creative Systems
          </div>
          <ul className="space-y-2.5 text-slate-300 text-[0.85rem] leading-relaxed">
            <li className="flex gap-2.5 items-start">
              <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span>Continuous cellular automata scored on “visual interest” or entropy.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
              <span>Latent-space prompts / tool knobs for LLM systems when gradients are meaningless.</span>
            </li>
            <li className="flex gap-2.5 items-start">
               <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
               <span>Define a single scalar fitness (entropy, aesthetic score) and let CMA-ES roam the parameter box.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 text-sm text-slate-300">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-200 opacity-90">Other Hybrids</div>
        <div className="flex flex-wrap gap-2">
          {["RL controllers without policy gradients", "Data augmentation schedules", "LLM prompt search"].map((item, i) => (
             <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300">
               {item}
             </span>
          ))}
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
        <Cpu className="h-3.5 w-3.5" />
        <span>CMA-ES = “Geometry-aware random search” when backprop ghosts you.</span>
      </div>

      <div className="pt-4 border-t border-white/5">
        <CAGalleryTrace />
      </div>
    </div>
  );
}
