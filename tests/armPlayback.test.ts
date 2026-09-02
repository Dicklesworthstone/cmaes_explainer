import { describe, expect, test } from "bun:test";
import {
  advanceArmPlayback,
  clampArmPlaybackIndex,
} from "../app/components/HouseholdArmFlagship";

describe("arm trace playback", () => {
  const sampleTimes = [0, 0.25, 0.5, 0.75, 1] as const;

  test("clamps externally requested samples to a real trace sample", () => {
    expect(clampArmPlaybackIndex(5, -4)).toBe(0);
    expect(clampArmPlaybackIndex(5, 2.4)).toBe(2);
    expect(clampArmPlaybackIndex(5, 99)).toBe(4);
    expect(clampArmPlaybackIndex(5, Number.NaN)).toBe(0);
    expect(clampArmPlaybackIndex(0, 3)).toBe(0);
  });

  test("does not move a paused trace", () => {
    expect(advanceArmPlayback(sampleTimes, 2, 0.5, 0.1, 2, false)).toEqual({
      sampleIndex: 2,
      elapsedSeconds: 0.5,
      wrapped: false,
    });
  });

  test("advances the sample and elapsed time at the selected speed", () => {
    expect(advanceArmPlayback(sampleTimes, 0, 0, 0.1, 1, true)).toEqual({
      sampleIndex: 0,
      elapsedSeconds: 0.1,
      wrapped: false,
    });
    expect(advanceArmPlayback(sampleTimes, 0, 0.2, 0.1, 2, true)).toEqual({
      sampleIndex: 1,
      elapsedSeconds: 0.4,
      wrapped: false,
    });
  });

  test("caps a long render frame so playback cannot skip an unsafe interval", () => {
    expect(advanceArmPlayback(sampleTimes, 0, 0, 4, 1, true)).toEqual({
      sampleIndex: 0,
      elapsedSeconds: 0.1,
      wrapped: false,
    });
  });

  test("renders the terminal sample before wrapping to the beginning", () => {
    expect(advanceArmPlayback(sampleTimes, 3, 0.9, 0.1, 1, true)).toEqual({
      sampleIndex: 4,
      elapsedSeconds: 1,
      wrapped: false,
    });
    expect(advanceArmPlayback(sampleTimes, 4, 1, 0.1, 1, true)).toEqual({
      sampleIndex: 0,
      elapsedSeconds: expect.closeTo(0.1),
      wrapped: true,
    });
  });

  test("returns a stable empty-trace state", () => {
    expect(advanceArmPlayback([], 8, 2, 0.1, 1, true)).toEqual({
      sampleIndex: 0,
      elapsedSeconds: 0,
      wrapped: false,
    });
  });
});
