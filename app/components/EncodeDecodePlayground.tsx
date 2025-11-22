"use client";

import { useMemo, useState } from "react";
import { Switch } from "@headlessui/react";
import { Layers, Shuffle, Target, Zap } from "lucide-react";

function reflect(value: number, min = 0, max = 1) {
  if (value >= min && value <= max) return value;
  const span = max - min;
  const over = value - min;
  const mod = ((over % span) + span) % span;
  const wraps = Math.floor(over / span);
  return wraps % 2 === 0 ? min + mod : max - mod;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

const categories = ["GELU", "SwiGLU", "ReLU", "Mish"] as const;

export function EncodeDecodePlayground() {
  const [continuous, setContinuous] = useState(0.6);
  const [logScale, setLogScale] = useState(true);
  const [categorical, setCategorical] = useState(0.32);
  const [reflectMode, setReflectMode] = useState(true);
  const [unbounded, setUnbounded] = useState(0.4); // normalized for demo

  const decoded = useMemo(() => {
    // Continuous bounded [1e-3, 1e1] with optional log
    const minC = 1e-3;
    const maxC = 1e1;
    const c = logScale
      ? Math.exp(Math.log(minC) + (Math.log(maxC) - Math.log(minC)) * continuous)
      : minC + (maxC - minC) * continuous;

    // Categorical split into equal intervals
    const bins = categories.length;
    const width = 1 / bins;
    const catIdx = Math.min(bins - 1, Math.floor(categorical / width));

    // Unbounded via tanh/squash; reflect if requested
    const rawUnbounded = (unbounded - 0.5) * 8; // [-4,4]
    const squashed = Math.tanh(rawUnbounded); // (-1,1)
    const mapped = (squashed + 1) / 2; // (0,1)
    const finalU = reflectMode ? reflect(mapped) : clamp(mapped);

    return { c, catIdx, finalU, mapped };
  }, [continuous, categorical, reflectMode, logScale, unbounded]);

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-glow-sm space-y-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-sky-200">
        <Layers className="h-4 w-4" /> Encode/Decode Playground
      </div>
      <p className="text-sm text-slate-300">
        Map messy real-world knobs into a clean [0,1] vector, then decode back. Late quantization keeps
        search continuous; reflection avoids wasting samples beyond bounds.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ControlBlock
            title="Continuous (learning rate proxy)"
            value={continuous}
            onChange={setContinuous}
            subtitle={logScale ? "log-scale 1e-3 → 1e1" : "linear 1e-3 → 1e1"}
            readout={decoded.c.toExponential(3)}
          />

          <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 space-y-2 text-[0.85rem] text-slate-200">
            <div className="flex items-center justify-between text-[0.8rem] text-slate-300">
              <span>Log scale</span>
              <Switch
                checked={logScale}
                onChange={setLogScale}
                className={`${logScale ? "bg-sky-500/70" : "bg-slate-700"} relative inline-flex h-5 w-10 items-center rounded-full`}
              >
                <span
                  className={`${logScale ? "translate-x-5" : "translate-x-1"} inline-block h-3 w-3 transform rounded-full bg-white`}
                />
              </Switch>
            </div>
          </div>

          <ControlBlock
            title="Categorical (activation)"
            value={categorical}
            onChange={setCategorical}
            subtitle="Intervals map to GELU / SwiGLU / ReLU / Mish"
            readout={categories[decoded.catIdx]}
          />

          <ControlBlock
            title="Unbounded (tanh squash)"
            value={unbounded}
            onChange={setUnbounded}
            subtitle="Raw in (-∞,∞) → tanh → [0,1], then reflect/clip"
            readout={decoded.finalU.toFixed(3)}
          >
            <div className="flex items-center justify-between text-[0.8rem] text-slate-300">
              <span>Reflect out-of-bounds</span>
              <Switch
                checked={reflectMode}
                onChange={setReflectMode}
                className={`${reflectMode ? "bg-emerald-500/70" : "bg-slate-700"} relative inline-flex h-5 w-10 items-center rounded-full`}
              >
                <span
                  className={`${reflectMode ? "translate-x-5" : "translate-x-1"} inline-block h-3 w-3 transform rounded-full bg-white`}
                />
              </Switch>
            </div>
          </ControlBlock>
        </div>

        <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-4 space-y-3">
          <div className="text-[0.85rem] font-semibold text-emerald-200 flex items-center gap-2">
            <Target className="h-4 w-4" /> Decoded summary
          </div>
          <div className="grid gap-2 text-[0.86rem] text-slate-200">
            <SummaryRow label="Continuous (decoded)">{decoded.c.toExponential(3)} (log {logScale ? "on" : "off"})</SummaryRow>
            <SummaryRow label="Categorical bin">{categories[decoded.catIdx]}</SummaryRow>
            <SummaryRow label="Unbounded squashed">{decoded.mapped.toFixed(3)} (pre-reflect/clip)</SummaryRow>
            <SummaryRow label="Final unbounded in [0,1]">{decoded.finalU.toFixed(3)}</SummaryRow>
          </div>
          <div className="text-[0.82rem] text-slate-300 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-300" /> Late quantization + reflection keeps CMA-ES in continuous mode as long as possible, so covariance learning isn’t broken by hard edges.
          </div>
          <div className="text-[0.78rem] text-slate-400">
            Pair this with the Practical Playbook: logit/tanh for bounds, reflect instead of reject, quantize categories late, seed everything.
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlBlock({
  title,
  subtitle,
  value,
  onChange,
  readout,
  children
}: {
  title: string;
  subtitle: string;
  value: number;
  onChange: (v: number) => void;
  readout: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-3 space-y-2">
      <div className="flex items-center justify-between text-[0.82rem] text-slate-300">
        <div>
          <div className="font-semibold text-slate-100 text-[0.9rem]">{title}</div>
          <div className="text-[0.78rem] text-slate-400">{subtitle}</div>
        </div>
        <div className="text-[0.82rem] text-sky-200 font-semibold">{readout}</div>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-sky-400"
      />
      {children}
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between rounded-lg border border-slate-800/60 bg-slate-950/60 px-3 py-2 text-[0.84rem]">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-100 font-semibold">{children}</span>
    </div>
  );
}
