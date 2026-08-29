# G1 transformer policy (ONNX)

This directory hosts the trained transformer policy for the G1 walking
flagship, exported to ONNX. The on-disk contract:

- **`model.onnx`** — the exported transformer. Float32 IO, dynamic batch axis
  for `actions`, fixed `sequence_length=64` for `observations` (the
  64-step proprioception history). If this file is absent, the browser
  badge shows "transformer (not yet exported)" and the worker fails
  closed; the existing residual-policy sources are unaffected.
- **`metadata.json`** — sibling provenance file (kernel refusal envelope
  parity with the existing `frankensimCmaes.ts` admission pattern):
  - `obs_layout` — the 42-signal proprioception vector order, exactly as
    the worker packs it before passing to the kernel.
  - `action_scaling` — the per-actuator scale from `[-1, 1]` (transformer
    output) to the kernel's joint-target units.
  - `joint_limits` — the source-of-truth limits; the policy must not
    request anything outside them.
  - `trained_at_commit` — the git commit the model was trained from.
  - `trained_objective` — the multi-factor objective (cmaes-0m3) value
    on the standard terrain-and-push experiment.
  - `seeds` — the Philox seeds used during training; the live replay
    must use the same seeds for an honest side-by-side.
- **`README.md`** — this file.

## Browser load path

`app/workers/g1OptimizationWorker.ts` (TealCardinal's territory per
`cmaes-pvz`) gains a `transformer` trace origin. The contract:

1. Capability-probe `onnxruntime-web` (loaded from a CDN pinned to the
   version in `package.json`).
2. Fetch `/robots/g1/transformer/model.onnx` and the sibling
   `metadata.json` (both fail closed if either is missing or invalid).
3. Validate the obs layout + joint limits against the admitted
   evaluator's packet fields.
4. Run the transformer in the SAME admission/receipt envelope as the
   residual-policy sources: the kernel refuses anything outside
   `completion criteria`; the receipt must include all per-channel
   integrals (actuatorWorkJoules, slipIntegral, etc.) for the
   multi-factor objective to be honest.
5. Post the trace with `family: "transformer"` and the same
   `G1TraceReceipt` shape used by `stabilizer` and `curriculum`.

The UI in `G1WalkingFlagship.tsx` gains the corresponding
`"transformer (GPU-trained)"` badge next to the existing
`"walking curriculum mean"` and `"LM-CMA (live)"` badges. The badge
shows `"transformer (not yet exported)"` (amber, not cyan) when the
.onnx is absent, so the user always knows the provenance.

## Honesty

Per the project's existing kernel refusal pattern: this third policy
source MUST NOT silently label a TS fallback as a real transformer
inference. If the load or the inference produces non-finite outputs,
or the metadata is inconsistent with the kernel's packet shape, the
worker emits a `type: "error"` and the UI shows the amber badge. The
existing residual-policy sources (CMA-ES families, stabilizer,
curriculum mean) are not affected.

## Training pipeline (out of scope here)

- The transformer architecture is the GLM-shrunk micro-model per
  `RESEARCH_G1_LEARNING.md §3.2` and `cmaes-wsr`.
- The training crate (cmaes-j36, cmaes-wsr, cmaes-6m3, cmaes-6zi) is
  in `frankensim/crates/`. When it lands, the export script
  `scripts/export_g1_transformer_onnx.py` (to be authored) reads
  the trained weights, runs the GLM-shrunk forward pass, and emits
  this directory's payload.

## Provenance citation

- GLM-4.5/5 series (Zhipu/Z.ai): open-weight MoE; the shrunk
  recipe (RMSNorm/SwiGLU/RoPE/GQA) follows the LLaMA-template
  decoder family.
- LocoFormer (arXiv 2509.23745, 2025) for the long-context
  proprioception policy pattern that motivates 64-step history.
- Muon (arXiv 2509.24406, 2026) for the optimizer split that the
  training crate uses to fit this scale.
