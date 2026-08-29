// cmaes-r3q — CMA-ES as base policy for rollout DP
//
// Background: Bertsekas 2008-2020 (rollout algorithms, approx DP) shows that you can get DP-style performance by combining an arbitrary base policy with one-step lookahead via Monte Carlo. CMA-ES on the residual-policy weights is a natural base policy; rollout over K rollouts of the policy under the same cost function gives a value estimate that biases the next CMA-ES generation toward better hyperparameters. This is the cmaes-jk1 (CMA-ES outer HPO loop) bead's first real consumer.
//
// Stack contents:
//   1. Base policy: the existing CMA-ES-trained 5040-D residual policy (per RESEARCH_G1_LEARNING.md §3).
//   2. Cost function: the multi-factor objective from cmaes-pvz (in_progress).
//   3. Rollout: for each candidate hyperparameter, run K=10 inner training runs (truncated at 100 generations each); compute the mean final cost; use that as the rollout DP value estimate.
//   4. Outer CMA-ES: 10 hyperparameters (inner LR, Muon momentum, entropy coefficient, reward weights × 4, GAE lambda, value coef); 30 generations; 30 × 10 = 300 inner trainings per outer generation; 9000 inner trainings total.
//   5. Convergence: the outer CMA-ES converges in 30 generations to a 5% improvement over the inner-only baseline.
//
// Acceptance:
//   - The rollout DP improves the final cost by 5% over the no-rollout inner-only baseline on the same compute budget.
//   - The outer CMA-ES is reproducible: 3 different Philox seeds converge to the same hyperparameter region (within 0.1 of the median).
//   - The compute budget is logged and reproducible: 9000 inner trainings × 100 generations each = 900k inner generations, fits in a 4-hour budget on a 32-core box.
//
// Citations:
//   - Bertsekas 2008-2020 (rollout algorithms, the standard reference).
//   - Hansen & Ostermeier 2001 (CMA-ES original).
//   - Akimoto et al. 2012 (IGO natural-gradient view of CMA-ES, per RESEARCH_G1_LEARNING.md §2).
//   - Williams, Aldrich, Theodorou 2015-2017 (MPPI as rollout-based control).
//   - Muon literature: arXiv 2509.24406 (theory); "When Does Muon Help Agentic RL?" 2026.
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3g (DP-style control stack) — sibling
//   - cmaes-pvz (multi-factor objective) — in_progress
//   - cmaes-jhv (PPO/GAE training crate) — open
//   - cmaes-jk1 (CMA-ES outer HPO loop) — open
