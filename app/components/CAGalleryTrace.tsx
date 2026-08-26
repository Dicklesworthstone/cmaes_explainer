"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Activity,
  Compass,
  Flame,
  MousePointer2,
  Atom,
  Zap,
  Info
} from "lucide-react";
import { CMAESOptimizerND, CMAESGenerationStateND } from "../lib/cmaesEngineND";
import { CMAESPhaseSpaceViewer, CMAESTelemetryHUD } from "./CMAESPhaseSpaceViewer";
import { useInView } from "../hooks/useScrollSpy";
import { LatexRenderer } from "./LatexRenderer";
import {
  initFrankenSimLenia,
  leniaInit,
  leniaClear,
  leniaSeedRing,
  leniaStep,
  leniaImageData,
  leniaSnapshotEval,
  leniaEval
} from "../lib/frankensimLenia";

// ============================================================================
// 1. Simulation Constants & Precomputed Concentric Lenia Kernel
// ============================================================================

// The TypeScript fallback field: 96² with a direct O(N²·R²) convolution.
const GRID_SIZE = 96;
const KERNEL_RADIUS = 5;

// The FrankenSim WASM field: the same model at 512² or 256² through an
// O(N² log N) FFT (fs-lenia-wasm), with CMA-ES fitness rollouts at 128².
// The resolution is chosen per device: 512² only when a timed probe on the
// actual hardware sustains it, 256² as the floor (measured ~2 ms/step even
// in wasm, safe everywhere the kernel loads). The kernel radius scales with
// the field so morphology is preserved (5/96 of the size), and all seed
// geometry below is expressed relative to GRID_SIZE and scaled.
const WASM_GRID_SIZES = [512, 256] as const;
const WASM_EVAL_SIZE = 128;
const REL_KERNEL_RADIUS = KERNEL_RADIUS / GRID_SIZE;
// Budget for one 512² step, measured on-device at init. ~31 steps/s means a
// 10 ms step spends a third of the main thread; anything slower belongs at
// 256². (This Mac measures ~8.6 ms in wasm; older phones far exceed it.)
const WASM_512_STEP_BUDGET_MS = 10;

type LeniaEngine = "pending" | "wasm" | "js";

interface KernelOffset {
  dx: number;
  dy: number;
  weight: number;
}

// Precompute radial donut kernel K(r) = exp(-((r - r0)^2) / (2*sigma_k^2))
function buildLeniaKernel(radius = 5, r0 = 0.5, sigmaK = 0.18): { offsets: KernelOffset[]; totalWeight: number } {
  const offsets: KernelOffset[] = [];
  let totalWeight = 0;

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radius) {
        const normDist = dist / radius; // [0, 1]
        const d = (normDist - r0) / sigmaK;
        const weight = Math.exp(-0.5 * d * d);
        offsets.push({ dx, dy, weight });
        totalWeight += weight;
      }
    }
  }

  return { offsets, totalWeight: totalWeight || 1.0 };
}

// Preset Artificial Organisms in Continuous Parameter Space
interface OrganismPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  mu: number;
  sigma: number;
  dt: number;
}

const ORGANISM_PRESETS: OrganismPreset[] = [
  {
    id: "orbium",
    name: "Orbium-Inspired Soliton",
    category: "Soliton",
    description: "Self-stabilizing localized wave packet inspired by Lenia's Orbium. (True gliding needs Orbium's exact asymmetric seed pattern; this symmetric seed pulses in place.)",
    mu: 0.152,
    sigma: 0.038,
    dt: 0.22
  },
  {
    id: "mitosis",
    name: "Gemini Mitosis",
    category: "Replicator",
    description: "Oscillating organic membrane that continuously undergoes symmetrical cellular division.",
    mu: 0.274,
    sigma: 0.044,
    dt: 0.24
  },
  {
    id: "biolattice",
    name: "Turing Bio-Lattice",
    category: "Morphogenesis",
    description: "Dynamic self-organizing organic labyrinth forming labyrinthine vascular networks.",
    mu: 0.365,
    sigma: 0.062,
    dt: 0.20
  },
  {
    id: "gyre",
    name: "Chaos Gyre Swarm",
    category: "Active Matter",
    description: "Swarm of micro-solitons with non-linear flocking and fluidic hydrodynamics.",
    mu: 0.218,
    sigma: 0.036,
    dt: 0.25
  }
];

// Continuous Lenia Physics Step
function stepLeniaContinuous(
  grid: Float32Array,
  next: Float32Array,
  kernel: { offsets: KernelOffset[]; totalWeight: number },
  mu: number,
  sigma: number,
  dt = 0.22
): { entropy: number; mass: number } {
  const invSigma = 1 / Math.max(1e-4, sigma);
  const invWeight = 1 / kernel.totalWeight;
  const offsets = kernel.offsets;
  const numOffsets = offsets.length;

  let totalActive = 0;
  let totalMass = 0;

  for (let y = 0; y < GRID_SIZE; y++) {
    const rowOffset = y * GRID_SIZE;

    for (let x = 0; x < GRID_SIZE; x++) {
      // 1. Concentric Radial Neighborhood Convolution
      let potential = 0;
      for (let k = 0; k < numOffsets; k++) {
        const off = offsets[k];
        const nx = (x + off.dx + GRID_SIZE) % GRID_SIZE;
        const ny = (y + off.dy + GRID_SIZE) % GRID_SIZE;
        potential += grid[ny * GRID_SIZE + nx] * off.weight;
      }
      const u = potential * invWeight;

      // 2. Continuous Gaussian Growth Mapping G(u) = 2 * exp(-(u - mu)^2 / (2*sigma^2)) - 1
      const dist = (u - mu) * invSigma;
      const growth = 2 * Math.exp(-0.5 * dist * dist) - 1;

      // 3. Time Integration with Smooth Clamping
      const cur = grid[rowOffset + x];
      const updated = Math.max(0, Math.min(1, cur + dt * growth));
      next[rowOffset + x] = updated;

      totalMass += updated;
      if (updated > 0.08 && updated < 0.92) {
        totalActive++;
      }
    }
  }

  // "entropy" here is the fraction of cells in the partially-activated
  // interface band (0.08, 0.92) — a living-perimeter density, not a Shannon
  // entropy. The UI labels it "Interface".
  const entropy = totalActive / (GRID_SIZE * GRID_SIZE);
  const avgMass = totalMass / (GRID_SIZE * GRID_SIZE);
  return { entropy, mass: avgMass };
}

// ============================================================================
// 2. Main Component: Continuous Artificial Life & Evolutionary Search
// ============================================================================

export function CAGalleryTrace() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { rootMargin: "250px 0px 250px 0px" });

  const [activePreset, setActivePreset] = useState<string>("orbium");
  const [mu, setMu] = useState(0.152);
  const [sigma, setSigma] = useState(0.038);
  const [dt, setDt] = useState(0.22);
  const [brushMode, setBrushMode] = useState<"seed" | "pulse">("pulse");

  // Which engine drives the field: the FrankenSim FFT kernel at 256² when it
  // loads, the 96² TypeScript fallback otherwise ("pending" behaves as js so
  // the canvas is alive from the first frame).
  const [engine, setEngine] = useState<LeniaEngine>("pending");
  const [gridSize, setGridSize] = useState(GRID_SIZE);

  const [isPlaying, setIsPlaying] = useState(true);
  const [entropy, setEntropy] = useState(0.42);
  const [organismMass, setOrganismMass] = useState(0.18);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optGen, setOptGen] = useState(0);
  const optIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [latestStateND, setLatestStateND] = useState<CMAESGenerationStateND | null>(null);
  const [historyND, setHistoryND] = useState<CMAESGenerationStateND[]>([]);
  const [isExpanded3D, setIsExpanded3D] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgDataRef = useRef<ImageData | null>(null);
  const isDraggingRef = useRef(false);

  // Precompute Lenia Kernel
  const kernel = useMemo(() => buildLeniaKernel(KERNEL_RADIUS, 0.5, 0.18), []);

  const gridStateRef = useRef<{ current: Float32Array; next: Float32Array }>({
    current: (() => {
      const arr = new Float32Array(GRID_SIZE * GRID_SIZE);
      const seed = (cx: number, cy: number, radius = 10, intensity = 0.9) => {
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= radius) {
              const x = (Math.round(cx) + dx + GRID_SIZE) % GRID_SIZE;
              const y = (Math.round(cy) + dy + GRID_SIZE) % GRID_SIZE;
              const ring = Math.exp(-Math.pow((dist - radius * 0.55) / 2.2, 2));
              arr[y * GRID_SIZE + x] = Math.min(1.0, arr[y * GRID_SIZE + x] + ring * intensity);
            }
          }
        }
      };
      seed(GRID_SIZE * 0.35, GRID_SIZE * 0.45, 10, 0.9);
      seed(GRID_SIZE * 0.65, GRID_SIZE * 0.55, 10, 0.9);
      return arr;
    })(),
    next: new Float32Array(GRID_SIZE * GRID_SIZE)
  });

  // Seed a hollow gaussian ring (soliton seed) into the JS fallback field.
  const injectOrganismJs = useCallback((cx: number, cy: number, radius = 9, intensity = 0.95) => {
    const arr = gridStateRef.current.current;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
          const x = (Math.round(cx) + dx + GRID_SIZE) % GRID_SIZE;
          const y = (Math.round(cy) + dy + GRID_SIZE) % GRID_SIZE;
          // Hollow gaussian ring pattern (soliton seed)
          const ring = Math.exp(-Math.pow((dist - radius * 0.55) / 2.2, 2));
          arr[y * GRID_SIZE + x] = Math.min(1.0, arr[y * GRID_SIZE + x] + ring * intensity);
        }
      }
    }
  }, []);

  // Engine-aware ring seeding. Coordinates and radius are in the given
  // field's grid cells; the wasm ring width scales with the field the same
  // way the kernel radius does, so seeds keep their morphology at 256².
  const seedRingAny = useCallback(
    (engineKind: LeniaEngine, size: number, cx: number, cy: number, radius: number, intensity: number) => {
      if (engineKind === "wasm") {
        leniaSeedRing(cx, cy, radius, 0.55, 2.2 * (size / GRID_SIZE), intensity);
      } else {
        injectOrganismJs(cx, cy, radius, intensity);
      }
    },
    [injectOrganismJs]
  );

  // Preset seed geometry, expressed relative to the field size so the same
  // organisms appear at 96² (fallback) and 256² (wasm).
  const seedPresetInto = useCallback(
    (presetId: string, engineKind: LeniaEngine, size: number) => {
      const s = size / GRID_SIZE;
      if (engineKind === "wasm") {
        leniaClear();
      } else {
        gridStateRef.current.current.fill(0);
      }

      if (presetId === "orbium") {
        // Dual solitons
        seedRingAny(engineKind, size, size * 0.35, size * 0.45, 10 * s, 0.9);
        seedRingAny(engineKind, size, size * 0.65, size * 0.55, 10 * s, 0.9);
      } else if (presetId === "mitosis") {
        // Central dividing organism
        seedRingAny(engineKind, size, size * 0.5, size * 0.5, 12 * s, 1.0);
      } else if (presetId === "biolattice") {
        // Organic seed array
        for (let i = 0; i < 9; i++) {
          const gx = size * (0.25 + (i % 3) * 0.25);
          const gy = size * (0.25 + Math.floor(i / 3) * 0.25);
          seedRingAny(engineKind, size, gx, gy, 6 * s, 0.85);
        }
      } else {
        // Multi-vortex chaotic ring
        for (let a = 0; a < 5; a++) {
          const angle = (a / 5) * Math.PI * 2;
          const gx = size * 0.5 + Math.cos(angle) * 22 * s;
          const gy = size * 0.5 + Math.sin(angle) * 22 * s;
          seedRingAny(engineKind, size, gx, gy, 8 * s, 0.95);
        }
      }
    },
    [seedRingAny]
  );

  // Reset grid with iconic soliton seeds
  const resetToPreset = useCallback(
    (presetId: string) => {
      const p = ORGANISM_PRESETS.find((x) => x.id === presetId) || ORGANISM_PRESETS[0];
      setActivePreset(p.id);
      setMu(p.mu);
      setSigma(p.sigma);
      setDt(p.dt);
      seedPresetInto(p.id, engine, gridSize);
    },
    [seedPresetInto, engine, gridSize]
  );

  // Bring up the FrankenSim FFT kernel; on success move the field to 256²
  // and reseed the active preset there. All state updates run inside promise
  // callbacks (asynchronous); failure of any step falls back to the JS path.
  const activePresetRef = useRef(activePreset);
  useEffect(() => {
    activePresetRef.current = activePreset;
  }, [activePreset]);

  useEffect(() => {
    let live = true;
    initFrankenSimLenia().then((status) => {
      if (!live) return;
      if (status.source !== "wasm") {
        setEngine("js");
        return;
      }
      // Pick the field resolution THIS device can sustain: try 512² and time
      // a few real steps (first call also warms the JIT and builds the LUT);
      // fall to the 256² floor when the probe misses the budget. leniaInit
      // reallocates the sim, so a rejected probe leaves no residue.
      let chosen: number | null = null;
      for (const size of WASM_GRID_SIZES) {
        if (!leniaInit(size, WASM_EVAL_SIZE, REL_KERNEL_RADIUS)) continue;
        if (size === 512) {
          const s = size / GRID_SIZE;
          leniaSeedRing(size * 0.5, size * 0.5, 10 * s, 0.55, 2.2 * s, 0.9);
          leniaStep(0.152, 0.038, 0.22, 1);
          const t0 = performance.now();
          leniaStep(0.152, 0.038, 0.22, 3);
          if ((performance.now() - t0) / 3 > WASM_512_STEP_BUDGET_MS) continue;
        }
        chosen = size;
        break;
      }
      if (chosen === null) {
        setEngine("js");
        return;
      }
      seedPresetInto(activePresetRef.current, "wasm", chosen);
      setEngine("wasm");
      setGridSize(chosen);
    });
    return () => {
      live = false;
    };
  }, [seedPresetInto]);

  // Live growth parameters behind a ref so slider drags and the optimizer's
  // per-generation updates do NOT tear down and restart the render loop
  // (which would freeze the field for the duration of a drag).
  const paramsRef = useRef({ mu, sigma, dt });
  useEffect(() => {
    paramsRef.current = { mu, sigma, dt };
  }, [mu, sigma, dt]);

  // Main simulation & render loop. requestAnimationFrame renders EVERY frame
  // (so brush strokes show while paused), while physics steps run on a fixed
  // ~31 steps/s accumulator — the same dynamics pace at 60 Hz and at
  // ProMotion 120 Hz, with at most two catch-up steps after a slow frame.
  useEffect(() => {
    if (!isInView) return;
    let raf = 0;
    let last = performance.now();
    let accumulatorMs = 0;
    let stepCount = 0;
    const STEP_MS = 32;

    const renderJsGrid = (ctx: CanvasRenderingContext2D) => {
      if (!imgDataRef.current || imgDataRef.current.width !== GRID_SIZE) {
        imgDataRef.current = ctx.createImageData(GRID_SIZE, GRID_SIZE);
      }
      const img = imgDataRef.current;
      const buf32 = new Uint32Array(img.data.buffer);
      const current = gridStateRef.current.current;

      const len = GRID_SIZE * GRID_SIZE;
      for (let i = 0; i < len; i++) {
        const v = current[i];

        if (v < 0.015) {
          // Deep obsidian void background #030712
          buf32[i] = (255 << 24) | (18 << 16) | (7 << 8) | 3;
        } else {
          // Bioluminescent continuous spectrum:
          // Low: Cyan/Teal (#06b6d4) -> Mid: Electric Amethyst (#a855f7) -> High: Golden Sunburst (#fbbf24) -> Core: White (#ffffff)
          let r = 0, g = 0, b = 0;

          if (v < 0.35) {
            const t = v / 0.35;
            r = Math.floor(3 + t * 45);
            g = Math.floor(7 + t * 180);
            b = Math.floor(18 + t * 210);
          } else if (v < 0.7) {
            const t = (v - 0.35) / 0.35;
            r = Math.floor(48 + t * 155);
            g = Math.floor(187 - t * 85);
            b = Math.floor(228 + t * 15);
          } else {
            const t = (v - 0.7) / 0.3;
            r = Math.floor(203 + t * 52);
            g = Math.floor(102 + t * 150);
            b = Math.floor(243 + t * 12);
          }

          // Little-endian ABGR packed
          buf32[i] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const elapsed = Math.min(120, now - last);
      last = now;

      let steps = 0;
      if (isPlaying) {
        accumulatorMs += elapsed;
        while (accumulatorMs >= STEP_MS && steps < 2) {
          accumulatorMs -= STEP_MS;
          steps++;
        }
        // Drop any further backlog instead of spiraling on slow devices.
        if (accumulatorMs > STEP_MS) accumulatorMs = STEP_MS;
      } else {
        accumulatorMs = 0;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: false });
      if (!canvas || !ctx) return;

      const { mu: liveMu, sigma: liveSigma, dt: liveDt } = paramsRef.current;
      if (engine === "wasm") {
        if (steps > 0) {
          const metrics = leniaStep(liveMu, liveSigma, liveDt, steps);
          stepCount += steps;
          if (metrics && stepCount % 4 < steps) {
            setEntropy(metrics.interface);
            setOrganismMass(metrics.mass);
          }
        }
        // Colormapped inside wasm; the ImageData wraps the kernel's RGBA
        // buffer directly (zero per-pixel JS work).
        const img = leniaImageData();
        if (img && img.width === canvas.width) ctx.putImageData(img, 0, 0);
      } else {
        for (let s = 0; s < steps; s++) {
          const { current, next } = gridStateRef.current;
          const metrics = stepLeniaContinuous(current, next, kernel, liveMu, liveSigma, liveDt);
          gridStateRef.current.current = next;
          gridStateRef.current.next = current;
          stepCount++;
          if (stepCount % 4 === 0) {
            setEntropy(metrics.entropy);
            setOrganismMass(metrics.mass);
          }
        }
        if (canvas.width === GRID_SIZE) renderJsGrid(ctx);
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [engine, isPlaying, kernel, isInView]);

  // Run 3D Multi-Objective CMA-ES for Soliton Stability & Complexity
  const handleRunOptimizer = () => {
    if (isOptimizing) {
      if (optIntervalRef.current) clearInterval(optIntervalRef.current);
      setIsOptimizing(false);
      return;
    }
    setIsOptimizing(true);
    setOptGen(0);
    setHistoryND([]);

    // Freeze the current field as the evaluation seed for the whole search.
    // Scoring against the live, still-evolving display grid would make the
    // objective non-stationary: every generation would grade a different
    // initial condition and the convergence trace would be meaningless.
    // The wasm kernel snapshots internally (box-averaged to 128²) and rolls
    // each candidate out there; the fallback snapshots the 96² CPU grid.
    const useWasmEval = engine === "wasm";
    let seedGrid: Float32Array | null = null;
    if (useWasmEval) {
      leniaSnapshotEval();
    } else {
      seedGrid = new Float32Array(gridStateRef.current.current);
    }

    // Optimize continuous parameters in normalized [0, 1]^3 space
    const optimizer = new CMAESOptimizerND(
      (zVec) => {
        const mVal = 0.10 + zVec[0] * 0.32;
        const sVal = 0.015 + zVec[1] * 0.060;
        const dtVal = 0.10 + zVec[2] * 0.25;

        if (useWasmEval) {
          // Kernel-side rollout of the same objective:
          // mean over 18 steps of (interface - 2|mass - 0.25|).
          const score = leniaEval(mVal, sVal, dtVal, 18);
          if (score !== null) return -score;
          console.warn("[fs-lenia] eval call failed; scoring candidate as neutral");
          return 0;
        }

        const bufA = new Float32Array(seedGrid!);
        const bufB = new Float32Array(GRID_SIZE * GRID_SIZE);
        let scoreSum = 0;

        for (let s = 0; s < 18; s++) {
          const src = s % 2 === 0 ? bufA : bufB;
          const dst = s % 2 === 0 ? bufB : bufA;
          const res = stepLeniaContinuous(src, dst, kernel, mVal, sVal, dtVal);
          // Ideal mass is around 0.15 - 0.35; high entropy indicates living perimeter complexity
          const massPenalty = Math.abs(res.mass - 0.25) * 2.0;
          const fitness = res.entropy - massPenalty;
          scoreSum += fitness;
        }
        return -scoreSum / 18; // Minimize negative fitness
      },
      {
        dim: 3,
        initialMean: [
          Math.max(0, Math.min(1, (mu - 0.10) / 0.32)),
          Math.max(0, Math.min(1, (sigma - 0.015) / 0.060)),
          Math.max(0, Math.min(1, (dt - 0.10) / 0.25))
        ],
        initialSigma: 0.22,
        lambda: 12,
        bounds: [0.0, 1.0]
      }
    );

    let g = 0;
    const maxG = 22;
    if (optIntervalRef.current) clearInterval(optIntervalRef.current);

    optIntervalRef.current = setInterval(() => {
      g++;
      const state = optimizer.step();
      const newMu = 0.10 + state.bestX[0] * 0.32;
      const newSigma = 0.015 + state.bestX[1] * 0.060;
      const newDt = 0.10 + state.bestX[2] * 0.25;

      setMu(newMu);
      setSigma(newSigma);
      setDt(newDt);
      setOptGen(g);
      setLatestStateND(state);
      setHistoryND((prev) => [...prev, state]);

      if (g >= maxG) {
        if (optIntervalRef.current) clearInterval(optIntervalRef.current);
        setIsOptimizing(false);
      }
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (optIntervalRef.current) clearInterval(optIntervalRef.current);
    };
  }, []);

  // Handle Canvas Mouse Drag Drawing (brush radius scales with the field)
  const handleCanvasInteraction = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const gx = ((clientX - rect.left) / rect.width) * gridSize;
    const gy = ((clientY - rect.top) / rect.height) * gridSize;
    const scale = gridSize / GRID_SIZE;
    seedRingAny(engine, gridSize, gx, gy, (brushMode === "pulse" ? 8 : 12) * scale, 0.95);
  };

  return (
    <div ref={containerRef} className="glass-card p-6 md:p-8 space-y-8 border-white/10">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Atom className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display flex items-center gap-2.5">
              <span>Continuous Morphodynamic Artificial Life (Lenia)</span>
              <span className="text-[0.65rem] font-mono px-2.5 py-0.5 rounded-full border bg-pink-500/15 border-pink-500/40 text-pink-300">
                Black-Box Physics Search
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Evolving growth-rule parameters (μ, σ, Δt) for soliton morphogenesis with CMA-ES; the convolution kernel itself stays fixed
            </p>
          </div>
        </div>

        {/* Live Telemetry Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span>Interface: {(entropy * 100).toFixed(1)}%</span>
          </span>
          <span className="text-pink-400 bg-pink-500/10 px-3 py-1.5 rounded-xl border border-pink-500/20">
            Mass: {(organismMass * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Preset Organisms Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {ORGANISM_PRESETS.map((p) => {
          const isActive = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => resetToPreset(p.id)}
              className={`p-3 rounded-2xl border text-left transition-[background-color,border-color,box-shadow,transform] cursor-pointer ${
                isActive
                  ? "bg-gradient-to-br from-pink-500/20 to-purple-500/10 border-pink-500/60 shadow-glow-sm scale-[1.02]"
                  : "bg-slate-950/60 border-white/10 hover:border-white/20 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white font-display">{p.name}</span>
                <span className="text-[0.62rem] font-mono text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded">
                  {p.category}
                </span>
              </div>
              <p className="text-[0.68rem] text-slate-400 line-clamp-2 leading-relaxed">{p.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Stage */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] items-start">
        {/* Left Column: Interactive Simulation Viewport (Single or Split 3D View) */}
        <div className="space-y-3">
          {isExpanded3D ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Lenia 2D Field */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl group cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={gridSize}
                  height={gridSize}
                  className={`w-full h-full block select-none ${engine === "wasm" ? "" : "image-rendering-pixelated"}`}
                  style={{ touchAction: "none" }}
                  onMouseDown={(e) => {
                    isDraggingRef.current = true;
                    handleCanvasInteraction(e.clientX, e.clientY);
                  }}
                  onMouseMove={(e) => {
                    if (isDraggingRef.current) {
                      handleCanvasInteraction(e.clientX, e.clientY);
                    }
                  }}
                  onMouseUp={() => {
                    isDraggingRef.current = false;
                  }}
                  onMouseLeave={() => {
                    isDraggingRef.current = false;
                  }}
                  onTouchStart={(e) => {
                    if (e.touches[0]) handleCanvasInteraction(e.touches[0].clientX, e.touches[0].clientY);
                  }}
                  onTouchMove={(e) => {
                    if (e.touches[0]) handleCanvasInteraction(e.touches[0].clientX, e.touches[0].clientY);
                  }}
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 border border-white/10 text-[0.62rem] font-bold text-pink-300 backdrop-blur-md">
                  Lenia 2D Cellular PDE ·{" "}
                  {engine === "wasm" ? `FrankenSim WASM FFT ${gridSize}²` : `TS engine ${gridSize}²`}
                </div>
              </div>

              {/* 3D PCA Covariance Phase Space Canvas */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#030712]">
                <CMAESPhaseSpaceViewer
                  latestState={latestStateND}
                  history={historyND}
                  title="3D PCA Parameter Space"
                />
              </div>
            </div>
          ) : (
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-[0_20px_50px_rgba(0,0,0,0.8)] group cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={gridSize}
                height={gridSize}
                className={`w-full h-full block select-none ${engine === "wasm" ? "" : "image-rendering-pixelated"}`}
                style={{ touchAction: "none" }}
                onMouseDown={(e) => {
                  isDraggingRef.current = true;
                  handleCanvasInteraction(e.clientX, e.clientY);
                }}
                onMouseMove={(e) => {
                  if (isDraggingRef.current) {
                    handleCanvasInteraction(e.clientX, e.clientY);
                  }
                }}
                onMouseUp={() => {
                  isDraggingRef.current = false;
                }}
                onMouseLeave={() => {
                  isDraggingRef.current = false;
                }}
                onTouchStart={(e) => {
                  if (e.touches[0]) handleCanvasInteraction(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchMove={(e) => {
                  if (e.touches[0]) handleCanvasInteraction(e.touches[0].clientX, e.touches[0].clientY);
                }}
              />

              {/* Top-Right Interactive Drawing Hint */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 border border-white/10 backdrop-blur-md text-[0.68rem] font-mono text-pink-300 pointer-events-none shadow-lg">
                <MousePointer2 className="h-3.5 w-3.5 text-pink-400" />
                <span>Click or drag to seed life</span>
              </div>

              {/* Top-Left: Engine Provenance + Search Status */}
              <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 pointer-events-none">
                <div className="px-2.5 py-1 rounded-full bg-slate-950/85 border border-white/10 backdrop-blur-md text-[0.62rem] font-mono text-slate-300">
                  {engine === "wasm"
                    ? `FrankenSim WASM FFT · ${gridSize}×${gridSize}`
                    : `TS engine · ${gridSize}×${gridSize}`}
                </div>
                {isOptimizing && (
                  <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-500/50 shadow-glow-sm">
                    <span className="h-2 w-2 rounded-full bg-pink-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-pink-200">
                      CMA-ES Evolving Lenia: Gen {optGen}/22
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Spectrum Legend */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-[0.65rem] font-mono text-slate-300 pointer-events-none">
                <span className="text-slate-500">Void (0.0)</span>
                <div className="flex-1 mx-3 h-1.5 rounded-full bg-gradient-to-r from-[#06b6d4] via-[#a855f7] to-[#fbbf24]" />
                <span className="text-amber-300 font-bold">Soliton Core (1.0)</span>
              </div>
            </div>
          )}

          {/* Controls Strip */}
          <div className="flex items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-2 transition-[background-color] border border-white/10"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{isPlaying ? "Pause Simulation" : "Resume"}</span>
              </button>
              <button
                onClick={() => resetToPreset(activePreset)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-[background-color,color] border border-white/10"
                title="Reseed Active Organism"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400">Brush:</span>
              <button
                onClick={() => setBrushMode("pulse")}
                className={`px-2.5 py-1 rounded-lg text-[0.68rem] transition-[background-color,color] ${
                  brushMode === "pulse" ? "bg-pink-500 text-white font-bold" : "bg-slate-900 text-slate-400"
                }`}
              >
                Soliton Ring
              </button>
              <button
                onClick={() => setBrushMode("seed")}
                className={`px-2.5 py-1 rounded-lg text-[0.68rem] transition-[background-color,color] ${
                  brushMode === "seed" ? "bg-pink-500 text-white font-bold" : "bg-slate-900 text-slate-400"
                }`}
              >
                Dense Core
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Kernel Knobs & CMA-ES Engine */}
        <div className="space-y-6">
          <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-pink-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-pink-400" />
                <span>Growth Function <LatexRenderer math="G(u; \mu, \sigma)" block={false} /></span>
              </span>
              <span className="font-mono text-slate-500 text-[0.68rem]">Kernel K(r): Concentric Donut</span>
            </div>

            {/* Growth Center (mu) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  <span>Growth Center (</span><LatexRenderer math="\mu" block={false} /><span>)</span>
                </span>
                <span className="text-pink-300 font-mono bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                  {mu.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Growth Center"
                min={0.1}
                max={0.42}
                step={0.002}
                value={mu}
                onChange={(e) => setMu(parseFloat(e.target.value))}
                className="w-full accent-pink-400"
              />
            </div>

            {/* Growth Width (sigma) */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  <span>Growth Width (</span><LatexRenderer math="\sigma" block={false} /><span>)</span>
                </span>
                <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {sigma.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Growth Width"
                min={0.015}
                max={0.075}
                step={0.001}
                value={sigma}
                onChange={(e) => setSigma(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            {/* Time Delta (dt) */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  <span>Simulation Step (<LatexRenderer math="\Delta t" block={false} />)</span>
                </span>
                <span className="text-sky-300 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {dt.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Simulation Time Step"
                min={0.1}
                max={0.35}
                step={0.01}
                value={dt}
                onChange={(e) => setDt(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>
          </div>

          {/* Biological Physics Takeaway Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/30 via-slate-950/40 to-purple-950/30 border border-pink-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-pink-300 font-bold uppercase tracking-wider text-[0.7rem]">
              <Sparkles className="h-3.5 w-3.5 text-pink-400" />
              <span>Why CMA-ES Excels on Morphodynamic Landscapes</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Continuous artificial life exists strictly inside chaotic, narrow parameter corridors. The update rule itself is smooth, but the fitness (does a pattern survive?) is a discontinuous functional of a chaotic rollout (18 steps per evaluation here), so gradients through it explode or vanish into uselessness. CMA-ES needs only rank comparisons, adapting its covariance ellipsoid to follow the razor-thin boundary of living emergence.
            </p>
          </div>

          {/* Evolve with CMA-ES Action Button */}
          <button
            onClick={handleRunOptimizer}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-xs font-bold text-white transition-[background-color,box-shadow,transform] shadow-xl ${
              isOptimizing
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 animate-pulse"
                : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-[1.01] shadow-pink-500/30"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isOptimizing ? "Halt Morphodynamic Evolution" : "Evolve Self-Stabilizing Solitons with CMA-ES"}</span>
          </button>
        </div>
      </div>

      {/* Unified Live CMA-ES Internal State Telemetry HUD (Directly at the bottom) */}
      <CMAESTelemetryHUD
        latestState={latestStateND}
        history={historyND}
        isOptimizing={isOptimizing}
        maxGen={22}
        onToggleExpand3D={() => setIsExpanded3D((prev) => !prev)}
        isExpanded3D={isExpanded3D}
        accentColor="purple"
        objectiveName="Mass penalty − interface score (minimized)"
      />
    </div>
  );
}

