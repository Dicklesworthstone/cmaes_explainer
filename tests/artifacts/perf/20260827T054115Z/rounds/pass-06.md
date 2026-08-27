# Pass 06 — canonical-upper Jacobi row/column updates

Date: 2026-08-27

## Decision

Accepted. The retained candidate treats the strict upper triangle of Jacobi's
private `Float64Array` as the sole authoritative off-diagonal representation.
For every rotation it reads and writes the same logical `A[k,p]` and `A[k,q]`
cells in the same `k` order, but it no longer stores identical values into the
unused lower-triangle mirrors.

At dimension 24, each executed rotation's row/column body falls from 44 reads
plus 88 writes to 44 reads plus 44 writes, a 33.333333333333336% reduction in
that body's matrix traffic. Including diagonal and pivot-zero stores, writes to
`a` fall from 92 to 47 per executed rotation (-48.91304347826087%).

The representative 300-trial p95 moved from 61.748875000001135 ms to
60.01808299999993 ms (-2.802953090240381%), inside the established 4.8%
same-seed envelope. Independent regional evidence clears the acceptance gate:
50,000 focused decompositions improved from 11,251.088505965638 to
12,869.285763648617 calls/s (+14.382584021314619%), and the matched focused
profiles improved from 11,353.928754551223 to 12,234.451358663337 calls/s
(+7.755223968259934%) while sampled Jacobi self-time fell from 3.99 s to
3.68 s (about -7.77%). Checksums and all seven deterministic goldens are exact.

## Scope and opportunity score

- Eligible lever: Jacobi row/column update traffic and traversal only.
- Retained edit: choose the canonical strict-upper address for each logical
  `A[k,p]` and `A[k,q]`, then omit redundant lower-mirror stores.
- Explicitly unchanged: sweep/pivot order, residual calculation, tolerance,
  rotation coefficient, `cosine`/`sine`, diagonal formulas, eigenvector update,
  convergence/sweep limit, eigenvalue ordering and floor, covariance update,
  reconstruction, RNG, public API, and snapshots.
- Fresh representative profile: 150 measured 24-D trials, ten warmups, seed
  1729, 500 microsecond interval, 9.762335 s / 15,119 samples. It measured
  p50 60.050874999999905 ms, p95 64.65291700000034 ms, p99
  72.75683299999992 ms, and 53,472.444794570605 evaluations/s with checksum
  12274.303979858667.
- Fresh focused baseline: 50,000 24-D Jacobi calls after 1,000 warmups took
  4,444.014459 ms. Its profile assigned 87.8% self / 91.3% total to the hot
  Jacobi frame. Bun coalesced coefficient and update-body source mapping onto
  line 145, so the structural traffic count and matched focused throughput are
  used to attribute this lever rather than pretending line ticks distinguish
  individual statements in the optimized loop.
- Opportunity score: `(impact 3 x confidence 4) / effort 2 = 6.0`. Impact 3
  reflects a one-third traffic reduction in the focused kernel's dominant
  frame. Confidence 4 reflects exact access counting plus two fresh profiles;
  it is not 5 because the JIT source map coalesces the rotation body. Effort 2
  reflects a seven-line, one-function diff with a nontrivial invariant proof.

## Exact address coverage

For row-major dimension `n`, define the canonical address for a logical
off-diagonal symmetric cell as

```text
upper(i,j) = min(i,j) * n + max(i,j).
```

For every existing pivot `p < q` and every unchanged loop index
`k = 0..n-1`, excluding `p` and `q`, the retained expressions are exactly

```text
kp = upper(k,p)
kq = upper(k,q).
```

The three index regions make the coverage explicit:

| Region | `kp` | `kq` |
|---|---|---|
| `k < p < q` | `k*n + p` | `k*n + q` |
| `p < k < q` | `p*n + k` | `k*n + q` |
| `p < q < k` | `p*n + k` | `q*n + k` |

Thus the loop visits exactly the two logical cells `{k,p}` and `{k,q}` for
every permitted `k`, with no omission or duplication. The executable coverage
check enumerated all 43,680 pivot pairs for dimensions 2 through 64. Each
rotation produced exactly `2*(n-2)` distinct strict-upper addresses and no
read-after-write alias.

The initial symmetrization writes both triangles. For finite validated inputs,
`0.5 * (matrix[i][j] + matrix[j][i])` and the transposed evaluation store the
same binary64 value; this includes the finite signed-zero cases. Thereafter the
baseline stores each computed rotation result into both symmetric addresses.
By induction, before every pivot the candidate's canonical upper cell is
bit-identical to either mirror that the baseline could read.

The candidate deliberately lets lower off-diagonal cells become stale. They
are unobservable and never read after initialization:

1. pivots read `a[p*n+q]` with `p < q`;
2. row/column rotations now read `upper(k,p)` and `upper(k,q)`;
3. diagonal formulas read and write only `a[p,p]` and `a[q,q]`;
4. residuals use the same upper pivot value;
5. ordering and raw eigenvalues read only the diagonal;
6. returned eigenvectors are built from the separate `v` buffer.

The removed `a[q*n+p] = 0` is the same kind of unused lower-mirror store; the
authoritative upper pivot `a[p*n+q]` is still zeroed at the same point.

## Read-after-write and arithmetic proof

For a fixed rotation, all `2*(n-2)` canonical row/column addresses are
distinct. A collision between a `p` address for one `k` and a `q` address for
another would require the skipped pair `k=q` and `k=p`. Each iteration reads
both old cells before either result is stored, and no later iteration reads an
address written by an earlier one. Changing which symmetric copy supplies the
old value therefore introduces no read-after-write difference.

Each `k` still evaluates, in the same order,

```text
rotatedP = cosine * akp - sine * akq
rotatedQ = sine * akp + cosine * akq.
```

The operands are bit-identical under the upper-triangle invariant. The same
`Float64Array` stores each result, so JavaScript number evaluation and binary64
write rounding are identical. No sum, product, subtraction, division,
comparison, or `Math` call was added, removed, or reordered. Only redundant
stores of already-computed values were removed.

## Rotation, eigenvector, residual, and ordering identity

- Sweep order remains `sweep`, then lexicographic `(p,q)`, then ascending `k`.
- The pivot value, threshold decision, accepted-rotation sequence, exact-tail
  coefficient, `cosine`, and `sine` are bit-identical.
- The eigenvector column loop is textually unchanged: ascending `k`, read
  `v[k,p]` then `v[k,q]`, write rotated `v[k,p]` then `v[k,q]`.
- Every authoritative upper cell and diagonal is therefore bit-identical after
  each rotation. Each later residual sees the same pivots in the same order;
  stopping and non-convergence behavior are identical.
- Final diagonal values and `v` are identical. The largest-first comparator
  receives the same values in the same original index order, so eigenvalue
  ties, floors, residuals, eigenvector columns, and output ordering are exact.
- RNG state and draw order are untouched. The 300-trial benchmark checksum is
  exactly 24940.517463897122 before and after.

No extra adversarial arithmetic gate was triggered: this lever changes no
arithmetic. The exact state induction establishes stronger bit identity than a
residual tolerance comparison. The seven cross-dimensional optimizer goldens
and the existing positive-definiteness/convergence tests exercise the retained
implementation end to end.

## Snapshot isolation

`a` is allocated inside every `jacobiEigenSymmetric` call and is never exposed.
The input nested matrix is only read. The returned eigenvalues are constructed
from the private diagonal and the returned nested eigenvectors are copied from
the separate private `v` buffer. Stale lower cells cannot escape. A direct
probe confirmed the input matrix, including a `-0` cell, was unchanged; the
existing public-covariance mutation test also passed and produced the same next
optimizer state as its untouched control.

## Paired representative measurement

Both sides used exactly:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | Canonical upper | Change |
|---|---:|---:|---:|
| p50 | 58.978291000000354 ms | 57.97662500000024 ms | -1.6983638946067594% |
| p95 | 61.748875000001135 ms | 60.01808299999993 ms | -2.802953090240381% |
| p99 | 66.23329199999898 ms | 65.5072910000008 ms | -1.0961270051293672% |
| Throughput | 54,759.713988890515 eval/s | 55,811.11014493964 eval/s | +1.920017617810105% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

The wall result alone is inconclusive because p95 is inside 4.8%. The focused
regional evidence below is the acceptance basis.

## Focused Jacobi microbenchmark and profile

Both focused workloads used the same deterministic dense, symmetric, strictly
diagonally dominant 24-D matrix, 1,000 warmups, and 50,000 decompositions.

| Unprofiled focused metric | Before | Canonical upper | Change |
|---|---:|---:|---:|
| Duration | 4444.014459 ms | 3885.2195 ms | -12.574103080792874% |
| Throughput | 11,251.088505965638 calls/s | 12,869.285763648617 calls/s | +14.382584021314619% |
| Checksum | 131104.47135849128 | 131104.47135849128 | exact |

Matched profiles used a 250 microsecond interval:

| Profiled focused metric | Before | Canonical upper | Change |
|---|---:|---:|---:|
| Workload duration | 4403.762 ms | 4086.8199590000004 ms | -7.197074705672101% |
| Throughput | 11,353.928754551223 calls/s | 12,234.451358663337 calls/s | +7.755223968259934% |
| Profile duration | 4.54 s | 4.22 s | about -7.08% |
| Jacobi self | 3.99 s / 87.8% | 3.68 s / 87.3% | about -7.77% absolute |
| Jacobi total | 4.14 s / 91.3% | 3.84 s / 90.9% | about -7.25% absolute |
| Checksum | 131104.47135849128 | 131104.47135849128 | exact |

Native `hypot`, coefficient arithmetic, validation, sorting, and output
construction are unchanged. The wall and sampled absolute reductions therefore
agree with the structural store reduction in the eligible region.

## Exact oracle and quality gates

- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- Fresh candidate output compared byte-for-byte with the authoritative golden
  for dimensions 1, 2, 4, 8, 12, 24, and 48: all exact.
- `shasum -a 256 -c golden_checksums.txt`: all seven authoritative files `OK`.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing
  `baseline-browser-mapping` age advisory was emitted.
- `ubs app/lib/cmaesEngineND.ts`: exit 0, no critical findings attributable to
  the diff; heuristic repository warnings are pre-existing.
- `git diff --check`: pass.
- Final engine SHA-256: `11a9b80071cd2ec8e5211f93097ecc21ad5ea3c486b14026f21ef0d457090174`.
- Production diff: one file, two insertions and five deletions.

## Files changed or generated

- `app/lib/cmaesEngineND.ts` — retained canonical-upper update traversal.
- `pass-06-before.json`, `pass-06-after.json` — representative summaries.
- `pass-06-before-profile-workload.json` and
  `pass-06-before.cpuprofile` — fresh integrated baseline profile evidence.
- `pass-06-before-focused-workload.json` and
  `pass-06-after-focused-workload.json` — focused microbenchmark summaries.
- `pass-06-before-focused.cpuprofile.{cpuprofile,md}` and
  `pass-06-after-focused.cpuprofile.{cpuprofile,md}` — matched focused profiles.
- `pass-06-address-coverage.json` — exhaustive dimension 2..64 address check.
- `pass-06-golden-checks.json` — exact seven-dimensional oracle record.
- `pass-06.md` — this report.

`.skill-loop-progress.md` and the campaign ledger were not modified. No file
was deleted, no destructive command was used, and no commit was made.

## Orchestrator verification

The orchestrator reviewed the canonical-address induction and the exhaustive dimension 2–64 coverage artifact, inspected the confined diff, reran the 16-test/157-assertion suite, verified all seven authoritative golden checksums, and independently measured 150 representative trials at p50 57.97 ms, p95 60.84 ms, p99 64.26 ms, and 55,595 evaluations/s with the exact checksum. Typecheck, scoped lint, UBS, and `git diff --check` passed. The accepted regional win is upheld.
