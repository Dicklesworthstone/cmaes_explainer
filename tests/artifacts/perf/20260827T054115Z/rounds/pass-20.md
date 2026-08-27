# Pass 20 — cross-dimensional final profile

Date: 2026-08-27

## Decision

Rejected the one tested candidate and retained no source change. The accepted
engine remains exactly commit `37425a9` with SHA-256
`a05cc55aa80e8c5831f51126fd4b6c5c0721c85b479c914b6ba7253f2ac0f93a`.

The final profile still identifies cyclic Jacobi eigendecomposition as the
dominant high-dimensional cost. The highest-confidence remaining micro-lever
was to compute `Math.abs(apq)` once rather than twice per pivot. It satisfied
the opportunity threshold, but the 300-trial representative benchmark and a
matched sampled profile failed the material-improvement gate. The exact
accepted source was restored manually and verified by source hash.

## Final representative result

The original primary protocol was repeated without alteration: dimension 24,
250 generations, 300 measured in-process trials after ten warmups, seed 1729,
and 975,000 objective evaluations.

| Metric | Baseline | Final | Change |
|---|---:|---:|---:|
| p50 | 68.7955 ms | 50.9240 ms | -25.98% |
| p95 | 71.5270 ms | 52.7109 ms | -26.31% |
| p99 | 76.8621 ms | 56.8705 ms | -26.01% |
| Throughput | 46,970.7 eval/s | 63,489.0 eval/s | +35.17% |
| Maximum RSS | 81,969,152 B | 76,169,216 B | -7.08% |

The deterministic checksum is exactly `24940.517463897122` before and after
the campaign. Peak RSS remains below the 90,166,067-byte guardrail.

The campaign's deliberately aggressive 2x targets were not met: final p95 is
52.71 ms rather than at most 35.8 ms, final throughput is 63,489 rather than at
least 93,942 evaluations/s, and the 12-D scaling p95 is 14.14 ms rather than at
most 7.6 ms. This is a substantial measured improvement, not a 2x result.

## Cross-dimensional timing and profiles

Forty measured trials after five warmups were used for each scaling row except
dimension 24, where the more stable 300-trial primary result is reported.
Because sub-millisecond low-dimensional trials are disproportionately exposed
to GC and scheduler pauses, their p95 values are descriptive rather than
retention gates.

| Dim | Final p50 | Final p95 | Final throughput | Leading sampled self time |
|---:|---:|---:|---:|---|
| 1 | 0.7220 ms | 1.6563 ms | 1,111,657 eval/s | allocation/native overhead dominates |
| 2 | 1.2066 ms | 4.6758 ms | 771,065 eval/s | native `map` 12.6%; rank-mu step 9.2% |
| 4 | 2.0298 ms | 2.9997 ms | 905,302 eval/s | transition regime |
| 8 | 5.1770 ms | 5.7480 ms | 481,827 eval/s | Jacobi 15.4%; rank-mu step 14.6% |
| 12 | 12.0184 ms | 14.1427 ms | 224,804 eval/s | eigensystem share rising |
| 24 | 50.9240 ms | 52.7109 ms | 63,489 eval/s | Jacobi 37.6%; rank-mu step 21.7% |
| 48 | 258.5789 ms | 262.7881 ms | 14,484 eval/s | Jacobi 59.7%; rank-mu step 9.1% |

Independent 500-microsecond CPU profiles covered dimensions 2, 8, 24, and 48.
Jacobi's self share rises from below the leading entries at dimension 2 to
15.4% at 8, 37.6% at 24, and 59.7% at 48, which is consistent with its cubic
matrix work. At dimension 24 the next named regions are eigen-coordinate sample
transformation at 5.2%, Mahalanobis norm at 3.4%, and covariance reconstruction
at 2.7%. At dimension 48 reconstruction is 4.6% and transformation is 4.3%.

## Final opportunity matrix

| Opportunity | Impact | Confidence | Effort | Score | Outcome |
|---|---:|---:|---:|---:|---|
| Reuse Jacobi `abs(apq)` | 1 | 3 | 1 | 3.0 | Tested and rejected |
| Further exact Jacobi arithmetic restructuring | 4 | 2 | 5 | 1.6 | Below threshold after passes 4, 5, 6, 7, and 19 |
| Rank-mu storage/recomputation rewrite | 3 | 2 | 4 | 1.5 | Below threshold after passes 2, 3, and 13 falsified variants |
| Transform workspace/fusion | 2 | 2 | 3 | 1.3 | Below threshold after passes 8 and 9 regressed |
| Projection fusion | 1 | 3 | 3 | 1.0 | Below threshold; pass 16 found only 0.8% integrated share |

Replacing Jacobi with a library or a different eigenalgorithm may be faster,
especially at dimension 48, but it cannot promise byte-identical eigenvalues,
eigenvectors, convergence thresholds, sign choices, or downstream trajectories.
It is therefore outside this campaign's exact-behavior contract.

## Candidate rejection

The candidate bound `Math.abs(apq)` to a local and reused it for residual and
tolerance checks. It changed no order, branch, RNG draw, repair, snapshot, or
floating-point value. Nevertheless:

| Metric | Accepted source | Candidate | Change |
|---|---:|---:|---:|
| p95, 300 trials | 52.7109 ms | 53.4839 ms | +1.47% |
| Throughput | 63,489 eval/s | 62,761 eval/s | -1.15% |
| Sampled workload duration | 8.36 s | 8.44 s | +0.96% |
| Jacobi self time | 3.14 s | 3.04 s | -3.18% |

The local self-time movement is smaller than the 4.8% noise envelope and did
not translate to wall time. The candidate was restored rather than retained.

## Behavioral proof and quality gates

- Fresh goldens for dimensions 1, 2, 4, 8, 12, 24, and 48 are byte-identical
  to the authoritative oracle; every stored SHA-256 matches.
- Ordering, tie-breaking, and RNG draw count are transitively exact because the
  accepted source is byte-identical to pass 19 and all seeded outputs match.
- Reflected-phenotype and literal-clipping tests prove repair behavior.
- Covariance isolation and WASM snapshot tests prove public snapshot ownership.
- Focused and full tests: 16 pass, 0 fail, 157 assertions.
- Typecheck, lint, production build, and `git diff --check`: pass.
- Repository-wide UBS scan: exit 0 and zero critical issues. Its heuristic
  warnings concern pre-existing repository files, not a retained pass-20 edit.
- No `format` script exists, and pass 20 retains no source edit.

## Artifacts and rollback

The `pass-20-final-*`, `pass-20-scaling-*`, `pass-20-profile-dim-*`,
`pass-20-golden-*`, `pass-20-rss*`, `pass-20-{test,full-test,typecheck,lint,
build,ubs}*`, candidate profile, JSON summaries, and this report contain the
evidence. Pass 20 needs no code rollback. The last accepted performance commit
is `37425a9`; its pre-pass source is `a60acc4`.

`.skill-loop-progress.md` was not modified. No file was deleted, no destructive
command was used, and no commit was made.

## Orchestrator verification

The orchestrator verified that all three production CMA-ES bridge/engine files
have no working-tree diff and that the ND engine retains the pass-19 SHA-256
`a05cc55aa80e8c5831f51126fd4b6c5c0721c85b479c914b6ba7253f2ac0f93a`.
An independent 300-trial root rerun recorded p50 50.93170800000007 ms, p95
53.97729199999958 ms, p99 57.1869999999999 ms, throughput 63,343.506
evaluations/s, and the exact checksum 24940.517463897122. This corroborates the
reported final result within the established noise envelope. Full tests,
typecheck, lint, production build, and `git diff --check` passed again.
