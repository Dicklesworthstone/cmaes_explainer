"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LatexRenderer } from "./LatexRenderer";
import { WingViz } from "./WingViz";
import {
  Compass,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  Activity,
  Cpu,
  RefreshCw,
  TrendingDown
} from "lucide-react";

export function WingWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: 1,
      title: "Initial State & Normalization",
      subtitle: "Center the Gaussian prior in the 8D unit hypercube [0,1]⁸",
      math: "\\textcolor{#c084fc}{m^{(0)}} = (0.5, \\dots, 0.5)^\\top \\in \\mathbb{R}^8, \\quad \\textcolor{#fbbf24}{\\sigma^{(0)}} = 0.25, \\quad \\textcolor{#34d399}{C^{(0)}} = I_8",
      desc: "All 8 physical parameters are encoded into the unit hypercube [0, 1]⁸: aspect ratio, sweep angle, thickness ratio, camber, camber position, taper ratio, categorical airfoil family bins, and internal structural ribs. Initializing with C = I₈ establishes an isotropic, unbiased prior across all design dimensions.",
      tag: "Setup"
    },
    {
      step: 2,
      title: "Generation 1: Exploration",
      subtitle: "Sample λ offspring & run CFD evaluations",
      math: "\\textcolor{#60a5fa}{x_i^{(1)}} \\sim \\mathcal{N}(\\textcolor{#c084fc}{m^{(0)}}, (\\textcolor{#fbbf24}{\\sigma^{(0)}})^2 \\textcolor{#34d399}{I_8}), \\quad i = 1, \\dots, \\lambda",
      desc: "Sample λ = 12 candidate wings. For each vector, decode to physical NACA parameters, construct the 3D surface mesh, execute multi-regime aerodynamic solver runs, and compute scalar performance f(x_i). Sort samples by relative rank.",
      tag: "Sampling"
    },
    {
      step: 3,
      title: "Recombination & Mean Shift",
      subtitle: "Move mean toward the weighted top μ elites",
      math: "\\textcolor{#c084fc}{m^{(1)}} = \\sum_{i=1}^{\\mu} \\textcolor{#fb923c}{w_i} \\textcolor{#60a5fa}{x_{i:\\lambda}^{(1)}}, \\quad \\textcolor{#c084fc}{\\Delta m} = \\textcolor{#c084fc}{m^{(1)}} - \\textcolor{#c084fc}{m^{(0)}}",
      desc: "Compute the new distribution center as a weighted average of the best μ = 4 wings. The shift Δm represents the empirical direction of positive aerodynamic performance.",
      tag: "Recombination"
    },
    {
      step: 4,
      title: "Accumulating Evolution Paths",
      subtitle: "Track momentum for step size (p_σ) and covariance (p_c)",
      math: "\\textcolor{#fb7185}{p_\\sigma} \\leftarrow (1-\\textcolor{#fbbf24}{c_\\sigma}) \\textcolor{#fb7185}{p_\\sigma} + \\sqrt{\\textcolor{#fbbf24}{c_\\sigma}(2-\\textcolor{#fbbf24}{c_\\sigma})\\textcolor{#fb923c}{\\mu_{\\text{eff}}}}\\, \\textcolor{#34d399}{C^{-1/2}} \\frac{\\textcolor{#c084fc}{\\Delta m}}{\\textcolor{#fbbf24}{\\sigma}}",
      desc: "The path p_σ accumulates steps in isotropic whitened coordinates. If consecutive steps point consistently in similar directions, p_σ grows longer (triggering σ expansion). If steps oscillate, p_σ contracts.",
      tag: "Memory"
    },
    {
      step: 5,
      title: "Covariance Adaptation (Rank-1 & Rank-μ)",
      subtitle: "Stretch the ellipsoid along aerodynamic ridges",
      math: "\\textcolor{#34d399}{C^{(1)}} = (1 - \\textcolor{#fbbf24}{c_1} - \\textcolor{#fbbf24}{c_\\mu}) \\textcolor{#34d399}{C^{(0)}} + \\textcolor{#fbbf24}{c_1} \\textcolor{#fb7185}{p_c p_c^\\top} + \\textcolor{#fbbf24}{c_\\mu} \\sum_{i=1}^{\\mu} \\textcolor{#fb923c}{w_i} \\textcolor{#60a5fa}{y_i y_i^\\top}",
      desc: "Rank-1 updates elongate C along historical momentum path p_c. Rank-μ updates align the ellipsoid with the spread of the current elite cloud. The Gaussian transforms from a sphere into an elongated ellipsoid.",
      tag: "Adaptation"
    },
    {
      step: 6,
      title: "Generations 5–15: Geometry Learning",
      subtitle: "Approximating the transonic inverse Hessian H⁻¹",
      math: "\\textcolor{#34d399}{C} \\approx \\textcolor{#34d399}{H^{-1}_{\\text{aero}}}, \\quad \\textcolor{#fbbf24}{\\sigma} \\text{ automatically contracts}",
      desc: "Over successive batches, CMA-ES discovers that increasing aspect ratio while simultaneously increasing sweep angle is benign, whereas increasing aspect ratio with zero sweep causes severe shock stall. The ellipsoid aligns with the benign diagonal ridge.",
      tag: "Curvature"
    },
    {
      step: 7,
      title: "Local Refinement & Restarts",
      subtitle: "Precision convergence and IPOP/BIPOP global sweeps",
      math: "\\textcolor{#fbbf24}{\\sigma} \\to 10^{-4}, \\quad \\textcolor{#60a5fa}{x^*} = \\arg\\max \\textcolor{#38bdf8}{L/D}",
      desc: "In late generations, σ shrinks to micro-scale, performing precision tuning on camber and thickness distributions. If progress stalls or multiple basins exist, IPOP/BIPOP restarts with increased population size.",
      tag: "Convergence"
    }
  ];

  return (
    <div className="space-y-10">
      <div className="prose-cmaes">
        <p className="text-lg text-slate-300 leading-relaxed">
          Let&apos;s trace CMA-ES through a concrete engineering challenge: designing an optimal
          transonic aircraft wing across an 8-dimensional mixed parameter space{" "}
          <LatexRenderer math="x \in [0, 1]^8" block={false} /> spanning continuous planform geometry,
          discrete structural rib counts, and categorical airfoil family profiles.
        </p>

        <p>
          Every single aerodynamic evaluation balances lift-to-drag (<LatexRenderer math="L/D" block={false} />) against
          transonic wave drag divergence, skin friction, and wing root bending moment limits.
        </p>
      </div>

      {/* 3D Interactive Wing Wind Tunnel Component */}
      <WingViz />

      {/* Step-by-Step Interactive Slow Motion Scrubber */}
      <div className="glass-card p-6 md:p-8 space-y-6 border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                CMA-ES Generation Lifecycle in Slow Motion
              </h3>
              <p className="text-xs text-slate-400">
                Click through the 7 algorithmic phases to understand the internal linear algebra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              aria-label="Previous algorithmic step"
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-sky-300 px-3 py-1 bg-sky-500/10 rounded-lg border border-sky-500/20">
              Step {activeStep + 1} of {steps.length}
            </span>
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              aria-label="Next algorithmic step"
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`p-2.5 rounded-xl text-left border transition-[background-color,border-color,color,box-shadow] ${
                activeStep === idx
                  ? "bg-sky-500/15 border-sky-500/50 text-white shadow-glow-sm"
                  : "bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="text-[0.65rem] font-mono text-sky-400 font-bold uppercase">Phase {s.step}</div>
              <div className="text-xs font-semibold truncate mt-0.5">{s.tag}</div>
            </button>
          ))}
        </div>

        {/* Active Step Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-slate-950/60 p-6 border border-white/10 space-y-4 shadow-inner"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 flex items-center justify-center text-xs font-mono">
                    {steps[activeStep].step}
                  </span>
                  <span>{steps[activeStep].title}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">{steps[activeStep].subtitle}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-sky-500/30 text-white text-xs font-mono shadow-inner">
                <LatexRenderer math={steps[activeStep].math} block={false} />
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-white/5">
              {steps[activeStep].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
