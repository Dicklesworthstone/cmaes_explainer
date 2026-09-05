# FrankenRobots

Universal iPhone, iPad, and Mac Catalyst laboratory for the Humanoid and Arm flagships.

## Generate the engine and Xcode project

```bash
cd /Users/jemanuel/projects/cmaes_explainer
./ios/prepare-engine.sh
# Copy the printed stage path and manifest digest after review:
./ios/prepare-engine.sh --activate-stage '/absolute/path/to/Engine' \
  --expect-manifest-sha256 'printed-64-character-digest'
cd ios
xcodegen generate
open FrankenRobots.xcodeproj
```

The first command is deliberately stage-only: it builds and validates a
candidate under a printed temporary path without changing `ios/Engine`. Review
that stage, then use the exact printed `--activate-stage` command. Activation
requires the printed SHA-256 digest of the reviewed manifest, rechecks every
file and source receipt, and refuses modified, missing, or newly added bytes.
The shorthand `--activate` builds and immediately activates a fresh stage; use
it only when a separate review interval is unnecessary. The first migration
from a legacy engine without a content manifest also requires
`--allow-unverified-existing`. Activation moves the previous engine to the
printed rollback path before moving the validated stage into place; it never
silently discards the previous bundle.

The production export is bundled under `Engine/` and served only over an ephemeral `127.0.0.1` port. The local response supplies the cross-origin isolation headers required by the worker/WASM pipeline. The app rejects non-loopback WebView navigation; explicit external documentation links open through the system.

`prepare-engine.sh` refuses a dirty source tree in this repository. It verifies
the committed owner manifest, hashes both executable assets, and checks the
source revision exported by that WASM. No adjacent Rust checkout is required.
A successful export records
five provenance receipts plus a content manifest under `Engine/`:

- `source-commit.txt` — the exact `cmaes_explainer` revision that produced the bundle.
- `source-tree-state.txt` — must say `clean`.
- `frankensim-workspace-commit.txt` — the FrankenSim source revision bound to the executing owner artifact.
- `frankensim-workspace-state.txt` — must say `artifact-bound`.
- `owner-kernel-version.txt` — the versioned robotics-owner artifact that actually executes the rollouts.
- `engine-content-sha256.txt` — the sorted SHA-256 inventory of every other bundled file.

Before a stage is accepted, the script also requires both embedded routes, the
version-matched owner JS/WASM/type package, the runtime G1 mesh parser, and the
exact STL corpus referenced by `G1WalkingFlagship.tsx`.

The owner manifest is copied with the same JS/WASM used by the website; a
nearby checkout cannot stand in for its build identity. If the app shows **Engine bundle needs attention**,
rerun `prepare-engine.sh` from a clean source tree and rebuild.

See `docs/FRANKENROBOTS_APP_PLAN.md` for the product, bridge, offline, platform, and release gates.
