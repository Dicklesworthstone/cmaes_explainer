"use client";

import { useMemo } from "react";

export interface ConvergencePoint {
  generation: number;
  bestObjective: number;
  sigma: number;
}

export function ConvergenceChart({
  data,
  width = 600,
  height = 200,
  label = "CMA-ES convergence",
}: {
  data: ConvergencePoint[];
  width?: number;
  height?: number;
  label?: string;
}) {
  const chart = useMemo(() => {
    if (data.length < 2) return null;
    const objectives = data.map((d) => d.bestObjective);
    const sigmas = data.map((d) => d.sigma);
    const generations = data.map((d) => d.generation);
    const objMin = Math.min(...objectives);
    const objMax = Math.max(...objectives);
    const objRange = objMax - objMin || 1;
    const objPad = objRange * 0.1;
    const sigMin = Math.min(...sigmas);
    const sigMax = Math.max(...sigmas);
    const sigRange = sigMax - sigMin || 1;
    const genMin = generations[0];
    const genMax = generations[generations.length - 1];
    const genRange = genMax - genMin || 1;
    const m = { top: 20, right: 50, bottom: 30, left: 60 };
    const cw = width - m.left - m.right;
    const ch = height - m.top - m.bottom;
    const xs = (g: number) => m.left + ((g - genMin) / genRange) * cw;
    const yso = (v: number) => m.top + ch - ((v - (objMin - objPad)) / (objRange + 2 * objPad)) * ch;
    const yss = (v: number) => m.top + ch - ((v - sigMin) / (sigRange + 1e-10)) * ch;
    const objPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xs(d.generation).toFixed(1)},${yso(d.bestObjective).toFixed(1)}`).join(" ");
    const sigPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xs(d.generation).toFixed(1)},${yss(d.sigma).toFixed(1)}`).join(" ");
    const areaPath = objPath + ` L${xs(genMax).toFixed(1)},${(m.top + ch).toFixed(1)} L${xs(genMin).toFixed(1)},${(m.top + ch).toFixed(1)} Z`;
    const ticks: Array<{ v: number; y: number }> = [];
    for (let i = 0; i <= 4; i++) {
      const v = objMin - objPad + (objRange + 2 * objPad) * (i / 4);
      ticks.push({ v, y: yso(v) });
    }
    return { objPath, sigPath, areaPath, ticks, xs, yso, genMin, genMax, objMin, objMax, m, cw, ch };
  }, [data, width, height]);

  if (!chart) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-xs text-slate-500" style={{ width, height }}>
        {label}: waiting for optimization data…
      </div>
    );
  }

  const { objPath, sigPath, areaPath, ticks, genMin, genMax, m, cw, ch } = chart;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</span>
        <div className="flex gap-3 text-[0.6rem] font-mono">
          <span className="text-cyan-300">▬ objective ↓</span>
          <span className="text-amber-300/70">┈ sigma (right)</span>
        </div>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {ticks.map(({ v, y }, i) => (
          <line key={`g-${i}`} x1={m.left} x2={m.left + cw} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}
        <path d={areaPath} fill="rgba(34,211,238,0.08)" stroke="none" />
        <path d={sigPath} fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth={1.2} strokeDasharray="4,3" />
        <path d={objPath} fill="none" stroke="#22d3ee" strokeWidth={2} strokeLinejoin="round" />
        <line x1={m.left} x2={m.left + cw} y1={m.top + ch} y2={m.top + ch} stroke="rgba(255,255,255,0.15)" />
        <line x1={m.left} x2={m.left} y1={m.top} y2={m.top + ch} stroke="rgba(255,255,255,0.15)" />
        {ticks.map(({ v, y }, i) => (
          <text key={`yl-${i}`} x={m.left - 6} y={y + 3} textAnchor="end" fontSize={9} fill="#64748b" fontFamily="monospace">
            {v.toExponential(1)}
          </text>
        ))}
        <text x={m.left} y={m.top + ch + 14} textAnchor="start" fontSize={9} fill="#64748b" fontFamily="monospace">gen {genMin}</text>
        <text x={m.left + cw} y={m.top + ch + 14} textAnchor="end" fontSize={9} fill="#64748b" fontFamily="monospace">gen {genMax}</text>
      </svg>
    </div>
  );
}
