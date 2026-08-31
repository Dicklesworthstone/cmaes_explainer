# CMA-ES Explainer

An interactive, evidence-first tour of covariance matrix adaptation. The site
combines Next.js, React Three Fiber, MathJax, a reference-audited TypeScript
CMA-ES, and versioned Frankensim WebAssembly kernels.

The flagship experiment optimizes a real 5,040-parameter residual policy for a
source-bound Unitree G1 lower-body model over disclosed terrain and a timed
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

The G1 demo is deliberately an explainer model, not a hardware controller or a
sim-to-real claim. The current schema-7 owner integrates the 29-actuated-joint,
30-link whole-body model and publishes 30 world-frame link poses; its disclosed arm-swing reflex
is part of the physical rollout rather than display-only dressing. Full CMA-ES
is exercised on the 128-D arm but intentionally refused at 5,040 dimensions
because its dense covariance would require 25,401,600 entries.

## Versioned WebAssembly

Two audited surfaces coexist intentionally:

- `public/wasm/fs-cmaes/v041/` is the complete-trajectory-compatible kernel for
  the existing low-dimensional visualizations (CmaesIntro / CmaesInternalsLab).
- `public/wasm/fs-cmaes/v066/` is the first ask/tell owner kernel: schema-6 G1
  (15-DoF lower body) and schema-2 household arm (128-D). Used by the
  flagships pre-cmaes-pvz.
- `public/wasm/fs-cmaes/v068/` is the multi-factor-objective kernel
  (cmaes-pvz): the v066 ask/tell surface, the schema-7 30-DoF G1, and the
  per-step survival-bonus shaping the flagship receipt card surfaces.
- `public/wasm/fs-cmaes/v069/` is the arm-swing-gate refinement of v068: the
  upper-body reflex is quiet during the balance phase and ramps in over
  gait cycles 0.5..1.5, matching the v066 effective behavior on the lower
  body while keeping the 30-DoF inertia in the solver.
- `public/wasm/fs-cmaes/v0610/` keeps the v069 G1 contract and tightens the
  household-arm placement verdict: a rollout is placed only when grasp,
  transport, release, tolerance, and lift checks pass with zero collision risk,
  zero possible-collision time, and at least 4.5 cm certified clearance.

The browser adapters fail closed on an unexpected kernel identity or malformed
packet. They do not silently label a TypeScript fallback as WebAssembly.

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
