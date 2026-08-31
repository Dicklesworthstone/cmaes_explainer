// Mecanum-wheel inverse kinematics for the KUKA KMR iiwa base.
//
// SOTA / textbook references:
// - Killpack, "A Brief Overview of the Omnidirectional WMR (Mecanum
//   Wheel)" (Carnegie Mellon University, 2012). The canonical IK
//   formula for a 4-wheel mecanum base is on page 4.
// - Diegel, Baduch, Fultot, "Improving Mobile Robot Wheel Performance
//   by Combining Mecanum and Legged Suspension" (IJIRA 2018).
//
// Convention (matching kmrGeometry.ts):
// - The KMR base frame has +x forward, +y left, +z up.
// - The 4 wheels are at:
//     FL: (+a, +b) (front-left)
//     FR: (+a, -b) (front-right)
//     RL: (-a, +b) (rear-left)
//     RR: (-a, -b) (rear-right)
//   where a = wheelbase_x / 2, b = wheelbase_y / 2.
//
// The standard 4-wheel mecanum IK (Killpack 2012, eq. 1) is:
//   omega_FL = (1/r) * (v_x - v_y - omega * (a + b))
//   omega_FR = (1/r) * (v_x + v_y + omega * (a + b))
//   omega_RL = (1/r) * (v_x + v_y - omega * (a + b))
//   omega_RR = (1/r) * (v_x - v_y + omega * (a + b))
// This is the closed-form inverse; the forward map is the transpose.

import type { KmrGeometryConfig } from "./kmrGeometry";

export interface MecanumCommand {
  // Linear velocity forward (m/s).
  vX: number;
  // Linear velocity lateral (m/s). Positive = left.
  vY: number;
  // Angular velocity around +z (rad/s). Positive = counter-clockwise
  // (turn left).
  omega: number;
}

export interface MecanumWheelSpeeds {
  // Angular velocity of each wheel (rad/s). Indexed:
  //   speeds[0] = FL, speeds[1] = FR, speeds[2] = RL, speeds[3] = RR.
  speeds: [number, number, number, number];
}

export interface MecanumLimits {
  // Maximum linear speed (m/s). KMR iiwa public spec: 1.5 m/s.
  maxLinearMps: number;
  // Maximum angular speed (rad/s). KMR iiwa public spec: 1.0 rad/s.
  maxAngularRadPerSec: number;
}

export const KUKA_KMR_IIWA_LIMITS: MecanumLimits = {
  maxLinearMps: 1.5,
  maxAngularRadPerSec: 1.0,
};

export function inverseMecanum(
  command: MecanumCommand,
  config: KmrGeometryConfig,
): MecanumWheelSpeeds {
  const r = config.wheelDiameterMeters / 2.0;
  const a = config.wheelbaseXMeters / 2.0;
  const b = config.wheelbaseYMeters / 2.0;
  const { vX, vY, omega } = command;
  return {
    speeds: [
      (1 / r) * (vX - vY - omega * (a + b)),
      (1 / r) * (vX + vY + omega * (a + b)),
      (1 / r) * (vX + vY - omega * (a + b)),
      (1 / r) * (vX - vY + omega * (a + b)),
    ],
  };
}

export function forwardMecanum(
  wheelSpeeds: MecanumWheelSpeeds,
  config: KmrGeometryConfig,
): MecanumCommand {
  const r = config.wheelDiameterMeters / 2.0;
  const a = config.wheelbaseXMeters / 2.0;
  const b = config.wheelbaseYMeters / 2.0;
  const [wFL, wFR, wRL, wRR] = wheelSpeeds.speeds;
  // Forward map is the inverse of the IK (transposed layout):
  //   v_x = (r/4) * (w_FL + w_FR + w_RL + w_RR)
  //   v_y = (r/4) * (-w_FL + w_FR + w_RL - w_RR)
  //   omega = (r/4) * (-w_FL + w_FR - w_RL + w_RR) / (a + b)
  return {
    vX: (r / 4) * (wFL + wFR + wRL + wRR),
    vY: (r / 4) * (-wFL + wFR + wRL - wRR),
    omega: ((r / 4) * (-wFL + wFR - wRL + wRR)) / (a + b),
  };
}

export function applyMecanumLimits(
  command: MecanumCommand,
  limits: MecanumLimits = KUKA_KMR_IIWA_LIMITS,
): MecanumCommand {
  // Project (v_x, v_y) onto the linear-speed disk.
  const vLin = Math.hypot(command.vX, command.vY);
  let scaleV = 1.0;
  if (vLin > limits.maxLinearMps) {
    scaleV = limits.maxLinearMps / vLin;
  }
  // Project omega onto the angular-speed bound.
  const omegaAbs = Math.abs(command.omega);
  let scaleW = 1.0;
  if (omegaAbs > limits.maxAngularRadPerSec) {
    scaleW = limits.maxAngularRadPerSec / omegaAbs;
  }
  // Use the smaller scale so neither limit is exceeded.
  const scale = Math.min(scaleV, scaleW);
  return {
    vX: command.vX * scale,
    vY: command.vY * scale,
    omega: command.omega * scale,
  };
}
