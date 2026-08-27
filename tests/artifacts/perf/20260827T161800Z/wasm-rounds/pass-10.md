# Pass 10/20 — covariance triangle sharing

Status: rejected; no production source change retained.

The midpoint profile attributed 55.8% total time to `cmaes_run`, 36.1% to
serialization, 11.6% to Gaussian filling, 8.8% to Jacobi eigendecomposition,
and 8.2% to matrix-vector work.

Opportunity score: 8. The candidate shared covariance-triangle work. A naive
version changed the first eigenvalue by 3.33e-16, so the tested version was
repaired to preserve each triangle's original floating-point association and
old-C term. Maximum, bounded-maximum, and UI JSON then matched exactly.

Release A/B used 200 samples per arm and workload. Results were mixed:

- Maximum mean/p50/p95/p99: -0.064% / +0.065% / -2.121% / +3.733%.
- Bounded maximum: +0.127% / +0.275% / +1.612% / +11.611%.
- UI default: -0.605% / -0.417% / +0.152% / +0.156%.
- WASM size: 107,691 -> 107,863 bytes (+172 bytes).

The candidate was manually removed. Source returned exactly to Git blob
`b122fbe8...`; a fresh restored release matched production SHA-256
`3ac26684...cb5e`. Rustfmt, all 17 tests, doc tests, strict local Clippy, wasm32
check, and release wasm-pack build passed.
