# FrankenRobots

Universal iPhone, iPad, and Mac Catalyst laboratory for the Humanoid and Arm flagships.

## Generate the engine and Xcode project

```bash
cd /Users/jemanuel/projects/cmaes_explainer
./ios/prepare-engine.sh
cd ios
xcodegen generate
open FrankenRobots.xcodeproj
```

The production export is bundled under `Engine/` and served only over an ephemeral `127.0.0.1` port. The local response supplies the cross-origin isolation headers required by the worker/WASM pipeline. The app rejects non-loopback WebView navigation; explicit external documentation links open through the system.

If the app shows **Engine bundle needs attention**, rerun `prepare-engine.sh` and rebuild. `Engine/source-commit.txt` records which source commit produced the bundled runtime.

See `docs/FRANKENROBOTS_APP_PLAN.md` for the product, bridge, offline, platform, and release gates.
