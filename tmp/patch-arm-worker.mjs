#!/usr/bin/env node
// Arm worker: long-run cap (20 -> 1500) + optimizer-state continuation +
// progress throttle. Content-anchored, loud failures, idempotent-ish.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/workers/armOptimizationWorker.ts";
let src = readFileSync(FILE, "utf8");

// 1. Request type: optional mode on optimize.
if (!src.includes('mode?: "continue" | "fresh"')) {
  const before = "seedIndex: number;\n    }";
  const i = src.indexOf(before);
  if (i < 0) throw new Error("optimize request type anchor not found");
  src = src.slice(0, i) + 'seedIndex: number;\n      mode?: "continue" | "fresh";\n    }' + src.slice(i + before.length);
  console.log("request type: mode added");
}

// 2. Dispatch passthrough (both optimize sites: single + task-aware).
const dispatchOld = ": optimize(request.task, request.family, request.generations, request.seedIndex);";
const dispatchNew = ": optimize(request.task, request.family, request.generations, request.seedIndex, request.mode);";
if (src.includes(dispatchOld)) {
  src = src.replace(dispatchOld, dispatchNew);
  console.log("dispatch: mode passed");
} else {
  console.log("WARN: dispatch passthrough not applied (check signature)");
}

// 3. Raise the optimize cap.
src = src.replace(
  "const generations = Math.max(2, Math.min(20, Math.trunc(requestedGenerations)));",
  "const generations = Math.max(2, Math.min(1500, Math.trunc(requestedGenerations)));"
);

// 4. Continuation: active-run map + refactor of optimize().
const type_block = `
type ArmEvaluator = Awaited<ReturnType<typeof createFrankenSimHouseholdManipulationEvaluator>>;
type ArmCmaSession = Awaited<ReturnType<typeof createFrankenSimCmaFamilySession>>;

// Continuable runs keyed "task:family:seed" — same lifetime contract as the
// G1 worker: the CMA session (mean/sigma/path) survives across requests so
// the Optimize control extends a run instead of restarting it.
type ArmActiveRun = {
  session: ArmCmaSession;
  evaluator: ArmEvaluator;
  pool: RoboticsEvaluationPool;
  bestPolicy: Float64Array;
  bestObjective: number;
  completedGeneration: number;
  maxTotalGenerations: number;
};
const ARM_MAX_TOTAL_GENERATIONS = 1_500;
const armActiveRuns = new Map<string, ArmActiveRun>();

function armFreeRun(run: ArmActiveRun): void {
  try {
    run.session.free();
  } catch {
    // prior lifecycle path already freed
  }
  try {
    run.pool.free();
  } catch {
    // ditto
  }
}
`;
const typeAnchor = "const worker = self as DedicatedWorkerGlobalScope;";
const ti = src.indexOf(typeAnchor);
if (ti < 0) throw new Error("worker self anchor not found");
src = src.slice(0, ti) + type_block + "\n" + src.slice(ti);

writeFileSync(FILE, src);
console.log("PART 1 OK (type + request + cap + map)");
