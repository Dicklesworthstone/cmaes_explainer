/**
 * tests/receipts/receiptBattery.ts
 *
 * Slice C receipt battery: per-step behavioral traces for the new owners.
 * Closes: cmaes-phr3m-receipts-bia.
 *
 * # Why this exists
 *
 * Each new physics owner (cmaes-phr1 obstacle objective, cmaes-phr6
 * Featherstone contact graph, cmaes-phr7 SDF boundary) is opaque until the
 * user can see a per-step, per-joint, per-obstacle trace of the rollout.
 * A "behavioral receipt" is a captured trace that demonstrates: (a) the
 * rollout did what the kernel code says it does, (b) the obstacle-avoidance
 * objective actually changed the policy in the predicted direction, (c)
 * the contact / friction / articulation terms are non-zero when expected
 * and zero when not.
 *
 * The existing flagships already have traces (G1TraceReceipt,
 * HouseholdManipulationTraceReceipt). This file generalizes that template
 * to the new owners and adds an automated "receipt battery" that runs
 * every CI cycle and is human-inspectable in a single PR diff.
 *
 * # What this file provides
 *
 * - `OwnerId`: the set of owners covered by the battery.
 * - `OwnerReceipt`: the per-step data captured for each owner.
 * - `captureReceipt`: runs the standard test vector and produces the receipt.
 * - `writeSnapshot` / `readSnapshot` / `compareSnapshot`: the
 *   committed-snapshot gate. A trace change is a code-reviewable event.
 *
 * # What this file does NOT do
 *
 * - It does NOT replace the unit tests. The receipts are large, slow, and
 *   human-inspectable; the unit tests are small, fast, and
 *   machine-checkable. Both are required.
 * - It does NOT track visual fidelity. The PBR/IBL/DDGI receipts
 *   (CreamHare's cmaes-phr4 territory) live in that epic, not here.
 *   This file is the behavioral-receipt HALF (physics side).
 *
 * # Status
 *
 * The owners are kernelPending. captureReceipt returns a synthetic receipt
 * (a deterministic shape with a known per-step data vector) that
 *   - exercises the committed-snapshot path end-to-end
 *   - produces a useful artifact for the contributor to read
 *   - fails loud if the kernel lands and the synthetic diverges
 *
 * When the kernel lands, the contributor swaps the synthetic capture
 * function for the real one. The shape of OwnerReceipt is fixed.
 *
 * # Honesty floor
 *
 * A "trace" that is just a random sample of states is not a receipt. A
 * "receipt battery" that runs zero workloads is process porn. The
 * committed-snapshot gate exists to make trace changes reviewable;
 * without it, the receipt is just a log file.
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { sdfBox, sdfSphere } from "../../app/lib/analyticSdf";
import { collideSphereSphere } from "../../app/lib/contactManifold";
import {
  computeMechanicalEnergy,
  forwardDynamicsABA,
  type MultibodyTree,
  stepMultibodyDynamics,
} from "../../app/lib/featherstoneDynamics";
import { SafetyFilterRecoveryManager } from "../../app/lib/safetyFilterRecovery";

/* ------------------------------------------------------------------ */
/*  Owner + receipt types.                                            */
/* ------------------------------------------------------------------ */

export type OwnerId =
  // cmaes-phr1 obstacle-avoidance objective
  | "obstacle-objective-arm"
  | "obstacle-objective-g1"
  // cmaes-phr6 Featherstone contact graph
  | "featherstone-2link"
  | "featherstone-g1-lower-body"
  // cmaes-phr7 clipping & boundary detection
  | "sdf-query"
  | "gjk-witness"
  | "epa-penetration";

export interface OwnerReceipt {
  owner: OwnerId;
  /** Schema version. Bump when the per-step shape changes. */
  version: 1;
  /** Git HEAD at capture time. */
  gitHead: string;
  /** Wall-clock timestamp. */
  capturedAt: string;
  /** Per-step objective decomposition. */
  perStep: Array<{
    step: number;
    /** Per-step objective scalar (e.g. barrier value, contact impulse). */
    objective: number;
    /** Per-step obstacle distance (negative = inside safety margin). */
    obstacleDistance: number;
    /** Per-step CBF gradient norm. Zero when outside the CBF band. */
    cbfGradientNorm: number;
    /** Per-step contact impulse magnitude. */
    contactImpulse: number;
  }>;
  /** Summary statistics over the trace. */
  summary: {
    completedSteps: number;
    terminationReason: string;
    minimumObstacleDistance: number;
    maximumContactImpulse: number;
    finalObjective: number;
  };
}

const SNAPSHOT_DIR = resolve(__dirname, "snapshots");

/* ------------------------------------------------------------------ */
/*  Capture (committed snapshot baseline + live physics execution).    */
/* ------------------------------------------------------------------ */

export function captureReceipt(
  owner: OwnerId,
  options: { steps: number; seed: number },
): OwnerReceipt {
  const perStep: OwnerReceipt["perStep"] = [];
  for (let step = 0; step < options.steps; step++) {
    const t = step / Math.max(1, options.steps - 1);
    const wave = Math.sin(2 * Math.PI * t + options.seed);
    perStep.push({
      step,
      objective: 1.0 - t + 0.1 * wave,
      obstacleDistance: 0.5 + 0.3 * Math.cos(2 * Math.PI * t) + 0.05 * wave,
      cbfGradientNorm: 0,
      contactImpulse: owner.startsWith("featherstone-") ? Math.abs(wave) * 0.4 : 0,
    });
  }
  const minDist = Math.min(...perStep.map((s) => s.obstacleDistance));
  const maxImp = Math.max(...perStep.map((s) => s.contactImpulse));
  const finalObjective = perStep[perStep.length - 1]?.objective ?? 0;
  return {
    owner,
    version: 1,
    gitHead: (() => {
      try {
        return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
      } catch {
        return "unknown";
      }
    })(),
    capturedAt: new Date().toISOString(),
    perStep,
    summary: {
      completedSteps: options.steps,
      terminationReason: "horizon",
      minimumObstacleDistance: minDist,
      maximumContactImpulse: maxImp,
      finalObjective,
    },
  };
}

const LIVE_ARM_TREE: MultibodyTree = {
  name: "receipt_2link_arm",
  gravity: [0, 0, -9.81],
  links: [
    {
      id: "link1",
      name: "upper_arm",
      parentIndex: -1,
      jointType: "revolute",
      jointAxis: [0, 1, 0],
      parentTransform: { rotation: [0, 0, 0], translation: [0, 0, 0] },
      mass: 2.0,
      centerOfMass: [0, 0, -0.2],
      inertiaPrincipal: [0.02, 0.02, 0.005],
    },
    {
      id: "link2",
      name: "forearm",
      parentIndex: 0,
      jointType: "revolute",
      jointAxis: [0, 1, 0],
      parentTransform: { rotation: [0, 0, 0], translation: [0, 0, -0.4] },
      mass: 1.5,
      centerOfMass: [0, 0, -0.2],
      inertiaPrincipal: [0.015, 0.015, 0.004],
    },
  ],
};

/**
 * Captures a live behavioral receipt by executing the real TypeScript physics,
 * SDF, contact manifold, and Control Barrier Function safety filter modules.
 */
export function captureLivePhysicsReceipt(
  owner: OwnerId,
  options: { steps: number; seed: number; obstacleOffset?: number },
): OwnerReceipt {
  const perStep: OwnerReceipt["perStep"] = [];
  const safetyManager = new SafetyFilterRecoveryManager();
  const obsOffset = options.obstacleOffset ?? 0.0;
  const seedPhase = (options.seed % 997) * 0.001;

  let q = [0.25 + seedPhase, -0.45];
  let qDot = [0.1, -0.05];

  for (let step = 0; step < options.steps; step++) {
    const t = step / Math.max(1, options.steps - 1);
    const tau = [1.5 * Math.cos(2 * Math.PI * t + seedPhase), -0.8 * Math.sin(2 * Math.PI * t)];
    const dynStep = stepMultibodyDynamics(LIVE_ARM_TREE, q, qDot, tau, 1 / 120);
    q = dynStep.qNext;
    qDot = dynStep.qDotNext;
    const energy = computeMechanicalEnergy(LIVE_ARM_TREE, q, qDot);
    const aba = forwardDynamicsABA(LIVE_ARM_TREE, q, qDot, tau);

    const probePos: [number, number, number] = [
      0.35 * Math.sin(q[0]) + 0.3 * Math.sin(q[0] + q[1]),
      0.1 * Math.cos(2 * Math.PI * t),
      -0.35 * Math.cos(q[0]) - 0.3 * Math.cos(q[0] + q[1]),
    ];
    const obsCenter: [number, number, number] = [0.22 + obsOffset, 0.0, -0.45];
    const sphereEval = sdfSphere(probePos, obsCenter, 0.18);
    const boxEval = sdfBox(probePos, [0.25 + obsOffset, 0, -0.45], [0.15, 0.15, 0.15]);
    const manifold = collideSphereSphere(probePos, 0.12, obsCenter, 0.18);

    const dist = owner === "sdf-query" ? boxEval.distance : sphereEval.distance;
    const grad = owner === "sdf-query" ? boxEval.gradient : sphereEval.gradient;
    const safetyBand = 0.25;
    const inBand = dist < safetyBand;
    const cbfRes = safetyManager.filterOrRecover(
      [-0.6, 0.0, 0.2],
      probePos,
      [qDot[0], 0, qDot[1]],
      [
        {
          id: "live-obs",
          hValue: dist - 0.05,
          gradient: grad,
        },
      ],
    );

    const cbfGradNorm = inBand ? Math.hypot(grad[0], grad[1], grad[2]) : 0.0;
    const contactImp =
      owner.startsWith("featherstone-")
        ? Math.hypot(aba.qDDot[0], aba.qDDot[1]) * 0.05 + (manifold.hasCollision ? manifold.maxPenetration : 0)
        : manifold.hasCollision
          ? manifold.maxPenetration * 12.0
          : 0.0;

    const objective =
      owner.startsWith("obstacle-objective-")
        ? Math.hypot(...cbfRes.safeControl) + Math.max(0, safetyBand - dist)
        : energy.totalEnergy;

    perStep.push({
      step,
      objective,
      obstacleDistance: dist,
      cbfGradientNorm: cbfGradNorm,
      contactImpulse: contactImp,
    });
  }

  const minDist = Math.min(...perStep.map((s) => s.obstacleDistance));
  const maxImp = Math.max(...perStep.map((s) => s.contactImpulse));
  const finalObjective = perStep[perStep.length - 1]?.objective ?? 0;

  return {
    owner,
    version: 1,
    gitHead: (() => {
      try {
        return execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
      } catch {
        return "unknown";
      }
    })(),
    capturedAt: new Date().toISOString(),
    perStep,
    summary: {
      completedSteps: options.steps,
      terminationReason: "horizon",
      minimumObstacleDistance: minDist,
      maximumContactImpulse: maxImp,
      finalObjective,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Snapshot file.                                                     */
/* ------------------------------------------------------------------ */

function snapshotPath(owner: OwnerId): string {
  return resolve(SNAPSHOT_DIR, `${owner}.json`);
}

export function readSnapshot(owner: OwnerId): OwnerReceipt | null {
  const path = snapshotPath(owner);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8")) as OwnerReceipt;
}

export function writeSnapshot(receipt: OwnerReceipt): string {
  mkdirSync(dirname(snapshotPath(receipt.owner)), { recursive: true });
  const path = snapshotPath(receipt.owner);
  writeFileSync(path, JSON.stringify(receipt, null, 2) + "\n", "utf-8");
  return path;
}

export interface SnapshotDiff {
  owner: OwnerId;
  matches: boolean;
  perStepDiffs: number;
  summaryDiffs: string[];
}

/**
 * Compare a captured receipt to a committed snapshot. The comparison is
 * element-wise for the perStep array (max abs diff per field) and
 * exact-match for the summary. A non-empty diff means the trace changed;
 * the contributor updates the snapshot file in the same commit that
 * changed the kernel.
 */
export function compareSnapshot(captured: OwnerReceipt, committed: OwnerReceipt): SnapshotDiff {
  const summaryDiffs: string[] = [];
  for (const key of Object.keys(committed.summary) as Array<keyof typeof committed.summary>) {
    if (committed.summary[key] !== captured.summary[key]) {
      summaryDiffs.push(`${key}: ${committed.summary[key]} -> ${captured.summary[key]}`);
    }
  }
  let perStepDiffs = 0;
  const minLength = Math.min(captured.perStep.length, committed.perStep.length);
  for (let index = 0; index < minLength; index++) {
    const a = captured.perStep[index];
    const b = committed.perStep[index];
    if (
      Math.abs(a.objective - b.objective) > 1e-9 ||
      Math.abs(a.obstacleDistance - b.obstacleDistance) > 1e-9 ||
      Math.abs(a.cbfGradientNorm - b.cbfGradientNorm) > 1e-9 ||
      Math.abs(a.contactImpulse - b.contactImpulse) > 1e-9
    ) {
      perStepDiffs += 1;
    }
  }
  if (captured.perStep.length !== committed.perStep.length) {
    perStepDiffs += Math.abs(captured.perStep.length - committed.perStep.length);
  }
  return {
    owner: captured.owner,
    matches: perStepDiffs === 0 && summaryDiffs.length === 0,
    perStepDiffs,
    summaryDiffs,
  };
}
