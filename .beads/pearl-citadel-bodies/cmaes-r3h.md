// cmaes-r3h — Rollout orchestration (kernel + planner + safety + controller)
//
// Background: the new control stack has four moving parts: the kernel (fs-cmaes-viz-wasm + fs-rigid), the RRT* planner (r3e), the MPPI+CBF controller (r3e, r3g), and the HJI safety pre-check (r3f). The rollout orchestrator wires these together in a deterministic order per step. The orchestrator is the "one bus" (doctrine rule 8 of the threejs-visualizations skill) that guarantees no two layers disagree on the state.
//
// Stack contents:
//   1. Per-step sequence: read state from kernel → run HJI pre-check (only at start of rollout) → run RRT* plan (only at start) → run MPPI for H steps → apply CBF filter → write control to kernel → advance kernel by 1 step → return.
//   2. Failure modes: if HJI fails, refuse the rollout; if RRT* fails, fall back to DWA (Fox 1997); if MPPI diverges (cost > 1e3), fall back to the last good control; if CBF is infeasible, fall back to a hard brake.
//   3. Telemetry: every step exposes the cost, the CBF QP solve time, the MPPI K-rollout time, the kernel step time, and the total orchestration time. The budget per step is 16 ms (60 Hz) on a typical laptop.
//
// Acceptance:
//   - A rollout with all four layers enabled: per-step orchestration time < 16 ms on a typical laptop.
//   - The fallback paths (DWA, last-good-control, hard brake) are exercised in the conformance suite.
//   - The telemetry is exposed in the existing honesty chip stack as a single "control budget" chip.
//
// Citations:
//   - Fox, Burgard, Thrun 1997 (DWA, the fallback).
//   - Williams 2015-2017 (MPPI, the local controller).
//   - Karaman & Frazzoli 2011 (RRT*, the global planner).
//   - Mitchell, Bayen, Tomlin 2005 (HJI, the safety pre-check).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3e, cmaes-r3f, cmaes-r3g, cmaes-r3i — all blocks
//   - cmaes-r3r (stage integration) — consumer
