"use client";

import { events as defaultEvents, type RootStore } from "@react-three/fiber";

// Wrap the default pointer events so connect() gracefully no-ops if the target is null
// or missing addEventListener. This prevents crashes in headless/sandboxed browsers where
// r3f may try to attach listeners before the DOM node exists.
export function safePointerEvents(store: RootStore) {
  const events = defaultEvents(store);
  const originalConnect = events.connect;
  events.connect = (target) => {
    if (!target || typeof (target as any).addEventListener !== "function") {
        console.warn("[safeR3FEvents] connect() called with invalid target:", target);
        return;
    }
    return originalConnect?.(target);
  };
  return events;
}

export type SafeEventManager = ReturnType<typeof safePointerEvents>;
