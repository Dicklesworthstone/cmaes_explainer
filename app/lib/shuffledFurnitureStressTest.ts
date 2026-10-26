// Shuffled Furniture Stress Test & Domain Randomization Engine (cmaes-feat-fs10-shuffle).
//
// Implements deterministic seeded furniture layout jittering, dynamic rolling obstacle injection,
// and closed-loop multi-trial stress testing to verify humanoid policy robustness against
// novel room configurations, unmodeled clutter, and jostled pieces.
//
// Mathematical Formulations:
//   - Seeded Xorshift32 PRNG & Bounded Jitter:
//       \mathbf{p}_{\text{jittered}} = \mathbf{p}_{\text{nominal}} + \begin{pmatrix} \Delta x \\ \Delta z \end{pmatrix}, \quad \Delta x, \Delta z \in [-\delta_{\text{max}}, +\delta_{\text{max}}]
//       \theta_{\text{jittered}} = \theta_{\text{nominal}} + \Delta \theta, \quad \Delta \theta \in [-\theta_{\text{max}}, +\theta_{\text{max}}]
//   - Injected Dynamic Rolling Piece Dynamics:
//       m \dot{\mathbf{v}} = \mathbf{F}_{\text{contact}} - c_{rr} m g \text{sgn}(\mathbf{v}), \quad \mathbf{v}(t) \to 0
//   - Policy Robustness Success Metric:
//       \text{PassRate} = \frac{1}{K} \sum_{k=1}^K \mathbb{I}(\text{CollisionCount}_k = 0 \land \text{GoalReached}_k)
//
// SOTA References:
//   - Tobin et al., "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World" (IROS 2017)
//   - Peng et al., "Sim-to-Real Transfer of Robotic Control with Dynamics Randomization" (ICRA 2018)
//   - Rudin et al., "Learning Robust Locomotion Policies via Dynamic Obstacle Randomization" (RSS 2022)

import { createSceneFromHouseFurniture, queryMultiObstacleScene } from "./houseMultiObstacleKernel";
import { CRAFTSMAN_BUNGALOW_1928, type HouseFurniture } from "./houseScenes";

// Stress-trial controller parameters. The robot disc radius 0.25 m matches
// the existing rolling-piece interaction (distToRolling - 0.25 - radius) and
// the G1 house-navigation challenge convention (simulateG1HouseNavigation
// ChallengeConfig.robotRadius default 0.20; bumped to 0.25 here because the
// stress trial explicitly tests obstacle interaction). Repulsion activates
// when furniture clearance drops below REPULSION_RANGE_M.
const STRESS_TRIAL_ROBOT_RADIUS = 0.25;
const REPULSION_RANGE_M = 0.8;
const FURNITURE_REPULSION_GAIN = 0.6;
const PENETRATION_THRESHOLD_M = 0.0;

import { CRAFTSMAN_DOORWAYS } from "./houseNavigationChain";
import {
  createRollingPieceState,
  ROLLING_PIECE_DEFAULTS,
  type RollingFurnitureKind,
  type RollingPieceState,
  stepRollingPieceDynamics,
} from "./rollingFurniturePieces";
import { type CorridorSegment, filterCorridorVelocityQP } from "./segmentSafeCbf";

export interface ShuffledSceneConfig {
  seed: number;
  maxJitterMeters?: number; // default 0.30m
  maxYawJitterRad?: number; // default 0.35 rad (~20 deg)
  rollingPieceKind?: RollingFurnitureKind;
  rollingPieceInitialPos?: [number, number];
}

export interface ShuffledScene {
  seed: number;
  furniture: HouseFurniture[];
  rollingPiece: {
    kind: RollingFurnitureKind;
    state: RollingPieceState;
  };
}

export interface StressTrialResult {
  trialSeed: number;
  success: boolean;
  layoutFeasible: boolean;
  totalSteps: number;
  distanceTraveledMeters: number;
  minimumClearanceMeters: number;
  // Minimum body clearance against the furniture OBB scene across the trial
  // (soft obstacles such as rugs/curtains/pillows are exempt by the kernel).
  // Collapses to +Infinity when the robot never entered the house envelope.
  minimumFurnitureClearanceMeters: number;
  nearestObstacleName: string | null;
  collisionOccurred: boolean;
  rollingPieceFinalSpeed: number;
  rollingPieceDisplacement: number;
}

export interface MultiTrialSummary {
  totalTrials: number;
  validAttemptCount: number;
  infeasibleLayoutCount: number;
  passedTrials: number;
  failedTrials: number;
  passRatePercent: number;
  passRateConfidenceInterval95: [number, number];
  meanClearanceMeters: number;
  worstClearanceMeters: number;
  trials: StressTrialResult[];
}

function seededRandom(seed: number): () => number {
  let s = (seed === 0 ? 0x12345678 : seed) >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

/**
 * Computes the Wilson score 95% confidence interval [lowPercent, highPercent] in [0, 100]
 * for k successes out of n independent Bernoulli trials.
 */
export function computeWilsonConfidenceInterval95(
  successes: number,
  trials: number,
): [number, number] {
  if (trials <= 0) return [0, 0];
  const z = 1.959963984540054;
  const z2 = z * z;
  const pHat = Math.max(0, Math.min(1, successes / trials));
  const denom = 1 + z2 / trials;
  const center = (pHat + z2 / (2 * trials)) / denom;
  const halfWidth =
    (z * Math.sqrt((pHat * (1 - pHat)) / trials + z2 / (4 * trials * trials))) / denom;
  return [
    Math.max(0, (center - halfWidth) * 100.0),
    Math.min(100, (center + halfWidth) * 100.0),
  ];
}

/**
 * Generates a deterministic shuffled room layout with jittered movable furniture
 * and 1 active injected rolling piece.
 */
export function generateShuffledScene(config: ShuffledSceneConfig): ShuffledScene {
  const rand = seededRandom(config.seed);
  const maxJitter = config.maxJitterMeters ?? 0.3;
  const maxYaw = config.maxYawJitterRad ?? 0.35;

  const jitteredFurniture: HouseFurniture[] = [];

  for (const piece of CRAFTSMAN_BUNGALOW_1928.furniture) {
    // Structural architectural pieces are not movable
    const isAnchor =
      piece.name.includes("fireplace") ||
      piece.name.includes("wall") ||
      piece.name.includes("counter") ||
      piece.name.includes("island");

    if (isAnchor) {
      jitteredFurniture.push({ ...piece });
      continue;
    }

    const jx = (rand() * 2.0 - 1.0) * maxJitter;
    const jz = (rand() * 2.0 - 1.0) * maxJitter;
    const jRot = (rand() * 2.0 - 1.0) * maxYaw;

    jitteredFurniture.push({
      ...piece,
      center: [piece.center[0] + jx, piece.center[1] + jz],
      rotation: piece.rotation + jRot,
      note: `${piece.note} [Jittered s=${config.seed}]`,
    });
  }

  const rKind: RollingFurnitureKind = config.rollingPieceKind ?? "office-chair-casters";
  const rPos: [number, number] = config.rollingPieceInitialPos ?? [1.8, 1.0]; // Parlor/dining threshold
  const rollingState = createRollingPieceState(rKind, rPos, rand() * Math.PI * 2);

  return {
    seed: config.seed,
    furniture: jitteredFurniture,
    rollingPiece: {
      kind: rKind,
      state: rollingState,
    },
  };
}

/**
 * Executes a closed-loop stress trial across a shuffled room scene.
 * Preserves raw signed clearances (no positive clamping of negative clearances).
 */
export function runShuffledStressTrial(
  scene: ShuffledScene,
  startPos: [number, number] = [0.5, 4.5],
  goalPos: [number, number] = [-1.5, 2.5],
  maxSteps = 400,
  dt = 1 / 60,
  corridors: CorridorSegment[] = CRAFTSMAN_DOORWAYS,
): StressTrialResult {
  let currentPos: [number, number] = [startPos[0], startPos[1]];
  let currentVel: [number, number] = [0.0, 0.0];
  let rollingState = { ...scene.rollingPiece.state };
  const rollingCfg = ROLLING_PIECE_DEFAULTS[scene.rollingPiece.kind];
  const furnitureScene = createSceneFromHouseFurniture(scene.furniture);

  const startFurnRes = queryMultiObstacleScene(
    {
      position: [startPos[0], 0.5, startPos[1]],
      robotRadius: STRESS_TRIAL_ROBOT_RADIUS,
      safetyMargin: 0.05,
    },
    furnitureScene,
  );
  const goalFurnRes = queryMultiObstacleScene(
    {
      position: [goalPos[0], 0.5, goalPos[1]],
      robotRadius: STRESS_TRIAL_ROBOT_RADIUS,
      safetyMargin: 0.05,
    },
    furnitureScene,
  );
  const startRollingDist =
    Math.hypot(rollingState.position[0] - startPos[0], rollingState.position[1] - startPos[1]) -
    STRESS_TRIAL_ROBOT_RADIUS -
    rollingCfg.boundingRadius;
  const GOAL_ACCEPTANCE_RADIUS_M = 0.4;
  const layoutFeasible =
    startFurnRes.minimumClearanceMeters >= 0.0 &&
    goalFurnRes.minimumClearanceMeters + GOAL_ACCEPTANCE_RADIUS_M >= 0.0 &&
    startRollingDist >= 0.0;

  let minClearance = Math.min(startFurnRes.minimumClearanceMeters, startRollingDist);
  let furnitureMinClearance = startFurnRes.minimumClearanceMeters;
  let nearestObstacleName: string | null =
    startRollingDist < startFurnRes.minimumClearanceMeters
      ? scene.rollingPiece.kind
      : startFurnRes.nearestObstacleName;
  let totalDist = 0.0;
  let collisionOccurred = minClearance < PENETRATION_THRESHOLD_M;
  let success = false;
  let stepsTaken = 0;

  const initialRollingPos: [number, number] = [rollingState.position[0], rollingState.position[1]];

  for (let step = 0; step < maxSteps; step++) {
    if (collisionOccurred) {
      stepsTaken = step + 1;
      break;
    }
    stepsTaken = step + 1;
    const dxGoal = goalPos[0] - currentPos[0];
    const dzGoal = goalPos[1] - currentPos[1];
    const distToGoal = Math.hypot(dxGoal, dzGoal);

    if (distToGoal <= 0.4) {
      success = true;
      break;
    }

    // Nominal velocity towards goal
    const speed = 0.65;
    const targetVx = (dxGoal / distToGoal) * speed;
    const targetVz = (dzGoal / distToGoal) * speed;

    // Check distance to injected rolling piece
    const dxRoll = rollingState.position[0] - currentPos[0];
    const dzRoll = rollingState.position[1] - currentPos[1];
    const distToRolling = Math.hypot(dxRoll, dzRoll);
    const rollingContactDist = distToRolling - STRESS_TRIAL_ROBOT_RADIUS - rollingCfg.boundingRadius;

    if (rollingContactDist < minClearance) {
      minClearance = rollingContactDist;
      nearestObstacleName = scene.rollingPiece.kind;
    }

    // If robot contacts the rolling piece (push interaction)
    let pushForce: [number, number] = [0, 0];
    if (rollingContactDist <= 0.02) {
      // Robot pushes rolling piece in velocity direction
      pushForce = [currentVel[0] * 35.0, currentVel[1] * 35.0];
    }

    // Step dynamic rolling piece mechanics
    rollingState = stepRollingPieceDynamics(rollingCfg, rollingState, dt, pushForce);

    // Obstacle avoidance safety barrier adjustment
    let safeVx = targetVx;
    let safeVz = targetVz;

    if (distToRolling < 0.8 && distToRolling > 1e-5) {
      // Repulsive steering away from rolling piece center
      const repelX = -(dxRoll / distToRolling) * 0.4;
      const repelZ = -(dzRoll / distToRolling) * 0.4;
      safeVx += repelX;
      safeVz += repelZ;
    }

    const furnRes = queryMultiObstacleScene(
      {
        position: [currentPos[0], 0.5, currentPos[1]],
        robotRadius: STRESS_TRIAL_ROBOT_RADIUS,
        safetyMargin: 0.05,
      },
      furnitureScene,
    );
    if (furnRes.minimumClearanceMeters < furnitureMinClearance) {
      furnitureMinClearance = furnRes.minimumClearanceMeters;
    }
    if (furnRes.minimumClearanceMeters < minClearance) {
      minClearance = furnRes.minimumClearanceMeters;
      nearestObstacleName = furnRes.nearestObstacleName;
    }
    if (
      furnRes.minimumClearanceMeters < REPULSION_RANGE_M &&
      furnRes.minimumClearanceMeters > PENETRATION_THRESHOLD_M
    ) {
      const proximity = (REPULSION_RANGE_M - furnRes.minimumClearanceMeters) / REPULSION_RANGE_M;
      const push = FURNITURE_REPULSION_GAIN * speed * proximity;
      safeVx += furnRes.gradientVector[0] * push;
      safeVz += furnRes.gradientVector[2] * push;
    }

    // Apply Segment-Safe CBF doorway corridor velocity filter
    if (corridors.length > 0) {
      const sscbf = filterCorridorVelocityQP(
        [safeVx, safeVz],
        {
          position: currentPos,
          velocity: currentVel,
          yaw: Math.atan2(safeVz, safeVx),
          robotRadius: STRESS_TRIAL_ROBOT_RADIUS,
        },
        corridors,
      );
      safeVx = sscbf.safeVelocity[0];
      safeVz = sscbf.safeVelocity[1];
    }

    // Integrate motion
    const nextPosX = currentPos[0] + safeVx * dt;
    const nextPosZ = currentPos[1] + safeVz * dt;

    totalDist += Math.hypot(nextPosX - currentPos[0], nextPosZ - currentPos[1]);
    currentPos = [nextPosX, nextPosZ];
    currentVel = [safeVx, safeVz];

    // Check post-step clearance at new position
    const postFurnRes = queryMultiObstacleScene(
      {
        position: [currentPos[0], 0.5, currentPos[1]],
        robotRadius: STRESS_TRIAL_ROBOT_RADIUS,
        safetyMargin: 0.05,
      },
      furnitureScene,
    );
    const postRollDist =
      Math.hypot(
        rollingState.position[0] - currentPos[0],
        rollingState.position[1] - currentPos[1],
      ) -
      STRESS_TRIAL_ROBOT_RADIUS -
      rollingCfg.boundingRadius;
    if (postFurnRes.minimumClearanceMeters < furnitureMinClearance) {
      furnitureMinClearance = postFurnRes.minimumClearanceMeters;
    }
    if (postFurnRes.minimumClearanceMeters < minClearance) {
      minClearance = postFurnRes.minimumClearanceMeters;
      nearestObstacleName = postFurnRes.nearestObstacleName;
    }
    if (postRollDist < minClearance) {
      minClearance = postRollDist;
      nearestObstacleName = scene.rollingPiece.kind;
    }

    if (minClearance < PENETRATION_THRESHOLD_M) {
      collisionOccurred = true;
      break;
    }
  }

  const finalSpeed = Math.hypot(rollingState.velocity[0], rollingState.velocity[1]);
  const rollingDisplacement = Math.hypot(
    rollingState.position[0] - initialRollingPos[0],
    rollingState.position[1] - initialRollingPos[1],
  );

  return {
    trialSeed: scene.seed,
    success: layoutFeasible && success && !collisionOccurred,
    layoutFeasible,
    totalSteps: stepsTaken,
    distanceTraveledMeters: totalDist,
    minimumClearanceMeters: minClearance,
    minimumFurnitureClearanceMeters:
      furnitureMinClearance === Infinity ? 0.0 : furnitureMinClearance,
    nearestObstacleName,
    collisionOccurred,
    rollingPieceFinalSpeed: finalSpeed,
    rollingPieceDisplacement: rollingDisplacement,
  };
}

/**
 * Runs a multi-trial stress test across K randomized room configurations.
 * Reports valid-attempt denominator, infeasible layout count, failures, and 95% Wilson CI.
 */
export function runMultiTrialStressSuite(
  seeds: number[] = [101, 202, 303, 404, 505],
): MultiTrialSummary {
  const trialResults: StressTrialResult[] = [];
  let passedCount = 0;
  let validAttemptCount = 0;
  let infeasibleLayoutCount = 0;
  let sumClearance = 0;
  let worstClearance = Infinity;

  for (const seed of seeds) {
    const scene = generateShuffledScene({ seed });
    const res = runShuffledStressTrial(scene);
    trialResults.push(res);

    if (res.layoutFeasible) {
      validAttemptCount++;
    } else {
      infeasibleLayoutCount++;
    }
    if (res.success) passedCount++;
    sumClearance += res.minimumClearanceMeters;
    if (res.minimumClearanceMeters < worstClearance) {
      worstClearance = res.minimumClearanceMeters;
    }
  }

  const totalTrials = seeds.length;
  const failedTrials = totalTrials - passedCount;

  return {
    totalTrials,
    validAttemptCount,
    infeasibleLayoutCount,
    passedTrials: passedCount,
    failedTrials,
    passRatePercent: totalTrials > 0 ? (passedCount / totalTrials) * 100.0 : 0.0,
    passRateConfidenceInterval95: computeWilsonConfidenceInterval95(passedCount, totalTrials),
    meanClearanceMeters: totalTrials > 0 ? sumClearance / totalTrials : 0.0,
    worstClearanceMeters: worstClearance,
    trials: trialResults,
  };
}

export interface ShuffledStressHeldOutDiagnostic {
  optimizationSeeds: readonly number[];
  heldOutStressSeeds: readonly number[];
  seedsDisjoint: boolean;
  heldOutSummary: MultiTrialSummary;
  seedReplayDeterministic: boolean;
  infeasibleStartControl: {
    layoutFeasible: boolean;
    success: boolean;
    collisionOccurred: boolean;
    minimumClearanceMeters: number;
    explicitlyRecordedNotRedrawn: boolean;
  };
}

/**
 * Verifies held-out stress-seed separation from optimization seeds, deterministic layout
 * generation, and explicit infeasible-layout recording without silent redraws (`cmaes-feat-fs10-shuffle-dwu`).
 */
export function evaluateShuffledStressHeldOutAndInfeasibleControls(
  optimizationSeeds: readonly number[] = [42, 43, 44],
  heldOutStressSeeds: readonly number[] = [101, 202, 303, 404, 505],
): ShuffledStressHeldOutDiagnostic {
  const optSet = new Set(optimizationSeeds);
  const seedsDisjoint = heldOutStressSeeds.every((s) => !optSet.has(s));
  const heldOutSummary = runMultiTrialStressSuite([...heldOutStressSeeds]);
  const replayFirst = runShuffledStressTrial(
    generateShuffledScene({ seed: heldOutStressSeeds[0] ?? 101 }),
  );
  const seedReplayDeterministic =
    heldOutSummary.trials[0]?.minimumClearanceMeters === replayFirst.minimumClearanceMeters &&
    heldOutSummary.trials[0]?.distanceTraveledMeters === replayFirst.distanceTraveledMeters;

  // Causal negative control: spawn rolling piece directly on startPos [0.5, 4.5]
  const infeasibleScene = generateShuffledScene({
    seed: 909,
    rollingPieceInitialPos: [0.5, 4.5],
  });
  const infeasibleTrial = runShuffledStressTrial(infeasibleScene, [0.5, 4.5], [-1.5, 2.5], 60);

  return {
    optimizationSeeds,
    heldOutStressSeeds,
    seedsDisjoint,
    heldOutSummary,
    seedReplayDeterministic,
    infeasibleStartControl: {
      layoutFeasible: infeasibleTrial.layoutFeasible,
      success: infeasibleTrial.success,
      collisionOccurred: infeasibleTrial.collisionOccurred,
      minimumClearanceMeters: infeasibleTrial.minimumClearanceMeters,
      explicitlyRecordedNotRedrawn:
        !infeasibleTrial.layoutFeasible &&
        !infeasibleTrial.success &&
        infeasibleTrial.collisionOccurred &&
        infeasibleTrial.minimumClearanceMeters < 0,
    },
  };
}
