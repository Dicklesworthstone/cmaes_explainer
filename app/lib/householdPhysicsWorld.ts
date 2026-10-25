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
  computeWorldInvInertia,
  ContactGraph,
  type ContactManifold,
  eulerToMatrix,
  type RigidBody,
  type Vector3,
} from "./contactGraph";
import { resolveContactImpulse } from "./contactManifold";
import { stepContactRestitution } from "./contactRestitutionIntegrator";
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
import { DEFAULT_LCP_CONFIG, type LCPSolverConfig, stepPhysicsWorld } from "./lcpSolver";
import type { HouseholdMaterial } from "./materialPairFriction";
import {
   DEFAULT_SLEEP_CONFIG,
  MultiBodySleepManager,
  type SleepableBody,
  type SleepTransitionEvent,
} from "./multiBodySleepState";
import { type RollingBody, stepRollingSphere } from "./rollingContactDynamics";
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
  restitution: Array<{ bodyId: string; settled: boolean }>;
  breakageEvents: HouseholdBreakageEvent[];
  articulationReceipts: Map<string, Map<string, ArticulationStepReceipt>>;
  articulationLinkPoses: Map<string, Map<string, LinkPose>>;
  softBodyReceipts: Map<string, HouseholdSoftBodyReceipt>;
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

  return {
    manifolds: world.contactGraph.getActiveManifolds(),
    ccdImpacts,
    restitution,
    breakageEvents,
    articulationReceipts,
    articulationLinkPoses,
    softBodyReceipts,
    lcpIterations: lcp.iterationsTaken,
    lcpMaxResidual: lcp.maxResidual,
    lcpConverged: lcp.converged,
    stepRefused,
    sleepTransitions,
  };
}
