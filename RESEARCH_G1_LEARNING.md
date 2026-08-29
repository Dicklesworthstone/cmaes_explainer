# Research: Lie-Structured CMA-ES vs. a Tiny Transformer Policy for the G1 Walker

*Status: research document (2026-08-29). Grounded in this repo's actual source
(`fs-dfo`, `fs-ga`, `fs-mbd`, `fs-cmaes-viz-wasm`) plus the cited literature.
Every claim about this repo was verified against the working tree.*

---

## 1. Executive summary

1. **The current CMA-ES is already the theoretically right tool for the space
   it searches.** `fs-dfo/src/cma.rs` implements CMA-ES as *natural-gradient
   IGO on the Gaussian statistical manifold* — the module header states the
   Hansen couplings "ARE the natural-gradient couplings on the Gaussian
   statistical manifold" (rank-µ + rank-1 updates, CSA, keyed Philox
   determinism, cyclic-Jacobi eigendecomposition). "Add Lie theory to CMA-ES"
   is therefore already half-true: IGO *is* the Riemannian/natural-gradient
   construction on the distribution manifold.
2. **Lie theory is load-bearing exactly where the group structure physically
   exists** — `fs-ga/src/lie.rs` provides validated SO(3)/SE(3) façades over
   geometric-algebra motors: exp/log maps, Lie brackets, adjoints,
   space/body perturbation conventions, twists/wrenches with dual pairing,
   unit-norm admission at the boundary (4e-12). `fs-mbd` consumes these for
   the free-floating base and every link pose. This is the correct separation:
   rotations live in the dynamics, not in the optimizer's parameter vector.
3. **The learned policy is currently a linear residual map**: 15 actuators ×
   336 features (42 raw signals × 8 phase-basis functions) = 5,040 weights,
   dot-product per actuator plus tanh saturation (`G1ResidualPolicy` in
   `fs-mbd/src/robot_models.rs`). CMA-ES adapts these 5,040 weights. A linear
   policy on a hand-designed periodic basis is a *strong, sample-efficient
   prior* — and a strict function-class ceiling.
4. **The proposed research bet**: replace the linear residual map with a tiny
   GLM-style transformer (RMSNorm + SwiGLU + RoPE + GQA, ~1–10M params) that
   consumes raw proprioception history and outputs joint targets — **learned
   from scratch, no phase basis, no Lie-structured features**. Train it with
   gradient methods (Muon for hidden layers, Adam for embed/head/norm — the
   modern split) on GPU-parallel rollouts; use CMA-ES where it is genuinely
   strongest: as the **outer hyperparameter optimizer** (population over
   reward weights, LR, sigma, entropy coefficients).
5. **Measured in-browser budget** (this machine, under load): the whole-body
   30-link rollout costs ~5–17 s/generation (16–36 rollouts × 720 steps ×
   480 Hz). Thousands of CMA-ES generations = many hours to days per session
   in a browser worker. Gradient training on GPU-parallel rollouts is the
   difference between days and minutes — which is *why* the transformer
   route needs the GPU inner loop.

---

## 2. Audit: where Lie theory lives today (verified from source)

| Layer | File | What it does | Lie-theoretic status |
|---|---|---|---|
| CMA-ES core | `fs-dfo/src/cma.rs` | Sample → rank → tell; rank-µ/rank-1 covariance, CSA, BIPOP restarts; keyed Philox RNG; Jacobi eigendecomposition cadence | **Natural-gradient IGO** on the Gaussian family — the mathematically canonical choice for a Euclidean parameter space |
| Optimizer surface | `fs-cmaes-viz-wasm/src/lib.rs` | `ask_packet` / `tell_packet`, family sessions (Full/Separable/LM-CMA/LM-MA) with refusal envelopes | Separable/diagonal + low-memory (LM) variants are the standard scalable approximations for n=5,040 |
| Kinematics/dynamics | `fs-ga/src/lie.rs` | SO(3)/SE(3) over PGA motors; `ad()`, `bracket()`, `Exp`, `log`, twists `[angular, linear]`, wrenches dual | Textbook Lie-group machinery with validated boundary admission |
| Walking model | `fs-mbd/src/robot_models.rs`, `fs-cmaes-viz-wasm/src/g1_walking.rs` | `G1ResidualPolicy` (linear, 5,040-D), phase basis, tanh saturation, terrain-and-push experiment | No Lie structure in the policy — joints are R^15; the base pose integration is where SE(3) is exercised |

**Verdict on "is it optimal/smartest?":** For the current factorization
(*linear residual policy in R^5,040 searched by CMA-ES*), yes — with one nuance
below.

- Euclidean CMA-ES on network weights is exactly what the natural-gradient
  view prescribes when the parameter manifold is R^n. There are no quaternion
  or SE(3) parameters in the optimized vector, so tangent-space sampling and
  geodesic means (the usual Lie-CMA machinery) have nothing to act on.
- The nuance: the *observation* contains body orientation (quaternion) and
  the *dynamics* integrate the base in SE(3) — Lie theory correctly enters as
  the environment's state representation rather than the optimizer's. The
  residual policy then has to *learn* whatever frame conventions matter. A
  Lie-aware observation encoding (e.g., feeding the base twist in the body
  frame — already the convention — plus gravity in body frame) is the cheap
  win; re-parameterizing the optimizer over SE(3) would be the wrong tool for
  joint-space control.
- **One genuine future hook**: if you later optimize base-pose *trajectories*
  (keyframes on SE(3)) or quaternion-output heads directly, switch that
  sub-search to tangent-space perturbation + geodesic mean (exp/log through
  `fs-ga`), because Euclidean interpolation of quaternions is wrong (double
  cover, no normalization). The crate boundary (`fs-ga` as the sole Lie
  authority) makes that a contained change.

**References for the IGO/natural-gradient view:** Hansen & Ostermeier 2001
(CMA-ES), Akimoto et al. 2012 (IGO natural-gradient analysis), Wierstra et
al. 2014 (natural evolution strategies). The `fs-dfo` header already cites
the equivalence.

---

## 3. The proposal: tiny GLM-style transformer policy, learned from scratch

### 3.1 Why this is the right research bet

- The phase basis (8 periodic terms × 42 signals) *hard-codes* the hypothesis
  "gait is periodic". That is why the linear residual policy works at all —
  and why it cannot discover non-periodic recovery, terrain adaptation, or
  new gaits. The whole-body kernel now exposes arm joints, terrain, and push
  reflexes — a richer problem than the basis was designed for.
- Transformers over proprioception *history* are proven for locomotion:
  LocoFormer (arXiv 2509.23745) trains generalist locomotion controllers
  with a Transformer-XL policy and shows long-context adaptation replacing
  hand-designed phase scheduling; the quadruped literature (RENet, ABot-C0,
  DPL) has moved to attention policies for the same reason.
- The honest research question is the **ablation**: Lie-informed periodic
  prior (current: sample-efficient, limited ceiling) vs. learned-from-scratch
  transformer (sample-hungry, higher ceiling). Same kernel, same experiment,
  same metrics — the comparison IS the contribution.

### 3.2 Architecture — "GLM 5.3-flash, shrunk 4 orders of magnitude"

GLM-4.5/5-class pre-norm decoder stack, shrunk from 355B MoE to a dense
micro-model that fits a browser worker:

| Component | GLM-4.5-class | G1-gait micro version |
|---|---|---|
| Norm | RMSNorm pre-norm | same |
| Attention | GQA + RoPE | GQA (4 kv heads), RoPE over the time axis |
| MLP | SwiGLU | SwiGLU, hidden ≈ 2.67×d_model |
| Layers | 100+ | **4** |
| d_model | 10k+ | **256** (heads 8, head_dim 32) |
| Context | 128k | **64 steps** (133 ms of 480 Hz history — enough for two gait cycles at ~2 Hz) |
| Tokens/step | 1 | 1 per control step (observation token) + optionally 4 proprioception tokens |
| Output head | vocab | **15 joint targets + 14 arm targets** (linear head; tanh scaled to limits) |
| Params | 355B MoE | **≈ 3–6M** |

Sizing sketch (d=256, 4 layers, SwiGLU 682): per layer ≈ 4·d² (attn, GQA
reduces kv) + 3·d·682 (SwiGLU) ≈ 0.26M + 0.52M ≈ 0.79M; ×4 layers ≈ 3.1M;
embed 64×256 = 16k; heads 256×29 ≈ 7.4k. **~3.2M parameters.** That trains
with Muon on one consumer GPU at 480 Hz × thousands of parallel envs.

### 3.3 Training recipe — CMA-ES outside, Muon/Adam inside

The split exploits each optimizer where it is strongest:

- **Inner loop (weights): Muon on hidden matrices, Adam on embeddings/heads/
  norms** — the split recommended by the Muon authors and validated in agentic
  RL post-training (arXiv 2509.24406; "When Does Muon Help Agentic RL",
  2026: Muon helps but the policy-optimizer/advantage/LR trio must be tuned
  jointly). Muon = Newton–Schulz orthogonalized momentum updates on the
  2-D weights: it dominates AdamW on transformer pretraining in the 30M–200M
  class — exactly this scale.
- **Objective**: the kernel's existing reward structure (upright distance,
  contact-schedule adherence, energy, fall/joint-limit guards, terrain push
  terms) re-used as the RL reward — *one step function, one physics truth*
  (skill law 2). No reward re-design for the transformer: identical metrics
  make the ablation clean.
- **Outer loop (hyperparameters): CMA-ES** — population over 8–12
  hyperparameters (inner LR, Muon momentum, entropy/bonus coefficients,
  reward-weights vector, initial sigma of the policy distribution, GAE
  lambda). This is the established CMA-ES-for-HPO pattern; at 8–12 dims,
  full CMA-ES converges in tens of generations of *inner-trainings*, each
  affordable because the inner loop is the fast part.
- **Parallel rollouts**: the Rust physics core (`fs-mbd`, `fs-contact`,
  `fs-tribo`) compiles natively — a headless harness with rayon over N
  environments. A 32-core machine steps thousands of 29-DoF worlds at 480 Hz
  in parallel; PPO-style GAE over 64-step horizons. This is the IsaaacGym
  pattern with a Rust CPU core instead of GPU physics — the pragmatic first
  version. GPU physics (wgpu compute) is the second version.

### 3.4 Compute estimate and gates

- Inner training: 29-DoF walker, 64-step episodes, 4,096 parallel envs →
  ~30–60 min to first stable gait on a modern 12–16-core box (CPU-parallel);
  minutes on GPU physics. Muon: LR ~2e-3–4e-3 on hidden matrices (scaled by
  0.2 for output head), Adam 3e-4 on the rest (per the Muon literature).
- CMA-ES outer: pop 10 × 30 inner-trainings per generation ≈ 15–30 outer
  generations to find a good hyperparameter basin.
- **Go/no-go gates**: (1) transformer beats the linear residual policy on
  the identical terrain-and-push experiment within equal wall-clock; (2) it
  does so *without* the phase basis (the ablation); (3) Muon vs AdamW
  ablation on the hidden matrices.

### 3.5 Integration path for this site

1. Export the trained transformer to ONNX → `public/robots/g1/gait.onnx`
   (+ weights metadata JSON: obs layout, action scaling, limits — mirroring
   the kernel-refusal honesty pattern).
2. New policy backend in the G1 flagship: a third trace source, badge
   `policy: transformer (GPU-trained)` — same honest-badges doctrine, next to
   `walking curriculum mean` and `LM-CMA (live)`.
3. The browser worker runs ONNX Runtime Web (WASM/WebGPU) for live
   inference; CMA-ES remains the live hyperparameter tuner on top.
4. The ablation becomes a page section: *phase-basis prior vs learned
   from scratch* with both traces replayed on the same terrain.

### 3.6 Honest risks

- **Sample efficiency**: from-scratch transformer RL needs orders of
  magnitude more env interaction than CMA-ES-on-linear. The GPU parallel path
  exists precisely to pay this cost.
- **Sim-to-visual fidelity**: the transformer may exploit dynamics subtleties
  the reduced visual model doesn't show; the kernel refusal/validation
  envelope (schema-2) keeps every deployed policy inside the audited physics.
- **Muon on RL is young**: the 2026 evidence says "helps, but tune the trio" —
  hence CMA-ES owns the outer loop by design.
- **Determinism law**: trained weights are static assets (deterministic);
  live inference in the browser must avoid GPU-nondeterminism in the shown
  metrics — keep the receipt math in the WASM kernel.

---

## 4. Sources

- Muon for 30M–200M transformers: arXiv 2509.24406 (theory, convergence,
  Muon-vs-AdamW Pareto).
- Muon in agentic RL: "When Does Muon Help Agentic Reinforcement Learning?"
  (2026), robotpapers.info / alphaxiv 2607.16169.
- LocoFormer: generalist locomotion via long-context adaptation (Transformer-
  XL policy), arXiv 2509.23745.
- IGO/natural-gradient equivalence of CMA-ES: Hansen & Ostermeier 2001;
  Akimoto et al. 2012 (also implemented and property-tested in `fs-dfo`).
- GLM-4.5/5 series (Zhipu/Z.ai): open-weight MoE; the shrunk recipe
  (RMSNorm/SwiGLU/RoPE/GQA) follows the LLaMA-template decoder family.
- In-repo: `fs-dfo/src/cma.rs` (IGO couplings), `fs-ga/src/lie.rs` (SO(3)/SE(3)
  façades), `fs-mbd/src/robot_models.rs` (G1ResidualPolicy linear map),
  `fs-cmaes-viz-wasm/src/g1_walking.rs` (residual rollout).
