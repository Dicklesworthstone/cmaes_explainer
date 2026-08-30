#!/bin/zsh
set -euo pipefail

SCRIPT_DIR=${0:A:h}
PROJECT_ROOT=${SCRIPT_DIR:h}

cd "$PROJECT_ROOT"
bunx next build ios/EngineWeb

mkdir -p "$SCRIPT_DIR/Engine"
cp -R "$SCRIPT_DIR/EngineWeb/out/." "$SCRIPT_DIR/Engine/"
cp -R "$PROJECT_ROOT/public/." "$SCRIPT_DIR/Engine/"
git rev-parse HEAD > "$SCRIPT_DIR/Engine/source-commit.txt"

echo "FrankenRobots engine exported from $(git rev-parse --short HEAD)."
