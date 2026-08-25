"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Square, Wand2, MoveRight, Shuffle, Paintbrush, Play, Pause, RotateCcw, ShieldCheck, ArrowRight } from "lucide-react";
import { CMAESOptimizer, CMAESGenerationState } from "../lib/cmaesEngine";

const SIZE = 400;

// Objective whose unconstrained minimum is at (1.35, 1.35), outside the [0, 1]^2 box
const unconstrainedOptimum = [1.35, 1.35];
const objectiveFn = (x: number, y: number) => {
  return (x - 1.35) ** 2 + 2.5 * (y - 1.35) ** 2 + 0.1 * Math.sin(6 * x);
};

function repairPoint(raw: [number, number], strategy: "reflect" | "clamp" | "logit"): [number, number] {
  if (strategy === "clamp") {
    return [Math.max(0, Math.min(1, raw[0])), Math.max(0, Math.min(1, raw[1]))];
  } else if (strategy === "reflect") {
    const reflectVal = (v: number) => {
      if (v >= 0 && v <= 1) return v;
      const mod = Math.abs(v) % 2;
      return mod > 1 ? 2 - mod : mod;
    };
    return [reflectVal(raw[0]), reflectVal(raw[1])];
  } else {
    // Logit sigmoid mapping from R to (0, 1)
    const sig = (v: number) => 1 / (1 + Math.exp(-v * 3));
    return [sig(raw[0] - 0.5), sig(raw[1] - 0.5)];
  }
}

export function ConstraintRepairDemo() {
  const [strategy, setStrategy] = useState<"reflect" | "clamp" | "logit">("reflect");
  const [isPlaying, setIsPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const optimizerRef = useRef<CMAESOptimizer | null>(null);

  const getOrInitOptimizer = useCallback((strat: "reflect" | "clamp" | "logit") => {
    if (!optimizerRef.current) {
      optimizerRef.current = new CMAESOptimizer(
        (x, y) => {
          const [rx, ry] = repairPoint([x, y], strat);
          return objectiveFn(rx, ry);
        },
        {
          dim: 2,
          initialMean: [0.2, 0.2],
          initialSigma: 0.35,
          lambda: 14,
          bounds: [-0.4, 1.6]
        }
      );
    }
    return optimizerRef.current;
  }, []);

  const [history, setHistory] = useState<CMAESGenerationState[]>(() => {
    const opt = new CMAESOptimizer(
      (x, y) => {
        const [rx, ry] = repairPoint([x, y], "reflect");
        return objectiveFn(rx, ry);
      },
      {
        dim: 2,
        initialMean: [0.2, 0.2],
        initialSigma: 0.35,
        lambda: 14,
        bounds: [-0.4, 1.6]
      }
    );
    return [opt.step()];
  });

  const resetOptimizer = useCallback((strat: "reflect" | "clamp" | "logit") => {
    const opt = new CMAESOptimizer(
      (x, y) => {
        const [rx, ry] = repairPoint([x, y], strat);
        return objectiveFn(rx, ry);
      },
      {
        dim: 2,
        initialMean: [0.2, 0.2],
        initialSigma: 0.35,
        lambda: 14,
        bounds: [-0.4, 1.6]
      }
    );
    optimizerRef.current = opt;
    setHistory([opt.step()]);
    setGeneration(0);
    setIsPlaying(false);
  }, []);

  const handleSelectStrategy = (strat: "reflect" | "clamp" | "logit") => {
    setStrategy(strat);
    resetOptimizer(strat);
  };

  const stepOptimizer = useCallback(() => {
    const opt = getOrInitOptimizer(strategy);
    const nextState = opt.step();
    setHistory((prev) => [...prev, nextState]);
    setGeneration((g) => g + 1);
  }, [strategy, getOrInitOptimizer]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (generation >= 35) {
        setIsPlaying(false);
        return;
      }
      stepOptimizer();
    }, 140);
    return () => clearInterval(interval);
  }, [isPlaying, generation, stepOptimizer]);
      if (generation >= 35) {
        setIsPlaying(false);
        return;
      }
      stepOptimizer();
    }, 140);
    return () => clearInterval(interval);
  }, [isPlaying, generation, stepOptimizer]);

  const latestState = history[history.length - 1];

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !latestState) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const DOMAIN_MIN = -0.3;
    const DOMAIN_MAX = 1.6;

    const toPxX = (x: number) => ((x - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * W;
    const toPxY = (y: number) => H - ((y - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * H;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Heatmap
    const imgData = ctx.createImageData(W, H);
    for (let py = 0; py < H; py += 2) {
      const y = DOMAIN_MAX - (py / H) * (DOMAIN_MAX - DOMAIN_MIN);
      for (let px = 0; px < W; px += 2) {
        const x = DOMAIN_MIN + (px / W) * (DOMAIN_MAX - DOMAIN_MIN);
        const [rx, ry] = repairPoint([x, y], strategy);
        const v = objectiveFn(rx, ry);
        const norm = Math.max(0, Math.min(1, Math.sqrt(v) / 2));

        const r = Math.floor(12 + 15 * norm);
        const g = Math.floor(18 + 70 * (1 - norm));
        const b = Math.floor(35 + 110 * (1 - norm));

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

    // 2. Draw [0, 1]^2 Feasible Region Box
    const b0X = toPxX(0);
    const b0Y = toPxY(1);
    const b1X = toPxX(1);
    const b1Y = toPxY(0);
    const boxW = b1X - b0X;
    const boxH = b1Y - b0Y;

    // Glowing boundary outline
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 6;
    ctx.strokeRect(b0X, b0Y, boxW, boxH);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.strokeRect(b0X, b0Y, boxW, boxH);

    // Infeasible Shading
    ctx.fillStyle = "rgba(2, 6, 23, 0.5)";
    ctx.fillRect(0, 0, W, b0Y);
    ctx.fillRect(0, b1Y, W, H - b1Y);
    ctx.fillRect(0, b0Y, b0X, boxH);
    ctx.fillRect(b1X, b0Y, W - b1X, boxH);

    // Box label
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 10px Inter, monospace";
    ctx.fillText("Feasible Domain [0, 1]²", b0X + 10, b0Y + 20);

    // Unconstrained minimum marker (outside box)
    const optPx = toPxX(unconstrainedOptimum[0]);
    const optPy = toPxY(unconstrainedOptimum[1]);
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(optPx, optPy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("Unconstrained Min (1.35, 1.35)", optPx + 8, optPy + 4);

    // Constrained global optimum (Corner at 1.0, 1.0)
    const constrPx = toPxX(1.0);
    const constrPy = toPxY(1.0);
    ctx.strokeStyle = "#34d399";
    ctx.fillStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(constrPx, constrPy, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText("Constrained Target (1.0, 1.0)", constrPx - 160, constrPy - 8);

    // 3. Draw Trajectory Line
    if (history.length > 1) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      history.forEach((st, i) => {
        const [rx, ry] = repairPoint(st.mean as [number, number], strategy);
        const mx = toPxX(rx);
        const my = toPxY(ry);
        if (i === 0) ctx.moveTo(mx, my);
        else ctx.lineTo(mx, my);
      });
      ctx.stroke();
    }

    // 4. Draw Raw vs Repaired Offspring Samples
    latestState.samples.forEach((s) => {
      const rawX = s.x[0];
      const rawY = s.x[1];
      const [fixX, fixY] = repairPoint([rawX, rawY], strategy);

      const rpx = toPxX(rawX);
      const rpy = toPxY(rawY);
      const fpx = toPxX(fixX);
      const fpy = toPxY(fixY);

      // If point was out of bounds, draw repair ray
      if (Math.hypot(rpx - fpx, rpy - fpy) > 2) {
        ctx.strokeStyle = "rgba(244, 63, 94, 0.4)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(rpx, rpy);
        ctx.lineTo(fpx, fpy);
        ctx.stroke();

        // Raw sample (Crimson ghost)
        ctx.fillStyle = "rgba(244, 63, 94, 0.4)";
        ctx.beginPath();
        ctx.arc(rpx, rpy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Repaired sample in feasible domain
      ctx.fillStyle = s.isElite ? "#34d399" : "#38bdf8";
      ctx.beginPath();
      ctx.arc(fpx, fpy, s.isElite ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Draw Current Mean
    const [curMeanFixX, curMeanFixY] = repairPoint(latestState.mean as [number, number], strategy);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(toPxX(curMeanFixX), toPxY(curMeanFixY), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [latestState, history, strategy]);

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Box Constraint Handling & Boundary Repair
            </h3>
            <p className="text-xs text-slate-400">
              Navigating hard boundary constraints without destroying covariance conditioning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10">
          {(["reflect", "clamp", "logit"] as const).map((strat) => (
            <button
              key={strat}
              onClick={() => handleSelectStrategy(strat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                strategy === strat
                  ? "bg-sky-500 text-white shadow-glow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {strat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-start">
        {/* Visualizer Canvas */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
            <canvas ref={canvasRef} width={SIZE} height={SIZE} className="w-full h-auto block" />

            {latestState && (
              <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs font-mono space-y-1 pointer-events-none">
                <div className="text-emerald-400 font-bold">Best f(x): {latestState.bestFitness.toFixed(4)}</div>
                <div className="text-sky-300">Step σ: {latestState.sigma.toFixed(4)}</div>
                <div className="text-slate-400">Gen: {generation}/35</div>
              </div>
            )}
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
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => resetOptimizer(strategy)}
                className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <span className="text-xs font-mono text-slate-400 capitalize">Strategy: {strategy}</span>
          </div>
        </div>

        {/* Strategy Comparison Breakdown */}
        <div className="space-y-3.5 text-xs">
          <div className={`p-4 rounded-2xl border transition-all ${
            strategy === "reflect" ? "bg-sky-500/10 border-sky-500/40 text-white" : "bg-slate-950/40 border-white/5 text-slate-400"
          }`}>
            <div className="font-bold uppercase tracking-wider text-[0.7rem] text-sky-300 mb-1">
              1. Boundary Reflection (Recommended)
            </div>
            <p className="leading-relaxed">
              When samples overshoot bounds (<code className="text-sky-300 font-mono">x &gt; 1</code>), reflect them back into the interior (<code className="text-sky-300 font-mono">2 - x</code>). Preserves kinetic step variance without collapsing covariance eigenvalues.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            strategy === "clamp" ? "bg-amber-500/10 border-amber-500/40 text-white" : "bg-slate-950/40 border-white/5 text-slate-400"
          }`}>
            <div className="font-bold uppercase tracking-wider text-[0.7rem] text-amber-300 mb-1">
              2. Hard Clamping / Projection
            </div>
            <p className="leading-relaxed">
              Piles up multiple samples onto the boundary line (<code className="text-amber-300 font-mono">x = 1.0</code>). Wastes degrees of freedom and causes severe covariance matrix condition number degradation along normal vectors.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            strategy === "logit" ? "bg-purple-500/10 border-purple-500/40 text-white" : "bg-slate-950/40 border-white/5 text-slate-400"
          }`}>
            <div className="font-bold uppercase tracking-wider text-[0.7rem] text-purple-300 mb-1">
              3. Logit / Sigmoid Mapping
            </div>
            <p className="leading-relaxed">
              Search operates in unbounded <code className="text-purple-300 font-mono">ℝⁿ</code>; a smooth sigmoid <code className="text-purple-300 font-mono">σ(z) = 1/(1+e⁻ᶻ)</code> maps to <code className="text-purple-300 font-mono">(0, 1)</code>. Derivatives vanish near edges, avoiding boundary overshoots naturally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
