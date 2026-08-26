"use client";

import { Cpu, Palette, Workflow, Sparkles, BrainCircuit, Bot, Layers } from "lucide-react";
import { CAGalleryTrace } from "./CAGalleryTrace";

export function DLHybrids() {
  return (
    <div className="glass-card p-6 md:p-8 space-y-8 border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Workflow className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Where CMA-ES Pairs with Deep Learning & Creative AI
            </h3>
            <p className="text-xs text-slate-400">
              Zero-gradient search in high-level representation and latent control spaces
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 hidden sm:inline-block">
          Distribution Optimization
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 text-sm">
        <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/30 to-slate-950/40 p-6 space-y-3 hover:border-sky-500/40 transition-colors duration-300">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide text-sky-300">
            <BrainCircuit className="h-4 w-4" />
            <span>NAS & Hyperparameter Curricula</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Encode learning rate schedules, dropout probabilities, normalization epsilons, and discrete layer topologies into a unified <code className="text-xs font-mono bg-white/10 px-1 py-0.5 rounded">[0, 1]ⁿ</code> box. CMA-ES learns which parameter interactions matter without backprop through training loops.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc pl-4 marker:text-sky-400">
            <li>Vectorized ask/tell loops for massive cluster parallelism.</li>
            <li>IPOP/BIPOP restarts to escape poor initialization basins.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-slate-950/40 p-6 space-y-3 hover:border-purple-500/40 transition-colors duration-300">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide text-purple-300">
            <Palette className="h-4 w-4" />
            <span>Latent Exploration & Artificial Life</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Searching non-differentiable generative spaces: continuous cellular automata convolution kernels, latent prompt embeddings, and discrete tool-calling agent policies.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc pl-4 marker:text-purple-400">
            <li>Optimize aesthetic scores, spatial entropy, or human feedback rewards.</li>
            <li>Natural-gradient updates prevent premature collapse of diversity.</li>
          </ul>
        </div>
      </div>

      {/* Embedded Live Cellular Automata Evolutionary Engine */}
      <div className="pt-2">
        <CAGalleryTrace />
      </div>
    </div>
  );
}
