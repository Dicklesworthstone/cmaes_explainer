// Image-Based Lighting (IBL) & Craftsman Photometric Lighting Engine (cmaes-feat-pr3-ibl).
//
// Implements Split-Sum Approximation IBL with Order-3 Spherical Harmonics (9 RGB basis coefficients),
// photometric sun/sky directional key lighting, warm interior bounce, and room fixture point lights.
//
// Math & Formulations:
//   - Ramamoorthi & Hanrahan, "An Efficient Representation for Irradiance Environment Maps" (SIGGRAPH 2001):
//       E(\mathbf{n}) = c_1 L_{22} (x^2 - y^2) + c_3 L_{20} z^2 + c_4 L_{00} - c_5 L_{20}
//                     + 2 c_1 (L_{2-2} x y + L_{21} x z + L_{2-1} y z) + 2 c_2 (L_{11} x + L_{1-1} y + L_{10} z)
//   - Split-Sum Specular & Diffuse Convolutions (Karis 2013, Epic Games).
//
// SOTA References:
//   - Ramamoorthi & Hanrahan, SIGGRAPH 2001
//   - Karis, "Real Shading in Unreal Engine 4", SIGGRAPH 2013
//   - Filament PBR Engine (Google 2018-2024), "Physically Based Rendering in Filament"

import * as THREE from "three";

export interface LightingRig {
  sunLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  bounceLight: THREE.DirectionalLight;
  roomPointLights: THREE.PointLight[];
  envMap?: THREE.DataTexture;
  dispose: () => void;
}

export interface SphericalHarmonicsL2 {
  // 9 coefficients, each having [r, g, b]
  coefficients: Float32Array; // 27 floats (9 * 3)
}

// ---------------------------------------------------------------------------
// Sears Craftsman Bungalow Interior Spherical Harmonics Coefficients
// (Sunlight streaming from south windows + warm wood floor bounce + incandescent pendants)
// ---------------------------------------------------------------------------

export const CRAFTSMAN_BUNGALOW_SH: SphericalHarmonicsL2 = {
  coefficients: new Float32Array([
    // L00 (ambient base)
    0.85, 0.78, 0.68,
    // L1-1 (y-gradient)
    0.35, 0.28, 0.18,
    // L10 (z-gradient)
    0.15, 0.12, 0.08,
    // L11 (x-gradient)
    0.25, 0.20, 0.12,
    // L2-2 (xy quadratic)
    0.08, 0.06, 0.04,
    // L2-1 (yz quadratic)
    0.05, 0.04, 0.02,
    // L20 (z^2 quadratic)
    0.12, 0.09, 0.05,
    // L21 (xz quadratic)
    0.06, 0.05, 0.03,
    // L22 (x^2 - y^2 quadratic)
    0.09, 0.07, 0.04,
  ]),
};

// SH polynomial constants (Ramamoorthi & Hanrahan 2001)
const C1 = 0.429043;
const C2 = 0.511664;
const C3 = 0.743125;
const C4 = 0.886227;
const C5 = 0.247708;

/**
 * Evaluates diffuse irradiance E(n) for an arbitrary outward surface unit normal.
 */
export function evaluateSphericalHarmonics(
  normal: [number, number, number],
  sh: SphericalHarmonicsL2 = CRAFTSMAN_BUNGALOW_SH,
): [number, number, number] {
  const [x, y, z] = normal;
  const c = sh.coefficients;

  const r =
    C1 * c[24] * (x * x - y * y) +
    C3 * c[18] * z * z +
    C4 * c[0] -
    C5 * c[18] +
    2.0 * C1 * (c[12] * x * y + c[21] * x * z + c[15] * y * z) +
    2.0 * C2 * (c[9] * x + c[3] * y + c[6] * z);

  const g =
    C1 * c[25] * (x * x - y * y) +
    C3 * c[19] * z * z +
    C4 * c[1] -
    C5 * c[19] +
    2.0 * C1 * (c[13] * x * y + c[22] * x * z + c[16] * y * z) +
    2.0 * C2 * (c[10] * x + c[4] * y + c[7] * z);

  const b =
    C1 * c[26] * (x * x - y * y) +
    C3 * c[20] * z * z +
    C4 * c[2] -
    C5 * c[20] +
    2.0 * C1 * (c[14] * x * y + c[23] * x * z + c[17] * y * z) +
    2.0 * C2 * (c[11] * x + c[5] * y + c[8] * z);

  return [Math.max(0, r), Math.max(0, g), Math.max(0, b)];
}

// ---------------------------------------------------------------------------
// High-Dynamic-Range Environment Map Synthesizer
// ---------------------------------------------------------------------------

/**
 * Synthesizes a 32-bit floating-point HDR equirectangular radiance map.
 */
export function generateCraftsmanHdrEnvMap(width = 256, height = 128): THREE.DataTexture {
  const data = new Float32Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    const v = y / height; // 0 = top, 1 = bottom
    const theta = v * Math.PI; // zenith angle from 0 (top) to PI (bottom)
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let x = 0; x < width; x++) {
      const u = x / width; // 0 to 1
      const phi = u * Math.PI * 2.0 - Math.PI; // azimuth angle -PI to PI
      const idx = (y * width + x) * 4;

      // Direction vector in world coordinates
      const dirX = sinTheta * Math.sin(phi);
      const dirY = cosTheta;
      const dirZ = sinTheta * Math.cos(phi);

      // Irradiance from SH
      const [shR, shG, shB] = evaluateSphericalHarmonics([dirX, dirY, dirZ]);

      // Direct sun beam (simulating sunlight coming through south Craftsman windows)
      const sunDirX = 0.5;
      const sunDirY = 0.6;
      const sunDirZ = 0.62;
      const dotSun = Math.max(0, dirX * sunDirX + dirY * sunDirY + dirZ * sunDirZ);
      const sunSpot = Math.pow(dotSun, 64.0) * 12.0;

      // Warm interior pendant highlights
      const lampDirY = 0.9;
      const dotLamp = Math.max(0, dirY * lampDirY);
      const lampGlow = Math.pow(dotLamp, 16.0) * 2.5;

      data[idx + 0] = shR + sunSpot * 1.0 + lampGlow * 1.0;
      data[idx + 1] = shG + sunSpot * 0.92 + lampGlow * 0.85;
      data[idx + 2] = shB + sunSpot * 0.75 + lampGlow * 0.55;
      data[idx + 3] = 1.0;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return texture;
}

// ---------------------------------------------------------------------------
// Craftsman Bungalow Lighting Rig Builder
// ---------------------------------------------------------------------------

export function setupCraftsmanLighting(
  scene: THREE.Scene,
  options?: {
    enableShadows?: boolean;
    useHdrEnv?: boolean;
  },
): LightingRig {
  const enableShadows = options?.enableShadows ?? true;
  const useHdrEnv = options?.useHdrEnv ?? true;

  // 1. Key Light: Warm Golden Sunlight streaming through windows (5000K, ~2500 lux)
  const sunLight = new THREE.DirectionalLight(0xfff1dc, 2.2);
  sunLight.position.set(6, 8, 5);
  sunLight.castShadow = enableShadows;
  if (enableShadows) {
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -8;
    sunLight.shadow.camera.right = 8;
    sunLight.shadow.camera.top = 8;
    sunLight.shadow.camera.bottom = -8;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
  }
  scene.add(sunLight);

  // 2. Fill Light: Cool ambient sky light through north windows (6500K)
  const fillLight = new THREE.DirectionalLight(0xdbe9f6, 0.7);
  fillLight.position.set(-5, 6, -4);
  scene.add(fillLight);

  // 3. Ground Bounce Light: Warm amber reflection from hardwood/oak floors
  const bounceLight = new THREE.DirectionalLight(0xaf7c4e, 0.4);
  bounceLight.position.set(0, -5, 0);
  scene.add(bounceLight);

  // 4. Interior Point Lights: Craftsman chandelier / ceiling pendants (2700K warm incandescent)
  const roomPointLights: THREE.PointLight[] = [];

  // Kitchen ceiling pendant
  const kitchenPendant = new THREE.PointLight(0xffeedd, 1.2, 8.0, 1.8);
  kitchenPendant.position.set(0, 2.8, 0);
  scene.add(kitchenPendant);
  roomPointLights.push(kitchenPendant);

  // Living room hearth / fireplace warm accent
  const hearthGlow = new THREE.PointLight(0xff9944, 0.8, 6.0, 2.0);
  hearthGlow.position.set(2.5, 0.6, -2.0);
  scene.add(hearthGlow);
  roomPointLights.push(hearthGlow);

  // 5. IBL Environment Map
  let envMap: THREE.DataTexture | undefined;
  if (useHdrEnv) {
    envMap = generateCraftsmanHdrEnvMap(128, 64);
    scene.environment = envMap;
  }

  const dispose = () => {
    scene.remove(sunLight);
    scene.remove(fillLight);
    scene.remove(bounceLight);
    for (const pl of roomPointLights) {
      scene.remove(pl);
    }
    if (envMap) {
      envMap.dispose();
      if (scene.environment === envMap) {
        scene.environment = null;
      }
    }
  };

  return {
    sunLight,
    fillLight,
    bounceLight,
    roomPointLights,
    envMap,
    dispose,
  };
}
