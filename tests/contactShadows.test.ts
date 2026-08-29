import { describe, expect, test } from "bun:test";
import {
  computePcssPenumbra,
  evaluateFloorContactAO,
  evaluateSdfSoftShadow,
  type GroundContactCaster,
} from "../app/lib/contactShadows";

describe("Contact & Soft Shadows Engine", () => {
  // Simple SDF sphere obstacle at (0, 2, 0) with radius 0.5
  const sphereSdf = (p: [number, number, number]): number => {
    const dx = p[0] - 0;
    const dy = p[1] - 2;
    const dz = p[2] - 0;
    return Math.hypot(dx, dy, dz) - 0.5;
  };

  test("evaluateSdfSoftShadow returns 1.0 when ray is completely unblocked", () => {
    // Light is in +Y direction, ray starts at (5, 0, 0) far from obstacle
    const res = evaluateSdfSoftShadow([5, 0, 0], [0, 1, 0], sphereSdf);
    expect(res.shadowFactor).toBeCloseTo(1.0, 2);
    expect(res.closestDistance).toBeGreaterThan(4.0);
  });

  test("evaluateSdfSoftShadow returns 0.0 when ray passes directly through obstacle center", () => {
    // Ray starts at (0, 0, 0) pointing up +Y directly through sphere at (0, 2, 0)
    const res = evaluateSdfSoftShadow([0, 0, 0], [0, 1, 0], sphereSdf);
    expect(res.shadowFactor).toBe(0.0);
    expect(res.closestDistance).toBe(0.0);
  });

  test("evaluateSdfSoftShadow produces smooth penumbra on glancing rays", () => {
    // Ray starts at (0.6, 0, 0) pointing up +Y, passing just outside the sphere boundary (radius 0.5)
    const res = evaluateSdfSoftShadow([0.6, 0, 0], [0, 1, 0], sphereSdf, 0.02, 10.0, 16.0);
    expect(res.shadowFactor).toBeGreaterThan(0.0);
    expect(res.shadowFactor).toBeLessThan(1.0);
    expect(res.penumbraWidth).toBeGreaterThan(0.0);
  });

  test("computePcssPenumbra widens penumbra as receiver moves further from blocker", () => {
    const p1 = computePcssPenumbra(3.0, 1.0, 0.2); // dReceiver = 3, dBlocker = 1 -> ratio 2.0
    const p2 = computePcssPenumbra(5.0, 1.0, 0.2); // dReceiver = 5, dBlocker = 1 -> ratio 4.0

    expect(p2).toBeGreaterThan(p1);
    expect(computePcssPenumbra(1.0, 2.0, 0.2)).toBe(0.0); // receiver in front of blocker
  });

  test("evaluateFloorContactAO creates dark contact shadow beneath resting feet and legs", () => {
    const tableLegs: GroundContactCaster[] = [
      { id: "leg1", position: [-1.0, 0.0, -1.0], radius: 0.06, occlusionStrength: 0.9 },
      { id: "leg2", position: [1.0, 0.0, -1.0], radius: 0.06, occlusionStrength: 0.9 },
      { id: "leg3", position: [-1.0, 0.0, 1.0], radius: 0.06, occlusionStrength: 0.9 },
      { id: "leg4", position: [1.0, 0.0, 1.0], radius: 0.06, occlusionStrength: 0.9 },
    ];

    // Point directly under leg 1 -> should have strong contact occlusion
    const directContact = evaluateFloorContactAO([-1.0, 0.0, -1.0], tableLegs);
    expect(directContact).toBeLessThan(0.2); // >80% occluded

    // Point in center of room far from legs -> unoccluded
    const farPoint = evaluateFloorContactAO([0.0, 0.0, 0.0], tableLegs);
    expect(farPoint).toBeCloseTo(1.0, 2);

    // Lifting leg off the floor should diminish the contact shadow
    const liftedLeg: GroundContactCaster[] = [
      { id: "foot", position: [0.0, 0.3, 0.0], radius: 0.1, fadeHeight: 0.25 },
    ];
    const liftedContact = evaluateFloorContactAO([0.0, 0.0, 0.0], liftedLeg);
    expect(liftedContact).toBe(1.0); // completely faded since height (0.3m) > fadeHeight (0.25m)
  });
});
