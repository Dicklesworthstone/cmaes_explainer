"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@headlessui/react";
import { Activity, Shuffle, Waves } from "lucide-react";

// simple deterministic LCG for repeatable visuals
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function simulate({ generations, lambda, noise, reevaluate }: { generations: number; lambda: number; noise: number; reevaluate: boolean }) {
  const rand = rng(1234 + lambda + Math.round(noise * 100) + (reevaluate ? 7 : 0));
  const data = [] as { gen: number; bestTrue: number; bestNoisy: number; overlap: number }[];
  let center = 1.8;
  for (let g = 0; g < generations; g++) {
    const samples: { true: number; noisy: number }[] = [];
    for (let i = 0; i < lambda; i++) {
      const x = center + (rand() - 0.5) * 1.2; // search radius shrinks implicitly
      const trueVal = x * x + 0.2 * Math.cos(3 * x);
      const noisyVal = trueVal + (rand() - 0.5) * noise;
      samples.push({ true: trueVal, noisy: noisyVal });
    }
    const sortedNoisy = [...samples].sort((a, b) => a.noisy - b.noisy);
    const mu = Math.max(1, Math.floor(lambda * 0.25));
    let elite = sortedNoisy.slice(0, mu);
    if (reevaluate) {
      elite = elite.map((s) => ({ ...s, noisy: s.true + (rand() - 0.5) * noise }));
      elite.sort((a, b) => a.noisy - b.noisy);
    }
    const bestNoisy = elite[0].noisy;
    const trueSorted = [...samples].sort((a, b) => a.true - b.true);
    const bestTrue = trueSorted[0].true;

    // overlap between top-mu by true vs noisy ranks
    const trueEliteSet = new Set(trueSorted.slice(0, mu).map((v) => v.true));
    const noisyElite = elite.slice(0, mu).map((v) => v.true);
    const overlap = noisyElite.filter((v) => trueEliteSet.has(v)).length / mu;

    data.push({ gen: g, bestTrue, bestNoisy, overlap });
    center = center * 0.92; // drift toward optimum
  }
  return data;
}

export function NoiseExplorer() {
  const [lambda, setLambda] = useState(16);
  const [noise, setNoise] = useState(1.2);
  const [reeval, setReeval] = useState(true);
  const data = useMemo(() => simulate({ generations: 60, lambda, noise, reevaluate: reeval }), [lambda, noise, reeval]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stripRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const trueVals = data.map((d) => d.bestTrue);
    const noisyVals = data.map((d) => d.bestNoisy);
    const minVal = Math.min(...trueVals, ...noisyVals);
    const maxVal = Math.max(...trueVals, ...noisyVals);
    const scaleY = (v: number) => H - ((v - minVal) / (maxVal - minVal + 1e-6)) * (H - 20) - 10;
    const scaleX = (i: number) => (i / Math.max(1, data.length - 1)) * (W - 20) + 10;

    const drawLine = (vals: number[], color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      vals.forEach((v, i) => {
        const x = scaleX(i);
        const y = scaleY(v);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    drawLine(noisyVals, "#a855f7");
    drawLine(trueVals, "#22d3ee");

    // fill between for error band
    ctx.fillStyle = "rgba(168,85,247,0.18)";
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = scaleX(i);
      const y = scaleY(d.bestNoisy);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    for (let i = data.length - 1; i >= 0; i--) {
      const x = scaleX(i);
      const y = scaleY(data[i].bestTrue);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // axes labels
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Gen 0", 10, H - 4);
    ctx.fillText(`Gen ${data.length - 1}`, W - 60, H - 4);
    ctx.save();
    ctx.translate(6, 14);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Fitness", 0, 0);
    ctx.restore();

    // legend
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(W - 110, 10, 10, 10);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Noisy best", W - 95, 18);
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(W - 110, 28, 10, 10);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("True best", W - 95, 36);
  }, [data]);

  useEffect(() => {
    const canvas = stripRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    data.forEach((d, i) => {
      const x = (i / Math.max(1, data.length - 1)) * W;
      const barH = d.overlap * H;
      ctx.fillStyle = `rgba(34,211,238,${0.4 + 0.6 * d.overlap})`;
      ctx.fillRect(x, H - barH, W / data.length + 1, barH);
    });
  }, [data]);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
             <Shuffle className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">Noise vs Population Explorer</h3>
            <p className="text-xs text-slate-400">Stabilizing ranks in noisy landscapes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400">Re-evaluate Elites</span>
          <Switch
            checked={reeval}
            onChange={setReeval}
            className={`${reeval ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-slate-700"} group relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300`}
          >
            <span className={`${reeval ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300`} />
          </Switch>
        </div>
      </div>
      
      <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
        Noisy evaluations scramble ranks. Increasing λ (population) or re-evaluating elites stabilizes selection and keeps covariance learning honest.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] items-start">
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-inner bg-[#0B1121]">
             <canvas ref={canvasRef} width={520} height={240} className="w-full block" />
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-4 justify-center bg-slate-950/30 py-2 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-[#a855f7]" /> Noisy Best
            </div>
            <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-[#22d3ee]" /> True Best
            </div>
            <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded bg-purple-500/20 border border-purple-500/30" /> Range
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5 space-y-4 bg-slate-900/40">
             <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-300">Population λ</span>
                  <span className="text-sky-300 font-mono bg-sky-500/10 px-1.5 rounded border border-sky-500/20">{lambda}</span>
                </div>
                <input type="range" min={4} max={64} step={1} value={lambda} onChange={(e) => setLambda(parseInt(e.target.value))} className="w-full accent-sky-500" />
             </div>
             
             <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-300">Noise σ</span>
                  <span className="text-amber-300 font-mono bg-amber-500/10 px-1.5 rounded border border-amber-500/20">{noise.toFixed(2)}</span>
                </div>
                <input type="range" min={0} max={3} step={0.05} value={noise} onChange={(e) => setNoise(parseFloat(e.target.value))} className="w-full accent-amber-500" />
             </div>
          </div>

          <div className="glass-card p-4 bg-slate-900/40">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 uppercase tracking-wide mb-3">
              <Activity className="h-3.5 w-3.5" /> Rank Stability
            </div>
            <canvas ref={stripRef} width={520} height={60} className="w-full rounded-lg border border-white/10 bg-[#0B1121]" />
            <div className="text-[0.65rem] text-slate-500 mt-2 text-center">
              Height = overlap between true vs noisy top-μ elites
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
