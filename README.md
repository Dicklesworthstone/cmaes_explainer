# CMA-ES Explainer Site

Next.js 16 + Tailwind + Framer Motion + Three.js + MathJax + your Rust CMA-ES engines.

**Runtime:** Bun 1.3+ only (we do not use npm/yarn/pnpm).

## Getting started

```bash
git clone https://github.com/Dicklesworthstone/cmaes_explainer
cd cmaes_explainer
bun install
bun run dev
```

Open http://localhost:3000.

## WASM demo payload

The prebuilt engine bundles (`pkg/` and `pkg-par/`) are committed under
`public/wasm-demo/`, so the live demo works out of the box (Vercel builds do
not run the pull script). To rebuild them after upstream `wasm_cmaes` changes:

```bash
./scripts/pull_wasm_demo.sh
```

That script:

* Clones `wasm_cmaes` into `vendor/wasm_cmaes` (or pulls latest)
* Runs its build script
* Refreshes `public/wasm-demo/` (`examples/`, `pkg/`, `pkg-par/`) — commit the
  refreshed payload so deployments pick it up

The "Live CMA-ES demo" section at `/` embeds `/wasm-demo/examples/viz-benchmarks.html` via iframe.

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
