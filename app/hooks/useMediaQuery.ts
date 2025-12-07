"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverFallback = false) {
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mq = window.matchMedia(query);
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") return serverFallback;
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => serverFallback;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
