# Why this epic exists (background)

The user directive for phr-env-2026 says: "This will require
ultra-accurate clipping detection and physical boundary detection so
the physics are accurately modeled with the frankensim physics stack."

This epic is the **EPIC-level summary** for that work. The detailed
feature-level work lives under `cmaes-feat-cl*` (11 feature beads
authored by CreamHare) and the implementation epic is
`cmaes-phr7-c6i` (CreamHare). I (TurquoiseFalcon) own this alias epic
so the canonical `bv --robot-triage` view groups the
clipping/boundary work under a single P1 epic in the `cmaes-phr*`
family.

# What this epic is

A canonical summary of the boundary / clipping detection math that
both flagships evaluate against. The math must:

1. Produce a signed distance query for any point in the world, with
   documented accuracy (target: 1e-3 m at the boundary), deterministic
   construction, and a C¹-continuous gradient at sampled points.
2. Produce a witness-point-paired GJK narrow-phase result for any
   pair of convex shapes (sphere, box, capsule, OBB, convex hull).
3. Produce a penetration depth + contact normal via EPA from a GJK
   simplex that has converged on the origin.
4. Produce an OBB-OBB separating-axis test with 15 axes and a contact
   manifold sampling for stable multi-point contact.
5. Decompose non-convex furniture (chair slats, table legs) into a
   union of convex OBBs, each routed through OBB-OBB.
6. Expose every collision site in `cmaesEngine.ts` and
   `frankensimCmaes.ts` through the new boundary-query API
   (typed `BoundaryQuery` interface).

# SOTA grounding (verified — see `cmaes-phr3.1` for full citations)

- **Ericson, *Real-Time Collision Detection* (Morgan Kaufmann, 2005)**
  — GJK, EPA, separating-axis theorem, BVHs, SAH construction,
  Minkowski difference, contact manifold generation. The canonical
  textbook for narrow-phase collision detection. The `cmaesEngine.ts`
  code already uses parts of this (GJK in the 128-D arm task).
- **Frisken, Perry 2002** — adaptive sampling of SDFs.
- **Mueller et al., IEEE TVCG 2014** — SDFs for articulated bodies.
- **Jo et al., ICRA 2026 (arXiv:2605.30696)** — Bernstein-polynomial
  SDFs as a 2026 SOTA alternative.
- **Bridson 2006** — computational aspects of dynamic contact
  (contact manifold).

# Acceptance (epic closes when all feature beads close AND parity test green)

- All 11 `cmaes-feat-cl*` children close.
- Browser-side parity test (RubyThrush's slice C, `cmaes-phr3m-*`)
  shows the TypeScript reference and the Rust kernel agree on every
  witness point and penetration depth.
- Every collision site in `cmaesEngine.ts` and `frankensimCmaes.ts`
  routes through the new boundary-query API.

# What I own vs. what CreamHare owns

- **TurquoiseFalcon (me)**: this EPIC bead + the SOTA research
  grounding in `cmaes-phr3.1` (math-side one-pagers).
- **CreamHare**: `cmaes-phr7-c6i` (the implementation epic) and the
  11 `cmaes-feat-cl*` children.
- **RubyThrush**: `cmaes-phr3m-meas-mlw` and the parity/perf
  measurement harnesses that gate the feature acceptance.

# Why this is an "alias epic"

Same reasoning as `cmaes-phr1`: the 11 `cmaes-feat-cl*` feature beads
cover the work at the right level of granularity. Creating
`cmaes-phr2.1..2.7` sub-beads would duplicate them. Per
`/just-say-no-to-process-porn-and-ceremony`, aliasing via parent-child
is the right call.

# Out of scope (other slices)

- The visual / PBR / light transport / parameterized-furniture
  geometry (CreamHare's `cmaes-phr4`, `cmaes-phr5`).
- The kernel-side multi-body / contact / rolling / friction
  (CreamHare's `cmaes-phr6`).
- The obstacle-avoidance objective (CreamHare's `cmaes-phr8`; my
  alias is `cmaes-phr1`).
- The measurement / parity / perf harnesses (RubyThrush's
  `cmaes-phr3m-*`).
- The CMA-ES / PPO training crate Rust work (`cmaes-j36` / `jhv` /
  `wsr` / `6m3` / `jk1`).
