"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Sparkles,
  Sliders,
  Compass,
  Activity,
  Layers,
  BarChart3,
  Flame,
  Globe2,
  Cpu,
  ExternalLink,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { MathJax } from "better-react-mathjax";
import {
  BENCHMARKS,
  BenchmarkFunction,
  CMAESOptimizer,
  CMAESGenerationState,
  runGradientDescent,
  runAdamOptimizer,
  runRandomSearch,
  BaselineStepState
} from "../lib/cmaesEngine";

export function WasmDemo() {
  const [selectedBenchId, setSelectedBenchId] = useState<string>("rosenbrock");
  const [lambda, setLambda] = useState<number>(16);
  const [initialSigma, setInitialSigma] = useState<number>(0.55);
  const [activeCMA, setActiveCMA] = useState<boolean>(true);
  const [noiseLevel, setNoiseLevel] = useState<number>(0.0);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"native" | "wasm_iframe">("native");

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(120);

  // Selected benchmark
  const currentBench = useMemo(() => {
    return BENCHMARKS.find((b) => b.id === selectedBenchId) || BENCHMARKS[0];
  }, [selectedBenchId]);

  // Initial starting point (far from optimum)
  const [startPoint, setStartPoint] = useState<[number, number]>([-1.5, 1.8]);

  const optimizerRef = useRef<CMAESOptimizer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lossCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize optimizer instance helper
  const createOptimizerState = useCallback((
    bench: BenchmarkFunction,
    start: [number, number],
    sigma: number,
    popSize: number,
    active: boolean,
    noise: number,
    compare: boolean
  ) => {
    const opt = new CMAESOptimizer(bench.eval, {
      dim: 2,
      initialMean: [start[0], start[1]],
      initialSigma: sigma,
      lambda: popSize,
      activeCMA: active,
      noiseLevel: noise,
      bounds: bench.domain
    });
    optimizerRef.current = opt;
    const initialStep = opt.step();
    const gd = compare ? runGradientDescent(bench.eval, start, 40, 0.005) : [];
    const adam = compare ? runAdamOptimizer(bench.eval, start, 40, 0.05) : [];
    const rs = compare ? runRandomSearch(bench.eval, bench.domain, 40 * popSize) : [];
    return { initialStep, gd, adam, rs };
  }, []);

  // Initial state setup without mutating refs during render
  const [history, setHistory] = useState<CMAESGenerationState[]>(() => {
    const bench = BENCHMARKS[0];
    const opt = new CMAESOptimizer(bench.eval, {
      dim: 2,
      initialMean: [-1.5, 1.8],
      initialSigma: 0.55,
      lambda: 16,
      activeCMA: true,
      noiseLevel: 0.0,
      bounds: bench.domain
    });
    return [opt.step()];
  });

  const [gdHistory, setGdHistory] = useState<BaselineStepState[]>([]);
  const [adamHistory, setAdamHistory] = useState<BaselineStepState[]>([]);
  const [rsHistory, setRsHistory] = useState<BaselineStepState[]>([]);

  const getOrInitOptimizer = useCallback(() => {
    if (!optimizerRef.current) {
      optimizerRef.current = new CMAESOptimizer(currentBench.eval, {
        dim: 2,
        initialMean: [startPoint[0], startPoint[1]],
        initialSigma,
        lambda,
        activeCMA,
        noiseLevel,
        bounds: currentBench.domain
      });
    }
    return optimizerRef.current;
  }, [currentBench, startPoint, initialSigma, lambda, activeCMA, noiseLevel]);

  // Reset or re-initialize on parameter changes
  const resetOptimization = useCallback(() => {
    setIsPlaying(false);
    const { initialStep, gd, adam, rs } = createOptimizerState(
      currentBench,
      startPoint,
      initialSigma,
      lambda,
      activeCMA,
      noiseLevel,
      compareMode
    );
    setHistory([initialStep]);
    setGdHistory(gd);
    setAdamHistory(adam);
    setRsHistory(rs);
  }, [createOptimizerState, currentBench, startPoint, initialSigma, lambda, activeCMA, noiseLevel, compareMode]);

  // Handle benchmark change
  const handleSelectBench = (benchId: string) => {
    setSelectedBenchId(benchId);
    const bench = BENCHMARKS.find((b) => b.id === benchId) || BENCHMARKS[0];
    const newStart: [number, number] = [-1.5, 1.8];
    setStartPoint(newStart);
    setIsPlaying(false);
    const { initialStep, gd, rs } = createOptimizerState(
      bench,
      newStart,
      initialSigma,
      lambda,
      activeCMA,
      noiseLevel,
      compareMode
    );
    setHistory([initialStep]);
    setGdHistory(gd);
    setRsHistory(rs);
  };

  // Step the optimizer
  const stepOptimization = useCallback(() => {
    const opt = getOrInitOptimizer();
    const nextState = opt.step();
    setHistory((prev) => [...prev, nextState]);
  }, [getOrInitOptimizer]);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (history.length >= 60) {
        setIsPlaying(false);
        return;
      }
      stepOptimization();
    }, speedMs);
    return () => clearInterval(interval);
  }, [isPlaying, history.length, speedMs, stepOptimization]);

  const latestState = history[history.length - 1] || null;

  // --- Render 2D Contour Map, Samples, Ellipses, Paths ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !latestState) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const [dMin, dMax] = currentBench.domain;

    const toPxX = (x: number) => ((x - dMin) / (dMax - dMin)) * W;
    const toPxY = (y: number) => H - ((y - dMin) / (dMax - dMin)) * H;
    const toCoordX = (px: number) => (px / W) * (dMax - dMin) + dMin;
    const toCoordY = (py: number) => ((H - py) / H) * (dMax - dMin) + dMin;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw High-Performance Vector Field / Contour Heatmap
    const imgData = ctx.createImageData(W, H);
    const stepSize = 2; // 2px blocks for 60fps rendering
    for (let py = 0; py < H; py += stepSize) {
      const y = toCoordY(py);
      for (let px = 0; px < W; px += stepSize) {
        const x = toCoordX(px);
        const f = currentBench.eval(x, y);
        const logF = Math.log10(Math.max(1e-4, f + 1e-4));
        const norm = Math.max(0, Math.min(1, logF / 4));

        // Dark nebula palette: deep midnight navy -> luminous teal -> cyan
        const r = Math.floor(6 + 18 * norm);
        const g = Math.floor(16 + 85 * (1 - norm));
        const b = Math.floor(32 + 130 * (1 - norm));

        for (let dy = 0; dy < stepSize; dy++) {
          for (let dx = 0; dx < stepSize; dx++) {
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

    // 2. Draw Subtle Coordinate Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let g = Math.ceil(dMin); g <= dMax; g += 1) {
      ctx.beginPath();
      ctx.moveTo(toPxX(g), 0);
      ctx.lineTo(toPxX(g), H);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, toPxY(g));
      ctx.lineTo(W, toPxY(g));
      ctx.stroke();
    }

    // 3. Draw Global Optimum Star Marker
    const [optX, optY] = currentBench.optimum;
    ctx.strokeStyle = "#fbbf24";
    ctx.fillStyle = "#fbbf24";
    ctx.lineWidth = 2;
    const opx = toPxX(optX);
    const opy = toPxY(optY);
    ctx.beginPath();
    ctx.arc(opx, opy, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(opx - 9, opy);
    ctx.lineTo(opx + 9, opy);
    ctx.moveTo(opx, opy - 9);
    ctx.lineTo(opx, opy + 9);
    ctx.stroke();

    // 4. Draw Comparison Baselines (Gradient Descent & Adam)
    if (compareMode) {
      // Gradient Descent Trajectory (Rose Red)
      if (gdHistory.length > 1) {
        ctx.strokeStyle = "rgba(244, 63, 94, 0.75)";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        gdHistory.forEach((pt, i) => {
          const gx = toPxX(pt.currentX[0]);
          const gy = toPxY(pt.currentX[1]);
          if (i === 0) ctx.moveTo(gx, gy);
          else ctx.lineTo(gx, gy);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Adam Optimizer Trajectory (Amber Gold)
      if (adamHistory.length > 1) {
        ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
        ctx.lineWidth = 2.0;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        adamHistory.forEach((pt, i) => {
          const ax = toPxX(pt.currentX[0]);
          const ay = toPxY(pt.currentX[1]);
          if (i === 0) ctx.moveTo(ax, ay);
          else ctx.lineTo(ax, ay);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 5. Draw Historical CMA-ES Mean Trajectory (Cyan Ribbon)
    if (history.length > 1) {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
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

    // 6. Draw Covariance 1-sigma & 2-sigma Confidence Ellipses
    const [l1, l2] = latestState.eigenvalues;
    const s1 = Math.sqrt(Math.max(1e-10, l1)) * latestState.sigma * (W / (dMax - dMin));
    const s2 = Math.sqrt(Math.max(1e-10, l2)) * latestState.sigma * (H / (dMax - dMin));
    const cx = toPxX(latestState.mean[0]);
    const cy = toPxY(latestState.mean[1]);

    [1, 2].forEach((k) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-latestState.ellipseAngle);

      ctx.strokeStyle = k === 1 ? "rgba(56, 189, 248, 0.9)" : "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = k === 1 ? 2.5 : 1.2;
      ctx.fillStyle = k === 1 ? "rgba(14, 165, 233, 0.12)" : "transparent";

      ctx.beginPath();
      ctx.ellipse(0, 0, s1 * k, s2 * k, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw principal axes on 1-sigma ellipse
      if (k === 1) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
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

    // 7. Draw Evolution Path Vector p_c (Purple Arrow) & p_sigma (Mint Arrow)
    const pcScale = 1.5 * (W / (dMax - dMin));
    const pcX = cx + latestState.pC[0] * pcScale;
    const pcY = cy - latestState.pC[1] * pcScale;

    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(pcX, pcY);
    ctx.stroke();

    // 8. Draw Candidate Population Samples
    latestState.samples.forEach((s) => {
      const sx = toPxX(s.x[0]);
      const sy = toPxY(s.x[1]);

      if (s.isElite) {
        // Glowing Emerald for top mu elites
        ctx.fillStyle = "#34d399";
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        // Cyan/Slate for other offspring
        ctx.fillStyle = "rgba(148, 163, 184, 0.65)";
        ctx.beginPath();
        ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 9. Draw Mean Point
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [currentBench, latestState, history, compareMode, gdHistory, adamHistory]);

  // --- Render Log-Loss Convergence Chart ---
  useEffect(() => {
    const canvas = lossCanvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, W, H);

    const PADDING = 32;
    const maxEvals = Math.max(100, history[history.length - 1].evalCount);
    const toPxX = (evals: number) => PADDING + (evals / maxEvals) * (W - 2 * PADDING);

    // Compute log loss range
    const allLosses = history.map((s) => Math.log10(Math.max(1e-12, s.bestFitness - currentBench.optimumValue + 1e-12)));
    const minLoss = Math.min(-6, ...allLosses);
    const maxLoss = Math.max(2, ...allLosses);
    const toPxY = (logL: number) => H - PADDING - ((logL - minLoss) / (maxLoss - minLoss)) * (H - 2 * PADDING);

    // Draw Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let l = Math.ceil(minLoss); l <= maxLoss; l += 2) {
      const y = toPxY(l);
      ctx.beginPath();
      ctx.moveTo(PADDING, y);
      ctx.lineTo(W - PADDING, y);
      ctx.stroke();
      ctx.fillStyle = "#64748b";
      ctx.font = "9px Inter, monospace";
      ctx.fillText(`10^${l}`, 4, y + 3);
    }

    // Draw Comparison GD Curve (Rose)
    if (compareMode && gdHistory.length > 0) {
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      gdHistory.forEach((s, i) => {
        const x = toPxX(s.evalCount);
        const logL = Math.log10(Math.max(1e-12, s.bestFitness - currentBench.optimumValue + 1e-12));
        const y = toPxY(logL);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw Comparison Adam Curve (Amber)
    if (compareMode && adamHistory.length > 0) {
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      adamHistory.forEach((s, i) => {
        const x = toPxX(s.evalCount);
        const logL = Math.log10(Math.max(1e-12, s.bestFitness - currentBench.optimumValue + 1e-12));
        const y = toPxY(logL);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw CMA-ES Convergence Curve (Cyan)
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    history.forEach((s, i) => {
      const x = toPxX(s.evalCount);
      const logL = Math.log10(Math.max(1e-12, s.bestFitness - currentBench.optimumValue + 1e-12));
      const y = toPxY(logL);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText("Function Evaluations →", W - 130, H - 10);
  }, [history, currentBench, compareMode, gdHistory, adamHistory]);

  return (
    <div className="space-y-8">
      <div className="prose-cmaes">
        <p className="text-lg text-slate-300 leading-relaxed">
          Test CMA-ES live against classical benchmark test functions. Watch the covariance matrix adapt its principal axes,
          observe cumulative step-size expansion, and compare its convergence rate against finite-difference gradient descent.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setViewMode("native")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "native"
                ? "bg-sky-500 text-white shadow-glow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Native Interactive Engine
          </button>
          <button
            onClick={() => setViewMode("wasm_iframe")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "wasm_iframe"
                ? "bg-sky-500 text-white shadow-glow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Multi-Threaded WASM Gallery (SIMD)
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Cpu className="h-4 w-4 text-emerald-400" />
          <span>Real-time In-Browser Core</span>
        </div>
      </div>

      {viewMode === "wasm_iframe" ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden p-0"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-5 py-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">wasm_cmaes Benchmark Suite (SIMD / Rayon)</span>
            </div>
            <a
              href="/wasm-demo/examples/viz-benchmarks.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>Open Standalone</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="aspect-[16/10] w-full bg-[#030712]">
            <iframe
              src="/wasm-demo/examples/viz-benchmarks.html"
              className="h-full w-full border-0"
              title="CMA-ES WASM standalone benchmarks"
            />
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-6 md:p-8 space-y-6">
          {/* Top Control Bar: Benchmark Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              {BENCHMARKS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBench(b.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    selectedBenchId === b.id
                      ? "bg-sky-500 text-white shadow-glow-sm"
                      : "bg-slate-950/60 text-slate-400 hover:bg-slate-900 hover:text-white border border-white/5"
                  }`}
                >
                  {b.name.split(" ")[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={compareMode}
                  onChange={(e) => {
                    setCompareMode(e.target.checked);
                    if (e.target.checked && gdHistory.length === 0) {
                      const gd = runGradientDescent(currentBench.eval, startPoint, 40, 0.005);
                      const adam = runAdamOptimizer(currentBench.eval, startPoint, 40, 0.05);
                      const rs = runRandomSearch(currentBench.eval, currentBench.domain, 40 * lambda);
                      setGdHistory(gd);
                      setAdamHistory(adam);
                      setRsHistory(rs);
                    }
                  }}
                  className="rounded bg-slate-800 border-slate-700 text-sky-500 accent-sky-500"
                />
                <span>Compare vs GD & Adam Baselines</span>
              </label>
            </div>
          </div>

          {/* Description of current benchmark */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-xs">
            <div>
              <div className="font-bold text-white text-sm font-display">{currentBench.name}</div>
              <p className="text-slate-400 mt-0.5">{currentBench.description}</p>
            </div>
            <div className="font-mono text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20 shrink-0">
              <MathJax dynamic>{`$${currentBench.formula}$`}</MathJax>
            </div>
          </div>

          {/* Main Simulation Stage Grid */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
            {/* 2D Landscape Canvas */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={420}
                  className="w-full h-auto block cursor-crosshair"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const px = e.clientX - rect.left;
                    const py = e.clientY - rect.top;
                    const [dMin, dMax] = currentBench.domain;
                    const nx = (px / rect.width) * (dMax - dMin) + dMin;
                    const ny = ((rect.height - py) / rect.height) * (dMax - dMin) + dMin;
                    const newStart: [number, number] = [parseFloat(nx.toFixed(2)), parseFloat(ny.toFixed(2))];
                    setStartPoint(newStart);
                    setIsPlaying(false);
                    const { initialStep, gd, adam, rs } = createOptimizerState(
                      currentBench,
                      newStart,
                      initialSigma,
                      lambda,
                      activeCMA,
                      noiseLevel,
                      compareMode
                    );
                    setHistory([initialStep]);
                    setGdHistory(gd);
                    setAdamHistory(adam);
                    setRsHistory(rs);
                  }}
                />

                {/* Click hint overlay */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[0.68rem] text-slate-300 font-mono pointer-events-none">
                  Click contour map to reposition starting point $m_0$
                </div>

                {/* Live Diagnostics HUD */}
                {latestState && (
                  <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs font-mono space-y-1 shadow-2xl pointer-events-none">
                    <div className="text-emerald-400 font-bold">Best f(x): {latestState.bestFitness.toExponential(3)}</div>
                    <div className="text-sky-300">Step σ: {latestState.sigma.toFixed(4)}</div>
                    <div className="text-purple-300">Cond κ(C): {latestState.conditionNumber.toFixed(1)}</div>
                    <div className="text-slate-400">Evals: {latestState.evalCount}</div>
                  </div>
                )}
              </div>

              {/* Playback Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
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
                    <span>{isPlaying ? "Pause" : "Run Optimization"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      stepOptimization();
                    }}
                    className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Step 1 Generation"
                  >
                    <FastForward className="h-4 w-4" />
                  </button>

                  <button
                    onClick={resetOptimization}
                    className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Reset to Gen 0"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>Gen {latestState ? latestState.generation : 0}</span>
                  <span className="text-slate-600">|</span>
                  <span>λ = {lambda}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Convergence Chart & Interactive Sliders */}
            <div className="space-y-5">
              {/* Log Loss Convergence Canvas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="h-3.5 w-3.5 text-sky-400" />
                    Log-Loss Convergence
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5 font-mono text-[0.68rem]">
                    <span className="text-sky-400 font-bold">● CMA-ES</span>
                    {compareMode && <span className="text-amber-400 font-bold">● Adam</span>}
                    {compareMode && <span className="text-rose-400 font-bold">● GD</span>}
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-[#030712]">
                  <canvas ref={lossCanvasRef} width={420} height={200} className="w-full h-auto block" />
                </div>
              </div>

              {/* Sliders Configuration */}
              <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center justify-between">
                  <span>Optimizer Parameters</span>
                  <span className="text-[0.7rem] text-slate-500 font-mono">Live Tuning</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Population Size ($\lambda$)</span>
                    <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {lambda}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={48}
                    step={2}
                    value={lambda}
                    onChange={(e) => {
                      const newL = parseInt(e.target.value, 10);
                      setLambda(newL);
                      setIsPlaying(false);
                      const { initialStep, gd, rs } = createOptimizerState(
                        currentBench,
                        startPoint,
                        initialSigma,
                        newL,
                        activeCMA,
                        noiseLevel,
                        compareMode
                      );
                      setHistory([initialStep]);
                      setGdHistory(gd);
                      setRsHistory(rs);
                    }}
                    className="w-full accent-sky-400"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Initial Step Size ($\sigma_0$)</span>
                    <span className="text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {initialSigma.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1.5}
                    step={0.05}
                    value={initialSigma}
                    onChange={(e) => {
                      const newS = parseFloat(e.target.value);
                      setInitialSigma(newS);
                      setIsPlaying(false);
                      const { initialStep, gd, rs } = createOptimizerState(
                        currentBench,
                        startPoint,
                        newS,
                        lambda,
                        activeCMA,
                        noiseLevel,
                        compareMode
                      );
                      setHistory([initialStep]);
                      setGdHistory(gd);
                      setRsHistory(rs);
                    }}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Objective Noise (σ_noise)</span>
                    <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {noiseLevel.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={1.0}
                    step={0.05}
                    value={noiseLevel}
                    onChange={(e) => {
                      const newN = parseFloat(e.target.value);
                      setNoiseLevel(newN);
                      setIsPlaying(false);
                      const { initialStep, gd, rs } = createOptimizerState(
                        currentBench,
                        startPoint,
                        initialSigma,
                        lambda,
                        activeCMA,
                        newN,
                        compareMode
                      );
                      setHistory([initialStep]);
                      setGdHistory(gd);
                      setRsHistory(rs);
                    }}
                    className="w-full accent-purple-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
