import SwiftUI

struct FrankenRobotsView: View {
    @StateObject private var engine = RobotEngineHost()
    @State private var lab: RobotLab = .humanoid
    @State private var showingDetails = false

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                RobotLabBackground()
                VStack(spacing: geometry.size.height < 650 ? 8 : 12) {
                    masthead(compact: geometry.size.height < 650)
                    labSelector
                    if geometry.size.width >= 920 {
                        wideLayout
                    } else {
                        compactLayout(showFactStrip: geometry.size.width >= 680)
                    }
                }
                .padding(.horizontal, geometry.size.width >= 680 ? 18 : 12)
                .padding(.top, geometry.size.height < 650 ? 8 : 12)
                .padding(.bottom, geometry.safeAreaInsets.bottom > 0 ? 4 : 10)
            }
        }
        .onChange(of: lab) { _, value in engine.select(value) }
        .onReceive(NotificationCenter.default.publisher(for: .selectRobotLab)) { note in
            guard let value = note.object as? RobotLab else { return }
            lab = value
        }
        .onReceive(NotificationCenter.default.publisher(for: .reloadRobotEngine)) { _ in
            engine.reload()
        }
        .sheet(isPresented: $showingDetails) {
            NavigationStack {
                inspector
                    .padding(16)
                    .background(RobotLabBackground())
                    .navigationTitle("\(lab.title) Lab")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .confirmationAction) {
                            Button("Done") { showingDetails = false }
                        }
                    }
            }
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
        }
    }

    private func masthead(compact: Bool) -> some View {
        HStack(spacing: compact ? 9 : 12) {
            Image("MonsterIcon")
                .resizable()
                .scaledToFill()
                .frame(width: compact ? 42 : 52, height: compact ? 42 : 52)
                .clipShape(RoundedRectangle(cornerRadius: compact ? 10 : 13, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: compact ? 10 : 13).stroke(RobotTheme.emerald.opacity(0.42)))
                .shadow(color: RobotTheme.cyan.opacity(0.28), radius: 11)
                .accessibilityLabel("Friendly FrankenRobots inventor")

            VStack(alignment: .leading, spacing: compact ? 0 : 2) {
                FrankenRobotsWordmark()
                if !compact {
                    Text("ROBOT_FORGE // private · physical · gradient-free")
                        .font(.system(size: RobotTheme.size(8.5), weight: .bold, design: .monospaced))
                        .kerning(0.8)
                        .foregroundStyle(RobotTheme.secondary)
                        .lineLimit(1)
                        .minimumScaleFactor(0.75)
                }
            }
            Spacer(minLength: 8)
            engineStatus
        }
    }

    private var engineStatus: some View {
        HStack(spacing: 7) {
            Image(systemName: statusSymbol)
                .symbolEffect(.pulse, isActive: isEngineBusy)
            if horizontalStatusHasRoom {
                Text(statusLabel).lineLimit(1)
            }
            if isEngineBusy { ProgressView().controlSize(.small) }
        }
        .font(.system(size: RobotTheme.size(9.5), weight: .bold, design: .rounded))
        .foregroundStyle(statusColor)
        .padding(.horizontal, 11)
        .frame(minHeight: 38)
        .background(Color.black.opacity(0.38), in: Capsule())
        .overlay(Capsule().stroke(statusColor.opacity(0.30)))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Engine status: \(statusLabel)")
    }

    private var horizontalStatusHasRoom: Bool {
#if targetEnvironment(macCatalyst)
        true
#else
        UIDevice.current.userInterfaceIdiom == .pad
#endif
    }

    private var statusSymbol: String {
        switch engine.phase {
        case .starting, .loading: "bolt.horizontal.circle"
        case .ready: "checkmark.seal.fill"
        case .failed: "exclamationmark.triangle.fill"
        }
    }

    private var statusLabel: String {
        switch engine.phase {
        case .starting: "Starting"
        case .loading: "Loading"
        case .ready: "Lab loaded"
        case .failed: "Needs attention"
        }
    }

    private var statusColor: Color {
        switch engine.phase {
        case .starting, .loading: lab.accent
        case .ready: RobotTheme.emerald
        case .failed: .red
        }
    }

    private var isEngineBusy: Bool {
        engine.phase == .starting || engine.phase == .loading
    }

    private var labSelector: some View {
        HStack(spacing: 10) {
            Picker("Robot laboratory", selection: $lab) {
                ForEach(RobotLab.allCases) { item in
                    Label(item.title, systemImage: item.symbol).tag(item)
                }
            }
            .pickerStyle(.segmented)
            .frame(maxWidth: 420)

            Spacer(minLength: 0)

            Button {
                showingDetails = true
            } label: {
                Label("Lab guide", systemImage: "slider.horizontal.3")
                    .labelStyle(.iconOnly)
                    .frame(width: 42, height: 42)
            }
            .buttonStyle(.bordered)
            .tint(lab.accent)
            .accessibilityHint("Shows the current lab facts and engine diagnostics")
        }
    }

    private var wideLayout: some View {
        HStack(spacing: 14) {
            stage
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            inspector
                .frame(width: 300)
        }
    }

    private func compactLayout(showFactStrip: Bool) -> some View {
        VStack(spacing: 10) {
            stage
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            if showFactStrip {
                HStack(spacing: 8) {
                    ForEach(Array(lab.facts.prefix(3).enumerated()), id: \.offset) { _, fact in
                        VStack(alignment: .leading, spacing: 2) {
                            Text(fact.label.uppercased())
                                .font(.system(size: RobotTheme.size(7.5), weight: .bold, design: .monospaced))
                                .foregroundStyle(RobotTheme.secondary)
                            Text(fact.value)
                                .font(.system(size: RobotTheme.size(10.5), weight: .semibold, design: .rounded))
                                .foregroundStyle(RobotTheme.text)
                                .lineLimit(1)
                                .minimumScaleFactor(0.72)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 11)
                        .padding(.vertical, 8)
                        .background(RobotTheme.panel.opacity(0.88), in: RoundedRectangle(cornerRadius: 12))
                    }
                }
            }
        }
    }

    private var stage: some View {
        RobotPanel(accent: lab.accent) {
            ZStack {
                RobotEngineWebView(webView: engine.webView)
                    .clipShape(RoundedRectangle(cornerRadius: 21, style: .continuous))

                if case let .failed(message) = engine.phase {
                    engineFailure(message)
                }

                VStack {
                    Spacer()
                    HStack(spacing: 8) {
                        Circle()
                            .fill(lab.accent)
                            .frame(width: 7, height: 7)
                            .shadow(color: lab.accent, radius: 5)
                        Text(lab.eyebrow)
                            .font(.system(size: RobotTheme.size(8), weight: .bold, design: .monospaced))
                            .foregroundStyle(RobotTheme.text.opacity(0.84))
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                        Spacer()
                        Text("SOURCE \(engine.sourceCommit)")
                            .font(.system(size: RobotTheme.size(7.5), weight: .medium, design: .monospaced))
                            .foregroundStyle(RobotTheme.secondary)
                            .lineLimit(1)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(.ultraThinMaterial)
                }
                .allowsHitTesting(false)
            }
        }
        .accessibilityIdentifier("robot-stage")
    }

    private func engineFailure(_ message: String) -> some View {
        VStack(spacing: 14) {
            Image(systemName: "wrench.and.screwdriver.fill")
                .font(.system(size: 34))
                .foregroundStyle(lab.accent)
            Text("Engine bundle needs attention")
                .font(.system(size: RobotTheme.size(18), weight: .bold, design: .rounded))
                .foregroundStyle(RobotTheme.text)
            Text(message)
                .font(.system(size: RobotTheme.size(11), design: .rounded))
                .foregroundStyle(RobotTheme.secondary)
                .multilineTextAlignment(.center)
                .frame(maxWidth: 420)
            Button("Try Again") { engine.reload() }
                .buttonStyle(.borderedProminent)
                .tint(lab.accent)
        }
        .padding(28)
        .background(RobotTheme.background.opacity(0.94), in: RoundedRectangle(cornerRadius: 20))
        .padding(18)
    }

    private var inspector: some View {
        RobotPanel(accent: lab.accent) {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    Label(lab.title, systemImage: lab.symbol)
                        .font(.system(size: RobotTheme.size(19), weight: .bold, design: .rounded))
                        .foregroundStyle(lab.accent)

                    Text(lab.summary)
                        .font(.system(size: RobotTheme.size(12), design: .rounded))
                        .foregroundStyle(RobotTheme.text)
                        .lineSpacing(3)

                    Divider().overlay(RobotTheme.stroke)

                    VStack(spacing: 10) {
                        ForEach(Array(lab.facts.enumerated()), id: \.offset) { _, fact in
                            HStack(alignment: .firstTextBaseline, spacing: 10) {
                                Text(fact.label)
                                    .foregroundStyle(RobotTheme.secondary)
                                Spacer(minLength: 8)
                                Text(fact.value)
                                    .foregroundStyle(RobotTheme.text)
                                    .multilineTextAlignment(.trailing)
                            }
                            .font(.system(size: RobotTheme.size(10.5), design: .rounded))
                        }
                    }

                    Divider().overlay(RobotTheme.stroke)

                    VStack(alignment: .leading, spacing: 8) {
                        Text("ENGINE BOUNDARY")
                            .font(.system(size: RobotTheme.size(9), weight: .bold, design: .monospaced))
                            .kerning(1.2)
                            .foregroundStyle(RobotTheme.emerald)
                        Text(engine.detail)
                            .font(.system(size: RobotTheme.size(10.5), design: .rounded))
                            .foregroundStyle(RobotTheme.secondary)
                        Label(
                            engine.crossOriginIsolated ? "Threaded worker lane" : "Compatibility worker lane",
                            systemImage: engine.crossOriginIsolated ? "cpu.fill" : "cpu"
                        )
                        .font(.system(size: RobotTheme.size(9.5), weight: .semibold, design: .rounded))
                        .foregroundStyle(statusColor)
                    }

                    Button {
                        engine.reload()
                    } label: {
                        Label("Reload Engine", systemImage: "arrow.clockwise")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.bordered)
                    .tint(lab.accent)

                    Text("All simulation data stays in this app. The production engine is served from a loopback-only bundled origin so Web Workers and Frankensim WASM can run without a remote service.")
                        .font(.system(size: RobotTheme.size(9.5), design: .rounded))
                        .foregroundStyle(RobotTheme.secondary)
                        .lineSpacing(2)
                }
                .padding(18)
            }
            .scrollIndicators(.hidden)
        }
    }
}
