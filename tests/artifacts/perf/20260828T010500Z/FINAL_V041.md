# Final CMA-ES WASM 0.4.1 profile and behavior gate

Run ID: `20260828T010500Z`

## Scenario fingerprint

- Host: Apple M4, 10 logical CPUs, 32 GiB RAM
- OS: macOS 26.5 (Darwin 25.5.0, arm64)
- Bun: 1.4.0
- Rust: 1.100.0-nightly (2026-08-23)
- wasm-pack: 0.13.1, release profile plus wasm-opt
- Site base commit: `90e0df47813f78f7ae0df4ec7789456897702311`
- Warm cache, same process, alternating arm order, 30 warmups per arm
- Old packed kernel: `fs-cmaes-viz-wasm 0.4.0`
- Final kernel: `fs-cmaes-viz-wasm 0.4.1`
- Final WASM SHA-256: `51ca481b81d1dca87e9e057f640279955234d297b0c4bd3a2cbacc9c233e4d87`

## Behavior proof

Version 0.4.1 intentionally corrects 0.4.0 rather than preserving its fixed-seed
trajectory. It samples with the canonical eigen-coordinate factor `B D z` and
uses largest-first internal eigenpairs, matching the TypeScript engine. The
permanent Bun differential gate covers nine scenarios, all five landscapes,
active and passive covariance, bounds, noise, dimensions 2 through 6,
populations 6 through 48, target termination, and budget exhaustion. It checks
ranked Gaussian coordinates, samples, noisy fitnesses, means, spectra, full
covariances, both evolution paths, sigma, best fitness, final best point,
evaluation counts, generation counts, and stop reasons through the shared
`f_target = 1e-8` horizon.

The final checked-in package is byte-identical to a fresh release build from the
reviewed 0.4.1 source. Native Rust tests pass 19/19; the Bun suite passes 18/18
with 216 assertions.

## Alternating A/B results

The raw packed measurements run the full configured generation budget with
`f_target = NaN`, isolating the kernel and packed transfer. Positive percentages
mean 0.4.1 is faster.

| Workload | Samples/arm | 0.4.0 p50 / p95 / p99 / trimmed mean | 0.4.1 p50 / p95 / p99 / trimmed mean | p50 / p95 / trimmed speedup |
|---|---:|---:|---:|---:|
| UI default: n=5, lambda=16, 120 generations | 1,000 | 3.715 / 3.844 / 4.111 / 3.715 ms | 3.661 / 3.755 / 3.842 / 3.660 ms | 1.47% / 2.32% / 1.49% |
| Admitted maximum: n=6, lambda=48, 200 generations | 500 | 13.977 / 14.569 / 15.456 / 14.015 ms | 13.615 / 14.162 / 14.542 / 13.653 ms | 2.59% / 2.80% / 2.58% |

The UI-ready comparison includes optimization, packed transfer, packet
validation, and snapshot adaptation for WASM; TypeScript includes its complete
native viewer-state path. Both use the same seed, objective, options, and
`f_target = 1e-8`.

| Engine | Samples | p50 | p95 | p99 | Trimmed mean |
|---|---:|---:|---:|---:|---:|
| WASM 0.4.1 UI-ready | 500 | 4.212 ms | 4.777 ms | 4.998 ms | 4.256 ms |
| TypeScript UI-ready | 500 | 1.671 ms | 2.317 ms | 2.544 ms | 1.737 ms |

WASM remains 2.45x slower by trimmed mean on this small five-dimensional
viewer workload. The purpose of activating it is therefore reference-aligned
Rust execution and a scalable path, not a false claim that boundary-heavy WASM
beats JIT TypeScript at tiny dimensions.

Against the campaign's pre-packed baseline in
[`../20260827T161800Z/BASELINE.md`](../20260827T161800Z/BASELINE.md), final raw
p50 is 45.6% lower for the UI workload and 54.7% lower for the admitted maximum.
Those are same-host campaign comparisons, not the paired final A/B above.

## Ranked hotspot handoff

The final kernel inherits the accepted results of all 20 sequential optimization
passes. The last named profile and rejection ledger are in
[`../20260827T161800Z/wasm-rounds/pass-20.md`](../20260827T161800Z/wasm-rounds/pass-20.md).
The correctness repair removes one forward symmetric-root construction per
generation, explaining the small additional win above; it does not change the
remaining ranked hot regions.

| Rank | Region | Profile share | Evidence | Decision |
|---:|---|---:|---|---|
| 1 | Deterministic software FMA | 27.02% self | pass-20 named profile | Retain semantics; reassociation changes trajectories |
| 2 | Jacobi eigendecomposition | 20.48% inclusive | pass-20 named profile | Workspace and symmetry shortcuts were measured and rejected |
| 3 | Gaussian generation | 20.47% inclusive | pass-20 named profile | Shared deterministic `sin_cos` retained in pass 17 |
| 4 | Matrix-vector work | 17.79% inclusive | pass-20 named profile | `B D z` is now the required reference transform |
| 5 | Phase-space projection | 5.42% inclusive | pass-20 named profile | Required once per emitted run for the current viewer contract |

## Opportunity matrix and final decision

| Candidate | Impact | Confidence | Effort | Score | Result |
|---|---:|---:|---:|---:|---|
| Eliminate the redundant forward symmetric root by canonical `B D z` sampling | 3 | 5 | 2 | 7.5 | Retained; correctness repair and 1.5–2.6% central-latency win |
| Reassociate deterministic FMA/polynomials | 5 | 5 | 5 | 5.0 | Rejected: violates the complete-trajectory behavior proof |
| Reuse/reorder Jacobi or covariance workspaces | 4 | 4 | 4 | 4.0 | Rejected by earlier exact and paired gates |
| Remove the remaining JS/WASM packet copies | 5 | 5 | 5 | 5.0 | Belongs to the owner-backed schema-2 session ABI, not a safe schema-1 lever |

### Retained-change proof

- Ordering preserved relative to the canonical TypeScript owner: yes; ranked
  `z`, samples, and noisy fitness streams are checked every generation.
- Tie-breaking unchanged: yes; fixed ask IDs remain the secondary rank key.
- Floating-point behavior: matched to the TypeScript reference within the
  declared `2e-8` scale-normalized complete-trajectory tolerance.
- RNG seed and consumption: unchanged; ranked `z` differs by at most `2e-12`
  absolute throughout the matrix.
- Browser output: production smoke loaded only the versioned 0.4.1 JS/WASM
  resources with HTTP 200, displayed the 0.4.1 WASM badge, correctly fell back
  at n=8, returned to WASM at n=5, and reported zero console/page/network errors.
