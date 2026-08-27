# Pass 12 — indexed in-place evolution paths

Date: 2026-08-27

## Decision

Accepted. The pSigma update now writes its owned live path by index and accumulates
the squared norm in the same coordinate order. After the unchanged hSigma
decision, pC is updated by index. This removes the two path `map` callbacks and
their replacement arrays plus the standalone norm traversal, without changing
any pSigma or pC recurrence arithmetic.

The representative p95 moved from 58.669083 ms to 60.965416999999434 ms
(+3.9140444721105205%). That unfavorable movement remains inside the campaign's
4.8% same-seed envelope and is not acceptance evidence. The independent focused
pair is material: p95 improved 65.55243937297949%, throughput rose
180.6956913011792%, and the matched 30-million-call profile shortened 62.63209953159307%
while eliminating native `map` from the exact recurrence kernel. Checksums were
exact throughout.

The accepted engine SHA-256 is
`d6f169b0d6b8b053df1d827a8e38d5d4fe9baeba7d25e2fd5afe71e7dd95a44d`.

## Fresh profile and opportunity score

The untouched pass-11 engine was profiled at dimension 24 for 250 generations,
150 measured trials, ten warmups, the fixed seed schedule, and a 500 microsecond
sampling interval. The 9.47-second profile recorded 14,637 samples. Native
`map` owned 193.1 ms / 2.0% direct self-time and 432.9 ms / 4.5% total time;
the profile also sampled both path callbacks and `vecDot`/`vecNorm`.

Opportunity score:

```text
(impact 1 × confidence 5) / effort 1 = 5.0
```

Impact is one because the integrated region is under 5%. Confidence is five
because the fresh profile and source both expose two replacement path arrays,
two callbacks, and a standalone norm pass. Effort is one because the edit is
confined to the existing path block. The score exceeds the required threshold
of 2.0.

## Single lever

Before the change, pSigma `map` allocated a replacement path and invoked a
callback for every coordinate; `vecNorm` then traversed the completed path;
after hSigma, pC `map` allocated another replacement path and invoked another
callback. The retained implementation updates both live owned paths by index
and accumulates the pSigma squared norm in coordinate order as each updated
value becomes available.

Across the 300-trial representative workload's 75,000 generations, this removes
150,000 transient path arrays, 150,000 higher-order callbacks, 3,600,000 callback
coordinate visits, and 1,800,000 standalone norm coordinate visits. No mean,
whitening, normalized-step, covariance, Jacobi, sampling, projection, snapshot,
or public API code changed.

## Isomorphism proof

### pSigma and norm

For each coordinate `0..dim-1`, the new loop evaluates the exact old expression
`(1 - cs) * oldPSigma[d] + pSigmaScale * whitenedMeanShift[d]` and stores the
result before proceeding. No pSigma coordinate depends on another coordinate.
The squared products use those bit-identical updated values, and their additions
begin from positive zero and occur in the same coordinate order as the former
`vecDot`. Interleaving each side-effect-free squared product after its coordinate
update cannot change any later path input. The final `Math.max`, `Math.sqrt`, and
pSigma norm are therefore exact.

### hSigma, pC, and sigma

`pathNormalizer`, the generation exponent, epsilon guard, chiN division, strict
threshold, and hSigma value are textually unchanged and receive the exact norm.
Only after that decision, pC visits coordinates `0..dim-1` and evaluates the
exact old expression `(1 - cc) * oldPC[d] + hSigma * pCScale * meanShift[d]`.
The later sigma expression is unchanged and receives the exact pSigma norm.

### Ownership, adaptation, and snapshots

- `pSigma` and `pC` are live optimizer-owned arrays. Neither is stored directly
  in a generation state: snapshot construction still clones both with spreads.
- Every prior generation state's path arrays stayed byte-for-byte stable across
  later in-place live-path updates, and each state remained the same object held
  by history.
- Candidate adaptation points, positive-rank order, mean/meanShift construction,
  whitening, and repair behavior are unchanged.
- Three steps across dimensions 1, 2, and 24 for `none`, `clip`, and `reflect`
  passed 270 exact recurrence, norm, sigma, adaptation, ownership, history, and
  prior-state checks.
- Candidate ordering and fitness/id tie-breaking occur earlier and are unchanged.
  RNG draws and seeds are unchanged.

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
| p50 | 56.63712499999929 ms | 58.281999999999925 ms | +2.904234634086139% |
| p95 | 58.669083 ms | 60.965416999999434 ms | +3.9140444721105205% |
| p99 | 65.54845899999987 ms | 64.46087500000067 ms | -1.6592060539504048% |
| Throughput | 56,992.1126458377 eval/s | 55,429.7125852494 eval/s | -2.741432082536432% |
| Checksum | 24940.517463897122 | 24940.517463897122 | exact |

This movement is inside the established noise envelope. Retention rests on the
independently isolated regional evidence below, not the representative wall time.

## Focused and profile evidence

The focused pair used dimension 24, one million calls per trial, 40 measured
trials, and five warmups. Both kernels used identical constants, deterministic
mean and whitened shifts, evolving path states, hSigma decisions, and retained
checksums.

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 77.81083400000034 ms | 27.870083000000022 ms | -64.18225898979581% |
| p95 | 81.77562500000022 ms | 28.169708000000014 ms | -65.55243937297949% |
| p99 | 87.27370900000005 ms | 28.232167000000004 ms | -67.65100587165375% |
| Throughput | 12,767,753.932267277 calls/s | 35,838,535.163811125 calls/s | +180.6956913011792% |
| Checksum | 361511841.782259 | 361511841.782259 | exact |

Matched 250 microsecond profiles over 30 million calls took 2,412.199791 ms
before and 901.3884169999999 ms after (-62.63209953159307%). The before profile
attributed 2.16 seconds / 86.3% self-time to native `map`; the after profile has
no `map` entry. Checksums remained exactly `271135284.3679765`.

The matched integrated profile was likewise inside the noise envelope: profiled
p95 moved +4.283193791765439% and throughput -1.4545003847626812%, with exact
checksum. Its remaining native `map` samples belong to other unchanged sites.

## Memory and quality gates

The campaign-matched 100-trial RSS run recorded 86,163,456 bytes, below the
90,166,067-byte guardrail.

- Candidate outputs matched all seven authoritative goldens byte-for-byte.
- All seven candidate SHA-256 hashes matched the authoritative hashes.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- Path/adaptation/ownership audit: 270 checks passed.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing
  `baseline-browser-mapping` age advisory was emitted.
- No format script exists in `package.json`; the scoped block matches existing
  formatting and lint passed.
- `ubs app/lib/cmaesEngineND.ts`: exit 0, zero critical findings; broad
  cross-language heuristic notices were pre-existing and unrelated.
- `git diff --check`: pass.

## Files generated

- `pass-12-{before,after}.json` — paired representative evidence.
- `pass-12-{before,after}-profile-workload.json`, CPU profiles, and Markdown
  reports — matched integrated profiles.
- `pass-12-{before,after}-focused.json` — paired focused measurements.
- `pass-12-{before,after}-focused-profile-workload.json`, CPU profiles, and
  Markdown reports — matched focused profiles.
- `pass-12-golden-dim-{1,2,4,8,12,24,48}.json` — fresh exact outputs.
- `pass-12-path-adaptation-properties.json` — 270 focused invariants.
- `pass-12-rss-workload.json` and `pass-12-rss.txt` — memory guardrail evidence.
- `pass-12-profile-summary.json`, `pass-12-gates.json`, and `pass-12.md` —
  structured summary, gates, and this report.

`.skill-loop-progress.md` and the campaign ledger were not modified. No file was
deleted, no destructive command was used, and no commit was made.

## Orchestrator verification

The orchestrator reviewed the exact pSigma sum order, hSigma barrier, pC recurrence, and snapshot-cloning proof; reran 16 tests/157 assertions and all seven authoritative golden checksums; and independently measured 150 representative trials at p50 56.70 ms, p95 57.83 ms, p99 59.83 ms, and 57,332 evaluations/s with exact checksum. Typecheck, scoped lint, UBS, and `git diff --check` passed. The accepted regional win is upheld.
