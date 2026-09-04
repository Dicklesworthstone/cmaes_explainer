import SwiftUI
import UniformTypeIdentifiers

struct FrankenRobotsView: View {
    @AppStorage(RobotAppearance.storageKey) private var appearance = RobotAppearance.dark.rawValue
    @AppStorage(RobotTheme.textScaleStorageKey) private var textScale = RobotTheme.defaultTextScale
    @StateObject private var engine = RobotEngineHost()
    @State private var lab: RobotLab = .humanoid
    @State private var showingDetails = false
    @State private var guidePage: RobotGuidePage = .lab
    @State private var receiptDocument: RobotReceiptDocument?
    @State private var showingReceiptExporter = false
    @State private var receiptExportError: String?

    init() {
#if DEBUG
        let environment = ProcessInfo.processInfo.environment
        if let rawLab = environment["FROBOTS_INITIAL_LAB"],
           let requestedLab = RobotLab(rawValue: rawLab.lowercased())
        {
            _lab = State(initialValue: requestedLab)
        }
        if environment["FROBOTS_SHOW_GUIDE"] == "1" {
            _showingDetails = State(initialValue: true)
        }
        if let rawPage = environment["FROBOTS_GUIDE_PAGE"],
           let requestedPage = RobotGuidePage.allCases.first(where: {
               $0.rawValue.caseInsensitiveCompare(rawPage) == .orderedSame
           })
        {
            _guidePage = State(initialValue: requestedPage)
        }
#endif
    }

    var body: some View {
        let _ = textScale
        GeometryReader { geometry in
            ZStack {
                RobotLabBackground()
                VStack(spacing: geometry.size.height < 650 ? 8 : 12) {
                    masthead(compact: geometry.size.height < 650)
                    labSelector
                    nativeCommandBar
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
        .onChange(of: lab) { _, value in
            guidePage = .lab
            engine.select(value)
        }
        .task { engine.select(lab) }
        .onReceive(NotificationCenter.default.publisher(for: .selectRobotLab)) { note in
            guard let value = note.object as? RobotLab else { return }
            lab = value
        }
        .onReceive(NotificationCenter.default.publisher(for: .reloadRobotEngine)) { _ in
            engine.reload()
        }
        .preferredColorScheme((RobotAppearance(rawValue: appearance) ?? .dark).colorScheme)
        .fileExporter(
            isPresented: $showingReceiptExporter,
            document: receiptDocument,
            contentType: .json,
            defaultFilename: "FrankenRobots-\(lab.rawValue)-receipt"
        ) { result in
            if case let .failure(error) = result {
                receiptExportError = error.localizedDescription
            }
        }
        .alert("Receipt export failed", isPresented: receiptExportErrorIsPresented) {
            Button("OK") { receiptExportError = nil }
        } message: {
            Text(receiptExportError ?? "The receipt could not be exported.")
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
            RobotAppearanceButton(selection: $appearance)
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
        .background(RobotTheme.statusBackground, in: Capsule())
        .overlay(Capsule().stroke(statusColor.opacity(0.30)))
        // The animated ProgressView can remain in SwiftUI's accessibility
        // cache after readiness changes. Expose one stable status element so
        // Voice Control and UI automation never resolve a stale loading child.
        .accessibilityElement(children: .ignore)
        .accessibilityIdentifier("robot-engine-status")
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
        case .running: "waveform.path.ecg"
        case .ready: "checkmark.seal.fill"
        case .failed: "exclamationmark.triangle.fill"
        }
    }

    private var statusLabel: String {
        switch engine.phase {
        case .starting: "Starting"
        case .loading: "Loading"
        case .running: "Optimizing"
        case .ready: "Owner ready"
        case .failed: "Needs attention"
        }
    }

    private var statusColor: Color {
        switch engine.phase {
        case .starting, .loading, .running: lab.accent
        case .ready: RobotTheme.emerald
        case .failed: .red
        }
    }

    private var isEngineBusy: Bool {
        engine.phase == .starting || engine.phase == .loading || engine.phase == .running
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
                    .font(.system(size: RobotTheme.size(10), weight: .bold, design: .rounded))
                    .lineLimit(1)
                    .padding(.horizontal, 5)
                    .frame(minHeight: 42)
            }
            .buttonStyle(.bordered)
            .tint(lab.accent)
            .accessibilityHint("Shows the current lab facts and engine diagnostics")
        }
    }

    private var nativeCommandBar: some View {
        VStack(spacing: lab == .humanoid ? 7 : 0) {
            if lab == .humanoid {
                nativeTaskPicker
            }
            Group {
                if horizontalStatusHasRoom {
                    HStack(spacing: 10) {
                        nativeCommandLabel(title: "NATIVE OWNER CONTROL")
                        Spacer(minLength: 8)
                        nativeCommandReceipt
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                        nativeOptimizeButton
                    }
                } else {
                    VStack(alignment: .leading, spacing: 7) {
                        HStack(spacing: 10) {
                            nativeCommandLabel(title: "OWNER CONTROL")
                            Spacer(minLength: 8)
                            nativeOptimizeButton
                        }
                        nativeCommandReceipt
                            .lineLimit(2)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, horizontalStatusHasRoom && lab != .humanoid ? 0 : 8)
        .frame(minHeight: 44)
        .background(RobotTheme.panel.opacity(0.82), in: RoundedRectangle(cornerRadius: 14))
    }

    private var nativeTaskPicker: some View {
        HStack(spacing: 10) {
            Label("PHYSICAL OBJECTIVE", systemImage: "figure.walk.motion")
                .font(.system(size: RobotTheme.size(8), weight: .bold, design: .monospaced))
                .foregroundStyle(RobotTheme.secondary)
                .lineLimit(1)
                .minimumScaleFactor(0.72)
            Picker(
                "Physical objective",
                selection: Binding(
                    get: { engine.activeHumanoidTask },
                    set: { engine.selectHumanoidTask($0) }
                )
            ) {
                ForEach(RobotLocomotionTask.allCases) { task in
                    Text(task.title).tag(task)
                }
            }
            .pickerStyle(.segmented)
            .frame(maxWidth: 310)
            .disabled(
                !engine.supportsTaskSelection || engine.phase != .ready || engine.pendingCommandID != nil
            )
            .accessibilityIdentifier("robot-native-task-picker")
            .accessibilityHint("Changes the owner-composed physical objective before learning starts")
        }
    }

    private func nativeCommandLabel(title: String) -> some View {
        Label(title, systemImage: "link.badge.plus")
            .font(.system(size: RobotTheme.size(8), weight: .bold, design: .monospaced))
            .foregroundStyle(RobotTheme.secondary)
            .lineLimit(1)
    }

    private var nativeCommandReceipt: some View {
        Text(nativeCommandReceiptText)
        .font(.system(size: RobotTheme.size(8.5), design: .rounded))
        .foregroundStyle(RobotTheme.secondary)
        .frame(maxWidth: .infinity, alignment: .leading)
        // Give assistive technologies one stable element whose label changes
        // with the visible receipt. Without the explicit label, SwiftUI can
        // leave XCTest and Voice Control holding the pre-command Text value
        // even while the rendered string has already changed to Accepted.
        .accessibilityElement(children: .ignore)
        .accessibilityIdentifier("robot-native-command-detail")
        .accessibilityLabel(nativeCommandReceiptText)
    }

    private var nativeCommandReceiptText: String {
        engine.commandDetail
            ?? (engine.supportsOptimize
                ? "Ready to start an owner optimization run."
                : "Waiting for the embedded owner controls…")
    }

    private var nativeOptimizeButton: some View {
        Button {
            if engine.phase == .running {
                engine.stopOptimization()
            } else {
                engine.optimize()
            }
        } label: {
            Label(
                engine.pendingCommandID == nil
                    ? (engine.phase == .running ? "Stop" : (engine.supportsOptimize ? "Start learning" : "Loading…"))
                    : "Sending…",
                systemImage: engine.phase == .running ? "stop.fill" : "sparkles"
            )
                .font(.system(size: RobotTheme.size(9.5), weight: .bold, design: .rounded))
                .lineLimit(1)
        }
        .buttonStyle(.borderedProminent)
        .tint(lab.accent)
        .disabled(
            (!engine.supportsOptimize || (engine.phase != .ready && engine.phase != .running))
                || engine.pendingCommandID != nil
        )
        .accessibilityIdentifier("robot-native-optimize")
        .accessibilityHint(
            engine.phase == .running
                ? "Stops continuous learning after the current physical generation"
                : "Starts continuous owner learning and keeps going until stopped"
        )
    }

    private var wideLayout: some View {
        HStack(spacing: 14) {
            stage
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            inspector
                .frame(width: 360)
        }
    }

    private func compactLayout(showFactStrip: Bool) -> some View {
        VStack(spacing: 10) {
            stage
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            if !engine.metrics.isEmpty {
                liveMetricStrip
            } else if showFactStrip {
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
                VStack(alignment: .leading, spacing: 16) {
                    HStack(spacing: 10) {
                        Image(systemName: lab.symbol)
                            .font(.system(size: RobotTheme.size(19), weight: .bold))
                        VStack(alignment: .leading, spacing: 2) {
                            Text("\(lab.title) Lab")
                                .font(.system(size: RobotTheme.size(18), weight: .bold, design: .rounded))
                            Text(lab.eyebrow)
                                .font(.system(size: RobotTheme.size(7.5), weight: .bold, design: .monospaced))
                                .foregroundStyle(RobotTheme.secondary)
                                .lineLimit(1)
                                .minimumScaleFactor(0.7)
                        }
                    }
                    .foregroundStyle(lab.accent)

                    Picker("Guide section", selection: $guidePage) {
                        ForEach(RobotGuidePage.allCases) { page in
                            Text(page.rawValue).tag(page)
                        }
                    }
                    .pickerStyle(.segmented)

                    liveRunMonitor

                    guideContent

                    Divider().overlay(RobotTheme.stroke)
                    engineBoundary
                }
                .padding(18)
            }
            .accessibilityIdentifier("robot-inspector-scroll")
            .scrollIndicators(.hidden)
        }
    }

    private var liveMetricStrip: some View {
        HStack(spacing: 8) {
            ForEach(liveMetricItems.prefix(3)) { item in
                VStack(alignment: .leading, spacing: 2) {
                    Text(item.label.uppercased())
                        .font(.system(size: RobotTheme.size(7.5), weight: .bold, design: .monospaced))
                        .foregroundStyle(RobotTheme.secondary)
                    Text(item.value)
                        .font(.system(size: RobotTheme.size(11), weight: .bold, design: .rounded))
                        .foregroundStyle(item.accent)
                        .lineLimit(1)
                        .minimumScaleFactor(0.72)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 11)
                .padding(.vertical, 8)
                .background(RobotTheme.panel.opacity(0.92), in: RoundedRectangle(cornerRadius: 12))
                .accessibilityElement(children: .combine)
                .accessibilityIdentifier("robot-live-\(item.id)")
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityIdentifier("robot-live-run-compact")
    }

    private var liveRunMonitor: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Label("LIVE OWNER RUN", systemImage: "waveform.path.ecg")
                    .font(.system(size: RobotTheme.size(8.5), weight: .bold, design: .monospaced))
                    .kerning(1.0)
                    .foregroundStyle(lab.accent)
                Spacer()
                Button {
                    exportReceipt()
                } label: {
                    Label("Export JSON", systemImage: "square.and.arrow.up")
                        .font(.system(size: RobotTheme.size(7.5), weight: .bold, design: .monospaced))
                }
                .buttonStyle(.borderless)
                .disabled(engine.metrics.isEmpty)
                .accessibilityIdentifier("robot-export-receipt")
                .accessibilityLabel("Export owner receipt as JSON")
                .accessibilityHint("Includes the current live metrics and bundled engine provenance")
                .help("Export the current versioned owner receipt as JSON")
                Text(statusLabel.uppercased())
                    .font(.system(size: RobotTheme.size(7.5), weight: .bold, design: .monospaced))
                    .foregroundStyle(statusColor)
            }

            if liveMetricItems.isEmpty {
                Text("Waiting for a versioned owner status receipt…")
                    .font(.system(size: RobotTheme.size(9.5), design: .rounded))
                    .foregroundStyle(RobotTheme.secondary)
            } else {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                    ForEach(liveMetricItems) { item in
                        VStack(alignment: .leading, spacing: 3) {
                            Text(item.label.uppercased())
                                .font(.system(size: RobotTheme.size(7.2), weight: .bold, design: .monospaced))
                                .foregroundStyle(RobotTheme.secondary)
                            Text(item.value)
                                .font(.system(size: RobotTheme.size(13), weight: .bold, design: .rounded))
                                .foregroundStyle(item.accent)
                                .lineLimit(1)
                                .minimumScaleFactor(0.7)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(10)
                        .background(RobotTheme.panelRaised.opacity(0.72), in: RoundedRectangle(cornerRadius: 12))
                        .accessibilityElement(children: .combine)
                        .accessibilityIdentifier("robot-live-\(item.id)")
                    }
                }
            }

            Text(engine.detail)
                .font(.system(size: RobotTheme.size(8.8), design: .rounded))
                .foregroundStyle(RobotTheme.secondary)
                .lineSpacing(2)
        }
        .accessibilityElement(children: .contain)
        .accessibilityIdentifier("robot-live-run")
    }

    private var receiptExportErrorIsPresented: Binding<Bool> {
        Binding(
            get: { receiptExportError != nil },
            set: { if !$0 { receiptExportError = nil } }
        )
    }

    private func exportReceipt() {
        do {
            receiptDocument = try engine.makeReceiptDocument()
            showingReceiptExporter = true
        } catch {
            receiptExportError = error.localizedDescription
        }
    }

    private var liveMetricItems: [LiveMetricItem] {
        var items: [LiveMetricItem] = []
        if let generation = engine.metrics.generation {
            items.append(.init(
                id: "generation",
                label: "Generation",
                value: generation.formatted(),
                accent: lab.accent
            ))
        }
        if let objective = engine.metrics.bestObjective {
            items.append(.init(
                id: "objective",
                label: "Best objective ↓",
                value: objective.formatted(.number.precision(.fractionLength(2))),
                accent: RobotTheme.emerald
            ))
        }
        if lab == .humanoid, let penetration = engine.metrics.bodyPenetrationMeters {
            items.append(.init(
                id: "body-penetration",
                label: "Body intrusion",
                value: (penetration * 100).formatted(.number.precision(.fractionLength(2))) + " cm",
                accent: penetration == 0 ? RobotTheme.emerald : .red
            ))
        }
        if lab == .arm, let clearance = engine.metrics.certifiedClearanceMeters {
            items.append(.init(
                id: "certified-clearance",
                label: "Clearance",
                value: (clearance * 100).formatted(.number.precision(.fractionLength(2))) + " cm",
                accent: RobotTheme.cyan
            ))
        }
        if let steps = engine.metrics.completedSteps {
            items.append(.init(id: "steps", label: "Owner steps", value: steps.formatted(), accent: RobotTheme.cyan))
        }
        if let placed = engine.metrics.placed {
            items.append(.init(
                id: "placed",
                label: "Placed",
                value: placed ? "Yes" : "Not yet",
                accent: placed ? RobotTheme.emerald : RobotTheme.amber
            ))
        }
        if lab == .arm, let risk = engine.metrics.collisionRiskIntegral {
            items.append(.init(
                id: "collision-risk",
                label: "Collision risk",
                value: risk.formatted(.number.precision(.fractionLength(4))) + " m·s",
                accent: risk == 0 ? RobotTheme.emerald : .red
            ))
        }
        if lab == .arm, let possibleTime = engine.metrics.possibleCollisionTimeSeconds {
            items.append(.init(
                id: "possible-collision",
                label: "Possible contact",
                value: possibleTime.formatted(.number.precision(.fractionLength(3))) + " s",
                accent: possibleTime == 0 ? RobotTheme.emerald : RobotTheme.amber
            ))
        }
        return items
    }

    @ViewBuilder
    private var guideContent: some View {
        switch guidePage {
        case .lab:
            Text(lab.summary)
                .font(.system(size: RobotTheme.size(11.5), design: .rounded))
                .foregroundStyle(RobotTheme.text)
                .lineSpacing(3)

            VStack(spacing: 10) {
                ForEach(lab.guideCards) { card in
                    HStack(alignment: .top, spacing: 11) {
                        Image(systemName: card.symbol)
                            .font(.system(size: RobotTheme.size(15), weight: .semibold))
                            .foregroundStyle(lab.accent)
                            .frame(width: 24)
                        VStack(alignment: .leading, spacing: 3) {
                            HStack(alignment: .firstTextBaseline) {
                                Text(card.title)
                                    .font(.system(size: RobotTheme.size(10.5), weight: .bold, design: .rounded))
                                    .foregroundStyle(RobotTheme.text)
                                Spacer(minLength: 6)
                                Text(card.metric)
                                    .font(.system(size: RobotTheme.size(7.8), weight: .bold, design: .monospaced))
                                    .foregroundStyle(lab.accent)
                                    .multilineTextAlignment(.trailing)
                            }
                            Text(card.detail)
                                .font(.system(size: RobotTheme.size(9.5), design: .rounded))
                                .foregroundStyle(RobotTheme.secondary)
                                .lineSpacing(2)
                        }
                    }
                    .padding(12)
                    .background(RobotTheme.panelRaised.opacity(0.72), in: RoundedRectangle(cornerRadius: 14))
                }
            }

        case .physics:
            VStack(spacing: 10) {
                ForEach(Array(lab.physicsPipeline.enumerated()), id: \.offset) { index, step in
                    HStack(alignment: .top, spacing: 11) {
                        Text("\(index + 1)")
                            .font(.system(size: RobotTheme.size(9), weight: .black, design: .rounded))
                            .foregroundStyle(RobotTheme.background)
                            .frame(width: 24, height: 24)
                            .background(lab.accent, in: Circle())
                        VStack(alignment: .leading, spacing: 3) {
                            Text(step.title)
                                .font(.system(size: RobotTheme.size(11), weight: .bold, design: .rounded))
                                .foregroundStyle(RobotTheme.text)
                            Text(step.detail)
                                .font(.system(size: RobotTheme.size(9.5), design: .rounded))
                                .foregroundStyle(RobotTheme.secondary)
                                .lineSpacing(2)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            }

        case .proof:
            VStack(alignment: .leading, spacing: 12) {
                Text("OWNER RECEIPT INCLUDES")
                    .font(.system(size: RobotTheme.size(8.5), weight: .bold, design: .monospaced))
                    .kerning(1.1)
                    .foregroundStyle(RobotTheme.emerald)
                ForEach(lab.proofFields, id: \.self) { field in
                    Label(field, systemImage: "checkmark.seal.fill")
                        .font(.system(size: RobotTheme.size(9.8), design: .rounded))
                        .foregroundStyle(RobotTheme.text)
                        .labelStyle(ProofLabelStyle(accent: RobotTheme.emerald))
                }
                Divider().overlay(RobotTheme.stroke)
                ForEach(Array(lab.facts.enumerated()), id: \.offset) { _, fact in
                    HStack(alignment: .firstTextBaseline, spacing: 10) {
                        Text(fact.label).foregroundStyle(RobotTheme.secondary)
                        Spacer(minLength: 8)
                        Text(fact.value)
                            .foregroundStyle(RobotTheme.text)
                            .multilineTextAlignment(.trailing)
                    }
                    .font(.system(size: RobotTheme.size(10), design: .rounded))
                }
            }

        case .frontier:
            VStack(spacing: 10) {
                ForEach(Array(lab.frontierNotes.enumerated()), id: \.offset) { index, note in
                    VStack(alignment: .leading, spacing: 5) {
                        Text(note.title.uppercased())
                            .font(.system(size: RobotTheme.size(8), weight: .bold, design: .monospaced))
                            .kerning(0.9)
                            .foregroundStyle(index == 2 ? RobotTheme.amber : lab.accent)
                        Text(note.detail)
                            .font(.system(size: RobotTheme.size(9.8), design: .rounded))
                            .foregroundStyle(RobotTheme.text)
                            .lineSpacing(2)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(12)
                    .background(RobotTheme.panelRaised.opacity(0.72), in: RoundedRectangle(cornerRadius: 14))
                }
            }
        }
    }

    private var engineBoundary: some View {
        VStack(alignment: .leading, spacing: 9) {
            Text("LIVE ENGINE BOUNDARY")
                .font(.system(size: RobotTheme.size(8.5), weight: .bold, design: .monospaced))
                .kerning(1.1)
                .foregroundStyle(RobotTheme.emerald)
            Text(engine.detail)
                .font(.system(size: RobotTheme.size(9.8), design: .rounded))
                .foregroundStyle(RobotTheme.text)
                .lineSpacing(2)
            Label(
                engine.crossOriginIsolated ? "Threaded worker lane" : "Compatibility worker lane",
                systemImage: engine.crossOriginIsolated ? "cpu.fill" : "cpu"
            )
            .font(.system(size: RobotTheme.size(9.3), weight: .semibold, design: .rounded))
            .foregroundStyle(statusColor)

            provenanceRow("App source", engine.sourceCommit)
            provenanceRow("FrankenSim workspace", engine.frankenSimCommit)
            provenanceRow("Robot owner", engine.ownerKernelVersion)

            Text("The FrankenSim workspace revision records the upstream source inspected for this build. The versioned robot-owner artifact remains a separate, fail-closed runtime boundary.")
                .font(.system(size: RobotTheme.size(8.6), design: .rounded))
                .foregroundStyle(RobotTheme.secondary)
                .lineSpacing(2)

            Button {
                engine.reload()
            } label: {
                Label("Reload Engine", systemImage: "arrow.clockwise")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
            .tint(lab.accent)

            Text("All simulation data stays in this app. Bundled assets run through a loopback-only origin so Web Workers and Frankensim WASM need no remote service.")
                .font(.system(size: RobotTheme.size(8.8), design: .rounded))
                .foregroundStyle(RobotTheme.secondary)
                .lineSpacing(2)
        }
    }

    private func provenanceRow(_ label: String, _ value: String) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 8) {
            Text(label).foregroundStyle(RobotTheme.secondary)
            Spacer(minLength: 6)
            Text(value)
                .foregroundStyle(RobotTheme.text)
                .multilineTextAlignment(.trailing)
                .textSelection(.enabled)
        }
        .font(.system(size: RobotTheme.size(8.5), design: .monospaced))
    }
}

private struct LiveMetricItem: Identifiable {
    let id: String
    let label: String
    let value: String
    let accent: Color
}

private struct ProofLabelStyle: LabelStyle {
    let accent: Color

    func makeBody(configuration: Configuration) -> some View {
        HStack(alignment: .top, spacing: 9) {
            configuration.icon.foregroundStyle(accent)
            configuration.title
        }
    }
}
