// Screen-Space Reflections (SSR) & Temporal Reprojection Engine (cmaes-feat-pr6-ssr).
//
// Implements screen-space ray marching with binary search refinement, Schlick Fresnel
// reflectance, screen-edge attenuation, and smooth fallback to IBL specular radiance
// for polished hardwood floors, marble countertops, and bathroom tiles.
//
// Mathematical Formulations:
//   - Reflection Vector:
//       \mathbf{R} = \mathbf{V} - 2(\mathbf{V} \cdot \mathbf{N})\mathbf{N}
//   - Schlick Fresnel Reflectance:
//       F(\theta, F_0) = F_0 + (1 - F_0)(1 - \cos\theta)^5
//   - Screen Edge Vignette / Attenuation:
//       w_{\text{edge}}(u, v) = \text{clamp}\left( 1.0 - \frac{\max(|2u-1|, |2v-1|) - 0.8}{0.2}, 0, 1 \right)
//   - Binary Search Depth Refinement:
//       \text{Repeated bisection between } t_{\text{last\_clear}} \text{ and } t_{\text{hit}} \text{ for sub-pixel precision.}
//
// SOTA References:
//   - McGuire & Mara, "Efficient GPU Screen-Space Ray Tracing" (JCGT 2014)
//   - Karis, "Real Shading in Unreal Engine 4" (SIGGRAPH 2013)
//   - Sousa et al., "Secrets of CryENGINE 3 Graphics Technology" (SIGGRAPH 2011)

export interface SsrConfig {
  maxSteps?: number; // Maximum linear ray march steps (default 64)
  binarySearchSteps?: number; // Binary search refinement steps (default 8)
  stepSize?: number; // Step size in screen UV coordinates (default 0.015)
  depthThickness?: number; // Maximum depth thickness to register a hit (default 0.05m)
  edgeFadeStart?: number; // Screen border UV fade threshold (default 0.8)
  temporalAlpha?: number; // TAA exponential moving average alpha (default 0.15)
}

export const DEFAULT_SSR_CONFIG: Required<SsrConfig> = {
  maxSteps: 64,
  binarySearchSteps: 8,
  stepSize: 0.015,
  depthThickness: 0.08,
  edgeFadeStart: 0.8,
  temporalAlpha: 0.15,
};

export interface SsrHitResult {
  hit: boolean;
  hitUv: [number, number]; // Screen UV [0..1, 0..1]
  hitDepth: number; // Depth buffer value at hit
  fresnel: number; // Schlick Fresnel factor
  reflectionWeight: number; // Final weight [0..1] combining Fresnel, edge fade, and roughness
}

/**
 * Computes exact 3D reflection vector R = V - 2(V . N)N.
 */
export function computeReflectionVector(
  viewDir: [number, number, number],
  normal: [number, number, number],
): [number, number, number] {
  const dot = viewDir[0] * normal[0] + viewDir[1] * normal[1] + viewDir[2] * normal[2];
  return [
    viewDir[0] - 2.0 * dot * normal[0],
    viewDir[1] - 2.0 * dot * normal[1],
    viewDir[2] - 2.0 * dot * normal[2],
  ];
}

/**
 * Evaluates Schlick Fresnel approximation F(theta, F0).
 */
export function evaluateSchlickFresnel(
  cosTheta: number,
  f0 = 0.04, // Default dielectric (glass/plastic/wood) F0 = 0.04
): number {
  const clampedCos = Math.max(0.0, Math.min(1.0, cosTheta));
  return f0 + (1.0 - f0) * Math.pow(1.0 - clampedCos, 5.0);
}

/**
 * Computes screen-edge fade weight to smoothly fade reflections as rays approach the viewport boundary.
 */
export function computeScreenEdgeFade(uv: [number, number], fadeStart = 0.8): number {
  const u = uv[0];
  const v = uv[1];

  if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
    return 0.0;
  }

  const dX = Math.abs(u * 2.0 - 1.0); // [0, 1] from center to edge
  const dY = Math.abs(v * 2.0 - 1.0);
  const maxD = Math.max(dX, dY);

  if (maxD <= fadeStart) {
    return 1.0;
  }

  const fadeRange = 1.0 - fadeStart;
  const factor = (1.0 - maxD) / fadeRange;
  return Math.max(0.0, Math.min(1.0, factor));
}

/**
 * Screen-space linear ray march with binary search depth refinement.
 *
 * @param startUv Screen-space start coordinate [u, v] in [0, 1].
 * @param startDepth Ray start linear camera depth.
 * @param rayDirUv Projected 2D direction of reflection ray on screen.
 * @param depthSlope Depth rate of change per unit UV travel (dz / duv).
 * @param depthSampler Function returning scene depth at [u, v].
 * @param viewNormal Surface normal at reflection point.
 * @param viewDir Direction towards camera from surface point.
 * @param roughness Material surface roughness [0, 1].
 * @param config SSR ray march parameters.
 */
export function traceScreenSpaceRay(
  startUv: [number, number],
  startDepth: number,
  rayDirUv: [number, number],
  depthSlope: number,
  depthSampler: (uv: [number, number]) => number,
  viewNormal: [number, number, number],
  viewDir: [number, number, number],
  roughness = 0.2,
  config: SsrConfig = DEFAULT_SSR_CONFIG,
): SsrHitResult {
  const maxSteps = config.maxSteps ?? DEFAULT_SSR_CONFIG.maxSteps;
  const bSteps = config.binarySearchSteps ?? DEFAULT_SSR_CONFIG.binarySearchSteps;
  const stepSize = config.stepSize ?? DEFAULT_SSR_CONFIG.stepSize;
  const thickness = config.depthThickness ?? DEFAULT_SSR_CONFIG.depthThickness;
  const edgeFadeStart = config.edgeFadeStart ?? DEFAULT_SSR_CONFIG.edgeFadeStart;

  // Compute Fresnel
  const cosTheta = Math.abs(viewDir[0] * viewNormal[0] + viewDir[1] * viewNormal[1] + viewDir[2] * viewNormal[2]);
  const fresnel = evaluateSchlickFresnel(cosTheta, 0.04);

  // Normalize screen ray direction
  const dirLen = Math.hypot(rayDirUv[0], rayDirUv[1]);
  if (dirLen < 1e-6) {
    return { hit: false, hitUv: startUv, hitDepth: startDepth, fresnel, reflectionWeight: 0.0 };
  }

  const stepU = (rayDirUv[0] / dirLen) * stepSize;
  const stepV = (rayDirUv[1] / dirLen) * stepSize;
  const stepZ = depthSlope * stepSize;

  let currU = startUv[0] + stepU;
  let currV = startUv[1] + stepV;
  let currZ = startDepth + stepZ;

  let hit = false;
  let hitU = currU;
  let hitV = currV;
  let hitZ = currZ;

  for (let i = 0; i < maxSteps; i++) {
    // Check if ray went out of screen bounds
    if (currU < 0 || currU > 1 || currV < 0 || currV > 1) {
      break;
    }

    const sceneDepth = depthSampler([currU, currV]);

    // Check if ray penetrated behind surface geometry
    if (currZ >= sceneDepth && currZ - sceneDepth <= thickness) {
      // Coarse hit found -> refine with binary search
      let lowU = currU - stepU;
      let lowV = currV - stepV;
      let lowZ = currZ - stepZ;
      let highU = currU;
      let highV = currV;
      let highZ = currZ;

      for (let b = 0; b < bSteps; b++) {
        const midU = (lowU + highU) * 0.5;
        const midV = (lowV + highV) * 0.5;
        const midZ = (lowZ + highZ) * 0.5;

        const sDepth = depthSampler([midU, midV]);
        if (midZ >= sDepth) {
          highU = midU;
          highV = midV;
          highZ = midZ;
        } else {
          lowU = midU;
          lowV = midV;
          lowZ = midZ;
        }
      }

      hit = true;
      hitU = highU;
      hitV = highV;
      hitZ = highZ;
      break;
    }

    currU += stepU;
    currV += stepV;
    currZ += stepZ;
  }

  if (!hit) {
    return {
      hit: false,
      hitUv: [currU, currV],
      hitDepth: currZ,
      fresnel,
      reflectionWeight: 0.0,
    };
  }

  // Calculate composite reflection weight
  const edgeFade = computeScreenEdgeFade([hitU, hitV], edgeFadeStart);
  const roughnessFade = Math.max(0.0, 1.0 - roughness * 1.5); // high roughness dissolves SSR into IBL
  const reflectionWeight = fresnel * edgeFade * roughnessFade;

  return {
    hit: true,
    hitUv: [hitU, hitV],
    hitDepth: hitZ,
    fresnel,
    reflectionWeight,
  };
}
