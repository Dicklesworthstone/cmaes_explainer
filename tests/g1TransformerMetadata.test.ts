import { describe, expect, test } from "bun:test";
import fs from "fs";
import path from "path";

describe("G1 Transformer Policy Metadata & Browser Inference Manifest", () => {
  test("metadata.json exists and conforms to the G1 walking flagship contract", () => {
    const metaPath = path.join(
      process.cwd(),
      "public/robots/g1/transformer/metadata.json",
    );
    expect(fs.existsSync(metaPath)).toBe(true);

    const raw = fs.readFileSync(metaPath, "utf-8");
    const meta = JSON.parse(raw);

    // FSGT = FrankenSim Gait Transformer (custom binary format; ONNX was
    // the original plan, FSGT is what fs-g1-train actually produces).
    // The fail-closed loader is app/lib/gaitTransformer.ts.
    expect(meta.model_name).toBe("g1-transformer-locomotion-policy-v2");
    expect(meta.format).toMatch(/^FSGT-Weights-v1/);
    expect(meta.sequence_length).toBe(64);
    expect(meta.observation_dim).toBe(42);
    expect(meta.action_dim).toBe(29);
    expect(meta.weights_file).toBe("g1-ablation-weights-v1.bin");
    expect(meta.training_receipt).toBe("g1-ablation-train-receipt.json");
    expect(meta.golden_vectors).toBe("g1-ablation-golden.json");

    // Verify 42 observation signals layout
    expect(meta.obs_layout.length).toBe(42);
    expect(meta.obs_layout[0]).toBe("joint_pos_0_left_hip_pitch");
    expect(meta.obs_layout[41]).toBe("target_forward_speed");

    // Verify 29 action scaling factors
    expect(meta.action_scaling.length).toBe(29);
    for (const scale of meta.action_scaling) {
      expect(scale).toBeGreaterThan(0.0);
      expect(scale).toBeLessThanOrEqual(1.0);
    }

    // Verify joint limits
    expect(meta.joint_limits).toBeDefined();
    for (const [joint, limits] of Object.entries(meta.joint_limits)) {
      const [min, max] = limits as [number, number];
      expect(min).toBeLessThan(max);
    }

    // Verify training provenance (FSGT plan; the exact step count lives
    // in the training receipt JSON, not in this metadata file).
    expect(meta.training_metadata).toBeDefined();
    expect(meta.training_metadata.trainer).toMatch(/train_ablation\.rs/);
    expect(meta.training_metadata.inference_badge).toBeDefined();
    expect(meta.training_metadata.inference_badge.label).toMatch(/transformer/i);
    expect(meta.training_metadata.inference_badge.fallback_label).toBe(
      "transformer (weights unavailable — nothing is faked)"
    );
  });
});
