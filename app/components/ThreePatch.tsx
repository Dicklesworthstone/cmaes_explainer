"use client";

import * as THREE from "three";
import { useEffect } from "react";
import type { ReactNode } from "react";

interface TimerConstructor {
  new (): any;
  prototype: {
    connect(doc?: Document | null): void;
    __patchedConnect?: boolean | Function;
  };
  __patchedConnect?: boolean;
}

interface ThreeWithTimer {
  Timer?: TimerConstructor;
}

function patchNow() {
  const Timer = (THREE as unknown as ThreeWithTimer).Timer;
  if (!Timer || Timer.__patchedConnect) return;
  const original = Timer.prototype.connect;
  Timer.__patchedConnect = true;
  Timer.prototype.connect = function safeConnect(doc?: Document | null) {
    if (!doc && typeof window !== "undefined") doc = window.document;
    if (!doc || typeof doc.addEventListener !== "function") return;
    // Skip visibility listener entirely; it's not critical for us.
    return;
  };
}

export function ThreePatch({ children }: { children: ReactNode }) {
  patchNow();
  useEffect(() => {
    // Also patch the actual module instance used by turbopack/r3f
    import("three/src/core/Timer.js")
      .then((mod: { default?: TimerConstructor; Timer?: TimerConstructor }) => {
        const Timer = mod.default || mod.Timer || (mod as unknown as TimerConstructor);
        if (Timer && !Timer.__patchedConnect) {
          Timer.__patchedConnect = true;
          Timer.prototype.connect = function safeConnect(doc?: Document | null) {
            return; // no-op
          };
        }
      })
      .catch(() => {});
  }, []);
  return <>{children}</>;
}
