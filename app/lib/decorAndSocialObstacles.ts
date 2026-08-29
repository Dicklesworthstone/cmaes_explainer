// Household Decor & Dynamic Social Silhouette Obstacle Engine (cmaes-feat-fg9-decor / cmaes-feat-oa11-soft).
//
// Implements physical decor item parameters (tipping thresholds, fragile collision response)
// alongside Helbing-Molnar anisotropic Gaussian social force fields and velocity-aware
// Control Barrier Functions for pedestrian and pet dynamic silhouettes.
//
// Mathematical Formulations:
//   - Anisotropic Gaussian Social Force Potential (Helbing & Molnar 1995, Ferrer et al. 2014):
//       \mathbf{\Delta} = \mathbf{x} - \mathbf{p}_i, \quad \mathbf{\Delta}_{\text{body}} = \mathbf{R}(-\theta_i) \mathbf{\Delta}
//       V_{\text{social}}(\mathbf{x}) = A \exp\left( -\frac{1}{2} \left[ \left(\frac{\Delta x_{\text{body}}}{\sigma_{\text{front}}}\right)^2 + \left(\frac{\Delta z_{\text{body}}}{\sigma_{\text{side}}}\right)^2 \right] \right)
//   - Social Velocity-Aware Barrier Function:
//       h_{\text{social}}(\mathbf{x}, \mathbf{v}) = \|\mathbf{x} - \mathbf{p}_i\| - R_{\text{comfort}} - \tau_{\text{react}} \max(0, -(\mathbf{x} - \mathbf{p}_i) \cdot \mathbf{v}_{\text{rel}})
//   - Decor Object Tipping & Fragility Threshold:
//       M_{\text{tip}} = m g r_{\text{base}}, \quad \tau_{\text{applied}} = \|\mathbf{r}_{\text{impact}} \times \mathbf{F}_{\text{impact}}\| > M_{\text{tip}} \implies \text{Tipping}
//
// SOTA References:
//   - Helbing & Molnar, "Social Force Model for Pedestrian Dynamics" (Phys. Rev. E 1995)
//   - Ferrer, Garrell, & Sanfeliu, "Robot Companion: A Social-Aware Navigational Framework" (IROS 2014)
//   - Mavrogiannis et al., "Core Challenges of Socially Compliant Robot Navigation" (ACM Trans. HRI 2023)

export type DecorKind =
  | "potted-plant"
  | "floor-lamp"
  | "picture-frame"
  | "table-vase";

export type SilhouetteKind =
  | "pedestrian-standing"
  | "pedestrian-walking"
  | "pet-dog"
  | "pet-cat";

export interface DecorObjectSpec {
  id: string;
  kind: DecorKind;
  position: [number, number, number]; // [x, y, z]
  massKg: number;
  baseRadius: number; // Base footprint radius for tipping stability
  height: number;
  isFragile: boolean;
  tippingTorqueThreshold: number; // N*m = mass * g * baseRadius
}

export interface SilhouetteAgent {
  id: string;
  kind: SilhouetteKind;
  position: [number, number]; // [x, z]
  velocity: [number, number]; // [vx, vz]
  headingYaw: number; // radians
  comfortRadius: number; // meters (e.g. 0.8m for human, 0.5m for pet)
  sigmaFront: number; // Anisotropic forward buffer (e.g. 1.2m)
  sigmaSide: number; // Anisotropic side buffer (e.g. 0.6m)
  amplitude: number; // Peak potential weight (e.g. 10.0)
}

const GRAVITY = 9.81;

export const DEFAULT_SILHOUETTE_PROFILES: Record<SilhouetteKind, Omit<SilhouetteAgent, "id" | "position">> = {
  "pedestrian-standing": {
    kind: "pedestrian-standing",
    velocity: [0.0, 0.0],
    headingYaw: 0.0,
    comfortRadius: 0.75,
    sigmaFront: 0.85,
    sigmaSide: 0.65,
    amplitude: 8.0,
  },
  "pedestrian-walking": {
    kind: "pedestrian-walking",
    velocity: [0.8, 0.0],
    headingYaw: 0.0,
    comfortRadius: 0.90,
    sigmaFront: 1.40, // Larger forward comfort zone when moving
    sigmaSide: 0.70,
    amplitude: 12.0,
  },
  "pet-dog": {
    kind: "pet-dog",
    velocity: [0.5, 0.0],
    headingYaw: 0.0,
    comfortRadius: 0.55,
    sigmaFront: 0.90,
    sigmaSide: 0.50,
    amplitude: 7.0,
  },
  "pet-cat": {
    kind: "pet-cat",
    velocity: [0.0, 0.0],
    headingYaw: 0.0,
    comfortRadius: 0.40,
    sigmaFront: 0.60,
    sigmaSide: 0.40,
    amplitude: 5.0,
  },
};

/**
 * Creates an interactive decor object with physical mass and tipping threshold.
 */
export function createDecorObject(
  id: string,
  kind: DecorKind,
  position: [number, number, number],
  massKg?: number,
  baseRadius?: number,
  height?: number,
): DecorObjectSpec {
  let defaultMass = 3.0;
  let defaultBaseR = 0.15;
  let defaultHeight = 0.8;
  let isFragile = false;

  switch (kind) {
    case "floor-lamp":
      defaultMass = 5.5;
      defaultBaseR = 0.18;
      defaultHeight = 1.65;
      isFragile = false;
      break;
    case "potted-plant":
      defaultMass = 8.0;
      defaultBaseR = 0.16;
      defaultHeight = 0.90;
      isFragile = false;
      break;
    case "table-vase":
      defaultMass = 1.2;
      defaultBaseR = 0.06;
      defaultHeight = 0.35;
      isFragile = true;
      break;
    case "picture-frame":
      defaultMass = 1.5;
      defaultBaseR = 0.05;
      defaultHeight = 0.50;
      isFragile = true;
      break;
  }

  const m = massKg ?? defaultMass;
  const r = baseRadius ?? defaultBaseR;
  const h = height ?? defaultHeight;

  return {
    id,
    kind,
    position,
    massKg: m,
    baseRadius: r,
    height: h,
    isFragile,
    tippingTorqueThreshold: m * GRAVITY * r,
  };
}

/**
 * Evaluates whether an applied impact force at contact height causes tipping.
 */
export function checkDecorTipping(
  decor: DecorObjectSpec,
  impactForceN: number,
  impactHeightY: number,
): { willTip: boolean; appliedTorqueNm: number; tippingThresholdNm: number } {
  const arm = Math.max(0.05, impactHeightY - decor.position[1]);
  const appliedTorque = impactForceN * arm;
  const threshold = decor.tippingTorqueThreshold;

  return {
    willTip: appliedTorque > threshold,
    appliedTorqueNm: appliedTorque,
    tippingThresholdNm: threshold,
  };
}

/**
 * Evaluates anisotropic Gaussian social potential and spatial gradient.
 */
export function evaluateSocialPotential(
  queryPos: [number, number],
  agent: SilhouetteAgent,
): {
  potential: number;
  gradient: [number, number]; // \nabla V (pushes away)
} {
  const dx = queryPos[0] - agent.position[0];
  const dz = queryPos[1] - agent.position[1];

  const cosY = Math.cos(agent.headingYaw);
  const sinY = Math.sin(agent.headingYaw);

  // Transform offset into agent's forward/lateral body coordinates
  const fwd = dx * cosY + dz * sinY;
  const lat = -dx * sinY + dz * cosY;

  const sFwd = fwd >= 0 ? agent.sigmaFront : agent.sigmaSide; // Asymmetric front/rear
  const sLat = agent.sigmaSide;

  const expArg = -0.5 * ((fwd / sFwd) ** 2 + (lat / sLat) ** 2);
  const potential = agent.amplitude * Math.exp(Math.max(-20, expArg));

  // Gradient in body frame: \nabla V_body = [ - (fwd / sFwd^2) * V, - (lat / sLat^2) * V ]
  const dV_dfwd = -(fwd / (sFwd * sFwd)) * potential;
  const dV_dlat = -(lat / (sLat * sLat)) * potential;

  // Transform gradient back to world coords: \nabla V_world = R(theta) \nabla V_body
  const gradX = dV_dfwd * cosY - dV_dlat * sinY;
  const gradZ = dV_dfwd * sinY + dV_dlat * cosY;

  return {
    potential,
    gradient: [gradX, gradZ],
  };
}

/**
 * Evaluates dynamic social distance Control Barrier Function.
 */
export function evaluateSocialCbf(
  robotPos: [number, number],
  robotVel: [number, number],
  agent: SilhouetteAgent,
  reactionTimeSeconds = 0.5,
): {
  hSocial: number;
  gradSocial: [number, number];
  isSafe: boolean;
} {
  const dx = robotPos[0] - agent.position[0];
  const dz = robotPos[1] - agent.position[1];
  const dist = Math.hypot(dx, dz) || 1e-4;

  const relVx = robotVel[0] - agent.velocity[0];
  const relVz = robotVel[1] - agent.velocity[1];

  // Closing speed: -dot(delta_pos / dist, delta_v)
  const closingSpeed = Math.max(0.0, -((dx / dist) * relVx + (dz / dist) * relVz));
  const dynamicBuffer = agent.comfortRadius + reactionTimeSeconds * closingSpeed;

  const hSocial = dist - dynamicBuffer;
  const gradSocial: [number, number] = [dx / dist, dz / dist];

  return {
    hSocial,
    gradSocial,
    isSafe: hSocial >= 0.0,
  };
}
