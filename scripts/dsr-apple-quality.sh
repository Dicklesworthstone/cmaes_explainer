#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root/ios"

sbh check --need 20G
command -v xcodegen >/dev/null
xcodegen generate --spec project.yml
git diff --exit-code -- FrankenRobots.xcodeproj Sources/Info.plist
/Users/jemanuel/.local/bin/ensure-simulator-audio-safe prepare
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO build
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination 'platform=macOS,variant=Mac Catalyst' \
  CODE_SIGNING_ALLOWED=NO test -only-testing:FrankenRobotsTests
