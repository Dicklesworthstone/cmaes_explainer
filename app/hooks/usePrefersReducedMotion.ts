"use client";

import { useMediaQuery } from "./useMediaQuery";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

// Autoplay follows the preference; an explicit Play or Pause belongs to the
// viewer. A changed system preference pauses before the next frame can run.
export function useTracePlaybackPreference() {
  const reduceMotion = usePrefersReducedMotion();
  const [choice, setChoice] = useState({
    reduceMotion,
    playing: null as boolean | null,
  });
  if (choice.reduceMotion !== reduceMotion) {
    setChoice({ reduceMotion, playing: false });
  }
  const isPlaying =
    choice.reduceMotion === reduceMotion && (choice.playing ?? !reduceMotion);
  // Canvas has a separate React root. Stop its old frame callback immediately,
  // rather than waiting for the new isPlaying prop to reach that root.
  const playbackActiveRef = useRef(isPlaying);
  useLayoutEffect(() => {
    playbackActiveRef.current = isPlaying;
  }, [isPlaying]);
  const setIsPlaying = useCallback((playing: boolean) => {
    playbackActiveRef.current = playing;
    setChoice((previous) => ({ ...previous, playing }));
  }, []);
  const resetPlayback = useCallback(() => {
    setChoice((previous) => ({ ...previous, playing: null }));
  }, []);
  return {
    reduceMotion,
    isPlaying,
    setIsPlaying,
    resetPlayback,
    playbackActiveRef,
  };
}
