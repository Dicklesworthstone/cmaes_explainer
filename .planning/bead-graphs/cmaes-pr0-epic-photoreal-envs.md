# Epic 1: Photo-real household environments

**Owns:** the visual/lighting/material/post-FX layer for the cmaes_explainer household scenes.
**Why now:** the user directive is that "the household environments look nearly photo-realistic with accurate lighting and textures". Everything else (dynamic furniture, robust obstacle avoidance, photo-real walking) is built on top of a real PBR/lighting substrate; without it, the rest is scaffolding around cardboard.
**Reference points (sourced via web search 2025-2026):**
- Khronos PBR/glTF spec (https://www.khronos.org/gltf/pbr)
- NVIDIA RTXGI v2.0 (DDGI + Neural Radiance Cache) https://github.com/NVIDIA-RTX/RTXGI
- three.js PBR examples https://threejs.org/examples/?q=pbr
- Procedural PBR / WebGL texture workflows (CraftPBR, proctexture.com, Playtex AI)

## Background and goals

The cmaes_explainer today renders a flat terrain plane and a 5×3 m walking strip inside a stylized "studio" lighting rig (5-light harness in `G1WalkingFlagship.tsx`). The household scenes in `app/lib/houseScenes.ts` are a Sears Craftsman floorplan but the visual layer uses only solid-color boxes and ambient lighting. The user has asked for near-photo-real interiors with accurate lighting, real textures, and an environment that physically participates in robot rollouts (furniture that jostles, falls, rolls).

This epic delivers the *rendering substrate*. We do NOT alter kernel physics here — that lives in Epic 3. We do provide the visual + IBL (image-based lighting) substrate so the assets Epic 2 produces look like the materials they are, and so Epic 5 obstacle-avoidance objectives can use real shadows / contact shadows as part of the safety signal.

## Sub-tasks (children)

The actual implementation work is broken into features (each is a separate bead that depends on this epic):

- `cmaes-pr1` (P1, feature): **Texture & material pipeline** — PBR map set per furniture category (color, normal, roughness, metalness, AO); KTX2/BasisU compressed delivery; sRGB/linear color-space discipline; glTF 2.0 spec compliance. **Reuse** `app/lib/houseScenes.ts` as the catalog source.
- `cmaes-pr2` (P1, feature): **Procedural material authoring** — sub-tree bump (knot pattern), fabric weave, leather grain, wood grain, ceramic, metal — generated deterministically from a seed and reproducible across runs (mulberry32 seed stream; no wall clock). Integration with the texture pipeline.
- `cmaes-pr3` (P1, feature): **Image-based lighting (IBL) HDR envmap** — capture a real Craftsman-bungalow interior (procedurally rendered via an offline path tracer) into a cube/equirect KTX2; runtime irradiance + prefilter (roughness mip chain) for PBR.
- `cmaes-pr4` (P1, feature): **Real-time global illumination** — DDGI (Dynamic Diffuse Global Illumination) probe grid, RTXGI v2-style probe update, 3-bounce irradiance approximation, integration with the existing five-light rig so adding GI does not double-light the scene. Falls back to baked irradiance volume on devices without ray-tracing support.
- `cmaes-pr5` (P1, feature): **Contact / soft shadows** — VSM (variance shadow maps) for the sun, contact shadows from the SDF/SDF-projected furniture, micro-shadowing for fur/knit (when Epic 2 lands soft surfaces).
- `cmaes-pr6` (P2, feature): **Screen-space reflections (SSR)** — for the polished hardwood floor and kitchen tile; denoised with TAA.
- `cmaes-pr7` (P2, feature): **Tonemap + post-FX** — ACES filmic (already present in `G1WalkingFlagship.tsx`, but centralize it), bloom on emissive (overhead fixtures, oven light), vignette, chromatic aberration at edges.
- `cmaes-pr8` (P2, feature): **Lumen-style emissive surfaces** — recessed lights, oven-window emissive, fireplace flicker; share a single light-bake atlas for room-level coherence.
- `cmaes-pr9` (P2, feature): **Volumetric lighting (god rays through windows)** — exponential height fog + light shafts via screen-space radial blur from a sun-projection pass.
- `cmaes-pr10` (P3, feature): **Material database web UI** — internal tool to browse the texture/material catalog and previews; no user-facing surface but lets the team iterate on PBR.

## Acceptance criteria (epic level)

- A PBR material set exists in the repo and is hot-swappable per furniture category.
- A Craftsman-bungalow IBL HDR is available and used by every PBR material in the household scenes.
- DDGI probes update in real time and produce measurable indirect-light contribution in a documented test scene.
- SSR and contact shadows are visible in the G1 walking and arm stages.
- All lighting/post-FX work is mobile-safe (iPhone Safari target: ≥ 30 fps at 1280×720) and desktop-safe (60 fps at 1920×1080).
- All texture/material authoring is deterministic (seeded) — the same furniture id always produces the same material instance.
- No `Math.random` / `performance.now` in this path (re-uses cmaes-mky discipline).

## Dependencies (blocking)

- `cmaes-594` (closed): house scene config (catalog) — the data structure Epic 2 extends and the renderer reads.
- `cmaes-7y3` (closed): terrain toggle (Flat vs Terrain+Push) — the lighting + IBL must be coherent in both modes.

## Dependents (this epic blocks)

- Epic 2 (parameterized furniture) — PBR materials are the per-piece material slot.
- Epic 6 (G1 walking + arm in photo-real household) — uses the lit environment.

## Cross-cutting constraints

- `bun` only, `rch` for builds, no npm/yarn/pnpm.
- Vercel-deployable: no native binaries, no large texture downloads at build time (KTX2 streamed, not bundled).
- Honesty chip discipline: every visual effect that misrepresents physics (e.g., a contact shadow on a piece the kernel will not collide with) is labeled display-only in the existing honesty chip stack.

## References (URLs discovered in SOTA sweep)

- https://github.com/NVIDIAGameWorks/RTXGI-DDGI (DDGI reference impl)
- https://github.com/NVIDIA-RTX/RTXGI (RTXGI 2.0, Neural Radiance Cache)
- https://developer.nvidia.com/blog/announcing-nvidia-rtxgi-sdk/
- https://www.khronos.org/gltf/pbr (PBR spec)
- https://threejs.org/examples/?q=pbr (PBR examples)
- https://craftpbr.com/guides/three-js-materials
- https://proctexture.com/workflows/webgl-material
- https://www.playtex.ai/blog/using-pbr-textures-for-three-js-games
- https://github.com/davidllona/threejs-realistic-rendering
- https://onlinelibrary.wiley.com/doi/10.1111/cgf.15262 (Voxel-based GI, CGF 2025)
- https://www.sciencedirect.com/science/article/pii/S0097849325002900 (reflections in voxel-based GI)
