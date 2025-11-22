#!/usr/bin/env bash
set -euo pipefail

VENDOR_DIR="vendor/wasm_cmaes"

mkdir -p vendor

if [ ! -d "$VENDOR_DIR" ]; then
  git clone https://github.com/Dicklesworthstone/wasm_cmaes "$VENDOR_DIR"
else
  git -C "$VENDOR_DIR" pull --ff-only
fi

( cd "$VENDOR_DIR" && ./scripts/build-all.sh )

rm -rf public/wasm-demo
mkdir -p public/wasm-demo

cp -r "$VENDOR_DIR/examples" "public/wasm-demo/examples"
cp -r "$VENDOR_DIR/pkg" "public/wasm-demo/pkg"
cp -r "$VENDOR_DIR/pkg-par" "public/wasm-demo/pkg-par"

echo "WASM CMA-ES demo copied into public/wasm-demo."
