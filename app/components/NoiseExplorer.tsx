"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Activity, Shuffle, Waves, Play, Pause, RotateCcw, Sparkles, Sliders, TrendingDown } from "lucide-react";
import { LatexRenderer } from "./LatexRenderer";
import { CMAESOptimizer, CMAESGenerationState } from "../lib/cmaesEngine";

const WIDTH = 920;
const HEIGHT = 520;

// Median observed fitness of a generation: a genuinely noisy per-generation
// statistic. (The running best would be monotone by construction and could
// never show the jitter the convergence chart is about.)
const medianObservedFitness = (state: CMAESGenerationState) =>
  state.samples[Math.floor(state.samples.length / 2)].fitness;

// True underlying physical function (smooth 2D parabolic bowl with slight ripples)
const trueFn = (x: number, y: number) =>
  x * x + y * y + 0.3 * Math.cos(4 * x) + 0.3 * Math.sin(4 * y);

export function NoiseExplorer() {
  const [lambda, setLambda] = useState(16);
  const [noiseLevel, setNoiseLevel] = useState(0.8);
  const [noiseType, setNoiseType] = useState<"gaussian" | "cauchy">("gaussian");
  const [generation, setGeneration] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // The optimizer's objective reads the noise sampler through a ref, so the
  // amplitude and noise-type controls really do act on the running optimizer
  // (the "Real-time" label) instead of a sampler frozen at construction time.
  const sampleNoiseRef = useRef(sampleNoise);
  useEffect(() => {
    sampleNoiseRef.current = sampleNoise;
  }, [sampleNoise]);

  const noisyObjective = useCallback(
    (x: number, y: number) => trueFn(x, y) + sampleNoiseRef.current(),
    []
  );

  const optimizerRef = useRef<CMAESOptimizer | null>(null);

  const getOrInitOptimizer = useCallback(() => {
    if (!optimizerRef.current) {
      optimizerRef.current = new CMAESOptimizer(noisyObjective, {
        dim: 2,
        initialMean: [1.8, 1.6],
        initialSigma: 0.6,
        lambda,
        bounds: [-2.5, 2.5]
      });
    }
    return optimizerRef.current;
  }, [lambda, noisyObjective]);

  const [history, setHistory] = useState<CMAESGenerationState[]>([]);

  const latestState: CMAESGenerationState | undefined = history[history.length - 1];

  const [trueLossHistory, setTrueLossHistory] = useState<number[]>([]);
  const [noisyLossHistory, setNoisyLossHistory] = useState<number[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);

  const resetOptimizer = useCallback(() => {
    const opt = new CMAESOptimizer(noisyObjective, {
      dim: 2,
      initialMean: [1.8, 1.6],
      initialSigma: 0.6,
      lambda,
      bounds: [-2.5, 2.5]
    });
    optimizerRef.current = opt;
    const st0 = opt.step();
    setHistory([st0]);
    setTrueLossHistory([trueFn(st0.mean[0], st0.mean[1])]);
    setNoisyLossHistory([medianObservedFitness(st0)]);
    setGeneration(0);
    setIsPlaying(false);
  }, [lambda, noisyObjective]);

  // Seed the first run on mount and rebuild whenever lambda changes
  // (population size is fixed at construction). Deferred a tick so the
  // seeding never sets state synchronously inside the effect; the optimizer
  // that produced the displayed generation is the one kept for later steps
  // (a replay scheme would desync because the noise is not seeded).
  useEffect(() => {
    const id = window.setTimeout(() => {
      resetOptimizer();
    }, 0);
    return () => window.clearTimeout(id);
  }, [lambda, resetOptimizer]);

  const stepOptimizer = useCallback(() => {
    const opt = getOrInitOptimizer();
    const nextState = opt.step();
    setHistory((prev) => [...prev, nextState]);

    const trueBest = trueFn(nextState.mean[0], nextState.mean[1]);
    setTrueLossHistory((prev) => [...prev, trueBest]);
    setNoisyLossHistory((prev) => [...prev, medianObservedFitness(nextState)]);
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

  // Pre-rendered high-definition static objective heatmap canvas (memoized)
  const bgCanvas = useMemo(() => {
    if (typeof document === "undefined") return null;
    const offscreen = document.createElement("canvas");
    offscreen.width = WIDTH;
    offscreen.height = HEIGHT;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return null;

    const DOMAIN = 2.5;
    const toCoordX = (px: number) => (px / WIDTH) * (2 * DOMAIN) - DOMAIN;
    const toCoordY = (py: number) => ((HEIGHT - py) / HEIGHT) * (2 * DOMAIN) - DOMAIN;

    const imgData = ctx.createImageData(WIDTH, HEIGHT);
    const buf32 = new Uint32Array(imgData.data.buffer);

    for (let py = 0; py < HEIGHT; py++) {
      const y = toCoordY(py);
      const rowOffset = py * WIDTH;
      for (let px = 0; px < WIDTH; px++) {
        const x = toCoordX(px);
        const v = trueFn(x, y);
        const norm = Math.max(0, Math.min(1, v / 8));

        const r = (10 + 15 * norm) | 0;
        const g = (20 + 75 * (1 - norm)) | 0;
        const b = (40 + 120 * (1 - norm)) | 0;

        buf32[rowOffset + px] = (255 << 24) | (b << 16) | (g << 8) | r;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return offscreen;
  }, []);

  // Render 2D Contour Canvas with High-DPI Sharpness
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

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Cached True Objective Heatmap
    if (bgCanvas) {
      ctx.drawImage(bgCanvas, 0, 0, W, H);
    }

    // 2. Draw Historical Trajectory
    if (history.length > 1) {
      ctx.strokeStyle = "#38bdf8";
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

    // 3. Draw covariance ellipse. The canvas pixels are not square relative
    // to the domain, so build the path under the full data-to-pixel transform
    // (rotate first, anisotropic scale after) and stroke it outside the
    // transform; pre-scaling the radii before rotating would tilt the ellipse
    // away from the covariance's true orientation.
    const [l1, l2] = latestState.eigenvalues;
    const a1 = Math.sqrt(Math.max(1e-10, l1)) * latestState.sigma;
    const a2 = Math.sqrt(Math.max(1e-10, l2)) * latestState.sigma;
    const cx = toPxX(latestState.mean[0]);
    const cy = toPxY(latestState.mean[1]);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
    ctx.lineWidth = 3.5;
    ctx.fillStyle = "rgba(14, 165, 233, 0.18)";
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(W / (2 * DOMAIN), -(H / (2 * DOMAIN)));
    ctx.rotate(latestState.ellipseAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, a1, a2, 0, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();
    ctx.stroke();

    // 4. Draw Noisy Samples
    latestState.samples.forEach((s) => {
      const sx = toPxX(s.x[0]);
      const sy = toPxY(s.x[1]);

      ctx.fillStyle = s.isElite ? "#34d399" : "rgba(168, 85, 247, 0.85)";
      ctx.beginPath();
      ctx.arc(sx, sy, s.isElite ? 7.5 : 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Draw Mean Point
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [latestState, history, bgCanvas]);

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

    const PADDING = 45;
    const maxGen = Math.max(20, trueLossHistory.length);
    const toPxX = (g: number) => PADDING + (g / maxGen) * (W - 2 * PADDING);

    const allVals = [...trueLossHistory, ...noisyLossHistory];
    const maxVal = Math.max(4.0, ...allVals);
    const minVal = Math.min(-0.5, ...allVals);
    const toPxY = (v: number) => H - PADDING - ((v - minVal) / (maxVal - minVal + 1e-6)) * (H - 2 * PADDING);

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.5;
    for (let v = 0; v <= 4; v += 1) {
      const y = toPxY(v);
      ctx.beginPath();
      ctx.moveTo(PADDING, y);
      ctx.lineTo(W - PADDING, y);
      ctx.stroke();
    }

    // Draw Noisy Observed Loss (Purple Jitter)
    ctx.strokeStyle = "rgba(168, 85, 247, 0.75)";
    ctx.lineWidth = 2.5;
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
    ctx.lineWidth = 4;
    ctx.beginPath();
    trueLossHistory.forEach((v, i) => {
      const x = toPxX(i);
      const y = toPxY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.fillText("Generations →", W - 140, H - 14);
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
                <span className="text-sky-400">● True Loss at Mean</span>
                <span className="text-purple-400">● Median Observed</span>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-inner">
              <canvas ref={chartCanvasRef} width={WIDTH} height={280} className="w-full h-auto block" />
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
                <span className="text-slate-300 flex items-center gap-1">
                  Noise Amplitude (<LatexRenderer math="\sigma_{\text{noise}}" block={false} />)
                </span>
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
                min={6}
                max={48}
                step={2}
                value={lambda}
                onChange={(e) => setLambda(parseInt(e.target.value, 10))}
                className="w-full accent-sky-400"
              />
              <p className="text-[0.68rem] text-slate-500">
                <span>Raising </span><LatexRenderer math="\lambda" block={false} /><span> makes the noisy rank ordering more reliable, and the weighted recombination averages independent noise so the error in the mean update shrinks roughly like </span><LatexRenderer math="1/\sqrt{\mu_{\text{eff}}}" block={false} />.
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white transition-[background-color,box-shadow,transform] shadow-lg ${
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
              Gradient-based algorithms rely on numerical difference ratios, which divide by near-zero step intervals and blow up in the presence of noise. CMA-ES only needs the <strong>relative rank ordering</strong> of samples, so the scale of the objective is irrelevant. Noise still corrupts the ordering itself, which is exactly why larger populations, elite reevaluation, and explicit uncertainty handling exist; try the Cauchy setting to watch heavy-tailed spikes scramble the ranks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
