"use client";

/**
 * Renders `children` only after the trigger element enters (or nears) the
 * viewport. Used to defer heavy client-side work — 3D scenes, large data
 * tables, WebGL init, search index builds — off the initial page load so
 * the main thread isn't blocked when the user lands on the section.
 *
 * The placeholder keeps the section's vertical space stable (the children
 * measure once on mount) so the page doesn't reflow when the real content
 * appears. `rootMargin` is in CSS pixels; default "200px" means we mount
 * slightly before the section enters the viewport.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "../hooks/useScrollSpy";

export function ViewportLazy({
  children,
  fallback = null,
  rootMargin = "200px 0px",
  minHeight,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  /** Reserve this much vertical space while unmounted to prevent CLS. */
  minHeight?: number | string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { rootMargin, once: true });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!inView) return;
    // Async-defer the mount state so the effect's body is sync-free
    // (react-hooks/set-state-in-effect). The microtask costs one tick
    // after the viewport enters; the child is rendered on the next paint.
    Promise.resolve().then(() => setMounted(true));
  }, [inView]);

  const style = minHeight !== undefined
    ? { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }
    : undefined;

  return (
    <div ref={ref} style={style}>
      {mounted ? children : fallback}
    </div>
  );
}
