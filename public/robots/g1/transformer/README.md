# G1 transformer policy (trained, exported)

This directory hosts the REAL trained transformer policy used by the policy
architecture ablation (`app/components/PolicyAblationComparison.tsx`).
Nothing here is synthesized; if the weight file is missing, the ablation
panel reports an error instead of faking numbers.

## Artifacts

- **`g1-ablation-weights-v1.bin`** — the trained parameters, exported by
  `frankensim/crates/fs-g1-train/examples/train_ablation.rs` as a
  length-prefixed little-endian f32 dump (layout version 1, magic `FSGT`,
  per-array lengths for fail-closed loading).
- **`g1-ablation-train-receipt.json`** — REAL training provenance:
  architecture + exact parameter count, samples consumed, wallclock (host
  note included), learning-curve summary, and greedy-rollout metrics at
  240 steps (training horizon) and 720 steps (flagship horizon) from the
  RELOADED weight file.
- **`g1-ablation-golden.json`** — deterministic forward outputs of the
  reloaded weight file; `tests/policyAblationComparison.test.ts` checks the
  TypeScript forward pass against these (1e-3 abs; JS accumulates in f64,
  Rust in f32).
- **`metadata.json`** — architecture facts, obs layout (42 signals), action
  scaling, joint limits, and seed chain.
- **`README.md`** — this file.

## Architecture (matches the training crate `fs-g1-train/src/transformer.rs`)

Causal decoder: d_model 256, 4 layers, 8 query heads / 4 KV heads (GQA,
head_dim 32), SwiGLU MLP 682, RMSNorm (eps 1e-6), RoPE (base 10000),
context 64, obs 42 → actions 29, tanh policy head + linear value head.
**2,902,273 parameters.**

## Training

PPO (clipped surrogate + GAE) with the Muon/Adam optimizer split, run
natively (Apple M4, single thread) on `StandinEnv` — an exact Rust port of
`app/lib/g1StepwiseEnv.ts` with full 240-step episodes. Exact sample counts
and wallclock live in the training receipt; the same receipt's Rust-side
greedy metrics are cross-checked against the browser rollout in tests
(behavior-level parity, 0.25 m tolerance for the f32/f64 path split).

## Browser load path

`app/lib/gaitTransformer.ts` loads the weight file with a fail-closed
parser (magic/version/dims/array-length validation — any mismatch throws),
then runs sequential `forward_step` inference with a windowed KV cache,
mirroring the Rust math op-for-op. The ablation component resolves the
promise to a measured panel; on failure it shows an error, never a
fabricated receipt.

## Honesty

Per the project's kernel-refusal pattern: the ablation panel MUST NOT
silently label anything as transformer inference without the real weight
file. The loader and the panel both fail closed. The old "synthesized
comparison" receipts were removed when this export landed.

## Provenance citation

- Training crate + gradcheck oracle tests: `fs-g1-train`
  (transformer backward verified against central finite differences).
- HLT (arXiv 2303.03381) / LocoFormer (arXiv 2509.23745) for the causal
  history-policy pattern behind the 64-step context.
- Muon (arXiv 2509.24406) for the optimizer split.
