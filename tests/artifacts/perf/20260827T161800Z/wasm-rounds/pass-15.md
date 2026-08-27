# Pass 15/20 — retained projection covariances

Status: rejected; no production source change retained.

Opportunity score: 10. The tested lever retained each already-rebuilt repaired
covariance for later phase-space projection, avoiding a second reconstruction
from that generation's eigenpairs. All 363,247 packet words across 15
workloads, plus direct dimension-2 and dimension-3 cases, remained
bit-identical. The aggregate packet SHA-256 was
`77342c8254337847997df276d345681395347a4e4fb130ac2caff48f8a4123dd`.

The first 240-trial alternating run appeared promising at the maximum (mean
-2.64%, p95 -2.02%) while UI mean improved 0.47% and p95 regressed 0.17%.
The independent 400-trial repeat did not confirm it: UI trimmed mean/p95
regressed 0.57%/0.88%, and maximum trimmed mean/p95 improved only
0.25%/0.12%. The candidate also added one 64 KiB WASM memory page and enlarged
the binary by 207 bytes.

The candidate was rejected and manually restored. The restored 105,022-byte
WASM and wrapper are byte-identical to production at SHA-256
`29bab2085fb37f7ed1415bd76dbae71d555175e322cb4a2dd7343c4976ad0386`
and `eeed2c8ecf1ca0e38d6d447997e77c00b25707e23eb7dda54d29e237dc98f4a1`.
Rustfmt, all 18 native tests, strict crate-local Clippy, wasm32 checking,
release wasm-pack, and Rust UBS with zero critical findings passed.
