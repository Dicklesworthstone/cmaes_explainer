/**
 * app/lib/colorPalette.ts
 *
 * Semantic color palette engine for Interactive Colorized Math Equations.
 * Designed for high-contrast dark themes in CMA-ES explainer.
 */

import type { ColorVariant, ColorizedEquation } from "../types/equation";

export interface ColorStyleConfig {
  name: string;
  badgeLabel: string;
  hex: string;
  textClass: string;
  badgeBg: string;
  borderClass: string;
  glowClass: string;
  activeRing: string;
  underlineClass: string;
}

export const COLOR_STYLES: Record<ColorVariant, ColorStyleConfig> = {
  crimson: {
    name: "Crimson",
    badgeLabel: "Negative Weight / Harmful Direction",
    hex: "#f87171", // Red-400
    textClass: "text-red-400",
    badgeBg: "bg-red-950/50 border-red-800/80 text-red-300",
    borderClass: "border-red-500",
    glowClass: "shadow-[0_0_16px_rgba(239,68,68,0.35)]",
    activeRing: "ring-2 ring-red-500/80 bg-red-950/80",
    underlineClass: "decoration-red-500 underline-offset-4",
  },
  sapphire: {
    name: "Sapphire",
    badgeLabel: "Candidate Offspring Sample / Point",
    hex: "#60a5fa", // Blue-400
    textClass: "text-sky-400",
    badgeBg: "bg-sky-950/50 border-sky-800/80 text-sky-300",
    borderClass: "border-sky-500",
    glowClass: "shadow-[0_0_16px_rgba(56,189,248,0.35)]",
    activeRing: "ring-2 ring-sky-500/80 bg-sky-950/80",
    underlineClass: "decoration-sky-500 underline-offset-4",
  },
  emerald: {
    name: "Emerald",
    badgeLabel: "Covariance Matrix / Curvature",
    hex: "#34d399", // Emerald-400
    textClass: "text-emerald-400",
    badgeBg: "bg-emerald-950/50 border-emerald-800/80 text-emerald-300",
    borderClass: "border-emerald-500",
    glowClass: "shadow-[0_0_16px_rgba(16,185,129,0.35)]",
    activeRing: "ring-2 ring-emerald-500/80 bg-emerald-950/80",
    underlineClass: "decoration-emerald-500 underline-offset-4",
  },
  amber: {
    name: "Amber",
    badgeLabel: "Global Step Size / Scale",
    hex: "#fbbf24", // Amber-400
    textClass: "text-amber-400",
    badgeBg: "bg-amber-950/50 border-amber-800/80 text-amber-300",
    borderClass: "border-amber-500",
    glowClass: "shadow-[0_0_16px_rgba(245,158,11,0.35)]",
    activeRing: "ring-2 ring-amber-500/80 bg-amber-950/80",
    underlineClass: "decoration-amber-500 underline-offset-4",
  },
  amethyst: {
    name: "Amethyst",
    badgeLabel: "Distribution Mean / Anchor",
    hex: "#c084fc", // Purple-400
    textClass: "text-purple-400",
    badgeBg: "bg-purple-950/50 border-purple-800/80 text-purple-300",
    borderClass: "border-purple-500",
    glowClass: "shadow-[0_0_16px_rgba(168,85,247,0.35)]",
    activeRing: "ring-2 ring-purple-500/80 bg-purple-950/80",
    underlineClass: "decoration-purple-500 underline-offset-4",
  },
  cyan: {
    name: "Cyan",
    badgeLabel: "Gaussian White Noise Source",
    hex: "#22d3ee", // Cyan-400
    textClass: "text-cyan-400",
    badgeBg: "bg-cyan-950/50 border-cyan-800/80 text-cyan-300",
    borderClass: "border-cyan-500",
    glowClass: "shadow-[0_0_16px_rgba(6,182,212,0.35)]",
    activeRing: "ring-2 ring-cyan-500/80 bg-cyan-950/80",
    underlineClass: "decoration-cyan-500 underline-offset-4",
  },
  coral: {
    name: "Coral",
    badgeLabel: "Rank-Based Selection Weight",
    hex: "#fb923c", // Orange-400
    textClass: "text-orange-400",
    badgeBg: "bg-orange-950/50 border-orange-800/80 text-orange-300",
    borderClass: "border-orange-500",
    glowClass: "shadow-[0_0_16px_rgba(249,115,22,0.35)]",
    activeRing: "ring-2 ring-orange-500/80 bg-orange-950/80",
    underlineClass: "decoration-orange-500 underline-offset-4",
  },
  rose: {
    name: "Rose",
    badgeLabel: "Evolution Path / Momentum Memory",
    hex: "#fb7185", // Rose-400
    textClass: "text-rose-400",
    badgeBg: "bg-rose-950/50 border-rose-800/80 text-rose-300",
    borderClass: "border-rose-500",
    glowClass: "shadow-[0_0_16px_rgba(244,63,94,0.35)]",
    activeRing: "ring-2 ring-rose-500/80 bg-rose-950/80",
    underlineClass: "decoration-rose-500 underline-offset-4",
  },
  teal: {
    name: "Teal",
    badgeLabel: "Eigenvector Principal Axes Matrix",
    hex: "#2dd4bf", // Teal-400
    textClass: "text-teal-400",
    badgeBg: "bg-teal-950/50 border-teal-800/80 text-teal-300",
    borderClass: "border-teal-500",
    glowClass: "shadow-[0_0_16px_rgba(20,184,166,0.35)]",
    activeRing: "ring-2 ring-teal-500/80 bg-teal-950/80",
    underlineClass: "decoration-teal-500 underline-offset-4",
  },
};

/**
 * Returns KaTeX formatted LaTeX wrapped in \htmlData{var=id}{\htmlClass{eq-term eq-term-color eq-term-id}{\textcolor{hex}{symbol}}}
 */
export function wrapInteractiveLatexTerm(
  varId: string,
  symbolLatex: string,
  color: ColorVariant
): string {
  const cfg = COLOR_STYLES[color];
  const hex = cfg.hex;
  const classes = `eq-term eq-term-${color} eq-term-${varId}`;
  return `\\htmlData{var=${varId}}{\\htmlClass{${classes}}{\\textcolor{${hex}}{${symbolLatex}}}}`;
}

/**
 * Prepares interactive KaTeX markup for a ColorizedEquation model.
 */
export function prepareInteractiveLatex(equation: ColorizedEquation): string {
  if (equation.colorizedLatex) {
    return equation.colorizedLatex;
  }
  return equation.rawLatex;
}
