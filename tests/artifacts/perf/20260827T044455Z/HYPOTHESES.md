# Hypothesis ledger

| ID | Hypothesis | Expected signal | Status |
|---|---|---|---|
| H1 | Repeated Jacobi eigendecomposition and covariance reconstruction dominate `step()` as dimension rises. | CPU profile attributes the largest optimizer-exclusive share to `jacobiEigenSymmetric` and its callers; runtime grows super-quadratically. | Confirmed: eigendecomposition was 32.8% self CPU and reconstruction 4.9%. |
| H2 | Reusing the just-computed, positive-definite post-update eigensystem for visualization and the next generation removes redundant cubic work without changing CMA-ES equations. | Fewer eigendecompositions per generation, lower p50/p95/p99, unchanged convergence/correctness gates. | Confirmed: p50 improved 30.2% in isolation. |
| H3 | Applying `B D` and `B D^-1 B^T` directly avoids dense covariance-power composition and matches reference sampling. | `compose` disappears as a hotspot; another material latency improvement; convergence gates pass. | Confirmed: final p50 is 35.1% below baseline and `compose` is absent from the final hot list. |
| H4 | Array pooling/preallocation is the next worthwhile lever. | Heap/CPU profiles show allocation or GC as a dominant remaining cost. | Rejected: retained heap was 1.2 MB and the risk/effort-adjusted score was below 2. |
