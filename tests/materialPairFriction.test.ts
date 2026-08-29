import { describe, expect, test } from "bun:test";
import {
  combineCustomMaterials,
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
    expect(rubberWood.kineticFriction).toBe(0.70);

    const fabricFabric = getMaterialPairFriction("fabric", "fabric");
    expect(fabricFabric.rollingFriction).toBe(0.08);
    expect(fabricFabric.restitution).toBe(0.05);

    const steelSteel = getMaterialPairFriction("steel", "steel");
    expect(steelSteel.restitution).toBe(0.60);
  });

  test("combines custom materials using geometric mean mixing laws", () => {
    const customMatA = {
      id: "synthetic-polymer",
      staticFriction: 0.64,
      kineticFriction: 0.49,
      rollingFriction: 0.01,
      restitution: 0.50,
      damping: 0.20,
    };

    const customMatB = {
      id: "granite-slab",
      staticFriction: 0.36,
      kineticFriction: 0.25,
      rollingFriction: 0.004,
      restitution: 0.20,
      damping: 0.10,
    };

    const combined = combineCustomMaterials(customMatA, customMatB);
    // sqrt(0.64 * 0.36) = sqrt(0.2304) = 0.48
    expect(combined.staticFriction).toBeCloseTo(0.48, 4);
    // sqrt(0.49 * 0.25) = sqrt(0.1225) = 0.35
    expect(combined.kineticFriction).toBeCloseTo(0.35, 4);
    expect(combined.restitution).toBe(0.20);
    expect(combined.rollingFriction).toBe(0.01);
  });
});
