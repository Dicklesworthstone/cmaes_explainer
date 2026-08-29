import { describe, expect, test } from "bun:test";
import {
  BrowserPhysicsAdapter,
  type KernelManifest,
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
});
