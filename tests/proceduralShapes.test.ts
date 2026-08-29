import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { ALL_FURNITURE_KINDS } from "../app/lib/furnitureTaxonomy";
import {
  bsplineExtrude,
  buildFurniture,
  capsuleGeometry,
  evaluateCubicBSpline,
  generateFurnitureGeometry,
  latheProfile,
  roundedBox,
  taperedCylinder,
} from "../app/lib/houseFurniture";

describe("procedural shape generation primitives", () => {
  test("roundedBox creates valid non-empty geometry with bounded height", () => {
    const geo = roundedBox(1.0, 0.8, 0.6, 0.05);
    expect(geo).toBeInstanceOf(THREE.BufferGeometry);
    geo.computeBoundingBox();
    const bbox = geo.boundingBox;
    expect(bbox).not.toBeNull();
    if (bbox) {
      expect(bbox.max.y).toBeCloseTo(0.8, 2);
      expect(bbox.min.y).toBeCloseTo(0, 2);
    }
    geo.dispose();
  });

  test("taperedCylinder creates valid geometry with top and bottom radii", () => {
    const geo = taperedCylinder(0.05, 0.1, 0.5, 12);
    expect(geo).toBeInstanceOf(THREE.CylinderGeometry);
    geo.computeBoundingBox();
    expect(geo.boundingBox?.max.y).toBeCloseTo(0.5, 2);
    geo.dispose();
  });

  test("evaluateCubicBSpline interpolates smoothly along span", () => {
    const pts: Array<[number, number]> = [
      [0, 0],
      [0.5, 1],
      [1, 1],
      [1.5, 0],
    ];
    const p0 = evaluateCubicBSpline(pts, 0);
    const pMid = evaluateCubicBSpline(pts, 0.5);
    const p1 = evaluateCubicBSpline(pts, 1.0);

    expect(Number.isFinite(p0[0])).toBe(true);
    expect(Number.isFinite(p0[1])).toBe(true);
    expect(Number.isFinite(pMid[0])).toBe(true);
    expect(Number.isFinite(pMid[1])).toBe(true);
    expect(Number.isFinite(p1[0])).toBe(true);
    expect(Number.isFinite(p1[1])).toBe(true);
  });

  test("bsplineExtrude generates 3D geometry from spline profile", () => {
    const controlPoints: Array<[number, number]> = [
      [0, 0],
      [0.2, 0.4],
      [0.4, 0.4],
      [0.6, 0],
      [0.4, -0.4],
      [0.2, -0.4],
    ];
    const geo = bsplineExtrude(controlPoints, 0.3, 16);
    expect(geo).toBeInstanceOf(THREE.BufferGeometry);
    geo.dispose();
  });

  test("latheProfile generates revolved mesh", () => {
    const profile: Array<[number, number]> = [
      [0.05, 0],
      [0.08, 0.2],
      [0.04, 0.4],
      [0.02, 0.6],
    ];
    const geo = latheProfile(profile, 12);
    expect(geo).toBeInstanceOf(THREE.BufferGeometry);
    geo.dispose();
  });

  test("capsuleGeometry generates capsule with valid endpoints", () => {
    const geo = capsuleGeometry(0.1, 0.4, 12, 6);
    expect(geo).toBeInstanceOf(THREE.BufferGeometry);
    geo.dispose();
  });
});

describe("procedural furniture geometry coverage and OBBs", () => {
  test("every FurnitureKind in the taxonomy produces a valid ProceduralShapeResult", () => {
    for (const kind of ALL_FURNITURE_KINDS) {
      const res = generateFurnitureGeometry(kind);
      expect(res.parts.length).toBeGreaterThan(0);
      expect(res.obb).toBeDefined();
      expect(res.obb.center.length).toBe(3);
      expect(res.obb.halfExtents.length).toBe(3);

      // Verify all halfExtents are positive
      expect(res.obb.halfExtents[0]).toBeGreaterThan(0);
      expect(res.obb.halfExtents[1]).toBeGreaterThan(0);
      expect(res.obb.halfExtents[2]).toBeGreaterThan(0);

      // Verify each part has a valid geometry
      for (const part of res.parts) {
        expect(part.geometry).toBeInstanceOf(THREE.BufferGeometry);
        expect(part.localOffset.length).toBe(3);
      }

      // Dispose
      res.dispose();
    }
  });

  test("buildFurniture produces a renderable THREE.Group for all kinds", () => {
    for (const kind of ALL_FURNITURE_KINDS) {
      const meshRes = buildFurniture(kind, 1.2, 0.8, 0.9);
      expect(meshRes.group).toBeInstanceOf(THREE.Group);
      expect(meshRes.group.children.length).toBeGreaterThan(0);
      expect(meshRes.obb).toBeDefined();
      meshRes.dispose();
    }
  });
});
