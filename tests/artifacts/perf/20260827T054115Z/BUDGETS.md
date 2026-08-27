# CMA-ES performance budgets

These budgets are tied to `fingerprint.json` and the deterministic workload in `DEFINE.md`.

| Surface | Baseline source | Campaign budget | Guardrail |
|---|---:|---:|---|
| ND dimension 24, 250 generations, p95 | 71.53 ms | ≤ 35.8 ms | Exact or explicitly proved golden behavior |
| ND dimension 12, 250 generations, p95 | 15.11 ms | ≤ 7.6 ms | Exact or explicitly proved golden behavior |
| Throughput, dimension 24 | 46,971 evaluations/s | ≥ 93,942 evaluations/s | Same evaluation count and seed |
| Peak RSS | 81,969,152 bytes | ≤ 90,166,067 bytes | Heap profile must show no retained-growth regression |

The target is intentionally aggressive because this is a multi-pass campaign. Individual changes are accepted only with an opportunity score of at least 2.0 and a measured or independently profiled improvement.
