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
    hasBemt: false
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    initFrankenSim().then((res) => setStatus(res));
  }, []);

  const isWasm = status.source === "wasm";

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900/90 border border-sky-500/30 hover:border-sky-400/60 backdrop-blur-md shadow-glow-sm transition-all cursor-pointer select-none"
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* Glowing Engine Icon */}
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

        {/* Text */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-300">Physics Powered by</span>
          <a
            href="https://frankensim.org"
            target="_blank"
            rel="noreferrer"
            className="text-sky-300 hover:text-sky-200 underline decoration-sky-400/40 hover:decoration-sky-300 font-bold inline-flex items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <span>FrankenSim.org</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-70" />
          </a>
        </div>

        {/* Engine Source Pill */}
        <span
          className={`text-[0.62rem] font-mono font-bold px-2 py-0.5 rounded-full border ${
            isWasm
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-300 border-amber-500/30"
          }`}
        >
          {isWasm ? "WASM Kernel" : "TS Fallback"}
        </span>
      </div>

      {/* Popover Details on click */}
      {showDetails && (
        <div className="absolute right-0 sm:left-0 sm:right-auto bottom-full mb-2 z-50 w-72 max-w-[calc(100vw-2rem)] p-3.5 rounded-2xl bg-slate-950/95 border border-white/10 shadow-2xl backdrop-blur-xl text-xs space-y-2.5 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Cpu className="h-4 w-4 text-sky-400" />
              <span>FrankenSim Physics Telemetry</span>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="text-slate-500 hover:text-slate-300 text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-[0.7rem] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={isWasm ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {isWasm ? "WebAssembly (Active)" : "High-Fidelity Fallback"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Truss LP Solver:</span>
              <span className={status.hasTrusspath ? "text-emerald-400" : "text-slate-500"}>
                {status.hasTrusspath ? "crates/fs-wasm" : "Analytical FEA"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Aero BEMT / Panel:</span>
              <span className={status.hasBemt ? "text-emerald-400" : "text-slate-500"}>
                {status.hasBemt ? "crates/fs-flyer-wasm" : "3D Lifting Line"}
              </span>
            </div>
            <div className="flex justify-between text-[0.65rem] text-slate-400 pt-1 border-t border-white/5">
              <span>Engine Stamp:</span>
              <span className="text-slate-300 truncate max-w-[150px]">{status.engineStamp}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
