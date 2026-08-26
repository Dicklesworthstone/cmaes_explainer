"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe2, TerminalSquare, Code2, ExternalLink, Copy, Check, Zap, Shield, FileCode } from "lucide-react";

type Lang = "ts" | "rust" | "python";

function highlightCodeLine(line: string, lang: Lang): React.ReactNode {
  if (lang === "python") {
    const hashIdx = line.indexOf("#");
    if (hashIdx !== -1) {
      const codePart = line.slice(0, hashIdx);
      const commentPart = line.slice(hashIdx);
      return (
        <>
          {codePart ? highlightTokens(codePart, lang) : null}
          <span className="text-slate-500 italic">{commentPart}</span>
        </>
      );
    }
  } else {
    const slashIdx = line.indexOf("//");
    if (slashIdx !== -1) {
      const codePart = line.slice(0, slashIdx);
      const commentPart = line.slice(slashIdx);
      return (
        <>
          {codePart ? highlightTokens(codePart, lang) : null}
          <span className="text-slate-500 italic">{commentPart}</span>
        </>
      );
    }
  }

  return highlightTokens(line, lang);
}

function highlightTokens(code: string, lang: Lang): React.ReactNode[] {
  const tokenRegex = new RegExp(
    '(f?"(?:[^"\\\\]|\\\\.)*"|f?\'(?:[^\'\\\\]|\\\\.)*\'|#\\[[a-zA-Z0-9_]+\\]|\\b(?:vec!|println!|format!|panic!)\\b|\\b\\d+(?:\\.\\d+)?(?:_\\d+)*\\b|=>|->|\\*\\*|\\+=|-=|\\*=|/=|==|!=|<=|>=|&&|\\|\\||::|[+\\-*%<>=!&|/]|[{}()\\[\\],;.:]|\\b[a-zA-Z_][a-zA-Z0-9_]*\\b|\\s+)',
    'g'
  );

  const matches = code.match(tokenRegex) || [code];
  return matches.map((token, i) => {
    if (/^\s+$/.test(token)) {
      return <span key={i}>{token}</span>;
    }

    if (token.startsWith("#[")) {
      return (
        <span key={i} className="text-amber-400 font-medium">
          {token}
        </span>
      );
    }

    if (
      token.startsWith('"') ||
      token.startsWith("'") ||
      token.startsWith('f"') ||
      token.startsWith("f'")
    ) {
      if (token.startsWith('f"') || token.startsWith("f'")) {
        const subParts = token.split(/(\{.*?\})/g);
        return (
          <span key={i} className="text-emerald-300">
            {subParts.map((sp, idx) => {
              if (sp.startsWith("{") && sp.endsWith("}")) {
                return (
                  <span key={idx}>
                    <span className="text-pink-400 font-bold">{"{"}</span>
                    <span className="text-amber-200 font-medium">
                      {sp.slice(1, -1)}
                    </span>
                    <span className="text-pink-400 font-bold">{"}"}</span>
                  </span>
                );
              }
              return sp;
            })}
          </span>
        );
      }
      return (
        <span key={i} className="text-emerald-300">
          {token}
        </span>
      );
    }

    if (/^(?:vec!|println!|format!|panic!)$/.test(token)) {
      return (
        <span key={i} className="text-indigo-400 font-semibold">
          {token}
        </span>
      );
    }

    if (/^\d/.test(token) || /^(?:true|false|True|False)$/.test(token)) {
      return (
        <span key={i} className="text-amber-300">
          {token}
        </span>
      );
    }

    const keywords = new Set([
      "import",
      "from",
      "const",
      "let",
      "for",
      "return",
      "await",
      "new",
      "as",
      "def",
      "while",
      "use",
      "pub",
      "fn",
      "mut",
      "struct",
    ]);
    if (keywords.has(token)) {
      return (
        <span key={i} className="text-pink-400 font-semibold">
          {token}
        </span>
      );
    }

    const types = new Set([
      "Float64Array",
      "number",
      "string",
      "boolean",
      "Array",
      "np",
      "CMAES",
      "Options",
      "Vec",
      "usize",
      "f64",
      "fastcma",
      "wasm_cmaes",
      "fast_cmaes",
    ]);
    if (types.has(token)) {
      return (
        <span key={i} className="text-cyan-300 font-medium">
          {token}
        </span>
      );
    }

    const functions = new Set([
      "init",
      "fmin",
      "fill",
      "run_optimization",
      "rosenbrock",
      "rosenbrock_simd",
      "ask",
      "tell",
      "collect",
      "iter",
      "map",
      "best_x",
      "to_vec",
      "eval_count",
      "converged",
      "optimize",
      "default",
      "with_dim",
      "with_sigma",
      "with_active_cma",
      "main",
      "zeros",
      "sum",
      "print",
      "log",
    ]);
    if (functions.has(token)) {
      return (
        <span key={i} className="text-sky-300 font-medium">
          {token}
        </span>
      );
    }

    const properties = new Set([
      "objective",
      "x0",
      "sigma",
      "maxfevals",
      "restarts",
      "length",
      "best_f",
      "counteval",
    ]);
    if (properties.has(token)) {
      return (
        <span key={i} className="text-purple-300">
          {token}
        </span>
      );
    }

    if (
      /^(?:=>|->|\*\*|\+=|-=|\*=|(?:\/=)|==|!=|<=|>=|&&|\|\||::|[+\-*%=<>!&|]|\/)$/.test(
        token
      )
    ) {
      return (
        <span key={i} className="text-rose-400 font-medium">
          {token}
        </span>
      );
    }

    if (/^[{}()\[\],;.:]$/.test(token)) {
      return (
        <span key={i} className="text-slate-400">
          {token}
        </span>
      );
    }

    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
      return (
        <span key={i} className="text-slate-100">
          {token}
        </span>
      );
    }

    return (
      <span key={i} className="text-slate-300">
        {token}
      </span>
    );
  });
}

function CodeBlockViewer({
  code,
  lang,
}: {
  code: string;
  lang: Lang;
}) {
  const lines = code.trim().split("\n");

  return (
    <div className="relative font-mono text-[0.8rem] leading-relaxed overflow-x-auto bg-[#030712]/95 p-4 rounded-b-2xl border-t border-white/5 shadow-inner max-h-72">
      <div className="table min-w-full">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className="table-row hover:bg-white/[0.03] transition-[background-color] group"
          >
            <span className="table-cell select-none pr-4 text-right text-slate-600 group-hover:text-slate-400 font-mono text-[0.7rem] w-8 align-top py-0.5 border-r border-white/5">
              {idx + 1}
            </span>
            <span className="table-cell pl-3 text-slate-100 whitespace-pre align-top py-0.5 font-mono">
              {highlightCodeLine(line, lang)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          className="glass-card p-6 md:p-8 flex flex-col justify-between border-white/10 hover:border-sky-500/30 transition-[border-color] duration-300 shadow-2xl"
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

            {/* Code Block with Syntax Highlighting */}
            <div className="rounded-2xl bg-slate-950/90 border border-white/10 overflow-hidden mb-6 shadow-xl ring-1 ring-white/5">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  {/* macOS traffic light window dots */}
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80 border border-rose-400/30" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80 border border-amber-400/30" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 border border-emerald-400/30" />
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => setActiveTabWasm("ts")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-[background-color,color,border-color] ${
                        activeTabWasm === "ts"
                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <FileCode className="h-3 w-3" />
                      <span>TypeScript</span>
                    </button>
                    <button
                      onClick={() => setActiveTabWasm("rust")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-[background-color,color,border-color] ${
                        activeTabWasm === "rust"
                          ? "bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <FileCode className="h-3 w-3" />
                      <span>Rust</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[0.7rem] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-950/60 border border-white/5">
                    {activeTabWasm === "ts" ? "rosenbrock.ts" : "lib.rs"}
                  </span>
                  <button
                    onClick={() => copyCode(activeTabWasm === "ts" ? wasmTsCode : wasmRustCode, "wasm")}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-[background-color,color,border-color] ${
                      copiedKey === "wasm"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5"
                    }`}
                    title="Copy Code"
                  >
                    {copiedKey === "wasm" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-[0.7rem]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span className="text-[0.7rem]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Body */}
              <CodeBlockViewer
                code={activeTabWasm === "ts" ? wasmTsCode : wasmRustCode}
                lang={activeTabWasm === "ts" ? "ts" : "rust"}
              />
            </div>

            <ul className="space-y-2 mb-6 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-sky-400 shrink-0" />
                <span>Two distribution bundles: <code className="text-sky-300 font-mono">pkg/</code> (pure JS) and <code className="text-sky-300 font-mono">pkg-par/</code> (SharedArrayBuffer + Rayon).</span>
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
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition-[background-color,border-color]"
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
          className="glass-card p-6 md:p-8 flex flex-col justify-between border-white/10 hover:border-emerald-500/30 transition-[border-color] duration-300 shadow-2xl"
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
              A high-throughput Rust engine with a drop-in <code className="text-emerald-300 font-mono">scipy.optimize</code> compatible surface. 10–30× faster than pure Python implementations on high dimensions.
            </p>

            {/* Code Block with Syntax Highlighting */}
            <div className="rounded-2xl bg-slate-950/90 border border-white/10 overflow-hidden mb-6 shadow-xl ring-1 ring-white/5">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  {/* macOS traffic light window dots */}
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80 border border-rose-400/30" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80 border border-amber-400/30" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 border border-emerald-400/30" />
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => setActiveTabFast("python")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-[background-color,color,border-color] ${
                        activeTabFast === "python"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <FileCode className="h-3 w-3" />
                      <span>Python</span>
                    </button>
                    <button
                      onClick={() => setActiveTabFast("rust")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-[background-color,color,border-color] ${
                        activeTabFast === "rust"
                          ? "bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <FileCode className="h-3 w-3" />
                      <span>Rust</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[0.7rem] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-950/60 border border-white/5">
                    {activeTabFast === "python" ? "optimize.py" : "main.rs"}
                  </span>
                  <button
                    onClick={() => copyCode(activeTabFast === "python" ? fastPyCode : fastRustCode, "fast")}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-[background-color,color,border-color] ${
                      copiedKey === "fast"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5"
                    }`}
                    title="Copy Code"
                  >
                    {copiedKey === "fast" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-[0.7rem]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span className="text-[0.7rem]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Body */}
              <CodeBlockViewer
                code={activeTabFast === "python" ? fastPyCode : fastRustCode}
                lang={activeTabFast === "python" ? "python" : "rust"}
              />
            </div>

            <ul className="space-y-2 mb-6 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Rich terminal UI displaying live step size <code className="text-amber-300 font-bold">σ</code>, condition number <code className="text-purple-300 font-bold">κ(C)</code>, and best fitness.</span>
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
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition-[background-color,border-color]"
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
