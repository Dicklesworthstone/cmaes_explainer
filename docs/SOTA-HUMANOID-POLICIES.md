# SOTA-HUMANOID-POLICIES.md — Transformer humanoid policies, RL×CMA-ES, and WASM speed

> **Owner:** SapphireElm (cmaes-iv3k).
> **Companion docs:** `docs/SOTA-MATH.md` (TurquoiseFalcon, math side), `docs/SOTA-MEASUREMENT.md` (RubyThrush, measurement side).
> **Status:** literature review completed 2026-08-30; repository-grounding corrections applied 2026-08-31 after direct artifact inspection.
> **Grounding:** repo facts verified against `public/robots/g1/transformer/metadata.json`, `app/lib/{frankensimCmaes,g1StepwiseEnv,cmaesHyperparameterLoop,policyAblationComparison}.ts`, `app/workers/{g1OptimizationWorker,roboticsEvaluationWorker}.ts`, `app/lib/roboticsEvaluationPool.ts`, and the sibling `/Users/jemanuel/projects/frankensim` crates (`fs-g1-train`, `fs-mbd`, `fs-cmaes-viz-wasm`).

## What this doc is

The project already contains the two halves this research connects:

1. **CMA-ES-native path** — the G1 flagship optimizes a **5,040-D linear residual policy** (15 actuators × 336 phase-basis features) directly in-browser, seeded from a disclosed 105-coordinate curriculum, on a 720-step @ 480 Hz terrain-and-push rollout (`fs-mbd/src/robot_models.rs`, `fs-cmaes-viz-wasm/src/g1_walking.rs`, coordinated through `app/workers/g1OptimizationWorker.ts` with a bit-exact first-batch parallel-parity gate).
2. **Transformer-native path** — a **2,902,273-parameter causal transformer** (64-step context, 42-D observations, 29 actions, 4 layers, d=256, 8 query / 4 KV heads, SwiGLU/RMSNorm/RoPE) with real PPO+GAE and Muon/Adam training/export code in `fs-g1-train`. The committed checkpoint is not a locomotion success: its 7,424-value policy head is entirely zero, and its historical training stand-in advanced at target speed without action. The browser now transfers that artifact onto `action-causal-standin-v2`, where it correctly earns zero distance, while golden vectors continue to prove inference parity.

This doc is the **why** behind that architecture and the map of where it can go next: what the literature says about transformer policies for humanoid walking/running/navigation/obstacle avoidance, where RL and CMA-ES each belong (they are **complementary loops, not rivals**), and how to keep all of it fast in the browser. Each section: citation → headline → mechanism → how it maps here → gotchas.

## 1. The transformer-policy lineage

### 1.1 HLT — the founding result

- **Citation:** Radosavovic, Xiao, Zhang, Darrell, Malik, Sreenath, "Real-World Humanoid Locomotion with Reinforcement Learning," arXiv:2303.03381; Science Robotics 2023 (doi:10.1126/scirobotics.adi9579). Project: learning-humanoid-locomotion.github.io.
- **Headline:** A causal transformer that consumes the history of proprioceptive observations and actions and autoregressively predicts the next action walked a full-size humanoid over real outdoor terrain, zero-shot from simulation.
- **Mechanism:** (a) history-in-context: the obs-action history implicitly encodes terrain/dynamics, so the policy **adapts in-context without weight updates** (emergent foot-trap recovery, gait change on downslopes); (b) training is large-scale model-free **PPO on thousands of IsaacGym environments** (~10B samples/day); (c) no curriculum tricks at deploy time — pure greedy decoding of the next action.
- **Maps here:** our ONNX spec (`metadata.json`) is exactly this shape — causal decoder over a 64-step obs-action context. `fs-g1-train/ppo.rs` (clipped PPO + GAE + RunningNorm) is the training loop in miniature. The G1 flagship's push-recovery challenge is the in-browser version of HLT's disturbance tests.
- **Gotchas:** HLT is **blind** (proprioception only) — its generalization comes from randomized training, not perception. In-context adaptation is emergent and bounded; LocoFormer (§1.3) shows short context is the real limiter.

### 1.2 Locomotion as next-token prediction (data generalization)

- **Citation:** Radosavovic et al., "Humanoid Locomotion as Next Token Prediction," arXiv:2402.19469.
- **Headline:** Casting control as modality-aligned autoregressive prediction lets one causal transformer train on **heterogeneous data** — RL trajectories, model-based controllers, mocap, even YouTube video (no actions) — and still transfer zero-shot to the real world; 27 h of walking data sufficed for SF walking.
- **Mechanism:** for each input token, predict the next token **of the same modality** (masked-modality prediction). Missing modalities during training are fine; at deploy the model still predicts actions.
- **Maps here:** the explainer ships a real but failed native checkpoint rather than synthesized output. A future successful artifact could mix CMA-ES-optimized trajectories with PPO rollouts as one pretraining corpus, then fine-tune with RL; the present zero-head checkpoint does not demonstrate that outcome.
- **Gotchas:** this is a *pretraining* story; the RL fine-tune on top is still PPO. Don't expect CMA-ES to compete with 38M-sample pretraining at 4.2M params — that asymmetry is exactly our ablation's lesson, and it is honest.

### 1.3 LocoFormer — long context is the adaptation lever

- **Citation:** Liu, Pathak, Agarwal, "LocoFormer: Generalist Locomotion via Long-Context Adaptation," CoRL 2025 (best-paper finalist), arXiv:2509.23745. Project: generalist-locomotion.github.io.
- **Headline:** One generalist policy controls unseen legged/wheeled robots and adapts to morphology change, motor failure, and weight change at test time — because its **context spans episode boundaries** (Transformer-XL segment memory), trained with aggressive domain randomization on procedurally generated robots.
- **Mechanism:** Transformer-XL cached keys/values across fixed-length segments; during multi-trial episodes, gradients stop at the cache but information flows across trials; reward = cumulative over the whole multi-trial episode → **learning-from-falls-across-trials emerges without any explicit memory loss**.
- **Maps here:** our spec's 64-step context is HLT-class (short, intra-episode). The single highest-leverage architecture upgrade for push-recovery realism is **multi-trial rollouts with cross-episode context**: the 720-step horizon and the continuable worker runs (`g1ActiveRuns`) already have the episode-loop scaffolding; the policy side would need segment-cached attention in `fs-g1-train/transformer.rs` and a KV-carrying ONNX export.
- **Gotchas:** cross-segment caching breaks the clean "stateless re-inference" property that makes browser-side evaluation trivially parallel and deterministic per candidate. If we adopt it, the parity harness needs a "cache-cold vs cache-warm" distinction (a skip-honest receipt category, never a silent pass).

### 1.4 Whole-body and control-family context (why 29 actions is our scope)

- **Citations:** HugWBC, arXiv:2502.03206 (unified whole-body gait controller, transformer-based); HOVER, arXiv:2410.21229 (one neural controller spanning RL/MPC/teleop modes); ExBody2, arXiv:2412.13196; HumanPlus, arXiv:2406.10454; OmniH2O, arXiv:2406.08858. Index: github.com/YanjieZe/awesome-humanoid-robot-learning (2.7k★).
- **Headline:** the field's frontier moved from lower-body locomotion (our 15 DoF) to **whole-body loco-manipulation** with upper-body command conditioning; transformer decoders are the shared backbone; teacher-student distillation from privileged sim states is the standard recipe for deployment-side robustness.
- **Maps here:** the owner has 29 physical articulated DoFs and real arm mass/reaction, but the learned/residual policy controls 15 lower-body/waist channels. Fourteen arm channels follow a deterministic swing-and-balance reflex. The 29-action transformer output shape is therefore broader than the policy-controlled locomotion rung actually validated here.
- **Gotchas:** do not describe the arms as display-only, but do not describe the deterministic reflex as learned whole-body control either.

## 2. Training recipes: where RL lives

- **Citations:** HLT (arXiv:2303.03381, PPO + IsaacGym + DR); FastTD3, arXiv:2505.22642 ("simple, fast, capable RL for humanoid control" — off-policy TD3 variant at PPO-grade wallclock); HuMam, arXiv:2509.18046 (Mamba replacing transformer for end-to-end humanoid control); Distillation-PPO, arXiv:2503.08299 and Learning Perceptive Locomotion with PIM, arXiv:2411.14386 (teacher-student: train on privileged sim state, distill to deployable proprio/depth student).
- **Headline:** the standing recipe for transformer humanoid policies is **PPO (or FastTD3) + massive parallel simulation + domain randomization + (for perception) privileged teacher → student distillation**. Everything else (Muon, Mamba, XL memory) is a swap inside a fixed scaffold.
- **Maps here:** `fs-g1-train` implements the scaffold natively: PPO+GAE (`ppo.rs`), Muon+Adam optimizer (`muon.rs` — the same Muon lineage used for the ablation receipt), the transformer (`transformer.rs`, hand-rolled with exact manual backward), and exports the ONNX manifest (`onnx_metadata.rs`). `app/lib/g1StepwiseEnv.ts` is the TS mirror of the env contract (42-D obs, dense reward `r = 15Δx + 0.5·cosθcosφ − 0.002·work − 50·𝕀fall`).
- **Gotchas:** FastTD3's wallclock wins are measured on GPU farms, not wasm; Mamba's win is long-context efficiency — irrelevant at context 64.

## 3. Vision, navigation, obstacle avoidance

- **Citations:** ARMOR, arXiv:2412.00396 (egocentric depth rig + transformer IL policy for dynamic collision avoidance; 63.7% collision reduction vs head-mounted rig, 26× lower latency than cuRobo sampling planner); NaVILA, arXiv:2412.04453 (legged VLA for navigation); Humanoid Parkour Learning, arXiv:2406.10759; Perceptive Internal Model, arXiv:2411.14386; DPL depth-only locomotion, arXiv:2510.07152; Collision-Free Humanoid Traversal in Cluttered Indoor Scenes, arXiv:2601.16035; Omni-Perception, arXiv:2505.19214 (omnidirectional collision avoidance for legged locomotion); STATE-NAV, arXiv:2506.01046 (stability-aware traversability for bipedal nav).
- **Headline:** the deployed-vision stack is **low-dimensional egocentric depth → learned latent → policy**, with the perception network trained by distillation against privileged geometry, not end-to-end pixels. VLA/frontier models (NaVILA) exist but are far above explainer scale.
- **Maps here:** the repo already owns the geometric half: certified convex-query owners (SDF/CCD/GJK via `fs-query`/`fs-geom`), the obstacle-avoidance objective factors (closed phr3 epics), and CBF safety filters (`app/lib/segmentSafeCbf.ts`, `safetyFilterRecovery.ts`). The literature-consistent next step is not camera simulation — it's **synthetic "depth" from the existing SDF field** (K raycast/shortest-distance samples on a small egocentric grid), distilled into a compact encoder, plugged at seam §6.2. That keeps every input reproducible in the parity harness.
- **Gotchas:** vision-feel without perception-grade inputs is a trap: if the "camera" sees the exact simulator state, policies overfit to oracle information the real task doesn't have. The SDF-grid proxy must be *causal* (sensor-frame, occlusion-naive at minimum) to keep the experiment honest.

### 3.1 The deployed geometric guard chain (no policy can violate it)

The flagship scene uses a **layered, certified geometric guard chain** that the policy (transformer or CMA-ES) cannot violate at the user surface. This is the deployed implementation of the SOTA penetration-depth / contact-manifold math from §4.6–§4.7 of SOTA-MATH.md (Ericson, *Real-Time Collision Detection*; Bergen, *Collision Detection in Interactive 3D Environments*; Jo/Zhang/Yang/Luo, *Geometry-Aware Control Barrier Functions*).

- **Spawn-safe** (`findClearSpawnPosition` in `app/lib/houseMultiObstacleKernel.ts`): on first trace load, a coarse grid sweep over the house bounds returns the first interior point at which `clampPositionAgainstHouseCollisions` reports `isColliding = false` with a 0.35 m safety radius (larger than any body collider sphere). This is the same primitive the ragdoll dragger uses on every pointerMove, so the first frame is provably collision-free. The arm flagship mirrors this with `clampArmTargetPosition` for the KUKA target marker (`feat(arm-flagship): seed arm drag target from collision-safe, reachable spawn position`).
- **Per-drag clamp** (`clampPositionAgainstHouseCollisions`, `clampArmTargetPosition`): the OBB Signed Distance Function $\mathbf{d} = |\mathbf{R}^T(\mathbf{x} - \mathbf{c})| - \mathbf{h}$ from Ericson §5.2.3, plus the conservative push-out that preserves the same body frame. The dragger's `isColliding` flag fires whenever the proposed position has any OBB with signed distance $< \text{safeRadius}$. Verified by `tests/g1SpawnSafety.test.ts`, `tests/craftsmanRouteCollisionSafety.test.ts`, `tests/armReachabilityAndSpawn.test.ts` (8 cases).
- **Reachability guard** (`isTargetKukaReachable` in `app/lib/armInverseKinematics.ts`): a 30-iteration Damped Least Squares (DLS) IK attempt with 2 cm residual tolerance. If the proposed target is not reachable, the dragger holds the previous good target and surfaces a "Workspace Limit" badge. This implements the SOTA conservative-advance / penetration-guard from CBF literature: rather than computing the *best* next configuration, we accept only the configurations the certified solver can actually reach.
- **Continuous Collision Detection (CCD)** (`tests/continuousCollisionDetection.test.ts`): per-step displacement $\le v_{\max} \cdot dt$ is bounded by the joint speed limit $\times 1/480\text{s} \approx 6\text{ mm}$, well under the 0.04 m margin used by both clamp primitives, so a discrete step cannot miss a wall.

**Why this matters for SOTA:** ARMOR (§3) and the collision-free traversal work (arXiv:2601.16035) prove that low-dimensional egocentric depth can dramatically reduce collision rates, but they do not certify *zero* penetration. Our chain provides the floor — even if the policy's collision-rate metric regresses, the user-facing scene cannot tunnel a wall. The policy work is improving the mean, not bounding the worst case; the geometric guard bounds the worst case.

**Visualization:** the `G1PhysicsDebugOverlay` and `ArmPhysicsDebugOverlay` components (toggleable via the "🔧 Physics" button in each flagship's HUD) render the body-link colliders, the obstacle OBBs, the arm's reachable workspace as a point cloud, and the safety sphere — so the user can verify the chain is operating as advertised. The disabled state has zero JSX output (regression-bounded by `tests/physicsDebugOverlayDisabled.test.ts`).

## 4. Where CMA-ES fits — three distinct loops

This is the load-bearing section. CMA-ES appears in the literature and in this repo in **three non-interchangeable roles**; conflating them is how projects waste levers.

### 4.1 Direct policy search (the flagship's role)

- **Citations:** Igel, "Evolution Strategies for Direct Policy Search" (NAC/CMA-ES comparisons; PPSN/GECCO lineage); Heidrich-Meisner & Igel, "Uncertainty handling CMA-ES for reinforcement learning," GECCO 2009; Salimans et al., "Evolution strategies as a scalable alternative to reinforcement learning," arXiv:1703.03864 (OpenAI ES); Conti et al. (ES with common random numbers + fitness shaping), arXiv:1712.06560; Chatzilygeroudis et al., "Black-Box Data-efficient Policy Search for Robotics" (Black-DROPS), arXiv:1703.07261; ES-vs-gradient benchmark, arXiv:2402.06912.
- **Headline:** ES/CMA-ES is a **competitive direct-policy-search method exactly when evaluations are cheap, parallel, and noise-manageable, and parameters number in the hundreds-to-thousands** — and it dominates sample-efficiency per wallclock when simulation is free and gradients are not needed. That is precisely the browser case: 16-candidate populations × 720-step rollouts in workers, no autodiff available.
- **Maps here:** the 5,040-D linear residual is inside CMA-ES's historical comfort zone *because it's linear + phase-feature-structured*; separable/LM-CMA/LM-MA at 5,040-D with population 16 and σ₀=5e-4 is a faithful small-population high-D regime. No sample-efficiency conclusion may be drawn against the current transformer artifact because it was trained on a superseded non-causal environment and has a zero policy head.
- **Gotchas:** ES papers consistently show the crossover flips above ~10⁵–10⁶ params or when evaluation noise is unstructured (arXiv:2402.06912). Never present the two paths as rivals on equal parameter budgets — the ablation framing (different params, different data budgets, both honest) is the defensible one.

### 4.2 Hyperparameter / reward-shaping search (the outer loop)

- **Citations:** Nomura et al., "Warm Starting CMA-ES for Hyperparameter Optimization," AAAI 2021, arXiv:2012.06932 (CMA-ES beats BO for HPO **under parallel budgets**; warm-starting from prior-task optima fixes its small-budget weakness); "Learning Step-Size Adaptation in CMA-ES" (AutoML conf / DAC — RL learns the CMA-ES scheduler); "CMA-ES for Hyperparameter Optimization of DNNs," OpenReview xnrA4qzmPu1m7RyVi38Z (clear parallelism strategy as the stated advantage); Population-Based Training (Jaderberg et al., arXiv:1711.09846) as the greedy-exploitative alternative; dd-CMA diagonal acceleration, arXiv:1905.05885.
- **Headline:** **CMA-ES is a SOTA outer-loop optimizer for RL hyperparameters — including continuous reward weights — especially when you can evaluate hyperparameter-settings in parallel**, which is exactly our worker-pool shape. PBT is cheaper per step but myopic; BO wins only at tiny sequential budgets.
- **Maps here:** already implemented twice: sibling `fs-g1-train/hpo.rs` (CMA-ES (1+λ) over 8 hyperparameters: Muon LR/momentum, PPO entropy, reward weights, GAE λ, value coef) and browser `app/lib/cmaesHyperparameterLoop.ts` (8-D outer CMA-ES via `LiveCmaesOptimizer`). The 11 display channels of `app/lib/g1MultiFactor.ts` are a **ready-made, human-auditable 8–11-D CMA-ES search space for objective weights** — the literature-backed framing of our "Objective Equalizer" UI as an actual optimizer surface.
- **Gotchas:** stochastic validation noise inflates CMA-ES covariance if raw single-rollout scores are told back (the NoGradientExamples "stochastic validation noise" knob exists to teach this); use mirrored sampling + mean-of-k rollouts per candidate (Conti et al. arXiv:1712.06560) before blaming the optimizer. Warm-start (WS-CMA-ES) is the highest-leverage cheap upgrade: seed the outer HPO mean at the best prior run's optimum instead of the origin.

### 4.3 Sampling-based MPC kinship (the real-time-control view)

- **Citations:** "Full-Order Sampling-Based MPC for Torque-Level Locomotion Control via Diffusion-Style Annealing," arXiv:2409.15610; "Reference-Free Sampling-Based Model Predictive Control," arXiv:2511.19204; "Predictive Sampling: Real-time Behaviour Synthesis with MuJoCo," arXiv:2212.00541; MPPI lineage (Williams et al.).
- **Headline:** CMA-ES-shaped population sampling **is** the update rule of a family of real-time MPC solvers for locomotion (sample → roll out → reweight → refit). The difference from §4.1 is the *horizon*: solve one receding-horizon window per control tick instead of optimizing a whole policy.
- **Maps here:** our ask/tell session over 5,040-D with continuable runs is structurally a batched sampling-based optimizer; nothing blocks a "MPC mode" where the window is a 60-step lookahead and the tell happens every tick. That would demo ES-as-controller (a genuinely distinct explainer lesson from ES-as-policy-search). New kernel surface in `fs-cmaes-viz-wasm`, browser UI in the G1 flagship.
- **Gotchas:** 480 Hz × 16 candidates × 60-step lookahead = 460k rollout-steps/tick — only tractable with the WASM kernel at full SIMD; do not prototype this in TS.

### 4.4 Parallel-scale reference points

- **Citations:** evosax (JAX-based ES, researchgate 366136715); EvoTorch CMAES (GPU-accelerated, populations into 100k+ on one V100 — NVIDIA docs/reddit release notes); QDAX CMA-ES; fast-cma-es/EvoJax tutorials.
- **Headline:** modern implementations run CMA-ES with **population sizes of 10⁴–10⁵ by vectorizing rollouts on accelerators**. Our in-browser population of 16 is tiny by comparison — the constraint is not the optimizer, it's per-rollout cost (720 × 480 Hz articulated dynamics).
- **Maps here:** the honest speed lever for CMA-ES exploration throughput is not more workers (already at `min(4, cores−1)` with bit-exact parity), it's **per-step cost**: SIMD/SoA kernels (`fs-simd`, `fs-soa`), f32 policy inference, and possibly reduced physics tick for coarse screening with full-fidelity confirmation of survivors (two-stage evaluation — a known ES trick, cited in uncertainty-handling literature).
- **Gotchas:** two-stage (coarse→fine) evaluation changes the objective distribution CMA-ES adapts to; it needs its own parity receipt (coarse survivors re-scored at full fidelity, ordering drift measured), or it silently biases the search.

## 5. Keeping it fast in WASM (browser policy + physics inference)

### 5.1 What the repo already does right (verified)

- Physics is **Rust→wasm-pack, committed per-version, fail-closed version-gated** (`AUDITED_CMAES_KERNEL_VERSION` 0.4.1; current G1/arm owner package 0.6.14; refusal envelopes, never silent TS fallback) — this is the mega-kernel doctrine's parity-first culture already in miniature.
- Evaluation fan-out with a **bit-exact first-batch sequential-parity check** (`roboticsEvaluationPool.ts`, `Object.is`) with permanent honest fallback: exactly the "parallelize independence dimensions only, prove identity" rule.
- All cross-boundary data is **packed little-endian typed arrays with zero-copy transfer** (Float64Array words, transferable buffers, schema-8 zero-copy ABI).
- Determinism from keyed Philox RNG + fixed eigendecomposition cadence (`fs-dfo/cma.rs`) — cross-run reproducibility without float-order luck.

### 5.2 The transformer-in-browser decision

Per-decision cost of the 2.90M-parameter policy is roughly **5.8 MFLOP/token** by the same two-FLOPs-per-weight estimate; a 720-step rollout is about **4.2 GFLOP/candidate** before cache effects. These are estimates, not measured browser budgets.

1. **ONNX Runtime Web (WASM SIMD + WebGPU EPs)** — fastest path to working inference; used widely for browser policy demos. Costs: multi-MB runtime and backend-dependent reduction order. The current browser path instead loads the committed custom binary format into the hand-rolled TypeScript decoder and verifies it against Rust golden vectors.
2. **Hand-rolled Rust→WASM-SIMD128 GEMM/attention kernel** (the `fs-g1-train/transformer.rs` forward pass compiled to wasm32 with `fs-simd` kernels) — full ownership, deterministic, byte-comparable against a scalar oracle; incremental work: SIMD128 matvec/GEMM, pre-packed weights, f16→f32 or int8 weight quantization for the FFN GEMMs only (per the quantized-decoder-GEMM doctrine: keep norms/router/RoPE high-precision).
3. **WebGPU tier** — 10–50× more headroom, but a different parity regime (float-order across backends) and a new dispatch tier; correct as a *future* lever behind explicit opt-in, never as the default path.

**Recommendation (evidence-based):** option 2 for anything inside the optimization loop, with the existing TypeScript decoder retained as a transparent parity/debug implementation. Inference plumbing is no longer the primary blocker; action-causal owner-coupled training is.

### 5.3 Speed levers ranked (measured-literature + repo-shaped)

1. **Quantize the FFN/attention GEMM weights to int8** with per-channel scales, f32 accumulate — 2–4× on the 8.4 MFLOP/token with byte-stable argmax behavior if the validated-set discipline is followed (quantize only what a measured end-metric gate passes; ship f32 escape hatch).
2. **SIMD128 matvec at m=1 decode shape** — the policy is GEMV-shaped at inference (batch 1); LLVM-autovec scalar first, intrinsics only behind runtime dispatch with a scalar oracle (measured literature: hand-SIMD can lose to autovec on toolchain-dependent shapes; re-prove per toolchain).
3. **Pre-pack weights at hydration** (transpose-once), f32 policy state in linear memory, zero per-step allocation — the repo's zero-copy culture already mandates this for physics; extend to policy tensors.
4. **Threads via SharedArrayBuffer + COOP/COEP** only if the policy ever becomes batch-parallel *within* one candidate; today the parallelism is across candidates (workers) which is the right independence dimension — don't nest threading under the worker fan-out (deadlock-class bugs; keep one live forward per worker).
5. **Physics-side**: the 480 Hz tick dominates per-step cost, not the policy; two-stage evaluation (§4.4 gotcha) and trace-stride decimation (`traceStride:12`) are the sanctioned knobs.

### 5.4 What this does NOT prove

No numbers in §5 are measured on this repo's silicon; they are planning estimates from FLOP counts and published WASM/ORT benchmarks. The next gate is a **micro-benchmark bead**: v069-style kernel exporting `transformer_forward(wasm) vs scalar oracle`, parity harness at 1e-6 accumulated (f32 reduction-order tolerance, ledgered per-layer like the ladder discipline), and `tests/perf` budget rows for per-token and per-rollout latency. Until that receipt exists, "fast enough in WASM" is a hypothesis, not a claim.

## 6. Integration seams (exact anchors, for whoever implements next)

1. **Policy shape swap** — sibling `fs-mbd/src/robot_models.rs:173` (`G1ResidualPolicy::evaluate`) and `fs-cmaes-viz-wasm/src/g1_walking.rs` rollout; obs/action contract already matches `metadata.json` (42-D/29-D). A WASM transformer-forward export would slot beside `evaluate`/`evaluate_population` behind the same fail-closed manifest gate.
2. **Worker inference path** — `app/workers/g1OptimizationWorker.ts` (ask→pool→tell loop) and `roboticsEvaluationWorker.ts` (cached evaluator per config, transferable Float64Arrays): interpose policy inference here, never on the main thread.
3. **Wire format** — additive schema through the refusal-envelope policy (`frankensimCmaes.ts:952-989` packet constants; `schema8WireFormat.ts` zero-copy ABI): a weights-packet kind must reuse header/snapshot/refusal conventions, unknown-value refusal intact.
4. **Objective/HPO surfaces** — `app/lib/cmaesHyperparameterLoop.ts` (8-D outer CMA-ES) + `g1MultiFactor.ts` (11 channels): WS-CMA-ES warm start (§4.2) and mirrored-sampling/mean-of-k are drop-in upgrades; both need only changes inside the outer loop.
5. **Parity gates** — any new inference path must clear `tests/parity/parityHarness.ts` (1e-9 analytic / 1e-6 accumulated, loud structure-only skips) and the first-batch `Object.is` pool check, or it ships as a display-only lens — there is no third option.

## 7. Candidate follow-up work (proposed beads, NOT filed — coordinate with RoseBasin/RedGrove who own graph expansion)

| Idea | Section | Size |
|---|---|---|
| WASM transformer-forward kernel + scalar oracle + parity receipt + perf budgets | §5.2, §5.4 | T2, multi-week |
| WS-CMA-ES warm start for the 8-D HPO loop from prior-run optima | §4.2 | small |
| Mirrored sampling + mean-of-k rollouts for noisy objectives (outer loop) | §4.2 | small |
| Multi-trial episodes with cross-trial context (LocoFormer-style) behind a kill-switch | §1.3 | medium |
| SDF-grid egocentric "depth" input + distilled encoder for vision seam | §3 | medium |
| ES-as-MPC explainer mode (receding-horizon tell loop) | §4.3 | medium |

## Sources

Primary (read 2026-08-30): arXiv:2303.03381 (+ project), 2402.19469, 2509.23745 (+ project), 2012.06932, 2412.00396, 1905.05885, 1703.07261, 2402.06912, 2505.22642, 2411.14386, 2510.07152, 2412.04453, 2406.10759, 2601.16035, 2505.19214, 2506.01046, 2409.15610, 2511.19204, 2212.00541, 2502.03206, 2410.21229, 2412.13196, 2406.10454, 2406.08858, 2509.18046, 2503.08299. Indexes: awesome-humanoid-robot-learning (YanjieZe). Tools: evosax, EvoTorch, QDax, dd-CMA. Repo/sibling sources: scout pass 2026-08-30 (see §6 anchors).
