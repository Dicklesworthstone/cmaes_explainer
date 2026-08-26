"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  PlaneTakeoff,
  Building2,
  BrainCircuit,
  Timer,
  Zap,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingDown,
  Shuffle
} from "lucide-react";
import { MathJax } from "better-react-mathjax";
import { BridgeViz } from "./BridgeViz";
import { TransformerViz } from "./TransformerViz";

/**
 * Interactive "Why Finite-Differences Fail" Simulator Widget:
 * Shows why computing finite-difference gradients [f(x+ε) - f(x)] / ε on noisy,
 * discrete, or expensive black boxes produces catastrophic noise amplification,
 * whereas CMA-ES's rank-based sampling remains robust.
 */
function FiniteDifferenceFailDemo() {
  const [epsilon, setEpsilon] = useState(0.05);
  const [noiseAmplitude, setNoiseAmplitude] = useState(0.08);
  const [sampleX, setSampleX] = useState(1.2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Objective with high-frequency simulation noise / discrete meshing artifacts
  const trueFn = (x: number) => 0.5 * (x - 0.2) ** 2 + 0.2;
  const noisySimFn = useCallback((x: number) => {
    // Deterministic pseudo-noise mimicking CFD turbulence and discretization jumps
    const noise =
      noiseAmplitude *
      (Math.sin(65 * x) * 0.5 + Math.cos(140 * x) * 0.3 + (Math.sin(310 * x) > 0 ? 0.2 : -0.2));
    return trueFn(x) + noise;
  }, [noiseAmplitude]);

  const { trueGrad, fdGrad, error } = useMemo(() => {
    const tg = sampleX - 0.2; // d/dx of 0.5*(x-0.2)^2
    const f0 = noisySimFn(sampleX);
    const fPlus = noisySimFn(sampleX + epsilon);
    const fd = (fPlus - f0) / epsilon;
    return {
      trueGrad: tg,
      fdGrad: fd,
      error: Math.abs(fd - tg)
    };
  }, [sampleX, epsilon, noisySimFn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const X_MIN = -0.8;
    const X_MAX = 2.4;
    const Y_MIN = 0.0;
    const Y_MAX = 2.8;

    const toPxX = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * W;
    const toPxY = (y: number) => H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H;

    ctx.clearRect(0, 0, W, H);

    // Background fill
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= 2.0; gx += 0.5) {
      ctx.beginPath();
      ctx.moveTo(toPxX(gx), 0);
      ctx.lineTo(toPxX(gx), H);
      ctx.stroke();
    }

    // Draw True Objective Smooth Curve (Blue)
    ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = X_MIN; x <= X_MAX; x += 0.02) {
      const y = trueFn(x);
      if (x === X_MIN) ctx.moveTo(toPxX(x), toPxY(y));
      else ctx.lineTo(toPxX(x), toPxY(y));
    }
    ctx.stroke();

    // Draw Noisy Black-Box Simulation Surface (Purple / Magenta)
    ctx.strokeStyle = "rgba(192, 132, 252, 0.85)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = X_MIN; x <= X_MAX; x += 0.005) {
      const y = noisySimFn(x);
      if (x === X_MIN) ctx.moveTo(toPxX(x), toPxY(y));
      else ctx.lineTo(toPxX(x), toPxY(y));
    }
    ctx.stroke();

    // Draw Sample Point x and x + eps
    const y0 = noisySimFn(sampleX);
    const y1 = noisySimFn(sampleX + epsilon);
    const px0 = toPxX(sampleX);
    const py0 = toPxY(y0);
    const px1 = toPxX(sampleX + epsilon);
    const py1 = toPxY(y1);

    // Finite difference secant line (Red / Rose)
    const extLen = 0.5;
    const startX = sampleX - extLen;
    const endX = sampleX + epsilon + extLen;
    const startY = y0 - fdGrad * extLen;
    const endY = y1 + fdGrad * extLen;

    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(toPxX(startX), toPxY(startY));
    ctx.lineTo(toPxX(endX), toPxY(endY));
    ctx.stroke();

    // True tangent line (Emerald)
    const tStartY = trueFn(sampleX) - trueGrad * extLen;
    const tEndY = trueFn(sampleX) + trueGrad * (epsilon + extLen);
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toPxX(startX), toPxY(tStartY));
    ctx.lineTo(toPxX(endX), toPxY(tEndY));
    ctx.stroke();
    ctx.setLineDash([]);

    // Sample Points Dots
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(px0, py0, 5, 0, Math.PI * 2);
    ctx.arc(px1, py1, 5, 0, Math.PI * 2);
    ctx.fill();

    // Perturbation bar dx = epsilon
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px0, py0 + 15);
    ctx.lineTo(px1, py0 + 15);
    ctx.stroke();
  }, [sampleX, epsilon, fdGrad, trueGrad, noisySimFn]);

  return (
    <div className="glass-card p-6 my-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Why Numerical Gradients Fail in Black Boxes
            </h3>
            <p className="text-xs text-slate-400">
              Perturbation noise explodes finite differences [f(x+ε) - f(x)] / ε, while CMA-ES ranks whole neighborhoods
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            Gradient Error: {error.toFixed(2)}×
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] items-start">
        {/* Canvas Plot */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
            <canvas ref={canvasRef} width={540} height={300} className="w-full h-auto block" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-white/5 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-sky-400" />
              <span>True Underlying Physics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-purple-400" />
              <span>Noisy Simulator Output</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-rose-500" />
              <span>Finite-Difference Slope</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-emerald-400 border-dashed" />
              <span>True Gradient</span>
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-4">
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Interactive Perturbation Knobs
            </div>

            {/* Perturbation Step Epsilon */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Finite-Difference Step ($\varepsilon$)</span>
                <span className="text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {epsilon.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Finite-Difference Perturbation Step epsilon"
                min={0.01}
                max={0.25}
                step={0.005}
                value={epsilon}
                onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
              <p className="text-[0.68rem] text-slate-500">
                Smaller $\varepsilon$ explodes noise; larger $\varepsilon$ causes severe truncation bias.
              </p>
            </div>

            {/* Simulation Noise Amplitude */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Simulation Discretization Noise</span>
                <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {(noiseAmplitude * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                aria-label="Simulation Discretization Noise Amplitude"
                min={0.0}
                max={0.2}
                step={0.01}
                value={noiseAmplitude}
                onChange={(e) => setNoiseAmplitude(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            {/* Evaluation Point */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Evaluation Point ($x$)</span>
                <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {sampleX.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Evaluation Point x"
                min={0.2}
                max={2.0}
                step={0.05}
                value={sampleX}
                onChange={(e) => setSampleX(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-rose-300 uppercase tracking-wide">
              <Flame className="h-3.5 w-3.5" />
              <span>The Fatal Dilemma of Numerical Gradients</span>
            </div>
            <p className="leading-relaxed">
              If (n = 20) dimensions, finite differences require <strong>21 expensive multi-hour simulation runs per step</strong>, and the resulting vector is pointing completely in the wrong direction due to high-frequency noise. CMA-ES bypasses this by estimating distribution shifts over the whole population.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NoGradientExamples() {
  const archetypes = [
    {
      id: "wing",
      icon: PlaneTakeoff,
      title: "1. Transonic Aircraft Wing Aerodynamics",
      subtitle: "10–20 geometry parameters; 3 hours per CFD run; discrete airfoil families",
      metrics: [
        "Full Navier-Stokes CFD meshing & turbulence boundary layer switching",
        "Blended scalar penalty: Lift/Drag ratio, wave drag, stall onset, root bending stress",
        "Categorical NACA airfoil family choices introduce discrete step discontinuities",
        "Grid search is impossible: 10 values across 15 dimensions = 10¹⁵ simulations"
      ],
      solution: "CMA-ES discovers the optimal sweep and aspect ratio in ~40 generations (~300 evaluations)."
    },
    {
      id: "bridge",
      icon: Building2,
      title: "2. Nonlinear Structural FEA Suspension Bridge",
      subtitle: "Mode crossings, wind vortex resonance, stress envelope constraints",
      metrics: [
        "Solve massive nonlinear elasticity equations under dead, live, wind, and seismic load cases",
        "Sharp step changes when buckling modes cross or tensile stress exceeds 500 MPa safety limits",
        "Non-smooth constraint penalties ruin second-order Hessian Taylor approximations",
        "Rank-based selection naturally handles discontinuous penalty boundaries"
      ],
      solution: "CMA-ES adapts covariance to eliminate high-stress zones while minimizing total steel tonnage."
    },
    {
      id: "transformer",
      icon: BrainCircuit,
      title: "3. Neural Architecture & Mixed Hyperparameter Search",
      subtitle: "Mixed continuous/discrete knobs, stochastic validation noise, budget ~200 evals",
      metrics: [
        "Continuous parameters: Learning rate schedule, weight decay, SwiGLU beta, LayerNorm eps",
        "Discrete architectural integers: Number of layers L ∈ [6..48], d_model, attention heads",
        "Evaluation requires days of TPU pod training with noisy stochastic validation scores",
        "Encode/decode unit box mapping smoothly bridges discrete choices without custom algorithms"
      ],
      solution: "CMA-ES navigates the multi-objective Pareto frontier of accuracy vs inference latency."
    }
  ];

  return (
    <div className="space-y-12">
      <div className="prose-cmaes">
        <p className="text-lg text-slate-300 leading-relaxed">
          When people first hear &ldquo;black-box optimization without gradients,&rdquo; it sounds like a
          minor inconvenience. <em>&ldquo;Just approximate the derivative with finite differences,&rdquo;</em> they say.
        </p>

        <p>
          In reality, real-world physical simulators, complex engineering pipelines, and neural training runs
          are filled with numerical noise, turbulence switches, finite-element meshing jumps, and categorical choices.
          Finite differences amplify noise and produce completely bogus gradient directions.
        </p>
      </div>

      {/* Interactive Finite Differences vs CMA-ES Demo */}
      <FiniteDifferenceFailDemo />

      {/* The Three Engineering Archetypes */}
      <div className="grid gap-6 md:grid-cols-3">
        {archetypes.map((a, idx) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="glass-card p-6 flex flex-col justify-between border-white/10 hover:border-sky-500/30 transition-colors duration-300 group"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[0.65rem] font-mono font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  <Timer className="h-3 w-3 text-amber-400" />
                  Hours / Eval
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-display mb-1">{a.title}</h3>
              <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">{a.subtitle}</p>

              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                {a.metrics.map((m) => (
                  <li key={m} className="flex items-start gap-2 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{a.solution}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bridge 3D Interactive FEA Simulation */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Interactive Case Study: Suspension Bridge Under Dynamic Load
              </h3>
              <p className="text-xs text-slate-400">
                Live 3D FEA stress calculation with moving traffic & structural optimization
              </p>
            </div>
          </div>
        </div>
        <BridgeViz />
      </div>

      {/* Transformer Architecture 3D Interactive Search */}
      <div className="space-y-4 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Interactive Case Study: Neural Architecture Search & Pareto Frontier
              </h3>
              <p className="text-xs text-slate-400">
                Mixed discrete-continuous hyperparameter tuning with 3D topology & accuracy vs FLOPs trade-off
              </p>
            </div>
          </div>
        </div>
        <TransformerViz />
      </div>
    </div>
  );
}
