# Pass 08 — eigen-coordinate transform/candidate construction fusion

Date: 2026-08-27

## Decision

Rejected; zero production change retained. The candidate reused the retained
`rawX` vector as the eigen-transform accumulator, removing the private
`transformed` vector and its allocation while preserving every scalar
multiplication and addition in its original order. It was behaviorally exact
but materially slower.

The paired 300-trial representative p95 regressed from
58.56279199999972 ms to 62.43379100000129 ms (+6.609997351221897%),
which exceeds the established 4.8% same-seed envelope. The p50 regressed
4.511494849977193%, the p99 regressed 6.398827732739143%, and throughput fell
4.870923224033341%. The candidate was restored with `apply_patch`; the engine
is byte-identical to the accepted pass-06/pass-07 source at SHA-256
`11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`.

## Fresh current measurement and profile

The representative baseline used 24 dimensions, 250 generations, 300
measured trials, ten warmups, seed 1729, and the benchmark's fixed per-trial
seed schedule.

| Metric | Current |
|---|---:|
| p50 | 55.82500000000073 ms |
| p95 | 58.56279199999972 ms |
| p99 | 64.60233300000073 ms |
| Throughput | 57,747.287247753644 evaluations/s |
| Evaluations | 975,000 |
| Checksum | 24940.517463897122 |

The fresh 500 microsecond sampled profile used 150 measured trials and ten
warmups. It ran for 9.302982 seconds and contained 14,383 self samples.

| Named region | Self samples | Share |
|---|---:|---:|
| `jacobiEigenSymmetric` | 5,922 | 41.17360773134951% |
| `step` | 4,431 | 30.807202947924633% |
| `whitenWithEigensystem` | 795 | 5.52735868733922% |
| `transformFromEigenCoordinates` | 707 | 4.915525272891609% |
| `reconstructSymmetric` | 418 | 2.906208718626156% |

Within the transform frame, 692 of 707 samples mapped to the dense
column/row accumulation line. The transform was therefore a current top-five
named hotspot rather than an inherited assumption.

Opportunity score: `(impact 2 × confidence 5) / effort 1 = 10.0`, above the
required threshold of 2. Impact was rated two because the named region owned
4.92% of samples and the lever removed one length-24 JavaScript numeric array
per candidate. Confidence was five because both the fresh profile and the
single call/use chain identified the same private transient. Effort was one
because the candidate was confined to one helper and its only call site.

## Lifetime and allocation inspection

`transformFromEigenCoordinates` had exactly one production call. Its returned
vector was read only by the immediately following `oldMean.map` expression to
construct `rawX`; it was never stored in a candidate, passed to repair or the
objective, returned, or retained in history. It was therefore purely
transient.

The candidate still allocated the required retained `rawX`, initialized it to
positive zero, accumulated the transform into it, and only then overwrote its
cells with the final candidate coordinates. This removed one length-24 array
for each of the 13 candidates in each generation: 3,250 arrays per measured
trial and 975,000 arrays across the 300-trial comparison. This is a static
allocation count, not a retained-heap claim.

## Single candidate lever

The screened edit did only the following:

1. Removed the private one-use `transformFromEigenCoordinates` helper.
2. Allocated the retained `rawX` as the transform's zero-filled accumulator.
3. Executed the same eigen-column outer / coordinate-row inner transform.
4. After the complete transform, executed the same
   `oldMean[dimension] + oldSigma * transformed[dimension]` arithmetic into
   the same ascending dimension sequence, with `rawX[dimension]` supplying
   the bit-identical accumulated value.

No Gaussian generation, RNG call, noise draw, repair, objective evaluation,
candidate field, ranking, adaptation, covariance, Jacobi, whitening, mean,
public API, or snapshot code changed.

## Candidate isomorphism proof

### Transform arithmetic and floating point

Both versions initialize every transform accumulator with the same positive
zero from `createZeroVector`. Both then visit columns `0..dim-1` and rows
`0..dim-1`. For each column both evaluate

```text
scaled = sqrt(eigenvalue[column]) * z[column]
```

once, then add

```text
eigenvectors[row][column] * scaled
```

to the same row accumulator. Every multiplication and per-row addition has the
same operands and order. The candidate does not introduce the mean or sigma
until all transform additions are complete.

The original `map` and the candidate final loop both visit dimensions in
ascending order and evaluate

```text
oldMean[dimension] + oldSigma * accumulatedTransform[dimension]
```

with the same JavaScript binary64 operands and operator precedence. Assigning
the result back into the private accumulator after its last transform read
cannot affect another dimension.

### RNG, repair, objective, ranking, and snapshots

- Gaussian `z` generation is textually before the transform in both versions;
  seed and draw order are unchanged.
- Retained `z` is the same array with the same values.
- Final retained `rawX` bits are identical before repair begins.
- `rawX.map(this.repair)`, the objective input `x`, optional later noise draw,
  fitness/id sorting, and best-candidate logic are unchanged.
- Candidate `rawX`, `x`, and `z` remain distinct retained arrays with the same
  contents and ownership.
- Generation samples and history retain the same candidate objects; the
  removed transform vector was never observable or retained.

The 300-trial checksum was exactly `24940.517463897122` on both sides. Fresh
candidate outputs at dimensions 1, 2, 4, 8, 12, 24, and 48 were byte-identical
to the authoritative goldens.

## Paired representative measurement

Both sides used exactly:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | Candidate | Change |
|---|---:|---:|---:|
| p50 | 55.82500000000073 ms | 58.343542000000525 ms | +4.511494849977193% |
| p95 | 58.56279199999972 ms | 62.43379100000129 ms | +6.609997351221897% |
| p99 | 64.60233300000073 ms | 68.73612500000127 ms | +6.398827732739143% |
| Throughput | 57,747.287247753644 eval/s | 54,934.46122195357 eval/s | -4.870923224033341% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

Because the p95 regression is outside 4.8%, the conditional requirement for
a candidate targeted region/allocation profile was not triggered. The
representative workload directly falsified a net performance win, so further
candidate profiling could not make the lever acceptable.

## Concrete rejection and zero-change checks

1. **Representative tail:** p95 regressed 6.6100%, outside the 4.8% envelope;
   p99 independently regressed 6.3988%.
2. **Central tendency and throughput:** p50 regressed 4.5115% and throughput
   fell 4.8709%, corroborating rather than contradicting the tail result.
3. **Behavior-only success:** the checksum, all seven candidate goldens, and
   16 tests / 157 assertions were exact, proving the rejection is based on
   performance rather than a behavior defect.
4. **Restoration identity:** the retained engine returned to exact SHA-256
   `11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`,
   and `git diff -- app/lib/cmaesEngineND.ts` is empty.
5. **Retained-code gates:** 16 tests / 157 assertions, typecheck, lint, UBS
   exit 0, seven authoritative SHA-256 checks, and `git diff --check` passed.

## Quality gates

- Candidate `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157
  assertions.
- Candidate-to-authoritative `cmp`: exact for dimensions 1, 2, 4, 8, 12, 24,
  and 48.
- Retained `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157
  assertions.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing
  `baseline-browser-mapping` age advisory was emitted.
- `ubs app/lib/cmaesEngineND.ts`: exit 0, zero critical findings; its broad
  heuristic notices are pre-existing and unrelated to this rejected diff.
- `shasum -a 256 -c golden_checksums.txt`: all seven authoritative files `OK`.
- `git diff --check`: pass.

## Files generated

- `pass-08-before.json` and `pass-08-after.json` — paired representative run.
- `pass-08-before-profile-workload.json` and `pass-08-before.cpuprofile` —
  fresh current profile workload and raw sampled profile.
- `pass-08-profile-summary.json` — current hotspot and opportunity-score
  summary.
- `pass-08-golden-dim-{1,2,4,8,12,24,48}.json` — exact candidate outputs.
- `pass-08-gates.json` — behavior, static, restoration, and diff gates.
- `pass-08.md` — this report and isomorphism proof.

No production change was retained. `.skill-loop-progress.md` and the campaign
ledger were not modified. No file was deleted, no destructive command was
used, and no commit was made.

## Orchestrator verification

The orchestrator confirmed the engine is unchanged at SHA-256 `11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`, inspected the fresh hotspot evidence and paired regression, reran the 16-test/157-assertion suite, verified all seven authoritative golden checksums, and confirmed `git diff --check`. The rejection is upheld.
