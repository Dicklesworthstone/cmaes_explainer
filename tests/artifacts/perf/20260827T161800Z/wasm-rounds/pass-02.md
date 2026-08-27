# Pass 2/20 — reusable matrix-vector buffers

Status: accepted.

Opportunity score: 7.5/10. After streaming serialization, matrix-vector work
remained 14.0% of the named diagnostic profile and its iterator/collection
stack allocated a fresh result vector for every candidate and whitening call.

Change: add an exact-order `mat_vec_into` kernel and reuse three n-element
buffers for sampling, mean whitening, and negative-weight Mahalanobis work.
The existing allocating helper remains test-only.

The subagent's median result across five balanced production A/B blocks was
1.96% faster for UI-default and 2.58% faster for admitted-maximum. An
independent root 100-sample interleaved A/B measured:

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 25.053 ms | 24.871 ms | -0.73% |
| p95 | 26.051 ms | 25.757 ms | -1.13% |
| mean | 25.249 ms | 25.007 ms | -0.96% |

The post-profile reduced matrix-vector attribution from 14.0% to 9.8% and
removed the targeted Vec allocation/collection stack.

Exact behavior proof:

- UI-default JSON SHA-256 remained
  `85f75ee2a2df5d98c31e66b0cc032989abd59fd10ab346b88e0334e44150f688`.
- Admitted-maximum JSON SHA-256 remained
  `b6ea32431e10f77c9d31db7eb1583ce8cc378a209f973560c86fcad14db33e1f`.
- All 17 native and all 17 public-bundle differential tests passed.
- Rustfmt, strict local Clippy, wasm32 check, release build, diff checks, and
  Rust UBS with zero critical findings passed.
