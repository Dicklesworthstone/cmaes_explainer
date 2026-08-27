# Extreme CMA-ES optimization campaign — final result

The 20 strictly sequential passes produced a byte-identical CMA-ES trajectory
with a 26.31% lower representative p95, 35.17% higher objective-evaluation
throughput, and 7.08% lower peak RSS on the campaign machine.

| Outcome | Count |
|---|---:|
| Accepted | 9 |
| Rejected after measurement | 10 |
| No change after eligibility audit | 1 |

## Baseline to final

| Metric | Baseline | Final | Delta | Guardrail/budget |
|---|---:|---:|---:|---|
| 24-D p50 | 68.7955 ms | 50.9240 ms | -25.98% | descriptive |
| 24-D p95 | 71.5270 ms | 52.7109 ms | -26.31% | 35.8 ms budget not met |
| 24-D p99 | 76.8621 ms | 56.8705 ms | -26.01% | descriptive |
| Throughput | 46,970.7 eval/s | 63,489.0 eval/s | +35.17% | 93,942 budget not met |
| Maximum RSS | 81,969,152 B | 76,169,216 B | -7.08% | 90,166,067 B guardrail passed |

Correctness guardrails passed: all seven dimensional goldens are byte-identical,
the deterministic 300-trial checksum is unchanged, and tests cover ranking,
objective transforms, RNG-driven convergence, reflected and clipped repair,
positive-definite covariance, snapshot isolation, and WASM fallback semantics.
Typecheck, lint, production build, and focused/full tests pass.

## Accepted levers

| Pass | Commit | Lever |
|---:|---|---|
| 1 | `aff23d5` | rank-outer covariance accumulation |
| 5 | `7e9ca80` | exact Jacobi hypot-tail bypass |
| 6 | `f10a713` | canonical upper-triangle Jacobi updates |
| 11 | `d425010` | fused final-rank mean recombination |
| 12 | `7846d1a` | in-place fused evolution paths |
| 14 | `0e3d6e6` | specialized Mahalanobis-squared kernel |
| 15 | `c915463` | transfer private projection basis without cloning |
| 17 | `12da6ec` | reuse sampler-owned 2-D Gaussian tuple |
| 19 | `37425a9` | split Jacobi canonical address ranges |

For a complete rollback, revert those commits in reverse chronological order.
Individual reverts should be followed by the golden, test, and benchmark gates
because later accepted changes build on earlier engine structure.

## Remaining limits

The cost center is now unequivocal and dimension-dependent: Jacobi self time is
15.4% at 8-D, 37.6% at 24-D, and 59.7% at 48-D. Exact local variants have been
exhaustively measured; the last pass's duplicate-absolute-value candidate did
not improve wall time and was restored. A materially larger next step would be
a different eigensolver, less-frequent decomposition, native/WASM SIMD, or a
relaxed snapshot cadence. Each can change binary64 results or the externally
visible per-generation state, so none belongs in an exact-isomorphism campaign
without an explicit contract change.

Low-dimensional p95 numbers are sensitive to scheduler/GC pauses because a
whole trial is close to one millisecond. The 300-trial 24-D protocol, sampled
profiles, deterministic checksums, and focused before/after evidence are the
campaign's primary decision evidence. Results are tied to the Bun/JSC,
hardware, and OS fingerprint recorded in `fingerprint.json`.

## Independent closeout verification

After the final agent restored the rejected pass-20 candidate, the orchestrator
confirmed the exact pass-19 source hash and repeated the original 300-trial
protocol. That rerun produced p95 53.98 ms and 63,344 evaluations/s with the
exact campaign checksum, within the pre-established 4.8% noise envelope of the
reported 52.71 ms / 63,489 evaluations/s result. Full tests, typecheck, lint,
and the Next.js production build passed. `package.json` defines no formatting
script; no source edit remained from pass 20.
