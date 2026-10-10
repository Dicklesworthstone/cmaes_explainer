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
import { fileURLToPath } from "node:url";

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
  for (const name of ["G1WalkingFlagship", "HouseholdArmFlagship", "ResponsiveRobotCamera"]) {
    test(`${name} cold import does not load unrelated Drei subsystems`, async () => {
      // Each component gets a fresh module cache. The in-process sweep below
      // cannot detect cold-start regressions after another test warmed Drei.
      // Its barrel pulled in HLS, gainmap decoding and a second camera library
      // even though these labs only use individual controls and primitives.
      const modulePath = fileURLToPath(new URL(`../app/components/${name}.tsx`, import.meta.url));
      const child = Bun.spawn({
        cmd: [
          process.execPath,
          "-e",
          String.raw`const started = performance.now();
           const component = require(${JSON.stringify(modulePath)});
           const loaded = Object.keys(require.cache);
           console.log(JSON.stringify({
             exportedType: typeof component[${JSON.stringify(name)}],
             elapsedMs: performance.now() - started,
             loadedCount: loaded.length,
             unrelated: loaded.filter(path =>
               /\/(@react-three\/drei\/index\.|hls\.js\/|@monogrid\/gainmap-js\/|camera-controls\/)/.test(path))
           }));`,
        ],
        stdin: "ignore",
        stdout: "pipe",
        stderr: "pipe",
        timeout: 5_000,
      });
      const [exitCode, stdout, stderr] = await Promise.all([
        child.exited,
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
      ]);
      expect({ exitCode, stderr }).toEqual({ exitCode: 0, stderr: "" });
      const result = JSON.parse(stdout);
      expect(result.exportedType).toBe("function");
      expect(result.loadedCount).toBeGreaterThan(0);
      expect(result.elapsedMs).toBeLessThan(5_000);
      expect(result.unrelated).toEqual([]);
    });
  }

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
      const cameras: { label: string; pressed: string | null }[] = [];
      let cameraGroups = 0;
      const parser = new HTMLRewriter()
        .on('[aria-label="Humanoid stage controls"]', {
          element(element) {
            const classes = element.getAttribute("class")!.split(/\s+/);
            expect(classes).toContain(embedded ? "relative" : "absolute");
            expect(classes.includes("absolute")).toBe(!embedded);
          },
        })
        .on('#g1-robot-stage', {
          element(element) {
            expect(element.getAttribute("class")!.includes("order-first")).toBe(embedded);
          },
        })
        .on('[role="group"][aria-label="Humanoid camera views"]', {
          element(element) {
            cameraGroups++;
            // Structural regression only; actual compact-phone geometry is
            // verified in the exported app, not inferred from these classes.
            const classes = element.getAttribute("class")!.split(/\s+/);
            expect(classes).toContain("w-full");
            expect(classes).toContain("min-w-0");
            expect(classes).toContain("grid-cols-5");
            expect(classes).toContain("sm:grid");
            expect(classes).toContain("lg:flex");
          },
        })
        .on('#g1-hud-controls', {
          element(element) {
            const classes = element.getAttribute("class")!.split(/\s+/);
            expect(classes).toContain("w-full");
            expect(classes).toContain("lg:shrink-0");
          },
        })
        .on('[aria-label="Humanoid visualization"]', {
          element(element) {
            expect(element.getAttribute("data-native-stage-scroll")).toBe(embedded ? "true" : null);
          },
        })
        .on('button[aria-label$=" camera"]', {
          element(element) {
            const classes = element.getAttribute("class")!.split(/\s+/);
            expect(classes).toContain("min-h-11");
            expect(classes).toContain("min-w-0");
            expect(classes).toContain("flex-col");
            expect(classes).toContain("lg:flex-row");
            expect(classes).toContain("lg:shrink-0");
            expect(classes).toContain("lg:whitespace-nowrap");
            cameras.push({
              label: element.getAttribute("aria-label")!,
              pressed: element.getAttribute("aria-pressed"),
            });
          },
        })
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
      expect(cameraGroups).toBe(1);
      expect(cameras).toEqual([
        { label: "Orbit camera", pressed: embedded ? "false" : "true" },
        { label: "Follow camera", pressed: embedded ? "true" : "false" },
        { label: "POV camera", pressed: "false" },
        { label: "Map camera", pressed: "false" },
        { label: "Free-fly camera", pressed: "false" },
      ]);
      // Real server render, not a simulated click or browser-layout assertion.
      // The full lab remains present even when the stage HUD is collapsed.
      expect(html).toContain('id="g1-sigma"');
      expect(html).toContain('id="g1-family"');
      expect(html).toContain("Start learning");
      // The jump destination must offer its primary actions before the long
      // setup/source explanations, with no duplicate start/reset controls.
      let learningActionCount = 0;
      await new HTMLRewriter()
        .on('[aria-label="Humanoid learning actions"] button', {
          element() { learningActionCount++; },
        })
        .transform(new Response(html)).text();
      expect(learningActionCount).toBe(3);
      const learningActions = html.indexOf('aria-label="Humanoid learning actions"');
      expect(learningActions).toBeGreaterThan(html.indexOf('id="g1-learning-controls"'));
      expect(learningActions).toBeLessThan(html.indexOf("Fifteen learned actuator rows"));
      expect(learningActions).toBeLessThan(html.indexOf('id="g1-family"'));
      expect(html.includes("Learn &amp; inspect")).toBe(embedded);
    }
  });

  test("embedded Arm retains every camera and playback control outside the scene", async () => {
    const { createElement } = await import("react");
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { HouseholdArmFlagship } = await import("../app/components/HouseholdArmFlagship");
    for (const embedded of [true, false]) {
      const html = renderToStaticMarkup(
        createElement<{ embedded?: boolean }>(HouseholdArmFlagship, { embedded }),
      );
      const cameras: string[] = [];
      const selectedCameras: string[] = [];
      let cameraGroups = 0;
      let stageControls = 0;
      let visualizations = 0;
      const parser = new HTMLRewriter()
        .on('[aria-label="Arm stage controls"]', {
          element(element) {
            stageControls++;
            expect(element.getAttribute("class")).toContain(embedded ? "relative" : "absolute");
          },
        })
        .on('[aria-label="Arm visualization"]', {
          element(element) {
            visualizations++;
            expect(element.getAttribute("role")).toBe("region");
            expect(element.getAttribute("data-native-stage-scroll")).toBe(embedded ? "true" : null);
            expect(element.getAttribute("class")!.includes("order-first")).toBe(embedded);
          },
        })
        .on('[role="group"][aria-label="Arm camera views"]', {
          element() { cameraGroups++; },
        })
        .on('button[aria-label$=" camera"]', {
          element(element) {
            const label = element.getAttribute("aria-label")!;
            cameras.push(label);
            expect(element.getAttribute("aria-pressed")).toBe(
              label === "Studio camera" ? "true" : "false",
            );
            if (element.getAttribute("aria-pressed") === "true") selectedCameras.push(label);
            expect(element.getAttribute("disabled")).toBeNull();
            if (embedded) expect(element.getAttribute("class")).toContain("min-h-11");
          },
        });
      await parser.transform(new Response(html)).text();
      expect(stageControls).toBe(1);
      expect(visualizations).toBe(1);
      expect(cameraGroups).toBe(1);
      expect(cameras).toEqual([
        "Studio camera", "Grasp Focus camera", "Top camera",
        "Side camera", "Front camera", "Free-Fly camera",
      ]);
      expect(selectedCameras).toEqual(["Studio camera"]);
      expect(html).toContain('aria-label="Arm trace playback"');
      expect(html).toContain('aria-label="Arm trace position"');
      expect(html).toContain('aria-label="Arm trace playback speed"');
      expect(html).toContain("Start learning");
      // SSR checks retained controls and layout intent, not pixel overlap.
      // Actual canvas/toolbar/timeline rectangles are checked in the export.
    }
  });
});
