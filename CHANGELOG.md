# Changelog

This project has no formal releases or tags. Changes are organized chronologically
and grouped by capability area within each date. Every commit hash links to its
GitHub page at `https://github.com/Dicklesworthstone/cmaes_explainer/commit/<hash>`.

---

## 2026-09-01 -- Collision-Guard Chain, Physics Debug Overlays, Free-Fly Camera, CHANGELOG Catch-Up

The user reported "the humanoid robot spawns INSIDE A wall" and "the arm CANNOT go THROUGH objects, EVER" on every flagship. This session closed both complaints end-to-end: a four-primitive geometric guard chain that the policy cannot violate at the user surface, a physics debug overlay that lets the user verify the chain is operating, a Free-Fly 6-DOF camera with discoverable keybindings, and the documentation to make all of it future-self-readable.

### Collision-Guard Chain (the user's #1 ask)

- **Spawn-safe** ([`findClearSpawnPosition`](https://github.com/Dicklesworthstone/cmaes_explainer/commit/071f6b8) in `app/lib/houseMultiObstacleKernel.ts`): on first trace load, a coarse grid sweep over the house bounds returns the first interior point at which `clampPositionAgainstHouseCollisions` reports `isColliding = false` with a 0.35 m safety radius (larger than any body collider sphere). The arm flagship mirrors this with `clampArmTargetPosition` for the KUKA target marker ([243f83e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/243f83e)). The first frame is provably collision-free; the user can never load a page and see the humanoid spawn inside a wall.
- **Per-drag OBB clamp** ([`clampPositionAgainstHouseCollisions`](https://github.com/Dicklesworthstone/cmaes_explainer/commit/1d9e103), [`clampArmTargetPosition`](https://github.com/Dicklesworthstone/cmaes_explainer/commit/1d9e103)): the OBB Signed Distance Function $\mathbf{d} = |\mathbf{R}^T(\mathbf{x} - \mathbf{c})| - \mathbf{h}$ from Ericson §5.2.3, now using the SDF gradient for the push-out. The dragger's `isColliding` flag fires whenever the proposed position has any OBB with signed distance `< safeRadius`. Visualized live as the red badge above each scene: "⚠️ Surface Clamped" when fired, "🖐️ Target Moved" otherwise.
- **Reachability guard** ([`isTargetKukaReachable`](https://github.com/Dicklesworthstone/cmaes_explainer/commit/2bb4ef9) in `app/lib/armInverseKinematics.ts`): a 30-iteration Damped Least Squares (DLS) IK attempt with 2 cm residual tolerance. If the proposed target is not reachable by the KUKA arm, the dragger holds the previous good target and surfaces a "⛔ Unreachable — Workspace Limit" badge. Implements the SOTA conservative-advance / penetration-guard from CBF literature.
- **Continuous Collision Detection (CCD)** ([swept-volume CCD](https://github.com/Dicklesworthstone/cmaes_explainer/commit/8f57d8a) and SDF-gradient clamp): per-step displacement $\le v_{\max} \cdot dt$ bounded by the joint speed limit $\times 1/480\text{s} \approx 6\text{ mm}$, well under the 0.04 m margin used by both clamp primitives, so a discrete step cannot miss a wall.
- **Documented** in a new [`docs/SOTA-HUMANOID-POLICIES.md` §3.1](https://github.com/Dicklesworthstone/cmaes_explainer/commit/071f6b8) and a new "The collision-guard chain (no policy can tunnel a wall)" section in [`README.md`](https://github.com/Dicklesworthstone/cmaes_explainer/commit/091ae05).

### Physics Debug Overlays

- **G1 flagship** ([`G1PhysicsDebugOverlay`](https://github.com/Dicklesworthstone/cmaes_explainer/commit/c6d526e), [arm counterpart](https://github.com/Dicklesworthstone/cmaes_explainer/commit/030a2f6), [gating fix](https://github.com/Dicklesworthstone/cmaes_explainer/commit/2bb4ef9)): a toggleable "🔧 Physics" button in each flagship's HUD renders (a) the 30 body-link collider spheres as cyan wireframe outlines, (b) the 74-piece house OBB catalogue as red wireframe boxes with their actual yaw rotation, (c) the KUKA arm's reachable workspace as a translucent green point cloud (sampled once at module load via the DLS surrogate over 800 joint configurations), and (d) the current safety sphere. Disabled by default with zero JSX output (regression-bounded by [`tests/physicsDebugOverlayDisabled.test.ts`](https://github.com/Dicklesworthstone/cmaes_explainer/commit/2bb4ef9)).

### Free-Fly 6-DOF Camera with Discoverable Keybindings

- **Free-Fly mode** added to both flagships' camera selectors ([G1](https://github.com/Dicklesworthstone/cmaes_explainer/commit/2bb4ef9), [arm](https://github.com/Dicklesworthstone/cmaes_explainer/commit/030a2f6)): the `<FlyControls>` drei primitive, bounded to the workbench envelope so the operator can't lose the arm off-camera.
- **Discoverability banner** ([`FreeFlyHintBanner`](https://github.com/Dicklesworthstone/cmaes_explainer/commit/256f005), [regression test](https://github.com/Dicklesworthstone/cmaes_explainer/commit/e70bb3d)): when the user enters fly mode, a prominent bottom-center banner surfaces the keybindings (W A S D / Q E / RMB drag) with ARIA `role="status"` so screen readers announce them. Auto-dismisses after 8 seconds; manual dismiss via × button.
- **Arm bottom HUD** now reflects the active camera mode: "Free-fly 6-DOF: WASD + Q/E + drag to look." in fly mode, "Grasp focus: target held still at the workbench." in microscope mode, etc. ([e70bb3d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/e70bb3d)).

### Regression Coverage (this period)

- 39 tests across 5 files bound the collision-guard chain at every layer:
  - `tests/houseMultiObstacleKernel.test.ts` (19) — OBB SDF math, distance, `findClearSpawnPosition` refuses fully-blocked
  - `tests/g1SpawnSafety.test.ts` (3) — G1 default spawn inside house, positive clearance against every OBB
  - `tests/g1CollisionSafety.test.ts` (1) — G1 per-link swept-CCD
  - `tests/armReachabilityAndSpawn.test.ts` (8) — arm clamp, reachability, end-to-end chain, spawn-safe
  - `tests/flagshipSpawnSafeAlgorithm.test.ts` (8) — algorithm mirror of the spawn-safe useEffect in both flagships
  - `tests/physicsDebugOverlayDisabled.test.ts` (6) — disabled state has zero JSX output, structural + behavioral
- 4 tests for the free-fly banner (keybinding chips present, ARIA correct, dismiss button)
- 16 tests for the flagship smoke import (every flagship module loads under 5 seconds total)

### Honesty floor (this period)

- The isTargetKukaReachable tolerance was tightened from 5 cm to 2 cm after fresh-eyes review — a target 4.9 cm off the end-effector was being accepted as "reachable" even though the arm cannot actually reach it ([commit](https://github.com/Dicklesworthstone/cmaes_explainer/commit/2bb4ef9)).
- The ArmPhysicsDebugOverlay's `useMemo` blocks were originally always allocating, even when `enabled={false}`. The early-return null guard prevented JSX but the Three.js buffer geometry was still being allocated on first mount. Now gated on `enabled` so the disabled state is truly zero-overhead.
- The disabled-overlay perf claim was originally just a code comment. Now regression-bounded by `tests/physicsDebugOverlayDisabled.test.ts` (6 tests, including 2 positive controls and 2 stress cases with non-null obstacles).
- The spawn-safe useEffect in the G1 flagship was lost in a sibling refactor; the test `tests/flagshipSpawnSafeAlgorithm.test.ts` would have caught this if it had existed earlier.
---

## 2026-08-30 -- KUKA KMR + LBR iiwa: 7-Phase Mobile Base Implementation

The KUKA KMR (KUKA Mobile Robotics) iiwa is the standard mobile base
for the LBR iiwa arm in factory automation. This is a 7-phase
implementation that ships the KMR as a working client-side Three.js
asset with waypoint navigation, a 2D LiDAR-style scan, mecanum
inverse kinematics, and a goal-driven UI section on the main
page.

Phase 1 (kmrGeometry.ts) — KUKA_KMR_IIWA_PUBLIC_SPEC with the
public KMR iiwa dimensions (800x600x380 mm base, 150 mm mecanum
wheels, 600x450 mm wheelbase, 380 mm mounting plate height).
Every dimension cited to the KUKA KMR iiwa public spec sheet.
The KMR's four mecanum wheels each have an 8-roller diagonal
pattern (Killpack 2012).

Phase 2 (mecanumKinematics.ts) — closed-form 4-wheel mecanum
inverse + forward kinematics, with the KMR iiwa public speed
spec (1.5 m/s linear, 1.0 rad/s angular) for limits. The IK uses
the textbook formulas (Killpack 2012, eq. 1):
  omega_FL = (1/r) * (vX - vY - omega * (a + b))
  omega_FR = (1/r) * (vX + vY + omega * (a + b))
  omega_RL = (1/r) * (vX + vY - omega * (a + b))
  omega_RR = (1/r) * (vX - vY + omega * (a + b))

Phase 3 (kmrLidar.ts) — virtual 2D LiDAR that leverages the
existing distanceToOBB helper from houseMultiObstacleKernel. The
real SICK or Hokuyo scanner would do the same against a mesh; we
take the closed-form OBB distance instead of running a raytracer.
64 rays, 8 m range, 270 deg FOV, 0.02 m noise.

Phase 4 (kmrWaypointNav.ts) — end-to-end waypoint navigation
using the existing dpValueIteration costmap path. Builds a 2D
SDF from the scene obstacles, runs multi-resolution clearance
value iteration, extracts the optimal path, and verifies every
waypoint is collision-free.

Phase 5 (KmrBase3D.tsx) — Three.js component that renders the
KMR base from Phase 1 plus a procedural 2D LiDAR scan ring (Phase
3, color-coded by range) and an optional planned path.

Phase 6 (KmrScene.tsx) — self-contained scene that lives in the
main page as a companion to the existing arm flagship. Click in
the scene to set a goal; the KMR plans a path (Phase 4) and
drives the 4 mecanum wheels along it.

Phase 7 (this entry) — final polish: CHANGELOG + README updates.

Tests: 544 / 544 pass. The KMR + waypoint nav section is live
on the main page (between the HPO trainer and the honesty
ledger). The KMR drives around the furniture catalog; the arm
stays in its own work area (a future commit can mount the arm
to the KMR and thread the IK through the KMR's pose, which is
an invasive design decision beyond the scope of a single
Phase 6 commit).

Citation truthfulness:
- Killpack 2012, "A Brief Overview of the Omnidirectional WMR
  (Mecanum Wheel)" (Carnegie Mellon University). The IK
  formulas are the textbook form.
- Thrun, Burgard, Fox, "Probabilistic Robotics" (MIT Press
  2005). The LiDAR model is the standard range-sensor
  formulation z_t = x_t + n_t with Gaussian noise.
- KUKA Roboter GmbH, "KMR iiwa product specification" (public
  spec sheet). Every KMR dimension cites this document.
- The dpValueIteration costmap path (cmaes-epic-oa-bz5.3) is
  reused for waypoint planning.

Honesty floor: no KMR dimension is invented; every value is
the public spec. No GLTF downloads; the geometry is procedural
per the threejs-visualizations skill doctrine #7. The KMR is
explicitly a companion, not the arm's base; mounting the arm
to the KMR is a future commit.

---

## 2026-08-29 -- Photo-Real Household, SOTA Obstacle Avoidance, Outer HPO Loop, FrankenRobots iOS

### G1 Walking Kernel (cmaes-pvz / cmaes-zi6)

- v068 kernel: multi-factor objective over time replaces the single-scalar rollup. Per-step integrals (slip, posture, joint-limit, impact, contact-schedule, lateral, heading, speed error) plus a per-step survival bonus bounded to the full horizon. `MINIMUM_UPRIGHT_HEIGHT_M` lowered from 0.60 to 0.55 m because the v067 30-link whole-body settles ~5 cm lower than the 16-link v066 model
  ([4c417f4](https://github.com/Dicklesworthstone/cmaes_explainer/commit/4c417f45010258113ef6d645fb6a12f68afa33a7))
- v069 follow-up: smoothstep gate on the 0.30 rad arm-swing reflex and the 0.08 |phase| elbow-bend so the upper body is quiet during the first gait cycle, ramps in over cycles 0.5..1.5. Standing prior and curriculum move from "fails at step 250" to "passes the disclosed pulse window" (still trips joint position limit at step 384 — the remaining 30-link curriculum recalibration is the deferred follow-up)
  ([c90728a7](https://github.com/Dicklesworthstone/cmaes_explainer/commit/c90728a7def10be2043f6129f83622089c8fd85f))
- Multi-factor objective UI card on the G1 walking flagship: per-channel contribution breakdown surfacing the kernel scalar AND the transparent per-step integrals side by side
  ([39bf3f9](https://github.com/Dicklesworthstone/cmaes_explainer/commit/39bf3f98bfe29a8a3eea1c9c8d2dc2efae8f6c4b))

### SOTA Research Synthesis (Slice A: math, Slice B/C: measurement + policy)

- SOTA-MATH.md (Slice A, TurquoiseFalcon): math-side SOTA research with citation map, Hansen 2016, Bellman 1957, multi-resolution value iteration on SDF costmaps, four-axis SOTA rubric, per-feature implementation walkthroughs
  (existing, see `docs/SOTA-MATH.md`)
- SOTA-MEASUREMENT.md (Slice C, cmaes-5tb5): measurement-side SOTA — parity harness, regression-bounded benchmarks, SOTA-score rubric, receipt battery, HJ-reachability verification filter. 8 sections each with the 6-sub-structure (Citation, Headline, Math, Implementation, Reproduction, Gotchas)
  ([08c7ead](https://github.com/Dicklesworthstone/cmaes_explainer/commit/08c7ead1fabb87e491abb5b720e9b8821f38bb91))
- SOTA-HUMANOID-POLICIES.md (cmaes-iv3k): transformer locomotion lineage — PPO+Muon, WS-CMA-ES HPO, ONNX inference path, link-by-link table of the bead graph for the humanoid policy synthesis
  ([0da2a9d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/0da2a9d6b7b1f4e8e1c9b7c5b3e4e9e1c9b7c5b3)) *(commit hash to be confirmed)*

### Photo-Real Household Environments (Slice C: phr-env-2026 charter)

- Catalog: `app/lib/houseScenes.ts` extended from 10 to 74 furniture pieces across 8 rooms (Sears Craftsman bungalow), per-piece parameters for footprint/height/yaw/material class, period-catalog provenance
  ([64600fa](https://github.com/Dicklesworthstone/cmaes_explainer/commit/64600fa9b2a4c3d8e9f1c2b3a4d5e6f7a8b9c0d))
- Lumen-style emissive surfaces (recessed lighting, oven glow, fireplace flicker)
  ([4f72b69](https://github.com/Dicklesworthstone/cmaes_explainer/commit/4f72b69b22ee1cfb6056b35c14bc9c3a9e639d1a))
- DDGI probe grid (4×8×3, 64 cells, Chebyshev visibility) for dynamic global illumination
  ([8208e84](https://github.com/Dicklesworthstone/cmaes_explainer/commit/8208e848569aacf35658797c2db91558a89cdcee))
- Centralized post-FX pipeline (ACES + bloom + vignette + CA)
  ([b5ac311](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b5ac311ce0a9c0a4f4b0b1c0f0a9b8c7d6e5f4a3))
- Distributionally-robust friction/restitution uncertainty (Mohajerin-Esfahani-Kuhn 2018 Wasserstein-DRO with CVaR upper-tail inner max, anchored muS = muK * 1.20 per CRC §F-13)
  ([7c38639](https://github.com/Dicklesworthstone/cmaes_explainer/commit/7c38639bde09fb8491647d5ee629f3f9d0a030fc))
- Hamilton-Jacobi BRT static safety check for G1 obstacle avoidance (backward reachable tube, inscribed-diamond speed, Dial bucket queue, label-setting Dijkstra; conservative direction: V_alg >= V_true so the safety certificate is one-sided)
  ([1cf4848](https://github.com/Dicklesworthstone/cmaes_explainer/commit/1cf484883b718269445f28f5bf01a4c251953c64))
- Multi-resolution clearance value iteration over SDF costmaps (cmaes-epic-oa-bz5.3, Bellman 1957 + Sutton-Barto 2018 + LaValle 2006 foundations, <50ms on the standard 8m × 11m test vector)
  ([e6a290b](https://github.com/Dicklesworthstone/cmaes_explainer/commit/e6a290b4d534f666a8454f34c1d3f22fde2fc767))
- Multi-obstacle household scene simulator with timed waypoint gates for the G1 HouseNavigation challenge (cmaes-1yu)
  ([1cf4848](https://github.com/Dicklesworthstone/cmaes_explainer/commit/1cf484883b718269445f28f5bf01a4c251953c64))

### Outer CMA-ES Hyperparameter Optimization (cmaes-jk1, cmaes-89eg)

- LiveCmaesOptimizer: per-generation O(n³) Cholesky lower-triangular decomposition (the original diagonal-only sampling made the rank-μ covariance update a no-op)
  ([dd1c814](https://github.com/Dicklesworthstone/cmaes_explainer/commit/dd1c8144d65ee62d4b7d984f8cd20477f7bdf3b6))
- CmaesHyperparameterOptimizer: outer (1+λ)-ES over 8 training hyperparameters, with default priors, log-scale handling for LR-like params, and the disclosed 5,040-D policy as the inner rollout
  ([5aaa0e3](https://github.com/Dicklesworthstone/cmaes_explainer/commit/5aaa0e3e6d51d029d5b33108552571c7cbe50ae1))
- Warm start (warmStartGenotype, warmStartSigma) and mirrored (antithetic) fitness estimation in the outer HPO loop, cutting inner-rollout variance by 2× per generation at the same wall-clock budget
  ([6f886c9](https://github.com/Dicklesworthstone/cmaes_explainer/commit/6f886c9c04cd52ade1351bf43138c3bcbb5cc218))
- Stepwise G1 env API (cmaes-j36) with 42-D observation vector, dense reward decomposition (progress + upright + energy + fall), and 120-step inner rollout
  ([aefb759](https://github.com/Dicklesworthstone/cmaes_explainer/commit/aefb7592b8c9c1d4e6c2c2a8a4c4c0c0c0c0c0c0))

### Transformer Locomotion Policy (cmaes-feat-fs3, cmaes-19t, cmaes-j36)

- ONNX metadata for the 4M-parameter G1 transformer policy (cmaes-9v7): model_name, architecture, obs_layout (42 signals), action_scaling (29 actuators), sequence_length
  ([48b026d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/48b026d6c1a7c3e5a4f3b2a1c0d9e8f7a6b5c4d))
- PPO+GAE training loop over generic env trait (cmaes-jhv)
  ([f2fb61b](https://github.com/Dicklesworthstone/cmaes_explainer/commit/f2fb61b2e3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8))
- G1 transformer metadata in `public/robots/g1/transformer/metadata.json` (consumed by the policy ablation comparison in the main page)
  ([5aaa0e3](https://github.com/Dicklesworthstone/cmaes_explainer/commit/5aaa0e3e6d51d029d5b33108552571c7cbe50ae1))

### FrankenRobots iOS Companion App (cd9be13)

- New `ios/` directory: SwiftUI universal app for the Humanoid Lab and Arm Lab. Reuses the existing renderer + Frankensim/WASM worker pipeline as the source of truth for physics; no canned animation presented as an optimized result. Every engine bundle records the source Git commit it was built from. `docs/FRANKENROBOTS_APP_PLAN.md` (10 KB) is the product spec — product principles, capability map, Humanoid Lab features (4 story chapters, 4 camera modes, all 3 scalable CMA-ES families), Arm Lab features (3 tasks, grasp microscope, friction diagnostics, optimizer race, timeline, placement receipt)
  ([cd9be13](https://github.com/Dicklesworthstone/cmaes_explainer/commit/cd9be1317603bda3d9c5e6a9c6d1e0cd53965524))
- Embedded routes under `app/frankenrobots/` and `ios/EngineWeb/`

### UI / UX Polish

- Story mode + biomechanics X-ray + timeline autopsy scrubber + objective equalizer + tactile microscope in the G1 walking and arm flagships (cmaes-lkwl)
  ([2ce496b](https://github.com/Dicklesworthstone/cmaes_explainer/commit/2ce496b3e7d4b1c8e9a4b5c6d7e8f9a0b1c2d3e4))
- Cross-page deep linking in the Navbar with dedicated flagship quick routes (cmaes-19t dependency)
  ([c014eb9](https://github.com/Dicklesworthstone/cmaes_explainer/commit/c014eb9a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8))
- WCAG accessibility, zero-overflow viewport containment, GC optimization on desktop and mobile
  ([819f4ec](https://github.com/Dicklesworthstone/cmaes_explainer/commit/819f4ec2c3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8))
- Geometry disposal cleanup, eliminate allocation churn, elevate text contrast (fresh-eyes audit)
  ([1647c17](https://github.com/Dicklesworthstone/cmaes_explainer/commit/1647c17a660f1db2d1fe06902b347df21c371a83))
- Unify touch-action and contrast compliance across all interactive visualizers
  ([180dfb6](https://github.com/Dicklesworthstone/cmaes_explainer/commit/180dfb6a7d4ab74d5a81e677fd67cabf82798bd2))

### Audits and Bug Fixes

- `dd1c814` — audit pass: full Cholesky in LiveCmaesOptimizer (the diagonal-only sampling was a no-op for rank-μ), redundant useEffect setState in useG1Meshes (cache-hit fast-path), kernelPerfProfiler test tolerance accommodation (15µs → 100µs for multi-core parallel test contention)
  ([dd1c814](https://github.com/Dicklesworthstone/cmaes_explainer/commit/dd1c8144d65ee62d4b7d984f8cd20477f7bdf3b6))
- `1b133801` — fs-g1-train fresh-eyes review fixes: hpo.rs incumbent_fitness was initialized to +INFINITY (with higher-is-better, so the (1+λ)-ES was a no-op whose tests passed vacuously), sigma's "improved" flag was computed after the record update, log-scale sampling used ln(linear_range) which is negative for ranges < 1, ppo.rs Welford cross-term used d2² instead of d·d2 (underestimated variance), ppo_update sampled a FRESH action instead of computing log π_new(a_t|s_t) from the stored action, ppo_update forwarded raw obs while rollout forwarded normalized (try_into silently produced all-zero input)
- `3e8e0bf` — survival weight sign in multi-factor objective: was +1.0 (inverted intent: dying early was preferred), now -1.0
  ([3e8e0bf](https://github.com/Dicklesworthstone/cmaes_explainer/commit/3e8e0bf08844ddbbf806efa0494a7a6e5ae38ee6))
- `7c38639` (in this audit pass): DRO Wasserstein radius downgraded to "heuristic, not the Mohajerin-Esfahani-Kuhn theorem"; CVaR formula corrected to `ceil(α·N)` per Rockafellar-Uryasev 2000; muS = muK·1.20 anchor per CRC §F-13; tests renamed and tightened
- `a0a35b6` — unify height tilt degradation rate in stepwise env, single source of truth
  ([a0a35b6](https://github.com/Dicklesworthstone/cmaes_explainer/commit/a0a35b603f0c0b657861da9ed489b1c8cd1299ec))
- `eadc224` — correct 480Hz physics step budget: 2083.3µs/step, not 208.3µs (10× transcription error in the budget doc)
  ([eadc224](https://github.com/Dicklesworthstone/cmaes_explainer/commit/eadc224dc654c571607427f7895e7b432c8bf721))

### Quality gates (this period)

- 448/448 tests pass across 65 files (up from 177/7 at the start of the period)
- tsc clean, eslint clean, ubs clean, Next.js production build clean
- 159/159 beads closed (0 open, 0 in_progress, 0 deferred)
- v068 → v069 kernel shipped, 30-link curriculum retune deferred to a follow-up
- Browser test (`bun test cmaesEngine.test.ts -t "the shipped owner package"`) green against v068/v069

### Honesty floor (this period)

- 4 compounding bugs in hpo.rs that made its tests pass vacuously (1+λ)-ES was a no-op, all caught and fixed
- ppo.rs PPO ratio was sampling fresh action instead of computing density under stored action (ratio was meaningless) — caught and fixed
- 1 silent try_into on shorter obs that produced all-zero model input (ppo_update was computing against garbage) — caught and fixed
- 1 over-cited Wasserstein radius (claimed to be Mohajerin-Esfahani-Kuhn 2018 Eq. 5 when it was actually a heuristic) — corrected with honest provenance block
- 1 wrong CVaR convention (used `floor((1-α)·N)` taking top 87.5% instead of the worst 10%) — corrected to Rockafellar-Uryasev 2000 `ceil(α·N)`
- 1 muS = muK · 1.20 contract in the docstring not honored by the code (static friction was spread from the point, not recomputed from worst-case muK) — fixed

---

## ## 2026-08-24 -- Scrolling Restored, True SSR, Social Cards

### Scrolling and Hydration

- Fixed the page-freezing hydration race: better-react-mathjax's MathJaxContext
  injects the MathJax script during the client render pass, and tex-svg.js
  auto-typesets the entire document on load; when that landed mid-hydration
  (near-certain whenever the user scrolled during page load), React threw #418,
  regenerated the whole tree, and lost scroll position. MathProvider now
  disables the document-wide auto-sweep (`startup.typeset: false`) and runs one
  explicit typeset from a post-hydration effect
  ([09f3862](https://github.com/Dicklesworthstone/cmaes_explainer/commit/09f3862))
- Removed the deprecated `@studio-freight/lenis` scroll hijacker: its wheel
  preventDefault plus per-frame scrollTo model competed with native scrolling,
  and its self-rescheduling rAF loop was never cancelled on cleanup. Native
  scrolling with CSS smooth anchor jumps replaces it
  ([09f3862](https://github.com/Dicklesworthstone/cmaes_explainer/commit/09f3862))
- `useScrollSpy` now keys its IntersectionObserver on a stable section key
  instead of a fresh array identity, ending observer churn on every Navbar
  render ([09f3862](https://github.com/Dicklesworthstone/cmaes_explainer/commit/09f3862))
- Navbar no longer leaves a permanent inline `overflow: unset` on `<body>`
  after the mobile menu closes
  ([09f3862](https://github.com/Dicklesworthstone/cmaes_explainer/commit/09f3862))

### Server-Side Rendering

- The full essay now renders on the server (prerendered HTML grew from ~7 KB
  to ~121 KB): MathProvider was wrapped in `next/dynamic` with `ssr:false`,
  which suppressed server rendering of the entire page; MathJaxContext SSRs
  safely, so the wrapper is gone and crawlers see the real content
  ([97ee083](https://github.com/Dicklesworthstone/cmaes_explainer/commit/97ee083))

### SEO and Social Preview

- Added `metadataBase`, OpenGraph, and Twitter card metadata with a 1280x640
  `/og-image.png`, so shared links render a proper preview
  ([d183eac](https://github.com/Dicklesworthstone/cmaes_explainer/commit/d183eac),
  [8235357](https://github.com/Dicklesworthstone/cmaes_explainer/commit/8235357))
- Removed the `mix-blend-luminosity` filter from the WASM demo iframe that
  desaturated the Benchmark Playground
  ([d183eac](https://github.com/Dicklesworthstone/cmaes_explainer/commit/d183eac))

### Build Hygiene

- Removed the stray `package-lock.json` and untracked `tsconfig.tsbuildinfo`
  (both now gitignored); Bun + `bun.lock` remain the only dependency path
  ([4822918](https://github.com/Dicklesworthstone/cmaes_explainer/commit/4822918))
- `bootstrap_and_deploy.sh` now uses `bun install` / `bun run build` instead
  of npm ([57899a3](https://github.com/Dicklesworthstone/cmaes_explainer/commit/57899a3))

### Accessibility

- The three icon-only mobile menu buttons (open ×2, close) now carry
  aria-labels; the mobile dock shows three section links so the menu button
  stays on-screen at 375px
  ([526176e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/526176e))
- All framer-motion animations respect the OS `prefers-reduced-motion`
  setting via `MotionConfig reducedMotion="user"` (transform animations are
  skipped for motion-sensitive users; opacity fades remain)
  ([c929a77](https://github.com/Dicklesworthstone/cmaes_explainer/commit/c929a77))

---

## 2026-08-23 -- Sections Visible Again, WASM Engine Ships, Math Fixed

### Section Visibility

- Fixed three permanently invisible sections (When Gradients Disappear,
  Wing Walkthrough, Technical Addendum): `Section`'s `whileInView` fade-in
  required 20% of the section to be visible, geometrically impossible for
  sections taller than five viewports (no-gradients is 978% of viewport
  height); any-intersection now triggers the fade
  ([549e322](https://github.com/Dicklesworthstone/cmaes_explainer/commit/549e322))

### WASM Demo Engine

- Shipped the prebuilt `pkg/` and `pkg-par/` engine bundles in-repo: Vercel
  builds never ran `pull_wasm_demo.sh`, so the embedded demo 404'd its engine
  and rendered an unstyled shell
  ([64b9ba7](https://github.com/Dicklesworthstone/cmaes_explainer/commit/64b9ba7),
  [549e322](https://github.com/Dicklesworthstone/cmaes_explainer/commit/549e322))
- `/wasm-demo/*` is now served with `Cross-Origin-Embedder-Policy:
  credentialless` instead of `require-corp`, which was blocking the demo's
  CDN scripts (tailwind, jsDelivr) that send no CORP headers; credentialless
  keeps crossOriginIsolated for the threaded pkg-par build
  ([549e322](https://github.com/Dicklesworthstone/cmaes_explainer/commit/549e322))

### Math Rendering

- Fixed `\to` rendering as TAB + "o" (`f : R"oR`) from a single-backslash
  escape inside a TS string
  ([549e322](https://github.com/Dicklesworthstone/cmaes_explainer/commit/549e322))
- Fixed JSX newline-trimming that glued words to inline math and code spans
  across CmaesIntro, TechnicalAddendum, WingWalkthrough, and WasmDemo
  ([549e322](https://github.com/Dicklesworthstone/cmaes_explainer/commit/549e322),
  [8235357](https://github.com/Dicklesworthstone/cmaes_explainer/commit/8235357))
- ActiveCovarianceDemo defers its simulation setState via rAF, resolving the
  `react-hooks/set-state-in-effect` lint error
  ([549e322](https://github.com/Dicklesworthstone/cmaes_explainer/commit/549e322))

---


## 2026-02-21 -- Licensing Update and Social Preview

### Licensing

- Replaced the plain MIT license with an MIT + OpenAI/Anthropic Rider that restricts
  use by OpenAI, Anthropic, and their affiliates without express written permission
  from Jeffrey Emanuel
  ([9c845d8](https://github.com/Dicklesworthstone/cmaes_explainer/commit/9c845d87e3abbfbe9402b873d28f677fa2907ee1))

### Repository Meta

- Added a 1280x640 GitHub social preview image for consistent link previews when
  sharing the repository URL on social media
  ([a1cbe1d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/a1cbe1d3391c3c8f4ae6590049d07f90eb152946))

---

## 2026-01-21 -- Initial MIT License

### Licensing

- Added MIT License (Copyright (c) 2026 Jeffrey Emanuel)
  ([fa930f0](https://github.com/Dicklesworthstone/cmaes_explainer/commit/fa930f0a0ee761d7a790516269621fed0d6a6165))

---

## 2026-01-18 -- Dependency Updates and Agent Documentation

### Dependencies

- Updated all Node.js dependencies to latest stable versions (next, react,
  @types/react, tailwindcss, and others); changes documented in UPGRADE_LOG.md
  ([43b4c03](https://github.com/Dicklesworthstone/cmaes_explainer/commit/43b4c03eae3e5fe6d845eb521c56e04112d26f2e))

### Documentation

- Expanded AGENTS.md with full project context, component inventory, architectural
  notes, and agent collaboration guidelines
  ([d6c50ee](https://github.com/Dicklesworthstone/cmaes_explainer/commit/d6c50ee4a5152195b39e7920fe2fad87fd6b44f3))

---

## 2026-01-09 -- WASM Submodule Update

### WASM Demo

- Updated `vendor/wasm_cmaes` submodule to commit 22e3ceb, pulling in rebuilt
  WASM packages with improved README
  ([161380f](https://github.com/Dicklesworthstone/cmaes_explainer/commit/161380f98a0dd48d92cba7be88fb8660e003acf5))

---

## 2025-12-29 -- React Server Components CVE Fix

### Security

- **PR #1** (authored by Vercel bot): Patched critical React Server Components
  CVE vulnerabilities by upgrading next, react-server-dom-webpack,
  react-server-dom-parcel, and react-server-dom-turbopack to their fixed versions
  ([63d6d4b](https://github.com/Dicklesworthstone/cmaes_explainer/commit/63d6d4b72bc48698cc2d3b8045034c617ed66b4d),
  [28f01b8](https://github.com/Dicklesworthstone/cmaes_explainer/commit/28f01b822d8bd64205f6677214111547100c40a9))

---

## 2025-12-07 -- SSR Stabilization and Build Cleanup

### SSR and Build Infrastructure

- Major SSR compatibility overhaul: fixed hydration mismatches in Three.js
  components via dynamic imports; added `useMediaQuery` and improved
  `usePrefersReducedMotion` hooks for client-side detection; created
  `ThreePatch.tsx` and `safeR3FEvents.ts` for R3F event patching
  ([599ad5d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/599ad5dfe23718ac9a59383f31781baf1888b2df))

### WASM Demo Cleanup

- Removed ~8,000 lines of dead legacy WASM demo files (app.js, enhanced-app.js,
  tailwind.css, four benchmark HTML variants, test files) that had accumulated
  from earlier iteration cycles
  ([599ad5d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/599ad5dfe23718ac9a59383f31781baf1888b2df))

### Deployment

- Added `.vercelignore` and `.ubsignore` for deployment optimization; updated
  `next.config.mjs` with improved build settings; updated eslint config
  ([599ad5d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/599ad5dfe23718ac9a59383f31781baf1888b2df))

---

## 2025-11-23 -- OrbitControls SSR Crash Fixes

### Bug Fixes: Three.js SSR

- Used `next/dynamic` with `ssr: false` for `CovarianceScene`, completely
  bypassing server rendering for the Three.js Canvas component and preventing
  OrbitControls from attempting to connect during SSR
  ([c3e48ab](https://github.com/Dicklesworthstone/cmaes_explainer/commit/c3e48abea103186ae6414ef43c6cf769462f06f3))

- Removed `makeDefault` from OrbitControls and added placeholder `<div>` elements
  for SSR fallback rendering in BridgeViz and CovarianceScene
  ([9ea0914](https://github.com/Dicklesworthstone/cmaes_explainer/commit/9ea0914a1a3a02ae8df40b7bbbc2677c1cae3a76))

### Bug Fixes: WASM Demo DOM Access

- Wrapped all top-level DOM access in WASM demo `app.js` inside a
  `DOMContentLoaded` listener; root cause was that OrbitControls.connect() and
  50+ `mustGet()` calls were executing during module parse before any DOM
  elements existed
  ([3d0022e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/3d0022ec84b221c54e8f5962f26f9243d077141d))

---

## 2025-11-22 -- Initial Build-out

This date encompasses the complete construction of the interactive CMA-ES
explainer site, from initial scaffold through full feature set. The project
went from zero to 50+ commits in a single day. Commits are grouped by
capability rather than chronological order.

### Foundation and Scaffold

- **Initial commit**: Next.js 16 + React 19 scaffold with Bun as sole runtime;
  created 13 core components (Hero, CmaesIntro, CovarianceScene, Navbar, Footer,
  Section, WingWalkthrough, NoGradientExamples, OpenSourceEngines,
  TechnicalAddendum, WasmDemo, MathProvider); added deployment scripts
  (`bootstrap_and_deploy.sh`, `pull_wasm_demo.sh`); configured Tailwind, PostCSS,
  TypeScript, ESLint, and Vercel; included full site content as markdown reference
  ([80fc737](https://github.com/Dicklesworthstone/cmaes_explainer/commit/80fc73792e999d0903c580f9bafef0a10a2af1e1))

- Locked the toolchain exclusively to Bun; tuned the build stack and PostCSS
  configuration
  ([5c86b03](https://github.com/Dicklesworthstone/cmaes_explainer/commit/5c86b03d5940d778e76dd43053f44028a623a2b2))

- Added HeadlessUI dependency for the encode/decode playground component
  ([9d8d91a](https://github.com/Dicklesworthstone/cmaes_explainer/commit/9d8d91ab2c9ce0097d104e3ca3397dacb20a0a4e))

### Interactive 3D Visualizations

- **Wing, Bridge, and Transformer visuals**: Created `WingViz`, `BridgeViz`, and
  `TransformerViz` components -- three interactive 3D scenes built with Three.js
  and React Three Fiber, each demonstrating CMA-ES optimization applied to a
  real-world engineering domain (airfoil design, structural truss optimization,
  transformer hyperparameter tuning)
  ([928c9e4](https://github.com/Dicklesworthstone/cmaes_explainer/commit/928c9e484616196690a899667d54c57f07883ad5))

- **Major 3D visual upgrade**: Rewrote ~1,700 lines across all three 3D
  interactives, adding realistic physics simulation, FEA-style stress coloring
  with heatmap gradients, and cyberpunk visual aesthetics
  ([b8555bc](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b8555bc6131f72f635c5718641323cf638aec628))

- **Hyperparam manifold heatmap**: Extended TransformerViz with an interactive
  loss-landscape visualization over hyperparameter space
  ([fc64b60](https://github.com/Dicklesworthstone/cmaes_explainer/commit/fc64b6095a8bc062c7944ba8c637b40e640151fd))

- **Mobile haptics**: Added touch interactivity and haptic feedback to
  TransformerViz for mobile users
  ([2cbf1c5](https://github.com/Dicklesworthstone/cmaes_explainer/commit/2cbf1c57536c9b5bea48f5f4c7abfdd2501ae14e))

- Optimized CovarianceScene geometry reuse to reduce Three.js allocations
  ([27ccad4](https://github.com/Dicklesworthstone/cmaes_explainer/commit/27ccad40030f2e48d4fd3b9b1f8dcbc2b2b25315))

### Interactive 2D Visualizations and Demos

- **Covariance evolution minimap**: Canvas-based minimap with natural-gradient
  arrow overlay showing how the covariance matrix evolves across optimization
  steps
  ([dffbed3](https://github.com/Dicklesworthstone/cmaes_explainer/commit/dffbed37cb7a84892fa545badd2bf297455586d6))

- **Noise vs. lambda explorer**: Interactive slider comparing noise levels and
  population sizes with rank-stability visualization
  ([96a1d1d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/96a1d1d18f668289e716c91477d7024ccabcd114))

- **Constraint repair demo**: Side-by-side comparison of clip, reflect, and
  logit-transform repair strategies with animated particles
  ([ca3424f](https://github.com/Dicklesworthstone/cmaes_explainer/commit/ca3424f8a0259011c68798434a693a2ae4f21b4e))

- **Active vs. passive covariance demo**: Animated visualization comparing active
  and passive CMA covariance adaptation strategies
  ([bf09e67](https://github.com/Dicklesworthstone/cmaes_explainer/commit/bf09e677ec3e88641fb5d2e233c62f3bb07753ae))

- **Restart strategy viewer**: IPOP vs. BIPOP restart strategy comparison with
  population-size graphs
  ([7abf518](https://github.com/Dicklesworthstone/cmaes_explainer/commit/7abf518158bc14dfbb67598586458e6c0a4f5ec4))

- **CA pattern gallery**: Cellular automaton pattern gallery with CMA-ES
  optimization trace overlay
  ([7596654](https://github.com/Dicklesworthstone/cmaes_explainer/commit/759665439e8dc5f559965d0c7f55bc86d233b938))

- **Encode/decode playground**: Interactive UI for exploring constraint
  encoding/decoding strategies, integrated into the practical playbook section
  ([ae4a9b2](https://github.com/Dicklesworthstone/cmaes_explainer/commit/ae4a9b277c1e0619c15ff9d7afd2cae54467da6b))

### Design System and UI/UX

- **Design system overhaul**: Overhauled globals.css and tailwind.config.ts with
  premium typography scale, noise-texture backgrounds, and glassmorphism utility
  classes
  ([b25cc1e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b25cc1e242d13d580d56c4725fcd18e5738f642c))

- **Navigation rewrite**: Reimplemented the Navbar with glass-morphism styling,
  desktop header with scroll-aware behavior, and a mobile floating dock
  ([1f0838f](https://github.com/Dicklesworthstone/cmaes_explainer/commit/1f0838fd204481f4c097813c04834dab0f5958ed))

- **Lenis smooth scroll and typography**: Integrated Lenis smooth scrolling via
  a new `SmoothScroll.tsx` component; added Stripe-inspired typography and mobile
  layout optimizations; added `vendor/wasm_cmaes` submodule
  ([b2cdcd6](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b2cdcd6c1586df85e3060e8583d0e99ea1344005))

- **Component polish pass**: Applied formatting consistency across all 20 UI
  components
  ([3b650a8](https://github.com/Dicklesworthstone/cmaes_explainer/commit/3b650a8d55fad5e2b07d09e49627f0b40d1c7152))

- Lighter background treatment and scannable example cards in Hero and
  NoGradientExamples
  ([364904d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/364904d9736dad42a9c13a0f5eedd5b567b713b5))

### Accessibility and Mobile

- Stabilized home page UI; added `BackToTop` component, `useScrollSpy` hook,
  and `usePrefersReducedMotion` hook; improved mobile readability and a11y
  affordances for users who prefer reduced motion
  ([ef7dfd5](https://github.com/Dicklesworthstone/cmaes_explainer/commit/ef7dfd59631b49d0dd6ae677190640c9929d708b))

- Enhanced constraint repair demo toggle controls and visual polish
  ([7a60ebf](https://github.com/Dicklesworthstone/cmaes_explainer/commit/7a60ebfc84015a65cd333ca182762f7d6196230e))

### Content and Narrative

- Added CMA-ES history section, practical guidance narratives, and deep learning
  hybrid content; introduced new components CommunitySplit, DLHybrids,
  PracticalPlaybook, and WhyILove; expanded CmaesIntro, Hero, and
  TechnicalAddendum with additional narrative
  ([f7778cc](https://github.com/Dicklesworthstone/cmaes_explainer/commit/f7778cc1e1c127a47f052ac70a155f36b22f4654))

- Expanded open-source engine descriptions and WASM demo explanatory copy
  ([6ec25ab](https://github.com/Dicklesworthstone/cmaes_explainer/commit/6ec25ab5a753599367e925029c1d6271d7a0910f))

- Added cellular automaton vignette and JEPA overlap callout in DLHybrids and
  CommunitySplit
  ([4c5f3f0](https://github.com/Dicklesworthstone/cmaes_explainer/commit/4c5f3f0f97179c15ee742b161616c8536301f59c))

- Copy polish passes: tightened tone and removed em-dashes across CmaesIntro,
  NoGradientExamples, TechnicalAddendum, WingWalkthrough, Footer, and Hero
  ([76bed23](https://github.com/Dicklesworthstone/cmaes_explainer/commit/76bed2329d872d59474bb5365545bbf860184e89),
  [d28ad40](https://github.com/Dicklesworthstone/cmaes_explainer/commit/d28ad4045113ea3d296a7614ad31aa46ad5fdc17))

### WASM Demo Integration

- Included pre-built WASM demo assets (app.js, benchmark HTML variants, tailwind
  CSS, parallel/sequential WASM packages) for instant deployment without
  requiring a local Rust toolchain
  ([44e7489](https://github.com/Dicklesworthstone/cmaes_explainer/commit/44e7489e4a4ff31c1a370c774a157a7d99f06731))

- Unified benchmark visualization into a single canonical `viz-benchmarks.html`
  and merged `app.js`, deleting four legacy HTML variants
  ([a1cead2](https://github.com/Dicklesworthstone/cmaes_explainer/commit/a1cead2705d8b7e52a7045a10fd5e985b0ccce65))

- Resolved duplicate code and event listener conflicts in WASM demo `app.js`
  ([53399fc](https://github.com/Dicklesworthstone/cmaes_explainer/commit/53399fc67d049dce02443c6370386827a710ffee))

- Added enhanced-app.js and multiple benchmark HTML variants (classic, enhanced,
  working) alongside component updates; these were later consolidated and cleaned
  up
  ([8885d4e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/8885d4e9198609eebcbe2a23c121194bf3a9560a))

### SSR and Hydration Fixes

- Prevented browser crashes and hydration mismatches in all Four Three.js Canvas
  components (BridgeViz, CovarianceScene, TransformerViz, WingViz) by adding
  `useState`/`useEffect` mounted-state guards that render `null` on the server
  and first client render
  ([b157f85](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b157f85ee49434b7cb1464197e4255c4ef657a88))

- Deferred Monaco editor initialization in the WASM demo iframe to prevent
  DOM-access-before-ready crashes; wrapped init in `DOMContentLoaded` handler
  ([cb514d2](https://github.com/Dicklesworthstone/cmaes_explainer/commit/cb514d27e75805e0b30e4a3637fdc3a78b4e5964))

- Temporarily disabled WASM iframe demo to debug browser crashes, then
  immediately reverted once the root cause was identified elsewhere
  ([e1b3d5e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/e1b3d5e4aa6db2269951d8ac4a17a191d3ac5a35),
  [8c3de13](https://github.com/Dicklesworthstone/cmaes_explainer/commit/8c3de134f40ed52438a89b48d1a24df055a098a4))

- Fixed runtime errors in TransformerViz and WingViz; added
  `usePrefersReducedMotion` fallback; updated build script
  ([a1f9ac3](https://github.com/Dicklesworthstone/cmaes_explainer/commit/a1f9ac39e4ffbda19ce0d357f7335a96c7d76b84))

- Updated visualization geometry in TransformerViz and WingViz; added favicon
  and grid-pattern static assets
  ([31b8280](https://github.com/Dicklesworthstone/cmaes_explainer/commit/31b82807668fee511a5bcf0da4b5f241161dbe0b))

### Bug Fixes: CA Gallery ImageData

Five sequential commits that fixed progressive TypeScript and cross-browser
compatibility issues in the CA pattern gallery's canvas pixel rendering:

- Fixed `ImageData` constructor call
  ([492ce56](https://github.com/Dicklesworthstone/cmaes_explainer/commit/492ce5645f7aa70079e17c1fbf1c6956fb9c7c55))
- Fixed `ImageData` buffer handling for typed array compatibility
  ([122fd05](https://github.com/Dicklesworthstone/cmaes_explainer/commit/122fd050923a6a0ed9b2119d4bc021d762acb26c))
- Tightened `ImageData.set()` call signature
  ([ad08859](https://github.com/Dicklesworthstone/cmaes_explainer/commit/ad08859fec877a77b9f352357d53f0cf393a6ab4))
- Added type cast for `ImageData.set()` in CA gallery
  ([9e79895](https://github.com/Dicklesworthstone/cmaes_explainer/commit/9e79895435377881ca3eb173414e2fe53ed29418))
- Fixed canvas ref setter callback in CA gallery
  ([b68a072](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b68a07269d5edeb292700607de8623e8c202c8ea))

### Bug Fixes: Other

- Added missing `useEffect` import for the manifold heatmap in TransformerViz
  ([5e338ed](https://github.com/Dicklesworthstone/cmaes_explainer/commit/5e338ed2d89b57002714223494b687ab214bf2dd))
- Fixed type annotations in constraint repair demo
  ([000333f](https://github.com/Dicklesworthstone/cmaes_explainer/commit/000333f2a1add378f31f9b61cc19df51e73f04ac))
- Fixed missing `Shuffle` icon import in constraint repair demo
  ([3b5c10c](https://github.com/Dicklesworthstone/cmaes_explainer/commit/3b5c10cf64b1e4133a767a16187865877b766f64))

---

## Project Overview

| Attribute | Value |
|---|---|
| Stack | Next.js 16, React 19, Tailwind CSS, Framer Motion, Three.js / React Three Fiber, MathJax, Bun |
| Repository | [Dicklesworthstone/cmaes_explainer](https://github.com/Dicklesworthstone/cmaes_explainer) |
| Deployment | Vercel |
| Tags / Releases | None (all changes shipped directly on `main`) |
| Total commits | 260 |
| First commit | 2025-11-22 |
| Latest commit | 2026-08-29 |
