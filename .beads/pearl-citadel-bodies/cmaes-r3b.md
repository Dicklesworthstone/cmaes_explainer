// cmaes-r3b — Physically-based materials with IBL
//
// Background: the current materials are meshStandardMaterial with rough/metalness/roughness scalar values; no IBL envmap, no normal maps, no roughness textures. To reach "photo-real with accurate lighting and textures" we adopt a PBR pipeline with image-based lighting from a PMREM-baked environment map.
//
// Stack contents:
//   1. Material catalog per material class: wood, fabric, ceramic, metal, glass. Each entry: base color, roughness, metalness, normal map, optional ao map, optional emissive. All from public-domain or CC0 sources (ambientCG, Poly Haven, Quaternius — see RESEARCH_PHOTOREAL_HOUSE_PHYSICS.md §2.8).
//   2. PMREM-baked environment maps per scene (living room, kitchen, bedroom, bath, porch). One high-res map per scene; LODs at runtime per the camera distance.
//   3. PBR material bound to the parameterized asset factory (r3c): same material instance per material class, instanced across pieces.
//   4. Shader upgrade: full energy-conserving Cook-Torrance specular + Lambertian diffuse (per Pharr, Jakob, Humphreys 2023, PBR textbook of record).
//   5. Honesty banner: any material that we cannot fully model (e.g. transmissive glass with caustics) gets a "simplified material, no caustics" label in the existing honesty chip stack.
//
// Acceptance:
//   - All 5 material classes implemented as PBR with IBL; metalness / roughness / normal maps loaded from ambientCG or Poly Haven CC0 assets committed to the repo.
//   - A sphere at the kitchen counter under the IBL envmap reads visually correct: ceramic diffuse, wood contact, glass reflection from the window.
//   - The same sphere with metalness 1.0 reads as a chrome ball; the same sphere with metalness 0.0 reads as a plastic ball; both transitions are smooth (the roughness controls the highlight blur).
//   - Material performance budget: a single material instance draws all 25 furniture pieces at < 0.5 ms on a typical laptop.
//   - All CC0 / public-domain assets are committed; the README documents the source and license per piece.
//
// Citations:
//   - Pharr, Jakob, Humphreys 2023 (PBR textbook of record).
//   - Karis 2014 (TAA; we need it for IBL stability).
//   - Filament PBR pipeline (open source, ongoing) — reference impl.
//   - ambientCG, Poly Haven, Quaternius (CC0 asset catalogs).
//   - Disney BRDF 2012 (Burley) — the principled model we adopt.
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3c (parameterized asset factory) — blocks
//   - cmaes-r3a (photo-real rendering) — sibling
