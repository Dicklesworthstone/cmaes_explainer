#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root/ios"

build_root="${FRANKEN_APPLE_BUILD_ROOT:-${DSR_QUALITY_RUN_DIR:-$repo_root/ios/build/dsr-apple-quality}}"
mkdir -p "$build_root"
sbh check --need 20G "$build_root"
command -v xcodegen >/dev/null
command -v jq >/dev/null
xcodegen generate --spec project.yml
git diff --exit-code -- FrankenRobots.xcodeproj Sources/Info.plist
git ls-files -z -- '*.swift' | xargs -0 xcrun swiftc -parse
plutil -lint Sources/Info.plist
plutil -lint Sources/PrivacyInfo.xcprivacy
plutil -lint FrankenRobots.entitlements

/Users/jemanuel/.local/bin/ensure-simulator-audio-safe prepare
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath "$build_root/derived-data" \
  CODE_SIGNING_ALLOWED=NO build
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination 'platform=macOS,variant=Mac Catalyst' \
  -derivedDataPath "$build_root/derived-data" \
  CODE_SIGNING_ALLOWED=NO test -only-testing:FrankenRobotsTests

# Discover concrete devices only after proving the Simulator audio fence. Give
# dedicated FrankenRobots devices priority while retaining a portable fallback.
/Users/jemanuel/.local/bin/ensure-simulator-audio-safe prepare
simulator_json="$(xcrun simctl list devices available --json)"
iphone_id="${FROBOTS_IPHONE_SIMULATOR_ID:-$(
  jq -r '
    [.devices[][] | select(.name | contains("iPhone"))] as $devices
    | (($devices | map(select(.name | test("^FrankenRobots iPhone"; "i"))))
        + ($devices | map(select((.name | test("FrankenRobots"; "i")) and .state == "Booted")))
        + ($devices | map(select(.name | test("FrankenRobots"; "i"))))
        + ($devices | map(select(.state == "Booted")))
        + $devices)
    | .[0].udid // empty
  ' <<< "$simulator_json"
)}"
ipad_id="${FROBOTS_IPAD_SIMULATOR_ID:-$(
  jq -r '
    [.devices[][] | select(.name | contains("iPad"))] as $devices
    | (($devices | map(select(.name | test("^FrankenRobots iPad"; "i"))))
        + ($devices | map(select((.name | test("FrankenRobots"; "i")) and .state == "Booted")))
        + ($devices | map(select(.name | test("FrankenRobots"; "i"))))
        + ($devices | map(select(.state == "Booted")))
        + $devices)
    | .[0].udid // empty
  ' <<< "$simulator_json"
)}"
if [[ -z "$iphone_id" || -z "$ipad_id" ]]; then
  echo "FrankenRobots DSR requires one available iPhone and one available iPad Simulator" >&2
  exit 1
fi

/Users/jemanuel/.local/bin/ensure-simulator-audio-safe prepare
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination "platform=iOS Simulator,id=$iphone_id" \
  -derivedDataPath "$build_root/derived-data" \
  -resultBundlePath "$build_root/frankenrobots-iphone-ui.xcresult" \
  -parallel-testing-enabled NO \
  CODE_SIGNING_ALLOWED=NO test \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testReadinessWatchdogFailsClosedThenRetryRecovers \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testWebContentTerminationFailsClosedThenRetryRecovers \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testAppearanceTogglePersistsLightModeAcrossLaunches \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testSwitchesBetweenFocusedLabs \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testNativeContinuousLearningStartsAndStopsThroughEmbeddedOwner \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testArmTracePlaybackControlsReachEmbeddedOwnerTrace \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testArmModeSwitchExposesWorkingKMRRoute \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testG1ReceiptLensesReweightAnalysisWithoutChangingOwnerKernel \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testG1ManualPushIsDisclosedAsPreviewWithoutChangingOwnerReceipt

/Users/jemanuel/.local/bin/ensure-simulator-audio-safe prepare
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination "platform=iOS Simulator,id=$ipad_id" \
  -derivedDataPath "$build_root/derived-data" \
  -resultBundlePath "$build_root/frankenrobots-ipad-ui.xcresult" \
  -parallel-testing-enabled NO \
  CODE_SIGNING_ALLOWED=NO test \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testIPadArmSafetyReceiptsAndJSONExporterInBothOrientations
