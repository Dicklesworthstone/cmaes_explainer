// cmaes-r3k — Rolling contact via 3D limit surface
//
// Background: the user directive says furniture "can be jostled, fall down, roll if possible." A real sphere or cylinder on a flat surface rolls without slipping only if the contact constraint enforces the no-slip velocity (Goyal 1989 for 2D, Howe & Cutkosky 1996 and Caron 2020s for 3D). The classical Coulomb friction cone handles the *translational* friction but not the *angular* friction that couples to the rolling.
//
// Stack contents:
//   1. 3D limit surface parameterization (Caron 2020s) per (material, contact geometry) pair. The limit surface is the convex hull of all achievable (linear-impulse, angular-impulse) pairs at a contact.
//   2. Solver integration with r3i: when a body is in rolling contact, the solver projects the contact impulse onto the limit surface; any component outside the surface is "rolling friction" and dissipates energy as heat.
//   3. Spheres, cylinders, and torus geometries are first-class citizens (the typical rolling pieces in a kitchen and living room).
//
// Acceptance:
//   - A sphere on a flat surface, given an initial translational velocity, rolls without slipping and decelerates per the friction model. The deceleration is within 5% of the analytic rolling-friction value at the mean friction coefficient.
//   - A cylinder (rolling-pin) on a flat surface, given an initial angular velocity, transitions to rolling-without-slipping in < 1 s; the post-transition linear velocity matches v = ω * r within 1%.
//   - A sphere on a flat surface with initial angular velocity only spins in place; the rolling friction dissipates the spin within the catalog mean stopping time.
//   - A sphere on a flat surface under a 5° incline: rolls downhill at the catalog mean acceleration.
//
// Citations:
//   - Goyal 1989 (planar limit surface, original).
//   - Howe & Cutkosky 1996 (limit surface for 3D compliant contact).
//   - Caron 2020s (modern 3D limit surface, contact-space convex optimization).
//   - Erdmann 1994 (geometric view of friction in higher-dof systems).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3i (rigid dynamics) — blocked by
//   - cmaes-r3l (friction cone catalog) — blocked by
