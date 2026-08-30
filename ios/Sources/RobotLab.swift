import SwiftUI

enum RobotGuidePage: String, CaseIterable, Identifiable {
    case lab = "Lab"
    case physics = "Physics"
    case proof = "Proof"
    case frontier = "Frontier"

    var id: Self { self }
}

struct RobotGuideCard: Identifiable {
    let title: String
    let metric: String
    let detail: String
    let symbol: String

    var id: String { title }
}

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

    var guideCards: [RobotGuideCard] {
        switch self {
        case .humanoid:
            [
                RobotGuideCard(
                    title: "Whole-house challenge",
                    metric: "7 rooms · 74 objects",
                    detail: "Explore the complete 1928 Sears Craftsman estate, switch lighting, and inspect every room before returning to the live walk.",
                    symbol: "house.lodge.fill"
                ),
                RobotGuideCard(
                    title: "Disturbance lab",
                    metric: "Terrain + 15 N·s push",
                    detail: "Compare flat ground with the owner-scored terrain-and-push experiment, then apply an interactive shove during replay.",
                    symbol: "figure.fall"
                ),
                RobotGuideCard(
                    title: "Four-chapter story",
                    metric: "Puppet → mastery",
                    detail: "Jump between the standing prior, curriculum, footfall analysis, and obstacle-mastery views without losing the physical receipts.",
                    symbol: "book.pages.fill"
                ),
                RobotGuideCard(
                    title: "Policy research",
                    metric: "CMA · transformer · HPO",
                    detail: "Open the on-demand research annex for measured policy ablation, a live outer-loop trainer, and the latest upstream optimizer boundary.",
                    symbol: "brain.head.profile.fill"
                ),
            ]
        case .arm:
            [
                RobotGuideCard(
                    title: "Three physical tasks",
                    metric: "Mug · remote · trowel",
                    detail: "Each task changes the object, room, support, obstacle field, goal, and admitted grasp requirements—not just the label.",
                    symbol: "square.grid.3x3.square"
                ),
                RobotGuideCard(
                    title: "Grasp microscope",
                    metric: "Force · friction · state",
                    detail: "Inspect finite-pad engagement, gripper width, pinch force, Coulomb capacity, and the object halo at any trace sample.",
                    symbol: "scope"
                ),
                RobotGuideCard(
                    title: "Owner-routed safety",
                    metric: "Obstacle · self · object",
                    detail: "Conservative oriented-box queries expose clearance, collision risk, and query work in the same receipt as placement.",
                    symbol: "shield.lefthalf.filled"
                ),
                RobotGuideCard(
                    title: "Four-family race",
                    metric: "Full · sep · LM-CMA · LM-MA",
                    detail: "Run every owner implementation from one curriculum, seed, population, rollout, and evaluation budget at the honest 128-D scale.",
                    symbol: "flag.checkered"
                ),
            ]
        }
    }

    var physicsPipeline: [(title: String, detail: String)] {
        switch self {
        case .humanoid:
            [
                ("Policy", "15 locomotion rows read 42 physical signals through eight gait-phase basis terms; all 5,040 weights remain searchable."),
                ("Dynamics", "Frankensim integrates a free-floating whole-body model at a fixed 1/480 s step with real upper-body inertia and a disclosed arm reflex."),
                ("Contact", "Four compliant patches per foot produce force, moment, support polygon, slip, impact, and contact-schedule telemetry."),
                ("Objective", "Survival is lexicographically primary; work, slip, posture, impact, heading, lateral, speed, and terrain channels remain inspectable."),
                ("Rendering", "The scene consumes the owner’s 30 world-frame link poses. It does not recompute the winning motion in Swift or JavaScript."),
            ]
        case .arm:
            [
                ("Trajectory", "Seven joint curves plus one gripper-width curve, each sampled at sixteen knots, form the complete 128-D black-box policy."),
                ("Dynamics", "SE(3) kinematics, inverse-dynamics computed torque, Featherstone forward dynamics, hard limits, and a free object run together."),
                ("Contact", "Finite compliant pads earn a grasp only while translation and rotation demand remain inside the owner’s friction capacity."),
                ("Safety", "Obstacle, non-adjacent self, and proximal-object separation are evaluated by the owner’s conservative convex-query path."),
                ("Rendering", "The browser receives the object plus eight world poses verbatim; visual furniture never substitutes for collision receipts."),
            ]
        }
    }

    var proofFields: [String] {
        switch self {
        case .humanoid:
            [
                "Exact horizon and termination guard",
                "Distance, speed, work, slip, posture, and impact",
                "Support time, contacts, terrain, push, and censored recovery",
                "Joint-limit, heading, lateral, and contact-schedule integrals",
                "Live generation, sigma, objective, and owner-family comparison",
            ]
        case .arm:
            [
                "Reach error, lift, first grasp, release, and verified placement",
                "Gripper width, peak force, friction capacity, and grasp state",
                "Actuator work and collision-risk integral",
                "Certified clearance, possible-collision time, and query iterations",
                "Live generation, objective, storage shape, and four-family comparison",
            ]
        }
    }

    var frontierNotes: [(title: String, detail: String)] {
        switch self {
        case .humanoid:
            [
                ("Now in this app", "Whole-estate rendering, architectural room inspection, exploration sigma, live convergence, measured transformer ablation, and outer HPO are included from the latest source."),
                ("Now in FrankenSim source", "Deterministic NSGA-II/III and MOEA/D, versioned mating and normalization policies, reference-direction survival, Pareto/hypervolume utilities, and production WFG1–WFG9 evaluators materially extend the upstream optimization layer."),
                ("Not yet claimed", "Those many-objective APIs are not labeled as the active robot owner until a versioned browser ABI and robot receipt contract ship."),
            ]
        case .arm:
            [
                ("Now in this app", "The latest multi-obstacle owner path, full Craftsman task settings, tactile microscope, long-horizon continuation, and four-family physical race are bundled."),
                ("Now in FrankenSim source", "NSGA-II/III, MOEA/D, bounded Pareto archives, hypervolume accounting, and identity-bound WFG1–WFG9 studies can preserve and audit a frontier rather than collapsing placement, force, work, clearance, and risk into one scalar."),
                ("Not yet claimed", "The current arm owner still returns its disclosed scalar plus transparent physical channels; a Pareto robot ABI remains future integration work."),
            ]
        }
    }
}
