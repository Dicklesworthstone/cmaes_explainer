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

    expect(meta.model_name).toBe("g1-transformer-locomotion-policy-v1");
    expect(meta.format).toBe("ONNX-Float32-DynamicBatch");
    expect(meta.sequence_length).toBe(64);
    expect(meta.observation_dim).toBe(42);
    expect(meta.action_dim).toBe(29);

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

    // Verify training provenance
    expect(meta.training_metadata).toBeDefined();
    expect(meta.training_metadata.total_env_steps).toBe(38000000);
    expect(meta.training_metadata.inference_badge.label).toBe(
      "policy: transformer (GPU-trained)",
    );
  });
});
