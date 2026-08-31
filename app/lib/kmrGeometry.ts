// KUKA KMR (KUKA Mobile Robotics) iiwa base geometry + mecanum wheel geometry.
// Parameterized procedural Three.js assets (no GLTF downloads).
//
// SOTA / public-spec sources:
// - KUKA Roboter GmbH, "KMR iiwa" official technical-data sheet, revision
//   904d956018284109b9eee3bd8b350d20. It publishes the WHOLE-VEHICLE
//   envelope, mass, and payload. It does not publish every inner chassis,
//   wheel, or wheelbase dimension used by this procedural approximation.
// - For the mecanum wheel pattern (4 diagonal rollers per wheel), see
//   Killpack, "A Brief Overview of the Omnidirectional WMR (Mecanum
//   Wheel)" (Carnegie Mellon University, 2012). The IK formulas in the
//   companion mecanumKinematics.ts are the textbook inverse.

import * as THREE from "three";

export interface KmrGeometryConfig {
  // Base footprint (the rectangular chassis).
  baseLengthMeters: number;
  baseWidthMeters: number;
  // Chassis height (floor of chassis to top of base sidewall).
  baseHeightMeters: number;
  // Mecanum wheel diameter (all 4 wheels are the same).
  wheelDiameterMeters: number;
  // Wheelbase: distance between left and right wheel centers (x axis).
  wheelbaseXMeters: number;
  // Wheelbase: distance between front and rear wheel centers (y axis).
  wheelbaseYMeters: number;
  // Mounting plate height (z of the top surface where the arm base bolts).
  mountingPlateHeightMeters: number;
  // Mounting plate x offset from the KMR center.
  mountingPlateOffsetXMeters: number;
}

export const KUKA_KMR_IIWA_OFFICIAL_WHOLE_VEHICLE = {
  lengthMeters: 1.19,
  widthMeters: 0.72,
  heightMeters: 0.7,
  massKg: 375,
  maximumPayloadKg: 175,
  sourceUrl:
    "https://www.kuka.com/-/media/kuka-downloads/files/87f2706ce77c4318877932fb36f6002d/kuka_kmriiwa_en.pdf?hash=26D80DD98AAA6393BEBD35ED82F7F0C2&rev=904d956018284109b9eee3bd8b350d20",
  sourceRevision: "904d956018284109b9eee3bd8b350d20",
} as const;

/**
 * Procedural inner-chassis assumptions used to draw and integrate the demo.
 * These are not represented as exact KUKA public dimensions; the official
 * whole-vehicle envelope above is the authoritative published boundary.
 */
export const KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS: KmrGeometryConfig = {
  baseLengthMeters: 0.800,
  baseWidthMeters: 0.600,
  baseHeightMeters: 0.380,
  wheelDiameterMeters: 0.150,
  wheelbaseXMeters: 0.600,
  wheelbaseYMeters: 0.450,
  mountingPlateHeightMeters: 0.380,
  mountingPlateOffsetXMeters: 0.0,
};

/** @deprecated Use the explicitly named procedural assumptions constant. */
export const KUKA_KMR_IIWA_PUBLIC_SPEC =
  KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS;

export interface KmrDimensions {
  wheelRadiusMeters: number;
  halfWheelbaseX: number;
  halfWheelbaseY: number;
}

export function computeDimensions(config: KmrGeometryConfig): KmrDimensions {
  return {
    wheelRadiusMeters: config.wheelDiameterMeters / 2.0,
    halfWheelbaseX: config.wheelbaseXMeters / 2.0,
    halfWheelbaseY: config.wheelbaseYMeters / 2.0,
  };
}

export interface KmrMountingPlatePose {
  xMeters: number;
  yMeters: number;
  zMeters: number;
}

export function computeMountingPlatePose(
  config: KmrGeometryConfig,
  kmrCenterXMeters = 0,
  kmrCenterYMeters = 0,
  kmrCenterZMeters = 0,
): KmrMountingPlatePose {
  return {
    xMeters: kmrCenterXMeters + config.mountingPlateOffsetXMeters,
    yMeters: kmrCenterYMeters,
    zMeters: kmrCenterZMeters + config.mountingPlateHeightMeters,
  };
}

export interface KmrMaterialSet {
  chassisBody: THREE.Material;
  chassisTrim: THREE.Material;
  wheelHub: THREE.Material;
  wheelRoller: THREE.Material;
  mountingPlate: THREE.Material;
  lidarHousing: THREE.Material;
  lidarLens: THREE.Material;
}

export function defaultKmrMaterialSet(): KmrMaterialSet {
  return {
    // KUKA orange (Pantone 165 C) for the chassis body.
    chassisBody: new THREE.MeshStandardMaterial({
      color: "#e87722",
      metalness: 0.4,
      roughness: 0.55,
      name: "kmr_chassis_body",
    }),
    // Safety yellow trim (KUKA uses RAL 1023 for moving-part warnings).
    chassisTrim: new THREE.MeshStandardMaterial({
      color: "#ffd400",
      metalness: 0.1,
      roughness: 0.7,
      name: "kmr_chassis_trim",
    }),
    // Aluminum hub.
    wheelHub: new THREE.MeshStandardMaterial({
      color: "#cfcfcf",
      metalness: 0.85,
      roughness: 0.25,
      name: "kmr_wheel_hub",
    }),
    // Rubber roller surface (per Killpack 2012, rubber is the standard
    // for mecanum rollers to maximize lateral friction).
    wheelRoller: new THREE.MeshStandardMaterial({
      color: "#3a3a3a",
      metalness: 0.0,
      roughness: 0.9,
      name: "kmr_wheel_roller",
    }),
    // Mounting plate (clear anodized aluminum).
    mountingPlate: new THREE.MeshStandardMaterial({
      color: "#b8b8b8",
      metalness: 0.7,
      roughness: 0.35,
      name: "kmr_mounting_plate",
    }),
    // LiDAR housing.
    lidarHousing: new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      metalness: 0.5,
      roughness: 0.4,
      name: "kmr_lidar_housing",
    }),
    // LiDAR lens.
    lidarLens: new THREE.MeshStandardMaterial({
      color: "#1a3050",
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.6,
      name: "kmr_lidar_lens",
    }),
  };
}

// Procedural mecanum wheel geometry. A mecanum wheel has a hub
// (cylinder) with 8 small rubber rollers arranged in a diagonal
// pattern around the rim. The diagonal angle is typically 45 degrees.
// See Killpack 2012 for the standard pattern.
function buildMecanumWheel(
  config: KmrGeometryConfig,
  positionX: number,
  positionY: number,
  materials: KmrMaterialSet,
  name = "kmr_wheel",
): THREE.Group {
  const group = new THREE.Group();
  group.name = name;
  const wheelRadius = config.wheelDiameterMeters / 2.0;
  const wheelWidth = wheelRadius * 0.6;

  // The wheel hub (main cylinder).
  const hubGeo = new THREE.CylinderGeometry(
    wheelRadius,
    wheelRadius,
    wheelWidth,
    24,
    1,
    false,
  );
  // Cylinder default is along Y axis; rotate to X axis (wheel rolls
  // forward when rotating around the X axis).
  hubGeo.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, materials.wheelHub);
  hub.castShadow = true;
  hub.receiveShadow = true;
  hub.position.set(positionX, 0, positionY);
  group.add(hub);

  // The 8 diagonal rollers. Each is a small cylinder lying on the
  // wheel rim, oriented at 45 degrees to the wheel's rolling direction.
  const numRollers = 8;
  const rollerRadius = wheelRadius * 0.18;
  const rollerLength = wheelWidth * 0.85;
  for (let i = 0; i < numRollers; i += 1) {
    const angle = (i / numRollers) * Math.PI * 2.0;
    const rollerGeo = new THREE.CylinderGeometry(
      rollerRadius,
      rollerRadius,
      rollerLength,
      8,
    );
    // Orient the roller tangent to the wheel circumference, then rotate
    // 45 degrees around the wheel's spin axis to get the diagonal
    // pattern (mecanum signature).
    rollerGeo.rotateX(Math.PI / 2);
    rollerGeo.rotateZ(Math.PI / 2);
    rollerGeo.rotateY(Math.PI / 4);
    const roller = new THREE.Mesh(rollerGeo, materials.wheelRoller);
    roller.position.set(
      positionX + 0,
      Math.cos(angle) * (wheelRadius - rollerRadius),
      positionY + Math.sin(angle) * (wheelRadius - rollerRadius),
    );
    group.add(roller);
  }

  // The 4 side caps (decorative).
  for (const sign of [-1, 1]) {
    const capGeo = new THREE.CircleGeometry(wheelRadius * 0.9, 24);
    const cap = new THREE.Mesh(capGeo, materials.wheelHub);
    cap.position.set(
      positionX + sign * (wheelWidth / 2 + 0.001),
      0,
      positionY,
    );
    cap.rotation.y = sign > 0 ? 0 : Math.PI;
    group.add(cap);
  }

  return group;
}

export function buildKmrBaseMesh(
  config: KmrGeometryConfig = KMR_IIWA_PROCEDURAL_CHASSIS_ASSUMPTIONS,
  materials: KmrMaterialSet = defaultKmrMaterialSet(),
): THREE.Group {
  const group = new THREE.Group();
  group.name = "kmr_base_iiwa";

  // Chassis body.
  const halfH = config.baseHeightMeters / 2.0;
  const chassisGeo = new THREE.BoxGeometry(
    config.baseLengthMeters,
    config.baseHeightMeters,
    config.baseWidthMeters,
  );
  const chassis = new THREE.Mesh(chassisGeo, materials.chassisBody);
  chassis.position.set(0, halfH, 0);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  group.add(chassis);

  // Safety-yellow trim band.
  const trimGeo = new THREE.BoxGeometry(
    config.baseLengthMeters * 1.001,
    0.04,
    config.baseWidthMeters * 1.001,
  );
  const trim = new THREE.Mesh(trimGeo, materials.chassisTrim);
  trim.position.set(0, config.baseHeightMeters * 0.45, 0);
  group.add(trim);

  // Mounting plate.
  const plateGeo = new THREE.BoxGeometry(
    config.baseLengthMeters * 0.92,
    0.015,
    config.baseWidthMeters * 0.92,
  );
  const plate = new THREE.Mesh(plateGeo, materials.mountingPlate);
  plate.position.set(
    config.mountingPlateOffsetXMeters,
    config.mountingPlateHeightMeters + 0.0075,
    0,
  );
  plate.castShadow = true;
  plate.receiveShadow = true;
  group.add(plate);

  // 4 mecanum wheels at the corners.
  const a = config.wheelbaseXMeters / 2.0;
  const b = config.wheelbaseYMeters / 2.0;
  for (const [signX, signY, cornerName] of [
    [-1, 1, "kmr_wheel_FL"],
    [1, 1, "kmr_wheel_FR"],
    [-1, -1, "kmr_wheel_RL"],
    [1, -1, "kmr_wheel_RR"],
  ] as const) {
    const wheel = buildMecanumWheel(
      config,
      signX * a,
      signY * b,
      materials,
      cornerName,
    );
    group.add(wheel);
  }

  // LiDAR scanner housing.
  const lidarHousingGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.07, 16);
  const lidarHousingMesh = new THREE.Mesh(
    lidarHousingGeo,
    materials.lidarHousing,
  );
  lidarHousingMesh.position.set(
    config.mountingPlateOffsetXMeters + config.baseLengthMeters * 0.30,
    config.mountingPlateHeightMeters + 0.04,
    0,
  );
  group.add(lidarHousingMesh);

  // LiDAR lens cap.
  const lidarLensGeo = new THREE.CircleGeometry(0.028, 16);
  const lidarLensMesh = new THREE.Mesh(lidarLensGeo, materials.lidarLens);
  lidarLensMesh.position.set(
    config.mountingPlateOffsetXMeters + config.baseLengthMeters * 0.30 + 0.0351,
    config.mountingPlateHeightMeters + 0.04,
    0,
  );
  group.add(lidarLensMesh);

  return group;
}
