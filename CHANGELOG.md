# Changelog

All notable changes to the CMA-ES Explainer site are documented here.

This project has no formal releases or tags. Changes are organized chronologically
and grouped by capability area within each date. Every commit hash links to its
GitHub page at `https://github.com/Dicklesworthstone/cmaes_explainer/commit/<hash>`.

---

## 2026-02-21 -- Licensing Update and Social Preview

### Licensing

- Replaced the plain MIT license with an MIT + OpenAI/Anthropic Rider that restricts
  use by OpenAI, Anthropic, and their affiliates without express written permission
  from Jeffrey Emanuel
  ([9c845d8](https://github.com/Dicklesworthstone/cmaes_explainer/commit/9c845d87e3abbfbe9402b873d28f677fa2907ee1))

### Repository Meta

- Added a 1280x640 GitHub social preview image for consistent link previews when
  sharing the repository URL on social media
  ([a1cbe1d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/a1cbe1d3391c3c8f4ae6590049d07f90eb152946))

---

## 2026-01-21 -- Initial MIT License

### Licensing

- Added MIT License (Copyright (c) 2026 Jeffrey Emanuel)
  ([fa930f0](https://github.com/Dicklesworthstone/cmaes_explainer/commit/fa930f0a0ee761d7a790516269621fed0d6a6165))

---

## 2026-01-18 -- Dependency Updates and Agent Documentation

### Dependencies

- Updated all Node.js dependencies to latest stable versions (next, react,
  @types/react, tailwindcss, and others); changes documented in UPGRADE_LOG.md
  ([43b4c03](https://github.com/Dicklesworthstone/cmaes_explainer/commit/43b4c03eae3e5fe6d845eb521c56e04112d26f2e))

### Documentation

- Expanded AGENTS.md with full project context, component inventory, architectural
  notes, and agent collaboration guidelines
  ([d6c50ee](https://github.com/Dicklesworthstone/cmaes_explainer/commit/d6c50ee4a5152195b39e7920fe2fad87fd6b44f3))

---

## 2026-01-09 -- WASM Submodule Update

### WASM Demo

- Updated `vendor/wasm_cmaes` submodule to commit 22e3ceb, pulling in rebuilt
  WASM packages with improved README
  ([161380f](https://github.com/Dicklesworthstone/cmaes_explainer/commit/161380f98a0dd48d92cba7be88fb8660e003acf5))

---

## 2025-12-29 -- React Server Components CVE Fix

### Security

- **PR #1** (authored by Vercel bot): Patched critical React Server Components
  CVE vulnerabilities by upgrading next, react-server-dom-webpack,
  react-server-dom-parcel, and react-server-dom-turbopack to their fixed versions
  ([63d6d4b](https://github.com/Dicklesworthstone/cmaes_explainer/commit/63d6d4b72bc48698cc2d3b8045034c617ed66b4d),
  [28f01b8](https://github.com/Dicklesworthstone/cmaes_explainer/commit/28f01b822d8bd64205f6677214111547100c40a9))

---

## 2025-12-07 -- SSR Stabilization and Build Cleanup

### SSR and Build Infrastructure

- Major SSR compatibility overhaul: fixed hydration mismatches in Three.js
  components via dynamic imports; added `useMediaQuery` and improved
  `usePrefersReducedMotion` hooks for client-side detection; created
  `ThreePatch.tsx` and `safeR3FEvents.ts` for R3F event patching
  ([599ad5d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/599ad5dfe23718ac9a59383f31781baf1888b2df))

### WASM Demo Cleanup

- Removed ~8,000 lines of dead legacy WASM demo files (app.js, enhanced-app.js,
  tailwind.css, four benchmark HTML variants, test files) that had accumulated
  from earlier iteration cycles
  ([599ad5d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/599ad5dfe23718ac9a59383f31781baf1888b2df))

### Deployment

- Added `.vercelignore` and `.ubsignore` for deployment optimization; updated
  `next.config.mjs` with improved build settings; updated eslint config
  ([599ad5d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/599ad5dfe23718ac9a59383f31781baf1888b2df))

---

## 2025-11-23 -- OrbitControls SSR Crash Fixes

### Bug Fixes: Three.js SSR

- Used `next/dynamic` with `ssr: false` for `CovarianceScene`, completely
  bypassing server rendering for the Three.js Canvas component and preventing
  OrbitControls from attempting to connect during SSR
  ([c3e48ab](https://github.com/Dicklesworthstone/cmaes_explainer/commit/c3e48abea103186ae6414ef43c6cf769462f06f3))

- Removed `makeDefault` from OrbitControls and added placeholder `<div>` elements
  for SSR fallback rendering in BridgeViz and CovarianceScene
  ([9ea0914](https://github.com/Dicklesworthstone/cmaes_explainer/commit/9ea0914a1a3a02ae8df40b7bbbc2677c1cae3a76))

### Bug Fixes: WASM Demo DOM Access

- Wrapped all top-level DOM access in WASM demo `app.js` inside a
  `DOMContentLoaded` listener; root cause was that OrbitControls.connect() and
  50+ `mustGet()` calls were executing during module parse before any DOM
  elements existed
  ([3d0022e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/3d0022ec84b221c54e8f5962f26f9243d077141d))

---

## 2025-11-22 -- Initial Build-out

This date encompasses the complete construction of the interactive CMA-ES
explainer site, from initial scaffold through full feature set. The project
went from zero to 50+ commits in a single day. Commits are grouped by
capability rather than chronological order.

### Foundation and Scaffold

- **Initial commit**: Next.js 16 + React 19 scaffold with Bun as sole runtime;
  created 13 core components (Hero, CmaesIntro, CovarianceScene, Navbar, Footer,
  Section, WingWalkthrough, NoGradientExamples, OpenSourceEngines,
  TechnicalAddendum, WasmDemo, MathProvider); added deployment scripts
  (`bootstrap_and_deploy.sh`, `pull_wasm_demo.sh`); configured Tailwind, PostCSS,
  TypeScript, ESLint, and Vercel; included full site content as markdown reference
  ([80fc737](https://github.com/Dicklesworthstone/cmaes_explainer/commit/80fc73792e999d0903c580f9bafef0a10a2af1e1))

- Locked the toolchain exclusively to Bun; tuned the build stack and PostCSS
  configuration
  ([5c86b03](https://github.com/Dicklesworthstone/cmaes_explainer/commit/5c86b03d5940d778e76dd43053f44028a623a2b2))

- Added HeadlessUI dependency for the encode/decode playground component
  ([9d8d91a](https://github.com/Dicklesworthstone/cmaes_explainer/commit/9d8d91ab2c9ce0097d104e3ca3397dacb20a0a4e))

### Interactive 3D Visualizations

- **Wing, Bridge, and Transformer visuals**: Created `WingViz`, `BridgeViz`, and
  `TransformerViz` components -- three interactive 3D scenes built with Three.js
  and React Three Fiber, each demonstrating CMA-ES optimization applied to a
  real-world engineering domain (airfoil design, structural truss optimization,
  transformer hyperparameter tuning)
  ([928c9e4](https://github.com/Dicklesworthstone/cmaes_explainer/commit/928c9e484616196690a899667d54c57f07883ad5))

- **Major 3D visual upgrade**: Rewrote ~1,700 lines across all three 3D
  interactives, adding realistic physics simulation, FEA-style stress coloring
  with heatmap gradients, and cyberpunk visual aesthetics
  ([b8555bc](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b8555bc6131f72f635c5718641323cf638aec628))

- **Hyperparam manifold heatmap**: Extended TransformerViz with an interactive
  loss-landscape visualization over hyperparameter space
  ([fc64b60](https://github.com/Dicklesworthstone/cmaes_explainer/commit/fc64b6095a8bc062c7944ba8c637b40e640151fd))

- **Mobile haptics**: Added touch interactivity and haptic feedback to
  TransformerViz for mobile users
  ([2cbf1c5](https://github.com/Dicklesworthstone/cmaes_explainer/commit/2cbf1c57536c9b5bea48f5f4c7abfdd2501ae14e))

- Optimized CovarianceScene geometry reuse to reduce Three.js allocations
  ([27ccad4](https://github.com/Dicklesworthstone/cmaes_explainer/commit/27ccad40030f2e48d4fd3b9b1f8dcbc2b2b25315))

### Interactive 2D Visualizations and Demos

- **Covariance evolution minimap**: Canvas-based minimap with natural-gradient
  arrow overlay showing how the covariance matrix evolves across optimization
  steps
  ([dffbed3](https://github.com/Dicklesworthstone/cmaes_explainer/commit/dffbed37cb7a84892fa545badd2bf297455586d6))

- **Noise vs. lambda explorer**: Interactive slider comparing noise levels and
  population sizes with rank-stability visualization
  ([96a1d1d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/96a1d1d18f668289e716c91477d7024ccabcd114))

- **Constraint repair demo**: Side-by-side comparison of clip, reflect, and
  logit-transform repair strategies with animated particles
  ([ca3424f](https://github.com/Dicklesworthstone/cmaes_explainer/commit/ca3424f8a0259011c68798434a693a2ae4f21b4e))

- **Active vs. passive covariance demo**: Animated visualization comparing active
  and passive CMA covariance adaptation strategies
  ([bf09e67](https://github.com/Dicklesworthstone/cmaes_explainer/commit/bf09e677ec3e88641fb5d2e233c62f3bb07753ae))

- **Restart strategy viewer**: IPOP vs. BIPOP restart strategy comparison with
  population-size graphs
  ([7abf518](https://github.com/Dicklesworthstone/cmaes_explainer/commit/7abf518158bc14dfbb67598586458e6c0a4f5ec4))

- **CA pattern gallery**: Cellular automaton pattern gallery with CMA-ES
  optimization trace overlay
  ([7596654](https://github.com/Dicklesworthstone/cmaes_explainer/commit/759665439e8dc5f559965d0c7f55bc86d233b938))

- **Encode/decode playground**: Interactive UI for exploring constraint
  encoding/decoding strategies, integrated into the practical playbook section
  ([ae4a9b2](https://github.com/Dicklesworthstone/cmaes_explainer/commit/ae4a9b277c1e0619c15ff9d7afd2cae54467da6b))

### Design System and UI/UX

- **Design system overhaul**: Overhauled globals.css and tailwind.config.ts with
  premium typography scale, noise-texture backgrounds, and glassmorphism utility
  classes
  ([b25cc1e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b25cc1e242d13d580d56c4725fcd18e5738f642c))

- **Navigation rewrite**: Reimplemented the Navbar with glass-morphism styling,
  desktop header with scroll-aware behavior, and a mobile floating dock
  ([1f0838f](https://github.com/Dicklesworthstone/cmaes_explainer/commit/1f0838fd204481f4c097813c04834dab0f5958ed))

- **Lenis smooth scroll and typography**: Integrated Lenis smooth scrolling via
  a new `SmoothScroll.tsx` component; added Stripe-inspired typography and mobile
  layout optimizations; added `vendor/wasm_cmaes` submodule
  ([b2cdcd6](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b2cdcd6c1586df85e3060e8583d0e99ea1344005))

- **Component polish pass**: Applied formatting consistency across all 20 UI
  components
  ([3b650a8](https://github.com/Dicklesworthstone/cmaes_explainer/commit/3b650a8d55fad5e2b07d09e49627f0b40d1c7152))

- Lighter background treatment and scannable example cards in Hero and
  NoGradientExamples
  ([364904d](https://github.com/Dicklesworthstone/cmaes_explainer/commit/364904d9736dad42a9c13a0f5eedd5b567b713b5))

### Accessibility and Mobile

- Stabilized home page UI; added `BackToTop` component, `useScrollSpy` hook,
  and `usePrefersReducedMotion` hook; improved mobile readability and a11y
  affordances for users who prefer reduced motion
  ([ef7dfd5](https://github.com/Dicklesworthstone/cmaes_explainer/commit/ef7dfd59631b49d0dd6ae677190640c9929d708b))

- Enhanced constraint repair demo toggle controls and visual polish
  ([7a60ebf](https://github.com/Dicklesworthstone/cmaes_explainer/commit/7a60ebfc84015a65cd333ca182762f7d6196230e))

### Content and Narrative

- Added CMA-ES history section, practical guidance narratives, and deep learning
  hybrid content; introduced new components CommunitySplit, DLHybrids,
  PracticalPlaybook, and WhyILove; expanded CmaesIntro, Hero, and
  TechnicalAddendum with additional narrative
  ([f7778cc](https://github.com/Dicklesworthstone/cmaes_explainer/commit/f7778cc1e1c127a47f052ac70a155f36b22f4654))

- Expanded open-source engine descriptions and WASM demo explanatory copy
  ([6ec25ab](https://github.com/Dicklesworthstone/cmaes_explainer/commit/6ec25ab5a753599367e925029c1d6271d7a0910f))

- Added cellular automaton vignette and JEPA overlap callout in DLHybrids and
  CommunitySplit
  ([4c5f3f0](https://github.com/Dicklesworthstone/cmaes_explainer/commit/4c5f3f0f97179c15ee742b161616c8536301f59c))

- Copy polish passes: tightened tone and removed em-dashes across CmaesIntro,
  NoGradientExamples, TechnicalAddendum, WingWalkthrough, Footer, and Hero
  ([76bed23](https://github.com/Dicklesworthstone/cmaes_explainer/commit/76bed2329d872d59474bb5365545bbf860184e89),
  [d28ad40](https://github.com/Dicklesworthstone/cmaes_explainer/commit/d28ad4045113ea3d296a7614ad31aa46ad5fdc17))

### WASM Demo Integration

- Included pre-built WASM demo assets (app.js, benchmark HTML variants, tailwind
  CSS, parallel/sequential WASM packages) for instant deployment without
  requiring a local Rust toolchain
  ([44e7489](https://github.com/Dicklesworthstone/cmaes_explainer/commit/44e7489e4a4ff31c1a370c774a157a7d99f06731))

- Unified benchmark visualization into a single canonical `viz-benchmarks.html`
  and merged `app.js`, deleting four legacy HTML variants
  ([a1cead2](https://github.com/Dicklesworthstone/cmaes_explainer/commit/a1cead2705d8b7e52a7045a10fd5e985b0ccce65))

- Resolved duplicate code and event listener conflicts in WASM demo `app.js`
  ([53399fc](https://github.com/Dicklesworthstone/cmaes_explainer/commit/53399fc67d049dce02443c6370386827a710ffee))

- Added enhanced-app.js and multiple benchmark HTML variants (classic, enhanced,
  working) alongside component updates; these were later consolidated and cleaned
  up
  ([8885d4e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/8885d4e9198609eebcbe2a23c121194bf3a9560a))

### SSR and Hydration Fixes

- Prevented browser crashes and hydration mismatches in all Four Three.js Canvas
  components (BridgeViz, CovarianceScene, TransformerViz, WingViz) by adding
  `useState`/`useEffect` mounted-state guards that render `null` on the server
  and first client render
  ([b157f85](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b157f85ee49434b7cb1464197e4255c4ef657a88))

- Deferred Monaco editor initialization in the WASM demo iframe to prevent
  DOM-access-before-ready crashes; wrapped init in `DOMContentLoaded` handler
  ([cb514d2](https://github.com/Dicklesworthstone/cmaes_explainer/commit/cb514d27e75805e0b30e4a3637fdc3a78b4e5964))

- Temporarily disabled WASM iframe demo to debug browser crashes, then
  immediately reverted once the root cause was identified elsewhere
  ([e1b3d5e](https://github.com/Dicklesworthstone/cmaes_explainer/commit/e1b3d5e4aa6db2269951d8ac4a17a191d3ac5a35),
  [8c3de13](https://github.com/Dicklesworthstone/cmaes_explainer/commit/8c3de134f40ed52438a89b48d1a24df055a098a4))

- Fixed runtime errors in TransformerViz and WingViz; added
  `usePrefersReducedMotion` fallback; updated build script
  ([a1f9ac3](https://github.com/Dicklesworthstone/cmaes_explainer/commit/a1f9ac39e4ffbda19ce0d357f7335a96c7d76b84))

- Updated visualization geometry in TransformerViz and WingViz; added favicon
  and grid-pattern static assets
  ([31b8280](https://github.com/Dicklesworthstone/cmaes_explainer/commit/31b82807668fee511a5bcf0da4b5f241161dbe0b))

### Bug Fixes: CA Gallery ImageData

Five sequential commits that fixed progressive TypeScript and cross-browser
compatibility issues in the CA pattern gallery's canvas pixel rendering:

- Fixed `ImageData` constructor call
  ([492ce56](https://github.com/Dicklesworthstone/cmaes_explainer/commit/492ce5645f7aa70079e17c1fbf1c6956fb9c7c55))
- Fixed `ImageData` buffer handling for typed array compatibility
  ([122fd05](https://github.com/Dicklesworthstone/cmaes_explainer/commit/122fd050923a6a0ed9b2119d4bc021d762acb26c))
- Tightened `ImageData.set()` call signature
  ([ad08859](https://github.com/Dicklesworthstone/cmaes_explainer/commit/ad08859fec877a77b9f352357d53f0cf393a6ab4))
- Added type cast for `ImageData.set()` in CA gallery
  ([9e79895](https://github.com/Dicklesworthstone/cmaes_explainer/commit/9e79895435377881ca3eb173414e2fe53ed29418))
- Fixed canvas ref setter callback in CA gallery
  ([b68a072](https://github.com/Dicklesworthstone/cmaes_explainer/commit/b68a07269d5edeb292700607de8623e8c202c8ea))

### Bug Fixes: Other

- Added missing `useEffect` import for the manifold heatmap in TransformerViz
  ([5e338ed](https://github.com/Dicklesworthstone/cmaes_explainer/commit/5e338ed2d89b57002714223494b687ab214bf2dd))
- Fixed type annotations in constraint repair demo
  ([000333f](https://github.com/Dicklesworthstone/cmaes_explainer/commit/000333f2a1add378f31f9b61cc19df51e73f04ac))
- Fixed missing `Shuffle` icon import in constraint repair demo
  ([3b5c10c](https://github.com/Dicklesworthstone/cmaes_explainer/commit/3b5c10cf64b1e4133a767a16187865877b766f64))

---

## Project Overview

| Attribute | Value |
|---|---|
| Stack | Next.js 16, React 19, Tailwind CSS, Framer Motion, Three.js / React Three Fiber, MathJax, Bun |
| Repository | [Dicklesworthstone/cmaes_explainer](https://github.com/Dicklesworthstone/cmaes_explainer) |
| Deployment | Vercel |
| Tags / Releases | None (all changes shipped directly on `main`) |
| Total commits | 57 |
| First commit | 2025-11-22 |
| Latest commit | 2026-02-21 |
