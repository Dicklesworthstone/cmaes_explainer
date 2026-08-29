// cmaes-r4a — Cross-cutting acceptance / parity proofs
//
// Background: r3s defines the per-bead evidence contract; r4a collects the cross-cutting evidence that proves the entire stack is honest. This is the EPIC's "release-blocker" bead: until r4a is closed, the EPIC is not done.
//
// Stack contents:
//   1. End-to-end parity test: the G1 walks through the house, opening a refrigerator, knocking a book off a table, rolling a ball across the floor. The kernel's per-step receipt is compared to the TS reference at every step; the receipts match within tolerance.
//   2. End-to-end honesty audit: the static-analysis pipeline scans the entire r3 codebase for forbidden patterns; the report is committed to the repo.
//   3. End-to-end performance audit: the G1 flagship page with all r3 features enabled renders at 30+ fps on a 2018 laptop and 60+ fps on a 2020 laptop. The audit report is committed.
//   4. End-to-end multi-agent audit: the agent mail threads 8476, 8485, and the new threads created during execution are reviewed; any overlap is resolved; the final coordination report is committed.
//   5. Documentation: the RESEARCH_PHOTOREAL_HOUSE_PHYSICS.md is updated with the final SOTA citations and the as-built architecture; the README is updated with the new user-facing features and toggles.
