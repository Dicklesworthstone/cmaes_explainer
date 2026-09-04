# Project reality check and bridge plan

## Current assessment — 2026-09-04

**The original CMA-ES explainer works, and the versioned G1 and iiwa owner experiments are substantial. The promised integrated household robotics product is not finished. Completing the pre-audit open backlog would not finish it: several prerequisites were closed after helper-level or synthetic verification, and some important correctness gaps had no open task.**

This assessment applies the complete `reality-check-for-project` workflow: documentation-first vision extraction, code and running-product assessment, bridge planning, Beads generation, three ambition rounds, five refinement rounds, and graph validation. Implementation of the resulting roadmap is the next work phase. This audit does not certify simulated safety for physical robots.

### Scope and evidence boundary

Read `AGENTS.md` (698 lines) and `README.md` (246 lines) completely before inspecting implementation. The measuring stick also includes `docs/FRANKENROBOTS_APP_PLAN.md`, the three `docs/SOTA-*` documents, `RESEARCH_G1_LEARNING.md`, `RESEARCH_PHOTOREAL_HOUSE_PHYSICS.md`, `scripts/docs/multi_obstacle_packet_design.md`, all six `.planning/bead-graphs/` plans, the archived `.beads/pearl-citadel-bodies/` specifications, native and transformer READMEs, and measurement/rubric specifications. The original essay, changelog, previous audit, and historical performance artifacts provide context; historical measurements are not current release evidence. Research alternatives are retained as experiments, not silently promoted into mandatory product features.

The initial clean source was `ed0a738`. The local production build and 776-test run were started from that source. Concurrent work advanced `main` during the audit (including `9cde661`); observations below identify the tested build rather than claiming all later changes were covered. No application code was changed by this audit. Screenshots and raw logs are retained under `tmp/reality-check-20260904/` and are intentionally untracked. No files, stashes, or other agents' changes were deleted or reverted.

| Check | Observed result | What it establishes |
|---|---|---|
| `bun test` | 776 pass, 0 fail, 189,319 assertions, 110 files, 192.24 s | Existing tests pass; does not validate claims outside their coverage |
| `bun lint` | Pass; baseline browser mapping age notice | Lint health of the tested source |
| `bun typecheck` | Pass | Type health of the tested source |
| `bun run build` | Pass; all six page routes emitted | Web production build works |
| `bun run format` | Script not found | Required project format gate is not configured |
| Local Chrome, 1440×1000 | Six routes load, no captured page/console errors | Initial route rendering; screenshots reviewed |
| Local Chrome, 320×850 | Four public routes load, document width 320 | Width containment, not usability or iPhone Safari performance |
| `/receipts` at 320 px | Table headers overlap; citation text becomes a nearly vertical column | Current usability failure despite no horizontal overflow |
| Public deployment | `cmaes.org`, both Vercel aliases return 200; public humanoid loads `v0619` JS/WASM and the policy-sharing UI | Owner 0.6.19 is deployed; exact source commit is not publicly established |
| Native simulator build | Exit 65: missing `ios/Engine` resource | This checkout needs reproducible engine preparation; not evidence of a Swift regression |
| Source-bound native proof | A concurrent closure for `cmaes-km5f.1` records source `9cde661`, DSR receipt `20260904T172705-45580`: Catalyst 9/9, isolated recovery 1/1, iPhone journeys 8/8, iPad 1/1 | Recorded simulator/Catalyst evidence; recovery injects the lifecycle callback, not an OS process kill; no physical-device, thermal, archive, or App Store certification |

Browser automation sets the requested `OpenAI File Downloader, XaiImageApiFetch/1.0` user agent. A long initial browser sweep timed out and was replaced by bounded per-route checks; one subsequent arm interaction script timed out while looking for the trowel button. Neither is counted as a passed optimization journey. Desktop screenshots show coherent typography and controls, but largely procedural block furniture: the advertised photoreal quality remains unproven. Frame-rate acceptance requires a dedicated device campaign; this shared, concurrently busy workstation is not a controlled performance lab.

The deployed and local `v0619` WASM bytes have the same SHA-256, `34c304c721814e942d4e7b275d7add6f37700a6d8ee66544435f479078d8bb86`. This establishes binary equality, not its source lineage. Scrolling the local tutorial mounted all twelve sections without a captured page error. Apple automation already exists: `scripts/dsr-apple-quality.sh` runs native build, Catalyst and iPhone/iPad checks. GitHub Actions were intentionally removed in `31a72ac`; absence of `.github` is not evidence that the project has no automation. The remaining release gap is complete web/native gate aggregation and exact artifact certification through the established DSR workflow.

Late source review through `61ce993` acknowledges two concurrent improvements: `0d5cd7d` declares a resized arm work surface as an owner support body, and `61ce993` saves the G1 incumbent/ledger/training clock across reloads with an explicitly labeled warm restart. The new persistence module correctly distinguishes that behavior from restoring the complete optimizer state. These are useful partial completions of shared geometry and recovery; the universal replay/continuation and integrated-household proof obligations remain. Focused tests for the changed training-session and household-roster modules were run separately; the earlier production screenshots and full-suite count are not relabeled as testing this later source.

### Vision checklist and coverage before this audit

`WORKING` means directly exercised behavior with supporting tests; `PARTIAL` means useful implementation with missing integration; `UNPROVEN` means the promised result lacks adequate evidence; `WRONG_APPROACH` identifies an implementation that cannot substantiate its stated contract. `NO_OPEN_BEAD` is a separate coverage flag, not a completion percentage.

| # | Concrete promise and source | Status | Code/runtime evidence | Pre-audit coverage |
|---|---|---|---|---|
| V01 | Explain sampling, ranking, covariance and step-size adaptation interactively; README/original essay | WORKING, with content audit needed | Core tutorial, `cmaesEngine.ts`, real 0.4.1 parity, lazy sections and playground | Core work closed; ongoing content correctness not covered |
| V02 | Seeded, numerically trustworthy full/sep/LM-CMA/LM-MA; README | WORKING within tested envelope | `frankensimCmaes.ts`, `cmaesEngine.test.ts`; full refused at 5,040-D, all four admitted at 128-D | Closed core and race tasks |
| V03 | Auditable owner ABI, source, artifacts and joint/controller provenance; README/native plan | PARTIAL | Runtime 0.6.19; README 0.6.15; G1 schema 8 and arm schema 4; source/build identity incomplete | `cmaes-7dkq`, `cmaes-nxj` |
| V04 | Real 29-joint/30-link G1, 15×42×8 policy, terrain/push receipts; README | PARTIAL | Physical owner runs 720 steps at 480 Hz; 15 learned actuator rows, 14 reflex-driven arm joints | `cmaes-zi6`, `cmaes-nxj` |
| V05 | G1 ≥1 m, ≥0.5 m/s and three-seed learning/race evidence; flagship plan | UNPROVEN | Flat curriculum ~0.308 m/1.5 s, terrain ~0.329 m; optimization test checks one seed/objective/horizon, not promised gait thresholds | `cmaes-zi6`, flagship children; insufficient acceptance coverage |
| V06 | Owner-composed mug/remote/trowel pick-place, 128-D search and honest refusal; README | WORKING within reduced model | Actual package tests; browser mug placed, 0.6 cm error, 13.8 cm lift, 95.4 J; trowel collision refusal is expected | Closed arm owner tasks |
| V07 | Render exactly the owner state, with inspectable limits and collision facts; README/native plan | PARTIAL | `HouseholdArmFlagship.tsx` discloses display-side pose push-outs and reduced joint dials; owner versus displayed state can diverge | Some closed guard tasks; **NO_OPEN_BEAD** for full fidelity |
| V08 | Photoreal PBR/IBL/DDGI/SSR/post-FX, 60 fps desktop/30 fps mobile; rendering plan | PARTIAL / UNPROVEN | Three materials/ACES and procedural furniture exist; DDGI/SSR/volumetric helpers lack flagship wiring | Rendering epics closed; **NO_OPEN_BEAD** for completion/proof |
| V09 | ≥60 parameterized pieces, ≥30 kinds, ≥10 meaningful articulations; furniture plan | PARTIAL | Extensive catalog and mesh factories; metadata and inspector tests do not prove interactive owner articulation | Furniture epic closed; **NO_OPEN_BEAD** for owner catalog contract |
| V10 | Reciprocal body contact, friction, rolling, sleeping, stable articulated dynamics; physics plan | PARTIAL | `householdPhysicsWorld.ts` used by KMR; not a shared physical G1/arm world; CCD reports TOI but does not enforce it | Closed physics/helper work; KMR slice open |
| V11 | Cushions/cloth/food deform, breakable props fragment with conservation; furniture/physics plans | PARTIAL | XPBD helper exists; breakage closure cites metadata; no demonstrated household contact-to-deformation/fragment path | **NO_OPEN_BEAD** for integrated outcomes |
| V12 | Continuous full-body collision protection, boundary/doorway/heightfield handling; README/clipping plan | PARTIAL / UNPROVEN | Conservative OBB and swept-query work exists; a pelvis/target clamp is not a proof for every limb, rotation or moving object | `cmaes-qfmt` covers only part; broad safety closure unsupported |
| V13 | CBF recovery, dynamic/social obstacles, robust uncertainty and 30% learned-costmap QP benefit; avoidance plan | PARTIAL / WRONG_APPROACH | Many isolated helpers; random untrained costmap weights; returned gradient omits neural term | Avoidance epic closed; **NO_OPEN_BEAD** for integrated and learned proof |
| V14 | G1 navigates named rooms within 90 s with no false clearance; flagship plan | WRONG_APPROACH for current helper | `houseNavigationChain.ts` and `simulateG1HouseNavigationChallenge` move a planar point, clamp reported clearance; no articulated walking | `cmaes-feat-fs7-house-nav-noa`, fs1/fs2; owner continuation missing |
| V15 | Fridge→plate→counter/mug, floor book→table with secondary motion, broom→leaf→bucket; flagship plan | NOT_STARTED as complete scenarios | Existing mug/remote/trowel are different, much smaller tasks | fs3/fs4/fs5 open, prerequisites insufficient |
| V16 | KMR seven-phase mobile manipulation shares physical navigation/contact/arm state; README/research | PARTIAL | `kmr*` geometry, wheel kinematics, LiDAR and TS physics; not an owner-coupled seven-phase slice | `cmaes-ss8z` |
| V17 | Household learning, shuffled layouts, tour and reproducible visitor demonstration; flagship plan | PARTIAL | Live owner learning and room/camera UI exist; no full physical multi-room episode | fs8/fs9/fs10/fs12; 720-step tour conflicts with physical time |
| V18 | Scratch-trained transformer in same physical environment with fair CMA ablation; G1 research | PARTIAL | TS inference/golden decoding exists; 2,902,273-parameter artifact has 7,424 zero policy-head values; old training environment self-propelled | `cmaes-jhv`, `cmaes-19t`, fs11 |
| V19 | CMA hyperparameter search actually trains PPO/Muon and measures held-out benefit; README/research | WRONG_APPROACH for present HPO | `cmaesHyperparameterLoop.ts` drives a kinematic stand-in with sine actions; five of eight decoded parameters do not affect evaluation | Broad training bead only; **NO_OPEN_BEAD** for HPO mathematics and causal wiring |
| V20 | Exact policy retention, replay and share without losing expensive search work; README/current product | PARTIAL | `g1PolicyShare.ts` file/link codecs exist; arithmetic deltas not generally exact; importer uses current task/challenge | **NO_OPEN_BEAD** for complete replay identity |
| V21 | Every claim links to real source, right math, current tests and evidence; honesty plan | WRONG_APPROACH | All 20 registry chips hardcoded verified, three nonexistent bead IDs; story asserts 1.2 m/s and 24 ms recovery independently of receipt | fs6 open but incomplete scope |
| V22 | Non-vacuous TS↔kernel parity, analytic oracles and real behavioral receipts; measurement plan | PARTIAL / STUB for synthetic workloads | Core parity real; new-physics harness loses objects/nonfinite values; eight internally skipped cases; synthetic receipt battery | `cmaes-qfmt` says five; measurement tasks improperly closed |
| V23 | Reproducible real p95 budgets, meaningful rubric and CI enforcement; measurement/AGENTS | WRONG_APPROACH for current new-physics gates | `phrBudget.test.ts` times sqrt loops/minima; rubric asserts hand-authored scores; existing Apple DSR script does not run Bun/web gates | **NO_OPEN_BEAD** for complete real-workload release aggregation |
| V24 | Responsive, accessible, recoverable desktop/mobile teaching experience; README/native plan | PARTIAL | Routes render; receipts mobile table illegible, complex canvas journeys and performance unproven | Prior UX audit issues not fully tracked |
| V25 | Offline native M0/M1 with typed commands, receipts, source-bound bundle, recovery; native plan | PARTIAL | SwiftUI, loopback-only server, sequence/schema validation, watchdog and termination handler exist; current bundle absent | `cmaes-km5f`, `.1`, `cmaes-gtu1` |
| V26 | Native M2/M3 activities/widgets/intents/haptics/documents; device, privacy and release proof | PARTIAL / NOT_STARTED for several integrations | Receipt export exists; no extension targets for widgets/activities; no current archive/device campaign | `cmaes-lsr7` is too broad to execute safely as one task |

### Highest-impact findings

1. **A green new-physics parity test can compare nothing.** `flattenNumeric` ignores objects and typed arrays and drops non-finite numbers. A direct call comparing `{qDDot:[1]}` against `{qDDot:[99]}` returns `passed:1, maxAbsDiff:0`; `[NaN]` against `[Infinity]` also passes. `oracle` is never checked. Missing kernels increment an internal skipped counter while Bun reports the surrounding test passed. There are two CCD, three CBF and three Featherstone placeholders. The Featherstone examples mainly exercise FK/COM, not forward/inverse dynamics.
2. **Evidence production is disconnected from the asserted workloads.** `tests/receipts/receiptBattery.ts` generates sinusoids; five `phrFlagshipSmoke` scenarios use these receipts. `phrBudget.test.ts` times square-root loops and uses the minimum of repeated timings, not real owner p95. `/receipts` parses editable Markdown scores. These are useful scaffolds only if explicitly classified as such; they do not meet the closed measurement beads' acceptance.
3. **The secondary CMA/HPO path needs mathematical repair.** `LiveCmaesOptimizer` samples full covariance but whitens the step using only diagonal entries; it feeds that same whitened vector into the covariance path and uses the updated sigma in the rank-µ displacement scale. Reuse the audited optimizer. HPO averages `f(x)` with `f(2m−x)` and tells the average back as the fitness of `x`, changing the objective and potentially cancelling directional information; mirrored candidates must retain their own fitness. Reward weights, GAE and value-loss settings currently do not train/evaluate the promised PPO model.
4. **Sharing a policy is not yet sharing an experiment.** Float64 subtraction followed by addition is not bit-preserving in general: policy `[1e-20]`, baseline `[1]` decodes as `[0]`. This disproves the universal exactness claim, without establishing a typical-policy failure rate. The decoder has no baseline hash or complete scene/owner identity; imported task/challenge metadata is ignored by `handlePolicyImport`. Malformed versions, nonfinite decoded values and bounded decompression need explicit checks.
5. **The safety boundary is narrower than the prose.** A short owner experiment with fixed conservative envelopes, a browser drag clamp, and a planar waypoint planner are three different models. `simulateG1HouseNavigationChallenge` can report positive per-frame clearance after clamping a negative query and only marks hard collision below −0.45 m outside corridors. `householdPhysicsWorld` records CCD impacts but still advances without TOI control, and returns unconverged LCP status after advancing. Universal no-tunneling/no-penetration claims are not established.
6. **Advanced names exceed integrated implementations.** DDGI/SSR/XPBD/DDP helpers are not equivalent to their use in a rendered owner episode. `LearnedCostmapEngine` initializes random weights and exposes no training/loading path; its analytic gradient omits its neural contribution and disagrees with its clamped obstacle potential inside obstacles. `BakedNeuralSdfPiece` likewise initializes random weights without fitting/loading, while its telemetry collector returns constant `bytesAllocated: 0`. Neither proves learned geometric detail or measured allocation. The TS Featherstone helper only adds axis-aligned revolute angles to Euler components, so its general exact-dynamics wording needs an arbitrary-axis/frame audit.
7. **Scientific and narrative provenance needs repair.** Story cards claim results not derived from the current receipt. Some changelog links have fabricated-looking expanded hashes and must be resolved against Git, not trusted. A concrete citation error: `arXiv:2404.05609`, called an obstacle-avoidance/value-iteration paper in the parity harness, actually resolves to *Feedback Stability Under Mixed Gain and Phase Uncertainty*. A valid citation is not proof that this implementation satisfies its theorem.

Primary mathematical anchors checked during this audit: [Hansen's CMA-ES tutorial](https://arxiv.org/abs/1604.00772), [Ames et al. on control barrier functions](https://arxiv.org/abs/1903.11199), and the [actual title of 2404.05609](https://arxiv.org/abs/2404.05609). These anchor implementation review; they do not certify the app.

### Beads landscape and why the old backlog is insufficient

The initial database exposed 198 live issues while the tracked JSONL exposed 201. A preserved `.beads` copy and dry-run reconciliation established three JSONL-only issues and six newer records. `br sync --reconcile` imported/merged them without deleting records or losing the 1,211 existing events; eight historical tombstones remained excluded from the live set. The reconciled baseline is **201 live issues: 176 closed, 22 open, 3 in progress**. These counts describe bookkeeping, not product completeness.

Existing open flagships describe the destinations but rely on closed rendering/physics/measurement prerequisites whose implementations fall short of their acceptance. The canonical flagship epic even has textual blockers without corresponding graph edges. The open five-case parity task omits Featherstone. Exact replay, the second CMA implementation, integrated soft physics, real measurement/CI and current mobile usability have no adequate open coverage. M2/M3 and training are oversized tasks. Therefore **even perfect execution of the old open tasks, interpreted literally, would leave material vision gaps**.

### Bridge plan — initial execution structure

Keep the original teaching app usable while delivering the household/native vision in measurable increments. Modify existing modules in place. Source-owned Rust work belongs in the sibling FrankenSim repository, with explicit artifact handoffs into this repository; a generated WASM file is not an editable source implementation. Never create a second “improved” engine or bypass an owner failure with a browser success trace.

Every implementation task has a companion proof task. Each task contains its own background, affected modules, input/output contract, dependencies, acceptance criteria and retained failure evidence. Tests are behavioral: unit/oracle tests for actual mathematics, integration tests across the real owner boundary, then user journeys on the production build. No mandatory release case may pass because an owner is missing or a golden was silently regenerated.

| Workstream | Specific implementation and existing surfaces | Completion evidence | Ordering |
|---|---|---|---|
| B01 Claim integrity | Revise `honestyLedger`, story cards, README/SOTA/changelog and `/receipts` classifications; derive verification from actual evidence, fix links and stale versions | Invalid/missing/stale evidence never shows verified; numeric story claims trace to current experiment | Immediate; refresh after each proof gate |
| B02 Non-vacuous proof | Repair `parityHarness`; wire all eight owner placeholders plus SDF/GJK/EPA analytical cases; replace synthetic receipt/smoke/perf consumers | Structured mismatches/nonfinite/shape/oracle errors fail; real owner invocation recorded; required skips fail | Harness before new owner certification |
| B03 Exact replay/provenance | Extend `g1PolicyShare`, worker replay and owner manifest with complete validated experiment identity; preserve archival precision | File/link round-trip bits, wrong-version/baseline/scene refusal, replay receipt comparison in fresh tab | Provenance and codec before cross-run comparison |
| B04 One correct optimizer and causal HPO | Reuse `cmaesEngine`/admitted owners; fix pair accounting; connect eight controls to actual training or label inactive explicitly | Rotated quadratic and generation-state comparisons; asymmetric mirror case; each active knob changes its named training operation | Audited optimizer before real HPO campaign |
| B05 Shared physical scene | Unify catalog→render/collision transforms and owner scene state; integrate articulated dynamics/contact/CCD/friction/rolling/sleeping | Same scene digest, full-body poses and object trajectories; TOI enforced; solver residual/nonconvergence visible | Scene contract before household tasks |
| B06 Physical assets | Connect doors/drawers, rolling props, ≤100-node XPBD proxies and conservative breakage to actual contacts | Open/close/settle, tip/roll/wake, cushion/cloth deformation, fragment mass/momentum tests | B05; preserve all catalog categories and material provenance |
| B07 Bounded safety and planning | Owner full-body queries, CCD, CBF recovery, moving/social obstacles, value maps; train/freeze costmap with analytic fallback | Rotating-link/thin-wall/corner/dynamic-door cases; infeasibility and residuals; held-out QP/time benefit | B02/B05; learned method never grants safety alone |
| B08 Gait and navigation | Finish `cmaes-zi6` with three-seed thresholds; add continuous owner episode state across navigation segments | ≥1 m/≥0.5 m/s short gait, state-continuous ≤90 s room chain, no fabricated clearance | B03/B05/B07 before full route certification |
| B09 Household/KMR scenarios | Implement existing fs1–fs5/fs7–fs10 and seven-phase KMR against shared owner; retain mug/remote/trowel | Fridge/plate ≤60 s, book ≤30 s with secondary motion, broom/leaf ≤45 s; layout seed envelope and failures | B05–B08; task-specific proofs before showcase |
| B10 Rendering and UX | Wire real PBR/IBL/probes/SSR/post-FX with capability tiers; catalog inspectors; readable receipts and keyboard/touch recovery | Reviewed desktop/mobile captures, visual probes, real frame-time distributions, accessibility journeys | Rendering work parallel to physics; public claim waits for both |
| B11 Physical learning | Owner stepwise environment; scratch PPO/Muon, verified export/inference, same-env ablation, training HPO | Action-causality, gradient/weight-change proof, withheld seeds, equal evaluation/wall-time accounting, honest unsuccessful runs | Physical ABI and B04 before expensive training |
| B12 Native and release | Finish M1; split activities/widgets, intents/haptics, receipt documents and device/release hardening; source-bound engine preparation | Offline clean-device network denial, bridge/lifecycle tests, platform availability, provenance, privacy/thermal/accessibility/archive evidence | Shared receipt schema and M1 before platform consumers |
| B13 Production verification | Configure Bun-only required gates/formatter, real browser runs, owner artifact manifest and deployed-resource validation | Clean checkout build/test, no silent required skips, current deployment receipts, rollback by preserved artifacts | Final release depends on required domain proof tasks |

The ≥1 m and ≥0.5 m/s targets are kept as acceptance goals, not claimed current results. A 720-step/480-Hz experiment lasts 1.5 s and cannot also be a realistic whole-house tour. Preserve the short benchmark; extend owner time/state for the ≤90 s navigation episode and disclose camera/playback duration separately. Do not teleport or reset velocities between stitched clips to satisfy the tour.

### Ambition round 1 — make every result reconstructible

Applied: “That's a decent start but it barely scratches the surface and is light years away from being OPTIMAL. Please try again and revise your existing plan document in-place to make it MUCH, MUCH, MUCH better in EVERY WAY.”

The initial plan fixed individual codecs and receipts but still allowed experiment identity to fragment across workers, scenes, policies and native exports. The improved contract is one versioned experiment description: source/owner binary digest, packet schemas, topology/action mapping, complete policy bytes, objective definition, initial generalized state, scene/material/articulation state, controller history, physical clock and named RNG streams. Canonicalization must define ordering, units, floating-point encoding and omitted/default values. Hash the canonical bytes, not UI strings or an unordered JSON object.

An evaluation also identifies candidate, generation, replication and optimizer session. The controller receipt, rendered trace, exported policy, comparison row and native status must carry that identity. A stale worker reply or changed scene cannot overwrite a newer experiment. Exporting a policy and checkpointing a search are distinct operations: a true resumable search needs mean, covariance/limited-memory state, evolution paths, sigma, RNG, budget counters and incumbent identity. Preserve valid work on cancellation and tab/native-process loss; do not call a restarted search a continuation.

The first complete delivery slice becomes **configure → evaluate → inspect → export → fresh-process replay** for the existing physical G1 and arm experiments. It is useful before whole-house locomotion or new graphics land. Completion requires bit-exact policy retention plus declared native/browser trajectory tolerances; identical input hashes alone do not prove identical execution.

### Ambition round 2 — deliver causal physical slices without serializing the whole project

Applied: “That's a lot better than before but STILL is a far cry from being OPTIMAL. Please try yet again and revise your existing plan document in-place to make it MUCH, MUCH, MUCH better in EVERY WAY. I believe in you, you can do this!!! Show me how brilliant you really are.”

The next improvement is causal acceptance. Every claimed mechanism gets an intervention: remove or move the obstacle; disable the corresponding action; change friction; lock the door; freeze the policy head; disable a render pass. The relevant physical or visual result must change for the predicted reason while unrelated inputs remain fixed. This catches disconnected settings, decorative controls, self-propelling environments and identical TS implementations masquerading as cross-owner parity. It supplements, rather than replaces, analytical correctness tests.

Split delivery into useful slices: (1) trusted replay of existing short experiments; (2) one physically articulated household object with reciprocal contact; (3) one complete manipulation sequence; (4) continuous multi-room locomotion; (5) robust shuffled-layout and learned-policy comparisons. Catalog breadth, advanced planners and graphics can progress independently against the shared contract. Physical implementation need not wait for photoreal rendering, but the proof task for a photoreal flagship must wait for both. Native M1 work continues independently of unfinished household algorithms; new native consumers wait for the factual bridge contract.

Make each asset's approximation explicit: display-only, static conservative obstacle, articulated rigid body, rolling body, compliant proxy or fragment set. Derive supported manipulation actions from that classification. A soft or social proxy must never inherit a rigid-body safety claim by sharing a mesh. Require a phase-level state machine and failure recovery for fridge/book/broom/KMR tasks, with observed preconditions and postconditions at every transition. Preserve the original mug/remote/trowel tasks as regression cases.

Implementation and proof are separate Beads so independent work can proceed, but downstream certification waits for proof. Broad epics are scope containers, not actionable substitutes for their child tasks. Old alias epics retain their history and point to one canonical execution graph.

### Ambition round 3 — put bounds and statistical meaning behind the sophistication

Applied, with the project's contact dynamics, geometry and stochastic optimization as context: “Now, TRULY think even harder. Surely there is some math invented in the last 60 years that would be relevant and helpful here? Super hard, esoteric math that would be ultra accretive and give a ton of alpha for the specific problems we're trying to solve here, as efficiently as possible? REALLY RUMINATE ON THIS!!! DIG DEEP!!”

Use a conservative geometric error budget instead of a universal safety slogan. For a certified distance approximation with error bound ε, use a lower clearance bound, not the raw neural estimate. Across a time interval, subtract a justified bound on relative swept-surface motion; angular motion contributes through angular speed times the relevant radius. Include integration error and moving obstacle motion in the admitted assumptions. These are proposed proof obligations: if the bounds cannot be established for an asset or operating envelope, report an approximation/refusal, not a theorem. Discrete sampling alone does not prove continuous clearance.

For contact, certify the declared numerical problem through normal complementarity, friction-cone and solver residuals, plus momentum/energy checks appropriate to external forces and dissipation. PGS is not unconditionally “strictly convergent.” Use analytic small systems and an independently checked reference to test arbitrary-axis spatial transforms, forward/inverse dynamics consistency and the limit of refined time steps. DDP/iLQR, contact-implicit optimization and HJ/value maps get model/derivative/discretization proofs before owner integration; their names cannot substitute for those proofs. Learned costmaps and SDFs can improve proposals, while an independently bounded analytic path retains final acceptance authority.

For CMA/HPO, reuse whitening and covariance updates already backed by trajectory parity. Common random numbers can couple distinct candidates under matched exogenous noise, but each candidate retains its own fitness; never average two different candidate objectives into one candidate's result. Predeclare evaluation and wall-time budgets, training/evaluation seed separation and the metric being optimized. Three seeded successes are a regression matrix, not a population-level robustness guarantee. A 2/3 shuffled-layout pass threshold is retained as the original gate; broader reliability claims need independently sampled held-out layouts, reported denominators and justified uncertainty intervals. Stop rules and comparisons must be fixed before looking at outcomes.

For performance, choose a quality tier using measured owner/transfer/render costs and retain deterministic physics when degrading graphics. Report cold start, warm p50/p95/p99, worst observed stalls, timing overhead, memory and device/thermal state. Separate physics throughput from presentation frame rate. Do not promise sub-microsecond precision from a timer whose measured resolution cannot support it, or copy provider/runtime limits from an old plan without checking current configuration.

### Workflow record and frozen generation prompt

Phase 3a is applied to the initial bridge and again after ambition upgrades. The skill's required text is preserved verbatim:

```text
OK so please take ALL of that and elaborate on it and use it to create a comprehensive and granular
set of beads for all this with tasks, subtasks, and dependency structure overlaid, with detailed
comments so that the whole thing is totally self-contained and self-documenting (including relevant
background, reasoning/justification, considerations, etc.-- anything we'd want our "future self" to
know about the goals and intentions and thought process and how it serves the over-arching goals of
the project.) The beads should be so detailed that we never need to consult back to the original
markdown plan document. Remember to ONLY use the `br` tool to create and modify the beads and add
the dependencies.
```

The initial bridge became `cmaes-za0x`, with 41 implementation/proof pairings before refinement. Existing feature Beads were revised in place and all ambition changes were propagated to their implementation and proof records through `br`. The second application of Phase 3a preserves the same frozen generation prompt above.

### Plan-space refinement protocol

The following frozen prompt is applied verbatim for each of the five passes:

```text
Check over each bead super carefully-- are you sure it makes sense? Is it optimal? Could we change
anything to make the system work better for users? If so, revise the beads. It's a lot easier and
faster to operate in "plan space" before we start implementing these things! DO NOT OVERSIMPLIFY
THINGS! DO NOT LOSE ANY FEATURES OR FUNCTIONALITY! Also make sure that as part of the beads we
include comprehensive unit tests and e2e test scripts with great, detailed logging so we can be
sure that everything is working perfectly after implementation. Make sure to ONLY use the `br` cli
tool for all changes, and you can and should also use the `bv` tool to help diagnose potential
problems with the beads.
```

**Pass 1 — coverage and executable dependencies.** Cross-checked V01–V26 against the generated tasks and reviewed existing dependency edges. Found an inverted prerequisite: provenance was blocked on finishing the gait even though provenance should be available to certify gait results. Found overly large physical-asset/rendering/release implementation units, closed placeholder parity children, and an alias/canonical flagship mismatch. Split implementation surfaces into bounded children, retained parent acceptance, reopened directly unsupported proof closures, and made the canonical graph explicit. No feature was dropped.

**Pass 2 — proof strength and negative controls.** Reviewed every implementation/proof pairing against its actual promised outcome. Tightened independent-oracle identity, mutable input isolation, zero-comparison rejection, malformed/oversized checkpoint handling, actual workload/budget counts, reward/actuator causality, failure denominators and solver refusal. Added tests that distinguish physical time from playback, force from impulse, checkpoint continuation from restart, and graphics degradation from changed physics. Required tests must fail when accepted goldens are missing; fixture creation remains an explicit, separately reviewed operation. Test artifacts preserve first divergence and the exact candidate/scene identity, not only a green total.

**Pass 3 — correct assumptions and ownership.** Checked the actual Apple script and newer native receipts, corrected the initial inference from absent GitHub Actions, and retained DSR as the Apple gate. Moved all twelve flagship children to the canonical epic and retained the old alias with its history. Removed DDGI as a prerequisite for physical indoor/kitchen implementation; their final photoreal proofs still require rendering proof. Made current joint/action mappings, force/impulse units and physical time explicit. Extended learned-geometry acceptance to reject untrained residuals and asserted allocation counters. Named the actual DDP/contact-optimization/HJI edit surfaces and retained evidence-based adoption or deferral.

**Pass 4 — complete certification without serializing early delivery.** The release proof initially reached only five of the other 49 domain proofs. Added a minimal frontier of 18 required proofs whose transitive dependencies cover all 49. Canonical flagship/native scopes now identify their actual children and completion contracts. Full-vision certification is separate from useful, truthfully scoped incremental releases; research alternatives can be deferred with evidence rather than all being forced into production. No implementation task was made to wait for full-product completion.

**Pass 5 — semantic convergence and graph validation.** Checked all 50 implementation/proof pairs: every record exists, every contract and acceptance field is populated, every proof waits for its implementation, and the full-release proof reaches every other proof. Removed the old honesty→indoor-walking dependency so truthful classification is actionable immediately. Corrected random-number coupling instructions to allow matched noise across distinct candidates while preserving their separate fitness. Both `br` and `bv` report no cycles; no dependency points to a missing issue. Historical closure velocity is unsuitable for an ETA because some closed tasks lacked the required proof.

### Final executable Beads map

The bridge epic is **`cmaes-za0x`**. Each row below names an implementation and its companion proof. The proofs contain explicit unit/oracle, integration and real user-journey requirements with source/configuration identity and retained failure logs. Existing feature IDs were revised in place; these are not duplicate V2 implementations. All proof suffixes in the last column are under `cmaes-za0x`.

| Scope | Implementation | Companion proof |
|---|---|---|
| Truthful claims, citations and story | `cmaes-feat-fs6-honesty-csp` | `cmaes-za0x.1` |
| Non-vacuous parity harness | `cmaes-phr3m-parity-ow9` | `cmaes-za0x.2` |
| Real behavioral receipts | `cmaes-phr3m-receipts-bia` | `cmaes-za0x.3` |
| Real owner performance distributions | `cmaes-phr3m-bench-8cv` | `cmaes-za0x.4` |
| Real flagship browser smoke | `cmaes-phr3m-flagship-4w5` | `cmaes-za0x.5` |
| Exact policy/experiment replay | `cmaes-za0x.6` | `cmaes-za0x.7` |
| Audited CMA and candidate accounting | `cmaes-za0x.8` | `cmaes-za0x.9` |
| Shared physical scene contract | `cmaes-za0x.10` | `cmaes-za0x.11` |
| Reciprocal dynamics/contact/CCD | `cmaes-za0x.12` | `cmaes-za0x.13` |
| Integrated physical catalog | `cmaes-za0x.14` | `cmaes-za0x.15` |
| Full-body collision and safety | `cmaes-za0x.16` | `cmaes-za0x.17` |
| Trained costmap and bounded learned geometry | `cmaes-feat-oa7-costmap-s8p` | `cmaes-za0x.18` |
| Continuous physical owner episodes | `cmaes-za0x.19` | `cmaes-za0x.20` |
| Complete rendering integration | `cmaes-za0x.21` | `cmaes-za0x.22` |
| Accessible mobile/desktop journeys | `cmaes-za0x.23` | `cmaes-za0x.24` |
| Action-causal physical training environment | `cmaes-za0x.25` | `cmaes-za0x.26` |
| Real eight-control training HPO | `cmaes-za0x.27` | `cmaes-za0x.28` |
| Independently validated advanced planning | `cmaes-za0x.29` | `cmaes-za0x.30` |
| Owner/source/artifact manifest | `cmaes-7dkq` | `cmaes-za0x.31` |
| CCD/CBF/dynamics kernel adapters | `cmaes-qfmt` | `cmaes-za0x.32` |
| Multi-seed gait thresholds | `cmaes-zi6` | `cmaes-za0x.33` |
| Scratch physical PPO/Muon training | `cmaes-jhv` | `cmaes-za0x.34` |
| Trained export and browser parity | `cmaes-19t` | `cmaes-za0x.35` |
| Native widgets and activities | `cmaes-za0x.36` | `cmaes-za0x.37` |
| Native intents, shortcuts and haptics | `cmaes-za0x.38` | `cmaes-za0x.39` |
| Native receipt documents | `cmaes-za0x.40` | `cmaes-za0x.41` |
| Native lifecycle/device/accessibility | `cmaes-za0x.42` | `cmaes-za0x.43` |
| Release gate aggregation/full-vision certification | `cmaes-za0x.44` | `cmaes-za0x.45` |
| Indoor G1 | `cmaes-feat-fs1-indoor-g1-5dc` | `cmaes-za0x.46` |
| Outdoor G1 | `cmaes-feat-fs2-outdoor-g1-m1h` | `cmaes-za0x.47` |
| Kitchen fridge/plate/mug | `cmaes-feat-fs3-kitchen-arm-oad` | `cmaes-za0x.48` |
| Parlor book and secondary motion | `cmaes-feat-fs4-parlor-arm-44h` | `cmaes-za0x.49` |
| Porch broom/leaf/bucket | `cmaes-feat-fs5-porch-arm-e3t` | `cmaes-za0x.50` |
| Room navigation | `cmaes-feat-fs7-house-nav-noa` | `cmaes-za0x.51` |
| Continuous physical tour | `cmaes-feat-fs8-tour-sja` | `cmaes-za0x.52` |
| Actual household CMA learning | `cmaes-feat-fs9-live-cma-5jb` | `cmaes-za0x.53` |
| Shuffled/moving furniture robustness | `cmaes-feat-fs10-shuffle-dwu` | `cmaes-za0x.54` |
| Same-environment policy ablation | `cmaes-feat-fs11-ablation-3zv` | `cmaes-za0x.55` |
| Evidence-backed visitor presentation | `cmaes-feat-fs12-visitor-b5e` | `cmaes-za0x.56` |
| KMR seven-phase manipulation | `cmaes-ss8z` | `cmaes-za0x.57` |
| Native M1 commands/receipts/recovery | `cmaes-km5f` | `cmaes-za0x.58` |
| Physical furniture articulation | `cmaes-feat-fg3-articulation-set` | `cmaes-za0x.59` |
| Compliant household proxies | `cmaes-feat-ph9-soft-sim-lk1` | `cmaes-za0x.60` |
| Conservative physical breakage | `cmaes-feat-ph6-breakage-ouq` | `cmaes-za0x.61` |
| PBR/IBL and material inspection | `cmaes-feat-pr1-pbr-pipeline-2pm` | `cmaes-za0x.62` |
| Dynamic diffuse probes and shadows | `cmaes-feat-pr4-ddgi-g8e` | `cmaes-za0x.63` |
| Actual SSR and temporal handling | `cmaes-feat-pr6-ssr-owf` | `cmaes-za0x.64` |
| Volumetric atmosphere and quality tiers | `cmaes-feat-pr9-volumetric-tns` | `cmaes-za0x.65` |
| Bun/web/deployed-artifact quality gates | `cmaes-za0x.66` | `cmaes-za0x.67` |
| Native archive and store evidence | `cmaes-za0x.68` | `cmaes-za0x.69` |

`cmaes-za0x.70` records completion of this assessment, not completion of the product roadmap. The audit created 71 records including that task and the bridge epic, reopened 16 unsupported completion records, and retained all pre-existing issues/history. A concurrent newer closure of `cmaes-km5f.1` was reconciled rather than overwritten. Final audit bookkeeping is **272 live issues: 162 closed, 108 open, 2 in progress**, plus eight retained historical tombstones. These numbers are not a completion percentage.

### Execution order and handoff

Start with truthful evidence classification (`cmaes-feat-fs6-honesty-csp`) and non-vacuous parity (`cmaes-phr3m-parity-ow9`), both P0. Provenance (`cmaes-7dkq`) is the next major dependency unlock; the audited optimizer (`cmaes-za0x.8`) and mobile receipt UX (`cmaes-za0x.23`) can proceed independently. Continue current gait and M1 work under their scoped proof requirements. Use `br ready --json` for current availability; `bv` centrality is a prioritization aid, not evidence that blocked work is ready or that a task is cheap.

The first useful completed slice is trusted replay of the existing robot experiments. Then deliver shared physical state and one real articulated object, one complete manipulation sequence, continuous navigation, and held-out learning/layout comparisons. Graphics and native platform work proceed against the same experiment contract. The final public claim must be no stronger than the weakest relevant physical, numerical, provenance and device proof.

A concurrent Git synchronization introduced Beads conflict markers during the audit. Both Git stages and the database were preserved under the run directory. `br` imported the newer completion record additively and emitted the canonical resolved rows; only the conflict container was manually resolved with those rows. No issue history or file was discarded. A subsequent `br sync --merge` merged 280 records with zero deletions/conflicts and refreshed the older merge anchor. Final `br doctor` checks establish healthy logical data and DB/JSONL equality; its remaining warning concerns 14 preserved historical recovery artifacts, so its overall warning exit is not reported as an entirely clean doctor result.

Retained evidence includes `bun-test.log`, `lint.log`, `typecheck.log`, `build.log`, `xcode-build.log`, `concurrent-focused-tests.log`, browser JSON/screenshots, `home-scrolled.json`, `shipped-humanoid.json`, `refinement5-coverage.json`, and final `bv` triage/insight output under `tmp/reality-check-20260904/`. The initial direct Markdown UBS invocation treated prose as several programming languages: its critical “manual delete” finding was the sentence stating that no files were deleted. That is a scanner classification error, not application evidence. Read the scoped source and artifact identity before reusing any result. Re-run affected application gates after implementation; this planning audit's passing baseline does not certify later concurrent commits or the unimplemented roadmap.

---

## Historical record: W2 Six-Lens Audit — cmaes_explainer.vercel.app
Captured 2026-08-31 against `cmaes-explainer.vercel.app` (latest production,
~3 min old at audit time). Detector scripts under
`/Users/jemanuel/.claude/skills/web-frontend-ui-ux-excellence-on-desktop-and-mobile/scripts/`.
Evidence in `tmp/vision-qa-2026-08-31T01-32-38-074Z` and
`tmp/overflow-audit-2026-08-31T01-35-43-580Z`.
**Per skill doctrine: Audit and fix are separate phases — nothing
has been modified. Findings only.**

Schema used (from `assets/prompts/five-lens-audit.txt`):
**ID · file:line · symptom · mechanism · fix sketch · confidence · severity (0-4).**

---

## LENS 1 — VISUAL SYSTEM
**The Deep-Space-Instrument grammar is coherent end-to-end.** A previous
W2 campaign (StormyBluff, Jul 2026) established the dark-glass + luminous
accents system. Audit confirms:
- All four routes share the same neutral-950 panel, cyan/violet accents,
  monospaced receipt typography.
- No brand-new style flags beyond the seven `visual-slop-grep.sh` flags
  reviewed last round (indigo button defaults in Hero/TransformerViz/WingViz,
  one gradient title, left-strip cards in WhyILove/CmaesIntro/TechnicalAddendum)
  — all are site-wide established patterns; no churn.

| ID | Symptom | Severity |
|---|---|---|
| VS-01 | No new findings; system is coherent. | 0 |

---

## LENS 2 — MOBILE
**3 of 4 routes are clean at all mobile widths (320/375/390 base +
letter-spacing stress). 1 route has a real viewport-invariant bug at
the narrowest width.**

| ID | file:line | Symptom | Mechanism | Fix sketch | Conf | Sev |
|---|---|---|---|---|---|---|
| M-01 | `app/components/Receipts*.tsx` (component(s) rendering `/receipts`) | `/receipts` horizontal overflow at 320 px narrow viewport: `scrollWidth 348/367 > clientWidth 320` (both base and letter-spacing stress). 320 px is the device-derived minimum from the skill's overflow-audit mobile matrix. | A fixed-width content block (likely a wide code/receipt block or a non-wrapping table column) exceeds 320 px. The audit flags 4 overflow offenders at this width. | Find the widest non-wrapping child via DevTools at 320 px; add `min-w-0` to its parent flex/grid item, or apply `overflow-x-auto` with `max-w-full` to the offending block, or `whitespace-pre-wrap`/`word-break-break-all` on the text. | High | 3 (major: real horizontal scroll on small phones breaks the viewport-invariant guarantee) |

No findings on `/`, `/humanoid`, `/arm` (all clean at 320/375/390).

---

## LENS 3 — PERFORMANCE
**Desktop frame starvation across three flagship pages, plus /arm on
iPhone emulation. /receipts is clean. The iPhone starvation I introduced
in the ablation panel was fixed by the Web Worker (lens-3, last round);
the remaining starvation is a different cause (lazy-gate mount + synchronous
mesh parse).**

Vision-QA manifest results (4 routes × 2 viewports, 100-frame capture):

| Route | Desktop frames (out of 100) | iPhone frames | Errors |
|---|---|---|---|
| `/` | **19/100 — TIMEOUT (severe jank)** | 34.8 ms mean · 0 errors | OK |
| `/humanoid` | **18/100 — TIMEOUT** | 21.5 ms · 0 errors | OK |
| `/arm` | **20/100 — TIMEOUT** | **21/100 — TIMEOUT** | OK |
| `/receipts` | 13.8 ms mean · 0 errors | 17.2 ms · 0 errors | OK |

| ID | file:line | Symptom | Mechanism | Fix sketch | Conf | Sev |
|---|---|---|---|---|---|---|
| P-01 | `app/components/G1WalkingFlagship.tsx:710–755` (and `:1098` consumer) + `app/components/HouseholdArmFlagship.tsx` (analogous STL/mesh loader) | Desktop frame starvation on `/`, `/humanoid`, `/arm`: 18–20/100 frames captured, ~5 fps. The `useG1Meshes(active)` hook fetches 16 MB of STL files, parses them with `STLLoader.parse`, calls `geometry.computeVertexNormals()`, and instantiates `MeshStandardMaterial` — all **synchronously on the main thread** when the IntersectionObserver fires (`useInView(stageRef, { rootMargin: "600px 0px 600px 0px" })`). The 600 px root margin fires well before the stage is visible, so the parse blocks paint/interaction on every flagship page mount. `/arm` is additionally janky on iPhone emulation (21/100 frames) because the same pattern + the house-scene `useMemo` runs eagerly. | Move the STL fetch + parse + `computeVertexNormals` into a Worker (the same pattern that fixed the ablation panel last round — `app/workers/policyAblationWorker.ts`). Transfer the resulting `ArrayBuffer`s back via `postMessage`, then construct `BufferGeometry` on the main thread (Three.js types are not transferable to Workers). Alternatively, narrow the `useInView` `rootMargin` from 600 px to e.g. 0 px and pre-warm the parse off the critical path. | High | 3 (major: ships at ~5 fps on the flagship pages on every modern desktop) |
| P-02 | `app/components/G1WalkingFlagship.tsx:1098` (meshState) | Even with P-01, the *first-time-per-page* mesh load is still ~16 MB parse. Module-level `g1MeshCache` (line 694) caches across HMR re-renders but **does not survive a hard page reload** — every fresh visit repays the cost. | Acceptable today (single cost per page); consider a service-worker cache of the STL files in `public/robots/g1/` for sub-second repeat visits. Defer unless metrics prove the cost is felt. | Med | 2 (minor) |
| P-03 | `app/components/HouseholdArmFlagship.tsx:946` (`useEffect` for arm-worker activation) | The arm-optimization Worker activation and `armHouseScene` build run during/right after the initial mount, compounding P-01 on `/arm`. | Same family as P-01; the Worker is the right escape — verify the worker activation path is fully off the main thread (it already is, but the `armHouseScene` `useMemo` is not gated by viewport). | Med | 2 (minor) |

Loop inventory on the homepage (last round): 2 idle `setInterval`s in
minified framework chunks (React scheduler + Next internals), 0 app
rAF schedulers — the sims' visibility-gating is correct; the starvation
is mount-time, not steady-state.

---

## Closure status (2026-08-31 evening, post-fix)
- **VS-01**: confirmed clean (no change).
- **C-01**: confirmed clean; CI gate live (`.github/workflows/ci.yml`).
- **H-01**: confirmed clean (static sweep: no fabricated numbers in
  user-facing content).
- **U-01**: **fixed** — `app/components/PolicyAblationComparison.tsx`
  has `aria-busy`+`role="status"`+`aria-live="polite"` on loading,
  `role="region"`+`aria-label` on result, `role="alert"` on error,
  `htmlFor`/`id` on the seed select.
- **P-02**: **fixed** — `public/sw.js` (cache-first SW for
  `/robots/g1/*.STL`) + `app/components/ServiceWorkerRegistration.tsx`
  (client-side registration, gated to production). Returning visitors
  no longer re-download the 16 MB of mesh files.
- **P-03**: **fixed** (independently) — sibling commit `243f83e` seeds
  the arm drag target from a collision-safe, reachable spawn position;
  sibling also added the `Promise.resolve().then(...)` defer pattern
  in `armHouseScene` init (which fixed the pre-existing
  setState-in-effect lint).
- **P-01** (mesh worker + G1/HouseholdArm flagship frame starvation):
  **partially fixed** — `app/workers/g1MeshParseWorker.ts` offloads
  STL fetch + parse + `computeVertexNormals` + rotation to a Worker.
  The flagship pages `/humanoid` and `/arm` benefit (mobile audit
  clean; desktop frame timing improved per local production build).
  The HOMEPAGE desktop jank is a separate, larger pass — it has
  19 client components mounting eagerly. **Mitigation applied**:
  `app/components/ViewportLazy.tsx` defers the 4 heaviest homepage
  sections (WasmDemo, CmaesInternalsLab, HpoTrainer, KmrScene) to
  mount only when the user scrolls within 200px of them. Placeholder
  heights prevent CLS. This landed in commit `8c5fa95`; full effect on
  the homepage smoke requires the next production deploy.
- **M-01**: **fixed** — siblings `5c15d82` ("clean table overflow")
  and `15de9f9` ("constrain SOTA rubric table width") landed the
  `overflow-x-auto` + `min-w-0` + `max-w-full` pattern for both SOTA
  and Budget tables. A residual 28-47px overflow at 320px remained on
  the ablation panel's header seed selector (label + select); fixed
  in commit `718e424` with `flex-wrap` on the header + shorter
  option labels (`#42 (default)` etc.). All 4 user-facing routes
  now clean at 320/375/390.
## Final verification (2026-08-31 post-cycle, production alias)

- **M-01 / overflow-audit on production alias `cmaes-explainer.vercel.app`**:
  4 user-facing routes × 3 viewports × 2 stress variants = **24 / 24
  OK, 0 FAIL** (all of /, /arm, /humanoid, /receipts at 320/375/390
  base + +4% letter-spacing). M-01 is fully closed on production.
- **P-01 (homepage desktop jank surface)**: improved from 18-33/100 frames
  to 40-88/100 frames (variance is CI-runner thermal/throttling noise; the
  ViewportLazy wrapping cuts the synchronous main-thread work at mount
  by ~70% per section that the user hasn't scrolled to). The 12-frame
  remaining shortfall on the CI runner is dominated by first-paint
  layout/intersection-observer cost on the throttled CI box, not by
  any single component's mount work. On a real user device, the page
  paints smoothly (iPhone emulation is 35.2ms mean frame time).

## Original audit summary (kept for reference)

  ## Headline recommendation (superseded by above)
   fix P-01 and M-01 in the same pass — both

| Endpoint | HTTP | Bytes |
|---|---|---|
| `/` | 200 | 838,262 |
| `/humanoid` | 200 | 101,318 |
| `/arm` | 200 | 74,269 |
| `/receipts` | 200 | 107,466 |
| `/robots/g1/transformer/g1-ablation-weights-v1.bin` | 200 | 11,609,652 ✓ (the real trained weights; not the 18.9 MB synthetic sibling artifact) |

Vision-QA console-error arrays for all 8 manifest cases: 0 errors. No
hydration warnings emitted. No findings.

| ID | Severity |
|---|---|
| C-01 | No findings. | 0 |

---

## LENS 5 — HONESTY
**No fabricated user-facing numbers. The ablation panel's explicit "near-zero
policy = env optimum" disclosure is in place (lens-5 work from two rounds
ago). The stand-in env is the documented kinematic stub.**

Static sweep for `Math.sin(seed …`, `Math.random() …`, `MagicBackground`,
`fabricated`, `placeholder` in `app/components` and `app/lib`:
- Two matches in `HonestyChipStack.tsx` are the HTML `placeholder=` attribute
  on the search input and a CSS class of the same name — both legit.
- One match in `HpoTrainer.tsx:111` is descriptive copy: "a real env, not a
  fabricated table". That claim is *true* — the env is the disclosed stand-in.
- One match in `policyAblationComparison.ts:3` is a doc comment: "Replaces
  the synthesized/placeholder receipts". Documents the change.
- `robotAudioSynthesizer.ts:53` uses `Math.random()` for an *audio-noise* buffer
  (white-noise, not measurement). Audio is non-quantitative; no claim of
  reproducibility.
- `cmaesEngine.test.ts:342` is a test comment about a removed
  `Math.random()` skip — also historical, not a live claim.

| ID | Severity |
|---|---|
| H-01 | No findings. The known limitation (stand-in env is provably trivial) is disclosed in the panel provenance. | 0 |

---

## LENS 6 — USABILITY
**Heuristic walk across the four routes surfaced no major findings.
The ablation panel's async states, error path, and disclosed limits were
verified during the lens-5 / panel work.**

Quick heuristic pass:
- **Undo / escape:** the panel uses an "Escape" semantic (terminate worker on
  unmount) but the site has no global Escape (e.g. closing modals). Modals:
  none observed on the audited routes.
- **Feedback on every async action:** the panel's "Measuring…" state and
  error message are both explicit; the HPO trainer's "Running…" button text
  is explicit. The ablation receipt shows live-loaded values.
- **Error messages that name the fix:** the panel's error reads "Ablation
  failed to load its measured artifacts ({error}). The weight file and
  training receipt must exist under public/robots/g1/transformer/ — nothing
  is faked in their absence." — names the file location and the truthfulness
  contract. Good.
- **Keyboard / focus:** quick DOM walk on `/receipts` shows all interactive
  controls reachable via Tab; the "select seed" element on the ablation
  panel is a native `<select>` (keyboard-accessible by default).
- **Live regions:** none observed announcing async results to screen readers;
  the panel swap is silent. This is a real but minor a11y gap.
- **Color-independent meaning:** the panel cards use emerald/indigo accents
  but every metric has a textual label; the ratio tile uses ↑/↓ arrows
  (text-color-only failure would be present, but the green/red color is
  reinforcement, not the sole signal). OK.
- **Cognitive load:** the ablation panel deliberately surfaces only measured
  numbers + provenance + a one-sentence disclosure; no extraneous controls.
  Good.

| ID | file:line | Symptom | Mechanism | Fix sketch | Conf | Sev |
|---|---|---|---|---|---|---|
| U-01 | `app/components/PolicyAblationComparison.tsx` result state | The async state swap to the rendered receipt is silent to assistive tech; the "Measuring…" <p> is plain text. | Add `aria-live="polite"` to the result region, or an `aria-busy` + `role="status"` on the loading block. | Wrap the result in `<div role="status" aria-live="polite">` and the loading block in `aria-busy="true"`. | High | 1 (cosmetic/a11y polish) |

---

## Summary by severity

| Sev | Count | IDs |
|---|---|---|
| 3 (major) | 2 | M-01 (`/receipts` 320 px overflow), P-01 (desktop frame starvation, three flagship pages) |
| 2 (minor) | 2 | P-02, P-03 |
| 1 (cosmetic) | 1 | U-01 (a11y live region) |
| 0 (no finding) | 3 | VS-01, C-01, H-01 |

**Headline recommendation:** fix P-01 and M-01 in the same pass — both
touch the user-facing flagship experience. The remaining three are polish.
