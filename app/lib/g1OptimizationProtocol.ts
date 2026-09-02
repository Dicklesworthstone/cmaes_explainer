import {
  DEFAULT_G1_WALKING_CONFIG,
  type CmaFamily,
  type G1Challenge,
  type G1Task,
  type G1WalkingConfig,
} from "./frankensimCmaes";

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

export function g1OptimizationConfig(
  task: G1Task,
  challenge: G1Challenge,
): G1WalkingConfig {
  return { ...DEFAULT_G1_WALKING_CONFIG, task, challenge };
}

export function g1OptimizationRunKey(
  task: G1Task,
  challenge: G1Challenge,
  family: Exclude<CmaFamily, "full">,
  seedIndex: number,
): string {
  return `${task}:${challenge}:${family}:${seedIndex}`;
}
