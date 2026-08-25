"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Sparkles, Play, Pause, RotateCcw, Sliders, Activity, Compass, Flame } from "lucide-react";
import { CMAESOptimizer } from "../lib/cmaesEngine";

const GRID_SIZE = 64;

// Continuous Cellular Automata simulation step (Lenia / Neural CA hybrid)
function stepCA(
  grid: Float32Array,
  next: Float32Array,
  mu: number,
  sigma: number,
  dt = 0.15
): number {
  const n = GRID_SIZE;
  let totalEntropy = 0;

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      // 3x3 Moore neighborhood convolution
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const xx = (x + dx + n) % n;
          const yy = (y + dy + n) % n;
          sum += grid[yy * n + xx];
        }
      }
      const avg = sum / 8;

      // Bell-shaped growth mapping G(avg; mu, sigma) = 2 * exp(-(avg - mu)^2 / (2*sigma^2)) - 1
      const dist = (avg - mu) / Math.max(1e-4, sigma);
      const growth = 2 * Math.exp(-0.5 * dist * dist) - 1;

      // State update
      const cur = grid[y * n + x];
      const updated = Math.max(0, Math.min(1, cur + dt * growth));
      next[y * n + x] = updated;

      // Compute spatial entropy/complexity
      if (updated > 0.05 && updated < 0.95) {
        totalEntropy += 1;
      }
    }
  }

  return totalEntropy / (n * n);
}

export function CAGalleryTrace() {
  const [mu, setMu] = useState(0.28); // Growth center
  const [sigma, setSigma] = useState(0.045); // Growth width
  const [isPlaying, setIsPlaying] = useState(true);
  const [entropy, setEntropy] = useState(0.35);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optGen, setOptGen] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridStateRef = useRef<{ current: Float32Array; next: Float32Array }>({
    current: new Float32Array(GRID_SIZE * GRID_SIZE),
    next: new Float32Array(GRID_SIZE * GRID_SIZE)
  });

  // Seed random initial soup
  const resetGrid = useCallback(() => {
    const arr = gridStateRef.current.current;
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.random() > 0.75 ? Math.random() : 0;
    }
  }, []);

  useEffect(() => {
    resetGrid();
  }, [resetGrid]);

  // Main Continuous CA animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const { current, next } = gridStateRef.current;
      const ent = stepCA(current, next, mu, sigma);
      gridStateRef.current.current = next;
      gridStateRef.current.next = current;
      setEntropy(ent);

      // Render to canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = ctx.createImageData(GRID_SIZE, GRID_SIZE);
      for (let i = 0; i < current.length; i++) {
        const v = current[i];
        const idx = i * 4;
        // Electric organic neon cyan/purple palette
        img.data[idx] = Math.floor(20 + 220 * Math.pow(v, 1.4)); // R
        img.data[idx + 1] = Math.floor(40 + 200 * Math.sin(v * Math.PI)); // G
        img.data[idx + 2] = Math.floor(80 + 175 * (1 - v)); // B
        img.data[idx + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying, mu, sigma]);

  // Run CMA-ES Evolutionary Search for Living Pattern Complexity
  const handleRunOptimizer = () => {
    if (isOptimizing) {
      setIsOptimizing(false);
      return;
    }
    setIsOptimizing(true);
    setOptGen(0);

    // Optimize mu in [0.15, 0.45] and sigma in [0.02, 0.09] to maximize sustained spatial complexity
    const optimizer = new CMAESOptimizer(
      (mVal, sVal) => {
        // Evaluate CA score over 15 simulation steps
        let testGrid = new Float32Array(gridStateRef.current.current);
        let testNext = new Float32Array(GRID_SIZE * GRID_SIZE);
        let scoreSum = 0;
        for (let s = 0; s < 15; s++) {
          const e = stepCA(testGrid, testNext, mVal, sVal, 0.2);
          testGrid = testNext;
          scoreSum += e;
        }
        // Maximize entropy -> minimize negative entropy
        return -scoreSum / 15;
      },
      {
        dim: 2,
        initialMean: [mu, sigma],
        initialSigma: 0.05,
        lambda: 10,
        bounds: [0.01, 0.5]
      }
    );

    let g = 0;
    const maxG = 20;
    const interval = setInterval(() => {
      g++;
      const state = optimizer.step();
      const newMu = Math.max(0.12, Math.min(0.48, state.bestX[0]));
      const newSigma = Math.max(0.015, Math.min(0.09, state.bestX[1]));
      setMu(newMu);
      setSigma(newSigma);
      setOptGen(g);

      if (g >= maxG) {
        clearInterval(interval);
        setIsOptimizing(false);
      }
    }, 200);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Continuous Cellular Automata Evolutionary Search
            </h3>
            <p className="text-xs text-slate-400">
              Evolving non-differentiable convolution kernels for artificial life & visual emergence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Entropy: {(entropy * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] items-start">
        {/* Continuous CA Canvas */}
        <div className="space-y-3">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE}
              height={GRID_SIZE}
              className="w-full h-full block image-rendering-pixelated"
            />

            {isOptimizing && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-purple-500/40 shadow-glow-sm">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-purple-200">
                  CMA-ES Evolving Life: Gen {optGen}/20
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={resetGrid}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Reseed Random Soup"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="text-[0.68rem] text-slate-400 font-mono">64×64 Continuous Field</span>
          </div>
        </div>

        {/* Knobs & Optimization Controls */}
        <div className="space-y-4">
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-200">
              CA Growth Kernel Parameters
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Growth Center ($\mu$)</span>
                <span className="text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {mu.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                min={0.12}
                max={0.48}
                step={0.005}
                value={mu}
                onChange={(e) => setMu(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Growth Width ($\sigma$)</span>
                <span className="text-pink-300 font-mono bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                  {sigma.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                min={0.015}
                max={0.09}
                step={0.002}
                value={sigma}
                onChange={(e) => setSigma(parseFloat(e.target.value))}
                className="w-full accent-pink-400"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-slate-300 space-y-2">
            <p className="leading-relaxed">
              Living cellular automata exhibit complex solitary wave structures (solitons) only in narrow chaotic bands of parameter space. CMA-ES treats the whole CA simulator as a black box and maximizes structural entropy.
            </p>
          </div>

          <button
            onClick={handleRunOptimizer}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white transition-all shadow-lg ${
              isOptimizing
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30 animate-pulse"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] shadow-purple-500/30"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isOptimizing ? "Stop Evolution" : "Evolve Life Patterns with CMA-ES"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
