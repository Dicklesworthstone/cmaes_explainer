# Pass 18/20 — noiseless true-fitness storage

Status: rejected; no production source or browser artifact changed.

The retained pass-17 production profile contained 4,695 samples over 350
admitted-maximum calls. The optimized WASM body accounted for essentially all
runtime; the JavaScript wrapper contributed only 0.447%. The tested lever
removed the per-generation true-fitness buffer and ranked best scan for
noiseless runs. Since those runs rank finite true fitness directly, rank zero is
already their earliest minimum. Noisy runs retained the original second stream
and scan.

The candidate's non-finite boundary was checked explicitly: every built-in
objective refuses a non-finite result before assignment, ranking, or best
tracking. A focused sphere case using finite `1e308` inputs reached that
`non-finite-objective` refusal. The complete parity suite covered valid,
bounded, noisy, early-stop, overflow-refusal, and other refusal workloads. All
364,866 `Float64` words were bit-identical, with aggregate SHA-256
`3afb932ac7eb4ff9ac7f438a83583019c60b46c16e1c6b94b420b379a884d19a`
on both arms.

Performance did not clear the retention threshold:

| Run | Workload | Mean speedup | Trimmed speedup | p50 | p95 | p99 |
|---:|---|---:|---:|---:|---:|---:|
| 1, 240/arm | UI | 0.116% | 0.465% | 0.757% | -0.397% | -7.261% |
| 1, 240/arm | Maximum | 0.749% | 0.747% | 0.725% | 0.150% | 0.093% |
| 2, 400/arm | UI | 0.551% | 0.661% | 0.642% | 0.403% | -3.667% |
| 2, 400/arm | Maximum | 0.590% | 0.443% | 0.450% | 0.091% | 2.642% |

The roughly 0.4–0.75% central gains stayed inside noise, UI p99 regressed in
both independent runs, and release WASM grew from 104,869 to 105,169 bytes.
The candidate was rejected and its code plus focused test were manually
restored.

Root independently verified an empty Frankensim diff, all 18 native CMA-ES
tests, all 17 Bun CMA-ES tests with 175 assertions, the unchanged 104,869-byte
production artifact, and exact production hashes:

- JavaScript wrapper: `eeed2c8ecf1ca0e38d6d447997e77c00b25707e23eb7dda54d29e237dc98f4a1`
- WASM: `729edb4371118d8fe3fa99774e69e62d4c90ef226051400c3476802b18e44934`

Before restoration the candidate also passed 19 focused crate tests, 23
`fs-math` tests, formatting, strict crate-local Clippy, wasm32 checking,
release building, and UBS with zero critical findings. No tests, fixtures,
goldens, or numeric conventions were weakened.
