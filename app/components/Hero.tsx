"use client";

import { motion } from "framer-motion";
import { Wand2, Cpu } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CovarianceScene } from "./CovarianceScene";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const gradientRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gradientRef.current) return;

    // Skip heavy parallax on small screens to keep scrolling smooth on mobile.
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
      return;
    }

    const el = gradientRef.current;

    gsap.fromTo(
      el,
      { y: 0, opacity: 0.8 },
      {
        y: 120,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom+=400 top",
          scrub: true
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div
        ref={gradientRef}
        className="pointer-events-none absolute inset-0 bg-radial-soft mix-blend-screen"
      />

      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 top-40 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-8 pb-14 sm:gap-10 sm:pt-10 sm:pb-20 lg:flex-row lg:items-center lg:pt-16">
        <div className="relative z-10 max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/50 bg-sky-500/15 px-3 py-1 text-[0.72rem] text-sky-100 shadow-glow-sm backdrop-blur"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Derivative-free • Geometry-aware • Surprisingly elegant</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="font-display text-4xl leading-tight tracking-tight text-slate-50 sm:text-5xl lg:text-6xl drop-shadow-[0_6px_24px_rgba(8,47,73,0.35)]"
          >
            CMA-ES:
            <span className="block bg-gradient-to-r from-sky-300 via-cyan-200 to-amber-200 bg-clip-text text-transparent">
              My favorite black-box optimizer
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="text-sm leading-relaxed text-slate-300 sm:text-base"
          >
            If you have gradients, use them. In the many places where gradients don’t exist (aircraft
            wings, bridges, neural architecture search), CMA-ES quietly shines. This is a straight
            walkthrough of why it works, how it morphs a Gaussian into an inverse-Hessian stand‑in,
            and how to run it yourself in the browser or in Python without touching a single
            derivative.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25 }}
            className="text-[0.92rem] leading-relaxed text-slate-400"
          >
            Roots: CMA-ES grew out of evolution strategies (Rechenberg/Schwefel) and split from
            classic genetic algorithms by optimizing the search <em>distribution</em> instead of
            chromosomes. It shares DNA with kriging’s “neutral prior, bend with evidence” mindset and
            the estimation-of-distribution / cross-entropy family.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <a
              href="#what-is-cmaes"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-glow-lg hover:bg-sky-400 sm:w-auto sm:text-xs"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Start the explainer</span>
            </a>
            <a
              href="#live-demo"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 hover:border-emerald-400/60 hover:text-emerald-100 sm:w-auto sm:text-xs"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 shadow-glow-sm" />
              <span>Skip to live CMA-ES demo</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 grid grid-cols-1 gap-3 text-[0.85rem] text-slate-300/90 sm:grid-cols-2 sm:text-[0.7rem]"
          >
            <div className="rounded-xl border border-slate-800/70 bg-slate-950/60 p-3">
              <div className="text-slate-400">Designed for</div>
              <div className="mt-1 font-semibold text-slate-100">
                Expensive simulations, weird search spaces, no gradients
              </div>
            </div>
            <div className="rounded-xl border border-slate-800/70 bg-slate-950/60 p-3">
              <div className="text-slate-400">Powered by</div>
              <div className="mt-1 font-semibold text-slate-100">
                Rust CMA-ES cores for browser + Python, plus live WASM demo
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="relative z-0 mt-10 flex-1 lg:mt-0"
        >
          <div className="relative h-[320px] w-full rounded-3xl border border-slate-800/80 bg-slate-950/60 shadow-glow-lg backdrop-blur-sm lg:h-[380px]">
            <CovarianceScene />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 to-transparent" />
          </div>
          <div className="mt-3 text-[0.7rem] text-slate-400">
            The glowing ellipsoid is the current covariance; points are sampled candidate designs. As
            CMA-ES learns the landscape, that ellipsoid tilts and shrinks into the right valley.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
