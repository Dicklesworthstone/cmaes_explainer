"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@headlessui/react";
import { Square, Wand2, MoveRight, Shuffle, Paintbrush } from "lucide-react";

const SIZE = 320;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function reflect01(v: number) {
  if (v >= 0 && v <= 1) return v;
  const span = 1;
  const over = v - 0;
  const mod = ((over % span) + span) % span;
  const wraps = Math.floor(over / span);
  return wraps % 2 === 0 ? 0 + mod : 1 - mod;
}

function logitTransform(v: number) {
  // squash from (-inf, inf) to (0,1)
  return 1 / (1 + Math.exp(-v));
}

const strategies = [
  { key: "clip", label: "Clip", desc: "Clamp to [0,1]" },
  { key: "reflect", label: "Reflect", desc: "Bounce at edges" },
  { key: "logit", label: "Logit", desc: "Optimize unconstrained, logit back" }
] as const;

type Strat = (typeof strategies)[number]["key"];

export function ConstraintRepairDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strategy, setStrategy] = useState<Strat>("reflect");
  const [seed, setSeed] = useState(7);
  const [showMean, setShowMean] = useState(true);
   const [showArrows, setShowArrows] = useState(true);

  const samples = useMemo(() => {
    const rand = rng(seed);
    const pts: { raw: [number, number]; fixed: [number, number]; mean: boolean }[] = [];
    for (let i = 0; i < 80; i++) {
      const raw: [number, number] = [rand() * 1.6 - 0.3, rand() * 1.6 - 0.3]; // overshoot box
      const fixed: [number, number] = fix(raw, strategy);
      pts.push({ raw, fixed, mean: i === 0 });
    }
    return pts;
  }, [seed, strategy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // gradient backdrop
    const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    grad.addColorStop(0, "#0b1224");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // box glow
    ctx.strokeStyle = "rgba(14,165,233,0.35)";
    ctx.lineWidth = 8;
    ctx.strokeRect(36, 36, SIZE - 72, SIZE - 72);

    // box
    ctx.strokeStyle = "rgba(148,163,184,0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, SIZE - 80, SIZE - 80);

    // draw arrows raw -> fixed for first N
    if (showArrows) {
      ctx.strokeStyle = "rgba(248,113,113,0.35)";
      ctx.lineWidth = 1.5;
      samples.slice(0, 25).forEach((s) => {
        const [rx, ry] = toPix(s.raw);
        const [fx, fy] = toPix(s.fixed);
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(fx, fy);
        ctx.stroke();
      });
    }

    // raw samples
    ctx.fillStyle = "rgba(248,113,113,0.6)";
    samples.forEach((s) => {
      const [x, y] = toPix(s.raw);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // repaired samples
    ctx.fillStyle = "rgba(34,211,238,0.9)";
    samples.forEach((s) => {
      const [x, y] = toPix(s.fixed);
      ctx.beginPath();
      ctx.arc(x, y, 4.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // mean marker
    if (showMean) {
      const meanRaw: [number, number] = [
        samples.reduce((a, s) => a + s.raw[0], 0) / samples.length,
        samples.reduce((a, s) => a + s.raw[1], 0) / samples.length
      ];
      const meanFix: [number, number] = [
        samples.reduce((a, s) => a + s.fixed[0], 0) / samples.length,
        samples.reduce((a, s) => a + s.fixed[1], 0) / samples.length
      ];
      const [rx, ry] = toPix(meanRaw);
      const [fx, fy] = toPix(meanFix);
      ctx.strokeStyle = "rgba(244,244,245,0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(fx, fy);
      ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(fx, fy, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [samples, showMean, showArrows]);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
             <Square className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">Constraint Repair</h3>
             <p className="text-xs text-slate-400">Handling bounds in black-box optimization</p>
          </div>
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="flex items-center gap-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors shadow-sm"
        >
          <Shuffle className="h-3.5 w-3.5 opacity-70" /> Resample
        </button>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
        What happens when the optimizer suggests points outside the box? Compare strategies to bring them back.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="relative group">
           <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 to-sky-500/20 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
           <canvas ref={canvasRef} width={SIZE} height={SIZE} className="relative w-full rounded-xl border border-white/10 bg-[#0B1121] shadow-inner" />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {strategies.map((s) => (
              <button
                key={s.key}
                onClick={() => setStrategy(s.key)}
                className={`rounded-xl border px-3 py-3 text-center text-xs font-semibold transition-all duration-300 ${
                  strategy === s.key
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "border-white/5 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="mb-1">{s.label}</div>
                <div className="text-[0.65rem] opacity-70 font-normal">{s.desc}</div>
              </button>
            ))}
          </div>

          <div className="space-y-4 bg-slate-950/30 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span className="flex items-center gap-2"><Wand2 className="h-4 w-4 text-amber-400" /> Show Mean Shift</span>
              <Switch
                checked={showMean}
                onChange={setShowMean}
                className={`${showMean ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-slate-700"} group relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300`}
              >
                 <span className={`${showMean ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300`} />
              </Switch>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span className="flex items-center gap-2"><Paintbrush className="h-4 w-4 text-sky-400" /> Show Repair Vectors</span>
              <Switch
                checked={showArrows}
                onChange={setShowArrows}
                className={`${showArrows ? "bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.4)]" : "bg-slate-700"} group relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300`}
              >
                <span className={`${showArrows ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300`} />
              </Switch>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900/40 p-4 border border-white/5 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-2">
               <MoveRight className="h-3.5 w-3.5 text-slate-500" />
               Analysis
            </div>
            <ul className="space-y-1.5 list-disc pl-4 marker:text-slate-600">
              <li><strong>Clip:</strong> Simplest, but piles samples on the boundary.</li>
              <li><strong>Reflect:</strong> Preserves density near edges; good default.</li>
              <li><strong>Logit:</strong> Search in unconstrained space; mathematically cleanest.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function fix([x, y]: [number, number], strat: Strat): [number, number] {
  if (strat === "clip") return [clamp01(x), clamp01(y)];
  if (strat === "reflect") return [reflect01(x), reflect01(y)];
  // logit: assume internal search unbounded; here we just squash
  return [logitTransform(x * 3 - 1.5), logitTransform(y * 3 - 1.5)];
}

function toPix([x, y]: [number, number]) {
  const px = (val: number) => 40 + clamp01(val) * (SIZE - 80);
  const py = (val: number) => 40 + (1 - clamp01(val)) * (SIZE - 80);
  return [px(x), py(y)] as [number, number];
}
