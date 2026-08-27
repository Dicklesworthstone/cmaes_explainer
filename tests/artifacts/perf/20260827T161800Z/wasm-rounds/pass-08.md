# Pass 8/20 — in-place ranked population permutation

Status: rejected; no production source change retained.

Fresh named profiling showed high direct counts in floating-point formatting,
`cmaes_run`, `mat_vec_into`, and memory copies. Opportunity score: 8. The
candidate replaced per-generation ranked population allocations/copies with an
in-place bit permutation.

Exact output and rank/tie order were preserved across 15 cross-landscape
fixtures and the admitted maximum. Production A/B used 120 samples per arm:

- Admitted-maximum p50: -0.45%.
- Admitted-maximum p95: +0.59%.
- Admitted-maximum p99: +2.13%.
- Admitted-maximum mean: -0.14%.
- Binary size: 107,691 -> 107,995 bytes (+304 bytes).

The mixed tail, neutral mean, and larger artifact failed the retention gate.
The candidate was manually removed. Source returned to Git blob
`b122fbe87a1ef0285355f3e8af31e2c1ed914b3b`; a fresh restored WASM matched
production SHA-256
`3ac266842803ce52c93f304c859430effc4d48520363eef4fd23bd6224f2cb5e`.

Rustfmt, all 17 native tests, doc tests, strict local Clippy, wasm32 check, and
release wasm-pack build passed after restoration.
