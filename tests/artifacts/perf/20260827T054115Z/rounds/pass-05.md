# Pass 05 — exact-tail Jacobi rotation coefficient

Date: 2026-08-27

## Decision

Accepted. The retained candidate bypasses JavaScriptCore's generic two-argument
`Math.hypot` only where IEEE-754 rounding makes its result exactly known:

- `hypot(1, tau) === 1` for `abs(tau) <= 2^-27`;
- `hypot(1, tau) === abs(tau)` for `abs(tau) >= 2^27`;
- the original `Math.hypot(1, abs(tau))` call remains for the interval between
  those bounds.

The representative 300-trial p95 moved only 0.771463847165732% and therefore
remains inside the established 4.8% same-seed envelope. Independent focused
evidence clears the regional gate: 50,000 Jacobi decompositions improved from
11,941.15815108153 to 12,601.792157570795 calls/s (+5.532411497534939%), while
native `hypot` sampled self-time fell from 170.2 ms to 131.5 ms. The benchmark
checksum, all seven deterministic goldens, 64-seed optimizer convergence
results, and every adversarial eigensystem metric are byte-identical.

## Scope and fresh opportunity evidence

- Mission: reduce only stable Jacobi rotation-coefficient cost.
- Production edit: two constants and the coefficient calculation in
  `jacobiEigenSymmetric`.
- Explicitly unchanged: pivot traversal, row/column rotation traffic,
  eigenvector traffic, convergence/sweep rule, tolerance, covariance loops,
  reconstruction, ordering/flooring, RNG, optimizer state, and public APIs.
- The pass-04 representative profile assigned 42.2% to coefficient branches.
- This pass's fresh focused baseline assigned 44.5% + 43.1% = 87.6% self to
  the two coefficient branches and another 3.9% self to native `hypot`.
- Opportunity score: `(impact 4 x confidence 5) / effort 2 = 10.0`; the
  required minimum is 2.0.
- One retained lever: avoid generic `hypot` on exact-rounding tails.

## Reference formula and first-principles proof

For the active symmetric two-by-two block

```text
[ app  apq ]
[ apq  aqq ]
```

the existing cyclic Jacobi implementation defines

```text
tau = (aqq - app) / (2 * apq)
h   = hypot(1, tau) = sqrt(1 + tau^2)
t   = +1 / ( tau + h)  when tau >= 0
t   = -1 / (-tau + h)  when tau < 0
c   = 1 / sqrt(1 + t^2)
s   = t * c
```

Equivalently, with `m = abs(tau)` and a sign function that maps both `+0` and
`-0` to `+1`, `t = sign(tau) / (m + sqrt(1 + m^2))`. This is the stable Jacobi
tangent: it avoids subtracting two nearly equal quantities and guarantees
`abs(t) <= 1`. Eigen's maintained Jacobi implementation uses the same stable
root/tangent and normalization structure, modulo its matrix/sign convention:
[Eigen Jacobi.h](https://libeigen.gitlab.io/eigen/docs-nightly/Jacobi_8h_source.html).
Hansen's CMA-ES reference writes the covariance eigendecomposition as
`C = B D^2 B^T`, with `B` orthogonal and the diagonal of `D^2` holding the
eigenvalues used by sampling and whitening:
[The CMA Evolution Strategy: A Tutorial](https://www.cmap.polytechnique.fr/~nikolaus.hansen/cmatutorial).

### Small `tau`: zero, signed zero, subnormal, and `2^-27`

Let `m <= 2^-27`. Then `m^2 <= 2^-54`, and

```text
sqrt(1 + m^2) - 1 = m^2 / (sqrt(1 + m^2) + 1) < 2^-55.
```

At one, the binary64 spacing above one is `2^-52`, so this difference is well
below the `2^-53` rounding midpoint. The correctly rounded norm is exactly
`1`. JavaScriptCore's implementation also forms the scaled sum with `fma`; a
term no larger than `2^-54` rounds that sum to exactly `1` before the square
root. The retained literal `1` is therefore bit-identical to this Bun runtime's
`Math.hypot(1, tau)` throughout the small tail. The runtime implementation is
visible in [WebKit MathObject.cpp](https://github.com/WebKit/WebKit/blob/main/Source/JavaScriptCore/runtime/MathObject.cpp).

Consequences:

- `tau = +0`: `m = 0`, sign numerator `+1`, so `t = +1`.
- `tau = -0`: `tau < 0` is false, matching the old `tau >= 0` true branch, so
  `t` remains `+1`; the unusual signed-zero behavior is deliberately retained.
- positive minimum subnormal: `t = +1` exactly.
- negative minimum subnormal: `t = -1` exactly.
- no square is evaluated by production code, so subnormal squaring cannot
  underflow and change a branch or coefficient.

### Ordinary finite `tau`

For `2^-27 < m < 2^27`, the candidate executes the same
`Math.hypot(1, m)`. `Math.hypot` is sign-insensitive, so replacing `tau` with
`abs(tau)` changes no norm bit. The denominator then uses the same positive
magnitude as the former positive `tau` or negative `-tau` branch. The numerator
uses `tau < 0 ? -1 : 1`, which matches the old branches for every nonzero finite
value and, as shown above, for signed zero.

### Huge finite `tau`, division-created Infinity, and NaN

For `m >= 2^27`, JavaScriptCore scales by `m` and accumulates
`1 + (1/m)^2`. Because `(1/m)^2 <= 2^-54`, the fused sum rounds exactly to
`1`; `sqrt(1) * m` is exactly `m`. Replacing `hypot(1, tau)` with `m` is thus
bit-identical. This tail also preserves all extreme denominator behavior:

- if `m + m` remains finite, both versions divide by the identical finite
  denominator;
- if `m + m` overflows, both return signed zero for `t`;
- at `Number.MAX_VALUE / 2`, both return the same subnormal-magnitude tangent;
- at `Number.MAX_VALUE`, both return `+0` or `-0` because the denominator is
  Infinity;
- if finite intermediate division creates `tau = +Infinity` or `-Infinity`,
  `m` is Infinity, the denominator is Infinity, and the same signed zero is
  produced;
- if finite intermediate overflow produces `tau = NaN`, both comparisons are
  false, the candidate falls back to `Math.hypot(1, NaN)`, and `t` remains NaN.

The optimized code never evaluates `tau * tau`, so it introduces neither
finite overflow nor subnormal underflow.

### Cosine/sine normalization and downstream identity

The proof above establishes bit-identical `t` on all IEEE-754 cases, including
zeros, subnormals, ordinary values, huge finite values, infinities, and NaN.
The unchanged statements for `c` and `s` therefore receive the same bit pattern
and emit the same bit patterns. For every finite tangent, `abs(t) <= 1`, so
`1 + t*t` lies in `[1, 2]`; it cannot overflow or underflow. Mathematically,
`c^2 + s^2 = 1`. The 200,000-value deterministic logarithmic property sweep
found zero coefficient mismatches and maximum measured normalization error
`4.440892098500626e-16`.

Because each `(c, s)` is identical, every later matrix and eigenvector update
is identical in value and order. Therefore pivot values, sweep residuals,
termination, non-convergence behavior, final diagonal values, stable sort
inputs/order, eigenvalue flooring, reconstructed covariance, sampling,
whitening, optimizer trajectory, and RNG consumption are unchanged.

## Candidate screening and behavior gate

An initial design screen tried `sqrt(1 + tau*tau)` below a square-safe bound.
It was much faster, but it changed fused-rounding results: deterministic
goldens diverged from dimension 8 upward and the 300-trial optimizer checksum
changed from `24940.517463897122` to `25552.791245112203`. That design was not
retained. Its artifacts use the unqualified `pass-05-after*` and
`pass-05-golden*` names and are preserved as rejection evidence.

The retained exact-tail design's direct coefficient screen used 1,024,000
coefficients per trial across the binary64 logarithmic range:

| Variant | p50 | p95 | Checksum | Mismatches |
|---|---:|---:|---:|---:|
| Current generic `hypot` | 5.669040999999993 ms | 10.977917000000001 ms | 7754.516585559573 | — |
| Exact-tail candidate | 1.4169170000000122 ms | 1.4826659999999947 ms | 7754.516585559573 | 0 |

This synthetic screen is tail-heavy and is used only to validate the lever,
not as the acceptance measurement.

## Paired representative measurement

Both retained-code comparisons used the identical command and seed schedule:

```bash
bun tests/perf/cmaesEngine.bench.ts --dim=24 --generations=250 --trials=300 --warmup=10 --seed=1729
```

| Metric | Before | Exact-tail candidate | Change |
|---|---:|---:|---:|
| p50 | 60.278707999998005 ms | 58.49291699999958 ms | -2.962556861700627% |
| p95 | 63.89904100000058 ms | 63.40608299999997 ms | -0.771463847165732% |
| p99 | 67.72320899999977 ms | 66.68462499999998 ms | -1.5335717479066702% |
| Throughput | 53,625.511366977626 eval/s | 54,987.60289885683 eval/s | +2.5400066072245764% |
| Benchmark checksum | 24940.517463897122 | 24940.517463897122 | exact |

The p95 result is inside the 4.8% representative envelope, so acceptance rests
on the independent focused regional evidence below.

## Focused Jacobi profile

Both focused runs used the same finite symmetric positive-definite 24-D matrix,
1,000 warmups, 50,000 measured decompositions, and a 250 microsecond profiler
interval.

| Focused metric | Before | Exact-tail candidate | Change |
|---|---:|---:|---:|
| Duration | 4187.198542 ms | 3967.6896249999995 ms | -5.242381386939277% |
| Throughput | 11,941.15815108153 calls/s | 12,601.792157570795 calls/s | +5.532411497534939% |
| Checksum | 123961.01785623064 | 123961.01785623064 | exact |
| Profile duration | 4.33 s | 4.10 s | -5.31% |
| Native `hypot` self | 170.2 ms / 3.9% | 131.5 ms / 3.2% | -22.74% absolute |

Before, source attribution split coefficient work across lines 139 and 140 at
44.5% and 43.1% self. After, source mapping coalesced the conditional expression
onto one line at 88.4%, so those line percentages are not directly comparable.
The exact focused throughput and separately sampled native `hypot` reduction
provide the regional evidence.

## Numerical, convergence, and optimizer properties

### Coefficient property cases

`pass-05-coefficient-properties.json` covers `+0`, `-0`, minimum positive and
negative subnormals, minimum normal values, both exact-tail boundaries,
ordinary positive/negative values, huge finite values, maximum finite values,
division-created infinities, explicit infinities, and NaN. All explicit cases
match the original coefficient under `Object.is` (with NaN-equivalence),
including the signs of zero. A deterministic 200,000-value logarithmic sweep
also reports zero mismatches.

### Adversarial matrices

The before/after adversarial artifacts are byte-identical (SHA-256
`535c71b01895c50314d0f5a8d2afa3548a59df68fa676ebb74104cd45f1dc77a`).
Cases include equal diagonals with positive and negative off-diagonal values,
a subnormal-scale matrix, clustered eigenvalues, condition number `10^12`,
huge `~10^280` and small `~10^-280` DCT-rotated spectra, and dense 12-D SPD
input. Every spectrum is descending, finite, and positive after the documented
floor. Non-floored normalized eigen residuals range from
`2.220446049250313e-16` to `1.0126506558042198e-12`; maximum orthogonality error
is `3.3306690738754696e-15`. The subnormal case intentionally activates the
`1e-300` eigenvalue floor, so its normalized residual is not meaningful; its
absolute residual and all output bits are nevertheless identical.

### Optimizer convergence

The matched 64-seed, 24-D, 250-generation convergence artifacts are
byte-identical (SHA-256
`7c6116aceb0274b0e9fc3c6208b6fcef4fb799b69da95867f87d695cfe6e091c`).
This includes every sorted best-fitness value, median/p95/mean fitness, success
count, sigma distribution, and condition-number distribution. All 64 condition
numbers remain finite and positive.

## Exact oracle and quality gates

- Candidate goldens for dimensions 1, 2, 4, 8, 12, 24, and 48 are byte-identical
  to the authoritative files.
- `shasum -a 256 -c golden_checksums.txt`: all seven `OK`.
- `bun test app/lib/cmaesEngine.test.ts`: 16 pass, 0 fail, 157 assertions.
- `bun typecheck`: pass.
- `bun lint app/lib/cmaesEngineND.ts`: pass; only the pre-existing
  `baseline-browser-mapping` age advisory was emitted.
- `git diff --check`: pass.
- Final production diff is confined to the two exact-tail constants and the
  Jacobi coefficient expression.

## Files changed or generated

- `app/lib/cmaesEngineND.ts` — retained exact-tail coefficient fast path.
- `pass-05-before.json`, `pass-05-exact-after.json` — representative pair.
- `pass-05-before-focused-workload.json`,
  `pass-05-exact-after-focused-workload.json` — focused pair.
- `pass-05-before-focused.cpuprofile.{cpuprofile,md}` and
  `pass-05-exact-after-focused.cpuprofile.{cpuprofile,md}` — focused profiles.
- `pass-05-exact-tail-candidate-microbench.json` — exact-tail coefficient screen.
- `pass-05-coefficient-properties.json` — explicit extremes and 200,000-value
  deterministic sweep.
- `pass-05-before-adversarial.json`, `pass-05-exact-after-adversarial.json` —
  matched eigensystem properties.
- `pass-05-before-convergence.json`, `pass-05-exact-after-convergence.json` —
  matched optimizer convergence properties.
- `pass-05-exact-golden-dim-{1,2,4,8,12,24,48}.json` — retained candidate
  exact goldens.
- The unqualified `pass-05-after*`, `pass-05-golden*`, and
  `pass-05-coefficient-candidate-microbench.json` artifacts document the
  rejected ordinary-range square-root design screen.
- `pass-05.md` — this report.

`.skill-loop-progress.md` and the campaign ledger were not modified. No file
was deleted, no destructive command was used, and no commit was made.

## Orchestrator verification

The orchestrator reviewed the small/ordinary/large/NaN branch proof and the confined production diff, reran the 16-test/157-assertion suite, verified all seven authoritative golden checksums, and independently measured 150 representative trials at p50 59.75 ms, p95 61.65 ms, p99 65.07 ms, and 54,184 evaluations/s with the expected exact checksum. Typecheck, scoped lint, UBS, and `git diff --check` also passed. The accepted regional win is upheld.
