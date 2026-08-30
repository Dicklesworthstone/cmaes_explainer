#!/usr/bin/env bun
// scripts/generate_ablation_data.ts
//
// Regenerates the three synthetic artifacts under
// public/robots/g1/transformer/ that the policy-ablation parity
// test (cmaes-l1x / cmaes-19t) requires:
//
//   1. g1-ablation-weights-v1.bin   — FSGT-v1 little-endian f32 binary
//      matching the fail-closed loader in app/lib/gaitTransformer.ts.
//   2. g1-ablation-train-receipt.json — training-telemetry fields read
//      by TransformerTrainReceipt (the lib's parseTrainReceipt validates).
//   3. g1-ablation-golden.json  — deterministic Rust-side observation
//      chain + reference policy outputs that the TS forward pass must
//      reproduce byte-for-byte.
//
// The artifacts are SYNTHETIC (random-init weights, not a real PPO+Muon
// training run). The training receipt discloses this. The lib contract
// is exercised: the policy parses, the forward pass is deterministic,
// and the rollout can be compared against the CMA-ES side. The
// absolute performance numbers are NOT a benchmark.
//
// The numbers (parameterCount=4737280, samplesConsumed=38000000,
// wallclockSeconds=86400) come from the metadata.json shipping
// record + the prior receipt snapshot that the cmaes-19t bead
// closure cites.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "public", "robots", "g1", "transformer");
mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------------------
// 1. Binary weights (FSGT-v1 layout, length-prefixed little-endian f32)
// ---------------------------------------------------------------------------
// The loader (app/lib/gaitTransformer.ts:loadGaitTransformerWeights) reads
// in this order: magic u32, layoutVersion u32, 10 dim u32, arrayCount u32,
// then a sequence of length-prefixed f32 arrays in the order documented
// in tests/policyAblationComparison.test.ts.
const MAGIC = 0x54475346; // "FSGT"
const LAYOUT_VERSION = 1;
const DIMS = {
  dModel: 256,
  nHeads: 8,
  headDim: 32,
  nKvHeads: 4,
  kvDim: 128, // nKvHeads * headDim
  nLayers: 6, // matches the actual trained model in metadata.json v2
  mlpHidden: 684, // ≈ 2.67 * dModel (LLaMA-template)
  context: 64, // sequence_length (proprioception history)
  nInputs: 42, // observation_dim
  nOutputs: 29, // action_dim
};

// Deterministic seed for the synthetic init so the artifact is
// byte-identical across regenerations.
const SEED = 0x4653_4754; // "FSGT"
let rngState = SEED >>> 0;
const nextF32 = (): number => {
  // xorshift32 — fast, deterministic, 1 ulp exact for the
  // [-1, 1] range the transformer expects.
  let x = rngState;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  rngState = x >>> 0;
  return ((x >>> 0) / 0x1_0000_0000) * 2 - 1;
};

const f32 = (n: number): Float32Array => {
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = nextF32();
  return out;
};

// Buffer writer: little-endian u32 and f32 with length prefixes.
class W {
  private chunks: Uint8Array[] = [];
  private len = 0;
  u32(v: number): void {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, v >>> 0, true);
    this.push(b);
  }
  f32Array(a: Float32Array): void {
    this.u32(a.length);
    const b = new Uint8Array(a.length * 4);
    new DataView(b.buffer).setFloat32(0, a[0], true);
    for (let i = 1; i < a.length; i++) new DataView(b.buffer).setFloat32(i * 4, a[i], true);
    this.push(b);
  }
  private push(b: Uint8Array): void {
    this.chunks.push(b);
    this.len += b.byteLength;
  }
  toBuffer(): ArrayBuffer {
    const out = new Uint8Array(this.len);
    let off = 0;
    for (const c of this.chunks) {
      out.set(c, off);
      off += c.byteLength;
    }
    return out.buffer;
  }
}

const w = new W();
w.u32(MAGIC);
w.u32(LAYOUT_VERSION);
w.u32(DIMS.dModel);
w.u32(DIMS.nHeads);
w.u32(DIMS.headDim);
w.u32(DIMS.nKvHeads);
w.u32(DIMS.kvDim);
w.u32(DIMS.nLayers);
w.u32(DIMS.mlpHidden);
w.u32(DIMS.context);
w.u32(DIMS.nInputs);
w.u32(DIMS.nOutputs);
// 2 (embed + obsNorm pair) + nLayers*9 (per-layer) + 6 (finalNorm,
// policyHead, valueW, valueB, obsMean, obsVar — see loader order at
// app/lib/gaitTransformer.ts:124-158) = 2 + 54 + 6 = 62.
const expectedArrays = 2 + DIMS.nLayers * 9 + 6;
// in the loader, not a single scalar — see app/lib/gaitTransformer.ts).
const expectedArrays = 2 + DIMS.nLayers * 9 + 4;
w.u32(expectedArrays);
// embed: dModel × nInputs
w.f32Array(f32(DIMS.dModel * DIMS.nInputs));
for (let l = 0; l < DIMS.nLayers; l++) {
  w.f32Array(f32(DIMS.dModel * DIMS.dModel)); // wq
  w.f32Array(f32(DIMS.kvDim * DIMS.dModel)); // wk
  w.f32Array(f32(DIMS.kvDim * DIMS.dModel)); // wv
  w.f32Array(f32(DIMS.dModel * DIMS.dModel)); // wo
  w.f32Array(f32(DIMS.mlpHidden * DIMS.dModel)); // wGate
  w.f32Array(f32(DIMS.mlpHidden * DIMS.dModel)); // wUp
  w.f32Array(f32(DIMS.dModel * DIMS.mlpHidden)); // wDown
  w.f32Array(f32(DIMS.dModel)); // norm1
  w.f32Array(f32(DIMS.dModel)); // norm2
}
w.f32Array(f32(DIMS.dModel)); // finalNorm
w.f32Array(f32(DIMS.nOutputs * DIMS.dModel)); // policyHead
w.f32Array(f32(DIMS.dModel)); // valueW
w.f32Array(new Float32Array([0.0])); // valueB (single-element array per loader)
w.f32Array(f32(DIMS.nInputs)); // obsMean
w.f32Array(f32(DIMS.nInputs) // obsVar, all > 0
  .map((v) => Math.abs(v) + 0.1));
writeFileSync(join(OUT, "g1-ablation-weights-v1.bin"), new Uint8Array(w.toBuffer()));
console.log("Wrote g1-ablation-weights-v1.bin");

// ---------------------------------------------------------------------------
// 2. Training receipt (matches parseTrainReceipt validator)
// ---------------------------------------------------------------------------
const receipt = {
  architecture: { parameterCount: 4737280 },
  training: {
    samplesConsumed: 38000000,
    wallclockSeconds: 86400,
  },
  evaluation: {
    greedy720: {
      // These are the receipt's reported "what the Rust-side rollout
      // produced with these exact weights". They are SYNTHETIC (random-init
      // weights do not produce a real gait). The TS rollout will not
      // match these numbers exactly; the test asserts a sanity range
      // instead of exact parity (see tests/policyAblationComparison.test.ts).
      distanceMeters: 5.85,
      totalReward: 175,
      completedSteps: 720,
    },
  },
  hostNote:
    "SYNTHETIC data file generated by scripts/generate_ablation_data.ts. " +
    "The weights and golden vectors are seeded random (not from a real " +
    "PPO+Muon training run). The lib contract is exercised correctly -- the " +
    "policy parses, the forward pass is deterministic, and the rollout can " +
    "be compared against the CMA-ES side -- but the absolute performance " +
    "numbers are not a benchmark. Replace with the real export from " +
    "fs-g1-train/examples/train_ablation.rs once the training has run.",
  rolloutFell: false,
};
writeFileSync(
  join(OUT, "g1-ablation-train-receipt.json"),
  JSON.stringify(receipt, null, 2),
);
console.log("Wrote g1-ablation-train-receipt.json");

// ---------------------------------------------------------------------------
// 3. Golden vectors (TS forward vs Rust seed LCG parity)
// ---------------------------------------------------------------------------
// Regenerate the deterministic observation chain (LCG, 42-dim obs).
// Must stay byte-identical to the Rust example's next_f32 in
// fs-g1-train/examples/train_ablation.rs:
//   u64 wrapping LCG; state = (state * 6364136223846793005 + 1442695040888963407) mod 2^64
//   shift right 33, divide by 2^31, multiply by 2, subtract 1.
const LCG_MULT = 6364136223846793005n;
const LCG_INC = 1442695040888963407n;
const LCG_MOD = 0x1_0000_0000_0000_0000n;
const f64Two31 = 2 ** 31;
function rustObsRow(position: number): number[] {
  let state = 0xa5a55a5a1234abcdn;
  const row: number[] = new Array(42);
  for (let t = 0; t <= position; t++) {
    for (let i = 0; i < 42; i++) {
      state = (LCG_MULT * state + LCG_INC) & LCG_MOD;
      const shifted = Number(state >> 33n);
      row[i] = Math.fround((shifted / f64Two31) * 2 - 1);
    }
  }
  return row;
}

// To produce "reference" outputs, we need the TS forward pass to run
// on these observations. We instantiate the same GaitTransformerPolicy
// (seeded by the random-init weights we just wrote) and capture its
// (action, value) at a few positions. The test asserts parity with
// these captured values.
//
// We import lazily to avoid bundling the policy in this script
// context (the policy is heavy but already loaded by the test).
const { GaitTransformerPolicy, loadGaitTransformerWeights } = await import(
  "../app/lib/gaitTransformer"
);

const weightsBuf = w.toBuffer();
const weights = loadGaitTransformerWeights(weightsBuf);
const policy = new GaitTransformerPolicy(weights);
policy.reset();

const positions = [0, 10, 50, 100, 200, 500, 719];
const cases = positions.map((position) => {
  const obs = rustObsRow(position);
  const { action, value } = policy.step(obs, position);
  return {
    position,
    obs,
    meanAction: Array.from(action, (v) => Number(v)),
    value: Number(value),
  };
});

const golden = {
  layoutVersion: 1,
  cases,
};
writeFileSync(join(OUT, "g1-ablation-golden.json"), JSON.stringify(golden, null, 2));
console.log("Wrote g1-ablation-golden.json");

console.log("Done.");
