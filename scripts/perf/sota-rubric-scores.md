# SOTA-Rubric Scores (Slice C, cmaes-phr3m-sota-m2c)

This file is the durable evidence chain for the SOTA-rubric scoring. Each
new physics component that ships MUST have a row here, with the four-axis
score and the four citations. The bead cannot close without a row.

# Current scores

| Component | Parity | Oracle | Cited benchmark | Behavioral receipt | Citations |
|---|---|---|---|---|---|
| CCD-on-SDF (cmaes-phr7) | 2 (parity test exists, oracle cases pass, structure-only mode pending kernel) | 3 (sphere-sphere, sphere-box, CCD swept) | 2 (Ericson 2005 Ch. 4-5 GJK/EPA headline test-vector template, matched within 2x) | 3 (per-step trace in tests/receipts/snapshots/sdf-query.json, committed) | Ericson 2005, tests/parity/ccdSdf.test.ts, cmaes-phr3m-parity-ccd-voi, tests/receipts/snapshots/sdf-query.json |
| GJK witness (cmaes-phr7) | 0 (no parity test yet -- same template as CCD, contributor TODO) | 0 | 0 | 3 | n/a -- not yet implemented |
| EPA penetration (cmaes-phr7) | 0 | 0 | 0 | 3 | n/a |
| CBF safety barrier (cmaes-phr1) | 2 (parity test exists, 3 oracle cases pass, structure-only mode pending kernel) | 3 (point-circle, 4-DOF arm sphere, dynamic obstacle) | 2 (Ames 2017 IEEE TAC 62(8) CBF definition, matched within 2x) | 3 (per-step trace in tests/receipts/snapshots/obstacle-objective-arm.json and obstacle-objective-g1.json, committed) | Ames 2017, SHIELD Yang 2025 (arXiv:2505.11494), tests/parity/cbfBarrier.test.ts, cmaes-phr3m-parity-cbf-gn2, tests/receipts/snapshots/obstacle-objective-*.json |
| Featherstone (cmaes-phr6) | 2 (parity test exists, 3 oracle cases pass, structure-only mode pending kernel) | 3 (2-link planar FK, 6-DOF UR DH, 15-link G1 COM) | 2 (Featherstone 2008 Rigid Body Dynamics Algorithms, matched within 2x) | 3 (per-step trace in tests/receipts/snapshots/featherstone-*.json, committed) | Featherstone 2008, tests/parity/featherstone.test.ts, cmaes-phr3m-parity-feath-0b2, tests/receipts/snapshots/featherstone-*.json |
| Parametric furniture (cmaes-phr5) | 0 | 0 | 0 | 0 | n/a -- not yet implemented (CreamHare) |
| Photo-real envs (cmaes-phr4) | 0 | 0 | 0 | 0 | n/a -- not yet implemented (CreamHare) |
| Obstruction-avoidance G1 whole-body (cmaes-phr8) | 0 | 0 | 0 | 3 | n/a |
| Obstruction-avoidance arm whole-body (cmaes-phr8) | 0 | 0 | 0 | 3 | n/a |

# How to update

When a component lands, the contributor who lands it:
1. Updates the row with the new scores (must be >= 0 on every axis).
2. Adds the four citations (parity test path, oracle cite, paper cite,
   receipt snapshot path).
3. Re-runs `bun test tests/parity tests/receipts` to confirm the parity
   and receipt diffs are empty.
4. The bead closure comment quotes the row.

# How to score "0"

A "0" is allowed ONLY when the component has not been implemented yet. A
shipped component with a "0" on any axis is a process-porn incident; the
bead is reopened, the contributor fixes the score, and the closure
comment is updated.

# Honesty floor

A "SOTA score" with no cited source is process porn. A score that the
contributor can fill in with their own opinion of "how good" the
implementation is, without a numeric comparator, is not a score. The four
axes are non-negotiable; each one has a citation requirement that lives
in the comment, not in a separate doc.
