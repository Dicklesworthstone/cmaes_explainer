"use client";

import { motion } from "framer-motion";

export function WasmDemo() {
  return (
    <div className="space-y-6">
      <p className="prose-cmaes">
        The nice thing about having a Rust core that targets WebAssembly is that we can ship a full
        CMA-ES playground directly into the browser. The live embed is temporarily disabled while we
        sort out a crash, but the assets remain under <code>public/wasm-demo/</code>.
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
        <div className="aspect-[16/9] w-full bg-[#0B1121] flex items-center justify-center px-6 text-center text-slate-200">
          <div className="space-y-3">
            <div className="text-lg font-semibold text-emerald-200">Live demo temporarily disabled</div>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              The embedded iframe version of the WebAssembly explorer was causing page crashes, so
              we’ve paused it for now. You can still run the demo locally by building the
              <code> wasm_cmaes </code> assets with <code>scripts/build-all.sh</code> and opening
              <code> public/wasm-demo/examples/viz-benchmarks.html</code> directly.
            </p>
          </div>
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
