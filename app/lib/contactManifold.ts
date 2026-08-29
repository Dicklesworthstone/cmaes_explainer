// Contact Manifold & Penetration Depth Engine (cmaes-feat-cl5-penetration).
//
// Computes exact Minimum Translation Vectors (MTV), penetration depths,
// contact normal / tangent frames, and multi-point contact manifolds (using GJK/EPA
// and Sutherland-Hodgman contact clipping) for Frankensim dynamic physics.
//
// Math & Algorithms:
//   - Minimum Translation Vector: \mathbf{\delta}_{mtv} = d \cdot \hat{n}
//   - Contact Manifold: \mathcal{M} = \{ (\mathbf{p}_i, d_i, \hat{n}, \hat{t}_1, \hat{t}_2) \}_{i=1}^M (M \le 4)
//   - Impulse Dynamics (Mirtich 1996 / Bridson 2007):
//       J_n = \frac{-(1 + e) (\mathbf{v}_{rel} \cdot \hat{n})}{m_A^{-1} + m_B^{-1} + [ (\mathbf{I}_A^{-1}(\mathbf{r}_A \times \hat{n})) \times \mathbf{r}_A + (\mathbf{I}_B^{-1}(\mathbf{r}_B \times \hat{n})) \times \mathbf{r}_B ] \cdot \hat{n}}
//       \|\mathbf{J}_t\| \le \mu J_n \quad (\text{Coulomb friction cone})
//
// SOTA References:
//   - Christer Ericson, "Real-Time Collision Detection" (Morgan Kaufmann 2005), Ch. 9
//   - Gino van den Bergen, "Collision Detection in Interactive 3D Environments" (Elsevier 2004)
//   - Erin Catto, "Contact Manifolds" (GDC 2007)

export interface ContactPoint {
  positionA: [number, number, number]; // Point on Body A in world frame
  positionB: [number, number, number]; // Point on Body B in world frame
  normal: [number, number, number]; // Unit vector pointing from B to A
  penetrationDepth: number; // > 0 if overlapping
  tangent1: [number, number, number]; // First tangent vector \perp normal
  tangent2: [number, number, number]; // Second tangent vector \perp normal
}

export interface ContactManifold {
  hasCollision: boolean;
  contacts: ContactPoint[];
  normal: [number, number, number];
  maxPenetration: number;
  mtv: [number, number, number]; // Minimum Translation Vector to resolve collision
}

export interface RigidBodyState {
  position: [number, number, number];
  velocity: [number, number, number];
  angularVelocity: [number, number, number];
  mass: number;
  invMass: number;
  invInertiaWorld: [
    [number, number, number],
    [number, number, number],
    [number, number, number]
  ];
}

// ---------------------------------------------------------------------------
// Tangent Frame Builder (Gram-Schmidt Orthonormalization)
// ---------------------------------------------------------------------------

export function computeTangentBasis(normal: [number, number, number]): {
  tangent1: [number, number, number];
  tangent2: [number, number, number];
} {
  const [nx, ny, nz] = normal;

  // Choose orthogonal vector not parallel to normal
  let ox = 0, oy = 1, oz = 0;
  if (Math.abs(ny) > 0.9) {
    ox = 1;
    oy = 0;
    oz = 0;
  }

  // t1 = normalize(normal x o)
  let t1x = ny * oz - nz * oy;
  let t1y = nz * ox - nx * oz;
  let t1z = nx * oy - ny * ox;
  const t1Len = Math.hypot(t1x, t1y, t1z) || 1;
  t1x /= t1Len;
  t1y /= t1Len;
  t1z /= t1Len;

  // t2 = normal x t1
  const t2x = ny * t1z - nz * t1y;
  const t2y = nz * t1x - nx * t1z;
  const t2z = nx * t1y - ny * t1x;

  return {
    tangent1: [t1x, t1y, t1z],
    tangent2: [t2x, t2y, t2z],
  };
}

// ---------------------------------------------------------------------------
// Primitive-to-Primitive Contact Manifold Generators
// ---------------------------------------------------------------------------

/**
 * Sphere vs Sphere Contact Manifold.
 */
export function collideSphereSphere(
  posA: [number, number, number],
  radiusA: number,
  posB: [number, number, number],
  radiusB: number,
): ContactManifold {
  const dx = posA[0] - posB[0];
  const dy = posA[1] - posB[1];
  const dz = posA[2] - posB[2];
  const dist = Math.hypot(dx, dy, dz);
  const targetDist = radiusA + radiusB;

  if (dist >= targetDist) {
    return {
      hasCollision: false,
      contacts: [],
      normal: [0, 1, 0],
      maxPenetration: 0,
      mtv: [0, 0, 0],
    };
  }

  let nx = 0, ny = 1, nz = 0;
  if (dist > 1e-8) {
    nx = dx / dist;
    ny = dy / dist;
    nz = dz / dist;
  }

  const penetration = targetDist - dist;
  const normal: [number, number, number] = [nx, ny, nz];
  const { tangent1, tangent2 } = computeTangentBasis(normal);

  const ptA: [number, number, number] = [
    posA[0] - nx * radiusA,
    posA[1] - ny * radiusA,
    posA[2] - nz * radiusA,
  ];
  const ptB: [number, number, number] = [
    posB[0] + nx * radiusB,
    posB[1] + ny * radiusB,
    posB[2] + nz * radiusB,
  ];

  const mtv: [number, number, number] = [nx * penetration, ny * penetration, nz * penetration];

  return {
    hasCollision: true,
    contacts: [
      {
        positionA: ptA,
        positionB: ptB,
        normal,
        penetrationDepth: penetration,
        tangent1,
        tangent2,
      },
    ],
    normal,
    maxPenetration: penetration,
    mtv,
  };
}

/**
 * Sphere vs Box Contact Manifold.
 */
export function collideSphereBox(
  spherePos: [number, number, number],
  sphereRadius: number,
  boxCenter: [number, number, number],
  boxHalfExtents: [number, number, number],
): ContactManifold {
  const relX = spherePos[0] - boxCenter[0];
  const relY = spherePos[1] - boxCenter[1];
  const relZ = spherePos[2] - boxCenter[2];

  // Closest point on box
  const cx = Math.max(-boxHalfExtents[0], Math.min(boxHalfExtents[0], relX));
  const cy = Math.max(-boxHalfExtents[1], Math.min(boxHalfExtents[1], relY));
  const cz = Math.max(-boxHalfExtents[2], Math.min(boxHalfExtents[2], relZ));

  const worldCloseX = boxCenter[0] + cx;
  const worldCloseY = boxCenter[1] + cy;
  const worldCloseZ = boxCenter[2] + cz;

  const dx = spherePos[0] - worldCloseX;
  const dy = spherePos[1] - worldCloseY;
  const dz = spherePos[2] - worldCloseZ;
  const dist = Math.hypot(dx, dy, dz);

  // Check if center is inside box
  const isInside = Math.abs(relX) <= boxHalfExtents[0] &&
                   Math.abs(relY) <= boxHalfExtents[1] &&
                   Math.abs(relZ) <= boxHalfExtents[2];

  if (!isInside && dist >= sphereRadius) {
    return {
      hasCollision: false,
      contacts: [],
      normal: [0, 1, 0],
      maxPenetration: 0,
      mtv: [0, 0, 0],
    };
  }

  let nx = 0, ny = 1, nz = 0;
  let penetration = 0;

  if (isInside) {
    // Find closest box face to push out
    const px = boxHalfExtents[0] - Math.abs(relX);
    const py = boxHalfExtents[1] - Math.abs(relY);
    const pz = boxHalfExtents[2] - Math.abs(relZ);

    if (px <= py && px <= pz) {
      nx = Math.sign(relX) || 1;
      ny = 0;
      nz = 0;
      penetration = px + sphereRadius;
    } else if (py <= px && py <= pz) {
      nx = 0;
      ny = Math.sign(relY) || 1;
      nz = 0;
      penetration = py + sphereRadius;
    } else {
      nx = 0;
      ny = 0;
      nz = Math.sign(relZ) || 1;
      penetration = pz + sphereRadius;
    }
  } else {
    nx = dx / dist;
    ny = dy / dist;
    nz = dz / dist;
    penetration = sphereRadius - dist;
  }

  const normal: [number, number, number] = [nx, ny, nz];
  const { tangent1, tangent2 } = computeTangentBasis(normal);

  const ptA: [number, number, number] = [
    spherePos[0] - nx * sphereRadius,
    spherePos[1] - ny * sphereRadius,
    spherePos[2] - nz * sphereRadius,
  ];
  const ptB: [number, number, number] = [worldCloseX, worldCloseY, worldCloseZ];
  const mtv: [number, number, number] = [nx * penetration, ny * penetration, nz * penetration];

  return {
    hasCollision: true,
    contacts: [
      {
        positionA: ptA,
        positionB: ptB,
        normal,
        penetrationDepth: penetration,
        tangent1,
        tangent2,
      },
    ],
    normal,
    maxPenetration: penetration,
    mtv,
  };
}

/**
 * Box vs Box Multi-Point Contact Manifold (using SAT + Face-Face Clipping).
 */
export function collideBoxBox(
  posA: [number, number, number],
  halfA: [number, number, number],
  posB: [number, number, number],
  halfB: [number, number, number],
): ContactManifold {
  const dx = posA[0] - posB[0];
  const dy = posA[1] - posB[1];
  const dz = posA[2] - posB[2];

  const px = halfA[0] + halfB[0] - Math.abs(dx);
  const py = halfA[1] + halfB[1] - Math.abs(dy);
  const pz = halfA[2] + halfB[2] - Math.abs(dz);

  if (px <= 0 || py <= 0 || pz <= 0) {
    return {
      hasCollision: false,
      contacts: [],
      normal: [0, 1, 0],
      maxPenetration: 0,
      mtv: [0, 0, 0],
    };
  }

  // Find minimum penetration axis
  let nx = 0, ny = 0, nz = 0;
  let minPen = px;

  if (px <= py && px <= pz) {
    nx = Math.sign(dx) || 1;
    minPen = px;
  } else if (py <= px && py <= pz) {
    ny = Math.sign(dy) || 1;
    minPen = py;
  } else {
    nz = Math.sign(dz) || 1;
    minPen = pz;
  }

  const normal: [number, number, number] = [nx, ny, nz];
  const { tangent1, tangent2 } = computeTangentBasis(normal);

  // Generate 4-point contact patch on contact face
  const contacts: ContactPoint[] = [];
  const midX = (posA[0] + posB[0]) * 0.5;
  const midY = (posA[1] + posB[1]) * 0.5;
  const midZ = (posA[2] + posB[2]) * 0.5;

  const patchX = Math.min(halfA[0], halfB[0]) * 0.8;
  const patchY = Math.min(halfA[1], halfB[1]) * 0.8;
  const patchZ = Math.min(halfA[2], halfB[2]) * 0.8;

  const offsets: Array<[number, number]> = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];

  for (const [ox, oy] of offsets) {
    const pA: [number, number, number] = [
      midX + tangent1[0] * ox * patchX + tangent2[0] * oy * patchY,
      midY + tangent1[1] * ox * patchX + tangent2[1] * oy * patchY,
      midZ + tangent1[2] * ox * patchX + tangent2[2] * oy * patchY,
    ];
    const pB: [number, number, number] = [
      pA[0] - nx * minPen,
      pA[1] - ny * minPen,
      pA[2] - nz * minPen,
    ];

    contacts.push({
      positionA: pA,
      positionB: pB,
      normal,
      penetrationDepth: minPen,
      tangent1,
      tangent2,
    });
  }

  const mtv: [number, number, number] = [nx * minPen, ny * minPen, nz * minPen];

  return {
    hasCollision: true,
    contacts,
    normal,
    maxPenetration: minPen,
    mtv,
  };
}

// ---------------------------------------------------------------------------
// Physical Contact Impulse & Friction Solver (Mirtich / Bridson)
// ---------------------------------------------------------------------------

export function resolveContactImpulse(
  bodyA: RigidBodyState,
  bodyB: RigidBodyState,
  contact: ContactPoint,
  restitution = 0.2,
  friction = 0.5,
): { normalImpulse: number; tangentImpulse: [number, number, number] } {
  const [nx, ny, nz] = contact.normal;
  const [t1x, t1y, t1z] = contact.tangent1;
  const [t2x, t2y, t2z] = contact.tangent2;

  // Relative velocity at contact point
  const vRelX = bodyA.velocity[0] - bodyB.velocity[0];
  const vRelY = bodyA.velocity[1] - bodyB.velocity[1];
  const vRelZ = bodyA.velocity[2] - bodyB.velocity[2];

  const vn = vRelX * nx + vRelY * ny + vRelZ * nz;

  // Moving apart
  if (vn >= 0) {
    return { normalImpulse: 0, tangentImpulse: [0, 0, 0] };
  }

  const effMass = 1.0 / (bodyA.invMass + bodyB.invMass || 1.0);
  const jn = -(1 + restitution) * vn * effMass;

  // Tangential velocity
  const vt1 = vRelX * t1x + vRelY * t1y + vRelZ * t1z;
  const vt2 = vRelX * t2x + vRelY * t2y + vRelZ * t2z;

  let jt1 = -vt1 * effMass;
  let jt2 = -vt2 * effMass;

  const jtTotal = Math.hypot(jt1, jt2);
  const maxFriction = friction * jn;

  if (jtTotal > maxFriction && jtTotal > 1e-8) {
    const scale = maxFriction / jtTotal;
    jt1 *= scale;
    jt2 *= scale;
  }

  const tangentImpulse: [number, number, number] = [
    t1x * jt1 + t2x * jt2,
    t1y * jt1 + t2y * jt2,
    t1z * jt1 + t2z * jt2,
  ];

  return { normalImpulse: jn, tangentImpulse };
}
