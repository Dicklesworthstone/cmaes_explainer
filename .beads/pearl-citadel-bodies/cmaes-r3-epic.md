// PearlCitadel EPIC r3: photo-real rendering, dynamic physics, and robust obstacle avoidance for the household environments in the cmaes_explainer G1 + arm flagships.
//
// Owner: PearlCitadel (OMP, minimax-m3).
// Authoritative companion doc: RESEARCH_PHOTOREAL_HOUSE_PHYSICS.md in this repo. Every bead in the r3/r4/r5 family references it; it is the bibliography and design rationale for the entire epic.
//
// Background and justification (excerpt; full discussion in RESEARCH_PHOTOREAL_HOUSE_PHYSICS.md §0, §1):
//   The user has directed the project to a clearly new generation: household environments that look nearly photo-real with accurate lighting and textures; furniture and appliances as parameterized geometry that can be jostled, fall down, or roll; walking simulations grounded in the house (or outdoor flat/rough terrain) with robust obstacle avoidance as a robot objective; ultra-accurate clipping and physical boundary detection owned by the frankensim physics kernel; and adoption of SOTA research (especially "dynamic programming" methods) that the project has not yet tapped. This is a step-change from the current "honest placeholder furniture boxes" approach.
//
//   The current state: app/lib/houseScenes.ts holds the single-source-of-truth floorplan schema (CRAFTSMAN_BUNGALOW_1928); cmaes-um2 / cmaes-42t are in_progress adding display-only renderings of that floorplan; cmaes-u53 (multi-obstacle kernel) and cmaes-1yu (house navigation) are in_progress in the frankensim sibling; cmaes-nxj (whole-body G1) is in_progress. CreamHare owns the rendering-pipeline and asset-pipeline epic (CMAES-R2A family). PearlCitadel owns the perception / control / planning epic (CMAES-R3A family) and the acceptance / evidence epic (CMAES-R4A family).
//
//   The graph under this EPIC contains ~30 beads across r3 (rendering + asset + control + physics), r4 (acceptance / evidence), and r5 (deferred). The critical-path sequence is documented in RESEARCH_PHOTOREAL_HOUSE_PHYSICS.md §7. Every bead in the graph is self-contained — future-self should never need to re-read this document; the bead bodies carry the full background, SOTA citations, acceptance criteria, and evidence contract.
//
// Scope:
//   - Rendering pipeline upgrade to PBR + IBL + DDGI/RTXGI probe-based global illumination, screen-space reflections, TAA.
//   - Asset pipeline: parameterized furniture/appliance factory producing both a render mesh (Three.js BufferGeometry) and a collider mesh (fs-rigid, fs-soft), bound to the same parameter record so visual and physics cannot disagree.
//   - Materials: physically-based, energy-conserving, with IBL envmaps; honest "approximation" banner for any GI method we do not fully path-trace.
//   - Light transport: real-time direct + indirect via DDGI probes, capped for Vercel free-tier GPU budget.
//   - Dynamic physics: articulated rigid bodies (TGS solver), soft-body proxies (XPBD), friction cone, rolling contact via limit surface.
//   - Collision stack: GJK + EPA for general convex, MPR for primitive-vs-OBB, BVH-SA broadphase, CCD via conservative advancement, SDF for ground/occupancy queries.
//   - Clipping detection: penetration depth primitive + a clip-volume primitive that the kernel refuses to over-claim.
//   - Control: layered MPPI (local) + CBF safety filter + RRT* global plan + DDP/iLQR offline gait + HJI reachability pre-check + DRO over friction coefficient.
//   - Rollout orchestration: CMA-ES as the base policy for the rollout-based DP layer (per Bertsekas 2020).
//   - Stage integration in this repo (app/components + app/workers) — the r3r bead.
//   - Acceptance/evidence contract for every ship (parity suite, regression suite, honesty audit).
//
// Re-parenting existing beads:
//   - cmaes-um2 → r3r (stage integration, first pass)
//   - cmaes-42t → r3r (stage integration, first pass)
//   - cmaes-u53 → r3m (collision stack foundation)
//   - cmaes-1yu → r3e (obstacle avoidance test)
//   - cmaes-19t → r3q (CMA-ES as base policy for rollout DP)
//   - cmaes-zqg → r3q + r3r (ablation page reuses both stacks)
// Re-parenting is expressed via `br dep add`; the original bead owners keep their work and we layer on top.
//
// Acceptance (for the entire EPIC):
//   - Every ship in r3*, r4*, r5* has a ConformanceSuite proving parity against the project's TS reference (the doctrine of the project).
//   - Photo-real rendering demonstrably reaches the honesty-rung standard documented in threejs-visualizations-with-good-quality-and-real-physics skill (Mode P fleet: no EffectComposer/bloom; one render pass; glow via additive sprites + emissive).
//   - Furniture can be jostled, fall, and roll in the browser kernel (fs-rigid) and the same scene can be re-rendered in the same browser frame.
//   - G1 + arm flagship objectives are measurable: distance traveled, contacts avoided, recovery from a contact, and the multi-factor objective rollup documented in cmaes-pvz (currently in_progress by TealCardinal).
//   - All builds (this repo + frankensim) green; the WIP-ALERT in agent mail thread 8466 is resolved.
//
// Out of scope (cite-only, deferred):
//   - Multi-agent / multi-robot. RVOs are noted in r3e as future-extensible.
//   - GPU physics (wgpu). MPPI at 30-60 Hz on CPU is the pragmatic first version; GPU acceleration is a follow-on.
//   - Neural network dynamics models (Dreamer/TD-MPC). Cited in r3g for the next-version hook.
//
// Citations (year markers so future-self re-fetches):
//   - Pharr, Jakob, Humphreys 2023 (PBR textbook of record)
//   - Kajiya 1986 (rendering equation definition)
//   - McGuire, Majercik 2019-2021 (DDGI), Karis 2014 (TAA), Filament pipeline (open source, ongoing)
//   - Goyal 1989, Howe & Cutkosky 1996, Caron 2020s (limit surface, rolling contact)
//   - Macklin, Müller 2016 (XPBD); Li et al. 2020 (IPC)
//   - Catto 2005+ (constraint solvers: SI, TGS, XPBD)
//   - Gilbert-Johnson-Keerthi 1988 (GJK), Cameron 1997 (EPA), Chung 2008 (MPR), Redon 2002+ (CCD)
//   - Khatib 1986, LaValle 1998+ (RRT/RRT*), Karaman & Frazzoli 2011 (RRT* optimality)
//   - Williams 2015-2017 (MPPI), Tassa 2014 (DDP), Li & Todorov 2004 (iLQR), Jacobson & Mayne 1970 (DDP original)
//   - Ames 2019-2020 (CBF), Mitchell-Bayen-Tomlin 2005 (HJI reachability)
//   - Bertsekas 2008-2020 (rollout algorithms, approx DP), Mohajerin Esfahani & Kuhn 2018 (DRO)
//   - Lin 2017+ (learned post-FX — REJECT for primary use, cited as anti-pattern)
//
// Dependencies (this EPIC depends on):
//   - cmaes-594 (House scene config module: Sears Craftsman floorplan data) — CLOSED, the schema is the source of truth
//   - cmaes-7y3 (G1 terrain toggle) — CLOSED, the toggle is needed for the indoor/outdoor test matrix
//   - cmaes-a0f (Higher-fidelity robotics scenes, parallel population evaluation, statistical evidence) — CLOSED, the population eval harness is needed for evidence
//   - cmaes-h92 (Honest G1 optimization) — CLOSED
//   - cmaes-mky (Determinism cleanup) — CLOSED
//   - cmaes-7y3, cmaes-a0f, cmaes-h92 together establish the contract: kernel refuses to over-claim; r3a-r3r honor that contract.
//
// Coordination:
//   - CreamHare owns CMAES-R2A (rendering/asset pipeline) per agent-mail thread 8476.
//   - TealCardinal owns cmaes-pvz (G1 v067 regression fix).
//   - BlueLake / NobleOtter / TurquoiseFalcon / GoldenSwan / StormyBluff / CloudyRidge / BoldPrairie: per existing mail threads; no overlap claimed.
//   - PearlCitadel: r3*, r4*, r5* epic.
//
// Execution:
//   - Critical path: r3m → r3i → r3l → r3k → r3c → r3b → r3a → r3d → r3n → r3e → r3f → r3g → r3q → r3r → r3s → r4a.
//   - Parallelizable: r3h (rollout orchestration), r3j (soft-body), r3o (foldable pieces), r3p (appliance rng).
//   - Use `bv --robot-triage` to pick the highest-priority ready bead at each step.
