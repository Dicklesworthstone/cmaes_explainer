"use client";

import { motion } from "framer-motion";

export function WasmDemo() {
  return (
    <div className="space-y-4">
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
        className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-glow-sm"
      >
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-2 text-[0.7rem] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400/80 shadow-glow-sm" />
            <span className="font-semibold uppercase tracking-wide text-[0.65rem] text-slate-200">
              CMA-ES Landscape Explorer
            </span>
          </div>
          <span className="text-slate-500">
            powered by <code>wasm_cmaes</code>
          </span>
        </div>
        <div className="aspect-[16/9] w-full">
          <iframe
            src="/wasm-demo/examples/viz-benchmarks.html"
            className="h-full w-full border-0 bg-slate-950"
            loading="lazy"
            title="CMA-ES WASM visualization"
          />
        </div>
      </motion.div>
      <p className="text-[0.7rem] text-slate-400">
        Implementation detail: the Next.js app doesn’t try to be clever about bundling the wasm
        module. We just build <code>wasm_cmaes</code> with its own scripts and copy
        <code>examples/</code>, <code>pkg/</code>, and <code>pkg-par/</code> into
        <code>public/wasm-demo/</code>. The browser does the rest.
      </p>
    </div>
  );
}
