# CMA-ES Explainer

An interactive, evidence-first tour of covariance matrix adaptation. The site
combines Next.js, React Three Fiber, MathJax, a reference-audited TypeScript
CMA-ES, and versioned Frankensim WebAssembly kernels.

The flagship experiment optimizes a real 5,040-parameter residual policy for a
source-bound Unitree G1 lower-body model. The optimization runs in a Web Worker;
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
- A live equal-budget family comparison with representation-honest storage and
  workspace receipts.
- A 5,040-D walking search using separable CMA-ES, LM-CMA, or LM-MA. Every
  candidate and the rendered winner use the identical 1.5-second, 720-step
  owner experiment. The search starts from a disclosed 105-coordinate walking
  curriculum (15 standing biases, 30 phase terms, and 60 inertial-feedback
  terms), then leaves all 5,040 coordinates free to adapt.
- The low-dimensional visual lab, whose Rust kernel is admitted only after
  complete-trajectory parity with the TypeScript reference across the tested
  landscape and option matrix.
- Deterministic tests for every advertised wing coordinate, optimizer
  convergence, binary packet refusals, all four owner families, and G1 rollout
  invariants.

The G1 demo is deliberately a reduced explainer model: 15 lower-body and waist
DoFs are simulated; its translucent head, shoulders, arms, and hands are
display-only. It is not a hardware controller or a sim-to-real claim. Full
CMA-ES is useful in the 96-D comparison but intentionally refused at 5,040
dimensions because its dense covariance would require 25,401,600 entries.

## Versioned WebAssembly

Two audited surfaces coexist intentionally:

- `public/wasm/fs-cmaes/v041/` is the complete-trajectory-compatible kernel for
  the existing low-dimensional visualizations.
- `public/wasm/fs-cmaes/v064/` is the owner-family ask/tell and schema-5 G1 walking
  package used by the flagship and its worker.

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
