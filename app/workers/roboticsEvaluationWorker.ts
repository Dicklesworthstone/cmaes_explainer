/// <reference lib="webworker" />

import {
  createFrankenSimG1WalkingEvaluator,
  createFrankenSimHouseholdManipulationEvaluator,
  type FrankenSimG1WalkingEvaluator,
  type FrankenSimHouseholdManipulationEvaluator,
  type G1WalkingConfig,
  type HouseholdManipulationConfig,
} from "../lib/frankensimCmaes";

type EvaluationRequest =
  | {
      type: "evaluate";
      requestId: number;
      model: "g1";
      config: G1WalkingConfig;
      policies: Float64Array;
    }
  | {
      type: "evaluate";
      requestId: number;
      model: "arm";
      config: HouseholdManipulationConfig;
      policies: Float64Array;
    };

type EvaluationResponse =
  | { type: "result"; requestId: number; objectives: Float64Array }
  | { type: "error"; requestId: number; message: string };

const worker = self as DedicatedWorkerGlobalScope;
let evaluatorKey = "";
let g1Evaluator: FrankenSimG1WalkingEvaluator | null = null;
let armEvaluator: FrankenSimHouseholdManipulationEvaluator | null = null;

function requireOk<T>(
  result: { ok: T } | { refusal: { name: string; detail: number | null } },
  label: string
): T {
  if ("ok" in result) return result.ok;
  const suffix = result.refusal.detail === null ? "" : ` (detail ${result.refusal.detail})`;
  throw new Error(`${label}: ${result.refusal.name}${suffix}`);
}

async function evaluate(request: EvaluationRequest): Promise<Float64Array> {
  const key = `${request.model}:${JSON.stringify(request.config)}`;
  if (key !== evaluatorKey) {
    g1Evaluator?.free();
    armEvaluator?.free();
    g1Evaluator = null;
    armEvaluator = null;
    evaluatorKey = key;
  }
  if (request.model === "g1") {
    g1Evaluator ??= requireOk(
      await createFrankenSimG1WalkingEvaluator(request.config),
      "parallel G1 admission"
    );
    return requireOk(g1Evaluator.evaluatePopulation(request.policies), "parallel G1 evaluation");
  }
  armEvaluator ??= requireOk(
    await createFrankenSimHouseholdManipulationEvaluator(request.config),
    "parallel arm admission"
  );
  return requireOk(armEvaluator.evaluatePopulation(request.policies), "parallel arm evaluation");
}

worker.onmessage = (event: MessageEvent<EvaluationRequest>) => {
  const request = event.data;
  void evaluate(request).then(
    (objectives) => {
      const response: EvaluationResponse = { type: "result", requestId: request.requestId, objectives };
      worker.postMessage(response, [objectives.buffer]);
    },
    (error: unknown) => {
      const response: EvaluationResponse = {
        type: "error",
        requestId: request.requestId,
        message: error instanceof Error ? error.message : String(error),
      };
      worker.postMessage(response);
    }
  );
};

export {};
