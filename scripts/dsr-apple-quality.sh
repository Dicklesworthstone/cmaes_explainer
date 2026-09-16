#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root/ios"

build_root="${FRANKEN_APPLE_BUILD_ROOT:-${DSR_QUALITY_RUN_DIR:-$repo_root/ios/build/dsr-apple-quality}}"
mkdir -p "$build_root"
sbh check --need 20G "$build_root"
result_root="${FRANKEN_APPLE_RESULT_ROOT:-$build_root}"
mkdir -p "$result_root"

# CoreSimulator cannot install an app bundle directly from every network
# filesystem accepted for large DerivedData trees. Keep compilation artifacts
# on the spacious build volume while allowing signed/installable products to
# land on local APFS when the caller provides an explicit product root.
xcode_product_settings=()
if [[ -n "${FRANKEN_APPLE_PRODUCT_ROOT:-}" ]]; then
  mkdir -p "$FRANKEN_APPLE_PRODUCT_ROOT"
  xcode_product_settings+=("SYMROOT=$FRANKEN_APPLE_PRODUCT_ROOT")
fi
command -v xcodegen >/dev/null
command -v jq >/dev/null

audio_safety=/Users/jemanuel/.local/bin/ensure-simulator-audio-safe
prepare_simulator_audio() {
  local attempt
  # bootstatus can return before SpringBoard's late audio processes have joined
  # the aggregate tap. Keep the fence strict, but allow that bounded startup
  # convergence instead of turning a correct cold boot into a false failure.
  for attempt in 1 2 3 4 5 6 7 8 9 10; do
    if "$audio_safety" prepare; then
      return 0
    fi
    if [[ "$attempt" -lt 10 ]]; then
      sleep 2
    fi
  done
  return 1
}

xcodegen generate --spec project.yml
git diff --exit-code -- FrankenRobots.xcodeproj Sources/Info.plist
display_name="$(plutil -extract CFBundleDisplayName raw Sources/Info.plist)"
if [[ "$display_name" != "FrankenRobots" ]]; then
  echo "FrankenRobots identity drift: expected CFBundleDisplayName=FrankenRobots, got '$display_name'" >&2
  exit 1
fi
bundle_version="$(plutil -extract CFBundleVersion raw Sources/Info.plist)"
if [[ "$bundle_version" != '$(CURRENT_PROJECT_VERSION)' ]]; then
  echo "FrankenRobots build-number drift: CFBundleVersion must derive from CURRENT_PROJECT_VERSION, got '$bundle_version'" >&2
  exit 1
fi
git ls-files -z -- '*.swift' | xargs -0 xcrun swiftc -parse
plutil -lint Sources/Info.plist
plutil -lint Sources/PrivacyInfo.xcprivacy
plutil -lint FrankenRobots.entitlements

prepare_simulator_audio
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath "$build_root/derived-data" \
  "${xcode_product_settings[@]}" \
  CODE_SIGNING_ALLOWED=NO build
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination 'platform=macOS,variant=Mac Catalyst' \
  -derivedDataPath "$build_root/derived-data" \
  "${xcode_product_settings[@]}" \
  CODE_SIGNING_ALLOWED=NO test -only-testing:FrankenRobotsTests

# Discover concrete devices only after proving the Simulator audio fence. Give
# dedicated FrankenRobots devices priority while retaining a portable fallback.
prepare_simulator_audio
simulator_json="$(xcrun simctl list devices available --json)"
iphone_id="${FROBOTS_IPHONE_SIMULATOR_ID:-$(
  jq -r '
    [.devices[][] | select(.name | contains("iPhone"))] as $devices
    | (($devices | map(select(.name | test("^FrankenRobots DSR iPhone"; "i"))))
        + ($devices | map(select(.name | test("^FrankenRobots iPhone"; "i"))))
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
    | (($devices | map(select(.name | test("^FrankenRobots DSR iPad"; "i"))))
        + ($devices | map(select(.name | test("^FrankenRobots iPad"; "i"))))
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

# Xcode can finish a build before a shutdown Simulator is ready, then wait for
# an XCTest runner that never materializes. Boot the dedicated destination and
# wait for SpringBoard/data migration before asking Xcode to build or launch.
prepare_simulator_audio
xcrun simctl bootstatus "$iphone_id" -b

prepare_simulator_audio
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination "platform=iOS Simulator,id=$iphone_id" \
  -derivedDataPath "$build_root/derived-data" \
  "${xcode_product_settings[@]}" \
  -parallel-testing-enabled NO \
  CODE_SIGNING_ALLOWED=NO build-for-testing

prepare_simulator_audio
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination "platform=iOS Simulator,id=$iphone_id" \
  -derivedDataPath "$build_root/derived-data" \
  "${xcode_product_settings[@]}" \
  -resultBundlePath "$result_root/frankenrobots-iphone-recovery.xcresult" \
  -parallel-testing-enabled NO \
  CODE_SIGNING_ALLOWED=NO test-without-building \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testWebContentTerminationFailsClosedThenRetryRecovers

# A WebContent lifecycle failure is destructive by definition. Run the rest of
# the long-lived UI journeys in a fresh test invocation so accumulated WebKit
# pressure cannot consume the shipping readiness deadline before fault injection.
prepare_simulator_audio
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination "platform=iOS Simulator,id=$iphone_id" \
  -derivedDataPath "$build_root/derived-data" \
  "${xcode_product_settings[@]}" \
  -resultBundlePath "$result_root/frankenrobots-iphone-ui.xcresult" \
  -parallel-testing-enabled NO \
  CODE_SIGNING_ALLOWED=NO test-without-building \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testReadinessWatchdogFailsClosedThenRetryRecovers \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testAppearanceTogglePersistsLightModeAcrossLaunches \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testFullLabWorkspaceExposesCompleteHumanoidAndArmControls \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testFullLabRestoresOriginalResidualReceiptAndTrainer \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testSwitchesBetweenFocusedLabs \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testNativeContinuousLearningStartsAndStopsThroughEmbeddedOwner \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testNativeExperimentSelectorsMutateBothEmbeddedOwners \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testNativePlaybackTimelineSpeedAndCamerasDriveBothEmbeddedLabs \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testArmTracePlaybackControlsReachEmbeddedOwnerTrace \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testArmModeSwitchExposesWorkingKMRRoute \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testG1ReceiptLensesReweightAnalysisWithoutChangingOwnerKernel \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testG1ManualPushIsDisclosedAsPreviewWithoutChangingOwnerReceipt

prepare_simulator_audio
xcrun simctl bootstatus "$ipad_id" -b

prepare_simulator_audio
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination "platform=iOS Simulator,id=$ipad_id" \
  -derivedDataPath "$build_root/derived-data" \
  "${xcode_product_settings[@]}" \
  -parallel-testing-enabled NO \
  CODE_SIGNING_ALLOWED=NO build-for-testing

prepare_simulator_audio
xcodebuild -project FrankenRobots.xcodeproj -scheme FrankenRobots \
  -destination "platform=iOS Simulator,id=$ipad_id" \
  -derivedDataPath "$build_root/derived-data" \
  "${xcode_product_settings[@]}" \
  -resultBundlePath "$result_root/frankenrobots-ipad-ui.xcresult" \
  -parallel-testing-enabled NO \
  CODE_SIGNING_ALLOWED=NO test-without-building \
  -only-testing:FrankenRobotsUITests/FrankenRobotsUITests/testIPadArmSafetyReceiptsAndJSONExporterInBothOrientations
