"use client";

import { useState } from "react";
import { Bot, Navigation } from "lucide-react";
import { HouseholdArmFlagship } from "./HouseholdArmFlagship";
import { KmrScene } from "./KmrScene";

export interface ArmPageClientProps {
  embedded?: boolean;
}

export function ArmPageClient({ embedded = false }: ArmPageClientProps = {}) {
  const [activeTab, setActiveTab] = useState<"tabletop" | "kmr-mobile">(
    "tabletop",
  );

  return (
    <div>
      {/* Mode Switcher Tabs */}
      <div className={`flex justify-center ${embedded ? "mb-3" : "mb-8"}`}>
        <div
          aria-label="Arm experience"
          className={`grid w-full max-w-2xl grid-cols-2 rounded-2xl border border-white/10 bg-slate-900/80 p-1.5 shadow-2xl backdrop-blur-xl ${
            embedded ? "gap-1" : "gap-1 sm:w-auto"
          }`}
          role="tablist"
        >
          <button
            aria-controls="arm-tabletop-panel"
            aria-selected={activeTab === "tabletop"}
            type="button"
            onClick={() => setActiveTab("tabletop")}
            role="tab"
            className={`flex min-w-0 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              embedded ? "px-3" : "px-5"
            } ${
              activeTab === "tabletop"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bot className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {embedded ? "Tabletop Arm" : "Tabletop Manipulation (128-D)"}
            </span>
          </button>
          <button
            aria-controls="arm-kmr-panel"
            aria-selected={activeTab === "kmr-mobile"}
            type="button"
            onClick={() => setActiveTab("kmr-mobile")}
            role="tab"
            className={`flex min-w-0 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              embedded ? "px-3" : "px-5"
            } ${
              activeTab === "kmr-mobile"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Navigation className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {embedded
                ? "KMR Mobile Base"
                : "KMR Mobile Base (4-Mecanum + LiDAR)"}
            </span>
          </button>
        </div>
      </div>

      {activeTab === "tabletop" ? (
        <div id="arm-tabletop-panel" role="tabpanel">
          <HouseholdArmFlagship embedded={embedded} />
        </div>
      ) : (
        <div
          className={`rounded-3xl border border-cyan-500/20 bg-slate-900/60 shadow-2xl backdrop-blur-xl ${
            embedded ? "p-2 sm:p-3" : "p-6"
          }`}
          id="arm-kmr-panel"
          role="tabpanel"
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                KMR iiwa Omnidirectional Navigation & LiDAR Point Cloud
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Tap or click the floor grid to command waypoints
            </span>
          </div>
          <p className="mb-3 text-[0.68rem] leading-5 text-slate-400">
            TypeScript navigation owner and household contact/LCP coupling; this
            mobile-base path is not FrankenSim robot-owner WASM.
          </p>
          <KmrScene />
        </div>
      )}
    </div>
  );
}
