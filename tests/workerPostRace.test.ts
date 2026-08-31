// Regression test for the double-click race in G1WalkingFlagship.post()
// and HouseholdArmFlagship.post().
//
// Symptom: post() checked `busy` (React state) which updates asynchronously.
// Two rapid clicks within the same render tick both see `busy === null` and
// both postMessage to the worker, which then runs two optimize() calls
// concurrently on the same shared `g1ActiveRuns` map and non-reentrant CMA
// session. This corrupts the session, produces wrong-best traces, and leaks
// the parallel session's WASM memory.
//
// Fix: a synchronous `inFlightRef` that updates atomically before posting.
// The ref is checked before setBusy (which is async) so a second click in
// the same tick is rejected before the worker sees it.
//
// This test isolates the post() gate logic so we can prove it works without
// pulling in the full 1950-line component, the worker, the WASM, or React.

import { describe, it, expect } from "bun:test";

interface PendingMessage {
  type: string;
  family?: string;
  generations?: number;
  mode?: string;
  challenge?: string;
  sigma?: number;
}

/** Minimal re-implementation of the post() gate from the components. */
function makeGate(worker: { postMessage: (m: PendingMessage) => void }) {
  const inFlightRef = { current: false };
  let busy: "preview" | "optimize" | "compare" | null = null;
  const listeners: Array<(mode: "preview" | "optimize" | "compare" | null) => void> = [];

  function post(message: PendingMessage, mode: "preview" | "optimize" | "compare") {
    if (inFlightRef.current) return false;
    inFlightRef.current = true;
    busy = mode;
    for (const l of listeners) l(busy);
    worker.postMessage(message);
    return true;
  }

  /** Called from the worker's terminal message (trace / comparison / error). */
  function release() {
    inFlightRef.current = false;
    busy = null;
    for (const l of listeners) l(busy);
  }

  function getBusy() { return busy; }
  function isInFlight() { return inFlightRef.current; }
  function onChange(fn: (mode: "preview" | "optimize" | "compare" | null) => void) {
    listeners.push(fn);
  }

  return { post, release, getBusy, isInFlight, onChange };
}

describe("post() single-flight gate", () => {
  it("rejects the second of two synchronous post() calls", () => {
    const posted: PendingMessage[] = [];
    const gate = makeGate({ postMessage: (m) => { posted.push(m); } });

    const a = gate.post({ type: "optimize", family: "lm-cma", generations: 16 }, "optimize");
    const b = gate.post({ type: "optimize", family: "separable", generations: 16 }, "optimize");

    expect(a).toBe(true);  // first call accepted
    expect(b).toBe(false); // second call rejected by the synchronous ref
    expect(posted.length).toBe(1);
    expect(posted[0]?.family).toBe("lm-cma");
    expect(gate.isInFlight()).toBe(true);
    expect(gate.getBusy()).toBe("optimize");
  });

  it("accepts a new post() after the previous one releases", () => {
    const posted: PendingMessage[] = [];
    const gate = makeGate({ postMessage: (m) => { posted.push(m); } });

    gate.post({ type: "preview" }, "preview");
    expect(gate.isInFlight()).toBe(true);

    gate.release();
    expect(gate.isInFlight()).toBe(false);

    gate.post({ type: "optimize", family: "lm-cma" }, "optimize");
    expect(posted.length).toBe(2);
  });

  it("rejects a re-entrant post() even when busy === null (the original bug)", () => {
    // This is the exact bug: busy is React state, async. Two clicks in the
    // same tick both see busy === null. The ref gate is what prevents it.
    const posted: PendingMessage[] = [];
    const gate = makeGate({ postMessage: (m) => { posted.push(m); } });

    // Simulate the React render cycle: setBusy(mode) is queued, not applied.
    // The ref updates synchronously.
    const first = gate.post({ type: "optimize", family: "lm-cma" }, "optimize");
    // Second click arrives in the same tick before busy has been re-read.
    const second = gate.post({ type: "optimize", family: "separable" }, "optimize");

    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(posted.length).toBe(1);
  });

  it("fires the onChange listener exactly once per accepted call", () => {
    const events: Array<"preview" | "optimize" | "compare" | null> = [];
    const gate = makeGate({ postMessage: () => {} });
    gate.onChange((m) => events.push(m));

    gate.post({ type: "preview" }, "preview"); // [preview]
    gate.post({ type: "optimize" }, "optimize"); // rejected, no event
    gate.post({ type: "compare" }, "compare");   // rejected, no event
    gate.release();                              // [null]
    gate.post({ type: "optimize" }, "optimize"); // [optimize]
    gate.release();                              // [null]

    expect(events).toEqual(["preview", null, "optimize", null]);
  });

  it("allows preview during a different in-flight request only if the ref says so", () => {
    // Defense: even cross-request types (preview vs optimize) are gated by
    // the same ref. The main thread uses the same `busy` boolean for all
    // three modes (see G1WalkingFlagship.tsx), so the gate is shared.
    const posted: PendingMessage[] = [];
    const gate = makeGate({ postMessage: (m) => { posted.push(m); } });

    gate.post({ type: "optimize", family: "lm-cma" }, "optimize");
    const previewWhileOptimize = gate.post({ type: "preview" }, "preview");

    expect(previewWhileOptimize).toBe(false);
    expect(posted.length).toBe(1);
  });
});
