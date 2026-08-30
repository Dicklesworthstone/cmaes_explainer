import SwiftUI

enum RobotLab: String, CaseIterable, Identifiable {
    case humanoid
    case arm

    var id: Self { self }

    var title: String {
        switch self {
        case .humanoid: "Humanoid"
        case .arm: "Robot Arm"
        }
    }

    var shortTitle: String {
        switch self {
        case .humanoid: "G1"
        case .arm: "iiwa14"
        }
    }

    var route: String { "/frankenrobots/\(rawValue)/" }

    var symbol: String {
        switch self {
        case .humanoid: "figure.walk.motion"
        case .arm: "move.3d"
        }
    }

    var accent: Color {
        switch self {
        case .humanoid: RobotTheme.cyan
        case .arm: RobotTheme.amber
        }
    }

    var eyebrow: String {
        switch self {
        case .humanoid: "29 DOF · 5,040-D POLICY · 480 HZ"
        case .arm: "7 DOF · 128-D TRAJECTORY · GRASP VERIFIED"
        }
    }

    var summary: String {
        switch self {
        case .humanoid:
            "Watch a source-bound Unitree G1 learn whole-body balance, stepping, and walking through gradient-free search."
        case .arm:
            "Teach a KUKA iiwa14 to grasp, carry, and place household objects under contact, friction, and hard limits."
        }
    }

    var facts: [(label: String, value: String)] {
        switch self {
        case .humanoid:
            [
                ("Physical plant", "29 source joints"),
                ("Controller", "15 × 42 × 8"),
                ("Experiment", "1.5 s · 720 steps"),
                ("Owner kernel", "Frankensim WASM"),
            ]
        case .arm:
            [
                ("Physical plant", "KUKA iiwa14"),
                ("Controller", "8 × 16 knots"),
                ("Tasks", "Mug · remote · trowel"),
                ("Success", "Grasp · carry · place"),
            ]
        }
    }
}
