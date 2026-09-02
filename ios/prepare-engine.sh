#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:A:h}
PROJECT_ROOT=${SCRIPT_DIR:h}
FRANKENSIM_ROOT=${FRANKENSIM_ROOT:-${PROJECT_ROOT:h}/frankensim}
MODE="stage"
MODE_EXPLICIT=0
ACTIVATION_STAGE=""
EXPECTED_MANIFEST_SHA256=""
ALLOW_UNVERIFIED_EXISTING=0

usage() {
  print -r -- "Usage: ./ios/prepare-engine.sh [--stage-only | --activate | --activate-stage ABSOLUTE_PATH --expect-manifest-sha256 DIGEST] [--allow-unverified-existing]"
  print -r -- ""
  print -r -- "  --stage-only                 Build and validate a new engine without changing ios/Engine (default)."
  print -r -- "  --activate                   Build, validate, and immediately activate a new stage."
  print -r -- "  --activate-stage PATH        Revalidate and activate the exact previously reviewed stage at PATH."
  print -r -- "  --expect-manifest-sha256 D   Require the reviewed stage manifest to have SHA-256 digest D."
  print -r -- "  --allow-unverified-existing  Permit first activation when the legacy engine has no SHA-256 manifest."
}

fail() {
  print -u2 -r -- "Engine export refused: $1"
  exit 1
}

resolve_owner_runtime_dir() {
  local owner_version="$1"
  local owner_semver="${owner_version##* }"

  print -r -- "$owner_semver" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$' \
    || fail "owner kernel version has no valid semantic-version suffix: $owner_version"
  print -r -- "v${owner_semver//./}"
}

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

verify_content_manifest() {
  local engine_dir="$1"
  local engine_label="$2"
  local expected_manifest_digest="${3:-}"
  local manifest="$engine_dir/engine-content-sha256.txt"
  local manifest_digest
  local observed_manifest

  [[ -s "$manifest" ]] || fail "$engine_label has no content manifest"
  manifest_digest=$(shasum -a 256 "$manifest" | awk '{print $1}')
  if [[ -n "$expected_manifest_digest" ]]; then
    [[ "$manifest_digest" == "$expected_manifest_digest" ]] \
      || fail "$engine_label manifest digest does not match the reviewed digest"
  fi
  observed_manifest=$(
    cd "$engine_dir"
    find . -type f ! -name engine-content-sha256.txt -print0 \
      | LC_ALL=C sort -z \
      | xargs -0 shasum -a 256
  ) || fail "could not hash $engine_label"
  [[ "$observed_manifest" == "$(<"$manifest")" ]] \
    || fail "$engine_label differs from its manifest (modified, missing, or unlisted file)"
}

validate_payload() {
  local engine_dir="$1"
  local engine_label="$2"
  local owner_asset_root="$engine_dir/wasm/fs-cmaes/$OWNER_RUNTIME_DIR"
  local actual_mesh_count

  for required_route in \
    "frankenrobots/humanoid/index.html" \
    "frankenrobots/arm/index.html"; do
    [[ -s "$engine_dir/$required_route" ]] || fail "$engine_label is missing exported route: $required_route"
  done

  for required_asset in \
    "fs_cmaes_viz_wasm.js" \
    "fs_cmaes_viz_wasm_bg.wasm" \
    "fs_cmaes_viz_wasm.d.ts" \
    "fs_cmaes_viz_wasm_bg.wasm.d.ts" \
    "package.json"; do
    [[ -s "$owner_asset_root/$required_asset" ]] || fail "$engine_label is missing owner $OWNER_KERNEL_VERSION asset: $required_asset"
  done

  [[ -s "$engine_dir/workers/g1MeshParseWorker.js" ]] || fail "$engine_label is missing the runtime G1 mesh parser"

  EXPECTED_MESHES=(${(f)"$(sed -n 's/.*: "\([^"]*\.STL\)",/\1/p' "$PROJECT_ROOT/app/components/G1WalkingFlagship.tsx" | LC_ALL=C sort -u)"})
  [[ ${#EXPECTED_MESHES[@]} -gt 0 ]] || fail "no G1 mesh requirements were found in the flagship"
  for mesh_name in $EXPECTED_MESHES; do
    [[ -s "$engine_dir/robots/g1/$mesh_name" ]] || fail "$engine_label is missing required G1 mesh: $mesh_name"
  done
  actual_mesh_count=$(find "$engine_dir/robots/g1" -maxdepth 1 -type f -name '*.STL' | wc -l | tr -d ' ')
  [[ "$actual_mesh_count" -eq ${#EXPECTED_MESHES[@]} ]] \
    || fail "$engine_label has $actual_mesh_count G1 meshes but the flagship requires ${#EXPECTED_MESHES[@]}"
  VALIDATED_MESH_COUNT="$actual_mesh_count"
}

validate_stage_receipts() {
  local engine_dir="$1"

  for receipt in \
    source-commit.txt \
    source-tree-state.txt \
    frankensim-workspace-commit.txt \
    frankensim-workspace-state.txt \
    owner-kernel-version.txt; do
    [[ -s "$engine_dir/$receipt" ]] || fail "stage has no $receipt receipt"
  done
  [[ "$(<"$engine_dir/source-commit.txt")" == "$SOURCE_COMMIT" ]] || fail "stage was built from a different cmaes_explainer revision"
  [[ "$(<"$engine_dir/source-tree-state.txt")" == "clean" ]] || fail "stage does not record a clean cmaes_explainer tree"
  [[ "$(<"$engine_dir/frankensim-workspace-commit.txt")" == "$FRANKENSIM_COMMIT" ]] || fail "stage was built from a different FrankenSim revision"
  [[ "$(<"$engine_dir/frankensim-workspace-state.txt")" == "clean" ]] || fail "stage does not record a clean FrankenSim tree"
  [[ "$(<"$engine_dir/owner-kernel-version.txt")" == "$OWNER_KERNEL_VERSION" ]] || fail "stage owner-kernel receipt does not match the current source"
}

validate_staged_engine() {
  local engine_dir="$1"
  local expected_manifest_digest="${2:-}"

  [[ -d "$engine_dir" ]] || fail "engine stage does not exist: $engine_dir"
  validate_stage_receipts "$engine_dir"
  verify_content_manifest "$engine_dir" "staged engine" "$expected_manifest_digest"
  validate_payload "$engine_dir" "staged engine"
}

build_stage() {
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

  validate_payload "$STAGED_ENGINE" "stage at $STAGE_PARENT"
  (
    cd "$STAGED_ENGINE"
    find . -type f ! -name engine-content-sha256.txt -print0 \
      | LC_ALL=C sort -z \
      | xargs -0 shasum -a 256 > engine-content-sha256.txt
  )
  STAGE_MANIFEST_SHA256=$(shasum -a 256 "$STAGED_ENGINE/engine-content-sha256.txt" | awk '{print $1}')
  validate_staged_engine "$STAGED_ENGINE" "$STAGE_MANIFEST_SHA256"
  verify_source_fences
}

activate_staged_engine() {
  local current_engine="$SCRIPT_DIR/Engine"
  local rollback_engine="$STAGE_PARENT/previous-Engine"

  [[ -d "$STAGED_ENGINE" ]] || fail "engine stage does not exist: $STAGED_ENGINE"
  [[ "$STAGED_ENGINE" != "$current_engine" ]] || fail "ios/Engine cannot be used as its own activation stage"
  [[ "$(stat -f %d "$STAGED_ENGINE")" == "$(stat -f %d "$SCRIPT_DIR")" ]] \
    || fail "stage is on a different filesystem and cannot be activated atomically: $STAGED_ENGINE"
  [[ ! -e "$rollback_engine" ]] || fail "rollback path already exists: $rollback_engine"
  verify_source_fences
  validate_staged_engine "$STAGED_ENGINE" "$EXPECTED_MANIFEST_SHA256"
  verify_source_fences

  if [[ -d "$current_engine" ]]; then
    if [[ -s "$current_engine/engine-content-sha256.txt" ]]; then
      verify_content_manifest "$current_engine" "existing ios/Engine"
    elif [[ "$ALLOW_UNVERIFIED_EXISTING" -ne 1 ]]; then
      fail "existing legacy ios/Engine has no manifest; inspect it, then add --allow-unverified-existing for the first migration"
    fi
    print -r -- "Preserving current engine for rollback at: $rollback_engine"
    mv "$current_engine" "$rollback_engine"
  fi

  if ! mv "$STAGED_ENGINE" "$current_engine"; then
    if [[ -d "$rollback_engine" && ! -e "$current_engine" ]]; then
      mv "$rollback_engine" "$current_engine"
    fi
    fail "activation failed; the previous engine was restored when possible"
  fi

  print -r -- "Activated FrankenRobots engine at $current_engine"
  print -r -- "Source: ${SOURCE_COMMIT[1,12]} · FrankenSim: ${FRANKENSIM_COMMIT[1,12]} · owner: $OWNER_KERNEL_VERSION · G1 meshes: $VALIDATED_MESH_COUNT"
  if [[ -d "$rollback_engine" ]]; then
    print -r -- "Previous engine preserved for rollback: $rollback_engine"
  fi
}

main() {
  while (( $# > 0 )); do
    case "$1" in
      --stage-only|--activate)
        [[ "$MODE_EXPLICIT" -eq 0 ]] || fail "choose exactly one of --stage-only, --activate, or --activate-stage"
        [[ "$1" == "--activate" ]] && MODE="activate" || MODE="stage"
        MODE_EXPLICIT=1
        shift
        ;;
      --activate-stage)
        [[ "$MODE_EXPLICIT" -eq 0 ]] || fail "choose exactly one of --stage-only, --activate, or --activate-stage"
        (( $# >= 2 )) || fail "--activate-stage requires an absolute stage path"
        MODE="activate-stage"
        MODE_EXPLICIT=1
        ACTIVATION_STAGE="$2"
        shift 2
        ;;
      --allow-unverified-existing)
        ALLOW_UNVERIFIED_EXISTING=1
        shift
        ;;
      --expect-manifest-sha256)
        (( $# >= 2 )) || fail "--expect-manifest-sha256 requires a digest"
        [[ -z "$EXPECTED_MANIFEST_SHA256" ]] || fail "--expect-manifest-sha256 may be supplied only once"
        EXPECTED_MANIFEST_SHA256="$2"
        shift 2
        ;;
      --help|-h)
        usage
        exit 0
        ;;
      *)
        usage >&2
        fail "unknown argument: $1"
        ;;
    esac
  done

  if [[ "$MODE" == "activate-stage" ]]; then
    [[ "$ACTIVATION_STAGE" == /* ]] || fail "--activate-stage requires an absolute path"
    [[ "$EXPECTED_MANIFEST_SHA256" =~ ^[0-9a-f]{64}$ ]] \
      || fail "--activate-stage requires --expect-manifest-sha256 with a lowercase 64-character digest"
  elif [[ -n "$EXPECTED_MANIFEST_SHA256" ]]; then
    fail "--expect-manifest-sha256 is valid only with --activate-stage"
  fi

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
  OWNER_RUNTIME_DIR=$(resolve_owner_runtime_dir "$OWNER_KERNEL_VERSION")

  if [[ "$MODE" == "activate-stage" ]]; then
    STAGED_ENGINE="${ACTIVATION_STAGE:A}"
    STAGE_PARENT="${STAGED_ENGINE:h}"
    activate_staged_engine
    return
  fi

  build_stage
  if [[ "$MODE" == "stage" ]]; then
    print -r -- "Validated FrankenRobots engine stage: $STAGED_ENGINE"
    print -r -- "Source: ${SOURCE_COMMIT[1,12]} · FrankenSim: ${FRANKENSIM_COMMIT[1,12]} · owner: $OWNER_KERNEL_VERSION · G1 meshes: $VALIDATED_MESH_COUNT"
    print -r -- "Reviewed manifest SHA-256: $STAGE_MANIFEST_SHA256"
    print -r -- "ios/Engine was not changed. Review this stage, then activate these exact bytes with:"
    print -r -- "./ios/prepare-engine.sh --activate-stage '$STAGED_ENGINE' --expect-manifest-sha256 '$STAGE_MANIFEST_SHA256'"
    return
  fi

  EXPECTED_MANIFEST_SHA256="$STAGE_MANIFEST_SHA256"
  activate_staged_engine
}

if [[ "${ZSH_EVAL_CONTEXT:-}" != *:file ]]; then
  main "$@"
fi
