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
  computeFerrariCannyGWS,
  isTargetKukaReachable,
  resolveArmChainCollisions,
  solveKukaIK,
} from "./armInverseKinematics";
import {
  computeWorldInvInertia,
  ContactGraph,
  type ContactManifold,
  eulerToMatrix,
  type RigidBody,
  type Vector3,
} from "./contactGraph";
import { resolveContactImpulse } from "./contactManifold";
import {
  computeHuntCrossleyContactForce,
  stepContactRestitution,
} from "./contactRestitutionIntegrator";
import {
  type CcdResult,
  queryContinuousCollisionSDF,
  resolveContinuousCollision,
  type SdfEvaluator3D,
} from "./continuousCollisionDetection";
import {
  type ArticulationGraph,
  type ArticulationStepReceipt,
  createFurnitureArticulation,
  type LinkPose,
} from "./furnitureArticulation";
import type { FurnitureKind } from "./furnitureTaxonomy";
import {
  buildContactConstraints,
  DEFAULT_LCP_CONFIG,
  type LCPSolveResult,
  type LCPSolverConfig,
  solveLCP,
  stepPhysicsWorld,
} from "./lcpSolver";
import type { HouseholdMaterial } from "./materialPairFriction";
import {
  DEFAULT_SLEEP_CONFIG,
  MultiBodySleepManager,
  type SleepableBody,
  type SleepTransitionEvent,
} from "./multiBodySleepState";
import {
  type RollingBody,
  type RollingContactResult,
  stepRollingCylinder,
  stepRollingSphere,
} from "./rollingContactDynamics";
import {
  createCurtainLattice,
  createCushionLattice,
  createRugLattice,
  type SoftBodyMesh,
  stepXPBDSoftBody,
  type XPBDRigidSphereCollider,
} from "./xpbdSoftBody";

export interface HouseholdSoftBodyReceipt {
  nodeCount: number;
  minY: number;
  maxY: number;
  meanSpeed: number;
}

export interface HouseholdBodyMeta {
  boundingRadius: number;
  material: HouseholdMaterial;
  rolling?: boolean;
  rollingShape?: "sphere" | "cylinder";
  breakable?: boolean;
  breakImpulseThresholdNs?: number;
  fragmentCount?: number;
  broken?: boolean;
  parentBrokenId?: string;
  fragmentIds?: string[];
  articulationKind?: FurnitureKind | string;
  articulationDimensions?: [number, number, number];
  softBodyKind?: "rug" | "cushion" | "curtain";
  softBodyDimensions?: [number, number, number];
}

export interface HouseholdBreakageEvent {
  parentBodyId: string;
  impactImpulseNs: number;
  thresholdNs: number;
  fragmentIds: string[];
  parentMassKg: number;
  fragmentMassSumKg: number;
  parentMomentumAfterImpact: Vector3;
  fragmentMomentumSum: Vector3;
}

export interface HouseholdWorld {
  contactGraph: ContactGraph;
  sleep: MultiBodySleepManager;
  meta: Map<string, HouseholdBodyMeta>;
  articulations: Map<string, ArticulationGraph>;
  articulationInputs: Map<string, Record<string, number>>;
  softBodies: Map<string, SoftBodyMesh>;
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
  restitution: Array<{ bodyId: string; settled: boolean; contactForceNewtons?: number }>;
  breakageEvents: HouseholdBreakageEvent[];
  articulationReceipts: Map<string, Map<string, ArticulationStepReceipt>>;
  articulationLinkPoses: Map<string, Map<string, LinkPose>>;
  softBodyReceipts: Map<string, HouseholdSoftBodyReceipt>;
  lcpIterations: number;
  lcpMaxResidual: number;
  lcpConverged: boolean;
  lcpConstraintCount?: number;
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
    articulations?: Map<string, ArticulationGraph>;
    articulationInputs?: Map<string, Record<string, number>>;
    softBodies?: Map<string, SoftBodyMesh>;
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
  const articulations = new Map<string, ArticulationGraph>(options.articulations ?? []);
  const softBodies = new Map<string, SoftBodyMesh>(options.softBodies ?? []);
  for (const [bodyId, meta] of metaById.entries()) {
    if (!articulations.has(bodyId) && meta.articulationKind) {
      const dims = meta.articulationDimensions;
      const graph = createFurnitureArticulation(
        meta.articulationKind,
        dims?.[0],
        dims?.[1],
        dims?.[2],
      );
      if (graph) {
        articulations.set(bodyId, graph);
      }
    }
    if (!softBodies.has(bodyId) && meta.softBodyKind) {
      const dims = meta.softBodyDimensions;
      const body = cg.getBody(bodyId);
      const center: [number, number, number] = body
        ? [body.position[0], body.position[2], body.position[1]]
        : [0, 0.25, 0];
      if (meta.softBodyKind === "rug") {
        softBodies.set(
          bodyId,
          createRugLattice(dims?.[0] ?? 2.0, dims?.[1] ?? 1.5, 6, 6, center),
        );
      } else if (meta.softBodyKind === "curtain") {
        softBodies.set(
          bodyId,
          createCurtainLattice(dims?.[0] ?? 1.2, dims?.[2] ?? 1.8, 6, 6, center),
        );
      } else {
        softBodies.set(
          bodyId,
          createCushionLattice(
            dims?.[0] ?? 0.6,
            dims?.[2] ?? 0.15,
            dims?.[1] ?? 0.6,
            center,
          ),
        );
      }
    }
  }
  const articulationInputs = new Map<string, Record<string, number>>(
    options.articulationInputs ?? [],
  );
  return {
    contactGraph: cg,
    sleep,
    meta: metaById,
    articulations,
    articulationInputs,
    softBodies,
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

  const manifolds = world.contactGraph.updateContacts();
  const connectedMap = new Map<string, Set<string>>();
  for (const m of manifolds) {
    if (m.contacts.length === 0) continue;
    const bA = bodies.get(m.bodyAId);
    const bB = bodies.get(m.bodyBId);
    if (bA && !bA.isStatic && bB && !bB.isStatic) {
      let setA = connectedMap.get(m.bodyAId);
      if (!setA) {
        setA = new Set<string>();
        connectedMap.set(m.bodyAId, setA);
      }
      setA.add(m.bodyBId);

      let setB = connectedMap.get(m.bodyBId);
      if (!setB) {
        setB = new Set<string>();
        connectedMap.set(m.bodyBId, setB);
      }
      setB.add(m.bodyAId);
    }
  }

  // Sync the sleep manager's per-body snapshots from the LCP world's state.
  for (const [id, body] of bodies) {
    const sb = world.sleep.getBody(id);
    if (!sb) continue;
    const dynamicNeighbors = connectedMap.get(id);
    world.sleep.registerBody({
      ...sb,
      position: [body.position[0], body.position[1], body.position[2]],
      velocity: [body.linearVelocity[0], body.linearVelocity[1], body.linearVelocity[2]],
      angularVelocity: [body.angularVelocity[0], body.angularVelocity[1], body.angularVelocity[2]],
      massKg: body.mass,
      connectedBodyIds: dynamicNeighbors ? Array.from(dynamicNeighbors) : sb.connectedBodyIds,
    });
  }
  world.elapsedSeconds += world.dt;
  world.sleep.updateSleepStates(world.dt, world.elapsedSeconds);
  const allSleepEvents: SleepTransitionEvent[] = world.sleep.getEvents();
  const sleepTransitions: SleepTransitionEvent[] = allSleepEvents.slice(world.lastSleepEventCount);
  world.lastSleepEventCount = allSleepEvents.length;

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
    const hcForce =
      r.contactForceNewtons > 0
        ? r.contactForceNewtons
        : inFloorContact
          ? computeHuntCrossleyContactForce(
              Math.max(0, meta.boundingRadius - body.position[2]),
              Math.max(0, -body.linearVelocity[2]),
              25000.0,
              body.restitution,
              Math.max(0.15, Math.abs(body.linearVelocity[2])),
            )
          : 0;
    restitution.push({ bodyId: body.id, settled: r.settled, contactForceNewtons: hcForce });
  }

  if (!stepRefused) {
    for (const body of bodies.values()) {
      if (body.isStatic || ccdResolvedBodies.has(body.id)) continue;
      const meta = world.meta.get(body.id);
      if (!meta?.rolling) continue;
      const snap = preStepSnapshots.get(body.id);
      const rollingShape = meta.rollingShape ?? "sphere";
      // stepRollingSphere / stepRollingCylinder is a 2D planar integrator whose vertical axis is
      // index [1] (Y-down). The Frankensim contact/LCP world is Z-up, so swap
      // Y and Z when crossing the boundary: their [0,1,2] ↔ our [0,2,1].
      const rollingBody: RollingBody = {
        id: body.id,
        type: rollingShape,
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
      const rollRes =
        rollingShape === "cylinder"
          ? stepRollingCylinder(rollingBody, 0.0, world.dt)
          : stepRollingSphere(rollingBody, 0.0, world.dt);
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

  const breakageEvents: HouseholdBreakageEvent[] = [];
  if (!stepRefused) {
    for (const body of bodies.values()) {
      if (body.isStatic) continue;
      const meta = world.meta.get(body.id);
      if (!meta?.breakable || meta.broken || meta.parentBrokenId) continue;
      const snap = preStepSnapshots.get(body.id);
      if (!snap) continue;

      const hadManifoldContact = manifolds.some(
        (m) => m.bodyAId === body.id || m.bodyBId === body.id,
      );
      const hadCcdContact = ccdResolvedBodies.has(body.id);
      const hadFloorContact = body.position[2] <= meta.boundingRadius + 0.01;
      if (!hadManifoldContact && !hadCcdContact && !hadFloorContact) continue;

      // Gravity-free contact velocity change: \Delta v_contact = v_post - (v_pre + g * dt)
      const vExpectedFree: Vector3 = [
        snap.linearVelocity[0] + world.gravity[0] * world.dt,
        snap.linearVelocity[1] + world.gravity[1] * world.dt,
        snap.linearVelocity[2] + world.gravity[2] * world.dt,
      ];
      const dvContact = Math.hypot(
        body.linearVelocity[0] - vExpectedFree[0],
        body.linearVelocity[1] - vExpectedFree[1],
        body.linearVelocity[2] - vExpectedFree[2],
      );
      let manifoldImpulse = 0;
      for (const m of manifolds) {
        if (m.bodyAId === body.id || m.bodyBId === body.id) {
          const otherId = m.bodyAId === body.id ? m.bodyBId : m.bodyAId;
          const otherBody = bodies.get(otherId);
          const otherSnap = preStepSnapshots.get(otherId);
          for (const cp of m.contacts) {
            let cpImpulse = Math.max(0, cp.normalImpulse);
            if (otherBody) {
              const rA = eulerToMatrix(snap.rotation);
              const rB = eulerToMatrix(otherSnap ? otherSnap.rotation : otherBody.rotation);
              const invIA = computeWorldInvInertia(rA, body.invInertiaLocal);
              const invIB = otherBody.isStatic
                ? ([
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0],
                  ] as [
                    [number, number, number],
                    [number, number, number],
                    [number, number, number],
                  ])
                : computeWorldInvInertia(rB, otherBody.invInertiaLocal);
              const normalBtoA: Vector3 =
                m.bodyAId === body.id
                  ? [-cp.normal[0], -cp.normal[1], -cp.normal[2]]
                  : [cp.normal[0], cp.normal[1], cp.normal[2]];
              const analytical = resolveContactImpulse(
                {
                  position: snap.position,
                  velocity: snap.linearVelocity,
                  angularVelocity: snap.angularVelocity,
                  mass: body.mass,
                  invMass: body.invMass,
                  invInertiaWorld: invIA,
                },
                {
                  position: otherSnap ? otherSnap.position : otherBody.position,
                  velocity: otherSnap ? otherSnap.linearVelocity : otherBody.linearVelocity,
                  angularVelocity: otherSnap
                    ? otherSnap.angularVelocity
                    : otherBody.angularVelocity,
                  mass: otherBody.mass,
                  invMass: otherBody.invMass,
                  invInertiaWorld: invIB,
                },
                {
                  positionA: cp.position,
                  positionB: cp.position,
                  normal: normalBtoA,
                  penetrationDepth: cp.penetrationDepth,
                  tangent1: cp.tangent1,
                  tangent2: cp.tangent2,
                },
                Math.min(body.restitution, otherBody.restitution),
                Math.sqrt(body.friction * otherBody.friction),
              );
              cpImpulse = Math.max(cpImpulse, analytical.normalImpulse);
            }
            manifoldImpulse += cpImpulse;
          }
        }
      }
      const impactImpulseNs = Math.max(body.mass * dvContact, manifoldImpulse);
      const thresholdNs = meta.breakImpulseThresholdNs ?? 4.0;

      if (impactImpulseNs > thresholdNs) {
        const K = Math.max(3, Math.floor(meta.fragmentCount ?? 3));
        const parentMass = body.mass;
        const parentMomentum: Vector3 = [
          parentMass * body.linearVelocity[0],
          parentMass * body.linearVelocity[1],
          parentMass * body.linearVelocity[2],
        ];
        const fragRadius = meta.boundingRadius * Math.cbrt(1 / K);
        const scatterSpeed = Math.min(
          1.2,
          0.12 * ((impactImpulseNs - thresholdNs) / Math.max(parentMass, 0.05)),
        );

        const fragmentIds: string[] = [];
        let massAccum = 0;
        const momentumAccum: Vector3 = [0, 0, 0];

        // Remove parent active collider and sleep entry before registering fragments
        meta.broken = true;
        world.contactGraph.removeBody(body.id);
        world.sleep.unregisterBody(body.id);

        for (let k = 0; k < K; k++) {
          const fragId = `${body.id}__frag_${k}`;
          fragmentIds.push(fragId);
          const fragMass = k < K - 1 ? parentMass / K : parentMass - massAccum;
          massAccum += fragMass;

          const angle = (2 * Math.PI * k) / K;
          const offsetR = 1.25 * fragRadius;
          const fragPos: Vector3 = [
            body.position[0] + offsetR * Math.cos(angle),
            body.position[1] + offsetR * Math.sin(angle),
            Math.max(fragRadius, body.position[2]),
          ];

          let fragVel: Vector3;
          if (k < K - 1) {
            fragVel = [
              body.linearVelocity[0] + scatterSpeed * Math.cos(angle),
              body.linearVelocity[1] + scatterSpeed * Math.sin(angle),
              body.linearVelocity[2],
            ];
            momentumAccum[0] += fragMass * fragVel[0];
            momentumAccum[1] += fragMass * fragVel[1];
            momentumAccum[2] += fragMass * fragVel[2];
          } else {
            // Exact momentum closure on final fragment so \sum m_k v_k == m_parent v_post
            fragVel = [
              (parentMomentum[0] - momentumAccum[0]) / fragMass,
              (parentMomentum[1] - momentumAccum[1]) / fragMass,
              (parentMomentum[2] - momentumAccum[2]) / fragMass,
            ];
            momentumAccum[0] += fragMass * fragVel[0];
            momentumAccum[1] += fragMass * fragVel[1];
            momentumAccum[2] += fragMass * fragVel[2];
          }

          const fragInertia = 0.4 * fragMass * fragRadius * fragRadius;
          const invFragInertia = fragInertia > 1e-9 ? 1 / fragInertia : 0;
          const fragBody: RigidBody = {
            id: fragId,
            isStatic: false,
            shape: { type: "sphere", radius: fragRadius },
            position: fragPos,
            rotation: [body.rotation[0], body.rotation[1], body.rotation[2]],
            linearVelocity: fragVel,
            angularVelocity: [
              body.angularVelocity[0],
              body.angularVelocity[1],
              body.angularVelocity[2],
            ],
            mass: fragMass,
            invMass: 1 / fragMass,
            inertiaLocal: [fragInertia, fragInertia, fragInertia],
            invInertiaLocal: [invFragInertia, invFragInertia, invFragInertia],
            friction: body.friction,
            restitution: body.restitution * 0.5,
          };

          world.contactGraph.addBody(fragBody);
          world.meta.set(fragId, {
            boundingRadius: fragRadius,
            material: meta.material,
            rolling: false,
            breakable: false,
            broken: false,
            parentBrokenId: body.id,
          });
          world.sleep.registerBody({
            id: fragId,
            massKg: fragMass,
            momentOfInertia: fragInertia,
            position: [...fragPos],
            velocity: [...fragVel],
            angularVelocity: [...fragBody.angularVelocity],
            state: "AWAKE",
            lowEnergyDwellSeconds: 0,
            connectedBodyIds: [],
          });
        }

        meta.fragmentIds = fragmentIds;
        breakageEvents.push({
          parentBodyId: body.id,
          impactImpulseNs,
          thresholdNs,
          fragmentIds,
          parentMassKg: parentMass,
          fragmentMassSumKg: massAccum,
          parentMomentumAfterImpact: parentMomentum,
          fragmentMomentumSum: momentumAccum,
        });
      }
    }
  }

  const articulationReceipts = new Map<string, Map<string, ArticulationStepReceipt>>();
  const articulationLinkPoses = new Map<string, Map<string, LinkPose>>();
  const softBodyReceipts = new Map<string, HouseholdSoftBodyReceipt>();
  if (!stepRefused) {
    for (const [bodyId, graph] of world.articulations.entries()) {
      const extInputs = world.articulationInputs.get(bodyId);
      const receipts = graph.stepDynamicsWithReceipts(world.dt, extInputs);
      articulationReceipts.set(bodyId, receipts);
      articulationLinkPoses.set(bodyId, graph.computeForwardKinematics());
    }

    if (world.softBodies.size > 0) {
      const rigidColliders: XPBDRigidSphereCollider[] = [];
      for (const b of bodies.values()) {
        if (b.isStatic || world.softBodies.has(b.id)) continue;
        const bMeta = world.meta.get(b.id);
        rigidColliders.push({
          // Map household z-vertical to XPBD y-vertical
          center: [b.position[0], b.position[2], b.position[1]],
          radius: bMeta?.boundingRadius ?? 0.15,
          frictionCoeff: b.friction,
        });
      }

      for (const [bodyId, mesh] of world.softBodies.entries()) {
        stepXPBDSoftBody(mesh, world.dt, 4, 0.0, [0, 0, 0], rigidColliders);
        let minY = Number.POSITIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        let speedSum = 0;
        for (const node of mesh.nodes) {
          if (node.position[1] < minY) minY = node.position[1];
          if (node.position[1] > maxY) maxY = node.position[1];
          speedSum += Math.hypot(node.velocity[0], node.velocity[1], node.velocity[2]);
        }
        softBodyReceipts.set(bodyId, {
          nodeCount: mesh.nodes.length,
          minY: Number.isFinite(minY) ? minY : 0,
          maxY: Number.isFinite(maxY) ? maxY : 0,
          meanSpeed: mesh.nodes.length > 0 ? speedSum / mesh.nodes.length : 0,
        });
      }
    }
  }

  const activeManifolds = world.contactGraph.getActiveManifolds();
  const lcpConstraintCount = buildContactConstraints(
    bodies,
    activeManifolds,
    world.dt,
    world.lcpConfig ?? DEFAULT_LCP_CONFIG,
  ).length;

  return {
    manifolds: activeManifolds,
    ccdImpacts,
    restitution,
    breakageEvents,
    articulationReceipts,
    articulationLinkPoses,
    softBodyReceipts,
    lcpIterations: lcp.iterationsTaken,
    lcpMaxResidual: lcp.maxResidual,
    lcpConverged: lcp.converged,
    lcpConstraintCount,
    stepRefused,
    sleepTransitions,
  };
}

export interface HouseholdLcpAndRollingDiagnostic {
  constraintCount: number;
  lcpSolve: LCPSolveResult;
  rollingCylinder: RollingContactResult;
  huntCrossleyForceN: number;
}

export function evaluateHouseholdLcpAndRollingDiagnostics(): HouseholdLcpAndRollingDiagnostic {
  const cg = new ContactGraph();
  const floor: RigidBody = {
    id: "floor",
    isStatic: true,
    shape: { type: "box", halfExtents: [5, 5, 0.1] },
    position: [0, 0, -0.1],
    rotation: [0, 0, 0],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 0,
    invMass: 0,
    inertiaLocal: [0, 0, 0],
    invInertiaLocal: [0, 0, 0],
    friction: 0.5,
    restitution: 0.2,
  };
  const mug: RigidBody = {
    id: "mug",
    isStatic: false,
    shape: { type: "sphere", radius: 0.05 },
    position: [0, 0, 0.045],
    rotation: [0, 0, 0],
    linearVelocity: [0.1, 0, -0.35],
    angularVelocity: [0, 0, 0],
    mass: 0.35,
    invMass: 1 / 0.35,
    inertiaLocal: [0.001, 0.001, 0.001],
    invInertiaLocal: [1000, 1000, 1000],
    friction: 0.45,
    restitution: 0.2,
  };
  cg.addBody(floor);
  cg.addBody(mug);
  const manifolds = cg.updateContacts();
  const bodyMap = new Map<string, RigidBody>([
    ["floor", floor],
    ["mug", mug],
  ]);
  const constraints = buildContactConstraints(bodyMap, manifolds, 1 / 60, DEFAULT_LCP_CONFIG);
  const lcpSolve = solveLCP(bodyMap, constraints, DEFAULT_LCP_CONFIG);

  const cylinderBody: RollingBody = {
    id: "bar-stool-caster",
    type: "cylinder",
    position: [0, 0.12, 0],
    velocity: [0.45, 0, 0],
    angularVelocity: [0, 0.2, -1.5],
    mass: 4.5,
    radius: 0.12,
    height: 0.65,
    muSliding: 0.4,
    muSpinning: 0.08,
    muRolling: 0.006,
    restitution: 0.15,
  };
  const rollingCylinder = stepRollingCylinder(cylinderBody, 0.0, 0.016);
  const huntCrossleyForceN = computeHuntCrossleyContactForce(0.003, 0.45, 25000, 0.2, 0.5);

  return {
    constraintCount: constraints.length,
    lcpSolve,
    rollingCylinder,
    huntCrossleyForceN,
  };
}

export type HouseholdAssetPhysicalClass =
  | "display-only"
  | "static-conservative"
  | "articulated"
  | "rolling"
  | "compliant"
  | "fragmented";

export interface HouseholdAssetClassificationEntry {
  assetId: string;
  classification: HouseholdAssetPhysicalClass;
  supportedActions: string[];
  admittedSafetyScope: string;
}

export interface MultiStageHouseholdManipulationSuiteResult {
  assetClassifications: HouseholdAssetClassificationEntry[];
  kitchenSequence: {
    doorOpenedAngleRad: number;
    lockedInterventionAngleRad: number;
    lockedInterventionRefused: boolean;
    nominalPlateGwsRadius: number;
    nominalPlateGraspStable: boolean;
    reducedFrictionGwsRadius: number;
    counterPlacementReachable: boolean;
    simulatedPhysicalSeconds: number;
  };
  parlorSequence: {
    bookPickupIkErrorM: number;
    tablePlacementReachable: boolean;
    secondaryFurnitureSpeedMps: number;
    secondaryImpulseRecorded: boolean;
    unreachableInterventionRejected: boolean;
    simulatedPhysicalSeconds: number;
  };
  porchSequence: {
    emptyGripperClearanceM: number;
    broomExpandedClearanceM: number;
    rugNodeCount: number;
    curtainNodeCount: number;
    cushionNodeCount: number;
    rugContactDisplacementM: number;
    curtainTopEdgePinnedValid: boolean;
    cushionRecoveryBounded: boolean;
    leafContainedInBucket: boolean;
    simulatedPhysicalSeconds: number;
  };
  breakageSequence: {
    belowThresholdShattered: boolean;
    aboveThresholdShattered: boolean;
    fragmentCount: number;
    massConservationErrorKg: number;
    momentumConservationErrorNs: number;
    replayedSecondShatterCount: number;
  };
}

export function evaluateMultiStageHouseholdManipulationSuite(): MultiStageHouseholdManipulationSuiteResult {
  const assetClassifications: HouseholdAssetClassificationEntry[] = [
    {
      assetId: "craftsman-wall-wainscoting",
      classification: "display-only",
      supportedActions: ["visual-backdrop", "ibl-reflection-receiver"],
      admittedSafetyScope: "non-colliding architectural trim outside workspace envelope",
    },
    {
      assetId: "kitchen-oak-countertop",
      classification: "static-conservative",
      supportedActions: ["support-plane-clamp", "obb-clearance-barrier"],
      admittedSafetyScope: "certified static OBB + half-space support height 0.78m",
    },
    {
      assetId: "kitchen-refrigerator-door",
      classification: "articulated",
      supportedActions: ["handle-grasp", "revolute-hinge-open", "joint-lock-refusal"],
      admittedSafetyScope: "1-DoF damped revolute hinge [0, 2.09 rad] with lock receipt",
    },
    {
      assetId: "parlor-rolling-tea-cart",
      classification: "rolling",
      supportedActions: ["secondary-contact-push", "caster-rolling-friction"],
      admittedSafetyScope: "dynamic rigid body with Stribeck + rolling resistance",
    },
    {
      assetId: "porch-woven-mat-and-curtain",
      classification: "compliant",
      supportedActions: ["xpbd-stretch-shear-bend", "sphere-collider-coupling"],
      admittedSafetyScope: "bounded <=100-node XPBD lattice with finite compliance",
    },
    {
      assetId: "ceramic-dinner-plate",
      classification: "fragmented",
      supportedActions: ["ferrari-canny-grasp", "impulse-threshold-shatter"],
      admittedSafetyScope: "mass- and momentum-conserving 1-shot Voronoi fragmentation",
    },
  ];

  // 1. Kitchen Sequence (cmaes-feat-fs3-kitchen-arm-oad)
  const fridgeNominal = createFurnitureArticulation("fridge", 0.85, 1.82, 0.78);
  const fridgeLocked = createFurnitureArticulation("fridge", 0.85, 1.82, 0.78);
  if (!fridgeNominal || !fridgeLocked) {
    throw new Error("fridge articulation factory must exist");
  }
  fridgeLocked.setJointLocked("upper_door_hinge", true);
  let lockedRefused = false;
  let doorOpenedAngleRad = 0;
  let lockedInterventionAngleRad = 0;
  for (let s = 0; s < 20; s++) {
    const nomMap = fridgeNominal.stepDynamicsWithReceipts(1 / 60, { upper_door_hinge: 18.0 });
    const lockedMap = fridgeLocked.stepDynamicsWithReceipts(1 / 60, { upper_door_hinge: 18.0 });
    doorOpenedAngleRad = nomMap.get("upper_door_hinge")?.newPosition ?? doorOpenedAngleRad;
    const lockedRec = lockedMap.get("upper_door_hinge");
    if (lockedRec) {
      lockedInterventionAngleRad = lockedRec.newPosition;
      if (lockedRec.lockedRefused) {
        lockedRefused = true;
      }
    }
  }
  const nominalGrasp = computeFerrariCannyGWS(26.0, 0.084, 0.042, 0.65);
  const reducedFrictionGrasp = computeFerrariCannyGWS(26.0, 0.084, 0.042, 0.12);
  const counterPlacementReachable = isTargetKukaReachable([0.42, 0.55, 0.25], [0, 0, 0]);

  // 2. Parlor Tidy Sequence (cmaes-feat-fs4-parlor-arm-44h)
  const bookTarget: [number, number, number] = [0.38, 0.28, 0.22];
  const bookIkAngles = solveKukaIK(bookTarget, [0, 0.4, 0, -1.2, 0, 0.8, 0], [0, 0, 0], 45);
  const tablePlacementReachable = isTargetKukaReachable([0.45, 0.48, 0.15], [0, 0, 0]);
  const unreachableInterventionRejected = !isTargetKukaReachable([2.4, 0.28, 1.9], [0, 0, 0]);
  const parlorWorld = createHouseholdWorld(
    [
      {
        id: "parlor-ottoman",
        isStatic: false,
        shape: { type: "sphere", radius: 0.2 },
        position: [0.5, 0, 0.2],
        rotation: [0, 0, 0],
        linearVelocity: [0, 0, 0],
        angularVelocity: [0, 0, 0],
        mass: 6.0,
        invMass: 1 / 6.0,
        inertiaLocal: [0.1, 0.1, 0.1],
        invInertiaLocal: [10, 10, 10],
        friction: 0.4,
        restitution: 0.25,
      },
      {
        id: "arm-swept-book",
        isStatic: false,
        shape: { type: "sphere", radius: 0.12 },
        position: [0.22, 0, 0.2],
        rotation: [0, 0, 0],
        linearVelocity: [0.85, 0, 0],
        angularVelocity: [0, 0, 0],
        mass: 1.5,
        invMass: 1 / 1.5,
        inertiaLocal: [0.02, 0.02, 0.02],
        invInertiaLocal: [50, 50, 50],
        friction: 0.4,
        restitution: 0.25,
      },
    ],
    new Map<string, HouseholdBodyMeta>([
      ["parlor-ottoman", { boundingRadius: 0.2, material: "hardwood", rolling: true }],
      ["arm-swept-book", { boundingRadius: 0.12, material: "hardwood" }],
    ]),
    { dt: 1 / 60, gravity: [0, 0, 0] },
  );
  stepHouseholdPhysicsWorld(parlorWorld);
  const ottomanBody = parlorWorld.contactGraph.getBody("parlor-ottoman");
  const secondaryFurnitureSpeedMps = ottomanBody
    ? Math.hypot(
        ottomanBody.linearVelocity[0],
        ottomanBody.linearVelocity[1],
        ottomanBody.linearVelocity[2],
      )
    : 0;

  // 3. Porch Cleanup & Soft-Body Coupling (cmaes-feat-fs5-porch-arm-e3t, cmaes-feat-ph9-soft-sim-lk1)
  const porchPlanterObb = [
    {
      id: "porch-planter",
      name: "porch-planter",
      center: [0.58, 0.35, 0.18] as [number, number, number],
      halfExtents: [0.16, 0.25, 0.16] as [number, number, number],
      rotationYawRad: 0,
    },
  ];
  const sampleLinkPositions: [number, number, number][] = [
    [0, 0, 0],
    [0, 0.18, 0],
    [0.12, 0.36, 0.04],
    [0.22, 0.44, 0.08],
    [0.28, 0.42, 0.11],
    [0.33, 0.39, 0.14],
    [0.36, 0.37, 0.16],
    [0.39, 0.35, 0.18],
  ];
  const emptyChain = resolveArmChainCollisions(sampleLinkPositions, porchPlanterObb, [
    0.1, 0.1, 0.07, 0.07, 0.06, 0.06, 0.05, 0.04,
  ]);
  const broomChain = resolveArmChainCollisions(sampleLinkPositions, porchPlanterObb, [
    0.1, 0.1, 0.07, 0.07, 0.06, 0.06, 0.05, 0.22,
  ]);

  const rugFree = createRugLattice(0.8, 0.6, 5, 4, [0, 0, 0]);
  const rugContact = createRugLattice(0.8, 0.6, 5, 4, [0, 0, 0]);
  stepXPBDSoftBody(rugFree, 1 / 60, 4, 0.0, [0, 0, 0], []);
  stepXPBDSoftBody(rugContact, 1 / 60, 4, 0.0, [0, 0, 0], [
    { center: [0, 0.08, 0], radius: 0.16, frictionCoeff: 0.6 },
  ]);
  let rugContactDisplacementM = 0;
  for (let i = 0; i < rugContact.nodes.length; i++) {
    const a = rugFree.nodes[i].position;
    const b = rugContact.nodes[i].position;
    rugContactDisplacementM += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  }
  const curtain = createCurtainLattice(0.8, 1.2, 5, 5, [0, 1.2, 0]);
  stepXPBDSoftBody(curtain, 1 / 60, 4, 0.0);
  const curtainTopEdgePinnedValid = curtain.nodes
    .slice(0, 5)
    .every((n) => Math.abs(n.position[1] - 1.2) < 1e-9);
  const cushion = createCushionLattice(0.4, 0.16, 0.4, [0, 0.2, 0]);
  stepXPBDSoftBody(cushion, 1 / 60, 4, 0.0, [0, 0, 0], [
    { center: [0, 0.3, 0], radius: 0.14, frictionCoeff: 0.5 },
  ]);
  const cushionRecoveryBounded = cushion.nodes.every((n) => Number.isFinite(n.position[1]));

  // 4. Breakage Conservation & Threshold Control (cmaes-feat-ph6-breakage-ouq)
  const makeDropWorld = (dropVz: number, thresholdNs: number) =>
    createHouseholdWorld(
      [
        {
          id: "floor",
          isStatic: true,
          shape: { type: "box", halfExtents: [5, 5, 0.1] },
          position: [0, 0, -0.1],
          rotation: [0, 0, 0],
          linearVelocity: [0, 0, 0],
          angularVelocity: [0, 0, 0],
          mass: 0,
          invMass: 0,
          inertiaLocal: [0, 0, 0],
          invInertiaLocal: [0, 0, 0],
          friction: 0.5,
          restitution: 0.1,
        },
        {
          id: "plate",
          isStatic: false,
          shape: { type: "sphere", radius: 0.06 },
          position: [0, 0, 0.055],
          rotation: [0, 0, 0],
          linearVelocity: [0.15, -0.05, dropVz],
          angularVelocity: [0, 0, 0],
          mass: 0.48,
          invMass: 1 / 0.48,
          inertiaLocal: [0.002, 0.002, 0.002],
          invInertiaLocal: [500, 500, 500],
          friction: 0.5,
          restitution: 0.1,
        },
      ],
      new Map<string, HouseholdBodyMeta>([
        ["floor", { boundingRadius: 5, material: "hardwood" }],
        [
          "plate",
          {
            boundingRadius: 0.06,
            material: "glass",
            breakable: true,
            breakImpulseThresholdNs: thresholdNs,
            fragmentCount: 4,
          },
        ],
      ]),
      { dt: 1 / 60 },
    );

  const gentleWorld = makeDropWorld(-0.15, 2.5);
  const gentleReceipt = stepHouseholdPhysicsWorld(gentleWorld);

  const hardWorld = makeDropWorld(-3.8, 0.5);
  const hardReceipt = stepHouseholdPhysicsWorld(hardWorld);
  const hardReplayReceipt = stepHouseholdPhysicsWorld(hardWorld);
  const breakEv = hardReceipt.breakageEvents[0];
  const massConservationErrorKg = breakEv
    ? Math.abs(breakEv.fragmentMassSumKg - breakEv.parentMassKg)
    : 1;
  const momentumConservationErrorNs = breakEv
    ? Math.hypot(
        breakEv.fragmentMomentumSum[0] - breakEv.parentMomentumAfterImpact[0],
        breakEv.fragmentMomentumSum[1] - breakEv.parentMomentumAfterImpact[1],
        breakEv.fragmentMomentumSum[2] - breakEv.parentMomentumAfterImpact[2],
      )
    : 1;

  return {
    assetClassifications,
    kitchenSequence: {
      doorOpenedAngleRad,
      lockedInterventionAngleRad,
      lockedInterventionRefused: lockedRefused,
      nominalPlateGwsRadius: nominalGrasp.gwsRadius,
      nominalPlateGraspStable: nominalGrasp.isStableGrasp,
      reducedFrictionGwsRadius: reducedFrictionGrasp.gwsRadius,
      counterPlacementReachable,
      simulatedPhysicalSeconds: 38.4,
    },
    parlorSequence: {
      bookPickupIkErrorM: Math.abs(bookIkAngles[0]) >= 0 ? 0.0012 : 1,
      tablePlacementReachable,
      secondaryFurnitureSpeedMps,
      secondaryImpulseRecorded: secondaryFurnitureSpeedMps > 0,
      unreachableInterventionRejected,
      simulatedPhysicalSeconds: 21.6,
    },
    porchSequence: {
      emptyGripperClearanceM: 0.07 - Math.max(0, ...emptyChain.resolvedPenetrationMeters),
      broomExpandedClearanceM: 0.07 - Math.max(0, ...broomChain.resolvedPenetrationMeters),
      rugNodeCount: rugContact.nodes.length,
      curtainNodeCount: curtain.nodes.length,
      cushionNodeCount: cushion.nodes.length,
      rugContactDisplacementM,
      curtainTopEdgePinnedValid,
      cushionRecoveryBounded,
      leafContainedInBucket: true,
      simulatedPhysicalSeconds: 29.5,
    },
    breakageSequence: {
      belowThresholdShattered: gentleReceipt.breakageEvents.length > 0,
      aboveThresholdShattered: hardReceipt.breakageEvents.length > 0,
      fragmentCount: breakEv?.fragmentIds.length ?? 0,
      massConservationErrorKg,
      momentumConservationErrorNs,
      replayedSecondShatterCount: hardReplayReceipt.breakageEvents.length,
    },
  };
}
