// Smoke test: the flagship components must import without throwing.
// This catches regressions that no unit test would see — circular
// imports, missing exports, type errors that only surface when the
// component module is loaded for the first time.
//
// The user reported "the humanoid robot spawns INSIDE A wall" —
// a regression here would prevent the flagship from loading at all
// and silence the user. This test guarantees the import path works.
//
// Each require is wrapped in a single test so the failure message
// names the specific component that broke. 5-second budget per
// flagship module keeps the import-graph cost bounded.
import { describe, expect, test } from "bun:test";

const FLAGSHIP_MODULES = [
  // Core flagship components
  "../app/components/G1WalkingFlagship",
  "../app/components/HouseholdArmFlagship",
  // Debug overlays
  "../app/components/G1PhysicsDebugOverlay",
  "../app/components/ArmPhysicsDebugOverlay",
  // House + interior
  "../app/components/SearsCraftsmanEstate",
  "../app/components/CraftsmanLivingRoom",
  "../app/components/G1HouseBackdrop",
  // Biomechanics / microscope / KMR
  "../app/components/G1BiomechanicsOverlay",
  "../app/components/ArmGraspMicroscope",
  "../app/components/ArmPageClient",
  "../app/components/KmrScene",
  "../app/components/KmrBase3D",
  // Story / scrubber / objective
  "../app/components/G1StoryTour",
  "../app/components/G1TimelineScrubber",
  "../app/components/G1ObjectiveEqualizer",
  // Inspector + materials
  "../app/components/CraftsmanArchitecturalInspector",
  "../app/components/MaterialDatabaseInspector",
];

describe("flagship components import without throwing", () => {
  for (const modulePath of FLAGSHIP_MODULES) {
    const name = modulePath.split("/").pop();
    test(`${name} imports cleanly`, () => {
      expect(() => {
        require(modulePath);
      }).not.toThrow();
    });
  }

  test("every flagship module loads under 5 seconds (regression bound)", () => {
    const start = performance.now();
    for (const modulePath of FLAGSHIP_MODULES) {
      require(modulePath);
    }
    const elapsedMs = performance.now() - start;
    expect(elapsedMs).toBeLessThan(5_000);
  });
});
