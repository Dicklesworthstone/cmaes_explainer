import { describe, expect, test } from "bun:test";
import {
  KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS,
  KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE,
  buildKmrBaseMesh,
  computeDimensions,
  computeMountingPlatePose,
  type KmrGeometryConfig,
} from "../app/lib/kmrGeometry";

describe("KUKA KMR iiwa geometry (cmaes-kmr-base)", () => {
  test("separates official whole-vehicle data from procedural chassis assumptions", () => {
    expect(KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.lengthMeters).toBe(1.19);
    expect(KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.widthMeters).toBe(0.72);
    expect(KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.heightMeters).toBe(0.7);
    expect(KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.massKg).toBe(375);
    expect(KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.maximumPayloadKg).toBe(175);
    expect(KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE.sourceUrl).toContain(
      "kuka_kmriiwa_en.pdf",
    );
    expect(KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS.baseLengthMeters).toBe(0.8);
    expect(KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS.baseWidthMeters).toBe(0.6);
    expect(KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS.wheelDiameterMeters).toBe(0.15);
  });

  test("custom config produces customized dimensions", () => {
    const custom: KmrGeometryConfig = {
      ...KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS,
      baseLengthMeters: 1.2,
    };
    const mesh = buildKmrBaseMesh(custom);
    expect(mesh).toBeDefined();
  });

  test("computeDimensions derives radius and half-wheelbases from the config", () => {
    const d = computeDimensions(KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS);
    expect(d.wheelRadiusMeters).toBe(0.075);
    expect(d.halfWheelbaseX).toBe(0.3);
    expect(d.halfWheelbaseY).toBe(0.225);
  });

  test("mounting plate pose is at the top of the chassis by default", () => {
    const pose = computeMountingPlatePose(KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS);
    expect(pose.zMeters).toBe(0.38); // top of chassis
    expect(pose.xMeters).toBe(0.0);
    expect(pose.yMeters).toBe(0.0);
  });

  test("mounting plate pose respects an offset and a non-zero KMR center", () => {
    const pose = computeMountingPlatePose(
      {
        ...KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS,
        mountingPlateOffsetXMeters: 0.05,
      },
      1.5, 2.0, 0.0,
    );
    expect(pose.xMeters).toBe(1.55); // 1.5 + 0.05
    expect(pose.yMeters).toBe(2.0);
    expect(pose.zMeters).toBe(0.38);
  });

  test("buildKmrBaseMesh returns a group with the expected structure", () => {
    const mesh = buildKmrBaseMesh();
    // 1 chassis + 1 trim + 1 plate + 4 wheels + 1 lidar housing + 1 lidar lens = 9
    // (each wheel is itself a group with hub + 8 rollers + 2 caps = 11)
    expect(mesh.type).toBe("Group");
    expect(mesh.name).toBe("kmr_base_iiwa");
    expect(mesh.children.length).toBeGreaterThanOrEqual(7);
  });

  test("buildKmrBaseMesh adds exactly 4 named wheels at the four corners", () => {
    const mesh = buildKmrBaseMesh();
    // Each wheel is now a named Group (kmr_wheel_FL, FR, RL, RR)
    // so the KMR scene can find them and apply IK-derived spin.
    const wheelNames = ["kmr_wheel_FL", "kmr_wheel_FR", "kmr_wheel_RL", "kmr_wheel_RR"];
    for (const name of wheelNames) {
      const found = mesh.children.find((c) => c.name === name);
      expect(found, "expected to find wheel named " + name).toBeDefined();
    }
  });
});
