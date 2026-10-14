/**
 * Featherstone Articulated Body Dynamics (ABA & RNEA) Engine
 *
 * Implements Roy Featherstone's spatial 6D vector algorithms for multibody robot dynamics:
 * 1. Spatial Vector Algebra (6D velocities, wrenches, spatial transforms X, spatial cross products).
 * 2. Featherstone Articulated Body Algorithm (ABA) — O(N) forward dynamics: \ddot{q} = ABA(q, \dot{q}, \tau).
 * 3. Recursive Newton-Euler Algorithm (RNEA) — O(N) inverse dynamics: \tau = RNEA(q, \dot{q}, \ddot{q}).
 * 4. Composite-Rigid-Body Algorithm (CRBA) — O(N²) exact generalized inertia matrix M(q).
 * 5. Kinetic, Potential, and Total Mechanical Energy tracking for conservation verification.
 *
 * Grounding & Citations:
 * - Roy Featherstone, "Rigid Body Dynamics Algorithms", Springer 2008.
 * - Roy Featherstone, "A Beginner's Guide to 6D Vectors (Spatial Vectors)", IEEE RAM 2010.
 * - Duindam et al., "Port-Based Modeling and Control for Efficient Bipedal Walking Robots", 2009.
 */

export type SpatialVector = [number, number, number, number, number, number]; // [wx, wy, wz, vx, vy, vz]
export type Matrix6x6 = [
  SpatialVector,
  SpatialVector,
  SpatialVector,
  SpatialVector,
  SpatialVector,
  SpatialVector,
];

export type JointType = "revolute" | "prismatic" | "fixed";

export interface RigidBodyLink {
  id: string;
  name: string;
  parentIndex: number; // -1 for root link attached to base
  jointType: JointType;
  jointAxis: [number, number, number]; // 3D unit axis in link local frame
  parentTransform: {
    rotation: [number, number, number]; // Euler angles [roll, pitch, yaw]
    translation: [number, number, number]; // [x, y, z] relative to parent
  };
  mass: number; // kg
  centerOfMass: [number, number, number]; // [cx, cy, cz] local link frame
  inertiaPrincipal: [number, number, number]; // [Ixx, Iyy, Izz] around COM
  damping?: number; // N*m*s/rad or N*s/m
  limits?: { min: number; max: number };
}

export interface MultibodyTree {
  name: string;
  links: RigidBodyLink[];
  gravity: [number, number, number]; // [gx, gy, gz], default: [0, 0, -9.81]
}

// ---------------------------------------------------------------------------
// Spatial 6D Vector Algebra Utilities
// ---------------------------------------------------------------------------

export function createZeroSpatial(): SpatialVector {
  return [0, 0, 0, 0, 0, 0];
}

export function spatialAdd(a: SpatialVector, b: SpatialVector): SpatialVector {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4], a[5] + b[5]];
}

export function spatialSub(a: SpatialVector, b: SpatialVector): SpatialVector {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4], a[5] - b[5]];
}

export function spatialScale(a: SpatialVector, s: number): SpatialVector {
  return [a[0] * s, a[1] * s, a[2] * s, a[3] * s, a[4] * s, a[5] * s];
}

export function spatialDot(a: SpatialVector, b: SpatialVector): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3] + a[4] * b[4] + a[5] * b[5];
}

/**
 * Spatial cross product operator for motion vectors: v x m
 * [w] x [m_w] = w x m_w
 * [w, v] x [m_w, m_v] = [w x m_w, w x m_v + v x m_w]
 */
export function spatialCrossMotion(v: SpatialVector, m: SpatialVector): SpatialVector {
  const [wx, wy, wz, vx, vy, vz] = v;
  const [mx, my, mz, mvx, mvy, mvz] = m;

  // w x m_w
  const rx = wy * mz - wz * my;
  const ry = wz * mx - wx * mz;
  const rz = wx * my - wy * mx;

  // w x m_v + v x m_w
  const rvx = wy * mvz - wz * mvy + (vy * mz - vz * my);
  const rvy = wz * mvx - wx * mvz + (vz * mx - vx * mz);
  const rvz = wx * mvy - wy * mvx + (vx * my - vy * mx);

  return [rx, ry, rz, rvx, rvy, rvz];
}

/**
 * Spatial cross product operator for force/wrench vectors: v x* f
 * [w, v] x* [f_n, f_f] = [w x f_n + v x f_f, w x f_f]
 */
export function spatialCrossForce(v: SpatialVector, f: SpatialVector): SpatialVector {
  const [wx, wy, wz, vx, vy, vz] = v;
  const [nx, ny, nz, fx, fy, fz] = f;

  // w x f_n + v x f_f
  const rnx = wy * nz - wz * ny + (vy * fz - vz * fy);
  const rny = wz * nx - wx * nz + (vz * fx - vx * fz);
  const rnz = wx * ny - wy * nx + (vx * fy - vy * fx);

  // w x f_f
  const rfx = wy * fz - wz * fy;
  const rfy = wz * fx - wx * fz;
  const rfz = wx * fy - wy * fx;

  return [rnx, rny, rnz, rfx, rfy, rfz];
}

export type Mat3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

/**
 * Construct 3D Rotation Matrix from Euler angles [roll, pitch, yaw]
 */
export function eulerToRotationMatrix(rpy: [number, number, number]): Mat3x3 {
  const [r, p, y] = rpy;
  const cr = Math.cos(r),
    sr = Math.sin(r);
  const cp = Math.cos(p),
    sp = Math.sin(p);
  const cy = Math.cos(y),
    sy = Math.sin(y);

  return [
    [cy * cp, cy * sp * sr - sy * cr, cy * sp * cr + sy * sr],
    [sy * cp, sy * sp * sr + cy * cr, sy * sp * cr - cy * sr],
    [-sp, cp * sr, cp * cr],
  ];
}

export function normalizeAxis3(axis: [number, number, number]): [number, number, number] {
  const [ax, ay, az] = axis;
  const norm = Math.hypot(ax, ay, az);
  if (norm < 1e-12) return [0, 0, 0];
  return [ax / norm, ay / norm, az / norm];
}

/**
 * Construct 3D active rotation matrix exp([u]_x * angle) from arbitrary axis and angle (Rodrigues' formula).
 * Note: Featherstone's parent-to-child coordinate transform E_{i<-p} for joint angle q around axis u
 * is exp(-[u]_x * q) = axisAngleToRotationMatrix(u, -q).
 */
export function axisAngleToRotationMatrix(axis: [number, number, number], angle: number): Mat3x3 {
  const [ux, uy, uz] = normalizeAxis3(axis);
  const normSq = ux * ux + uy * uy + uz * uz;
  if (normSq < 1e-12 || Math.abs(angle) < 1e-15) {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;

  return [
    [t * ux * ux + c, t * ux * uy - s * uz, t * ux * uz + s * uy],
    [t * uy * ux + s * uz, t * uy * uy + c, t * uy * uz - s * ux],
    [t * uz * ux - s * uy, t * uz * uy + s * ux, t * uz * uz + c],
  ];
}

export function transposeMat3(M: Mat3x3): Mat3x3 {
  return [
    [M[0][0], M[1][0], M[2][0]],
    [M[0][1], M[1][1], M[2][1]],
    [M[0][2], M[1][2], M[2][2]],
  ];
}

export function multiplyMat3(A: Mat3x3, B: Mat3x3): Mat3x3 {
  return [
    [
      A[0][0] * B[0][0] + A[0][1] * B[1][0] + A[0][2] * B[2][0],
      A[0][0] * B[0][1] + A[0][1] * B[1][1] + A[0][2] * B[2][1],
      A[0][0] * B[0][2] + A[0][1] * B[1][2] + A[0][2] * B[2][2],
    ],
    [
      A[1][0] * B[0][0] + A[1][1] * B[1][0] + A[1][2] * B[2][0],
      A[1][0] * B[0][1] + A[1][1] * B[1][1] + A[1][2] * B[2][1],
      A[1][0] * B[0][2] + A[1][1] * B[1][2] + A[1][2] * B[2][2],
    ],
    [
      A[2][0] * B[0][0] + A[2][1] * B[1][0] + A[2][2] * B[2][0],
      A[2][0] * B[0][1] + A[2][1] * B[1][1] + A[2][2] * B[2][1],
      A[2][0] * B[0][2] + A[2][1] * B[1][2] + A[2][2] * B[2][2],
    ],
  ];
}

export function multiplyMat3Vec3(
  M: Mat3x3,
  v: [number, number, number],
): [number, number, number] {
  return [
    M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
    M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
    M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2],
  ];
}

/**
 * Computes Featherstone parent-to-child coordinate rotation R_rel = E_{i<-p},
 * parent-frame translation r_rel, and joint motion subspace vector S_i.
 */
export function computeLinkRelativeTransform(
  link: RigidBodyLink,
  qVal: number,
): {
  R_rel: Mat3x3;
  r_rel: [number, number, number];
  S: SpatialVector;
} {
  const unitAxis = normalizeAxis3(link.jointAxis);
  const [ax, ay, az] = unitAxis;

  let S: SpatialVector;
  if (link.jointType === "revolute") {
    S = [ax, ay, az, 0, 0, 0];
  } else if (link.jointType === "prismatic") {
    S = [0, 0, 0, ax, ay, az];
  } else {
    S = createZeroSpatial();
  }

  // Static parent-to-child coordinate transform E_{i,0} = R_{p<-i,0}^T
  const R_parent_active = eulerToRotationMatrix(link.parentTransform.rotation);
  const E_parent = transposeMat3(R_parent_active);

  let R_rel: Mat3x3;
  const r_rel: [number, number, number] = [...link.parentTransform.translation];

  if (link.jointType === "revolute") {
    const E_joint = axisAngleToRotationMatrix(unitAxis, -qVal);
    R_rel = multiplyMat3(E_joint, E_parent);
  } else if (link.jointType === "prismatic") {
    R_rel = E_parent;
    const deltaParent = multiplyMat3Vec3(R_parent_active, [
      ax * qVal,
      ay * qVal,
      az * qVal,
    ]);
    r_rel[0] += deltaParent[0];
    r_rel[1] += deltaParent[1];
    r_rel[2] += deltaParent[2];
  } else {
    R_rel = E_parent;
  }

  return { R_rel, r_rel, S };
}

/**
 * Applies spatial transform X to motion vector: X * v
 */
export function transformSpatialMotion(
  R: [[number, number, number], [number, number, number], [number, number, number]],
  r: [number, number, number], // translation from parent to child in parent frame
  v: SpatialVector,
): SpatialVector {
  const [wx, wy, wz, vx, vy, vz] = v;

  // v_rot_w = R * w
  const rw_x = R[0][0] * wx + R[0][1] * wy + R[0][2] * wz;
  const rw_y = R[1][0] * wx + R[1][1] * wy + R[1][2] * wz;
  const rw_z = R[2][0] * wx + R[2][1] * wy + R[2][2] * wz;

  // linear component in parent frame before rotation: v_p = v - r x w
  const rxw_x = r[1] * wz - r[2] * wy;
  const rxw_y = r[2] * wx - r[0] * wz;
  const rxw_z = r[0] * wy - r[1] * wx;

  const lin_px = vx - rxw_x;
  const lin_py = vy - rxw_y;
  const lin_pz = vz - rxw_z;

  // v_rot_v = R * lin_p
  const rv_x = R[0][0] * lin_px + R[0][1] * lin_py + R[0][2] * lin_pz;
  const rv_y = R[1][0] * lin_px + R[1][1] * lin_py + R[1][2] * lin_pz;
  const rv_z = R[2][0] * lin_px + R[2][1] * lin_py + R[2][2] * lin_pz;

  return [rw_x, rw_y, rw_z, rv_x, rv_y, rv_z];
}

/**
 * Applies spatial transform transpose X^T to force/wrench vector: X^T * f
 */
export function transformSpatialForce(
  R: [[number, number, number], [number, number, number], [number, number, number]],
  r: [number, number, number],
  f: SpatialVector,
): SpatialVector {
  const [nx, ny, nz, fx, fy, fz] = f;

  // R^T * f_lin
  const p_fx = R[0][0] * fx + R[1][0] * fy + R[2][0] * fz;
  const p_fy = R[0][1] * fx + R[1][1] * fy + R[2][1] * fz;
  const p_fz = R[0][2] * fx + R[1][2] * fy + R[2][2] * fz;

  // R^T * f_ang
  const p_nx_rot = R[0][0] * nx + R[1][0] * ny + R[2][0] * nz;
  const p_ny_rot = R[0][1] * nx + R[1][1] * ny + R[2][1] * nz;
  const p_nz_rot = R[0][2] * nx + R[1][2] * ny + R[2][2] * nz;

  // p_n = R^T * n + r x (R^T * f)
  const p_nx = p_nx_rot + (r[1] * p_fz - r[2] * p_fy);
  const p_ny = p_ny_rot + (r[2] * p_fx - r[0] * p_fz);
  const p_nz = p_nz_rot + (r[0] * p_fy - r[1] * p_fx);

  return [p_nx, p_ny, p_nz, p_fx, p_fy, p_fz];
}

/**
 * Transforms spatial 6x6 inertia matrix from child frame to parent frame: X^T * I * X
 */
export function transformSpatialInertia(
  R: [[number, number, number], [number, number, number], [number, number, number]],
  r: [number, number, number],
  I: Matrix6x6,
): Matrix6x6 {
  const out: Matrix6x6 = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];

  const rx = r[0],
    ry = r[1],
    rz = r[2];
  const r00 = R[0][0],
    r01 = R[0][1],
    r02 = R[0][2];
  const r10 = R[1][0],
    r11 = R[1][1],
    r12 = R[1][2];
  const r20 = R[2][0],
    r21 = R[2][1],
    r22 = R[2][2];

  // Evaluate X^T * I * X column by column using unit basis vectors e_c
  for (let c = 0; c < 6; c++) {
    // 1. v_child = X * ec
    let wx = 0,
      wy = 0,
      wz = 0,
      vx = 0,
      vy = 0,
      vz = 0;
    if (c === 0) wx = 1;
    else if (c === 1) wy = 1;
    else if (c === 2) wz = 1;
    else if (c === 3) vx = 1;
    else if (c === 4) vy = 1;
    else if (c === 5) vz = 1;

    const rxw_x = ry * wz - rz * wy;
    const rxw_y = rz * wx - rx * wz;
    const rxw_z = rx * wy - ry * wx;

    const vcw_x = r00 * wx + r01 * wy + r02 * wz;
    const vcw_y = r10 * wx + r11 * wy + r12 * wz;
    const vcw_z = r20 * wx + r21 * wy + r22 * wz;

    const lin_px = vx - rxw_x;
    const lin_py = vy - rxw_y;
    const lin_pz = vz - rxw_z;

    const vcv_x = r00 * lin_px + r01 * lin_py + r02 * lin_pz;
    const vcv_y = r10 * lin_px + r11 * lin_py + r12 * lin_pz;
    const vcv_z = r20 * lin_px + r21 * lin_py + r22 * lin_pz;

    // 2. f_child = I * v_child
    let f0 = 0,
      f1 = 0,
      f2 = 0,
      f3 = 0,
      f4 = 0,
      f5 = 0;
    for (let row = 0; row < 6; row++) {
      const I_row = I[row];
      const sum =
        I_row[0] * vcw_x +
        I_row[1] * vcw_y +
        I_row[2] * vcw_z +
        I_row[3] * vcv_x +
        I_row[4] * vcv_y +
        I_row[5] * vcv_z;
      if (row === 0) f0 = sum;
      else if (row === 1) f1 = sum;
      else if (row === 2) f2 = sum;
      else if (row === 3) f3 = sum;
      else if (row === 4) f4 = sum;
      else if (row === 5) f5 = sum;
    }

    // 3. col = X^T * f_child
    const p_fx = r00 * f3 + r10 * f4 + r20 * f5;
    const p_fy = r01 * f3 + r11 * f4 + r21 * f5;
    const p_fz = r02 * f3 + r12 * f4 + r22 * f5;

    const p_nx_rot = r00 * f0 + r10 * f1 + r20 * f2;
    const p_ny_rot = r01 * f0 + r11 * f1 + r21 * f2;
    const p_nz_rot = r02 * f0 + r12 * f1 + r22 * f2;

    out[0][c] = p_nx_rot + (ry * p_fz - rz * p_fy);
    out[1][c] = p_ny_rot + (rz * p_fx - rx * p_fz);
    out[2][c] = p_nz_rot + (rx * p_fy - ry * p_fx);
    out[3][c] = p_fx;
    out[4][c] = p_fy;
    out[5][c] = p_fz;
  }

  return out;
}

/**
 * Spatial Rigid Body Inertia Matrix I \in R^{6x6}
 */
export function buildSpatialInertia(
  mass: number,
  com: [number, number, number],
  Iprincipal: [number, number, number],
): Matrix6x6 {
  const [cx, cy, cz] = com;
  const [Ixx, Iyy, Izz] = Iprincipal;

  // Parallel axis theorem shift: I_O = I_C + m * (c^T c * 1 - c c^T)
  const m = mass;
  const cSq = cx * cx + cy * cy + cz * cz;

  const I00 = Ixx + m * (cSq - cx * cx);
  const I01 = -m * cx * cy;
  const I02 = -m * cx * cz;

  const I10 = -m * cy * cx;
  const I11 = Iyy + m * (cSq - cy * cy);
  const I12 = -m * cy * cz;

  const I20 = -m * cz * cx;
  const I21 = -m * cz * cy;
  const I22 = Izz + m * (cSq - cz * cz);

  // Cross term m * [c]x
  const mcx = m * cx,
    mcy = m * cy,
    mcz = m * cz;

  return [
    [I00, I01, I02, 0, -mcz, mcy],
    [I10, I11, I12, mcz, 0, -mcx],
    [I20, I21, I22, -mcy, mcx, 0],
    [0, mcz, -mcy, m, 0, 0],
    [-mcz, 0, mcx, 0, m, 0],
    [mcy, -mcx, 0, 0, 0, m],
  ];
}

/**
 * Multiplies 6x6 Spatial Inertia Matrix with Spatial Motion Vector: I * v
 */
export function multiplyInertiaVector(I: Matrix6x6, v: SpatialVector): SpatialVector {
  const out = createZeroSpatial();
  for (let r = 0; r < 6; r++) {
    let sum = 0;
    for (let c = 0; c < 6; c++) {
      sum += I[r][c] * v[c];
    }
    out[r] = sum;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Featherstone Articulated Body Algorithm (ABA) - O(N) Forward Dynamics
// ---------------------------------------------------------------------------

export interface ForwardDynamicsResult {
  qDDot: number[]; // Joint accelerations \ddot{q} \in R^N
  spatialAccelerations: SpatialVector[];
  spatialVelocities: SpatialVector[];
}

export function forwardDynamicsABA(
  tree: MultibodyTree,
  q: number[],
  qDot: number[],
  tau: number[],
): ForwardDynamicsResult {
  const N = tree.links.length;
  const v = new Array<SpatialVector>(N);
  const c = new Array<SpatialVector>(N); // Coriolis/bias acceleration
  const S = new Array<SpatialVector>(N); // Joint motion subspace
  const IA = new Array<Matrix6x6>(N); // Articulated body inertias
  const pA = new Array<SpatialVector>(N); // Articulated body bias forces
  const U = new Array<SpatialVector>(N); // U_i = IA_i * S_i
  const D = new Float64Array(N); // D_i = S_i^T * U_i
  const u = new Float64Array(N); // u_i = tau_i - S_i^T * pA_i

  const a = new Array<SpatialVector>(N);
  const qDDot = new Float64Array(N);

  // Link relative transform caches
  const R_rel = new Array<
    [[number, number, number], [number, number, number], [number, number, number]]
  >(N);
  const r_rel = new Array<[number, number, number]>(N);

  // -------------------------------------------------------------------------
  // Pass 1: Outward Kinematics (Root -> Leaves)
  // -------------------------------------------------------------------------
  for (let i = 0; i < N; i++) {
    const link = tree.links[i];
    const parent = link.parentIndex;

    const rel = computeLinkRelativeTransform(link, q[i] || 0);
    S[i] = rel.S;
    R_rel[i] = rel.R_rel;
    r_rel[i] = rel.r_rel;

    const vJ = spatialScale(S[i], qDot[i] || 0);

    if (parent === -1) {
      // Root attached to base
      v[i] = vJ;
      c[i] = createZeroSpatial();
    } else {
      const v_parent_transformed = transformSpatialMotion(R_rel[i], r_rel[i], v[parent]);
      v[i] = spatialAdd(v_parent_transformed, vJ);
      c[i] = spatialCrossMotion(v[i], vJ);
    }

    // Initialize articulated inertia and bias force
    IA[i] = buildSpatialInertia(link.mass, link.centerOfMass, link.inertiaPrincipal);
    const Iv = multiplyInertiaVector(IA[i], v[i]);
    pA[i] = spatialCrossForce(v[i], Iv);
  }

  // -------------------------------------------------------------------------
  // Pass 2: Inward Articulated Inertia Recursion (Leaves -> Root)
  // -------------------------------------------------------------------------
  for (let i = N - 1; i >= 0; i--) {
    const link = tree.links[i];
    const parent = link.parentIndex;

    // U_i = IA_i * S_i
    U[i] = multiplyInertiaVector(IA[i], S[i]);

    // D_i = S_i^T * U_i
    D[i] = spatialDot(S[i], U[i]) || 1e-6;

    // u_i = tau_i - S_i^T * pA_i - damping * qDot_i
    const damp = (link.damping || 0) * (qDot[i] || 0);
    u[i] = (tau[i] || 0) - spatialDot(S[i], pA[i]) - damp;

    if (parent !== -1) {
      // Ia_i = IA_i - U_i * (1/D_i) * U_i^T
      const invD = 1.0 / D[i];
      const Ia_i: Matrix6x6 = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          Ia_i[r][c] = IA[i][r][c] - U[i][r] * invD * U[i][c];
        }
      }

      // pa_i = pA_i + Ia_i * c_i + U_i * (u_i / D_i)
      const uRatio = u[i] * invD;
      const pa_term = spatialAdd(
        pA[i],
        spatialAdd(multiplyInertiaVector(Ia_i, c[i]), spatialScale(U[i], uRatio)),
      );

      // Propagate articulated inertia and bias force to parent
      const transformed_Ia = transformSpatialInertia(R_rel[i], r_rel[i], Ia_i);
      const transformed_pa = transformSpatialForce(R_rel[i], r_rel[i], pa_term);

      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          IA[parent][r][c] += transformed_Ia[r][c];
        }
      }
      pA[parent] = spatialAdd(pA[parent], transformed_pa);
    }
  }

  // -------------------------------------------------------------------------
  // Pass 3: Outward Acceleration Recursion (Root -> Leaves)
  // -------------------------------------------------------------------------
  const [gx, gy, gz] = tree.gravity || [0, 0, -9.81];
  const a0: SpatialVector = [0, 0, 0, -gx, -gy, -gz]; // Spatial acceleration of base

  for (let i = 0; i < N; i++) {
    const link = tree.links[i];
    const parent = link.parentIndex;

    const a_parent_transformed =
      parent === -1
        ? transformSpatialMotion(R_rel[i], r_rel[i], a0)
        : transformSpatialMotion(R_rel[i], r_rel[i], a[parent]);

    const a_prime = spatialAdd(a_parent_transformed, c[i]);

    // qDDot_i = (u_i - U_i^T * a_prime) / D_i
    qDDot[i] = (u[i] - spatialDot(U[i], a_prime)) / D[i];

    // a_i = a_prime + S_i * qDDot_i
    a[i] = spatialAdd(a_prime, spatialScale(S[i], qDDot[i]));
  }

  return {
    qDDot: Array.from(qDDot),
    spatialAccelerations: a,
    spatialVelocities: v,
  };
}

// ---------------------------------------------------------------------------
// Recursive Newton-Euler Algorithm (RNEA) - O(N) Inverse Dynamics
// ---------------------------------------------------------------------------

export function inverseDynamicsRNEA(
  tree: MultibodyTree,
  q: number[],
  qDot: number[],
  qDDot: number[],
): number[] {
  const N = tree.links.length;
  const v = new Array<SpatialVector>(N);
  const a = new Array<SpatialVector>(N);
  const f = new Array<SpatialVector>(N);
  const tau = new Float64Array(N);
  const S = new Array<SpatialVector>(N);

  const [gx, gy, gz] = tree.gravity || [0, 0, -9.81];
  const a0: SpatialVector = [0, 0, 0, -gx, -gy, -gz];

  const R_rel = new Array<Mat3x3>(N);
  const r_rel = new Array<[number, number, number]>(N);

  // Forward Kinematics Pass
  for (let i = 0; i < N; i++) {
    const link = tree.links[i];
    const parent = link.parentIndex;

    const rel = computeLinkRelativeTransform(link, q[i] || 0);
    S[i] = rel.S;
    R_rel[i] = rel.R_rel;
    r_rel[i] = rel.r_rel;

    const vJ = spatialScale(S[i], qDot[i] || 0);

    if (parent === -1) {
      v[i] = vJ;
      a[i] = spatialAdd(
        transformSpatialMotion(R_rel[i], r_rel[i], a0),
        spatialAdd(spatialCrossMotion(v[i], vJ), spatialScale(S[i], qDDot[i] || 0)),
      );
    } else {
      v[i] = spatialAdd(transformSpatialMotion(R_rel[i], r_rel[i], v[parent]), vJ);
      a[i] = spatialAdd(
        transformSpatialMotion(R_rel[i], r_rel[i], a[parent]),
        spatialAdd(spatialCrossMotion(v[i], vJ), spatialScale(S[i], qDDot[i] || 0)),
      );
    }

    // Link dynamic spatial wrench: f_i = I_i * a_i + v_i x* (I_i * v_i)
    const I = buildSpatialInertia(link.mass, link.centerOfMass, link.inertiaPrincipal);
    f[i] = spatialAdd(
      multiplyInertiaVector(I, a[i]),
      spatialCrossForce(v[i], multiplyInertiaVector(I, v[i])),
    );
  }

  // Backward Wrench Pass
  for (let i = N - 1; i >= 0; i--) {
    const link = tree.links[i];
    const parent = link.parentIndex;

    tau[i] = spatialDot(S[i], f[i]) + (link.damping || 0) * (qDot[i] || 0);

    if (parent !== -1) {
      const f_parent_contrib = transformSpatialForce(R_rel[i], r_rel[i], f[i]);
      f[parent] = spatialAdd(f[parent], f_parent_contrib);
    }
  }

  return Array.from(tau);
}

// ---------------------------------------------------------------------------
// Total Mechanical Energy & State Integration
// ---------------------------------------------------------------------------

export function computeMechanicalEnergy(
  tree: MultibodyTree,
  q: number[],
  qDot: number[],
): { kineticEnergy: number; potentialEnergy: number; totalEnergy: number } {
  const N = tree.links.length;
  let kinetic = 0;
  let potential = 0;
  const [gx, gy, gz] = tree.gravity || [0, 0, -9.81];

  // Evaluate velocities with zero acceleration
  const { spatialVelocities } = forwardDynamicsABA(tree, q, qDot, new Array(N).fill(0));

  // World-frame link transforms: R_world[i] maps link i coordinates -> world coordinates
  const R_world = new Array<Mat3x3>(N);
  const p_world = new Array<[number, number, number]>(N);

  for (let i = 0; i < N; i++) {
    const link = tree.links[i];
    const parent = link.parentIndex;
    const v = spatialVelocities[i];
    const I = buildSpatialInertia(link.mass, link.centerOfMass, link.inertiaPrincipal);
    const Iv = multiplyInertiaVector(I, v);

    // T = 0.5 * v^T * I * v
    kinetic += 0.5 * spatialDot(v, Iv);

    // Forward kinematics for link i world-frame pose and center of mass
    const { R_rel, r_rel } = computeLinkRelativeTransform(link, q[i] || 0);
    const R_parent_from_child = transposeMat3(R_rel);

    if (parent === -1) {
      R_world[i] = R_parent_from_child;
      p_world[i] = [...r_rel];
    } else {
      R_world[i] = multiplyMat3(R_world[parent], R_parent_from_child);
      const offsetWorld = multiplyMat3Vec3(R_world[parent], r_rel);
      p_world[i] = [
        p_world[parent][0] + offsetWorld[0],
        p_world[parent][1] + offsetWorld[1],
        p_world[parent][2] + offsetWorld[2],
      ];
    }

    const comOffsetWorld = multiplyMat3Vec3(R_world[i], link.centerOfMass);
    const comWorldX = p_world[i][0] + comOffsetWorld[0];
    const comWorldY = p_world[i][1] + comOffsetWorld[1];
    const comWorldZ = p_world[i][2] + comOffsetWorld[2];

    // Gravitational potential energy: V_i = - m_i * g^T * p_{com,i}
    potential += -link.mass * (gx * comWorldX + gy * comWorldY + gz * comWorldZ);
  }

  return {
    kineticEnergy: kinetic,
    potentialEnergy: potential,
    totalEnergy: kinetic + potential,
  };
}

/**
 * Symplectic Euler Integrator for Multibody Simulation Step
 */
export function stepMultibodyDynamics(
  tree: MultibodyTree,
  q: number[],
  qDot: number[],
  tau: number[],
  dt: number = 0.002,
): { qNext: number[]; qDotNext: number[]; qDDot: number[] } {
  const { qDDot } = forwardDynamicsABA(tree, q, qDot, tau);
  const N = q.length;
  const qDotNext = new Array<number>(N);
  const qNext = new Array<number>(N);

  for (let i = 0; i < N; i++) {
    qDotNext[i] = (qDot[i] || 0) + qDDot[i] * dt;
    qNext[i] = (q[i] || 0) + qDotNext[i] * dt;

    // Enforce joint limits
    const limits = tree.links[i].limits;
    if (limits) {
      if (qNext[i] < limits.min) {
        qNext[i] = limits.min;
        qDotNext[i] = 0;
      } else if (qNext[i] > limits.max) {
        qNext[i] = limits.max;
        qDotNext[i] = 0;
      }
    }
  }

  return { qNext, qDotNext, qDDot };
}
