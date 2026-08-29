import { describe, expect, it } from "bun:test";
import {
  ContactGraph,
  type RigidBody,
} from "../app/lib/contactGraph";
import {
  buildContactConstraints,
  solveLCP,
  stepPhysicsWorld,
  DEFAULT_LCP_CONFIG,
} from "../app/lib/lcpSolver";

describe("Sequential Impulse / Projected Gauss-Seidel (PGS) LCP Solver", () => {
  const createSphere = (
    id: string,
    pos: [number, number, number],
    vel: [number, number, number] = [0, 0, 0],
    r: number = 0.5,
    mass: number = 1.0
  ): RigidBody => ({
    id,
    isStatic: false,
    shape: { type: "sphere", radius: r },
    position: pos,
    rotation: [0, 0, 0],
    linearVelocity: vel,
    angularVelocity: [0, 0, 0],
    mass,
    invMass: 1.0 / mass,
    inertiaLocal: [0.1, 0.1, 0.1],
    invInertiaLocal: [10, 10, 10],
    friction: 0.5,
    restitution: 0.0,
  });

  const createFloor = (id: string = "floor"): RigidBody => ({
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

  describe("Normal Collision Resolution & Non-Penetration", () => {
    it("halts falling sphere and cancels downward velocity against floor", () => {
      const graph = new ContactGraph();
      const floor = createFloor("floor");
      // Sphere at z=0.45 (penetrating by 0.05), downward velocity -5 m/s
      const sphere = createSphere("sphere", [0, 0, 0.45], [0, 0, -5.0]);

      graph.addBody(floor);
      graph.addBody(sphere);

      const manifolds = graph.updateContacts();
      expect(manifolds.length).toBe(1);

      const bodiesMap = new Map<string, RigidBody>([
        ["floor", floor],
        ["sphere", sphere],
      ]);

      const constraints = buildContactConstraints(bodiesMap, manifolds, 0.01666);
      const res = solveLCP(bodiesMap, constraints);

      expect(res.converged).toBe(true);
      // Downward velocity must be stopped (v_z >= 0)
      expect(sphere.linearVelocity[2]).toBeGreaterThanOrEqual(0.0);
      expect(res.totalNormalImpulse).toBeGreaterThan(0.0);
    });
  });

  describe("Coulomb Friction Cones & Tangent Projection", () => {
    it("limits lateral friction impulse to mu * lambda_n", () => {
      const graph = new ContactGraph();
      const floor = createFloor("floor");
      // Sphere moving laterally at 10 m/s with downward velocity
      const sphere = createSphere("sphere", [0, 0, 0.45], [10.0, 0, -2.0]);
      sphere.friction = 0.4;
      floor.friction = 0.4; // combined friction = 0.4

      graph.addBody(floor);
      graph.addBody(sphere);

      const manifolds = graph.updateContacts();
      const bodiesMap = new Map<string, RigidBody>([
        ["floor", floor],
        ["sphere", sphere],
      ]);

      const constraints = buildContactConstraints(bodiesMap, manifolds, 0.01666);
      const res = solveLCP(bodiesMap, constraints);

      expect(res.converged).toBe(true);
      // Lateral friction impulse must be strictly bounded by friction * normal impulse
      const normalImpulse = constraints[0].contact.normalImpulse;
      const frictionImpulse = Math.abs(constraints[0].contact.tangentImpulse1);
      expect(frictionImpulse).toBeLessThanOrEqual(0.4 * normalImpulse + 1e-4);
    });
  });

  describe("Restitution & Elastic Bouncing", () => {
    it("reflects incoming velocity for high coefficient of restitution", () => {
      const graph = new ContactGraph();
      const floor = createFloor("floor");
      const sphere = createSphere("sphere", [0, 0, 0.45], [0, 0, -4.0]);
      sphere.restitution = 0.8;
      floor.restitution = 0.8;

      graph.addBody(floor);
      graph.addBody(sphere);

      const manifolds = graph.updateContacts();
      const bodiesMap = new Map<string, RigidBody>([
        ["floor", floor],
        ["sphere", sphere],
      ]);

      const constraints = buildContactConstraints(bodiesMap, manifolds, 0.01666);
      solveLCP(bodiesMap, constraints);

      // Rebounded velocity must be upward (~ 0.8 * 4.0 = +3.2 m/s)
      expect(sphere.linearVelocity[2]).toBeGreaterThan(2.5);
    });
  });

  describe("Warm-Starting & Multibody Stacking", () => {
    it("converges in fewer iterations with warm-started impulses", () => {
      const graph = new ContactGraph();
      const floor = createFloor("floor");
      const s1 = createSphere("s1", [0, 0, 0.45]); // on floor
      const s2 = createSphere("s2", [0, 0, 1.35]); // on s1

      graph.addBody(floor);
      graph.addBody(s1);
      graph.addBody(s2);

      const bodiesMap = new Map<string, RigidBody>([
        ["floor", floor],
        ["s1", s1],
        ["s2", s2],
      ]);

      // Step 1: Cold start
      const manifolds1 = graph.updateContacts();
      const constraints1 = buildContactConstraints(bodiesMap, manifolds1, 0.01666);
      const resCold = solveLCP(bodiesMap, constraints1);

      // Step 2: Warm start
      const manifolds2 = graph.updateContacts();
      const constraints2 = buildContactConstraints(bodiesMap, manifolds2, 0.01666);
      const resWarm = solveLCP(bodiesMap, constraints2);

      expect(resCold.converged).toBe(true);
      expect(resWarm.converged).toBe(true);
      expect(resWarm.iterationsTaken).toBeLessThanOrEqual(resCold.iterationsTaken);
    });
  });
});
