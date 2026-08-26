"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Square, Wand2, MoveRight, Shuffle, Paintbrush, Play, Pause, RotateCcw, ShieldCheck, ArrowRight } from "lucide-react";
import { LatexRenderer } from "./LatexRenderer";
import { CMAESOptimizer, CMAESGenerationState } from "../lib/cmaesEngine";

const SIZE = 800;

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

  // The engine must NOT apply its own bound repair here (its default is
  // reflect): the whole point of this demo is that the strategy selected in
  // the UI is the only repair in play. repairStrategy "none" leaves samples
  // raw, and repairPoint inside the objective is the single repair step.
  const getOrInitOptimizer = useCallback((strat: "reflect" | "clamp" | "logit") => {
    if (!optimizerRef.current) {
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
          repairStrategy: "none"
        }
      );
      // Replay the generation already shown in the seeded history so the
      // first user step advances rather than duplicating generation 1.
      opt.step();
      optimizerRef.current = opt;
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
        repairStrategy: "none"
      }
    );
    return [opt.step()];
  });

  const latestState = history[history.length - 1];

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
        repairStrategy: "none"
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

  // Pre-rendered high-definition heatmap canvas (memoized per strategy)
  const bgCanvas = useMemo(() => {
    if (typeof document === "undefined") return null;
    const offscreen = document.createElement("canvas");
    offscreen.width = SIZE;
    offscreen.height = SIZE;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return null;

    const DOMAIN_MIN = -0.3;
    const DOMAIN_MAX = 1.6;

    const imgData = ctx.createImageData(SIZE, SIZE);
    const buf32 = new Uint32Array(imgData.data.buffer);

    for (let py = 0; py < SIZE; py++) {
      const y = DOMAIN_MAX - (py / SIZE) * (DOMAIN_MAX - DOMAIN_MIN);
      const rowOffset = py * SIZE;
      for (let px = 0; px < SIZE; px++) {
        const x = DOMAIN_MIN + (px / SIZE) * (DOMAIN_MAX - DOMAIN_MIN);
        const [rx, ry] = repairPoint([x, y], strategy);
        const v = objectiveFn(rx, ry);
        const norm = Math.max(0, Math.min(1, Math.sqrt(v) / 2));

        const r = (12 + 15 * norm) | 0;
        const g = (18 + 70 * (1 - norm)) | 0;
        const b = (35 + 110 * (1 - norm)) | 0;

        buf32[rowOffset + px] = (255 << 24) | (b << 16) | (g << 8) | r;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return offscreen;
  }, [strategy]);

  // Render Canvas with High-DPI Sharpness
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

    // 1. Draw Cached Heatmap
    if (bgCanvas) {
      ctx.drawImage(bgCanvas, 0, 0, W, H);
    }

    // 2. Draw [0, 1]^2 Feasible Region Box
    const b0X = toPxX(0);
    const b0Y = toPxY(1);
    const b1X = toPxX(1);
    const b1Y = toPxY(0);
    const boxW = b1X - b0X;
    const boxH = b1Y - b0Y;

    // Glowing boundary outline
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 10;
    ctx.strokeRect(b0X, b0Y, boxW, boxH);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3.5;
    ctx.strokeRect(b0X, b0Y, boxW, boxH);

    // Infeasible Shading
    ctx.fillStyle = "rgba(2, 6, 23, 0.55)";
    ctx.fillRect(0, 0, W, b0Y);
    ctx.fillRect(0, b1Y, W, H - b1Y);
    ctx.fillRect(0, b0Y, b0X, boxH);
    ctx.fillRect(b1X, b0Y, W - b1X, boxH);

    // Box label
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px Inter, monospace";
    ctx.fillText("Feasible Domain [0, 1]²", b0X + 16, b0Y + 32);

    // Unconstrained minimum marker (outside box)
    const optPx = toPxX(unconstrainedOptimum[0]);
    const optPy = toPxY(unconstrainedOptimum[1]);
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(optPx, optPy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "bold 15px Inter, sans-serif";
    ctx.fillText("Unconstrained Min (1.35, 1.35)", optPx + 14, optPy + 5);

    // Constrained global optimum (Corner at 1.0, 1.0)
    const constrPx = toPxX(1.0);
    const constrPy = toPxY(1.0);
    ctx.strokeStyle = "#34d399";
    ctx.fillStyle = "#34d399";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(constrPx, constrPy, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = "bold 15px Inter, sans-serif";
    ctx.fillText("Constrained Target (1.0, 1.0)", constrPx - 250, constrPy - 14);

    // 3. Draw Trajectory Line
    if (history.length > 1) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4.5;
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

    // 4. Draw raw vs repaired offspring samples. With repairStrategy "none"
    // the engine leaves samples untouched, so rawX really is the pre-repair
    // sample and the crimson ghosts can land outside the box.
    latestState.samples.forEach((s) => {
      const rawX = s.rawX[0];
      const rawY = s.rawX[1];
      const [fixX, fixY] = repairPoint([rawX, rawY], strategy);

      const rpx = toPxX(rawX);
      const rpy = toPxY(rawY);
      const fpx = toPxX(fixX);
      const fpy = toPxY(fixY);

      // If point was out of bounds, draw repair ray
      if (Math.hypot(rpx - fpx, rpy - fpy) > 2) {
        ctx.strokeStyle = "rgba(244, 63, 94, 0.6)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(rpx, rpy);
        ctx.lineTo(fpx, fpy);
        ctx.stroke();

        // Raw sample (Crimson ghost)
        ctx.fillStyle = "rgba(244, 63, 94, 0.6)";
        ctx.beginPath();
        ctx.arc(rpx, rpy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Repaired sample in feasible domain
      ctx.fillStyle = s.isElite ? "#34d399" : "#38bdf8";
      ctx.beginPath();
      ctx.arc(fpx, fpy, s.isElite ? 7.5 : 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Draw Current Mean
    const [curMeanFixX, curMeanFixY] = repairPoint(latestState.mean as [number, number], strategy);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(toPxX(curMeanFixX), toPxY(curMeanFixY), 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [latestState, history, strategy, bgCanvas]);

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
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-[background-color,color,box-shadow] ${
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
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <span>Best <LatexRenderer math="f_{\text{best}}" block={false} />:</span>
                  <span>{latestState.bestFitness.toFixed(4)}</span>
                </div>
                <div className="text-sky-300 flex items-center gap-1">
                  <span>Step <LatexRenderer math="\sigma" block={false} />:</span>
                  <span>{latestState.sigma.toFixed(4)}</span>
                </div>
                <div className="text-slate-400">Gen: {generation}/35</div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
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
          <div className={`p-4 rounded-2xl border transition-[background-color,border-color,color] duration-200 ${
            strategy === "reflect" ? "bg-sky-500/10 border-sky-500/40 text-white" : "bg-slate-950/40 border-white/5 text-slate-400"
          }`}>
            <div className="font-bold uppercase tracking-wider text-[0.7rem] text-sky-300 mb-1">
              1. Boundary Reflection
            </div>
            <p className="leading-relaxed">
              When samples overshoot bounds (<span className="inline-block"><LatexRenderer math="x > 1" block={false} /></span>), reflect them back into the interior (<span className="inline-block"><LatexRenderer math="2 - x" block={false} /></span>). Preserves step variance without collapsing covariance eigenvalues. Production implementations pair any repair with a penalty on the repair distance and feed the unrepaired sample back to the update.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-[background-color,border-color,color] duration-200 ${
            strategy === "clamp" ? "bg-amber-500/10 border-amber-500/40 text-white" : "bg-slate-950/40 border-white/5 text-slate-400"
          }`}>
            <div className="font-bold uppercase tracking-wider text-[0.7rem] text-amber-300 mb-1">
              2. Hard Clamping / Projection
            </div>
            <p className="leading-relaxed">
              Piles up multiple samples onto the boundary line (<span className="inline-block"><LatexRenderer math="x = 1.0" block={false} /></span>). Wastes degrees of freedom and causes severe covariance matrix condition number degradation along normal vectors.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition-[background-color,border-color,color] duration-200 ${
            strategy === "logit" ? "bg-purple-500/10 border-purple-500/40 text-white" : "bg-slate-950/40 border-white/5 text-slate-400"
          }`}>
            <div className="font-bold uppercase tracking-wider text-[0.7rem] text-purple-300 mb-1">
              3. Logit / Sigmoid Mapping
            </div>
            <p className="leading-relaxed">
              Search operates in unbounded <span className="inline-block"><LatexRenderer math="\mathbb{R}^n" block={false} /></span>; the smooth sigmoid <span className="inline-block"><LatexRenderer math="\sigma(z) = 1/(1+e^{-3(z - 0.5)})" block={false} /></span> maps onto the open box <span className="inline-block"><LatexRenderer math="(0, 1)" block={false} /></span>, so overshoot is impossible by construction. The trade-off: the map is asymptotic, so an optimum sitting exactly on the boundary (like the corner target here) is only approached as <span className="inline-block"><LatexRenderer math="z \to \infty" block={false} /></span> and progress flattens near the edges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
