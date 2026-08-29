// cmaes-r3l — Friction cone catalog with DRO over coefficient uncertainty
//
// Background: friction is the most under-modelled part of any rigid-body simulator. The classical Coulomb model uses a single coefficient per material pair; real materials have a distribution. We adopt DRO (Distributionally Robust Optimization, Mohajerin Esfahani & Kuhn 2018) so the kernel never silently relies on a point estimate that the catalog doesn't actually support.
//
// Stack contents:
//   1. Per-material friction coefficient catalog: wood-on-wood, wood-on-fabric, wood-on-ceramic, wood-on-metal, wood-on-glass, fabric-on-anything, ceramic-on-anything, metal-on-anything, glass-on-anything. Each entry: a distribution (mean, variance) from a curated reference (per the public-domain sources in RESEARCH_PHOTOREAL_HOUSE_PHYSICS.md §2.8).
//   2. Friction cone (Coulomb 1785; modern Erdmann 1994, Howe & Cutkosky 1996, Murphey & Burdick 2004) is the impulse-friction model used inside r3i.
//   3. DRO wrapper (Mohajerin Esfahani & Kuhn 2018) computes the worst-case friction coefficient within a Wasserstein ball of the catalog distribution. The kernel reports both the mean and the DRO-worst-case so the planner can see uncertainty.
//   4. Catalog reuse: a single Rust struct is consumed by r3i, r3j, r3k, and r3n; never duplicated.
//
// Acceptance:
//   - The catalog is a Rust module under `fs-rigid` (or a new sibling crate) with at least 9 entries (one per material class × 5).
//   - The DRO wrapper computes the worst-case within a 0.05 Wasserstein ball around the catalog mean; tests show the worst-case is at least 1.5σ above the mean in the standard normal case.
//   - The kernel's CollisionReport exposes the mean and DRO-worst-case friction coefficient per contact.
//   - A static book on a 5° inclined surface stays at rest under DRO-worst-case friction; a static book on a 30° inclined surface slips — both behaviors match the catalog mean within tolerance.
//
// Citations:
//   - Coulomb 1785 (original friction law).
//   - Erdmann 1994, Howe & Cutkosky 1996, Murphey & Burdick 2004 (modern friction cone treatment).
//   - Mohajerin Esfahani & Kuhn 2018 (data-driven distributionally robust optimization, SIAM J. Optim.).
//   - Goyal 1989 (limit surface for planar rolling).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3c (parameterized asset factory) — provides the per-piece material class
