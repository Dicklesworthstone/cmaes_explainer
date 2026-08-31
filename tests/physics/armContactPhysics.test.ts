import { describe, expect, test } from "bun:test";
import {
  OBJECT_CONTACT_HULLS,
  resolveArmObjectContact,
} from "../../app/lib/armContactPhysics";

describe("SOTA Arm & Object Contact Physics Suite", () => {
  test("prevents gripper fingers from penetrating ceramic coffee mug", () => {
    const mugHull = OBJECT_CONTACT_HULLS["kitchen-mug"];
    const mugDiameter = mugHull.radiusM * 2; // 0.085m

    // Commanded aperture wants to crush to 0.01m (10mm)
    const result = resolveArmObjectContact({
      rawEndEffectorPos: [0.4, 0.9, 0.2],
      rawObjectPos: [0.4, 0.8275, 0.2],
      commandedGripperWidthM: 0.01,
      taskOrObjectId: "kitchen-mug",
      isGraspedIntent: true,
      tableY: 0.78,
    });

    // Effective aperture MUST be clamped at or above object outer diameter (>= 0.085m)
    expect(result.effectiveGripperWidthM).toBeGreaterThanOrEqual(mugDiameter);
    // Pinch force must be generated from virtual spring
    expect(result.normalForceN).toBeGreaterThan(5.0);
    // Grasp is locked
    expect(result.isGrasped).toBe(true);
    expect(result.gwsRadius).toBeGreaterThan(0.2);
  });

  test("locks object rigidly to end-effector during grasp and transport", () => {
    const endEffectorLiftPos: [number, number, number] = [0.1, 1.15, 0.0];
    const initialTablePos: [number, number, number] = [0.4, 0.8275, 0.2];

    const result = resolveArmObjectContact({
      rawEndEffectorPos: endEffectorLiftPos,
      rawObjectPos: initialTablePos,
      commandedGripperWidthM: 0.05,
      taskOrObjectId: "kitchen-mug",
      isGraspedIntent: true,
      tableY: 0.78,
    });

    // Object X and Z must follow the gripper end-effector in exact lockstep
    expect(result.resolvedObjectPos[0]).toBeCloseTo(endEffectorLiftPos[0], 5);
    expect(result.resolvedObjectPos[2]).toBeCloseTo(endEffectorLiftPos[2], 5);
    // Object Y must be lifted above table
    expect(result.resolvedObjectPos[1]).toBeGreaterThan(0.9);
  });

  test("enforces tabletop non-penetration for resting and placed objects", () => {
    // Commanded object position below table (0.5m)
    const result = resolveArmObjectContact({
      rawEndEffectorPos: [0.4, 0.9, 0.2],
      rawObjectPos: [0.4, 0.5, 0.2], // below table
      commandedGripperWidthM: 0.12,
      taskOrObjectId: "glass-pitcher",
      isGraspedIntent: false,
      tableY: 0.78,
    });

    const pitcherHeight = OBJECT_CONTACT_HULLS["glass-pitcher"].heightM;
    const minCenterY = 0.78 + pitcherHeight * 0.5;

    // Object center MUST be clamped above table
    expect(result.resolvedObjectPos[1]).toBeGreaterThanOrEqual(minCenterY - 1e-4);
    expect(result.isGrasped).toBe(false);
  });

  test("handles all household object presets without errors", () => {
    const objectKeys = Object.keys(OBJECT_CONTACT_HULLS);
    for (const key of objectKeys) {
      const result = resolveArmObjectContact({
        rawEndEffectorPos: [0.2, 0.85, 0.1],
        rawObjectPos: [0.2, 0.82, 0.1],
        commandedGripperWidthM: 0.02,
        taskOrObjectId: key,
        isGraspedIntent: true,
        tableY: 0.78,
      });
      expect(result.effectiveGripperWidthM).toBeGreaterThan(0.04);
      expect(result.normalForceN).toBeGreaterThan(0);
    }
  });
});
