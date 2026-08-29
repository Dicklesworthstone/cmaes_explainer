import { describe, expect, test } from "bun:test";
import { CRAFTSMAN_MATERIAL_DATABASE } from "../app/components/MaterialDatabaseInspector";
import { CRAFTSMAN_BUNGALOW_1928 } from "../app/lib/houseScenes";
import { FURNITURE_KIND_DEFAULTS, type FurnitureKind } from "../app/lib/furnitureTaxonomy";

describe("Material Database & Furniture Catalog Inspector Modules", () => {
  test("CRAFTSMAN_MATERIAL_DATABASE contains valid PBR materials for all major categories", () => {
    expect(CRAFTSMAN_MATERIAL_DATABASE.length).toBeGreaterThanOrEqual(9);

    const categories = new Set(CRAFTSMAN_MATERIAL_DATABASE.map((m) => m.category));
    expect(categories.has("wood")).toBe(true);
    expect(categories.has("metal")).toBe(true);
    expect(categories.has("ceramic")).toBe(true);
    expect(categories.has("glass")).toBe(true);
    expect(categories.has("fabric")).toBe(true);
    expect(categories.has("leather")).toBe(true);

    for (const mat of CRAFTSMAN_MATERIAL_DATABASE) {
      expect(mat.roughness).toBeGreaterThanOrEqual(0.0);
      expect(mat.roughness).toBeLessThanOrEqual(1.0);
      expect(mat.metalness).toBeGreaterThanOrEqual(0.0);
      expect(mat.metalness).toBeLessThanOrEqual(1.0);
      expect(mat.densityKgM3).toBeGreaterThan(0);
      expect(mat.baseColorHex.startsWith("#")).toBe(true);
    }
  });

  test("CRAFTSMAN_BUNGALOW_1928 catalog has complete geometry for all 70+ furniture pieces", () => {
    expect(CRAFTSMAN_BUNGALOW_1928.furniture.length).toBeGreaterThanOrEqual(60);

    for (const piece of CRAFTSMAN_BUNGALOW_1928.furniture) {
      expect(piece.name.length).toBeGreaterThan(0);
      expect(piece.room.length).toBeGreaterThan(0);
      expect(piece.size[0]).toBeGreaterThan(0);
      expect(piece.size[1]).toBeGreaterThan(0);
      expect(piece.height).toBeGreaterThan(0);
      expect(Number.isFinite(piece.center[0])).toBe(true);
      expect(Number.isFinite(piece.center[1])).toBe(true);
      expect(Number.isFinite(piece.rotation)).toBe(true);
      expect(piece.note.length).toBeGreaterThan(0);

      if (piece.kind && (piece.kind as FurnitureKind) in FURNITURE_KIND_DEFAULTS) {
        const k = piece.kind as FurnitureKind;
        const d = FURNITURE_KIND_DEFAULTS[k];
        expect(d.defaultMass).toBeGreaterThan(0);
      }
    }
  });
});
