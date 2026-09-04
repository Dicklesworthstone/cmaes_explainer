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
});
