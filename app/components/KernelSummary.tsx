"use client";

import { Sparkles } from "lucide-react";

/**
 * Compact disclosure panel surfaced on the home page so a first-time
 * visitor sees the kernel's actual scope *before* clicking through to
 * a flagship. The same shape lives in expanded form on the
 * /humanoid and /arm pages (see the `<details>` blocks there for
 * the full Modeled / Simplified / Not modeled lists with citations).
 *
 * Keep this component free of the flagship-only details (terminology
 * from the receipt cards, CMA-ES specifics, etc.) - the goal here is
 * to be honest about the simulation, not to repeat every caveat that
 * the flagships already document.
 */
export function KernelSummary() {
  return (
    <div className="glass-card border-amber-300/15 p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-300" />
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
          The simulation is real about what it solves, honest about what it skips
        </p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Every animation on this site is driven by a compiled Rust multibody
        kernel (semi-implicit Euler at 1/480 s, penalty contact, Coulomb
        friction, Featherstone forward dynamics on the arm). The browser
        renders the world frames it receives and never solves forward
        kinematics or invents trajectories. That is the contract.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-300/15 bg-emerald-950/20 p-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-300">
            Modeled
          </p>
          <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-5 text-slate-300">
            <li>· Free-floating SE(3) bodies</li>
            <li>· Fixed-step, 1/480 s integration</li>
            <li>· Penalty + Coulomb contact</li>
            <li>· Featherstone forward dynamics</li>
            <li>· Certified convex collision (arm)</li>
          </ul>
        </div>
        <div className="rounded-xl border border-amber-300/15 bg-amber-950/20 p-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-300">
            Simplified
          </p>
          <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-5 text-slate-300">
            <li>· Compliant pads, not full soles</li>
            <li>· Oriented-box collision envelopes</li>
            <li>· Periodic-basis policy, not a net</li>
            <li>· No motor torque curves or thermal limits</li>
            <li>· No upper-body / hand telemetry</li>
          </ul>
        </div>
        <div className="rounded-xl border border-rose-300/15 bg-rose-950/20 p-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-rose-300">
            Not modeled
          </p>
          <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-5 text-slate-300">
            <li>· Sim-to-real transfer, no hardware</li>
            <li>· IMU, encoder, or actuator lag</li>
            <li>· Slip detection, recovery reflex</li>
            <li>· Wind, lighting noise, camera artifacts</li>
            <li>· RL beyond the periodic basis</li>
          </ul>
        </div>
      </div>
      <p className="mt-4 text-[0.72rem] leading-5 text-slate-400">
        A walker that survives the kernel can still fall on real hardware.
        The page deliberately stops at a deterministic explainer
        experiment; treating it as a hardware validation would be a
        category error. Open the
        {" "}
        <a href="#honesty" className="text-sky-300 underline-offset-2 hover:underline">
          Honesty ledger
        </a>
        {" "}
        below for the per-claim source, test, and citation.
      </p>
    </div>
  );
}
