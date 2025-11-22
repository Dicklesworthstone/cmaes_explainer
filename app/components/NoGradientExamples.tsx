"use client";

import { motion } from "framer-motion";
import { PlaneTakeoff, Building2, BrainCircuit } from "lucide-react";

const cards = [
  {
    id: "wing",
    Icon: PlaneTakeoff,
    title: "Designing an airplane wing",
    body: `Boeing-level CFD runs are hours of supercomputer time. A wing might be parameterized by aspect ratio, sweep, twist distribution, thickness-to-chord, airfoil family index, and structural knobs—10–20 bounded variables with ugly interactions. Each evaluation means geometry, meshing, full CFD across regimes, and a scalar score that mixes lift-to-drag, stall margin, structural and noise constraints. There is no useful gradient; finite differences would rerun the whole pipeline for every dimension.`
  },
  {
    id: "bridge",
    Icon: Building2,
    title: "Tuning a suspension bridge via FEA",
    body: `A bridge design vector might include span length, tower geometry, cable sag, deck stiffness, materials, safety factors. One evaluation builds an FE model, solves huge linear/non-linear systems for multiple load cases, checks stresses, deflections, modes, fatigue, code compliance, and collapses it to a penalty. The landscape has sharp changes when modes cross or constraints flip, so gradients are mostly lies; you just get “this design was good/bad”.`
  },
  {
    id: "llm",
    Icon: BrainCircuit,
    title: "Hyperparameters for a Transformer",
    body: `Some knobs are continuous (learning rate schedules, weight decay, dropout, norm epsilons, data mixing); others are discrete (layers, d_model, heads, activation, attention variant). Evaluating one point means a multi-day training run plus a benchmark suite. The response surface is bumpy and noisy, with mixed discrete/continuous variables, and you may have only a couple hundred evaluations total.`
  }
];

export function NoGradientExamples() {
  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: idx * 0.05 }}
          className="flex flex-col rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4 shadow-sm"
        >
          <div className="mb-3 inline-flex items-center gap-2 text-xs text-sky-200">
            <card.Icon className="h-4 w-4" />
            <span className="font-semibold uppercase tracking-wide text-[0.65rem]">
              {card.title}
            </span>
          </div>
          <p className="text-[0.82rem] leading-relaxed text-slate-300 sm:text-xs">
            {card.body}
          </p>
          <div className="mt-3 text-[0.65rem] text-slate-400">
            Finite-differencing every knob or grid-searching the box would blow the entire compute
            budget. CMA-ES turns a handful of carefully chosen evaluations into a learned search
            geometry.
          </div>
        </motion.div>
      ))}
    </div>
  );
}
