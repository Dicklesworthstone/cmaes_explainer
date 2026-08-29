// Volumetric Lighting & Exponential Height Fog Engine (cmaes-feat-pr9-volumetric).
//
// Implements Henyey-Greenstein anisotropic phase scattering, closed-form analytical
// exponential height fog integration, and raymarched volumetric sunbeams (god rays)
// streaming through window apertures into Craftsman house interiors.
//
// Mathematical Formulations:
//   - Henyey-Greenstein Phase Scattering Function (Henyey & Greenstein 1941):
//       p(\theta, g) = \frac{1}{4\pi} \frac{1 - g^2}{(1 + g^2 - 2g \cos\theta)^{3/2}}
//       g \in (-1, 1): \quad g > 0 \text{ forward scattering (sunbeams)}, \quad g = 0 \text{ isotropic}
//   - Exponential Height Fog Analytical Optical Depth:
//       \rho(y) = \rho_0 \exp\left( -b (y - y_{\text{base}}) \right)
//       \tau(\mathbf{p}_0, \mathbf{p}_1) = \int_0^L \rho(\mathbf{p}(t)) dt = \rho_0 L \frac{\exp(-b(y_0 - y_{\text{base}})) - \exp(-b(y_1 - y_{\text{base}}))}{b (y_1 - y_0)}
//       T(\mathbf{p}_0, \mathbf{p}_1) = \exp(-\tau)
//   - Volumetric In-Scattering Raymarch:
//       L_{\text{vol}} = \sum_{k=1}^M \Delta t \cdot T(0, t_k) \cdot \rho(y_k) \cdot p(\theta, g) \cdot S(\mathbf{x}_k) \cdot \mathbf{C}_{\text{sun}}
//
// SOTA References:
//   - Henyey & Greenstein, "Diffuse Radiation in the Galaxy" (ApJ 1941)
//   - Inigo Quilez, "Exponential Height Fog Formulation" (2014)
//   - Kenny Mitchell, "Volumetric Light Scattering as a Post-Process" (GPU Gems 3, 2007)
//   - Wrenninge, "Production Volume Rendering" (SIGGRAPH Course 2013)

export interface VolumetricFogConfig {
  density0?: number; // Base fog density \rho_0 at ground (default 0.02)
  heightFalloff?: number; // Density decay exponent b (default 0.5)
  groundY?: number; // Base height y_base (default 0.0)
  fogColor?: [number, number, number]; // Fog albedo (default warm haze [0.8, 0.75, 0.7])
  anisotropyG?: number; // Henyey-Greenstein g parameter (default 0.7)
  sunIntensity?: number; // Sunbeam radiance intensity (default 4.0)
  sunColor?: [number, number, number]; // Sunbeam color (default [1.0, 0.9, 0.75])
}

export const DEFAULT_FOG_CONFIG: Required<VolumetricFogConfig> = {
  density0: 0.02,
  heightFalloff: 0.5,
  groundY: 0.0,
  fogColor: [0.8, 0.75, 0.7],
  anisotropyG: 0.7,
  sunIntensity: 4.0,
  sunColor: [1.0, 0.9, 0.75],
};

/**
 * Henyey-Greenstein single-scattering phase function.
 * Evaluates angular probability density for angle theta = arccos(dot(V, L)).
 */
export function henyeyGreensteinPhase(cosTheta: number, g = 0.7): number {
  const clampedCos = Math.max(-1.0, Math.min(1.0, cosTheta));
  const g2 = g * g;
  const denom = Math.pow(1.0 + g2 - 2.0 * g * clampedCos, 1.5);
  if (denom < 1e-6) return 1.0 / (4.0 * Math.PI);
  return (1.0 / (4.0 * Math.PI)) * ((1.0 - g2) / denom);
}

/**
 * Closed-form exact analytical integration of optical depth for exponential height fog
 * along ray from p0 to p1.
 */
export function computeAnalyticalFogOpticalDepth(
  p0: [number, number, number],
  p1: [number, number, number],
  density0 = 0.02,
  heightFalloff = 0.5,
  groundY = 0.0,
): number {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const dz = p1[2] - p0[2];
  const length = Math.hypot(dx, dy, dz);

  if (length < 1e-5) return 0.0;

  const y0 = p0[1] - groundY;
  const y1 = p1[1] - groundY;

  // If ray is approximately horizontal, density is constant along ray
  if (Math.abs(dy) < 1e-4) {
    const avgY = (y0 + y1) * 0.5;
    return density0 * length * Math.exp(-heightFalloff * avgY);
  }

  // Analytical integral: \rho_0 * L * (exp(-b*y0) - exp(-b*y1)) / (b * (y1 - y0))
  const exp0 = Math.exp(-heightFalloff * y0);
  const exp1 = Math.exp(-heightFalloff * y1);
  const integral = (density0 * length * (exp0 - exp1)) / (heightFalloff * dy);

  return Math.max(0.0, integral);
}

/**
 * Evaluates exponential height fog transmittance and in-scattering for a scene point.
 */
export function applyExponentialHeightFog(
  surfaceColor: [number, number, number],
  cameraPos: [number, number, number],
  surfacePos: [number, number, number],
  config: VolumetricFogConfig = DEFAULT_FOG_CONFIG,
): [number, number, number] {
  const density0 = config.density0 ?? DEFAULT_FOG_CONFIG.density0;
  const heightFalloff = config.heightFalloff ?? DEFAULT_FOG_CONFIG.heightFalloff;
  const groundY = config.groundY ?? DEFAULT_FOG_CONFIG.groundY;
  const fogColor = config.fogColor ?? DEFAULT_FOG_CONFIG.fogColor;

  const opticalDepth = computeAnalyticalFogOpticalDepth(
    cameraPos,
    surfacePos,
    density0,
    heightFalloff,
    groundY,
  );

  const transmittance = Math.exp(-opticalDepth);

  const r = surfaceColor[0] * transmittance + fogColor[0] * (1.0 - transmittance);
  const g = surfaceColor[1] * transmittance + fogColor[1] * (1.0 - transmittance);
  const b = surfaceColor[2] * transmittance + fogColor[2] * (1.0 - transmittance);

  return [r, g, b];
}

/**
 * Raymarches in-scattered volumetric sunlight (god rays) streaming through windows.
 *
 * @param rayOrigin Camera origin [x, y, z].
 * @param rayDir Normalized view ray direction.
 * @param maxDistance Maximum travel distance (depth buffer distance).
 * @param sunDir Normalized direction pointing towards the sun.
 * @param shadowEvaluator Returns 1.0 if sunbeam is unoccluded at point, 0.0 if blocked.
 * @param steps Number of raymarch steps along ray (default 32).
 */
export function raymarchVolumetricSunbeams(
  rayOrigin: [number, number, number],
  rayDir: [number, number, number],
  maxDistance: number,
  sunDir: [number, number, number],
  shadowEvaluator: (pos: [number, number, number]) => number,
  steps = 32,
  config: VolumetricFogConfig = DEFAULT_FOG_CONFIG,
): [number, number, number] {
  const density0 = config.density0 ?? DEFAULT_FOG_CONFIG.density0;
  const heightFalloff = config.heightFalloff ?? DEFAULT_FOG_CONFIG.heightFalloff;
  const groundY = config.groundY ?? DEFAULT_FOG_CONFIG.groundY;
  const g = config.anisotropyG ?? DEFAULT_FOG_CONFIG.anisotropyG;
  const sunIntensity = config.sunIntensity ?? DEFAULT_FOG_CONFIG.sunIntensity;
  const sunColor = config.sunColor ?? DEFAULT_FOG_CONFIG.sunColor;

  const dt = maxDistance / steps;
  const cosTheta = rayDir[0] * sunDir[0] + rayDir[1] * sunDir[1] + rayDir[2] * sunDir[2];
  const phase = henyeyGreensteinPhase(cosTheta, g);

  let accumulatedRadiance: [number, number, number] = [0, 0, 0];
  let accumulatedOpticalDepth = 0.0;

  for (let i = 0; i < steps; i++) {
    const t = (i + 0.5) * dt;
    const px = rayOrigin[0] + rayDir[0] * t;
    const py = rayOrigin[1] + rayDir[1] * t;
    const pz = rayOrigin[2] + rayDir[2] * t;

    const samplePoint: [number, number, number] = [px, py, pz];
    const shadow = shadowEvaluator(samplePoint);

    if (shadow > 0.0) {
      const height = py - groundY;
      const localDensity = density0 * Math.exp(-heightFalloff * height);
      const stepOpticalDepth = localDensity * dt;
      accumulatedOpticalDepth += stepOpticalDepth;

      const transmittance = Math.exp(-accumulatedOpticalDepth);
      const stepInscatter = shadow * localDensity * phase * sunIntensity * transmittance * dt;

      accumulatedRadiance[0] += sunColor[0] * stepInscatter;
      accumulatedRadiance[1] += sunColor[1] * stepInscatter;
      accumulatedRadiance[2] += sunColor[2] * stepInscatter;
    }
  }

  return accumulatedRadiance;
}
