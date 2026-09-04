import XCTest
@testable import FrankenRobots

final class RobotEngineBridgeTests: XCTestCase {
    func testTextScaleUsesBrowserStyleBoundedSteps() {
        XCTAssertEqual(
            RobotTheme.steppedTextScale(from: RobotTheme.defaultTextScale, direction: 1),
            1.1,
            accuracy: 0.0001
        )
        XCTAssertEqual(
            RobotTheme.steppedTextScale(from: RobotTheme.defaultTextScale, direction: -1),
            0.9,
            accuracy: 0.0001
        )
        XCTAssertEqual(RobotTheme.clampedTextScale(99), RobotTheme.maximumTextScale)
        XCTAssertEqual(RobotTheme.clampedTextScale(-99), RobotTheme.minimumTextScale)
    }

    func testReceiptDocumentExportsVersionedOwnerFactsAndProvenance() throws {
        let exportedAt = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-03T22:00:00Z"))
        let receipt = RobotRunReceipt(
            schemaVersion: RobotRunReceipt.schemaVersion,
            exportedAt: exportedAt,
            lab: "arm",
            engineState: "ready",
            detail: "Owner trace ready",
            bridgeSequence: 9,
            capabilities: ["optimize"],
            metrics: RobotEngineMetrics(
                generation: 12,
                bestObjective: -177.95,
                placed: true,
                certifiedClearanceMeters: 0.0471,
                collisionRiskIntegral: 0,
                possibleCollisionTimeSeconds: 0
            ),
            provenance: RobotReceiptProvenance(
                appSourceCommit: "abc123",
                frankenSimWorkspaceCommit: "def456",
                ownerKernelVersion: "fs-cmaes-viz-wasm 0.6.15",
                appVersion: "0.1.0",
                appBuild: "1"
            )
        )

        let document = try RobotReceiptDocument(receipt: receipt)
        let decoded = try JSONDecoder.receiptDecoder.decode(RobotRunReceipt.self, from: document.data)

        XCTAssertEqual(decoded, receipt)
        XCTAssertTrue(try XCTUnwrap(String(data: document.data, encoding: .utf8)).hasSuffix("\n"))
    }

    func testMetricsDecodeOwnerFacts() throws {
        let metrics = try XCTUnwrap(RobotEngineMetrics(payload: [
            "generation": 12,
            "bestObjective": 1.32,
            "completedSteps": 720,
            "placed": true,
            "bodyPenetrationMeters": 0.0,
            "certifiedClearanceMeters": 0.052,
            "collisionRiskIntegral": 0.0,
            "possibleCollisionTimeSeconds": 0.0,
            "activeTask": "walking"
        ]))

        XCTAssertEqual(metrics.generation, 12)
        XCTAssertEqual(metrics.bestObjective, 1.32)
        XCTAssertEqual(metrics.completedSteps, 720)
        XCTAssertEqual(metrics.placed, true)
        XCTAssertEqual(metrics.bodyPenetrationMeters, 0.0)
        XCTAssertEqual(metrics.certifiedClearanceMeters, 0.052)
        XCTAssertEqual(metrics.collisionRiskIntegral, 0.0)
        XCTAssertEqual(metrics.possibleCollisionTimeSeconds, 0.0)
        XCTAssertEqual(metrics.activeTask, .walking)
        XCTAssertFalse(metrics.isEmpty)
    }

    func testMetricsAcceptExplicitNulls() throws {
        let metrics = try XCTUnwrap(RobotEngineMetrics(payload: [
            "generation": NSNull(),
            "bestObjective": NSNull(),
            "completedSteps": NSNull(),
            "placed": NSNull(),
            "bodyPenetrationMeters": NSNull(),
            "certifiedClearanceMeters": NSNull(),
            "collisionRiskIntegral": NSNull(),
            "possibleCollisionTimeSeconds": NSNull(),
            "activeTask": NSNull()
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
        XCTAssertNil(RobotEngineMetrics(payload: ["bodyPenetrationMeters": -0.001]))
        XCTAssertNil(RobotEngineMetrics(payload: ["certifiedClearanceMeters": Double.infinity]))
        XCTAssertNil(RobotEngineMetrics(payload: ["collisionRiskIntegral": true]))
        XCTAssertNil(RobotEngineMetrics(payload: ["possibleCollisionTimeSeconds": -1]))
        XCTAssertNil(RobotEngineMetrics(payload: ["activeTask": "dancing"]))
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
        var taskCapability = statusPayload()
        taskCapability["capabilities"] = ["optimize", "select-task"]
        taskCapability["metrics"] = ["activeTask": "walking"]
        XCTAssertEqual(
            RobotEngineStatusMessage(payload: taskCapability)?.metrics.activeTask,
            .walking
        )
        taskCapability["lab"] = "arm"
        XCTAssertNil(RobotEngineStatusMessage(payload: taskCapability))
        var malformedCapabilities = statusPayload()
        malformedCapabilities["capabilities"] = ["optimize", 1]
        XCTAssertNil(RobotEngineStatusMessage(payload: malformedCapabilities))
        var oversizedDetail = statusPayload()
        oversizedDetail["detail"] = String(repeating: "x", count: 301)
        XCTAssertNil(RobotEngineStatusMessage(payload: oversizedDetail))
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
        XCTAssertEqual(acknowledgement.command, "optimize")
        XCTAssertTrue(acknowledgement.accepted)

        var stopPayload = payload
        stopPayload["commandId"] = "9B84A8A2-stop"
        stopPayload["command"] = "stop"
        let stopAcknowledgement = try XCTUnwrap(
            RobotEngineCommandAcknowledgement(payload: stopPayload)
        )
        XCTAssertEqual(stopAcknowledgement.command, "stop")

        var taskPayload = payload
        taskPayload["commandId"] = "9B84A8A2-task"
        taskPayload["lab"] = "humanoid"
        taskPayload["command"] = "select-task"
        taskPayload["task"] = "stepping"
        let taskAcknowledgement = try XCTUnwrap(
            RobotEngineCommandAcknowledgement(payload: taskPayload)
        )
        XCTAssertEqual(taskAcknowledgement.command, "select-task")
        XCTAssertEqual(taskAcknowledgement.task, .stepping)

        taskPayload["lab"] = "arm"
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: taskPayload))

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
                "bodyPenetrationMeters": 0.0,
                "certifiedClearanceMeters": NSNull(),
                "collisionRiskIntegral": NSNull(),
                "possibleCollisionTimeSeconds": NSNull()
            ],
            "capabilities": ["optimize"],
        ]
    }
}

private extension JSONDecoder {
    static var receiptDecoder: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }
}
