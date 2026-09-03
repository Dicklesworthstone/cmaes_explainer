import XCTest
@testable import FrankenRobots

final class RobotEngineBridgeTests: XCTestCase {
    func testMetricsDecodeOwnerFacts() throws {
        let metrics = try XCTUnwrap(RobotEngineMetrics(payload: [
            "generation": 12,
            "bestObjective": 1.32,
            "completedSteps": 720,
            "placed": true,
        ]))

        XCTAssertEqual(metrics.generation, 12)
        XCTAssertEqual(metrics.bestObjective, 1.32)
        XCTAssertEqual(metrics.completedSteps, 720)
        XCTAssertEqual(metrics.placed, true)
        XCTAssertFalse(metrics.isEmpty)
    }

    func testMetricsAcceptExplicitNulls() throws {
        let metrics = try XCTUnwrap(RobotEngineMetrics(payload: [
            "generation": NSNull(),
            "bestObjective": NSNull(),
            "completedSteps": NSNull(),
            "placed": NSNull(),
        ]))

        XCTAssertEqual(metrics, .empty)
        XCTAssertTrue(metrics.isEmpty)
    }

    func testMetricsRejectMalformedAndNonFiniteValues() {
        XCTAssertNil(RobotEngineMetrics(payload: ["generation": 1.5]))
        XCTAssertNil(RobotEngineMetrics(payload: ["generation": -1]))
        XCTAssertNil(RobotEngineMetrics(payload: ["bestObjective": Double.nan]))
        XCTAssertNil(RobotEngineMetrics(payload: ["completedSteps": -1]))
        XCTAssertNil(RobotEngineMetrics(payload: ["completedSteps": true]))
        XCTAssertNil(RobotEngineMetrics(payload: ["placed": "yes"]))
    }

    func testStatusMessageRequiresCurrentSchemaAndPositiveSequence() throws {
        let event = try XCTUnwrap(RobotEngineStatusMessage(payload: statusPayload()))
        XCTAssertEqual(event.sequence, 4)
        XCTAssertEqual(event.lab, .humanoid)
        XCTAssertEqual(event.state, "ready")
        XCTAssertEqual(event.detail, "Owner trace ready")
        XCTAssertEqual(event.metrics.completedSteps, 720)
        XCTAssertEqual(event.capabilities, ["optimize"])

        XCTAssertNil(RobotEngineStatusMessage(payload: statusPayload(schemaVersion: 2)))
        XCTAssertNil(RobotEngineStatusMessage(payload: statusPayload(sequence: 0)))
        XCTAssertNil(RobotEngineStatusMessage(payload: statusPayload(lab: "foreign")))
        XCTAssertNil(RobotEngineStatusMessage(payload: statusPayload(state: "invented")))
    }

    func testCommandAcknowledgementRequiresMatchingBoundedContract() throws {
        let payload: [String: Any] = [
            "type": "engine.command.ack",
            "schemaVersion": 1,
            "sequence": 7,
            "commandId": "9B84A8A2-1",
            "lab": "arm",
            "command": "optimize",
            "accepted": true,
            "detail": "Accepted 20 generations.",
        ]
        let acknowledgement = try XCTUnwrap(RobotEngineCommandAcknowledgement(payload: payload))
        XCTAssertEqual(acknowledgement.sequence, 7)
        XCTAssertEqual(acknowledgement.commandID, "9B84A8A2-1")
        XCTAssertEqual(acknowledgement.lab, .arm)
        XCTAssertTrue(acknowledgement.accepted)

        var malformed = payload
        malformed["accepted"] = "yes"
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: malformed))
        malformed = payload
        malformed["commandId"] = "unsafe id"
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: malformed))
        malformed = payload
        malformed["command"] = "eval"
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: malformed))
        malformed = payload
        malformed["sequence"] = 0
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: malformed))
        malformed = payload
        malformed["detail"] = String(repeating: "x", count: 301)
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: malformed))
    }

    private func statusPayload(
        schemaVersion: Int = 1,
        sequence: Int = 4,
        lab: String = "humanoid",
        state: String = "ready"
    ) -> [String: Any] {
        [
            "type": "engine.status",
            "schemaVersion": schemaVersion,
            "sequence": sequence,
            "lab": lab,
            "state": state,
            "detail": "Owner trace ready",
            "metrics": [
                "generation": 0,
                "bestObjective": 1.32,
                "completedSteps": 720,
                "placed": NSNull(),
            ],
            "capabilities": ["optimize"],
        ]
    }
}
