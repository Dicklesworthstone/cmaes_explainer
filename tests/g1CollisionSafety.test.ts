// Safety and coordinate-contract checks for the versioned G1 owner trace.
//
// Important boundary: the v069 terrain-and-push owner does not consume the
// Craftsman house wall OBBs. Whole-house path collision is verified by
// houseMultiObstacleKernel.test.ts, where those obstacles actually participate
// in the computation. The owner checks below cover finite 30-link poses, a
// bounded local experiment, plausible z-up heights, and receipt parity. The
// final test separately verifies the browser's explicit composition of that
// owner pose with its house-aware spawn guard.

import { afterAll, describe, expect, test } from "bun:test";
import {
  decodeG1Admission,
  decodeG1Evaluation,
  decodeG1Trace,
  type G1ObjectiveReceipt,
  type G1TraceReceipt,
  type PackedOwnerRefusal,
} from "../app/lib/frankensimCmaes";
import {
  createHouseNavigationScene,
  distanceToOBB,
  findClearSpawnPosition,
} from "../app/lib/houseMultiObstacleKernel";

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
    // cmaes-zi6 3-stage retune: the v0.6.9 30-link curriculum now completes
    // the 720-step flat horizon (was failing at ~368 steps under the
    // v0.6.6 baked-in mean on the 30-link dynamics). The
    // termination_reason is now Horizon, not joint position limit.
    expect(curriculumEvaluation.completedSteps).toBeGreaterThanOrEqual(720);
    expect(curriculumEvaluation.completedSteps).toBeLessThanOrEqual(720);
    expect(curriculumEvaluation.terminationReason).toBe("horizon");
    expect(curriculumEvaluation.minimumBaseHeightMeters).toBeGreaterThan(0.5);
    expect(curriculumEvaluation.maximumTiltSine).toBeLessThan(0.25);
  });

  test("attaches the exact evaluation receipt to the rendered trace", () => {
    expect(receiptWithoutSamples(curriculumTrace)).toEqual(curriculumEvaluation);
  });

  test("places a conservative whole-body envelope clear of every rigid house obstacle", () => {
    const firstSample = curriculumTrace.samples[0];
    const ownerToThree = (position: readonly number[]): [number, number, number] => [
      position[0],
      position[2],
      -position[1],
    ];
    const pelvis = ownerToThree(firstSample.linkPoses[0].position);
    const bodyRadius = firstSample.linkPoses.reduce((radius, linkPose) => {
      const link = ownerToThree(linkPose.position);
      return Math.max(
        radius,
        Math.hypot(
          link[0] - pelvis[0],
          link[1] - pelvis[1],
          link[2] - pelvis[2],
        ) + 0.12,
      );
    }, 0.35);
    const spawnRadius = bodyRadius + Math.abs(pelvis[1] - 0.75);
    const scene = createHouseNavigationScene();
    const spawn = findClearSpawnPosition(scene.obstacles, spawnRadius);
    const offset: [number, number, number] = [
      spawn[0] - pelvis[0],
      0,
      spawn[2] - pelvis[2],
    ];

    for (const obstacle of scene.obstacles) {
      if (obstacle.exemptFromPenalty) continue;
      expect(distanceToOBB(spawn, obstacle), obstacle.name).toBeGreaterThanOrEqual(
        spawnRadius,
      );
      for (const linkPose of firstSample.linkPoses) {
        const link = ownerToThree(linkPose.position);
        const translated: [number, number, number] = [
          link[0] + offset[0],
          link[1],
          link[2] + offset[2],
        ];
        expect(distanceToOBB(translated, obstacle), obstacle.name).toBeGreaterThanOrEqual(
          0.12,
        );
      }
    }
  });
});
