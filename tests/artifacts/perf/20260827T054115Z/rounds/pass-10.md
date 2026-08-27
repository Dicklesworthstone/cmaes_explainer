# Pass 10 — Gaussian vector generation eligibility audit

Date: 2026-08-27

## Decision

No production change. The fresh integrated profile attributes 2.0% total and
1.3% direct time to `sampleGaussianVectorND`, effectively unchanged from the
campaign baseline's 1.9% total and still outside the top five named regions.
The refreshed opportunity score remains below the required threshold:

```text
(impact 1 × confidence 3) / effort 2 = 1.5
```

Impact is one because the complete region owns less than 5% of the workload.
Confidence is three rather than five because profiling confirms the region's
small cost but does not identify removable work: the focused JIT profile
coalesces 98.4% self-time at the vector function entry. Effort is two because
preserving public invalid-RNG behavior, draw pairing, odd-dimension spare
semantics, and retained `z` ownership rules out every simple shortcut. The
required implementation threshold is 2.0.

The engine stayed byte-identical at SHA-256
`11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`.

## Fresh integrated profile

The current 24-D profile used 250 generations, 150 measured trials, ten
warmups, the benchmark's fixed seed schedule, and a 500 microsecond sampling
interval. It ran for 9.2731495 seconds and recorded 12,012 samples.

| Metric | Current |
|---|---:|
| Profiled p50 | 57.02320899999995 ms |
| Profiled p95 | 61.62433300000066 ms |
| Profiled p99 | 66.21687500000007 ms |
| Profiled throughput | 56,368.276383609955 evaluations/s |
| Gaussian direct | 122.8 ms / 1.3% |
| Gaussian total | 187.2 ms / 2.0% |

The five larger named entries were Jacobi decomposition (39.9% self), two
separate `step` sites (19.0% and 4.0%), eigen-coordinate transform (4.8%), and
whitening (3.3%). Gaussian generation did not move into the current top five.

## Paired representative evidence

Because no candidate cleared eligibility, both sides are independent runs of
the exact same accepted source. Each used:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Run A | Run B | B versus A |
|---|---:|---:|---:|
| p50 | 57.46479200000067 ms | 57.274374999999964 ms | -0.33136289782568923% |
| p95 | 59.54729099999895 ms | 59.10224999999991 ms | -0.7473740493065333% |
| p99 | 63.88683300000048 ms | 62.89862500000163 ms | -1.5468101228289743% |
| Throughput | 56,323.01577014855 eval/s | 56,512.27879805597 eval/s | +0.3360314168541596% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

All movements are inside the established 4.8% same-seed p95 envelope. The
pair supplies a current stability control rather than a before/after claim.

## Focused Gaussian evidence

The focused same-source pair called the production function with dimension
24 for 100,000 calls per trial, 40 measured trials, and five warmups. Every
trial used the same deterministic per-trial seed schedule, and a rotating
coordinate from every returned vector fed the checksum.

| Metric | Run A | Run B | B versus A |
|---|---:|---:|---:|
| p50 | 40.10583399999996 ms | 40.16879099999994 ms | +0.15697716197594375% |
| p95 | 40.84462500000018 ms | 40.72337500000003 ms | -0.29685668554955513% |
| p99 | 48.659666000000016 ms | 50.40545900000001 ms | +3.5877619875154743% |
| Vectors/s | 2,475,295.0700241164 | 2,471,195.2584618093 | -0.16562920566343775% |
| Normals/s | 59,407,081.6805788 | 59,308,686.203083426 | -0.16562920566343772% |
| Checksum | -445.9785741161044 | -445.9785741161044 | exact |

The 250 microsecond focused profile ran for 1.89 seconds with 4,818 samples.
The production vector function owned 98.4% self-time. The largest separately
attributed `nextOpenUnit` site was 0.1%; `nextHalfOpenUnit` rounded to 0.0%.
The JIT did not expose validation, allocation, or transcendental calls as a
separate lever with measurable removable cost.

## Exact work and ownership audit

At dimension 24 each vector performs exactly 12 Box-Muller pairs, consumes 24
uniform draws, and produces 24 normal values. Both cosine and sine outputs are
used. The 300-trial representative workload therefore constructs 975,000
candidate `z` vectors and consumes 23,400,000 uniforms without discarding any
Box-Muller output.

The single array allocated by `sampleGaussianVectorND` is not a transient
workspace. It becomes `CandidateSampleND.z`, is exposed in each returned
generation, and is retained by optimizer history. The focused ownership audit
confirmed that all `z` arrays are unique within each generation, no `z` is
shared across generations, `z` is distinct from `rawX` and `x`, and a later
step does not mutate the earlier snapshot.

## Concrete no-change checks

1. **Box-Muller pairing is already optimal under the contract.** Dimensions
   2, 4, 8, 12, 24, and 48 consume exactly one uniform per produced normal.
   There is no unused spare at the representative dimension.
2. **Cross-call spare caching is ineligible.** Odd dimensions intentionally
   consume `2 × ceil(dim / 2)` draws per call and discard the unmatched sine.
   Caching it would change the next vector, seed replay, cross-call draw count,
   and spare-value semantics while providing zero benefit at dimension 24.
3. **The `log(0)` and range guards are observable and cheap.** Scripted invalid
   RNGs proved the exact rejection order and 1,024-attempt limit. The seeded
   LCG can theoretically emit zero, so bypassing `nextOpenUnit` would also
   change a valid seed stream. Focused helper attribution was at most 0.1%.
4. **Scalar draw batching has no removable operation.** The RNG contract is a
   scalar callback; buffering would add storage while retaining every draw,
   validation, Box-Muller pair, log, square root, sine, and cosine. Prefetching
   around retries also risks changing which draw becomes each `u` or `v`.
5. **Array reuse violates candidate ownership.** The returned vector is
   retained observable state, not a private accumulator. Pooling it would
   alias candidates or history.
6. **Alternative normal generators are behavior changes.** Polar, ziggurat,
   inverse-CDF, approximation, or SIMD-style batching would change exact
   values, draw consumption, or the distribution implementation and cannot
   pass the seven exact goldens.

These checks leave no exact, single Gaussian-generation lever above score 2.

## Stream, guard, and distribution properties

All 18 focused checks passed. An independent reference implementation matched
every produced bit and exact draw count at dimensions 1, 2, 3, 4, 8, 12, 23,
24, 25, and 48. Additional checks covered deterministic vector replay,
optimizer seed replay, scalar sampling, invalid dimensions before any draw,
open/half-open retry sequences, both 1,024-attempt failure paths, odd spare
consumption, pair reuse, returned-array ownership, and candidate `z` ownership.

One million generated normals had:

| Property | Observed |
|---|---:|
| Mean | -0.00211456567579236 |
| Variance | 1.0002580707181972 |
| Positive fraction | 0.498734 |
| `abs(z) > 3` fraction | 0.002765 |
| Minimum | -4.513785428114472 |
| Maximum | 5.594654687701052 |

Every value was finite, and all predefined mean, variance, sign-balance, and
three-sigma bounds passed.

## Quality gates

- Fresh outputs at dimensions 1, 2, 4, 8, 12, 24, and 48 were byte-identical
  to the authoritative goldens.
- `shasum -a 256 -c golden_checksums.txt`: all seven authoritative files `OK`.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing
  `baseline-browser-mapping` age advisory was emitted.
- No format script exists in `package.json`; no production change existed to
  format.
- `ubs app/lib/cmaesEngineND.ts`: exit 0, zero critical findings; broad
  cross-language heuristic notices were pre-existing and unrelated.
- `git diff -- app/lib/cmaesEngineND.ts`: empty.
- `git diff --check`: pass.

## Files generated

- `pass-10-representative-{a,b}.json` — current same-source representative pair.
- `pass-10-profile-workload.json`, `pass-10-current.cpuprofile.cpuprofile`, and
  `pass-10-current.cpuprofile.md` — fresh integrated profile evidence.
- `pass-10-focused-{a,b}.json`, `pass-10-focused-profile-workload.json`,
  `pass-10-focused.cpuprofile.cpuprofile`, and
  `pass-10-focused.cpuprofile.md` — focused Gaussian pair and profile.
- `pass-10-gaussian-properties.json` — exact stream, guard, distribution,
  replay, and ownership checks.
- `pass-10-golden-dim-{1,2,4,8,12,24,48}.json` — fresh exact outputs.
- `pass-10-profile-summary.json` — opportunity and measurement summary.

## Orchestrator verification

The orchestrator confirmed the unchanged engine SHA-256 `11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`, inspected the eligibility score, same-source stability control, focused throughput, and stream/property checks, reran 16 tests/157 assertions, verified all seven authoritative golden checksums, and confirmed `git diff --check`. The below-threshold no-change decision is upheld.
- `pass-10-gates.json` — behavior, static, and no-change gates.
- `pass-10.md` — this audit report.

No production code changed. `.skill-loop-progress.md` and the campaign ledger
were not modified. No file was deleted, no destructive command was used, and
no commit was made.
