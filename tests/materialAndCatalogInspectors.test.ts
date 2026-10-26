import { describe, expect, test } from "bun:test";
import { evaluateFrontierKernelAndStressDiagnostics } from "../app/components/FrankenRobotsResearchAnnex";
import { evaluateG1DifferentiableSdfAndImpulseDiagnostics } from "../app/components/G1PhysicsDebugOverlay";
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
        expect(snap.qualityTierAndCausalControls.ssrMissResultHit).toBe(false);
        expect(snap.qualityTierAndCausalControls.ssrMissFallbackIblLuma).toBeGreaterThan(0);
        expect(snap.qualityTierAndCausalControls.daylitSunbeamLuma).toBeGreaterThan(
          snap.qualityTierAndCausalControls.eveningSunbeamLuma,
        );
        expect(snap.qualityTierAndCausalControls.windowOccludedSunbeamLuma).toBe(0);
        expect(snap.qualityTierAndCausalControls.highTierStepBudget).toBeGreaterThan(
          snap.qualityTierAndCausalControls.reducedMotionStepBudget,
        );
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

  test("evaluateFrontierKernelAndStressDiagnostics verifies ablation action-causality, multi-seed household CMA-ES, held-out stress seeds, and tour/visitor continuity (cmaes-feat-fs8..fs12, cmaes-jhv, cmaes-19t)", () => {
    const diag = evaluateFrontierKernelAndStressDiagnostics(101);

    // Ablation action-causality & multi-seed CMA-ES
    expect(diag.ablationCausalInterventions.zeroActionControl.actionCausalVerified).toBe(true);
    expect(diag.ablationCausalInterventions.zeroActionControl.distanceMeters).toBe(0);
    expect(diag.ablationCausalInterventions.cmaesBudgetProgression.searchImprovedObjective).toBe(
      true,
    );
    expect(
      diag.ablationCausalInterventions.multiSeedConsistency.allSeedsImprovedOverZeroAction,
    ).toBe(true);
    expect(diag.ablationCausalInterventions.multiSeedConsistency.seedReplayDeterministic).toBe(
      true,
    );

    // Multi-seed equal-budget household CMA-ES campaign + impassable obstacle intervention
    expect(diag.householdCmaesCampaign.allEqualBudgetsVerified).toBe(true);
    expect(diag.householdCmaesCampaign.allSeedsImprovedOverInitial).toBe(true);
    expect(
      diag.householdCmaesCampaign.impassableObstacleIntervention.impassableRefusedCompletion,
    ).toBe(true);

    // Shuffled stress held-out seed separation + infeasible layout recording
    expect(diag.shuffledStressHeldOutControls.seedsDisjoint).toBe(true);
    expect(diag.shuffledStressHeldOutControls.seedReplayDeterministic).toBe(true);
    expect(
      diag.shuffledStressHeldOutControls.infeasibleStartControl.explicitlyRecordedNotRedrawn,
    ).toBe(true);

    // Tour & visitor continuity + reduced-motion + blocked-doorway failure exposure
    expect(diag.tourAndVisitorContinuity.tour.continuousWithoutTeleport).toBe(true);
    expect(diag.tourAndVisitorContinuity.visitor.episodeSuccess).toBe(true);
    expect(diag.tourAndVisitorContinuity.visitor.collisionOccurred).toBe(false);
    expect(diag.tourAndVisitorContinuity.visitor.defaultAutoplay).toBe(false);
    expect(diag.tourAndVisitorContinuity.visitor.standardCameraTravelMeters).toBeGreaterThan(1.0);
    expect(diag.tourAndVisitorContinuity.visitor.reducedMotionFirstSegmentJitterMeters).toBe(0);
    expect(diag.tourAndVisitorContinuity.visitor.blockedDoorwayFailureExposed).toBe(true);
  });

  test("evaluateG1DifferentiableSdfAndImpulseDiagnostics verifies bit-exact subnormal/-0 policy exchange and atomic wrong-owner/wrong-length refusal (cmaes-za0x.6, cmaes-za0x.7)", () => {
    const g1Diag = evaluateG1DifferentiableSdfAndImpulseDiagnostics();
    expect(g1Diag.stepwiseSchema.trainingSessionRoundtripValid).toBe(true);
    expect(g1Diag.stepwiseSchema.policyShareRoundtripValid).toBe(true);
    expect(g1Diag.stepwiseSchema.bitExactSubnormalAndNegZeroPreserved).toBe(true);
    expect(g1Diag.stepwiseSchema.wrongLengthRefusedAtomically).toBe(true);
    expect(g1Diag.stepwiseSchema.wrongOwnerSessionRefused).toBe(true);
  });
});
