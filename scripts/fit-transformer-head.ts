/**
 * Give the committed transformer a working policy head.
 *
 * The artifact under public/robots/g1/transformer/ is a real 2.9 M-parameter
 * causal transformer whose 4-layer trunk is fully populated — and whose 29x256
 * output layer is entirely zero. tanh(0 . h) = 0 for every actuator, so the
 * policy emits no action and the robot cannot move. That is the whole reason
 * the ablation panel reported a zero-distance "honest measured failure": not a
 * finding about transformers, just a missing output layer.
 *
 * This fits that layer, and only that layer. The trunk, the value head and the
 * observation normalisation are copied through byte-for-byte. The head is
 * ridge-regressed to reproduce the actions of the phase-prior policy that
 * CMA-ES trains on this same environment — behaviour cloning with a frozen
 * encoder, which is a convex least-squares problem with an exact solution.
 *
 * What this does and does not claim: the transformer is not trained here, and
 * this is not evidence that a transformer beats CMA-ES. It is the committed
 * trunk plus a head fitted to a gait CMA-ES found, which makes the artifact
 * ACT instead of sitting at zero. The measured distance it achieves is printed
 * at the end and is the only claim worth making about it.
 *
 *   bun run scripts/fit-transformer-head.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { G1TrainEnv } from "../app/lib/g1StepwiseEnv";
import {
  GaitTransformerPolicy,
  loadGaitTransformerWeights,
} from "../app/lib/gaitTransformer";
import { runCmaesPolicySearch } from "../app/lib/cmaesAblationPolicy";

const WEIGHTS_IN = "public/robots/g1/transformer/g1-ablation-weights-v1.bin";
const WEIGHTS_OUT = "public/robots/g1/transformer/g1-ablation-weights-v2.bin";

/** Actuators the environment actually drives; the rest stay at zero. */
const ACTUATOR_COUNT = 15;
const FEATURE_COUNT = 7;
/** Ridge coefficient. Small: the design matrix is well conditioned at this size. */
const RIDGE = 1e-3;
/** tanh saturates; clamp targets so atanh stays finite and the fit stays sane. */
const TANH_CLAMP = 0.999;

/** The phase-basis features the ablation policy uses, rebuilt here verbatim. */
function buildFeatures(obs: {
  phaseSin: number;
  phaseCos: number;
  baseOrientationRpy: number[];
}): number[] {
  const phiSin = obs.phaseSin;
  const phiCos = obs.phaseCos;
  // sin(2phi) and cos(2phi) from the single-angle pair, no atan2 needed.
  const sin2 = 2 * phiSin * phiCos;
  const cos2 = phiCos * phiCos - phiSin * phiSin;
  return [1, phiSin, phiCos, sin2, cos2, obs.baseOrientationRpy[0], obs.baseOrientationRpy[1]];
}

function applyPhasePolicy(genotype: number[], features: number[]): number[] {
  const action = new Array<number>(ACTUATOR_COUNT).fill(0);
  for (let j = 0; j < ACTUATOR_COUNT; j++) {
    let acc = 0;
    const base = j * FEATURE_COUNT;
    for (let k = 0; k < FEATURE_COUNT; k++) acc += genotype[base + k] * features[k];
    action[j] = Math.tanh(acc);
  }
  return action;
}

/** Cholesky solve for a symmetric positive-definite system, in place. */
function solveSpd(a: Float64Array, b: Float64Array, n: number): Float64Array {
  const l = new Float64Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = a[i * n + j];
      for (let k = 0; k < j; k++) sum -= l[i * n + k] * l[j * n + k];
      if (i === j) {
        if (sum <= 0) throw new Error("design matrix is not positive definite");
        l[i * n + i] = Math.sqrt(sum);
      } else {
        l[i * n + j] = sum / l[j * n + j];
      }
    }
  }
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let sum = b[i];
    for (let k = 0; k < i; k++) sum -= l[i * n + k] * y[k];
    y[i] = sum / l[i * n + i];
  }
  const x = new Float64Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let sum = y[i];
    for (let k = i + 1; k < n; k++) sum -= l[k * n + i] * x[k];
    x[i] = sum / l[i * n + i];
  }
  return x;
}

/** Roll one episode, returning the distance the environment reports. */
function rollout(
  act: (obs: ReturnType<G1TrainEnv["reset"]>, step: number) => number[],
  seed: number,
  steps: number,
): number {
  const env = new G1TrainEnv();
  let obs = env.reset(seed);
  let distance = 0;
  for (let t = 0; t < steps; t++) {
    const result = env.step(act(obs, t));
    obs = result.observation;
    distance = result.info.cumulativeDistanceMeters;
    if (result.done) break;
  }
  return distance;
}

async function main(): Promise<void> {
  const dModel = 256;
  const nOutputs = 29;
  const episodeSteps = 720;

  console.log("1. Training the phase-prior reference with CMA-ES on the same env…");
  const search = runCmaesPolicySearch({ seed: 7, budgetEvaluations: 4_000, finalSteps: episodeSteps });
  const genotype = search.bestGenotype;
  const referenceDistance = rollout(
    (obs) => applyPhasePolicy(genotype, buildFeatures(obs)),
    1234,
    episodeSteps,
  );
  console.log(`   reference gait walks ${referenceDistance.toFixed(3)} m`);

  console.log("2. Collecting trunk features along that gait…");
  const raw = new Uint8Array(readFileSync(WEIGHTS_IN));
  const weights = loadGaitTransformerWeights(raw.buffer as ArrayBuffer);
  const policy = new GaitTransformerPolicy(weights);

  // Normal equations, accumulated so nothing large is held in memory.
  const gram = new Float64Array(dModel * dModel);
  const rhs = new Float64Array(ACTUATOR_COUNT * dModel);
  let samples = 0;
  for (let episode = 0; episode < 12; episode++) {
    const env = new G1TrainEnv();
    let obs = env.reset(1_000 + episode * 17);
    policy.reset();
    for (let t = 0; t < episodeSteps; t++) {
      // Advance the transformer over the same observation the reference sees,
      // so its features describe this trajectory.
      policy.step(obs.rawVector, t);
      const h = policy.hiddenState();
      const target = applyPhasePolicy(genotype, buildFeatures(obs));
      for (let i = 0; i < dModel; i++) {
        const hi = h[i];
        for (let j = i; j < dModel; j++) gram[i * dModel + j] += hi * h[j];
      }
      for (let o = 0; o < ACTUATOR_COUNT; o++) {
        const clamped = Math.max(-TANH_CLAMP, Math.min(TANH_CLAMP, target[o]));
        const z = Math.atanh(clamped);
        for (let i = 0; i < dModel; i++) rhs[o * dModel + i] += h[i] * z;
      }
      samples++;
      const result = env.step(target);
      obs = result.observation;
      if (result.done) break;
    }
  }
  // Mirror the upper triangle and add the ridge term.
  for (let i = 0; i < dModel; i++) {
    for (let j = i + 1; j < dModel; j++) gram[j * dModel + i] = gram[i * dModel + j];
    gram[i * dModel + i] += RIDGE * samples;
  }
  console.log(`   ${samples.toLocaleString()} samples`);

  console.log("3. Solving the head by ridge regression…");
  const head = new Float32Array(nOutputs * dModel);
  for (let o = 0; o < ACTUATOR_COUNT; o++) {
    const w = solveSpd(gram, rhs.subarray(o * dModel, (o + 1) * dModel), dModel);
    for (let i = 0; i < dModel; i++) head[o * dModel + i] = w[i];
  }

  console.log("4. Writing the artifact with the trunk untouched…");
  // The head is one length-prefixed f32 array inside the file. Locate it by
  // walking the same array order the loader uses, then overwrite in place so
  // every other byte is preserved exactly.
  const view = new DataView(raw.buffer);
  let off = 8 + 10 * 4; // magic + layoutVersion + 10 dims
  const arrayCount = view.getUint32(off, true);
  off += 4;
  const nLayers = 4;
  const headIndex = 1 + nLayers * 9 + 1; // embed, layers, finalNorm, then the head
  let headOffset = -1;
  for (let i = 0; i < arrayCount; i++) {
    const len = view.getUint32(off, true);
    off += 4;
    if (i === headIndex) {
      if (len !== head.length) throw new Error(`head slot is ${len}, expected ${head.length}`);
      headOffset = off;
    }
    off += len * 4;
  }
  if (headOffset < 0) throw new Error("could not locate the policy head in the artifact");
  for (let i = 0; i < head.length; i++) view.setFloat32(headOffset + i * 4, head[i], true);
  writeFileSync(WEIGHTS_OUT, raw);

  console.log("5. Measuring the fitted transformer driving the environment…");
  const fitted = new GaitTransformerPolicy(
    loadGaitTransformerWeights(raw.buffer as ArrayBuffer),
  );
  fitted.reset();
  let step = 0;
  const transformerDistance = rollout(
    (obs) => Array.from(fitted.step(obs.rawVector, step++).action).slice(0, ACTUATOR_COUNT),
    1234,
    episodeSteps,
  );
  console.log("");
  console.log(`   reference (phase prior, CMA-ES): ${referenceDistance.toFixed(3)} m`);
  console.log(`   transformer with fitted head   : ${transformerDistance.toFixed(3)} m`);
  console.log(`   wrote ${WEIGHTS_OUT}`);
}

await main();
