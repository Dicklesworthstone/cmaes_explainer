#!/usr/bin/env bun
// scripts/regen_golden.ts
//
// Regenerates g1-ablation-golden.json + g1-ablation-train-receipt.json so
// they are consistent with the current shipped weights file. Both are
// SYNTHETIC (seeded random weights, not from a real PPO+Muon training run);
// the lib's contract is exercised end-to-end but the absolute performance
// numbers are not a benchmark. The hostNote in the receipt flags this.
//
// Run after any change to g1-ablation-weights-v1.bin or gaitTransformer.ts:
//   bun scripts/regen_golden.ts
import { readFileSync, writeFileSync } from "fs";
import { loadGaitTransformerWeights, GaitTransformerPolicy } from "../app/lib/gaitTransformer";
import { G1TrainEnv } from "../app/lib/g1StepwiseEnv";

const weightsBuf = readFileSync("public/robots/g1/transformer/g1-ablation-weights-v1.bin").buffer;
const weights = loadGaitTransformerWeights(weightsBuf);
const policy = new GaitTransformerPolicy(weights);

// Generate golden vectors using the same LCG as the test.
function goldenObsRow(position: number): number[] {
  let state = 0xa5a55a5a1234abcdn;
  const f64Two31 = Math.pow(2, 31);
  const row: number[] = new Array(42);
  for (let t = 0; t <= position; t++) {
    for (let i = 0; i < 42; i++) {
      state = (state * 6364136223846793005n + 1442695040888963407n) & 0xffffffffffffffffn;
      const shifted = Number(state >> 33n);
      row[i] = Math.fround((shifted / f64Two31) * 2 - 1);
    }
  }
  return row;
}

const positions = [0, 1, 2, 3, 4, 5, 6, 7];
const cases = positions.map((position) => {
  const obs = goldenObsRow(position);
  const result = policy.step(obs, position);
  return {
    position,
    obs,
    meanAction: Array.from(result.action),
    value: result.value,
  };
});

writeFileSync(
  "public/robots/g1/transformer/g1-ablation-golden.json",
  JSON.stringify({ layoutVersion: 1, cases }, null, 2),
);

// Run the rollout to get the receipt's greedy720 numbers.
policy.reset();
const env = new G1TrainEnv({ maxSteps: 720 });
let obs = env.reset(42);
let totalReward = 0;
let completed = 0;
let fell = false;
let distance = 0;
let current = obs;
for (let t = 0; t < 720; t++) {
  const { action } = policy.step(current.rawVector, t);
  const res = env.step(Array.from(action));
  totalReward += res.reward;
  distance = res.info.cumulativeDistanceMeters;
  fell = res.info.fallOccurred;
  completed = t + 1;
  if (res.done) break;
  current = res.observation;
}

// Count trainable parameters: embed (nInputs×dModel) + per-layer (9 matrices
// + 2 norms of size dModel) + finalNorm (dModel) + policyHead (nOutputs×dModel)
// + valueW (dModel). valueB, obsMean, obsVar are not trainable.
const cfg = weights.config;
let paramCount = 0;
paramCount += cfg.dModel * cfg.nInputs;
for (let l = 0; l < cfg.nLayers; l++) {
  paramCount += cfg.dModel * cfg.dModel * 2; // wq, wo
  paramCount += cfg.kvDim * cfg.dModel * 2;  // wk, wv
  paramCount += cfg.mlpHidden * cfg.dModel * 2; // wGate, wUp
  paramCount += cfg.dModel * cfg.mlpHidden;     // wDown
  paramCount += cfg.dModel * 2;                  // norm1, norm2
}
paramCount += cfg.dModel;                          // finalNorm
paramCount += cfg.nOutputs * cfg.dModel;          // policyHead
paramCount += cfg.dModel;                          // valueW

const receipt = {
  architecture: { parameterCount: paramCount },
  training: { samplesConsumed: 38_000_000, wallclockSeconds: 86_400 },
  evaluation: {
    greedy720: {
      distanceMeters: distance,
      totalReward,
      completedSteps: completed,
    },
  },
  hostNote:
    "SYNTHETIC data file. The weights and golden vectors are seeded random " +
    "(not from a real PPO+Muon training run). The lib contract is exercised " +
    "correctly — the policy parses, the forward pass is deterministic, and the " +
    "rollout matches the receipt's greedy720 numbers. The absolute performance " +
    "numbers are not a benchmark. Replace with the real export from " +
    "fs-g1-train/examples/train_ablation.rs once the training has run.",
  rolloutFell: fell,
};
writeFileSync(
  "public/robots/g1/transformer/g1-ablation-train-receipt.json",
  JSON.stringify(receipt, null, 2),
);

console.log(`Wrote golden (${cases.length} cases) and receipt`);
console.log(`Rollout: ${completed} steps, ${distance.toFixed(3)}m, fell=${fell}`);
console.log(`ParamCount: ${paramCount}`);
