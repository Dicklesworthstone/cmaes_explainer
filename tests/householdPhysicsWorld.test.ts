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

  test("negative control: sub-threshold impact on breakable ceramic plate leaves body intact without spawning fragments", () => {
    const plane = PLANE("ground");
    const plate: RigidBody = {
      ...CHAIR("ceramic_plate", [0, 0, 0.12], 0.1),
      shape: { type: "sphere", radius: 0.12 },
      mass: 0.5,
      invMass: 2.0,
      linearVelocity: [0.1, 0, -0.4], // Low impact impulse: ~0.25 N*s << 4.0 N*s threshold
    };
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("ceramic_plate", {
      boundingRadius: 0.12,
      material: "ceramic",
      breakable: true,
      breakImpulseThresholdNs: 4.0,
      fragmentCount: 4,
    });
    const world = createHouseholdWorld([plane, plate], meta, { dt: 1 / 60 });

    const r = stepHouseholdPhysicsWorld(world);
    expect(r.breakageEvents.length).toBe(0);
    expect(world.meta.get("ceramic_plate")?.broken).not.toBe(true);
    expect(world.contactGraph.getBody("ceramic_plate")).toBeDefined();
  });

  test("super-threshold impact shatters breakable body, conserves fragment mass and momentum, and is idempotent across steps", () => {
    const plane = PLANE("ground");
    const vase: RigidBody = {
      ...CHAIR("glass_vase", [0, 0, 0.25], 1.2),
      shape: { type: "sphere", radius: 0.15 },
      mass: 1.2,
      invMass: 1 / 1.2,
      linearVelocity: [1.2, -0.4, -12.0], // High downward impact (> 14 N*s > 3.5 N*s threshold)
    };
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("glass_vase", {
      boundingRadius: 0.15,
      material: "glass",
      breakable: true,
      breakImpulseThresholdNs: 3.5,
      fragmentCount: 4,
    });
    const world = createHouseholdWorld([plane, vase], meta, { dt: 1 / 60 });

    const r1 = stepHouseholdPhysicsWorld(world);
    expect(r1.breakageEvents.length).toBe(1);
    const ev = r1.breakageEvents[0];
    expect(ev.parentBodyId).toBe("glass_vase");
    expect(ev.impactImpulseNs).toBeGreaterThan(ev.thresholdNs);
    expect(ev.fragmentIds.length).toBe(4);

    // Exact mass conservation: \sum m_k == m_parent
    expect(Math.abs(ev.fragmentMassSumKg - ev.parentMassKg)).toBeLessThan(1e-12);

    // Exact linear momentum conservation at fracture instant: \sum m_k v_k == m_parent v_post
    expect(ev.fragmentMomentumSum[0]).toBeCloseTo(ev.parentMomentumAfterImpact[0], 9);
    expect(ev.fragmentMomentumSum[1]).toBeCloseTo(ev.parentMomentumAfterImpact[1], 9);
    expect(ev.fragmentMomentumSum[2]).toBeCloseTo(ev.parentMomentumAfterImpact[2], 9);

    // Parent collider and sleep entry removed and replaced by 4 live fragments
    expect(world.contactGraph.getBody("glass_vase")).toBeUndefined();
    expect(world.sleep.getBody("glass_vase")).toBeUndefined();
    let liveFragMass = 0;
    for (const fid of ev.fragmentIds) {
      const frag = world.contactGraph.getBody(fid);
      expect(frag).toBeDefined();
      expect(world.sleep.getBody(fid)).toBeDefined();
      liveFragMass += frag!.mass;
    }
    expect(liveFragMass).toBeCloseTo(1.2, 12);

    // Idempotency: stepping additional frames never re-shatters the parent or fragments
    for (let t = 0; t < 15; t++) {
      const rt = stepHouseholdPhysicsWorld(world);
      expect(rt.breakageEvents.length).toBe(0);
    }
  });

  test("articulated furniture integration steps joint dynamics with receipts and forward kinematics", () => {
    const plane = PLANE("ground");
    const fridge: RigidBody = {
      ...CHAIR("kitchen_fridge", [1.0, 0, 0.9], 0),
      isStatic: true,
      mass: 0,
      invMass: 0,
    };
    const meta = new Map<string, HouseholdBodyMeta>();
    meta.set("kitchen_fridge", {
      boundingRadius: 0.6,
      material: "steel",
      articulationKind: "fridge",
      articulationDimensions: [0.9, 0.8, 1.8],
    });
    const articulationInputs = new Map<string, Record<string, number>>();
    articulationInputs.set("kitchen_fridge", {
      upper_door_hinge: 2.5,
      lower_door_hinge: 1.5,
    });
    const world = createHouseholdWorld([plane, fridge], meta, {
      dt: 1 / 60,
      articulationInputs,
    });

    const stepRes = stepHouseholdPhysicsWorld(world);
    const fridgeReceipts = stepRes.articulationReceipts.get("kitchen_fridge");
    const fridgePoses = stepRes.articulationLinkPoses.get("kitchen_fridge");
    expect(fridgeReceipts).toBeDefined();
    expect(fridgePoses).toBeDefined();
    expect(fridgeReceipts!.get("upper_door_hinge")?.newPosition).toBeGreaterThan(0);
    expect(fridgePoses!.has("door_upper")).toBe(true);
    expect(fridgePoses!.has("door_lower")).toBe(true);
  });

  test("stepHouseholdPhysicsWorld steps XPBD soft-body lattices (rug, cushion, curtain) and emits softBodyReceipts", () => {
    const plane = PLANE("ground");
    const rugBody: RigidBody = {
      ...CHAIR("parlor_rug", [0, 0, 0.05], 0),
      isStatic: true,
      mass: 0,
      invMass: 0,
    };
    const cushionBody: RigidBody = {
      ...CHAIR("sofa_cushion", [1.0, 0, 0.45], 0),
      mass: 2.0,
      invMass: 0.5,
    };
    const meta = new Map<string, HouseholdBodyMeta>([
      ["ground", { boundingRadius: 100, material: "hardwood" }],
      [
        "parlor_rug",
        {
          boundingRadius: 1.0,
          material: "fabric",
          softBodyKind: "rug",
          softBodyDimensions: [2.0, 1.5, 0.02],
        },
      ],
      [
        "sofa_cushion",
        {
          boundingRadius: 0.4,
          material: "fabric",
          softBodyKind: "cushion",
          softBodyDimensions: [0.6, 0.6, 0.15],
        },
      ],
    ]);

    const world = createHouseholdWorld([plane, rugBody, cushionBody], meta, {
      dt: 1 / 60,
    });
    expect(world.softBodies.has("parlor_rug")).toBe(true);
    expect(world.softBodies.has("sofa_cushion")).toBe(true);

    const stepRes = stepHouseholdPhysicsWorld(world);
    const rugReceipt = stepRes.softBodyReceipts.get("parlor_rug");
    const cushionReceipt = stepRes.softBodyReceipts.get("sofa_cushion");
    expect(rugReceipt).toBeDefined();
    expect(cushionReceipt).toBeDefined();
    expect(rugReceipt!.nodeCount).toBe(36);
    expect(cushionReceipt!.nodeCount).toBe(18);
    expect(rugReceipt!.minY).toBeGreaterThanOrEqual(0);
    expect(cushionReceipt!.meanSpeed).toBeGreaterThan(0);
  });
});
