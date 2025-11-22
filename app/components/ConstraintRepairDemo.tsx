"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@headlessui/react";
import { Square, Wand2, MoveRight } from "lucide-react";

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
    ctx.fillStyle = "#0b1224";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // box
    ctx.strokeStyle = "rgba(148,163,184,0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, SIZE - 80, SIZE - 80);

    // raw samples
    ctx.fillStyle = "rgba(248,113,113,0.5)";
    samples.forEach((s) => {
      const [x, y] = toPix(s.raw);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // repaired samples
    ctx.fillStyle = "rgba(34,211,238,0.85)";
    samples.forEach((s) => {
      const [x, y] = toPix(s.fixed);
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
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
  }, [samples, showMean]);

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-sky-200">
          <Square className="h-4 w-4" /> Constraint repair demo
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[0.78rem] text-slate-200 hover:border-sky-400/70"
        >
          <Shuffle className="h-3.5 w-3.5" /> Resample
        </button>
      </div>
      <p className="text-sm text-slate-300">
        Overshoot the box, then repair. Compare clip, reflect, and logit-transform strategies. Mean shift
        (yellow→green) shows how repair affects the search distribution.
      </p>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="w-full rounded-xl border border-slate-800/70 bg-slate-950" />
        <div className="space-y-3 text-[0.88rem] text-slate-200">
          <div className="grid grid-cols-3 gap-2">
            {strategies.map((s) => (
              <button
                key={s.key}
                onClick={() => setStrategy(s.key)}
                className={`rounded-xl border px-3 py-2 text-center text-[0.8rem] font-semibold transition ${
                  strategy === s.key
                    ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-100"
                    : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-sky-400/60"
                }`}
              >
                <div>{s.label}</div>
                <div className="text-[0.72rem] text-slate-400">{s.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-[0.82rem] text-slate-300">
            <span className="flex items-center gap-1"><Wand2 className="h-4 w-4 text-amber-300" /> Show mean shift</span>
            <Switch
              checked={showMean}
              onChange={setShowMean}
              className={`${showMean ? "bg-emerald-500/70" : "bg-slate-700"} relative inline-flex h-5 w-10 items-center rounded-full`}
            >
              <span className={`${showMean ? "translate-x-5" : "translate-x-1"} inline-block h-3 w-3 transform rounded-full bg-white`} />
            </Switch>
          </div>
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 text-[0.82rem] text-slate-300 space-y-1">
            <div className="font-semibold text-slate-100 text-[0.88rem]">When to use which</div>
            <ul className="space-y-1 list-disc pl-4">
              <li>Clip: simplest, but piles samples on the boundary—can mislead covariance.</li>
              <li>Reflect: preserves density near edges; usually best default.</li>
              <li>Logit: keep sampling unbounded internally; decode via logit to respect bounds.</li>
            </ul>
            <div className="text-[0.78rem] text-slate-400 flex items-center gap-1">
              <MoveRight className="h-3.5 w-3.5" /> Pair with encode/decode and noise explorer to see end-to-end effects.
            </div>
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
  const px = (x) => 40 + clamp01(x) * (SIZE - 80);
  const py = (y) => 40 + (1 - clamp01(y)) * (SIZE - 80);
  return [px(x), py(y)] as [number, number];
}
