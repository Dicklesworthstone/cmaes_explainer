# Pass 16 — projection eligibility audit

Date: 2026-08-27

## Decision

Rejected; production source is unchanged. The fresh profile proved that 3-D
projection and display-basis alignment are real work, but neither is a top-five
integrated hotspot. A one-traversal projection experiment produced an excellent
focused result and exact outputs, yet its representative p95 movement was only
-0.22%, inside the established 4.8% same-seed noise envelope, and the fresh
after-profile did not show lower `projectTo3D` attribution. The experiment was
therefore restored manually rather than retained.

The restored `app/lib/cmaesEngineND.ts` SHA-256 is
`c0a263476eb7b022d8327bf9afa7eae0498daefde604f43a0d490226b6015465`,
exactly the accepted pass-15 hash. `git diff -- app/lib/cmaesEngineND.ts` is
empty.

## Fresh profile and opportunity matrix

The accepted pass-15 source was freshly profiled at dimension 24 for 250
generations, 150 measured trials, ten warmups, the fixed seed schedule, and a
500 microsecond interval. The 9.14-second run recorded 11,870 samples. Its top
five self-time entries were the eigensolver (41.9%), rank-mu work in `step`
(19.0%), sampling transform (4.5%), covariance reconstruction (4.2%), and
provisional covariance setup in `step` (3.5%).

The largest `projectTo3D` call-tree node was 75.6 ms / 0.8% total and the
largest projection self-time node was 27.3 ms / 0.2%. The largest sign-flip
alignment self-time node was 42.4 ms / 0.4%. Neither subsystem was in the top
five.

| Opportunity | Impact | Confidence | Effort | Score | Decision |
|---|---:|---:|---:|---:|---|
| Fuse the three independent coordinate reductions | 1 | 5 | 1 | 5.0 | Ineligible: not a top-five hotspot; experiment rejected |
| Further sign-alignment work after pass 15 | 1 | 5 | 3 | 1.67 | Below score threshold and ownership-sensitive |

The low-effort arithmetic score alone is not sufficient: the skill's
pre-implementation checklist also requires the target to be a top-five
hotspot. The profile disproved that precondition.

## Three concrete projection checks

1. **Call-site/dataflow audit.** Each generation projects the population plus
   `pC` and `pSigma`—15 calls in the dimension-24 workload. The basis is the
   updated eigensystem's aligned private clone. Candidate tuples, both path
   tuples, and the basis-continuity field have distinct ownership boundaries.
2. **Alignment audit.** Alignment already visits only the first
   `min(3, dim)` columns. Its prior-basis dot products and strict
   `agreement < 0` branch prevent arbitrary eigenvector sign changes from
   making the visualization jump. The eigensolver-owned matrix must remain
   unmodified, so the remaining first clone cannot be removed safely.
3. **Projection audit.** The three coordinate reductions are independent, but
   each must preserve ascending row order for binary64 identity. Public vector
   and basis validation, dimensions 1 and 2 returning positive zero for missing
   axes, dynamic method dispatch, and fresh tuple ownership are also observable
   contracts.

## Rejected single-lever experiment

The experiment replaced three column-outer reductions with one row-outer,
explicitly unrolled traversal. Each X, Y, and Z accumulator still visited rows
in the same ascending order; only independent additions were interleaved.
Validation, missing-axis behavior, method dispatch, and return allocation were
unchanged.

### Isomorphism proof

- **Ordering:** each coordinate evaluated the same multiplication and addition
  sequence for rows `0..dim-1`.
- **Tie-breaking:** N/A; projection does not rank candidates.
- **Floating-point:** binary64-identical for each coordinate because no
  accumulator's operand order changed. Dimensions 1 and 2 retained untouched
  `+0` accumulators for missing axes.
- **RNG:** untouched; projection runs after sampling and optimizer-state
  adaptation.
- **Ownership:** every call still constructed a fresh three-element tuple.
- **Validation:** the finite-vector and square-basis checks and messages were
  unchanged.

The dedicated property audit ran 6,011 checks with zero failures across direct
random matrices in dimensions 1, 2, 3, 4, 8, 24, and 48; signed zero and
subnormals; both validation errors; and in-step calls across five dimensions,
three seeds, three repair modes, and five generations. All candidate and path
projections matched the independent old reduction with `Object.is`, and every
returned tuple had a fresh identity.

All seven fresh CMA-ES outputs were byte-identical to the authoritative
goldens:

| Dimension | SHA-256 |
|---:|---|
| 1 | `23ef87b503f394ff00a20bee762b4234213aac38ada056b043e070e094b31487` |
| 2 | `e1d72f4da093e8ee25400b064f3da984cb57859117d59fd3b7ca25389be4edc1` |
| 4 | `a3d92162d82e89c9949f348b7be548566dc7fd945c75cf27ec8494eb0c5bf047` |
| 8 | `50730f90a2a2a3bc4211081a5b1520d37006b1b7cb62bc7355a0c65e07d3d1a8` |
| 12 | `244ba862f7b77e01efdcdd299c9f50f2b99031574c0a12f2bdb60bd8281f7ac1` |
| 24 | `0e614b1a75d1556271e69ad207b5508319fa1e53761c539dcb6e44b3f03e24dd` |
| 48 | `7d8013ecd48a4c1c55af6efe8bc2545d606b362a70ebb77489eb1c51a061322a` |

## Measurements

The paired representative commands both used dimension 24, 250 generations,
300 measured trials, ten warmups, and seed 1729.

| Metric | Before | Experiment | Change |
|---|---:|---:|---:|
| p50 | 55.713667 ms | 55.140666 ms | -1.03% |
| p95 | 58.114167 ms | 57.987000 ms | -0.22% |
| p99 | 63.709958 ms | 61.864958 ms | -2.90% |
| Throughput | 57,963.76 eval/s | 58,634.07 eval/s | +1.16% |
| Checksum | 24,940.517463897122 | 24,940.517463897122 | exact |

Every representative movement is inside the noise envelope.

The alternating focused harness used 100,000 projections per side per trial,
60 trials, and eight warmups at dimension 24.

| Metric | Before | Experiment | Change |
|---|---:|---:|---:|
| p95 | 19.156166 ms | 6.717458 ms | -64.93% |
| Throughput | 5,299,962 calls/s | 15,388,754 calls/s | +190.36% |
| Checksum | 3,415,146.667498315 | 3,415,146.667498315 | exact |

This proves the isolated traversal is faster, but isolated speed does not make
a cold integrated region eligible. In the paired integrated profiles, overall
duration moved from 9.14 to 8.99 seconds, while the largest self-time node
attributed to `projectTo3D` moved from 27.3 ms / 0.2% to 79.5 ms / 0.8% after
the source-layout/JIT change. Attribution did not independently validate a
projection win, so the conservative decision is rejection.

The experiment's peak RSS was 74,203,136 bytes, below the 90,166,067-byte
guardrail. This measurement is retained for completeness but is not evidence
for keeping the source change.

## Quality gates and restoration

- Fresh experiment outputs matched all seven authoritative goldens exactly.
- Projection/validation/ownership properties: 6,011 pass, 0 fail.
- `bun test`: 16 pass, 0 fail, 157 assertions.
- `bun typecheck`: pass.
- `bun lint`: pass; only the pre-existing `baseline-browser-mapping` age
  advisory appeared.
- No format script exists in `package.json`.
- `ubs app/lib/cmaesEngineND.ts`: exit 0, no critical findings; its broad
  cross-language scan emitted unrelated heuristic notices.
- After manual restoration, the focused test, typecheck, authoritative checksum
  verification, `git diff --check`, and empty production-source diff all passed.

## Files generated

- `pass-16-{before,after}.json` — representative old/experiment pair.
- `pass-16-{before,after}-profile-workload.json`, CPU profiles, and Markdown
  reports — fresh integrated profiles.
- `pass-16-focused-pair-results.json` — valid alternating focused evidence.
- `pass-16-projection-properties.json` — 6,011 exactness, validation, and
  ownership checks.
- `pass-16-golden-dim-{1,2,4,8,12,24,48}.json` — fresh exact outputs.
- `pass-16-rss-workload.json` and `pass-16-rss.txt` — experiment memory result.
- `pass-16-profile-summary.json`, `pass-16-gates.json`, and this report.

An initial `bun` stdin invocation wrote CLI help to
`pass-16-focused-pair.json`; the corrected run is the explicitly named
`pass-16-focused-pair-results.json`. The diagnostic artifact is retained to
honor the repository's no-deletion rule and is not performance evidence.

`.skill-loop-progress.md` was not modified. No file was deleted, no destructive
command was used, and no commit was made.

## Orchestrator verification

The orchestrator verified that the production engine has no diff and that its
SHA-256 is exactly the accepted pass-15 hash
`c0a263476eb7b022d8327bf9afa7eae0498daefde604f43a0d490226b6015465`.
The focused CMA-ES tests and `git diff --check` passed again. The pass is
recorded as rejected because a candidate was measured and disproved, rather
than as an accepted microbenchmark-only improvement.
