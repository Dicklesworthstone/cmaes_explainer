# Pass 11 — final-rank mean-shift fusion

Date: 2026-08-27

## Decision

Accepted. The final positive-recombination rank now constructs the normalized
mean shift immediately after performing each coordinate's last weighted
addition. This removes the standalone shift `map` traversal and callback while
retaining the same two numeric arrays and every arithmetic operation.

The representative p95 improved from 60.58375000000069 ms to
58.236291999999594 ms (-3.8747320857508316%), which remains inside the 4.8%
same-seed envelope and is therefore not sufficient by itself. Independent
focused evidence is material: p95 improved 17.948583494201543%, throughput
rose 21.871167141048907%, and a matched 20-million-call profile shortened the
kernel by 18.134262763911046% while eliminating the native shift `map`.

The accepted engine SHA-256 is
`3f7087307f038ddb4f139c9269e88e38b6d2e291321f7f3390fd378a34d3efde`.

## Fresh profile and opportunity score

The untouched 24-D integrated profile used 250 generations, 150 measured
trials, ten warmups, the fixed seed schedule, and a 500 microsecond sampling
interval. It ran for 9.51 seconds and recorded 12,319 samples. The rank-major
mean recombination loop had 34.6 ms / 0.3% directly sampled self-time, and the
immediately following mean-shift construction used a native `map` and callback.

Opportunity score:

```text
(impact 1 × confidence 5) / effort 1 = 5.0
```

Impact is one because the complete region is under 5% of the integrated
workload. Confidence is five because both the fresh profile and the exact
source traversal identify the removable standalone shift pass. Effort is one
because the edit peels the already-required final rank within one local block.
The score exceeds the required threshold of 2.0.

## Single lever

Before the change, recombination performed `mu × dim` weighted additions and
then `mean.map(...)` visited all `dim` coordinates again to allocate and fill
the normalized shift. After the change, ranks `0..mu-2` retain the existing
loop and rank `mu-1` retains the same loop body while also writing the shift
after each coordinate's final addition.

For the 300-trial representative workload, this removes 75,000 standalone map
invocations and 1,800,000 standalone coordinate visits. It does not remove or
add any weighted multiplication, weighted addition, subtraction, division, or
numeric array. No path, whitening, covariance, Jacobi, sampling, projection,
snapshot, or public API code changed.

## Isomorphism proof

### Weighted floating-point order

For every coordinate, the old code initialized positive zero and added ranks
`0, 1, ..., mu-1`. The new code initializes the same positive zero, adds ranks
`0, 1, ..., mu-2` in the unchanged loop, then executes the textually identical
weighted addition for rank `mu-1`. The shift subtraction and division execute
only after that last addition, using the same `oldMean[dimension]` and
`oldSigma`. Operand values and IEEE-754 operation order are identical.

### Ownership, adaptation, paths, and snapshots

- `oldMean` remains a clone of the pre-step public mean; it is not transferred,
  mutated, or aliased with the new mean.
- `this.mean` remains a newly allocated zero-filled vector and is completely
  recombined before any downstream use.
- `adaptationPoint` is called once per positive rank in the same rank order;
  `none`, `clip`, and `reflect` therefore retain their prior genotype/phenotype
  selection.
- `meanShift` remains a new dimension-sized array, fully initialized before
  the unchanged whitening call. `pSigma`, its norm, `hSigma`, and `pC` receive
  bit-identical inputs.
- Candidate ordering and fitness/id tie-breaking occur earlier and are
  unchanged. RNG draws and seeds are unchanged.
- Snapshot construction occurs later and retains separate mean/path arrays.
  Three steps across dimensions 1, 2, and 24 for every repair strategy passed
  243 exact arithmetic, ownership, adaptation, path, history, and prior-state
  stability checks.

### Golden proof

Fresh outputs at dimensions 1, 2, 4, 8, 12, 24, and 48 were byte-identical to
the authoritative outputs. All seven authoritative SHA-256 checks passed.

## Paired representative evidence

Both sides used:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 57.769625000000815 ms | 56.634540999999444 ms | -1.9648457126065% |
| p95 | 60.58375000000069 ms | 58.236291999999594 ms | -3.8747320857508316% |
| p99 | 63.595250000000306 ms | 62.52204199999869 ms | -1.687559998587329% |
| Throughput | 55,935.05470134075 eval/s | 57,129.27530177098 eval/s | +2.135012840885997% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

The wall-time movement is directionally favorable but remains inside the
noise envelope, so retention rests on the independent focused evidence.

## Focused and region evidence

The paired focused benchmark used dimension 24, lambda 13, mu 6, one million
kernel calls per trial, 40 measured trials, and five warmups. Both kernels used
identical deterministic inputs and retained both output arrays.

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 139.70899999999983 ms | 114.65162499999997 ms | -17.935405020435258% |
| p95 | 143.1234169999998 ms | 117.43479100000059 ms | -17.948583494201543% |
| p99 | 151.7026249999999 ms | 123.52204099999972 ms | -18.576200642540098% |
| Throughput | 7,134,187.03414849 calls/s | 8,694,517.004542146 calls/s | +21.871167141048907% |
| Checksum | -56998128.03421667 | -56998128.03421667 | exact |

Matched 250 microsecond profiles over 20 million calls took 2,910.982916 ms
before and 2,383.097625 ms after (-18.134262763911046%). The before profile
attributed 69.1 ms self-time to native `map`; the after profile contains no
`map` entry. Checksums remained exact.

The matched integrated after profile also remained directionally favorable:
profiled throughput rose 1.4970162536061205% and p95 fell
1.4721744030236628%, with an exact workload checksum. No integrated improvement
inside the noise envelope is counted as independent acceptance evidence.

## Memory and quality gates

The campaign-matched 100-trial RSS run recorded 82,198,528 bytes, below the
90,166,067-byte guardrail.

- Candidate outputs matched all seven authoritative goldens byte-for-byte.
- `shasum -a 256 -c golden_checksums.txt`: all seven authoritative files `OK`.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- Mean/path/ownership/adaptation audit: 243 checks passed.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing
  `baseline-browser-mapping` age advisory was emitted.
- No format script exists in `package.json`; the scoped block matches existing
  formatting and lint passed.
- `ubs app/lib/cmaesEngineND.ts`: exit 0, zero critical findings; broad
  cross-language heuristic notices were pre-existing and unrelated.
- `git diff --check`: pass.

## Files generated

- `pass-11-{before,after}.json` — paired representative evidence.
- `pass-11-{before,after}-profile-workload.json`, CPU profiles, and Markdown
  reports — matched integrated profiles.
- `pass-11-{before,after}-focused.json` — paired focused measurements.
- `pass-11-{before,after}-focused-profile-workload.json`, CPU profiles, and
  Markdown reports — matched focused profiles.
- `pass-11-golden-dim-{1,2,4,8,12,24,48}.json` — fresh exact outputs.
- `pass-11-ownership-adaptation-properties.json` — 243 focused invariants.
- `pass-11-rss-matched-workload.json` and `pass-11-rss-matched.txt` — matched
  memory guardrail evidence.
- `pass-11-profile-summary.json`, `pass-11-gates.json`, and `pass-11.md` —
  structured summary, gates, and this report.

`.skill-loop-progress.md` and the campaign ledger were not modified. No file
was deleted, no destructive command was used, and no commit was made.

## Orchestrator verification

The orchestrator reviewed the final-rank summation-order and ownership proof, inspected the confined diff, reran 16 tests/157 assertions and all seven authoritative golden checksums, and independently measured 150 representative trials at p50 56.90 ms, p95 59.20 ms, p99 63.94 ms, and 56,877 evaluations/s with exact checksum. Typecheck, scoped lint, UBS, and `git diff --check` passed. The accepted regional win is upheld.
