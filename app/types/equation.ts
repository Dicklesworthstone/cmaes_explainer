/**
 * app/types/equation.ts
 *
 * Type definitions for Interactive Colorized Math Equations in CMA-ES.
 * Dual-coding pedagogical model: visual math tokens, physical intuition, and plain-English mappings.
 */

export type ColorVariant =
  | "crimson"   // Rich red: active negative weights, penalty shifts, losses
  | "sapphire"  // Deep royal blue: candidate offspring x_i, raw parameter samples
  | "emerald"   // Vibrant green: covariance matrix C, eigenvalue stretching D, output
  | "amber"     // Golden amber: global step size sigma, learning rates, multipliers
  | "amethyst"  // Royal purple: distribution mean m, state centers, coordinate shift
  | "cyan"      // Electric cyan: isotropic standard Gaussian white noise z ~ N(0, I)
  | "coral"     // Radiant orange: rank-based selection weights w_i, elite clouds
  | "rose"      // Vivid rose: evolution paths p_sigma, p_c, historical momentum
  | "teal";     // Deep teal: orthogonal eigenvector rotation matrix B, principal axes

export interface EquationVariable {
  id: string;
  symbol: string;
  name: string;
  color: ColorVariant;
  role: string;
  dimension?: string;
  intuition: string;
  formulaNote?: string;
  keyBehavior?: string;
}

export interface SentenceFragment {
  text: string;
  variableId?: string;
}

export interface ColorizedEquation {
  id: string;
  title: string;
  category: string;
  rawLatex: string;
  colorizedLatex: string;
  plainEnglishSentence: SentenceFragment[];
  variables: EquationVariable[];
  pedagogicalNote: string;
  takeaway: string;
}
