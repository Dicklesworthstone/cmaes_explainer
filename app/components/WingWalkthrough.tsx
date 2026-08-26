"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MathJax } from "better-react-mathjax";
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
      subtitle: "Center the Gaussian prior in the unit box [0,1]³",
      math: "m^{(0)} = (0.5, 0.5, 0.5)^\\top, \\quad \\sigma^{(0)} = 0.3, \\quad C^{(0)} = I_3",
      desc: "All physical ranges are mapped linearly into the unit cube: Aspect Ratio (6 to 14) → [0, 1], Sweep (0° to 40°) → [0, 1], and Airfoil Family Index (5 discrete bins) → [0, 1]. Starting with C = I ensures our initial ignorance is completely isotropic.",
      tag: "Setup"
    },
    {
      step: 2,
      title: "Generation 1: Blind Exploration",
      subtitle: "Sample λ offspring & run expensive CFD",
      math: "x_i^{(1)} \\sim \\mathcal{N}(m^{(0)}, (\\sigma^{(0)})^2 I_3), \\quad i = 1, \\dots, \\lambda",
      desc: "Sample λ = 12 candidate wings. For each vector: decode to physical NACA parameters, build the 3D surface mesh, run multi-regime CFD, and compute the blended aerodynamic score f(x_i). Sort samples by rank.",
      tag: "Sampling"
    },
    {
      step: 3,
      title: "Recombination & Mean Shift",
      subtitle: "Move mean toward the weighted top μ elites",
      math: "m^{(1)} = \\sum_{i=1}^{\\mu} w_i x_{i:\\lambda}^{(1)}, \\quad \\Delta m = m^{(1)} - m^{(0)}",
      desc: "Compute the new center of mass as a weighted average of the best μ = 4 wings. The shift Δm represents the empirical direction of positive aerodynamic progress.",
      tag: "Recombination"
    },
    {
      step: 4,
      title: "Accumulating Evolution Paths",
      subtitle: "Track momentum for step size (p_σ) and covariance (p_c)",
      math: "p_\\sigma \\leftarrow (1-c_\\sigma) p_\\sigma + \\sqrt{c_\\sigma(2-c_\\sigma)\\mu_{\\text{eff}}}\\, C^{-1/2} \\frac{\\Delta m}{\\sigma}",
      desc: "The path p_σ accumulates steps in isotropic whitened coordinates. If consecutive steps point consistently in similar directions, p_σ grows long (telling the optimizer to expand σ). If steps oscillate or jitter, p_σ shrinks.",
      tag: "Memory"
    },
    {
      step: 5,
      title: "Covariance Adaptation (Rank-1 & Rank-μ)",
      subtitle: "Stretch the ellipsoid along safe aerodynamic ridges",
      math: "C^{(1)} = (1 - c_1 - c_\\mu) C^{(0)} + c_1 p_c p_c^\\top + c_\\mu \\sum_{i=1}^{\\mu} w_i y_i y_i^\\top",
      desc: "Rank-1 updates elongate C along the historical momentum path p_c. Rank-μ updates align the ellipsoid with the spread of the current elite cloud. The Gaussian morphs from a sphere into an elongated cigar.",
      tag: "Adaptation"
    },
    {
      step: 6,
      title: "Generations 5–15: Geometry Learning",
      subtitle: "Approximating the transonic inverse Hessian H⁻¹",
      math: "C \\approx H^{-1}_{\\text{aero}}, \\quad \\sigma \\text{ automatically contracts}",
      desc: "After several CFD batches, CMA-ES discovers that increasing aspect ratio while simultaneously increasing sweep angle is benign, whereas increasing aspect ratio with zero sweep causes severe shock stall. The ellipsoid aligns perfectly with the benign diagonal ridge.",
      tag: "Curvature"
    },
    {
      step: 7,
      title: "Local Refinement & Restarts",
      subtitle: "Precision convergence and IPOP/BIPOP global sweeps",
      math: "\\sigma \\to 10^{-4}, \\quad x^* = \\arg\\max L/D",
      desc: "In late generations, σ shrinks to micro-scale, performing tight precision tuning on camber and thickness distributions. If progress stalls or multiple basins exist, IPOP/BIPOP restarts with doubled population size automatically.",
      tag: "Convergence"
    }
  ];

  return (
    <div className="space-y-10">
      <div className="prose-cmaes">
        <p className="text-lg text-slate-300 leading-relaxed">
          Let&apos;s trace CMA-ES in slow motion through a concrete engineering challenge: designing an optimal
          transonic aircraft wing in three design dimensions{" "}
          <MathJax inline>{"$x_1, x_2, x_3 \\in [0, 1]$"}</MathJax>.
        </p>

        <p>
          Every single CFD evaluation costs hours of supercomputer meshing. Every generation must extract
          maximal geometric information about which combinations of aspect ratio, sweep, and camber yield high
          lift-to-drag (<MathJax inline>{"$L/D$"}</MathJax>) while avoiding structural failure.
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
              className={`p-2.5 rounded-xl text-left border transition-all ${
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

              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-mono">
                <MathJax dynamic>{`$${steps[activeStep].math}$`}</MathJax>
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
