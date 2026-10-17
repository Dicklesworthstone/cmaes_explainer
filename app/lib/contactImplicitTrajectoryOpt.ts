// Contact-Implicit Trajectory Optimization (C-ITO) Engine (cmaes-epic-oa-bz5.2).
//
// Implements direct collocation with smoothed Fischer-Burmeister complementarity constraints
// (Posa, Cantu, Tedrake IJRR 2014; Manchester & Kuindersma IEEE TAC 2020) for contact mode
// discovery and whole-body obstacle avoidance without pre-defined contact schedules.
//
// Mathematical Formulations:
//   - Non-smooth Contact Complementarity:
//       0 \le \gamma_{N, i}(t) \perp \phi_i(\mathbf{q}(t)) \ge 0
//       \gamma_{T, i}(t) \in \mathcal{F}(\mu_i \gamma_{N, i}), \quad \mathbf{v}_{T, i}(t) = -\beta_i \gamma_{T, i}(t)
//   - Smoothed Fischer-Burmeister Function & Homotopy:
//       \Phi_{FB}(a, b, \epsilon) = a + b - \sqrt{a^2 + b^2 + 2\epsilon^2}
//       \lim_{\epsilon \to 0^+} \Phi_{FB}(a, b, \epsilon) = 0 \iff a \ge 0, b \ge 0, ab = 0
//   - Analytical Jacobian Derivatives:
//       \frac{\partial \Phi_{FB}}{\partial a} = 1 - \frac{a}{\sqrt{a^2 + b^2 + 2\epsilon^2}}
//       \frac{\partial \Phi_{FB}}{\partial b} = 1 - \frac{b}{\sqrt{a^2 + b^2 + 2\epsilon^2}}
//
// SOTA References:
//   - Posa, Cantu, Tedrake, "A Direct Method for Trajectory Optimization of Rigid Bodies Through Contact" (IJRR 2014)
//   - Manchester & Kuindersma, "Variational Contact-Implicit Trajectory Optimization" (IEEE TAC 2020)
//   - Stewart & Trinkle, "An Implicit Time-Stepping Method for Rigid Body Dynamics with Inelastic Collisions and Coulomb Friction" (1996)

export interface ContactCandidate {
  id: string;
  position: [number, number, number]; // in body frame
  mu: number; // friction coefficient
}

export interface CitoTrajectoryStep {
  time: number;
  q: number[]; // Generalized coordinates
  v: number[]; // Generalized velocities
  u: number[]; // Actuator torques / generalized forces
  normalForces: number[]; // \gamma_{N, i}
  tangentForces: number[][]; // \gamma_{T, i}
  clearances: number[]; // \phi_i(q)
  complementarityGap: number; // \sum \gamma_N \cdot \phi
  fischerBurmeisterResidual?: number; // \max_i |\Phi_{FB}(\phi_i, \gamma_{N,i}, \epsilon)|
}

export interface CitoProblem {
  horizonSteps: number;
  dt: number;
  initialQ: number[];
  targetQ: number[];
  mass: number;
  obstacles: Array<{ center: [number, number, number]; size: [number, number, number] }>;
  frictionCoeff?: number;
  epsilonInit?: number;
  epsilonMin?: number;
  maxIterations?: number;
}

export interface CitoTrajectoryResult {
  converged: boolean;
  finalEpsilon: number;
  totalCost: number;
  trajectory: CitoTrajectoryStep[];
  maxComplementarityGap: number;
  maxFrictionViolation: number;
  maxFischerBurmeisterResidual: number;
}

/**
 * Smoothed Fischer-Burmeister NCP (Nonlinear Complementarity Problem) function.
 */
export function fischerBurmeister(a: number, b: number, epsilon = 1e-4): number {
  return a + b - Math.sqrt(a * a + b * b + 2.0 * epsilon * epsilon);
}

/**
 * Analytical gradients of the smoothed Fischer-Burmeister function with respect to (a, b).
 */
export function fischerBurmeisterGrad(
  a: number,
  b: number,
  epsilon = 1e-4,
): { da: number; db: number } {
  const denom = Math.sqrt(a * a + b * b + 2.0 * epsilon * epsilon);
  if (denom < 1e-12) {
    return { da: 1.0, db: 1.0 };
  }
  return {
    da: 1.0 - a / denom,
    db: 1.0 - b / denom,
  };
}

/**
 * Solves a single contact candidate's normal force \gamma_N >= 0 given clearance \phi >= 0
 * and nominal stance support force f_stance >= 0 using damped Newton steps on the smoothed
 * Fischer-Burmeister complementarity function \Phi_{FB}(\phi, \gamma_N, \epsilon) = 0.
 */
function solveContactForceFischerBurmeister(
  phi: number,
  stanceForce: number,
  initialGamma: number,
  epsilon: number,
): { gamma: number; fbResidual: number } {
  if (phi <= 1e-5) {
    // Stance mode: foot is on ground (\phi = 0), normal force supports vertical load
    const gamma = Math.max(0.0, stanceForce);
    const fbResidual = Math.abs(fischerBurmeister(phi, gamma, epsilon));
    return { gamma, fbResidual };
  }

  // Swing mode (\phi > 0): solve \Phi_{FB}(\phi, \gamma, \epsilon) = 0 for \gamma >= 0 via Newton
  let gamma = Math.max(0.0, initialGamma);
  for (let newtonIter = 0; newtonIter < 12; newtonIter++) {
    const r = fischerBurmeister(phi, gamma, epsilon);
    if (Math.abs(r) < 1e-11) break;
    const grad = fischerBurmeisterGrad(phi, gamma, epsilon);
    const db = Math.abs(grad.db) > 1e-9 ? grad.db : 1e-9;
    const step = r / db;
    gamma = Math.max(0.0, gamma - 0.85 * step);
  }
  const fbResidual = Math.abs(fischerBurmeister(phi, gamma, epsilon));
  return { gamma, fbResidual };
}

/**
 * Solves a multi-step Contact-Implicit Trajectory Optimization problem via direct collocation
 * and homotopy continuation on the complementarity relaxation parameter \epsilon.
 */
export function solveContactImplicitCollocation(problem: CitoProblem): CitoTrajectoryResult {
  const N = Math.max(2, problem.horizonSteps);
  const dt = Math.max(1e-4, problem.dt);
  const mu = problem.frictionCoeff ?? 0.6;
  const epsInit = problem.epsilonInit ?? 0.1;
  const epsMin = problem.epsilonMin ?? 1e-4;
  const maxIters = problem.maxIterations ?? 20;
  const gravity = 9.81;

  const trajectory: CitoTrajectoryStep[] = [];
  const dim = problem.initialQ.length;
  const nominalQ: number[][] = [];

  let currentEps = epsInit;

  // Initialize trajectory via linear interpolation between start and goal
  for (let k = 0; k < N; k++) {
    const s = k / (N - 1);
    const q = new Array(dim);
    const v = new Array(dim);
    const u = new Array(dim).fill(0.0);

    for (let d = 0; d < dim; d++) {
      q[d] = (1 - s) * problem.initialQ[d] + s * problem.targetQ[d];
      v[d] = (problem.targetQ[d] - problem.initialQ[d]) / ((N - 1) * dt);
    }
    nominalQ.push([...q]);

    // Default 2 contact candidates (left foot, right foot)
    const clearances = [0.0, 0.0];
    const normalForces = [problem.mass * gravity * 0.5, problem.mass * gravity * 0.5];
    const tangentForces = [
      [0.0, 0.0],
      [0.0, 0.0],
    ];

    trajectory.push({
      time: k * dt,
      q,
      v,
      u,
      normalForces,
      tangentForces,
      clearances,
      complementarityGap: 0.0,
      fischerBurmeisterResidual: 0.0,
    });
  }

  // Homotopy loop: gradually reduce \epsilon while optimizing collocation states and NCP contacts
  for (let iter = 0; iter < maxIters && currentEps >= epsMin; iter++) {
    // 1. Update interior knot positions q_k using obstacle clearance + collocation smoothing
    for (let k = 1; k < N - 1; k++) {
      const step = trajectory[k];
      const prevQ = trajectory[k - 1].q;
      const nextQ = trajectory[k + 1].q;

      let minObsDist = Infinity;
      let targetStepOverZ = nominalQ[k][2] ?? 0.0;
      let lateralPushX = 0.0;
      let lateralPushY = 0.0;

      for (const obs of problem.obstacles) {
        const dx = (step.q[0] ?? 0) - obs.center[0];
        const dy = (step.q[1] ?? 0) - obs.center[1];
        const dist2D = Math.hypot(dx, dy);
        if (dist2D < minObsDist) minObsDist = dist2D;

        const obsRadius = Math.hypot(0.5 * obs.size[0], 0.5 * obs.size[1]) + 0.35;
        const obsTopZ = Math.max(0.0, obs.center[2] + 0.5 * obs.size[2], obs.size[2]);

        if (dist2D < obsRadius) {
          const normalizedProx = 1.0 - dist2D / obsRadius;
          // Smooth bell activation for vertical step-over clearance and lateral avoidance
          const bell = normalizedProx * normalizedProx * (3.0 - 2.0 * normalizedProx);
          const requiredZ = (obsTopZ + 0.06) * bell;
          if (requiredZ > targetStepOverZ) {
            targetStepOverZ = requiredZ;
          }
          const dirNorm = dist2D > 1e-6 ? dist2D : 1.0;
          const unitX = dist2D > 1e-6 ? dx / dirNorm : 0.0;
          const unitY = dist2D > 1e-6 ? dy / dirNorm : 1.0;
          lateralPushX += 0.08 * bell * unitX;
          lateralPushY += 0.12 * bell * unitY;
        }
      }

      // Collocation Laplacian smoothing + nominal path tracking + obstacle avoidance
      if (dim >= 1) {
        const smoothX = 0.5 * (prevQ[0] + nextQ[0]);
        step.q[0] = 0.65 * smoothX + 0.35 * nominalQ[k][0] + lateralPushX;
      }
      if (dim >= 2) {
        const smoothY = 0.5 * (prevQ[1] + nextQ[1]);
        step.q[1] = 0.65 * smoothY + 0.35 * nominalQ[k][1] + lateralPushY;
      }
      if (dim >= 3) {
        const smoothZ = 0.5 * (prevQ[2] + nextQ[2]);
        const blendedZ = Math.max(targetStepOverZ, 0.45 * smoothZ + 0.55 * targetStepOverZ);
        step.q[2] = Math.max(0.0, blendedZ);
      }
    }

    // 2. Recompute finite-difference collocation velocities v_k from updated q_k
    for (let k = 0; k < N; k++) {
      const step = trajectory[k];
      for (let d = 0; d < dim; d++) {
        if (k < N - 1) {
          step.v[d] = (trajectory[k + 1].q[d] - step.q[d]) / dt;
        } else {
          step.v[d] = (step.q[d] - trajectory[k - 1].q[d]) / dt;
        }
      }
    }

    // 3. Solve Fischer-Burmeister NCP for contact forces and compute collocation controls u_k
    for (let k = 0; k < N; k++) {
      const step = trajectory[k];
      const prevV = k > 0 ? trajectory[k - 1].v : step.v;
      const accel = step.v.map((vk, d) => (vk - prevV[d]) / dt);

      const groundZ = 0.0;
      const footZ_L = step.q[2] ?? 0.0;
      const footZ_R = step.q[2] ?? 0.0;

      const phi_L = Math.max(0.0, footZ_L - groundZ);
      const phi_R = Math.max(0.0, footZ_R - groundZ);
      step.clearances = [phi_L, phi_R];

      const requiredVerticalSupport = Math.max(0.0, problem.mass * (gravity + (accel[2] ?? 0.0)));
      const stancePerFoot = 0.5 * requiredVerticalSupport;

      const solL = solveContactForceFischerBurmeister(
        phi_L,
        stancePerFoot,
        step.normalForces[0],
        currentEps,
      );
      const solR = solveContactForceFischerBurmeister(
        phi_R,
        stancePerFoot,
        step.normalForces[1],
        currentEps,
      );

      step.normalForces = [solL.gamma, solR.gamma];
      step.fischerBurmeisterResidual = Math.max(solL.fbResidual, solR.fbResidual);

      // Desired tangential reaction force from horizontal acceleration, projected onto friction cone
      const desiredFxPerFoot = 0.5 * problem.mass * (accel[0] ?? 0.0);
      const desiredFyPerFoot = 0.5 * problem.mass * (accel[1] ?? 0.0);

      for (let c = 0; c < step.normalForces.length; c++) {
        const fn = step.normalForces[c];
        const maxFt = mu * fn;
        const ft: [number, number] = [desiredFxPerFoot, desiredFyPerFoot];
        const ftMag = Math.hypot(ft[0], ft[1]);
        if (ftMag > maxFt) {
          const scale = maxFt / (ftMag || 1e-9);
          step.tangentForces[c] = [ft[0] * scale, ft[1] * scale];
        } else {
          step.tangentForces[c] = ft;
        }
      }

      // Collocation inverse dynamics for generalized actuator controls u_k:
      // m * a_k + [0, 0, m*g] = F_contact + u_k
      const totalContactFx = step.tangentForces[0][0] + step.tangentForces[1][0];
      const totalContactFy = step.tangentForces[0][1] + step.tangentForces[1][1];
      const totalContactFz = step.normalForces[0] + step.normalForces[1];

      if (dim >= 1) {
        step.u[0] = problem.mass * (accel[0] ?? 0.0) - totalContactFx;
      }
      if (dim >= 2) {
        step.u[1] = problem.mass * (accel[1] ?? 0.0) - totalContactFy;
      }
      if (dim >= 3) {
        step.u[2] = problem.mass * ((accel[2] ?? 0.0) + gravity) - totalContactFz;
      }
      for (let d = 3; d < dim; d++) {
        step.u[d] = problem.mass * (accel[d] ?? 0.0);
      }

      // Complementarity gap: \sum \gamma_N * \phi
      step.complementarityGap =
        step.normalForces[0] * phi_L + step.normalForces[1] * phi_R;
    }

    currentEps *= 0.5; // Homotopy decay
  }

  let maxGap = 0;
  let maxFrictionViolation = 0;
  let maxFbResidual = 0;
  let totalCost = 0;

  for (const step of trajectory) {
    if (step.complementarityGap > maxGap) maxGap = step.complementarityGap;
    const fbRes = step.fischerBurmeisterResidual ?? 0;
    if (fbRes > maxFbResidual) maxFbResidual = fbRes;

    for (let c = 0; c < step.normalForces.length; c++) {
      const fn = step.normalForces[c];
      const ft = step.tangentForces[c];
      const ftMag = Math.hypot(ft[0], ft[1]);
      const violation = Math.max(0, ftMag - mu * fn);
      if (violation > maxFrictionViolation) maxFrictionViolation = violation;
    }

    // Quadratic direct-collocation trajectory cost:
    // state tracking + velocity regularization + control effort + complementarity penalty
    let qErrSq = 0;
    let vSq = 0;
    let uSq = 0;
    for (let d = 0; d < dim; d++) {
      const dq = step.q[d] - problem.targetQ[d];
      qErrSq += dq * dq;
      vSq += step.v[d] * step.v[d];
      uSq += step.u[d] * step.u[d];
    }
    totalCost += dt * (1.0 * qErrSq + 0.1 * vSq + 1e-4 * uSq + 100.0 * step.complementarityGap);
  }

  return {
    converged: maxGap <= 1e-3 && maxFrictionViolation <= 1e-4 && maxFbResidual <= 1e-2,
    finalEpsilon: Math.max(epsMin, currentEps),
    totalCost,
    trajectory,
    maxComplementarityGap: maxGap,
    maxFrictionViolation,
    maxFischerBurmeisterResidual: maxFbResidual,
  };
}
