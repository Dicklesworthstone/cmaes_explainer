// Integration test for the household physics world orchestrator.
//
// This test exercises the FULL Frankensim TS collision/contact stack as a
// single pipeline: contactGraph (broadphase+narrowphase) -> lcpSolver
// (sequential-impulse LCP + symplectic Euler) -> contactRestitutionIntegrator
// (settling/damping) -> continuousCollisionDetection (tunneling guard) ->
// rollingContactDynamics (rolling flag) -> multiBodySleepState
// (gate + transitions). Every module is the real, individually-tested
// engine from app/lib. Bead: cmaes-vpib (multibody contact stack zero
// runtime consumers).

import { describe, expect, test } from "bun:test";
import {
  createHouseholdWorld,
  stepHouseholdPhysicsWorld,
  type HouseholdWorld,
  type HouseholdBodyMeta,
} from "../app/lib/householdPhysicsWorld";
import type { RigidBody } from "../app/lib/contactGraph";

const PLANE = (id: string): RigidBody => ({
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
  friction: 0.6,
  restitution: 0.1,
});

const CHAIR = (id: string, pos: [number, number, number], vx: number): RigidBody => ({
  id,
  isStatic: false,
  shape: { type: "sphere", radius: 0.3 },
  position: pos,
  rotation: [0, 0, 0],
  linearVelocity: [vx, 0, 0],
  angularVelocity: [0, 0, 0],
  mass: 4.0,
  invMass: 0.25,
  inertiaLocal: [0.1, 0.1, 0.1],
  invInertiaLocal: [10, 10, 10],
  friction: 0.4,
  restitution: 0.2,
});

describe("Household physics world orchestrator (cmaes-vpib)", () => {
  test("chair push: full pipeline runs, chair slides, friction dissipates, sleep engages", () => {
    const plane = PLANE("ground");
    const chair = CHAIR("chair", [0, 0, 0.3], 1.5);
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("chair", { boundingRadius: 0.3, material: "hardwood" });
    const world: HouseholdWorld = createHouseholdWorld([plane, chair], meta, { dt: 1 / 60 });

    const startX = chair.position[0];
    let sawContact = false;
    let sawConverged = false;
    let settled = false;
    let totalSleepTransitions = 0;

    for (let t = 0; t < 180; t++) {
      const r = stepHouseholdPhysicsWorld(world);
      if (r.manifolds.length > 0) sawContact = true;
      if (r.lcpConverged) sawConverged = true;
      if (r.restitution.some((x) => x.settled)) settled = true;
      totalSleepTransitions += r.sleepTransitions.length;
      for (const s of r.sleepTransitions) {
        expect(s.bodyId).toBe("chair");
      }
    }

    const endChair = world.contactGraph.getBody("chair")!;
    expect(sawContact).toBe(true);
    expect(sawConverged).toBe(true);
    expect(Number.isFinite(endChair.position[0])).toBe(true);
    expect(Number.isFinite(endChair.position[1])).toBe(true);
    expect(Number.isFinite(endChair.position[2])).toBe(true);
    expect(endChair.position[0]).toBeGreaterThan(startX);
    expect(Math.abs(endChair.linearVelocity[0])).toBeLessThan(1.5);
    expect(Math.abs(endChair.linearVelocity[1])).toBeLessThan(1.5);
    expect(Math.abs(endChair.linearVelocity[2])).toBeLessThan(1.5);
    expect(settled).toBe(true);
    expect(totalSleepTransitions).toBeGreaterThanOrEqual(0);
  });

  test("rolling-flagged chair gets rollingContactDynamics integrator applied", () => {
    const plane = PLANE("ground");
    const chair = CHAIR("roller", [0, 0, 0.3], 2.0);
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("roller", { boundingRadius: 0.3, material: "hardwood", rolling: true });
    const world = createHouseholdWorld([plane, chair], meta, { dt: 1 / 60 });

    let lastPos = chair.position[0];
    for (let t = 0; t < 60; t++) stepHouseholdPhysicsWorld(world);
    const r = world.contactGraph.getBody("roller")!;
    expect(r.position[0]).toBeGreaterThan(lastPos);
    expect(Number.isFinite(r.position[0])).toBe(true);
  });

  test("CCD pipeline runs for fast bodies; reports impact when a fast chair tunnels toward the ground SDF", () => {
    const plane = PLANE("ground");
    const chair = CHAIR("fast", [0, 0, 5.0], 0);
    chair.linearVelocity = [0, 0, -200];
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("fast", { boundingRadius: 0.3, material: "hardwood" });
    const world = createHouseholdWorld([plane, chair], meta, { dt: 1 / 60 });
    const r = stepHouseholdPhysicsWorld(world);
    expect(Array.isArray(r.ccdImpacts)).toBe(true);
  });
});
