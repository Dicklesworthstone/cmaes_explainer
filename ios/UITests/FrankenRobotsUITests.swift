import XCTest

final class FrankenRobotsUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
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
        let kernelValue = app.staticTexts["1.32"].firstMatch
        XCTAssertTrue(kernelValue.waitForExistence(timeout: 10), app.debugDescription)
        let originalKernelValueLabel = kernelValue.label

        let lenses = [
            (
                button: "Analyze this receipt with The Cautious Monk (Maximum Balance)",
                status: "Viewing The Cautious Monk receipt lens",
                sum: "27.16"
            ),
            (
                button: "Analyze this receipt with The Olympic Sprinter (Dynamic Forward)",
                status: "Viewing The Olympic Sprinter receipt lens",
                sum: "12.70"
            ),
            (
                button: "Analyze this receipt with The Glass-Floor Walker (Zero Impact)",
                status: "Viewing The Glass-Floor Walker receipt lens",
                sum: "50.36"
            ),
        ]

        for lens in lenses {
            let button = app.switches[lens.button]
            XCTAssertTrue(button.waitForExistence(timeout: 10), app.debugDescription)
            for _ in 0..<24 where !button.isHittable {
                stage.swipeUp(velocity: .fast)
            }
            XCTAssertTrue(button.isHittable, "Lens control never became hittable: \(lens.button)")
            button.tap()

            XCTAssertTrue(app.descendants(matching: .any).matching(
                NSPredicate(format: "label CONTAINS[c] %@", lens.status)
            ).firstMatch.waitForExistence(timeout: 5), app.debugDescription)
            XCTAssertTrue(app.descendants(matching: .any).matching(
                NSPredicate(format: "label CONTAINS[c] 'weighted sum' AND label CONTAINS[c] %@", lens.sum)
            ).firstMatch.waitForExistence(timeout: 5), app.debugDescription)
            XCTAssertEqual(kernelReceipt.label, originalKernelLabel)
            XCTAssertEqual(kernelValue.label, originalKernelValueLabel)
        }

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
        let kernelValue = app.staticTexts["1.32"].firstMatch
        XCTAssertTrue(kernelValue.waitForExistence(timeout: 10), app.debugDescription)
        let originalKernelValueLabel = kernelValue.label

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
        XCTAssertEqual(kernelValue.label, originalKernelValueLabel)

        let screenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        screenshot.name = "G1 display-only push preview in native container"
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }
}
