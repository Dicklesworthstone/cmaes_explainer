import { describe, expect, test } from "bun:test";
import {
  MultiBodySleepManager,
  type SleepableBody,
} from "../app/lib/multiBodySleepState";

describe("Multi-Body Sleep State & Impulse-Gated Activation Engine", () => {
  test("settled body transitions to SLEEPING after quiet dwell time", () => {
    const manager = new MultiBodySleepManager({ dwellTimeSeconds: 0.2 });

    const mug: SleepableBody = {
      id: "mug-1",
      massKg: 0.3,
      momentOfInertia: 0.001,
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      angularVelocity: [0, 0, 0],
      state: "AWAKE",
      lowEnergyDwellSeconds: 0.0,
      connectedBodyIds: [],
    };

    manager.registerBody(mug);

    // Step 0.1s -> still awake (0.1 < 0.2)
    manager.updateSleepStates(0.1, 0.1);
    expect(manager.getBody("mug-1")?.state).toBe("AWAKE");

    // Step another 0.15s -> total 0.25s >= 0.2s -> transitions to SLEEPING
    manager.updateSleepStates(0.15, 0.25);
    expect(manager.getBody("mug-1")?.state).toBe("SLEEPING");

    const events = manager.getEvents();
    expect(events.length).toBe(1);
    expect(events[0].reason).toBe("energy_dwell");
  });

  test("sub-threshold micro-impulse does not wake sleeping body", () => {
    const manager = new MultiBodySleepManager({ wakeImpulseThresholdNs: 0.1 });

    const chair: SleepableBody = {
      id: "chair-1",
      massKg: 6.0,
      momentOfInertia: 0.1,
      position: [1, 0, 1],
      velocity: [0, 0, 0],
      angularVelocity: [0, 0, 0],
      state: "SLEEPING",
      lowEnergyDwellSeconds: 1.0,
      connectedBodyIds: [],
    };

    manager.registerBody(chair);

    // Apply tiny 0.02 N*s impulse (< 0.1)
    const woke = manager.applyImpulse("chair-1", [0.02, 0, 0], 1.0);
    expect(woke).toBe(false);
    expect(manager.getBody("chair-1")?.state).toBe("SLEEPING");
  });

  test("substantial robot impact impulse wakes body and propagates across connected island", () => {
    const manager = new MultiBodySleepManager({ wakeImpulseThresholdNs: 0.05 });

    // Table with lamp on top
    const table: SleepableBody = {
      id: "table-1",
      massKg: 15.0,
      momentOfInertia: 0.8,
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      angularVelocity: [0, 0, 0],
      state: "SLEEPING",
      lowEnergyDwellSeconds: 1.0,
      connectedBodyIds: ["lamp-1"],
    };

    const lamp: SleepableBody = {
      id: "lamp-1",
      massKg: 2.0,
      momentOfInertia: 0.05,
      position: [0, 0.75, 0],
      velocity: [0, 0, 0],
      angularVelocity: [0, 0, 0],
      state: "SLEEPING",
      lowEnergyDwellSeconds: 1.0,
      connectedBodyIds: ["table-1"],
    };

    manager.registerBody(table);
    manager.registerBody(lamp);

    // Robot hits table with 1.5 N*s impulse
    const woke = manager.applyImpulse("table-1", [1.5, 0, 0], 2.0);
    expect(woke).toBe(true);

    // Both table and lamp should now be AWAKE!
    expect(manager.getBody("table-1")?.state).toBe("AWAKE");
    expect(manager.getBody("lamp-1")?.state).toBe("AWAKE");

    // Table velocity updated: 1.5 / 15 = 0.1 m/s
    expect(manager.getBody("table-1")?.velocity[0]).toBeCloseTo(0.1, 4);

    const events = manager.getEvents();
    expect(events.length).toBe(2);
    expect(events.find((e) => e.bodyId === "table-1")?.reason).toBe("impulse_wake");
    expect(events.find((e) => e.bodyId === "lamp-1")?.reason).toBe("island_wake");
  });

  test("sub-millisecond execution benchmark for 100 bodies", () => {
    const manager = new MultiBodySleepManager();
    for (let i = 0; i < 100; i++) {
      manager.registerBody({
        id: `body-${i}`,
        massKg: 1.0,
        momentOfInertia: 0.01,
        position: [i * 0.1, 0, 0],
        velocity: [0, 0, 0],
        angularVelocity: [0, 0, 0],
        state: "AWAKE",
        lowEnergyDwellSeconds: 0.0,
        connectedBodyIds: [],
      });
    }

    const t0 = performance.now();
    for (let frame = 0; frame < 60; frame++) {
      manager.updateSleepStates(1 / 60, frame / 60);
    }
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(35.0); // <35ms for 60 frames of 100 bodies under parallel load
  });
});
