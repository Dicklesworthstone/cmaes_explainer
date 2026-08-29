import { describe, expect, test } from "bun:test";
import {
  type CorridorSegment,
  evaluateSscbfBarrier,
  filterCorridorVelocityQP,
  projectPointOntoSegment,
  type SscbfState,
} from "../app/lib/segmentSafeCbf";

describe("Segment-Safe Control Barrier Functions (SSCBF) Engine", () => {
  const doorway: CorridorSegment = {
    id: "kitchen-dining-doorway",
    start: [2.0, 0.0],
    end: [2.0, 2.0], // Corridor aligned along +Z
    halfWidth: 0.45, // 0.9m wide doorway
    maxYawErrorRad: 0.35, // ~20 deg
  };

  test("projectPointOntoSegment evaluates exact projection and squared distance", () => {
    // Point directly on midpoint
    const p1: [number, number] = [2.0, 1.0];
    const res1 = projectPointOntoSegment(p1, doorway.start, doorway.end);
    expect(res1.t).toBeCloseTo(0.5, 4);
    expect(res1.proj[0]).toBeCloseTo(2.0, 4);
    expect(res1.proj[1]).toBeCloseTo(1.0, 4);
    expect(res1.distSq).toBeCloseTo(0.0, 4);

    // Point 1m to the left (-X) of start
    const p2: [number, number] = [1.0, 0.0];
    const res2 = projectPointOntoSegment(p2, doorway.start, doorway.end);
    expect(res2.t).toBeCloseTo(0.0, 4);
    expect(res2.distSq).toBeCloseTo(1.0, 4);
  });

  test("evaluateSscbfBarrier calculates lateral margin and inward-pointing gradient", () => {
    const stateCenter: SscbfState = {
      position: [2.0, 1.0], // Exactly on corridor centerline
      velocity: [0, 1.0], // Forward along corridor
      yaw: Math.PI / 2, // Facing +Z
      robotRadius: 0.25, // 0.5m diameter robot
    };

    const bCenter = evaluateSscbfBarrier(stateCenter, doorway);
    // Allowed half width = 0.45 - 0.25 = 0.20m
    expect(bCenter.hLateral).toBeCloseTo(0.2, 4);
    expect(bCenter.hOrientation).toBeGreaterThan(0.0);

    // Robot drifting close to right door jamb (+X side: x = 2.15)
    const stateRight: SscbfState = {
      position: [2.15, 1.0],
      velocity: [0.5, 1.0],
      yaw: Math.PI / 2,
      robotRadius: 0.25,
    };

    const bRight = evaluateSscbfBarrier(stateRight, doorway);
    // Margin = 0.20 - 0.15 = 0.05m
    expect(bRight.hLateral).toBeCloseTo(0.05, 4);
    // Gradient must push LEFT (-X direction)
    expect(bRight.gradLateral[0]).toBeLessThan(0.0);
  });

  test("filterCorridorVelocityQP preserves forward progress without artificial jamming", () => {
    const stateCenter: SscbfState = {
      position: [2.0, 1.0],
      velocity: [0, 0.8],
      yaw: Math.PI / 2,
      robotRadius: 0.25,
    };

    // Forward velocity down corridor centerline should NOT be attenuated
    const nominalV: [number, number] = [0.0, 0.8];
    const filtered = filterCorridorVelocityQP(nominalV, stateCenter, [doorway]);

    expect(filtered.isCorridorActive).toBe(true);
    expect(filtered.safeVelocity[0]).toBeCloseTo(0.0, 4);
    expect(filtered.safeVelocity[1]).toBeCloseTo(0.8, 4); // Full forward speed maintained!
  });

  test("filterCorridorVelocityQP curtails lateral approach and restores safety at boundary", () => {
    // Robot near right jamb (x = 2.18, margin = 0.02) trying to drive further right (vx = +0.6)
    const stateNearJamb: SscbfState = {
      position: [2.18, 1.0],
      velocity: [0.6, 0.5],
      yaw: Math.PI / 2,
      robotRadius: 0.25,
    };

    const unsafeV: [number, number] = [0.6, 0.5];
    const filtered = filterCorridorVelocityQP(unsafeV, stateNearJamb, [doorway]);

    // Clamped strictly to gamma * h = 4.0 * 0.02 = 0.08 (curtailed from 0.60)
    expect(filtered.safeVelocity[0]).toBeCloseTo(0.08, 4);
    expect(filtered.safeVelocity[1]).toBeCloseTo(0.5, 4); // Forward velocity preserved

    // Robot slightly outside margin (x = 2.21, margin = -0.01) trying to drive further right
    const stateOutside: SscbfState = {
      position: [2.21, 1.0],
      velocity: [0.6, 0.5],
      yaw: Math.PI / 2,
      robotRadius: 0.25,
    };
    const filteredRestoring = filterCorridorVelocityQP(unsafeV, stateOutside, [doorway]);
    // Must be pushed strictly inward (vx <= -0.04 < 0)
    expect(filteredRestoring.safeVelocity[0]).toBeLessThan(0.0);
  });

  test("sub-millisecond QP execution benchmark across 100 solves", () => {
    const state: SscbfState = {
      position: [2.1, 0.5],
      velocity: [0.2, 0.6],
      yaw: Math.PI / 2,
      robotRadius: 0.25,
    };
    const nominalV: [number, number] = [0.2, 0.6];

    const t0 = performance.now();
    for (let i = 0; i < 100; i++) {
      filterCorridorVelocityQP(nominalV, state, [doorway]);
    }
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(10.0); // <100µs per solve
  });
});
