"use client";

import { useState } from "react";
import { Bot, Navigation, Sparkles } from "lucide-react";
import { HouseholdArmFlagship } from "./HouseholdArmFlagship";
import { KmrScene } from "./KmrScene";

export function ArmPageClient() {
  const [activeTab, setActiveTab] = useState<"tabletop" | "kmr-mobile">("tabletop");

  return (
    <div>
      {/* Mode Switcher Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-2xl border border-white/10 bg-slate-900/80 p-1.5 backdrop-blur-xl shadow-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("tabletop")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "tabletop"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Tabletop Manipulation (128-D)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kmr-mobile")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "kmr-mobile"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Navigation className="h-4 w-4" />
            <span>KMR Mobile Base (4-Mecanum + LiDAR)</span>
          </button>
        </div>
      </div>

      {activeTab === "tabletop" ? (
        <HouseholdArmFlagship />
      ) : (
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                KMR iiwa Omnidirectional Navigation & LiDAR Point Cloud
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Click anywhere on the floor grid to command waypoints
            </span>
          </div>
          <KmrScene />
        </div>
      )}
    </div>
  );
}
