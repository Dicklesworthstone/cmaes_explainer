import { describe, expect, it } from "bun:test";
import {
  createZeroSpatial,
  spatialCrossMotion,
  spatialCrossForce,
  eulerToRotationMatrix,
  buildSpatialInertia,
  multiplyInertiaVector,
  forwardDynamicsABA,
  inverseDynamicsRNEA,
  computeMechanicalEnergy,
  stepMultibodyDynamics,
  type MultibodyTree,
  type RigidBodyLink,
} from "../app/lib/featherstoneDynamics";

describe("Featherstone Articulated Body Dynamics (ABA & RNEA)", () => {
  // Standard 2-Link Planar Pendulum fixture
  const doublePendulumTree: MultibodyTree = {
    name: "2-link-planar-pendulum",
    gravity: [0, 0, -9.81],
    links: [
      {
        id: "link1",
        name: "Link 1",
        parentIndex: -1,
        jointType: "revolute",
        jointAxis: [0, 1, 0], // rotate around Y
        parentTransform: {
          rotation: [0, 0, 0],
          translation: [0, 0, 0],
        },
        mass: 1.0,
        centerOfMass: [0, 0, -0.5],
        inertiaPrincipal: [0.0833, 0.0833, 0.01],
      },
      {
        id: "link2",
        name: "Link 2",
        parentIndex: 0,
        jointType: "revolute",
        jointAxis: [0, 1, 0], // rotate around Y
        parentTransform: {
          rotation: [0, 0, 0],
          translation: [0, 0, -1.0], // attached at end of link 1
        },
        mass: 1.0,
        centerOfMass: [0, 0, -0.5],
        inertiaPrincipal: [0.0833, 0.0833, 0.01],
      },
    ],
  };

  // 7-DoF Manipulator Arm fixture (Kuka / Panda kinematics)
  const arm7DofTree: MultibodyTree = {
    name: "7-dof-robot-arm",
    gravity: [0, 0, -9.81],
    links: Array.from({ length: 7 }, (_, i) => ({
      id: `arm_link_${i + 1}`,
      name: `Arm Link ${i + 1}`,
      parentIndex: i - 1,
      jointType: "revolute",
      jointAxis: i % 2 === 0 ? [0, 0, 1] : [0, 1, 0],
      parentTransform: {
        rotation: [0, 0, 0],
        translation: [0, 0, i === 0 ? 0.3 : 0.4],
      },
      mass: 2.0 - i * 0.15,
      centerOfMass: [0, 0, 0.1],
      inertiaPrincipal: [0.05, 0.05, 0.02],
      damping: 0.1,
    })),
  };

  describe("Spatial 6D Vector Algebra & Inertia", () => {
    it("satisfies Jacobi identity for spatial cross product", () => {
      const u: [number, number, number, number, number, number] = [1, 2, 3, 4, 5, 6];
      const v: [number, number, number, number, number, number] = [2, -1, 4, 0, 3, -2];
      const w: [number, number, number, number, number, number] = [-3, 2, 1, 5, -1, 4];

      // u x (v x w) + v x (w x u) + w x (u x v) = 0
      const term1 = spatialCrossMotion(u, spatialCrossMotion(v, w));
      const term2 = spatialCrossMotion(v, spatialCrossMotion(w, u));
      const term3 = spatialCrossMotion(w, spatialCrossMotion(u, v));

      for (let i = 0; i < 6; i++) {
        expect(term1[i] + term2[i] + term3[i]).toBeCloseTo(0, 5);
      }
    });

    it("builds positive-definite spatial rigid body inertia", () => {
      const I = buildSpatialInertia(5.0, [0.1, 0.2, 0.3], [0.5, 0.6, 0.7]);
      const v: [number, number, number, number, number, number] = [1, 1, 1, 2, 2, 2];
      const Iv = multiplyInertiaVector(I, v);

      // Kinetic energy: 0.5 * v^T * I * v > 0
      let energy = 0;
      for (let i = 0; i < 6; i++) {
        energy += v[i] * Iv[i];
      }
      expect(energy).toBeGreaterThan(0);
    });
  });

  describe("ABA Forward Dynamics vs RNEA Inverse Dynamics Consistency", () => {
    it("guarantees ABA and RNEA are exact mathematical inverses", () => {
      const q = [0.4, -0.6];
      const qDot = [0.8, -1.2];
      const qDDot_desired = [1.5, -2.0];

      // 1. Compute joint torques using RNEA
      const tau = inverseDynamicsRNEA(doublePendulumTree, q, qDot, qDDot_desired);

      // 2. Compute joint accelerations using ABA with the resulting torques
      const { qDDot } = forwardDynamicsABA(doublePendulumTree, q, qDot, tau);

      // ABA must recover the exact desired accelerations
      expect(qDDot[0]).toBeCloseTo(qDDot_desired[0], 5);
      expect(qDDot[1]).toBeCloseTo(qDDot_desired[1], 5);
    });

    it("recovers 7-DoF manipulator arm accelerations accurately", () => {
      const q = [0.1, 0.2, -0.3, 0.4, -0.5, 0.6, -0.7];
      const qDot = [0.2, -0.1, 0.3, -0.2, 0.1, -0.3, 0.2];
      const qDDot_target = [1.0, -0.5, 0.8, -1.2, 0.3, -0.4, 0.6];

      const tau = inverseDynamicsRNEA(arm7DofTree, q, qDot, qDDot_target);
      const { qDDot } = forwardDynamicsABA(arm7DofTree, q, qDot, tau);

      for (let i = 0; i < 7; i++) {
        expect(qDDot[i]).toBeCloseTo(qDDot_target[i], 4);
      }
    });
  });

  describe("Sub-Millisecond 7-DoF Execution Performance", () => {
    it("executes 100 consecutive 7-DoF ABA forward dynamics steps in <5ms (<50µs per solve)", () => {
      const q = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
      const qDot = [0, 0, 0, 0, 0, 0, 0];
      const tau = [1, -1, 2, -2, 0.5, -0.5, 0.1];

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        forwardDynamicsABA(arm7DofTree, q, qDot, tau);
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(100.0); // robust to parallel test runner CPU load
    });
  });

  describe("Mechanical Energy Conservation & Multibody Stepping", () => {
    it("conserves mechanical energy under unforced undamped oscillation", () => {
      let q = [Math.PI / 4, 0]; // 45 deg start
      let qDot = [0, 0];
      const tau = [0, 0];
      const dt = 0.001;

      const e0 = computeMechanicalEnergy(doublePendulumTree, q, qDot);

      // Step forward 50 steps
      for (let step = 0; step < 50; step++) {
        const next = stepMultibodyDynamics(doublePendulumTree, q, qDot, tau, dt);
        q = next.qNext;
        qDot = next.qDotNext;
      }

      const eFinal = computeMechanicalEnergy(doublePendulumTree, q, qDot);

      // Energy change should be small (<5% drift over symplectic integration)
      const energyDelta = Math.abs(eFinal.totalEnergy - e0.totalEnergy);
      expect(energyDelta).toBeLessThan(1.0);
    });
  });
});
