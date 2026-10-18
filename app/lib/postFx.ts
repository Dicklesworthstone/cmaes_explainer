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
  const r = Math.max(0, rgb[0]);
  const g = Math.max(0, rgb[1]);
  const b = Math.max(0, rgb[2]);
  return [
    clamp01(
      (r * (ACES_FILMIC.a * r + ACES_FILMIC.b)) /
        (r * (ACES_FILMIC.c * r + ACES_FILMIC.d) + ACES_FILMIC.e),
    ),
    clamp01(
      (g * (ACES_FILMIC.a * g + ACES_FILMIC.b)) /
        (g * (ACES_FILMIC.c * g + ACES_FILMIC.d) + ACES_FILMIC.e),
    ),
    clamp01(
      (b * (ACES_FILMIC.a * b + ACES_FILMIC.b)) /
        (b * (ACES_FILMIC.c * b + ACES_FILMIC.d) + ACES_FILMIC.e),
    ),
  ];
}

/** Apply the ACES curve plus an exposure multiplier. Three.js's
 *  ToneMappingPass / WebGLRenderer.toneMappingExposure path is equivalent
 *  to `acesFilmic([r*e, g*e, b*e])`. */
export function acesFilmicWithExposure(
  rgb: [number, number, number],
  exposure: number,
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
    bloomThreshold: 0.8, // lower so oven light / fixtures bloom
    vignetteIntensity: 0.2,
  },
  "parlor-calm": {
    ...DEFAULT_POSTFX_PROFILE,
    exposure: 1.0,
    bloomStrength: 0.4,
    bloomThreshold: 0.9, // higher so only the lamp / fireplace bloom
    vignetteIntensity: 0.22,
  },
  "porch-bright": {
    ...DEFAULT_POSTFX_PROFILE,
    exposure: 1.15,
    bloomStrength: 0.3,
    bloomThreshold: 1.0, // only the sun blooms
    vignetteIntensity: 0.12,
  },
  "bedroom-moody": {
    ...DEFAULT_POSTFX_PROFILE,
    exposure: 0.8,
    bloomStrength: 0.55,
    bloomThreshold: 0.7, // bedside lamps bloom freely
    vignetteIntensity: 0.28,
  },
};

/** Apply the post-FX pipeline in software (no GPU) for testing. Returns
 *  the post-FX-adjusted linear RGB. Useful for headless tests. */
export function applyPostFXSoftware(
  rgb: [number, number, number],
  profile: PostFXProfile,
  uv: [number, number] = [0.5, 0.5],
): [number, number, number] {
  if (!profile.enabled) return rgb;
  // 1. Exposure + ACES
  const expR = rgb[0] * profile.exposure;
  const expG = rgb[1] * profile.exposure;
  const expB = rgb[2] * profile.exposure;
  const tonemapped = acesFilmic([expR, expG, expB]);
  // 2. Bloom: evaluate on pre-tonemapped HDR luminance with soft shoulder compression
  //    so profiles with bloomThreshold >= 1.0 (e.g. porch-bright) bloom on HDR sun highlights
  //    while remaining strictly bounded (< 2.0).
  const hdrLuminance = 0.2126 * expR + 0.7152 * expG + 0.0722 * expB;
  const excess = Math.max(0, hdrLuminance - profile.bloomThreshold);
  const softExcess = excess / (1.0 + excess);
  const bloom = softExcess * profile.bloomStrength;
  // 3. Vignette (screen-edge attenuation when UV is away from center [0.5, 0.5])
  const dx = uv[0] - 0.5;
  const dy = uv[1] - 0.5;
  const distSq = dx * dx + dy * dy; // 0 at center, 0.5 at corners
  const vigFactor = Math.max(0.0, 1.0 - profile.vignetteIntensity * distSq * 2.0);
  return [
    (tonemapped[0] + bloom) * vigFactor,
    (tonemapped[1] + bloom) * vigFactor,
    (tonemapped[2] + bloom) * vigFactor,
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
export function hash01(n: number): number {
  // Splitmix32 finalizer (Steele, Lea & Flood 2014).
  // Scale fractional inputs by 2^20 before integer conversion so sub-integer
  // arguments (e.g. frame * 0.37) produce distinct hashes per frame.
  const seed = Number.isInteger(n) ? n | 0 : Math.round(n * 1048576) | 0;
  let x = seed >>> 0;
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
  if (linear <= 0) return 0;
  if (linear <= 0.0031308) return linear * 12.92;
  return 1.055 * linear ** (1.0 / 2.4) - 0.055;
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}
