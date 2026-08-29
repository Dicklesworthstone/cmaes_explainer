// cmaes-r3s — Acceptance / evidence contract (per-bead evidence requirements)
//
// Background: every ship in the r3 family must prove three things: parity against the project's TS reference (the doctrine of the project), regression over a known input set, and honesty about what the kernel actually did. This bead is the contract that every other r3 bead's Acceptance section follows.
//
// Stack contents:
//   1. Conformance suite: a Rust test harness (reused from the existing frankensim conformance pattern) that runs the TS reference and the Rust kernel on the same input and asserts bit-equivalent outputs (within tolerance) on the key invariants. Each r3 bead's acceptance section names a specific conformance test by ID.
//   2. Regression suite: a fixed set of inputs and expected outputs (golden files) per bead. New code that changes a golden file requires a deliberate re-baselining; the re-baselining is logged in the bead's commit message.
//   3. Honesty audit: a static-analysis pass that scans every r3 bead's code for forbidden patterns (Math.random without seed, performance.now in physics, fake dt=1/60, fake "WASM" badges). The pass is part of the existing validate-viz.py + UBS pipeline.
//   4. Performance budget: a per-bead performance budget (ms per frame, MB per scene, GPU draws per frame) that is enforced in CI; a regression > 5% on any budget fails the build.
//
// Acceptance:
//   - Every r3 bead in this graph has a dedicated entry in the conformance suite (named in the Acceptance section).
//   - The regression suite has at least 5 golden-file cases per bead.
//   - The honesty audit runs in CI; r3s itself passes the audit on the first try.
//   - The performance budget is enforced in CI; r3s itself fits its own budget.
//
// Citations:
//   - Property-based testing (Claessen, Hughes 2000) — pattern for the conformance suite.
//   - Golden-file testing (insta, snapshot) — pattern for the regression suite.
//   - Conformance testing (classic CS 1990s+, Wikipedia survey) — pattern for the conformance suite.
//   - Higham 2002 ("Accuracy and Stability of Numerical Algorithms", 2nd ed.) — pattern for the numerical invariants.
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - All r3* beads — consumer
//   - cmaes-a0f (population eval harness) — closed, the harness is the foundation
