# WASM versus TypeScript UI-ready comparison

This comparison measures the complete paths used by the site, not just the
numeric loop:

- WASM: optimize, project, serialize in Rust, transfer/decode the string,
  `JSON.parse`, and adapt snapshots into viewer state.
- TypeScript: optimize, project, and retain the directly produced viewer state.

Sixty interleaved trials per engine were run after eight warmups.

| Scenario | WASM p50/p95/mean | TypeScript p50/p95/mean | WASM relative to TS |
|---|---:|---:|---:|
| UI-default Rosenbrock | 6.920 / 7.535 / 7.036 ms | 1.811 / 2.398 / 1.900 ms | 3.70x slower by mean |
| Admitted-maximum ELLI | 30.078 / 32.218 / 30.325 ms | 7.458 / 9.718 / 7.716 ms | 3.93x slower by mean |

The current WASM kernel emits 589,097 bytes for the UI default and roughly
3.3 MB for maximum workloads. The production profile attributes 36.1% of
in-WASM time to envelope construction before accounting for JavaScript string
decoding, parsing, and adapter allocation. Remaining campaign passes therefore
prioritize the WASM/JS data boundary over further sub-percent numeric-loop
tuning.
