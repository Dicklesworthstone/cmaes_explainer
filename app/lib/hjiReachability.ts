/**
 * Hamilton-Jacobi Backward Reachable Tube (BRT) — static safety check.
 *
 * Bead: cmaes-ndl8. Companion to app/lib/dpValueIteration.ts (clearance VI,
 * e6a290b): that module answers "how FAR from obstacles is this cell", this
 * module answers "how long until the planar walker can REACH the goal from
 * this state — or can it never". The BRT is the third leg of the safety
 * stack: CBF filter (oa1) + MPC filter (oa8) + reachability certificate.
 *
 * # Formulation
 *
 * State s = (x, y, theta). Dynamics (momentum-limited planar walker):
 *   dot x  = v * cos(theta),        |v| <= vMax
 *   dot y  = v * sin(theta)
 *   dot th = w,                     |w| <= omegaMax
 *
 * Backward time-to-reach value function (BRT):
 *   V(s) = min time to reach the target set T from s
 *   V = 0 on T, V = +inf inside inflated obstacles and where T is
 *   unreachable (disconnected), and the viscosity solution of
 *     vmax * |grad V . d(theta)| + omegaMax * |dV/dtheta| = 1
 *   (Mitchell/Bayen/Tomlin 2005; T-RO 2024 DOI 10.1109/TRO.2024.3454470;
 *    verifiable Q-filters via HJ reachability, arXiv:2506.15693).
 *
 * # Discretization (honest scope)
 *
 * First-order Godunov / fast-sweeping on a (nx, ny, nTheta) grid. The
 * directional term is bounded via |grad V . d| <= |cos| |Vx| + |sin| |Vy|
 * (Cauchy-Schwarz), which makes the Hamiltonian axis-separable:
 *   H = aX |Vx| + aY |Vy| + aT |Vth| = 1,
 *   aX = vmax|cos|/dx, aY = vmax|sin|/dy, aT = omegaMax/dth.
 * For the L1 Hamiltonian the Godunov update takes the SMALLER upwind
 * neighbor per axis (information flows from smaller values):
 *   V_i = (aX min(Vxm,Vxp) + aY min(Vym,Vyp) + aT min(Vtm,Vtp) + 1) / sum(a)
 * This is monotone, consistent for the bounded Hamiltonian, and
 * CONSERVATIVE: the bounding step means V >= V_true, i.e. we never claim
 * a state is reachable FASTER than physics allows — the safe direction
 * for a safety certificate. Sweeping uses alternating Gauss-Seidel
 * orderings (classic fast-sweeping method; typically a handful of cycles
 * to 1e-4).
 *
 * Reuse: obstacle geometry comes from the same SDF abstraction as
 * dpValueIteration (OBB union, primitive-SDF grounded per
 * cmaes-feat-cl2). Cells with sdf(x,y) < bodyRadius are hard-blocked.
 *
 * Non-goals (see bead): dynamic obstacles, GPU solver, kernel changes.
 */

import { type AABB2D, type SDF2D, type Vec2 } from "./dpValueIteration";

/** Solver configuration. Grid: nx * ny * nTheta cells. */
export interface BRTParams {
  /** World-space domain. */
  bounds: AABB2D;
  /** Spatial grid counts (>= 2). */
  nx: number;
  ny: number;
  /** Heading bins covering [0, 2pi) (>= 1; 1 = heading-blind). */
  nTheta: number;
  /** Max planar speed, m/s. */
  vMax: number;
  /** Max heading rate, rad/s. */
  omegaMax: number;
  /** Hard-block cells closer than this to an obstacle (body inflation), m. */
  bodyRadius: number;
  /** Convergence threshold on max per-sweep delta (seconds). Default 1e-4. */
  epsilon?: number;
  /** Sweep-cycle cap. Default 60. */
  maxSweeps?: number;
}

/** Target set: disc in the plane. */
export interface BRTTarget {
  center: Vec2;
  radius: number;
}

/** Solved time-to-reach field. time[i + nx*(j + ny*k)] in seconds, +inf unreachable. */
export interface BRTField {
  time: Float32Array;
  nx: number;
  ny: number;
  nTheta: number;
  bounds: AABB2D;
  dx: number;
  dy: number;
  dTheta: number;
  /** Diagnostics. */
  sweeps: number;
  finalDelta: number;
  solveMs: number;
}

const TAU = Math.PI * 2;

/**
 * Solve the BRT. Deterministic: same inputs -> bit-identical field
 * (pure typed-array arithmetic, fixed sweep order, no clocks in the loop).
 */
export function solveBackwardReachableTube(
  sdf: SDF2D,
  target: BRTTarget,
  params: BRTParams,
): BRTField {
  const { bounds, nx, ny, nTheta, vMax, omegaMax, bodyRadius } = params;
  if (nx < 2 || ny < 2 || nTheta < 1) {
    throw new Error("BRT: nx, ny must be >= 2 and nTheta >= 1");
  }
  if (!(vMax > 0) || !(omegaMax > 0)) {
    throw new Error("BRT: vMax and omegaMax must be > 0");
  }
  const epsilon = params.epsilon ?? 1e-4;
  const maxSweeps = params.maxSweeps ?? 60;

  const dx = (bounds.max[0] - bounds.min[0]) / (nx - 1);
  const dy = (bounds.max[1] - bounds.min[1]) / (ny - 1);
  const dTheta = TAU / nTheta;

  // cos/sin per theta bin, precomputed (inner loop stays allocation-free).
  const cosT = new Float64Array(nTheta);
  const sinT = new Float64Array(nTheta);
  for (let k = 0; k < nTheta; k++) {
    const th = k * dTheta;
    cosT[k] = Math.cos(th);
    sinT[k] = Math.sin(th);
  }

  // Blocked mask from the inflated SDF (fixed once; static obstacles only).
  const blocked = new Uint8Array(nx * ny);
  for (let j = 0; j < ny; j++) {
    const wy = bounds.min[1] + j * dy;
    for (let i = 0; i < nx; i++) {
      const wx = bounds.min[0] + i * dx;
      if (sdf(wx, wy) < bodyRadius) blocked[i + nx * j] = 1;
    }
  }

  // Value grid: V = 0 on target, +inf elsewhere (blocked cells stay +inf).
  const time = new Float32Array(nx * ny * nTheta);
  time.fill(Number.POSITIVE_INFINITY);
  for (let j = 0; j < ny; j++) {
    const wy = bounds.min[1] + j * dy;
    for (let i = 0; i < nx; i++) {
      if (blocked[i + nx * j]) continue;
      const ddx = bounds.min[0] + i * dx - target.center[0];
      const ddy = wy - target.center[1];
      if (Math.hypot(ddx, ddy) <= target.radius) {
        for (let k = 0; k < nTheta; k++) time[i + nx * (j + ny * k)] = 0;
      }
    }
  }

  const solveMsStart = performance.now();
  let sweeps = 0;
  let finalDelta = Number.POSITIVE_INFINITY;

  // Fast-sweeping: alternate the 4 spatial orderings x 2 heading directions.
  while (sweeps < maxSweeps) {
    let maxDelta = 0;
    for (let dir = 0; dir < 8; dir++) {
      const iStart = dir & 1 ? nx - 1 : 0;
      const iStep = dir & 1 ? -1 : 1;
      const jStart = dir & 2 ? ny - 1 : 0;
      const jStep = dir & 2 ? -1 : 1;
      const kStart = dir & 4 ? nTheta - 1 : 0;
      const kStep = dir & 4 ? -1 : 1;
      for (let jj = 0; jj < ny; jj++) {
        const j = jStart + jStep * jj;
        const wy = bounds.min[1] + j * dy;
        for (let ii = 0; ii < nx; ii++) {
          const i = iStart + iStep * ii;
          if (blocked[i + nx * j]) continue;
          const wx = bounds.min[0] + i * dx;
          // Skip target cells (V=0 is absorbing).
          const ddx = wx - target.center[0];
          const ddy = wy - target.center[1];
          if (Math.hypot(ddx, ddy) <= target.radius) continue;
          for (let kk = 0; kk < nTheta; kk++) {
            const k = kStart + kStep * kk;
            const aX = (vMax * Math.abs(cosT[k])) / dx;
            const aY = (vMax * Math.abs(sinT[k])) / dy;
            const aT = omegaMax / dTheta;
            const aSum = aX + aY + aT;
            const xm = i > 0 ? time[i - 1 + nx * (j + ny * k)] : Number.POSITIVE_INFINITY;
            const xp = i < nx - 1 ? time[i + 1 + nx * (j + ny * k)] : Number.POSITIVE_INFINITY;
            const ym = j > 0 ? time[i + nx * (j - 1 + ny * k)] : Number.POSITIVE_INFINITY;
            const yp = j < ny - 1 ? time[i + nx * (j + 1 + ny * k)] : Number.POSITIVE_INFINITY;
            // Heading axis is periodic.
            const km = (k - 1 + nTheta) % nTheta;
            const kp = (k + 1) % nTheta;
            const tm = time[i + nx * (j + ny * km)];
            const tp = time[i + nx * (j + ny * kp)];
            // Drop axes whose upwind neighbors are all still +inf: the
            // weighted Godunov solve is exact for the axes present and
            // stays conservative (unknown axes cannot vote yet). Without
            // this, one inf neighbor poisons the average and nothing
            // ever propagates out of the target set.
            const mX = Math.min(xm, xp);
            const mY = Math.min(ym, yp);
            const mT = Math.min(tm, tp);
            let num = 1;
            let den = 0;
            if (Number.isFinite(mX)) {
              num += aX * mX;
              den += aX;
            }
            if (Number.isFinite(mY)) {
              num += aY * mY;
              den += aY;
            }
            if (Number.isFinite(mT)) {
              num += aT * mT;
              den += aT;
            }
            if (den === 0) continue;
            const cand = num / den;
            const idx = i + nx * (j + ny * k);
            const prev = time[idx];
            if (cand < prev) {
              time[idx] = cand;
              const delta = prev - cand;
              if (delta > maxDelta) maxDelta = delta;
            }
          }
        }
      }
    }
    sweeps++;
    finalDelta = maxDelta;
    if (maxDelta <= epsilon) break;
  }

  return {
    time,
    nx,
    ny,
    nTheta,
    bounds,
    dx,
    dy,
    dTheta,
    sweeps,
    finalDelta,
    solveMs: performance.now() - solveMsStart,
  };
}

/** Sample the field at a world pose (nearest cell). +inf if unreachable/out of domain. */
export function sampleTimeAt(field: BRTField, x: number, y: number, theta: number): number {
  const { bounds, nx, ny, nTheta } = field;
  if (x < bounds.min[0] || x > bounds.max[0] || y < bounds.min[1] || y > bounds.max[1]) {
    return Number.POSITIVE_INFINITY;
  }
  const i = Math.round((x - bounds.min[0]) / field.dx);
  const j = Math.round((y - bounds.min[1]) / field.dy);
  const k = ((Math.round(theta / field.dTheta) % nTheta) + nTheta) % nTheta;
  const ci = Math.min(Math.max(i, 0), nx - 1);
  const cj = Math.min(Math.max(j, 0), ny - 1);
  return field.time[ci + nx * (cj + ny * k)];
}

/**
 * Static safety check for a rollout start: the pose must be reachable to
 * the target in finite time (certificate: a plan EXISTS under the bounded
 * dynamics). Rollout gating per the bead's design.
 */
export function isSafeStart(field: BRTField, x: number, y: number, theta: number): boolean {
  return Number.isFinite(sampleTimeAt(field, x, y, theta));
}
