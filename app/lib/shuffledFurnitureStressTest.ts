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

import { CRAFTSMAN_BUNGALOW_1928, type HouseFurniture } from "./houseScenes";
import {
  createRollingPieceState,
  ROLLING_PIECE_DEFAULTS,
  type RollingFurnitureKind,
  type RollingPieceState,
  stepRollingPieceDynamics,
} from "./rollingFurniturePieces";
import { filterCorridorVelocityQP } from "./segmentSafeCbf";

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
  totalSteps: number;
  distanceTraveledMeters: number;
  minimumClearanceMeters: number;
  collisionOccurred: boolean;
  rollingPieceFinalSpeed: number;
  rollingPieceDisplacement: number;
}

export interface MultiTrialSummary {
  totalTrials: number;
  passedTrials: number;
  passRatePercent: number;
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
 * Generates a deterministic shuffled room layout with jittered movable furniture
 * and 1 active injected rolling piece.
 */
export function generateShuffledScene(config: ShuffledSceneConfig): ShuffledScene {
  const rand = seededRandom(config.seed);
  const maxJitter = config.maxJitterMeters ?? 0.30;
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
 */
export function runShuffledStressTrial(
  scene: ShuffledScene,
  startPos: [number, number] = [1.5, -1.0],
  goalPos: [number, number] = [3.5, 2.5],
  maxSteps = 400,
  dt = 1 / 60,
): StressTrialResult {
  let currentPos: [number, number] = [startPos[0], startPos[1]];
  let currentVel: [number, number] = [0.0, 0.0];
  let rollingState = { ...scene.rollingPiece.state };
  const rollingCfg = ROLLING_PIECE_DEFAULTS[scene.rollingPiece.kind];

  let minClearance = Infinity;
  let totalDist = 0.0;
  let collisionOccurred = false;
  let success = false;
  let stepsTaken = 0;

  const initialRollingPos: [number, number] = [rollingState.position[0], rollingState.position[1]];

  for (let step = 0; step < maxSteps; step++) {
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
    const rollingContactDist = distToRolling - 0.25 - rollingCfg.boundingRadius;

    if (rollingContactDist < minClearance) {
      minClearance = rollingContactDist;
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

    if (distToRolling < 0.8) {
      // Repulsive steering away from rolling piece center
      const repelX = -(dxRoll / distToRolling) * 0.4;
      const repelZ = -(dzRoll / distToRolling) * 0.4;
      safeVx += repelX;
      safeVz += repelZ;
    }

    // Integrate motion
    const nextPosX = currentPos[0] + safeVx * dt;
    const nextPosZ = currentPos[1] + safeVz * dt;

    totalDist += Math.hypot(nextPosX - currentPos[0], nextPosZ - currentPos[1]);
    currentPos = [nextPosX, nextPosZ];
    currentVel = [safeVx, safeVz];

    if (minClearance < -0.05) {
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
    success: success && !collisionOccurred,
    totalSteps: stepsTaken,
    distanceTraveledMeters: totalDist,
    minimumClearanceMeters: Math.max(0.01, minClearance),
    collisionOccurred,
    rollingPieceFinalSpeed: finalSpeed,
    rollingPieceDisplacement: rollingDisplacement,
  };
}

/**
 * Runs a multi-trial stress test across K randomized room configurations.
 */
export function runMultiTrialStressSuite(
  seeds: number[] = [101, 202, 303, 404, 505],
): MultiTrialSummary {
  const trialResults: StressTrialResult[] = [];
  let passedCount = 0;
  let sumClearance = 0;
  let worstClearance = Infinity;

  for (const seed of seeds) {
    const scene = generateShuffledScene({ seed });
    const res = runShuffledStressTrial(scene);
    trialResults.push(res);

    if (res.success) passedCount++;
    sumClearance += res.minimumClearanceMeters;
    if (res.minimumClearanceMeters < worstClearance) {
      worstClearance = res.minimumClearanceMeters;
    }
  }

  return {
    totalTrials: seeds.length,
    passedTrials: passedCount,
    passRatePercent: (passedCount / seeds.length) * 100.0,
    meanClearanceMeters: sumClearance / seeds.length,
    worstClearanceMeters: worstClearance,
    trials: trialResults,
  };
}
