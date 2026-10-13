import Foundation
import SwiftUI
import UniformTypeIdentifiers

struct RobotReceiptProvenance: Codable, Equatable {
    let appSourceCommit: String
    let frankenSimWorkspaceCommit: String
    let ownerKernelVersion: String
    let appVersion: String
    let appBuild: String
}

struct RobotRunReceipt: Codable, Equatable {
    static let schemaVersion = 1

    let schemaVersion: Int
    let exportedAt: Date
    let lab: String
    let engineState: String
    let detail: String
    let bridgeSequence: Int
    let capabilities: [String]
    let metrics: RobotEngineMetrics
    let provenance: RobotReceiptProvenance
}

struct RobotReceiptDocument: FileDocument {
    static var readableContentTypes: [UTType] { [.json] }

    let data: Data

    init(receipt: RobotRunReceipt) throws {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
        var encoded = try encoder.encode(receipt)
        encoded.append(0x0A)
        data = encoded
    }

    init(configuration: ReadConfiguration) throws {
        guard let contents = configuration.file.regularFileContents else {
            throw CocoaError(.fileReadCorruptFile)
        }
        data = contents
    }

    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        FileWrapper(regularFileWithContents: data)
    }
}

/// The original labs also export policies (including binary residual policies)
/// and full telemetry. Do not decode/re-encode these as native run receipts:
/// doing so loses the archive's exact coefficient bytes and experiment metadata.
struct RobotLabDownload: Identifiable, Equatable {
    // public.data also includes JSON. A concrete exported type keeps Files
    // from substituting .json when a user renames an original .bin policy.
    static let binaryPolicyType = UTType(exportedAs: "com.frankenrobots.gait-transformer-policy", conformingTo: .data)
    let id = UUID()
    let filename: String
    let data: Data

    var contentType: UTType {
        let extensionName = (filename as NSString).pathExtension.lowercased()
        if extensionName == "bin" { return Self.binaryPolicyType }
        return UTType(filenameExtension: extensionName) ?? .data
    }

    static func safeFilename(_ suggested: String) -> String {
        let basename = suggested.replacingOccurrences(of: "\\", with: "/")
            .components(separatedBy: "/").last ?? ""
        let cleaned = basename.components(separatedBy: .controlCharacters).joined()
            .replacingOccurrences(of: ":", with: "-")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        return cleaned.isEmpty || cleaned == "." || cleaned == ".."
            ? "FrankenRobots-export" : cleaned
    }

    static func allowsDownload(_ url: URL, sourceURL: URL?, baseURL: URL?) -> Bool {
        guard let baseURL, baseURL.port != nil, let sourceURL else { return false }
        func isEngineOrigin(_ candidate: URL) -> Bool {
            candidate.scheme == "http" && candidate.host == "127.0.0.1" &&
                candidate.port == baseURL.port && baseURL.scheme == "http" &&
                baseURL.host == "127.0.0.1" && candidate.user == nil && candidate.password == nil
        }
        guard isEngineOrigin(sourceURL) else { return false }
        if url.scheme == "blob" {
            guard let origin = URL(string: String(url.absoluteString.dropFirst(5))) else { return false }
            return isEngineOrigin(origin)
        }
        return isEngineOrigin(url)
    }
}

struct RobotLabDownloadDocument: FileDocument {
    static var readableContentTypes: [UTType] { [.json, RobotLabDownload.binaryPolicyType, .data] }
    let data: Data

    init(data: Data) { self.data = data }

    init(configuration: ReadConfiguration) throws {
        guard let contents = configuration.file.regularFileContents else {
            throw CocoaError(.fileReadCorruptFile)
        }
        data = contents
    }

    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        FileWrapper(regularFileWithContents: data)
    }
}

enum RobotReceiptExportError: LocalizedError {
    case noVersionedReceipt

    var errorDescription: String? {
        switch self {
        case .noVersionedReceipt:
            "A versioned owner receipt has not arrived yet."
        }
    }
}
