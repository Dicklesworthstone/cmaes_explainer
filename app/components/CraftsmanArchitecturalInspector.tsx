"use client";

import React, { useState } from "react";
import {
  Home,
  Sun,
  Sunset,
  Moon,
  Info,
  Compass,
  CheckCircle2,
  Layers,
  Footprints,
  Sparkles,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import {
  SEARS_CRAFTSMAN_CATALOG,
  ROOM_ARCHITECTURAL_DETAILS,
  CRAFTSMAN_WALKING_ROUTES,
  type CraftsmanPieceInfo,
  type CraftsmanWalkingRoute,
} from "../lib/craftsmanCatalogData";

export interface CraftsmanArchitecturalInspectorProps {
  activeRoom: string;
  onSelectRoom: (roomId: string) => void;
  timeOfDay: "afternoon-sun" | "golden-hour" | "evening-glow";
  onSelectTimeOfDay: (tod: "afternoon-sun" | "golden-hour" | "evening-glow") => void;
  showRoof?: boolean;
  onToggleRoof?: () => void;
  activeRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
}

export function CraftsmanArchitecturalInspector({
  activeRoom,
  onSelectRoom,
  timeOfDay,
  onSelectTimeOfDay,
  showRoof = false,
  onToggleRoof,
  activeRouteId = "grand-tour",
  onSelectRoute,
}: CraftsmanArchitecturalInspectorProps) {
  const [selectedPieceId, setSelectedPieceId] = useState<string>("fireplace-inglenook");

  const activeRoomMeta =
    ROOM_ARCHITECTURAL_DETAILS.find((r) => r.id === activeRoom) ??
    ROOM_ARCHITECTURAL_DETAILS[0];

  const pieceList = Object.values(SEARS_CRAFTSMAN_CATALOG);
  const selectedPiece: CraftsmanPieceInfo =
    SEARS_CRAFTSMAN_CATALOG[selectedPieceId] ?? pieceList[0];

  const activeRoute: CraftsmanWalkingRoute =
    CRAFTSMAN_WALKING_ROUTES.find((r) => r.id === activeRouteId) ??
    CRAFTSMAN_WALKING_ROUTES[0];

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                1928 Sears Craftsman Bungalow
              </h3>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-300 border border-amber-400/30">
                Honor Bilt Kit Architecture
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Parametric architectural reconstruction with 70+ authentic period furnishings & multi-room navigation
            </p>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center gap-2">
          {onToggleRoof && (
            <button
              type="button"
              onClick={onToggleRoof}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                showRoof
                  ? "bg-amber-500/20 text-amber-200 border-amber-400/40"
                  : "bg-slate-900/90 text-slate-400 border-white/10 hover:text-slate-200"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{showRoof ? "Roof Eaves (On)" : "Cutaway View"}</span>
            </button>
          )}

          {/* Atmosphere Selector */}
          <div className="flex items-center gap-1 rounded-xl border border-amber-500/30 bg-slate-900/90 p-1">
            {(
              [
                { id: "afternoon-sun", label: "Daylight", icon: Sun },
                { id: "golden-hour", label: "Golden Hour", icon: Sunset },
                { id: "evening-glow", label: "Evening Glow", icon: Moon },
              ] as const
            ).map((tod) => {
              const Icon = tod.icon;
              const isSelected = timeOfDay === tod.id;
              return (
                <button
                  key={tod.id}
                  type="button"
                  onClick={() => onSelectTimeOfDay(tod.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-amber-500/30 text-amber-200 border border-amber-400/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tod.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Room Tour Selector Pills */}
      <div>
        <label className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
          Room-by-Room Architectural Tour
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ROOM_ARCHITECTURAL_DETAILS.map((room) => {
            const isSelected = activeRoom === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelectRoom(room.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-amber-500/40 hover:bg-slate-900"
                }`}
              >
                <span>{room.name}</span>
                {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Walking Route Selector */}
      {onSelectRoute && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="flex items-center justify-between">
            <label className="text-[0.68rem] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Footprints className="h-3.5 w-3.5 text-amber-400" />
              G1 Whole-House Obstacle Traversal Routes
            </label>
            <span className="font-mono text-xs text-slate-400">
              Total Corridor Distance: {activeRoute.totalDistanceMeters} m
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {CRAFTSMAN_WALKING_ROUTES.map((route) => {
              const isSelected = activeRouteId === route.id;
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => onSelectRoute(route.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "border border-amber-400/40 bg-amber-500/20 text-amber-200"
                      : "border border-white/10 bg-slate-900/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>{route.name}</span>
                  <span className="font-mono text-[0.65rem] text-amber-400/80">
                    ({route.waypoints.length} gates)
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[0.7rem] text-slate-400">
            {activeRoute.description}
          </p>
        </div>
      )}

      {/* Active Room Metadata & Catalog Spec Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Compass className="h-4 w-4 text-amber-400" />
              {activeRoomMeta.name} Architectural Profile
            </h4>
            <span className="font-mono text-xs text-slate-400">
              Area: {activeRoomMeta.areaSqM} m² · Ceiling: {activeRoomMeta.ceilingHeightM} m
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            {activeRoomMeta.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeRoomMeta.focalFeatures.map((feat, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[0.68rem] font-medium text-amber-200"
              >
                ✨ {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Craftsman Catalog Item Spec Card */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Sears Catalog Piece
            </h4>
            <span className="font-mono text-xs font-bold text-amber-300">
              {selectedPiece.historicalPrice}
            </span>
          </div>

          <div className="mt-2">
            <select
              aria-label="Select Sears Craftsman furniture piece"
              value={selectedPieceId}
              onChange={(e) => setSelectedPieceId(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
            >
              {pieceList.map((piece) => (
                <option key={piece.id} value={piece.id}>
                  {piece.name} ({piece.catalogYear})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 space-y-1.5 text-[0.7rem] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Wood / Material:</span>
              <span className="font-medium text-amber-200">{selectedPiece.woodSpecies}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Joinery:</span>
              <span className="font-medium text-slate-200">{selectedPiece.joinery}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dimensions:</span>
              <span className="font-mono text-cyan-300">
                {selectedPiece.dimensionsMeters[0]}m × {selectedPiece.dimensionsMeters[1]}m × {selectedPiece.dimensionsMeters[2]}m
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
