import XCTest

final class FrankenRobotsUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
    }

    func testSwitchesBetweenFocusedLabs() throws {
        let app = XCUIApplication()
        app.launch()

        XCTAssertTrue(app.otherElements["robot-stage"].waitForExistence(timeout: 8))
        let arm = app.segmentedControls.buttons["Robot Arm"]
        XCTAssertTrue(arm.exists)
        arm.tap()
        XCTAssertTrue(arm.isSelected)
    }
}
