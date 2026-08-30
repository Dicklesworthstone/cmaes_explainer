// Safety and coordinate-contract checks for the versioned G1 owner trace.
//
// Important boundary: the v069 terrain-and-push owner does not consume the
// Craftsman house wall OBBs. Whole-house path collision is verified by
// houseMultiObstacleKernel.test.ts, where those obstacles actually participate
// in the computation. This file checks only claims the G1 owner really makes:
// finite 30-link world poses, a bounded local experiment, plausible z-up
// heights, and an evaluation receipt identical to the one attached to trace.

import { afterAll, describe, expect, test } from "bun:test";
import {
  decodeG1Admission,
  decodeG1Evaluation,
  decodeG1Trace,
  type G1ObjectiveReceipt,
  type G1TraceReceipt,
  type PackedOwnerRefusal,
} from "../app/lib/frankensimCmaes";

function unwrap<T>(
  result: { ok: T } | { refusal: PackedOwnerRefusal },
  context: string,
): T {
  if ("ok" in result) return result.ok;
  throw new Error(`${context} refusal: ${result.refusal.name}`);
}

const ownerModule = await import(
  "../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm.js"
);
const ownerBytes = await Bun.file(
  new URL(
    "../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm_bg.wasm",
    import.meta.url,
  ),
).arrayBuffer();
await ownerModule.default({ module_or_path: ownerBytes });

const Evaluator = ownerModule.G1WalkingVizEvaluator;
if (!Evaluator) throw new Error("G1WalkingVizEvaluator export missing from v069 WASM");
const evaluator = new Evaluator(
  new Float64Array([
    0x47315737,
    7,
    0,
    11,
    1 / 480,
    1.5,
    0.65,
    1.55,
    12,
    2,
    1,
  ]),
);
const admission = unwrap(decodeG1Admission(evaluator.receipt()), "G1 admission");
expect(admission.policyDimension).toBe(5_040);
const curriculumPolicy = evaluator.walking_curriculum_mean();
const curriculumTrace = unwrap(
  decodeG1Trace(evaluator.trace(curriculumPolicy)),
  "G1 trace",
);
const curriculumEvaluation = unwrap(
  decodeG1Evaluation(evaluator.evaluate(curriculumPolicy)),
  "G1 evaluation",
);

afterAll(() => evaluator.free());

function assertFiniteBoundedOwnerTrace(receipt: G1TraceReceipt): void {
  for (let sampleIndex = 0; sampleIndex < receipt.samples.length; sampleIndex++) {
    const sample = receipt.samples[sampleIndex];
    expect(sample.linkPoses).toHaveLength(30);
    for (let linkIndex = 0; linkIndex < sample.linkPoses.length; linkIndex++) {
      const [forward, lateral, up] = sample.linkPoses[linkIndex].position;
      const coordinates = [forward, lateral, up];
      if (!coordinates.every(Number.isFinite)) {
        throw new Error(
          `non-finite G1 pose at sample ${sampleIndex}, link ${linkIndex}: ${coordinates.join(", ")}`,
        );
      }
      if (Math.hypot(forward, lateral) > 3 || up < -0.05 || up > 2.6) {
        throw new Error(
          `G1 pose escaped the local experiment envelope at sample ${sampleIndex}, ` +
            `link ${linkIndex}: (${coordinates.map((value) => value.toFixed(3)).join(", ")})`,
        );
      }
    }
  }
}

function receiptWithoutSamples(receipt: G1TraceReceipt): G1ObjectiveReceipt {
  const { samples: _samples, ...objective } = receipt;
  return objective;
}

describe("G1 v069 owner trace safety envelope", () => {
  test("emits finite, bounded, 30-link world poses", () => {
    expect(curriculumTrace.samples.length).toBeGreaterThanOrEqual(5);
    assertFiniteBoundedOwnerTrace(curriculumTrace);
  });

  test("uses the documented owner z-up coordinate convention", () => {
    const footLinks = [6, 12];
    const waistLinks = [15, 16, 17];

    for (const sample of curriculumTrace.samples) {
      for (const linkIndex of footLinks) {
        const footHeight = sample.linkPoses[linkIndex].position[2];
        expect(footHeight).toBeGreaterThanOrEqual(0);
        expect(footHeight).toBeLessThan(0.15);
      }

      const pelvisHeight = sample.linkPoses[0].position[2];
      expect(pelvisHeight).toBeGreaterThan(0.5);
      for (const linkIndex of waistLinks) {
        expect(sample.linkPoses[linkIndex].position[2]).toBeGreaterThan(0.5);
      }
    }
  });

  test("reports the honest current curriculum outcome", () => {
    expect(curriculumEvaluation.completedSteps).toBeGreaterThanOrEqual(336);
    expect(curriculumEvaluation.completedSteps).toBeLessThan(720);
    expect(curriculumEvaluation.terminationReason).toBe("joint position limit");
    expect(curriculumEvaluation.minimumBaseHeightMeters).toBeGreaterThan(0.5);
    expect(curriculumEvaluation.maximumTiltSine).toBeLessThan(0.25);
  });

  test("attaches the exact evaluation receipt to the rendered trace", () => {
    expect(receiptWithoutSamples(curriculumTrace)).toEqual(curriculumEvaluation);
  });
});
