import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { closestPointOnTriangle, MeshSdf, sampleVoxelSdf } from "../app/lib/meshSdf";

describe("Point-to-Triangle Voronoi Closest Point", () => {
  const a: [number, number, number] = [0, 0, 0];
  const b: [number, number, number] = [2, 0, 0];
  const c: [number, number, number] = [0, 2, 0];

  test("vertex region A", () => {
    const pt = closestPointOnTriangle([-1, -1, 0], a, b, c);
    expect(pt[0]).toBeCloseTo(0);
    expect(pt[1]).toBeCloseTo(0);
    expect(pt[2]).toBeCloseTo(0);
  });

  test("vertex region B", () => {
    const pt = closestPointOnTriangle([3, -1, 0], a, b, c);
    expect(pt[0]).toBeCloseTo(2);
    expect(pt[1]).toBeCloseTo(0);
    expect(pt[2]).toBeCloseTo(0);
  });

  test("vertex region C", () => {
    const pt = closestPointOnTriangle([-1, 3, 0], a, b, c);
    expect(pt[0]).toBeCloseTo(0);
    expect(pt[1]).toBeCloseTo(2);
    expect(pt[2]).toBeCloseTo(0);
  });

  test("edge region AB", () => {
    const pt = closestPointOnTriangle([1, -1, 0], a, b, c);
    expect(pt[0]).toBeCloseTo(1);
    expect(pt[1]).toBeCloseTo(0);
    expect(pt[2]).toBeCloseTo(0);
  });

  test("face interior region", () => {
    const pt = closestPointOnTriangle([0.5, 0.5, 3], a, b, c);
    expect(pt[0]).toBeCloseTo(0.5);
    expect(pt[1]).toBeCloseTo(0.5);
    expect(pt[2]).toBeCloseTo(0);
  });
});

describe("MeshSdf Query and Voxel Grid Sampling", () => {
  test("evaluates signed distance to a box mesh", () => {
    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    const meshSdf = new MeshSdf(boxGeo);

    // Point outside along +X at x=3.0 (distance should be 3 - 1 = 2.0)
    const outQuery = meshSdf.query([3.0, 0, 0]);
    expect(outQuery.distance).toBeCloseTo(2.0, 1);
    expect(outQuery.isInside).toBe(false);

    // Point on face at x=1.0
    const surfQuery = meshSdf.query([1.0, 0, 0]);
    expect(surfQuery.distance).toBeCloseTo(0.0, 1);

    // Point inside at (0, 0, 0)
    const inQuery = meshSdf.query([0, 0, 0]);
    expect(inQuery.isInside).toBe(true);
    expect(inQuery.distance).toBeLessThan(0);

    boxGeo.dispose();
  });

  test("bakes and samples 3D voxel grid SDF with trilinear interpolation", () => {
    const sphereGeo = new THREE.SphereGeometry(1.0, 16, 16);
    const meshSdf = new MeshSdf(sphereGeo);

    const grid = meshSdf.generateVoxelGrid([16, 16, 16], 0.5);
    expect(grid.distances.length).toBe(16 * 16 * 16);

    // Sample at x=2.0 (distance to unit sphere should be ~1.0)
    const sample = sampleVoxelSdf(grid, [2.0, 0, 0]);
    expect(sample.distance).toBeCloseTo(1.0, 1);

    // Sample normal should point along +X
    expect(sample.normal[0]).toBeGreaterThan(0.8);

    sphereGeo.dispose();
  });
});
