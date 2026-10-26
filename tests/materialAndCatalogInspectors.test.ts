import { describe, expect, test } from "bun:test";
import {
  CRAFTSMAN_MATERIAL_DATABASE,
  evaluateMaterialRenderingPipeline,
} from "../app/components/MaterialDatabaseInspector";
import { FURNITURE_KIND_DEFAULTS, type FurnitureKind } from "../app/lib/furnitureTaxonomy";
import { CRAFTSMAN_BUNGALOW_1928 } from "../app/lib/houseScenes";

describe("Material Database & Furniture Catalog Inspector Modules", () => {
  test("CRAFTSMAN_MATERIAL_DATABASE contains valid PBR materials for all major categories", () => {
    expect(CRAFTSMAN_MATERIAL_DATABASE.length).toBeGreaterThanOrEqual(9);

    const categories = new Set(CRAFTSMAN_MATERIAL_DATABASE.map((m) => m.category));
    expect(categories.has("wood")).toBe(true);
    expect(categories.has("metal")).toBe(true);
    expect(categories.has("ceramic")).toBe(true);
    expect(categories.has("glass")).toBe(true);
    expect(categories.has("fabric")).toBe(true);
    expect(categories.has("leather")).toBe(true);

    for (const mat of CRAFTSMAN_MATERIAL_DATABASE) {
      expect(mat.roughness).toBeGreaterThanOrEqual(0.0);
      expect(mat.roughness).toBeLessThanOrEqual(1.0);
      expect(mat.metalness).toBeGreaterThanOrEqual(0.0);
      expect(mat.metalness).toBeLessThanOrEqual(1.0);
      expect(mat.densityKgM3).toBeGreaterThan(0);
      expect(mat.baseColorHex.startsWith("#")).toBe(true);
    }
  });

  test("evaluateMaterialRenderingPipeline computes PBR, DDGI, Contact Shadow, and ACES Post-FX telemetry across materials and profiles", () => {
    const profiles = ["parlor-calm", "kitchen-warm", "porch-bright", "bedroom-moody"] as const;

    for (const mat of CRAFTSMAN_MATERIAL_DATABASE) {
      for (const profile of profiles) {
        const snap = evaluateMaterialRenderingPipeline(mat, profile, 12);

        expect(snap.pbrSlot.class.length).toBeGreaterThan(0);
        expect(snap.textureBudgetMb).toBeGreaterThan(0);
        expect(snap.stribeckAndAnisotropy.stribeckFrictionAt005Mps).toBeGreaterThan(0);
        expect(snap.stribeckAndAnisotropy.anisotropicAcrossGrainStatic).toBeGreaterThan(
          snap.stribeckAndAnisotropy.anisotropicAcrossGrainKinetic,
        );
        expect(snap.stribeckAndAnisotropy.combinedCustomKinetic).toBeGreaterThan(0);
        expect(snap.stribeckAndAnisotropy.combinedCustomRestitution).toBeGreaterThanOrEqual(0);
        expect(snap.droUncertainty.catalogPairCount).toBeGreaterThanOrEqual(36);
        expect(snap.droUncertainty.ballRadius).toBeGreaterThan(0);
        expect(snap.droUncertainty.worstCaseUpperKinetic).toBeGreaterThanOrEqual(
          snap.droUncertainty.worstCaseLowerKinetic,
        );
        expect(snap.droUncertainty.sampleMaxKinetic).toBeGreaterThanOrEqual(
          snap.droUncertainty.sampleMinKinetic,
        );
        expect(snap.droUncertainty.syntheticBannerLength).toBeGreaterThan(50);
        expect(snap.craftsmanEmissiveCount).toBeGreaterThanOrEqual(4);
        expect(snap.hearthEmissiveEvaluation.intensity).toBeGreaterThan(0);
        expect(snap.emissiveDiagnostics.supportedKindCount).toBe(8);
        expect(snap.emissiveDiagnostics.customEmissiveIntensity).toBeGreaterThan(0);
        expect(snap.emissiveDiagnostics.customEmissiveColorRgb.length).toBe(3);
        expect(snap.emissiveDiagnostics.blackbody2700KRgb[0]).toBeGreaterThan(0);
        expect(snap.emissiveDiagnostics.fireplaceFlickerFactor).toBeGreaterThan(0);
        expect(snap.emissiveDiagnostics.appliedMaterialEmissiveIntensity).toBeGreaterThan(0);
        expect(snap.ddgiDiagnostics.octahedralDirCount).toBe(64);
        expect(snap.ddgiDiagnostics.zenithCellIndex).toBeGreaterThanOrEqual(0);
        expect(snap.ddgiDiagnostics.zenithCellRoundtripDot).toBeGreaterThan(0.5);
        expect(snap.ddgiDiagnostics.fallbackUpIrradianceLuma).toBeGreaterThan(0);
        expect(snap.ddgiDiagnostics.hysteresisBlendedValue).toBeCloseTo(1.1, 5);
        expect(snap.ddgiDiagnostics.scratchProbeResetZeroed).toBe(true);
        expect(typeof snap.ddgiDiagnostics.texture3DAvailable).toBe("boolean");
        const expectsTextureMaps = mat.category !== "metal" && mat.category !== "glass";
        expect(snap.proceduralMaps.hasAlbedoMap).toBe(expectsTextureMaps);
        expect(snap.proceduralMaps.hasNormalMap).toBe(expectsTextureMaps);
        expect(snap.proceduralMaps.hasRoughnessMap).toBe(expectsTextureMaps);
        expect(snap.proceduralMaps.synthesizedTexelTotal).toBe(256);
        expect(snap.proceduralMaps.disposedCacheEntries).toBeGreaterThanOrEqual(1);
        expect(snap.proceduralMaps.hdrEnvTexelCount).toBe(128);
        expect(snap.proceduralMaps.rigPointLightCount).toBeGreaterThanOrEqual(2);
        expect(snap.proceduralMaps.rigSunIntensity).toBeGreaterThan(0);
        expect(snap.shIrradiance.length).toBe(3);
        expect(snap.shIrradiance.every((c) => Number.isFinite(c) && c >= 0)).toBe(true);
        expect(snap.ddgiIrradiance.rgb.length).toBe(3);
        expect(snap.ddgiIrradiance.rgb.every((c) => Number.isFinite(c) && c >= 0)).toBe(true);
        expect(snap.contactShadowAo).toBeGreaterThan(0);
        expect(snap.contactShadowAo).toBeLessThanOrEqual(1);
        expect(snap.softShadowRay.shadowFactor).toBeGreaterThanOrEqual(0);
        expect(snap.softShadowRay.shadowFactor).toBeLessThanOrEqual(1);
        expect(snap.fireplaceFlickerMultiplier).toBeGreaterThan(0);
        expect(snap.ssrReflection.schlickFresnel).toBeGreaterThan(0);
        expect(snap.ssrReflection.schlickFresnel).toBeLessThanOrEqual(1);
        expect(snap.ssrReflection.reflectionVector[1]).toBeGreaterThan(0);
        expect(snap.ssrReflection.screenEdgeFade).toBeGreaterThanOrEqual(0);
        expect(snap.ssrReflection.maxSteps).toBe(64);
        expect(
          snap.ssrReflection.temporallyBlendedRadiance.every((c) => Number.isFinite(c) && c >= 0),
        ).toBe(true);
        expect(snap.volumetricAtmosphere.fogOpticalDepth).toBeGreaterThan(0);
        expect(snap.volumetricAtmosphere.hgPhase).toBeGreaterThan(0);
        expect(
          snap.volumetricAtmosphere.sunbeamInscatter.every((c) => Number.isFinite(c) && c >= 0),
        ).toBe(true);
        expect(snap.postFxDiagnostics.acesCoeffA).toBeCloseTo(2.51, 2);
        expect(snap.postFxDiagnostics.scalarAcesMidgray).toBeGreaterThan(0);
        expect(snap.postFxDiagnostics.cornerVignetteFactor).toBeLessThan(1.0);
        expect(snap.postFxDiagnostics.chromaticAberrationDeltaU).toBeGreaterThan(0);
        expect(snap.postFxDiagnostics.srgbMidgray).toBeGreaterThan(0.4);
        expect(snap.stageTonemappedRgb.every((c) => Number.isFinite(c) && c >= 0)).toBe(true);
        expect(snap.compositePostFxRgb.every((c) => c >= 0 && c <= 1)).toBe(true);
      }
    }
  });

  test("CRAFTSMAN_BUNGALOW_1928 catalog has complete geometry for all 70+ furniture pieces", () => {
    expect(CRAFTSMAN_BUNGALOW_1928.furniture.length).toBeGreaterThanOrEqual(60);

    for (const piece of CRAFTSMAN_BUNGALOW_1928.furniture) {
      expect(piece.name.length).toBeGreaterThan(0);
      expect(piece.room.length).toBeGreaterThan(0);
      expect(piece.size[0]).toBeGreaterThan(0);
      expect(piece.size[1]).toBeGreaterThan(0);
      expect(piece.height).toBeGreaterThan(0);
      expect(Number.isFinite(piece.center[0])).toBe(true);
      expect(Number.isFinite(piece.center[1])).toBe(true);
      expect(Number.isFinite(piece.rotation)).toBe(true);
      expect(piece.note.length).toBeGreaterThan(0);

      if (piece.kind && (piece.kind as FurnitureKind) in FURNITURE_KIND_DEFAULTS) {
        const k = piece.kind as FurnitureKind;
        const d = FURNITURE_KIND_DEFAULTS[k];
        expect(d.defaultMass).toBeGreaterThan(0);
      }
    }
  });
});
