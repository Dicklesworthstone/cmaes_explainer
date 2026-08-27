# Pass 20/20 — symmetric spectral reconstruction

Status: rejected; the 20-pass WASM campaign is complete.

The final profile covered 300 admitted and 900 refusal calls, collecting 3,155
samples over 4.719 seconds. Its named cross-workload attribution was:

| Region | Profile share |
|---|---:|
| `cmaes_run` inclusive | 91.24% |
| deterministic software FMA self | 27.02% |
| Jacobi eigendecomposition inclusive | 20.48% |
| Gaussian generation | 20.47% |
| matrix-vector multiplication | 17.79% |
| deterministic `sin_cos` | 11.90% |
| phase-space projection | 5.42% |
| population ranking | 3.65% |
| `transform_matrix` | 1.95% |
| `rebuild_c` | 1.90% |

The tested lever computed only one triangle of the symmetric
`V diag(lambda) V^T` matrices in `transform_matrix` and `rebuild_c`, then
mirrored it. This was distinct from pass 10, which changed only the main
rank-one/rank-mu covariance-update triangle.

The exact gate rejected the candidate before timing. It changed 250,415
`f64` words across UI, maximum, bounded, noisy, and early-stop workloads:

- Production aggregate SHA-256: `d0c218feb8bb695077c8be583f71a29e167669ce40db6c0a1b1d9d5a0cf2d435`
- Candidate aggregate SHA-256: `5744ba275312762897f9dddb2f151ca5304c1d6900cb6386a1c14fb5bc9db6f4`

Although the mathematical matrices are symmetric, mirroring changed which
eigenvector component was multiplied by the eigenvalue first. The resulting
floating-point association changed low bits and then entire optimizer
trajectories. Release WASM also grew from 104,869 to 105,781 bytes. No latency
A/B was warranted after behavioral equivalence failed.

The candidate was manually restored. Root independently verified the exact
source blob `ef51f570b0c51327ec00449d1920fbed323aab67`, an empty Frankensim diff,
all 18 native CMA-ES tests, all 17 Bun CMA-ES tests with 175 assertions, and
the published artifact hashes:

- JavaScript wrapper: `eeed2c8ecf1ca0e38d6d447997e77c00b25707e23eb7dda54d29e237dc98f4a1`
- WASM: `729edb4371118d8fe3fa99774e69e62d4c90ef226051400c3476802b18e44934`

The restored 16-workload suite contained 468,496 words with zero differences
and aggregate SHA-256
`d0c218feb8bb695077c8be583f71a29e167669ce40db6c0a1b1d9d5a0cf2d435`
on both arms. Rustfmt, strict crate-local Clippy, wasm32 checking, release
building, and UBS also passed.

The final profile shows that the remaining time is now inside deterministic
floating-point arithmetic, eigendecomposition, Gaussian generation, and
matrix-vector work. Earlier passes independently disproved the safe buffer,
ranking, matvec, Jacobi-workspace, covariance-triangle, and spectral-association
shortcuts. Further changes to FMA or polynomial association would deliberately
change bitwise semantics, so this campaign closes without pretending a risky
rewrite is an optimization.
