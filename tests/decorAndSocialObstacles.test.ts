import { describe, expect, test } from "bun:test";
import {
  checkDecorTipping,
  createDecorObject,
  DEFAULT_SILHOUETTE_PROFILES,
  evaluateSocialCbf,
  evaluateSocialPotential,
  type SilhouetteAgent,
} from "../app/lib/decorAndSocialObstacles";

describe("Household Decor & Social Silhouette Obstacle Engine", () => {
  test("createDecorObject and checkDecorTipping calculate exact tipping torque", () => {
    // Floor lamp: mass 5.5kg, base radius 0.18m -> threshold = 5.5 * 9.81 * 0.18 = 9.7119 N*m
    const lamp = createDecorObject("lamp-1", "floor-lamp", [0, 0, 0]);
    expect(lamp.tippingTorqueThreshold).toBeCloseTo(9.7119, 3);

    // Light 5N bump at height 0.5m -> torque = 5 * 0.5 = 2.5 N*m < 9.71 N*m (safe)
    const gentleBump = checkDecorTipping(lamp, 5.0, 0.5);
    expect(gentleBump.willTip).toBe(false);

    // 15N impact at top height 1.5m -> torque = 15 * 1.5 = 22.5 N*m > 9.71 N*m (tips over!)
    const hardBump = checkDecorTipping(lamp, 15.0, 1.5);
    expect(hardBump.willTip).toBe(true);
  });

  test("evaluateSocialPotential shows forward anisotropic elongation for moving pedestrians", () => {
    const walkingPerson: SilhouetteAgent = {
      id: "ped-1",
      ...DEFAULT_SILHOUETTE_PROFILES["pedestrian-walking"],
      position: [0.0, 0.0],
      headingYaw: 0.0, // Facing +X
    };

    // 1.0m directly in front of person [+1.0, 0.0]
    const inFront = evaluateSocialPotential([1.0, 0.0], walkingPerson);

    // 1.0m directly behind person [-1.0, 0.0]
    const behind = evaluateSocialPotential([-1.0, 0.0], walkingPerson);

    // 1.0m directly to the side [0.0, 1.0]
    const toSide = evaluateSocialPotential([0.0, 1.0], walkingPerson);

    expect(inFront.potential).toBeGreaterThan(behind.potential);
    expect(inFront.potential).toBeGreaterThan(toSide.potential);

    // Gradient slope is negative as potential decays away from pedestrian (+X)
    expect(inFront.gradient[0]).toBeLessThan(0.0);
    // Repulsive force -grad points forward (+X) pushing robot away
    const repulsiveForceX = -inFront.gradient[0];
    expect(repulsiveForceX).toBeGreaterThan(0.0);
  });

  test("evaluateSocialCbf enforces dynamic velocity-aware comfort radius", () => {
    const standingPerson: SilhouetteAgent = {
      id: "ped-2",
      ...DEFAULT_SILHOUETTE_PROFILES["pedestrian-standing"],
      position: [2.0, 0.0],
    };

    // Robot at [0, 0] stationary -> dist = 2.0 > comfort 0.75 -> safe
    const stationary = evaluateSocialCbf([0, 0], [0, 0], standingPerson);
    expect(stationary.isSafe).toBe(true);
    expect(stationary.hSocial).toBeGreaterThan(1.0);

    // Robot at [1.5, 0] moving fast towards person at 1.5 m/s
    const fastApproach = evaluateSocialCbf([1.5, 0], [1.5, 0], standingPerson, 0.5);
    // dist = 0.5m, dynamic buffer = 0.75 + 0.5 * 1.5 = 1.5m -> hSocial = 0.5 - 1.5 = -1.0 (unsafe!)
    expect(fastApproach.isSafe).toBe(false);
    expect(fastApproach.hSocial).toBeLessThan(0.0);
  });

  test("sub-millisecond execution benchmark across 100 social potential queries", () => {
    const agent: SilhouetteAgent = {
      id: "dog-1",
      ...DEFAULT_SILHOUETTE_PROFILES["pet-dog"],
      position: [1.0, 1.0],
    };

    const t0 = performance.now();
    for (let i = 0; i < 100; i++) {
      evaluateSocialPotential([i * 0.05, 1.0], agent);
    }
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(10.0); // <100µs per query
  });
});
