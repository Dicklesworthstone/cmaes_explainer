# Pass 13 — reject on-demand normalized-step recomputation

Date: 2026-08-27

## Decision

Rejected and restored. The candidate removed the per-generation nested
`normalizedSteps` arrays and instead derived each normalized coordinate from the
unchanged adaptation point, old mean, and old sigma at its point of use. It was
exact across all seven goldens and 243 focused adaptation/ownership checks, but
the repeated subtraction/division work made both the integrated optimizer and
the isolated adaptation kernel materially slower.

Representative p95 regressed from 60.920250000000124 ms to
69.41220799999792 ms (+13.939466761869456%), while throughput fell
11.386623221703763%. The focused p95 regressed 11.771075609105255%, and
focused throughput fell 10.91091674663473%. Both pairs retained exact checksums.
The production source was manually restored to the accepted pass-12 SHA-256
`d6f169b0d6b8b053df1d827a8e38d5d4fe9baeba7d25e2fd5afe71e7dd95a44d`.

## Fresh profile and opportunity score

The untouched engine received a fresh 24-D profile over 150 measured trials,
ten warmups, 250 generations per trial, and a 500 microsecond interval. It
recorded 15,836 samples over 12.87 seconds. Rank-mu accumulation owned 2.38
seconds / 18.5% direct self-time; the negative-weight whitening call accounted
for 586.7 ms / 4.5% total time; and the normalized-step callback accounted for
91.2 ms / 0.7% total time.

Opportunity score:

```text
(impact 3 x confidence 5) / effort 2 = 7.5
```

Impact is three because the complete materialization/whitening/rank-mu region
is in the 10–25% band. Confidence is five because the profile and source expose
the arrays and consumers directly. Effort is two because removing the vectors
requires an exact alternate input route through both dense whitening and the
covariance triangle. The score exceeded the required threshold of 2.0, so the
single candidate lever was eligible to test.

## Single lever tested

The candidate made only these related changes inside the existing ND engine:

- removed the outer and inner `map` calls that built one normalized vector per
  ranked candidate;
- supplied normalized coordinates on demand to the unchanged two-pass negative
  whitening arithmetic; and
- derived normalized row/column scalars on demand inside the unchanged
  rank/row/column covariance traversal.

It did not alter evolution paths, mean recombination, Jacobi, sampling,
candidate ordering, public APIs, projection, or snapshot construction.

The lever eliminates 13 normalized arrays and 312 stored normalized numbers per
24-D generation. However, the prior representation computes only 312
subtraction/division pairs and reuses them. The candidate repeats those exact
operations for every dense whitening input and every rank-mu triangle use, so
removing materialization trades cheap transient storage for substantially more
floating-point division.

## Isomorphism proof

### Adaptation point and normalized scalar

For every rank, both versions call the same `adaptationPoint`: clipped runs use
`candidate.x`; `none` and `reflect` use `candidate.rawX`. Every candidate scalar
is still evaluated as `(adaptationX[d] - oldMean[d]) / oldSigma`, with
subtraction before division. Re-evaluating that deterministic expression yields
the same IEEE-754 value; 243 focused checks cover `none`, `clip`, and `reflect`
at dimensions 1, 2, and 24 across three steps.

### Negative whitening and norm

The candidate keeps the eigen-coordinate traversal `column -> row`, the
multiply/add sequence, the eigenvalue square-root division, the result traversal
`column -> row`, and the final `vecDot` coordinate order. Only the source of each
step scalar changes from an array lookup to the exact expression above. The
Mahalanobis squared norm, positivity branch, and adjusted-weight
`weight * dim / norm` order remain exact.

### Rank-mu accumulation

Rank, row, and upper-triangle column order are unchanged. `weightedRow` still
evaluates `covarianceWeight * normalizedRow`, and each provisional entry still
adds `weightedRow * normalizedColumn` in the same rank order. The on-demand
row scalar is reused for the diagonal, while every off-diagonal scalar is the
same exact subtraction/division expression as its former array element.

### Ordering, RNG, and snapshots

Candidate sorting, fitness/id tie-breaking, RNG seeds and draw order, evolution
paths, mean/meanShift, hSigma, sigma, covariance finalization, Jacobi, and all
snapshot clones are untouched. Candidate raw/phenotype/z arrays remained
distinct, no numeric snapshot array was reused across generations, history
retained the exact state objects, and prior snapshots remained unchanged.

### Golden proof

Fresh candidate outputs at dimensions 1, 2, 4, 8, 12, 24, and 48 were
byte-identical to the authoritative outputs. Their seven SHA-256 values match
the authoritative checksums exactly. The authoritative checksum set also passed
again after source restoration.

## Paired representative evidence

Both sides used:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | Candidate | Change |
|---|---:|---:|---:|
| p50 | 57.81025000000227 ms | 64.9661670000005 ms | +12.378284127811149% |
| p95 | 60.920250000000124 ms | 69.41220799999792 ms | +13.939466761869456% |
| p99 | 67.37270800000078 ms | 77.66504200000054 ms | +15.276711157282909% |
| Throughput | 55,790.058186877504 eval/s | 49,437.45446596847 eval/s | -11.386623221703763% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

The p95 regression is nearly three times the 4.8% same-seed envelope, so the
candidate fails the campaign retention gate on representative evidence alone.

## Focused and profile evidence

The isolated 24-D kernel exercises exactly normalized-step construction,
negative-weight whitening/norm/weight adjustment, and rank-mu accumulation for
13 candidates with six positive ranks. Forty alternating measured trials used
1,000 calls each after five warmups.

| Metric | Before | Candidate | Change |
|---|---:|---:|---:|
| p50 | 16.129832999999962 ms | 18.136792000000014 ms | +12.442528078251376% |
| p95 | 16.39187499999997 ms | 18.32137499999999 ms | +11.771075609105255% |
| p99 | 19.094957999999906 ms | 20.161207999999988 ms | +5.58393477482426% |
| Throughput | 61,689.6723211322 calls/s | 54,958.7635329017 calls/s | -10.91091674663473% |
| Checksum | -1416184.126502359 | -1416184.126502359 | exact |

The matched candidate profile sampled 3.2228 seconds / 31.1% directly in its
two on-demand rank-mu loop locations, versus 2.38 seconds / 18.5% in the old
inner accumulation location. That is a 35.411764705882355% absolute self-time
increase despite the candidate profile's shorter overall sampled process. The
on-demand whitening helper added another 380.5 ms / 3.6% direct self-time.
Profiled wall percentiles were scheduler-perturbed and are not used as evidence;
the direct region samples agree with both clean paired measurements.

## Restoration and quality gates

The orchestrator confirmed exact restoration to SHA-256 `d6f169b0d6b8b053df1d827a8e38d5d4fe9baeba7d25e2fd5afe71e7dd95a44d`, inspected representative/focused/profile evidence, reran 16 tests/157 assertions, verified all seven authoritative golden checksums, and confirmed `git diff --check`. The rejection is upheld.

After rejection, the candidate helper and all production edits were manually
reversed. The engine SHA-256 exactly matches accepted pass 12. A fresh 150-trial
restoration check recorded p50 57.00070799999958 ms, p95
60.0014170000004 ms, p99 63.80170799999996 ms, throughput
56,489.47350897822 evaluations/s, and the exact checksum
12274.303979858667.

- Candidate outputs matched all seven authoritative goldens byte-for-byte.
- All seven authoritative SHA-256 checks passed again after restoration.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- Adaptation/ownership audit: 243 checks passed, 0 failed.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing
  `baseline-browser-mapping` age advisory was emitted.
- No format script exists in `package.json`; no production edit was retained.
- `ubs app/lib/cmaesEngineND.ts`: exit 0, zero critical findings; broad
  cross-language heuristic notices were pre-existing and unrelated.
- `git diff --check`: pass.

## Files generated

- `pass-13-{before,after}.json` — paired representative evidence.
- `pass-13-{before,after}-profile-workload.json`, CPU profiles, and Markdown
  reports — matched integrated profiles.
- `pass-13-focused-pair.json` — alternating isolated adaptation measurements.
- `pass-13-golden-dim-{1,2,4,8,12,24,48}.json` — exact candidate outputs.
- `pass-13-adaptation-ownership-properties.json` — 243 focused invariants.
- `pass-13-root-verify.json` — restored-source verification.
- `pass-13-profile-summary.json`, `pass-13-gates.json`, and `pass-13.md` —
  structured summary, gates, and this report.

`.skill-loop-progress.md` and the hypothesis ledger were not modified. No file
was deleted, no destructive command was used, and no commit was made.
