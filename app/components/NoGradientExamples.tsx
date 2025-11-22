"use client";

import { motion } from "framer-motion";
import { PlaneTakeoff, Building2, BrainCircuit, Timer, Zap } from "lucide-react";
import type { ComponentType } from "react";
import { BridgeViz } from "./BridgeViz";
import { CommunitySplit } from "./CommunitySplit";
import { DLHybrids } from "./DLHybrids";
import { PracticalPlaybook } from "./PracticalPlaybook";
import { TransformerViz } from "./TransformerViz";

type Card = {
  id: string;
  Icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  metrics: string[];
  CTA: string;
};

const cards: Card[] = [
  {
    id: "wing",
    Icon: PlaneTakeoff,
    title: "Airplane wing in CFD",
    subtitle: "10–20 geometry knobs; hours per eval; no gradients",
    metrics: ["CFD + meshing each time", "Stall / noise / drag blended score", "Discrete airfoil choices"],
    CTA: "Why CMA-ES works"
  },
  {
    id: "bridge",
    Icon: Building2,
    title: "Suspension bridge via FEA",
    subtitle: "Nonlinear modes flip; gradients lie",
    metrics: ["Span, cable sag, deck stiffness", "Multi-load-case penalties", "Sharp regime shifts"],
    CTA: "Rank-based trick"
  },
  {
    id: "llm",
    Icon: BrainCircuit,
    title: "Transformer hyperparams",
    subtitle: "Mixed discrete + continuous; noisy evals",
    metrics: ["LR schedule, wd, dropout, norm eps", "Layers / d_model / heads choices", "Budget ~200 evals"],
    CTA: "Sample-smart search"
  }
];

function BridgeVizPanel() {
  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-sky-500/10 border border-sky-500/20">
            <Building2 className="h-4 w-4 text-sky-400" />
          </div>
          <span className="font-bold uppercase tracking-wider text-xs text-sky-100">
            Suspension Bridge Stress Toy
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[0.65rem] font-bold text-emerald-300 uppercase tracking-wide shadow-sm">
           <Zap className="w-3 h-3" /> Interactive
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-6 max-w-3xl leading-relaxed">
        Mirrors the “bridge via FEA” card: tweak span, sag, stiffness, and load; watch a toy stress
        overlay shift from green to red. It’s not a solver—just a visual to remind you why gradients
        mislead when modes flip.
      </p>
      <BridgeViz />
    </div>
  );
}

export function NoGradientExamples() {
  return (
    <div className="space-y-12">
      <p className="prose-cmaes text-lg text-slate-300 text-balance">
        “No gradient” in practice means hours-per-eval simulators, discrete knobs, brittle
        constraints, and noisy regime shifts. Here are three archetypes where CMA-ES is the default
        lever: CFD wings, nonlinear bridges, and mixed discrete/continuous Transformer tuning on a
        tiny budget.
      </p>
      
      <div className="space-y-12">
         <BridgeVizPanel />
         <TransformerViz />
         <DLHybrids />
         <CommunitySplit />
         <PracticalPlaybook />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="glass-card p-6 flex flex-col h-full hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/5 group"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-sky-500/10 group-hover:border-sky-500/20 transition-colors">
                   <card.Icon className="h-5 w-5 text-sky-300 group-hover:text-sky-400" />
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/50 px-2.5 py-1 text-[0.65rem] font-medium text-slate-400 border border-white/5">
                <Timer className="h-3 w-3" />
                Slow Evals
              </span>
            </div>
            
            <h3 className="text-base font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">{card.title}</h3>
            <div className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">
              {card.subtitle}
            </div>
            
            <ul className="space-y-2.5 mb-6 flex-1">
              {card.metrics.map((m) => (
                <li key={m} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                  <div className="mt-0.5 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)] shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-auto inline-flex items-center justify-center w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-sky-200 transition-all group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 group-hover:shadow-lg group-hover:shadow-sky-500/20">
              {card.CTA}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
