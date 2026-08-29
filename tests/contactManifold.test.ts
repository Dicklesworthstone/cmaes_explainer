import { describe, expect, test } from "bun:test";
import {
  collideBoxBox,
  collideSphereBox,
  collideSphereSphere,
  computeTangentBasis,
  type ContactPoint,
  type RigidBodyState,
  resolveContactImpulse,
} from "../app/lib/contactManifold";

describe("Contact Manifold & Penetration Depth", () => {
  test("computes orthonormal tangent basis for contact normals", () => {
    const normals: Array<[number, number, number]> = [
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
      [0.577, 0.577, 0.577],
    ];

    for (const n of normals) {
      const len = Math.hypot(n[0], n[1], n[2]);
      const unitN: [number, number, number] = [n[0] / len, n[1] / len, n[2] / len];

      const { tangent1, tangent2 } = computeTangentBasis(unitN);

      // Tangents must be unit length
      expect(Math.hypot(...tangent1)).toBeCloseTo(1.0, 4);
      expect(Math.hypot(...tangent2)).toBeCloseTo(1.0, 4);

      // Tangents must be perpendicular to normal
      const dotN1 = unitN[0] * tangent1[0] + unitN[1] * tangent1[1] + unitN[2] * tangent1[2];
      const dotN2 = unitN[0] * tangent2[0] + unitN[1] * tangent2[1] + unitN[2] * tangent2[2];
      expect(dotN1).toBeCloseTo(0.0, 4);
      expect(dotN2).toBeCloseTo(0.0, 4);

      // Tangents must be mutually orthogonal
      const dot12 = tangent1[0] * tangent2[0] + tangent1[1] * tangent2[1] + tangent1[2] * tangent2[2];
      expect(dot12).toBeCloseTo(0.0, 4);
    }
  });

  test("sphere-sphere collision reports correct MTV and penetration", () => {
    const manifold = collideSphereSphere([0, 0, 0], 1.0, [1.5, 0, 0], 1.0);
    expect(manifold.hasCollision).toBe(true);
    expect(manifold.maxPenetration).toBeCloseTo(0.5, 4); // 2.0 - 1.5 = 0.5
    expect(manifold.normal[0]).toBeCloseTo(-1.0, 4);
    expect(manifold.mtv[0]).toBeCloseTo(-0.5, 4);

    // Separated spheres
    const separated = collideSphereSphere([0, 0, 0], 1.0, [3.0, 0, 0], 1.0);
    expect(separated.hasCollision).toBe(false);
  });

  test("sphere-box collision detects contact on face", () => {
    // Box at origin half-extents [1, 1, 1], Sphere at (1.5, 0, 0) radius 1.0
    const manifold = collideSphereBox([1.5, 0, 0], 1.0, [0, 0, 0], [1, 1, 1]);
    expect(manifold.hasCollision).toBe(true);
    expect(manifold.maxPenetration).toBeCloseTo(0.5, 4); // Penetrates face by 0.5
    expect(manifold.normal[0]).toBeCloseTo(1.0, 4);
  });

  test("box-box collision generates 4-point contact patch", () => {
    // Box A on top of Box B penetrating by 0.1
    const manifold = collideBoxBox([0, 1.9, 0], [1, 1, 1], [0, 0, 0], [1, 1, 1]);
    expect(manifold.hasCollision).toBe(true);
    expect(manifold.maxPenetration).toBeCloseTo(0.1, 4);
    expect(manifold.contacts.length).toBe(4);
    expect(manifold.normal[1]).toBeCloseTo(1.0, 4);
  });

  test("resolves contact impulses with restitution and friction cone limit", () => {
    const bodyA: RigidBodyState = {
      position: [0, 0, 0],
      velocity: [0, -2.0, 1.0], // Moving down and sideways
      angularVelocity: [0, 0, 0],
      mass: 2.0,
      invMass: 0.5,
      invInertiaWorld: [[0.5, 0, 0], [0, 0.5, 0], [0, 0, 0.5]],
    };

    const bodyB: RigidBodyState = {
      position: [0, -1, 0],
      velocity: [0, 0, 0], // Static ground
      angularVelocity: [0, 0, 0],
      mass: 1e9,
      invMass: 0,
      invInertiaWorld: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    };

    const contact: ContactPoint = {
      positionA: [0, 0, 0],
      positionB: [0, 0, 0],
      normal: [0, 1, 0],
      penetrationDepth: 0.05,
      tangent1: [1, 0, 0],
      tangent2: [0, 0, 1],
    };

    const impulse = resolveContactImpulse(bodyA, bodyB, contact, 0.5, 0.3);
    expect(impulse.normalImpulse).toBeGreaterThan(0);

    // Friction impulse should be clamped by Coulomb cone \mu * J_n
    const maxFriction = 0.3 * impulse.normalImpulse;
    const tanLen = Math.hypot(...impulse.tangentImpulse);
    expect(tanLen).toBeLessThanOrEqual(maxFriction + 1e-5);
  });
});
