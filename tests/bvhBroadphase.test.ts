import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { type BVHPrimitive, BVH } from "../app/lib/bvhBroadphase";

describe("BVH / SAH Broadphase Engine", () => {
  test("builds BVH from primitive bounding boxes", () => {
    const primitives: BVHPrimitive[] = [];
    // Generate a grid of 100 boxes
    for (let x = 0; x < 10; x++) {
      for (let z = 0; z < 10; z++) {
        const id = x * 10 + z;
        primitives.push({
          id,
          aabb: {
            min: [x * 2.0, 0, z * 2.0],
            max: [x * 2.0 + 1.0, 1.0, z * 2.0 + 1.0],
          },
          center: [x * 2.0 + 0.5, 0.5, z * 2.0 + 0.5],
        });
      }
    }

    const bvh = new BVH(4);
    bvh.buildFromPrimitives(primitives);

    expect(bvh.nodes.length).toBeGreaterThan(0);
    expect(bvh.rootIndex).toBe(0);

    // Root node should encapsulate the entire grid
    const rootNode = bvh.nodes[0];
    expect(rootNode.aabbMin[0]).toBeCloseTo(0);
    expect(rootNode.aabbMax[0]).toBeCloseTo(19.0);
    expect(rootNode.aabbMax[2]).toBeCloseTo(19.0);
  });

  test("accurately performs AABB spatial query", () => {
    const primitives: BVHPrimitive[] = [];
    for (let i = 0; i < 50; i++) {
      primitives.push({
        id: i,
        aabb: {
          min: [i * 1.5, 0, 0],
          max: [i * 1.5 + 1.0, 1.0, 1.0],
        },
        center: [i * 1.5 + 0.5, 0.5, 0.5],
      });
    }

    const bvh = new BVH();
    bvh.buildFromPrimitives(primitives);

    // Query a box covering primitives 2, 3, 4 (x from 3.0 to 6.5)
    const hits = bvh.queryAABB([3.0, 0, 0], [6.5, 1.0, 1.0]);
    expect(hits.length).toBeGreaterThanOrEqual(2);
    expect(hits.includes(2)).toBe(true);
    expect(hits.includes(3)).toBe(true);
    expect(hits.includes(40)).toBe(false);
  });

  test("builds from THREE.BufferGeometry and executes fast raycasts", () => {
    const geo = new THREE.TorusGeometry(5, 1.5, 16, 32);
    const bvh = new BVH(4);
    bvh.buildFromBufferGeometry(geo);

    expect(bvh.primitives.length).toBe(16 * 32 * 2); // 1024 triangles

    // Cast a ray towards the center of the torus
    const rayHits = bvh.raycast([0, 15, 0], [0, -1, 0]);
    expect(rayHits.length).toBeGreaterThan(0);

    // Closest hit distance should be approximately 15 - (5 + 1.5) = 8.5 or 15 - 1.5 = 13.5
    expect(rayHits[0].distance).toBeGreaterThan(0);
    expect(rayHits[0].distance).toBeLessThan(15);
    geo.dispose();
  });

  test("OBB query culls separated objects", () => {
    const primitives: BVHPrimitive[] = [
      {
        id: 101,
        aabb: { min: [0, 0, 0], max: [1, 1, 1] },
        center: [0.5, 0.5, 0.5],
      },
      {
        id: 102,
        aabb: { min: [10, 0, 0], max: [11, 1, 1] },
        center: [10.5, 0.5, 0.5],
      },
    ];

    const bvh = new BVH();
    bvh.buildFromPrimitives(primitives);

    const obbHits = bvh.queryOBB({
      center: [0.5, 0.5, 0.5],
      halfExtents: [0.6, 0.6, 0.6],
    });

    expect(obbHits).toContain(101);
    expect(obbHits).not.toContain(102);
  });

  test("refit updates bounding hierarchy without rebuilding topology", () => {
    const primitives: BVHPrimitive[] = [
      {
        id: 1,
        aabb: { min: [0, 0, 0], max: [1, 1, 1] },
        center: [0.5, 0.5, 0.5],
      },
      {
        id: 2,
        aabb: { min: [2, 0, 0], max: [3, 1, 1] },
        center: [2.5, 0.5, 0.5],
      },
    ];

    const bvh = new BVH(1);
    bvh.buildFromPrimitives(primitives);

    // Shift primitive 1 by +10 in X
    primitives[0].aabb.min[0] += 10;
    primitives[0].aabb.max[0] += 10;
    primitives[0].center[0] += 10;

    bvh.refit();

    const rootNode = bvh.nodes[0];
    expect(rootNode.aabbMax[0]).toBeCloseTo(11.0);
  });
});
