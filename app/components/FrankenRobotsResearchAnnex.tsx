"use client";

import { useState } from "react";
import { BrainCircuit, ChartNoAxesCombined, FlaskConical, Network } from "lucide-react";
import { HpoTrainer } from "./HpoTrainer";
import { PolicyAblationComparison } from "./PolicyAblationComparison";

type ResearchPanel = "policies" | "trainer" | "frontier";

const PANELS: Array<{
  id: ResearchPanel;
  label: string;
  detail: string;
  icon: typeof BrainCircuit;
}> = [
  {
    id: "policies",
    label: "Policy showdown",
    detail: "Measured phase-prior vs trained transformer receipts",
    icon: ChartNoAxesCombined,
  },
  {
    id: "trainer",
    label: "Training the trainer",
    detail: "Live outer CMA-ES over eight learning hyperparameters",
    icon: FlaskConical,
  },
  {
    id: "frontier",
    label: "FrankenSim frontier",
    detail: "What the current upstream optimizer adds—and what is not wired yet",
    icon: Network,
  },
];

/**
 * Lazily mounts the heavier research surfaces so opening the robot lab does
 * not immediately pay for a 17 MB transformer or a live ablation sweep.
 */
export function FrankenRobotsResearchAnnex() {
  const [active, setActive] = useState<ResearchPanel | null>(null);

  return (
    <section className="glass-card border-violet-300/15 bg-slate-950/80 p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-violet-300/20 bg-violet-400/10 p-3">
          <BrainCircuit className="h-6 w-6 text-violet-200" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            Research annex · load on demand
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">Beyond the primary locomotion run</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            These are real companion experiments from the current project—not decorative cards.
            Choose one to mount it; the primary G1 stage stays fast and focused until then.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {PANELS.map((panel) => {
          const Icon = panel.icon;
          const selected = active === panel.id;
          return (
            <button
              key={panel.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(selected ? null : panel.id)}
              className={`min-h-24 rounded-2xl border p-4 text-left transition-colors ${
                selected
                  ? "border-violet-300/45 bg-violet-400/15"
                  : "border-white/10 bg-black/20 hover:border-violet-300/25 hover:bg-white/[0.045]"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <Icon className="h-4 w-4 text-violet-200" />
                {panel.label}
              </span>
              <span className="mt-2 block text-xs leading-5 text-slate-400">{panel.detail}</span>
            </button>
          );
        })}
      </div>

      {active === "policies" ? (
        <div className="mt-6">
          <PolicyAblationComparison />
        </div>
      ) : null}
      {active === "trainer" ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <HpoTrainer />
        </div>
      ) : null}
      {active === "frontier" ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.07] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Current upstream source</p>
            <h3 className="mt-2 font-bold text-white">Many-objective search has moved forward</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              FrankenSim now contains deterministic NSGA-II/III and MOEA/D, versioned mating and
              normalization policies, reference-direction survival, bounded Pareto archives,
              hypervolume accounting, and production WFG1–WFG9 evaluators with replay-visible
              identities. That opens a future robot lab where stability, speed, work, clearance,
              and impact are explored as an auditable frontier instead of collapsed prematurely.
            </p>
          </article>
          <article className="rounded-2xl border border-amber-300/20 bg-amber-400/[0.07] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Honest runtime boundary</p>
            <h3 className="mt-2 font-bold text-white">Not mislabeled as today&apos;s robot owner</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This app&apos;s physical rollouts still execute the pinned robotics owner package.
              The newer many-objective APIs remain upstream Rust source until a versioned browser
              ABI, parity battery, and robot-specific receipt contract are shipped. The app shows
              that frontier without pretending it already powered the animation.
            </p>
          </article>
        </div>
      ) : null}
    </section>
  );
}
