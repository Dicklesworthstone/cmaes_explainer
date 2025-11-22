"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, RouteIcon } from "lucide-react";

const SIZE = 96;
const GRID = 5; // grid of thumbnails
const STEPS = GRID * GRID; // 25

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// Simulate a simple CA and return a single RGBA snapshot for the given params
// keeping the output length exactly width*height*4 to avoid ImageData errors.
function simulateCA(params: [number, number, number], seed = 1) {
  const n = SIZE;
  const rand = rng(seed);
  let state = new Float32Array(n * n);
  for (let i = 0; i < state.length; i++) state[i] = rand() > 0.9 ? 1 : 0;

  const [k1, k2, blend] = params;
  const kernel = [
    0.05 * k1,
    0.1 * k2,
    0.05 * k1,
    0.1 * k2,
    0.4,
    0.1 * k2,
    0.05 * k1,
    0.1 * k2,
    0.05 * k1
  ];

  let snapshot: Uint8ClampedArray | null = null;
  for (let step = 0; step < 40; step++) {
    const next = new Float32Array(n * n);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        let acc = 0;
        let idx = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const xx = (x + dx + n) % n;
            const yy = (y + dy + n) % n;
            acc += kernel[idx++] * state[yy * n + xx];
          }
        }
        const activated = 1 / (1 + Math.exp(-4 * (acc - 0.5)));
        const mixed = state[y * n + x] * (1 - blend) + activated * blend;
        next[y * n + x] = mixed;
      }
    }
    state = next;
    if (step === 36) {
      const img = new Uint8ClampedArray(n * n * 4);
      for (let i = 0; i < n * n; i++) {
        const v = state[i];
        const c = Math.floor(255 * v);
        img[i * 4 + 0] = c;
        img[i * 4 + 1] = Math.floor(255 * Math.pow(v, 0.6));
        img[i * 4 + 2] = 255 - c;
        img[i * 4 + 3] = 255;
      }
      snapshot = img;
    }
  }
  return snapshot ?? new Uint8ClampedArray(n * n * 4);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function CAGalleryTrace() {
  const [pathT, setPathT] = useState(0.6);
  const [seed, setSeed] = useState(3);

  const path = useMemo(() => {
    // CMA-ES like path from random corners to clustered region
    const pts: [number, number, number][] = [];
    const start: [number, number, number] = [0.2, 0.8, 0.6];
    const end: [number, number, number] = [0.55, 0.45, 0.28];
    for (let i = 0; i < STEPS; i++) {
      const t = i / (STEPS - 1);
      pts.push([
        lerp(start[0], end[0], t),
        lerp(start[1], end[1], t * (0.6 + 0.4 * pathT)),
        lerp(start[2], end[2], t)
      ]);
    }
    return pts;
  }, [pathT]);

  const snapshots = useMemo(() => path.map((p, i) => simulateCA(p, seed + i)), [path, seed]);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    snapshots.forEach((img, idx) => {
      const canvas = canvasRefs.current[idx];
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const arr = new Uint8ClampedArray(img.length);
      arr.set(img as unknown as ArrayLike<number>);
      const imageData = new ImageData(arr, SIZE, SIZE);
      ctx.putImageData(imageData, 0, 0);
    });
  }, [snapshots]);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Sparkles className="h-4 w-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">CA Pattern Gallery</h3>
            <p className="text-xs text-slate-400">Tracing the CMA-ES path</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/30 px-3 py-1.5 rounded-full border border-white/5">
            <span className="font-medium">Tightness</span>
            <input
              aria-label="Path tightness"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={pathT}
              onChange={(e) => setPathT(parseFloat(e.target.value))}
              className="w-24 accent-sky-500"
            />
          </div>
          <button
            onClick={() => setSeed((s) => s + 7)}
            className="flex items-center gap-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors shadow-sm"
          >
            <RouteIcon className="w-3 h-3 opacity-70" />
            Resample
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
        Each thumbnail is a Cellular Automata snapshot along a CMA-ES-like path. The optimizer drags parameters from broad random exploration (top-left) toward a clustered region of coherent structures (bottom-right).
      </p>

      <div className="grid grid-cols-5 gap-3">
        {snapshots.map((_, i) => (
          <div key={i} className="relative group aspect-square">
            <canvas
              ref={(el) => {
                canvasRefs.current[i] = el;
              }}
              width={SIZE}
              height={SIZE}
              className="w-full h-full rounded-lg border border-white/5 bg-[#0B1121] shadow-inner transition-transform duration-300 group-hover:scale-[1.02] group-hover:border-sky-500/30"
            />
            {i === snapshots.length - 1 && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="rounded-full bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 text-[0.65rem] font-bold text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  BEST
                </div>
              </div>
            )}
             <div className="absolute top-1 left-1 text-[0.55rem] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                #{i + 1}
             </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/30 p-3 rounded-lg border border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_5px_#38bdf8] shrink-0" />
         <p>
          Adjust <strong>path tightness</strong> to see how quickly the search converges to the &quot;sweet spot&quot; of complex behavior.
        </p>
      </div>
    </div>
  );
}
