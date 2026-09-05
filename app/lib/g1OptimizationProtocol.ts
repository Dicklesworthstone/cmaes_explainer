import {
  DEFAULT_G1_WALKING_CONFIG,
  FRANKENSIM_OWNER_ARTIFACT,
  buildG1Config,
  type CmaFamily,
  type G1Challenge,
  type G1Task,
  type G1WalkingConfig,
} from "./frankensimCmaes";
import {
  g1KernelObstacleRoster,
  g1SeatForHouse,
  createHouseNavigationScene,
  HOUSE_STRUCTURAL_SURFACES,
  type HouseholdKernelObstacle,
} from "./houseMultiObstacleKernel";

export type G1OptimizationRequest = {
  /** Stage translation of the owner origin; shared by every operation. */
  seat?: [number, number, number];
} & (
  | {
      type: "preview";
      task: G1Task;
      challenge: G1Challenge;
    }
  | {
      type: "optimize";
      task: G1Task;
      family: Exclude<CmaFamily, "full">;
      generations: number;
      seedIndex: number;
      mode?: "continue" | "fresh";
      challenge: G1Challenge;
      sigma?: number;
      /** Keep extending the same owner session until an explicit stop arrives. */
      continuous?: boolean;
      /**
       * Start a NEW session from these coefficients instead of the curriculum
       * mean — how a run recovered from storage continues after a reload.
       *
       * The CMA state itself (sigma, evolution paths, covariance) lives in WASM
       * and is not serialisable, so this is a warm restart from the policy, not
       * a resumed search. Ignored when continuing a session already in memory.
       */
      resumeFrom?: Float64Array;
    }
  | {
      type: "stop";
      task: G1Task;
      family: Exclude<CmaFamily, "full">;
      seedIndex: number;
      challenge: G1Challenge;
    }
  | {
      /** Render a policy the operator imported from a file or a share link. */
      type: "replay";
      task: G1Task;
      challenge: G1Challenge;
      family: Exclude<CmaFamily, "full">;
      policy: Float64Array;
      /** Generation the imported policy came from, so it is not filed as the seed. */
      generation: number;
    }
  | {
      type: "compare";
      task: G1Task;
      challenge: G1Challenge;
      generations: number;
      sigma?: number;
    }
);

/**
 * Measured launch radius for the 5,040-D walking owner.
 *
 * A fixed-seed sweep on owner 0.6.18 found that 0.005 made no progress in
 * 16 generations, while 0.001 improved the objective on all three declared
 * seeds (7.9155 -> -2.4051, -2.2149, and -3.6346 respectively).
 *
 * Re-measured against wall time rather than generation count, now that a run
 * ends when the operator stops it rather than at a budget: given 60 s from the
 * same curriculum mean, 5e-4 beats 1e-3 for both memory families (LM-CMA
 * -9.34 vs -7.11, LM-MA -9.83 vs -9.64), and both beat 5e-3 (-1.31) and 1.2e-2
 * (no improvement at all). Equal wall time is the honest comparison here
 * because a policy that survives longer costs more per generation: the slower
 * radii were reaching MORE generations, not fewer.
 */
export const G1_DEFAULT_SEARCH_SIGMA = 0.0005;

/**
 * Seat the rendered robot stands at, and the keep-out roster expressed
 * relative to it. Declared before the function that uses them as a default
 * argument: a default is evaluated at call time, so a later declaration works
 * today, but only because nothing calls it during module evaluation. Ordering
 * them first removes that trap.
 */
export const G1_HOUSE_SEAT = g1SeatForHouse();
export const G1_KERNEL_OBSTACLES = g1KernelObstacleRoster(G1_HOUSE_SEAT.offset);

/**
 * The walking config every worker call uses, including the keep-out roster.
 *
 * The owner starts each rollout at its own origin, so the boxes are declared
 * relative to the seat the browser will render the robot at. That seat is
 * fixed and known before the first rollout (g1SeatForHouse), which is why it
 * can be baked into the config instead of derived from a returned trace.
 */
export function g1OptimizationConfig(
  task: G1Task,
  challenge: G1Challenge,
  obstacles: readonly HouseholdKernelObstacle[] = G1_KERNEL_OBSTACLES,
): G1WalkingConfig {
  return { ...DEFAULT_G1_WALKING_CONFIG, task, challenge, obstacles };
}

/**
 * The roster for a robot standing at `seat`, or the default seat's roster.
 *
 * The owner always begins at its own origin, so a robot the operator has
 * dragged across the room needs its boxes re-expressed before the receipt
 * means anything. Without this the page kept showing the old seat's verdict:
 * drag the robot into the sofa and it still claimed zero penetration.
 */
export function g1ObstaclesForSeat(
  seat?: readonly [number, number, number],
): readonly HouseholdKernelObstacle[] {
  return g1KernelObstacleRoster(g1ResolveSeat(seat));
}

export function g1ResolveSeat(
  seat: readonly [number, number, number] = G1_HOUSE_SEAT.offset,
): [number, number, number] {
  if (seat.length !== 3 || !seat.every(Number.isFinite) || seat[1] !== 0) {
    throw new Error(
      "G1 placement requires finite stage coordinates on the floor (y = 0).",
    );
  }
  return [seat[0], seat[1], seat[2]];
}

export type G1SceneReceipt = {
  seat: [number, number, number];
  configWords: number[];
  declaredBodyCount: number;
  catalogBodyCount: number;
  /** Hash of the exact owner config packet, stage translation and WASM digest. */
  digest: string;
};

export async function g1ExperimentForSeat(
  task: G1Task,
  challenge: G1Challenge,
  requestedSeat?: readonly [number, number, number],
): Promise<{ config: G1WalkingConfig; scene: G1SceneReceipt }> {
  const seat = g1ResolveSeat(requestedSeat);
  const obstacles = g1ObstaclesForSeat(seat);
  const config = g1OptimizationConfig(task, challenge, obstacles);
  // Fixed little-endian f64 bytes preserve every admitted input, including
  // adjacent floating-point values that rounded display strings would hide.
  const configWords = Array.from(buildG1Config(config));
  const values = [...seat, ...configWords];
  const owner = new TextEncoder().encode(
    `g1-scene-v1:${FRANKENSIM_OWNER_ARTIFACT.assets.wasmSha256}`,
  );
  const bytes = new Uint8Array(owner.length + values.length * 8);
  bytes.set(owner);
  const view = new DataView(bytes.buffer);
  values.forEach((value, index) =>
    view.setFloat64(owner.length + index * 8, value, true),
  );
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const digest = Array.from(hash, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  const catalogBodyCount =
    createHouseNavigationScene().obstacles.filter(
      (body) => !body.exemptFromPenalty,
    ).length + HOUSE_STRUCTURAL_SURFACES.length;
  return {
    config,
    scene: {
      seat,
      configWords,
      digest,
      declaredBodyCount: obstacles.length,
      catalogBodyCount,
    },
  };
}

export function g1OptimizationRunKey(
  task: G1Task,
  challenge: G1Challenge,
  family: Exclude<CmaFamily, "full">,
  seedIndex: number,
  seat?: readonly [number, number, number],
): string {
  return `${task}:${challenge}:${family}:${seedIndex}:${JSON.stringify(g1ResolveSeat(seat))}`;
}
