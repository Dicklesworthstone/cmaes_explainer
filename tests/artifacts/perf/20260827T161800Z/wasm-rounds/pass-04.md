# Pass 4/20 — unstable population ranking

Status: rejected; no production source change retained.

Opportunity score: 10. The candidate replaced stable population `sort_by`
with `sort_unstable_by`. Fitness is followed by the unique original sample
index, so the comparator has a total order and the change was semantically
eligible.

Production A/B used 120 samples per artifact:

| Workload | Baseline p50/p95/mean | Candidate p50/p95/mean | Result |
|---|---:|---:|---:|
| UI default | 5.738 / 6.472 / 5.837 ms | 5.705 / 6.157 / 5.796 ms | mean -0.70% |
| Admitted maximum | 25.350 / 27.643 / 25.579 ms | 25.414 / 28.068 / 25.672 ms | mean +0.36%, p95 +1.54% |

The named profile attributed 2.2% total time to both variants. The unstable
implementation moved work into ipnsort/small-sort networks rather than
removing it. Exact JSON hashes remained unchanged, and all 17 native tests,
wasm32 check, strict local Clippy, rustfmt, and release wasm-pack build passed.

The candidate failed the governing maximum-workload gate and was manually
removed. `src/lib.rs` returned byte-for-byte to SHA-256
`a670bee7e4ff63d0974b7bc5ae3768aa3a308f4f57745015f93a2a4d10fd7be2`.
