// cmaes-r3e — Obstacle avoidance stack (RRT* + MPPI + CBF)
//
// Background: "Part of the objective for the humanoid and the arm robots should be robust obstacle avoidance." The current G1/arm objective (per cmaes-pvz, in_progress) is a single-scalar rollup that over-weights work and slip. The new avoidance stack makes the obstacle-avoidance a first-class objective: the G1 must reach the goal while never penetrating a BoundaryVolume (r3n) by more than 0.05 m, and the planner must explain *how* it avoided.
//
// Stack contents:
//   1. Voxelization: at the start of each rollout, the kernel-side scene is voxelized to a 0.1 m grid (or coarser, depending on the scene). The voxelization is cached in the admission report.
//   2. RRT* global planner (Karaman & Frazzoli 2011): the high-level plan is a path from the start to the goal that minimizes path length while keeping clearance to obstacles > 0.3 m. The RRT* runs in a Web Worker before the rollout.
//   3. MPPI local controller (Williams 2015-2017): a receding-horizon local controller that re-plans every 50 ms with K=512 rollouts of horizon H=20 steps. The cost is distance-to-goal + distance-to-obstacle + slip-penalty + work-penalty.
//   4. CBF safety filter (Ames 2019, 2020): a quadratic program (QP) that takes the MPPI output and projects it into the safe set. The QP is solved in 0.2 ms via OSQP-Eigen or a hand-rolled QP solver for the small-dof case.
//   5. Multi-factor objective: the existing admission receipt is extended with clearance, contact-schedule mismatch, work, and slip terms (per the cmaes-pvz multi-factor direction).
//
// Acceptance:
//   - RRT* finds a path in the kitchen-floorplan scene from the start to the dining-table goal in < 100 ms.
//   - MPPI runs at 20 Hz in a Web Worker with K=512 and H=20; the per-step cost is within 5% of the analytic MPC for a known linear-quadratic system.
//   - CBF filter successfully stops the G1 from penetrating a BoundaryVolume when the MPPI proposes a violating input.
//   - The G1 walking through the living room avoids the sofa and the library table on a clean test: zero contact, zero penetration depth > 0.05 m, distance to goal minimized.
//
// Citations:
//   - LaValle 1998 (RRT); Kavraki 1996 (PRM); Karaman & Frazzoli 2011 (RRT*).
//   - Williams, Aldrich, Theodorou 2015-2017 (MPPI).
//   - Ames, Coogan, Egerstedt, Notomista, Sreenath, Tabuada 2019 (CBF survey).
//   - Ames, Xu, Grizzle, Tabuada 2017 (CBF for bipedal walking, the original robotics CBF paper).
//   - Khatib 1986 (artificial potential field, the baseline we beat).
//   - Fox, Burgard, Thrun 1997 (DWA, the fallback).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3n (clipping detection) — blocks
//   - cmaes-r3i (rigid dynamics) — blocks
//   - cmaes-r3m (collision stack) — blocks
//   - cmaes-r3u53 (multi-obstacle kernel) — in_progress
