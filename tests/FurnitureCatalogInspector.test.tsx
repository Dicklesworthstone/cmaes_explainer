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
});
