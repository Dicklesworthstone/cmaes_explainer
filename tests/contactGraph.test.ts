import { describe, expect, it } from "bun:test";
import {
  ContactGraph,
  computeBodyAABB,
  testAABBOverlap,
  collideSphereSphere,
  collideSphereBox,
  collideBodyPlane,
  type RigidBody,
} from "../app/lib/contactGraph";

describe("Multibody Contact Graph & Narrowphase Collision Engine", () => {
  const createSphere = (id: string, pos: [number, number, number], r: number = 0.5): RigidBody => ({
    id,
    isStatic: false,
    shape: { type: "sphere", radius: r },
    position: pos,
    rotation: [0, 0, 0],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 1.0,
    invMass: 1.0,
    inertiaLocal: [0.1, 0.1, 0.1],
    invInertiaLocal: [10, 10, 10],
    friction: 0.5,
    restitution: 0.2,
  });

  const createBox = (
    id: string,
    pos: [number, number, number],
    half: [number, number, number] = [0.5, 0.5, 0.5],
    rot: [number, number, number] = [0, 0, 0]
  ): RigidBody => ({
    id,
    isStatic: false,
    shape: { type: "box", halfExtents: half },
    position: pos,
    rotation: rot,
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 2.0,
    invMass: 0.5,
    inertiaLocal: [0.2, 0.2, 0.2],
    invInertiaLocal: [5, 5, 5],
    friction: 0.6,
    restitution: 0.1,
  });

  const createFloor = (id: string = "ground_plane"): RigidBody => ({
    id,
    isStatic: true,
    shape: { type: "plane", planeNormal: [0, 0, 1], planeOffset: 0.0 },
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 0,
    invMass: 0,
    inertiaLocal: [0, 0, 0],
    invInertiaLocal: [0, 0, 0],
    friction: 0.8,
    restitution: 0.0,
  });

  describe("Broadphase AABB Computations", () => {
    it("computes bounded AABBs for rotated boxes", () => {
      const box = createBox("b1", [1, 2, 3], [0.5, 0.5, 0.5], [0, 0, Math.PI / 4]);
      const aabb = computeBodyAABB(box, 0.01);

      // Width along X for 45 deg rotated box is sqrt(2)*0.5 approx 0.707
      expect(aabb.min[0]).toBeLessThan(1 - 0.7);
      expect(aabb.max[0]).toBeGreaterThan(1 + 0.7);
    });

    it("correctly identifies overlapping and separated AABBs", () => {
      const b1 = createSphere("s1", [0, 0, 0], 0.5);
      const b2 = createSphere("s2", [0.8, 0, 0], 0.5); // overlapping
      const b3 = createSphere("s3", [5.0, 0, 0], 0.5); // separated

      const aabb1 = computeBodyAABB(b1);
      const aabb2 = computeBodyAABB(b2);
      const aabb3 = computeBodyAABB(b3);

      expect(testAABBOverlap(aabb1, aabb2)).toBe(true);
      expect(testAABBOverlap(aabb1, aabb3)).toBe(false);
    });
  });

  describe("Narrowphase Collision Primitives", () => {
    it("detects Sphere vs Sphere collision with exact penetration", () => {
      const s1 = createSphere("s1", [0, 0, 0], 0.5);
      const s2 = createSphere("s2", [0.8, 0, 0], 0.5);

      const contact = collideSphereSphere(s1, s2);
      expect(contact).not.toBeNull();
      expect(contact!.penetrationDepth).toBeCloseTo(0.2, 5); // 0.5 + 0.5 - 0.8 = 0.2
      expect(contact!.normal[0]).toBeCloseTo(1.0, 5); // points from s1 to s2
    });

    it("detects Sphere vs Box collision with outward surface normal", () => {
      const s = createSphere("s1", [0, 0, 1.2], 0.5); // sphere center at z=1.2, radius 0.5 (bottom at z=0.7)
      const b = createBox("b1", [0, 0, 0], [1, 1, 0.5]); // box top at z=0.5

      // Penetration: 0.7 < 0.5 -> bottom penetrates by 0.5 - 0.7? Wait: bottom is at 0.7, top is at 0.5 -> separated by 0.2
      expect(collideSphereBox(s, b)).toBeNull();

      // Lower sphere to z=0.8: bottom is at z=0.3, top of box is at z=0.5 -> penetration = 0.2
      s.position = [0, 0, 0.8];
      const contact = collideSphereBox(s, b);
      expect(contact).not.toBeNull();
      expect(contact!.penetrationDepth).toBeCloseTo(0.2, 4);
      expect(contact!.normal[2]).toBeCloseTo(-1.0, 4); // from sphere toward box (-Z)
    });

    it("generates 4 corner contacts for flat box resting on floor plane", () => {
      const box = createBox("b1", [0, 0, 0.4], [0.5, 0.5, 0.5]); // halfZ=0.5, bottom at z=-0.1 -> penetrates floor at z=0
      const floor = createFloor("floor");

      const contacts = collideBodyPlane(box, floor);
      // All 4 bottom corners should penetrate the plane
      expect(contacts.length).toBe(4);
      for (const c of contacts) {
        expect(c.penetrationDepth).toBeCloseTo(0.1, 4);
        expect(c.normal[2]).toBeCloseTo(1.0, 4); // floor normal points up +Z
      }
    });
  });

  describe("ContactGraph Scene Updating & Warm-Starting Persistence", () => {
    it("detects multi-body contacts and preserves cached impulses across frames", () => {
      const graph = new ContactGraph();
      const floor = createFloor("ground");
      const sphere1 = createSphere("s1", [0, 0, 0.4], 0.5); // penetrates floor by 0.1
      const sphere2 = createSphere("s2", [0, 0, 1.2], 0.5); // penetrates s1 by 0.2 (0.4 + 0.5 + 0.5 = 1.4 > 1.2)

      graph.addBody(floor);
      graph.addBody(sphere1);
      graph.addBody(sphere2);

      // Frame 1: update contacts
      const manifoldsFrame1 = graph.updateContacts();
      expect(manifoldsFrame1.length).toBe(2); // s1 vs floor, s1 vs s2

      // Simulate solver caching normal impulse on s1 vs floor
      const findManifold = (list: typeof manifoldsFrame1, idA: string, idB: string) =>
        list.find((m) => (m.bodyAId === idA && m.bodyBId === idB) || (m.bodyAId === idB && m.bodyBId === idA));

      const floorContact = findManifold(manifoldsFrame1, "s1", "ground")?.contacts[0];
      expect(floorContact).toBeDefined();
      floorContact!.normalImpulse = 42.5;

      // Frame 2: update contacts again (bodies still colliding)
      const manifoldsFrame2 = graph.updateContacts();
      const floorContactFrame2 = findManifold(manifoldsFrame2, "s1", "ground")?.contacts[0];

      // Warm-start impulse should be seamlessly retained
      expect(floorContactFrame2?.normalImpulse).toBe(42.5);
    });
  });
});
