# Schema-2 CMA family and G1 browser profile

Run: `20260828T034700Z-schema2-v053`. Lower is faster. These are production
`wasm-pack --release` plus `wasm-opt` measurements in Chrome, not extrapolated
native timings. Raw trials and checksums are in `baseline.json`; the complete
sampling trace is `schema2-v053.cpuprofile`.

## Stable scenarios

| Scenario | Family | Trials | p50 | p95 | Mean |
|---|---|---:|---:|---:|---:|
| 96-D, population 16, 10 generations, 10⁴ ellipsoid | Full | 5 | 1,776.38 ms | 1,780.58 ms | 1,777.25 ms |
| same | Separable | 20 | 5.35 ms | 6.04 ms | 5.68 ms |
| same | LM-CMA, memory 12 | 20 | 6.80 ms | 6.85 ms | 6.81 ms |
| same | LM-MA, memory 12 | 20 | 6.57 ms | 6.70 ms | 6.58 ms |
| 5,040-D, population 8, 5 generations, sphere | Separable | 10 | 69.30 ms | 73.21 ms | 69.90 ms |
| same | LM-CMA, memory 12 | 10 | 76.78 ms | 80.47 ms | 77.47 ms |
| same | LM-MA, memory 12 | 10 | 78.92 ms | 82.88 ms | 79.43 ms |
| G1 5,040-D, eight 0.25 s owner rollouts | batched evaluator | 10 | 7.04 ms | 7.17 ms | 7.06 ms |
| G1 5,040-D, one full 1.5 s zero-policy rollout | single evaluator | 20 | 0.87 ms | 0.89 ms | 0.87 ms |

The full-duration zero policy terminates after 19 of 180 possible steps, so the
last row measures that exact deterministic falling baseline rather than a
claimed 180-step successful walk. The fixed eight-policy batch takes almost
exactly eight single-rollout times; batched numeric transport is not the
current bottleneck.

## Ranked sampled hot regions

The Chrome profile contains 15,382.65 ms of sampled time. Release symbol names
are stripped, so the numeric WASM frames were cross-checked against Binaryen's
function map and export table. The interpretation of internal frames is marked
as inference where appropriate.

| Rank | Region | Self share | Evidence and interpretation |
|---:|---|---:|---|
| 1 | deterministic software fused multiply-add (`wasm-function[25]`) | 81.61% | Its three-f64 bit-level body is the deterministic FMA fallback; the share is driven by dense Full-CMA linear algebra. |
| 2 | browser program/idle sampling | 8.86% | Incidental page/runtime time around the synchronous benchmark; not optimizer work. |
| 3 | exported CMA tell/update (`wasm-function[166]`) | 5.26% | Binaryen maps the sampled wrapper to `cmaesvizsession_tell`; inclusive owner update work remains below the FMA leaf. |
| 4 | secondary internal numeric kernel (`wasm-function[59]`) | 0.87% | Internal release symbol stripped; attribution beyond “numeric owner code” would be speculation. |
| 5 | JS benchmark objective loop | 0.28% | `runFamily` self time. It is not a useful first optimization target. |
| 6 | garbage collection | 0.19% | Too small to justify a boundary redesign. |
| 7 | wasm-bindgen `ask` + `tell` glue | 0.088% combined | 7.56 + 6.01 ms across the whole profile; packet glue is no longer the dominant cost in this schema-2 workload. |

## Profile-driven decisions

| Candidate | Expected impact | Confidence | Effort/risk | Decision |
|---|---:|---:|---:|---|
| Replace deterministic software FMA with host reassociation/hardware behavior | very high for Full | high | changes fixed-seed floating-point trajectories and the reference contract | Reject; correctness is a hard constraint. |
| Use Full CMA for the 5,040-D flagship | catastrophic | certain | 25,401,600 covariance entries plus cubic update | Refused by the browser owner above 256-D; use the three scalable owners. |
| Validate all 5,040 immutable policy weights every physics step | avoidable O(steps × 5,040) | certain | low | Removed: `G1ResidualPolicy` admits once per rollout. The zero baseline performs 19× fewer parameter checks; a complete 180-step horizon performs 180× fewer. These are operation-count reductions, not claimed wall-time speedups. |
| Allocate a 16-wrench vector every physics step | small but repeated | high | low | Removed: fixed-size stack storage, with identical deterministic receipts. |
| Split eight G1 policies into eight JS/WASM calls | low benefit, extra boundary traffic | high | low | Avoided: the worker uses one row-major `evaluate_population` call. |
| Optimize JS ellipsoid weight calculation | below 0.3% of sampled time | high | low | Reject for now; it cannot materially move the flagship. |

## Result

The highest-impact architectural optimization is selection, not a clever dense
kernel trick: at 96 dimensions and the same seed/budget, the scalable families
are roughly 261×–332× faster than Full by p50, while retaining actual owner CMA
updates. At 5,040 dimensions, five complete generations finish in 69–79 ms p50
and execute off the UI thread. The remaining dominant Full-CMA FMA path is an
explicit determinism/correctness tradeoff, not an overlooked packet-copy issue.
