// cmaes-r3d — Light transport (direct + indirect + atmospheric)
//
// Background: r3a covers the materials and the post-FX; this bead covers the lighting itself. The 5-light rig in the current G1 flagship is a good baseline for the key/fill but it is missing indirect illumination: the light from a window should illuminate the opposite wall, the warm bounce from a wooden floor should color the underside of a sofa, etc. DDGI (Majercik 2019-2021) gives us probe-grid indirect at a constant cost.
//
// Stack contents:
//   1. Direct lighting: the existing 5-light rig (key, cool fill, warm ground bounce, cool rim, spot) per the threejs-visualizations skill's standard.
//   2. Indirect via DDGI: 8x4x4 probe grid per scene; the probes are updated every 4 frames by a low-res ray march through the depth buffer + normal buffer; the final irradiance is trilinear-interpolated per fragment.
//   3. Atmospheric: a soft outdoor skybox for the outdoor-flat and outdoor-rough challenge modes (per the existing terrain-and-push toggle).
//   4. Indoor light sources: table lamps, ceiling fixtures — point lights with shadowmaps for the warm-window case.
//
// Acceptance:
//   - The kitchen scene with the window's morning light: the opposite wall (back of the room) shows indirect light from the window, not just the direct key light.
//   - The living room with the warm-wood floor: the underside of the sofa is tinted warm (the bounce).
//   - The outdoor scene: the skybox reads as an actual sky (not a flat color).
//   - DDGI update is < 1 ms per frame on a typical laptop.
//
// Citations:
//   - McGuire 2010s, Majercik 2019, Majercik 2021 (DDGI series).
//   - Crassin 2011 (voxel cone tracing).
//   - Kajiya 1986 (rendering equation definition).
//   - Pharr, Jakob, Humphreys 2023.
//
// Owner: PearlCitadel.
//
// Dependencies:
//   - cmaes-r3a (photo-real rendering) — sibling
//   - cmaes-r3b (PBR materials) — blocks
//   - cmaes-r3c (parameterized asset factory) — blocks
