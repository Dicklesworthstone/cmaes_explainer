# FrankenRobots Universal App Plan

Status: active implementation. Every built engine records its exact
`cmaes_explainer` source revision, the inspected FrankenSim workspace revision,
and the versioned robotics-owner identity; this document does not pin a stale
launch commit.

FrankenRobots is a focused, native-feeling laboratory for the two physically grounded robotics experiences in CMA-ES Explainer:

- **Humanoid Lab** — the 29-DoF Unitree G1, its 5,040-parameter locomotion policy, terrain and push challenges, story chapters, biomechanics, objective shaping, timeline, and source receipts.
- **Arm Lab** — the 7-DoF KUKA LBR iiwa 7 R800 household manipulation benchmark, its 128-parameter trajectory, three reduced scenes, grasp microscope, friction diagnostics, optimizer race, timeline, and collision-safe placement receipt.

The app must not become a generic website wrapper. Its app-level navigation, information hierarchy, status, platform adaptation, accessibility, and lifecycle are native SwiftUI. The existing renderer and Frankensim/WASM worker pipeline remain the source of truth for physics until a measured native renderer can reproduce the same receipts. No canned animation may be presented as an optimized result.

## Product principles

1. **The robot is the first screen.** Website navigation, marketing hero copy, footer, and long-form prose do not appear inside the app lab.
2. **Watch, steer, inspect, compare.** The primary loop is: choose a challenge, run or replay, scrub the trace, inspect a physical diagnostic, then compare receipts.
3. **Progress is factual.** Show completed generation count, candidate count, elapsed time, best objective, and current stage. Do not invent percentages when the worker cannot provide a bounded total.
4. **Receipts outrank spectacle.** The animation can be spectacular, but every success claim comes from the owner kernel: horizon/termination for G1 and grasp/transport/release/place for the arm.
5. **Private by construction.** Production engine assets are bundled. Simulation state and receipts stay on the device unless the user explicitly shares a receipt. No account, analytics, tracking, or third-party AI service.
6. **Source freshness is explicit.** Every engine bundle records the source Git commit it was built from. Active web development can be synchronized deliberately without silently changing an App Store binary.

## Capability map

### Humanoid Lab

- Curriculum replay and live CMA-ES optimization.
- Balance, stepping, and walking tasks.
- Flat and terrain-plus-push challenges.
- Separable CMA-ES, LM-CMA, and LM-MA; dense full CMA remains honestly refused at 5,040 dimensions.
- Four story chapters: puppet, faceplant, footfalls, obstacle mastery.
- Orbit, follow, first-person, blueprint, and free-fly cameras (free-fly is 6-DOF WASD + Q/E + RMB drag, bounded to the workbench envelope).
- Free-fly keybinding discoverability banner (`FreeFlyHintBanner`): a prominent bottom-center overlay that surfaces the WASD + Q/E + RMB drag controls with ARIA `role="status"`; auto-dismisses after 8 seconds.
- Touch & ragdoll dragging with continuous collision detection and swept-volume penetration projection.
- Play/pause, seek, reset, slow motion, and accelerated replay.
- Center of mass, support polygon, ground reaction, and ZMP overlays.
- Cautious Monk, Olympic Sprinter, and Glass-Floor Walker objective presets plus per-channel weighting.
- Physics debug overlay (the "🔧 Physics" button): toggleable visualization of the 30 body-link collider spheres, the 74-piece house OBB catalogue as wireframe boxes, and the current pelvis safety sphere. Disabled by default with zero JSX output.
- Physical receipt: distance, speed, work, slip, posture, impacts, contacts, terrain, push recovery, limits, and exact termination.


### Arm Lab
- Kitchen mug, living-room remote, and backyard trowel tasks.
- Curriculum replay and live CMA-ES optimization.
- Full, separable, LM-CMA, and LM-MA at the honest 128-D comparison scale.
- Studio, grasp-microscope, overhead, and free-fly cameras (free-fly is 6-DOF WASD + Q/E + RMB drag, bounded to the workbench envelope).
- Free-fly keybinding discoverability banner (shared with the Humanoid Lab).
- Play/pause, seek, reset, and replay-speed controls.
- Gripper width, pinch force, Coulomb friction capacity, grasp state, and object halo.
- Touch & orange-drag target manipulation with continuous collision detection and surface clamping; the drag target is also gated by a 2 cm residual reachability solver (DLS-IK) so the operator cannot place the target outside the arm's reachable workspace.
- Physics debug overlay (the "🔧 Physics" button): toggleable visualization of the 8 KUKA link collider spheres, the 74-piece house OBB catalogue as wireframe boxes, the arm's reachable workspace as a translucent green point cloud (sampled once at module load), and the current target safety sphere. Disabled by default with zero JSX output.
- Physical receipt: reach error, lift, work, clearance, collision risk, grasp timing, peak force, release, and placement.

### Collision-guard chain (both labs)

The user-facing focused routes enforce a four-primitive geometric guard chain that the policy (transformer or CMA-ES) cannot violate at the user surface. The chain is the SOTA penetration-depth / contact-manifold math from `docs/SOTA-MATH.md` (Ericson, *Real-Time Collision Detection*; Bergen, *Collision Detection in Interactive 3D Environments*; Jo/Zhang/Yang/Luo, *Geometry-Aware Control Barrier Functions*), deployed as:

- **Spawn-safe** — on first trace load, a coarse grid sweep over the house bounds returns the first interior point at which the per-drag clamp reports `isColliding = false` with a 0.35 m safety radius (larger than any body collider sphere). The first frame is provably collision-free.
- **Per-drag OBB clamp** — the OBB Signed Distance Function with conservative push-out; the dragger's `isColliding` flag fires whenever the proposed position has any OBB with signed distance `< safeRadius`. Visualized live as a red badge.
- **Reachability guard** — for the arm, a 30-iteration Damped Least Squares (DLS) IK attempt with 2 cm residual tolerance. If the proposed target is not reachable, the dragger holds the previous good target and surfaces a "⛔ Unreachable — Workspace Limit" badge. Implements the SOTA conservative-advance from CBF literature.
- **Continuous Collision Detection (CCD)** — swept-volume penetration projection; per-step displacement bounded by the joint speed limit so a discrete step cannot miss a wall.

39 regression tests across 5 files bound the chain (`tests/houseMultiObstacleKernel.test.ts`, `tests/g1SpawnSafety.test.ts`, `tests/g1CollisionSafety.test.ts`, `tests/armReachabilityAndSpawn.test.ts`, `tests/flagshipSpawnSafeAlgorithm.test.ts`, `tests/physicsDebugOverlayDisabled.test.ts`). See `docs/SOTA-HUMANOID-POLICIES.md` §3.1 for the full SOTA framing and `README.md` "The collision-guard chain (no policy can tunnel a wall)" for the user-facing summary.

## Platform-specific information architecture

### iPhone

- Compact branded masthead and a two-choice Humanoid/Arm selector.
- Simulation stage owns the remaining height; the main screen does not vertically scroll.
- A compact status rail communicates engine state and the current receipt.
- Controls and education live in a native detented inspector sheet with tabs for Run, Inspect, Story, and Receipt.
- Landscape prioritizes the stage and collapses the masthead.

### iPad

- Compact portrait widths: stage above a compact inspector, with no scrolling unless Dynamic Type or a genuinely expanded detail requires it.
- Large portrait widths and landscape: stage and inspector side by side, roughly 65/35, whenever both remain comfortably usable.
- Pointer hover, keyboard shortcuts, and drag-to-scrub supplement touch without replacing it.

### Mac Catalyst

- Normal resizable window; no arbitrary maximum size and no forced fullscreen.
- Stage and inspector resize continuously. The minimum is only large enough to keep controls operable.
- Menu commands and keyboard shortcuts cover lab switching, play/pause, replay, camera cycling, and inspector visibility.
- Typography scales for desktop viewing distance instead of reusing phone-sized labels.

## Architecture

```text
SwiftUI app shell
  -> RobotLabModel (selected lab, native lifecycle, status)
  -> RobotEngineHost (WKWebView adapter and typed bridge)
  -> loopback-only static server (production bundle)
  -> focused /frankenrobots/humanoid or /frankenrobots/arm route
  -> existing React + Three.js renderer
  -> existing Web Worker pool
  -> pinned Frankensim robotics-owner WASM artifact
```

The robotics-owner artifact and the live upstream FrankenSim workspace are
related but not interchangeable provenance claims. The current upstream
`fs-cmaes-viz-wasm` crate remains the separate low-dimensional teaching
surface; its package version must never be used to describe the robot ABI.
Likewise, newer upstream `fs-dfo` / `fs-ascent` APIs—including NSGA-II/III,
MOEA/D, bounded Pareto archives, hypervolume accounting, gradient Pareto
tracing, versioned mating/normalization identities, and production WFG1-WFG9
evaluators—are source capabilities until a versioned browser ABI, robot receipt
contract, and parity battery admit them into this runtime.

The focused routes render only the flagship lab. They are also useful for deterministic visual regression testing in the web repository.

The loopback server exists because the current worker/WASM runtime needs ordinary HTTP origins and cross-origin isolation. It binds only to `127.0.0.1`, serves only bundled files, rejects traversal, allows only `GET` and `HEAD`, and emits COOP, COEP, and CORP headers. Production navigation is restricted to that loopback origin. This is not a remote network service.

The bridge schema will be versioned before native controls mutate engine state. Initial bridge messages:

- `engine.ready`: route, schema, owner-kernel version, supported commands.
- `run.status`: stage, generation, candidate, elapsed seconds, best objective.
- `trace.state`: sample index, sample count, playing, speed.
- `receipt.updated`: typed Humanoid or Arm receipt.
- Native commands: select task/challenge/family, optimize, replay curriculum, play, pause, seek, set camera, set overlay, and set objective weights.

Until that schema is implemented and tested, Web content retains control ownership. The native shell must not display controls that merely look functional.

## Engine synchronization

`ios/prepare-engine.sh` builds the isolated two-route Next.js target in `ios/EngineWeb`, copies that static export plus the pinned public assets into the app resource bundle, and records the source commit. Keeping the export target separate preserves the website's intentionally dynamic social-card routes. A fresh export is required whenever either flagship, worker contract, WASM package, or public robot asset changes.

Active-development policy:

1. Sync only from a clean, reviewed source commit.
2. Run web unit/type/lint gates first.
3. Export and run both focused routes in a desktop browser.
4. Build the app for iPhone simulator, iPad simulator, and Mac Catalyst.
5. Run a curriculum replay on each route and confirm the owner receipt appears.
6. Record the source commit in the app About/Diagnostics view.

## Visual system

- Near-black and deep emerald foundation shared with the Franken suite.
- Humanoid accent: electric cyan. Arm accent: restrained amber.
- Friendly Frankenstein inventor icon with a large, uniform `R` badge.
- Rounded native material panels, restrained glow, high contrast, and readable proportional typography for explanations.
- Monospaced text is reserved for receipts, parameters, timings, dimensions, and kernel identifiers.
- Motion conveys state: a stable optimization orbit, contact pulses, trace progress, and grasp force. It must never flash, vibrate, or relayout labels every frame.
- Reduce Motion replaces continuous scene decoration with discrete state transitions; Reduce Transparency increases panel opacity.

## Milestones

### M0 — shell and truthful engine boundary

- Universal XcodeGen project, icon, privacy manifest, native masthead, lab selector, adaptive layouts, status and diagnostics.
- Focused web routes.
- Bundled static-export pipeline and loopback-only server.
- Real web engine visible in the native stage; no fake results.

### M1 — typed native control bridge

- Versioned messages and commands.
- Native run controls, task/challenge selectors, timeline, cameras, and overlays.
- Native receipt cards and shareable JSON receipt file.
- Lifecycle pause/resume and memory-pressure recovery.

### M2 — spectacular native integration

- Live Activity and Dynamic Island for long optimization runs.
- Widgets for recent best receipt and quick launch into either lab.
- App Intents and Shortcuts for replay/run/open receipt.
- Haptics for foot contact, fall, first grasp, release, and verified placement.
- Document type for importing/exporting versioned run receipts.

### M3 — release hardening

- Fully offline production engine verified on a clean device with networking disabled.
- VoiceOver, Dynamic Type, Reduce Motion, contrast, pointer, keyboard, and rotation audits.
- iPhone, iPad, and Mac visual regression set.
- Memory, thermal, background/foreground, WebContent-process termination, and corrupted-bundle recovery tests.
- App Store privacy, screenshots, metadata, worldwide availability, and review notes based on measured behavior.

## M0 acceptance criteria

- Humanoid and Arm focused routes build and render independently.
- App launches without remote network access and serves engine assets only from loopback.
- Switching labs changes the focused engine route without exposing website chrome.
- Phone main screen does not require app-level vertical scrolling.
- iPad adapts by available width: compact portrait stacks, while large portrait and landscape use side-by-side space when both panes remain comfortably usable.
- Mac window resizes from the documented minimum to a large desktop window without clipping or forced scrolling in the native shell.
- Failed engine startup has a clear retry action and never leaves a blank stage.
- The icon is present at 1024 px and contains one legible `R` badge.
- No telemetry, account, tracking identifier, or third-party AI/data-sharing path exists.

## Explicit non-claims for the first development build

- The renderer is WebKit-hosted, not a native Metal renderer.
- The focused route does not yet imply that every control is native.
- No App Store submission should occur until the bundled engine, typed bridge, accessibility, and offline device gates above are complete.
