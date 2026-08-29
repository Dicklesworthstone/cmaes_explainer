// Risk-Aware Adaptive Safety Margin Engine (cmaes-feat-oa6-margin).
//
// Dynamically modulates Control Barrier Function (CBF) safety margins based on
// approach velocity, surface incidence angle, obstacle material fragility, and physical mass.
//
// Mathematical Formulation (MDPI Robotics 2025 / Ames CBF Framework):
//   - Braking Kinematic Margin:
//       \Delta d_{\text{vel}}(v) = \frac{\| \mathbf{v}_{\text{rel}} \|^2}{2 a_{\max}} + \tau_{\text{react}} \| \mathbf{v}_{\text{rel}} \|
//   - Normal Incidence Angle Factor:
//       \kappa_{\text{angle}}(\theta) = \max\left( \kappa_{\min}, \frac{-\mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{n}}}{\| \mathbf{v}_{\text{rel}} \|} \right) \quad (\text{if moving towards surface})
//   - Fragility Risk Factor:
//       \kappa_{\text{risk}} \in [0.75, 2.5] \quad (\text{high for glass/china/electronics, low for soft cushions})
//   - Total Composite Margin:
//       d_{\text{margin}} = d_{\text{base}} + \Delta d_{\text{vel}} \cdot \kappa_{\text{angle}} \cdot \kappa_{\text{risk}}
//
// SOTA References:
//   - MDPI Robotics, "Velocity-Adaptive Safety Envelopes for Mobile Manipulators" (2025)
//   - Ames et al., "Control Barrier Functions: Theory and Applications" (IEEE ECC 2019)
//   - Jo, Zhang, Yang, Luo, "Geometry-Aware Control Barrier Functions", ICRA 2026

import { type RiskClass } from "./furnitureTaxonomy";

export interface ObstacleRiskProfile {
  center: [number, number, number];
  velocity?: [number, number, number];
  riskClass?: RiskClass | string;
  fragility?: number; // 0 (indestructible) to 1 (shatterable crystal/glass)
  mass?: number; // kg
}

export interface DynamicMarginConfig {
  baseMargin?: number; // meters (default 0.04m)
  maxBrakingAccel?: number; // m/s^2 (default 3.0 m/s^2)
  reactionTime?: number; // seconds (default 0.05s)
  minAngleFactor?: number; // minimum scaling for glancing motion (default 0.2)
}

export const DEFAULT_MARGIN_CONFIG: Required<DynamicMarginConfig> = {
  baseMargin: 0.04,
  maxBrakingAccel: 3.5,
  reactionTime: 0.04,
  minAngleFactor: 0.25,
};

/**
 * Maps RiskClass taxonomy or custom fragility into risk multiplier \kappa_{risk}.
 */
export function getFragilityMultiplier(riskClass?: string, explicitFragility?: number): number {
  if (explicitFragility !== undefined) {
    // Linear map from [0, 1] to [0.8, 2.5]
    return 0.8 + Math.max(0, Math.min(1, explicitFragility)) * 1.7;
  }

  switch (riskClass) {
    case "hazardous":
    case "shatterable":
    case "glass":
    case "porcelain":
    case "fragile":
      return 2.2;
    case "heavy-unstable":
    case "tippable":
    case "appliance":
      return 1.7;
    case "rigid-obstacle":
    case "table":
    case "chair":
    case "wood":
      return 1.15;
    case "soft-compliant":
    case "cushion":
    case "curtain":
    case "rug":
      return 0.75;
    default:
      return 1.0;
  }
}

/**
 * Computes the risk-aware adaptive safety margin for a robot link approaching an obstacle.
 */
export function computeAdaptiveSafetyMargin(
  linkPos: [number, number, number],
  linkVel: [number, number, number],
  surfaceNormal: [number, number, number],
  obstacle: ObstacleRiskProfile,
  config: DynamicMarginConfig = DEFAULT_MARGIN_CONFIG,
): {
  margin: number;
  brakingDist: number;
  angleFactor: number;
  riskFactor: number;
} {
  const baseMargin = config.baseMargin ?? DEFAULT_MARGIN_CONFIG.baseMargin;
  const aMax = config.maxBrakingAccel ?? DEFAULT_MARGIN_CONFIG.maxBrakingAccel;
  const tau = config.reactionTime ?? DEFAULT_MARGIN_CONFIG.reactionTime;
  const minAngle = config.minAngleFactor ?? DEFAULT_MARGIN_CONFIG.minAngleFactor;

  // Relative velocity vector: v_rel = v_link - v_obstacle
  const obsVel = obstacle.velocity || [0, 0, 0];
  const rvx = linkVel[0] - obsVel[0];
  const rvy = linkVel[1] - obsVel[1];
  const rvz = linkVel[2] - obsVel[2];
  const speed = Math.hypot(rvx, rvy, rvz);

  // Pure stopping distance: v^2 / (2 * a_max) + tau * v
  const brakingDist = (speed * speed) / (2.0 * aMax) + tau * speed;

  // Approach angle factor: - (v_rel . normal) / speed
  let angleFactor = minAngle;
  if (speed > 1e-4) {
    const dotApproach = -(rvx * surfaceNormal[0] + rvy * surfaceNormal[1] + rvz * surfaceNormal[2]) / speed;
    if (dotApproach > 0) {
      angleFactor = Math.max(minAngle, dotApproach);
    }
  }

  // Risk multiplier
  const riskFactor = getFragilityMultiplier(obstacle.riskClass, obstacle.fragility);

  // Composite adaptive margin
  const margin = baseMargin + brakingDist * angleFactor * riskFactor;

  return {
    margin,
    brakingDist,
    angleFactor,
    riskFactor,
  };
}
