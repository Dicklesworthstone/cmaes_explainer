import { describe, expect, test } from "bun:test";
import {
  decodeFrankenRobotsNativeCommand,
  installFrankenRobotsNativeCommandHandler,
} from "./frankenrobotsBridge";

describe("FrankenRobots native command contract", () => {
  const valid = {
    type: "engine.command",
    schemaVersion: 1,
    commandId: "9B84A8A2-1",
    lab: "humanoid",
    command: "optimize",
  } as const;

  test("accepts current-schema start and stop commands", () => {
    expect(decodeFrankenRobotsNativeCommand(valid, "humanoid")).toEqual(valid);
    const stop = { ...valid, commandId: "9B84A8A2-stop", command: "stop" } as const;
    expect(decodeFrankenRobotsNativeCommand(stop, "humanoid")).toEqual(stop);
  });

  test("accepts only lab-appropriate typed task selection", () => {
    const selection = {
      ...valid,
      commandId: "9B84A8A2-walk",
      command: "select-task",
      task: "walking",
    } as const;
    expect(decodeFrankenRobotsNativeCommand(selection, "humanoid")).toEqual(selection);
    expect(decodeFrankenRobotsNativeCommand(selection, "arm")).toBeNull();
    const armSelection = {
      ...valid,
      commandId: "9B84A8A2-mug",
      lab: "arm",
      command: "select-task",
      task: "kitchen-mug",
    } as const;
    expect(decodeFrankenRobotsNativeCommand(armSelection, "arm")).toEqual(armSelection);
    expect(decodeFrankenRobotsNativeCommand(armSelection, "humanoid")).toBeNull();
    expect(
      decodeFrankenRobotsNativeCommand({ ...selection, task: "dancing" }, "humanoid"),
    ).toBeNull();
    expect(
      decodeFrankenRobotsNativeCommand({ ...valid, task: "walking" }, "humanoid"),
    ).toBeNull();
  });

  test("accepts strict challenge and optimizer-family selections", () => {
    const challenge = {
      ...valid,
      commandId: "9B84A8A2-terrain",
      command: "select-challenge",
      challenge: "terrain-and-push",
    } as const;
    expect(decodeFrankenRobotsNativeCommand(challenge, "humanoid")).toEqual(challenge);
    expect(decodeFrankenRobotsNativeCommand({ ...challenge, lab: "arm" }, "arm")).toBeNull();

    const scalableFamily = {
      ...valid,
      commandId: "9B84A8A2-lmma",
      command: "select-family",
      family: "lm-ma",
    } as const;
    expect(decodeFrankenRobotsNativeCommand(scalableFamily, "humanoid")).toEqual(scalableFamily);
    expect(
      decodeFrankenRobotsNativeCommand({ ...scalableFamily, lab: "arm" }, "arm"),
    ).toEqual({ ...scalableFamily, lab: "arm" });
    expect(
      decodeFrankenRobotsNativeCommand({ ...scalableFamily, family: "full" }, "humanoid"),
    ).toBeNull();
    expect(
      decodeFrankenRobotsNativeCommand(
        { ...scalableFamily, lab: "arm", family: "full" },
        "arm",
      ),
    ).not.toBeNull();
    expect(
      decodeFrankenRobotsNativeCommand({ ...challenge, task: "walking" }, "humanoid"),
    ).toBeNull();
    expect(
      decodeFrankenRobotsNativeCommand({ ...scalableFamily, challenge: "flat" }, "humanoid"),
    ).toBeNull();
  });

  test("accepts only bounded playback and lab-specific camera commands", () => {
    for (const command of ["replay", "play", "pause"] as const) {
      const transport = { ...valid, commandId: `transport-${command}`, command } as const;
      expect(decodeFrankenRobotsNativeCommand(transport, "humanoid")).toEqual(transport);
    }

    const seek = { ...valid, commandId: "seek-12", command: "seek", sampleIndex: 12 } as const;
    expect(decodeFrankenRobotsNativeCommand(seek, "humanoid")).toEqual(seek);
    expect(decodeFrankenRobotsNativeCommand({ ...seek, sampleIndex: -1 }, "humanoid")).toBeNull();
    expect(decodeFrankenRobotsNativeCommand({ ...seek, sampleIndex: 1.5 }, "humanoid")).toBeNull();
    expect(decodeFrankenRobotsNativeCommand({ ...seek, speed: 1 }, "humanoid")).toBeNull();

    for (const speed of [0.25, 0.5, 1, 2] as const) {
      const selection = { ...valid, commandId: `speed-${speed}`, command: "set-speed", speed } as const;
      expect(decodeFrankenRobotsNativeCommand(selection, "humanoid")).toEqual(selection);
    }
    expect(
      decodeFrankenRobotsNativeCommand(
        { ...valid, command: "set-speed", speed: 4 },
        "humanoid",
      ),
    ).toBeNull();

    const humanoidCamera = {
      ...valid,
      commandId: "camera-blueprint",
      command: "set-camera",
      camera: "blueprint",
    } as const;
    expect(decodeFrankenRobotsNativeCommand(humanoidCamera, "humanoid")).toEqual(humanoidCamera);
    expect(
      decodeFrankenRobotsNativeCommand({ ...humanoidCamera, camera: "studio" }, "humanoid"),
    ).toBeNull();

    const armCamera = {
      ...valid,
      commandId: "camera-microscope",
      lab: "arm",
      command: "set-camera",
      camera: "microscope",
    } as const;
    expect(decodeFrankenRobotsNativeCommand(armCamera, "arm")).toEqual(armCamera);
    expect(decodeFrankenRobotsNativeCommand({ ...armCamera, camera: "pov" }, "arm")).toBeNull();
  });

  test("rejects foreign schema, lab, command, and unsafe IDs", () => {
    expect(decodeFrankenRobotsNativeCommand({ ...valid, schemaVersion: 2 }, "humanoid")).toBeNull();
    expect(decodeFrankenRobotsNativeCommand(valid, "arm")).toBeNull();
    expect(decodeFrankenRobotsNativeCommand({ ...valid, command: "eval" }, "humanoid")).toBeNull();
    expect(decodeFrankenRobotsNativeCommand({ ...valid, commandId: "bad id" }, "humanoid")).toBeNull();
    expect(decodeFrankenRobotsNativeCommand(null, "humanoid")).toBeNull();
  });

  test("acknowledges a retry without invoking the owner twice across handler reinstalls", () => {
    const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    const messages: Record<string, unknown>[] = [];
    const fakeWindow = {
      webkit: {
        messageHandlers: {
          frankenrobots: { postMessage: (message: Record<string, unknown>) => messages.push(message) },
        },
      },
    };
    Object.defineProperty(globalThis, "window", { configurable: true, value: fakeWindow });
    let invocations = 0;
    try {
      const cleanup = installFrankenRobotsNativeCommandHandler("humanoid", () => {
        invocations += 1;
        return { accepted: true, detail: "Owner run accepted." };
      });
      const receive = (fakeWindow as typeof fakeWindow & {
        __frankenrobotsReceiveNativeCommand: (payload: unknown) => boolean;
      }).__frankenrobotsReceiveNativeCommand;
      expect(receive(valid)).toBe(true);
      expect(receive(valid)).toBe(true);
      expect(invocations).toBe(1);
      expect(messages).toHaveLength(2);
      expect(messages.map((message) => message.type)).toEqual([
        "engine.command.ack",
        "engine.command.ack",
      ]);
      cleanup();

      let replacementInvocations = 0;
      const cleanupReplacement = installFrankenRobotsNativeCommandHandler("humanoid", () => {
        replacementInvocations += 1;
        return { accepted: true, detail: "This must not replace the first receipt." };
      });
      const receiveReplacement = (fakeWindow as typeof fakeWindow & {
        __frankenrobotsReceiveNativeCommand: (payload: unknown) => boolean;
      }).__frankenrobotsReceiveNativeCommand;
      expect(receiveReplacement(valid)).toBe(true);
      expect(replacementInvocations).toBe(0);
      expect(messages).toHaveLength(3);
      expect(messages.map((message) => message.detail)).toEqual([
        "Owner run accepted.",
        "Owner run accepted.",
        "Owner run accepted.",
      ]);
      cleanupReplacement();
    } finally {
      if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
      else Reflect.deleteProperty(globalThis, "window");
    }
  });

  test("reports an owner refusal as delivered and preserves its typed receipt", () => {
    const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    const messages: Record<string, unknown>[] = [];
    const fakeWindow = {
      webkit: {
        messageHandlers: {
          frankenrobots: { postMessage: (message: Record<string, unknown>) => messages.push(message) },
        },
      },
    };
    Object.defineProperty(globalThis, "window", { configurable: true, value: fakeWindow });
    try {
      const cleanup = installFrankenRobotsNativeCommandHandler("humanoid", () => ({
        accepted: false,
        detail: "An owner request is already running.",
      }));
      const receive = (fakeWindow as typeof fakeWindow & {
        __frankenrobotsReceiveNativeCommand: (payload: unknown) => boolean;
      }).__frankenrobotsReceiveNativeCommand;
      const refused = { ...valid, commandId: "9B84A8A2-refused" } as const;
      expect(receive(refused)).toBe(true);
      expect(messages).toHaveLength(1);
      expect(messages[0]).toMatchObject({
        type: "engine.command.ack",
        accepted: false,
        detail: "An owner request is already running.",
      });
      cleanup();
    } finally {
      if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
      else Reflect.deleteProperty(globalThis, "window");
    }
  });
});
