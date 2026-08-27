# Pass 7/20 — reused per-generation buffers

Status: rejected; no production source change retained.

Opportunity score: 7.5. The candidate reused five ephemeral per-generation
buffers: latent candidates, true fitness, rank order, active weights, and the
covariance output.

Release A/B used 120 alternating samples:

- UI-default mean/p95: -0.08% / -0.01%.
- Admitted-maximum mean/p95: +0.10% / -0.54%.
- Admitted-maximum p99: +6.28%.
- WASM size: 107,691 -> 107,971 bytes (+280 bytes).

The candidate retained exact output hashes but provided no repeatable
production improvement, worsened the far tail, and enlarged the artifact. It
was manually removed.

Restoration proof: source returned to Git blob
`b122fbe87a1ef0285355f3e8af31e2c1ed914b3b`, and the fresh restored release
matched production SHA-256
`3ac266842803ce52c93f304c859430effc4d48520363eef4fd23bd6224f2cb5e`.
Rustfmt, all 17 tests, strict local Clippy, wasm32 check, and release wasm-pack
build passed after restoration.
