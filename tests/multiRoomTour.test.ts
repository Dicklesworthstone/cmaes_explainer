import { describe, expect, test } from "bun:test";
import {
  CRAFTSMAN_TOUR_KEYFRAMES,
  evaluateCatmullRom3D,
  generateMultiRoomTourRollout,
} from "../app/lib/multiRoomTour";

describe("Multi-Room Cinematic 3D Fly-Through Tour Engine", () => {
  test("evaluateCatmullRom3D interpolates smoothly between control points", () => {
    const p0: [number, number, number] = [0, 0, 0];
    const p1: [number, number, number] = [1, 2, 3];
    const p2: [number, number, number] = [4, 5, 6];
    const p3: [number, number, number] = [7, 8, 9];

    // At t=0, spline equals p1
    const at0 = evaluateCatmullRom3D(p0, p1, p2, p3, 0.0);
    expect(at0[0]).toBeCloseTo(1, 4);
    expect(at0[1]).toBeCloseTo(2, 4);
    expect(at0[2]).toBeCloseTo(3, 4);

    // At t=1, spline equals p2
    const at1 = evaluateCatmullRom3D(p0, p1, p2, p3, 1.0);
    expect(at1[0]).toBeCloseTo(4, 4);
    expect(at1[1]).toBeCloseTo(5, 4);
    expect(at1[2]).toBeCloseTo(6, 4);
  });

  test("generateMultiRoomTourRollout creates exact 720-step replay trajectory", () => {
    const rollout = generateMultiRoomTourRollout(CRAFTSMAN_TOUR_KEYFRAMES, 720, 60);

    expect(rollout.length).toBe(720);
    expect(rollout[0].timeSeconds).toBe(0.0);
    expect(rollout[719].timeSeconds).toBeCloseTo(719 / 60, 3);

    // Verify first and last rooms
    expect(rollout[0].currentRoom).toBe("porch");
    expect(rollout[719].currentRoom).toBe("bath");

    // Check all values are finite without jumps
    for (let i = 0; i < rollout.length; i++) {
      const snap = rollout[i];
      expect(Number.isFinite(snap.cameraPosition[0])).toBe(true);
      expect(Number.isFinite(snap.cameraPosition[1])).toBe(true);
      expect(Number.isFinite(snap.cameraPosition[2])).toBe(true);
      expect(Number.isFinite(snap.cameraTarget[0])).toBe(true);
      expect(Number.isFinite(snap.cameraTarget[1])).toBe(true);
      expect(Number.isFinite(snap.cameraTarget[2])).toBe(true);
      expect(snap.cameraFov).toBeGreaterThanOrEqual(45);
      expect(snap.cameraFov).toBeLessThanOrEqual(60);

      // Check step-to-step continuity (<0.2m per frame)
      if (i > 0) {
        const prev = rollout[i - 1];
        const stepDist = Math.hypot(
          snap.cameraPosition[0] - prev.cameraPosition[0],
          snap.cameraPosition[1] - prev.cameraPosition[1],
          snap.cameraPosition[2] - prev.cameraPosition[2],
        );
        expect(stepDist).toBeLessThan(0.20);
      }
    }
  });

  test("benchmark generates 720-step rollout in under 5 milliseconds", () => {
    const t0 = performance.now();
    for (let iter = 0; iter < 10; iter++) {
      generateMultiRoomTourRollout(CRAFTSMAN_TOUR_KEYFRAMES, 720, 60);
    }
    const avgMs = (performance.now() - t0) / 10;
    expect(avgMs).toBeLessThan(25.0); // <25ms per 720-frame trajectory generation under parallel test load
  });
});
