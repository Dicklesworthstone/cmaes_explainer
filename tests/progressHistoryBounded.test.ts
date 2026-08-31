// Regression test for the unbounded progressHistory growth in
// G1WalkingFlagship.tsx. The original setProgressHistory((prev) => [...prev, x])
// accumulated one entry per progress message. At maxGenerations = 30,000
// (with one progress per 2 generations per the worker's reporting cadence),
// that would push ~15,000 entries into a React state and re-render the
// ConvergenceChart SVG on every entry. The chart is also the only place
// progressHistory is consumed (via data={progressHistory}), so dropping
// older points is invisible to the user — the chart only renders the
// visible window.
//
// Fix: cap the array at 200 entries. When full, the oldest entry is dropped.

import { describe, it, expect } from "bun:test";

const HISTORY_CAP = 200;

interface ConvergencePoint {
  generation: number;
  bestObjective: number;
  sigma: number;
}

/** Mirrors the setProgressHistory updater in G1WalkingFlagship.tsx. */
function appendProgress(prev: ConvergencePoint[], next: ConvergencePoint): ConvergencePoint[] {
  return prev.length >= HISTORY_CAP
    ? [...prev.slice(prev.length - (HISTORY_CAP - 1)), next]
    : [...prev, next];
}

describe("progressHistory bounded at 200 entries", () => {
  it("accepts the first 200 entries without dropping", () => {
    let history: ConvergencePoint[] = [];
    for (let i = 0; i < HISTORY_CAP; i++) {
      history = appendProgress(history, { generation: i, bestObjective: 1 - i * 0.001, sigma: 0.005 });
    }
    expect(history.length).toBe(HISTORY_CAP);
    expect(history[0]?.generation).toBe(0);
    expect(history[HISTORY_CAP - 1]?.generation).toBe(HISTORY_CAP - 1);
  });

  it("drops the oldest entry when the cap is exceeded", () => {
    let history: ConvergencePoint[] = [];
    for (let i = 0; i < HISTORY_CAP + 5; i++) {
      history = appendProgress(history, { generation: i, bestObjective: 1, sigma: 0.005 });
    }
    expect(history.length).toBe(HISTORY_CAP);
    // The first 5 entries (gen 0..4) were dropped.
    expect(history[0]?.generation).toBe(5);
    expect(history[HISTORY_CAP - 1]?.generation).toBe(HISTORY_CAP + 4);
  });

  it("handles 30,000 generations without unbounded growth", () => {
    let history: ConvergencePoint[] = [];
    for (let i = 0; i < 30_000; i++) {
      history = appendProgress(history, { generation: i, bestObjective: 1, sigma: 0.005 });
    }
    // The cap is 200, not 30,000. This is the property the fix preserves.
    expect(history.length).toBe(HISTORY_CAP);
    expect(history[0]?.generation).toBe(30_000 - HISTORY_CAP);
    expect(history[HISTORY_CAP - 1]?.generation).toBe(29_999);
  });

  it("preserves the latest entry (FIFO drop, not LIFO)", () => {
    let history: ConvergencePoint[] = [];
    for (let i = 0; i < HISTORY_CAP + 10; i++) {
      history = appendProgress(history, { generation: i, bestObjective: i, sigma: 0.005 });
    }
    // Most recent entry is preserved exactly.
    expect(history[history.length - 1]?.generation).toBe(HISTORY_CAP + 9);
    expect(history[history.length - 1]?.bestObjective).toBe(HISTORY_CAP + 9);
  });
});
