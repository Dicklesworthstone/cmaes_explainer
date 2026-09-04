import SwiftUI
import UIKit

@main
struct FrankenRobotsApp: App {
    @AppStorage(RobotTheme.textScaleStorageKey) private var textScale = RobotTheme.defaultTextScale

    var body: some Scene {
        WindowGroup {
            FrankenRobotsView()
                .background(CatalystWindowFreedom())
#if targetEnvironment(macCatalyst)
                .frame(minWidth: 620, minHeight: 500)
#endif
        }
#if targetEnvironment(macCatalyst)
        .defaultSize(width: 1320, height: 880)
        .windowResizability(.contentMinSize)
#endif
        .commands {
            CommandMenu("Text Size") {
                Button("Make Text Bigger") {
                    textScale = RobotTheme.steppedTextScale(from: textScale, direction: 1)
                }
                .keyboardShortcut("+", modifiers: .command)
                .disabled(textScale >= RobotTheme.maximumTextScale)

                Button("Make Text Smaller") {
                    textScale = RobotTheme.steppedTextScale(from: textScale, direction: -1)
                }
                .keyboardShortcut("-", modifiers: .command)
                .disabled(textScale <= RobotTheme.minimumTextScale)

                Button("Actual Text Size") {
                    textScale = RobotTheme.defaultTextScale
                }
                .keyboardShortcut("0", modifiers: .command)
                .disabled(textScale == RobotTheme.defaultTextScale)
            }

            CommandMenu("Robot Lab") {
                Button("Humanoid Lab") {
                    NotificationCenter.default.post(name: .selectRobotLab, object: RobotLab.humanoid)
                }
                .keyboardShortcut("1", modifiers: .command)

                Button("Robot Arm Lab") {
                    NotificationCenter.default.post(name: .selectRobotLab, object: RobotLab.arm)
                }
                .keyboardShortcut("2", modifiers: .command)

                Divider()

                Button("Reload Engine") {
                    NotificationCenter.default.post(name: .reloadRobotEngine, object: nil)
                }
                .keyboardShortcut("r", modifiers: [.command, .shift])
            }
        }
    }
}

private struct CatalystWindowFreedom: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> Controller { Controller() }
    func updateUIViewController(_ controller: Controller, context: Context) { controller.configure() }

    final class Controller: UIViewController {
        override func viewDidAppear(_ animated: Bool) {
            super.viewDidAppear(animated)
            configure()
        }

        override func viewDidLayoutSubviews() {
            super.viewDidLayoutSubviews()
            configure()
        }

        func configure() {
#if targetEnvironment(macCatalyst)
            guard let restrictions = view.window?.windowScene?.sizeRestrictions else { return }
            restrictions.minimumSize = CGSize(width: 620, height: 500)
            restrictions.maximumSize = CGSize(width: 10_000, height: 10_000)
#endif
        }
    }
}

extension Notification.Name {
    static let selectRobotLab = Notification.Name("FrankenRobots.selectLab")
    static let reloadRobotEngine = Notification.Name("FrankenRobots.reloadEngine")
}
