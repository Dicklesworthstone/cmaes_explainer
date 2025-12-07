"use client";

interface TimerCtor {
  prototype: {
    connect: (doc?: Document | null) => void;
    __patchedConnect?: any;
  };
}

/**
 * Runtime guard for Three.js Timer.connect blowing up when it receives a null document.
 * We patch whichever Timer constructor is available at runtime (both module import and any global THREE).
 * Safe to run multiple times.
 */
function patchTimerTimer(timerCtor: TimerCtor | undefined) {
  if (!timerCtor || !timerCtor.prototype || !timerCtor.prototype.connect) return;
  if (timerCtor.prototype.__patchedConnect) return; // already patched
  const original = timerCtor.prototype.connect;
  timerCtor.prototype.__patchedConnect = original;
  timerCtor.prototype.connect = function patchedConnect(doc: Document | null | undefined) {
    if (!doc && typeof window !== "undefined") doc = window.document;
    // Bail out entirely if we still don't have a usable document or listeners
    if (!doc || typeof doc.addEventListener !== "function") return;
    
    return original.call(this, doc);
  };
  if (typeof console !== "undefined") {
    console.log("[three-patch] Timer.connect patched");
  }
}

// Patch the module instance we import
import * as THREE from "three";
patchTimerTimer((THREE as unknown as { Timer?: TimerCtor }).Timer);

// Patch a global THREE if it appears later (e.g., other bundles)
if (typeof window !== "undefined") {
  const maybePatchGlobal = () => patchTimerTimer((window as unknown as { THREE?: { Timer?: TimerCtor } }).THREE?.Timer);
  maybePatchGlobal();
  // Re-check a few times after startup in case THREE is attached later.
  let attempts = 0;
  const id = window.setInterval(() => {
    attempts += 1;
    maybePatchGlobal();
    if (attempts > 5) window.clearInterval(id);
  }, 200);
}
