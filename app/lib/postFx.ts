// Centralized post-FX pipeline (cmaes-feat-pr7-postfx).
//
// SOTA-grounded post-processing for the photo-real household:
//   - ACES Filmic tonemap (already wired in G1WalkingFlagship.tsx and
//     HouseholdArmFlagship.tsx; this module centralizes the curve and
//     the exposure / contrast / saturation knobs so every stage can
//     share the same cinematic look).
//   - High-luminance threshold bloom (selective on emissive surfaces
//     and sunlight; contributes to the cmaes-feat-pr8-emissive "lumen-
//     style" feel).
//   - Vignette (subtle screen-edge attenuation).
//   - Chromatic aberration (subtle, edge-only).
//   - Per-stage profile (kitchen, parlor, porch) so the G1 walking through
//     the house and the arm picking up a plate both look correct.
//
// References (all SOTA, all real, all current as of 2025-2026):
//   - Narkowicz, "ACES Filmic Tone Mapping Curve" (krzysztof.narkowicz.xyz),
//     2015. The (a, b, c, d, e) coefficients here match his published fit.
//   - Karis, "Real Shading in Unreal Engine 4" (SIGGRAPH 2013) — split-sum
//     approximation for IBL; cited in Epic 1 pr3.
//   - "Filament PBR Engine" (Google 2018-2024), "Post-processing" chapter
//     — bloom + vignette + chromatic aberration guidance.
//   - three.js examples: webgl_postprocessing_* — pipeline assembly pattern.
//
// Determinism law (cmaes-mky): no wall-clock / no Math.random on the
// simulation path. Bloom + flicker are driven by the frame counter
// (deterministic given the same input). See flickerFireplace() for the
// deterministic Perlin-driven fireplace flicker.

import * as THREE from "three";

/** ACES Filmic tonemap coefficients (Narkowicz 2015). */
export const ACES_FILMIC = {
  a: 2.51,
  b: 0.03,
  c: 2.43,
  d: 0.59,
  e: 0.14,
} as const;

/** Apply the ACES Filmic curve to a linear RGB triplet. Returns sRGB-ready
 *  values in [0, 1]. */
export function acesFilmic(rgb: [number, number, number]): [number, number, number] {
  const [r, g, b] = rgb;
  return [
    clamp01((r * (ACES_FILMIC.a * r + ACES_FILMIC.b)) / (r * (ACES_FILMIC.c * r + ACES_FILMIC.d) + ACES_FILMIC.e)),
    clamp01((g * (ACES_FILMIC.a * g + ACES_FILMIC.b)) / (g * (ACES_FILMIC.c * g + ACES_FILMIC.d) + ACES_FILMIC.e)),
    clamp01((b * (ACES_FILMIC.a * b + ACES_FILMIC.b)) / (b * (ACES_FILMIC.c * b + ACES_FILMIC.d) + ACES_FILMIC.e)),
  ];
}

/** Apply the ACES curve plus an exposure multiplier. Three.js's
 *  ToneMappingPass / WebGLRenderer.toneMappingExposure path is equivalent
 *  to `acesFilmic([r*e, g*e, b*e])`. */
export function acesFilmicWithExposure(
  rgb: [number, number, number],
  exposure: number
): [number, number, number] {
  return acesFilmic([rgb[0] * exposure, rgb[1] * exposure, rgb[2] * exposure]);
}

/** Post-FX profile per stage. */
export interface PostFXProfile {
  /** Tonemap exposure (linear multiplier before ACES). */
  exposure: number;
  /** Bloom strength (0 = no bloom, 1 = full). */
  bloomStrength: number;
  /** Bloom luminance threshold (linear). */
  bloomThreshold: number;
  /** Vignette intensity (0 = off, 1 = strong). */
  vignetteIntensity: number;
  /** Chromatic aberration offset in pixels at the screen edges. */
  chromaticAberrationPx: number;
  /** Whether post-FX is enabled. */
  enabled: boolean;
}

/** Default post-FX profile (cinematic, conservative). */
export const DEFAULT_POSTFX_PROFILE: PostFXProfile = {
  exposure: 1.0,
  bloomStrength: 0.45,
  bloomThreshold: 0.85,
  vignetteIntensity: 0.18,
  chromaticAberrationPx: 1.0,
  enabled: true,
};

/** Per-stage profile defaults. */
export const POSTFX_PROFILES: Record<string, PostFXProfile> = {
  "kitchen-warm": {
    ...DEFAULT_POSTFX_PROFILE,
    exposure: 0.95,
    bloomStrength: 0.55,
    bloomThreshold: 0.80, // lower so oven light / fixtures bloom
    vignetteIntensity: 0.20,
  },
  "parlor-calm": {
    ...DEFAULT_POSTFX_PROFILE,
    exposure: 1.0,
    bloomStrength: 0.40,
    bloomThreshold: 0.90, // higher so only the lamp / fireplace bloom
    vignetteIntensity: 0.22,
  },
  "porch-bright": {
    ...DEFAULT_POSTFX_PROFILE,
    exposure: 1.15,
    bloomStrength: 0.30,
    bloomThreshold: 1.00, // only the sun blooms
    vignetteIntensity: 0.12,
  },
  "bedroom-moody": {
    ...DEFAULT_POSTFX_PROFILE,
    exposure: 0.80,
    bloomStrength: 0.55,
    bloomThreshold: 0.70, // bedside lamps bloom freely
    vignetteIntensity: 0.28,
  },
};

/** Apply the post-FX pipeline in software (no GPU) for testing. Returns
 *  the post-FX-adjusted linear RGB. Useful for headless tests. */
export function applyPostFXSoftware(
  rgb: [number, number, number],
  profile: PostFXProfile
): [number, number, number] {
  if (!profile.enabled) return rgb;
  // 1. Exposure + ACES
  const tonemapped = acesFilmicWithExposure(rgb, profile.exposure);
  // 2. Bloom (approximated as a soft additive highlight; in the real
  //    pipeline this is a separate pass on luminance > threshold).
  const luminance =
    0.2126 * tonemapped[0] + 0.7152 * tonemapped[1] + 0.0722 * tonemapped[2];
  const bloom = Math.max(0, luminance - profile.bloomThreshold) * profile.bloomStrength;
  // 3. Vignette (no-op in software; the GPU pass does the edge falloff)
  // 4. CA (no-op in software; the GPU pass does the channel split)
  return [
    tonemapped[0] + bloom,
    tonemapped[1] + bloom,
    tonemapped[2] + bloom,
  ];
}

/** Deterministic Perlin-flavored flicker for a fireplace. Uses
 *  multi-octave hash-based noise over the frame counter (no wall clock,
 *  no Math.random). Reproducible from any frame number. */
export function flickerFireplace(frame: number, baseIntensity = 1.0): number {
  // 3 octaves of integer-hashed noise. Cheap and deterministic.
  const noise1 = hash01(frame * 0.37);
  const noise2 = hash01(frame * 1.7);
  const noise3 = hash01(frame * 4.3);
  return baseIntensity * (0.85 + 0.15 * (noise1 + 0.5 * noise2 + 0.25 * noise3));
}

/** Deterministic hash → [0, 1]. Uses a 32-bit integer mixing step
 *  (splitmix32-style) and divides by 2^32 to normalize. Avoids Math.sin
 *  precision drift and Math.random. */
function hash01(n: number): number {
  // Splitmix32 finalizer (Steele, Lea & Flood 2014).
  let x = (n | 0) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  x = Math.imul(x, 0x85ebca6b) >>> 0;
  x = (x ^ (x >>> 13)) >>> 0;
  x = Math.imul(x, 0xc2b2ae35) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  return x / 0x100000000; // [0, 1)
}

/** ACES filmic to sRGB. Three.js's `THREE.SRGBColorSpace` output color
 *  space does this conversion automatically in the renderer; this
 *  helper is for software tests and offline baking. */
export function linearToSRGB(linear: number): number {
  if (linear <= 0.0031308) return linear * 12.92;
  return 1.055 * Math.pow(linear, 1.0 / 2.4) - 0.055;
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}
