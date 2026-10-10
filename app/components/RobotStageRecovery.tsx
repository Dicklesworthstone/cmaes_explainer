"use client";

import { Component, Fragment, type ReactNode } from "react";

type GraphicsFailure = "creation" | "lost" | "scene";

// WebGL creation/loss events do not bubble. Listen in the capture phase on
// this stage only, not window: another lab's failure must not reset this one.
// Latch the first failure until the user retries, avoiding a remount loop.
export function watchRobotGraphics(
  target: EventTarget,
  onFailure: (failure: GraphicsFailure) => void,
): () => void {
  let active = true;
  const fail = (event: Event) => {
    if (!active) return;
    active = false;
    onFailure(event.type === "webglcontextlost" ? "lost" : "creation");
  };
  target.addEventListener("webglcontextcreationerror", fail, true);
  target.addEventListener("webglcontextlost", fail, true);
  return () => {
    active = false;
    target.removeEventListener("webglcontextcreationerror", fail, true);
    target.removeEventListener("webglcontextlost", fail, true);
  };
}

export function RobotGraphicsRecoveryNotice({
  failure,
  onRetry,
}: {
  failure: GraphicsFailure;
  onRetry: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/95 p-4 text-slate-100">
      <div role="alert" className="my-auto max-w-sm space-y-3 rounded-2xl border border-amber-300/30 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold">3D view interrupted</h3>
        <p className="text-sm leading-relaxed text-slate-300">
          {failure === "creation"
            ? "The graphics system could not start the 3D view."
            : failure === "lost"
              ? "The graphics connection was lost."
              : "The 3D scene could not be displayed."}{" "}
          Your experiment and learning controls remain available below. Retrying only restarts the view.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 w-full rounded-xl bg-amber-300 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
        >
          Retry 3D view
        </button>
        <p className="text-xs leading-relaxed text-slate-400">
          If it still cannot start, save your policy below before reopening the app or browser.
        </p>
      </div>
    </div>
  );
}

// Keep this boundary BELOW each flagship's experiment/worker state. A failed
// renderer must not unmount the owner, Stop button, policy export or settings.
export class RobotStageRecovery extends Component<
  { children: ReactNode },
  { failure: GraphicsFailure | null; attempt: number }
> {
  state: { failure: GraphicsFailure | null; attempt: number } = { failure: null, attempt: 0 };
  private detachGraphics: (() => void) | undefined;
  private host: HTMLDivElement | null = null;

  static getDerivedStateFromError() {
    return { failure: "scene" as const };
  }

  private watch = () => {
    this.detachGraphics?.();
    if (this.host) {
      this.detachGraphics = watchRobotGraphics(this.host, (failure) => this.setState({ failure }));
    }
  };

  private attachHost = (host: HTMLDivElement | null) => {
    this.detachGraphics?.();
    this.host = host;
    if (host) this.watch();
  };

  private retry = () => {
    // Re-arm before mounting the replacement Canvas so its first failure is
    // observable too. No navigation/reload, worker reset or storage mutation.
    this.watch();
    this.setState(({ attempt }) => ({ failure: null, attempt: attempt + 1 }));
  };

  componentWillUnmount() {
    this.detachGraphics?.();
  }

  render() {
    return (
      <div ref={this.attachHost} className="relative h-full w-full" data-robot-stage-recovery>
        {this.state.failure ? (
          <RobotGraphicsRecoveryNotice failure={this.state.failure} onRetry={this.retry} />
        ) : (
          <Fragment key={this.state.attempt}>{this.props.children}</Fragment>
        )}
      </div>
    );
  }
}
