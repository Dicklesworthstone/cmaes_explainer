import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import {
  fbm,
  generateFabricTexture,
  generateMarbleTexture,
  generateTileTexture,
  generateWoodTexture,
  getProceduralMaterial,
  type MaterialKind,
  SeededRNG,
} from "../app/lib/houseMaterials";

describe("Procedural PBR Materials", () => {
  test("SeededRNG produces bit-identical sequences for identical seeds", () => {
    const rng1 = new SeededRNG(12345);
    const rng2 = new SeededRNG(12345);

    for (let i = 0; i < 50; i++) {
      expect(rng1.next()).toBe(rng2.next());
    }
  });

  test("fbm evaluates smooth bounded values", () => {
    for (let i = 0; i < 20; i++) {
      const val = fbm(i * 0.1, i * 0.2);
      expect(val).toBeGreaterThanOrEqual(-1.5);
      expect(val).toBeLessThanOrEqual(1.5);
    }
  });

  test("generateWoodTexture produces bit-exact deterministic byte output", () => {
    const texA = generateWoodTexture(64, 64, [180, 120, 80], [100, 60, 40]);
    const texB = generateWoodTexture(64, 64, [180, 120, 80], [100, 60, 40]);

    expect(texA.albedoData.length).toBe(64 * 64 * 4);
    expect(texA.albedoData.length).toBe(texB.albedoData.length);

    let identical = true;
    for (let i = 0; i < texA.albedoData.length; i++) {
      if (texA.albedoData[i] !== texB.albedoData[i]) {
        identical = false;
        break;
      }
    }
    expect(identical).toBe(true);

    texA.albedoMap.dispose();
    texB.albedoMap.dispose();
  });

  test("generateFabricTexture, TileTexture, and MarbleTexture produce valid maps", () => {
    const fab = generateFabricTexture(32, 32, [200, 200, 200]);
    expect(fab.albedoMap).toBeInstanceOf(THREE.DataTexture);
    fab.albedoMap.dispose();

    const tile = generateTileTexture(32, 32, [240, 240, 240], [50, 50, 50]);
    expect(tile.roughnessMap).toBeInstanceOf(THREE.DataTexture);
    tile.roughnessMap.dispose();

    const marble = generateMarbleTexture(32, 32);
    expect(marble.albedoMap).toBeInstanceOf(THREE.DataTexture);
    marble.albedoMap.dispose();
  });

  test("getProceduralMaterial instantiates all MaterialKind presets", () => {
    const kinds: MaterialKind[] = [
      "oak-hardwood",
      "walnut-dark",
      "pine-craftsman",
      "linen-fabric",
      "leather-warm",
      "wool-carpet",
      "ceramic-tile",
      "subway-tile",
      "marble-carrara",
      "granite-counter",
      "metal-bronze-brushed",
      "metal-stainless-steel",
      "metal-cast-iron",
      "glass-clear",
      "glass-frosted",
      "plaster-wall",
    ];

    for (const kind of kinds) {
      const mat = getProceduralMaterial(kind, 32);
      expect(mat).toBeInstanceOf(THREE.Material);
      expect(mat.roughness).toBeDefined();
    }
  });
});
