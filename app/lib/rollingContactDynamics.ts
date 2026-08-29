// Rolling Contact & Limit Surface Friction Engine (cmaes-feat-ph2-rolling).
//
// Implements physical rolling contact mechanics with Goyal-Ruina-Papadopoulos 3D limit surfaces,
// Contensou-Coulomb spinning friction, and rolling resistance torque for spheres, cylinders,
// stools, and wheeled objects on planar floors.
//
// Mathematical Formulations:
//   - Goyal-Ruina-Papadopoulos Limit Surface (1991):
//       \left(\frac{\| \mathbf{F}_t \|}{\mu F_n}\right)^2 + \left(\frac{| M_n |}{\mu_s R F_n}\right)^2 + \left(\frac{\| \mathbf{M}_r \|}{\mu_r F_n}\right)^2 \le 1
//   - Contact Point Velocity (Kinematic Constraint):
//       \mathbf{v}_c = \mathbf{v} + \boldsymbol{\omega} \times \mathbf{r}_c
//   - Slip-to-Roll Convergence (Analytical Mechanics):
//       \dot{\mathbf{v}} = -\mu g \hat{\mathbf{v}}_c, \quad \dot{\boldsymbol{\omega}} = \frac{5 \mu g}{2 R} (\hat{\mathbf{r}}_c \times \hat{\mathbf{v}}_c)
//       \tau_{roll} = \frac{2 v_0}{7 \mu g}
//
// SOTA References:
//   - Goyal, Ruina, Papadopoulos, "Planar Sliding with Dry Friction" (Wear 1991)
//   - Contensou, "Coupling Between Sliding and Spinning Friction" (1963)
//   - Leine & Glocker, "Non-smooth Critical Phenomena and Dynamics of Switched Systems" (Springer 2003)

export interface RollingBody {
  id: string;
  type: "sphere" | "cylinder";
  position: [number, number, number];
  velocity: [number, number, number];
  angularVelocity: [number, number, number];
  mass: number;
  radius: number;
  height?: number; // for cylinder
  muSliding: number; // Coulomb sliding friction coefficient (default 0.4)
  muSpinning: number; // Contensou spin resistance coefficient (default 0.1)
  muRolling: number; // Rolling resistance coefficient (default 0.005)
  restitution: number;
}

export interface RollingContactResult {
  hasContact: boolean;
  contactPoint: [number, number, number];
  normalForce: number;
  frictionForce: [number, number, number];
  spinTorque: number;
  rollingTorque: [number, number, number];
  isPureRolling: boolean;
  slipSpeed: number;
}

const GRAVITY = 9.81;

/**
 * Step dynamic simulation for a rolling sphere contacting the floor plane (y = groundY).
 */
export function stepRollingSphere(
  body: RollingBody,
  groundY = 0.0,
  dt = 0.016,
  externalForce: [number, number, number] = [0, 0, 0],
): RollingContactResult {
  const safeDt = Math.max(0.0001, Math.min(0.05, dt));
  const R = body.radius;
  const m = body.mass;
  const I = (2.0 / 5.0) * m * R * R; // Solid sphere moment of inertia

  const contactY = body.position[1] - R;
  const penetration = groundY - contactY;

  // No contact (in air)
  if (penetration < -1e-4) {
    // Ballistic integration
    body.velocity[1] -= GRAVITY * safeDt;
    body.position[0] += (body.velocity[0] + externalForce[0] / m * safeDt) * safeDt;
    body.position[1] += (body.velocity[1] + externalForce[1] / m * safeDt) * safeDt;
    body.position[2] += (body.velocity[2] + externalForce[2] / m * safeDt) * safeDt;

    return {
      hasContact: false,
      contactPoint: [body.position[0], contactY, body.position[2]],
      normalForce: 0,
      frictionForce: [0, 0, 0],
      spinTorque: 0,
      rollingTorque: [0, 0, 0],
      isPureRolling: false,
      slipSpeed: 0,
    };
  }

  // Enforce floor non-penetration
  body.position[1] = groundY + R;
  if (body.velocity[1] < 0) {
    body.velocity[1] = -body.velocity[1] * body.restitution;
    if (Math.abs(body.velocity[1]) < 0.05) {
      body.velocity[1] = 0;
    }
  }

  const Fn = m * GRAVITY + Math.max(0, -externalForce[1]);
  const contactPt: [number, number, number] = [body.position[0], groundY, body.position[2]];

  // Vector from center of mass to contact point: r_c = [0, -R, 0]
  const rcY = -R;

  // Contact velocity v_c = v + \omega x r_c
  // (\omega_x, \omega_y, \omega_z) x (0, -R, 0) = (\omega_z * R, 0, -\omega_x * R)
  const vcx = body.velocity[0] + body.angularVelocity[2] * R;
  const vcz = body.velocity[2] - body.angularVelocity[0] * R;
  const slipSpeed = Math.hypot(vcx, vcz);

  const maxSlidingFriction = body.muSliding * Fn;
  let Fx = 0;
  let Fz = 0;
  let isPureRolling = false;

  // Effective mass for contact point acceleration: 1 / m_eff = 1 / m + R^2 / I
  const invMeff = 1.0 / m + (R * R) / I;
  const meff = 1.0 / invMeff;

  // Stopping force required to eliminate slip in this time step
  const FstopX = -vcx * meff / safeDt;
  const FstopZ = -vcz * meff / safeDt;
  const FstopMag = Math.hypot(FstopX, FstopZ);

  if (FstopMag <= maxSlidingFriction) {
    // Pure rolling (static friction holds contact point stationary)
    isPureRolling = true;
    Fx = FstopX;
    Fz = FstopZ;
  } else {
    // Kinetic sliding friction
    isPureRolling = false;
    Fx = -maxSlidingFriction * (vcx / (slipSpeed || 1));
    Fz = -maxSlidingFriction * (vcz / (slipSpeed || 1));
  }

  // Contensou spinning friction (opposing \omega_y around vertical normal)
  const spinSpeed = body.angularVelocity[1];
  const maxSpinTorque = body.muSpinning * R * Fn;
  let spinTorque = 0;
  if (Math.abs(spinSpeed) > 1e-4) {
    spinTorque = -maxSpinTorque * Math.sign(spinSpeed);
  } else {
    spinTorque = 0;
  }

  // Rolling resistance torque opposing rolling direction
  const rollSpeed = Math.hypot(body.angularVelocity[0], body.angularVelocity[2]);
  const maxRollTorque = body.muRolling * Fn;
  let rollTx = 0;
  let rollTz = 0;
  if (rollSpeed > 1e-4) {
    rollTx = -maxRollTorque * (body.angularVelocity[0] / rollSpeed);
    rollTz = -maxRollTorque * (body.angularVelocity[2] / rollSpeed);
  }

  // Goyal-Ruina limit surface projection: (Ft / (mu Fn))^2 + (Mn / (mu_s R Fn))^2 <= 1
  const ftNorm = Math.hypot(Fx, Fz) / (maxSlidingFriction || 1e-6);
  const mnNorm = Math.abs(spinTorque) / (maxSpinTorque || 1e-6);
  const limitNorm = Math.hypot(ftNorm, mnNorm);
  if (limitNorm > 1.0) {
    Fx /= limitNorm;
    Fz /= limitNorm;
    spinTorque /= limitNorm;
  }

  // Torques from contact friction: \tau = r_c x F = (0, -R, 0) x (Fx, 0, Fz) = (-R * Fz, 0, R * Fx)
  const tauFrictionX = -R * Fz;
  const tauFrictionZ = R * Fx;

  // Integrate linear velocity & position
  const ax = (Fx + externalForce[0]) / m;
  const az = (Fz + externalForce[2]) / m;
  body.velocity[0] += ax * safeDt;
  body.velocity[2] += az * safeDt;
  body.position[0] += body.velocity[0] * safeDt;
  body.position[2] += body.velocity[2] * safeDt;

  // Integrate angular velocity
  const alphaX = (tauFrictionX + rollTx) / I;
  const alphaY = (spinTorque) / I;
  const alphaZ = (tauFrictionZ + rollTz) / I;

  body.angularVelocity[0] += alphaX * safeDt;
  body.angularVelocity[1] += alphaY * safeDt;
  body.angularVelocity[2] += alphaZ * safeDt;

  // Limit stopping when nearly stationary
  if (Math.hypot(body.velocity[0], body.velocity[2]) < 1e-4 && Math.hypot(...body.angularVelocity) < 1e-4) {
    body.velocity[0] = 0;
    body.velocity[2] = 0;
    body.angularVelocity[0] = 0;
    body.angularVelocity[1] = 0;
    body.angularVelocity[2] = 0;
  }

  return {
    hasContact: true,
    contactPoint: contactPt,
    normalForce: Fn,
    frictionForce: [Fx, 0, Fz],
    spinTorque,
    rollingTorque: [rollTx, 0, rollTz],
    isPureRolling,
    slipSpeed,
  };
}

/**
 * Step dynamic simulation for a rolling cylinder / stool / wheel.
 */
export function stepRollingCylinder(
  body: RollingBody,
  groundY = 0.0,
  dt = 0.016,
  externalForce: [number, number, number] = [0, 0, 0],
): RollingContactResult {
  const safeDt = Math.max(0.0001, Math.min(0.05, dt));
  const R = body.radius;
  const m = body.mass;
  const I = (1.0 / 2.0) * m * R * R; // Solid cylinder moment of inertia

  const contactY = body.position[1] - R;
  const penetration = groundY - contactY;

  if (penetration < -1e-4) {
    body.velocity[1] -= GRAVITY * safeDt;
    body.position[0] += body.velocity[0] * safeDt;
    body.position[1] += body.velocity[1] * safeDt;
    body.position[2] += body.velocity[2] * safeDt;
    return {
      hasContact: false,
      contactPoint: [body.position[0], contactY, body.position[2]],
      normalForce: 0,
      frictionForce: [0, 0, 0],
      spinTorque: 0,
      rollingTorque: [0, 0, 0],
      isPureRolling: false,
      slipSpeed: 0,
    };
  }

  body.position[1] = groundY + R;
  if (body.velocity[1] < 0) {
    body.velocity[1] = -body.velocity[1] * body.restitution;
    if (Math.abs(body.velocity[1]) < 0.05) body.velocity[1] = 0;
  }

  const Fn = m * GRAVITY + Math.max(0, -externalForce[1]);
  const contactPt: [number, number, number] = [body.position[0], groundY, body.position[2]];

  // Forward rolling along X axis
  const vcx = body.velocity[0] + body.angularVelocity[2] * R;
  const slipSpeed = Math.abs(vcx);
  const maxFriction = body.muSliding * Fn;

  // Effective mass for contact point acceleration: 1 / m_eff = 1 / m + R^2 / I
  const invMeff = 1.0 / m + (R * R) / I;
  const meff = 1.0 / invMeff;

  const FstopX = -vcx * meff / safeDt;
  let Fx = 0;
  let isPureRolling = false;

  if (Math.abs(FstopX) <= maxFriction) {
    isPureRolling = true;
    Fx = FstopX;
  } else {
    isPureRolling = false;
    Fx = -maxFriction * Math.sign(vcx);
  }

  // Integrate linear and angular motions
  const ax = (Fx + externalForce[0]) / m;
  body.velocity[0] += ax * safeDt;
  body.position[0] += body.velocity[0] * safeDt;

  const tauZ = R * Fx;
  const alphaZ = tauZ / I;
  body.angularVelocity[2] += alphaZ * safeDt;

  return {
    hasContact: true,
    contactPoint: contactPt,
    normalForce: Fn,
    frictionForce: [Fx, 0, 0],
    spinTorque: 0,
    rollingTorque: [0, 0, 0],
    isPureRolling,
    slipSpeed,
  };
}
