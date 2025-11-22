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
          Rust CMA-ES compiled to WebAssembly, wrapped in a clean JS/TS API and paired with a D3 +
          Tailwind playground. Drop a serious optimizer into any browser tool and watch the
          covariance ellipsoid adapt live.
        </p>
        <ul className="mt-2 list-disc space-y-1 text-[0.7rem] text-slate-300 pl-5">
          <li>Two bundles: `pkg/` sequential and `pkg-par/` with SIMD + Rayon for threaded browsers.</li>
          <li>Ask/tell loop, batch API, deterministic seeded RNG, JSON state save/restore.</li>
          <li>Benchmark dashboard to compare against a naive μ+λ ES and see the “metric learning” effect.</li>
        </ul>
        <p className="mt-2 text-[0.7rem] text-slate-300">Minimal JS usage:</p>
        <pre className="mt-2 text-[0.7rem]">
{`import init, { fmin } from "./pkg/cmaes_wasm.js";

await init();

const res = fmin(new Float64Array([3, -2]), 0.8, x => x[0]*x[0] + x[1]*x[1]);
console.log(res.best_f, res.best_x());`}
        </pre>
        <p className="mt-2 text-[0.7rem] text-slate-300">
          To rebuild or teach with the full viz: <code>scripts/build-all.sh</code>, then open
          <code>examples/viz-benchmarks.html</code>; parallelism requires wasm threads + atomics
          enabled.
        </p>
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
          A hyper-optimized Rust core with a friendly Python surface. Feels like
          <code>scipy.optimize</code>, runs like a modern ES: SIMD, Rayon, deterministic seeds,
          restarts, constraints, vectorized objectives, and a Rich TUI.
        </p>
        <ul className="mt-2 list-disc space-y-1 text-[0.7rem] text-slate-300 pl-5">
          <li>PyPI: <code>fast-cmaes</code> (module <code>fastcma</code>); wheels for Linux/macOS/Windows.</li>
          <li>APIs: <code>fmin</code>, <code>fmin_vec</code>, <code>fmin_constrained</code>, and a configurable <code>CMAES</code> class.</li>
          <li>Full or diagonal covariance, restart helpers, seeded runs, optional LAPACK eigensolver and NumPy fast paths.</li>
          <li>Rich-powered terminal UI to watch σ, best-f, and eval counts live.</li>
        </ul>
        <p className="mt-2 text-[0.7rem] text-slate-300">Minimal Python usage:</p>
        <pre className="mt-2 text-[0.7rem]">
{`python -m pip install fast-cmaes

from fastcma import fmin

def sphere(x):
    return sum(v*v for v in x)

xmin, es = fmin(sphere, [0.5, -0.2, 0.8], sigma=0.3, maxfevals=4000, ftarget=1e-12)
print("xmin", xmin)`}
        </pre>
        <p className="mt-2 text-[0.7rem] text-slate-300">
          Build/dev loop: <code>maturin develop --release</code> (optionally <code>--features numpy_support,eigen_lapack</code>), or run
          <code>./scripts/setup_and_demo.sh</code> to spin up a <code>uv</code> env and launch the Rich TUI.
        </p>
        <p className="mt-2 text-[0.7rem] text-slate-300">
          Practical limit note: full CMA-ES is O(n²) inside; switch to the diagonal mode for cheap,
          very high-dimensional problems, or keep full covariance when each evaluation is costly and
          geometry learning matters most.
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
