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

  const snapshots: Uint8ClampedArray[] = [];
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
    if (step % 4 === 3) {
      const img = new Uint8ClampedArray(n * n * 4);
      for (let i = 0; i < n * n; i++) {
        const v = state[i];
        const c = Math.floor(255 * v);
        img[i * 4 + 0] = c;
        img[i * 4 + 1] = Math.floor(255 * Math.pow(v, 0.6));
        img[i * 4 + 2] = 255 - c;
        img[i * 4 + 3] = 255;
      }
      snapshots.push(img);
    }
  }
  return snapshots.slice(0, STEPS);
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
      const imageData = new ImageData(img, SIZE, SIZE);
      ctx.putImageData(imageData, 0, 0);
    });
  }, [snapshots]);

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-sky-200">
          <Sparkles className="h-4 w-4" /> CA pattern gallery (CMA-ES trace)
        </div>
        <div className="flex items-center gap-2 text-[0.8rem] text-slate-300">
          <span>Path tightness</span>
          <input type="range" min={0} max={1} step={0.01} value={pathT} onChange={(e) => setPathT(parseFloat(e.target.value))} className="w-28 accent-sky-400" />
          <button
            onClick={() => setSeed((s) => s + 7)}
            className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-[0.78rem] text-slate-200 hover:border-sky-400/70"
          >
            Resample
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-300">
        Each thumbnail is a CA snapshot along a CMA-ES-like path from broad exploration (top-left) to
        a clustered region (bottom-right). Dot colors show how structure sharpens as parameters converge.
      </p>
      <div className="grid grid-cols-5 gap-2">
        {snapshots.map((_, i) => (
          <div key={i} className="relative">
            <canvas
              ref={(el) => (canvasRefs.current[i] = el)}
              width={SIZE}
              height={SIZE}
              className="w-full rounded-lg border border-slate-800/70 bg-slate-950"
            />
            {i === snapshots.length - 1 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-emerald-400/80 px-2 py-0.5 text-[0.7rem] text-slate-900 shadow-lg">
                  best
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-[0.82rem] text-slate-400">
        This mirrors the creative-systems vignette: CMA-ES drags CA parameters from “random noise” toward
        coherent structure. Adjust path tightness to see faster vs slower convergence to the sweet spot.
      </div>
    </div>
  );
}
