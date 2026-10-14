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
import type { RigidBody } from "../app/lib/contactGraph";
import {
  createHouseholdWorld,
  type HouseholdBodyMeta,
  type HouseholdWorld,
  stepHouseholdPhysicsWorld,
} from "../app/lib/householdPhysicsWorld";

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
    expect(totalSleepTransitions).toBeGreaterThan(0);
  });

  test("rolling-flagged chair gets rollingContactDynamics integrator applied", () => {
    const plane = PLANE("ground");
    const chair = CHAIR("roller", [0, 0, 0.3], 2.0);
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("roller", { boundingRadius: 0.3, material: "hardwood", rolling: true });
    const world = createHouseholdWorld([plane, chair], meta, { dt: 1 / 60 });

    const lastPos = chair.position[0];
    for (let t = 0; t < 60; t++) stepHouseholdPhysicsWorld(world);
    const r = world.contactGraph.getBody("roller")!;
    expect(r.position[0]).toBeGreaterThan(lastPos);
    expect(Number.isFinite(r.position[0])).toBe(true);
  });

  test("CCD pipeline runs for fast bodies; clamps TOI and reflects velocity instead of tunneling through ground SDF", () => {
    const plane = PLANE("ground");
    // At z = 1.0m with vz = -200 m/s and dt = 1/60s, discrete Euler would step to z = -2.333m (tunneling!)
    const chair = CHAIR("fast", [0, 0, 1.0], 0);
    chair.linearVelocity = [0, 0, -200];
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("fast", { boundingRadius: 0.3, material: "hardwood" });
    const world = createHouseholdWorld([plane, chair], meta, { dt: 1 / 60 });
    const r = stepHouseholdPhysicsWorld(world);

    expect(r.ccdImpacts.length).toBe(1);
    expect(r.ccdImpacts[0].bodyId).toBe("fast");
    expect(r.ccdImpacts[0].result.hasImpact).toBe(true);
    expect(r.ccdImpacts[0].result.timeOfImpact).toBeGreaterThan(0);
    expect(r.ccdImpacts[0].result.timeOfImpact).toBeLessThan(1);

    const endChair = world.contactGraph.getBody("fast")!;
    // Clamped above floor surface (z >= radius) and reflected upward
    expect(endChair.position[2]).toBeGreaterThanOrEqual(0.3);
    expect(endChair.linearVelocity[2]).toBeGreaterThan(0);
  });

  test("high-speed sphere does not tunnel through a thin vertical panel SDF", () => {
    const plane = PLANE("ground");
    // Sphere at x = 0.2m, z = 1.0m fired at vx = +120 m/s (sweeps 2.0m in 1/60s) toward a 4cm thin wall at x = 1.0m
    const fastBall = CHAIR("fast_ball", [0.2, 0, 1.0], 120);
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("fast_ball", { boundingRadius: 0.2, material: "hardwood" });
    const thinPanelSdf = (pos: [number, number, number]) => {
      const dx = pos[0] - 1.0;
      const wallHalfThickness = 0.02;
      const wallDist = Math.abs(dx) - wallHalfThickness;
      const floorDist = pos[2];
      if (wallDist <= floorDist) {
        return {
          distance: wallDist,
          gradient: [dx >= 0 ? 1 : -1, 0, 0] as [number, number, number],
        };
      }
      return { distance: floorDist, gradient: [0, 0, 1] as [number, number, number] };
    };
    const world = createHouseholdWorld([plane, fastBall], meta, {
      dt: 1 / 60,
      sdf: thinPanelSdf,
    });
    const r = stepHouseholdPhysicsWorld(world);

    expect(r.ccdImpacts.length).toBe(1);
    const updated = world.contactGraph.getBody("fast_ball")!;
    // Must stay on the near side (x <= 1.0 - 0.02 - 0.2 + tol) and rebound in -X
    expect(updated.position[0]).toBeLessThan(0.85);
    expect(updated.linearVelocity[0]).toBeLessThan(0);
  });

  test("enforces single-time-step gravity and position integration without double-stepping across sub-integrators", () => {
    const plane = PLANE("ground");
    const dt = 1 / 60;
    const g = -9.81;
    // Start well in the air (z = 3.0m) with rolling enabled so all three passes (LCP, restitution, rolling) are active
    const airborne = CHAIR("airborne", [0, 0, 3.0], 1.2);
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("airborne", { boundingRadius: 0.3, material: "hardwood", rolling: true });
    const world = createHouseholdWorld([plane, airborne], meta, {
      dt,
      gravity: [0, 0, g],
    });

    stepHouseholdPhysicsWorld(world);
    const updated = world.contactGraph.getBody("airborne")!;
    // Exact single symplectic Euler step: vz = g * dt, z = 3.0 + vz * dt, x = 0 + 1.2 * dt
    expect(updated.linearVelocity[2]).toBeCloseTo(g * dt, 9);
    expect(updated.position[2]).toBeCloseTo(3.0 + g * dt * dt, 9);
    expect(updated.position[0]).toBeCloseTo(1.2 * dt, 9);
  });

  test("refuses unconverged LCP step and preserves last valid position when solver budget is exhausted", () => {
    const plane = PLANE("ground");
    // Penetrating initial contact (z = 0.20m < radius 0.30m) with 1 iteration and strict tolerance forces non-convergence
    const chair = CHAIR("unconverged_chair", [0.5, -0.25, 0.2], 2.0);
    chair.linearVelocity = [2.0, 0, -3.0];
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("unconverged_chair", { boundingRadius: 0.3, material: "hardwood" });
    const world = createHouseholdWorld([plane, chair], meta, {
      dt: 1 / 60,
      ccdSpeedThreshold: 100, // keep below CCD so LCP handles the contact
      lcpConfig: {
        iterations: 1,
        tolerance: 1e-12,
        baumgarteBeta: 0.2,
        penetrationSlop: 0.005,
        restitutionVelocityThreshold: 0.5,
      },
    });

    const r = stepHouseholdPhysicsWorld(world);
    expect(r.lcpConverged).toBe(false);
    expect(r.stepRefused).toBe(true);
    expect(r.lcpMaxResidual).toBeGreaterThan(0);

    const updated = world.contactGraph.getBody("unconverged_chair")!;
    // Position is rolled back to the pre-step snapshot instead of advancing with unconverged velocity
    expect(updated.position).toEqual([0.5, -0.25, 0.2]);
    // Downward penetrating velocity is clamped
    expect(updated.linearVelocity[2]).toBeGreaterThanOrEqual(0);
  });
});
