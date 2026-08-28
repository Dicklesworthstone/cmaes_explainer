# Optimization hypotheses

1. Independent candidate rollouts dominate generation latency and can be partitioned without changing CMA-ES mathematics. A small persistent worker pool should reduce warm full-generation wall time toward the slowest shard plus transfer overhead.
2. Passing `WebAssembly.Module` to workers and constructing one long-lived evaluator per admitted configuration will avoid repeated compile/fetch cost.
3. Candidate order must be reconstructed exactly before `tell`; this makes the parallel transport observationally identical to sequential `evaluate_population`.
4. Owner-certified collision envelopes can replace the link-origin heuristic without an all-pairs explosion by using a fixed small proxy set, adjacent-link exclusions, a cheap conservative broad reject, and a bounded query budget.
5. A bilateral compliant-pad force model can remove object teleportation while reusing the existing normal/friction owners and source dynamics. The curriculum will need recalibration because it previously relied on an exact rigid latch.
6. Terrain and push recovery can reuse the existing G1 foot-contact loop and SE(3) state owner, adding little structural overhead relative to the articulated solve.
