"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the last section that crossed the viewport threshold.
 * Uses IntersectionObserver; falls back to empty string if not available.
 */
export function useScrollSpy(
  sectionIds: string[],
  options: IntersectionObserverInit = { rootMargin: "-45% 0px -45% 0px" }
) {
  const [activeId, setActiveId] = useState("");
  const { rootMargin = "-45% 0px -45% 0px", threshold } = options;
  // sectionIds is typically an inline array (new identity on every render);
  // key it so the observer is not torn down and rebuilt on every render.
  const sectionKey = sectionIds.join("|");

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveId(entry.target.id);
        }
      });
    }, { rootMargin, threshold });

    sectionKey.split("|").forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionKey, rootMargin, threshold]);

  return activeId;
}
