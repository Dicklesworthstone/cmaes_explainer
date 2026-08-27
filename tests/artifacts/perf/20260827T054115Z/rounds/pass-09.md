# Pass 09 — candidate-generation transform workspace reuse

Date: 2026-08-27

## Decision

Rejected; zero production change retained. A private optimizer-owned transform
accumulator safely replaced the per-candidate transient transform array while
leaving every retained `z`, `rawX`, and `x` array separately owned. The
candidate was behaviorally exact and avoided 974,700 transient length-24
arrays across the 300 measured trials, but it did not produce an eligible
performance win.

The paired representative p95 improved only 1.319737800389287%, inside the
established 4.8% same-seed envelope. The p99 regressed 1.011252313731114%,
while the matched profiled workload's throughput regressed
1.8368732811992505%. Transform self-share moved from
4.973386560212908% to 5.169300225733634%, so there was no independent
targeted CPU win. The candidate was restored with `apply_patch`; the engine is
byte-identical to the accepted source at SHA-256
`11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`.

## Fresh baseline, profile, and opportunity score

The untouched representative baseline used 24 dimensions, 250 generations,
300 measured trials, ten warmups, seed 1729, and the benchmark's fixed
per-trial seed schedule.

| Metric | Current |
|---|---:|
| p50 | 57.06091699999979 ms |
| p95 | 58.86904200000026 ms |
| p99 | 64.53641600000083 ms |
| Throughput | 56,665.09920017965 evaluations/s |
| Checksum | 24940.517463897122 |

The fresh 500 microsecond CPU profile used 150 measured trials and ten
warmups. It ran for 9.26622325 seconds and contained 12,024 self samples.
`transformFromEigenCoordinates` owned 598 samples, or
4.973386560212908%; 580 of those samples mapped to the dense transform
accumulation line. It remained a current top-five named region.

Opportunity score: `(impact 2 × confidence 5) / effort 1 = 10.0`, above the
required threshold of 2. Impact was rated two because the region owned about
5% of current samples. Confidence was five because the fresh profile and
single-use lifetime audit identified the same private transient array. Effort
was one because the candidate altered only the private helper's output
ownership and added one private workspace.

## Allocation and lifetime audit

For every candidate, current generation constructs four numeric arrays:

1. `z` is retained in `CandidateSampleND`, exposed through the returned state,
   and retained by history.
2. `rawX` is retained, may drive adaptation, and is exposed through samples
   and history.
3. `x` is passed to the objective, retained, and exposed through samples and
   history. The objective may also retain its input reference.
4. `transformed` is read only by the immediately following `rawX` construction
   and is never exposed, passed to the objective, or retained.

Reusing any of `z`, `rawX`, or `x` would alias retained snapshots or objective
inputs and was therefore ruled out. Pooling candidate objects was also ruled
out because every generation state remains in `history`. The only safe surface
was the unobservable `transformed` accumulator.

For the measured 13-candidate, 250-generation, 300-trial workload, current
code allocates 975,000 transient transform vectors and 2,925,000 required
retained candidate vectors. The candidate allocated one private transform
workspace per optimizer, reducing the former count to 300 and avoiding
974,700 arrays (99.96923076923076%) while leaving all required retained arrays
unchanged.

Bun's fresh heap-profiler runs emitted terminal heap snapshots with zero trace
functions, zero trace-tree entries, and zero sampled-allocation entries, so
they could not attribute already-freed transient arrays. Their instrumented
workload still supplied a falsification check: candidate p95 regressed
2.222791949750131%, p99 regressed 5.161020764945038%, and throughput regressed
0.9401944675866172%. Snapshot total self size changed only -0.0569098193057002%
while node count rose 0.31952662721893493%; neither is evidence of a retained
heap improvement. Exact source-level allocation accounting is the allocation
proof, but allocation count alone is not an acceptance proof after pass 08's
measured fusion regression.

## Single candidate lever

The screened edit did only the following:

1. Added one dimension-sized private transform workspace to each optimizer.
2. Changed the private transform helper to clear that workspace to positive
   zero and write its result into it.
3. Reused that workspace across candidates and generations.
4. Kept the existing helper boundary and unchanged `rawX.map(...)`
   construction, deliberately avoiding pass 08's arithmetic-loop fusion and
   retained-`rawX` accumulator shape.

No RNG, Gaussian generation, eigen transform arithmetic, mean/sigma
arithmetic, repair, objective call or input, candidate object/field, sorting,
adaptation, covariance, Jacobi, whitening, reconstruction, projection, public
API, state, or history code changed.

## Candidate isomorphism proof

### Floating point and ordering

The current `createZeroVector(n)` and candidate `workspace.fill(0)` both write
the same JavaScript positive-zero value to every dimension before any
transform addition. For each candidate both versions then visit eigen columns
`0..n-1` and rows `0..n-1`, evaluate the same
`sqrt(eigenvalue[column]) * z[column]` once per column, and add the same
`eigenvectors[row][column] * scaled` operands to the same accumulator cell in
the same order. `rawX.map` remains textually unchanged and executes only after
the complete transform. Therefore every retained `rawX` bit is identical.

### RNG, objective, candidates, and history

- Workspace clearing performs no RNG calls; seeds and draw order are
  unchanged.
- Retained `z`, `rawX`, and `x` are still newly allocated and mutually
  distinct for every candidate.
- The objective receives the same retained `x` reference at the same point in
  candidate construction.
- Candidate ordering, fitness/id tie-breaking, ranks, elites, adaptation, and
  best-candidate selection are unchanged.
- The private workspace is never stored in a candidate or state. No candidate
  numeric array is shared across generations, and earlier history remains
  unchanged after later steps and later-candidate mutation.

The representative checksum was exactly `24940.517463897122` on both sides.
Fresh candidate outputs at dimensions 1, 2, 4, 8, 12, 24, and 48 were
byte-identical to the authoritative goldens. The candidate passed all 16 tests
and 157 assertions.

## Paired representative measurement

Both sides used exactly:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | Candidate | Change |
|---|---:|---:|---:|
| p50 | 57.06091699999979 ms | 56.66187499999978 ms | -0.699326300697218% |
| p95 | 58.86904200000026 ms | 58.092124999999214 ms | -1.319737800389287% |
| p99 | 64.53641600000083 ms | 65.18904199999997 ms | +1.011252313731114% |
| Throughput | 56,665.09920017965 eval/s | 57,041.90980511846 eval/s | +0.6649782851480839% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

The p50, p95, and throughput changes are all inside the 4.8% same-seed
envelope, while p99 moved in the opposite direction.

## Matched targeted evidence

Both CPU profiles used a 500 microsecond interval, 150 measured trials, ten
warmups, and the same seed schedule.

| Metric | Before | Candidate | Change |
|---|---:|---:|---:|
| Profile duration | 9,266.22325 ms | 9,442.43 ms | +1.90160268370397% |
| Total samples | 12,024 | 13,290 | — |
| Transform self samples | 598 | 687 | — |
| Transform self share | 4.973386560212908% | 5.169300225733634% | +3.9392406592328024% relative |
| Profiled throughput | 56,416.66593222775 eval/s | 55,380.36326957522 eval/s | -1.8368732811992505% |

The workspace successfully removed the source-level allocations but did not
reduce targeted CPU share or profiled runtime. This independently prevents
acceptance of the noisy representative improvement.

## Concrete rejection checks

1. Representative p95 improved only 1.3197%, inside the 4.8% envelope, while
   p99 regressed 1.0113%.
2. Matched profiled throughput regressed 1.8369%, profile duration rose
   1.9016%, and transform self-share rose rather than fell.
3. Heap-instrumented p95/p99/throughput all regressed; the terminal snapshots
   did not expose a transient-allocation trace or retained-heap win.
4. Exact allocation accounting proves 974,700 arrays were avoided, but pass 08
   and this pass both show that fewer arrays do not imply a net JSC speedup.
5. All seven goldens, the checksum, ownership checks, and 16 tests were exact,
   proving rejection is performance-based rather than a correctness failure.
6. Restoration returned the engine to exact SHA-256
   `11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`
   with an empty production diff.

## Quality gates

- Candidate `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157
  assertions.
- Candidate-to-authoritative `cmp`: exact for dimensions 1, 2, 4, 8, 12, 24,
  and 48.
- Candidate ownership/mutation audit: all ten checks passed.
- Retained `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157
  assertions.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing
  `baseline-browser-mapping` age advisory was emitted.
- No format script exists in `package.json`; no production diff remained to
  format.
- `ubs app/lib/cmaesEngineND.ts`: exit 0, zero critical findings; broad
  heuristic notices were pre-existing and unrelated to the restored empty
  diff.
- `shasum -a 256 -c golden_checksums.txt`: all seven authoritative files
  `OK` when run from the repository root.
- `git diff --check`: pass.

## Files generated

- `pass-09-before.json` and `pass-09-after.json` — paired representative run.
- `pass-09-before-profile-workload.json`, `pass-09-before.cpuprofile`,
  `pass-09-after-profile-workload.json`, and `pass-09-after.cpuprofile` —
  matched CPU evidence.
- `pass-09-before-heap-workload.json`, `pass-09-before.heapprofile`,
  `pass-09-after-heap-workload.json`, and `pass-09-after.heapprofile` — matched
  heap-instrumented evidence and terminal snapshots.
- `pass-09-profile-summary.json` — opportunity, allocation, wall, CPU, heap,
  and decision summary.
- `pass-09-golden-dim-{1,2,4,8,12,24,48}.json` — exact candidate outputs.
- `pass-09-ownership-checks.json` — objective-input, candidate-vector,
  cross-generation, history, and mutation ownership checks.
- `pass-09-gates.json` — behavior, static, restoration, and diff gates.
- `pass-09.md` — this report and isomorphism proof.

No production change was retained. `.skill-loop-progress.md` and the campaign
ledger were not modified. No file was deleted, no destructive command was
used, and no commit was made.

## Orchestrator verification

The orchestrator confirmed exact engine restoration at SHA-256 `11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`, inspected representative, CPU, heap, and ownership evidence, reran 16 tests/157 assertions, verified all seven authoritative golden checksums, and confirmed `git diff --check`. The rejection is upheld.
