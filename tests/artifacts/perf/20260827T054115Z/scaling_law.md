# Scaling law

Each row is the same 250-generation deterministic scenario. Trial count is reduced only at high dimensions to keep the profiling run bounded.

| Dimension | Trials | p50 (ms) | p95 (ms) | p99 (ms) | Evaluations/s |
|---:|---:|---:|---:|---:|---:|
| 1 | 200 | 0.660 | 1.429 | 2.067 | 1,307,708 |
| 2 | 200 | 0.974 | 1.753 | 2.536 | 1,341,202 |
| 4 | 200 | 2.037 | 2.689 | 3.332 | 953,298 |
| 8 | 200 | 5.502 | 6.051 | 8.348 | 446,103 |
| 12 | 200 | 14.510 | 15.109 | 18.014 | 187,522 |
| 24 | 100 | 68.933 | 70.360 | 72.817 | 47,066 |
| 48 | 20 | 349.128 | 357.317 | 357.385 | 10,721 |

From 12→24 dimensions, p50 grows 4.75×; from 24→48 it grows 5.07×. A log-log fit over dimensions 8–48 is approximately O(n^2.3), consistent with the combination of an O(lambda·n²) covariance update and repeated O(n³) eigensystem work, where the default population size lambda grows slowly with n. The 48-D tail estimates are directional because n=20 is too small for a high-confidence p99.

The curve rules out the objective function and candidate sort as primary scaling limits: objective evaluation is O(n), sorting is O(lambda log lambda), while measured cost rises much faster.
