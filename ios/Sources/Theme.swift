import SwiftUI
import UIKit

enum RobotTheme {
    static let background = Color(red: 0.004, green: 0.018, blue: 0.027)
    static let panel = Color(red: 0.018, green: 0.043, blue: 0.057)
    static let panelRaised = Color(red: 0.026, green: 0.066, blue: 0.080)
    static let stroke = Color.white.opacity(0.10)
    static let cyan = Color(red: 0.25, green: 0.84, blue: 0.94)
    static let emerald = Color(red: 0.24, green: 0.82, blue: 0.60)
    static let amber = Color(red: 0.96, green: 0.67, blue: 0.25)
    static let text = Color(red: 0.93, green: 0.96, blue: 0.98)
    static let secondary = Color(red: 0.60, green: 0.68, blue: 0.76)

    static func size(_ base: CGFloat) -> CGFloat {
#if targetEnvironment(macCatalyst)
        base * 1.22
#else
        UIFontMetrics(forTextStyle: .body).scaledValue(for: base)
#endif
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
            .shadow(color: .black.opacity(0.34), radius: 22, y: 10)
    }
}
