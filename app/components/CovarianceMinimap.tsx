"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sliders, Activity, Compass, ArrowRight, Sparkles } from "lucide-react";
import { eigen2x2 } from "../lib/cmaesEngine";
import { LatexRenderer } from "./LatexRenderer";

const WIDTH = 760;
const HEIGHT = 520;
const DOMAIN = 2.4;

const objectives = {
  cigar: {
    label: "Ill-Conditioned Cigar",
    f: (x: number, y: number) => 100 * x * x + y * y,
    hessian: () => [200, 0, 0, 2]
  },
  rosenbrock: {
    label: "Rosenbrock Valley",
    f: (x: number, y: number) => 100 * (y - x * x) ** 2 + (1 - x) ** 2,
    hessian: () => [802, -400, -400, 200]
  },
  sphere: {
    label: "Isotropic Sphere",
    f: (x: number, y: number) => x * x + y * y,
    hessian: () => [2, 0, 0, 2]
  }
} as const;

type ObjKey = keyof typeof objectives;

export function CovarianceMinimap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [objKey, setObjKey] = useState<ObjKey>("cigar");
  const [progress, setProgress] = useState(0.45); // 0 (start) to 1 (converged)
  const [showNaturalGrad, setShowNaturalGrad] = useState(true);

  const fn = objectives[objKey];
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const offscreen = document.createElement("canvas");
    offscreen.width = WIDTH;
    offscreen.height = HEIGHT;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    const toCoordX = (px: number) => (px / WIDTH) * (2 * DOMAIN) - DOMAIN;
    const toCoordY = (py: number) => ((HEIGHT - py) / HEIGHT) * (2 * DOMAIN) - DOMAIN;

    const imgData = ctx.createImageData(WIDTH, HEIGHT);
    const buf32 = new Uint32Array(imgData.data.buffer);

    for (let py = 0; py < HEIGHT; py++) {
      const y = toCoordY(py);
      const rowOffset = py * WIDTH;

      for (let px = 0; px < WIDTH; px++) {
        const x = toCoordX(px);
        const v = fn.f(x, y);
        const norm = Math.tanh(v / 30);

        const r = (10 + 15 * norm) | 0;
        const g = (25 + 75 * (1 - norm)) | 0;
        const b = (45 + 120 * (1 - norm)) | 0;
        buf32[rowOffset + px] = (255 << 24) | (b << 16) | (g << 8) | r;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    bgCanvasRef.current = offscreen;
  }, [fn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const toPxX = (x: number) => ((x + DOMAIN) / (2 * DOMAIN)) * W;
    const toPxY = (y: number) => H - ((y + DOMAIN) / (2 * DOMAIN)) * H;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Cached Heatmap Contours
    if (bgCanvasRef.current) {
      ctx.drawImage(bgCanvasRef.current, 0, 0, W, H);
    }

    // 2. Draw Subtle Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    // 3. Compute Current Mean & Covariance (Interpolating toward inverse Hessian)
    const t = progress;
    const startMean: [number, number] = [1.5, 1.2];
    const curMean: [number, number] = [startMean[0] * (1 - t), startMean[1] * (1 - t)];

    // Target covariance is proportional to inverse Hessian
    const Hmat = fn.hessian();
    const det = Hmat[0] * Hmat[3] - Hmat[1] * Hmat[2];
    const invH: [number, number, number, number] = [
      Hmat[3] / det,
      -Hmat[1] / det,
      -Hmat[2] / det,
      Hmat[0] / det
    ];

    // Scale inverse Hessian for visualization
    const maxInv = Math.max(...invH.map(Math.abs));
    const targetC: [number, number, number, number] = invH.map((v) => (v / maxInv) * 1.8) as any;

    const I: [number, number, number, number] = [1, 0, 0, 1];
    const curC: [number, number, number, number] = [
      I[0] * (1 - t) + targetC[0] * t,
      I[1] * (1 - t) + targetC[1] * t,
      I[2] * (1 - t) + targetC[2] * t,
      I[3] * (1 - t) + targetC[3] * t
    ];

    const eigen = eigen2x2(curC[0], curC[1], curC[3]);
    const [l1, l2] = eigen.eigenvalues;
    const s1 = Math.sqrt(l1) * 0.6 * (W / (2 * DOMAIN));
    const s2 = Math.sqrt(l2) * 0.6 * (H / (2 * DOMAIN));
    const cx = toPxX(curMean[0]);
    const cy = toPxY(curMean[1]);

    // 4. Draw Covariance Ellipse
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-eigen.angle);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
    ctx.lineWidth = 3.5;
    ctx.fillStyle = "rgba(14, 165, 233, 0.2)";
    ctx.beginPath();
    ctx.ellipse(0, 0, s1, s2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw Principal Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-s1, 0);
    ctx.lineTo(s1, 0);
    ctx.moveTo(0, -s2);
    ctx.lineTo(0, s2);
    ctx.stroke();
    ctx.restore();

    // 5. Draw Euclidean vs Natural Gradient Vectors
    // Numerical gradient at curMean
    const eps = 1e-4;
    const gradX = (fn.f(curMean[0] + eps, curMean[1]) - fn.f(curMean[0] - eps, curMean[1])) / (2 * eps);
    const gradY = (fn.f(curMean[0], curMean[1] + eps) - fn.f(curMean[0], curMean[1] - eps)) / (2 * eps);
    const gradLen = Math.hypot(gradX, gradY) || 1;
    const nGradX = gradX / gradLen;
    const nGradY = gradY / gradLen;

    // Natural gradient: C * grad
    const natGradX = curC[0] * nGradX + curC[1] * nGradY;
    const natGradY = curC[2] * nGradX + curC[3] * nGradY;
    const natLen = Math.hypot(natGradX, natGradY) || 1;
    const nNatX = natGradX / natLen;
    const nNatY = natGradY / natLen;

    const arrowScale = 65;

    // Draw Euclidean Gradient Vector (Rose)
    const euclidEndX = cx - nGradX * arrowScale;
    const euclidEndY = cy + nGradY * arrowScale;
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(euclidEndX, euclidEndY);
    ctx.stroke();

    // Draw Natural Gradient Vector (Emerald)
    if (showNaturalGrad) {
      const natEndX = cx - nNatX * arrowScale * 1.25;
      const natEndY = cy + nNatY * arrowScale * 1.25;
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(natEndX, natEndY);
      ctx.stroke();
    }

    // Mean Point
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [fn, progress, showNaturalGrad]);

  return (
    <div className="glass-card p-6 my-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">
              Covariance Metric Adaptation & Natural Gradient Alignment
            </h4>
            <p className="text-xs text-slate-400">
              Comparing Euclidean steepest descent against the covariance-transformed Natural Gradient
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(["cigar", "rosenbrock", "sphere"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setObjKey(k)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-[background-color,color,box-shadow] ${
                objKey === k
                  ? "bg-sky-500 text-white shadow-glow-sm"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {objectives[k].label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-center">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#030712] shadow-2xl">
          <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full h-auto block" />

          <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[0.68rem] font-mono">
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-0.5 bg-rose-500" />
              <span>Euclidean ∇f</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-0.5 bg-emerald-400" />
              <span>Natural Gradient C ∇f</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-950/40 rounded-2xl p-4 border border-white/5 space-y-3">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Adaptation Progress</span>
              <span className="text-sky-300 font-mono">{(progress * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              aria-label="Covariance Matrix Adaptation Progress"
              min={0}
              max={1}
              step={0.02}
              value={progress}
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
            <div className="flex justify-between text-[0.65rem] text-slate-500 font-mono">
              <span>Isotropic (C = I)</span>
              <span>Adapted (C ∝ H⁻¹)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/15 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="font-bold text-sky-200 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Why Natural Gradients Win</span>
            </div>
            <p>
              In ill-conditioned valleys, standard Euclidean descent (red) points perpendicular to the valley floor, causing catastrophic zig-zagging. The natural gradient (mint), preconditioned by covariance <LatexRenderer math="C" block={false} />, aims directly down the canyon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
