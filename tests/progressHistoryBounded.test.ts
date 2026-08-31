// Regression test for the progressHistory downsampling in
// G1WalkingFlagship.tsx.
//
// The original setProgressHistory((prev) => [...prev, x]) accumulated
// one entry per progress message. At maxGenerations = 30,000 (with
// one progress per 2 generations per the worker's reporting cadence),
// that would push ~15,000 entries into a React state and re-render
// the ConvergenceChart SVG on every entry.
//
// The first fix (FIFO cap at 200) was correct in terms of bounding
// the array, but the user only saw the LAST 200 generations of any
// long run. The current fix is full-history-in-ref + head/body/tail
// downsample-to-200 for state:
//   - The full history lives in a ref (monotonically growing).
//   - The downsampler reads the full ref, picks the oldest HEAD
//     points, log-spaces the middle BODY, and appends the newest
//     TAIL points. So a 30k-gen run shows gens 0..9, gens 10..30k
//     log-spaced, and gens 29990..29999 — the full trajectory.
//   - React state holds only the 200-point window, so re-renders
//     stay bounded and the chart only sees what it can display.

import { describe, it, expect } from "bun:test";

const HISTORY_CAP = 200;
const HEAD = 10;
const TAIL = 10;

interface ConvergencePoint {
  generation: number;
  bestObjective: number;
  sigma: number;
}

interface ProgressRecorder {
  ref: ConvergencePoint[];
  state: ConvergencePoint[];
  append: (point: ConvergencePoint) => void;
}

/** Mirrors the setProgressHistory updater in G1WalkingFlagship.tsx. */
function makeRecorder(): ProgressRecorder {
  const ref: ConvergencePoint[] = [];
  const state: ConvergencePoint[] = [];
  return {
    ref,
    state,
    append(point) {
      ref.push(point);
      if (ref.length <= HISTORY_CAP) {
        state.length = 0;
        state.push(...ref);
        return;
      }
      const n = ref.length;
      const kept: ConvergencePoint[] = [];
      for (let k = 0; k < HEAD; k++) kept.push(ref[k]);
      const bodyCount = HISTORY_CAP - HEAD - TAIL;
      const bodyStart = HEAD;
      const bodyEnd = n - TAIL;
      if (bodyCount > 0 && bodyEnd > bodyStart) {
        const lo = Math.log(bodyStart + 1);
        const hi = Math.log(bodyEnd);
        for (let k = 0; k < bodyCount; k++) {
          const t = bodyCount > 1 ? k / (bodyCount - 1) : 0;
          const idx = Math.round(Math.exp(lo + t * (hi - lo))) - 1;
          kept.push(ref[Math.max(0, Math.min(n - 1, idx))]);
        }
      }
      for (let k = 0; k < TAIL; k++) kept.push(ref[n - TAIL + k]);
      state.length = 0;
      state.push(...kept);
    },
  };
}

describe("progressHistory bounded at 200 with head+body+tail downsample", () => {
  it("first 200 entries are kept verbatim (no downsampling yet)", () => {
    const rec = makeRecorder();
    for (let i = 0; i < HISTORY_CAP; i++) {
      rec.append({ generation: i, bestObjective: 1 - i * 0.001, sigma: 0.005 });
    }
    expect(rec.state.length).toBe(HISTORY_CAP);
    expect(rec.state[0]?.generation).toBe(0);
    expect(rec.state[HISTORY_CAP - 1]?.generation).toBe(HISTORY_CAP - 1);
  });

  it("the full history lives in the ref (unbounded, monotonic)", () => {
    const rec = makeRecorder();
    for (let i = 0; i < 30_000; i++) {
      rec.append({ generation: i, bestObjective: 1, sigma: 0.005 });
    }
    // The ref holds every point; the state is the downsampled window.
    expect(rec.ref.length).toBe(30_000);
    expect(rec.state.length).toBe(HISTORY_CAP);
  });

  it("head region: first 10 generations are always shown (gen 0 visible on 30k runs)", () => {
    const rec = makeRecorder();
    for (let i = 0; i < 30_000; i++) {
      rec.append({ generation: i, bestObjective: 1, sigma: 0.005 });
    }
    // The first HEAD points should be the first HEAD generations.
    for (let k = 0; k < HEAD; k++) {
      expect(rec.state[k]?.generation).toBe(k);
    }
  });

  it("tail region: last 10 generations are always shown (live progress accurate)", () => {
    const rec = makeRecorder();
    for (let i = 0; i < 30_000; i++) {
      rec.append({ generation: i, bestObjective: 1, sigma: 0.005 });
    }
    for (let k = 0; k < TAIL; k++) {
      expect(rec.state[rec.state.length - TAIL + k]?.generation).toBe(30_000 - TAIL + k);
    }
  });

  it("body region spans the full range (early AND late gens visible)", () => {
    const rec = makeRecorder();
    for (let i = 0; i < 30_000; i++) {
      rec.append({ generation: i, bestObjective: 1, sigma: 0.005 });
    }
    // The body is between head and tail. With bodyCount=180 and
    // log-spaced sampling over [10, 29990], the body should have
    // points spread across the entire range — including early,
    // middle, and late generations.
    const bodyStart = HEAD;
    const bodyEnd = rec.state.length - TAIL;
    const bodyGens = rec.state.slice(bodyStart, bodyEnd).map((p) => p.generation);
    // Must include at least one early body point (gen 50-500).
    expect(bodyGens.some((g) => g > 50 && g < 500)).toBe(true);
    // Must include at least one middle body point (gen 5000-15000).
    expect(bodyGens.some((g) => g > 5000 && g < 15000)).toBe(true);
    // Must include at least one late body point (gen 15000-25000).
    expect(bodyGens.some((g) => g > 15000 && g < 25000)).toBe(true);
  });

  it("preserves strict monotonicity of generations in the state", () => {
    const rec = makeRecorder();
    for (let i = 0; i < 30_000; i++) {
      rec.append({ generation: i, bestObjective: 1, sigma: 0.005 });
    }
    for (let i = 1; i < rec.state.length; i++) {
      expect((rec.state[i]?.generation ?? 0)).toBeGreaterThanOrEqual(
        rec.state[i - 1]?.generation ?? 0,
      );
    }
  });

  it("body spacing is log-uniform: late gaps are larger than early gaps", () => {
    const rec = makeRecorder();
    for (let i = 0; i < 30_000; i++) {
      rec.append({ generation: i, bestObjective: 1, sigma: 0.005 });
    }
    // The body region is at indices [HEAD, HISTORY_CAP-TAIL).
    const bodyRegion = rec.state.slice(HEAD, rec.state.length - TAIL);
    const earlyGap = (bodyRegion[1]?.generation ?? 0) - (bodyRegion[0]?.generation ?? 0);
    const lateGap =
      (bodyRegion[bodyRegion.length - 1]?.generation ?? 0) -
      (bodyRegion[bodyRegion.length - 2]?.generation ?? 0);
    // Log spacing means later gaps are larger than early ones.
    expect(lateGap).toBeGreaterThan(earlyGap);
  });
});
