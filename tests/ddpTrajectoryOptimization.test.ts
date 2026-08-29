import { describe, expect, it } from "bun:test";
import {
  solveDDP,
  linearizeDynamics,
  evalDynamics,
  evaluateTrajectoryCost,
  type DDPConfig,
  type DDPWeights,
} from "../app/lib/ddpTrajectoryOptimization";
import { type MultibodyTree } from "../app/lib/featherstoneDynamics";
import { DifferentiableSdfNode } from "../app/lib/differentiableSdf";
import { sdfSphere } from "../app/lib/analyticSdf";

describe("Differential Dynamic Programming (DDP / iLQR / Crocoddyl)", () => {
  const singlePendulum: MultibodyTree = {
    name: "1-link-pendulum",
    gravity: [0, 0, -9.81],
    links: [
      {
        id: "link1",
        name: "Link 1",
        parentIndex: -1,
        jointType: "revolute",
        jointAxis: [0, 1, 0],
        parentTransform: { rotation: [0, 0, 0], translation: [0, 0, 0] },
        mass: 1.0,
        centerOfMass: [0, 0, -0.5],
        inertiaPrincipal: [0.0833, 0.0833, 0.01],
        damping: 0.1,
      },
    ],
  };

  const doublePendulum: MultibodyTree = {
    name: "2-link-pendulum",
    gravity: [0, 0, -9.81],
    links: [
      {
        id: "link1",
        name: "Link 1",
        parentIndex: -1,
        jointType: "revolute",
        jointAxis: [0, 1, 0],
        parentTransform: { rotation: [0, 0, 0], translation: [0, 0, 0] },
        mass: 1.0,
        centerOfMass: [0, 0, -0.5],
        inertiaPrincipal: [0.0833, 0.0833, 0.01],
        damping: 0.05,
      },
      {
        id: "link2",
        name: "Link 2",
        parentIndex: 0,
        jointType: "revolute",
        jointAxis: [0, 1, 0],
        parentTransform: { rotation: [0, 0, 0], translation: [0, 0, -1.0] },
        mass: 1.0,
        centerOfMass: [0, 0, -0.5],
        inertiaPrincipal: [0.0833, 0.0833, 0.01],
        damping: 0.05,
      },
    ],
  };

  describe("Dynamics Linearization & Jacobians", () => {
    it("linearizes dynamics and produces non-zero state and control Jacobians A and B", () => {
      const x = [0.2, 0.5]; // [q, qDot]
      const u = [1.0]; // [tau]
      const dt = 0.01;

      const { A, B } = linearizeDynamics(singlePendulum, x, u, dt);

      // State dimension is 2, control dimension is 1
      expect(A.length).toBe(2);
      expect(A[0].length).toBe(2);
      expect(B.length).toBe(2);
      expect(B[0].length).toBe(1);

      // A_00 should be ~1 + O(dt^2), A_01 should be ~dt
      expect(A[0][0]).toBeCloseTo(1.0, 2);
      expect(A[0][1]).toBeCloseTo(dt, 2);
      // B_10 (acceleration wrt torque) must be strictly positive
      expect(B[1][0]).toBeGreaterThan(0.0);
    });
  });

  describe("Trajectory Optimization & Cost Monotonicity", () => {
    it("optimizes 1-link pendulum trajectory and reduces total cost by >50%", () => {
      const x0 = [0.0, 0.0]; // starting at bottom rest
      const xGoal = [Math.PI, 0.0]; // target upright equilibrium
      const T = 30;
      const initialControls = Array.from({ length: T }, () => [0.0]);

      const weights: DDPWeights = {
        qState: [1.0, 0.1],
        rControl: [0.005],
        qTerminal: [50.0, 5.0],
      };

      const config: DDPConfig = {
        horizonSteps: T,
        dt: 0.02,
        maxIterations: 15,
        tolerance: 1e-3,
        regularizationInit: 1e-3,
        regularizationFactor: 2.0,
        minRegularization: 1e-6,
        maxRegularization: 1e6,
      };

      const result = solveDDP(singlePendulum, x0, xGoal, initialControls, weights, config);

      expect(result.finalCost).toBeLessThan(result.initialCost);
      expect(result.finalCost).toBeLessThan(result.initialCost * 0.5);
      expect(result.feedforwardGains.length).toBe(T);
      expect(result.feedbackGains.length).toBe(T);
    });

    it("optimizes 2-link articulated robot arm reaching task", () => {
      const x0 = [0.0, 0.0, 0.0, 0.0]; // [q1, q2, qDot1, qDot2]
      const xGoal = [0.8, -0.6, 0.0, 0.0];
      const T = 25;
      const initialControls = Array.from({ length: T }, () => [0.0, 0.0]);

      const weights: DDPWeights = {
        qState: [2.0, 2.0, 0.2, 0.2],
        rControl: [0.01, 0.01],
        qTerminal: [100.0, 100.0, 10.0, 10.0],
      };

      const config: DDPConfig = {
        horizonSteps: T,
        dt: 0.02,
        maxIterations: 12,
        tolerance: 1e-3,
        regularizationInit: 1e-3,
        regularizationFactor: 2.0,
        minRegularization: 1e-6,
        maxRegularization: 1e6,
      };

      const result = solveDDP(doublePendulum, x0, xGoal, initialControls, weights, config);

      expect(result.finalCost).toBeLessThan(result.initialCost);
      // Final state should approach goal state
      const finalState = result.states[T];
      expect(Math.abs(finalState[0] - xGoal[0])).toBeLessThan(0.4);
      expect(Math.abs(finalState[1] - xGoal[1])).toBeLessThan(0.4);
    });
  });

  describe("Obstacle Barrier Penalty Integration", () => {
    it("incorporates differentiable SDF obstacle barrier into trajectory cost", () => {
      const sphereObstacle = new DifferentiableSdfNode((p) => sdfSphere(p, [0.5, 0.5, 0], 0.3).distance);
      const states = [
        [0.5, 0.5, 0, 0], // exact obstacle center: dist = -0.3 < dSafe
        [2.0, 2.0, 0, 0], // far away
      ];
      const controls = [[0.1, 0.1]];
      const targetState = [2.0, 2.0, 0, 0];

      const weightsWithBarrier: DDPWeights = {
        qState: [1, 1, 0.1, 0.1],
        rControl: [0.01, 0.01],
        qTerminal: [10, 10, 1, 1],
        wObstacleBarrier: 100.0,
        dSafe: 0.4,
      };

      const costWithObs = evaluateTrajectoryCost(states, controls, targetState, weightsWithBarrier, [sphereObstacle]);
      const costWithoutObs = evaluateTrajectoryCost(states, controls, targetState, { ...weightsWithBarrier, wObstacleBarrier: 0 }, [sphereObstacle]);

      expect(costWithObs).toBeGreaterThan(costWithoutObs);
    });
  });
});
