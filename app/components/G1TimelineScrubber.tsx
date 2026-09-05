"use client";

import React from "react";
import { Play, Pause, RotateCcw, FastForward, SkipBack, SkipForward, AlertCircle, CheckCircle2 } from "lucide-react";
import type { G1TraceReceipt, G1TraceSample } from "../lib/frankensimCmaes";
import type { FrankenRobotsPlaybackSpeed } from "../lib/frankenrobotsBridge";

interface G1TimelineScrubberProps {
  trace: G1TraceReceipt | null;
  currentSampleIndex: number;
  isPlaying: boolean;
  playbackSpeed: FrankenRobotsPlaybackSpeed;
  onTogglePlay: () => void;
  onSeekIndex: (index: number) => void;
  onSetSpeed: (speed: FrankenRobotsPlaybackSpeed) => void;
  onReset: () => void;
}

export function G1TimelineScrubber({
  trace,
  currentSampleIndex,
  isPlaying,
  playbackSpeed,
  onTogglePlay,
  onSeekIndex,
  onSetSpeed,
  onReset,
}: G1TimelineScrubberProps) {
  const totalSamples = trace?.samples.length ?? 0;
  const currentSample = trace?.samples[Math.min(currentSampleIndex, Math.max(0, totalSamples - 1))] ?? null;
  const currentTime = currentSample?.timeSeconds ?? 0;
  const totalTime = trace?.samples[Math.max(0, totalSamples - 1)]?.timeSeconds ?? 1.5;
  const isFallen = trace ? trace.terminationReason !== "horizon" : false;
  const terminationReason = trace?.terminationReason;

  // Identify milestone events across the trace
  const milestones = React.useMemo(() => {
    if (!trace || totalSamples < 2) return [];
    const events: { time: number; label: string; type: "normal" | "push" | "slip" | "fall" }[] = [
      { time: 0.0, label: "Start", type: "normal" },
    ];

    // Push pulse at 0.5s - 0.75s in terrain-and-push
    if (totalTime >= 0.75) {
      events.push({ time: 0.62, label: "Lateral Push (15 N·s)", type: "push" });
    }

    if (isFallen) {
      events.push({ time: totalTime, label: `Fall (${terminationReason})`, type: "fall" });
    } else {
      events.push({ time: totalTime, label: "Goal Reached", type: "normal" });
    }

    return events;
  }, [trace, totalSamples, totalTime, isFallen, terminationReason]);

  if (!trace || totalSamples < 2) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-md">
      {/* 1. Header with Live Telemetry Autopsy Callout */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-cyan-300 font-bold">
            t = {currentTime.toFixed(3)}s / {totalTime.toFixed(3)}s
          </span>
          <span className="text-slate-400">
            Step {currentSampleIndex + 1} / {totalSamples}
          </span>
        </div>

        {/* Diagnostic Autopsy Capsule */}
        <div className="flex items-center gap-2">
          {currentSample?.leftContact || currentSample?.rightContact ? (
            <span className="flex items-center gap-1 text-[0.7rem] text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {currentSample.leftContact && currentSample.rightContact
                ? "Double Foot Support"
                : currentSample.leftContact
                ? "Left Sole Grounded"
                : "Right Sole Grounded"}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[0.7rem] text-amber-300">
              <AlertCircle className="h-3.5 w-3.5" />
              Flight / Unloaded Phase
            </span>
          )}
        </div>
      </div>

      {/* 2. Interactive Scrubber Slider with Milestones */}
      <div className="relative mt-4 px-1">
        <input
          type="range"
          min={0}
          max={totalSamples - 1}
          value={currentSampleIndex}
          aria-label="Simulation playback frame scrubber"
          aria-valuemin={0}
          aria-valuemax={totalSamples - 1}
          aria-valuenow={currentSampleIndex}
          aria-valuetext={`Time ${currentTime.toFixed(3)} seconds, Step ${currentSampleIndex + 1} of ${totalSamples}`}
          style={{ touchAction: "pan-y pinch-zoom" }}
          onChange={(e) => onSeekIndex(Number(e.target.value))}
          className="w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400 h-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        />

        {/* Milestone Marks */}
        <div className="relative mt-1.5 h-4 w-full">
          {milestones.map((m, idx) => {
            const leftPct = (m.time / Math.max(totalTime, 0.001)) * 100;
            return (
              <div
                key={idx}
                style={{ left: `${Math.min(96, Math.max(2, leftPct))}%` }}
                className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none"
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    m.type === "fall"
                      ? "bg-rose-500"
                      : m.type === "push"
                      ? "bg-amber-400"
                      : "bg-cyan-400"
                  }`}
                />
                <span className="text-[0.6rem] text-slate-300 whitespace-nowrap mt-0.5 font-medium">
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Transport Controls & Speed Selectors */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause simulation playback" : "Play simulation"}
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 hover:bg-cyan-500/30 active:scale-95 transition-[background-color,transform]"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onReset}
            aria-label="Reset simulation to initial frame"
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 active:scale-95 transition-[background-color,transform]"
            title="Reset to frame 0 (R)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onSeekIndex(Math.max(0, currentSampleIndex - 1))}
            aria-label="Step backward one frame"
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 active:scale-95 transition-[background-color,transform]"
            title="Step backward 1 frame ([ or Left Arrow)"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onSeekIndex(Math.min(totalSamples - 1, currentSampleIndex + 1))}
            aria-label="Step forward one frame"
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 active:scale-95 transition-[background-color,transform]"
            title="Step forward 1 frame (] or Right Arrow)"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Speed Selector Buttons */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          {([0.25, 0.5, 1, 2] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSetSpeed(s)}
              aria-label={`Set playback speed to ${s}x`}
              className={`rounded-lg px-2.5 py-1.5 text-[0.68rem] font-mono font-semibold transition-colors min-h-[32px] ${
                playbackSpeed === s
                  ? "bg-cyan-500/30 text-cyan-200 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
