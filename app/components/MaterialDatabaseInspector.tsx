"use client";

import React, { useMemo, useState } from "react";
import {
  evaluateFloorContactAO,
  evaluateSdfSoftShadow,
  type ShadowRayResult,
} from "../lib/contactShadows";
import { createProbeGrid, sampleProbeGrid, updateProbeGridFromScene } from "../lib/ddgiProbes";
import {
  CATALOG_VIEW,
  cvarLower,
  cvarUpper,
  evaluateRobustPair,
  getFrictionDistribution,
  sampleInfimum,
  sampleSupremum,
  SYNTHETIC_BANNER_TEXT,
  wassersteinBallRadius,
} from "../lib/droFrictionUncertainty";
import {
  createCraftsmanEmissives,
  EMISSIVE_PALETTE,
  type EmissiveRadianceResult,
  evaluateEmissiveSurface,
  kelvinToRgb,
} from "../lib/emissiveSurfaces";
import { evaluateSphericalHarmonics } from "../lib/houseLighting";
import { getProceduralMaterial, type MaterialKind } from "../lib/houseMaterials";
import {
  evaluateAnisotropicWoodFriction,
  evaluateStribeckFriction,
  getMaterialPairFriction,
  type HouseholdMaterial,
} from "../lib/materialPairFriction";
import {
  PBR_MATERIAL_SLOTS,
  type PBRMaterialClass,
  type PBRMaterialSlot,
  totalTextureBudgetMB,
} from "../lib/pbrPipeline";
import { applyPostFXSoftware, flickerFireplace, POSTFX_PROFILES } from "../lib/postFx";
import { DEFAULT_POST_FX_CONFIG, processPixelPostFx } from "../lib/postProcessingPipeline";
import {
  blendTemporalSsr,
  evaluateSchlickFresnel,
  type SsrHitResult,
  traceScreenSpaceRay,
} from "../lib/screenSpaceReflections";
import {
  applyExponentialHeightFog,
  computeAnalyticalFogOpticalDepth,
  henyeyGreensteinPhase,
  raymarchVolumetricSunbeams,
} from "../lib/volumetricLighting";

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
    ior: 1.5,
    densityKgM3: 900,
    frictionClass: "leather",
  },
];

const CATEGORY_TO_PBR_CLASS: Record<PbrMaterialSpec["category"], PBRMaterialClass> = {
  wood: "oak-wood",
  metal: "brass",
  stone: "stone-granite",
  ceramic: "ceramic-tile",
  glass: "glass-clear",
  fabric: "fabric-cotton",
  leather: "fabric-leather",
};

const CATEGORY_TO_PROCEDURAL_KIND: Record<PbrMaterialSpec["category"], MaterialKind> = {
  wood: "oak-hardwood",
  metal: "metal-bronze-brushed",
  stone: "granite-counter",
  ceramic: "subway-tile",
  glass: "glass-clear",
  fabric: "linen-fabric",
  leather: "leather-warm",
};

const CRAFTSMAN_EMISSIVES = createCraftsmanEmissives();
const SHARED_DDGI_GRID = createProbeGrid([0, 0, 1.25], [2.0, 1.4, 1.25], [4, 8, 3]);
updateProbeGridFromScene(
  SHARED_DDGI_GRID,
  (x, y, z) => Math.min(z, 2.5 - z, 2.0 - Math.abs(x), 1.4 - Math.abs(y)),
  CRAFTSMAN_EMISSIVES,
  { maxMarchSteps: 8, timeSeconds: 0.25 },
);

function hexToLinearRgb(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "");
  const num = Number.parseInt(clean, 16);
  if (!Number.isFinite(num)) return [0.5, 0.5, 0.5];
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [r ** 2.2, g ** 2.2, b ** 2.2];
}

export interface MaterialRenderingPipelineEvaluation {
  pbrSlot: PBRMaterialSlot;
  textureBudgetMb: number;
  proceduralMaps: {
    hasAlbedoMap: boolean;
    hasNormalMap: boolean;
    hasRoughnessMap: boolean;
  };
  stribeckAndAnisotropy: {
    stribeckFrictionAt005Mps: number;
    anisotropicAcrossGrainStatic: number;
    anisotropicAcrossGrainKinetic: number;
  };
  droUncertainty: {
    catalogPairCount: number;
    ballRadius: number;
    worstCaseUpperKinetic: number;
    worstCaseLowerKinetic: number;
    sampleMinKinetic: number;
    sampleMaxKinetic: number;
    provenance: string;
    syntheticBannerLength: number;
  };
  craftsmanEmissiveCount: number;
  hearthEmissiveEvaluation: EmissiveRadianceResult;
  shIrradiance: [number, number, number];
  ddgiIrradiance: { rgb: [number, number, number]; visibility: number };
  contactShadowAo: number;
  softShadowRay: ShadowRayResult;
  fireplaceFlickerMultiplier: number;
  ssrReflection: {
    hitResult: SsrHitResult;
    schlickFresnel: number;
    temporallyBlendedRadiance: [number, number, number];
  };
  volumetricAtmosphere: {
    fogOpticalDepth: number;
    hgPhase: number;
    sunbeamInscatter: [number, number, number];
    foggedSurfaceRgb: [number, number, number];
  };
  stageTonemappedRgb: [number, number, number];
  compositePostFxRgb: [number, number, number];
}

export function evaluateMaterialRenderingPipeline(
  mat: PbrMaterialSpec,
  stageProfileKey = "parlor-calm",
  frame = 12,
  matingMaterial: HouseholdMaterial = "hardwood",
): MaterialRenderingPipelineEvaluation {
  const pbrClass = CATEGORY_TO_PBR_CLASS[mat.category] ?? "oak-wood";
  const pbrSlot = PBR_MATERIAL_SLOTS[pbrClass];
  const textureBudgetMb = totalTextureBudgetMB();

  const pairFriction = getMaterialPairFriction(mat.frictionClass, matingMaterial);
  const stribeckFrictionAt005Mps = evaluateStribeckFriction(pairFriction, 0.05);
  const anisoWood = evaluateAnisotropicWoodFriction(pairFriction, [0, 1], [1, 0]);
  const stribeckAndAnisotropy = {
    stribeckFrictionAt005Mps,
    anisotropicAcrossGrainStatic: anisoWood.staticFriction,
    anisotropicAcrossGrainKinetic: anisoWood.kineticFriction,
  };

  const dist = getFrictionDistribution(mat.frictionClass, matingMaterial);
  const robustEval = evaluateRobustPair(mat.frictionClass, matingMaterial, {
    robust: true,
    alpha: 0.1,
    confidence: 0.95,
  });
  const muSamples = dist ? dist.samples.map((s) => s.muK) : [pairFriction.kineticFriction];
  const droUncertainty = {
    catalogPairCount: CATALOG_VIEW.length,
    ballRadius: robustEval ? robustEval.radius : wassersteinBallRadius(muSamples.length, 0.95),
    worstCaseUpperKinetic: robustEval
      ? robustEval.worstCase.kineticFriction
      : cvarUpper(muSamples, 0.1),
    worstCaseLowerKinetic: cvarLower(muSamples, 0.1),
    sampleMinKinetic: sampleInfimum(muSamples),
    sampleMaxKinetic: sampleSupremum(muSamples),
    provenance: robustEval?.provenance ?? "SYNTHETIC",
    syntheticBannerLength: SYNTHETIC_BANNER_TEXT.length,
  };

  const hearthFixture = CRAFTSMAN_EMISSIVES[0];
  const hearthEmissiveEvaluation = evaluateEmissiveSurface(hearthFixture, frame / 60);

  const procKind = CATEGORY_TO_PROCEDURAL_KIND[mat.category] ?? "oak-hardwood";
  const procMat = getProceduralMaterial(procKind, 32);
  const proceduralMaps = {
    hasAlbedoMap: Boolean(procMat.map),
    hasNormalMap: Boolean(procMat.normalMap),
    hasRoughnessMap: Boolean(procMat.roughnessMap),
  };

  const shIrradiance = evaluateSphericalHarmonics([0, 1, 0]);
  const ddgiIrradiance = sampleProbeGrid(SHARED_DDGI_GRID, [0, 0.5, 1.0], [0, 1, 0], 1.2);
  const contactShadowAo = evaluateFloorContactAO(
    [0, 0, 0],
    [{ id: "furniture-leg", position: [0.04, 0.02, 0.04], radius: 0.08, occlusionStrength: 0.85 }],
    0.0,
  );
  const softShadowRay = evaluateSdfSoftShadow(
    [0, 0, 0],
    [0.45, 0.82, 0.35],
    (p) => Math.hypot(p[0] - 0.3, p[1] - 0.55, p[2] - 0.25) - 0.16,
  );
  const fireplaceFlickerMultiplier = flickerFireplace(frame, 1.0);

  // Screen-Space Reflection (SSR) & Temporal AABB Variance Clamping
  const f0 = mat.metalness > 0.5 ? 0.75 : (((mat.ior ?? 1.5) - 1) / ((mat.ior ?? 1.5) + 1)) ** 2;
  const schlickFresnel = evaluateSchlickFresnel(0.65, f0);
  const ssrHit = traceScreenSpaceRay(
    [0.5, 0.5],
    2.2,
    [0.12, -0.35],
    1.5,
    (uv) => 2.35 - uv[1] * 0.2,
    [0, 1, 0],
    [0, 0.65, 0.76],
    mat.roughness,
  );
  const baseLinear = hexToLinearRgb(mat.baseColorHex);
  const ssrTemporal = blendTemporalSsr({
    currentRadiance: [
      baseLinear[0] * (1 + ssrHit.reflectionWeight),
      baseLinear[1] * (1 + ssrHit.reflectionWeight),
      baseLinear[2] * (1 + ssrHit.reflectionWeight),
    ],
    historyRadiance: [baseLinear[0] * 0.95, baseLinear[1] * 0.95, baseLinear[2] * 0.95],
    neighborhoodSamples: [
      baseLinear,
      [baseLinear[0] * 1.15, baseLinear[1] * 1.15, baseLinear[2] * 1.15],
    ],
    motionVectorUv: [0.002, -0.001],
    historyValid: true,
  });

  // Volumetric Lighting (Henyey-Greenstein Sunbeams & Exponential Height Fog)
  const cameraPos: [number, number, number] = [0, 1.65, 3.8];
  const surfacePos: [number, number, number] = [0, 0.4, 0];
  const fogOpticalDepth = computeAnalyticalFogOpticalDepth(cameraPos, surfacePos, 0.02, 0.5, 0.0);
  const hgPhase = henyeyGreensteinPhase(0.78, 0.7);
  const sunbeamInscatter = raymarchVolumetricSunbeams(
    cameraPos,
    [0, -0.31, -0.95],
    3.9,
    [0.35, 0.75, -0.56],
    (pos) => (pos[1] > 0.3 && pos[1] < 2.2 ? 1.0 : 0.0),
    16,
  );

  const emissiveBoost = mat.kelvinTemp
    ? kelvinToRgb(mat.kelvinTemp)
    : EMISSIVE_PALETTE.fireplace1500K;
  const rawSurfaceHdr: [number, number, number] = [
    ssrTemporal.blendedRadiance[0] * (shIrradiance[0] + ddgiIrradiance.rgb[0] * 0.5) * contactShadowAo +
      emissiveBoost[0] * 0.08 * fireplaceFlickerMultiplier +
      sunbeamInscatter[0] * 0.15,
    ssrTemporal.blendedRadiance[1] * (shIrradiance[1] + ddgiIrradiance.rgb[1] * 0.5) * contactShadowAo +
      emissiveBoost[1] * 0.08 * fireplaceFlickerMultiplier +
      sunbeamInscatter[1] * 0.15,
    ssrTemporal.blendedRadiance[2] * (shIrradiance[2] + ddgiIrradiance.rgb[2] * 0.5) * contactShadowAo +
      emissiveBoost[2] * 0.08 * fireplaceFlickerMultiplier +
      sunbeamInscatter[2] * 0.15,
  ];
  const hdrRadiance = applyExponentialHeightFog(rawSurfaceHdr, cameraPos, surfacePos);

  const profile = POSTFX_PROFILES[stageProfileKey] ?? POSTFX_PROFILES["parlor-calm"];
  const stageTonemappedRgb = applyPostFXSoftware(hdrRadiance, profile, [0.5, 0.5]);
  const compositePostFxRgb = processPixelPostFx(hdrRadiance, [0.5, 0.5], DEFAULT_POST_FX_CONFIG);

  return {
    pbrSlot,
    textureBudgetMb,
    proceduralMaps,
    stribeckAndAnisotropy,
    droUncertainty,
    craftsmanEmissiveCount: CRAFTSMAN_EMISSIVES.length,
    hearthEmissiveEvaluation,
    shIrradiance,
    ddgiIrradiance,
    contactShadowAo,
    softShadowRay,
    fireplaceFlickerMultiplier,
    ssrReflection: {
      hitResult: ssrHit,
      schlickFresnel,
      temporallyBlendedRadiance: ssrTemporal.blendedRadiance,
    },
    volumetricAtmosphere: {
      fogOpticalDepth,
      hgPhase,
      sunbeamInscatter,
      foggedSurfaceRgb: hdrRadiance,
    },
    stageTonemappedRgb,
    compositePostFxRgb,
  };
}

export function MaterialDatabaseInspector() {
  const [selectedMatId, setSelectedMatId] = useState<string>("quarter-sawn-oak");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [matingMaterial, setMatingMaterial] = useState<HouseholdMaterial>("hardwood");
  const [stageProfileKey, setStageProfileKey] = useState<string>("parlor-calm");

  const filteredMaterials = useMemo(() => {
    if (filterCategory === "all") return CRAFTSMAN_MATERIAL_DATABASE;
    return CRAFTSMAN_MATERIAL_DATABASE.filter((m) => m.category === filterCategory);
  }, [filterCategory]);

  const activeMat = useMemo(() => {
    return (
      CRAFTSMAN_MATERIAL_DATABASE.find((m) => m.id === selectedMatId) ??
      CRAFTSMAN_MATERIAL_DATABASE[0]
    );
  }, [selectedMatId]);

  const frictionProps = useMemo(() => {
    return getMaterialPairFriction(activeMat.frictionClass, matingMaterial);
  }, [activeMat, matingMaterial]);

  const pipelineEval = useMemo(() => {
    return evaluateMaterialRenderingPipeline(activeMat, stageProfileKey, 12, matingMaterial);
  }, [activeMat, stageProfileKey, matingMaterial]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-neutral-100 font-mono text-sm max-w-4xl mx-auto shadow-2xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-amber-400">
            PBR Material Database & Physical Matrix
          </h2>
          <p className="text-xs text-neutral-400">
            Craftsman 1928 Catalog • Shading Parameters & Contact Presets
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="material-category-filter" className="text-xs text-neutral-400">
            Filter:
          </label>
          <select
            id="material-category-filter"
            className="min-h-11 max-w-full bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
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
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-amber-400">
              Cook-Torrance GGX
            </span>
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
              <span className="text-neutral-200 font-semibold">
                {activeMat.roughness.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Metalness:</span>
              <span className="text-neutral-200 font-semibold">
                {activeMat.metalness.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Clearcoat:</span>
              <span className="text-neutral-200 font-semibold">
                {(activeMat.clearcoat ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Index of Refraction (IOR):</span>
              <span className="text-neutral-200 font-semibold">
                {(activeMat.ior ?? 1.5).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Bulk Density:</span>
              <span className="text-neutral-200 font-semibold">{activeMat.densityKgM3} kg/m³</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>glTF Slot / KTX2 Budget:</span>
              <span className="text-cyan-300 font-semibold">
                {pipelineEval.pbrSlot.class} ({pipelineEval.textureBudgetMb.toFixed(1)} MB)
              </span>
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
                <span className="text-emerald-400 font-bold">
                  {frictionProps.staticFriction.toFixed(2)}
                </span>
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
                <span className="text-cyan-400 font-bold">
                  {frictionProps.kineticFriction.toFixed(2)}
                </span>
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
              <span className="text-amber-400 font-semibold">
                {frictionProps.rollingFriction.toFixed(3)}
              </span>
            </div>

            <div className="flex justify-between text-neutral-400 text-xs px-1">
              <span>Restitution (e):</span>
              <span className="text-purple-400 font-semibold">
                {frictionProps.restitution.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-neutral-400 text-xs px-1">
              <span>Stribeck (0.05 m/s) / Cross-Grain:</span>
              <span className="text-cyan-300 font-semibold">
                {pipelineEval.stribeckAndAnisotropy.stribeckFrictionAt005Mps.toFixed(2)} /{" "}
                {pipelineEval.stribeckAndAnisotropy.anisotropicAcrossGrainStatic.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-neutral-400 text-xs px-1">
              <span>DRO CVaR [low, high] (r={pipelineEval.droUncertainty.ballRadius.toFixed(2)}):</span>
              <span className="text-amber-300 font-semibold">
                [{pipelineEval.droUncertainty.worstCaseLowerKinetic.toFixed(2)},{" "}
                {pipelineEval.droUncertainty.worstCaseUpperKinetic.toFixed(2)}] (
                {pipelineEval.droUncertainty.provenance})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Photoreal Lighting, DDGI, Contact Shadow & ACES Post-FX Pipeline */}
      <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-4 space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-amber-300">
              Photoreal Lighting, DDGI Irradiance & ACES Post-FX Pipeline
            </span>
            <p className="text-[11px] text-neutral-400">
              Live L2 Spherical Harmonics + 4×8×3 DDGI Probe Grid + Contact AO + Narkowicz ACES
              Filmic Tonemap
            </p>
          </div>
          <select
            aria-label="Post-FX Stage Profile"
            className="bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 text-amber-200"
            value={stageProfileKey}
            onChange={(e) => setStageProfileKey(e.target.value)}
          >
            {Object.keys(POSTFX_PROFILES).map((k) => (
              <option key={k} value={k}>
                Profile: {k}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800">
            <div className="text-neutral-400">SH + DDGI Irradiance</div>
            <div className="text-neutral-100 font-semibold mt-0.5">
              RGB [{pipelineEval.ddgiIrradiance.rgb.map((v) => v.toFixed(2)).join(", ")}]
            </div>
            <div className="text-[10px] text-emerald-400">
              Vis: {(pipelineEval.ddgiIrradiance.visibility * 100).toFixed(0)}% • IBL:{" "}
              {pipelineEval.pbrSlot.iblContribution}
            </div>
          </div>

          <div className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800">
            <div className="text-neutral-400">Contact & Soft Shadows</div>
            <div className="text-neutral-100 font-semibold mt-0.5">
              AO: {(pipelineEval.contactShadowAo * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-cyan-400">
              PCSS Penumbra: {pipelineEval.softShadowRay.penumbraWidth.toFixed(3)}m
            </div>
          </div>

          <div className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800">
            <div className="text-neutral-400">Procedural Maps</div>
            <div className="text-neutral-100 font-semibold mt-0.5">
              {[
                pipelineEval.proceduralMaps.hasAlbedoMap ? "Albedo" : null,
                pipelineEval.proceduralMaps.hasNormalMap ? "Normal" : null,
                pipelineEval.proceduralMaps.hasRoughnessMap ? "Roughness" : null,
              ]
                .filter(Boolean)
                .join(" + ") || "Analytic BRDF"}
            </div>
            <div className="text-[10px] text-amber-400">
              Hearth Flicker: {pipelineEval.fireplaceFlickerMultiplier.toFixed(3)}×
            </div>
          </div>

          <div className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800">
            <div className="text-neutral-400">SSR, Volumetrics & ACES</div>
            <div className="text-neutral-100 font-semibold mt-0.5">
              ACES [{pipelineEval.stageTonemappedRgb.map((c) => c.toFixed(2)).join(", ")}]
            </div>
            <div className="text-[10px] text-purple-300">
              SSR F={pipelineEval.ssrReflection.schlickFresnel.toFixed(2)} • τ_fog=
              {pipelineEval.volumetricAtmosphere.fogOpticalDepth.toFixed(3)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
