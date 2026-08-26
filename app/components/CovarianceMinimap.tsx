"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sliders, Activity, Compass, ArrowRight, Sparkles } from "lucide-react";
import { eigen2x2 } from "../lib/cmaesEngine";

const WIDTH = 380;
const HEIGHT = 260;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const toPxX = (x: number) => ((x + DOMAIN) / (2 * DOMAIN)) * W;
    const toPxY = (y: number) => H - ((y + DOMAIN) / (2 * DOMAIN)) * H;
    const toCoordX = (px: number) => (px / W) * (2 * DOMAIN) - DOMAIN;
    const toCoordY = (py: number) => ((H - py) / H) * (2 * DOMAIN) - DOMAIN;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Heatmap Contours
    const imgData = ctx.createImageData(W, H);
    for (let py = 0; py < H; py += 2) {
      const y = toCoordY(py);
      for (let px = 0; px < W; px += 2) {
        const x = toCoordX(px);
        const v = fn.f(x, y);
        const norm = Math.tanh(v / 30);

        const r = Math.floor(10 + 15 * norm);
        const g = Math.floor(25 + 75 * (1 - norm));
        const b = Math.floor(45 + 120 * (1 - norm));

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

    // 2. Draw Subtle Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
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

    ctx.strokeStyle = "rgba(56, 189, 248, 0.95)";
    ctx.lineWidth = 2.5;
    ctx.fillStyle = "rgba(14, 165, 233, 0.15)";

    ctx.beginPath();
    ctx.ellipse(0, 0, s1, s2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Principal axes
    ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-s1, 0);
    ctx.lineTo(s1, 0);
    ctx.moveTo(0, -s2);
    ctx.lineTo(0, s2);
    ctx.stroke();

    ctx.restore();

    // 5. Draw Euclidean Gradient (Red) vs Natural Gradient (Mint)
    const eps = 1e-4;
    const f0 = fn.f(curMean[0], curMean[1]);
    const gx = (fn.f(curMean[0] + eps, curMean[1]) - f0) / eps;
    const gy = (fn.f(curMean[0], curMean[1] + eps) - f0) / eps;

    // Euclidean downhill direction
    const euclid = [-gx, -gy];
    const euclidNorm = Math.hypot(euclid[0], euclid[1]) || 1;
    const euclidUnit: [number, number] = [euclid[0] / euclidNorm, euclid[1] / euclidNorm];

    // Natural gradient direction: C * (-grad)
    const nat = [
      curC[0] * euclid[0] + curC[1] * euclid[1],
      curC[2] * euclid[0] + curC[3] * euclid[1]
    ];
    const natNorm = Math.hypot(nat[0], nat[1]) || 1;
    const natUnit: [number, number] = [nat[0] / natNorm, nat[1] / natNorm];

    const arrowLen = 50;

    // Draw Euclidean Arrow (Rose / Red)
    const exX = cx + euclidUnit[0] * arrowLen;
    const exY = cy - euclidUnit[1] * arrowLen;
    ctx.strokeStyle = "#f43f5e";
    ctx.fillStyle = "#f43f5e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(exX, exY);
    ctx.stroke();

    // Draw Natural Gradient Arrow (Mint / Emerald)
    if (showNaturalGrad) {
      const nxX = cx + natUnit[0] * arrowLen * 1.2;
      const nxY = cy - natUnit[1] * arrowLen * 1.2;
      ctx.strokeStyle = "#34d399";
      ctx.fillStyle = "#34d399";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nxX, nxY);
      ctx.stroke();
    }

    // Mean Point
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
    ctx.fill();
  }, [objKey, progress, showNaturalGrad, fn]);

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
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
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
              In ill-conditioned valleys, standard Euclidean descent (red) points perpendicular to the valley floor, causing catastrophic zig-zagging. The natural gradient (mint), preconditioned by covariance $C$, aims directly down the canyon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
