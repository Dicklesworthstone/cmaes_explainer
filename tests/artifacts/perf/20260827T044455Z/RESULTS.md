# CMA-ES performance results

## Primary 12-dimensional workload

Each trial performs 250 generations of the deterministic anisotropic-ellipsoid workload. Baseline statistics use 500 measured trials after 10 warm-ups (11.66 seconds); final statistics use 1,000 measured trials after 10 warm-ups (15.43 seconds).

| Metric | Baseline | Final | Change |
|---|---:|---:|---:|
| p50 latency | 22.521 ms | 14.622 ms | 35.1% lower |
| p95 latency | 24.036 ms | 16.910 ms | 29.6% lower |
| p99 latency | 26.063 ms | 23.958 ms | 8.1% lower |
| Objective evaluations/second | 121,308 | 180,506 | 48.8% higher |
| Peak RSS | 73.9 MB | 79.2 MB | 5.3 MB higher; no retained-heap leak observed |

## Scaling

Median latency improvement at 250 generations, 100 measured trials per point:

| Dimension | Baseline p50 | Final p50 | Improvement |
|---:|---:|---:|---:|
| 2 | 1.295 ms | 1.138 ms | 12.1% |
| 4 | 3.001 ms | 2.722 ms | 9.3% |
| 8 | 8.229 ms | 7.562 ms | 8.1% |
| 12 | 23.026 ms | 17.725 ms | 23.0% |
| 24 | 140.215 ms | 88.727 ms | 36.7% |

The longer primary run is the decision statistic for the site's maximum production dimension; the shorter scaling sweep establishes the growth curve.

## Profile interpretation

Before optimization, Jacobi eigendecomposition consumed 32.8% CPU self-time and covariance reconstruction another 4.9%. The engine decomposed the covariance at generation start, after updating it, and again for the returned snapshot. After caching the repaired post-update eigensystem and using its `B D` factors directly, only the necessary post-update decomposition remains. Dense square-root/inverse-square-root composition disappeared from the final top functions.

The remaining eigendecomposition share is about 17%. Updating it less frequently could save more at high dimensions, but it would deliberately use stale covariance factors and stale visualization axes. Given the explainer's dimensions and correctness requirements, that candidate did not meet the `(impact × confidence) / effort >= 2` gate. Array-pool/preallocation work likewise did not clear the gate after the retained heap measured only 1.2 MB.

## Correctness gate

- All deterministic convergence, rank invariance, covariance positive-definiteness, boundary genotype/phenotype, physical-objective, and WASM compatibility tests pass.
- Final deterministic goldens and SHA-256 checksums are stored under `optimized/`.
- The factorized sampler changes fixed-seed trajectories because standard-normal draws are interpreted in eigen coordinates, as in the reference implementation. Its sampling covariance remains mathematically `B D (B D)^T = C`; convergence at dimensions 4, 8, 12, and 24 improved or remained in the same numerical regime in the recorded goldens.
