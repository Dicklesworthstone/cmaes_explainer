"use client";

import { useEffect, useState } from "react";
import { Cpu, ExternalLink, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { initFrankenSim, FrankenSimStatus } from "../lib/frankensimPhysics";

export function FrankenSimBadge({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<FrankenSimStatus>({
    loaded: false,
    source: "ts-fallback",
    engineStamp: "Initializing...",
    hasTrusspath: false,
    hasFlyerAero: false,
    hasBemt: false,
    hasDemoPhysics: false
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let active = true;
    initFrankenSim().then((res) => {
      if (active) setStatus(res);
    });
    return () => {
      active = false;
    };
  }, []);

  const isWasm = status.source === "wasm";

  return (
    <div className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900/90 border border-sky-500/30 hover:border-sky-400/60 backdrop-blur-md shadow-glow-sm transition-[background-color,border-color,box-shadow] select-none ${className}`}>
      {/* Glowing Engine Icon & Toggle */}
      <button
        type="button"
        aria-label="Toggle FrankenSim physics telemetry"
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center gap-2 cursor-pointer focus:outline-none"
      >
        <div className="relative flex items-center justify-center">
          <span
            className={`absolute h-2 w-2 rounded-full ${
              isWasm ? "bg-emerald-400 animate-ping" : "bg-amber-400 animate-pulse"
            }`}
          />
          <span
            className={`relative h-2 w-2 rounded-full ${
              isWasm ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
        </div>
        <span className="text-slate-300 text-xs font-semibold">Physics Powered by</span>
      </button>

      {/* External Link */}
      <a
        href="https://frankensim.org"
        target="_blank"
        rel="noreferrer"
        className="text-sky-300 hover:text-sky-200 underline decoration-sky-400/40 hover:decoration-sky-300 font-bold text-xs inline-flex items-center gap-0.5"
      >
        <span>FrankenSim.org</span>
        <ExternalLink className="h-2.5 w-2.5 opacity-70" />
      </a>

      {/* Engine Source Pill */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        aria-label="Toggle telemetry details"
        className={`text-[0.62rem] font-mono font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
          isWasm
            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
        }`}
      >
        {isWasm ? "WASM Kernel" : "TS Fallback"}
      </button>

      {/* Popover Details on click */}
      {showDetails && (
        <div className="absolute right-0 sm:left-0 sm:right-auto bottom-full mb-2 z-50 w-72 max-w-[calc(100vw-2rem)] p-3.5 rounded-2xl bg-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl text-xs space-y-2.5 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Cpu className="h-4 w-4 text-sky-400" />
              <span>FrankenSim Physics Telemetry</span>
            </div>
            <button
              type="button"
              aria-label="Close telemetry popover"
              onClick={() => setShowDetails(false)}
              className="text-slate-500 hover:text-slate-300 text-xs px-1.5 py-0.5 rounded focus:outline-none"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-[0.7rem] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={isWasm ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {isWasm ? "WebAssembly (Loaded)" : "TS Analytic Models"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Wing/Bridge Physics:</span>
              <span className={status.hasDemoPhysics ? "text-emerald-400" : "text-slate-500"}>
                {status.hasDemoPhysics ? "fs-demo-physics-wasm" : "TS analytic model"}
              </span>
            </div>
            {/* With the demo-physics kernel live, evaluations early-return
                before the trusspath/BEMT probe paths, so those rows would
                advertise code that no longer runs. */}
            {!status.hasDemoPhysics && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">Truss LP Solver:</span>
                  <span className={status.hasTrusspath ? "text-emerald-400" : "text-slate-500"}>
                    {status.hasTrusspath ? "crates/fs-wasm" : "Analytic beam model"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Aero BEMT Probe:</span>
                  <span className={status.hasBemt ? "text-emerald-400" : "text-slate-500"}>
                    {status.hasBemt ? "crates/fs-flyer-wasm" : "3D Lifting Line"}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between text-[0.65rem] text-slate-400 pt-1 border-t border-white/5">
              <span>Engine Stamp:</span>
              <span className="text-slate-300 truncate max-w-[150px]">{status.engineStamp}</span>
            </div>
            <div className="text-[0.62rem] text-slate-500 leading-snug pt-1 border-t border-white/5">
              {status.hasDemoPhysics
                ? "Wing and bridge numbers are computed by the FrankenSim fs-demo-physics-wasm kernel; the TS models are the verified-identical fallback."
                : "Displayed numbers come from the analytic TS models; the WASM kernels are health-probed on each evaluation."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
