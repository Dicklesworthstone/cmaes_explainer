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

enum RobotReceiptExportError: LocalizedError {
    case noVersionedReceipt

    var errorDescription: String? {
        switch self {
        case .noVersionedReceipt:
            "A versioned owner receipt has not arrived yet."
        }
    }
}
