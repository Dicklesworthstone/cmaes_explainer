"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "../hooks/useScrollSpy";
import { LatexRenderer } from "./LatexRenderer";
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
import { buildHeatmapCanvas, HeatmapFieldId } from "../lib/frankensimHeatmap";

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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { rootMargin: "250px 0px 250px 0px" });

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
    const { initialStep, gd, adam, rs } = createOptimizerState(
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
    setAdamHistory(adam);
    setRsHistory(rs);
  };

  // Quick Preset Scenarios
  const handleApplyPreset = (preset: "rosenbrock" | "rastrigin" | "cigar" | "ackley") => {
    setIsPlaying(false);
    if (preset === "rosenbrock") {
      setSelectedBenchId("rosenbrock");
      setInitialSigma(0.4);
      setLambda(16);
      setActiveCMA(true);
      const bench = BENCHMARKS.find((b) => b.id === "rosenbrock") || BENCHMARKS[0];
      const newStart: [number, number] = [-1.6, -1.0];
      setStartPoint(newStart);
      const { initialStep, gd, adam, rs } = createOptimizerState(
        bench,
        newStart,
        0.4,
        16,
        true,
        noiseLevel,
        compareMode
      );
      setHistory([initialStep]);
      setGdHistory(gd);
      setAdamHistory(adam);
      setRsHistory(rs);
    } else if (preset === "rastrigin") {
      setSelectedBenchId("rastrigin");
      setInitialSigma(0.8);
      setLambda(24);
      setActiveCMA(true);
      const bench = BENCHMARKS.find((b) => b.id === "rastrigin") || BENCHMARKS[0];
      const newStart: [number, number] = [3.2, -2.8];
      setStartPoint(newStart);
      const { initialStep, gd, adam, rs } = createOptimizerState(
        bench,
        newStart,
        0.8,
        24,
        true,
        noiseLevel,
        compareMode
      );
      setHistory([initialStep]);
      setGdHistory(gd);
      setAdamHistory(adam);
      setRsHistory(rs);
    } else if (preset === "cigar") {
      setSelectedBenchId("cigar");
      setInitialSigma(0.5);
      setLambda(16);
      setActiveCMA(true);
      const bench = BENCHMARKS.find((b) => b.id === "cigar") || BENCHMARKS[0];
      const newStart: [number, number] = [2.5, 2.5];
      setStartPoint(newStart);
      const { initialStep, gd, adam, rs } = createOptimizerState(
        bench,
        newStart,
        0.5,
        16,
        true,
        noiseLevel,
        compareMode
      );
      setHistory([initialStep]);
      setGdHistory(gd);
      setAdamHistory(adam);
      setRsHistory(rs);
    } else if (preset === "ackley") {
      setSelectedBenchId("ackley");
      setInitialSigma(0.6);
      setLambda(20);
      setActiveCMA(true);
      const bench = BENCHMARKS.find((b) => b.id === "ackley") || BENCHMARKS[0];
      const newStart: [number, number] = [-3.2, 3.2];
      setStartPoint(newStart);
      const { initialStep, gd, adam, rs } = createOptimizerState(
        bench,
        newStart,
        0.6,
        20,
        true,
        noiseLevel,
        compareMode
      );
      setHistory([initialStep]);
      setGdHistory(gd);
      setAdamHistory(adam);
      setRsHistory(rs);
    }
  };

  // Step the optimizer
  const stepOptimization = useCallback(() => {
    const opt = getOrInitOptimizer();
    const nextState = opt.step();
    setHistory((prev) => [...prev, nextState]);
  }, [getOrInitOptimizer]);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying || history.length >= 60) return;
    const interval = setInterval(() => {
      stepOptimization();
    }, speedMs);
    return () => clearInterval(interval);
  }, [isPlaying, history.length, speedMs, stepOptimization]);

  const latestState = history[history.length - 1] || null;
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animPosRef = useRef({
    m0: startPoint[0],
    m1: startPoint[1],
    sigma: initialSigma,
    l1: 1,
    l2: 1,
    angle: 0,
    pc0: 0,
    pc1: 0,
  });

  // Background heatmap, rasterized per benchmark switch by the FrankenSim
  // fs-heatmap-wasm kernel (pixel-identical JS fallback inside
  // buildHeatmapCanvas), off the switch's paint path either way. Kept in a
  // ref: the rAF loop below reads it every frame, so late arrival needs no
  // re-render.
  useEffect(() => {
    let live = true;
    const fieldByBench: Record<string, HeatmapFieldId | undefined> = {
      rosenbrock: "rosenbrock100",
      rastrigin: "rastrigin",
      ackley: "ackley",
      cigar: "cigar-y1000",
      himmelblau: "himmelblau",
      step_ridge: "step-ridge"
    };
    const fieldId = fieldByBench[currentBench.id];
    if (!fieldId) return;
    const [dMin, dMax] = currentBench.domain;
    buildHeatmapCanvas({
      field: fieldId,
      width: 1120,
      height: 840,
      xmin: dMin,
      xmax: dMax,
      ymin: dMin,
      ymax: dMax,
      norm: { mode: "log10eps", k: 4 },
      ramp: { r0: 6, rk: 18, g0: 16, gk: 85, b0: 32, bk: 130 },
      fallbackField: currentBench.eval
    }).then((canvas) => {
      if (live && canvas) bgCanvasRef.current = canvas;
    });
    return () => {
      live = false;
    };
  }, [currentBench]);

  // --- Render 2D Contour Map, Samples, Ellipses, Paths with smooth 60fps interpolation (throttled when offscreen) ---
  useEffect(() => {
    if (!isInView) return;
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas || !latestState) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const [dMin, dMax] = currentBench.domain;

    const toPxX = (x: number) => ((x - dMin) / (dMax - dMin)) * W;
    const toPxY = (y: number) => H - ((y - dMin) / (dMax - dMin)) * H;

    const render = () => {
      const a = animPosRef.current;
      const lerp = 0.22;
      a.m0 += (latestState.mean[0] - a.m0) * lerp;
      a.m1 += (latestState.mean[1] - a.m1) * lerp;
      a.sigma += (latestState.sigma - a.sigma) * lerp;
      a.l1 += (latestState.eigenvalues[0] - a.l1) * lerp;
      a.l2 += (latestState.eigenvalues[1] - a.l2) * lerp;
      // Ellipse orientation has period pi: lerp along the shortest equivalent
      // rotation so an eigen-angle wrap (e.g. +88 deg -> -88 deg) does not
      // sweep the ellipse through ~176 deg of wrong orientations.
      let dAngle = latestState.ellipseAngle - a.angle;
      dAngle -= Math.PI * Math.round(dAngle / Math.PI);
      a.angle += dAngle * lerp;
      a.pc0 += (latestState.pC[0] - a.pc0) * lerp;
      a.pc1 += (latestState.pC[1] - a.pc1) * lerp;

      ctx.clearRect(0, 0, W, H);

      // 1. Draw Cached Vector Field / Contour Heatmap
      if (bgCanvasRef.current) {
        ctx.drawImage(bgCanvasRef.current, 0, 0, W, H);
      }

      // 2. Draw Subtle Coordinate Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1.5;
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

      // 3. Draw Global Optimum Star Markers (some benchmarks, e.g.
      // Himmelblau, have several equal-valued global minima)
      const optimaList = currentBench.optima ?? [currentBench.optimum];
      ctx.strokeStyle = "#fbbf24";
      ctx.fillStyle = "#fbbf24";
      ctx.lineWidth = 3.5;
      optimaList.forEach(([optX, optY]) => {
        const opx = toPxX(optX);
        const opy = toPxY(optY);
        ctx.beginPath();
        ctx.arc(opx, opy, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(opx - 14, opy);
        ctx.lineTo(opx + 14, opy);
        ctx.moveTo(opx, opy - 14);
        ctx.lineTo(opx, opy + 14);
        ctx.stroke();
      });

      // 4. Draw Comparison Baselines (Gradient Descent & Adam)
      if (compareMode) {
        // Gradient Descent Trajectory (Rose Red)
        if (gdHistory.length > 1) {
          ctx.strokeStyle = "rgba(244, 63, 94, 0.85)";
          ctx.lineWidth = 3.0;
          ctx.setLineDash([6, 6]);
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
          ctx.strokeStyle = "rgba(251, 191, 36, 0.9)";
          ctx.lineWidth = 3.2;
          ctx.setLineDash([8, 4]);
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
        ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        history.forEach((st, i) => {
          const mx = toPxX(st.mean[0]);
          const my = toPxY(st.mean[1]);
          if (i === 0) ctx.moveTo(mx, my);
          else ctx.lineTo(mx, my);
        });
        ctx.stroke();
      }

      // 6. Draw covariance 1-sigma & 2-sigma confidence ellipses. The canvas
      // pixels are not square relative to the domain, so build the path under
      // the full data-to-pixel transform (rotate first, anisotropic scale
      // after) and stroke it outside the transform; pre-scaling the radii and
      // then rotating would tilt the ellipse away from the covariance's true
      // orientation and disagree with the theta printed in the telemetry.
      const a1 = Math.sqrt(Math.max(1e-10, a.l1)) * a.sigma;
      const a2 = Math.sqrt(Math.max(1e-10, a.l2)) * a.sigma;
      const kxScale = W / (dMax - dMin);
      const kyScale = H / (dMax - dMin);
      const cx = toPxX(a.m0);
      const cy = toPxY(a.m1);

      [1, 2].forEach((k) => {
        ctx.strokeStyle = k === 1 ? "rgba(56, 189, 248, 0.95)" : "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = k === 1 ? 4 : 2;
        ctx.fillStyle = k === 1 ? "rgba(14, 165, 233, 0.15)" : "transparent";

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(kxScale, -kyScale);
        ctx.rotate(a.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, a1 * k, a2 * k, 0, 0, Math.PI * 2);
        ctx.restore();
        if (k === 1) ctx.fill();
        ctx.stroke();

        // Draw principal axes on 1-sigma ellipse
        if (k === 1) {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
          ctx.lineWidth = 2.5;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(kxScale, -kyScale);
          ctx.rotate(a.angle);
          ctx.beginPath();
          ctx.moveTo(-a1, 0);
          ctx.lineTo(a1, 0);
          ctx.moveTo(0, -a2);
          ctx.lineTo(0, a2);
          ctx.restore();
          ctx.stroke();
        }
      });

      // 7. Draw Evolution Path Vector p_c (Purple Arrow). Both endpoints go
      // through the same data-to-pixel mapping so the arrow's direction stays
      // true under the non-square canvas.
      const pcX = toPxX(a.m0 + a.pc0 * 1.5);
      const pcY = toPxY(a.m1 + a.pc1 * 1.5);

      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 4;
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
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(sx, sy, 7.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else {
          // Cyan/Slate for other offspring
          ctx.fillStyle = "rgba(148, 163, 184, 0.75)";
          ctx.beginPath();
          ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 9. Draw Mean Point
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [currentBench, latestState, history, compareMode, gdHistory, adamHistory, isInView]);

  // --- Render Log-Loss Convergence Chart with High-DPI Sharpness ---
  useEffect(() => {
    const canvas = lossCanvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Draw background
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.fillRect(0, 0, W, H);

    // Compute bounds
    const maxEvals = Math.max(
      60 * lambda,
      ...history.map((s) => s.evalCount),
      ...(compareMode && gdHistory ? gdHistory.map((s) => s.evalCount) : [1])
    );
    const toPxX = (evals: number) => (evals / maxEvals) * (W - 70) + 50;
    const toPxY = (logLoss: number) => {
      const minLog = -8;
      const maxLog = 4;
      return H - 35 - ((logLoss - minLog) / (maxLog - minLog)) * (H - 70);
    };

    // Draw Grid & Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.5;
    for (let logL = -8; logL <= 4; logL += 2) {
      const y = toPxY(logL);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(W - 20, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`1e${logL}`, 44, y + 4);
    }

    // Draw GD Convergence Curve (Rose)
    if (compareMode && gdHistory && gdHistory.length > 0) {
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 3;
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
      ctx.lineWidth = 3;
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
    ctx.lineWidth = 4;
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
    ctx.font = "bold 15px Inter, sans-serif";
    ctx.fillText("Function Evaluations →", W - 180, H - 12);
  }, [history, currentBench, compareMode, gdHistory, adamHistory, lambda]);

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="prose-cmaes">
        <p className="text-lg text-slate-300 leading-relaxed">
          Test CMA-ES live against classical benchmark test functions. Watch the covariance matrix adapt its principal axes,
          observe cumulative step-size adaptation (σ grows on aligned steps and shrinks on oscillating ones), and compare its
          convergence rate against finite-difference gradient descent.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setViewMode("native")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-[background-color,color,box-shadow] ${
              viewMode === "native"
                ? "bg-sky-500 text-white shadow-glow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Native Interactive Engine
          </button>
          <button
            onClick={() => setViewMode("wasm_iframe")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-[background-color,color,box-shadow] ${
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
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              className="h-full w-full border-0"
              title="CMA-ES WASM standalone benchmarks"
            />
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-6 md:p-8 space-y-6">
          {/* Curated Presets Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-indigo-950/20 to-purple-950/30 border border-sky-500/20 shadow-inner">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
              <span className="text-xs font-bold text-white font-display">Instant Stress-Test Presets:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "rosenbrock", label: "🍌 Ill-Conditioned Canyon", tip: "Curved narrow valley" },
                { id: "rastrigin", label: "🏔️ Regular Multimodal Grid", tip: "Many local minima around a global funnel" },
                { id: "cigar", label: "⚡ Extreme Curvature Ratio (1000:1)", tip: "Level-set axis ratio √1000 ≈ 31.6:1" },
                { id: "ackley", label: "🎯 Sharp Funnel", tip: "Flat outer plateau" }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p.id as any)}
                  title={p.tip}
                  className="px-3 py-1 text-xs font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-200 border border-sky-500/20 hover:border-sky-400/50 hover:text-white transition-[background-color,border-color,color,transform] active:scale-95 shadow-sm"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top Control Bar: Benchmark Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              {BENCHMARKS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBench(b.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-[background-color,color,box-shadow,border-color] ${
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
            <div className="font-mono text-sky-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-sky-500/30 shrink-0">
              <LatexRenderer math={currentBench.formula} block={false} />
            </div>
          </div>

          {/* Main Simulation Stage Grid */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
            {/* 2D Landscape Canvas (min-w-0: Safari otherwise propagates the
                1120px canvas backing width through the grid track) */}
            <div className="space-y-3 min-w-0">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
                <canvas
                  ref={canvasRef}
                  width={1120}
                  height={840}
                  tabIndex={0}
                  aria-label="Interactive 2D Benchmark Landscape Contour Map. Click or use arrow keys to reposition initial mean m0."
                  className="w-full h-auto block cursor-crosshair focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  onKeyDown={(e) => {
                    const step = 0.2;
                    let dx = 0;
                    let dy = 0;
                    if (e.key === "ArrowLeft") dx = -step;
                    else if (e.key === "ArrowRight") dx = step;
                    else if (e.key === "ArrowUp") dy = step;
                    else if (e.key === "ArrowDown") dy = -step;
                    else return;
                    e.preventDefault();
                    const [dMin, dMax] = currentBench.domain;
                    const newX = Math.max(dMin, Math.min(dMax, startPoint[0] + dx));
                    const newY = Math.max(dMin, Math.min(dMax, startPoint[1] + dy));
                    const newStart: [number, number] = [parseFloat(newX.toFixed(2)), parseFloat(newY.toFixed(2))];
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
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 text-[0.62rem] sm:text-[0.68rem] text-slate-300 font-mono pointer-events-none flex items-center gap-1.5">
                  <span className="sm:hidden">Tap to move</span>
                  <span className="hidden sm:inline">Click to reposition starting point</span>
                  <LatexRenderer math="m_0" block={false} />
                </div>

                {/* Live Diagnostics HUD */}
                {latestState && (
                  <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[0.68rem] font-mono shadow-2xl pointer-events-none flex items-center gap-2">
                    <span className="text-slate-400">Best:</span>
                    <span className="text-emerald-400 font-bold">
                      {latestState.bestFitness < 1e-3 ? latestState.bestFitness.toExponential(2) : latestState.bestFitness.toFixed(3)}
                    </span>
                  </div>
                )}
              </div>

              {/* Playback Control Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-[background-color,box-shadow,transform] ${
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

                {/* Speed Controls & Metadata */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-white/5">
                    <span className="text-[0.65rem] text-slate-500">Speed:</span>
                    {[
                      { label: "Slow", ms: 650 },
                      { label: "Normal", ms: 350 },
                      { label: "Fast", ms: 120 }
                    ].map((s) => (
                      <button
                        key={s.ms}
                        type="button"
                        onClick={() => setSpeedMs(s.ms)}
                        className={`px-1.5 py-0.5 rounded text-[0.65rem] transition-colors ${
                          speedMs === s.ms ? "bg-sky-500 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span>Gen {latestState ? latestState.generation : 0}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Convergence Chart & Interactive Sliders */}
            <div className="space-y-5 min-w-0">
              {/* Log Loss Convergence Canvas */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="h-3.5 w-3.5 text-sky-400" />
                    Log-Loss Convergence
                  </span>
                  <div className="flex items-center gap-2.5 font-mono text-[0.68rem] shrink-0">
                    <span className="text-sky-400 font-bold">● CMA-ES</span>
                    {compareMode && <span className="text-amber-400 font-bold">● Adam</span>}
                    {compareMode && <span className="text-rose-400 font-bold">● GD</span>}
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-[#030712]">
                  <canvas ref={lossCanvasRef} width={840} height={400} className="w-full h-auto block" />
                </div>
              </div>

              {/* Sliders Configuration */}
              <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center justify-between">
                  <span>Optimizer Parameters</span>
                  <span className="text-[0.7rem] text-slate-500 font-mono">Live Tuning</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-slate-300 flex items-center gap-1">
                      Population Size (<LatexRenderer math="\lambda" block={false} />)
                    </span>
                    <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {lambda}
                    </span>
                  </div>
                  <input
                    type="range"
                    aria-label="Population Size lambda"
                    min={4}
                    max={48}
                    step={2}
                    value={lambda}
                    onChange={(e) => {
                      const newL = parseInt(e.target.value, 10);
                      setLambda(newL);
                      setIsPlaying(false);
                      const { initialStep, gd, adam, rs } = createOptimizerState(
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
                      setAdamHistory(adam);
                      setRsHistory(rs);
                    }}
                    className="w-full accent-sky-400"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-slate-300 flex items-center gap-1">
                      Initial Step Size (<LatexRenderer math="\sigma_0" block={false} />)
                    </span>
                    <span className="text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {initialSigma.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    aria-label="Initial Step Size sigma"
                    min={0.1}
                    max={1.5}
                    step={0.05}
                    value={initialSigma}
                    onChange={(e) => {
                      const newS = parseFloat(e.target.value);
                      setInitialSigma(newS);
                      setIsPlaying(false);
                      const { initialStep, gd, adam, rs } = createOptimizerState(
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
                      setAdamHistory(adam);
                      setRsHistory(rs);
                    }}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300 flex items-center gap-1">
                      Objective Noise (<LatexRenderer math="\sigma_{\text{noise}}" block={false} />)
                    </span>
                    <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {noiseLevel.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    aria-label="Objective Noise Level"
                    min={0.0}
                    max={1.0}
                    step={0.05}
                    value={noiseLevel}
                    onChange={(e) => {
                      const newN = parseFloat(e.target.value);
                      setNoiseLevel(newN);
                      setIsPlaying(false);
                      const { initialStep, gd, adam, rs } = createOptimizerState(
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
                      setAdamHistory(adam);
                      setRsHistory(rs);
                    }}
                    className="w-full accent-purple-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Simulation Internal Algebraic State Telemetry Card */}
          {latestState && (
            <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-sky-950/30 p-5 md:p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <span>Live Simulation Internal Algebraic State</span>
                      <span className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-full border ${
                        isPlaying ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 animate-pulse" : "bg-slate-800 border-white/10 text-slate-400"
                      }`}>
                        {isPlaying ? "Running CMA-ES" : "Paused / Stepping"}
                      </span>
                    </h4>
                    <p className="text-[0.7rem] text-slate-400">
                      Real-time covariance eigensystem, evolution path momentum, and step-size adaptation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">Gen {latestState.generation} / 60</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-sky-300">Evals: {latestState.evalCount}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                {/* Card 1: Distribution Mean */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1">
                  <div className="text-[0.65rem] font-bold uppercase tracking-wider text-purple-400 flex items-center justify-between">
                    <span>Distribution Mean</span>
                    <LatexRenderer math="m" block={false} />
                  </div>
                  <div className="font-mono text-white text-sm font-semibold">
                    ({latestState.mean[0].toFixed(2)}, {latestState.mean[1].toFixed(2)})
                  </div>
                  <div className="text-[0.68rem] text-slate-400 font-mono">
                    {currentBench.optima && currentBench.optima.length > 1
                      ? `${currentBench.optima.length} equal global minima`
                      : `Target: (${currentBench.optimum[0].toFixed(1)}, ${currentBench.optimum[1].toFixed(1)})`}
                  </div>
                </div>

                {/* Card 2: Global Step Size */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1">
                  <div className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                    <span>Global Step-Size</span>
                    <LatexRenderer math="\sigma" block={false} />
                  </div>
                  <div className="font-mono text-amber-300 text-sm font-semibold">
                    {latestState.sigma.toFixed(3)}
                  </div>
                  <div className="text-[0.68rem] text-slate-400 font-mono">
                    <LatexRenderer math="\|p_\sigma\|" block={false} /> = {Math.hypot(latestState.pSigma[0], latestState.pSigma[1]).toFixed(2)} (vs <LatexRenderer math="\mathbb{E}\|\mathcal{N}\| \approx 1.25" block={false} />)
                  </div>
                </div>

                {/* Card 3: Covariance Condition Number */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1">
                  <div className="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                    <span>Condition Number</span>
                    <LatexRenderer math="\kappa(C)" block={false} />
                  </div>
                  <div className="font-mono text-emerald-300 text-sm font-semibold">
                    {latestState.conditionNumber.toFixed(1)} : 1
                  </div>
                  <div className="text-[0.68rem] text-slate-400 font-mono">
                    <LatexRenderer math="\theta" block={false} /> = {((latestState.ellipseAngle * 180) / Math.PI).toFixed(0)}° orientation
                  </div>
                </div>

                {/* Card 4: Evolution Path pc */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1">
                  <div className="text-[0.65rem] font-bold uppercase tracking-wider text-rose-400 flex items-center justify-between">
                    <span>Covariance Path</span>
                    <LatexRenderer math="p_c" block={false} />
                  </div>
                  <div className="font-mono text-rose-300 text-sm font-semibold">
                    <LatexRenderer math="\|p_c\|" block={false} /> = {Math.hypot(latestState.pC[0], latestState.pC[1]).toFixed(2)}
                  </div>
                  <div className="text-[0.68rem] text-slate-400">
                    {activeCMA ? "Rank-1 + rank-μ, negative weights on the worst" : "Rank-1 + rank-μ CMA"}
                  </div>
                </div>

                {/* Card 5: Best Fitness */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5 space-y-1 sm:col-span-2 lg:col-span-1">
                  <div className="text-[0.65rem] font-bold uppercase tracking-wider text-sky-400 flex items-center justify-between">
                    <span>Current Best</span>
                    <LatexRenderer math="f_{\text{best}}" block={false} />
                  </div>
                  <div className="font-mono text-sky-300 text-sm font-semibold">
                    {latestState.bestFitness < 1e-4 ? latestState.bestFitness.toExponential(3) : latestState.bestFitness.toFixed(4)}
                  </div>
                  <div className="text-[0.68rem] text-slate-400 font-mono">
                    Optimum: {currentBench.optimumValue.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
