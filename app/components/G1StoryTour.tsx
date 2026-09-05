"use client";

import React from "react";
import { BookOpen, Sparkles } from "lucide-react";
import type { G1Admission, G1ObjectiveReceipt } from "../lib/frankensimCmaes";

export interface StoryChapter {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  targetTrace: "stabilizer" | "curriculum" | "separable" | "lm-cma";
  challenge: "flat" | "terrain-and-push";
  highlights: string[];
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    badge: "Chapter 1",
    title: "The 29-Joint Robot",
    subtitle: "A 5,040-dimensional policy",
    description:
      "The model has 29 physical joints. Its 15 learned leg and waist actions combine 42 observation channels with 8 phase terms: 15 × 42 × 8 = 5,040 policy coefficients. Explore the standing prior to see the starting controller.",
    targetTrace: "stabilizer",
    challenge: "flat",
    highlights: ["29 physical joints", "42 sensor signals", "5,040 policy weights"],
  },
  {
    id: 2,
    badge: "Chapter 2",
    title: "Test the Starting Policy",
    subtitle: "Contacts, terrain and disturbances",
    description:
      "Switch to terrain and a push, then inspect the owner receipt. Contacts can make an objective difficult to differentiate; CMA-ES uses candidate scores without requiring those derivatives. The starting controller may remain upright or fall depending on the experiment.",
    targetTrace: "stabilizer",
    challenge: "terrain-and-push",
    highlights: ["Terrain + push", "Measure the outcome", "Derivative-free search"],
  },
  {
    id: 3,
    badge: "Chapter 3",
    title: "Search for Better Footfalls",
    subtitle: "Try diagonal adaptation",
    description:
      "Select separable CMA-ES on flat ground, then start learning. Each candidate receives its own physical rollout score. Diagonal adaptation changes the spread of individual policy coefficients; improved walking must appear in the measured distance, contacts and posture.",
    targetTrace: "separable",
    challenge: "flat",
    highlights: ["Separable CMA-ES", "Candidate rollouts", "Compare measured progress"],
  },
  {
    id: 4,
    badge: "Chapter 4",
    title: "Challenge the Learned Policy",
    subtitle: "Try limited-memory adaptation",
    description:
      "Select LM-CMA with terrain and a push. Compare the actual push impulse, recovery and clearance reported by the owner. Robust whole-house walking is the goal; selecting this chapter does not establish obstacle mastery or a safety guarantee.",
    targetTrace: "lm-cma",
    challenge: "terrain-and-push",
    highlights: ["LM-CMA", "Measured recovery", "Goal: robust walking"],
  },
];

interface G1StoryTourProps {
  currentChapter: number;
  onSelectChapter: (chapter: StoryChapter) => void;
  receipt?: G1ObjectiveReceipt | null;
  admission?: G1Admission | null;
  kernelVersion?: string | null;
  disabled?: boolean;
}

export function G1StoryTour({ currentChapter, onSelectChapter, receipt, admission, kernelVersion, disabled }: G1StoryTourProps) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            Interactive Story Mode · Guided Walkthrough
          </span>
        </div>
        <span className="text-[0.68rem] text-slate-400">
          Choose an experiment, then inspect its measured outcome
        </span>
      </div>

      <p role="status" className="mt-3 text-xs leading-5 text-slate-300">
        {receipt && admission && kernelVersion && receipt.completedSteps > 0
          ? `Current owner ${kernelVersion} · ${admission.config.task} · ${admission.config.challenge}: ${receipt.distanceMeters.toFixed(3)} m over ${(receipt.completedSteps * admission.config.stepSeconds).toFixed(3)} s (${receipt.completedSteps} physics steps). These values describe this run only.`
          : "No completed owner rollout is available yet. Chapter descriptions explain experiments and goals."}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STORY_CHAPTERS.map((ch) => {
          const isActive = currentChapter === ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              disabled={disabled}
              aria-pressed={isActive}
              onClick={() => onSelectChapter(ch)}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-colors duration-200 disabled:cursor-wait disabled:opacity-60 ${
                isActive
                  ? "border-cyan-400/60 bg-cyan-950/40 ring-1 ring-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-cyan-400/20 text-cyan-200"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {ch.badge}
                  </span>
                  {isActive && <Sparkles className="h-3.5 w-3.5 text-cyan-300" />}
                </div>
                <h4 className="mt-2 text-sm font-semibold text-white">{ch.title}</h4>
                <p className="mt-1 text-xs text-cyan-200/80">{ch.subtitle}</p>
                <p className="mt-2 text-[0.72rem] leading-relaxed text-slate-400 line-clamp-3">
                  {ch.description}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1 border-t border-white/5 pt-2">
                {ch.highlights.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-white/5 px-1.5 py-0.5 text-[0.62rem] text-slate-300 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
