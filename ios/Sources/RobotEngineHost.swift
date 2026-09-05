import SwiftUI
import UIKit
import WebKit
import CoreFoundation

enum RobotLocomotionTask: String, Codable, CaseIterable, Identifiable {
    case balance
    case stepping
    case walking

    var id: String { rawValue }

    var title: String {
        switch self {
        case .balance: "Balance"
        case .stepping: "Step"
        case .walking: "Walk"
        }
    }
}

enum RobotManipulationTask: String, Codable, CaseIterable, Identifiable {
    case kitchenMug = "kitchen-mug"
    case livingRoomRemote = "living-room-remote"
    case backyardTrowel = "backyard-trowel"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .kitchenMug: "Mug"
        case .livingRoomRemote: "Remote"
        case .backyardTrowel: "Trowel"
        }
    }
}

enum RobotChallenge: String, Codable, CaseIterable, Identifiable {
    case flat
    case terrainAndPush = "terrain-and-push"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .flat: "Flat ground"
        case .terrainAndPush: "Terrain + push"
        }
    }
}

enum RobotOptimizerFamily: String, Codable, CaseIterable, Identifiable {
    case full
    case separable
    case lmCMA = "lm-cma"
    case lmMA = "lm-ma"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .full: "Full CMA-ES"
        case .separable: "Separable CMA-ES"
        case .lmCMA: "LM-CMA"
        case .lmMA: "LM-MA"
        }
    }

    static var scalableCases: [Self] { [.separable, .lmCMA, .lmMA] }
}

enum RobotCameraMode: String, Codable, CaseIterable, Identifiable {
    case orbit
    case follow
    case pov
    case blueprint
    case studio
    case microscope
    case overhead
    case side
    case front
    case fly

    var id: String { rawValue }

    var title: String {
        switch self {
        case .orbit: "Orbit"
        case .follow: "Follow"
        case .pov: "POV"
        case .blueprint: "Map"
        case .studio: "Studio"
        case .microscope: "Grasp Focus"
        case .overhead: "Top"
        case .side: "Side"
        case .front: "Front"
        case .fly: "Free-fly"
        }
    }

    static func available(for lab: RobotLab) -> [Self] {
        switch lab {
        case .humanoid: [.orbit, .follow, .pov, .blueprint, .fly]
        case .arm: [.studio, .microscope, .overhead, .side, .front, .fly]
        }
    }
}

enum RobotPlaybackSpeed: Double, Codable, CaseIterable, Identifiable {
    case quarter = 0.25
    case half = 0.5
    case normal = 1
    case double = 2

    var id: Double { rawValue }
    var title: String { rawValue.formatted(.number.precision(.fractionLength(0...2))) + "×" }
}

enum RobotReceiptLens: String, CaseIterable, Identifiable {
    case baseline = "owner-receipt"
    case cautious = "cautious-monk"
    case sprinter = "olympic-sprinter"
    case glassFloor = "glass-floor"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .baseline: "Documented Baseline"
        case .cautious: "Cautious Monk"
        case .sprinter: "Olympic Sprinter"
        case .glassFloor: "Glass-Floor Walker"
        }
    }
}

enum RobotOverlayMode: String, CaseIterable, Identifiable {
    case xray
    case physicsDebug = "physics-debug"
    case frictionCones = "friction-cones"

    var id: String { rawValue }

    var title: String {
        switch self {
        case .xray: "Biomechanics X-Ray"
        case .physicsDebug: "Physics Envelopes"
        case .frictionCones: "Friction Cones"
        }
    }

    static func available(for lab: RobotLab) -> [RobotOverlayMode] {
        switch lab {
        case .humanoid: [.xray, .physicsDebug]
        case .arm: [.frictionCones, .physicsDebug]
        }
    }
}

struct RobotEngineMetrics: Codable, Equatable {
    static let empty = RobotEngineMetrics()

    var generation: Int?
    var bestObjective: Double?
    var completedSteps: Int?
    var placed: Bool?
    var bodyPenetrationMeters: Double?
    var certifiedClearanceMeters: Double?
    var collisionRiskIntegral: Double?
    var possibleCollisionTimeSeconds: Double?
    var activeTask: RobotLocomotionTask?
    var activeArmTask: RobotManipulationTask?
    var activeChallenge: RobotChallenge?
    var activeFamily: RobotOptimizerFamily?

    var isEmpty: Bool {
        generation == nil && bestObjective == nil && completedSteps == nil && placed == nil &&
            bodyPenetrationMeters == nil && certifiedClearanceMeters == nil &&
            collisionRiskIntegral == nil && possibleCollisionTimeSeconds == nil && activeTask == nil &&
            activeArmTask == nil && activeChallenge == nil && activeFamily == nil
    }

    init(
        generation: Int? = nil,
        bestObjective: Double? = nil,
        completedSteps: Int? = nil,
        placed: Bool? = nil,
        bodyPenetrationMeters: Double? = nil,
        certifiedClearanceMeters: Double? = nil,
        collisionRiskIntegral: Double? = nil,
        possibleCollisionTimeSeconds: Double? = nil,
        activeTask: RobotLocomotionTask? = nil,
        activeArmTask: RobotManipulationTask? = nil,
        activeChallenge: RobotChallenge? = nil,
        activeFamily: RobotOptimizerFamily? = nil
    ) {
        self.generation = generation
        self.bestObjective = bestObjective
        self.completedSteps = completedSteps
        self.placed = placed
        self.bodyPenetrationMeters = bodyPenetrationMeters
        self.certifiedClearanceMeters = certifiedClearanceMeters
        self.collisionRiskIntegral = collisionRiskIntegral
        self.possibleCollisionTimeSeconds = possibleCollisionTimeSeconds
        self.activeTask = activeTask
        self.activeArmTask = activeArmTask
        self.activeChallenge = activeChallenge
        self.activeFamily = activeFamily
    }

    init?(payload: [String: Any]) {
        guard Self.hasValidOptionalInteger(payload, key: "generation"),
              Self.hasValidOptionalNumber(payload, key: "bestObjective"),
              Self.hasValidOptionalInteger(payload, key: "completedSteps"),
              Self.hasValidOptionalBool(payload, key: "placed"),
              Self.hasValidOptionalNonnegativeNumber(payload, key: "bodyPenetrationMeters"),
              Self.hasValidOptionalNonnegativeNumber(payload, key: "certifiedClearanceMeters"),
              Self.hasValidOptionalNonnegativeNumber(payload, key: "collisionRiskIntegral"),
              Self.hasValidOptionalNonnegativeNumber(payload, key: "possibleCollisionTimeSeconds"),
              Self.hasValidOptionalTask(payload, key: "activeTask"),
              Self.hasValidOptionalArmTask(payload, key: "activeArmTask"),
              Self.hasValidOptionalChallenge(payload, key: "activeChallenge"),
              Self.hasValidOptionalFamily(payload, key: "activeFamily") else {
            return nil
        }

        generation = Self.integer(payload["generation"])
        bestObjective = Self.finiteDouble(payload["bestObjective"])
        completedSteps = Self.integer(payload["completedSteps"])
        placed = payload["placed"] as? Bool
        bodyPenetrationMeters = Self.finiteDouble(payload["bodyPenetrationMeters"])
        certifiedClearanceMeters = Self.finiteDouble(payload["certifiedClearanceMeters"])
        collisionRiskIntegral = Self.finiteDouble(payload["collisionRiskIntegral"])
        possibleCollisionTimeSeconds = Self.finiteDouble(payload["possibleCollisionTimeSeconds"])
        activeTask = (payload["activeTask"] as? String).flatMap(RobotLocomotionTask.init(rawValue:))
        activeArmTask = (payload["activeArmTask"] as? String).flatMap(RobotManipulationTask.init(rawValue:))
        activeChallenge = (payload["activeChallenge"] as? String).flatMap(RobotChallenge.init(rawValue:))
        activeFamily = (payload["activeFamily"] as? String).flatMap(RobotOptimizerFamily.init(rawValue:))
        guard generation.map({ $0 >= 0 }) ?? true,
              completedSteps.map({ $0 >= 0 }) ?? true else {
            return nil
        }
    }

    private static func hasValidOptionalInteger(_ payload: [String: Any], key: String) -> Bool {
        guard let value = payload[key], !(value is NSNull) else { return true }
        guard let value = integer(value) else { return false }
        return value >= 0
    }

    private static func hasValidOptionalNumber(_ payload: [String: Any], key: String) -> Bool {
        guard let value = payload[key], !(value is NSNull) else { return true }
        return finiteDouble(value) != nil
    }

    private static func hasValidOptionalNonnegativeNumber(_ payload: [String: Any], key: String) -> Bool {
        guard let value = payload[key], !(value is NSNull) else { return true }
        guard let value = finiteDouble(value) else { return false }
        return value >= 0
    }

    private static func hasValidOptionalBool(_ payload: [String: Any], key: String) -> Bool {
        guard let value = payload[key], !(value is NSNull) else { return true }
        return value is Bool
    }

    private static func hasValidOptionalTask(_ payload: [String: Any], key: String) -> Bool {
        guard let value = payload[key], !(value is NSNull) else { return true }
        guard let value = value as? String else { return false }
        return RobotLocomotionTask(rawValue: value) != nil
    }

    private static func hasValidOptionalArmTask(_ payload: [String: Any], key: String) -> Bool {
        guard let value = payload[key], !(value is NSNull) else { return true }
        guard let value = value as? String else { return false }
        return RobotManipulationTask(rawValue: value) != nil
    }

    private static func hasValidOptionalChallenge(_ payload: [String: Any], key: String) -> Bool {
        guard let value = payload[key], !(value is NSNull) else { return true }
        guard let value = value as? String else { return false }
        return RobotChallenge(rawValue: value) != nil
    }

    private static func hasValidOptionalFamily(_ payload: [String: Any], key: String) -> Bool {
        guard let value = payload[key], !(value is NSNull) else { return true }
        guard let value = value as? String else { return false }
        return RobotOptimizerFamily(rawValue: value) != nil
    }

    private static func finiteDouble(_ value: Any?) -> Double? {
        guard let number = value as? NSNumber,
              CFGetTypeID(number) != CFBooleanGetTypeID() else {
            return nil
        }
        let value = number.doubleValue
        return value.isFinite ? value : nil
    }

    private static func integer(_ value: Any?) -> Int? {
        guard let value = finiteDouble(value),
              value.rounded(.towardZero) == value,
              value >= Double(Int.min),
              value <= Double(Int.max) else {
            return nil
        }
        return Int(value)
    }
}

struct RobotEngineStatusMessage {
    static let schemaVersion = 1

    let sequence: Int
    let lab: RobotLab
    let state: String
    let detail: String
    let metrics: RobotEngineMetrics
    let capabilities: Set<String>

    init?(payload: [String: Any]) {
        let rawCapabilities: [String]
        if let candidate = payload["capabilities"] {
            guard let capabilities = candidate as? [String] else { return nil }
            rawCapabilities = capabilities
        } else {
            rawCapabilities = []
        }
        guard payload["type"] as? String == "engine.status",
              let schemaVersion = Self.integer(payload["schemaVersion"]),
              schemaVersion == Self.schemaVersion,
              let sequence = Self.integer(payload["sequence"]), sequence > 0,
              let rawLab = payload["lab"] as? String,
              let lab = RobotLab(rawValue: rawLab),
              let state = payload["state"] as? String,
              ["loading", "ready", "running", "failed"].contains(state),
              let detail = payload["detail"] as? String,
              !detail.isEmpty,
              detail.count <= 300,
              let rawMetrics = payload["metrics"] as? [String: Any],
              let metrics = RobotEngineMetrics(payload: rawMetrics) else {
            return nil
        }
        let allowedCapabilities: Set<String> = lab == .humanoid
            ? [
                "optimize", "select-task", "select-challenge", "select-family", "replay",
                "playback", "seek", "set-speed", "set-camera", "select-receipt-lens",
                "set-overlay"
            ]
            : [
                "optimize", "select-task", "select-family", "replay", "playback", "seek",
                "set-speed", "set-camera", "set-overlay"
            ]
        guard Set(rawCapabilities).isSubset(of: allowedCapabilities) else { return nil }
        switch lab {
        case .humanoid:
            guard metrics.activeArmTask == nil,
                  metrics.activeFamily != .full else { return nil }
        case .arm:
            guard metrics.activeTask == nil,
                  metrics.activeChallenge == nil else { return nil }
        }
        self.sequence = sequence
        self.lab = lab
        self.state = state
        self.detail = detail
        self.metrics = metrics
        capabilities = Set(rawCapabilities)
    }

    private static func integer(_ value: Any?) -> Int? {
        guard let number = value as? NSNumber,
              CFGetTypeID(number) != CFBooleanGetTypeID() else {
            return nil
        }
        let value = number.doubleValue
        guard value.isFinite,
              value.rounded(.towardZero) == value,
              value >= Double(Int.min),
              value <= Double(Int.max) else {
            return nil
        }
        return Int(value)
    }
}

struct RobotTraceStateMessage {
    static let schemaVersion = 1

    let sequence: Int
    let lab: RobotLab
    let sampleIndex: Int
    let sampleCount: Int
    let playing: Bool
    let speed: RobotPlaybackSpeed
    let camera: RobotCameraMode
    let receiptLens: RobotReceiptLens?
    let overlays: Set<RobotOverlayMode>

    init?(payload: [String: Any]) {
        guard payload["type"] as? String == "trace.state",
              let schemaVersion = Self.integer(payload["schemaVersion"]),
              schemaVersion == Self.schemaVersion,
              let sequence = Self.integer(payload["sequence"]), sequence > 0,
              let rawLab = payload["lab"] as? String,
              let lab = RobotLab(rawValue: rawLab),
              let sampleIndex = Self.integer(payload["sampleIndex"]), sampleIndex >= 0,
              let sampleCount = Self.integer(payload["sampleCount"]), sampleCount >= 0,
              (sampleCount == 0 && sampleIndex == 0) || sampleIndex < sampleCount,
              let playing = payload["playing"] as? Bool,
              !playing || sampleCount > 0,
              let rawSpeed = Self.finiteDouble(payload["speed"]),
              let speed = RobotPlaybackSpeed(rawValue: rawSpeed),
              let rawCamera = payload["camera"] as? String,
              let camera = RobotCameraMode(rawValue: rawCamera),
              RobotCameraMode.available(for: lab).contains(camera) else {
            return nil
        }
        let rawOverlays: [String]
        if let candidate = payload["overlays"] {
            guard let values = candidate as? [String] else { return nil }
            rawOverlays = values
        } else {
            rawOverlays = []
        }
        let overlays = rawOverlays.compactMap(RobotOverlayMode.init(rawValue:))
        guard overlays.count == rawOverlays.count,
              Set(overlays).count == overlays.count,
              Set(overlays).isSubset(of: Set(RobotOverlayMode.available(for: lab))) else { return nil }
        let receiptLens: RobotReceiptLens?
        if let rawLens = payload["receiptLens"] {
            guard lab == .humanoid,
                  let rawLens = rawLens as? String,
                  let lens = RobotReceiptLens(rawValue: rawLens) else { return nil }
            receiptLens = lens
        } else {
            receiptLens = nil
        }
        self.sequence = sequence
        self.lab = lab
        self.sampleIndex = sampleIndex
        self.sampleCount = sampleCount
        self.playing = playing
        self.speed = speed
        self.camera = camera
        self.receiptLens = receiptLens
        self.overlays = Set(overlays)
    }

    private static func integer(_ value: Any?) -> Int? {
        guard let value = finiteDouble(value),
              value.rounded(.towardZero) == value,
              value >= Double(Int.min),
              value <= Double(Int.max) else { return nil }
        return Int(value)
    }

    private static func finiteDouble(_ value: Any?) -> Double? {
        guard let number = value as? NSNumber,
              CFGetTypeID(number) != CFBooleanGetTypeID() else { return nil }
        let value = number.doubleValue
        return value.isFinite ? value : nil
    }
}

struct RobotEngineCommandAcknowledgement {
    static let schemaVersion = 1

    let sequence: Int
    let commandID: String
    let lab: RobotLab
    let command: String
    let accepted: Bool
    let detail: String
    let task: RobotLocomotionTask?
    let armTask: RobotManipulationTask?
    let challenge: RobotChallenge?
    let family: RobotOptimizerFamily?
    let sampleIndex: Int?
    let speed: RobotPlaybackSpeed?
    let camera: RobotCameraMode?
    let receiptLens: RobotReceiptLens?
    let overlay: RobotOverlayMode?
    let overlayEnabled: Bool?

    init?(payload: [String: Any]) {
        guard payload["type"] as? String == "engine.command.ack",
              let schemaVersion = Self.integer(payload["schemaVersion"]),
              schemaVersion == Self.schemaVersion,
              let sequence = Self.integer(payload["sequence"]), sequence > 0,
              let commandID = payload["commandId"] as? String,
              commandID.range(of: #"^[A-Za-z0-9._-]{1,80}$"#, options: .regularExpression) != nil,
              let rawLab = payload["lab"] as? String,
              let lab = RobotLab(rawValue: rawLab),
              let command = payload["command"] as? String,
              [
                "optimize", "stop", "select-task", "select-challenge", "select-family", "replay",
                "play", "pause", "seek", "set-speed", "set-camera", "select-receipt-lens",
                "set-overlay"
              ].contains(command),
              let accepted = payload["accepted"] as? Bool,
              let detail = payload["detail"] as? String,
              !detail.isEmpty,
              detail.count <= 300 else {
            return nil
        }
        var task: RobotLocomotionTask?
        var armTask: RobotManipulationTask?
        var challenge: RobotChallenge?
        var family: RobotOptimizerFamily?
        var sampleIndex: Int?
        var speed: RobotPlaybackSpeed?
        var camera: RobotCameraMode?
        var receiptLens: RobotReceiptLens?
        var overlay: RobotOverlayMode?
        var overlayEnabled: Bool?
        if command == "select-task" {
            guard let rawTask = payload["task"] as? String,
                  payload["challenge"] == nil,
                  payload["family"] == nil,
                  payload["sampleIndex"] == nil,
                  payload["speed"] == nil,
                  payload["camera"] == nil,
                  payload["receiptLens"] == nil,
                  payload["overlay"] == nil,
                  payload["enabled"] == nil else { return nil }
            switch lab {
            case .humanoid:
                guard let selection = RobotLocomotionTask(rawValue: rawTask) else { return nil }
                task = selection
            case .arm:
                guard let selection = RobotManipulationTask(rawValue: rawTask) else { return nil }
                armTask = selection
            }
        } else if command == "select-challenge" {
            guard lab == .humanoid,
                  let rawChallenge = payload["challenge"] as? String,
                  let selection = RobotChallenge(rawValue: rawChallenge),
                  payload["task"] == nil,
                  payload["family"] == nil,
                  payload["sampleIndex"] == nil,
                  payload["speed"] == nil,
                  payload["camera"] == nil,
                  payload["receiptLens"] == nil,
                  payload["overlay"] == nil,
                  payload["enabled"] == nil else { return nil }
            challenge = selection
        } else if command == "select-family" {
            guard let rawFamily = payload["family"] as? String,
                  let selection = RobotOptimizerFamily(rawValue: rawFamily),
                  (lab == .arm || selection != .full),
                  payload["task"] == nil,
                  payload["challenge"] == nil,
                  payload["sampleIndex"] == nil,
                  payload["speed"] == nil,
                  payload["camera"] == nil,
                  payload["receiptLens"] == nil,
                  payload["overlay"] == nil,
                  payload["enabled"] == nil else { return nil }
            family = selection
        } else if command == "seek" {
            guard let selection = Self.integer(payload["sampleIndex"]), selection >= 0,
                  payload["task"] == nil,
                  payload["challenge"] == nil,
                  payload["family"] == nil,
                  payload["speed"] == nil,
                  payload["camera"] == nil,
                  payload["receiptLens"] == nil,
                  payload["overlay"] == nil,
                  payload["enabled"] == nil else { return nil }
            sampleIndex = selection
        } else if command == "set-speed" {
            guard let rawSpeed = Self.finiteDouble(payload["speed"]),
                  let selection = RobotPlaybackSpeed(rawValue: rawSpeed),
                  payload["task"] == nil,
                  payload["challenge"] == nil,
                  payload["family"] == nil,
                  payload["sampleIndex"] == nil,
                  payload["camera"] == nil,
                  payload["receiptLens"] == nil,
                  payload["overlay"] == nil,
                  payload["enabled"] == nil else { return nil }
            speed = selection
        } else if command == "set-camera" {
            guard let rawCamera = payload["camera"] as? String,
                  let selection = RobotCameraMode(rawValue: rawCamera),
                  RobotCameraMode.available(for: lab).contains(selection),
                  payload["task"] == nil,
                  payload["challenge"] == nil,
                  payload["family"] == nil,
                  payload["sampleIndex"] == nil,
                  payload["speed"] == nil,
                  payload["receiptLens"] == nil,
                  payload["overlay"] == nil,
                  payload["enabled"] == nil else { return nil }
            camera = selection
        } else if command == "select-receipt-lens" {
            guard lab == .humanoid,
                  let rawLens = payload["receiptLens"] as? String,
                  let selection = RobotReceiptLens(rawValue: rawLens),
                  payload["task"] == nil,
                  payload["challenge"] == nil,
                  payload["family"] == nil,
                  payload["sampleIndex"] == nil,
                  payload["speed"] == nil,
                  payload["camera"] == nil,
                  payload["overlay"] == nil,
                  payload["enabled"] == nil else { return nil }
            receiptLens = selection
        } else if command == "set-overlay" {
            guard let rawOverlay = payload["overlay"] as? String,
                  let selection = RobotOverlayMode(rawValue: rawOverlay),
                  RobotOverlayMode.available(for: lab).contains(selection),
                  let enabled = payload["enabled"] as? Bool,
                  payload["task"] == nil,
                  payload["challenge"] == nil,
                  payload["family"] == nil,
                  payload["sampleIndex"] == nil,
                  payload["speed"] == nil,
                  payload["camera"] == nil,
                  payload["receiptLens"] == nil else { return nil }
            overlay = selection
            overlayEnabled = enabled
        } else {
            guard payload["task"] == nil,
                  payload["challenge"] == nil,
                  payload["family"] == nil,
                  payload["sampleIndex"] == nil,
                  payload["speed"] == nil,
                  payload["camera"] == nil,
                  payload["receiptLens"] == nil,
                  payload["overlay"] == nil,
                  payload["enabled"] == nil else { return nil }
        }
        self.sequence = sequence
        self.commandID = commandID
        self.lab = lab
        self.command = command
        self.accepted = accepted
        self.detail = detail
        self.task = task
        self.armTask = armTask
        self.challenge = challenge
        self.family = family
        self.sampleIndex = sampleIndex
        self.speed = speed
        self.camera = camera
        self.receiptLens = receiptLens
        self.overlay = overlay
        self.overlayEnabled = overlayEnabled
    }

    private static func integer(_ value: Any?) -> Int? {
        guard let value = finiteDouble(value) else { return nil }
        guard value.isFinite,
              value.rounded(.towardZero) == value,
              value >= Double(Int.min),
              value <= Double(Int.max) else { return nil }
        return Int(value)
    }

    private static func finiteDouble(_ value: Any?) -> Double? {
        guard let number = value as? NSNumber,
              CFGetTypeID(number) != CFBooleanGetTypeID() else { return nil }
        let value = number.doubleValue
        return value.isFinite ? value : nil
    }
}

enum RobotEnginePhase: Equatable {
    case starting
    case loading
    case running
    case ready
    case failed(String)

    var acceptsOwnerStatus: Bool {
        if case .failed = self {
            return false
        }
        return true
    }
}

struct RobotReadinessDeadline {
    private(set) var generation = 0
    private(set) var lab: RobotLab?

    mutating func arm(for lab: RobotLab) -> Int {
        generation &+= 1
        self.lab = lab
        return generation
    }

    mutating func cancel() {
        generation &+= 1
        lab = nil
    }

    func shouldFail(generation: Int, lab: RobotLab, phase: RobotEnginePhase) -> Bool {
        guard generation == self.generation, lab == self.lab else { return false }
        switch phase {
        case .starting, .loading:
            return true
        case .running, .ready, .failed:
            return false
        }
    }
}

@MainActor
private final class WeakRobotScriptMessageHandler: NSObject, WKScriptMessageHandler {
    weak var delegate: WKScriptMessageHandler?

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        delegate?.userContentController(userContentController, didReceive: message)
    }
}

@MainActor
final class RobotEngineHost: NSObject, ObservableObject, WKNavigationDelegate, WKScriptMessageHandler {
    private static let ownerReadyTimeout: Duration = .seconds(45)

    @Published private(set) var phase: RobotEnginePhase = .starting
    @Published private(set) var detail = "Starting the private simulation engine…"
    @Published private(set) var sourceCommit = "not bundled"
    @Published private(set) var frankenSimCommit = "not bundled"
    @Published private(set) var ownerKernelVersion = "not bundled"
    @Published private(set) var crossOriginIsolated = false
    @Published private(set) var metrics = RobotEngineMetrics.empty
    @Published private(set) var supportsOptimize = false
    @Published private(set) var supportsTaskSelection = false
    @Published private(set) var supportsChallengeSelection = false
    @Published private(set) var supportsFamilySelection = false
    @Published private(set) var supportsReplay = false
    @Published private(set) var supportsPlayback = false
    @Published private(set) var supportsSeek = false
    @Published private(set) var supportsSpeedSelection = false
    @Published private(set) var supportsCameraSelection = false
    @Published private(set) var supportsReceiptLensSelection = false
    @Published private(set) var supportsOverlaySelection = false
    @Published private(set) var activeHumanoidTask = RobotLocomotionTask.walking
    @Published private(set) var activeArmTask = RobotManipulationTask.kitchenMug
    @Published private(set) var activeChallenge = RobotChallenge.flat
    @Published private(set) var activeFamily = RobotOptimizerFamily.lmMA
    @Published private(set) var activeSampleIndex = 0
    @Published private(set) var activeSampleCount = 0
    @Published private(set) var isReplayPlaying = false
    @Published private(set) var activePlaybackSpeed = RobotPlaybackSpeed.normal
    @Published private(set) var activeCamera = RobotCameraMode.follow
    @Published private(set) var selectedReceiptLens = RobotReceiptLens.baseline
    @Published private(set) var activeOverlays: Set<RobotOverlayMode> = []
    @Published private(set) var pendingCommandID: String?
    @Published private(set) var commandDetail: String?

    let webView: WKWebView

    private var server: LoopbackEngineServer?
    private var baseURL: URL?
    private var selectedLab: RobotLab = .humanoid
    private var activeNavigation: WKNavigation?
    private var readinessTimeoutTask: Task<Void, Never>?
    private var readinessDeadline = RobotReadinessDeadline()
    private var commandTimeoutTask: Task<Void, Never>?
    private var pendingCommand: String?
    private var pendingRequestedTask: RobotLocomotionTask?
    private var pendingRequestedArmTask: RobotManipulationTask?
    private var pendingRequestedChallenge: RobotChallenge?
    private var pendingRequestedFamily: RobotOptimizerFamily?
    private var pendingRequestedSampleIndex: Int?
    private var pendingRequestedSpeed: RobotPlaybackSpeed?
    private var pendingRequestedCamera: RobotCameraMode?
    private var pendingRequestedReceiptLens: RobotReceiptLens?
    private var pendingRequestedOverlay: RobotOverlayMode?
    private var pendingRequestedOverlayEnabled: Bool?
    private var lastBridgeSequence = 0
    private let scriptMessageHandler = WeakRobotScriptMessageHandler()
#if DEBUG
    private var forceReadinessTimeoutOnce =
        ProcessInfo.processInfo.environment["FROBOTS_FORCE_READINESS_TIMEOUT_ONCE"] == "1"
    private var forceWebContentTerminationOnce =
        ProcessInfo.processInfo.environment["FROBOTS_FORCE_WEBCONTENT_TERMINATION_ONCE"] == "1"
#endif

    override init() {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.websiteDataStore = .nonPersistent()
        webView = WKWebView(frame: .zero, configuration: configuration)
        super.init()
        scriptMessageHandler.delegate = self
        configuration.userContentController.add(scriptMessageHandler, name: "frankenrobots")
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.keyboardDismissMode = .interactive

        Task { [weak self] in
            await self?.start()
        }
    }

    func select(_ lab: RobotLab) {
        selectedLab = lab
        loadSelectedLab()
    }

    func reload() {
        resetBridgeState()
        if webView.url == nil {
            loadSelectedLab()
        } else {
            phase = .loading
            detail = "Reloading the \(selectedLab.title.lowercased()) engine…"
            activeNavigation = webView.reloadFromOrigin()
            armReadinessTimeout(for: selectedLab)
        }
    }

    func optimize() {
        sendOwnerCommand(
            "optimize",
            pendingDetail: "Starting continuous owner learning…"
        )
    }

    func stopOptimization() {
        sendOwnerCommand(
            "stop",
            pendingDetail: "Stopping after the current physical generation…"
        )
    }

    func selectHumanoidTask(_ task: RobotLocomotionTask) {
        guard selectedLab == .humanoid,
              supportsTaskSelection,
              task != activeHumanoidTask else { return }
        sendOwnerCommand(
            "select-task",
            pendingDetail: "Loading the \(task.title.lowercased()) physical objective…",
            task: task
        )
    }

    func selectArmTask(_ task: RobotManipulationTask) {
        guard selectedLab == .arm,
              supportsTaskSelection,
              task != activeArmTask else { return }
        sendOwnerCommand(
            "select-task",
            pendingDetail: "Loading the \(task.title.lowercased()) physical benchmark…",
            armTask: task
        )
    }

    func selectChallenge(_ challenge: RobotChallenge) {
        guard selectedLab == .humanoid,
              supportsChallengeSelection,
              challenge != activeChallenge else { return }
        sendOwnerCommand(
            "select-challenge",
            pendingDetail: "Loading the \(challenge.title.lowercased()) experiment…",
            challenge: challenge
        )
    }

    func selectFamily(_ family: RobotOptimizerFamily) {
        guard supportsFamilySelection,
              family != activeFamily,
              selectedLab == .arm || family != .full else { return }
        sendOwnerCommand(
            "select-family",
            pendingDetail: "Selecting \(family.title) for the next learning run…",
            family: family
        )
    }

    func replayCurriculum() {
        guard supportsReplay else { return }
        sendOwnerCommand("replay", pendingDetail: "Replaying the owner curriculum…")
    }

    func toggleReplayPlayback() {
        guard supportsPlayback, activeSampleCount > 0 else { return }
        sendOwnerCommand(
            isReplayPlaying ? "pause" : "play",
            pendingDetail: isReplayPlaying ? "Pausing the replay…" : "Playing the replay…"
        )
    }

    func seekReplay(to sampleIndex: Int) {
        guard supportsSeek,
              activeSampleCount > 0,
              sampleIndex >= 0,
              sampleIndex < activeSampleCount,
              sampleIndex != activeSampleIndex else { return }
        sendOwnerCommand(
            "seek",
            pendingDetail: "Moving to replay frame \(sampleIndex + 1)…",
            sampleIndex: sampleIndex
        )
    }

    func selectPlaybackSpeed(_ speed: RobotPlaybackSpeed) {
        guard supportsSpeedSelection, activeSampleCount > 0, speed != activePlaybackSpeed else { return }
        sendOwnerCommand(
            "set-speed",
            pendingDetail: "Setting replay speed to \(speed.title)…",
            speed: speed
        )
    }

    func selectCamera(_ camera: RobotCameraMode) {
        guard supportsCameraSelection,
              RobotCameraMode.available(for: selectedLab).contains(camera),
              camera != activeCamera else { return }
        sendOwnerCommand(
            "set-camera",
            pendingDetail: "Switching to the \(camera.title.lowercased()) camera…",
            camera: camera
        )
    }

    func selectNextCamera() {
        let cameras = RobotCameraMode.available(for: selectedLab)
        guard let current = cameras.firstIndex(of: activeCamera) else {
            if let first = cameras.first { selectCamera(first) }
            return
        }
        selectCamera(cameras[(current + 1) % cameras.count])
    }

    func selectReceiptLens(_ lens: RobotReceiptLens) {
        guard selectedLab == .humanoid,
              phase == .ready || phase == .running,
              lens != selectedReceiptLens else { return }
        if !supportsReceiptLensSelection {
            selectReceiptLensInLegacyBundle(lens)
            return
        }
        sendOwnerCommand(
            "select-receipt-lens",
            pendingDetail: "Applying the \(lens.title) receipt lens…",
            receiptLens: lens
        )
    }

    private func selectReceiptLensInLegacyBundle(_ lens: RobotReceiptLens) {
        Task { [weak self] in
            guard let self else { return }
            do {
                let selected = try await self.webView.callAsyncJavaScript(
                    """
                    const control = Array.from(document.querySelectorAll('[data-receipt-lens-id]'))
                      .find((candidate) => candidate.getAttribute('data-receipt-lens-id') === lensID);
                    if (!(control instanceof HTMLButtonElement)) return false;
                    control.click();
                    control.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
                    return true;
                    """,
                    arguments: ["lensID": lens.rawValue],
                    in: nil,
                    contentWorld: .page
                )
                if selected as? Bool == true {
                    self.selectedReceiptLens = lens
                }
            } catch {
                // Preserve the prior selection when the stale bundled control
                // is absent. Current bundles use the typed command above.
            }
        }
    }

    func setOverlay(_ overlay: RobotOverlayMode, enabled: Bool) {
        guard supportsOverlaySelection,
              RobotOverlayMode.available(for: selectedLab).contains(overlay),
              activeOverlays.contains(overlay) != enabled else { return }
        sendOwnerCommand(
            "set-overlay",
            pendingDetail: "Turning \(overlay.title.lowercased()) \(enabled ? "on" : "off")…",
            overlay: overlay,
            overlayEnabled: enabled
        )
    }

    private func sendOwnerCommand(
        _ command: String,
        pendingDetail: String,
        task: RobotLocomotionTask? = nil,
        armTask: RobotManipulationTask? = nil,
        challenge: RobotChallenge? = nil,
        family: RobotOptimizerFamily? = nil,
        sampleIndex: Int? = nil,
        speed: RobotPlaybackSpeed? = nil,
        camera: RobotCameraMode? = nil,
        receiptLens: RobotReceiptLens? = nil,
        overlay: RobotOverlayMode? = nil,
        overlayEnabled: Bool? = nil
    ) {
        guard pendingCommandID == nil else { return }
        guard phase == .ready || phase == .running else { return }
        let hasNoVisualizationArguments = receiptLens == nil &&
            overlay == nil &&
            overlayEnabled == nil
        if command == "optimize" ||
            command == "select-task" ||
            command == "select-challenge" ||
            command == "select-family" {
            guard phase == .ready else { return }
        } else if command == "stop" {
            guard phase == .running else { return }
        }
        switch command {
        case "select-task":
            guard supportsTaskSelection,
                  challenge == nil,
                  family == nil,
                  sampleIndex == nil,
                  speed == nil,
                  camera == nil,
                  hasNoVisualizationArguments,
                  (selectedLab == .humanoid && task != nil && armTask == nil) ||
                    (selectedLab == .arm && task == nil && armTask != nil) else { return }
        case "select-challenge":
            guard selectedLab == .humanoid,
                  supportsChallengeSelection,
                  challenge != nil,
                  task == nil,
                  armTask == nil,
                  family == nil,
                  sampleIndex == nil,
                  speed == nil,
                  camera == nil,
                  hasNoVisualizationArguments else { return }
        case "select-family":
            guard supportsFamilySelection,
                  let family,
                  selectedLab == .arm || family != .full,
                  task == nil,
                  armTask == nil,
                  challenge == nil,
                  sampleIndex == nil,
                  speed == nil,
                  camera == nil,
                  hasNoVisualizationArguments else { return }
        case "replay":
            guard supportsReplay,
                  task == nil, armTask == nil, challenge == nil, family == nil,
                  sampleIndex == nil, speed == nil, camera == nil,
                  hasNoVisualizationArguments else { return }
        case "play", "pause":
            guard supportsPlayback,
                  activeSampleCount > 0,
                  task == nil, armTask == nil, challenge == nil, family == nil,
                  sampleIndex == nil, speed == nil, camera == nil,
                  hasNoVisualizationArguments else { return }
        case "seek":
            guard supportsSeek,
                  activeSampleCount > 0,
                  let sampleIndex,
                  sampleIndex >= 0,
                  sampleIndex < activeSampleCount,
                  task == nil, armTask == nil, challenge == nil, family == nil,
                  speed == nil, camera == nil,
                  hasNoVisualizationArguments else { return }
        case "set-speed":
            guard supportsSpeedSelection,
                  activeSampleCount > 0,
                  speed != nil,
                  task == nil, armTask == nil, challenge == nil, family == nil,
                  sampleIndex == nil, camera == nil,
                  hasNoVisualizationArguments else { return }
        case "set-camera":
            guard supportsCameraSelection,
                  let camera,
                  RobotCameraMode.available(for: selectedLab).contains(camera),
                  task == nil, armTask == nil, challenge == nil, family == nil,
                  sampleIndex == nil, speed == nil,
                  hasNoVisualizationArguments else { return }
        case "select-receipt-lens":
            guard selectedLab == .humanoid,
                  supportsReceiptLensSelection,
                  receiptLens != nil,
                  task == nil, armTask == nil, challenge == nil, family == nil,
                  sampleIndex == nil, speed == nil, camera == nil,
                  overlay == nil, overlayEnabled == nil else { return }
        case "set-overlay":
            guard supportsOverlaySelection,
                  let overlay,
                  RobotOverlayMode.available(for: selectedLab).contains(overlay),
                  overlayEnabled != nil,
                  task == nil, armTask == nil, challenge == nil, family == nil,
                  sampleIndex == nil, speed == nil, camera == nil,
                  receiptLens == nil else { return }
        default:
            guard task == nil,
                  armTask == nil,
                  challenge == nil,
                  family == nil,
                  sampleIndex == nil,
                  speed == nil,
                  camera == nil,
                  receiptLens == nil,
                  overlay == nil,
                  overlayEnabled == nil,
                  command == "optimize" || command == "stop" else { return }
        }
        let commandID = UUID().uuidString
        pendingCommandID = commandID
        pendingCommand = command
        pendingRequestedTask = task
        pendingRequestedArmTask = armTask
        pendingRequestedChallenge = challenge
        pendingRequestedFamily = family
        pendingRequestedSampleIndex = sampleIndex
        pendingRequestedSpeed = speed
        pendingRequestedCamera = camera
        pendingRequestedReceiptLens = receiptLens
        pendingRequestedOverlay = overlay
        pendingRequestedOverlayEnabled = overlayEnabled
        commandDetail = pendingDetail
        commandTimeoutTask?.cancel()
        commandTimeoutTask = Task { [weak self] in
            do {
                try await Task.sleep(for: .seconds(5))
            } catch {
                return
            }
            guard let self, self.pendingCommandID == commandID else { return }
            self.clearPendingCommand()
            self.commandDetail = "The embedded owner did not acknowledge the command within five seconds."
        }
        var payload: [String: Any] = [
            "type": "engine.command",
            "schemaVersion": 1,
            "commandId": commandID,
            "lab": selectedLab.rawValue,
            "command": command,
        ]
        if let task {
            payload["task"] = task.rawValue
        }
        if let armTask {
            payload["task"] = armTask.rawValue
        }
        if let challenge {
            payload["challenge"] = challenge.rawValue
        }
        if let family {
            payload["family"] = family.rawValue
        }
        if let sampleIndex {
            payload["sampleIndex"] = sampleIndex
        }
        if let speed {
            payload["speed"] = speed.rawValue
        }
        if let camera {
            payload["camera"] = camera.rawValue
        }
        if let receiptLens {
            payload["receiptLens"] = receiptLens.rawValue
        }
        if let overlay {
            payload["overlay"] = overlay.rawValue
        }
        if let overlayEnabled {
            payload["enabled"] = overlayEnabled
        }
        Task { [weak self] in
            guard let self else { return }
            do {
                let result = try await self.webView.callAsyncJavaScript(
                    "return window.__frankenrobotsReceiveNativeCommand?.(command) ?? false;",
                    arguments: ["command": payload],
                    in: nil,
                    contentWorld: .page
                )
                guard self.pendingCommandID == commandID else { return }
                guard result as? Bool == true else {
                    self.commandTimeoutTask?.cancel()
                    self.commandTimeoutTask = nil
                    self.clearPendingCommand()
                    self.commandDetail = "The embedded owner is not ready to receive native commands."
                    return
                }
            } catch {
                guard self.pendingCommandID == commandID else { return }
                self.commandTimeoutTask?.cancel()
                self.commandTimeoutTask = nil
                self.clearPendingCommand()
                self.commandDetail = "Native command delivery failed: \(error.localizedDescription)"
            }
        }
    }

    func makeReceiptDocument() throws -> RobotReceiptDocument {
        guard lastBridgeSequence > 0, !metrics.isEmpty else {
            throw RobotReceiptExportError.noVersionedReceipt
        }
        let version = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String
        let build = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String
        let receipt = RobotRunReceipt(
            schemaVersion: RobotRunReceipt.schemaVersion,
            exportedAt: Date(),
            lab: selectedLab.rawValue,
            engineState: phase.receiptState,
            detail: detail,
            bridgeSequence: lastBridgeSequence,
            capabilities: [
                supportsOptimize ? "optimize" : nil,
                supportsTaskSelection ? "select-task" : nil,
                supportsChallengeSelection ? "select-challenge" : nil,
                supportsFamilySelection ? "select-family" : nil,
                supportsReplay ? "replay" : nil,
                supportsPlayback ? "playback" : nil,
                supportsSeek ? "seek" : nil,
                supportsSpeedSelection ? "set-speed" : nil,
                supportsCameraSelection ? "set-camera" : nil,
                supportsReceiptLensSelection ? "select-receipt-lens" : nil,
                supportsOverlaySelection ? "set-overlay" : nil,
            ].compactMap { $0 },
            metrics: metrics,
            provenance: RobotReceiptProvenance(
                appSourceCommit: readBundleText(named: "source-commit"),
                frankenSimWorkspaceCommit: readBundleText(named: "frankensim-workspace-commit"),
                ownerKernelVersion: ownerKernelVersion,
                appVersion: version ?? "unrecorded",
                appBuild: build ?? "unrecorded"
            )
        )
        return try RobotReceiptDocument(receipt: receipt)
    }

    private func start() async {
        phase = .starting
        detail = "Starting the private simulation engine…"
        do {
            let server = try LoopbackEngineServer()
            let baseURL = try await server.start()
            self.server = server
            self.baseURL = baseURL
            sourceCommit = readBundleText(named: "source-commit", abbreviated: true)
            frankenSimCommit = readBundleText(named: "frankensim-workspace-commit", abbreviated: true)
            ownerKernelVersion = readBundleText(named: "owner-kernel-version")
            loadSelectedLab()
        } catch {
            cancelReadinessTimeout()
            phase = .failed(error.localizedDescription)
            detail = error.localizedDescription
        }
    }

    private func loadSelectedLab() {
        guard let baseURL,
              let url = URL(string: selectedLab.route, relativeTo: baseURL)?.absoluteURL else {
            return
        }
        resetBridgeState()
        phase = .loading
        detail = "Loading the \(selectedLab.title.lowercased()) lab…"
        activeNavigation = webView.load(
            URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)
        )
        armReadinessTimeout(for: selectedLab)
    }

    private func armReadinessTimeout(for lab: RobotLab) {
        readinessTimeoutTask?.cancel()
        let generation = readinessDeadline.arm(for: lab)
        let timeout = nextReadinessTimeout()
        readinessTimeoutTask = Task { [weak self] in
            do {
                try await Task.sleep(for: timeout)
            } catch {
                return
            }
            guard let self,
                  self.readinessDeadline.shouldFail(
                      generation: generation,
                      lab: lab,
                      phase: self.phase
                  ) else { return }
            let message = "The bundled \(lab.title.lowercased()) engine did not become ready within 45 seconds. Check available memory, then try again."
            self.readinessDeadline.cancel()
            self.readinessTimeoutTask = nil
            self.resetBridgeState()
            self.phase = .failed(message)
            self.detail = message
        }
    }

    private func nextReadinessTimeout() -> Duration {
#if DEBUG
        if forceReadinessTimeoutOnce {
            forceReadinessTimeoutOnce = false
            return .milliseconds(50)
        }
#endif
        return Self.ownerReadyTimeout
    }

    private func cancelReadinessTimeout() {
        readinessTimeoutTask?.cancel()
        readinessTimeoutTask = nil
        readinessDeadline.cancel()
    }

    private func readBundleText(named name: String, abbreviated: Bool = false) -> String {
        guard let url = Bundle.main.url(forResource: name, withExtension: "txt", subdirectory: "Engine"),
              let value = try? String(contentsOf: url, encoding: .utf8)
                .trimmingCharacters(in: .whitespacesAndNewlines),
              !value.isEmpty else {
            return "unrecorded"
        }
        return abbreviated ? String(value.prefix(12)) : value
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard owns(navigation) else { return }
        let script = "({ isolated: self.crossOriginIsolated, title: document.title, path: location.pathname })"
        webView.evaluateJavaScript(script) { [weak self] result, _ in
            Task { @MainActor in
                guard let self, self.owns(navigation) else { return }
                let payload = result as? [String: Any]
                self.crossOriginIsolated = payload?["isolated"] as? Bool ?? false
                // A fast worker can report ready before this JavaScript probe
                // returns. Never regress that newer state back to loading.
                switch self.phase {
                case .starting, .loading:
                    self.phase = .loading
                    self.detail = self.crossOriginIsolated
                        ? "Engine document ready · waiting for the Frankensim owner worker"
                        : "Compatibility document ready · waiting for the owner worker"
                case .running, .ready, .failed:
                    break
                }
            }
        }
    }

    func webView(
        _ webView: WKWebView,
        didFailProvisionalNavigation navigation: WKNavigation!,
        withError error: Error
    ) {
        failNavigation(error, navigation: navigation)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        failNavigation(error, navigation: navigation)
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        guard webView === self.webView else { return }
        let message = "The private \(selectedLab.title.lowercased()) engine stopped unexpectedly. Try Again reloads its local Web content process."
        cancelReadinessTimeout()
        resetBridgeState()
        phase = .failed(message)
        detail = message
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationResponse: WKNavigationResponse,
        decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void
    ) {
        guard let response = navigationResponse.response as? HTTPURLResponse,
              response.statusCode >= 400 else {
            decisionHandler(.allow)
            return
        }

        // `WKNavigationResponse` does not carry the `WKNavigation` identity.
        // Publishing failure here would let an HTTP response from a cancelled
        // older route poison the newly selected lab. Cancelling causes WebKit
        // to report the terminal navigation callback below, where ownership is
        // identity-fenced before UI state changes.
        decisionHandler(.cancel)
    }

    private func owns(_ navigation: WKNavigation?) -> Bool {
        guard let navigation, let activeNavigation else { return false }
        return navigation === activeNavigation
    }

    private func failNavigation(_ error: Error, navigation: WKNavigation?) {
        // Switching labs cancels the old navigation after the new one has
        // started. Its delayed cancellation/failure must not replace the new
        // lab's loading or ready state.
        guard owns(navigation) else { return }
        cancelReadinessTimeout()
        metrics = .empty
        phase = .failed(error.localizedDescription)
        detail = "The bundled engine did not load: \(error.localizedDescription)"
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }
        if url.scheme == "about" || (url.host == "127.0.0.1" && url.port == baseURL?.port) {
            decisionHandler(.allow)
            return
        }
        decisionHandler(.cancel)
        if navigationAction.navigationType == .linkActivated {
            UIApplication.shared.open(url)
        }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "frankenrobots",
              let payload = message.body as? [String: Any] else {
            return
        }

        // Keep an already-installed pre-v1 Engine usable until the exact
        // source-bound export is activated. Legacy events may move the coarse
        // phase only; native metrics remain empty because they have no schema
        // or ordering receipt.
        if payload["schemaVersion"] == nil {
            receiveLegacyStatus(payload)
            return
        }

        if let acknowledgement = RobotEngineCommandAcknowledgement(payload: payload) {
            guard acknowledgement.lab == selectedLab,
                  acknowledgement.sequence > lastBridgeSequence,
                  acknowledgement.commandID == pendingCommandID,
                  acknowledgement.command == pendingCommand,
                  acknowledgementMatchesPendingSelection(acknowledgement) else { return }
            lastBridgeSequence = acknowledgement.sequence
            commandTimeoutTask?.cancel()
            commandTimeoutTask = nil
            if acknowledgement.accepted {
                switch acknowledgement.command {
                case "select-task":
                    if let task = acknowledgement.task {
                        activeHumanoidTask = task
                    } else if let task = acknowledgement.armTask {
                        activeArmTask = task
                    }
                case "select-challenge":
                    if let challenge = acknowledgement.challenge {
                        activeChallenge = challenge
                    }
                case "select-family":
                    if let family = acknowledgement.family {
                        activeFamily = family
                    }
                case "replay":
                    activeSampleIndex = 0
                    isReplayPlaying = true
                case "play":
                    isReplayPlaying = true
                case "pause":
                    isReplayPlaying = false
                case "seek":
                    if let sampleIndex = acknowledgement.sampleIndex {
                        activeSampleIndex = sampleIndex
                        isReplayPlaying = false
                    }
                case "set-speed":
                    if let speed = acknowledgement.speed {
                        activePlaybackSpeed = speed
                    }
                case "set-camera":
                    if let camera = acknowledgement.camera {
                        activeCamera = camera
                    }
                case "select-receipt-lens":
                    if let lens = acknowledgement.receiptLens {
                        selectedReceiptLens = lens
                    }
                case "set-overlay":
                    if let overlay = acknowledgement.overlay,
                       let enabled = acknowledgement.overlayEnabled {
                        if enabled {
                            activeOverlays.insert(overlay)
                        } else {
                            activeOverlays.remove(overlay)
                        }
                    }
                default:
                    break
                }
            }
            clearPendingCommand()
            commandDetail = acknowledgement.detail
            return
        }

        if let traceState = RobotTraceStateMessage(payload: payload) {
            guard traceState.lab == selectedLab,
                  traceState.sequence > lastBridgeSequence,
                  phase.acceptsOwnerStatus else { return }
            lastBridgeSequence = traceState.sequence
            activeSampleIndex = traceState.sampleIndex
            activeSampleCount = traceState.sampleCount
            isReplayPlaying = traceState.playing
            activePlaybackSpeed = traceState.speed
            activeCamera = traceState.camera
            if let receiptLens = traceState.receiptLens {
                selectedReceiptLens = receiptLens
            }
            activeOverlays = traceState.overlays
            return
        }

        guard let event = RobotEngineStatusMessage(payload: payload),
              event.lab == selectedLab,
              event.sequence > lastBridgeSequence,
              phase.acceptsOwnerStatus else { return }
        lastBridgeSequence = event.sequence
        detail = event.detail
        metrics = event.metrics
        supportsOptimize = event.capabilities.contains("optimize")
        supportsTaskSelection = event.capabilities.contains("select-task")
        supportsChallengeSelection = event.capabilities.contains("select-challenge")
        supportsFamilySelection = event.capabilities.contains("select-family")
        supportsReplay = event.capabilities.contains("replay")
        supportsPlayback = event.capabilities.contains("playback")
        supportsSeek = event.capabilities.contains("seek")
        supportsSpeedSelection = event.capabilities.contains("set-speed")
        supportsCameraSelection = event.capabilities.contains("set-camera")
        supportsReceiptLensSelection = event.capabilities.contains("select-receipt-lens")
        supportsOverlaySelection = event.capabilities.contains("set-overlay")
        if event.lab == .humanoid, let task = event.metrics.activeTask {
            activeHumanoidTask = task
        }
        if event.lab == .arm, let task = event.metrics.activeArmTask {
            activeArmTask = task
        }
        if event.lab == .humanoid, let challenge = event.metrics.activeChallenge {
            activeChallenge = challenge
        }
        if let family = event.metrics.activeFamily {
            activeFamily = family
        }
        apply(state: event.state, detail: event.detail)
    }

    private func acknowledgementMatchesPendingSelection(
        _ acknowledgement: RobotEngineCommandAcknowledgement
    ) -> Bool {
        let hasNoPendingVisualizationArguments = pendingRequestedReceiptLens == nil &&
            pendingRequestedOverlay == nil &&
            pendingRequestedOverlayEnabled == nil
        switch acknowledgement.command {
        case "select-task":
            if acknowledgement.lab == .humanoid {
                return acknowledgement.task == pendingRequestedTask &&
                    pendingRequestedArmTask == nil &&
                    pendingRequestedChallenge == nil &&
                    pendingRequestedFamily == nil &&
                    pendingRequestedSampleIndex == nil &&
                    pendingRequestedSpeed == nil &&
                    pendingRequestedCamera == nil &&
                    hasNoPendingVisualizationArguments
            }
            return acknowledgement.armTask == pendingRequestedArmTask &&
                pendingRequestedTask == nil &&
                pendingRequestedChallenge == nil &&
                pendingRequestedFamily == nil &&
                pendingRequestedSampleIndex == nil &&
                pendingRequestedSpeed == nil &&
                pendingRequestedCamera == nil &&
                hasNoPendingVisualizationArguments
        case "select-challenge":
            return acknowledgement.challenge == pendingRequestedChallenge &&
                pendingRequestedTask == nil &&
                pendingRequestedArmTask == nil &&
                pendingRequestedFamily == nil &&
                pendingRequestedSampleIndex == nil &&
                pendingRequestedSpeed == nil &&
                pendingRequestedCamera == nil &&
                hasNoPendingVisualizationArguments
        case "select-family":
            return acknowledgement.family == pendingRequestedFamily &&
                pendingRequestedTask == nil &&
                pendingRequestedArmTask == nil &&
                pendingRequestedChallenge == nil &&
                pendingRequestedSampleIndex == nil &&
                pendingRequestedSpeed == nil &&
                pendingRequestedCamera == nil &&
                hasNoPendingVisualizationArguments
        case "seek":
            return acknowledgement.sampleIndex == pendingRequestedSampleIndex &&
                pendingRequestedTask == nil &&
                pendingRequestedArmTask == nil &&
                pendingRequestedChallenge == nil &&
                pendingRequestedFamily == nil &&
                pendingRequestedSpeed == nil &&
                pendingRequestedCamera == nil &&
                hasNoPendingVisualizationArguments
        case "set-speed":
            return acknowledgement.speed == pendingRequestedSpeed &&
                pendingRequestedTask == nil &&
                pendingRequestedArmTask == nil &&
                pendingRequestedChallenge == nil &&
                pendingRequestedFamily == nil &&
                pendingRequestedSampleIndex == nil &&
                pendingRequestedCamera == nil &&
                hasNoPendingVisualizationArguments
        case "set-camera":
            return acknowledgement.camera == pendingRequestedCamera &&
                pendingRequestedTask == nil &&
                pendingRequestedArmTask == nil &&
                pendingRequestedChallenge == nil &&
                pendingRequestedFamily == nil &&
                pendingRequestedSampleIndex == nil &&
                pendingRequestedSpeed == nil &&
                pendingRequestedReceiptLens == nil &&
                pendingRequestedOverlay == nil &&
                pendingRequestedOverlayEnabled == nil
        case "select-receipt-lens":
            return acknowledgement.receiptLens == pendingRequestedReceiptLens &&
                pendingRequestedTask == nil &&
                pendingRequestedArmTask == nil &&
                pendingRequestedChallenge == nil &&
                pendingRequestedFamily == nil &&
                pendingRequestedSampleIndex == nil &&
                pendingRequestedSpeed == nil &&
                pendingRequestedCamera == nil &&
                pendingRequestedOverlay == nil &&
                pendingRequestedOverlayEnabled == nil
        case "set-overlay":
            return acknowledgement.overlay == pendingRequestedOverlay &&
                acknowledgement.overlayEnabled == pendingRequestedOverlayEnabled &&
                pendingRequestedTask == nil &&
                pendingRequestedArmTask == nil &&
                pendingRequestedChallenge == nil &&
                pendingRequestedFamily == nil &&
                pendingRequestedSampleIndex == nil &&
                pendingRequestedSpeed == nil &&
                pendingRequestedCamera == nil &&
                pendingRequestedReceiptLens == nil
        default:
            return pendingRequestedTask == nil &&
                pendingRequestedArmTask == nil &&
                pendingRequestedChallenge == nil &&
                pendingRequestedFamily == nil &&
                pendingRequestedSampleIndex == nil &&
                pendingRequestedSpeed == nil &&
                pendingRequestedCamera == nil &&
                pendingRequestedReceiptLens == nil &&
                pendingRequestedOverlay == nil &&
                pendingRequestedOverlayEnabled == nil
        }
    }

    private func clearPendingCommand() {
        pendingCommandID = nil
        pendingCommand = nil
        pendingRequestedTask = nil
        pendingRequestedArmTask = nil
        pendingRequestedChallenge = nil
        pendingRequestedFamily = nil
        pendingRequestedSampleIndex = nil
        pendingRequestedSpeed = nil
        pendingRequestedCamera = nil
        pendingRequestedReceiptLens = nil
        pendingRequestedOverlay = nil
        pendingRequestedOverlayEnabled = nil
    }

    private func receiveLegacyStatus(_ payload: [String: Any]) {
        guard phase.acceptsOwnerStatus,
              payload["type"] as? String == "engine.status",
              payload["lab"] as? String == selectedLab.rawValue,
              let state = payload["state"] as? String,
              ["loading", "ready", "running", "failed"].contains(state),
              let detail = payload["detail"] as? String, !detail.isEmpty else {
            return
        }
        metrics = .empty
        supportsOptimize = false
        supportsTaskSelection = false
        supportsChallengeSelection = false
        supportsFamilySelection = false
        supportsReplay = false
        supportsPlayback = false
        supportsSeek = false
        supportsSpeedSelection = false
        supportsCameraSelection = false
        supportsReceiptLensSelection = false
        supportsOverlaySelection = false
        activeOverlays = []
        activeSampleIndex = 0
        activeSampleCount = 0
        isReplayPlaying = false
        self.detail = detail
        apply(state: state, detail: detail)
    }

    private func apply(state: String, detail: String) {
        guard phase.acceptsOwnerStatus else { return }
        switch state {
        case "loading":
            phase = .loading
        case "ready":
            cancelReadinessTimeout()
            phase = .ready
            scheduleInjectedWebContentTerminationIfNeeded()
        case "running":
            cancelReadinessTimeout()
            phase = .running
            scheduleInjectedWebContentTerminationIfNeeded()
        case "failed":
            cancelReadinessTimeout()
            metrics = .empty
            phase = .failed(detail)
        default:
            break
        }
    }

    private func scheduleInjectedWebContentTerminationIfNeeded() {
#if DEBUG
        guard forceWebContentTerminationOnce, lastBridgeSequence > 0 else { return }
        forceWebContentTerminationOnce = false
        Task { [weak self] in
            await Task.yield()
            guard let self, self.phase == .ready || self.phase == .running else { return }
            self.webViewWebContentProcessDidTerminate(self.webView)
        }
#endif
    }

    private func resetBridgeState() {
        lastBridgeSequence = 0
        metrics = .empty
        supportsOptimize = false
        supportsTaskSelection = false
        supportsChallengeSelection = false
        supportsFamilySelection = false
        supportsReplay = false
        supportsPlayback = false
        supportsSeek = false
        supportsSpeedSelection = false
        supportsCameraSelection = false
        supportsReceiptLensSelection = false
        supportsOverlaySelection = false
        activeHumanoidTask = .walking
        activeArmTask = .kitchenMug
        activeChallenge = .flat
        activeFamily = selectedLab == .humanoid ? .lmMA : .lmCMA
        activeSampleIndex = 0
        activeSampleCount = 0
        isReplayPlaying = false
        activePlaybackSpeed = .normal
        activeCamera = selectedLab == .humanoid ? .follow : .studio
        selectedReceiptLens = .baseline
        activeOverlays = []
        commandTimeoutTask?.cancel()
        clearPendingCommand()
        commandDetail = nil
    }
}

private extension RobotEnginePhase {
    var receiptState: String {
        switch self {
        case .starting: "starting"
        case .loading: "loading"
        case .running: "running"
        case .ready: "ready"
        case .failed: "failed"
        }
    }
}

struct RobotEngineWebView: UIViewRepresentable {
    let webView: WKWebView

    func makeUIView(context: Context) -> WKWebView { webView }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
