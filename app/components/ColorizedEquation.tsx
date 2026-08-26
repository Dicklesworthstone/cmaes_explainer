/**
 * app/components/ColorizedEquation.tsx
 *
 * Interactive Colorized Math Equation Component for CMA-ES Explainer.
 * Implements the BetterExplained dual-coding pedagogical approach with two-way token hover and inspection.
 */
"use client";

import {
  Activity,
  ChevronDown,
  ChevronUp,
  Info,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Zap,
  Copy,
  Check
} from "lucide-react";
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { LatexRenderer } from "./LatexRenderer";
import type { ColorizedEquation as ColorizedEquationModel, EquationVariable } from "../types/equation";
import { COLOR_STYLES, prepareInteractiveLatex } from "../lib/colorPalette";

interface ColorizedEquationProps {
  equation: ColorizedEquationModel;
  initialActiveVariableId?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export function ColorizedEquation({
  equation,
  initialActiveVariableId,
  defaultExpanded = true,
  className = "",
}: ColorizedEquationProps) {
  const compId = useId().replace(/:/g, "");
  const [activeVarId, setActiveVarId] = useState<string | null>(
    initialActiveVariableId ?? (equation.variables[0]?.id || null)
  );
  const [pinnedVarId, setPinnedVarId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [copied, setCopied] = useState<boolean>(false);

  const formulaRef = useRef<HTMLDivElement>(null);

  // Active variable object
  const activeVar: EquationVariable | undefined = useMemo(() => {
    return equation.variables.find((v) => v.id === activeVarId);
  }, [equation.variables, activeVarId]);

  // Prepare interactive KaTeX markup
  const interactiveLatex = useMemo(() => {
    return prepareInteractiveLatex(equation);
  }, [equation]);

  const handleSelectVar = useCallback((id: string, pin = false) => {
    setActiveVarId(id);
    if (pin) setPinnedVarId(id);
  }, []);

  const handleReset = useCallback(() => {
    setActiveVarId(equation.variables[0]?.id ?? null);
    setPinnedVarId(null);
  }, [equation.variables]);

  const handleCopyLatex = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(equation.rawLatex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [equation.rawLatex]);

  const handleFormulaMouseLeave = useCallback(() => {
    if (pinnedVarId) {
      setActiveVarId(pinnedVarId);
    }
  }, [pinnedVarId]);

  // Interactive formula event delegation: hover on any KaTeX term inside equation
  const handleFormulaMouseOver = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = (e.target as HTMLElement).closest("[data-var], [class*='eq-term-']");
      if (!target) return;
      let varId = target.getAttribute("data-var");
      if (!varId && typeof target.className === "string") {
        const match = target.className.match(/\beq-term-([a-zA-Z0-9_-]+)\b/);
        if (match) varId = match[1];
      }
      if (varId) {
        const matchingVar = equation.variables.find(
          (v) =>
            v.id === varId ||
            v.id.toLowerCase() === varId?.toLowerCase() ||
            varId?.startsWith(`var_${v.id}`) ||
            v.id.includes(varId || "")
        );
        if (matchingVar) {
          setActiveVarId(matchingVar.id);
        }
      }
    },
    [equation.variables]
  );

  // Interactive formula event delegation: click on any KaTeX term inside equation
  const handleFormulaClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = (e.target as HTMLElement).closest("[data-var], [class*='eq-term-']");
      if (!target) return;
      let varId = target.getAttribute("data-var");
      if (!varId && typeof target.className === "string") {
        const match = target.className.match(/\beq-term-([a-zA-Z0-9_-]+)\b/);
        if (match) varId = match[1];
      }
      if (varId) {
        const matchingVar = equation.variables.find(
          (v) =>
            v.id === varId ||
            v.id.toLowerCase() === varId?.toLowerCase() ||
            varId?.startsWith(`var_${v.id}`) ||
            v.id.includes(varId || "")
        );
        if (matchingVar) {
          handleSelectVar(matchingVar.id, true);
        }
      }
    },
    [equation.variables, handleSelectVar]
  );

  // Sync active CSS classes inside KaTeX DOM when activeVarId changes
  useEffect(() => {
    const container = formulaRef.current;
    if (!container) return;

    // Clear previous active states
    const allTerms = container.querySelectorAll(".eq-term");
    allTerms.forEach((el) => {
      el.classList.remove("eq-term-active");
    });

    if (activeVarId) {
      const activeTerms = container.querySelectorAll(
        `[data-var="${activeVarId}"], .eq-term-${activeVarId}`
      );
      activeTerms.forEach((el) => {
        el.classList.add("eq-term-active");
      });
    }
  }, [activeVarId]);

  return (
    <div
      id={`eq-card-${compId}`}
      className={`glass-card p-6 md:p-8 space-y-6 border-white/10 ${className}`}
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[0.65rem] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20">
              {equation.category}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">Interactive Formula</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1 font-display">
            {equation.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLatex}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
            title="Copy raw LaTeX equation"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>LaTeX</span>
              </>
            )}
          </button>

          {pinnedVarId && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-white/10 transition-colors"
              title="Reset variable selection"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/60 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Inspect ({equation.variables.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Equation Display */}
      <div className="space-y-4">
        <div
          ref={formulaRef}
          onMouseOver={handleFormulaMouseOver}
          onMouseLeave={handleFormulaMouseLeave}
          onClick={handleFormulaClick}
          className="relative overflow-x-auto rounded-2xl bg-[#030712]/90 border border-white/10 p-4 sm:p-6 md:p-8 text-center select-none shadow-2xl transition-all"
        >
          <div className="text-lg sm:text-2xl md:text-3xl font-serif text-white tracking-wide">
            <LatexRenderer math={interactiveLatex} block={true} />
          </div>

          <div className="mt-3 text-[0.7rem] font-mono text-slate-500 flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Hover or click any colored variable in the equation to inspect its physical meaning</span>
          </div>
        </div>

        {/* Plain-English Dual Coding Sentence */}
        <div className="rounded-2xl bg-slate-950/60 border border-white/5 p-4 text-sm text-slate-300 leading-relaxed flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 mt-0.5 shrink-0">
            <Info className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Plain-English Translation:
            </span>
            <p className="text-slate-200">
              {equation.plainEnglishSentence.map((frag, idx) => {
                if (!frag.variableId) {
                  return <span key={idx}>{frag.text}</span>;
                }
                const v = equation.variables.find((x) => x.id === frag.variableId);
                const isActive = activeVarId === frag.variableId;
                const cfg = v ? COLOR_STYLES[v.color] : null;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectVar(frag.variableId!, true)}
                    onMouseEnter={() => handleSelectVar(frag.variableId!)}
                    className={`inline font-bold px-1 py-0.5 mx-0.5 rounded transition-all cursor-pointer ${
                      isActive
                        ? `${cfg?.badgeBg || "bg-sky-500/20"} ${cfg?.textClass || "text-sky-300"} ring-1 ${cfg?.borderClass || "border-sky-400"}`
                        : `${cfg?.textClass || "text-sky-400"} hover:bg-white/5`
                    }`}
                  >
                    {frag.text}
                  </button>
                );
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Variable Breakdown & Inspection Drawer */}
      {isExpanded && (
        <div className="space-y-6 pt-2 border-t border-white/10">
          {/* Quick Variable Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {equation.variables.map((v) => {
              const isActive = activeVarId === v.id;
              const cfg = COLOR_STYLES[v.color];
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelectVar(v.id, true)}
                  onMouseEnter={() => handleSelectVar(v.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? `${cfg.badgeBg} border-${v.color}-500/80 shadow-glow-sm scale-105`
                      : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cfg.hex }}
                  />
                  <span className="font-mono font-bold text-white">{v.symbol}</span>
                  <span className="text-slate-300 text-[0.7rem]">{v.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Variable Spotlight Card */}
          {activeVar && (
            <div
              className={`rounded-2xl border p-5 md:p-6 space-y-4 transition-all duration-300 bg-slate-950/70 ${
                COLOR_STYLES[activeVar.color].borderClass
              } ${COLOR_STYLES[activeVar.color].glowClass}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-base font-bold text-white border shadow-inner"
                    style={{
                      backgroundColor: `${COLOR_STYLES[activeVar.color].hex}22`,
                      borderColor: COLOR_STYLES[activeVar.color].hex,
                    }}
                  >
                    {activeVar.symbol}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2 font-display">
                      <span>{activeVar.name}</span>
                      <span
                        className={`text-[0.65rem] font-mono px-2 py-0.5 rounded-full border ${COLOR_STYLES[activeVar.color].badgeBg}`}
                      >
                        {COLOR_STYLES[activeVar.color].badgeLabel}
                      </span>
                    </h4>
                    {activeVar.dimension && (
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Dimension: {activeVar.dimension}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-white/5">
                  Symbol: <span className="text-white font-bold">{activeVar.symbol}</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 text-xs">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-slate-400 block text-[0.68rem]">
                    Algorithmic Role
                  </span>
                  <p className="text-slate-200 leading-relaxed">{activeVar.role}</p>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-sky-400 block text-[0.68rem]">
                    Physical Intuition
                  </span>
                  <p className="text-slate-200 leading-relaxed">{activeVar.intuition}</p>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-emerald-400 block text-[0.68rem]">
                    Key Behavior
                  </span>
                  <p className="text-slate-200 leading-relaxed">{activeVar.keyBehavior}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pedagogical Note Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/30 via-slate-950/40 to-indigo-950/30 border border-sky-500/20 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-300 font-bold uppercase tracking-wide text-[0.7rem]">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Pedagogical Takeaway</span>
            </div>
            <p className="leading-relaxed">{equation.pedagogicalNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}
