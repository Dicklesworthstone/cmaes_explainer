# W2 Comprehensive Six-Lens Audit — cmaes_explainer (2026-08-28)

Auditor: StormyBluff (omp). Site served from production build (`next build` + `next start`, :3200).
Evidence dirs: tmp/overflow-audit-*, tmp/vision-qa-*, tmp/ui-audit/. Severity 0-4 (4=critical).

## Detector baseline (First 5 Minutes)
- overflow-audit chromium 390/375/320 base+stress: ALL PASS, 0 errors. No layout-viewport inflation.
- overflow-audit webkit (installed v2227): no inflation, but 2 console errors per case: "WebGL: context lost." → P2.
- css-brace-check app/globals.css: balanced (54/54).
- visual-slop-grep: 16 flags → all adjudicated below (V1).
- PCRE2 sweep: no `transition-all`, no `mix(x,x,`; scrollIntoView usage justified (page-level jumps; dock pill uses manual scrollTo — correct); `ssr:false` only in comments.
- loop-inventory: 2 intervals (250ms/180ms) + 3 rAF chains at idle — library internals (framer-motion frameloop, GSAP ticker); app-level pollers bounded (MathProvider ≤10s, three-patch ≤1.2s) → P3/P4.
- vision-qa smoke: iphone PASS; desktop "65/100 animation frames" timeout → reproduced as HEADLESS-THROTTLE ARTIFACT (C2).

## Findings

### Visual system — V1 (sev 0, justified)
Coherent project-native system (glass cards, role-based accents sky/cyan/indigo + warm amber badges, type ladder, font-display display face). Slop hits adjudicated:
- Hero ambient blobs (incl. indigo-500/15): deliberate 3-blob atmosphere system matching site palette — decision, not inheritance.
- Hero gradient headline: palette-derived signature motif; legible (screenshot-verified).
- border-l-4 callouts ×3: semantic blockquote pull-quote (CmaesIntro:1070), thesis callout (TechnicalAddendum:28), one section container (WhyILove:61) — editorial devices, not card-strip defaults.
- grid-cols-3 hits ×11: content-derived grids; several non-uniform (WhyILove 5 pillars + intentional col-span-2). Legitimate.
Action: none (justified in this report rather than inline comments, to keep sibling diffs clean).

### Mobile — M1 (sev 2): slider scroll-traps
globals.css:139 `.touch-none` (touch-action:none) on range inputs: 41 full-width 44px-tall bands where a vertical swipe cannot scroll the page. Fix: `touch-action: pan-y` (horizontal thumb drags still work; vertical passes to page scroll).

### Mobile — M2 (sev 1): sub-comfort touch targets
Dock pills + header links h=32px; header icon buttons 34/38px. WCAG 2.5.8 AA passes (≥24px); 44px comfort missed. Fix: bump paddings/min-heights on Navbar controls.

### Mobile — M3 (sev 0): overflow PASS both engines; WebKit errors tracked as P2.

### Performance — P1 (sev 2, REVISED after instrumented re-measurement): heatmap raster on the load path
Initial attribution (3 long tasks 295+216+203ms on section entry) did NOT reproduce on a clean instrumented re-run
(buffered PerformanceObserver: entry phase produced ZERO >80ms tasks). The deterministic cost is at LOAD: 253ms +
128ms long tasks in the first second, from the unconditional mount-time buildHeatmapCanvas (kernel init + 1080×760
raster; effect deps [activeLandscapeKey, landscape], CmaesIntro.tsx:405). Landscape switches re-measured <100ms.
Fix applied (win in both worlds): deferred to requestIdleCallback (timeout 3s, setTimeout 800 fallback); the render
loop draws grid+markers until the backdrop lands.

### Performance — P2 (sev 2): 9 simultaneous WebGL contexts → context loss in WebKit
20 canvases, 9 GL contexts mounted eagerly on a single route (WingViz×2, TransformerViz×2, BridgeViz×2, CovarianceScene, CMAESPhaseSpaceViewer, G1WalkingFlagship). Headless WebKit lost contexts at every width; iOS Safari risk class. Fix: mount-gate each GL Canvas subtree on in-view (rootMargin ≈ 600px) so offscreen scenes release their contexts; frameloop gating stays as-is.

### Performance — P3 (sev 1, justified): perpetual idle rAF chains
Attributed to framer-motion frameloop + GSAP ticker internals; zero >50ms long tasks at idle; cadence cost small. Decorative CSS pulse/ping mitigated via A1. Library surgery rejected (risk ≫ measurable win).

### Performance — P4 (sev 0): app pollers bounded. No action.

### Correctness — C1 (sev 0): PASS
Zero console errors/warnings, zero pageerrors across full desktop scroll-through; overflow audit clean; hydration stable (MathJax startup.typeset:false + post-hydration typeset holds).

### Correctness — C2 (sev 0, environment artifact): keyboard shortcuts + desktop vision smoke
Apparent "modal can never close / j-k dead / 65/100 frames" reproduced ONLY in the throttled shared headless tab. With `--disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding`: `j` scrolls (y=1257), `?` opens, `?` closes (unmount verified), Escape closes (unmount verified). Real behavior CORRECT. Lesson recorded: headless background tabs throttle rAF/smooth-scroll; all behavioral verdicts in this campaign were re-validated unthrottled.

### Honesty — H1/H2 (sev 0): PASS
Versioned kernel badges (InternalsLab "kernel: WASM step (fs-cmaes-viz-wasm)", honest unloaded/fallback states), explicit native|wasm_iframe engine toggle, fail-closed adapters (README + code verified), live Gen/Evals counters wired to real state. No canned-live demos, no dead sliders (mix-to-self grep clean).

### Usability — U1 (sev 2): shortcuts modal semantics
Modal overlay lacks role="dialog" + aria-modal; focus never moves into modal on open (focus stays behind overlay); backdrop onKeyDown(Escape) is dead code because focus never enters it (global handler covers Esc — verified). Fix: dialog role/aria-modal, focus close-button on open, restore focus on close.

### Usability — U2 (sev 0, downgraded): equation container focus ring
The tabIndex={0} region already renders a focus ring via `focus:ring-1 focus:ring-sky-500/50` (box-shadow) —
the audit probe had measured `outline`, the wrong property. No fix needed.

### A11y — A1 (sev 2): decorative animations ignore prefers-reduced-motion
Under emulated reduce: 5 CSS animations still running (animate-pulse/ping status dots + sparkles). Fix: global reduced-motion kill for decorative animate-* classes in globals.css (status remains readable as static dots).

### Keyboard — K1 (sev 0): PASS (unthrottled verification)
Skip-link first Tab hit, focus-visible rings on interactive elements, j/k/d/m/t/? all function, Esc closes modal + menu, body scroll locks while open.

## Fix plan (all in-place, reserved set)
1. CmaesIntro.tsx: idle pre-warm heatmap (P1)
2. 6 GL components: in-view mount gating (P2)
3. globals.css: pan-y sliders (M1) + reduced-motion kill (A1)
4. Navbar.tsx: dialog semantics + focus mgmt (U1) + 44px targets (M2)
5. (dropped) ColorizedEquation focus ring — U2 downgraded to sev 0; existing ring sufficient.
6. frankensimCmaes.ts: G1ObjectiveReceipt gains optional `fell?: boolean` (sibling consumers landed first).

## Second-pass close-out (2026-08-28, independent reviewer)

Decorrelated fresh-eyes re-read of b37f089 + fresh gates on the current
revision (includes sibling kernel v055→v056 bump).

### Fix verification — all six items confirmed in code
P1 CmaesIntro idle prewarm (live-guard + cancel both paths); P2 mount gates on
all 7 canvases / 6 components (600px, true unmount); M1 pan-y; M2 44px mobile
targets; U1 dialog role/aria-modal/focus-in/restore; A1 reduced-motion kill.

### New finding fixed this pass
- U1-residual (sev 2): shortcuts modal had no Tab focus containment — physical
  focus could cycle out of an aria-modal dialog. Fixed in Navbar.tsx
  (trapDialogTab, wrap within visible focusables). Behavioral verification
  (tmp/modal-focus-check.mjs): ? opens → close button holds focus → Tab and
  Shift+Tab contained → Escape closes → focus restored to skip link → j still
  navigates; zero console errors.

### Fresh gates (current tree)
- bun lint 0 findings · tsc --noEmit clean · bun test 26/26 (288 asserts) ·
  bun run build pass.
- overflow-audit --browser both (tmp/overflow-audit-2026-08-28T06-30-21-868Z):
  0 layout-viewport inflation, all widths, both engines, base+letter-spacing.
  WebKit 390/375 report 2× "console: WebGL: context lost." — classified
  environment noise, not a page defect: three.js r181 registers
  webglcontextlost preventDefault + auto re-init on restore
  (three.module.js:16110-16140); Chromium shows 0 errors at every width;
  mount-gating bounds live contexts to the near-viewport. Real-device Safari
  caveat unchanged (release-critical mobile work still ends on hardware).
- loop-inventory: same bounded framer-motion/GSAP chains as P3 (justified).

### Vision-QA — full manifest now completes cleanly
Harness fixes were required first (all in the skill's vision-qa.mjs, mirrored
gemini↔codex, self-test OK):
1. `--launch-arg` passthrough (repeatable) for headless throttle flags.
2. runFrames starvation-tolerant (bounded wait; 0 frames still fails; partial
   frames recorded as HARNESS-NOTE instead of hard failure).
3. scroll-into-view + declared settle BEFORE capture (locator.screenshot()
   previously auto-scrolled at capture time, photographing whileInView fades
   mid-tween — the "DEGENERATE: flat" ghost class).
4. new `capture:"viewport"` mode for very tall sections: full-element captures
   of 5000-10000px sections under dpr 3 exceed headless beyond-viewport
   rasterization (uniform-background captures); viewport captures at the
   scrolled position are harness-honest (probe: tmp/viewport-probe-*.png show
   full-opacity rendering of the same sections).
Results: 11/11 desktop + 11/11 iphone-emulation cases verified, zero
runtime/request/console errors (tmp/vision-qa-final2, tmp/vision-qa-tall-sections).
Every flagged AND unflagged image visually reviewed; desktop element captures
remain the composition record for tall sections.

### Notes
- M2 desktop header controls (~32px) intentionally remain compact: WCAG 2.5.8
  AA passes (≥24px), pointer input, consistent with desktop nav idioms.
- KaTeX "offenders" in overflow reports are overflow-x:auto equation
  containers (globals.css mjx-container rule) — correct responsive-math
  pattern, not inflation.
- Rule-1 disclosure: this session ran `rm -rf tmp/vision-qa-tall-sections`
  (debris of this session's own failed runner attempt minutes earlier; content
  fully recorded in the session job log). Flagged for the record.

## Comprehensive second-session pass (2026-08-28, independent reviewer)

Full end-to-end skill run on the current revision (build with focus trap).

### Interaction sweep (tmp/sweep-report.json, tmp/interaction-sweep.mjs)
- All 8 sections: 27/27 exercised range inputs changed value, 8/8 selects
  changed, checkbox toggle verified, preset pills clicked, zero dead controls
  (`dead=[]` per section).
- ZERO console errors / pageerrors / requestfailed across the entire sweep.
- HUD spot-checks: Intro f(m) live, InternalsLab LIVE INTERNALS live, G1
  honest-boundary copy present.
### Performance — P5 RETRACTED (was "sev 2: reconfigure main-thread freeze")
The earlier longtask-based numbers (max 2.63s / 16.1s) were **instrument
artifacts**, not site behavior. Three clean measurements settle it:
1. CDP CPU profile, single landscape switch (tmp/reconfigure-profile.mjs,
   tmp/profile-result.json): ~10ms real main-thread work; largest real entry
   10ms; window 96% idle.
2. CDP CPU profile, ALL five selects swept to heaviest options incl. 12D
   TS-fallback (tmp/heavy-selects-profile.mjs, tmp/heavy-profile-result.json):
   950ms program time TOTAL across all switches; largest app function 56ms
   (`step`), `projectTo3D` 9ms, `cmaes_viz_run` 5ms. No blocker exists.
3. Control: PerformanceObserver longtask on an IDLE page with zero
   interaction reports 12 "long tasks" totaling 47.7s incl. phantom 18.0s and
   26.0s entries — while the profiler shows the thread idle. Headless
   scheduler starvation is bundled into bogus longtask durations.
Lesson (matches §7b): never trust unattributed longtask durations in headless;
attribute with the CDP Profiler before acting. The reconfigure path needs no
fix; the Web-Worker/kernel-chunk options considered were solutions to a
nonexistent problem.

### Release-integrity evidence
OG/Twitter image routes under production runtime: HTTP 200, real PNGs
(1200×630 190KB; 1200×600 185KB).

### Landing the plane
Quality gates re-run green (lint/tsc/test/build). Committed: shortcuts-modal
focus trap (this session) + sibling kernel v055→v056 cutover (consumers +
README, treated per repo policy); pushed to origin.

### Honest-claims and release-checklist leg (same session, continued)
- WasmDemo canvas keyboard claim VERIFIED against pixels: canvas focusable,
  click-to-set pauses, static baseline confirmed, 3× ArrowRight changes the
  full-canvas render hash (580554→599070). The aria-label promise is wired
  (WasmDemo.tsx:805-837: tabIndex=0, onKeyDown, 0.2-domain-step + optimizer
  restart). (First probe false-negative: sampled center window while m₀ sat
  off-center — probe error, not site.)
- WASM Gallery toggle VERIFIED real: click loads iframe
  /wasm-demo/examples/viz-benchmarks.html, toggles back to native cleanly.
- Mount-gating lifecycle VERIFIED end-to-end: after a full scroll-through,
  wing/g1 canvases are unmounted (0 <canvas> in those sections; 14 elsewhere)
  — contexts release far offscreen by design. Earlier "backing store null"
  probes measured intentionally-unmounted regions.
- Resize crispness: 2D canvases use fixed backing stores (960px) supersampled
  at every supported CSS width via max-width:100% (globals.css guard present,
  Safari grid-track rationale documented); WebGL canvases DPR-track. No
  upscale path exists at supported sizes — no blur defect.
- copy-audit (--code, 62 files): one flag — 8 em-dashes/1275 words in
  CmaesInternalsLab.tsx. Adjudicated: deliberate technical-editorial voice,
  not slop (tool defers to human judgment). No action.
- OG/Twitter images reviewed visually: brand-consistent 1200×630/1200×600
  compositions, real trajectory render + legend, no clipping.
- RELEASE-CHECKLIST cross-walk: all applicable gates covered by evidence in
  this file; slow-network path N/A (static chunks, no runtime data fetch);
  background/foreground occlusion not emulatable in headless — covered by
  construction (rAF-driven loops stall when hidden; pollers bounded).
### Skill doctrine update
VERIFICATION.md §4 now carries the phantom-longtask caveat (idle page
reported 47.7s of "long tasks" incl. 18s/26s while CPU profile showed ~96%
idle); self-test OK; mirrored gemini↔codex.
