"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, FastForward, RotateCcw, Cpu, Dices, Info } from "lucide-react";
import { LatexRenderer } from "./LatexRenderer";
import { CMAESPhaseSpaceViewer } from "./CMAESPhaseSpaceViewer";
import { CMAESOptimizerND, CMAESGenerationStateND } from "../lib/cmaesEngineND";
import {
  initFrankenSimCmaes,
  runCmaesViz,
  wasmRunToNdStates,
  type CmaesKernelStatus,
  type CmaesVizParams,
} from "../lib/frankensimCmaes";

// ---------------------------------------------------------------------------
// Landscapes — TS mirror of the kernel's registry (the honest fallback path).
// ---------------------------------------------------------------------------

const LANDSCAPES = [
  { id: 0, name: "Sphere", formula: "f(x)=\\sum \\textcolor{#60a5fa}{x_i}^2", blurb: "Isotropic bowl — the easy case. Any covariance works." },
  { id: 1, name: "Rosenbrock", formula: "\\sum\\!\\left[100(\\textcolor{#60a5fa}{x_{i+1}}-\\textcolor{#60a5fa}{x_i}^2)^2+(1-\\textcolor{#60a5fa}{x_i})^2\\right]", blurb: "Banana valley — CMA-ES must learn a curved, correlated ridge." },
  { id: 2, name: "Cigar", formula: "f(x)=10^6 \\textcolor{#60a5fa}{x_0}^2+\\sum_{i>0} \\textcolor{#60a5fa}{x_i}^2", blurb: "One brutally sensitive axis — watch cond(C) explode, then adapt." },
  { id: 3, name: "Rastrigin", formula: "10n+\\sum\\![\\textcolor{#60a5fa}{x_i}^2-10\\cos(2\\pi \\textcolor{#60a5fa}{x_i})]", blurb: "Heavily multimodal — population size is survival." },
  { id: 4, name: "Ill-Cond.", formula: "\\sum 10^{6i/(n-1)} \\textcolor{#60a5fa}{x_i}^2", blurb: "Ellipsoid with a 10^6 condition number — covariance adaptation's home turf." },
] as const;

function evalLandscape(id: number, x: number[]): number {
  const n = x.length;
  switch (id) {
    case 0:
      return x.reduce((s, v) => s + v * v, 0);
    case 1: {
      let s = 0;
      for (let i = 0; i < n - 1; i++) s += 100 * (x[i + 1] - x[i] * x[i]) ** 2 + (1 - x[i]) ** 2;
      return s;
    }
    case 2: {
      let s = 1e6 * x[0] * x[0];
      for (let i = 1; i < n; i++) s += x[i] * x[i];
      return s;
    }
    case 3: {
      let s = 10 * n;
      for (const v of x) s += v * v - 10 * Math.cos(2 * Math.PI * v);
      return s;
    }
    case 4: {
      let s = 0;
      for (let i = 0; i < n; i++) s += 10 ** ((6 * i) / Math.max(1, n - 1)) * x[i] * x[i];
      return s;
    }
    default:
      return NaN;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CmaesInternalsLab() {
  const [kernel, setKernel] = useState<CmaesKernelStatus>({ source: "unloaded", kernelVersion: null, error: null });

  // Rich parameter surface — every knob the kernel actually has.
  const [landscape, setLandscape] = useState<number>(1);
  const [dim, setDim] = useState(5);
  const [lambda, setLambda] = useState(16);
  const [sigma0, setSigma0] = useState(0.3);
  const [active, setActive] = useState(true);
  const [seed, setSeed] = useState(1337);
  const [generations, setGenerations] = useState(120);
  const [noise, setNoise] = useState(0);
  const [boundsEnabled, setBoundsEnabled] = useState(false);
  const [startPoint, setStartPoint] = useState<number[]>([1.5, -1, 2, 0.5, -0.5, 0]);

  // Batch result + playback cursor.
  const [states, setStates] = useState<CMAESGenerationStateND[]>([]);
  const [cursor, setCursor] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [computing, setComputing] = useState(false);
  const [speedMs, setSpeedMs] = useState(90);
  const reducedMotion = useRef(false);

  useEffect(() => {
    initFrankenSimCmaes().then(setKernel);
    if (typeof window !== "undefined") {
      reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  // Batch run: WASM kernel when available, TS engine as the honest fallback.
  useEffect(() => {
    let cancelled = false;

    // Defer so the batch execution does not block UI layout paint.
    const id = window.setTimeout(() => {
      if (cancelled) return;
      setComputing(true);
      const x0 = startPoint.slice(0, dim);
      const params: CmaesVizParams = {
        dim,
        x0,
        sigma0,
        lambda,
        active,
        seed,
        generations,
        landscape,
        noise,
        boundsEnabled,
        boundMin: -2,
        boundMax: 2,
        fTarget: NaN,
      };

      const run = kernel.source === "wasm" ? runCmaesViz(params) : null;
      if (run && run.generations.length > 0) {
        const mapped = wasmRunToNdStates(run);
        if (!cancelled) {
          setStates(mapped);
          setCursor(0);
          setComputing(false);
        }
        return;
      }

      // TS fallback: same algorithm, same couplings, labeled as fallback.
      const opt = new CMAESOptimizerND((v: number[]) => evalLandscape(landscape, v), {
        dim,
        initialMean: x0,
        initialSigma: sigma0,
        lambda,
        activeCMA: active,
        seed,
        noiseLevel: noise,
        bounds: boundsEnabled ? ([-2, 2] as [number, number]) : ([-1e9, 1e9] as [number, number]),
      });
      const hist: CMAESGenerationStateND[] = [];
      for (let i = 0; i < generations; i++) hist.push(opt.step());
      if (!cancelled) {
        setStates(hist);
        setCursor(0);
        setComputing(false);
      }
    }, 30);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [kernel.source, landscape, dim, lambda, sigma0, active, seed, generations, noise, boundsEnabled, startPoint]);

  // Playback.
  useEffect(() => {
    if (!isPlaying || reducedMotion.current) return;
    const t = window.setInterval(() => {
      setCursor((c) => {
        if (c >= states.length - 1) {
          setIsPlaying(false);
          return c;
        }
        return c + 1;
      });
    }, speedMs);
    return () => window.clearInterval(t);
  }, [isPlaying, states.length, speedMs]);

  const latest = states[Math.min(cursor, states.length - 1)] ?? null;
  const currentLandscape = LANDSCAPES[landscape] ?? LANDSCAPES[0];

  const randomizeStart = () => {
    setSeed((s) => (s * 1664525 + 1013904223) >>> 0);
    setStartPoint(Array.from({ length: 6 }, () => Math.round((Math.random() * 3 - 1.5) * 100) / 100));
  };

  // Loss sparkline data (log10 best_f per generation).
  const lossData = useMemo(
    () => states.map((s) => Math.log10(Math.max(1e-12, s.bestFitness))),
    [states]
  );

  return (
    <div className="glass-card p-5 md:p-7 space-y-6">
      {/* Header + honest kernel badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-display text-lg md:text-xl font-bold text-white">
            Inside the optimizer: live covariance geometry
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Every generation of a real CMA-ES run, projected into 3D principal-component
            space. The ellipsoid <em className="text-slate-200 not-italic">is</em> the covariance
            matrix Σ²C — watch it form, orient, and collapse as the population learns the landscape.
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-mono border shrink-0 ${
            kernel.source === "wasm"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/40 bg-amber-500/10 text-amber-300"
          }`}
          title={kernel.error ?? undefined}
        >
          <Cpu className="h-3.5 w-3.5" />
          {kernel.source === "wasm"
            ? `kernel: WASM step (${kernel.kernelVersion ?? "fs-cmaes-viz-wasm"})`
            : "kernel: TypeScript fallback"}
        </div>
      </div>

      {/* Control deck */}
      <div className="grid gap-4 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
        <label className="space-y-1.5">
          <span className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold">Landscape</span>
          <select
            value={landscape}
            onChange={(e) => setLandscape(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            {LANDSCAPES.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold">
            Dimension <span className="text-sky-300 font-mono">{dim}</span>
          </span>
          <input type="range" min={2} max={6} step={1} value={dim} onChange={(e) => setDim(Number(e.target.value))} className="w-full accent-sky-400" />
        </label>

        <label className="space-y-1.5">
          <span className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold">
            Population λ <span className="text-sky-300 font-mono">{lambda}</span>
          </span>
          <input type="range" min={4} max={48} step={2} value={lambda} onChange={(e) => setLambda(Number(e.target.value))} className="w-full accent-sky-400" />
        </label>

        <label className="space-y-1.5">
          <span className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold">
            Initial σ₀ <span className="text-sky-300 font-mono">{sigma0.toFixed(2)}</span>
          </span>
          <input
            type="range" min={0.02} max={1.5} step={0.01} value={sigma0}
            onChange={(e) => setSigma0(Number(e.target.value))}
            className="w-full accent-sky-400"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold">
            Generations <span className="text-sky-300 font-mono">{generations}</span>
          </span>
          <input type="range" min={20} max={200} step={10} value={generations} onChange={(e) => setGenerations(Number(e.target.value))} className="w-full accent-sky-400" />
        </label>

        <label className="space-y-1.5">
          <span className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold">
            Eval noise σ <span className="text-sky-300 font-mono">{noise.toFixed(2)}</span>
          </span>
          <input type="range" min={0} max={0.5} step={0.01} value={noise} onChange={(e) => setNoise(Number(e.target.value))} className="w-full accent-sky-400" />
        </label>

        <div className="space-y-1.5">
          <span className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold">Strategy</span>
          <div className="flex gap-2">
            <button
              onClick={() => setActive(!active)}
              className={`flex-1 rounded-xl px-2 py-2 text-xs font-semibold border transition-colors ${
                active ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300" : "border-white/10 bg-slate-950/70 text-slate-400"
              }`}
              title="Active CMA: negative weights let bad samples shrink the covariance too"
            >
              Active {active ? "on" : "off"}
            </button>
            <button
              onClick={() => setBoundsEnabled(!boundsEnabled)}
              className={`flex-1 rounded-xl px-2 py-2 text-xs font-semibold border transition-colors ${
                boundsEnabled ? "border-sky-500/50 bg-sky-500/15 text-sky-300" : "border-white/10 bg-slate-950/70 text-slate-400"
              }`}
              title="Reflect-repair samples into [-2, 2]^n"
            >
              Bounds {boundsEnabled ? "on" : "off"}
            </button>
          </div>
        </div>

        <label className="space-y-1.5">
          <span className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold">
            Seed <span className="text-sky-300 font-mono">{seed}</span>
          </span>
          <div className="flex gap-2">
            <input
              type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value) >>> 0)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
            <button
              onClick={randomizeStart}
              className="shrink-0 rounded-xl border border-white/10 bg-slate-950/70 p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="New random seed + starting point"
            >
              <Dices className="h-4 w-4" />
            </button>
          </div>
        </label>
      </div>

      {/* Categorical-encoding strip: how discrete choices ride the [0,1] cube */}
      <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-3.5">
        <div className="flex items-center gap-2 text-[0.68rem] text-slate-500 font-semibold uppercase tracking-wider">
          <Info className="h-3 w-3" />
          How the categorical choice rides the unit cube
        </div>
        <div className="mt-2 flex h-5 w-full overflow-hidden rounded-lg border border-white/10">
          {LANDSCAPES.map((l, i) => (
            <button
              key={l.id}
              onClick={() => setLandscape(l.id)}
              style={{ width: "20%" }}
              className={`relative text-[0.6rem] font-mono transition-colors ${
                landscape === l.id ? "bg-sky-500/40 text-white" : "bg-slate-900/80 text-slate-500 hover:bg-slate-800"
              } ${i > 0 ? "border-l border-white/10" : ""}`}
            >
              {l.name} · [{(i * 0.2).toFixed(1)}, {((i + 1) * 0.2).toFixed(1)})
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[0.65rem] text-slate-500">
          Discrete options are mapped to disjoint sub-ranges of a continuous [0, 1] variable —
          so one optimizer coordinate encodes a categorical choice, and the same machinery
          optimizes mixed continuous / integer / categorical design spaces.
        </p>
      </div>

      {/* Main stage */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] items-start">
        <div className="space-y-3">
          {latest ? (
            <CMAESPhaseSpaceViewer
              latestState={latest}
              history={states.slice(0, cursor + 1)}
              title={`PCA phase space — ${currentLandscape.name}, n=${dim}`}
            />
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-[#030712] text-sm text-slate-500">
              {computing ? "Running kernel…" : "Adjust parameters to begin"}
            </div>
          )}

          {/* Playback bar */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg transition-all ${
                isPlaying ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isPlaying ? "Pause" : "Play evolution"}
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCursor((c) => Math.min(c + 1, states.length - 1)); }}
              className="rounded-xl border border-white/5 bg-slate-900 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              title="Step one generation"
            >
              <FastForward className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCursor(0); }}
              className="rounded-xl border border-white/5 bg-slate-900 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              title="Back to generation 0"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <input
              type="range" min={0} max={Math.max(0, states.length - 1)} value={Math.min(cursor, states.length - 1)}
              onChange={(e) => { setIsPlaying(false); setCursor(Number(e.target.value)); }}
              className="min-w-[140px] flex-1 accent-sky-400"
              aria-label="Generation scrubber"
            />
            <span className="font-mono text-xs text-slate-400">
              gen {latest?.generation ?? 0}/{states.length}
            </span>
            <select
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-slate-950/70 px-2 py-1 text-xs text-slate-300"
              aria-label="Playback speed"
            >
              <option value={200}>0.5×</option>
              <option value={90}>1×</option>
              <option value={40}>2×</option>
              <option value={12}>8×</option>
            </select>
          </div>
        </div>

        {/* Telemetry column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-xs space-y-2">
            <div className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-sans font-semibold">Live internals</div>
            <div className="flex justify-between"><span className="text-slate-400">best f(x)</span><span className="text-emerald-400 font-bold">{latest ? latest.bestFitness.toExponential(3) : "—"}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">step size σ</span><span className="text-sky-300">{latest ? latest.sigma.toFixed(4) : "—"}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">cond κ(C)</span><span className="text-purple-300">{latest ? (Number.isFinite(latest.conditionNumber) ? latest.conditionNumber.toFixed(1) : "∞") : "—"}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">evaluations</span><span className="text-slate-300">{latest ? latest.evalCount : "—"}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">‖p<sub>c</sub>‖</span><span className="text-slate-300">{latest ? Math.hypot(...latest.pC).toFixed(3) : "—"}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">‖p<sub>σ</sub>‖ / χ<sub>n</sub></span><span className="text-slate-300">{latest ? (Math.hypot(...latest.pSigma) / Math.sqrt(latest.mean.length)).toFixed(3) : "—"}</span></div>
          </div>

          {/* Loss curve */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold mb-2">Convergence — log₁₀ best f(x)</div>
            <LossSparkline data={lossData} cursor={Math.min(cursor, states.length - 1)} />
          </div>

          {/* Variance explained */}
          {latest && (
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="text-[0.68rem] uppercase tracking-wider text-slate-500 font-semibold mb-2">PCA variance explained</div>
              <div className="space-y-1.5">
                {latest.phaseSpace3D.varianceExplainedPercent.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-10 text-slate-500">PC{i + 1}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${Math.min(100, v)}%` }} />
                    </div>
                    <span className="w-12 text-right text-slate-400">{v.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[0.65rem] text-slate-500">
                Share of total variance captured by the 3D projection — the honest price of
                looking at a {dim}-D distribution in 3D.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pedagogy footer */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm text-slate-300">
        <div>
          <span className="text-slate-400">What you are watching: </span>
          each generation samples <LatexRenderer math="\lambda" block={false} /> candidates from <LatexRenderer math="\mathcal{N}(m, \sigma^2 C)" block={false} />,
          keeps the best half, and nudges the distribution toward them. The rank-1 term
          {" "}<LatexRenderer math="c_1 \mathbf{p}_c \mathbf{p}_c^\top" block={false} />{" "}
          remembers <em className="text-slate-200 not-italic">which direction the mean traveled</em>;
          the rank-<LatexRenderer math="\mu" block={false} /> term <LatexRenderer math="c_\mu \sum w_i \mathbf{y}_i \mathbf{y}_i^\top" block={false} />{" "}
          reshapes the ellipse around the elite cloud itself. Current landscape:{" "}
          <span className="text-slate-200">{currentLandscape.blurb}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Minimal log-loss sparkline (canvas, devicePixelRatio aware).
// ---------------------------------------------------------------------------

function LossSparkline({ data, cursor }: { data: number[]; cursor: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth || 300;
    const H = 96;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    if (data.length < 2) return;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const px = (i: number) => (i / (data.length - 1)) * (W - 8) + 4;
    const py = (v: number) => H - 8 - ((v - min) / span) * (H - 16);

    ctx.strokeStyle = "rgba(56,189,248,0.9)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    data.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))));
    ctx.stroke();

    // Playhead.
    if (cursor >= 0 && cursor < data.length) {
      ctx.strokeStyle = "rgba(52,211,153,0.9)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px(cursor), 4);
      ctx.lineTo(px(cursor), H - 4);
      ctx.stroke();
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(px(cursor), py(data[cursor]), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [data, cursor]);

  return <canvas ref={ref} style={{ width: "100%", height: 96 }} className="block" aria-label="Best fitness per generation, log scale" />;
}
