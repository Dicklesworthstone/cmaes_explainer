# CMA-ES optimizer performance definition

- Run ID: `20260827T044455Z`
- Workload: `CMAESOptimizerND.step()` on a deterministic, unbounded anisotropic ellipsoid objective.
- Primary production dimension: 12, the largest dimension currently used by the interactive TypeScript demos.
- Scaling dimensions: 2, 4, 8, 12, and 24.
- Primary metric: steady-state wall-clock latency per 250-generation trial, summarized as p50/p95/p99 over 500 measured trials after 10 warm-up trials.
- Secondary metric: objective evaluations per second.
- Correctness gate: deterministic final state JSON and SHA-256 checksum for fixed seeds, plus the repository's convergence and covariance tests.
- Memory gate: Bun heap profile and macOS peak resident-set measurement.
- Resource limits: one local process, default OS scheduling, no system tuning.
- Stop condition: retain only changes whose measured opportunity score `(impact × confidence) / effort` is at least 2 and whose correctness gates pass.

The objective intentionally performs little work. This isolates optimizer overhead and represents the site's inexpensive illustrative objectives; real simulations add objective cost on top.
