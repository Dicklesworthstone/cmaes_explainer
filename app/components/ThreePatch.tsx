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
  return <>{children}</>;
}
