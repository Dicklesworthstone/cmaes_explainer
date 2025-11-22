"use client";

import { motion } from "framer-motion";
import { MathJax } from "better-react-mathjax";

export function WingWalkthrough() {
  const steps = [
    {
      title: "State of CMA-ES",
      text: `The algorithm carries a mean m ∈ ℝ³, scalar step-size σ, covariance C ∈ ℝ^{3×3}, and two evolution paths p_σ, p_c. We also pick a population size λ and an elite size μ with weights w₁…w_μ. A reasonable start for the toy wing is m⁰ = (0.5,0.5,0.5), σ⁰ = 0.3, C⁰ = I, p_σ = p_c = 0.`
    },
    {
      title: "Generation 1: blind exploration",
      text: `Sample λ points x_i ~ 𝒩(m⁰, (σ⁰)² C⁰). Map back to physical wing parameters, quantize the airfoil index, launch CFD, and obtain scalar scores f(x_i). Rank the samples, form the new mean m¹ as a weighted average of the best μ, and record the mean shift Δm = m¹ − m⁰.`
    },
    {
      title: "Evolution paths",
      text: `Feed the normalized step into p_σ (in the whitened coordinates of C) and into p_c (in the original coordinates). If the mean keeps moving in a correlated direction, these paths grow; if it jitters, they shrink. They are the memory that makes step-size and covariance updates data‑efficient.`
    },
    {
      title: "Covariance adaptation",
      text: `Update C with a rank‑1 term from p_c p_cᵀ and a rank‑μ term from the deviations of the top μ samples. Directions that consistently lead to better lift/drag are stretched; directions that hurt are damped. This is online PCA of the good steps, slowly turning the sampling ellipsoid into a rotated cigar aligned with benign directions.`
    },
    {
      title: "Step-size control",
      text: `Compare the length of p_σ to the expected length of a random walk under 𝒩(0,I). If it is longer, increase σ (we are making steady progress); if shorter, decrease σ (we are meandering). That is cumulative step-size adaptation (CSA).`
    },
    {
      title: "Generations 5–15: learning the geometry",
      text: `After a few batches of CFD, the mean has moved into a promising region, σ has shrunk, and C has elongated along “safe” directions (e.g., changing aspect ratio and sweep together) while squeezing dangerous ones (high aspect ratio + low sweep). By generation ~15 you are doing local refinement with a skinny, well‑oriented ellipsoid.`
    },
    {
      title: "Restarts when you need global search",
      text: `If progress stalls or you suspect multiple basins, restart CMA‑ES with a larger population (IPOP) or alternate big and small populations (BIPOP). You keep the same encode/decode trick; everything stays in [0,1]³ with categories carved into intervals; the restart policy trades exploration for exploitation automatically.`
    }
  ];

  return (
    <div className="prose-cmaes">
      <p>
        Let’s simplify the wing to just three normalized parameters
        <MathJax inline>{"$x_1, x_2, x_3 \\in [0,1]$"}</MathJax>: aspect ratio, sweep, and an airfoil
        family index. Physical ranges map linearly into the unit cube; the categorical airfoil index
        is carved into five sub-intervals and later quantized. Normalizing like this keeps the
        initial Gaussian honest; every direction starts equally plausible.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: i * 0.03 }}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4 text-xs text-slate-200"
          >
            <div className="mb-2 text-[0.7rem] font-semibold text-sky-200">
              {s.title}
            </div>
            <p className="leading-relaxed">
              <MathJax dynamic>{s.text}</MathJax>
            </p>
          </motion.div>
        ))}
      </div>

      <p className="mt-6">
        The important part is what we <em>don’t</em> assume. We never assume the objective is convex
        or even smooth. We just assume that sampling around the current mean and steering the
        covariance toward where good things have happened in the past is a reasonable meta-strategy.
        CMA-ES is the formalization of that idea with a lot of very careful math underneath.
      </p>
    </div>
  );
}
