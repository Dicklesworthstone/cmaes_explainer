// Contact & Soft Shadows Engine (cmaes-feat-pr5-contact-shadows).
//
// Implements analytical SDF soft shadow cone tracing (Quilez/Evans), Percentage-Closer
// Soft Shadow (PCSS) penumbra estimation, and localized ground-plane contact ambient occlusion
// (Contact AO) to visually anchor robot footpads, furniture legs, and appliances onto floor surfaces.
//
// Mathematical Formulations:
//   - SDF Cone Tracing Soft Shadow (Inigo Quilez 2010 / Evans 2006):
//       S(\mathbf{x}, \mathbf{L}, k) = \text{clamp}\left( \min_{t \in [t_{\min}, t_{\max}]} \frac{k \cdot \text{SDF}(\mathbf{x} + t \mathbf{L})}{t}, 0, 1 \right)
//   - PCSS Penumbra Width (Fernando 2005):
//       w_{\text{penumbra}} = \frac{d_{\text{receiver}} - d_{\text{blocker}}}{d_{\text{blocker}}} \cdot w_{\text{light}}
//   - Local Contact AO Kernel (Grounding Occlusion):
//       A(\mathbf{x}) = 1.0 - \sum_i \alpha_i \exp\left( -\frac{\|\mathbf{x}_{xz} - \mathbf{p}_{i, xz}\|^2}{2 r_i^2} \right) \cdot \max\left( 0, 1 - \frac{y_i - y_{\text{floor}}}{h_{\max}} \right)^2
//
// SOTA References:
//   - Inigo Quilez, "Soft Shadows to Analytical Surfaces" (2010)
//   - Randima Fernando, "Percentage-Closer Soft Shadows" (SIGGRAPH 2005)
//   - Alex Evans, "Fast Approximations for Global Illumination on Dynamic Scenes" (SIGGRAPH 2006)

export interface GroundContactCaster {
  id: string;
  position: [number, number, number]; // [x, y, z] center of contact base
  radius: number; // contact patch radius
  occlusionStrength?: number; // 0..1 (default 0.85)
  fadeHeight?: number; // height above floor at which contact shadow disappears (default 0.25m)
}

export interface ShadowRayResult {
  shadowFactor: number; // 0 = fully in shadow, 1 = fully illuminated
  closestDistance: number;
  penumbraWidth: number;
}

/**
 * Evaluates soft shadow factor using analytical SDF sphere/cone tracing.
 *
 * @param origin Ray start position on receiver surface.
 * @param lightDir Normalized vector pointing towards the light source.
 * @param sdfEvaluator Signed distance field function for scene geometry.
 * @param tMin Minimum step along ray to prevent self-shadowing acne.
 * @param tMax Maximum ray travel distance.
 * @param hardness Penumbra sharpness coefficient k (typically 16 to 64).
 */
export function evaluateSdfSoftShadow(
  origin: [number, number, number],
  lightDir: [number, number, number],
  sdfEvaluator: (p: [number, number, number]) => number,
  tMin = 0.02,
  tMax = 10.0,
  hardness = 32.0,
  maxSteps = 48,
): ShadowRayResult {
  const lLen = Math.hypot(lightDir[0], lightDir[1], lightDir[2]) || 1.0;
  const lx = lightDir[0] / lLen;
  const ly = lightDir[1] / lLen;
  const lz = lightDir[2] / lLen;

  let shadow = 1.0;
  let t = tMin;
  let minDistance = Infinity;
  let blockerT = tMin;
  const effectiveLightSize = 1.0 / Math.max(1.0, hardness);

  for (let i = 0; i < maxSteps && t < tMax; i++) {
    const px = origin[0] + lx * t;
    const py = origin[1] + ly * t;
    const pz = origin[2] + lz * t;

    const d = sdfEvaluator([px, py, pz]);

    if (d < minDistance) {
      minDistance = d;
      blockerT = t;
    }

    // Inside geometry -> total shadow
    if (d < 1e-4) {
      return {
        shadowFactor: 0.0,
        closestDistance: 0.0,
        penumbraWidth: computePcssPenumbra(tMax, Math.max(tMin, t), effectiveLightSize),
      };
    }

    // Soft shadow cone angle approximation: k * d / t
    const coneFactor = (hardness * d) / t;
    if (coneFactor < shadow) {
      shadow = coneFactor;
    }

    // Step forward along ray by SDF distance (sphere tracing)
    t += Math.max(0.01, d);
  }

  const clampedShadow = Math.max(0.0, Math.min(1.0, shadow));
  const pcssFactor = computePcssPenumbra(tMax, blockerT, effectiveLightSize);
  const penumbraWidth =
    clampedShadow < 1.0 ? (1.0 - clampedShadow) * (1.0 + pcssFactor) : 0.0;

  return {
    shadowFactor: clampedShadow,
    closestDistance: minDistance,
    penumbraWidth,
  };
}

/**
 * Computes PCSS (Percentage-Closer Soft Shadows) variable penumbra width.
 */
export function computePcssPenumbra(dReceiver: number, dBlocker: number, lightSize = 0.5): number {
  if (dBlocker <= 1e-4 || dReceiver <= dBlocker) {
    return 0.0;
  }
  return ((dReceiver - dBlocker) / dBlocker) * lightSize;
}

/**
 * Evaluates high-fidelity localized Ground Contact Ambient Occlusion (Contact AO)
 * at a point on the floor plane from an array of contact casters (robot feet, furniture legs).
 *
 * @param floorPoint 3D point on the floor surface.
 * @param casters Array of contact casters (leg tips, robot feet).
 * @param groundY Floor height (default 0.0).
 * @returns Occlusion factor in [0, 1] where 1 = unoccluded, 0 = completely dark contact shadow.
 */
export function evaluateFloorContactAO(
  floorPoint: [number, number, number],
  casters: GroundContactCaster[],
  groundY = 0.0,
): number {
  let transmittance = 1.0;

  const px = floorPoint[0];
  const pz = floorPoint[2];

  for (let i = 0; i < casters.length; i++) {
    const caster = casters[i];
    const strength = Math.max(0.0, Math.min(1.0, caster.occlusionStrength ?? 0.85));
    const fadeHeight = Math.max(1e-4, caster.fadeHeight ?? 0.25);

    const h = caster.position[1] - groundY;
    // Allow slight compliant footpad penetration (-caster.radius <= h < 0) without dropping shadow
    if (h < -caster.radius || h > fadeHeight) {
      continue;
    }

    const effectiveH = Math.max(0.0, h);
    // Vertical height decay (quadratic falloff)
    const heightFactor = (1.0 - effectiveH / fadeHeight) ** 2.0;

    // Horizontal radial Gaussian kernel
    const dx = px - caster.position[0];
    const dz = pz - caster.position[2];
    const distSq = dx * dx + dz * dz;
    const sigmaSq = caster.radius * caster.radius * 2.0;

    const radialFactor = Math.exp(-distSq / (sigmaSq || 1e-4));

    const casterOcclusion = Math.max(0.0, Math.min(1.0, strength * heightFactor * radialFactor));
    transmittance *= 1.0 - casterOcclusion;
  }

  return Math.max(0.0, Math.min(1.0, transmittance));
}
