# Pass 9/20 — specialized elite-flag serialization

Status: rejected; no production source change retained.

The current profile attributed 37.7% total time to `ok_envelope` but only 0.9%
to `push_byte_arr`. Opportunity score: 5. The candidate emitted the elite
flags directly as `0` and `1` instead of invoking generic integer formatting.

The focused profile improved `push_byte_arr` from 57.8 to 22.5 ms (-61%). Two
maximum-workload release A/B runs improved mean by 0.79% and 0.89%, but the
UI-default p50 regressed 0.13%, bounds-enabled maximum mean/p95 regressed
0.05%/0.15%, and the WASM grew from 107,691 to 107,720 bytes.

Because cross-workload results were mixed, the candidate was manually removed.
The maximum output and 15-fixture aggregate remained byte-identical throughout.
Source returned exactly to Git blob `b122fbe8...e667`, and the restored release
matched production SHA-256 `3ac26684...cb5e`.

All 17 native tests, doc tests, rustfmt, strict Clippy, wasm32 check, and release
wasm-pack build passed after restoration.
