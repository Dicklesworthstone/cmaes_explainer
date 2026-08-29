# Epic 6: G1 walking + arm manipulation in the photo-real household

**Owns:** the two flagship demonstrations — G1 walking through the house / on outdoor terrain, and the KUKA-style arm picking up and placing household objects — that *demonstrate* everything in Epics 1-5 in a way a user can see, feel, and trust.

**Why now:** the user directive is that the walking and arm robots are *in* the photo-real household. Today's flagships render a flat plane + a 5×3 m strip; that is a *test*, not a *demonstration*. Once Epics 1-5 land, the flagships become the proof that the system works.

**Reference points:**
- `cmaes-7y3` (closed): the Flat / Terrain+Push toggle (kept; this epic adds Indoor / Outdoor).
- `cmaes-h92` (closed): the evidence-backed 5040-D G1 flagship.
- `cmaes-a0f` (closed): higher-fidelity robotics scenes and parallel evaluation.
- `cmaes-m5v` (deferred): the owner-composed household manipulation flagship; this epic is the realization path for that deferral.

## Background and goals

The two flagships are the public face of the project. They must:
- Render in the photo-real household (Epic 1) with parameterized furniture (Epic 2) that the kernel (Epic 3) actually simulates, with the geometry (Epic 4) honestly resolved, and with the safety filter (Epic 5) visibly active.
- Use the multi-factor objective (per cmaes-pvz) where the obstacle-avoidance term (Epic 5 oa10) is a first-class contributor.
- Be honest about what is real: every effect that is display-only (a contact shadow from a piece the kernel will not collide with) is labeled in the honesty chip.
- Be reproducible: same seed → same trace.

This epic wires everything together, but does *not* invent new physics or new rendering tricks — those are upstream.

## Sub-tasks (children)

- `cmaes-fs1` (P1, feature): **Indoor G1 walking flagship** — the existing 5,040-D G1 walking experiment, but the walking surface is the kitchen floor of the Craftsman house, surrounded by parameterized furniture, lit by Epic 1, filtered by Epic 5. Multi-factor objective includes the obstacle-avoidance term. The walking curriculum is restated to: traverse a fixed path through the kitchen (counter, dining table, doorway to parlor) without contact.
- `cmaes-fs2` (P1, feature): **Outdoor G1 walking flagship** — the existing terrain-and-push experiment, but on the backyard porch / garden with parameterized planters, a grill, a hose reel. The terrain is the heightfield from Epic 4 cl7. Multi-factor objective includes clearance from the planters.
- `cmaes-fs3` (P1, feature): **Indoor arm manipulation flagship (kitchen pick-place)** — the KUKA-style arm on the kitchen counter; parameterized appliances (fridge with door, microwave with door, plates, mugs); task: open the fridge, take out a plate, place it on the counter; then re-shelve a mug. Whole-body CBF (oa5) protects the arm.
- `cmaes-fs4` (P1, feature): **Indoor arm manipulation flagship (parlor tidy)** — the same arm in the parlor; parameterized sofa, coffee table, books, lamp; task: pick up a book from the floor, place on the coffee table. Furniture can be jostled by the arm's contact; the kernel resolves secondary motion.
- `cmaes-fs5` (P1, feature): **Outdoor arm manipulation flagship (porch cleanup)** — the arm on the porch; parameterized planters, hose reel, broom; task: pick up a broom, sweep a leaf into a bucket. The leaf is a small object (Epic 2 fg8).
- `cmaes-fs6` (P1, feature): **Honesty chip stack (full)** — every chip the G1 and arm render is documented: "policy: …", "trace: terrain-and-push", "policy-source: kernel", "backdrop: house floorplan (display-only)", "safety-filter: CBF active", "obstacle-avoidance: learned costmap + analytic barrier", etc. Each chip references a bead id; clicking a chip scrolls to the relevant source.
- `cmaes-fs7` (P2, feature): **House navigation experiment** — the G1 walks from the kitchen to the bedroom to the bathroom following a waypoint chain (cmaes-1yu's HouseNavigation kernel challenge, but with parameterized furniture + safety filter).
- `cmaes-fs8` (P2, feature): **Multi-room tour** — a single 720-step rollout traces the G1 through the kitchen, the parlor, the hallway, the bedroom, and back; the trace is replayed in the UI as a 3D fly-through.
- `cmaes-fs9` (P2, feature): **Live CMA-ES in the household** — the existing live CMA-ES visualization (the family of three scalable owners on the 5,040-D policy), but the rollout is now in the household, not the flat plane. The user sees the walking policy evolve in real time against the parameterized furniture.
- `cmaes-fs10` (P2, feature): **Re-shuffled furniture stress test** — at the start of every rollout, the furniture is randomly perturbed (positions jittered, one piece rolling) within a documented envelope. The optimizer must produce a policy that is robust across the envelope.
- `cmaes-fs11` (P2, feature): **Side-by-side ablation** (cmaes-zqg reborn) — same furniture layout, same seed, two policies: (a) the CMA-ES linear residual policy (the existing flagship), (b) the learned-from-scratch transformer (when cmaes-jhv lands). Honest framing: sample-efficiency vs ceiling, not "winner".
- `cmaes-fs12` (P3, feature): **Visitor mode** — a single canonical 30-second clip (deterministic, seed-locked) that the OG share image / landing page / Twitter card all reference. Auto-generated, no user input.

## Acceptance criteria (epic level)

- The G1 walking kitchen flagship: standing prior survives > 336 steps; walking curriculum completes 720 steps; ≥ 1.0 m forward; ≥ 0.5 m/s mean forward speed; no contact within 1 mm of any piece. (cmaes-pvz acceptance criteria, but now in the household.)
- The arm kitchen pick-place: opens the fridge, retrieves a plate, places on the counter, all in ≤ 60 s of policy execution; CBF never infeasible.
- The arm parlor tidy: picks up a book from the floor, places on the coffee table, in ≤ 30 s; secondary motion of the sofa is recorded.
- The arm porch cleanup: picks up a broom, sweeps a leaf, in ≤ 45 s.
- House navigation: G1 traverses the waypoint chain in ≤ 90 s; no CBF infeasibility.
- Live CMA-ES: the three scalable owners beat the standing-prior reference within 32 generations on all 3 declared seeds.
- Re-shuffled stress test: at least 2 of 3 declared seeds pass; failure mode is documented in the trace.
- Side-by-side ablation: same furniture, same seed, two policy traces, two receipts; the trade-off is readable.
- All honesty chips click through to the right bead / source file.
- bun test, bun typecheck, bun lint green; cmaes-pvz (re-run), cmaes-nxj, cmaes-a0f, cmaes-mky all still green.

## Dependencies (blocking)

- Epic 1 (cmaes-pr0): photo-real rendering.
- Epic 2 (cmaes-fg0): parameterized furniture.
- Epic 3 (cmaes-ph0): dynamic physics.
- Epic 4 (cmaes-cl0): clipping / boundary.
- Epic 5 (cmaes-oa0): safety filter + obstacle-avoidance term.
- `cmaes-pvz` (P1, open): the multi-factor objective this epic instantiates.
- `cmaes-nxj` (P1, in_progress): the G1 flagship.
- `cmaes-m5v` (P1, deferred): the household-manipulation flagship (this epic re-derives it).
- `cmaes-1yu` (P2, open): the house-nav kernel.
- `cmaes-zqg` (P2, open): the ablation.

## Dependents (this epic blocks)

- Nothing inside this repo — the flagships are the public face. But the Vercel deploy + the OG share image depend on these being the canonical demo.

## Cross-cutting constraints

- Every flagship must run end-to-end on the user's machine in a desktop browser (1920×1080, 60 fps) and on an iPhone Safari (≥ 30 fps at 1280×720). The rch build budget applies; defer to the existing per-family timing logs.
- The Vercel deploy bundle must not exceed the 25 MB function output limit; use KTX2 streaming for textures.
- All flagship experiments are reproducible from a single seed; the user can re-run a trace by URL.
- Honesty discipline: every "magic" effect (a contact shadow on a piece the kernel didn't collide with, a learned costmap that hides the analytic barrier, etc.) is in the chip stack.

## References

- cmaes-7y3 (closed), cmaes-h92 (closed), cmaes-a0f (closed), cmaes-m5v (deferred) — internal beads.
- https://machinelearning.apple.com/research/roomplan (16-category furniture taxonomy inspiration).
- The SOTA references from Epics 1-5 apply here too; this epic is the integration layer.
