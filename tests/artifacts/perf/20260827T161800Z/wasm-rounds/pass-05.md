# Pass 5/20 — precomputed ELLI axis scales

Status: accepted.

Opportunity score: 10. ELLI's `10^exponent` coefficient depends only on the
admitted dimension but was recomputed for every coordinate of every candidate
in every generation.

Change: compute the six-or-fewer axis coefficients once per ELLI run and reuse
their exact `powf` results during evaluation. Candidate accumulation order,
RNG consumption, ranking, and all optimizer arithmetic are unchanged.

The subagent's 15-run Hyperfine A/B, with 20 production calls per run,
improved from 656.6 +/- 5.4 ms to 638.8 +/- 4.7 ms (-2.7%). An independent
root 100-sample interleaved production A/B measured:

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 24.760 ms | 24.056 ms | -2.84% |
| p95 | 25.242 ms | 24.510 ms | -2.90% |
| mean | 24.811 ms | 24.143 ms | -2.69% |

Repeated `powf`, previously 3.1% self time in the named profile, disappeared.
The optimized WASM shrank from 107,721 to 107,691 bytes.

All three landscape/dimension fixtures and 15 cross-landscape configurations
were byte-identical. The standard maximum envelope retained SHA-256
`b6ea32431e10f77c9d31db7eb1583ce8cc378a209f973560c86fcad14db33e1f`.
All 17 native and 17 public-bundle differential tests, rustfmt, strict local
Clippy, wasm32 check, release wasm-pack build, and diff checks passed.
