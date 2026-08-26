"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Visibility gate for expensive animation loops (WebGL frameloops, sim ticks).
 *
 * Returns [ref, inView]. Attach the ref to the loop's container element;
 * drive `frameloop={inView ? "always" : "never"}` (R3F) or early-return from
 * interval effects with it. Visuals are identical when visible — the loop
 * simply stops burning CPU/GPU while nobody is looking.
 *
 * rootMargin keeps the loop alive slightly beyond the viewport so scrolling
 * into a section never starts cold.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "250px"
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
