import { describe, expect, test } from "bun:test";
import { Euler, Quaternion, Vector3 } from "three";
import { iiwaJointAnglesFromOwnerPoses } from "../app/lib/armInverseKinematics";
import {
  buildHouseholdManipulationConfig,
  decodeHouseholdManipulationTrace,
  DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
} from "../app/lib/frankensimCmaes";
import {
  advanceArmPlayback,
  clampArmPlaybackIndex,
} from "../app/components/HouseholdArmFlagship";

describe("arm trace playback", () => {
  const sampleTimes = [0, 0.25, 0.5, 0.75, 1] as const;

  test("clamps externally requested samples to a real trace sample", () => {
    expect(clampArmPlaybackIndex(5, -4)).toBe(0);
    expect(clampArmPlaybackIndex(5, 2.4)).toBe(2);
    expect(clampArmPlaybackIndex(5, 99)).toBe(4);
    expect(clampArmPlaybackIndex(5, Number.NaN)).toBe(0);
    expect(clampArmPlaybackIndex(0, 3)).toBe(0);
  });

  test("does not move a paused trace", () => {
    expect(advanceArmPlayback(sampleTimes, 2, 0.5, 0.1, 2, false)).toEqual({
      sampleIndex: 2,
      elapsedSeconds: 0.5,
      wrapped: false,
    });
  });

  test("advances the sample and elapsed time at the selected speed", () => {
    expect(advanceArmPlayback(sampleTimes, 0, 0, 0.1, 1, true)).toEqual({
      sampleIndex: 0,
      elapsedSeconds: 0.1,
      wrapped: false,
    });
    expect(advanceArmPlayback(sampleTimes, 0, 0.2, 0.1, 2, true)).toEqual({
      sampleIndex: 1,
      elapsedSeconds: 0.4,
      wrapped: false,
    });
  });

  test("caps a long render frame so playback cannot skip an unsafe interval", () => {
    expect(advanceArmPlayback(sampleTimes, 0, 0, 4, 1, true)).toEqual({
      sampleIndex: 0,
      elapsedSeconds: 0.1,
      wrapped: false,
    });
  });

  test("renders the terminal sample before wrapping to the beginning", () => {
    expect(advanceArmPlayback(sampleTimes, 3, 0.9, 0.1, 1, true)).toEqual({
      sampleIndex: 4,
      elapsedSeconds: 1,
      wrapped: false,
    });
    expect(advanceArmPlayback(sampleTimes, 4, 1, 0.1, 1, true)).toEqual({
      sampleIndex: 0,
      elapsedSeconds: expect.closeTo(0.1),
      wrapped: true,
    });
  });

  test("returns a stable empty-trace state", () => {
    expect(advanceArmPlayback([], 8, 2, 0.1, 1, true)).toEqual({
      sampleIndex: 0,
      elapsedSeconds: 0,
      wrapped: false,
    });
  });

  test("keeps a single-sample trace stable while playback is enabled", () => {
    expect(advanceArmPlayback([0], 7, 4, 0.1, 2, true)).toEqual({
      sampleIndex: 0,
      elapsedSeconds: 0,
      wrapped: false,
    });
  });
});

describe("source iiwa joint readout", () => {
  // Transcribed independently from the source URDF origin rotations. Build
  // forward rotations by composing axes; the readout must undo them.
  const origins = [
    [0, 0, 0],
    [Math.PI / 2, 0, Math.PI],
    [Math.PI / 2, 0, Math.PI],
    [Math.PI / 2, 0, 0],
    [-Math.PI / 2, Math.PI, 0],
    [Math.PI / 2, 0, 0],
    [-Math.PI / 2, Math.PI, 0],
  ];
  function pose(q: Quaternion, sign = 1) {
    return {
      quaternionWxyz: [q.w * sign, q.x * sign, q.y * sign, q.z * sign] as [
        number,
        number,
        number,
        number,
      ],
    };
  }
  function forward(angles: number[], base: Quaternion) {
    const poses = [pose(base)];
    let q = base.clone();
    for (let i = 0; i < angles.length; i++) {
      const [roll, pitch, yaw] = origins[i];
      q = q
        .clone()
        .multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), yaw))
        .multiply(
          new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), pitch),
        )
        .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), roll))
        .multiply(
          new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), angles[i]),
        );
      poses.push(pose(q, i % 2 === 0 ? -1 : 1));
    }
    return poses;
  }

  test("recovers all seven independent angles under arbitrary world rotations and quaternion signs", () => {
    for (let seed = 0; seed < 64; seed++) {
      const angles = [0, 1, 2, 3, 4, 5, 6].map(
        (i) => Math.sin(seed * 1.37 + i * 2.19) * (i % 2 ? 1.9 : 2.8),
      );
      const base = new Quaternion().setFromEuler(
        new Euler(seed * 0.31, seed * 0.53, seed * -0.71),
      );
      const actual = iiwaJointAnglesFromOwnerPoses(forward(angles, base));
      actual.forEach((angle, index) =>
        expect(angle).toBeCloseTo(angles[index], 11),
      );
    }
  });

  test("refuses the wrong topology, malformed rotations, and a non-joint-axis rotation", () => {
    expect(() => iiwaJointAnglesFromOwnerPoses([])).toThrow("eight");
    const poses = forward(
      [0.1, -0.2, 0.3, -0.4, 0.5, -0.6, 0.7],
      new Quaternion(),
    );
    const bad = poses.map((p) => ({
      quaternionWxyz: [...p.quaternionWxyz] as [number, number, number, number],
    }));
    bad[3].quaternionWxyz[0] = NaN;
    expect(() => iiwaJointAnglesFromOwnerPoses(bad)).toThrow("unit");
    [poses[2], poses[4]] = [poses[4], poses[2]];
    expect(() => iiwaJointAnglesFromOwnerPoses(poses)).toThrow(
      "source joint frame",
    );
  });

  test("reconstructs the rotations in every sample of three actual owner task traces", async () => {
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
    for (const task of [
      "kitchen-mug",
      "living-room-remote",
      "backyard-trowel",
    ] as const) {
      const evaluator = new owner.HouseholdManipulationVizEvaluator(
        buildHouseholdManipulationConfig({
          ...DEFAULT_HOUSEHOLD_MANIPULATION_CONFIG,
          task,
        }),
      );
      try {
        const result = decodeHouseholdManipulationTrace(
          evaluator.trace(evaluator.curriculum_policy_mean()),
        );
        if (!("ok" in result)) throw new Error(result.refusal.name);
        expect(result.ok.samples.length).toBeGreaterThan(1);
        for (const sample of result.ok.samples) {
          const angles = iiwaJointAnglesFromOwnerPoses(sample.linkPoses);
          const [w, x, y, z] = sample.linkPoses[0].quaternionWxyz;
          const reconstructed = forward(angles, new Quaternion(x, y, z, w));
          reconstructed.forEach((p, index) => {
            const actual = sample.linkPoses[index].quaternionWxyz;
            const dot = p.quaternionWxyz.reduce(
              (sum, value, j) => sum + value * actual[j],
              0,
            );
            expect(Math.abs(dot)).toBeCloseTo(1, 11);
          });
        }
      } finally {
        evaluator.free();
      }
    }
  });
});
