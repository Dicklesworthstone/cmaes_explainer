// cmaes-r3m — Collision stack foundation
//
// Background: cmaes-u53 (multi-obstacle scenes, in_progress) ships a single OBB-collision primitive but not the full stack. The new stack must be honest about what the kernel can and cannot detect, so the rendering and physics layers can refuse to over-claim.
//
// Stack contents (each as a sub-task):
//   1. GJK (Gilbert-Johnson-Keerthi 1988) for general convex-vs-convex; distance-only is the safest mode.
//   2. EPA (Cameron 1997) for penetration depth on convex-vs-convex; refuses if a deep non-convex intersection is detected (decomposed to a convex hull first).
//   3. MPR (Chung, Game Programming Gems 7 2008) for sphere-vs-OBB and convex-hull-vs-OBB; used for furniture-on-furniture in real time.
//   4. BVH-SA broadphase (Lauterbach 2009 dynamic BVH; Gottschalk 1996 OBB-tree; Akenine-Möller BVH4/BVH8) with refit when bodies move > 5% of their bounding radius.
//   5. CCD via conservative advancement (Redon 2002, Zhang 2006) for any rigid body that can move > half its size in one substep (rolled balls, knocked objects).
//   6. SDF for the floor and any convex obstacle, so the G1's foot sensors can query "distance to ground" in O(1).
//   7. Pairwise penetration depth primitive (general polyhedra) for the clipping-detection layer (r3n).
//
// Acceptance:
//   - All seven primitives live in a new `fs-collision` crate under frankensim, in pure Rust, with Wasm and native builds.
//   - Property-based tests: spheres must never interpenetrate after one step at typical velocities; penetration depth of two interpenetrating cubes matches a hand-computed value within 1e-4 m; BVH refit is O(n) and remains so for n=1000 dynamic bodies.
//   - The kernel exposes a `CollisionReport` struct (per-step: broadphase pair count, narrowphase pair count, CCD ratio, max penetration depth) as part of the existing admission receipt.
//   - This bead depends on cmaes-u53 being merged first; u53 owns the admission/receipt contract, we layer the stack under it.
//
// Citations:
//   - Gilbert, Johnson, Keerthi 1988 (GJK) — original.
//   - Cameron 1997 (EPA) — penetration depth.
//   - Chung 2008 (MPR) — Game Programming Gems 7, Minkowski portal refinement.
//   - Redon 2002, 2004 (CCD, conservative advancement).
//   - Zhang, Redon, Kim 2006 (continuous collision detection between deforming objects).
//   - Gottschalk 1996 (OBB-tree); Akenine-Möller (BVH4/BVH8); Lauterbach 2009 (dynamic BVH refit).
//   - Teschner 2003 (spatial hashing) — fallback broadphase for soft bodies.
//   - van den Bergen 1997 (AABB tree) — fallback for static scenes.
//
// Owner: PearlCitadel.
//
// Dependencies (this bead will depend on):
//   - cmaes-u53 (multi-obstacle kernel foundation) — in_progress
//   - cmaes-a0f (population eval harness) — closed
