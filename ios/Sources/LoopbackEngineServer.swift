import Foundation
import Network

enum EngineServerError: LocalizedError {
    case missingBundle
    case failed(String)

    var errorDescription: String? {
        switch self {
        case .missingBundle:
            "The bundled robot engine is missing. Run ios/prepare-engine.sh before building the app."
        case let .failed(message):
            "The private robot engine could not start: \(message)"
        }
    }
}

/// Serves the bundled static export on an ephemeral loopback-only port.
///
/// The browser worker pool and threaded WASM kernel require an HTTP origin and
/// cross-origin isolation. Binding to 127.0.0.1 preserves that execution model
/// without exposing a listener to the LAN or loading any remote content.
final class LoopbackEngineServer {
    private let queue = DispatchQueue(label: "com.frankenrobots.engine-server", qos: .userInitiated)
    private let root: URL
    private var listener: NWListener?

    init(bundle: Bundle = .main) throws {
        guard let resourceRoot = bundle.resourceURL else {
            throw EngineServerError.missingBundle
        }
        let candidate = resourceRoot.appendingPathComponent("Engine", isDirectory: true)
        var isDirectory: ObjCBool = false
        guard FileManager.default.fileExists(atPath: candidate.path, isDirectory: &isDirectory),
              isDirectory.boolValue else {
            throw EngineServerError.missingBundle
        }
        root = candidate.resolvingSymlinksInPath().standardizedFileURL
    }

    deinit {
        listener?.cancel()
    }

    func start() async throws -> URL {
        if let port = listener?.port {
            return URL(string: "http://127.0.0.1:\(port.rawValue)/")!
        }

        let parameters = NWParameters.tcp
        parameters.requiredLocalEndpoint = .hostPort(host: "127.0.0.1", port: .any)
        let listener: NWListener
        do {
            listener = try NWListener(using: parameters, on: .any)
        } catch {
            throw EngineServerError.failed(error.localizedDescription)
        }
        self.listener = listener
        listener.newConnectionHandler = { [weak self] connection in
            self?.accept(connection)
        }

        return try await withCheckedThrowingContinuation { continuation in
            var pending: CheckedContinuation<URL, Error>? = continuation
            listener.stateUpdateHandler = { state in
                guard let active = pending else { return }
                switch state {
                case .ready:
                    guard let port = listener.port,
                          let url = URL(string: "http://127.0.0.1:\(port.rawValue)/") else {
                        pending = nil
                        active.resume(throwing: EngineServerError.failed("No loopback port was assigned."))
                        return
                    }
                    pending = nil
                    active.resume(returning: url)
                case let .failed(error):
                    pending = nil
                    active.resume(throwing: EngineServerError.failed(error.localizedDescription))
                case .cancelled:
                    pending = nil
                    active.resume(throwing: EngineServerError.failed("The loopback listener was cancelled."))
                default:
                    break
                }
            }
            listener.start(queue: queue)
        }
    }

    private func accept(_ connection: NWConnection) {
        connection.stateUpdateHandler = { state in
            if case .failed = state { connection.cancel() }
        }
        connection.start(queue: queue)
        receiveRequest(on: connection, accumulated: Data())
    }

    private func receiveRequest(on connection: NWConnection, accumulated: Data) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 32 * 1024) { [weak self] data, _, complete, error in
            guard let self else {
                connection.cancel()
                return
            }
            var request = accumulated
            if let data { request.append(data) }

            if request.range(of: Data("\r\n\r\n".utf8)) != nil {
                self.respond(to: request, on: connection)
            } else if request.count >= 64 * 1024 || complete || error != nil {
                self.send(status: 400, reason: "Bad Request", body: Data(), mime: "text/plain", on: connection)
            } else {
                self.receiveRequest(on: connection, accumulated: request)
            }
        }
    }

    private func respond(to request: Data, on connection: NWConnection) {
        guard let text = String(data: request, encoding: .utf8),
              let firstLine = text.components(separatedBy: "\r\n").first else {
            send(status: 400, reason: "Bad Request", body: Data(), mime: "text/plain", on: connection)
            return
        }
        let parts = firstLine.split(separator: " ", omittingEmptySubsequences: true)
        guard parts.count == 3 else {
            send(status: 400, reason: "Bad Request", body: Data(), mime: "text/plain", on: connection)
            return
        }
        let method = String(parts[0])
        guard method == "GET" || method == "HEAD" else {
            send(status: 405, reason: "Method Not Allowed", body: Data(), mime: "text/plain", on: connection)
            return
        }
        guard let components = URLComponents(string: "http://127.0.0.1\(parts[1])"),
              let decodedPath = components.percentEncodedPath.removingPercentEncoding,
              !decodedPath.contains("\0") else {
            send(status: 400, reason: "Bad Request", body: Data(), mime: "text/plain", on: connection)
            return
        }

        guard let file = resolve(path: decodedPath) else {
            send(status: 404, reason: "Not Found", body: Data(), mime: "text/plain", on: connection)
            return
        }
        do {
            let body = try Data(contentsOf: file, options: .mappedIfSafe)
            send(
                status: 200,
                reason: "OK",
                body: method == "HEAD" ? Data() : body,
                contentLength: body.count,
                mime: mimeType(for: file.pathExtension),
                cacheable: file.pathExtension.lowercased() != "html",
                on: connection
            )
        } catch {
            send(status: 500, reason: "Internal Server Error", body: Data(), mime: "text/plain", on: connection)
        }
    }

    private func resolve(path: String) -> URL? {
        var relative = path
        while relative.hasPrefix("/") { relative.removeFirst() }
        if relative.isEmpty { relative = "index.html" }
        if relative.hasSuffix("/") { relative += "index.html" }

        var candidate = root.appendingPathComponent(relative).standardizedFileURL
        var isDirectory: ObjCBool = false
        if FileManager.default.fileExists(atPath: candidate.path, isDirectory: &isDirectory),
           isDirectory.boolValue {
            candidate.appendPathComponent("index.html")
        } else if !FileManager.default.fileExists(atPath: candidate.path),
                  candidate.pathExtension.isEmpty {
            candidate.appendPathComponent("index.html")
        }

        let canonical = candidate.resolvingSymlinksInPath().standardizedFileURL
        let allowedPrefix = root.path.hasSuffix("/") ? root.path : root.path + "/"
        guard canonical.path.hasPrefix(allowedPrefix),
              FileManager.default.fileExists(atPath: canonical.path) else {
            return nil
        }
        return canonical
    }

    private func send(
        status: Int,
        reason: String,
        body: Data,
        contentLength: Int? = nil,
        mime: String,
        cacheable: Bool = false,
        on connection: NWConnection
    ) {
        let headers = [
            "HTTP/1.1 \(status) \(reason)",
            "Content-Type: \(mime)",
            "Content-Length: \(contentLength ?? body.count)",
            "Connection: close",
            "Cache-Control: \(cacheable ? "public, max-age=31536000, immutable" : "no-cache")",
            "Cross-Origin-Opener-Policy: same-origin",
            "Cross-Origin-Embedder-Policy: require-corp",
            "Cross-Origin-Resource-Policy: same-origin",
            "X-Content-Type-Options: nosniff",
            "",
            "",
        ].joined(separator: "\r\n")
        var response = Data(headers.utf8)
        response.append(body)
        connection.send(content: response, completion: .contentProcessed { _ in
            connection.cancel()
        })
    }

    private func mimeType(for extensionName: String) -> String {
        switch extensionName.lowercased() {
        case "html": "text/html; charset=utf-8"
        case "js", "mjs": "text/javascript; charset=utf-8"
        case "css": "text/css; charset=utf-8"
        case "json", "map": "application/json"
        case "wasm": "application/wasm"
        case "png": "image/png"
        case "jpg", "jpeg": "image/jpeg"
        case "svg": "image/svg+xml"
        case "webp": "image/webp"
        case "woff": "font/woff"
        case "woff2": "font/woff2"
        case "stl": "model/stl"
        case "txt": "text/plain; charset=utf-8"
        default: "application/octet-stream"
        }
    }
}
