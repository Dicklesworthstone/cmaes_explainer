# Pass 13/20 — fused transform matrices

Status: rejected; no production source change retained.

Release-stage profiling ruled out the packed ABI itself as the remaining
bottleneck. On the UI workload, Rust/WASM execution plus packet construction
averaged 4.3296 ms and wasm-bindgen's JavaScript `.slice()` transfer averaged
0.0278 ms (0.64%). At the admitted maximum those figures were 17.1008 and
0.0981 ms (0.57%). A 4,247-sample named profile attributed 89.69% inclusively
to `cmaes_run`, 23.36% to Gaussian filling, 17.87% to matrix-vector work,
16.39% to Jacobi eigendecomposition, and only 0.49% to `ok_packet`.

Opportunity score: 4.45. The tested lever jointly constructed the covariance
square-root and inverse-square-root transforms, sharing eigenvalue traversal,
square roots, and indexing while preserving the accumulator operation order.
Packets remained byte-identical across UI, maximum, bounded maximum, noisy,
early-stop, and all ten refusal workloads. The candidate also reduced the
release WASM from 105,022 to 104,207 bytes.

Latency did not improve repeatably. The first 240-call alternating trial was
effectively neutral. In a 400-call-per-arm repeat, the UI trimmed mean improved
0.34%, but the maximum mean/p50/p95/trimmed mean regressed
2.24%/1.09%/10.16%/1.97%. The candidate was rejected and manually restored.
The restored source and release artifacts match production exactly: WASM
SHA-256 `29bab2085fb37f7ed1415bd76dbae71d555175e322cb4a2dd7343c4976ad0386`
and wrapper SHA-256
`eeed2c8ecf1ca0e38d6d447997e77c00b25707e23eb7dda54d29e237dc98f4a1`.
Rustfmt, all 18 native tests, strict crate-local Clippy, wasm32 checking,
release wasm-pack, and the Rust UBS critical scan passed.
