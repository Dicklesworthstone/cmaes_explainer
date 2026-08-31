/// <reference lib="webworker" />

// Test entry point: Bun Workers do not provide a `location.href`, but the
// FrankenSim WASM loader requires it to resolve root-relative WASM assets.
// We set a synthetic origin here before importing the real worker module so
// that the compare-family integration test can run against the actual code.
const runtimeLocation =
  typeof globalThis.location?.href === "string"
    ? new URL(globalThis.location.href)
    : null;
if (!runtimeLocation || runtimeLocation.protocol === "file:") {
  // Bun Workers have no location.href, but the WASM loader needs a base URL
  // to resolve the root-relative /wasm/fs-cmaes/... paths. Use a file:// URL
  // pointing at the repo's public directory; Bun's fetch accepts file:// URLs,
  // so the WASM assets load directly without a dev server.
  (globalThis as any).location = {
    href: new URL("../public/", import.meta.url).href,
  };
}

// Bun can deliver the parent's first message while this wrapper is awaiting
// its dynamic import. Queue that message explicitly, then replay it through
// the real worker handler after the module has installed one.
const workerScope = self as DedicatedWorkerGlobalScope;
const pendingMessages: MessageEvent[] = [];
const queueMessage = (event: MessageEvent) => pendingMessages.push(event);
workerScope.onmessage = queueMessage;
await import("../app/workers/armOptimizationWorker");
const realOnMessage = workerScope.onmessage;
if (!realOnMessage || realOnMessage === queueMessage) {
  throw new Error("arm compare test worker failed to install its message handler");
}
for (const event of pendingMessages) realOnMessage.call(workerScope, event);
