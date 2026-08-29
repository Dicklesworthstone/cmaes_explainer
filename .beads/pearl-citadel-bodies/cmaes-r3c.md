// cmaes-r3c — Parameterized asset factory (single source of truth)
//
// Background: the project already has houseScenes.ts (the Sears Craftsman floorplan schema) but the geometry today is hardcoded box meshes. The new factory takes a parameter record (a single Rust struct + a TS mirror) and produces BOTH a render mesh (Three.js BufferGeometry) AND a collider mesh (fs-rigid RigidBody descriptor). The factory is the single source of truth — visual changes and physics changes cannot disagree (doctrine rule 8 of the threejs-visualizations skill).
//
// Stack contents:
//   1. Per-piece schema: identifier, room, footprint (x, y, z), height, yaw, material class (wood/fabric/ceramic/metal/glass), functional parts (drawers, doors, shelves, handles), author metadata.
//   2. Procedural geometry: from the schema, generate BoxGeometry + lofted BufferGeometry for cylindrical / curved pieces; subdivide per the LOD policy (close pieces have more polys).
//   3. Collider generation: from the same schema, produce a convex hull or a set of OBBs (decomposed via Lien 2008 / Dekker 2018) for fs-rigid.
//   4. Articulation hooks: drawers, doors, and handles expose "graspable" + "openable" annotations; the arm's manipulation layer reads these.
//   5. Asset gallery in app: a small dev-only gallery page that lists every parameterized piece and lets the dev re-roll parameters (for the next version).
//
// Acceptance:
//   - 25 furniture pieces (every entry in the current houseScenes schema) parameterized; each produces the same render mesh as today and a collider mesh with mass / inertia tensor / material class.
//   - 5 new pieces added (rolling-pin, laundry basket, treadmill, trash can, refrigerator) to exercise the parameterized surface.
//   - The factory runs in < 50 ms for 100 pieces on a typical laptop (tested in CI).
//   - The arm's manipulation layer can read the articulation hooks (at least one openable drawer per kitchen scene).
//   - r3a (photo-real rendering) consumes the factory; r3i (rigid dynamics) consumes the factory.
//
// Citations:
//   - SketchUp/Blender parametric modeling literature (procedural-first philosophy).
//   - Lien 2008 (approximate convex decomposition), Dekker 2018 (improved decomposition).
//   - FRep literature (Bloomenthal & Wyvill 1990; functional representation for parametric solids).
//   - PartNet (Mo et al. 2019, CVPR) — inspiration for the part hierarchy; not used as data.
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-594 (house scene config) — closed, this bead is the runtime form of the schema
//   - cmaes-r3i, cmaes-r3a, cmaes-r3b (consumers)
