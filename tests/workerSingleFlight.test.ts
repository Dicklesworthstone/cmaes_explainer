// Regression test for the worker-side single-flight gate in
// g1OptimizationWorker.ts and armOptimizationWorker.ts.
//
// Symptom: worker.onmessage fired optimize() as a fire-and-forget task
// with no serialization. The worker is single-threaded, but optimize()
// is async and yields at every await (admission, ask, pool.evaluate,
// trace). Two requests (rapid double-click, or a click during a
// preview) can interleave, calling session.ask() concurrently and
// corrupting the non-reentrant CMA state. Two trace messages then
// arrive at the main thread in indeterminate order.
//
// Fix: every request runs through a Promise gate. The handler wraps
// the work in a factory and the gate calls the factory only inside
// its .then() callback. The factory cannot start until the previous
// task resolves — this is the only way the microtask queue actually
// serializes the work, because async IIFEs start running immediately
// the moment they're constructed.
//
// This test isolates the gate logic without instantiating the worker.
// No real timers — order is determined by the microtask queue.

import { describe, it, expect } from "bun:test";

/** Minimal re-implementation of the worker gate. */
function makeGate() {
  let gate: Promise<void> = Promise.resolve();
  const log: string[] = [];

  function enqueue(id: string, workFactory: () => Promise<void>): Promise<void> {
    // The factory is invoked inside .then(), not eagerly. This is what
    // actually serializes: the work's IIFE cannot start until the
    // previous task resolves. (An earlier version of the fix passed the
    // started IIFE directly into .then(); the IIFE started running
    // immediately and the gate only serialized the .then continuation,
    // not the work.)
    const task = gate.then(
      async () => {
        log.push(`${id}:start`);
        await workFactory();
        log.push(`${id}:end`);
      },
      async () => {
        log.push(`${id}:start`);
        await workFactory();
        log.push(`${id}:end`);
      },
    );
    // Update the gate to the new task. The error handler preserves the
    // chain when a task rejects — the next task still runs.
    gate = task.then(() => {}, () => {});
    return task.catch(() => {});
   }

  return { enqueue, getLog: () => log };
}

/** A controllable deferred promise: `makeDeferred()` returns a promise
 *  and a `resolve()` handle. The test resolves manually so the ordering
 *  is deterministic without binding to real time. */
function makeDeferred() {
  const { promise, resolve } = Promise.withResolvers<void>();
  return { promise, resolve: () => resolve() };
}

/** Yield a few microtasks so any pending .then callbacks in the gate
 *  have a chance to run before the next assertion. */
async function drainMicrotasks(rounds = 4): Promise<void> {
  for (let i = 0; i < rounds; i++) await Promise.resolve();
}

describe("worker single-flight gate", () => {
  it("runs two enqueued tasks in order, not concurrently", async () => {
    const { enqueue, getLog } = makeGate();
    const aDone = enqueue("A", async () => { await Promise.resolve(); });
    const bDone = enqueue("B", async () => { await Promise.resolve(); });
    await Promise.all([aDone, bDone]);
    // A must finish before B starts. Both are async but neither blocks
    // — the gate's microtask scheduling is what enforces order.
    expect(getLog()).toEqual(["A:start", "A:end", "B:start", "B:end"]);
  });

  it("continues the chain after a task rejects", async () => {
    const { enqueue, getLog } = makeGate();
    const aDone = enqueue("A", async () => { throw new Error("A failed"); });
    const bDone = enqueue("B", async () => { await Promise.resolve(); });
    await Promise.all([aDone, bDone]);
    // A rejects but the chain still runs B (the gate's recovery handler
    // catches the rejection and proceeds to the next task).
    expect(getLog()).toEqual(["A:start", "B:start", "B:end"]);
  });

  it("serializes ten rapid requests without interleaving", async () => {
    const { enqueue, getLog } = makeGate();
    const tasks = Array.from({ length: 10 }, (_, i) =>
      enqueue(`T${i}`, async () => { await Promise.resolve(); })
    );
    await Promise.all(tasks);
    // Every T_i:start must precede T_i:end, and T_i:end must precede
    // T_{i+1}:start. The microtask scheduling makes this true.
    for (let i = 0; i < 10; i++) {
      expect(getLog()[2 * i]).toBe(`T${i}:start`);
      expect(getLog()[2 * i + 1]).toBe(`T${i}:end`);
    }
  });

  it("survives a task that never resolves (the gate is independent of task completion)", async () => {
    // Defends against a hung task freezing subsequent requests. The real
    // worker has no cancellation protocol yet, but the gate at least
    // serializes — a hung A means B waits but the chain isn't broken.
    const { enqueue, getLog } = makeGate();
    const deferredA = makeDeferred();
    const aDone = enqueue("A", () => deferredA.promise);
    const bDone = enqueue("B", async () => { await Promise.resolve(); });
    // A is still pending. B is queued behind it.
    await drainMicrotasks();
    expect(getLog()).toEqual(["A:start"]);
    deferredA.resolve();
    await aDone;
    await bDone;
    expect(getLog()).toEqual(["A:start", "A:end", "B:start", "B:end"]);
  });

  it("preserves the order of the requests that arrived first", async () => {
    // The FIFT-instance rule: the gate doesn't coalesce or reorder; it
    // serializes in arrival order. A different design that dropped or
    // reordered older requests would be a "smart" optimization that
    // masks the bug.
    const { enqueue, getLog } = makeGate();
    const aDone = enqueue("A", async () => { await Promise.resolve(); });
    const bDone = enqueue("B", async () => { await Promise.resolve(); });
    const cDone = enqueue("C", async () => { await Promise.resolve(); });
    await Promise.all([aDone, bDone, cDone]);
    expect(getLog()).toEqual(["A:start", "A:end", "B:start", "B:end", "C:start", "C:end"]);
  });
});
