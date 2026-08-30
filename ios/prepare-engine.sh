#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:A:h}
PROJECT_ROOT=${SCRIPT_DIR:h}
FRANKENSIM_ROOT=${FRANKENSIM_ROOT:-${PROJECT_ROOT:h}/frankensim}

cd "$PROJECT_ROOT"

if [[ -n "$(git status --porcelain --untracked-files=normal)" ]]; then
  echo "Refusing to export an engine from a dirty source tree." >&2
  echo "Commit or remove the source changes so source-commit.txt identifies the bundled bytes." >&2
  exit 1
fi

bunx next build ios/EngineWeb

mkdir -p "$SCRIPT_DIR/Engine"
cp -R "$SCRIPT_DIR/EngineWeb/out/." "$SCRIPT_DIR/Engine/"
cp -R "$PROJECT_ROOT/public/." "$SCRIPT_DIR/Engine/"
git rev-parse HEAD > "$SCRIPT_DIR/Engine/source-commit.txt"

OWNER_KERNEL_VERSION=$(sed -n 's/^export const FRANKENSIM_OWNER_KERNEL_VERSION = "\([^"]*\)";/\1/p' \
  "$PROJECT_ROOT/app/lib/frankensimCmaes.ts")
if [[ -z "$OWNER_KERNEL_VERSION" ]]; then
  echo "Could not resolve FRANKENSIM_OWNER_KERNEL_VERSION." >&2
  exit 1
fi
printf '%s\n' "$OWNER_KERNEL_VERSION" > "$SCRIPT_DIR/Engine/owner-kernel-version.txt"

if git -C "$FRANKENSIM_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git -C "$FRANKENSIM_ROOT" rev-parse HEAD > "$SCRIPT_DIR/Engine/frankensim-workspace-commit.txt"
else
  printf '%s\n' "unavailable" > "$SCRIPT_DIR/Engine/frankensim-workspace-commit.txt"
fi

echo "FrankenRobots engine exported from $(git rev-parse --short HEAD) with $OWNER_KERNEL_VERSION."
