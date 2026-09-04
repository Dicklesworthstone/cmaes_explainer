import SwiftUI
import UIKit

enum RobotAppearance: String {
    static let storageKey = "frankenrobots.appearance"

    case dark
    case light

    var colorScheme: ColorScheme {
        self == .dark ? .dark : .light
    }
}

enum RobotTheme {
    static let textScaleStorageKey = "frankenrobots.textScale"
    static let defaultTextScale = 1.0
    static let minimumTextScale = 0.8
    static let maximumTextScale = 1.5
    private static let textScaleStep = 0.1

    static let background = adaptive(
        dark: UIColor(red: 0.004, green: 0.018, blue: 0.027, alpha: 1),
        light: UIColor(red: 0.925, green: 0.961, blue: 0.969, alpha: 1)
    )
    static let panel = adaptive(
        dark: UIColor(red: 0.018, green: 0.043, blue: 0.057, alpha: 1),
        light: UIColor(red: 0.985, green: 0.996, blue: 0.997, alpha: 1)
    )
    static let panelRaised = adaptive(
        dark: UIColor(red: 0.026, green: 0.066, blue: 0.080, alpha: 1),
        light: UIColor(red: 0.865, green: 0.931, blue: 0.942, alpha: 1)
    )
    static let stroke = adaptive(
        dark: UIColor(white: 1, alpha: 0.10),
        light: UIColor(red: 0.055, green: 0.230, blue: 0.275, alpha: 0.18)
    )
    static let cyan = adaptive(
        dark: UIColor(red: 0.25, green: 0.84, blue: 0.94, alpha: 1),
        light: UIColor(red: 0.025, green: 0.425, blue: 0.525, alpha: 1)
    )
    static let emerald = adaptive(
        dark: UIColor(red: 0.24, green: 0.82, blue: 0.60, alpha: 1),
        light: UIColor(red: 0.015, green: 0.405, blue: 0.255, alpha: 1)
    )
    static let amber = adaptive(
        dark: UIColor(red: 0.96, green: 0.67, blue: 0.25, alpha: 1),
        light: UIColor(red: 0.665, green: 0.345, blue: 0.005, alpha: 1)
    )
    static let text = adaptive(
        dark: UIColor(red: 0.93, green: 0.96, blue: 0.98, alpha: 1),
        light: UIColor(red: 0.035, green: 0.105, blue: 0.135, alpha: 1)
    )
    static let secondary = adaptive(
        dark: UIColor(red: 0.60, green: 0.68, blue: 0.76, alpha: 1),
        light: UIColor(red: 0.255, green: 0.345, blue: 0.375, alpha: 1)
    )
    static let statusBackground = adaptive(
        dark: UIColor(white: 0, alpha: 0.38),
        light: UIColor(red: 0.82, green: 0.905, blue: 0.92, alpha: 0.96)
    )
    static let shadow = adaptive(
        dark: UIColor(white: 0, alpha: 0.34),
        light: UIColor(red: 0.055, green: 0.18, blue: 0.21, alpha: 0.16)
    )

    private static func adaptive(dark: UIColor, light: UIColor) -> Color {
        Color(uiColor: UIColor { traits in
            traits.userInterfaceStyle == .dark ? dark : light
        })
    }

    static func size(_ base: CGFloat) -> CGFloat {
        let stored = UserDefaults.standard.object(forKey: textScaleStorageKey) as? Double
        let textScale = clampedTextScale(stored ?? defaultTextScale)
#if targetEnvironment(macCatalyst)
        return base * 1.22 * textScale
#else
        return UIFontMetrics(forTextStyle: .body).scaledValue(for: base) * textScale
#endif
    }

    static func clampedTextScale(_ value: Double) -> Double {
        min(max(value, minimumTextScale), maximumTextScale)
    }

    static func steppedTextScale(from value: Double, direction: Int) -> Double {
        let stepped = (value * 10).rounded() / 10 + Double(direction) * textScaleStep
        return clampedTextScale(stepped)
    }
}

struct RobotAppearanceButton: View {
    @Binding var selection: String

    private var appearance: RobotAppearance {
        RobotAppearance(rawValue: selection) ?? .dark
    }

    var body: some View {
        Button {
            selection = appearance == .dark
                ? RobotAppearance.light.rawValue
                : RobotAppearance.dark.rawValue
        } label: {
            Image(systemName: appearance == .dark ? "sun.max.fill" : "moon.stars.fill")
                .font(.system(size: RobotTheme.size(15), weight: .bold))
                .foregroundStyle(appearance == .dark ? RobotTheme.amber : RobotTheme.cyan)
                .frame(width: 44, height: 44)
                .background(RobotTheme.statusBackground, in: Circle())
                .overlay(Circle().stroke(RobotTheme.stroke, lineWidth: 1))
        }
        .buttonStyle(.plain)
        .accessibilityIdentifier("appearance-toggle")
        .accessibilityLabel(appearance == .dark ? "Switch to light mode" : "Switch to dark mode")
        .accessibilityValue(appearance == .dark ? "Dark mode" : "Light mode")
        .accessibilityHint("Remembers this choice for future launches")
    }
}

struct RobotLabBackground: View {
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    var body: some View {
        ZStack {
            RobotTheme.background
            RadialGradient(
                colors: [RobotTheme.emerald.opacity(reduceTransparency ? 0.06 : 0.17), .clear],
                center: .topLeading,
                startRadius: 0,
                endRadius: 720
            )
            RadialGradient(
                colors: [RobotTheme.cyan.opacity(reduceTransparency ? 0.03 : 0.10), .clear],
                center: .bottomTrailing,
                startRadius: 0,
                endRadius: 820
            )
            if !reduceTransparency {
                Canvas { context, size in
                    var grid = Path()
                    let step: CGFloat = 46
                    stride(from: CGFloat.zero, through: size.width, by: step).forEach { x in
                        grid.move(to: CGPoint(x: x, y: 0))
                        grid.addLine(to: CGPoint(x: x, y: size.height))
                    }
                    stride(from: CGFloat.zero, through: size.height, by: step).forEach { y in
                        grid.move(to: CGPoint(x: 0, y: y))
                        grid.addLine(to: CGPoint(x: size.width, y: y))
                    }
                    context.stroke(grid, with: .color(RobotTheme.cyan.opacity(0.026)), lineWidth: 0.7)
                }
            }
        }
        .ignoresSafeArea()
        .accessibilityHidden(true)
    }
}

struct FrankenRobotsWordmark: View {
    var body: some View {
        (
            Text("F")
                .font(.system(size: RobotTheme.size(22), weight: .black, design: .rounded))
                .foregroundColor(RobotTheme.text)
            + Text("RANKEN")
                .font(.system(size: RobotTheme.size(15), weight: .black, design: .rounded))
                .foregroundColor(RobotTheme.text)
            + Text("ROBOTS")
                .font(.system(size: RobotTheme.size(22), weight: .black, design: .rounded))
                .foregroundColor(RobotTheme.cyan)
        )
        .kerning(0.5)
        .lineLimit(1)
        .minimumScaleFactor(0.68)
        .allowsTightening(true)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("FrankenRobots")
    }
}

struct RobotPanel<Content: View>: View {
    let accent: Color
    @ViewBuilder var content: Content

    var body: some View {
        content
            .background(RobotTheme.panel.opacity(0.94), in: RoundedRectangle(cornerRadius: 22, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .stroke(
                        LinearGradient(
                            colors: [accent.opacity(0.38), RobotTheme.stroke, RobotTheme.emerald.opacity(0.18)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 1
                    )
            }
            .shadow(color: RobotTheme.shadow, radius: 22, y: 10)
    }
}
