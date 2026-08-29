# phr-env-2026 Performance Budgets

This file is the canonical per-epic performance budget for the phr-env-2026
charter. It is the source of truth for the per-epic budget numbers that
`tests/perf/phrBudget.test.ts` enforces. Each number is **a budget, not a
wish**: an upper bound with a reference (the existing v06x envelope, a
hand-computed lower bound, or a SOTA paper's headline number).

# Format

| Epic | Owner-side budget | Explorer-side budget | Reference |
|---|---|---|---|

- **Owner-side budget** = the per-frame cost the kernel owner can introduce.
  For the G1/arm kernels this is the per-step wall-clock inside the wasm
  module.
- **Explorer-side budget** = the per-frame cost the browser stage (the
  three.js / R3F / worker code in this repo) can introduce when rendering
  the flagship.
- **Reference** = the existing baseline or the SOTA paper headline that
  the budget is anchored to. The budget is allowed to be slightly looser
  than the reference, but not by more than 2x without an override bead.

# Budgets

| Epic | Owner-side budget | Explorer-side budget | Reference |
|---|---|---|---|
| cmaes-phr4 (photo-real envs) | n/a (no physics) | 4.0 ms p95 per frame for IBL + DDGI | v06x: 1.8 ms p95 for the existing G1 stage; IBL is the new cost; budget = existing + 2.2 ms headroom |
| cmaes-phr5 (parameterized furniture) | 0.4 ms p95 per articulation solve (5 pieces) | 0.6 ms p95 per frame for procedural shape generation | Bridson 2006 SIGGRAPH contact-course per-piece cost model; v06x: <0.1 ms p95 for the static counter |
| cmaes-phr6 (Frankensim dynamic-physics kernel) | 1.5 ms p95 per 720-step rollout step (G1 5040-D) | n/a (kernel-only) | v06x: 1.2 ms p95 per step on the same workload; the 30-link whole-body is +25% joints, budget = +25% headroom |
| cmaes-phr7 (clipping & boundary detection) | 0.5 ms p95 per SDF query (BVH-cached), 0.05 ms p95 per GJK witness, 0.08 ms p95 per EPA depth | n/a (kernel-only) | Ericson 2005 Ch. 4-5 GJK/EPA headline numbers; Mueller 2014 articulated-body SDF cache |
| cmaes-phr8 (obstacle-avoidance objectives) | 0.3 ms p95 per CBF QP solve (7-DOF arm) | n/a (kernel-only) | SHIELD Yang 2025 (arXiv:2505.11494) sub-ms QP target on Unitree G1 hardware |
| cmaes-phr9 (flagships) | see cmaes-phr4..8 budgets; flagship-level budget = sum of the component budgets + 0.5 ms composer overhead | 16.0 ms p95 per frame for the full flagship stage (60 fps floor) | v06x: 12.0 ms p95 for the existing G1 walking flagship; the new physics adds IBL + SDF + CBF, budget = +33% headroom |
| cmaes-phr3m-meas (this epic) | 0.05 ms p95 per parity test (the test itself, not the kernel) | 0 ms (the parity tests are CI-side, not browser-side) | n/a (the test runs in <100 ms total; budget is the per-case cost) |

# How the budget is enforced

`tests/perf/phrBudget.test.ts` reads this file, looks up the budget for each
epic, runs the new owner on the standard test vector, and asserts the
runtime is inside the budget. A failed budget does NOT block CI red; it
produces a `tests/perf/phrBudget-report.md` report listing the over-budget
epics with the actual measurement. The contributor must either (a) fix the
code, or (b) open an override bead that names the budget and the new target.

# How the budget is updated

The contributor who wants to raise a budget:
1. Opens a code-reviewable bead titled `Override: phr-env-2026 <epic> budget
   raise <N>ms -> <M>ms` with the reason in the description.
2. Edits the row in this file.
3. The PR is reviewed; the reviewer must explicitly ack "budget raised with
   override bead" in the PR description.
4. CI re-runs the budget test; the new number is the new upper bound.

# Honesty floor

A budget with no upper bound is a wish. A budget that the contributor can
silently raise without review is a process artifact that gates nothing. The
override-bead pattern is the only escape hatch; without it, the budget has
no enforcement.

# SOTA references

- The v06x benchmark envelopes in `tests/perf/cmaesEngine.bench.ts` (the
  existing p50/p95/p99 envelopes that anchor the "existing" column).
- Bridson 2006 SIGGRAPH course notes: per-piece contact cost model.
- Ericson 2005: GJK/EPA headline numbers.
- Mueller 2014 (TVCG): articulated-body SDF cache.
- SHIELD Yang 2025 (arXiv:2505.11494): sub-ms CBF QP target on G1.
- The hyperfine methodology for warmup/CV discipline.
