import {
  DEFAULT_G1_WALKING_CONFIG,
  type CmaFamily,
  type G1Challenge,
  type G1Task,
  type G1WalkingConfig,
} from "./frankensimCmaes";
import {
  g1KernelObstacleRoster,
  g1SeatForHouse,
  type HouseholdKernelObstacle,
} from "./houseMultiObstacleKernel";

export type G1OptimizationRequest =
  | {
      type: "preview";
      task: G1Task;
      challenge: G1Challenge;
      /**
       * Stage position the browser will render the robot at, as a horizontal
       * offset from the owner's origin. The keep-out roster is declared
       * relative to it, so moving the robot re-certifies it against the house
       * it is actually standing in. Omitted means the default seat.
       */
      seat?: [number, number, number];
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
    }
  | {
      type: "compare";
      task: G1Task;
      challenge: G1Challenge;
      generations: number;
      sigma?: number;
    };

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
  if (!seat) return G1_KERNEL_OBSTACLES;
  return g1KernelObstacleRoster(seat);
}

export function g1OptimizationRunKey(
  task: G1Task,
  challenge: G1Challenge,
  family: Exclude<CmaFamily, "full">,
  seedIndex: number,
): string {
  return `${task}:${challenge}:${family}:${seedIndex}`;
}
