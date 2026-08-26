"use client";

import { motion } from "framer-motion";
import { Wand2, Cpu, Sparkles, Compass, ArrowDownRight, Layers, BarChart3 } from "lucide-react";
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
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-28">
      {/* Dynamic ambient backdrops */}
      <div
        ref={gradientRef}
        className="pointer-events-none absolute inset-0 bg-radial-soft mix-blend-screen opacity-60"
      />
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-sky-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -left-12 top-40 h-80 w-80 rounded-full bg-indigo-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 sm:gap-16 lg:flex-row lg:items-center">
        {/* Left Column: Pedagogical Thesis & Call to Action */}
        <div className="relative z-10 max-w-2xl space-y-8">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-sky-200 shadow-[0_0_15px_rgba(14,165,233,0.2)] backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-pulse" />
            <span>Interactive Explorable • Derivations • Live Simulations</span>
          </motion.div>

          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-lg"
          >
            CMA-ES: <br />
            <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-amber-100 bg-clip-text text-transparent">
              My favorite black-box optimizer
            </span>
          </motion.h1>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-300">
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="text-balance max-w-xl"
            >
              When gradients are cheap and smooth, Adam and SGD excel. But when gradients{" "}
              <strong className="text-sky-200 font-semibold">do not exist, suffer from severe noise, or cost hours per evaluation</strong>
              , such as in aircraft CFD, suspension bridge FEA, or discrete neural architecture search, CMA-ES is the standard workhorse.
            </motion.p>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.25 }}
              className="text-balance max-w-xl text-sm sm:text-base text-slate-400"
            >
              Instead of stepping a single point downhill, CMA-ES maintains a <strong className="text-slate-200">Gaussian search distribution</strong> and iteratively reshapes its mean and covariance matrix to mirror the objective&apos;s inverse Hessian, discovering landscape curvature without calculating derivatives.
            </motion.p>
          </div>

          {/* Interactive CTAs */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center pt-2"
          >
            <a
              href="#what-is-cmaes"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(14,165,233,0.4)] transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(14,165,233,0.6)] focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <Compass className="h-4 w-4 transition-transform group-hover:rotate-45" />
              <span>Explore Chapter 1: The Core Idea</span>
            </a>

            <a
              href="#live-demo"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-6 py-3.5 text-sm font-medium text-slate-200 backdrop-blur-md transition-[border-color,background-color,color,box-shadow] duration-300 hover:border-emerald-500/50 hover:bg-slate-900/90 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] group-hover:shadow-[0_0_12px_#34d399]" />
              <span>Launch Live Playground</span>
            </a>
          </motion.div>

          {/* Micro-Features Row */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid max-w-xl grid-cols-1 gap-3.5 sm:grid-cols-3 pt-2"
          >
            <div className="glass-card p-3.5 border-white/5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                <Layers className="h-3.5 w-3.5 text-sky-400" />
                <span>Zero Gradients</span>
              </div>
              <div className="mt-1 text-[0.75rem] text-slate-400 leading-snug">
                Only needs function evaluations; invariant to monotone scaling.
              </div>
            </div>

            <div className="glass-card p-3.5 border-white/5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <Compass className="h-3.5 w-3.5 text-emerald-400" />
                <span>Learns Geometry</span>
              </div>
              <div className="mt-1 text-[0.75rem] text-slate-400 leading-snug">
                Covariance stretches along valleys and shrinks across ridges.
              </div>
            </div>

            <div className="glass-card p-3.5 border-white/5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
                <Cpu className="h-3.5 w-3.5 text-purple-400" />
                <span>WASM + Rust Core</span>
              </div>
              <div className="mt-1 text-[0.75rem] text-slate-400 leading-snug">
                Production-grade SIMD speed in browser and Python.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive 3D Covariance Stage */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative z-0 flex-1 lg:ml-6"
        >
          <div className="relative aspect-square max-h-[540px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <CovarianceScene />
            
            {/* Soft edge vignette */}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(2,6,23,0.8)]" />
          </div>

          <div className="mt-3 flex items-center justify-between px-2 text-[0.75rem] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Interactive 3D Simulation • Drag to rotate camera • Scrub timeline</span>
            </div>
            <a
              href="#technical-addendum"
              className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium transition-colors"
            >
              <span>See the Math</span>
              <ArrowDownRight className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
