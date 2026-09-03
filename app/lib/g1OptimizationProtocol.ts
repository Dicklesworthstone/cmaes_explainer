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
  | { type: "preview"; task: G1Task; challenge: G1Challenge }
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

/** Seat the rendered robot stands at, and the roster relative to it. */
export const G1_HOUSE_SEAT = g1SeatForHouse();
export const G1_KERNEL_OBSTACLES = g1KernelObstacleRoster(G1_HOUSE_SEAT.offset);

export function g1OptimizationRunKey(
  task: G1Task,
  challenge: G1Challenge,
  family: Exclude<CmaFamily, "full">,
  seedIndex: number,
): string {
  return `${task}:${challenge}:${family}:${seedIndex}`;
}
