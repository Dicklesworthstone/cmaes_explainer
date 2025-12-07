"use client";

import { useMediaQuery } from "./useMediaQuery";

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}
