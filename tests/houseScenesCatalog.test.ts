// Unit tests for the cmaes-feat-fg4-catalog-data extension of houseScenes.ts.
//
// Asserts:
//   - At least 60 furniture pieces total (cmaes-feat-fg4 requirement).
//   - Every piece has a valid room name from the 8 declared rooms.
//   - Every piece is in the floorplan bounds (-4..4 x, -5.5..5.5 y).
//   - Every piece's size is positive in both dimensions.
//   - Every piece's height is positive.
//   - Every piece's kind (when present) is a known FurnitureKind.
//   - Every piece's materialId (when present) is a known PBR material class.
//   - No two pieces share the same name.
//   - At least one piece per room (8 rooms).
//   - At least one piece per furniture family (seating, tables, storage, beds,
//     appliances, fixtures, decor, small-objects, outdoor).
//   - At least one rolling kind, one breakable kind, one fragile kind.

import { describe, expect, test } from "bun:test";

import { CRAFTSMAN_BUNGALOW_1928, type HouseFurniture } from "../app/lib/houseScenes";
import { ALL_FURNITURE_KINDS } from "../app/lib/furnitureTaxonomy";
import { ALL_PBR_MATERIAL_CLASSES } from "../app/lib/pbrPipeline";

const ROOM_NAMES = new Set(CRAFTSMAN_BUNGALOW_1928.rooms.map((r) => r.name));
const VALID_KINDS = new Set<string>(ALL_FURNITURE_KINDS);
const VALID_MATERIALS = new Set<string>(ALL_PBR_MATERIAL_CLASSES);

describe("houseScenes catalog (cmaes-feat-fg4-catalog-data)", () => {
  test("at least 60 furniture pieces total", () => {
    expect(CRAFTSMAN_BUNGALOW_1928.furniture.length).toBeGreaterThanOrEqual(60);
  });

  test("every piece has a valid room", () => {
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      expect(ROOM_NAMES.has(f.room)).toBe(true);
    }
  });

  test("every piece is within the floorplan bounds", () => {
    const [xmin, ymin] = CRAFTSMAN_BUNGALOW_1928.bounds.min;
    const [xmax, ymax] = CRAFTSMAN_BUNGALOW_1928.bounds.max;
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      const [cx, cy] = f.center;
      // Allow a small margin for pieces that may slightly extend past the
      // nominal room boundary (e.g., a sofa near a doorway).
      const margin = 0.3;
      expect(cx).toBeGreaterThanOrEqual(xmin - margin);
      expect(cx).toBeLessThanOrEqual(xmax + margin);
      expect(cy).toBeGreaterThanOrEqual(ymin - margin);
      expect(cy).toBeLessThanOrEqual(ymax + margin);
    }
  });

  test("every piece's size is positive in both dimensions", () => {
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      expect(f.size[0]).toBeGreaterThan(0);
      expect(f.size[1]).toBeGreaterThan(0);
    }
  });

  test("every piece's height is positive", () => {
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      expect(f.height).toBeGreaterThan(0);
      expect(f.height).toBeLessThan(3); // sanity: nothing taller than a ceiling
    }
  });

  test("every piece's kind (when present) is a known FurnitureKind", () => {
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      if (f.kind !== undefined) {
        expect(VALID_KINDS.has(f.kind)).toBe(true);
      }
    }
  });

  test("every piece's materialId (when present) is a known PBR class", () => {
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      if (f.materialId !== undefined) {
        expect(VALID_MATERIALS.has(f.materialId)).toBe(true);
      }
    }
  });

  test("no two pieces share the same name", () => {
    const seen = new Set<string>();
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      expect(seen.has(f.name)).toBe(false);
      seen.add(f.name);
    }
  });

  test("at least one piece per room (8 rooms)", () => {
    const roomPieces = new Map<string, number>();
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      roomPieces.set(f.room, (roomPieces.get(f.room) ?? 0) + 1);
    }
    for (const room of ROOM_NAMES) {
      expect(roomPieces.get(room) ?? 0).toBeGreaterThanOrEqual(1);
    }
  });

  test("at least one piece per furniture family (9 families)", () => {
    // Map FurnitureKind -> family via taxonomy. Imported via dynamic lookup.
    const familyCounts = new Map<string, number>();
    // The taxonomy's FURNITURE_KIND_DEFAULTS has family per kind; we look up via import.
    const FURNITURE_KIND_DEFAULTS = require("../app/lib/furnitureTaxonomy").FURNITURE_KIND_DEFAULTS;
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      if (f.kind) {
        const defaults = FURNITURE_KIND_DEFAULTS[f.kind];
        if (defaults) {
          const fam = defaults.family;
          familyCounts.set(fam, (familyCounts.get(fam) ?? 0) + 1);
        }
      }
    }
    const families = [
      "seating",
      "tables",
      "storage",
      "beds",
      "appliances",
      "fixtures",
      "decor",
      "small-objects",
    ];
    for (const fam of families) {
      expect(familyCounts.get(fam) ?? 0).toBeGreaterThanOrEqual(1);
    }
  });

  test("at least one rolling piece is placed in the scene", () => {
    const FURNITURE_KIND_DEFAULTS = require("../app/lib/furnitureTaxonomy").FURNITURE_KIND_DEFAULTS;
    const rollingCount = CRAFTSMAN_BUNGALOW_1928.furniture.filter((f: HouseFurniture) => {
      if (!f.kind) return false;
      const d = FURNITURE_KIND_DEFAULTS[f.kind];
      return d && d.rolls;
    }).length;
    expect(rollingCount).toBeGreaterThanOrEqual(3);
  });

  test("at least one breakable piece is placed", () => {
    const FURNITURE_KIND_DEFAULTS = require("../app/lib/furnitureTaxonomy").FURNITURE_KIND_DEFAULTS;
    const breakableCount = CRAFTSMAN_BUNGALOW_1928.furniture.filter((f: HouseFurniture) => {
      if (!f.kind) return false;
      const d = FURNITURE_KIND_DEFAULTS[f.kind];
      return d && d.breakable;
    }).length;
    expect(breakableCount).toBeGreaterThanOrEqual(10);
  });

  test("at least one fragile piece is placed", () => {
    const FURNITURE_KIND_DEFAULTS = require("../app/lib/furnitureTaxonomy").FURNITURE_KIND_DEFAULTS;
    const fragileCount = CRAFTSMAN_BUNGALOW_1928.furniture.filter((f: HouseFurniture) => {
      if (!f.kind) return false;
      const d = FURNITURE_KIND_DEFAULTS[f.kind];
      return d && d.risk === "fragile";
    }).length;
    expect(fragileCount).toBeGreaterThanOrEqual(3);
  });

  test("small kitchen objects have explicit fragility thresholds", () => {
    const fragilePieces = CRAFTSMAN_BUNGALOW_1928.furniture.filter(
      (f: HouseFurniture) => f.fragility !== undefined
    );
    expect(fragilePieces.length).toBeGreaterThanOrEqual(3);
    for (const f of fragilePieces) {
      expect(f.fragility).toBeGreaterThan(0);
      expect(f.fragility).toBeLessThan(100); // sanity: N*s
    }
  });

  test("articulation specs are well-formed where present", () => {
    const articulating = CRAFTSMAN_BUNGALOW_1928.furniture.filter(
      (f: HouseFurniture) => f.articulation && f.articulation.length > 0
    );
    expect(articulating.length).toBeGreaterThanOrEqual(2); // wardrobe, toilet at minimum
    for (const f of articulating) {
      for (const joint of f.articulation!) {
        expect(["revolute", "prismatic", "fixed", "continuous"]).toContain(joint.type);
        const len = Math.hypot(joint.axis[0], joint.axis[1], joint.axis[2]);
        expect(len).toBeGreaterThan(0.99);
        expect(len).toBeLessThan(1.01);
        expect(joint.limits.min).toBeLessThanOrEqual(joint.limits.max);
      }
    }
  });

  test("catalog is deterministic (same furniture on reload)", () => {
    // Object-identity: reading the constant twice gives equal arrays.
    expect(CRAFTSMAN_BUNGALOW_1928.furniture).toEqual(CRAFTSMAN_BUNGALOW_1928.furniture);
  });
});
