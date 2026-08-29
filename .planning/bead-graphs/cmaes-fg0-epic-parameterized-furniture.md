# Epic 2: Parameterized furniture & household objects

**Owns:** the geometric catalog of every piece of furniture, fixture, appliance, and prop in the household scenes, expressed as parameterized geometry that the kernel (Epic 3) can simulate and the renderer (Epic 1) can light.

**Why now:** the user directive is "all the furniture and other assets in the house to be parameterized geometry a la /threejs-visualizations-with-good-quality-and-real-physics so they can be jostled, fall down, roll if possible, etc. Like real objects, furniture, appliances." Without parameterized geometry, the kernel has no mass distribution, no inertia, no contact surface to work against.

**Reference points (SOTA 2025-2026):**
- Apple RoomPlan (https://machinelearning.apple.com/research/roomplan) — 16-category 3D object detection pipeline for room-defining furniture.
- Three.js parametric geometry primitives + CSG.
- Bullet3 Multi-Body Dynamics (Featherstone) — https://deepwiki.com/bulletphysics/bullet3/2.5-multi-body-dynamics
- phyz-rigid (Rust Featherstone) — https://lib.rs/crates/phyz-rigid
- softmata/featherstone (Rust) — https://github.com/softmata/featherstone
- DART dynamics pipeline — https://deepwiki.com/dartsim/dart/3.3-dynamics-computation-pipeline

## Background and goals

Today the household catalog in `app/lib/houseScenes.ts` defines furniture as `name, room, center, size, height` oriented boxes. That is enough to draw a flat box on screen but not enough to:
- Distinguish a *sofa* (upholstered, heavy, low CoG, can tip) from a *side table* (light, can slide, has a top surface that matters for arm place).
- Generate a contact graph that the kernel (Epic 3) can use to jostle / knock over pieces.
- Roll a *bar stool* but not a *rocking chair* (one is a cylinder, the other is a multi-DoF articulation).
- Let a fridge door swing open so the arm can reach in (articulation; joints + limits).

This epic delivers the *parameterized geometry catalog* — declarative descriptions that drive both the renderer (Epic 1) and the kernel (Epic 3). It also defines the **articulation graph** for any piece with moving parts.

## Sub-tasks (children)

- `cmaes-fg1` (P1, feature): **Furniture category taxonomy** — top-level `FurnitureKind` enum with 30+ categories: seating (sofa, armchair, dining chair, stool, rocking chair, office chair), tables (dining, coffee, side, console, desk), storage (dresser, bookshelf, cabinet, wardrobe, pantry, hutch), beds (twin, queen, bunk, crib), appliances (fridge, oven, range hood, dishwasher, microwave, washer, dryer), fixtures (sink, toilet, bathtub, shower, vanity, mirror), decor (lamp, rug, curtain, picture frame, plant, vase, books, fireplace, TV), food (plate, glass, mug, bottle, can, pan, knife, cutting board), tools (vacuum, broom, mop, bucket), outdoor (grill, patio chair, planter, hose reel). Each kind has a default size envelope, a mass range, a CoG, a friction class, and an articulation pattern.
- `cmaes-fg2` (P1, feature): **Procedural shape generation** — given a `FurnitureSpec { kind, dims, mass, material }`, build a watertight mesh: convex primitives for boxy pieces, swept/revolved surfaces for cylindrical pieces, lathe + bevel for turned legs and handles, B-spline for soft edges and cushions. Output is a `THREE.BufferGeometry` (or equivalent) plus a `bv::AABB` / `bv::OBB` for the kernel.
- `cmaes-fg3` (P1, feature): **Articulation graph** — for any piece with moving parts (door, drawer, lid, recliner, rocking chair, oven), declare `joints: { name, type: revolute|prismatic|fixed, axis, limits, parent, child, mass, inertia }`. Kernel uses Featherstone-style recursive forward dynamics; renderer opens/closes the parts during the rollout.
- `cmaes-fg4` (P1, feature): **Catalog data** — extend `app/lib/houseScenes.ts` so every `furniture[]` entry has `kind: FurnitureKind, dims, mass, friction, joints, childOf?`. Provide 3 room presets (Craftsman kitchen corner, parlor, backyard porch) with 20-30 pieces each.
- `cmaes-fg5` (P2, feature): **Rolling pieces** — bar stools, office chairs, mop buckets: declare as cylinder primitives; expose `rollingAxis` and `rollingFriction`; the kernel will integrate rolling contact.
- `cmaes-fg6` (P2, feature): **Soft / deformable proxies** — cushions, pillows, stuffed toys, rugs: not full FEM, but a small number of "soft" proxy primitives that the kernel treats as a chain of rigid bodies with stiff springs (mass-spring lattice). Deforms under load, returns to rest.
- `cmaes-fg7` (P2, feature): **Appliance internals** — fridge (door + shelves + drawers), oven (door + racks), pantry (door + shelves), washer (door + drum). Each internal shelf / drawer is a child of the body and can be opened by the arm.
- `cmaes-fg8` (P2, feature): **Small objects** — plate, glass, mug, bottle, pan, knife, book, pen, remote: small-mass, high-fragility (they break / spill if jostled beyond threshold). Cylinder / lathe shapes, parameterized by diameter and height.
- `cmaes-fg9` (P2, feature): **Pets & people silhouettes (decor-only)** — a cat sleeping on a chair, a person-shaped mannequin that the G1 must navigate around. Display-only (do not collide) for now, but flagged so Epic 5 can treat them as soft obstacles.
- `cmaes-fg10` (P3, feature): **Procedural breakage** — when contact impulse exceeds a per-material threshold, the piece splits into 2-4 rigid fragments (pre-baked break patterns) with their own masses / inertias. The kernel resolves the fragments; the renderer swaps in the broken mesh.
- `cmaes-fg11` (P3, feature): **Catalog browser / spec inspector** — internal tool to render any piece in isolation, see its mass, CoG, joint graph, contact shape, and roll it on a flat plane in a small sandbox.

## Acceptance criteria (epic level)

- 30+ `FurnitureKind` values defined and documented.
- `app/lib/houseScenes.ts` extended with parameterized specs for at least 60 pieces across 3 rooms.
- A rendered scene with all parameterized pieces matches the cmaes-594 closed catalog (rooms/walls/goals unchanged) but with the boxes replaced by PBR-textured mesh.
- At least 10 pieces have non-trivial articulation (door / drawer / recliner / chair-back).
- A rolling piece (e.g. a bar stool) demonstrably rolls under a hand-applied impulse in the kernel test.
- A small-object breakage test exists and a plate shatters when impulse exceeds threshold.
- All dimensions / masses are in SI units; no imperial; no wall-clock.

## Dependencies (blocking)

- `cmaes-594` (closed): the catalog data structure this epic extends.
- `cmaes-pr0` (Epic 1, not yet created): PBR material slot assignment.
- `cmaes-3d` (Epic 3 dynamic-physics kernel, not yet created): consumes the mass/inertia/joint declarations.

## Dependents (this epic blocks)

- Epic 3 (kernel multi-body + contact resolution).
- Epic 4 (clipping / boundary detection uses the same geometry).
- Epic 5 (obstacle avoidance needs furniture bounding shapes).
- Epic 6 (G1 + arm in the photo-real household).

## Cross-cutting constraints

- The catalog must round-trip through `br sync --flush-only` without loss (it lives in TypeScript, not in a binary DB).
- The mesh must be deterministic: same `FurnitureSpec` produces the same `BufferGeometry` across reloads.
- All meshes below the 100k-vertex budget for a single piece (mobile-friendly); use LOD for any piece that exceeds.
- Provenance: every mesh references the catalog spec; the spec references the kind; the kind references the source dataset (Sears Modern Homes catalog for the Craftsman scope).

## References

- https://machinelearning.apple.com/research/roomplan (16-category 3D object detection)
- https://deepwiki.com/bulletphysics/bullet3/2.5-multi-body-dynamics (Featherstone articulation)
- https://lib.rs/crates/phyz-rigid (Rust Featherstone)
- https://github.com/softmata/featherstone (Rust robotics dynamics)
- https://deepwiki.com/dartsim/dart/3.3-dynamics-computation-pipeline (DART five-stage sim loop)
- https://resources.oreate.ai/updates/roy-featherstone-spatial-vectors-and-modern-robot-dynamics-algorithms
