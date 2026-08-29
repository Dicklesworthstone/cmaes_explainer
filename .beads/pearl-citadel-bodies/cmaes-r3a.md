// cmaes-r3a — Photo-real rendering pipeline
//
// Background: the rendering pipeline is currently one render pass with ACES tonemapping, a 5-light rig (key+fill+ground-bounce+rim+spot), shadows from one directional light. To reach "photo-real with accurate lighting and textures" we add PBR + IBL (r3b), DDGI probe-based global illumination (r3d), screen-space reflections for the polished floor, TAA for stability, and HDR envmaps per scene. Mode P fleet rule (threejs-visualizations skill, doctrine rule 2, OP-9): no EffectComposer / bloom. Glow via additive sprites + emissive only.
//
// Stack contents:
//   1. Renderer upgrade: ACESFilmicToneMapping, sRGB output, PCFSoftShadowMap, dpr cap at 2, fixed 60 Hz cap with virtual time.
//   2. Per-scene envmap: PMREM from the HDR per scene (kitchen, living room, bedroom, bath, porch, outdoor-flat, outdoor-rough).
//   3. DDGI probe grid: 8x4x4 probes per scene; irradiance and distance per probe; update every 4 frames; final irradiance from probe trilinear interpolation.
//   4. Screen-space reflections: standard SSR for the polished kitchen and bath floors; roughness threshold gates the contribution.
//   5. TAA: Karis 2014 algorithm; clamps to a 4-frame history; velocity buffer from the kernel's link poses.
//   6. Shadows: VSM/ESM with bias -0.0002; single caster (the G1) with 2048² shadow map.
//   7. Honesty banner: any GI approximation (DDGI, VSM, SSR) is labeled in the existing honesty chip stack as "approximation, not path-traced."
//
// Acceptance:
//   - The G1 flagship with the new pipeline: the photo-real acceptance evidence is a side-by-side PNG at 1440x900 with the current pipeline vs the new pipeline, captured by the validate-viz.py script and stored under tmp/ui-smoke/photo-real.
//   - At 60 fps on a 2020 MacBook Pro (M1 or Intel i7), 25 furniture pieces + the G1 + IBL + DDGI render in < 16 ms per frame.
//   - At 30 fps on a typical 2018 laptop, same scene still renders under 33 ms.
//   - All CC0 / public-domain assets committed; the validate-viz.py script reports zero doctrine violations.
//
// Citations:
//   - Pharr, Jakob, Humphreys 2023 (PBR textbook of record).
//   - McGuire 2010s, Majercik 2019-2021 (DDGI).
//   - Karis 2014 (TAA).
//   - Crassin 2011 (voxel cone tracing — DDGI's conceptual ancestor).
//   - Filament PBR pipeline (open source, ongoing) — reference impl.
//   - Three.js MeshPhysicalMaterial documentation (the standard PBR we extend).
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3b (PBR materials) — blocks
//   - cmaes-r3c (parameterized asset factory) — blocks
//   - cmaes-r3d (light transport) — sibling
//   - cmaes-r3r (stage integration) — consumer
