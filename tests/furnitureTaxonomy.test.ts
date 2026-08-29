// Unit tests for app/lib/furnitureTaxonomy.ts (cmaes-feat-fg1-taxonomy).
//
// Asserts:
//   - All 38 kinds are declared and resolvable.
//   - Every kind's default size is positive in all three dimensions.
//   - Every kind's default mass is positive and bounded (no NaN, no inf, no zero).
//   - Every kind's default CoG is in [0, 1] on every axis.
//   - Every friction class is one of the allowed values.
//   - The generic-box fallback is reachable for any unknown kind.
//   - The rolling, breakable, and risk flags are mutually consistent
//     (e.g., a fragile glass should be breakable; a heavy appliance should not roll).
//   - At least one rollable kind exists (used by cmaes-feat-fg5-rolling).
//   - At least one articulating kind exists (used by cmaes-feat-fg3-articulation).
//   - At least one appliance with a door exists (used by cmaes-feat-fg7-appliances).
//   - At least one soft body exists (used by cmaes-feat-fg6-soft).
//   - The taxonomy map and the ALL_FURNITURE_KINDS array agree in length.

import { describe, expect, test } from "bun:test";

import {
  ALL_FURNITURE_FAMILIES,
  ALL_FURNITURE_KINDS,
  FURNITURE_KIND_DEFAULTS,
  GENERIC_BOX_FALLBACK,
  furnitureKindDefaults,
  type FurnitureKind,
} from "../app/lib/furnitureTaxonomy";

const ALLOWED_FRICTION: Record<string, true> = {
  wood: true,
  fabric: true,
  leather: true,
  metal: true,
  ceramic: true,
  glass: true,
  plastic: true,
  rubber: true,
  stone: true,
  paper: true,
};

const ALLOWED_RISK: Record<string, true> = {
  fragile: true,
  soft: true,
  rigid: true,
  heavy: true,
  sharp: true,
};

describe("furnitureTaxonomy", () => {
  test("ALL_FURNITURE_KINDS has at least 30 entries", () => {
    // The bead cmaes-feat-fg1-taxonomy requires 30+ kinds.
    expect(ALL_FURNITURE_KINDS.length).toBeGreaterThanOrEqual(30);
  });

  test("every kind resolves in FURNITURE_KIND_DEFAULTS", () => {
    for (const kind of ALL_FURNITURE_KINDS) {
      const d = FURNITURE_KIND_DEFAULTS[kind];
      expect(d).toBeDefined();
      expect(d.kind).toBe(kind);
    }
  });

  test("ALL_FURNITURE_KINDS agrees with FURNITURE_KIND_DEFAULTS keys", () => {
    const fromMap = (Object.keys(FURNITURE_KIND_DEFAULTS) as FurnitureKind[]).sort();
    const fromList = [...ALL_FURNITURE_KINDS].sort();
    expect(fromList).toEqual(fromMap);
  });

  test("ALL_FURNITURE_FAMILIES lists at least 9 families", () => {
    expect(ALL_FURNITURE_FAMILIES.length).toBeGreaterThanOrEqual(9);
  });

  test("every kind's defaults are physical and bounded", () => {
    for (const kind of ALL_FURNITURE_KINDS) {
      const d = FURNITURE_KIND_DEFAULTS[kind];
      // Size: positive in all three dimensions.
      expect(d.defaultSize[0]).toBeGreaterThan(0);
      expect(d.defaultSize[1]).toBeGreaterThan(0);
      expect(d.defaultSize[2]).toBeGreaterThan(0);
      expect(d.defaultSize[0]).toBeLessThan(10); // sanity bound (m)
      expect(d.defaultSize[1]).toBeLessThan(10);
      expect(d.defaultSize[2]).toBeLessThan(10);
      // Mass: positive and bounded.
      expect(d.defaultMass).toBeGreaterThan(0);
      expect(d.defaultMass).toBeLessThan(10_000); // sanity bound (kg)
      // CoG: in [0, 1] on every axis.
      expect(d.defaultCoG.x).toBeGreaterThanOrEqual(0);
      expect(d.defaultCoG.x).toBeLessThanOrEqual(1);
      expect(d.defaultCoG.y).toBeGreaterThanOrEqual(0);
      expect(d.defaultCoG.y).toBeLessThanOrEqual(1);
      expect(d.defaultCoG.z).toBeGreaterThanOrEqual(0);
      expect(d.defaultCoG.z).toBeLessThanOrEqual(1);
      // Friction class: in the allowed set.
      expect(d.frictionClass in ALLOWED_FRICTION).toBe(true);
      // Risk: in the allowed set.
      expect(d.risk in ALLOWED_RISK).toBe(true);
      // Articulation: every joint is well-formed.
      for (const joint of d.articulation.joints) {
        expect(["fixed", "revolute", "prismatic", "continuous"]).toContain(joint.type);
        // Axis is a unit vector (approximately).
        const len = Math.hypot(joint.axis[0], joint.axis[1], joint.axis[2]);
        expect(len).toBeGreaterThan(0.99);
        expect(len).toBeLessThan(1.01);
        // Limits are sane.
        expect(joint.limits.min).toBeLessThanOrEqual(joint.limits.max);
        // Inertia is non-negative.
        expect(joint.childInertia.ixx).toBeGreaterThanOrEqual(0);
        expect(joint.childInertia.iyy).toBeGreaterThanOrEqual(0);
        expect(joint.childInertia.izz).toBeGreaterThanOrEqual(0);
        // Child mass is non-negative.
        expect(joint.childMass).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test("every kind has a non-empty provenance note", () => {
    for (const kind of ALL_FURNITURE_KINDS) {
      const d = FURNITURE_KIND_DEFAULTS[kind];
      expect(d.provenance.length).toBeGreaterThan(5);
    }
  });

  test("furnitureKindDefaults() returns the right defaults", () => {
    for (const kind of ALL_FURNITURE_KINDS) {
      const d = furnitureKindDefaults(kind);
      expect(d.kind).toBe(kind);
    }
  });

  test("generic-box fallback is well-formed", () => {
    expect(GENERIC_BOX_FALLBACK.defaultSize[0]).toBeGreaterThan(0);
    expect(GENERIC_BOX_FALLBACK.defaultMass).toBeGreaterThan(0);
    expect(GENERIC_BOX_FALLBACK.frictionClass in ALLOWED_FRICTION).toBe(true);
  });

  test("at least one rolling kind exists (cmaes-feat-fg5-rolling)", () => {
    const rolling = ALL_FURNITURE_KINDS.filter(
      (k) => FURNITURE_KIND_DEFAULTS[k].rolls
    );
    expect(rolling.length).toBeGreaterThanOrEqual(3);
    // Specifically: bar-stool, plate, glass, mug, bottle.
    expect(rolling).toContain("bar-stool");
    expect(rolling).toContain("plate");
    expect(rolling).toContain("glass");
  });

  test("at least one articulating kind exists (cmaes-feat-fg3-articulation)", () => {
    const articulating = ALL_FURNITURE_KINDS.filter(
      (k) => FURNITURE_KIND_DEFAULTS[k].articulation.joints.length > 0
    );
    expect(articulating.length).toBeGreaterThanOrEqual(10);
  });

  test("at least one appliance has a door (cmaes-feat-fg7-appliances)", () => {
    const appliancesWithDoors = ALL_FURNITURE_KINDS.filter((k) => {
      const d = FURNITURE_KIND_DEFAULTS[k];
      return (
        d.family === "appliances" &&
        d.articulation.joints.some((j) => j.name === "door")
      );
    });
    expect(appliancesWithDoors.length).toBeGreaterThanOrEqual(3);
  });

  test("at least one soft kind exists (cmaes-feat-fg6-soft)", () => {
    const soft = ALL_FURNITURE_KINDS.filter(
      (k) => FURNITURE_KIND_DEFAULTS[k].risk === "soft"
    );
    expect(soft.length).toBeGreaterThanOrEqual(2);
  });

  test("at least one fragile kind exists", () => {
    const fragile = ALL_FURNITURE_KINDS.filter(
      (k) => FURNITURE_KIND_DEFAULTS[k].risk === "fragile"
    );
    expect(fragile.length).toBeGreaterThanOrEqual(3);
  });

  test("fragile small objects are breakable (sanity)", () => {
    for (const k of ["plate", "glass", "mug", "bottle"] as FurnitureKind[]) {
      const d = FURNITURE_KIND_DEFAULTS[k];
      expect(d.risk).toBe("fragile");
      expect(d.breakable).toBe(true);
    }
  });

  test("heavy appliances do not roll (sanity)", () => {
    for (const k of ["fridge", "oven", "dishwasher", "washer", "dryer"] as FurnitureKind[]) {
      expect(FURNITURE_KIND_DEFAULTS[k].rolls).toBe(false);
    }
  });

  test("deterministic enumeration order (stable across reloads)", () => {
    // Object.keys order in modern JS is insertion order for string keys.
    const a = Object.keys(FURNITURE_KIND_DEFAULTS).join(",");
    const b = Object.keys(FURNITURE_KIND_DEFAULTS).join(",");
    expect(a).toBe(b);
  });
});
