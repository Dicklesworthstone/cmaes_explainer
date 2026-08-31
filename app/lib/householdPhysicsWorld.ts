// Household physics world: the runtime orchestrator that wires the Frankensim
// TS collision/contact stack into a single, one-call step. Per tick:
//   1. MultiBodySleepManager.update  (multiBodySleepState)
//   2. ContactGraph.updateContacts   (contactGraph broadphase+narrowphase)
//   3. CCD guard on fast bodies      (continuousCollisionDetection)
//   4. stepPhysicsWorld              (lcpSolver: gravity + LCP + Euler)
//   5. stepContactRestitution per    (contactRestitutionIntegrator)
//   6. stepRollingSphere per flag    (rollingContactDynamics)
// Bead: cmaes-vpib. Related: cmaes-epic-dyn-physics-qrq, cmaes-phr6-qij.

import {
  ContactGraph,
  type RigidBody,
  type ContactManifold,
  type Vector3,
} from "./contactGraph";
import { stepPhysicsWorld, DEFAULT_LCP_CONFIG } from "./lcpSolver";
import {
  MultiBodySleepManager,
  DEFAULT_SLEEP_CONFIG,
  type SleepableBody,
  type SleepTransitionEvent,
} from "./multiBodySleepState";
import { stepContactRestitution } from "./contactRestitutionIntegrator";
import type { HouseholdMaterial } from "./materialPairFriction";
import {
  queryContinuousCollisionSDF,
  type SdfEvaluator3D,
  type CcdResult,
} from "./continuousCollisionDetection";
import { stepRollingSphere, type RollingBody } from "./rollingContactDynamics";

export interface HouseholdBodyMeta {
  boundingRadius: number;
  material: HouseholdMaterial;
  rolling?: boolean;
}

export interface HouseholdWorld {
  contactGraph: ContactGraph;
  sleep: MultiBodySleepManager;
  meta: Map<string, HouseholdBodyMeta>;
  gravity: Vector3;
  ccdSpeedThreshold: number;
  dt: number;
  sdf?: SdfEvaluator3D;
  /** Simulation time in seconds since the world was created. Advanced by
   *  `dt` each call to `stepHouseholdPhysicsWorld`. The sleep manager's
   *  dwell-time logic reads this clock. */
  elapsedSeconds: number;
}

export interface HouseholdStepResult {
  manifolds: ContactManifold[];
  sleepTransitions: SleepTransitionEvent[];
  ccdImpacts: Array<{ bodyId: string; result: CcdResult }>;
  restitution: Array<{ bodyId: string; settled: boolean }>;
  lcpIterations: number;
  lcpMaxResidual: number;
  lcpConverged: boolean;
}

const DEFAULT_GRAVITY: Vector3 = [0, 0, -9.81];

export function defaultGroundPlaneSdf(pos: [number, number, number]): {
  distance: number;
  gradient: [number, number, number];
} {
  return { distance: pos[2], gradient: [0, 0, 1] };
}

export function createHouseholdWorld(
  bodies: RigidBody[],
  metaById: Map<string, HouseholdBodyMeta>,
  options: { gravity?: Vector3; dt?: number; ccdSpeedThreshold?: number } = {},
): HouseholdWorld {
  const cg = new ContactGraph();
  for (const b of bodies) cg.addBody(b);
  const sleep = new MultiBodySleepManager(DEFAULT_SLEEP_CONFIG);
  for (const b of bodies) {
    if (b.isStatic) continue;
    const sleepable: SleepableBody = {
      id: b.id,
      massKg: b.mass,
      momentOfInertia: b.inertiaLocal[0],
      position: [b.position[0], b.position[1], b.position[2]],
      velocity: [b.linearVelocity[0], b.linearVelocity[1], b.linearVelocity[2]],
      angularVelocity: [b.angularVelocity[0], b.angularVelocity[1], b.angularVelocity[2]],
      state: "AWAKE",
      lowEnergyDwellSeconds: 0,
      connectedBodyIds: [],
    };
    sleep.registerBody(sleepable);
  }
  return {
    contactGraph: cg,
    sleep,
    meta: metaById,
    gravity: options.gravity ?? DEFAULT_GRAVITY,
    ccdSpeedThreshold: options.ccdSpeedThreshold ?? 4.0,
    dt: options.dt ?? 1 / 60,
    sdf: defaultGroundPlaneSdf,
    elapsedSeconds: 0,
  };
}

function vecLength3(v: Vector3): number {
  return Math.hypot(v[0], v[1], v[2]);
}

export function stepHouseholdPhysicsWorld(
  world: HouseholdWorld,
): HouseholdStepResult {
  const bodies = new Map<string, RigidBody>();
  for (const b of world.contactGraph.getAllBodies()) bodies.set(b.id, b);

  // Sync the sleep manager's per-body snapshots from the LCP world's state.
  for (const [id, body] of bodies) {
    const sb = world.sleep.getBody(id);
    if (!sb) continue;
    world.sleep.registerBody({
      ...sb,
      position: [body.position[0], body.position[1], body.position[2]],
      velocity: [body.linearVelocity[0], body.linearVelocity[1], body.linearVelocity[2]],
      angularVelocity: [body.angularVelocity[0], body.angularVelocity[1], body.angularVelocity[2]],
      massKg: body.mass,
    });
  }
  world.elapsedSeconds += world.dt;
  world.sleep.updateSleepStates(world.dt, world.elapsedSeconds);
  const sleepTransitions: SleepTransitionEvent[] = world.sleep.getEvents();
  const manifolds = world.contactGraph.updateContacts();

  const ccdImpacts: HouseholdStepResult["ccdImpacts"] = [];
  if (world.sdf) {
    for (const body of bodies.values()) {
      if (body.isStatic) continue;
      const speed = vecLength3(body.linearVelocity);
      if (speed < world.ccdSpeedThreshold) continue;
      const meta = world.meta.get(body.id);
      if (!meta) continue;
      const ccdRes = queryContinuousCollisionSDF(
        {
          startPosition: [body.position[0], body.position[1], body.position[2]],
          endPosition: [
            body.position[0] + body.linearVelocity[0] * world.dt,
            body.position[1] + body.linearVelocity[1] * world.dt,
            body.position[2] + body.linearVelocity[2] * world.dt,
          ],
          radius: meta.boundingRadius,
        },
        world.sdf,
      );
      if (ccdRes.hasImpact) ccdImpacts.push({ bodyId: body.id, result: ccdRes });
    }
  }

  const lcp = stepPhysicsWorld(bodies, manifolds, world.gravity, world.dt, DEFAULT_LCP_CONFIG);

  const restitution: HouseholdStepResult["restitution"] = [];
  for (const body of bodies.values()) {
    if (body.isStatic) continue;
    const meta = world.meta.get(body.id);
    if (!meta) continue;
    const beforeVx = body.linearVelocity[0];
    const beforeVy = body.linearVelocity[1];
    const beforeVz = body.linearVelocity[2];
    const r = stepContactRestitution(
      {
        position: [body.position[0], body.position[1], body.position[2]],
        velocity: [body.linearVelocity[0], body.linearVelocity[1], body.linearVelocity[2]],
        massKg: body.mass,
        radius: meta.boundingRadius,
        material: meta.material,
      },
      meta.material,
      0.0,
      world.dt,
    );
    if (
      Math.abs(r.state.velocity[0] - beforeVx) > 1e-9 ||
      Math.abs(r.state.velocity[1] - beforeVy) > 1e-9 ||
      Math.abs(r.state.velocity[2] - beforeVz) > 1e-9
    ) {
      body.linearVelocity = [r.state.velocity[0], r.state.velocity[1], r.state.velocity[2]];
    }
    restitution.push({ bodyId: body.id, settled: r.settled });
  }

  for (const body of bodies.values()) {
    if (body.isStatic) continue;
    const meta = world.meta.get(body.id);
    if (!meta?.rolling) continue;
    // stepRollingSphere mutates its body argument in place (integrates the
    // sphere on the floor plane), so we build a complete RollingBody from
    // the RigidBody + meta, let the integrator update it, and write the
    // resulting planar state back to the 3D rigid body.
    const rollingBody: RollingBody = {
      id: body.id,
      type: "sphere",
      position: [body.position[0], body.position[1], body.position[2]],
      velocity: [body.linearVelocity[0], body.linearVelocity[1], body.linearVelocity[2]],
      angularVelocity: [
        body.angularVelocity[0],
        body.angularVelocity[1],
        body.angularVelocity[2],
      ],
      mass: body.mass,
      radius: meta.boundingRadius,
      muSliding: body.friction,
      muSpinning: 0.1,
      muRolling: 0.005,
      restitution: body.restitution,
    };
    stepRollingSphere(rollingBody, 0.0, world.dt);
    body.position = [
      rollingBody.position[0],
      rollingBody.position[1],
      rollingBody.position[2],
    ];
    body.linearVelocity = [
      rollingBody.velocity[0],
      rollingBody.velocity[1],
      rollingBody.velocity[2],
    ];
    body.angularVelocity = [
      rollingBody.angularVelocity[0],
      rollingBody.angularVelocity[1],
      rollingBody.angularVelocity[2],
    ];
  }

  return {
    manifolds: world.contactGraph.getActiveManifolds(),
    ccdImpacts,
    restitution,
    lcpIterations: lcp.iterationsTaken,
    lcpMaxResidual: lcp.maxResidual,
    lcpConverged: lcp.converged,
    sleepTransitions,
}
}

