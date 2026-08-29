# Epic 3: Frankensim dynamic-physics kernel (multi-body, contact, rolling, friction)

**Owns:** the `frankensim` kernel's multi-body dynamics, contact resolution, rolling contact, friction models, and articulated body solver. Plus the `fs-cmaes-viz-wasm` schema that exposes them to the browser.

**Why now:** the user directive is "this will require ultra accurate clipping detection and physical boundary detection so the physics are accurately modeled with ~/projects/frankensim physics." And: "furniture and other assets ... can be jostled, fall down, roll if possible, etc. Like real objects." None of this is possible with the current schema-2 single-obstacle scene struct.

**Reference points (SOTA 2025-2026):**
- Bullet3 Multi-Body Dynamics (Featherstone) — https://deepwiki.com/bulletphysics/bullet3/2.5-multi-body-dynamics
- phyz-rigid (Rust Featherstone, differentiable Jacobians) — https://lib.rs/crates/phyz-rigid
- softmata/featherstone (Rust forward/inverse dynamics) — https://github.com/softmata/featherstone
- DART dynamics pipeline — https://deepwiki.com/dartsim/dart/3.3-dynamics-computation-pipeline
- Bullet3 overview — https://deepwiki.com/bulletphysics/bullet3
- "Collision detection in multibody problems: State of the art" (IMechE 2026) — https://journals.sagepub.com/doi/10.1177/14644193261425501

## Background and goals

The current `fs-cmaes-viz-wasm` v067 schema carries:
- One `scene.obstacleCenterMeters / HalfExtents` (one OBB)
- One `scene.goalMeters`
- A G1 robot
- A contact / friction model that handles the robot-foot-vs-plane

The user is asking for the household to feel like real life: a robot bumps a chair, the chair skids, then a glass on a side table tips, the glass hits the floor and the kernel resolves the secondary impact, the G1 has to either step over or detour. **Today the kernel can't do that.** It has one obstacle slot, no secondary contacts, no rolling, no articulated furniture, no contact graph, no broadphase.

This epic delivers the multi-body, contact-resolving, rolling, friction-modeling kernel. The WASM exposes a new schema (schema-8: v068) — gated by the same `refusal envelope` policy as previous schema bumps.

## Sub-tasks (children)

- `cmaes-ph1` (P1, feature): **Articulated-body solver (Featherstone ABA + RNEA)** — given a tree of links with mass, inertia, and joint type, compute forward dynamics O(n) and inverse dynamics O(n). Unit tests vs hand-computed double-pendulum and 3R arm values; gradient-check against finite differences (the standard `phyz-rigid` pattern). Lives in a new `frankensim/crates/fs-mbd` crate.
- `cmaes-ph2` (P1, feature): **Rolling contact** — a cylinder / sphere in contact with a plane: integrate forward with `rollingFriction` (Coulomb) and `spinningFriction`. Test: a bar stool released from a small push should roll a deterministic distance and stop. A sphere on a tilted plane should roll with gravity.
- `cmaes-ph3` (P1, feature): **Multi-body contact graph** — replace the one-obstacle scene with `scene.bodies: Body[]` where each body has `mass, inertia, mesh, joints, contactFilter`. Broadphase = sweep-and-prune on AABBs; narrowphase = GJK + EPA (or signed-distance for primitives). Use Bullet3-style contact manifold (up to 4 points per pair).
- `cmaes-ph4` (P1, feature): **Sequential impulse / LCP solver** — for the contact graph, solve the LCP each step with a projected-Gauss-Seidel or Newton solver; the kernel refuses to advance if the LCP does not converge (refusal envelope policy). Friction cone is discretized to 4-8 directions (Coulomb pyramid).
- `cmaes-ph5` (P1, feature): **Friction model upgrade** — from current single-coefficient to a per-material pair table: rubber-on-wood, ceramic-on-steel, fabric-on-fabric, etc. Coefficients sourced from the FurnitureSpec (Epic 2). Default is conservative under-estimated so the kernel never lets a piece float.
- `cmaes-ph6` (P1, feature): **Body breakage** — when a per-body impulse threshold is exceeded, replace the body with a fixed set of pre-defined fragments (from Epic 2 cmaes-fg10). Mass / CoG / inertia of fragments sum to the original; collision graph updates automatically.
- `cmaes-ph7` (P1, feature): **Schema-8 (v068) wire format** — `pack/unpack` for the new scene + body structs. Float64Array typed array (re-uses the packed ABI from cmaes-mky + extreme-opt pass 11/20). Round-trip tests vs the JSON fallback path. WASM size budget: 200 KiB added (current 0.4.1 is ~3.36 MB; we add ≤ 6%).
- `cmaes-ph8` (P1, feature): **Browser adapter fail-closed** — the browser adapter refuses a v067 packet that names `bodies.length > 1` (it must be v068) and refuses a v068 packet without a manifest. Same refusal discipline as the v041 / v066 / v067 cut.
- `cmaes-ph9` (P2, feature): **Soft-body / mass-spring proxy** — for rugs, cushions, curtains: a small lattice of point masses with stiff springs; pinned at anchor points; renders as a deformed mesh. Not full FEM; explicitly bounded to ≤ 100 nodes per piece (the LCP solver degrades).
- `cmaes-ph10` (P2, feature): **Contact impulse telemetry** — every contact pair emits `(t, bodyA, bodyB, normalImpulse, tangentImpulse, contactPoint, slip)` into the rollout trace. Consumed by Epic 5 for the safety field and by Epic 6 for the multi-factor objective.
- `cmaes-ph11` (P2, feature): **Restitution & damping** — per-material-pair restitution coefficient; linear + angular damping so pieces come to rest in reasonable time. Tuned to keep `completedSteps` honest.
- `cmaes-ph12` (P3, feature): **Continuous collision detection (CCD) between moving bodies** — sweep tests for fast-moving G1 segments vs slow furniture; prevents tunneling. Use the alternating-spatial-temporal optimization pattern (CGF 2025) on the SDF representation from Epic 4.
- `cmaes-ph13` (P3, feature): **Multi-body sleep state** — bodies that have not moved (impulse below threshold) and not been contacted for N steps are put to sleep; the broadphase skips them. Energy / determinism preserved (sleep transitions are explicit events in the trace).
- `cmaes-ph14` (P3, feature): **Per-step kernel perf instrumentation** — emit timing breakdown (broadphase, narrowphase, LCP, integrator) so the multi-factor objective can penalize frames where the LCP did not converge.

## Acceptance criteria (epic level)

- A 5-body, 4-contact test rolls in deterministic order across 3 declared seeds.
- The bar-stool test from Epic 2 actually rolls and stops at a distance the test expects (±1 cm).
- A glass tips off a side table when the table is shoved; the glass hits the floor; the impact impulse is in the contact telemetry.
- The packed Float64Array schema round-trips byte-for-byte across the Rust → WASM → TypeScript boundary.
- v067 packets still work (no regression on existing G1 / arm scenes).
- The browser adapter refuses malformed packets with a documented error code; never silently downgrades.
- Bun test, bun typecheck, bun lint green; cmaesEngine.test.ts (existing flagship test) still green.
- New tests: `cmaes-ph1` solver, `cmaes-ph3` contact graph, `cmaes-ph4` LCP convergence, `cmaes-ph7` schema round-trip, `cmaes-ph8` refusal envelope.

## Dependencies (blocking)

- `cmaes-594` (closed): house scene catalog (consumed by the new body[] array).
- `cmaes-nxj` (in_progress): the G1 flagship is the host for the new physics; its refactor is on the same kernel.
- Epic 1 (cmaes-pr0) for the visual side; Epic 2 (cmaes-fg0) for the FurnitureSpec.
- `/Users/jemanuel/projects/frankensim` sibling crate.

## Dependents (this epic blocks)

- Epic 4 (clipping / boundary detection lives in the kernel and reads the body's SDF).
- Epic 5 (obstacle avoidance is a property of the kernel's contact resolution).
- Epic 6 (G1 walking + arm in the photo-real household).

## Cross-cutting constraints

- Determinism law: no `Math.random` / `performance.now` in the kernel path. (Already enforced by cmaes-mky discipline.)
- The kernel must be WASM-buildable and run inside a Web Worker (cmaes-nxj already does this for v067).
- Schema changes go through the existing refusal-envelope policy — new schemas are additive, old schemas keep working.
- All artifacts (WASM, .d.ts, package.json) are committed under `public/wasm/fs-cmaes/v068/` (mirroring the v066/v067 pattern).

## References

- https://deepwiki.com/bulletphysics/bullet3/2.5-multi-body-dynamics
- https://lib.rs/crates/phyz-rigid
- https://github.com/softmata/featherstone
- https://deepwiki.com/dartsim/dart/3.3-dynamics-computation-pipeline
- https://deepwiki.com/bulletphysics/bullet3
- https://journals.sagepub.com/doi/10.1177/14644193261425501 (IMechE 2026 review of multibody collision)
- https://resources.oreate.ai/updates/roy-featherstone-spatial-vectors-and-modern-robot-dynamics-algorithms
