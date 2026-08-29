// cmaes-r3g — DP-style control stack (DDP + iLQR + MPPI + rollout DP)
//
// Background: the user explicitly cited "dynamic programming" methods as an untapped SOTA lever. The current control stack for the G1 is a phase-basis residual policy trained by CMA-ES (per RESEARCH_G1_LEARNING.md). The new stack layers:
//   - Offline gait optimization via Differential Dynamic Programming (DDP, Jacobson & Mayne 1970; Tassa 2014) or iLQR (Li & Todorov 2004). This is computed once per scene, off the browser, in Python+NumPy. The output is a sequence of joint targets that the residual policy adds to.
//   - Local receding-horizon control via MPPI (Williams 2015-2017), the same MPPI from r3e but now with the DDP trajectory as the warm start.
//   - Rollout-based approximate dynamic programming (Bertsekas 2008-2020) on the high-level: treat CMA-ES as the base policy and use rollout to compute a value-function approximation that biases the search toward better hyperparameter combinations.
//
// Stack contents:
//   1. DDP solver (Tassa 2014) for the G1's 29-DoF on the terrain-and-push challenge; horizon = 720 steps; 50 ms / solve.
//   2. iLQR fallback (Li & Todorov 2004) for cases where the DDP Hessian is ill-conditioned; automatic switch when the regularization crosses 1e3.
//   3. MPPI over the DDP trajectory; K=512 rollouts of horizon H=20; cost is the existing multi-factor objective.
//   4. Rollout DP on CMA-ES hyperparameters (per Bertsekas 2020); this is the cmaes-jk1 bead's first real consumer.
//
// Acceptance:
//   - DDP on the G1's 29-DoF terrain-and-push challenge: forward distance improves over the phase-basis baseline by at least 10% with the same push (per cmaes-pvz's success criteria).
//   - iLQR fallback: the switch is automatic, no human intervention needed.
//   - MPPI with DDP warm start: the per-step cost is within 1% of the no-warm-start MPPI cost at the same K and H; the warm start reduces the number of K rollouts needed by at least 30% to reach the same cost.
//   - Rollout DP on CMA-ES: 3 hyperparameter dimensions converge in 5 generations of outer CMA-ES with 10 inner training runs each.
//
// Citations:
//   - Bertsekas 2008-2020 (rollout algorithms, approx DP textbook).
//   - Jacobson & Mayne 1970 (DDP original); Tassa, Mansard, Todorov 2014 (control-limited DDP).
//   - Li & Todorov 2004 (iLQR).
//   - Williams, Aldrich, Theodorou 2015-2017 (MPPI).
//   - Williams, Wagener, Goldfain, Drews, Rehg, Theodorou, Albrecht 2017 (information-theoretic MPC).
//   - Rawlings, Mayne, Diehl 2017 (MPC textbook).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3e (obstacle avoidance) — sibling
//   - cmaes-r3i (rigid dynamics) — blocks
//   - cmaes-pvz (multi-factor objective) — in_progress
//   - cmaes-jhv (PPO/GAE training crate, future) — open
