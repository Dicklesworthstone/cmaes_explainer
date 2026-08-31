"use client";

// Registers the /robots/g1/*.STL cache service worker (public/sw.js). P-02:
// returning visitors do not re-download the 16 MB of mesh files. The SW is
// scoped to the same origin and only intercepts `/robots/g1/*.STL`; Next.js
// bundles are untouched. Registration is gated to production (the worker
// is a no-op in `next dev` because of HMR interactions — dev uses webpack's
// own SW slot, and we want a stable dev experience without SW interference).

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") return;
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch((err: unknown) => {
        // Soft-fail: the page still works without the SW (mesh parse runs in
        // the main thread on every visit, just without the per-file network
        // cache). Log once and move on.
        console.warn("[sw] registration failed", err);
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
