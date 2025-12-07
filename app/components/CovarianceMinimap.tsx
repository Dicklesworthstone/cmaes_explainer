"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WIDTH = 360;
const HEIGHT = 260;
const DOMAIN = 2.5; // plot range [-DOMAIN, DOMAIN]

const objectives = {
  sphere: {
    label: "Sphere",
    f: (x: number, y: number) => x * x + y * y,
    hessian: () => [1, 0, 0, 1]
  },
  cigar: {
    label: "Cigar",
    f: (x: number, y: number) => 100 * x * x + y * y,
    hessian: () => [200, 0, 0, 2]
  },
  rastrigin: {
    label: "Rastrigin",
    f: (x: number, y: number) => 20 + (x * x - 10 * Math.cos(2 * Math.PI * x)) + (y * y - 10 * Math.cos(2 * Math.PI * y)),
    // Hessian near origin for intuition
    hessian: () => {
      const c = 2 * Math.PI * Math.PI * 10; // second derivative of cos term at 0
      return [2 + c, 0, 0, 2 + c];
    }
  }
} as const;

type ObjKey = keyof typeof objectives;

function matInverse2x2([a, b, c, d]: number[]): [number, number, number, number] {
  const det = a * d - b * c;
  const invDet = det === 0 ? 0 : 1 / det;
  return [d * invDet, -b * invDet, -c * invDet, a * invDet];
}

function interp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function multMatVec([a, b, c, d]: number[], [x, y]: number[]): [number, number] {
  return [a * x + b * y, c * x + d * y];
}

export function CovarianceMinimap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [obj, setObj] = useState<ObjKey>("cigar");
  const [progress, setProgress] = useState(0.35); // 0..1 pseudo-generation
  const [showNG, setShowNG] = useState(true);
  const [mean, setMean] = useState<[number, number]>([1.4, 1.1]);

  const fn = objectives[obj];

  const targetCov = useMemo(() => {
    const H = fn.hessian();
    const inv = matInverse2x2(H);
    // scale to reasonable ellipse size
    return inv.map((v) => v * 0.35) as [number, number, number, number];
  }, [fn]);

  const currentCov = useMemo(() => {
    const t = progress;
    const I: [number, number, number, number] = [1, 0, 0, 1];
    return [interp(I[0], targetCov[0], t), interp(I[1], targetCov[1], t), interp(I[2], targetCov[2], t), interp(I[3], targetCov[3], t)] as [number, number, number, number];
  }, [progress, targetCov]);

  const currentMean = useMemo(() => {
    const t = progress;
    const start: [number, number] = [1.4, 1.1];
    const goal: [number, number] = [0, 0];
    return [interp(start[0], goal[0], t), interp(start[1], goal[1], t)] as [number, number];
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // draw contour heatmap
    const img = ctx.createImageData(WIDTH, HEIGHT);
    for (let iy = 0; iy < HEIGHT; iy++) {
      const y = ((HEIGHT - iy) / HEIGHT - 0.5) * 2 * DOMAIN;
      for (let ix = 0; ix < WIDTH; ix++) {
        const x = (ix / WIDTH - 0.5) * 2 * DOMAIN;
        const v = fn.f(x, y);
        // simple tone mapping
        const norm = Math.tanh(v / 25);
        const idx = (iy * WIDTH + ix) * 4;
        const c = Math.floor(255 * (1 - norm));
        img.data[idx] = 12; // R
        img.data[idx + 1] = c; // G
        img.data[idx + 2] = 255 - c; // B
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    // axes
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.moveTo(0, HEIGHT / 2);
    ctx.lineTo(WIDTH, HEIGHT / 2);
    ctx.stroke();

    // ellipse for covariance
    const [a, b, c, d] = currentCov;
    const cov = [[a, b], [c, d]];
    // eigenvalues/vectors
    const tr = a + d;
    const det = a * d - b * c;
    const disc = Math.sqrt(Math.max(tr * tr - 4 * det, 0));
    const l1 = (tr + disc) / 2;
    const l2 = (tr - disc) / 2;
    const v1 = [b, l1 - a];
    const len1 = Math.hypot(v1[0], v1[1]) || 1;
    const e1 = [v1[0] / len1, v1[1] / len1];
    const angle = Math.atan2(e1[1], e1[0]);

    const cx = (currentMean[0] / (2 * DOMAIN) + 0.5) * WIDTH;
    const cy = HEIGHT - (currentMean[1] / (2 * DOMAIN) + 0.5) * HEIGHT;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-angle);
    ctx.strokeStyle = "rgba(56,189,248,0.9)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const rx = Math.sqrt(Math.max(l1, 0)) * (WIDTH / (2 * DOMAIN)) * 0.8;
    const ry = Math.sqrt(Math.max(l2, 0)) * (HEIGHT / (2 * DOMAIN)) * 0.8;
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // mean point
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    // gradient arrows
    const grad = [2 * currentMean[0], 2 * currentMean[1]] as [number, number];
    const euclid = [-grad[0], -grad[1]];
    const nat = multMatVec(cov.flat() as [number, number, number, number], euclid);
    const drawArrow = (vec: [number, number], color: string, scale: number) => {
      const [vx, vy] = vec;
      const sx = cx;
      const sy = cy;
      const ex = cx + (vx / DOMAIN) * (WIDTH / 4) * scale;
      const ey = cy - (vy / DOMAIN) * (HEIGHT / 4) * scale;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      // arrowhead
      const ang = Math.atan2(ey - sy, ex - sx);
      const ah = 8;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - ah * Math.cos(ang - Math.PI / 7), ey - ah * Math.sin(ang - Math.PI / 7));
      ctx.lineTo(ex - ah * Math.cos(ang + Math.PI / 7), ey - ah * Math.sin(ang + Math.PI / 7));
      ctx.closePath();
      ctx.fill();
    };

    drawArrow(euclid as [number, number], "rgba(248,113,113,0.85)", 0.6);
    if (showNG) drawArrow(nat as [number, number], "rgba(94,234,212,0.95)", 0.8);
  }, [fn, currentCov, currentMean, showNG]);

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <div className="w-4 h-4 rounded-full border-2 border-sky-400/60" />
          </div>
          <div>
             <h3 className="text-sm font-semibold text-slate-100 tracking-tight">Covariance Evolution</h3>
             <p className="text-xs text-slate-400">Metric adaptation in action</p>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${showNG ? "bg-emerald-500 border-emerald-500" : "border-slate-600 bg-slate-800"}`}>
             {showNG && <div className="w-2 h-2 bg-white rounded-sm" />}
          </div>
          <input
            type="checkbox"
            checked={showNG}
            onChange={(e) => setShowNG(e.target.checked)}
            className="hidden"
          />
          <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">Show Natural Grad</span>
        </label>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-inner bg-[#0B1121]">
         <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full block" />
         <div className="absolute top-3 right-3 flex gap-1.5">
          {(Object.keys(objectives) as ObjKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setObj(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 backdrop-blur-sm ${
                obj === k
                  ? "bg-sky-500/90 text-white shadow-lg shadow-sky-500/20"
                  : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-white/5"
              }`}
            >
              {objectives[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-950/30 rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center gap-4">
         <div className="flex-1">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-slate-400">Optimization Progress</span>
              <span className="text-sky-300 font-mono">{Math.round(progress * 100)}%</span>
            </div>
            <input
              aria-label="Generation progress"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={progress}
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-full accent-sky-500"
            />
         </div>
         <div className="text-xs text-slate-400 max-w-xs leading-relaxed border-l border-white/10 pl-4 hidden sm:block">
            <strong>Red:</strong> Euclidean descent.<br/>
            <strong>Mint:</strong> Natural gradient (covariance-aware).
         </div>
      </div>
    </div>
  );
}
