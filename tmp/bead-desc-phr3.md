# Why this epic exists (background)

The user directive says: "Do exhaustive research online looking
through academic papers and the like. OK so please take ALL of that
and elaborate on it... The beads should be so detailed that we never
need to consult back to the original markdown plan document."

The SOTA research is the **self-documenting deliverable** that ties
every implementation bead (cmaes-feat-*, cmaes-phr4-9, cmaes-phr3m-*)
to its mathematical foundation. Without this doc, the next agent
revisiting the work would have to re-derive the citations and the
why-this-technique-here reasoning from scratch.

# What this epic is

A canonical SOTA research synthesis doc, organized as:

- **`docs/SOTA-MATH.md`** (math side, owned by TurquoiseFalcon,
  `cmaes-phr3.1`): one section per canonical SOTA reference, with
  citation + headline result + math (one equation in KaTeX) +
  implementation note (which file in this repo consumes it) +
  reproduction artifact (test name, or paper benchmark) + gotchas
  (what it does NOT solve, when it fails). A code-citation map at the
  end (filename -> reference section).
- **`docs/SOTA-MEASUREMENT.md`** (measurement side, owned by
  RubyThrush, `cmaes-phr3m-meas-mlw`): same structure for the
  parity-harness / regression-bounded benchmark / SOTA-score-rubric
  side.

The two docs share the same structure so future-self can grep the
codebase and find the citation map in one place.

# The 13 canonical references that ground the math side (`cmaes-phr3.1`)

1. **Ericson, *Real-Time Collision Detection* (Morgan Kaufmann, 2005;
   ISBN 1-55860-732-3).** GJK, EPA, SAT, BVH/SAH, contact manifold.
2. **Ames, Xu, Grizzle, Tabuada, *Control Barrier Functions:
   Exponential Obstacle Avoidance in Control Systems*, IEEE TAC
   62(8), 2017.** Foundational CBF paper.
3. **Ames, Coogan, Egerstedt, Notomista, Sreenath, Tabuada, *Control
   Barrier Functions: Theory and Applications*, ECC 2019
   (multi-author tutorial).** Replaces unverified Khamlichi IJRR
   2022.
4. **Jo, Zhang, Yang, Luo, *Geometry-Aware Control Barrier Functions
   for Collision Avoidance via Bernstein Polynomial Approximations*,
   ICRA 2026 (arXiv:2605.30696).** DIRECTLY FETCHED and verified this
   session at https://arxiv.org/abs/2605.30696v1.
5. **Mirtich, *Impulse-based Dynamic Simulation of Rigid Body
   Systems*, PhD thesis, UC Berkeley 1996.** Confirmed via 2025 MDPI
   paper and 2026 KSRM paper.
6. **Bridson, *Computational Aspects of Dynamic Contact*, 2006 (and
   ACM TOG 2002-2008).** Contact-manifold reference.
7. **Frisken, Perry, *Adaptive Sampling of Signed Distance Fields*,
   2002.** Canonical SDF adaptive-sampling.
8. **Mueller, Smolik, Mašek, *Signed Distance Fields for Real-time
   Processing of Bones and Ligaments*, IEEE TVCG 2014.**
   Articulated-body SDF.
9. **Hansen, *The CMA Evolution Strategy: A Tutorial*, arXiv 2016.**
   Canonical CMA-ES tutorial.
10. **Loshchilov, *LM-CMA: Large-Scale Black-Box Optimization*,
    2014.** Confirmed via 2026 follow-up
    (https://arxiv.org/html/2608.22862v1).
11. **Catto, *Soft Constraints*, GDC 2011.** Box2D / Bullet-3
    contact-constraint reference.
12. **Sutton, Barto, *Reinforcement Learning: An Introduction* (2nd
    ed., MIT Press, 2018), ch. 4-5 (Dynamic Programming).** Canonical
    DP reference. The user explicitly asked for "DP" application;
    the value-iteration sub-bead in `cmaes-phr3.1` is the concrete
    instance.
13. **LaValle, *Planning Algorithms* (Cambridge UP, 2006), ch. 2
    (Discrete Planning) + ch. 5 (Sampling-Based Planning).** The
    complement to Sutton-Barto for state-space planning.

# Acceptance (epic closes when both side docs are present and the code-citation map is non-empty)

- `docs/SOTA-MATH.md` exists with one section per reference (13
  sections, ~150 lines each).
- `docs/SOTA-MEASUREMENT.md` exists (RubyThrush owns; the SOTA-score
  rubric bead `cmaes-phr3m-sota-m2c` is the concrete instance).
- A code-citation map (filename -> reference section) exists in both
  docs.
- Every `cmaes-feat-*` and `cmaes-phr4-9` epic has at least one SOTA
  reference in `docs/SOTA-MATH.md` it cites.

# What I own vs. what RubyThrush owns

- **TurquoiseFalcon (me)**: this EPIC bead + `cmaes-phr3.1` (the
  math-side one-pagers in `docs/SOTA-MATH.md`).
- **RubyThrush**: `cmaes-phr3m-meas-mlw` (the measurement-side
  epic) and the SOTA-score-rubric bead `cmaes-phr3m-sota-m2c`.
- **CreamHare**: the implementation epics `cmaes-phr4-9` and the
  `cmaes-feat-*` family (the docs are about those features).

# Out of scope

- The actual implementation work (every other epic in the
  phr-env-2026 charter).
- The visual / PBR / light transport (CreamHare's `cmaes-phr4`).
- The measurement / parity / perf harnesses (RubyThrush's slice C).
