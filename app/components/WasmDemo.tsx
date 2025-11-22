"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function WasmDemo() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  return (
    <div className="space-y-6">
      <p className="prose-cmaes">
        The nice thing about having a Rust core that targets WebAssembly is that we can ship a full
        CMA-ES playground directly into the browser. The panel below is just your
        <code>wasm_cmaes</code> viz, wired in as a static asset under <code>public/wasm-demo/</code>.
      </p>
      <p className="prose-cmaes text-sm text-slate-300">
        Rebuild it yourself with <code>scripts/build-all.sh</code>; parallelism needs wasm threads
        and atomics enabled. The dashboard lets you toggle benchmark functions, seeds, and
        population sizes to see how the covariance ellipsoid learns the metric in real time.
      </p>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="glass-card overflow-hidden p-0"
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/50 backdrop-blur-md px-4 py-3 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="font-bold uppercase tracking-wide text-[0.7rem] text-slate-200">
              CMA-ES Landscape Explorer
            </span>
          </div>
          <span className="text-[0.65rem] text-slate-500 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
            powered by wasm_cmaes
          </span>
        </div>
        <div className="aspect-[16/9] w-full bg-[#0B1121]">
          {!loaded && !errored && (
            <div className="flex h-full items-center justify-center text-sm text-slate-400 animate-pulse">
              Loading WASM explorer...
            </div>
          )}
          {errored && (
            <div className="flex h-full items-center justify-center text-sm text-amber-200 bg-slate-900/80 px-4 text-center">
              Couldn’t load the WASM demo assets. Run <code>./scripts/pull_wasm_demo.sh</code> or check
              your network.
            </div>
          )}
          <iframe
            src="/wasm-demo/examples/viz-benchmarks.html"
            className="h-full w-full border-0 mix-blend-luminosity opacity-90 hover:opacity-100 hover:mix-blend-normal transition-all duration-500"
            loading="lazy"
            title="CMA-ES WASM visualization"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            aria-label="CMA-ES WASM visualization"
          />
        </div>
      </motion.div>
      <p className="text-[0.75rem] text-slate-500 leading-relaxed border-l-2 border-white/10 pl-4">
        Implementation detail: the Next.js app doesn’t try to be clever about bundling the wasm
        module. We just build <code>wasm_cmaes</code> with its own scripts and copy
        <code>examples/</code>, <code>pkg/</code>, and <code>pkg-par/</code> into
        <code>public/wasm-demo/</code>. The browser does the rest.
      </p>
    </div>
  );
}
