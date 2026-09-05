import XCTest

final class FrankenRobotsUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    func testReadinessWatchdogFailsClosedThenRetryRecovers() throws {
        let app = XCUIApplication()
        app.launchEnvironment["FROBOTS_FORCE_READINESS_TIMEOUT_ONCE"] = "1"
        app.launch()

        let timedOut = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'did not become ready within 45 seconds'")
        ).firstMatch
        XCTAssertTrue(timedOut.waitForExistence(timeout: 12), app.debugDescription)

        let retry = app.buttons["Try Again"]
        XCTAssertTrue(retry.isHittable, app.debugDescription)
        let commandDetail = app.descendants(matching: .any)["robot-native-command-detail"]
        XCTAssertTrue(commandDetail.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(commandDetail.label.contains("unavailable until Try Again succeeds"))
        XCTAssertFalse(app.descendants(matching: .any)["robot-live-objective"].exists)
        XCTAssertTrue(app.buttons["robot-native-optimize"].label.contains("Unavailable"))
        let failedScreenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        failedScreenshot.name = "Readiness watchdog failed closed with Try Again"
        failedScreenshot.lifetime = .keepAlways
        add(failedScreenshot)
        retry.tap()

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 5), app.debugDescription)
        let recovered = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [recovered], timeout: 55), .completed)

        let screenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        screenshot.name = "Readiness watchdog recovered through Try Again"
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }

    func testWebContentTerminationFailsClosedThenRetryRecovers() throws {
        let app = XCUIApplication()
        app.launchEnvironment["FROBOTS_FORCE_WEBCONTENT_TERMINATION_ONCE"] = "1"
        app.launch()

        let terminated = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'local Web content process'")
        ).firstMatch
        XCTAssertTrue(terminated.waitForExistence(timeout: 55), app.debugDescription)

        let retry = app.buttons["Try Again"]
        XCTAssertTrue(retry.isHittable, app.debugDescription)
        let commandDetail = app.descendants(matching: .any)["robot-native-command-detail"]
        XCTAssertTrue(commandDetail.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(commandDetail.label.contains("unavailable until Try Again succeeds"))
        XCTAssertFalse(app.descendants(matching: .any)["robot-live-objective"].exists)
        XCTAssertTrue(app.buttons["robot-native-optimize"].label.contains("Unavailable"))

        let failedScreenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        failedScreenshot.name = "WebContent callback failed closed with Try Again"
        failedScreenshot.lifetime = .keepAlways
        add(failedScreenshot)

        retry.tap()

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 5), app.debugDescription)
        let recovered = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [recovered], timeout: 55), .completed)
        XCTAssertTrue(
            app.descendants(matching: .any)["robot-live-objective"]
                .waitForExistence(timeout: 12),
            app.debugDescription
        )

        let recoveredScreenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        recoveredScreenshot.name = "WebContent callback recovered through Try Again"
        recoveredScreenshot.lifetime = .keepAlways
        add(recoveredScreenshot)
    }

    private func settledLandscapeScreenshot(on device: XCUIDevice) -> XCUIScreenshot {
        // A pre-existing XCUI element is not evidence that rotation settled,
        // and Simulator occasionally drops an orientation request. Retry both
        // landscape directions, then let the caller assert on rendered pixels.
        var screenshot = XCUIScreen.main.screenshot()
        for orientation in [UIDeviceOrientation.landscapeLeft, .landscapeRight, .landscapeLeft]
        where screenshot.image.size.width <= screenshot.image.size.height {
            device.orientation = orientation
            for _ in 0..<16 where screenshot.image.size.width <= screenshot.image.size.height {
                Thread.sleep(forTimeInterval: 0.25)
                screenshot = XCUIScreen.main.screenshot()
            }
        }
        return screenshot
    }

    func testAppearanceTogglePersistsLightModeAcrossLaunches() throws {
        let app = XCUIApplication()
        app.launch()

        let toggle = app.buttons["appearance-toggle"]
        XCTAssertTrue(toggle.waitForExistence(timeout: 12))

        if toggle.label == "Switch to dark mode" {
            toggle.tap()
            XCTAssertEqual(toggle.label, "Switch to light mode")
        }

        toggle.tap()
        XCTAssertEqual(toggle.label, "Switch to dark mode")

        app.terminate()
        app.launch()

        let relaunchedToggle = app.buttons["appearance-toggle"]
        XCTAssertTrue(relaunchedToggle.waitForExistence(timeout: 12))
        XCTAssertEqual(relaunchedToggle.label, "Switch to dark mode")
    }

    func testFullLabWorkspaceExposesCompleteHumanoidAndArmControls() throws {
        let app = XCUIApplication()
        app.launch()

        let openFullLab = app.buttons["robot-open-full-lab"]
        XCTAssertTrue(openFullLab.waitForExistence(timeout: 12), app.debugDescription)
        XCTAssertTrue(openFullLab.isHittable, app.debugDescription)
        openFullLab.tap()

        let capabilityMap = app.descendants(matching: .any)["robot-full-lab-capability-map"]
        XCTAssertTrue(capabilityMap.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(capabilityMap.label.contains("CAMERAS"))
        XCTAssertTrue(capabilityMap.label.contains("TIMELINE"))
        XCTAssertTrue(capabilityMap.label.contains("POLICIES"))

        let workspace = app.webViews.firstMatch
        XCTAssertTrue(workspace.waitForExistence(timeout: 12), app.debugDescription)

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 5), app.debugDescription)
        let humanoidReady = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [humanoidReady], timeout: 55), .completed)

        let pushPreview = app.buttons["Configure display-only push-vector preview"]
        let followCamera = app.buttons["Follow"]
        XCTAssertTrue(pushPreview.waitForExistence(timeout: 12), app.debugDescription)
        XCTAssertTrue(pushPreview.isHittable, app.debugDescription)
        XCTAssertTrue(followCamera.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(followCamera.isHittable, app.debugDescription)

        let humanoidScene = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        humanoidScene.name = "Complete Humanoid lab scene and camera controls"
        humanoidScene.lifetime = .keepAlways
        add(humanoidScene)

        let humanoidStart = app.buttons.matching(
            NSPredicate(
                format: "label == 'Start learning' OR label BEGINSWITH[c] 'Keep learning'"
            )
        ).firstMatch
        for _ in 0..<8 where !humanoidStart.isHittable {
            workspace.swipeUp()
        }
        XCTAssertTrue(humanoidStart.isHittable, app.debugDescription)
        let policySeed = app.buttons["Policy seed"]
        XCTAssertTrue(policySeed.isHittable, app.debugDescription)

        let humanoidLearning = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        humanoidLearning.name = "Complete Humanoid lab optimizer and policy controls"
        humanoidLearning.lifetime = .keepAlways
        add(humanoidLearning)

        let arm = app.segmentedControls.buttons["iiwa14"]
        XCTAssertTrue(arm.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(arm.isHittable, app.debugDescription)
        arm.tap()

        let armReady = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [armReady], timeout: 55), .completed)

        let frictionCones = app.buttons["FRICTION CONES"]
        let graspCamera = app.buttons["Grasp Focus camera"]
        XCTAssertTrue(frictionCones.waitForExistence(timeout: 15), app.debugDescription)
        XCTAssertTrue(frictionCones.isHittable, app.debugDescription)
        XCTAssertTrue(graspCamera.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(graspCamera.isHittable, app.debugDescription)

        let armScene = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        armScene.name = "Complete Arm lab physics and camera controls"
        armScene.lifetime = .keepAlways
        add(armScene)

        let graspMicroscope = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'Tactile Grasp Microscope'")
        ).firstMatch
        let jointKinematics = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] '7-DoF iiwa Joint Kinematics'")
        ).firstMatch
        let showArmControls = app.buttons["Show diagnostics and all arm controls"]
        XCTAssertTrue(showArmControls.isHittable, app.debugDescription)
        showArmControls.tap()
        XCTAssertTrue(graspMicroscope.isHittable, app.debugDescription)
        XCTAssertTrue(jointKinematics.isHittable, app.debugDescription)

        let armDiagnostics = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        armDiagnostics.name = "Complete Arm lab grasp and joint diagnostics"
        armDiagnostics.lifetime = .keepAlways
        add(armDiagnostics)

        let closeFullLab = app.buttons["robot-close-full-lab"]
        XCTAssertTrue(closeFullLab.isHittable, app.debugDescription)
        closeFullLab.tap()
        XCTAssertTrue(openFullLab.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(
            app.descendants(matching: .any)["robot-stage"].waitForExistence(timeout: 5),
            app.debugDescription
        )
    }

    func testSwitchesBetweenFocusedLabs() throws {
        let app = XCUIApplication()
        app.launch()

        let stage = app.descendants(matching: .any)
            .matching(identifier: "robot-stage")
            .firstMatch
        XCTAssertTrue(stage.waitForExistence(timeout: 12))

        let arm = app.segmentedControls.buttons["Robot Arm"]
        let humanoid = app.segmentedControls.buttons["Humanoid"]
        XCTAssertTrue(arm.exists)
        XCTAssertTrue(humanoid.exists)

        // Exercise the real supersession path: WKWebView reports cancellation
        // for each route after the next route has already begun loading.
        arm.tap()
        humanoid.tap()
        arm.tap()
        XCTAssertTrue(arm.isSelected)
        XCTAssertTrue(stage.waitForExistence(timeout: 12))

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 5))
        let settled = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 55), .completed)

        let liveMetrics = app.descendants(matching: .any)["robot-live-run-compact"]
        XCTAssertTrue(liveMetrics.waitForExistence(timeout: 8), app.debugDescription)
        XCTAssertTrue(app.descendants(matching: .any)["robot-live-objective"].exists)

        let screenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        screenshot.name = "Robot Arm lab after native route switch"
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }

    func testNativeContinuousLearningStartsAndStopsThroughEmbeddedOwner() throws {
        let app = XCUIApplication()
        app.launch()

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 12))
        let settled = XCTNSPredicateExpectation(
            predicate: NSPredicate(format: "label CONTAINS[c] 'ready'"),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 55), .completed)

        let optimize = app.buttons["robot-native-optimize"]
        XCTAssertTrue(optimize.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(optimize.isEnabled)
        XCTAssertTrue(optimize.isHittable)
        optimize.tap()

        let receipt = app.descendants(matching: .any)["robot-native-command-detail"]
        XCTAssertTrue(receipt.waitForExistence(timeout: 5), app.debugDescription)
        let accepted = XCTNSPredicateExpectation(
            predicate: NSPredicate(format: "label CONTAINS[c] 'accepted'"),
            object: receipt
        )
        XCTAssertEqual(XCTWaiter.wait(for: [accepted], timeout: 8), .completed)

        let running = XCTNSPredicateExpectation(
            predicate: NSPredicate(format: "label CONTAINS[c] 'optimizing'"),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [running], timeout: 12), .completed)
        let stop = app.buttons["robot-native-optimize"]
        let stopLabel = XCTNSPredicateExpectation(
            predicate: NSPredicate(format: "label BEGINSWITH[c] 'stop'"),
            object: stop
        )
        XCTAssertEqual(XCTWaiter.wait(for: [stopLabel], timeout: 8), .completed)
        XCTAssertTrue(stop.isHittable)
        stop.tap()

        let stopAccepted = XCTNSPredicateExpectation(
            predicate: NSPredicate(format: "label CONTAINS[c] 'accepted stop'"),
            object: receipt
        )
        XCTAssertEqual(XCTWaiter.wait(for: [stopAccepted], timeout: 8), .completed)

        let readyAgain = XCTNSPredicateExpectation(
            predicate: NSPredicate(format: "label CONTAINS[c] 'ready'"),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [readyAgain], timeout: 25), .completed)

        let screenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        screenshot.name = "Continuous owner learning stopped with best policy preserved"
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }

    func testIPadArmSafetyReceiptsAndJSONExporterInBothOrientations() throws {
        let device = XCUIDevice.shared
        device.orientation = .portrait
        addTeardownBlock { device.orientation = .portrait }

        let app = XCUIApplication()
        app.launchEnvironment["FROBOTS_INITIAL_LAB"] = "arm"
        app.launch()

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 12))
        let settled = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 55), .completed)

        let inspector = app.scrollViews["robot-inspector-scroll"]
        XCTAssertTrue(inspector.waitForExistence(timeout: 8), app.debugDescription)
        let clearance = app.descendants(matching: .any)["robot-live-certified-clearance"]
        let risk = app.descendants(matching: .any)["robot-live-collision-risk"]
        let possibleContact = app.descendants(matching: .any)["robot-live-possible-collision"]
        for _ in 0..<5 where !(clearance.exists && risk.exists && possibleContact.exists) {
            inspector.swipeUp()
        }
        XCTAssertTrue(clearance.exists, app.debugDescription)
        XCTAssertTrue(risk.exists, app.debugDescription)
        XCTAssertTrue(possibleContact.exists, app.debugDescription)

        let portrait = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        portrait.name = "Arm safety receipts on iPad portrait"
        portrait.lifetime = .keepAlways
        add(portrait)

        let stage = app.descendants(matching: .any)["robot-stage"]
        XCTAssertTrue(stage.waitForExistence(timeout: 8))
        // Assert against the rendered framebuffer because XCUIApplication.frame
        // can remain in portrait coordinates after a real interface rotation.
        let landscapeFrame = settledLandscapeScreenshot(on: device)
        XCTAssertGreaterThan(landscapeFrame.image.size.width, landscapeFrame.image.size.height)

        let landscape = XCTAttachment(screenshot: landscapeFrame)
        landscape.name = "Arm safety receipts on iPad landscape"
        landscape.lifetime = .keepAlways
        add(landscape)

        let exportButton = app.buttons["robot-export-receipt"]
        XCTAssertTrue(exportButton.waitForExistence(timeout: 5), app.debugDescription)
        for _ in 0..<4 where !exportButton.isHittable {
            inspector.swipeDown()
        }
        XCTAssertTrue(exportButton.isEnabled)
        XCTAssertTrue(exportButton.isHittable, app.debugDescription)
        exportButton.tap()

        let cancel = app.buttons["Cancel"]
        XCTAssertTrue(cancel.waitForExistence(timeout: 8), app.debugDescription)
        let exporter = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        exporter.name = "Versioned owner receipt JSON exporter"
        exporter.lifetime = .keepAlways
        add(exporter)
        cancel.tap()
    }

    func testArmTracePlaybackControlsReachEmbeddedOwnerTrace() throws {
        let app = XCUIApplication()
        app.launch()

        let stage = app.descendants(matching: .any)
            .matching(identifier: "robot-stage")
            .firstMatch
        XCTAssertTrue(stage.waitForExistence(timeout: 12))

        let arm = app.segmentedControls.buttons["Robot Arm"]
        XCTAssertTrue(arm.waitForExistence(timeout: 5))
        arm.tap()

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 5))
        let settled = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 55), .completed)

        let playbackButton = app.buttons.matching(
            NSPredicate(format: "label == 'Play arm trace' OR label == 'Pause arm trace'")
        ).firstMatch
        let restartButton = app.buttons["Restart arm trace"]
        let positionSlider = app.sliders["Arm trace position"]
        let speedControl = app.descendants(matching: .any)["Arm trace playback speed"]

        XCTAssertTrue(playbackButton.waitForExistence(timeout: 25), app.debugDescription)
        XCTAssertTrue(restartButton.exists)
        XCTAssertTrue(positionSlider.exists)
        XCTAssertTrue(speedControl.exists)

        if playbackButton.label == "Pause arm trace" {
            playbackButton.tap()
        } else {
            playbackButton.tap()
            XCTAssertTrue(app.buttons["Pause arm trace"].waitForExistence(timeout: 5))
            app.buttons["Pause arm trace"].tap()
        }
        XCTAssertTrue(app.buttons["Play arm trace"].waitForExistence(timeout: 5))

        restartButton.tap()
        let startPosition = String(describing: positionSlider.value)
        XCTAssertTrue(positionSlider.isHittable)
        let seekEnd = positionSlider.coordinate(
            withNormalizedOffset: CGVector(dx: 0.75, dy: 0.5)
        )
        seekEnd.tap()
        let soughtPosition = String(describing: positionSlider.value)
        XCTAssertNotEqual(soughtPosition, startPosition)

        restartButton.tap()
        XCTAssertEqual(String(describing: positionSlider.value), startPosition)
    }

    func testArmModeSwitchExposesWorkingKMRRoute() throws {
        let app = XCUIApplication()
        app.launch()

        let arm = app.segmentedControls.buttons["Robot Arm"]
        XCTAssertTrue(arm.waitForExistence(timeout: 12))
        arm.tap()

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 5))
        let settled = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 55), .completed)

        let kmrMode = app.buttons["KMR Mobile Base"]
        XCTAssertTrue(kmrMode.waitForExistence(timeout: 20), app.debugDescription)
        kmrMode.tap()

        let kitchen = app.buttons.matching(
            NSPredicate(format: "label CONTAINS[c] 'Kitchen'")
        ).firstMatch
        XCTAssertTrue(kitchen.waitForExistence(timeout: 15), app.debugDescription)
        kitchen.tap()

        let pathReceipt = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'Value path:'")
        ).firstMatch
        XCTAssertTrue(pathReceipt.waitForExistence(timeout: 10), app.debugDescription)
        XCTAssertFalse(app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'does not clear'")
        ).firstMatch.exists)

        let screenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        screenshot.name = "KMR Kitchen route in native container"
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }

    func testG1ReceiptLensesReweightAnalysisWithoutChangingOwnerKernel() throws {
        let app = XCUIApplication()
        app.launch()

        let humanoid = app.segmentedControls.buttons["Humanoid"]
        XCTAssertTrue(humanoid.waitForExistence(timeout: 12))
        if !humanoid.isSelected {
            humanoid.tap()
        }

        let stage = app.webViews["robot-stage"].firstMatch
        XCTAssertTrue(stage.waitForExistence(timeout: 12))

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 5))
        let settled = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 55), .completed)

        let equalizer = app.descendants(matching: .any).matching(
            NSPredicate(format: "label CONTAINS[c] 'receipt objective equalizer'")
        ).firstMatch
        XCTAssertTrue(equalizer.waitForExistence(timeout: 30), app.debugDescription)

        let kernelReceipt = app.descendants(matching: .any).matching(
            NSPredicate(format: "label CONTAINS[c] 'kernel scalar'")
        ).firstMatch
        XCTAssertTrue(kernelReceipt.waitForExistence(timeout: 10), app.debugDescription)
        let originalKernelLabel = kernelReceipt.label

        let nativeLensMenu = app.buttons["robot-native-receipt-lenses"]
        XCTAssertTrue(nativeLensMenu.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(nativeLensMenu.isHittable)

        let lenses = [
            (
                menuItem: "robot-receipt-lens-cautious-monk",
                status: "Viewing The Cautious Monk receipt lens"
            ),
            (
                menuItem: "robot-receipt-lens-olympic-sprinter",
                status: "Viewing The Olympic Sprinter receipt lens"
            ),
            (
                menuItem: "robot-receipt-lens-glass-floor",
                status: "Viewing The Glass-Floor Walker receipt lens"
            ),
        ]

        var weightedSumLabels = Set<String>()
        for lens in lenses {
            nativeLensMenu.tap()
            let menuItem = app.buttons[lens.menuItem]
            XCTAssertTrue(menuItem.waitForExistence(timeout: 5), app.debugDescription)
            XCTAssertTrue(menuItem.isHittable)
            menuItem.tap()

            XCTAssertTrue(app.descendants(matching: .any).matching(
                NSPredicate(format: "label CONTAINS[c] %@", lens.status)
            ).firstMatch.waitForExistence(timeout: 5), app.debugDescription)
            let weightedSum = app.descendants(matching: .any).matching(
                NSPredicate(format: "label BEGINSWITH[c] 'Selected-lens contributions, weighted sum'")
            ).firstMatch
            XCTAssertTrue(weightedSum.waitForExistence(timeout: 5), app.debugDescription)
            weightedSumLabels.insert(weightedSum.label)
            XCTAssertEqual(kernelReceipt.label, originalKernelLabel)
        }
        XCTAssertEqual(weightedSumLabels.count, lenses.count)

        let screenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        screenshot.name = "G1 receipt lens in native container"
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }

    func testG1ManualPushIsDisclosedAsPreviewWithoutChangingOwnerReceipt() throws {
        let app = XCUIApplication()
        app.launch()

        let humanoid = app.segmentedControls.buttons["Humanoid"]
        XCTAssertTrue(humanoid.waitForExistence(timeout: 12))
        if !humanoid.isSelected {
            humanoid.tap()
        }

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 5))
        let settled = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 55), .completed)

        let kernelReceipt = app.descendants(matching: .any).matching(
            NSPredicate(format: "label CONTAINS[c] 'kernel scalar'")
        ).firstMatch
        XCTAssertTrue(kernelReceipt.waitForExistence(timeout: 20), app.debugDescription)
        let originalKernelLabel = kernelReceipt.label

        let configure = app.buttons["Configure display-only push-vector preview"]
        XCTAssertTrue(configure.waitForExistence(timeout: 10), app.debugDescription)
        XCTAssertTrue(configure.isHittable)
        configure.tap()

        let disclosure = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'Visualization preview only'")
        ).firstMatch
        let admittedPeak = app.staticTexts["(24.0 N peak)"].firstMatch
        let unchangedBoundary = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'no controller'")
        ).firstMatch
        XCTAssertTrue(disclosure.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(admittedPeak.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(unchangedBoundary.waitForExistence(timeout: 5), app.debugDescription)

        let right = app.buttons.matching(
            NSPredicate(format: "label CONTAINS[c] 'Right'")
        ).firstMatch
        let magnitude = app.buttons["45 N·s"]
        XCTAssertTrue(right.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertTrue(magnitude.waitForExistence(timeout: 5), app.debugDescription)
        right.tap()
        magnitude.tap()

        let disclosureScreenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        disclosureScreenshot.name = "G1 display-only push configuration disclosure"
        disclosureScreenshot.lifetime = .keepAlways
        add(disclosureScreenshot)

        let preview = app.buttons[
            "Preview display-only push vector: 45 newton-seconds at 270 degrees"
        ]
        XCTAssertTrue(preview.waitForExistence(timeout: 5), app.debugDescription)
        preview.tap()

        let status = app.descendants(matching: .any).matching(
            NSPredicate(
                format: "label CONTAINS[c] 'display-only 45 N·s vector at 270°' AND label CONTAINS[c] 'owner rollout' AND label CONTAINS[c] 'unchanged'"
            )
        ).firstMatch
        XCTAssertTrue(status.waitForExistence(timeout: 5), app.debugDescription)
        XCTAssertEqual(kernelReceipt.label, originalKernelLabel)

        let screenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        screenshot.name = "G1 display-only push preview in native container"
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }
}
