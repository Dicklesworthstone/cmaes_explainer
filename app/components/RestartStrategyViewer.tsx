"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@headlessui/react";
import { RefreshCw, Timer, Activity } from "lucide-react";

const W = 520;
const H = 220;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function simulate({ mode }: { mode: "ipop" | "bipop" }) {
  const rand = rng(mode === "ipop" ? 42 : 84);
  const gens = 120;
  const fitness: number[] = [];
  const lambdaTimeline: number[] = [];
  let best = 2.5;
  let lambda = 8;
  let budget = 0;

  for (let g = 0; g < gens; g++) {
    // restart schedule
    if (mode === "ipop") {
      if (g % 25 === 0 && g !== 0) lambda = Math.min(128, lambda * 2);
    } else {
      // bipop alternates small/large; simple alternation here
      if (g % 20 === 0 && g !== 0) {
        lambda = lambda === 8 ? 64 : 8;
      }
    }
    lambdaTimeline.push(lambda);

    // simulate progress: larger lambda → better global move, slower local rate
    const noise = (rand() - 0.5) * 0.05;
    const globalGain = (lambda / 64) * 0.12;
    const localGain = 0.04 / Math.log2(lambda + 2);
    best = Math.max(0.02, best - globalGain - localGain + noise);
    fitness.push(best);
    budget += lambda;
  }
  return { fitness, lambdaTimeline };
}

export function RestartStrategyViewer() {
  const [mode, setMode] = useState<"ipop" | "bipop">("ipop");
  const data = useMemo(() => simulate({ mode }), [mode]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lambdaRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { fitness } = data;
    const maxF = Math.max(...fitness);
    const minF = Math.min(...fitness);
    const scaleX = (i: number) => (i / (fitness.length - 1)) * (W - 20) + 10;
    const scaleY = (v: number) => H - ((v - minF) / (maxF - minF + 1e-6)) * (H - 20) - 10;

    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0b132a");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(56,189,248,0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    fitness.forEach((v, i) => {
      const x = scaleX(i);
      const y = scaleY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#a855f7";
    ctx.font = "11px Inter";
    ctx.fillText("fitness (lower is better)", 12, 16);
  }, [data]);

  useEffect(() => {
    const canvas = lambdaRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { lambdaTimeline } = data;
    const maxL = Math.max(...lambdaTimeline);
    const minL = Math.min(...lambdaTimeline);
    ctx.clearRect(0, 0, W, 60);
    ctx.fillStyle = "#0b132a";
    ctx.fillRect(0, 0, W, 60);
    lambdaTimeline.forEach((l, i) => {
      const x = (i / (lambdaTimeline.length - 1)) * W;
      const h = ((l - minL) / (maxL - minL + 1e-6)) * 50;
      ctx.fillStyle = "rgba(244,114,182,0.7)";
      ctx.fillRect(x, 60 - h, W / lambdaTimeline.length + 1, h);
    });
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "10px Inter";
    ctx.fillText("λ over generations (higher = broader restart)", 8, 12);
  }, [data]);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <RefreshCw className="h-4 w-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">Restart Strategy Viewer</h3>
            <p className="text-xs text-slate-400">IPOP vs BIPOP dynamics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-950/30 px-3 py-1.5 rounded-full border border-white/5">
          <span className={`text-xs font-bold transition-colors ${mode === "ipop" ? "text-sky-400" : "text-slate-500"}`}>IPOP</span>
          <Switch
            checked={mode === "bipop"}
            onChange={(v) => setMode(v ? "bipop" : "ipop")}
            className="group relative inline-flex h-6 w-12 items-center rounded-full bg-slate-700 transition-colors data-[checked]:bg-emerald-500"
          >
            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform group-data-[checked]:translate-x-7 shadow-sm" />
          </Switch>
          <span className={`text-xs font-bold transition-colors ${mode === "bipop" ? "text-emerald-400" : "text-slate-500"}`}>BIPOP</span>
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
        <strong>IPOP</strong> doubles the population on each restart. <strong>BIPOP</strong> alternates small and large. Bigger λ explores broadly but costs more per generation.
      </p>

      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-inner bg-[#0B1121]">
          <canvas ref={canvasRef} width={W} height={H} className="w-full block" />
        </div>
        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-inner bg-[#0B1121]">
           <canvas ref={lambdaRef} width={W} height={60} className="w-full block" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 text-sm">
        <div className="bg-slate-900/40 rounded-xl p-4 border border-white/5 hover:border-sky-500/30 transition-colors">
          <div className="flex items-center gap-2 text-sky-200 font-semibold text-xs uppercase tracking-wide mb-2">
            <Timer className="h-4 w-4" /> Prefer IPOP
          </div>
          <ul className="list-disc pl-4 space-y-1.5 text-slate-400 text-xs leading-relaxed">
            <li>Globally structured multimodal problems (Rastrigin).</li>
            <li>Systematic population growth sweeps wider basins.</li>
          </ul>
        </div>

        <div className="bg-slate-900/40 rounded-xl p-4 border border-white/5 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-2 text-emerald-200 font-semibold text-xs uppercase tracking-wide mb-2">
            <Activity className="h-4 w-4" /> Prefer BIPOP
          </div>
          <ul className="list-disc pl-4 space-y-1.5 text-slate-400 text-xs leading-relaxed">
            <li>Weak global structure; rapid local exploitation needed.</li>
            <li>Compute budgets that favor alternating small/large bursts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
