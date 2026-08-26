"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Activity, Shuffle, Waves, Play, Pause, RotateCcw, Sparkles, Sliders, TrendingDown } from "lucide-react";
import { CMAESOptimizer, CMAESGenerationState } from "../lib/cmaesEngine";

const WIDTH = 460;
const HEIGHT = 260;

export function NoiseExplorer() {
  const [lambda, setLambda] = useState(16);
  const [noiseLevel, setNoiseLevel] = useState(0.8);
  const [noiseType, setNoiseType] = useState<"gaussian" | "cauchy">("gaussian");
  const [reevaluate, setReevaluate] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const optimizerRef = useRef<CMAESOptimizer | null>(null);

  // True underlying physical function (smooth 2D parabolic bowl with slight ripples)
  const trueFn = (x: number, y: number) => {
    return x * x + y * y + 0.3 * Math.cos(4 * x) + 0.3 * Math.sin(4 * y);
  };

  // Noisy black-box simulation evaluator
  const sampleNoise = useCallback(() => {
    if (noiseType === "gaussian") {
      // Box-Muller normal
      const u1 = Math.random() || 1e-6;
      const u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * noiseLevel;
    } else {
      // Standard Cauchy with heavy tails (occasional massive spikes)
      return Math.tan(Math.PI * (Math.random() - 0.5)) * (noiseLevel * 0.4);
    }
  }, [noiseType, noiseLevel]);

  const getOrInitOptimizer = useCallback(() => {
    if (!optimizerRef.current) {
      optimizerRef.current = new CMAESOptimizer(
        (x, y) => {
          const trueVal = trueFn(x, y);
          const noise = sampleNoise();
          return trueVal + noise;
        },
        {
          dim: 2,
          initialMean: [1.8, 1.6],
          initialSigma: 0.6,
          lambda,
          bounds: [-2.5, 2.5]
        }
      );
    }
    return optimizerRef.current;
  }, [lambda, sampleNoise]);

  const [history, setHistory] = useState<CMAESGenerationState[]>(() => {
    const opt = new CMAESOptimizer(
      (x, y) => {
        const u1 = Math.random() || 1e-6;
        const u2 = Math.random();
        const noise = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * 0.8;
        return trueFn(x, y) + noise;
      },
      {
        dim: 2,
        initialMean: [1.8, 1.6],
        initialSigma: 0.6,
        lambda: 16,
        bounds: [-2.5, 2.5]
      }
    );
    return [opt.step()];
  });

  const [trueLossHistory, setTrueLossHistory] = useState<number[]>(() => {
    const pt = [1.8, 1.6];
    return [trueFn(pt[0], pt[1])];
  });
  const [noisyLossHistory, setNoisyLossHistory] = useState<number[]>([5.2]);

  const resetOptimizer = useCallback(() => {
    const opt = new CMAESOptimizer(
      (x, y) => {
        const trueVal = trueFn(x, y);
        const noise = sampleNoise();
        return trueVal + noise;
      },
      {
        dim: 2,
        initialMean: [1.8, 1.6],
        initialSigma: 0.6,
        lambda,
        bounds: [-2.5, 2.5]
      }
    );
    optimizerRef.current = opt;
    const s0 = opt.step();
    setHistory([s0]);
    const initTrue = trueFn(s0.bestX[0], s0.bestX[1]);
    setTrueLossHistory([initTrue]);
    setNoisyLossHistory([s0.bestFitness]);
    setGeneration(0);
    setIsPlaying(false);
  }, [lambda, sampleNoise]);

  const stepOptimizer = useCallback(() => {
    const opt = getOrInitOptimizer();
    const nextState = opt.step();
    const trueBest = trueFn(nextState.bestX[0], nextState.bestX[1]);

    setHistory((prev) => [...prev, nextState]);
    setTrueLossHistory((prev) => [...prev, trueBest]);
    setNoisyLossHistory((prev) => [...prev, nextState.bestFitness]);
    setGeneration((g) => g + 1);
  }, [getOrInitOptimizer]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (generation >= 40) {
        setIsPlaying(false);
        return;
      }
      stepOptimizer();
    }, 130);
    return () => clearInterval(interval);
  }, [isPlaying, generation, stepOptimizer]);

  const latestState = history[history.length - 1];

  // Render 2D Contour Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !latestState) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const DOMAIN = 2.5;

    const toPxX = (x: number) => ((x + DOMAIN) / (2 * DOMAIN)) * W;
    const toPxY = (y: number) => H - ((y + DOMAIN) / (2 * DOMAIN)) * H;
    const toCoordX = (px: number) => (px / W) * (2 * DOMAIN) - DOMAIN;
    const toCoordY = (py: number) => ((H - py) / H) * (2 * DOMAIN) - DOMAIN;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw True Objective Heatmap
    const imgData = ctx.createImageData(W, H);
    for (let py = 0; py < H; py += 2) {
      const y = toCoordY(py);
      for (let px = 0; px < W; px += 2) {
        const x = toCoordX(px);
        const v = trueFn(x, y);
        const norm = Math.max(0, Math.min(1, v / 8));

        const r = Math.floor(10 + 15 * norm);
        const g = Math.floor(20 + 75 * (1 - norm));
        const b = Math.floor(40 + 120 * (1 - norm));

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

    // 2. Draw Historical Trajectory
    if (history.length > 1) {
      ctx.strokeStyle = "#38bdf8";
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

    // 3. Draw Covariance Ellipse
    const [l1, l2] = latestState.eigenvalues;
    const s1 = Math.sqrt(Math.max(1e-10, l1)) * latestState.sigma * (W / (2 * DOMAIN));
    const s2 = Math.sqrt(Math.max(1e-10, l2)) * latestState.sigma * (H / (2 * DOMAIN));
    const cx = toPxX(latestState.mean[0]);
    const cy = toPxY(latestState.mean[1]);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-latestState.ellipseAngle);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(14, 165, 233, 0.15)";
    ctx.beginPath();
    ctx.ellipse(0, 0, s1, s2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 4. Draw Noisy Samples
    latestState.samples.forEach((s) => {
      const sx = toPxX(s.x[0]);
      const sy = toPxY(s.x[1]);

      ctx.fillStyle = s.isElite ? "#34d399" : "rgba(168, 85, 247, 0.7)";
      ctx.beginPath();
      ctx.arc(sx, sy, s.isElite ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Draw Mean Point
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
    ctx.fill();
  }, [latestState, history]);

  // Render True vs Noisy Convergence Curve Canvas
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas || trueLossHistory.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, W, H);

    const PADDING = 30;
    const maxGen = Math.max(20, trueLossHistory.length);
    const toPxX = (g: number) => PADDING + (g / maxGen) * (W - 2 * PADDING);

    const allVals = [...trueLossHistory, ...noisyLossHistory];
    const maxVal = Math.max(4.0, ...allVals);
    const minVal = Math.min(-0.5, ...allVals);
    const toPxY = (v: number) => H - PADDING - ((v - minVal) / (maxVal - minVal + 1e-6)) * (H - 2 * PADDING);

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let v = 0; v <= 4; v += 1) {
      const y = toPxY(v);
      ctx.beginPath();
      ctx.moveTo(PADDING, y);
      ctx.lineTo(W - PADDING, y);
      ctx.stroke();
    }

    // Draw Noisy Observed Loss (Purple Jitter)
    ctx.strokeStyle = "rgba(168, 85, 247, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    noisyLossHistory.forEach((v, i) => {
      const x = toPxX(i);
      const y = toPxY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw True Latent Loss (Cyan Smooth)
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    trueLossHistory.forEach((v, i) => {
      const x = toPxX(i);
      const y = toPxY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText("Generations →", W - 85, H - 8);
  }, [trueLossHistory, noisyLossHistory]);

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Noise Explorer & Stochastic Robustness
            </h3>
            <p className="text-xs text-slate-400">
              How rank-based selection and population scaling filter out severe simulation noise
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNoiseType(noiseType === "gaussian" ? "cauchy" : "gaussian")}
            className="px-3 py-1.5 rounded-xl text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 capitalize hover:bg-purple-500/20 transition-colors"
          >
            Noise: {noiseType}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-start">
        {/* Canvases Column */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full h-auto block" />

            <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[0.68rem] font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Selected Elites</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Noisy Offspring</span>
              </div>
            </div>
          </div>

          {/* Convergence Chart */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-200">
              <span className="flex items-center gap-1 text-sky-400">
                <TrendingDown className="h-3.5 w-3.5" />
                True Underlying Loss vs Noisy Observation
              </span>
              <div className="flex items-center gap-3 font-mono text-[0.68rem]">
                <span className="text-sky-400">● True Loss</span>
                <span className="text-purple-400">● Observed</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-inner">
              <canvas ref={chartCanvasRef} width={WIDTH} height={140} className="w-full h-auto block" />
            </div>
          </div>
        </div>

        {/* Sliders & Parameters */}
        <div className="space-y-4">
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center justify-between">
              <span>Stochastic Controls</span>
              <span className="text-[0.7rem] text-slate-500 font-mono">Real-time</span>
            </div>

            {/* Noise Amplitude */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Noise Amplitude (σ_noise)</span>
                <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {noiseLevel.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Evaluation Noise Amplitude"
                min={0.0}
                max={2.0}
                step={0.1}
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            {/* Population Size */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Population Size (λ)</span>
                <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {lambda}
                </span>
              </div>
              <input
                type="range"
                aria-label="Population Size lambda"
                min={6}
                max={48}
                step={2}
                value={lambda}
                onChange={(e) => setLambda(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400"
              />
              <p className="text-[0.68rem] text-slate-500">
                Increasing λ averages out stochastic variance by √λ.
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white transition-all shadow-lg ${
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                  : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
              }`}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? "Pause" : "Run Optimization"}</span>
            </button>

            <button
              onClick={resetOptimizer}
              className="p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="font-bold text-purple-200 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>The Rank Invariance Secret</span>
            </div>
            <p>
              Gradient-based algorithms rely on numerical difference ratios, which divide by near-zero step intervals and blow up in the presence of noise. CMA-ES only needs the <strong>relative rank ordering</strong> of samples, making it naturally immune to small perturbations and outliers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
