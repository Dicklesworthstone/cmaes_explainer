# CMA-ES Explainer

An interactive, evidence-first tour of covariance matrix adaptation. The site
combines Next.js, React Three Fiber, MathJax, a reference-audited TypeScript
CMA-ES, and versioned Frankensim WebAssembly kernels.

The flagship experiment optimizes a real 5,040-parameter residual policy for a
source-bound Unitree G1 whole-body model over disclosed terrain and a timed
lateral push. Optimization coordination runs in a Web Worker and expensive
candidate rollouts fan out across persistent WASM evaluation workers after an
exact sequential-parity check.
Frankensim owns the policy map, free-floating articulated dynamics, SE(3)
integration, contact, friction, objective, and rendered link poses.

**Runtime:** Bun only. Do not use npm, yarn, or pnpm.

## Getting started

```bash
git clone https://github.com/Dicklesworthstone/cmaes_explainer
cd cmaes_explainer
bun install
bun run dev
```

Open <http://localhost:3000>.

## What is implemented

- Full, separable, LM-CMA, and LM-MA owner implementations behind one strict
  ask/tell packet contract.
- Live equal-budget physical family comparisons with representation-honest
  storage and workspace receipts: all four variants on the 128-D household arm,
  and the three scalable variants on the 5,040-D walking challenge.
- A 5,040-D walking search using separable CMA-ES, LM-CMA, or LM-MA. Every
  candidate and the rendered winner use the identical 1.5-second, 720-step
  owner experiment, including the same terrain and push. The search starts from a disclosed 105-coordinate walking
  curriculum (15 standing biases, 30 phase terms, and 60 inertial-feedback
  terms), then leaves all 5,040 coordinates free to adapt.
- Lossless G1 policy files and private fragment links carry the evaluated
  placement, exact owner configuration, owner source/WASM identity and seed.
  Imports restore those inputs or refuse an incompatible experiment before
  changing the run. Saved G1 policies retain that experiment across reloads.
  Older coefficient-only files are explicitly re-evaluated in the current
  default scene with Seed 1.
- The low-dimensional visual lab, whose Rust kernel is admitted only after
  complete-trajectory parity with the TypeScript reference across the tested
  landscape and option matrix.
- A 128-D KUKA-style household arm that evaluates finite-pad pick/lift/
  transport/place policies for a mug, remote, and trowel. The current
  curriculum certifies collision-safe placement for the mug and remote; the
  trowel reaches the caddy tolerance but is honestly refused because its
  trajectory intersects the collision envelope. Frankensim integrates the
  free object and reciprocal contact wrench and routes obstacle, object, and
  non-adjacent self checks through certified convex-query owners.
- Arm file/link imports restore their supported task and optimizer family.
  Further learning uses the imported coefficients and search radius with
  Seed 1. These archives do not preserve a complete arm scene or seed.
  Neither robot saves the full optimizer covariance, evolution paths or RNG
  state: learning from a recovered policy is a new search from that policy.
- A separately rendered KUKA KMR mobile-base rung. A 64-ray planar scan and
  global clearance value field consume the actual X/Z furniture footprints
  plus doorway-split wall bodies. Click a clear goal and a deterministic TS
  kinematic owner extracts a collision-free route, issues four mecanum-wheel
  commands, integrates pose, and refuses swept contact. A moving infinite-mass
  base proxy also feeds the live household contact/LCP stack, so contact can
  push a finite-mass chair. This does **not** yet claim rigid-body wheel
  traction or a physically mounted LBR iiwa. KUKA's published whole-vehicle
  envelope is 1190×720×700 mm at 375 kg; the 800×600 mm inner chassis,
  wheel, and wheelbase values are disclosed procedural assumptions.
- Deterministic tests for every advertised wing coordinate, optimizer
  convergence, binary packet refusals, all four owner families, G1 challenge
  invariants, and all three manipulation tasks.

## Scene inputs, collision checks and measured playback

The robot displays use the physical owners' link and object poses. Browser
push-outs do not alter those poses after evaluation. A stopped G1 rollout
can therefore show the penetration reported by its owner; the display does
not establish zero penetration or universal continuous collision safety.

- **G1 placement and learning:** the floor translation reaches preview,
  learning, Stop, replay, comparison and parallel evaluation. The returned
  scene receipt binds that translation, the exact configuration words and
  the shipped WASM digest. Dragging changes a requested placement handle;
  the physical display changes when the owner returns its evaluated scene.
  Elevated placements are refused; arbitrary seat rotation remains unfinished.
- **Bounded G1 collision coverage:** the owner checks 20 body colliders
  against the 48 nearest declared bodies from the 78-body collision catalog.
  It terminates on penetration and reports the measured depth. The current
  ABI cannot carry the entire catalog. The detailed estate mesh is also
  independently authored, so the receipt is not proof of collision coverage
  for every visible furnishing.
- **Arm scene and readouts:** rendering and obstacle selection use the same
  task furniture roster and coordinate conversion. Mug, remote and trowel
  declare 27, 26 and 30 bodies respectively, including the support slab;
  insufficient packet capacity is refused. All seven iiwa joint dials derive
  from the source-ordered owner link rotations. Restart and scrubbing seek
  the measured trace; an older playback frame cannot undo a newer seek.
- **Placement probes and debug views:** OBB clamps bound requested targets,
  and the auxiliary arm reach probe uses a reduced IK model. Their markers,
  clearance readouts and wireframes are diagnostics, not certification of
  the physical trajectory or detailed render meshes. The Physics overlay is
  disabled by default.

Regression coverage includes arbitrary-yaw box corners against the owner
frame and signed-distance field, seven-joint reconstruction under arbitrary
world rotations, every sample of three actual owner arm traces, and real
G1 rollouts whose outputs change when placement changes. The browser smoke
runner exercises drag, learning, Stop, comparison and export together, plus
arm Restart/scrubbing against exported poses. Complete shared scene identity
across G1, iiwa and KMR, dynamic furniture and full mesh/collider agreement
remain open work.

The G1 demo is deliberately an explainer model, not a hardware controller or a
sim-to-real claim. The current schema-9 owner integrates the 29-actuated-joint,
30-link whole-body model and publishes 30 world-frame link poses; its disclosed arm-swing reflex
is part of the physical rollout rather than display-only dressing. Full CMA-ES
is exercised on the 128-D arm but intentionally refused at 5,040 dimensions
because its dense covariance would require 25,401,600 entries.

## Versioned WebAssembly

The tutorial uses `v041`; the robot flagships use `v0622`. Earlier artifacts
remain available for historical comparisons:

- `public/wasm/fs-cmaes/v041/` is the complete-trajectory-compatible kernel for
  the existing low-dimensional visualizations (CmaesIntro / CmaesInternalsLab).
- `public/wasm/fs-cmaes/v066/` is the first ask/tell owner kernel: schema-6 G1
  (15-DoF lower body) and schema-2 household arm (128-D). Used by the
  flagships pre-cmaes-pvz.
- `public/wasm/fs-cmaes/v068/` is the multi-factor-objective kernel
  (cmaes-pvz): the v066 ask/tell surface, the schema-7 29-actuator G1, and the
  per-step survival-bonus shaping the flagship receipt card surfaces.
- `public/wasm/fs-cmaes/v069/` is the arm-swing-gate refinement of v068: the
  arm-swing multiplier ramps from 0.323 to 0.968 physical seconds. These are
  cycles 0.5..1.5 at the nominal 1.55 Hz calibration; the times stay fixed
  when gait frequency changes. All 29 actuators remain in the dynamics.
- `public/wasm/fs-cmaes/v0610/` keeps the v069 G1 contract and tightens the
  household-arm placement verdict: a rollout is placed only when grasp,
  transport, release, tolerance, and lift checks pass with zero collision risk,
  zero possible-collision time, and at least 4.5 cm certified clearance.
- `public/wasm/fs-cmaes/v0611/` refreshes the v0610 G1 walking curriculum from
  the four-stage `recalibrate_mode_11_curriculum` retune (cmaes-zi6). The
  30-link owner completes the 720-step horizon; honest measured displacement
  remains ~0.24 m flat and ~0.17 m terrain-and-push, still short of the
  >1.0 m / >0.5 m/s target.
- `public/wasm/fs-cmaes/v0612/` closes the native/browser math drift and ships
  the task-scoped v073 dual-environment curriculum. Its exact 720-step browser
  receipts are 0.308 m flat and 0.329 m under terrain-and-push; both spend
  0.083 s in flight and remain below the disclosed lateral and heading gates.
- `public/wasm/fs-cmaes/v0613/` adds owner-side feasible-step control for the
  household arm. Certified hard penetration may not increase: proposed joint
  updates are deterministically backtracked, while intentional gripper/object
  proximity remains outside the hard obstacle and self-collision barrier. It
  preserves the bit-identical v0612 G1 receipts above.
- `public/wasm/fs-cmaes/v0614/` opens the household-arm owner to browser
  inputs (packet schema 3): a variable-length roster of up to 32 extra
  obstacle boxes with yaw (link-vs-box hard constraints, so the backsplash,
  cabinet, and nearest Craftsman furniture are now owner obstacles rather than
  display-side guards), an object-mass override, and Coulomb friction
  coefficients. The admission echoes the effective friction and obstacle
  count. Zero overrides and an empty roster reproduce the v0613 receipts.

- `public/wasm/fs-cmaes/v0615/` opens the G1 walking owner to keep-out boxes
  (packet schema 8). The body-vs-obstacle guard was always implemented but
  unreachable: no packet could declare a box, so the humanoid's collision
  story was entirely display-side. The browser now sends the 48 rigid
  Craftsman bodies and walls nearest the robot, expressed relative to its
  seat, and the owner terminates a rollout that drives its body into them.
  The receipt reports the deepest penetration the guard measured. Seated at
  the living-room placement the curriculum is unchanged; seated inside the
  sofa it terminates at step 1.

- `public/wasm/fs-cmaes/v0622/` exposes the controller layout through G1
  schema 9: 29 physical actuators, 30 links, 15 learned rows, 14 reflex joints,
  exact 15/30/60 curriculum coordinate membership, and fixed arm-gate times.
  CMA schema 2 and household-arm schema 4 remain distinct contracts. Its
  manifest records the source revision, build tools and executable hashes.

The browser verifies the published manifest and both executable assets before
importing the owner, then checks the source revision exported by that WASM.
Native engine preparation applies the same checks to the bundled bytes. An
unexpected source, artifact, schema or malformed packet is refused.

## Quality gates

```bash
bun test
bun lint
bun typecheck
bun run build
```

The repository has no blanket format script. Use the established formatter for
the specific files being changed.

## Legacy upstream WASM demo payload

The separately embedded upstream benchmark bundles (`pkg/` and `pkg-par/`) are
committed under `public/wasm-demo/`, so the live demo works out of the box
(Vercel builds do not run the pull script). To rebuild them after upstream
`wasm_cmaes` changes:

```bash
./scripts/pull_wasm_demo.sh
```

That script:

* Clones `wasm_cmaes` into `vendor/wasm_cmaes` (or pulls latest)
* Runs its build script
* Refreshes `public/wasm-demo/` (`examples/`, `pkg/`, `pkg-par/`) — commit the
  refreshed payload so deployments pick it up

The "Live CMA-ES demo" section at `/` embeds
`/wasm-demo/examples/viz-benchmarks.html` via iframe. This legacy iframe is
independent of the versioned Frankensim kernels above.

## Deploying to GitHub + Vercel

On a Linux box with `gh` and `vercel` CLIs logged in:

```bash
./scripts/bootstrap_and_deploy.sh
```

That will:

* Initialize git
* Create `Dicklesworthstone/cmaes_explainer` via `gh`
* Push `main`
* Link the project to Vercel
* Run a production deployment
