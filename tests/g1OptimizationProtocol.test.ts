import { describe, expect, test } from "bun:test";
import {
  G1_DEFAULT_SEARCH_SIGMA,
  G1_HOUSE_SEAT,
  g1ExperimentForSeat,
  g1OptimizationConfig,
  g1OptimizationRunKey,
  g1ResolveSeat,
} from "../app/lib/g1OptimizationProtocol";
import { buildG1Config, decodeG1Trace } from "../app/lib/frankensimCmaes";

describe("G1 optimization task protocol", () => {
  test("uses the owner-calibrated fast-learning launch radius", () => {
    // Re-measured against wall time once runs became operator-bounded: 5e-4
    // beat 1e-3 for both memory families over equal wall time from the same
    // curriculum mean. See the constant's own note for the numbers.
    expect(G1_DEFAULT_SEARCH_SIGMA).toBe(0.0005);
  });

  test("builds an owner config for every task without mutating the other inputs", () => {
    for (const task of ["balance", "stepping", "walking"] as const) {
      const config = g1OptimizationConfig(task, "flat");
      expect(config.task).toBe(task);
      expect(config.challenge).toBe("flat");
      expect(config.durationSeconds).toBe(1.5);
      expect(config.traceStride).toBe(12);
    }
  });

  test("isolates continuation sessions across task, challenge, family, and seed", () => {
    const baseline = g1OptimizationRunKey(
      "walking",
      "terrain-and-push",
      "lm-cma",
      0,
    );
    const negativeControls = [
      g1OptimizationRunKey("balance", "terrain-and-push", "lm-cma", 0),
      g1OptimizationRunKey("stepping", "terrain-and-push", "lm-cma", 0),
      g1OptimizationRunKey("walking", "flat", "lm-cma", 0),
      g1OptimizationRunKey("walking", "terrain-and-push", "separable", 0),
      g1OptimizationRunKey("walking", "terrain-and-push", "lm-cma", 1),
      g1OptimizationRunKey(
        "walking",
        "terrain-and-push",
        "lm-cma",
        0,
        [0, 0, 0],
      ),
    ];

    expect(new Set([baseline, ...negativeControls]).size).toBe(7);
    expect(baseline).toBe(
      g1OptimizationRunKey("walking", "terrain-and-push", "lm-cma", 0, [
        ...G1_HOUSE_SEAT.offset,
      ]),
    );
  });

  test("binds the exact packet and placement to repeatable experiment identity", async () => {
    const original = await g1ExperimentForSeat("walking", "flat");
    const replay = await g1ExperimentForSeat("walking", "flat", [
      ...original.scene.seat,
    ]);
    const movedSeat: [number, number, number] = [
      original.scene.seat[0] + 0.05,
      0,
      original.scene.seat[2],
    ];
    const moved = await g1ExperimentForSeat("walking", "flat", movedSeat);
    const changedTask = await g1ExperimentForSeat("balance", "flat");
    const changedChallenge = await g1ExperimentForSeat(
      "walking",
      "terrain-and-push",
    );
    expect(original.scene).toEqual(replay.scene);
    expect(original.scene.digest).toMatch(/^[0-9a-f]{64}$/);
    expect(
      new Set(
        [original, moved, changedTask, changedChallenge].map(
          (e) => e.scene.digest,
        ),
      ).size,
    ).toBe(4);
    expect(moved.scene.seat).toEqual(movedSeat);
    expect(moved.scene.configWords).toEqual(
      Array.from(buildG1Config(moved.config)),
    );
    expect(moved.scene.configWords).not.toEqual(original.scene.configWords);
    expect(moved.scene.configWords.slice(0, 12)).toEqual(
      original.scene.configWords.slice(0, 12),
    );
    const floorBefore = original.config.obstacles![0];
    const floorAfter = moved.config.obstacles![0];
    expect(floorAfter.centerMeters[0]).toBeCloseTo(
      floorBefore.centerMeters[0] - 0.05,
      12,
    );
    expect(floorAfter.centerMeters.slice(1)).toEqual(
      floorBefore.centerMeters.slice(1),
    );
    // Returning a copied seat prevents a caller from mutating the default.
    movedSeat[0] += 10;
    expect(moved.scene.seat[0]).toBe(original.scene.seat[0] + 0.05);
  });

  test("refuses nonfinite and unsupported elevated placements", () => {
    for (const seat of [
      [NaN, 0, 0],
      [0, 0, Infinity],
      [0, 0.1, 0],
    ] as const) {
      expect(() => g1ResolveSeat(seat)).toThrow("on the floor");
      expect(() =>
        g1OptimizationRunKey("walking", "flat", "lm-ma", 0, seat),
      ).toThrow();
    }
  });

  test("replays the disclosed scene packets through the actual shipped owner", async () => {
    const owner =
      await import("../public/wasm/fs-cmaes/v0622/fs_cmaes_viz_wasm.js");
    await owner.default({
      module_or_path: await Bun.file(
        new URL(
          "../public/wasm/fs-cmaes/v0622/fs_cmaes_viz_wasm_bg.wasm",
          import.meta.url,
        ),
      ).arrayBuffer(),
    });
    const original = await g1ExperimentForSeat("walking", "flat");
    const moved = await g1ExperimentForSeat("walking", "flat", [0, 0, 0]);
    const outputs = [];
    for (const experiment of [original, moved]) {
      const evaluator = new owner.G1WalkingVizEvaluator(
        Float64Array.from(experiment.scene.configWords),
      );
      try {
        const packet = evaluator.trace(evaluator.walking_curriculum_mean());
        const receipt = decodeG1Trace(packet);
        expect("ok" in receipt).toBe(true);
        if (!("ok" in receipt)) throw new Error(receipt.refusal.name);
        expect(receipt.ok.samples.length).toBeGreaterThan(0);
        expect(receipt.ok.samples[0].linkPoses).toHaveLength(30);
        outputs.push(Array.from(packet));
      } finally {
        evaluator.free();
      }
    }
    // Placement is a causal input to the real owner's obstacle guard. This
    // catches an implementation that hashes a seat but evaluates the default.
    expect(outputs[0]).not.toEqual(outputs[1]);
  });
});
