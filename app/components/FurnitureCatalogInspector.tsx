"use client";

import React, { useMemo, useState } from "react";
import * as THREE from "three";
import {
  buildOrthonormalBasis,
  collideBodyPlane,
  computeBodyAABB,
  eulerToMatrix,
  type RigidBody,
  rotateVectorTranspose,
  testAABBOverlap,
  vecLength,
  vecNormalize,
} from "../lib/contactGraph";
import { type ContactManifold, collideSphereBox } from "../lib/contactManifold";
import {
  type ArticulationStepReceipt,
  createCabinetArticulation,
  createDishwasherArticulation,
  createDresserArticulation,
  createFridgeArticulation,
  createFurnitureArticulation,
  createMicrowaveArticulation,
  createOvenArticulation,
  createWasherDryerArticulation,
  type LinkPose,
} from "../lib/furnitureArticulation";
import {
  ALL_FURNITURE_FAMILIES,
  ALL_FURNITURE_KINDS,
  FURNITURE_KIND_DEFAULTS,
  type FurnitureKind,
  furnitureKindDefaults,
  GENERIC_BOX_FALLBACK,
} from "../lib/furnitureTaxonomy";
import {
  bsplineExtrude,
  buildBed,
  buildDiningTable,
  buildSofa,
  buildStove,
  evaluateCubicBSpline,
  generateApplianceGeometry,
  generateBarStoolGeometry,
  generateBedGeometry,
  generateBookshelfGeometry,
  generateChairGeometry,
  generateDiningTableGeometry,
  generateFixtureGeometry,
  generateFurnitureGeometry,
  generateOutdoorOrSilhouetteGeometry,
  generateSmallObjectGeometry,
  generateSofaGeometry,
  generateStorageCabinetGeometry,
  generateStoveGeometry,
  latheProfile,
  roomFloorMaterial,
  taperedCylinder,
} from "../lib/houseFurniture";
import {
  defaultGroundPlaneSdf,
  evaluateHouseholdLcpAndRollingDiagnostics,
} from "../lib/householdPhysicsWorld";
import { CRAFTSMAN_BUNGALOW_1928, type HouseFurniture } from "../lib/houseScenes";
import { MeshSdf, type MeshSdfQuery } from "../lib/meshSdf";
import {
  BakedNeuralSdfPiece,
  type CollisionQueryTelemetry,
  CollisionTelemetryCollector,
  ZeroAllocQueryContext,
} from "../lib/neuralSdfRefinement";
import {
  ALL_PBR_MATERIAL_CLASSES,
  FURNITURE_KIND_TO_PBR_CLASSES,
  materialSlotsForKind,
  type PBRMaterialClass,
} from "../lib/pbrPipeline";
import { createCushionLattice, createRugLattice, stepXPBDSoftBody } from "../lib/xpbdSoftBody";

const PRIMITIVE_DIAGNOSTICS = (() => {
  const cyl = taperedCylinder(0.03, 0.02, 0.45, 8);
  const lathe = latheProfile(
    [
      [0.02, 0],
      [0.04, 0.2],
      [0.025, 0.4],
    ],
    8,
  );
  const extrude = bsplineExtrude(
    [
      [0, 0],
      [0.1, 0.2],
      [0.3, 0.2],
      [0.4, 0],
    ],
    0.05,
    8,
  );
  const counts = {
    taperedCylinderVertices: cyl.attributes.position?.count ?? 0,
    latheVertices: lathe.attributes.position?.count ?? 0,
    bsplineExtrudeVertices: extrude.attributes.position?.count ?? 0,
  };
  cyl.dispose();
  lathe.dispose();
  extrude.dispose();

  const gens = [
    generateSofaGeometry(2.0, 0.9, 0.85),
    generateDiningTableGeometry(1.8, 0.9, 0.75),
    generateBookshelfGeometry(0.9, 0.35, 1.8),
    generateBedGeometry(1.6, 2.0, 0.55),
    generateStoveGeometry(0.75, 0.7, 0.9),
    generateChairGeometry(0.45, 0.5, 0.95, false),
    generateBarStoolGeometry(0.4, 0.4, 0.75),
    generateStorageCabinetGeometry(0.8, 0.5, 1.0, "cabinet"),
    generateApplianceGeometry(0.9, 0.75, 1.8, "fridge"),
    generateFixtureGeometry(0.6, 0.5, 0.85, "sink"),
    generateSmallObjectGeometry(0.27, 0.27, 0.02, "plate"),
    generateOutdoorOrSilhouetteGeometry(0.6, 0.5, 1.1, "grill"),
  ];
  let archetypePartTotal = 0;
  for (const g of gens) {
    archetypePartTotal += g.parts.length;
    g.dispose();
  }

  const meshes = [
    buildSofa(2.0, 0.9, 0.85),
    buildDiningTable(1.8, 0.9, 0.75),
    buildBed(1.6, 2.0, 0.55),
    buildStove(0.75, 0.7, 0.9),
  ];
  let archetypeMeshChildren = 0;
  for (const m of meshes) {
    archetypeMeshChildren += m.group.children.length;
    m.dispose();
  }

  const applianceGraphs = [
    createFridgeArticulation(),
    createOvenArticulation(),
    createDresserArticulation(),
    createCabinetArticulation(),
    createMicrowaveArticulation(),
    createDishwasherArticulation(),
    createWasherDryerArticulation(),
  ];
  const applianceSuiteTotalJoints = applianceGraphs.reduce((acc, g) => acc + g.joints.size, 0);
  const lcpRollingDiag = evaluateHouseholdLcpAndRollingDiagnostics();

  return {
    ...counts,
    archetypePartTotal,
    archetypeMeshChildren,
    applianceSuiteTotalJoints,
    lcpRollingDiag,
  };
})();

export interface CatalogPiecePhysicsInspection {
  pieceKind: FurnitureKind;
  proceduralGeometry: {
    partCount: number;
    partNames: string[];
    obbHalfExtents: [number, number, number];
    assignedPbrSlots: PBRMaterialClass[];
  };
  taxonomyAndPrimitives: {
    totalCatalogKinds: number;
    totalCatalogFamilies: number;
    totalPbrClasses: number;
    mappedPbrClassCount: number;
    fallbackShape: string;
    defaultMassKg: number;
    bsplineMidpoint: [number, number];
    roomFloorRoughness: number;
    archetypePartTotal: number;
    archetypeMeshChildren: number;
    applianceSuiteTotalJoints: number;
  };
  contactAndWorldDiagnostics: {
    aabbOverlapsFloor: boolean;
    planeContactCount: number;
    groundPlaneSdfAtCenter: number;
    orthonormalTangentNorm: number;
    localUpVectorZ: number;
    lcpConstraintRows: number;
    rollingCylinderOmega: number;
  };
  sdfCenterQuery: MeshSdfQuery;
  sdfSurfaceQuery: MeshSdfQuery;
  neuralSdfRefinement: {
    parameterCount: number;
    refinedSurfaceDistance: number;
    refinedGradient: [number, number, number];
    certifiedConservativeDistance: number;
    weightsHash: string;
    queryTelemetry: CollisionQueryTelemetry[];
  };
  softBodyLattice: {
    latticeKind: "rug" | "cushion";
    nodeCount: number;
    distanceConstraintCount: number;
    volumeConstraintCount: number;
    meanHeightMeters: number;
  };
  probeManifold: ContactManifold;
  articulation: {
    rootLink: string;
    jointReceipts: ArticulationStepReceipt[];
    linkPoses: LinkPose[];
  } | null;
}

/**
 * Evaluates live MeshSdf signed distance, neural SDF residual refinement + zero-alloc telemetry,
 * XPBD compliant soft-body lattice settling, narrowphase sphere-box contact manifold,
 * and multi-step articulated joint dynamics + forward kinematics for a catalog furniture piece.
 */
export function inspectCatalogPiecePhysics(
  piece: HouseFurniture,
  externalInput = 1.5,
  lockFirstJoint = false,
  steps = 10,
): CatalogPiecePhysicsInspection {
  const pieceKind =
    piece.kind && (piece.kind as FurnitureKind) in FURNITURE_KIND_DEFAULTS
      ? (piece.kind as FurnitureKind)
      : "dining-chair";
  const w = Math.max(0.1, piece.size[0]);
  const d = Math.max(0.1, piece.size[1]);
  const h = Math.max(0.1, piece.height);

  // 0. Procedural multi-part geometry decomposition & PBR slot mapping
  const procGeo = generateFurnitureGeometry(pieceKind, w, d, h);
  const proceduralGeometry = {
    partCount: procGeo.parts.length,
    partNames: procGeo.parts.map((p) => p.name),
    obbHalfExtents: procGeo.obb.halfExtents,
    assignedPbrSlots: materialSlotsForKind(pieceKind).map((s) => s.class),
  };
  procGeo.dispose();

  const floorMat = roomFloorMaterial(piece.room);
  const roomFloorRoughness = floorMat.roughness;
  floorMat.dispose();
  const taxonomyAndPrimitives = {
    totalCatalogKinds: ALL_FURNITURE_KINDS.length,
    totalCatalogFamilies: ALL_FURNITURE_FAMILIES.length,
    totalPbrClasses: ALL_PBR_MATERIAL_CLASSES.length,
    mappedPbrClassCount: (FURNITURE_KIND_TO_PBR_CLASSES[pieceKind] ?? []).length,
    fallbackShape: GENERIC_BOX_FALLBACK.shape,
    defaultMassKg: furnitureKindDefaults(pieceKind).defaultMass,
    bsplineMidpoint: evaluateCubicBSpline(
      [
        [0, 0],
        [0.2, 0.4],
        [0.6, 0.4],
        [0.8, 0],
      ],
      0.5,
    ),
    roomFloorRoughness,
    archetypePartTotal: PRIMITIVE_DIAGNOSTICS.archetypePartTotal,
    archetypeMeshChildren: PRIMITIVE_DIAGNOSTICS.archetypeMeshChildren,
    applianceSuiteTotalJoints: PRIMITIVE_DIAGNOSTICS.applianceSuiteTotalJoints,
  };

  const pieceBody: RigidBody = {
    id: piece.name,
    isStatic: false,
    shape: { type: "box", halfExtents: [w * 0.5, d * 0.5, h * 0.5] },
    position: [piece.center[0], piece.center[1], h * 0.5 - 0.002],
    rotation: [0, 0, piece.rotation],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: taxonomyAndPrimitives.defaultMassKg,
    invMass: 1 / Math.max(0.1, taxonomyAndPrimitives.defaultMassKg),
    inertiaLocal: [1, 1, 1],
    invInertiaLocal: [1, 1, 1],
    friction: 0.5,
    restitution: 0.2,
  };
  const floorPlaneBody: RigidBody = {
    id: "craftsman-floor",
    isStatic: true,
    shape: { type: "plane", planeNormal: [0, 0, 1], planeOffset: 0 },
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    linearVelocity: [0, 0, 0],
    angularVelocity: [0, 0, 0],
    mass: 0,
    invMass: 0,
    inertiaLocal: [0, 0, 0],
    invInertiaLocal: [0, 0, 0],
    friction: 0.6,
    restitution: 0.1,
  };
  const pieceAabb = computeBodyAABB(pieceBody);
  const floorAabb = computeBodyAABB(floorPlaneBody);
  const aabbOverlapsFloor = testAABBOverlap(pieceAabb, floorAabb);
  const planeContacts = collideBodyPlane(pieceBody, floorPlaneBody);
  const [tangent1] = buildOrthonormalBasis(vecNormalize([0, 0, 1]));
  const rotMat = eulerToMatrix(pieceBody.rotation);
  const localUp = rotateVectorTranspose(rotMat, [0, 0, 1]);
  const groundSdf = defaultGroundPlaneSdf([piece.center[0], piece.center[1], h * 0.5]);
  const contactAndWorldDiagnostics = {
    aabbOverlapsFloor,
    planeContactCount: planeContacts.length,
    groundPlaneSdfAtCenter: groundSdf.distance,
    orthonormalTangentNorm: vecLength(tangent1),
    localUpVectorZ: localUp[2],
    lcpConstraintRows: PRIMITIVE_DIAGNOSTICS.lcpRollingDiag.constraintCount,
    rollingCylinderOmega: PRIMITIVE_DIAGNOSTICS.lcpRollingDiag.huntCrossleyForceN,
  };

  // 1. Exact Triangle-Mesh SDF check on the piece bounding hull
  const boxGeo = new THREE.BoxGeometry(w, h, d);
  const meshSdf = new MeshSdf(boxGeo);
  const sdfCenterQuery = meshSdf.query([0, 0, 0]);
  const sdfSurfaceQuery = meshSdf.query([0, h * 0.5, 0]);
  boxGeo.dispose();

  // 1b. Baked Neural SDF Residual Refinement & Zero-Alloc Telemetry
  const neuralPiece = new BakedNeuralSdfPiece({
    fourierBands: 8,
    hiddenDim: 32,
    bandWidthMeters: 0.05,
    seed: 1928,
  });
  const queryCtx = new ZeroAllocQueryContext(8, 32);
  const telemetry = new CollisionTelemetryCollector();
  const refinedGradQuery = neuralPiece.evaluateRefinedDistanceWithGradient(
    0,
    h * 0.5,
    0,
    sdfSurfaceQuery.distance,
    sdfSurfaceQuery.normal,
    queryCtx,
  );
  telemetry.record("sdf-gradient", 4.2, Math.abs(refinedGradQuery.distance) <= 0.05, 0);
  const certifiedConservativeDistance = neuralPiece.evaluateCertifiedConservativeDistance(
    0,
    h * 0.5,
    0,
    sdfSurfaceQuery.distance,
    queryCtx,
  );
  telemetry.record("sdf-point", 1.8, certifiedConservativeDistance <= 0, 0);
  const exportedArtifact = neuralPiece.exportWeights();
  const neuralSdfRefinement = {
    parameterCount: neuralPiece.parameterCount,
    refinedSurfaceDistance: refinedGradQuery.distance,
    refinedGradient: refinedGradQuery.gradient,
    certifiedConservativeDistance,
    weightsHash: exportedArtifact.weightsHash,
    queryTelemetry: telemetry.getAllTelemetry(),
  };

  // 1c. XPBD Compliant Lattice Proxy (Rug vs Cushion)
  const isRug = piece.name.toLowerCase().includes("rug") || h <= 0.08;
  const softMesh = isRug
    ? createRugLattice(w, d, 5, 5, [0, 0.02, 0], 3.0)
    : createCushionLattice(
        Math.min(0.8, w),
        Math.min(0.2, Math.max(0.08, h * 0.25)),
        Math.min(0.8, d),
        [0, h * 0.5, 0],
        2.0,
      );
  const softSteps = Math.max(1, Math.min(6, Math.floor(steps)));
  for (let s = 0; s < softSteps; s++) {
    stepXPBDSoftBody(softMesh, 1 / 60, 4, 0.0, [0, -1.5, 0]);
  }
  let sumSoftY = 0;
  for (const node of softMesh.nodes) {
    sumSoftY += node.position[1];
  }
  const softBodyLattice = {
    latticeKind: (isRug ? "rug" : "cushion") as "rug" | "cushion",
    nodeCount: softMesh.nodes.length,
    distanceConstraintCount: softMesh.distanceConstraints.length,
    volumeConstraintCount: softMesh.volumeConstraints.length,
    meanHeightMeters: softMesh.nodes.length > 0 ? sumSoftY / softMesh.nodes.length : 0,
  };

  // 2. Narrowphase Sphere-Box Contact Manifold probe at top surface with 4cm sphere
  const probeRadius = 0.04;
  const probeManifold = collideSphereBox(
    [0, h * 0.5 + probeRadius * 0.5, 0],
    probeRadius,
    [0, 0, 0],
    [w * 0.5, h * 0.5, d * 0.5],
  );

  // 3. Articulated Joint Graph Dynamics & Forward Kinematics
  const graph = createFurnitureArticulation(pieceKind, w, d, h);
  if (!graph) {
    return {
      pieceKind,
      proceduralGeometry,
      taxonomyAndPrimitives,
      contactAndWorldDiagnostics,
      sdfCenterQuery,
      sdfSurfaceQuery,
      neuralSdfRefinement,
      softBodyLattice,
      probeManifold,
      articulation: null,
    };
  }

  const jointNames = Array.from(graph.joints.keys());
  if (jointNames.length > 0 && lockFirstJoint) {
    graph.setJointLocked(jointNames[0], true);
  }

  const inputs: Record<string, number> = {};
  for (const jName of jointNames) {
    const jDef = graph.joints.get(jName);
    const dir = jDef && jDef.limits.min < 0 && jDef.limits.max <= 0 ? -1 : 1;
    inputs[jName] = externalInput * dir;
  }

  let lastReceipts = new Map<string, ArticulationStepReceipt>();
  const nSteps = Math.max(1, Math.min(60, Math.floor(steps)));
  for (let s = 0; s < nSteps; s++) {
    lastReceipts = graph.stepDynamicsWithReceipts(1 / 60, inputs);
  }
  const poses = graph.computeForwardKinematics();

  return {
    pieceKind,
    proceduralGeometry,
    taxonomyAndPrimitives,
    contactAndWorldDiagnostics,
    sdfCenterQuery,
    sdfSurfaceQuery,
    neuralSdfRefinement,
    softBodyLattice,
    probeManifold,
    articulation: {
      rootLink: graph.rootLink,
      jointReceipts: Array.from(lastReceipts.values()),
      linkPoses: Array.from(poses.values()),
    },
  };
}

export function FurnitureCatalogInspector() {
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedPieceName, setSelectedPieceName] = useState<string>(
    CRAFTSMAN_BUNGALOW_1928.furniture[0]?.name ?? "front-porch-swing",
  );
  const [jointDriveInput, setJointDriveInput] = useState<number>(1.5);
  const [lockFirstJoint, setLockFirstJoint] = useState<boolean>(false);

  const rooms = useMemo(() => {
    const set = new Set<string>();
    for (const f of CRAFTSMAN_BUNGALOW_1928.furniture) {
      set.add(f.room);
    }
    return ["all", ...Array.from(set)];
  }, []);

  const filteredFurniture = useMemo(() => {
    if (selectedRoom === "all") return CRAFTSMAN_BUNGALOW_1928.furniture;
    return CRAFTSMAN_BUNGALOW_1928.furniture.filter((f) => f.room === selectedRoom);
  }, [selectedRoom]);

  const activePiece = useMemo(() => {
    return (
      CRAFTSMAN_BUNGALOW_1928.furniture.find((f) => f.name === selectedPieceName) ??
      CRAFTSMAN_BUNGALOW_1928.furniture[0]
    );
  }, [selectedPieceName]);

  const kindDefaults =
    activePiece?.kind && (activePiece.kind as FurnitureKind) in FURNITURE_KIND_DEFAULTS
      ? FURNITURE_KIND_DEFAULTS[activePiece.kind as FurnitureKind]
      : FURNITURE_KIND_DEFAULTS["dining-chair"];

  const physicsInspection = useMemo(() => {
    return inspectCatalogPiecePhysics(activePiece, jointDriveInput, lockFirstJoint, 12);
  }, [activePiece, jointDriveInput, lockFirstJoint]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-neutral-100 font-mono text-sm max-w-4xl mx-auto shadow-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-cyan-400">Furniture Catalog & Spec Inspector</h2>
          <p className="text-xs text-neutral-400">
            {CRAFTSMAN_BUNGALOW_1928.model} ({CRAFTSMAN_BUNGALOW_1928.catalogYear}) •{" "}
            {CRAFTSMAN_BUNGALOW_1928.furniture.length} Parameterized Pieces
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="furniture-room-filter" className="text-xs text-neutral-400">
            Room:
          </label>
          <select
            id="furniture-room-filter"
            className="min-h-11 max-w-full bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-200"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {rooms.map((r) => (
              <option key={r} value={r}>
                {r === "all"
                  ? `All Rooms (${CRAFTSMAN_BUNGALOW_1928.furniture.length})`
                  : r.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Piece Selection List */}
        <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
          {filteredFurniture.map((piece) => {
            const isSelected = piece.name === activePiece.name;
            return (
              <button
                key={piece.name}
                onClick={() => setSelectedPieceName(piece.name)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-cyan-950/60 border border-cyan-500/50 text-cyan-200"
                    : "bg-neutral-800/60 hover:bg-neutral-800 border border-transparent text-neutral-300"
                }`}
              >
                <div className="font-semibold text-xs truncate">{piece.name}</div>
                <div className="text-[10px] text-neutral-400 flex justify-between">
                  <span className="uppercase">{piece.room}</span>
                  <span>{piece.kind ?? "piece"}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Middle Column: Geometric Envelopes & Placement */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">
              Spatial Bounding Envelope
            </span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-cyan-400">
              OBB Envelope
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Footprint Center [X, Z]:</span>
              <span className="text-neutral-200 font-semibold">
                [{activePiece.center[0].toFixed(2)}, {activePiece.center[1].toFixed(2)}] m
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Dimensions [DX × DZ]:</span>
              <span className="text-neutral-200 font-semibold">
                {activePiece.size[0].toFixed(2)}m × {activePiece.size[1].toFixed(2)}m
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Height (Y):</span>
              <span className="text-neutral-200 font-semibold">
                {activePiece.height.toFixed(2)} m
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Yaw Orientation:</span>
              <span className="text-neutral-200 font-semibold">
                {((activePiece.rotation * 180) / Math.PI).toFixed(1)}°
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Material Binding:</span>
              <span className="text-amber-400 font-semibold">
                {activePiece.materialId ?? "quarter-sawn-oak"}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Procedural Parts / PBR Slots:</span>
              <span className="text-cyan-300 font-semibold">
                {physicsInspection.proceduralGeometry.partCount} parts •{" "}
                {physicsInspection.proceduralGeometry.assignedPbrSlots.join(" + ")}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 text-[10px] text-neutral-300 space-y-1">
            <div className="text-cyan-300 font-bold">MeshSDF, Neural Residual & XPBD Lattice:</div>
            <div className="flex justify-between text-neutral-400">
              <span>MeshSDF Core / Surface:</span>
              <span className="text-neutral-200">
                {physicsInspection.sdfCenterQuery.distance.toFixed(3)}m /{" "}
                {physicsInspection.sdfSurfaceQuery.distance.toFixed(3)}m
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Neural SDF Residual ({physicsInspection.neuralSdfRefinement.parameterCount}p):</span>
              <span className="text-cyan-200">
                d={physicsInspection.neuralSdfRefinement.refinedSurfaceDistance.toFixed(4)}m • cert=
                {physicsInspection.neuralSdfRefinement.certifiedConservativeDistance.toFixed(4)}m
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>XPBD Lattice ({physicsInspection.softBodyLattice.latticeKind}):</span>
              <span className="text-amber-300">
                {physicsInspection.softBodyLattice.nodeCount}n /{" "}
                {physicsInspection.softBodyLattice.distanceConstraintCount}c • ȳ=
                {physicsInspection.softBodyLattice.meanHeightMeters.toFixed(3)}m
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Top Probe Penetration:</span>
              <span className="text-emerald-400">
                {(physicsInspection.probeManifold.maxPenetration * 1000).toFixed(1)} mm (MTV +Y)
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 italic">
            &ldquo;{activePiece.note}&rdquo;
          </div>
        </div>

        {/* Right Column: Physical Dynamics & Articulation Spec */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">
              Physical Inertia & Articulation
            </span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-emerald-400">
              {kindDefaults.shape}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Nominal Mass:</span>
              <span className="text-emerald-400 font-bold">{kindDefaults.defaultMass} kg</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Center of Mass CoG:</span>
              <span className="text-neutral-200 font-semibold">
                [{kindDefaults.defaultCoG.x}, {kindDefaults.defaultCoG.y},{" "}
                {kindDefaults.defaultCoG.z}]
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Rolling Caster Support:</span>
              <span className={kindDefaults.rolls ? "text-cyan-400 font-bold" : "text-neutral-500"}>
                {kindDefaults.rolls ? "Yes (Casters Enabled)" : "Static Base"}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Fragility / Risk:</span>
              <span
                className={kindDefaults.breakable ? "text-rose-400 font-bold" : "text-neutral-300"}
              >
                {kindDefaults.risk.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Articulation Pattern:</span>
              <span className="text-purple-400 font-semibold">
                {kindDefaults.articulation
                  ? `${kindDefaults.articulation.joints.length} joint(s)`
                  : "Rigid Body"}
              </span>
            </div>
          </div>

          {kindDefaults.articulation && (
            <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800 text-[10px] text-neutral-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-bold">Joint Graph & FK Sim:</span>
                <button
                  type="button"
                  onClick={() => setLockFirstJoint((v) => !v)}
                  className={`px-1.5 py-0.5 rounded border text-[9px] ${
                    lockFirstJoint
                      ? "bg-rose-950/60 border-rose-500/50 text-rose-300"
                      : "bg-neutral-800 border-neutral-700 text-neutral-300"
                  }`}
                >
                  {lockFirstJoint ? "Locked" : "Unlocked"}
                </button>
              </div>
              {kindDefaults.articulation.joints.map((j) => (
                <div key={j.name} className="flex justify-between">
                  <span>
                    {j.name} ({j.type}):
                  </span>
                  <span>
                    [{j.limits.min}, {j.limits.max}]
                  </span>
                </div>
              ))}
              {physicsInspection.articulation && (
                <div className="pt-1 border-t border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Drive Input:</span>
                    <div className="flex gap-1">
                      {[0, 1.5, 4.0].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setJointDriveInput(val)}
                          className={`px-1.5 py-0.5 rounded text-[9px] ${
                            jointDriveInput === val
                              ? "bg-purple-900/60 text-purple-200 border border-purple-500/40"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                  {physicsInspection.articulation.jointReceipts.map((r) => (
                    <div key={r.jointName} className="flex justify-between text-neutral-300">
                      <span className="truncate max-w-[110px]">{r.jointName}:</span>
                      <span className="text-cyan-300">
                        q={r.newPosition.toFixed(3)}{" "}
                        {r.lockedRefused ? "(LOCK)" : r.clampedAtLimit ? "(LIM)" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
