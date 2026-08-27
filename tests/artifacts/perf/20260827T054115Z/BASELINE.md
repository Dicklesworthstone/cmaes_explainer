# Fresh baseline

Run ID: `20260827T054115Z`. The complete machine and toolchain identity is in `fingerprint.json`.

## Primary result

`CMAESOptimizerND`, 24 dimensions, 250 generations, anisotropic ellipsoid, seed 1729, 300 in-process trials after 10 warmups:

| Metric | Result |
|---|---:|
| p50 | 68.80 ms |
| p95 | 71.53 ms |
| p99 | 76.86 ms |
| Objective evaluations | 975,000 |
| Throughput | 46,971 evaluations/s |

Thirty fresh-process Hyperfine samples of a five-trial invocation measured 515.4 ± 5.2 ms, a coefficient of variation of about 1.0%. Five independent repeats with the exact same seed produced p95 values from 72.18 to 76.66 ms; maximum drift from the median was 4.8%, so the same-seed baseline is stable.

The earlier `variance-*` experiment intentionally remains in the evidence archive, but it is not the noise estimate: it changed the seed on every repeat and therefore changed the optimizer trajectory and eigensolver workload. Its 15.5% spread is workload variation, not measurement variation.

## Resource envelope

The 100-trial RSS run used 7.41 s wall, 7.79 s user CPU, 0.22 s system CPU, and 81,969,152 bytes maximum RSS. Zero block-input and block-output operations and only 0.22 s system time reject I/O as a meaningful limiter. The retained-heap snapshot was 1.2 MB across 8,450 objects, dominated by Bun/JSC code structures; it gives no evidence of retained-growth leakage.

## Reproduction

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
hyperfine --warmup 3 --runs 30 --export-json tests/artifacts/perf/20260827T054115Z/baseline/hyperfine-dim24.json 'bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=5 --warmup=2 --seed=1729 >/dev/null'
```

The static bias audit raised zero high-, medium-, or low-severity flags. The runtime honesty gate is documented separately in `HONEST_GATE.md`.
