# DEFINE — TypeScript CMA-ES core

## Scenario

Run `CMAESOptimizerND` on the deterministic anisotropic ellipsoid for 250 generations. Dimension 24 is the primary high-cost case; dimensions 1, 2, 4, 8, 12, 24, and 48 establish the scaling curve. Every measured trial constructs a fresh optimizer and uses a distinct deterministic seed after identical warmup policy.

## Metric

Primary: per-trial wall latency p50/p95/p99 and objective evaluations per second. Secondary: maximum process RSS, sampled CPU self-time, sampled allocation volume, and scaling exponent with dimension.

## Budget

Fresh-baseline campaign target: dimension-24/250-generation p95 at or below 35.8 ms on this fingerprinted host (50% below the fresh 71.53 ms p95), without increasing peak RSS by more than 10%. The earlier 62.9 ms target derived from a prior same-host run is retained as an intermediate floor, not the campaign goal. Every accepted individual lever must be outside the measured 4.8% same-seed variance envelope or have independent CPU/allocation evidence showing a real shift.

## Golden output

Exact SHA-256 checksums of deterministic JSON outputs at dimensions 1, 2, 4, 8, 12, 24, and 48. A pass may change floating-point operation order only when its proof explicitly documents the mathematically equivalent transform and the convergence/property suite remains green; otherwise hashes must remain exact.

## Scope boundary

This run measures the TypeScript CMA-ES computation itself under Bun's JIT. It excludes browser rendering, React reconciliation, objective-specific physics, network and storage I/O, and the currently rejected FrankenSim CMA-ES binaries.

## Variance envelope

- At most 10% p95 drift on the same host is treated as noise.
- More than 10% is investigated.
- More than 20%, or three consecutive drifts above 10%, is escalated.

## Stakeholder / requester

Requested by the project owner to drive at least 20 sequential, profile-led extreme-optimization passes over the CMA-ES core.
