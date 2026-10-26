// Smoke tests for the FurnitureCatalogInspector surface area (cmaes-feat-fg4-catalog).
//
// The FurnitureCatalogInspector renders a filterable, searchable
// browser over the CRAFTSMAN_BUNGALOW_1928 furniture catalog. The
// catalog is the source of truth (a 74-piece household furniture
// scene); the component just filters it. These tests pin the
// catalog contract so a future edit cannot silently break the
// wiring (e.g., a piece with no room, or duplicate names).

import { describe, expect, test } from "bun:test";
import { CRAFTSMAN_BUNGALOW_1928 } from "../app/lib/houseScenes";

describe("FurnitureCatalogInspector surface area (cmaes-feat-fg4-catalog)", () => {
  test("catalog has multiple pieces (not empty)", () => {
    // The bead cmaes-feat-fg4 expanded the catalog from 10 to 74
    // pieces. A regression that drops back to 10 (or to 0) is
    // silent; this test pins the lower bound.
    expect(CRAFTSMAN_BUNGALOW_1928.furniture.length).toBeGreaterThan(20);
  });

  test("every piece has a non-empty name and a non-empty room", () => {
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      expect(f.name.length, `piece missing name`).toBeGreaterThan(0);
      expect(f.room.length, `piece ${f.name} missing room`).toBeGreaterThan(0);
    }
  });

  test("piece names are unique within the catalog", () => {
    const names = new Set<string>();
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      expect(names.has(f.name), `duplicate piece name: ${f.name}`).toBe(false);
      names.add(f.name);
    }
  });

  test("rooms are a small set (the component renders a room filter UI)", () => {
    const rooms = new Set<string>();
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      rooms.add(f.room);
    }
    // The component groups by room for the filter dropdown. A
    // typo'd unique room per piece would explode the dropdown
    // options; this test catches that and also ensures at least 2
    // rooms exist for the dropdown to be useful.
    expect(rooms.size).toBeGreaterThanOrEqual(2);
    expect(rooms.size).toBeLessThan(CRAFTSMAN_BUNGALOW_1928.furniture.length);
  });

  test("inspectCatalogPiecePhysics evaluates live MeshSdf, contactManifold, and articulated joint FK", async () => {
    const { inspectCatalogPiecePhysics } = await import(
      "../app/components/FurnitureCatalogInspector"
    );
    const fridgePiece =
      CRAFTSMAN_BUNGALOW_1928.furniture.find((f) => f.kind === "fridge") ??
      ({
        name: "test-fridge",
        room: "kitchen",
        kind: "fridge",
        center: [0, 0],
        size: [0.9, 0.8],
        height: 1.8,
        rotation: 0,
        note: "Test refrigerator",
      } as const);

    const unlocked = inspectCatalogPiecePhysics(fridgePiece, 2.0, false, 15);
    expect(unlocked.proceduralGeometry.partCount).toBeGreaterThanOrEqual(4);
    expect(unlocked.proceduralGeometry.assignedPbrSlots.length).toBeGreaterThan(0);
    expect(unlocked.proceduralGeometry.obbHalfExtents.every((v) => v > 0)).toBe(true);
    expect(unlocked.taxonomyAndPrimitives.totalCatalogKinds).toBeGreaterThanOrEqual(40);
    expect(unlocked.taxonomyAndPrimitives.totalCatalogFamilies).toBe(9);
    expect(unlocked.taxonomyAndPrimitives.totalPbrClasses).toBeGreaterThanOrEqual(8);
    expect(unlocked.taxonomyAndPrimitives.mappedPbrClassCount).toBeGreaterThan(0);
    expect(unlocked.taxonomyAndPrimitives.archetypePartTotal).toBeGreaterThan(20);
    expect(unlocked.taxonomyAndPrimitives.archetypeMeshChildren).toBeGreaterThan(10);
    expect(unlocked.taxonomyAndPrimitives.applianceSuiteTotalJoints).toBeGreaterThanOrEqual(10);
    expect(unlocked.contactAndWorldDiagnostics.aabbOverlapsFloor).toBe(true);
    expect(unlocked.contactAndWorldDiagnostics.planeContactCount).toBeGreaterThan(0);
    expect(unlocked.contactAndWorldDiagnostics.orthonormalTangentNorm).toBeCloseTo(1.0, 5);
    expect(unlocked.contactAndWorldDiagnostics.lcpConstraintRows).toBeGreaterThanOrEqual(1);
    expect(unlocked.contactAndWorldDiagnostics.rollingCylinderOmega).toBeGreaterThan(0);
    expect(unlocked.sdfCenterQuery.isInside).toBe(true);
    expect(unlocked.sdfCenterQuery.distance).toBeLessThan(0);
    expect(Math.abs(unlocked.sdfSurfaceQuery.distance)).toBeLessThan(1e-3);
    expect(unlocked.neuralSdfRefinement.parameterCount).toBeGreaterThan(0);
    expect(unlocked.neuralSdfRefinement.parameterCount).toBeLessThanOrEqual(20_000);
    expect(Number.isFinite(unlocked.neuralSdfRefinement.refinedSurfaceDistance)).toBe(true);
    expect(unlocked.neuralSdfRefinement.certifiedConservativeDistance).toBeLessThanOrEqual(
      unlocked.sdfSurfaceQuery.distance + 1e-6,
    );
    expect(unlocked.neuralSdfRefinement.weightsHash).toHaveLength(8);
    expect(
      unlocked.neuralSdfRefinement.queryTelemetry.some(
        (t) => t.kind === "sdf-gradient" && t.queryCount === 1 && t.bytesAllocated === 0,
      ),
    ).toBe(true);
    expect(unlocked.softBodyLattice.nodeCount).toBeGreaterThan(0);
    expect(unlocked.softBodyLattice.distanceConstraintCount).toBeGreaterThan(0);
    expect(unlocked.probeManifold.hasCollision).toBe(true);
    expect(unlocked.probeManifold.maxPenetration).toBeCloseTo(0.02, 4);
    expect(unlocked.articulation).not.toBeNull();
    expect(unlocked.articulation!.jointReceipts.length).toBeGreaterThan(0);
    expect(unlocked.articulation!.jointReceipts[0].newPosition).toBeGreaterThan(0);

    const locked = inspectCatalogPiecePhysics(fridgePiece, 2.0, true, 15);
    expect(locked.articulation!.jointReceipts[0].newPosition).toBe(0);
    expect(locked.articulation!.jointReceipts[0].lockedRefused).toBe(true);
  });
});
