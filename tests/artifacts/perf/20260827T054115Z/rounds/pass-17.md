# Pass 17 — reuse the sampled Gaussian tuple

Date: 2026-08-27

## Decision

Accepted. The 2-D candidate hot loop now stores the tuple returned by
`sampleGaussian2D` directly as `CandidateSample.z`. Previously it destructured
that tuple, discarded it, and allocated a second `[z0, z1]` tuple with identical
elements for the public sample snapshot.

This is one allocation-removal lever. It changes neither CMA-ES mathematics nor
the exported sampler. The retained engine SHA-256 is
`490ae0499d9f01a6dd9e0bdf931d7a7f3dea18d53da57c651d6715017ba1e963`.

## Fresh 2-D profile and opportunity matrix

The pass profiled the actual 2-D engine before changing it. The mixed workload
ran 4,000 complete 60-generation interactive optimizations over Rosenbrock,
Rastrigin, cigar, and Ackley, with the population sizes used by the demos and a
mix of active/passive covariance, reflection/clipping, and noisy/noiseless
ranking. The profiler sampled every 500 microseconds.

| Region | Before evidence | Impact | Confidence | Effort | Score | Decision |
|---|---:|---:|---:|---:|---:|---|
| Reuse the sampler-owned `z` tuple | Gaussian pair sampler 196.5 ms / 10.0%; caller candidate-generation region 366.2 ms / 18.7% | 2 | 5 | 1 | 10.0 | Implemented |
| Cache an eigensystem across generations | `atan2` 104.9 ms / 5.3% | 2 | 3 | 4 | 1.5 | Ineligible: public `C` is mutable and recomputation defines current rounding |
| Replace the stable full sort | native sort 179.3 ms / 9.1% | 2 | 2 | 4 | 1.0 | Ineligible: must preserve all public ranks/order and stable ties |

The retained lever is in a top-five aggregate region and scores above the
required 2.0 threshold. The other tempting regions were left unchanged.

## Single lever

Before:

```ts
const [z0, z1] = sampleGaussian2D(this.rng);
// ...
z: [z0, z1],
```

After:

```ts
const z = sampleGaussian2D(this.rng);
const z0 = z[0];
const z1 = z[1];
// ...
z,
```

For a generation with population `lambda`, this removes exactly `lambda`
short-lived two-element arrays. The required public `z` arrays still exist and
remain unique per candidate.

## Isomorphism proof

### Floating-point and RNG order

`sampleGaussian2D` is unchanged. It still calls `nextOpenUnit` and then
`nextHalfOpenUnit`, and evaluates the Box-Muller magnitude, angle, cosine, and
sine in the same order. `z0` and `z1` read the same two already-computed
binary64 numbers. No arithmetic was added, removed, reassociated, or reordered.

The noise draw remains after the objective call. Seed initialization, LCG state
updates, retry behavior for invalid random values, and every random-call count
are unchanged.

### Ordering, ranking, ties, and adaptation

Candidate construction order, objective calls, `fitness` comparison, stable
sort behavior, rank assignment, strict best-point comparison, recombination,
path updates, Mahalanobis normalization, covariance repair, and sigma adaptation
are untouched. Four constant-objective seed checks confirmed that public
candidate IDs and ranks retain ask order for exact ties.

### Ownership and public snapshots

The discarded tuple had no observer before this change. The returned sampler
tuple was local to `step`, and it now becomes the exact public `z` vector that
the second allocation previously copied. Each sampler call returns a fresh
tuple, so candidates do not share `z`. `rawX` and repaired `x` remain separately
allocated. The optimizer never reads a candidate's `z` after candidate
construction, so mutating a returned/history sample's `z` cannot alter later
optimizer state. Mutation checks covered `none`, `reflect`, and `clip` repair.

### Golden outputs

Six 80-generation runs covered every curated objective, active and passive
covariance, all three repair strategies, noisy and noiseless ranking, and six
seeds. The artifacts include every generation snapshot and final private state.
Before and after are byte-identical and both hash to:

`c85f373e73222902c931e9d5b5f5a6388c27a0ca5b6dd12f308cee67fff04d9a`

## 2-D versus canonical ND/reference audit

The specialized 2-D engine and the canonical ND engine were compared over eight
population sizes from 2 through 40, active/passive modes, all three repair
strategies, and five seeds:

- logarithmic positive/negative weights and `mueff` values are exact;
- `cc`, `cs`, `c1`, `cmu`, damping, `chiN`, and active-weight scaling are exact;
- first-generation RNG draws, candidates, repaired phenotypes, fitness values,
  ranks, mean, paths, sigma, and best-point tracking are exact;
- analytical 2x2 versus Jacobi covariance repair differs only by expected
  binary64 decomposition rounding, at most `2e-13` in the audit; and
- negative-weight Mahalanobis normalization, `hSigma`, covariance decay,
  objective-transform rank invariance, and boundary adaptation contracts remain
  unchanged.

The audit executed 30,255 checks with zero failures. The existing local
reference audit remains accurate: the 2-D core follows Hansen's active-CMA
defaults while intentionally retaining the explainer's small synchronous API,
simple boundary demonstrations, and explicit generation budgets.

## Performance evidence

Two source-switched integrated repetitions used the real Rosenbrock explainer
preset. Each measured group contains twenty fresh 60-generation runs, with 200
groups and 100 warmups.

| Pair | Before p95 | After p95 | Change | Before eval/s | After eval/s | Change |
|---:|---:|---:|---:|---:|---:|---:|
| A | 9.099542 ms | 7.095125 ms | -22.03% | 3,105,725 | 3,516,392 | +13.22% |
| B | 7.500667 ms | 6.824583 ms | -9.01% | 3,160,331 | 3,500,299 | +10.76% |

Both integrated checksum pairs are exact. An earlier ungrouped 600-trial pair
also moved from 0.605833 to 0.489709 ms at p95 (-19.17%) and from 2.369 to
2.731 million evaluations/second (+15.28%), with exact checksums.

The alternating focused benchmark performed the complete pair-sampling and
candidate-construction lifecycle 100,000 times per trial for 40 trials while
forcing candidate objects to escape through a ring buffer.

| Metric | Before | After | Change |
|---|---:|---:|---:|
| p50 | 4.803458 ms | 4.327250 ms | -9.91% |
| p95 | 5.180792 ms | 4.742417 ms | -8.46% |
| throughput | 20,679,209 calls/s | 22,510,851 calls/s | +8.86% |
| checksum | 922175.8353364163 | 922175.8353364163 | exact |

The fresh after-profile used the identical mixed workload. Total profiled
duration moved from 1.95 to 1.43 seconds; candidate-generation attribution moved
from 366.2 to 215.2 ms. Since statistical attribution shifts with the faster
program, retention rests on the exact proof plus the two source-switched
integrated pairs and alternating focused measurement, not on one profile total.

## Memory and quality gates

Peak RSS was 61,685,760 bytes, below the campaign guardrail of 90,166,067
bytes. The source change eliminates allocations and introduces no retained
state.

- Golden byte comparison: pass.
- Property/reference/ownership audit: 30,255 pass, 0 fail.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- Curated convergence and objective-transform metamorphic checks: pass.
- `bun typecheck`: pass.
- `bun lint`: pass; only the pre-existing browser-data age advisory appeared.
- No `format` script exists in `package.json`; the four-line source edit follows
  existing formatting and full lint passed.
- `ubs app/lib/cmaesEngine.ts`: exit 0, no critical finding attributable to the
  change; broad cross-language heuristic notices were unrelated.
- `git diff --check`: pass.

## Files generated

- `pass-17-{before,after}.json` — initial real-workload pair.
- `pass-17-{before,after}-profile-workload.json`, CPU profiles, and Markdown
  reports — fresh mixed 2-D profiles.
- `pass-17-integrated-{baseline,candidate}-{a,b}.json` — two source-switched
  integrated repetitions.
- `pass-17-focused-pair.json` — alternating focused evidence.
- `pass-17-golden-{before,after}.json` — byte-identical full-state oracle.
- `pass-17-properties.json` — reference, tie, repair, and ownership audit.
- `pass-17-rss-workload.json` and `pass-17-rss.txt` — memory evidence.
- `pass-17-profile-summary.json`, `pass-17-gates.json`, and this report.

Rollback after the orchestrator commits this pass is a normal `git revert` of
that pass commit. A manual source-only rollback replaces `const z` plus indexed
reads with tuple destructuring and restores `z: [z0, z1]`; the focused tests and
golden comparison are the required post-rollback checks.

`.skill-loop-progress.md` was not modified. No file was deleted, no destructive
command was used, and no commit was made.

## Orchestrator verification

The orchestrator independently traced tuple ownership. Each sampler call
creates a fresh two-element vector; `rawX` and `x` remain separate allocations;
the optimizer does not subsequently mutate or consume `candidate.z`; and no two
candidates share the vector. The retained edit therefore removes only the
discarded duplicate allocation. The focused CMA-ES tests and `git diff
--check` passed again before commit.
