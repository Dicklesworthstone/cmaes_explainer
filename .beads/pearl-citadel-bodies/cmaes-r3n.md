// cmaes-r3n — Clipping detection + boundary-volume primitive
//
// Background: the user directive is explicit: "ultra accurate clipping detection and physical boundary detection so the physics are accurately modeled with ~/projects/frankensim physics." The kernel must own the clipping answer, not the renderer. The renderer can ask "is link L penetrating volume V by depth d?" and the kernel answers yes/no with a depth. This is the inverse of the renderer's question today ("show me the link's pose") and is what makes the rendered output auditable against the physics truth.
//
// Stack contents:
//   1. Boundary-volume primitive: a Rust struct `BoundaryVolume { shape: OBB | Sphere | Capsule | ConvexHull, transform: SE3 }` consumed by both the renderer (for the honesty-overlay tint) and the kernel (for the objective / clip check).
//   2. Penetration-depth query: pairwise penetration depth from r3m (EPA on convex hulls, primitive case otherwise). The query returns (depth, contact normal, contact point).
//   3. The G1's link frames are consumed directly from the kernel's pose stream; no client-side pose reconstruction.
//   4. Honesty overlay: the renderer tints any link whose penetration depth > 0 by a red emissive (per the existing boundaryBoxes pattern in HouseholdArmFlagship). The tint is *off* when penetration depth is 0.
//   5. Admission receipt: the kernel exposes the max penetration depth across all G1 links in its existing admission report.
//
// Acceptance:
//   - The G1's hand and foot penetrate a 0.4 m tall kitchen-island box by 0.05 m: the hand tint is red, the kernel receipt reports 0.05 m penetration depth; the run flags the contact as a violation in the existing compliance report.
//   - The G1's hand at the surface (depth = 0): the hand tint is neutral; the kernel receipt reports 0 m; no violation.
//   - Penetration depth matches a hand-computed value within 1e-4 m for a sphere intersecting a cube.
//
// Citations:
//   - Dobkin et al. 1993 (pairwise penetration depth, original).
//   - Cameron 1997 (EPA, on convex hulls).
//   - Chung 2008 (MPR, on primitives).
//   - van den Bergen 1997 (GJK variant with penetration depth).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3m (collision stack) — blocks
//   - cmaes-r3i (rigid dynamics) — blocks
//   - cmaes-r3a (photo-real rendering) — sibling
