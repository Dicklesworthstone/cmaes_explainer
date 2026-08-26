"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LatexRenderer, TextWithLatex } from "./LatexRenderer";
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
  TrendingDown,
  Play,
  Pause
} from "lucide-react";

export function WingWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(false);

  const steps = [
    {
      step: 1,
      title: "Initial State & Normalization",
      subtitle: "Warm-start the Gaussian prior at the current design in $[0, 1]^8$",
      math: "\\textcolor{#c084fc}{m^{(0)}} = \\text{encode}(x_{\\text{design}}) \\in [0,1]^8, \\quad \\textcolor{#fbbf24}{\\sigma^{(0)}} = 0.25, \\quad \\textcolor{#34d399}{C^{(0)}} = I_8",
      desc: "All 8 physical parameters are encoded into the unit hypercube $[0, 1]^8$: aspect ratio, sweep angle, thickness ratio, camber, camber position, taper ratio, categorical airfoil family bins, and internal structural ribs. The mean starts at the encoded current design (a standard warm start), and $C = I_8$ establishes an isotropic, unbiased prior across all design dimensions.",
      tag: "Setup"
    },
    {
      step: 2,
      title: "Generation 1: Exploration",
      subtitle: "Sample $\\lambda$ offspring & run CFD evaluations",
      math: "\\textcolor{#60a5fa}{x_i^{(1)}} \\sim \\mathcal{N}(\\textcolor{#c084fc}{m^{(0)}}, (\\textcolor{#fbbf24}{\\sigma^{(0)}})^2 \\textcolor{#34d399}{I_8}), \\quad i = 1, \\dots, \\lambda",
      desc: "Sample $\\lambda = 16$ candidate wings (the default rule $\\lambda = 4 + \\lfloor 3 \\ln 8 \\rfloor = 10$ is raised to 16 here so each generation's sample cloud is easier to see). For each vector, decode to physical NACA parameters, construct the 3D surface mesh, execute multi-regime aerodynamic solver runs, and compute scalar performance $f(x_i)$. Sort samples by relative rank.",
      tag: "Sampling"
    },
    {
      step: 3,
      title: "Recombination & Mean Shift",
      subtitle: "Move mean toward the weighted top $\\mu$ elites",
      math: "\\textcolor{#c084fc}{m^{(1)}} = \\sum_{i=1}^{\\mu} \\textcolor{#fb923c}{w_i} \\textcolor{#60a5fa}{x_{i:\\lambda}^{(1)}}, \\quad \\textcolor{#c084fc}{\\Delta m} = \\textcolor{#c084fc}{m^{(1)}} - \\textcolor{#c084fc}{m^{(0)}}",
      desc: "Compute the new distribution center as a weighted average of the best $\\mu = 8$ wings (half the population). The shift $\\Delta m$ represents the empirical direction of positive aerodynamic performance.",
      tag: "Recombination"
    },
    {
      step: 4,
      title: "Accumulating Evolution Paths",
      subtitle: "Track momentum for step size ($p_\\sigma$) and covariance ($p_c$)",
      math: "\\textcolor{#fb7185}{p_\\sigma} \\leftarrow (1-\\textcolor{#fbbf24}{c_\\sigma}) \\textcolor{#fb7185}{p_\\sigma} + \\sqrt{\\textcolor{#fbbf24}{c_\\sigma}(2-\\textcolor{#fbbf24}{c_\\sigma})\\textcolor{#fb923c}{\\mu_{\\text{eff}}}}\\, \\textcolor{#34d399}{C^{-1/2}} \\frac{\\textcolor{#c084fc}{\\Delta m}}{\\textcolor{#fbbf24}{\\sigma}}",
      desc: "The path $p_\\sigma$ accumulates steps in isotropic whitened coordinates. If consecutive steps point consistently in similar directions, $p_\\sigma$ grows longer (triggering $\\sigma$ expansion via $\\sigma \\leftarrow \\sigma \\exp(\\frac{c_\\sigma}{d_\\sigma}(\\frac{\\|p_\\sigma\\|}{\\mathbb{E}\\|\\mathcal{N}(0,I)\\|} - 1))$). If steps oscillate, $p_\\sigma$ contracts. A sibling path $p_c$ accumulates the same mean shifts without whitening and feeds the rank-1 covariance update in the next phase.",
      tag: "Memory"
    },
    {
      step: 5,
      title: "Covariance Adaptation (Rank-1 & Rank-μ)",
      subtitle: "Stretch the ellipsoid along aerodynamic ridges",
      math: "\\textcolor{#34d399}{C^{(1)}} = (1 - \\textcolor{#fbbf24}{c_1} - \\textcolor{#fbbf24}{c_\\mu}) \\textcolor{#34d399}{C^{(0)}} + \\textcolor{#fbbf24}{c_1} \\textcolor{#fb7185}{p_c p_c^\\top} + \\textcolor{#fbbf24}{c_\\mu} \\sum_{i=1}^{\\mu} \\textcolor{#fb923c}{w_i} \\textcolor{#60a5fa}{y_i y_i^\\top}",
      desc: "Rank-1 updates elongate $C$ along historical momentum path $p_c$. Rank-$\\mu$ updates align the ellipsoid with the spread of the current elite cloud. The Gaussian transforms from a sphere into an elongated ellipsoid.",
      tag: "Adaptation"
    },
    {
      step: 6,
      title: "Generations 5–15: Geometry Learning",
      subtitle: "Approximating the transonic inverse Hessian $H^{-1}$ up to scale",
      math: "\\textcolor{#34d399}{C} \\propto \\textcolor{#34d399}{H^{-1}_{\\text{aero}}}, \\quad \\textcolor{#fbbf24}{\\sigma} \\text{ automatically contracts}",
      desc: "Over successive batches, CMA-ES discovers that thicker airfoil sections are tolerable when paired with more sweep, whereas a thick unswept wing triggers early drag divergence. The ellipsoid aligns with this benign thickness-sweep diagonal, and the scale of the learned shape is carried by $\\sigma$.",
      tag: "Curvature"
    },
    {
      step: 7,
      title: "Local Refinement & Restarts",
      subtitle: "Precision convergence and IPOP/BIPOP global sweeps",
      math: "\\textcolor{#fbbf24}{\\sigma} \\to 10^{-4}, \\quad \\textcolor{#60a5fa}{x^*} = \\arg\\min f, \\;\\; f = -\\textcolor{#38bdf8}{L/D} + \\text{mass penalty}",
      desc: "In late generations, $\\sigma$ shrinks to micro-scale, performing precision tuning on camber and thickness distributions. If progress stalls or multiple basins exist, restart: IPOP doubles $\\lambda$ at each restart, while BIPOP alternates large-$\\lambda$ runs with small-$\\lambda$, small-$\\sigma$ runs under a shared budget.",
      tag: "Convergence"
    }
  ];

  // Autoplay step cycler
  useEffect(() => {
    if (!isAutoplaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoplaying, steps.length]);

  const handleManualStep = (idx: number) => {
    setIsAutoplaying(false);
    setActiveStep(idx);
  };

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
          Each aerodynamic evaluation trades lift-to-drag (<LatexRenderer math="L/D" block={false} />) against
          the structural mass driven by the wing root bending moment. The drag total inside{" "}
          <LatexRenderer math="L/D" block={false} /> already folds in transonic wave drag and skin friction.
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
                Click through the 7 algorithmic phases or press Play to watch the live step-by-step cycle
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoplaying((prev) => !prev)}
              aria-label={isAutoplaying ? "Pause walkthrough" : "Play slow-motion walkthrough"}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-[background-color,border-color,color,box-shadow] ${
                isAutoplaying
                  ? "bg-sky-500 text-white border-sky-400 shadow-glow-sm"
                  : "bg-slate-900 border-white/10 text-slate-300 hover:text-white"
              }`}
            >
              {isAutoplaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsAutoplaying(false);
                setActiveStep((prev) => Math.max(0, prev - 1));
              }}
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
              onClick={() => {
                setIsAutoplaying(false);
                setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
              }}
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
              onClick={() => handleManualStep(idx)}
              className={`p-2.5 rounded-xl text-left border transition-[background-color,border-color,color,box-shadow] ${
                activeStep === idx
                  ? "bg-sky-500/20 border-sky-500/60 text-white shadow-glow-sm"
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
                <div className="text-xs text-slate-400 mt-1">
                  <TextWithLatex text={steps[activeStep].subtitle} />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-sky-500/30 text-white text-xs font-mono shadow-inner">
                <LatexRenderer math={steps[activeStep].math} block={false} />
              </div>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-white/5">
              <TextWithLatex text={steps[activeStep].desc} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
