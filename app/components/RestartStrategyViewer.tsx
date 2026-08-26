"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw, Timer, Activity, Play, Pause, RotateCcw, Sparkles, Layers, TrendingDown } from "lucide-react";
import { LatexRenderer } from "./LatexRenderer";
import { CMAESOptimizer, CMAESGenerationState } from "../lib/cmaesEngine";
import { buildHeatmapCanvas } from "../lib/frankensimHeatmap";

const WIDTH = 960;
const HEIGHT = 520;

// Highly multimodal Rastrigin-like 2D landscape with multiple deceptively deep local basins
const multimodalFn = (x: number, y: number) => {
  return 10 * 2 + (x * x - 10 * Math.cos(2 * Math.PI * x)) + (y * y - 10 * Math.cos(2 * Math.PI * y));
};

export function RestartStrategyViewer() {
  const [strategy, setStrategy] = useState<"ipop" | "bipop">("ipop");
  const [isPlaying, setIsPlaying] = useState(false);

  const [restartCount, setRestartCount] = useState(0);
  const [currentLambda, setCurrentLambda] = useState(8);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // First-run initialization inside a state initializer: the first run goes
  // through the same accounting as every restart, so its lambda evaluations
  // count against the budget and seed the global best. The start point is
  // FIXED (the engine's RNG is seeded), so the server-rendered "Global Best"
  // text matches the client's first render; only user-triggered restarts
  // draw random start points.
  const [initialRun] = useState(() => {
    const opt = new CMAESOptimizer(multimodalFn, {
      dim: 2,
      initialMean: [1.9, -2.3],
      initialSigma: 0.6,
      lambda: 8,
      bounds: [-3.5, 3.5]
    });
    return { opt, s0: opt.step() };
  });

  const optimizerRef = useRef<CMAESOptimizer | null>(initialRun.opt);
  // Mirrors of the budget/best state so spawnRestart can account for the
  // evaluations its first generation consumes without stale-closure reads.
  const evalBudgetRef = useRef(8);
  const globalBestRef = useRef(initialRun.s0.bestFitness);
  // BIPOP keeps a doubling ladder for its large-population regime.
  const largeLambdaRef = useRef(8);

  const [evalBudget, setEvalBudget] = useState<number>(8);
  const [globalBestFitness, setGlobalBestFitness] = useState<number>(initialRun.s0.bestFitness);
  const [history, setHistory] = useState<CMAESGenerationState[]>(() => [initialRun.s0]);
  const [fitnessTimeline, setFitnessTimeline] = useState<{ evals: number; fit: number; lambda: number }[]>(() => [
    { evals: 8, fit: initialRun.s0.bestFitness, lambda: 8 }
  ]);

  const getOrInitOptimizer = useCallback((popSize: number, sigmaInit: number) => {
    if (!optimizerRef.current) {
      const startX = (Math.random() - 0.5) * 5.0;
      const startY = (Math.random() - 0.5) * 5.0;
      optimizerRef.current = new CMAESOptimizer(multimodalFn, {
        dim: 2,
        initialMean: [startX, startY],
        initialSigma: sigmaInit,
        lambda: popSize,
        bounds: [-3.5, 3.5],
        seed: (Math.random() * 0xffffffff) >>> 0
      });
    }
    return optimizerRef.current;
  }, []);

  // Initialize optimizer for a specific run. Its first generation consumes
  // popSize real evaluations, so those are counted against the budget and its
  // best contributes to the global record; skipping them would hand every
  // restart a free generation and bias the IPOP-vs-BIPOP comparison.
  const spawnRestart = useCallback((popSize: number, sigmaInit: number) => {
    const startX = (Math.random() - 0.5) * 5.0;
    const startY = (Math.random() - 0.5) * 5.0;
    // A fresh seed per restart: with the engine's default seed every restart
    // at the same lambda would replay the identical offspring stream, and the
    // demo's premise is that restarts sample the basin structure independently.
    const opt = new CMAESOptimizer(multimodalFn, {
      dim: 2,
      initialMean: [startX, startY],
      initialSigma: sigmaInit,
      lambda: popSize,
      bounds: [-3.5, 3.5],
      seed: (Math.random() * 0xffffffff) >>> 0
    });
    optimizerRef.current = opt;
    setCurrentLambda(popSize);
    const s0 = opt.step();
    setHistory([s0]);
    evalBudgetRef.current += popSize;
    globalBestRef.current = Math.min(globalBestRef.current, s0.bestFitness);
    setEvalBudget(evalBudgetRef.current);
    setGlobalBestFitness(globalBestRef.current);
    setFitnessTimeline((prev) => [
      ...prev,
      { evals: evalBudgetRef.current, fit: globalBestRef.current, lambda: popSize }
    ]);
  }, []);

  const latestState = history[history.length - 1];

  const resetAll = useCallback(() => {
    optimizerRef.current = null;
    evalBudgetRef.current = 0;
    globalBestRef.current = Infinity;
    largeLambdaRef.current = 8;
    setRestartCount(0);
    setCurrentLambda(8);
    setEvalBudget(0);
    setGlobalBestFitness(Infinity);
    setFitnessTimeline([]);
    setIsPlaying(false);
    spawnRestart(8, 0.6);
  }, [spawnRestart]);

  const handleSelectStrategy = (strat: "ipop" | "bipop") => {
    setStrategy(strat);
    resetAll();
  };

  const stepOptimizer = useCallback(() => {
    const opt = getOrInitOptimizer(currentLambda, 0.6);
    const nextState = opt.step();
    setHistory((prev) => [...prev, nextState]);

    evalBudgetRef.current += currentLambda;
    globalBestRef.current = Math.min(globalBestRef.current, nextState.bestFitness);
    setEvalBudget(evalBudgetRef.current);
    setGlobalBestFitness(globalBestRef.current);
    setFitnessTimeline((prev) => [
      ...prev,
      { evals: evalBudgetRef.current, fit: globalBestRef.current, lambda: currentLambda }
    ]);

    // Detect stagnation or convergence to trigger the restart policy. The
    // comparison spans 10 generations including the one just computed,
    // matching the trigger list in the policy card.
    const isStagnant =
      nextState.sigma < 1e-3 ||
      nextState.conditionNumber > 1e7 ||
      (history.length > 18 &&
        Math.abs(nextState.bestFitness - history[history.length - 10].bestFitness) < 1e-4);

    if (isStagnant) {
      let nextPop = currentLambda;
      let nextSigma = 0.6;

      if (strategy === "ipop") {
        // IPOP doubles the population size at every restart
        nextPop = Math.min(128, currentLambda * 2);
        nextSigma = 0.7;
      } else {
        // BIPOP: the large regime keeps its own doubling ladder; the small
        // regime probes with lambda_def and a log-uniform sigma in
        // [0.006, 0.6] (sigma_def * 10^(-2U), U ~ U[0,1]).
        if (restartCount % 2 === 0) {
          largeLambdaRef.current = Math.min(128, largeLambdaRef.current * 2);
          nextPop = largeLambdaRef.current;
          nextSigma = 0.8;
        } else {
          nextPop = 8;
          nextSigma = 0.6 * Math.pow(10, -2 * Math.random());
        }
      }

      setRestartCount((r) => r + 1);
      spawnRestart(nextPop, nextSigma);
    }
  }, [currentLambda, restartCount, strategy, spawnRestart, getOrInitOptimizer, history]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (evalBudget >= 2500 || globalBestFitness <= 0.05) {
        setIsPlaying(false);
        return;
      }
      stepOptimizer();
    }, 110);
    return () => clearInterval(interval);
  }, [isPlaying, evalBudget, globalBestFitness, stepOptimizer]);

  // Rastrigin heatmap, rasterized by the FrankenSim fs-heatmap-wasm kernel
  // (pixel-identical JS fallback inside buildHeatmapCanvas), off the mount's
  // paint path either way.
  const [bgCanvas, setBgCanvas] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    let live = true;
    buildHeatmapCanvas({
      field: "rastrigin",
      width: WIDTH,
      height: HEIGHT,
      xmin: -3.5,
      xmax: 3.5,
      ymin: -3.5,
      ymax: 3.5,
      norm: { mode: "linear", k: 50 },
      ramp: { r0: 10, rk: 15, g0: 20, gk: 75, b0: 40, bk: 120 },
      fallbackField: multimodalFn
    }).then((canvas) => {
      if (live && canvas) setBgCanvas(canvas);
    });
    return () => {
      live = false;
    };
  }, []);

  // Render 2D Multimodal Landscape with High-DPI Sharpness
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !latestState) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const DOMAIN = 3.5;

    const toPxX = (x: number) => ((x + DOMAIN) / (2 * DOMAIN)) * W;
    const toPxY = (y: number) => H - ((y + DOMAIN) / (2 * DOMAIN)) * H;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Cached Rastrigin Contours
    if (bgCanvas) {
      ctx.drawImage(bgCanvas, 0, 0, W, H);
    }

    // 2. Draw Global Minimum Star at (0, 0)
    ctx.strokeStyle = "#fbbf24";
    ctx.fillStyle = "#fbbf24";
    ctx.lineWidth = 3.5;
    const opx = toPxX(0);
    const opy = toPxY(0);
    ctx.beginPath();
    ctx.arc(opx, opy, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(opx - 14, opy);
    ctx.lineTo(opx + 14, opy);
    ctx.moveTo(opx, opy - 14);
    ctx.lineTo(opx, opy + 14);
    ctx.stroke();

    // 3. Draw Historical Trajectory of current restart
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

    // 4. Draw covariance ellipse. The canvas pixels are not square relative
    // to the domain, so build the path under the full data-to-pixel transform
    // (rotate first, anisotropic scale after) and stroke it outside the
    // transform; pre-scaling the radii before rotating would tilt the ellipse
    // away from the covariance's true orientation.
    const [l1, l2] = latestState.eigenvalues;
    const a1 = Math.sqrt(Math.max(1e-10, l1)) * latestState.sigma;
    const a2 = Math.sqrt(Math.max(1e-10, l2)) * latestState.sigma;
    const cx = toPxX(latestState.mean[0]);
    const cy = toPxY(latestState.mean[1]);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.95)";
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

    // 5. Draw Offspring Population
    latestState.samples.forEach((s) => {
      const sx = toPxX(s.x[0]);
      const sy = toPxY(s.x[1]);
      ctx.fillStyle = s.isElite ? "#34d399" : "#94a3b8";
      ctx.beginPath();
      ctx.arc(sx, sy, s.isElite ? 7.5 : 4.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 6. Draw Mean Point
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [latestState, history, bgCanvas]);

  // Render Convergence Chart with High-DPI Sharpness
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas || fitnessTimeline.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, W, H);

    const PADDING = 45;
    const maxEvals = Math.max(500, fitnessTimeline[fitnessTimeline.length - 1].evals);
    const toPxX = (e: number) => PADDING + (e / maxEvals) * (W - 2 * PADDING);

    const maxFit = 40;
    const minFit = 0;
    const toPxY = (f: number) => H - PADDING - ((f - minFit) / (maxFit - minFit)) * (H - 2 * PADDING);

    // Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.5;
    for (let f = 0; f <= 40; f += 10) {
      const y = toPxY(f);
      ctx.beginPath();
      ctx.moveTo(PADDING, y);
      ctx.lineTo(W - PADDING, y);
      ctx.stroke();
    }

    // Convergence curve
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 4;
    ctx.beginPath();
    fitnessTimeline.forEach((pt, i) => {
      const x = toPxX(pt.evals);
      // Early best-of-lambda values on Rastrigin can exceed the fixed 40-unit
      // axis; clamp so the curve enters from the top edge instead of drawing
      // outside the plot area.
      const y = toPxY(Math.min(pt.fit, maxFit));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.fillText("Function Evaluations →", W - 190, H - 14);
  }, [fitnessTimeline]);

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Multimodal Restart Strategies: IPOP vs BIPOP
            </h3>
            <p className="text-xs text-slate-400">
              Escaping deceptive local basins with automated population expansion schedules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10">
          {(["ipop", "bipop"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleSelectStrategy(m)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl uppercase transition-[background-color,color,box-shadow] ${
                strategy === m
                  ? "bg-sky-500 text-white shadow-glow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-start">
        {/* Canvases Column */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full h-auto block" />

            <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs font-mono space-y-1 pointer-events-none">
              <div className="text-emerald-400 font-bold">
                Global Best: {Number.isFinite(globalBestFitness) ? globalBestFitness.toFixed(3) : "—"}
              </div>
              <div className="text-sky-300 flex items-center gap-1">
                <span>Pop <LatexRenderer math="\lambda" block={false} />:</span>
                <span>{currentLambda}</span>
              </div>
              <div className="text-amber-300">Restarts: {restartCount}</div>
              <div className="text-slate-400">Evals: {evalBudget}</div>
            </div>
          </div>

          {/* Convergence Chart */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-200">
              <span className="flex items-center gap-1 text-emerald-400">
                <TrendingDown className="h-3.5 w-3.5" />
                Global Best Convergence vs Budget
              </span>
              <span className="font-mono text-[0.68rem] text-slate-400">{evalBudget} Evals</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-inner">
              <canvas ref={chartCanvasRef} width={WIDTH} height={240} className="w-full h-auto block" />
            </div>
          </div>
        </div>

        {/* Breakdown & Controls */}
        <div className="space-y-4">
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-200 flex items-center justify-between">
              <span>{strategy === "ipop" ? "IPOP Policy" : "BIPOP Policy"}</span>
              <span className="text-[0.7rem] text-slate-500 font-mono">Auger & Hansen</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {strategy === "ipop" ? (
                <>
                  <strong>IPOP-CMA-ES</strong> doubles the population size (<span className="inline-block"><LatexRenderer math="\lambda \leftarrow 2\lambda" block={false} /></span>) after every restart. Larger populations increase global search power, smoothing over high-frequency local ripples.
                </>
              ) : (
                <>
                  <strong>BIPOP-CMA-ES</strong> balances exploration and exploitation by alternating between large exploratory populations and small local populations with varied initial step sizes <span className="inline-block"><LatexRenderer math="\sigma_0" block={false} /></span>.
                </>
              )}
            </p>

            <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
              <div className="font-bold text-slate-300">Automated Termination Triggers:</div>
              <ul className="list-disc pl-4 space-y-1 marker:text-sky-400">
                <li className="flex items-center gap-1">
                  <span>Step-size collapse:</span>
                  <LatexRenderer math="\sigma < 10^{-3}" block={false} />
                </li>
                <li>No best-fitness improvement across 10 generations</li>
                <li className="flex items-center gap-1">
                  <span>Condition number explosion:</span>
                  <LatexRenderer math="\kappa(C) > 10^{7}" block={false} />
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                // At the terminal state the interval would immediately
                // re-pause; restart the comparison instead of a dead button.
                if (!isPlaying && (evalBudget >= 2500 || globalBestFitness <= 0.05)) {
                  resetAll();
                  setIsPlaying(true);
                  return;
                }
                setIsPlaying(!isPlaying);
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white transition-[background-color,box-shadow,transform] shadow-lg ${
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                  : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
              }`}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? "Pause" : "Run Multimodal Search"}</span>
            </button>

            <button
              onClick={resetAll}
              className="p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
