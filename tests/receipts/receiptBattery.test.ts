/**
 * tests/receipts/receiptBattery.test.ts
 *
 * Slice C receipt battery: per-step behavioral traces for the new owners.
 * Closes: cmaes-phr3m-receipts-bia.
 *
 * The battery:
 *   1. Captures a fresh receipt for each owner.
 *   2. Reads the committed snapshot (if any).
 *   3. If no snapshot exists, writes the captured receipt as the first
 *      baseline. Subsequent runs assert the captured receipt matches.
 *   4. If a snapshot exists, asserts the diff is empty (a contributor
 *      who changes the trace must update the snapshot in the same commit).
 *
 * # Status
 *
 * The owners are kernelPending. captureReceipt returns a synthetic receipt.
 * When the kernel lands, the contributor swaps in the real capture. The
 * snapshot file is the durable artifact.
 *
 * # Honesty floor
 *
 * A "trace" that is just a random sample of states is not a receipt. The
 * committed-snapshot gate is what makes the receipt a real receipt.
 */

import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  captureLivePhysicsReceipt,
  captureReceipt,
  compareSnapshot,
  type OwnerId,
  type OwnerReceipt,
  readSnapshot,
  writeSnapshot,
} from "./receiptBattery";

const OWNERS: OwnerId[] = [
  "obstacle-objective-arm",
  "obstacle-objective-g1",
  "featherstone-2link",
  "featherstone-g1-lower-body",
  "sdf-query",
  "gjk-witness",
  "epa-penetration",
];

const STEPS = 16;
const SEED = 1729;

describe("phr-env-2026 receipt battery (per-step behavioral traces)", () => {
  for (const owner of OWNERS) {
    test(`${owner}: capture + snapshot gate`, () => {
      const captured = captureReceipt(owner, { steps: STEPS, seed: SEED });
      const committed = readSnapshot(owner);
      if (committed === null) {
        if (process.env.UPDATE_RECEIPT_SNAPSHOTS === "1") {
          const written = writeSnapshot(captured);
          console.log(`receipt[${owner}]: baseline explicitly written to ${written}`);
          expect(captured.perStep).toHaveLength(STEPS);
          return;
        }
        throw new Error(
          `Missing committed receipt snapshot for ${owner}. Run with UPDATE_RECEIPT_SNAPSHOTS=1 to create/update snapshots intentionally.`,
        );
      }
      const diff = compareSnapshot(captured, committed);
      if (!diff.matches) {
        console.error(
          `receipt[${owner}]: snapshot DIFF\n  perStepDiffs: ${diff.perStepDiffs}\n  summaryDiffs: ${diff.summaryDiffs.join(", ")}`,
        );
      }
      expect(diff.matches).toBe(true);
    });
  }

  test("every owner has a non-empty perStep and a sensible summary", () => {
    for (const owner of OWNERS) {
      const receipt: OwnerReceipt = captureReceipt(owner, { steps: STEPS, seed: SEED });
      expect(receipt.owner).toBe(owner);
      expect(receipt.perStep.length).toBe(STEPS);
      for (let index = 0; index < STEPS; index++) {
        const step = receipt.perStep[index];
        expect(step.step).toBe(index);
        expect(Number.isFinite(step.objective)).toBe(true);
        expect(Number.isFinite(step.obstacleDistance)).toBe(true);
        expect(step.cbfGradientNorm).toBeGreaterThanOrEqual(0);
        expect(step.contactImpulse).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test("captureLivePhysicsReceipt executes real Featherstone, SDF, contact, and CBF modules with non-zero CBF gradients", () => {
    for (const owner of OWNERS) {
      const live = captureLivePhysicsReceipt(owner, { steps: STEPS, seed: SEED });
      expect(live.owner).toBe(owner);
      expect(live.perStep.length).toBe(STEPS);

      const maxCbfGrad = Math.max(...live.perStep.map((s) => s.cbfGradientNorm));
      expect(maxCbfGrad).toBeGreaterThan(0);

      if (owner.startsWith("featherstone-")) {
        expect(live.summary.maximumContactImpulse).toBeGreaterThan(0);
      }
    }
  });

  test("negative control: causal obstacle shift alters live receipt trace and compareSnapshot flags tampered step", () => {
    const nearReceipt = captureLivePhysicsReceipt("obstacle-objective-arm", {
      steps: STEPS,
      seed: SEED,
      obstacleOffset: 0.0,
    });
    const farReceipt = captureLivePhysicsReceipt("obstacle-objective-arm", {
      steps: STEPS,
      seed: SEED,
      obstacleOffset: 1.5,
    });

    expect(farReceipt.summary.minimumObstacleDistance).toBeGreaterThan(
      nearReceipt.summary.minimumObstacleDistance + 0.5,
    );
    expect(compareSnapshot(nearReceipt, farReceipt).matches).toBe(false);

    // Tamper with a single step in a cloned receipt and verify compareSnapshot catches it
    const tampered: OwnerReceipt = JSON.parse(JSON.stringify(nearReceipt));
    tampered.perStep[5].objective += 1e-4;
    const diff = compareSnapshot(tampered, nearReceipt);
    expect(diff.matches).toBe(false);
    expect(diff.perStepDiffs).toBe(1);
  });

  test("snapshot files exist after first run (where written)", () => {
    const dir = resolve(__dirname, "snapshots");
    expect(existsSync(dir)).toBe(true);
  });
});
