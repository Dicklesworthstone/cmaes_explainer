import XCTest
@testable import FrankenRobots

final class RobotEngineBridgeTests: XCTestCase {
    func testReadinessDeadlineRejectsStaleAndTerminalLoads() {
        var deadline = RobotReadinessDeadline()
        let firstHumanoidLoad = deadline.arm(for: .humanoid)
        let retriedHumanoidLoad = deadline.arm(for: .humanoid)

        XCTAssertFalse(deadline.shouldFail(
            generation: firstHumanoidLoad,
            lab: .humanoid,
            phase: .loading
        ))
        XCTAssertTrue(deadline.shouldFail(
            generation: retriedHumanoidLoad,
            lab: .humanoid,
            phase: .loading
        ))
        XCTAssertFalse(deadline.shouldFail(
            generation: retriedHumanoidLoad,
            lab: .humanoid,
            phase: .ready
        ))

        let armLoad = deadline.arm(for: .arm)
        XCTAssertFalse(deadline.shouldFail(
            generation: retriedHumanoidLoad,
            lab: .humanoid,
            phase: .loading
        ))
        XCTAssertTrue(deadline.shouldFail(
            generation: armLoad,
            lab: .arm,
            phase: .starting
        ))

        deadline.cancel()
        XCTAssertFalse(deadline.shouldFail(
            generation: armLoad,
            lab: .arm,
            phase: .loading
        ))

        XCTAssertFalse(RobotEnginePhase.failed("timeout").acceptsOwnerStatus)
        XCTAssertTrue(RobotEnginePhase.loading.acceptsOwnerStatus)
    }

    func testReceiptLensIdentifiersMatchEmbeddedAnalysisControls() {
        XCTAssertEqual(
            RobotReceiptLens.allCases.map(\.rawValue),
            ["owner-receipt", "cautious-monk", "olympic-sprinter", "glass-floor"]
        )
        XCTAssertEqual(RobotReceiptLens.baseline.title, "Documented Baseline")
        XCTAssertEqual(RobotReceiptLens.glassFloor.title, "Glass-Floor Walker")
    }

    func testCameraAndPlaybackChoicesMatchBothEmbeddedLabs() {
        XCTAssertEqual(
            RobotCameraMode.available(for: .humanoid).map(\.rawValue),
            ["orbit", "follow", "pov", "blueprint", "fly"]
        )
        XCTAssertEqual(
            RobotCameraMode.available(for: .arm).map(\.rawValue),
            ["studio", "microscope", "overhead", "side", "front", "fly"]
        )
        XCTAssertEqual(RobotPlaybackSpeed.allCases.map(\.rawValue), [0.25, 0.5, 1, 2])
        XCTAssertEqual(
            RobotSearchSigmaPreset.allCases.map(\.value),
            [0.0002, 0.0005, 0.001, 0.005, 0.01]
        )
        XCTAssertEqual(
            RobotOverlayMode.available(for: .humanoid).map(\.rawValue),
            ["xray", "physics-debug"]
        )
        XCTAssertEqual(
            RobotOverlayMode.available(for: .arm).map(\.rawValue),
            ["friction-cones", "physics-debug"]
        )
    }

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
            "activeTask": "walking",
            "activeChallenge": "terrain-and-push",
            "activeFamily": "lm-ma"
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
        XCTAssertEqual(metrics.activeChallenge, .terrainAndPush)
        XCTAssertEqual(metrics.activeFamily, .lmMA)
        XCTAssertFalse(metrics.isEmpty)
    }

    func testMetricsDecodeArmExperimentIdentity() throws {
        let metrics = try XCTUnwrap(RobotEngineMetrics(payload: [
            "activeArmTask": "living-room-remote",
            "activeFamily": "full"
        ]))

        XCTAssertEqual(metrics.activeArmTask, .livingRoomRemote)
        XCTAssertEqual(metrics.activeFamily, .full)
        XCTAssertNil(metrics.activeTask)
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
            "activeTask": NSNull(),
            "activeArmTask": NSNull(),
            "activeChallenge": NSNull(),
            "activeFamily": NSNull()
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
        XCTAssertNil(RobotEngineMetrics(payload: ["activeArmTask": "garage-drill"]))
        XCTAssertNil(RobotEngineMetrics(payload: ["activeChallenge": "moon-gravity"]))
        XCTAssertNil(RobotEngineMetrics(payload: ["activeFamily": "mystery-cma"]))
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
        taskCapability["capabilities"] = [
            "optimize", "select-task", "select-challenge", "select-family",
            "select-receipt-lens", "set-overlay", "set-seed", "set-sigma"
        ]
        taskCapability["metrics"] = [
            "activeTask": "walking",
            "activeChallenge": "flat",
            "activeFamily": "lm-ma",
            "activeSeedIndex": 2,
            "activeSigma": 0.0005
        ]
        let taskEvent = try XCTUnwrap(RobotEngineStatusMessage(payload: taskCapability))
        XCTAssertEqual(taskEvent.metrics.activeTask, .walking)
        XCTAssertEqual(taskEvent.metrics.activeSeedIndex, 2)
        XCTAssertEqual(taskEvent.metrics.activeSigma, 0.0005)
        taskCapability["lab"] = "arm"
        XCTAssertNil(RobotEngineStatusMessage(payload: taskCapability))
        var armCapability = statusPayload(lab: "arm")
        armCapability["capabilities"] = [
            "optimize", "select-task", "select-family", "set-overlay", "set-seed"
        ]
        armCapability["metrics"] = [
            "activeArmTask": "backyard-trowel",
            "activeFamily": "full"
        ]
        let armEvent = try XCTUnwrap(RobotEngineStatusMessage(payload: armCapability))
        XCTAssertEqual(armEvent.metrics.activeArmTask, .backyardTrowel)
        XCTAssertEqual(armEvent.metrics.activeFamily, .full)
        armCapability["capabilities"] = ["select-receipt-lens"]
        XCTAssertNil(RobotEngineStatusMessage(payload: armCapability))
        armCapability = statusPayload(lab: "arm")
        armCapability["metrics"] = ["activeSigma": 0.001]
        XCTAssertNil(RobotEngineStatusMessage(payload: armCapability))
        var invalidRunSetup = statusPayload()
        invalidRunSetup["metrics"] = ["activeSeedIndex": 3]
        XCTAssertNil(RobotEngineStatusMessage(payload: invalidRunSetup))
        invalidRunSetup["metrics"] = ["activeSigma": 0.02]
        XCTAssertNil(RobotEngineStatusMessage(payload: invalidRunSetup))
        var invalidHumanoidFamily = statusPayload()
        invalidHumanoidFamily["metrics"] = ["activeFamily": "full"]
        XCTAssertNil(RobotEngineStatusMessage(payload: invalidHumanoidFamily))
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

        var armTaskPayload = payload
        armTaskPayload["commandId"] = "9B84A8A2-arm-task"
        armTaskPayload["command"] = "select-task"
        armTaskPayload["task"] = "living-room-remote"
        let armTaskAcknowledgement = try XCTUnwrap(
            RobotEngineCommandAcknowledgement(payload: armTaskPayload)
        )
        XCTAssertEqual(armTaskAcknowledgement.armTask, .livingRoomRemote)

        var challengePayload = payload
        challengePayload["commandId"] = "9B84A8A2-challenge"
        challengePayload["lab"] = "humanoid"
        challengePayload["command"] = "select-challenge"
        challengePayload["challenge"] = "terrain-and-push"
        let challengeAcknowledgement = try XCTUnwrap(
            RobotEngineCommandAcknowledgement(payload: challengePayload)
        )
        XCTAssertEqual(challengeAcknowledgement.challenge, .terrainAndPush)

        var familyPayload = payload
        familyPayload["commandId"] = "9B84A8A2-family"
        familyPayload["command"] = "select-family"
        familyPayload["family"] = "full"
        let familyAcknowledgement = try XCTUnwrap(
            RobotEngineCommandAcknowledgement(payload: familyPayload)
        )
        XCTAssertEqual(familyAcknowledgement.family, .full)
        familyPayload["lab"] = "humanoid"
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: familyPayload))

        var seekPayload = payload
        seekPayload["commandId"] = "9B84A8A2-seek"
        seekPayload["command"] = "seek"
        seekPayload["sampleIndex"] = 42
        XCTAssertEqual(
            RobotEngineCommandAcknowledgement(payload: seekPayload)?.sampleIndex,
            42
        )
        seekPayload["sampleIndex"] = 1.5
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: seekPayload))

        var speedPayload = payload
        speedPayload["commandId"] = "9B84A8A2-speed"
        speedPayload["command"] = "set-speed"
        speedPayload["speed"] = 0.25
        XCTAssertEqual(
            RobotEngineCommandAcknowledgement(payload: speedPayload)?.speed,
            .quarter
        )
        speedPayload["speed"] = 4
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: speedPayload))

        var cameraPayload = payload
        cameraPayload["commandId"] = "9B84A8A2-camera"
        cameraPayload["command"] = "set-camera"
        cameraPayload["camera"] = "microscope"
        XCTAssertEqual(
            RobotEngineCommandAcknowledgement(payload: cameraPayload)?.camera,
            .microscope
        )
        cameraPayload["lab"] = "humanoid"
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: cameraPayload))

        var lensPayload = payload
        lensPayload["commandId"] = "9B84A8A2-lens"
        lensPayload["lab"] = "humanoid"
        lensPayload["command"] = "select-receipt-lens"
        lensPayload["receiptLens"] = "glass-floor"
        XCTAssertEqual(
            RobotEngineCommandAcknowledgement(payload: lensPayload)?.receiptLens,
            .glassFloor
        )
        lensPayload["lab"] = "arm"
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: lensPayload))

        var overlayPayload = payload
        overlayPayload["commandId"] = "9B84A8A2-overlay"
        overlayPayload["command"] = "set-overlay"
        overlayPayload["overlay"] = "friction-cones"
        overlayPayload["enabled"] = true
        let overlayAcknowledgement = try XCTUnwrap(
            RobotEngineCommandAcknowledgement(payload: overlayPayload)
        )
        XCTAssertEqual(overlayAcknowledgement.overlay, .frictionCones)
        XCTAssertEqual(overlayAcknowledgement.overlayEnabled, true)
        overlayPayload["enabled"] = 1
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: overlayPayload))
        overlayPayload["enabled"] = true
        overlayPayload["lab"] = "humanoid"
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: overlayPayload))

        var seedPayload = payload
        seedPayload["commandId"] = "9B84A8A2-seed"
        seedPayload["command"] = "set-seed"
        seedPayload["seedIndex"] = 1
        XCTAssertEqual(RobotEngineCommandAcknowledgement(payload: seedPayload)?.seedIndex, 1)
        seedPayload["seedIndex"] = 3
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: seedPayload))

        var sigmaPayload = payload
        sigmaPayload["commandId"] = "9B84A8A2-sigma"
        sigmaPayload["lab"] = "humanoid"
        sigmaPayload["command"] = "set-sigma"
        sigmaPayload["sigma"] = 0.0005
        XCTAssertEqual(RobotEngineCommandAcknowledgement(payload: sigmaPayload)?.sigma, 0.0005)
        sigmaPayload["lab"] = "arm"
        XCTAssertNil(RobotEngineCommandAcknowledgement(payload: sigmaPayload))

        for command in ["replay", "play", "pause"] {
            var transportPayload = payload
            transportPayload["commandId"] = "9B84A8A2-\(command)"
            transportPayload["command"] = command
            XCTAssertEqual(
                RobotEngineCommandAcknowledgement(payload: transportPayload)?.command,
                command
            )
        }

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

    func testTraceStateRequiresBoundedOwnerPlaybackAndCameraState() throws {
        let valid: [String: Any] = [
            "type": "trace.state",
            "schemaVersion": 1,
            "sequence": 11,
            "lab": "humanoid",
            "sampleIndex": 42,
            "sampleCount": 720,
            "playing": true,
            "speed": 0.5,
            "camera": "follow"
        ]
        let state = try XCTUnwrap(RobotTraceStateMessage(payload: valid))
        XCTAssertEqual(state.sampleIndex, 42)
        XCTAssertEqual(state.sampleCount, 720)
        XCTAssertTrue(state.playing)
        XCTAssertEqual(state.speed, .half)
        XCTAssertEqual(state.camera, .follow)

        var malformed = valid
        malformed["sampleIndex"] = 720
        XCTAssertNil(RobotTraceStateMessage(payload: malformed))
        malformed = valid
        malformed["sampleCount"] = 0
        malformed["sampleIndex"] = 0
        malformed["playing"] = true
        XCTAssertNil(RobotTraceStateMessage(payload: malformed))
        malformed = valid
        malformed["speed"] = 4
        XCTAssertNil(RobotTraceStateMessage(payload: malformed))
        malformed = valid
        malformed["camera"] = "studio"
        XCTAssertNil(RobotTraceStateMessage(payload: malformed))
        var empty = valid
        empty["sampleIndex"] = 0
        empty["sampleCount"] = 0
        empty["playing"] = false
        XCTAssertNotNil(RobotTraceStateMessage(payload: empty))

        var arm = valid
        arm["lab"] = "arm"
        arm["camera"] = "microscope"
        XCTAssertEqual(RobotTraceStateMessage(payload: arm)?.camera, .microscope)
    }

    func testTraceStateRequiresLabOwnedReceiptLensAndOverlays() throws {
        let humanoid: [String: Any] = [
            "type": "trace.state",
            "schemaVersion": 1,
            "sequence": 12,
            "lab": "humanoid",
            "sampleIndex": 42,
            "sampleCount": 720,
            "playing": true,
            "speed": 0.5,
            "camera": "follow",
            "receiptLens": "cautious-monk",
            "overlays": ["xray", "physics-debug"]
        ]
        let state = try XCTUnwrap(RobotTraceStateMessage(payload: humanoid))
        XCTAssertEqual(state.receiptLens, .cautious)
        XCTAssertEqual(state.overlays, [.xray, .physicsDebug])

        var malformed = humanoid
        malformed["overlays"] = ["xray", "xray"]
        XCTAssertNil(RobotTraceStateMessage(payload: malformed))
        malformed = humanoid
        malformed["receiptLens"] = "secret-lens"
        XCTAssertNil(RobotTraceStateMessage(payload: malformed))

        var arm = humanoid
        arm["lab"] = "arm"
        arm["camera"] = "microscope"
        arm.removeValue(forKey: "receiptLens")
        arm["overlays"] = ["friction-cones", "physics-debug"]
        XCTAssertEqual(
            RobotTraceStateMessage(payload: arm)?.overlays,
            [.frictionCones, .physicsDebug]
        )
        arm["receiptLens"] = "owner-receipt"
        XCTAssertNil(RobotTraceStateMessage(payload: arm))
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
