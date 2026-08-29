# Epic 5: Robust obstacle avoidance objectives (CBF, MPC, learned costmap)

**Owns:** the safety layer and obstacle-avoidance objectives that make the G1 walking and the arm manipulation both *robust* — not "finds a path" but "always stays clear, even when a chair is rolling at it."

**Why now:** the user directive is "Part of the objective for the humanoid and the arm robots should be robust obstacle avoidance." The current single-scalar CMA rollup (per cmaes-pvz's multi-factor update) does include some stability terms, but there is no dedicated *avoidance* term and no safety filter at the policy level. A CBF or safety-filtered MPC gives us that, with formal guarantees when the geometry is right.

**Reference points (SOTA 2025-2026):**
- "Learning Safety for Obstacle Avoidance via Control Barrier Functions" — https://arxiv.org/abs/2509.16037
- "Reactive motion planning framework based on control barrier function" (Springer 2025) — https://link.springer.com/article/10.1007/s11431-025-3053-1
- "Point Cloud-Based Control Barrier Functions for Model Predictive Control" — https://arxiv.org/html/2510.02885
- "Safety corridor and pedestrian prediction integrated sequential MPC" (Sage 2025) — https://journals.sagepub.com/doi/10.1177/17298806261483759
- "MPC-SCBF: Model Predictive Control with Social Zone-Driven Control Barrier Function" — https://dl.acm.org/doi/10.1016/j.procs.2025.10.140
- "Risk-Aware Adaptive Safety Margins for Model Predictive Control" (MDPI 2025) — https://www.mdpi.com/2076-0825/15/2/116
- "Segment-safe control barrier functions for model predictive control" (Robotics & CIM 2026) — https://www.sciencedirect.com/science/article/pii/S0947358026001354
- "Safety-Critical Whole-Body Control for Humanoid Robots via ISSf-CBFs" — https://www.semanticscholar.org/paper/Safety-Critical-Whole-Body-Control-for-Humanoid-via-Lee-Park/75f8da1449fe8f91b9df46e6df23746655650464
- "Moving Obstacle Collision Avoidance via Chance-Constrained MPC" — https://onlinelibrary.wiley.com/doi/full/10.1002/rnc.70624
- "Neural NMPC through Signed Distance Field Encoding for Collision Avoidance" (IJRR 2025) — https://journals.sagepub.com/doi/full/10.1177/02783649251401223
- "Dynamic obstacle avoidance for car-like mobile robots" — https://www.sciencedirect.com/science/article/abs/pii/S0925231225019241

## Background and goals

CMA-ES is great for finding a *mean* policy that does well. It is not, by itself, a safety filter. The user's directive names "robust obstacle avoidance" — that means the *policy* must come with a guarantee (probabilistic or hard) that it does not enter a forbidden region. Two complementary strategies:

1. **Hard safety filter (CBF / MPC).** A quadratic-program safety filter watches the proposed action; if the action would decrease the safety barrier, it projects to the closest safe action. This is the provably-correct layer.
2. **Soft penalty in the objective.** The CMA rollup includes a `danger(pose, scene)` term so the optimizer prefers policies that stay away from obstacles by design. This is the policy-level shaping.

We need both. The hard filter protects the runtime; the soft penalty shapes the policy. They share the *same* geometry (the SDF / clearance from Epic 4) and the *same* dynamics (Epic 3).

## Sub-tasks (children)

- `cmaes-oa1` (P1, feature): **Safety barrier function (CBF)** — given the SDF (Epic 4) and the robot's whole-body pose, define a barrier `h(pose) = clearance(pose) - safetyMargin` with `h(pose) ≥ 0` for safe poses. The barrier is C¹-smooth. The QP `min ||a - a_nom||² s.t. ḣ ≥ -α h(pose)` projects unsafe actions to safe ones. Sub-millisecond per QP.
- `cmaes-oa2` (P1, feature): **Safety-filtered CMA action** — at every rollout step, the policy proposes an action; the kernel applies the CBF filter; the filtered action is what the kernel actually executes. The filter result is in the trace so the multi-factor objective (Epic 6) can see "how often did the policy get clipped".
- `cmaes-oa3` (P1, feature): **Dynamic obstacle velocity** — when a piece is moving (rolling chair, closing door), the barrier must use the *predicted* position, not the current. Use linear extrapolation from the contact telemetry (Epic 3 ph10) for short-horizon prediction. Test: a rolling chair is dodged even though it's not currently in the way.
- `cmaes-oa4` (P1, feature): **Whole-body CBF for the G1** — extend the barrier to cover *every* link of the G1 (29 actuated joints per cmaes-pvz). The barrier is the min over links: `h(pose) = min_link clearance(link, scene) - margin`. Same QP, higher-dim.
- `cmaes-oa5` (P1, feature): **Whole-body CBF for the arm** — same pattern for the KUKA-style arm (12 joints + gripper). The gripper gets the strictest margin when carrying a fragile object (Epic 2 small objects).
- `cmaes-oa6` (P1, feature): **Risk-aware margin** — the safety margin is a function of `(velocity, surface material, surface angle)` per the MDPI 2025 paper. A wet floor gets a higher margin than a dry wood floor. A fast-moving piece gets a higher margin than a stationary one. Coefficients are constants in the kernel; declared per material in Epic 2.
- `cmaes-oa7` (P2, feature): **Learned costmap** — a small MLP (≤ 100k params) maps `(pose, sceneFeatureVector)` to a per-direction danger field; trained offline on a held-out set of scenes with diverse furniture layouts. Used as a *warm-start* for the CBF QP and as a *bonus* in the CMA objective (faster convergence, fewer reward-hacking exploits).
- `cmaes-oa8` (P2, feature): **MPC safety filter (long horizon)** — for tasks with longer-horizon goals (the arm's pick-and-place, the G1's house nav), the safety filter uses a 2-4 step receding horizon, not just one step. The horizon is bounded by the geometric cost of multiple SDF queries.
- `cmaes-oa9` (P2, feature): **Recovery from infeasibility** — when no action satisfies the barrier (e.g., a chair has rolled onto the G1's foot), the kernel reports a `safetyFilterInfeasible` event and the policy falls back to the most-recent safe pose + an emergency-stop reflex (knee bend, arm tuck).
- `cmaes-oa10` (P2, feature): **Obstacle-avoidance rollup term** — for the CMA objective: `danger = ∫ danger(pose(t), scene(t)) dt`. Multi-factor per cmaes-pvz: per-step + trajectory-aggregated. The optimizer cannot game it by standing still (the distance / forward-progress terms fight back).
- `cmaes-oa11` (P3, feature): **Pedestrian / pet silhouette avoidance** — display-only pieces from Epic 2 cmaes-fg9 are treated as soft obstacles with a large margin. The G1 must navigate around them, not through.
- `cmaes-oa12` (P3, feature): **SSCBF (segment-safe CBF)** — for tight corridors (doorways), the segment-safe variant (Robotics & CIM 2026) gives less conservative behavior; used only when `sceneTopology.isCorridor(pose)`.

## Acceptance criteria (epic level)

- The G1 walking test now never enters `penetration > 1 mm` of any piece, even when the piece is rolling.
- The arm manipulation test never places a fragile object in a way that a rolling chair would hit it within 1 s of execution.
- The CBF QP runs in ≤ 200 µs per step on the whole-body G1 (29 links).
- A test scene with a doorway is traversed by the G1 in ≤ 6 s, with no contact (the G1's shoulders clear the doorframe with the documented margin).
- A test scene with a wet floor + a rolling chair is handled without a fall.
- The learned costmap warms the QP and reduces iterations by ≥ 30% on the held-out test set.
- All safety margins are documented per (material, velocity) pair in a kernel-included table.
- bun test green; cmaes-pvz still green; new tests: cmaes-oa1 (barrier smoothness), cmaes-oa2 (action projection), cmaes-oa3 (dynamic prediction), cmaes-oa4 / oa5 (whole-body), cmaes-oa6 (risk-aware margin).

## Dependencies (blocking)

- Epic 3 (cmaes-ph0): the kernel dynamics the CBF projects onto.
- Epic 4 (cmaes-cl0): the SDF / clearance the barrier uses.
- `cmaes-pvz` (P1, open): the multi-factor objective rollup this epic contributes to.
- `cmaes-nxj` (P1, in_progress): the G1 flagship this epic protects.

## Dependents (this epic blocks)

- Epic 6 (the G1 + arm flagships in the photo-real household use the safety filter + the rollup term).

## Cross-cutting constraints

- Safety is hard: no "soft" safety. If the filter is infeasible, the policy must report it, not pretend it is safe.
- The barrier is C¹-smooth everywhere except the surface (where the gradient is bounded by the Lipschitz constant from Epic 4).
- The learned costmap is an *additive* warm-start, never a replacement for the analytic CBF.
- No wall-clock, no `Math.random` — re-uses cmaes-mky discipline.

## References

- https://arxiv.org/abs/2509.16037 (Learning Safety for Obstacle Avoidance via CBFs)
- https://link.springer.com/article/10.1007/s11431-025-3053-1 (Reactive motion planning via CBF)
- https://arxiv.org/html/2510.02885 (Point Cloud-Based CBFs for MPC)
- https://journals.sagepub.com/doi/10.1177/17298806261483759 (Safety corridor + pedestrian prediction sequential MPC)
- https://dl.acm.org/doi/10.1016/j.procs.2025.10.140 (MPC-SCBF)
- https://www.mdpi.com/2076-0825/15/2/116 (Risk-Aware Adaptive Safety Margins for MPC)
- https://www.sciencedirect.com/science/article/pii/S0947358026001354 (SSCBF)
- https://www.semanticscholar.org/paper/Safety-Critical-Whole-Body-Control-for-Humanoid-via-Lee-Park/75f8da1449fe8f91b9df46e6df23746655650464 (ISSf-CBF whole-body humanoid)
- https://onlinelibrary.wiley.com/doi/full/10.1002/rnc.70624 (Chance-Constrained MOCA)
- https://journals.sagepub.com/doi/full/10.1177/02783649251401223 (Neural NMPC SDF)
- https://www.sciencedirect.com/science/article/abs/pii/S0925231225019241 (Dynamic obstacle avoidance car-like)
