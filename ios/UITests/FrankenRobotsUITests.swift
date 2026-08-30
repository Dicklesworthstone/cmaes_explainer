import XCTest

final class FrankenRobotsUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    func testSwitchesBetweenFocusedLabs() throws {
        let app = XCUIApplication()
        app.launch()

        let stage = app.descendants(matching: .any)
            .matching(identifier: "robot-stage")
            .firstMatch
        XCTAssertTrue(stage.waitForExistence(timeout: 12))

        let arm = app.segmentedControls.buttons["Robot Arm"]
        XCTAssertTrue(arm.exists)
        arm.tap()
        XCTAssertTrue(arm.isSelected)
        XCTAssertTrue(stage.waitForExistence(timeout: 12))

        let screenshot = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        screenshot.name = "Robot Arm lab after native route switch"
        screenshot.lifetime = .keepAlways
        add(screenshot)
    }
}
