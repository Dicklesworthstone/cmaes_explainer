# Pass 18 — FrankenSim/WASM adapter audit

Date: 2026-08-27

## Decision

Rejected; no production source change remains. The only attempted lever was
binary64-exact, but two fresh integrated measurements showed a large, repeatable
regression. `app/lib/frankensimCmaes.ts` was restored byte-for-byte to the
accepted pass-17 source. Both the working file and `git show
12da6ec:app/lib/frankensimCmaes.ts` hash to:

`d317b977e333d10b8c4ab83fed8be7a465f0da453eb9c810c985e0d86f7d263e`

The most important architecture result is that this adapter is not currently a
live optimization path. The committed bundle identifies itself as
`fs-cmaes-viz-wasm 0.2.0`, while `AUDITED_CMAES_KERNEL_VERSIONS` is deliberately
empty. Browser initialization therefore rejects the kernel and the internals lab
uses `CMAESOptimizerND`. An SSR fallback probe likewise returned
`source: "ts-fallback"`, `kernelSourceNow(): "ts-fallback"`, and a null run.
Pass 18 did not weaken that correctness gate.

## Actual boundary and ownership trace

The audited browser boundary is:

1. wasm-bindgen decodes the Rust-owned UTF-8 result into a JavaScript string and
   frees the WASM result allocation.
2. `runCmaesViz` parses the 573,714-byte JSON envelope into ordinary JavaScript
   arrays. There are no typed-array views or typed-array-to-array conversions in
   this adapter.
3. `wasmRunToNdStates` eagerly maps all 120 frames and 1,920 samples into the
   viewer contract. Each sample must own its returned `x`, `z`, and projected
   tuple; the current `rawX === x` alias is intentional because this kernel
   envelope exposes only one coordinate stream.
4. The full covariance is reconstructed because it remains part of the public
   state contract and its diagonal feeds `variancePerDim`. The current viewer
   reads the latter rather than the dense covariance directly, but dropping the
   public matrix would not be behavior-preserving.

The conversion is eager, so no state refers to mutable WASM memory. Parsed
generation arrays are separate across frames. The adapter reuses each parsed
generation's mean and path arrays in its returned state, but the kernel run is
already complete and no arrays are shared between generations; mutation cannot
affect optimizer evolution. Candidate `x` and `z` slices are unique per sample.

## Fresh profile

The real committed kernel produced the exact default internals-lab workload:
dimension 5, population 16, seed 1337, Rosenbrock landscape, active covariance,
and 120 generations. The adapter ran 5,000 times under Bun's V8-compatible CPU
profiler at a 500 microsecond interval.

| Region | Self/total time | Impact | Confidence | Effort | Score | Result |
|---|---:|---:|---:|---:|---:|---|
| Sample `projectPoint` and temporary tuple | 12.4% self | 2 | 5 | 1 | 10.0 | Attempted, then rejected by measurements |
| Per-sample `slice` ownership copies | 10.9% self | 2 | 5 | 4 | 2.5 | Required public ownership; no safe removal |
| Stable fitness ranking | 11.2% total | 2 | 3 | 4 | 1.5 | `se` is not sample-aligned; ordering/ties must be derived from `sf` |
| Dense covariance construction | 17.1% `Array.from` total | 2 | 3 | 4 | 1.5 | Public output plus exact reconstruction; not attempted after the one-lever trial |
| JSON string decode/parse boundary | 0.628 ms p50 / 0.697 ms p95 | 3 | 5 | 5 | 3.0 | Requires an audited Rust API/source change; generated artifacts were out of scope |

The first ungrouped adapter baseline was 0.408 ms p50 / 1.333 ms p95 and
215,999 converted generations/s. JSON parsing alone was 0.628 ms p50 / 0.697 ms
p95, confirming that the string envelope is a material boundary cost. It cannot
be changed safely in this TypeScript-only pass, and it has zero current-site
impact while the bundle remains rejected.

## Attempted single lever

The candidate wrote each sample projection directly into its final
`projected3D` tuple instead of allocating `p = projectPoint(...)` and then
allocating the final tuple. It would have removed exactly 1,920 intermediate
three-element arrays from the representative run.

### Isomorphism proof

- Ordering preserved: yes. Generations, samples, PCA rows, and dimensions were
  visited in the same order.
- Tie-breaking unchanged: yes. Ranking code was untouched.
- Floating-point: identical. Each `basis * (x - center)` multiply and ascending
  accumulation was unchanged; each coordinate then performed the same final
  subtraction from `projMean`.
- RNG seeds: unchanged; the adapter performs no random draws.
- Golden outputs: the 1,169,863-byte before and candidate outputs were
  byte-identical and both hashed to
  `08e768422934315892ad96d930f724717c84e111ccb4912fbae5dab31d40c7bc`.

### Why it was rejected

The runtime optimized the small helper more effectively than the larger inlined
mapper. Against one adjacent baseline, two independent candidate processes
recorded p95 regressions of 71.16% and 71.39%; throughput fell 30.50% and 30.16%.
The 5,000-call profiled workload slowed from 2,064.68 ms to 2,935.50 ms
(+42.18%). Candidate attribution moved into the enlarged anonymous map callback,
including 35.8% self-time at the inlined accumulation. Exact output is not
sufficient to retain a performance regression, so the source was restored.

## First-principles contract audit

The 24,104-check real-kernel audit covered dimensions 2 through 6, active and
passive covariance, bounded and unbounded runs, twelve frames per run, and
varying populations/seeds. It verified:

- the actual 0.2.0 bundle, known 0.2.1 identifier, and missing version all fail
  the compatibility gate;
- ask-order samples receive a complete stable rank permutation derived from
  finite-normalized fitness with ask index as the exact tie-breaker;
- full and projected spectra are exposed largest-first while covariance is
  reconstructed from the kernel's ascending eigensystem;
- covariance, per-coordinate variance, sample projection, final best point,
  sample ownership, frame isolation, and non-mutation of the source run;
- every parsed snapshot array is a normal JavaScript array rather than a live
  view into WASM memory.

All 24,104 checks passed. Existing focused tests additionally prove that earlier
frames do not leak the final best coordinate, projection spectra follow the
TypeScript contract, and every known reference-breaking kernel is rejected.

The compatibility decision remains correct: bundle 0.2.0 has a broken
`h_sigma` normalizer; 0.2.1 still uses noncanonical damping and incoherent
pre/post-update snapshot fields. Activating either would make the site's
optimization demonstration less trustworthy, not faster.

## Memory and quality gates

A fresh real-kernel generation plus one complete conversion peaked at
56,983,552 bytes RSS, below the 90,166,067-byte campaign guardrail.

- Real-run golden byte comparison: pass.
- Real-kernel property/ordering/ownership audit: 24,104 pass, 0 fail.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- `bun typecheck`: pass.
- `bun lint`: pass; only the pre-existing browser-data age advisory appeared.
- No `format` script exists in `package.json`; no source change remains.
- `ubs app/lib/frankensimCmaes.ts`: zero critical findings; broad heuristic
  notices were not attributable to this rejected candidate.
- `git diff --check`: pass.

## Files generated

- `pass-18-before.json` and `pass-18-integrated-{baseline,candidate,candidate-repeat}.json`
  — real-run timing evidence.
- `pass-18-{before,candidate}.cpuprofile*` and profile workload JSON — matched
  source profiles.
- `pass-18-golden-{before,after}.json` plus checksums — exact candidate oracle.
- `pass-18-properties.json` — 24,104 adapter and boundary checks.
- `pass-18-fallback-contract.json` — fail-closed runtime evidence.
- `pass-18-rss*`, `pass-18-profile-summary.json`, `pass-18-gates.json`, and this
  report — memory, structured conclusions, and quality results.

No production source remains modified. `.skill-loop-progress.md` was not
modified. No file was deleted, no destructive command was used, and no commit
was made.

## Orchestrator verification

The orchestrator verified that `frankensimCmaes.ts` has no working-tree diff
and hashes to the recorded pass-17 value
`d317b977e333d10b8c4ab83fed8be7a465f0da453eb9c810c985e0d86f7d263e`.
It also reran the focused CMA-ES/WASM contract tests and `git diff --check`.
The fail-closed compatibility gate remains intact, so the rejected 0.2.0 bundle
cannot silently replace the canonical TypeScript fallback.
