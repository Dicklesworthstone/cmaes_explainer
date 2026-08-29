// Articulation graph & joint dynamics for household objects (cmaes-feat-fg3-articulation).
//
// Defines the kinematic tree and multi-body dynamic articulation graph for
// openable and interactive furniture:
//   - Revolute joints: refrigerator/cabinet/microwave/washer doors (hinges)
//   - Prismatic joints: dresser/desk drawers, dishwasher racks (slides)
//   - Fixed joints: structural sub-assemblies, shelves, handles
//
// Mathematical Formulation:
//   - 4x4 Homogeneous Transformation Tree: T_{root \to child} = T_{root \to parent} * T_{joint}(\theta, d)
//   - Joint Limits & Spring-Damper-Friction Dynamics:
//       \ddot{\theta} = \frac{1}{I_{joint}} [ \tau_{ext} - K_p (\theta - \theta_{rest}) - K_d \dot{\theta} - \tau_f \text{sgn}(\dot{\theta}) ]
//     subject to hard projection \theta \in [\theta_{\min}, \theta_{\max}].
//
// SOTA References:
//   - Featherstone, "Rigid Body Dynamics Algorithms" (Springer 2008), Ch. 4 (Articulated Bodies)
//   - Gaschler, "Manipulation Planning" (TUM 2015) — affordance-grounded articulation specs
//   - Catto, "Modeling and Solving Constraints" (GDC 2014)

import { type FurnitureKind, type JointType } from "./furnitureTaxonomy";

export interface JointLimits {
  min: number; // rad for revolute, meters for prismatic
  max: number;
}

export interface JointDynamicsParams {
  stiffness?: number; // N*m/rad or N/m (spring detent)
  damping?: number; // N*m*s/rad or N*s/m
  frictionTorque?: number; // Coulomb friction threshold
  restPosition?: number; // Default equilibrium position
}

export interface ArticulationJointDef {
  name: string;
  type: JointType;
  parentLink: string;
  childLink: string;
  origin: [number, number, number]; // Joint origin relative to parent frame
  axis: [number, number, number]; // Unit vector in joint frame
  limits: JointLimits;
  dynamics?: JointDynamicsParams;
  initialPosition?: number;
}

export interface ArticulationLinkDef {
  name: string;
  mass: number; // kg
  inertia: { ixx: number; iyy: number; izz: number }; // kg*m^2
  centerOfMass: [number, number, number]; // relative to link frame
}

export interface LinkPose {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number, number]; // Quaternion [x, y, z, w]
  transformMatrix: number[]; // 16 elements column-major
}

export class ArticulationGraph {
  public rootLink: string;
  public links: Map<string, ArticulationLinkDef> = new Map();
  public joints: Map<string, ArticulationJointDef> = new Map();
  public jointPositions: Map<string, number> = new Map();
  public jointVelocities: Map<string, number> = new Map();

  constructor(rootLinkName: string, rootLinkDef: ArticulationLinkDef) {
    this.rootLink = rootLinkName;
    this.links.set(rootLinkName, rootLinkDef);
  }

  public addLink(link: ArticulationLinkDef): void {
    this.links.set(link.name, link);
  }

  public addJoint(joint: ArticulationJointDef): void {
    this.joints.set(joint.name, joint);
    const initialPos = joint.initialPosition ?? 0;
    this.jointPositions.set(joint.name, Math.max(joint.limits.min, Math.min(joint.limits.max, initialPos)));
    this.jointVelocities.set(joint.name, 0);
  }

  public setJointPosition(jointName: string, position: number): void {
    const joint = this.joints.get(jointName);
    if (!joint) return;
    const clamped = Math.max(joint.limits.min, Math.min(joint.limits.max, position));
    this.jointPositions.set(jointName, clamped);
  }

  public getJointPosition(jointName: string): number {
    return this.jointPositions.get(jointName) ?? 0;
  }

  public getJointVelocity(jointName: string): number {
    return this.jointVelocities.get(jointName) ?? 0;
  }

  /**
   * Integrate 1-step joint dynamic simulation with damping, spring detents, and external torques/forces.
   */
  public stepDynamics(dt: number, externalInputs?: Record<string, number>): void {
    const safeDt = Math.max(0.0001, Math.min(0.05, dt));

    for (const [jointName, joint] of this.joints.entries()) {
      if (joint.type === "fixed") continue;

      const pos = this.jointPositions.get(jointName) ?? 0;
      const vel = this.jointVelocities.get(jointName) ?? 0;
      const ext = externalInputs?.[jointName] ?? 0;

      const stiffness = joint.dynamics?.stiffness ?? 0;
      const damping = joint.dynamics?.damping ?? 0.15;
      const friction = joint.dynamics?.frictionTorque ?? 0.02;
      const restPos = joint.dynamics?.restPosition ?? 0;

      // Restoring spring torque/force
      const springForce = -stiffness * (pos - restPos);
      // Viscous damping
      const dampingForce = -damping * vel;
      // Coulomb friction
      let frictionForce = 0;
      if (Math.abs(vel) > 1e-4) {
        frictionForce = -friction * Math.sign(vel);
      } else {
        frictionForce = -Math.max(-friction, Math.min(friction, ext + springForce));
      }

      const totalForce = ext + springForce + dampingForce + frictionForce;
      const childLink = this.links.get(joint.childLink);
      const effInertia = joint.type === "revolute" || joint.type === "continuous"
        ? Math.max(0.005, childLink?.inertia.iyy ?? 0.05)
        : Math.max(0.1, childLink?.mass ?? 1.0);

      const accel = totalForce / effInertia;
      let newVel = vel + accel * safeDt;
      let newPos = pos + newVel * safeDt;

      // Limit enforcement with inelastic impact damping
      if (newPos <= joint.limits.min) {
        newPos = joint.limits.min;
        newVel = Math.max(0, newVel * -0.1);
      } else if (newPos >= joint.limits.max) {
        newPos = joint.limits.max;
        newVel = Math.min(0, newVel * -0.1);
      }

      this.jointPositions.set(jointName, newPos);
      this.jointVelocities.set(jointName, newVel);
    }
  }

  /**
   * Compute Forward Kinematics for all links in the tree.
   * Returns world/root-relative 4x4 matrix and translation/quaternion pose for each link.
   */
  public computeForwardKinematics(): Map<string, LinkPose> {
    const poses = new Map<string, LinkPose>();

    // Identity for root
    const rootMatrix = createIdentityMatrix();
    poses.set(this.rootLink, {
      name: this.rootLink,
      position: [0, 0, 0],
      rotation: [0, 0, 0, 1],
      transformMatrix: rootMatrix,
    });

    // Build children adjacency
    const parentToJoints = new Map<string, ArticulationJointDef[]>();
    for (const joint of this.joints.values()) {
      const list = parentToJoints.get(joint.parentLink) ?? [];
      list.push(joint);
      parentToJoints.set(joint.parentLink, list);
    }

    // Traverse BFS from root
    const queue: string[] = [this.rootLink];
    while (queue.length > 0) {
      const parentName = queue.shift()!;
      const parentPose = poses.get(parentName)!;
      const childJoints = parentToJoints.get(parentName) ?? [];

      for (const joint of childJoints) {
        const q = this.jointPositions.get(joint.name) ?? 0;
        const localJointMat = computeJointTransformMatrix(joint, q);
        const childWorldMat = multiplyMatrices(parentPose.transformMatrix, localJointMat);

        const { position, rotation } = decomposeTransformMatrix(childWorldMat);
        poses.set(joint.childLink, {
          name: joint.childLink,
          position,
          rotation,
          transformMatrix: childWorldMat,
        });

        queue.push(joint.childLink);
      }
    }

    return poses;
  }
}

// ---------------------------------------------------------------------------
// Matrix / Transform Math Helpers (No External Dependency)
// ---------------------------------------------------------------------------

function createIdentityMatrix(): number[] {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}

function multiplyMatrices(a: number[], b: number[]): number[] {
  const out = new Array(16).fill(0);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[row + k * 4] * b[k + col * 4];
      }
      out[row + col * 4] = sum;
    }
  }
  return out;
}

function computeJointTransformMatrix(joint: ArticulationJointDef, q: number): number[] {
  const [ox, oy, oz] = joint.origin;
  const mat = createIdentityMatrix();

  if (joint.type === "fixed") {
    mat[12] = ox;
    mat[13] = oy;
    mat[14] = oz;
    return mat;
  }

  if (joint.type === "prismatic") {
    const [ax, ay, az] = joint.axis;
    mat[12] = ox + ax * q;
    mat[13] = oy + ay * q;
    mat[14] = oz + az * q;
    return mat;
  }

  // Revolute / Continuous
  const [ax, ay, az] = joint.axis;
  const c = Math.cos(q);
  const s = Math.sin(q);
  const t = 1 - c;

  // Rodrigues rotation matrix
  mat[0] = t * ax * ax + c;
  mat[1] = t * ax * ay + s * az;
  mat[2] = t * ax * az - s * ay;

  mat[4] = t * ax * ay - s * az;
  mat[5] = t * ay * ay + c;
  mat[6] = t * ay * az + s * ax;

  mat[8] = t * ax * az + s * ay;
  mat[9] = t * ay * az - s * ax;
  mat[10] = t * az * az + c;

  mat[12] = ox;
  mat[13] = oy;
  mat[14] = oz;

  return mat;
}

function decomposeTransformMatrix(mat: number[]): { position: [number, number, number]; rotation: [number, number, number, number] } {
  const position: [number, number, number] = [mat[12], mat[13], mat[14]];

  // Extract rotation matrix
  const m00 = mat[0], m01 = mat[4], m02 = mat[8];
  const m10 = mat[1], m11 = mat[5], m12 = mat[9];
  const m20 = mat[2], m21 = mat[6], m22 = mat[10];

  const trace = m00 + m11 + m22;
  let qx = 0, qy = 0, qz = 0, qw = 1;

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1.0);
    qw = 0.25 / s;
    qx = (m21 - m12) * s;
    qy = (m02 - m20) * s;
    qz = (m10 - m01) * s;
  } else if (m00 > m11 && m00 > m22) {
    const s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
    qw = (m21 - m12) / s;
    qx = 0.25 * s;
    qy = (m01 + m10) / s;
    qz = (m02 + m20) / s;
  } else if (m11 > m22) {
    const s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
    qw = (m02 - m20) / s;
    qx = (m01 + m10) / s;
    qy = 0.25 * s;
    qz = (m12 + m21) / s;
  } else {
    const s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
    qw = (m10 - m01) / s;
    qx = (m02 + m20) / s;
    qy = (m12 + m21) / s;
    qz = 0.25 * s;
  }

  const norm = Math.hypot(qx, qy, qz, qw) || 1;
  return {
    position,
    rotation: [qx / norm, qy / norm, qz / norm, qw / norm],
  };
}

// ---------------------------------------------------------------------------
// Standard Articulated Household Asset Factories
// ---------------------------------------------------------------------------

export function createFridgeArticulation(w = 0.9, d = 0.8, h = 1.8): ArticulationGraph {
  const graph = new ArticulationGraph("fridge_housing", {
    name: "fridge_housing",
    mass: 85.0,
    inertia: { ixx: 25.0, iyy: 30.0, izz: 15.0 },
    centerOfMass: [0, h * 0.45, 0],
  });

  // Upper main door (hinged on the right side, opens around Y axis)
  const upperDoorH = h * 0.58;
  graph.addLink({
    name: "door_upper",
    mass: 6.5,
    inertia: { ixx: 0.8, iyy: 0.9, izz: 0.1 },
    centerOfMass: [-w * 0.45, upperDoorH / 2, 0.02],
  });
  graph.addJoint({
    name: "upper_door_hinge",
    type: "revolute",
    parentLink: "fridge_housing",
    childLink: "door_upper",
    origin: [w / 2 - 0.02, h - upperDoorH, d / 2 + 0.01],
    axis: [0, 1, 0],
    limits: { min: 0, max: 2.1 }, // ~120 degrees open
    dynamics: { stiffness: 0.2, damping: 0.3, frictionTorque: 0.08, restPosition: 0 },
  });

  // Lower freezer door
  const lowerDoorH = h * 0.35;
  graph.addLink({
    name: "door_lower",
    mass: 4.5,
    inertia: { ixx: 0.5, iyy: 0.6, izz: 0.08 },
    centerOfMass: [-w * 0.45, lowerDoorH / 2, 0.02],
  });
  graph.addJoint({
    name: "lower_door_hinge",
    type: "revolute",
    parentLink: "fridge_housing",
    childLink: "door_lower",
    origin: [w / 2 - 0.02, 0.04, d / 2 + 0.01],
    axis: [0, 1, 0],
    limits: { min: 0, max: 2.1 },
    dynamics: { stiffness: 0.2, damping: 0.3, frictionTorque: 0.08, restPosition: 0 },
  });

  return graph;
}

export function createOvenArticulation(w = 0.76, d = 0.7, h = 0.9): ArticulationGraph {
  const graph = new ArticulationGraph("oven_housing", {
    name: "oven_housing",
    mass: 65.0,
    inertia: { ixx: 12.0, iyy: 15.0, izz: 10.0 },
    centerOfMass: [0, h * 0.45, 0],
  });

  // Bottom-hinged oven door (rotates forward down around X axis)
  const doorH = h * 0.45;
  graph.addLink({
    name: "oven_door",
    mass: 5.0,
    inertia: { ixx: 0.4, iyy: 0.5, izz: 0.2 },
    centerOfMass: [0, doorH / 2, 0.02],
  });
  graph.addJoint({
    name: "oven_door_hinge",
    type: "revolute",
    parentLink: "oven_housing",
    childLink: "oven_door",
    origin: [0, h * 0.12, d / 2 + 0.01],
    axis: [1, 0, 0],
    limits: { min: 0, max: 1.57 }, // 90 degrees open flat
    dynamics: { stiffness: 0.5, damping: 0.4, frictionTorque: 0.1, restPosition: 0 },
  });

  return graph;
}

export function createDresserArticulation(w = 0.9, d = 0.5, h = 1.0, drawerCount = 4): ArticulationGraph {
  const graph = new ArticulationGraph("dresser_frame", {
    name: "dresser_frame",
    mass: 42.0,
    inertia: { ixx: 6.0, iyy: 8.0, izz: 5.0 },
    centerOfMass: [0, h * 0.45, 0],
  });

  const maxSlide = d * 0.75;
  for (let i = 0; i < drawerCount; i++) {
    const drawerH = (h * 0.85) / drawerCount;
    const dy = h * 0.08 + i * drawerH;
    const linkName = `drawer_${i}`;
    const jointName = `drawer_slide_${i}`;

    graph.addLink({
      name: linkName,
      mass: 3.2,
      inertia: { ixx: 0.2, iyy: 0.3, izz: 0.25 },
      centerOfMass: [0, drawerH * 0.4, 0],
    });

    graph.addJoint({
      name: jointName,
      type: "prismatic",
      parentLink: "dresser_frame",
      childLink: linkName,
      origin: [0, dy, d / 2 - 0.02],
      axis: [0, 0, 1], // slides forward in Z
      limits: { min: 0, max: maxSlide },
      dynamics: { stiffness: 0.0, damping: 0.8, frictionTorque: 0.15, restPosition: 0 },
    });
  }

  return graph;
}

export function createCabinetArticulation(w = 0.8, d = 0.4, h = 0.8): ArticulationGraph {
  const graph = new ArticulationGraph("cabinet_frame", {
    name: "cabinet_frame",
    mass: 28.0,
    inertia: { ixx: 3.5, iyy: 4.5, izz: 3.0 },
    centerOfMass: [0, h / 2, 0],
  });

  // Left door
  graph.addLink({
    name: "door_left",
    mass: 2.2,
    inertia: { ixx: 0.15, iyy: 0.2, izz: 0.05 },
    centerOfMass: [w * 0.22, h * 0.45, 0.01],
  });
  graph.addJoint({
    name: "door_left_hinge",
    type: "revolute",
    parentLink: "cabinet_frame",
    childLink: "door_left",
    origin: [-w / 2 + 0.02, h * 0.05, d / 2 + 0.005],
    axis: [0, 1, 0],
    limits: { min: -2.0, max: 0 }, // opens outward left
    dynamics: { stiffness: 0.1, damping: 0.2, frictionTorque: 0.05, restPosition: 0 },
  });

  // Right door
  graph.addLink({
    name: "door_right",
    mass: 2.2,
    inertia: { ixx: 0.15, iyy: 0.2, izz: 0.05 },
    centerOfMass: [-w * 0.22, h * 0.45, 0.01],
  });
  graph.addJoint({
    name: "door_right_hinge",
    type: "revolute",
    parentLink: "cabinet_frame",
    childLink: "door_right",
    origin: [w / 2 - 0.02, h * 0.05, d / 2 + 0.005],
    axis: [0, 1, 0],
    limits: { min: 0, max: 2.0 }, // opens outward right
    dynamics: { stiffness: 0.1, damping: 0.2, frictionTorque: 0.05, restPosition: 0 },
  });

  return graph;
}

export function createMicrowaveArticulation(w = 0.55, d = 0.4, h = 0.35): ArticulationGraph {
  const graph = new ArticulationGraph("microwave_body", {
    name: "microwave_body",
    mass: 14.0,
    inertia: { ixx: 0.8, iyy: 1.0, izz: 0.7 },
    centerOfMass: [0, h / 2, 0],
  });

  graph.addLink({
    name: "microwave_door",
    mass: 1.4,
    inertia: { ixx: 0.08, iyy: 0.09, izz: 0.02 },
    centerOfMass: [w * 0.35, h / 2, 0.01],
  });

  graph.addJoint({
    name: "microwave_hinge",
    type: "revolute",
    parentLink: "microwave_body",
    childLink: "microwave_door",
    origin: [-w / 2 + 0.01, 0.02, d / 2 + 0.005],
    axis: [0, 1, 0],
    limits: { min: -1.9, max: 0 },
    dynamics: { stiffness: 0.3, damping: 0.2, frictionTorque: 0.05, restPosition: 0 },
  });

  return graph;
}

export function createDishwasherArticulation(w = 0.6, d = 0.6, h = 0.85): ArticulationGraph {
  const graph = new ArticulationGraph("dishwasher_housing", {
    name: "dishwasher_housing",
    mass: 45.0,
    inertia: { ixx: 5.5, iyy: 6.5, izz: 4.5 },
    centerOfMass: [0, h / 2, 0],
  });

  // Pull-down door
  graph.addLink({
    name: "door",
    mass: 4.0,
    inertia: { ixx: 0.3, iyy: 0.35, izz: 0.1 },
    centerOfMass: [0, h * 0.45, 0.01],
  });
  graph.addJoint({
    name: "door_hinge",
    type: "revolute",
    parentLink: "dishwasher_housing",
    childLink: "door",
    origin: [0, 0.05, d / 2 + 0.005],
    axis: [1, 0, 0],
    limits: { min: 0, max: 1.57 },
    dynamics: { stiffness: 0.4, damping: 0.4, frictionTorque: 0.1, restPosition: 0 },
  });

  // Pull-out upper dish rack
  graph.addLink({
    name: "rack_upper",
    mass: 2.0,
    inertia: { ixx: 0.1, iyy: 0.15, izz: 0.1 },
    centerOfMass: [0, 0.05, 0],
  });
  graph.addJoint({
    name: "rack_upper_slide",
    type: "prismatic",
    parentLink: "dishwasher_housing",
    childLink: "rack_upper",
    origin: [0, h * 0.6, 0],
    axis: [0, 0, 1],
    limits: { min: 0, max: d * 0.7 },
    dynamics: { stiffness: 0.0, damping: 0.5, frictionTorque: 0.08, restPosition: 0 },
  });

  return graph;
}

export function createWasherDryerArticulation(w = 0.7, d = 0.7, h = 0.95): ArticulationGraph {
  const graph = new ArticulationGraph("washer_housing", {
    name: "washer_housing",
    mass: 70.0,
    inertia: { ixx: 10.0, iyy: 12.0, izz: 9.0 },
    centerOfMass: [0, h / 2, 0],
  });

  // Side-hinged round porthole door
  graph.addLink({
    name: "porthole_door",
    mass: 3.5,
    inertia: { ixx: 0.2, iyy: 0.25, izz: 0.05 },
    centerOfMass: [w * 0.25, 0, 0.02],
  });
  graph.addJoint({
    name: "porthole_hinge",
    type: "revolute",
    parentLink: "washer_housing",
    childLink: "porthole_door",
    origin: [-w * 0.35, h * 0.5, d / 2 + 0.01],
    axis: [0, 1, 0],
    limits: { min: -2.3, max: 0 }, // opens outward left ~135 degrees
    dynamics: { stiffness: 0.15, damping: 0.25, frictionTorque: 0.06, restPosition: 0 },
  });

  return graph;
}

/**
 * Universal Articulation Factory for any FurnitureKind in the Craftsman taxonomy.
 */
export function createFurnitureArticulation(
  kind: FurnitureKind | string,
  w?: number,
  d?: number,
  h?: number,
): ArticulationGraph | null {
  switch (kind) {
    case "fridge":
      return createFridgeArticulation(w, d, h);
    case "oven":
    case "stove":
      return createOvenArticulation(w, d, h);
    case "dresser":
    case "desk":
    case "nightstand":
      return createDresserArticulation(w, d, h, kind === "dresser" ? 4 : 2);
    case "cabinet":
    case "wardrobe":
    case "pantry":
      return createCabinetArticulation(w, d, h);
    case "microwave":
      return createMicrowaveArticulation(w, d, h);
    case "dishwasher":
      return createDishwasherArticulation(w, d, h);
    case "washer":
    case "dryer":
      return createWasherDryerArticulation(w, d, h);
    default:
      return null;
  }
}
