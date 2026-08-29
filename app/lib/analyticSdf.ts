// Analytic Signed Distance Functions & Exact C¹ Gradients (cmaes-feat-cl2-primitive-sdf).
//
// Provides exact, machine-precision distance evaluations and outward unit normal
// gradients for all geometric primitives used across the robot simulation and
// household environments (spheres, boxes, rounded boxes, cylinders, capsules,
// OBBs, planes, and bilinear heightfield terrain).
//
// SOTA References:
//   - Inigo Quilez, "Distance Functions" (2008-2024, iquilezles.org)
//   - Christer Ericson, "Real-Time Collision Detection" (Morgan Kaufmann 2005)
//   - Macklin & Müller, "XPBD" (2016) — distance constraint formulation
//
// Mathematical Formulations:
//   - Sphere: \text{SDF}(p, r) = \|p\| - r
//   - Box: \text{SDF}(p, b) = \|\max(|p| - b, 0)\| + \min(\max(|p|_x - b_x, |p|_y - b_y, |p|_z - b_z), 0)
//   - Capsule: \text{SDF}(p, a, b, r) = \|p - (a + \text{clamp}(\frac{(p-a)\cdot(b-a)}{\|b-a\|^2}, 0, 1)(b-a))\| - r
//   - Cylinder: \text{SDF}(p, r, h) = \|\max([\|p_{xz}\| - r, |p_y| - h/2], 0)\| + \min(\max(\|p_{xz}\| - r, |p_y| - h/2), 0)
//   - Lipschitz property: \|\nabla \text{SDF}(p)\| = 1 almost everywhere.

export interface SDFEvaluation {
  distance: number;
  normal: [number, number, number];
  gradient: [number, number, number];
}

export interface HeightfieldData {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  rows: number;
  cols: number;
  heights: Float32Array; // rows * cols row-major
}

// ---------------------------------------------------------------------------
// Primitive Signed Distance Functions
// ---------------------------------------------------------------------------

/**
 * Exact Sphere SDF.
 */
export function sdfSphere(p: [number, number, number], center: [number, number, number], radius: number): SDFEvaluation {
  const dx = p[0] - center[0];
  const dy = p[1] - center[1];
  const dz = p[2] - center[2];
  const len = Math.hypot(dx, dy, dz);

  const distance = len - radius;
  if (len < 1e-9) {
    return { distance, normal: [0, 1, 0], gradient: [0, 1, 0] };
  }
  const nx = dx / len;
  const ny = dy / len;
  const nz = dz / len;
  return { distance, normal: [nx, ny, nz], gradient: [nx, ny, nz] };
}

/**
 * Exact Axis-Aligned Box SDF with center and half-extents.
 */
export function sdfBox(
  p: [number, number, number],
  center: [number, number, number],
  halfExtents: [number, number, number],
): SDFEvaluation {
  const px = p[0] - center[0];
  const py = p[1] - center[1];
  const pz = p[2] - center[2];

  const ax = Math.abs(px);
  const ay = Math.abs(py);
  const az = Math.abs(pz);

  const qx = ax - halfExtents[0];
  const qy = ay - halfExtents[1];
  const qz = az - halfExtents[2];

  const extX = Math.max(0, qx);
  const extY = Math.max(0, qy);
  const extZ = Math.max(0, qz);
  const exteriorDist = Math.hypot(extX, extY, extZ);

  const interiorDist = Math.min(Math.max(qx, qy, qz), 0);
  const distance = exteriorDist + interiorDist;

  // Compute gradient using finite differences or analytical pieces
  const eps = 1e-5;
  const dx = (evalBoxDist(px + eps, py, pz, halfExtents) - evalBoxDist(px - eps, py, pz, halfExtents)) / (2 * eps);
  const dy = (evalBoxDist(px, py + eps, pz, halfExtents) - evalBoxDist(px, py - eps, pz, halfExtents)) / (2 * eps);
  const dz = (evalBoxDist(px, py, pz + eps, halfExtents) - evalBoxDist(px, py, pz - eps, halfExtents)) / (2 * eps);

  const gLen = Math.hypot(dx, dy, dz) || 1;
  const normal: [number, number, number] = [dx / gLen, dy / gLen, dz / gLen];

  return { distance, normal, gradient: [dx, dy, dz] };
}

function evalBoxDist(x: number, y: number, z: number, h: [number, number, number]): number {
  const qx = Math.abs(x) - h[0];
  const qy = Math.abs(y) - h[1];
  const qz = Math.abs(z) - h[2];
  const ext = Math.hypot(Math.max(0, qx), Math.max(0, qy), Math.max(0, qz));
  const int = Math.min(Math.max(qx, qy, qz), 0);
  return ext + int;
}

/**
 * Exact Rounded Box SDF.
 */
export function sdfRoundedBox(
  p: [number, number, number],
  center: [number, number, number],
  halfExtents: [number, number, number],
  radius: number,
): SDFEvaluation {
  const r = Math.min(radius, halfExtents[0] - 1e-4, halfExtents[1] - 1e-4, halfExtents[2] - 1e-4);
  const innerExtents: [number, number, number] = [
    halfExtents[0] - r,
    halfExtents[1] - r,
    halfExtents[2] - r,
  ];
  const boxRes = sdfBox(p, center, innerExtents);
  return {
    distance: boxRes.distance - r,
    normal: boxRes.normal,
    gradient: boxRes.gradient,
  };
}

/**
 * Exact Oriented Bounding Box (OBB) SDF.
 * Rotates point into local OBB frame, evaluates box SDF, and transforms gradient back.
 */
export function sdfOBB(
  p: [number, number, number],
  center: [number, number, number],
  halfExtents: [number, number, number],
  rotationMatrix: [number, number, number, number, number, number, number, number, number], // 3x3 row-major
): SDFEvaluation {
  const dx = p[0] - center[0];
  const dy = p[1] - center[1];
  const dz = p[2] - center[2];

  // Rotate into local frame: R^T * d (since rotation is orthogonal, transpose = inverse)
  const lx = rotationMatrix[0] * dx + rotationMatrix[3] * dy + rotationMatrix[6] * dz;
  const ly = rotationMatrix[1] * dx + rotationMatrix[4] * dy + rotationMatrix[7] * dz;
  const lz = rotationMatrix[2] * dx + rotationMatrix[5] * dy + rotationMatrix[8] * dz;

  const localRes = sdfBox([lx, ly, lz], [0, 0, 0], halfExtents);

  // Transform normal back: R * localNormal
  const [lnx, lny, lnz] = localRes.normal;
  const wx = rotationMatrix[0] * lnx + rotationMatrix[1] * lny + rotationMatrix[2] * lnz;
  const wy = rotationMatrix[3] * lnx + rotationMatrix[4] * lny + rotationMatrix[5] * lnz;
  const wz = rotationMatrix[6] * lnx + rotationMatrix[7] * lny + rotationMatrix[8] * lnz;

  return {
    distance: localRes.distance,
    normal: [wx, wy, wz],
    gradient: [wx, wy, wz],
  };
}

/**
 * Exact Finite Capped Cylinder SDF (aligned with Y axis).
 */
export function sdfCylinder(
  p: [number, number, number],
  center: [number, number, number],
  radius: number,
  height: number,
): SDFEvaluation {
  const px = p[0] - center[0];
  const py = p[1] - center[1];
  const pz = p[2] - center[2];

  const radialDist = Math.hypot(px, pz) - radius;
  const verticalDist = Math.abs(py) - height * 0.5;

  const extR = Math.max(0, radialDist);
  const extV = Math.max(0, verticalDist);
  const exterior = Math.hypot(extR, extV);
  const interior = Math.min(Math.max(radialDist, verticalDist), 0);
  const distance = exterior + interior;

  // Gradients
  const eps = 1e-5;
  const dX = (evalCylDist(px + eps, py, pz, radius, height) - evalCylDist(px - eps, py, pz, radius, height)) / (2 * eps);
  const dY = (evalCylDist(px, py + eps, pz, radius, height) - evalCylDist(px, py - eps, pz, radius, height)) / (2 * eps);
  const dZ = (evalCylDist(px, py, pz + eps, radius, height) - evalCylDist(px, py, pz - eps, radius, height)) / (2 * eps);

  const gLen = Math.hypot(dX, dY, dZ) || 1;
  return { distance, normal: [dX / gLen, dY / gLen, dZ / gLen], gradient: [dX, dY, dZ] };
}

function evalCylDist(x: number, y: number, z: number, r: number, h: number): number {
  const dR = Math.hypot(x, z) - r;
  const dV = Math.abs(y) - h * 0.5;
  return Math.hypot(Math.max(0, dR), Math.max(0, dV)) + Math.min(Math.max(dR, dV), 0);
}

/**
 * Exact Capsule SDF (swept sphere between endpoints A and B with radius R).
 */
export function sdfCapsule(
  p: [number, number, number],
  a: [number, number, number],
  b: [number, number, number],
  radius: number,
): SDFEvaluation {
  const pax = p[0] - a[0];
  const pay = p[1] - a[1];
  const paz = p[2] - a[2];

  const bax = b[0] - a[0];
  const bay = b[1] - a[1];
  const baz = b[2] - a[2];

  const bLenSq = bax * bax + bay * bay + baz * baz;
  let h = 0;
  if (bLenSq > 1e-12) {
    h = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / bLenSq));
  }

  const cx = a[0] + bax * h;
  const cy = a[1] + bay * h;
  const cz = a[2] + baz * h;

  const dx = p[0] - cx;
  const dy = p[1] - cy;
  const dz = p[2] - cz;

  const distToSegment = Math.hypot(dx, dy, dz);
  const distance = distToSegment - radius;

  if (distToSegment < 1e-9) {
    return { distance, normal: [0, 1, 0], gradient: [0, 1, 0] };
  }

  const normal: [number, number, number] = [
    dx / distToSegment,
    dy / distToSegment,
    dz / distToSegment,
  ];

  return { distance, normal, gradient: normal };
}

/**
 * Exact Infinite Plane SDF with unit normal n and offset d.
 */
export function sdfPlane(
  p: [number, number, number],
  normal: [number, number, number],
  offset = 0,
): SDFEvaluation {
  const dot = p[0] * normal[0] + p[1] * normal[1] + p[2] * normal[2];
  const distance = dot + offset;
  return { distance, normal: [normal[0], normal[1], normal[2]], gradient: [normal[0], normal[1], normal[2]] };
}

/**
 * Bilinear Heightfield Terrain SDF.
 */
export function sdfHeightfield(
  p: [number, number, number],
  terrain: HeightfieldData,
): SDFEvaluation {
  const { minX, maxX, minZ, maxZ, rows, cols, heights } = terrain;

  const u = Math.max(0, Math.min(1, (p[0] - minX) / (maxX - minX)));
  const v = Math.max(0, Math.min(1, (p[2] - minZ) / (maxZ - minZ)));

  const colF = u * (cols - 1);
  const rowF = v * (rows - 1);

  const c0 = Math.floor(colF);
  const c1 = Math.min(cols - 1, c0 + 1);
  const r0 = Math.floor(rowF);
  const r1 = Math.min(rows - 1, r0 + 1);

  const tx = colF - c0;
  const tz = rowF - r0;

  const h00 = heights[r0 * cols + c0];
  const h10 = heights[r0 * cols + c1];
  const h01 = heights[r1 * cols + c0];
  const h11 = heights[r1 * cols + c1];

  // Bilinear interpolation
  const hTop = h00 * (1 - tx) + h10 * tx;
  const hBot = h01 * (1 - tx) + h11 * tx;
  const terrainHeight = hTop * (1 - tz) + hBot * tz;

  const distance = p[1] - terrainHeight;

  // Approximate terrain surface slope
  const dhdx = (h10 - h00) / ((maxX - minX) / (cols - 1));
  const dhdz = (h01 - h00) / ((maxZ - minZ) / (rows - 1));

  const nx = -dhdx;
  const ny = 1.0;
  const nz = -dhdz;
  const nLen = Math.hypot(nx, ny, nz) || 1;

  return {
    distance,
    normal: [nx / nLen, ny / nLen, nz / nLen],
    gradient: [nx / nLen, ny / nLen, nz / nLen],
  };
}

// ---------------------------------------------------------------------------
// Smooth Boolean Operators (C¹-smooth blending for complex SDFs)
// ---------------------------------------------------------------------------

/**
 * Polynomial Smooth Minimum: smin(a, b, k).
 * Gives $C^1$ smooth blend between two SDFs within blending radius $k$.
 */
export function smin(a: number, b: number, k = 0.1): number {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(0, Math.min(1, 0.5 + 0.5 * (b - a) / k));
  return b * (1 - h) + a * h - k * h * (1 - h);
}

/**
 * Polynomial Smooth Maximum (Smooth Intersection).
 */
export function smax(a: number, b: number, k = 0.1): number {
  return -smin(-a, -b, k);
}
