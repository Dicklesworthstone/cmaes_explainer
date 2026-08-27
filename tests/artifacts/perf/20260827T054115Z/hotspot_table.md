# Ranked hotspot table

CPU evidence is a 500 μs sampled profile of 150 trials (11.28 s, 17,489 samples). Shares are sampled self-time unless stated otherwise.

| Rank | Hot path | CPU evidence | Independent evidence | Opportunity score | First-principles interpretation |
|---:|---|---:|---|---:|---|
| 1 | Rank-μ covariance accumulation, `step` around line 633 | 24.6% self plus 6.0% loop/setup | Nested lambda × upper-triangle work; scaling is super-quadratic | 5.0 | The loop repeatedly traverses candidates inside every matrix element and dominates arithmetic work. |
| 2 | Jacobi rotation coefficient, lines 139–140 | 36.6% combined self | `hypot` alone is 1.5%; 24→48 cost grows 5.07× | 5.0 | Stable rotation math is executed for every accepted pivot across cubic sweeps. |
| 3 | Eigensystem orchestration/reconstruction | 40.8% total at call site; reconstruction 2.1% self | Covariance is reconstructed and decomposed every generation | 4.0 | The implementation materializes full nested matrices around an already expensive decomposition. |
| 4 | Eigen-coordinate transform | 4.2% self | Runs lambda times per generation, allocates a result vector | 3.0 | Dense matrix-vector multiply and an avoidable intermediate allocation sit on candidate generation. |
| 5 | Whitening | 5.1% combined self | Called for mean shift and negative-weight candidates | 3.0 | Two matrix-vector passes plus result allocation are repeated on each update. |
| 6 | Higher-order array helpers and cloning | `map` 1.7%, `fill` 1.3%, `from` 0.3%; cloning 1.1% total | Source shows per-generation vectors/matrices and callback closures | 2.5 | Allocation/churn is secondary but can amplify the arithmetic hotspots and JIT overhead. |
| 7 | Gaussian sampling | 1.9% total | Two scalar normal draws per Box–Muller pair are already reused | 1.5 | Below the score threshold until larger hotspots move. |
| 8 | Candidate sorting | 0.4% | lambda is only 13 at n=24 | 0.5 | Not eligible for optimization in the current profile. |

Opportunity scores use measured share, call frequency, avoidable work, risk, and proofability. Only scores ≥2.0 enter the initial mission queue.
