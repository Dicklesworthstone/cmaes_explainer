import { describe, expect, test } from "bun:test";
import {
  checkArmSelfCollision,
  checkG1SelfCollision,
  type LinkCapsule,
  segmentSegmentClosestPoints,
} from "../app/lib/robotSelfCollision";

describe("Robot Self-Collision Detection Engine", () => {
  test("segmentSegmentClosestPoints calculates exact distance between 3D segments", () => {
    // Parallel segments separated along Y by 1.0
    const p1: [number, number, number] = [0, 0, 0];
    const q1: [number, number, number] = [2, 0, 0];
    const p2: [number, number, number] = [0, 1, 0];
    const q2: [number, number, number] = [2, 1, 0];

    const res1 = segmentSegmentClosestPoints(p1, q1, p2, q2);
    expect(res1.distance).toBeCloseTo(1.0, 4);

    // Intersecting segments at (1, 1, 0)
    const p3: [number, number, number] = [0, 1, 0];
    const q3: [number, number, number] = [2, 1, 0];
    const p4: [number, number, number] = [1, 0, 0];
    const q4: [number, number, number] = [1, 2, 0];

    const res2 = segmentSegmentClosestPoints(p3, q3, p4, q4);
    expect(res2.distance).toBeCloseTo(0.0, 4);
    expect(res2.closest1[0]).toBeCloseTo(1.0, 4);
    expect(res2.closest1[1]).toBeCloseTo(1.0, 4);

    // Skewed 3D segments
    const p5: [number, number, number] = [0, 0, 0];
    const q5: [number, number, number] = [2, 0, 0]; // X axis
    const p6: [number, number, number] = [1, -1, 1];
    const q6: [number, number, number] = [1, 1, 1]; // Parallel to Y axis at x=1, z=1

    const res3 = segmentSegmentClosestPoints(p5, q5, p6, q6);
    expect(res3.distance).toBeCloseTo(1.0, 4); // Separated along Z by 1.0
    expect(res3.closest1[0]).toBeCloseTo(1.0, 4);
    expect(res3.closest2[0]).toBeCloseTo(1.0, 4);
  });

  test("G1 Humanoid nominal standing pose is collision free", () => {
    const nominalG1: LinkCapsule[] = [
      { name: "pelvis", start: [0, 0.75, 0], end: [0, 0.8, 0], radius: 0.1 },
      { name: "torso", start: [0, 0.8, 0], end: [0, 1.2, 0], radius: 0.12 },
      { name: "head", start: [0, 1.2, 0], end: [0, 1.4, 0], radius: 0.09 },
      // Left leg
      { name: "left_hip_pitch", start: [-0.1, 0.75, 0], end: [-0.1, 0.45, 0], radius: 0.06 },
      { name: "left_knee", start: [-0.1, 0.45, 0], end: [-0.1, 0.1, 0], radius: 0.05 },
      { name: "left_ankle_pitch", start: [-0.1, 0.1, 0], end: [-0.1, 0.0, 0.05], radius: 0.04 },
      // Right leg
      { name: "right_hip_pitch", start: [0.1, 0.75, 0], end: [0.1, 0.45, 0], radius: 0.06 },
      { name: "right_knee", start: [0.1, 0.45, 0], end: [0.1, 0.1, 0], radius: 0.05 },
      { name: "right_ankle_pitch", start: [0.1, 0.1, 0], end: [0.1, 0.0, 0.05], radius: 0.04 },
      // Left arm (pointing outward)
      { name: "left_shoulder_pitch", start: [-0.18, 1.15, 0], end: [-0.35, 1.15, 0], radius: 0.05 },
      { name: "left_elbow", start: [-0.35, 1.15, 0], end: [-0.55, 1.15, 0], radius: 0.04 },
      // Right arm (pointing outward)
      { name: "right_shoulder_pitch", start: [0.18, 1.15, 0], end: [0.35, 1.15, 0], radius: 0.05 },
      { name: "right_elbow", start: [0.35, 1.15, 0], end: [0.55, 1.15, 0], radius: 0.04 },
    ];

    const res = checkG1SelfCollision(nominalG1);
    expect(res.hasCollision).toBe(false);
    expect(res.minClearance).toBeGreaterThan(0.01);
  });

  test("detects leg crossing self-intersection on G1", () => {
    const crossedG1: LinkCapsule[] = [
      { name: "pelvis", start: [0, 0.75, 0], end: [0, 0.8, 0], radius: 0.1 },
      { name: "left_knee", start: [-0.1, 0.45, 0], end: [0.08, 0.1, 0], radius: 0.05 }, // Crosses to right side
      { name: "right_knee", start: [0.1, 0.45, 0], end: [-0.08, 0.1, 0], radius: 0.05 }, // Crosses to left side
    ];

    const res = checkG1SelfCollision(crossedG1);
    expect(res.hasCollision).toBe(true);
    expect(res.collidingPairs.length).toBeGreaterThan(0);
    expect(res.collidingPairs[0].linkA).toBe("left_knee");
    expect(res.collidingPairs[0].linkB).toBe("right_knee");
  });

  test("detects arm gripper collision with base on folded 7-DOF arm", () => {
    // Folded arm where gripper is brought right against base
    const arm: LinkCapsule[] = [
      { name: "link0_base", start: [0, 0, 0], end: [0, 0.1, 0], radius: 0.08 },
      { name: "link1_shoulder", start: [0, 0.1, 0], end: [0, 0.3, 0], radius: 0.06 },
      { name: "link2_upper_arm", start: [0, 0.3, 0], end: [0, 0.6, 0], radius: 0.05 },
      { name: "link3_elbow", start: [0, 0.6, 0], end: [0, 0.65, 0], radius: 0.05 },
      { name: "link4_forearm", start: [0, 0.65, 0], end: [0, 0.35, 0], radius: 0.05 }, // Folded back down
      { name: "link5_wrist", start: [0, 0.35, 0], end: [0, 0.15, 0], radius: 0.04 },
      { name: "link6_gripper", start: [0, 0.15, 0], end: [0, 0.02, 0], radius: 0.05 }, // Strikes base
    ];

    const res = checkArmSelfCollision(arm);
    expect(res.hasCollision).toBe(true);
    const collidingWithBase = res.collidingPairs.some(
      (p) => (p.linkA === "link0_base" && p.linkB === "link6_gripper") ||
             (p.linkA === "link6_gripper" && p.linkB === "link0_base")
    );
    expect(collidingWithBase).toBe(true);
  });
});
