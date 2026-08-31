"use client";

// FreeFlyHintBanner — surfaces the Free-Fly 6-DOF camera keybindings
// when the user enters fly mode in either flagship.
//
// Before this banner existed, the keybindings (W/A/S/D + Q/E + RMB
// drag) were documented only in code comments (G1 line 1038, arm
// line 771). The user had no way to discover the controls without
// reading the source. The banner makes the controls discoverable
// without cluttering the chrome when fly mode is not active.
//
// The banner is:
//   - Positioned bottom-center so it doesn't overlap the camera
//     mode selector (top-right) or the collision badges (top-left).
//   - Dismissable via the × button; dismissal is per-session (the
//     component remounts when the user re-enters fly mode).
//   - Auto-hides after 8 seconds for users who just want to play.
//   - Purely visual: zero effect on the camera or the simulation.

import { useEffect, useState } from "react";

export interface FreeFlyHintBannerProps {
  visible: boolean;
}

export function FreeFlyHintBanner({ visible }: FreeFlyHintBannerProps) {
  const [prevVisible, setPrevVisible] = useState(visible);
  const [dismissed, setDismissed] = useState(false);
  const [autoHidden, setAutoHidden] = useState(false);

  // Reset dismissal/auto-hide when the user re-enters fly mode.
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setDismissed(false);
      setAutoHidden(false);
    }
  }

  // Auto-hide after 8 seconds. The user can still see the bottom
  // HUD's "Free-fly 6-DOF: WASD + Q/E + drag to look." text which
  // is always present, so the banner is a discoverability boost,
  // not the only source of truth.
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setAutoHidden(true), 8_000);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible || dismissed || autoHidden) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-20 z-20 flex justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-cyan-400/40 bg-slate-950/90 px-4 py-2.5 text-cyan-100 shadow-[0_0_18px_rgba(6,182,212,0.25)] backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-cyan-400/40 bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[0.7rem] font-bold">
            W
          </span>
          <span className="rounded-md border border-cyan-400/40 bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[0.7rem] font-bold">
            A
          </span>
          <span className="rounded-md border border-cyan-400/40 bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[0.7rem] font-bold">
            S
          </span>
          <span className="rounded-md border border-cyan-400/40 bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[0.7rem] font-bold">
            D
          </span>
          <span className="ml-1 text-[0.7rem] text-cyan-200/80">move</span>
        </div>
        <div className="h-4 w-px bg-cyan-400/30" aria-hidden />
        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-cyan-400/40 bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[0.7rem] font-bold">
            Q
          </span>
          <span className="rounded-md border border-cyan-400/40 bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[0.7rem] font-bold">
            E
          </span>
          <span className="ml-1 text-[0.7rem] text-cyan-200/80">up / down</span>
        </div>
        <div className="h-4 w-px bg-cyan-400/30" aria-hidden />
        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-cyan-400/40 bg-cyan-500/15 px-1.5 py-0.5 text-[0.7rem] font-bold">
            RMB
          </span>
          <span className="ml-1 text-[0.7rem] text-cyan-200/80">drag to look</span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="ml-2 rounded-full p-1 text-cyan-200/70 hover:bg-cyan-500/20 hover:text-cyan-100"
          title="Dismiss keybinding hint"
          aria-label="Dismiss keybinding hint"
        >
          ×
        </button>
      </div>
    </div>
  );
}
