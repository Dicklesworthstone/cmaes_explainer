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
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-sky-200">
          <RefreshCw className="h-4 w-4" /> Restart strategy viewer
        </div>
        <div className="flex items-center gap-2 text-[0.8rem] text-slate-300">
          <span>{mode.toUpperCase()}</span>
          <Switch
            checked={mode === "bipop"}
            onChange={(v) => setMode(v ? "bipop" : "ipop")}
            className={`${mode === "bipop" ? "bg-emerald-500/70" : "bg-slate-700"} relative inline-flex h-5 w-12 items-center rounded-full`}
          >
            <span className={`${mode === "bipop" ? "translate-x-6" : "translate-x-1"} inline-block h-3 w-3 transform rounded-full bg-white`} />
          </Switch>
        </div>
      </div>
      <p className="text-sm text-slate-300">
        IPOP grows the population on each restart; BIPOP alternates small and large. Bigger λ explores
        broadly but costs more per generation. Scrub through the timeline to see how fitness and λ move.
      </p>
      <div className="space-y-3">
        <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-xl border border-slate-800/70 bg-slate-950" />
        <canvas ref={lambdaRef} width={W} height={60} className="w-full rounded-xl border border-slate-800/70 bg-slate-950" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 text-[0.84rem] text-slate-200">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 space-y-1">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-[0.9rem]">
            <Timer className="h-4 w-4 text-amber-300" /> When to prefer IPOP
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-300">
            <li>Globally structured multimodal problems (Rastrigin/Griewank).</li>
            <li>You want systematic population growth to sweep wider basins.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 space-y-1">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-[0.9rem]">
            <Activity className="h-4 w-4 text-emerald-300" /> When to prefer BIPOP
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-300">
            <li>Weak global structure; need rapid local exploitation between light global sweeps.</li>
            <li>Compute budgets that favor alternating small/large bursts.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
