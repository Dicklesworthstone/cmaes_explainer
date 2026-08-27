# CMA-ES reference audit

Primary references:

- Nikolaus Hansen, [The CMA Evolution Strategy: A Tutorial](https://arxiv.org/abs/1604.00772)
- The official [CMA-ES source-code index](https://cma-es.github.io/cmaes_sourcecode_page.html)
- The maintained [CMA-ES/pycma repository](https://github.com/CMA-ES/pycma)
- pycma's educational [purecma implementation](https://github.com/CMA-ES/pycma/blob/master/cma/purecma.py)
- pycma's current [strategy parameter defaults](https://github.com/CMA-ES/pycma/blob/master/cma/options_parameters.py), [recombination weights](https://github.com/CMA-ES/pycma/blob/master/cma/recombination_weights.py), [sampler](https://github.com/CMA-ES/pycma/blob/master/cma/sampler.py), [boundary transforms](https://github.com/CMA-ES/pycma/blob/master/cma/boundary_handler.py), and [noise handler](https://github.com/CMA-ES/pycma/blob/master/cma/optimization_tools.py)

## Engines actually shipped by this project

| Engine | Where used | Reference comparison | Action |
|---|---|---|---|
| `CMAESOptimizer` | Two-dimensional native demos | Active weights, learning rates, CSA, and h-sigma matched Hansen/pycma. Its default population was 8 instead of the canonical 6 in two dimensions, and bounded updates adapted repaired phenotypes. | Default population corrected; ranking remains on repaired phenotypes while mean, paths, and covariance now adapt raw genotypes. |
| `CMAESOptimizerND` | Wing, bridge, transformer, cellular automata, and internal-lab fallback | Core active CMA equations matched. It adapted repaired phenotypes and repeatedly materialized/decomposed covariance instead of using the reference `B D` factorization. | Genotype/phenotype separation corrected; post-update eigensystem cached; sampling now applies `B D z` directly. |
| `fs-cmaes-viz-wasm 0.2.0` | Internal-lab preferred kernel | The bundled kernel computes the h-sigma normalizer with `sqrt(1 - (1-cs)^2 * (g+1))` instead of `sqrt(1 - (1-cs)^(2(g+1)))`. The radicand becomes negative, h-sigma becomes false, and rank-one covariance learning is disabled. | The loader now rejects 0.2.0 and honestly uses the corrected TypeScript fallback. Only the audited 0.2.1 kernel is accepted. The committed binary was not overwritten. |
| `wasm_cmaes 0.2.0` | Optional embedded upstream WASM gallery | This is largely an older `purecma`-style implementation. It has valid classic defaults and lazy decomposition, but its negative weights are zero, its automatic covariance modes differ from full CMA-ES, and its noise option repeats an ask-order subset rather than Hansen's rank-change noise measurement. The gallery also called a nonexistent `WasmCmaes.xmean()` method. | Kept as the explicitly upstream/legacy gallery; it is not used by the site's default native optimizer or engineering demos. Its wrapper integration now reads the mean through `FminResult`, frees per-step snapshots, and keeps interactive panels stationary enough for reliable pointer input. |

## Reference-aligned behavior now present

- Canonical `lambda = 4 + floor(3 log(n))` default.
- Logarithmic positive and negative recombination weights with positive-definiteness scaling.
- Cumulative step-size adaptation with the finite-generation h-sigma normalizer.
- Rank-one and active rank-mu covariance updates.
- Mahalanobis-length normalization of negative covariance weights.
- Sampling in eigen coordinates using `B D z`.
- Objective ranking on bounded phenotypes while distribution adaptation uses unmodified genotypes.
- Positive-definite spectral repair after each covariance update.

## Intentional scope differences from production pycma

The explainer remains a small, synchronous, deterministic teaching engine rather than a replacement for pycma. It does not implement pycma's ask/tell API, full termination portfolio, IPOP/BIPOP orchestration in the core, uncertainty-driven reevaluation and evaluation-count adaptation, integer centering/minimum standard deviations, covariance condition alleviation, injection handling, or pycma's smooth `BoundTransform`. The site supplies explicit generation budgets, a separate restart visualization, and simple clip/reflect demonstrations. These differences are now treated as explicit scope, not evidence that the core equations are identical to all pycma facilities.
