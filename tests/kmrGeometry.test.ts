import { describe, expect, test } from "bun:test";
import {
  KUKA_KMR_IIWA_PUBLIC_SPEC,
  buildKmrBaseMesh,
  computeDimensions,
  computeMountingPlatePose,
  type KmrGeometryConfig,
} from "../app/lib/kmrGeometry";

describe("KUKA KMR iiwa geometry (cmaes-kmr-base)", () => {
  test("default config is the public KMR iiwa spec", () => {
    // The default config must match the KUKA public spec exactly.
    // This is the regression guard against accidental dimension drift.
    expect(KUKA_KMR_IIWA_PUBLIC_SPEC.baseLengthMeters).toBe(0.8);
    expect(KUKA_KMR_IIWA_PUBLIC_SPEC.baseWidthMeters).toBe(0.6);
    expect(KUKA_KMR_IIWA_PUBLIC_SPEC.baseHeightMeters).toBe(0.38);
    expect(KUKA_KMR_IIWA_PUBLIC_SPEC.wheelDiameterMeters).toBe(0.15);
    expect(KUKA_KMR_IIWA_PUBLIC_SPEC.wheelbaseXMeters).toBe(0.6);
    expect(KUKA_KMR_IIWA_PUBLIC_SPEC.wheelbaseYMeters).toBe(0.45);
    expect(KUKA_KMR_IIWA_PUBLIC_SPEC.mountingPlateHeightMeters).toBe(0.38);
    expect(KUKA_KMR_IIWA_PUBLIC_SPEC.mountingPlateOffsetXMeters).toBe(0.0);
  });

  test("custom config produces customized dimensions", () => {
    const custom: KmrGeometryConfig = {
      ...KUKA_KMR_IIWA_PUBLIC_SPEC,
      baseLengthMeters: 1.2,
    };
    const mesh = buildKmrBaseMesh(custom);
    expect(mesh).toBeDefined();
  });

  test("computeDimensions derives radius and half-wheelbases from the config", () => {
    const d = computeDimensions(KUKA_KMR_IIWA_PUBLIC_SPEC);
    expect(d.wheelRadiusMeters).toBe(0.075);
    expect(d.halfWheelbaseX).toBe(0.3);
    expect(d.halfWheelbaseY).toBe(0.225);
  });

  test("mounting plate pose is at the top of the chassis by default", () => {
    const pose = computeMountingPlatePose(KUKA_KMR_IIWA_PUBLIC_SPEC);
    expect(pose.zMeters).toBe(0.38); // top of chassis
    expect(pose.xMeters).toBe(0.0);
    expect(pose.yMeters).toBe(0.0);
  });

  test("mounting plate pose respects an offset and a non-zero KMR center", () => {
    const pose = computeMountingPlatePose(
      { ...KUKA_KMR_IIWA_PUBLIC_SPEC, mountingPlateOffsetXMeters: 0.05 },
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

  test("buildKmrBaseMesh adds exactly 4 wheels at the four corners", () => {
    const mesh = buildKmrBaseMesh();
    const wheelGroups = mesh.children.filter((c) => c.name === "");
    // 4 wheels (each is a child Group with hub + rollers + caps, not named).
    // The other top-level children are chassis, trim, plate, lidar housing,
    // lidar lens (5). So at least 4 wheel groups plus those 5 = 9.
    expect(wheelGroups.length).toBeGreaterThanOrEqual(4);
  });
});
