# WASM CMA-ES optimization baseline

Run ID: `20260827T161800Z`

Kernel: `fs-cmaes-viz-wasm 0.3.0`

The production artifact was benchmarked after eight warmups with 40 measured
trials. Each trial includes the complete optimizer run, projection, JSON
serialization, wasm-bindgen string transfer, and JavaScript string decoding.

| Runtime | Scenario | p50 | p95 | p99 | Throughput | Envelope |
|---|---|---:|---:|---:|---:|---:|
| Bun 1.4.0 | UI default: n=5, lambda=16, 120 generations | 6.729 ms | 6.931 ms | 7.152 ms | 285,305 eval/s | 589,097 B |
| Bun 1.4.0 | Admitted maximum: n=6, lambda=48, 200 generations | 30.042 ms | 30.488 ms | 30.533 ms | 318,898 eval/s | 3,356,756 B |
| Chromium 143 | Admitted maximum: n=6, lambda=48, 200 generations | 35.015 ms | 35.500 ms | 35.585 ms | 273,840 eval/s | 3,356,756 B |

The Bun maximum-workload process RSS grew by 64,585,728 bytes across the
measurement loop. This is a retained-runtime observation rather than a
per-call allocation measurement.

## Profile evidence

The optimized production bundle profile is in `baseline-wasm.md` and
`baseline-wasm.cpuprofile`. Because release symbol names are stripped, the
same workload was also profiled with a named development build in
`baseline-wasm-named-dev.md` and `baseline-wasm-named-dev.cpuprofile`.

The named profile attributes 39.1% total time to `ok_envelope`, including
30.2% in numeric-array serialization and 21.3% in scalar float formatting.
The optimizer itself accounts for 58.1% total time. Within that work,
Gaussian filling accounts for 13.3%, matrix-vector construction for 11.5%,
and Jacobi eigendecomposition for 8.5%. These percentages are diagnostic-build
attribution and must be reconfirmed against the optimized production artifact
before retaining a change.

## Correctness gates

- The real production artifact passes the 17-test CMA-ES suite.
- Its first generation matches the TypeScript reference within 2e-15 for
  samples, mean, sigma, and spectrum.
- The browser loads version 0.3.0 as WASM and changing sigma0 from 0.3 to 1.0
  changes the displayed first-generation step size from 0.2882 to 0.9181.
- Browser smoke testing reported no console, page, or failed-request errors.
