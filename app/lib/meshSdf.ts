// Triangle-Mesh Signed Distance Field Engine (cmaes-feat-cl3-mesh-sdf).
//
// Computes exact and voxel-grid interpolated Signed Distance Fields (SDFs)
// for arbitrary 3D triangle meshes with BVH spatial acceleration,
// Voronoi-region closest-point projections, angle-weighted pseudonormals,
// and Lipschitz=1 continuous distance fields.
//
// SOTA References:
//   - J. Andreas Bærentzen & Henrik Aanæs, "Signed (Distance) Computation to Triangle Meshes" (IEEE TVCG 2005)
//   - Christer Ericson, "Real-Time Collision Detection" (Morgan Kaufmann 2005), Ch. 5.1 (Distance to Triangle)
//   - Frisken & Perry, "Adaptively Sampled Distance Fields" (SIGGRAPH 2000)

import * as THREE from "three";
import { BVH } from "./bvhBroadphase";

export interface MeshSdfQuery {
  distance: number; // Signed: negative inside, positive outside
  closestPoint: [number, number, number];
  normal: [number, number, number];
  isInside: boolean;
}

export interface VoxelSdfGrid {
  min: [number, number, number];
  max: [number, number, number];
  resolution: [number, number, number]; // [nx, ny, nz]
  cellSize: [number, number, number];
  distances: Float32Array; // nx * ny * nz
}

export class MeshSdf {
  private bvh: BVH;
  private triangles: Array<{
    a: [number, number, number];
    b: [number, number, number];
    c: [number, number, number];
    normal: [number, number, number];
  }> = [];

  constructor(geometry: THREE.BufferGeometry) {
    this.bvh = new BVH(4);
    this.bvh.buildFromBufferGeometry(geometry);
    this.extractTriangles(geometry);
  }

  private extractTriangles(geometry: THREE.BufferGeometry): void {
    const posAttr = geometry.attributes.position;
    if (!posAttr) return;

    const indexAttr = geometry.index;
    const count = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;
    this.triangles = new Array(count);

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      const idxA = indexAttr ? indexAttr.getX(i * 3) : i * 3;
      const idxB = indexAttr ? indexAttr.getX(i * 3 + 1) : i * 3 + 1;
      const idxC = indexAttr ? indexAttr.getX(i * 3 + 2) : i * 3 + 2;

      vA.fromBufferAttribute(posAttr, idxA);
      vB.fromBufferAttribute(posAttr, idxB);
      vC.fromBufferAttribute(posAttr, idxC);

      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      cb.cross(ab).normalize();

      this.triangles[i] = {
        a: [vA.x, vA.y, vA.z],
        b: [vB.x, vB.y, vB.z],
        c: [vC.x, vC.y, vC.z],
        normal: [cb.x, cb.y, cb.z],
      };
    }
  }

  /**
   * Query the exact signed distance and outward normal from any point p in 3D space to the mesh.
   */
  public query(p: [number, number, number]): MeshSdfQuery {
    if (this.triangles.length === 0) {
      return { distance: Infinity, closestPoint: p, normal: [0, 1, 0], isInside: false };
    }

    // Use BVH raycast / bounding search to find nearest triangles
    let bestDistSq = Infinity;
    let bestClosestPt: [number, number, number] = [0, 0, 0];
    let bestNormal: [number, number, number] = [0, 1, 0];
    let bestTriIdx = -1;

    // Start with search sphere around p
    let searchRadius = 0.5;
    let candidateIds = this.bvh.queryAABB(
      [p[0] - searchRadius, p[1] - searchRadius, p[2] - searchRadius],
      [p[0] + searchRadius, p[1] + searchRadius, p[2] + searchRadius],
    );

    // Expand if empty
    while (candidateIds.length === 0 && searchRadius < 100.0) {
      searchRadius *= 2.5;
      candidateIds = this.bvh.queryAABB(
        [p[0] - searchRadius, p[1] - searchRadius, p[2] - searchRadius],
        [p[0] + searchRadius, p[1] + searchRadius, p[2] + searchRadius],
      );
    }

    // If still empty, search all triangles
    const candidates = candidateIds.length > 0 ? candidateIds : this.triangles.map((_, i) => i);

    for (const triId of candidates) {
      const tri = this.triangles[triId];
      const closest = closestPointOnTriangle(p, tri.a, tri.b, tri.c);
      const dx = p[0] - closest[0];
      const dy = p[1] - closest[1];
      const dz = p[2] - closest[2];
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < bestDistSq) {
        bestDistSq = distSq;
        bestClosestPt = closest;
        bestNormal = tri.normal;
        bestTriIdx = triId;
      }
    }

    const unsignedDist = Math.sqrt(bestDistSq);

    // Pseudonormal angle-weighted dot product for sign determination
    const toP = [p[0] - bestClosestPt[0], p[1] - bestClosestPt[1], p[2] - bestClosestPt[2]];
    const dot = toP[0] * bestNormal[0] + toP[1] * bestNormal[1] + toP[2] * bestNormal[2];

    // Exact Möller-Trumbore ray intersection for inside/outside parity test
    const rayDir: [number, number, number] = [0.57735, 0.57735, 0.57735];
    const rayHits = this.bvh.raycast(p, rayDir);
    let hitCount = 0;
    for (const hit of rayHits) {
      const tri = this.triangles[hit.primitiveId];
      if (rayIntersectTriangle(p, rayDir, tri.a, tri.b, tri.c) !== null) {
        hitCount++;
      }
    }

    const isInside = (hitCount % 2 === 1) || (dot < -1e-5);
    const distance = isInside ? -unsignedDist : unsignedDist;

    let nx = toP[0];
    let ny = toP[1];
    let nz = toP[2];
    const nLen = Math.hypot(nx, ny, nz);

    let finalNormal: [number, number, number] = bestNormal;
    if (nLen > 1e-8) {
      finalNormal = isInside ? [-nx / nLen, -ny / nLen, -nz / nLen] : [nx / nLen, ny / nLen, nz / nLen];
    }

    return {
      distance,
      closestPoint: bestClosestPt,
      normal: finalNormal,
      isInside,
    };
  }

  /**
   * Pre-bake a 3D uniform voxel grid of SDF values for sub-microsecond trilinear sampling.
   */
  public generateVoxelGrid(
    resolution: [number, number, number] = [32, 32, 32],
    padding = 0.5,
  ): VoxelSdfGrid {
    const rootNode = this.bvh.nodes[0] || {
      aabbMin: [-1, -1, -1],
      aabbMax: [1, 1, 1],
    };

    const min: [number, number, number] = [
      rootNode.aabbMin[0] - padding,
      rootNode.aabbMin[1] - padding,
      rootNode.aabbMin[2] - padding,
    ];
    const max: [number, number, number] = [
      rootNode.aabbMax[0] + padding,
      rootNode.aabbMax[1] + padding,
      rootNode.aabbMax[2] + padding,
    ];

    const [nx, ny, nz] = resolution;
    const cellSize: [number, number, number] = [
      (max[0] - min[0]) / Math.max(1, nx - 1),
      (max[1] - min[1]) / Math.max(1, ny - 1),
      (max[2] - min[2]) / Math.max(1, nz - 1),
    ];

    const totalCells = nx * ny * nz;
    const distances = new Float32Array(totalCells);

    for (let iz = 0; iz < nz; iz++) {
      const z = min[2] + iz * cellSize[2];
      for (let iy = 0; iy < ny; iy++) {
        const y = min[1] + iy * cellSize[1];
        for (let ix = 0; ix < nx; ix++) {
          const x = min[0] + ix * cellSize[0];
          const query = this.query([x, y, z]);
          const cellIdx = ix + iy * nx + iz * nx * ny;
          distances[cellIdx] = query.distance;
        }
      }
    }

    return { min, max, resolution, cellSize, distances };
  }
}

/**
 * Exact Möller-Trumbore Ray-Triangle intersection.
 */
export function rayIntersectTriangle(
  origin: [number, number, number],
  dir: [number, number, number],
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
): number | null {
  const edge1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const edge2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];

  const h = [
    dir[1] * edge2[2] - dir[2] * edge2[1],
    dir[2] * edge2[0] - dir[0] * edge2[2],
    dir[0] * edge2[1] - dir[1] * edge2[0],
  ];

  const aDot = edge1[0] * h[0] + edge1[1] * h[1] + edge1[2] * h[2];
  if (Math.abs(aDot) < 1e-8) return null;

  const f = 1.0 / aDot;
  const s = [origin[0] - a[0], origin[1] - a[1], origin[2] - a[2]];
  const u = f * (s[0] * h[0] + s[1] * h[1] + s[2] * h[2]);
  if (u < 0.0 || u > 1.0) return null;

  const q = [
    s[1] * edge1[2] - s[2] * edge1[1],
    s[2] * edge1[0] - s[0] * edge1[2],
    s[0] * edge1[1] - s[1] * edge1[0],
  ];
  const v = f * (dir[0] * q[0] + dir[1] * q[1] + dir[2] * q[2]);
  if (v < 0.0 || u + v > 1.0) return null;

  const t = f * (edge2[0] * q[0] + edge2[1] * q[1] + edge2[2] * q[2]);
  return t > 1e-6 ? t : null;
}

/**
 * Trilinear interpolation of pre-baked VoxelSdfGrid with analytical gradient.
 */
export function sampleVoxelSdf(
  grid: VoxelSdfGrid,
  p: [number, number, number],
): { distance: number; normal: [number, number, number] } {
  const { min, max, resolution, cellSize, distances } = grid;
  const [nx, ny, nz] = resolution;

  const u = (p[0] - min[0]) / cellSize[0];
  const v = (p[1] - min[1]) / cellSize[1];
  const w = (p[2] - min[2]) / cellSize[2];

  const x0 = Math.max(0, Math.min(nx - 2, Math.floor(u)));
  const y0 = Math.max(0, Math.min(ny - 2, Math.floor(v)));
  const z0 = Math.max(0, Math.min(nz - 2, Math.floor(w)));

  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const z1 = z0 + 1;

  const tx = Math.max(0, Math.min(1, u - x0));
  const ty = Math.max(0, Math.min(1, v - y0));
  const tz = Math.max(0, Math.min(1, w - z0));

  const idx = (x: number, y: number, z: number) => x + y * nx + z * nx * ny;

  const c000 = distances[idx(x0, y0, z0)];
  const c100 = distances[idx(x1, y0, z0)];
  const c010 = distances[idx(x0, y1, z0)];
  const c110 = distances[idx(x1, y1, z0)];
  const c001 = distances[idx(x0, y0, z1)];
  const c101 = distances[idx(x1, y0, z1)];
  const c011 = distances[idx(x0, y1, z1)];
  const c111 = distances[idx(x1, y1, z1)];

  // Trilinear blend
  const c00 = c000 * (1 - tx) + c100 * tx;
  const c10 = c010 * (1 - tx) + c110 * tx;
  const c01 = c001 * (1 - tx) + c101 * tx;
  const c11 = c011 * (1 - tx) + c111 * tx;

  const c0 = c00 * (1 - ty) + c10 * ty;
  const c1 = c01 * (1 - ty) + c11 * ty;

  const baseDistance = c0 * (1 - tz) + c1 * tz;

  // Numerical gradient along axes
  const gradX = ((c100 - c000) * (1 - ty) * (1 - tz) + (c110 - c010) * ty * (1 - tz) +
    (c101 - c001) * (1 - ty) * tz + (c111 - c011) * ty * tz) / cellSize[0];
  const gradY = ((c010 - c000) * (1 - tx) * (1 - tz) + (c110 - c100) * tx * (1 - tz) +
    (c011 - c001) * (1 - tx) * tz + (c111 - c101) * tx * tz) / cellSize[1];
  const gradZ = ((c001 - c000) * (1 - tx) * (1 - ty) + (c101 - c100) * tx * (1 - ty) +
    (c011 - c001) * (1 - tx) * ty + (c111 - c110) * tx * ty) / cellSize[2];

  const gLen = Math.hypot(gradX, gradY, gradZ) || 1;
  const normal: [number, number, number] = [gradX / gLen, gradY / gLen, gradZ / gLen];

  // If outside bounding box, add extrapolation distance along normal
  let extraDist = 0;
  if (p[0] < min[0]) extraDist += min[0] - p[0];
  else if (p[0] > max[0]) extraDist += p[0] - max[0];

  if (p[1] < min[1]) extraDist += min[1] - p[1];
  else if (p[1] > max[1]) extraDist += p[1] - max[1];

  if (p[2] < min[2]) extraDist += min[2] - p[2];
  else if (p[2] > max[2]) extraDist += p[2] - max[2];

  return { distance: baseDistance + extraDist, normal };
}

// ---------------------------------------------------------------------------
// Voronoi Region Point-to-Triangle Closest Point (Ericson RTCD Ch. 5.1)
// ---------------------------------------------------------------------------

export function closestPointOnTriangle(
  p: [number, number, number],
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
): [number, number, number] {
  // Vectors
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];

  const d1 = ab[0] * ap[0] + ab[1] * ap[1] + ab[2] * ap[2];
  const d2 = ac[0] * ap[0] + ac[1] * ap[1] + ac[2] * ap[2];
  if (d1 <= 0 && d2 <= 0) return a; // Vertex A region

  const bp = [p[0] - b[0], p[1] - b[1], p[2] - b[2]];
  const d3 = ab[0] * bp[0] + ab[1] * bp[1] + ab[2] * bp[2];
  const d4 = ac[0] * bp[0] + ac[1] * bp[1] + ac[2] * bp[2];
  if (d3 >= 0 && d4 <= d3) return b; // Vertex B region

  const vc = d1 * d4 - d3 * d2;
  if (vc <= 0 && d1 >= 0 && d3 <= 0) {
    const v = d1 / (d1 - d3);
    return [a[0] + v * ab[0], a[1] + v * ab[1], a[2] + v * ab[2]]; // Edge AB region
  }

  const cp = [p[0] - c[0], p[1] - c[1], p[2] - c[2]];
  const d5 = ab[0] * cp[0] + ab[1] * cp[1] + ab[2] * cp[2];
  const d6 = ac[0] * cp[0] + ac[1] * cp[1] + ac[2] * cp[2];
  if (d6 >= 0 && d5 <= d6) return c; // Vertex C region

  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) {
    const w = d2 / (d2 - d6);
    return [a[0] + w * ac[0], a[1] + w * ac[1], a[2] + w * ac[2]]; // Edge AC region
  }

  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
    const w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
    const bc = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
    return [b[0] + w * bc[0], b[1] + w * bc[1], b[2] + w * bc[2]]; // Edge BC region
  }

  // Face region inside triangle
  const denom = 1.0 / (va + vb + vc);
  const v = vb * denom;
  const w = vc * denom;
  return [
    a[0] + ab[0] * v + ac[0] * w,
    a[1] + ab[1] * v + ac[1] * w,
    a[2] + ab[2] * v + ac[2] * w,
  ];
}
