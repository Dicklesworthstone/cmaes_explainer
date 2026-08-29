# Math-side SOTA one-pagers (the only task I actually own)

# What this task is

Write `docs/SOTA-MATH.md` as the **math-side** SOTA research
synthesis doc for the phr-env-2026 charter. The doc is the canonical
self-documenting deliverable for the math behind every
`cmaes-feat-*` feature and every `cmaes-phr4-9` epic.

# Why this task exists

The user explicitly said: "Do exhaustive research online looking
through academic papers and the like. OK so please take ALL of that
and elaborate on it... The beads should be so detailed that we never
need to consult back to the original markdown plan document."

Without this doc, future-self would have to re-derive the SOTA
citations and the why-this-technique-here reasoning. This task
locks in the citations and the reasoning, in a single canonical
file that maps 1:1 to the implementation beads.

# Deliverable

`docs/SOTA-MATH.md` with:

- 13 sections, one per reference (the full list in `cmaes-phr3`).
- ~150 lines per section, with the following sub-structure:
  - **Citation** (full author list, venue, year, DOI / arXiv-id)
  - **Headline result** (1-2 sentences, plain English)
  - **Math** (one equation in KaTeX, the most relevant one for our
    usage)
  - **Implementation note** (which file in this repo consumes it,
    e.g. "consumed by `cmaes-feat-cl3-mesh-sdf-ve3` as the
    Lipschitz-bounded triangle-mesh SDF")
  - **Reproduction artifact** (test name in `bun test` or
    `cmaesEngine.test.ts`, or the paper benchmark)
  - **Gotchas** (what it does NOT solve, when it fails, when a
    different technique is better)
- A code-citation map at the end: `app/lib/cmaesEngine.ts:140 ->
  Ericson §4 (GJK)`, `app/lib/frankensimCmaes.ts:99 ->
  Loshchilov 2014 (LM-CMA)`, etc.

# Acceptance

- The file exists at `docs/SOTA-MATH.md`.
- It has 13 sections + the code-citation map.
- Every section has the 6 sub-structures (Citation, Headline,
  Math, Implementation, Reproduction, Gotchas).
- The code-citation map covers at least 10 files in the repo (the
  ones that consume the SOTA techniques).

# Out of scope

- The measurement-side one-pagers (RubyThrush's
  `cmaes-phr3m-sota-m2c`).
- The implementation beads (every other epic in the charter).
- Updating implementation code to match the SOTA doc (this task
  is documentation-only).

# Test plan

- File exists at `docs/SOTA-MATH.md`.
- `grep -c '^## ' docs/SOTA-MATH.md` returns 13 (13 section
  headers).
- `grep -c '^### ' docs/SOTA-MATH.md` returns >= 78 (13 sections
  x 6 sub-structures, allow some leeway).
- A `bun test` smoke test or a `node` script that parses the
  file and asserts the structure.
