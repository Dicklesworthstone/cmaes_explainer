import XCTest
import UIKit
import WebKit
@testable import FrankenRobots

final class RobotEngineBridgeTests: XCTestCase {
    func testAcceptedStopReceiptWaitsForOwnerReadyAndStaysCompleted() throws {
        for lab in ["humanoid", "arm"] {
            let acknowledgement = try XCTUnwrap(RobotEngineCommandAcknowledgement(payload: [
                "type": "engine.command.ack", "schemaVersion": 1, "sequence": 7,
                "commandId": "stop-receipt", "lab": lab, "command": "stop",
                "accepted": true, "detail": "Accepted Stop; finishing the current physical generation safely.",
            ]))
            var receipt = RobotEngineCommandReceipt(acknowledgement: acknowledgement)
            for phase: RobotEnginePhase in [.starting, .loading, .running, .failed("owner failed")] {
                receipt.receiveOwnerPhase(phase)
                XCTAssertEqual(receipt.detail, acknowledgement.detail)
            }
            receipt.receiveOwnerPhase(.ready)
            XCTAssertEqual(receipt.detail, "Stopped. Ready to continue learning.")
            receipt.receiveOwnerPhase(.running)
            XCTAssertEqual(receipt.detail, "Stopped. Ready to continue learning.",
                           "A later run must not resurrect a completed stop's pending message")
        }
    }

    func testOwnerReadyPreservesRejectedStopsOtherAcknowledgementsAndDeliveryErrors() throws {
        for (command, accepted, detail) in [
            ("stop", false, "No learning run is active."),
            ("optimize", true, "Accepted continuous learning."),
            ("pause", true, "Replay paused."),
        ] {
            let acknowledgement = try XCTUnwrap(RobotEngineCommandAcknowledgement(payload: [
                "type": "engine.command.ack", "schemaVersion": 1, "sequence": 7,
                "commandId": "preserved-receipt", "lab": "arm", "command": command,
                "accepted": accepted, "detail": detail,
            ]))
            var receipt = RobotEngineCommandReceipt(acknowledgement: acknowledgement)
            receipt.receiveOwnerPhase(.ready)
            XCTAssertEqual(receipt.detail, detail)
        }
        var failure = RobotEngineCommandReceipt.message("Native command delivery failed.")
        failure.receiveOwnerPhase(.ready)
        XCTAssertEqual(failure.detail, "Native command delivery failed.")
    }

    func testLabDownloadsOnlyAdmitTheCurrentPrivateEngineOrigin() throws {
        let base = try XCTUnwrap(URL(string: "http://127.0.0.1:43123"))
        let source = base.appendingPathComponent("robotics")
        for text in ["blob:http://127.0.0.1:43123/policy", "http://127.0.0.1:43123/policy.bin"] {
            XCTAssertTrue(RobotLabDownload.allowsDownload(try XCTUnwrap(URL(string: text)), sourceURL: source, baseURL: base))
        }
        for text in ["blob:http://127.0.0.1:43124/policy", "blob:null/policy",
                     "blob:https://example.com/policy", "file:///tmp/policy", "data:application/json,{}",
                     "http://127.0.0.1:43123@example.com/policy", "https://127.0.0.1:43123/policy"] {
            XCTAssertFalse(RobotLabDownload.allowsDownload(try XCTUnwrap(URL(string: text)), sourceURL: source, baseURL: base), text)
        }
        let blob = try XCTUnwrap(URL(string: "blob:http://127.0.0.1:43123/policy"))
        XCTAssertFalse(RobotLabDownload.allowsDownload(blob, sourceURL: nil, baseURL: base))
        XCTAssertFalse(RobotLabDownload.allowsDownload(blob, sourceURL: source, baseURL: nil))
        XCTAssertFalse(RobotLabDownload.allowsDownload(blob, sourceURL: URL(string: "https://example.com"), baseURL: base))
    }

    func testLabDownloadNamesCannotEscapeTheirPrivateDestination() {
        XCTAssertEqual(RobotLabDownload.safeFilename("g1-walking-gen10.policy.json"), "g1-walking-gen10.policy.json")
        XCTAssertEqual(RobotLabDownload.safeFilename("../../outside/policy.json"), "policy.json")
        XCTAssertEqual(RobotLabDownload.safeFilename("C:\\outside\\policy.bin"), "policy.bin")
        XCTAssertEqual(RobotLabDownload.safeFilename("policy\u{0}:10.json"), "policy-10.json")
        for name in ["", "..", ".", "/", "\n"] {
            XCTAssertEqual(RobotLabDownload.safeFilename(name), "FrankenRobots-export")
        }
    }

    func testLabDownloadDocumentPreservesBinaryAndJSONBytes() {
        // Includes non-UTF8 bytes and signed-zero/subnormal JSON spellings;
        // exports must never normalize these through a JSON decoder.
        for data in [Data([0, 255, 128, 10, 13]), Data("{\"policy\":[-0,1e-320]}\r\n".utf8)] {
            let download = RobotLabDownload(filename: "policy.bin", data: data)
            XCTAssertEqual(RobotLabDownloadDocument(data: download.data).data, data)
        }
    }

    func testClipboardAcceptsCompletePolicyLinksOnlyFromCurrentMainFrame() throws {
        let base = try XCTUnwrap(URL(string: "http://127.0.0.1:43123"))
        let source = base.appendingPathComponent("frankenrobots/humanoid/")
        let text = "https://cmaes-explainer.vercel.app/frankenrobots/humanoid/#zpolicy=" + String(repeating: "a", count: 60_000)
        XCTAssertEqual(RobotLabClipboard.text(text, isMainFrame: true, sourceURL: source, baseURL: base), text)
        XCTAssertEqual(RobotLabClipboard.text("", isMainFrame: true, sourceURL: source, baseURL: base), "")
        XCTAssertNil(RobotLabClipboard.text(text, isMainFrame: false, sourceURL: source, baseURL: base))
        XCTAssertNil(RobotLabClipboard.text(text, isMainFrame: true, sourceURL: nil, baseURL: base))
        XCTAssertNil(RobotLabClipboard.text(text, isMainFrame: true, sourceURL: source, baseURL: nil))
        for url in ["http://127.0.0.1:43124/", "https://example.com/", "file:///tmp/policy",
                    "http://127.0.0.1:43123@example.com/", "https://127.0.0.1:43123/"] {
            XCTAssertNil(RobotLabClipboard.text(text, isMainFrame: true, sourceURL: URL(string: url), baseURL: base), url)
        }
    }

    func testClipboardRejectsNonTextAndOversizedUTF8WithoutTruncation() throws {
        let base = try XCTUnwrap(URL(string: "http://127.0.0.1:43123"))
        let values: [Any] = [NSNull(), 1, ["text": "policy"],
                             String(repeating: "x", count: RobotLabClipboard.maximumBytes + 1),
                             String(repeating: "😀", count: RobotLabClipboard.maximumBytes / 4 + 1)]
        for value in values {
            XCTAssertNil(RobotLabClipboard.text(value, isMainFrame: true, sourceURL: base, baseURL: base))
        }
    }

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
    func testHumanoidOriginalPolicyAndTelemetryDownloadsPreserveBytesAndLearning() async throws {
        try await verifyOriginalDownloads(lab: .humanoid)
    }

    @MainActor
    func testArmOriginalPolicyAndTelemetryDownloadsPreserveBytesAndLearning() async throws {
        try await verifyOriginalDownloads(lab: .arm)
    }

    @MainActor
    private func verifyOriginalDownloads(lab: RobotLab) async throws {
        try XCTSkipUnless(ProcessInfo.processInfo.environment["FROBOTS_RUN_GRAPHICS_RECOVERY_TESTS"] == "1")
        try await waitUntil("app-hosted WKWebView") { self.appWebView() != nil }
        let parent = try XCTUnwrap(appWebView()?.superview)
        // A real host and live owner, without a SwiftUI subscriber consuming its
        // download queue. Native Save-dialog interaction has its own UI journey.
        let host = RobotEngineHost(initialLab: lab)
        let web = host.webView
        web.frame = parent.bounds
        parent.addSubview(web)
        defer { web.stopLoading(); web.removeFromSuperview() }
        try await waitUntil("real \(lab.rawValue) owner ready", timeout: 180) { host.phase == .ready }
        host.optimize()
        addTeardownBlock { @MainActor [weak web] in
            guard let web else { return }
            try? await self.stopLearning(web)
        }
        try await waitUntil("real learned export policy", timeout: 180) {
            host.phase == .running && (host.metrics.generation ?? -1) >= 2
        }
        try await stopLearning(web)
        try await waitUntil("stopped owner status reflected natively") { host.phase == .ready }
        let generation = try XCTUnwrap(host.metrics.generation)
        let subject = lab == .humanoid ? "g1" : "arm"
        let policyCount = lab == .humanoid ? 5_040 : 128
        try await waitUntil("learned export checkpoint persisted") {
            try await self.truth(web, """
            Object.keys(localStorage).filter(key => key.startsWith('cmaes.\(subject).') &&
              key.endsWith('.training-session.v2')).some(key => {
                const saved = JSON.parse(localStorage.getItem(key));
                return saved.generation === \(generation) && saved.policy.length === \(policyCount);
              })
            """)
        }
        if lab == .humanoid {
            // The embedded Humanoid lab intentionally starts with its stage
            // controls collapsed. Use its real disclosure before finding the
            // telemetry button; that button is not mounted until it opens.
            let revealed = try await truth(web, """
            (() => { const toggle = document.querySelector('button[aria-controls="g1-hud-controls"]');
              if (!toggle || toggle.disabled) return false;
              if (toggle.getAttribute('aria-expanded') !== 'true') toggle.click();
              return true; })()
            """)
            XCTAssertTrue(revealed, "The original Humanoid Controls disclosure must remain available")
            try await waitUntil("original Humanoid telemetry control mounted") {
                try await self.truth(web, """
                [...document.querySelectorAll('button')].some(b =>
                  (b.getAttribute('title') ?? '').includes('trajectory receipt as JSON') && !b.disabled)
                """)
            }
        }
        _ = try await web.evaluateJavaScript("""
        (() => {
          const original = URL.createObjectURL, click = HTMLAnchorElement.prototype.click;
          const blobs = new Map();
          const checkpoints = () => JSON.stringify(Object.keys(localStorage).sort()
            .filter(key => key.endsWith('.training-session.v2')).map(key => [key, localStorage.getItem(key)]));
          window.__robotDownloadProbe = { document, captures: [], original, click, checkpoints, saved: checkpoints() };
          URL.createObjectURL = function(blob) {
            const url = original.call(this, blob); blobs.set(url, blob); return url;
          };
          HTMLAnchorElement.prototype.click = function() {
            if (this.download && blobs.has(this.href)) {
              const row = { filename: this.download, base64: null };
              window.__robotDownloadProbe.captures.push(row);
              blobs.get(this.href).arrayBuffer().then(buffer => {
                let binary = ''; for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
                row.base64 = btoa(binary);
              });
            }
            return click.call(this);
          };
          return true;
        })()
        """)
        addTeardownBlock { @MainActor [weak web] in
            _ = try? await web?.evaluateJavaScript("""
            (() => { const p = window.__robotDownloadProbe; if (p) {
              URL.createObjectURL = p.original; HTMLAnchorElement.prototype.click = p.click;
              delete window.__robotDownloadProbe;
            } return true; })()
            """)
        }
        for selector in ["b.textContent.trim() === 'Download'",
                         "(b.getAttribute('title') ?? '').includes('trajectory receipt as JSON')"] {
            let clicked = try await truth(web, """
            (() => { const button = [...document.querySelectorAll('button')].find(b => \(selector));
              if (!button || button.disabled) return false; button.click(); return true; })()
            """)
            XCTAssertTrue(clicked, "The original lab export must remain available: \(selector)")
        }
        try await waitUntil("two original WebKit downloads", timeout: 45) {
            if let error = host.downloadError { throw NSError(domain: "LabDownload", code: 1, userInfo: [NSLocalizedDescriptionKey: error]) }
            return host.pendingDownloads.count == 2
        }
        try await waitUntil("unmodified original blob bytes captured") {
            try await self.truth(web, "window.__robotDownloadProbe.captures.length === 2 && window.__robotDownloadProbe.captures.every(row => row.base64 !== null)")
        }
        let capturedValue = try await web.evaluateJavaScript("window.__robotDownloadProbe.captures")
        let captures = try XCTUnwrap(capturedValue as? [[String: String]])
        for capture in captures {
            let filename = try XCTUnwrap(capture["filename"])
            let expected = try XCTUnwrap(Data(base64Encoded: try XCTUnwrap(capture["base64"])))
            let download = try XCTUnwrap(host.pendingDownloads.first { $0.filename == filename })
            XCTAssertEqual(download.data, expected, "Native download must preserve every original byte")
            XCTAssertGreaterThan(download.data.count, 0)
            attachText("\(filename): \(download.data.count) exact bytes, learned generation \(generation)", name: "\(lab.rawValue)-original-download")
        }
        let sameDocument = try await truth(web, "window.__robotDownloadProbe.document === document")
        XCTAssertTrue(sameDocument, "Export must not navigate away from the learning owner")
        let sameCheckpoint = try await truth(web, "window.__robotDownloadProbe.saved === window.__robotDownloadProbe.checkpoints()")
        XCTAssertTrue(sameCheckpoint, "Exports must not rewrite the saved learning state")
        XCTAssertEqual(host.metrics.generation, generation)
        XCTAssertEqual(host.phase, .ready)
        let first = try XCTUnwrap(host.pendingDownloads.first)
        host.finishDownloadExport(first.id)
        XCTAssertEqual(host.pendingDownloads.count, 1, "Completing one export must not discard another")
        XCTAssertNotEqual(host.pendingDownloads.first?.id, first.id)
        host.finishDownloadExport(first.id)
        XCTAssertEqual(host.pendingDownloads.count, 1, "Duplicate completion must not consume another export")
    }

    @MainActor
    func testReselectingCurrentLabPreservesLiveLearning() async throws {
        try XCTSkipUnless(ProcessInfo.processInfo.environment["FROBOTS_RUN_GRAPHICS_RECOVERY_TESTS"] == "1")
        try await waitUntil("app-hosted WKWebView") { self.appWebView() != nil }
        NotificationCenter.default.post(name: .selectRobotLab, object: RobotLab.arm)
        try await waitUntil("Arm navigation") {
            self.appWebView()?.url?.absoluteString.contains(RobotLab.arm.route) == true
        }
        let web = try XCTUnwrap(appWebView())
        let host = try XCTUnwrap(web.navigationDelegate as? RobotEngineHost)
        try await waitUntil("real Arm owner ready", timeout: 180) { host.phase == .ready }
        XCTAssertTrue(host.supportsOptimize)
        host.optimize()
        addTeardownBlock { @MainActor [weak web] in
            guard let web else { return }
            try? await self.stopLearning(web)
        }
        try await waitUntil("live owner learning", timeout: 180) {
            host.phase == .running && (host.metrics.generation ?? -1) >= 2
        }
        let generation = try XCTUnwrap(host.metrics.generation)
        _ = try await web.evaluateJavaScript("window.__robotSelectionDocument = document; true")
        host.select(.arm)
        XCTAssertEqual(host.phase, .running, "Reselecting the current lab must not restart its engine")
        XCTAssertGreaterThanOrEqual(host.metrics.generation ?? -1, generation)
        guard host.phase == .running else { return }
        try await waitUntil("same optimizer continues after reselection", timeout: 180) {
            host.phase == .running && (host.metrics.generation ?? -1) > generation
        }
        let sameDocument = try await truth(web, "window.__robotSelectionDocument === document")
        XCTAssertTrue(sameDocument, "Reselection must preserve the document and its live worker")
        try await stopLearning(web)
        try await snapshot(web, name: "reselected-arm-keeps-live-learning")
    }

    @MainActor
    func testArmGraspFocusAtFinalOwnerSample() async throws {
        try XCTSkipUnless(ProcessInfo.processInfo.environment["FROBOTS_RUN_GRAPHICS_RECOVERY_TESTS"] == "1")
        try await waitUntil("app-hosted WKWebView") { self.appWebView() != nil }
        try await observeOwnerTransitions(XCTUnwrap(appWebView()))
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
            try await attachOwnerTransitions(web, name: "arm-close-up-\(frame)-owner-transitions")
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
    func testArmPublishesReadyOnlyAfterSavedPolicyRecovery() async throws {
        try await verifySavedPolicyReadiness(lab: .arm, subject: "arm", policyCount: 128)
    }

    @MainActor
    func testHumanoidPublishesReadyOnlyAfterSavedPolicyRecovery() async throws {
        try await verifySavedPolicyReadiness(lab: .humanoid, subject: "g1", policyCount: 5_040)
    }

    @MainActor
    private func verifySavedPolicyReadiness(lab: RobotLab, subject: String, policyCount: Int) async throws {
        // Create the checkpoint with the real optimizer and first prove that it
        // survives both graphics loss and native WebView replacement.
        try await verifyRecovery(lab: lab, subject: subject, policyCount: policyCount)
        let web = try XCTUnwrap(appWebView())
        try await observeOwnerTransitions(web)
        _ = web.reload()
        try await waitUntil("saved \(subject) policy restored after reload", timeout: 180) {
            try await self.truth(web, """
            location.pathname.includes('\(lab.route)') &&
            document.body.textContent.includes('Recovered your') &&
            [...document.querySelectorAll('button')].some(b => !b.disabled && /^Keep learning · gen/.test(b.textContent.trim())) &&
            window.__robotOwnerTransitions?.events.some(e => e.kind === 'trace' && e.generation > 0)
            """)
        }
        try await attachOwnerTransitions(web, name: "\(subject)-restoration-readiness")
        let readyOnlyAfterRestore = try await truth(web, """
        (() => {
          const ready = window.__robotOwnerTransitions.events.filter(e => e.message?.type === 'engine.status' && e.message.state === 'ready');
          return ready.length > 0 && ready.every(e => e.message.metrics.generation > 0);
        })()
        """)
        XCTAssertTrue(readyOnlyAfterRestore, "Saved-policy recovery must finish before advertising an interactive generation-zero curriculum")
    }

    @MainActor
    func testArmRejectedSavedPolicyKeepsVerifiedCurriculumUsable() async throws {
        try await verifyRejectedSavedPolicy(lab: .arm, subject: "arm", policyCount: 128)
    }

    @MainActor
    func testHumanoidRejectedSavedPolicyKeepsVerifiedCurriculumUsable() async throws {
        try await verifyRejectedSavedPolicy(lab: .humanoid, subject: "g1", policyCount: 5_040)
    }

    @MainActor
    private func verifyRejectedSavedPolicy(lab: RobotLab, subject: String, policyCount: Int) async throws {
        try await verifyRecovery(lab: lab, subject: subject, policyCount: policyCount)
        let web = try XCTUnwrap(appWebView())
        // Negative input in this test host's private data store: retain the real
        // learned coefficients but declare an incompatible owner revision.
        let value = try await web.evaluateJavaScript("""
        (() => {
          const candidates = Object.keys(localStorage)
            .filter(k => k.startsWith('cmaes.\(subject).') && k.endsWith('.training-session.v2'))
            .map(key => ({key, before: localStorage.getItem(key), saved: JSON.parse(localStorage.getItem(key))}))
            .filter(row => row.saved.generation > 0 && row.saved.experiment)
            .sort((a, b) => b.saved.savedAt - a.saved.savedAt);
          if (!candidates.length) throw new Error('No real learned \(subject) checkpoint');
          const row = candidates[0];
          row.saved.experiment.ownerSourceRevision = '0'.repeat(40);
          const rejected = JSON.stringify(row.saved);
          localStorage.setItem(row.key, rejected);
          return JSON.stringify({key: row.key, before: row.before, rejected});
        })()
        """)
        let archive = try XCTUnwrap(value as? String)
        addTeardownBlock { @MainActor [weak web] in
            _ = try? await web?.evaluateJavaScript("(() => { const row = \(archive); localStorage.setItem(row.key, row.before); return true; })()")
        }
        _ = web.reload()
        try await waitUntil("rejected archive leaves a usable verified curriculum", timeout: 180) {
            try await self.truth(web, """
            (() => {
              const c = document.querySelector('[data-robot-stage-recovery] canvas');
              const gl = c?.getContext('webgl2') ?? c?.getContext('webgl');
              return location.pathname.includes('\(lab.route)') && gl && !gl.isContextLost() &&
                document.body.textContent.includes('This exact experiment requires a different owner artifact.') &&
                [...document.querySelectorAll('button')].some(b => !b.disabled && /^Start learning$/.test(b.textContent.trim()));
            })()
            """)
        }
        let preserved = try await truth(web, "(() => { const row = \(archive); return localStorage.getItem(row.key) === row.rejected; })()")
        XCTAssertTrue(preserved, "A refused saved experiment must not be overwritten by the fallback curriculum")
        try await snapshot(web, name: "\(subject)-rejected-policy-verified-curriculum")
    }

    @MainActor
    func testNonDefaultHumanoidRetainsLearningAcrossNativeRetry() async throws {
        try await verifyRecovery(lab: .humanoid, subject: "g1", policyCount: 5_040, nonDefault: true)
    }

    @MainActor
    func testNonDefaultArmRetainsLearningAcrossNativeRetry() async throws {
        try await verifyRecovery(lab: .arm, subject: "arm", policyCount: 128, nonDefault: true)
    }

    @MainActor
    private func verifyRecovery(lab: RobotLab, subject: String, policyCount: Int,
                                nonDefault: Bool = false) async throws {
        try XCTSkipUnless(
            ProcessInfo.processInfo.environment["FROBOTS_RUN_GRAPHICS_RECOVERY_TESTS"] == "1",
            "Requires explicit native graphics test opt-in and Simulator audio preflight."
        )
        try await waitUntil("app-hosted WKWebView") { self.appWebView() != nil }
        try await observeOwnerTransitions(XCTUnwrap(appWebView()))
        NotificationCenter.default.post(name: .selectRobotLab, object: lab)
        try await waitUntil("selected lab navigation") {
            self.appWebView()?.url?.absoluteString.contains(lab.route) == true
        }
        let web = try XCTUnwrap(appWebView())
        do {
            try await waitUntil("real owner and stage ready", timeout: 180) {
                try await self.truth(web, """
                (() => {
                  // WKWebView.url can change before its predecessor document
                  // is replaced. Never install probes into the outgoing lab.
                  if (location.pathname !== '\(lab.route)' || document.readyState !== 'complete') return false;
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
            if nonDefault {
                try await selectNonDefaultExperiment(web, lab: lab)
            }
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
            try await verifyNativeRetry(web, lab: lab, subject: subject,
                                        generation: finalGeneration, nonDefault: nonDefault)
        } catch {
            try? await snapshot(web, name: "\(subject)-failure")
            try? await stopLearning(web)
            throw error
        }
    }

    @MainActor
    private func verifyNativeRetry(_ original: WKWebView, lab: RobotLab,
                                   subject: String, generation: Int, nonDefault: Bool) async throws {
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
        if nonDefault {
            try await waitUntil("replacement owner ready for selection check", timeout: 180) {
                try await self.truth(replacement, """
                [...document.querySelectorAll('button')].some(b => !b.disabled &&
                  /^(Start learning|Keep learning · gen)/.test(b.textContent.trim()))
                """)
            }
            let selected = try await truth(replacement, nonDefaultSelectionScript(lab))
            try await snapshot(replacement, name: "\(subject)-native-retry-selected-experiment")
            XCTAssertTrue(selected, "Native retry must reopen the learned non-default experiment")
            guard selected else { throw NSError(domain: "RobotNativeNonDefaultSelection", code: 2) }
        }
        try await waitUntil("real saved policy replayed after native retry", timeout: 180) {
            try await self.truth(replacement, """
            (() => { const c = document.querySelector('[data-robot-stage-recovery] canvas');
              const gl = c?.getContext('webgl2') ?? c?.getContext('webgl');
              return gl && !gl.isContextLost() && document.body.textContent.includes('Recovered your') &&
                [...document.querySelectorAll('button')].some(b => !b.disabled &&
                  b.textContent.trim() === 'Keep learning · gen \(generation)'); })()
            """)
        }
        if lab == .humanoid {
            try await verifyRigNoticeLayout(replacement)
        }
        try await snapshot(replacement, name: "\(subject)-native-retry-restored-policy")
    }

    private func nonDefaultSelectionScript(_ lab: RobotLab) -> String {
        if lab == .arm {
            return """
            [...document.querySelectorAll('[role="tab"][aria-selected="true"]')]
              .some(b => b.textContent.trim().startsWith('Remote'))
            """
        }
        return """
        [...document.querySelectorAll('[role="radio"][aria-checked="true"]')]
          .some(b => b.textContent.trim() === 'Balance') &&
        [...document.querySelectorAll('[role="radio"][aria-checked="true"]')]
          .some(b => b.textContent.trim() === 'Terrain + push')
        """
    }

    @MainActor
    private func selectNonDefaultExperiment(_ web: WKWebView, lab: RobotLab) async throws {
        // Arm tabs include an additional screen-reader description after the title.
        let choices = lab == .arm ? ["^Remote"] : ["^Balance$", "^Terrain \\+ push$"]
        for choice in choices {
            try await click(web, matching: choice)
            try await waitUntil("selected non-default owner ready", timeout: 180) {
                try await self.truth(web, """
                (() => {
                  const choice = window.__robotNativeRecoveryProbe.button(/\(choice)/);
                  return (choice?.getAttribute('aria-checked') === 'true' ||
                    choice?.getAttribute('aria-selected') === 'true') &&
                    [...document.querySelectorAll('button')].some(b => !b.disabled &&
                      /^(Start learning|Keep learning · gen)/.test(b.textContent.trim()));
                })()
                """)
            }
        }
        let selected = try await truth(web, nonDefaultSelectionScript(lab))
        XCTAssertTrue(selected, "Regression must train a real non-default experiment")
        guard selected else { throw NSError(domain: "RobotNativeNonDefaultSelection", code: 1) }
    }

    @MainActor
    private func verifyRigNoticeLayout(_ web: WKWebView) async throws {
        let noticeLayout = try await web.evaluateJavaScript("""
        (() => {
          const canvas = document.querySelector('[data-robot-stage-recovery] canvas');
          const notice = [...document.querySelectorAll('[role="status"]')].find(e =>
            e.textContent.trim().startsWith('Real Unitree G1 rig ready'));
          if (!canvas || !notice) throw new Error('Missing recovered G1 canvas or rig notice');
          const c = canvas.getBoundingClientRect(), n = notice.getBoundingClientRect();
          const text = notice.querySelector('span').getBoundingClientRect();
          return JSON.stringify({ canvasTop: c.top, noticeTop: n.top,
            canvasLeft: c.left, canvasRight: c.right, textLeft: text.left, textRight: text.right,
            passed: n.top >= c.top && n.top <= c.top + 16 &&
              text.left >= c.left && text.right <= c.right });
        })()
        """)
        let json = try XCTUnwrap(noticeLayout as? String)
        attachText(json, name: "g1-recovered-rig-notice-layout")
        let layout = try XCTUnwrap(JSONSerialization.jsonObject(with: Data(json.utf8)) as? [String: Any])
        XCTAssertEqual(layout["passed"] as? Bool, true,
                       "Embedded rig notice must stay at the canvas top without horizontal overflow: \(json)")
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
        try await attachOwnerTransitions(web, name: "before-control-\(pattern)")
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

    /// Observation only: retain the real worker, bridge and all acceptance predicates.
    /// WKWebView.url can describe a provisional navigation while JavaScript still
    /// executes in its predecessor, so capture both identities at each command.
    @MainActor
    private func observeOwnerTransitions(_ web: WKWebView) async throws {
        let source = """
        (() => {
          if (window.__robotOwnerTransitions) return true;
          const events = [];
          const record = (kind, data) => {
            events.push({time: performance.now(), kind, url: location.href, ...data});
            if (events.length > 512) events.shift();
          };
          const NativeWorker = window.Worker;
          const ObservedWorker = class extends NativeWorker {
            constructor(...args) {
              super(...args);
              this.addEventListener('message', event => {
                const m = event.data;
                if (m?.type === 'trace') record('trace', {
                  generation: m.generation, family: m.family,
                  task: m.admission?.config?.task, continuing: m.continuing
                });
              });
            }
          };
          window.Worker = ObservedWorker;
          const bridge = window.webkit?.messageHandlers?.frankenrobots;
          const post = bridge?.postMessage;
          const observedPost = function(message) {
            record('bridge', {message});
            return post.call(this, message);
          };
          if (post) bridge.postMessage = observedPost;
          window.__robotOwnerTransitions = {events, restore: () => {
            if (window.Worker === ObservedWorker) window.Worker = NativeWorker;
            if (bridge?.postMessage === observedPost) bridge.postMessage = post;
          }};
          record('installed', {});
          return true;
        })()
        """
        let script = WKUserScript(source: source, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        let controller = web.configuration.userContentController
        controller.addUserScript(script)
        _ = try await web.evaluateJavaScript(source)
        addTeardownBlock { @MainActor [weak web] in
            if let web {
                try? await self.attachOwnerTransitions(web, name: "final-owner-transitions")
                _ = try? await web.evaluateJavaScript("window.__robotOwnerTransitions?.restore(); delete window.__robotOwnerTransitions; true")
            }
            let retained = controller.userScripts.filter { $0 !== script }
            controller.removeAllUserScripts()
            retained.forEach { controller.addUserScript($0) }
        }
    }

    @MainActor
    private func attachOwnerTransitions(_ web: WKWebView, name: String) async throws {
        let value = try await web.evaluateJavaScript("""
        JSON.stringify({url: location.href, readyState: document.readyState,
          position: document.querySelector('input[aria-label="Arm trace position"]')?.value,
          buttons: [...document.querySelectorAll('button')].map(b => ({
            text: b.textContent.trim(), label: b.getAttribute('aria-label'), disabled: b.disabled
          })), events: window.__robotOwnerTransitions?.events ?? []})
        """)
        let json = try XCTUnwrap(value as? String)
        attachText("WKWebView URL: \(web.url?.absoluteString ?? "nil")\n\(json)", name: name)
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
