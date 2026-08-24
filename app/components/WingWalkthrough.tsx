"use client";

import { motion } from "framer-motion";
import { MathJax } from "better-react-mathjax";
import { WingViz } from "./WingViz";

export function WingWalkthrough() {
  const steps = [
    {
      title: "State of CMA-ES",
      text: `Keep a mean m ∈ ℝ³, step size σ, covariance C ∈ ℝ^{3×3}, and two evolution paths p_σ, p_c. Pick a population λ and elite size μ with weights w₁…w_μ. For the toy wing start at m⁰ = (0.5,0.5,0.5), σ⁰ = 0.3, C⁰ = I, p_σ = p_c = 0.`
    },
    {
      title: "Generation 1: blind exploration",
      text: `Sample λ points x_i ~ 𝒩(m⁰, (σ⁰)² C⁰). Map back to physical wing parameters, quantize the airfoil index, run CFD, get scores f(x_i). Rank, take a weighted average of the best μ to get m¹, record the shift Δm = m¹ − m⁰.`
    },
    {
      title: "Evolution paths",
      text: `Feed the normalized step into p_σ (in C-whitened coords) and into p_c (in original coords). If the mean keeps moving in one direction, paths grow; if it jitters, they shrink. These paths are the memory that lets the updates stay data-efficient.`
    },
    {
      title: "Covariance adaptation",
      text: `Update C with a rank‑1 term from p_c p_cᵀ and a rank‑μ term from deviations of the top μ. Good directions stretch; bad ones shrink. This is online PCA of successful steps, turning the ellipsoid into a rotated cigar along safe directions.`
    },
    {
      title: "Step-size control",
      text: `Compare |p_σ| to the expected length of a random walk under 𝒩(0,I). If it is longer, increase σ; if shorter, decrease σ. That is cumulative step-size adaptation (CSA).`
    },
    {
      title: "Generations 5–15: learning the geometry",
      text: `After a few batches of CFD, the mean moves into a promising region, σ shrinks, and C elongates along “safe” directions (e.g., aspect ratio and sweep together) while squeezing dangerous ones. By generation ~15 you are in local refinement with a skinny, well oriented ellipsoid.`
    },
    {
      title: "Restarts when you need global search",
      text: `If progress stalls or you suspect multiple basins, restart CMA‑ES with a larger population (IPOP) or alternate big and small populations (BIPOP). You keep the same encode/decode trick; everything stays in [0,1]³ with categories carved into intervals; the restart policy trades exploration for exploitation automatically.`
    }
  ];

  return (
    <div className="prose-cmaes space-y-6">
      <p>
        Let’s simplify the wing to just three normalized parameters{" "}
        <MathJax inline>{"$x_1, x_2, x_3 \\in [0,1]$"}</MathJax>: aspect ratio, sweep, and an airfoil
        family index. Physical ranges map linearly into the unit cube; the categorical airfoil index
        is carved into five sub-intervals and later quantized. Normalizing like this keeps the
        initial Gaussian honest; every direction starts equally plausible. The real pipeline would
        be hours of meshing + CFD per point, so every generation has to count — that’s the regime
        where CMA-ES earns its keep.
      </p>

      <p>
        The rhythm looks like this: sample a batch, run the expensive simulator, rank, and update.
        The evolving ellipsoid is an online PCA of “what worked,” steadily aligning to benign
        directions (e.g., sweep + aspect ratio together) and squeezing dangerous ones (high aspect
        ratio with low sweep). By the mid-game generations you’ve converted ignorance into a tailored
        metric without ever seeing a gradient.
      </p>

      <div className="space-y-6">
        <div className="bg-slate-900/30 border border-white/5 rounded-xl p-5">
          <h3 className="font-semibold text-slate-100 mb-3 text-sm flex items-center gap-2">
             <span className="w-1 h-4 bg-emerald-500 rounded-full" />
             Practical Tricks
          </h3>
          <ul className="space-y-2 text-slate-300 text-sm list-disc pl-4 marker:text-emerald-500">
            <li>Reflect or squash out-of-bounds samples rather than rejecting them to keep data flowing.</li>
            <li>Quantize categorical dimensions as late as possible so the search stays continuous.</li>
            <li>Keep seeds and ask/tell logs so you can replay a run; determinism makes debugging sane.</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start mt-12">
        <div className="space-y-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card p-5 hover:border-sky-500/30 transition-colors group"
            >
              <div className="mb-2 text-xs font-bold text-sky-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[0.6rem] text-sky-400 font-mono">
                   {i + 1}
                </span>
                {s.title}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                <MathJax dynamic>{s.text}</MathJax>
              </p>
            </motion.div>
          ))}
        </div>
        <div className="lg:sticky lg:top-24">
           <WingViz />
        </div>
      </div>

      <p className="mt-6">
        The important part is what we <em>don’t</em> assume. We never assume the objective is convex
        or even smooth. We just assume that sampling around the current mean and steering the
        covariance toward where good things have happened in the past is a reasonable meta-strategy.
        CMA-ES is the formalization of that idea with careful math underneath: invariance from
        rank-based selection, natural-gradient flavored updates in distribution space, and restart
        policies (IPOP/BIPOP) when you need to sweep multiple basins.
      </p>
    </div>
  );
}
