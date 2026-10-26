import { describe, expect, test } from "bun:test";
import {
  aggregateReleaseQualityGates,
  BrowserPhysicsAdapter,
  type KernelManifest,
  type QualityGateLaneReceipt,
  REQUIRED_FAST_PR_LANES,
  REQUIRED_RELEASE_CAMPAIGN_LANES,
} from "../app/lib/browserPhysicsAdapter";

describe("Browser Fail-Closed Physics Kernel Adapter", () => {
  const validV068Manifest: KernelManifest = {
    kernelVersion: "v068",
    schemaVersion: 8,
    buildTimestamp: Date.now(),
    supportedCapabilities: [
      "multibody",
      "rolling-friction",
      "contact-manifold",
      "sdf-ccd",
      "featherstone-aba",
    ],
    manifestSignature: "sig_sha256_abcdef1234567890",
    maxBodiesSupported: 128,
    maxJointsSupported: 64,
  };

  test("v067 initialization succeeds for single-body scenes", () => {
    const adapter = new BrowserPhysicsAdapter();
    const res = adapter.initialize("v067");

    expect(res.success).toBe(true);
    if (!res.success) return;
    expect(res.value.version).toBe("v067");
    expect(res.value.capabilities).toEqual(["single-body"]);

    const singleBody = adapter.validateWorkload({ numBodies: 1 });
    expect(singleBody.success).toBe(true);
  });

  test("v067 strictly refuses multi-body configurations", () => {
    const adapter = new BrowserPhysicsAdapter();
    adapter.initialize("v067");

    const multiBody = adapter.validateWorkload({ numBodies: 4 });
    expect(multiBody.success).toBe(false);
    if (multiBody.success) return;
    expect(multiBody.error.code).toBe("ERR_V067_MULTI_BODY_UNSUPPORTED");
  });

  test("v068 initialization without manifest enters fail-closed state", () => {
    const adapter = new BrowserPhysicsAdapter();
    const res = adapter.initialize("v068");

    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.error.code).toBe("ERR_V068_MANIFEST_REQUIRED");
    expect(adapter.getStatus()).toBe("fail-closed");

    // Subsequent actions should be locked
    const retry = adapter.validateWorkload({ numBodies: 1 });
    expect(retry.success).toBe(false);
    if (retry.success) return;
    expect(retry.error.code).toBe("ERR_ADAPTER_LOCKED");
  });

  test("v068 with valid manifest supports multi-body workloads within capacity", () => {
    const adapter = new BrowserPhysicsAdapter();
    const res = adapter.initialize("v068", validV068Manifest);

    expect(res.success).toBe(true);
    if (!res.success) return;
    expect(res.value.capabilities).toContain("multibody");

    const multiBody = adapter.validateWorkload({
      numBodies: 32,
      numJoints: 16,
      enableCcd: true,
    });
    expect(multiBody.success).toBe(true);

    // Over-capacity submission is rejected
    const overCapacity = adapter.validateWorkload({ numBodies: 256 });
    expect(overCapacity.success).toBe(false);
    if (overCapacity.success) return;
    expect(overCapacity.error.code).toBe("ERR_CAPACITY_EXCEEDED");
  });

  test("rejects corrupted manifest and locks adapter in fail-closed state", () => {
    const adapter = new BrowserPhysicsAdapter();
    const corruptedManifest = {
      ...validV068Manifest,
      schemaVersion: 7 as any, // Schema 7 on v068 kernel is invalid
    };

    const res = adapter.initialize("v068", corruptedManifest);
    expect(res.success).toBe(false);
    if (res.success) return;
    expect(res.error.code).toBe("ERR_V068_MANIFEST_CORRUPT");
    expect(adapter.getStatus()).toBe("fail-closed");
  });

  test("rejects malformed workload configs (zero/negative/NaN bodies, negative joints, non-positive dt)", () => {
    const adapter = new BrowserPhysicsAdapter();
    adapter.initialize("v068", validV068Manifest);

    for (const badBodies of [0, -2, 1.5, Number.NaN]) {
      const res = adapter.validateWorkload({ numBodies: badBodies });
      expect(res.success).toBe(false);
      if (!res.success) expect(res.error.code).toBe("ERR_INVALID_WORKLOAD");
    }

    for (const badJoints of [-1, 2.5, Number.NaN]) {
      const res = adapter.validateWorkload({ numBodies: 1, numJoints: badJoints });
      expect(res.success).toBe(false);
      if (!res.success) expect(res.error.code).toBe("ERR_INVALID_WORKLOAD");
    }

    for (const badDt of [0, -0.01, Number.NaN, Number.POSITIVE_INFINITY]) {
      const res = adapter.validateWorkload({ numBodies: 1, dt: badDt });
      expect(res.success).toBe(false);
      if (!res.success) expect(res.error.code).toBe("ERR_INVALID_WORKLOAD");
    }
  });

  test("aggregateReleaseQualityGates separates fast PR checks from required release campaigns and fails closed on missing, skipped, synthetic, or hash-mismatched lanes", () => {
    const commit = "b69bf3f1234";
    const wasmSha = "sha256:frankensim-v068-schema8-verified";

    const prReceipts: QualityGateLaneReceipt[] = REQUIRED_FAST_PR_LANES.map((laneId, i) => ({
      laneId,
      tier: "fast-pr",
      status: "passed",
      sourceCommitHash: commit,
      ownerWasmSha256: wasmSha,
      durationMs: 100 + i * 20,
    }));

    const prEval = aggregateReleaseQualityGates(prReceipts, commit, wasmSha, "pr");
    expect(prEval.passed).toBe(true);
    expect(prEval.verifiedLaneCount).toBe(REQUIRED_FAST_PR_LANES.length);
    expect(prEval.missingLanes).toEqual([]);

    // Release mode fails closed when required release campaigns are missing
    const missingReleaseEval = aggregateReleaseQualityGates(prReceipts, commit, wasmSha, "release");
    expect(missingReleaseEval.passed).toBe(false);
    expect(missingReleaseEval.missingLanes).toEqual([...REQUIRED_RELEASE_CAMPAIGN_LANES]);

    // Release mode fails closed when a campaign lane is synthetic or skipped
    const syntheticReleaseEval = aggregateReleaseQualityGates(
      [
        ...prReceipts,
        {
          laneId: "owner-wasm-parity",
          tier: "release-campaign",
          status: "passed",
          sourceCommitHash: commit,
          ownerWasmSha256: wasmSha,
          durationMs: 500,
        },
        {
          laneId: "browser-e2e-smoke",
          tier: "release-campaign",
          status: "synthetic",
          sourceCommitHash: commit,
          ownerWasmSha256: wasmSha,
          durationMs: 500,
        },
        {
          laneId: "apple-dsr-gate",
          tier: "release-campaign",
          status: "skipped",
          sourceCommitHash: commit,
          ownerWasmSha256: wasmSha,
          durationMs: 500,
        },
      ],
      commit,
      wasmSha,
      "release",
    );
    expect(syntheticReleaseEval.passed).toBe(false);
    expect(syntheticReleaseEval.syntheticLanes).toEqual(["browser-e2e-smoke"]);
    expect(syntheticReleaseEval.skippedLanes).toEqual(["apple-dsr-gate"]);

    // Full release passes only when every PR + release campaign lane is real, passed, and hash-bound
    const fullReleaseEval = aggregateReleaseQualityGates(
      [
        ...prReceipts,
        ...REQUIRED_RELEASE_CAMPAIGN_LANES.map((laneId) => ({
          laneId,
          tier: "release-campaign" as const,
          status: "passed" as const,
          sourceCommitHash: commit,
          ownerWasmSha256: wasmSha,
          durationMs: 650,
        })),
      ],
      commit,
      wasmSha,
      "release",
    );
    expect(fullReleaseEval.passed).toBe(true);
    expect(fullReleaseEval.verifiedLaneCount).toBe(
      REQUIRED_FAST_PR_LANES.length + REQUIRED_RELEASE_CAMPAIGN_LANES.length,
    );
  });
});
