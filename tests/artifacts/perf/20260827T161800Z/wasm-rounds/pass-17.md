# Pass 17/20 — shared deterministic trigonometric reduction

Status: accepted and published to the browser artifact.

The refreshed production profile kept deterministic Gaussian generation at the
top of the remaining eligible work. Box–Muller needs both sine and cosine for
each complete pair, but the strict kernel performed the same Cody–Waite or
Payne–Hanek range reduction twice. The retained change adds
`fs_math::det::sin_cos`, which shares only that reduction while preserving the
established polynomial cores and quadrant conventions. Odd-dimensional tails
still compute cosine alone, avoiding an unused sine polynomial.

The API was checked at signed zero, quadrant landmarks, the strict-domain
boundary, huge finite values, infinities and NaN, 20,000 deterministic in-domain
samples, and 10,000 raw IEEE-754 bit patterns. Each paired component was
bit-identical to the established standalone `sin` and `cos` functions.

The browser parity suite covered UI, admitted-maximum, bounded, noisy,
early-stop, and ten refusal workloads. All 363,009 `Float64` words were
bit-identical between production and the candidate, with zero differing words.
Both aggregate byte streams hashed to
`4d53a45233e747a6bae210dd4076bb30f5bdc59e1a8d42764cfc686338e07eaa`.

Two independent alternating A/B runs retained the candidate:

| Run | Workload | Samples/arm | Production mean | Candidate mean | Mean speedup | Trimmed speedup | p50 / p95 / p99 speedup |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | UI | 240 | 4.2689 ms | 4.1369 ms | 3.09% | 3.31% | 3.34% / 3.22% / -5.72% |
| 1 | Maximum | 240 | 16.2892 ms | 15.2657 ms | 6.28% | 6.25% | 6.22% / 6.02% / 6.21% |
| 2 | UI | 400 | 4.2276 ms | 4.1283 ms | 2.35% | 2.69% | 2.83% / 2.64% / 2.49% |
| 2 | Maximum | 400 | 16.2492 ms | 15.3660 ms | 5.44% | 5.62% | 5.57% / 5.49% / 4.71% |

The isolated run-one UI p99 regression did not repeat. Root independently ran
another four-round alternating measurement: its representative UI workload was
7.35% faster and its admitted-maximum workload was 5.01% faster.

The generated WASM shrank from 105,022 to 104,869 bytes and retained the same
17 initial, 25 post-UI, and 55 post-maximum memory pages. The published hashes
are:

- JavaScript wrapper: `eeed2c8ecf1ca0e38d6d447997e77c00b25707e23eb7dda54d29e237dc98f4a1`
- WASM: `729edb4371118d8fe3fa99774e69e62d4c90ef226051400c3476802b18e44934`

Root fresh-eyes review and verification passed the 18 native CMA-ES tests, 23
`fs-math` tests, 17 Bun CMA-ES tests with 175 assertions, targeted Rustfmt,
strict crate-local Clippy, wasm32 checking, release WASM build, diff checks,
and UBS with zero critical findings. No assertion, fixture, numeric convention,
RNG transition, or browser ABI was weakened or changed.
