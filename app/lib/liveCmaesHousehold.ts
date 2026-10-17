// Household/HPO interface to the shared active-CMA implementation.
// Sampling, whitening, evolution paths and covariance updates have one owner.
import { CMAESOptimizerND } from "./cmaesEngineND";
import { createSceneFromHouseFurniture, queryMultiObstacleScene } from "./houseMultiObstacleKernel";
import {
  CRAFTSMAN_DOORWAYS,
  CRAFTSMAN_WAYPOINT_CHAIN,
  type HouseWaypoint,
} from "./houseNavigationChain";
import { CRAFTSMAN_BUNGALOW_1928 } from "./houseScenes";
import { type CorridorSegment, filterCorridorVelocityQP } from "./segmentSafeCbf";

export interface CmaesState {
  dimension: number;
  lambdaPopulation: number;
  muElite: number;
  generation: number;
  mean: number[];
  sigma: number;
  covariance: number[][];
  evolutionPathC: number[];
  evolutionPathSigma: number[];
  bestFitness: number;
  bestParams: number[];
  fitnessHistory: number[];
}

export interface CmaesOwnerConfig {
  ownerId: string;
  name: string;
  dimension: number;
  initialSigma?: number;
  populationSize?: number;
  seed?: number;
  /** Initialize the search at a finite prior mean; omitted means the origin. */
  initialMean?: number[];
}

export class LiveCmaesOptimizer {
  private readonly engine: CMAESOptimizerND;

  constructor(config: CmaesOwnerConfig) {
    this.engine = new CMAESOptimizerND(null, {
      dim: config.dimension,
      lambda: config.populationSize,
      initialMean: config.initialMean ?? new Array(config.dimension).fill(0),
      initialSigma: config.initialSigma ?? 0.3,
      seed: config.seed ?? 42,
      repairStrategy: "none",
      activeCMA: true,
    });
  }

  public get state(): CmaesState {
    return {
      dimension: this.engine.dim,
      lambdaPopulation: this.engine.lambda,
      muElite: this.engine.mu,
      generation: this.engine.generation,
      mean: [...this.engine.mean],
      sigma: this.engine.sigma,
      covariance: this.engine.C,
      evolutionPathC: [...this.engine.pC],
      evolutionPathSigma: [...this.engine.pSigma],
      bestFitness: this.engine.bestFitness,
      bestParams: [...this.engine.bestX],
      fitnessHistory: this.engine.history.map((state) => state.bestFitness),
    };
  }

  public samplePopulation(mirrored = false): number[][] {
    return this.engine.ask(mirrored);
  }

  public tellEvaluations(
    candidates: number[][],
    fitnessValues: number[],
  ): { bestGenFitness: number; bestEverFitness: number } {
    const result = this.engine.tell(candidates, fitnessValues);
    return {
      bestGenFitness: result.samples[0].trueFitness,
      bestEverFitness: result.bestFitness,
    };
  }
}

export interface HouseholdNavigationPolicyParams {
  /** Waypoint attraction gain in [0.4, 3.0]. */
  attractionGain: number;
  /** OBB obstacle repulsion gain in [0.0, 2.5]. */
  repulsionGain: number;
  /** Repulsion activation distance (m) in [0.05, 0.45]. */
  repulsionHorizonMeters: number;
  /** SSCBF class-K barrier gain gamma in [1.0, 8.0]. */
  cbfGamma: number;
  /** Maximum cruise speed (m/s) in [0.4, 1.5]. */
  maxSpeedMps: number;
}

export interface HouseholdPolicyEvaluationReceipt {
  loss: number;
  waypointsReached: number;
  totalWaypoints: number;
  completedAllRooms: boolean;
  collisionOccurred: boolean;
  minimumClearanceMeters: number;
  elapsedPhysicalSeconds: number;
  totalPathDistanceMeters: number;
  decodedPolicy: HouseholdNavigationPolicyParams;
}

export interface EqualBudgetHouseholdCmaesResult {
  seed: number;
  evaluationBudget: number;
  cmaesEvaluationsUsed: number;
  randomSearchEvaluationsUsed: number;
  initialPolicyReceipt: HouseholdPolicyEvaluationReceipt;
  cmaesBestReceipt: HouseholdPolicyEvaluationReceipt;
  randomSearchBestReceipt: HouseholdPolicyEvaluationReceipt;
  cmaesBestParams: number[];
  cmaesFitnessHistory: number[];
}

/**
 * Decodes an unconstrained 5-D search vector z in R^5 into bounded physical
 * household navigation control parameters via smooth logistic/exponential maps.
 */
export function decodeHouseholdNavigationPolicy(z: readonly number[]): HouseholdNavigationPolicyParams {
  const sig = (v: number) => 1.0 / (1.0 + Math.exp(-Math.max(-20, Math.min(20, v))));
  return {
    attractionGain: 0.4 + 2.6 * sig(z[0] ?? 0),
    repulsionGain: 2.5 * sig(z[1] ?? 0),
    repulsionHorizonMeters: 0.05 + 0.4 * sig(z[2] ?? 0),
    cbfGamma: 1.0 + 7.0 * sig(z[3] ?? 0),
    maxSpeedMps: 0.4 + 1.1 * sig(z[4] ?? 0),
  };
}

/**
 * Evaluates a 5-D candidate navigation policy inside the actual 1928 Craftsman Bungalow
 * multi-obstacle scene (`CRAFTSMAN_BUNGALOW_1928` furniture OBBs + `CRAFTSMAN_DOORWAYS`).
 * Returns a scalar loss (lower is better) and a verifiable physical rollout receipt.
 */
export function evaluateHouseholdNavigationPolicy(
  candidateZ: readonly number[],
  options: {
    waypoints?: HouseWaypoint[];
    corridors?: CorridorSegment[];
    maxSteps?: number;
    dt?: number;
    robotRadius?: number;
  } = {},
): HouseholdPolicyEvaluationReceipt {
  const decoded = decodeHouseholdNavigationPolicy(candidateZ);
  const waypoints = options.waypoints ?? CRAFTSMAN_WAYPOINT_CHAIN;
  const corridors = options.corridors ?? CRAFTSMAN_DOORWAYS;
  const maxSteps = options.maxSteps ?? 420;
  const dt = options.dt ?? 0.05;
  const robotRadius = options.robotRadius ?? 0.2;

  const scene = createSceneFromHouseFurniture(CRAFTSMAN_BUNGALOW_1928.furniture);
  let pos: [number, number] = [waypoints[0].position[0], waypoints[0].position[1]];
  let vel: [number, number] = [0, 0];
  let yaw = 0;
  let currentWpIdx = 1;
  let minClearance = Infinity;
  let collisionOccurred = false;
  let totalDist = 0;
  let stepsTaken = 0;

  const startQ = queryMultiObstacleScene(
    { position: [pos[0], 0.5, pos[1]], robotRadius, safetyMargin: 0.04 },
    scene,
  );
  minClearance = Math.min(minClearance, startQ.minimumClearanceMeters);
  if (startQ.minimumClearanceMeters < 0.0) {
    collisionOccurred = true;
  }

  for (let step = 0; step < maxSteps; step++) {
    if (currentWpIdx >= waypoints.length) break;
    stepsTaken = step + 1;

    const targetWp = waypoints[currentWpIdx];
    const dx = targetWp.position[0] - pos[0];
    const dz = targetWp.position[1] - pos[1];
    const distToWp = Math.hypot(dx, dz);

    if (distToWp <= targetWp.acceptanceRadius) {
      currentWpIdx++;
      if (currentWpIdx >= waypoints.length) break;
      continue;
    }

    const dirX = dx / (distToWp || 1e-5);
    const dirZ = dz / (distToWp || 1e-5);
    const desiredSpeed = Math.min(decoded.maxSpeedMps, distToWp * decoded.attractionGain);
    let nomVx = dirX * desiredSpeed;
    let nomVz = dirZ * desiredSpeed;

    const preQ = queryMultiObstacleScene(
      { position: [pos[0], 0.5, pos[1]], robotRadius, safetyMargin: 0.04 },
      scene,
    );
    if (
      preQ.minimumClearanceMeters < decoded.repulsionHorizonMeters &&
      !corridors.some((c) => {
        const mx = 0.5 * (c.start[0] + c.end[0]);
        const mz = 0.5 * (c.start[1] + c.end[1]);
        return Math.hypot(pos[0] - mx, pos[1] - mz) < 0.75;
      })
    ) {
      const repStrength =
        decoded.repulsionGain * (decoded.repulsionHorizonMeters - preQ.minimumClearanceMeters);
      nomVx += preQ.gradientVector[0] * repStrength;
      nomVz += preQ.gradientVector[2] * repStrength;
    }

    yaw = Math.atan2(dirZ, dirX);
    const cbfRes = filterCorridorVelocityQP(
      [nomVx, nomVz],
      { position: pos, velocity: vel, yaw, robotRadius },
      corridors,
      decoded.cbfGamma,
      decoded.maxSpeedMps,
    );

    vel = cbfRes.safeVelocity;
    const stepDx = vel[0] * dt;
    const stepDz = vel[1] * dt;
    pos = [pos[0] + stepDx, pos[1] + stepDz];
    totalDist += Math.hypot(stepDx, stepDz);

    const postQ = queryMultiObstacleScene(
      { position: [pos[0], 0.5, pos[1]], robotRadius, safetyMargin: 0.04 },
      scene,
    );
    const stepClearance = cbfRes.isCorridorActive
      ? Math.min(postQ.minimumClearanceMeters, cbfRes.lateralMargin)
      : postQ.minimumClearanceMeters;
    if (stepClearance < minClearance) minClearance = stepClearance;
    if (stepClearance < 0.0) {
      collisionOccurred = true;
    }
  }

  const completedAllRooms = currentWpIdx >= waypoints.length && !collisionOccurred;
  const remainingWp = Math.max(0, waypoints.length - currentWpIdx);
  const finalTarget = waypoints[Math.min(waypoints.length - 1, currentWpIdx)];
  const residualDist = Math.hypot(finalTarget.position[0] - pos[0], finalTarget.position[1] - pos[1]);
  const elapsedSeconds = stepsTaken * dt;

  // Physical objective: strongly penalize collisions and unreached rooms, reward fast completion + safety margin
  const collisionPenalty = collisionOccurred ? 500.0 + Math.abs(Math.min(0, minClearance)) * 200.0 : 0.0;
  const incompletePenalty = remainingWp * 80.0 + (completedAllRooms ? 0.0 : residualDist * 15.0);
  const clearancePenalty = Math.max(0.0, 0.12 - minClearance) * 40.0;
  const loss = collisionPenalty + incompletePenalty + elapsedSeconds + clearancePenalty;

  return {
    loss,
    waypointsReached: currentWpIdx,
    totalWaypoints: waypoints.length,
    completedAllRooms,
    collisionOccurred,
    minimumClearanceMeters: minClearance,
    elapsedPhysicalSeconds: elapsedSeconds,
    totalPathDistanceMeters: totalDist,
    decodedPolicy: decoded,
  };
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Runs an equal-budget comparison between `LiveCmaesOptimizer` and a seeded random search
 * in the actual 1928 Craftsman Bungalow navigation scene (`cmaes-feat-fs9-live-cma-5jb`).
 */
export function runEqualBudgetHouseholdCmaes(
  options: {
    seed?: number;
    populationSize?: number;
    generations?: number;
    initialMean?: number[];
    initialSigma?: number;
  } = {},
): EqualBudgetHouseholdCmaesResult {
  const seed = options.seed ?? 42;
  const populationSize = options.populationSize ?? 6;
  const generations = Math.max(0, options.generations ?? 6);
  const initialMean = options.initialMean ?? [-1.2, -1.0, -0.5, -0.8, -1.2];
  const initialSigma = options.initialSigma ?? 0.85;
  const evaluationBudget = populationSize * generations;

  const initialPolicyReceipt = evaluateHouseholdNavigationPolicy(initialMean);
  if (generations === 0) {
    return {
      seed,
      evaluationBudget: 0,
      cmaesEvaluationsUsed: 0,
      randomSearchEvaluationsUsed: 0,
      initialPolicyReceipt,
      cmaesBestReceipt: initialPolicyReceipt,
      randomSearchBestReceipt: initialPolicyReceipt,
      cmaesBestParams: [...initialMean],
      cmaesFitnessHistory: [],
    };
  }

  const optimizer = new LiveCmaesOptimizer({
    ownerId: "craftsman-household-nav",
    name: "Craftsman Household Navigation Policy",
    dimension: 5,
    populationSize,
    initialMean,
    initialSigma,
    seed,
  });

  let cmaesBestReceipt = initialPolicyReceipt;
  let cmaesEvals = 0;

  for (let g = 0; g < generations; g++) {
    const pop = optimizer.samplePopulation();
    const losses: number[] = new Array(pop.length);
    for (let i = 0; i < pop.length; i++) {
      const rec = evaluateHouseholdNavigationPolicy(pop[i]);
      losses[i] = rec.loss;
      cmaesEvals++;
      if (rec.loss < cmaesBestReceipt.loss) {
        cmaesBestReceipt = rec;
      }
    }
    optimizer.tellEvaluations(pop, losses);
  }

  // Equal-budget random search around initialMean with smaller exploratory spread
  const rng = mulberry32(seed ^ 0x9e3779b9);
  let randomSearchBestReceipt = initialPolicyReceipt;
  let randomEvals = 0;
  for (let i = 0; i < evaluationBudget; i++) {
    const cand = initialMean.map((m) => m + (rng() * 2.0 - 1.0) * initialSigma * 0.45);
    const rec = evaluateHouseholdNavigationPolicy(cand);
    randomEvals++;
    if (rec.loss < randomSearchBestReceipt.loss) {
      randomSearchBestReceipt = rec;
    }
  }

  return {
    seed,
    evaluationBudget,
    cmaesEvaluationsUsed: cmaesEvals,
    randomSearchEvaluationsUsed: randomEvals,
    initialPolicyReceipt,
    cmaesBestReceipt,
    randomSearchBestReceipt,
    cmaesBestParams: optimizer.state.bestParams,
    cmaesFitnessHistory: optimizer.state.fitnessHistory,
  };
}

