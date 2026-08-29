// cmaes-r3i — Rigid-body dynamics with TGS solver
//
// Background: frankensim already has fs-mbd for the G1's own articulated body (via SE(3) integration, PGS-style). For the *furniture* and *appliances* that the G1/arm can interact with, we need a general-purpose rigid-body solver that is fast enough to step hundreds of objects at 60 Hz in a browser worker.
//
// Solver: Temporal Gauss-Seidel (TGS) — Catto 2005+; modernized in Box2D 2.4+; the same family as the fs-mbd inner loop. TGS converges stacks faster than SI because it uses the "soft" normal impulse from prior iterations as the new warm start.
//
// Sub-tasks (each as a sub-bead or part of this bead's body):
//   1. TGS solver with 8–12 iterations per step; warm start from the prior step's impulses.
//   2. Impulse formulation: Mirtich 1996 thesis + Catto's "Modeling and Solving Constraints" GDC 2014.
//   3. Friction model: Coulomb with a per-material friction coefficient from a catalog (wood, fabric, ceramic, metal, glass). See r3l.
//   4. Sleeping: bodies that have not moved above an epsilon for N consecutive steps go to sleep; sleeping bodies skip the solver pass.
//   5. Mass distribution: per-body inertia tensor computed from the parameterized geometry at factory time (r3c).
//   6. Continuous-time integration: semi-implicit Euler with substepping at 480 Hz (matches the G1 frequency); rendered at 60 Hz via interpolation between substep states.
//
// Acceptance:
//   - The new `fs-rigid` crate (sibling to fs-mbd) exposes `RigidBody`, `RigidBodyWorld`, and a `step(dt: f32) -> CollisionReport` function.
//   - 1000 dynamic cubes at rest on a floor: no drift after 10s simulation; sleeping kicks in within 100 ms.
//   - A knocked book slides, decelerates from friction, and stops within 5% of the analytic distance.
//   - A rolling sphere on a flat surface: the limit surface (r3k) keeps it rolling without slipping; the speed decays per the friction model.
//   - A stack of 5 books: TGS converges in 6 iterations; no jitter; no explosion.
//   - All builds green; r3m (collision stack) consumed by this crate; r3l (friction cone) consumed by this crate; r3k (rolling contact) consumed by this crate.
//
// Citations:
//   - Catto 2005 (Erin Catto's GDC slides, "Iterative Dynamics with Temporal Coherence").
//   - Catto 2014 (GDC, "Modeling and Solving Constraints").
//   - Mirtich 1996 (Impulse-based Dynamics, Berkeley PhD thesis).
//   - Goyal 1989 (limit surface, 2D) — extended to 3D in r3k.
//   - Erdmann 1994, Howe & Cutkosky 1996, Murphey & Burdick 2004 (friction cone treatment).
//   - Box2D 2.4 source (TGS reference impl).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3m (collision stack) — blocked by
//   - cmaes-r3l (friction cone catalog) — blocked by
//   - cmaes-r3c (parameterized asset factory) — produces the inertia tensors
