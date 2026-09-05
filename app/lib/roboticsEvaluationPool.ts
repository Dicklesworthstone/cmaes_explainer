import type {
  G1WalkingConfig,
  HouseholdManipulationConfig,
} from "./frankensimCmaes";

type RoboticsPoolConfig =
  | { model: "g1"; config: G1WalkingConfig; dimension: 5_040 }
  | { model: "arm"; config: HouseholdManipulationConfig; dimension: 128 };

type ShardResponse =
  | { type: "result"; requestId: number; objectives: Float64Array }
  | { type: "error"; requestId: number; message: string };

const SHARD_TIMEOUT_MILLISECONDS = 60_000;

export interface ParallelEvaluationReceipt {
  objectives: Float64Array;
  lanes: number;
  firstBatchVerified: boolean;
  fallbackReason: string | null;
}

function exactObjectiveRowsMatch(left: Float64Array, right: Float64Array): boolean {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    if (!Object.is(left[index], right[index])) return false;
  }
  return true;
}

/** Persistent browser-worker fan-out for expensive, independent robot rollouts. */
export class RoboticsEvaluationPool {
  private readonly config: RoboticsPoolConfig;
  private readonly workers: Worker[];
  private requestId = 0;
  private verified = false;
  private fallbackReason: string | null = null;

  constructor(config: RoboticsPoolConfig, maximumLanes = 4) {
    this.config = config;
    const available = Math.max(1, globalThis.navigator?.hardwareConcurrency ?? 1);
    const lanes = Math.max(1, Math.min(maximumLanes, Math.max(1, available - 1)));
    this.workers = [];
    try {
      for (let lane = 0; lane < lanes; lane++) {
        const evaluationWorker = new Worker(
          new URL("../workers/roboticsEvaluationWorker.ts", import.meta.url), {
            type: "module",
            name: `frankensim-${config.model}-evaluation-${lane + 1}`,
          },
        );
        // This pool owns recovery from a failed lane, including failures that
        // arrive before the first shard request. Without preventing default,
        // an already-handled child error also kills the healthy parent worker.
        evaluationWorker.addEventListener("error", (event) => {
          event.preventDefault();
          this.fallbackReason ??= event.message || "robotics evaluation worker failed";
        });
        this.workers.push(evaluationWorker);
      }
    } catch (error) {
      this.fallbackReason = `worker construction failed: ${
        error instanceof Error ? error.message : String(error)
      }`;
      this.terminateWorkers();
    }
  }

  async evaluate(
    policies: Float64Array,
    sequential: () => Float64Array
  ): Promise<ParallelEvaluationReceipt> {
    const rows = policies.length / this.config.dimension;
    if (!Number.isSafeInteger(rows) || rows < 1) {
      throw new Error("robotics evaluation pool received a malformed population");
    }
    if (this.fallbackReason || this.workers.length < 2 || rows < 2) {
      const fallbackReason = this.fallbackReason
        ?? (this.workers.length < 2
          ? "fewer than two browser evaluation lanes are available"
          : "the population contains fewer than two candidates");
      if (this.fallbackReason) this.terminateWorkers();
      return {
        objectives: sequential(),
        lanes: 1,
        firstBatchVerified: this.verified,
        fallbackReason,
      };
    }

    try {
      const activeWorkers = Math.min(this.workers.length, rows);
      const requests: Array<Promise<{ start: number; objectives: Float64Array }>> = [];
      for (let lane = 0; lane < activeWorkers; lane++) {
        const start = Math.floor((lane * rows) / activeWorkers);
        const end = Math.floor(((lane + 1) * rows) / activeWorkers);
        const shard = policies.slice(
          start * this.config.dimension,
          end * this.config.dimension
        );
        requests.push(this.evaluateShard(this.workers[lane], start, shard));
      }
      const shards = await Promise.all(requests);
      const parallel = new Float64Array(rows);
      for (const shard of shards) parallel.set(shard.objectives, shard.start);

      if (!this.verified) {
        const reference = sequential();
        if (!exactObjectiveRowsMatch(parallel, reference)) {
          this.fallbackReason = "parallel/sequential objective mismatch";
          this.terminateWorkers();
          return {
            objectives: reference,
            lanes: 1,
            firstBatchVerified: false,
            fallbackReason: this.fallbackReason,
          };
        }
        this.verified = true;
      }
      return {
        objectives: parallel,
        lanes: activeWorkers,
        firstBatchVerified: this.verified,
        fallbackReason: null,
      };
    } catch (error) {
      this.fallbackReason = error instanceof Error ? error.message : String(error);
      this.terminateWorkers();
      return {
        objectives: sequential(),
        lanes: 1,
        firstBatchVerified: this.verified,
        fallbackReason: this.fallbackReason,
      };
    }
  }

  free(): void {
    this.terminateWorkers();
  }

  private evaluateShard(
    worker: Worker,
    start: number,
    policies: Float64Array
  ): Promise<{ start: number; objectives: Float64Array }> {
    const requestId = ++this.requestId;
    return new Promise((resolve, reject) => {
      const timeout = globalThis.setTimeout(() => {
        cleanup();
        reject(new Error("robotics evaluation worker timed out"));
      }, SHARD_TIMEOUT_MILLISECONDS);
      const cleanup = (): void => {
        globalThis.clearTimeout(timeout);
        worker.removeEventListener("message", onMessage);
        worker.removeEventListener("error", onError);
        worker.removeEventListener("messageerror", onMessageError);
      };
      const onMessage = (event: MessageEvent<ShardResponse>): void => {
        if (event.data.requestId !== requestId) return;
        cleanup();
        if (event.data.type === "error") {
          reject(new Error(event.data.message));
        } else {
          resolve({ start, objectives: event.data.objectives });
        }
      };
      const onError = (event: ErrorEvent): void => {
        event.preventDefault();
        cleanup();
        reject(new Error(event.message || "robotics evaluation worker failed"));
      };
      const onMessageError = (): void => {
        cleanup();
        reject(new Error("robotics evaluation worker returned an unreadable message"));
      };
      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);
      worker.addEventListener("messageerror", onMessageError);
      worker.postMessage(
        {
          type: "evaluate",
          requestId,
          model: this.config.model,
          config: this.config.config,
          policies,
        },
        [policies.buffer]
      );
    });
  }

  private terminateWorkers(): void {
    for (const worker of this.workers) worker.terminate();
    this.workers.length = 0;
  }
}
