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
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
          <Layers className="h-4 w-4 text-sky-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100 tracking-tight">Encode/Decode Playground</h3>
          <p className="text-xs text-slate-400">Map messy world to clean [0,1] vectors</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
        Map messy real-world knobs into a clean <code className="text-xs bg-white/10 px-1 py-0.5 rounded border border-white/10 font-mono">[0,1]</code> vector, then decode back. Late quantization keeps search continuous; reflection avoids wasting samples beyond bounds.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <ControlBlock
            title="Continuous (Learning Rate)"
            value={continuous}
            onChange={setContinuous}
            subtitle={logScale ? "Log-scale: 1e-3 → 1e1" : "Linear: 1e-3 → 1e1"}
            readout={decoded.c.toExponential(3)}
          />

          <div className="bg-slate-950/30 rounded-xl p-4 border border-white/5 flex items-center justify-between">
             <span className="text-xs text-slate-300 font-medium">Log Scale Interpolation</span>
             <Switch
                checked={logScale}
                onChange={setLogScale}
                className={`${logScale ? "bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.4)]" : "bg-slate-700"} group relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300`}
              >
                <span className={`${logScale ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300`} />
              </Switch>
          </div>

          <ControlBlock
            title="Categorical (Activation)"
            value={categorical}
            onChange={setCategorical}
            subtitle="Intervals map to GELU / SwiGLU / ReLU / Mish"
            readout={categories[decoded.catIdx]}
          />

          <ControlBlock
            title="Unbounded (Tanh Squash)"
            value={unbounded}
            onChange={setUnbounded}
            subtitle="Raw (-∞,∞) → tanh → [0,1]"
            readout={decoded.finalU.toFixed(3)}
          >
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
               <span className="text-xs text-slate-300 font-medium">Reflect Out-of-Bounds</span>
               <Switch
                  checked={reflectMode}
                  onChange={setReflectMode}
                  className={`${reflectMode ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-slate-700"} group relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300`}
                >
                  <span className={`${reflectMode ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300`} />
                </Switch>
            </div>
          </ControlBlock>
        </div>

        <div className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 rounded-2xl p-5 border border-white/5 shadow-inner space-y-4 h-fit">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-sm font-semibold text-emerald-200">
            <Target className="h-4 w-4" /> Decoded Summary
          </div>
          <div className="space-y-2.5">
            <SummaryRow label="Continuous (Decoded)">
              <span className="font-mono text-sky-300">{decoded.c.toExponential(3)}</span>
              <span className="text-slate-500 text-[0.7rem] ml-2">({logScale ? "Log" : "Lin"})</span>
            </SummaryRow>
            <SummaryRow label="Categorical Bin">
              <span className="font-mono text-amber-300">{categories[decoded.catIdx]}</span>
            </SummaryRow>
            <SummaryRow label="Unbounded Squashed">
               <span className="font-mono text-slate-300 opacity-60">{decoded.mapped.toFixed(3)}</span>
            </SummaryRow>
            <SummaryRow label="Final [0,1] Value">
               <span className="font-mono text-emerald-300 font-bold">{decoded.finalU.toFixed(3)}</span>
            </SummaryRow>
          </div>
          
          <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-slate-300 leading-relaxed">
             <div className="flex gap-2 mb-1">
                <Zap className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <strong className="text-emerald-200">Pro Tip</strong>
             </div>
             Late quantization + reflection keeps CMA-ES in continuous mode as long as possible. This prevents covariance learning from breaking on hard edges.
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
    <div className="bg-slate-950/30 rounded-xl p-4 border border-white/5 transition-all hover:bg-slate-950/40 hover:border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-slate-200 text-xs uppercase tracking-wide">{title}</div>
          <div className="text-[0.65rem] text-slate-500 font-medium mt-0.5">{subtitle}</div>
        </div>
        <div className="font-mono text-xs text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 shadow-sm">{readout}</div>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-sky-500"
      />
      {children}
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center rounded-lg bg-black/20 px-3 py-2.5 text-xs border border-white/5">
      <span className="text-slate-400 font-medium">{label}</span>
      <span>{children}</span>
    </div>
  );
}
