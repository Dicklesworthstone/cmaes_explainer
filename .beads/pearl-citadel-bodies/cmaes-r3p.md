// cmaes-r3p — Appliance RNG (refrigerator, oven, microwave, washing machine doors)
//
// Background: the kitchen scene has a refrigerator, an oven, a microwave, and a washing machine. The current rendering treats them as static boxes. The new bead exposes their doors as articulated bodies that can be opened by the G1 or the arm. The articulation is a revolute joint with a hinge axis and a torque limit; the door's mass and inertia are produced by r3c.
//
// Stack contents:
//   1. Revolute joint with hinge axis and torque limit.
//   2. Door open/close animation: when the G1's hand approaches the handle, the door opens; when the G1 steps away, the door closes (with a damped spring).
//   3. Interior content: the refrigerator has shelves, the oven has a rack, the microwave has a turntable. The interior content is a small set of parameterized assets from r3c.
//   4. Audio (optional, deferred): a soft click when the door opens; out of scope for the first version.
//
// Acceptance:
//   - The G1 can open the refrigerator door: the hinge rotates smoothly, the door stops at the torque limit, the door does not fall off its hinge.
//   - The arm can open the oven door: same behavior, with the arm's manipulation layer reading the handle's "graspable" annotation from r3c.
//
// Citations:
//   - Catto 2005 (constraint solvers, the basis for the joint solver).
//   - Featherstone 2008 (Rigid Body Dynamics Algorithms, the canonical textbook on articulated bodies).
//   - Mirtich 1996 (impulse-based dynamics, the basis for the joint impulse).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3i (rigid dynamics) — blocks
//   - cmaes-r3c (parameterized asset factory) — blocks
