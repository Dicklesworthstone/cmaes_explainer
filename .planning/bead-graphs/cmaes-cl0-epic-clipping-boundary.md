# Epic 4: Ultra-accurate clipping & boundary detection

**Owns:** the geometry representations and query kernels that make "is this point inside this body? did these two bodies touch? what is the signed distance from this segment to the nearest obstacle?" cheap and provably correct.

**Why now:** the user directive calls for "ultra accurate clipping detection and physical boundary detection so the physics are accurately modeled with ~/projects/frankensim physics." Combined with Epic 3 (multi-body), we need a query layer that supports both the kernel's narrowphase and the renderer's contact shadow / occlusion queries. A pure mesh-vs-mesh pipeline is too slow and too fragile; SDFs are the SOTA answer.

**Reference points (SOTA 2025-2026):**
- "Alternating Spatial-Temporal Optimization for Continuous Collision Detection" (CGF 2025) — https://onlinelibrary.wiley.com/doi/10.1111/cgf.70570
- "Novel Algorithms for Smoothly Differentiable and Efficiently Representable SDFs" — https://arxiv.org/html/2604.17538
- "Neural NMPC through Signed Distance Field Encoding for Collision Avoidance" (IJRR 2025) — https://journals.sagepub.com/doi/full/10.1177/02783649251401223
- "Neural network-based collision detection for complex surface" (Measurement 2026) — https://www.sciencedirect.com/science/article/pii/S0263224126007517
- "Collision detection in multibody problems: State of the art" (IMechE 2026) — https://journals.sagepub.com/doi/10.1177/14644193261425501
- openxrlab/xrtailor two-phase broad/narrow — https://deepwiki.com/openxrlab/xrtailor/5-collision-detection

## Background and goals

Clipping / boundary detection is the geometric substrate of *every* downstream system:
- The kernel's narrowphase (Epic 3) needs `signedDistance(segment, body)` and `penetrationDepth(bodyA, bodyB)`.
- The renderer's contact shadows (Epic 1 pr5) need `occluded(light, point)`.
- The obstacle-avoidance objective (Epic 5) needs `clearance(robotPose, scene)` and `gradient(clearance)`.
- The visible behavior of the robots (Epic 6) is *defined* by these queries: if a query is wrong, the G1 will appear to clip into a chair.

Today the kernel uses OBB-vs-OBB and a single GJK test for the one-obstacle scene. There is no SDF, no broadphase (because there is one body), and no support for the dynamic-furniture scenarios the user is asking for.

This epic builds a geometry-query layer that:
- Uses BVH (BVH/SAH from Epic 1) for the broadphase.
- Uses analytic SDFs for the primitives (box, sphere, cylinder, capsule, OBB).
- Uses precomputed triangle-mesh SDFs for the parameterized furniture (Epic 2) with optional neural refinement for the small-distance regime.
- Supports time-of-impact (CCD) for fast-moving bodies via the alternating-spatial-temporal pattern (CGF 2025).
- Provides a *differentiable* SDF for the safety objective in Epic 5.

## Sub-tasks (children)

- `cmaes-cl1` (P1, feature): **BVH/SAH broadphase** — top-down SAH construction over triangle meshes; incremental refit when bodies move; double-buffered AABB so queries during a step are coherent. Target: 10k triangles per piece × 30 pieces = 300k tris; broadphase query in ≤ 50 µs.
- `cmaes-cl2` (P1, feature): **Analytic primitive SDFs** — box, sphere, cylinder, capsule, OBB, plane, heightfield. All return signed distance + gradient + Lipschitz constant. Unit tests verify `|sdf(p)| ≤ |p - closestPoint|` and `gradient.normalized()` is unit-length.
- `cmaes-cl3` (P1, feature): **Triangle-mesh SDF** — for furniture meshes (Epic 2). Precompute a 3D distance field on a sparse grid (e.g., 64³ for a 1 m piece) + a tight triangle acceleration structure. Lipschitz bound = 1.0. Bounded error ≤ grid cell / 2. Fall back to a per-triangle distance when the grid is too coarse.
- `cmaes-cl4` (P1, feature): **Differentiable SDF (smooth + neural refinement)** — the SDF must be C¹-smooth so the safety objective in Epic 5 can take a gradient. Use the smoothly-differentiable representation from the arXiv 2604.17538 paper; in the near-surface band, a tiny MLP refines the analytic SDF to match the true mesh (with a documented Lipschitz bound). Output includes the smooth field + an uncertainty band.
- `cmaes-cl5` (P1, feature): **Penetration depth & contact manifold** — given two SDFs, the smallest translation separating them, plus a contact manifold (points + normals). For articulated bodies, also output the set of active joint impulses implied by the contact. This is the input to the LCP solver (Epic 3 ph4).
- `cmaes-cl6` (P1, feature): **Continuous collision detection (CCD) on SDFs** — for fast-moving segments (e.g., a G1 swing leg) vs slow furniture. Alternating spatial-temporal optimization per the CGF 2025 paper; sub-millimeter accuracy; sub-100 µs per pair. Test: a fast segment grazes a chair leg at 0.1 mm clearance and the kernel reports contact at exactly the right step.
- `cmaes-cl7` (P2, feature): **Heightfield SDF** — for the outdoor terrain (the cmaes-7y3 flat / terrain-and-push toggle). Sparse voxel + analytic bilinear. Used by the G1 foot contact + the obstacle-avoidance objective.
- `cmaes-cl8` (P2, feature): **Clearance query** — given a robot pose, the clearance to the nearest obstacle, plus a unit vector pointing to the nearest free direction. Used by the CBF / safety filter in Epic 5. Lipschitz-bounded.
- `cmaes-cl9` (P2, feature): **Self-intersection test** — for the G1's whole body (every link) and the arm's every link, verify no two links penetrate. Catches animator bugs and bad training rollouts. Output: a list of self-intersecting pairs.
- `cmaes-cl10` (P3, feature): **Neural refinement per piece** — train a small per-piece MLP (≤ 20k params, 2 forward-pass layers) on the residual between the analytic SDF and the true mesh; freeze at bake time; runtime uses analytic + residual. Honest about the residual bound. Update: only when Epic 2 cmaes-fg2 ships a new mesh revision.
- `cmaes-cl11` (P3, feature): **Query telemetry** — every query (sdf / penetration / clearance / ccd) emits `(kind, µs, bytesRead, hitCount)` into the trace. Consumed by the multi-factor objective in Epic 6 to penalize scenes that spend too long in the geometry layer.

## Acceptance criteria (epic level)

- A 30-piece scene runs 720 rollout steps in ≤ 8 ms per step on a desktop browser (currently 5-piece + 1 G1 ≤ 2 ms; budget ≈ 4× for the larger scene).
- A 0.1 mm clearance test between a fast segment and a chair leg is detected at the correct step (CCD test).
- A G1 self-intersection test catches the cmaes-pvz regression-style tilt without the kernel having to terminate on base height.
- All SDF queries are C¹-smooth on the interior and the exterior (except at the surface, where the gradient is well-defined up to the Lipschitz bound).
- All geometry is deterministic (mesh → grid → SDF is byte-identical across runs; no FP order ambiguity).
- bun test green; cmaes-nxj and cmaes-pvz-related tests still pass.

## Dependencies (blocking)

- Epic 2 (cmaes-fg0): the parameterized geometry catalog this epic queries.
- Epic 3 (cmaes-ph0): the contact resolution and LCP solver this epic feeds.
- `/Users/jemanuel/projects/frankensim` for the kernel crate.

## Dependents (this epic blocks)

- Epic 5 (obstacle-avoidance safety filter uses clearance + gradient).
- Epic 6 (multi-factor objective uses the geometry-layer telemetry).

## Cross-cutting constraints

- Determinism: every SDF query returns the same answer given the same inputs; no platform-dependent FP reorder.
- Memory budget: per-piece mesh SDF ≤ 1 MiB; heightfield SDF ≤ 2 MiB; BVH ≤ 1 MiB; total per-scene ≤ 32 MiB.
- Honest accuracy bound: every SDF consumer can ask "what is your Lipschitz constant?" and "what is your worst-case error?" and the answer is exact.
- The kernel refuses to advance if any CCD test fails (refusal envelope policy).

## References

- https://onlinelibrary.wiley.com/doi/10.1111/cgf.70570 (CGF 2025 CCD on SDFs)
- https://arxiv.org/html/2604.17538 (differentiable SDFs)
- https://journals.sagepub.com/doi/full/10.1177/02783649251401223 (Neural NMPC SDF, IJRR 2025)
- https://www.sciencedirect.com/science/article/pii/S0263224126007517 (neural collision detection)
- https://journals.sagepub.com/doi/10.1177/14644193261425501 (IMechE 2026 multibody review)
- https://deepwiki.com/openxrlab/xrtailor/5-collision-detection (broadphase / narrowphase pattern)
