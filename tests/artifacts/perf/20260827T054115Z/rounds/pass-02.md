# Pass 02 — rank-μ workspace/finalization fusion

Date: 2026-08-27

## Decision

Rejected. The candidate preserved exact deterministic behavior, but the paired 300-trial result was flat at p50 and 1.0617070196866336% slower at p95. Both changes are inside the 4.8% same-seed envelope, and the paired sampled profiles did not provide independent evidence of a regional improvement. The production edit was therefore restored with `apply_patch`; `app/lib/cmaesEngineND.ts` has the same SHA-256 before and after this pass (`072eaf088527c1c70e77872656e4cb59aaf0d4de22c3a0268241080d8c64365a`).

## Scope and opportunity

- Mission: reduce only rank-μ covariance workspace initialization and later symmetric-finalization overhead after pass 01's accepted rank-outer traversal.
- Fresh current CPU evidence: `step` workspace allocation/setup at line 629 accounted for 3.6% self (358.6 ms), while the final covariance formula and symmetric assignment at lines 645 and 649 accounted for another 2.8% self (286.9 ms). The scoped overhead was 6.4% sampled self-time, exclusive of the retained rank-μ arithmetic body.
- Opportunity score: `(impact 2 × confidence 5) / effort 1 = 10.0`; eligible because the minimum is 2.0.
- One candidate lever: allocate full-length provisional rows while zeroing only the upper triangle, then fuse the unchanged covariance formula and symmetric mirror into the final rank's traversal. The candidate also avoided the redundant diagonal mirror assignment.
- No candidate generation, sorting, weighting, negative-weight normalization, eigensolver arithmetic, RNG, positive-definiteness repair, covariance reconstruction, or public snapshot code changed.

## Candidate isomorphism proof

### Arithmetic and ordering

For every upper-triangle element, the candidate explicitly initialized positive zero and performed the same left-associative additions in rank order `0, 1, ..., lambda - 1`. Immediately after the final rank addition it evaluated the unchanged expression:

```text
oldCoefficient * oldCovariance[row][column]
  + c1 * pC[row] * pC[column]
  + cmu * rankMu
```

Interleaving finalization between independent matrix elements did not change any per-element operation or dependency. Candidate ranking, fitness/id tie-breaking, covariance-weight ordering, and RNG draw order were untouched.

### Jacobi input and positive-definiteness repair

Every row retained length `dim`. Upper cells were finalized in place and every off-diagonal value was copied to its lower-triangle peer before `jacobiEigenSymmetric` was called. Thus Jacobi received the same full finite symmetric nested matrix and executed the same symmetrization, sweep, eigenvalue floor, and reconstruction path. The diagonal's omitted second assignment had no observable effect because it would only rewrite the identical scalar to the same private array cell.

### Snapshot isolation

The provisional matrix remained generation-local. `this.covariance` was still assigned only from `reconstructSymmetric`, and returned/history covariance remained protected by `cloneMatrix`. Public snapshot isolation was unchanged.

### Exact oracle

The candidate regenerated dimensions 1, 2, 4, 8, 12, 24, and 48 into pass-specific files. Each was byte-identical to its authoritative stored golden, and `shasum -a 256 -c golden_checksums.txt` reported all seven `OK`.

## Paired 300-trial measurement

Both runs used the same command and seed schedule:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | Candidate | Change |
|---|---:|---:|---:|
| p50 | 60.051124999999956 ms | 60.0324580000015 ms | -0.03108517950073174% |
| p95 | 62.70166700000027 ms | 63.36737499999981 ms | +1.0617070196866336% |
| p99 | 66.8397500000001 ms | 68.0786250000001 ms | +1.8535003497170552% |
| Throughput | 53,804.238589446744 eval/s | 53,704.519634277414 eval/s | -0.1853366161915895% |
| Benchmark checksum | 24940.517463897122 | 24940.517463897122 | exact |

The fresh before p95 is only 1.59% above pass 01's independent 61.72 ms verification and is within the established noise envelope.

## Paired profile check

Both 150-trial profiles used a 500 μs interval and the same workload/seed schedule. The before profile ran for 9.88 s with 12,849 samples; the candidate profile ran for 9.92 s with 13,028 samples.

- Workspace allocation/setup fell from 358.6 ms to 292.3 ms.
- The candidate introduced final-rank condition/finalization work in the hot rank-μ traversal; the scoped rank-μ region rose from approximately 2,450.1 ms to 2,539.2 ms (+3.64%) using the profiler's rounded line-level self times.
- Profiled throughput fell from 52,840.197134286806 to 52,674.503045893776 eval/s (-0.31%).
- The primary accumulation attribution rose from 18.1% to 19.4% self, consistent with the added per-element final-rank branch outweighing the removed traversal.

This profile does not establish an independent regional win, so the within-envelope latency result cannot be accepted.

## Concrete rejection checks

1. **Latency check:** paired p95 regressed 1.0617% and p50 improved only 0.0311%; neither clears the 4.8% envelope.
2. **Regional profile check:** scoped rounded self-time increased about 3.64%, rather than decreasing.
3. **Throughput check:** unprofiled throughput fell 0.1853%, and profiled throughput fell 0.31%.
4. **Behavior check:** all seven candidate goldens were byte-identical, proving that rejection is performance-based rather than a correctness failure.
5. **Restoration check:** the engine SHA-256 returned exactly to the pre-pass hash and `git diff -- app/lib/cmaesEngineND.ts` is empty.

## Correctness and static gates on retained code

- `bun test app/lib/cmaesEngine.test.ts`: pass, 16 tests / 157 assertions.
- Candidate regeneration/candidate-to-stored `cmp`: pass for all seven deterministic goldens.
- `shasum -a 256 -c tests/artifacts/perf/20260827T054115Z/golden_checksums.txt`: all seven stored goldens `OK` after restoration.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass. ESLint emitted only the pre-existing `baseline-browser-mapping` age advisory.
- `git diff --check`: pass.

## Files generated by this pass

- `pass-02-before.json` and `pass-02-after.json` — paired 300-trial measurements.
- `pass-02-before-profile-workload.json` and `pass-02-after-profile-workload.json` — paired 150-trial profiler workloads.
- `pass-02-before.cpuprofile.cpuprofile` and `pass-02-after.cpuprofile.cpuprofile` — raw sampled profiles.
- `pass-02-before.cpuprofile.md` and `pass-02-after.cpuprofile.md` — profiler summaries.
- `pass-02-golden-dim-{1,2,4,8,12,24,48}.json` — candidate deterministic outputs.
- `pass-02.md` — this report.

No production change was retained. `.skill-loop-progress.md` was read but not modified. No file was deleted and no commit was made.

## Orchestrator verification

The orchestrator confirmed that `app/lib/cmaesEngineND.ts` has no diff from pass 01 and SHA-256 `072eaf088527c1c70e77872656e4cb59aaf0d4de22c3a0268241080d8c64365a`, reran the 16-test/157-assertion CMA-ES suite, verified all seven authoritative golden checksums, inspected the paired measurements/profiles, and confirmed a clean `git diff --check`. The rejection is upheld.
