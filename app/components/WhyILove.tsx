"use client";

import { CheckCircle2 } from "lucide-react";

export function WhyILove() {
  const bullets = [
    "Keeps an explicit search distribution; updates are principled (natural-gradient flavored).",
    "Rank-based and coordinate-invariant: units, scalings, and monotone hacks don’t derail it.",
    "Turns scarce, expensive evaluations into geometry learning (covariance as inverse-Hessian proxy).",
    "Works on mixed discrete/continuous spaces with minimal tweaks (encode/decode, late quantization).",
    "Simple mental model: spherical Gaussian → tilted, stretched ellipsoid that hugs valleys over time."
  ];

  return (
    <div className="glass-card p-5 border-l-4 border-l-sky-500">
      <div className="text-xs font-bold uppercase tracking-wider text-sky-200 mb-3">Why I love CMA-ES</div>
      <ul className="space-y-2.5">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed">
             <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
             <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
