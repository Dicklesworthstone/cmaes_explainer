import { describe, expect, test } from "bun:test";
import { sdfBox, sdfSphere } from "../app/lib/analyticSdf";
import {
  ccdCapsuleTrajectory,
  ccdSphereTrajectory,
  ccdWholeBodyTrajectory,
  type MovingRobotLink,
} from "../app/lib/continuousCollisionDetection";

describe("Continuous Collision Detection (CCD) over SDFs", () => {
  test("prevents tunneling through thin obstacles during high-velocity motion", () => {
    // Thin wall box at x = 0, half-extents [0.05, 2, 2] (thickness 0.1m)
    const wallSdf = (p: [number, number, number]) => sdfBox(p, [0, 0, 0], [0.05, 2, 2]);

    // High velocity sphere bullet starting at x = -5, ending at x = +5
    const p0: [number, number, number] = [-5, 0, 0];
    const p1: [number, number, number] = [5, 0, 0];
    const radius = 0.1;

    // Notice that discrete endpoint checks at p0 (-5) and p1 (+5) are BOTH collision-free
    expect(wallSdf(p0).distance).toBeGreaterThan(4.0);
    expect(wallSdf(p1).distance).toBeGreaterThan(4.0);

    // Continuous collision detection MUST catch the collision with the wall
    const ccdRes = ccdSphereTrajectory(p0, p1, radius, wallSdf);
    expect(ccdRes.hasCollision).toBe(true);

    // Time of impact should be when sphere front touches wall (x = -0.05 - 0.1 = -0.15)
    // t = (-0.15 - (-5)) / 10 = 4.85 / 10 = 0.485
    expect(ccdRes.timeOfImpact).toBeCloseTo(0.485, 2);
    expect(ccdRes.contactNormal[0]).toBeLessThan(0); // Normal should point towards incoming ray
  });

  test("confirms safety for trajectories with ample clearance", () => {
    const obstacle = (p: [number, number, number]) => sdfSphere(p, [0, 5, 0], 1.0);
    const p0: [number, number, number] = [-5, 0, 0];
    const p1: [number, number, number] = [5, 0, 0];

    const ccdRes = ccdSphereTrajectory(p0, p1, 0.2, obstacle);
    expect(ccdRes.hasCollision).toBe(false);
    expect(ccdRes.separationDistance).toBeGreaterThan(3.0);
  });

  test("detects moving robot arm capsule collisions", () => {
    const obstacle = (p: [number, number, number]) => sdfBox(p, [0, 1.0, 0], [0.3, 0.3, 0.3]);

    const armLink: MovingRobotLink = {
      name: "forearm",
      radius: 0.05,
      startA: [-1.0, 0.5, 0],
      startB: [-1.0, 1.5, 0],
      endA: [1.0, 0.5, 0],
      endB: [1.0, 1.5, 0], // Sweeps horizontally through the obstacle at x=0
    };

    const ccdRes = ccdCapsuleTrajectory(armLink, obstacle);
    expect(ccdRes.hasCollision).toBe(true);
    expect(ccdRes.timeOfImpact).toBeGreaterThan(0.2);
    expect(ccdRes.timeOfImpact).toBeLessThan(0.8);
  });

  test("evaluates whole-body multi-link trajectory safety", () => {
    const obstacle = (p: [number, number, number]) => sdfSphere(p, [2, 0.8, 0], 0.5);

    const links: MovingRobotLink[] = [
      {
        name: "torso",
        radius: 0.15,
        startA: [0, 0, 0],
        startB: [0, 1, 0],
        endA: [0, 0, 0],
        endB: [0, 1, 0],
      },
      {
        name: "right_arm",
        radius: 0.08,
        startA: [0, 0.8, 0],
        startB: [1, 0.8, 0],
        endA: [0, 0.8, 0],
        endB: [2.5, 0.8, 0], // Extends arm into obstacle
      },
    ];

    const wholeBodyRes = ccdWholeBodyTrajectory(links, obstacle);
    expect(wholeBodyRes.isSafe).toBe(false);
    expect(wholeBodyRes.earliestImpactLink).toBe("right_arm");
  });
});
