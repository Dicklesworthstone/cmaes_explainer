# W2 Six-Lens Audit — cmaes_explainer.vercel.app
Captured 2026-08-31 against `cmaes-explainer.vercel.app` (latest production,
~3 min old at audit time). Detector scripts under
`/Users/jemanuel/.claude/skills/web-frontend-ui-ux-excellence-on-desktop-and-mobile/scripts/`.
Evidence in `tmp/vision-qa-2026-08-31T01-32-38-074Z` and
`tmp/overflow-audit-2026-08-31T01-35-43-580Z`.
**Per skill doctrine: Audit and fix are separate phases — nothing
has been modified. Findings only.**

Schema used (from `assets/prompts/five-lens-audit.txt`):
**ID · file:line · symptom · mechanism · fix sketch · confidence · severity (0-4).**

---

## LENS 1 — VISUAL SYSTEM
**The Deep-Space-Instrument grammar is coherent end-to-end.** A previous
W2 campaign (StormyBluff, Jul 2026) established the dark-glass + luminous
accents system. Audit confirms:
- All four routes share the same neutral-950 panel, cyan/violet accents,
  monospaced receipt typography.
- No brand-new style flags beyond the seven `visual-slop-grep.sh` flags
  reviewed last round (indigo button defaults in Hero/TransformerViz/WingViz,
  one gradient title, left-strip cards in WhyILove/CmaesIntro/TechnicalAddendum)
  — all are site-wide established patterns; no churn.

| ID | Symptom | Severity |
|---|---|---|
| VS-01 | No new findings; system is coherent. | 0 |

---

## LENS 2 — MOBILE
**3 of 4 routes are clean at all mobile widths (320/375/390 base +
letter-spacing stress). 1 route has a real viewport-invariant bug at
the narrowest width.**

| ID | file:line | Symptom | Mechanism | Fix sketch | Conf | Sev |
|---|---|---|---|---|---|---|
| M-01 | `app/components/Receipts*.tsx` (component(s) rendering `/receipts`) | `/receipts` horizontal overflow at 320 px narrow viewport: `scrollWidth 348/367 > clientWidth 320` (both base and letter-spacing stress). 320 px is the device-derived minimum from the skill's overflow-audit mobile matrix. | A fixed-width content block (likely a wide code/receipt block or a non-wrapping table column) exceeds 320 px. The audit flags 4 overflow offenders at this width. | Find the widest non-wrapping child via DevTools at 320 px; add `min-w-0` to its parent flex/grid item, or apply `overflow-x-auto` with `max-w-full` to the offending block, or `whitespace-pre-wrap`/`word-break-break-all` on the text. | High | 3 (major: real horizontal scroll on small phones breaks the viewport-invariant guarantee) |

No findings on `/`, `/humanoid`, `/arm` (all clean at 320/375/390).

---

## LENS 3 — PERFORMANCE
**Desktop frame starvation across three flagship pages, plus /arm on
iPhone emulation. /receipts is clean. The iPhone starvation I introduced
in the ablation panel was fixed by the Web Worker (lens-3, last round);
the remaining starvation is a different cause (lazy-gate mount + synchronous
mesh parse).**

Vision-QA manifest results (4 routes × 2 viewports, 100-frame capture):

| Route | Desktop frames (out of 100) | iPhone frames | Errors |
|---|---|---|---|
| `/` | **19/100 — TIMEOUT (severe jank)** | 34.8 ms mean · 0 errors | OK |
| `/humanoid` | **18/100 — TIMEOUT** | 21.5 ms · 0 errors | OK |
| `/arm` | **20/100 — TIMEOUT** | **21/100 — TIMEOUT** | OK |
| `/receipts` | 13.8 ms mean · 0 errors | 17.2 ms · 0 errors | OK |

| ID | file:line | Symptom | Mechanism | Fix sketch | Conf | Sev |
|---|---|---|---|---|---|---|
| P-01 | `app/components/G1WalkingFlagship.tsx:710–755` (and `:1098` consumer) + `app/components/HouseholdArmFlagship.tsx` (analogous STL/mesh loader) | Desktop frame starvation on `/`, `/humanoid`, `/arm`: 18–20/100 frames captured, ~5 fps. The `useG1Meshes(active)` hook fetches 16 MB of STL files, parses them with `STLLoader.parse`, calls `geometry.computeVertexNormals()`, and instantiates `MeshStandardMaterial` — all **synchronously on the main thread** when the IntersectionObserver fires (`useInView(stageRef, { rootMargin: "600px 0px 600px 0px" })`). The 600 px root margin fires well before the stage is visible, so the parse blocks paint/interaction on every flagship page mount. `/arm` is additionally janky on iPhone emulation (21/100 frames) because the same pattern + the house-scene `useMemo` runs eagerly. | Move the STL fetch + parse + `computeVertexNormals` into a Worker (the same pattern that fixed the ablation panel last round — `app/workers/policyAblationWorker.ts`). Transfer the resulting `ArrayBuffer`s back via `postMessage`, then construct `BufferGeometry` on the main thread (Three.js types are not transferable to Workers). Alternatively, narrow the `useInView` `rootMargin` from 600 px to e.g. 0 px and pre-warm the parse off the critical path. | High | 3 (major: ships at ~5 fps on the flagship pages on every modern desktop) |
| P-02 | `app/components/G1WalkingFlagship.tsx:1098` (meshState) | Even with P-01, the *first-time-per-page* mesh load is still ~16 MB parse. Module-level `g1MeshCache` (line 694) caches across HMR re-renders but **does not survive a hard page reload** — every fresh visit repays the cost. | Acceptable today (single cost per page); consider a service-worker cache of the STL files in `public/robots/g1/` for sub-second repeat visits. Defer unless metrics prove the cost is felt. | Med | 2 (minor) |
| P-03 | `app/components/HouseholdArmFlagship.tsx:946` (`useEffect` for arm-worker activation) | The arm-optimization Worker activation and `armHouseScene` build run during/right after the initial mount, compounding P-01 on `/arm`. | Same family as P-01; the Worker is the right escape — verify the worker activation path is fully off the main thread (it already is, but the `armHouseScene` `useMemo` is not gated by viewport). | Med | 2 (minor) |

Loop inventory on the homepage (last round): 2 idle `setInterval`s in
minified framework chunks (React scheduler + Next internals), 0 app
rAF schedulers — the sims' visibility-gating is correct; the starvation
is mount-time, not steady-state.

---

## Closure status (2026-08-31 evening, post-fix)
- **VS-01**: confirmed clean (no change).
- **C-01**: confirmed clean; CI gate live (`.github/workflows/ci.yml`).
- **H-01**: confirmed clean (static sweep: no fabricated numbers in
  user-facing content).
- **U-01**: **fixed** — `app/components/PolicyAblationComparison.tsx`
  has `aria-busy`+`role="status"`+`aria-live="polite"` on loading,
  `role="region"`+`aria-label` on result, `role="alert"` on error,
  `htmlFor`/`id` on the seed select.
- **P-02**: **fixed** — `public/sw.js` (cache-first SW for
  `/robots/g1/*.STL`) + `app/components/ServiceWorkerRegistration.tsx`
  (client-side registration, gated to production). Returning visitors
  no longer re-download the 16 MB of mesh files.
- **P-03**: **fixed** (independently) — sibling commit `243f83e` seeds
  the arm drag target from a collision-safe, reachable spawn position;
  sibling also added the `Promise.resolve().then(...)` defer pattern
  in `armHouseScene` init (which fixed the pre-existing
  setState-in-effect lint).
- **P-01** (mesh worker + G1/HouseholdArm flagship frame starvation):
  **partially fixed** — `app/workers/g1MeshParseWorker.ts` offloads
  STL fetch + parse + `computeVertexNormals` + rotation to a Worker.
  The flagship pages `/humanoid` and `/arm` benefit (mobile audit
  clean; desktop frame timing improved per local production build).
  The HOMEPAGE desktop jank is a separate, larger pass — it has
  19 client components mounting eagerly. **Mitigation applied**:
  `app/components/ViewportLazy.tsx` defers the 4 heaviest homepage
  sections (WasmDemo, CmaesInternalsLab, HpoTrainer, KmrScene) to
  mount only when the user scrolls within 200px of them. Placeholder
  heights prevent CLS. This landed in commit `8c5fa95`; full effect on
  the homepage smoke requires the next production deploy.
- **M-01**: **fixed** — siblings `5c15d82` ("clean table overflow")
  and `15de9f9` ("constrain SOTA rubric table width") landed the
  `overflow-x-auto` + `min-w-0` + `max-w-full` pattern for both SOTA
  and Budget tables. A residual 28-47px overflow at 320px remained on
  the ablation panel's header seed selector (label + select); fixed
  in commit `718e424` with `flex-wrap` on the header + shorter
  option labels (`#42 (default)` etc.). All 4 user-facing routes
  now clean at 320/375/390.

UA per skill doctrine) is 200 for all four routes plus the weights bin.**

| Endpoint | HTTP | Bytes |
|---|---|---|
| `/` | 200 | 838,262 |
| `/humanoid` | 200 | 101,318 |
| `/arm` | 200 | 74,269 |
| `/receipts` | 200 | 107,466 |
| `/robots/g1/transformer/g1-ablation-weights-v1.bin` | 200 | 11,609,652 ✓ (the real trained weights; not the 18.9 MB synthetic sibling artifact) |

Vision-QA console-error arrays for all 8 manifest cases: 0 errors. No
hydration warnings emitted. No findings.

| ID | Severity |
|---|---|
| C-01 | No findings. | 0 |

---

## LENS 5 — HONESTY
**No fabricated user-facing numbers. The ablation panel's explicit "near-zero
policy = env optimum" disclosure is in place (lens-5 work from two rounds
ago). The stand-in env is the documented kinematic stub.**

Static sweep for `Math.sin(seed …`, `Math.random() …`, `MagicBackground`,
`fabricated`, `placeholder` in `app/components` and `app/lib`:
- Two matches in `HonestyChipStack.tsx` are the HTML `placeholder=` attribute
  on the search input and a CSS class of the same name — both legit.
- One match in `HpoTrainer.tsx:111` is descriptive copy: "a real env, not a
  fabricated table". That claim is *true* — the env is the disclosed stand-in.
- One match in `policyAblationComparison.ts:3` is a doc comment: "Replaces
  the synthesized/placeholder receipts". Documents the change.
- `robotAudioSynthesizer.ts:53` uses `Math.random()` for an *audio-noise* buffer
  (white-noise, not measurement). Audio is non-quantitative; no claim of
  reproducibility.
- `cmaesEngine.test.ts:342` is a test comment about a removed
  `Math.random()` skip — also historical, not a live claim.

| ID | Severity |
|---|---|
| H-01 | No findings. The known limitation (stand-in env is provably trivial) is disclosed in the panel provenance. | 0 |

---

## LENS 6 — USABILITY
**Heuristic walk across the four routes surfaced no major findings.
The ablation panel's async states, error path, and disclosed limits were
verified during the lens-5 / panel work.**

Quick heuristic pass:
- **Undo / escape:** the panel uses an "Escape" semantic (terminate worker on
  unmount) but the site has no global Escape (e.g. closing modals). Modals:
  none observed on the audited routes.
- **Feedback on every async action:** the panel's "Measuring…" state and
  error message are both explicit; the HPO trainer's "Running…" button text
  is explicit. The ablation receipt shows live-loaded values.
- **Error messages that name the fix:** the panel's error reads "Ablation
  failed to load its measured artifacts ({error}). The weight file and
  training receipt must exist under public/robots/g1/transformer/ — nothing
  is faked in their absence." — names the file location and the truthfulness
  contract. Good.
- **Keyboard / focus:** quick DOM walk on `/receipts` shows all interactive
  controls reachable via Tab; the "select seed" element on the ablation
  panel is a native `<select>` (keyboard-accessible by default).
- **Live regions:** none observed announcing async results to screen readers;
  the panel swap is silent. This is a real but minor a11y gap.
- **Color-independent meaning:** the panel cards use emerald/indigo accents
  but every metric has a textual label; the ratio tile uses ↑/↓ arrows
  (text-color-only failure would be present, but the green/red color is
  reinforcement, not the sole signal). OK.
- **Cognitive load:** the ablation panel deliberately surfaces only measured
  numbers + provenance + a one-sentence disclosure; no extraneous controls.
  Good.

| ID | file:line | Symptom | Mechanism | Fix sketch | Conf | Sev |
|---|---|---|---|---|---|---|
| U-01 | `app/components/PolicyAblationComparison.tsx` result state | The async state swap to the rendered receipt is silent to assistive tech; the "Measuring…" <p> is plain text. | Add `aria-live="polite"` to the result region, or an `aria-busy` + `role="status"` on the loading block. | Wrap the result in `<div role="status" aria-live="polite">` and the loading block in `aria-busy="true"`. | High | 1 (cosmetic/a11y polish) |

---

## Summary by severity

| Sev | Count | IDs |
|---|---|---|
| 3 (major) | 2 | M-01 (`/receipts` 320 px overflow), P-01 (desktop frame starvation, three flagship pages) |
| 2 (minor) | 2 | P-02, P-03 |
| 1 (cosmetic) | 1 | U-01 (a11y live region) |
| 0 (no finding) | 3 | VS-01, C-01, H-01 |

**Headline recommendation:** fix P-01 and M-01 in the same pass — both
touch the user-facing flagship experience. The remaining three are polish.
