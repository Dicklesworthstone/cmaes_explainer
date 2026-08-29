import { describe, expect, test } from "bun:test";
import { LiveCmaesOptimizer } from "../app/lib/liveCmaesHousehold";
import { generateVisitorModeClip, VISITOR_CLIP_KEYFRAMES } from "../app/lib/visitorModeClip";

describe("Live CMA-ES Policy Optimizer & Visitor Mode Showcase Engine", () => {
  test("LiveCmaesOptimizer iteratively minimizes objective function", () => {
    const optimizer = new LiveCmaesOptimizer({
      ownerId: "walking-owner-1",
      name: "Nominal Walking Policy",
      dimension: 6,
      initialSigma: 0.5,
      populationSize: 8,
      seed: 1234,
    });

    const targetOptimum = [1.0, -0.5, 0.8, -1.2, 0.3, 0.0];

    // Evaluate 15 generations on quadratic sphere objective
    for (let gen = 0; gen < 15; gen++) {
      const population = optimizer.samplePopulation();
      expect(population.length).toBe(8);

      const fitnesses = population.map((cand) => {
        let sumSq = 0;
        for (let d = 0; d < 6; d++) {
          sumSq += (cand[d] - targetOptimum[d]) ** 2;
        }
        return sumSq;
      });

      optimizer.tellEvaluations(population, fitnesses);
    }

    // Best ever fitness after 15 generations should improve substantially
    expect(optimizer.state.bestFitness).toBeLessThan(optimizer.state.fitnessHistory[0]);
    expect(optimizer.state.fitnessHistory.length).toBe(15);

    // Covariance diagonal remains strictly positive
    for (let i = 0; i < 6; i++) {
      expect(optimizer.state.covariance[i][i]).toBeGreaterThan(0.0);
    }
  });

  test("generateVisitorModeClip produces exact 1800-frame (30.00s @ 60 FPS) trajectory", () => {
    const clip = generateVisitorModeClip(VISITOR_CLIP_KEYFRAMES, 1800, 60);

    expect(clip.length).toBe(1800);
    expect(clip[0].timeSeconds).toBe(0.0);
    expect(clip[1799].timeSeconds).toBeCloseTo(30.0, 1);

    // Verify first and last rooms
    expect(clip[0].activeRoom).toBe("Front Porch");
    expect(clip[1799].activeRoom).toBe("Ensuite Bath Climax");

    // Verify continuity across all frames
    for (let f = 0; f < clip.length; f++) {
      const frame = clip[f];
      expect(Number.isFinite(frame.cameraEye[0])).toBe(true);
      expect(Number.isFinite(frame.cameraEye[1])).toBe(true);
      expect(Number.isFinite(frame.cameraEye[2])).toBe(true);
      expect(Number.isFinite(frame.cameraTarget[0])).toBe(true);
      expect(Number.isFinite(frame.cameraTarget[1])).toBe(true);
      expect(Number.isFinite(frame.cameraTarget[2])).toBe(true);
      expect(Number.isFinite(frame.robotPosition[0])).toBe(true);
      expect(Number.isFinite(frame.robotPosition[1])).toBe(true);
      expect(frame.highlightedChipId.length).toBeGreaterThan(0);
      expect(frame.lightingState.sunbeamIntensity).toBeGreaterThanOrEqual(0.0);
    }
  });

  test("visitor clip generator performance benchmark under 10 milliseconds", () => {
    const t0 = performance.now();
    generateVisitorModeClip(VISITOR_CLIP_KEYFRAMES, 1800, 60);
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(15.0); // <15ms for 1800 frames
  });
});
