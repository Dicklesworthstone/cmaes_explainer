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
 *   unreachable (disconnected).
 *   (Mitchell/Bayen/Tomlin 2005; T-RO 2024 DOI 10.1109/TRO.2024.3454470;
 *    verifiable Q-filters via HJ reachability, arXiv:2506.15693.)
 *
 * # Discretization (honest scope) — label-setting on a conservative metric
 *
 * The continuous HJ PDE is replaced by its standard first-order graph
 * discretization: a shortest-path problem on the (nx, ny, nTheta) grid
 * graph with edge weights equal to travel time under the
 * inscribed-diamond speed bound:
 *   - x-step at heading k: speed vx = vMax*|cos|/(|cos|+|sin|) <= vMax,
 *     cost dx / vx (edge absent when vx = 0: that heading cannot move
 *     along x at all — physically faithful);
 *   - y-step at heading k: symmetric with sin;
 *   - heading change: turn in place, cost dTheta / omegaMax.
 * The 1/(|cos|+|sin|) scaling inscribes the L1 speed diamond in the true
 * speed disc of radius vMax, so EVERY graph speed is physically
 * admissible and V >= V_true: we never claim a state is reachable faster
 * than physics allows — the safe direction for a safety certificate.
 * (The earlier L1 fast-sweeping PDE relaxation was optimistic by up to
 * sqrt(2) on diagonals; label-setting on explicit edges removes that
 * failure mode entirely — no convergence epsilon, no sweep cap.)
 *
 * Solver: Dijkstra with a Dial bucket queue (edge weights bounded and
 * positive; bucket width = minEdge/2, so every relaxation from the bucket
 * being drained lands at least two buckets ahead and the drained bucket
 * stays clean). Nodes settle once (closed flag). LIFO drain within a
 * bucket plus a fixed edge enumeration order keeps runs bit-identical —
 * determinism is a project doctrine.
 *
 * Memory layout: heading index k is FASTEST (idx = k + nTheta*(i + nx*j))
 * so all nTheta heading values of a spatial cell are contiguous.
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
  /** Heading bins covering [0, 2pi) (>= 1; 1 degenerates to
   *  x-axis-only motion — the k=0 heading has zero y-speed. Prefer
   *  >= 8 for meaningful reachability). */
  nTheta: number;
  /** Max planar speed, m/s. */
  vMax: number;
  /** Max heading rate, rad/s. */
  omegaMax: number;
  /** Hard-block cells closer than this to an obstacle (body inflation), m. */
  bodyRadius: number;
}

/** Target set: disc in the plane. */
export interface BRTTarget {
  center: Vec2;
  radius: number;
}

/** Solved time-to-reach field. time[k + nTheta*(i + nx*j)] in seconds, +inf unreachable. */
export interface BRTField {
  time: Float64Array;
  nx: number;
  ny: number;
  nTheta: number;
  bounds: AABB2D;
  dx: number;
  dy: number;
  dTheta: number;
  /** Diagnostics. */
  settledNodes: number;
  solveMs: number;
}

const TAU = Math.PI * 2;

/**
 * Solve the BRT. Deterministic: same inputs -> bit-identical field
 * (fixed edge order, deterministic bucket drain, pure typed arrays).
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
  const dx = (bounds.max[0] - bounds.min[0]) / (nx - 1);
  const dy = (bounds.max[1] - bounds.min[1]) / (ny - 1);
  const dTheta = TAU / nTheta;

  // Per-heading step costs from the inscribed-diamond speeds. An edge is
  // absent (cost +inf) when that heading has zero speed along the axis.
  const xStep = new Float64Array(nTheta);
  const yStep = new Float64Array(nTheta);
  const turnCost = dTheta / omegaMax;
  let minEdge = turnCost;
  for (let k = 0; k < nTheta; k++) {
    const c = Math.abs(Math.cos(k * dTheta));
    const s = Math.abs(Math.sin(k * dTheta));
    xStep[k] = c > 1e-12 ? (dx * (c + s)) / (vMax * c) : Number.POSITIVE_INFINITY;
    yStep[k] = s > 1e-12 ? (dy * (c + s)) / (vMax * s) : Number.POSITIVE_INFINITY;
    minEdge = Math.min(minEdge, xStep[k], yStep[k]);
  }

  // Blocked mask from the inflated SDF (fixed once; static obstacles only).
  const blocked = new Uint8Array(nx * ny);
  for (let j = 0; j < ny; j++) {
    const wy = bounds.min[1] + j * dy;
    for (let i = 0; i < nx; i++) {
      if (sdf(bounds.min[0] + i * dx, wy) < bodyRadius) blocked[i + nx * j] = 1;
    }
  }

  // Distances; layout k fastest. V = 0 on the target set, +inf elsewhere.
  const time = new Float64Array(nx * ny * nTheta);
  time.fill(Number.POSITIVE_INFINITY);
  const strideI = nTheta;
  const strideJ = nTheta * nx;
  for (let j = 0; j < ny; j++) {
    const wy = bounds.min[1] + j * dy;
    for (let i = 0; i < nx; i++) {
      if (blocked[i + nx * j]) continue;
      const ddx = bounds.min[0] + i * dx - target.center[0];
      const ddy = wy - target.center[1];
      if (Math.hypot(ddx, ddy) <= target.radius) {
        const base = i * strideI + j * strideJ;
        for (let k = 0; k < nTheta; k++) time[base + k] = 0;
      }
    }
  }

  const solveMsStart = performance.now();

  // Dial's bucket queue. Bucket b holds nodes with floor(t/width)==b at
  // push time; entries store the node only and the relax time is read
  // from time[node] at pop (a closed flag skips superseded entries).
  const width = minEdge / 2;
  const buckets: number[][] = [];
  let bucketBase = 0;
  const push = (t: number, node: number): void => {
    let b = Math.floor((t - bucketBase) / width);
    if (b < 0) b = 0;
    while (buckets.length <= b) buckets.push([]);
    buckets[b].push(node);
  };

  const totalNodes = nx * ny * nTheta;
  const closed = new Uint8Array(totalNodes);
  let settled = 0;

  // Seed: every target-set cell enters the queue at t=0; the main loop's
  // uniform relaxation handles their spatial and heading neighbors.
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      if (blocked[i + nx * j]) continue;
      const base = i * strideI + j * strideJ;
      if (!Number.isFinite(time[base])) continue;
      for (let k = 0; k < nTheta; k++) push(0, base + k);
    }
  }

  const relax = (from: number, to: number, w: number): void => {
    const nt = time[from] + w;
    if (nt < time[to]) {
      time[to] = nt;
      push(nt, to);
    }
  };

  for (;;) {
    // Retire empty leading buckets WITHOUT padding: when the frontier is
    // exhausted the array must be allowed to empty out, or this loop
    // would slide through padding forever.
    for (;;) {
      if (buckets.length === 0) {
        return {
          time,
          nx,
          ny,
          nTheta,
          bounds,
          dx,
          dy,
          dTheta,
          settledNodes: settled,
          solveMs: performance.now() - solveMsStart,
        };
      }
      if (buckets[0].length > 0) break;
      buckets.shift();
      bucketBase += width;
    }
    const bucket = buckets[0];
    // Drain by popping: every edge weight >= 2*width, so relaxations from
    // this bucket land strictly ahead of it and the draining bucket stays
    // clean. LIFO within a bucket is deterministic.
    while (bucket.length > 0) {
      const node = bucket.pop() as number;
      if (closed[node]) continue;
      closed[node] = 1;
      settled++;
      const k = node % nTheta;
      const rest = (node - k) / nTheta;
      const i = rest % nx;
      const j = (rest - i) / nx;
      const cell = i + nx * j;
      // Edge order fixed for determinism: x-, x+, y-, y+, turn-, turn+.
      if (i > 0 && !blocked[cell - 1] && Number.isFinite(xStep[k])) {
        relax(node, node - strideI, xStep[k]);
      }
      if (i < nx - 1 && !blocked[cell + 1] && Number.isFinite(xStep[k])) {
        relax(node, node + strideI, xStep[k]);
      }
      if (j > 0 && !blocked[cell - nx] && Number.isFinite(yStep[k])) {
        relax(node, node - strideJ, yStep[k]);
      }
      if (j < ny - 1 && !blocked[cell + nx] && Number.isFinite(yStep[k])) {
        relax(node, node + strideJ, yStep[k]);
      }
      relax(node, node - k + ((k - 1 + nTheta) % nTheta), turnCost);
      relax(node, node - k + ((k + 1) % nTheta), turnCost);
    }
  }
}

/** Sample the field at a world pose (nearest cell). +inf if unreachable/out of domain. */
export function sampleTimeAt(field: BRTField, x: number, y: number, theta: number): number {
  const { bounds, nx, ny, nTheta } = field;
  if (x < bounds.min[0] || x > bounds.max[0] || y < bounds.min[1] || y > bounds.max[1]) {
    return Number.POSITIVE_INFINITY;
  }
  const i = Math.min(Math.max(Math.round((x - bounds.min[0]) / field.dx), 0), nx - 1);
  const j = Math.min(Math.max(Math.round((y - bounds.min[1]) / field.dy), 0), ny - 1);
  const k = ((Math.round(theta / field.dTheta) % nTheta) + nTheta) % nTheta;
  return field.time[k + nTheta * (i + nx * j)];
}

/**
 * Static safety check for a rollout start: the pose must be reachable to
 * the target in finite time (certificate: a plan EXISTS under the bounded
 * dynamics). Rollout gating per the bead's design.
 */
export function isSafeStart(field: BRTField, x: number, y: number, theta: number): boolean {
  return Number.isFinite(sampleTimeAt(field, x, y, theta));
}
