"use client";

import { Github, Heart, ExternalLink, Globe2, Terminal, Sparkles, UserCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto mt-28 sm:mt-36 max-w-7xl px-4 sm:px-6 pb-16 pt-12 border-t border-white/10">
      {/* Author & Creator Spotlight Card */}
      <div className="mb-12 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-slate-900/90 via-sky-950/20 to-purple-950/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-[background-color] duration-700 pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-[background-color] duration-700 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-300">
              <UserCheck className="h-3.5 w-3.5 text-sky-400" />
              <span>Created & Engineered by Jeffrey Emanuel</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
              An Interactive Journey Through Covariance Matrix Adaptation
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Designed, derived, and built by{" "}
              <a
                href="https://jeffreyemanuel.com/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sky-300 hover:text-white underline decoration-sky-400/50 hover:decoration-sky-300 underline-offset-4 transition-colors"
              >
                Jeffrey Emanuel
              </a>
              . Explorable interactive animations, SIMD WebAssembly optimization kernels, and real-time 3D phase-space visualization.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
            <a
              href="https://jeffreyemanuel.com/"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-95 transition-[transform,background-image,box-shadow] min-h-[48px] touch-manipulation"
            >
              <Globe2 className="h-4 w-4" />
              <span>JeffreyEmanuel.com</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>

            <a
              href="https://github.com/Dicklesworthstone/cmaes_explainer"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 hover:border-white/20 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:text-white transition-[background-color,border-color,color,transform] min-h-[48px] touch-manipulation active:scale-95"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Navigation Columns */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            <h4 className="text-sm font-bold text-white font-display">CMA-ES Interactive Explainer</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            An explorable explanation of the Covariance Matrix Adaptation Evolution Strategy, based on the essay by{" "}
            <a
              href="https://jeffreyemanuel.com/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-200 font-semibold hover:text-sky-300 underline decoration-white/20 transition-colors"
            >
              Jeffrey Emanuel
            </a>
            .
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <span>Written with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500/40 text-rose-400 inline" />
            <span>for black-box optimization</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">References & Papers</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <a
                href="https://arxiv.org/abs/1604.00772"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300 transition-colors inline-flex items-center gap-1.5 min-h-[32px] sm:min-h-0 py-1 sm:py-0 touch-manipulation"
              >
                <span>Hansen (2016): The CMA Evolution Strategy: A Tutorial</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
            <li>
              <a
                href="https://arxiv.org/abs/1106.4158"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300 transition-colors inline-flex items-center gap-1.5 min-h-[32px] sm:min-h-0 py-1 sm:py-0 touch-manipulation"
              >
                <span>Akimoto et al.: Information-Geometric CMA-ES</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
            <li>
              <a
                href="https://cma-es.github.io/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300 transition-colors inline-flex items-center gap-1.5 min-h-[32px] sm:min-h-0 py-1 sm:py-0 touch-manipulation"
              >
                <span>Nikolaus Hansen&apos;s CMA-ES Portal</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Open Source Engines</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <a
                href="https://github.com/Dicklesworthstone/wasm_cmaes"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300 transition-colors inline-flex items-center gap-2 min-h-[32px] sm:min-h-0 py-1 sm:py-0 touch-manipulation"
              >
                <Globe2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span>wasm_cmaes (WebAssembly + SIMD)</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Dicklesworthstone/fast_cmaes"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-300 transition-colors inline-flex items-center gap-2 min-h-[32px] sm:min-h-0 py-1 sm:py-0 touch-manipulation"
              >
                <Terminal className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>fast_cmaes (Python + Rust Core)</span>
              </a>
            </li>
            <li>
              <a
                href="https://jeffreyemanuel.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-300 transition-colors inline-flex items-center gap-2 min-h-[32px] sm:min-h-0 py-1 sm:py-0 touch-manipulation"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>JeffreyEmanuel.com Portfolio & Writing</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5 text-[0.75rem] text-slate-500">
        <div>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://jeffreyemanuel.com/"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-sky-300 transition-colors"
          >
            Jeffrey Emanuel
          </a>
          . Open source under MIT License.
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://jeffreyemanuel.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors py-1 touch-manipulation"
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>JeffreyEmanuel.com</span>
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://github.com/Dicklesworthstone/cmaes_explainer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors py-1 touch-manipulation"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
