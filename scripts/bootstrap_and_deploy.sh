#!/usr/bin/env bash
set -euo pipefail

PROJECT_SLUG="cmaes_explainer"
GITHUB_REPO="Dicklesworthstone/${PROJECT_SLUG}"
VERCEL_PROJECT_NAME="cmaes-explainer"

if [ ! -d "node_modules" ]; then
  npm install
fi

npm run build

if [ ! -d ".git" ]; then
  git init
fi

git add .
git commit -m "Initial CMA-ES explainer site" || true

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "$GITHUB_REPO" --public --source=. --remote=origin --push
else
  git push -u origin main || git push -u origin master || true
fi

if ! vercel projects ls | grep -q "$VERCEL_PROJECT_NAME"; then
  vercel link --yes --project "$VERCEL_PROJECT_NAME"
fi

vercel --prod --yes
