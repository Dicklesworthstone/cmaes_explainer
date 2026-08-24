"use client";

import type { ReactNode } from "react";

// Smooth wheel-scroll hijacking (via @studio-freight/lenis) was removed on
// purpose. The deprecated Lenis 1.0.x raced React 19 hydration: wheel events
// arriving mid-hydration triggered intermittent hydration mismatches
// (React #418), which discard the server tree, reset scroll position, and
// leave the page effectively unscrollable (reproduced 7/8 loads; 0/8 without
// Lenis). Native scrolling plus `scroll-behavior: smooth` (globals.css) for
// anchor jumps is the correct, dependency-free behavior for an essay site.
// Do not reintroduce a scroll-hijacking library without solving that race.
export function SmoothScroll({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
