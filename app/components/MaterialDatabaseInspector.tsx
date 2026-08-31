"use client";

import React, { useState, useMemo } from "react";
import { getMaterialPairFriction, type HouseholdMaterial } from "../lib/materialPairFriction";
import { EMISSIVE_PALETTE, kelvinToRgb } from "../lib/emissiveSurfaces";

export interface PbrMaterialSpec {
  id: string;
  name: string;
  category: "wood" | "metal" | "stone" | "ceramic" | "glass" | "fabric" | "leather";
  baseColorHex: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  ior?: number;
  densityKgM3: number;
  kelvinTemp?: number;
  frictionClass: HouseholdMaterial;
}

export const CRAFTSMAN_MATERIAL_DATABASE: PbrMaterialSpec[] = [
  {
    id: "quarter-sawn-oak",
    name: "Quarter-Sawn White Oak",
    category: "wood",
    baseColorHex: "#7a5230",
    roughness: 0.38,
    metalness: 0.0,
    clearcoat: 0.25,
    ior: 1.52,
    densityKgM3: 750,
    frictionClass: "hardwood",
  },
  {
    id: "mission-walnut",
    name: "Mission Dark Walnut",
    category: "wood",
    baseColorHex: "#4a3222",
    roughness: 0.42,
    metalness: 0.0,
    clearcoat: 0.2,
    ior: 1.53,
    densityKgM3: 680,
    frictionClass: "hardwood",
  },
  {
    id: "aged-brass",
    name: "Hand-Hammered Aged Brass",
    category: "metal",
    baseColorHex: "#b59445",
    roughness: 0.28,
    metalness: 0.88,
    clearcoat: 0.1,
    ior: 1.45,
    densityKgM3: 8500,
    frictionClass: "steel",
  },
  {
    id: "wrought-iron",
    name: "Wrought Cast Iron",
    category: "metal",
    baseColorHex: "#2b2b2b",
    roughness: 0.72,
    metalness: 0.85,
    ior: 2.1,
    densityKgM3: 7800,
    frictionClass: "steel",
  },
  {
    id: "river-rock-stone",
    name: "River Rock Fireplace Stone",
    category: "stone",
    baseColorHex: "#68645e",
    roughness: 0.85,
    metalness: 0.0,
    ior: 1.55,
    densityKgM3: 2400,
    frictionClass: "concrete",
  },
  {
    id: "subway-tile-white",
    name: "Ceramic Subway Tile (Glazed)",
    category: "ceramic",
    baseColorHex: "#e8ecef",
    roughness: 0.12,
    metalness: 0.0,
    clearcoat: 0.85,
    ior: 1.51,
    densityKgM3: 2300,
    frictionClass: "ceramic",
  },
  {
    id: "stained-glass-amber",
    name: "Craftsman Stained Glass (Amber)",
    category: "glass",
    baseColorHex: "#d88a38",
    roughness: 0.05,
    metalness: 0.0,
    clearcoat: 0.95,
    ior: 1.54,
    densityKgM3: 2500,
    frictionClass: "glass",
  },
  {
    id: "woven-wool-rug",
    name: "Earthy Geometric Wool Rug",
    category: "fabric",
    baseColorHex: "#8f5436",
    roughness: 0.92,
    metalness: 0.0,
    ior: 1.48,
    densityKgM3: 350,
    frictionClass: "fabric",
  },
  {
    id: "distressed-leather",
    name: "Mission Brown Leather",
    category: "leather",
    baseColorHex: "#5c3822",
    roughness: 0.55,
    metalness: 0.0,
    clearcoat: 0.15,
    ior: 1.50,
    densityKgM3: 900,
    frictionClass: "leather",
  },
];

export function MaterialDatabaseInspector() {
  const [selectedMatId, setSelectedMatId] = useState<string>("quarter-sawn-oak");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [matingMaterial, setMatingMaterial] = useState<HouseholdMaterial>("hardwood");

  const filteredMaterials = useMemo(() => {
    if (filterCategory === "all") return CRAFTSMAN_MATERIAL_DATABASE;
    return CRAFTSMAN_MATERIAL_DATABASE.filter((m) => m.category === filterCategory);
  }, [filterCategory]);

  const activeMat = useMemo(() => {
    return CRAFTSMAN_MATERIAL_DATABASE.find((m) => m.id === selectedMatId) ?? CRAFTSMAN_MATERIAL_DATABASE[0];
  }, [selectedMatId]);

  const frictionProps = useMemo(() => {
    return getMaterialPairFriction(activeMat.frictionClass, matingMaterial);
  }, [activeMat, matingMaterial]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-neutral-100 font-mono text-sm max-w-4xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-amber-400">PBR Material Database & Physical Matrix</h2>
          <p className="text-xs text-neutral-400">Craftsman 1928 Catalog • BRDF Validation & Contact Properties</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-neutral-400">Filter:</label>
          <select
            className="bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories ({CRAFTSMAN_MATERIAL_DATABASE.length})</option>
            <option value="wood">Wood</option>
            <option value="metal">Metal</option>
            <option value="stone">Stone</option>
            <option value="ceramic">Ceramic</option>
            <option value="glass">Glass</option>
            <option value="fabric">Fabric</option>
            <option value="leather">Leather</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Material List */}
        <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
          {filteredMaterials.map((mat) => {
            const isSelected = mat.id === activeMat.id;
            return (
              <button
                key={mat.id}
                onClick={() => setSelectedMatId(mat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                  isSelected
                    ? "bg-amber-950/60 border border-amber-500/50 text-amber-200"
                    : "bg-neutral-800/60 hover:bg-neutral-800 border border-transparent text-neutral-300"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-white/20 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: mat.baseColorHex }}
                />
                <div className="truncate">
                  <div className="font-semibold text-xs truncate">{mat.name}</div>
                  <div className="text-[10px] text-neutral-400 uppercase">{mat.category}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Middle Column: PBR & Optical Properties */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">PBR Surface BRDF</span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-amber-400">Cook-Torrance GGX</span>
          </div>

          <div
            className="w-full h-24 rounded-lg flex items-center justify-center border border-white/10 shadow-inner relative overflow-hidden"
            style={{ backgroundColor: activeMat.baseColorHex }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/30 pointer-events-none"
              style={{ opacity: 1 - activeMat.roughness }}
            />
            <span className="relative z-10 text-[11px] font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur">
              {activeMat.baseColorHex}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Roughness:</span>
              <span className="text-neutral-200 font-semibold">{activeMat.roughness.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Metalness:</span>
              <span className="text-neutral-200 font-semibold">{activeMat.metalness.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Clearcoat:</span>
              <span className="text-neutral-200 font-semibold">{(activeMat.clearcoat ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Index of Refraction (IOR):</span>
              <span className="text-neutral-200 font-semibold">{(activeMat.ior ?? 1.5).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Bulk Density:</span>
              <span className="text-neutral-200 font-semibold">{activeMat.densityKgM3} kg/m³</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Friction Dynamics */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Contact Friction Matrix</span>
            <select
              className="bg-neutral-800 text-[10px] px-1.5 py-0.5 rounded border border-neutral-700 text-amber-300"
              value={matingMaterial}
              onChange={(e) => setMatingMaterial(e.target.value as HouseholdMaterial)}
            >
              <option value="hardwood">vs Hardwood Floor</option>
              <option value="ceramic">vs Tile Floor</option>
              <option value="steel">vs Steel Arm / Foot</option>
              <option value="rubber">vs Rubber Gripper</option>
              <option value="fabric">vs Rug Surface</option>
              <option value="glass">vs Glass Top</option>
            </select>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="p-2 rounded bg-neutral-900/80 border border-neutral-800">
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Static Friction (μ_s):</span>
                <span className="text-emerald-400 font-bold">{frictionProps.staticFriction.toFixed(2)}</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, frictionProps.staticFriction * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-2 rounded bg-neutral-900/80 border border-neutral-800">
              <div className="flex justify-between text-neutral-400 mb-1">
                <span>Kinetic Friction (μ_k):</span>
                <span className="text-cyan-400 font-bold">{frictionProps.kineticFriction.toFixed(2)}</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, frictionProps.kineticFriction * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-neutral-400 text-xs px-1">
              <span>Rolling Friction (μ_r):</span>
              <span className="text-amber-400 font-semibold">{frictionProps.rollingFriction.toFixed(3)}</span>
            </div>

            <div className="flex justify-between text-neutral-400 text-xs px-1">
              <span>Restitution (e):</span>
              <span className="text-purple-400 font-semibold">{frictionProps.restitution.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
