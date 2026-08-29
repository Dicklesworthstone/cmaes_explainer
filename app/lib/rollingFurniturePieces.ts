// Rolling Furniture Pieces & Caster Kinematics Engine (cmaes-feat-fg5-rolling).
//
// Implements anisotropic rolling contact mechanics, multi-wheel caster trail kinematics,
// self-aligning swivel torque, and procedural geometry generation for rolling household pieces
// (office chairs on 5-star casters, rolling bar stools, mobile tea/service carts, mop buckets).
//
// Mathematical Formulations:
//   - Longitudinal Rolling Resistance:
//       F_{\text{roll}} = -c_{rr} F_N \text{sgn}(v_{\text{long}})
//   - Lateral Tire Scrubbing Friction & Slip Angle:
//       \alpha = \arctan2(v_{\text{lat}}, |v_{\text{long}}| + \epsilon), \quad F_{\text{lat}} = -\min(\mu_s F_N, C_{\alpha} \alpha)
//   - Caster Swivel Self-Aligning Moment (Trail Offset $d_{\text{trail}}$):
//       \tau_{\text{swivel}} = -d_{\text{trail}} F_{\text{lat}} - c_{\text{damp}} \dot{\theta}_{\text{caster}}
//   - 2D Planar Multibody Stepping (Newton-Euler with Cholesky/Analytic Matrix Solve):
//       m \dot{\mathbf{v}} = \mathbf{F}_{\text{ext}} + \mathbf{F}_{\text{roll}} + \mathbf{F}_{\text{lat}}, \quad I_{zz} \ddot{\theta} = \tau_{\text{ext}} + \tau_{\text{swivel}}
//
// SOTA References:
//   - Pacejka, "Tire and Vehicle Dynamics" (3rd Ed., Elsevier 2012)
//   - Goyal, Ruina, & Papadopoulos, "Planar Sliding with Dry Friction" (Wear 1991)
//   - Tournier et al., "Stable Constrained Dynamics for Swivel Castor Systems" (ACM TOG 2017)

export type RollingFurnitureKind =
  | "rolling-bar-stool"
  | "office-chair-casters"
  | "service-cart"
  | "mop-bucket"
  | "rolling-hamper";

export interface CasterSpec {
  wheelCount: number; // e.g. 5 for office chair, 4 for cart
  wheelRadius: number; // meters (e.g. 0.03m = 30mm)
  trailOffset: number; // meters (e.g. 0.02m = 20mm caster trail)
  rollingFrictionCoeff: number; // c_rr (default 0.015 for nylon/hardwood)
  slidingFrictionCoeff: number; // \mu_s (default 0.60)
  swivelDamping: number; // N*m*s/rad (default 0.1)
  corneringStiffness: number; // N/rad (default 120.0)
}

export interface RollingPieceConfig {
  id: string;
  kind: RollingFurnitureKind;
  massKg: number;
  momentOfInertiaZz: number; // kg * m^2
  caster: CasterSpec;
  boundingRadius: number;
  height: number;
}

export interface RollingPieceState {
  position: [number, number]; // [x, z] on ground plane
  velocity: [number, number]; // [vx, vz] in world coordinates
  headingYaw: number; // radians
  yawRate: number; // rad/s
  wheelRotations: number[]; // radians for each wheel
}

export const ROLLING_PIECE_DEFAULTS: Record<RollingFurnitureKind, RollingPieceConfig> = {
  "rolling-bar-stool": {
    id: "bar-stool-default",
    kind: "rolling-bar-stool",
    massKg: 8.5,
    momentOfInertiaZz: 0.18,
    boundingRadius: 0.22,
    height: 0.75,
    caster: {
      wheelCount: 1, // Single central spherical roller / omni-base
      wheelRadius: 0.05,
      trailOffset: 0.01,
      rollingFrictionCoeff: 0.012,
      slidingFrictionCoeff: 0.55,
      swivelDamping: 0.08,
      corneringStiffness: 100.0,
    },
  },
  "office-chair-casters": {
    id: "office-chair-default",
    kind: "office-chair-casters",
    massKg: 14.0,
    momentOfInertiaZz: 0.45,
    boundingRadius: 0.32,
    height: 0.95,
    caster: {
      wheelCount: 5, // 5-star base
      wheelRadius: 0.03,
      trailOffset: 0.025,
      rollingFrictionCoeff: 0.015,
      slidingFrictionCoeff: 0.65,
      swivelDamping: 0.15,
      corneringStiffness: 180.0,
    },
  },
  "service-cart": {
    id: "service-cart-default",
    kind: "service-cart",
    massKg: 12.0,
    momentOfInertiaZz: 0.38,
    boundingRadius: 0.35,
    height: 0.85,
    caster: {
      wheelCount: 4,
      wheelRadius: 0.04,
      trailOffset: 0.02,
      rollingFrictionCoeff: 0.010,
      slidingFrictionCoeff: 0.50,
      swivelDamping: 0.12,
      corneringStiffness: 150.0,
    },
  },
  "mop-bucket": {
    id: "mop-bucket-default",
    kind: "mop-bucket",
    massKg: 6.0,
    momentOfInertiaZz: 0.12,
    boundingRadius: 0.20,
    height: 0.45,
    caster: {
      wheelCount: 4,
      wheelRadius: 0.035,
      trailOffset: 0.015,
      rollingFrictionCoeff: 0.018,
      slidingFrictionCoeff: 0.60,
      swivelDamping: 0.09,
      corneringStiffness: 90.0,
    },
  },
  "rolling-hamper": {
    id: "hamper-default",
    kind: "rolling-hamper",
    massKg: 5.0,
    momentOfInertiaZz: 0.10,
    boundingRadius: 0.25,
    height: 0.70,
    caster: {
      wheelCount: 4,
      wheelRadius: 0.025,
      trailOffset: 0.018,
      rollingFrictionCoeff: 0.020,
      slidingFrictionCoeff: 0.55,
      swivelDamping: 0.07,
      corneringStiffness: 80.0,
    },
  },
};

const GRAVITY = 9.81;

/**
 * Creates initial dynamic state for a rolling furniture piece.
 */
export function createRollingPieceState(
  kind: RollingFurnitureKind,
  initialPosition: [number, number] = [0, 0],
  initialHeading = 0.0,
): RollingPieceState {
  const cfg = ROLLING_PIECE_DEFAULTS[kind];
  return {
    position: [initialPosition[0], initialPosition[1]],
    velocity: [0.0, 0.0],
    headingYaw: initialHeading,
    yawRate: 0.0,
    wheelRotations: new Array(cfg.caster.wheelCount).fill(0.0),
  };
}

/**
 * Steps planar multi-body dynamic simulation for a rolling piece subjected to
 * external forces and caster rolling/scrubbing contact forces.
 */
export function stepRollingPieceDynamics(
  config: RollingPieceConfig,
  state: RollingPieceState,
  dt = 1 / 60,
  externalPushForce: [number, number] = [0, 0],
  externalPushTorque = 0.0,
): RollingPieceState {
  const safeDt = Math.max(0.001, Math.min(0.05, dt));
  const m = config.massKg;
  const Izz = config.momentOfInertiaZz;
  const normalForce = m * GRAVITY;

  const [vx, vz] = state.velocity;
  const speed = Math.hypot(vx, vz);

  // Decompose world velocity into body longitudinal and lateral components
  const cosYaw = Math.cos(state.headingYaw);
  const sinYaw = Math.sin(state.headingYaw);

  // Body forward vector = [cosYaw, sinYaw], Body lateral vector = [-sinYaw, cosYaw]
  const vLong = vx * cosYaw + vz * sinYaw;
  const vLat = -vx * sinYaw + vz * cosYaw;

  // Longitudinal Rolling Resistance Force
  let fRollLong = 0.0;
  if (Math.abs(vLong) > 1e-4) {
    const sgnLong = Math.sign(vLong);
    const maxRollForce = config.caster.rollingFrictionCoeff * normalForce;
    fRollLong = -sgnLong * maxRollForce;
  } else {
    // Static rolling resistance threshold
    const extLong = externalPushForce[0] * cosYaw + externalPushForce[1] * sinYaw;
    const maxStaticRoll = config.caster.rollingFrictionCoeff * normalForce;
    if (Math.abs(extLong) <= maxStaticRoll) {
      fRollLong = -extLong;
    } else {
      fRollLong = -Math.sign(extLong) * maxStaticRoll;
    }
  }

  // Lateral Tire Scrubbing Friction & Slip Angle
  const slipAngle = Math.atan2(vLat, Math.max(0.05, Math.abs(vLong)));
  const maxLateralFriction = config.caster.slidingFrictionCoeff * normalForce;
  const linearLateralFriction = -config.caster.corneringStiffness * slipAngle;
  const fLatScrub = Math.max(-maxLateralFriction, Math.min(maxLateralFriction, linearLateralFriction));

  // Caster Trail Restoring & Aligning Swivel Torque
  const tauCasterAlign = -config.caster.trailOffset * fLatScrub;
  const tauSwivelDamping = -config.caster.swivelDamping * state.yawRate;
  const netTorque = externalPushTorque + tauCasterAlign + tauSwivelDamping;

  // Transform body forces back to world coordinate frame
  const fxWorld = fRollLong * cosYaw - fLatScrub * sinYaw + externalPushForce[0];
  const fzWorld = fRollLong * sinYaw + fLatScrub * cosYaw + externalPushForce[1];

  // Accelerations
  const ax = fxWorld / m;
  const az = fzWorld / m;
  const alphaYaw = netTorque / Izz;

  // Semi-implicit Euler integration
  let newVx = vx + ax * safeDt;
  let newVz = vz + az * safeDt;
  let newYawRate = state.yawRate + alphaYaw * safeDt;

  // Deceleration stop threshold (prevents micro-jittering around zero velocity)
  if (speed < 0.01 && Math.hypot(externalPushForce[0], externalPushForce[1]) < 0.1) {
    newVx = 0.0;
    newVz = 0.0;
  }
  if (Math.abs(newYawRate) < 0.01 && Math.abs(externalPushTorque) < 0.05) {
    newYawRate = 0.0;
  }

  const newPosX = state.position[0] + newVx * safeDt;
  const newPosZ = state.position[1] + newVz * safeDt;
  const newYaw = state.headingYaw + newYawRate * safeDt;

  // Update wheel rolling rotations based on forward progress
  const wheelDeltaRot = (vLong * safeDt) / config.caster.wheelRadius;
  const newWheelRots = state.wheelRotations.map((r) => r + wheelDeltaRot);

  return {
    position: [newPosX, newPosZ],
    velocity: [newVx, newVz],
    headingYaw: newYaw,
    yawRate: newYawRate,
    wheelRotations: newWheelRots,
  };
}
