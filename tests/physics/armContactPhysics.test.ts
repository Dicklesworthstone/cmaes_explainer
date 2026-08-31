import { describe, expect, test } from "bun:test";
import {
  OBJECT_CONTACT_HULLS,
  resolveArmObjectContact,
  resolveRenderedGripperContactGeometry,
} from "../../app/lib/armContactPhysics";

describe("experimental arm contact display approximation", () => {
  test("keeps the displayed finger aperture outside the mug envelope", () => {
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

    // The display aperture is clamped at or above the object diameter.
    expect(result.effectiveGripperWidthM).toBeGreaterThanOrEqual(mugDiameter);
    // The display approximation derives a virtual-spring force.
    expect(result.normalForceN).toBeGreaterThan(5.0);
    // The display state follows the gripper while grasp intent is active.
    expect(result.isGrasped).toBe(true);
    expect(result.gwsRadius).toBeGreaterThan(0.2);
  });

  test("moves the display object with the end-effector during grasp intent", () => {
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

    // Display X and Z follow the gripper end-effector.
    expect(result.resolvedObjectPos[0]).toBeCloseTo(endEffectorLiftPos[0], 5);
    expect(result.resolvedObjectPos[2]).toBeCloseTo(endEffectorLiftPos[2], 5);
    // Display Y remains above the table.
    expect(result.resolvedObjectPos[1]).toBeGreaterThan(0.9);
  });

  test("clamps resting display objects above the tabletop", () => {
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

    // The display center is clamped above the table.
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

  test("keeps both finite pads and the palm outside every owner object envelope", () => {
    const ownerObjects = [
      { graspHalfWidthM: 0.046, objectHalfHeightM: 0.052, commandedGripperWidthM: 0.084 },
      { graspHalfWidthM: 0.029, objectHalfHeightM: 0.012, commandedGripperWidthM: 0.05 },
      { graspHalfWidthM: 0.021, objectHalfHeightM: 0.024, commandedGripperWidthM: 0.034 },
    ];
    for (const object of ownerObjects) {
      const geometry = resolveRenderedGripperContactGeometry(object);
      expect(geometry.minimumObjectClearanceM).toBeGreaterThanOrEqual(0.002 - 1e-12);
    }
  });

  test("prevents a closing command from tunneling either pad through the object", () => {
    const geometry = resolveRenderedGripperContactGeometry({
      commandedGripperWidthM: 0,
      graspHalfWidthM: 0.046,
      objectHalfHeightM: 0.052,
    });
    expect(geometry.fingerCenterHalfWidthM - 0.007).toBeGreaterThan(0.046);
    expect(geometry.palmCenterOffsetM - 0.0175).toBeGreaterThan(0.052);
    expect(geometry.wristHousingCenterOffsetM - 0.0425).toBeGreaterThan(0.052);
  });

  test("preserves a wider collision-free commanded aperture", () => {
    const geometry = resolveRenderedGripperContactGeometry({
      commandedGripperWidthM: 0.14,
      graspHalfWidthM: 0.046,
      objectHalfHeightM: 0.052,
    });
    expect(geometry.fingerCenterHalfWidthM).toBe(0.07);
    expect(geometry.minimumObjectClearanceM).toBeCloseTo(0.002, 12);
  });

  test("rejects malformed rendered contact dimensions", () => {
    expect(() => resolveRenderedGripperContactGeometry({
      commandedGripperWidthM: Number.NaN,
      graspHalfWidthM: 0.046,
      objectHalfHeightM: 0.052,
    })).toThrow("finite and non-negative");
    expect(() => resolveRenderedGripperContactGeometry({
      commandedGripperWidthM: 0.084,
      graspHalfWidthM: -0.046,
      objectHalfHeightM: 0.052,
    })).toThrow("finite and non-negative");
  });

  test("fails closed on unknown objects and non-finite inputs", () => {
    expect(() =>
      resolveArmObjectContact({
        rawEndEffectorPos: [0, 1, 0],
        rawObjectPos: [0, 0.8, 0],
        commandedGripperWidthM: 0.05,
        taskOrObjectId: "unknown-object",
        isGraspedIntent: false,
      }),
    ).toThrow("unknown arm contact hull");
    expect(() =>
      resolveArmObjectContact({
        rawEndEffectorPos: [Number.NaN, 1, 0],
        rawObjectPos: [0, 0.8, 0],
        commandedGripperWidthM: 0.05,
        taskOrObjectId: "kitchen-mug",
        isGraspedIntent: false,
      }),
    ).toThrow("must be finite");
  });
});
