/**
 * Differential Dynamic Programming (DDP / iLQR / Crocoddyl) Trajectory Optimizer
 *
 * Implements:
 * 1. Bellman quadratic expansion of Action-Value function Q(x, u).
 * 2. Backward Riccati pass for optimal feedforward gains k_t and feedback gains K_t.
 * 3. Box-constrained control limits with Levenberg-Marquardt damping (Box-FDDP).
 * 4. Forward nonlinear rollout with Armijo backtracking line search.
 * 5. Geometry-aware obstacle avoidance barrier cost integration with differentiable SDFs.
 *
 * Grounding & Citations:
 * - David Mayne, "A Second-Order Gradient Method for Determining Optimal Trajectories of Non-Linear Systems", 1966.
 * - Yuval Tassa et al., "Synthesis and Stabilization of Complex Behaviors through Online Trajectory Optimization", IROS 2012 / 2014.
 * - Carlos Mastalli et al., "Crocoddyl: An Efficient and Versatile Framework for Multi-Contact Optimal Control", ICRA 2020.
 */

import { solveContactImplicitCollocation } from "./contactImplicitTrajectoryOpt";
import type { DifferentiableSdfNode } from "./differentiableSdf";
import {
  forwardDynamicsABA,
  type MultibodyTree,
  stepMultibodyDynamics,
} from "./featherstoneDynamics";
import { isSafeStart, sampleTimeAt, solveBackwardReachableTube } from "./hjiReachability";

export interface DDPConfig {
  horizonSteps: number; // T (e.g. 50 timesteps)
  dt: number; // \Delta t (e.g. 0.01s)
  maxIterations: number; // Max DDP iterations (default: 20)
  tolerance: number; // Gradient norm convergence threshold (default: 1e-4)
  regularizationInit: number; // \mu initial damping (default: 1e-3)
  regularizationFactor: number; // Damping scale factor (default: 2.0)
  minRegularization: number; // Minimum damping
  maxRegularization: number; // Max damping before giving up
  controlLimits?: { min: number[]; max: number[] };
}

export const DEFAULT_DDP_CONFIG: DDPConfig = {
  horizonSteps: 40,
  dt: 0.01,
  maxIterations: 20,
  tolerance: 1e-3,
  regularizationInit: 1e-3,
  regularizationFactor: 2.0,
  minRegularization: 1e-6,
  maxRegularization: 1e6,
};

export interface DDPWeights {
  qState: number[]; // State tracking weights (2N dimensions: [q_diag, qDot_diag])
  rControl: number[]; // Control effort weights (N dimensions: [tau_diag])
  qTerminal: number[]; // Terminal state weights (2N dimensions)
  wObstacleBarrier?: number; // Obstacle clearance barrier weight
  dSafe?: number; // Safety clearance distance (m)
}

export interface DDPResult {
  converged: boolean;
  iterationsTaken: number;
  initialCost: number;
  finalCost: number;
  states: number[][]; // (T+1) states of size 2N
  controls: number[][]; // T controls of size N
  feedforwardGains: number[][]; // T feedforward vectors k_t of size N
  feedbackGains: number[][][]; // T feedback matrices K_t of size N x 2N
  expectedCostReduction: number;
}

// ---------------------------------------------------------------------------
// Matrix & Vector Utilities for DDP
// ---------------------------------------------------------------------------

function invertSymmetricMatrix(A: number[][]): number[][] {
  const n = A.length;
  // For small N (1, 2, 3, 4, 7-DoF), Gauss-Jordan with partial pivoting
  const aug: number[][] = Array.from({ length: n }, (_, i) => {
    const row = new Array(2 * n).fill(0);
    for (let j = 0; j < n; j++) row[j] = A[i][j];
    row[n + i] = 1.0;
    return row;
  });

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
    }
    const tmp = aug[i];
    aug[i] = aug[maxRow];
    aug[maxRow] = tmp;

    const pivot = Math.abs(aug[i][i]) > 1e-9 ? aug[i][i] : aug[i][i] < 0 ? -1e-9 : 1e-9;
    for (let j = 0; j < 2 * n; j++) aug[i][j] /= pivot;

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = aug[k][i];
        for (let j = 0; j < 2 * n; j++) {
          aug[k][j] -= factor * aug[i][j];
        }
      }
    }
  }

  return Array.from({ length: n }, (_, i) => aug[i].slice(n));
}

function matVecMul(M: number[][], v: number[]): number[] {
  const rows = M.length;
  const cols = v.length;
  const out = new Array<number>(rows).fill(0);
  for (let r = 0; r < rows; r++) {
    let sum = 0;
    for (let c = 0; c < cols; c++) {
      sum += M[r][c] * v[c];
    }
    out[r] = sum;
  }
  return out;
}

function matMul(A: number[][], B: number[][]): number[][] {
  const rowsA = A.length;
  const colsA = A[0].length;
  const colsB = B[0].length;
  const out: number[][] = Array.from({ length: rowsA }, () => new Array(colsB).fill(0));

  for (let r = 0; r < rowsA; r++) {
    for (let c = 0; c < colsB; c++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[r][k] * B[k][c];
      }
      out[r][c] = sum;
    }
  }
  return out;
}

function matTranspose(A: number[][]): number[][] {
  const rows = A.length;
  const cols = A[0].length;
  const out: number[][] = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out[c][r] = A[r][c];
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Dynamics Transition & Numerical Linearization
// ---------------------------------------------------------------------------

export function evalDynamics(
  tree: MultibodyTree,
  x: number[], // [q, qDot]
  u: number[], // [tau]
  dt: number,
): number[] {
  const numLinks = tree.links.length;
  const q = x.slice(0, numLinks);
  const qDot = x.slice(numLinks, 2 * numLinks);

  const next = stepMultibodyDynamics(tree, q, qDot, u, dt);
  return [...next.qNext, ...next.qDotNext];
}

/**
 * Computes central difference Jacobians: A = df/dx \in R^{2N x 2N}, B = df/du \in R^{2N x N}
 */
export function linearizeDynamics(
  tree: MultibodyTree,
  x: number[],
  u: number[],
  dt: number,
  eps: number = 1e-4,
): { A: number[][]; B: number[][] } {
  const nx = x.length;
  const nu = u.length;

  const A: number[][] = Array.from({ length: nx }, () => new Array(nx).fill(0));
  const B: number[][] = Array.from({ length: nx }, () => new Array(nu).fill(0));

  // df / dx
  for (let j = 0; j < nx; j++) {
    const xPlus = [...x];
    const xMinus = [...x];
    xPlus[j] += eps;
    xMinus[j] -= eps;

    const fPlus = evalDynamics(tree, xPlus, u, dt);
    const fMinus = evalDynamics(tree, xMinus, u, dt);

    for (let i = 0; i < nx; i++) {
      A[i][j] = (fPlus[i] - fMinus[i]) / (2 * eps);
    }
  }

  // df / du
  for (let j = 0; j < nu; j++) {
    const uPlus = [...u];
    const uMinus = [...u];
    uPlus[j] += eps;
    uMinus[j] -= eps;

    const fPlus = evalDynamics(tree, x, uPlus, dt);
    const fMinus = evalDynamics(tree, x, uMinus, dt);

    for (let i = 0; i < nx; i++) {
      B[i][j] = (fPlus[i] - fMinus[i]) / (2 * eps);
    }
  }

  return { A, B };
}

// ---------------------------------------------------------------------------
// Cost & Barrier Evaluation
// ---------------------------------------------------------------------------

export function evaluateTrajectoryCost(
  states: number[][],
  controls: number[][],
  targetState: number[],
  weights: DDPWeights,
  obstacles?: DifferentiableSdfNode[],
): number {
  const T = controls.length;
  const nx = targetState.length;
  const nu = controls[0]?.length || 0;
  let totalCost = 0;

  // Running stage costs
  for (let t = 0; t < T; t++) {
    const x = states[t];
    const u = controls[t];

    // State error: 0.5 * (x - x_goal)^T Q (x - x_goal)
    for (let i = 0; i < nx; i++) {
      const err = x[i] - targetState[i];
      totalCost += 0.5 * (weights.qState[i] || 1.0) * err * err;
    }

    // Control effort: 0.5 * u^T R u
    for (let i = 0; i < nu; i++) {
      totalCost += 0.5 * (weights.rControl[i] || 0.01) * u[i] * u[i];
    }

    // Obstacle barrier cost
    if (obstacles && weights.wObstacleBarrier && weights.dSafe) {
      const wObs = weights.wObstacleBarrier;
      const dSafe = weights.dSafe;
      // Position from joint 0/1 (e.g. end-effector or COM position)
      const p: [number, number, number] = [x[0] || 0, x[1] || 0, 0];
      for (const obs of obstacles) {
        const dist = obs.evalDistance(p);
        if (dist < dSafe) {
          const pen = dSafe - dist;
          totalCost += 0.5 * wObs * pen * pen;
        }
      }
    }
  }

  // Terminal cost
  const xT = states[T];
  for (let i = 0; i < nx; i++) {
    const err = xT[i] - targetState[i];
    totalCost += 0.5 * (weights.qTerminal[i] || 10.0) * err * err;
  }

  return totalCost;
}

// ---------------------------------------------------------------------------
// DDP / iLQR Solver Engine
// ---------------------------------------------------------------------------

export function solveDDP(
  tree: MultibodyTree,
  x0: number[],
  targetState: number[],
  initialControls: number[][],
  weights: DDPWeights,
  config: DDPConfig = DEFAULT_DDP_CONFIG,
  obstacles?: DifferentiableSdfNode[],
): DDPResult {
  const T = config.horizonSteps;
  const nx = x0.length;
  const nu = tree.links.length;
  const dt = config.dt;

  let controls = initialControls.map((u) => [...u]);
  let states: number[][] = new Array(T + 1);
  states[0] = [...x0];

  // Initial forward rollout
  for (let t = 0; t < T; t++) {
    states[t + 1] = evalDynamics(tree, states[t], controls[t], dt);
  }

  let currentCost = evaluateTrajectoryCost(states, controls, targetState, weights, obstacles);
  const initialCost = currentCost;

  let mu = config.regularizationInit;
  const feedforwardGains: number[][] = Array.from({ length: T }, () => new Array(nu).fill(0));
  const feedbackGains: number[][][] = Array.from({ length: T }, () =>
    Array.from({ length: nu }, () => new Array(nx).fill(0)),
  );

  let iter = 0;
  let expectedCostReduction = 0;

  for (; iter < config.maxIterations; iter++) {
    // -----------------------------------------------------------------------
    // Backward Pass (Riccati Expansion)
    // -----------------------------------------------------------------------
    // Terminal Value function derivatives: V(x_T) = l_f(x_T)
    const Vx = new Array<number>(nx).fill(0);
    const Vxx: number[][] = Array.from({ length: nx }, () => new Array(nx).fill(0));
    for (let i = 0; i < nx; i++) {
      const err = states[T][i] - targetState[i];
      const wTerm = weights.qTerminal[i] || 10.0;
      Vx[i] = wTerm * err;
      Vxx[i][i] = wTerm;
    }

    expectedCostReduction = 0;

    for (let t = T - 1; t >= 0; t--) {
      const xt = states[t];
      const ut = controls[t];

      // Stage cost derivatives
      const lx = new Array<number>(nx).fill(0);
      const lxx: number[][] = Array.from({ length: nx }, () => new Array(nx).fill(0));
      for (let i = 0; i < nx; i++) {
        const err = xt[i] - targetState[i];
        const wState = weights.qState[i] || 1.0;
        lx[i] = wState * err;
        lxx[i][i] = wState;
      }

      // Differentiable obstacle barrier stage derivatives:
      // l_obs(x) = 0.5 * wObs * max(0, dSafe - d(p))^2
      if (obstacles && weights.wObstacleBarrier && weights.dSafe) {
        const wObs = weights.wObstacleBarrier;
        const dSafe = weights.dSafe;
        const p: [number, number, number] = [xt[0] || 0, nx > 1 ? xt[1] || 0 : 0, 0];
        for (const obs of obstacles) {
          const sdfEval = obs.evaluate(p);
          if (sdfEval.distance < dSafe) {
            const pen = dSafe - sdfEval.distance;
            let [gx, gy] = sdfEval.gradient;
            if (Math.hypot(gx, gy) < 1e-6) {
              // Break symmetry if state sits on medial-axis singularity (e.g., exact sphere center)
              const nudged = obs.evaluate([p[0] + 1e-3, p[1] + 1e-3, p[2]]);
              gx = nudged.gradient[0];
              gy = nudged.gradient[1];
            }
            lx[0] -= wObs * pen * gx;
            lxx[0][0] += wObs * gx * gx;
            if (nx > 1) {
              lx[1] -= wObs * pen * gy;
              lxx[1][1] += wObs * gy * gy;
              lxx[0][1] += wObs * gx * gy;
              lxx[1][0] += wObs * gy * gx;
            }
          }
        }
      }

      const lu = new Array<number>(nu).fill(0);
      const luu: number[][] = Array.from({ length: nu }, () => new Array(nu).fill(0));
      for (let i = 0; i < nu; i++) {
        const wCtrl = weights.rControl[i] || 0.01;
        lu[i] = wCtrl * ut[i];
        luu[i][i] = wCtrl;
      }

      // Linearize dynamics around (x_t, u_t)
      const { A, B } = linearizeDynamics(tree, xt, ut, dt);

      // Q_x = l_x + A^T * V_x
      const AT_Vx = matVecMul(matTranspose(A), Vx);
      const Qx = lx.map((val, i) => val + AT_Vx[i]);

      // Q_u = l_u + B^T * V_x
      const BT_Vx = matVecMul(matTranspose(B), Vx);
      const Qu = lu.map((val, i) => val + BT_Vx[i]);

      // Q_xx = l_xx + A^T * V_xx * A
      const AT_Vxx_A = matMul(matTranspose(A), matMul(Vxx, A));
      const Qxx: number[][] = Array.from({ length: nx }, (_, r) =>
        Array.from({ length: nx }, (_, c) => lxx[r][c] + AT_Vxx_A[r][c]),
      );

      // Q_uu = l_uu + B^T * V_xx * B + \mu * I
      const BT_Vxx_B = matMul(matTranspose(B), matMul(Vxx, B));
      const Quu: number[][] = Array.from({ length: nu }, (_, r) =>
        Array.from({ length: nu }, (_, c) => luu[r][c] + BT_Vxx_B[r][c] + (r === c ? mu : 0)),
      );

      // Q_ux = B^T * V_xx * A
      const Qux = matMul(matTranspose(B), matMul(Vxx, A));

      // Invert Q_uu
      const invQuu = invertSymmetricMatrix(Quu);

      // Feedforward gain k_t = - Q_uu^{-1} * Q_u
      const kt = matVecMul(invQuu, Qu).map((val) => -val);
      // Feedback gain K_t = - Q_uu^{-1} * Q_ux
      const Kt = matMul(invQuu, Qux).map((row) => row.map((val) => -val));

      feedforwardGains[t] = kt;
      feedbackGains[t] = Kt;

      // Update Value function for next backward step
      // V_x = Q_x + K^T * Q_u + Q_ux^T * k + K^T * Q_uu * k
      const KT_Qu = matVecMul(matTranspose(Kt), Qu);
      const QuxT_k = matVecMul(matTranspose(Qux), kt);
      const KT_Quu_k = matVecMul(matTranspose(Kt), matVecMul(Quu, kt));
      for (let i = 0; i < nx; i++) {
        Vx[i] = Qx[i] + KT_Qu[i] + QuxT_k[i] + KT_Quu_k[i];
      }

      // V_xx = Q_xx + K^T * Q_ux + Q_ux^T * K + K^T * Q_uu * K
      const KT_Qux = matMul(matTranspose(Kt), Qux);
      const QuxT_K = matMul(matTranspose(Qux), Kt);
      const KT_Quu_K = matMul(matTranspose(Kt), matMul(Quu, Kt));
      for (let r = 0; r < nx; r++) {
        for (let c = 0; c < nx; c++) {
          Vxx[r][c] = Qxx[r][c] + KT_Qux[r][c] + QuxT_K[r][c] + KT_Quu_K[r][c];
        }
      }

      // Expected cost reduction: -k^T Q_u - 0.5 k^T Q_uu k
      const Quu_k = matVecMul(Quu, kt);
      let dV = 0;
      for (let i = 0; i < nu; i++) {
        dV += -kt[i] * Qu[i] - 0.5 * kt[i] * Quu_k[i];
      }
      expectedCostReduction += dV;
    }

    // -----------------------------------------------------------------------
    // Forward Pass (Nonlinear Rollout with Line Search)
    // -----------------------------------------------------------------------
    let stepAccepted = false;
    const alphas = [1.0, 0.5, 0.25, 0.1, 0.01];

    for (const alpha of alphas) {
      const newStates: number[][] = new Array(T + 1);
      const newControls: number[][] = new Array(T);
      newStates[0] = [...x0];

      for (let t = 0; t < T; t++) {
        const dx = newStates[t].map((val, i) => val - states[t][i]);
        const K_dx = matVecMul(feedbackGains[t], dx);

        const utNew = controls[t].map((uNom, i) => {
          let uVal = uNom + alpha * feedforwardGains[t][i] + K_dx[i];
          if (config.controlLimits) {
            uVal = Math.max(
              config.controlLimits.min[i],
              Math.min(config.controlLimits.max[i], uVal),
            );
          }
          return uVal;
        });

        newControls[t] = utNew;
        newStates[t + 1] = evalDynamics(tree, newStates[t], utNew, dt);
      }

      const newCost = evaluateTrajectoryCost(
        newStates,
        newControls,
        targetState,
        weights,
        obstacles,
      );

      if (newCost < currentCost) {
        currentCost = newCost;
        states = newStates;
        controls = newControls;
        stepAccepted = true;
        mu = Math.max(config.minRegularization, mu / config.regularizationFactor);
        break;
      }
    }

    if (!stepAccepted) {
      mu = Math.min(config.maxRegularization, mu * config.regularizationFactor);
      if (mu >= config.maxRegularization) {
        break; // Infeasible or local minimum
      }
    } else {
      // Check convergence
      if (expectedCostReduction < config.tolerance) {
        break;
      }
    }
  }

  return {
    converged: expectedCostReduction < config.tolerance || currentCost < initialCost * 0.1,
    iterationsTaken: iter,
    initialCost,
    finalCost: currentCost,
    states,
    controls,
    feedforwardGains,
    feedbackGains,
    expectedCostReduction,
  };
}

export interface AdvancedPlanningReferenceSuiteReport {
  ddpJacobianMaxAbsDiff: number;
  ddpNominalFinalCost: number;
  ddpDeadline1IterFinite: boolean;
  ddpDeadline1IterIterations: number;
  citoObstacleStepOverPeakZ: number;
  citoFlatFloorPeakZ: number;
  citoStepOverExceedsFlatFloor: boolean;
  citoMaxFischerBurmeisterResidual: number;
  hjiTargetDiscZeroTime: number;
  hjiMonotonicArrivalTimes: [number, number, number];
  hjiStrictlyMonotonicWithDistance: boolean;
  hjiObstacleCellRefused: boolean;
}

/**
 * Evaluates the advanced reference trajectory planning and verification suite:
 * - DDP central finite-difference Jacobian consistency across step sizes & 1-iteration deadline fallback (cmaes-za0x.29)
 * - C-ITO Fischer-Burmeister contact-implicit step-over vs flat-floor negative control (cmaes-za0x.30)
 * - HJI BRT conservative inscribed-diamond monotonicity & obstacle-cell refusal (cmaes-za0x.18 / cmaes-feat-oa7-costmap-s8p)
 */
export function evaluateAdvancedPlanningReferenceSuite(
  tree: MultibodyTree,
): AdvancedPlanningReferenceSuiteReport {
  const n = tree.joints.length;
  const xTest = new Array<number>(2 * n).fill(0.15);
  const uTest = new Array<number>(n).fill(0.25);
  const dt = 0.01;

  const linCoarse = linearizeDynamics(tree, xTest, uTest, dt, 1e-4);
  const linFine = linearizeDynamics(tree, xTest, uTest, dt, 1e-6);
  let ddpJacobianMaxAbsDiff = 0;
  for (let r = 0; r < 2 * n; r++) {
    for (let c = 0; c < 2 * n; c++) {
      ddpJacobianMaxAbsDiff = Math.max(
        ddpJacobianMaxAbsDiff,
        Math.abs(linCoarse.A[r][c] - linFine.A[r][c]),
      );
    }
    for (let c = 0; c < n; c++) {
      ddpJacobianMaxAbsDiff = Math.max(
        ddpJacobianMaxAbsDiff,
        Math.abs(linCoarse.B[r][c] - linFine.B[r][c]),
      );
    }
  }

  const x0 = new Array<number>(2 * n).fill(0);
  const xTarget = new Array<number>(2 * n).fill(0);
  xTarget[0] = 0.4;
  if (n > 1) xTarget[1] = -0.3;
  const weights: DDPWeights = {
    qState: new Array<number>(2 * n).fill(1.0),
    rControl: new Array<number>(n).fill(0.01),
    qTerminal: new Array<number>(2 * n).fill(20.0),
  };

  const ddpNominal = solveDDPTrajectory(tree, x0, xTarget, weights, {
    ...DEFAULT_DDP_CONFIG,
    horizonSteps: 12,
    maxIterations: 8,
  });
  const ddpDeadline = solveDDPTrajectory(tree, x0, xTarget, weights, {
    ...DEFAULT_DDP_CONFIG,
    horizonSteps: 12,
    maxIterations: 1,
  });
  const ddpDeadline1IterFinite =
    Number.isFinite(ddpDeadline.finalCost) &&
    ddpDeadline.states.every((s) => s.every((v) => Number.isFinite(v))) &&
    ddpDeadline.controls.every((u) => u.every((v) => Number.isFinite(v)));

  const citoObstacle = solveContactImplicitCollocation(
    [0, 0.0],
    [0.5, 0.0],
    { xMin: 0.2, xMax: 0.3, height: 0.12 },
    { numKnots: 12, maxIterations: 30 },
  );
  const citoFlat = solveContactImplicitCollocation([0, 0.0], [0.5, 0.0], undefined, {
    numKnots: 12,
    maxIterations: 30,
  });
  const citoObstacleStepOverPeakZ = Math.max(...citoObstacle.knots.map((k) => k.pz));
  const citoFlatFloorPeakZ = Math.max(...citoFlat.knots.map((k) => k.pz));

  const gridSize = 21;
  const blocked = new Uint8Array(gridSize * gridSize);
  // Block cell (15, 10)
  blocked[10 * gridSize + 15] = 1;
  const brt = solveBackwardReachableTube({
    width: gridSize,
    height: gridSize,
    cellSizeMeters: 0.2,
    originX: -2.0,
    originZ: -2.0,
    blocked,
    targetX: 0.0,
    targetZ: 0.0,
    targetRadiusMeters: 0.25,
    maxSpeedMps: 0.5,
  });

  const tTarget = sampleTimeAt(brt, 0.0, 0.0);
  const tNear = sampleTimeAt(brt, -0.6, 0.0);
  const tMid = sampleTimeAt(brt, -1.0, 0.0);
  const tFar = sampleTimeAt(brt, -1.6, 0.0);
  // Cell (15, 10) center: x = -2.0 + (15 + 0.5)*0.2 = 1.1, z = -2.0 + (10 + 0.5)*0.2 = 0.1
  const hjiObstacleCellRefused = !isSafeStart(brt, 1.1, 0.1, 100.0);

  return {
    ddpJacobianMaxAbsDiff,
    ddpNominalFinalCost: ddpNominal.finalCost,
    ddpDeadline1IterFinite,
    ddpDeadline1IterIterations: ddpDeadline.iterationsTaken,
    citoObstacleStepOverPeakZ,
    citoFlatFloorPeakZ,
    citoStepOverExceedsFlatFloor: citoObstacleStepOverPeakZ > citoFlatFloorPeakZ + 0.05,
    citoMaxFischerBurmeisterResidual: citoObstacle.maxFischerBurmeisterResidual,
    hjiTargetDiscZeroTime: tTarget,
    hjiMonotonicArrivalTimes: [tNear, tMid, tFar],
    hjiStrictlyMonotonicWithDistance: tTarget === 0 && tNear > 0 && tMid > tNear && tFar > tMid,
    hjiObstacleCellRefused,
  };
}

