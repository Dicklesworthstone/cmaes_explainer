"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@headlessui/react";
import { Scissors, Sparkles } from "lucide-react";

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
  let cov = [1, 0, 0, 0.2]; // cigar-ish starting cov (aligned)
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
    traj.push({ mean: [mean[0], mean[1]], cov: [...cov] as any });
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
  const len1 = Math.hypot(v1[0], v1[1]) || 1;
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
  const passive = useMemo(() => simulate(false), []);
  const active = useMemo(() => simulate(true), []);
  const [frame, setFrame] = useState(18);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        img.data[idx] = 24;
        img.data[idx + 1] = Math.floor(180 * (1 - norm));
        img.data[idx + 2] = 255;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    const drawRun = (traj: { mean: [number, number]; cov: [number, number, number, number] }[], color: string, alpha: number) => {
      const clampedFrame = Math.min(frame, traj.length - 1);
      const { mean, cov } = traj[clampedFrame];
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
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.globalAlpha = alpha;
      const rx = Math.sqrt(Math.max(l1, 0)) * (W / (2 * DOMAIN)) * 0.7;
      const ry = Math.sqrt(Math.max(l2, 0)) * (H / (2 * DOMAIN)) * 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
    };

    drawRun(passive, "rgba(168,85,247,0.9)", 0.8);
    if (showActive) drawRun(active, "rgba(34,211,238,0.95)", 0.9);
  }, [passive, active, frame, showActive]);

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-sky-200">
          <Scissors className="h-4 w-4" /> Active covariance vs passive
        </div>
        <div className="flex items-center gap-2 text-[0.8rem] text-slate-300">
          <span>Show active</span>
          <Switch
            checked={showActive}
            onChange={setShowActive}
            aria-label="Toggle active covariance"
            className={`${showActive ? "bg-emerald-500/70" : "bg-slate-700"} relative inline-flex h-5 w-10 items-center rounded-full`}
          >
            <span className={`${showActive ? "translate-x-5" : "translate-x-1"} inline-block h-3 w-3 transform rounded-full bg-white`} />
          </Switch>
        </div>
      </div>
      <p className="text-sm text-slate-300">
        Active CMA shrinks variance along bad directions by using negative weights on the worst samples.
        Watch how the mint ellipsoid tightens faster than the purple passive one on the same landscape.
      </p>
      <div className="grid gap-3 sm:grid-cols-[1.1fr_auto] items-center">
        <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-xl border border-slate-800/70 bg-slate-950" />
        <div className="space-y-3 text-[0.85rem] text-slate-200">
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 space-y-2">
            <div className="flex items-center justify-between text-slate-300 text-[0.8rem]">
              <span>Generation</span>
              <span className="text-sky-200 font-semibold">{frame}</span>
            </div>
            <input
              aria-label="Generation frame"
              type="range"
              min={0}
              max={27}
              step={1}
              value={frame}
              onChange={(e) => setFrame(parseInt(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 text-[0.82rem] text-slate-300">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-[0.9rem]">
              <Sparkles className="h-4 w-4 text-emerald-300" /> What you’re seeing
            </div>
            <ul className="list-disc pl-4 space-y-1 mt-2">
              <li>Purple = passive rank-μ update only.</li>
              <li>Mint = active update adds negative weights on bad samples → sharper short axis.</li>
              <li>Both start from same mean/cov; active collapses orthogonal junk directions sooner.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
