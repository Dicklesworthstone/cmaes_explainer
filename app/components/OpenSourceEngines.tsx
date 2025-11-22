"use client";

import { motion } from "framer-motion";
import { Cpu, Globe2, TerminalSquare, Code2, ExternalLink } from "lucide-react";

export function OpenSourceEngines() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border border-sky-500/35 bg-slate-950/70 p-4 shadow-glow-sm"
      >
        <div className="mb-2 inline-flex items-center gap-2 text-[0.7rem] text-sky-200">
          <Globe2 className="h-4 w-4" />
          <span className="font-semibold uppercase tracking-wide">
            wasm_cmaes – CMA-ES in the browser
          </span>
        </div>
        <p className="text-xs leading-relaxed text-slate-200">
          <code>wasm_cmaes</code> is a Rust implementation of CMA-ES compiled to WebAssembly with
          <span className="font-mono text-emerald-300"> wasm-bindgen</span>. It comes with:
        </p>
        <ul className="mt-2 list-disc space-y-1 text-[0.7rem] text-slate-300 pl-5">
          <li>A clean JS/TS API (<code>fmin</code>, batch runner, ask/tell loop).</li>
          <li>
            Two builds: sequential (<code>pkg/</code>) and SIMD/Rayon-enabled (<code>pkg-par/</code>)
            for real parallelism where browsers allow it.
          </li>
          <li>
            A D3 + Tailwind playground (<code>examples/viz-benchmarks.html</code>) that lets you watch
            CMA-ES chew through classic test functions in real time.
          </li>
        </ul>
        <p className="mt-2 text-[0.7rem] text-slate-300">
          You can load it directly in a browser app:
        </p>
        <pre className="mt-2 text-[0.7rem]">
{`import init, { fmin } from "./pkg/cmaes_wasm.js";

await init(); // initializes the WASM module

const start = new Float64Array([3.0, -2.0]);
const sigma0 = 0.8;

const res = fmin(start, sigma0, (x) => x[0] * x[0] + x[1] * x[1]);
console.log(res.best_f, res.best_x());`}
        </pre>
        <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem]">
          <a
            href="https://github.com/Dicklesworthstone/wasm_cmaes"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-sky-400/60 bg-slate-950/70 px-2.5 py-1 text-sky-100 hover:bg-slate-900"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Repo: wasm_cmaes</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://dicklesworthstone.github.io/wasm_cmaes/examples/viz-benchmarks.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 text-emerald-100 hover:bg-emerald-500/20"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Live playground</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="rounded-2xl border border-emerald-500/40 bg-slate-950/70 p-4"
      >
        <div className="mb-2 inline-flex items-center gap-2 text-[0.7rem] text-emerald-200">
          <TerminalSquare className="h-4 w-4" />
          <span className="font-semibold uppercase tracking-wide">
            fast_cmaes – Rust core, first-class Python
          </span>
        </div>
        <p className="text-xs leading-relaxed text-slate-200">
          <code>fast_cmaes</code> pushes hard on performance while still feeling like a very normal
          Python library:
        </p>
        <ul className="mt-2 list-disc space-y-1 text-[0.7rem] text-slate-300 pl-5">
          <li>
            Published to PyPI as <code>fast-cmaes</code> (module name <code>fastcma</code>).
          </li>
          <li>
            Multiple entry points: <code>fmin</code>, <code>fmin_vec</code>, <code>fmin_constrained</code>,
            and a configurable <code>CMAES</code> class.
          </li>
          <li>
            SIMD-accelerated dot products, optional Rayon-based parallel objective evaluation,
            full/diagonal covariance modes, restart helpers, deterministic seeds.
          </li>
          <li>
            A Rich-powered TUI demo so you can literally watch <code>σ</code> and best-f evolve in your
            terminal.
          </li>
        </ul>
        <p className="mt-2 text-[0.7rem] text-slate-300">Installation and minimal usage:</p>
        <pre className="mt-2 text-[0.7rem]">
{`python -m pip install fast-cmaes

from fastcma import fmin

def sphere(x):
    return sum(v * v for v in x)

xmin, es = fmin(sphere, [0.5, -0.2, 0.8],
                sigma=0.3,
                maxfevals=4000,
                ftarget=1e-12)
print("xmin", xmin)`}
        </pre>
        <p className="mt-2 text-[0.7rem] text-slate-300">
          Under the hood the Python API is just driving the same Rust core that powers the benchmarks
          and TUI. The whole point is to get “serious” CMA-ES performance without giving up the
          convenience of simple Python callables as objectives.
        </p>
        <div className="mt-3">
          <a
            href="https://github.com/Dicklesworthstone/fast_cmaes"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-slate-950/70 px-2.5 py-1 text-[0.7rem] text-emerald-100 hover:bg-slate-900"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Repo: fast_cmaes</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
