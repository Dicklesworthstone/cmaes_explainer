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
  "../app/components/FrankenRobotsArmRoute",
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

  test("embedded humanoid renders direct navigation to real learning controls and back", async () => {
    const { createElement } = await import("react");
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { G1WalkingFlagship } = await import("../app/components/G1WalkingFlagship");
    for (const embedded of [true, false]) {
      const html = renderToStaticMarkup(
        createElement<{ embedded?: boolean }>(G1WalkingFlagship, { embedded }),
      );
      const buttons: string[] = [];
      const regions: string[] = [];
      const parser = new HTMLRewriter()
        .on(
          'button[aria-controls="g1-learning-controls"], button[aria-controls="g1-robot-stage"]',
          {
            element(element) {
              expect(element.getAttribute("type")).toBe("button");
              expect(element.getAttribute("disabled")).toBeNull();
              expect(element.getAttribute("class")).toContain("min-h-11");
              buttons.push(element.getAttribute("aria-controls")!);
            },
          },
        )
        .on("#g1-learning-controls, #g1-robot-stage", {
          element(element) {
            expect(element.getAttribute("role")).toBe("region");
            expect(element.getAttribute("tabindex")).toBe("-1");
            expect(element.getAttribute("aria-label")).toBeTruthy();
            regions.push(element.getAttribute("id")!);
          },
        });
      await parser.transform(new Response(html)).text();
      expect(buttons).toEqual(embedded ? ["g1-learning-controls", "g1-robot-stage"] : []);
      expect(regions).toEqual(["g1-robot-stage", "g1-learning-controls"]);
      // Real server render, not a simulated click or browser-layout assertion.
      // The full lab remains present even when the stage HUD is collapsed.
      expect(html).toContain('id="g1-sigma"');
      expect(html).toContain('id="g1-family"');
      expect(html).toContain("Start learning");
      expect(html.includes("Learn &amp; inspect")).toBe(embedded);
    }
  });
});
