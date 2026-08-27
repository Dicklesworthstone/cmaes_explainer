# Pass 14 — direct negative-rank Mahalanobis norms

Date: 2026-08-27

## Decision

Accepted. Negative covariance ranks no longer materialize a full whitened result
vector merely to take its squared norm. The new specialized kernel retains the
eigen-coordinate vector, reconstructs each result coordinate with the exact old
column-add sequence, and immediately folds that completed scalar into the norm
in the exact old `vecDot` row order.

The representative p95 was essentially flat, moving from
57.947416999999405 ms to 57.88987499999996 ms (-0.09930037088529131%),
inside the 4.8% same-seed envelope. Independent regional evidence is material:
focused p95 improved 28.421949194753438%, focused throughput rose
47.976253742866184%, the matched 2-million-call focused profile shortened
32.115%, and the integrated negative-rank call site fell from 453.5 ms to
305.6 ms (32.61300992282249%). Checksums were exact throughout.

The accepted engine SHA-256 is
`d040a5664ed94080af743cdab85f8b71617ab9e351015e48bfea7646c96c7799`.

## Fresh profile and opportunity score

The untouched accepted pass-12 engine was profiled at dimension 24 for 250
generations, 150 measured trials, ten warmups, the fixed seed schedule, and a
500 microsecond interval. The 9.73-second profile recorded 12,475 samples. The
negative-rank whitening call site owned 453.5 ms / 4.6% total time. The separate
mean-shift whitening call site owned 79.6 ms / 0.8% total time.

Opportunity score:

```text
(impact 1 × confidence 5) / effort 1 = 5.0
```

Impact is one because the eligible negative-rank call site is under 5% of the
integrated profile. Confidence is five because the call site and its transient
result vector plus subsequent `vecDot` are directly visible in source and the
fresh profile. Effort is one because the lever is confined to the existing
whitening/norm block. The score exceeds the required threshold of 2.0.

## Single lever

Before the change, each negative rank called `whitenWithEigensystem`, which
allocated and filled both an eigen-coordinate vector and a result vector,
performed column-major reconstruction into that result, and then sent it
through a standalone `vecDot`. The retained implementation uses a specialized
Mahalanobis-squared kernel. It still materializes the eigen coordinates, but it
keeps each reconstructed result coordinate scalar locally and adds its square
to the norm immediately.

For the 300-trial representative workload, 75,000 generations and seven
negative ranks per generation mean this removes 525,000 transient 24-element
result arrays, 12.6 million result-slot initializations, and 12.6 million later
result reads by the standalone norm traversal. It also changes dense result
traffic from repeated array updates to one local scalar per row. Normalized
steps remain materialized exactly once; pass 13's rejected recomputation is not
reintroduced.

Mean-shift whitening remains on `whitenWithEigensystem` because pSigma consumes
the full whitened vector. No pSigma, hSigma, pC, sigma, covariance triangle,
Jacobi, mean, sampling, projection, snapshot, or public API arithmetic changed.

## Isomorphism proof

### Eigen coordinates

Both kernels visit eigen columns `0..dim-1`. Within each column they initialize
`coordinate` to positive zero, visit rows `0..dim-1`, and evaluate
`coordinate += eigenvectors[row][column] * vector[row]`. Both then evaluate
`coordinate / Math.sqrt(eigenvalues[column])`. The complete eigen-coordinate
vector is therefore bit-identical.

### Reconstructed coordinates and squared norm

For any fixed result row, the old column-outer loop initialized the row to
positive zero and applied
`result[row] += eigenvectors[row][column] * eigenCoordinates[column]` for
columns `0..dim-1`. The new row-outer loop initializes one local scalar to
positive zero and applies that identical multiplication/addition sequence for
the same columns. Completing independent rows contiguously changes only the
interleaving of unrelated state; no row reads or affects another row.

After each local row is complete, the new loop evaluates
`squaredNorm += coordinate * coordinate`. Rows are visited `0..dim-1`, starting
from positive zero, exactly matching the former `vecDot(result, result)`
multiply/add order. Thus every result scalar and the final squared norm are
bit-identical; this does not invoke the approximate orthonormal identity
`||B D^-1 B^T x|| = ||D^-1 B^T x||`.

### Negative weights and guards

Negative ranks are visited in the same order. The `weight >= 0` skip, strict
`mahalanobisSquared > 0` guard, zero fallback, and left-to-right
`weight * dim / mahalanobisSquared` arithmetic are textually unchanged and
receive the exact old norm. Positive finite eigenvalue production and its
Jacobi guards are untouched. The focused property audit covered exact norms,
exact adjusted negative weights, positive/finite norms, and the zero-norm guard
for all three repair strategies at dimensions 1, 2, and 24 across three steps.

### Mean-shift whitening and paths

Mean-shift whitening still returns the full vector from the unchanged helper.
The pSigma input, pSigma recurrence and norm, hSigma barrier, pC recurrence, and
sigma update passed exact reference checks. The audit also proved state/history
identity, path snapshot separation, and prior-state stability. Candidate
ordering, fitness/id tie-breaking, RNG seeds and draw order, adaptation-point
selection, normalized-step subtraction/division, and snapshots are unchanged.

### Golden proof

Fresh outputs at dimensions 1, 2, 4, 8, 12, 24, and 48 were byte-identical to
the authoritative outputs, and all seven candidate SHA-256 values match the
authoritative hashes.

## Paired representative evidence

Both sides used:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 56.49199999999928 ms | 55.70945799999981 ms | -1.3852262267214366% |
| p95 | 57.947416999999405 ms | 57.88987499999996 ms | -0.09930037088529131% |
| p99 | 62.09354200000007 ms | 64.24908400000095 ms | +3.4714431333308093% |
| Throughput | 57,292.885011802544 eval/s | 58,045.52241039047 eval/s | +1.3136664324599368% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

This movement is inside the established noise envelope. Retention rests on the
independently isolated regional evidence below.

## Focused and profile evidence

The alternating focused pair used dimension 24, 13 deterministic vectors,
10,000 calls per trial, 40 measured trials, and five warmups. The reference
kernel retained the old result array and standalone dot traversal.

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 11.860374999999976 ms | 7.972999999999956 ms | -32.77615589726318% |
| p95 | 12.04600000000002 ms | 8.622292000000016 ms | -28.421949194753438% |
| p99 | 12.952916000000016 ms | 8.864417000000032 ms | -31.564313394759758% |
| Throughput | 840,287.2159684006 calls/s | 1,243,425.5428702664 calls/s | +47.976253742866184% |
| Checksum | 8278122.619869774 | 8278122.619869774 | exact |

Matched 250 microsecond profiles over two million calls took
2,538.6822909999996 ms before and 1,723.377792 ms after
(-32.11526317768762%). Their
checksums remained exactly `41385745.90040039`.

The matched integrated profile reduced the negative-rank call site from
453.5 ms / 4.6% total to 305.6 ms / 3.3% total. The mean-shift call remained a
separate unchanged-vector path. Profiled workload checksums remained exactly
`12274.303979858667`.

## Memory and quality gates

The campaign-matched 100-trial RSS run recorded 81,690,624 bytes, below the
90,166,067-byte guardrail.

- Candidate outputs matched all seven authoritative goldens byte-for-byte.
- All seven candidate SHA-256 hashes matched the authoritative hashes.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- Negative-weight/path audit: 702 checks passed, 0 failed.
- `bun typecheck`: pass.
- `bun lint`: pass; only the pre-existing `baseline-browser-mapping` age
  advisory was emitted.
- No format script exists in `package.json`; the edited block follows existing
  formatting and full lint passed.
- `ubs app/lib/cmaesEngineND.ts`: exit 0, zero critical findings; broad
  cross-language heuristic notices were unrelated.
- `git diff --check`: pass.

## Files generated

- `pass-14-{before,after}.json` — paired representative evidence.
- `pass-14-{before,after}-profile-workload.json`, CPU profiles, and Markdown
  reports — matched integrated profiles.
- `pass-14-focused-pair.json` — alternating focused measurements.
- `pass-14-{before,after}-focused-profile-workload.json`, CPU profiles, and
  Markdown reports — matched focused profiles.
- `pass-14-golden-dim-{1,2,4,8,12,24,48}.json` — fresh exact outputs.
- `pass-14-negative-weight-path-properties.json` — 702 focused invariants.
- `pass-14-rss-workload.json` and `pass-14-rss.txt` — memory guardrail evidence.
- `pass-14-profile-summary.json`, `pass-14-gates.json`, and `pass-14.md` —
  structured summary, gates, and this report.

`.skill-loop-progress.md` and the campaign ledger were not modified. No file was
deleted, no destructive command was used, and no commit was made.

## Orchestrator verification

The orchestrator independently inspected the retained source diff and verified
the arithmetic-order proof: every reconstructed row retains its ascending-column
addition order and the squared norm retains its ascending-row addition order.
The root representative rerun recorded p95 57.16424999999981 ms with checksum
12274.303979858667. The focused CMA-ES tests, TypeScript typecheck, lint, UBS,
and `git diff --check` all passed before the pass was committed.
