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
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-xs text-sky-200">
          <Building2 className="h-4 w-4" />
          <span className="font-semibold uppercase tracking-wide text-[0.68rem]">
            Suspension bridge stress toy
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-[0.65rem] text-slate-200">
          Interactive
        </span>
      </div>
      <p className="text-[0.8rem] text-slate-300">
        Mirrors the “bridge via FEA” card: tweak span, sag, stiffness, and load; watch a toy stress
        overlay shift from green to red. It’s not a solver—just a visual to remind you why gradients
        mislead when modes flip.
      </p>
      <div className="mt-3">
        <BridgeViz />
      </div>
    </div>
  );
}

export function NoGradientExamples() {
  return (
    <div className="space-y-5">
      <p className="prose-cmaes text-sm text-slate-300">
        “No gradient” in practice means hours-per-eval simulators, discrete knobs, brittle
        constraints, and noisy regime shifts. Here are three archetypes where CMA-ES is the default
        lever: CFD wings, nonlinear bridges, and mixed discrete/continuous Transformer tuning on a
        tiny budget. Each card is a concrete reminder of what “black box” looks like on the ground and
        why rank-based, geometry-learning search beats finite differences or grid sweeps.
      </p>
      <BridgeVizPanel />
      <TransformerViz />
      <DLHybrids />
      <CommunitySplit />
      <PracticalPlaybook />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: idx * 0.05 }}
            className="flex flex-col rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs text-sky-200">
                <card.Icon className="h-4 w-4" />
                <span className="font-semibold uppercase tracking-wide text-[0.68rem]">
                  {card.title}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-[0.65rem] text-slate-200">
                <Timer className="h-3.5 w-3.5" />
                slow evals
              </span>
            </div>
            <div className="text-[0.82rem] font-semibold text-slate-100 sm:text-[0.78rem]">
              {card.subtitle}
            </div>
            <ul className="mt-2 space-y-1 text-[0.78rem] text-slate-300 sm:text-[0.74rem]">
              {card.metrics.map((m) => (
                <li key={m} className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3.5 w-3.5 text-emerald-300" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[0.72rem] text-sky-100">
              {card.CTA}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
