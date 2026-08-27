# Pass 19/20 — unbounded latent-candidate storage

Status: rejected; production remains unchanged.

The retained-production profile covered 350 admitted-maximum calls in 5.429
seconds and collected 7,179 samples. Tiered nodes in the CMA-ES WASM core held
84.26% of self samples, while the JavaScript wrapper accounted for 0.35%.

The candidate removed the duplicate `raw_sx` population buffer on unbounded
runs. In that mode the displayed phenotype and latent Gaussian preimage are
identical, so adaptation can read `sx` directly. Reflection-bounded runs kept
both buffers because canonical repair requires ranking the displayed phenotype
while adapting its unrepaired genotype.

All 352,191 `Float64` words across 15 UI, maximum, bounded, noisy, early-stop,
non-finite, and admission-refusal workloads were bit-identical. Both aggregate
streams hashed to
`5d7b186a1e785ec9e943289b70c1cb63f1df44589cf3937fb44e37fc823d17a7`.

The two alternating A/B runs rejected the candidate:

| Run | Workload | Mean speedup | Trimmed speedup | p50 | p95 | p99 |
|---:|---|---:|---:|---:|---:|---:|
| 240/arm | UI | -0.249% | -0.337% | -0.332% | -0.250% | -1.243% |
| 240/arm | Maximum | -0.697% | -0.798% | -0.797% | -0.861% | 1.123% |
| 400/arm | UI | -0.241% | -0.141% | -0.144% | -0.346% | -0.757% |
| 400/arm | Maximum | 0.519% | 0.288% | 0.276% | 0.542% | 6.938% |

UI performance regressed in both independent runs, and the maximum result was
contradictory and below noise. The candidate also grew release WASM from
104,869 to 105,042 bytes. It was rejected and its single source hunk was
manually restored.

Root independently confirmed an empty Frankensim diff, all 18 native CMA-ES
tests, all 17 Bun CMA-ES tests with 175 assertions, and the unchanged
104,869-byte production WASM SHA-256
`729edb4371118d8fe3fa99774e69e62d4c90ef226051400c3476802b18e44934`.

Before restoration the exact candidate also passed native and documentation
tests, Rustfmt, strict crate-local Clippy, wasm32 checking, release building,
and UBS with zero critical findings. Memory pages stayed at 17 initial, 25
after UI, and 55 after maximum. No tests, fixtures, goldens, RNG rules, repair
semantics, or numeric conventions were changed.
