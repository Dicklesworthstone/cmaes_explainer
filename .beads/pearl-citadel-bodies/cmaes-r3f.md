// cmaes-r3f — Safety reachability (HJI pre-check)
//
// Background: MPPI + CBF is a local safety layer. For a robust obstacle-avoidance that does not get into a bad state, we add a Hamilton-Jacobi-Isaacs (HJI) reachability pre-check before the rollout begins. The pre-check computes the backward-reachable set (BRS) of the closed-loop system under the worst-case disturbance; if the start state is not in the BRS, the rollout is refused before it begins. The check is expensive (O(grid_size * horizon)) so we run it once per scene, not per rollout.
//
// Stack contents:
//   1. State grid: the G1's 2D position and heading on the floor (a 3D state). The BRS is computed on this grid.
//   2. HJI solver: explicit-Euler on the value function; 1000 cells per side, 100 steps, runs in < 500 ms.
//   3. Disturbance model: the worst-case disturbance is a 50 N lateral push on the pelvis for 0.1 s (the disclosed push in the existing cmaes-pvz experiment).
//   4. Integration with the admission: the kernel refuses the rollout if the start state is not in the BRS; the refusal is logged with the reason ("start not in BRS, refuse rollout").
//
// Acceptance:
//   - The BRS is computed in < 500 ms for a single scene.
//   - A start state known to be safe (e.g. the porch, far from the kitchen obstacle) passes the check.
//   - A start state known to be unsafe (e.g. inside a wall) fails the check.
//   - The BRS is conservative: every state inside the BRS is provably safe under the worst-case disturbance, given the local controller (MPPI+CBF).
//
// Citations:
//   - Mitchell, Bayen, Tomlin 2005 (HJI reachability, original application to aircraft).
//   - Margellos, Lygeros 2011 (HJI for stochastic systems).
//   - Bajcsy, Bansal, Fisac, Herbert 2019 (HJI for safe MPC).
//   - Hsu, Kenworthy, Bajcsy 2023 (efficient HJI on GPUs).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3e (obstacle avoidance) — sibling
//   - cmaes-r3m (collision stack) — blocks
//   - cmaes-r3i (rigid dynamics) — blocks
