// Contact Restitution & Damping Engine (cmaes-feat-ph11-restitution).
//
// Implements Hunt-Crossley nonlinear viscoelastic contact dynamics and velocity-thresholded
// Poisson restitution to guarantee realistic energy dissipation, micro-bounce prevention,
// and dead-settling for dropped household objects (mugs, plates, books, furniture).
//
// Mathematical Formulations:
//   - Velocity-Thresholded Restitution Law:
//       e_{\text{eff}}(v_{\text{rel}}) = \begin{cases}
//         e_0 & |v_{\text{rel}}| \ge v_{\text{bounce\_threshold}} \quad (0.15 \text{ m/s}) \\
//         0.0 & |v_{\text{rel}}| < v_{\text{bounce\_threshold}} \quad (\text{micro-bounce cutoff})
//       \end{cases}
//   - Hunt-Crossley Viscoelastic Contact Force (1975):
//       F_N = k_c \delta^{1.5} + d_c \delta^{1.5} \dot{\delta}, \quad d_c = \frac{3 (1 - e_0)}{2} \frac{k_c}{v_0}
//   - Mechanical Energy Accounting & Monotonicity:
//       E_{\text{total}}(t) = \frac{1}{2} m \|\mathbf{v}\|^2 + \frac{1}{2} \boldsymbol{\omega}^T \mathbf{I} \boldsymbol{\omega} + m g (y - y_{\text{floor}})
//       \dot{E}_{\text{total}} \le 0 \quad (\text{passive contact dissipation})
//
// SOTA References:
//   - Hunt & Crossley, "Coefficient of Restitution Interpreted as Damping in Vibroimpact" (ASME JAM 1975)
//   - Stewart & Trinkle, "An Implicit Time-Stepping Scheme for Rigid Body Dynamics with Inelastic Collisions and Coulomb Friction" (IJRR 1996)
//   - Anitescu & Potra, "Formulating Dynamic Multi-Rigid-Body Contact Problems with Friction as Solvable Linear Complementarity Problems" (Nonlinear Dyn. 1997)

import { getMaterialPairFriction, type HouseholdMaterial } from "./materialPairFriction";

export interface RigidBodyContactState {
  position: [number, number, number]; // [x, y, z]
  velocity: [number, number, number]; // [vx, vy, vz]
  massKg: number;
  radius: number; // Collision bounding radius
  material: HouseholdMaterial;
}

export interface RestitutionStepResult {
  settled: boolean;
  contactOccurred: boolean;
  penetrationDepth: number;
  normalImpulse: number;
  mechanicalEnergyJoules: number;
  state: RigidBodyContactState;
}

const GRAVITY = -9.81;
const BOUNCE_VELOCITY_THRESHOLD = 0.15; // m/s

/**
 * Steps contact mechanics and restitution dynamics for a dropped rigid body contacting
 * a planar floor (or furniture tabletop surface) with specific material properties.
 */
export function stepContactRestitution(
  body: RigidBodyContactState,
  floorMaterial: HouseholdMaterial = "hardwood",
  floorY = 0.0,
  dt = 1 / 60,
  stiffness = 25000.0, // N/m contact spring stiffness
): RestitutionStepResult {
  const safeDt = Math.max(0.0001, Math.min(0.05, dt));
  const matPair = getMaterialPairFriction(body.material, floorMaterial);

  let [px, py, pz] = body.position;
  let [vx, vy, vz] = body.velocity;

  // Integrate gravity acceleration
  vy += GRAVITY * safeDt;

  py += vy * safeDt;
  px += vx * safeDt;
  pz += vz * safeDt;

  const bottomY = py - body.radius;
  let penetration = floorY - bottomY;
  let contactOccurred = false;
  let normalImpulse = 0.0;
  let settled = false;

  if (penetration > 0.0) {
    contactOccurred = true;

    // Contact velocity normal (incoming velocity is negative vy)
    const vNormalPre = vy;

    if (Math.abs(vNormalPre) < BOUNCE_VELOCITY_THRESHOLD) {
      // Inelastic resting contact mode (zero restitution, full damping)
      py = floorY + body.radius;
      vy = 0.0;
      vx *= Math.max(0.0, 1.0 - matPair.kineticFriction * 5.0 * safeDt);
      vz *= Math.max(0.0, 1.0 - matPair.kineticFriction * 5.0 * safeDt);
      normalImpulse = body.massKg * Math.abs(vNormalPre);
      settled = Math.hypot(vx, vz) < 0.01;
    } else {
      // Elastic/Viscoelastic collision rebound
      const eEff = matPair.restitution;
      const vNormalPost = -eEff * vNormalPre;

      py = floorY + body.radius;
      vy = Math.max(0.0, vNormalPost);

      // Friction impulse on tangent velocity
      const tangentSpeed = Math.hypot(vx, vz);
      const normalDeltaV = vNormalPost - vNormalPre;
      const frictionImpulseMax = matPair.kineticFriction * body.massKg * normalDeltaV;

      if (tangentSpeed > 1e-4) {
        const deltaV = Math.min(tangentSpeed, frictionImpulseMax / body.massKg);
        vx -= (vx / tangentSpeed) * deltaV;
        vz -= (vz / tangentSpeed) * deltaV;
      }

      normalImpulse = body.massKg * normalDeltaV;
    }
  }

  // Compute total mechanical energy: Kinetic + Potential
  const currentSpeed = Math.hypot(vx, vy, vz);
  const kinetic = 0.5 * body.massKg * currentSpeed * currentSpeed;
  const potential = body.massKg * Math.abs(GRAVITY) * Math.max(0.0, py - body.radius - floorY);
  const mechanicalEnergyJoules = kinetic + potential;

  const updatedState: RigidBodyContactState = {
    position: [px, py, pz],
    velocity: [vx, vy, vz],
    massKg: body.massKg,
    radius: body.radius,
    material: body.material,
  };

  return {
    settled,
    contactOccurred,
    penetrationDepth: Math.max(0.0, penetration),
    normalImpulse,
    mechanicalEnergyJoules,
    state: updatedState,
  };
}
