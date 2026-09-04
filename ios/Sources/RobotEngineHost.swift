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

    var isEmpty: Bool {
        generation == nil && bestObjective == nil && completedSteps == nil && placed == nil &&
            bodyPenetrationMeters == nil && certifiedClearanceMeters == nil &&
            collisionRiskIntegral == nil && possibleCollisionTimeSeconds == nil && activeTask == nil
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
        activeTask: RobotLocomotionTask? = nil
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
              Self.hasValidOptionalTask(payload, key: "activeTask") else {
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
            ? ["optimize", "select-task"]
            : ["optimize"]
        guard Set(rawCapabilities).isSubset(of: allowedCapabilities),
              lab == .humanoid || metrics.activeTask == nil else { return nil }
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

struct RobotEngineCommandAcknowledgement {
    static let schemaVersion = 1

    let sequence: Int
    let commandID: String
    let lab: RobotLab
    let command: String
    let accepted: Bool
    let detail: String
    let task: RobotLocomotionTask?

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
              ["optimize", "stop", "select-task"].contains(command),
              let accepted = payload["accepted"] as? Bool,
              let detail = payload["detail"] as? String,
              !detail.isEmpty,
              detail.count <= 300 else {
            return nil
        }
        let task = (payload["task"] as? String).flatMap(RobotLocomotionTask.init(rawValue:))
        if command == "select-task" {
            guard lab == .humanoid, task != nil else { return nil }
        } else if payload["task"] != nil {
            return nil
        }
        self.sequence = sequence
        self.commandID = commandID
        self.lab = lab
        self.command = command
        self.accepted = accepted
        self.detail = detail
        self.task = task
    }

    private static func integer(_ value: Any?) -> Int? {
        guard let number = value as? NSNumber,
              CFGetTypeID(number) != CFBooleanGetTypeID() else { return nil }
        let value = number.doubleValue
        guard value.isFinite,
              value.rounded(.towardZero) == value,
              value >= Double(Int.min),
              value <= Double(Int.max) else { return nil }
        return Int(value)
    }
}

enum RobotEnginePhase: Equatable {
    case starting
    case loading
    case running
    case ready
    case failed(String)
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
    @Published private(set) var activeHumanoidTask = RobotLocomotionTask.walking
    @Published private(set) var selectedReceiptLens = RobotReceiptLens.baseline
    @Published private(set) var pendingCommandID: String?
    @Published private(set) var commandDetail: String?

    let webView: WKWebView

    private var server: LoopbackEngineServer?
    private var baseURL: URL?
    private var selectedLab: RobotLab = .humanoid
    private var activeNavigation: WKNavigation?
    private var readinessTimeoutTask: Task<Void, Never>?
    private var commandTimeoutTask: Task<Void, Never>?
    private var pendingRequestedTask: RobotLocomotionTask?
    private var lastBridgeSequence = 0
    private let scriptMessageHandler = WeakRobotScriptMessageHandler()

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

    func selectReceiptLens(_ lens: RobotReceiptLens) {
        guard selectedLab == .humanoid,
              phase == .ready || phase == .running else { return }
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
                // Keep the prior native selection when the exact embedded
                // analysis control is absent or refuses navigation.
            }
        }
    }

    private func sendOwnerCommand(
        _ command: String,
        pendingDetail: String,
        task: RobotLocomotionTask? = nil
    ) {
        guard pendingCommandID == nil else { return }
        if command == "optimize" || command == "select-task" {
            guard phase == .ready else { return }
        } else {
            guard command == "stop", phase == .running else { return }
        }
        if command == "select-task" {
            guard selectedLab == .humanoid, supportsTaskSelection, task != nil else { return }
        } else {
            guard task == nil else { return }
        }
        let commandID = UUID().uuidString
        pendingCommandID = commandID
        pendingRequestedTask = task
        commandDetail = pendingDetail
        commandTimeoutTask?.cancel()
        commandTimeoutTask = Task { [weak self] in
            do {
                try await Task.sleep(for: .seconds(5))
            } catch {
                return
            }
            guard let self, self.pendingCommandID == commandID else { return }
            self.pendingCommandID = nil
            self.pendingRequestedTask = nil
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
                    self.pendingCommandID = nil
                    self.pendingRequestedTask = nil
                    self.commandDetail = "The embedded owner is not ready to receive native commands."
                    return
                }
            } catch {
                guard self.pendingCommandID == commandID else { return }
                self.commandTimeoutTask?.cancel()
                self.commandTimeoutTask = nil
                self.pendingCommandID = nil
                self.pendingRequestedTask = nil
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
            readinessTimeoutTask?.cancel()
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
        readinessTimeoutTask = Task { [weak self] in
            do {
                try await Task.sleep(for: Self.ownerReadyTimeout)
            } catch {
                return
            }
            guard let self, self.selectedLab == lab else { return }
            switch self.phase {
            case .starting, .loading:
                let message = "The bundled \(lab.title.lowercased()) engine did not become ready within 45 seconds. Check available memory, then try again."
                self.phase = .failed(message)
                self.detail = message
            case .running, .ready, .failed:
                break
            }
        }
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
        readinessTimeoutTask?.cancel()
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
                  acknowledgement.commandID == pendingCommandID else { return }
            lastBridgeSequence = acknowledgement.sequence
            commandTimeoutTask?.cancel()
            commandTimeoutTask = nil
            pendingCommandID = nil
            if acknowledgement.accepted,
               acknowledgement.command == "select-task",
               let task = acknowledgement.task,
               task == pendingRequestedTask {
                activeHumanoidTask = task
            }
            pendingRequestedTask = nil
            commandDetail = acknowledgement.detail
            return
        }

        guard let event = RobotEngineStatusMessage(payload: payload),
              event.lab == selectedLab,
              event.sequence > lastBridgeSequence else { return }
        lastBridgeSequence = event.sequence
        detail = event.detail
        metrics = event.metrics
        supportsOptimize = event.capabilities.contains("optimize")
        supportsTaskSelection = event.capabilities.contains("select-task")
        if event.lab == .humanoid, let task = event.metrics.activeTask {
            activeHumanoidTask = task
        }
        apply(state: event.state, detail: event.detail)
    }

    private func receiveLegacyStatus(_ payload: [String: Any]) {
        guard payload["type"] as? String == "engine.status",
              payload["lab"] as? String == selectedLab.rawValue,
              let state = payload["state"] as? String,
              ["loading", "ready", "running", "failed"].contains(state),
              let detail = payload["detail"] as? String, !detail.isEmpty else {
            return
        }
        metrics = .empty
        supportsOptimize = false
        supportsTaskSelection = false
        self.detail = detail
        apply(state: state, detail: detail)
    }

    private func apply(state: String, detail: String) {
        switch state {
        case "loading":
            phase = .loading
        case "ready":
            readinessTimeoutTask?.cancel()
            phase = .ready
        case "running":
            readinessTimeoutTask?.cancel()
            phase = .running
        case "failed":
            readinessTimeoutTask?.cancel()
            metrics = .empty
            phase = .failed(detail)
        default:
            break
        }
    }

    private func resetBridgeState() {
        lastBridgeSequence = 0
        metrics = .empty
        supportsOptimize = false
        supportsTaskSelection = false
        selectedReceiptLens = .baseline
        commandTimeoutTask?.cancel()
        pendingCommandID = nil
        pendingRequestedTask = nil
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
