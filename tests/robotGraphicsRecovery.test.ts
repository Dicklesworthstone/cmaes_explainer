import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  RobotGraphicsRecoveryNotice,
  RobotStageRecovery,
  watchRobotGraphics,
} from "../app/components/RobotStageRecovery";

describe("robot graphics recovery", () => {
  test("observes a creation failure once without cancelling browser diagnostics", () => {
    const stage = new EventTarget();
    const failures: string[] = [];
    const detach = watchRobotGraphics(stage, (failure) => failures.push(failure));
    const failure = new Event("webglcontextcreationerror", { cancelable: true });
    stage.dispatchEvent(failure);
    stage.dispatchEvent(new Event("webglcontextcreationerror"));
    stage.dispatchEvent(new Event("webglcontextlost"));
    expect(failures).toEqual(["creation"]);
    expect(failure.defaultPrevented).toBe(false);
    detach();
  });

  test("retry re-arms the stage, and disposed listeners cannot affect a new attempt", () => {
    const stage = new EventTarget();
    const failures: string[] = [];
    const detach = watchRobotGraphics(stage, (failure) => failures.push(`first:${failure}`));
    stage.dispatchEvent(new Event("webglcontextlost"));
    detach();
    stage.dispatchEvent(new Event("webglcontextcreationerror"));
    expect(failures).toEqual(["first:lost"]);
    const detachRetry = watchRobotGraphics(stage, (failure) => failures.push(`retry:${failure}`));
    stage.dispatchEvent(new Event("webglcontextlost"));
    expect(failures).toEqual(["first:lost", "retry:lost"]);
    detachRetry();
  });

  test("unmount before failure removes both listeners and one stage does not affect another", () => {
    const first = new EventTarget();
    const second = new EventTarget();
    const failures: string[] = [];
    const detachFirst = watchRobotGraphics(first, (failure) => failures.push(`first:${failure}`));
    const detachSecond = watchRobotGraphics(second, (failure) => failures.push(`second:${failure}`));
    detachFirst();
    first.dispatchEvent(new Event("webglcontextcreationerror"));
    first.dispatchEvent(new Event("webglcontextlost"));
    second.dispatchEvent(new Event("unrelated-error"));
    expect(failures).toEqual([]);
    second.dispatchEvent(new Event("webglcontextcreationerror"));
    expect(failures).toEqual(["second:creation"]);
    detachSecond();
  });

  test("healthy stage renders its real children without a recovery prompt", () => {
    const child = createElement("div", { "data-stage-content": "intact" }, "Stage content");
    const html = renderToStaticMarkup(createElement(RobotStageRecovery, null, child));
    expect(html).toContain('data-stage-content="intact"');
    expect(html).not.toContain("Retry 3D view");
  });

  test("all failure notices offer accessible stage-only recovery and saving advice", () => {
    for (const failure of ["creation", "lost", "scene"] as const) {
      const html = renderToStaticMarkup(createElement(RobotGraphicsRecoveryNotice, {
        failure,
        onRetry: () => {},
      }));
      expect(html).toContain('role="alert"');
      expect(html).toContain('type="button"');
      expect(html).toContain("min-h-11");
      expect(html).toContain("Retry 3D view");
      expect(html).toContain("Retrying only restarts the view");
      expect(html).toContain("save your policy below");
    }
  });
});
