import { describe, expect, test } from "bun:test";
import {
  ARM_LINK_RADII,
  OBJECT_CONTACT_HULLS,
  detectArmSelfCollisions,
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

describe("arm self-collision diagnostic", () => {
  test("a straight chain with generous spacing reports no self contact", () => {
    const chain: [number, number, number][] = Array.from({ length: 8 }, (_, i) => [0, 0.78 + i * 0.25, 0]);
    expect(detectArmSelfCollisions(chain, ARM_LINK_RADII)).toEqual([]);
  });

  test("adjacent links are never reported even though they touch", () => {
    const chain: [number, number, number][] = Array.from({ length: 8 }, (_, i) => [0, 0.78 + i * 0.05, 0]);
    const contacts = detectArmSelfCollisions(chain, ARM_LINK_RADII);
    expect(contacts.every((c) => c.linkB - c.linkA >= 2)).toBe(true);
  });

  test("a flange folded back into the base is reported with its overlap depth", () => {
    const chain: [number, number, number][] = [
      [0, 0.78, 0],
      [0, 1.14, 0],
      [0.3, 1.4, 0],
      [0.55, 1.1, 0],
      [0.3, 0.9, 0],
      [0.15, 0.85, 0],
      [0.08, 0.82, 0],
      [0.02, 0.8, 0], // flange 2 cm from the base origin
    ];
    const contacts = detectArmSelfCollisions(chain, ARM_LINK_RADII);
    const baseFlange = contacts.find((c) => c.linkA === 0 && c.linkB === 7);
    expect(baseFlange).toBeDefined();
    expect(baseFlange!.penetration).toBeCloseTo(0.1 + 0.04 - Math.hypot(0.02, 0.02), 6);
  });

  test("the shared radius table has one entry per iiwa link and tapers toward the flange", () => {
    expect(ARM_LINK_RADII.length).toBe(8);
    for (let i = 1; i < ARM_LINK_RADII.length; i++) {
      expect(ARM_LINK_RADII[i]).toBeLessThanOrEqual(ARM_LINK_RADII[i - 1]);
    }
  });
});
