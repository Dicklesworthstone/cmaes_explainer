"use client";

import React, { useState, useMemo } from "react";
import { CRAFTSMAN_BUNGALOW_1928, type HouseFurniture } from "../lib/houseScenes";
import { FURNITURE_KIND_DEFAULTS, type FurnitureKind } from "../lib/furnitureTaxonomy";

export function FurnitureCatalogInspector() {
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedPieceName, setSelectedPieceName] = useState<string>(
    CRAFTSMAN_BUNGALOW_1928.furniture[0]?.name ?? "front-porch-swing",
  );

  const rooms = useMemo(() => {
    const set = new Set<string>();
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      set.add(f.room);
    }
    return ["all", ...Array.from(set)];
  }, []);

  const filteredFurniture = useMemo(() => {
    if (selectedRoom === "all") return CRAFTSMAN_BUNGALOW_1928.furniture;
    return CRAFTSMAN_BUNGALOW_1928.furniture.filter((f) => f.room === selectedRoom);
  }, [selectedRoom]);

  const activePiece = useMemo(() => {
    return (
      CRAFTSMAN_BUNGALOW_1928.furniture.find((f) => f.name === selectedPieceName) ??
      CRAFTSMAN_BUNGALOW_1928.furniture[0]
    );
  }, [selectedPieceName]);

  const pieceKind = (activePiece?.kind as FurnitureKind) ?? "dining-chair";
  const kindDefaults =
    activePiece?.kind && (activePiece.kind as FurnitureKind) in FURNITURE_KIND_DEFAULTS
      ? FURNITURE_KIND_DEFAULTS[activePiece.kind as FurnitureKind]
      : FURNITURE_KIND_DEFAULTS["dining-chair"];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-neutral-100 font-mono text-sm max-w-4xl mx-auto shadow-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-cyan-400">Furniture Catalog & Spec Inspector</h2>
          <p className="text-xs text-neutral-400">
            {CRAFTSMAN_BUNGALOW_1928.model} ({CRAFTSMAN_BUNGALOW_1928.catalogYear}) • {CRAFTSMAN_BUNGALOW_1928.furniture.length} Parameterized Pieces
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="furniture-room-filter" className="text-xs text-neutral-400">Room:</label>
          <select
            id="furniture-room-filter"
            className="min-h-11 max-w-full bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {rooms.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? `All Rooms (${CRAFTSMAN_BUNGALOW_1928.furniture.length})` : r.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Piece Selection List */}
        <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
          {filteredFurniture.map((piece) => {
            const isSelected = piece.name === activePiece.name;
            return (
              <button
                key={piece.name}
                onClick={() => setSelectedPieceName(piece.name)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-cyan-950/60 border border-cyan-500/50 text-cyan-200"
                    : "bg-neutral-800/60 hover:bg-neutral-800 border border-transparent text-neutral-300"
                }`}
              >
                <div className="font-semibold text-xs truncate">{piece.name}</div>
                <div className="text-[10px] text-neutral-400 flex justify-between">
                  <span className="uppercase">{piece.room}</span>
                  <span>{piece.kind ?? "piece"}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Middle Column: Geometric Envelopes & Placement */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Spatial Bounding Envelope</span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-cyan-400">OBB Envelope</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Footprint Center [X, Z]:</span>
              <span className="text-neutral-200 font-semibold">
                [{activePiece.center[0].toFixed(2)}, {activePiece.center[1].toFixed(2)}] m
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Dimensions [DX × DZ]:</span>
              <span className="text-neutral-200 font-semibold">
                {activePiece.size[0].toFixed(2)}m × {activePiece.size[1].toFixed(2)}m
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Height (Y):</span>
              <span className="text-neutral-200 font-semibold">{activePiece.height.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Yaw Orientation:</span>
              <span className="text-neutral-200 font-semibold">
                {((activePiece.rotation * 180) / Math.PI).toFixed(1)}°
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Material Binding:</span>
              <span className="text-amber-400 font-semibold">{activePiece.materialId ?? "quarter-sawn-oak"}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 italic">
            &ldquo;{activePiece.note}&rdquo;
          </div>
        </div>

        {/* Right Column: Physical Dynamics & Articulation Spec */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Physical Inertia & Articulation</span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-emerald-400">
              {kindDefaults.shape}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Nominal Mass:</span>
              <span className="text-emerald-400 font-bold">{kindDefaults.defaultMass} kg</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Center of Mass CoG:</span>
              <span className="text-neutral-200 font-semibold">
                [{kindDefaults.defaultCoG.x}, {kindDefaults.defaultCoG.y}, {kindDefaults.defaultCoG.z}]
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Rolling Caster Support:</span>
              <span className={kindDefaults.rolls ? "text-cyan-400 font-bold" : "text-neutral-500"}>
                {kindDefaults.rolls ? "Yes (Casters Enabled)" : "Static Base"}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Fragility / Risk:</span>
              <span className={kindDefaults.breakable ? "text-rose-400 font-bold" : "text-neutral-300"}>
                {kindDefaults.risk.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Articulation Pattern:</span>
              <span className="text-purple-400 font-semibold">
                {kindDefaults.articulation ? `${kindDefaults.articulation.joints.length} joint(s)` : "Rigid Body"}
              </span>
            </div>
          </div>

          {kindDefaults.articulation && (
            <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800 text-[10px] text-neutral-300 space-y-1">
              <div className="text-purple-300 font-bold">Joint Graph:</div>
              {kindDefaults.articulation.joints.map((j) => (
                <div key={j.name} className="flex justify-between">
                  <span>{j.name} ({j.type}):</span>
                  <span>[{j.limits.min}, {j.limits.max}]</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
