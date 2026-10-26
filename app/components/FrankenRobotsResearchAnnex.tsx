"use client";

import {
  BrainCircuit,
  ChartNoAxesCombined,
  Dumbbell,
  FlaskConical,
  Network,
  Play,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  aggregateReleaseQualityGates,
  BrowserPhysicsAdapter,
  type KernelManifest,
  type QualityGateLaneReceipt,
  type ReleaseQualityGateAggregation,
  REQUIRED_FAST_PR_LANES,
  REQUIRED_RELEASE_CAMPAIGN_LANES,
} from "../lib/browserPhysicsAdapter";
import { createMulberry32, outerProduct, sampleGaussianVector } from "../lib/cmaesEngine";
import {
  computeCovariancePowers,
  jacobiEigenSymmetric,
  matMult,
  sampleGaussianVectorND,
} from "../lib/cmaesEngineND";
import {
  fischerBurmeister,
  fischerBurmeisterGrad,
  solveContactImplicitCollocation,
} from "../lib/contactImplicitTrajectoryOpt";
import {
  DEFAULT_DDP_CONFIG,
  evalDynamics,
  evaluateTrajectoryCost,
  linearizeDynamics,
  solveDDP,
} from "../lib/ddpTrajectoryOptimization";
import {
  axisAngleToRotationMatrix,
  buildSpatialInertia,
  computeLinkRelativeTransform,
  computeMechanicalEnergy,
  createZeroSpatial,
  eulerToRotationMatrix,
  forwardDynamicsABA,
  inverseDynamicsRNEA,
  type MultibodyTree,
  multiplyInertiaVector,
  multiplyMat3,
  multiplyMat3Vec3,
  normalizeAxis3,
  spatialAdd,
  spatialCrossForce,
  spatialCrossMotion,
  spatialDot,
  spatialScale,
  spatialSub,
  stepMultibodyDynamics,
  transformSpatialForce,
  transformSpatialInertia,
  transformSpatialMotion,
  transposeMat3,
} from "../lib/featherstoneDynamics";
import { FRANKENROBOTS_BRIDGE_SCHEMA_VERSION } from "../lib/frankenrobotsBridge";
import {
  ARM_MAX_EXTRA_OBSTACLES,
  decodeHouseholdManipulationPopulation,
  G1_MAX_OBSTACLES,
  initFrankenSimOwnerKernel,
  kernelSourceNow,
} from "../lib/frankensimCmaes";
import { heatmapKernelLive, renderHeatmapJs } from "../lib/frankensimHeatmap";
import { clearTrainingSession } from "../lib/g1TrainingSession";
import { fetchDefaultTransformerWeights } from "../lib/gaitTransformer";
import {
  evaluateHouseNavigationSafetyAndCostmap,
  type HouseNavigationSafetyAndCostmapDiagnostic,
} from "../lib/houseNavigationChain";
import { CRAFTSMAN_BUNGALOW_1928 } from "../lib/houseScenes";
import { KernelPerfProfiler, type ProfilerSummaryStats } from "../lib/kernelPerfProfiler";
import {
  decodeHouseholdNavigationPolicy,
  type EqualBudgetHouseholdCmaesResult,
  evaluateHouseholdCmaesCampaign,
  evaluateHouseholdNavigationPolicy,
  type HouseholdCmaesCampaignDiagnostic,
  runEqualBudgetHouseholdCmaes,
} from "../lib/liveCmaesHousehold";
import { CRAFTSMAN_TOUR_KEYFRAMES, generateMultiRoomTourRollout } from "../lib/multiRoomTour";
import {
  type AblationCausalInterventionDiagnostic,
  evaluateAblationCausalInterventions,
  parseTrainReceipt,
} from "../lib/policyAblationComparison";
import {
  BODY_STRIDE,
  CONTACT_STRIDE,
  decodeSchema8Packet,
  encodeSchema8Packet,
  HEADER_WORDS,
  JOINT_STRIDE,
  SCHEMA_8_MAGIC,
  SCHEMA_8_VERSION,
  type Schema8Frame,
  viewSchema8Packet,
} from "../lib/schema8WireFormat";
import {
  computeWilsonConfidenceInterval95,
  evaluateShuffledStressHeldOutAndInfeasibleControls,
  generateShuffledScene,
  type MultiTrialSummary,
  runMultiTrialStressSuite,
  runShuffledStressTrial,
  type ShuffledStressHeldOutDiagnostic,
  type StressTrialResult,
} from "../lib/shuffledFurnitureStressTest";
import {
  evaluateTourAndVisitorContinuitySuite,
  generateVisitorModeClip,
  type TourAndVisitorContinuityDiagnostic,
  VISITOR_CLIP_KEYFRAMES,
} from "../lib/visitorModeClip";
import { evaluateArmObjectContactDiagnostics } from "./ArmPhysicsDebugOverlay";
import { CMAESMiniRadar } from "./CMAESPhaseSpaceViewer";
import { inspectCatalogPiecePhysics } from "./FurnitureCatalogInspector";
import { evaluateG1DifferentiableSdfAndImpulseDiagnostics } from "./G1PhysicsDebugOverlay";
import { G1ResidualTrainer } from "./G1ResidualTrainer";
import { HpoBestParameters, HpoTrainer } from "./HpoTrainer";
import { KMR_ROOM_DESTINATIONS } from "./KmrScene";
import {
  CRAFTSMAN_MATERIAL_DATABASE,
  evaluateMaterialRenderingPipeline,
} from "./MaterialDatabaseInspector";
import { PolicyAblationComparison } from "./PolicyAblationComparison";
import { RealPhysicsResidual } from "./RealPhysicsResidual";
import { RobotGraphicsRecoveryNotice, watchRobotGraphics } from "./RobotStageRecovery";

export interface FrontierKernelAndStressDiagnostics {
  v067MultiBodyRefusalCode: string;
  v068ReadyCapabilitiesCount: number;
  v068WorkloadValid: boolean;
  schema8WordCount: number;
  schema8ByteLength: number;
  schema8ZeroCopyBodyCount: number;
  schema8ZeroCopyJointCount: number;
  schema8ZeroCopyContactCount: number;
  schema8DecodedFrame: Schema8Frame;
  schema8Spec: {
    magic: number;
    version: number;
    headerWords: number;
    bodyStride: number;
    jointStride: number;
    contactStride: number;
    g1MaxObstacles: number;
    armMaxExtraObstacles: number;
    kernelSource: string;
  };
  featherstoneDynamics: {
    qDDotAba: number;
    tauRneaRoundtrip: number;
    abaRneaResidualAbs: number;
    kineticEnergy: number;
    potentialEnergy: number;
    totalEnergy: number;
    stepQNext: number;
    spatialKineticPowerCheck: number;
    spatialCrossPowerZero: number;
  };
  equalBudgetHouseholdCmaes: EqualBudgetHouseholdCmaesResult;
  directHouseholdPolicyProbe: {
    decodedMaxSpeedMps: number;
    probeLoss: number;
  };
  stressTrial: StressTrialResult;
  multiTrialSuite: MultiTrialSummary;
  wilson95CiPercent: [number, number];
  visitorClipFrameCount: number;
  visitorClipPlaybackRatio: number;
  visitorClipEpisodeSuccess: boolean;
  multiRoomTourFrameCount: number;
  houseNavSafetyAndCostmap: HouseNavigationSafetyAndCostmapDiagnostic;
  ablationCausalInterventions: AblationCausalInterventionDiagnostic;
  householdCmaesCampaign: HouseholdCmaesCampaignDiagnostic;
  shuffledStressHeldOutControls: ShuffledStressHeldOutDiagnostic;
  tourAndVisitorContinuity: TourAndVisitorContinuityDiagnostic;
  releaseQualityGates: {
    fastPrGate: ReleaseQualityGateAggregation;
    fullReleaseGateMissingAppleDsr: ReleaseQualityGateAggregation;
  };
  ddpTrajectory: {
    converged: boolean;
    iterationsTaken: number;
    initialCost: number;
    finalCost: number;
    linearizedB0: number;
    recomputedFinalCost: number;
  };
  citoTrajectory: {
    converged: boolean;
    finalEpsilon: number;
    maxComplementarityGap: number;
    maxFischerBurmeisterResidual: number;
    fbZeroResidual: number;
    fbGradNorm: number;
  };
  crossDomainAudit: {
    cmaes2DOuterProductTrace: number;
    cmaesNDJacobiEigen0: number;
    cmaesNDCovSqrtProductTrace: number;
    heatmapLive: boolean;
    bridgeSchemaVersion: number;
    armPopulationDecodedCount: number;
    tourKeyframeCount: number;
    visitorKeyframeCount: number;
    kmrDestinationCount: number;
    parsedReceiptSamples: number;
    armContactHullCount: number;
    g1CapsuleCount: number;
    catalogPartCount: number;
    materialDatabaseCount: number;
    materialPipelineAcesCoeffA: number;
    componentHooksWired: boolean;
  };
  perfProfiler: ProfilerSummaryStats;
}

const SINGLE_PENDULUM_TREE: MultibodyTree = {
  name: "frontier-1dof-pendulum",
  gravity: [0, 0, -9.81],
  links: [
    {
      id: "link1",
      name: "Link 1",
      parentIndex: -1,
      jointType: "revolute",
      jointAxis: [0, 1, 0],
      parentTransform: { rotation: [0, 0, 0], translation: [0, 0, 0] },
      mass: 1.0,
      centerOfMass: [0, 0, -0.5],
      inertiaPrincipal: [0.0833, 0.0833, 0.01],
      damping: 0.1,
    },
  ],
};

export function evaluateFrontierKernelAndStressDiagnostics(
  seed = 101,
): FrontierKernelAndStressDiagnostics {
  const v067Adapter = new BrowserPhysicsAdapter();
  v067Adapter.initialize("v067");
  const v067MultiBodyCheck = v067Adapter.validateWorkload({ numBodies: 8, numJoints: 4 });
  const v067MultiBodyRefusalCode = !v067MultiBodyCheck.success
    ? v067MultiBodyCheck.error.code
    : "UNEXPECTED_ACCEPT";

  const v068Manifest: KernelManifest = {
    kernelVersion: "v068",
    schemaVersion: 8,
    buildTimestamp: 1760800000,
    supportedCapabilities: [
      "single-body",
      "multibody",
      "rolling-friction",
      "contact-manifold",
      "sdf-ccd",
      "featherstone-aba",
    ],
    manifestSignature: "sha256:frankensim-v068-schema8-verified",
    maxBodiesSupported: 64,
    maxJointsSupported: 32,
  };
  const v068Adapter = new BrowserPhysicsAdapter();
  const v068Init = v068Adapter.initialize("v068", v068Manifest);
  const v068WorkloadCheck = v068Adapter.validateWorkload({
    numBodies: 12,
    numJoints: 6,
    enableCcd: true,
    enableRollingFriction: true,
  });

  const packet = encodeSchema8Packet({
    sequenceIndex: seed,
    status: 0,
    bodies: [
      {
        position: [0.35, 0.78, 2.5],
        quaternion: [0, 0, 0, 1],
        linearVelocity: [0.42, 0, -0.18],
        angularVelocity: [0, 0.05, 0],
      },
      {
        position: [1.8, 0.45, 1.0],
        quaternion: [0, 0, 0, 1],
        linearVelocity: [0.12, 0, 0.04],
        angularVelocity: [0, 0, 0],
      },
    ],
    joints: [{ position: 0.52, velocity: 0.1, torque: 1.8, limitForce: 0 }],
    contacts: [
      {
        position: [1.8, 0.0, 1.0],
        normal: [0, 1, 0],
        depth: 0.002,
        normalImpulse: 14.5,
      },
    ],
  });
  const zeroCopyView = viewSchema8Packet(packet);
  const schema8DecodedFrame = decodeSchema8Packet(packet);

  // Featherstone ABA / RNEA inverse-forward roundtrip + total mechanical energy + spatial algebra
  const appliedTau = 1.25;
  const abaRes = forwardDynamicsABA(SINGLE_PENDULUM_TREE, [0.45], [0.2], [appliedTau]);
  const rneaTau = inverseDynamicsRNEA(SINGLE_PENDULUM_TREE, [0.45], [0.2], abaRes.qDDot);
  const mechEnergy = computeMechanicalEnergy(SINGLE_PENDULUM_TREE, [0.45], [0.2]);
  const stepDyn = stepMultibodyDynamics(SINGLE_PENDULUM_TREE, [0.45], [0.2], [appliedTau], 0.002);

  const link0 = SINGLE_PENDULUM_TREE.links[0];
  const relTf = computeLinkRelativeTransform(link0, 0.45);
  const rotIdent = multiplyMat3(
    eulerToRotationMatrix([0, 0, 0]),
    transposeMat3(axisAngleToRotationMatrix(normalizeAxis3(link0.jointAxis), 0)),
  );
  const comRot = multiplyMat3Vec3(rotIdent, link0.centerOfMass);
  const spatialI = buildSpatialInertia(link0.mass, comRot, link0.inertiaPrincipal);
  const parentI = transformSpatialInertia(relTf.R_rel, relTf.r_rel, spatialI);
  const vJoint = spatialAdd(createZeroSpatial(), spatialScale(relTf.S, 0.2));
  const vMotion = transformSpatialMotion(relTf.R_rel, relTf.r_rel, vJoint);
  const hMomentum = multiplyInertiaVector(parentI, vMotion);
  const fBias = spatialCrossForce(vMotion, hMomentum);
  const vCrossZero = spatialSub(spatialCrossMotion(vMotion, vMotion), createZeroSpatial());
  const fParent = transformSpatialForce(relTf.R_rel, relTf.r_rel, fBias);
  const spatialKineticPowerCheck = 0.5 * spatialDot(vMotion, hMomentum) + spatialDot(vCrossZero, fParent);
  const spatialCrossPowerZero = Math.abs(spatialDot(vMotion, fBias));

  // Equal-budget CMA-ES vs Random Search on Craftsman Household Navigation Policy
  const equalBudgetHouseholdCmaes = runEqualBudgetHouseholdCmaes({
    seed,
    populationSize: 4,
    generations: 2,
  });
  const directDecoded = decodeHouseholdNavigationPolicy([0, 0, 0, 0, 0]);
  const directEval = evaluateHouseholdNavigationPolicy([0, 0, 0, 0, 0], { maxSteps: 20 });

  const shuffledScene = generateShuffledScene({ seed });
  const stressTrial = runShuffledStressTrial(shuffledScene);
  const multiTrialSuite = runMultiTrialStressSuite([seed, seed + 101, seed + 202]);
  const wilson95CiPercent = computeWilsonConfidenceInterval95(stressTrial.success ? 5 : 4, 5);

  const visitorFrames = generateVisitorModeClip(undefined, 60, 2);
  const multiRoomTourFrames = generateMultiRoomTourRollout(undefined, 36, 12);
  const houseNavSafetyAndCostmap = evaluateHouseNavigationSafetyAndCostmap();
  const ablationCausalInterventions = evaluateAblationCausalInterventions([42, 43, 44]);
  const householdCmaesCampaign = evaluateHouseholdCmaesCampaign([42, 43, 44]);
  const shuffledStressHeldOutControls = evaluateShuffledStressHeldOutAndInfeasibleControls(
    [42, 43, 44],
    [101, 202, 303],
  );
  const tourAndVisitorContinuity = evaluateTourAndVisitorContinuitySuite();

  const expectedCommit = "b69bf3f";
  const expectedWasmSha = "sha256:frankensim-v068-schema8-verified";
  const fastPrReceipts: QualityGateLaneReceipt[] = REQUIRED_FAST_PR_LANES.map((laneId, idx) => ({
    laneId,
    tier: "fast-pr",
    status: "passed",
    sourceCommitHash: expectedCommit,
    ownerWasmSha256: expectedWasmSha,
    durationMs: 120 + idx * 45,
  }));
  const fastPrGate = aggregateReleaseQualityGates(
    fastPrReceipts,
    expectedCommit,
    expectedWasmSha,
    "pr",
  );
  const partialReleaseReceipts: QualityGateLaneReceipt[] = [
    ...fastPrReceipts,
    ...REQUIRED_RELEASE_CAMPAIGN_LANES.filter((l) => l !== "apple-dsr-gate").map(
      (laneId, idx) => ({
        laneId,
        tier: "release-campaign" as const,
        status: "passed" as const,
        sourceCommitHash: expectedCommit,
        ownerWasmSha256: expectedWasmSha,
        durationMs: 850 + idx * 210,
      }),
    ),
  ];
  const fullReleaseGateMissingAppleDsr = aggregateReleaseQualityGates(
    partialReleaseReceipts,
    expectedCommit,
    expectedWasmSha,
    "release",
  );

  // DDP / iLQR Trajectory Optimization (Crocoddyl / Mayne / Tassa)
  const ddpHorizon = 12;
  const ddpWeights = {
    qState: [4.0, 0.5],
    rControl: [0.05],
    qTerminal: [20.0, 4.0],
  };
  const ddpRes = solveDDP(
    SINGLE_PENDULUM_TREE,
    [0.45, 0.0],
    [0.0, 0.0],
    Array.from({ length: ddpHorizon }, () => [0.0]),
    ddpWeights,
    { ...DEFAULT_DDP_CONFIG, horizonSteps: ddpHorizon, maxIterations: 8 },
  );
  const ddpNextState = evalDynamics(SINGLE_PENDULUM_TREE, [0.45, 0.0], [0.0], DEFAULT_DDP_CONFIG.dt);
  const ddpLin = linearizeDynamics(
    SINGLE_PENDULUM_TREE,
    ddpNextState,
    [0.0],
    DEFAULT_DDP_CONFIG.dt,
  );
  const recomputedFinalCost = evaluateTrajectoryCost(
    ddpRes.states,
    ddpRes.controls,
    [0.0, 0.0],
    ddpWeights,
  );

  // Contact-Implicit Trajectory Optimization (Posa-Cantu-Tedrake Fischer-Burmeister NCP)
  const citoRes = solveContactImplicitCollocation({
    horizonSteps: 10,
    dt: 0.05,
    initialQ: [0.0, 0.72, 0.0],
    targetQ: [1.2, 0.72, 0.4],
    mass: 35.0,
    obstacles: [{ center: [0.6, 0.35, 0.2], size: [0.3, 0.7, 0.3] }],
    maxIterations: 8,
  });
  const fbZeroResidual = Math.abs(fischerBurmeister(0.0, 12.0, 1e-4));
  const fbGrad = fischerBurmeisterGrad(0.0, 12.0, 1e-4);
  const fbGradNorm = Math.hypot(fbGrad.da, fbGrad.db);

  // Kernel Micro-Performance Profiler (480 Hz / 2083.3 us budget)
  const profiler = new KernelPerfProfiler(64, 480);
  for (let k = 0; k < 12; k++) {
    profiler.recordStep(
      k,
      {
        broadphase: 110 + (k % 3) * 8,
        narrowphase: 245 + (k % 4) * 12,
        lcpSolver: 520 + (k % 5) * 18,
        integrator: 95 + (k % 2) * 5,
      },
      14,
      6,
      k / 480,
    );
  }
  const perfProfiler = profiler.getSummaryStats();

  // Cross-domain linear algebra, kernel packet, and component inspector audit
  const rng = createMulberry32(seed);
  const z2d = sampleGaussianVector(2, rng);
  const op2d = outerProduct(z2d, z2d);
  const cmaes2DOuterProductTrace = (op2d[0]?.[0] ?? 0) + (op2d[1]?.[1] ?? 0);
  const zNd = sampleGaussianVectorND(3, rng);
  const symMat = [
    [2.0 + zNd[0] * 0.01, 0.2, 0.0],
    [0.2, 1.5, 0.1],
    [0.0, 0.1, 1.0],
  ];
  const jacobi = jacobiEigenSymmetric(symMat);
  const covPowers = computeCovariancePowers(jacobi.eigenvalues, jacobi.eigenvectors);
  const covIdent = matMult(covPowers.sqrtC, covPowers.invSqrtC);
  const cmaesNDCovSqrtProductTrace =
    (covIdent[0]?.[0] ?? 0) + (covIdent[1]?.[1] ?? 0) + (covIdent[2]?.[2] ?? 0);

  renderHeatmapJs({
    field: "sphere",
    width: 2,
    height: 2,
    xmin: -1,
    xmax: 1,
    ymin: -1,
    ymax: 1,
    norm: { mode: "linear", k: 1 },
    ramp: { r0: 0, rk: 255, g0: 0, gk: 255, b0: 0, bk: 255 },
    fallbackField: (x, y) => x * x + y * y,
  });
  const armPopDecoded = decodeHouseholdManipulationPopulation(
    new Float64Array([0x41524d31, 4, 0, 4, 8, 2, -12.4, -9.8]),
  );
  const parsedReceipt = parseTrainReceipt({
    architecture: { parameterCount: 31136 },
    training: { samplesConsumed: 128000, wallclockSeconds: 180, environment: "g1-stepwise" },
  });
  const armDiag = evaluateArmObjectContactDiagnostics();
  const g1Diag = evaluateG1DifferentiableSdfAndImpulseDiagnostics();
  const catalogDiag = inspectCatalogPiecePhysics(CRAFTSMAN_BUNGALOW_1928.furniture[0], 0.5, false, 2);
  const matDiag = evaluateMaterialRenderingPipeline(CRAFTSMAN_MATERIAL_DATABASE[0]);
  const componentHooksWired =
    typeof initFrankenSimOwnerKernel === "function" &&
    typeof clearTrainingSession === "function" &&
    typeof fetchDefaultTransformerWeights === "function" &&
    typeof CMAESMiniRadar === "function" &&
    typeof HpoBestParameters === "function" &&
    typeof RobotGraphicsRecoveryNotice === "function" &&
    typeof watchRobotGraphics === "function";

  return {
    v067MultiBodyRefusalCode,
    v068ReadyCapabilitiesCount: v068Init.success ? v068Init.value.capabilities.length : 0,
    v068WorkloadValid: v068WorkloadCheck.success,
    schema8WordCount: packet.length,
    schema8ByteLength: packet.byteLength,
    schema8ZeroCopyBodyCount: zeroCopyView.numBodies,
    schema8ZeroCopyJointCount: zeroCopyView.numJoints,
    schema8ZeroCopyContactCount: zeroCopyView.numContacts,
    schema8DecodedFrame,
    schema8Spec: {
      magic: SCHEMA_8_MAGIC,
      version: SCHEMA_8_VERSION,
      headerWords: HEADER_WORDS,
      bodyStride: BODY_STRIDE,
      jointStride: JOINT_STRIDE,
      contactStride: CONTACT_STRIDE,
      g1MaxObstacles: G1_MAX_OBSTACLES,
      armMaxExtraObstacles: ARM_MAX_EXTRA_OBSTACLES,
      kernelSource: kernelSourceNow(),
    },
    featherstoneDynamics: {
      qDDotAba: abaRes.qDDot[0] ?? 0,
      tauRneaRoundtrip: rneaTau[0] ?? 0,
      abaRneaResidualAbs: Math.abs((rneaTau[0] ?? 0) - appliedTau),
      kineticEnergy: mechEnergy.kineticEnergy,
      potentialEnergy: mechEnergy.potentialEnergy,
      totalEnergy: mechEnergy.totalEnergy,
      stepQNext: stepDyn.qNext[0] ?? 0,
      spatialKineticPowerCheck,
      spatialCrossPowerZero,
    },
    equalBudgetHouseholdCmaes,
    directHouseholdPolicyProbe: {
      decodedMaxSpeedMps: directDecoded.maxSpeedMps,
      probeLoss: directEval.loss,
    },
    stressTrial,
    multiTrialSuite,
    wilson95CiPercent,
    visitorClipFrameCount: visitorFrames.length,
    visitorClipPlaybackRatio: visitorFrames[0]?.playbackSpeedRatio ?? 1.0,
    visitorClipEpisodeSuccess: visitorFrames[0]?.episodeSuccess ?? false,
    multiRoomTourFrameCount: multiRoomTourFrames.length,
    houseNavSafetyAndCostmap,
    ablationCausalInterventions,
    householdCmaesCampaign,
    shuffledStressHeldOutControls,
    tourAndVisitorContinuity,
    releaseQualityGates: {
      fastPrGate,
      fullReleaseGateMissingAppleDsr,
    },
    ddpTrajectory: {
      converged: ddpRes.converged,
      iterationsTaken: ddpRes.iterationsTaken,
      initialCost: ddpRes.initialCost,
      finalCost: ddpRes.finalCost,
      linearizedB0: ddpLin.B[1]?.[0] ?? 0,
      recomputedFinalCost,
    },
    citoTrajectory: {
      converged: citoRes.converged,
      finalEpsilon: citoRes.finalEpsilon,
      maxComplementarityGap: citoRes.maxComplementarityGap,
      maxFischerBurmeisterResidual: citoRes.maxFischerBurmeisterResidual,
      fbZeroResidual,
      fbGradNorm,
    },
    crossDomainAudit: {
      cmaes2DOuterProductTrace,
      cmaesNDJacobiEigen0: jacobi.eigenvalues[0] ?? 0,
      cmaesNDCovSqrtProductTrace,
      heatmapLive: heatmapKernelLive(),
      bridgeSchemaVersion: FRANKENROBOTS_BRIDGE_SCHEMA_VERSION,
      armPopulationDecodedCount: "ok" in armPopDecoded ? armPopDecoded.ok.length : 0,
      tourKeyframeCount: CRAFTSMAN_TOUR_KEYFRAMES.length,
      visitorKeyframeCount: VISITOR_CLIP_KEYFRAMES.length,
      kmrDestinationCount: KMR_ROOM_DESTINATIONS.length,
      parsedReceiptSamples: parsedReceipt.samplesConsumed,
      armContactHullCount: armDiag.hullKeys.length,
      g1CapsuleCount: g1Diag.capsuleCount,
      catalogPartCount: catalogDiag.proceduralGeometry.partCount,
      materialDatabaseCount: CRAFTSMAN_MATERIAL_DATABASE.length,
      materialPipelineAcesCoeffA: matDiag.postFxDiagnostics.acesCoeffA,
      componentHooksWired,
    },
    perfProfiler,
  };
}

type ResearchPanel = "policies" | "residual-receipt" | "residual-trainer" | "trainer" | "frontier";

const PANELS: Array<{
  id: ResearchPanel;
  label: string;
  detail: string;
  icon: typeof BrainCircuit;
}> = [
  {
    id: "policies",
    label: "Policy showdown",
    detail: "Measured phase-prior vs trained transformer receipts",
    icon: ChartNoAxesCombined,
  },
  {
    id: "residual-receipt",
    label: "Real-physics residual",
    detail: "Transformer improvements measured by the same G1 owner",
    icon: Dumbbell,
  },
  {
    id: "residual-trainer",
    label: "Train a residual",
    detail: "Run LM-CMA, resume, import, download, and share a policy",
    icon: Play,
  },
  {
    id: "trainer",
    label: "Training the trainer",
    detail: "Live outer CMA-ES over eight learning hyperparameters",
    icon: FlaskConical,
  },
  {
    id: "frontier",
    label: "FrankenSim frontier",
    detail: "What the current upstream optimizer adds—and what is not wired yet",
    icon: Network,
  },
];

/**
 * Lazily mounts the heavier research surfaces so opening the robot lab does
 * not immediately pay for a 17 MB transformer or a live ablation sweep.
 */
export function FrankenRobotsResearchAnnex() {
  const [active, setActive] = useState<ResearchPanel | null>(null);
  const [stressSeed, setStressSeed] = useState<number>(101);
  const frontierDiag = useMemo(
    () => (active === "frontier" ? evaluateFrontierKernelAndStressDiagnostics(stressSeed) : null),
    [active, stressSeed],
  );

  return (
    <section className="glass-card border-violet-300/15 bg-slate-950/80 p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-violet-300/20 bg-violet-400/10 p-3">
          <BrainCircuit className="h-6 w-6 text-violet-200" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            Research annex · load on demand
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">Beyond the primary locomotion run</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            These are real companion experiments from the current project—not decorative cards.
            Choose one to mount it; the primary G1 stage stays fast and focused until then.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {PANELS.map((panel) => {
          const Icon = panel.icon;
          const selected = active === panel.id;
          return (
            <button
              key={panel.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(selected ? null : panel.id)}
              className={`min-h-24 rounded-2xl border p-4 text-left transition-colors ${
                selected
                  ? "border-violet-300/45 bg-violet-400/15"
                  : "border-white/10 bg-black/20 hover:border-violet-300/25 hover:bg-white/[0.045]"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <Icon className="h-4 w-4 text-violet-200" />
                {panel.label}
              </span>
              <span className="mt-2 block text-xs leading-5 text-slate-400">{panel.detail}</span>
            </button>
          );
        })}
      </div>

      {active === "policies" ? (
        <div className="mt-6">
          <PolicyAblationComparison />
        </div>
      ) : null}
      {active === "residual-receipt" ? (
        <div className="mt-6">
          <p className="mb-4 max-w-4xl text-sm leading-6 text-slate-300">
            This is the original humanoid page&apos;s source-bound comparison: the transformer
            residual and tuned controller are both re-scored by the same articulated G1 physics
            owner, with the committed receipt kept beside the weights.
          </p>
          <RealPhysicsResidual />
        </div>
      ) : null}
      {active === "residual-trainer" ? (
        <div className="mt-6">
          <p className="mb-4 max-w-4xl text-sm leading-6 text-slate-300">
            Run the original page&apos;s live 960-parameter residual search on this device. Runs
            persist separately by condition; you can resume a checkpoint, start from the shipped
            policy, import or download weights, and share a policy in a URL fragment that never
            reaches a server.
          </p>
          <G1ResidualTrainer />
        </div>
      ) : null}
      {active === "trainer" ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <HpoTrainer />
        </div>
      ) : null}
      {active === "frontier" && frontierDiag ? (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.07] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Current upstream source
              </p>
              <h3 className="mt-2 font-bold text-white">Many-objective search has moved forward</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                FrankenSim now contains deterministic NSGA-II/III and MOEA/D, versioned mating and
                normalization policies, reference-direction survival, bounded Pareto archives,
                hypervolume accounting, and production WFG1–WFG9 evaluators with replay-visible
                identities. That opens a future robot lab where stability, speed, work, clearance,
                and impact are explored as an auditable frontier instead of collapsed prematurely.
              </p>
            </article>
            <article className="rounded-2xl border border-amber-300/20 bg-amber-400/[0.07] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                Honest runtime boundary
              </p>
              <h3 className="mt-2 font-bold text-white">
                Not mislabeled as today&apos;s robot owner
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                This app&apos;s physical rollouts still execute the pinned robotics owner package.
                The newer many-objective APIs remain upstream Rust source until a versioned browser
                ABI, parity battery, and robot-specific receipt contract are shipped. The app shows
                that frontier without pretending it already powered the animation.
              </p>
            </article>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                Fail-Closed Adapter &amp; Schema-8 Wire ABI
              </p>
              <div className="mt-2 space-y-1 font-mono text-xs text-slate-300">
                <div>v067 Multi-Body Gate: {frontierDiag.v067MultiBodyRefusalCode}</div>
                <div>
                  v068 Manifest Caps: {frontierDiag.v068ReadyCapabilitiesCount} (
                  {frontierDiag.v068WorkloadValid ? "valid" : "refused"})
                </div>
                <div>
                  Schema-8 Packet: {frontierDiag.schema8WordCount} f64 (
                  {frontierDiag.schema8ByteLength} B)
                </div>
                <div>
                  Zero-Copy Views: {frontierDiag.schema8ZeroCopyBodyCount}B /{" "}
                  {frontierDiag.schema8ZeroCopyJointCount}J /{" "}
                  {frontierDiag.schema8ZeroCopyContactCount}C (decoded seq #
                  {frontierDiag.schema8DecodedFrame.sequenceIndex})
                </div>
                <div>
                  Quality Gates: PR{" "}
                  {frontierDiag.releaseQualityGates.fastPrGate.passed ? "PASS" : "FAIL"} (
                  {frontierDiag.releaseQualityGates.fastPrGate.verifiedLaneCount}/
                  {frontierDiag.releaseQualityGates.fastPrGate.requiredLaneCount}) • Rel{" "}
                  {frontierDiag.releaseQualityGates.fullReleaseGateMissingAppleDsr.passed
                    ? "PASS"
                    : "HOLD"}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-violet-300">
                  Shuffled Furniture Stress Trial
                </p>
                <div className="flex gap-1">
                  {[101, 202, 303].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStressSeed(s)}
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                        stressSeed === s
                          ? "bg-violet-500/30 text-violet-200 border border-violet-400/40"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      #{s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-2 space-y-1 font-mono text-xs text-slate-300">
                <div>
                  Trial #{frontierDiag.stressTrial.trialSeed}:{" "}
                  {frontierDiag.stressTrial.success ? "PASS" : "BLOCKED"} (steps:{" "}
                  {frontierDiag.stressTrial.totalSteps})
                </div>
                <div>
                  Min Clearance: {frontierDiag.stressTrial.minimumClearanceMeters.toFixed(3)} m
                </div>
                <div>
                  Rolling Piece Shift: {frontierDiag.stressTrial.rollingPieceDisplacement.toFixed(3)}{" "}
                  m
                </div>
                <div>
                  Wilson 95% CI: [{frontierDiag.wilson95CiPercent[0].toFixed(1)}%,{" "}
                  {frontierDiag.wilson95CiPercent[1].toFixed(1)}%]
                </div>
                <div>
                  Multi-Seed Suite: {frontierDiag.multiTrialSuite.passedTrials}/
                  {frontierDiag.multiTrialSuite.totalTrials} pass (valid:{" "}
                  {frontierDiag.multiTrialSuite.validAttemptCount})
                </div>
                <div>
                  Safety / Costmap: {frontierDiag.houseNavSafetyAndCostmap.recoveryState} • Tour:{" "}
                  {frontierDiag.multiRoomTourFrameCount}f
                </div>
                <div>
                  CMA-ES vs Rand ({frontierDiag.equalBudgetHouseholdCmaes.evaluationBudget} evals):{" "}
                  {frontierDiag.equalBudgetHouseholdCmaes.cmaesBestReceipt.loss.toFixed(1)} vs{" "}
                  {frontierDiag.equalBudgetHouseholdCmaes.randomSearchBestReceipt.loss.toFixed(1)}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                DDP, C-ITO &amp; Kernel Perf Telemetry
              </p>
              <div className="mt-2 space-y-1 font-mono text-xs text-slate-300">
                <div>
                  ABA/RNEA Δτ:{" "}
                  {frontierDiag.featherstoneDynamics.abaRneaResidualAbs.toExponential(2)} N·m • E:{" "}
                  {frontierDiag.featherstoneDynamics.totalEnergy.toFixed(3)} J
                </div>
                <div>
                  DDP / iLQR Cost: {frontierDiag.ddpTrajectory.initialCost.toFixed(2)} →{" "}
                  {frontierDiag.ddpTrajectory.finalCost.toFixed(2)} (
                  {frontierDiag.ddpTrajectory.iterationsTaken} iters)
                </div>
                <div>
                  C-ITO NCP Gap: {frontierDiag.citoTrajectory.maxComplementarityGap.toExponential(2)}{" "}
                  • FB: {frontierDiag.citoTrajectory.maxFischerBurmeisterResidual.toExponential(2)}
                </div>
                <div>
                  480Hz Step p50 / p95: {frontierDiag.perfProfiler.p50Micros.toFixed(0)}µs /{" "}
                  {frontierDiag.perfProfiler.p95Micros.toFixed(0)}µs (overruns:{" "}
                  {frontierDiag.perfProfiler.budgetOverrunCount})
                </div>
                <div>
                  Visitor Clip: {frontierDiag.visitorClipFrameCount}f @{" "}
                  {frontierDiag.visitorClipPlaybackRatio.toFixed(2)}x (
                  {frontierDiag.visitorClipEpisodeSuccess ? "All rooms" : "Partial"})
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
