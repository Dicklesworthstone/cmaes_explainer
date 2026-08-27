# Pass 04 — Jacobi pivot-search traversal

Date: 2026-08-27

## Decision

Rejected. Strength-reducing the cyclic Jacobi pivot scan's row-major indices and reusing one `Math.abs(apq)` result preserved exact deterministic behavior, but the paired 300-trial p95 improvement was only 2.0128548876653483%, inside the 4.8% same-seed envelope. Neither the matched integrated profile nor the 50,000-call focused profile isolated an independent pivot-search win. The candidate was restored with `apply_patch`; `app/lib/cmaesEngineND.ts` returned to its exact accepted SHA-256, `072eaf088527c1c70e77872656e4cb59aaf0d4de22c3a0268241080d8c64365a`.

## Fresh current profile and opportunity

The current implementation is cyclic Jacobi, not maximum-pivot Jacobi. Within every sweep it visits the strict upper triangle in the deterministic lexicographic sequence

```text
(0,1), (0,2), ..., (0,n-1), (1,2), ..., (n-2,n-1).
```

For each visited pair it reads `a[p,q]`, updates the scalar sweep residual with its magnitude, skips values at or below the absolute tolerance, and otherwise immediately rotates that pair. There is no index-valued maximum selection. Equal magnitudes therefore do not select between tied pairs: traversal order alone fixes rotation order, while `Math.max` retains only the equal scalar magnitude.

The fresh representative 24-D profile used the established 500 microsecond interval, 150 measured trials, ten warmups, and seed 1729. It ran for 9.88 s with 15,323 samples. The current pivot scan at lines 124-133 received zero direct source ticks (an empirical one-sample upper bound of 0.006526137179402206%); the native `Math.max` frame received only 1.4 ms, and that attribution is not exclusive to the scan. In contrast, the unchanged rotation-coefficient branch lines 139-140 received 6,476 ticks, 42.2% of the profile. Thus the inherited approximately 43% Jacobi figure describes rotation arithmetic, not pivot-search work.

A focused 24-D profile called `jacobiEigenSymmetric` 50,000 times on the same finite symmetric positive-definite matrix after 1,000 warmups. It ran for 3.87 s with 11,723 samples. The scan again received zero direct source ticks (one-sample upper bound 0.008530239699735562%), while rotation-coefficient lines received 10,215 ticks. This independently confirms that the eligible scan surface is tiny.

Opportunity score: `(impact 1 x confidence 5) / effort 1 = 5.0`. Impact is only 1 because both fresh profiles place direct scan work below sampling resolution. Confidence is 5 because the source and two profiles agree. Effort is 1 because the candidate is a local, mechanically proved traversal strength reduction. The score clears the required 2.0 implementation threshold despite the low projected whole-workload impact.

## Single candidate lever

The candidate changed only pivot metadata calculation inside the existing cyclic traversal:

- cache `n + 1` as the diagonal stride;
- hoist `p * n` and `p * n + p` out of the inner `q` loop;
- advance `pq` by one and `qq` by `n + 1` instead of multiplying for each pair;
- evaluate `Math.abs(apq)` once and reuse it for both residual maximum and tolerance comparison.

The rotation coefficient, row/column rotation traffic, eigenvector updates, residual stopping rule, sweep limit, tolerance, convergence check, eigenvalue floor, and output ordering were not changed.

## Candidate isomorphism proof

### Traversal and index identity

The candidate retained outer `p = 0..n-2` and inner `q = p+1..n-1` loops, including the same `continue` behavior and loop increment. For a fixed `p`, the cursors start with

```text
pq = p*n + (p+1)
qq = (p+1)*(n+1) = (p+1)*n + (p+1).
```

After every increment, induction gives `pq = p*n + q` and `qq = q*n + q`, exactly the original address expressions. `pp = p*n + p` is loop-invariant, so hoisting it changes no value. All addresses are non-negative integers within the successfully allocated `Float64Array(n*n)`.

### Maximum, ties, and threshold

Both versions invoke `Math.abs` on the identical `apq` double. The candidate stores that result, calls `Math.max(residual, magnitude)` in the same pair sequence, and evaluates the unchanged `magnitude <= absoluteTolerance` predicate. Equal magnitudes yield the same scalar residual; no pair index is stored or selected. Signed zero becomes positive zero under the same `Math.abs`, infinities compare identically, and a hypothetical internal NaN still makes the same `Math.max` result and the same false `<=` branch. Public input values are finite because `validateSquareFiniteMatrix` rejects any non-finite cell before allocation and symmetrization.

### Floating point, convergence, and residuals

No Jacobi arithmetic was reordered. Every accepted pair used the same `app`, `aqq`, and `apq`, the same stable tangent branch and `Math.hypot`, the same matrix/eigenvector updates, and the same explicit zero writes. Consequently every matrix and eigenvector cell after every rotation was bit-identical. The residual saw the same magnitudes in the same order, so sweep termination, the post-loop convergence residual, and any non-convergence throw were identical. Eigen residuals are therefore unchanged, not merely within a tolerance.

### Eigen ordering and optimizer determinism

Because the final diagonal and eigenvector buffer were bit-identical, the largest-first sort comparator received the same operands in the same original index order. Equal eigenvalues retained the same stable input-index tie behavior. RNG seed/draw order, candidate fitness/id sorting, covariance accumulation, and all optimizer state construction were untouched.

Candidate outputs for dimensions 1, 2, 4, 8, 12, 24, and 48 were regenerated. Every file was byte-identical under `cmp` to the authoritative golden.

## Paired representative measurement

Both runs used the identical command and seed schedule:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | Candidate | Change |
|---|---:|---:|---:|
| p50 | 59.63645800000086 ms | 58.72199999999998 ms | -1.533387512720598% |
| p95 | 62.91645799999969 ms | 61.65004100000078 ms | -2.0128548876653483% |
| p99 | 66.20970900000066 ms | 68.2465830000001 ms | +3.0763977530839517% |
| Throughput | 54,132.84806603682 eval/s | 55,022.87183766983 eval/s | +1.64414732169138% |
| Benchmark checksum | 24940.517463897122 | 24940.517463897122 | exact |

The p50 and p95 changes are inside the 4.8% envelope, and p99 moved in the opposite direction. Independent regional evidence was therefore required.

## Matched integrated and focused profiles

The matched integrated profiles each used 150 measured trials, ten warmups, seed 1729, and a 500 microsecond interval. Both ran for 9.88 s; sample counts were 15,323 before and 15,315 after.

| Integrated profile workload | Before | Candidate | Change |
|---|---:|---:|---:|
| p50 | 60.60087500000009 ms | 60.72320800000034 ms | +0.20186672222183788% |
| p95 | 67.51795799999991 ms | 65.2169159999994 ms | -3.4080444198275517% |
| p99 | 72.37091599999985 ms | 72.12683300000026 ms | -0.33726669978806373% |
| Throughput | 52,844.77852916076 eval/s | 52,836.849517339644 eval/s | -0.015004342986769142% |

The scan received zero direct source ticks before and after. Total `jacobiEigenSymmetric` self ticks were essentially flat at 6,651 versus 6,650. The unchanged rotation sites moved from 6,476 to 6,445 ticks, which cannot establish a pivot-scan improvement.

The focused profiles used the same matrix, 1,000 warmups, 50,000 measured calls, and a 250 microsecond interval.

| Focused workload | Before | Candidate | Change |
|---|---:|---:|---:|
| Duration | 3,739.058333 ms | 3,687.491208 ms | -1.3791473790307414% |
| Throughput | 13,372.350882764364 calls/s | 13,559.35436307622 calls/s | +1.3984338427200935% |
| Checksum | 147927.5178478016 | 147927.5178478016 | exact |

The focused scan again received zero direct ticks in both profiles. Native `Math.max` self-time moved from 1.0 ms to 1.8 ms rather than showing a reduction, while total Jacobi ticks fell only 2.46% and were dominated by the arithmetic-identical rotation sites. The 1.40% focused throughput movement is inside ordinary run-to-run variation and is not an independently attributable regional win.

## Concrete rejection checks

1. **Acceptance-envelope check:** representative p95 improved only 2.0129% and p50 only 1.5334%, both below 4.8%.
2. **Tail check:** representative p99 regressed 3.0764%.
3. **Integrated profile check:** pivot-search source ticks were 0 before and 0 after; total Jacobi ticks were flat at 6,651 versus 6,650.
4. **Profiled-throughput check:** integrated profiled throughput fell 0.0150%.
5. **Focused-region check:** throughput improved only 1.3984%, while the scan remained unattributed and sampled native `Math.max` time did not fall.
6. **Behavior check:** 16 tests / 157 assertions passed, the benchmark checksum was exact, and all seven candidate goldens were byte-identical.
7. **Restoration check:** the engine returned to SHA-256 `072eaf088527c1c70e77872656e4cb59aaf0d4de22c3a0268241080d8c64365a`; `git diff -- app/lib/cmaesEngineND.ts` and `git diff --check` are clean.

## Correctness and static gates on retained code

- `bun test app/lib/cmaesEngine.test.ts`: pass, 16 tests / 157 assertions.
- Candidate-to-authoritative `cmp`: pass for dimensions 1, 2, 4, 8, 12, 24, and 48.
- `shasum -a 256 -c tests/artifacts/perf/20260827T054115Z/golden_checksums.txt`: all seven authoritative goldens `OK` after restoration.
- Candidate pass-specific SHA-256 checksums: dim 1 `23ef87b503f394ff00a20bee762b4234213aac38ada056b043e070e094b31487`; dim 2 `e1d72f4da093e8ee25400b064f3da984cb57859117d59fd3b7ca25389be4edc1`; dim 4 `a3d92162d82e89c9949f348b7be548566dc7fd945c75cf27ec8494eb0c5bf047`; dim 8 `50730f90a2a2a3bc4211081a5b1520d37006b1b7cb62bc7355a0c65e07d3d1a8`; dim 12 `244ba862f7b77e01efdcdd299c9f50f2b99031574c0a12f2bdb60bd8281f7ac1`; dim 24 `0e614b1a75d1556271e69ad207b5508319fa1e53761c539dcb6e44b3f03e24dd`; dim 48 `7d8013ecd48a4c1c55af6efe8bc2545d606b362a70ebb77489eb1c51a061322a`.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; ESLint emitted only the pre-existing `baseline-browser-mapping` age advisory.
- `git diff --check`: pass.

## Files generated by this pass

- `pass-04-before.json` and `pass-04-after.json`
- `pass-04-before-profile-workload.json` and `pass-04-after-profile-workload.json`
- `pass-04-before.cpuprofile.cpuprofile`, `pass-04-after.cpuprofile.cpuprofile`, and their Markdown summaries
- `pass-04-before-focused-workload.json` and `pass-04-after-focused-workload.json`
- `pass-04-before-focused.cpuprofile.cpuprofile`, `pass-04-after-focused.cpuprofile.cpuprofile`, and their Markdown summaries
- `pass-04-golden-dim-{1,2,4,8,12,24,48}.json`
- `pass-04.md`

No production code was retained. `.skill-loop-progress.md` and the campaign ledger were not modified. No file was deleted, no destructive command was used, and no commit was made.

## Orchestrator verification

The orchestrator confirmed the engine has no diff and retains SHA-256 `072eaf088527c1c70e77872656e4cb59aaf0d4de22c3a0268241080d8c64365a`, inspected both integrated and focused evidence, reran the 16-test/157-assertion suite, verified all seven authoritative golden checksums, and confirmed `git diff --check`. The rejection is upheld: rotation arithmetic, not pivot traversal, owns the Jacobi samples.
