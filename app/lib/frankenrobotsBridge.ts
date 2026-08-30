export type FrankenRobotsEngineState = "loading" | "ready" | "running" | "failed";

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

/**
 * Report the real worker/owner state to the native shell when hosted by the
 * FrankenRobots app. Ordinary browsers intentionally receive no side effect.
 */
export function reportFrankenRobotsEngineState(
  lab: "humanoid" | "arm",
  state: FrankenRobotsEngineState,
  detail: string,
  metrics: Record<string, number | string | null> = {},
): void {
  if (typeof window === "undefined") return;
  const bridge = (window as NativeBridgeWindow).webkit?.messageHandlers?.frankenrobots;
  bridge?.postMessage({
    type: "engine.status",
    lab,
    state,
    detail,
    metrics,
  });
}
