# SOTA-Rubric Scoring Template

This file is the canonical scoring template for the Slice C SOTA-rubric
bead (cmaes-phr3m-sota-m2c). For each new physics component we ship, we
must be able to say: "this implementation matches (or exceeds) the headline
benchmark in the cited paper, and the proof is the parity test against our
TS reference."

This is not a vague aspiration -- it is a measurable claim. The four axes
below are non-negotiable; each one has a citation requirement that lives
in the comment, not in a separate doc that nobody reads.

# The four axes

Each new physics component is scored on a 0/1/2/3 scale (3 = matches or
exceeds the cited paper, 0 = no evidence). A 0 on any axis means the
component is not shipped.

## 1. Parity (kernel <-> TS reference)

| Score | Meaning |
|---|---|
| 0 | No parity test exists. |
| 1 | Parity test exists but is a regression test (no analytical oracle). |
| 2 | Parity test exists with an analytical oracle; tests are passing. |
| 3 | Parity test exists with an analytical oracle; max abs diff is below 1e-9 for analytic cases, 1e-6 for floating-point accumulated cases. |

Citation requirement: the test file path and the bead ID of the parity
feature (cmaes-phr3m-parity-ow9).

## 2. Oracle (analytical ground truth)

| Score | Meaning |
|---|---|
| 0 | No oracle case. |
| 1 | Oracle case exists but is informal (a hand-wavy comment, no closed-form). |
| 2 | Oracle case exists with a closed-form expression. |
| 3 | At least 3 oracle cases per owner (e.g. sphere-sphere, sphere-box, CCD swept). |

Citation requirement: the cited SOTA paper whose test vector is being
matched. Example: "Ericson 2005 Ch. 4-5 GJK/EPA test-vector template."

## 3. Cited benchmark (matches the SOTA paper's headline)

| Score | Meaning |
|---|---|
| 0 | No cited benchmark. |
| 1 | A paper is cited but the benchmark is not the paper's headline. |
| 2 | The paper's headline benchmark is matched (within 2x). |
| 3 | The paper's headline benchmark is matched or exceeded. |

Citation requirement: the exact paper, year, and headline number. Example:
"SHIELD Yang 2025 (arXiv:2505.11494), sub-ms CBF QP target on Unitree G1
hardware."

## 4. Behavioral receipt (per-step trace)

| Score | Meaning |
|---|---|
| 0 | No per-step trace. |
| 1 | Per-step trace exists but is not committed (lives in a log file). |
| 2 | Per-step trace exists with a committed snapshot (cmaes-phr3m-receipts-bia). |
| 3 | Per-step trace exists, committed, and a CI job diffs against the snapshot on every PR. |

Citation requirement: the snapshot file path and the bead ID.

# How to use this template

For each new physics component, append a row to scripts/perf/sota-rubric-scores.md
with the four scores and the four citations. The row is the bead closure
comment; the bead cannot close without a row.

# SOTA references

- Schmerling et al. ICRA 2024 (arXiv:2404.05609): value-iteration-on-SDF benchmark.
- Tassa et al. IROS 2010 (iLQG/DDP): DDP perf benchmark.
- Ericson 2005 (Real-Time Collision Detection): GJK/EPA headline numbers.
- Jo et al. ICRA 2026 (arXiv:2605.30696): geometry-aware CBF Bernstein-polynomial headline.
- SHIELD Yang et al. 2025 (arXiv:2505.11494): G1 hardware CBF benchmark.
- Opt2Skill Liu et al. 2024 (arXiv:2409.20514): DDP + RL hybrid benchmark.
- ALMA Howell et al. 2022 (RSS): differentiable contact mesh benchmark.
- Bridson 2006 SIGGRAPH course notes: contact-manifold headline.
- The hyperfine methodology for warmup/CV discipline.
- The Frankensim repository's existing audit: app/lib/cmaesEngine.test.ts.

# Honesty floor

A "SOTA score" with no cited source is process porn. A score that the
contributor can fill in with their own opinion of "how good" the
implementation is, without a numeric comparator, is not a score. The four
axes are non-negotiable; each one has a citation requirement that lives
in the comment, not in a separate doc.
