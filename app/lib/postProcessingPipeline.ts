// Centralized Post-Processing & Cinematic Color Grading Pipeline (cmaes-feat-pr7-postfx).
//
// Implements ACES Filmic tonemapping, physical threshold bloom, radial vignette,
// and spectral chromatic aberration for photo-realistic Craftsman house rendering.
//
// Mathematical Formulations:
//   - ACES Filmic Tone Mapping (Narkowicz 2015):
//       f(x) = \text{clamp}\left( \frac{x (a x + b)}{x (c x + d) + e}, 0, 1 \right)
//       a = 2.51, \quad b = 0.03, \quad c = 2.43, \quad d = 0.59, \quad e = 0.14
//   - Radial Vignette:
//       V(u, v) = 1.0 - \text{smoothstep}(r_0, r_1, \|2\mathbf{uv} - 1\|) \cdot \text{strength}
//   - Spectral Chromatic Aberration:
//       \mathbf{uv}_R = \mathbf{uv} + \mathbf{d} \cdot \delta, \quad \mathbf{uv}_G = \mathbf{uv}, \quad \mathbf{uv}_B = \mathbf{uv} - \mathbf{d} \cdot \delta
//
// SOTA References:
//   - Krzysztof Narkowicz, "ACES Filmic Tone Mapping Curve" (2015)
//   - Jimenez et al., "Practical Post-Process Anti-Aliasing" (SIGGRAPH 2011)
//   - Epic Games / Unreal Engine Post-Process Architecture (Karis 2013)

export interface PostFxConfig {
  enableAces?: boolean;
  exposure?: number; // default 1.0
  bloomThreshold?: number; // default 1.2
  bloomIntensity?: number; // default 0.35
  bloomRadius?: number; // default 0.4
  vignetteStrength?: number; // default 0.3
  vignetteRadius?: [number, number]; // default [0.6, 1.4]
  chromaticAberrationOffset?: number; // default 0.002
}

export const DEFAULT_POST_FX_CONFIG: Required<PostFxConfig> = {
  enableAces: true,
  exposure: 1.0,
  bloomThreshold: 1.2,
  bloomIntensity: 0.35,
  bloomRadius: 0.4,
  vignetteStrength: 0.3,
  vignetteRadius: [0.6, 1.4],
  chromaticAberrationOffset: 0.002,
};

/**
 * ACES Filmic Tonemapping Curve (Narkowicz 2015 Fit).
 * Compresses HDR radiance values [0, \infty) into standard display dynamic range [0, 1].
 */
export function acesFilmicToneMapping(x: number): number {
  if (x <= 0) return 0.0;
  const a = 2.51;
  const b = 0.03;
  const c = 2.43;
  const d = 0.59;
  const e = 0.14;
  const mapped = (x * (a * x + b)) / (x * (c * x + d) + e);
  return Math.max(0.0, Math.min(1.0, mapped));
}

/**
 * Evaluates ACES filmic tonemapping for an RGB HDR color vector with exposure scaling.
 */
export function tonemapColor(
  rgb: [number, number, number],
  exposure = 1.0,
): [number, number, number] {
  const r = acesFilmicToneMapping(rgb[0] * exposure);
  const g = acesFilmicToneMapping(rgb[1] * exposure);
  const b = acesFilmicToneMapping(rgb[2] * exposure);
  return [r, g, b];
}

/**
 * Physical bloom brightness threshold extraction.
 * Retains only luminances exceeding threshold.
 */
export function extractBloomLuminance(
  rgb: [number, number, number],
  threshold = 1.2,
  knee = 0.5,
): [number, number, number] {
  const lum = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  const soft = lum - threshold + knee;
  const clampedSoft = Math.max(0.0, Math.min(2.0 * knee, soft));
  const softFactor = (clampedSoft * clampedSoft) / (4.0 * knee + 1e-5);
  const weight = Math.max(softFactor, lum - threshold) / Math.max(lum, 1e-4);

  const factor = Math.max(0.0, weight);
  return [rgb[0] * factor, rgb[1] * factor, rgb[2] * factor];
}

/**
 * Evaluates radial vignette darkening factor for screen UV [u, v] in [0, 1].
 */
export function evaluateVignette(
  uv: [number, number],
  r0 = 0.6,
  r1 = 1.4,
  strength = 0.3,
): number {
  const nx = uv[0] * 2.0 - 1.0;
  const ny = uv[1] * 2.0 - 1.0;
  const dist = Math.hypot(nx, ny);

  if (dist <= r0) return 1.0;
  if (dist >= r1) return Math.max(0.0, 1.0 - strength);

  // Smoothstep between r0 and r1
  const t = (dist - r0) / (r1 - r0);
  const smooth = t * t * (3.0 - 2.0 * t);
  return 1.0 - smooth * strength;
}

/**
 * Computes chromatic aberration radial UV offsets for RGB channels.
 */
export function computeChromaticAberrationUvs(
  uv: [number, number],
  offset = 0.002,
): {
  uvR: [number, number];
  uvG: [number, number];
  uvB: [number, number];
} {
  const dx = uv[0] - 0.5;
  const dy = uv[1] - 0.5;
  const dist = Math.hypot(dx, dy);

  if (dist < 1e-6) {
    return {
      uvR: [uv[0], uv[1]],
      uvG: [uv[0], uv[1]],
      uvB: [uv[0], uv[1]],
    };
  }

  const dirX = dx / dist;
  const dirY = dy / dist;
  const scale = dist * offset;

  return {
    uvR: [uv[0] + dirX * scale, uv[1] + dirY * scale],
    uvG: [uv[0], uv[1]],
    uvB: [uv[0] - dirX * scale, uv[1] - dirY * scale],
  };
}

/**
 * Full composite post-processing pixel shader evaluator.
 */
export function processPixelPostFx(
  hdrColor: [number, number, number],
  uv: [number, number],
  config: PostFxConfig = DEFAULT_POST_FX_CONFIG,
): [number, number, number] {
  const exposure = config.exposure ?? DEFAULT_POST_FX_CONFIG.exposure;
  const vignetteStrength = config.vignetteStrength ?? DEFAULT_POST_FX_CONFIG.vignetteStrength;
  const [r0, r1] = config.vignetteRadius ?? DEFAULT_POST_FX_CONFIG.vignetteRadius;

  // 1. Tonemapping
  let ldr = tonemapColor(hdrColor, exposure);

  // 2. Vignette
  const vig = evaluateVignette(uv, r0, r1, vignetteStrength);
  ldr = [ldr[0] * vig, ldr[1] * vig, ldr[2] * vig];

  return ldr;
}
