"use client";

export function WhyILove() {
  const bullets = [
    "Keeps an explicit search distribution; updates are principled (natural-gradient flavored) not ad hoc.",
    "Rank-based and coordinate-invariant: units, scalings, and monotone hacks don’t derail it.",
    "Turns scarce, expensive evaluations into geometry learning (covariance as inverse-Hessian proxy).",
    "Works on mixed discrete/continuous spaces with minimal tweaks (encode/decode, late quantization).",
    "Simple mental model: spherical Gaussian → tilted, stretched ellipsoid that hugs valleys over time."
  ];

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm space-y-2">
      <div className="text-xs uppercase tracking-wide text-sky-200">Why I love CMA-ES</div>
      <ul className="list-disc space-y-1 pl-5 text-[0.9rem] text-slate-200">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
