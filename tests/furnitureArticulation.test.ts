import { describe, expect, test } from "bun:test";
import {
  ArticulationGraph,
  createCabinetArticulation,
  createDishwasherArticulation,
  createDresserArticulation,
  createFridgeArticulation,
  createFurnitureArticulation,
  createMicrowaveArticulation,
  createOvenArticulation,
  createWasherDryerArticulation,
} from "../app/lib/furnitureArticulation";

describe("ArticulationGraph core kinematics & dynamics", () => {
  test("enforces hard joint limits on manual position set", () => {
    const graph = new ArticulationGraph("base", {
      name: "base",
      mass: 10,
      inertia: { ixx: 1, iyy: 1, izz: 1 },
      centerOfMass: [0, 0, 0],
    });

    graph.addLink({
      name: "door",
      mass: 2,
      inertia: { ixx: 0.1, iyy: 0.1, izz: 0.02 },
      centerOfMass: [0, 0, 0],
    });

    graph.addJoint({
      name: "door_hinge",
      type: "revolute",
      parentLink: "base",
      childLink: "door",
      origin: [0.5, 0, 0],
      axis: [0, 1, 0],
      limits: { min: 0, max: 1.57 },
    });

    // Test inside limits
    graph.setJointPosition("door_hinge", 0.8);
    expect(graph.getJointPosition("door_hinge")).toBeCloseTo(0.8);

    // Test beyond upper limit
    graph.setJointPosition("door_hinge", 3.0);
    expect(graph.getJointPosition("door_hinge")).toBeCloseTo(1.57);

    // Test below lower limit
    graph.setJointPosition("door_hinge", -1.0);
    expect(graph.getJointPosition("door_hinge")).toBeCloseTo(0);
  });

  test("computes forward kinematics transformation tree", () => {
    const graph = new ArticulationGraph("base", {
      name: "base",
      mass: 20,
      inertia: { ixx: 2, iyy: 2, izz: 2 },
      centerOfMass: [0, 0, 0],
    });

    graph.addLink({
      name: "drawer",
      mass: 3,
      inertia: { ixx: 0.2, iyy: 0.2, izz: 0.2 },
      centerOfMass: [0, 0, 0],
    });

    graph.addJoint({
      name: "drawer_slide",
      type: "prismatic",
      parentLink: "base",
      childLink: "drawer",
      origin: [0, 0.5, 0.2],
      axis: [0, 0, 1],
      limits: { min: 0, max: 0.5 },
    });

    graph.setJointPosition("drawer_slide", 0.3);
    const poses = graph.computeForwardKinematics();

    expect(poses.has("base")).toBe(true);
    expect(poses.has("drawer")).toBe(true);

    const basePose = poses.get("base")!;
    expect(basePose.position).toEqual([0, 0, 0]);

    const drawerPose = poses.get("drawer")!;
    // Origin [0, 0.5, 0.2] + axis [0, 0, 1] * 0.3 = [0, 0.5, 0.5]
    expect(drawerPose.position[0]).toBeCloseTo(0);
    expect(drawerPose.position[1]).toBeCloseTo(0.5);
    expect(drawerPose.position[2]).toBeCloseTo(0.5);

    // Quaternions should be normalized
    const [qx, qy, qz, qw] = drawerPose.rotation;
    const qLen = Math.hypot(qx, qy, qz, qw);
    expect(qLen).toBeCloseTo(1.0, 4);
  });

  test("steps joint dynamics with external torque and limits", () => {
    const graph = createFridgeArticulation();
    expect(graph.getJointPosition("upper_door_hinge")).toBeCloseTo(0);

    // Apply positive opening torque for 10 steps
    for (let i = 0; i < 10; i++) {
      graph.stepDynamics(0.016, { upper_door_hinge: 5.0 });
    }

    const openPos = graph.getJointPosition("upper_door_hinge");
    expect(openPos).toBeGreaterThan(0);

    // Continue pushing until hitting max limit (2.1 rad)
    let sawClampedReceipt = false;
    for (let i = 0; i < 50; i++) {
      const receipts = graph.stepDynamicsWithReceipts(0.016, { upper_door_hinge: 20.0 });
      const r = receipts.get("upper_door_hinge")!;
      if (r.clampedAtLimit) {
        sawClampedReceipt = true;
        expect(r.newPosition).toBeCloseTo(2.1, 6);
        expect(r.newVelocity).toBe(0);
        expect(r.reactionImpulse).toBeGreaterThan(0);
      }
    }
    expect(sawClampedReceipt).toBe(true);
    expect(graph.getJointPosition("upper_door_hinge")).toBeCloseTo(2.1, 6);
  });

  test("negative control: locked joint refuses external torque and manual position overrides until unlocked", () => {
    const graph = createFridgeArticulation();
    graph.setJointLocked("upper_door_hinge", true);
    expect(graph.isJointLocked("upper_door_hinge")).toBe(true);

    // Manual override refused while locked
    graph.setJointPosition("upper_door_hinge", 1.2);
    expect(graph.getJointPosition("upper_door_hinge")).toBe(0);

    // Dynamic torque refused while locked, emitting lockedRefused receipt
    const lockedReceipts = graph.stepDynamicsWithReceipts(0.016, { upper_door_hinge: 15.0 });
    const lockedRec = lockedReceipts.get("upper_door_hinge")!;
    expect(lockedRec.lockedRefused).toBe(true);
    expect(lockedRec.newPosition).toBe(0);
    expect(lockedRec.newVelocity).toBe(0);
    expect(lockedRec.reactionImpulse).toBeCloseTo(15.0 * 0.016, 6);

    // Unlocking restores normal motion under identical torque
    graph.setJointLocked("upper_door_hinge", false);
    const unlockedReceipts = graph.stepDynamicsWithReceipts(0.016, { upper_door_hinge: 15.0 });
    const unlockedRec = unlockedReceipts.get("upper_door_hinge")!;
    expect(unlockedRec.lockedRefused).toBe(false);
    expect(unlockedRec.newPosition).toBeGreaterThan(0);
  });

  test("resting joint at limits.min with zero input reports clampedAtLimit=false while continuous joint rotates past limits", () => {
    const fridge = createFridgeArticulation();
    const restReceipts = fridge.stepDynamicsWithReceipts(0.016);
    const upperReceipt = restReceipts.get("upper_door_hinge")!;
    expect(upperReceipt.newPosition).toBe(0);
    expect(upperReceipt.newVelocity).toBe(0);
    expect(upperReceipt.clampedAtLimit).toBe(false);
    expect(upperReceipt.reactionImpulse).toBe(0);

    // Continuous joint can exceed nominal limits
    const spinner = new ArticulationGraph("base", {
      name: "base",
      mass: 5,
      inertia: { ixx: 1, iyy: 1, izz: 1 },
      centerOfMass: [0, 0, 0],
    });
    spinner.addLink({
      name: "wheel",
      mass: 1,
      inertia: { ixx: 0.5, iyy: 0.02, izz: 0.5 },
      centerOfMass: [0, 0, 0],
    });
    spinner.addJoint({
      name: "wheel_spin",
      type: "continuous",
      parentLink: "base",
      childLink: "wheel",
      origin: [0, 0, 0],
      axis: [1, 0, 0],
      limits: { min: -Math.PI, max: Math.PI },
    });
    spinner.setJointPosition("wheel_spin", 8.0);
    expect(spinner.getJointPosition("wheel_spin")).toBeCloseTo(8.0, 6);
    const spinRec = spinner.stepDynamicsWithReceipts(0.02, { wheel_spin: 2.0 }).get("wheel_spin")!;
    expect(spinRec.clampedAtLimit).toBe(false);
    expect(spinRec.newPosition).toBeGreaterThan(8.0);
  });
});

describe("articulation preset factories", () => {
  test("createFridgeArticulation contains upper and lower door joints", () => {
    const fridge = createFridgeArticulation(1.0, 0.9, 2.0);
    expect(fridge.rootLink).toBe("fridge_housing");
    expect(fridge.joints.has("upper_door_hinge")).toBe(true);
    expect(fridge.joints.has("lower_door_hinge")).toBe(true);

    const poses = fridge.computeForwardKinematics();
    expect(poses.size).toBe(3);
  });

  test("createOvenArticulation contains revolute door joint", () => {
    const oven = createOvenArticulation();
    expect(oven.joints.has("oven_door_hinge")).toBe(true);
    expect(oven.joints.get("oven_door_hinge")?.type).toBe("revolute");
  });

  test("createDresserArticulation generates correct number of prismatic drawers", () => {
    const dresser = createDresserArticulation(1.0, 0.6, 1.2, 4);
    expect(dresser.joints.size).toBe(4);
    for (let i = 0; i < 4; i++) {
      const j = dresser.joints.get(`drawer_slide_${i}`);
      expect(j).toBeDefined();
      expect(j?.type).toBe("prismatic");
      expect(j?.limits.max).toBeGreaterThan(0);
    }
  });

  test("createCabinetArticulation has left and right hinged doors", () => {
    const cabinet = createCabinetArticulation();
    expect(cabinet.joints.has("door_left_hinge")).toBe(true);
    expect(cabinet.joints.has("door_right_hinge")).toBe(true);
  });

  test("createMicrowaveArticulation has revolute door", () => {
    const micro = createMicrowaveArticulation();
    expect(micro.joints.has("microwave_hinge")).toBe(true);
  });

  test("createDishwasherArticulation has door and pull-out rack", () => {
    const dw = createDishwasherArticulation();
    expect(dw.joints.has("door_hinge")).toBe(true);
    expect(dw.joints.has("rack_upper_slide")).toBe(true);
  });

  test("createWasherDryerArticulation has porthole door", () => {
    const washer = createWasherDryerArticulation();
    expect(washer.joints.has("porthole_hinge")).toBe(true);
  });

  test("createFurnitureArticulation universal dispatcher resolves articulated types", () => {
    expect(createFurnitureArticulation("fridge")).not.toBeNull();
    expect(createFurnitureArticulation("oven")).not.toBeNull();
    expect(createFurnitureArticulation("dresser")).not.toBeNull();
    expect(createFurnitureArticulation("cabinet")).not.toBeNull();
    expect(createFurnitureArticulation("microwave")).not.toBeNull();
    expect(createFurnitureArticulation("dishwasher")).not.toBeNull();
    expect(createFurnitureArticulation("washer")).not.toBeNull();
    expect(createFurnitureArticulation("sofa")).toBeNull();
    expect(createFurnitureArticulation("dining-table")).toBeNull();
  });
});
