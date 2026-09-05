// Policy-ablation measurement worker (cmaes-ablation-real).
//
// The measured ablation runs a 720-step transformer rollout (~2.4 ms/step in
// this browser) plus a full CMA-ES search — seconds of synchronous compute.
// On the main thread that freezes the page (caught by vision-qa: 2/100
// animation frames on throttled mobile). This worker owns all of it; the
// main thread only renders the returned receipts.
//
// Fixture URLs are resolved against self.location.origin so the fetches work
// regardless of how the bundler materializes the worker script.

import {
  loadAblationInputs,
  runMeasuredAblation,
} from "../lib/policyAblationComparison";

export type AblationWorkerRequest = { type: "measure"; seed: number };
export type AblationWorkerResponse =
  | { type: "result"; seed: number; result: import("../lib/policyAblationComparison").AblationPairResult }
  | { type: "error"; seed: number; error: string };

const self_ = self as unknown as {
  onmessage: ((e: MessageEvent<AblationWorkerRequest>) => void) | null;
  location: { origin: string };
  postMessage: (msg: AblationWorkerResponse) => void;
};

let inputs: Awaited<ReturnType<typeof loadAblationInputs>> | null = null;

self_.onmessage = (e: MessageEvent<AblationWorkerRequest>) => {
  const { seed } = e.data;
  const origin = self_.location.origin;
  const load = (path: string) =>
    fetch(new URL(path, origin)).then((res) => {
      if (!res.ok) throw new Error(`fetch failed ${res.status}: ${path}`);
      return res;
    });
  Promise.all([
    inputs
      ? Promise.resolve(inputs)
      : loadAblationInputs(
          () => load("/robots/g1/transformer/g1-ablation-weights-v3.bin").then((r) => r.arrayBuffer()),
          () => load("/robots/g1/transformer/g1-ablation-train-receipt.json").then((r) => r.json()),
        ),
  ])
    .then(([loaded]) => {
      inputs = loaded;
      const result = runMeasuredAblation(loaded, seed);
      self_.postMessage({ type: "result", seed, result });
    })
    .catch((err: unknown) => {
      self_.postMessage({
        type: "error",
        seed,
        error: err instanceof Error ? err.message : String(err),
      });
    });
};
