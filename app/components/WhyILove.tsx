"use client";

import { CheckCircle2, Heart, Shield, Sparkles, Zap, Cpu, Compass } from "lucide-react";
import { LatexRenderer } from "./LatexRenderer";

export function WhyILove() {
  const pillars = [
    {
      icon: Compass,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      title: "Principled Distribution-Space Updates",
      desc: (
        <span>
          Maintains an explicit multivariate normal search distribution. Its mean shift and rank-μ covariance update together form a Monte Carlo natural-gradient step on the Riemannian manifold of Gaussians with the Fisher information metric; the evolution paths layer cross-generation history on top.
        </span>
      )
    },
    {
      icon: Shield,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: "Invariance to Monotone Objective Warping",
      desc: (
        <span>
          Rank-based selection evaluates only relative ordering, so scaling, shifting, or applying any strictly increasing transformation <LatexRenderer math="g(f(x))" block={false} /> (such as logarithmic or exponential rewards) leaves the optimization path identical.
        </span>
      )
    },
    {
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: "Converts Expensive Evals into Geometry Learning",
      desc: (
        <span>
          When each simulation run is expensive, every sample must count. CMA-ES reuses every ranked batch to learn curvature, adapting its covariance toward <LatexRenderer math="C \propto H^{-1}" block={false} /> on quadratic bowls so it can navigate ill-conditioned ravines without finite-difference probing.
        </span>
      )
    },
    {
      icon: Cpu,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      title: "Mixed Discrete/Continuous Versatility",
      desc: (
        <span>
          By normalizing parameters into a <LatexRenderer math="[0, 1]^n" block={false} /> unit cube and decoding at simulation boundaries, CMA-ES handles continuous dimensions, quantized integers, and categorical choices in a single search vector. Integer and categorical coordinates need a lower bound on their step size (or CMA-ES with margin) so quantization plateaus cannot stall adaptation.
        </span>
      )
    },
    {
      icon: Sparkles,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      title: "Virtually Parameter-Free Out of the Box",
      desc: (
        <span>
          Default heuristics (<LatexRenderer math="\lambda = 4 + \lfloor 3 \ln n \rfloor" block={false} />, CSA damping constants, recombination weights) function reliably across diverse problem domains without tedious manual hyperparameter sweeps.
        </span>
      )
    }
  ];

  return (
    <div className="glass-card p-6 md:p-8 space-y-6 border-l-4 border-l-sky-500 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-sky-950/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Heart className="h-5 w-5 fill-rose-500/30 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Why I Love CMA-ES
            </h3>
            <p className="text-xs text-slate-400">
              The five architectural pillars that make it the ultimate black-box workhorse
            </p>
          </div>
        </div>

        <span className="text-[0.7rem] font-mono text-sky-300 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 hidden sm:inline-block">
          Hansen & Ostermeier
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
        {pillars.map((p, idx) => (
          <div
            key={p.title}
            className={`rounded-2xl border p-5 bg-slate-950/40 border-white/5 hover:border-white/15 transition-[border-color,background-color] flex flex-col justify-between space-y-3 ${
              idx === 0 ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${p.color}`}>
                <p.icon className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 leading-snug">{p.title}</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
