"use client";

import { Github, Heart, BookOpen, ExternalLink, Sparkles, Terminal, Globe2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto mt-36 max-w-7xl px-6 pb-16 pt-12 border-t border-white/10">
      <div className="grid gap-8 md:grid-cols-3 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            <h4 className="text-sm font-bold text-white font-display">CMA-ES Interactive Explainer</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            An explorable explanation of the Covariance Matrix Adaptation Evolution Strategy, based on the essay by{" "}
            <strong className="text-slate-200">Jeffrey Emanuel</strong>.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <span>Written with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500/40 text-rose-400 inline" />
            <span>for black-box optimization</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">References & Papers</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <a
                href="https://arxiv.org/abs/1604.00772"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300 transition-colors inline-flex items-center gap-1.5"
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
                className="hover:text-sky-300 transition-colors inline-flex items-center gap-1.5"
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
                className="hover:text-sky-300 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Nikolaus Hansen&apos;s CMA-ES Portal</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Open Source Engines</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <a
                href="https://github.com/Dicklesworthstone/wasm_cmaes"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300 transition-colors inline-flex items-center gap-1.5"
              >
                <Globe2 className="h-3.5 w-3.5 text-sky-400" />
                <span>wasm_cmaes (WebAssembly + SIMD)</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Dicklesworthstone/fast_cmaes"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
              >
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span>fast_cmaes (Python + Rust Core)</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Dicklesworthstone/cmaes_explainer"
                target="_blank"
                rel="noreferrer"
                className="hover:text-purple-300 transition-colors inline-flex items-center gap-1.5"
              >
                <Github className="h-3.5 w-3.5 text-purple-400" />
                <span>Explainer Repository</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5 text-[0.7rem] text-slate-500">
        <div>
          © {new Date().getFullYear()} Jeffrey Emanuel. All rights reserved. Open source under MIT License.
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Dicklesworthstone/cmaes_explainer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
