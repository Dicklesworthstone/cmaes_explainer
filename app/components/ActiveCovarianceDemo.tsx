"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Scissors, Sparkles, Activity, Play, Pause, RotateCcw, ShieldAlert, ArrowDownRight, Layers } from "lucide-react";
import { LatexRenderer } from "./LatexRenderer";
import { CMAESOptimizer, CMAESGenerationState, eigen2x2 } from "../lib/cmaesEngine";

const WIDTH = 480;
const HEIGHT = 320;
const DOMAIN = 2.5;

// Sharp banana canyon with deceptive ridges
const objectiveFn = (x: number, y: number) => {
  return 80 * (y - 0.4 * x * x) ** 2 + (x - 1.2) ** 2 + 5 * Math.sin(4 * x) ** 2;
};

export function ActiveCovarianceDemo() {
  const [activeCMA, setActiveCMA] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const optimizerRef = useRef<CMAESOptimizer | null>(null);

  const getOrInitOptimizer = useCallback((useActive: boolean) => {
    if (!optimizerRef.current) {
      optimizerRef.current = new CMAESOptimizer(objectiveFn, {
        dim: 2,
        initialMean: [-1.4, -0.8],
        initialSigma: 0.5,
        lambda: 16,
        activeCMA: useActive,
        bounds: [-DOMAIN, DOMAIN]
      });
    }
    return optimizerRef.current;
  }, []);

  const [history, setHistory] = useState<CMAESGenerationState[]>(() => {
    const opt = new CMAESOptimizer(objectiveFn, {
      dim: 2,
      initialMean: [-1.4, -0.8],
      initialSigma: 0.5,
      lambda: 16,
      activeCMA: true,
      bounds: [-DOMAIN, DOMAIN]
    });
    return [opt.step()];
  });

  const resetOptimizer = useCallback((useActive: boolean) => {
    const opt = new CMAESOptimizer(objectiveFn, {
      dim: 2,
      initialMean: [-1.4, -0.8],
      initialSigma: 0.5,
      lambda: 16,
      activeCMA: useActive,
      bounds: [-DOMAIN, DOMAIN]
    });
    optimizerRef.current = opt;
    setHistory([opt.step()]);
    setGeneration(0);
    setIsPlaying(false);
  }, []);

  const handleToggleActive = () => {
    const next = !activeCMA;
    setActiveCMA(next);
    resetOptimizer(next);
  };

  const stepOptimizer = useCallback(() => {
    const opt = getOrInitOptimizer(activeCMA);
    const nextState = opt.step();
    setHistory((prev) => [...prev, nextState]);
    setGeneration((g) => g + 1);
  }, [activeCMA, getOrInitOptimizer]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (generation >= 45) {
        setIsPlaying(false);
        return;
      }
      stepOptimizer();
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying, generation, stepOptimizer]);

  const latestState = history[history.length - 1];

  // Render 2D Simulation Stage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !latestState) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const toPxX = (x: number) => ((x + DOMAIN) / (2 * DOMAIN)) * W;
    const toPxY = (y: number) => H - ((y + DOMAIN) / (2 * DOMAIN)) * H;
    const toCoordX = (px: number) => (px / W) * (2 * DOMAIN) - DOMAIN;
    const toCoordY = (py: number) => ((H - py) / H) * (2 * DOMAIN) - DOMAIN;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw High-Performance Vectorized Contour Map
    const imgData = ctx.createImageData(W, H);
    for (let py = 0; py < H; py += 2) {
      const y = toCoordY(py);
      for (let px = 0; px < W; px += 2) {
        const x = toCoordX(px);
        const v = objectiveFn(x, y);
        const norm = Math.max(0, Math.min(1, Math.log10(v + 1) / 3));

        const r = Math.floor(10 + 20 * norm);
        const g = Math.floor(20 + 80 * (1 - norm));
        const b = Math.floor(40 + 130 * (1 - norm));

        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const idx = ((py + dy) * W + (px + dx)) * 4;
            imgData.data[idx] = r;
            imgData.data[idx + 1] = g;
            imgData.data[idx + 2] = b;
            imgData.data[idx + 3] = 255;
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. Draw Historical Mean Trajectory (Cyan Ribbon)
    if (history.length > 1) {
      ctx.strokeStyle = activeCMA ? "#38bdf8" : "#94a3b8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      history.forEach((st, i) => {
        const mx = toPxX(st.mean[0]);
        const my = toPxY(st.mean[1]);
        if (i === 0) ctx.moveTo(mx, my);
        else ctx.lineTo(mx, my);
      });
      ctx.stroke();
    }

    // 3. Draw 1-sigma and 2-sigma Covariance Ellipses
    const [l1, l2] = latestState.eigenvalues;
    const s1 = Math.sqrt(Math.max(1e-10, l1)) * latestState.sigma * (W / (2 * DOMAIN));
    const s2 = Math.sqrt(Math.max(1e-10, l2)) * latestState.sigma * (H / (2 * DOMAIN));
    const cx = toPxX(latestState.mean[0]);
    const cy = toPxY(latestState.mean[1]);

    [1, 2].forEach((k) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-latestState.ellipseAngle);

      ctx.strokeStyle = activeCMA
        ? k === 1
          ? "rgba(56, 189, 248, 0.95)"
          : "rgba(56, 189, 248, 0.3)"
        : k === 1
          ? "rgba(244, 63, 94, 0.9)"
          : "rgba(244, 63, 94, 0.3)";
      ctx.lineWidth = k === 1 ? 2.5 : 1.2;
      ctx.fillStyle = activeCMA ? "rgba(14, 165, 233, 0.12)" : "rgba(244, 63, 94, 0.08)";

      ctx.beginPath();
      ctx.ellipse(0, 0, s1 * k, s2 * k, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (k === 1) {
        ctx.strokeStyle = activeCMA ? "rgba(56, 189, 248, 0.6)" : "rgba(244, 63, 94, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-s1, 0);
        ctx.lineTo(s1, 0);
        ctx.moveTo(0, -s2);
        ctx.lineTo(0, s2);
        ctx.stroke();
      }
      ctx.restore();
    });

    // 4. Draw Offspring Population (Top Elites in Emerald, Worst in Crimson if Active CMA)
    const sorted = [...latestState.samples].sort((a, b) => a.fitness - b.fitness);
    const mu = Math.floor(sorted.length / 4);

    sorted.forEach((s, idx) => {
      const sx = toPxX(s.x[0]);
      const sy = toPxY(s.x[1]);

      if (idx < mu) {
        // Top Elite
        ctx.fillStyle = "#34d399";
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (activeCMA && idx >= sorted.length - mu) {
        // Worst Offspring (Negative Active Forces)
        ctx.fillStyle = "#f43f5e";
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw negative active repulsion vector toward mean
        ctx.strokeStyle = "rgba(244, 63, 94, 0.6)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      } else {
        // Standard Offspring
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 5. Draw Mean Point
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = activeCMA ? "#0284c7" : "#e11d48";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [latestState, history, activeCMA]);

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Active Covariance Adaptation (Negative Weights)
            </h3>
            <p className="text-xs text-slate-400">
              Actively pruning unpromising variance directions vs passive covariance discounting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleActive}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeCMA
                ? "bg-sky-500 text-white shadow-glow-sm"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Active CMA: {activeCMA ? "ENABLED" : "DISABLED"}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-start">
        {/* Canvas Visualizer */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full h-auto block" />

            {/* Diagnostic Overlay */}
            {latestState && (
              <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs font-mono space-y-1 pointer-events-none">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <span>Best <LatexRenderer math="f(x^*)" block={false} />:</span>
                  <span>{latestState.bestFitness.toFixed(4)}</span>
                </div>
                <div className="text-sky-300 flex items-center gap-1">
                  <span>Step <LatexRenderer math="\sigma" block={false} />:</span>
                  <span>{latestState.sigma.toFixed(4)}</span>
                </div>
                <div className="text-purple-300 flex items-center gap-1">
                  <span>Cond <LatexRenderer math="\kappa(C)" block={false} />:</span>
                  <span>{latestState.conditionNumber.toFixed(1)}</span>
                </div>
                <div className="text-slate-400">Gen: {generation}/45</div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-white/10 text-[0.68rem] font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Top Elites (Positive Weight)</span>
              </div>
              {activeCMA && (
                <div className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Worst Samples (Negative Weight)</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                  isPlaying
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                    : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                }`}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? "Pause" : "Run Evolution"}</span>
              </button>

              <button
                onClick={stepOptimizer}
                disabled={isPlaying}
                className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
                title="Step 1 Gen"
              >
                <ArrowDownRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => resetOptimizer(activeCMA)}
                className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <span className="text-xs font-mono text-slate-400">
              <LatexRenderer math="\lambda = 16 \mid \mu = 4" block={false} />
            </span>
          </div>
        </div>

        {/* Rationale & Mathematical Details */}
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 space-y-2.5">
            <div className="font-bold text-sky-200 uppercase tracking-wider text-[0.7rem] flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-sky-400" />
              <span>Why Active Covariance Accelerates Convergence</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Standard CMA-ES expands covariance along directions that produce elite samples, but relies solely on passive exponential discounting <span className="inline-block"><LatexRenderer math="(1 - c_\mu) C" block={false} /></span> to shrink variance in bad directions.
            </p>
            <p className="text-slate-300 leading-relaxed">
              <strong>Active CMA-ES</strong> assigns negative weights to the worst <span className="inline-block"><LatexRenderer math="\mu_{\text{neg}}" block={false} /></span> offspring:
            </p>
            <div className="text-[0.8rem] bg-slate-900/80 p-2.5 rounded-xl border border-white/5 text-center text-rose-300">
              <LatexRenderer math="\Delta C_{\text{active}} = - c_{\mu\text{neg}} \sum |w_j| y_j y_j^\top" block={false} />
            </div>
            <p className="text-slate-400 leading-relaxed">
              This actively flattens the search ellipsoid against canyon walls, preventing wasteful mutations into known high-loss regions and improving convergence speed by <strong>20–40%</strong> on narrow ridges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
