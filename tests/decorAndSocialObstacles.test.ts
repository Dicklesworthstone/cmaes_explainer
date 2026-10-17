import { describe, expect, test } from "bun:test";
import {
  checkDecorTipping,
  createDecorObject,
  DEFAULT_SILHOUETTE_PROFILES,
  evaluateSocialCbf,
  evaluateSocialPotential,
  filterSocialVelocityCbf,
  type SilhouetteAgent,
  stepSilhouetteAgent,
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

  test("checkDecorTipping clamps lever arm at base and top, and filterSocialVelocityCbf enforces safety", () => {
    const lamp = createDecorObject("lamp-2", "floor-lamp", [0, 0, 0]);
    // Impact at base (y = 0) produces 0 torque
    expect(checkDecorTipping(lamp, 100.0, 0.0).appliedTorqueNm).toBe(0.0);
    // Impact above top (y = 10.0 > height 1.65) clamps lever arm to lamp.height
    expect(checkDecorTipping(lamp, 10.0, 10.0).appliedTorqueNm).toBeCloseTo(10.0 * lamp.height, 5);

    let walker: SilhouetteAgent = {
      id: "ped-walk",
      ...DEFAULT_SILHOUETTE_PROFILES["pedestrian-walking"],
      position: [1.95, 0.0],
      velocity: [1.0, 0.0],
    };
    walker = stepSilhouetteAgent(walker, 0.1, { minX: -2, maxX: 2, minZ: -2, maxZ: 2 });
    expect(walker.position[0]).toBeCloseTo(2.0, 5);
    expect(walker.velocity[0]).toBeLessThan(0.0); // Reflected off maxX wall

    // Coincident query returns unit gradient norm
    const coinc = evaluateSocialCbf(walker.position, [0, 0], walker);
    expect(Math.hypot(coinc.gradSocial[0], coinc.gradSocial[1])).toBeCloseTo(1.0, 6);

    // filterSocialVelocityCbf deflects robot moving directly toward pedestrian inside comfort zone
    const standing: SilhouetteAgent = {
      id: "ped-stand",
      ...DEFAULT_SILHOUETTE_PROFILES["pedestrian-standing"],
      position: [1.0, 0.0],
    };
    const filtered = filterSocialVelocityCbf([1.0, 0.0], [0.4, 0.0], [standing], 2.0, 0.5, 1.2);
    expect(filtered.safeVelocity[0]).toBeLessThan(1.0);
    expect(filtered.interventionMagnitude).toBeGreaterThan(0.0);
  });
});
