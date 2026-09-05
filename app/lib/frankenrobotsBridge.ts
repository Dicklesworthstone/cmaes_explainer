export type FrankenRobotsEngineState = "loading" | "ready" | "running" | "failed";

export const FRANKENROBOTS_BRIDGE_SCHEMA_VERSION = 1;

export type FrankenRobotsLab = "humanoid" | "arm";
export type FrankenRobotsLocomotionTask = "balance" | "stepping" | "walking";
export type FrankenRobotsManipulationTask =
  | "kitchen-mug"
  | "living-room-remote"
  | "backyard-trowel";
export type FrankenRobotsChallenge = "flat" | "terrain-and-push";
export type FrankenRobotsOptimizerFamily = "full" | "separable" | "lm-cma" | "lm-ma";
export type FrankenRobotsCamera =
  | "orbit"
  | "follow"
  | "pov"
  | "blueprint"
  | "studio"
  | "microscope"
  | "overhead"
  | "side"
  | "front"
  | "fly";
export type FrankenRobotsPlaybackSpeed = 0.25 | 0.5 | 1 | 2;
export type FrankenRobotsReceiptLens =
  | "owner-receipt"
  | "cautious-monk"
  | "olympic-sprinter"
  | "glass-floor";
export type FrankenRobotsOverlay = "xray" | "physics-debug" | "friction-cones";
export type FrankenRobotsCommandKind =
  | "optimize"
  | "stop"
  | "select-task"
  | "select-challenge"
  | "select-family"
  | "replay"
  | "play"
  | "pause"
  | "seek"
  | "set-speed"
  | "set-camera"
  | "select-receipt-lens"
  | "set-overlay";

export type FrankenRobotsNativeCommand = {
  type: "engine.command";
  schemaVersion: 1;
  commandId: string;
  lab: FrankenRobotsLab;
  command: FrankenRobotsCommandKind;
  task?: FrankenRobotsLocomotionTask | FrankenRobotsManipulationTask;
  challenge?: FrankenRobotsChallenge;
  family?: FrankenRobotsOptimizerFamily;
  sampleIndex?: number;
  speed?: FrankenRobotsPlaybackSpeed;
  camera?: FrankenRobotsCamera;
  receiptLens?: FrankenRobotsReceiptLens;
  overlay?: FrankenRobotsOverlay;
  enabled?: boolean;
};

export type FrankenRobotsCommandResult = {
  accepted: boolean;
  detail: string;
};

type NativeMessageHandler = {
  postMessage: (payload: Record<string, unknown>) => void;
};

type NativeBridgeWindow = Window & {
  webkit?: {
    messageHandlers?: {
      frankenrobots?: NativeMessageHandler;
    };
  };
  __frankenrobotsReceiveNativeCommand?: (payload: unknown) => boolean;
};

const nextSequenceByLab: Record<FrankenRobotsLab, number> = {
  humanoid: 0,
  arm: 0,
};

// React reinstalls the focused route's command closure whenever one of its
// owner settings changes. Keep receipts outside that closure so a WebKit retry
// of an already-accepted command cannot start a second optimization run.
const commandOutcomesByLab: Record<
  FrankenRobotsLab,
  Map<string, FrankenRobotsCommandResult>
> = {
  humanoid: new Map(),
  arm: new Map(),
};

function postNativeMessage(
  lab: FrankenRobotsLab,
  payload: Record<string, unknown>,
): void {
  const bridge = (window as NativeBridgeWindow).webkit?.messageHandlers?.frankenrobots;
  nextSequenceByLab[lab] += 1;
  bridge?.postMessage({
    schemaVersion: FRANKENROBOTS_BRIDGE_SCHEMA_VERSION,
    sequence: nextSequenceByLab[lab],
    lab,
    ...payload,
  });
}

export function decodeFrankenRobotsNativeCommand(
  payload: unknown,
  expectedLab: FrankenRobotsLab,
): FrankenRobotsNativeCommand | null {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return null;
  const candidate = payload as Record<string, unknown>;
  if (
    candidate.type !== "engine.command" ||
    candidate.schemaVersion !== FRANKENROBOTS_BRIDGE_SCHEMA_VERSION ||
    candidate.lab !== expectedLab ||
    (candidate.command !== "optimize" &&
      candidate.command !== "stop" &&
      candidate.command !== "select-task" &&
      candidate.command !== "select-challenge" &&
      candidate.command !== "select-family" &&
      candidate.command !== "replay" &&
      candidate.command !== "play" &&
      candidate.command !== "pause" &&
      candidate.command !== "seek" &&
      candidate.command !== "set-speed" &&
      candidate.command !== "set-camera" &&
      candidate.command !== "select-receipt-lens" &&
      candidate.command !== "set-overlay") ||
    typeof candidate.commandId !== "string" ||
    !/^[A-Za-z0-9._-]{1,80}$/.test(candidate.commandId)
  ) {
    return null;
  }
  if (candidate.command === "select-task") {
    const validHumanoidTask =
      expectedLab === "humanoid" &&
      (candidate.task === "balance" ||
        candidate.task === "stepping" ||
        candidate.task === "walking");
    const validArmTask =
      expectedLab === "arm" &&
      (candidate.task === "kitchen-mug" ||
        candidate.task === "living-room-remote" ||
        candidate.task === "backyard-trowel");
    if (
      (!validHumanoidTask && !validArmTask) ||
      candidate.challenge !== undefined ||
      candidate.family !== undefined ||
      candidate.sampleIndex !== undefined ||
      candidate.speed !== undefined ||
      candidate.camera !== undefined ||
      candidate.receiptLens !== undefined ||
      candidate.overlay !== undefined ||
      candidate.enabled !== undefined
    ) {
      return null;
    }
  } else if (candidate.command === "select-challenge") {
    if (
      expectedLab !== "humanoid" ||
      (candidate.challenge !== "flat" && candidate.challenge !== "terrain-and-push") ||
      candidate.task !== undefined ||
      candidate.family !== undefined ||
      candidate.sampleIndex !== undefined ||
      candidate.speed !== undefined ||
      candidate.camera !== undefined ||
      candidate.receiptLens !== undefined ||
      candidate.overlay !== undefined ||
      candidate.enabled !== undefined
    ) {
      return null;
    }
  } else if (candidate.command === "select-family") {
    const validFamily =
      candidate.family === "separable" ||
      candidate.family === "lm-cma" ||
      candidate.family === "lm-ma" ||
      (expectedLab === "arm" && candidate.family === "full");
    if (
      !validFamily ||
      candidate.task !== undefined ||
      candidate.challenge !== undefined ||
      candidate.sampleIndex !== undefined ||
      candidate.speed !== undefined ||
      candidate.camera !== undefined ||
      candidate.receiptLens !== undefined ||
      candidate.overlay !== undefined ||
      candidate.enabled !== undefined
    ) {
      return null;
    }
  } else if (candidate.command === "seek") {
    if (
      !Number.isSafeInteger(candidate.sampleIndex) ||
      (candidate.sampleIndex as number) < 0 ||
      candidate.task !== undefined ||
      candidate.challenge !== undefined ||
      candidate.family !== undefined ||
      candidate.speed !== undefined ||
      candidate.camera !== undefined ||
      candidate.receiptLens !== undefined ||
      candidate.overlay !== undefined ||
      candidate.enabled !== undefined
    ) {
      return null;
    }
  } else if (candidate.command === "set-speed") {
    if (
      (candidate.speed !== 0.25 &&
        candidate.speed !== 0.5 &&
        candidate.speed !== 1 &&
        candidate.speed !== 2) ||
      candidate.task !== undefined ||
      candidate.challenge !== undefined ||
      candidate.family !== undefined ||
      candidate.sampleIndex !== undefined ||
      candidate.camera !== undefined ||
      candidate.receiptLens !== undefined ||
      candidate.overlay !== undefined ||
      candidate.enabled !== undefined
    ) {
      return null;
    }
  } else if (candidate.command === "set-camera") {
    const validCamera =
      expectedLab === "humanoid"
        ? candidate.camera === "orbit" ||
          candidate.camera === "follow" ||
          candidate.camera === "pov" ||
          candidate.camera === "blueprint" ||
          candidate.camera === "fly"
        : candidate.camera === "studio" ||
          candidate.camera === "microscope" ||
          candidate.camera === "overhead" ||
          candidate.camera === "side" ||
          candidate.camera === "front" ||
          candidate.camera === "fly";
    if (
      !validCamera ||
      candidate.task !== undefined ||
      candidate.challenge !== undefined ||
      candidate.family !== undefined ||
      candidate.sampleIndex !== undefined ||
      candidate.speed !== undefined ||
      candidate.receiptLens !== undefined ||
      candidate.overlay !== undefined ||
      candidate.enabled !== undefined
    ) {
      return null;
    }
  } else if (candidate.command === "select-receipt-lens") {
    if (
      expectedLab !== "humanoid" ||
      (candidate.receiptLens !== "owner-receipt" &&
        candidate.receiptLens !== "cautious-monk" &&
        candidate.receiptLens !== "olympic-sprinter" &&
        candidate.receiptLens !== "glass-floor") ||
      candidate.task !== undefined ||
      candidate.challenge !== undefined ||
      candidate.family !== undefined ||
      candidate.sampleIndex !== undefined ||
      candidate.speed !== undefined ||
      candidate.camera !== undefined ||
      candidate.overlay !== undefined ||
      candidate.enabled !== undefined
    ) {
      return null;
    }
  } else if (candidate.command === "set-overlay") {
    const validOverlay =
      expectedLab === "humanoid"
        ? candidate.overlay === "xray" || candidate.overlay === "physics-debug"
        : candidate.overlay === "friction-cones" || candidate.overlay === "physics-debug";
    if (
      !validOverlay ||
      typeof candidate.enabled !== "boolean" ||
      candidate.task !== undefined ||
      candidate.challenge !== undefined ||
      candidate.family !== undefined ||
      candidate.sampleIndex !== undefined ||
      candidate.speed !== undefined ||
      candidate.camera !== undefined ||
      candidate.receiptLens !== undefined
    ) {
      return null;
    }
  } else if (
    candidate.task !== undefined ||
    candidate.challenge !== undefined ||
    candidate.family !== undefined ||
    candidate.sampleIndex !== undefined ||
    candidate.speed !== undefined ||
    candidate.camera !== undefined ||
    candidate.receiptLens !== undefined ||
    candidate.overlay !== undefined ||
    candidate.enabled !== undefined
  ) {
    return null;
  }
  return candidate as FrankenRobotsNativeCommand;
}

/**
 * Install the single, page-owned native command entry point. Command IDs are
 * idempotent for the lifetime of the focused route: a WebKit retry receives
 * another acknowledgement but never starts a second owner run.
 */
export function installFrankenRobotsNativeCommandHandler(
  lab: FrankenRobotsLab,
  handler: (command: FrankenRobotsNativeCommand) => FrankenRobotsCommandResult,
): () => void {
  if (typeof window === "undefined") return () => {};
  const bridgeWindow = window as NativeBridgeWindow;
  const previous = bridgeWindow.__frankenrobotsReceiveNativeCommand;
  const outcomes = commandOutcomesByLab[lab];

  const receive = (payload: unknown): boolean => {
    const command = decodeFrankenRobotsNativeCommand(payload, lab);
    if (!command) return false;

    let result = outcomes.get(command.commandId);
    if (!result) {
      try {
        result = handler(command);
      } catch (error) {
        result = {
          accepted: false,
          detail: error instanceof Error ? error.message : "The command handler refused the request.",
        };
      }
      if (!result.detail.trim()) {
        result = { accepted: false, detail: "The command handler returned no receipt detail." };
      }
      outcomes.set(command.commandId, result);
      if (outcomes.size > 32) outcomes.delete(outcomes.keys().next().value as string);
    }

    postNativeMessage(lab, {
      type: "engine.command.ack",
      commandId: command.commandId,
      command: command.command,
      ...(command.task ? { task: command.task } : {}),
      ...(command.challenge ? { challenge: command.challenge } : {}),
      ...(command.family ? { family: command.family } : {}),
      ...(command.sampleIndex !== undefined ? { sampleIndex: command.sampleIndex } : {}),
      ...(command.speed !== undefined ? { speed: command.speed } : {}),
      ...(command.camera ? { camera: command.camera } : {}),
      ...(command.receiptLens ? { receiptLens: command.receiptLens } : {}),
      ...(command.overlay ? { overlay: command.overlay } : {}),
      ...(command.enabled !== undefined ? { enabled: command.enabled } : {}),
      accepted: result.accepted,
      detail: result.detail.slice(0, 300),
    });
    // `true` means the typed command reached the page-owned handler. Owner
    // acceptance or refusal is carried only by the acknowledgement above;
    // conflating the two made native replace useful refusal details with a
    // generic "not ready" delivery error.
    return true;
  };

  bridgeWindow.__frankenrobotsReceiveNativeCommand = receive;
  return () => {
    if (bridgeWindow.__frankenrobotsReceiveNativeCommand === receive) {
      bridgeWindow.__frankenrobotsReceiveNativeCommand = previous;
    }
  };
}

/**
 * Report the real worker/owner state to the native shell when hosted by the
 * FrankenRobots app. Ordinary browsers intentionally receive no side effect.
 */
export function reportFrankenRobotsEngineState(
  lab: FrankenRobotsLab,
  state: FrankenRobotsEngineState,
  detail: string,
  metrics: Record<string, number | string | boolean | null> = {},
): void {
  if (typeof window === "undefined") return;
  postNativeMessage(lab, {
    type: "engine.status",
    state,
    detail,
    metrics,
    capabilities:
      lab === "humanoid"
        ? [
            "optimize",
            "select-task",
            "select-challenge",
            "select-family",
            "replay",
            "playback",
            "seek",
            "set-speed",
            "set-camera",
            "select-receipt-lens",
            "set-overlay",
          ]
        : [
            "optimize",
            "select-task",
            "select-family",
            "replay",
            "playback",
            "seek",
            "set-speed",
            "set-camera",
            "set-overlay",
          ],
  });
}

export function reportFrankenRobotsTraceState(
  lab: FrankenRobotsLab,
  state: {
    sampleIndex: number;
    sampleCount: number;
    playing: boolean;
    speed: FrankenRobotsPlaybackSpeed;
    camera: FrankenRobotsCamera;
    receiptLens?: FrankenRobotsReceiptLens;
    overlays: FrankenRobotsOverlay[];
  },
): void {
  if (typeof window === "undefined") return;
  postNativeMessage(lab, {
    type: "trace.state",
    sampleIndex: state.sampleIndex,
    sampleCount: state.sampleCount,
    playing: state.playing,
    speed: state.speed,
    camera: state.camera,
    ...(state.receiptLens ? { receiptLens: state.receiptLens } : {}),
    overlays: state.overlays,
  });
}
