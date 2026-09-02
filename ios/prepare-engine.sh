#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:A:h}
PROJECT_ROOT=${SCRIPT_DIR:h}
FRANKENSIM_ROOT=${FRANKENSIM_ROOT:-${PROJECT_ROOT:h}/frankensim}
MODE="stage"
ALLOW_UNVERIFIED_EXISTING=0

usage() {
  print -r -- "Usage: ./ios/prepare-engine.sh [--stage-only] [--activate] [--allow-unverified-existing]"
  print -r -- ""
  print -r -- "  --stage-only                 Build and validate a new engine without changing ios/Engine (default)."
  print -r -- "  --activate                   Preserve ios/Engine at a printed rollback path, then activate the stage."
  print -r -- "  --allow-unverified-existing  Permit first activation when the legacy engine has no SHA-256 manifest."
}

fail() {
  print -u2 -r -- "Engine export refused: $1"
  exit 1
}

for argument in "$@"; do
  case "$argument" in
    --stage-only) MODE="stage" ;;
    --activate) MODE="activate" ;;
    --allow-unverified-existing) ALLOW_UNVERIFIED_EXISTING=1 ;;
    --help|-h) usage; exit 0 ;;
    *) usage >&2; fail "unknown argument: $argument" ;;
  esac
done

[[ "$(git -C "$FRANKENSIM_ROOT" rev-parse --is-inside-work-tree 2>/dev/null)" == "true" ]] \
  || fail "FrankenSim is not a Git worktree: $FRANKENSIM_ROOT"

cd "$PROJECT_ROOT"

SOURCE_DIRTY=$(git status --porcelain --untracked-files=normal)
[[ -z "$SOURCE_DIRTY" ]] || fail "cmaes_explainer has uncommitted or untracked bytes; source-commit.txt would be incomplete"

FRANKENSIM_DIRTY=$(git -C "$FRANKENSIM_ROOT" status --porcelain --untracked-files=normal)
[[ -z "$FRANKENSIM_DIRTY" ]] || fail "FrankenSim has uncommitted or untracked bytes; its commit receipt would be incomplete"

SOURCE_COMMIT=$(git rev-parse HEAD)
FRANKENSIM_COMMIT=$(git -C "$FRANKENSIM_ROOT" rev-parse HEAD)
OWNER_KERNEL_VERSION=$(sed -n 's/^export const FRANKENSIM_OWNER_KERNEL_VERSION = "\([^"]*\)";/\1/p' \
  "$PROJECT_ROOT/app/lib/frankensimCmaes.ts")
[[ -n "$OWNER_KERNEL_VERSION" ]] || fail "FRANKENSIM_OWNER_KERNEL_VERSION could not be resolved"
OWNER_RUNTIME_DIR="v${OWNER_KERNEL_VERSION//./}"

verify_source_fences() {
  [[ "$(git rev-parse HEAD)" == "$SOURCE_COMMIT" ]] \
    || fail "cmaes_explainer HEAD moved during export"
  [[ -z "$(git status --porcelain --untracked-files=normal)" ]] \
    || fail "cmaes_explainer changed during export"
  [[ "$(git -C "$FRANKENSIM_ROOT" rev-parse HEAD)" == "$FRANKENSIM_COMMIT" ]] \
    || fail "FrankenSim HEAD moved during export"
  [[ -z "$(git -C "$FRANKENSIM_ROOT" status --porcelain --untracked-files=normal)" ]] \
    || fail "FrankenSim changed during export"
}

bunx next build ios/EngineWeb
verify_source_fences

STAGE_PARENT=$(mktemp -d "${TMPDIR:-/tmp}/frankenrobots-engine.XXXXXX")
STAGED_ENGINE="$STAGE_PARENT/Engine"
[[ "$(stat -f %d "$STAGE_PARENT")" == "$(stat -f %d "$SCRIPT_DIR")" ]] \
  || fail "temporary stage is on a different filesystem and cannot be activated atomically: $STAGE_PARENT"
mkdir -p "$STAGED_ENGINE"
cp -R "$SCRIPT_DIR/EngineWeb/out/." "$STAGED_ENGINE/"
cp -R "$PROJECT_ROOT/public/." "$STAGED_ENGINE/"

print -r -- "$SOURCE_COMMIT" > "$STAGED_ENGINE/source-commit.txt"
print -r -- "clean" > "$STAGED_ENGINE/source-tree-state.txt"
print -r -- "$FRANKENSIM_COMMIT" > "$STAGED_ENGINE/frankensim-workspace-commit.txt"
print -r -- "clean" > "$STAGED_ENGINE/frankensim-workspace-state.txt"
print -r -- "$OWNER_KERNEL_VERSION" > "$STAGED_ENGINE/owner-kernel-version.txt"

for required_route in \
  "frankenrobots/humanoid/index.html" \
  "frankenrobots/arm/index.html"; do
  [[ -s "$STAGED_ENGINE/$required_route" ]] || fail "missing exported route: $required_route (stage retained at $STAGE_PARENT)"
done

OWNER_ASSET_ROOT="$STAGED_ENGINE/wasm/fs-cmaes/$OWNER_RUNTIME_DIR"
for required_asset in \
  "fs_cmaes_viz_wasm.js" \
  "fs_cmaes_viz_wasm_bg.wasm" \
  "fs_cmaes_viz_wasm.d.ts" \
  "fs_cmaes_viz_wasm_bg.wasm.d.ts" \
  "package.json"; do
  [[ -s "$OWNER_ASSET_ROOT/$required_asset" ]] || fail "missing owner $OWNER_KERNEL_VERSION asset: $required_asset (stage retained at $STAGE_PARENT)"
done

[[ -s "$STAGED_ENGINE/workers/g1MeshParseWorker.js" ]] || fail "missing runtime G1 mesh parser (stage retained at $STAGE_PARENT)"

EXPECTED_MESHES=(${(f)"$(sed -n 's/.*: "\([^"]*\.STL\)",/\1/p' "$PROJECT_ROOT/app/components/G1WalkingFlagship.tsx" | LC_ALL=C sort -u)"})
[[ ${#EXPECTED_MESHES[@]} -gt 0 ]] || fail "no G1 mesh requirements were found in the flagship"
for mesh_name in $EXPECTED_MESHES; do
  [[ -s "$STAGED_ENGINE/robots/g1/$mesh_name" ]] || fail "missing required G1 mesh: $mesh_name (stage retained at $STAGE_PARENT)"
done
ACTUAL_MESH_COUNT=$(find "$STAGED_ENGINE/robots/g1" -maxdepth 1 -type f -name '*.STL' | wc -l | tr -d ' ')
[[ "$ACTUAL_MESH_COUNT" -eq ${#EXPECTED_MESHES[@]} ]] || fail "G1 mesh corpus has $ACTUAL_MESH_COUNT files but the flagship requires ${#EXPECTED_MESHES[@]} (stage retained at $STAGE_PARENT)"

(
  cd "$STAGED_ENGINE"
  find . -type f ! -name engine-content-sha256.txt -print0 \
    | LC_ALL=C sort -z \
    | xargs -0 shasum -a 256 > engine-content-sha256.txt
)
[[ -s "$STAGED_ENGINE/engine-content-sha256.txt" ]] || fail "content manifest is empty (stage retained at $STAGE_PARENT)"
verify_source_fences

if [[ "$MODE" == "stage" ]]; then
  print -r -- "Validated FrankenRobots engine stage: $STAGED_ENGINE"
  print -r -- "Source: ${SOURCE_COMMIT[1,12]} · FrankenSim: ${FRANKENSIM_COMMIT[1,12]} · owner: $OWNER_KERNEL_VERSION · G1 meshes: $ACTUAL_MESH_COUNT"
  print -r -- "ios/Engine was not changed. Re-run with --activate after reviewing this stage."
  exit 0
fi

CURRENT_ENGINE="$SCRIPT_DIR/Engine"
ROLLBACK_ENGINE="$STAGE_PARENT/previous-Engine"
if [[ -d "$CURRENT_ENGINE" ]]; then
  if [[ -s "$CURRENT_ENGINE/engine-content-sha256.txt" ]]; then
    (
      cd "$CURRENT_ENGINE"
      shasum -a 256 -c engine-content-sha256.txt >/dev/null
    ) || fail "existing ios/Engine differs from its manifest"
  elif [[ "$ALLOW_UNVERIFIED_EXISTING" -ne 1 ]]; then
    fail "existing legacy ios/Engine has no manifest; inspect it, then add --allow-unverified-existing for the first migration"
  fi
  mv "$CURRENT_ENGINE" "$ROLLBACK_ENGINE"
fi

if ! mv "$STAGED_ENGINE" "$CURRENT_ENGINE"; then
  if [[ -d "$ROLLBACK_ENGINE" && ! -e "$CURRENT_ENGINE" ]]; then
    mv "$ROLLBACK_ENGINE" "$CURRENT_ENGINE"
  fi
  fail "activation failed; the previous engine was restored when possible"
fi

print -r -- "Activated FrankenRobots engine at $CURRENT_ENGINE"
print -r -- "Source: ${SOURCE_COMMIT[1,12]} · FrankenSim: ${FRANKENSIM_COMMIT[1,12]} · owner: $OWNER_KERNEL_VERSION · G1 meshes: $ACTUAL_MESH_COUNT"
if [[ -d "$ROLLBACK_ENGINE" ]]; then
  print -r -- "Previous engine preserved for rollback: $ROLLBACK_ENGINE"
fi
