"use client";

import React from "react";
import { BookOpen, Sparkles, AlertTriangle, ShieldCheck, Footprints } from "lucide-react";

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
    title: "The 29-Limb Puppet",
    subtitle: "Why walking is a 5,040-dimensional labyrinth",
    description:
      "A Unitree G1 humanoid has 29 physical joints. 15 leg and waist motors must read 42 live sensor feedback channels through 8 gait-phase periodic terms. That creates 5,040 simultaneous numbers that must be tuned together. One wrong weight, and the robot collapses.",
    targetTrace: "stabilizer",
    challenge: "flat",
    highlights: ["29 physical joints", "42 sensor signals", "5,040 policy weights"],
  },
  {
    id: 2,
    badge: "Chapter 2",
    title: "Generation 0: The Faceplant",
    subtitle: "The contact paradox & zero gradients",
    description:
      "Without training, the robot immediately falls within 0.35 seconds. Traditional AI gradients fail here because physics has sharp contact discontinuities—gravity is smooth, but floor impact forces spike infinitely fast in a microsecond.",
    targetTrace: "stabilizer",
    challenge: "terrain-and-push",
    highlights: ["Fall at t=0.35s", "Infinite contact gradients", "Black-box necessity"],
  },
  {
    id: 3,
    badge: "Chapter 3",
    title: "Generations 1–15: Finding Footfalls",
    subtitle: "Covariance shaping & weight transfer",
    description:
      "CMA-ES evaluates 16 candidate darts simultaneously. It discovers alternating left/right foot unloading and stretches its 5,040-D search ellipsoid along the forward velocity axis, learning forward momentum without falling.",
    targetTrace: "separable",
    challenge: "flat",
    highlights: ["Alternating foot unloading", "Covariance elongation", "1.2 m/s steady stride"],
  },
  {
    id: 4,
    badge: "Chapter 4",
    title: "Generation 40+: Obstacle Mastery",
    subtitle: "High-Order CBFs & terrain recovery",
    description:
      "Facing an unexpected lateral shove (15 N·s) and uneven Craftsman bungalow terrain, High-Order Control Barrier Functions (HOCBF) and CMA-ES reflexes activate ankle roll compensation within 24 milliseconds, preserving upright equilibrium.",
    targetTrace: "lm-cma",
    challenge: "terrain-and-push",
    highlights: ["HOCBF safety barrier", "24ms reflex recovery", "Bungalow obstacle clearance"],
  },
];

interface G1StoryTourProps {
  currentChapter: number;
  onSelectChapter: (chapter: StoryChapter) => void;
}

export function G1StoryTour({ currentChapter, onSelectChapter }: G1StoryTourProps) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            Interactive Story Mode · Guided Walkthrough
          </span>
        </div>
        <span className="text-[0.68rem] text-slate-400">
          Click a chapter to explore the learning progression
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STORY_CHAPTERS.map((ch) => {
          const isActive = currentChapter === ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelectChapter(ch)}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
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
