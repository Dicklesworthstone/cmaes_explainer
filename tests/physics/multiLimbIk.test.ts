import { describe, expect, test } from "bun:test";
import {
  solveTwoBoneIK,
  clampSphereAgainstHouse,
  solveFullBodyG1IK,
  computeImpulseResponse,
  G1_KINEMATICS,
  G1_INTERACTIVE_PINS,
} from "../../app/lib/humanoidRagdollIk";
import { createSceneFromHouseFurniture } from "../../app/lib/houseMultiObstacleKernel";
import { CRAFTSMAN_BUNGALOW_1928 } from "../../app/lib/houseScenes";

describe("Multi-Limb Inverse Kinematics & Collision Ragdoll Suite", () => {
  test("two-bone IK reaches exact target when within range", () => {
    const root: [number, number, number] = [0, 0.75, 0];
    const target: [number, number, number] = [0, 0.2, 0];
    const upper = 0.32;
    const lower = 0.30;
    const pole: [number, number, number] = [1, 0, 0];

    const result = solveTwoBoneIK(root, target, upper, lower, pole);
    expect(result.reachedTarget[0]).toBeCloseTo(target[0], 3);
    expect(result.reachedTarget[1]).toBeCloseTo(target[1], 3);
    expect(result.reachedTarget[2]).toBeCloseTo(target[2], 3);

    // Mid joint must bend in the positive pole vector direction (X > 0)
    expect(result.midPosition[0]).toBeGreaterThan(0);
  });

  test("two-bone IK clamps gracefully when target exceeds maximum reach", () => {
    const root: [number, number, number] = [0, 0, 0];
    const target: [number, number, number] = [0, 2.0, 0]; // 2.0m exceeds upper+lower (0.62m)
    const upper = 0.32;
    const lower = 0.30;

    const result = solveTwoBoneIK(root, target, upper, lower, [1, 0, 0]);
    const maxReach = upper + lower - 0.001;
    expect(result.reachedTarget[1]).toBeCloseTo(maxReach, 2);
  });

  test("whole-body G1 collision clamping prevents wall and furniture penetration", () => {
    const scene = createSceneFromHouseFurniture(CRAFTSMAN_BUNGALOW_1928.furniture);
    const nominalPelvis: [number, number, number] = [0, 0.75, 0];

    // Attempt to drag left hand into a wall/obstacle
    const result = solveFullBodyG1IK(
      {
        leftHand: [-3.8, 1.0, 0], // Outside west wall bounds!
      },
      nominalPelvis,
      scene.obstacles
    );

    expect(result.leftHandPosition[0]).toBeGreaterThan(-3.7);
    expect(result.minClearance).toBeGreaterThanOrEqual(0);
  });

  test("impulse dynamics computes linear inverted pendulum capture point step", () => {
    const impulse = computeImpulseResponse(20.0, 0.0, 35.0); // 20 N*s forward impulse
    expect(impulse.deltaV[0]).toBeCloseTo(20.0 / 35.0, 3);
    expect(impulse.recoveryStepOffset[0]).toBeGreaterThan(0.1); // robot must step forward >10cm
    expect(impulse.recoveryStepOffset[2]).toBeCloseTo(0, 3);
  });

  test("interactive limb pin definitions exist for all 6 key extremities", () => {
    expect(G1_INTERACTIVE_PINS.length).toBe(6);
    const ids = G1_INTERACTIVE_PINS.map((p) => p.id);
    expect(ids).toContain("head");
    expect(ids).toContain("pelvis");
    expect(ids).toContain("leftHand");
    expect(ids).toContain("rightHand");
    expect(ids).toContain("leftFoot");
    expect(ids).toContain("rightFoot");
  });
});

describe("clampSphereAgainstHouse — yawed OBB regression (cmaes-pvz followup)", () => {
  test("a sphere inside a yawed chair must be projected out, not left inside", () => {
    // The user reported the G1 colliding with furniture when the chair is
    // yawed. The previous radial-from-center projection in
    // clampSphereAgainstHouse left the sphere inside. This test pins the
    // corrected behavior: the kernel's projectPointOutOfOBB (SDF gradient)
    // is used and the Y coordinate is updated when the OBB pushes the
    // sphere up.
    const yawedChair = {
      id: "yawed-chair",
      name: "yawed-chair",
      center: [1, 0.475, 1.6] as [number, number, number],
      halfExtents: [0.225, 0.475, 0.25] as [number, number, number],
      rotationYawRad: Math.PI, // 180-degree yaw
    };
    const sphere: [number, number, number] = [1.01, 0.85, 1.6];
    const radius = 0.06;
    const { clamped, contact } = clampSphereAgainstHouse(
      sphere,
      radius,
      [yawedChair],
      0.0,
    );
    expect(contact).not.toBeNull();
    expect(contact?.obstacleName).toBe("yawed-chair");
    // After projection, the sphere must clear the chair by the radius.
    const { distanceToOBB } = require("../../app/lib/houseMultiObstacleKernel");
    expect(distanceToOBB(clamped, yawedChair)).toBeGreaterThanOrEqual(
      radius - 1e-6,
    );
    // The Y coordinate must have been updated (the chair is tall enough
    // to push the sphere above the original Y).
    expect(clamped[1]).toBeGreaterThan(sphere[1]);
  });
});
