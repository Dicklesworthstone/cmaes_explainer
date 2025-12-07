"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@headlessui/react";
import { Scissors, Sparkles, Activity } from "lucide-react";

const W = 360;
const H = 260;
const DOMAIN = 2.5;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function simulate(active: boolean) {
  const rand = rng(active ? 777 : 555);
  let cov: [number, number, number, number] = [1, 0, 0, 0.2]; // cigar-ish starting cov (aligned)
  let mean = [1.6, 1.0];
  const traj: { mean: [number, number]; cov: [number, number, number, number] }[] = [];

  for (let g = 0; g < 28; g++) {
    const samples: { y: [number, number]; f: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const z0 = randn(rand);
      const z1 = randn(rand);
      const y = matVecSqrt(cov, [z0, z1]).map((v, idx) => v + mean[idx]) as [number, number];
      const f = toy(y[0], y[1]);
      samples.push({ y, f });
    }
    samples.sort((a, b) => a.f - b.f);
    const mu = 6;
    const weights = Array.from({ length: mu }, (_, i) => (mu - i) / (mu * (mu + 1) * 0.5));
    // negative weights for bad ones in active mode
    const negW = active ? weights.map((w) => -0.4 * w) : weights.map(() => 0);

    // update mean
    const top = samples.slice(0, mu);
    const deltaMean: [number, number] = [0, 0];
    top.forEach((s, i) => {
      deltaMean[0] += weights[i] * (s.y[0] - mean[0]);
      deltaMean[1] += weights[i] * (s.y[1] - mean[1]);
    });
    mean = [mean[0] + deltaMean[0], mean[1] + deltaMean[1]];

    // covariance update (rank-μ + active)
    let covUpd = [0, 0, 0, 0];
    top.forEach((s, i) => {
      const dy: [number, number] = [s.y[0] - mean[0], s.y[1] - mean[1]];
      covUpd[0] += weights[i] * dy[0] * dy[0];
      covUpd[1] += weights[i] * dy[0] * dy[1];
      covUpd[2] += weights[i] * dy[1] * dy[0];
      covUpd[3] += weights[i] * dy[1] * dy[1];
    });
    const bad = samples.slice(-mu);
    bad.forEach((s, i) => {
      const dy: [number, number] = [s.y[0] - mean[0], s.y[1] - mean[1]];
      covUpd[0] += negW[i] * dy[0] * dy[0];
      covUpd[1] += negW[i] * dy[0] * dy[1];
      covUpd[2] += negW[i] * dy[1] * dy[0];
      covUpd[3] += negW[i] * dy[1] * dy[1];
    });

    cov = addMat(cov, covUpd, 0.7); // smoothing
    cov = stabilize(cov);
    traj.push({ mean: [mean[0], mean[1]], cov: [...cov] as [number, number, number, number] });
  }
  return traj;
}

function toy(x: number, y: number) {
  return 60 * x * x + y * y + 8 * Math.cos(3 * x) + 2 * Math.cos(4 * y);
}

function randn(rand: () => number) {
  // Box-Muller
  const u1 = rand() || 1e-6;
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function matVecSqrt([a, b, c, d]: number[], [z0, z1]: [number, number]): [number, number] {
  // crude eigen decomposition for 2x2 SPD
  const tr = a + d;
  const det = a * d - b * c;
  const disc = Math.sqrt(Math.max(tr * tr - 4 * det, 0));
  const l1 = (tr + disc) / 2;
  const l2 = (tr - disc) / 2;
  const v1 = [b, l1 - a];
  let len1 = Math.hypot(v1[0], v1[1]);
  if (len1 < 1e-9) {
     // Fallback for diagonal case where l1 ~= a
     v1[0] = 1; 
     v1[1] = 0;
     len1 = 1;
  }
  const e1 = [v1[0] / len1, v1[1] / len1];
  const e2 = [-e1[1], e1[0]];
  return [
    e1[0] * Math.sqrt(Math.max(l1, 0)) * z0 + e2[0] * Math.sqrt(Math.max(l2, 0)) * z1,
    e1[1] * Math.sqrt(Math.max(l1, 0)) * z0 + e2[1] * Math.sqrt(Math.max(l2, 0)) * z1
  ];
}

function addMat(base: number[], upd: number[], alpha: number) {
  return base.map((v, i) => (1 - alpha) * v + alpha * upd[i]) as [number, number, number, number];
}

function stabilize([a, b, c, d]: number[]): [number, number, number, number] {
  // ensure SPD by nudging diagonal
  const eps = 1e-3;
  return [a + eps, b, c, d + eps];
}

export function ActiveCovarianceDemo() {
  const [showActive, setShowActive] = useState(true);
  const [passive, setPassive] = useState<{ mean: [number, number]; cov: [number, number, number, number] }[]>([]);
  const [active, setActive] = useState<{ mean: [number, number]; cov: [number, number, number, number] }[]>([]);
  const [frame, setFrame] = useState(18);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Hydration safe: run simulation only on client
    setPassive(simulate(false));
    setActive(simulate(true));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // heat background
    const img = ctx.createImageData(W, H);
    for (let iy = 0; iy < H; iy++) {
      const y = ((H - iy) / H - 0.5) * 2 * DOMAIN;
      for (let ix = 0; ix < W; ix++) {
        const x = (ix / W - 0.5) * 2 * DOMAIN;
        const v = toy(x, y);
        const norm = Math.tanh(v / 150);
        const idx = (iy * W + ix) * 4;
        // Deep elegant blue theme
        img.data[idx] = 15;
        img.data[idx + 1] = 23 + Math.floor(100 * (1 - norm));
        img.data[idx + 2] = 40 + Math.floor(120 * (1 - norm));
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    const drawRun = (traj: { mean: [number, number]; cov: [number, number, number, number] }[], color: string, strokeColor: string, alpha: number) => {
      if (!traj || traj.length === 0) return;
      const clampedFrame = Math.min(frame, traj.length - 1);
      const step = traj[clampedFrame];
      if (!step) return;
      const { mean, cov } = step;
      const [a, b, c, d] = cov;
      const tr = a + d;
      const det = a * d - b * c;
      const disc = Math.sqrt(Math.max(tr * tr - 4 * det, 0));
      const l1 = (tr + disc) / 2;
      const l2 = (tr - disc) / 2;
      const v1 = [b, l1 - a];
      const len1 = Math.hypot(v1[0], v1[1]) || 1;
      const e1 = [v1[0] / len1, v1[1] / len1];
      const angle = Math.atan2(e1[1], e1[0]);
      const cx = (mean[0] / (2 * DOMAIN) + 0.5) * W;
      const cy = H - (mean[1] / (2 * DOMAIN) + 0.5) * H;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = alpha;
      const rx = Math.sqrt(Math.max(l1, 0)) * (W / (2 * DOMAIN)) * 0.7;
      const ry = Math.sqrt(Math.max(l2, 0)) * (H / (2 * DOMAIN)) * 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha * 0.15;
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    drawRun(passive, "rgb(168,85,247)", "rgba(192,132,252,0.9)", 0.75);
    if (showActive) drawRun(active, "rgb(34,211,238)", "rgba(56,189,248,0.95)", 0.95);
  }, [passive, active, frame, showActive]);

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Scissors className="h-4 w-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">Active vs Passive Covariance</h3>
            <p className="text-xs text-slate-400">Shrinking variance along bad directions</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-950/30 p-1.5 pl-3 pr-2 rounded-full border border-white/5">
          <span className="text-xs font-medium text-slate-300">Enable active</span>
          <Switch
            checked={showActive}
            onChange={setShowActive}
            className={`${showActive ? "bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.4)]" : "bg-slate-700"} group relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900`}
          >
            <span className={`${showActive ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300`} />
          </Switch>
        </div>
      </div>
      
      <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
        Active CMA uses negative weights for the worst samples to aggressively shrink the covariance along bad directions.
        Notice how the <span className="text-sky-300 font-medium">blue ellipsoid (active)</span> tightens much faster than the <span className="text-purple-300 font-medium">purple one (passive)</span>.
      </p>
      
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-sky-500/20 to-purple-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
          <canvas 
            ref={canvasRef} 
            width={W} 
            height={H} 
            className="relative w-full rounded-xl border border-white/10 bg-[#0B1121] shadow-inner" 
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 font-medium">Generation</span>
              <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">{frame}</span>
            </div>
            <input
              aria-label="Generation frame"
              type="range"
              min={0}
              max={27}
              step={1}
              value={frame}
              onChange={(e) => setFrame(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500"
            />
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>Start</span>
              <span>Converged</span>
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5 flex-1">
            <div className="flex items-center gap-2 text-slate-200 font-medium text-sm mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> 
              <span>Key Insight</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-5">
              <li className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
                <span><strong>Passive update:</strong> Only uses the best samples to stretch the covariance.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                <span><strong>Active update:</strong> Explicitly penalizes the worst directions, preventing the ellipsoid from drifting sideways in neutral subspaces.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
