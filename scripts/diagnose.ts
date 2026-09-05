// Run after bun run build, or set BASE_URL to an already running app.
// HPO, owner admission, scene placement and arm readouts; not gait certification.
import assert from "node:assert/strict";
import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import {
  CmaesHyperparameterOptimizer,
  G1_TRAINING_HYPERPARAMETERS,
} from "../app/lib/cmaesHyperparameterLoop";
import { FRANKENSIM_OWNER_ARTIFACT } from "../app/lib/frankensimCmaes";
import type {
  G1OptimizationRequest,
  G1SceneReceipt,
} from "../app/lib/g1OptimizationProtocol";
import { iiwaJointAnglesFromOwnerPoses } from "../app/lib/armInverseKinematics";
import type { HouseholdRobotPose } from "../app/lib/frankensimCmaes";
import { encodePolicyFragment } from "../app/lib/g1PolicyShare";

type G1BrowserObservation = {
  requests: G1OptimizationRequest[];
  traces: {
    scene: G1SceneReceipt;
    family: string;
    generation: number;
    stopped?: boolean;
  }[];
  progress: number;
  comparisons: number;
};

const USER_AGENT = "OpenAI File Downloader, XaiImageApiFetch/1.0";
const pause = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
const log = (event: string, details: Record<string, unknown>) =>
  process.stdout.write(`${JSON.stringify({ event, ...details })}\n`);

async function run() {
  const port = process.env.PORT || "3312";
  const base = process.env.BASE_URL || `http://127.0.0.1:${port}`;
  const timeout = Number(process.env.READINESS_TIMEOUT_MS || "60000");
  assert(
    Number.isSafeInteger(timeout) && timeout > 0,
    "Invalid readiness timeout",
  );
  const root = process.env.RUN_DIR || "tmp/ui-smoke";
  await mkdir(root, { recursive: true });
  const out = await mkdtemp(join(root, "diagnose-"));
  const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const sourceStatus = execFileSync("git", ["status", "--short"], {
    encoding: "utf8",
  });
  const diff = execFileSync("git", ["diff", "HEAD", "--binary"], {
    maxBuffer: 32 * 1024 * 1024,
  });
  const sourceDiffSha256 = createHash("sha256").update(diff).digest("hex");
  const errors: { page: string; kind: string; message: string }[] = [];
  const results: unknown[] = [];
  let failure: string | null = null;
  let browser: Browser | undefined;
  let server: ChildProcess | undefined;
  let serverFailure: string | null = null;
  const serverLog = createWriteStream(join(out, "server.log"), { flags: "wx" });
  const observe = (page: Page) => {
    const record = (kind: string, message: string) =>
      errors.push({ page: page.url(), kind, message });
    page.on("pageerror", (error) => record("pageerror", error.message));
    page.on("console", (message) => {
      if (message.type() === "error") record("console", message.text());
    });
    page.on("requestfailed", (request) =>
      record(
        "requestfailed",
        `${request.url()}: ${request.failure()?.errorText}`,
      ),
    );
  };

  try {
    if (!process.env.BASE_URL) {
      server = spawn(
        "bun",
        ["run", "start", "--port", port, "--hostname", "127.0.0.1"],
        { stdio: ["ignore", "pipe", "pipe"] },
      );
      server.stdout?.pipe(serverLog, { end: false });
      server.stderr?.pipe(serverLog, { end: false });
      server.on("error", (error) => {
        serverFailure = error.message;
      });
      server.on("exit", (code, signal) => {
        serverFailure = `Server exited: ${code ?? signal}`;
      });
    }
    const deadline = Date.now() + timeout;
    let ready = false;
    let lastReadinessError = "No response";
    while (Date.now() < deadline) {
      if (serverFailure) throw new Error(serverFailure);
      try {
        const response = await fetch(base, {
          headers: { "User-Agent": USER_AGENT },
          signal: AbortSignal.timeout(
            Math.min(2000, Math.max(1, deadline - Date.now())),
          ),
        });
        ready = response.ok;
        lastReadinessError = `HTTP ${response.status}`;
        await response.body?.cancel();
        if (ready) break;
      } catch (error) {
        lastReadinessError = String(error);
      }
      await pause(Math.min(250, Math.max(0, deadline - Date.now())));
    }
    assert(ready, `App did not become ready: ${lastReadinessError}`);
    if (serverFailure) throw new Error(serverFailure);

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      userAgent: USER_AGENT,
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    observe(page);
    await page.goto(new URL("/#hpo", base).href);
    await page.waitForFunction(() => !!document.getElementById("hpo-trainer"));
    await page.waitForTimeout(1500);
    const anchor = await page.locator("#hpo").boundingBox();
    assert(
      anchor && anchor.y >= 0 && anchor.y <= 200,
      `HPO anchor misplaced: ${JSON.stringify(anchor)}`,
    );
    const section = page.locator("#hpo-trainer");
    for (const mirrored of [false, true]) {
      if (mirrored) await section.getByLabel(/Mirrored sampling/).check();
      await section
        .getByRole("button", { name: "Run 1 generation", exact: true })
        .click();
      await page.waitForFunction(() =>
        document
          .querySelector("#hpo-trainer")
          ?.textContent?.includes("Run 1 generation"),
      );
      const count = mirrored ? 16 : 8;
      assert(
        new RegExp(`Inner rollouts\\s+${count}\\b`, "i").test(
          await section.innerText(),
        ),
        "Wrong rollout count",
      );
      const rows = await section
        .getByTestId("hpo-best-param")
        .allTextContents();
      assert.equal(rows.length, 8);
      assert(
        rows.every((row) => !row.endsWith("-")),
        "Missing incumbent values",
      );
      await section
        .getByRole("button", { name: "Copy history", exact: true })
        .click();
      await section
        .getByRole("status")
        .filter({ hasText: "History copied." })
        .waitFor();
      const exported = JSON.parse(
        await page.evaluate(() => navigator.clipboard.readText()),
      );
      const expected = new CmaesHyperparameterOptimizer(
        G1_TRAINING_HYPERPARAMETERS,
        0x47315040,
        { mirroredSampling: mirrored },
      ).stepGeneration();
      assert.equal(exported.result.evaluationsCount, count);
      assert(
        Math.abs(exported.result.bestFitness - expected.bestFitness) < 1e-9,
        "Exported fitness differs from the evaluated search",
      );
      for (const [key, value] of Object.entries(expected.bestHyperparameters)) {
        assert(
          Math.abs(exported.result.bestHyperparameters[key] - value) < 1e-12,
          `Wrong incumbent ${key}`,
        );
      }
      results.push({
        journey: "hpo",
        mirrored,
        anchor,
        rows,
        exported,
        expected,
      });
    }
    await section.screenshot({ path: join(out, "hpo.png") });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    assert(
      await page.evaluate(() => scrollY < 50),
      "Hash target trapped navigation",
    );
    await page.evaluate(() => {
      location.hash = "no-gradients";
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      location.hash = "hpo";
    });
    await page.waitForTimeout(1000);
    const returned = await page.locator("#hpo").boundingBox();
    assert(
      returned && returned.y >= 0 && returned.y <= 200,
      "Hash navigation did not return to HPO",
    );
    await context.close();

    for (const width of [320, 390, 1440]) {
      const receiptPage = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
        userAgent: USER_AGENT,
      });
      observe(receiptPage);
      await receiptPage.goto(new URL("/receipts", base).href);
      await receiptPage
        .getByRole("heading", { name: "Physics receipts", exact: true })
        .waitFor();
      const evidence = await receiptPage.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        verified: document.body.innerText.includes("VERIFIED"),
        regions: [
          ...document.querySelectorAll<HTMLElement>("[role=region]"),
        ].map((element) => ({
          label: element.getAttribute("aria-label"),
          width: element.clientWidth,
          scrollWidth: element.scrollWidth,
          tabIndex: element.tabIndex,
        })),
      }));
      assert(
        evidence.scrollWidth <= width,
        "Receipt page overflows the viewport",
      );
      assert(!evidence.verified, "Editorial rubric claims verification");
      assert(
        evidence.regions.length >= 2 &&
          evidence.regions.every((region) => region.tabIndex === 0),
        "Receipt tables lack keyboard access",
      );
      await receiptPage
        .getByRole("region", { name: "Rubric scores, horizontally scrollable" })
        .focus();
      await receiptPage.keyboard.press("End");
      await receiptPage.keyboard.press("Home");
      await receiptPage.screenshot({
        path: join(out, `receipts-${width}.png`),
      });
      await receiptPage
        .getByRole("button")
        .filter({ hasText: "Featherstone Articulated Body Solver" })
        .click();
      await receiptPage
        .getByRole("link", {
          name: "app/lib/featherstoneDynamics.ts",
          exact: true,
        })
        .scrollIntoViewIfNeeded();
      await receiptPage.screenshot({
        path: join(out, `receipts-detail-${width}.png`),
      });
      results.push({ journey: "receipts", ...evidence });
      await receiptPage.close();
    }
    for (const changed of [
      null,
      "manifest.json",
      "fs_cmaes_viz_wasm.js",
      "fs_cmaes_viz_wasm_bg.wasm",
    ]) {
      const ownerContext = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        userAgent: USER_AGENT,
      });
      // Capture the real page's messages at the native-shell boundary.
      // This exercises the browser handler, not an iOS device or WebKit.
      await ownerContext.addInitScript(() => {
        const host = window as unknown as {
          __ownerBridgeMessages: Record<string, unknown>[];
          __g1Observation: G1BrowserObservation;
          webkit: {
            messageHandlers: {
              frankenrobots: {
                postMessage: (payload: Record<string, unknown>) => void;
              };
            };
          };
        };
        host.__ownerBridgeMessages = [];
        host.__g1Observation = {
          requests: [],
          traces: [],
          progress: 0,
          comparisons: 0,
        };
        // Observe unmodified messages on real workers. No owner output or
        // request is replaced; the gesture and buttons below drive the page.
        const nativePost = Worker.prototype.postMessage;
        const observedWorkers = new WeakSet<Worker>();
        Worker.prototype.postMessage = function (
          this: Worker,
          message: unknown,
          transferOrOptions?: Transferable[] | StructuredSerializeOptions,
        ) {
          const request = message as G1OptimizationRequest;
          if (
            request &&
            ["preview", "optimize", "stop", "replay", "compare"].includes(
              request.type,
            ) &&
            ["walking", "stepping", "balance"].includes(request.task)
          ) {
            host.__g1Observation.requests.push(structuredClone(request));
            if (!observedWorkers.has(this)) {
              observedWorkers.add(this);
              this.addEventListener("message", (event: MessageEvent) => {
                const reply = event.data;
                if (reply.type === "progress") host.__g1Observation.progress++;
                if (reply.type === "comparison" && reply.complete)
                  host.__g1Observation.comparisons++;
                if (reply.type === "trace" && reply.scene) {
                  host.__g1Observation.traces.push({
                    scene: reply.scene,
                    family: reply.family,
                    generation: reply.generation,
                    stopped: reply.stopped,
                  });
                }
              });
            }
          }
          return Reflect.apply(nativePost, this, [message, transferOrOptions]);
        };
        host.webkit = {
          messageHandlers: {
            frankenrobots: {
              postMessage: (payload) =>
                host.__ownerBridgeMessages.push(payload),
            },
          },
        };
      });
      let interventions = 0;
      if (changed) {
        await ownerContext.route(
          `**/wasm/fs-cmaes/v0622/${changed}`,
          async (route) => {
            const response = await route.fetch();
            assert(
              response.ok(),
              `Could not fetch owner ${changed} for intervention`,
            );
            let body = await response.body();
            if (changed === "manifest.json") {
              const manifest = JSON.parse(body.toString("utf8"));
              manifest.sourceRevision = "0".repeat(40);
              body = Buffer.from(JSON.stringify(manifest));
            } else {
              body[0] ^= 1;
            }
            interventions++;
            await route.fulfill({ response, body });
          },
        );
      }
      const ownerPage = await ownerContext.newPage();
      observe(ownerPage);
      await ownerPage.goto(new URL("/frankenrobots/humanoid", base).href);
      let evidence: string;
      let nativeRefusal: unknown = null;
      if (changed) {
        const expected =
          changed === "manifest.json"
            ? "published owner manifest does not match"
            : changed.endsWith(".js")
              ? "JavaScript SHA-256 mismatch"
              : "WASM SHA-256 mismatch";
        const alert = ownerPage
          .getByRole("alert")
          .filter({ hasText: expected });
        await alert.waitFor({ state: "visible", timeout: 60_000 });
        evidence = await alert.innerText();
        assert(interventions > 0, "No owner bytes were changed");
        assert(
          await ownerPage
            .getByRole("button", { name: "Start learning", exact: true })
            .isDisabled(),
        );
        assert.equal(
          await ownerPage.getByTestId("g1-owner-admission").count(),
          0,
        );
        const bridge = await ownerPage.evaluate(() => {
          const host = window as unknown as {
            __ownerBridgeMessages: Record<string, unknown>[];
            __frankenrobotsReceiveNativeCommand: (payload: unknown) => boolean;
          };
          const delivered = host.__frankenrobotsReceiveNativeCommand({
            type: "engine.command",
            schemaVersion: 1,
            commandId: "tampered-owner-start",
            lab: "humanoid",
            command: "optimize",
          });
          return { delivered, messages: host.__ownerBridgeMessages };
        });
        assert(bridge.delivered, "Native command never reached the handler");
        const latestMessages = bridge.messages.slice().reverse();
        const ack = latestMessages.find(
          (message) => message.type === "engine.command.ack",
        );
        assert.equal(
          ack?.accepted,
          false,
          "Native start admitted a foreign owner",
        );
        const state = latestMessages.find(
          (message) => message.type === "engine.status",
        );
        assert.equal(state?.state, "failed");
        assert(String(state?.detail).includes(expected));
        nativeRefusal = bridge;
      } else {
        const summary = ownerPage.getByText("Owner controller and source", {
          exact: true,
        });
        await summary.waitFor({ timeout: 60_000 });
        await summary.click();
        evidence = await ownerPage
          .getByTestId("g1-owner-admission")
          .innerText();
        assert.match(evidence, /29 physical actuators, 30 links/);
        assert.match(evidence, /15 learned rows and 14 reflex-controlled/);
        assert.match(
          evidence,
          /15 standing biases, 30 phase coefficients and 60 inertial-feedback/,
        );
        assert.match(evidence, /0\.323 to 0\.968 physical seconds/);
        assert(
          evidence.includes(
            FRANKENSIM_OWNER_ARTIFACT.sourceRevision.slice(0, 12),
          ),
        );
        await summary.click();
        await ownerPage.setViewportSize({ width: 1440, height: 1000 });
        await ownerPage
          .getByRole("button", {
            name: "Pause simulation playback",
            exact: true,
          })
          .click();
        await ownerPage
          .getByRole("button", {
            name: "Reset simulation to initial frame",
            exact: true,
          })
          .click();
        await ownerPage.evaluate(() =>
          window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
        );
        await ownerPage.waitForTimeout(1000);
        const sceneElement = ownerPage.locator("[data-g1-scene-digest]");
        const before = await sceneElement.getAttribute("data-g1-scene-digest");
        // Follow the actual projected handle, which moves with the camera.
        const handleLabel = ownerPage.getByText("Drag robot", { exact: true });
        // The follow camera keeps this marker moving by fractions of a pixel.
        // Scroll the real label into view without requiring a motionless 3D camera.
        await handleLabel.evaluate((element) =>
          element.scrollIntoView({ behavior: "instant", block: "center" }),
        );
        const handle = await handleLabel.boundingBox();
        assert(handle, "The robot placement handle is missing");
        const grab = {
          x: handle.x + handle.width / 2,
          y: handle.y + handle.height / 2,
        };
        assert(
          grab.x > 0 && grab.x < 1440 && grab.y > 0 && grab.y < 1000,
          `Placement handle is outside the viewport: ${JSON.stringify(grab)}`,
        );
        await ownerPage.mouse.move(grab.x, grab.y);
        await ownerPage.mouse.down();
        await ownerPage.mouse.move(grab.x + 58, grab.y + 40, { steps: 12 });
        assert.equal(
          await sceneElement.getAttribute("data-g1-scene-digest"),
          before,
          "Physical scene changed before placement was evaluated",
        );
        await ownerPage.mouse.up();
        await ownerPage.waitForFunction(
          (previous) =>
            document
              .querySelector("[data-g1-scene-digest]")
              ?.getAttribute("data-g1-scene-digest") !== previous,
          before,
          { timeout: 15_000 },
        );
        await ownerPage
          .getByRole("button", { name: "Start learning", exact: true })
          .click();
        await ownerPage.waitForFunction(
          () =>
            (window as unknown as { __g1Observation: G1BrowserObservation })
              .__g1Observation.progress > 0,
          null,
          { timeout: 30_000 },
        );
        await ownerPage
          .getByRole("button", { name: /^Stop · gen / })
          .press("Enter");
        await ownerPage.waitForFunction(
          () =>
            (
              window as unknown as { __g1Observation: G1BrowserObservation }
            ).__g1Observation.traces.some((trace) => trace.stopped),
          null,
          { timeout: 30_000 },
        );
        await ownerPage
          .getByRole("button", {
            name: "Run scalable-family race",
            exact: true,
          })
          .click();
        await ownerPage.waitForFunction(
          () =>
            (window as unknown as { __g1Observation: G1BrowserObservation })
              .__g1Observation.comparisons === 1,
          null,
          { timeout: 30_000 },
        );
        const observed = await ownerPage.evaluate(
          () =>
            (window as unknown as { __g1Observation: G1BrowserObservation })
              .__g1Observation,
        );
        const moved = observed.requests.find(
          (request) => request.type === "preview" && request.seat,
        );
        assert(moved?.seat, "No owner request followed the visible drag");
        for (const type of ["optimize", "stop", "compare"]) {
          const request = observed.requests.find(
            (request) => request.type === type,
          );
          assert.deepEqual(
            request?.seat,
            moved.seat,
            `${type} used a different placement`,
          );
        }
        const stopped = observed.traces.find((trace) => trace.stopped);
        assert(
          stopped && stopped.generation > 0,
          "No real optimized replay followed Stop",
        );
        assert.deepEqual(stopped.scene.seat, moved.seat);
        assert.notEqual(stopped.scene.digest, before);
        assert.equal(
          await sceneElement.getAttribute("data-g1-scene-digest"),
          stopped.scene.digest,
        );
        const downloadPromise = ownerPage.waitForEvent("download");
        await ownerPage
          .getByRole("button", { name: "Export Telemetry", exact: true })
          .click();
        await (
          await downloadPromise
        ).saveAs(join(out, "g1-moved-seat-telemetry.json"));
        results.push({
          journey: "g1-drag-start-stop-compare",
          before,
          observed,
        });
        await ownerPage.evaluate(() => window.scrollTo(0, 0));
      }
      await ownerPage.screenshot({
        path: join(out, `owner-${changed ?? "valid"}.png`),
      });
      results.push({
        journey: "owner-artifact-admission",
        changed,
        interventions,
        evidence,
        nativeRefusal,
        artifact: FRANKENSIM_OWNER_ARTIFACT,
      });
      await ownerContext.close();
    }
    const armContext = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      userAgent: USER_AGENT,
    });
    const armPage = await armContext.newPage();
    observe(armPage);
    await armPage.goto(new URL("/frankenrobots/arm", base).href);
    for (const [label, task, placed, bodyCount] of [
      ["Mug", "kitchen-mug", true, 27],
      ["Remote", "living-room-remote", true, 26],
      ["Trowel", "backyard-trowel", false, 30],
    ] as const) {
      await armPage.getByRole("tab", { name: new RegExp(`^${label}`) }).click();
      await armPage.waitForFunction(() => {
        const slider = document.querySelector<HTMLInputElement>(
          'input[aria-label="Arm trace position"]',
        );
        return slider && Number(slider.value) > 0;
      });
      await armPage
        .getByRole("button", { name: "Restart arm trace", exact: true })
        .click();
      const downloadPromise = armPage.waitForEvent("download");
      await armPage
        .getByRole("button", { name: "Export Telemetry", exact: true })
        .click();
      const telemetryPath = join(out, `arm-${task}-telemetry.json`);
      await (await downloadPromise).saveAs(telemetryPath);
      const telemetry = await Bun.file(telemetryPath).json();
      assert.equal(telemetry.task, task);
      assert.equal(
        telemetry.placed,
        placed,
        `${task} benchmark outcome changed`,
      );
      assert.equal(
        telemetry.ownerAdmission.scene.extraObstacleCount,
        bodyCount,
      );
      const measuredReadouts = [];
      for (const sampleIndex of [0, telemetry.samples.length - 1, 0]) {
        if (measuredReadouts.length > 0) {
          await armPage
            .getByRole("slider", { name: "Arm trace position", exact: true })
            .press(sampleIndex === 0 ? "Home" : "End");
        }
        await armPage.waitForFunction((expectedIndex) => {
          const slider = document.querySelector<HTMLInputElement>(
            'input[aria-label="Arm trace position"]',
          );
          return slider && Number(slider.value) === expectedIndex;
        }, sampleIndex);
        await armPage
          .getByRole("button", { name: "Play arm trace", exact: true })
          .waitFor();
        const poses = telemetry.samples[sampleIndex].linkPoses.map(
          (pose: { quaternion: HouseholdRobotPose["quaternionWxyz"] }) => ({
            quaternionWxyz: pose.quaternion,
          }),
        );
        const angles = iiwaJointAnglesFromOwnerPoses(poses);
        for (const [index, name] of [
          "A1 Base",
          "A2 Shoulder",
          "A3 Arm",
          "A4 Elbow",
          "A5 Wrist 1",
          "A6 Wrist 2",
          "A7 Flange",
        ].entries()) {
          const card = armPage
            .getByText(name, { exact: true })
            .locator("..")
            .locator("..");
          const degrees = (angles[index] * 180) / Math.PI;
          const expected = `${degrees >= 0 ? "+" : ""}${degrees.toFixed(1)}°`;
          const actual = await card.innerText();
          assert(
            actual.includes(expected),
            `${name} at sample ${sampleIndex}: expected ${expected}, saw ${actual}`,
          );
        }
        measuredReadouts.push({ sampleIndex, angles });
      }
      await armPage
        .getByText("iiwa joint angles · measured owner poses", { exact: true })
        .scrollIntoViewIfNeeded();
      await armPage.screenshot({
        path: join(out, `arm-${task}-joint-readout.png`),
      });
      results.push({
        journey: "arm-owner-joint-readout",
        task,
        placed,
        bodyCount,
        measuredReadouts,
        telemetryPath,
      });
    }
    await armContext.close();
    const invalidArmContext = await browser.newContext({
      userAgent: USER_AGENT,
    });
    const invalidArmPage = await invalidArmContext.newPage();
    observe(invalidArmPage);
    // Structurally valid shared coefficients with unsupported task metadata
    // must be refused before that metadata reaches the task selector.
    const invalidArmFragment = await encodePolicyFragment(
      new Float64Array(128),
      {
        kernelVersion: FRANKENSIM_OWNER_ARTIFACT.kernelVersion,
        task: "walking",
        challenge: "household",
        family: "lm-ma",
        generation: 1,
        sigma: 0.001,
      },
    );
    await invalidArmPage.goto(
      new URL(`/frankenrobots/arm#zpolicy=${invalidArmFragment}`, base).href,
    );
    await invalidArmPage
      .getByText("This shared policy is not for a supported household task.", {
        exact: true,
      })
      .waitFor();
    assert.equal(
      await invalidArmPage
        .getByRole("tab", { name: /^Mug/ })
        .getAttribute("aria-selected"),
      "true",
    );
    results.push({ journey: "arm-unsupported-shared-task", refused: true });
    await invalidArmContext.close();
    assert.deepEqual(errors, [], "Browser errors occurred");
    log("browser-journeys-passed", { out, journeys: results.length });
  } catch (error) {
    failure =
      error instanceof Error ? error.stack || error.message : String(error);
    process.exitCode = 1;
    log("browser-journeys-failed", { out, failure });
  } finally {
    try {
      await browser?.close();
    } catch (error) {
      failure = [failure, `Browser cleanup failed: ${String(error)}`]
        .filter(Boolean)
        .join("\n");
      process.exitCode = 1;
    }
    if (server && server.exitCode === null && server.signalCode === null) {
      server.kill("SIGTERM");
      await Promise.race([
        new Promise<void>((resolve) => server?.once("exit", () => resolve())),
        pause(3000),
      ]);
      if (server.exitCode === null && server.signalCode === null)
        server.kill("SIGKILL");
    }
    serverLog.end();
    await writeFile(
      join(out, "results.json"),
      JSON.stringify(
        {
          sourceCommit,
          sourceStatus,
          sourceDiffSha256,
          base,
          failure,
          errors,
          results,
          scope:
            "Browser HPO, receipts, owner byte/source admission, G1 placement-aware learning and arm joint readouts/share rejection; excludes gait certification, device performance and independent algorithm verification",
        },
        null,
        2,
      ),
    );
  }
}

run().catch((error) => {
  process.exitCode = 1;
  log("diagnostic-setup-failed", { message: String(error) });
});
