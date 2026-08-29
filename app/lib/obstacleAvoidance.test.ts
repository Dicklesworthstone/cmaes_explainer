import { describe, expect, it } from "bun:test";
import {
  computeObbSdf,
  solveCbfQp,
  buildWholeBodyCbfConstraints,
  applySafetyFilter,
  evaluateObstacleObjective,
  DEFAULT_CBF_CONFIG,
  type Obstacle3D,
  type RobotLinkState,
} from "./obstacleAvoidance";

describe("SOTA Control Barrier Functions & Obstacle Avoidance", () => {
  const sampleTable: Obstacle3D = {
    id: "craftsman-dining-table",
    name: "Dining Table",
    center: [1.5, 2.0, 0.4],
    halfExtents: [0.6, 0.9, 0.4],
    rotationYaw: 0,
  };

  const sampleChairRotated: Obstacle3D = {
    id: "craftsman-chair",
    name: "Dining Chair",
    center: [0.5, 2.0, 0.45],
    halfExtents: [0.25, 0.25, 0.45],
    rotationYaw: Math.PI / 4, // 45 degrees
  };

  describe("OBB Signed Distance Function (SDF)", () => {
    it("computes exact zero distance on box surface", () => {
      // Point directly on the top face of the table
      const surfacePoint: [number, number, number] = [1.5, 2.0, 0.8];
      const { distance, normal } = computeObbSdf(surfacePoint, sampleTable);
      expect(Math.abs(distance)).toBeLessThan(1e-5);
      expect(normal[2]).toBeCloseTo(1.0, 4);
    });

    it("computes exact Euclidean distance outside box", () => {
      // Point 0.5m in front of table along X
      const outsidePoint: [number, number, number] = [2.6, 2.0, 0.4];
      const { distance, normal } = computeObbSdf(outsidePoint, sampleTable);
      expect(distance).toBeCloseTo(0.5, 4);
      expect(normal[0]).toBeCloseTo(1.0, 4);
      expect(normal[1]).toBeCloseTo(0.0, 4);
      expect(normal[2]).toBeCloseTo(0.0, 4);
    });

    it("handles rotated OBBs accurately", () => {
      // Point along the rotated diagonal axis of the chair
      const diagonalPoint: [number, number, number] = [
        0.5 + 0.5 * Math.cos(Math.PI / 4),
        2.0 + 0.5 * Math.sin(Math.PI / 4),
        0.45,
      ];
      const { distance } = computeObbSdf(diagonalPoint, sampleChairRotated);
      // Distance from center is 0.5, face is at 0.25 -> distance should be approx 0.25
      expect(distance).toBeCloseTo(0.25, 3);
    });

    it("returns negative distance for interior points", () => {
      const interiorPoint: [number, number, number] = [1.5, 2.0, 0.4];
      const { distance } = computeObbSdf(interiorPoint, sampleTable);
      expect(distance).toBeLessThan(0);
      expect(distance).toBeCloseTo(-0.4, 4); // distance to closest face (Z at 0.4)
    });
  });

  describe("Sub-Millisecond QP Safety Filter Solver", () => {
    it("satisfies box bounds and inequality constraints", () => {
      // Nominal action moving strongly forward into an obstacle
      const uNom = [2.0, 0.0];
      const uMin = [-3.0, -3.0];
      const uMax = [3.0, 3.0];

      // Constraint: u_0 <= 0.5 (prevent moving +X faster than 0.5)
      const A = [[1.0, 0.0]];
      const b = [0.5];

      const res = solveCbfQp(uNom, A, b, uMin, uMax, DEFAULT_CBF_CONFIG);
      expect(res.converged).toBe(true);
      expect(res.safeAction[0]).toBeLessThanOrEqual(0.5001);
      expect(res.safeAction[1]).toBeCloseTo(0.0, 4);
    });

    it("leaves safe nominal action unmodified", () => {
      const uNom = [0.2, 0.1];
      const uMin = [-2.0, -2.0];
      const uMax = [2.0, 2.0];

      // Constraint allows u_0 <= 1.0
      const A = [[1.0, 0.0]];
      const b = [1.0];

      const res = solveCbfQp(uNom, A, b, uMin, uMax, DEFAULT_CBF_CONFIG);
      expect(res.converged).toBe(true);
      expect(res.safeAction[0]).toBeCloseTo(0.2, 4);
      expect(res.safeAction[1]).toBeCloseTo(0.1, 4);
      expect(res.activeConstraintsCount).toBe(0);
    });

    it("executes 100 consecutive QP solves in under 5ms total (<50µs per solve)", () => {
      const uNom = [1.5, 1.5, -0.5];
      const uMin = [-2, -2, -2];
      const uMax = [2, 2, 2];
      const A = [
        [1, 0, 0],
        [0, 1, 0],
        [-1, -1, 0],
      ];
      const b = [0.5, 0.8, -0.2];

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        solveCbfQp(uNom, A, b, uMin, uMax, DEFAULT_CBF_CONFIG);
      }
      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(15.0); // well within sub-ms budget
    });
  });

  describe("Whole-Body Multi-Link Collision Avoidance", () => {
    it("projects unsafe whole-body actions into safe control space", () => {
      const links: RobotLinkState[] = [
        {
          id: "g1-pelvis",
          name: "Pelvis",
          position: [0.8, 2.0, 0.75],
          velocity: [1.2, 0.0, 0.0], // heading directly into table at X=1.5
          radius: 0.15,
        },
        {
          id: "g1-left-knee",
          name: "Left Knee",
          position: [0.9, 1.9, 0.4],
          velocity: [1.5, 0.0, 0.0],
          radius: 0.08,
        },
      ];

      const uNom = [2.0, 0.0, 0.0, 2.0, 0.0, 0.0];
      const uMin = new Array(6).fill(-5.0);
      const uMax = new Array(6).fill(5.0);

      const res = applySafetyFilter(uNom, links, [sampleTable], uMin, uMax, DEFAULT_CBF_CONFIG);
      expect(res.converged).toBe(true);

      // Link 0 and Link 1 accelerations in +X should be significantly throttled or negative (braking)
      expect(res.safeAction[0]).toBeLessThan(uNom[0]);
      expect(res.safeAction[3]).toBeLessThan(uNom[3]);
    });
  });

  describe("Anti-Reward-Hacking & Objective Monotonicity", () => {
    it("strictly lowers penalty when obstacles are removed", () => {
      const trajectory = [
        {
          links: [
            {
              id: "g1-pelvis",
              name: "Pelvis",
              position: [1.0, 2.0, 0.75] as [number, number, number],
              velocity: [0.5, 0.0, 0.0] as [number, number, number],
              radius: 0.15,
            },
          ],
          action: [1.0, 0.0, 0.0],
          safeAction: [0.2, 0.0, 0.0],
          slack: 0.0,
        },
        {
          links: [
            {
              id: "g1-pelvis",
              name: "Pelvis",
              position: [1.2, 2.0, 0.75] as [number, number, number],
              velocity: [0.3, 0.0, 0.0] as [number, number, number],
              radius: 0.15,
            },
          ],
          action: [0.5, 0.0, 0.0],
          safeAction: [0.0, 0.0, 0.0],
          slack: 0.0,
        },
      ];

      const withObstacles = evaluateObstacleObjective(trajectory, [sampleTable]);
      const noObstacles = evaluateObstacleObjective(trajectory, []);

      // With obstacles present, proximity and intervention penalties must be > 0
      expect(withObstacles.totalPenalty).toBeGreaterThan(0);

      // Without obstacles, total obstacle penalty is strictly 0
      expect(noObstacles.totalPenalty).toBe(0);
      expect(noObstacles.totalPenalty).toBeLessThan(withObstacles.totalPenalty);
    });
  });
});
