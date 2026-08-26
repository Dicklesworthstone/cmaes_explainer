"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Globe2, TerminalSquare, Code2, ExternalLink, Copy, Check, Sparkles, Zap, Shield } from "lucide-react";

export function OpenSourceEngines() {
  const [activeTabWasm, setActiveTabWasm] = useState<"ts" | "rust">("ts");
  const [activeTabFast, setActiveTabFast] = useState<"python" | "rust">("python");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const wasmTsCode = `import init, { fmin } from "@dicklesworthstone/wasm_cmaes";

await init(); // Initialize SIMD WebAssembly module

// Minimize 10D Rosenbrock function
const dim = 10;
const x0 = new Float64Array(dim).fill(0.5);
const sigma0 = 0.3;

const result = fmin(x0, sigma0, (x: Float64Array) => {
  let sum = 0;
  for (let i = 0; i < x.length - 1; i++) {
    sum += 100 * (x[i+1] - x[i]**2)**2 + (1 - x[i])**2;
  }
  return sum;
});

console.log("Optimal Solution:", result.best_x());
console.log("Best Fitness:", result.best_f);`;

  const wasmRustCode = `use wasm_cmaes::CMAES;

#[wasm_bindgen]
pub fn run_optimization(dim: usize, max_evals: usize) -> Vec<f64> {
    let mut es = CMAES::new(dim, vec![0.5; dim], 0.3);
    while es.eval_count() < max_evals && !es.converged() {
        let pop = es.ask();
        let fits: Vec<f64> = pop.iter().map(|x| rosenbrock(x)).collect();
        es.tell(&pop, &fits);
    }
    es.best_x().to_vec()
}`;

  const fastPyCode = `# Install: pip install fast-cmaes
from fastcma import fmin, CMAES
import numpy as np

def rosenbrock(x):
    return np.sum(100.0 * (x[1:] - x[:-1]**2.0)**2.0 + (1 - x[:-1])**2.0)

# Run hyper-optimized SIMD + Rayon core
xmin, es = fmin(
    objective=rosenbrock,
    x0=np.zeros(20),
    sigma=0.5,
    maxfevals=10_000,
    restarts=3 # IPOP restart policy
)

print(f"Optimal x: {xmin}")
print(f"Evaluations: {es.counteval}")`;

  const fastRustCode = `use fast_cmaes::{CMAES, Options};

fn main() {
    let opts = Options::default()
        .with_dim(20)
        .with_sigma(0.5)
        .with_active_cma(true);

    let mut optimizer = CMAES::new(opts);
    let result = optimizer.optimize(|x| {
        // Multi-threaded parallel batch evaluation via Rayon
        rosenbrock_simd(x)
    });
    println!("Converged: {:?}", result);
}`;

  return (
    <div className="space-y-8">
      <div className="prose-cmaes">
        <p className="text-lg text-slate-300 leading-relaxed">
          High-performance production implementations in Rust, targeting WebAssembly for browser deployment
          and native C/Python bindings for cluster workloads.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* wasm_cmaes Engine Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6 md:p-8 flex flex-col justify-between border-white/10 hover:border-sky-500/30 transition-colors duration-300 shadow-2xl"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Globe2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">wasm_cmaes</h3>
                  <p className="text-xs text-slate-400">WebAssembly + SIMD + Web Worker Parallelism</p>
                </div>
              </div>

              <span className="text-[0.65rem] font-mono font-bold text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                v1.2.0
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Zero-overhead Rust CMA-ES compiled to WebAssembly. Features sequential and multi-threaded Rayon worker pools with SIMD matrix decomposition.
            </p>

            {/* Code Tabs */}
            <div className="rounded-2xl bg-slate-950/80 border border-white/10 overflow-hidden mb-6">
              <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-4 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTabWasm("ts")}
                    className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-colors ${
                      activeTabWasm === "ts" ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    TypeScript
                  </button>
                  <button
                    onClick={() => setActiveTabWasm("rust")}
                    className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-colors ${
                      activeTabWasm === "rust" ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Rust
                  </button>
                </div>

                <button
                  onClick={() => copyCode(activeTabWasm === "ts" ? wasmTsCode : wasmRustCode, "wasm")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Copy Code"
                >
                  {copiedKey === "wasm" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-64">
                <code>{activeTabWasm === "ts" ? wasmTsCode : wasmRustCode}</code>
              </pre>
            </div>

            <ul className="space-y-2 mb-6 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-sky-400 shrink-0" />
                <span>Two distribution bundles: <code>pkg/</code> (pure JS) and <code>pkg-par/</code> (SharedArrayBuffer + Rayon).</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Deterministic seeded LCG random number generator for reproducible simulation replays.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
            <a
              href="https://github.com/Dicklesworthstone/wasm_cmaes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Code2 className="h-4 w-4" />
              <span>GitHub Repository</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </motion.div>

        {/* fast_cmaes Engine Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-6 md:p-8 flex flex-col justify-between border-white/10 hover:border-emerald-500/30 transition-colors duration-300 shadow-2xl"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <TerminalSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">fast_cmaes</h3>
                  <p className="text-xs text-slate-400">Native Python Bindings + AVX-512 SIMD Acceleration</p>
                </div>
              </div>

              <span className="text-[0.65rem] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                PyPI: fast-cmaes
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              A high-throughput Rust engine with a drop-in <code>scipy.optimize</code> compatible surface. 10–30× faster than pure Python implementations on high dimensions.
            </p>

            {/* Code Tabs */}
            <div className="rounded-2xl bg-slate-950/80 border border-white/10 overflow-hidden mb-6">
              <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-4 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTabFast("python")}
                    className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-colors ${
                      activeTabFast === "python" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Python (NumPy)
                  </button>
                  <button
                    onClick={() => setActiveTabFast("rust")}
                    className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-colors ${
                      activeTabFast === "rust" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Rust Native
                  </button>
                </div>

                <button
                  onClick={() => copyCode(activeTabFast === "python" ? fastPyCode : fastRustCode, "fast")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Copy Code"
                >
                  {copiedKey === "fast" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-64">
                <code>{activeTabFast === "python" ? fastPyCode : fastRustCode}</code>
              </pre>
            </div>

            <ul className="space-y-2 mb-6 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Rich terminal UI displaying live step size $\sigma$, condition number $\kappa(C)$, and best fitness.</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-sky-400 shrink-0" />
                <span>Full support for diagonal sep-CMA-ES, active covariance, boundary repair, and IPOP/BIPOP restarts.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
            <a
              href="https://github.com/Dicklesworthstone/fast_cmaes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Code2 className="h-4 w-4" />
              <span>GitHub Repository</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
