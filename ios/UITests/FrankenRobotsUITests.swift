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
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 25), .completed)

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
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 25), .completed)

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
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 25), .completed)

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

        let engineStatus = app.descendants(matching: .any)["robot-engine-status"]
        XCTAssertTrue(engineStatus.waitForExistence(timeout: 5))
        let settled = XCTNSPredicateExpectation(
            predicate: NSPredicate(
                format: "label CONTAINS[c] 'ready' OR label CONTAINS[c] 'running'"
            ),
            object: engineStatus
        )
        XCTAssertEqual(XCTWaiter.wait(for: [settled], timeout: 25), .completed)

        let equalizer = app.descendants(matching: .any).matching(
            NSPredicate(format: "label CONTAINS[c] 'receipt objective equalizer'")
        ).firstMatch
        XCTAssertTrue(equalizer.waitForExistence(timeout: 30), app.debugDescription)

        let kernelReceipt = app.descendants(matching: .any).matching(
            NSPredicate(format: "label CONTAINS[c] 'kernel scalar'")
        ).firstMatch
        XCTAssertTrue(kernelReceipt.waitForExistence(timeout: 10), app.debugDescription)
        let originalKernelLabel = kernelReceipt.label

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
            let button = app.buttons[lens.button]
            XCTAssertTrue(button.waitForExistence(timeout: 10), app.debugDescription)
            for _ in 0..<12 where !button.isHittable {
                app.swipeUp()
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
        }

        let screenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        screenshot.name = "G1 receipt lens in native container"
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }
}
