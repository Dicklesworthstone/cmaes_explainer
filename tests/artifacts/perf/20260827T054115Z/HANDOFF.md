# Profiling handoff

## Executive summary

The TypeScript ND optimizer is working and deterministic, but its 24-D hot path is dominated by two kernels: rank-μ covariance accumulation and Jacobi eigendecomposition. Together their directly attributed sampled self-time is about 67%; eigensystem orchestration reaches 40.8% total at its call site. The primary fresh baseline is 68.80 ms p50 / 71.53 ms p95, with 4.8% same-seed p95 drift and ~1.0% fresh-process CV.

## Optimization order

1. Reduce covariance-update traversal and temporary work while retaining exact candidate and floating-point accumulation order.
2. Reduce Jacobi pivot/sweep work or coefficient cost only with eigen residual, convergence, and deterministic proof.
3. Fuse/reuse transform, whitening, reconstruction, and snapshot workspaces.
4. Reprofile before touching Gaussian sampling, sorting, or objective evaluation.

## Acceptance contract

Every lever receives its own before/after evidence, exact golden verification unless an explicit equivalence proof is supplied, convergence/property tests, and an isolated commit. A wall-time change inside 4.8% is inconclusive unless CPU or allocation profiles independently prove the targeted region moved. Peak RSS may not exceed 90,166,067 bytes.

## Rejected directions

- I/O and concurrency: absent from this CPU-bound workload.
- Candidate sorting: only 0.4% sampled self-time.
- Objective micro-optimization: only 0.6% total profile time and not representative of application objectives.
- Retained-memory leak work: no leak evidence.

The next phase is the explicitly requested strictly sequential 20-pass extreme-optimization campaign. Its authoritative mission and result ledger is `.skill-loop-progress.md`.
