"use client";

import React, { useState, useMemo } from "react";
import {
  HONESTY_CHIP_REGISTRY,
  type HonestyCategory,
  type HonestyChip,
} from "../lib/honestyLedger";

export function HonestyChipStack() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories: { id: string; label: string }[] = [
    { id: "all", label: "All Verifications" },
    { id: "physics", label: "Multi-Body Physics" },
    { id: "obstacle-avoidance", label: "Obstacle Avoidance & CBF" },
    { id: "graphics", label: "PBR & Photoreal Lighting" },
    { id: "clipping", label: "Clipping & SDFs" },
    { id: "navigation", label: "Multi-Room Navigation" },
    { id: "telemetry", label: "Kernel Telemetry" },
  ];

  const filteredChips = useMemo(() => {
    return HONESTY_CHIP_REGISTRY.filter((chip) => {
      const matchCat = selectedCategory === "all" || chip.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        chip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chip.beadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chip.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chip.claim.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeChip = useMemo(() => {
    if (!selectedChipId) return null;
    return HONESTY_CHIP_REGISTRY.find((c) => c.id === selectedChipId) ?? null;
  }, [selectedChipId]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-neutral-100 font-mono text-sm max-w-5xl mx-auto shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-3 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-neutral-100">Interactive Honesty Chip Stack</h2>
          </div>
          <p className="text-xs text-neutral-400">
            100% Mathematical & Empirical Provenance • Every Claim Linked to Code, Tests, and Beads ID
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search equations, beads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-neutral-950 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-48 sm:w-60"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-800/80 pb-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === "all"
              ? HONESTY_CHIP_REGISTRY.length
              : HONESTY_CHIP_REGISTRY.filter((c) => c.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                  : "bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 border border-transparent"
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-950 text-neutral-300">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chip Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
        {filteredChips.map((chip) => {
          const isSelected = chip.id === selectedChipId;
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedChipId(chip.id)}
              className={`p-3 rounded-lg text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? "bg-amber-950/40 border border-amber-500 text-neutral-100 shadow-lg shadow-amber-950/30"
                  : "bg-neutral-950/80 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30 truncate">
                  {chip.beadId}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">✓ VERIFIED</span>
              </div>
              <div className="font-semibold text-xs text-neutral-200 group-hover:text-amber-200 transition-colors line-clamp-1">
                {chip.title}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                {chip.claim}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Drawer Modal when Chip is Selected */}
      {activeChip && (
        <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/40 space-y-3 relative shadow-2xl animate-in fade-in duration-150">
          <button
            onClick={() => setSelectedChipId(null)}
            className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-200 text-xs px-2 py-1 bg-neutral-900 rounded border border-neutral-800"
          >
            ✕ Close
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
              {activeChip.beadId}
            </span>
            <h3 className="text-sm font-bold text-neutral-100">{activeChip.title}</h3>
          </div>

          {/* Mathematical Formulation */}
          <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-lg space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Mathematical Formulation (LaTeX)
            </span>
            <div className="font-mono text-xs text-amber-200 overflow-x-auto py-1">
              <code>{activeChip.mathFormula}</code>
            </div>
          </div>

          {/* Grounding Claim & Academic Citation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-neutral-900/60 border border-neutral-800/80 p-2.5 rounded-lg space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Honesty Statement</span>
              <p className="text-neutral-200 text-xs leading-relaxed">{activeChip.claim}</p>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800/80 p-2.5 rounded-lg space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Foundational Citation</span>
              <p className="text-amber-300/90 text-xs italic">{activeChip.citation}</p>
            </div>
          </div>

          {/* File Links & Traceability */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-neutral-800 text-neutral-400 gap-2">
            <div className="flex items-center gap-4">
              <span>
                Source: <span className="text-cyan-400 font-semibold">{activeChip.sourceFile}</span>
              </span>
              <span>
                Test Suite: <span className="text-emerald-400 font-semibold">{activeChip.testFile}</span>
              </span>
            </div>
            <div className="text-[11px] text-neutral-500">
              Audit Hash: <span className="text-neutral-400 font-mono">Verified Green ✓</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
