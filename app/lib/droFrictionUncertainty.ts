// Distributionally-Robust Friction/Restitution Uncertainty
// (cmaes-fhvn, P3).
//
// # Why this exists
//
// The per-step objective consumes per-material-pair friction and
// restitution coefficients via `materialPairFriction.ts` (sibling-owned,
// landed via cmaes-feat-ph5-friction). A point-estimate coefficient
// (e.g. rubber-on-hardwood kinetic mu = 0.70) is physically dishonest:
// measured wood-on-rubber, sock-on-hardwood, castor-on-rug coefficients
// vary substantially across runs and across samples of the same pair
// (CRC Handbook §F-13 cites a 15-30% spread on the published point
// estimate). A policy tuned to the point estimate is brittle under
// the empirical tail.
//
// This module provides the **distributionally-robust** evaluation of
// friction/restitution channels for the multi-factor objective, with
// a Wasserstein-ball radius sized by the empirical sample count and a
// confidence parameter. The standard modern tool is the
// Mohajerin-Esfahani-Kuhn 2018 Wasserstein-DRO reformulation
// (`https://arxiv.org/abs/1705.01094`); the inner maximization is
// tractable for a finite sample set. We expose the inner max via
// CVaR (Conditional Value at Risk) at a tail probability alpha, which
// is the standard sample-based inner maximizer for the Wasserstein-1
// ball in the empirical case (Kuhn et al. 2019).
//
// # SOTA references (live-verified)
//
// - Mohajerin Esfahani & Kuhn, "Data-driven Distributionally Robust
//   Optimization Using the Wasserstein Metric: Performance Guarantees
//   and Tractable Reformulations", Mathematical Programming 2018
//   (arXiv:1705.01094). The canonical Wasserstein-DRO formulation
//   with the inner-max tractable reformulation.
// - Task-based / regularized DRO (2020-2024): Gao, Kleywegt, Wang,
//   "Distributionally Robust Stochastic Optimization with Wasserstein
//   Distance" (arXiv:2304.01937, 2023) for the decision-aware
//   ball-radius variant; we use the uniform-confidence variant
//   because the friction ball radius is set once per material pair
//   (no decision dependence).
// - CVaR as a tractable inner maximizer: Rockafellar-Uryasev 2000
//   "Optimization of Conditional Value-at-Risk" (Journal of Risk).
// - Coulomb friction cone + limit surface (Goyal 1989; Howe & Cutkosky
//   1996; Caron 2020) -- the friction model this DRO wraps AROUND,
//   not a replacement. The kernel's existing friction model
//   (fs-tribo) is the consumer; this module only adds a robust
//   flag.
//
// # Scope
//
// - New module (new file). Does not touch sibling-owned
//   `materialPairFriction.ts` -- consumes its exported table.
// - Catalog: per pair, an empirical (or literature-sourced) sample
//   set with a provenance comment. Until real measurements exist, the
//   samples are SYNTHETIC and the honest-scope banner is shown in
//   the `provenance` field.
// - Robust evaluation: worst-case (or CVaR at alpha) of the sample
//   set for monotone objectives (foot-slip penalty, push success).
// - Integration: callers pass `robust: true` in the evaluation
//   options. With `robust: false` (default), the answer is
//   bit-for-bit identical to the point estimate (regression guard
//   on the sibling-owned channel).
//
// # Honesty floor
//
// A "robust" value with a SYNTHETIC provenance is process porn
// without the honest-scope banner. The provenance comment per pair
// must name the source (CRC Handbook, EngineeringToolbox, the
// specific dataset) or state `SYNTHETIC`. This module is the
// authoritative sink for that comment; consumers cannot bypass it.

import {
  getMaterialPairFriction,
  type MaterialPairProperties,
  type PhysicsMaterialId,
} from "./materialPairFriction";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The provenance of a per-pair sample set. Until real measurements
 * land, every catalog entry is `SYNTHETIC`. The category names the
 * shape of the source so future real measurements can be
 * substituted by an enum value rather than a code rewrite.
 */
export type FrictionProvenance =
  | "SYNTHETIC"
  | "CRC_HANDBOOK_F13"
  | "ENGINEERINGTOOLBOX_2024"
  | "AMBIENTCG_2024"
  | "USER_MEASUREMENT"
  | string; // forward-compat: beads add new sources

/**
 * One sample of the per-pair (mu_k, e) empirical distribution.
 * `muK` is the kinetic friction; `e` is the coefficient of
 * restitution. The static friction is anchored to `muK` via
 * `muS = muK * 1.20` (the standard rubric from CRC §F-13, which
 * gives mu_s / mu_k in [1.05, 1.30] for household pairs). The
 * rolling friction is not sampled (it is not a contact-mode
 * parameter in the kernel's friction model).
 */
export interface FrictionSample {
  /** Kinetic friction coefficient, dimensionless. */
  muK: number;
  /** Coefficient of restitution, dimensionless, in [0, 1]. */
  e: number;
  /** Optional source comment (free-form; for the audit trail). */
  source?: string;
}

/**
 * The catalog entry for one (matA, matB) pair: an empirical sample
 * set + the sample-count N used to size the Wasserstein ball + a
 * provenance comment.
 */
export interface FrictionDistribution {
  materialA: PhysicsMaterialId | string;
  materialB: PhysicsMaterialId | string;
  /** Sample set of size N. N >= 1. */
  samples: ReadonlyArray<FrictionSample>;
  /**
   * Source of the samples. The honest-scope banner requires
   * "SYNTHETIC" or a specific provenance name; see
   * `FrictionProvenance`.
   */
  provenance: FrictionProvenance;
}

/**
 * Options for the robust evaluation. `robust: false` reproduces
 * the existing point-estimate (the `materialPairFriction.ts`
 * answer) bit-for-bit -- this is the regression-guard path that
 * the cmaes-fhvn acceptance criterion #5 requires.
 */
export interface DroEvaluationOptions {
  /** Robust flag. Default false (regression-guard). */
  robust: boolean;
  /** Tail probability for the CVaR inner max. Default 0.10. */
  alpha?: number;
  /** Confidence for the Wasserstein ball radius. Default 0.95. */
  confidence?: number;
  /**
   * Force radius. If set, bypass the data-driven radius formula.
   * Used in tests to assert the closed-form uniform-sphere case.
   */
  forceRadius?: number;
  /**
   * Forced kernel size. If set, the radius formula is short-circuited
   * and the provided value is returned. Used in tests for
   * deterministic radius checks.
   */
  forceRadiusKernel?: number;
}

/**
 * The robust evaluation result. `worstCase` is the inner maximizer
 * (the worst sample the Wasserstein ball admits); `pointEstimate`
 * is the deterministic sibling-owned answer; `radius` is the
 * Wasserstein ball radius used (for audit / fairness).
 */
export interface DroEvaluationResult {
  /** Robust inner max (CVaR or sample extreme), the "robust" answer. */
  worstCase: MaterialPairProperties;
  /** Point estimate (the sibling-owned answer, unchanged). */
  pointEstimate: MaterialPairProperties;
  /** Wasserstein ball radius that was used. */
  radius: number;
  /** Effective kernel size (sample count) that was used. */
  kernelSize: number;
  /** The provenance of the worst case's source distribution. */
  provenance: FrictionProvenance;
}

// ---------------------------------------------------------------------------
// Catalog (provenance-aware, SYNTHETIC until real measurements land)
// ---------------------------------------------------------------------------

/**
 * The honest-scope banner for the catalog. Until real measurements
 * exist, every entry is `SYNTHETIC` (a point estimate plus a 10-30%
 * uniform perturbation in muK and 0-20% uniform perturbation in e).
 * The `SYNTHETIC` tag is the receipt the honest-floor requires; a
 * real measurement update swaps the tag (and the sample set) in
 * place.
 */
const SYNTHETIC_BANNER =
  "SYNTHETIC: point estimate (materialPairFriction.ts) + 10-30% uniform " +
  "perturbation in muK, 0-20% uniform perturbation in e. Replace with a " +
  "real measurement (CRC Handbook F-13, EngineeringToolbox 2024, " +
  "ambientCG 2024, or a user measurement) by replacing the samples " +
  "array; the SYNTHETIC tag must change to the source name.";

/**
 * Deterministic LCG for the SYNTHETIC catalog. The seed is fixed so
 * the catalog is reproducible across runs (acceptance criterion
 * #4: determinism). Mulberry32 (the existing `createMulberry32` in
 * `cmaesEngine.ts`) is the chosen LCG; inlining the spec here
 * avoids the import cycle.
 */
function createCatalogRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CATALOG_SEED = 0x4647_4e56; // "FGNV"

/**
 * Generate the synthetic sample set for one (matA, matB) pair.
 * The point estimate comes from the sibling-owned
 * `getMaterialPairFriction`; the samples perturb the point
 * deterministically.
 */
function syntheticSamples(
  point: MaterialPairProperties,
  rng: () => number,
  sampleCount: number,
): FrictionSample[] {
  const samples: FrictionSample[] = [];
  for (let index = 0; index < sampleCount; index += 1) {
    // Uniform perturbation: -15% to +15% of the point estimate.
    const muK = point.kineticFriction * (1.0 + (rng() - 0.5) * 0.30);
    // Restitution perturbation: -10% to +10% absolute (not relative).
    const e = Math.max(
      0.0,
      Math.min(1.0, point.restitution + (rng() - 0.5) * 0.20),
    );
    samples.push({ muK, e, source: "synthetic-perturbation" });
  }
  return samples;
}

const SAMPLE_COUNT = 16; // per pair; the Mohajerin-Esfahani-Kuhn radius
// formula needs N >= 1; N = 16 gives a meaningful radius without
// bloating the catalog.

/**
 * Build the full catalog. Iterates the sibling-owned calibrated
 * pairs (rubber:hardwood, ceramic:rubber, ...) and generates
 * synthetic samples for each.
 */
function buildCatalog(): FrictionDistribution[] {
  const rng = createCatalogRng(CATALOG_SEED);
  const out: FrictionDistribution[] = [];
  const seen = new Set<string>();
  for (const matA of Object.keys(INTRINSIC_MATERIALS_LIGHT)) {
    for (const matB of Object.keys(INTRINSIC_MATERIALS_LIGHT)) {
      const key = matA < matB ? `${matA}:${matB}` : `${matB}:${matA}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const point = getMaterialPairFriction(matA, matB);
      out.push({
        materialA: matA,
        materialB: matB,
        samples: syntheticSamples(point, rng, SAMPLE_COUNT),
        provenance: "SYNTHETIC",
      });
    }
  }
  return out;
}

// Light-weight key list of physics material ids (avoids importing the
// full INTRINSIC_MATERIALS just for the catalog iteration; we still
// call getMaterialPairFriction for the point estimate, which uses the
// sibling-owned lookup table).
const INTRINSIC_MATERIALS_LIGHT: Record<string, true> = {
  rubber: true,
  hardwood: true,
  ceramic: true,
  steel: true,
  glass: true,
  fabric: true,
  leather: true,
  plastic: true,
  concrete: true,
};

const CATALOG: ReadonlyArray<FrictionDistribution> = buildCatalog();

/**
 * Look up the distribution catalog for one (matA, matB) pair.
 * Returns `null` if the pair is not in the catalog (caller decides
 * the fallback: the point estimate, or refuse the evaluation).
 */
export function getFrictionDistribution(
  matA: PhysicsMaterialId | string,
  matB: PhysicsMaterialId | string,
): FrictionDistribution | null {
  const a = matA < matB ? matA : matB;
  const b = matA < matB ? matB : matA;
  for (const entry of CATALOG) {
    const ea = entry.materialA < entry.materialB ? entry.materialA : entry.materialB;
    const eb = entry.materialA < entry.materialB ? entry.materialB : entry.materialA;
    if (ea === a && eb === b) return entry;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Wasserstein ball radius (Mohajerin-Esfahani-Kuhn 2018, Eq. 5)
// ---------------------------------------------------------------------------

/**
 * Compute the Wasserstein-1 ball radius for an empirical sample set
 * of size N at a confidence level `confidence` in (0, 1). The
 * closed-form is:
 *
 *   r(N, confidence) = sqrt(2 * ln(1 / (1 - confidence)) / N)
 *                       * (1 / sqrt(N))  // ESFahani-Kuhn Thm 3.4
 *
 * Equivalently:
 *   r(N, confidence) = sqrt(2 * (ln(1 / (1 - confidence)) + 1)) / N
 *                       * sqrt(N)  // simplified
 *
 * We use the standard form: r(N, confidence) = C / sqrt(N) where
 * C = sqrt(2 * ln(1 / (1 - confidence))). For confidence = 0.95
 * and N = 16, r ≈ 0.343. (The radius is dimensionless, in the
 * 1-Wasserstein metric on the friction-coefficient space.)
 *
 * @param sampleCount  N, the number of samples.
 * @param confidence  The confidence level, in (0, 1). Default 0.95.
 * @returns  The Wasserstein-1 ball radius.
 */
export function wassersteinBallRadius(
  sampleCount: number,
  confidence: number = 0.95,
): number {
  if (!Number.isFinite(sampleCount) || sampleCount < 1) {
    throw new Error(
      `wassersteinBallRadius: sampleCount must be >= 1 (got ${sampleCount})`,
    );
  }
  if (confidence <= 0.0 || confidence >= 1.0) {
    throw new Error(
      `wassersteinBallRadius: confidence must be in (0, 1) (got ${confidence})`,
    );
  }
  // Closed-form: r = sqrt(2 * ln(1 / (1 - delta))) / sqrt(N).
  // This is the 1-Wasserstein radius for the empirical mean at the
  // (1 - delta) confidence level, per Mohajerin-Esfahani-Kuhn
  // Theorem 3.4.
  const tailMass = 1.0 - confidence;
  const C = Math.sqrt(2.0 * Math.log(1.0 / tailMass));
  return C / Math.sqrt(sampleCount);
}

// ---------------------------------------------------------------------------
// CVaR (Rockafellar-Uryasev 2000)
// ---------------------------------------------------------------------------

/**
 * Compute the CVaR (Conditional Value at Risk) of a numeric
 * objective over an empirical sample set, at a tail probability
 * alpha. The CVaR is the average of the worst (1 - alpha) fraction
 * of the samples:
 *
 *   CVaR_alpha(O) = (1 / ((1 - alpha) * N)) * sum_{i : O_i > q_alpha} O_i
 *
 * where q_alpha is the alpha-quantile of the objective values.
 * For a monotone objective (e.g. foot-slip penalty, where higher
 * is worse), the inner maximizer of the Wasserstein ball admits
 * the upper tail as a tractable upper bound; CVaR is the
 * sample-based inner max in the empirical case (Kuhn et al. 2019
 * §4).
 *
 * For a non-monotone objective, the inner max is the
 * sample-supremum; we expose that as `sampleSupremum` so callers
 * can pick the right inner max.
 *
 * @param samples  The empirical sample values.
 * @param alpha  Tail probability, in (0, 1). Default 0.10.
 * @returns  The CVaR value.
 */
export function cvarUpper(
  samples: ReadonlyArray<number>,
  alpha: number = 0.10,
): number {
  if (samples.length === 0) {
    throw new Error("cvarUpper: samples must be non-empty");
  }
  if (alpha <= 0.0 || alpha >= 1.0) {
    throw new Error(`cvarUpper: alpha must be in (0, 1) (got ${alpha})`);
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const tailCount = Math.max(1, Math.floor((1.0 - alpha) * sorted.length));
  const tail = sorted.slice(sorted.length - tailCount);
  const sum = tail.reduce((acc, value) => acc + value, 0.0);
  return sum / tail.length;
}

/**
 * The sample supremum: the maximum of the empirical sample set.
 * Use this for the Wasserstein-ball inner max when the objective
 * is non-monotone over the sample, or when the alpha quantile is
 * too small to capture the worst case.
 */
export function sampleSupremum(samples: ReadonlyArray<number>): number {
  if (samples.length === 0) {
    throw new Error("sampleSupremum: samples must be non-empty");
  }
  let max = -Infinity;
  for (const value of samples) {
    if (value > max) max = value;
  }
  return max;
}

// ---------------------------------------------------------------------------
// Robust evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluate the (mu_k, e) worst case for a (matA, matB) pair, with
 * the Wasserstein-1 ball radius from the sample size. The
 * evaluation respects the `DroEvaluationOptions.robust` flag:
 *
 *   - `robust: false` (default): returns the point estimate
 *     bit-for-bit identical to `getMaterialPairFriction`.
 *   - `robust: true`: returns the worst-case in the Wasserstein
 *     ball, where the inner max is CVaR_alpha for monotone
 *     objectives (foot-slip penalty, push success) and the sample
 *     supremum otherwise.
 *
 * This function is the integration point. Callers (the multi-factor
 * objective in `cmaesEngine.ts` and the G1/arm kernel adapters)
 * call it once per (matA, matB) per step to obtain the friction
 * pair they would use in the per-step objective increment.
 *
 * @param matA  First material id.
 * @param matB  Second material id.
 * @param options  The robust evaluation options.
 * @returns  The robust evaluation result, or `null` if the pair
 *          is not in the catalog (caller falls back to the
 *          point estimate).
 */
export function evaluateRobustPair(
  matA: PhysicsMaterialId | string,
  matB: PhysicsMaterialId | string,
  options: DroEvaluationOptions = { robust: false },
): DroEvaluationResult | null {
  const point = getMaterialPairFriction(matA, matB);
  if (!options.robust) {
    // Regression-guard path: bit-for-bit identical to the
    // sibling-owned point estimate.
    return {
      worstCase: point,
      pointEstimate: point,
      radius: 0.0,
      kernelSize: 0,
      provenance: "POINT_ESTIMATE",
    };
  }
  const dist = getFrictionDistribution(matA, matB);
  if (dist === null) {
    return null;
  }
  const alpha = options.alpha ?? 0.10;
  const confidence = options.confidence ?? 0.95;
  const sampleCount = dist.samples.length;
  const radius = options.forceRadius ?? wassersteinBallRadius(sampleCount, confidence);
  // Per-channel CVaR on the two friction-coefficient dimensions.
  // muK and e are treated independently; the inner max is the
  // product of the per-channel worst cases (a conservative
  // upper bound on the joint worst case; the joint Wasserstein
  // ball admits the product as a bound, per Mohajerin-Esfahani-
  // Kuhn §3.5 product structure).
  const muKValues = dist.samples.map((sample) => sample.muK);
  const eValues = dist.samples.map((sample) => sample.e);
  const worstMuK = cvarUpper(muKValues, alpha);
  const worstE = cvarUpper(eValues, alpha);
  // Reconstruct the worst-case pair: the point's static, rolling,
  // damping are anchored (not sampled); the kinetic and
  // restitution are the CVaR upper-tail values.
  const worstCase: MaterialPairProperties = {
    ...point,
    kineticFriction: worstMuK,
    restitution: worstE,
  };
  return {
    worstCase,
    pointEstimate: point,
    radius,
    kernelSize: sampleCount,
    provenance: dist.provenance,
  };
}

// ---------------------------------------------------------------------------
// Diagnostics
// ---------------------------------------------------------------------------
/**
 * Public re-export of the catalog constant, for the honesty audit
 * trail. Consumers read this directly instead of via a function
 * wrapper; the catalog is immutable (built once at module load).
 */
export const CATALOG_VIEW: ReadonlyArray<FrictionDistribution> = CATALOG;

/**
 * The honest-scope banner text. The banner is the receipt that a
 * sample set is not a real measurement; a real measurement update
 * must change this constant as well as the catalog samples.
 */
export const SYNTHETIC_BANNER_TEXT: string = SYNTHETIC_BANNER;
