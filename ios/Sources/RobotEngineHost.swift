import SwiftUI
import UIKit
import WebKit

enum RobotEnginePhase: Equatable {
    case starting
    case loading
    case ready
    case failed(String)
}

@MainActor
final class RobotEngineHost: NSObject, ObservableObject, WKNavigationDelegate, WKScriptMessageHandler {
    @Published private(set) var phase: RobotEnginePhase = .starting
    @Published private(set) var detail = "Starting the private simulation engine…"
    @Published private(set) var sourceCommit = "not bundled"
    @Published private(set) var crossOriginIsolated = false

    let webView: WKWebView

    private var server: LoopbackEngineServer?
    private var baseURL: URL?
    private var selectedLab: RobotLab = .humanoid

    override init() {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.websiteDataStore = .nonPersistent()
        webView = WKWebView(frame: .zero, configuration: configuration)
        super.init()
        configuration.userContentController.add(self, name: "frankenrobots")
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

    deinit {
        webView.configuration.userContentController.removeScriptMessageHandler(forName: "frankenrobots")
    }

    func select(_ lab: RobotLab) {
        selectedLab = lab
        loadSelectedLab()
    }

    func reload() {
        if webView.url == nil {
            loadSelectedLab()
        } else {
            phase = .loading
            detail = "Reloading the \(selectedLab.title.lowercased()) engine…"
            webView.reloadFromOrigin()
        }
    }

    private func start() async {
        phase = .starting
        detail = "Starting the private simulation engine…"
        do {
            let server = try LoopbackEngineServer()
            let baseURL = try await server.start()
            self.server = server
            self.baseURL = baseURL
            sourceCommit = readSourceCommit()
            loadSelectedLab()
        } catch {
            phase = .failed(error.localizedDescription)
            detail = error.localizedDescription
        }
    }

    private func loadSelectedLab() {
        guard let baseURL,
              let url = URL(string: selectedLab.route, relativeTo: baseURL)?.absoluteURL else {
            return
        }
        phase = .loading
        detail = "Loading the \(selectedLab.title.lowercased()) lab…"
        webView.load(URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData))
    }

    private func readSourceCommit() -> String {
        guard let url = Bundle.main.url(forResource: "source-commit", withExtension: "txt", subdirectory: "Engine"),
              let value = try? String(contentsOf: url, encoding: .utf8)
                .trimmingCharacters(in: .whitespacesAndNewlines),
              !value.isEmpty else {
            return "unrecorded"
        }
        return String(value.prefix(12))
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        let script = "({ isolated: self.crossOriginIsolated, title: document.title, path: location.pathname })"
        webView.evaluateJavaScript(script) { [weak self] result, _ in
            Task { @MainActor in
                guard let self else { return }
                let payload = result as? [String: Any]
                self.crossOriginIsolated = payload?["isolated"] as? Bool ?? false
                self.phase = .ready
                self.detail = self.crossOriginIsolated
                    ? "Isolated engine document ready · worker initialization continues in the lab"
                    : "Engine document ready · compatibility worker mode"
            }
        }
    }

    func webView(
        _ webView: WKWebView,
        didFailProvisionalNavigation navigation: WKNavigation!,
        withError error: Error
    ) {
        failNavigation(error)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        failNavigation(error)
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

        decisionHandler(.cancel)
        let error = "The bundled engine returned HTTP \(response.statusCode)."
        phase = .failed(error)
        detail = error
    }

    private func failNavigation(_ error: Error) {
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
              let payload = message.body as? [String: Any],
              let type = payload["type"] as? String else {
            return
        }
        if type == "engine.status", let status = payload["detail"] as? String {
            detail = status
        }
    }
}

struct RobotEngineWebView: UIViewRepresentable {
    let webView: WKWebView

    func makeUIView(context: Context) -> WKWebView { webView }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
