"use client";

import { motion } from "framer-motion";
import { Wand2, Cpu } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CovarianceScene } from "./CovarianceScene";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!gradientRef.current || prefersReducedMotion) return;

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
  }, [prefersReducedMotion]);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
      <div
        ref={gradientRef}
        className="pointer-events-none absolute inset-0 bg-radial-soft mix-blend-screen opacity-60"
      />

      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-12 top-40 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 sm:gap-16 lg:flex-row lg:items-center">
        <div className="relative z-10 max-w-2xl space-y-8">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3.5 py-1.5 text-xs font-medium text-sky-200 shadow-[0_0_10px_rgba(14,165,233,0.15)] backdrop-blur-sm"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Derivative-free • Geometry-aware • Surprisingly elegant</span>
          </motion.div>

          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="text-balance font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-lg"
          >
            CMA-ES: <br />
            <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-amber-100 bg-clip-text text-transparent">
              My favorite black-box optimizer
            </span>
          </motion.h1>

          <div className="space-y-6 text-lg leading-relaxed text-slate-300">
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="text-balance max-w-xl"
            >
              If you have gradients, use them. But when gradients don’t exist—like in aircraft wing design, bridge engineering, or neural architecture search—<strong className="text-sky-100 font-semibold">CMA-ES quietly shines.</strong>
            </motion.p>
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.25 }}
              className="text-balance max-w-xl text-base text-slate-400"
            >
              This is a walkthrough of why it works, how it morphs a Gaussian into an inverse-Hessian stand‑in, and how to run it yourself without touching a single derivative.
            </motion.p>
          </div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center pt-2"
          >
            <a
              href="#what-is-cmaes"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all duration-300 hover:bg-sky-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Start the explainer
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            </a>
            <a
              href="#live-demo"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/40 px-6 py-3 text-sm font-medium text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-900/60 hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] group-hover:shadow-[0_0_12px_#34d399]" />
              Skip to live demo
            </a>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="glass-card p-4">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Designed for</div>
              <div className="mt-1.5 text-sm font-semibold text-slate-200 leading-snug">
                Expensive simulations, weird search spaces, no gradients
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Powered by</div>
              <div className="mt-1.5 text-sm font-semibold text-slate-200 leading-snug">
                Rust CMA-ES cores for browser + Python, plus live WASM demo
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative z-0 mt-12 flex-1 lg:mt-0 lg:ml-12"
        >
          <div className="relative aspect-square max-h-[500px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/30 shadow-2xl backdrop-blur-sm">
            <CovarianceScene />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(2,6,23,0.6)]" />
            <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/5 bg-slate-950/60 p-4 backdrop-blur-md">
               <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-sky-300">Interactive:</strong> The glowing ellipsoid is the current covariance matrix; points are sampled candidate designs. As CMA-ES learns the landscape, the ellipsoid tilts and shrinks into the optimal valley.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
