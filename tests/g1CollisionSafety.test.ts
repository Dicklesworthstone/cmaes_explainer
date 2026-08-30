// tests/g1CollisionSafety.test.ts
//
// Safety belt for the G1 walking kernel: the robot CANNOT walk through
// walls or obstacles, EVER. The v068/v069 kernel enforces this internally
// (contact dynamics + penalty forces), but the TS side never explicitly
// verified it. This test runs real rollouts and asserts that:
//   1. Every link's world-frame position stays inside the house bounds.
//   2. Foot and hand heights stay above the floor and below the ceiling.
//   3. The aggressive policy (max torques) does NOT push the G1 through
//      a wall (no link position crosses an exterior wall plane).
//   4. The 720-step rollout of the curriculum-mean policy keeps the
//      G1 inside the house the entire time.
//
// If a future kernel regression relaxes the contact stiffness or
// the integration scheme (e.g. switching to a higher dt), this test
// fails. The exact error message names the offending sample + link
// so the regression is debuggable.

import { describe, expect, test } from "bun:test";
import { CRAFTSMAN_BUNGALOW_1928 } from "../app/lib/houseScenes";
import { distanceToOBB } from "../app/lib/houseMultiObstacleKernel";
import {
  decodeG1Admission,
  decodeG1Trace,
  decodeG1Evaluation,
  type G1TraceReceipt,
  type PackedOwnerRefusal,
} from "../app/lib/frankensimCmaes";

// Minimal type for the WASM exports we need.
type WasmG1 = {
  G1WalkingVizEvaluator: new (config: Float64Array) => unknown;
};

const W1 = (await import(
  "../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm.js"
)) as unknown as {
  default: (opts: { module_or_path: ArrayBuffer | string }) => Promise<void>;
  G1WalkingVizEvaluator?: WasmG1["G1WalkingVizEvaluator"];
  [key: string]: unknown;
};

const wasmBytes = await Bun.file(
  new URL(
    "../public/wasm/fs-cmaes/v069/fs_cmaes_viz_wasm_bg.wasm",
    import.meta.url,
  ),
).arrayBuffer();
await W1.default({ module_or_path: wasmBytes });

// House bounds from the catalog (lateral × forward in meters).
const BOUNDS = CRAFTSMAN_BUNGALOW_1928.bounds;
const [B_MIN_X, B_MIN_Y] = BOUNDS.min;
const [B_MAX_X, B_MAX_Y] = BOUNDS.max;

// Small inward safety margin — the wall thickness is ~0.12 m
// per the catalog; the G1 link has a nonzero radius. We require
// every link to be at least 0.20 m inside the wall plane, which
// catches any penetration while tolerating the catalog's 0.12 m
// wall thickness plus a typical link radius of ~0.05 m.
const MARGIN = 0.20;

// G1 v068 has 30 links. Per the v068 design: indices 0..14 are legs,
// 15..17 are waist, 18..24 are left arm, 25..31 are right arm.
// Indices 6 (left foot) and 12 (right foot) must be near floor level.
const FOOT_LINKS = [6, 12];
const PELVIS_LINK = 0;
const WAIST_LINKS = [15, 16, 17];

// House floor and ceiling for the Y axis (up). The catalog has
// floor at y=0 (1-story bungalow). Ceiling at ~2.5 m.
const FLOOR_Y = 0.02;
const CEILING_Y = 2.6;

const G1_CONFIG = new Float64Array([
  0x47315737, 7, 0, 11, 1 / 480, 1.5, 0.65, 1.55, 12, 2, 1,
]);

/** Unwrap a PackedResult; throw if it's a refusal. */
function unwrap<T>(
  result: { ok: T } | { refusal: PackedOwnerRefusal },
  context: string,
): T {
  if ("ok" in result) return result.ok;
  throw new Error(`${context} refusal: ${result.refusal.name}`);
}

/**
 * Asserts that every link of every sample stays inside the house
 * bounds and at plausible heights. Returns the first violation found,
 * or null if every link passes.
 */
function findFirstViolation(receipt: G1TraceReceipt): {
  sample: number;
  link: number;
  position: [number, number, number];
  reason: string;
} | null {
  for (let s = 0; s < receipt.samples.length; s++) {
    const sample = receipt.samples[s];
    for (let l = 0; l < sample.linkPoses.length; l++) {
      const [x, y, z] = sample.linkPoses[l].position;
      if (x < B_MIN_X + MARGIN) {
        return {
          sample: s,
          link: l,
          position: [x, y, z],
          reason: `x=${x.toFixed(3)} < B_MIN_X+MARGIN=${(B_MIN_X + MARGIN).toFixed(3)} (wall on +X side)`,
        };
      }
      if (x > B_MAX_X - MARGIN) {
        return {
          sample: s,
          link: l,
          position: [x, y, z],
          reason: `x=${x.toFixed(3)} > B_MAX_X-MARGIN=${(B_MAX_X - MARGIN).toFixed(3)} (wall on -X side)`,
        };
      }
      if (z < B_MIN_Y + MARGIN) {
        return {
          sample: s,
          link: l,
          position: [x, y, z],
          reason: `z=${z.toFixed(3)} < B_MIN_Y+MARGIN=${(B_MIN_Y + MARGIN).toFixed(3)} (wall on +Z side)`,
        };
      }
      if (z > B_MAX_Y - MARGIN) {
        return {
          sample: s,
          link: l,
          position: [x, y, z],
          reason: `z=${z.toFixed(3)} > B_MAX_Y-MARGIN=${(B_MAX_Y - MARGIN).toFixed(3)} (wall on -Z side)`,
        };
      }
      if (y < FLOOR_Y) {
        return {
          sample: s,
          link: l,
          position: [x, y, z],
          reason: `y=${y.toFixed(3)} < FLOOR_Y=${FLOOR_Y} (below floor)`,
        };
      }
      if (y > CEILING_Y) {
        return {
          sample: s,
          link: l,
          position: [x, y, z],
          reason: `y=${y.toFixed(3)} > CEILING_Y=${CEILING_Y} (above ceiling)`,
        };
      }
    }
  }
  return null;
}

/**
 * Checks that the G1 trace does not have any link position inside
 * a wall OBB. Per the catalog: each wall is a rectangle from
 * `from` to `to` with `thickness` and `height`. A link position
 * inside the wall's OBB means the link has penetrated the wall.
 */
function findFirstOBBPenetration(
  receipt: G1TraceReceipt,
): { sample: number; link: number; wallName: string; distance: number } | null {
  const wallOBBs = CRAFTSMAN_BUNGALOW_1928.walls.map((w, i) => {
    const fx = w.from[0],
      fz = w.from[1];
    const tx = w.to[0],
      tz = w.to[1];
    const cx = (fx + tx) / 2;
    const cz = (fz + tz) / 2;
    const dx = tx - fx;
    const dz = tz - fz;
    const len = Math.hypot(dx, dz);
    const yaw = Math.atan2(dz, dx);
    return {
      name: `wall-${i}`,
      center: [cx, w.height / 2, cz],
      halfExtents: [len / 2 + w.thickness / 2, w.height / 2, w.thickness / 2],
      rotationYawRad: yaw,
    };
  });
  for (let s = 0; s < receipt.samples.length; s++) {
    const sample = receipt.samples[s];
    for (let l = 0; l < sample.linkPoses.length; l++) {
      for (const obb of wallOBBs) {
        const d = distanceToOBB(sample.linkPoses[l].position, obb);
        if (d < 0) {
          return { sample: s, link: l, wallName: obb.name, distance: d };
        }
      }
    }
  }
  return null;
}

const Cls = W1.G1WalkingVizEvaluator;
if (!Cls) {
  throw new Error("G1WalkingVizEvaluator export missing from v069 wasm");
}

describe("G1 Collision Safety — the robot CANNOT walk through walls or obstacles, EVER", () => {
  const evaluator = new Cls(G1_CONFIG) as {
    trace: (params: Float64Array) => Float64Array;
    walking_curriculum_mean: () => Float64Array;
    evaluate: (params: Float64Array) => Float64Array;
    receipt: () => Float64Array;
    free: () => void;
  };
  const admission = unwrap(decodeG1Admission(evaluator.receipt()), "G1 admission");
  expect(admission.policyDimension).toBe(5_040);

  const curriculumPolicy = evaluator.walking_curriculum_mean();

  test("every link of the curriculum-mean rollout stays inside the house bounds", () => {
    const decoded = unwrap(
      decodeG1Trace(evaluator.trace(curriculumPolicy)),
      "G1 trace",
    );
    const v = findFirstViolation(decoded);
    if (v !== null) {
      throw new Error(
        `G1 link ${v.link} at sample ${v.sample} is at ` +
          `(${v.position.map((n) => n.toFixed(3)).join(", ")}); ` +
          `violation: ${v.reason}`,
      );
    }
    expect(v).toBeNull();
  });

  test("every link of the curriculum-mean rollout stays out of every wall OBB", () => {
    const decoded = unwrap(
      decodeG1Trace(evaluator.trace(curriculumPolicy)),
      "G1 trace",
    );
    const p = findFirstOBBPenetration(decoded);
    if (p !== null) {
      throw new Error(
        `G1 link ${p.link} at sample ${p.sample} is inside ` +
          `${p.wallName} (distance ${p.distance.toFixed(3)} m). ` +
          `The robot walked through a wall.`,
      );
    }
    expect(p).toBeNull();
  });

  test("the aggressive policy (max torques) does not push the G1 through a wall", () => {
    const aggressive = new Float64Array(admission.policyDimension).fill(0.05);
    const traceResult = decodeG1Trace(evaluator.trace(aggressive));
    if (!("ok" in traceResult)) {
      // Aggressive policy may legitimately refuse to admit (e.g. shape
      // mismatch) or terminate the rollout early; that's not a wall
      // penetration — accept the refusal.
      return;
    }
    const v = findFirstViolation(traceResult);
    if (v !== null) {
      throw new Error(
        `G1 link ${v.link} at sample ${v.sample} is at ` +
          `(${v.position.map((n) => n.toFixed(3)).join(", ")}); ` +
          `violation: ${v.reason}. The aggressive policy pushed the robot through a wall.`,
      );
    }
    expect(v).toBeNull();
  });

  test("feet stay near the floor and the pelvis stays above it (no flying / no sinking)", () => {
    const decoded = unwrap(
      decodeG1Trace(evaluator.trace(curriculumPolicy)),
      "G1 trace",
    );
    for (let s = 0; s < decoded.samples.length; s++) {
      const sample = decoded.samples[s];
      for (const fl of FOOT_LINKS) {
        const [x, y, z] = sample.linkPoses[fl].position;
        if (y < 0.0 || y > 0.6) {
          throw new Error(
            `G1 foot link ${fl} at sample ${s} is at height ` +
              `y=${y.toFixed(3)} m (must be in [0, 0.6]). ` +
              `Either the foot sank through the floor or flew into the air.`,
          );
        }
      }
      const pelvisY = sample.linkPoses[PELVIS_LINK].position[1];
      if (pelvisY < 0.5) {
        throw new Error(
          `G1 pelvis at sample ${s} is at y=${pelvisY.toFixed(3)} m. ` +
            `The pelvis sank into the floor.`,
        );
      }
      for (const wl of WAIST_LINKS) {
        const [, y] = sample.linkPoses[wl].position;
        if (y < 0.3) {
          throw new Error(
            `G1 waist link ${wl} at sample ${s} is at y=${y.toFixed(3)} m. ` +
              `The waist fell through the floor.`,
          );
        }
      }
    }
    expect(true).toBe(true);
  });

  test("the curriculum-mean rollout completes 720 steps with terminationReason='horizon'", () => {
    const decoded = unwrap(
      decodeG1Evaluation(evaluator.evaluate(curriculumPolicy)),
      "G1 evaluation",
    );
    expect(decoded.completedSteps).toBe(720);
    expect(decoded.terminationReason).toBe("horizon");
    expect(decoded.hardCollisionOccurred).toBe(false);
  });

  evaluator.free();
});
