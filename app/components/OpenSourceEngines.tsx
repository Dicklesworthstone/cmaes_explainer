"use client";

import { motion } from "framer-motion";
import { Cpu, Globe2, TerminalSquare, Code2, ExternalLink } from "lucide-react";

export function OpenSourceEngines() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-6 flex flex-col h-full hover:border-sky-500/30 transition-colors"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Globe2 className="h-5 w-5 text-sky-400" />
          </div>
          <span className="font-bold uppercase tracking-wider text-sm text-sky-100">
            wasm_cmaes
          </span>
        </div>
        
        <p className="text-sm leading-relaxed text-slate-300 mb-4">
          Rust CMA-ES compiled to WebAssembly, wrapped in a clean JS/TS API and paired with a D3 + Tailwind playground. Drop a serious optimizer into any browser tool and watch the covariance ellipsoid adapt live.
        </p>
        
        <div className="bg-slate-950/50 rounded-xl border border-white/5 p-3 mb-4 font-mono text-xs text-slate-300 overflow-x-auto">
<pre>{`import init, { fmin } from "./pkg/cmaes_wasm.js";

await init();

const res = fmin(new Float64Array([3, -2]), 0.8, x => x[0]*x[0] + x[1]*x[1]);
console.log(res.best_f, res.best_x());`}</pre>
        </div>

        <ul className="space-y-2 mb-6 text-xs text-slate-400 leading-relaxed list-disc pl-4 marker:text-sky-500">
          <li>Two bundles: `pkg/` sequential and `pkg-par/` with SIMD + Rayon for threaded browsers.</li>
          <li>Ask/tell loop, batch API, deterministic seeded RNG, JSON state save/restore.</li>
          <li>Benchmark dashboard to compare against a naive μ+λ ES.</li>
        </ul>

        <div className="mt-auto flex flex-wrap gap-3">
          <a
            href="https://github.com/Dicklesworthstone/wasm_cmaes"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Repo</span>
          </a>
          <a
            href="https://dicklesworthstone.github.io/wasm_cmaes/examples/viz-benchmarks.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-medium text-sky-200 transition-colors hover:bg-sky-500/20 hover:border-sky-500/50"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Live Playground</span>
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-card p-6 flex flex-col h-full hover:border-emerald-500/30 transition-colors"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <TerminalSquare className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="font-bold uppercase tracking-wider text-sm text-emerald-100">
            fast_cmaes
          </span>
        </div>

        <p className="text-sm leading-relaxed text-slate-300 mb-4">
          A hyper-optimized Rust core with a friendly Python surface. Feels like <code>scipy.optimize</code>, runs like a modern ES: SIMD, Rayon, deterministic seeds, restarts, constraints, and a Rich TUI.
        </p>

        <div className="bg-slate-950/50 rounded-xl border border-white/5 p-3 mb-4 font-mono text-xs text-slate-300 overflow-x-auto">
<pre>{`python -m pip install fast-cmaes
from fastcma import fmin

xmin, es = fmin(sphere, [0.5, -0.2], sigma=0.3, maxfevals=4000)`}</pre>
        </div>

        <ul className="space-y-2 mb-6 text-xs text-slate-400 leading-relaxed list-disc pl-4 marker:text-emerald-500">
           <li>APIs: <code>fmin</code>, <code>fmin_vec</code>, <code>fmin_constrained</code>, and <code>CMAES</code> class.</li>
           <li>Full or diagonal covariance, restart helpers, optional LAPACK eigensolver.</li>
           <li>Rich-powered terminal UI to watch σ, best-f, and eval counts live.</li>
        </ul>

        <div className="mt-auto">
          <a
            href="https://github.com/Dicklesworthstone/fast_cmaes"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Repo</span>
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
