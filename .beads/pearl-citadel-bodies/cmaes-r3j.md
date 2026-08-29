// cmaes-r3j — Soft-body proxies for cushions, fabric, food items
//
// Background: the user directive says furniture "can be jostled, fall down, roll if possible." A pillow on a sofa is not a rigid body; it deforms on contact. We adopt XPBD (Macklin & Müller 2016) for the soft bodies: position-based dynamics with a per-vertex compliance parameter, run on the same fixed substep as the rigid bodies.
//
// Stack contents:
//   1. Per-vertex mass + compliance from the r3c asset factory: pillows have a high compliance; ceramic plates have a near-zero compliance.
//   2. Volume preservation constraint: every soft body has a target volume; the constraint is enforced every step to keep the body from collapsing.
//   3. Self-collision: a cheap spatial hash broadphase (Teschner 2003) plus a per-vertex narrowphase against the body's own mesh.
//   4. Rendering: the visual mesh deforms with the simulated positions; the collider is the convex hull of the rest pose (cheap).
//
// Acceptance:
//   - A pillow on a sofa: when the G1 sits on it, the pillow deforms smoothly without collapse or explosion; the volume is preserved within 1%.
//   - A fabric tablecloth on a table: when the G1 pulls the corner, the cloth drapes; no self-intersection.
//   - A bowl of cereal: the bowl is rigid, the cereal pieces are soft; the bowl can be jostled and the cereal sloshes.
//
// Citations:
//   - Macklin, Müller 2016 (XPBD, position-based with compliance).
//   - Macklin, Müller, Chentanez 2016 (XPBD for rigid bodies, the same algorithm applied to rigid constraints).
//   - Liu 2020 (XPBD for rigid bodies dissertation, detailed treatment).
//   - Teschner 2003 (spatial hashing, broadphase for self-collision).
//   - Teschner, Kim, Sorkine, Thuerey 2020 (soft-body tutorial, state of the art review).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3i (rigid dynamics) — sibling (same fixed substep, same contact resolver)
//   - cmaes-r3c (parameterized asset factory) — produces the per-vertex mass + compliance
