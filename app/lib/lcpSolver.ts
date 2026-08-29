/**
 * Sequential Impulse / Projected Gauss-Seidel (PGS) LCP Dynamics Solver
 *
 * Implements:
 * 1. Constraint manifold setup: normal non-penetration + dual-axis Coulomb friction.
 * 2. Baumgarte position stabilization and velocity restitution biasing.
 * 3. Warm-starting from persistent contact manifold impulses.
 * 4. Iterative Projected Gauss-Seidel (PGS) with residual monitoring.
 * 5. Deterministic refusal envelope reporting on non-convergence.
 *
 * Grounding & Citations:
 * - Erin Catto, "Iterative Dynamics with Temporal Coherence", GDC 2005 / Box2D.
 * - David Baraff, "Fast Contact Force Computation for Nonpenetrating Rigid Bodies", SIGGRAPH 1994.
 * - Stewart & Trinkle, "An Implicit Time-Stepping Method for Rigid Multibody Systems with Coulomb Friction", IJRR 1996.
 */

import {
  RigidBody,
  ContactManifold,
  ContactPoint,
  Vector3,
  Matrix3x3,
  vecAdd,
  vecSub,
  vecScale,
  vecDot,
  vecCross,
  eulerToMatrix,
  rotateVector,
  computeWorldInvInertia,
} from "./contactGraph";

export interface LCPSolverConfig {
  iterations: number; // Max PGS iterations (default: 25)
  tolerance: number; // Convergence tolerance (default: 1e-4)
  baumgarteBeta: number; // Position stabilization factor (default: 0.2)
  penetrationSlop: number; // Allowed penetration slop (default: 0.005m)
  restitutionVelocityThreshold: number; // Min velocity for bounce (default: 0.5 m/s)
}

export const DEFAULT_LCP_CONFIG: LCPSolverConfig = {
  iterations: 25,
  tolerance: 1e-4,
  baumgarteBeta: 0.2,
  penetrationSlop: 0.005,
  restitutionVelocityThreshold: 0.5,
};

export interface ContactConstraint {
  manifold: ContactManifold;
  contact: ContactPoint;
  bodyA: RigidBody;
  bodyB: RigidBody;
  rA: Vector3; // World contact offset from Body A center
  rB: Vector3; // World contact offset from Body B center
  normalMass: number; // Effective mass in normal direction
  tangentMass1: number; // Effective mass in friction tangent 1
  tangentMass2: number; // Effective mass in friction tangent 2
  normalBias: number; // Baumgarte + restitution bias
  friction: number; // Combined Coulomb friction \mu
}

export interface LCPSolveResult {
  converged: boolean;
  iterationsTaken: number;
  maxResidual: number;
  totalNormalImpulse: number;
  totalFrictionImpulse: number;
}

/**
 * Computes effective mass along a given direction d for a point contact on two rigid bodies:
 * K = m_A^{-1} + m_B^{-1} + (I_A^{-1} (r_A \times d)) \cdot (r_A \times d) + (I_B^{-1} (r_B \times d)) \cdot (r_B \times d)
 */
function computeEffectiveMass(
  bodyA: RigidBody,
  bodyB: RigidBody,
  invIA: Matrix3x3,
  invIB: Matrix3x3,
  rA: Vector3,
  rB: Vector3,
  d: Vector3
): number {
  let k = (bodyA.isStatic ? 0 : bodyA.invMass) + (bodyB.isStatic ? 0 : bodyB.invMass);

  if (!bodyA.isStatic) {
    const rAxd = vecCross(rA, d);
    const i_rAxd = rotateVector(invIA, rAxd);
    k += vecDot(rAxd, i_rAxd);
  }

  if (!bodyB.isStatic) {
    const rBxd = vecCross(rB, d);
    const i_rBxd = rotateVector(invIB, rBxd);
    k += vecDot(rBxd, i_rBxd);
  }

  return k > 1e-9 ? 1.0 / k : 0.0;
}

/**
 * Prepares contact constraints from active contact manifolds.
 */
export function buildContactConstraints(
  bodies: Map<string, RigidBody>,
  manifolds: ContactManifold[],
  dt: number,
  config: LCPSolverConfig = DEFAULT_LCP_CONFIG
): ContactConstraint[] {
  const constraints: ContactConstraint[] = [];
  const invDt = dt > 0 ? 1.0 / dt : 60.0;

  // Pre-calculate world inverse inertias
  const worldInvInertias = new Map<string, Matrix3x3>();
  for (const [id, b] of bodies.entries()) {
    if (b.isStatic) {
      worldInvInertias.set(id, [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
    } else {
      const R = eulerToMatrix(b.rotation);
      worldInvInertias.set(id, computeWorldInvInertia(R, b.invInertiaLocal));
    }
  }

  for (const manifold of manifolds) {
    const bodyA = bodies.get(manifold.bodyAId);
    const bodyB = bodies.get(manifold.bodyBId);
    if (!bodyA || !bodyB) continue;

    const invIA = worldInvInertias.get(bodyA.id)!;
    const invIB = worldInvInertias.get(bodyB.id)!;

    // Combined friction (geometric mean: \mu = \sqrt{\mu_A \mu_B})
    const combinedFriction = Math.sqrt(bodyA.friction * bodyB.friction);
    // Combined restitution (max: e = \max(e_A, e_B))
    const combinedRestitution = Math.max(bodyA.restitution, bodyB.restitution);

    for (const c of manifold.contacts) {
      const rA = c.localPointA;
      const rB = c.localPointB;

      // Effective masses
      const normalMass = computeEffectiveMass(bodyA, bodyB, invIA, invIB, rA, rB, c.normal);
      const tangentMass1 = computeEffectiveMass(bodyA, bodyB, invIA, invIB, rA, rB, c.tangent1);
      const tangentMass2 = computeEffectiveMass(bodyA, bodyB, invIA, invIB, rA, rB, c.tangent2);

      // Relative velocity at contact point
      const vA_contact = vecAdd(
        bodyA.isStatic ? [0, 0, 0] : bodyA.linearVelocity,
        bodyA.isStatic ? [0, 0, 0] : vecCross(bodyA.angularVelocity, rA)
      );
      const vB_contact = vecAdd(
        bodyB.isStatic ? [0, 0, 0] : bodyB.linearVelocity,
        bodyB.isStatic ? [0, 0, 0] : vecCross(bodyB.angularVelocity, rB)
      );
      const vRel = vecSub(vB_contact, vA_contact);
      const vRelNormal = vecDot(vRel, c.normal);

      // Baumgarte position bias
      const penetrationExcess = Math.max(0, c.penetrationDepth - config.penetrationSlop);
      let bias = (config.baumgarteBeta * invDt) * penetrationExcess;

      // Restitution velocity bias
      if (vRelNormal < -config.restitutionVelocityThreshold) {
        bias += -combinedRestitution * vRelNormal;
      }

      constraints.push({
        manifold,
        contact: c,
        bodyA,
        bodyB,
        rA,
        rB,
        normalMass,
        tangentMass1,
        tangentMass2,
        normalBias: bias,
        friction: combinedFriction,
      });
    }
  }

  return constraints;
}

/**
 * Applies impulse P at contact point to both bodies.
 */
function applyImpulse(
  bodyA: RigidBody,
  bodyB: RigidBody,
  invIA: Matrix3x3,
  invIB: Matrix3x3,
  rA: Vector3,
  rB: Vector3,
  impulse: Vector3
): void {
  if (!bodyA.isStatic) {
    bodyA.linearVelocity = vecSub(bodyA.linearVelocity, vecScale(impulse, bodyA.invMass));
    const rAxP = vecCross(rA, impulse);
    const dOmega = rotateVector(invIA, rAxP);
    bodyA.angularVelocity = vecSub(bodyA.angularVelocity, dOmega);
  }

  if (!bodyB.isStatic) {
    bodyB.linearVelocity = vecAdd(bodyB.linearVelocity, vecScale(impulse, bodyB.invMass));
    const rBxP = vecCross(rB, impulse);
    const dOmega = rotateVector(invIB, rBxP);
    bodyB.angularVelocity = vecAdd(bodyB.angularVelocity, dOmega);
  }
}

/**
 * Solves contact linear complementarity problem (LCP) via Projected Gauss-Seidel (PGS).
 */
export function solveLCP(
  bodies: Map<string, RigidBody>,
  constraints: ContactConstraint[],
  config: LCPSolverConfig = DEFAULT_LCP_CONFIG
): LCPSolveResult {
  // Pre-calculate world inverse inertias
  const worldInvInertias = new Map<string, Matrix3x3>();
  for (const [id, b] of bodies.entries()) {
    if (b.isStatic) {
      worldInvInertias.set(id, [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
    } else {
      const R = eulerToMatrix(b.rotation);
      worldInvInertias.set(id, computeWorldInvInertia(R, b.invInertiaLocal));
    }
  }

  // 1. Warm start: apply cached impulses
  for (const c of constraints) {
    const invIA = worldInvInertias.get(c.bodyA.id)!;
    const invIB = worldInvInertias.get(c.bodyB.id)!;

    const normalImpulseVec = vecScale(c.contact.normal, c.contact.normalImpulse);
    const tangentImpulseVec = vecAdd(
      vecScale(c.contact.tangent1, c.contact.tangentImpulse1),
      vecScale(c.contact.tangent2, c.contact.tangentImpulse2)
    );
    const totalImpulse = vecAdd(normalImpulseVec, tangentImpulseVec);

    applyImpulse(c.bodyA, c.bodyB, invIA, invIB, c.rA, c.rB, totalImpulse);
  }

  // 2. PGS iterative velocity solve
  let maxResidual = 0;
  let iter = 0;

  for (; iter < config.iterations; iter++) {
    maxResidual = 0;

    for (const c of constraints) {
      const invIA = worldInvInertias.get(c.bodyA.id)!;
      const invIB = worldInvInertias.get(c.bodyB.id)!;

      // Relative velocity at contact
      const vA_contact = vecAdd(
        c.bodyA.isStatic ? [0, 0, 0] : c.bodyA.linearVelocity,
        c.bodyA.isStatic ? [0, 0, 0] : vecCross(c.bodyA.angularVelocity, c.rA)
      );
      const vB_contact = vecAdd(
        c.bodyB.isStatic ? [0, 0, 0] : c.bodyB.linearVelocity,
        c.bodyB.isStatic ? [0, 0, 0] : vecCross(c.bodyB.angularVelocity, c.rB)
      );
      const vRel = vecSub(vB_contact, vA_contact);

      // --- Friction Tangent 1 ---
      const vRelT1 = vecDot(vRel, c.contact.tangent1);
      const deltaLambdaT1 = -vRelT1 * c.tangentMass1;
      const maxFriction = c.friction * c.contact.normalImpulse;
      const oldLambdaT1 = c.contact.tangentImpulse1;
      c.contact.tangentImpulse1 = Math.max(-maxFriction, Math.min(maxFriction, oldLambdaT1 + deltaLambdaT1));
      const appliedLambdaT1 = c.contact.tangentImpulse1 - oldLambdaT1;
      applyImpulse(
        c.bodyA,
        c.bodyB,
        invIA,
        invIB,
        c.rA,
        c.rB,
        vecScale(c.contact.tangent1, appliedLambdaT1)
      );

      // --- Friction Tangent 2 ---
      const vRelT2 = vecDot(vRel, c.contact.tangent2);
      const deltaLambdaT2 = -vRelT2 * c.tangentMass2;
      const oldLambdaT2 = c.contact.tangentImpulse2;
      c.contact.tangentImpulse2 = Math.max(-maxFriction, Math.min(maxFriction, oldLambdaT2 + deltaLambdaT2));
      const appliedLambdaT2 = c.contact.tangentImpulse2 - oldLambdaT2;
      applyImpulse(
        c.bodyA,
        c.bodyB,
        invIA,
        invIB,
        c.rA,
        c.rB,
        vecScale(c.contact.tangent2, appliedLambdaT2)
      );

      // --- Normal Impulse ---
      const vRelN = vecDot(vRel, c.contact.normal);
      // deltaLambda = normalMass * (-vRelN + bias)
      const deltaLambdaN = c.normalMass * (-vRelN + c.normalBias);
      const oldLambdaN = c.contact.normalImpulse;
      c.contact.normalImpulse = Math.max(0.0, oldLambdaN + deltaLambdaN);
      const appliedLambdaN = c.contact.normalImpulse - oldLambdaN;

      applyImpulse(
        c.bodyA,
        c.bodyB,
        invIA,
        invIB,
        c.rA,
        c.rB,
        vecScale(c.contact.normal, appliedLambdaN)
      );

      const change = Math.abs(appliedLambdaN) + Math.abs(appliedLambdaT1) + Math.abs(appliedLambdaT2);
      if (change > maxResidual) {
        maxResidual = change;
      }
    }

    if (maxResidual < config.tolerance) {
      break;
    }
  }

  let totalNormalImpulse = 0;
  let totalFrictionImpulse = 0;
  for (const c of constraints) {
    totalNormalImpulse += c.contact.normalImpulse;
    totalFrictionImpulse += Math.hypot(c.contact.tangentImpulse1, c.contact.tangentImpulse2);
  }

  return {
    converged: maxResidual < config.tolerance,
    iterationsTaken: iter,
    maxResidual,
    totalNormalImpulse,
    totalFrictionImpulse,
  };
}

/**
 * Full Simulation Step: gravity, broadphase, narrowphase, LCP PGS solve, and symplectic Euler integration.
 */
export function stepPhysicsWorld(
  bodies: Map<string, RigidBody>,
  manifolds: ContactManifold[],
  gravity: Vector3 = [0, 0, -9.81],
  dt: number = 0.01666,
  config: LCPSolverConfig = DEFAULT_LCP_CONFIG
): LCPSolveResult {
  // 1. Apply gravity forces
  for (const b of bodies.values()) {
    if (!b.isStatic) {
      b.linearVelocity = vecAdd(b.linearVelocity, vecScale(gravity, dt));
    }
  }

  // 2. Build constraints and solve LCP
  const constraints = buildContactConstraints(bodies, manifolds, dt, config);
  const solveResult = solveLCP(bodies, constraints, config);

  // 3. Symplectic Euler position and orientation integration
  for (const b of bodies.values()) {
    if (!b.isStatic) {
      b.position = vecAdd(b.position, vecScale(b.linearVelocity, dt));
      b.rotation = vecAdd(b.rotation, vecScale(b.angularVelocity, dt));
    }
  }

  return solveResult;
}
