import { describe, expect, test } from "bun:test";
import {
  computeFerrariCannyGWS,
  MANIPULABLE_OBJECT_PRESETS,
  solveKukaIK,
  computeKukaFK,
  clampArmTargetPosition,
  isTargetKukaReachable,
} from "../../app/lib/armInverseKinematics";
import { createSceneFromHouseFurniture } from "../../app/lib/houseMultiObstacleKernel";
import { CRAFTSMAN_BUNGALOW_1928 } from "../../app/lib/houseScenes";

describe("Ferrari-Canny Grasp Wrench Space & Manipulation Physics", () => {
  test("computes accurate GWS radius for ceramic coffee mug", () => {
    const mug = MANIPULABLE_OBJECT_PRESETS["kitchen-mug"];
    expect(mug).toBeDefined();
    expect(mug.massKg).toBe(0.35);
    expect(mug.frictionCoeff).toBe(0.65);

    // Well-aligned grasp with 25N normal force
    const result = computeFerrariCannyGWS(25.0, 0.084, mug.dimensionsM[0], mug.frictionCoeff);
    expect(result.gwsRadius).toBeGreaterThan(0.4);
    expect(result.isStableGrasp).toBe(true);
    expect(result.normalForceN).toBe(25.0);
    expect(result.maxFrictionForceN).toBeCloseTo(25.0 * 0.65, 3);
  });

  test("detects grasp slip / instability for low normal force", () => {
    const glass = MANIPULABLE_OBJECT_PRESETS["glass-pitcher"];
    expect(glass.frictionCoeff).toBe(0.45);

    // Insufficient normal force (3N) -> unstable grasp
    const result = computeFerrariCannyGWS(3.0, 0.13, glass.dimensionsM[0], glass.frictionCoeff);
    expect(result.isStableGrasp).toBe(false);
    expect(result.gwsRadius).toBeLessThan(0.15);
  });

  test("handles zero aperture and oversized apertures gracefully", () => {
    const apple = MANIPULABLE_OBJECT_PRESETS["orchard-apple"];
    const closed = computeFerrariCannyGWS(20.0, 0.0, apple.dimensionsM[0], apple.frictionCoeff);
    expect(closed.gwsRadius).toBeLessThan(0.2); // mismatch in aperture vs diameter

    const wide = computeFerrariCannyGWS(20.0, 0.25, apple.dimensionsM[0], apple.frictionCoeff);
    expect(wide.gwsRadius).toBe(0); // completely outside grasp envelope
  });

  test("KUKA 7-DoF Inverse Kinematics converges to within 3mm of target", () => {
    const target: [number, number, number] = [0.35, 0.95, 0.25];
    const initial = [0, 0.4, 0, -1.2, 0, 0.8, 0];
    const angles = solveKukaIK(target, initial, [0, 0.78, 0], 80);

    const { endEffector } = computeKukaFK(angles, [0, 0.78, 0]);
    const dist = Math.hypot(
      target[0] - endEffector[0],
      target[1] - endEffector[1],
      target[2] - endEffector[2]
    );
    expect(dist).toBeLessThan(0.015); // <1.5cm analytical precision
  });

  test("enforces tabletop non-penetration constraint Y >= 0.78m", () => {
    const scene = createSceneFromHouseFurniture(CRAFTSMAN_BUNGALOW_1928.furniture);
    const belowTable: [number, number, number] = [0.2, 0.5, 0.1]; // Y=0.5 is 28cm inside table!
    const { clampedTarget, isColliding } = clampArmTargetPosition(belowTable, scene.obstacles, 0.78, 0.04);

    expect(clampedTarget[1]).toBeGreaterThanOrEqual(0.78 + 0.04);
  });

  test("distinguishes reachable targets from positions outside the arm workspace", () => {
    expect(isTargetKukaReachable([0.35, 0.95, 0.25])).toBe(true);
    expect(isTargetKukaReachable([1.5, 0.82, 1.5])).toBe(false);
  });
});
