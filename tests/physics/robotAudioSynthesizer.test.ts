import { describe, expect, test } from "bun:test";
import { robotAudio } from "../../app/lib/robotAudioSynthesizer";

describe("Robot Procedural Audio & Haptics Synthesizer", () => {
  test("initializes in muted state by default", () => {
    expect(robotAudio.getIsMuted()).toBe(true);
  });

  test("toggleMute correctly toggles mute state", () => {
    const isSoundEnabled = robotAudio.toggleMute();
    expect(isSoundEnabled).toBe(true);
    expect(robotAudio.getIsMuted()).toBe(false);

    // Toggle back
    const isMutedNow = robotAudio.toggleMute();
    expect(isMutedNow).toBe(false);
    expect(robotAudio.getIsMuted()).toBe(true);
  });

  test("sound synthesis functions execute without throwing when muted or in headless environment", () => {
    expect(() => {
      robotAudio.playFootstep(1.0, true);
      robotAudio.playFootstep(0.8, false);
      robotAudio.playCollisionBump(0.05);
      robotAudio.updateServoHum(0.5);
      robotAudio.stopServo();
    }).not.toThrow();
  });
});
