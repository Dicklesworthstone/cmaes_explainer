"use client";

import { useMediaQuery } from "./useMediaQuery";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export type TracePlaybackStep = {
  sampleIndex: number;
  elapsedSeconds: number;
  wrapped: boolean;
};

export function clampTracePlaybackIndex(
  sampleCount: number,
  requestedIndex: number,
): number {
  if (sampleCount <= 0 || !Number.isFinite(requestedIndex)) return 0;
  return Math.min(sampleCount - 1, Math.max(0, Math.round(requestedIndex)));
}

export function advanceTracePlayback(
  sampleTimes: readonly number[],
  currentIndex: number,
  elapsedSeconds: number,
  deltaSeconds: number,
  playbackSpeed: number,
  isPlaying: boolean,
): TracePlaybackStep {
  if (sampleTimes.length === 0) {
    return { sampleIndex: 0, elapsedSeconds: 0, wrapped: false };
  }

  const safeIndex = clampTracePlaybackIndex(sampleTimes.length, currentIndex);
  const duration = sampleTimes.at(-1) ?? 0;
  const safeElapsed = Number.isFinite(elapsedSeconds)
    ? Math.min(Math.max(elapsedSeconds, 0), Math.max(duration, 0))
    : Math.max(sampleTimes[safeIndex] ?? 0, 0);
  if (!isPlaying || !Number.isFinite(duration) || duration <= 0) {
    return {
      sampleIndex: safeIndex,
      elapsedSeconds: safeElapsed,
      wrapped: false,
    };
  }

  // Bound a stalled render frame; returning to the page must not fast-forward
  // through the experiment. Speed scales visible render time directly.
  const boundedDelta = Number.isFinite(deltaSeconds)
    ? Math.min(Math.max(deltaSeconds, 0), 0.1)
    : 0;
  const safeSpeed = Number.isFinite(playbackSpeed)
    ? Math.max(playbackSpeed, 0)
    : 0;
  let nextElapsed = safeElapsed + boundedDelta * safeSpeed;
  // Always show the measured terminal pose, including when a frame crosses
  // the horizon. Only a subsequent frame may start the next loop.
  if (nextElapsed >= duration && safeIndex < sampleTimes.length - 1) {
    return {
      sampleIndex: sampleTimes.length - 1,
      elapsedSeconds: duration,
      wrapped: false,
    };
  }
  const wrapped = nextElapsed > duration;
  if (wrapped) nextElapsed %= duration;

  let nextIndex = wrapped ? 0 : safeIndex;
  if ((sampleTimes[nextIndex] ?? 0) > nextElapsed) nextIndex = 0;
  while (
    nextIndex + 1 < sampleTimes.length &&
    (sampleTimes[nextIndex + 1] ?? Number.POSITIVE_INFINITY) <= nextElapsed
  ) {
    nextIndex += 1;
  }
  return { sampleIndex: nextIndex, elapsedSeconds: nextElapsed, wrapped };
}

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
