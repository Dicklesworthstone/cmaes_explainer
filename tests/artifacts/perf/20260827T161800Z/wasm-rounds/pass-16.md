# Pass 16/20 — caller-owned Jacobi workspace

Status: rejected; no production source change retained.

A fresh named profile attributed 13.760% inclusive and 3.172% self time to
`jacobi_eigh`, but only 1.226% inclusive time to its allocation descendants.
Opportunity score: 4.0. The tested lever supplied reusable eigenvalue,
eigenvector, and work-matrix storage from the CMA-ES caller, removing the
per-call workspace construction without changing the Jacobi sweep, pivot,
rotation, sorting, or eigenvector-sign conventions.

All 363,009 packed words across the 15-workload parity suite remained
bit-identical, with zero differing words. The aggregate packet SHA-256 was
`7b39b8f15dc8e16ccc0d9847b4eae508877219148921572597196096fc241863`.
Performance rejected the candidate in two independent alternating A/B runs:

- 240 samples per arm: UI trimmed mean regressed 1.528%; maximum improved
  0.266%, below the measured noise envelope.
- 400 samples per arm: UI trimmed mean regressed 1.421%; maximum improved
  0.358%, again below noise.
- Release WASM grew by 455 bytes.

The candidate was rejected and manually restored. Root independently verified
that the relevant Frankensim and site diffs were empty, all 18 native CMA-ES
tests passed, all 17 Bun CMA-ES tests passed (175 assertions), Rustfmt passed,
strict crate-local Clippy passed, and the wasm32 build checked. The restored
105,022-byte WASM and wrapper match production exactly at SHA-256
`29bab2085fb37f7ed1415bd76dbae71d555175e322cb4a2dd7343c4976ad0386`
and `eeed2c8ecf1ca0e38d6d447997e77c00b25707e23eb7dda54d29e237dc98f4a1`.

The broad `fs-la` test lane remains blocked by unrelated pre-existing
`fs-session` compile failures, and strict `fs-la` Clippy reports 24 existing
lints. Those broader findings did not affect the focused crate gates or the
candidate decision.
