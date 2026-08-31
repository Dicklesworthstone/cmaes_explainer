// Live coupling between the KMR kinematic owner and the existing household
// contact/LCP stack. The KMR is a moving infinite-mass kinematic body; the
// chair is a finite-mass dynamic body. This proves the end-to-end rung where
// a commanded robot base contacts and moves household matter. It does not
// claim wheel traction or a rigid-body KMR drivetrain.

import type { RigidBody } from "./contactGraph";
import {
  createHouseholdWorld,
  stepHouseholdPhysicsWorld,
  type HouseholdBodyMeta,
  type HouseholdWorld,
} from "./householdPhysicsWorld";
import type { KmrNavigationReceipt, KmrPose2D } from "./kmrNavigationOwner";
import { KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS } from "./kmrGeometry";

const GROUND_ID = "kmr-coupling-ground";
const BASE_ID = "kmr-kinematic-base";
const CHAIR_ID = "kmr-dynamic-chair";
const CHAIR_RADIUS_METERS = 0.22;

export interface KmrHouseholdPhysicsCoupling {
  world: HouseholdWorld;
  previousPose: KmrPose2D;
  cumulativeBaseChairContacts: number;
}

export interface KmrHouseholdPhysicsReceipt {
  owner: "household-contact-lcp-ts";
  baseAngularVelocityRadPerSecond: number;
  chairPositionMeters: [number, number, number];
  chairVelocityMps: [number, number, number];
  chairDisplacementMeters: number;
  baseChairContactsThisStep: number;
  cumulativeBaseChairContacts: number;
  lcpConverged: boolean;
  lcpIterations: number;
  lcpMaxResidual: number;
}

function shortestAngularDelta(from: number, to: number): number {
  let delta = to - from;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  return delta;
}

function groundBody(): RigidBody {
  return {
    id: GROUND_ID,
    isStatic: true,
    shape: { type: "plane", planeNormal: [0, 0, 1], planeOffset: 0 },
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 0,
    invMass: 0,
    inertiaLocal: [0, 0, 0],
    invInertiaLocal: [0, 0, 0],
    friction: 0.65,
    restitution: 0.05,
  };
}

function baseBody(pose: KmrPose2D): RigidBody {
  const geometry = KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS;
  return {
    id: BASE_ID,
    isStatic: true,
    shape: {
      type: "box",
      halfExtents: [
        geometry.baseLengthMeters / 2,
        geometry.baseWidthMeters / 2,
        geometry.baseHeightMeters / 2,
      ],
    },
    position: [pose.x, pose.y, geometry.baseHeightMeters / 2],
    rotation: [0, 0, pose.theta],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 0,
    invMass: 0,
    inertiaLocal: [0, 0, 0],
    invInertiaLocal: [0, 0, 0],
    friction: 0.75,
    restitution: 0.02,
  };
}

function chairBody(position: [number, number]): RigidBody {
  return {
    id: CHAIR_ID,
    isStatic: false,
    shape: { type: "sphere", radius: CHAIR_RADIUS_METERS },
    position: [position[0], position[1], CHAIR_RADIUS_METERS],
    rotation: [0, 0, 0],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 4,
    invMass: 0.25,
    inertiaLocal: [0.1, 0.1, 0.1],
    invInertiaLocal: [10, 10, 10],
    friction: 0.5,
    restitution: 0.1,
  };
}

export function createKmrHouseholdPhysicsCoupling(
  initialPose: KmrPose2D,
  chairPosition: [number, number],
): KmrHouseholdPhysicsCoupling {
  const meta = new Map<string, HouseholdBodyMeta>();
  meta.set(CHAIR_ID, {
    boundingRadius: CHAIR_RADIUS_METERS,
    material: "hardwood",
  });
  return {
    world: createHouseholdWorld(
      [groundBody(), baseBody(initialPose), chairBody(chairPosition)],
      meta,
      { dt: 1 / 60 },
    ),
    previousPose: { ...initialPose },
    cumulativeBaseChairContacts: 0,
  };
}

export function stepKmrHouseholdPhysics(
  coupling: KmrHouseholdPhysicsCoupling,
  navigation: KmrNavigationReceipt,
): KmrHouseholdPhysicsReceipt {
  const base = coupling.world.contactGraph.getBody(BASE_ID);
  const chair = coupling.world.contactGraph.getBody(CHAIR_ID);
  if (!base || !chair) throw new Error("KMR household coupling lost an owned body");
  const dt = coupling.world.dt;
  base.linearVelocity = [
    (navigation.pose.x - coupling.previousPose.x) / dt,
    (navigation.pose.y - coupling.previousPose.y) / dt,
    0,
  ];
  base.angularVelocity = [
    0,
    0,
    shortestAngularDelta(coupling.previousPose.theta, navigation.pose.theta) / dt,
  ];
  base.position = [
    navigation.pose.x,
    navigation.pose.y,
    KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS.baseHeightMeters / 2,
  ];
  base.rotation = [0, 0, navigation.pose.theta];
  coupling.previousPose = { ...navigation.pose };

  const before: [number, number, number] = [...chair.position];
  const result = stepHouseholdPhysicsWorld(coupling.world);
  const baseChairContactsThisStep = result.manifolds.filter(
    (manifold) =>
      (manifold.bodyAId === BASE_ID && manifold.bodyBId === CHAIR_ID) ||
      (manifold.bodyAId === CHAIR_ID && manifold.bodyBId === BASE_ID),
  ).length;
  coupling.cumulativeBaseChairContacts += baseChairContactsThisStep;
  return {
    owner: "household-contact-lcp-ts",
    baseAngularVelocityRadPerSecond: base.angularVelocity[2],
    chairPositionMeters: [...chair.position],
    chairVelocityMps: [...chair.linearVelocity],
    chairDisplacementMeters: Math.hypot(
      chair.position[0] - before[0],
      chair.position[1] - before[1],
      chair.position[2] - before[2],
    ),
    baseChairContactsThisStep,
    cumulativeBaseChairContacts: coupling.cumulativeBaseChairContacts,
    lcpConverged: result.lcpConverged,
    lcpIterations: result.lcpIterations,
    lcpMaxResidual: result.lcpMaxResidual,
  };
}
