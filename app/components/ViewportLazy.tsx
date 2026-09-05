"use client";

/**
 * Renders `children` only after the trigger element enters (or nears) the
 * viewport. Used to defer heavy client-side work — 3D scenes, large data
 * tables, WebGL init, search index builds — off the initial page load so
 * the main thread isn't blocked when the user lands on the section.
 *
 * The placeholder reserves space while the content is deferred; the final
 * content may be taller. Explicit hash targets also mount without waiting
 * for visibility. `rootMargin` is in CSS pixels; default "200px" means we mount
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
  /** Reserve this much vertical space while unmounted to reduce layout shifts. */
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

  useEffect(() => {
    let active = true;
    let frame = 0;
    let stopTracking = () => {};
    const mountHashTarget = () => {
      stopTracking();
      cancelAnimationFrame(frame);
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const target = id ? document.getElementById(id) : null;
      if (!target || !ref.current || !target.contains(ref.current)) return;
      if (mounted) {
        // Jump after the content commits. Smooth scrolling through the page
        // mounts intervening sections and can move the destination mid-scroll.
        const align = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: "instant", block: "start" });
          });
        };
        // Earlier lazy content can still change the target's position during
        // hydration. Track those resizes briefly, yielding immediately to any
        // user navigation so we never pull the reader back to an old anchor.
        const observer = new ResizeObserver(align);
        const inputs = ["wheel", "touchstart", "pointerdown", "keydown"];
        const timeout = window.setTimeout(() => stopTracking(), 2000);
        stopTracking = () => {
          observer.disconnect();
          clearTimeout(timeout);
          cancelAnimationFrame(frame);
          inputs.forEach((type) =>
            window.removeEventListener(type, stopTracking),
          );
        };
        inputs.forEach((type) =>
          window.addEventListener(type, stopTracking, { passive: true }),
        );
        observer.observe(document.body);
        align();
      } else {
        Promise.resolve().then(() => {
          if (active) setMounted(true);
        });
      }
    };
    mountHashTarget();
    window.addEventListener("hashchange", mountHashTarget);
    return () => {
      active = false;
      stopTracking();
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", mountHashTarget);
    };
  }, [mounted]);

  const style =
    minHeight !== undefined
      ? {
          minHeight:
            typeof minHeight === "number" ? `${minHeight}px` : minHeight,
        }
      : undefined;

  return (
    <div ref={ref} style={style}>
      {mounted ? children : fallback}
    </div>
  );
}
