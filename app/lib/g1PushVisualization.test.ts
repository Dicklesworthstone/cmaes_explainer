import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { G1TimelineScrubber } from "../components/G1TimelineScrubber";
import {
  buildG1Config,
  decodeG1Admission,
  decodeG1Trace,
  DEFAULT_G1_WALKING_CONFIG,
} from "./frankensimCmaes";
import {
  G1_OWNER_PUSH_ANGLE_DEGREES,
  resolveG1PushVisualization,
  type G1PushVisualizationInput,
} from "./g1PushVisualization";

const OWNER_PULSE: G1PushVisualizationInput = {
  manualPreviewActive: false,
  manualAngleDegrees: 270,
  manualImpulseNewtonSeconds: 45,
  ownerChallengeActive: true,
  sampleTimeSeconds: 0.625,
  ownerPushStartSeconds: 0.55,
  ownerPushEndSeconds: 0.7,
  ownerImpulseNewtonSeconds: 2.29,
};

describe("resolveG1PushVisualization", () => {
  test("timeline labels the actual owner push and termination on real flat and pushed traces", async () => {
    const owner =
      await import("../../public/wasm/fs-cmaes/v0622/fs_cmaes_viz_wasm.js");
    await owner.default({
      module_or_path: await Bun.file(
        new URL(
          "../../public/wasm/fs-cmaes/v0622/fs_cmaes_viz_wasm_bg.wasm",
          import.meta.url,
        ),
      ).arrayBuffer(),
    });
    for (const challenge of ["flat", "terrain-and-push"] as const) {
      const evaluator = new owner.G1WalkingVizEvaluator(
        buildG1Config({ ...DEFAULT_G1_WALKING_CONFIG, challenge }),
      );
      try {
        const admission = decodeG1Admission(evaluator.receipt());
        const decoded = decodeG1Trace(
          evaluator.trace(evaluator.walking_curriculum_mean()),
        );
        if (!("ok" in admission)) throw new Error(admission.refusal.name);
        if (!("ok" in decoded)) throw new Error(decoded.refusal.name);
        const trace = decoded.ok;
        const markup = renderToStaticMarkup(
          createElement(G1TimelineScrubber, {
            trace,
            pushStartSeconds:
              challenge === "flat" ? null : admission.ok.pushStartSeconds,
            currentSampleIndex: 0,
            isPlaying: false,
            playbackSpeed: 1,
            onTogglePlay() {},
            onSeekIndex() {},
            onSetSpeed() {},
            onReset() {},
          }),
        );
        expect(markup).not.toContain("Goal Reached");
        expect(markup).not.toContain("Lateral Push (15 N·s)");
        if (challenge === "flat") {
          expect(trace.pushImpulseNewtonSeconds).toBe(0);
          expect(markup).not.toContain("Owner push");
        } else {
          expect(trace.pushImpulseNewtonSeconds).toBeGreaterThan(0);
          expect(markup).toContain(
            `Owner push (${trace.pushImpulseNewtonSeconds.toFixed(1)} N·s)`,
          );
          expect(markup).toContain(
            `${admission.ok.pushStartSeconds.toFixed(3)} s:`,
          );
        }
        expect(markup).toContain(
          trace.terminationReason === "horizon"
            ? "Horizon completed"
            : `Trace ended (${trace.terminationReason})`,
        );
      } finally {
        evaluator.free();
      }
    }
  });

  test("keeps real owner playback independent of manual preview selections", () => {
    const resolved = resolveG1PushVisualization(OWNER_PULSE);

    expect(resolved.source).toBe("owner");
    expect(resolved.fraction).toBeCloseTo(1, 12);
    expect(resolved.angleDegrees).toBe(G1_OWNER_PUSH_ANGLE_DEGREES);
    expect(resolved.impulseNewtonSeconds).toBe(2.29);
  });

  test("marks a manual vector as a distinct display preview", () => {
    const resolved = resolveG1PushVisualization({
      ...OWNER_PULSE,
      manualPreviewActive: true,
      manualAngleDegrees: -90,
      manualImpulseNewtonSeconds: 25,
    });

    expect(resolved).toEqual({
      source: "manual-preview",
      fraction: 0.95,
      angleDegrees: 270,
      impulseNewtonSeconds: 25,
    });
  });

  test("does not invent an owner arrow on flat ground or pulse boundaries", () => {
    expect(
      resolveG1PushVisualization({
        ...OWNER_PULSE,
        ownerChallengeActive: false,
      }).source,
    ).toBe("none");
    expect(
      resolveG1PushVisualization({ ...OWNER_PULSE, sampleTimeSeconds: 0.55 })
        .source,
    ).toBe("none");
    expect(
      resolveG1PushVisualization({ ...OWNER_PULSE, sampleTimeSeconds: 0.7 })
        .source,
    ).toBe("none");
  });

  test("fails closed for non-finite manual and owner display values", () => {
    const manual = resolveG1PushVisualization({
      ...OWNER_PULSE,
      manualPreviewActive: true,
      manualAngleDegrees: Number.NaN,
      manualImpulseNewtonSeconds: Number.POSITIVE_INFINITY,
    });
    expect(manual.angleDegrees).toBe(G1_OWNER_PUSH_ANGLE_DEGREES);
    expect(manual.impulseNewtonSeconds).toBe(15);

    const owner = resolveG1PushVisualization({
      ...OWNER_PULSE,
      ownerImpulseNewtonSeconds: Number.NaN,
    });
    expect(owner.source).toBe("owner");
    expect(owner.impulseNewtonSeconds).toBe(0);
  });
});
