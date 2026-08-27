# Pass 15 — private projection-basis ownership transfer

Date: 2026-08-27

## Decision

Accepted. `alignProjectionBasis` still clones the eigensolver-owned matrix before
applying display-only sign alignment, but the aligned matrix is now transferred
directly into `previousProjectionBasis` instead of being cloned a second time.
The returned local and the field deliberately share one private, read-only-after-
construction matrix. No public state contains that matrix or any of its rows.

The representative p95 moved from 57.899750000000495 ms to
56.76350000000002 ms (-1.9624437065798417%), which remains inside the 4.8%
same-seed noise envelope. Independent evidence is material: the focused region's
p95 improved 20.752338177014096%, throughput rose 28.82240587749527%, the
targeted 37.6 ms profile call disappeared, and total `cloneMatrix` attribution
fell from 101.9 ms to 61.1 ms (-40.03925399411188%). Checksums and all seven
authoritative golden files remained exact.

The accepted engine SHA-256 is
`c0a263476eb7b022d8327bf9afa7eae0498daefde604f43a0d490226b6015465`.

## Fresh profile and opportunity matrix

The accepted pass-14 engine was freshly profiled before modification at
dimension 24 for 250 generations, 150 measured trials, ten warmups, the fixed
seed schedule, and a 500 microsecond interval. The 9.07-second run recorded
11,728 samples.

| Region | Profile evidence | Impact | Confidence | Effort | Score | Decision |
|---|---:|---:|---:|---:|---:|---|
| Second private projection-basis clone | `cloneMatrix` 101.9 ms / 1.1% total; exact call site 37.6 ms / 0.4% | 1 | 5 | 1 | 5.0 | Eligible and implemented |
| Repaired covariance reconstruction | 309.9 ms / 3.4% total | 1 | 5 | 4 | 1.25 | Below threshold; retained |

The clone score exceeds the required 2.0 threshold. Reconstruction does not:
its arithmetic is only 3.4% of the integrated workload, while preserving the
exact repaired covariance representation requires either the existing ordered
dense reconstruction or a substantially more invasive representation change.

## Reconstruction audit

Dense reconstruction is measurable, but it is not redundant:

1. The next generation reads every upper-triangle value from the reconstructed
   private covariance in the `oldCoefficient * covariance` recurrence.
2. The eigensolver floors tiny/non-positive eigenvalues. Keeping `provisional`
   would bypass that repair and make the stored covariance disagree with
   `currentEigen`.
3. The returned covariance snapshot and `variancePerDim` are derived from the
   reconstructed values. Replacing them with provisional values changes public
   binary64 outputs.
4. Lazy or fused reconstruction must still evaluate the same ordered
   `eigenvector[i][k] * eigenvalue[k] * eigenvector[j][k]` sum for every
   upper-triangle element. No exact lower-effort arithmetic reduction was found.

Consequently this pass leaves `reconstructSymmetric` untouched. The focused
one-lever change is only the provably unnecessary private clone.

## Single lever

Before:

```ts
const aligned = cloneMatrix(eigenvectors);
// Align at most the first three columns.
this.previousProjectionBasis = cloneMatrix(aligned);
return aligned;
```

After:

```ts
const aligned = cloneMatrix(eigenvectors);
// Align at most the first three columns.
this.previousProjectionBasis = aligned;
return aligned;
```

At dimension 24, this removes one 24-row/576-element nested-array clone per
generation. Across the 300-trial representative run that is 75,000 matrices,
1.8 million row arrays, and 43.2 million element copies avoided.

The first clone is intentionally retained: display sign alignment mutates up to
three columns and must never mutate `currentEigen.eigenvectors`, which drives
the next generation's sampling and whitening.

## Isomorphism proof

### Values and floating-point ordering

The construction of `aligned` is unchanged. Every row is cloned in the same
order, agreement dots visit the same rows in ascending order, the strict
`agreement < 0` branch is unchanged, and sign flips visit the same rows. The
removed operation copied already-complete numbers without performing floating-
point arithmetic. Returning and storing the original aligned values therefore
changes no number or arithmetic order.

### Lifetime and mutation

After `alignProjectionBasis` returns, `step` passes the matrix only to
`projectTo3D`, which validates and reads it. No caller mutates the matrix. The
next generation's `alignProjectionBasis` creates a new clone of its new
eigenvector matrix and only reads the prior basis for sign agreement; it then
replaces the field. Thus the transferred matrix is immutable for the remainder
of its lifetime.

The 4,176-check property audit verified this directly across dimensions 1, 2,
4, 8, and 24, three seeds, all three repair strategies, and four generations:

- aligned values equal an independent old-algorithm reconstruction exactly;
- the aligned matrix and every row remain separately owned from the eigensystem;
- a prior basis remains bit-exact after the following step;
- candidate, pC, and pSigma projections equal independent projections exactly;
- covariance, eigenvalue, mean, path, and best-point public snapshots remain
  separately owned; and
- mutating every relevant public nested array does not change the next state of
  a paired control optimizer.

All 4,176 checks passed; none failed.

### Public snapshots and history

The transferred matrix is not returned in `CMAESGenerationStateND` and is not
inserted into `history`. Candidate `projected3D` arrays contain only computed
scalar coordinates. `phaseSpace3D.principalAxes3D` remains a fresh identity
literal, and its path/eigenvalue arrays retain their existing independent
ownership. The covariance getter and generation state still clone the private
covariance. No public alias was introduced.

### Ordering, tie-breaking, and RNG

Candidate generation, RNG calls, objective calls, fitness/id sorting, rank
assignment, mean recombination, negative-weight normalization, covariance
adaptation, eigensolver ordering, sigma adaptation, and best-point tie behavior
are untouched. The change occurs only after all optimizer-state arithmetic for
the generation is complete.

### Golden proof

Fresh outputs at dimensions 1, 2, 4, 8, 12, 24, and 48 were byte-identical to
the authoritative files. Their SHA-256 values are:

| Dimension | SHA-256 |
|---:|---|
| 1 | `23ef87b503f394ff00a20bee762b4234213aac38ada056b043e070e094b31487` |
| 2 | `e1d72f4da093e8ee25400b064f3da984cb57859117d59fd3b7ca25389be4edc1` |
| 4 | `a3d92162d82e89c9949f348b7be548566dc7fd945c75cf27ec8494eb0c5bf047` |
| 8 | `50730f90a2a2a3bc4211081a5b1520d37006b1b7cb62bc7355a0c65e07d3d1a8` |
| 12 | `244ba862f7b77e01efdcdd299c9f50f2b99031574c0a12f2bdb60bd8281f7ac1` |
| 24 | `0e614b1a75d1556271e69ad207b5508319fa1e53761c539dcb6e44b3f03e24dd` |
| 48 | `7d8013ecd48a4c1c55af6efe8bc2545d606b362a70ebb77489eb1c51a061322a` |

## Paired representative evidence

Both sides used:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 55.627958000000945 ms | 54.613249999998516 ms | -1.8240971563299402% |
| p95 | 57.899750000000495 ms | 56.76350000000002 ms | -1.9624437065798417% |
| p99 | 63.19212499999958 ms | 66.10566700000163 ms | +4.610609312476943% |
| Throughput | 58,014.55810644985 eval/s | 59,170.02867128343 eval/s | +1.9916907109995163% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

The p95 movement is inside the established noise envelope, so retention does
not rely on the representative wall-clock result.

## Focused and profile evidence

The alternating focused pair modeled the exact private basis lifecycle at
dimension 24: clone eigensystem rows, align the first three columns against the
previous basis, store the basis, return it, consume values, and feed the stored
basis into the next call. It used 4,000 calls per trial, 40 measured trials,
five warmups, and alternated before/after execution order.

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 5.464792000000017 ms | 4.253708000000017 ms | -22.16157540854247% |
| p95 | 6.623749999999973 ms | 5.249167000000007 ms | -20.752338177014096% |
| p99 | 9.381708000000003 ms | 5.877415999999997 ms | -37.352388285800465% |
| Throughput | 704,775.8279439935 calls/s | 907,909.177600489 calls/s | +28.82240587749527% |
| Checksum | -31.295743148112457 | -31.295743148112457 | exact |

Matched integrated profiles used the same 150-trial workload and 500
microsecond interval. `cloneMatrix` fell from 101.9 ms / 1.1% total to
61.1 ms / 0.6% total. The 37.6 ms / 0.4% line for the second clone disappeared
entirely. Process-wide profile duration and unrelated reconstruction samples
moved in opposite directions, so no claim is made from those noisy totals.

## Memory and quality gates

The immediately adjacent matched RSS pair recorded 83,378,176 bytes before and
79,986,688 bytes after (-4.067596777362937%). The candidate result is below the
90,166,067-byte campaign guardrail. Two earlier unmatched candidate-only fresh
processes recorded 95,780,864 and 90,423,296 bytes, demonstrating host/allocator
RSS variance; the attributable paired result and the source-level removal of a
matrix allocation show no retained-growth regression.

- Candidate outputs matched all seven authoritative goldens byte-for-byte.
- All seven authoritative checksums passed `shasum -a 256 -c`.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- Ownership/projection audit: 4,176 checks passed, 0 failed.
- `bun typecheck`: pass.
- `bun lint`: pass; only the pre-existing `baseline-browser-mapping` age
  advisory was emitted.
- No format script exists in `package.json`; the one-line edit follows existing
  formatting and full lint passed.
- `ubs app/lib/cmaesEngineND.ts`: exit 0 with zero critical findings; broad
  cross-language heuristic notices were unrelated.
- `git diff --check`: pass.

## Files generated

- `pass-15-{before,after}.json` — paired representative evidence.
- `pass-15-{before,after}-profile-workload.json`, CPU profiles, and Markdown
  reports — matched integrated profiles.
- `pass-15-focused-pair.json` — alternating regional measurements.
- `pass-15-golden-dim-{1,2,4,8,12,24,48}.json` — fresh exact outputs.
- `pass-15-ownership-properties.json` — 4,176 ownership/projection checks.
- `pass-15-reconstruction-audit.json` — reconstruction dataflow and eligibility
  audit.
- `pass-15-rss*.json` and `pass-15-rss*.txt` — RSS variance and adjacent matched
  pair evidence.
- `pass-15-profile-summary.json`, `pass-15-gates.json`, and this report —
  structured summary, gate results, and proof.

`.skill-loop-progress.md` was not modified. No file was deleted, no destructive
command was used, and no commit was made.

## Orchestrator verification

The orchestrator independently traced the retained matrix after transfer: it is
read only by `projectTo3D`, never exposed in a generation state or history
entry, and is replaced only after the next call has finished reading it for sign
alignment. The root representative rerun recorded p95 56.776833999999326 ms
with the exact checksum 12274.303979858667. The focused CMA-ES tests, golden
hashes, ownership evidence, and `git diff --check` passed before commit.
