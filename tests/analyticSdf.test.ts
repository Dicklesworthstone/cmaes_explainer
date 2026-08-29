import { describe, expect, test } from "bun:test";
import {
  type HeightfieldData,
  sdfBox,
  sdfCapsule,
  sdfCylinder,
  sdfHeightfield,
  sdfOBB,
  sdfPlane,
  sdfRoundedBox,
  sdfSphere,
  smax,
  smin,
} from "../app/lib/analyticSdf";

describe("Analytic Signed Distance Functions (SDF)", () => {
  test("sdfSphere evaluates exact distance and outward unit normals", () => {
    const center: [number, number, number] = [1, 2, 3];
    const radius = 0.5;

    // Point outside along +X
    const outRes = sdfSphere([2.5, 2, 3], center, radius);
    expect(outRes.distance).toBeCloseTo(1.0); // 1.5 - 0.5 = 1.0
    expect(outRes.normal).toEqual([1, 0, 0]);

    // Point on surface
    const surfRes = sdfSphere([1, 2.5, 3], center, radius);
    expect(surfRes.distance).toBeCloseTo(0.0);
    expect(surfRes.normal).toEqual([0, 1, 0]);

    // Point inside
    const inRes = sdfSphere([1, 2, 3.2], center, radius);
    expect(inRes.distance).toBeCloseTo(-0.3); // 0.2 - 0.5 = -0.3
  });

  test("sdfBox calculates exact interior and exterior distances", () => {
    const center: [number, number, number] = [0, 0, 0];
    const halfExtents: [number, number, number] = [1, 1, 1];

    // Face point
    const faceRes = sdfBox([1.5, 0, 0], center, halfExtents);
    expect(faceRes.distance).toBeCloseTo(0.5);

    // Corner point [2, 2, 2]: delta = [1, 1, 1], dist = sqrt(3)
    const cornerRes = sdfBox([2, 2, 2], center, halfExtents);
    expect(cornerRes.distance).toBeCloseTo(Math.sqrt(3));

    // Interior point [0.5, 0, 0]: closest face is at x=1, distance = -0.5
    const inRes = sdfBox([0.5, 0, 0], center, halfExtents);
    expect(inRes.distance).toBeCloseTo(-0.5);
  });

  test("sdfRoundedBox accounts for rounding radius", () => {
    const center: [number, number, number] = [0, 0, 0];
    const halfExtents: [number, number, number] = [1, 1, 1];
    const radius = 0.2;

    const res = sdfRoundedBox([1.5, 0, 0], center, halfExtents, radius);
    expect(res.distance).toBeCloseTo(0.5);
  });

  test("sdfOBB respects 3D rotation matrix", () => {
    const center: [number, number, number] = [0, 0, 0];
    const halfExtents: [number, number, number] = [2, 0.5, 0.5]; // Elongated along X

    // 90 deg rotation around Y axis: X goes to -Z, Z goes to X
    // R = [0, 0, 1,
    //      0, 1, 0,
    //     -1, 0, 0]
    const rotY90: [number, number, number, number, number, number, number, number, number] = [
      0, 0, 1,
      0, 1, 0,
      -1, 0, 0,
    ];

    // Point along +Z (which is local +X after rotation)
    const resZ = sdfOBB([0, 0, 3], center, halfExtents, rotY90);
    // Local point should be [3, 0, 0], distance to box with halfX=2 is 1.0
    expect(resZ.distance).toBeCloseTo(1.0);

    // Point along +X (which is local -Z)
    const resX = sdfOBB([1.5, 0, 0], center, halfExtents, rotY90);
    // Local point should be [0, 0, -1.5], distance to box with halfZ=0.5 is 1.0
    expect(resX.distance).toBeCloseTo(1.0);
  });

  test("sdfCylinder handles radial and end-cap boundaries", () => {
    const center: [number, number, number] = [0, 0, 0];
    const radius = 1.0;
    const height = 2.0;

    // Point outside radius along X
    const radRes = sdfCylinder([2.5, 0, 0], center, radius, height);
    expect(radRes.distance).toBeCloseTo(1.5);

    // Point above top cap
    const topRes = sdfCylinder([0, 2.5, 0], center, radius, height);
    expect(topRes.distance).toBeCloseTo(1.5); // 2.5 - 1.0 = 1.5

    // Interior point
    const inRes = sdfCylinder([0.5, 0, 0], center, radius, height);
    expect(inRes.distance).toBeCloseTo(-0.5);
  });

  test("sdfCapsule evaluates distance to line segment", () => {
    const a: [number, number, number] = [0, 0, 0];
    const b: [number, number, number] = [0, 2, 0];
    const radius = 0.3;

    // Near midpoint of segment
    const midRes = sdfCapsule([1.3, 1, 0], a, b, radius);
    expect(midRes.distance).toBeCloseTo(1.0);

    // Past endpoint B
    const endRes = sdfCapsule([0, 3.3, 0], a, b, radius);
    expect(endRes.distance).toBeCloseTo(1.0);
  });

  test("sdfPlane computes planar distance", () => {
    const normal: [number, number, number] = [0, 1, 0];
    const res = sdfPlane([0, 5, 0], normal, -2);
    // y - 2 = 3
    expect(res.distance).toBeCloseTo(3.0);
  });

  test("sdfHeightfield performs bilinear interpolation", () => {
    const terrain: HeightfieldData = {
      minX: 0,
      maxX: 10,
      minZ: 0,
      maxZ: 10,
      rows: 2,
      cols: 2,
      heights: new Float32Array([
        0, 2,  // row 0: (0,0)->0, (10,0)->2
        0, 2,  // row 1: (0,10)->0, (10,10)->2
      ]),
    };

    // Point at center (5, 5) should have terrain height = 1.0
    const res = sdfHeightfield([5, 4, 5], terrain);
    expect(res.distance).toBeCloseTo(3.0); // 4 - 1 = 3
  });

  test("smin smoothly blends values within radius k", () => {
    const exactMin = Math.min(1.0, 1.0);
    const smoothMin = smin(1.0, 1.0, 0.2);
    expect(smoothMin).toBeLessThan(exactMin);
    expect(smoothMin).toBeCloseTo(0.95);

    // Far from intersection, smin approaches exact min
    const farSmooth = smin(0.0, 5.0, 0.2);
    expect(farSmooth).toBeCloseTo(0.0);
  });

  test("smax implements smooth intersection", () => {
    const exactMax = Math.max(1.0, 1.0);
    const smoothMax = smax(1.0, 1.0, 0.2);
    expect(smoothMax).toBeGreaterThan(exactMax);
  });
});
