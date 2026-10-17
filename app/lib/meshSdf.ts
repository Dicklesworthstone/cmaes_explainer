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

export type TriangleVoronoiFeature =
  | "vertex-a"
  | "vertex-b"
  | "vertex-c"
  | "edge-ab"
  | "edge-ac"
  | "edge-bc"
  | "face";

export class MeshSdf {
  private bvh: BVH;
  private triangles: Array<{
    a: [number, number, number];
    b: [number, number, number];
    c: [number, number, number];
    normal: [number, number, number];
    nA: [number, number, number];
    nB: [number, number, number];
    nC: [number, number, number];
    nAB: [number, number, number];
    nAC: [number, number, number];
    nBC: [number, number, number];
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

    const vKey = (p: [number, number, number]) =>
      `${Math.round(p[0] * 1e5)},${Math.round(p[1] * 1e5)},${Math.round(p[2] * 1e5)}`;
    const eKey = (k1: string, k2: string) => (k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`);

    const vertexAccum = new Map<string, [number, number, number]>();
    const edgeAccum = new Map<string, [number, number, number]>();
    const addVec = (
      map: Map<string, [number, number, number]>,
      key: string,
      n: [number, number, number],
      w: number,
    ) => {
      const cur = map.get(key);
      if (cur) {
        cur[0] += n[0] * w;
        cur[1] += n[1] * w;
        cur[2] += n[2] * w;
      } else {
        map.set(key, [n[0] * w, n[1] * w, n[2] * w]);
      }
    };

    const rawTris: Array<{
      a: [number, number, number];
      b: [number, number, number];
      c: [number, number, number];
      normal: [number, number, number];
      kA: string;
      kB: string;
      kC: string;
    }> = new Array(count);

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

      const a: [number, number, number] = [vA.x, vA.y, vA.z];
      const b: [number, number, number] = [vB.x, vB.y, vB.z];
      const c: [number, number, number] = [vC.x, vC.y, vC.z];
      const normal: [number, number, number] = [cb.x, cb.y, cb.z];

      // Interior angles at A, B, C for Bærentzen & Aanæs (2005) angle-weighted pseudonormals
      const abx = b[0] - a[0],
        aby = b[1] - a[1],
        abz = b[2] - a[2];
      const acx = c[0] - a[0],
        acy = c[1] - a[1],
        acz = c[2] - a[2];
      const bcx = c[0] - b[0],
        bcy = c[1] - b[1],
        bcz = c[2] - b[2];
      const lenAB = Math.hypot(abx, aby, abz) || 1e-8;
      const lenAC = Math.hypot(acx, acy, acz) || 1e-8;
      const lenBC = Math.hypot(bcx, bcy, bcz) || 1e-8;

      const cosA = Math.max(-1, Math.min(1, (abx * acx + aby * acy + abz * acz) / (lenAB * lenAC)));
      const cosB = Math.max(
        -1,
        Math.min(1, (-abx * bcx - aby * bcy - abz * bcz) / (lenAB * lenBC)),
      );
      const angleA = Math.acos(cosA);
      const angleB = Math.acos(cosB);
      const angleC = Math.max(0, Math.PI - angleA - angleB);

      const kA = vKey(a);
      const kB = vKey(b);
      const kC = vKey(c);

      addVec(vertexAccum, kA, normal, angleA);
      addVec(vertexAccum, kB, normal, angleB);
      addVec(vertexAccum, kC, normal, angleC);

      addVec(edgeAccum, eKey(kA, kB), normal, 1.0);
      addVec(edgeAccum, eKey(kA, kC), normal, 1.0);
      addVec(edgeAccum, eKey(kB, kC), normal, 1.0);

      rawTris[i] = { a, b, c, normal, kA, kB, kC };
    }

    const normVec = (
      v: [number, number, number] | undefined,
      fallback: [number, number, number],
    ): [number, number, number] => {
      if (!v) return fallback;
      const len = Math.hypot(v[0], v[1], v[2]);
      return len > 1e-8 ? [v[0] / len, v[1] / len, v[2] / len] : fallback;
    };

    for (let i = 0; i < count; i++) {
      const rt = rawTris[i];
      this.triangles[i] = {
        a: rt.a,
        b: rt.b,
        c: rt.c,
        normal: rt.normal,
        nA: normVec(vertexAccum.get(rt.kA), rt.normal),
        nB: normVec(vertexAccum.get(rt.kB), rt.normal),
        nC: normVec(vertexAccum.get(rt.kC), rt.normal),
        nAB: normVec(edgeAccum.get(eKey(rt.kA, rt.kB)), rt.normal),
        nAC: normVec(edgeAccum.get(eKey(rt.kA, rt.kC)), rt.normal),
        nBC: normVec(edgeAccum.get(eKey(rt.kB, rt.kC)), rt.normal),
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

    let bestDistSq = Infinity;
    let bestClosestPt: [number, number, number] = [0, 0, 0];
    let bestPseudoNormal: [number, number, number] = [0, 1, 0];

    let searchRadius = 0.5;
    let candidateIds = this.bvh.queryAABB(
      [p[0] - searchRadius, p[1] - searchRadius, p[2] - searchRadius],
      [p[0] + searchRadius, p[1] + searchRadius, p[2] + searchRadius],
    );

    while (candidateIds.length === 0 && searchRadius < 100.0) {
      searchRadius *= 2.5;
      candidateIds = this.bvh.queryAABB(
        [p[0] - searchRadius, p[1] - searchRadius, p[2] - searchRadius],
        [p[0] + searchRadius, p[1] + searchRadius, p[2] + searchRadius],
      );
    }

    const evaluateCandidates = (ids: number[]) => {
      for (const triId of ids) {
        const tri = this.triangles[triId];
        const { point: closest, feature } = closestPointOnTriangleWithFeature(
          p,
          tri.a,
          tri.b,
          tri.c,
        );
        const dx = p[0] - closest[0];
        const dy = p[1] - closest[1];
        const dz = p[2] - closest[2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < bestDistSq) {
          bestDistSq = distSq;
          bestClosestPt = closest;
          switch (feature) {
            case "vertex-a":
              bestPseudoNormal = tri.nA;
              break;
            case "vertex-b":
              bestPseudoNormal = tri.nB;
              break;
            case "vertex-c":
              bestPseudoNormal = tri.nC;
              break;
            case "edge-ab":
              bestPseudoNormal = tri.nAB;
              break;
            case "edge-ac":
              bestPseudoNormal = tri.nAC;
              break;
            case "edge-bc":
              bestPseudoNormal = tri.nBC;
              break;
            default:
              bestPseudoNormal = tri.normal;
              break;
          }
        }
      }
    };

    const initialCandidates =
      candidateIds.length > 0 ? candidateIds : this.triangles.map((_, i) => i);
    evaluateCandidates(initialCandidates);

    // If best closest point found inside the L_inf box [-R, R]^3 has Euclidean distance > R
    // (near a box corner up to sqrt(3)*R), expand the AABB query to sqrt(bestDistSq) so no
    // closer axis-aligned triangle outside [-R, R]^3 is missed.
    if (candidateIds.length > 0 && bestDistSq > searchRadius * searchRadius) {
      const expandedR = Math.sqrt(bestDistSq) + 1e-4;
      const expandedIds = this.bvh.queryAABB(
        [p[0] - expandedR, p[1] - expandedR, p[2] - expandedR],
        [p[0] + expandedR, p[1] + expandedR, p[2] + expandedR],
      );
      evaluateCandidates(expandedIds);
    }

    const unsignedDist = Math.sqrt(bestDistSq);

    // Bærentzen & Aanæs (2005) angle-weighted pseudonormal dot product for sign determination
    const toP = [p[0] - bestClosestPt[0], p[1] - bestClosestPt[1], p[2] - bestClosestPt[2]];
    const dot =
      toP[0] * bestPseudoNormal[0] + toP[1] * bestPseudoNormal[1] + toP[2] * bestPseudoNormal[2];

    let isInside: boolean;
    if (Math.abs(dot) > 1e-6 * Math.max(1e-6, unsignedDist)) {
      isInside = dot < 0;
    } else {
      // Fallback ray parity test for degenerate near-zero dot products
      const rayDir: [number, number, number] = [0.57735027, 0.57735027, 0.57735027];
      const rayHits = this.bvh.raycast(p, rayDir);
      const hitDistances: number[] = [];
      for (const hit of rayHits) {
        const tri = this.triangles[hit.primitiveId];
        const tHit = rayIntersectTriangle(p, rayDir, tri.a, tri.b, tri.c);
        if (tHit !== null && !hitDistances.some((d) => Math.abs(d - tHit) < 1e-5)) {
          hitDistances.push(tHit);
        }
      }
      isInside = hitDistances.length % 2 === 1;
    }

    const distance = isInside ? -unsignedDist : unsignedDist;

    const nx = toP[0];
    const ny = toP[1];
    const nz = toP[2];
    const nLen = Math.hypot(nx, ny, nz);

    let finalNormal: [number, number, number] = bestPseudoNormal;
    if (nLen > 1e-8) {
      finalNormal = isInside
        ? [-nx / nLen, -ny / nLen, -nz / nLen]
        : [nx / nLen, ny / nLen, nz / nLen];
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
  const gradX =
    ((c100 - c000) * (1 - ty) * (1 - tz) +
      (c110 - c010) * ty * (1 - tz) +
      (c101 - c001) * (1 - ty) * tz +
      (c111 - c011) * ty * tz) /
    cellSize[0];
  const gradY =
    ((c010 - c000) * (1 - tx) * (1 - tz) +
      (c110 - c100) * tx * (1 - tz) +
      (c011 - c001) * (1 - tx) * tz +
      (c111 - c101) * tx * tz) /
    cellSize[1];
  const gradZ =
    ((c001 - c000) * (1 - tx) * (1 - ty) +
      (c101 - c100) * tx * (1 - ty) +
      (c011 - c001) * (1 - tx) * ty +
      (c111 - c110) * tx * ty) /
    cellSize[2];

  const gLen = Math.hypot(gradX, gradY, gradZ) || 1;
  const normal: [number, number, number] = [gradX / gLen, gradY / gLen, gradZ / gLen];

  // If outside bounding box, add Euclidean L2 extrapolation distance
  const extraX = p[0] < min[0] ? min[0] - p[0] : p[0] > max[0] ? p[0] - max[0] : 0;
  const extraY = p[1] < min[1] ? min[1] - p[1] : p[1] > max[1] ? p[1] - max[1] : 0;
  const extraZ = p[2] < min[2] ? min[2] - p[2] : p[2] > max[2] ? p[2] - max[2] : 0;
  const extraDist = Math.hypot(extraX, extraY, extraZ);

  return { distance: baseDistance + extraDist, normal };
}

// ---------------------------------------------------------------------------
// Voronoi Region Point-to-Triangle Closest Point (Ericson RTCD Ch. 5.1)
// ---------------------------------------------------------------------------

export function closestPointOnTriangleWithFeature(
  p: [number, number, number],
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
): { point: [number, number, number]; feature: TriangleVoronoiFeature } {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];

  const d1 = ab[0] * ap[0] + ab[1] * ap[1] + ab[2] * ap[2];
  const d2 = ac[0] * ap[0] + ac[1] * ap[1] + ac[2] * ap[2];
  if (d1 <= 0 && d2 <= 0) return { point: a, feature: "vertex-a" };

  const bp = [p[0] - b[0], p[1] - b[1], p[2] - b[2]];
  const d3 = ab[0] * bp[0] + ab[1] * bp[1] + ab[2] * bp[2];
  const d4 = ac[0] * bp[0] + ac[1] * bp[1] + ac[2] * bp[2];
  if (d3 >= 0 && d4 <= d3) return { point: b, feature: "vertex-b" };

  const vc = d1 * d4 - d3 * d2;
  if (vc <= 0 && d1 >= 0 && d3 <= 0) {
    const v = d1 / (d1 - d3);
    return {
      point: [a[0] + v * ab[0], a[1] + v * ab[1], a[2] + v * ab[2]],
      feature: "edge-ab",
    };
  }

  const cp = [p[0] - c[0], p[1] - c[1], p[2] - c[2]];
  const d5 = ab[0] * cp[0] + ab[1] * cp[1] + ab[2] * cp[2];
  const d6 = ac[0] * cp[0] + ac[1] * cp[1] + ac[2] * cp[2];
  if (d6 >= 0 && d5 <= d6) return { point: c, feature: "vertex-c" };

  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) {
    const w = d2 / (d2 - d6);
    return {
      point: [a[0] + w * ac[0], a[1] + w * ac[1], a[2] + w * ac[2]],
      feature: "edge-ac",
    };
  }

  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) {
    const w = (d4 - d3) / (d4 - d3 + (d5 - d6));
    const bc = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
    return {
      point: [b[0] + w * bc[0], b[1] + w * bc[1], b[2] + w * bc[2]],
      feature: "edge-bc",
    };
  }

  const denom = 1.0 / (va + vb + vc);
  const v = vb * denom;
  const w = vc * denom;
  return {
    point: [a[0] + ab[0] * v + ac[0] * w, a[1] + ab[1] * v + ac[1] * w, a[2] + ab[2] * v + ac[2] * w],
    feature: "face",
  };
}

export function closestPointOnTriangle(
  p: [number, number, number],
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
): [number, number, number] {
  return closestPointOnTriangleWithFeature(p, a, b, c).point;
}
