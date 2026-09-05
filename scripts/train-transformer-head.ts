/**
 * Train the transformer's policy head on the environment's own reward.
 *
 * fit-transformer-head.ts gave the artifact a head by cloning the CMA-ES
 * phase-prior gait. That made it move (6.63 m against the reference's 7.05 m),
 * but a cloned policy can only approach what it copied, so the obvious question
 * — can the transformer do BETTER than the hand-designed prior? — stayed
 * unanswered. Cloning cannot answer it. Search can.
 *
 * This runs an evolution strategy (antithetic sampling, rank-shaped weights)
 * directly on the environment's cumulative reward, starting from the distilled
 * head. Only the 15 driven actuator rows are searched — 15 x 256 = 3,840
 * parameters — and the 2.9M-parameter trunk stays frozen throughout, so what
 * improves is the readout of features the trunk already computes.
 *
 * Why this is a fair comparison and not a rigged one: the phase prior is
 * searched by CMA-ES on the same environment, the same reward, and the same
 * episode length, and both budgets are printed. The transformer's advantage, if
 * it has one, comes from seeing the full 42-D observation history through the
 * trunk rather than 7 hand-picked phase features.
 *
 *   bun run scripts/train-transformer-head.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { G1TrainEnv } from "../app/lib/g1StepwiseEnv";
import {
  GaitTransformerPolicy,
  loadGaitTransformerWeights,
} from "../app/lib/gaitTransformer";

const WEIGHTS_IN = "public/robots/g1/transformer/g1-ablation-weights-v2.bin";
const WEIGHTS_OUT = "public/robots/g1/transformer/g1-ablation-weights-v3.bin";

const D_MODEL = 256;
const DRIVEN_ACTUATORS = 15;
const SEARCH_DIM = DRIVEN_ACTUATORS * D_MODEL;

/** Antithetic pairs per iteration; the population is twice this. */
const PAIRS = 8;
const ITERATIONS = Number(process.env.ITERATIONS ?? 120);
const TRAIN_STEPS = 240;
const EVAL_STEPS = 720;
/** Perturbation scale, relative to the distilled head's own magnitude. */
const SIGMA_REL = 0.06;
const LEARNING_RATE = 0.35;

interface Artifact {
  raw: Uint8Array;
  headOffset: number;
  headLength: number;
}

/** Locate the policy head inside the artifact without disturbing anything else. */
function openArtifact(path: string): Artifact {
  const raw = new Uint8Array(readFileSync(path));
  const view = new DataView(raw.buffer);
  let off = 8 + 10 * 4;
  const arrayCount = view.getUint32(off, true);
  off += 4;
  const headIndex = 1 + 4 * 9 + 1; // embed, 4 layers x 9, finalNorm, then head
  let headOffset = -1;
  let headLength = 0;
  for (let i = 0; i < arrayCount; i++) {
    const len = view.getUint32(off, true);
    off += 4;
    if (i === headIndex) {
      headOffset = off;
      headLength = len;
    }
    off += len * 4;
  }
  if (headOffset < 0) throw new Error("policy head not found in artifact");
  return { raw, headOffset, headLength };
}

function readHead(a: Artifact): Float64Array {
  const view = new DataView(a.raw.buffer);
  const out = new Float64Array(a.headLength);
  for (let i = 0; i < a.headLength; i++) out[i] = view.getFloat32(a.headOffset + i * 4, true);
  return out;
}

function writeHead(a: Artifact, head: Float64Array): void {
  const view = new DataView(a.raw.buffer);
  for (let i = 0; i < a.headLength; i++) view.setFloat32(a.headOffset + i * 4, head[i], true);
}

/** Deterministic normal draws, so a run is reproducible from its seed. */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    const u = (s >>> 8) / 16777216;
    s = (s * 1664525 + 1013904223) >>> 0;
    const v = (s >>> 8) / 16777216;
    return Math.sqrt(-2 * Math.log(u + 1e-12)) * Math.cos(2 * Math.PI * v);
  };
}

function episodeReward(
  policy: GaitTransformerPolicy,
  seed: number,
  steps: number,
): { reward: number; distance: number } {
  const env = new G1TrainEnv();
  let obs = env.reset(seed);
  policy.reset();
  let reward = 0;
  let distance = 0;
  for (let t = 0; t < steps; t++) {
    const action = policy.step(obs.rawVector, t).action;
    const result = env.step(Array.from(action).slice(0, DRIVEN_ACTUATORS));
    obs = result.observation;
    reward = result.info.cumulativeReward;
    distance = result.info.cumulativeDistanceMeters;
    if (result.done) break;
  }
  return { reward, distance };
}

async function main(): Promise<void> {
  const artifact = openArtifact(WEIGHTS_IN);
  const head = readHead(artifact);

  // Scale the perturbation to the distilled head's own magnitude so the search
  // starts proportionate to the solution it is refining.
  let rms = 0;
  for (let i = 0; i < SEARCH_DIM; i++) rms += head[i] * head[i];
  rms = Math.sqrt(rms / SEARCH_DIM);
  const sigma = Math.max(1e-4, SIGMA_REL * rms);
  console.log(`head rms=${rms.toFixed(5)} sigma=${sigma.toFixed(5)} dim=${SEARCH_DIM}`);

  const scratch = openArtifact(WEIGHTS_IN);
  const evaluate = (candidate: Float64Array, seed: number, steps: number) => {
    writeHead(scratch, candidate);
    const policy = new GaitTransformerPolicy(
      loadGaitTransformerWeights(scratch.raw.buffer as ArrayBuffer),
    );
    return episodeReward(policy, seed, steps);
  };

  // Held-out seeds the search never trains on, averaged: a single episode is
  // easy to overfit and would flatter whatever the last iteration happened to
  // suit.
  const HELD_OUT_SEEDS = [1234, 8675, 24601];
  const heldOut = (candidate: Float64Array) => {
    let distance = 0;
    let reward = 0;
    for (const seed of HELD_OUT_SEEDS) {
      const r = evaluate(candidate, seed, EVAL_STEPS);
      distance += r.distance / HELD_OUT_SEEDS.length;
      reward += r.reward / HELD_OUT_SEEDS.length;
    }
    return { distance, reward };
  };

  const baseline = heldOut(head);
  console.log(
    `start: ${baseline.distance.toFixed(3)} m mean over ${HELD_OUT_SEEDS.length} held-out seeds`,
  );

  const rng = makeRng(20260905);
  const theta = Float64Array.from(head);
  const noise = new Float64Array(SEARCH_DIM);
  const grad = new Float64Array(SEARCH_DIM);
  const plus = Float64Array.from(head);
  const minus = Float64Array.from(head);
  let episodes = 1;

  for (let iter = 1; iter <= ITERATIONS; iter++) {
    grad.fill(0);
    // A fresh seed each iteration: the policy must walk from varied starts, not
    // memorise one episode.
    const seed = 5_000 + iter * 13;
    const scored: { f: number; sign: number; draw: Float64Array }[] = [];
    for (let p = 0; p < PAIRS; p++) {
      for (let i = 0; i < SEARCH_DIM; i++) noise[i] = rng();
      for (let i = 0; i < SEARCH_DIM; i++) {
        plus[i] = theta[i] + sigma * noise[i];
        minus[i] = theta[i] - sigma * noise[i];
      }
      const fPlus = evaluate(plus, seed, TRAIN_STEPS).reward;
      const fMinus = evaluate(minus, seed, TRAIN_STEPS).reward;
      episodes += 2;
      scored.push({ f: fPlus, sign: +1, draw: Float64Array.from(noise) });
      scored.push({ f: fMinus, sign: -1, draw: Float64Array.from(noise) });
    }
    // Rank shaping: centred weights over the sorted population, which keeps the
    // step scale independent of the reward's units and outliers.
    scored.sort((a, b) => b.f - a.f);
    const n = scored.length;
    for (let r = 0; r < n; r++) {
      const weight = (n - 1 - 2 * r) / (n - 1);
      const s = scored[r];
      const scale = weight * s.sign;
      for (let i = 0; i < SEARCH_DIM; i++) grad[i] += scale * s.draw[i];
    }
    // Step proportional to sigma rather than 1/sigma: with rank-shaped weights
    // the gradient estimate is already scale-free, so this keeps the step
    // proportionate to the perturbation that produced it and stays stable when
    // sigma is small relative to the head.
    const step = (LEARNING_RATE * sigma) / n;
    for (let i = 0; i < SEARCH_DIM; i++) theta[i] += step * grad[i];

    if (iter % 10 === 0 || iter === ITERATIONS) {
      const held = heldOut(theta);
      console.log(
        `  iter ${String(iter).padStart(3)}  held-out ${held.distance.toFixed(3)} m  reward ${held.reward.toFixed(1)}  (${episodes} episodes)`,
      );
    }
  }

  const final = heldOut(theta);
  console.log("");
  console.log(`distilled head : ${baseline.distance.toFixed(3)} m`);
  console.log(`trained head   : ${final.distance.toFixed(3)} m   (${episodes} episodes)`);
  if (final.distance > baseline.distance) {
    writeHead(artifact, theta);
    writeFileSync(WEIGHTS_OUT, artifact.raw);
    console.log(`wrote ${WEIGHTS_OUT}`);
  } else {
    console.log("no improvement over the distilled head; nothing written");
  }
}

await main();
