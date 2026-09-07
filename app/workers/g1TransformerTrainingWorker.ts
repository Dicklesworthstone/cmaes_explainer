// In-browser residual training against the real G1 walking owner.
//
// Each pump is one full physics rollout — roughly a quarter second of solid
// compute — and a useful run is thousands of them. On the main thread that is
// a frozen tab, so the trainer lives here and the page only renders the
// progress packets it posts back.
//
// The loop yields between rollouts so a "stop" message is acted on promptly
// rather than after the whole run, and it batches progress posts because the
// UI cannot use sixty updates a second and the postMessage traffic is not
// free.

import {
  createFrankenSimG1TransformerTrainer,
  type FrankenSimG1TransformerTrainer,
  type G1TraceReceipt,
  type G1TransformerChallenge,
  type G1TransformerProgress,
} from "../lib/frankensimCmaes";

export type TrainingWorkerRequest =
  | {
      type: "start";
      challenge: G1TransformerChallenge;
      durationSeconds: number;
      sigma: number;
      seed: number;
    }
  | { type: "stop" }
  | { type: "export" }
  | { type: "trace" };

export type TrainingWorkerResponse =
  | { type: "progress"; progress: G1TransformerProgress }
  | { type: "stopped"; progress: G1TransformerProgress | null }
  | { type: "weights"; bytes: Uint8Array; progress: G1TransformerProgress }
  | {
      type: "trace";
      trained: G1TraceReceipt;
      baseline: G1TraceReceipt;
      progress: G1TransformerProgress;
    }
  /**
   * `fatal` distinguishes "the run is over" from "that one request failed".
   * A failed export must not stop training, and must not make the page think
   * training stopped while the worker is still pumping.
   */
  | { type: "error"; error: string; fatal: boolean };

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<TrainingWorkerRequest>) => void) | null;
  postMessage: (msg: TrainingWorkerResponse) => void;
};

let trainer: FrankenSimG1TransformerTrainer | null = null;
let running = false;
let latest: G1TransformerProgress | null = null;
let runRevision = 0;
/** Config the live trainer was built for, so an unchanged restart can resume. */
let activeKey: string | null = null;

function configKey(
  request: Extract<TrainingWorkerRequest, { type: "start" }>,
): string {
  return [
    request.challenge,
    request.durationSeconds,
    request.sigma,
    request.seed,
  ].join(":");
}

/** Post at most this often; a rollout is fast enough to outpace a repaint. */
const PROGRESS_INTERVAL_MS = 250;

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** The run cannot continue. */
function fail(error: unknown): void {
  running = false;
  runRevision += 1;
  scope.postMessage({ type: "error", error: describe(error), fatal: true });
}

/** One request failed; whatever the loop is doing carries on. */
function reportError(error: unknown): void {
  scope.postMessage({ type: "error", error: describe(error), fatal: false });
}

async function loop(
  activeTrainer: FrankenSimG1TransformerTrainer,
  revision: number,
): Promise<void> {
  if (!running || revision !== runRevision) return;
  latest = activeTrainer.progress();
  scope.postMessage({ type: "progress", progress: latest });
  let lastPost = 0;
  while (running && revision === runRevision) {
    const progress = activeTrainer.pump();
    latest = progress;
    const now = Date.now();
    // Always report a closed generation: that is when the distribution moved,
    // and it is the event a learning curve is actually made of.
    if (
      progress.status === "generation" ||
      now - lastPost >= PROGRESS_INTERVAL_MS
    ) {
      lastPost = now;
      scope.postMessage({ type: "progress", progress });
    }
    if (progress.status === "stopped") {
      running = false;
      scope.postMessage({ type: "stopped", progress });
      return;
    }
    // Yield so a stop message is delivered between rollouts.
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

scope.onmessage = (event: MessageEvent<TrainingWorkerRequest>) => {
  const request = event.data;
  if (request.type === "stop") {
    running = false;
    runRevision += 1;
    scope.postMessage({ type: "stopped", progress: latest });
    return;
  }
  if (request.type === "trace") {
    try {
      if (!trainer || !latest) throw new Error("no trained policy yet");
      // Two extra rollouts, taken here rather than on the main thread: with
      // poses retained they are the most expensive thing this worker does.
      const trained = trainer.trace(true);
      const baseline = trainer.trace(false);
      if ("refusal" in trained) throw new Error(`trained rollout refused: ${trained.refusal.name}`);
      if ("refusal" in baseline) throw new Error(`baseline rollout refused: ${baseline.refusal.name}`);
      scope.postMessage({
        type: "trace",
        trained: trained.ok,
        baseline: baseline.ok,
        progress: latest,
      });
    } catch (error) {
      reportError(error);
    }
    return;
  }
  if (request.type === "export") {
    try {
      if (!trainer || !latest) throw new Error("no trained policy yet");
      scope.postMessage({
        type: "weights",
        bytes: trainer.exportWeights(),
        progress: latest,
      });
    } catch (error) {
      reportError(error);
    }
    return;
  }
  if (running) return;
  // Claim the run before loading WASM. Stop cancels this initialization as
  // well as a pumping loop, and a later Start receives a different revision.
  running = true;
  const revision = ++runRevision;
  const key = configKey(request);
  // Resuming the same configuration keeps everything already learned. A run
  // left going for an hour must not be thrown away because someone pressed
  // stop and start again.
  if (trainer && activeKey === key) {
    void loop(trainer, revision).catch((error: unknown) => {
      if (revision === runRevision) fail(error);
    });
    return;
  }
  trainer?.free();
  trainer = null;
  latest = null;
  activeKey = null;
  createFrankenSimG1TransformerTrainer({
    challenge: request.challenge,
    durationSeconds: request.durationSeconds,
    sigma: request.sigma,
    seed: request.seed,
  })
    .then((created) => {
      if (revision !== runRevision) {
        created.free();
        return;
      }
      trainer = created;
      activeKey = key;
      return loop(created, revision);
    })
    .catch((error: unknown) => {
      if (revision === runRevision) fail(error);
    });
};
