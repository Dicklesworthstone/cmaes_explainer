# Pass 19 — split Jacobi's canonical upper-triangle traversal

Date: 2026-08-27

## Decision

Accepted. A fresh profile of the current pass-18 source still put
`jacobiEigenSymmetric` first at 40.9% self / 42.5% total time. Its hot rotation
loop formerly selected two canonical upper-triangle addresses with conditionals
for every `k`. The loop now traverses the three already-implied ranges `k < p`,
`p < k < q`, and `q < k`; each range uses its fixed address formula.

This is one address-traversal lever. The binary64 arithmetic, rotation order,
convergence test, eigensystem ordering, and every CMA-ES operation are unchanged.
The retained engine SHA-256 is
`a05cc55aa80e8c5831f51126fd4b6c5c0721c85b479c914b6ba7253f2ac0f93a`.

## Fresh profile and opportunity matrix

The accepted source at commit `a60acc4` was profiled at dimension 24 for 250
generations, 150 measured trials, ten warmups, and a 500-microsecond interval.
The 10.27-second run recorded 13,140 samples.

| Rank | Region | Fresh evidence | Impact | Confidence | Effort | Score | Decision |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | Jacobi eigendecomposition | 40.9% self / 42.5% total | 4 | 5 | 2 | 10.0 | Eligible; implemented split address traversal |
| 2 | Rank-mu covariance accumulation | 19.5% self | 3 | 2 | 4 | 1.5 | Ineligible; prior flat-layout and recomputation candidates were falsified and the fresh profile isolated no new exact lever |
| 3 | Eigen-coordinate sample transform | 4.3% self / 4.4% total | 1 | 3 | 3 | 1.0 | Below threshold |
| 4 | Mahalanobis norm | 3.0% self / 3.1% total | 1 | 3 | 3 | 1.0 | Below threshold after pass 14 |
| 5 | Covariance reconstruction | 2.5% self / 2.9% total | 1 | 4 | 4 | 1.0 | Below threshold and required for exact repaired state |

The chosen score is `(4 × 5) / 2 = 10`, above the required 2.0 threshold.

## Single lever

For every Jacobi pivot pair `p < q`, the previous loop visited all ascending
`k` except the two pivots and selected addresses through:

```ts
kp = k < p ? k * n + p : p * n + k;
kq = k < q ? k * n + q : q * n + k;
```

The new code expresses the same domain as three consecutive loops. The first
uses row `k` for both entries, the middle uses row `p` and row `k`, and the last
uses rows `p` and `q`. Row offsets for the fixed pivots are computed once.
There is no extra eigensolver state and no new allocation.

## Isomorphism proof

### Address and ordering equivalence

Because `p < q`, every non-pivot `k` is in exactly one ordered range:

1. `0 <= k < p`: `(kp, kq) = (k*n+p, k*n+q)`;
2. `p < k < q`: `(kp, kq) = (p*n+k, k*n+q)`;
3. `q < k < n`: `(kp, kq) = (p*n+k, q*n+k)`.

Concatenating those ranges produces the exact old ascending sequence with only
`p` and `q` omitted. A property audit checked every `n` from 1 through 128 and
every legal `(p,q,k)`: all 99,433,888 sequence, membership, and canonical-address
checks passed with zero failures.

### Floating-point identity

For each `k`, the same `akp` and `akq` entries are loaded and the following
expressions execute verbatim in the same order:

```ts
rotatedP = cosine * akp - sine * akq;
rotatedQ = sine * akp + cosine * akq;
```

Each matrix element is independent within a rotation, and `k` remains ascending,
so inter-element execution order is also unchanged. Integer index arithmetic is
the only computation moved or specialized. The pivot diagonal updates and
eigenvector rotations remain byte-for-byte unchanged.

### CMA-ES contract

- Ordering and tie-breaking: candidate generation, fitness/id sort, ranks, and
  strict best-point comparisons are untouched.
- RNG: seed initialization, Box-Muller draws, retry guards, and draw counts are
  untouched.
- Repair: phenotype repair and latent-genotype adaptation are untouched.
- Snapshots: covariance reconstruction, public clones, projection alignment,
  and history ownership are untouched.
- Golden outputs: dimensions 1, 2, 4, 8, 12, 24, and 48 are byte-identical to
  the authoritative files, and all stored SHA-256 checksums pass.

## Performance evidence

### Focused Jacobi pair

The fixed 24-D symmetric, strictly diagonally dominant matrix benchmark used
500 warmups followed by 40 trials of 1,000 decompositions.

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 74.1820 ms | 63.5158 ms | -14.38% |
| p95 | 76.6740 ms | 66.2820 ms | -13.55% |
| p99 | 86.4831 ms | 67.0964 ms | -22.42% |
| Throughput | 13,349.3 calls/s | 15,659.0 calls/s | +17.30% |
| Checksum | 140898.44266593037 | 140898.44266593037 | exact |

### Integrated workload

Two fresh accepted-source runs measured p95 at 71.9240 and 68.5141 ms. The
candidate run with the identical dimension, generations, 150 trials, warmups,
and seed schedule measured 53.0901 ms p95 and 62,941 evaluations/s. Against the
closer accepted-source result, p95 improved 22.51% and throughput improved
14.36%. Checksums were exact.

The fresh-process wall results had visible host variance, so retention does not
rest on that pair alone. The matched sampled profile independently shortened the
same workload from 10.27 to 8.49 seconds (-17.33%); Jacobi self attribution fell
from 4.20 to 3.09 seconds (-26.43%) and total attribution fell from 4.37 to 3.25
seconds (-25.63%). The focused pair and integrated profile both move the targeted
region well beyond the campaign's 4.8% noise envelope.

## Memory and quality gates

Peak RSS was 83,197,952 bytes, below the 90,166,067-byte campaign guardrail.
The retained change adds no allocation or persistent state.

- Seven-dimensional byte comparison and authoritative checksum verification: pass.
- Address/order property audit: 99,433,888 pass, 0 fail.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- `bun typecheck`: pass.
- `bun lint`: pass; only the pre-existing browser-data age advisory appeared.
- No `format` script exists in `package.json`; lint passed on the edited source.
- `ubs app/lib/cmaesEngineND.ts`: zero critical findings attributable to the change.
- `git diff --check`: pass.

## Files generated

- `pass-19-{before,before-repeat,after-matched,after}.json` — integrated timing evidence.
- `pass-19-{before,after}-profile-workload.json`, CPU profiles, and Markdown
  summaries — matched fresh profiles.
- `pass-19-focused-{before,after}.json` — focused Jacobi evidence.
- `pass-19-golden-dim-{1,2,4,8,12,24,48}.json` — fresh exact outputs.
- `pass-19-address-properties.json` — exhaustive traversal proof.
- `pass-19-rss-workload.json` and `pass-19-rss.txt` — memory evidence.
- `pass-19-profile-summary.json`, `pass-19-gates.json`, and this report.

`.skill-loop-progress.md` was not modified. No file was deleted, no destructive
command was used, and no commit was made.

## Orchestrator verification

The orchestrator independently checked every range boundary against the old
canonical-upper address expressions. The concatenated ranges retain ascending
`k` order with only `p` and `q` omitted; every loaded/stored element and every
floating-point expression is unchanged. The root representative rerun recorded
p95 52.486541999999986 ms, 63,359.219 evaluations/s, and the exact checksum
12274.303979858667. The focused tests and `git diff --check` passed before
commit.
