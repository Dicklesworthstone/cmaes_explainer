# CMA-ES Explainer Site

Next.js 15 + Tailwind + Framer Motion + Three.js + MathJax + your Rust CMA-ES engines.

## Getting started

```bash
git clone https://github.com/Dicklesworthstone/cmaes_explainer
cd cmaes_explainer
npm install
npm run dev
```

Open http://localhost:3000.

## Integrating the wasm CMA-ES demo

This repo expects a copy of your `wasm_cmaes` visualization under `public/wasm-demo/`.

From the project root:

```bash
./scripts/pull_wasm_demo.sh
```

That script:

* Clones `wasm_cmaes` into `vendor/wasm_cmaes` (or pulls latest)
* Runs its build script
* Copies `examples/viz-benchmarks.html`, `pkg/`, and `pkg-par/` into `public/wasm-demo/`

The “Live CMA-ES demo” section at `/` embeds `/wasm-demo/examples/viz-benchmarks.html` via iframe.

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
