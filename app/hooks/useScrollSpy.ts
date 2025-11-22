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

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveId(entry.target.id);
        }
      });
    }, { rootMargin, threshold });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, rootMargin, threshold]);

  return activeId;
}
