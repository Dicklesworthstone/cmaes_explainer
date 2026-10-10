import XCTest
import UIKit
import WebKit
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

/// Opt-in, app-hosted integration tests against the shipped WKWebView and owner worker.
/// Run on an audio-safe Simulator or Mac Catalyst with
/// FROBOTS_RUN_GRAPHICS_RECOVERY_TESTS=1 in the test host's environment.
/// No synthetic context-loss events or replacement policy/worker implementations are used.
final class RobotGraphicsRecoveryIntegrationTests: XCTestCase {
    @MainActor
    func testArmGraspFocusAtFinalOwnerSample() async throws {
        try XCTSkipUnless(ProcessInfo.processInfo.environment["FROBOTS_RUN_GRAPHICS_RECOVERY_TESTS"] == "1")
        try await waitUntil("app-hosted WKWebView") { self.appWebView() != nil }
        NotificationCenter.default.post(name: .selectRobotLab, object: RobotLab.arm)
        try await waitUntil("Arm navigation") { self.appWebView()?.url?.absoluteString.contains(RobotLab.arm.route) == true }
        let web = try XCTUnwrap(appWebView())
        try await waitUntil("Arm owner trace and camera controls", timeout: 180) {
            try await self.truth(web, """
            (() => { const position = document.querySelector('input[aria-label="Arm trace position"]');
              return position && !position.disabled && Number(position.max) === 180 &&
                !!document.querySelector('button[aria-label="Grasp Focus camera"]') && !!document.querySelector('canvas'); })()
            """)
        }
        let installed = try await truth(web, """
        (() => {
          const canvas = document.querySelector('[data-robot-stage-recovery] canvas');
          const gl = canvas?.getContext('webgl2');
          if (!gl) return false;
          const programs = new Set(), original = gl.useProgram;
          gl.useProgram = function(program) { if (program) programs.add(program); return original.call(this, program); };
          window.__robotProjectionProbe = { frames: 0, programs, gl, original };
          const tick = () => { const p = window.__robotProjectionProbe; if (p && p.frames++ < 150) requestAnimationFrame(tick); };
          requestAnimationFrame(tick);
          const send = (command, extra = {}) => window.__frankenrobotsReceiveNativeCommand({type:'engine.command',schemaVersion:1,commandId:'projection-'+command,lab:'arm',command,...extra});
          send('pause'); send('seek', {sampleIndex:180}); send('set-camera', {camera:'microscope'});
          send('set-overlay', {overlay:'friction-cones', enabled:true});
          return true;
        })()
        """)
        addTeardownBlock { @MainActor [weak web] in
            _ = try? await web?.evaluateJavaScript("""
            (() => { const p = window.__robotProjectionProbe;
              if (p) p.gl.useProgram = p.original;
              delete window.__robotProjectionProbe; return true; })()
            """)
        }
        XCTAssertTrue(installed)
        try await waitUntil("owner reached the final requested sample") {
            try await self.truth(web, "document.querySelector('input[aria-label=\"Arm trace position\"]')?.value === '180'")
        }
        for frame in [1, 30, 120] {
            try await waitUntil("native rendered projection frames") {
                try await self.truth(web, "window.__robotProjectionProbe.frames >= \(frame)")
            }
            let closeUpReady = try await truth(web, """
            !window.__robotProjectionProbe.gl.isContextLost() &&
            window.__robotProjectionProbe.programs.size > 0 &&
            document.querySelector('button[aria-label="Grasp Focus camera"]')?.getAttribute('aria-pressed') === 'true' &&
            document.querySelector('input[aria-label="Arm trace position"]')?.value === '180'
            """)
            XCTAssertTrue(closeUpReady, "Final owner pose, selected close-up and live graphics must remain intact")
            let matrices = try await web.evaluateJavaScript("""
            JSON.stringify([...window.__robotProjectionProbe.programs].filter(program => window.__robotProjectionProbe.gl.isProgram(program)).map(program => {
              const gl = window.__robotProjectionProbe.gl;
              const read = name => { const location = gl.getUniformLocation(program, name); return location ? Array.from(gl.getUniform(program, location)) : null; };
              return {projection: read('projectionMatrix'), view: read('viewMatrix')};
            }))
            """)
            attachText(String(describing: matrices), name: "arm-close-up-\(frame)-projection")
            try await snapshot(web, name: "arm-close-up-\(frame)-rendered-frames")
        }
    }

    @MainActor
    func testHumanoidRetainsLearningAcrossActualGraphicsLoss() async throws {
        try await verifyRecovery(lab: .humanoid, subject: "g1", policyCount: 5_040)
    }

    @MainActor
    func testArmRetainsLearningAcrossActualGraphicsLoss() async throws {
        try await verifyRecovery(lab: .arm, subject: "arm", policyCount: 128)
    }

    @MainActor
    private func verifyRecovery(lab: RobotLab, subject: String, policyCount: Int) async throws {
        try XCTSkipUnless(
            ProcessInfo.processInfo.environment["FROBOTS_RUN_GRAPHICS_RECOVERY_TESTS"] == "1",
            "Requires explicit native graphics test opt-in and Simulator audio preflight."
        )
        try await waitUntil("app-hosted WKWebView") { self.appWebView() != nil }
        NotificationCenter.default.post(name: .selectRobotLab, object: lab)
        try await waitUntil("selected lab navigation") {
            self.appWebView()?.url?.absoluteString.contains(lab.route) == true
        }
        let web = try XCTUnwrap(appWebView())
        do {
            try await waitUntil("real owner and stage ready", timeout: 180) {
                try await self.truth(web, """
                (() => {
                  const c = document.querySelector('[data-robot-stage-recovery] canvas');
                  return c && c.width > 0 && c.height > 0 && [...document.querySelectorAll('button')]
                    .some(b => !b.disabled && /^(Start learning|Keep learning · gen)/.test(b.textContent.trim()));
                })()
                """)
            }
            // These helpers live only in this test's page, not in application code.
            _ = try await web.evaluateJavaScript("""
            window.__robotNativeRecoveryProbe = {
              document: document,
              scrollingEnabled: canvas => {
                if (!canvas || getComputedStyle(canvas).touchAction !== 'pan-y') return false;
                for (let node = canvas.parentElement; node; node = node.parentElement) {
                  const action = getComputedStyle(node).touchAction;
                  if (action !== 'auto' && action !== 'manipulation' && !action.split(' ').includes('pan-y')) return false;
                }
                return true;
              },
              button: re => [...document.querySelectorAll('button')].find(b => re.test(b.textContent.trim())),
              checkpoints: () => JSON.stringify(Object.keys(localStorage)
                .filter(k => k.startsWith('cmaes.\(subject).') && k.endsWith('.training-session.v2'))
                .sort().map(k => [k, localStorage.getItem(k)])),
              generation: () => {
                const b = [...document.querySelectorAll('button')]
                  .find(b => /^(Stop|Keep learning) · gen/.test(b.textContent.trim()));
                return Number(b?.textContent.match(/gen (\\d+)/)?.[1] ?? -1);
              },
              lose: () => {
                const c = document.querySelector('[data-robot-stage-recovery] canvas');
                const gl = c?.getContext('webgl2') ?? c?.getContext('webgl');
                if (!gl || gl.isContextLost()) throw new Error('No healthy native WebGL context');
                const extension = gl.getExtension('WEBGL_lose_context');
                if (!extension) throw new Error('Actual context-loss extension unavailable');
                window.__robotNativeRecoveryProbe.oldCanvas = c;
                extension.loseContext();
                return true;
              },
              restored: () => {
                const p = window.__robotNativeRecoveryProbe;
                const c = document.querySelector('[data-robot-stage-recovery] canvas');
                const gl = c?.getContext('webgl2') ?? c?.getContext('webgl');
                return p.document === document && c !== p.oldCanvas && c?.width > 0 &&
                  gl && !gl.isContextLost() && !p.button(/^Retry 3D view$/) &&
                  p.scrollingEnabled(c);
              }
            }; true;
            """)
            let pageScrollingEnabled = try await truth(web, """
            window.__robotNativeRecoveryProbe.scrollingEnabled(document.querySelector('[data-robot-stage-recovery] canvas'))
            """)
            XCTAssertTrue(pageScrollingEnabled, "Native camera controls and their ancestors must not trap vertical page scrolling")
            try await click(web, matching: "^(Start learning|Keep learning · gen)")
            try await waitUntil("real learned policy checkpoint", timeout: 180) {
                try await self.truth(web, """
                (() => {
                  const entries = JSON.parse(window.__robotNativeRecoveryProbe.checkpoints());
                  return window.__robotNativeRecoveryProbe.generation() >= 10 && entries.some(([, raw]) => {
                    const p = JSON.parse(raw);
                    return p.generation > 0 && p.policy.length === \(policyCount);
                  });
                })()
                """)
            }
            try await stopLearning(web)
            let checkpoint = try await checkpointText(web)
            let generation = try await generationNumber(web)
            XCTAssertGreaterThan(generation, 0)
            if lab == .humanoid {
                try await verifyLearningActionLayout(web)
            }
            attachText(checkpoint, name: "\(subject)-policy-before-retry")
            try await snapshot(web, name: "\(subject)-learned-before-loss")

            // Repeated retries must preserve every serialized coefficient and the entire ledger.
            for attempt in 1...2 {
                try await loseAndRetry(web, name: "\(subject)-paused-\(attempt)")
                let after = try await checkpointText(web)
                let afterGeneration = try await generationNumber(web)
                XCTAssertEqual(after, checkpoint, "Graphics retry must not rewrite the learned checkpoint")
                XCTAssertEqual(afterGeneration, generation, "Graphics retry must not reset learning progress")
            }

            // Also lose the context with the real optimizer running: it must keep progressing,
            // rather than restarting a generation-zero worker behind an apparently healthy canvas.
            try await click(web, matching: "^Keep learning · gen")
            try await waitUntil("continued optimizer progress", timeout: 180) {
                try await self.generationNumber(web) > generation
            }
            let liveGeneration = try await generationNumber(web)
            try await loseAndRetry(web, name: "\(subject)-while-learning")
            try await waitUntil("optimizer survives graphics retry", timeout: 180) {
                let currentGeneration = try await self.generationNumber(web)
                let running = try await self.truth(web, "!!window.__robotNativeRecoveryProbe.button(/^Stop · gen/)")
                return currentGeneration > liveGeneration && running
            }
            try await stopLearning(web)
            let finalGeneration = try await generationNumber(web)
            XCTAssertGreaterThan(finalGeneration, liveGeneration)
            attachText(try await checkpointText(web), name: "\(subject)-policy-after-continuing")
            attachText("before=\(generation)\nliveLoss=\(liveGeneration)\nafter=\(finalGeneration)",
                       name: "\(subject)-generation-continuity")
            try await snapshot(web, name: "\(subject)-final-recovered-stage")
            try await verifyNativeRetry(web, lab: lab, subject: subject, generation: finalGeneration)
        } catch {
            try? await snapshot(web, name: "\(subject)-failure")
            try? await stopLearning(web)
            throw error
        }
    }

    @MainActor
    private func verifyNativeRetry(_ original: WKWebView, lab: RobotLab,
                                   subject: String, generation: Int) async throws {
        // Exercise the production native retry path, which replaces WKWebView,
        // separately from the in-page WebGL retries above. Recovery replays the
        // saved policy, not the unsaved CMA covariance, and may refresh savedAt.
        let checkpointScript = """
        JSON.stringify(Object.keys(localStorage)
          .filter(k => k.startsWith('cmaes.\(subject).') && k.endsWith('.training-session.v2'))
          .sort().map(k => { const saved = JSON.parse(localStorage.getItem(k));
            delete saved.savedAt; return [k, saved]; }))
        """
        let beforeValue = try await original.evaluateJavaScript(checkpointScript)
        let before = try XCTUnwrap(beforeValue as? String)
        XCTAssertNotEqual(before, "[]", "Native retry must start from a real learned checkpoint")
        attachText(before, name: "\(subject)-before-native-retry")
        NotificationCenter.default.post(name: .reloadRobotEngine, object: nil)
        try await waitUntil("replacement native WebView on the same lab") {
            guard let web = self.appWebView(), web !== original else { return false }
            return web.url?.absoluteString.contains(lab.route) == true
        }
        let replacement = try XCTUnwrap(appWebView())
        try await waitUntil("replacement document loaded") {
            try await self.truth(replacement, """
            document.readyState === 'complete' && location.pathname.includes('\(lab.route)')
            """)
        }
        let afterValue = try await replacement.evaluateJavaScript(checkpointScript)
        let after = try XCTUnwrap(afterValue as? String)
        attachText(after, name: "\(subject)-after-native-retry")
        XCTAssertEqual(after, before, "Native retry must retain every policy coefficient and ledger entry")
        guard after == before else { throw NSError(domain: "RobotNativeRetryCheckpoint", code: 1) }
        XCTAssertTrue(replacement.configuration.websiteDataStore === original.configuration.websiteDataStore)
        try await waitUntil("real saved policy replayed after native retry", timeout: 180) {
            try await self.truth(replacement, """
            (() => { const c = document.querySelector('[data-robot-stage-recovery] canvas');
              const gl = c?.getContext('webgl2') ?? c?.getContext('webgl');
              return gl && !gl.isContextLost() && document.body.textContent.includes('Recovered your') &&
                [...document.querySelectorAll('button')].some(b => !b.disabled &&
                  b.textContent.trim() === 'Keep learning · gen \(generation)'); })()
            """)
        }
        try await snapshot(replacement, name: "\(subject)-native-retry-restored-policy")
    }

    @MainActor
    private func verifyLearningActionLayout(_ web: WKWebView) async throws {
        // Exercise the real CSS with a learned (longer) button label. A wide
        // Mac window still gives this inspector a narrow containing column.
        let layouts = try await web.evaluateJavaScript("""
        (() => {
          const group = document.querySelector('[aria-label="Humanoid learning actions"]');
          if (!group) throw new Error('Missing real learning actions');
          const original = group.getAttribute('style');
          try {
            return JSON.stringify([280, 560].map(width => {
              group.style.width = width + 'px';
              group.style.maxWidth = 'none';
              const bounds = group.getBoundingClientRect();
              const buttons = [...group.querySelectorAll('button')];
              const frames = buttons.map(button => {
                const r = button.getBoundingClientRect();
                return { x: r.x, y: r.y, width: r.width, height: r.height,
                  right: r.right, bottom: r.bottom, label: button.textContent.trim() };
              });
              const contained = frames.every(r => r.x >= bounds.x - 1 && r.right <= bounds.right + 1 && r.height >= 44);
              const nonoverlapping = frames.every((a, i) => frames.slice(i + 1).every(b =>
                a.right <= b.x + 1 || b.right <= a.x + 1 || a.bottom <= b.y + 1 || b.bottom <= a.y + 1));
              const primaryFits = frames.length === 3 && (width < 400
                ? frames[0].width >= bounds.width - 1 && frames[1].y >= frames[0].bottom
                  && Math.abs(frames[1].y - frames[2].y) <= 1
                : frames.every(r => Math.abs(r.y - frames[0].y) <= 1));
              return { width, frames, passed: contained && nonoverlapping && primaryFits };
            }));
          } finally {
            if (original === null) group.removeAttribute('style');
            else group.setAttribute('style', original);
          }
        })()
        """)
        let json = try XCTUnwrap(layouts as? String)
        attachText(json, name: "g1-real-narrow-and-wide-learning-action-layouts")
        let rows = try XCTUnwrap(JSONSerialization.jsonObject(with: Data(json.utf8)) as? [[String: Any]])
        XCTAssertEqual(rows.count, 2)
        XCTAssertTrue(rows.allSatisfy { $0["passed"] as? Bool == true },
                      "Learning actions must fit, retain 44px targets, and never overlap: \(json)")
    }

    @MainActor
    private func loseAndRetry(_ web: WKWebView, name: String) async throws {
        let lost = try await truth(web, "window.__robotNativeRecoveryProbe.lose()")
        XCTAssertTrue(lost)
        try await waitUntil("actual context-loss recovery notice") {
            try await self.truth(web, "!!window.__robotNativeRecoveryProbe.button(/^Retry 3D view$/)")
        }
        try await snapshot(web, name: "\(name)-interrupted")
        try await click(web, matching: "^Retry 3D view$")
        try await waitUntil("new healthy native WebGL canvas") {
            try await self.truth(web, "window.__robotNativeRecoveryProbe.restored()")
        }
        try await snapshot(web, name: "\(name)-recovered")
    }

    @MainActor
    private func stopLearning(_ web: WKWebView) async throws {
        _ = try await web.evaluateJavaScript("""
        (() => {
          const b = [...document.querySelectorAll('button')].find(b => /^Stop · gen/.test(b.textContent.trim()));
          if (b && !b.disabled) b.click();
          return true;
        })()
        """)
        try await waitUntil("optimizer stop acknowledged", timeout: 90) {
            try await self.truth(web, """
            [...document.querySelectorAll('button')].some(b => !b.disabled && /^(Start learning|Keep learning · gen)/.test(b.textContent.trim()))
            """)
        }
    }

    @MainActor
    private func click(_ web: WKWebView, matching pattern: String) async throws {
        let clicked = try await truth(web, """
        (() => {
          const b = window.__robotNativeRecoveryProbe.button(/\(pattern)/);
          if (!b || b.disabled) return false;
          b.click(); return true;
        })()
        """)
        XCTAssertTrue(clicked, "Missing enabled control: \(pattern)")
        if !clicked { throw NSError(domain: "RobotGraphicsRecovery", code: 2) }
    }

    @MainActor
    private func checkpointText(_ web: WKWebView) async throws -> String {
        let value = try await web.evaluateJavaScript("window.__robotNativeRecoveryProbe.checkpoints()")
        return try XCTUnwrap(value as? String)
    }

    @MainActor
    private func generationNumber(_ web: WKWebView) async throws -> Int {
        let value = try await web.evaluateJavaScript("window.__robotNativeRecoveryProbe.generation()")
        return try XCTUnwrap(value as? NSNumber).intValue
    }

    @MainActor
    private func truth(_ web: WKWebView, _ script: String) async throws -> Bool {
        try await web.evaluateJavaScript("Boolean(\(script))") as? Bool == true
    }

    @MainActor
    private func waitUntil(_ label: String, timeout: TimeInterval = 45,
                           condition: @MainActor () async throws -> Bool) async throws {
        let deadline = Date().addingTimeInterval(timeout)
        while Date() < deadline {
            if try await condition() { return }
            try await Task.sleep(nanoseconds: 250_000_000)
        }
        XCTFail("Timed out waiting for \(label)")
        throw NSError(domain: "RobotGraphicsRecovery", code: 1,
                      userInfo: [NSLocalizedDescriptionKey: label])
    }

    @MainActor
    private func appWebView() -> WKWebView? {
        func find(in view: UIView) -> WKWebView? {
            if let web = view as? WKWebView { return web }
            return view.subviews.lazy.compactMap { find(in: $0) }.first
        }
        return UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
            .flatMap(\.windows).lazy.compactMap { find(in: $0) }.first
    }

    @MainActor
    private func snapshot(_ web: WKWebView, name: String) async throws {
        let geometry = try await web.evaluateJavaScript("""
        JSON.stringify([...document.querySelectorAll('[data-robot-stage-recovery] canvas')].map(c => ({
          canvas: c.getBoundingClientRect().toJSON(), backing: [c.width, c.height],
          viewport: [innerWidth, innerHeight],
          ancestors: [...(function* () { for (let p=c.parentElement; p; p=p.parentElement) yield p; })()]
            .map(p => ({tag:p.tagName, classes:p.className, rect:p.getBoundingClientRect().toJSON()}))
        })))
        """)
        if let geometry = geometry as? String { attachText(geometry, name: "\(name)-canvas-geometry") }
        let image = try await web.takeSnapshot(configuration: nil)
        let attachment = XCTAttachment(image: image)
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    private func attachText(_ text: String, name: String) {
        let attachment = XCTAttachment(string: text)
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
