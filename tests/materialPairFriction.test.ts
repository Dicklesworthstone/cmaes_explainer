import { describe, expect, test } from "bun:test";
import {
  combineCustomMaterials,
  evaluateAnisotropicWoodFriction,
  evaluateStribeckFriction,
  getMaterialPairFriction,
  INTRINSIC_MATERIALS,
  type PhysicsMaterialId,
} from "../app/lib/materialPairFriction";

describe("Per-Material-Pair Friction & Restitution Engine", () => {
  const allMaterials = Object.keys(INTRINSIC_MATERIALS) as PhysicsMaterialId[];

  test("satisfies pair symmetry: getMaterialPairFriction(A, B) == getMaterialPairFriction(B, A)", () => {
    for (const matA of allMaterials) {
      for (const matB of allMaterials) {
        const pairAB = getMaterialPairFriction(matA, matB);
        const pairBA = getMaterialPairFriction(matB, matA);

        expect(pairAB.staticFriction).toBe(pairBA.staticFriction);
        expect(pairAB.kineticFriction).toBe(pairBA.kineticFriction);
        expect(pairAB.rollingFriction).toBe(pairBA.rollingFriction);
        expect(pairAB.restitution).toBe(pairBA.restitution);
        expect(pairAB.damping).toBe(pairBA.damping);
      }
    }
  });

  test("satisfies physical bounds across all 81 material pairings", () => {
    for (const matA of allMaterials) {
      for (const matB of allMaterials) {
        const pair = getMaterialPairFriction(matA, matB);

        // Law: kinetic friction cannot exceed static friction
        expect(pair.kineticFriction).toBeLessThanOrEqual(pair.staticFriction);

        // Restitution bounded in [0, 1]
        expect(pair.restitution).toBeGreaterThanOrEqual(0.0);
        expect(pair.restitution).toBeLessThanOrEqual(1.0);

        // Positive friction coefficients
        expect(pair.staticFriction).toBeGreaterThan(0.05);
        expect(pair.staticFriction).toBeLessThan(1.5);
        expect(pair.rollingFriction).toBeGreaterThan(0.0);
      }
    }
  });

  test("evaluates calibrated empirical values for key household pairs", () => {
    const rubberWood = getMaterialPairFriction("rubber", "hardwood");
    expect(rubberWood.staticFriction).toBe(0.85);
    expect(rubberWood.kineticFriction).toBe(0.7);

    const fabricFabric = getMaterialPairFriction("fabric", "fabric");
    expect(fabricFabric.rollingFriction).toBe(0.08);
    expect(fabricFabric.restitution).toBe(0.05);

    const steelSteel = getMaterialPairFriction("steel", "steel");
    expect(steelSteel.restitution).toBe(0.6);
  });

  test("combines custom materials using geometric mean mixing laws", () => {
    const customMatA = {
      id: "synthetic-polymer",
      staticFriction: 0.64,
      kineticFriction: 0.49,
      rollingFriction: 0.01,
      restitution: 0.5,
      damping: 0.2,
    };

    const customMatB = {
      id: "granite-slab",
      staticFriction: 0.36,
      kineticFriction: 0.25,
      rollingFriction: 0.004,
      restitution: 0.2,
      damping: 0.1,
    };

    const combined = combineCustomMaterials(customMatA, customMatB);
    // sqrt(0.64 * 0.36) = sqrt(0.2304) = 0.48
    expect(combined.staticFriction).toBeCloseTo(0.48, 4);
    // sqrt(0.49 * 0.25) = sqrt(0.1225) = 0.35
    expect(combined.kineticFriction).toBeCloseTo(0.35, 4);
    expect(combined.restitution).toBe(0.2);
    expect(combined.rollingFriction).toBe(0.01);
  });

  test("evaluates Stribeck velocity transition and anisotropic hardwood grain friction", () => {
    const rubberWood = getMaterialPairFriction("rubber", "hardwood");
    // At zero slip speed -> static friction; at high slip speed -> kinetic friction
    expect(evaluateStribeckFriction(rubberWood, 0.0)).toBeCloseTo(rubberWood.staticFriction, 6);
    expect(evaluateStribeckFriction(rubberWood, 1.0)).toBeCloseTo(rubberWood.kineticFriction, 4);
    const midMu = evaluateStribeckFriction(rubberWood, 0.05, 0.05);
    expect(midMu).toBeGreaterThan(rubberWood.kineticFriction);
    expect(midMu).toBeLessThan(rubberWood.staticFriction);

    // Along grain [1, 0] vs across grain [0, 1]
    const alongGrain = evaluateAnisotropicWoodFriction(rubberWood, [1, 0], [1, 0], 1.3);
    const acrossGrain = evaluateAnisotropicWoodFriction(rubberWood, [0, 1], [1, 0], 1.3);
    expect(alongGrain.kineticFriction).toBeCloseTo(rubberWood.kineticFriction, 6);
    expect(acrossGrain.kineticFriction).toBeCloseTo(rubberWood.kineticFriction * 1.3, 6);
    expect(acrossGrain.rollingFriction).toBeGreaterThan(alongGrain.rollingFriction);
  });
});
