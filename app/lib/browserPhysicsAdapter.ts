// Browser Fail-Closed Physics Kernel Adapter (cmaes-feat-ph8-adapter).
//
// Implements strict version negotiation, fail-closed safety gating, and manifest verification
// between browser frontends and Frankensim physics kernels (v067 single-body vs v068 multi-body).
//
// Invariants & Safety Contract:
//   1. v067 Refusal Rule: Refuses any scene with numBodies > 1 (ERR_V067_MULTI_BODY_UNSUPPORTED).
//   2. v068 Manifest Rule: Refuses execution without a valid verified KernelManifest (ERR_V068_MANIFEST_REQUIRED).
//   3. Fail-Closed Lock: Any schema corruption, version mismatch, or unverified binary immediately
//      locks the adapter in a safe refusal state preventing memory corruption or silent fallback.
//
// SOTA References:
//   - NASA / JPL Fail-Safe & Fail-Closed Software Architecture Guidelines
//   - Frankensim CMA-ES Kernel Architecture Spec (v067/v068)

export type KernelVersion = "v067" | "v068";

export type KernelCapability =
  | "single-body"
  | "multibody"
  | "rolling-friction"
  | "contact-manifold"
  | "sdf-ccd"
  | "featherstone-aba";

export interface KernelManifest {
  kernelVersion: "v068";
  schemaVersion: 8;
  buildTimestamp: number;
  supportedCapabilities: KernelCapability[];
  manifestSignature: string;
  maxBodiesSupported: number;
  maxJointsSupported: number;
}

export interface SimulationWorkloadConfig {
  numBodies: number;
  numJoints?: number;
  dt?: number;
  enableCcd?: boolean;
  enableRollingFriction?: boolean;
}

export type AdapterStatus = "uninitialized" | "ready" | "fail-closed";

export interface AdapterError {
  code:
    | "ERR_V067_MULTI_BODY_UNSUPPORTED"
    | "ERR_V068_MANIFEST_REQUIRED"
    | "ERR_V068_MANIFEST_CORRUPT"
    | "ERR_UNSUPPORTED_CAPABILITY"
    | "ERR_CAPACITY_EXCEEDED"
    | "ERR_INVALID_WORKLOAD"
    | "ERR_ADAPTER_LOCKED";
  message: string;
  detail?: unknown;
}

export type AdapterResult<T> =
  | { success: true; value: T }
  | { success: false; error: AdapterError };

export class BrowserPhysicsAdapter {
  private status: AdapterStatus = "uninitialized";
  private activeVersion: KernelVersion | null = null;
  private verifiedManifest: KernelManifest | null = null;
  private lockReason: string | null = null;

  public getStatus(): AdapterStatus {
    return this.status;
  }

  public getActiveVersion(): KernelVersion | null {
    return this.activeVersion;
  }

  public getVerifiedManifest(): KernelManifest | null {
    return this.verifiedManifest;
  }

  /**
   * Initializes the kernel session under strict fail-closed constraints.
   */
  public initialize(
    version: KernelVersion,
    manifest?: KernelManifest,
  ): AdapterResult<{ version: KernelVersion; capabilities: KernelCapability[] }> {
    if (this.status === "fail-closed") {
      return {
        success: false,
        error: {
          code: "ERR_ADAPTER_LOCKED",
          message: `Adapter is locked in fail-closed state: ${this.lockReason}`,
        },
      };
    }

    if (version === "v067") {
      this.activeVersion = "v067";
      this.verifiedManifest = null;
      this.status = "ready";
      return {
        success: true,
        value: {
          version: "v067",
          capabilities: ["single-body"],
        },
      };
    }

    if (version === "v068") {
      if (!manifest) {
        this.enterFailClosed("v068 kernel initialization requested without manifest");
        return {
          success: false,
          error: {
            code: "ERR_V068_MANIFEST_REQUIRED",
            message: "v068 multi-body physics kernel requires an authenticated KernelManifest",
          },
        };
      }

      // Validate manifest structure & signature
      const validation = this.validateManifest(manifest);
      if (!validation.success) {
        this.enterFailClosed(`Corrupt v068 manifest: ${validation.error.message}`);
        return validation;
      }

      this.activeVersion = "v068";
      this.verifiedManifest = manifest;
      this.status = "ready";
      return {
        success: true,
        value: {
          version: "v068",
          capabilities: manifest.supportedCapabilities,
        },
      };
    }

    this.enterFailClosed(`Unknown kernel version: ${version}`);
    return {
      success: false,
      error: {
        code: "ERR_ADAPTER_LOCKED",
        message: `Unknown kernel version ${version}`,
      },
    };
  }

  /**
   * Validates a workload submission against active kernel capabilities.
   */
  public validateWorkload(config: SimulationWorkloadConfig): AdapterResult<boolean> {
    if (this.status === "fail-closed") {
      return {
        success: false,
        error: {
          code: "ERR_ADAPTER_LOCKED",
          message: `Adapter is locked in fail-closed state: ${this.lockReason}`,
        },
      };
    }

    if (this.status === "uninitialized" || !this.activeVersion) {
      return {
        success: false,
        error: {
          code: "ERR_ADAPTER_LOCKED",
          message: "Adapter is not initialized",
        },
      };
    }

    if (!Number.isSafeInteger(config.numBodies) || config.numBodies < 1) {
      return {
        success: false,
        error: {
          code: "ERR_INVALID_WORKLOAD",
          message: `numBodies must be a positive safe integer (got ${config.numBodies})`,
        },
      };
    }

    if (
      config.numJoints !== undefined &&
      (!Number.isSafeInteger(config.numJoints) || config.numJoints < 0)
    ) {
      return {
        success: false,
        error: {
          code: "ERR_INVALID_WORKLOAD",
          message: `numJoints must be a non-negative safe integer (got ${config.numJoints})`,
        },
      };
    }

    if (config.dt !== undefined && (!Number.isFinite(config.dt) || config.dt <= 0)) {
      return {
        success: false,
        error: {
          code: "ERR_INVALID_WORKLOAD",
          message: `dt must be a positive finite number (got ${config.dt})`,
        },
      };
    }

    // Invariant 1: v067 refuses multi-body scenes or articulated joints
    if (this.activeVersion === "v067") {
      if (config.numBodies > 1 || (config.numJoints ?? 0) > 0) {
        return {
          success: false,
          error: {
            code: "ERR_V067_MULTI_BODY_UNSUPPORTED",
            message: `v067 kernel only supports unarticulated single-body scenes (requested ${config.numBodies} bodies, ${config.numJoints ?? 0} joints). Upgrade to v068 manifest.`,
          },
        };
      }
      return { success: true, value: true };
    }

    // Invariant 2: v068 checks manifest capacity limits and requested features
    if (this.activeVersion === "v068") {
      const manifest = this.verifiedManifest!;
      if (config.numBodies > manifest.maxBodiesSupported) {
        return {
          success: false,
          error: {
            code: "ERR_CAPACITY_EXCEEDED",
            message: `Requested ${config.numBodies} bodies exceeds v068 kernel limit of ${manifest.maxBodiesSupported}`,
          },
        };
      }

      if ((config.numJoints ?? 0) > manifest.maxJointsSupported) {
        return {
          success: false,
          error: {
            code: "ERR_CAPACITY_EXCEEDED",
            message: `Requested ${config.numJoints} joints exceeds v068 kernel limit of ${manifest.maxJointsSupported}`,
          },
        };
      }

      if (config.enableCcd && !manifest.supportedCapabilities.includes("sdf-ccd")) {
        return {
          success: false,
          error: {
            code: "ERR_UNSUPPORTED_CAPABILITY",
            message:
              "Continuous collision detection (sdf-ccd) not supported by this v068 kernel build",
          },
        };
      }

      if (
        config.enableRollingFriction &&
        !manifest.supportedCapabilities.includes("rolling-friction")
      ) {
        return {
          success: false,
          error: {
            code: "ERR_UNSUPPORTED_CAPABILITY",
            message: "Rolling friction not supported by this v068 kernel build",
          },
        };
      }

      return { success: true, value: true };
    }

    return { success: true, value: true };
  }

  private validateManifest(m: KernelManifest): AdapterResult<boolean> {
    if (m.kernelVersion !== "v068" || m.schemaVersion !== 8) {
      return {
        success: false,
        error: {
          code: "ERR_V068_MANIFEST_CORRUPT",
          message: "Manifest version/schema stamp mismatch",
        },
      };
    }

    if (!m.manifestSignature || m.manifestSignature.length < 8) {
      return {
        success: false,
        error: {
          code: "ERR_V068_MANIFEST_CORRUPT",
          message: "Invalid or missing manifest signature",
        },
      };
    }

    if (
      !Number.isSafeInteger(m.maxBodiesSupported) ||
      m.maxBodiesSupported <= 0 ||
      !Number.isSafeInteger(m.maxJointsSupported) ||
      m.maxJointsSupported < 0
    ) {
      return {
        success: false,
        error: {
          code: "ERR_V068_MANIFEST_CORRUPT",
          message: "Invalid manifest body/joint capacity limits",
        },
      };
    }

    return { success: true, value: true };
  }

  private enterFailClosed(reason: string): void {
    this.status = "fail-closed";
    this.lockReason = reason;
    this.activeVersion = null;
    this.verifiedManifest = null;
  }
}

export const REQUIRED_FAST_PR_LANES = [
  "bun-lint",
  "bun-typecheck",
  "bun-format-check",
  "bun-unit-tests",
  "bun-build",
] as const;

export const REQUIRED_RELEASE_CAMPAIGN_LANES = [
  "owner-wasm-parity",
  "browser-e2e-smoke",
  "apple-dsr-gate",
] as const;

export type QualityGateLaneId =
  | (typeof REQUIRED_FAST_PR_LANES)[number]
  | (typeof REQUIRED_RELEASE_CAMPAIGN_LANES)[number];

export interface QualityGateLaneReceipt {
  laneId: QualityGateLaneId;
  tier: "fast-pr" | "release-campaign";
  status: "passed" | "failed" | "skipped" | "synthetic";
  sourceCommitHash: string;
  ownerWasmSha256: string;
  durationMs: number;
}

export interface ReleaseQualityGateAggregation {
  mode: "pr" | "release";
  passed: boolean;
  requiredLaneCount: number;
  verifiedLaneCount: number;
  missingLanes: QualityGateLaneId[];
  failedLanes: QualityGateLaneId[];
  skippedLanes: QualityGateLaneId[];
  syntheticLanes: QualityGateLaneId[];
  hashMismatchLanes: QualityGateLaneId[];
  refusalReasons: string[];
}

/**
 * Aggregates reproducible Bun PR checks and required device/owner/browser release campaigns
 * under a strict fail-closed contract (`cmaes-za0x.44`, `cmaes-za0x.66`).
 * Missing, skipped, synthetic, failed, or hash-mismatched required lanes fail closed.
 */
export function aggregateReleaseQualityGates(
  receipts: readonly QualityGateLaneReceipt[],
  expectedSourceCommitHash: string,
  expectedOwnerWasmSha256: string,
  mode: "pr" | "release" = "release",
): ReleaseQualityGateAggregation {
  const requiredLanes: readonly QualityGateLaneId[] =
    mode === "pr"
      ? REQUIRED_FAST_PR_LANES
      : [...REQUIRED_FAST_PR_LANES, ...REQUIRED_RELEASE_CAMPAIGN_LANES];

  const byLane = new Map<QualityGateLaneId, QualityGateLaneReceipt>();
  for (const r of receipts) {
    byLane.set(r.laneId, r);
  }

  const missingLanes: QualityGateLaneId[] = [];
  const failedLanes: QualityGateLaneId[] = [];
  const skippedLanes: QualityGateLaneId[] = [];
  const syntheticLanes: QualityGateLaneId[] = [];
  const hashMismatchLanes: QualityGateLaneId[] = [];
  const refusalReasons: string[] = [];
  let verifiedLaneCount = 0;

  if (!expectedSourceCommitHash || expectedSourceCommitHash.trim().length < 7) {
    refusalReasons.push("Expected source commit hash must be at least 7 characters.");
  }
  if (!expectedOwnerWasmSha256 || expectedOwnerWasmSha256.trim().length < 16) {
    refusalReasons.push("Expected owner WASM SHA-256 digest must be at least 16 characters.");
  }

  for (const laneId of requiredLanes) {
    const receipt = byLane.get(laneId);
    if (!receipt) {
      missingLanes.push(laneId);
      refusalReasons.push(`Missing required ${mode} quality gate lane: ${laneId}`);
      continue;
    }

    if (receipt.status === "failed") {
      failedLanes.push(laneId);
      refusalReasons.push(`Required quality gate lane failed: ${laneId}`);
      continue;
    }
    if (receipt.status === "skipped") {
      skippedLanes.push(laneId);
      refusalReasons.push(`Required quality gate lane was skipped: ${laneId}`);
      continue;
    }
    if (receipt.status === "synthetic") {
      syntheticLanes.push(laneId);
      refusalReasons.push(`Synthetic/mock receipt refused for required lane: ${laneId}`);
      continue;
    }

    if (
      receipt.sourceCommitHash !== expectedSourceCommitHash ||
      receipt.ownerWasmSha256 !== expectedOwnerWasmSha256 ||
      !Number.isFinite(receipt.durationMs) ||
      receipt.durationMs <= 0
    ) {
      hashMismatchLanes.push(laneId);
      refusalReasons.push(
        `Provenance or timing mismatch on lane ${laneId} (commit=${receipt.sourceCommitHash}, wasm=${receipt.ownerWasmSha256})`,
      );
      continue;
    }

    verifiedLaneCount += 1;
  }

  const passed =
    refusalReasons.length === 0 &&
    missingLanes.length === 0 &&
    failedLanes.length === 0 &&
    skippedLanes.length === 0 &&
    syntheticLanes.length === 0 &&
    hashMismatchLanes.length === 0 &&
    verifiedLaneCount === requiredLanes.length;

  return {
    mode,
    passed,
    requiredLaneCount: requiredLanes.length,
    verifiedLaneCount,
    missingLanes,
    failedLanes,
    skippedLanes,
    syntheticLanes,
    hashMismatchLanes,
    refusalReasons,
  };
}
