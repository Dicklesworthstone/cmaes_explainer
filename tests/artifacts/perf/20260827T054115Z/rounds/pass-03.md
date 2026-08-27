# Pass 03 — flat/typed covariance hot-path layout

Date: 2026-08-27

## Decision

Rejected. A generation-local flat `Float64Array` covariance buffer with ownership transfer into the already-flat Jacobi kernel preserved exact deterministic behavior, but the paired 300-trial wall result was inside the 4.8% same-seed envelope and the matched profile showed no independent regional win. The candidate improved p95 by only 0.5155554137305507%, while scoped rounded self/total attribution increased about 7.661477509204406% and profiled throughput fell 0.8604959588179528%. The production edit was restored with `apply_patch`; `app/lib/cmaesEngineND.ts` has the same SHA-256 before and after this pass (`072eaf088527c1c70e77872656e4cb59aaf0d4de22c3a0268241080d8c64365a`).

## Current layout and measured opportunity

The current optimizer has three distinct matrix ownership domains:

1. `this.covariance` is a private nested `number[][]`. `C` returns `cloneMatrix(this.covariance)`, and every generation state receives another nested clone. Caller mutation therefore cannot alter the optimizer's private covariance or cached eigensystem.
2. The rank-mu update creates a generation-local nested `provisional` matrix. Pass 01 writes its upper triangle in unchanged rank order, then finalization mirrors it before eigendecomposition.
3. `jacobiEigenSymmetric` validates the nested input, symmetrizes it into a flat `Float64Array`, mutates that owned flat array during sweeps, and reconstructs nested eigenvectors. `reconstructSymmetric` then constructs a fresh nested private covariance. Jacobi mutation never aliases the provisional input, persistent covariance, or public snapshots.

The fresh 500 microsecond / 150-trial current profile ran for 9.81 s with 15,134 samples. Layout-exposed work was approximately 25.47% of the profile (2,498.8 ms using the profiler's rounded line-level self/total attribution):

- nested provisional allocation/setup at the old line 629: 371.1 ms total / 330.4 ms self;
- rank-mu nested traversal at the old lines 636-637: approximately 1,748.3 ms self;
- nested covariance finalization/mirroring at the old lines 642, 645, and 649: approximately 302.6 ms self;
- nested validation at the Jacobi boundary: 60.5 ms total;
- the input `Float64Array` allocation at the old line 110: 16.3 ms total. The conversion loop itself was not cleanly separated by the sampler.

`reconstructSymmetric` was another 261.3 ms self / 303.6 ms total (2.6% / 3.0%), but it was deliberately excluded from this lever: flattening persistent covariance and reconstructing public snapshots at every boundary would have expanded the candidate into a private-state architecture rewrite. The 43% Jacobi rotation arithmetic was also excluded because it was already flat and is assigned to later passes.

Opportunity score: `(impact 2 x confidence 4) / effort 2 = 4.0`. Impact was conservatively rated 2 because a 37.45% isolated reduction across a roughly 25.5% region projects to a high-single-digit whole-workload gain. Confidence was 4 rather than 5 because JavaScriptCore typed-array indexing costs had not yet been observed in the integrated path. The score cleared the required 2.0 implementation threshold.

## JavaScriptCore typed-array analysis

The candidate used a row-major `Float64Array(dim * dim)` and cached `row * dim` outside each inner loop. This trades 24 separately allocated row arrays plus their outer array for one zero-filled contiguous buffer and makes it possible to transfer that buffer directly to Jacobi rather than allocate/copy another matrix.

The expected advantages were fewer objects, contiguous storage, native zero initialization, no row-pointer load in finalization, and no nested-to-flat copy. The countervailing JavaScriptCore/Bun costs are an integer-index conversion and bounds check on every typed access, explicit row-offset arithmetic, and a numeric conversion on every store. JSC can eliminate some bounds checks for simple full-range loops, but the triangular `column = row` loop and dynamic `dim` make elimination less reliable. By contrast, the current rank loop caches `provisional[row]`, so its inner access is a contiguous indexed access into one stable numeric JS array without repeating the row multiplication.

The candidate also had to reproduce work currently performed while Jacobi copies the nested input: finite-value validation, `0.5 * (value + value)` symmetrization, and maximum-absolute-value scale calculation. Moving those operations into covariance finalization made the direct ownership transfer behaviorally exact but exposed their cost in the hot integrated loop.

## Candidate lever

Only the generation-local provisional covariance layout changed:

- replace nested `createZeroMatrix(dim)` with one row-major `Float64Array(dim * dim)`;
- retain rank-outer / row / upper-column traversal and cache a row offset;
- perform the same final covariance expression for each upper-triangle element;
- reproduce the exact `0.5 * (value + value)` that the public Jacobi function would have stored, mirror that scalar in the flat buffer, and calculate the same tolerance scale;
- transfer exclusive ownership of the generation-local flat buffer to a private Jacobi helper, which mutates it exactly as before;
- leave persistent `this.covariance`, reconstruction, eigenvectors, `C`, generation states, history, and every public `MatrixND` signature nested.

No candidate construction, sorting, weighting, negative-weight normalization, RNG, Jacobi pivot/rotation arithmetic, convergence condition, eigenvalue ordering/floor, reconstruction arithmetic, or snapshot API changed.

## Isomorphism proof

### Ordering and floating-point behavior

For each upper-triangle element, both versions start at positive zero and add ranks in the exact order `0, 1, ..., lambda - 1`. Both evaluate `covarianceWeight * normalizedStep[row]` and then multiply by `normalizedStep[column]`; no per-element multiplication or addition was reordered. Float64Array stores convert an already-numeric JavaScript double to the same IEEE-754 binary64 value.

The final expression retained the same evaluation order:

```text
oldCoefficient * oldCovariance[row][column]
  + c1 * pC[row] * pC[column]
  + cmu * rankMu
```

Before Jacobi, the candidate explicitly evaluated the same `0.5 * (value + value)` expression as the current nested-to-flat conversion. Thus Jacobi received the same row-major binary64 cells, the same scale, the same tolerance, and ran the same mutation, pivot, rotation, convergence, ordering, and flooring arithmetic.

### RNG, ranking, and snapshots

- RNG seed and draw order: unchanged.
- Fitness order and id tie-break: unchanged.
- Candidate/rank accumulation order: unchanged.
- Public covariance type and nesting: unchanged.
- `this.covariance` ownership: unchanged and still replaced only by `reconstructSymmetric`.
- `C`, returned-state covariance, and retained history covariance: unchanged nested clones with no alias to the candidate's generation-local typed buffer.

### Exact oracle

Candidate outputs for dimensions 1, 2, 4, 8, 12, 24, and 48 were regenerated into pass-specific files. Every file was byte-identical under `cmp` to its authoritative golden. After restoration, `shasum -a 256 -c tests/artifacts/perf/20260827T054115Z/golden_checksums.txt` reported all seven authoritative goldens `OK`.

## Isolated layout microbenchmark

The 24-D / lambda-13 regional microbenchmark used fixed numeric inputs, 2,000 warmup calls per variant, 60 paired/interleaved trials, and 1,000 kernels per trial. Checksums were identical (`3680.64375821341`) for nested, typed-owned, and flat-number-owned variants.

| Variant | p50 per 1,000 | p95 per 1,000 | Versus nested p50 | Versus nested p95 |
|---|---:|---:|---:|---:|
| Current nested plus Jacobi copy | 4.544500000000028 ms | 5.028458999999998 ms | — | — |
| Flat typed, owned by Jacobi | 2.843917000000033 ms | 3.1452919999999267 ms | -37.42068434371183% | -37.450181059447274% |
| Flat JS number array, owned | 3.3915420000000154 ms | 3.7043339999999887 ms | -25.370403784794927% | -26.332619993521078% |

This justified trying the lever but was not accepted as campaign evidence after the integrated profile contradicted it.

## Paired 300-trial measurement

Both runs used the exact command and seed schedule:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | Candidate | Change |
|---|---:|---:|---:|
| p50 | 60.67545799999971 ms | 60.32500000000073 ms | -0.577594321577235% |
| p95 | 62.67512499999975 ms | 62.35199999999986 ms | -0.5155554137305507% |
| p99 | 67.21504100000038 ms | 65.0119999999988 ms | -3.27760121429006% |
| Throughput | 53,357.246886101944 eval/s | 53,605.160148613046 eval/s | +0.4646290372520623% |
| Benchmark checksum | 24940.517463897122 | 24940.517463897122 | exact |

All wall metrics were inside the 4.8% same-seed envelope, so independent regional evidence was mandatory.

## Matched profile check

Both profiles used a 500 microsecond interval, 150 measured trials, ten warmups, and the same seed schedule. The current profile ran for 9.81 s with 15,134 samples; the candidate ran for 9.87 s with 15,256 samples.

- Profile workload p50: 60.2454580000001 ms before, 60.794458000000304 ms after (+0.9112720165563415%).
- Profile workload p95: 65.45249999999942 ms before, 65.51041700000042 ms after (+0.08848707077804274%).
- Profiled throughput: 53,282.47752018012 eval/s before, 52,823.98395436088 eval/s after (-0.8604959588179528%).
- Using the same scoped definition and the profiler's rounded attribution, layout work rose from approximately 2,498.8 ms to 2,690.245 ms (+7.661477509204406%; about 25.47% to 27.26% of profile duration).
- The flat accumulation was split across typed indexed-loop sites (approximately 1,908.6 ms versus approximately 1,748.3 ms nested). Removing nested allocation did not repay the typed indexing cost plus integrated finite/symmetrization/scale boundary work.
- Common Jacobi rotation sites moved from roughly 4.21 s to 4.12 s, but that kernel was arithmetic-identical and outside the lever. Its shift cannot establish independent layout improvement and is treated as sampling variation.

## Concrete rejection checks

1. **Acceptance-envelope check:** paired p95 improved only 0.5156% and p50 only 0.5776%, both far inside 4.8%.
2. **Regional profile check:** scoped layout attribution increased approximately 7.66% rather than decreasing.
3. **Profiled-throughput check:** evaluations per second fell 0.8605% in the matched profile workload.
4. **Typed-index check:** integrated flat typed accumulation was approximately 9.17% slower by rounded attributed time than the cached-row nested accumulation, despite the isolated microbenchmark's result.
5. **Behavior check:** 16 tests / 157 assertions passed and all seven candidate goldens were byte-identical; rejection is performance-based.
6. **Restoration check:** the engine returned to exact SHA-256 `072eaf088527c1c70e77872656e4cb59aaf0d4de22c3a0268241080d8c64365a`, and `git diff -- app/lib/cmaesEngineND.ts` is empty.

## Correctness and static gates on retained code

- `bun test app/lib/cmaesEngine.test.ts`: pass, 16 tests / 157 assertions.
- Candidate-to-authoritative `cmp`: pass for dimensions 1, 2, 4, 8, 12, 24, and 48.
- `shasum -a 256 -c tests/artifacts/perf/20260827T054115Z/golden_checksums.txt`: all seven `OK`.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing `baseline-browser-mapping` age advisory was emitted.
- `git diff --check`: pass.

## Files generated by this pass

- `pass-03-before.json`
- `pass-03-after.json`
- `pass-03-before-profile-workload.json`
- `pass-03-after-profile-workload.json`
- `pass-03-before.cpuprofile.cpuprofile`
- `pass-03-after.cpuprofile.cpuprofile`
- `pass-03-before.cpuprofile.md`
- `pass-03-after.cpuprofile.md`
- `pass-03-layout-microbench.json`
- `pass-03-golden-dim-1.json`
- `pass-03-golden-dim-2.json`
- `pass-03-golden-dim-4.json`
- `pass-03-golden-dim-8.json`
- `pass-03-golden-dim-12.json`
- `pass-03-golden-dim-24.json`
- `pass-03-golden-dim-48.json`
- `pass-03.md`

No production code was retained. `.skill-loop-progress.md` and the campaign ledger were not modified. No file was deleted, no destructive command was used, and no commit was made.

## Orchestrator verification

The orchestrator confirmed an empty engine diff and exact retained SHA-256 `072eaf088527c1c70e77872656e4cb59aaf0d4de22c3a0268241080d8c64365a`, inspected the integrated and scoped evidence, reran the 16-test/157-assertion suite, verified all seven authoritative golden checksums, and confirmed `git diff --check`. The rejection is upheld despite the isolated microbenchmark because the representative integrated workload contradicted it.
