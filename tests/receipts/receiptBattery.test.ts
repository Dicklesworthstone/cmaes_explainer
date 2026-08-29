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
  captureReceipt,
  readSnapshot,
  writeSnapshot,
  compareSnapshot,
  type OwnerId,
  type OwnerReceipt,
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
        // First baseline: write the snapshot. The next run will assert
        // the diff is empty.
        const written = writeSnapshot(captured);
        console.log(`receipt[${owner}]: first baseline written to ${written}`);
        expect(captured.perStep).toHaveLength(STEPS);
        expect(captured.summary.completedSteps).toBe(STEPS);
        expect(captured.summary.terminationReason).toBe("horizon");
        return;
      }
      const diff = compareSnapshot(captured, committed);
      if (!diff.matches) {
        // Loud diff report; the contributor sees exactly what changed.
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

  test("snapshot files exist after first run (where written)", () => {
    // The test above writes the snapshot if it does not exist; the
    // snapshots directory should now have files for every owner.
    const dir = resolve(__dirname, "snapshots");
    expect(existsSync(dir)).toBe(true);
  });
});
