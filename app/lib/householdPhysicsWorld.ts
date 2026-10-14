// Household physics world: the runtime orchestrator that wires the Frankensim
// TS collision/contact stack into a single, one-call step. Per tick:
//   1. MultiBodySleepManager.update  (multiBodySleepState)
//   2. ContactGraph.updateContacts   (contactGraph broadphase+narrowphase)
//   3. CCD guard on fast bodies      (continuousCollisionDetection)
//   4. stepPhysicsWorld              (lcpSolver: gravity + LCP + Euler)
//   5. stepContactRestitution per    (contactRestitutionIntegrator)
//   6. stepRollingSphere per flag    (rollingContactDynamics)
// Bead: cmaes-vpib. Related: cmaes-epic-dyn-physics-qrq, cmaes-phr6-qij.

import { ContactGraph, type ContactManifold, type RigidBody, type Vector3 } from "./contactGraph";
import { stepContactRestitution } from "./contactRestitutionIntegrator";
import {
  type CcdResult,
  queryContinuousCollisionSDF,
  resolveContinuousCollision,
  type SdfEvaluator3D,
} from "./continuousCollisionDetection";
import { DEFAULT_LCP_CONFIG, type LCPSolverConfig, stepPhysicsWorld } from "./lcpSolver";
import type { HouseholdMaterial } from "./materialPairFriction";
import {
  DEFAULT_SLEEP_CONFIG,
  MultiBodySleepManager,
  type SleepableBody,
  type SleepTransitionEvent,
} from "./multiBodySleepState";
import { type RollingBody, stepRollingSphere } from "./rollingContactDynamics";

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
  lcpConfig?: LCPSolverConfig;
  /** Simulation time in seconds since the world was created. Advanced by
   *  `dt` each call to `stepHouseholdPhysicsWorld`. The sleep manager's
   *  dwell-time logic reads this clock. */
  elapsedSeconds: number;
  /** Sleep manager event cursor. MultiBodySleepManager.getEvents returns
   *  the FULL accumulated event history (the API has no consume), so we
   *  track the last observed count and return only the delta each tick.
   *  This keeps `HouseholdStepResult.sleepTransitions` from growing
   *  unboundedly over a world's lifetime. */
  lastSleepEventCount: number;
}

export interface HouseholdStepResult {
  manifolds: ContactManifold[];
  sleepTransitions: SleepTransitionEvent[];
  ccdImpacts: Array<{ bodyId: string; result: CcdResult }>;
  restitution: Array<{ bodyId: string; settled: boolean }>;
  lcpIterations: number;
  lcpMaxResidual: number;
  lcpConverged: boolean;
  stepRefused?: boolean;
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
  options: {
    gravity?: Vector3;
    dt?: number;
    ccdSpeedThreshold?: number;
    sdf?: SdfEvaluator3D;
    lcpConfig?: LCPSolverConfig;
  } = {},
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
    ccdSpeedThreshold: options.ccdSpeedThreshold ?? 5.0,
    dt: options.dt ?? 1 / 60,
    sdf: options.sdf ?? defaultGroundPlaneSdf,
    lcpConfig: options.lcpConfig ?? DEFAULT_LCP_CONFIG,
    elapsedSeconds: 0,
    lastSleepEventCount: 0,
  };
}

function vecLength3(v: Vector3): number {
  return Math.hypot(v[0], v[1], v[2]);
}

export function stepHouseholdPhysicsWorld(world: HouseholdWorld): HouseholdStepResult {
  const bodies = new Map<string, RigidBody>();
  const preStepSnapshots = new Map<
    string,
    {
      position: Vector3;
      rotation: Vector3;
      linearVelocity: Vector3;
      angularVelocity: Vector3;
    }
  >();
  for (const b of world.contactGraph.getAllBodies()) {
    bodies.set(b.id, b);
    if (!b.isStatic) {
      preStepSnapshots.set(b.id, {
        position: [b.position[0], b.position[1], b.position[2]],
        rotation: [b.rotation[0], b.rotation[1], b.rotation[2]],
        linearVelocity: [b.linearVelocity[0], b.linearVelocity[1], b.linearVelocity[2]],
        angularVelocity: [b.angularVelocity[0], b.angularVelocity[1], b.angularVelocity[2]],
      });
    }
  }

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
  const allSleepEvents: SleepTransitionEvent[] = world.sleep.getEvents();
  const sleepTransitions: SleepTransitionEvent[] = allSleepEvents.slice(world.lastSleepEventCount);
  world.lastSleepEventCount = allSleepEvents.length;

  const manifolds = world.contactGraph.updateContacts();
  const ccdImpacts: HouseholdStepResult["ccdImpacts"] = [];
  const ccdResolvedBodies = new Map<
    string,
    { newPosition: [number, number, number]; newVelocity: [number, number, number] }
  >();
  if (world.sdf) {
    for (const body of bodies.values()) {
      if (body.isStatic) continue;
      const vPred: [number, number, number] = [
        body.linearVelocity[0] + world.gravity[0] * world.dt,
        body.linearVelocity[1] + world.gravity[1] * world.dt,
        body.linearVelocity[2] + world.gravity[2] * world.dt,
      ];
      const speed = Math.max(vecLength3(body.linearVelocity), vecLength3(vPred));
      if (speed < world.ccdSpeedThreshold) continue;
      const meta = world.meta.get(body.id);
      if (!meta) continue;
      const startPos: [number, number, number] = [
        body.position[0],
        body.position[1],
        body.position[2],
      ];
      const ccdRes = queryContinuousCollisionSDF(
        {
          startPosition: startPos,
          endPosition: [
            startPos[0] + vPred[0] * world.dt,
            startPos[1] + vPred[1] * world.dt,
            startPos[2] + vPred[2] * world.dt,
          ],
          radius: meta.boundingRadius,
        },
        world.sdf,
      );
      if (ccdRes.hasImpact) {
        ccdImpacts.push({ bodyId: body.id, result: ccdRes });
        const resolved = resolveContinuousCollision(
          startPos,
          vPred,
          world.dt,
          meta.boundingRadius,
          world.sdf,
          body.restitution,
        );
        if (resolved.impactDetected) {
          ccdResolvedBodies.set(body.id, {
            newPosition: resolved.newPosition,
            newVelocity: resolved.newVelocity,
          });
        }
      }
    }
  }

  const lcp = stepPhysicsWorld(
    bodies,
    manifolds,
    world.gravity,
    world.dt,
    world.lcpConfig ?? DEFAULT_LCP_CONFIG,
  );

  // Enforce CCD TOI-clamped position and reflected velocity for fast impacting bodies
  for (const [bodyId, resolved] of ccdResolvedBodies) {
    const body = bodies.get(bodyId);
    if (!body) continue;
    body.position = [resolved.newPosition[0], resolved.newPosition[1], resolved.newPosition[2]];
    body.linearVelocity = [
      resolved.newVelocity[0],
      resolved.newVelocity[1],
      resolved.newVelocity[2],
    ];
  }

  const stepRefused = !lcp.converged;
  if (stepRefused) {
    // On LCP nonconvergence, refuse advancing into an unconverged state:
    // restore pre-step positions/orientations and damp velocities conservatively.
    for (const [bodyId, snap] of preStepSnapshots) {
      if (ccdResolvedBodies.has(bodyId)) continue;
      const body = bodies.get(bodyId);
      if (!body) continue;
      body.position = [snap.position[0], snap.position[1], snap.position[2]];
      body.rotation = [snap.rotation[0], snap.rotation[1], snap.rotation[2]];
      body.linearVelocity = [
        snap.linearVelocity[0] * 0.5,
        snap.linearVelocity[1] * 0.5,
        Math.max(0, snap.linearVelocity[2]),
      ];
      body.angularVelocity = [
        snap.angularVelocity[0] * 0.5,
        snap.angularVelocity[1] * 0.5,
        snap.angularVelocity[2] * 0.5,
      ];
    }
  }

  const restitution: HouseholdStepResult["restitution"] = [];
  const safeDt = Math.max(0.0001, Math.min(0.05, world.dt));
  for (const body of bodies.values()) {
    if (body.isStatic) continue;
    const meta = world.meta.get(body.id);
    if (!meta) continue;
    if (stepRefused || ccdResolvedBodies.has(body.id)) {
      const horizSpeed = Math.hypot(body.linearVelocity[0], body.linearVelocity[1]);
      restitution.push({
        bodyId: body.id,
        settled:
          !stepRefused && horizSpeed < 0.01 && Math.abs(body.linearVelocity[2]) < 0.01,
      });
      continue;
    }
    const inFloorContact = body.position[2] <= meta.boundingRadius + 0.01;
    if (inFloorContact && !meta.rolling) {
      // Non-rolling furniture proxies slide on their support base rather than rolling like a free sphere
      body.angularVelocity = [0, 0, body.angularVelocity[2] * 0.9];
    }
    const targetPy = inFloorContact
      ? Math.min(body.position[2], meta.boundingRadius - 1e-4)
      : body.position[2];
    const targetVy =
      inFloorContact && Math.abs(body.linearVelocity[2]) <= Math.abs(world.gravity[2]) * safeDt * 1.5
        ? 0
        : body.linearVelocity[2];
    // stepContactRestitution is Y-up and internally adds GRAVITY*safeDt and v*safeDt.
    // Swap Y<->Z and pass pre-gravity/pre-step state so gravity and dt are applied once.
    const r = stepContactRestitution(
      {
        position: [
          body.position[0] - body.linearVelocity[0] * safeDt,
          targetPy - targetVy * safeDt,
          body.position[1] - body.linearVelocity[1] * safeDt,
        ],
        velocity: [
          body.linearVelocity[0],
          targetVy - (-9.81) * safeDt,
          body.linearVelocity[1],
        ],
        massKg: body.mass,
        radius: meta.boundingRadius,
        material: meta.material,
      },
      meta.material,
      0.0,
      world.dt,
    );
    if (r.contactOccurred) {
      body.linearVelocity = [
        r.state.velocity[0],
        r.state.velocity[2],
        r.settled ? 0 : body.linearVelocity[2],
      ];
    }
    restitution.push({ bodyId: body.id, settled: r.settled });
  }

  if (!stepRefused) {
    for (const body of bodies.values()) {
      if (body.isStatic || ccdResolvedBodies.has(body.id)) continue;
      const meta = world.meta.get(body.id);
      if (!meta?.rolling) continue;
      const snap = preStepSnapshots.get(body.id);
      // stepRollingSphere is a 2D planar integrator whose vertical axis is
      // index [1] (Y-down). The Frankensim contact/LCP world is Z-up, so swap
      // Y and Z when crossing the boundary: their [0,1,2] ↔ our [0,2,1].
      const rollingBody: RollingBody = {
        id: body.id,
        type: "sphere",
        position: [body.position[0], body.position[2], body.position[1]],
        velocity: [body.linearVelocity[0], body.linearVelocity[2], body.linearVelocity[1]],
        angularVelocity: [
          body.angularVelocity[0],
          body.angularVelocity[2],
          body.angularVelocity[1],
        ],
        mass: body.mass,
        radius: meta.boundingRadius,
        muSliding: body.friction,
        muSpinning: 0.1,
        muRolling: 0.005,
        restitution: body.restitution,
      };
      const rollRes = stepRollingSphere(rollingBody, 0.0, world.dt);
      if (rollRes.hasContact && snap) {
        body.linearVelocity = [
          rollingBody.velocity[0],
          rollingBody.velocity[2],
          rollingBody.velocity[1],
        ];
        body.angularVelocity = [
          rollingBody.angularVelocity[0],
          rollingBody.angularVelocity[2],
          rollingBody.angularVelocity[1],
        ];
        // Single-time-step position integration from pre-step snapshot
        body.position = [
          snap.position[0] + body.linearVelocity[0] * world.dt,
          snap.position[1] + body.linearVelocity[1] * world.dt,
          Math.max(meta.boundingRadius, snap.position[2] + body.linearVelocity[2] * world.dt),
        ];
      }
    }
  }

  return {
    manifolds: world.contactGraph.getActiveManifolds(),
    ccdImpacts,
    restitution,
    lcpIterations: lcp.iterationsTaken,
    lcpMaxResidual: lcp.maxResidual,
    lcpConverged: lcp.converged,
    stepRefused,
    sleepTransitions,
  };
}
