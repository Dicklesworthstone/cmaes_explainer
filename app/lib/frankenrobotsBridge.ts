export type FrankenRobotsEngineState = "loading" | "ready" | "running" | "failed";

export const FRANKENROBOTS_BRIDGE_SCHEMA_VERSION = 1;

type NativeMessageHandler = {
  postMessage: (payload: Record<string, unknown>) => void;
};

type NativeBridgeWindow = Window & {
  webkit?: {
    messageHandlers?: {
      frankenrobots?: NativeMessageHandler;
    };
  };
};

const nextSequenceByLab: Record<"humanoid" | "arm", number> = {
  humanoid: 0,
  arm: 0,
};

/**
 * Report the real worker/owner state to the native shell when hosted by the
 * FrankenRobots app. Ordinary browsers intentionally receive no side effect.
 */
export function reportFrankenRobotsEngineState(
  lab: "humanoid" | "arm",
  state: FrankenRobotsEngineState,
  detail: string,
  metrics: Record<string, number | string | boolean | null> = {},
): void {
  if (typeof window === "undefined") return;
  const bridge = (window as NativeBridgeWindow).webkit?.messageHandlers?.frankenrobots;
  nextSequenceByLab[lab] += 1;
  bridge?.postMessage({
    type: "engine.status",
    schemaVersion: FRANKENROBOTS_BRIDGE_SCHEMA_VERSION,
    sequence: nextSequenceByLab[lab],
    lab,
    state,
    detail,
    metrics,
  });
}
