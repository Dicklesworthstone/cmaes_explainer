# Pass 6/20 — direct-index matrix-vector loop

Status: rejected; no production source change retained.

The current named profile attributed 9.6% total / 5.7% self time to
`mat_vec_into`, with the optimizer at 60.0% and envelope construction at 37.5%.
The candidate replaced its iterator reduction with direct indexed loops.

Interleaved release A/B used 168 calls per arm:

- p50: -0.21%
- p95: -1.12%
- p99: +0.71%
- mean: +0.25%

The mixed distribution failed the production gate, and the candidate also
failed strict local Clippy's `needless_range_loop` lint. The exact output hash
remained unchanged during the experiment.

The candidate was manually removed. Source SHA-256 returned to
`19b8ce8725f475c8dbf959f7263bda4b20a669451bfe74d7325a6a429dece667`.
The restored release artifact was byte-identical to production at 107,691
bytes, SHA-256 `3ac266842803ce52c93f304c859430effc4d48520363eef4fd23bd6224f2cb5e`.
All 17 tests, rustfmt, strict local Clippy, wasm32 check, and fresh release build
passed after restoration.
