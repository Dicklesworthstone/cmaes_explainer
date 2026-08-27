# Pass 14/20 — indexed Gaussian pair filling

Status: rejected; no production source change retained.

A fresh 6,779-sample profile confirmed `fill_gaussian` remained hot and
attributed 59 samples (0.87% self) to `ChunksMut::next`. Opportunity score:
10.0. The tested lever replaced `chunks_mut(2)` with indexed Box–Muller pairs
and an explicit odd-dimensional tail without changing LCG transitions, random
draw consumption, transcendental calls, or floating-point operation order.

All 363,009 packet words across 15 workloads remained bit-identical, including
UI, maximum, bounded, noisy, early-stop, and ten refusals. Performance was
neutral and inconsistent:

- 240 alternating samples per arm: UI mean/p95 +0.050%/+0.142%; maximum
  -0.193%/-0.108%.
- 400 alternating samples per arm: UI mean/p95 +0.111%/-0.907%; maximum
  -0.021%/-0.148%.
- The larger repeat regressed p99 by 1.94% on UI and 2.82% at maximum.
- Release WASM grew from 105,022 to 105,559 bytes.

The candidate was rejected and manually restored. The restored 105,022-byte
binary is byte-identical to production with SHA-256
`29bab2085fb37f7ed1415bd76dbae71d555175e322cb4a2dd7343c4976ad0386`.
Rustfmt, all 18 native tests and doc tests, strict crate-local Clippy, wasm32
checking, release wasm-pack, and the Rust UBS critical scan passed.
