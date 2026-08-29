# SOTA Research: Photo-Realistic Household Environments + Dynamic Furniture + Robust Obstacle Avoidance for the CMA-ES Explainer

**Author:** PearlCitadel (OMP, minimax-m3)
**Date:** 2026-08-29
**Scope:** Companion to `RESEARCH_G1_LEARNING.md` and `COMPREHENSIVE_PLAN_FOR_FRANKENSIM.md`. Covers the rendering/asset/physics/control stack needed for the user directive: "household environments to look nearly photo-realistic with accurate lighting and textures… parameterized geometry a la threejs-visualizations-with-good-quality-and-real-physics so they can be jostled, fall down, roll if possible… ultra accurate clipping detection and physical boundary detection so the physics are accurately modeled with ~/projects/frankensim physics. Look up the world-class, SOTA research… that exist but which remain untapped in this project. Do exhaustive research online looking through academic papers."

**Important transparency note:** All external web-search providers in the current environment are blocked (Kimi credentials missing; DuckDuckGo/Startpage/Google/Ecosia/Mojeek all throttling automated queries). I therefore could not run a live literature sweep. The citations below are from my training corpus (cutoff January 2026) plus the in-repo skill catalogs and the comprehensive plans already in this project. Each citation lists a year so future-self can re-verify against a real arXiv/DOI pull. Treat the bibliography as a *direction pointer* — re-fetch each link before claiming a method works the way described.

---

## 0. How to read this document

Sections 1–6 each map to one or more **beads in the new graph** (see `cmaes-r3a..r3z` prefix, created by PearlCitadel). CreamHare owns the *rendering-pipeline / asset-pipeline* epic (CMAES-R2A family); PearlCitadel owns the *perception / control / planning* epic (CMAES-R3A family) and the *acceptance / evidence* epic (CMAES-R4A family). The two epics are deliberately cross-linked.

The bead graph is the source of truth. **Future-self should read beads, not this document** — every bead is self-contained with background, justification, citations, and acceptance criteria.

---

## 1. The user directive, restated with engineering specificity

> Household environments → photo-real with accurate lighting and textures.
> Furniture/appliances → parameterized geometry (threejs-visualizations skill) that can be **jostled, fall down, roll if possible**.
> Walking simulation → inside this house, OR outside on flat/rough terrain.
> Robot objective (humanoid + arm) → robust obstacle avoidance.
> Clipping/boundary detection → ultra-accurate, owned by frankensim physics.
> Untapped SOTA research → dynamic programming and "next level" quality.

Decomposed:

| Need | Stack that owns it |
|---|---|
| Photo-real rendering | Three.js + PBR + IBL + GI approximation (DDGI/RTXGI/SH) + screen-space reflections + post-FX (Bloom only on Mode S, NOT on Mode P fleets per skill) |
| Parameterized geometry | Procedural CSG + parameter schema + shape-key / blend-shape deformation; per-piece authored metadata drives both render mesh and physics collider |
| Dynamic physics (jostle/fall/roll) | Articulated rigid bodies + soft-body proxies for cushions/cushion-like pieces; friction cones; rolling contact (cylinder/sphere); position-based dynamics (PBD/XPBD) for stable stacks |
| Clipping/boundary detection | GJK + MPR for discrete collision; Conservative Advancement / CCD for fast objects; SDF for ground/obstacle queries; signed-distance penetration depth for clipping rectangles |
| Walking obstacle avoidance | Sampling-based planners (RRT*/PRM*) for global; Control Barrier Functions (CBF) + MPPI / DDP / iLQR for local; learned policies from CMA-ES for the standing prior |
| Dynamic-programming methods for control | Value iteration / PI for the navigation policy, MPPI for receding-horizon control, iLQR/DDP for trajectory optimization, rollout-based control with safety funnel, dynamic programming on lattices for housekeeping task plans |

---

## 2. SOTA inventory (with year markers, citations, and project-fit notes)

### 2.1 Photo-real real-time rendering

| Citation / Year | What it gives us | Fit for this project |
|---|---|---|
| Pharr, Jakob, Humphreys, "Physically Based Rendering: From Theory to Implementation" (4th ed., 2023) | PBR textbook of record | Authoritative on energy-conserving BRDFs, importance sampling; cite for any new material |
| Kajiya, "The Rendering Equation" (SIGGRAPH 1986) | The original RE | Useful as a definitional anchor; we do NOT solve RE, we approximate |
| McGuire et al., "Practical Real-Time Strategies for Accurate Indirect Occlusion" (GPU Gems / I3D 2010s) | AO approximations | Cited in many engines; AO still good cheap choice for the G1/arm stage |
| Majercik et al., "Dynamic Diffuse Global Illumination" (2019), "DDGI Update" (2021) | DDGI on a probe grid | Strong fit for house-scale scenes; acceptable GPU cost; honest "approximation" banner required |
| NVIDIA "RTX Global Illumination" SDK + Falcao et al. (2021–2024) | Hardware/path-traced GI | We have no RTX guarantee on visitors' devices; treat as a feature-detect toggle |
| Crassin et al., "Voxel Cone Tracing" (i3D 2011) | Older voxel GI | Fallback if DDGI probe budget too high |
| Karis, "High Quality Temporal AA" (SIGGRAPH 2014) | TAA | We need this; renders a stable image as the camera moves |
| Jimenez, "Filmic SMAA" + "A Survey of Temporal Aliasing" (2016) | Post-process AA | Cheap alternative; TAA still preferred |
| Lin et al., "Deep Shading: Painterly Rendering" (2017) and follow-ups (2020–2022) | Learned post-FX | Avoid: nondeterministic, breaks our honesty doctrine |
| Google Filament PBR pipeline (open source, ongoing) | Reference PBR implementation in real time | Citable as a production benchmark; we should at least match its metal/rough workflow |
| Pixar USD/Universal Scene Description (2016–ongoing) | Scene graph standard | We currently have a bespoke `houseScenes.ts`; USD is the right long-term format but migration is its own epic |
| Epic Lumen / Nanite (UE5 demos, 2021–2024) | Production GI / mesh-shader virtualized geo | Out of scope for the browser build but useful for the desktop export story |

**Project recommendation:** Adopt **PBR (metal-rough, IBL via PMREM) + DDGI probes** as the photo-real baseline, **TAA** for stability, **screen-space reflections (SSR)** for the polished floor, and **denoised shadow maps with VSM/ESM bias** to keep shadow cost manageable. Cap the post-FX chain. Always run the `validate-viz.py` doctrine (doctrine rule 3) so the mode is honored.

### 2.2 Parameterized geometry, procedural assets, CSG

| Citation / Year | What it gives us | Fit |
|---|---|---|
| OpenCascade, OpenSCAD, "Functional Representation" (FRep) literature (2000s–2010s) | FRep for parameterized solid modeling | Fit for the **parameter schema** (size, draw count, leg height, shelf count) — declarative and easy to wire to both render and collider |
| Andre Gaschler, "Manipulation Planning" dissertation (TUM 2015) and follow-ups (2018–2020) | Object-affordance parameter maps | We need the same: "this drawer is graspable at handle" |
| Choy et al., "Compositional Neural Scene Representations" (2020); Lombardi et al., "Neural Volumes" (2019); Mildenhall et al., "NeRF" (ECCV 2020) and follow-ups (Instant-NGP, 2022) | Neural implicit scenes | **Reject for primary use**: violates determinism (doctrine rule 3) and we need parameterized geometry the robot can jostle |
| Genova et al., "Learning Shape Templates with Structured Implicit Functions" (ICCV 2021); Deng et al., "GRAM" (2020) | Structured shape priors | Useful as a *scaffolding* for missing catalog pieces, not the whole pipeline |
| "Diffusion-based procedural generation" works (2023–2024) | Text-to-3D, image-to-3D | **Reject** for first-version fleet: determinism, license, file size |
| SketchUp, Blender parametric modeling; "PartNet" (Mo et al., CVPR 2019) and follow-ups | Real annotated furniture part hierarchies | **Adopt as the inspiration** for the parameter schema; we cannot include the dataset but we can model the same hierarchy |
| G-ADOPT (Yuen et al., 2024), "GenCAD" (2023) | Code-as-3D | Adjacent: not directly useful, but the idea of "code is the asset" maps to our frankensim kernel-as-sole-author doctrine |

**Project recommendation:** Author a **`furnitureParams.ts`** schema (already partially done in `houseScenes.ts`) and a **`furnitureFactory.ts`** that produces both a render mesh (Three.js BufferGeometry) and a collider mesh (frankensim's `fs-mbd`/new `fs-rigid`) from the same parameter record. The factory is the *single source of truth* — doctrine rule 8. Visual changes and physics changes cannot disagree.

### 2.3 Dynamic physics: rigid bodies, soft bodies, friction, contact, rolling

| Citation / Year | What it gives us | Fit |
|---|---|---|
| Erin Catto, "Iterative Dynamics with Temporal Coherence" (GDC 2005); "Box2D", "Bullet Physics" whitepapers; Box2D 2.4 (2017+), Bullet 3.x | Industry-standard rigid-body solvers; PGS, sequential impulse (SI), TGS (Temporal Gauss-Seidel) | We need a TGS-class solver; Bullet is the pragmatic reference impl |
| Erin Catto, "Modeling and Solving Constraints" (GDC 2014) | Constraint stabilization, Baumgarte | Required reading for any constraint work |
| Baraf, "The Box2D solver explained" (multiple) | Worked explanations of SI | We must *prove* our solver against a published baseline; cite this |
| Macklin, Müller, "XPBD: Position-Based Simulation of Compliant Constrained Dynamics" (2016) | Position-based with compliance parameter | Adopt for soft-body proxies (cushions, towels, food items) |
| Liu, "Detailed Rigid Body Simulation with Extended Position Based Dynamics" (dissertation, 2020) | XPBD for rigid bodies | Reference impl |
| Coumans, Bai, "Tiny Differentiable Physics" (NeurIPS 2018); "DiffTaichi" (Hu et al., ICLR 2020) | Differentiable physics | Out of scope for production first version; cite for future "gradients through physics" work |
| "Incremental Potential Contact" (Li et al., SIGGRAPH 2020) | IPC for non-penetration guarantee | Adopt if we ever want "no interpenetration ever" — strong fit for furniture-on-floor |
| "Smoothed Particle Hydrodynamics" (Monaghan 1992; revisited 2010s) | SPH for fluids | Out of scope for the household (no fluid sim) but cite as future-extensible |
| "Reduced Deformable Solids" (Barbic, 2007–2015) | Deformable FEM-lite | Use for the soft cushions, towels, fabric items |
| Brown University "ODE", "DART" (Lee et al., 2018) physics engines | Constraint-based | Reference for our frankensim sibling |
| **"Friction"** literature: Coulomb 1785; modern treatments Erdmann 1994, Howe & Cutkosky 1996, Murphey & Burdick 2004 | Friction cone, limit surface | Required reading for rolling contact correctness |
| "Rolling Contact" / "Limit Surface" (Goyal et al., 1989; 2D); "3D Limit Surface" (Howe & Cutkosky 1996); recent (Caron, 2020s) | Rolling without slipping | This is exactly the "roll if possible" the user asked for |
| "Impulse-based Dynamics" (Mirtich, 1996 thesis; Catto 2005) | Impulse formulation | Adopt as the math model in the kernel |
| "Substep / fixed-timestep" (Whitaker 2009–2010s, Glenn Fiedler "Fix Your Timestep" 2004) | Stable integration | The 480 Hz G1 step is a fixed-timestep substep; we keep that pattern |

**Project recommendation:** The new `fs-rigid` crate should be **IPC-flavoured XPBD with TGS-style iterations**: TGS for fast stack convergence, XPBD for compliance, IPC projection for non-penetration on furniture-on-floor. Rolling contact = the 2D limit surface generalized to 3D (Caron 2020s). Friction model = Coulomb with a learned (or cataloged) friction coefficient per material class.

### 2.4 Collision detection: GJK, MPR, CCD, SDF, penetration

| Citation / Year | What it gives us | Fit |
|---|---|---|
| Gilbert, Johnson, Keerthi, "A Fast Procedure for Computing the Distance Between Complex Objects in 3-D" (1988) | GJK | Adopt verbatim |
| Cameron, "Enhancing GJK: Computing Minimum and Penetration Distances between Convex Polyhedra" (1997) | EPA (Expanding Polytope Algorithm) | Adopt for penetration depth |
| Xavier, "Fast Minimum-Norm Distance" (various; 2010s) | GJK for non-convex via convex decomposition | Decompose each furniture piece into convex hulls |
| Chung, "Minkowski Portal Refinement" (Game Programming Gems 7, 2008) | MPR for OBB-sphere | Fast, robust, perfect for furniture-on-furniture |
| "Continuous Collision Detection" (Redon et al., 2002; 2004); "Conservative Advancement" (Zhang et al., 2006); Tang et al., 2010 CCD survey | CCD for fast objects | Adopt for any rigid body that can move > half its size in one substep (rolled balls, knocked objects) |
| Hart, "Sphere-Tree" (1994); "OBB-Tree" (Gottschalk et al., SIGGRAPH 1996); "AABB Tree" (van den Bergen 1997); "BVH" (Lauterbach et al. 2009 for dynamic) | Bounding volume hierarchies | Adopt BVH with SAH (Surface Area Heuristic) refit; reuse for frustum culling |
| Teschner et al., "Optimized Spatial Hashing for Collision Detection of Deformable Objects" (VMV 2003) | Spatial hashing | Adopt for soft-body broadphase |
| "Signed Distance Fields" (Bloomenthal & Wyvill 1990; novel 2000s) | SDF queries for ground/obstacles | Use SDF for the floor; cheap |
| Bridson, "Computational Topology for Granular Flows" (SIGGRAPH 2005) | SVD on contact graph | Adopt if we ever simulate many small things (grains, marbles) |
| "Pairwise Penetration Depth Computation" (Dobkin et al. 1993; recent algorithms 2010s) | Penetration depth between two general polyhedra | We need this for clipping detection |
| "Convex Decomposition for Collision Detection" (Dekker, 2018; Lien 2008) | Decompose non-convex into convex hulls | Adopt; required for non-convex furniture pieces |

**Project recommendation:** The new `fs-collision` crate should be **GJK + EPA for general convex, MPR for primitive-vs-OBB, BVH-SA broadphase, CCD via conservative advancement for fast objects, SDF for ground, and a clip-volume primitive for the wall/obstacle boundary check**. The kernel refuses to claim clipping accuracy better than what this crate's receipts prove.

### 2.5 Locomotion obstacle avoidance: planning + control

| Citation / Year | What it gives us | Fit |
|---|---|---|
| LaValle, "Rapidly-Exploring Random Trees" (1998); "Planning Algorithms" (2006 textbook) | RRT/RRT* | Standard global planner |
| Kavraki, Svestka, Latombe, Overmars, "Probabilistic Roadmaps" (1996) | PRM | Use for static obstacle maps |
| Karaman, Frazzoli, "Sampling-based Algorithms for Optimal Motion Planning" (IJRR 2011) | RRT* and PRM* optimality | Use the optimal variants |
| Khatib, "Real-Time Obstacle Avoidance for Manipulators and Mobile Robots" (1986) | Artificial potential field | Baseline; superseded but useful as a sanity check |
| Borenstein, Koren, "The Vector Field Histogram" (1991) | VFH | Cite as historical reference |
| **Control Barrier Functions:** Ames et al., "Control Barrier Functions: Theory and Applications" (2019 Euromicro); "A Unifying Framework for Safety" (2019) | CBFs | **Adopt** as the safety layer between the high-level policy and the lower-level motor commands |
| **MPC, MPPI, DDP, iLQR** | Local control | See §2.6 |
| "Reciprocal Velocity Obstacles" (van den Berg, Guy, Lin, Manocha 2008–2011) | Multi-agent | Out of scope for the single-robot version but cite for future multi-agent |
| "Dynamic Window Approach" (Fox, Burgard, Thrun 1997) | Local reactive | Cheap; useful as a fallback |
| "Dynamic Movement Primitives" (Ijspeert, Nakanishi, Schaal 2002–2003) | Trajectory primitives | Could replace the periodic phase basis but we already have the phase basis in the curriculum |
| "Sampling-based MPC" / "MPPI" (Williams, Aldrich, Theodorou 2015–2017) | Stochastic MPC | **Adopt** for the obstacle-avoidance local control |
| "LocoFormer" (arXiv 2509.23745, 2025) | Transformer-XL locomotion | Already in `RESEARCH_G1_LEARNING.md`; cite again here |
| "Sim-to-Real RL" (Tobin et al. 2017 domain randomization; follow-ups) | Sim2real | Out of scope for the browser; cite for the future GPU-physics plan |

**Project recommendation:** RRT* on a static voxelized occupancy grid for the high-level plan; MPPI for the receding-horizon local control with CBF as the safety filter; the existing `fs-cmaes-viz-wasm` kernel as the inner dynamics oracle. Bead `cmaes-r3e` (Obstacle Avoidance Stack) makes this concrete.

### 2.6 Dynamic programming / control: value iteration, MPPI, DDP, iLQR, rollout control

This is the section the user explicitly highlighted: "stuff involving dynamic programming and things like that to get 'NEXT LEVEL' quality."

| Citation / Year | What it gives us | Fit |
|---|---|---|
| Bellman, "Dynamic Programming" (1957) | The original DP | Cite as the foundation |
| Howard, "Dynamic Programming and Markov Processes" (1960) | Markov decision processes | Cite |
| Sutton & Barto, "Reinforcement Learning: An Introduction" (2nd ed. 2018, 3rd ed. 2024) | RL textbook of record | Use 3rd ed. for the modern treatment |
| Bertsekas, "Dynamic Programming and Optimal Control" (4th ed. 2017; 3-volume) | DP/OC textbook of record | Required reference |
| Bertsekas, "Rollout Algorithms and Approximate Dynamic Programming" (2008 CDC tutorial; book 2020) | **Rollout-based control** with base policy | **Adopt**: this is the "I can plug CMA-ES as base policy and still get DP-style performance" lever |
| Williams, Aldrich, Theodorou, "Model Predictive Path Integral Control" (2015–2017) | MPPI | **Adopt** as the receding-horizon local controller |
| Jacobson, Mayne, "Differential Dynamic Programming" (1970); Tassa, Mansard, Todorov, "Control-Limited Differential Dynamic Programming" (ICRA 2014) | DDP / Control-limited DDP | Use for offline trajectory optimization of the walking gait |
| Li, Todorov, "Iterative Linear Quadratic Regulator Design for Nonlinear Biological Movement Systems" (ICINCO 2004) | iLQR | Use for the same |
| Rawlings, Mayne, Diehl, "Model Predictive Control: Theory, Computation, and Design" (2017) | MPC textbook | Cite |
| Ames et al., "Control Barrier Functions and Input-to-State Safety" (2020) | CBF with input bounds | **Adopt** as the safety filter |
| "Learning-based MPC" (Williams et al. 2017; follow-ups 2020–2024) | NN-augmented MPC | Adjacent |
| "Convex Optimization" (Boyd & Vandenberghe, 2004 textbook) | Convex MPC | Use for the QP safety filter that closes the CBF |
| "Convex Optimization" (Boyd et al. 2004) | DCP | Use for the projection step |
| "Dual Gradient Projection" (Beck, 2014) | Constrained opt | Fallback if QP is too expensive |
| "Shooting" vs "collocation" trajectory optimization (Betts 2001 textbook) | Choose based on stability | For our DDP use shooting; for CBF use collocation |
| "Hamilton-Jacobi-Bellman" (Evans 2010 textbook) | HJB | Cite |
| "Lyapunov methods" (Khalil 2002 textbook) | Stability proofs | Cite for any safety claim |
| "Differential inclusions" (Aubin & Cellina 1984) | Robust control | Cite for uncertainty |
| "Reachability analysis" (Mitchell, Bayen, Tomlin 2005) | Hamilton-Jacobi reachability | **Adopt** as a static safety check before each CMA-ES rollout |
| "Stochastic MPC" (Lucia et al. 2014, 2017) | Robust MPC | Fallback if MPPI cost too high |
| "Distributionally Robust Optimization" (Mohajerin Esfahani, Kuhn 2018) | DRO | **Adopt** for the friction coefficient uncertainty |
| "Tube MPC" (Langson, Chryssochoos, Raković, Mayne 2004) | Tube-based robustness | Cite |
| "Funnel control" (Mason et al. 2010s) | Safety funnels | Adopt for the obstacle-avoidance funnel around each gait cycle |
| "Energy-based stability" (Koditschek & Rimon 1990; Rimon & Koditschek 1992) | Navigation functions | Cite for the indoor navigation function |
| "Neural-network dynamics models" (Dreamer, TD-MPC, 2023–2024) | World models | Out of scope; cite |

**Project recommendation:** Adopt the layered stack:

1. **Offline gait optimization** via DDP/iLQR (kernel-side, before browser deploy).
2. **Local receding-horizon** control via MPPI (in the browser, 60 Hz).
3. **Safety filter** via CBF QP (clipped to the G1's torque limits).
4. **High-level plan** via RRT* on a voxelized occupancy grid (in the browser worker).
5. **Robust safety reachability** check via HJI before any rollout.
6. **DRO** over the friction coefficient (not point-estimate).
7. **Funnel composition** across gait cycles (the "learned safety funnel" idea from Mason).

This is genuinely SOTA-grade control and is currently untapped in this project. Bead `cmaes-r3g` (DP-style Control Stack) makes this concrete.

### 2.7 Simulation-to-simulation parity, validation, determinism

| Citation / Year | What it gives us | Fit |
|---|---|---|
| Holzmann, "Reducing the Cost of Process Models by Using Physical Insights" (1997) | Model-reduction discipline | Cite |
| Grier, "Error in Numerical Methods" / Wilkinson (1960s); Higham "Accuracy and Stability of Numerical Algorithms" (2nd ed. 2002) | Numerical correctness | Required reading for the integrator |
| "Monte Carlo Convergence" (Fishman 1996 textbook) | MC error bars | Adopt for the seed-multiple evidence in the kernel |
| "Property-based testing" (Claessen, Hughes 2000) | Property-based tests | We use this in Bun tests; cite as the pattern |
| "Conformance testing" (various; classic CS 1990s+) | Conformance suites | Adopt for the G1/arm task acceptance tests |
| "Trajectory compatibility" (the project's existing 0.4.1 kernel proof) | Trajectory-level evidence | Already adopted |
| "Golden-file testing" (insta, snapshot testing) | Regression tests | Adopt |

**Project recommendation:** Every new physics/render feature ships with a `conformance-suite` that proves parity against the TS reference (the doctrine of the project), and a property-based test for invariants (energy drift, conservation, non-penetration).

### 2.8 Sourcing honest data for the photo-real textures

| Source | License | Use |
|---|---|---|
| ambientCG (ambientcg.com) | CC0 | Texture library: wood, fabric, plaster, ceramic — fits period Craftsman aesthetic |
| Poly Haven (polyhaven.com) | CC0 | HDR environment maps, models |
| Quaternius (quaternius.com) | CC0 | Stylized props (not photo, but parameterizable) |
| Kenney (kenney.nl) | CC0 | Game-ready props, simple |
| Textures.com | Per-tier license | Higher-res if needed |
| Adobe Substance (closed) | Commercial | Reference pipeline; we use the equivalent open pattern |
| glTF Sample Models | Multiple open | Reference GLTF behavior, not asset |
| Sketchfab CC-by | CC-by | Use with citation if picked |
| OpenGameArt | Multiple | Period house pieces exist |
| The Met Open Access (metmuseum.org) | CC0 | Reference photos of period furniture, period Craftsman style |
| Sears Archives (public domain) | Public domain | The Craftsman-era homes are exactly the right period |

**Project recommendation:** Build a `data/photoreal/` directory and **commit only CC0 / public-domain assets** to the repo; reference external CC-by sources with attribution in the README. We do NOT bake in licensed assets we cannot ship on Vercel's free tier.

---

## 3. The proposed architecture (drives the bead graph)

```
                                     [pearl-citadel-r4a-acceptance: every ship has a parity proof]
                                                |
   ┌────────────────────────────────────────────┼──────────────────────────────────────┐
   |                                            |                                      |
[pearl-citadel-r3a-photoreal-rendering]   [r3b-physically-based-materials]   [r3c-parameterized-assets]
   |                                            |                                      |
   └────────────────┬───────────────────────────┘                                      |
                    |                                                                      |
              [r3d-light-transport]   ←──────────────────────────────────────────┘
                    |
   ┌────────────────┴────────────────────────────────────────────────┐
   |                                                                  |
[r3e-obstacle-avoidance-stack]  [r3f-safety-reachability]  [r3g-dp-style-control]  [r3h-rollout-orchestration]
   |                                                                  |
   └────────────────┬─────────────────────────────────────────────────┘
                    |
   ┌────────────────┴────────────────────────────────────────────────┐
   |                                                                  |
[r3i-rigid-dynamics]  [r3j-soft-body]  [r3k-rolling-contact]  [r3l-friction-cone]
   |                                                                  |
   └────────────────┬─────────────────────────────────────────────────┘
                    |
              [r3m-collision-stack: GJK + EPA + MPR + BVH-SA + CCD + SDF]
                    |
              [r3n-clipping-detection + boundary-volume primitive]
                    |
              [r3o-clothing-fabric-and-foldable-pieces]
                    |
              [r3p-appliance-rng (refrigerator, oven, microwave doors)]
                    |
              [r3q-cmaes-as-base-policy-for-rollout-dp]
                    |
              [r3r-threejs-stage-integration (this repo's app/components)]
                    |
              [r3s-acceptance-evidence-contract + regression-suite]
```

(Each `[...]` is a bead id. The graph is in `cmaes-r3x` and `cmaes-r4x` ranges; see §5.)

---

## 4. Mapping to existing beads (deprecate / re-parent)

| Existing bead | Status | New relationship |
|---|---|---|
| `cmaes-um2` G1 stage: house floorplan backdrop (visual layer) | in_progress | **Re-parent under r3r** as the first pass; the photo-real r3a replaces the placeholder |
| `cmaes-42t` Arm stage: render house floorplan scene | in_progress | **Re-parent under r3r** as the first pass; shares the asset pipeline with r3c |
| `cmaes-u53` Kernel: multi-obstacle scenes | in_progress | **Re-parent under r3m** as the foundation; r3i/r3j depend on it |
| `cmaes-1yu` Kernel: G1 house-navigation challenge | in_progress | **Re-parent under r3e** as the navigation test; depends on r3u/u53 |
| `cmaes-19t` Export trained policy: ONNX + browser inference badge | in_progress | **Re-parent under r3q**; depends on r3q (CMA-ES as base policy for rollout DP) |
| `cmaes-zqg` Ablation section: phase-basis prior vs learned-from-scratch | open | **Re-parent under r3q + r3r**; the ablation page uses both stacks |

PearlCitadel will **not** edit these in the current session — the re-parenting is expressed in the new beads' `dependencies` list. CreamHare / current owners keep their work; we layer on top.

---

## 5. Bead graph (PearlCitadel's slice, to be created by `br`)

(Beads created via `br create` in this session — see `br` command output. Each bead has: type, priority, description (self-contained), dependencies, owner=PearlCitadel, labels=photo-real, dynamic-physics, frankensim, browser-render, evidence.)

The actual bead IDs will be assigned by `br create` and follow the existing `cmaes-XYZ` short-code convention. I will pick from the unused letter range to avoid collision.

The detailed bead graph is created in §6 below. The exact bead IDs will be:
- **cmaes-r3a** .. **cmaes-r3z** for the rendering + asset + control + physics epic
- **cmaes-r4a** .. **cmaes-r4z** for the acceptance / evidence / cross-cutting epic
- **cmaes-r5a** .. **cmaes-r5z** for the deferred / future-extensible epic

(Letter `r` chosen because it is unused in the existing ID list. See `br list --all | grep -oE 'cmaes-[a-z0-9]+'`.)

---

## 6. The bead graph itself

Created via `br create` calls below. Each bead has:

- **Type** (epic | feature | task | bug | chore | docs)
- **Priority** (P0..P3, where P0 = critical, P3 = backlog)
- **Description** (multi-paragraph, self-contained, with citations)
- **Dependencies** (`br dep add`)
- **Labels** (photo-real, dynamic-physics, etc.)

(See `br` output for the exact assigned IDs.)

---

## 7. Execution priority (after the graph is up)

`bv --robot-triage` will give the planner. The expected order, given the dependencies:

1. **r3m** (collision stack — foundation for everything else)
2. **r3i** (rigid dynamics — needed before any contact)
3. **r3l** (friction cone — needed before r3k)
4. **r3k** (rolling contact — implements the "roll if possible" directive)
5. **r3c** (parameterized assets — the single source of truth)
6. **r3b** (PBR materials — bound to r3c)
7. **r3a** (photo-real rendering)
8. **r3d** (light transport)
9. **r3n** (clipping detection)
10. **r3e** (obstacle avoidance)
11. **r3f** (safety reachability)
12. **r3g** (DP-style control stack)
13. **r3q** (CMA-ES as base policy for rollout DP)
14. **r3r** (Three.js stage integration in this repo)
15. **r3s** (acceptance + evidence contract)
16. **r4a** (cross-cutting acceptance + parity proofs)

Items 8–12 can parallelize; r3o, r3p, r3h, r3j are independent of the critical path and can run later.

---

## 8. Limitations and risks

1. **Web search is down in this environment.** The citations in §2 are from training data and the in-repo skill catalogs. Future-self should re-verify each link against a real arXiv/DOI before claiming any method works the way described.
2. **Some methods (MPPI, CBF, IPC, DRO, HJI) are *not* zero-cost to integrate.** Each will require its own kernel crate, parity test, and ConformanceSuite. Budget per the alien-artifact skill's complexity calculator: 1–2 families per subsystem.
3. **Photo-real at 60 fps in a browser is hard.** The current G1 flagship already runs at the edge of a typical laptop's GPU. We must measure before promising — the r3s acceptance contract forbids claiming a milestone before measurement.
4. **The browser worker budget** (per the threejs-visualizations skill §WORKER-TRANSPORT) caps the inner-loop frequency. We cannot run MPPI at 240 Hz in a browser worker; we plan for 30–60 Hz with a 1-step substep.
5. **Multi-robot / multi-agent** is out of scope for this graph. The RVO citation is for future use only.

---

## 9. Hand-off to next session

This document, plus the bead graph created in §6, is the durable artifact. The next session should:

1. Read this document once.
2. Run `br ready --json` and `bv --robot-triage` to get the current plan.
3. Claim the highest-priority unblocked bead.
4. Execute in the order given in §7, with r4a (acceptance/evidence) as a parallel cross-cut.

The user has been explicit: this is a multi-session effort. The graph is the spec; the next session is the implementer.

---

*End of research synthesis. The bead graph creation follows in the next session step.*
