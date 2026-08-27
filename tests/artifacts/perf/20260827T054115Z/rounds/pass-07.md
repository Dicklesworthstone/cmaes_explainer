# Pass 07 — Jacobi convergence and sweep stopping

Date: 2026-08-27

## Decision

Rejected; zero production change retained. A guarded prefix verification can
remove the final empty Jacobi sweep without changing any rotation, output bit,
threshold decision, maximum-sweep behavior, or non-convergence throw. It was
nevertheless too small to accept.

The paired 300-trial representative result improved p95 from
60.07520799999838 ms to 58.996791999999914 ms (-1.7951098895878954%),
inside the established 4.8% same-seed envelope. On 50,000 focused 24-D
decompositions, throughput improved only 0.34857758051027243%. The matched
focused profiled workload instead regressed 0.512156448473066%, while estimated
absolute Jacobi self-time was flat (+0.05143624715154124%). The candidate was
restored with `apply_patch`; the accepted engine is byte-identical to pass 06
at SHA-256
`11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`.

## Fresh current measurement and profile

The current 24-D representative baseline used 250 generations, 300 measured
trials, ten warmups, and seed 1729:

| Metric | Current |
|---|---:|
| p50 | 57.666291999999885 ms |
| p95 | 60.07520799999838 ms |
| p99 | 65.04158300000017 ms |
| Throughput | 56,097.863123822666 evaluations/s |
| Checksum | 24940.517463897122 |

The fresh integrated profile used 150 trials and a 500 microsecond interval.
It ran for 9.260235 seconds with 14,322 samples. Bun coalesced the hot Jacobi
body onto the function entry: 6,155 self samples, about 42.9758% of the profile.
This confirms that Jacobi remains eligible as a system hotspot, but cannot
attribute a meaningful share specifically to the residual/stopping statements.

The fresh focused baseline used a dense symmetric strictly diagonally dominant
24-D matrix, 1,000 warmups, and 50,000 calls. It delivered
14,473.76484920273 calls/s. Its 250 microsecond profile ran for 3.71386125
seconds with 9,427 samples; 8,805 samples (93.4019306248011%) were coalesced
onto the Jacobi frame. Native `max` received one sample, and that sample is not
exclusive to the residual maximum because the function also uses `Math.max`
for scale, tolerance, and eigenvalue flooring.

## Representative sweep and residual census

Temporary read-only diagnostics observed the actual private provisional
covariance matrices passed by 16 representative optimizer seeds over 250
generations each: 4,000 eigendecompositions in total. The instrumentation was
then removed exactly before either side of the performance comparison.

- Every call converged below the `max(50, 5*n) = 120` budget; none exhausted
  the maximum.
- Sweep counts were six for 75 calls, seven for 3,189 calls, and eight for 736
  calls; the mean was 7.16525.
- Every one of the 4,000 calls ended in a sweep with zero rotations. Thus the
  final sweep was purely a convergence verification scan.
- Early sweeps were not close to the threshold. Median residual/tolerance was
  `2.545440956642322e11` on sweep 0, `1.0315320495811804e11` on sweep 1,
  `2.8719964525467514e10` on sweep 2, and `5.880660164512579e9` on sweep 3.
- On the last rotating sweep, residual/tolerance remained above one by
  construction: sweep 5 median was 72,513.89711499904, while the 736 calls
  reaching sweep 6 had median 14.819994374344256.

Simulating the guarded prefix rule over those exact states removed 4,000 empty
sweeps: 28,661 became 24,661 (-13.956247165137295%). Because each earlier
non-final prefix scan usually rejected immediately, strict-upper pivot
inspections fell from 7,910,436 to 7,300,026 (-7.716515246441536%). This is a
structural upper bound on the eligible work, not on total Jacobi arithmetic;
rotation bodies and eigenvector updates are unchanged.

## Opportunity matrix

| Opportunity | Impact | Confidence | Effort | Score | Outcome |
|---|---:|---:|---:|---:|---|
| Guarded prefix verification | 1 | 5 | 2 | 2.5 | Screened, rejected |
| Track residual only for accepted pivots | 1 | 5 | 2 | 2.5 | Not repeated; pass 04 already disproved this scan surface |
| Maintain an exact live above-threshold counter | 1 | 4 | 4 | 1.0 | Below implementation threshold |

Impact is one because the fresh focused profile places all stopping and scan
bookkeeping below source-level sampling resolution while the rotation body owns
the frame. Confidence is five for the selected lever because the 4,000-call
census proves both the empty sweep and the exact number of pair inspections.
Effort is two because the edit is local but requires a nontrivial ordering,
NaN, and maximum-sweep proof.

## Single candidate lever

The screened candidate recorded the lexicographically last pair rotated in a
sweep. After the ordinary sweep, and only when at least one sweep remained in
the caller's budget, it rechecked the strict-upper prefix preceding that pair.
If the prefix contained no value that would rotate, it returned immediately;
otherwise it began the next ordinary sweep unchanged.

No coefficient, pivot order, row/column update, eigenvector update, covariance
code, reconstruction, public API, tolerance, or sweep limit changed.

## Exact-equivalence proof

### Current stopping condition

For each visited pair, the current loop computes the same predicate

```text
abs(A[p,q]) <= absoluteTolerance.
```

It rotates exactly when that predicate is false. The sweep residual is the
maximum of the same encountered magnitudes, so `residual <= absoluteTolerance`
is true exactly when the entire sweep performed no rotation. With no rotation,
neither the canonical upper triangle, diagonal, nor eigenvector buffer changes;
the stopping sweep is observationally empty.

### Why only the prefix needs verification

Let `L` be the last pair rotated in a sweep's fixed lexicographic order.

1. `L` is explicitly written to zero.
2. Every pair after `L` is checked after the last state-changing operation and
   skipped, so it satisfies the unchanged `<= absoluteTolerance` predicate in
   the final matrix.
3. Only pairs before `L` could have been changed by `L` or an intervening later
   rotation after their ordinary visit.

Therefore the final matrix is converged if and only if a read-only scan of the
prefix before `L` also satisfies the original predicate. If it does, the next
baseline sweep would perform zero rotations and return the same `a` and `v`.
If it does not, the candidate starts the next baseline sweep with bit-identical
state and executes the same first and subsequent rotations.

The candidate deliberately used
`!(Math.abs(value) <= absoluteTolerance)`, not
`Math.abs(value) > absoluteTolerance`. These differ for NaN. The former exactly
matches the baseline's decision to rotate when a finite input later produces a
NaN intermediate.

### Maximum sweeps and non-convergence throws

The prefix check is forbidden on `sweep === maxSweeps - 1`. On the last allowed
sweep, the baseline's original residual is retained and the unchanged post-loop
comparison and error message run. This matters: `[[2,1],[1,3]]` with
`maxSweeps=1` ends the matrix rotation but still throws using residual `1`; an
unconditional final-state convergence check would suppress that public throw.

When the guarded candidate does return early, at least one baseline sweep
remains and the proof above says that sweep would be empty with residual at or
below the strict tolerance. Both versions therefore bypass the looser
post-loop non-convergence threshold. Setting the private candidate residual to
zero changes no returned value or error.

### Threshold, ordering, ties, and floating point

- `absoluteTolerance = tolerance * max(Number.MIN_VALUE, scale)` is unchanged.
- Equality still skips because the predicate remains `<=`; a one-ULP larger
  pivot still rotates. Both cases were exercised directly.
- Extra work consists only of address calculations, reads, `Math.abs`, and
  comparisons. It performs no write and cannot perturb any later binary64
  operand.
- Every non-empty rotation retains the same `(sweep,p,q,k)` order, coefficient,
  matrix update, eigenvector update, and explicit pivot zero.
- Final diagonal values and eigenvectors are consequently bit-identical. The
  same stable largest-first sort sees the same values and original indices, so
  eigenvalue ties and ordering remain unchanged.
- RNG state, objective calls, candidate ordering, covariance accumulation, and
  snapshots are untouched.

## Behavior evidence

Candidate outputs for dimensions 1, 2, 4, 8, 12, 24, and 48 were byte-identical
to the authoritative goldens. A seven-case boundary corpus also had the same
baseline and candidate SHA-256,
`112d7bec7e6b53bae85e98336a511d38a61f4db6c533848c0f4817117e523fb3`.
It covered:

- a converged final rotation with `maxSweeps=1`, preserving the exact throw;
- the same matrix with one verification sweep available;
- a pivot exactly equal to the tolerance and its one-ULP successor;
- huge finite entries that produce non-finite eigensystem intermediates;
- a dense matrix that still throws at two sweeps;
- the same dense matrix converged under the default budget.

The optimizer benchmark checksum remained exactly `24940.517463897122`, the
focused checksum remained exactly `162513.40559963728`, and the 16-test suite
passed with 157 assertions under the candidate.

## Paired representative measurement

Both sides used:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | Candidate | Change |
|---|---:|---:|---:|
| p50 | 57.666291999999885 ms | 56.86491599999863 ms | -1.3896783930571726% |
| p95 | 60.07520799999838 ms | 58.996791999999914 ms | -1.7951098895878954% |
| p99 | 65.04158300000017 ms | 62.1176660000001 ms | -4.495457928814657% |
| Throughput | 56,097.863123822666 eval/s | 56,851.023965623426 eval/s | +1.3425838345006775% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

The p50 and p95 movements are inside the 4.8% acceptance envelope. The p99
movement alone is insufficient because the lower quantiles and focused region
do not corroborate it.

## Focused eigensolver evidence

| Unprofiled metric | Before | Candidate | Change |
|---|---:|---:|---:|
| Duration, 50,000 calls | 3454.526208 ms | 3442.526333 ms | -0.34736673793966566% |
| Throughput | 14,473.76484920273 calls/s | 14,524.217148522826 calls/s | +0.34857758051027243% |
| Checksum | 162513.40559963728 | 162513.40559963728 | exact |

Matched 250 microsecond profiles contradicted an independent regional win:

| Profiled metric | Before | Candidate | Change |
|---|---:|---:|---:|
| Workload duration | 3605.421833 ms | 3623.982292 ms | +0.5147929939880703% |
| Throughput | 13,868.002779135553 calls/s | 13,796.976908627787 calls/s | -0.512156448473066% |
| Profile duration | 3.71386125 s | 3.73569025 s | +0.5877710159473599% |
| Approximate Jacobi self | 3.468818108226371 s | 3.470602338081756 s | +0.05143624715154124% |

## Concrete rejection checks

1. Representative p95 improved only 1.7951%, below the 4.8% envelope.
2. Focused unprofiled throughput improved only 0.3486%.
3. Focused profiled throughput regressed 0.5122%, and approximate absolute
   Jacobi self-time was flat to 0.0515%.
4. The structural screen saved only 7.7165% of pivot inspections and no
   rotations, coefficients, matrix updates, or eigenvector updates.
5. The current focused profile gave native `max` one non-exclusive sample;
   stopping overhead was below useful source-level resolution.
6. Exact behavior passed, so rejection is solely lack of material performance,
   not a correctness defect.
7. Restoration returned the engine to the exact accepted pass-06 SHA-256 and a
   clean production diff.

## Retained-code quality gates

- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- `shasum -a 256 -c golden_checksums.txt`: all seven authoritative files `OK`.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing
  `baseline-browser-mapping` age advisory was emitted.
- `ubs app/lib/cmaesEngineND.ts`: exit 0; no critical finding attributable to
  this pass.
- `git diff --check`: pass.
- Production diff: clean.

## Files generated

- `pass-07-before.json` and `pass-07-candidate.json` — representative pair.
- `pass-07-before.cpuprofile` — fresh integrated current profile.
- `pass-07-focused-comparison.json` — focused measurements and profile summary.
- `pass-07-focused.cpuprofile` and `pass-07-candidate-focused.cpuprofile` —
  matched focused profiles.
- `pass-07-sweep-distribution.json` — 4,000-call sweep/residual census and
  guarded-prefix structural simulation.
- `pass-07-gates.json` — exact and static gate summary.
- `pass-07.md` — this report.

`.skill-loop-progress.md`, the campaign ledger, and all production files were
left unchanged. No file was deleted, no destructive command was used, and no
commit was made.

## Orchestrator verification

The orchestrator confirmed the engine is unchanged at SHA-256 `11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`, inspected the sweep census and paired focused evidence, reran the 16-test/157-assertion suite, verified all seven authoritative golden checksums, and confirmed `git diff --check`. The performance-based rejection is upheld.
