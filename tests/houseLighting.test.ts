import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import {
  evaluateSphericalHarmonics,
  generateCraftsmanHdrEnvMap,
  setupCraftsmanLighting,
} from "../app/lib/houseLighting";

describe("Image-Based Lighting (IBL) & Photometric Lighting Engine", () => {
  test("evaluates spherical harmonics irradiance on all canonical normals", () => {
    const normals: Array<[number, number, number]> = [
      [0, 1, 0], // Up
      [0, -1, 0], // Down (floor bounce)
      [1, 0, 0], // East
      [-1, 0, 0], // West
      [0, 0, 1], // South (sunlight)
      [0, 0, -1], // North
    ];

    for (const n of normals) {
      const [r, g, b] = evaluateSphericalHarmonics(n);
      expect(r).toBeGreaterThan(0);
      expect(g).toBeGreaterThan(0);
      expect(b).toBeGreaterThan(0);
    }
  });

  test("generates valid 32-bit floating-point HDR equirectangular radiance map", () => {
    const envMap = generateCraftsmanHdrEnvMap(64, 32);
    expect(envMap).toBeInstanceOf(THREE.DataTexture);
    expect(envMap.type).toBe(THREE.FloatType);
    expect(envMap.image.width).toBe(64);
    expect(envMap.image.height).toBe(32);

    const data = envMap.image.data as Float32Array;
    expect(data).not.toBeNull();
    expect(data.length).toBe(64 * 32 * 4);

    // Verify HDR dynamic range (sun spot should have values > 2.0)
    let maxRadiance = 0;
    for (let i = 0; i < data.length; i += 4) {
      const lum = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
      if (lum > maxRadiance) maxRadiance = lum;
    }
    expect(maxRadiance).toBeGreaterThan(2.0);

    envMap.dispose();
  });

  test("setupCraftsmanLighting attaches lights and configures scene environment", () => {
    const scene = new THREE.Scene();
    const rig = setupCraftsmanLighting(scene, { enableShadows: true, useHdrEnv: true });

    expect(scene.children.length).toBeGreaterThanOrEqual(4);
    expect(rig.sunLight.castShadow).toBe(true);
    expect(rig.roomPointLights.length).toBe(2);
    expect(scene.environment).toBe(rig.envMap!);

    // Test clean disposal
    rig.dispose();
    expect(scene.children.length).toBe(0);
    expect(scene.environment).toBeNull();
  });
});
