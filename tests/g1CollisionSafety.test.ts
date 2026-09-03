// Safety and coordinate-contract checks for the versioned G1 owner trace.
//
// Important boundary: the v0613 terrain-and-push owner does not consume the
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
  findClearTrajectorySpawnOffset,
} from "../app/lib/houseMultiObstacleKernel";
import { CRAFTSMAN_BUNGALOW_1928 } from "../app/lib/houseScenes";

function unwrap<T>(
  result: { ok: T } | { refusal: PackedOwnerRefusal },
  context: string,
): T {
  if ("ok" in result) return result.ok;
  throw new Error(`${context} refusal: ${result.refusal.name}`);
}

const ownerModule = await import(
  "../public/wasm/fs-cmaes/v0616/fs_cmaes_viz_wasm.js"
);
const ownerBytes = await Bun.file(
  new URL(
    "../public/wasm/fs-cmaes/v0616/fs_cmaes_viz_wasm_bg.wasm",
    import.meta.url,
  ),
).arrayBuffer();
await ownerModule.default({ module_or_path: ownerBytes });

const Evaluator = ownerModule.G1WalkingVizEvaluator;
if (!Evaluator) throw new Error("G1WalkingVizEvaluator export missing from the shipped WASM");
const evaluator = new Evaluator(
  // Schema-8 walking config: eleven fixed words plus a keep-out box count.
  // This suite pins the owner's own coordinate and safety envelope, so it
  // declares no boxes; the browser's roster is covered separately.
  new Float64Array([
    0x47315737,
    8,
    0,
    12,
    1 / 480,
    1.5,
    0.65,
    1.55,
    12,
    2,
    0,
    0,
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

describe("G1 v0613 owner trace safety envelope", () => {
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
    // v0.6.13 (v073 constraint-aware retune): the 30-link flat curriculum now
    // completes the full 720-step horizon with ~0.31 m forward displacement and
    // ~0.08 s total flight. The >1.0 m / >0.5 m/s bead target remains unmet, so
    // the honest current displacement stays documented in g1_walking.rs
    // rather than asserted as the target.
    expect(curriculumEvaluation.completedSteps).toBe(720);
    expect(curriculumEvaluation.terminationReason).toBe("horizon");
    expect(curriculumEvaluation.minimumBaseHeightMeters).toBeGreaterThan(0.5);
    expect(curriculumEvaluation.maximumTiltSine).toBeLessThan(0.25);
    expect(curriculumEvaluation.flightSeconds).toBeLessThanOrEqual(0.1);
  });

  test("attaches the exact evaluation receipt to the rendered trace", () => {
    expect(receiptWithoutSamples(curriculumTrace)).toEqual(curriculumEvaluation);
  });

  test("seats the WHOLE rendered trajectory clear of every rigid house obstacle at the real pelvis height", () => {
    // Mirrors the browser's spawn effect exactly: the footprint is every
    // link of every sub-sampled trace sample, relative to the first pelvis
    // in x/z with the true rendered height in y. The seat must keep every
    // one of those points at least link-radius-plus-margin (0.18 m) from
    // every rigid OBB, walls included, WITHOUT lifting the robot: the
    // returned offset has no Y component and the proof is evaluated at the
    // heights the kernel actually produced.
    const ownerToThree = (position: readonly number[]): [number, number, number] => [
      position[0],
      position[2],
      -position[1],
    ];
    const pelvis = ownerToThree(curriculumTrace.samples[0].linkPoses[0].position);
    const stride = Math.max(1, Math.ceil(curriculumTrace.samples.length / 48));
    const footprint: [number, number, number][] = [];
    for (let index = 0; index < curriculumTrace.samples.length; index += stride) {
      for (const linkPose of curriculumTrace.samples[index].linkPoses) {
        const p = ownerToThree(linkPose.position);
        footprint.push([p[0] - pelvis[0], p[1], p[2] - pelvis[2]]);
      }
    }
    const scene = createHouseNavigationScene();
    const living = CRAFTSMAN_BUNGALOW_1928.rooms.find((room) => room.name === "living room")!;
    const clearance = 0.18;
    const seat = findClearTrajectorySpawnOffset(scene.obstacles, {
      footprint,
      clearance,
      anchor: [living.center[0], living.center[1]],
      step: 0.25,
    });

    expect(seat.offset[1]).toBe(0);
    expect(seat.minClearance).toBeGreaterThanOrEqual(clearance);
    // The robot lands in the living room, not on the porch edge.
    expect(Math.abs(seat.pelvis[0] - living.center[0])).toBeLessThanOrEqual(living.size[0] / 2);
    expect(Math.abs(seat.pelvis[1] - living.center[1])).toBeLessThanOrEqual(living.size[1] / 2);

    // Independent re-check of every trace sample (not just the sub-sampled
    // footprint) at the seated offset.
    for (const sample of curriculumTrace.samples) {
      for (const linkPose of sample.linkPoses) {
        const link = ownerToThree(linkPose.position);
        const world: [number, number, number] = [
          link[0] - pelvis[0] + seat.offset[0],
          link[1],
          link[2] - pelvis[2] + seat.offset[2],
        ];
        for (const obstacle of scene.obstacles) {
          if (obstacle.exemptFromPenalty) continue;
          expect(distanceToOBB(world, obstacle), obstacle.name).toBeGreaterThanOrEqual(
            clearance - 0.03,
          );
        }
      }
    }
  });

  test("the legacy single-point spawn search never lifts the robot onto furniture", () => {
    const scene = createHouseNavigationScene();
    const spawn = findClearSpawnPosition(scene.obstacles, 0.85);
    expect(spawn[1]).toBe(0.75);
    for (const obstacle of scene.obstacles) {
      if (obstacle.exemptFromPenalty) continue;
      expect(distanceToOBB(spawn, obstacle), obstacle.name).toBeGreaterThanOrEqual(0.85);
    }
  });
});
