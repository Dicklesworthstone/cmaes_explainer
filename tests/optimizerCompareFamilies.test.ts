import { describe, test, expect } from "bun:test";

/**
 * Integration tests for the real optimization-worker compare-family races.
 *
 * These tests exercise the actual armOptimizationWorker.ts and
 * g1OptimizationWorker.ts compare paths through their message boundary,
 * using the real WASM owner kernels and the RoboticsEvaluationPool parity
 * boundary. They verify that every admitted family produces a row, that the
 * 5,040-D race omits dense full CMA (which its admission limit excludes), and
 * that both workers emit the same progressive/completed comparison contract.
 */

type MessageFromWorker = { type: string } & Record<string, unknown>;

function runWorkerCompare(
  workerPath: string,
  message: object,
  timeoutMs: number,
): Promise<{ messages: MessageFromWorker[]; complete: MessageFromWorker | null; error: string | null }> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, { type: "module" });
    const messages: MessageFromWorker[] = [];
    let complete: MessageFromWorker | null = null;
    let error: string | null = null;
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ messages, complete, error: error ?? "timed out" });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<MessageFromWorker>) => {
      const msg = event.data;
      messages.push(msg);
      if (msg.type === "comparison") {
        if (msg.complete === true) {
          complete = msg;
          clearTimeout(timer);
          worker.terminate();
          resolve({ messages, complete, error });
        }
      } else if (msg.type === "error") {
        error = String((msg as any).message ?? "unknown worker error");
        clearTimeout(timer);
        worker.terminate();
        resolve({ messages, complete, error });
      }
    };

    worker.onerror = (err: ErrorEvent) => {
      error = err.message ?? "worker error event";
      clearTimeout(timer);
      worker.terminate();
      resolve({ messages, complete, error });
    };

    worker.postMessage(message);
  });
}

describe("armOptimizationWorker compareFamilies integration", () => {
  test(
    "runs a bounded 128-D equal-budget race across all four CMA families",
    async () => {
      const { messages, complete, error } = await runWorkerCompare(
        new URL("./armCompareTestWorker.ts", import.meta.url).href,
        {
          type: "compare",
          task: "kitchen-mug",
          generations: 2,
        },
        120_000,
      );
      expect(error).toBeNull();
      expect(complete).not.toBeNull();
      const rows = (complete as any).rows as Array<{ family: string; evaluations: number }>;
      expect(rows.length).toBe(4);
      const families = rows.map((r) => r.family).sort();
      expect(families).toEqual(["full", "lm-cma", "lm-ma", "separable"]);
      for (const row of rows) {
        expect(row.evaluations).toBe(24);
      }
      const statusMessages = messages.filter((m) => m.type === "status");
      expect(statusMessages.length).toBeGreaterThanOrEqual(1);
      const comparisonMessages = messages.filter((m) => m.type === "comparison");
      expect(comparisonMessages.map((m) => m.complete)).toEqual([
        false,
        false,
        false,
        false,
        true,
      ]);
      expect(comparisonMessages.map((m) => (m.rows as unknown[]).length)).toEqual([
        1,
        2,
        3,
        4,
        4,
      ]);
    },
    { timeout: 130_000 },
  );
});

describe("g1OptimizationWorker compareFamilies integration", () => {
  test(
    "runs a bounded 5,040-D equal-budget race across scalable CMA families and omits full",
    async () => {
      const { messages, complete, error } = await runWorkerCompare(
        new URL("./g1CompareTestWorker.ts", import.meta.url).href,
        {
          type: "compare",
          challenge: "terrain-and-push",
          generations: 2,
        },
        180_000,
      );
      expect(error).toBeNull();
      expect(complete).not.toBeNull();
      const rows = (complete as any).rows as Array<{ family: string; evaluations: number }>;
      expect(rows.length).toBe(3);
      const families = rows.map((r) => r.family).sort();
      expect(families).toEqual(["lm-cma", "lm-ma", "separable"]);
      for (const row of rows) {
        expect(row.evaluations).toBe(32);
      }
      const comparisonMessages = messages.filter((m) => m.type === "comparison");
      expect(comparisonMessages.map((m) => m.complete)).toEqual([
        false,
        false,
        false,
        true,
      ]);
      expect(comparisonMessages.map((m) => (m.rows as unknown[]).length)).toEqual([
        1,
        2,
        3,
        3,
      ]);
    },
    { timeout: 200_000 },
  );
});
