# Honest benchmark gate

| Gate | Result | Evidence |
|---|---|---|
| Representative work | Pass | Full `CMAESOptimizerND.step` pipeline, including sampling, objective evaluation, covariance adaptation, eigensystem update, projection, and snapshot construction. |
| Work equivalence | Pass | Fixed 250 generations, default population, deterministic seed, and reported evaluation count. |
| Deterministic oracle | Pass | SHA-256 goldens for dimensions 1, 2, 4, 8, 12, 24, and 48. |
| Warmup policy | Pass | Ten in-process warmups for the primary run; Hyperfine uses three fresh-process warmups plus two harness warmups. |
| Repetition and tails | Pass | 300 primary trials and 30 Hyperfine process samples; p50/p95/p99 reported. |
| Noise characterization | Pass | Same-seed five-repeat p95 drift is 4.8%; Hyperfine CV is ~1.0%. |
| Anti-specialization | Pass | Results and checksums are consumed and serialized; the objective depends on every coordinate. |
| Hidden caching | Pass | Every trial constructs a fresh optimizer; no benchmark memoization or result cache. |
| Hardware/toolchain fingerprint | Pass | `fingerprint.json`. |
| Static bias audit | Pass | `baseline/bias-audit.md` reports zero flags. |

The separate changed-seed variance series is explicitly excluded from the noise estimate because it changes the algorithmic trajectory. No OS tuning was applied: host-level tuning requires separate approval and is unnecessary for this stable baseline.
