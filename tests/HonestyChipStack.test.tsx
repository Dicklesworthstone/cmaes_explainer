// Smoke tests for the HonestyChipStack surface area (cmaes-feat-fs6-honesty).

import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { HonestyChipStack } from "../app/components/HonestyChipStack";
import {
  HONESTY_CHIP_REGISTRY,
  type HonestyCategory,
  type HonestyChip,
} from "../app/lib/honestyLedger";

const ALLOWED_CATEGORIES: ReadonlySet<HonestyCategory> = new Set([
  "physics",
  "graphics",
  "clipping",
  "obstacle-avoidance",
  "navigation",
  "telemetry",
]);

const REQUIRED_FIELDS: ReadonlyArray<keyof HonestyChip> = [
  "id",
  "beadId",
  "title",
  "category",
  "sourceFile",
  "testFile",
  "citation",
  "mathFormula",
  "claim",
  "status",
];

describe("HONESTY_CHIP_REGISTRY (cmaes-feat-fs6-honesty)", () => {
  test("registry is non-empty", () => {
    expect(HONESTY_CHIP_REGISTRY.length).toBeGreaterThan(0);
  });

  test("every chip has all required fields populated", () => {
    for (const chip of HONESTY_CHIP_REGISTRY) {
      for (const key of REQUIRED_FIELDS) {
        const value = chip[key];
        expect(value, `chip ${chip.id ?? "<no id>"} missing ${key}`).toBeDefined();
        if (key === "status") {
          expect(["implemented", "conceptual", "display-only"]).toContain(value as string);
        } else if (typeof value === "string") {
          expect(value.length, `chip ${chip.id} has empty ${key}`).toBeGreaterThan(0);
        }
      }
    }
  });

  test("every chip's category is one of the six allowed values", () => {
    for (const chip of HONESTY_CHIP_REGISTRY) {
      expect(ALLOWED_CATEGORIES.has(chip.category)).toBe(true);
    }
  });

  test("rendered cards identify helper and display scope without claiming runtime verification", () => {
    const markup = renderToStaticMarkup(<HonestyChipStack />);
    expect(markup).toContain("Helper code");
    expect(markup).toContain("conceptual");
    expect(markup).toContain("display-only");
    expect(markup).toContain("do not certify a live robot run");
    expect(markup).not.toContain("VERIFIED");
    expect(markup).not.toContain("Verified Green");
    expect(markup).not.toContain("100% Mathematical");
  });

  test("every chip's id is unique", () => {
    const seen = new Set<string>();
    for (const chip of HONESTY_CHIP_REGISTRY) {
      expect(seen.has(chip.id)).toBe(false);
      seen.add(chip.id);
    }
  });

  test("every chip's beadId looks like cmaes-*", () => {
    for (const chip of HONESTY_CHIP_REGISTRY) {
      expect(chip.beadId.startsWith("cmaes-")).toBe(true);
    }
  });

  test("category counts: at least one chip in every category", () => {
    const counts = new Map<HonestyCategory, number>();
    for (const chip of HONESTY_CHIP_REGISTRY) {
      counts.set(chip.category, (counts.get(chip.category) ?? 0) + 1);
    }
    for (const cat of ALLOWED_CATEGORIES) {
      expect(
        counts.get(cat) ?? 0,
        `category ${cat} has no chips; the filter UI would render an empty tab`,
      ).toBeGreaterThan(0);
    }
  });
});
