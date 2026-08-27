# Hypothesis ledger

## H1 — covariance traversal is the largest removable cost

- Evidence: 30.6% combined sampled self/setup around the rank-μ update; lambda × n(n+1)/2 accumulation structure.
- Prediction: changing traversal/layout while preserving candidate order should lower this region and improve high-dimensional latency.
- Falsifier: no region-share reduction and no same-seed latency change beyond the 4.8% envelope.

## H2 — Jacobi rotation math is the largest arithmetic cost

- Evidence: 36.6% combined self at the two branches computing the stable tangent; native `hypot` is separately visible.
- Prediction: fewer sweeps/pivots or a demonstrably equivalent cheaper coefficient path will lower CPU share, especially at n≥24.
- Falsifier: unchanged sample share, changed convergence/eigen residuals, or golden divergence without a complete floating-point proof.

## H3 — nested-array materialization compounds the two leading hotspots

- Evidence: transform, whitening, reconstruction, `map`, `fill`, `from`, and clone totals are independently visible; the source allocates transient vectors and matrices in each generation.
- Prediction: workspace reuse or fused kernels will reduce allocation-related samples and wall time without changing operation order.
- Falsifier: RSS/heap gets worse, JIT fails to specialize the replacement, or latency remains inside noise.

## H4 — I/O, lock contention, objective work, and sort are not material

- Evidence: zero block I/O, 3% system/user CPU ratio, objective 0.6% total, sort 0.4%.
- Prediction: efforts on these surfaces cannot move end-to-end latency materially.
- Falsifier: a later profile shows one of these above the ≥2 opportunity threshold.

## H5 — retained memory is healthy, while transient churn may still matter

- Evidence: peak RSS is ~78.2 MiB, but the post-workload retained heap is only 1.2 MB and dominated by JIT structures.
- Prediction: allocation-focused changes may improve CPU/GC behavior, but should not be justified as leak fixes.
- Falsifier: longitudinal retained heap or peak RSS grows with trial count.
