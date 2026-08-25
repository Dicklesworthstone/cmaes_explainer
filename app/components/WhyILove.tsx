"use client";

import { CheckCircle2, Heart, Shield, Sparkles, Zap, Cpu, Compass } from "lucide-react";

export function WhyILove() {
  const pillars = [
    {
      icon: Compass,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      title: "Principled Distribution-Space Updates",
      desc: "Maintains an explicit multivariate normal search distribution. Updates are not ad-hoc genetic hacks, but canonical natural-gradient steps on the Riemannian manifold of Gaussians with the Fisher information metric."
    },
    {
      icon: Shield,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: "Total Invariance to Units & Monotone Warping",
      desc: "Rank-based selection ignores raw values—so scaling, shifting, or applying any strictly increasing transformation g(f(x)) (e.g. logarithmic or exponential scoring) leaves the optimizer's trajectory completely identical."
    },
    {
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: "Converts Expensive Evals into Geometry Learning",
      desc: "When each simulator run takes hours on a supercomputer cluster, zero data can be wasted. CMA-ES extracts every ounce of curvature information, adapting covariance C ∝ H⁻¹ to glide down ill-conditioned ridges."
    },
    {
      icon: Cpu,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      title: "Mixed Discrete/Continuous Versatility",
      desc: "By normalizing all parameters into [0, 1]ⁿ and decoding at simulator boundaries, CMA-ES handles continuous dimensions, quantized integers, and categorical knobs in one unified search vector."
    },
    {
      icon: Sparkles,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      title: "Virtually Parameter-Free Out of the Box",
      desc: "Default heuristics (λ ≈ 4 + 3 ln n, CSA damping constants, recombination weights) work flawlessly across almost all domains without tedious manual hyperparameter tuning."
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
            className={`rounded-2xl border p-5 bg-slate-950/40 border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-3 ${
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
